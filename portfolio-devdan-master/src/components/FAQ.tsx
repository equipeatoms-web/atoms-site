import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Como funciona o chatbot com IA?",
      answer: "Nossos chatbots utilizam inteligência artificial avançada (GPT-4/Claude) treinada especificamente para seu negócio. Eles entendem contexto, linguagem natural e podem executar ações como agendar, qualificar leads e até processar pagamentos.",
    },
    {
      question: "Quais integrações são possíveis?",
      answer: "Integramos com praticamente qualquer sistema: WhatsApp Business API, Instagram, Telegram, CRMs (RD Station, Pipedrive, HubSpot), ERPs, sistemas de agendamento, e-commerce e qualquer plataforma que tenha API disponível.",
    },
    {
      question: "Quanto tempo leva para implementar?",
      answer: "Depende da complexidade. Soluções básicas (chatbot + FAQ) ficam prontas em 7-10 dias. Sistemas completos podem levar de 2-4 semanas. Sempre com acompanhamento e ajustes pós-implementação.",
    },
    {
      question: "Preciso ter conhecimento técnico?",
      answer: "Não! Desenvolvemos tudo para você e treinamos sua equipe. A interface é intuitiva e oferecemos suporte técnico sempre que necessário.",
    },
    {
      question: "A IA substitui minha equipe?",
      answer: "Não, ela potencializa! A IA cuida de tarefas repetitivas (agendamentos, FAQ, qualificação) liberando sua equipe para focar no que realmente importa: relacionamento, vendas complexas e estratégia.",
    },
    {
      question: "Como funciona o suporte e atualizações?",
      answer: "Todos os planos incluem atualizações de prompts e ajustes. Suporte é via WhatsApp/e-mail com SLA definido. Planos Premium têm suporte prioritário e reuniões mensais de otimização.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossas soluções
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass glass-highlight border-0 rounded-xl px-6 data-[state=open]:border-primary/50 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-foreground pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
