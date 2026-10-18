import React from "react";
import { FolderSearch, Plus } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#30332E] rounded-3xl bg-[#111311]/50 my-6">
      <div className="w-14 h-14 rounded-2xl bg-[#171817] border border-[#30332E] flex items-center justify-center text-[#A4A69F] mb-4">
        {icon || <FolderSearch className="w-7 h-7 text-[#C9FF32]/80" />}
      </div>
      <h3 className="text-lg font-semibold text-[#F1F0E9] mb-1">{title}</h3>
      <p className="text-sm text-[#A4A69F] max-w-md leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} leftIcon={<Plus className="w-4 h-4" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
