import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  activeBorder?: "lime" | "lavender" | "blush" | "none";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, activeBorder = "none", children, ...props }, ref) => {
    const borderAccent = {
      none: "border-[#30332E]",
      lime: "border-[#C9FF32]/60 shadow-[0_0_24px_rgba(201,255,50,0.08)]",
      lavender: "border-[#C8A6FF]/60 shadow-[0_0_24px_rgba(200,166,255,0.08)]",
      blush: "border-[#F5AFCF]/60 shadow-[0_0_24px_rgba(245,175,207,0.08)]",
    }[activeBorder];

    return (
      <div
        ref={ref}
        className={cn(
          "bg-[#171817] rounded-3xl border transition-all duration-200 relative overflow-hidden",
          borderAccent,
          hoverEffect && "hover:bg-[#202220] hover:border-[#30332E]/90 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
