import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export const VideoPlayer = ({ src, poster, className = "" }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
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

  const onEnded = () => setPlaying(false);

  return (
    <div
      className={`relative group rounded-sm overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={toggle}
      style={{ cursor: "pointer" }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        className="w-full h-full object-cover"
        playsInline
      />

      {/* Play/Pause overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
        style={{ opacity: !playing || hovered ? 1 : 0, background: "hsl(0 0% 0% / 0.3)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform duration-200 group-hover:scale-105"
          style={{ background: "hsl(38 33% 70% / 0.2)", border: "1px solid hsl(38 33% 70% / 0.5)" }}
        >
          {playing
            ? <Pause className="w-5 h-5 text-primary fill-primary" />
            : <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
          }
        </div>
      </div>

      {/* Controls bar */}
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-8 transition-opacity duration-200"
        style={{
          opacity: hovered || !playing ? 1 : 0,
          background: "linear-gradient(to top, hsl(0 0% 0% / 0.7), transparent)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress */}
        <div
          className="w-full h-1 rounded-full mb-3 cursor-pointer"
          style={{ background: "hsl(0 0% 30%)" }}
          onClick={seek}
        >
          <div
            className="h-full rounded-full transition-none"
            style={{ width: `${progress}%`, background: "hsl(38 33% 70%)" }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggle}
            className="text-white/70 hover:text-primary transition-colors"
          >
            {playing
              ? <Pause className="w-4 h-4" />
              : <Play className="w-4 h-4 fill-current" />
            }
          </button>
          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="text-white/70 hover:text-primary transition-colors">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button onClick={fullscreen} className="text-white/70 hover:text-primary transition-colors">
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
