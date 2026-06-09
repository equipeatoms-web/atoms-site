import React, { useState, useEffect, useRef, HTMLAttributes } from 'react';

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

export interface GalleryItem {
  label: string;
  sector: string;
  result: string;
  photo: { url: string; text: string; pos?: string };
  metrics?: { value: string; label: string }[];
  features?: string[];
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
  onItemClick?: (index: number) => void;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 520, autoRotateSpeed = 0.08, onItemClick, ...props }, ref) => {
    const rotationRef = useRef(0);
    const velocityRef = useRef(0);
    const isDraggingRef = useRef(false);
    const didDragRef = useRef(false); // distingue clique de drag
    const lastXRef = useRef(0);
    const rafRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [, forceRender] = useState(0);

    useEffect(() => {
      const loop = () => {
        if (!isDraggingRef.current) {
          velocityRef.current *= 0.95;
          if (Math.abs(velocityRef.current) < 0.01) {
            velocityRef.current = 0;
            rotationRef.current -= autoRotateSpeed;
          } else {
            rotationRef.current += velocityRef.current;
          }
        }
        forceRender(r => r + 1);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [autoRotateSpeed]);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const onMouseDown = (e: MouseEvent) => {
        isDraggingRef.current = true;
        didDragRef.current = false;
        lastXRef.current = e.clientX;
        velocityRef.current = 0;
        el.style.cursor = 'grabbing';
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastXRef.current;
        if (Math.abs(dx) > 3) didDragRef.current = true;
        velocityRef.current = dx * 0.3;
        rotationRef.current += dx * 0.3;
        lastXRef.current = e.clientX;
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
        el.style.cursor = 'grab';
      };

      const onTouchStart = (e: TouchEvent) => {
        isDraggingRef.current = true;
        didDragRef.current = false;
        lastXRef.current = e.touches[0].clientX;
        velocityRef.current = 0;
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.touches[0].clientX - lastXRef.current;
        if (Math.abs(dx) > 3) didDragRef.current = true;
        velocityRef.current = dx * 0.3;
        rotationRef.current += dx * 0.3;
        lastXRef.current = e.touches[0].clientX;
      };
      const onTouchEnd = () => { isDraggingRef.current = false; };

      el.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      el.addEventListener('touchstart', onTouchStart, { passive: true });
      el.addEventListener('touchmove', onTouchMove, { passive: true });
      el.addEventListener('touchend', onTouchEnd);
      el.style.cursor = 'grab';

      return () => {
        el.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
      };
    }, []);

    const anglePerItem = 360 / items.length;
    const rotation = rotationRef.current;

    return (
      <div
        ref={(node) => {
          (containerRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        role="region"
        aria-label="Galeria de casos"
        className={cn('relative w-full h-full flex items-center justify-center select-none', className)}
        style={{ perspective: '2000px' }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const relativeAngle = (itemAngle + rotation % 360 + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.2, 1 - normalizedAngle / 180);
            // card da frente: normalizedAngle < 30
            const isFront = normalizedAngle < 30;

            return (
              <div
                key={item.label}
                className="absolute w-[260px] h-[360px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: '50%', top: '50%',
                  marginLeft: '-130px', marginTop: '-180px',
                  opacity,
                  transition: 'opacity 0.2s linear',
                }}
                onClick={() => {
                  if (!didDragRef.current && onItemClick) onItemClick(i);
                }}
              >
                <div className={cn(
                  "relative w-full h-full rounded-sm overflow-hidden border bg-[hsl(0,0%,5%)] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] group transition-all duration-300",
                  isFront
                    ? "border-primary/40 shadow-[0_0_40px_hsl(38_33%_70%/0.18)] cursor-pointer"
                    : "border-primary/10 cursor-grab"
                )}>
                  {/* Gold grid background */}
                  <div className="absolute inset-0"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='hsl(38 33%25 70%25 / 0.07)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }}
                  />
                  {/* Radial glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,hsl(38_55%_55%/0.12),transparent_65%)]" />
                  {/* Top hairline */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  {/* Number — pequeno, discreto */}
                  <div className="absolute top-4 right-4 font-serif text-xs text-primary/25 font-bold leading-none select-none tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col p-5 gap-3">
                    {/* Header */}
                    <div>
                      <div className="w-6 h-px bg-primary/50 mb-3" />
                      <div className="text-[8px] tracking-[0.2em] uppercase text-primary/60 font-semibold mb-1">{item.sector}</div>
                      <h3 className="font-serif text-base text-foreground leading-tight">{item.label}</h3>
                    </div>

                    {/* Metrics */}
                    {item.metrics && (
                      <div className="grid grid-cols-2 gap-1.5">
                        {item.metrics.map((m) => (
                          <div key={m.label} className="bg-primary/5 border border-primary/10 rounded-sm px-2 py-1.5">
                            <div className="font-serif text-base text-primary leading-none">{m.value}</div>
                            <div className="text-[8px] text-muted-foreground/60 mt-0.5 leading-tight">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Features */}
                    {item.features && (
                      <ul className="space-y-1 flex-1">
                        {item.features.map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-[9px] text-muted-foreground/70 leading-snug">
                            <span className="text-primary/50 mt-px shrink-0">—</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Result */}
                    <div className="border-t border-primary/10 pt-2 mt-auto">
                      <p className="text-[9px] text-primary/60 leading-snug">{item.result}</p>
                      {isFront && (
                        <div className="text-[8px] tracking-widest uppercase text-primary/50 mt-1.5">
                          ver detalhes →
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-muted-foreground/35 pointer-events-none">
          ← arraste para girar →
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = 'CircularGallery';
export { CircularGallery };
