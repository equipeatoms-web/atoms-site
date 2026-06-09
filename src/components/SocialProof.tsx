import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";

export const SocialProof = () => {
  const stats: { value: number; label: string; suffix?: string }[] = [
    { value: 24, label: "Cobertura", suffix: "h" },
    { value: 8, label: "Sub-agentes ativos", suffix: "+" },
    { value: 0, label: "Ligação perdida" },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl">
            <Reveal>
              <div className="section-label mb-4">Diferencial</div>
              <h2 className="font-serif text-3xl sm:text-5xl text-foreground leading-tight mb-4">
                Imagine abrir o relatório de segunda-feira e ver que sua empresa <em className="text-primary not-italic italic">vendeu, atendeu e cobrou — sem ninguém trabalhar no fim de semana.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                Seus concorrentes vão continuar dependendo de equipe para cada processo. Você pode operar diferente — com agentes de IA integrados que não descansam, não esquecem e não erram por cansaço.
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Isso não é visão de futuro. É o que a ATom's entrega — com sistema em produção, integrado ao seu negócio real.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-4xl text-primary mb-1">
                      <CountUp to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[11px] tracking-widest uppercase text-muted-foreground/70">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
      </div>
    </section>
  );
};
