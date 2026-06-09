import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { scrollToId } from "@/lib/animations/scroll";
import { TextSplit } from "@/components/motion/TextSplit";
import { EASE } from "@/lib/animations/easings";
import { Send, MessageSquare, Users, TrendingDown, Banknote, BarChart2 } from "lucide-react";
import { GoldParticles } from "@/components/motion/GoldParticles";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { VideoModal } from "@/components/VideoModal";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);

  const handlePromptSubmit = (promptText: string) => {
    if (!promptText.trim()) return;
    setIsProcessing(true);
    setAiResponse("");
    setTimeout(() => {
      setIsProcessing(false);
      if (promptText.toLowerCase().includes("atendimento") || promptText.toLowerCase().includes("vendas")) {
        setAiResponse("A ATom's ativa o Agente de Atendimento & Vendas integrado ao WhatsApp Cloud para qualificar e fechar leads 24/7.");
      } else if (promptText.toLowerCase().includes("cobran") || promptText.toLowerCase().includes("financeiro")) {
        setAiResponse("A ATom's recomenda o Agente Financeiro: emite Pix/Stripe, cobra inadimplentes e concilia tudo automaticamente.");
      } else {
        setAiResponse("Diagnóstico iniciado. A ATom's pode automatizar este processo ponta a ponta dentro da sua Arquitetura Operacional.");
      }
      // Abre o vídeo imersivo após exibir a resposta
      setTimeout(() => setVideoOpen(true), 900);
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-background"
      style={{ paddingTop: "clamp(100px, 12vw, 160px)", paddingBottom: "clamp(60px, 8vw, 120px)" }}
    >
      {/* ── Background ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(38 55% 55% / 0.09) 0%, transparent 65%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full"
          style={{ background: "radial-gradient(circle, hsl(38 45% 50% / 0.07) 0%, transparent 65%)", filter: "blur(100px)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to top, hsl(0 0% 4%), transparent)" }}
        />
        {/* Dotted wave surface 3D — camada principal de fundo */}
        <DottedSurface className="absolute inset-0 w-full h-full opacity-70" />
        {/* GoldParticles flutuantes por cima */}
        <GoldParticles />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      {/* ── Decorative gold line top ── */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: EASE.expoOut }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 origin-top"
        style={{ background: "linear-gradient(to bottom, transparent, hsl(38 33% 70% / 0.5), transparent)" }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <div className="flex flex-col items-center text-center">

          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE.expoOut }}
            className="mb-10"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[11px] tracking-[0.18em] uppercase font-medium text-muted-foreground"
              style={{
                background: "hsl(0 0% 7% / 0.7)",
                border: "1px solid hsl(38 33% 70% / 0.2)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 24px hsl(38 33% 70% / 0.06), inset 0 1px 0 hsl(38 40% 80% / 0.08)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ boxShadow: "0 0 6px hsl(38 33% 70% / 0.8)" }} />
              ATom's · Sistemas que Pensam
            </span>
          </motion.div>

          {/* Headline */}
          <h1
            className="font-serif text-foreground mb-7 w-full leading-[1.06] tracking-[-0.02em] text-center"
            style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
          >
            <TextSplit text="Sua operação cresceu" as="span" mode="word" stagger={0.05} className="block font-light text-foreground/90" />
            <TextSplit text="mais rápido que sua estrutura." as="span" mode="word" stagger={0.05} delay={0.15} className="block font-light text-foreground/90" />
            <TextSplit text="A gente resolve isso." as="span" mode="word" stagger={0.05} delay={0.3} className="block text-primary italic" />
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE.expoOut }}
            className="text-[15px] sm:text-[16px] text-muted-foreground/70 max-w-md leading-[1.75] mb-10 font-light text-center"
          >
            Sistemas que{" "}
            <span
              className="text-foreground/90 font-normal px-2 py-0.5"
              style={{ border: "1px solid hsl(38 33% 70% / 0.35)", borderRadius: "3px", background: "hsl(38 33% 70% / 0.06)", whiteSpace: "nowrap" }}
            >
              atendem, vendem e cobram
            </span>
            {" "}— sem você no meio.
          </motion.p>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE.expoOut }}
            className="w-full max-w-2xl mb-5"
            style={{
              background: "hsl(0 0% 7% / 0.85)",
              border: "1px solid hsl(38 33% 70% / 0.3)",
              borderRadius: "8px",
              backdropFilter: "blur(24px)",
              boxShadow: "0 0 60px hsl(38 33% 70% / 0.12), 0 20px 60px hsl(0 0% 0% / 0.5), inset 0 1px 0 hsl(38 40% 80% / 0.06)",
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePromptSubmit(inputValue)}
                placeholder="Qual processo ainda depende de você para funcionar?"
                className="w-full bg-transparent text-foreground/90 placeholder:text-muted-foreground/40 text-[14px] focus:outline-none focus:ring-0 border-0 p-0 font-light tracking-wide"
              />
              <button
                onClick={() => handlePromptSubmit(inputValue)}
                disabled={isProcessing}
                className="shrink-0 w-9 h-9 flex items-center justify-center text-primary disabled:opacity-40 transition-all duration-200 hover:scale-105"
                style={{ background: "hsl(38 33% 70% / 0.12)", border: "1px solid hsl(38 33% 70% / 0.3)", borderRadius: "6px", boxShadow: "0 0 16px hsl(38 33% 70% / 0.12)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {(isProcessing || aiResponse) && (
              <div className="px-4 pb-4 pt-0 font-mono text-[11px] leading-relaxed text-left" style={{ borderTop: "1px solid hsl(38 33% 70% / 0.1)" }}>
                <div className="pt-3">
                  {isProcessing ? (
                    <div className="flex items-center gap-2 text-muted-foreground/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                      <span>Analisando sua operação...</span>
                    </div>
                  ) : (
                    <div className="flex gap-2.5 text-primary/80">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{aiResponse}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.7 }}
            className="flex flex-wrap gap-2.5 justify-center mb-14"
          >
            <span className="text-[9px] text-muted-foreground/35 self-center mr-1 tracking-[0.2em] uppercase">Dores comuns</span>
            {[
              { label: "Atendimento manual", icon: <Users className="w-3 h-3" /> },
              { label: "Leads sem follow-up", icon: <TrendingDown className="w-3 h-3" /> },
              { label: "Cobrança no braço", icon: <Banknote className="w-3 h-3" /> },
              { label: "Suporte sem escala", icon: <BarChart2 className="w-3 h-3" /> },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => { setInputValue(s.label); handlePromptSubmit(s.label); }}
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide px-3.5 py-1.5 text-muted-foreground/60 hover:text-foreground/80 transition-all duration-250"
                style={{ background: "hsl(0 0% 7% / 0.5)", border: "1px solid hsl(38 33% 70% / 0.15)", borderRadius: "999px", backdropFilter: "blur(8px)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(38 33% 70% / 0.45)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px hsl(38 33% 70% / 0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(38 33% 70% / 0.15)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <span className="text-primary/50">{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Footer label */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="flex items-center gap-4">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, hsl(38 33% 70% / 0.3))" }} />
            <p className="text-[9px] text-muted-foreground/35 tracking-[0.25em] uppercase font-medium">ATom's · Soluções Empresariais em IA</p>
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, hsl(38 33% 70% / 0.3))" }} />
          </motion.div>

        </div>
      </div>

      {/* ── Modal de vídeo imersivo ── */}
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
};
