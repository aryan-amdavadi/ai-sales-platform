import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get('workspaceId') || 'ws-1';

    const subscription = await prisma.workspaceSubscription.findUnique({
      where: { workspaceId },
      include: { plan: true },
    });

    if (!subscription) {
      return NextResponse.json({ status: 'NO_PLAN_ACTIVE' });
    }

    return NextResponse.json(subscription);
  } catch (error: any) {
    console.error('Subscription Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
