import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const cors = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'content-type, apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const {
      name, email, whatsapp,
      company_name, segment,
      main_challenge, already_tried,
    } = await req.json();

    if (!name || !email || !whatsapp || !main_challenge) {
      return json({ error: 'Campos obrigatórios: name, email, whatsapp, main_challenge' }, 400);
    }

    // Upsert lead
    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .upsert({
        name,
        email,
        whatsapp,
        company_name:    company_name ?? null,
        business_type:   company_name ?? null,
        segment:         segment ?? null,
        main_challenge,
        already_tried:   already_tried ?? null,
        source:          'diagnostico',
        status:          'new',
      }, { onConflict: 'email' })
      .select('id')
      .single();

    if (leadErr) return json({ error: leadErr.message }, 500);

    // Create session with opaque token
    const session_token = crypto.randomUUID();

    const { data: session, error: sessErr } = await supabase
      .from('consultoria_sessions')
      .insert({
        lead_id:      lead.id,
        session_token,
        flow_step:    'guided_chat',
        status:       'active',
        briefing_data: { company_name, segment, main_challenge, already_tried },
      })
      .select('id')
      .single();

    if (sessErr) return json({ error: sessErr.message }, 500);

    return json({ session_token, session_id: session.id, lead_id: lead.id });
  } catch (e) {
    console.error('[atom-briefing]', e);
    return json({ error: 'Internal error' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
