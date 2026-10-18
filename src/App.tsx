/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ToastProvider } from "./components/ui/Toast";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./app/landing/LandingPage";
import { HowItWorksPage } from "./app/how-it-works/HowItWorksPage";
import { PrivacyPage } from "./app/privacy/PrivacyPage";
import { DashboardPage } from "./app/dashboard/DashboardPage";
import { NewAnalysisPage } from "./app/new/NewAnalysisPage";
import { TranscriptReviewPage } from "./app/analysis/TranscriptReviewPage";
import { AnalysisReportPage } from "./app/analysis/AnalysisReportPage";
import { ResponseStudioPage } from "./app/response-studio/ResponseStudioPage";
import { HistoryPage } from "./app/history/HistoryPage";
import { SettingsPage } from "./app/settings/SettingsPage";
import { SAMPLE_REPORTS } from "./lib/demoData";
import { AnalysisReport, InputMode } from "./types";

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined" && window.location.pathname) {
      // Default to / if root, otherwise keep current path
      return window.location.pathname;
    }
    return "/";
  });

  const [reports, setReports] = useState<AnalysisReport[]>(() => {
    // Try restoring from localStorage if available
    try {
      const stored = localStorage.getItem("vaani_reports_cache");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return SAMPLE_REPORTS;
  });

  // Persist reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("vaani_reports_cache", JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, "", path);
      window.scrollTo(0, 0);
    } catch {
      // fallback
    }
  };

  const handleAddReport = (newReport: AnalysisReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleUpdateReport = (updated: AnalysisReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRenameReport = (id: string, newTitle: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, title: newTitle } : r))
    );
  };

  const handleClearAllData = () => {
    setReports([]);
    try {
      localStorage.removeItem("vaani_reports_cache");
    } catch {
      // ignore
    }
  };

  // Route matching helpers
  const isPublicRoute =
    currentPath === "/" ||
    currentPath === "/how-it-works" ||
    currentPath === "/privacy";

  // Match /app/analysis/:id/transcript
  const transcriptMatch = currentPath.match(/^\/app\/analysis\/([^/]+)\/transcript/);
  // Match /app/analysis/:id/report
  const reportMatch = currentPath.match(/^\/app\/analysis\/([^/]+)\/report/);

  const getAnalysisReportById = (id: string) => {
    return reports.find((r) => r.id === id) || reports[0];
  };

  return (
    <ToastProvider>
      {/* 1. Public Routes */}
      {currentPath === "/" && <LandingPage onNavigate={navigate} />}
      {currentPath === "/how-it-works" && <HowItWorksPage onNavigate={navigate} />}
      {currentPath === "/privacy" && <PrivacyPage onNavigate={navigate} />}

      {/* 2. Workspace Routes Wrapped with AppShell */}
      {!isPublicRoute && (
        <AppShell
          currentPath={currentPath}
          onNavigate={navigate}
          showNewAnalysisButton={currentPath !== "/app/new"}
        >
          {/* Dashboard */}
          {currentPath === "/app" && (
            <DashboardPage
              reports={reports}
              onNavigate={navigate}
              onDeleteReport={handleDeleteReport}
              onRenameReport={handleRenameReport}
            />
          )}

          {/* New Analysis */}
          {currentPath.startsWith("/app/new") && (
            <NewAnalysisPage
              onNavigate={navigate}
              onAnalysisReady={handleAddReport}
              initialMode={
                currentPath.includes("mode=paste")
                  ? "paste"
                  : currentPath.includes("mode=record")
                  ? "record"
                  : "upload"
              }
            />
          )}

          {/* Transcript Review */}
          {transcriptMatch && (
            <TranscriptReviewPage
              report={getAnalysisReportById(transcriptMatch[1])}
              onNavigate={navigate}
              onUpdateReport={handleUpdateReport}
            />
          )}

          {/* Analysis Report */}
          {reportMatch && (
            <AnalysisReportPage
              report={getAnalysisReportById(reportMatch[1])}
              onNavigate={navigate}
              onDeleteReport={handleDeleteReport}
            />
          )}

          {/* Response Studio */}
          {currentPath === "/app/response-studio" && (
            <ResponseStudioPage
              reports={reports}
              onNavigate={navigate}
            />
          )}

          {/* History */}
          {currentPath === "/app/history" && (
            <HistoryPage
              reports={reports}
              onNavigate={navigate}
              onDeleteReport={handleDeleteReport}
              onRenameReport={handleRenameReport}
            />
          )}

          {/* Settings */}
          {currentPath === "/app/settings" && (
            <SettingsPage
              onNavigate={navigate}
              onClearAllData={handleClearAllData}
            />
          )}
        </AppShell>
      )}
    </ToastProvider>
  );
}
