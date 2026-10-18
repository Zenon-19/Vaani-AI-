import React from "react";
import { AnalysisStatus } from "../../types";

interface StatusBadgeProps {
  status: AnalysisStatus;
  className?: string;
  isSample?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
  isSample = false,
}) => {
  const configMap: Record<
    AnalysisStatus,
    { label: string; dotClass: string; textClass: string }
  > = {
    draft: {
      label: "Draft",
      dotClass: "bg-[#A4A69F]",
      textClass: "text-[#A4A69F]",
    },
    uploading: {
      label: "Uploading",
      dotClass: "bg-[#C8A6FF]",
      textClass: "text-[#C8A6FF]",
    },
    transcribing: {
      label: "Transcribing",
      dotClass: "bg-[#C8A6FF] animate-pulse",
      textClass: "text-[#C8A6FF]",
    },
    review_required: {
      label: "Review Needed",
      dotClass: "bg-[#F5AFCF]",
      textClass: "text-[#F5AFCF]",
    },
    analyzing: {
      label: "Analyzing",
      dotClass: "bg-[#C9FF32] animate-pulse",
      textClass: "text-[#C9FF32]",
    },
    completed: {
      label: "Analysis Ready",
      dotClass: "bg-[#C9FF32]",
      textClass: "text-[#C9FF32]",
    },
    failed: {
      label: "Needs Retry",
      dotClass: "bg-rose-400",
      textClass: "text-rose-400",
    },
  };

  const current = configMap[status] || configMap.draft;

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass} shrink-0`} />
      <span className={current.textClass}>{current.label}</span>
      {isSample && (
        <>
          <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
          <span className="text-[#A4A69F] text-[11px] font-mono tracking-tight">Demo Data</span>
        </>
      )}
    </div>
  );
};
