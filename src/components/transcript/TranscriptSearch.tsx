import React from "react";
import { Search, X } from "lucide-react";

interface TranscriptSearchProps {
  value: string;
  onChange: (val: string) => void;
  matchesCount?: number;
  className?: string;
}

export const TranscriptSearch: React.FC<TranscriptSearchProps> = ({
  value,
  onChange,
  matchesCount,
  className = "",
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-[#A4A69F] absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search spoken words, timestamps, or terms..."
        className="w-full pl-10 pr-20 py-2 rounded-xl bg-[#171817] border border-[#30332E] text-xs text-[#F1F0E9] placeholder-[#A4A69F]/50 focus:outline-none focus:border-[#C9FF32] transition-colors"
      />
      {value && (
        <div className="absolute right-3 flex items-center gap-2">
          {matchesCount !== undefined && (
            <span className="text-[10px] font-mono text-[#C9FF32]">
              {matchesCount} {matchesCount === 1 ? "match" : "matches"}
            </span>
          )}
          <button
            onClick={() => onChange("")}
            className="p-1 rounded text-[#A4A69F] hover:text-[#F1F0E9] cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
