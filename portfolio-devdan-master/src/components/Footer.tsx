import { Instagram, MessageCircle, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const ICON_LINKS = [
  { href: "https://github.com/", label: "GitHub", Icon: Github },
  { href: "https://www.linkedin.com/", label: "LinkedIn", Icon: Linkedin },
  { href: "https://www.instagram.com/atoms_/", label: "Instagram", Icon: Instagram },
  { href: "https://wa.me/5564992698259", label: "WhatsApp", Icon: MessageCircle },
];

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="hairline"
    >
      <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Daniel Alves · Engenheiro de IA Aplicada
        </div>
        <div className="flex items-center gap-5">
          {ICON_LINKS.map(({ href, label, Icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ y: -2, color: "hsl(38 33% 70%)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-muted-foreground transition"
            >
              <Icon className="w-4 h-4" />
            </motion.a>
          ))}
          <span className="text-xs text-muted-foreground/70">Brasil</span>
        </div>
      </div>
    </motion.footer>
  );
};
