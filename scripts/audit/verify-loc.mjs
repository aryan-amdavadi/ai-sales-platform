import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

console.log('\n========================================');
console.log('INTENTOS LINES OF CODE (LOC) AUDIT');
console.log('========================================');
console.log('NOTE: "LOC is an engineering metric, not a quality metric."\n');

const ignoreDirs = new Set(['node_modules', '.next', 'coverage', '.git', 'test-results']);
const ignoreFiles = new Set(['package-lock.json', 'tsconfig.tsbuildinfo', 'dev.db', 'dev.db-journal']);

let totalLines = 0;
let tsLines = 0;
let tsxLines = 0;
let cssLines = 0;
let testLines = 0;
let apiLines = 0;
let aiLines = 0;
let featureLines = 0;

const giantFiles = [];
const emptyFiles = [];
const todos = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile()) {
      if (ignoreFiles.has(entry.name)) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!['.ts', '.tsx', '.js', '.mjs', '.css', '.prisma'].includes(ext)) continue;

      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n').length;

      if (lines === 0 || content.trim().length === 0) {
        emptyFiles.push(relPath);
      }

      if (lines > 600) {
        giantFiles.push({ path: relPath, lines });
      }

      const todoMatches = content.match(/\b(TODO|FIXME|XXX)\b/g);
      if (todoMatches) {
        todos.push({ path: relPath, count: todoMatches.length });
      }

      totalLines += lines;

      if (ext === '.ts') tsLines += lines;
      if (ext === '.tsx') tsxLines += lines;
      if (ext === '.css') cssLines += lines;

      if (relPath.includes('tests/') || relPath.includes('.test.') || relPath.includes('.spec.')) {
        testLines += lines;
      } else if (relPath.includes('src/app/api/')) {
        apiLines += lines;
      } else if (relPath.includes('src/lib/ai/') || relPath.includes('src/lib/voice/')) {
        aiLines += lines;
      } else if (relPath.includes('src/app/') || relPath.includes('src/components/')) {
        featureLines += lines;
      }
    }
  }
}

scanDir(rootDir);

console.log('--- CODEBASE BREAKDOWN ---');
console.log(`Total Codebase LOC:   ${totalLines.toLocaleString()}`);
console.log(`TypeScript (.ts) LOC: ${tsLines.toLocaleString()}`);
console.log(`React TSX (.tsx) LOC: ${tsxLines.toLocaleString()}`);
console.log(`CSS Styling LOC:      ${cssLines.toLocaleString()}`);
console.log(`Test Suite LOC:       ${testLines.toLocaleString()}`);
console.log(`API Routes LOC:       ${apiLines.toLocaleString()}`);
console.log(`AI & Voice Logic LOC: ${aiLines.toLocaleString()}`);
console.log(`UI Features LOC:      ${featureLines.toLocaleString()}`);

console.log('\n--- CODE HEALTH CHECKS ---');
if (giantFiles.length > 0) {
  console.log(`• Large Files (>600 lines):`);
  giantFiles.forEach((f) => console.log(`    - ${f.path} (${f.lines} lines)`));
} else {
  console.log('• Large Files: None');
}

if (emptyFiles.length > 0) {
  console.log(`• Suspiciously Empty Files: ${emptyFiles.join(', ')}`);
} else {
  console.log('• Suspiciously Empty Files: None');
}

if (todos.length > 0) {
  console.log(`• Remaining TODOs/FIXMEs: ${todos.reduce((a, b) => a + b.count, 0)} across ${todos.length} files`);
} else {
  console.log('• Remaining TODOs/FIXMEs: None');
}

console.log('\n----------------------------------------');
console.log('LOC AUDIT: PASS');
process.exit(0);
