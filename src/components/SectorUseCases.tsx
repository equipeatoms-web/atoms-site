import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, 
  GraduationCap, 
  ShoppingCart, 
  Home, 
  DollarSign, 
  UtensilsCrossed,
  Dumbbell,
  Scale,
  Car,
  Scissors
} from "lucide-react";
import { useState } from "react";
import { scrollToId } from "@/lib/animations/scroll";

export const SectorUseCases = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const scrollToForm = () => scrollToId("contato");

  const sectors = [
    {
      icon: Stethoscope,
      title: "Saúde e Clínicas",
      gradient: "from-blue-500 to-cyan-500",
      useCases: [
        "Agendamento automático de consultas",
        "Confirmação e lembretes por voz",
        "Triagem inicial de pacientes via IA",
        "Follow-up pós-consulta automatizado",
        "FAQ sobre procedimentos e preparos"
      ],
      detailedInfo: "Reduza no-shows em até 70% e libere sua equipe para focar no que realmente importa: o cuidado com os pacientes."
    },
    {
      icon: GraduationCap,
      title: "Educação",
      gradient: "from-purple-500 to-pink-500",
      useCases: [
        "Atendimento a alunos e responsáveis 24/7",
        "Matrículas e rematrículas automatizadas",
        "Suporte para dúvidas sobre cursos",
        "Agendamento de aulas experimentais",
        "Envio de materiais e informações"
      ],
      detailedInfo: "Aumente a conversão de matrículas em 50% com atendimento inteligente e personalizado."
    },
    {
      icon: ShoppingCart,
      title: "E-commerce e Varejo",
      gradient: "from-green-500 to-emerald-500",
      badge: "Mais Procurado",
      useCases: [
        "Assistente de vendas com IA",
        "Recomendações personalizadas de produtos",
        "Acompanhamento de pedidos automatizado",
        "Recuperação de carrinhos abandonados",
        "Atendimento pós-venda inteligente"
      ],
      detailedInfo: "Recupere até 40% dos carrinhos abandonados e aumente seu ticket médio com recomendações inteligentes."
    },
    {
      icon: Home,
      title: "Imobiliário",
      gradient: "from-orange-500 to-red-500",
      useCases: [
        "Qualificação automática de leads",
        "Agendamento de visitas a imóveis",
        "Informações sobre propriedades disponíveis",
        "Follow-up inteligente com interessados",
        "Envio automático de documentação"
      ],
      detailedInfo: "Aumente em 65% a conversão de agendamentos e qualifique leads automaticamente."
    },
    {
      icon: DollarSign,
      title: "Serviços Financeiros",
      gradient: "from-yellow-500 to-amber-500",
      useCases: [
        "Cobrança humanizada e inteligente",
        "Negociação de dívidas automatizada",
        "Lembretes de vencimento",
        "Confirmação de pagamentos",
        "Atendimento sobre produtos financeiros"
      ],
      detailedInfo: "Melhore em 67% a taxa de recuperação de crédito com abordagem empática e profissional."
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurantes e Delivery",
      gradient: "from-red-500 to-pink-500",
      useCases: [
        "Sistema de pedidos por voz",
        "Confirmação e acompanhamento de entregas",
        "Reservas de mesa automatizadas",
        "Cardápio interativo via IA",
        "Coleta de feedback dos clientes"
      ],
      detailedInfo: "Processe pedidos via WhatsApp e telefone, reduza erros e melhore a experiência do cliente."
    },
    {
      icon: Dumbbell,
      title: "Academias e Bem-estar",
      gradient: "from-indigo-500 to-purple-500",
      useCases: [
        "Agendamento de aulas e treinos",
        "Lembretes de treino personalizados",
        "Orientações sobre planos e modalidades",
        "Follow-up de evolução do aluno",
        "Renovação automática de planos"
      ],
      detailedInfo: "Reduza a evasão e aumente a retenção de alunos com engajamento automatizado."
    },
    {
      icon: Scale,
      title: "Advocacia e Consultoria",
      gradient: "from-slate-500 to-zinc-500",
      useCases: [
        "Triagem e qualificação de casos",
        "Agendamento de consultas jurídicas",
        "FAQ sobre serviços e procedimentos",
        "Acompanhamento de processos",
        "Lembretes de prazos e audiências"
      ],
      detailedInfo: "Triplique o número de propostas enviadas com pré-qualificação automática de clientes."
    },
    {
      icon: Car,
      title: "Automotivo",
      gradient: "from-blue-600 to-indigo-600",
      useCases: [
        "Agendamento de test-drive",
        "Informações sobre veículos disponíveis",
        "Lembretes de revisão e manutenção",
        "Cotação de seguros e financiamentos",
        "Follow-up pós-venda"
      ],
      detailedInfo: "Qualifique leads e agende test-drives automaticamente, aumentando suas conversões."
    },
    {
      icon: Scissors,
      title: "Beleza e Estética",
      gradient: "from-pink-500 to-rose-500",
      useCases: [
        "Agendamento online 24/7",
        "Confirmações automáticas",
        "Lembretes personalizados",
        "Sugestões de serviços baseadas em histórico",
        "Programas de fidelidade automatizados"
      ],
      detailedInfo: "Mantenha sua agenda sempre cheia com agendamentos inteligentes e lembretes que reduzem faltas."
    }
  ];

  return (
    <section id="setores" className="py-24 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
            Soluções por Setor
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            IA aplicada às necessidades específicas do seu negócio
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16">
          {sectors.map((sector, index) => (
            <Card
              key={index}
              className="p-6 glass glass-highlight border-0 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-glow cursor-pointer group animate-slide-up relative"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setExpandedCard(expandedCard === index ? null : index)}
            >
              {/* Badge */}
              {sector.badge && (
                <div className="absolute top-4 right-4 px-3 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                  {sector.badge}
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${sector.gradient} p-4 mb-6 group-hover:shadow-glow transition-all flex items-center justify-center`}>
                <sector.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold mb-4 text-foreground">{sector.title}</h3>

              {/* Use Cases */}
              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  Principais Aplicações:
                </p>
                {sector.useCases.map((useCase, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${sector.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">{useCase}</p>
                  </div>
                ))}
              </div>

              {/* Expanded Details */}
              {expandedCard === index && (
                <div className="pt-4 border-t border-border animate-fade-in">
                  <p className="text-sm text-muted-foreground italic">
                    {sector.detailedInfo}
                  </p>
                </div>
              )}

              {/* Expand Indicator */}
              <div className="flex items-center justify-center mt-4 text-xs text-primary">
                <span className="mr-1">
                  {expandedCard === index ? "Ver menos" : "Ver mais"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    expandedCard === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Não encontrou seu setor? Personalizamos soluções para qualquer negócio
          </p>
          <Button
            size="lg"
            onClick={scrollToForm}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow"
          >
            Fale com Especialista
          </Button>
        </div>
      </div>
    </section>
  );
};
