import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  EmotionalToneLabel,
  SentimentTimelinePoint,
  TranscriptSegment,
} from "../../types";
import { Card } from "../ui/Card";
import { formatTime } from "../../lib/utils";
import { Activity, ArrowUpRight, Info, Sparkles } from "lucide-react";

interface SentimentTimelineProps {
  timeline?: SentimentTimelinePoint[];
  transcript: TranscriptSegment[];
  isSampleData?: boolean;
  onInspectSegment?: (segmentId: string) => void;
}

const SPEAKER_COLORS = ["#C8A6FF", "#F5AFCF", "#C9FF32", "#F1F0E9"];

function deriveTimelineFromTranscript(
  transcript: TranscriptSegment[]
): SentimentTimelinePoint[] {
  if (!transcript || transcript.length === 0) return [];

  const positiveCueRegex =
    /\b(understand|samajh|agree|figure out|let's|collaborat|solution|resolve|thank|clarify|safe|stable|middle path|fixed|good|fair)\b/i;
  const tensionCueRegex =
    /\b(crash|hamesha|always|never|reckless|miss|penalty|waste|down|fail|nahi|error|blocker|urgent|hold|overlap|excuse|blind)\b/i;
  const defensiveCueRegex =
    /\b(explicitly|bola tha|out-of-scope|assumption|bas|honestly|sir|clarify karna chahta)\b/i;

  return transcript.map((seg, idx) => {
    const text = seg.text || "";
    const posMatches = (text.match(new RegExp(positiveCueRegex.source, "gi")) || []).length;
    const negMatches = (text.match(new RegExp(tensionCueRegex.source, "gi")) || []).length;
    const defMatches = (text.match(new RegExp(defensiveCueRegex.source, "gi")) || []).length;

    let rawScore = (posMatches * 0.28 - negMatches * 0.24 - defMatches * 0.14);
    // Keep within [-0.85, 0.85]
    rawScore = Math.max(-0.85, Math.min(0.85, Number(rawScore.toFixed(2))));

    let toneLabel: EmotionalToneLabel = "Analytical";
    if (rawScore >= 0.4) toneLabel = "Collaborative";
    else if (rawScore >= 0.15) toneLabel = "Constructive";
    else if (rawScore <= -0.5) toneLabel = "Defensive";
    else if (rawScore <= -0.25) toneLabel = "Tense";
    else if (negMatches > 0) toneLabel = "Urgent";

    return {
      id: `derived-sent-${seg.id}`,
      segmentId: seg.id,
      timestampSeconds: seg.startTime ?? idx * 20,
      speakerId: seg.speakerId,
      speakerName: seg.speakerName,
      score: rawScore,
      toneLabel,
      excerpt: text.length > 140 ? `${text.slice(0, 137)}...` : text,
    };
  });
}

function getToneIndicatorColor(score: number): string {
  if (score >= 0.15) return "#C9FF32";
  if (score <= -0.2) return "#F5AFCF";
  return "#C8A6FF";
}

export const SentimentTimeline: React.FC<SentimentTimelineProps> = ({
  timeline,
  transcript,
  isSampleData,
  onInspectSegment,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [containerWidth, setContainerWidth] = useState<number>(760);
  const [speakerFilter, setSpeakerFilter] = useState<string>("all");
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

  const points = useMemo(() => {
    const source =
      timeline && timeline.length > 0
        ? timeline
        : deriveTimelineFromTranscript(transcript);
    return [...source].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
  }, [timeline, transcript]);

  // Unique speakers list preserving order of appearance
  const speakers = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string }>();
    points.forEach((pt) => {
      if (!map.has(pt.speakerId)) {
        const color = SPEAKER_COLORS[map.size % SPEAKER_COLORS.length];
        map.set(pt.speakerId, { id: pt.speakerId, name: pt.speakerName, color });
      }
    });
    return Array.from(map.values());
  }, [points]);

  const speakerColorMap = useMemo(() => {
    const rec: Record<string, string> = {};
    speakers.forEach((s) => {
      rec[s.id] = s.color;
    });
    return rec;
  }, [speakers]);

  // Measure container width dynamically with ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setContainerWidth(Math.floor(rect.width));
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Default active point to peak tension or first point
  useEffect(() => {
    if (points.length > 0 && !activePointId) {
      const lowest = points.reduce(
        (min, p) => (p.score < min.score ? p : min),
        points[0]
      );
      setActivePointId(lowest.id);
    }
  }, [points, activePointId]);

  const visiblePoints = useMemo(() => {
    if (speakerFilter === "all") return points;
    return points.filter((p) => p.speakerId === speakerFilter);
  }, [points, speakerFilter]);

  // D3 chart geometry and scales
  const height = 240;
  const margin = useMemo(
    () => ({
      top: 20,
      right: 20,
      bottom: 32,
      left: containerWidth < 520 ? 48 : 88,
    }),
    [containerWidth]
  );

  const innerWidth = Math.max(200, containerWidth - margin.left - margin.right);
  const innerHeight = height - margin.top - margin.bottom;

  const { xScale, yScale, linePath, areaPath, zeroYRatio, xTicks } = useMemo(() => {
    const maxTime =
      d3.max(points, (d) => d.timestampSeconds) ?? 60;
    const domainMax = maxTime > 0 ? maxTime : 60;

    const x = d3.scaleLinear().domain([0, domainMax]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([-1, 1]).range([innerHeight, 0]);

    const lineGen = d3
      .line<SentimentTimelinePoint>()
      .x((d) => x(d.timestampSeconds))
      .y((d) => y(d.score))
      .curve(d3.curveMonotoneX);

    const areaGen = d3
      .area<SentimentTimelinePoint>()
      .x((d) => x(d.timestampSeconds))
      .y0(y(0))
      .y1((d) => y(d.score))
      .curve(d3.curveMonotoneX);

    const tickCount = containerWidth < 520 ? 4 : 6;
    const ticks = x.ticks(tickCount);

    // Zero baseline offset as percentage for linearGradient (top = 0%, bottom = 100%)
    const zeroRatio = (y(0) / innerHeight) * 100;

    return {
      xScale: x,
      yScale: y,
      linePath: lineGen(visiblePoints) || "",
      areaPath: areaGen(visiblePoints) || "",
      zeroYRatio: zeroRatio,
      xTicks: ticks,
    };
  }, [points, visiblePoints, innerWidth, innerHeight, containerWidth]);

  // Subtle stroke-reveal animation respecting prefers-reduced-motion
  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl || !linePath) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      d3.select(pathEl)
        .interrupt()
        .attr("stroke-dasharray", "none")
        .attr("stroke-dashoffset", 0);
      return;
    }

    const totalLength = pathEl.getTotalLength();
    if (!totalLength || isNaN(totalLength)) return;

    d3.select(pathEl)
      .interrupt()
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0)
      .on("end", () => {
        d3.select(pathEl).attr("stroke-dasharray", "none");
      });
  }, [linePath, speakerFilter]);

  // Determine focused/displayed point
  const inspectedPoint = useMemo(() => {
    const targetId = hoveredPointId || activePointId;
    return (
      visiblePoints.find((p) => p.id === targetId) ||
      points.find((p) => p.id === targetId) ||
      visiblePoints[0] ||
      points[0] ||
      null
    );
  }, [hoveredPointId, activePointId, visiblePoints, points]);

  // Compute key trajectory metrics
  const trajectoryMetrics = useMemo(() => {
    if (points.length === 0) return null;
    const peakTension = points.reduce(
      (min, p) => (p.score < min.score ? p : min),
      points[0]
    );
    const peakConstructive = points.reduce(
      (max, p) => (p.score > max.score ? p : max),
      points[0]
    );
    const firstHalfAvg =
      d3.mean(points.slice(0, Math.ceil(points.length / 2)), (d) => d.score) ?? 0;
    const secondHalfAvg =
      d3.mean(points.slice(Math.ceil(points.length / 2)), (d) => d.score) ?? firstHalfAvg;
    const delta = secondHalfAvg - firstHalfAvg;

    let arcDirection = "Steady / Analytical";
    if (delta >= 0.18) arcDirection = "De-escalated toward alignment";
    else if (delta <= -0.18) arcDirection = "Escalated in second half";
    else if (peakConstructive.score > 0.35 && peakTension.score < -0.4)
      arcDirection = "High friction followed by recovery";

    return {
      peakTension,
      peakConstructive,
      arcDirection,
    };
  }, [points]);

  // Handle pointer move over SVG plot area using d3.bisector for smooth scrubbing
  const handleSvgPointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (visiblePoints.length === 0) return;
    const [mouseX] = d3.pointer(e);
    const hoveredTime = xScale.invert(mouseX);

    const bisect = d3.bisector<SentimentTimelinePoint, number>(
      (d) => d.timestampSeconds
    ).center;
    const index = bisect(visiblePoints, hoveredTime);
    const closest = visiblePoints[index];
    if (closest) {
      setHoveredPointId(closest.id);
    }
  };

  if (points.length === 0) {
    return null;
  }

  const yGuides = [
    { value: 0.65, label: containerWidth < 520 ? "+Tone" : "Constructive" },
    { value: 0, label: containerWidth < 520 ? "Neutral" : "Analytical" },
    { value: -0.65, label: containerWidth < 520 ? "-Tone" : "Tense" },
  ];

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#30332E] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-[#C9FF32]">
            <Activity className="w-4 h-4" />
            <span>Conversational Tone Trajectory</span>
            {!timeline && (
              <>
                <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
                <span className="text-[#A4A69F] font-normal">Derived from transcript turns</span>
              </>
            )}
          </div>
          <h2 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
            Emotional & Tone Shift Timeline
          </h2>
          <p className="text-xs text-[#A4A69F]">
            Tracks shifts between tense/defensive turns and constructive/collaborative alignment over time. Click any turn node to inspect evidence.
          </p>
        </div>

        {/* Interactive Speaker Filter Controls */}
        <div
          className="flex flex-wrap items-center gap-1 p-1 bg-[#111311] rounded-xl border border-[#30332E] self-start lg:self-auto"
          role="group"
          aria-label="Filter sentiment timeline by speaker"
        >
          <button
            type="button"
            onClick={() => setSpeakerFilter("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              speakerFilter === "all"
                ? "bg-[#171817] text-[#C9FF32] font-semibold"
                : "text-[#A4A69F] hover:text-[#F1F0E9]"
            }`}
          >
            All Speakers
          </button>

          {speakers.map((spk) => {
            const active = speakerFilter === spk.id;
            return (
              <button
                key={spk.id}
                type="button"
                onClick={() => setSpeakerFilter(spk.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? "bg-[#171817] text-[#F1F0E9] font-semibold"
                    : "text-[#A4A69F] hover:text-[#F1F0E9]"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: spk.color }}
                  aria-hidden="true"
                />
                <span className="truncate max-w-[130px]">
                  {spk.name.split(" (")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* D3 Chart SVG Canvas */}
      <div ref={containerRef} className="w-full relative select-none">
        <svg
          width={containerWidth}
          height={height}
          viewBox={`0 0 ${containerWidth} ${height}`}
          className="overflow-visible block"
          role="img"
          aria-label="D3 sentiment timeline showing emotional tone shifts across the conversation"
        >
          <defs>
            {/* Gradient for Area Fill split cleanly at y=0 neutral baseline */}
            <linearGradient
              id="vaani-sentiment-area-grad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#C9FF32" stopOpacity="0.28" />
              <stop offset={`${zeroYRatio}%`} stopColor="#C9FF32" stopOpacity="0.03" />
              <stop offset={`${zeroYRatio}%`} stopColor="#F5AFCF" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#F5AFCF" stopOpacity="0.28" />
            </linearGradient>

            {/* Gradient for Trajectory Line */}
            <linearGradient
              id="vaani-sentiment-line-grad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#C9FF32" />
              <stop offset={`${zeroYRatio}%`} stopColor="#C8A6FF" />
              <stop offset="100%" stopColor="#F5AFCF" />
            </linearGradient>
          </defs>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Horizontal Tone Zone Guides */}
            {yGuides.map((guide) => {
              const yPos = yScale(guide.value);
              const isNeutral = guide.value === 0;
              return (
                <g key={guide.label}>
                  <line
                    x1={0}
                    x2={innerWidth}
                    y1={yPos}
                    y2={yPos}
                    stroke={isNeutral ? "#30332E" : "#30332E"}
                    strokeOpacity={isNeutral ? 0.95 : 0.45}
                    strokeDasharray={isNeutral ? "4 4" : "2 4"}
                    strokeWidth={1}
                  />
                  <text
                    x={-10}
                    y={yPos}
                    dy="0.32em"
                    textAnchor="end"
                    fill="#A4A69F"
                    className="text-[11px] font-medium"
                  >
                    {guide.label}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Timestamps */}
            {xTicks.map((tickVal, idx) => {
              const xPos = xScale(tickVal);
              return (
                <g key={`${tickVal}-${idx}`} transform={`translate(${xPos}, ${innerHeight})`}>
                  <line y1={0} y2={5} stroke="#30332E" strokeWidth={1} />
                  <text
                    y={19}
                    textAnchor="middle"
                    fill="#A4A69F"
                    className="text-[11px] font-mono tabular-nums"
                  >
                    {formatTime(tickVal)}
                  </text>
                </g>
              );
            })}

            {/* Vertical Crosshair on Inspected Point */}
            {inspectedPoint && (
              <line
                x1={xScale(inspectedPoint.timestampSeconds)}
                x2={xScale(inspectedPoint.timestampSeconds)}
                y1={0}
                y2={innerHeight}
                stroke="#C9FF32"
                strokeOpacity={0.45}
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            )}

            {/* D3 Area Under Curve */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#vaani-sentiment-area-grad)"
                className="pointer-events-none"
              />
            )}

            {/* D3 Smooth Monotone Curve */}
            {linePath && (
              <path
                ref={pathRef}
                d={linePath}
                fill="none"
                stroke="url(#vaani-sentiment-line-grad)"
                strokeWidth={2.5}
                strokeLinecap="round"
                className="pointer-events-none"
              />
            )}

            {/* Invisible Pointer Overlay for Smooth Bisector Scrubbing */}
            <rect
              x={0}
              y={0}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              className="cursor-crosshair"
              onPointerMove={handleSvgPointerMove}
              onPointerLeave={() => setHoveredPointId(null)}
              onClick={() => {
                if (inspectedPoint) {
                  setActivePointId(inspectedPoint.id);
                }
              }}
            />

            {/* Interactive Turn Nodes */}
            {visiblePoints.map((pt) => {
              const cx = xScale(pt.timestampSeconds);
              const cy = yScale(pt.score);
              const spkColor = speakerColorMap[pt.speakerId] || "#C8A6FF";
              const isInspected = inspectedPoint?.id === pt.id;

              return (
                <g
                  key={pt.id}
                  transform={`translate(${cx}, ${cy})`}
                  tabIndex={0}
                  role="button"
                  aria-label={`${pt.speakerName} at ${formatTime(pt.timestampSeconds)}: ${pt.toneLabel}, score ${pt.score.toFixed(2)}`}
                  className="cursor-pointer focus:outline-none"
                  onMouseEnter={() => setHoveredPointId(pt.id)}
                  onMouseLeave={() => setHoveredPointId(null)}
                  onFocus={() => setActivePointId(pt.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePointId(pt.id);
                    onInspectSegment?.(pt.segmentId);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActivePointId(pt.id);
                      onInspectSegment?.(pt.segmentId);
                    }
                  }}
                >
                  {/* Halo Ring when Inspected */}
                  {isInspected && (
                    <circle
                      r={11}
                      fill={spkColor}
                      fillOpacity={0.2}
                      stroke={spkColor}
                      strokeWidth={1.5}
                    />
                  )}
                  <circle
                    r={isInspected ? 6 : 4.5}
                    fill={spkColor}
                    stroke="#090A09"
                    strokeWidth={2}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected / Hovered Turn Inspector Panel */}
      {inspectedPoint && (
        <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className="font-semibold"
                style={{
                  color: speakerColorMap[inspectedPoint.speakerId] || "#F1F0E9",
                }}
              >
                {inspectedPoint.speakerName}
              </span>
              <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#A4A69F]">
                {formatTime(inspectedPoint.timestampSeconds)}
              </span>
              <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
              <span
                className="font-semibold"
                style={{ color: getToneIndicatorColor(inspectedPoint.score) }}
              >
                {inspectedPoint.toneLabel}
              </span>
              <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#A4A69F]">
                Tone index: {inspectedPoint.score > 0 ? `+${inspectedPoint.score.toFixed(2)}` : inspectedPoint.score.toFixed(2)}
              </span>
            </div>

            <p className="text-sm text-[#F1F0E9] leading-relaxed italic">
              "{inspectedPoint.excerpt}"
            </p>

            {inspectedPoint.triggerNote && (
              <p className="text-xs text-[#A4A69F] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C9FF32] shrink-0" />
                <span>{inspectedPoint.triggerNote}</span>
              </p>
            )}
          </div>

          {onInspectSegment && (
            <button
              type="button"
              onClick={() => onInspectSegment(inspectedPoint.segmentId)}
              className="px-3.5 py-2 rounded-xl bg-[#171817] hover:bg-[#202220] border border-[#30332E] hover:border-[#C9FF32]/50 text-xs font-medium text-[#C9FF32] inline-flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Inspect Excerpt</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Trajectory Summary Strip (Unboxed / Hairline Grid) */}
      {trajectoryMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#30332E]/70 text-xs">
          <div className="space-y-1">
            <span className="text-[#A4A69F]">Peak Tension Point</span>
            <p className="font-semibold text-[#F5AFCF] font-mono tabular-nums">
              {formatTime(trajectoryMetrics.peakTension.timestampSeconds)} ·{" "}
              {trajectoryMetrics.peakTension.speakerName.split(" (")[0]} (
              {trajectoryMetrics.peakTension.toneLabel})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[#A4A69F]">Most Constructive Turn</span>
            <p className="font-semibold text-[#C9FF32] font-mono tabular-nums">
              {formatTime(trajectoryMetrics.peakConstructive.timestampSeconds)} ·{" "}
              {trajectoryMetrics.peakConstructive.speakerName.split(" (")[0]} (
              {trajectoryMetrics.peakConstructive.toneLabel})
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[#A4A69F]">Conversation Arc</span>
            <p className="font-semibold text-[#F1F0E9]">
              {trajectoryMetrics.arcDirection}
            </p>
          </div>
        </div>
      )}

      {isSampleData && (
        <div className="flex items-center gap-2 text-[11px] text-[#A4A69F]">
          <Info className="w-3.5 h-3.5 text-[#A4A69F] shrink-0" />
          <span>
            Sample tone trajectory calibrated from transcript turns; values represent observed phrasing shifts, not clinical affect.
          </span>
        </div>
      )}
    </Card>
  );
};
