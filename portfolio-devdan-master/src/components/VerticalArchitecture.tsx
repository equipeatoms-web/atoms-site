import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animations/gsap";
import { ScrollTrigger } from "@/lib/animations/gsap";
import {
  Video,
  Target,
  MessageSquareCode,
  DollarSign,
  Cpu,
  ArrowDown
} from "lucide-react";
import { GlowCard } from "@/components/ui/spotlight-card";
import { LiveChat, ChatMessage } from "@/components/ui/live-chat";
import { GridBeam } from "@/components/ui/background-grid-beam";

interface AgentStepProps {
  number: string;
  title: string;
  icon: any;
  role: string;
  description: string;
  tech: string[];
  chat: ChatMessage[];
  chatStyle: "whatsapp" | "slack" | "email" | "acervo" | "default";
  ChatIcon: any;
  index: number;
}

const AgentStep = ({ number, title, icon: Icon, role, description, tech, chat, chatStyle, ChatIcon, index }: AgentStepProps) => {
  const isEven = index % 2 === 0;

  return (
    <div className="agent-step-item relative py-10 md:py-16 opacity-0">
      {/* Central line connector — desktop only */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-primary/10 -translate-x-1/2 z-0 hidden md:block" />

      {/* Mobile layout: card → icon → chat stacked */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex items-center gap-3 mb-1">
          <div className="agent-icon-wrap w-9 h-9 rounded-full border border-primary/30 bg-background flex items-center justify-center text-primary shadow-[0_0_16px_hsl(var(--primary)/0.15)] shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-primary/70 font-semibold">{role}</span>
        </div>
        <GlowCard className="p-5 backdrop-blur-md">
          <div className="absolute top-3 right-3 text-primary/20 font-serif text-sm font-bold">{number}</div>
          <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
          <p className="text-xs text-muted-foreground font-light leading-relaxed mb-3">{description}</p>
          <div className="flex flex-wrap gap-1">
            {tech.map((t) => (
              <span key={t} className="text-[9px] px-2 py-0.5 bg-background/80 border border-primary/10 text-muted-foreground/90 rounded-sm">{t}</span>
            ))}
          </div>
        </GlowCard>
        <LiveChat messages={chat} agentName={title} AgentIcon={ChatIcon} style={chatStyle} />
      </div>

      {/* Desktop layout: alternating grid */}
      <div className={`hidden md:grid md:grid-cols-12 gap-8 items-center`}>
        <div className={`md:col-span-5 ${isEven ? "md:order-1" : "md:order-3"}`}>
          <GlowCard className="p-6 backdrop-blur-md hover:shadow-[var(--shadow-glow)] transition-shadow duration-300 text-center">
            <div className="absolute top-3 right-3 text-primary/30 font-serif text-lg font-bold">{number}</div>
            <span className="text-[10px] uppercase tracking-widest text-primary/80 font-semibold mb-2 block">{role}</span>
            <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">{description}</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {tech.map((t) => (
                <span key={t} className="text-[9px] px-2 py-0.5 bg-background/80 border border-primary/10 text-muted-foreground/90 rounded-sm">{t}</span>
              ))}
            </div>
          </GlowCard>
        </div>
        <div className="md:col-span-2 md:order-2 flex justify-center z-10">
          <div className="agent-icon-wrap w-12 h-12 rounded-full border border-primary/30 bg-background flex items-center justify-center text-primary shadow-[0_0_20px_hsl(var(--primary)/0.15)] transition-all duration-500">
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className={`md:col-span-5 ${isEven ? "md:order-3" : "md:order-1"}`}>
          <LiveChat messages={chat} agentName={title} AgentIcon={ChatIcon} style={chatStyle} />
        </div>
      </div>
    </div>
  );
};

export const VerticalArchitecture = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      number: "01",
      title: "Agente Audiovisual",
      role: "Motion & Criação de Conteúdo",
      icon: Video,
      chatStyle: "acervo" as const,
      ChatIcon: Video,
      description: "Transcreve briefings, renderiza vídeos curtos em lotes e automatiza a geração de ativos visuais em massa para marketing e produtos.",
      tech: ["Postar vídeos", "Editar cortes automáticos", "Transcrever áudios", "Gerar criativos"],
      chat: [
        { from: "system", text: "Acervo Atoms — Audiovisual", delay: 0 },
        { from: "agent", text: "Briefing recebido. Encontrei 14 clipes do seu evento de outubro no acervo.", delay: 600 },
        { from: "user", text: "Quero um corte de 30s pra Instagram com legenda.", delay: 1200 },
        { from: "agent", text: "Gerando corte 9:16 com legenda automática. Pronto — salvo no acervo e agendado para amanhã às 9h.", delay: 1000 },
      ] as ChatMessage[],
    },
    {
      number: "02",
      title: "Agente Gestor de Tráfego",
      role: "Distribuição & Otimização de Lances",
      icon: Target,
      chatStyle: "whatsapp" as const,
      ChatIcon: Target,
      description: "Monitora o ROI de campanhas de anúncios em tempo real, ajusta bids automaticamente e aloca verba entre Meta Ads e Google Ads.",
      tech: ["Postar campanhas", "Gerir verbas", "Testar anúncios", "Realocar metas"],
      chat: [
        { from: "system", text: "Atoms — Gestor de Tráfego", delay: 0 },
        { from: "agent", text: "CPA subiu 23% na campanha de remarketing. Pausei o conjunto com pior CTR.", delay: 600 },
        { from: "user", text: "Realoca a verba pro criativo B que tá performando.", delay: 900 },
        { from: "agent", text: "Feito. Criativo B agora com 60% do budget. CPA projetado: R$ 11,20.", delay: 800 },
      ] as ChatMessage[],
    },
    {
      number: "03",
      title: "Agente de Atendimento",
      role: "Triagem Conversacional & Vendas",
      icon: MessageSquareCode,
      chatStyle: "whatsapp" as const,
      ChatIcon: MessageSquareCode,
      description: "Interage diretamente com leads no WhatsApp, qualifica de acordo com o playbook da empresa e agenda reuniões diretamente no calendário.",
      tech: ["Qualificar leads", "Responder clientes 24/7", "Agendar reuniões", "Atualizar CRM"],
      chat: [
        { from: "system", text: "Lead novo — canal direto", delay: 0 },
        { from: "user", text: "Vi o anúncio. Quero saber mais sobre o sistema de IA.", delay: 500 },
        { from: "agent", text: "Que tipo de empresa você tem e qual o maior gargalo hoje — atendimento, financeiro ou marketing?", delay: 800 },
        { from: "user", text: "Clínica odontológica. Perco lead por não responder rápido.", delay: 900 },
        { from: "agent", text: "Entendido. Agenda uma call de 30min? Tenho quinta às 15h disponível.", delay: 700 },
      ] as ChatMessage[],
    },
    {
      number: "04",
      title: "Agente Financeiro",
      role: "Faturamento & Cobrança Automática",
      icon: DollarSign,
      chatStyle: "slack" as const,
      ChatIcon: DollarSign,
      description: "Emite links de pagamento e Pix, envia alertas amigáveis de cobrança e faz a conciliação automática ligando o banco ao CRM.",
      tech: ["Emitir Notas Fiscais", "Cobrar inadimplentes", "Conciliar Pix/Cartão", "Gerar links Pix"],
      chat: [
        { from: "system", text: "Financeiro — Atoms Bot", delay: 0 },
        { from: "agent", text: "Pix confirmado: R$ 3.200 de Clínica Sorriso. CRM atualizado.", delay: 600 },
        { from: "agent", text: "3 clientes com fatura vencida há 5 dias. Enviando cobrança agora.", delay: 400 },
        { from: "user", text: "Gera NF pra todos os pagamentos de maio.", delay: 900 },
        { from: "agent", text: "12 NFs emitidas e enviadas por e-mail. Planilha atualizada.", delay: 700 },
      ] as ChatMessage[],
    },
    {
      number: "05",
      title: "Dev-Agent (AI Developer)",
      role: "Automação e Deploy de Microserviços",
      icon: Cpu,
      chatStyle: "default" as const,
      ChatIcon: Cpu,
      description: "Cria webhooks, monitora a infraestrutura do ecossistema Atoms e executa correções autônomas em scripts de integração.",
      tech: ["Integrar sistemas", "Criar webhooks", "Corrigir bugs", "Monitorar servidores"],
      chat: [
        { from: "system", text: "Dev-Agent — Sistema", delay: 0 },
        { from: "agent", text: "Webhook do Mercado Pago retornando 422. Investigando payload.", delay: 500 },
        { from: "agent", text: "Problema identificado: campo transaction_amount vindo como string. Aplicando fix.", delay: 600 },
        { from: "agent", text: "Deploy concluído. Webhook operacional. 0 erros nos últimos 10 min.", delay: 500 },
      ] as ChatMessage[],
    },
  ];

  useGSAP(() => {
    if (!containerRef.current) return;

    // Energy pulse travels down the pipeline track on scroll
    const pulse = containerRef.current.querySelector(".timeline-pulse");
    const track = containerRef.current.querySelector(".relative.max-w-5xl");
    if (pulse && track) {
      gsap.fromTo(
        pulse,
        { y: 0, opacity: 0 },
        {
          y: () => (track as HTMLElement).offsetHeight - 120,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // Fade cards in as they enter — no scrub so they don't stay dim while scrolling
    const stepsElements = containerRef.current.querySelectorAll(".agent-step-item");
    stepsElements.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // Give a tiny glow highlight to the center icon when active
      const icon = el.querySelector(".agent-icon-wrap");
      if (icon) {
        gsap.to(icon, {
          borderColor: "hsl(38 80% 60%)",
          scale: 1.12,
          backgroundColor: "hsl(38 33% 10%)",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 40%",
            toggleActions: "play reverse play reverse",
            scrub: 0.3,
          }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section id="arquitetura" ref={containerRef} className="py-32 bg-background relative overflow-hidden">
      {/* Grid beam background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <GridBeam className="w-full h-full bg-grid opacity-100">{null}</GridBeam>
      </div>

      {/* Decorative vertical lights */}
      <div className="absolute right-[-10%] top-[20%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-[-15%] bottom-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 border border-primary/20 bg-background/60 px-3.5 py-1.5 rounded-sm mb-6 backdrop-blur-md">
            <Cpu className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-bold">
              Ecossistema Atoms
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-6xl text-foreground mb-6 leading-tight tracking-tight">
            Pipeline de Agentes <em className="text-primary italic">Verticais.</em>
          </h2>
          <p className="text-[16px] text-muted-foreground max-w-xl mx-auto leading-[1.65] font-light">
            Sua empresa não precisa de ferramentas avulsas. Precisa de agentes verticais que recebem o input, geram o ativo, distribuem e cuidam do caixa integrados na mesma pipeline.
          </p>
        </div>

        {/* Steps Pipeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glowing particle timeline track indicator */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary/30 via-primary/5 to-transparent -translate-x-1/2 pointer-events-none hidden sm:block" />
          {/* Energy pulse flowing down the pipeline */}
          <div className="timeline-pulse absolute left-6 md:left-1/2 top-4 w-[2px] h-24 -translate-x-1/2 pointer-events-none hidden sm:block bg-gradient-to-b from-transparent via-primary/80 to-transparent shadow-[0_0_16px_hsl(var(--primary)/0.6)]" />

          <div className="flex flex-col">
            {steps.map((step, idx) => (
              <AgentStep key={idx} {...step} index={idx} />
            ))}
          </div>
        </div>

        {/* Connect footer */}
        <div className="flex flex-col items-center justify-center mt-16">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary/20 bg-background mb-4">
            <ArrowDown className="w-4 h-4 text-primary/70 animate-bounce" />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
            Fluxo de entrega contínua de IA
          </span>
        </div>
      </div>
    </section>
  );
};
