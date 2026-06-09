import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { Reveal } from "@/components/motion/Reveal";

export const MainSolution = () => {
  const steps = [
    { n: "01", title: "Diagnóstico de negócio", desc: "Eu sento com você (ou com seu time) e mapeio onde a IA paga a conta: gargalo de atendimento, custo por lead, abandono no checkout, retrabalho do time.", deliver: "Mapa de processos + ROI estimado · em 1 semana" },
    { n: "02", title: "Arquitetura técnica", desc: "Escolho a stack pelo seu problema, não pelo hype. Multi-agente quando faz sentido, automação simples quando resolve. Tudo no seu domínio, no seu banco, com seu time operando.", deliver: "Diagrama + stack + escopo fechado · em 1 semana" },
    { n: "03", title: "Construção e integração", desc: "Aqui eu codifico, integro e testo. WhatsApp Cloud, Mercado Pago, Stripe, Google Calendar, n8n, Supabase, ERPs e CRMs que você já usa. Sem reinventar roda.", deliver: "Produção + 1 fluxo crítico no ar · 2 a 4 semanas" },
    { n: "04", title: "Operação assistida", desc: "Vou junto nos primeiros 60 dias. Acompanho métrica, ajusto prompt, escalo capacidade, treino seu time pra operar sem depender de mim.", deliver: "Dashboard + 2 ajustes/mês · 60 dias inclusos" },
  ];

  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    if (window.innerWidth < 1024) return;

    const cards = sectionRef.current.querySelectorAll(".phase-card");
    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 80,
        filter: "blur(10px)",
        stagger: 0.18,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, { scope: sectionRef });

  return (
    <section id="metodologia" ref={sectionRef} className="py-24 relative">
      <div
        aria-hidden
        className="hidden lg:block absolute -left-12 top-24 font-serif text-[14rem] leading-none text-foreground/[0.025] select-none pointer-events-none"
      >
        04
      </div>
      <div className="container mx-auto px-6 relative">
        <Reveal>
          <div className="section-label mb-6">O método</div>
          <h2 className="font-serif text-4xl sm:text-6xl text-foreground mb-4 max-w-3xl leading-[1.05]">
            Em 6 semanas, sua operação pode rodar com{" "}
            <em className="text-primary italic">menos gente, mais receita</em>{" "}
            e zero retrabalho.
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-2xl leading-relaxed">
            Ou você continua operando igual.
          </p>
          <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground/60 mt-6">
            4 fases · linha do tempo total de 3 a 6 semanas
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-sm overflow-hidden glass">
          {steps.map((s) => (
            <motion.div
              key={s.n}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="phase-card bg-card/60 p-8 relative group overflow-hidden"
            >
              <div className="font-serif text-6xl mb-5 bg-gradient-accent bg-clip-text text-transparent leading-none">
                {s.n}
              </div>
              <div className="text-sm font-medium text-primary mb-2 tracking-wide">{s.title}</div>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{s.desc}</p>
              <div className="pt-3 mt-3 border-t border-border/60 text-[11px] uppercase tracking-widest text-muted-foreground/80">
                → {s.deliver}
              </div>
              <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-gradient-to-r from-primary/80 to-transparent" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
