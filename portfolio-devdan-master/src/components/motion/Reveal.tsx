import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";
import { EASE, DURATION } from "@/lib/animations/easings";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "span";
};

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case "up": return { y: distance };
    case "down": return { y: -distance };
    case "left": return { x: distance };
    case "right": return { x: -distance };
    default: return {};
  }
};

export const Reveal = ({
  children,
  delay = 0,
  duration = DURATION.base,
  direction = "up",
  distance = 32,
  blur = true,
  once = true,
  amount = 0.3,
  className,
  as = "div",
}: RevealProps) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offsetFor(direction, distance),
      filter: blur ? "blur(12px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration, delay, ease: EASE.expoOut },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
};
