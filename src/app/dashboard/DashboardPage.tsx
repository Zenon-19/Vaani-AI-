import React, { useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { VoiceOrb } from "../../components/brand/VoiceOrb";
import { StatusBadge } from "../../components/brand/StatusBadge";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { ErrorState } from "../../components/ui/ErrorState";
import { ConfirmDeleteDialog } from "../../components/ui/ConfirmDeleteDialog";
import { Dialog } from "../../components/ui/Dialog";
import { useToast } from "../../components/ui/Toast";
import { AnalysisReport } from "../../types";
import { formatTime, formatDate } from "../../lib/utils";
import {
  UploadCloud,
  FileText,
  Mic,
  ArrowRight,
  MoreVertical,
  Search,
  RotateCcw,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Download,
  Sparkles,
} from "lucide-react";

interface DashboardPageProps {
  reports: AnalysisReport[];
  onNavigate: (path: string) => void;
  onDeleteReport: (id: string) => void;
  onRenameReport: (id: string, newTitle: string) => void;
  isLoading?: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  reports,
  onNavigate,
  onDeleteReport,
  onRenameReport,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [exportModalReport, setExportModalReport] = useState<AnalysisReport | null>(null);
  const { toast } = useToast();

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartRename = (report: AnalysisReport) => {
    setRenameTarget({ id: report.id, title: report.title });
    setRenameInput(report.title);
    setActiveMenuId(null);
  };

  const handleConfirmRename = () => {
    if (renameTarget && renameInput.trim()) {
      onRenameReport(renameTarget.id, renameInput.trim());
      toast("Report Renamed", `Updated to "${renameInput.trim()}"`, "success");
      setRenameTarget(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDeleteReport(deleteTargetId);
      toast("Report Deleted", "Conversation report permanently removed.", "info");
      setDeleteTargetId(null);
    }
  };

  const handleDownloadExport = (report: AnalysisReport, format: "json" | "md") => {
    let content = "";
    let filename = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${format}`;
    let type = "text/plain";

    if (format === "json") {
      content = JSON.stringify(report, null, 2);
      type = "application/json";
    } else {
      content = `# Vaani AI Conversation Analysis Report\n**Title**: ${report.title}\n**Date**: ${report.createdAt}\n**Status**: ${report.status}\n\n## Neutral Summary\n${report.summary}\n\n## Main Disagreement\n${report.mainDisagreement}\n\n## Key Unresolved Question\n${report.keyUnresolvedQuestion}\n\n## Verdicts\n${report.verdicts.map(v => `### ${v.issue}\n- Stronger Side: ${v.strongerArgumentSide}\n- Shared Responsibility: ${v.sharedResponsibility}`).join("\n\n")}`;
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Export Ready", `Downloaded as ${format.toUpperCase()}`, "success");
    setExportModalReport(null);
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Welcome Greeting */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F0E9]">
            Let’s make sense of the conversation.
          </h1>
          <p className="text-sm text-[#A4A69F] mt-1">
            Upload a recording or paste a conversation to get an objective breakdown.
          </p>
        </div>

        {/* Hero Panel: Orb + Call to Action */}
        <Card className="p-6 sm:p-8 border-[#30332E] relative overflow-hidden bg-gradient-to-r from-[#171817] via-[#111311] to-[#171817]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-xl text-center sm:text-left">
              <span className="text-xs font-semibold text-[#C9FF32] tracking-wider uppercase">
                New Conversation Session
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F0E9] tracking-tight">
                Analyze a new conversation
              </h2>
              <p className="text-xs sm:text-sm text-[#A4A69F] leading-relaxed">
                Break down disagreements, examine audio-linked evidence, and draft calm, de-escalating replies for Hindi, English, and Hinglish dialogue.
              </p>
              <div className="pt-2">
                <Button
                  size="lg"
                  onClick={() => onNavigate("/app/new")}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Start a new analysis
                </Button>
              </div>
            </div>

            {/* Ambient Voice Orb Graphic */}
            <div className="relative shrink-0">
              <VoiceOrb size="md" state="idle" />
            </div>
          </div>
        </Card>

        {/* Quick Action Cards: Upload, Paste, Record */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#A4A69F]">
            Quick Input Shortcuts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Action 1: Upload Audio (Lime Accent) */}
            <Card
              hoverEffect
              activeBorder="lime"
              onClick={() => onNavigate("/app/new?mode=upload")}
              className="p-5 flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#C9FF32]/10 border border-[#C9FF32]/30 flex items-center justify-center text-[#C9FF32]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F1F0E9]">
                  Upload Audio File
                </h4>
                <p className="text-xs text-[#A4A69F] mt-1 leading-relaxed">
                  Drop MP3, WAV, or M4A audio up to 50MB for automatic speaker diarization.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#C9FF32] flex items-center gap-1">
                Upload now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>

            {/* Action 2: Paste Conversation (Lavender Accent) */}
            <Card
              hoverEffect
              activeBorder="lavender"
              onClick={() => onNavigate("/app/new?mode=paste")}
              className="p-5 flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#C8A6FF]/10 border border-[#C8A6FF]/30 flex items-center justify-center text-[#C8A6FF]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F1F0E9]">
                  Paste Conversation
                </h4>
                <p className="text-xs text-[#A4A69F] mt-1 leading-relaxed">
                  Paste notes or raw dialogue text to run fast objective claim verification.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#C8A6FF] flex items-center gap-1">
                Paste transcript <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>

            {/* Action 3: Record Live Audio (Blush Accent) */}
            <Card
              hoverEffect
              activeBorder="blush"
              onClick={() => onNavigate("/app/new?mode=record")}
              className="p-5 flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#F5AFCF]/10 border border-[#F5AFCF]/30 flex items-center justify-center text-[#F5AFCF]">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F1F0E9]">
                  Record Live Voice
                </h4>
                <p className="text-xs text-[#A4A69F] mt-1 leading-relaxed">
                  Record directly in-browser with live waveform meter and pause controls.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#F5AFCF] flex items-center gap-1">
                Start recording <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Card>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#F1F0E9] tracking-tight">
                Recent Conversation Reports
              </h3>
              <p className="text-xs text-[#A4A69F] mt-0.5">
                Past analyses, transcript evidence links, and generated reply drafts.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#A4A69F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#171817] border border-[#30332E] text-xs text-[#F1F0E9] placeholder-[#A4A69F]/50 focus:outline-none focus:border-[#C9FF32]"
              />
            </div>
          </div>

          {/* Skeleton Loading State */}
          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {/* Populated State */}
          {!isLoading && filteredReports.length > 0 && (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  hoverEffect
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => onNavigate(`/app/analysis/${report.id}/report`)}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={report.status} isSample={report.isSampleData} />
                      <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
                      <span className="text-xs font-mono text-[#A4A69F]">
                        {formatDate(report.createdAt)}
                      </span>
                      {report.durationSeconds && (
                        <>
                          <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
                          <span className="text-xs font-mono text-[#A4A69F]">
                            {formatTime(report.durationSeconds)}
                          </span>
                        </>
                      )}
                      <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
                      <span className="text-xs text-[#C8A6FF] font-medium">
                        {report.language}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-[#F1F0E9] truncate">
                      {report.title}
                    </h4>

                    <p className="text-xs text-[#A4A69F] line-clamp-1">
                      {report.summary}
                    </p>
                  </div>

                  {/* Actions & Overflow */}
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate(`/app/analysis/${report.id}/report`)}
                    >
                      Open Report
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onNavigate(`/app/analysis/${report.id}/transcript`)}
                      className="hidden md:inline-flex text-xs"
                    >
                      Transcript
                    </Button>

                    {/* Overflow Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === report.id ? null : report.id)
                        }
                        className="p-2 rounded-xl text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu Popup */}
                      {activeMenuId === report.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 rounded-2xl bg-[#111311] border border-[#30332E] shadow-xl p-1.5 z-30 space-y-1">
                          <button
                            onClick={() => handleStartRename(report)}
                            className="w-full px-3 py-1.5 rounded-xl text-xs text-left text-[#F1F0E9] hover:bg-[#171817] flex items-center gap-2 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#A4A69F]" />
                            <span>Rename</span>
                          </button>
                          <button
                            onClick={() => {
                              setExportModalReport(report);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl text-xs text-left text-[#F1F0E9] hover:bg-[#171817] flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 text-[#A4A69F]" />
                            <span>Export Data</span>
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTargetId(report.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl text-xs text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty Search State */}
          {!isLoading && reports.length > 0 && filteredReports.length === 0 && (
            <EmptyState
              title="No reports match your query"
              description={`We couldn't find any conversation analyses containing "${searchQuery}".`}
              actionLabel="Clear Filter"
              onAction={() => setSearchQuery("")}
            />
          )}

          {/* Complete Empty State */}
          {!isLoading && reports.length === 0 && (
            <EmptyState
              title="No conversation analyses yet"
              description="Upload your first audio recording or paste dialogue to receive an evidence-backed breakdown."
              actionLabel="Start First Analysis"
              onAction={() => onNavigate("/app/new")}
            />
          )}
        </div>
      </div>

      {/* Rename Dialog */}
      {renameTarget && (
        <Dialog
          isOpen={true}
          onClose={() => setRenameTarget(null)}
          title="Rename Conversation Report"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#171817] border border-[#30332E] text-sm text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32]"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRenameTarget(null)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmRename}>Save Title</Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Export Dialog */}
      {exportModalReport && (
        <Dialog
          isOpen={true}
          onClose={() => setExportModalReport(null)}
          title="Export Conversation Report"
          description="Download your objective breakdown for offline review or archiving."
          maxWidth="sm"
        >
          <div className="space-y-3 pt-2">
            <Card
              hoverEffect
              onClick={() => handleDownloadExport(exportModalReport, "json")}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-[#F1F0E9]">Structured JSON</p>
                <p className="text-xs text-[#A4A69F]">Full schema with claims, timestamps & replies</p>
              </div>
              <Download className="w-4 h-4 text-[#C9FF32]" />
            </Card>

            <Card
              hoverEffect
              onClick={() => handleDownloadExport(exportModalReport, "md")}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-[#F1F0E9]">Markdown Document</p>
                <p className="text-xs text-[#A4A69F]">Formatted markdown summary for documentation</p>
              </div>
              <Download className="w-4 h-4 text-[#C8A6FF]" />
            </Card>
          </div>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation Report?"
        description="This action cannot be undone. All transcript excerpts, evidence links, and generated reply drafts will be permanently removed."
      />
    </PageContainer>
  );
};
