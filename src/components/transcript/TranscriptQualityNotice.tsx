import React from "react";
import { Info, Sparkles, CheckCircle2 } from "lucide-react";

interface TranscriptQualityNoticeProps {
  confidenceAvg?: number;
  hasCodeSwitching?: boolean;
  className?: string;
}

export const TranscriptQualityNotice: React.FC<TranscriptQualityNoticeProps> = ({
  confidenceAvg = 0.96,
  hasCodeSwitching = true,
  className = "",
}) => {
  return (
    <div
      className={`p-3.5 rounded-2xl bg-[#111311] border border-[#30332E] flex flex-wrap items-center justify-between gap-3 text-xs text-[#A4A69F] ${className}`}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#C9FF32] shrink-0" />
        <span className="text-[#F1F0E9] font-medium">Hinglish Model Calibrated</span>
        <span aria-hidden="true">·</span>
        <span>Hindi colloquialisms & English technical jargon resolved</span>
      </div>

      <div className="flex items-center gap-3 text-[11px] font-mono">
        <span className="flex items-center gap-1 text-[#C9FF32]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{Math.round(confidenceAvg * 100)}% acoustic confidence</span>
        </span>
        <span aria-hidden="true" className="text-[#30332E]">|</span>
        <span className="text-[#A4A69F]">Editable before analysis</span>
      </div>
    </div>
  );
};
