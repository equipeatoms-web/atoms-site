import { motion, useReducedMotion } from "framer-motion";
import { charReveal, staggerParent } from "@/lib/animations/variants";

type SplitMode = "char" | "word";

type TextSplitProps = {
  text: string;
  mode?: SplitMode;
  stagger?: number;
  delay?: number;
  className?: string;
  charClassName?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

export const TextSplit = ({
  text,
  mode = "word",
  stagger = 0.06,
  delay = 0,
  className,
  charClassName,
  as = "span",
}: TextSplitProps) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.span;

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const tokens = mode === "char" ? text.split("") : text.split(" ");

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={staggerParent(stagger, delay)}
      aria-label={text}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={`${token}-${i}`}
          aria-hidden
          variants={charReveal}
          className={`inline-block ${charClassName ?? ""}`}
          style={{ whiteSpace: "pre" }}
        >
          {token}{mode === "word" && i < tokens.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Tag>
  );
};
