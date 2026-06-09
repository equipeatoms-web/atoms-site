import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const GEMINI_API_KEY       = Deno.env.get('GEMINI_API_KEY') ?? '';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── System prompt base do ÁTOM ──────────────────────────────────────────────

function buildSystemPrompt(etapa: number, setor: string, gargalo: string): string {
  return `
Você é ÁTOM, consultor estratégico da ATom's.
Tom: racional, sofisticado, direto. Sócio estratégico — não chatbot de suporte.
Linguagem: português brasileiro. Frases curtas e densas.
Nunca use: "Claro!", "Ótima pergunta!", emojis, frases motivacionais.
Máximo 2 perguntas por turno.

Etapa atual da consultoria: ${etapa}/5
Setor identificado: ${setor || 'ainda não identificado'}
Gargalo principal: ${gargalo || 'ainda não identificado'}

━━━ FLUXO DE DIAGNÓSTICO ━━━
Etapa 1 — Abertura: pergunte se já tem negócio estruturado, está começando, quer descobrir o que vender, ou está mal posicionado.
Etapa 2 — Análise de mercado: com base no setor, apresente tendências, o que grandes players fazem, oportunidades de diferenciação.
Etapa 3 — Diagnóstico operacional: identifique fricções, dependências humanas, custo oculto. Máx 3 perguntas cirúrgicas.
Etapa 4 — Posicionamento: apresente 2-3 caminhos estratégicos com prós/contras e custo estimado reais.
Etapa 5 — Recomendação: entregue plano em 3 prioridades. Pergunte se quer aprofundar algum ponto.

━━━ FORMATO DE INSIGHTS ━━━
Quando identificar algo relevante para o diagnóstico, inclua no FINAL da resposta (após o texto conversacional):

[INSIGHT]
category: brand|posicionamento|stack|logo|operacao|mercado|geral
title: Título curto do insight
body: Corpo explicativo em 2-3 linhas densas
tags: tag1,tag2,tag3
[/INSIGHT]

━━━ FORMATO DE SLIDES ━━━
Quando fizer análise de mercado (etapa 2) ou apresentar brand concept, inclua no FINAL:

[SLIDE]
type: market_analysis|brand_concept|logo_audit|positioning
title: Título do slide
body: Conteúdo principal do slide (pode ter múltiplas linhas)
image_prompt: Prompt em inglês para gerar 3 imagens representativas via Gemini Imagen
[/SLIDE]

Regra: insights e slides ficam SEMPRE ao final, após o texto da resposta. Nunca intercale com o texto.
`.trim();
}

// ─── Parsers de blocos ────────────────────────────────────────────────────────

interface InsightBlock {
  category: string;
  title: string;
  body: string;
  tags: string[];
}

interface SlideBlock {
  type: string;
  title: string;
  body: string;
  image_prompt: string;
}

function parseBlocks(text: string): {
  cleanText: string;
  insights: InsightBlock[];
  slides: SlideBlock[];
} {
  const insights: InsightBlock[] = [];
  const slides: SlideBlock[] = [];

  // Extract [INSIGHT] blocks
  const insightRx = /\[INSIGHT\]([\s\S]*?)\[\/INSIGHT\]/gi;
  let cleanText = text.replace(insightRx, (_, block) => {
    const get = (key: string) =>
      (block.match(new RegExp(`${key}:\\s*(.+)`, 'i'))?.[1] ?? '').trim();
    insights.push({
      category: get('category') || 'geral',
      title:    get('title'),
      body:     get('body'),
      tags:     get('tags').split(',').map(t => t.trim()).filter(Boolean),
    });
    return '';
  });

  // Extract [SLIDE] blocks
  const slideRx = /\[SLIDE\]([\s\S]*?)\[\/SLIDE\]/gi;
  cleanText = cleanText.replace(slideRx, (_, block) => {
    const get = (key: string) =>
      (block.match(new RegExp(`${key}:\\s*(.+)`, 'i'))?.[1] ?? '').trim();
    const bodyMatch = block.match(/body:\s*([\s\S]*?)(?=image_prompt:|$)/i);
    slides.push({
      type:         get('type') || 'market_analysis',
      title:        get('title'),
      body:         bodyMatch?.[1]?.trim() ?? get('body'),
      image_prompt: get('image_prompt'),
    });
    return '';
  });

  // Strip any incomplete/unclosed blocks the model may have emitted
  cleanText = cleanText
    .replace(/\[SLIDE\][\s\S]*/gi, '')
    .replace(/\[INSIGHT\][\s\S]*/gi, '')
    .replace(/\[\/SLIDE\]/gi, '')
    .replace(/\[\/INSIGHT\]/gi, '')
    .trim();

  return { cleanText, insights, slides };
}

// ─── Persistência ─────────────────────────────────────────────────────────────

async function persistTurn(
  supabase: ReturnType<typeof createClient>,
  sessionId: string,
  userMsg: string,
  agentMsg: string,
  insights: InsightBlock[],
  slideHtml: string | null,
) {
  // Messages
  await supabase.from('consultoria_messages').insert([
    { session_id: sessionId, role: 'user',  content: userMsg },
    { session_id: sessionId, role: 'agent', content: agentMsg },
  ]);

  // Insights
  if (insights.length) {
    await supabase.from('consultoria_insights').insert(
      insights.map(i => ({
        session_id: sessionId,
        category:   i.category,
        title:      i.title,
        body:       i.body,
        tags:       i.tags,
        slide_html: slideHtml,
      }))
    );
  }

  // Update session timestamp
  await supabase
    .from('consultoria_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId);
}

// ─── Guided mode prompt ───────────────────────────────────────────────────────

function buildGuidedPrompt(
  turn: number,
  total: number,
  briefing: Record<string, string>,
): string {
  const QUESTIONS = [
    { q: 'Qual é o faturamento aproximado do negócio hoje?', ctx: 'entender o porte financeiro' },
    { q: 'Quantas pessoas trabalham na operação?', ctx: 'entender o tamanho da equipe' },
    { q: 'Como está a presença digital — redes sociais, site, WhatsApp?', ctx: 'mapear canais digitais' },
    { q: 'Qual é o principal canal que traz clientes hoje?', ctx: 'identificar dependência de canal' },
    { q: 'Qual é o maior gargalo operacional — captação, retenção, processos ou posicionamento?', ctx: 'identificar o gargalo central' },
    { q: 'Já tentou alguma solução para isso? O que funcionou ou não funcionou?', ctx: 'entender histórico de tentativas' },
  ];

  const currentQ = QUESTIONS[Math.min(turn - 1, QUESTIONS.length - 1)];

  return `Você é ÁTOM, consultor estratégico da ATom's. Está conduzindo uma qualificação estruturada.
Tom: direto, profissional, sem floreios. Máximo 3 linhas de resposta por turno.
Nunca use: emojis, "Claro!", "Ótima pergunta!", frases motivacionais.
Linguagem: português brasileiro.

CONTEXTO DO CLIENTE:
Empresa: ${briefing.company_name ?? 'não informado'}
Segmento: ${briefing.segment ?? 'não informado'}
Desafio: ${briefing.main_challenge ?? 'não informado'}
Já tentou: ${briefing.already_tried ?? 'não informado'}

ETAPA: Pergunta ${turn} de ${total}
OBJETIVO DESTA PERGUNTA: ${currentQ?.ctx ?? 'qualificação'}

INSTRUÇÃO: Receba a resposta do cliente com brevidade (1-2 frases de acknowledgment focado).
Depois faça a próxima pergunta de qualificação de forma natural e direta.
${turn >= total ? 'Esta é a última pergunta. Encerre com: "Perfeito. Tenho o suficiente para gerar seu diagnóstico completo."' : ''}`.trim();
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, content-type, apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const authHeader = req.headers.get('authorization') ?? '';
    const supabase   = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const body = await req.json();
    const {
      message,
      sessionId,
      session_token,
      etapa = 1,
      setor = '',
      gargalo = '',
      history = [],
      guided_mode = false,
    } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'message é obrigatório' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    // Resolve session context
    let resolvedSessionId = sessionId ?? '';
    let briefingData: Record<string, string> = {};
    let chatTurnCount = 0;

    if (session_token) {
      // Public flow: find session by token
      const { data: pubSession } = await supabase
        .from('consultoria_sessions')
        .select('id, briefing_data, chat_turn_count')
        .eq('session_token', session_token)
        .single();
      if (pubSession) {
        resolvedSessionId = pubSession.id;
        briefingData = pubSession.briefing_data ?? {};
        chatTurnCount = pubSession.chat_turn_count ?? 0;
      }
    } else if (sessionId && authHeader.startsWith('Bearer ') && authHeader.length > 100) {
      // Authenticated client route
      const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
      const anonClient = createClient(SUPABASE_URL, ANON_KEY, {
        global: { headers: { authorization: authHeader } },
      });
      const { data: { user } } = await anonClient.auth.getUser();
      if (user) {
        const { data: session } = await supabase
          .from('consultoria_sessions')
          .select('id, client_id')
          .eq('id', sessionId)
          .single();
        if (session && session.client_id !== user.id) {
          return new Response(JSON.stringify({ error: 'Session not found' }), {
            status: 404, headers: { ...cors, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // Increment turn count for guided mode
    const newTurnCount = chatTurnCount + 1;
    const GUIDED_TOTAL_TURNS = 6;
    const chat_complete = guided_mode && newTurnCount >= GUIDED_TOTAL_TURNS;

    if (session_token && resolvedSessionId) {
      await supabase
        .from('consultoria_sessions')
        .update({
          chat_turn_count: newTurnCount,
          ...(chat_complete ? { flow_step: 'diagnosis' } : {}),
        })
        .eq('id', resolvedSessionId);
    }

    // Build system prompt — guided mode overrides base prompt
    const systemPromptText = guided_mode
      ? buildGuidedPrompt(newTurnCount, GUIDED_TOTAL_TURNS, briefingData)
      : buildSystemPrompt(etapa, setor, gargalo);

    // Build Gemini contents from history + current message
    const contents = [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role === 'agent' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    // Call Gemini
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPromptText }],
        },
        contents,
        generationConfig: {
          temperature: 0.55,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('[GEMINI]', err.slice(0, 300));
      return new Response(JSON.stringify({ error: 'LLM error' }), {
        status: 502, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const geminiData = await geminiRes.json();
    const rawReply: string = (geminiData?.candidates?.[0]?.content?.parts ?? [])
      .map((p: { text?: string }) => p.text ?? '')
      .join('')
      .trim();

    const { cleanText, insights, slides } = parseBlocks(rawReply);

    // Persist turn only when a sessionId is provided
    if (sessionId) {
      const slideHtml = slides.length ? buildSlideHtml(slides[0]) : null;
      persistTurn(supabase, sessionId, message, cleanText, insights, slideHtml).catch(
        e => console.error('[PERSIST]', e)
      );
    }

    return new Response(
      JSON.stringify({ reply: cleanText, insights, slides, chat_complete, turn: newTurnCount }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('[HANDLER]', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});

// ─── Slide HTML builder ───────────────────────────────────────────────────────

function buildSlideHtml(slide: SlideBlock): string {
  const typeLabels: Record<string, string> = {
    market_analysis: 'Análise de Mercado',
    brand_concept:   'Brand Concept',
    logo_audit:      'Análise de Logo',
    positioning:     'Posicionamento',
  };
  const label = typeLabels[slide.type] ?? slide.type;

  return `<div class="atom-slide" data-type="${slide.type}">
  <div class="atom-slide-tag">${label}</div>
  <div class="atom-slide-title">${slide.title}</div>
  <div class="atom-slide-body">${slide.body.replace(/\n/g, '<br/>')}</div>
  ${slide.image_prompt ? `<div class="atom-slide-img-prompt" data-prompt="${slide.image_prompt.replace(/"/g, '&quot;')}"></div>` : ''}
</div>`;
}
