import { motion } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { fadeUp } from "@/lib/animations/variants";

import danielAlvesImg from "@/assets/daniel-alves.png";

export const Benefits = () => {
  const stack = [
    // Agentes & IA
    "Claude / GPT-4o", "Agentes de Atendimento", "RAG & Embeddings", "LangChain",
    // Automação
    "n8n", "Make / Zapier", "Webhooks",
    // Backend & Banco
    "Supabase", "PostgreSQL", "Redis", "Edge Functions",
    // Integrações Google
    "Google Calendar API", "Google Sheets API", "Gmail API", "Google Drive API",
    // Frontend & Deploy
    "Next.js", "React", "Tailwind CSS", "Landing Pages",
    "Vercel", "Railway", "Docker", "CI/CD",
    // Pagamentos & Mensageria
    "WhatsApp Cloud API", "Stripe", "Mercado Pago", "Twilio",
  ];

  const sectionRef = useRef<HTMLElement>(null);


  return (
    <section id="sobre" className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="section-label mb-8">Sobre</div>
        </Reveal>
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          <Reveal direction="right">
            <div className="benefits-portrait aspect-[3/4] rounded-sm relative overflow-hidden flex items-end p-6 border border-primary/30 shadow-[0_0_35px_rgba(212,175,55,0.25)] group transition-all duration-500 hover:shadow-[0_0_50px_rgba(212,175,55,0.4)]">
              <img
                src={danielAlvesImg}
                alt="Daniel Alves"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent pointer-events-none" />
              
              {/* Subtle gold accent line inside */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70" />
              
              <span className="relative section-label text-foreground bg-background/60 backdrop-blur-sm border-primary/20">Daniel Alves · Brasil</span>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.1] mb-6 max-w-2xl">
                Eu domino IA porque{" "}
                <em className="text-primary not-italic italic">construo sistemas reais.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[15px] text-muted-foreground leading-[1.7] mb-4 font-light">
                Sou engenheiro de IA aplicada e desenvolvedor full-stack. Enquanto a maioria fala em
                IA, eu entrego:{" "}
                <span className="text-foreground/90">agentes de atendimento que fecham vendas</span>,
                automações que eliminam retrabalho e sistemas que escalam sem aumentar headcount.
              </p>
              <p className="text-[15px] text-muted-foreground leading-[1.7] font-light">
                Entrego landing pages, sistemas conversacionais e infraestrutura de IA do zero —
                com o seu time operando de forma autônoma em até 60 dias.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 space-y-3">
                {[
                  { label: "IA & Agentes", items: ["Claude / GPT-4o", "Agentes de Atendimento", "RAG & Embeddings", "LangChain", "n8n", "Webhooks"] },
                  { label: "Banco & Backend", items: ["Supabase", "PostgreSQL", "Edge Functions"] },
                  { label: "Google Suite", items: ["Google Calendar API", "Google Sheets API", "Gmail API", "Google Drive API"] },
                  { label: "Frontend & Deploy", items: ["Next.js", "React", "Landing Pages", "Vercel", "Railway", "Docker", "CI/CD"] },
                ].map((group) => (
                  <div key={group.label} className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] tracking-[0.18em] uppercase text-primary/60 font-medium w-full sm:w-auto sm:min-w-[110px]">
                      {group.label}
                    </span>
                    <StaggerGroup stagger={0.03} className="flex flex-wrap gap-1.5">
                      {group.items.map((s) => (
                        <motion.span
                          key={s}
                          variants={fadeUp}
                          whileHover={{ y: -2, borderColor: "hsl(38 33% 70%)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="text-[11px] px-3 py-1.5 glass rounded-sm text-muted-foreground cursor-default"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </StaggerGroup>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
