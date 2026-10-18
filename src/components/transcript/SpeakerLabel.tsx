import React, { useState } from "react";
import { Edit2, Check } from "lucide-react";

interface SpeakerLabelProps {
  speakerId: string;
  name: string;
  onRename?: (newName: string) => void;
  colorScheme?: "lavender" | "blush" | "lime" | "ivory";
}

export const SpeakerLabel: React.FC<SpeakerLabelProps> = ({
  speakerId,
  name,
  onRename,
  colorScheme = "lavender",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);

  const colors = {
    lavender: "text-[#C8A6FF] bg-[#C8A6FF]/10 border-[#C8A6FF]/25",
    blush: "text-[#F5AFCF] bg-[#F5AFCF]/10 border-[#F5AFCF]/25",
    lime: "text-[#C9FF32] bg-[#C9FF32]/10 border-[#C9FF32]/25",
    ivory: "text-[#F1F0E9] bg-[#F1F0E9]/10 border-[#F1F0E9]/25",
  }[colorScheme];

  const handleSave = () => {
    if (editValue.trim() && onRename) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-[#111311] px-2 py-0.5 rounded-lg border border-[#C9FF32]">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setIsEditing(false);
          }}
          autoFocus
          className="bg-transparent text-xs text-[#F1F0E9] focus:outline-none w-28"
        />
        <button
          onClick={handleSave}
          className="text-[#C9FF32] hover:text-[#d5ff57] cursor-pointer"
          title="Save speaker name"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 group">
      <span
        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${colors}`}
      >
        {name}
      </span>
      {onRename && (
        <button
          onClick={() => {
            setEditValue(name);
            setIsEditing(true);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#A4A69F] hover:text-[#F1F0E9] p-0.5 cursor-pointer"
          title="Rename speaker"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
