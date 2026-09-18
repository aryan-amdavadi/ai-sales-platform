import { NextRequest, NextResponse } from 'next/server';
import { getUnreadNotifications, markAllAsRead } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get('workspaceId') || 'ws-1';
    
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    const notifications = await getUnreadNotifications(workspaceId, limit);
    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error('Notifications Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId = 'ws-1', action } = body;

    if (action === 'markAllAsRead') {
      const result = await markAllAsRead(workspaceId);
      return NextResponse.json({ success: true, count: result.count });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Notifications Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
