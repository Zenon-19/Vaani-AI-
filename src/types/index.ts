export type AnalysisStatus = 
  | "draft" 
  | "uploading" 
  | "transcribing" 
  | "review_required" 
  | "analyzing" 
  | "completed" 
  | "failed";

export type InputMode = "upload" | "paste" | "record";

export type ReplyTone = "Calm" | "Empathetic" | "Firm" | "Diplomatic" | "Direct";
export type ReplyLanguage = "Hinglish" | "Hindi" | "English";
export type ReplyGoal = "Clarify" | "Apologize" | "Set boundaries" | "Resolve conflict" | "Disagree respectfully";
export type ResponseLength = "Short" | "Balanced" | "Detailed";

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  startTime?: number; // seconds
  endTime?: number;   // seconds
  text: string;
  confidence?: number;
  isFlagged?: boolean;
}

export type ClaimAssessmentStatus = 
  | "supported" 
  | "partially_supported" 
  | "unsupported" 
  | "contradicted" 
  | "uncertain";

export interface ClaimAssessment {
  id: string;
  speakerId: string;
  claim: string;
  assessment: ClaimAssessmentStatus;
  evidenceSegmentIds: string[];
  explanation: string;
  quote?: string;
}

export interface SpeakerAssessment {
  speakerId: string;
  speakerName: string;
  role?: string;
  speakingTimePercent?: number;
  mainArguments: string[];
  validPoints: string[];
  unsupportedClaims: string[];
  communicationStrengths: string[];
  evidencedConcerns: string[];
  transcriptReferenceIds: string[];
}

export interface IssueVerdict {
  issue: string;
  strongerArgumentSide: string; // "Speaker 1" | "Speaker 2" | "Balanced / Inconclusive"
  evidenceA: string;
  evidenceB: string;
  sharedResponsibility: string;
  unresolvedPoints: string;
  uncertaintyNotes?: string;
}

export interface CommunicationInsight {
  id: string;
  type: "misunderstanding" | "unspoken_assumption" | "contradiction" | "escalation_pattern" | "unclear_expectation" | "emotional_trigger";
  title: string;
  description: string;
  excerpt?: string;
  speakerId?: string;
  recommendation: string;
}

export interface SuggestedReply {
  id: string;
  tone: ReplyTone;
  language: ReplyLanguage;
  goal: ReplyGoal;
  text: string;
  notes?: string;
}

export type EmotionalToneLabel =
  | "Constructive"
  | "Collaborative"
  | "Analytical"
  | "Urgent"
  | "Tense"
  | "Defensive";

export interface SentimentTimelinePoint {
  id: string;
  segmentId: string;
  timestampSeconds: number;
  speakerId: string;
  speakerName: string;
  /** Emotional valence score from -1.0 (Tense/Defensive) to +1.0 (Constructive/Collaborative) */
  score: number;
  toneLabel: EmotionalToneLabel;
  excerpt: string;
  triggerNote?: string;
}

export interface VoiceIntensityPoint {
  timeSeconds: number;
  pitchHz: number; // Fundamental frequency F0 (e.g. 100Hz - 360Hz)
  pitchDeltaPercent: number; // Relative shift from speaker baseline
  amplitude: number; // 0.0 to 1.0 relative acoustic loudness
  intensityScore: number; // 0.0 (calm baseline) to 1.0 (peak emotional tension/arousal)
  speakerId: string;
  speakerName: string;
  segmentId?: string;
  isSpike: boolean;
  spikeReason?: string;
  excerptSnippet?: string;
}

export interface EmotionalIntensityHotspot {
  id: string;
  timeSeconds: number;
  speakerName: string;
  speakerId: string;
  type: "pitch_spike" | "volume_surge" | "cadence_rush" | "interruption" | "deescalation_drop";
  intensityLevel: "moderate" | "high" | "peak";
  pitchHz: number;
  pitchShiftPercent: number;
  title: string;
  description: string;
  transcriptExcerpt: string;
  segmentId?: string;
}

export interface HinglishKeyPoint {
  speakerName: string;
  point: string;
  segmentId?: string;
}

export interface HinglishMisunderstanding {
  title: string;
  explanation: string;
  clarificationTip: string;
  segmentId?: string;
}

export interface HinglishExecutiveSummary {
  focus: "balanced" | "misunderstandings";
  overview: string;
  keyPoints: HinglishKeyPoint[];
  potentialMisunderstandings: HinglishMisunderstanding[];
  bottomLine: string;
  generatedAt: string;
  isSampleSynthesis: boolean;
}

export interface AnalysisReport {
  id: string;
  title: string;
  createdAt: string;
  status: AnalysisStatus;
  language: "Hinglish" | "Hindi" | "English" | "Mixed";
  durationSeconds?: number;
  wordCount: number;
  isSampleData?: boolean;
  contextSummary?: string;
  audioUrl?: string;
  inputType: InputMode;

  // Synthesis
  summary: string;
  mainDisagreement: string;
  keyUnresolvedQuestion: string;
  contextLimitations: string[];
  hinglishSummary?: HinglishExecutiveSummary;

  // Speaker breakdowns
  speakerAssessments: SpeakerAssessment[];

  // Objective claims evaluation
  claims: ClaimAssessment[];

  // Verdict and synthesis
  verdicts: IssueVerdict[];

  // Nuances & pitfalls
  insights: CommunicationInsight[];

  // Optional sentiment trajectory across conversation duration
  sentimentTimeline?: SentimentTimelinePoint[];

  // Response options
  suggestedReplies: SuggestedReply[];

  // Transcript
  transcript: TranscriptSegment[];
}

export interface AnalysisConfig {
  language: string;
  speakerCount: number;
  analysisDepth: "Quick" | "Detailed";
  replyTone: ReplyTone;
  replyLanguage: ReplyLanguage;
  optionalContext: string;
}
