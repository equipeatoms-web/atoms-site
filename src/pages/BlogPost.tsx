import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EASE } from "@/lib/animations/easings";
import { blogPosts } from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const paragraphs = post.content.split("\n\n").filter(Boolean);
  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="pt-36 pb-24">
        <div className="container mx-auto px-6 max-w-2xl">

          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[12px] text-muted-foreground/50 hover:text-primary transition-colors duration-200 tracking-wide"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Blog
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE.expoOut }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[9px] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "hsl(38 33% 70% / 0.12)", color: "hsl(38 33% 70%)" }}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            <h1
              className="font-serif text-foreground/95 leading-[1.08] tracking-tight mb-5"
              style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              {post.title}
            </h1>

            <p className="text-[16px] text-muted-foreground/70 font-light leading-[1.7] mb-8 border-l-2 pl-4"
              style={{ borderColor: "hsl(38 33% 70% / 0.4)" }}>
              {post.subtitle}
            </p>

            <div className="h-px mb-10" style={{ background: "linear-gradient(to right, hsl(38 33% 70% / 0.2), transparent)" }} />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="space-y-5"
          >
            {paragraphs.map((p, i) => {
              if (p.startsWith("**") && p.endsWith("**")) {
                return (
                  <h3 key={i} className="font-serif text-[18px] text-foreground/90 mt-8 mb-2">
                    {p.replace(/\*\*/g, "")}
                  </h3>
                );
              }
              const parts = p.split(/(\*\*[^*]+\*\*)/g);
              return (
                <p key={i} className="text-[15px] text-muted-foreground/75 leading-[1.85] font-light">
                  {parts.map((part, j) =>
                    part.startsWith("**") ? (
                      <strong key={j} className="text-foreground/90 font-medium">
                        {part.replace(/\*\*/g, "")}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
          </motion.div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: "hsl(0 0% 10%)" }}>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-3.5 h-3.5 text-muted-foreground/30" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] tracking-wide px-2.5 py-1 rounded-full text-muted-foreground/50"
                  style={{ background: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 12%)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 p-8 rounded-sm text-center"
            style={{ background: "hsl(0 0% 6%)", border: "1px solid hsl(38 33% 70% / 0.15)" }}
          >
            <p className="font-serif text-[18px] text-foreground/90 mb-2">
              Quer aplicar isso na sua empresa?
            </p>
            <p className="text-[13px] text-muted-foreground/60 mb-5 font-light">
              A ATom's faz o diagnóstico e te diz o que faz sentido no seu contexto.
            </p>
            <Link
              to="/#contato"
              className="inline-flex items-center gap-2 px-6 py-3 text-[12px] font-medium text-primary-foreground rounded-sm transition-all duration-200 hover:opacity-90"
              style={{ background: "hsl(38 33% 70%)", boxShadow: "0 0 24px hsl(38 33% 70% / 0.2)" }}
            >
              Falar com a ATom's
            </Link>
          </motion.div>
        </div>
      </article>

      {/* More posts */}
      {otherPosts.length > 0 && (
        <section className="pb-24 border-t" style={{ borderColor: "hsl(0 0% 8%)" }}>
          <div className="container mx-auto px-6 max-w-5xl pt-16">
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40 mb-8">Mais artigos</p>
            <div className="grid sm:grid-cols-3 gap-5">
              {otherPosts.map((p, i) => (
                <motion.div
                  key={p.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                >
                  <Link
                    to={`/blog/${p.slug}`}
                    className="group block p-5 rounded-sm transition-all duration-250"
                    style={{ background: "hsl(0 0% 6%)", border: "1px solid hsl(0 0% 10%)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "hsl(38 33% 70% / 0.2)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "hsl(0 0% 10%)")}
                  >
                    <span
                      className="text-[9px] tracking-[0.18em] uppercase font-semibold block mb-3"
                      style={{ color: "hsl(38 33% 70% / 0.6)" }}
                    >
                      {p.category}
                    </span>
                    <h4 className="font-serif text-[14px] text-foreground/80 leading-[1.3] group-hover:text-primary transition-colors duration-200">
                      {p.title}
                    </h4>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
