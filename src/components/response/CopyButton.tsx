import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "../../lib/utils";
import { useToast } from "../ui/Toast";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = "Copy",
  className = "",
  size = "sm",
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      toast("Copied to clipboard", "Response text is ready to paste.", "success");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast("Copy failed", "Please copy the text manually.", "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 cursor-pointer ${
        copied
          ? "bg-[#C9FF32]/10 border-[#C9FF32] text-[#C9FF32]"
          : "bg-[#171817] border-[#30332E] text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#202220]"
      } ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#C9FF32]" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
