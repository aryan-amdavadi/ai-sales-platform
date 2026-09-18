import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get('workspaceId') || 'ws-1';

    const invoices = await prisma.invoice.findMany({
      where: { workspaceId },
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error('Invoices Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
