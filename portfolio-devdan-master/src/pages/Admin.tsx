import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, PhoneOff, Mic, MicOff, Volume2,
  LogOut, Radio, LayoutDashboard, Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const VAPI_ASSISTANT_ID = "2fc4fb57-3574-4075-96b9-0a09de968fa3";
const VAPI_PUBLIC_KEY = "399d662c-fe1c-4093-81c5-0975915cfc96";

type CallStatus = "idle" | "loading" | "active" | "ending";
type Tab = "voice" | "dashboard";

interface TranscriptLine {
  role: "user" | "assistant";
  text: string;
  ts: number;
}

// ─── Voice Demo Panel ──────────────────────────────────────────────────────

function VoicePanel() {
  const vapiRef = useRef<any>(null);
  const sdkLoadedRef = useRef(false);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const initVapi = useCallback(() => {
    const VapiClass = (window as any).Vapi;
    if (!VapiClass || vapiRef.current) return;
    const vapi = new VapiClass(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;
    vapi.on("call-start", () => { setStatus("active"); setTranscript([]); });
    vapi.on("call-end", () => { setStatus("idle"); setAgentSpeaking(false); });
    vapi.on("speech-start", () => setAgentSpeaking(true));
    vapi.on("speech-end", () => setAgentSpeaking(false));
    vapi.on("message", (msg: any) => {
      if (msg?.type === "transcript" && msg?.transcriptType === "final") {
        setTranscript(prev => [...prev, { role: msg.role, text: msg.transcript, ts: Date.now() }]);
      }
    });
    vapi.on("error", () => setStatus("idle"));
  }, []);

  useEffect(() => {
    if (sdkLoadedRef.current) { initVapi(); return; }
    if (document.getElementById("vapi-sdk-admin")) {
      sdkLoadedRef.current = true; initVapi(); return;
    }
    const script = document.createElement("script");
    script.id = "vapi-sdk-admin";
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.async = true;
    script.onload = () => { sdkLoadedRef.current = true; initVapi(); };
    document.body.appendChild(script);
  }, [initVapi]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const handleStart = async () => {
    if (!vapiRef.current) return;
    setStatus("loading");
    try { await vapiRef.current.start(VAPI_ASSISTANT_ID); }
    catch { setStatus("idle"); }
  };

  const handleStop = () => {
    if (!vapiRef.current) return;
    setStatus("ending");
    vapiRef.current.stop();
  };

  const toggleMute = () => {
    if (!vapiRef.current) return;
    const next = !isMuted;
    vapiRef.current.setMuted(next);
    setIsMuted(next);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    vapiRef.current?.setVolume?.(v);
  };

  const statusColor: Record<CallStatus, string> = {
    idle: "hsl(38 33% 57%)",
    loading: "hsl(38 33% 70%)",
    active: "hsl(142 71% 45%)",
    ending: "hsl(0 72% 51%)",
  };

  const statusLabel: Record<CallStatus, string> = {
    idle: "Pronto para demonstração",
    loading: "Conectando ao agente...",
    active: "Ligação em andamento",
    ending: "Encerrando...",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Call control */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6 rounded-2xl border border-primary/10 bg-card/40">
        {/* Avatar / status ring */}
        <motion.div
          animate={status === "active" ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center justify-center w-40 h-40 rounded-full"
          style={{ background: `${statusColor[status]}12`, border: `2px solid ${statusColor[status]}30` }}
        >
          {status === "active" && (
            <motion.span
              animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full"
              style={{ background: statusColor[status] }}
            />
          )}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: `${statusColor[status]}18`, border: `2px solid ${statusColor[status]}50` }}
          >
            {status === "active" && agentSpeaking
              ? <Volume2 className="w-10 h-10" style={{ color: statusColor[status] }} />
              : <Radio className="w-10 h-10" style={{ color: statusColor[status] }} />
            }
          </div>
        </motion.div>

        <div className="text-center">
          <p className="text-xl font-semibold text-foreground">ATom's AI Agent</p>
          <p className="text-sm mt-1" style={{ color: statusColor[status] }}>{statusLabel[status]}</p>
        </div>

        {/* Controls */}
        <AnimatePresence mode="wait">
          {(status === "idle" || status === "ending") && (
            <motion.button
              key="start"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={handleStart}
              disabled={status === "ending"}
              className="flex items-center gap-3 px-8 py-4 rounded-full text-black font-semibold text-base shadow-lg disabled:opacity-50"
              style={{ background: "hsl(38 33% 57%)" }}
            >
              <Phone className="w-5 h-5" />
              Iniciar demonstração
            </motion.button>
          )}

          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="flex items-center gap-3 px-8 py-4 rounded-full border text-sm"
              style={{ borderColor: "hsl(38 33% 57%)", color: "hsl(38 33% 70%)" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 rounded-full border-2 border-t-transparent"
                style={{ borderColor: "hsl(38 33% 57%)" }}
              />
              Conectando...
            </motion.div>
          )}

          {status === "active" && (
            <motion.div
              key="active"
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full max-w-xs"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center w-12 h-12 rounded-full border transition-all"
                  style={{
                    borderColor: isMuted ? "hsl(0 72% 51%)" : "hsl(38 33% 57%)",
                    color: isMuted ? "hsl(0 72% 51%)" : "hsl(38 33% 57%)",
                    background: isMuted ? "hsl(0 72% 51% / 0.1)" : "transparent",
                  }}
                  title={isMuted ? "Desmutar" : "Mutar"}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
                  style={{ background: "hsl(0 72% 51%)" }}
                >
                  <PhoneOff className="w-4 h-4" />
                  Encerrar
                </button>
              </div>

              <div className="flex items-center gap-3 w-full">
                <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="range" min={0} max={1} step={0.05} value={volume}
                  onChange={handleVolume} className="w-full"
                  style={{ accentColor: "hsl(38 33% 57%)" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript */}
      <div className="flex-1 flex flex-col rounded-2xl border border-primary/10 bg-card/40 p-5 min-h-[320px] lg:min-h-0">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Transcrição em tempo real
          </p>
          {transcript.length > 0 && (
            <button onClick={() => setTranscript([])} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Limpar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <AnimatePresence initial={false}>
            {transcript.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-3 text-center py-12"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(38 33% 57% / 0.1)" }}>
                  <Mic className="w-4 h-4" style={{ color: "hsl(38 33% 57%)" }} />
                </div>
                <p className="text-sm text-muted-foreground">A transcrição aparecerá aqui durante a ligação</p>
              </motion.div>
            ) : (
              transcript.map((line, i) => (
                <motion.div
                  key={line.ts + i}
                  initial={{ opacity: 0, x: line.role === "user" ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={line.role === "assistant"
                      ? { background: "hsl(38 33% 57% / 0.12)", border: "1px solid hsl(38 33% 57% / 0.2)", color: "hsl(38 33% 80%)", borderRadius: "4px 18px 18px 18px" }
                      : { background: "hsl(220 10% 20%)", border: "1px solid hsl(220 10% 28%)", color: "hsl(220 10% 85%)", borderRadius: "18px 4px 18px 18px" }
                    }
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-60">
                      {line.role === "assistant" ? "ATom's AI" : "Você"}
                    </span>
                    {line.text}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
}

// ─── Admin Page ────────────────────────────────────────────────────────────

export default function Admin() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("voice");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "voice", label: "Voice Demo", icon: <Radio className="w-4 h-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-primary/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "hsl(38 33% 57%)" }}>
            <Zap className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-sm font-semibold text-foreground">ATom's Admin</span>
          <span className="text-xs text-muted-foreground border border-primary/20 px-2 py-0.5 rounded-full">
            {user?.email}
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-primary/10 hover:border-primary/30"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </header>

      {/* Tab bar */}
      <div className="border-b border-primary/10 px-6 flex gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            style={tab === t.id ? { borderColor: "hsl(38 33% 57%)", color: "hsl(38 33% 80%)" } : {}}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          {tab === "voice" && (
            <motion.div
              key="voice"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="h-full"
              style={{ minHeight: "calc(100vh - 160px)" }}
            >
              <div className="mb-4">
                <h1 className="text-lg font-semibold text-foreground">Voice Demo</h1>
                <p className="text-sm text-muted-foreground">
                  Demonstração do agente de voz ATom's — use para apresentações e qualificação de leads.
                </p>
              </div>
              <VoicePanel />
            </motion.div>
          )}

          {tab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "hsl(38 33% 57% / 0.1)" }}>
                <LayoutDashboard className="w-5 h-5" style={{ color: "hsl(38 33% 57%)" }} />
              </div>
              <p className="text-base font-medium text-foreground">Dashboard em breve</p>
              <p className="text-sm text-muted-foreground">Métricas, leads e histórico de ligações aparecerão aqui.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
