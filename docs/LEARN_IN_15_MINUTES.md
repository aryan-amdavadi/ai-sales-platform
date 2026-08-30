# IntentOS — Learn in 15 Minutes: Developer Onboarding & Architecture Primer

---

## ⏱️ Minute 0 – 3: What is IntentOS?

**IntentOS** is an autonomous sales intelligence platform designed to replace manual outbound prospecting. It continuously discovers public buying signals (RFPs, project announcements, infrastructure modernization needs), scores them using a transparent 5-dimensional intent model, generates pre-call briefs, and qualifies prospects through conversational AI voice calls.

### Core Concepts
1. **Opportunity / Lead**: A verified corporate entity with a detected procurement requirement.
2. **Intent Score**: A 0–100 score computed across 5 weighted dimensions (Fit, Urgency, Authority, ICP, Reliability).
3. **BANT Qualification**: Real-time evaluation of Budget, Authority, Need, and Timing.
4. **Call Cockpit**: Bidirectional conversational voice agent with live signal extraction.

---

## ⏱️ Minute 3 – 7: Project Structure & Key Files

The codebase is organized as a modern Next.js 15 App Router application:

```
src/
├── app/                  # Application Routes & API Endpoints
│   ├── dashboard/        # Command center with AI Priority Queue
│   ├── opportunities/    # Opportunity Explorer & Detail views
│   ├── calls/            # Voice outreach cockpit & Post-call review
│   ├── discover/         # Public intent discovery scanner
│   ├── intelligence/     # Account firmographics & signals
│   ├── campaigns/        # Autonomous outreach campaigns
│   ├── analytics/        # Pipeline conversion analytics
│   ├── admin/            # Observability & audit trail
│   └── settings/         # Configuration & demo reset
├── components/
│   ├── layout/           # Sidebar, Header, MainLayout
│   ├── shared/           # MetricCard, StatusBadge, GuidedDemo, Skeletons
│   └── ui/               # Radix UI + Tailwind primitives (Button, Card, Input)
├── lib/
│   ├── intelligence/     # Intent Scorer, BANT Qualifier, Sales Brief
│   └── voice/            # Voice Scenarios & DemoVoiceProvider
└── types/                # Strict TypeScript schemas
```

---

## ⏱️ Minute 7 – 10: Running Locally & Development Commands

### 1. Setup & Environment
```bash
# Clone repository
git clone https://github.com/aryan-amdavadi/ai-sales-platform.git
cd AI-SALES_PLATFORM

# Install dependencies
npm install

# Initialize local SQLite database & seed benchmark records
npm run db:push
npm run db:seed
```

### 2. Development Server
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### 3. Verification & Testing Commands
```bash
# Run unit & logic tests (Vitest)
npm run test

# Run UI/UX and design system audit
npm run audit:ui

# Run master qualification audit
npm run audit

# Run full TypeScript check & linting
npm run typecheck
npm run lint
```

---

## ⏱️ Minute 10 – 13: How the Core Logic Works

### Multidimensional Intent Scorer (`src/lib/intelligence/intent-scorer.ts`)
```typescript
import { calculateIntentScore } from '@/lib/intelligence/intent-scorer';

const scoreResult = calculateIntentScore({
  requirementText: "Urgent RFP: Migrating SharePoint 2016 to SharePoint Online...",
  authorTitle: "Chief Technology Officer",
  companySize: "500-1000",
  sourceChannel: "LINKEDIN"
});

console.log(scoreResult.score); // 94
console.log(scoreResult.breakdown);
// { fit: 95, urgency: 92, authority: 95, icp: 90, channel: 90 }
```

### BANT Qualification Evaluator (`src/lib/intelligence/bant-qualifier.ts`)
Evaluates prospect responses turn-by-turn to extract:
- **Budget**: Pipeline valuation match ($150,000 ARR).
- **Authority**: Decision maker role validation (CTO).
- **Need**: Core technical pain point extraction (Zero downtime migration).
- **Timing**: Procurement timeframe validation (30–60 days).

---

## ⏱️ Minute 13 – 15: Extending the Platform

### Adding a New Voice Scenario
1. Open `src/lib/voice/scenarios.ts`.
2. Add your scenario object with custom AI statements, prospect responses, and signal detections.
3. Reference the scenario ID in `src/app/calls/page.tsx`.

### Customizing Ingestion Feeds
1. Add new procurement source channels to `prisma/schema.prisma` (`SourceType` enum).
2. Update the normalization parser in `src/lib/intelligence/intent-scorer.ts`.
3. Re-run `npm run db:generate && npm run db:seed`.
