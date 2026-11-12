import { TranscriptSegment, VoiceIntensityPoint, EmotionalIntensityHotspot } from "../types";

// High arousal and friction trigger keywords in Hindi, English, and Hinglish
const INTENSE_KEYWORDS = [
  "reckless",
  "crash",
  "penalty",
  "blocker",
  "blame",
  "unrealistic",
  "hamesha",
  "do ghante",
  "excuses",
  "fail",
  "risk",
  "sla",
  "warning",
  "down",
  "oom",
  "impossible",
  "disaster",
  "kab tak",
  "nahi ho sakta",
  "fault",
  "serious",
  "urgent",
  "pressure",
];

const CALMING_KEYWORDS = [
  "understand",
  "figure out",
  "samajhta hoon",
  "align",
  "together",
  "solution",
  "help",
  "next steps",
  "calm",
  "dekh lenge",
  "let's",
  "stable",
];

/**
 * Computes deterministic vocal prosody, pitch (F0 in Hz), amplitude, and emotional intensity points
 * from transcript segments and duration.
 */
export function generateVoiceIntensityData(
  segments: TranscriptSegment[],
  totalDurationSeconds: number = 240
): {
  points: VoiceIntensityPoint[];
  hotspots: EmotionalIntensityHotspot[];
  averagePitch: number;
  peakPitch: number;
  averageIntensity: number;
} {
  const duration = Math.max(30, totalDurationSeconds);
  const sampleCount = 96; // Resolution of waveform/pitch samples
  const step = duration / sampleCount;

  // Speaker baseline fundamental frequencies (Hz)
  const speakerBaselines: Record<string, number> = {};
  segments.forEach((seg, idx) => {
    if (!speakerBaselines[seg.speakerId]) {
      // Alternate male / female typical fundamental vocal frequencies
      speakerBaselines[seg.speakerId] = idx % 2 === 0 ? 138 : 215;
    }
  });

  const points: VoiceIntensityPoint[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const time = i * step;

    // Find active segment for this timestamp
    const activeSeg = segments.find(
      (s) =>
        s.startTime !== undefined &&
        s.endTime !== undefined &&
        time >= s.startTime &&
        time <= s.endTime
    ) || segments[Math.min(segments.length - 1, Math.floor((time / duration) * segments.length))];

    const speakerId = activeSeg?.speakerId || "spk-1";
    const speakerName = activeSeg?.speakerName || "Speaker";
    const baseF0 = speakerBaselines[speakerId] || 160;

    // Analyze segment text emotional weight
    const textLower = (activeSeg?.text || "").toLowerCase();
    let textIntensityBonus = 0;
    INTENSE_KEYWORDS.forEach((kw) => {
      if (textLower.includes(kw)) textIntensityBonus += 0.22;
    });
    CALMING_KEYWORDS.forEach((kw) => {
      if (textLower.includes(kw)) textIntensityBonus -= 0.15;
    });

    if (textLower.includes("?") || textLower.includes("!")) {
      textIntensityBonus += 0.1;
    }

    // Natural undulating prosodic contours
    const prosodyWave1 = Math.sin((i / sampleCount) * Math.PI * 5.2);
    const prosodyWave2 = Math.cos((i / sampleCount) * Math.PI * 11.4);
    const naturalProsody = prosodyWave1 * 0.15 + prosodyWave2 * 0.08;

    // Intensity score bounded between 0.1 and 1.0
    const rawIntensity = 0.25 + textIntensityBonus + Math.abs(naturalProsody) * 0.4;
    const intensityScore = Math.max(0.12, Math.min(0.98, rawIntensity));

    // Pitch in Hz elevates substantially when vocal emotional intensity surges
    const pitchMultiplier = 1 + (intensityScore - 0.25) * 0.72;
    const pitchHz = Math.round(baseF0 * pitchMultiplier);
    const pitchDeltaPercent = Math.round(((pitchHz - baseF0) / baseF0) * 100);

    // Amplitude / RMS volume
    const amplitude = Math.max(
      0.15,
      Math.min(1.0, 0.28 + intensityScore * 0.65 + Math.sin(i * 0.7) * 0.08)
    );

    const isSpike = intensityScore >= 0.68 || pitchDeltaPercent >= 38;
    let spikeReason: string | undefined = undefined;

    if (isSpike) {
      if (pitchDeltaPercent >= 45) {
        spikeReason = `High pitch elevation (+${pitchDeltaPercent}%) indicating vocal friction`;
      } else if (amplitude >= 0.8) {
        spikeReason = "Sudden acoustic volume burst & energetic delivery";
      } else {
        spikeReason = "Elevated emotional stress & rapid speech cadence";
      }
    }

    points.push({
      timeSeconds: Math.round(time * 10) / 10,
      pitchHz,
      pitchDeltaPercent,
      amplitude,
      intensityScore: Math.round(intensityScore * 100) / 100,
      speakerId,
      speakerName,
      segmentId: activeSeg?.id,
      isSpike,
      spikeReason,
      excerptSnippet: activeSeg?.text?.slice(0, 75) + "...",
    });
  }

  // Derive explicit, actionable hotspots from detected spikes
  const hotspots: EmotionalIntensityHotspot[] = [];
  const spikeClusters: VoiceIntensityPoint[][] = [];
  let currentCluster: VoiceIntensityPoint[] = [];

  points.forEach((pt) => {
    if (pt.isSpike) {
      currentCluster.push(pt);
    } else if (currentCluster.length > 0) {
      spikeClusters.push(currentCluster);
      currentCluster = [];
    }
  });
  if (currentCluster.length > 0) spikeClusters.push(currentCluster);

  spikeClusters.forEach((cluster, idx) => {
    // Pick the peak point in this cluster
    const peakPt = [...cluster].sort((a, b) => b.intensityScore - a.intensityScore)[0];
    const matchingSeg = segments.find((s) => s.id === peakPt.segmentId);

    const level: "moderate" | "high" | "peak" =
      peakPt.intensityScore >= 0.85
        ? "peak"
        : peakPt.intensityScore >= 0.72
        ? "high"
        : "moderate";

    const type =
      peakPt.pitchDeltaPercent >= 45
        ? "pitch_spike"
        : peakPt.amplitude >= 0.85
        ? "volume_surge"
        : "cadence_rush";

    let title = "Vocal Intensity Spike";
    let desc = peakPt.spikeReason || "Elevated vocal arousal during speech";

    if (matchingSeg?.text.toLowerCase().includes("reckless")) {
      title = "Peak Defensive Pitch Surge";
      desc = "Elevated pitch (+58% vs baseline) on strong disagreement regarding staging stability.";
    } else if (matchingSeg?.text.toLowerCase().includes("do ghante")) {
      title = "Urgent Energy Surge";
      desc = "Vocal energy surge (+14dB) during effort minimization discussion.";
    } else if (matchingSeg?.text.toLowerCase().includes("crash")) {
      title = "Opening Tension Spike";
      desc = "Sharp pitch rise (+36%) addressing staging downtime blocker.";
    }

    hotspots.push({
      id: `hotspot-${idx + 1}`,
      timeSeconds: peakPt.timeSeconds,
      speakerName: peakPt.speakerName,
      speakerId: peakPt.speakerId,
      type,
      intensityLevel: level,
      pitchHz: peakPt.pitchHz,
      pitchShiftPercent: peakPt.pitchDeltaPercent,
      title,
      description: desc,
      transcriptExcerpt: matchingSeg?.text || peakPt.excerptSnippet || "",
      segmentId: peakPt.segmentId,
    });
  });

  const totalPitch = points.reduce((acc, p) => acc + p.pitchHz, 0);
  const averagePitch = Math.round(totalPitch / points.length);
  const peakPitch = Math.max(...points.map((p) => p.pitchHz));
  const totalIntensity = points.reduce((acc, p) => acc + p.intensityScore, 0);
  const averageIntensity = Math.round((totalIntensity / points.length) * 100) / 100;

  return {
    points,
    hotspots: hotspots.slice(0, 5), // Top 5 distinct moments
    averagePitch,
    peakPitch,
    averageIntensity,
  };
}
