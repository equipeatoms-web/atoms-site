import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EASE } from "@/lib/animations/easings";
import { GoldParticles } from "@/components/motion/GoldParticles";

const lines = [
  { text: "Improviso não é gestão.", highlight: false },
  { text: "É um imposto invisível.", highlight: true },
  { text: "Você paga todo dia.", highlight: false },
];

const beliefs = [
  {
    n: "01",
    title: "Sistemas antes de pessoas",
    body: "Toda vez que uma tarefa depende de uma pessoa específica para funcionar, você criou um ponto único de falha. A ATom's elimina esses pontos — um por um.",
  },
  {
    n: "02",
    title: "Resultado antes de apresentação",
    body: "Não entregamos slides, PDFs ou roadmaps de 90 dias. Entregamos credenciais de produção. Sistema rodando. Processo funcionando. No go-live.",
  },
  {
    n: "03",
    title: "Arquitetura antes de ferramenta",
    body: "Qualquer um vende ferramenta. Poucos entendem o problema certo. A ATom's mapeia seu negócio antes de escrever uma linha de código.",
  },
  {
    n: "04",
    title: "Autonomia antes de dependência",
    body: "Um sistema bom é aquele que seu time consegue operar sem a ATom's. Entregamos documentação, treinamento e 60 dias de suporte para isso.",
  },
  {
    n: "05",
    title: "Responsabilidade antes de entrega",
    body: "Se o sistema cair nos primeiros 60 dias, a gente acorda antes de você. Não existe 'entregamos e saímos'. Isso não é projeto para nós.",
  },
];

const Manifesto = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero do Manifesto */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(38 55% 55% / 0.09) 0%, transparent 65%)", filter: "blur(60px)" }}
          />
          <div className="absolute inset-0 bg-radial-vignette opacity-60" />
          <GoldParticles />
        </div>

        {/* Linha gold vertical */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE.expoOut }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 origin-top"
          style={{ background: "linear-gradient(to bottom, transparent, hsl(38 33% 70% / 0.5), transparent)" }}
        />

        <div className="container mx-auto px-6 max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE.expoOut }}
            className="mb-10"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-[11px] tracking-[0.18em] uppercase font-medium text-muted-foreground"
              style={{
                background: "hsl(0 0% 7% / 0.7)",
                border: "1px solid hsl(38 33% 70% / 0.2)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" style={{ boxShadow: "0 0 6px hsl(38 33% 70% / 0.8)" }} />
              ATom's · Manifesto
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE.expoOut }}
            className="font-serif leading-[1.06] tracking-tight mb-8"
            style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
          >
            {lines.map((l, i) => (
              <span
                key={i}
                className={`block ${l.highlight ? "text-primary italic" : "text-foreground/90 font-light"}`}
              >
                {l.text}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE.expoOut }}
            className="text-[16px] text-muted-foreground/70 leading-[1.8] font-light max-w-xl mx-auto"
          >
            A ATom's nasceu porque vimos o mesmo padrão se repetir em centenas de empresas: times inteligentes presos em operações burras. Esse documento explica o que acreditamos — e por que construímos diferente.
          </motion.p>
        </div>
      </section>

      {/* Linha divisória */}
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, hsl(38 33% 70% / 0.2), transparent)" }} />
      </div>

      {/* Crenças */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-label mb-12"
          >
            O que acreditamos
          </motion.div>

          <div className="space-y-0">
            {beliefs.map((b, i) => (
              <motion.div
                key={b.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE.expoOut }}
                className="group py-10 border-b"
                style={{ borderColor: "hsl(0 0% 12%)" }}
              >
                <div className="flex gap-8 items-start">
                  <span
                    className="font-serif text-5xl leading-none shrink-0 mt-1"
                    style={{ color: "hsl(38 33% 70% / 0.2)", transition: "color 300ms" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "hsl(38 33% 70% / 0.5)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "hsl(38 33% 70% / 0.2)")}
                  >
                    {b.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-foreground/90 mb-3 group-hover:text-primary transition-colors duration-300">
                      {b.title}
                    </h3>
                    <p className="text-[15px] text-muted-foreground/70 leading-[1.75] font-light">
                      {b.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, hsl(38 33% 70% / 0.05), transparent 60%)" }}
        />
        <div className="container mx-auto px-6 max-w-2xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE.expoOut }}
          >
            <div className="flex items-center gap-4 justify-center mb-10">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, hsl(38 33% 70% / 0.25))" }} />
              <span className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground/40">ATom's</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, hsl(38 33% 70% / 0.25))" }} />
            </div>

            <h2
              className="font-serif text-foreground/90 font-light leading-[1.1] mb-6"
              style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
            >
              Não construímos tecnologia.
              <br />
              <em className="text-primary italic">Construímos autonomia.</em>
            </h2>
            <p className="text-[15px] text-muted-foreground/60 leading-[1.8] font-light mb-10">
              Toda empresa que passa pela ATom's sai com um ativo que não existia antes: uma operação que trabalha quando você não está. Esse é o nosso produto real.
            </p>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.location.href = "/#contato"}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium text-primary-foreground rounded-sm transition-all duration-300"
              style={{
                background: "hsl(38 33% 70%)",
                boxShadow: "0 0 40px hsl(38 33% 70% / 0.25)",
              }}
            >
              Falar com a ATom's
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Manifesto;
