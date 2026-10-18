import React from "react";
import { PageContainer } from "../../components/layout/PageContainer";
import { Breadcrumbs } from "../../components/layout/Breadcrumbs";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ContourBackground } from "../../components/brand/ContourBackground";
import { VaaniLogo } from "../../components/brand/VaaniLogo";
import {
  Mic,
  Scale,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface HowItWorksPageProps {
  onNavigate: (path: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
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

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A4A69F]">
          <button
            onClick={() => onNavigate("/how-it-works")}
            className="text-[#F1F0E9] font-semibold whitespace-nowrap cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate("/privacy")}
            className="hover:text-[#F1F0E9] transition-colors whitespace-nowrap cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={() => onNavigate("/app")}
            className="hover:text-[#F1F0E9] transition-colors whitespace-nowrap cursor-pointer"
          >
            Dashboard
          </button>
        </nav>

        <Button
          size="sm"
          onClick={() => onNavigate("/app/new")}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Analyze conversation
        </Button>
      </header>

      <PageContainer maxWidth="default">
        <div className="space-y-12">
          {/* Hero */}
          <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
            <span className="text-xs font-semibold text-[#C9FF32] uppercase tracking-wider">
              Engineering & Methodology
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F1F0E9]">
              How Vaani AI Analyzes Conversations
            </h1>
            <p className="text-sm sm:text-base text-[#A4A69F] leading-relaxed">
              Understand the conversation. See both sides. Respond better. Built on grounded transcript evidence and non-violent communication principles.
            </p>
          </div>

          {/* Principle 1: Fairness First */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C9FF32]">
              <Scale className="w-5 h-5" />
              <h2 className="text-lg font-bold text-[#F1F0E9]">
                01. Fairness First: Symmetric Evaluation Standards
              </h2>
            </div>
            <p className="text-sm text-[#A4A69F] leading-relaxed">
              Traditional AI summaries tend to reward the speaker who speaks more assertively or uses cleaner English syntax. Vaani AI enforces equal analytical rigor across all participants, separating volume from validity, and rhetoric from factual substantiation.
            </p>
          </Card>

          {/* Principle 2: Evidence Over Assumptions */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#C8A6FF]">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-lg font-bold text-[#F1F0E9]">
                02. Evidence Over Assumptions: Exact Transcript Anchoring
              </h2>
            </div>
            <p className="text-sm text-[#A4A69F] leading-relaxed">
              Every judgment, argument breakdown, and communication friction alert is traceable to exact timestamps in the dialogue. If an assertion cannot be proven from the spoken recording, our models classify it as <span className="text-[#C8A6FF] font-semibold">Unsubstantiated</span> or <span className="text-amber-400 font-semibold">Uncertain</span> rather than hallucinating intent.
            </p>
          </Card>

          {/* Principle 3: Dignified Psychology */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#F5AFCF]">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-lg font-bold text-[#F1F0E9]">
                03. Human-Centered Coaching: Zero Armchair Diagnoses
              </h2>
            </div>
            <p className="text-sm text-[#A4A69F] leading-relaxed">
              We strictly reject pseudo-psychological labelling. Vaani AI will never declare someone "toxic", "narcissistic", or "manipulative" based on a single conversation. Instead, we describe specific observed behaviors (e.g. conversational interruptions, unsourced estimates, ambiguous timelines) and provide constructive communication remedies.
            </p>
          </Card>

          {/* CTA Box */}
          <div className="p-8 rounded-3xl bg-[#111311] border border-[#30332E] text-center space-y-4">
            <h3 className="text-xl font-bold text-[#F1F0E9]">
              Experience an objective breakdown yourself
            </h3>
            <p className="text-xs text-[#A4A69F] max-w-md mx-auto">
              Test with our curated Hinglish sample retrospectives or upload your own dialogue.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => onNavigate("/app/new")}>
                Start New Analysis
              </Button>
              <Button variant="outline" onClick={() => onNavigate("/app")}>
                Open Dashboard
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
