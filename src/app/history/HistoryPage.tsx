import React, { useState, useMemo } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { StatusBadge } from "../../components/brand/StatusBadge";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Dialog } from "../../components/ui/Dialog";
import { ConfirmDeleteDialog } from "../../components/ui/ConfirmDeleteDialog";
import { useToast } from "../../components/ui/Toast";
import { AnalysisReport, InputMode, AnalysisStatus } from "../../types";
import { formatDate, formatTime } from "../../lib/utils";
import {
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Download,
  Calendar,
  Layers,
  ArrowRight,
  FileAudio,
} from "lucide-react";

interface HistoryPageProps {
  reports: AnalysisReport[];
  onNavigate: (path: string) => void;
  onDeleteReport: (id: string) => void;
  onRenameReport: (id: string, newTitle: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  reports,
  onNavigate,
  onDeleteReport,
  onRenameReport,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedInputType, setSelectedInputType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [renameInput, setRenameInput] = useState("");
  const [exportModalReport, setExportModalReport] = useState<AnalysisReport | null>(null);
  const { toast } = useToast();

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLang =
        selectedLanguage === "all" || r.language === selectedLanguage;

      const matchesInput =
        selectedInputType === "all" || r.inputType === selectedInputType;

      const matchesStatus =
        selectedStatus === "all" || r.status === selectedStatus;

      return matchesSearch && matchesLang && matchesInput && matchesStatus;
    });
  }, [reports, searchQuery, selectedLanguage, selectedInputType, selectedStatus]);

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
      toast("Deleted", "Report permanently deleted.", "info");
      setDeleteTargetId(null);
    }
  };

  const handleDownloadExport = (report: AnalysisReport, format: "json" | "md") => {
    const content =
      format === "json"
        ? JSON.stringify(report, null, 2)
        : `# ${report.title}\n${report.summary}`;
    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Export Complete", `Downloaded as ${format.toUpperCase()}`, "success");
    setExportModalReport(null);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedLanguage("all");
    setSelectedInputType("all");
    setSelectedStatus("all");
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", onClick: () => onNavigate("/app") },
              { label: "History" },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F0E9] mt-2">
            Analysis History
          </h1>
          <p className="text-sm text-[#A4A69F] mt-1">
            Access past conversation breakdowns, verified evidence, and reply versions.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#171817] border border-[#30332E] space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#A4A69F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, titles, or speaker points..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] placeholder-[#A4A69F]/50 focus:outline-none focus:border-[#C9FF32]"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
              >
                <option value="all">All Languages</option>
                <option value="Hinglish">Hinglish</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
              </select>

              <select
                value={selectedInputType}
                onChange={(e) => setSelectedInputType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
              >
                <option value="all">All Sources</option>
                <option value="upload">Audio File</option>
                <option value="paste">Pasted Text</option>
                <option value="record">Voice Recording</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="review_required">Needs Review</option>
                <option value="draft">Draft</option>
              </select>

              {(searchQuery || selectedLanguage !== "all" || selectedInputType !== "all" || selectedStatus !== "all") && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#C9FF32] hover:underline px-2 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results List */}
        {filteredReports.length > 0 ? (
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
                    <span className="text-[#A4A69F]/40" aria-hidden="true">·</span>
                    <span className="text-xs text-[#A4A69F] capitalize">
                      Source: {report.inputType}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#F1F0E9] truncate">
                    {report.title}
                  </h3>

                  <p className="text-xs text-[#A4A69F] line-clamp-1">
                    {report.summary}
                  </p>
                </div>

                {/* Actions */}
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

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === report.id ? null : report.id)
                      }
                      className="p-2 rounded-xl text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] transition-colors cursor-pointer"
                      title="Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

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
                          <span>Export</span>
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
        ) : (
          <EmptyState
            title="No matching reports found"
            description="Adjust your search keywords or filter criteria to view past conversation records."
            actionLabel="Reset Filters"
            onAction={clearAllFilters}
          />
        )}
      </div>

      {/* Rename Dialog */}
      {renameTarget && (
        <Dialog
          isOpen={true}
          onClose={() => setRenameTarget(null)}
          title="Rename Report"
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
              <Button onClick={handleConfirmRename}>Save</Button>
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
          description="Download analysis report data for offline records."
          maxWidth="sm"
        >
          <div className="space-y-3 pt-2">
            <Card
              hoverEffect
              onClick={() => handleDownloadExport(exportModalReport, "json")}
              className="p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-[#F1F0E9]">JSON Schema</p>
                <p className="text-xs text-[#A4A69F]">Complete data format</p>
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
                <p className="text-xs text-[#A4A69F]">Formatted text document</p>
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
        title="Delete this analysis report?"
        description="This will permanently delete this conversation breakdown and its transcript. This action cannot be reversed."
      />
    </PageContainer>
  );
};
