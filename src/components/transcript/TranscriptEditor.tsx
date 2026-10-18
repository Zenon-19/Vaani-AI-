import React, { useState, useMemo } from "react";
import { Plus, Download, ArrowLeft, ArrowRight, Save, Sparkles, Check } from "lucide-react";
import { TranscriptSegment as TranscriptSegmentType } from "../../types";
import { TranscriptSegment } from "./TranscriptSegment";
import { TranscriptSearch } from "./TranscriptSearch";
import { TranscriptQualityNotice } from "./TranscriptQualityNotice";
import { AudioPlayer } from "../audio/AudioPlayer";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useToast } from "../ui/Toast";

interface TranscriptEditorProps {
  title: string;
  onUpdateTitle: (newTitle: string) => void;
  segments: TranscriptSegmentType[];
  onUpdateSegments: (newSegments: TranscriptSegmentType[]) => void;
  durationSeconds?: number;
  audioUrl?: string;
  onBack: () => void;
  onContinueToAnalysis: () => void;
  onSaveDraft?: () => void;
}

export const TranscriptEditor: React.FC<TranscriptEditorProps> = ({
  title,
  onUpdateTitle,
  segments,
  onUpdateSegments,
  durationSeconds = 240,
  audioUrl,
  onBack,
  onContinueToAnalysis,
  onSaveDraft,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);
  const { toast } = useToast();

  // Find active segment based on audio time
  const activeSegmentId = useMemo(() => {
    if (currentTime <= 0) return null;
    const found = segments.find(
      (s) =>
        s.startTime !== undefined &&
        s.endTime !== undefined &&
        currentTime >= s.startTime &&
        currentTime <= s.endTime
    );
    return found ? found.id : null;
  }, [segments, currentTime]);

  // Filtered segments
  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter(
      (s) =>
        s.text.toLowerCase().includes(q) ||
        s.speakerName.toLowerCase().includes(q)
    );
  }, [segments, searchQuery]);

  // Speaker Stats Summary
  const speakerStats = useMemo(() => {
    const stats: Record<string, { name: string; count: number; words: number }> = {};
    segments.forEach((s) => {
      if (!stats[s.speakerId]) {
        stats[s.speakerId] = { name: s.speakerName, count: 0, words: 0 };
      }
      stats[s.speakerId].count += 1;
      stats[s.speakerId].words += s.text.trim().split(/\s+/).length;
    });
    const totalWords = Object.values(stats).reduce((acc, curr) => acc + curr.words, 0) || 1;
    return Object.entries(stats).map(([id, data]) => ({
      id,
      name: data.name,
      turns: data.count,
      words: data.words,
      percent: Math.round((data.words / totalWords) * 100),
    }));
  }, [segments]);

  const handleUpdateText = (id: string, newText: string) => {
    onUpdateSegments(
      segments.map((s) => (s.id === id ? { ...s, text: newText } : s))
    );
  };

  const handleUpdateSpeaker = (id: string, newName: string) => {
    const target = segments.find((s) => s.id === id);
    if (!target) return;
    const targetSpeakerId = target.speakerId;
    // Update all segments belonging to this speaker
    onUpdateSegments(
      segments.map((s) =>
        s.speakerId === targetSpeakerId ? { ...s, speakerName: newName } : s
      )
    );
    toast("Speaker Updated", `All turns renamed to ${newName}`, "info");
  };

  const handleDeleteSegment = (id: string) => {
    onUpdateSegments(segments.filter((s) => s.id !== id));
    toast("Segment Removed", "Transcript segment removed.", "info");
  };

  const handleAddSegment = () => {
    const lastSeg = segments[segments.length - 1];
    const newId = `seg-${Date.now()}`;
    const nextSpeaker = lastSeg?.speakerId === "spk-1" ? "spk-2" : "spk-1";
    const nextSpeakerName =
      speakerStats.find((s) => s.id === nextSpeaker)?.name ||
      (nextSpeaker === "spk-1" ? "Speaker 1" : "Speaker 2");

    const newSegment: TranscriptSegmentType = {
      id: newId,
      speakerId: nextSpeaker,
      speakerName: nextSpeakerName,
      startTime: lastSeg?.endTime ? lastSeg.endTime + 1 : 0,
      endTime: lastSeg?.endTime ? lastSeg.endTime + 15 : 15,
      text: "Type speaker words here...",
      confidence: 1.0,
    };
    onUpdateSegments([...segments, newSegment]);
  };

  const handleJumpToTime = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      onUpdateTitle(titleDraft.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="space-y-6">
      {/* Review Header Bar */}
      <div className="p-5 rounded-3xl bg-[#171817] border border-[#30332E] flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") setIsEditingTitle(false);
                }}
                className="text-lg font-bold bg-[#111311] border border-[#C9FF32] px-3 py-1 rounded-xl text-[#F1F0E9] focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="p-2 rounded-xl bg-[#C9FF32] text-[#090A09] cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h2 className="text-xl font-bold tracking-tight text-[#F1F0E9] truncate">
                {title}
              </h2>
              <button
                onClick={() => {
                  setTitleDraft(title);
                  setIsEditingTitle(true);
                }}
                className="opacity-0 group-hover:opacity-100 text-xs text-[#A4A69F] hover:text-[#C9FF32] transition-opacity cursor-pointer"
              >
                Rename
              </button>
            </div>
          )}
          <p className="text-xs text-[#A4A69F] mt-1">
            Review and correct any words before running the unbiased conversation analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onSaveDraft && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onSaveDraft();
                toast("Draft Saved", "Transcript edits preserved in session.", "success");
              }}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Draft
            </Button>
          )}

          <Button
            size="md"
            onClick={onContinueToAnalysis}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Analyze Conversation
          </Button>
        </div>
      </div>

      <TranscriptQualityNotice />

      {/* Main 65% / 35% Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 65% Transcript Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <TranscriptSearch
                value={searchQuery}
                onChange={setSearchQuery}
                matchesCount={filteredSegments.length}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddSegment}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Turn
            </Button>
          </div>

          {/* Segment List */}
          <div className="space-y-3">
            {filteredSegments.map((segment) => (
              <TranscriptSegment
                key={segment.id}
                segment={segment}
                isActive={activeSegmentId === segment.id}
                searchQuery={searchQuery}
                onUpdateText={handleUpdateText}
                onUpdateSpeaker={handleUpdateSpeaker}
                onDelete={handleDeleteSegment}
                onJumpToTime={handleJumpToTime}
              />
            ))}

            {filteredSegments.length === 0 && (
              <div className="p-8 text-center border border-dashed border-[#30332E] rounded-3xl text-sm text-[#A4A69F]">
                No transcript segments matched your search "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 35% Audio Player & Speaker Breakdown */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-[#A4A69F]">
              Audio Reference
            </h3>
            <AudioPlayer
              durationSeconds={durationSeconds}
              audioUrl={audioUrl}
              onTimeUpdate={(time) => setCurrentTime(time)}
            />
          </div>

          {/* Speaker Balance Card */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[#F1F0E9]">Speaking Balance</h4>
              <span className="text-xs text-[#A4A69F] font-mono tabular-nums">
                {segments.length} total turns
              </span>
            </div>

            <div className="space-y-3">
              {speakerStats.map((spk, idx) => (
                <div key={spk.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F1F0E9] truncate max-w-[150px]">
                      {spk.name}
                    </span>
                    <span className="font-mono text-[#A4A69F]">
                      {spk.percent}% ({spk.words} words)
                    </span>
                  </div>
                  {/* Progress track */}
                  <div className="h-1.5 w-full bg-[#111311] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${spk.percent}%`,
                        backgroundColor:
                          idx === 0 ? "#C8A6FF" : idx === 1 ? "#F5AFCF" : "#C9FF32",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#30332E] text-xs text-[#A4A69F] leading-relaxed">
              Transcript corrections here will directly feed into the objective reasoning models.
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[#30332E] flex items-center justify-between">
        <Button
          variant="ghost"
          size="md"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Input
        </Button>

        <Button
          size="lg"
          onClick={onContinueToAnalysis}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Analyze Conversation
        </Button>
      </div>
    </div>
  );
};
