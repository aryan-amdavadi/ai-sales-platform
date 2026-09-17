import { NextRequest, NextResponse } from 'next/server';
import { requireSession, requireWorkspace } from '@/lib/auth/auth-utils';
import { prisma } from '@/lib/db/prisma';
import { importProvider } from '@/lib/ingestion/import-provider';

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    
    // Default to their first workspace for simplicity in this MVP
    const firstMembership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    });
    
    if (!firstMembership) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 403 });
    }

    const { membership } = await requireWorkspace(firstMembership.workspaceId);

    const body = await req.json();
    const { source, mapping, rows } = body;

    if (!source || !mapping || !rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const job = await importProvider.initializeImport({
      workspaceId: membership.workspaceId,
      userId: session.user.id,
      source,
      mapping,
      rows
    });

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    console.error('Import Error:', error);
    if (error?.message === 'NEXT_REDIRECT') throw error;
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const job = await importProvider.getImportStatus(jobId);
    return NextResponse.json({ job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
