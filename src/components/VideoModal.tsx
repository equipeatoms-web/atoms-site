import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { scrollToId } from "@/lib/animations/scroll";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
}

export const VideoModal = ({ open, onClose }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleClose = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    onClose();
    setTimeout(() => scrollToId("arquitetura"), 400);
  }, [onClose]);

  // Auto-play when opens
  useEffect(() => {
    if (!open) return;
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    const play = () => { v.play().then(() => setPlaying(true)).catch(() => {}); };
    // slight delay to let animation settle
    const t = setTimeout(play, 600);
    return () => clearTimeout(t);
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const onEnded = () => {
    setPlaying(false);
    handleClose();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const fullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    videoRef.current?.requestFullscreen();
  };

  const showControls = () => {
    setControlsVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if (playing) setControlsVisible(false); }, 3000);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 cursor-pointer"
            style={{ background: "hsl(0 0% 2% / 0.96)", backdropFilter: "blur(20px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Gold glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, hsl(38 55% 55% / 0.08) 0%, transparent 60%)" }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full z-10"
            style={{ maxWidth: "min(900px, 92vw)" }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  style={{ boxShadow: "0 0 6px hsl(38 33% 70% / 0.9)" }}
                />
                <span className="text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ color: "hsl(38 33% 70%)" }}>
                  André Tomaz · ATom's
                </span>
              </div>
              <button
                onClick={handleClose}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-foreground/80 transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline tracking-wide">Fechar e ver a solução</span>
              </button>
            </div>

            {/* Video container */}
            <div
              className="relative rounded-sm overflow-hidden"
              onMouseMove={showControls}
              onMouseEnter={showControls}
              onClick={toggle}
              style={{
                aspectRatio: "16/9",
                border: "1px solid hsl(38 33% 70% / 0.2)",
                boxShadow: "0 40px 120px hsl(0 0% 0% / 0.8), 0 0 80px hsl(38 33% 70% / 0.12)",
                background: "#000",
                cursor: "pointer",
              }}
            >
              <video
                ref={videoRef}
                src="/video/andre-tomaz.mp4"
                className="w-full h-full object-cover"
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onEnded={onEnded}
                playsInline
              />

              {/* Center play/pause flash */}
              <AnimatePresence>
                {!playing && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      style={{ background: "hsl(38 33% 70% / 0.15)", border: "1px solid hsl(38 33% 70% / 0.4)" }}
                    >
                      <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls overlay */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-12"
                style={{
                  background: "linear-gradient(to top, hsl(0 0% 0% / 0.85) 0%, transparent 100%)",
                  pointerEvents: controlsVisible ? "auto" : "none",
                }}
                animate={{ opacity: controlsVisible ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Progress bar */}
                <div
                  className="w-full h-1 rounded-full mb-4 cursor-pointer group"
                  style={{ background: "hsl(0 0% 25%)" }}
                  onClick={seek}
                >
                  <div
                    className="h-full rounded-full relative"
                    style={{ width: `${progress}%`, background: "hsl(38 33% 70%)", transition: "width 0.1s linear" }}
                  >
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "hsl(38 33% 70%)", transform: "translateY(-50%) scale(1.2)" }}
                    />
                  </div>
                </div>

                {/* Buttons row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={toggle} className="text-white/80 hover:text-primary transition-colors">
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <button onClick={toggleMute} className="text-white/80 hover:text-primary transition-colors">
                      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-[11px] text-white/50 font-mono tabular-nums">
                      {fmt(currentTime)} / {fmt(duration)}
                    </span>
                  </div>
                  <button onClick={fullscreen} className="text-white/80 hover:text-primary transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Gold bottom line */}
              <div
                aria-hidden
                className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
                style={{ background: "linear-gradient(to right, transparent, hsl(38 33% 70% / 0.5), transparent)" }}
              />
            </div>

            {/* Bottom hint */}
            <motion.p
              className="text-center text-[11px] text-muted-foreground/35 mt-4 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Ao fechar ou terminar o vídeo você verá como a ATom's funciona na prática.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
