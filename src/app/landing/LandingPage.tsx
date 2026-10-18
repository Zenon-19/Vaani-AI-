import React, { useState } from "react";
import { VaaniLogo } from "../../components/brand/VaaniLogo";
import { VoiceOrb } from "../../components/brand/VoiceOrb";
import { ContourBackground } from "../../components/brand/ContourBackground";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import {
  ArrowRight,
  CheckCircle2,
  Scale,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Quote,
  Mic,
  FileText,
  MessageSquare,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does Vaani AI accurately handle Hinglish conversations?",
      a: "Standard voice models struggle with code-switching between Hindi colloquial expressions and English professional terminology. Vaani's acoustic and linguistic pipeline is specially calibrated for Indian conversational patterns, distinguishing context like 'dekh lenge' or 'jugaad' without distorting conversational intent.",
    },
    {
      q: "Does Vaani AI declare a 'winner' in every argument?",
      a: "Never. Vaani AI follows an evidence-first principle: we evaluate specific claims against what was actually spoken. If the evidence is insufficient or missing context, the system transparently identifies the question as unresolved rather than forcing an arbitrary winner.",
    },
    {
      q: "Is my conversational audio private and secure?",
      a: "Yes. We treat conversational transcripts and audio with strict privacy. Your recordings are not used for public model training, and private reports are never exposed through indexable public URLs. You maintain complete control to export or permanently purge data anytime.",
    },
    {
      q: "Can I edit the transcript before running the analysis?",
      a: "Absolutely. In fact, we strongly recommend it. You can review acoustic confidence, rename speaker labels, fix technical jargon or names, and ensure the transcript reflects ground truth before analysis is generated.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090A09] text-[#F1F0E9] relative selection:bg-[#C9FF32]/20 selection:text-[#C9FF32] flex flex-col">
      <ContourBackground glowPosition="top" showOrbs />

      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (1 Primary Action) */}
      <header className="h-20 px-6 sm:px-12 border-b border-[#30332E]/60 bg-[#090A09]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate("/")}
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9FF32] rounded-lg"
        >
          <VaaniLogo />
        </button>

        {/* Zone 2: 4-5 single-line clean text links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A4A69F]">
          <button
            onClick={() => onNavigate("/how-it-works")}
            className="hover:text-[#F1F0E9] transition-colors whitespace-nowrap cursor-pointer"
          >
            How It Works
          </button>
          <a
            href="#features"
            className="hover:text-[#F1F0E9] transition-colors whitespace-nowrap"
          >
            Capabilities
          </a>
          <a
            href="#sample-report"
            className="hover:text-[#F1F0E9] transition-colors whitespace-nowrap"
          >
            Sample Report
          </a>
          <button
            onClick={() => onNavigate("/privacy")}
            className="hover:text-[#F1F0E9] transition-colors whitespace-nowrap cursor-pointer"
          >
            Privacy
          </button>
          <a
            href="#faq"
            className="hover:text-[#F1F0E9] transition-colors whitespace-nowrap"
          >
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <Button
            size="md"
            onClick={() => onNavigate("/app/new")}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Analyze a conversation
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 pt-16 sm:pt-24 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        <div className="max-w-2xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9FF32] tracking-wide">
            <span>VOICE-FIRST HINGLISH CONVERSATION ANALYST</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F1F0E9] leading-[1.08] text-balance">
            Understand what really happened.
          </h1>

          <p className="text-lg sm:text-xl text-[#A4A69F] leading-relaxed max-w-xl">
            Analyze conversations, understand both sides, and find the right words to respond. Evidence-backed breakdowns for complex Hinglish dialogues.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => onNavigate("/app/new")}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="text-base"
            >
              Analyze a conversation
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate("/how-it-works")}
            >
              See how it works
            </Button>
          </div>

          {/* Social Proof & Adjacency */}
          <div className="pt-6 flex items-center gap-6 text-xs text-[#A4A69F]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C9FF32]" />
              <span>Evidence-linked claims</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C8A6FF]" />
              <span>Hinglish code-mixing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F5AFCF]" />
              <span>No clinical labeling</span>
            </div>
          </div>
        </div>

        {/* Hero Visual: 3D Animated Voice Orb */}
        <div className="relative flex items-center justify-center">
          <VoiceOrb size="hero" state="listening" />
        </div>
      </section>

      {/* Illustrative Product Preview Section */}
      <section id="sample-report" className="px-6 sm:px-12 py-16 bg-[#111311]/50 border-y border-[#30332E]/60">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-[#C9FF32] tracking-wider uppercase">
              Interactive Report Preview
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#F1F0E9] tracking-tight">
              See what an objective conversation breakdown looks like.
            </h2>
            <p className="text-sm text-[#A4A69F]">
              Inspect verified arguments, ground-truth transcript references, and context-aware responses.
            </p>
          </div>

          {/* Sample Report Card Preview */}
          <Card className="p-6 sm:p-8 space-y-6 border-[#30332E] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30332E] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#A4A69F]">
                  <span className="text-[#C9FF32] font-medium">Sprint Delivery Debate</span>
                  <span aria-hidden="true">·</span>
                  <span>Hinglish</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">Demo Case</span>
                </div>
                <h3 className="text-xl font-bold text-[#F1F0E9] mt-0.5">
                  Tech Retrospective: Eng Lead (Rohan) vs Product Manager (Priya)
                </h3>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigate("/app/analysis/rep-001/report")}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Explore Full Analysis Report
              </Button>
            </div>

            {/* Split Comparison Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#111311] border border-[#30332E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#C8A6FF]">
                    Rohan (Engineering Lead)
                  </span>
                  <span className="text-xs font-mono text-[#A4A69F]">52% Dialogue</span>
                </div>
                <div className="text-xs text-[#F1F0E9] space-y-1.5 leading-relaxed">
                  <p className="font-medium text-[#C9FF32]">Valid points identified:</p>
                  <p>• Correctly demonstrated Redis memory spike (OOM 137) from un-benchmarked async export.</p>
                  <p className="text-[#A4A69F] mt-2 italic">Examine excerpt: "Bhai jab PR #412 merge hui toh memory 1.8GB jump ho gayi thi..."</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#111311] border border-[#30332E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F5AFCF]">
                    Priya (Product Manager)
                  </span>
                  <span className="text-xs font-mono text-[#A4A69F]">48% Dialogue</span>
                </div>
                <div className="text-xs text-[#F1F0E9] space-y-1.5 leading-relaxed">
                  <p className="font-medium text-[#C9FF32]">Valid points identified:</p>
                  <p>• Substantive client SLA deadline with contractual $25,000 penalty clause.</p>
                  <p className="text-[#A4A69F] mt-2 italic">Examine excerpt: "Yeh enterprise client ke saath hamari quarterly commitment thi..."</p>
                </div>
              </div>
            </div>

            {/* Verdict & Suggested Reply Preview */}
            <div className="p-5 rounded-2xl bg-[#090A09] border border-[#30332E] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-[#C9FF32] uppercase tracking-wide">
                  Recommended De-Escalating Reply
                </span>
                <p className="text-xs sm:text-sm text-[#F1F0E9] italic leading-relaxed">
                  "Priya, I understand ki enterprise client ke penalties bohot critical hain. Main staging worker memory temporary double kar deta hoon so QA verification continue ho sake, aur kal subah PRD appendix tickets point kar lenge."
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => onNavigate("/app/response-studio")}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="shrink-0"
              >
                Open Response Studio
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Three-Step Explanation */}
      <section className="px-6 sm:px-12 py-20 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-semibold text-[#C9FF32] tracking-wider uppercase">
            Product Workflow
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold text-[#F1F0E9] tracking-tight">
            Three disciplined steps to conversational clarity.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C9FF32]/10 border border-[#C9FF32]/30 flex items-center justify-center text-[#C9FF32]">
              <Mic className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-[#A4A69F]">01. CAPTURE & TRANSCRIBE</div>
            <h3 className="text-lg font-bold text-[#F1F0E9]">
              Audio, Voice, or Text
            </h3>
            <p className="text-xs text-[#A4A69F] leading-relaxed">
              Upload recordings, record live with mic waveform, or paste raw notes. Review and edit the transcript before analysis to verify ground truth.
            </p>
          </Card>

          <Card className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C8A6FF]/10 border border-[#C8A6FF]/30 flex items-center justify-center text-[#C8A6FF]">
              <Scale className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-[#A4A69F]">02. UNBIASED EVIDENCE ANALYSIS</div>
            <h3 className="text-lg font-bold text-[#F1F0E9]">
              Inspect Claims & Friction
            </h3>
            <p className="text-xs text-[#A4A69F] leading-relaxed">
              See what was supported by facts vs assumptions. We evaluate logic, emotional triggers, and Hinglish nuances without binary judgment.
            </p>
          </Card>

          <Card className="p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5AFCF]/10 border border-[#F5AFCF]/30 flex items-center justify-center text-[#F5AFCF]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-[#A4A69F]">03. CALIBRATED COACHING</div>
            <h3 className="text-lg font-bold text-[#F1F0E9]">
              Find the Right Response
            </h3>
            <p className="text-xs text-[#A4A69F] leading-relaxed">
              Draft constructive replies in Calm, Empathetic, Firm, or Diplomatic tones in Hinglish or English to de-escalate tension.
            </p>
          </Card>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="px-6 sm:px-12 py-20 bg-[#111311]/40 border-t border-[#30332E]/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-semibold text-[#C9FF32] tracking-wider uppercase">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#F1F0E9] tracking-tight">
              Built for how Indian professionals and teams actually talk.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-[#171817] border border-[#30332E] space-y-3">
              <span className="text-xs font-semibold text-[#C9FF32]">
                Hinglish Fluency
              </span>
              <h4 className="text-base font-bold text-[#F1F0E9]">
                Code-Mixing Mastery
              </h4>
              <p className="text-xs text-[#A4A69F] leading-relaxed">
                Seamlessly parses rapid switches between Hindi idioms and English corporate vocabulary.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#171817] border border-[#30332E] space-y-3">
              <span className="text-xs font-semibold text-[#C8A6FF]">
                Transparent Reasoning
              </span>
              <h4 className="text-base font-bold text-[#F1F0E9]">
                Ground-Truth Evidence
              </h4>
              <p className="text-xs text-[#A4A69F] leading-relaxed">
                Every claim links back to exact transcript timestamps and verbatim quotes.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#171817] border border-[#30332E] space-y-3">
              <span className="text-xs font-semibold text-[#F5AFCF]">
                Dignified Psychology
              </span>
              <h4 className="text-base font-bold text-[#F1F0E9]">
                Zero Armchair Diagnosis
              </h4>
              <p className="text-xs text-[#A4A69F] leading-relaxed">
                We never call people toxic or narcissistic. We observe behavior and focus on resolving the issue.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#171817] border border-[#30332E] space-y-3">
              <span className="text-xs font-semibold text-[#C9FF32]">
                Strategic Voice
              </span>
              <h4 className="text-base font-bold text-[#F1F0E9]">
                Contextual Studio
              </h4>
              <p className="text-xs text-[#A4A69F] leading-relaxed">
                Calibrate boundary setting, empathetic apologies, or firm technical stances in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="px-6 sm:px-12 py-20 max-w-4xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#C9FF32] tracking-wider uppercase">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-bold text-[#F1F0E9] tracking-tight">
            Clear answers about data, accuracy, and fairness.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-semibold text-[#F1F0E9]">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#A4A69F] transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? "rotate-180 text-[#C9FF32]" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#A4A69F] leading-relaxed border-t border-[#30332E]/60 pt-4">
                  {faq.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-6 sm:px-12 py-16 max-w-5xl mx-auto w-full text-center">
        <Card className="p-10 sm:p-14 border-[#C9FF32]/40 bg-gradient-to-b from-[#171817] to-[#111311] space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F1F0E9] tracking-tight">
            Ready to bring clarity to tough conversations?
          </h2>
          <p className="text-sm text-[#A4A69F] max-w-md mx-auto">
            Upload an audio recording or paste any discussion transcript to get your objective analysis in under a minute.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate("/app/new")}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="text-base"
            >
              Analyze a conversation
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#30332E] py-8 px-6 sm:px-12 text-xs text-[#A4A69F] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <VaaniLogo iconOnly size="sm" />
          <span>Vaani AI © 2026 · Understand the conversation. See both sides. Respond better.</span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate("/how-it-works")}
            className="hover:text-[#F1F0E9] transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => onNavigate("/privacy")}
            className="hover:text-[#F1F0E9] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigate("/app")}
            className="text-[#C9FF32] hover:underline transition-colors cursor-pointer"
          >
            Go to App
          </button>
        </div>
      </footer>
    </div>
  );
};
