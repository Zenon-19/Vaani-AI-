import React from "react";
import { Sparkles, Trash2, FileText, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { SAMPLE_TRANSCRIPT_PRESETS } from "../../lib/demoData";

interface TranscriptPasteEditorProps {
  value: string;
  onChange: (val: string) => void;
  error?: string | null;
}

export const TranscriptPasteEditor: React.FC<TranscriptPasteEditorProps> = ({
  value,
  onChange,
  error,
}) => {
  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const handleLoadPreset = (content: string) => {
    onChange(content);
  };

  return (
    <div className="space-y-4">
      {/* Sample Presets Quick Loader */}
      <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E]">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#C8A6FF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Hinglish Conversations:</span>
          </div>
          <span className="text-[11px] text-[#A4A69F]">Quick 1-Click Fill</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_TRANSCRIPT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset.content)}
              className="px-3 py-1.5 rounded-xl bg-[#171817] hover:bg-[#202220] border border-[#30332E] hover:border-[#C8A6FF]/40 text-xs text-[#F1F0E9] transition-all cursor-pointer text-left truncate max-w-full"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Formatting hint */}
      <div className="flex items-center justify-between text-xs text-[#A4A69F] px-1">
        <span>Format format: "Speaker Name: Said text..."</span>
        <span>Hindi, English, or Hinglish supported</span>
      </div>

      {/* Textarea container */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Priya: Rohan, hum Thursday release ke bare mein baat kar sakte hain?\nRohan: Haan Priya, staging cluster ka memory spike investigate kar rahe hain...`}
          rows={11}
          className={`w-full p-4 rounded-3xl bg-[#171817] border text-sm text-[#F1F0E9] placeholder-[#A4A69F]/40 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-[#C9FF32] transition-colors resize-y ${
            error ? "border-rose-500/50" : "border-[#30332E]"
          }`}
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#111311]/80 hover:bg-[#202220] text-[#A4A69F] hover:text-rose-400 border border-[#30332E] transition-colors text-xs flex items-center gap-1 cursor-pointer"
            title="Clear text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Bottom counts */}
      <div className="flex items-center justify-between text-xs text-[#A4A69F] font-mono tabular-nums px-2">
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span aria-hidden="true">·</span>
          <span>{characterCount} characters</span>
        </div>
        {wordCount > 10 && (
          <span className="text-[#C9FF32] flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Ready to parse
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-400 px-2">{error}</p>
      )}
    </div>
  );
};
