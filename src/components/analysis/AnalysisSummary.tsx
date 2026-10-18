import React from "react";
import { Card } from "../ui/Card";
import { HelpCircle, AlertCircle, Scale, ShieldAlert } from "lucide-react";

interface AnalysisSummaryProps {
  summary: string;
  mainDisagreement: string;
  keyUnresolvedQuestion: string;
  contextLimitations: string[];
}

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  summary,
  mainDisagreement,
  keyUnresolvedQuestion,
  contextLimitations,
}) => {
  return (
    <Card className="p-6 sm:p-8 space-y-6">
      {/* Primary Neutral Summary */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-[#C9FF32]">
          <Scale className="w-4 h-4" />
          <span>Executive Objective Summary</span>
        </div>
        <p className="text-base sm:text-lg text-[#F1F0E9] leading-relaxed font-normal">
          {summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#30332E]">
        {/* Main Disagreement */}
        <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5AFCF]">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Core Disagreement</span>
          </div>
          <p className="text-sm text-[#F1F0E9] leading-relaxed">
            {mainDisagreement}
          </p>
        </div>

        {/* Key Unresolved Question */}
        <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A6FF]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Key Unresolved Question</span>
          </div>
          <p className="text-sm text-[#F1F0E9] leading-relaxed">
            {keyUnresolvedQuestion}
          </p>
        </div>
      </div>

      {/* Context Limitations */}
      {contextLimitations.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#090A09]/60 border border-[#30332E]/80 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#A4A69F]">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-[#F1F0E9]">Known Context Limitations & Missing Data</span>
          </div>
          <ul className="space-y-1.5 pl-5 text-xs text-[#A4A69F] list-disc">
            {contextLimitations.map((limit, idx) => (
              <li key={idx} className="leading-relaxed">
                {limit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};
