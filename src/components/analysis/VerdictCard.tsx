import React from "react";
import { IssueVerdict } from "../../types";
import { Card } from "../ui/Card";
import { Scale, Users, HelpCircle, ShieldAlert } from "lucide-react";

interface VerdictCardProps {
  verdicts: IssueVerdict[];
}

export const VerdictCard: React.FC<VerdictCardProps> = ({ verdicts }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
            Objective Issue Synthesis
          </h3>
          <p className="text-xs text-[#A4A69F] mt-0.5">
            Balanced determination of merit grounded in documented statements.
          </p>
        </div>
        <span className="text-xs font-mono text-[#A4A69F]">
          {verdicts.length} Key {verdicts.length === 1 ? "Issue" : "Issues"} Analyzed
        </span>
      </div>

      <div className="space-y-4">
        {verdicts.map((item, idx) => (
          <Card key={idx} className="p-6 space-y-5">
            {/* Issue Title & Stronger Ground */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#30332E] pb-4">
              <div>
                <span className="text-[11px] font-mono text-[#A4A69F] uppercase">
                  Issue 0{idx + 1}
                </span>
                <h4 className="text-base font-semibold text-[#F1F0E9] mt-0.5">
                  {item.issue}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A4A69F]">Stronger argument on this issue:</span>
                <span className="px-3 py-1 rounded-xl bg-[#111311] border border-[#30332E] text-xs font-semibold text-[#C9FF32]">
                  {item.strongerArgumentSide}
                </span>
              </div>
            </div>

            {/* Evidence Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E]/60 space-y-1.5">
                <span className="text-xs font-medium text-[#C8A6FF]">
                  Key Corroboration Side A
                </span>
                <p className="text-xs text-[#F1F0E9] leading-relaxed">
                  {item.evidenceA}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E]/60 space-y-1.5">
                <span className="text-xs font-medium text-[#F5AFCF]">
                  Counter-Evidence Side B
                </span>
                <p className="text-xs text-[#F1F0E9] leading-relaxed">
                  {item.evidenceB}
                </p>
              </div>
            </div>

            {/* Shared Responsibility & Unresolved Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-[#090A09]/70 border border-[#30332E]/60 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#F1F0E9]">
                  <Users className="w-3.5 h-3.5 text-[#C9FF32]" />
                  <span>Shared Responsibility</span>
                </div>
                <p className="text-[#A4A69F] leading-relaxed">
                  {item.sharedResponsibility}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#090A09]/70 border border-[#30332E]/60 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[#F1F0E9]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#C8A6FF]" />
                  <span>Unresolved Points</span>
                </div>
                <p className="text-[#A4A69F] leading-relaxed">
                  {item.unresolvedPoints}
                </p>
              </div>
            </div>

            {/* Uncertainty Disclaimer if applicable */}
            {item.uncertaintyNotes && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/30 flex items-start gap-2 text-xs text-amber-300/80">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>Uncertainty note:</strong> {item.uncertaintyNotes}</span>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
