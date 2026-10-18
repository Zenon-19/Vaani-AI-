import React from "react";

interface VoiceOrbProps {
  size?: "sm" | "md" | "lg" | "hero";
  state?: "idle" | "listening" | "processing" | "analyzing";
  className?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  size = "md",
  state = "idle",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-44 h-44",
    hero: "w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96",
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      aria-label={`Voice orb (${state})`}
      role="img"
    >
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,255,50,0.18),rgba(200,166,255,0.08),transparent_72%)] filter blur-xl pointer-events-none transform scale-110" />

      {/* Topographic contour outer ring 1 */}
      <div className="absolute inset-[-14%] rounded-full border border-[#C9FF32]/10 pointer-events-none animate-[spin_40s_linear_infinite]" />
      
      {/* Topographic contour outer ring 2 (elliptical) */}
      <div className="absolute inset-[-6%] rounded-full border border-[#C8A6FF]/15 pointer-events-none animate-[spin_28s_linear_infinite_reverse]" />

      {/* Main 3D Spherical Orb body */}
      <div className="relative w-full h-full rounded-full overflow-hidden border border-[#30332E]/80 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_0_24px_rgba(201,255,50,0.2)] bg-[#111311]">
        {/* Layer 1: Base deep space gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,#1c2215_0%,#090A09_70%)]" />

        {/* Layer 2: Electric lime atmospheric core */}
        <div
          className={`absolute inset-[-20%] rounded-full opacity-65 mix-blend-screen filter blur-md transition-transform duration-1000 ${
            state === "listening" || state === "processing"
              ? "animate-[spin_10s_linear_infinite] scale-110"
              : "animate-[spin_24s_linear_infinite]"
          }`}
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, #C9FF32 0deg, rgba(200,166,255,0.8) 120deg, rgba(245,175,207,0.7) 220deg, #C9FF32 360deg)",
          }}
        />

        {/* Layer 3: Organic floating plasma blob */}
        <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_40%_30%,rgba(201,255,50,0.65)_0%,rgba(200,166,255,0.3)_45%,transparent_80%)] filter blur-sm" />

        {/* Layer 4: Topographic contour lines etched across sphere */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 mix-blend-overlay pointer-events-none animate-[spin_60s_linear_infinite]"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle cx="50" cy="50" r="42" stroke="#F1F0E9" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="34" stroke="#C9FF32" strokeWidth="0.6" />
          <circle cx="50" cy="50" r="24" stroke="#F1F0E9" strokeWidth="0.5" strokeDasharray="2 4" />
          <ellipse cx="48" cy="50" rx="36" ry="18" stroke="#C8A6FF" strokeWidth="0.5" />
          <ellipse cx="52" cy="50" rx="16" ry="38" stroke="#F5AFCF" strokeWidth="0.4" />
        </svg>

        {/* Layer 5: Specular rim light reflection */}
        <div className="absolute top-2 left-3 w-2/5 h-2/5 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.4)_0%,transparent_60%)] filter blur-[2px]" />

        {/* Ambient bottom shadow to enhance spherical depth */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>

      {/* Center dynamic pulse when active */}
      {state !== "idle" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1/3 h-1/3 rounded-full bg-[#C9FF32]/25 animate-ping" />
        </div>
      )}
    </div>
  );
};
