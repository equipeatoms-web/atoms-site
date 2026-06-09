import { useEffect, useRef, useState } from "react";

interface LiveTerminalProps {
  role: string;
  output: string;
}

type Phase = "idle" | "typing" | "running" | "done";

const TYPE_SPEED = 14; // ms per char
const RUN_DELAY = 420; // pause before status flips to done

/**
 * Terminal that types its output line-by-line the first time it scrolls into
 * view, then flips its status from EXECUTANDO to CONCLUIDO. Respects
 * prefers-reduced-motion by rendering the final state immediately.
 */
export const LiveTerminal = ({ role, output }: LiveTerminalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const command = `> executando: ${role.toLowerCase()}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(output);
      setPhase("done");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === "idle") {
          setPhase("typing");
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [phase, output]);

  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(output.slice(0, i));
      if (i >= output.length) {
        window.clearInterval(id);
        setPhase("running");
        window.setTimeout(() => setPhase("done"), RUN_DELAY);
      }
    }, TYPE_SPEED);
    return () => window.clearInterval(id);
  }, [phase, output]);

  const showCursor = phase === "typing" || phase === "running";

  return (
    <div
      ref={ref}
      className="bg-black/60 border border-primary/10 rounded-sm p-4 font-mono text-[10px] text-muted-foreground/80 leading-relaxed shadow-inner overflow-hidden min-h-[120px] select-none"
    >
      <div className="flex items-center gap-1.5 border-b border-primary/10 pb-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
        <span className="text-[8px] text-muted-foreground/50 ml-1.5 tracking-wider uppercase">
          Terminal Output
        </span>
      </div>
      <div className="text-primary/70 font-semibold mb-1">{command}</div>
      <div className="text-white/60 mb-1 min-h-[1.4em]">
        {typed}
        {showCursor && (
          <span className="inline-block w-[6px] h-[1em] -mb-[2px] ml-[1px] bg-primary/70 animate-pulse" />
        )}
      </div>
      <div
        className={
          phase === "done"
            ? "text-emerald-500/80 transition-opacity duration-300 opacity-100"
            : "text-primary/60 transition-opacity duration-300 opacity-100"
        }
      >
        {phase === "done"
          ? "> status: AGENTE_CONCLUIDO"
          : "> status: EXECUTANDO..."}
      </div>
    </div>
  );
};
