import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ContactForm } from "@/components/ContactForm";
import { UseCases } from "@/components/UseCases";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquareCode, Phone, Database, BarChart3,
  Cpu, ArrowRight,
  Workflow, Users, Bot, BrainCircuit, GitBranch,
  FileText, Bell, CreditCard, Calendar, Headphones,
} from "lucide-react";

// ─── Design tokens (inline, matches index.css) ───────────────────────────────
const GOLD = "hsl(38 33% 70%)";


// ─── Organogram / AI-First Map ────────────────────────────────────────────────
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface OrgNode {
  id: string;
  label: string;
  sub?: string;
  Icon: any;
  color: string; // text color class
  tier: number;
}

const nodes: OrgNode[] = [
  { id: "brain", label: "Núcleo de IA", sub: "Orquestrador central", Icon: BrainCircuit, color: "text-primary", tier: 0 },

  { id: "conv",  label: "Conversacional", sub: "WhatsApp · Voz · Chat", Icon: MessageSquareCode, color: "text-foreground/80", tier: 1 },
  { id: "flow",  label: "Automação",      sub: "Webhooks · Deploy",     Icon: Workflow,           color: "text-foreground/80", tier: 1 },
  { id: "data",  label: "Dados & ERP",    sub: "CRM · Financeiro",      Icon: Database,           color: "text-foreground/80", tier: 1 },
  { id: "intel", label: "Analytics",      sub: "KPIs · Alertas",        Icon: BarChart3,          color: "text-foreground/80", tier: 1 },

  { id: "lead",  label: "Qualificação",   sub: "Scoring automático",    Icon: Users,      color: "text-muted-foreground", tier: 2 },
  { id: "sche",  label: "Agendamento",    sub: "Calendar · CRM",        Icon: Calendar,   color: "text-muted-foreground", tier: 2 },
  { id: "bill",  label: "Faturamento",    sub: "Pix · NF · Cobrança",   Icon: CreditCard, color: "text-muted-foreground", tier: 2 },
  { id: "noti",  label: "Notificações",   sub: "Alerts · Follow-up",    Icon: Bell,       color: "text-muted-foreground", tier: 2 },
  { id: "rep",   label: "Relatórios",     sub: "PDF · Sheets · BI",     Icon: FileText,   color: "text-muted-foreground", tier: 2 },
];

const OrgNodeCard = ({ node, delay }: { node: OrgNode; delay: number }) => {
  const sizeClass = node.tier === 0 ? "w-28 h-28" : node.tier === 1 ? "w-24 h-24" : "w-20 h-20";
  const borderClass = node.tier === 0 ? "border-primary/60 shadow-[0_0_32px_hsl(38_33%_70%/0.3)]" : "border-primary/20";

  return (
    <motion.div
      className={`${sizeClass} glass rounded-sm border ${borderClass} flex flex-col items-center justify-center gap-1 cursor-default`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      whileHover={{ y: -4, borderColor: GOLD, transition: { duration: 0.2 } }}
    >
      <node.Icon className={`${node.tier === 0 ? "w-7 h-7" : node.tier === 1 ? "w-5 h-5" : "w-4 h-4"} ${node.color}`} />
      <span className={`text-[10px] font-semibold text-center leading-tight px-1 ${node.color}`}>{node.label}</span>
      {node.sub && <span className="text-[8px] text-muted-foreground/60 text-center leading-tight px-1">{node.sub}</span>}
    </motion.div>
  );
};

// Animated pulse line between nodes
const PulseLine = ({ vertical, delay }: { vertical?: boolean; delay: number }) => (
  <div className={`relative ${vertical ? "w-px h-8" : "h-px w-8"} bg-primary/10`}>
    <motion.div
      className={`absolute ${vertical ? "w-full h-4" : "h-full w-4"} bg-gradient-to-b from-transparent via-primary/70 to-transparent`}
      initial={{ [vertical ? "top" : "left"]: "-100%" }}
      animate={{ [vertical ? "top" : "left"]: "200%" }}
      transition={{ duration: 1.2, delay, repeat: Infinity, repeatDelay: 1.8, ease: "linear" }}
    />
  </div>
);

const OrgChart = () => {
  const tier0 = nodes.filter((n) => n.tier === 0);
  const tier1 = nodes.filter((n) => n.tier === 1);
  const tier2 = nodes.filter((n) => n.tier === 2);

  return (
    <div className="flex flex-col items-center gap-0">
      {/* Tier 0 */}
      <div className="flex items-center gap-0">
        {tier0.map((n, i) => <OrgNodeCard key={n.id} node={n} delay={i * 0.1} />)}
      </div>

      {/* Connector tier0→tier1 */}
      <PulseLine vertical delay={0.2} />
      <div className="w-[calc(4*6rem+3*1.5rem)] h-px bg-primary/10 relative">
        <motion.div className="absolute h-full w-16 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          initial={{ left: "-20%" }} animate={{ left: "110%" }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "linear" }} />
      </div>
      <div className="flex items-start gap-6">
        {tier1.map((_, i) => <PulseLine key={i} vertical delay={0.3 + i * 0.1} />)}
      </div>

      {/* Tier 1 */}
      <div className="flex items-center gap-6">
        {tier1.map((n, i) => <OrgNodeCard key={n.id} node={n} delay={0.2 + i * 0.08} />)}
      </div>

      {/* Connector tier1→tier2 */}
      <div className="flex items-start gap-6">
        {tier2.slice(0, tier1.length).map((_, i) => <PulseLine key={i} vertical delay={0.6 + i * 0.1} />)}
      </div>

      {/* Tier 2 */}
      <div className="flex items-center gap-6 flex-wrap justify-center">
        {tier2.map((n, i) => <OrgNodeCard key={n.id} node={n} delay={0.4 + i * 0.07} />)}
      </div>
    </div>
  );
};

// ─── AI-First Operations Flow ─────────────────────────────────────────────────
const flowSteps = [
  { Icon: Users,           label: "Lead chega",         sub: "Qualquer canal" },
  { Icon: Bot,             label: "Agente qualifica",    sub: "Scoring automático" },
  { Icon: GitBranch,       label: "Roteamento",          sub: "Regra de negócio" },
  { Icon: Calendar,        label: "Agenda / proposta",   sub: "Sem SDR humano" },
  { Icon: CreditCard,      label: "Faturamento",         sub: "Pix gerado + NF" },
  { Icon: Headphones,      label: "Suporte pós-venda",   sub: "60 dias de SLA" },
  { Icon: BarChart3,       label: "Analytics",           sub: "KPI atualizado" },
];

const FlowStep = ({ step, i }: { step: typeof flowSteps[0]; i: number }) => (
  <motion.div
    className="flex flex-col items-center gap-2"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_OUT }}
  >
    <div className="w-12 h-12 rounded-full border border-primary/30 bg-background flex items-center justify-center text-primary shadow-[0_0_20px_hsl(38_33%_70%/0.15)]">
      <step.Icon className="w-5 h-5" />
    </div>
    <div className="text-center">
      <p className="text-[12px] font-semibold text-foreground/90">{step.label}</p>
      <p className="text-[10px] text-muted-foreground/60">{step.sub}</p>
    </div>
  </motion.div>
);

const FlowArrow = ({ delay }: { delay: number }) => (
  <div className="relative w-10 h-px bg-primary/10 mt-6 shrink-0">
    <motion.div
      className="absolute h-px w-6 bg-gradient-to-r from-transparent via-primary/80 to-transparent top-0"
      initial={{ left: "-60%" }}
      animate={{ left: "120%" }}
      transition={{ duration: 0.9, delay, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
    />
    <ArrowRight className="absolute -right-2 -top-2 w-4 h-4 text-primary/40" />
  </div>
);

const OperationsFlow = () => (
  <div className="flex items-start justify-center flex-wrap gap-y-8 gap-x-0">
    {flowSteps.map((step, i) => (
      <div key={step.label} className="flex items-start">
        <FlowStep step={step} i={i} />
        {i < flowSteps.length - 1 && <FlowArrow delay={i * 0.15} />}
      </div>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const Solucoes = () => {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section ref={heroRef} className="pt-40 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <div className="inline-flex items-center gap-2 border border-primary/20 bg-background/60 px-3.5 py-1.5 rounded-sm mb-6 backdrop-blur-md">
              <Cpu className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-primary/80 font-bold">Hub de Soluções</span>
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl text-foreground mb-6 leading-[1.05] tracking-tight">
              IA aplicada a<br />
              <em className="text-primary italic">operações reais.</em>
            </h1>
            <p className="text-[16px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Cada solução foi construída para rodar em produção — não demo, não mockup. Integração, sistema e resultado.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hairline */}
      <div className="hairline" />

      {/* Cases carousel (the original from the main page) */}
      <UseCases />

      <div className="hairline" />

      {/* Organogram */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <p className="section-label mb-3">Arquitetura</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight mb-4">
              Como o ecossistema <em className="text-primary italic">se organiza.</em>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-lg mx-auto">
              Um núcleo de IA orquestra cada módulo — dados fluem em tempo real entre conversação, automação, ERP e analytics.
            </p>
          </div>
          <OrgChart />
        </div>
      </section>

      <div className="hairline" />

      {/* Operations Flow */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-16 text-center">
            <p className="section-label mb-3">IA-First em operações</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-tight mb-4">
              Do lead ao <em className="text-primary italic">caixa.</em>
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-lg mx-auto">
              Cada etapa da operação é coberta por um agente especializado. Zero gap entre canais.
            </p>
          </div>
          <OperationsFlow />

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-sm overflow-hidden">
            {[
              { v: "24h", l: "cobertura total" },
              { v: "< 30s", l: "tempo de resposta" },
              { v: "0", l: "lead sem retorno" },
              { v: "60 dias", l: "suporte pós go-live" },
            ].map(({ v, l }) => (
              <div key={l} className="bg-card/40 p-8 text-center">
                <p className="font-serif text-4xl text-primary mb-2">{v}</p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/70">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="hairline" />

      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Solucoes;
