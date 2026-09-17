import { NextResponse } from 'next/server';
import { getAudienceEstimate } from '@/lib/campaigns';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionId = (await cookieStore).get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Default to the user's first workspace membership for simplicity
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: session.userId }
    });

    if (!membership) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 403 });
    }

    const body = await req.json();
    const count = await getAudienceEstimate({
      workspaceId: membership.workspaceId,
      minIntentScore: body.minIntentScore ? parseInt(body.minIntentScore, 10) : undefined,
      minQualificationScore: body.minQualificationScore ? parseInt(body.minQualificationScore, 10) : undefined,
      industries: body.industries,
      locations: body.locations
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Preview audience error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
