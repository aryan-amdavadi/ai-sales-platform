import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

console.log('\n========================================');
console.log('INTENTOS MARKUP AUDIT');
console.log('========================================');

const requiredMarkups = [
  {
    page: 'Dashboard',
    file: 'src/app/dashboard/page.tsx',
    checks: [
      { name: 'main / dashboard container', pattern: /dashboard-page/ },
      { name: 'metrics cards', pattern: /MetricCard/ },
      { name: 'priority queue (data-testid="hero-queue")', pattern: /data-testid="hero-queue"/ },
      { name: 'funnel visualization (data-testid="funnel-visualization")', pattern: /data-testid="funnel-visualization"/ },
    ],
  },
  {
    page: 'Opportunity Detail',
    file: 'src/app/opportunities/[id]/page.tsx',
    checks: [
      { name: 'opportunity detail container', pattern: /data-testid="opportunity-detail"/ },
      { name: 'intent score (data-testid="intent-score")', pattern: /data-testid="intent-score"/ },
      { name: 'evidence panel (data-testid="evidence-panel")', pattern: /data-testid="evidence-panel"/ },
      { name: 'sales brief (data-testid="sales-brief")', pattern: /data-testid="sales-brief"/ },
      { name: 'next best action (data-testid="next-best-action")', pattern: /data-testid="next-best-action"/ },
      { name: 'call action (data-testid="call-action")', pattern: /data-testid="call-action"/ },
      { name: 'company intelligence', pattern: /COMPANY INTELLIGENCE/i },
      { name: 'requirement analysis', pattern: /PUBLIC BUYING REQUIREMENT/i },
    ],
  },
  {
    page: 'Call Cockpit & Analysis',
    file: 'src/app/calls/page.tsx',
    checks: [
      { name: 'call cockpit container', pattern: /data-testid="call-cockpit"/ },
      { name: 'call status (data-testid="call-status")', pattern: /data-testid="call-status"/ },
      { name: 'conversation turn stream (data-testid="conversation")', pattern: /data-testid="conversation"/ },
      { name: 'live signal gauges (data-testid="live-signals")', pattern: /data-testid="live-signals"/ },
      { name: 'live transcript panel (data-testid="transcript")', pattern: /data-testid="transcript"/ },
      { name: 'end call control (data-testid="end-call")', pattern: /data-testid="end-call"/ },
      { name: 'human handoff control (data-testid="human-handoff")', pattern: /data-testid="human-handoff"/ },
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
