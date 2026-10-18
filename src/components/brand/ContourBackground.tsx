import React from "react";

interface ContourBackgroundProps {
  glowPosition?: "top" | "center" | "right";
  className?: string;
  showOrbs?: boolean;
}

export const ContourBackground: React.FC<ContourBackgroundProps> = ({
  glowPosition = "top",
  className = "",
  showOrbs = false,
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none -z-10 ${className}`}>
      {/* Topographic organic curves */}
      <svg
        className="absolute w-full h-full opacity-20"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-100 200 C 300 280, 500 50, 900 220 C 1300 390, 1500 120, 1600 240"
          stroke="#C9FF32"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.3"
        />
        <path
          d="M-50 320 C 350 400, 600 160, 950 340 C 1350 510, 1450 240, 1650 360"
          stroke="#C8A6FF"
          strokeWidth="1"
          opacity="0.25"
        />
        <path
          d="M-120 460 C 280 540, 550 300, 920 470 C 1300 640, 1420 380, 1620 500"
          stroke="#F1F0E9"
          strokeWidth="0.75"
          strokeDasharray="2 4"
          opacity="0.15"
        />
        <path
          d="M-80 600 C 320 680, 620 440, 980 610 C 1340 780, 1480 520, 1680 640"
          stroke="#F5AFCF"
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>

      {/* Atmospheric radial gradient spotlight */}
      {glowPosition === "top" && (
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(201,255,50,0.12)_0%,rgba(200,166,255,0.05)_45%,transparent_70%)] filter blur-3xl" />
      )}

      {glowPosition === "right" && (
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_right,rgba(201,255,50,0.08)_0%,rgba(200,166,255,0.04)_50%,transparent_75%)] filter blur-3xl" />
      )}

      {glowPosition === "center" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(201,255,50,0.09)_0%,rgba(200,166,255,0.04)_40%,transparent_70%)] filter blur-3xl" />
      )}

      {showOrbs && (
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(245,175,207,0.05)_0%,transparent_70%)] filter blur-2xl" />
      )}
    </div>
  );
};
