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
                Atendo múltiplas empresas — <em className="text-primary not-italic italic">com metodologia</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                Não sou exclusivo de uma empresa porque não preciso ser. Cada cliente tem seu próprio sistema, isolado e dedicado. Minha metodologia foi feita para rodar em paralelo sem perder qualidade.
              </p>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Isso também significa que o que aprendo com cada setor melhora o que entrego nos outros.
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
