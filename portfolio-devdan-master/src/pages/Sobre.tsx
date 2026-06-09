import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { VapiWidget } from "@/components/VapiWidget";
import { Card } from "@/components/ui/card";
import { Sparkles, Target, Heart, Users, TrendingUp, Zap } from "lucide-react";

const Sobre = () => {
  const values = [
    {
      icon: Sparkles,
      title: "Inovação Contínua",
      description: "Estamos sempre um passo à frente, testando e implementando as mais recentes tecnologias de IA para entregar resultados superiores.",
    },
    {
      icon: Heart,
      title: "Foco no Cliente",
      description: "Cada solução é desenvolvida pensando no sucesso do cliente. Nosso sucesso é medido pelos resultados que você alcança.",
    },
    {
      icon: Users,
      title: "Transparência Total",
      description: "Comunicação clara, expectativas alinhadas e relatórios transparentes. Sem promessas vazias, apenas resultados reais.",
    },
    {
      icon: Zap,
      title: "Execução Ágil",
      description: "Do briefing à implementação em tempo recorde, sem comprometer qualidade. Velocidade é nossa vantagem competitiva.",
    },
  ];

  const journey = [
    {
      year: "2019",
      title: "Início com ERP",
      description: "Fundamos a Atoms focados em sistemas de gestão empresarial tradicionais, atendendo PMEs brasileiras.",
    },
    {
      year: "2021",
      title: "Primeiras Automações",
      description: "Começamos a integrar automações simples nos ERPs, descobrindo o potencial transformador da tecnologia.",
    },
    {
      year: "2023",
      title: "Pivot para IA",
      description: "Com a explosão dos LLMs, vimos a oportunidade de criar algo realmente disruptivo: IA conversacional empresarial.",
    },
    {
      year: "2024",
      title: "Foco Total em IA",
      description: "Reposicionamento completo: IA conversacional como core, ERP como complemento. Parcerias estratégicas com OpenAI e Anthropic.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl animate-glow-pulse" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Sobre a{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Atoms
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              De sistemas tradicionais a IA conversacional de próxima geração
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Somos uma empresa de tecnologia brasileira especializada em soluções de inteligência artificial conversacional para empresas que querem escalar sem aumentar custos.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20 mb-6">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm text-accent font-medium">Nossa Missão</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                  Democratizar o Acesso à IA de Próxima Geração
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Acreditamos que toda empresa, independente do tamanho, merece ter acesso a tecnologia de ponta que antes era privilégio apenas de grandes corporações.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Nossa missão é tornar a IA conversacional acessível, eficaz e lucrativa para negócios de todos os portes, eliminando barreiras técnicas e financeiras.
                </p>
              </div>

              <Card className="p-8 bg-gradient-primary/5 backdrop-blur-sm border-primary/20 animate-slide-up">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Visão</h3>
                    <p className="text-muted-foreground">
                      Ser a referência brasileira em IA conversacional empresarial até 2026, reconhecidos pela qualidade, resultados e suporte excepcional.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">Como Fazemos Isso</h3>
                    <p className="text-muted-foreground">
                      Combinando os melhores modelos de IA do mercado (GPT-4, Claude) com automação inteligente (n8n) e integrações profundas com sistemas reais de negócio.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Nossa Trajetória
              </h2>
              <p className="text-xl text-muted-foreground">
                A evolução de uma empresa de software tradicional para pioneira em IA conversacional
              </p>
            </div>

            <div className="space-y-12">
              {journey.map((milestone, index) => (
                <div 
                  key={index}
                  className="relative pl-8 border-l-2 border-primary/30 animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-primary shadow-glow" />
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-sm font-bold bg-primary/10 text-primary rounded-full">
                      {milestone.year}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{milestone.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Nossos Valores
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Os princípios que guiam cada decisão e cada linha de código
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all hover:shadow-card group text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 mx-auto group-hover:shadow-glow transition-all">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-card/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Time Multidisciplinar
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Nossa equipe combina expertise em engenharia de software, ciência de dados, UX e business intelligence. 
                Somos desenvolvedores, designers, cientistas de dados e especialistas em automação trabalhando juntos.
              </p>
              <Card className="p-8 bg-gradient-primary/5 backdrop-blur-sm border-primary/20">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  <h3 className="text-xl font-bold text-foreground">Crescimento Contínuo</h3>
                </div>
                <p className="text-muted-foreground">
                  Estamos expandindo nossa equipe com os melhores talentos em IA e automação. 
                  Se você é apaixonado por tecnologia e quer fazer parte dessa revolução, entre em contato.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <VapiWidget />
    </div>
  );
};

export default Sobre;
