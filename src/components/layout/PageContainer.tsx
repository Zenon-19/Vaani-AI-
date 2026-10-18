import React from "react";
import { cn } from "../../lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "default" | "wide" | "narrow" | "full";
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  maxWidth = "default",
}) => {
  const widthClasses = {
    narrow: "max-w-4xl",
    default: "max-w-6xl", // ~1200px
    wide: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-5 sm:px-8 lg:px-12 py-6 sm:py-8 md:py-10 pb-24 md:pb-12",
        widthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
};
