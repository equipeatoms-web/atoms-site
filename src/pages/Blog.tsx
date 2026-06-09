import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EASE } from "@/lib/animations/easings";
import { blogPosts } from "@/data/blogPosts";
import { GoldParticles } from "@/components/motion/GoldParticles";

const Blog = () => {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(38 55% 55% / 0.07) 0%, transparent 65%)", filter: "blur(80px)" }}
          />
          <GoldParticles />
        </div>

        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE.expoOut }}
            className="mb-4"
          >
            <span
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium text-muted-foreground"
              style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(38 33% 70% / 0.2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              ATom's · Conteúdo
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE.expoOut }}
            className="font-serif leading-[1.06] tracking-tight mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 68px)" }}
          >
            <span className="block text-foreground/90 font-light">Inteligência que</span>
            <span className="block text-primary italic">você aplica amanhã.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-[15px] text-muted-foreground/70 font-light max-w-lg"
          >
            Sem hype, sem teoria. Só o que realmente muda como uma empresa opera.
          </motion.p>
        </div>
      </section>

      {/* Featured post */}
      <section className="pb-8">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: EASE.expoOut }}
          >
            <Link
              to={`/blog/${featured.slug}`}
              className="group block rounded-sm overflow-hidden relative"
              style={{
                background: "hsl(0 0% 7%)",
                border: "1px solid hsl(38 33% 70% / 0.12)",
              }}
            >
              <div className="p-8 sm:p-12 grid sm:grid-cols-[1fr_auto] gap-8 items-end">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "hsl(38 33% 70% / 0.12)", color: "hsl(38 33% 70%)" }}
                    >
                      {featured.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground/50">{featured.readTime} de leitura</span>
                  </div>
                  <h2
                    className="font-serif text-foreground/90 leading-[1.1] mb-4 group-hover:text-primary transition-colors duration-300"
                    style={{ fontSize: "clamp(22px, 3vw, 38px)" }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-[14px] text-muted-foreground/60 leading-[1.7] font-light max-w-xl">
                    {featured.excerpt}
                  </p>
                </div>
                <div
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "hsl(38 33% 70% / 0.1)", border: "1px solid hsl(38 33% 70% / 0.25)" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px transition-all duration-700"
                style={{ background: "linear-gradient(to right, hsl(38 33% 70% / 0.6), transparent)" }}
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 pb-32">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="h-px mb-12" style={{ background: "linear-gradient(to right, transparent, hsl(38 33% 70% / 0.15), transparent)" }} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE.expoOut }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col h-full rounded-sm p-6 transition-all duration-300"
                  style={{
                    background: "hsl(0 0% 6%)",
                    border: "1px solid hsl(0 0% 10%)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(38 33% 70% / 0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(0 0% 10%)")}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[9px] tracking-[0.18em] uppercase font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "hsl(38 33% 70% / 0.08)", color: "hsl(38 33% 70% / 0.7)" }}
                    >
                      {post.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40">{post.readTime}</span>
                  </div>

                  <h3 className="font-serif text-[16px] text-foreground/85 leading-[1.3] mb-3 group-hover:text-primary transition-colors duration-250 flex-1">
                    {post.title}
                  </h3>

                  <p className="text-[12px] text-muted-foreground/50 leading-[1.65] font-light mb-5 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] font-medium mt-auto"
                    style={{ color: "hsl(38 33% 70% / 0.6)" }}>
                    Ler artigo
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
