import { motion } from "framer-motion";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { fadeUp } from "@/lib/animations/variants";
import { scrollToId } from "@/lib/animations/scroll";
import { MagneticButton } from "@/components/motion/MagneticButton";

type Step = {
  step: string;
  title: string;
  desc: string;
  signature: string;
};

export const TeamEnablement = () => {
  const steps: Step[] = [
    {
      step: "01",
      title: "Documentação viva",
      desc: "Cada agente, cada integração, cada prompt fica documentado no Notion (ou na ferramenta que você já usa). Em linguagem que seu time entende, não em jargão de dev.",
      signature: "Quem fica com isso: ops e marketing",
    },
    {
      step: "02",
      title: "Treinamento ao vivo",
      desc: "Duas sessões de 90 min com seu time, gravadas. Mostro como ajustar prompt, como ler o dashboard, como subir um novo fluxo simples sem me chamar.",
      signature: "Quem fica com isso: quem opera WhatsApp e CRM",
    },
    {
      step: "03",
      title: "Playbook de manutenção",
      desc: "Lista do que seu time pode mexer sozinho, do que precisa me chamar e do que pede dev. Sem zona cinzenta. Sem 'será que pode?'.",
      signature: "Quem fica com isso: dono, CEO ou head de ops",
    },
  ];

  const proofs = [
    "Cada ajuste de mensagem virava ticket aberto, espera de 3 dias e fatura extra → seu time muda o tom da resposta em 5 minutos, sem abrir chamado",
    "Atendente que cobria 8h de chat → realocada para estratégia de retenção e venda",
    "Marketing que esperava o dev pra publicar → publica campanha sozinho com IA + back-office",
  ];

  return (
    <section id="capacitacao" className="py-32 relative overflow-hidden">
      {/* Subtle aurora behind */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(38 33% 70% / 0.06), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="hidden lg:block absolute -right-12 top-12 font-serif text-[14rem] leading-none text-foreground/[0.025] select-none pointer-events-none"
      >
        IA
      </div>

      <div className="container mx-auto px-6 relative">
        <Reveal>
          <div className="section-label mb-4">Capacito seu time</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] mb-6 max-w-3xl">
            Eu construo. Seu time opera.
            <br />
            <em className="text-primary not-italic italic">Sem ficar refém de mim.</em>
          </h2>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground max-w-2xl leading-[1.65] font-light mb-2">
            Sistema de IA que só você sabe mexer vira gargalo em 30 dias. Por isso, no go-live, eu treino quem vai operar — atendimento, marketing, ops — em 3 passos.
          </p>
          <p className="text-[14px] text-primary/90 uppercase tracking-[0.15em] mb-16 inline-block glass-chip">
            Incluso no projeto · sem custo adicional
          </p>
        </Reveal>

        {/* 3-step methodology */}
        <StaggerGroup stagger={0.12} className="grid md:grid-cols-3 gap-px bg-border rounded-sm overflow-hidden glass mb-16">
          {steps.map((s) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-card/60 p-8 lg:p-10 group relative overflow-hidden flex flex-col"
            >
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="font-serif text-5xl mb-5 bg-gradient-accent bg-clip-text text-transparent leading-none">
                {s.step}
              </div>
              <div className="font-serif text-2xl text-foreground mb-3 leading-tight">
                {s.title}
              </div>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 flex-1">
                {s.desc}
              </p>
              <div className="pt-4 mt-auto border-t border-border/50 text-[11px] uppercase tracking-widest text-primary">
                → {s.signature}
              </div>
            </motion.div>
          ))}
        </StaggerGroup>

        {/* Before / After anchor */}
        <Reveal>
          <div className="glass glass-highlight rounded-sm p-8 lg:p-10 max-w-4xl mx-auto">
            <div className="section-label mb-6">O que muda quando entro na operação</div>
            <ul className="space-y-4">
              {proofs.map((p) => {
                const [before, after] = p.split(" → ");
                return (
                  <li key={p} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[15px] leading-relaxed">
                    <span className="flex-1 text-muted-foreground line-through decoration-muted-foreground/40">
                      {before}
                    </span>
                    <span aria-hidden className="text-primary text-xl shrink-0">→</span>
                    <span className="flex-1 text-foreground/95 font-medium">
                      {after}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* Strong hook CTA */}
        <Reveal delay={0.2}>
          <div className="mt-16 text-center">
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed mb-6">
              <span className="text-foreground/90">Quer seu time autônomo, operando sem depender de mim?</span>
              <br />
              Treinamento gravado. Seu time revê quando quiser.
            </p>
            <MagneticButton
              onClick={() => scrollToId("contato")}
              strength={0.25}
              className="inline-flex bg-primary text-primary-foreground px-8 py-4 text-sm font-medium rounded-sm shadow-glow btn-glow tracking-wide"
            >
              Quero meu time autônomo →
            </MagneticButton>
            <div className="text-[11px] text-muted-foreground/60 tracking-widest uppercase mt-4">
              Incluso no projeto · sem custo adicional · gravado em vídeo
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
