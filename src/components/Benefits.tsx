import { Reveal } from "@/components/motion/Reveal";

export const Benefits = () => {
  return (
    <section id="sobre" className="py-24 relative">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="section-label mb-8">Quem somos</div>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <h2 className="font-serif text-4xl sm:text-5xl text-foreground leading-[1.1] mb-6 max-w-2xl">
              Na ATom's, dominamos IA porque{" "}
              <em className="text-primary not-italic italic">construímos sistemas reais.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-[15px] text-muted-foreground leading-[1.7] mb-4 font-light">
              André lidera a engenharia de IA aplicada e desenvolvimento full-stack na ATom's. Enquanto a maioria fala em
              IA, a gente entrega:{" "}
              <span className="text-foreground/90">agentes de atendimento que fecham vendas</span>,
              automações que eliminam retrabalho e sistemas que escalam sem aumentar headcount.
            </p>
            <p className="text-[15px] text-muted-foreground leading-[1.7] font-light">
              Entregamos landing pages, sistemas conversacionais e infraestrutura de IA do zero —
              com o seu time operando de forma autônoma em até 60 dias.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
