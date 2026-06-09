import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ANTHROPIC_KEY        = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function buildProposalPrompt(
  briefing: Record<string, string>,
  sections: { category: string; title: string; content: string; data: Record<string, unknown> }[],
  clientName: string,
): string {
  const sectionsText = sections.map(s =>
    `## ${s.title}\n${s.content}\n${JSON.stringify(s.data)}`
  ).join('\n\n');

  return `Você é o consultor sênior da ATom's gerando uma proposta comercial.
Com base no diagnóstico abaixo, crie uma proposta de valor detalhada e personalizada.

CLIENTE: ${clientName}
SEGMENTO: ${briefing.segment ?? 'não informado'}
DESAFIO PRINCIPAL: ${briefing.main_challenge ?? 'não informado'}

DIAGNÓSTICO REALIZADO:
${sectionsText}

━━━ FORMATO DA PROPOSTA ━━━
Retorne SOMENTE um JSON válido com esta estrutura exata:

{
  "summary": "<2-3 frases resumindo o diagnóstico e por que a ATom's é a solução certa>",
  "scope_items": [
    {"title": "<entregável 1>", "description": "<detalhe do que está incluído>"},
    {"title": "<entregável 2>", "description": "<detalhe>"},
    {"title": "<entregável 3>", "description": "<detalhe>"}
  ],
  "investment_min": <valor mínimo em reais, inteiro, sem centavos>,
  "investment_max": <valor máximo em reais, inteiro, sem centavos>,
  "investment_label": "<ex: R$ 4.800 – R$ 7.200>",
  "timeline_weeks": <número inteiro de semanas>,
  "timeline_label": "<ex: 6–8 semanas>",
  "differentials": [
    "<diferencial 1 da ATom's>",
    "<diferencial 2>",
    "<diferencial 3>"
  ],
  "next_steps": [
    "<próximo passo 1 após aceite>",
    "<próximo passo 2>",
    "<próximo passo 3>"
  ]
}

Regras para o valor:
- Base em complexidade do diagnóstico e tamanho aparente da empresa
- Startups/pequenos: R$ 2.800–6.500
- PMEs estruturadas: R$ 5.500–14.000
- Médias/grandes: R$ 12.000–35.000
- Sempre ofereça uma faixa (min–max), nunca valor único
- Seja honesto: não subestime nem superfature

Retorne APENAS o JSON, sem markdown, sem texto antes ou depois.`.trim();
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

    // Load lead info
    const { data: lead } = await supabase
      .from('leads')
      .select('name, company_name, segment')
      .eq('id', session.lead_id)
      .single();

    // Load dossie sections
    const { data: sections } = await supabase
      .from('dossie_sections')
      .select('category, title, content, data')
      .eq('lead_id', session.lead_id)
      .order('created_at', { ascending: true });

    if (!sections || sections.length === 0) {
      return json({ error: 'Diagnóstico ainda não foi gerado' }, 400);
    }

    // Check if proposal already exists
    const { data: existing } = await supabase
      .from('proposals')
      .select('id, status')
      .eq('session_id', session_id)
      .maybeSingle();

    if (existing && existing.status !== 'rejected') {
      return json({ error: 'Proposta já existe para esta sessão', proposal_id: existing.id }, 409);
    }

    // Call Claude to generate proposal
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 2000,
        system: buildProposalPrompt(
          session.briefing_data ?? {},
          sections,
          lead?.company_name ?? lead?.name ?? 'Cliente',
        ),
        messages: [{ role: 'user', content: 'Gere a proposta comercial.' }],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error('[CLAUDE propose]', err.slice(0, 200));
      return json({ error: 'Claude error' }, 502);
    }

    const claudeData = await anthropicRes.json();
    const rawText = (claudeData?.content?.[0]?.text ?? '').trim();

    let proposal: Record<string, unknown>;
    try {
      proposal = JSON.parse(rawText);
    } catch {
      console.error('[PARSE PROPOSAL]', rawText.slice(0, 300));
      return json({ error: 'Falha ao parsear proposta do Claude' }, 500);
    }

    // Insert proposal
    const { data: inserted, error: insertErr } = await supabase
      .from('proposals')
      .insert({
        session_id,
        lead_id:           session.lead_id,
        summary:           String(proposal.summary ?? ''),
        scope_items:       proposal.scope_items ?? [],
        investment_min:    Number(proposal.investment_min ?? 0),
        investment_max:    Number(proposal.investment_max ?? 0),
        investment_label:  String(proposal.investment_label ?? ''),
        timeline_weeks:    Number(proposal.timeline_weeks ?? 0),
        timeline_label:    String(proposal.timeline_label ?? ''),
        differentials:     proposal.differentials ?? [],
        next_steps:        proposal.next_steps ?? [],
        status:            'pending_approval',
      })
      .select('id')
      .single();

    if (insertErr) return json({ error: insertErr.message }, 500);

    // Update session flow
    await supabase
      .from('consultoria_sessions')
      .update({ flow_step: 'proposal' })
      .eq('id', session_id);

    return json({ proposal_id: inserted.id, status: 'pending_approval', proposal });

  } catch (e) {
    console.error('[atom-propose]', e);
    return json({ error: 'Internal error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
