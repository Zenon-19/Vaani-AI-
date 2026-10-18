import React, { useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { TranscriptEditor } from "../../components/transcript/TranscriptEditor";
import { UploadProgress, ProcessingStage } from "../../components/audio/UploadProgress";
import { AnalysisReport, TranscriptSegment } from "../../types";
import { useToast } from "../../components/ui/Toast";

interface TranscriptReviewPageProps {
  report: AnalysisReport;
  onNavigate: (path: string) => void;
  onUpdateReport: (updated: AnalysisReport) => void;
}

export const TranscriptReviewPage: React.FC<TranscriptReviewPageProps> = ({
  report,
  onNavigate,
  onUpdateReport,
}) => {
  const [segments, setSegments] = useState<TranscriptSegment[]>(report.transcript);
  const [title, setTitle] = useState(report.title);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<ProcessingStage>("preparing");
  const { toast } = useToast();

  const handleUpdateSegments = (newSegments: TranscriptSegment[]) => {
    setSegments(newSegments);
    onUpdateReport({
      ...report,
      title,
      transcript: newSegments,
      wordCount: newSegments.reduce((sum, s) => sum + s.text.split(/\s+/).length, 0),
    });
  };

  const handleUpdateTitle = (newTitle: string) => {
    setTitle(newTitle);
    onUpdateReport({ ...report, title: newTitle });
    toast("Title updated", newTitle, "success");
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisStage("transcribing");

    setTimeout(() => {
      setAnalysisStage("diarizing");
    }, 900);

    setTimeout(() => {
      setAnalysisStage("ready");
    }, 1800);

    setTimeout(() => {
      setIsAnalyzing(false);
      const updated: AnalysisReport = {
        ...report,
        title,
        status: "completed",
        transcript: segments,
      };
      onUpdateReport(updated);
      onNavigate(`/app/analysis/${report.id}/report`);
      toast("Analysis Complete", "Objective breakdown ready to review.", "success");
    }, 2400);
  };

  if (isAnalyzing) {
    return (
      <PageContainer maxWidth="narrow">
        <UploadProgress
          currentStage={analysisStage}
          onCancel={() => setIsAnalyzing(false)}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="wide">
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Dashboard", onClick: () => onNavigate("/app") },
            { label: "New Analysis", onClick: () => onNavigate("/app/new") },
            { label: "Transcript Review" },
          ]}
        />

        <TranscriptEditor
          title={title}
          onUpdateTitle={handleUpdateTitle}
          segments={segments}
          onUpdateSegments={handleUpdateSegments}
          durationSeconds={report.durationSeconds}
          audioUrl={report.audioUrl}
          onBack={() => onNavigate("/app/new")}
          onContinueToAnalysis={handleRunAnalysis}
          onSaveDraft={() => {
            onUpdateReport({
              ...report,
              title,
              transcript: segments,
              status: "draft",
            });
          }}
        />
      </div>
    </PageContainer>
  );
};
