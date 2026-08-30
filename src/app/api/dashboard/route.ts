import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/scoring';

export async function GET() {
  try {
    const metrics = await getDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    console.error('Error in /api/dashboard:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}
