import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

console.log('\n========================================');
console.log('INTENTOS MARKUP & SEMANTIC STRUCTURE AUDIT');
console.log('========================================');

const requiredMarkups = [
  {
    page: 'Navigation Sidebar',
    file: 'src/components/layout/sidebar.tsx',
    checks: [
      { name: 'nav dashboard (data-testid="nav-dashboard")', pattern: /data-testid="nav-dashboard"/ },
      { name: 'nav discover (data-testid="nav-discover")', pattern: /data-testid="nav-discover"/ },
      { name: 'nav opportunities (data-testid="nav-opportunities")', pattern: /data-testid="nav-opportunities"/ },
      { name: 'nav campaigns (data-testid="nav-campaigns")', pattern: /data-testid="nav-campaigns"/ },
      { name: 'nav ai-calls (data-testid="nav-ai-calls")', pattern: /data-testid="nav-ai-calls"/ },
      { name: 'nav analytics (data-testid="nav-analytics")', pattern: /data-testid="nav-analytics"/ },
      { name: 'nav settings (data-testid="nav-settings")', pattern: /data-testid="nav-settings"/ },
    ],
  },
  {
    page: 'Dashboard',
    file: 'src/app/dashboard/page.tsx',
    checks: [
      { name: 'dashboard container (data-testid="dashboard")', pattern: /data-testid="dashboard"/ },
      { name: 'priority queue (data-testid="priority-queue")', pattern: /data-testid="priority-queue"/ },
      { name: 'metrics container (data-testid="metrics")', pattern: /data-testid="metrics"/ },
      { name: 'opportunity funnel (data-testid="opportunity-funnel")', pattern: /data-testid="opportunity-funnel"/ },
    ],
  },
  {
    page: 'Opportunity Detail',
    file: 'src/app/opportunities/[id]/page.tsx',
    checks: [
      { name: 'opportunity detail container (data-testid="opportunity-detail")', pattern: /data-testid="opportunity-detail"/ },
      { name: 'intent score (data-testid="intent-score")', pattern: /data-testid="intent-score"/ },
      { name: 'evidence panel (data-testid="evidence-panel")', pattern: /data-testid="evidence-panel"/ },
      { name: 'qualification (data-testid="qualification")', pattern: /data-testid="qualification"/ },
      { name: 'sales brief (data-testid="sales-brief")', pattern: /data-testid="sales-brief"/ },
      { name: 'next best action (data-testid="next-best-action")', pattern: /data-testid="next-best-action"/ },
      { name: 'call action (data-testid="call-action")', pattern: /data-testid="call-action"/ },
    ],
  },
  {
    page: 'Call Cockpit & Analysis',
    file: 'src/app/calls/page.tsx',
    checks: [
      { name: 'call cockpit container (data-testid="call-cockpit")', pattern: /data-testid="call-cockpit"/ },
      { name: 'call status (data-testid="call-status")', pattern: /data-testid="call-status"/ },
      { name: 'conversation stream (data-testid="conversation")', pattern: /data-testid="conversation"/ },
      { name: 'live signals (data-testid="live-signals")', pattern: /data-testid="live-signals"/ },
      { name: 'transcript panel (data-testid="transcript")', pattern: /data-testid="transcript"/ },
      { name: 'end call control (data-testid="end-call")', pattern: /data-testid="end-call"/ },
      { name: 'human handoff control (data-testid="human-handoff")', pattern: /data-testid="human-handoff"/ },
      { name: 'crm sync (data-testid="crm-sync")', pattern: /data-testid="crm-sync"/ },
    ],
  },
];

let totalChecks = 0;
let passedChecks = 0;

for (const group of requiredMarkups) {
  console.log(`\n[Checking ${group.page}]:`);
  const filePath = path.join(rootDir, group.file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ✗ Missing component file: ${group.file}`);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const check of group.checks) {
    totalChecks++;
    if (check.pattern.test(content)) {
      console.log(`  ✓ ${check.name}: PASS`);
      passedChecks++;
    } else {
      console.error(`  ✗ ${check.name}: FAIL (missing required markup/testid)`);
    }
  }
}

console.log('\n----------------------------------------');
console.log(`Markup Checks: ${passedChecks}/${totalChecks} Passed`);

if (passedChecks === totalChecks) {
  console.log('MARKUP AUDIT: PASS');
  process.exit(0);
} else {
  console.error('MARKUP AUDIT: FAIL');
  process.exit(1);
}
