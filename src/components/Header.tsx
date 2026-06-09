import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { scrollToId } from "@/lib/animations/scroll";
import { EASE } from "@/lib/animations/easings";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const height = useTransform(scrollY, [0, 120], [56, 48]);
  const bg = useTransform(scrollY, [0, 120], ["hsla(0,0%,7%,0.55)", "hsla(0,0%,7%,0.85)"]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => setScrolled(v > 80));
    return unsubscribe;
  }, [scrollY]);

  const goTo = (id: string) => {
    scrollToId(id);
    setOpen(false);
  };

  const links: { id: string; label: string; href?: string }[] = [
    { id: "solucoes", label: "Soluções", href: "/solucoes" },
    { id: "metodologia", label: "O método" },
    { id: "problema", label: "Por que a ATom's" },
    { id: "sobre", label: "Quem somos" },
  ];

  return (
    <motion.header
      className="fixed top-4 left-4 right-4 z-50"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE.expoOut }}
    >
      <div className="container mx-auto">
        <motion.div
          style={{ height, backgroundColor: bg }}
          className="glass-highlight rounded-md flex items-center justify-between px-5 backdrop-blur-2xl border border-[hsl(var(--glass-border))]"
        >
          <Link to="/" className="font-serif text-xl text-foreground tracking-tight">
            ATom's
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) =>
              l.href ? (
                <Link
                  key={l.id}
                  to={l.href}
                  className="group relative text-[13px] text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </Link>
              ) : (
                <button
                  key={l.id}
                  onClick={() => goTo(l.id)}
                  className="group relative text-[13px] text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </button>
              )
            )}
          </nav>

          <motion.button
            onClick={() => goTo("contato")}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={`hidden md:inline-flex text-[13px] bg-primary text-primary-foreground px-4 py-2 rounded-sm font-medium transition ${scrolled ? "shadow-glow" : ""}`}
          >
            Falar com a ATom's
          </motion.button>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE.expoOut }}
              className="md:hidden mt-2 glass glass-highlight rounded-md p-4 flex flex-col gap-3"
            >
              {links.map((l) =>
                l.href ? (
                  <Link
                    key={l.id}
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="text-left text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <button
                    key={l.id}
                    onClick={() => goTo(l.id)}
                    className="text-left text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {l.label}
                  </button>
                )
              )}
              <button
                onClick={() => goTo("contato")}
                className="text-[13px] bg-primary text-primary-foreground px-4 py-2 rounded-sm font-medium"
              >
                Falar com a ATom's
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
