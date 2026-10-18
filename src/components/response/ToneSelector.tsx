import React from "react";
import { ReplyTone, ReplyLanguage, ReplyGoal, ResponseLength } from "../../types";

interface ToneSelectorProps {
  selectedTone: ReplyTone;
  onSelectTone: (tone: ReplyTone) => void;
  selectedLanguage: ReplyLanguage;
  onSelectLanguage: (lang: ReplyLanguage) => void;
  selectedGoal: ReplyGoal;
  onSelectGoal: (goal: ReplyGoal) => void;
  selectedLength: ResponseLength;
  onSelectLength: (len: ResponseLength) => void;
}

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onSelectTone,
  selectedLanguage,
  onSelectLanguage,
  selectedGoal,
  onSelectGoal,
  selectedLength,
  onSelectLength,
}) => {
  const tones: ReplyTone[] = ["Calm", "Empathetic", "Firm", "Diplomatic", "Direct"];
  const languages: ReplyLanguage[] = ["Hinglish", "Hindi", "English"];
  const goals: ReplyGoal[] = [
    "Clarify",
    "Apologize",
    "Set boundaries",
    "Resolve conflict",
    "Disagree respectfully",
  ];
  const lengths: ResponseLength[] = ["Short", "Balanced", "Detailed"];

  return (
    <div className="space-y-5">
      {/* Tone Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#A4A69F] tracking-wide block">
          Conversational Tone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 bg-[#111311] rounded-2xl border border-[#30332E]">
          {tones.map((tone) => {
            const active = selectedTone === tone;
            return (
              <button
                key={tone}
                type="button"
                onClick={() => onSelectTone(tone)}
                className={`px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer text-center ${
                  active
                    ? "bg-[#C9FF32] text-[#090A09] font-semibold shadow-sm"
                    : "text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#171817]"
                }`}
              >
                {tone}
              </button>
            );
          })}
        </div>
      </div>

      {/* Goal Objective */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-[#A4A69F] tracking-wide block">
          Strategic Goal
        </label>
        <div className="flex flex-wrap gap-1.5">
          {goals.map((goal) => {
            const active = selectedGoal === goal;
            return (
              <button
                key={goal}
                type="button"
                onClick={() => onSelectGoal(goal)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                  active
                    ? "bg-[#C8A6FF]/20 border-[#C8A6FF] text-[#C8A6FF]"
                    : "bg-[#171817] border-[#30332E] text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#202220]"
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language & Length Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Language */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#A4A69F] tracking-wide block">
            Dialect / Language
          </label>
          <div className="flex p-1 bg-[#111311] rounded-xl border border-[#30332E]">
            {languages.map((lang) => {
              const active = selectedLanguage === lang;
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onSelectLanguage(lang)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center ${
                    active
                      ? "bg-[#171817] text-[#C9FF32] font-semibold"
                      : "text-[#A4A69F] hover:text-[#F1F0E9]"
                  }`}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Length */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#A4A69F] tracking-wide block">
            Response Depth
          </label>
          <div className="flex p-1 bg-[#111311] rounded-xl border border-[#30332E]">
            {lengths.map((len) => {
              const active = selectedLength === len;
              return (
                <button
                  key={len}
                  type="button"
                  onClick={() => onSelectLength(len)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer text-center ${
                    active
                      ? "bg-[#171817] text-[#C9FF32] font-semibold"
                      : "text-[#A4A69F] hover:text-[#F1F0E9]"
                  }`}
                >
                  {len}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
