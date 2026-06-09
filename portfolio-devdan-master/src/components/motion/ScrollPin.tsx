import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

type ScrollPinProps = {
  children: ReactNode;
  className?: string;
  start?: string;
  end?: string;
  enabled?: boolean;
};

export const ScrollPin = ({
  children,
  className,
  start = "top top",
  end = "+=120%",
  enabled = true,
}: ScrollPinProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current || !enabled) return;
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      end,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    });
    return () => trigger.kill();
  }, { scope: ref, dependencies: [enabled, start, end] });

  return <div ref={ref} className={className}>{children}</div>;
};
