import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Brain, Zap, ChevronRight, TrendingUp, Target, Users, BarChart2, Lightbulb, Layers, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  sendMessage,
  speakText,
  sendMessageEdge,
  speakTextEdge,
  getSession,
  saveSession,
  type Etapa,
  type ConversaContexto,
  type LoadingState,
  type InsightBlock as ServiceInsightBlock,
} from '@/services/consultoriaAgentService';
import type { InsightBlock } from './InsightsPanel';

// ─── Onboarding Screen ────────────────────────────────────────────────────────

const ONBOARDING_CARDS = [
  {
    icon: BarChart2,
    title: 'Análise de mercado',
    desc: 'Mapeamento do seu segmento — onde estão as oportunidades que seus concorrentes não viram.',
    color: 'emerald',
  },
  {
    icon: Target,
    title: 'Diagnóstico de marca',
    desc: 'Logo, paleta, posicionamento nas redes e brand voice — o que comunica e o que afasta clientes.',
    color: 'emerald',
  },
  {
    icon: TrendingUp,
    title: 'Grandes players do segmento',
    desc: 'O que os líderes do seu nicho fazem que você ainda não replicou.',
    color: 'emerald',
  },
  {
    icon: Lightbulb,
    title: 'Insights exclusivos',
    desc: 'Oportunidades não exploradas identificadas especificamente para o seu negócio.',
    color: 'emerald',
  },
  {
    icon: Users,
    title: 'Técnicas de audiência',
    desc: 'Metodologia ATom\'s para crescer seguidores reais e qualificados.',
    color: 'emerald',
  },
  {
    icon: Layers,
    title: 'Escopo completo de operação',
    desc: 'O que está travando sua operação — e exatamente como resolvemos.',
    color: 'emerald',
  },
];

const QUICK_STARTS = [
  { label: 'Tenho um negócio e quero escalar', value: 'Tenho um negócio estruturado e quero escalar. Quero entender onde estou perdendo dinheiro e o que posso melhorar.' },
  { label: 'Minha marca está mal posicionada', value: 'Minha marca não comunica bem o que eu entrego. Preciso de um diagnóstico de posicionamento e identidade.' },
  { label: 'Estou começando do zero', value: 'Estou construindo meu negócio do zero e quero começar com a estrutura certa — marca, posicionamento e operação.' },
  { label: 'Quero aumentar minha audiência', value: 'Meu negócio existe mas preciso aumentar audiência e visibilidade nas redes. Quero entender a melhor estratégia.' },
];

interface OnboardingScreenProps {
  onStart: (firstMessage: string) => void;
}

function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  const [custom, setCustom] = useState('');

  return (
    <div className="flex flex-col h-full bg-background px-5 sm:px-8 pt-5 pb-4 gap-4 overflow-hidden">
      {/* Header — compact */}
      <div className="shrink-0">
        <p className="text-[10px] font-medium text-primary uppercase tracking-widest mb-1.5">
          ÁTOM · Consultoria Estratégica
        </p>
        <h2 className="text-xl sm:text-2xl font-serif text-foreground leading-tight">
          O diagnóstico começa agora.
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Ao final você recebe tudo isso gratuitamente:
        </p>
      </div>

      {/* Benefit cards — 3 cols, no scroll */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 shrink-0">
        {ONBOARDING_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="flex items-center gap-2.5 rounded-sm border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5"
            >
              <div className="w-6 h-6 rounded-sm bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Icon className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-xs font-medium text-foreground leading-snug">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Quick start buttons */}
      <div className="flex flex-col gap-1.5 shrink-0">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
          Qual é sua situação?
        </p>
        {QUICK_STARTS.map((q) => (
          <button
            key={q.label}
            onClick={() => onStart(q.value)}
            className="flex items-center justify-between gap-3 w-full text-left rounded-sm border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 px-4 py-2.5 transition-all group"
          >
            <span className="text-sm text-foreground/90 font-medium group-hover:text-foreground">
              {q.label}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ))}
      </div>

      {/* Custom message */}
      <div className="border-t border-border/40 pt-3 shrink-0">
        <div className="flex gap-2">
          <input
            className="flex-1 h-10 bg-card/50 border border-border rounded-sm px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-emerald-500/50 transition-colors"
            placeholder="Ou descreva seu desafio com suas palavras..."
            value={custom}
            onChange={e => setCustom(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && custom.trim()) onStart(custom.trim());
            }}
          />
          <button
            disabled={!custom.trim()}
            onClick={() => onStart(custom.trim())}
            className="h-10 px-3 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-40 flex items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'agent';
  text: string;
  isOpus?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Heurística simples para avançar etapa com base na conversa
function inferNextEtapa(current: Etapa, reply: string, setor: string, gargalo: string): Etapa {
  if (current === 1 && setor && gargalo) return 2;
  if (current === 2) return 3;
  if (current === 3 && reply.length > 200) return 4;
  if (current === 4) return 5;
  return current;
}

// Extrai setor/gargalo do texto da resposta do agente (mapeamento simples)
function extractContextFromReply(reply: string, prev: { setor: string; gargalo: string }) {
  const setores = ['saúde', 'estética', 'varejo', 'serviços', 'educação', 'tecnologia', 'construção', 'alimentação', 'moda', 'logística'];
  const setor = prev.setor || setores.find(s => reply.toLowerCase().includes(s)) || '';
  return { setor, gargalo: prev.gargalo };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ConsultoriaAgentProps {
  clientId?: string;
  sessionId?: string;
  onNewInsights?: (insights: InsightBlock[]) => void;
  onReset?: () => void;
  isAdmin?: boolean;
}

export function ConsultoriaAgent({ clientId, sessionId: propSessionId, onNewInsights, onReset, isAdmin }: ConsultoriaAgentProps = {}) {
  const localClientId = clientId ?? 'admin';
  const session = getSession(localClientId);

  const [showOnboarding, setShowOnboarding] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>(session.etapa ?? 1);
  const [setor, setSetor] = useState(session.setor ?? '');
  const [gargalo, setGargalo] = useState(session.gargalo ?? '');
  const [sessionId, setSessionId] = useState(propSessionId ?? session.sessionId ?? '');

  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingState]);

  const buildContexto = useCallback((): ConversaContexto => ({
    etapa,
    setor,
    gargalo,
    sessionId,
    contexto: messages
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'Cliente' : 'ÁTOM'}: ${m.text}`)
      .join('\n'),
  }), [etapa, setor, gargalo, sessionId, messages]);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loadingState !== 'idle') return;

    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setInput('');

    const ctx = buildContexto();
    const isOpus = [2, 4].includes(etapa);
    setLoadingState(isOpus ? 'analyzing' : 'thinking');

    try {
      let reply: string;
      let newSessionId = sessionId;

      if (propSessionId) {
        // ── Client route: authenticated user ──────────────────────────────────
        const { data: { session: authSession } } = await supabase.auth.getSession();
        const token = authSession?.access_token ?? '';
        const history = messages.slice(-10).map(m => ({
          role: m.role === 'agent' ? 'agent' : 'user',
          content: m.text,
        }));
        const edgeRes = await sendMessageEdge(token, {
          message: trimmed,
          sessionId: propSessionId,
          etapa,
          setor,
          gargalo,
          history,
        });
        reply = edgeRes.reply;
        if (onNewInsights && edgeRes.insights?.length) {
          const mapped: InsightBlock[] = edgeRes.insights.map((ins: ServiceInsightBlock, i: number) => ({
            id: `${Date.now()}-${i}`,
            category: (ins.category as InsightBlock['category']) ?? 'geral',
            title: ins.title,
            body: ins.body,
            tags: ins.tags ?? [],
            createdAt: new Date(),
          }));
          onNewInsights(mapped);
        }
      } else {
        // ── Admin tab: Edge Function without user auth ─────────────────────────
        const history = messages.slice(-10).map(m => ({
          role: m.role === 'agent' ? 'agent' : 'user',
          content: m.text,
        }));
        const edgeRes = await sendMessageEdge('', {
          message: trimmed,
          sessionId: '',
          etapa,
          setor,
          gargalo,
          history,
        });
        reply = edgeRes.reply;
        if (onNewInsights && edgeRes.insights?.length) {
          const mapped: InsightBlock[] = edgeRes.insights.map((ins: ServiceInsightBlock, i: number) => ({
            id: `${Date.now()}-${i}`,
            category: (ins.category as InsightBlock['category']) ?? 'geral',
            title: ins.title,
            body: ins.body,
            tags: ins.tags ?? [],
            createdAt: new Date(),
          }));
          onNewInsights(mapped);
        }
        saveSession(localClientId, { sessionId: '' });
      }

      // Strip any block tags that leaked through
      reply = reply
        .replace(/\[SLIDE\][\s\S]*/gi, '')
        .replace(/\[INSIGHT\][\s\S]*/gi, '')
        .replace(/\[\/SLIDE\]/gi, '')
        .replace(/\[\/INSIGHT\]/gi, '')
        .trim();

      // Atualiza contexto
      const { setor: novoSetor } = extractContextFromReply(reply, { setor, gargalo });
      const novoGargalo = gargalo || (etapa === 1 ? trimmed.slice(0, 120) : gargalo);
      const novaEtapa = inferNextEtapa(etapa, reply, novoSetor || setor, novoGargalo);

      setSetor(novoSetor || setor);
      setGargalo(novoGargalo);
      if (!propSessionId) {
        setSessionId(newSessionId);
        saveSession(localClientId, {
          sessionId: newSessionId,
          etapa: novaEtapa,
          setor: novoSetor || setor,
          gargalo: novoGargalo,
        });
      }
      setEtapa(novaEtapa);

      setMessages(prev => [...prev, { role: 'agent', text: reply, isOpus }]);

      if (!muted) {
        audioRef.current?.pause();
        setAudioPlaying(false);
        const audio = propSessionId
          ? await speakTextEdge(reply)
          : await speakText(reply);
        if (audio) {
          audioRef.current = audio;
          audio.onended = () => setAudioPlaying(false);
          audio.play();
          setAudioPlaying(true);
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'agent', text: 'Conexão lenta. Tentando novamente em instantes...' },
      ]);
    } finally {
      setLoadingState('idle');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [loadingState, buildContexto, etapa, setor, gargalo, muted, propSessionId, sessionId, messages, localClientId]);

  function handleOnboardingStart(firstMessage: string) {
    setShowOnboarding(false);
    handleSend(firstMessage);
  }

  function stopAudio() {
    audioRef.current?.pause();
    setAudioPlaying(false);
  }

  function toggleMute() {
    if (!muted && audioRef.current) stopAudio();
    setMuted(prev => !prev);
  }

  function toggleListen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec: SpeechRecognition = new SR();
    rec.lang = 'pt-BR';
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      handleSend(e.results[0][0].transcript);
    };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  }

  // ─── Indicador de loading ─────────────────────────────────────────────────

  const LoadingIndicator = () => {
    if (loadingState === 'analyzing') {
      return (
        <div className="flex justify-start">
          <div className="bg-card/60 border border-primary/20 rounded-sm px-4 py-3 flex items-center gap-2.5">
            <Brain className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs text-primary font-medium tracking-wide">analisando...</span>
            <span className="text-[10px] text-muted-foreground ml-1">Opus</span>
          </div>
        </div>
      );
    }
    if (loadingState === 'thinking') {
      return (
        <div className="flex justify-start">
          <div className="bg-card/60 border border-border/50 rounded-sm px-4 py-3 flex items-center gap-2">
            <span className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full bg-muted-foreground/60 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>
            <span className="text-xs text-muted-foreground">digitando...</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (showOnboarding) {
    return (
      <div className="flex flex-col h-[calc(100vh-56px)] bg-background">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-border/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">ÁTOM</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Consultoria estratégica</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <OnboardingScreen onStart={handleOnboardingStart} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] bg-background">

      {/* Header */}
      <div className="px-6 py-3.5 border-b border-border/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-none">ÁTOM</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Consultoria estratégica · Etapa {etapa}/5</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Etapa badge */}
          <span className="hidden sm:inline-flex text-[10px] text-muted-foreground border border-border/50 px-2 py-0.5 rounded-sm">
            {etapa === 1 && 'Diagnóstico'}
            {etapa === 2 && 'Análise de mercado'}
            {etapa === 3 && 'Diagnóstico operacional'}
            {etapa === 4 && 'Estratégia'}
            {etapa === 5 && 'Plano de ação'}
          </span>
          {/* Reset button */}
          {onReset && messages.length > 0 && (
            <button
              onClick={onReset}
              className="text-muted-foreground hover:text-red-400 transition-colors"
              title="Resetar conversa"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          {/* Audio controls */}
          {audioPlaying && (
            <button
              onClick={stopAudio}
              className="text-primary hover:text-primary/70 transition-colors"
              title="Parar áudio"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
            </button>
          )}
          <button
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={muted ? 'Ativar voz' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 opacity-50" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] sm:max-w-[70%] rounded-sm px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-primary/10 text-foreground border border-primary/20'
                  : 'bg-card/60 text-foreground border border-border/50'
              }`}
            >
              {m.role === 'agent' && (
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-medium text-primary uppercase tracking-wider">ÁTOM</span>
                  {m.isOpus && (
                    <span className="text-[9px] text-muted-foreground/60 border border-border/40 px-1 rounded-sm">
                      Opus
                    </span>
                  )}
                </div>
              )}
              <span className="whitespace-pre-wrap">{m.text}</span>
            </div>
          </div>
        ))}

        <LoadingIndicator />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 sm:px-8 py-4 border-t border-border/60 shrink-0">
        <div className={`flex items-center gap-2 bg-card/50 border rounded-sm px-4 py-2.5 transition-colors ${
          listening ? 'border-primary/50' : 'border-border'
        }`}>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
            placeholder={listening ? 'Ouvindo...' : 'Digite sua mensagem...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            disabled={loadingState !== 'idle'}
          />
          <button
            onClick={toggleListen}
            className={`transition-colors ${
              listening
                ? 'text-primary animate-pulse'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title={listening ? 'Parar gravação' : 'Falar'}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loadingState !== 'idle'}
            className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {loadingState === 'analyzing' && (
          <p className="text-[10px] text-primary/60 mt-1.5 px-1">
            Análise profunda em andamento — pode levar até 2 minutos.
          </p>
        )}
      </div>
    </div>
  );
}
