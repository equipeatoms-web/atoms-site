import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";

const LiquidMetal = lazy(() =>
  import("@paper-design/shaders-react").then((m) => ({ default: m.LiquidMetal }))
);
import { gsap } from "@/lib/animations/gsap";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/lib/animations/variants";

export const ProblemSolution = () => {
  const [loadShader, setLoadShader] = useState(false);
  const bad = [
    "Agência de IA que entrega fluxo solto no ChatGPT — sem integração com seu WhatsApp, sem leitura de banco, sem regra de negócio.",
    "Dev freelancer que codifica sem entender margem, ticket ou funil — entrega o que você pediu, não o que faz o caixa crescer.",
    "Chatbot genérico vendido como “IA” — script com if/else reembalado, sem memória, sem agente, sem orquestração.",
    "Consultoria que sai com PDF, slide e plano de 90 dias — você paga, assina, e continua sem nada rodando.",
  ];
  const good = [
    "Eu construo sistema rodando, não apresentação — você recebe credenciais de produção, não Loom de demo.",
    "Eu falo de negócio antes de stack — mapeio margem, ticket e gargalo de atendimento antes de escolher modelo.",
    "Eu integro com WhatsApp Cloud, Mercado Pago, Stripe, Google Calendar e seu ERP — IA que mexe no que importa.",
    "Eu mantenho o sistema em pé por 60 dias depois do go-live — se cair, eu acordo. Incluído no projeto.",
  ];

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLoadShader(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.to(".problem-video-bg", {
      y: 50,
      opacity: 0.18,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8,
      }
    });
  }, { scope: sectionRef });

  return (
    <section id="problema" ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* LiquidMetal shader — carrega só quando a seção está perto */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {loadShader && (
          <Suspense fallback={null}>
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.18 }}
              transition={{ duration: 2 }}
            >
              <LiquidMetal
                style={{ width: "100%", height: "100%", filter: "blur(8px)" }}
                colorBack="hsl(0, 0%, 4%)"
                colorTint="hsl(38, 55%, 52%)"
                repetition={3}
                softness={0.55}
                shiftRed={0.2}
                shiftBlue={0.15}
                distortion={0.1}
                contour={1.2}
                shape="plane"
                offsetX={0}
                offsetY={0}
                scale={1}
                rotation={15}
                speed={1.2}
              />
            </motion.div>
          </Suspense>
        )}
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="section-label mb-3">O método em duas colunas</div>
          <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-4 max-w-3xl leading-[1.05]">
            O que <em className="text-primary italic">não funciona</em><span className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/40 bg-background text-primary font-serif text-[11px] font-bold tracking-widest shadow-[0_0_16px_hsl(var(--primary)/0.25)] align-middle mx-1">VS</span><span className="sm:hidden text-primary mx-1">—</span> o que eu faço diferente
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed mb-10">
            Antes de te vender qualquer coisa, deixa eu te mostrar onde o seu dinheiro costuma virar fumaça.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-sm overflow-hidden glass">
          <Reveal direction="right" as="div" className="p-8 bg-card/60">
            <h3 className="section-label mb-5 text-destructive/70">Padrão de mercado</h3>
            <StaggerGroup stagger={0.07} className="space-y-3">
              {bad.map((t) => (
                <motion.li
                  key={t}
                  variants={fadeUp}
                  className="flex gap-3 text-[15px] text-muted-foreground leading-relaxed list-none"
                >
                  <span className="text-muted-foreground/50 mt-0.5">✕</span>
                  <span>{t}</span>
                </motion.li>
              ))}
            </StaggerGroup>
          </Reveal>

          <Reveal direction="left" as="div" className="p-8 bg-card/40">
            <h3 className="section-label mb-5 text-primary">Como eu trabalho</h3>
            <StaggerGroup stagger={0.07} delayChildren={0.2} className="space-y-3">
              {good.map((t) => (
                <motion.li
                  key={t}
                  variants={fadeUp}
                  className="flex gap-3 text-[15px] text-foreground/85 leading-relaxed list-none"
                >
                  <motion.span
                    initial={{ scale: 0.6, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 14 }}
                    className="text-primary mt-0.5"
                  >
                    →
                  </motion.span>
                  <span>{t}</span>
                </motion.li>
              ))}
            </StaggerGroup>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
