import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY') ?? '';
const RESEND_FROM          = Deno.env.get('RESEND_FROM_EMAIL') ?? 'ATom\'s <equipe@atomsia.com.br>';

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ─── PDF-like HTML for the proposal ──────────────────────────────────────────

function buildProposalHTML(
  lead: { name: string; email: string; company_name?: string },
  proposal: {
    summary: string;
    scope_items: { title: string; description: string }[];
    investment_label: string;
    timeline_label: string;
    differentials: string[];
    next_steps: string[];
    edited_summary?: string;
    edited_investment_label?: string;
    edited_timeline_label?: string;
  },
): string {
  const investmentLabel = proposal.edited_investment_label || proposal.investment_label;
  const timelineLabel   = proposal.edited_timeline_label   || proposal.timeline_label;
  const summary         = proposal.edited_summary          || proposal.summary;
  const company         = lead.company_name || lead.name;

  const scopeItems = proposal.scope_items.map(item => `
    <div style="border-left:3px solid #c9a84c;padding:12px 16px;margin-bottom:12px;background:#1a1a1a;">
      <p style="margin:0 0 4px;font-weight:600;color:#e8d5a3;font-size:15px;">${item.title}</p>
      <p style="margin:0;color:#9a9a9a;font-size:13px;line-height:1.5;">${item.description}</p>
    </div>`).join('');

  const differentials = proposal.differentials.map(d =>
    `<li style="margin-bottom:8px;color:#b0b0b0;font-size:13px;">${d}</li>`
  ).join('');

  const nextSteps = proposal.next_steps.map((s, i) =>
    `<div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;">
      <span style="background:#c9a84c;color:#000;font-weight:700;font-size:11px;padding:3px 8px;border-radius:2px;shrink:0;">${i + 1}</span>
      <p style="margin:0;color:#b0b0b0;font-size:13px;line-height:1.5;">${s}</p>
    </div>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Proposta ATom's — ${company}</title>
</head>
<body style="margin:0;padding:0;background:#111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e0e0e0;">

  <!-- Header -->
  <div style="background:#0d0d0d;border-bottom:1px solid #2a2a2a;padding:32px 40px;">
    <div style="max-width:680px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <p style="margin:0 0 4px;font-size:11px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">Proposta Comercial</p>
        <h1 style="margin:0;font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.5px;">ATom's</h1>
      </div>
      <div style="text-align:right;">
        <p style="margin:0 0 2px;font-size:12px;color:#666;">Para</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#e8d5a3;">${company}</p>
      </div>
    </div>
  </div>

  <div style="max-width:680px;margin:0 auto;padding:40px;">

    <!-- Summary -->
    <div style="margin-bottom:40px;">
      <p style="margin:0 0 12px;font-size:10px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">Diagnóstico Resumido</p>
      <p style="margin:0;font-size:15px;line-height:1.7;color:#c0c0c0;">${summary}</p>
    </div>

    <!-- Scope -->
    <div style="margin-bottom:40px;">
      <p style="margin:0 0 16px;font-size:10px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">O que está incluído</p>
      ${scopeItems}
    </div>

    <!-- Investment + Timeline -->
    <div style="display:flex;gap:16px;margin-bottom:40px;">
      <div style="flex:1;background:#1a1a1a;border:1px solid #2a2a2a;padding:20px;border-radius:2px;text-align:center;">
        <p style="margin:0 0 6px;font-size:10px;color:#666;letter-spacing:2px;text-transform:uppercase;">Investimento</p>
        <p style="margin:0;font-size:22px;font-weight:700;color:#c9a84c;">${investmentLabel}</p>
      </div>
      <div style="flex:1;background:#1a1a1a;border:1px solid #2a2a2a;padding:20px;border-radius:2px;text-align:center;">
        <p style="margin:0 0 6px;font-size:10px;color:#666;letter-spacing:2px;text-transform:uppercase;">Prazo</p>
        <p style="margin:0;font-size:22px;font-weight:700;color:#c9a84c;">${timelineLabel}</p>
      </div>
    </div>

    <!-- Differentials -->
    ${proposal.differentials.length ? `
    <div style="margin-bottom:40px;">
      <p style="margin:0 0 12px;font-size:10px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">Por que ATom's</p>
      <ul style="margin:0;padding-left:20px;">${differentials}</ul>
    </div>` : ''}

    <!-- Next Steps -->
    ${proposal.next_steps.length ? `
    <div style="margin-bottom:40px;">
      <p style="margin:0 0 16px;font-size:10px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;">Próximos Passos</p>
      ${nextSteps}
    </div>` : ''}

    <!-- CTA -->
    <div style="background:#1a1a1a;border:1px solid #c9a84c30;padding:24px;text-align:center;margin-bottom:40px;">
      <p style="margin:0 0 8px;font-size:13px;color:#c0c0c0;">Pronto para transformar sua operação?</p>
      <p style="margin:0;font-size:12px;color:#666;">Responda este e-mail para confirmar ou tirar dúvidas.</p>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #2a2a2a;padding-top:24px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#444;">ATom's · Consultoria Estratégica &amp; IA First</p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { proposal_id } = await req.json();
    if (!proposal_id) return json({ error: 'proposal_id obrigatório' }, 400);

    // Load proposal + session + lead
    const { data: proposal, error: pErr } = await supabase
      .from('proposals')
      .select(`
        *,
        consultoria_sessions!inner(id, session_token, briefing_data),
        leads!inner(id, name, email, company_name)
      `)
      .eq('id', proposal_id)
      .single();

    if (pErr || !proposal) return json({ error: 'Proposta não encontrada' }, 404);
    if (proposal.status !== 'approved') return json({ error: 'Proposta ainda não aprovada pela equipe' }, 400);

    const lead = proposal.leads;
    const html = buildProposalHTML(lead, proposal);

    // Send via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    RESEND_FROM,
        to:      [lead.email],
        subject: `Proposta ATom's — ${lead.company_name || lead.name}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('[RESEND]', err.slice(0, 200));
      return json({ error: 'Falha ao enviar email' }, 502);
    }

    // Update proposal status + lead
    await Promise.all([
      supabase.from('proposals').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', proposal_id),
      supabase.from('leads').update({ proposal_sent_at: new Date().toISOString() }).eq('id', lead.id),
      supabase.from('consultoria_sessions').update({ flow_step: 'delivered' }).eq('id', proposal.consultoria_sessions.id),
    ]);

    return json({ ok: true, sent_to: lead.email });

  } catch (e) {
    console.error('[atom-email]', e);
    return json({ error: 'Internal error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
