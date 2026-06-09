import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/5564992698259"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      initial={{ scale: 0, rotate: -45, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full glass glass-highlight text-primary shadow-glow"
    >
      <motion.span
        animate={{
          boxShadow: [
            "0 0 0px hsl(38 33% 70% / 0)",
            "0 0 24px hsl(38 33% 70% / 0.45)",
            "0 0 0px hsl(38 33% 70% / 0)",
          ],
        }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full pointer-events-none"
      />
      <MessageCircle className="w-7 h-7 relative" />
    </motion.a>
  );
};
