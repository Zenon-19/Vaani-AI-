import React from "react";
import { SuggestedReply } from "../../types";
import { Card } from "../ui/Card";
import { CopyButton } from "./CopyButton";
import { Sparkles, ArrowRight } from "lucide-react";

interface ResponseVariantCardProps {
  reply: SuggestedReply;
  onApply: (reply: SuggestedReply) => void;
  isSelected?: boolean;
}

export const ResponseVariantCard: React.FC<ResponseVariantCardProps> = ({
  reply,
  onApply,
  isSelected = false,
}) => {
  return (
    <Card
      activeBorder={isSelected ? "lime" : "none"}
      className="p-4 space-y-3 transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-[#C9FF32]">{reply.tone}</span>
          <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
          <span className="text-[#A4A69F]">{reply.language}</span>
          <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
          <span className="text-[#C8A6FF]">{reply.goal}</span>
        </div>

        <CopyButton textToCopy={reply.text} />
      </div>

      <p className="text-xs sm:text-sm text-[#F1F0E9] leading-relaxed line-clamp-3">
        "{reply.text}"
      </p>

      {reply.notes && (
        <p className="text-[11px] text-[#A4A69F] italic leading-tight">
          {reply.notes}
        </p>
      )}

      <div className="pt-1 flex justify-end">
        <button
          type="button"
          onClick={() => onApply(reply)}
          className="text-xs text-[#C9FF32] hover:text-[#d5ff57] inline-flex items-center gap-1 font-medium cursor-pointer"
        >
          <span>Use this draft</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </Card>
  );
};
