import { useRef } from "react";
import { motion } from "framer-motion";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/lib/animations/variants";

export const ProblemSolution = () => {
  const bad = [
    "Empresas que cresceram rápido e viraram reféns da própria operação — todo processo depende de uma pessoa específica para funcionar.",
    "Fundadores que trabalham 12h por dia mas sentem que a empresa não anda — porque estão dentro da máquina, não no comando dela.",
    "Times sobrecarregados fazendo o que deveria ser automático — atendimento manual, follow-up no braço, cobrança por WhatsApp.",
    "Operações que chegaram no teto — faturamento estagnado porque o modelo atual não escala sem contratar mais gente.",
  ];
  const good = [
    "Entramos com o que você precisa agora: chatbot, automação ou landing page. E usamos isso para entender sua operação por dentro.",
    "Mapeamos seus processos reais antes de propor qualquer stack — porque a ferramenta certa depende do problema certo.",
    "Implantamos a arquitetura completa em camadas — começando pelo que gera ROI imediato e expandindo conforme sua operação evolui.",
    "Você não precisa entender de tecnologia. Precisa entender de negócio — e a ATom's faz a ponte entre os dois.",
  ];

  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="problema" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, hsl(38 55% 52% / 0.3), transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="section-label mb-3">O método em duas colunas</div>
          <h2 className="font-serif text-3xl sm:text-5xl text-foreground mb-4 max-w-3xl leading-[1.05]">
            O que <em className="text-primary italic">não funciona</em>
            <span className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary/40 bg-background text-primary font-serif text-[11px] font-bold tracking-widest shadow-[0_0_16px_hsl(var(--primary)/0.25)] align-middle mx-1">VS</span>
            <span className="sm:hidden text-primary mx-1">-</span> o que fazemos diferente
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed mb-10">
            Antes de te vender qualquer coisa, deixa a gente mostrar onde o seu dinheiro costuma virar fumaça.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-px bg-border rounded-sm overflow-hidden glass">
          <Reveal direction="right" as="div" className="p-8 bg-card/60">
            <h3 className="section-label mb-5 text-destructive/70">Quem chega pra gente</h3>
            <StaggerGroup stagger={0.07} className="space-y-3">
              {bad.map((t) => (
                <motion.li
                  key={t}
                  variants={fadeUp}
                  className="flex gap-3 text-[15px] text-muted-foreground leading-relaxed list-none"
                >
                  <span className="text-muted-foreground/50 mt-0.5">x</span>
                  <span>{t}</span>
                </motion.li>
              ))}
            </StaggerGroup>
          </Reveal>

          <Reveal direction="left" as="div" className="p-8 bg-card/40">
            <h3 className="section-label mb-5 text-primary">Como a ATom's entra e transforma</h3>
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
                    {">"}
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