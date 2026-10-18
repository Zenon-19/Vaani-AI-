import React from "react";

interface WaveformVisualizerProps {
  progress?: number; // 0 to 1
  isPlaying?: boolean;
  isRecording?: boolean;
  bars?: number;
  height?: number;
  onSeek?: (ratio: number) => void;
  className?: string;
  audioLevels?: number[]; // optional live recording mic amplitudes
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  progress = 0,
  isPlaying = false,
  isRecording = false,
  bars = 48,
  height = 54,
  onSeek,
  className = "",
  audioLevels,
}) => {
  // Deterministic heights pattern simulating speech cadence
  const defaultHeights = React.useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < bars; i++) {
      // Natural speech-like burst envelope
      const wave1 = Math.sin((i / bars) * Math.PI * 3.5);
      const wave2 = Math.cos((i / bars) * Math.PI * 6.5);
      const base = 0.2 + 0.65 * Math.abs(wave1 * 0.7 + wave2 * 0.3);
      arr.push(Math.max(0.15, Math.min(1, base)));
    }
    return arr;
  }, [bars]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center justify-between gap-1 w-full overflow-hidden select-none ${
        onSeek ? "cursor-pointer group" : ""
      } ${className}`}
      style={{ height: `${height}px` }}
      role={onSeek ? "slider" : "presentation"}
      aria-label="Audio waveform timeline"
    >
      {defaultHeights.map((h, i) => {
        const barRatio = i / bars;
        const isPast = barRatio <= progress;
        
        let dynamicHeight = h;
        if (isRecording && audioLevels && audioLevels.length > 0) {
          const levelIdx = i % audioLevels.length;
          dynamicHeight = Math.max(0.15, audioLevels[levelIdx]);
        } else if (isPlaying && isPast) {
          // subtle animated pulse
          dynamicHeight = Math.min(1, h * (1 + 0.15 * Math.sin(Date.now() / 200 + i)));
        }

        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-100 min-w-[2px] max-w-[5px]"
            style={{
              height: `${Math.round(dynamicHeight * (height - 8))}px`,
              backgroundColor: isRecording
                ? "#F5AFCF"
                : isPast
                ? "#C9FF32"
                : "#202220",
              opacity: isRecording ? 0.9 : isPast ? 1 : 0.6,
            }}
          />
        );
      })}

      {/* Scrubber needle */}
      {onSeek && (
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-[#C9FF32] shadow-[0_0_8px_#C9FF32] pointer-events-none transition-all duration-75"
          style={{ left: `${progress * 100}%` }}
        >
          <div className="w-2.5 h-2.5 -ml-1 rounded-full bg-[#C9FF32] shadow-[0_0_6px_#C9FF32]" />
        </div>
      )}
    </div>
  );
};
