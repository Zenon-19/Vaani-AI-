import React, { useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { StatusBadge } from "../../components/brand/StatusBadge";
import { AnalysisSummary } from "../../components/analysis/AnalysisSummary";
import { SpeakerAssessmentCard } from "../../components/analysis/SpeakerAssessmentCard";
import { VerdictCard } from "../../components/analysis/VerdictCard";
import { ClaimEvidenceList } from "../../components/analysis/ClaimEvidenceList";
import { EvidenceDrawer } from "../../components/analysis/EvidenceDrawer";
import { CommunicationInsightCard } from "../../components/analysis/CommunicationInsightCard";
import { SentimentTimeline } from "../../components/analysis/SentimentTimeline";
import { HinglishExecutiveSummaryCard } from "../../components/analysis/HinglishExecutiveSummaryCard";
import { CopyButton } from "../../components/response/CopyButton";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Dialog } from "../../components/ui/Dialog";
import { ConfirmDeleteDialog } from "../../components/ui/ConfirmDeleteDialog";
import { useToast } from "../../components/ui/Toast";
import {
  AnalysisReport,
  ClaimAssessment,
  HinglishExecutiveSummary,
} from "../../types";
import { formatDate, formatTime } from "../../lib/utils";
import {
  generateHinglishExecutiveSummary,
  formatHinglishSummaryForCopy,
} from "../../lib/hinglishSummary";
import {
  FileText,
  Download,
  Trash2,
  Sparkles,
  ArrowRight,
  Languages,
} from "lucide-react";

interface AnalysisReportPageProps {
  report: AnalysisReport;
  onNavigate: (path: string) => void;
  onUpdateReport?: (updated: AnalysisReport) => void;
  onDeleteReport: (id: string) => void;
}

export const AnalysisReportPage: React.FC<AnalysisReportPageProps> = ({
  report,
  onNavigate,
  onUpdateReport,
  onDeleteReport,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<ClaimAssessment | null>(null);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [localHinglishSummary, setLocalHinglishSummary] = useState<
    HinglishExecutiveSummary | undefined
  >(report.hinglishSummary);
  const [isGeneratingHinglish, setIsGeneratingHinglish] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setLocalHinglishSummary(report.hinglishSummary);
  }, [report.id, report.hinglishSummary]);

  const activeHinglishSummary = report.hinglishSummary || localHinglishSummary;

  const handleGenerateHinglishSummary = (
    focus: "balanced" | "misunderstandings" = "balanced"
  ) => {
    setIsGeneratingHinglish(true);
    setTimeout(() => {
      const generated = generateHinglishExecutiveSummary(report, focus);
      setLocalHinglishSummary(generated);
      onUpdateReport?.({
        ...report,
        hinglishSummary: generated,
      });
      setIsGeneratingHinglish(false);
      toast(
        "Hinglish Brief Ready",
        "Generated concise executive summary with key points and misunderstandings.",
        "success"
      );
    }, 450);
  };

  const handleOpenEvidenceForClaim = (claim: ClaimAssessment) => {
    setSelectedClaim(claim);
    setIsEvidenceDrawerOpen(true);
  };

  const handleOpenEvidenceForSegment = (segmentId: string) => {
    const claim = report.claims.find((c) =>
      c.evidenceSegmentIds.includes(segmentId)
    );
    if (claim) {
      setSelectedClaim(claim);
    } else {
      // Create lightweight reference wrapper
      const seg = report.transcript.find((s) => s.id === segmentId);
      setSelectedClaim({
        id: `ref-${segmentId}`,
        speakerId: seg?.speakerId || "spk-1",
        claim: seg?.text || "Referenced statement",
        assessment: "supported",
        evidenceSegmentIds: [segmentId],
        explanation: `Inspecting spoken utterance attributed to ${seg?.speakerName || "speaker"}.`,
        quote: seg?.text,
      });
    }
    setIsEvidenceDrawerOpen(true);
  };

  const handleDownloadExport = async (format: "json" | "md" | "pdf") => {
    if (format === "pdf") {
      try {
        const { exportReportToPdf } = await import("../../lib/pdfExport");
        await exportReportToPdf(
          activeHinglishSummary
            ? { ...report, hinglishSummary: activeHinglishSummary }
            : report
        );
        toast("PDF Export Ready", "Downloaded analysis report as PDF document.", "success");
        setIsExportDialogOpen(false);
      } catch (err) {
        console.error("PDF generation failed:", err);
        toast("Export Failed", "Could not generate PDF document. Please try Markdown or JSON.", "error");
      }
      return;
    }

    const hinglishMdSection = activeHinglishSummary
      ? `\n\n## Hinglish Executive Summary\n${formatHinglishSummaryForCopy(activeHinglishSummary, report.title)}`
      : "";

    const content =
      format === "json"
        ? JSON.stringify(
            activeHinglishSummary
              ? { ...report, hinglishSummary: activeHinglishSummary }
              : report,
            null,
            2
          )
        : `# Vaani AI Conversation Analysis Report\n**Title**: ${report.title}\n**Date**: ${report.createdAt}\n**Status**: ${report.status}\n\n## Neutral Summary\n${report.summary}\n\n## Core Disagreement\n${report.mainDisagreement}\n\n## Key Unresolved Question\n${report.keyUnresolvedQuestion}${hinglishMdSection}\n\n## Verdicts\n${report.verdicts.map(v => `### ${v.issue}\n- Stronger Side: ${v.strongerArgumentSide}\n- Shared Responsibility: ${v.sharedResponsibility}`).join("\n\n")}`;

    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Export Complete", `Downloaded as ${format.toUpperCase()}`, "success");
    setIsExportDialogOpen(false);
  };

  const handleDelete = () => {
    onDeleteReport(report.id);
    toast("Report Deleted", "Conversation report removed.", "info");
    onNavigate("/app");
  };

  return (
    <PageContainer maxWidth="wide">
      <div className="space-y-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { label: "Dashboard", onClick: () => onNavigate("/app") },
              { label: "History", onClick: () => onNavigate("/app/history") },
              { label: report.title },
            ]}
          />

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="lavender"
              size="sm"
              onClick={() => {
                const el = document.getElementById("hinglish-executive-summary");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                if (!activeHinglishSummary && !isGeneratingHinglish) {
                  handleGenerateHinglishSummary("balanced");
                }
              }}
              leftIcon={<Languages className="w-3.5 h-3.5" />}
            >
              {activeHinglishSummary ? "Hinglish Brief" : "Hinglish Summary"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(`/app/analysis/${report.id}/transcript`)}
              leftIcon={<FileText className="w-3.5 h-3.5" />}
            >
              Edit Transcript
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadExport("pdf")}
              leftIcon={<Download className="w-3.5 h-3.5 text-[#C9FF32]" />}
              className="border-[#C9FF32]/40 hover:border-[#C9FF32] text-[#F1F0E9]"
            >
              Export PDF
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExportDialogOpen(true)}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export All
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Report Hero Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#171817] border border-[#30332E] space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge status={report.status} isSample={report.isSampleData} />
            <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-[#A4A69F]">
              Analyzed on {formatDate(report.createdAt)}
            </span>
            {report.durationSeconds && (
              <>
                <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
                <span className="text-xs font-mono text-[#A4A69F]">
                  {formatTime(report.durationSeconds)} duration
                </span>
              </>
            )}
            <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
            <span className="text-xs text-[#C8A6FF] font-medium">
              {report.language}
            </span>
            <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
            <span className="text-xs font-mono text-[#A4A69F]">
              {report.wordCount} words
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F1F0E9]">
            {report.title}
          </h1>

          {report.contextSummary && (
            <p className="text-xs sm:text-sm text-[#A4A69F] max-w-3xl leading-relaxed">
              {report.contextSummary}
            </p>
          )}
        </div>

        {/* Sample Data Disclaimer if demo */}
        {report.isSampleData && (
          <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-[#A4A69F]">
              <Sparkles className="w-4 h-4 text-[#C9FF32] shrink-0" />
              <span>
                <strong className="text-[#F1F0E9]">Sample Hinglish Case Study:</strong> Grounded in verified engineering vs product retrospectives. Connect your backend or upload custom recordings anytime.
              </span>
            </div>
            <button
              onClick={() => onNavigate("/app/new")}
              className="text-[#C9FF32] font-semibold hover:underline shrink-0 cursor-pointer"
            >
              Analyze Your Audio →
            </button>
          </div>
        )}

        {/* 1. Neutral Summary Card */}
        <AnalysisSummary
          summary={report.summary}
          mainDisagreement={report.mainDisagreement}
          keyUnresolvedQuestion={report.keyUnresolvedQuestion}
          contextLimitations={report.contextLimitations}
        />

        {/* 1b. Concise Hinglish Executive Summary */}
        <div id="hinglish-executive-summary">
          <HinglishExecutiveSummaryCard
            report={report}
            hinglishSummary={activeHinglishSummary}
            isGenerating={isGeneratingHinglish}
            onGenerate={handleGenerateHinglishSummary}
            onInspectSegment={handleOpenEvidenceForSegment}
          />
        </div>

        {/* 2. D3 Sentiment & Tone Shift Timeline */}
        <SentimentTimeline
          timeline={report.sentimentTimeline}
          transcript={report.transcript}
          isSampleData={report.isSampleData}
          onInspectSegment={handleOpenEvidenceForSegment}
        />

        {/* 3. Speaker Cards (Grid) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
                Speaker Perspective & Argument Quality
              </h2>
              <p className="text-xs text-[#A4A69F] mt-0.5">
                Fair evaluations applying identical standards to both participants.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {report.speakerAssessments.map((spk) => (
              <SpeakerAssessmentCard
                key={spk.speakerId}
                speaker={spk}
                onOpenEvidenceForSegment={handleOpenEvidenceForSegment}
              />
            ))}
          </div>
        </div>

        {/* 3. Objective Issue Verdicts */}
        <VerdictCard verdicts={report.verdicts} />

        {/* 4. Claim-by-Claim Evidence Verification */}
        <ClaimEvidenceList
          claims={report.claims}
          onSelectClaim={handleOpenEvidenceForClaim}
        />

        {/* 5. Communication Insights & Pitfalls */}
        <CommunicationInsightCard insights={report.insights} />

        {/* 6. Response Coaching Banner */}
        <Card className="p-6 sm:p-8 border-[#C9FF32]/50 bg-gradient-to-r from-[#171817] via-[#111311] to-[#171817] space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#C9FF32] tracking-wider uppercase">
                Coach Recommendation
              </span>
              <h3 className="text-xl font-bold text-[#F1F0E9]">
                Calibrated Response & De-escalation
              </h3>
              <p className="text-xs text-[#A4A69F] max-w-xl">
                Ready to draft a reply that acknowledges business realities while setting healthy operational boundaries?
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => onNavigate("/app/response-studio")}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open in Response Studio
            </Button>
          </div>

          {/* Quick Preview of Primary Response */}
          {report.suggestedReplies[0] && (
            <div className="p-4 rounded-2xl bg-[#090A09]/90 border border-[#30332E] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#C9FF32]">
                  {report.suggestedReplies[0].tone} Tone ({report.suggestedReplies[0].language})
                </span>
                <CopyButton textToCopy={report.suggestedReplies[0].text} />
              </div>
              <p className="text-sm text-[#F1F0E9] italic leading-relaxed">
                "{report.suggestedReplies[0].text}"
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        claim={selectedClaim}
        segments={report.transcript}
        onJumpToTranscript={(segId) => {
          onNavigate(`/app/analysis/${report.id}/transcript#segment-${segId}`);
        }}
      />

      {/* Export Dialog */}
      <Dialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        title="Export Analysis Report"
        description="Choose your export format. Private data will never be published online."
        maxWidth="sm"
      >
        <div className="space-y-3 pt-2">
          <Card
            hoverEffect
            activeBorder="lime"
            onClick={() => handleDownloadExport("pdf")}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#F1F0E9]">PDF Document</p>
                <span className="text-[10px] font-semibold text-[#090A09] bg-[#C9FF32] px-1.5 py-0.5 rounded">Recommended</span>
              </div>
              <p className="text-xs text-[#A4A69F] mt-0.5">High-fidelity report formatted for sharing and printing</p>
            </div>
            <Download className="w-4 h-4 text-[#C9FF32]" />
          </Card>

          <Card
            hoverEffect
            onClick={() => handleDownloadExport("md")}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-[#F1F0E9]">Markdown Summary</p>
              <p className="text-xs text-[#A4A69F]">Formatted markdown for Notion, GitHub, or docs</p>
            </div>
            <Download className="w-4 h-4 text-[#C8A6FF]" />
          </Card>

          <Card
            hoverEffect
            onClick={() => handleDownloadExport("json")}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-[#F1F0E9]">JSON Schema</p>
              <p className="text-xs text-[#A4A69F]">Raw structured data with timestamps and claim IDs</p>
            </div>
            <Download className="w-4 h-4 text-[#A4A69F]" />
          </Card>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete this analysis report?"
        description="This will permanently delete this conversation breakdown and its transcript. This action cannot be reversed."
      />
    </PageContainer>
  );
};
