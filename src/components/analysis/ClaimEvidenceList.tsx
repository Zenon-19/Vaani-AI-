import React from "react";
import { ClaimAssessment } from "../../types";
import { Card } from "../ui/Card";
import { CheckCircle2, AlertCircle, HelpCircle, ChevronRight, FileSearch } from "lucide-react";

interface ClaimEvidenceListProps {
  claims: ClaimAssessment[];
  onSelectClaim: (claim: ClaimAssessment) => void;
}

export const ClaimEvidenceList: React.FC<ClaimEvidenceListProps> = ({
  claims,
  onSelectClaim,
}) => {
  const getAssessmentBadge = (status: ClaimAssessment["assessment"]) => {
    switch (status) {
      case "supported":
        return {
          label: "Supported",
          className: "text-[#C9FF32] border-[#C9FF32]/30 bg-[#C9FF32]/10",
          icon: CheckCircle2,
        };
      case "partially_supported":
        return {
          label: "Partial",
          className: "text-[#C8A6FF] border-[#C8A6FF]/30 bg-[#C8A6FF]/10",
          icon: CheckCircle2,
        };
      case "unsupported":
        return {
          label: "Unsupported",
          className: "text-amber-400 border-amber-500/30 bg-amber-500/10",
          icon: AlertCircle,
        };
      case "contradicted":
        return {
          label: "Contradicted",
          className: "text-rose-400 border-rose-500/30 bg-rose-500/10",
          icon: AlertCircle,
        };
      case "uncertain":
      default:
        return {
          label: "Uncertain",
          className: "text-[#A4A69F] border-[#30332E] bg-[#171817]",
          icon: HelpCircle,
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
            Claim-by-Claim Verification
          </h3>
          <p className="text-xs text-[#A4A69F] mt-0.5">
            Click any claim to inspect the original transcript excerpt and reasoning.
          </p>
        </div>
        <span className="text-xs font-mono text-[#A4A69F]">
          {claims.length} claims verified
        </span>
      </div>

      <div className="space-y-2.5">
        {claims.map((claim) => {
          const badge = getAssessmentBadge(claim.assessment);
          const Icon = badge.icon;

          return (
            <Card
              key={claim.id}
              onClick={() => onSelectClaim(claim)}
              hoverEffect
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border shrink-0 ${badge.className}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#F1F0E9] truncate">
                    {claim.claim}
                  </p>
                  <p className="text-xs text-[#A4A69F] truncate mt-0.5">
                    {claim.explanation}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-xs text-[#C9FF32]">
                <span className="hidden sm:inline-block font-mono text-[11px]">
                  Inspect
                </span>
                <ChevronRight className="w-4 h-4 text-[#A4A69F]" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
