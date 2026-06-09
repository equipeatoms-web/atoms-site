import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap";
import { scrollToId } from "@/lib/animations/scroll";
import { TextSplit } from "@/components/motion/TextSplit";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { EASE } from "@/lib/animations/easings";
import { Send, Sparkles, MessageSquare, ArrowDown } from "lucide-react";
const SplineScene = lazy(() =>
  import("@/components/ui/splite").then((m) => ({ default: m.SplineScene }))
);
import { Spotlight } from "@/components/ui/spotlight";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const handlePromptSubmit = (promptText: string) => {
    if (!promptText.trim()) return;
    setIsProcessing(true);
    setAiResponse("");
    
    setTimeout(() => {
      setIsProcessing(false);
      if (promptText.toLowerCase().includes("vendas") || promptText.toLowerCase().includes("atendimento")) {
        setAiResponse("Recomendo o Agente de Atendimento & Vendas integrado com a API Cloud do WhatsApp para qualificar leads em tempo real.");
      } else if (promptText.toLowerCase().includes("financeiro") || promptText.toLowerCase().includes("cobrar")) {
        setAiResponse("Ativação do Agente Financeiro recomendada para emitir faturas Pix/Stripe e conciliar pagamentos automaticamente.");
      } else {
        setAiResponse("Análise completa iniciada. O pipeline vertical de agentes pode automatizar este processo ponta a ponta.");
      }
      scrollToId("arquitetura");
    }, 1500);
  };



  useGSAP(() => {
    if (!sectionRef.current || reduce) return;
    const ctx = gsap.context(() => {
      // Zoom in video and fade content out on scroll for immersive dive transition
      gsap.to(".hero-video-bg-container", {
        scale: 1.15,
        opacity: 0.1,
        y: 60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to(".hero-content-wrap", {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.5,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef, dependencies: [reduce] });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-36 pb-24 bg-background"
    >
      {/* Cinematic Golden Sparkles Video Background (transition-3.mp4) */}
      <div className="hero-video-bg-container absolute inset-0 pointer-events-none overflow-hidden z-0 origin-center transition-all duration-300">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.38] mix-blend-screen scale-[1.05]"
          src="/transition-3.mp4"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette opacity-90" />
      </div>

      {/* Decorative Blur Orbs */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, hsl(38 70% 55% / 0.15), transparent 75%)" }}
        />
      </div>

      {/* Gold Spotlight + Interactive 3D Robot Scene */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="hsl(38 33% 70%)"
      />
      {/* Desktop: robô full height lado direito */}
      <div
        ref={splineContainerRef}
        aria-hidden
        className="absolute inset-0 z-[1] hidden md:block opacity-[0.55] mix-blend-screen will-change-transform"
      >
        <div className="absolute inset-y-0 right-0 w-[60%] h-full cursor-move bg-gradient-to-l from-primary/5 to-transparent">
          {!reduce && isDesktop && (
            <Suspense fallback={null}>
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
                mouseTracking={true}
              />
            </Suspense>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />
      </div>



      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="hero-content-wrap flex flex-col items-center text-center">
          
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE.expoOut }}
            className="mb-8"
          >
            <span className="section-label inline-flex items-center gap-2 border border-primary/20 px-4 py-2 rounded-sm bg-background/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              Atoms · Engenharia de IA Aplicada
            </span>
          </motion.div>

          {/* Headline — 06 Belfort */}
          <h1
            className="font-serif text-foreground mb-6 max-w-3xl leading-[1.08] tracking-tight text-left"
            style={{ fontSize: "clamp(28px, 5vw, 72px)" }}
          >
            <TextSplit text="Já aumentei margem e" as="span" mode="word" stagger={0.06} className="block font-light" />
            <TextSplit text="reduzi custo operacional." as="span" mode="word" stagger={0.06} delay={0.18} className="block font-light" />
            <TextSplit text="Sistemas que vendem" as="span" mode="word" stagger={0.06} delay={0.36} className="block text-primary italic" />
            <TextSplit text="enquanto o dono dorme." as="span" mode="word" stagger={0.06} delay={0.52} className="block text-primary italic" />
          </h1>

          {/* IA FIRST: Big Spotlight Prompt Input */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: EASE.expoOut }}
            className="w-full max-w-2xl mb-6 bg-card/65 border border-primary/25 backdrop-blur-xl rounded-sm p-2.5 shadow-[0_0_50px_rgba(212,175,55,0.08)] hover:border-primary/45 transition-all duration-300"
          >
            <div className="flex items-center gap-3 px-3 py-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePromptSubmit(inputValue)}
                placeholder="Qual o gargalo que está custando mais caro na sua operação hoje?"
                className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/60 text-[15px] focus:outline-none focus:ring-0 border-0 p-0 font-light"
              />
              <button
                onClick={() => handlePromptSubmit(inputValue)}
                disabled={isProcessing}
                className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-55"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live IA Response */}
            {(isProcessing || aiResponse) && (
              <div className="border-t border-primary/15 mt-2.5 pt-3.5 px-3 pb-1 font-mono text-[11px] leading-relaxed text-muted-foreground/90 text-left animate-fade-in">
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span>Conectando ao Pipeline de Agentes Verticais para solucionar seu caso...</span>
                  </div>
                ) : (
                  <div className="flex gap-3 text-primary/90">
                    <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{aiResponse}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Prompt Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="flex flex-wrap gap-2.5 justify-center mb-12"
          >
            <span className="text-[10px] text-muted-foreground/60 self-center mr-1">Exemplos:</span>
            {[
              "Automatizar conciliação bancária",
              "Recuperação de carrinhos no WhatsApp",
              "Substituir suporte por agentes integrados",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInputValue(suggestion);
                  handlePromptSubmit(suggestion);
                }}
                className="text-[10px] tracking-wider px-3.5 py-1.5 bg-background/50 border border-primary/15 hover:border-primary/40 text-muted-foreground hover:text-foreground rounded-sm transition-all duration-300"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>

          {/* CTA & Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE.expoOut }}
            className="flex flex-col items-center gap-4"
          >
            <MagneticButton
              onClick={() => scrollToId("contato")}
              strength={0.15}
              className="relative group bg-primary text-primary-foreground px-8 py-4 text-sm font-medium rounded-sm shadow-glow overflow-hidden btn-glow"
            >
              <span className="relative z-10">Quero saber se meu negócio se qualifica</span>
            </MagneticButton>
            <p className="text-[10px] text-muted-foreground/50 tracking-[0.2em] uppercase font-semibold">
              Arquitetura de Sistemas Conversacionais & Verticais
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="hidden md:flex absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex-col items-center gap-3 cursor-pointer"
          onClick={() => scrollToId("arquitetura")}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40 rotate-90 origin-center inline-block">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};
