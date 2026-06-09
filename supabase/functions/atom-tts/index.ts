const GOOGLE_TTS_API_KEY = Deno.env.get('GOOGLE_TTS_API_KEY') ?? '';
const TTS_MODEL          = 'gemini-2.5-flash-preview-tts';
const TTS_VOICE          = 'Charon'; // deep, measured

Deno.serve(async (req) => {
  const cors = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Headers': 'authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    if (!GOOGLE_TTS_API_KEY) {
      return new Response(JSON.stringify({ error: 'TTS not configured' }), {
        status: 503, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const { text } = await req.json();
    if (!text) {
      return new Response(JSON.stringify({ error: 'text é obrigatório' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${GOOGLE_TTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: TTS_VOICE },
              },
            },
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('[TTS]', err.slice(0, 200));
      return new Response(JSON.stringify({ error: 'TTS error' }), {
        status: 502, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const json = await res.json();
    const b64: string | undefined =
      json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!b64) {
      return new Response(JSON.stringify({ error: 'No audio data' }), {
        status: 502, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ audio: b64, mime: 'audio/wav' }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('[TTS HANDLER]', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500, headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
