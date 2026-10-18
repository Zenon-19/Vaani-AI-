import React from "react";
import { Drawer } from "../ui/Drawer";
import { ClaimAssessment, TranscriptSegment } from "../../types";
import { Button } from "../ui/Button";
import { formatTime } from "../../lib/utils";
import { Quote, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  claim: ClaimAssessment | null;
  segments: TranscriptSegment[];
  onJumpToTranscript?: (segmentId: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  claim,
  segments,
  onJumpToTranscript,
}) => {
  if (!claim) return null;

  // Find linked transcript segments
  const matchedSegments = segments.filter((s) =>
    claim.evidenceSegmentIds.includes(s.id)
  );

  const statusConfig = {
    supported: {
      label: "Supported by Evidence",
      badgeColor: "text-[#C9FF32] border-[#C9FF32]/30 bg-[#C9FF32]/10",
      icon: CheckCircle2,
    },
    partially_supported: {
      label: "Partially Supported",
      badgeColor: "text-[#C8A6FF] border-[#C8A6FF]/30 bg-[#C8A6FF]/10",
      icon: CheckCircle2,
    },
    unsupported: {
      label: "Unsupported / Unsubstantiated",
      badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      icon: AlertCircle,
    },
    contradicted: {
      label: "Contradicted by Facts",
      badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      icon: AlertCircle,
    },
    uncertain: {
      label: "Uncertain / Insufficient Context",
      badgeColor: "text-[#A4A69F] border-[#30332E] bg-[#171817]",
      icon: AlertCircle,
    },
  }[claim.assessment];

  const StatusIcon = statusConfig.icon;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Evidence Inspector"
      subtitle="Examine ground-truth excerpts and reasoning bounds"
    >
      <div className="space-y-6">
        {/* Claim Header Box */}
        <div className="p-4 rounded-2xl bg-[#171817] border border-[#30332E] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A4A69F]">Evaluated Statement</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusConfig.badgeColor}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </span>
          </div>

          <p className="text-base font-semibold text-[#F1F0E9] leading-snug">
            "{claim.claim}"
          </p>
        </div>

        {/* Why it Matters & Reasoning */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold tracking-wider uppercase text-[#A4A69F]">
            Analytical Reasoning
          </h4>
          <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] text-sm text-[#F1F0E9] leading-relaxed">
            {claim.explanation}
          </div>
        </div>

        {/* Linked Transcript Excerpts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#A4A69F]">
              Transcript Excerpt ({matchedSegments.length})
            </h4>
            <span className="text-[11px] text-[#A4A69F]">Ground truth</span>
          </div>

          {matchedSegments.length > 0 ? (
            matchedSegments.map((seg) => (
              <div
                key={seg.id}
                className="p-4 rounded-2xl bg-[#171817] border border-[#30332E] space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#C8A6FF]">
                    {seg.speakerName}
                  </span>
                  {seg.startTime !== undefined && (
                    <span className="text-xs font-mono text-[#A4A69F]">
                      at {formatTime(seg.startTime)}
                    </span>
                  )}
                </div>

                <div className="flex items-start gap-2.5 text-sm text-[#F1F0E9] italic leading-relaxed">
                  <Quote className="w-4 h-4 text-[#C9FF32] shrink-0 mt-0.5" />
                  <p>{seg.text}</p>
                </div>

                {onJumpToTranscript && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        onJumpToTranscript(seg.id);
                        onClose();
                      }}
                      className="text-xs text-[#C9FF32] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jump to transcript location</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] text-xs text-[#A4A69F] italic">
              {claim.quote ? (
                <p>"{claim.quote}"</p>
              ) : (
                "No direct excerpt linked to this point."
              )}
            </div>
          )}
        </div>

        {/* Objectivity Policy Reminder */}
        <div className="p-3.5 rounded-2xl bg-[#171817] border border-[#30332E] flex items-center gap-2.5 text-xs text-[#A4A69F]">
          <ShieldCheck className="w-4 h-4 text-[#C9FF32] shrink-0" />
          <span>
            Vaani AI verifies factual claims against available transcript evidence without attributing psychological intent.
          </span>
        </div>
      </div>
    </Drawer>
  );
};
