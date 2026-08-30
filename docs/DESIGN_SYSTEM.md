# IntentOS — Design System & Component Library Reference

---

## 1. Design Philosophy & Aesthetic Principles

IntentOS is crafted around the standards of modern **Enterprise B2B AI SaaS**:
- **Alignment before decoration**: Information is organized on a strict grid with consistent spacing and optical alignment.
- **Hierarchy before color**: Visual priority is established through typography size, weight, and density before introducing color accents.
- **Readability before visual effects**: Crisp typography, high contrast ratios (WCAG AA/AAA compliant), and dark neutral backgrounds ensure zero eye fatigue.
- **Semantic color coding**: Color is used purposefully to communicate status, urgency, and category.

---

## 2. Color Palette & Design Tokens

Defined in `src/app/globals.css`:

### Neutral Dark Canvas
- **Background**: `hsl(222, 47%, 4%)` (`#030712` / slate-950)
- **Card / Surface**: `hsl(217, 33%, 9%)` (`#0f172a` / slate-900/60)
- **Border / Divider**: `hsl(217, 24%, 17%)` (`#1e293b` / slate-800)
- **Muted Foreground**: `hsl(215, 20%, 65%)` (`#94a3b8` / slate-400)
- **Primary Foreground**: `hsl(210, 40%, 98%)` (`#f8fafc` / slate-100)

### Semantic Accent Palettes
- **Primary Brand / Action (Blue)**:
  - Background: `bg-blue-950/40`
  - Border: `border-blue-500/30`
  - Text: `text-blue-400`
- **Positive / High-Intent / Success (Emerald)**:
  - Background: `bg-emerald-950/40`
  - Border: `border-emerald-500/30`
  - Text: `text-emerald-400`
- **Hot Alert / Critical Trigger (Rose / Amber)**:
  - Background: `bg-rose-950/40`
  - Border: `border-rose-500/30`
  - Text: `text-rose-400`
- **Intelligence / Analytics (Indigo / Purple)**:
  - Background: `bg-indigo-950/40`
  - Border: `border-indigo-500/30`
  - Text: `text-indigo-400`

---

## 3. Typography System

- **Primary Sans Font**: System UI / Inter (`font-sans` for UI labels, titles, table contents, and descriptions).
- **Code & Telemetry Monospace**: `font-mono` (used selectively for timestamps, intent scores, IDs, and raw signal strings).

### Type Hierarchy
- `h1`: `text-xl sm:text-2xl font-bold tracking-tight text-slate-100 uppercase`
- `h2`: `text-base sm:text-lg font-semibold text-slate-100`
- `h3`: `text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300`
- `body`: `text-xs sm:text-sm text-slate-300 leading-relaxed`
- `caption / subtitle`: `text-[10px] sm:text-xs text-slate-400`

---

## 4. Component Catalog

### 1. MetricCard (`src/components/shared/metric-card.tsx`)
High-density KPI display with semantic icon containers, value, and subtitle:
```tsx
<MetricCard
  title="Active Opportunities"
  value={105}
  subtitle="+12 this week"
  icon={Target}
  variant="blue"
  trend={{ direction: 'up', value: '14%' }}
/>
```

### 2. StatusBadge (`src/components/shared/status-badge.tsx`)
Standardized badge for opportunities, stages, sources, and qualification:
```tsx
<StatusBadge status="QUALIFIED" type="status" />
<StatusBadge status="HOT" type="intent" />
<StatusBadge status="LINKEDIN" type="source" />
```

### 3. GuidedDemo (`src/components/shared/guided-demo.tsx`)
Interactive 11-step walkthrough modal featuring step indicators, animated progress bar, and direct navigation links.

### 4. DetailLoadingSkeleton & TableLoadingSkeleton (`src/components/shared/loading-skeleton.tsx`)
Smooth pulse placeholder skeletons matching table and card geometries.

### 5. ErrorState & EmptyState (`src/components/shared/error-state.tsx`, `empty-state.tsx`)
Polished empty states with contextual icons, clear explanations, and action triggers.

---

## 5. Responsive Layout Architecture

- **Desktop (1024px+)**: Fixed 240px navigation sidebar with structured sections (`WORKSPACE`, `INTELLIGENCE`, `SYSTEM`), sticky 56px header with search and notification center, and fluid multi-column content grid.
- **Tablet / Mobile (<1024px)**: Responsive hamburger menu trigger, sliding drawer sidebar with backdrop blur, and stacked single-column layouts with horizontal overflow scrolling for data tables.
