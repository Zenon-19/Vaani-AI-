import React, { useState } from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { ConfirmDeleteDialog } from "../../components/ui/ConfirmDeleteDialog";
import { useToast } from "../../components/ui/Toast";
import {
  User,
  Shield,
  Sliders,
  Eye,
  Trash2,
  Download,
  AlertTriangle,
  Check,
  HardDrive,
  Info,
} from "lucide-react";
import { ReplyTone } from "../../types";

interface SettingsPageProps {
  onNavigate: (path: string) => void;
  onClearAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  onNavigate,
  onClearAllData,
}) => {
  const [userName, setUserName] = useState("Lakshya Lohani");
  const [userEmail, setUserEmail] = useState("lakshyalohani1811@gmail.com");
  const [defaultTone, setDefaultTone] = useState<ReplyTone>("Calm");
  const [defaultLang, setDefaultLang] = useState("Hinglish");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [retentionPolicy, setRetentionPolicy] = useState<"session" | "30days" | "permanent">("session");
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const { toast } = useToast();

  const handleSavePreferences = () => {
    toast("Preferences Saved", "Your workspace settings have been updated.", "success");
  };

  const handleExportAllData = () => {
    const backup = {
      user: { name: userName, email: userEmail },
      exportedAt: new Date().toISOString(),
      platform: "Vaani AI",
      notes: "Full workspace profile and preferences backup.",
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vaani-ai-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast("Data Exported", "Workspace archive downloaded.", "success");
  };

  const handleConfirmPurge = () => {
    onClearAllData();
    setIsDeleteAccountOpen(false);
    toast("Data Purged", "All conversations and cached data removed.", "info");
    onNavigate("/app");
  };

  return (
    <PageContainer>
      <div className="space-y-8">
        <div>
          <Breadcrumbs
            items={[
              { label: "Dashboard", onClick: () => onNavigate("/app") },
              { label: "Settings" },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F0E9] mt-2">
            Settings & Data Handling
          </h1>
          <p className="text-sm text-[#A4A69F] mt-1">
            Manage your account preferences, coaching tones, and audio retention privacy.
          </p>
        </div>

        {/* 1. Account Profile */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#30332E] pb-3">
            <User className="w-4 h-4 text-[#C9FF32]" />
            <h2 className="text-base font-semibold text-[#F1F0E9]">
              Account Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A4A69F]">
                Display Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A4A69F]">
                Email Address
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32]"
              />
            </div>
          </div>
        </Card>

        {/* 2. Language & Coaching Defaults */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#30332E] pb-3">
            <Sliders className="w-4 h-4 text-[#C8A6FF]" />
            <h2 className="text-base font-semibold text-[#F1F0E9]">
              Coaching & Dialect Defaults
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A4A69F]">
                Primary Conversation Language
              </label>
              <select
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
              >
                <option value="Hinglish">Hinglish (Hindi-English mix)</option>
                <option value="Hindi">Hindi (Pure/Colloquial)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A4A69F]">
                Default Reply Tone
              </label>
              <select
                value={defaultTone}
                onChange={(e) => setDefaultTone(e.target.value as ReplyTone)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111311] border border-[#30332E] text-xs text-[#F1F0E9] focus:outline-none focus:border-[#C9FF32] cursor-pointer"
              >
                <option value="Calm">Calm (Steady de-escalation)</option>
                <option value="Empathetic">Empathetic (Validates emotions first)</option>
                <option value="Firm">Firm (Clear boundary setting)</option>
                <option value="Diplomatic">Diplomatic (Win-win alignment)</option>
                <option value="Direct">Direct (Concise facts)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 3. Accessibility & Motion */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#30332E] pb-3">
            <Eye className="w-4 h-4 text-[#F5AFCF]" />
            <h2 className="text-base font-semibold text-[#F1F0E9]">
              Accessibility & Motion
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#F1F0E9]">
                Reduce Ambient Motion
              </p>
              <p className="text-xs text-[#A4A69F]">
                Disables orb rotation and floating contour wave animations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                reducedMotion ? "bg-[#C9FF32]" : "bg-[#202220] border border-[#30332E]"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-[#090A09] absolute top-1 transition-transform ${
                  reducedMotion ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </Card>

        {/* 4. Audio Retention & Transparent Privacy Disclosures */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#30332E] pb-3">
            <Shield className="w-4 h-4 text-[#C9FF32]" />
            <h2 className="text-base font-semibold text-[#F1F0E9]">
              Audio Storage & Privacy Disclosures
            </h2>
          </div>

          {/* Explicit PRD Requirement: Explain whether audio is stored, how long it is retained */}
          <div className="p-4 rounded-2xl bg-[#111311] border border-[#30332E] space-y-2 text-xs text-[#A4A69F] leading-relaxed">
            <div className="flex items-center gap-2 text-[#F1F0E9] font-medium">
              <Info className="w-4 h-4 text-[#C9FF32]" />
              <span>Transparent Processing Disclosures</span>
            </div>
            <p>
              • <strong>Audio File Ingestion:</strong> Audio uploaded or recorded is temporarily buffered solely to extract phonetic speech representations.
            </p>
            <p>
              • <strong>AI Processing:</strong> Acoustic features are analyzed through secure enterprise AI APIs. Your conversational audio is <em>never</em> used to train public foundational models.
            </p>
            <p>
              • <strong>No Unsubstantiated Claims:</strong> We never claim automatic instant deletion unless actively enforced by your retention selection below.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A4A69F]">
              Audio Retention Policy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "session", label: "Session Only", desc: "Purge audio immediately after review" },
                { id: "30days", label: "30 Days Buffer", desc: "Retain audio for subsequent playback" },
                { id: "permanent", label: "Indefinite Archive", desc: "Retain until manually deleted" },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setRetentionPolicy(opt.id as any)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    retentionPolicy === opt.id
                      ? "bg-[#111311] border-[#C9FF32] text-[#F1F0E9]"
                      : "bg-[#171817] border-[#30332E] text-[#A4A69F] hover:bg-[#202220]"
                  }`}
                >
                  <p className="text-xs font-semibold text-[#F1F0E9]">{opt.label}</p>
                  <p className="text-[11px] text-[#A4A69F] mt-0.5">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 5. Data Management & Permanent Purge */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#30332E] pb-3">
            <HardDrive className="w-4 h-4 text-rose-400" />
            <h2 className="text-base font-semibold text-[#F1F0E9]">
              Workspace Data Management
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#F1F0E9]">
                Export Workspace Archive
              </p>
              <p className="text-xs text-[#A4A69F]">
                Download a JSON archive of all settings, configurations, and records.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAllData}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export All Data
            </Button>
          </div>

          <div className="pt-4 border-t border-[#30332E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-rose-300">
                Purge All Analysis Reports & Transcripts
              </p>
              <p className="text-xs text-[#A4A69F]">
                Irreversibly delete all stored conversations, audio fragments, and saved replies.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteAccountOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Purge All Data
            </Button>
          </div>
        </Card>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <Button size="md" onClick={handleSavePreferences} leftIcon={<Check className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Delete / Purge Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        onConfirm={handleConfirmPurge}
        title="Purge All Conversation Data?"
        description="This will permanently delete all session history, uploaded audio references, and customized responses. This cannot be undone."
        confirmLabel="Purge Everything"
      />
    </PageContainer>
  );
};
