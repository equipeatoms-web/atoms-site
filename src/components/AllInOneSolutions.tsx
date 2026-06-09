import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Clock, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  Heart, 
  BarChart3, 
  Sparkles,
  ShoppingCart,
  Globe,
  HeadphonesIcon,
  Briefcase,
  Phone,
  UserCircle,
  DollarSign,
  ThumbsUp,
  PhoneCall
} from "lucide-react";

export const AllInOneSolutions = () => {
  const [activeTab, setActiveTab] = useState("chatbots");

  const solutions = {
    chatbots: [
      {
        icon: MessageSquare,
        title: "FAQ IA com Base de Conhecimento",
        description: "Respostas inteligentes e precisas 24/7"
      },
      {
        icon: Clock,
        title: "Atendente de Site 24 Horas",
        description: "Nunca perca um lead por falta de atendimento"
      },
      {
        icon: UserCheck,
        title: "SDR e Qualificação de Leads",
        description: "Qualificação automática de potenciais clientes"
      },
      {
        icon: Calendar,
        title: "Agendamentos Automatizados",
        description: "Agenda inteligente integrada ao seu calendário"
      },
      {
        icon: TrendingUp,
        title: "Nutrição e Follow-up",
        description: "Relacionamento automatizado com leads"
      },
      {
        icon: Heart,
        title: "Pós-Venda e Fidelização",
        description: "Mantenha clientes engajados automaticamente"
      },
      {
        icon: BarChart3,
        title: "Painel Administrativo",
        description: "Gestão e insights em tempo real"
      },
      {
        icon: Sparkles,
        title: "Premium: Multiagentes",
        description: "Áudio, imagem, documentos e integrações ilimitadas",
        premium: true
      }
    ],
    sites: [
      {
        icon: ShoppingCart,
        title: "E-commerce Inteligente + IA",
        description: "Loja online com assistente de vendas IA"
      },
      {
        icon: Globe,
        title: "Landing Page de Conversão com SDR",
        description: "Páginas otimizadas com chatbot integrado"
      },
      {
        icon: HeadphonesIcon,
        title: "Sistema de Atendimento 360°",
        description: "Plataforma completa de suporte ao cliente"
      },
      {
        icon: Briefcase,
        title: "Portal Corporativo Inteligente",
        description: "Intranet com IA para sua empresa"
      },
      {
        icon: Calendar,
        title: "Plataforma de Agendamentos",
        description: "Sistema robusto de marcação e gestão"
      },
      {
        icon: ShoppingCart,
        title: "Sistema de Pedidos + Chat de Vendas",
        description: "Vendas integradas com IA conversacional"
      },
      {
        icon: BarChart3,
        title: "Painel de Leads e CRM Inteligente",
        description: "Gestão completa com insights de IA"
      }
    ],
    voice: [
      {
        icon: Phone,
        title: "Ligador de Leads Inteligente",
        description: "Ligações automatizadas com IA humanizada"
      },
      {
        icon: Calendar,
        title: "Confirmador de Agendamentos por Voz",
        description: "Reduz no-show em até 70%"
      },
      {
        icon: DollarSign,
        title: "Cobrança Humanizada",
        description: "Recuperação de pagamentos com empatia"
      },
      {
        icon: ThumbsUp,
        title: "Pesquisa de Satisfação (NPS Voice)",
        description: "Coleta de feedback por telefone"
      },
      {
        icon: PhoneCall,
        title: "Follow-up por Voz",
        description: "Acompanhamento proativo de clientes"
      },
      {
        icon: UserCircle,
        title: "Recepcionista Virtual IA",
        description: "Atendimento telefônico 24/7"
      }
    ]
  };

  const tabs = [
    { id: "chatbots", label: "Chatbots e IA", icon: MessageSquare },
    { id: "sites", label: "Sites e Sistemas", icon: Globe },
    { id: "voice", label: "IA de Voz", icon: Phone }
  ];

  return (
    <section className="py-24 bg-gradient-subtle relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Tudo que Seu Negócio Precisa em Um Só Lugar
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluções completas de automação e IA
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {solutions[activeTab as keyof typeof solutions].map((solution, index) => (
            <Card 
              key={index}
              className={`p-6 glass glass-highlight border-0 hover:border-primary/50 transition-all hover:shadow-card group animate-slide-up ${
                solution.premium ? 'border-accent/50 bg-accent/5' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                solution.premium 
                  ? 'bg-gradient-to-br from-accent to-accent/70' 
                  : 'bg-gradient-primary'
              } group-hover:shadow-glow transition-all`}>
                <solution.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              
              <h3 className="text-lg font-bold mb-2 text-foreground">
                {solution.title}
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                {solution.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
