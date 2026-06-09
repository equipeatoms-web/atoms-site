import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Database, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import aiChatIcon from "@/assets/icon-ai-chat.png";
import voiceAiIcon from "@/assets/icon-voice-ai.png";
import erpIcon from "@/assets/icon-erp-integration.png";

export const ModulesOfferings = () => {
  const modules = [
    {
      icon: MessageSquare,
      image: aiChatIcon,
      title: "IA Conversacional - Chat",
      badge: "Principal",
      description: "Chatbots inteligentes multi-canal que atendem, qualificam e convertem 24/7.",
      features: [
        "WhatsApp Business API integrado",
        "Facebook, Instagram, Telegram",
        "Chat no site com widget customizável",
        "Base de conhecimento com RAG",
        "Qualificação e scoring de leads",
        "Agendamentos automatizados",
      ],
      cta: "Ver Detalhes",
      link: "/solucoes",
    },
    {
      icon: Phone,
      image: voiceAiIcon,
      title: "IA Conversacional - Voz",
      badge: "Premium",
      description: "Agentes de voz humanizados que ligam, confirmam e vendem por telefone.",
      features: [
        "Ligações de follow-up automatizadas",
        "Confirmação de agendamentos",
        "Pesquisas de satisfação (NPS)",
        "Cobrança amigável e eficaz",
        "Pré-venda e qualificação telefônica",
        "Integração com discadores",
      ],
      cta: "Ver Detalhes",
      link: "/solucoes",
    },
    {
      icon: Database,
      image: erpIcon,
      title: "Módulo ERP Complementar",
      badge: "Add-on",
      description: "Sistema de gestão que se integra perfeitamente com a IA conversacional.",
      features: [
        "CRM integrado com conversas",
        "Gestão financeira e cobranças",
        "Controle de estoque e pedidos",
        "Relatórios e analytics unificados",
        "Automação de workflows",
        "API aberta para integrações",
      ],
      cta: "Ver Detalhes",
      link: "/solucoes",
    },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Módulos e Ofertas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções modulares que se adaptam às necessidades do seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {modules.map((module, index) => (
            <Card 
              key={index}
              className="p-8 glass glass-highlight border-0 hover:border-primary/50 transition-all hover:shadow-card group flex flex-col animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                {module.image ? (
                  <div className="w-16 h-16">
                    <img src={module.image} alt={module.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-all">
                    <module.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                )}
                <Badge variant={module.badge === "Principal" ? "default" : module.badge === "Premium" ? "secondary" : "outline"}>
                  {module.badge}
                </Badge>
              </div>

              <h3 className="text-2xl font-bold mb-3 text-foreground">{module.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">{module.description}</p>

              <div className="space-y-2 mb-8 flex-grow">
                {module.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to={module.link} className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  {module.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
