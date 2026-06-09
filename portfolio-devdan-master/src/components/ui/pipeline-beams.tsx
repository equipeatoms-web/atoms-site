import { motion } from "framer-motion";

interface PipelineBeamProps {
  /** side the card is on relative to the center timeline */
  side: "left" | "right";
  /** vertical offset from the timeline center point, in px */
  offsetY?: number;
  delay?: number;
}

/**
 * A single gold beam that travels horizontally from the timeline center
 * into the agent card on either side.
 */
export const PipelineBeam = ({ side, offsetY = 0, delay = 0 }: PipelineBeamProps) => {
  const width = 220;
  const toRight = side === "right";

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: toRight ? "50%" : `calc(50% - ${width}px)`,
        top: "50%",
        transform: `translateY(calc(-50% + ${offsetY}px))`,
        width,
        height: 2,
        overflow: "visible",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <motion.linearGradient
          id={`beam-grad-${side}-${delay}`}
          gradientUnits="userSpaceOnUse"
          x1={toRight ? 0 : width}
          x2={toRight ? width : 0}
          y1="0"
          y2="0"
          initial={{ x1: toRight ? -width : width * 2, x2: toRight ? 0 : width }}
          animate={{ x1: toRight ? width : -width, x2: toRight ? width * 2 : 0 }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.6, ease: "linear", delay }}
        >
          <stop offset="0%" stopColor="hsl(38 55% 60%)" stopOpacity="0" />
          <stop offset="40%" stopColor="hsl(42 80% 68%)" stopOpacity="1" />
          <stop offset="70%" stopColor="hsl(38 55% 60%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(38 55% 60%)" stopOpacity="0" />
        </motion.linearGradient>
        <filter id={`beam-blur-${side}-${delay}`}>
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
      </defs>
      {/* glow layer */}
      <line
        x1="0" y1="1" x2={width} y2="1"
        stroke={`url(#beam-grad-${side}-${delay})`}
        strokeWidth="4"
        filter={`url(#beam-blur-${side}-${delay})`}
        opacity="0.5"
      />
      {/* sharp layer */}
      <line
        x1="0" y1="1" x2={width} y2="1"
        stroke={`url(#beam-grad-${side}-${delay})`}
        strokeWidth="1.5"
      />
    </svg>
  );
};

/** Renders all beams for one AgentStep */
export const StepBeams = ({ side }: { side: "left" | "right" }) => (
  <>
    <PipelineBeam side={side} offsetY={-30} delay={0} />
    <PipelineBeam side={side} offsetY={0}   delay={0.5} />
    <PipelineBeam side={side} offsetY={30}  delay={1.1} />
  </>
);
