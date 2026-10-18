import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  MessageSquareText,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { VaaniLogo } from "../brand/VaaniLogo";
import { cn } from "../../lib/utils";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
}) => {
  const mainNavItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/app",
      icon: LayoutDashboard,
    },
    {
      id: "new-analysis",
      label: "New Analysis",
      path: "/app/new",
      icon: PlusCircle,
      highlight: true,
    },
    {
      id: "history",
      label: "History",
      path: "/app/history",
      icon: History,
    },
    {
      id: "response-studio",
      label: "Response Studio",
      path: "/app/response-studio",
      icon: MessageSquareText,
    },
    {
      id: "how-it-works",
      label: "How It Works",
      path: "/how-it-works",
      icon: HelpCircle,
    },
  ];

  const bottomNavItems = [
    {
      id: "privacy",
      label: "Privacy & Data",
      path: "/privacy",
      icon: ShieldCheck,
    },
    {
      id: "settings",
      label: "Settings",
      path: "/app/settings",
      icon: Settings,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/app" && currentPath === "/app") return true;
    if (path !== "/app" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#090A09] border-r border-[#30332E] z-30 transition-all duration-300 select-none",
        isCollapsed ? "w-[76px]" : "w-[240px]"
      )}
    >
      {/* Top brand header */}
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#30332E]/60">
          <button
            onClick={() => onNavigate("/app")}
            className="flex items-center gap-2 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9FF32] rounded-lg"
          >
            <VaaniLogo iconOnly={isCollapsed} size={isCollapsed ? "sm" : "md"} />
          </button>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#171817] transition-colors cursor-pointer"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="p-3 space-y-1.5" aria-label="Main Navigation">
          {mainNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 cursor-pointer group text-left",
                  active
                    ? "bg-[#171817] text-[#C9FF32] border border-[#30332E] shadow-[0_0_12px_rgba(201,255,50,0.06)]"
                    : "text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] border border-transparent",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    active
                      ? "text-[#C9FF32]"
                      : item.highlight
                      ? "text-[#C9FF32] group-hover:text-[#d5ff57]"
                      : "text-[#A4A69F] group-hover:text-[#F1F0E9]"
                  )}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!isCollapsed && item.highlight && !active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9FF32]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom anchors: Settings & Profile */}
      <div className="p-3 border-t border-[#30332E]/60 space-y-1.5">
        {bottomNavItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-colors cursor-pointer text-left",
                active
                  ? "bg-[#171817] text-[#C9FF32] border border-[#30332E]"
                  : "text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#111311] border border-transparent",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Profile Card */}
        <div
          onClick={() => onNavigate("/app/settings")}
          className={cn(
            "mt-2 pt-2 border-t border-[#30332E]/40 flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-[#111311] transition-colors cursor-pointer",
            isCollapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-[#171817] border border-[#30332E] flex items-center justify-center text-[#C9FF32] shrink-0 font-medium text-xs">
            VA
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[#F1F0E9] truncate">Lakshya Lohani</p>
              <p className="text-[11px] text-[#A4A69F] truncate">Free Workspace</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
