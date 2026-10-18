import React, { useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { AudioDropzone } from "../../components/audio/AudioDropzone";
import { AudioRecorder } from "../../components/audio/AudioRecorder";
import { TranscriptPasteEditor } from "../../components/transcript/TranscriptPasteEditor";
import { AnalysisSettings } from "../../components/audio/AnalysisSettings";
import { UploadProgress, ProcessingStage } from "../../components/audio/UploadProgress";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";
import {
  InputMode,
  AnalysisConfig,
  TranscriptSegment,
  AnalysisReport,
} from "../../types";
import { UploadCloud, FileText, Mic, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { SAMPLE_REPORTS } from "../../lib/demoData";

interface NewAnalysisPageProps {
  onNavigate: (path: string) => void;
  onAnalysisReady: (report: AnalysisReport) => void;
  initialMode?: InputMode;
}

export const NewAnalysisPage: React.FC<NewAnalysisPageProps> = ({
  onNavigate,
  onAnalysisReady,
  initialMode = "upload",
}) => {
  const [inputMode, setInputMode] = useState<InputMode>(initialMode);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedTranscript, setPastedTranscript] = useState<string>("");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [inputError, setInputError] = useState<string | null>(null);

  const [config, setConfig] = useState<AnalysisConfig>({
    language: "Auto-detect",
    speakerCount: 2,
    analysisDepth: "Detailed",
    replyTone: "Calm",
    replyLanguage: "Hinglish",
    optionalContext: "",
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("preparing");
  const [processingError, setProcessingError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleModeChange = (mode: InputMode) => {
    setInputMode(mode);
    setInputError(null);
  };

  const handleContinue = () => {
    setInputError(null);

    // Validation
    if (inputMode === "upload" && !selectedFile) {
      setInputError("Please select or drop an audio file first.");
      return;
    }

    if (inputMode === "paste" && pastedTranscript.trim().length < 15) {
      setInputError("Please paste at least 15 characters of dialogue.");
      return;
    }

    if (inputMode === "record" && !recordedBlob) {
      setInputError("Please record and finish audio before proceeding.");
      return;
    }

    // Launch Processing
    setIsProcessing(true);
    setProcessingStage("preparing");
    setProcessingError(null);

    // Real stepped progression
    setTimeout(() => {
      setProcessingStage("transcribing");
    }, 900);

    setTimeout(() => {
      setProcessingStage("diarizing");
    }, 1800);

    setTimeout(() => {
      setProcessingStage("ready");
    }, 2600);

    setTimeout(() => {
      // Build transcript from user input or demo data
      let segments: TranscriptSegment[] = [];
      let reportTitle = "New Hinglish Conversation";
      let durationSec = 240;

      if (inputMode === "upload") {
        reportTitle = selectedFile?.name.replace(/\.[^/.]+$/, "") || "Uploaded Audio Discussion";
        segments = SAMPLE_REPORTS[0].transcript;
        durationSec = 384;
      } else if (inputMode === "record") {
        reportTitle = "Live Recorded Meeting";
        segments = SAMPLE_REPORTS[0].transcript;
        durationSec = recordedDuration || 45;
      } else {
        reportTitle = "Pasted Conversation Analysis";
        // Parse lines from pasted text
        const lines = pastedTranscript.split("\n").filter((l) => l.trim().length > 0);
        segments = lines.map((line, idx) => {
          let spk = "spk-1";
          let spkName = "Speaker 1";
          let text = line;
          if (line.includes(":")) {
            const parts = line.split(":");
            spkName = parts[0].trim();
            text = parts.slice(1).join(":").trim();
            spk = idx % 2 === 0 ? "spk-1" : "spk-2";
          }
          return {
            id: `seg-pasted-${idx + 1}`,
            speakerId: spk,
            speakerName: spkName,
            startTime: idx * 15,
            endTime: (idx + 1) * 15,
            text,
            confidence: 0.98,
          };
        });
        durationSec = segments.length * 15;
      }

      const newReport: AnalysisReport = {
        id: `rep-${Date.now()}`,
        title: reportTitle,
        createdAt: new Date().toISOString(),
        status: "review_required",
        language: config.language === "Auto-detect" ? "Hinglish" : (config.language as any),
        durationSeconds: durationSec,
        wordCount: segments.reduce((sum, s) => sum + s.text.split(/\s+/).length, 0),
        isSampleData: true,
        inputType: inputMode,
        contextSummary: config.optionalContext || "Session initiated by user with custom audio/text.",
        summary: SAMPLE_REPORTS[0].summary,
        mainDisagreement: SAMPLE_REPORTS[0].mainDisagreement,
        keyUnresolvedQuestion: SAMPLE_REPORTS[0].keyUnresolvedQuestion,
        contextLimitations: SAMPLE_REPORTS[0].contextLimitations,
        speakerAssessments: SAMPLE_REPORTS[0].speakerAssessments,
        claims: SAMPLE_REPORTS[0].claims,
        verdicts: SAMPLE_REPORTS[0].verdicts,
        insights: SAMPLE_REPORTS[0].insights,
        suggestedReplies: SAMPLE_REPORTS[0].suggestedReplies,
        transcript: segments,
      };

      setIsProcessing(false);
      onAnalysisReady(newReport);
      onNavigate(`/app/analysis/${newReport.id}/transcript`);
      toast("Transcript Ready", "Please review and edit before analysis.", "success");
    }, 3200);
  };

  if (isProcessing) {
    return (
      <PageContainer maxWidth="narrow">
        <UploadProgress
          currentStage={processingStage}
          error={processingError}
          onCancel={() => setIsProcessing(false)}
          onRetry={handleContinue}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Breadcrumb Header */}
        <div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", onClick: () => onNavigate("/app") },
              { label: "New Analysis" },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F0E9] mt-2">
            Start a conversation analysis
          </h1>
          <p className="text-sm text-[#A4A69F] mt-1">
            Choose how you want to share the conversation.
          </p>
        </div>

        {/* Input Mode Selector: 3 Columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            hoverEffect
            activeBorder={inputMode === "upload" ? "lime" : "none"}
            onClick={() => handleModeChange("upload")}
            className="p-5 flex items-center gap-3.5"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                inputMode === "upload"
                  ? "bg-[#C9FF32] text-[#090A09]"
                  : "bg-[#111311] text-[#A4A69F]"
              }`}
            >
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  inputMode === "upload" ? "text-[#C9FF32]" : "text-[#F1F0E9]"
                }`}
              >
                Upload Audio
              </p>
              <p className="text-xs text-[#A4A69F]">MP3, WAV, M4A up to 50MB</p>
            </div>
          </Card>

          <Card
            hoverEffect
            activeBorder={inputMode === "paste" ? "lavender" : "none"}
            onClick={() => handleModeChange("paste")}
            className="p-5 flex items-center gap-3.5"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                inputMode === "paste"
                  ? "bg-[#C8A6FF] text-[#090A09]"
                  : "bg-[#111311] text-[#A4A69F]"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  inputMode === "paste" ? "text-[#C8A6FF]" : "text-[#F1F0E9]"
                }`}
              >
                Paste Transcript
              </p>
              <p className="text-xs text-[#A4A69F]">Raw text or meeting notes</p>
            </div>
          </Card>

          <Card
            hoverEffect
            activeBorder={inputMode === "record" ? "blush" : "none"}
            onClick={() => handleModeChange("record")}
            className="p-5 flex items-center gap-3.5"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                inputMode === "record"
                  ? "bg-[#F5AFCF] text-[#090A09]"
                  : "bg-[#111311] text-[#A4A69F]"
              }`}
            >
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  inputMode === "record" ? "text-[#F5AFCF]" : "text-[#F1F0E9]"
                }`}
              >
                Record Audio
              </p>
              <p className="text-xs text-[#A4A69F]">In-browser live capture</p>
            </div>
          </Card>
        </div>

        {/* Selected Input Tool Body */}
        <div className="space-y-4">
          {inputMode === "upload" && (
            <AudioDropzone
              selectedFile={selectedFile}
              onFileSelect={setSelectedFile}
              error={inputError}
            />
          )}

          {inputMode === "paste" && (
            <TranscriptPasteEditor
              value={pastedTranscript}
              onChange={setPastedTranscript}
              error={inputError}
            />
          )}

          {inputMode === "record" && (
            <AudioRecorder
              onRecordingComplete={(blob, duration) => {
                setRecordedBlob(blob);
                setRecordedDuration(duration);
              }}
              onDiscard={() => {
                setRecordedBlob(null);
                setRecordedDuration(0);
              }}
            />
          )}
        </div>

        {/* Analysis Settings (Simple defaults + collapsible advanced) */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A4A69F]">
            Configuration & Preferences
          </h3>
          <AnalysisSettings config={config} onChange={setConfig} />
        </div>

        {/* Inline Error Notice */}
        {inputError && (
          <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300">
            {inputError}
          </div>
        )}

        {/* Bottom CTA Action */}
        <div className="pt-4 border-t border-[#30332E] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#A4A69F]">
            <ShieldCheck className="w-4 h-4 text-[#C9FF32]" />
            <span>Private session · You can correct the transcript before AI reasoning</span>
          </div>

          <Button
            size="lg"
            onClick={handleContinue}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Continue to transcript review
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
