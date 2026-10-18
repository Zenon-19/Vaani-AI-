import React, { useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { ResponseComposer } from "../../components/response/ResponseComposer";
import { AnalysisReport, SuggestedReply } from "../../types";
import { Card } from "../../components/ui/Card";
import { CopyButton } from "../../components/response/CopyButton";
import { useToast } from "../../components/ui/Toast";
import { MessageSquareText, History, Trash2, ExternalLink } from "lucide-react";

interface ResponseStudioPageProps {
  reports: AnalysisReport[];
  selectedReportId?: string;
  onNavigate: (path: string) => void;
}

export const ResponseStudioPage: React.FC<ResponseStudioPageProps> = ({
  reports,
  selectedReportId,
  onNavigate,
}) => {
  const [activeReportId, setActiveReportId] = useState<string>(
    selectedReportId || reports[0]?.id || ""
  );

  const [savedResponses, setSavedResponses] = useState<SuggestedReply[]>([
    {
      id: "saved-demo-1",
      tone: "Calm",
      language: "Hinglish",
      goal: "Resolve conflict",
      text: "Priya, I understand ki enterprise client ke penalties bohot critical hain. Let's do this: main staging worker memory abhi temporary double kar deta hoon so QA verification continue ho sake.",
      notes: "Saved during Sprint retrospective review.",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"composer" | "saved">("composer");
  const { toast } = useToast();

  const activeReport =
    reports.find((r) => r.id === activeReportId) || reports[0];

  const handleSaveResponse = (reply: SuggestedReply) => {
    setSavedResponses((prev) => [reply, ...prev]);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedResponses((prev) => prev.filter((r) => r.id !== id));
    toast("Removed", "Response removed from history.", "info");
  };

  return (
    <PageContainer maxWidth="wide">
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Breadcrumbs
              items={[
                { label: "Dashboard", onClick: () => onNavigate("/app") },
                { label: "Response Studio" },
              ]}
            />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F0E9] mt-2">
              Response Studio
            </h1>
            <p className="text-sm text-[#A4A69F] mt-1">
              Calibrate your words, balance empathy with boundaries, and de-escalate conflict.
            </p>
          </div>

          {/* Report Context Selector & Mode Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {reports.length > 1 && (
              <select
                value={activeReportId}
                onChange={(e) => setActiveReportId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#171817] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
              >
                {reports.map((r) => (
                  <option key={r.id} value={r.id} className="bg-[#111311]">
                    Context: {r.title}
                  </option>
                ))}
              </select>
            )}

            <div className="flex p-1 bg-[#111311] rounded-xl border border-[#30332E]">
              <button
                type="button"
                onClick={() => setActiveTab("composer")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeTab === "composer"
                    ? "bg-[#171817] text-[#C9FF32] font-semibold"
                    : "text-[#A4A69F] hover:text-[#F1F0E9]"
                }`}
              >
                Composer
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("saved")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "saved"
                    ? "bg-[#171817] text-[#C9FF32] font-semibold"
                    : "text-[#A4A69F] hover:text-[#F1F0E9]"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Saved ({savedResponses.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content body */}
        {activeTab === "composer" ? (
          activeReport ? (
            <ResponseComposer
              report={activeReport}
              onSaveResponse={handleSaveResponse}
            />
          ) : (
            <Card className="p-8 text-center text-sm text-[#A4A69F]">
              No conversation report selected. Please run an analysis first.
            </Card>
          )
        ) : (
          /* Saved Responses List */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#F1F0E9]">
                Saved Response Drafts
              </h2>
              <span className="text-xs text-[#A4A69F]">
                {savedResponses.length} stored replies
              </span>
            </div>

            {savedResponses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedResponses.map((item) => (
                  <Card key={item.id} className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[#C9FF32]">
                          {item.tone}
                        </span>
                        <span className="text-[#A4A69F]/40">·</span>
                        <span className="text-[#A4A69F]">{item.language}</span>
                        <span className="text-[#A4A69F]/40">·</span>
                        <span className="text-[#C8A6FF]">{item.goal}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <CopyButton textToCopy={item.text} />
                        <button
                          onClick={() => handleDeleteSaved(item.id)}
                          className="p-1.5 rounded-lg text-[#A4A69F] hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
                          title="Delete saved reply"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-[#F1F0E9] leading-relaxed">
                      "{item.text}"
                    </p>

                    {item.notes && (
                      <p className="text-xs text-[#A4A69F] italic pt-1 border-t border-[#30332E]/60">
                        {item.notes}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-10 text-center text-sm text-[#A4A69F] space-y-2">
                <p>No replies saved yet.</p>
                <p className="text-xs">
                  Compose and hit "Save to Response History" to store your drafts here.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
