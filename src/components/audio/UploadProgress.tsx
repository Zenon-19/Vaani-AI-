import React from "react";
import { VoiceOrb } from "../brand/VoiceOrb";
import { Button } from "../ui/Button";
import { Check, AlertCircle, X } from "lucide-react";

export type ProcessingStage = "preparing" | "transcribing" | "diarizing" | "ready";

interface UploadProgressProps {
  currentStage: ProcessingStage;
  onCancel?: () => void;
  error?: string | null;
  onRetry?: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  currentStage,
  onCancel,
  error,
  onRetry,
}) => {
  const stages: { id: ProcessingStage; label: string; description: string }[] = [
    {
      id: "preparing",
      label: "Audio Ingestion",
      description: "Validating sampling rate and segment bounds",
    },
    {
      id: "transcribing",
      label: "Hinglish Transcription",
      description: "Code-mixing detection across Hindi & English tokens",
    },
    {
      id: "diarizing",
      label: "Speaker Diarization",
      description: "Separating turns and vocal acoustic fingerprints",
    },
    {
      id: "ready",
      label: "Transcript Ready",
      description: "Opening interactive review editor",
    },
  ];

  const getStageStatus = (stageId: ProcessingStage) => {
    const order: ProcessingStage[] = ["preparing", "transcribing", "diarizing", "ready"];
    const currentIdx = order.indexOf(currentStage);
    const stageIdx = order.indexOf(stageId);

    if (stageIdx < currentIdx) return "completed";
    if (stageIdx === currentIdx) return "active";
    return "pending";
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 max-w-lg mx-auto text-center space-y-8">
      {/* Voice Orb Processing State */}
      <div className="relative">
        <VoiceOrb size="lg" state={error ? "idle" : "processing"} />
      </div>

      <div>
        <h3 className="text-xl font-semibold tracking-tight text-[#F1F0E9] mb-1">
          {error ? "Processing Interrupted" : "Analyzing Conversation Audio"}
        </h3>
        <p className="text-xs text-[#A4A69F] max-w-sm mx-auto">
          {error
            ? "We encountered an issue during acoustic transcription."
            : "Processing with Hinglish phonetic separation. Your data remains strictly confidential."}
        </p>
      </div>

      {error ? (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-left w-full space-y-3">
          <div className="flex items-center gap-2 text-rose-300 text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Transcription Error</span>
          </div>
          <p className="text-xs text-rose-300/80">{error}</p>
          <div className="flex items-center gap-3 pt-2">
            {onRetry && (
              <Button size="sm" variant="primary" onClick={onRetry}>
                Retry Process
              </Button>
            )}
            {onCancel && (
              <Button size="sm" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Stages list */
        <div className="w-full text-left space-y-3">
          {stages.map((stage) => {
            const status = getStageStatus(stage.id);
            return (
              <div
                key={stage.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  status === "active"
                    ? "bg-[#171817] border-[#C9FF32]/50 shadow-[0_0_15px_rgba(201,255,50,0.06)]"
                    : status === "completed"
                    ? "bg-[#111311] border-[#30332E]/70"
                    : "bg-[#090A09]/40 border-transparent opacity-40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-medium ${
                      status === "completed"
                        ? "bg-[#C9FF32] text-[#090A09]"
                        : status === "active"
                        ? "border-2 border-[#C9FF32] text-[#C9FF32] animate-pulse"
                        : "border border-[#30332E] text-[#A4A69F]"
                    }`}
                  >
                    {status === "completed" ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-semibold truncate ${
                        status === "active"
                          ? "text-[#C9FF32]"
                          : status === "completed"
                          ? "text-[#F1F0E9]"
                          : "text-[#A4A69F]"
                      }`}
                    >
                      {stage.label}
                    </p>
                    <p className="text-[11px] text-[#A4A69F] truncate">{stage.description}</p>
                  </div>
                </div>

                {status === "active" && (
                  <span className="text-[11px] font-mono text-[#C9FF32] animate-pulse shrink-0">
                    In progress...
                  </span>
                )}
              </div>
            );
          })}

          {onCancel && (
            <div className="pt-4 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                Cancel Processing
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
