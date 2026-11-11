import { jsPDF } from "jspdf";
import { AnalysisReport } from "../types";
import { formatDate, formatTime } from "./utils";

/**
 * Generates and downloads a beautifully styled, high-quality PDF report
 * using standard jsPDF drawing methods.
 */
export async function exportReportToPdf(report: AnalysisReport): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = margin;
      drawPageDecorations();
    }
  };

  const drawPageDecorations = () => {
    // Subtle top border line with accent
    doc.setDrawColor(48, 51, 46); // #30332E
    doc.setLineWidth(0.4);
    doc.line(margin, 12, pageWidth - margin, 12);

    doc.setDrawColor(201, 255, 50); // Electric lime accent
    doc.setLineWidth(1.2);
    doc.line(margin, 12, margin + 24, 12);

    // Subtle header running text
    doc.setFontSize(8);
    doc.setTextColor(164, 166, 159); // Secondary text
    doc.setFont("helvetica", "normal");
    doc.text("VAANI AI — Conversation Analysis Report", margin, 9);
    doc.text(
      `Confidential · Generated ${new Date().toLocaleDateString()}`,
      pageWidth - margin,
      9,
      { align: "right" }
    );

    // Footer
    const pageNum = doc.getNumberOfPages();
    doc.setDrawColor(48, 51, 46);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFontSize(8);
    doc.setTextColor(164, 166, 159);
    doc.text(
      "Evidence-backed analysis · Fairness first · Dignified communication",
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, {
      align: "right",
    });
  };

  // Setup first page decorations
  drawPageDecorations();

  // Header Title & Brand
  y = 20;

  // Badge / Pill substitute: clean text tag
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(140, 180, 20); // Darker tone of electric lime for crisp print readability
  doc.text("OBJECTIVE CONVERSATION ANALYSIS REPORT", margin, y);
  y += 6;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 22, 20); // Near black for text
  const titleLines = doc.splitTextToSize(report.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Metadata row
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 102, 98);
  const metaText = [
    `Date: ${formatDate(report.createdAt)}`,
    report.durationSeconds ? `Duration: ${formatTime(report.durationSeconds)}` : null,
    `Language: ${report.language}`,
    `Word Count: ${report.wordCount} words`,
    report.isSampleData ? "Demo Case Study" : "Verified Recording",
  ]
    .filter(Boolean)
    .join("  ·  ");
  doc.text(metaText, margin, y);
  y += 6;

  if (report.contextSummary) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80, 82, 78);
    const contextLines = doc.splitTextToSize(
      `Context: ${report.contextSummary}`,
      contentWidth
    );
    doc.text(contextLines, margin, y);
    y += contextLines.length * 4.5 + 4;
  } else {
    y += 2;
  }

  // Divider
  doc.setDrawColor(220, 222, 218);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  // Section 1: Executive Neutral Summary
  checkPageBreak(35);
  doc.setFillColor(248, 249, 246);
  doc.setDrawColor(220, 222, 218);
  doc.roundedRect(margin, y, contentWidth, 0, 2, 2); // Dynamic fill will be drawn after calculation

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 22, 20);
  doc.text("1. Executive Neutral Summary", margin, y);
  y += 5.5;

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 42, 40);
  const summaryLines = doc.splitTextToSize(report.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 5;

  // Core Disagreement & Unresolved Question boxes
  checkPageBreak(30);
  const colWidth = (contentWidth - 4) / 2;

  // Box A: Core Disagreement
  const startBoxY = y;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 50, 90);
  doc.text("Core Disagreement", margin + 3, y + 4);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 52, 50);
  const disagLines = doc.splitTextToSize(report.mainDisagreement, colWidth - 6);
  doc.text(disagLines, margin + 3, y + 9);

  // Box B: Key Unresolved Question
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(110, 70, 180);
  doc.text("Key Unresolved Question", margin + colWidth + 5, y + 4);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 52, 50);
  const unresLines = doc.splitTextToSize(
    report.keyUnresolvedQuestion,
    colWidth - 6
  );
  doc.text(unresLines, margin + colWidth + 5, y + 9);

  const boxHeight =
    Math.max(disagLines.length, unresLines.length) * 4.2 + 13;

  doc.setDrawColor(230, 232, 228);
  doc.roundedRect(margin, startBoxY, colWidth, boxHeight, 1.5, 1.5);
  doc.roundedRect(
    margin + colWidth + 4,
    startBoxY,
    colWidth,
    boxHeight,
    1.5,
    1.5
  );

  y += boxHeight + 6;

  // Context limitations
  if (report.contextLimitations && report.contextLimitations.length > 0) {
    checkPageBreak(25);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(130, 90, 20);
    doc.text("Known Context Limitations & Missing Information:", margin, y);
    y += 4.5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 92, 88);
    report.contextLimitations.forEach((lim) => {
      const limLines = doc.splitTextToSize(`• ${lim}`, contentWidth - 4);
      doc.text(limLines, margin + 2, y);
      y += limLines.length * 4;
    });
    y += 4;
  }

  // Optional Hinglish Executive Summary
  if (report.hinglishSummary) {
    checkPageBreak(40);
    y += 2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(110, 70, 180);
    doc.text("Hinglish Executive Brief (Key Points & Misunderstandings)", margin, y);
    y += 5.5;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 42, 40);
    const hOverviewLines = doc.splitTextToSize(report.hinglishSummary.overview, contentWidth);
    doc.text(hOverviewLines, margin, y);
    y += hOverviewLines.length * 4.2 + 3;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 32, 30);
    doc.text("Mukhya Points:", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 62, 60);
    report.hinglishSummary.keyPoints.forEach((kp) => {
      const kpLines = doc.splitTextToSize(`• ${kp.speakerName}: ${kp.point}`, contentWidth - 4);
      checkPageBreak(kpLines.length * 4 + 2);
      doc.text(kpLines, margin + 2, y);
      y += kpLines.length * 3.8 + 1;
    });
    y += 2;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 50, 90);
    doc.text("Potential Misunderstandings:", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 62, 60);
    report.hinglishSummary.potentialMisunderstandings.forEach((m) => {
      const mLines = doc.splitTextToSize(`• ${m.title}: ${m.explanation} (Tip: ${m.clarificationTip})`, contentWidth - 4);
      checkPageBreak(mLines.length * 4 + 2);
      doc.text(mLines, margin + 2, y);
      y += mLines.length * 3.8 + 1.5;
    });
    y += 3;
  }

  // Section 2: Speaker Perspectives & Assessments
  checkPageBreak(40);
  y += 2;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 22, 20);
  doc.text("2. Speaker Perspectives & Evaluated Arguments", margin, y);
  y += 6;

  report.speakerAssessments.forEach((spk, idx) => {
    checkPageBreak(50);
    doc.setFillColor(250, 250, 248);
    doc.setDrawColor(225, 227, 222);

    const spkStartY = y;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 27, 25);
    doc.text(
      `${spk.speakerName} ${spk.role ? `(${spk.role})` : ""} — ${spk.speakingTimePercent}% Speaking Time`,
      margin + 4,
      y + 5
    );
    y += 10;

    // Main Arguments
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 52, 50);
    doc.text("Core Arguments Presented:", margin + 4, y);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 72, 70);
    spk.mainArguments.forEach((arg) => {
      const lines = doc.splitTextToSize(`• ${arg}`, contentWidth - 10);
      doc.text(lines, margin + 6, y);
      y += lines.length * 3.8;
    });
    y += 2;

    // Valid Points
    if (spk.validPoints && spk.validPoints.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 120, 30);
      doc.text("Substantiated & Valid Points:", margin + 4, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 52, 50);
      spk.validPoints.forEach((p) => {
        const lines = doc.splitTextToSize(`✓ ${p}`, contentWidth - 10);
        doc.text(lines, margin + 6, y);
        y += lines.length * 3.8;
      });
      y += 2;
    }

    // Unsupported claims
    if (spk.unsupportedClaims && spk.unsupportedClaims.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(170, 80, 20);
      doc.text("Unsubstantiated or Overgeneralized Claims:", margin + 4, y);
      y += 4;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 72, 70);
      spk.unsupportedClaims.forEach((c) => {
        const lines = doc.splitTextToSize(`! ${c}`, contentWidth - 10);
        doc.text(lines, margin + 6, y);
        y += lines.length * 3.8;
      });
      y += 2;
    }

    const cardHeight = y - spkStartY + 3;
    doc.roundedRect(margin, spkStartY, contentWidth, cardHeight, 1.5, 1.5);
    y += 5;
  });

  // Section 3: Objective Issue Verdicts
  if (report.verdicts && report.verdicts.length > 0) {
    checkPageBreak(40);
    y += 2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 22, 20);
    doc.text("3. Issue Synthesis & Objective Findings", margin, y);
    y += 6;

    report.verdicts.forEach((item, vIdx) => {
      checkPageBreak(35);
      const verdictStartY = y;
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 32, 30);
      doc.text(`Issue 0${vIdx + 1}: ${item.issue}`, margin + 4, y + 4.5);

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 140, 10);
      doc.text(
        `Stronger Ground: ${item.strongerArgumentSide}`,
        pageWidth - margin - 4,
        y + 4.5,
        { align: "right" }
      );
      y += 9;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 72, 70);
      const sideALines = doc.splitTextToSize(
        `Side A evidence: ${item.evidenceA}`,
        contentWidth - 8
      );
      doc.text(sideALines, margin + 4, y);
      y += sideALines.length * 3.8;

      const sideBLines = doc.splitTextToSize(
        `Side B evidence: ${item.evidenceB}`,
        contentWidth - 8
      );
      doc.text(sideBLines, margin + 4, y);
      y += sideBLines.length * 3.8;

      const sharedLines = doc.splitTextToSize(
        `Shared responsibility: ${item.sharedResponsibility}`,
        contentWidth - 8
      );
      doc.text(sharedLines, margin + 4, y);
      y += sharedLines.length * 3.8;

      const vHeight = y - verdictStartY + 3;
      doc.setDrawColor(225, 227, 222);
      doc.roundedRect(margin, verdictStartY, contentWidth, vHeight, 1.5, 1.5);
      y += 5;
    });
  }

  // Section 4: Verified Claims & Excerpts
  if (report.claims && report.claims.length > 0) {
    checkPageBreak(40);
    y += 2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 22, 20);
    doc.text("4. Claim-by-Claim Verification", margin, y);
    y += 6;

    report.claims.forEach((clm) => {
      checkPageBreak(25);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 32, 30);

      const statusTag = `[${clm.assessment.toUpperCase().replace("_", " ")}]`;
      doc.text(`${statusTag} "${clm.claim}"`, margin + 3, y);
      y += 4.5;

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 77, 75);
      const explLines = doc.splitTextToSize(
        `Reasoning: ${clm.explanation}`,
        contentWidth - 6
      );
      doc.text(explLines, margin + 3, y);
      y += explLines.length * 3.8;

      if (clm.quote) {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(95, 97, 95);
        const quoteLines = doc.splitTextToSize(
          `Excerpt: "${clm.quote}"`,
          contentWidth - 6
        );
        doc.text(quoteLines, margin + 3, y);
        y += quoteLines.length * 3.8;
      }
      y += 3;
    });
  }

  // Section 5: Calibrated Suggested Responses
  if (report.suggestedReplies && report.suggestedReplies.length > 0) {
    checkPageBreak(45);
    y += 2;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 22, 20);
    doc.text("5. Recommended De-escalating Responses", margin, y);
    y += 6;

    report.suggestedReplies.slice(0, 3).forEach((rep) => {
      checkPageBreak(30);
      const repStartY = y;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(110, 70, 180);
      doc.text(
        `${rep.tone} Tone · ${rep.language} · Goal: ${rep.goal}`,
        margin + 4,
        y + 4.5
      );
      y += 9;

      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(40, 42, 40);
      const textLines = doc.splitTextToSize(`"${rep.text}"`, contentWidth - 8);
      doc.text(textLines, margin + 4, y);
      y += textLines.length * 4;

      if (rep.notes) {
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 102, 100);
        const notesLines = doc.splitTextToSize(
          `Coach Note: ${rep.notes}`,
          contentWidth - 8
        );
        doc.text(notesLines, margin + 4, y);
        y += notesLines.length * 3.6;
      }

      const repHeight = y - repStartY + 3;
      doc.setDrawColor(225, 227, 222);
      doc.roundedRect(margin, repStartY, contentWidth, repHeight, 1.5, 1.5);
      y += 5;
    });
  }

  // Save the document
  const safeFilename = `${report.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")}-analysis-report.pdf`;
  doc.save(safeFilename);
}
