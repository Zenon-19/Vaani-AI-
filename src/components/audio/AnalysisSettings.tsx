import React, { useState } from "react";
import { AnalysisConfig, ReplyTone, ReplyLanguage } from "../../types";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

interface AnalysisSettingsProps {
  config: AnalysisConfig;
  onChange: (newConfig: AnalysisConfig) => void;
}

export const AnalysisSettings: React.FC<AnalysisSettingsProps> = ({
  config,
  onChange,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const updateField = <K extends keyof AnalysisConfig>(
    key: K,
    value: AnalysisConfig[K]
  ) => {
    onChange({ ...config, [key]: value });
  };

  const tones: ReplyTone[] = ["Calm", "Empathetic", "Firm", "Diplomatic", "Direct"];
  const languages = ["Auto-detect", "Hinglish", "Hindi", "English"];
  const replyLanguages: ReplyLanguage[] = ["Hinglish", "Hindi", "English"];

  return (
    <div className="p-6 rounded-3xl bg-[#171817] border border-[#30332E] space-y-4">
      {/* Primary basic settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#A4A69F]">
            Conversation Language
          </label>
          <select
            value={config.language}
            onChange={(e) => updateField("language", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
          >
            {languages.map((l) => (
              <option key={l} value={l} className="bg-[#111311] text-[#F1F0E9]">
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Expected Speakers */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#A4A69F]">
            Speakers in Conversation
          </label>
          <select
            value={config.speakerCount}
            onChange={(e) => updateField("speakerCount", Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
          >
            <option value={2}>2 Speakers (Standard 1-on-1)</option>
            <option value={3}>3 Speakers</option>
            <option value={4}>4+ Speakers (Panel / Team)</option>
            <option value={0}>Auto-detect diarization</option>
          </select>
        </div>

        {/* Analysis Depth */}
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <label className="text-xs font-semibold text-[#A4A69F]">
            Analysis Depth
          </label>
          <div className="flex p-1 bg-[#111311] rounded-xl border border-[#30332E]">
            <button
              type="button"
              onClick={() => updateField("analysisDepth", "Quick")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center ${
                config.analysisDepth === "Quick"
                  ? "bg-[#171817] text-[#C9FF32] font-semibold"
                  : "text-[#A4A69F] hover:text-[#F1F0E9]"
              }`}
            >
              Quick
            </button>
            <button
              type="button"
              onClick={() => updateField("analysisDepth", "Detailed")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center ${
                config.analysisDepth === "Detailed"
                  ? "bg-[#171817] text-[#C9FF32] font-semibold"
                  : "text-[#A4A69F] hover:text-[#F1F0E9]"
              }`}
            >
              Detailed (Deep)
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Collapsible Section */}
      <div className="pt-2 border-t border-[#30332E]/60">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center justify-between w-full py-2 text-xs font-semibold text-[#A4A69F] hover:text-[#F1F0E9] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9FF32]" />
            <span>Response Calibration & Background Context</span>
          </div>
          {isAdvancedOpen ? (
            <ChevronUp className="w-4 h-4 text-[#A4A69F]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#A4A69F]" />
          )}
        </button>

        {isAdvancedOpen && (
          <div className="pt-4 space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default Tone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A4A69F]">
                  Preferred Coaching Tone
                </label>
                <select
                  value={config.replyTone}
                  onChange={(e) => updateField("replyTone", e.target.value as ReplyTone)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
                >
                  {tones.map((t) => (
                    <option key={t} value={t} className="bg-[#111311] text-[#F1F0E9]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reply Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A4A69F]">
                  Suggested Response Language
                </label>
                <select
                  value={config.replyLanguage}
                  onChange={(e) =>
                    updateField("replyLanguage", e.target.value as ReplyLanguage)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
                >
                  {replyLanguages.map((l) => (
                    <option key={l} value={l} className="bg-[#111311] text-[#F1F0E9]">
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Context */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A4A69F]">
                Optional Background Context (Optional)
              </label>
              <input
                type="text"
                value={config.optionalContext}
                onChange={(e) => updateField("optionalContext", e.target.value)}
                placeholder="e.g. Performance appraisal between team lead and developer; discussing staging downtime."
                className="w-full px-4 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] placeholder-[#A4A69F]/40 focus:outline-none focus:border-[#C9FF32]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
