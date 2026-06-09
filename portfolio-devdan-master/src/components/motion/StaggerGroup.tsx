import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import { staggerParent } from "@/lib/animations/variants";

type StaggerGroupProps = {
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  className?: string;
  amount?: number;
  once?: boolean;
};

export const StaggerGroup = ({
  children,
  stagger = 0.1,
  delayChildren = 0,
  className,
  amount = 0.3,
  once = true,
}: StaggerGroupProps) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={staggerParent(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
};
