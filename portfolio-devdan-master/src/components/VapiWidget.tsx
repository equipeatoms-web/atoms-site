import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Loader2 } from "lucide-react";

const VAPI_ASSISTANT_ID = "2fc4fb57-3574-4075-96b9-0a09de968fa3";
const VAPI_PUBLIC_KEY = "399d662c-fe1c-4093-81c5-0975915cfc96";

type CallStatus = "idle" | "loading" | "active";

export const VapiWidget = () => {
  const vapiRef = useRef<any>(null);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("vapi-sdk")) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "vapi-sdk";
    script.src =
      "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkReady) return;
    const vapi = (window as any).Vapi
      ? new (window as any).Vapi(VAPI_PUBLIC_KEY)
      : null;
    if (!vapi) return;
    vapiRef.current = vapi;

    vapi.on("call-start", () => setStatus("active"));
    vapi.on("call-end", () => setStatus("idle"));
    vapi.on("speech-start", () => {});
    vapi.on("error", () => setStatus("idle"));
  }, [sdkReady]);

  const handleClick = async () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    if (status === "active") {
      vapi.stop();
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      await vapi.start(VAPI_ASSISTANT_ID);
    } catch {
      setStatus("idle");
    }
  };

  const tooltipText =
    status === "idle"
      ? "Falar com ATom's AI"
      : status === "loading"
      ? "Conectando..."
      : "Encerrar ligação";

  const bgColor =
    status === "active"
      ? "hsl(142 71% 45%)"
      : "hsl(38 33% 57%)";

  return (
    <motion.div
      className="fixed bottom-6 right-24 z-50"
      initial={{ scale: 0, rotate: -45, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay: 1.0, type: "spring", stiffness: 220, damping: 18 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        <motion.span
          key={tooltipText}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium bg-black/80 text-gold px-2 py-1 rounded pointer-events-none"
          style={{ color: "hsl(38 33% 70%)" }}
        >
          {tooltipText}
        </motion.span>
      </AnimatePresence>

      {/* Button */}
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={tooltipText}
        className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-glow glass glass-highlight"
        style={{ background: bgColor }}
      >
        {/* Pulse ring */}
        {status !== "loading" && (
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
        )}

        {status === "loading" ? (
          <Loader2 className="w-7 h-7 animate-spin text-white" />
        ) : status === "active" ? (
          <PhoneOff className="w-7 h-7 text-white" />
        ) : (
          <Phone className="w-7 h-7 text-white" />
        )}
      </motion.button>
    </motion.div>
  );
};
