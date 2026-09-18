import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const { primaryLeadId, secondaryLeadId } = await req.json();

    if (!primaryLeadId || !secondaryLeadId) {
      return NextResponse.json({ error: 'Must provide primary and secondary lead IDs' }, { status: 400 });
    }

    const primary = await prisma.lead.findUnique({
      where: { id: primaryLeadId },
      include: { provenance: true, requirements: true, calls: true, activityLogs: true }
    });

    const secondary = await prisma.lead.findUnique({
      where: { id: secondaryLeadId },
      include: { provenance: true, requirements: true, calls: true, activityLogs: true }
    });

    if (!primary || !secondary) {
      return NextResponse.json({ error: 'One or both leads not found' }, { status: 404 });
    }
    
    if (primary.workspaceId !== secondary.workspaceId) {
       return NextResponse.json({ error: 'Cannot merge leads across workspaces' }, { status: 403 });
    }

    // Move relationships
    // Requirements
    for (const req of secondary.requirements) {
      await prisma.requirement.update({
        where: { id: req.id },
        data: { leadId: primary.id }
      });
    }

    // Calls
    for (const call of secondary.calls) {
      await prisma.call.update({
        where: { id: call.id },
        data: { leadId: primary.id }
      });
    }

    // Activity Logs
    for (const log of secondary.activityLogs) {
      await prisma.activityLog.update({
        where: { id: log.id },
        data: { leadId: primary.id }
      });
    }

    // Merge missing data based on provenance confidence
    const updateData: any = {};
    for (const secProv of secondary.provenance) {
      const primProv = primary.provenance.find((p: any) => p.fieldName === secProv.fieldName);
      
      // If primary doesn't have it, or secondary has higher confidence
      if (!primProv || secProv.confidence > primProv.confidence) {
        // Upsert provenance for primary
        await prisma.leadFieldProvenance.upsert({
          where: {
             leadId_fieldName: {
               leadId: primary.id,
               fieldName: secProv.fieldName
             }
          },
          create: {
            leadId: primary.id,
            fieldName: secProv.fieldName,
            sourceName: secProv.sourceName,
            sourceUrl: secProv.sourceUrl,
            confidence: secProv.confidence,
            inferred: secProv.inferred
          },
          update: {
            sourceName: secProv.sourceName,
            sourceUrl: secProv.sourceUrl,
            confidence: secProv.confidence,
            inferred: secProv.inferred
          }
        });
        
        // Take the value from secondary (assuming we map fields directly)
        if (['linkedinUrl', 'email', 'phone', 'title', 'name'].includes(secProv.fieldName)) {
            const val = (secondary as any)[secProv.fieldName];
            if (val) updateData[secProv.fieldName] = val;
        }
      }
    }
    
    if (Object.keys(updateData).length > 0) {
       await prisma.lead.update({
           where: { id: primary.id },
           data: updateData
       });
    }

    // Delete secondary
    await prisma.lead.delete({
      where: { id: secondary.id }
    });

    return NextResponse.json({ success: true, message: 'Leads merged successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to merge leads' },
      { status: 500 }
    );
  }
}
