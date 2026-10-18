import React from "react";

interface VaaniLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const VaaniLogo: React.FC<VaaniLogoProps> = ({
  className = "",
  iconOnly = false,
  size = "md",
}) => {
  const sizeMap = {
    sm: "h-6 w-6 text-sm",
    md: "h-8 w-8 text-base",
    lg: "h-10 w-10 text-xl",
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-[#F1F0E9] ${className}`}>
      {/* Orb Icon Mark */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-[#111311] border border-[#30332E] shadow-[0_0_15px_rgba(201,255,50,0.12)] shrink-0 overflow-hidden ${
          size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(201,255,50,0.35),rgba(200,166,255,0.2),transparent_70%)]" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`relative z-10 text-[#C9FF32] ${
            size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
          }`}
        >
          {/* Audio voice waves in circular harmony */}
          <path d="M12 2v20" />
          <path d="M17 6v12" />
          <path d="M7 6v12" />
          <path d="M21 10v4" />
          <path d="M3 10v4" />
        </svg>
      </div>

      {!iconOnly && (
        <span className="font-semibold tracking-tight text-[#F1F0E9] whitespace-nowrap">
          Vaani <span className="text-[#C9FF32] font-medium text-xs ml-1 px-1.5 py-0.5 rounded bg-[#C9FF32]/10 border border-[#C9FF32]/25">AI</span>
        </span>
      )}
    </div>
  );
};
