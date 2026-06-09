import { useEffect, useState } from "react";

export const useReducedMotion3D = () => {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [lowEnd, setLowEnd] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const lowMem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
    setLowEnd(isMobile || !!lowMem);
  }, []);

  return reduce || lowEnd;
};
