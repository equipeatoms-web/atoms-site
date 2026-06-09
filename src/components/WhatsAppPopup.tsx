import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const WA_NUMBER = "5564992698259";
const TTL_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "wa_popup_dismissed";

const VARIANTS = [
  { copy: "Posso te ajudar?", sub: "Eu respondo direto, sem bot." },
  { copy: "Em dúvida? Me chama.", sub: "Eu respondo direto, sem bot." },
  { copy: "Quer falar antes de agendar?", sub: "Eu respondo direto, sem bot." },
] as const;

function isDismissed(): boolean {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (!val) return false;
    return Date.now() - parseInt(val, 10) < TTL_MS;
  } catch { return false; }
}

function dismiss() {
  try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
}

export const WhatsAppPopup = () => {
  const [visible, setVisible] = useState(false);
  const variant = useRef(VARIANTS[Math.floor(Math.random() * VARIANTS.length)]);
  const triggered = useRef(false);

  const show = () => {
    if (triggered.current || isDismissed()) return;
    triggered.current = true;
    setVisible(true);
  };

  useEffect(() => {
    // Time trigger: 45s on mobile, 30s on desktop
    const delay = window.innerWidth < 768 ? 45_000 : 30_000;
    const timer = setTimeout(show, delay);

    // Scroll trigger: 50% of page
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct >= 0.5) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleDismiss = () => {
    dismiss();
    setVisible(false);
  };

  const handleOpen = () => {
    const prefill = encodeURIComponent("Oi André, vim do site da ATom's. Meu cenário é: ");
    window.open(`https://wa.me/${WA_NUMBER}?text=${prefill}`, "_blank", "noopener,noreferrer");
    dismiss();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 8 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Conversa no WhatsApp com André"
          className="fixed z-40 hidden sm:block"
          style={{
            bottom: "calc(96px + 12px)",
            right: "24px",
            maxWidth: "260px",
            width: "calc(100vw - 48px)",
          }}
        >
          {/* Arrow pointing down toward the WhatsApp button */}
          <div
            className="absolute -bottom-2 right-[40px] w-3 h-3 rotate-45"
            style={{
              background: "rgba(15,15,17,0.82)",
              borderRight: "1px solid rgba(200,184,154,0.32)",
              borderBottom: "1px solid rgba(200,184,154,0.32)",
            }}
          />

          <div
            className="relative rounded-xl p-4"
            style={{
              background: "rgba(15,15,17,0.82)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(200,184,154,0.32)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              aria-label="Fechar"
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Copy */}
            <p className="text-sm font-medium text-foreground pr-5 leading-snug">
              {variant.current.copy}
            </p>

            {/* CTA */}
            <button
              onClick={handleOpen}
              className="mt-3 w-full text-center text-sm font-medium text-primary py-2 rounded-lg border border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all"
              style={{ transition: "all 200ms cubic-bezier(0.22,1,0.36,1)" }}
            >
              Falar agora →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
