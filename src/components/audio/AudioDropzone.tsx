import React, { useRef, useState } from "react";
import { UploadCloud, FileAudio, X, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";

interface AudioDropzoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string | null;
}

export const AudioDropzone: React.FC<AudioDropzoneProps> = ({
  selectedFile,
  onFileSelect,
  error,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg"];
  const maxSizeBytes = 50 * 1024 * 1024; // 50MB

  const validateAndSetFile = (file: File) => {
    if (file.size > maxSizeBytes) {
      alert("File exceeds maximum size limit of 50MB.");
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
          }
        }}
      />

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-3xl transition-all duration-200 cursor-pointer text-center ${
            isDragOver
              ? "border-[#C9FF32] bg-[#C9FF32]/5"
              : error
              ? "border-rose-500/50 bg-rose-950/10"
              : "border-[#30332E] hover:border-[#C9FF32]/50 bg-[#171817]/60 hover:bg-[#171817]"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#111311] border border-[#30332E] flex items-center justify-center text-[#C9FF32] mb-4 shadow-[0_0_15px_rgba(201,255,50,0.1)]">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-semibold text-[#F1F0E9] mb-1">
            Drag and drop your audio recording
          </h3>
          <p className="text-xs text-[#A4A69F] max-w-sm mb-4">
            Supports MP3, WAV, M4A, or AAC up to 50MB. Hinglish, Hindi, and English are auto-detected.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose Audio File
          </Button>

          <div className="flex items-center gap-2 mt-5 text-[11px] text-[#A4A69F]/80">
            <span>Client confidentiality preserved</span>
            <span aria-hidden="true">·</span>
            <span>Zero public exposure</span>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-[#171817] border border-[#30332E] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#C9FF32]/10 border border-[#C9FF32]/30 flex items-center justify-center text-[#C9FF32] shrink-0">
              <FileAudio className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F1F0E9] truncate">
                {selectedFile.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#A4A69F] mt-0.5">
                <span>{formatFileSize(selectedFile.size)}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#C9FF32]">Ready for review</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onFileSelect(null)}
              className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/30"
              leftIcon={<X className="w-4 h-4" />}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 px-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
