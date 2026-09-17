import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const provenance = await prisma.leadFieldProvenance.findMany({
      where: { leadId: id },
      orderBy: { fieldName: 'asc' }
    });

    return NextResponse.json(provenance);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch provenance' },
      { status: 500 }
    );
  }
}
