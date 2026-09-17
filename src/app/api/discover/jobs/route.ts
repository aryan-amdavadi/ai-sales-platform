import { NextRequest, NextResponse } from 'next/server';
import { requireSession, requireWorkspace } from '@/lib/auth/auth-utils';
import { prisma } from '@/lib/db/prisma';
import { runDiscoveryJob } from '@/lib/discovery/discovery-provider';

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const firstMembership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    });
    
    if (!firstMembership) return NextResponse.json({ error: 'No workspace found' }, { status: 403 });
    const { membership } = await requireWorkspace(firstMembership.workspaceId);

    const body = await req.json();
    const { source } = body;

    const job = await prisma.discoveryJob.create({
      data: {
        workspaceId: membership.workspaceId,
        source: source || 'ALL',
        status: 'QUEUED'
      }
    });

    // Execute in background
    runDiscoveryJob(job.id).catch(console.error);

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    if (error?.message === 'NEXT_REDIRECT') throw error;
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const firstMembership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    });
    
    if (!firstMembership) return NextResponse.json({ error: 'No workspace found' }, { status: 403 });

    // Return the latest 5 jobs for the workspace
    const jobs = await prisma.discoveryJob.findMany({
      where: { workspaceId: firstMembership.workspaceId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        results: { take: 5 } // Preview of top results
      }
    });

    return NextResponse.json({ jobs });
  } catch (error: any) {
    if (error?.message === 'NEXT_REDIRECT') throw error;
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
