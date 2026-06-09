import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ANTHROPIC_KEY        = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, x-session-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function buildDiagnosisPrompt(
  briefing: Record<string, string>,
  messages: { role: string; content: string }[],
): string {
  const history = messages
    .map(m => `${m.role === 'agent' ? 'ÁTOM' : 'Cliente'}: ${m.content}`)
    .join('\n');

  return `Você é ÁTOM, consultor estratégico da ATom's.
Com base no briefing e na conversa abaixo, gere um diagnóstico completo e estruturado.

BRIEFING DO CLIENTE:
Empresa: ${briefing.company_name ?? 'não informado'}
Segmento: ${briefing.segment ?? 'não informado'}
Maior desafio: ${briefing.main_challenge ?? 'não informado'}
O que já tentou: ${briefing.already_tried ?? 'não informado'}

CONVERSA DE QUALIFICAÇÃO:
${history || 'Sem histórico de conversa.'}

━━━ INSTRUÇÕES DE OUTPUT ━━━
Gere exatamente 4 seções, cada uma delimitada conforme abaixo.
Cada seção deve ter conteúdo rico, denso e específico para o segmento do cliente.
Tom: consultor estratégico experiente, não coach motivacional.
Linguagem: português brasileiro, frases curtas e assertivas.

[SECTION:market_analysis]
{"title":"Análise de Mercado","content":"<análise detalhada do segmento, tendências, o que grandes players fazem, tamanho do mercado>","data":{"oportunidade_score":<0-100>,"tendencias":["<t1>","<t2>","<t3>"],"players_referencia":["<p1>","<p2>"]}}
[/SECTION]

[SECTION:brand_audit]
{"title":"Diagnóstico de Marca","content":"<análise de posicionamento, comunicação, presença digital, gaps identificados>","data":{"score_atual":<0-100>,"gaps":["<g1>","<g2>","<g3>"],"prioridades":["<pr1>","<pr2>"]}}
[/SECTION]

[SECTION:opportunities]
{"title":"Oportunidades Identificadas","content":"<3 oportunidades específicas com potencial de impacto e como explorar cada uma>","data":{"alavancas":[{"titulo":"<t>","impacto":"<alto|medio|baixo>","prazo":"<imediato|30d|90d>"},{"titulo":"<t>","impacto":"<>","prazo":"<>"},{"titulo":"<t>","impacto":"<>","prazo":"<>"}]}}
[/SECTION]

[SECTION:action_plan]
{"title":"Plano de Ação","content":"<plano em 3 sprints com ações específicas, responsáveis e métricas de sucesso>","data":{"sprints":[{"nome":"Sprint 1 — 30 dias","acoes":["<a1>","<a2>","<a3>"]},{"nome":"Sprint 2 — 60 dias","acoes":["<a1>","<a2>"]},{"nome":"Sprint 3 — 90 dias","acoes":["<a1>","<a2>"]}],"kpis":["<kpi1>","<kpi2>","<kpi3>"]}}
[/SECTION]

Gere as 4 seções em sequência, sem texto antes ou depois dos delimitadores.`.trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { session_id, session_token } = await req.json();

    if (!session_id || !session_token) return json({ error: 'session_id e session_token obrigatórios' }, 400);

    // Verify token
    const { data: session, error: sessErr } = await supabase
      .from('consultoria_sessions')
      .select('id, lead_id, briefing_data, session_token')
      .eq('id', session_id)
      .eq('session_token', session_token)
      .single();

    if (sessErr || !session) return json({ error: 'Sessão inválida' }, 403);

    // Mark as generating
    await supabase
      .from('consultoria_sessions')
      .update({ diagnosis_status: 'generating', flow_step: 'diagnosis' })
      .eq('id', session_id);

    // Load chat history
    const { data: messages } = await supabase
      .from('consultoria_messages')
      .select('role, content')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true });

    // Call Claude with streaming
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 8000,
        stream: true,
        system: buildDiagnosisPrompt(session.briefing_data ?? {}, messages ?? []),
        messages: [{ role: 'user', content: 'Gere o diagnóstico completo agora.' }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error('[CLAUDE]', err.slice(0, 200));
      await supabase.from('consultoria_sessions').update({ diagnosis_status: 'failed' }).eq('id', session_id);
      return json({ error: 'Claude error' }, 502);
    }

    // Stream-through to client + parse sections as they complete
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      const reader = anthropicRes.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      const persistedSections = new Set<string>();

      const sectionRx = /\[SECTION:(\w+)\]([\s\S]*?)\[\/SECTION\]/g;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          // Forward raw SSE to client
          await writer.write(encoder.encode(chunk));

          // Parse completed sections and persist
          for (const m of accumulated.matchAll(sectionRx)) {
            const [, category, rawJson] = m;
            if (persistedSections.has(category)) continue;
            persistedSections.add(category);

            try {
              const parsed = JSON.parse(rawJson.trim());
              await supabase.from('dossie_sections').insert({
                lead_id:      session.lead_id,
                category,
                title:        parsed.title ?? category,
                content:      parsed.content ?? '',
                data:         parsed.data ?? {},
                generated_by: 'ia',
                model_used:   'claude-opus-4-8',
              });
            } catch (e) {
              console.error('[PARSE SECTION]', category, e);
            }
          }
        }

        // Mark done
        await supabase
          .from('consultoria_sessions')
          .update({ diagnosis_status: 'done', flow_step: 'proposal' })
          .eq('id', session_id);

      } catch (e) {
        console.error('[STREAM]', e);
        await supabase.from('consultoria_sessions').update({ diagnosis_status: 'failed' }).eq('id', session_id);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        ...cors,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });

  } catch (e) {
    console.error('[atom-diagnose]', e);
    return json({ error: 'Internal error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
