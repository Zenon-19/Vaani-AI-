import React from "react";
import { SpeakerAssessment } from "../../types";
import { Card } from "../ui/Card";
import { Check, AlertCircle, Sparkles, MessageCircle, FileText } from "lucide-react";

interface SpeakerAssessmentCardProps {
  speaker: SpeakerAssessment;
  onOpenEvidenceForSegment?: (segmentId: string) => void;
}

export const SpeakerAssessmentCard: React.FC<SpeakerAssessmentCardProps> = ({
  speaker,
  onOpenEvidenceForSegment,
}) => {
  return (
    <Card className="p-6 space-y-5">
      {/* Speaker Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#30332E] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
              {speaker.speakerName}
            </h3>
            {speaker.role && (
              <span className="text-xs text-[#A4A69F] font-normal">
                ({speaker.role})
              </span>
            )}
          </div>
          <p className="text-xs text-[#A4A69F] mt-0.5">
            {speaker.speakingTimePercent}% of conversational dialogue
          </p>
        </div>
      </div>

      {/* Main Arguments */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold tracking-wider uppercase text-[#A4A69F] flex items-center gap-1.5">
          <MessageCircle className="w-3.5 h-3.5 text-[#C9FF32]" />
          <span>Core Arguments Presented</span>
        </h4>
        <ul className="space-y-1.5 text-xs text-[#F1F0E9]">
          {speaker.mainArguments.map((arg, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#C9FF32] font-mono mt-0.5">•</span>
              <span>{arg}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Valid Points */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold tracking-wider uppercase text-[#C9FF32] flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>Substantiated & Valid Points</span>
        </h4>
        <div className="space-y-1.5">
          {speaker.validPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#111311] border border-[#30332E]/60 text-xs text-[#F1F0E9] leading-relaxed flex items-start gap-2"
            >
              <Check className="w-3.5 h-3.5 text-[#C9FF32] shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unsupported Claims / Reasoning Errors */}
      {speaker.unsupportedClaims.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Unsubstantiated Claims or Generalizations</span>
          </h4>
          <div className="space-y-1.5">
            {speaker.unsupportedClaims.map((claim, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#111311] border border-amber-900/30 text-xs text-amber-200/90 leading-relaxed"
              >
                {claim}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communication Strengths & Evidenced Concerns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-xl bg-[#111311] border border-[#30332E]/60 space-y-1.5">
          <span className="text-[11px] font-semibold text-[#C8A6FF] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Communication Strengths
          </span>
          <ul className="text-xs text-[#A4A69F] space-y-1 pl-3 list-disc">
            {speaker.communicationStrengths.map((str, idx) => (
              <li key={idx} className="leading-snug">
                {str}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3.5 rounded-xl bg-[#111311] border border-[#30332E]/60 space-y-1.5">
          <span className="text-[11px] font-semibold text-[#F5AFCF] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Observed Behavioral Friction
          </span>
          <ul className="text-xs text-[#A4A69F] space-y-1 pl-3 list-disc">
            {speaker.evidencedConcerns.map((con, idx) => (
              <li key={idx} className="leading-snug">
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transcript References */}
      {speaker.transcriptReferenceIds && speaker.transcriptReferenceIds.length > 0 && (
        <div className="pt-2 flex items-center gap-2 text-xs text-[#A4A69F]">
          <span className="shrink-0 flex items-center gap-1">
            <FileText className="w-3 h-3 text-[#C9FF32]" /> Excerpts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {speaker.transcriptReferenceIds.map((refId) => (
              <button
                key={refId}
                onClick={() => onOpenEvidenceForSegment?.(refId)}
                className="px-2 py-0.5 rounded bg-[#111311] hover:bg-[#202220] border border-[#30332E] hover:border-[#C9FF32]/50 text-[11px] font-mono text-[#C9FF32] cursor-pointer transition-colors"
                title={`Inspect segment ${refId}`}
              >
                #{refId}
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
