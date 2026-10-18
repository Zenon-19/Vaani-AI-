import React from "react";
import { PlusCircle, Sparkles, User, ExternalLink } from "lucide-react";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";
import { Button } from "../ui/Button";

interface TopBarProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  onNavigate: (path: string) => void;
  showNewAnalysisButton?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  breadcrumbs,
  title,
  onNavigate,
  showNewAnalysisButton = true,
}) => {
  return (
    <header className="h-16 px-6 sm:px-8 border-b border-[#30332E]/60 bg-[#090A09]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left Zone: Title or Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs items={breadcrumbs} />
        ) : (
          <h1 className="text-base font-semibold text-[#F1F0E9] truncate">
            {title || "Dashboard"}
          </h1>
        )}
      </div>

      {/* Middle Zone: Subtle Status Notice */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-[#A4A69F]">
        <span>Hinglish Engine</span>
        <span aria-hidden="true">·</span>
        <span>Evidence-Backed Analysis</span>
      </div>

      {/* Right Zone: Primary action and profile */}
      <div className="flex items-center gap-3 shrink-0">
        {showNewAnalysisButton && (
          <Button
            size="sm"
            onClick={() => onNavigate("/app/new")}
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            New Analysis
          </Button>
        )}

        <button
          onClick={() => onNavigate("/app/settings")}
          className="w-8 h-8 rounded-full bg-[#171817] border border-[#30332E] hover:border-[#C9FF32]/50 flex items-center justify-center text-xs font-medium text-[#F1F0E9] transition-colors cursor-pointer"
          title="Account Settings"
          aria-label="Account Settings"
        >
          <User className="w-4 h-4 text-[#A4A69F]" />
        </button>
      </div>
    </header>
  );
};
