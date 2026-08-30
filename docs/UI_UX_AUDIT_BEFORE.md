# IntentOS — Comprehensive UI/UX Audit (BEFORE Redesign)

**Document**: Initial UI/UX & Design Systems Audit  
**Platform**: IntentOS — AI Sales Platform  
**Target Goal**: Transition from cyberpunk/hacker aesthetic to **Premium Enterprise AI SaaS**  
**Date**: August 2026  

---

## 1. Visual & Aesthetic Problems (Cyberpunk & Gaming Artifacts)

- **Excessive Neon Teal & Cyan Accents**: `text-teal-400`, `bg-teal-500/10`, `border-teal-500/40`, and glowing effects give a sci-fi/terminal interface impression rather than a trustworthy, executive enterprise product.
- **Overuse of Glowing Badges & Shadows**: Shadow effects (`glow-teal`, pulsing neon indicators) distract from data readability and executive decision-making.
- **Dark Glassmorphism Clutter**: Translucent glass backgrounds with heavy borders (`glass-panel`) create visual noise rather than clean layer hierarchy.
- **Inconsistent Card Containers**: Cards across pages use disparate background opacity (`bg-slate-900/80`, `bg-slate-950/90`, `bg-slate-900/70`, `bg-teal-950/20`), causing disjointed visual rhythm.

---

## 2. Typography & Text Hierarchy Problems

- **Indiscriminate Monospace Font Usage**: `font-mono` is applied to page headers, body text, buttons, subtitles, and tables. Monospace should be reserved strictly for numerical scores, timestamps, and code artifacts. General UI copy must use a clean, legible sans-serif (Inter / System Sans).
- **Excessive Uppercase Text**: Section titles, badges, and button labels are frequently rendered in uppercase (`ALL CAPS`), increasing cognitive load and giving an aggressive, terminal-like tone.
- **Arbitrary Font Sizing**: Text sizes jump between `text-[10px]`, `text-[11px]`, `text-xs`, `text-sm`, `text-base` without a strict scale token system.
- **Weak Weight Hierarchy**: Key metrics and secondary descriptors often share similar font weights, failing to guide the user's eye to the primary actionable data.

---

## 3. Spacing, Alignment & Grid System Problems

- **Non-Standard Padding & Margins**: Components employ arbitrary spacing (`p-3.5`, `p-5`, `p-6`, `gap-3.5`, `py-0.2`) rather than adhering to an 8px grid rhythm (4px, 8px, 12px, 16px, 20px, 24px, 32px, 48px).
- **Unequal Visual Weight**: On the Dashboard, the AI Priority Queue does not visually dominate secondary widgets like the funnel or raw charts.
- **Misaligned Table Headers & Columns**: Tables across Opportunities, Campaigns, and Admin pages lack uniform padding, vertical alignment, and consistent column width allocations.

---

## 4. Navigation & Layout Structure Problems

- **Sidebar Flat Organization**: Sidebar navigation items are presented in a flat single block rather than grouped by clear domain sections (WORKSPACE, INTELLIGENCE, SYSTEM).
- **Top Header Clutter**: Header contains multiple competing elements with glowing indicator pills and inconsistent search keyboard shortcuts.
- **Missing In-App Interactive Tour**: Evaluators and judges currently lack a guided, step-by-step interactive walkthrough that explains the 11 key milestones directly within the live UI.

---

## 5. Screen-by-Screen Detailed Deficiencies

### Dashboard (`/dashboard`)
- Equal visual weight between priority targets and general summary cards.
- Metric cards use neon borders and low-contrast subtitle text.
- Priority queue lacks rich, scannable "Why Now?" insights directly on the card preview.

### Opportunity Detail & Hero Screen (`/opportunities/[id]`)
- 13 dense panels presented with high visual noise and repeated card styles.
- 8-Dimension Intent breakdown lacks a clean, modern analytical bar comparison.
- Evidence Panel and "Why Now?" trigger signals are buried under heavy dark borders.
- Pre-Call Sales Brief looks like raw AI text instead of an executive briefing playbook.

### AI Voice Cockpit (`/calls`)
- Gaming HUD-style layout with pulsing badges and sci-fi aesthetic.
- Needs to look like a premium executive communications workspace with clear conversation turns and clean live signal gauges.

### Analytics (`/analytics`)
- Charts lack standardized card padding, clean legends, and cohesive executive color palettes.
- Recharts tooltips use high-contrast dark borders with monospace typography.

### Outreach Campaigns (`/campaigns`)
- Table columns feel cramped and lack clear conversion progress indicators.

---

## 6. Target Enterprise Redesign Plan

1. **Design System & Tokens**: Clean neutral surfaces (`zinc-950` / `slate-950`), subtle borders (`border-slate-800/60`), professional accent color (refined Indigo/Blue/Slate), semantic status tokens (Emerald, Amber, Rose).
2. **Typography Standardization**: Pure sans-serif (Inter) for all headings, labels, buttons, and paragraphs; tabular monospace restricted solely to numerical IDs and raw scores.
3. **Structured Information Hierarchy**: Dominant AI Priority Queue, high-contrast action buttons, clear visual groupings.
4. **Interactive Guided Demo Component**: 11-step interactive tour modal with step highlights, direct route jumps, and Next/Prev/Skip controls.
5. **Full Component & Page Overhaul**: Refactor all 12 core routes to meet highest B2B SaaS standards.
