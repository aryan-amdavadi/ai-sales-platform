import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getMarketIntelligenceProvider } from '@/lib/market-intelligence';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        marketSignals: {
          orderBy: { discoveredAt: 'desc' }
        },
        leads: {
          include: {
            requirements: true,
            qualifications: true
          }
        }
      }
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Evaluate "Why Now?" dynamically for the primary lead of the company
    let whyNow = null;
    if (company.leads && company.leads.length > 0) {
      const primaryLead = company.leads[0];
      const provider = getMarketIntelligenceProvider();
      whyNow = await provider.evaluateWhyNow({
        ...primaryLead,
        company: company
      } as any);
    }

    return NextResponse.json({ company, whyNow });
  } catch (error: any) {
    console.error('Error fetching company intelligence:', error);
    return NextResponse.json({ error: 'Failed to fetch company intelligence' }, { status: 500 });
  }
}
