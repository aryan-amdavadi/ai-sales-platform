import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();

console.log('\n========================================');
console.log('INTENTOS PROJECT STRUCTURE AUDIT');
console.log('========================================');

const requiredFiles = [
  'package.json',
  'README.md',
  '.env.example',
  'prisma/schema.prisma',
  'playwright.config.ts',
  'vitest.config.ts',
  'tsconfig.json',
];

const requiredDirs = [
  'src',
  'src/app',
  'src/components',
  'src/lib',
  'src/types',
  'tests',
  'tests/unit',
  'tests/e2e',
  'scripts',
  'scripts/audit',
  'docs',
];

const requiredScripts = [
  'dev',
  'build',
  'test',
  'test:e2e',
  'lint',
  'typecheck',
  'db:seed',
  'audit',
];

let allPassed = true;

// 1. Verify Files
console.log('\n[1] Verifying Core Files:');
for (const file of requiredFiles) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ ${file}`);
  } else {
    console.error(`  ✗ MISSING: ${file}`);
    allPassed = false;
  }
}

// 2. Verify Directories
console.log('\n[2] Verifying Project Directories:');
for (const dir of requiredDirs) {
  const fullPath = path.join(rootDir, dir);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    console.log(`  ✓ ${dir}/`);
  } else {
    console.error(`  ✗ MISSING DIRECTORY: ${dir}/`);
    allPassed = false;
  }
}

// 3. Verify package.json Scripts
console.log('\n[3] Verifying Package Scripts:');
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  for (const script of requiredScripts) {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`  ✓ script: npm run ${script} -> "${pkg.scripts[script]}"`);
    } else {
      console.error(`  ✗ MISSING SCRIPT: ${script}`);
      allPassed = false;
    }
  }
} catch (e) {
  console.error(`  ✗ Failed to read package.json: ${e.message}`);
  allPassed = false;
}

// 4. Verify TypeScript Compilation
console.log('\n[4] Verifying TypeScript Compilation:');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('  ✓ TypeScript check passed (0 errors)');
} catch (e) {
  console.error('  ✗ TypeScript compiler errors detected!');
  console.error(e.stdout?.toString() || e.message);
  allPassed = false;
}

console.log('\n----------------------------------------');
if (allPassed) {
  console.log('PROJECT STRUCTURE AUDIT: PASS');
  process.exit(0);
} else {
  console.error('PROJECT STRUCTURE AUDIT: FAIL');
  process.exit(1);
}
