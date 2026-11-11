import React, { useState } from "react";
import { AnalysisReport, HinglishExecutiveSummary } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";
import { CopyButton } from "../response/CopyButton";
import { formatHinglishSummaryForCopy } from "../../lib/hinglishSummary";
import {
  Languages,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Info,
} from "lucide-react";

interface HinglishExecutiveSummaryCardProps {
  report: AnalysisReport;
  hinglishSummary?: HinglishExecutiveSummary;
  isGenerating: boolean;
  onGenerate: (focus: "balanced" | "misunderstandings") => void;
  onInspectSegment?: (segmentId: string) => void;
}

export const HinglishExecutiveSummaryCard: React.FC<
  HinglishExecutiveSummaryCardProps
> = ({
  report,
  hinglishSummary,
  isGenerating,
  onGenerate,
  onInspectSegment,
}) => {
  const [focus, setFocus] = useState<"balanced" | "misunderstandings">(
    hinglishSummary?.focus || "balanced"
  );
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFocusSwitch = (newFocus: "balanced" | "misunderstandings") => {
    setFocus(newFocus);
    if (hinglishSummary && hinglishSummary.focus !== newFocus) {
      onGenerate(newFocus);
    }
  };

  // State 1: Not yet generated
  if (!hinglishSummary && !isGenerating) {
    return (
      <Card className="p-6 sm:p-7 border-[#30332E] bg-[#171817]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-[#C8A6FF]">
              <Languages className="w-4 h-4" />
              <span>Hinglish Executive Brief</span>
            </div>
            <h2 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
              Generate a concise Hinglish summary for quick clarity
            </h2>
            <p className="text-xs sm:text-sm text-[#A4A69F] leading-relaxed">
              Get a tight Hinglish breakdown highlighting each speaker’s key points, subtle idiom gaps, and potential misunderstandings—ready to review or share with participants.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div
              className="flex p-1 bg-[#111311] rounded-xl border border-[#30332E]"
              role="group"
              aria-label="Hinglish summary focus"
            >
              <button
                type="button"
                onClick={() => setFocus("balanced")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  focus === "balanced"
                    ? "bg-[#171817] text-[#C9FF32] font-semibold"
                    : "text-[#A4A69F] hover:text-[#F1F0E9]"
                }`}
              >
                Balanced
              </button>
              <button
                type="button"
                onClick={() => setFocus("misunderstandings")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  focus === "misunderstandings"
                    ? "bg-[#171817] text-[#C8A6FF] font-semibold"
                    : "text-[#A4A69F] hover:text-[#F1F0E9]"
                }`}
              >
                Misunderstandings
              </button>
            </div>

            <Button
              variant="lavender"
              size="md"
              onClick={() => onGenerate(focus)}
              leftIcon={<Languages className="w-4 h-4" />}
              className="whitespace-nowrap shrink-0"
            >
              Generate Hinglish Summary
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // State 2: Loading / Generating
  if (isGenerating) {
    return (
      <Card
        className="p-6 sm:p-8 space-y-5 border-[#C8A6FF]/40"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-[#C8A6FF]">
            <Languages className="w-4 h-4 animate-pulse" />
            <span>Synthesizing Hinglish executive brief...</span>
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      </Card>
    );
  }

  if (!hinglishSummary) return null;

  const copyText = formatHinglishSummaryForCopy(hinglishSummary, report.title);

  // State 3: Populated Hinglish Executive Summary
  return (
    <Card className="p-6 sm:p-8 space-y-6 border-[#C8A6FF]/40">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#30332E] pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#C8A6FF]">
              <Languages className="w-4 h-4" />
              <span>Hinglish Executive Summary</span>
            </span>
            <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
            <span className="text-[#A4A69F]">
              {hinglishSummary.focus === "misunderstandings"
                ? "Misunderstandings Focus"
                : "Balanced Overview"}
            </span>
            {hinglishSummary.isSampleSynthesis && (
              <>
                <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
                <span className="text-[#A4A69F] font-mono text-[11px]">
                  Demo Synthesis
                </span>
              </>
            )}
          </div>
          <h2 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
            Baat Ka Saar: Key Points & Potential Misunderstandings
          </h2>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div
            className="flex p-1 bg-[#111311] rounded-xl border border-[#30332E]"
            role="group"
            aria-label="Hinglish summary focus"
          >
            <button
              type="button"
              onClick={() => handleFocusSwitch("balanced")}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                hinglishSummary.focus === "balanced"
                  ? "bg-[#171817] text-[#C9FF32] font-semibold"
                  : "text-[#A4A69F] hover:text-[#F1F0E9]"
              }`}
            >
              Balanced
            </button>
            <button
              type="button"
              onClick={() => handleFocusSwitch("misunderstandings")}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                hinglishSummary.focus === "misunderstandings"
                  ? "bg-[#171817] text-[#C8A6FF] font-semibold"
                  : "text-[#A4A69F] hover:text-[#F1F0E9]"
              }`}
            >
              Misunderstandings
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGenerate(hinglishSummary.focus)}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="whitespace-nowrap shrink-0"
          >
            Regenerate
          </Button>

          <CopyButton textToCopy={copyText} label="Copy Brief" />

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] transition-colors cursor-pointer"
            aria-label={isExpanded ? "Collapse Hinglish summary" : "Expand Hinglish summary"}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Concise Hinglish Overview */}
          <p className="text-sm sm:text-base text-[#F1F0E9] leading-relaxed">
            {hinglishSummary.overview}
          </p>

          {/* 2-Column Split: Key Points + Potential Misunderstandings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Key Points */}
            <div className="p-5 rounded-2xl bg-[#111311] border border-[#30332E] space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-[#C9FF32] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mukhya Points (Key Takeaways)</span>
                </h3>
                <span className="text-[11px] font-mono tabular-nums text-[#A4A69F]">
                  {hinglishSummary.keyPoints.length} points
                </span>
              </div>

              <ul className="space-y-3">
                {hinglishSummary.keyPoints.map((kp, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-[#171817] border border-[#30332E]/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#C8A6FF]">
                        {kp.speakerName}
                      </span>
                      {kp.segmentId && onInspectSegment && (
                        <button
                          type="button"
                          onClick={() => onInspectSegment(kp.segmentId!)}
                          className="text-[11px] font-mono text-[#C9FF32] hover:underline inline-flex items-center gap-0.5 cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>#{kp.segmentId}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-[#F1F0E9] leading-relaxed">
                      {kp.point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Misunderstandings */}
            <div className="p-5 rounded-2xl bg-[#111311] border border-[#30332E] space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold tracking-wider uppercase text-[#F5AFCF] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Potential Misunderstandings</span>
                </h3>
                <span className="text-[11px] font-mono tabular-nums text-[#A4A69F]">
                  {hinglishSummary.potentialMisunderstandings.length} flagged
                </span>
              </div>

              <div className="space-y-3">
                {hinglishSummary.potentialMisunderstandings.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#171817] border border-[#30332E]/70 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-[#F1F0E9]">
                        {item.title}
                      </h4>
                      {item.segmentId && onInspectSegment && (
                        <button
                          type="button"
                          onClick={() => onInspectSegment(item.segmentId!)}
                          className="text-[11px] font-mono text-[#C9FF32] hover:underline inline-flex items-center gap-0.5 cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <span>#{item.segmentId}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#A4A69F] leading-relaxed">
                      {item.explanation}
                    </p>

                    <div className="pt-1.5 border-t border-[#30332E]/50 flex items-start gap-1.5 text-xs text-[#C9FF32]">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-medium">Clarify tip:</strong>{" "}
                        {item.clarificationTip}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Line / Next Step */}
          <div className="p-4 rounded-2xl bg-[#090A09]/70 border border-[#30332E] space-y-1">
            <span className="text-[11px] font-semibold text-[#C9FF32] uppercase tracking-wide">
              Agla Kadam (Bottom Line)
            </span>
            <p className="text-xs sm:text-sm text-[#F1F0E9] leading-relaxed">
              {hinglishSummary.bottomLine}
            </p>
          </div>

          {hinglishSummary.isSampleSynthesis && (
            <div className="flex items-center gap-2 text-[11px] text-[#A4A69F]">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                Synthesized locally from demo transcript & report data; connect a live AI backend for real-time model generation on new audio.
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
