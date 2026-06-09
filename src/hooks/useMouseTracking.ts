import { useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalized: {
    x: number;
    y: number;
  };
}

export const useMouseTracking = (
  onMouseMove?: (position: MousePosition) => void,
  elementRef?: React.RefObject<HTMLElement>
) => {
  const positionRef = useRef<MousePosition>({
    x: 0,
    y: 0,
    normalized: { x: 0, y: 0 },
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const target = elementRef?.current || window;
      const element = elementRef?.current;

      let x = e.clientX;
      let y = e.clientY;

      // Normalizar para coordenadas do elemento se referência fornecida
      if (element) {
        const rect = element.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }

      // Normalizar para range 0-1
      const normalizedX = element
        ? x / element.clientWidth
        : e.clientX / window.innerWidth;
      const normalizedY = element
        ? y / element.clientHeight
        : e.clientY / window.innerHeight;

      positionRef.current = {
        x,
        y,
        normalized: {
          x: Math.max(0, Math.min(1, normalizedX)),
          y: Math.max(0, Math.min(1, normalizedY)),
        },
      };

      onMouseMove?.(positionRef.current);
    };

    const target = elementRef?.current || window;
    target.addEventListener('mousemove', handleMouseMove);

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onMouseMove, elementRef]);

  return positionRef;
};
