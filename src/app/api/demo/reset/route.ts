import { NextResponse } from 'next/server';
import { runSeed } from '../../../../../scripts/seed';

export async function POST() {
  try {
    await runSeed();
    return NextResponse.json({
      success: true,
      message: 'Demo dataset reset deterministically with 105+ opportunities and hero record ABC Technologies.',
    });
  } catch (error: any) {
    console.error('Error resetting demo database:', error);
    return NextResponse.json({ error: 'Failed to reset demo data' }, { status: 500 });
  }
}
