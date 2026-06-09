import { useEffect, useRef, useState, ComponentType } from "react";
import { LucideProps } from "lucide-react";

export interface ChatMessage {
  from: "agent" | "user" | "system";
  text: string;
  delay?: number;
}

interface LiveChatProps {
  messages: ChatMessage[];
  agentName: string;
  AgentIcon?: ComponentType<LucideProps>;
  style?: "whatsapp" | "slack" | "email" | "acervo" | "default";
}

const CHAR_SPEED = 22; // ms per char

function useTypingMessages(messages: ChatMessage[], active: boolean) {
  const [rendered, setRendered] = useState<{ msg: ChatMessage; text: string; done: boolean }[]>([]);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRendered(messages.map((m) => ({ msg: m, text: m.text, done: true })));
      return;
    }

    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        const pause = msg.delay ?? 900;
        await new Promise((r) => setTimeout(r, pause));
        if (cancelled) return;

        // show bubble with empty text (typing indicator)
        setRendered((prev) => [...prev, { msg, text: "", done: false }]);
        await new Promise((r) => setTimeout(r, 400));
        if (cancelled) return;

        // type char by char
        for (let c = 1; c <= msg.text.length; c++) {
          if (cancelled) return;
          const partial = msg.text.slice(0, c);
          setRendered((prev) =>
            prev.map((r, idx) => (idx === prev.length - 1 ? { ...r, text: partial } : r))
          );
          await new Promise((r) => setTimeout(r, CHAR_SPEED));
        }
        // mark done
        setRendered((prev) =>
          prev.map((r, idx) => (idx === prev.length - 1 ? { ...r, done: true } : r))
        );
      }
    };
    run();
    return () => { cancelled = true; };
  }, [active, messages]);

  return rendered;
}

// All styles use only the site palette: black + gold tokens
const headerStyle = "bg-[hsl(0,0%,6%)] border-b border-[hsl(38,33%,70%,0.15)] text-[hsl(36,21%,92%)]";
const bubbleAgentStyle = "bg-[hsl(0,0%,9%)] border border-[hsl(38,33%,70%,0.15)] text-[hsl(36,21%,88%)] rounded-tl-none";
const bubbleUserStyle  = "bg-[hsl(38,33%,70%,0.12)] border border-[hsl(38,33%,70%,0.25)] text-[hsl(38,60%,82%)] rounded-tr-none";

// Keep the type accepted by the component but ignore style differences
const headerStyles   = { whatsapp: headerStyle, slack: headerStyle, email: headerStyle, acervo: headerStyle, default: headerStyle };
const bubbleAgent    = { whatsapp: bubbleAgentStyle, slack: bubbleAgentStyle, email: bubbleAgentStyle, acervo: bubbleAgentStyle, default: bubbleAgentStyle };
const bubbleUser     = { whatsapp: bubbleUserStyle,  slack: bubbleUserStyle,  email: bubbleUserStyle,  acervo: bubbleUserStyle,  default: bubbleUserStyle  };

export const LiveChat = ({ messages, agentName, AgentIcon, style = "default" }: LiveChatProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const rendered = useTypingMessages(messages, active);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);


  return (
    <div ref={ref} className="rounded-sm border border-primary/20 bg-[hsl(0,0%,5%)]">
      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-2 text-[11px] font-semibold shrink-0 ${headerStyles[style]}`}>
        {AgentIcon && <AgentIcon className="w-3.5 h-3.5 text-primary/70 shrink-0" />}
        <span className="tracking-wide">{agentName}</span>
        <span className="ml-auto flex items-center gap-1 text-primary/60 text-[9px]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          online
        </span>
      </div>

      {/* Messages */}
      <div className="px-3 py-2 space-y-2">
        {rendered.map((r, i) => {
          const isAgent = r.msg.from === "agent";
          const isSystem = r.msg.from === "system";
          if (isSystem) return (
            <div key={i} className="text-center text-[9px] text-muted-foreground/50 py-0.5">{r.text}</div>
          );
          return (
            <div key={i} className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[80%] text-[11px] leading-relaxed px-2.5 py-1.5 rounded-lg ${isAgent ? bubbleAgent[style] : bubbleUser[style]}`}>
                {r.text}
                {!r.done && (
                  <span className="inline-flex gap-0.5 ml-1 items-end h-3">
                    <span className="w-1 h-1 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
