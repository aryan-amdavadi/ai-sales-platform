import { NextRequest, NextResponse } from 'next/server';
import { markNotificationAsRead } from '@/lib/notifications';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await markNotificationAsRead(id);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Mark Notification Read Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
