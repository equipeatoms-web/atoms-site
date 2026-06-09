import { useState, useRef, useEffect } from 'react';
import { ChevronRight, Send } from 'lucide-react';

const SUPABASE_URL   = import.meta.env.VITE_SUPABASE_URL ?? '';
const EDGE_CHAT_URL  = `${SUPABASE_URL}/functions/v1/atom-chat`;

// Quick-reply options per turn (1-indexed)
const QUICK_REPLIES: Record<number, string[]> = {
  1: ['Até R$ 30k/mês', 'R$ 30k–150k/mês', 'R$ 150k–500k/mês', 'Acima de R$ 500k/mês', 'Prefiro não informar'],
  2: ['Só eu', '2–5 pessoas', '6–20 pessoas', 'Mais de 20'],
  3: ['Sem presença', 'Só WhatsApp', 'Redes sociais básicas', 'Site + redes estruturadas'],
  4: ['Indicação', 'Redes sociais', 'Google/SEO', 'Anúncios pagos', 'Vendas ativas'],
  5: ['Captação de clientes', 'Retenção / pós-venda', 'Processos internos', 'Posicionamento de marca'],
  6: ['Nunca tentei nada', 'Tentei mas não funcionou', 'Tenho algo parcial funcionando', 'Tenho processos estruturados'],
};

const TOTAL_TURNS = 6;

interface Message { role: 'user' | 'agent'; text: string }

interface GuidedChatProps {
  sessionToken: string;
  sessionId: string;
  onComplete: () => void;
}

export function GuidedChat({ sessionToken, sessionId, onComplete }: GuidedChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: 'Briefing recebido. Vou fazer 6 perguntas rápidas para calibrar o diagnóstico.\n\nPrimeira: qual é o faturamento aproximado do negócio hoje?' },
  ]);
  const [turn, setTurn]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [custom, setCustom]     = useState('');
  const [complete, setComplete] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setCustom('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);

    try {
      const res = await fetch(EDGE_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_token: sessionToken,
          guided_mode: true,
          history: messages.map(m => ({ role: m.role === 'agent' ? 'agent' : 'user', content: m.text })),
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? 'Entendido.';
      const nextTurn = turn + 1;

      setMessages(prev => [...prev, { role: 'agent', text: reply }]);
      setTurn(nextTurn);

      if (data.chat_complete) {
        setComplete(true);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'agent', text: 'Erro de conexão. Tenta novamente.' }]);
    } finally {
      setLoading(false);
    }
  }

  const quickReplies = QUICK_REPLIES[turn] ?? [];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Progress bar */}
      <div className="shrink-0 px-5 py-2.5 border-b border-border/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">
            {complete ? 'Qualificação concluída' : `Pergunta ${Math.min(turn, TOTAL_TURNS)} de ${TOTAL_TURNS}`}
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">
            {complete ? '100%' : `${Math.round((Math.min(turn - 1, TOTAL_TURNS) / TOTAL_TURNS) * 100)}%`}
          </span>
        </div>
        <div className="h-1 bg-border/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${complete ? 100 : Math.round(((turn - 1) / TOTAL_TURNS) * 100)}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-primary/10 border border-primary/20 text-foreground'
                : 'bg-card/60 border border-border/50 text-foreground'
            }`}>
              {m.role === 'agent' && (
                <p className="text-[10px] font-medium text-primary uppercase tracking-wider mb-1.5">ÁTOM</p>
              )}
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-card/60 border border-border/50 rounded-sm px-4 py-3 flex items-center gap-2">
              {[0,1,2].map(i => (
                <span key={i} className="w-1 h-1 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: `${i*150}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Complete CTA */}
      {complete && (
        <div className="shrink-0 px-5 py-4 border-t border-border/60 space-y-2">
          <p className="text-xs text-muted-foreground text-center mb-3">
            O ÁTOM tem o que precisa. Como prefere prosseguir?
          </p>
          <button
            onClick={onComplete}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            Gerar meu diagnóstico completo <ChevronRight className="w-4 h-4" />
          </button>
          <p className="text-[10px] text-muted-foreground text-center">
            O diagnóstico leva ~1 minuto para ser gerado
          </p>
        </div>
      )}

      {/* Input area */}
      {!complete && (
        <div className="shrink-0 border-t border-border/60">
          {/* Quick replies */}
          {quickReplies.length > 0 && !loading && (
            <div className="px-4 pt-3 pb-1 flex flex-wrap gap-1.5">
              {quickReplies.map(r => (
                <button
                  key={r}
                  onClick={() => send(r)}
                  className="px-3 py-1.5 text-xs rounded-sm border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/50 text-foreground/90 transition-all"
                >
                  {r}
                </button>
              ))}
            </div>
          )}
          {/* Custom input */}
          <div className="px-4 py-3 flex gap-2">
            <input
              className="flex-1 h-9 bg-card/50 border border-border rounded-sm px-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="Ou escreva sua resposta..."
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(custom); }}
              disabled={loading}
            />
            <button
              onClick={() => send(custom)}
              disabled={!custom.trim() || loading}
              className="h-9 px-3 rounded-sm bg-card/60 border border-border hover:border-emerald-500/40 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
