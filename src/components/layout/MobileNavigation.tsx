import React from "react";
import { LayoutDashboard, Plus, History, Settings } from "lucide-react";
import { cn } from "../../lib/utils";

interface MobileNavigationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentPath,
  onNavigate,
}) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Home",
      path: "/app",
      icon: LayoutDashboard,
    },
    {
      id: "new",
      label: "New",
      path: "/app/new",
      icon: Plus,
      isSpecial: true,
    },
    {
      id: "history",
      label: "History",
      path: "/app/history",
      icon: History,
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
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#090A09]/95 backdrop-blur-lg border-t border-[#30332E] z-40 px-4 flex items-center justify-around"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

        if (item.isSpecial) {
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className="flex flex-col items-center justify-center -mt-5 cursor-pointer focus:outline-none"
              aria-label="Start new conversation analysis"
            >
              <div className="w-12 h-12 rounded-full bg-[#C9FF32] text-[#090A09] flex items-center justify-center shadow-[0_0_16px_rgba(201,255,50,0.35)] active:scale-95 transition-transform">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-semibold text-[#C9FF32] mt-1">New</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center min-w-[56px] min-h-[44px] cursor-pointer transition-colors",
              active ? "text-[#C9FF32]" : "text-[#A4A69F]"
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
