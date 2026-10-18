import React, { useState } from "react";
import {
  ReplyTone,
  ReplyLanguage,
  ReplyGoal,
  ResponseLength,
  SuggestedReply,
  AnalysisReport,
} from "../../types";
import { ToneSelector } from "./ToneSelector";
import { ResponseVariantCard } from "./ResponseVariantCard";
import { CopyButton } from "./CopyButton";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useToast } from "../ui/Toast";
import {
  RotateCcw,
  Sparkles,
  Save,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Scale,
} from "lucide-react";

interface ResponseComposerProps {
  report: AnalysisReport;
  onSaveResponse?: (response: SuggestedReply) => void;
}

export const ResponseComposer: React.FC<ResponseComposerProps> = ({
  report,
  onSaveResponse,
}) => {
  const defaultReply = report.suggestedReplies[0] || {
    id: "rep-custom",
    tone: "Calm",
    language: "Hinglish",
    goal: "Resolve conflict",
    text: "Main samajhta hoon ki deadlines tight hain, let's align on what we can safely release.",
  };

  const [selectedTone, setSelectedTone] = useState<ReplyTone>(defaultReply.tone);
  const [selectedLanguage, setSelectedLanguage] = useState<ReplyLanguage>(
    defaultReply.language
  );
  const [selectedGoal, setSelectedGoal] = useState<ReplyGoal>(
    defaultReply.goal || "Resolve conflict"
  );
  const [selectedLength, setSelectedLength] = useState<ResponseLength>("Balanced");

  const [activeDraft, setActiveDraft] = useState<string>(defaultReply.text);
  const [lastGeneratedText, setLastGeneratedText] = useState<string>(defaultReply.text);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  const handleApplyVariant = (variant: SuggestedReply) => {
    setSelectedTone(variant.tone);
    setSelectedLanguage(variant.language);
    setSelectedGoal(variant.goal);
    setActiveDraft(variant.text);
    setLastGeneratedText(variant.text);
    toast("Draft applied", `Loaded ${variant.tone} ${variant.language} version.`, "info");
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      let generated = "";
      if (selectedTone === "Calm") {
        generated =
          selectedLanguage === "English"
            ? "I hear your concerns regarding the milestone timeline. Let's step back and look at the actual blocker data so we can formulate a reliable, risk-free release plan."
            : "Main samajhta hoon ki release timeline bohot critical hai. Let's take 10 minutes to review the staging logs together taaki hum bina production risk ke aage badh sakein.";
      } else if (selectedTone === "Empathetic") {
        generated =
          selectedLanguage === "English"
            ? "I completely recognize the immense pressure you are under from stakeholders. I want to partner with you to find a solution that protects both the client promise and our team's stability."
            : "Mujhe bilkul samajh aa raha hai ki client expectations kitni high hain aap par. Main aapke saath milkar hi solution nikalna chahta hoon taaki deploy safely verify ho jaye.";
      } else if (selectedTone === "Firm") {
        generated =
          selectedLanguage === "English"
            ? "We cannot compromise on staging stability or bypass memory limits. Moving forward, all appendix specifications must have pointed sprint tickets before entering the release branch."
            : "Staging stability compromise nahi ho sakti. Next time se PRD appendix ke items ko formally sprint planning mein estimate karenge before merging.";
      } else if (selectedTone === "Diplomatic") {
        generated =
          selectedLanguage === "English"
            ? "Both objectives are essential: meeting client commitments and guaranteeing cluster resilience. I propose we ship the core workflow today and deliver the streaming filter in Tuesday's patch."
            : "Dono priorities important hain. Core feature ko aaj ship kar dete hain aur filter ko Tuesday hotfix mein schedule kar lete hain.";
      } else {
        generated =
          selectedLanguage === "English"
            ? "The staging crash was caused by Redis OOM on PR #412. If Product approves the memory bump, we will unblock QA within 45 minutes."
            : "Redis OOM crash PR #412 ki wajah se hua tha. Agar Product memory upgrade approve karta hai toh hum 45 minutes mein QA restore kar denge.";
      }

      if (selectedLength === "Short") {
        generated = generated.split(". ")[0] + ".";
      }

      setActiveDraft(generated);
      setLastGeneratedText(generated);
      setIsRegenerating(false);
      toast("Response recalibrated", `Generated ${selectedTone} draft.`, "success");
    }, 600);
  };

  const handleReset = () => {
    setActiveDraft(lastGeneratedText);
    toast("Reset", "Draft restored to generated version.", "info");
  };

  const handleSave = () => {
    const responseObj: SuggestedReply = {
      id: `saved-${Date.now()}`,
      tone: selectedTone,
      language: selectedLanguage,
      goal: selectedGoal,
      text: activeDraft,
    };
    onSaveResponse?.(responseObj);
    toast("Saved to Responses", "You can revisit this reply anytime.", "success");
  };

  const charCount = activeDraft.length;
  const wordCount = activeDraft.trim() ? activeDraft.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Context & Evidence anchors (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C9FF32]">
              <Scale className="w-4 h-4" />
              <span>Conversation Context</span>
            </div>
            <h4 className="text-sm font-semibold text-[#F1F0E9] leading-snug">
              {report.title}
            </h4>
            <p className="text-xs text-[#A4A69F] leading-relaxed">
              {report.summary}
            </p>
          </Card>

          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A6FF]">
              <HelpCircle className="w-4 h-4" />
              <span>Core Disagreement</span>
            </div>
            <p className="text-xs text-[#F1F0E9] leading-relaxed">
              {report.mainDisagreement}
            </p>
          </Card>

          {/* Ethics guardrail */}
          <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] space-y-2 text-xs text-[#A4A69F]">
            <div className="flex items-center gap-1.5 text-[#F1F0E9] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9FF32]" />
              <span>De-escalation Guardrails</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Generated suggestions maintain psychological safety, never assign clinical labels, and avoid retaliatory phrasing.
            </p>
          </div>
        </div>

        {/* Center Column: Interactive Composer (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-[#30332E] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C9FF32]" />
                <span className="text-sm font-semibold text-[#F1F0E9]">
                  Response Composer
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A4A69F]">
                <span>{selectedTone}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedLanguage}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedGoal}</span>
              </div>
            </div>

            {/* Editable Textarea */}
            <div className="space-y-2">
              <textarea
                value={activeDraft}
                onChange={(e) => setActiveDraft(e.target.value)}
                rows={9}
                className="w-full p-4 rounded-2xl bg-[#111311] border border-[#30332E] text-[#F1F0E9] text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C9FF32] transition-colors resize-y font-sans"
                placeholder="Draft your calibrated response here..."
              />

              <div className="flex items-center justify-between text-xs text-[#A4A69F] font-mono tabular-nums px-1">
                <span>{wordCount} words · {charCount} chars</span>
                {activeDraft !== lastGeneratedText && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[#A4A69F] hover:text-[#F1F0E9] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to generated version</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#30332E] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  isLoading={isRegenerating}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#C9FF32]" />}
                >
                  Regenerate
                </Button>
                <CopyButton textToCopy={activeDraft} label="Copy Reply" />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save to Response History
              </Button>
            </div>
          </Card>

          {/* Tone Selector Settings Box */}
          <Card className="p-6">
            <h4 className="text-sm font-semibold text-[#F1F0E9] mb-4">
              Calibrate Voice & Parameters
            </h4>
            <ToneSelector
              selectedTone={selectedTone}
              onSelectTone={setSelectedTone}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              selectedGoal={selectedGoal}
              onSelectGoal={setSelectedGoal}
              selectedLength={selectedLength}
              onSelectLength={setSelectedLength}
            />
          </Card>
        </div>

        {/* Right Column: Suggested Variants (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#A4A69F]">
              Tone Alternatives
            </h4>
            <span className="text-[11px] text-[#A4A69F]">
              {report.suggestedReplies.length} options
            </span>
          </div>

          <div className="space-y-3">
            {report.suggestedReplies.map((reply) => (
              <ResponseVariantCard
                key={reply.id}
                reply={reply}
                onApply={handleApplyVariant}
                isSelected={reply.tone === selectedTone && reply.language === selectedLanguage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
