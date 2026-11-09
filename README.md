# Vaani AI

> **Understand the conversation. See both sides. Respond better.**  
> A voice-first Hinglish conversation analyst and communication coach.

---

## Overview

**Vaani AI** is an AI-powered conversational analysis platform built for complex, code-mixed dialogues in Hindi, English, and Hinglish. It helps individuals, team leads, co-founders, and managers understand what was said, evaluate opposing arguments with fairness and dignity, trace claims directly to spoken transcript evidence, and compose de-escalating responses calibrated in tone and language.

---

## Core Principles

1. **Fairness First**: Evaluates all participants symmetrically without favoring the louder or more fluent speaker.
2. **Evidence Over Assumptions**: Every analytical judgment is linked to exact transcript timestamps and verbatim excerpts.
3. **Dignified Psychology**: Strictly rejects clinical or stigmatizing labels (*toxic*, *narcissistic*). Focuses on observable conversational behaviors and actionable conflict resolution.
4. **Transparent Uncertainty**: Acknowledges missing context, ambiguous phrasing (e.g. *dekh lenge*), and unrecorded private meetings.
5. **Calibrated Coaching**: Generates responses across five distinct tones (*Calm*, *Empathetic*, *Firm*, *Diplomatic*, *Direct*) in Hinglish, Hindi, or English.

---

## Features

- **Multi-Modal Input**:
  - **Audio Upload**: Drag & drop MP3, WAV, M4A, or AAC files up to 50MB.
  - **Live Audio Recording**: In-browser capture with real-time waveform visualizer, pause/resume, and playback preview.
  - **Transcript Paste**: Rich multiline editor with pre-loaded Hinglish conversational presets (*Sprint Delivery & QA Blocker*, *Co-Founder Growth vs. Runway*, *Agency Scope Creep*).
- **Interactive Transcript Editor**:
  - Diarized speaker segments with inline renaming.
  - Search and live keyword highlighting.
  - Interactive audio player with waveform scrubbing, playback speed (0.75x–2.0x), and skip controls.
  - Speaking time percentages and word-count distributions.
- **Comprehensive Analysis Report**:
  - **Executive Neutral Summary**: Core disagreement, key unresolved questions, and known context limitations.
  - **Symmetric Speaker Assessment Cards**: Core arguments, validated facts, unsubstantiated claims, communication strengths, and behavioral friction points.
  - **Objective Issue Verdicts**: Balanced determination of merit without forcing binary winners.
  - **Claim-by-Claim Verification**: Linked to slide-over **Evidence Drawer** showing ground-truth quotes and reasoning.
  - **Communication Insights**: Cultural/Hinglish divergences, unspoken assumptions, and emotional triggers.
- **Export Options**:
  - **Export to PDF**: Professional, printable, multi-page vector PDF report formatted with executive summaries, speaker breakdowns, issue findings, and coach recommendations.
  - **Markdown Summary**: Clean markdown document ready for Notion, GitHub issues, or documentation.
  - **JSON Schema**: Complete structured export with timestamps, claim statuses, and transcript turns.
- **Response Studio**:
  - Context-aware reply composer with parameter toggles (Tone, Strategic Goal, Dialect, Length).
  - Alternative tone variation cards with instant copy and reset functionality.
  - Saved response history.
- **History & Settings**:
  - Filterable archives by keyword, language, source type, and status.
  - Transparent audio retention controls (*Session Only*, *30-Day Buffer*, *Indefinite*).
  - Full workspace archive export and permanent data purge.

---

## Tech Stack & Architecture

- **Framework**: React 19 SPA with Vite
- **Styling**: Tailwind CSS v4 with custom design tokens:
  - *Obsidian Black* (`#090A09`), *Elevated* (`#111311`), *Card* (`#171817`), *Hover* (`#202220`)
  - *Electric Lime* (`#C9FF32`), *Soft Lavender* (`#C8A6FF`), *Blush Pink* (`#F5AFCF`), *Warm Ivory* (`#F1F0E9`)
- **Icons**: Lucide React
- **Document Export**: jsPDF client-side vector document engine
- **Audio & Visual**: HTML5 Web Audio API, SVG Topographic Contour backgrounds, 3D Voice Orb

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Runs the application locally at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

---

## Privacy & Security

- Audio and transcripts are handled strictly within the user's workspace session.
- Private reports are never exposed through public indexable URLs.
- No confidential conversations are used to train public foundation models.
