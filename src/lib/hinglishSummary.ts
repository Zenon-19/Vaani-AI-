import {
  AnalysisReport,
  HinglishExecutiveSummary,
  HinglishKeyPoint,
  HinglishMisunderstanding,
} from "../types";

export function generateHinglishExecutiveSummary(
  report: AnalysisReport,
  focus: "balanced" | "misunderstandings" = "balanced"
): HinglishExecutiveSummary {
  const now = new Date().toISOString();

  // Curated high-fidelity Hinglish synthesis for built-in sample case 1
  if (report.id === "rep-001") {
    const keyPoints: HinglishKeyPoint[] = [
      {
        speakerName: "Priya (Product Manager)",
        point:
          "Enterprise client SLA miss hone par $25,000 penalty clause trigger ho sakta hai, isliye Thursday midnight deployment critical hai.",
        segmentId: "seg-02",
      },
      {
        speakerName: "Rohan (Eng Lead)",
        point:
          "PR #412 merge hone ke baad Redis staging worker memory 300MB se 1.8GB jump ho gayi (OOM error 137), bina proper load testing ke deploy risky hai.",
        segmentId: "seg-05",
      },
      {
        speakerName: "Priya (Product Manager)",
        point:
          "CSV streaming filter PRD ke appendix 4.2 mein August se documented tha, lekin Wednesday 4 PM tak staging blocker escalate nahi hua.",
        segmentId: "seg-06",
      },
      {
        speakerName: "Rohan (Eng Lead)",
        point:
          "Appendix mein hone ke bawajood ticket sprint planning mein point aur estimate nahi hui thi, aur container memory badhana production ke liye safe fix nahi hai.",
        segmentId: "seg-07",
      },
    ];

    const potentialMisunderstandings: HinglishMisunderstanding[] = [
      {
        title: "Hinglish Phrase Gap: 'DB issue ko dekh lenge'",
        explanation:
          "Tuesday standup mein Rohan ne kaha ki migration chal rahi hai aur team dekh legi. Priya ne isko 'aaj resolve ho jayega' samjha, jabki Rohan ka matlab 'investigation queue mein hai' tha.",
        clarificationTip:
          "Next time explicit status bolein: 'Investigating', 'Blocked until 3 PM', ya 'Release blocker'.",
        segmentId: "seg-04",
      },
      {
        title: "'PRD Appendix' vs 'Committed Sprint Scope'",
        explanation:
          "Product ne maana ki PRD appendix mein likhi requirement automatically sprint commitment hai, jabki Engineering sirf Jira mein pointed tickets ko scope maanti hai.",
        clarificationTip:
          "Sprint planning mein ek clear Definition of Ready (DoR) checklist follow karein.",
        segmentId: "seg-07",
      },
      {
        title: "Effort Minimization ('Bas do ghante ka kaam')",
        explanation:
          "Backend distributed queue fix ko 'do ghante ka kaam' kehne se Rohan defensive mode mein chale gaye, jisse technical risk par constructive baat derail hui.",
        clarificationTip:
          "Timeline pressure batayein, lekin doosre team ke technical effort ka estimate na lagayein.",
        segmentId: "seg-08",
      },
    ];

    const overview =
      focus === "misunderstandings"
        ? "Is conversation mein main tension technical facts se zyada unaligned expectations aur Hinglish phrasing ki wajah se badhi. Dono sides client aur system ko bachana chahti hain, lekin 'appendix scope' aur 'dekh lenge' jaise phrases ne communication gap create kiya."
        : "Yeh discussion Thursday enterprise export release aur staging crash (PR #412) ke around ghoomti hai. Priya client SLA penalty ($25,000) ko lekar urgent hain, jabki Rohan Redis OOM error 137 aur un-estimated scope par focus kar rahe hain. End mein dono stable minimum release nikalne par agree karte hain.";

    const bottomLine =
      "Abhi immediate focus yeh hona chahiye ki staging memory safely stabilize karke minimum viable export release verify ho, aur kal subah PRD appendix items ko formally sprint points assign kiye jayein.";

    return {
      focus,
      overview,
      keyPoints:
        focus === "misunderstandings" ? keyPoints.slice(0, 3) : keyPoints,
      potentialMisunderstandings,
      bottomLine,
      generatedAt: now,
      isSampleSynthesis: Boolean(report.isSampleData),
    };
  }

  // Curated high-fidelity Hinglish synthesis for built-in sample case 2
  if (report.id === "rep-002") {
    const keyPoints: HinglishKeyPoint[] = [
      {
        speakerName: "Aman (CEO)",
        point:
          "Series A investors November tak $100k MRR traction dekhna chahte hain, isliye ad spend double karna zaroori lag raha hai.",
        segmentId: "seg-b1",
      },
      {
        speakerName: "Kabir (CTO)",
        point:
          "Abhi 30-day churn 14% hai; agar leaky bucket mein $40k monthly burn add kiya toh runway 8 months se gir kar 4.5 months par aa jayegi.",
        segmentId: "seg-b2",
      },
      {
        speakerName: "Aman (CEO)",
        point:
          "Zyada wait karne se competitors market share capture kar sakte hain, isliye calculated growth risk lena padega.",
        segmentId: "seg-b3",
      },
    ];

    const potentialMisunderstandings: HinglishMisunderstanding[] = [
      {
        title: "'Calculated Risk' ka Alag Matlab",
        explanation:
          "Aman ke liye calculated risk ka matlab 'fast CAC scaling for VC momentum' hai, jabki Kabir ke liye iska matlab 'onboarding drop-offs fix karne ke baad measured pilot' hai.",
        clarificationTip:
          "Risk ko dollar cap aur retention gate (e.g., Day-30 retention > 85%) se define karein.",
        segmentId: "seg-b4",
      },
      {
        title: "Survival Fear vs Missed Opportunity Fear",
        explanation:
          "Dono co-founders company ki growth chahte hain, lekin ek cash-zero risk se cautious hai aur doosra fundraising window miss hone se.",
        clarificationTip:
          "Pehle 6-month non-negotiable runway floor lock karein, phir bache budget se experiment chalayein.",
        segmentId: "seg-b2",
      },
    ];

    const overview =
      focus === "misunderstandings"
        ? "Aman aur Kabir ke beech conflict goal ka nahi, balki risk timing ka hai. Dono 'calculated risk' bol rahe hain lekin unke definitions alag hain—ek top-line traction par focus kar raha hai aur doosra 14% churn fix karne par."
        : "Co-founders ke beech $40,000 paid marketing spend versus cash runway bachane par debate hai. Aman Series A ke liye $100k MRR touch karna chahte hain, jabki Kabir 14% churn aur 4.5-month runway drop ko lekar caution de rahe hain.";

    const bottomLine =
      "6-month runway buffer safe rakh kar ek chhota $12k high-intent pilot run karna aur retention improve hone par hi full budget unlock karna sabse balanced rasta hai.";

    return {
      focus,
      overview,
      keyPoints,
      potentialMisunderstandings,
      bottomLine,
      generatedAt: now,
      isSampleSynthesis: Boolean(report.isSampleData),
    };
  }

  // Dynamic fallback synthesis for any user-created / pasted / edited conversation
  const speakerNames = Array.from(
    new Set(report.transcript.map((s) => s.speakerName))
  );
  const participantsLabel =
    speakerNames.length >= 2
      ? `${speakerNames[0]} aur ${speakerNames.slice(1).join(", ")}`
      : speakerNames[0] || "Participants";

  const keyPoints: HinglishKeyPoint[] = [];

  const assessmentSpeakerNames = new Set(
    (report.speakerAssessments || []).map((s) => s.speakerName)
  );
  const transcriptMatchesAssessments =
    speakerNames.length > 0 &&
    speakerNames.some((n) => assessmentSpeakerNames.has(n));

  if (
    transcriptMatchesAssessments &&
    report.speakerAssessments &&
    report.speakerAssessments.length > 0
  ) {
    report.speakerAssessments.forEach((spk) => {
      const topPoint = spk.validPoints[0] || spk.mainArguments[0];
      if (topPoint) {
        keyPoints.push({
          speakerName: spk.speakerName,
          point: `${spk.speakerName.split(" (")[0]} ka main point: ${topPoint}`,
          segmentId: spk.transcriptReferenceIds?.[0],
        });
      }
    });
  }

  // Fallback or custom pasted transcript: derive directly from actual transcript segments
  if (keyPoints.length === 0 && report.transcript.length > 0) {
    report.transcript.slice(0, 4).forEach((seg) => {
      keyPoints.push({
        speakerName: seg.speakerName,
        point:
          seg.text.length > 140 ? `${seg.text.slice(0, 137)}...` : seg.text,
        segmentId: seg.id,
      });
    });
  }

  const potentialMisunderstandings: HinglishMisunderstanding[] =
    report.insights && report.insights.length > 0
      ? report.insights.slice(0, 3).map((ins) => ({
          title: ins.title,
          explanation: ins.description,
          clarificationTip: ins.recommendation,
        }))
      : [
          {
            title: "Unresolved Expectations & Context Gap",
            explanation: `Is baat-cheet mein "${report.keyUnresolvedQuestion}" par clear alignment nahi ban paaya, jisse alag-alag assumptions create ho sakte hain.`,
            clarificationTip:
              "Agli baatchit mein timelines aur responsibilities ko written format mein confirm karein.",
          },
        ];

  const overview =
    focus === "misunderstandings"
      ? `${participantsLabel} ke beech "${report.title}" par hui baat-cheet mein sabse bada gap unstated expectations aur phrasing ke interpretation mein dikha. Main disagreement: ${report.mainDisagreement}`
      : `${participantsLabel} ke beech "${report.title}" par discussion hui (${report.wordCount} words). Conversation ka core mudda yeh hai: ${report.mainDisagreement}`;

  const bottomLine = `Sabse zaroori sawaal jo abhi clear karna baaki hai: "${report.keyUnresolvedQuestion}" — is par calm aur factual follow-up karna best rahega.`;

  return {
    focus,
    overview,
    keyPoints,
    potentialMisunderstandings,
    bottomLine,
    generatedAt: now,
    isSampleSynthesis: Boolean(report.isSampleData),
  };
}

export function formatHinglishSummaryForCopy(
  summary: HinglishExecutiveSummary,
  reportTitle: string
): string {
  const pointsText = summary.keyPoints
    .map((kp) => `- ${kp.speakerName}: ${kp.point}`)
    .join("\n");

  const misunderstandingsText = summary.potentialMisunderstandings
    .map(
      (m, idx) =>
        `${idx + 1}. ${m.title}\n   Gap: ${m.explanation}\n   Tip: ${m.clarificationTip}`
    )
    .join("\n\n");

  return `Vaani AI — Hinglish Executive Summary (${reportTitle})

Baat Ka Saar (Overview):
${summary.overview}

Mukhya Points (Key Points):
${pointsText}

Potential Misunderstandings (Kahan Galatfehmi Hui):
${misunderstandingsText}

Agla Kadam (Bottom Line):
${summary.bottomLine}`;
}
