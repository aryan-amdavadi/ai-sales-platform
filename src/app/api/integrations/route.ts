import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    // Hardcoded workspace for demo purposes, as we lack standard session auth middleware
    const workspaceId = url.searchParams.get('workspaceId') || 'ws-1';

    const integrations = await prisma.integration.findMany({
      where: { workspaceId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(integrations);
  } catch (error: any) {
    console.error('Failed to fetch integrations:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
