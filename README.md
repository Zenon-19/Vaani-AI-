# Vaani AI (वाणी)

> **Understand the conversation. See both sides. Respond better.**  
> A voice-first Hinglish conversation analyst, conflict mediator, and communication coach.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
  - [Dashboard Search & Filtering](#1-dashboard-search--filtering)
  - [D3 Sentiment Timeline Visualization](#2-d3-sentiment-timeline-visualization)
  - [Hinglish Executive Summary](#3-hinglish-executive-summary)
  - [Client-Side PDF Export](#4-client-side-pdf-export)
  - [Multi-Modal Conversation Ingestion](#5-multi-modal-conversation-ingestion)
  - [Interactive Transcript Studio](#6-interactive-transcript-studio)
  - [Objective Symmetric Analysis](#7-objective-symmetric-analysis)
  - [Evidence Drawer](#8-evidence-drawer)
  - [Response Studio](#9-response-studio)
- [Design Tokens & Aesthetics](#design-tokens--aesthetics)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Privacy & Security](#privacy--security)

---

## Overview

**Vaani AI** is an AI-powered conversational intelligence and conflict resolution platform tailored for real-world code-mixed dialogues in **Hindi, English, and Hinglish**. 

Traditional communication tools treat conversations as simple transcripts or apply binary sentiment labels. In fast-paced startup teams, agency-client relationships, and cross-cultural workplaces, friction often stems from unspoken assumptions, cultural idiom nuances (such as *"dekh lenge"* or *"baad mein baat karte hain"*), and asymmetric speaking patterns.

Vaani AI brings symmetric fairness, verifiable transcript evidence, visual sentiment trajectories, and calibrated coaching to every conversation.

---

## Key Features

### 1. Dashboard Search & Filtering
- **Real-Time Keyword Search**: Instantly query across conversation titles, executive summaries, and situational contexts with an instant clear trigger.
- **Date Sorting**: Toggle between **Newest First** and **Oldest First** with timestamp indexing.
- **Sentiment Classification Dropdown**: Filter analyses by dominant emotional temperature:
  - `All Sentiments`
  - `Collaborative` (Constructive cooperation, shared problem solving)
  - `Constructive` (Productive debate, pragmatic solutions)
  - `Tense` (Elevated friction, deadline pressure, blocker disputes)
  - `Defensive` (Protective posturing, finger-pointing, scope resistance)
- **Active Filter Reset**: One-click filter reset with contextual empty states.

### 2. D3 Sentiment Timeline Visualization
- **Dynamic Emotional Trajectory**: Custom D3.js timeline showing emotional score transitions (`-1.0` to `+1.0`) across conversation progression.
- **Interactive Scrubber & Hover Card**: Hover or click any moment along the timeline curve to inspect exact timestamps, active speakers, emotional tone, and spoken excerpt.
- **Speaker Filtering**: Isolate specific speakers (e.g., Rohan vs. Priya) to analyze emotional shifts independently.
- **Conflict Hotspots**: Visual markers highlighting peak tension and pivotal resolution moments.

### 3. Hinglish Executive Summary
- **Code-Mixed Briefing**: Generates a natural Hinglish summary (*"Dono sides ka perspective samajhne ke liye quick executive summary"*).
- **Key Discussion Points**: Identifies critical agenda topics, trade-offs, and commitments made during the exchange.
- **Potential Misunderstandings (*Galatfehmi & Friction Points*)**: Pinpoints where implicit expectations or ambiguous phrases led to friction.
- **One-Click Clipboard Copy**: Formatted plain-text export for WhatsApp, Slack, or email updates.

### 4. Client-Side PDF Export
- **Vector Document Generation**: Powered by `jsPDF` without third-party server dependencies.
- **Executive Styling**: Includes custom brand headers, speaker breakdowns, issue verdicts, verified claims, and communication coaching tips.
- **Multi-Format Export**: Also supports structured JSON schemas and formatted Markdown documents.

### 5. Multi-Modal Conversation Ingestion
- **Audio Upload**: Support for `.mp3`, `.wav`, `.m4a`, and `.aac` files up to 50MB with client-side audio metadata reading.
- **Live Voice Recording**: In-browser microphone capture with HTML5 Web Audio API, real-time waveform visualization, pause/resume, and playback review.
- **Transcript Paste**: Rich multiline editor with pre-loaded Hinglish conversational presets:
  - *Sprint Delivery & QA Blocker*
  - *Co-Founder Growth vs. Runway*
  - *Agency Scope Creep*

### 6. Interactive Transcript Studio
- Diarized turn-by-turn speaker segments with editable speaker tags.
- **Voice Pitch & Emotional Waveform Visualizer**:
  - Fundamental frequency (F0 in Hz) prosody curve tracking pitch variations over time.
  - Energy amplitude envelope highlighting volume bursts and raised voices.
  - Color-coded emotional intensity levels (Blush `#F5AFCF` for spikes, Lavender `#C8A6FF` for active debate, Lime `#C9FF32` for baseline).
  - Clickable emotional intensity beacons that instantly scrub audio and smoothly scroll to the flagged transcript turn.
  - Interactive hover inspector displaying exact timestamp, active speaker, pitch frequency, acoustic energy, and excerpt.
  - Multi-mode toggles: `Combined`, `Pitch (Hz)`, and `Energy`.
- Interactive playback scrubber synchronized with audio timestamps.
- Live keyword search highlighting across spoken turns.
- Speaking time distributions and word count metrics.

### 7. Objective Symmetric Analysis
- **Neutral Executive Summary**: Identifies core disputes without taking partisan sides.
- **Symmetric Speaker Assessment**: Balanced comparison of core arguments, validated facts, unsubstantiated claims, and behavioral friction.
- **Issue Verdicts**: Fair determination of merit without forcing artificial binary winners.
- **Cultural & Linguistic Context**: Explanations of colloquial Hinglish idioms and unspoken assumptions.

### 8. Evidence Drawer
- Every analytical verdict and claim is linked to ground-truth timestamps.
- Slide-over drawer reveals the verbatim quote, context, and validation reasoning.

### 9. Response Studio
- Draft de-escalating replies across 5 calibrated tones:
  - `Calm & Grounded`
  - `Empathetic & Validating`
  - `Firm & Boundary-Setting`
  - `Diplomatic & Win-Win`
  - `Direct & Action-Oriented`
- Dialect options: Natural Hinglish, Formal English, or Conversational Hindi.

---

## Design Tokens & Aesthetics

The interface is engineered around an **Obsidian Black** dark theme with vibrant accents:

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Obsidian Black** | `#090A09` | Canvas background |
| **Card Surface** | `#171817` | Component containers |
| **Border Dark** | `#30332E` | Subtle dividers and outlines |
| **Electric Lime** | `#C9FF32` | Primary brand accent & positive verdicts |
| **Soft Lavender** | `#C8A6FF` | Speaker 2 & secondary insights |
| **Blush Pink** | `#F5AFCF` | Friction markers & sensitive alerts |
| **Warm Ivory** | `#F1F0E9` | High-contrast readable typography |
| **Muted Slate** | `#A4A69F` | Secondary labels and timestamps |

---

## Architecture & Tech Stack

- **Runtime & UI**: React 19 SPA, TypeScript 7.0
- **Build System**: Vite 8 with `@tailwindcss/vite`
- **Styling**: Tailwind CSS v4 (Zero-pill discipline, tabular numbers, custom contour backgrounds)
- **Data Visualization**: D3.js v7 (`d3-shape`, `d3-scale`, `d3-axis`, `d3-selection`)
- **Document Export**: jsPDF v4
- **Icons**: Lucide React
- **Audio Processing**: HTML5 Web Audio API & MediaRecorder API

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── analysis/
│   │   │   ├── AnalysisReportPage.tsx     # Full analysis report, D3 timeline, Hinglish summary, PDF export
│   │   │   ├── ProcessingPage.tsx         # Real-time multi-stage processing simulation
│   │   │   └── TranscriptReviewPage.tsx   # Diarized editor & audio playback
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx          # Search bar, sentiment/date filters, quick shortcuts
│   │   ├── history/
│   │   │   └── HistoryPage.tsx            # Full conversational archive & filters
│   │   ├── landing/
│   │   │   └── LandingPage.tsx            # Marketing hero, feature breakdown, social proof
│   │   ├── new/
│   │   │   └── NewAnalysisPage.tsx        # Upload, record, or paste conversation
│   │   ├── responses/
│   │   │   └── ResponseStudioPage.tsx     # Contextual response coach across 5 tones
│   │   └── settings/
│   │       └── SettingsPage.tsx           # Audio retention, workspace exports & preferences
│   ├── components/
│   │   ├── analysis/
│   │   │   ├── ClaimVerificationBadge.tsx
│   │   │   ├── EvidenceDrawer.tsx         # Slide-over ground-truth quote inspector
│   │   │   ├── HinglishExecutiveSummaryCard.tsx # Hinglish summary component
│   │   │   ├── IssueVerdictCard.tsx
│   │   │   ├── SentimentTimeline.tsx      # D3 interactive timeline
│   │   │   └── SpeakerAssessmentCard.tsx
│   │   ├── brand/
│   │   │   ├── StatusBadge.tsx
│   │   │   └── VoiceOrb.tsx               # Animated voice visualization orb
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   └── PageContainer.tsx
│   │   └── ui/                            # Button, Card, Dialog, Toast, Tabs, Skeleton
│   ├── data/
│   │   └── demoData.ts                    # Realistic Hinglish conversation datasets
│   ├── lib/
│   │   ├── d3Timeline.ts                  # D3 rendering calculations
│   │   ├── hinglishSummary.ts             # Hinglish summary generation & formatting
│   │   ├── pdfExport.ts                   # Client-side PDF generator
│   │   └── utils.ts
│   └── types/
│       └── index.ts                       # Complete TypeScript domain models
├── README.md
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, pnpm, or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build
```

---

## Privacy & Security

- **Strict Session Isolation**: Uploaded audio files and transcript notes are evaluated in the browser and mock-analyst session without external telemetry.
- **Zero Public Indexing**: Conversational reports are private to the workspace session.
- **Configurable Retention**: Workspace settings allow immediate memory purge, 30-day buffer, or indefinite local archiving.
