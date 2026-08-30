# IntentOS — Implementation Status & Architecture

**Product**: INTENTOS — AI Sales Intelligence  
**Tagline**: "Turn public buying signals into sales-ready opportunities."  
**Date**: August 2026  
**Status**: Task 2 — AI Sales Intelligence Engine (COMPLETE)

---

## 1. AI Architecture Overview

IntentOS implements a modular, deterministic, multi-stage sales intelligence pipeline operating 100% locally with zero external or paid API dependencies, and an optional Ollama adapter.

### Pipeline Flow:
```
PUBLIC REQUIREMENT
       ↓
REQUIREMENT UNDERSTANDING (Problem, Solution, Scope, Tech, Urgency, Buying Stage, Authority)
       ↓
INTENT ANALYSIS (8 Normalized Dimensions: Clarity, Urgency, Timeline, Fit, Decision Maker, Recency, Company Fit, Stage)
       ↓
EVIDENCE ENGINE ("Why This Lead?" & "Why Now?" high-velocity signals)
       ↓
COMPANY FIT (Capability match, Industry match, Technology match, Location match)
       ↓
QUALIFICATION (BANT Fit + Hot/Warm/Potential/Low Classification)
       ↓
AI SALES BRIEF (Pre-call brief, Pain points, Objection counter-strategies, Opening statement, Discovery questions)
       ↓
NEXT-BEST-ACTION (Autonomous recommendation, Action rationale, Outreach message, Priority)
```

---

## 2. AI Providers

- **`AIProvider`**: Standardized interface for requirements analysis, scoring, evidence generation, fit calculation, lead qualification, sales briefs, and next-best actions.
- **`LocalDemoAIProvider`**: Default deterministic local AI provider utilizing semantic taxonomies, pattern extraction, BANT scoring algorithms, and contextual sales synthesis.
- **`OllamaProvider`**: Local LLM adapter with automated resilient fallback to `LocalDemoAIProvider` if Ollama is offline.
- **Provider Resolver**: `getAIProvider()` reads `AI_PROVIDER` (`demo` by default).

---

## 3. 8-Dimension Intent Engine

Scores are normalized from 0 to 100 with full transparency:

| Dimension | Formula / Source | Hero Lead (ABC Tech) |
| :--- | :--- | :--- |
| **Requirement Clarity** | Sub-requirements count & explicit technical specs | 96 / 100 |
| **Urgency** | Extracted procurement timeframe & RFP triggers | 91 / 100 |
| **Timeline** | Normalized deadline (30 days vs 90 days vs immediate) | 89 / 100 |
| **Solution Fit** | Modernization capability alignment | 97 / 100 |
| **Decision Maker** | Title authority weight (CTO / VP / CIO) | 82 / 100 |
| **Recency** | Public signal freshness | 98 / 100 |
| **Company Fit** | Scale & vertical alignment | 93 / 100 |
| **Buying Stage** | Procurement phase (Vendor Selection / RFP) | 95 / 100 |
| **Overall Intent Score** | Normalized weighted score | **94 / 100** |

---

## 4. Opportunity Detail UI (13 Core Sections)

1. **Lead Profile**: Decision maker info, contact details, company location.
2. **Intent Score**: Autonomous score gauge (94/100).
3. **Score Breakdown**: 8 individual dimension ratings.
4. **Requirement**: Structured problem, requested solution, and extracted component pills.
5. **Why This Lead?**: Extracted evidence checklist.
6. **Evidence**: Raw public signal quote and platform metadata.
7. **Company Intelligence**: Tech stack, hiring velocity, growth signals, funding scale.
8. **Why Now?**: High-velocity trigger events.
9. **Qualification**: BANT scores, heat category (HOT), and reasoning.
10. **AI Sales Brief**: Why decision maker matters, pain points, objection counter-strategies, opening statement, discovery questions, desired outcome.
11. **Next Best Action**: Priority action, reason bullets, suggested message.
12. **Source**: Sourcing platform and link.
13. **Activity**: Event audit trail logging all analysis and brief generations.

Interactive Controls:
- `[Analyze Opportunity]`: Runs complete pipeline, updates DB, logs activity.
- `[Generate Sales Brief]`: Regenerates tailored pre-call brief and objection handling.
- `[Recalculate Score]`: Recomputes intent and fit metrics.
- `[Launch AI Voice Call]`: Dispatches autonomous voice outreach session.

---

## 5. Verification & Test Results

- [x] **Typecheck (`npm run typecheck`)**: 0 errors in strict TypeScript mode.
- [x] **Lint (`npm run lint`)**: 0 errors, 0 warnings.
- [x] **Unit & Integration Tests (`npm run test`)**: 19 / 19 tests passing.
- [x] **Production Build (`npm run build`)**: 23 static & dynamic routes compiled.
- [x] **E2E Tests (`npm run test:e2e`)**: 9 / 9 tests passing (Desktop & Mobile 375px).
- [x] **Deterministic Hero Lead (ABC Technologies)**:
  - Intent Score: 94 / 100
  - Solution Fit: 96%
  - Qualification Score: 92% (HOT)
  - Urgency: HIGH
  - Timeline: Next 30 Days
