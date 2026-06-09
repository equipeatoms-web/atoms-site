import { Card } from "@/components/ui/card";
import { ClipboardList, Settings, Rocket, TrendingUp } from "lucide-react";
import diagnosisIcon from "@/assets/icon-diagnosis.png";
import customizationIcon from "@/assets/icon-customization.png";
import launchIcon from "@/assets/icon-launch.png";
import evolutionIcon from "@/assets/icon-evolution.png";

export const HowItWorks = () => {
  const steps = [
    {
      icon: ClipboardList,
      image: diagnosisIcon,
      title: "Diagnóstico",
      description: "Analisamos seu negócio e identificamos oportunidades de automação",
      number: "01",
    },
    {
      icon: Settings,
      image: customizationIcon,
      title: "Personalização",
      description: "Desenvolvemos a solução sob medida com suas regras e integrações",
      number: "02",
    },
    {
      icon: Rocket,
      image: launchIcon,
      title: "Implementação",
      description: "Colocamos tudo no ar com treinamento da sua equipe",
      number: "03",
    },
    {
      icon: TrendingUp,
      image: evolutionIcon,
      title: "Evolução Contínua",
      description: "Atualizamos prompts, ajustamos fluxos e otimizamos resultados",
      number: "04",
    },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Seu Negócio Automatizado em 4 Passos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Processo simples e eficiente do início ao fim
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden lg:block relative">
            {/* Timeline line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-accent" />

            <div className="grid grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="relative animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Number badge */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow z-10">
                    {step.number}
                  </div>

                  <Card className="p-6 glass glass-highlight border-0 hover:border-primary/50 transition-all hover:shadow-card mt-36">
                    {step.image ? (
                      <div className="w-20 h-20 mb-6 mx-auto">
                        <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 mx-auto">
                        <step.icon className="w-8 h-8 text-primary-foreground" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-3 text-foreground text-center">{step.title}</h3>
                    <p className="text-muted-foreground text-center leading-relaxed">{step.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Timeline */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-6">
                  {/* Number badge */}
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow flex-shrink-0">
                    {step.number}
                  </div>

                  <Card className="flex-1 p-6 glass glass-highlight border-0 hover:border-primary/50 transition-all hover:shadow-card">
                    <div className="flex items-start gap-4">
                      {step.image ? (
                        <div className="w-16 h-16 flex-shrink-0">
                          <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                          <step.icon className="w-7 h-7 text-primary-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="ml-6 w-0.5 h-8 bg-gradient-accent my-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
