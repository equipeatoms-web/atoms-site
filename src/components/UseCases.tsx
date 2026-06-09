import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { fadeUp } from "@/lib/animations/variants";
import { CircularGallery } from "@/components/ui/circular-gallery";

type Section = { title: string; items: string[] };

type ClientCase = {
  sector: string;
  tag: string;
  name: string;
  desc: string;
  sections: Section[];
  result: string;
  photo: string;
};

type Platform = {
  brand: string;
  tagline: string;
  desc: string;
  agents: string[];
  signature: string;
};

export const UseCases = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const galleryItems = [
    {
      label: "Landing Page com IA",
      sector: "Conversão & Captação",
      result: "+38% conversão · 0 lead sem retorno",
      photo: { url: "", text: "" },
      metrics: [
        { value: "+38%", label: "conversão média" },
        { value: "< 5s", label: "tempo de resposta" },
        { value: "24/7", label: "qualificação ativa" },
        { value: "0", label: "leads perdidos" },
      ],
      features: ["Formulário com qualificação por IA", "Chat integrado ao WhatsApp", "Back-office editável sem dev", "A/B test automático de CTA"],
    },
    {
      label: "IA Conversacional — Chat",
      sector: "Atendimento & Vendas",
      result: "24/7 sem SDR · 80% menos custo de triagem",
      photo: { url: "", text: "" },
      metrics: [
        { value: "80%", label: "menos custo triagem" },
        { value: "45%", label: "mais conversão" },
        { value: "24/7", label: "atendimento ativo" },
        { value: "70%", label: "CPL reduzido" },
      ],
      features: ["WhatsApp Business API oficial", "RAG sobre base de conhecimento", "Scoring automático de leads", "Handoff suave para humano"],
    },
    {
      label: "IA Conversacional — Voz",
      sector: "Call Center & Follow-up",
      result: "80% menor custo · escala infinita",
      photo: { url: "", text: "" },
      metrics: [
        { value: "80%", label: "menor custo" },
        { value: "70%", label: "menos no-show" },
        { value: "35%+", label: "mais conversão" },
        { value: "∞", label: "ligações simultâneas" },
      ],
      features: ["Voz neural ultra-realista", "Agendamento durante a ligação", "Transcrição em tempo real", "Relatório por chamada"],
    },
    {
      label: "Módulo ERP",
      sector: "Gestão & Operações",
      result: "CRM + Financeiro + IA numa pipeline só",
      photo: { url: "", text: "" },
      metrics: [
        { value: "60%", label: "menos retrabalho" },
        { value: "360°", label: "visão do cliente" },
        { value: "0", label: "gap entre canais" },
        { value: "RT", label: "dados em tempo real" },
      ],
      features: ["CRM com histórico unificado", "Conciliação Pix/Cartão automática", "Emissão de NF automática", "API aberta para integrações"],
    },
    {
      label: "Analytics & Inteligência",
      sector: "Dados & Decisão",
      result: "3x mais velocidade · alertas antes da crise",
      photo: { url: "", text: "" },
      metrics: [
        { value: "3x", label: "velocidade de decisão" },
        { value: "100%", label: "KPIs em tempo real" },
        { value: "0", label: "relatório manual" },
        { value: "auto", label: "alertas de anomalia" },
      ],
      features: ["KPIs por agente e por canal", "Forecast com confidence range", "Briefing executivo diário", "Exportação Sheets / BI"],
    },
    {
      label: "Automação de Processos",
      sector: "Deploy & Integração",
      result: "Zero downtime · auto-correção · SLA 60 dias",
      photo: { url: "", text: "" },
      metrics: [
        { value: "0", label: "downtime por erro" },
        { value: "60d", label: "SLA pós go-live" },
        { value: "auto", label: "correção de bugs" },
        { value: "RT", label: "monitoramento" },
      ],
      features: ["Webhooks e microserviços", "Deploy com rollback seguro", "Monitoramento de infraestrutura", "Alertas antes de afetar usuário"],
    },
    {
      label: "Pipeline de Agentes",
      sector: "Ecossistema Atoms",
      result: "5 agentes · 1 pipeline · operação completa",
      photo: { url: "", text: "" },
      metrics: [
        { value: "5", label: "agentes verticais" },
        { value: "24h", label: "cobertura total" },
        { value: "0", label: "headcount extra" },
        { value: "RT", label: "dados entre agentes" },
      ],
      features: ["Audiovisual · Tráfego · Atendimento", "Financeiro · Dev-Agent", "ERP unificado entre agentes", "Escalável sem aumentar time"],
    },
  ];

  const cases: ClientCase[] = [
    {
      sector: "Conversão & Captação",
      tag: "Landing Page com IA",
      name: "Landing Page com IA",
      photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80",
      desc: "Página de alta conversão integrada a agentes que qualificam, respondem e agendam em tempo real. O visitante entra e o sistema já está trabalhando — sem formulário morto, sem espera.",
      sections: [
        { title: "O que é entregue", items: ["Landing page com identidade da marca e SEO local", "Formulário inteligente com qualificação automática por IA", "Chat integrado ao WhatsApp — resposta em segundos", "Back-office editável pela equipe sem dev", "A/B test de headline e CTA no automático"] },
        { title: "Como funciona", items: ["Lead chega pelo tráfego pago ou orgânico", "Agente qualifica por perfil e intenção antes de qualquer humano", "CRM é atualizado instantaneamente", "Reunião agendada direto no calendário"] },
        { title: "Resultados esperados", items: ["+38% de conversão média vs formulário estático", "0 lead sem retorno — IA responde 24/7", "Equipe foca só em leads quentes", "Site editável pela própria equipe"] },
      ],
      result: "+38% conversão · Qualificação automática · 0 lead sem retorno",
    },
    {
      sector: "Atendimento & Vendas",
      tag: "IA Conversacional — Chat",
      name: "IA Conversacional — Chat",
      photo: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=900&auto=format&fit=crop&q=80",
      desc: "Agentes que qualificam leads, respondem objeções e agendam reuniões via WhatsApp, Instagram e site — sem SDR humano na primeira triagem. O cliente digita, o sistema entende e age.",
      sections: [
        { title: "O que é entregue", items: ["Agente WhatsApp Business com API oficial", "Base de conhecimento com RAG — entende o contexto do negócio", "Qualificação automática com scoring de leads", "Handoff suave para humano quando necessário", "Integração com Google Calendar e CRM"] },
        { title: "Como funciona", items: ["Lead manda mensagem em qualquer canal", "Agente qualifica por perfil e urgência", "Agenda reunião ou envia proposta direto", "Dados caem no CRM sem intervenção humana"] },
        { title: "Resultados esperados", items: ["80% de redução no tempo de triagem", "Resposta em segundos — mesmo fora do horário comercial", "Conversão 45% maior vs formulário tradicional", "Custo por lead reduzido em até 70%"] },
      ],
      result: "24/7 sem SDR · Resposta em segundos · 80% menos custo de triagem",
    },
    {
      sector: "Call Center & Follow-up",
      tag: "IA Conversacional — Voz",
      name: "IA Conversacional — Voz",
      photo: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=900&auto=format&fit=crop&q=80",
      desc: "Agentes de voz que confirmam agendamentos, fazem follow-up de propostas e cobram inadimplentes — custo de call center por fração do preço. Voz neural realista, conversa bidirecional.",
      sections: [
        { title: "O que é entregue", items: ["Voz neural ultra-realista com prosódia natural", "Conversas bidirecionais com compreensão de contexto", "Transcrição e análise de chamadas em tempo real", "Agendamento direto durante a ligação", "Relatório detalhado por chamada"] },
        { title: "Como funciona", items: ["Agente liga no horário configurado", "Confirma, renegocia ou escalona conforme resposta", "Transcrição e sentimento registrados no CRM", "Fallback para humano em casos complexos"] },
        { title: "Resultados esperados", items: ["80% menor custo vs call center humano", "Escala infinita de ligações simultâneas", "Taxa de no-show reduzida em até 70%", "Follow-up 100% consistente — sem esquecimento"] },
      ],
      result: "80% menor custo · Escala infinita · 70% menos no-show",
    },
    {
      sector: "Gestão & Operações",
      tag: "Módulo ERP Complementar",
      name: "Módulo ERP Complementar",
      photo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80",
      desc: "CRM, financeiro e operações integrados nativamente com os agentes de IA. Dados fluem sem planilha, sem retrabalho, sem gap entre canais. O sistema fala com os agentes em tempo real.",
      sections: [
        { title: "O que é entregue", items: ["CRM completo com histórico de conversas de todos os canais", "Gestão financeira — Pix, boleto, conciliação automática", "Emissão de NF e cobrança de inadimplentes", "Dashboards com insights gerados por IA", "API aberta para integrações customizadas"] },
        { title: "Como funciona", items: ["Agente fecha venda e CRM é atualizado na hora", "Pix confirmado dispara emissão automática de NF", "Clientes inadimplentes recebem cobrança amigável via agente", "Gestor vê tudo em um único painel"] },
        { title: "Resultados esperados", items: ["60% menos retrabalho operacional", "Zero gap entre canais — dados unificados", "Decisões mais rápidas com dados em tempo real", "Escalabilidade sem aumentar complexidade"] },
      ],
      result: "CRM + Financeiro + IA integrados · 60% menos retrabalho",
    },
    {
      sector: "Dados & Decisão",
      tag: "Analytics & Inteligência",
      name: "Analytics & Inteligência",
      photo: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&auto=format&fit=crop&q=80",
      desc: "Painel com métricas de cada agente, funil de conversão por canal e alertas automáticos quando algo foge do padrão. O gestor não abre dashboard — recebe a leitura.",
      sections: [
        { title: "O que é entregue", items: ["KPIs em tempo real por canal e por agente", "Alertas de anomalia antes de virar problema", "Relatório executivo gerado automaticamente", "Forecast com projeção e confidence range", "Exportação para Google Sheets e BI"] },
        { title: "Como funciona", items: ["Agentes vasculham KPIs continuamente", "Anomalia detectada dispara alerta no WhatsApp do gestor", "Relatório diário entregue em 3 frases acionáveis", "Tendências cruzadas com sazonalidade e mercado"] },
        { title: "Resultados esperados", items: ["3x mais velocidade de decisão", "Problemas detectados antes de virar crise", "Gestor decide com dados, não com intuição", "Relatório pronto sem trabalho manual"] },
      ],
      result: "3x mais velocidade · Alertas automáticos · Decisão baseada em dados",
    },
    {
      sector: "Deploy & Integração",
      tag: "Automação de Processos",
      name: "Automação de Processos",
      photo: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&auto=format&fit=crop&q=80",
      desc: "Webhooks, microserviços e integrações que fazem os sistemas conversarem sem intervenção humana. O Dev-Agent monitora, corrige e faz deploy autonomamente.",
      sections: [
        { title: "O que é entregue", items: ["Criação de webhooks e integrações customizadas", "Monitoramento de infraestrutura em tempo real", "Correções autônomas em scripts de integração", "Deploy automático com rollback seguro", "Alertas de erro antes de afetar o usuário final"] },
        { title: "Como funciona", items: ["Agente monitora APIs e webhooks continuamente", "Erro detectado é diagnosticado e corrigido sem humano", "Deploy validado em staging antes de ir pra produção", "Relatório de incidentes gerado automaticamente"] },
        { title: "Resultados esperados", items: ["Zero downtime por erro humano", "Integrações que se auto-corrigem", "Time técnico foca em produto, não em apagar fogo", "SLA garantido por 60 dias pós go-live"] },
      ],
      result: "Zero downtime · Auto-correção · SLA 60 dias pós go-live",
    },
    {
      sector: "Ecossistema Atoms",
      tag: "Pipeline Completo",
      name: "Pipeline de Agentes Verticais",
      photo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&auto=format&fit=crop&q=80",
      desc: "Todos os agentes integrados em uma única pipeline — do lead ao caixa, sem gap entre sistemas. O ecossistema Atoms operando como uma empresa IA-first completa.",
      sections: [
        { title: "Os 5 agentes", items: ["Audiovisual — cria e distribui conteúdo em escala", "Gestor de tráfego — otimiza campanhas e realoca verba em tempo real", "Atendimento — qualifica leads e agenda 24/7 no WhatsApp", "Financeiro — emite Pix, NF e cobra inadimplentes automaticamente", "Dev-Agent — monitora infraestrutura e corrige bugs autonomamente"] },
        { title: "Como a pipeline funciona", items: ["Cada agente opera de forma independente na sua vertical", "Dados fluem entre agentes via webhooks em tempo real", "Exceções são escaladas para humano com contexto completo", "ERP unifica tudo em um painel único"] },
        { title: "Resultado do ecossistema", items: ["Operação 24h sem time inflado", "Lead capturado, qualificado, fechado e faturado no automático", "Gestor supervisiona — IA executa", "Escalável sem aumentar headcount"] },
      ],
      result: "5 agentes · 1 pipeline · operação completa IA-first",
    },
  ];

  const selected = selectedIdx !== null ? cases[selectedIdx] : null;

  return (
    <section id="casos" className="py-40">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="section-label mb-3">O que eu entrego</div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] mb-4 max-w-3xl">
            Soluções <em className="text-primary italic">por vertical.</em>
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-xl leading-relaxed mb-12">
            Não é portfólio com mockup. São arquiteturas que rodam todo dia, atendendo gente de verdade.
            <br />
            <span className="text-primary/60 text-[13px]">Clique em um card para ver os detalhes.</span>
          </p>
        </Reveal>

        {/* Galeria circular */}
        <div className="relative w-full" style={{ height: '520px' }}>
          <CircularGallery
            items={galleryItems}
            radius={480}
            autoRotateSpeed={0.08}
            onItemClick={(i) => setSelectedIdx(i)}
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>

        <Reveal delay={0.2}>
          <p className="text-[13px] text-muted-foreground/50 text-center mt-16 max-w-xl mx-auto leading-relaxed">
            Outros sistemas em operação não podem ser divulgados por confidencialidade.
            Se quiser, eu mostro a arquitetura na call.
          </p>
        </Reveal>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <>
            {/* Backdrop + centering container */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedIdx(null)}
            >
            {/* Panel — stopPropagation evita fechar ao clicar dentro */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-sm bg-card border border-primary/20 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            >
              {/* Hero image */}
              <div className="relative overflow-hidden rounded-t-sm" style={{ height: '220px' }}>
                <motion.img
                  src={selected.photo}
                  alt={selected.name}
                  className="absolute left-0 w-full object-cover"
                  style={{ height: '160%' }}
                  animate={{ top: ['-60%', '0%', '-60%'] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <button
                  onClick={() => setSelectedIdx(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-background/70 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <span className="section-label">{selected.sector}</span>
                  <span className="text-[10px] uppercase tracking-wider border border-border px-2 py-1 rounded-sm text-muted-foreground">{selected.tag}</span>
                </div>
                <h3 className="font-serif text-3xl text-foreground mb-3 leading-tight">{selected.name}</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">{selected.desc}</p>

                {selected.sections.map((s, idx) => (
                  <div key={s.title} className={`pt-5 border-t border-border/50 ${idx > 0 ? "mt-4" : ""}`}>
                    <div className="section-label mb-3">{s.title}</div>
                    <ul className="space-y-2.5">
                      {s.items.map((a) => {
                        const [name, ...rest] = a.split(" — ");
                        return (
                          <li key={a} className="flex gap-3 text-[13px] leading-relaxed">
                            <span className="text-primary mt-1 shrink-0 text-[10px]">◆</span>
                            <span>
                              <span className="text-foreground/90 font-medium">{name}</span>
                              {rest.length > 0 && <span className="text-muted-foreground"> — {rest.join(" — ")}</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}

                <div className="mt-6 pt-5 border-t border-border/40 text-xs text-primary tracking-wider uppercase">
                  → {selected.result}
                </div>
              </div>
            </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
