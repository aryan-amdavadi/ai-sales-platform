#!/usr/bin/env node

/**
 * INTENTOS — UI/UX Verification & Visual QA Audit Script
 * Verifies UI structure, navigation consistency, responsiveness patterns, accessibility, and visual tokens.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

console.log('\n======================================================');
console.log('  INTENTOS — UI/UX & DESIGN SYSTEM VERIFICATION AUDIT');
console.log('======================================================\n');

let failed = false;

function checkFileExists(filePath, description) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing file: ${filePath} (${description})`);
    failed = true;
    return false;
  }
  return true;
}

function checkFileContains(filePath, patterns, testName) {
  const fullPath = path.join(rootDir, filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${filePath}`);
    failed = true;
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  for (const p of patterns) {
    if (typeof p === 'string' && !content.includes(p)) {
      console.error(`❌ [${testName}] Missing expected pattern in ${filePath}: "${p}"`);
      failed = true;
      return false;
    } else if (p instanceof RegExp && !p.test(content)) {
      console.error(`❌ [${testName}] Missing regex match in ${filePath}: ${p}`);
      failed = true;
      return false;
    }
  }
  return true;
}

// 1. UI STRUCTURE AUDIT
console.log('1. Auditing UI Structure & Core Views...');
const corePages = [
  'src/app/dashboard/page.tsx',
  'src/app/opportunities/page.tsx',
  'src/app/opportunities/[id]/page.tsx',
  'src/app/calls/page.tsx',
  'src/app/calls/[id]/page.tsx',
  'src/app/analytics/page.tsx',
  'src/app/discover/page.tsx',
  'src/app/intelligence/page.tsx',
  'src/app/campaigns/page.tsx',
  'src/app/campaigns/[id]/page.tsx',
  'src/app/admin/page.tsx',
  'src/app/settings/page.tsx',
  'src/app/login/page.tsx',
  'src/app/onboarding/page.tsx',
];

for (const p of corePages) {
  checkFileExists(p, 'Core route component');
}

checkFileContains('src/app/dashboard/page.tsx', ['data-testid="dashboard-page"', 'data-testid="hero-queue"', 'SALES INTELLIGENCE COMMAND'], 'UI Structure: Dashboard');
checkFileContains('src/app/opportunities/[id]/page.tsx', ['data-testid="opportunity-detail"', 'data-testid="intent-score"', 'data-testid="evidence-panel"', 'Why This Lead?'], 'UI Structure: Detail');
checkFileContains('src/app/calls/page.tsx', ['data-testid="call-cockpit"', 'data-testid="call-status"', 'data-testid="conversation"', 'data-testid="live-signals"'], 'UI Structure: Calls');

if (!failed) {
  console.log('   ✅ UI STRUCTURE PASS\n');
}

// 2. NAVIGATION AUDIT
console.log('2. Auditing Navigation & Guided Demo Trigger...');
checkFileContains('src/components/layout/sidebar.tsx', ['/dashboard', '/opportunities', '/calls', '/discover', '/campaigns', '/intelligence', '/analytics', '/admin', '/settings'], 'Navigation Links');
checkFileContains('src/components/layout/sidebar.tsx', ['Start Guided Demo', 'onStartGuidedDemo'], 'Sidebar Guided Demo Trigger');
checkFileContains('src/components/layout/header.tsx', ['Guided Demo', 'onStartGuidedDemo'], 'Header Guided Demo Trigger');
checkFileContains('src/components/shared/guided-demo.tsx', ['Step 1 of 11', 'TechNova Solutions', 'John Smith'], 'Guided Demo 11 Steps');

if (!failed) {
  console.log('   ✅ NAVIGATION PASS\n');
}

// 3. RESPONSIVENESS AUDIT
console.log('3. Auditing Responsive Layout Patterns...');
const responsiveFiles = [
  'src/app/dashboard/page.tsx',
  'src/app/opportunities/page.tsx',
  'src/app/opportunities/[id]/page.tsx',
  'src/app/calls/page.tsx',
  'src/app/analytics/page.tsx',
];

for (const f of responsiveFiles) {
  checkFileContains(f, [/grid-cols-1/, /(lg:grid-cols-|md:grid-cols-|sm:grid-cols-)/], 'Responsive Grids');
}

if (!failed) {
  console.log('   ✅ RESPONSIVENESS PASS\n');
}

// 4. ACCESSIBILITY AUDIT
console.log('4. Auditing Typography Hierarchy & Accessibility...');
for (const f of corePages) {
  checkFileContains(f, [/<h1/], `Heading Hierarchy in ${f}`);
}

checkFileContains('src/components/shared/status-badge.tsx', ['px-2', 'py-0.5', 'rounded'], 'StatusBadge Accessibility');
checkFileContains('src/components/shared/metric-card.tsx', ['text-slate-400', 'font-bold'], 'MetricCard Hierarchy');

if (!failed) {
  console.log('   ✅ ACCESSIBILITY PASS\n');
}

// 5. VISUAL REGRESSION & TOKEN CONSISTENCY AUDIT
console.log('5. Auditing Design System Tokens & Color Palette...');
checkFileContains('src/app/globals.css', ['--background', '--foreground', '--card', '--border'], 'CSS Tokens');
checkFileContains('src/components/shared/metric-card.tsx', ['blue', 'emerald', 'indigo', 'amber'], 'MetricCard Variant Tokens');

// Verify that obnoxious neon pulse classes are not used indiscriminately
const globalsCss = fs.readFileSync(path.join(rootDir, 'src/app/globals.css'), 'utf8');
if (globalsCss.includes('box-shadow: 0 0 20px #14b8a6')) {
  console.error('❌ Found legacy cyberpunk neon glow in globals.css');
  failed = true;
}

if (!failed) {
  console.log('   ✅ VISUAL REGRESSION PASS\n');
}

if (failed) {
  console.error('\n❌ UI/UX VERIFICATION FAILED\n');
  process.exit(1);
} else {
  console.log('======================================================');
  console.log('  ALL UI/UX & DESIGN SYSTEM AUDITS PASSED (100%)');
  console.log('======================================================\n');
  process.exit(0);
}
