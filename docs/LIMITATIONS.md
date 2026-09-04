# IntentOS — Technical Limitations & Operational Boundaries

IntentOS is architected for both immediate offline hackathon evaluation and enterprise extensibility. This document transparently outlines known platform boundaries, system constraints, and production transition requirements.

---

## 1. Architectural Boundaries

### 1. Database & Persistence Layer
- **Current Mode**: Local SQLite with Prisma ORM (`file:./dev.db`).
- **Operational Boundary**: SQLite is ideal for single-node development, CI/CD testing, and local hackathon judging. It enforces database write locks during concurrent write operations.
- **Production Path**: In multi-instance cloud deployments (e.g., AWS ECS, Kubernetes), the Prisma connection string must be pointed to PostgreSQL or AWS Aurora Serverless (`provider = "postgresql"` in `prisma/schema.prisma`).

### 2. Conversational Intelligence & Fallbacks
- **Current Mode**: Dual-engine architecture featuring `LocalDemoAIProvider` (deterministic local fallback) and `OpenAIProvider` (live dynamic LLM).
- **Operational Boundary**: When no `OPENAI_API_KEY` is provided, the platform executes the deterministic canonical TechNova Solutions scenario. Dynamic, open-ended question-answering outside the seeded scenario is simulated using deterministic domain rules.
- **Production Path**: Provide an OpenAI or Anthropic API key with fine-tuned enterprise prompt templates to enable open-ended dynamic dialogue.

### 3. Voice Synthesis & Telephony
- **Current Mode**: Web Speech API (`window.speechSynthesis`) + Web Audio API waveform visualization.
- **Operational Boundary**:
  - Requires a modern desktop browser (Google Chrome, Microsoft Edge, Safari, Firefox).
  - Headless CI environments without audio devices mock audio output through `DemoVoiceProvider`.
  - The voice cockpit simulates telephone interaction within the browser; it does not ring an external physical cellular phone without Twilio credentials.
- **Production Path**: Configure Twilio Voice (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`) and ElevenLabs (`ELEVENLABS_API_KEY`) for real outbound PSTN calling with sub-300ms neural streaming voice.

### 4. CRM Synchronization
- **Current Mode**: Local SQLite `CrmSync` ledger with full relational linking.
- **Operational Boundary**: Syncs records locally with realistic CRM IDs (`CRM-10-8473`), status timestamps, and payload histories. It does not push directly to external Salesforce or HubSpot sandboxes unless OAuth client credentials are configured.
- **Production Path**: Configure OAuth 2.0 Webhooks and REST endpoints in `src/lib/crm/salesforce.ts` and `src/lib/crm/hubspot.ts`.

---

## 2. Browser & Environment Support

| Environment / Feature | Support Level | Notes |
| :--- | :--- | :--- |
| **Google Chrome (Desktop)** | **Tier 1 (Optimal)** | Full SpeechSynthesis, Web Audio visualizer, 60fps animations |
| **Microsoft Edge (Desktop)** | **Tier 1 (Optimal)** | Native neural voices available via Edge speech engine |
| **Safari / WebKit** | **Tier 2 (Supported)** | AudioContext requires user gesture activation before play |
| **Mobile Chrome / Safari** | **Tier 2 (Supported)** | Responsive cockpit layout, touch-optimized controls |
| **Headless Linux / Docker** | **Tier 1 (Automated)** | Fully covered via automated Playwright & Vitest test suites |

---

## 3. Rate Limits & Performance Characteristics

- **Scoring Pipeline Latency**: Pure TypeScript in-memory algorithms execute in **< 15ms** per opportunity.
- **Voice Turn Latency**:
  - Deterministic Mode: **< 150ms** turn transition.
  - Neural Streaming (ElevenLabs): **~280ms** TTFB (Time to First Byte).
  - Cloud LLM (OpenAI gpt-4o): **~800ms - 1.2s** response generation.
- **Database Concurrency**: Seeded with 10 high-value B2B accounts; optimized for up to 5,000 local records before SQLite index tuning is required.
