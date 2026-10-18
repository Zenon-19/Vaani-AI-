import React from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ContourBackground } from "../../components/brand/ContourBackground";
import { VaaniLogo } from "../../components/brand/VaaniLogo";
import { Shield, Lock, EyeOff, FileText, ArrowLeft, ArrowRight } from "lucide-react";

interface PrivacyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#090A09] text-[#F1F0E9] flex flex-col relative">
      <ContourBackground glowPosition="top" />

      {/* Header */}
      <header className="h-16 px-6 sm:px-12 border-b border-[#30332E]/60 bg-[#090A09]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-8">
        <button
          onClick={() => onNavigate("/")}
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9FF32] rounded-lg"
        >
          <VaaniLogo />
        </button>

        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate("/app")}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <PageContainer maxWidth="default">
        <div className="space-y-8 pt-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C9FF32] uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Trust & Privacy Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F1F0E9] mt-2">
              Privacy, Audio Retention & Data Security
            </h1>
            <p className="text-sm text-[#A4A69F] mt-1">
              Clear commitments on how your voice, transcripts, and conversations are handled.
            </p>
          </div>

          <Card className="p-6 sm:p-8 space-y-6 leading-relaxed text-sm text-[#A4A69F]">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-[#F1F0E9] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C9FF32]" />
                1. Private by Default — No Public Report Exposure
              </h2>
              <p>
                Conversations uploaded to Vaani AI are private to your authenticated workspace session. We do not generate indexable public URLs or share your transcripts with third parties.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-[#30332E]/60">
              <h2 className="text-base font-bold text-[#F1F0E9] flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-[#C8A6FF]" />
                2. No Training on Your Confidential Recordings
              </h2>
              <p>
                Your voice audio files and transcript text are strictly processed via transient API inferences. Your spoken data is never harvested or incorporated into public foundation models.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-[#30332E]/60">
              <h2 className="text-base font-bold text-[#F1F0E9] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F5AFCF]" />
                3. Consent & Recording Ethics
              </h2>
              <p>
                In compliance with recording regulations, users must obtain consent from all participating parties before recording in-person or remote conversations. Vaani AI is designed for mutual clarity, conflict resolution, and communication coaching.
              </p>
            </section>

            <section className="space-y-2 pt-4 border-t border-[#30332E]/60">
              <h2 className="text-base font-bold text-[#F1F0E9]">
                4. Permanent Data Erasure & Export Rights
              </h2>
              <p>
                You have full control over your conversation history. You can export complete structured JSON records or execute a permanent workspace purge from the Settings panel at any time.
              </p>
            </section>
          </Card>

          <div className="flex justify-between items-center pt-4">
            <Button variant="ghost" onClick={() => onNavigate("/app")}>
              Return to App
            </Button>
            <Button onClick={() => onNavigate("/app/new")} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start an Analysis
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
