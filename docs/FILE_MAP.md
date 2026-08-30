# IntentOS — Developer File Map & Codebase Index

---

## 1. Directory Structure Overview

```
├── docs/                        # Complete technical documentation suite
│   ├── ARCHITECTURE.md          # Full architecture diagram & data flows
│   ├── DESIGN_SYSTEM.md         # Design tokens, components & style guidelines
│   ├── FILE_MAP.md              # Developer codebase index & map
│   ├── HOW_THE_DEMO_WORKS.md    # Hero SharePoint walkthrough guide
│   ├── JUDGE_WALKTHROUGH.md     # 6-7 minute judge evaluation script
│   ├── LEARN_IN_15_MINUTES.md   # Developer onboarding & quick start guide
│   ├── PROJECT_WALKTHROUGH.md   # 19-section comprehensive master reference
│   ├── UI_UX_AUDIT_BEFORE.md    # Pre-redesign audit baseline
│   └── UI_UX_AUDIT_AFTER.md     # Post-redesign audit & verification report
├── prisma/                      # Database models & migrations
│   ├── schema.prisma            # SQLite relational database schema
│   └── dev.db                   # Local SQLite database instance
├── scripts/                     # Seed and validation scripts
│   ├── seed.ts                  # Deterministic database seeding script (105+ opps)
│   └── audit/                   # Verification and QA audit scripts
│       ├── master-audit.mjs     # Master 11-step project audit runner
│       ├── verify-ui.mjs        # UI/UX & Design System validation script
│       ├── verify-markup.mjs    # DOM test ID & string markup verification
│       ├── verify-models.mjs    # Database model & schema verification
│       ├── verify-routes.mjs    # API route endpoint verification
│       └── ...                  # Specialized sub-audits
├── src/                         # Application source code
│   ├── app/                     # Next.js 15 App Router pages & API routes
│   │   ├── admin/page.tsx       # System Observability & Audit Logs
│   │   ├── analytics/page.tsx   # Conversion & Pipeline Telemetry Analytics
│   │   ├── api/                 # RESTful backend API Route Handlers
│   │   │   ├── admin/           # Admin metrics & audit logs API
│   │   │   ├── analytics/       # Pipeline conversion analytics API
│   │   │   ├── calls/           # Voice call sessions, start, end, handoff, CRM push
│   │   │   ├── campaigns/       # Campaigns CRUD and lead management API
│   │   │   ├── demo/reset/      # Deterministic demo database reset API
│   │   │   ├── intelligence/    # Account firmographics & signals API
│   │   │   └── opportunities/   # Opportunities CRUD, filtering, detail, brief API
│   │   ├── calls/page.tsx       # AI Voice Call Cockpit & Completed Sessions
│   │   ├── calls/[id]/page.tsx  # Post-Call Conversation Intelligence & Transcript
│   │   ├── campaigns/page.tsx   # Autonomous Outreach Campaigns Table
│   │   ├── campaigns/[id]/page.tsx # Campaign Management Studio
│   │   ├── dashboard/page.tsx   # Executive Sales Command Center & Priority Queue
│   │   ├── discover/page.tsx    # Public Intent Discovery Scanner
│   │   ├── globals.css          # Design system tokens, variables & typography
│   │   ├── intelligence/page.tsx # Account & Firmographic Intelligence
│   │   ├── layout.tsx           # Root application layout
│   │   ├── login/page.tsx       # Enterprise Login Screen
│   │   ├── onboarding/page.tsx  # 7-Step Workspace Setup Wizard
│   │   ├── opportunities/page.tsx # Opportunity Explorer & Multi-Facet Filtering
│   │   ├── opportunities/[id]/page.tsx # Hero Opportunity Detail & Sales Brief
│   │   └── settings/page.tsx    # Platform Settings & Demo Control Center
│   ├── components/              # Reusable React components
│   │   ├── layout/              # Layout structural components
│   │   │   ├── header.tsx       # Sticky top navigation bar & notification center
│   │   │   ├── main-layout.tsx  # Application layout container & guided demo wire-up
│   │   │   └── sidebar.tsx      # Grouped navigation sidebar & demo trigger
│   │   ├── shared/              # Domain-specific shared components
│   │   │   ├── empty-state.tsx  # Clean empty state placeholder
│   │   │   ├── error-state.tsx  # Error boundary & retry component
│   │   │   ├── guided-demo.tsx  # 11-Step interactive in-app tour modal
│   │   │   ├── loading-skeleton.tsx # Table & detail skeleton loaders
│   │   │   ├── metric-card.tsx  # High-density enterprise metric card
│   │   │   └── status-badge.tsx # Semantic status, stage & source badge
│   │   └── ui/                  # Base UI design primitives
│   │       ├── button.tsx       # Standard button component with variants
│   │       ├── card.tsx         # Standard card container
│   │       └── input.tsx        # Standard text input
│   ├── lib/                     # Core business logic, scorers, & utilities
│   │   ├── intelligence/        # Scoring & brief generation logic
│   │   │   ├── bant-qualifier.ts # BANT qualification evaluator
│   │   │   ├── intent-scorer.ts # 5-dimensional intent scoring algorithm
│   │   │   └── sales-brief.ts   # Pre-call sales briefing generator
│   │   ├── voice/               # Conversational AI & voice engine
│   │   │   ├── demo-voice-provider.ts # Local WebAudio synthesis provider
│   │   │   └── scenarios.ts     # Multilingual voice qualification scenarios
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── utils.ts             # Tailwind class merging (cn utility)
│   └── types/                   # TypeScript type definitions
│       ├── index.ts             # Core domain models & API response types
│       └── voice.ts             # Voice turn, signal, and scenario types
├── tests/                       # Automated test suites
│   ├── e2e/                     # Playwright End-to-End browser tests
│   │   ├── navigation-responsive.spec.ts # Navigation & responsiveness tests
│   │   └── voice-workflow.spec.ts # Hero voice qualification E2E flow
│   └── unit/                    # Vitest unit test suites
│       ├── bant-qualifier.test.ts # BANT scoring unit tests
│       ├── campaigns.test.ts    # Campaign orchestration tests
│       ├── crm-sync.test.ts     # CRM synchronization tests
│       ├── demo-voice-provider.test.ts # Voice provider tests
│       ├── intent-scorer.test.ts # Intent scoring algorithm unit tests
│       ├── sales-brief.test.ts  # Sales brief generator tests
│       └── voice-scenarios.test.ts # Voice scenario validation tests
├── package.json                 # Project dependencies & scripts
├── playwright.config.ts         # Playwright test configuration
├── tailwind.config.ts           # TailwindCSS styling configuration
├── tsconfig.json                # TypeScript compiler configuration
└── vitest.config.ts             # Vitest test runner configuration
```

---

## 2. Key File Responsibilities

| File Path | Description / Responsibility |
|---|---|
| `src/app/dashboard/page.tsx` | Executive Command Center featuring 7 KPIs, dominant AI Priority Queue, Stage Conversion Funnel, and Live Activity Log. |
| `src/app/opportunities/[id]/page.tsx` | Hero Opportunity Detail with 5D Intent breakdown, Why Now? trigger, AI Pre-Call Sales Brief, BANT Qualification, and Next Best Action. |
| `src/app/calls/page.tsx` | AI Voice Call Cockpit with real-time turn ingestion, live signal detector, multilingual selector, operator controls, and post-call analysis. |
| `src/lib/intelligence/intent-scorer.ts` | 5-dimensional weighted scoring algorithm with deterministic fallback. |
| `src/lib/voice/scenarios.ts` | Deterministic voice qualification dialogues for English, Hindi, and Gujarati scenarios. |
| `src/components/shared/guided-demo.tsx` | 11-step interactive product tour covering the full autonomous workflow. |
| `scripts/seed.ts` | Benchmark seed script populating 105+ opportunities, 20 companies, 10 campaigns, and 20 call sessions. |
| `scripts/audit/master-audit.mjs` | Master qualification audit script validating all functional requirements. |
| `scripts/audit/verify-ui.mjs` | UI/UX and design system verification script ensuring enterprise aesthetics and test ID integrity. |
