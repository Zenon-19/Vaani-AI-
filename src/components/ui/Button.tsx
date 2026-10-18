import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "lavender" | "blush";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9FF32] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A09] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-xl gap-1.5 min-h-[36px]",
      md: "h-11 px-5 text-sm rounded-xl gap-2 min-h-[44px]",
      lg: "h-13 px-7 text-base rounded-2xl gap-2.5 min-h-[52px]", // Primary button height 48–56px
      icon: "h-10 w-10 p-0 rounded-xl justify-center min-h-[40px] min-w-[40px]",
    };

    const variantStyles = {
      primary:
        "bg-[#C9FF32] text-[#090A09] font-semibold hover:bg-[#d5ff57] shadow-[0_0_20px_rgba(201,255,50,0.2)] active:bg-[#b5f01e]",
      secondary:
        "bg-[#171817] text-[#F1F0E9] border border-[#30332E] hover:bg-[#202220] hover:border-[#A4A69F]/30",
      outline:
        "bg-transparent text-[#F1F0E9] border border-[#30332E] hover:border-[#C9FF32]/50 hover:bg-[#111311]",
      ghost:
        "bg-transparent text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#171817]",
      danger:
        "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25",
      lavender:
        "bg-[#C8A6FF]/15 text-[#C8A6FF] border border-[#C8A6FF]/30 hover:bg-[#C8A6FF]/25",
      blush:
        "bg-[#F5AFCF]/15 text-[#F5AFCF] border border-[#F5AFCF]/30 hover:bg-[#F5AFCF]/25",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        <span className="whitespace-nowrap">{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
