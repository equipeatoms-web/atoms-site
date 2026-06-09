import type { Variants } from "framer-motion";
import { EASE } from "./easings";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE.expoOut } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE.expoOut } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40, filter: "blur(8px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE.expoOut } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40, filter: "blur(8px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE.expoOut } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE.expoOut } },
};

export const staggerParent = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const charReveal: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE.expoOut },
  },
};
