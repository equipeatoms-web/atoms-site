import { MotionConfig } from "framer-motion";
import { type ReactNode } from "react";
import { EASE, DURATION } from "@/lib/animations/easings";

type Props = { children: ReactNode };

export const MotionConfigProvider = ({ children }: Props) => (
  <MotionConfig
    reducedMotion="user"
    transition={{ ease: EASE.expoOut, duration: DURATION.base }}
  >
    {children}
  </MotionConfig>
);
