import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward } from "lucide-react";
import { WaveformVisualizer } from "../brand/WaveformVisualizer";
import { formatTime } from "../../lib/utils";

interface AudioPlayerProps {
  durationSeconds?: number;
  audioUrl?: string;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  durationSeconds = 240,
  audioUrl,
  onTimeUpdate,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<any>(null);

  const totalDuration = durationSeconds > 0 ? durationSeconds : 240;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.25 * playbackSpeed;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          onTimeUpdate?.(next);
          return next;
        });
      }, 250);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, playbackSpeed, totalDuration, onTimeUpdate]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (ratio: number) => {
    const newTime = ratio * totalDuration;
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const progressRatio = totalDuration > 0 ? Math.min(1, currentTime / totalDuration) : 0;

  return (
    <div className={`p-5 rounded-3xl bg-[#171817] border border-[#30332E] space-y-4 ${className}`}>
      {/* Top Header: Time elapsed and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs tabular-nums text-[#F1F0E9]">
          <span className="text-[#C9FF32] font-semibold">{formatTime(currentTime)}</span>
          <span className="text-[#A4A69F]">/</span>
          <span className="text-[#A4A69F]">{formatTime(totalDuration)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed selector */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 rounded-lg bg-[#111311] border border-[#30332E] text-xs font-mono text-[#A4A69F] hover:text-[#C9FF32] transition-colors cursor-pointer"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>

          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Waveform track with interactive scrubber */}
      <WaveformVisualizer
        progress={progressRatio}
        isPlaying={isPlaying}
        onSeek={handleSeek}
        height={46}
      />

      {/* Player Actions */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={() => handleSeek(Math.max(0, (currentTime - 10) / totalDuration))}
          className="p-2 rounded-xl text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
          title="Rewind 10 seconds"
        >
          <RotateCcw className="w-3.5 h-3.5" /> -10s
        </button>

        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-2xl bg-[#C9FF32] text-[#090A09] flex items-center justify-center shadow-[0_0_15px_rgba(201,255,50,0.25)] hover:bg-[#d5ff57] active:scale-95 transition-all cursor-pointer"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => handleSeek(Math.min(1, (currentTime + 10) / totalDuration))}
          className="p-2 rounded-xl text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
          title="Forward 10 seconds"
        >
          +10s <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
