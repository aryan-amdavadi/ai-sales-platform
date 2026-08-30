# IntentOS — Autonomous AI Sales Platform

> **"Turn public buying signals into sales-ready opportunities."**

IntentOS is a production-grade autonomous B2B sales platform that continuously monitors public buying signals (RFPs, tech stack transitions, leadership hiring, expansion cues), calculates multidimensional intent scores, synthesizes AI pre-call sales intelligence briefs, executes sub-second autonomous voice qualification calls, detects live conversational signals, and syncs qualified pipeline directly to CRM.

---

## ⚡ Quickstart

IntentOS requires **zero external API keys, zero paid subscriptions, and zero telephony hardware**. It runs 100% deterministically and offline out-of-the-box.

### 1. Install & Setup Database
```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
```

### 2. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Master Audit
```bash
npm run audit
```

---

## 🌟 Key Capabilities

1. **Autonomous Public Intent Discovery (`/discover`)**:
   - Ingests public RFPs, job postings, vendor inquiries, and cloud modernization signals across LinkedIn, X, and enterprise directories.
   - Normalizes requirements, extracts buying stage, technical constraints, timeframe, and budget estimates.

2. **8-Dimensional Intent & Qualification Engine (`/opportunities`)**:
   - Scores opportunities across 8 dimensions: Requirement Clarity, Urgency, Timeline, Solution Fit, Decision Maker Authority, Signal Recency, Company Fit, and Procurement Stage.
   - BANT Qualification matrix (Budget, Authority, Need, Timing) categorizing accounts as HOT, WARM, POTENTIAL, or LOW.

3. **Contextual AI Pre-Call Sales Briefs**:
   - Synthesizes personalized playbooks: why the decision-maker matters, core technical pain points, anticipated objections with counter-strategies, recommended opening statements, and discovery questions.

4. **Autonomous Voice Calling Cockpit (`/calls`)**:
   - Web Speech API + deterministic local fallback engine for sub-second voice synthesis.
   - Clear AI disclosure on every call.
   - Real-time conversation stream with live signal gauges (Sentiment Curve, Interest Level, Objection Detected, Procurement Urgency).
   - Instant human rep handoff with live transfer notification.

5. **Closed-Loop CRM Synchronization (`Salesforce / HubSpot`)**:
   - Auto-creates or updates Contacts, Opportunities, and Call Activity records.
   - Attaches verbatim transcripts, AI call summaries, BANT scores, and recommended next actions.

6. **Outreach Campaigns (`/campaigns`)**:
   - Multi-channel ICP campaign management with intent-gating filters, language selection (`en-US`, `hi-IN`, `gu-IN`), and call window parameters.

7. **Pipeline & Telemetry Analytics (`/analytics`)**:
   - 10 core real-time metrics and 5 interactive telemetry charts (Opportunity Funnel, Intent Progression, Multi-Channel Sourcing, Industry Distribution, Campaign Performance).

8. **Enterprise Observability & Security Audit Trail (`/admin`)**:
   - Real-time subsystem health monitoring and immutable transactional activity logging for every AI decision.

---

## 📋 Comprehensive Audit Suite

IntentOS ships with an automated multi-stage audit system located in `scripts/audit/`:

```bash
npm run audit
```

```text
╔════════════════════════════════════════════╗
║             INTENTOS AUDIT                 ║
╠════════════════════════════════════════════╣
║ Project Structure         PASS             ║
║ Type Safety               PASS             ║
║ Lint                      PASS             ║
║ Unit Tests                PASS             ║
║ Integration Tests         PASS             ║
║ E2E Tests                 PASS             ║
║ Markup                    PASS             ║
║ Features                  PASS             ║
║ Security                  PASS             ║
║ Hero Demo                 PASS             ║
╠════════════════════════════════════════════╣
║ Overall Score             100 / 100        ║
╚════════════════════════════════════════════╝
```

---

## 📚 Documentation Index

- **[System Architecture](file:///docs/ARCHITECTURE.md)**: Deep dive into the data model, scoring engine, AI pipelines, and voice subsystems.
- **[Feature Matrix & Specification](file:///docs/FEATURES.md)**: Exhaustive breakdown of all platform features and capabilities.
- **[Step-by-Step Walkthrough](file:///docs/WALKTHROUGH.md)**: Guided tour through the core user flows.
- **[6–7 Minute Demo Script](file:///docs/DEMO_SCRIPT.md)**: Complete script and talking points for judge presentations.
- **[API Reference](file:///docs/API.md)**: Endpoints, request/response schemas, and validation rules.
- **[Security Audit & Baseline](file:///docs/SECURITY.md)**: Security boundaries, zero-trust policies, and secret scanning report.
- **[Master Audit Report](file:///docs/AUDIT_REPORT.md)**: Detailed test logs and audit metrics.
- **[Final Implementation Status](file:///docs/FINAL_IMPLEMENTATION_STATUS.md)**: Task-by-task verification matrix.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript 5 (Strict Mode)
- **Database / ORM**: SQLite + Prisma ORM
- **UI & Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons, Recharts
- **Testing**: Vitest (Unit & Integration), Playwright (E2E & Responsive QA)
- **AI Providers**: Deterministic Local Provider + Optional Ollama Local LLM Adapter
- **Voice Engine**: Web Speech API Synthesis + Fallback Audio Simulation
