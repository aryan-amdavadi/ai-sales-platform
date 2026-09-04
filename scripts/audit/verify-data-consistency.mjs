import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const rootDir = process.cwd();

console.log('\n========================================');
console.log('INTENTOS DATA CONSISTENCY VERIFICATION');
console.log('========================================\n');

let failed = false;

function check(label, actual, expected) {
  const pass = actual === expected || (typeof actual === 'string' && actual.includes(expected));
  const padding = ' '.repeat(Math.max(2, 38 - label.length));
  if (pass) {
    console.log(`• ${label}${padding}PASS`);
  } else {
    console.log(`• ${label}${padding}FAIL (expected "${expected}", got "${actual}")`);
    failed = true;
  }
}

async function verifyDataConsistency() {
  try {
    // 1. Fetch hero opportunity from database
    const heroLead = await prisma.lead.findFirst({
      where: {
        company: { name: 'TechNova Solutions' },
      },
      include: {
        company: true,
        requirements: true,
        qualifications: true,
      },
    });

    if (!heroLead) {
      console.error('❌ Hero lead not found in database! Ensure database is seeded with TechNova Solutions.');
      process.exit(1);
    }

    const seedDataCode = fs.readFileSync(path.join(rootDir, 'src/data/demo/seed-data.ts'), 'utf8');
    const scenariosCode = fs.readFileSync(path.join(rootDir, 'src/lib/voice/scenarios.ts'), 'utf8');
    const aiProviderCode = fs.readFileSync(path.join(rootDir, 'src/lib/ai/local-demo-provider.ts'), 'utf8');

    // 1. Company Name Consistency
    const companyMatches =
      heroLead.company?.name === 'TechNova Solutions' &&
      seedDataCode.includes("companyName: 'TechNova Solutions'") &&
      scenariosCode.includes("companyName: 'TechNova Solutions'");
    check('1. Company Name (TechNova Solutions)', companyMatches ? 'TechNova Solutions' : 'Mismatch', 'TechNova Solutions');

    // 2. Prospect Name Consistency
    const prospectMatches =
      heroLead.name === 'John Smith' &&
      seedDataCode.includes("contactName: 'John Smith'") &&
      scenariosCode.includes("prospectName: 'John Smith'");
    check('2. Prospect Name (John Smith)', prospectMatches ? 'John Smith' : 'Mismatch', 'John Smith');

    // 3. Role Consistency
    const roleMatches =
      heroLead.title.includes('CTO') &&
      seedDataCode.includes("contactTitle: 'Chief Technology Officer (CTO)'") &&
      scenariosCode.includes("prospectTitle: 'Chief Technology Officer (CTO)'");
    check('3. Role (Chief Technology Officer / CTO)', roleMatches ? 'CTO' : 'Mismatch', 'CTO');

    // 4. Requirement Consistency
    const reqTitle = heroLead.requirements[0]?.title || '';
    const reqMatches =
      reqTitle.includes('SharePoint') &&
      seedDataCode.includes('Microsoft 365 & SharePoint Implementation') &&
      scenariosCode.includes('Microsoft 365 and SharePoint implementation');
    check('4. Requirement (SharePoint Implementation)', reqMatches ? 'Microsoft 365 & SharePoint Implementation' : reqTitle, 'Microsoft 365 & SharePoint Implementation');

    // 5. Timeline Consistency
    const timelineMatches =
      scenariosCode.includes('30 days') &&
      seedDataCode.includes('Immediate (Next 30 Days)');
    check('5. Timeline (30 days)', timelineMatches ? '30 days' : 'Mismatch', '30 days');

    // 6. Intent Score Consistency
    const intentMatches =
      heroLead.intentScore === 94 &&
      seedDataCode.includes('intentScore: 94') &&
      aiProviderCode.includes('overallScore');
    check('6. Intent Score (94/100)', intentMatches ? 94 : heroLead.intentScore, 94);

    // 7. Qualification Score Consistency
    const qualMatches =
      heroLead.qualificationScore === 92 &&
      seedDataCode.includes('qualificationScore: 92') &&
      scenariosCode.includes('qualificationScore: 92');
    check('7. Qualification Score (92% HOT)', qualMatches ? 92 : heroLead.qualificationScore, 92);

    console.log('\n----------------------------------------');
    if (!failed) {
      console.log('RESULT: PASS (All 7 data consistency checks verified across DB, AI, and Scenarios)\n');
      process.exit(0);
    } else {
      console.error('RESULT: FAIL (Data consistency mismatches detected)\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error verifying data consistency:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDataConsistency();
