import React, { useState, useMemo, useRef } from "react";
import {
  Activity,
  Zap,
  TrendingUp,
  Volume2,
  ChevronRight,
  Flame,
  AlertCircle,
  Eye,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";
import { TranscriptSegment, VoiceIntensityPoint, EmotionalIntensityHotspot } from "../../types";
import { generateVoiceIntensityData } from "../../lib/vocalProsody";
import { formatTime } from "../../lib/utils";

interface VoicePitchIntensityVisualizerProps {
  segments: TranscriptSegment[];
  durationSeconds?: number;
  currentTime?: number;
  onSeek?: (timeSeconds: number) => void;
  onSelectSegment?: (segmentId: string) => void;
  className?: string;
}

type ViewMode = "combined" | "pitch" | "amplitude";

export const VoicePitchIntensityVisualizer: React.FC<VoicePitchIntensityVisualizerProps> = ({
  segments,
  durationSeconds = 240,
  currentTime = 0,
  onSeek,
  onSelectSegment,
  className = "",
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("combined");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("all");
  const [hoveredPoint, setHoveredPoint] = useState<VoiceIntensityPoint | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const totalDuration = Math.max(30, durationSeconds);

  // Compute vocal prosody and pitch trajectory data
  const { points, hotspots, averagePitch, peakPitch } = useMemo(() => {
    return generateVoiceIntensityData(segments, totalDuration);
  }, [segments, totalDuration]);

  // Unique speakers
  const speakers = useMemo(() => {
    const map = new Map<string, string>();
    segments.forEach((s) => map.set(s.speakerId, s.speakerName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [segments]);

  // Filtered points by speaker
  const filteredPoints = useMemo(() => {
    if (selectedSpeaker === "all") return points;
    return points.filter((p) => p.speakerId === selectedSpeaker);
  }, [points, selectedSpeaker]);

  // Scaled coordinates for SVG (width: 800, height: 130)
  const svgWidth = 800;
  const svgHeight = 130;
  const paddingBottom = 22;
  const usableHeight = svgHeight - paddingBottom;

  // Min and max pitch for scaling
  const minPitch = 90;
  const maxPitch = Math.max(380, peakPitch + 20);

  // Construct pitch path (SVG bezier curve)
  const pitchPath = useMemo(() => {
    if (filteredPoints.length === 0) return "";
    const pts = filteredPoints.map((pt, idx) => {
      const x = (pt.timeSeconds / totalDuration) * svgWidth;
      // Invert Y: higher pitch is closer to top (0)
      const normalizedPitch = Math.max(0, Math.min(1, (pt.pitchHz - minPitch) / (maxPitch - minPitch)));
      const y = usableHeight - normalizedPitch * (usableHeight - 14) + 6;
      return { x, y };
    });

    if (pts.length < 2) return "";
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const midX = (prev.x + curr.x) / 2;
      d += ` C ${midX.toFixed(1)} ${prev.y.toFixed(1)}, ${midX.toFixed(1)} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }
    return d;
  }, [filteredPoints, totalDuration, usableHeight, minPitch, maxPitch]);

  // Pitch area fill path
  const pitchAreaPath = useMemo(() => {
    if (!pitchPath || filteredPoints.length === 0) return "";
    const firstX = ((filteredPoints[0].timeSeconds / totalDuration) * svgWidth).toFixed(1);
    const lastX = ((filteredPoints[filteredPoints.length - 1].timeSeconds / totalDuration) * svgWidth).toFixed(1);
    return `${pitchPath} L ${lastX} ${usableHeight} L ${firstX} ${usableHeight} Z`;
  }, [pitchPath, filteredPoints, totalDuration, usableHeight]);

  // Current playback scrubber position in SVG units
  const currentScrubberX = (Math.min(currentTime, totalDuration) / totalDuration) * svgWidth;

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !onSeek) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = ratio * totalDuration;
    onSeek(targetSeconds);

    // Find and select segment
    const targetSeg = segments.find(
      (s) =>
        s.startTime !== undefined &&
        s.endTime !== undefined &&
        targetSeconds >= s.startTime &&
        targetSeconds <= s.endTime
    );
    if (targetSeg && onSelectSegment) {
      onSelectSegment(targetSeg.id);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    const hoverSeconds = ratio * totalDuration;

    setHoverX(mouseX);

    // Find closest data point
    let closest = points[0];
    let minDiff = Infinity;
    points.forEach((p) => {
      const diff = Math.abs(p.timeSeconds - hoverSeconds);
      if (diff < minDiff) {
        minDiff = diff;
        closest = p;
      }
    });
    setHoveredPoint(closest);
  };

  const handleSvgMouseLeave = () => {
    setHoveredPoint(null);
    setHoverX(null);
  };

  const handleJumpToHotspot = (hotspot: EmotionalIntensityHotspot) => {
    onSeek?.(hotspot.timeSeconds);
    if (hotspot.segmentId && onSelectSegment) {
      onSelectSegment(hotspot.segmentId);
    }
  };

  return (
    <div
      className={`p-5 rounded-3xl bg-[#171817] border border-[#30332E] space-y-4 ${className}`}
    >
      {/* Header Bar: Title, Diagnostic Metrics, and View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#30332E]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#C8A6FF]/10 border border-[#C8A6FF]/30 flex items-center justify-center text-[#C8A6FF]">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#F1F0E9] tracking-tight">
              Voice Pitch & Emotional Intensity Trajectory
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#A4A69F]">
            <span>Fundamental Frequency F0</span>
            <span aria-hidden="true">·</span>
            <span>Acoustic Arousal Envelope</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#F5AFCF] font-medium font-mono tabular-nums">
              {hotspots.length} Emotional Spikes Detected
            </span>
          </div>
        </div>

        {/* View Mode & Speaker Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#111311] border border-[#30332E]">
            <button
              onClick={() => setViewMode("combined")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "combined"
                  ? "bg-[#202220] text-[#F1F0E9] shadow-sm"
                  : "text-[#A4A69F] hover:text-[#F1F0E9]"
              }`}
              title="Combined waveform and pitch curve"
            >
              Combined
            </button>
            <button
              onClick={() => setViewMode("pitch")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "pitch"
                  ? "bg-[#202220] text-[#C8A6FF] shadow-sm"
                  : "text-[#A4A69F] hover:text-[#F1F0E9]"
              }`}
              title="Pitch frequency contour (Hz)"
            >
              Pitch (Hz)
            </button>
            <button
              onClick={() => setViewMode("amplitude")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "amplitude"
                  ? "bg-[#202220] text-[#C9FF32] shadow-sm"
                  : "text-[#A4A69F] hover:text-[#F1F0E9]"
              }`}
              title="Vocal energy & volume waveform"
            >
              Energy
            </button>
          </div>

          {/* Speaker Selector */}
          {speakers.length > 1 && (
            <select
              value={selectedSpeaker}
              onChange={(e) => setSelectedSpeaker(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C8A6FF] cursor-pointer"
              title="Filter by speaker"
            >
              <option value="all">All Speakers</option>
              {speakers.map((spk) => (
                <option key={spk.id} value={spk.id}>
                  {spk.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Interactive Visualizer Canvas / SVG */}
      <div className="relative rounded-2xl bg-[#090A09] border border-[#202220] p-2 overflow-hidden select-none">
        {/* Pitch Scale Guide Lines */}
        <div className="absolute left-3 top-2 bottom-6 flex flex-col justify-between pointer-events-none text-[9px] font-mono text-[#A4A69F]/40 tabular-nums">
          <span>{maxPitch} Hz (High Tension)</span>
          <span>{Math.round((maxPitch + minPitch) / 2)} Hz (Conversational)</span>
          <span>{minPitch} Hz (Baseline)</span>
        </div>

        {/* The SVG Visualization Track */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-32 cursor-crosshair overflow-visible"
          preserveAspectRatio="none"
          onClick={handleSvgClick}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={handleSvgMouseLeave}
          role="region"
          aria-label="Interactive voice pitch and waveform intensity graph"
        >
          <defs>
            {/* Pitch Area Gradient */}
            <linearGradient id="pitchGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C8A6FF" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#C8A6FF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C8A6FF" stopOpacity="0.0" />
            </linearGradient>

            {/* Spike Glow Filter */}
            <filter id="spikeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Reference Grid Lines */}
          <line
            x1="0"
            y1={usableHeight * 0.25}
            x2={svgWidth}
            y2={usableHeight * 0.25}
            stroke="#30332E"
            strokeDasharray="4 4"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1={usableHeight * 0.65}
            x2={svgWidth}
            y2={usableHeight * 0.65}
            stroke="#30332E"
            strokeDasharray="4 4"
            strokeWidth="0.8"
          />

          {/* 1. Waveform Bars (Rendered when in 'combined' or 'amplitude' mode) */}
          {(viewMode === "combined" || viewMode === "amplitude") && (
            <g className="waveform-bars">
              {filteredPoints.map((pt, i) => {
                const barWidth = Math.max(2, (svgWidth / filteredPoints.length) * 0.68);
                const x = (pt.timeSeconds / totalDuration) * svgWidth;
                const barHeight = Math.max(6, pt.amplitude * (usableHeight - 16));
                const y = usableHeight - barHeight;
                const isPast = pt.timeSeconds <= currentTime;

                // Color based on emotional intensity & playback state
                let barColor = "#202220";
                if (pt.isSpike) {
                  barColor = isPast ? "#F5AFCF" : "#F5AFCF/80";
                } else if (pt.intensityScore >= 0.5) {
                  barColor = isPast ? "#C8A6FF" : "#3a304a";
                } else if (isPast) {
                  barColor = "#C9FF32";
                }

                return (
                  <rect
                    key={`bar-${i}`}
                    x={x - barWidth / 2}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={1.5}
                    fill={barColor}
                    opacity={isPast ? 1 : 0.65}
                    className="transition-all duration-75"
                  />
                );
              })}
            </g>
          )}

          {/* 2. Pitch Area & Contour Curve (Rendered when in 'combined' or 'pitch' mode) */}
          {(viewMode === "combined" || viewMode === "pitch") && (
            <g className="pitch-curve">
              {/* Shaded Area */}
              {pitchAreaPath && (
                <path d={pitchAreaPath} fill="url(#pitchGradient)" />
              )}

              {/* Pitch Spline Line */}
              {pitchPath && (
                <path
                  d={pitchPath}
                  fill="none"
                  stroke="#C8A6FF"
                  strokeWidth={viewMode === "pitch" ? "2.5" : "1.8"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          )}

          {/* 3. Emotional Intensity Hotspot Beacons */}
          {hotspots.map((spot) => {
            const x = (spot.timeSeconds / totalDuration) * svgWidth;
            const normalized = Math.max(
              0,
              Math.min(1, (spot.pitchHz - minPitch) / (maxPitch - minPitch))
            );
            const y = usableHeight - normalized * (usableHeight - 14) + 6;
            const isSelected = Math.abs(currentTime - spot.timeSeconds) < 2.5;

            return (
              <g
                key={spot.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleJumpToHotspot(spot);
                }}
              >
                {/* Outer Pulse Beacon */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 10 : 7}
                  fill="#F5AFCF"
                  fillOpacity="0.25"
                  className={isSelected ? "animate-ping" : ""}
                />
                {/* Core Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 5 : 3.8}
                  fill="#F5AFCF"
                  stroke="#090A09"
                  strokeWidth="1.5"
                  filter="url(#spikeGlow)"
                />
              </g>
            );
          })}

          {/* 4. Active Playback Scrubber Needle */}
          <line
            x1={currentScrubberX}
            y1={0}
            x2={currentScrubberX}
            y2={usableHeight + 10}
            stroke="#C9FF32"
            strokeWidth="1.8"
            filter="url(#spikeGlow)"
          />
          <polygon
            points={`${currentScrubberX - 4},0 ${currentScrubberX + 4},0 ${currentScrubberX},6`}
            fill="#C9FF32"
          />

          {/* 5. Hover Crosshair */}
          {hoverX !== null && hoveredPoint && (
            <line
              x1={(hoveredPoint.timeSeconds / totalDuration) * svgWidth}
              y1={0}
              x2={(hoveredPoint.timeSeconds / totalDuration) * svgWidth}
              y2={usableHeight}
              stroke="#F1F0E9"
              strokeDasharray="2 2"
              strokeWidth="1"
              opacity="0.6"
            />
          )}

          {/* Time axis labels */}
          <text
            x="4"
            y={svgHeight - 4}
            fill="#A4A69F"
            fontSize="9"
            fontFamily="monospace"
          >
            00:00
          </text>
          <text
            x={svgWidth * 0.33}
            y={svgHeight - 4}
            fill="#A4A69F"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {formatTime(totalDuration * 0.33)}
          </text>
          <text
            x={svgWidth * 0.66}
            y={svgHeight - 4}
            fill="#A4A69F"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {formatTime(totalDuration * 0.66)}
          </text>
          <text
            x={svgWidth - 4}
            y={svgHeight - 4}
            fill="#A4A69F"
            fontSize="9"
            fontFamily="monospace"
            textAnchor="end"
          >
            {formatTime(totalDuration)}
          </text>
        </svg>

        {/* Hover Inspector Glass Card */}
        {hoveredPoint && hoverX !== null && (
          <div
            className="absolute top-2 pointer-events-none z-20 p-2.5 rounded-xl bg-[#111311]/95 border border-[#30332E] shadow-2xl backdrop-blur-md max-w-[240px] text-xs space-y-1.5 transition-all"
            style={{
              left: `${Math.min(
                Math.max(10, hoverX - 110),
                (svgRef.current?.clientWidth || 300) - 250
              )}px`,
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#30332E]/60 pb-1 font-mono text-[11px] tabular-nums">
              <span className="text-[#C9FF32] font-semibold">
                {formatTime(hoveredPoint.timeSeconds)}
              </span>
              <span
                className={
                  hoveredPoint.isSpike
                    ? "text-[#F5AFCF] font-semibold"
                    : "text-[#A4A69F]"
                }
              >
                {hoveredPoint.isSpike ? "⚡ Intensity Spike" : "Baseline Voice"}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-[#F1F0E9] font-medium truncate">
                {hoveredPoint.speakerName}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#A4A69F]">
                <span>
                  Pitch:{" "}
                  <strong className="text-[#C8A6FF] font-mono">
                    {hoveredPoint.pitchHz} Hz
                  </strong>{" "}
                  ({hoveredPoint.pitchDeltaPercent >= 0 ? "+" : ""}
                  {hoveredPoint.pitchDeltaPercent}%)
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Energy:{" "}
                  <strong className="text-[#F1F0E9] font-mono">
                    {Math.round(hoveredPoint.amplitude * 100)}%
                  </strong>
                </span>
              </div>
            </div>

            {hoveredPoint.excerptSnippet && (
              <p className="text-[10px] text-[#A4A69F] line-clamp-2 italic pt-0.5 border-t border-[#30332E]/40">
                "{hoveredPoint.excerptSnippet}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Detected Intensity Hotspots Strip */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#F1F0E9] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#F5AFCF]" />
            Emotional Intensity Points (Click to Jump & Review Turn)
          </span>
          <span className="text-[#A4A69F] text-[11px] font-mono tabular-nums">
            {hotspots.length} flagged moments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {hotspots.map((spot) => {
            const isCurrent = Math.abs(currentTime - spot.timeSeconds) < 2.5;

            return (
              <button
                key={spot.id}
                onClick={() => handleJumpToHotspot(spot)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer space-y-1.5 ${
                  isCurrent
                    ? "bg-[#202220] border-[#F5AFCF] shadow-[0_0_12px_rgba(245,175,207,0.15)]"
                    : "bg-[#111311] border-[#30332E] hover:border-[#F5AFCF]/50"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[#F5AFCF] font-semibold tabular-nums flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {formatTime(spot.timeSeconds)}
                  </span>
                  <span className="font-mono text-[10px] text-[#C8A6FF] tabular-nums">
                    {spot.pitchHz} Hz (+{spot.pitchShiftPercent}%)
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#F1F0E9] truncate">
                    {spot.title}
                  </h4>
                  <p className="text-[11px] text-[#A4A69F] line-clamp-1 mt-0.5">
                    {spot.speakerName}: {spot.transcriptExcerpt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend & Acoustic Coaching Note */}
      <div className="pt-2 border-t border-[#30332E] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A4A69F]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8A6FF]" />
            <span>Pitch Frequency (Hz)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5AFCF]" />
            <span>High Intensity Spike</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9FF32]" />
            <span>Active Playback</span>
          </div>
        </div>

        <p className="text-[11px] text-[#A4A69F]/80">
          Sudden F0 pitch elevation (&gt;+35%) is an acoustic indicator of vocal stress and defensiveness.
        </p>
      </div>
    </div>
  );
};
