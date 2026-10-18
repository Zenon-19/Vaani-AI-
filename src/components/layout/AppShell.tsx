import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNavigation } from "./MobileNavigation";
import { BreadcrumbItem } from "./Breadcrumbs";
import { ContourBackground } from "../brand/ContourBackground";

interface AppShellProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  showNewAnalysisButton?: boolean;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentPath,
  onNavigate,
  breadcrumbs,
  title,
  showNewAnalysisButton = true,
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#090A09] text-[#F1F0E9] flex relative overflow-x-hidden selection:bg-[#C9FF32]/20 selection:text-[#C9FF32]">
      {/* Topographic Background */}
      <ContourBackground glowPosition="top" />

      {/* Desktop Persistent Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          breadcrumbs={breadcrumbs}
          title={title}
          onNavigate={onNavigate}
          showNewAnalysisButton={showNewAnalysisButton}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNavigation currentPath={currentPath} onNavigate={onNavigate} />
      </div>
    </div>
  );
};
