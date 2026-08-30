# IntentOS — System Architecture & Data Flow Reference

---

## 1. System Overview

IntentOS is architected as an autonomous enterprise sales intelligence platform combining stream-based public signal ingestion, deterministic intent scoring, automated BANT qualification, bidirectional voice synthesis, and CRM workflow synchronization.

---

## 2. Comprehensive Architectural Diagram

```mermaid
flowchart TB
    subgraph Sourcing ["1. Ingestion & Public Signal Sourcing"]
        S1[LinkedIn Executive Posts]
        S2[Corporate RFP Portals]
        S3[Public Procurement Registers]
        S4[Enterprise Contract Boards]
    end

    subgraph IntelligenceEngine ["2. IntentOS Intelligence Core"]
        IE1[Ingestion Parser & Normalizer]
        IE2[Multidimensional Intent Scorer]
        IE3[Firmographic & Tech Enrichment]
        IE4[BANT Qualification Engine]
        IE5[Sales Brief & Playbook Generator]
    end

    subgraph Persistence ["3. Persistence & State Layer"]
        DB[(Prisma ORM + SQLite)]
        M1[Opportunities & Requirements]
        M2[Companies & Firmographics]
        M3[Campaigns & Segments]
        M4[Call Sessions & Transcripts]
        M5[Activity Audit Logs]
    end

    subgraph VoiceEngine ["4. Voice & Conversational AI"]
        V1[Scenario Execution State Machine]
        V2[DemoVoiceProvider / WebAudio Synthesizer]
        V3[Live Signal Detector & Urgency Classifier]
        V4[Post-Call Intelligence Extractor]
    end

    subgraph Presentation ["5. Enterprise Command Center UI"]
        UI1[Executive Dashboard / Priority Queue]
        UI2[Opportunity Intelligence & Evidence View]
        UI3[Voice Call Cockpit & Live Telemetry]
        UI4[Outreach Campaigns Management]
        UI5[Firmographic Intelligence Explorer]
        UI6[Executive Pipeline Analytics]
        UI7[Observability & Audit Logs]
    end

    subgraph Integrations ["6. CRM & Next Best Action"]
        CRM1[Salesforce / HubSpot CRM Push Mock]
        CRM2[Calendar & Callback Scheduling]
        CRM3[Human Handoff Dispatcher]
    end

    S1 & S2 & S3 & S4 --> IE1
    IE1 --> IE2 --> IE3 --> IE4 --> IE5
    IE5 --> DB
    DB --> M1 & M2 & M3 & M4 & M5
    M1 & M3 --> V1
    V1 --> V2 & V3
    V3 --> V4 --> CRM1 & CRM2 & CRM3
    DB <--> UI1 & UI2 & UI3 & UI4 & UI5 & UI6 & UI7
```

---

## 3. Core Architectural Layers

### 1. Ingestion & Normalization Layer (`src/lib/intelligence/`)
- Ingests raw public requirement text, platform sources, and author titles.
- Normalizes unstructured text into structured requirement models.
- Extracts urgency cues (deadlines, budget allocations, technical specifications).

### 2. Scoring & Heuristic Intelligence Layer (`src/lib/intelligence/intent-scorer.ts`)
- Computes weighted intent score based on 5 dimensions:
  1. Requirement Fit (35%)
  2. Urgency & Timelines (25%)
  3. Decision Maker Authority (15%)
  4. Firmographic ICP Alignment (15%)
  5. Sourcing Channel Reliability (10%)
- Implements deterministic fallback logic guaranteeing 100% test reliability with zero external API calls.

### 3. Voice Qualification & Conversational Layer (`src/lib/voice/`)
- **Scenarios (`src/lib/voice/scenarios.ts`)**: Defines structured multi-turn qualification dialogues across English, Hindi, and Gujarati.
- **Provider (`src/lib/voice/demo-voice-provider.ts`)**: Browser-native WebAudio and SpeechSynthesis engine with zero cloud latency.
- **Live Signal Classifier**: Ingests prospect responses turn-by-turn to extract real-time buying stage, pain points, objections, and decision maker validation.

### 4. Application & API Route Layer (`src/app/api/`)
- `/api/opportunities`: CRUD and multi-facet filtering for sales opportunities.
- `/api/opportunities/[id]`: Opportunity detail, intent breakdown, and pre-call brief generation.
- `/api/calls`: Call session history and active session initiation.
- `/api/calls/start`: Instantiates autonomous voice call session.
- `/api/calls/[id]/end`: Finalizes call session, computes qualification score, and extracts Next Best Action.
- `/api/calls/[id]/crm-push`: Synchronizes contact and opportunity to CRM.
- `/api/calls/[id]/handoff`: Dispatches human handoff request.
- `/api/campaigns`: Outreach campaign CRUD and lead enrollment.
- `/api/intelligence`: Firmographic account catalog and signal telemetry.
- `/api/analytics`: Pipeline conversion metrics and charts data.
- `/api/admin`: Subsystem observability and audit trail logging.
- `/api/demo/reset`: Reseeds database to deterministic benchmark baseline.

### 5. UI Presentation & Component Design System (`src/components/`)
- Built on Next.js 15 App Router with server/client boundaries.
- **Design Tokens**: Standardized CSS variables in `src/app/globals.css`.
- **Layout**: Structured sidebar (`WORKSPACE`, `INTELLIGENCE`, `SYSTEM`), sticky header with global search, notification center, and interactive guided demo trigger.
- **Shared Primitives**: `MetricCard`, `StatusBadge`, `LoadingSkeleton`, `EmptyState`, `ErrorState`, `GuidedDemo`.

---

## 4. End-to-End Data Flow: The Hero Journey

```mermaid
sequenceDiagram
    autonumber
    participant SDR as Sales Operator / SDR
    participant UI as IntentOS UI
    participant API as Next.js API Routes
    participant DB as SQLite / Prisma DB
    participant Engine as AI Scorer & Voice Engine
    participant Prospect as CTO Marcus Vance (ABC Tech)

    SDR->>UI: Opens Dashboard (/dashboard)
    UI->>API: GET /api/opportunities?sort=intentScore
    API->>DB: Query opportunities
    DB-->>API: Returns 105+ opportunities
    API-->>UI: Displays AI Priority Queue (ABC Tech #1 with 94 Intent)

    SDR->>UI: Clicks "Review & Qualify" for ABC Technologies
    UI->>API: GET /api/opportunities/lead-hero-001
    API-->>UI: Returns 5D Intent Breakdown, Why Now?, Sales Brief, BANT Score

    SDR->>UI: Clicks "Launch AI Voice Call"
    UI->>API: POST /api/calls/start { leadId: "lead-hero-001" }
    API-->>UI: Initializes Call Cockpit (callId: "call-hero-101")

    loop Turn-by-Turn Voice Qualification
        Engine->>Prospect: Speaks AI Statement (Migration capability & timeline inquiry)
        Prospect-->>Engine: Responds with requirement (30-day vendor evaluation, zero downtime)
        Engine->>UI: Stream Transcript Turn & Update Live Signals (Intent: 90+, Urgency: HIGH)
    end

    Engine->>API: POST /api/calls/call-hero-101/end
    API->>DB: Update CallSession (Status: COMPLETED, Qualification: 92%)
    API-->>UI: Displays Post-Call Intelligence & Next Best Action ("Schedule technical discovery")

    SDR->>UI: Clicks "Push to CRM"
    UI->>API: POST /api/calls/call-hero-101/crm-push
    API->>DB: Record CRM Sync ID & Log Audit Event
    API-->>UI: Updates UI ("Synced to CRM ✓")
```

---

## 5. Security, Observability & Data Integrity

- **Audit Logging**: Every sensitive action (`OPPORTUNITY_ANALYZED`, `CALL_COMPLETED`, `CRM_PUSH_COMPLETED`, `HUMAN_HANDOFF_REQUESTED`, `CAMPAIGN_CREATED`) writes an immutable transactional record to `ActivityLog`.
- **Deterministic Reliability**: Zero external API dependencies ensure 100% uptime in local environments and offline hackathon evaluation.
- **Strict Typing**: Full TypeScript coverage across all domain entities (`src/types/`).
