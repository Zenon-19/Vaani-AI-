import React, { useState } from "react";
import { Play, Trash2, Edit3, Check, Flag } from "lucide-react";
import { TranscriptSegment as TranscriptSegmentType } from "../../types";
import { SpeakerLabel } from "./SpeakerLabel";
import { formatTime } from "../../lib/utils";

interface TranscriptSegmentProps {
  segment: TranscriptSegmentType;
  isActive?: boolean;
  searchQuery?: string;
  onUpdateText: (id: string, newText: string) => void;
  onUpdateSpeaker: (id: string, newSpeakerName: string) => void;
  onDelete?: (id: string) => void;
  onJumpToTime?: (seconds: number) => void;
}

export const TranscriptSegment: React.FC<TranscriptSegmentProps> = ({
  segment,
  isActive = false,
  searchQuery = "",
  onUpdateText,
  onUpdateSpeaker,
  onDelete,
  onJumpToTime,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(segment.text);

  const handleSaveText = () => {
    onUpdateText(segment.id, editText);
    setIsEditing(false);
  };

  // Determine speaker color
  const colorScheme =
    segment.speakerId === "spk-1"
      ? "lavender"
      : segment.speakerId === "spk-2"
      ? "blush"
      : "lime";

  // Search highlighting
  const renderHighlightedText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-[#C9FF32]/30 text-[#C9FF32] rounded px-0.5 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      id={`segment-${segment.id}`}
      className={`p-4 rounded-2xl border transition-all duration-150 group ${
        isActive
          ? "bg-[#171817] border-[#C9FF32] shadow-[0_0_15px_rgba(201,255,50,0.08)]"
          : "bg-[#111311] border-[#30332E]/80 hover:border-[#30332E] hover:bg-[#171817]/70"
      }`}
    >
      {/* Top Header of Segment */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <SpeakerLabel
            speakerId={segment.speakerId}
            name={segment.speakerName}
            colorScheme={colorScheme}
            onRename={(newName) => onUpdateSpeaker(segment.id, newName)}
          />

          {segment.startTime !== undefined && (
            <button
              onClick={() => onJumpToTime?.(segment.startTime || 0)}
              className="inline-flex items-center gap-1 font-mono text-[11px] text-[#A4A69F] hover:text-[#C9FF32] transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-[#171817]"
              title="Jump audio to this timestamp"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>{formatTime(segment.startTime)}</span>
            </button>
          )}

          {segment.confidence && (
            <span className="text-[10px] font-mono text-[#A4A69F]/60">
              {Math.round(segment.confidence * 100)}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing ? (
            <button
              onClick={() => {
                setEditText(segment.text);
                setIsEditing(true);
              }}
              className="p-1 rounded text-[#A4A69F] hover:text-[#F1F0E9] hover:bg-[#202220] transition-colors cursor-pointer"
              title="Edit segment text"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSaveText}
              className="p-1 rounded text-[#C9FF32] hover:bg-[#C9FF32]/10 transition-colors cursor-pointer"
              title="Save changes"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(segment.id)}
              className="p-1 rounded text-[#A4A69F] hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
              title="Delete segment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Segment Text Content */}
      {isEditing ? (
        <div className="space-y-2 mt-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2.5 text-sm bg-[#090A09] border border-[#C9FF32]/50 rounded-xl text-[#F1F0E9] focus:outline-none leading-relaxed"
            rows={3}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 text-xs text-[#A4A69F] hover:text-[#F1F0E9]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveText}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#C9FF32] text-[#090A09]"
            >
              Save Segment
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#F1F0E9] leading-relaxed">
          {renderHighlightedText(segment.text)}
        </p>
      )}
    </div>
  );
};
