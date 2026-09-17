import { NextRequest, NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/scoring';
import { LeadFilterSchema } from '@/lib/validation';
import { requireSession, requireWorkspace } from '@/lib/auth/auth-utils';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate & Authorize
    const session = await requireSession();
    // Default to the first workspace they belong to if not explicitly provided, or pass from headers
    // For this implementation, we fetch their first membership
    const { prisma } = await import('@/lib/db/prisma');
    const firstMembership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    });
    
    if (!firstMembership) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 403 });
    }
    
    const { membership } = await requireWorkspace(firstMembership.workspaceId);

    const { searchParams } = new URL(req.url);
    const parsed = LeadFilterSchema.safeParse({
      search: searchParams.get('search') || undefined,
      minIntent: searchParams.get('minIntent') || undefined,
      maxIntent: searchParams.get('maxIntent') || undefined,
      industry: searchParams.get('industry') || undefined,
      source: searchParams.get('source') || undefined,
      status: searchParams.get('status') || undefined,
      urgency: searchParams.get('urgency') || undefined,
      location: searchParams.get('location') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
      limit: searchParams.get('limit') || undefined,
      offset: searchParams.get('offset') || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const data = await getOpportunities(parsed.data, membership.workspaceId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching opportunities:', error);
    if (error?.message === 'NEXT_REDIRECT') throw error; // Let Next.js redirects bubble up
    return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 });
  }
}

