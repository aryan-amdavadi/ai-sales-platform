# IntentOS — System Architecture & Technical Design

**Product**: IntentOS — Autonomous AI Sales Platform  
**Architecture Document**: Core Systems, Pipelines & Subsystems  
**Date**: August 2026  

---

## 1. High-Level System Architecture

IntentOS is architected as an autonomous loop connecting public signal ingestion, AI intelligence synthesis, voice qualification, and CRM automation:

```
                                  ┌───────────────────────────┐
                                  │   PUBLIC BUYING SIGNALS   │
                                  │  (RFPs, Hiring, Tech)     │
                                  └─────────────┬─────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 INTENTOS CORE ENGINE                                    │
│                                                                                         │
│  ┌───────────────────────┐   ┌────────────────────────┐   ┌──────────────────────────┐  │
│  │  8-DIM INTENT ENGINE  │──▶│  AI SALES BRIEF & BANT │──▶│  VOICE COPILOT COCKPIT   │  │
│  │ (Clarity, Urgency...) │   │ (Objections, Strategy) │   │ (Speech Synthesis, VAD)  │  │
│  └───────────────────────┘   └────────────────────────┘   └─────────────┬────────────┘  │
│                                                                         │               │
│  ┌───────────────────────┐   ┌────────────────────────┐                 ▼               │
│  │   ADMIN ACTIVITY LOG  │◀──│   CRM INTEGRATION ADAPTER ◀── POST-CALL INTELLIGENCE     │
│  │ (Audit Trail & Health)│   │ (Contact, Opp, Calls)  │     (Next Actions, Booking)     │
│  └───────────────────────┘   └────────────────────────┘                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Subsystems Breakdown

### A. Data Layer (SQLite + Prisma ORM)
- **`Company`**: Firmographic data, tech stack, hiring signals, funding signals, growth indicators.
- **`Lead`**: Decision-maker contact details, title, intent score, urgency level, qualification score, pipeline ARR value, sales brief.
- **`Requirement`**: Scope description, extracted tags, budget estimate, timeline, raw excerpt evidence.
- **`Qualification`**: BANT breakdown (Budget, Authority, Need, Timing), reasoning, and status.
- **`Recommendation`**: Next Best Action, priority, suggested message, rationale.
- **`Call` & `Transcript`**: Call session state, sentiment curve, duration, structured turn-by-turn dialogue.
- **`Campaign`**: Target persona, language, call window, minimum intent gate, enrolled leads.
- **`ActivityLog`**: Immutable event trail capturing all automated actions and actors.

### B. Autonomous AI Intelligence Engine
The AI pipeline operates in 6 sequential stages:
1. **Requirement Understanding**: Deconstructs raw text into category, tags, budget, and timeframe.
2. **8-Dimension Scoring**:
   - $\text{Intent Score} = \sum_{i=1}^{8} w_i \times d_i$ where $d_i$ represents normalized metrics (Clarity, Urgency, Timeline, Fit, Authority, Recency, Company Fit, Stage).
3. **Evidence Extraction**: Builds "Why This Lead?" and "Why Now?" signal checklists.
4. **Company & Solution Fit**: Compares capability requirements against platform feature matrix.
5. **BANT Qualification**: Evaluates Budget ($25\%$), Authority ($25\%$), Need ($25\%$), Timing ($25\%$) to output a heat classification (`HOT`, `WARM`, `POTENTIAL`, `LOW`).
6. **Sales Brief Synthesis**: Generates pre-call playbook containing decision-maker context, friction points, objection handling, opening statements, and discovery questions.

### C. Voice Telephony & Speech Architecture
- **Provider Architecture**: Abstract `VoiceProvider` interface with runtime resolution.
- **`BrowserVoiceProvider`**: Utilizes browser native `window.speechSynthesis` and `SpeechRecognition` when available.
- **`DemoVoiceProvider`**: Ultra-reliable sub-second fallback simulation delivering deterministic audio timings and natural pacing.
- **Real-Time Signal Detection**: Continuously updates live gauges during call execution:
  - Sentiment Spectrum (`POSITIVE`, `NEUTRAL`, `CONCERNED`, `HIGHLY_INTERESTED`)
  - Interest Meter (`LOW`, `MEDIUM`, `HIGH`, `EXTREME`)
  - Live Objection Detection Flags
  - Procurement Urgency Index

### D. CRM Integration Engine
- **Adapter Interface**: Standardized `CRMProvider` contract implemented by `DemoCRMProvider` (emulates Salesforce / HubSpot APIs).
- **Transactional Attachment**: Pushing a call to CRM creates:
  1. Contact Record (Name, Title, Email, Phone)
  2. Opportunity Record (Stage: `Discovery Scheduled`, Amount: `$150,000`, Close Date: 30 days)
  3. Call Activity Log (Verbatim transcript, summary, BANT scores, Next Best Action)

---

## 3. Directory Layout

```
├── docs/                      # Architectural, demo, security & API documentation
├── prisma/
│   └── schema.prisma          # Database models and relations
├── scripts/
│   ├── audit/                 # Verification scripts (Project, Markup, Security, Demo, LOC)
│   └── seed.ts                # Deterministic seed data generator
├── src/
│   ├── app/                   # Next.js 15 App Router pages and API routes
│   │   ├── admin/             # Admin activity audit trail
│   │   ├── analytics/         # Conversion telemetry and charts
│   │   ├── api/               # REST Route handlers
│   │   ├── calls/             # Autonomous Voice Calling Cockpit
│   │   ├── campaigns/         # Outreach ICP campaigns
│   │   ├── dashboard/         # Executive intelligence command center
│   │   ├── discover/          # Public intent signal ingestion
│   │   ├── intelligence/      # Account firmographic intelligence
│   │   ├── opportunities/     # Opportunity explorer & AI analysis detail
│   │   └── settings/          # System configuration
│   ├── components/            # UI components, layout shell, shared cards
│   ├── lib/                   # AI providers, voice providers, CRM adapter, DB client
│   └── types/                 # TypeScript interfaces and schemas
└── tests/
    ├── unit/                  # Vitest unit and pipeline integration tests
    └── e2e/                   # Playwright end-to-end and responsive test specs
```
