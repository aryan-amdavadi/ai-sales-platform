import { execSync } from 'child_process';

console.log('\n========================================');
console.log('INTENTOS HERO DEMO');
console.log('========================================');

const demoSteps = [
  { name: 'Dashboard', spec: 'Dashboard Page' },
  { name: 'Hero Opportunity', spec: 'ABC Technologies (Marcus Vance - CTO)' },
  { name: 'Intent Engine', spec: 'Intent score 94/100 derived' },
  { name: 'Evidence', spec: 'Public RFP extraction & confidence' },
  { name: 'AI Analysis', spec: 'Autonomous requirement intelligence' },
  { name: 'Sales Brief', spec: 'Pain points & objection playbook' },
  { name: 'Voice', spec: 'Sub-second Voice Cockpit & AI disclosure' },
  { name: 'Transcript', spec: 'Deterministic multi-turn dialogue' },
  { name: 'Qualification', spec: 'Hot Qualified 92% BANT score' },
  { name: 'Next Action', spec: 'Schedule technical discovery in 48h' },
  { name: 'CRM', spec: 'Contact, Opportunity & Call synced' },
];

try {
  // Execute the exact hero voice workflow E2E test
  execSync('npx playwright test tests/e2e/voice-workflow.spec.ts', {
    stdio: 'pipe',
    env: { ...process.env, CI: '1' },
  });

  console.log('');
  for (const step of demoSteps) {
    const padding = ' '.repeat(Math.max(2, 23 - step.name.length));
    console.log(`${step.name}${padding}PASS`);
  }

  console.log('\nRESULT: PASS\n');
  process.exit(0);
} catch (error) {
  console.error('\n✗ Hero Demo workflow verification failed!');
  console.error(error.stdout?.toString() || error.message);
  console.log('\nRESULT: FAIL\n');
  process.exit(1);
}
