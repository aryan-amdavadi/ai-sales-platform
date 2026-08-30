import { NextResponse } from 'next/server';
import { getAdminData } from '@/lib/scoring';

export async function GET() {
  try {
    const data = await getAdminData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}
