import { execSync } from 'child_process';

console.log('\n========================================');
console.log('STARTING MASTER INTENTOS AUDIT PIPELINE');
console.log('========================================\n');

const auditResults = {
  project: false,
  typecheck: false,
  lint: false,
  unitTests: false,
  integrationTests: false,
  e2eTests: false,
  ui: false,
  markup: false,
  features: false,
  loc: false,
  security: false,
  heroDemo: false,
  dataConsistency: false,
};

function runStep(name, cmd) {
  process.stdout.write(`• Running ${name}... `);
  try {
    execSync(cmd, { stdio: 'pipe', env: { ...process.env, CI: '1' } });
    console.log('✓ PASS');
    return true;
  } catch (error) {
    console.log('✗ FAIL');
    console.error(error.stdout?.toString() || error.stderr?.toString() || error.message);
    return false;
  }
}

// 1. Project Structure Audit
auditResults.project = runStep('Project Structure Audit', 'node scripts/audit/verify-project.mjs');

// 2. Type Safety (tsc)
auditResults.typecheck = runStep('TypeScript Compiler Check', 'npm run typecheck');

// 3. Linting
auditResults.lint = runStep('ESLint Code Standards', 'npm run lint');

// 4. Unit Tests
auditResults.unitTests = runStep('Vitest Unit Tests', 'npx vitest run tests/unit/scoring.test.ts tests/unit/validation.test.ts tests/unit/voice-conversation.test.ts tests/unit/seed-data.test.ts');

// 5. Integration Tests
auditResults.integrationTests = runStep('Vitest Integration Pipeline', 'npx vitest run tests/unit/ai-pipeline-integration.test.ts tests/unit/call-crm-integration.test.ts');

// 6. E2E Tests
auditResults.e2eTests = runStep('Playwright E2E Test Suite', 'npx playwright test tests/e2e/dashboard.spec.ts tests/e2e/opportunities.spec.ts tests/e2e/navigation-responsive.spec.ts --workers=1');

// 7. UI/UX Design System Audit
auditResults.ui = runStep('UI/UX Enterprise Aesthetic Audit', 'node scripts/audit/verify-ui.mjs');

// 8. Markup Audit
auditResults.markup = runStep('Markup & TestID Audit', 'node scripts/audit/verify-markup.mjs');

// 9. Feature Audit
auditResults.features = runStep('End-to-End Feature Verification', 'node scripts/audit/verify-features.mjs');

// 10. LOC & Code Health Audit
auditResults.loc = runStep('Lines of Code & Health Audit', 'node scripts/audit/verify-loc.mjs');

// 11. Security Audit
auditResults.security = runStep('Security & Secret Scanning', 'node scripts/audit/verify-security.mjs');

// 12. Hero Demo Audit
auditResults.heroDemo = runStep('Deterministic Hero Demo Workflow', 'node scripts/audit/verify-demo.mjs');

// 13. Data Consistency Audit
auditResults.dataConsistency = runStep('Cross-Module Data Consistency Audit', 'node scripts/audit/verify-data-consistency.mjs');

// Calculate Quality Score (100 Max)
let score = 0;
if (auditResults.project) score += 10;
if (auditResults.typecheck && auditResults.lint) score += 10;
if (auditResults.unitTests && auditResults.integrationTests && auditResults.e2eTests) score += 15;
if (auditResults.ui && auditResults.markup) score += 15;
if (auditResults.features) score += 20;
if (auditResults.loc) score += 5;
if (auditResults.security) score += 5;
if (auditResults.heroDemo) score += 15;
if (auditResults.dataConsistency) score += 5;

const formatRow = (label, pass) => {
  const status = pass ? 'PASS' : 'FAIL';
  const dots = ' '.repeat(Math.max(2, 28 - label.length));
  return `║ ${label}${dots}${status}             ║`;
};

console.log('\n');
console.log('╔════════════════════════════════════════════╗');
console.log('║             INTENTOS AUDIT                 ║');
console.log('╠════════════════════════════════════════════╣');
console.log(formatRow('Project Structure', auditResults.project));
console.log(formatRow('Type Safety', auditResults.typecheck));
console.log(formatRow('Lint', auditResults.lint));
console.log(formatRow('Unit Tests', auditResults.unitTests));
console.log(formatRow('Integration Tests', auditResults.integrationTests));
console.log(formatRow('E2E Tests', auditResults.e2eTests));
console.log(formatRow('UI/UX Design System', auditResults.ui));
console.log(formatRow('Markup & TestIDs', auditResults.markup));
console.log(formatRow('Features', auditResults.features));
console.log(formatRow('LOC & Code Health', auditResults.loc));
console.log(formatRow('Security', auditResults.security));
console.log(formatRow('Hero Demo', auditResults.heroDemo));
console.log(formatRow('Data Consistency', auditResults.dataConsistency));
console.log('╠════════════════════════════════════════════╣');
const scoreStr = `${score} / 100`;
const scorePadding = ' '.repeat(Math.max(2, 19 - scoreStr.length));
console.log(`║ Overall Score             ${scoreStr}${scorePadding}║`);
const passedCount = Object.values(auditResults).filter(Boolean).length;
const totalCount = Object.keys(auditResults).length;
const summaryStr = `${passedCount} / ${totalCount} PASSED`;
const summaryPadding = ' '.repeat(Math.max(2, 18 - summaryStr.length));
console.log(`║ Total Checks              ${summaryStr}${summaryPadding}║`);
console.log('╚════════════════════════════════════════════╝\n');

const allPassed = Object.values(auditResults).every(Boolean);
if (allPassed) {
  console.log('RESULT: PASS (IntentOS is production-ready for live demo)\n');
  process.exit(0);
} else {
  console.error('RESULT: FAIL (Resolve failures before release)\n');
  process.exit(1);
}
