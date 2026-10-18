import { AnalysisReport } from "../types";

export const SAMPLE_REPORTS: AnalysisReport[] = [
  {
    id: "rep-001",
    title: "Sprint Delivery & QA Blocker Debate",
    createdAt: "2026-10-16T14:30:00Z",
    status: "completed",
    language: "Hinglish",
    durationSeconds: 384,
    wordCount: 842,
    isSampleData: true,
    inputType: "upload",
    contextSummary: "Disagreement between Engineering Lead (Rohan) and Product Manager (Priya) regarding a missed enterprise release deadline and staging instability.",
    summary: "The discussion centers on why the Q3 Enterprise Export feature failed staging verification 36 hours before release. Rohan highlights sudden scope expansion and missing test cases from product specs, while Priya emphasizes that client delivery commitments were pre-agreed and staging downtime prevented verification.",
    mainDisagreement: "Whether the delay was caused by last-minute scope additions from Product or Engineering's lack of automated staging safeguards and delayed risk escalation.",
    keyUnresolvedQuestion: "Was the schema migration ticket communicated as a hard blocker on Tuesday, or merely mentioned as an open PR during standup?",
    contextLimitations: [
      "No Slack logs or Jira ticket changelogs were provided to verify the exact timestamp when PR #412 was merged.",
      "The pre-release client agreement document referenced by Priya was not part of the transcript.",
      "Post-standup private sync mentioned by Rohan at 02:45 is unrecorded."
    ],
    speakerAssessments: [
      {
        speakerId: "spk-1",
        speakerName: "Rohan (Eng Lead)",
        role: "Engineering Lead",
        speakingTimePercent: 52,
        mainArguments: [
          "Adding CSV streaming filter 48 hours before deploy broke memory limits on Redis staging cluster.",
          "Engineering alerted the team that staging database was running migration scripts, but test sign-off was pushed regardless.",
          "Engineers were working late without clear edge-case documentation."
        ],
        validPoints: [
          "Accurately cited the Redis OOM error code 137 from the staging crash report.",
          "Valid concern that adding asynchronous export changed the core API contract without regression time."
        ],
        unsupportedClaims: [
          "Claimed that 'Product team hamesha last moment mein sab change kar deta hai' (overgeneralization without historical baseline data)."
        ],
        communicationStrengths: [
          "Detailed technical explanations with exact error thresholds.",
          "Acknowledged the team's shared goal to satisfy the enterprise client."
        ],
        evidencedConcerns: [
          "Resorted to defensive framing when asked about delayed status updates on Jira.",
          "Interrupted Priya twice while she was explaining client milestone penalties."
        ],
        transcriptReferenceIds: ["seg-03", "seg-05", "seg-09"]
      },
      {
        speakerId: "spk-2",
        speakerName: "Priya (Product Manager)",
        role: "Senior Product Manager",
        speakingTimePercent: 48,
        mainArguments: [
          "The enterprise client SLA includes contractual penalty clauses if export is delayed past Thursday midnight.",
          "The CSV filter was not a brand-new scope item but an explicit requirement documented in the PRD appendix since August.",
          "Product was not notified of staging downtime until 4 PM on Wednesday."
        ],
        validPoints: [
          "Clear explanation of client relationship risk and potential $25,000 SLA penalty.",
          "Pointed out that engineering did not raise an orange/red flag during Tuesday morning standup."
        ],
        unsupportedClaims: [
          "Asserted that 'yeh chhota sa fix tha, mushkil se do ghante lagte' (minimized architectural complexity of distributed CSV streaming)."
        ],
        communicationStrengths: [
          "Structured, chronological presentation of client deadlines and business stakes.",
          "Focused on pragmatic next steps rather than assigning personal blame."
        ],
        evidencedConcerns: [
          "Estimated engineering implementation difficulty without consulting the tech lead beforehand.",
          "Dismissed staging server reliability concerns as 'just excuses'."
        ],
        transcriptReferenceIds: ["seg-02", "seg-06", "seg-10"]
      }
    ],
    claims: [
      {
        id: "clm-1",
        speakerId: "spk-1",
        claim: "PR #412 added unexpected asynchronous export logic that caused Redis crash.",
        assessment: "supported",
        evidenceSegmentIds: ["seg-05"],
        explanation: "Transcript corroborates that memory spikes occurred directly following the async export merge on Wednesday at 14:15.",
        quote: "Bhai, jab PR #412 merge hui toh background worker memory consumption 300MB se 1.8GB jump ho gayi thi."
      },
      {
        id: "clm-2",
        speakerId: "spk-2",
        claim: "CSV filter requirement was documented in the PRD appendix two weeks prior.",
        assessment: "partially_supported",
        evidenceSegmentIds: ["seg-06", "seg-07"],
        explanation: "Priya confirmed the requirement was in the appendix, but Rohan pointed out that it was never marked with user-story points or assigned to sprint scope.",
        quote: "Yeh appendix mein tha, lekin sprint planning mein humne iska koi estimation ya spike nahi rakha tha."
      },
      {
        id: "clm-3",
        speakerId: "spk-2",
        claim: "Engineering could have implemented the worker fix in under two hours.",
        assessment: "unsupported",
        evidenceSegmentIds: ["seg-08"],
        explanation: "Estimating backend distributed queue reconfiguration without technical validation is unsubstantiated by evidence.",
        quote: "Do ghante ka kaam tha, bas memory limit badha dete worker container ki."
      },
      {
        id: "clm-4",
        speakerId: "spk-1",
        claim: "Engineering flagged the risk during Tuesday standup.",
        assessment: "uncertain",
        evidenceSegmentIds: ["seg-04"],
        explanation: "Rohan stated he mentioned it, while Priya claims it was described as 'minor DB clean-up' rather than a blocker. Standup notes are not available.",
        quote: "Maine standup mein bola tha ki DB migration chal rahi hai, thoda delay ho sakta hai."
      }
    ],
    verdicts: [
      {
        issue: "Root Cause of Staging Downtime",
        strongerArgumentSide: "Rohan (Eng Lead)",
        evidenceA: "Demonstrated reproducible memory threshold crashes due to the un-benchmarked streaming library.",
        evidenceB: "Priya could not counter the technical log data showing OOM exit 137.",
        sharedResponsibility: "Engineering failed to gate merge with staging performance tests; Product introduced appendix requirements without dedicated sprint points.",
        unresolvedPoints: "Whether staging environment specs match production cluster sizing.",
        uncertaintyNotes: "Logs are self-reported during conversation; actual APM metrics were not attached."
      },
      {
        issue: "Escalation & Communication Timing",
        strongerArgumentSide: "Priya (Product Manager)",
        evidenceA: "Rohan admitted that written notice of staging failure was sent via Slack at 16:10, five hours after initial memory alerts.",
        evidenceB: "Priya documented that client stakeholders were left uninformed until the afternoon sync.",
        sharedResponsibility: "Both teams relied on casual standup remarks rather than formal blocker flags in Jira.",
        unresolvedPoints: "Need for an explicit escalation SLA when critical build pipelines break.",
        uncertaintyNotes: "Subjective disagreement on what constitutes 'sufficient notice'."
      }
    ],
    insights: [
      {
        id: "ins-1",
        type: "unspoken_assumption",
        title: "Divergent Definition of 'PRD Appendix'",
        description: "Priya assumed that any requirement placed in the Notion PRD appendix is automatically accepted for delivery, while Rohan assumed only sprint tickets in the Jira backlog are binding.",
        recommendation: "Establish a strict Definition of Ready (DoR) where tickets must be explicitly pointed and committed during sprint planning."
      },
      {
        id: "ins-2",
        type: "escalation_pattern",
        title: "Minimizing Language Triggered Defensiveness",
        description: "When Priya described the backend task as 'bas do ghante ka kaam' (just 2 hours of work), Rohan immediately pivoted from analytical problem-solving to defending team workload.",
        excerpt: "Do ghante ka kaam tha, bas memory limit badha dete...",
        recommendation: "Avoid estimating effort across functional domains; frame constraints in terms of impact rather than assumed ease."
      },
      {
        id: "ins-3",
        type: "misunderstanding",
        title: "Hinglish Idiom Ambiguity ('Dekh lenge')",
        description: "During Tuesday's standup, Rohan's remark 'DB issue ko hum dekh lenge' was interpreted by Priya as 'it will be resolved today', whereas Rohan meant 'we will investigate the investigation queue'.",
        recommendation: "Conclude critical blockers with concrete status categories (e.g., Investigating, Blocked, Resolving by 3 PM) rather than open-ended phrases."
      }
    ],
    suggestedReplies: [
      {
        id: "rep-calm",
        tone: "Calm",
        language: "Hinglish",
        goal: "Resolve conflict",
        text: "Priya, I understand ki enterprise client ke penalties bohot critical hain. Let's do this: main staging worker memory abhi temporary double kar deta hoon so QA verification can continue tonight, and kal subah 10 AM hum dono PRD appendix tickets ko formally point kar lenge taaki next release mein koi surprise na ho.",
        notes: "Acknowledges client stakes while establishing boundaries around sprint scope."
      },
      {
        id: "rep-empathetic",
        tone: "Empathetic",
        language: "Hinglish",
        goal: "Clarify",
        text: "Main samajhta hoon Priya ki client pressure bohot high hai aap pe. Meri intention blame karne ki nahi thi, bas memory leak real technical issue tha jo deploy ko risk mein daal raha tha. Let's sit together for 15 minutes and align on what we can safely release by Thursday.",
        notes: "De-escalates tension by validating business pressure before addressing technical reality."
      },
      {
        id: "rep-firm",
        tone: "Firm",
        language: "English",
        goal: "Set boundaries",
        text: "Priya, while I appreciate the client SLA urgency, Engineering cannot bypass staging load verification without creating severe production risk. Moving forward, any scope from the PRD appendix must be estimated and approved in sprint planning before it is merged into the release candidate.",
        notes: "Clear and non-negotiable operational boundary without personal attack."
      },
      {
        id: "rep-diplomatic",
        tone: "Diplomatic",
        language: "Hinglish",
        goal: "Disagree respectfully",
        text: "Dono sides ka valid perspective hai. Client commitments maintain karna equally important hai jitna platform stability. Propose yeh hai ki hum core export functionality ship karein aaj, aur streaming filter ko next hotfix patch mein push karein.",
        notes: "Finds a pragmatic middle ground between stability and milestone delivery."
      },
      {
        id: "rep-direct",
        tone: "Direct",
        language: "English",
        goal: "Clarify",
        text: "The staging crash was caused by Redis OOM on PR #412. We can restore staging within 45 minutes by allocating 2GB more memory, but we need Product sign-off that the async filter will receive dedicated regression testing before production deploy.",
        notes: "Fact-focused, direct operational proposal."
      }
    ],
    transcript: [
      {
        id: "seg-01",
        speakerId: "spk-2",
        speakerName: "Priya (Product Manager)",
        startTime: 0,
        endTime: 18,
        text: "Rohan, hum Thursday release ke bare mein baat kar sakte hain? Mujhe QA lead ne bola ki staging cluster crash ho gaya hai aur test sign-off abhi tak pending hai.",
        confidence: 0.98
      },
      {
        id: "seg-02",
        speakerId: "spk-2",
        speakerName: "Priya (Product Manager)",
        startTime: 19,
        endTime: 42,
        text: "Yeh enterprise client ke saath hamari quarterly commitment thi. Agar hum kal midnight tak export feature deploy nahi karte, toh contract mein $25,000 ki SLA penalty clause activate ho jayegi. How did we miss this?",
        confidence: 0.97
      },
      {
        id: "seg-03",
        speakerId: "spk-1",
        speakerName: "Rohan (Eng Lead)",
        startTime: 43,
        endTime: 78,
        text: "Priya, please ek second rukiye. Miss humne nahi kiya. Main clarify karna chahta hoon ki staging environment crash kyu hua. Product team hamesha last moment mein sab change kar deta hai without checking technical feasibility.",
        confidence: 0.96
      },
      {
        id: "seg-04",
        speakerId: "spk-1",
        speakerName: "Rohan (Eng Lead)",
        startTime: 79,
        endTime: 112,
        text: "Maine Tuesday ke standup mein explicitly bola tha ki DB migration chal rahi hai, thoda delay ho sakta hai. Lekin kisi ne notice nahi kiya aur testing seedha load pe run kar di.",
        confidence: 0.94
      },
      {
        id: "seg-05",
        speakerId: "spk-1",
        speakerName: "Rohan (Eng Lead)",
        startTime: 113,
        endTime: 156,
        text: "Bhai, jab PR #412 merge hui toh background worker memory consumption 300MB se 1.8GB jump ho gayi thi. Redis cluster out-of-memory error 137 throw karke pod terminate kar diya. Yeh technical failure un-benchmarked async export ki wajah se hua hai.",
        confidence: 0.99
      },
      {
        id: "seg-06",
        speakerId: "spk-2",
        speakerName: "Priya (Product Manager)",
        startTime: 157,
        endTime: 194,
        text: "Lekin Rohan, yeh CSV streaming filter koi achanak aaya hua scope nahi tha! PRD ke appendix section 4.2 mein yeh August ke starting se clearly documented tha. All clients need customer tier filters.",
        confidence: 0.98
      },
      {
        id: "seg-07",
        speakerId: "spk-1",
        speakerName: "Rohan (Eng Lead)",
        startTime: 195,
        endTime: 230,
        text: "Yeh appendix mein tha, lekin sprint planning mein humne iska koi estimation ya spike nahi rakha tha. Ticket backlog mein assign nahi thi, dev ne bas assumption pe pull request add kar di.",
        confidence: 0.95
      },
      {
        id: "seg-08",
        speakerId: "spk-2",
        speakerName: "Priya (Product Manager)",
        startTime: 231,
        endTime: 265,
        text: "Honestly, mere hisaab se yeh do ghante ka kaam tha, bas memory limit badha dete worker container ki Kubernetes config mein. Hum pure release ko delay nahi kar sakte iske liye.",
        confidence: 0.92
      },
      {
        id: "seg-09",
        speakerId: "spk-1",
        speakerName: "Rohan (Eng Lead)",
        startTime: 266,
        endTime: 310,
        text: "Memory badhana solution nahi hai Priya, agar production mein 10 clients ne simultaneously export trigger kiya toh pura worker pool down ho jayega. That is reckless engineering.",
        confidence: 0.97
      },
      {
        id: "seg-10",
        speakerId: "spk-2",
        speakerName: "Priya (Product Manager)",
        startTime: 311,
        endTime: 384,
        text: "I understand the technical risk. Lekin mujhe client ko update dena hai. Let's figure out: what is the minimum stable version we can deploy by tomorrow evening without risking prod downtime?",
        confidence: 0.99
      }
    ]
  },
  {
    id: "rep-002",
    title: "Marketing Budget Reallocation vs Runway Extension",
    createdAt: "2026-10-14T11:15:00Z",
    status: "completed",
    language: "Hinglish",
    durationSeconds: 420,
    wordCount: 910,
    isSampleData: true,
    inputType: "paste",
    contextSummary: "Discussion between Co-Founders (Aman - CEO & Kabir - CTO) concerning whether to deploy $40,000 into paid CAC acquisition or conserve runway for 3 additional months.",
    summary: "Aman advocates for aggressive customer acquisition ahead of Series A investor calls, arguing top-line traction matters most. Kabir counters that current churn is 14% and spending money before product retention fixes will burn runway without lasting enterprise value.",
    mainDisagreement: "Prioritizing growth velocity for upcoming VC fundraising vs preserving operational runway until core unit economics stabilize.",
    keyUnresolvedQuestion: "What is the exact cohort payback period for the recent Facebook and Google Ads campaigns launched in September?",
    contextLimitations: [
      "Cohort retention cohorts were referenced from an external Mixpanel board not attached to the transcript.",
      "Investor term sheet commitments were discussed based on informal coffee chats rather than signed documents."
    ],
    speakerAssessments: [
      {
        speakerId: "spk-1",
        speakerName: "Aman (CEO)",
        role: "Chief Executive Officer",
        speakingTimePercent: 54,
        mainArguments: [
          "Series A investors require at least 25% month-on-month ARR expansion to offer acceptable valuations.",
          "Organic inbound is too slow to hit the $100k MRR threshold before December."
        ],
        validPoints: [
          "Correctly cited current investor market benchmarks requiring growth proof points.",
          "Demonstrated that competitor funding is expanding market awareness."
        ],
        unsupportedClaims: [
          "Claimed that 'churn apne aap theek ho jayegi once we get bigger brand presence'."
        ],
        communicationStrengths: [
          "High conviction, energizing vision, and clear understanding of investor momentum."
        ],
        evidencedConcerns: [
          "Frequently interrupted financial caution with optimistic assertions."
        ],
        transcriptReferenceIds: ["seg-b1", "seg-b3"]
      },
      {
        speakerId: "spk-2",
        speakerName: "Kabir (CTO)",
        role: "Chief Technology Officer",
        speakingTimePercent: 46,
        mainArguments: [
          "Runway drops from 8 months to 4.5 months if $40k monthly burn is added.",
          "Leaky bucket economics: acquiring 100 users while losing 14 each month creates an unsustainable CAC-to-LTV ratio."
        ],
        validPoints: [
          "Preserving runway guarantees company survival if macro fundraising tightens.",
          "Highlighted that onboarding friction is the primary driver of 30-day cancellations."
        ],
        unsupportedClaims: [
          "Asserted that 'founders should never spend on paid ads before product-market fit' as an absolute rule."
        ],
        communicationStrengths: [
          "Pragmatic, metrics-grounded risk assessment."
        ],
        evidencedConcerns: [
          "Risk-averse posture at times delayed time-sensitive go-to-market testing."
        ],
        transcriptReferenceIds: ["seg-b2", "seg-b4"]
      }
    ],
    claims: [
      {
        id: "clm-b1",
        speakerId: "spk-2",
        claim: "Current 30-day customer churn sits at approximately 14%.",
        assessment: "supported",
        evidenceSegmentIds: ["seg-b2"],
        explanation: "Supported by cohort churn metrics cited and uncontested during the call.",
        quote: "Hamara 30-day churn abhi 14% chal raha hai, bucket leaky hai."
      },
      {
        id: "clm-b2",
        speakerId: "spk-1",
        claim: "Investors will decline calls without $100k MRR.",
        assessment: "partially_supported",
        evidenceSegmentIds: ["seg-b1"],
        explanation: "Some tier-1 VC funds enforce hard thresholds, while others evaluate founder pedigree and retention cohorts.",
        quote: "VCs seedha bolte hain ki $100k MRR se pehle baat mat karo."
      }
    ],
    verdicts: [
      {
        issue: "Marketing Spend vs Runway Allocation",
        strongerArgumentSide: "Kabir (CTO)",
        evidenceA: "High churn fundamentally undermines return on paid ad spend.",
        evidenceB: "Aman acknowledged that paid CAC has increased 30% over the last two quarters.",
        sharedResponsibility: "Both founders need a shared model linking retention fixes to phased marketing tests.",
        unresolvedPoints: "Setting a concrete churn milestone before scaling spend above $15k/month.",
        uncertaintyNotes: "Assumes paid traffic behaves similarly to organic cohorts."
      }
    ],
    insights: [
      {
        id: "ins-b1",
        type: "emotional_trigger",
        title: "Fear of Running Out of Money vs Fear of Missing the Growth Window",
        description: "Aman is driven by the existential fear of losing momentum in the market, while Kabir is motivated by the existential risk of zero cash in bank.",
        recommendation: "Separate the discussion into two distinct decisions: the survival threshold (minimum 6 months runway) and the experimental budget."
      }
    ],
    suggestedReplies: [
      {
        id: "rep-b-firm",
        tone: "Diplomatic",
        language: "Hinglish",
        goal: "Resolve conflict",
        text: "Aman, let's establish a middle path. We maintain a non-negotiable 6-month runway buffer, and allocate $12k for a tightly targeted 3-week pilot on high-intent search keywords only. If cohort Day-30 retention beats 85%, we unlock the remaining marketing budget.",
        notes: "Connects budget release directly to retention performance milestones."
      }
    ],
    transcript: [
      {
        id: "seg-b1",
        speakerId: "spk-1",
        speakerName: "Aman (CEO)",
        startTime: 0,
        endTime: 30,
        text: "Kabir, agar humne abhi ad spend double nahi kiya toh November tak hum 100k MRR touch nahi kar payenge, aur VCs seedha bolte hain ki iske bina round close nahi hoga.",
        confidence: 0.97
      },
      {
        id: "seg-b2",
        speakerId: "spk-2",
        speakerName: "Kabir (CTO)",
        startTime: 31,
        endTime: 65,
        text: "Aman bhai, point samajh raha hoon. Lekin hamara 30-day churn abhi 14% chal raha hai. Agar leaky bucket mein aur paani dalenge toh CAC waste ho jayegi aur runway 4 months pe aa jayegi.",
        confidence: 0.98
      },
      {
        id: "seg-b3",
        speakerId: "spk-1",
        speakerName: "Aman (CEO)",
        startTime: 66,
        endTime: 95,
        text: "Lekin wait karenge toh competitor saara market share le lega. We have to take calculated risks.",
        confidence: 0.95
      },
      {
        id: "seg-b4",
        speakerId: "spk-2",
        speakerName: "Kabir (CTO)",
        startTime: 96,
        endTime: 130,
        text: "Calculated risk matlab measured experiments, blind burning nahi. Let's fix the user onboarding drops first.",
        confidence: 0.99
      }
    ]
  }
];

export const SAMPLE_TRANSCRIPT_PRESETS = [
  {
    id: "preset-1",
    title: "Engineering vs Product Release Deadlock (Hinglish)",
    description: "High-stakes debate between Eng Lead and Product Manager over a broken staging build and client SLA deadlines.",
    content: `Priya: Rohan, hum Thursday release ke bare mein baat kar sakte hain? Mujhe QA lead ne bola ki staging cluster crash ho gaya hai aur test sign-off abhi tak pending hai.
Priya: Yeh enterprise client ke saath hamari quarterly commitment thi. Agar hum kal midnight tak export feature deploy nahi karte, toh contract mein $25,000 ki SLA penalty clause activate ho jayegi. How did we miss this?
Rohan: Priya, please ek second rukiye. Miss humne nahi kiya. Main clarify karna chahta hoon ki staging environment crash kyu hua. Product team hamesha last moment mein sab change kar deta hai without checking technical feasibility.
Rohan: Maine Tuesday ke standup mein explicitly bola tha ki DB migration chal rahi hai, thoda delay ho sakta hai. Lekin kisi ne notice nahi kiya aur testing seedha load pe run kar di.
Rohan: Bhai, jab PR #412 merge hui toh background worker memory consumption 300MB se 1.8GB jump ho gayi thi. Redis cluster out-of-memory error 137 throw karke pod terminate kar diya. Yeh technical failure un-benchmarked async export ki wajah se hua hai.
Priya: Lekin Rohan, yeh CSV streaming filter koi achanak aaya hua scope nahi tha! PRD ke appendix section 4.2 mein yeh August ke starting se clearly documented tha. All clients need customer tier filters.
Rohan: Yeh appendix mein tha, lekin sprint planning mein humne iska koi estimation ya spike nahi rakha tha. Ticket backlog mein assign nahi thi, dev ne bas assumption pe pull request add kar di.
Priya: Honestly, mere hisaab se yeh do ghante ka kaam tha, bas memory limit badha dete worker container ki Kubernetes config mein. Hum pure release ko delay nahi kar sakte iske liye.
Rohan: Memory badhana solution nahi hai Priya, agar production mein 10 clients ne simultaneously export trigger kiya toh pura worker pool down ho jayega. That is reckless engineering.
Priya: I understand the technical risk. Lekin mujhe client ko update dena hai. Let's figure out: what is the minimum stable version we can deploy by tomorrow evening without risking prod downtime?`
  },
  {
    id: "preset-2",
    title: "Co-Founder Growth vs Runway Disagreement (Hinglish)",
    description: "Heated discussion regarding CAC ad spending versus preserving cash runway for startup survival.",
    content: `Aman: Kabir, agar humne abhi ad spend double nahi kiya toh November tak hum 100k MRR touch nahi kar payenge, aur VCs seedha bolte hain ki iske bina round close nahi hoga.
Kabir: Aman bhai, point samajh raha hoon. Lekin hamara 30-day churn abhi 14% chal raha hai. Agar leaky bucket mein aur paani dalenge toh CAC waste ho jayegi aur runway 4 months pe aa jayegi.
Aman: Lekin wait karenge toh competitor saara market share le lega. Market wait nahi karta jab tak hum perfect product banayein.
Kabir: Calculated risk matlab measured experiments hota hai Aman, blind burning nahi. Humne onboarding drop-off abhi tak fix nahi kiya. Pehle user drop theek karte hain, phir spend unlock karenge.`
  },
  {
    id: "preset-3",
    title: "Agency Scope Creep & Milestone Billing (Hinglish)",
    description: "Agency account director and client lead discussing unpaid invoice and extra revision rounds.",
    content: `Vikram: Sameer, payment release kyun hold hui hai milestone 3 ki? Humne 5 screen revisions deliver kar diye the on Monday.
Sameer: Vikram ji, delivery toh aayi hai lekin mobile responsiveness check kiye bina submit kar diya aapki team ne. iOS Safari pe checkout button overlap ho raha hai.
Vikram: Par sir, Safari testing out-of-scope tha initial agreement mein. Humne specifically Chrome desktop & Android support quote kiya tha.
Sameer: India mein 40% target customers iPhone users hain hamare D2C brand ke. Obviously mobile support implied tha. Isko bina fix kiye finance sign-off nahi dega.`
  }
];
