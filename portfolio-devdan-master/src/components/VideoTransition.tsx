import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { motion, useReducedMotion } from "framer-motion";

type RevealMode = "vertical" | "horizontal" | "pin";

interface VideoTransitionProps {
  src: string;
  mode: RevealMode;
  overlayText?: string;
}

/* ─── T1: vertical clip-path reveal ─── */
function VerticalReveal({ src, overlayText }: { src: string; overlayText?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    // Reveal in
    const tlIn = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 90%",
        end: "top 20%",
        scrub: 0.6,
        onEnter: () => video.play().catch(() => {}),
        onLeaveBack: () => video.pause(),
      },
    });
    tlIn
      .fromTo(video, { clipPath: "inset(50% 0 50% 0)", scale: 1.06, opacity: 0 },
               { clipPath: "inset(0% 0% 0% 0%)", scale: 1.0, opacity: 1, ease: "power2.out" })
      .fromTo(scanRef.current, { y: "-100%" }, { y: "100%", ease: "none" }, 0)
      .fromTo(textRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.55);

    // Reveal out
    gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: 0.6,
        onEnter: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
      },
    }).to(video, { clipPath: "inset(50% 0 50% 0)", opacity: 0, ease: "power2.in" });

    return () => ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === wrap) st.kill();
    });
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(260px, 60vh, 680px)", background: "#000" }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: "inset(50% 0 50% 0)", opacity: 0 }}
      />

      {/* Gold radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(circle at 50% 50%, transparent 35%, #000 88%)",
        opacity: 0.55,
      }} />

      {/* Gold scan-line */}
      <div
        ref={scanRef}
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent, hsl(38 33% 70% / 0.9), transparent)",
          mixBlendMode: "screen",
          top: 0,
        }}
      />

      {/* Overlay text */}
      {overlayText && (
        <div
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span className="font-serif text-[clamp(3.5rem,10vw,9rem)] tracking-[-0.04em] leading-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px hsl(38 33% 70% / 0.55)",
            }}>
            {overlayText}
          </span>
        </div>
      )}

      {/* Top + bottom fades */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, #000 0%, transparent 18%, transparent 82%, #000 100%)",
      }} />
    </div>
  );
}

/* ─── T2: horizontal wipe reveal ─── */
function HorizontalReveal({ src, overlayText }: { src: string; overlayText?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const tlIn = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 90%",
        end: "top 15%",
        scrub: 0.6,
        onEnter: () => video.play().catch(() => {}),
        onLeaveBack: () => video.pause(),
      },
    });
    tlIn
      .fromTo(video,
        { clipPath: "inset(0 50% 0 50%)", opacity: 0, filter: "blur(8px)" },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, filter: "blur(0px)", ease: "power2.out" })
      .fromTo([line1Ref.current, line2Ref.current], { scaleX: 0 }, { scaleX: 1, ease: "power2.out" }, 0.2)
      .fromTo(wordRef.current, { opacity: 0, x: 40 }, { opacity: 0.7, x: 0, ease: "power2.out" }, 0.4);

    gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "bottom 80%",
        end: "bottom 15%",
        scrub: 0.6,
        onLeave: () => video.pause(),
      },
    }).to(video, { clipPath: "inset(0 50% 0 50%)", opacity: 0, ease: "power2.in" });

    return () => ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === wrap) st.kill();
    });
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(260px, 60vh, 680px)", background: "#000" }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: "inset(0 50% 0 50%)", opacity: 0 }}
      />

      {/* Glass hairlines */}
      <div ref={line1Ref} className="absolute left-0 right-0 pointer-events-none"
        style={{ top: "25%", height: "1px", background: "linear-gradient(90deg, transparent, hsl(38 33% 70% / 0.6), transparent)", transformOrigin: "center", scaleX: 0 }} />
      <div ref={line2Ref} className="absolute left-0 right-0 pointer-events-none"
        style={{ top: "75%", height: "1px", background: "linear-gradient(90deg, transparent, hsl(38 33% 70% / 0.6), transparent)", transformOrigin: "center", scaleX: 0 }} />

      {/* Floating overlay word */}
      {overlayText && (
        <div ref={wordRef} className="absolute right-[8vw] top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ opacity: 0, mixBlendMode: "overlay" }}>
          <span className="font-serif text-[clamp(4rem,12vw,11rem)] tracking-[-0.04em] text-foreground/60">
            {overlayText}
          </span>
        </div>
      )}

      {/* Top + bottom fades */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, #000 0%, transparent 18%, transparent 82%, #000 100%)",
      }} />
    </div>
  );
}

/* ─── T3: pin while playing ─── */
function PinReveal({ src, overlayText }: { src: string; overlayText?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onEnter: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play().catch(() => {}),
        onLeaveBack: () => video.pause(),
      },
    });

    tl
      .fromTo(video, { opacity: 0, filter: "saturate(0.9)" },
               { opacity: 1, filter: "saturate(1.1)", ease: "none" })
      .fromTo(flareRef.current, { opacity: 0, scaleX: 0.4 },
               { opacity: 0.85, scaleX: 1, ease: "power2.out" }, 0.35)
      .to(flareRef.current, { opacity: 0, ease: "power2.in" }, 0.65)
      .fromTo(headlineRef.current, { opacity: 0, y: 24 },
               { opacity: 1, y: 0, ease: "power2.out" }, 0.38)
      .to(video, { opacity: 0, ease: "power2.in" }, 0.85);

    return () => ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger === wrap) st.kill();
    });
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", background: "#000" }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        loop
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Anamorphic lens flare */}
      <div
        ref={flareRef}
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: 0,
          right: 0,
          height: "60px",
          transform: "translateY(-50%)",
          background: "linear-gradient(90deg, transparent 5%, hsl(190 90% 65% / 0.45) 20%, hsl(38 33% 70% / 0.9) 50%, hsl(190 90% 65% / 0.45) 80%, transparent 95%)",
          filter: "blur(1px)",
          mixBlendMode: "screen",
          opacity: 0,
        }}
      />

      {/* Overlay headline */}
      {overlayText && (
        <div
          ref={headlineRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ opacity: 0 }}
        >
          <span className="font-serif text-[clamp(3rem,8vw,8rem)] tracking-[-0.04em] text-foreground/90 text-center px-8">
            {overlayText}
          </span>
        </div>
      )}

      {/* Bottom gradient bleed into ContactForm */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to bottom, #000 0%, transparent 12%, transparent 72%, #000 100%)",
      }} />
    </div>
  );
}

/* ─── Reduced motion fallback ─── */
function StaticFallback() {
  return (
    <div aria-hidden="true" style={{ height: "clamp(80px, 12vh, 160px)" }}
      className="w-full bg-gradient-to-b from-background via-primary/5 to-background" />
  );
}

/* ─── Public component ─── */
export const VideoTransition = ({ src, mode, overlayText }: VideoTransitionProps) => {
  const reduced = useReducedMotion();
  if (reduced) return <StaticFallback />;

  if (mode === "horizontal") return <HorizontalReveal src={src} overlayText={overlayText} />;
  if (mode === "pin") return <PinReveal src={src} overlayText={overlayText} />;
  return <VerticalReveal src={src} overlayText={overlayText} />;
};
