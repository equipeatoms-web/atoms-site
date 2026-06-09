// ─── Endpoints ────────────────────────────────────────────────────────────────

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '';
const EDGE_CHAT_URL     = `${SUPABASE_URL}/functions/v1/atom-chat`;
const EDGE_TTS_URL      = `${SUPABASE_URL}/functions/v1/atom-tts`;

const ELEVENLABS_API_KEY  = import.meta.env.VITE_ELEVENLABS_API_KEY ?? '';
const ELEVENLABS_VOICE_ID = 'onwK4e9ZLuTAKqWW03F9';
const ELEVENLABS_MODEL    = 'eleven_multilingual_v2';

// ─── Session ──────────────────────────────────────────────────────────────────

const SESSION_PREFIX = 'atom_consultor_';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

interface SessionData {
  sessionId: string;
  etapa: Etapa;
  setor: string;
  gargalo: string;
  contexto: string;
  expiresAt: number;
}

export type Etapa = 1 | 2 | 3 | 4 | 5;

export interface ConversaContexto {
  etapa: Etapa;
  setor: string;
  gargalo: string;
  contexto: string;
  sessionId: string;
}

export function getSession(clientId: string): SessionData {
  const key = SESSION_PREFIX + clientId;
  const raw = localStorage.getItem(key);
  if (raw) {
    const parsed: SessionData = JSON.parse(raw);
    if (parsed.expiresAt > Date.now()) return parsed;
  }
  const nova: SessionData = {
    sessionId: '',
    etapa: 1,
    setor: '',
    gargalo: '',
    contexto: '',
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  localStorage.setItem(key, JSON.stringify(nova));
  return nova;
}

export function saveSession(clientId: string, data: Partial<SessionData>) {
  const key = SESSION_PREFIX + clientId;
  const current = getSession(clientId);
  const updated = { ...current, ...data, expiresAt: Date.now() + SESSION_TTL_MS };
  localStorage.setItem(key, JSON.stringify(updated));
}

export function clearSession(clientId: string) {
  localStorage.removeItem(SESSION_PREFIX + clientId);
}

// ─── System prompts ───────────────────────────────────────────────────────────

const BASE_SYSTEM = (etapa: Etapa, setor: string, gargalo: string, historico: string) => `
Você é ÁTOM, agente de consultoria operacional de ATOMS IA First.

ATOMS não é sobre IA. IA é infraestrutura. O assunto real é a transição de
empresas tradicionais para sistemas operacionais inteligentes.
O inimigo é a fricção operacional: tarefas manuais, setores desconectados,
dependência humana excessiva, falta de previsibilidade.

Tom: racional, sofisticado, direto. Como um sócio que já viu centenas de operações.
Nunca: guru, coach motivacional, vendedor de curso, chatbot de suporte.
Linguagem: português brasileiro, frases curtas e densas.
Nunca use: "Claro!", "Ótima pergunta!", emojis, frases motivacionais.
Máximo 2 perguntas por turno.

Contexto da conversa: ${historico || 'início da sessão'}
Setor identificado: ${setor || 'ainda não identificado'}
Gargalo principal: ${gargalo || 'ainda não identificado'}
Etapa atual: ${etapa}
`.trim();

const MARKET_ANALYSIS_SYSTEM = (setor: string, gargalo: string) => `
Faça análise de mercado real para:
Setor: ${setor}
Gargalo descrito: ${gargalo}

Cubra: tendências atuais do setor · o que operações estruturadas já fazem
que esse cliente não faz · oportunidades de diferenciação para esse porte
· riscos operacionais típicos quando a operação não está estruturada.

4 parágrafos curtos, conversacionais, cada um conectando ao problema do cliente.
Tom: conselheiro que conhece o setor, não relatório de consultoria.
Nunca use: "Claro!", "Ótima pergunta!", emojis, frases motivacionais.
Linguagem: português brasileiro.
`.trim();

const STRATEGY_SYSTEM = (diagnostico: string, setor: string, contexto: string) => `
Com base no diagnóstico abaixo, apresente 2-3 caminhos estratégicos reais.
Diagnóstico: ${diagnostico}
Setor: ${setor} · Contexto: ${contexto}

Para cada caminho: o que é · por que funciona para esse negócio
· custo estimado (tempo + investimento) · risco real e honesto
· sinal de que está funcionando.

Sem hype. Trade-offs reais. Tom: sócio estratégico com visão de implementação.
Nunca use: "Claro!", "Ótima pergunta!", emojis, frases motivacionais.
Linguagem: português brasileiro.
`.trim();

// ─── Admin call (Edge Function with anon key — no user session needed) ────────

export type LoadingState = 'idle' | 'thinking' | 'analyzing';

export async function sendMessage(
  clientId: string,
  mensagem: string,
  ctx: ConversaContexto,
): Promise<{ reply: string; newSessionId: string; loadingState: LoadingState }> {
  const loadingState: LoadingState = 'thinking';

  const history = ctx.contexto
    ? ctx.contexto.split('\n').map(line => {
        const isAgent = line.startsWith('ÁTOM:');
        return { role: isAgent ? 'agent' : 'user', content: line.replace(/^(ÁTOM|Cliente):\s*/, '') };
      }).filter(m => m.content)
    : [];

  const edgeRes = await sendMessageEdge(SUPABASE_ANON_KEY, {
    message: mensagem,
    sessionId: ctx.sessionId || '',
    etapa: ctx.etapa,
    setor: ctx.setor,
    gargalo: ctx.gargalo,
    history,
  });

  const reply = edgeRes.reply;
  saveSession(clientId, { sessionId: ctx.sessionId });

  return { reply, newSessionId: ctx.sessionId, loadingState };
}

// ─── ElevenLabs TTS ───────────────────────────────────────────────────────────

export async function speakText(text: string): Promise<HTMLAudioElement | null> {
  if (!ELEVENLABS_API_KEY) return null;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: ELEVENLABS_MODEL,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!res.ok) return null;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  return new Audio(url);
}

// ─── Paperclip — registrar sessão encerrada ───────────────────────────────────

export async function registrarSessaoPaperclip(
  clientId: string,
  dados: {
    etapasPercorridas: number[];
    setor: string;
    gargalo: string;
    diagnosticoResumido: string;
    caminhoDiscutido: string;
    proximoPasso: string;
    encaminhadoParaAndre: boolean;
  },
) {
  // Log local — integração com Paperclip API quando disponível
  console.info('[ÁTOM] Sessão encerrada', { clientId, ...dados });
  clearSession(clientId);
}

// ─── Edge Function calls (used by /consultoria client route) ─────────────────

export interface InsightBlock {
  category: string;
  title: string;
  body: string;
  tags: string[];
}

export interface SlideBlock {
  type: string;
  title: string;
  body: string;
  image_prompt: string;
}

export interface EdgeChatResponse {
  reply: string;
  insights: InsightBlock[];
  slides: SlideBlock[];
}

export async function sendMessageEdge(
  authToken: string,
  payload: {
    message: string;
    sessionId: string;
    etapa: number;
    setor: string;
    gargalo: string;
    history: { role: string; content: string }[];
  },
): Promise<EdgeChatResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(EDGE_CHAT_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Edge chat error: ${res.status} ${errText}`);
  }
  return res.json();
}

export async function speakTextEdge(text: string): Promise<HTMLAudioElement | null> {
  const res = await fetch(EDGE_TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) return null;

  const { audio, mime } = await res.json();
  if (!audio) return null;

  const bytes = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
  const blob  = new Blob([bytes], { type: mime ?? 'audio/wav' });
  const url   = URL.createObjectURL(blob);
  return new Audio(url);
}
