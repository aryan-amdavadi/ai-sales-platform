import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// In-memory array for demo callbacks fallback, persisted in ActivityLog
const demoCallbacks: any[] = [
  {
    id: 'CB-101',
    leadId: 'hero-lead',
    leadName: 'John Smith',
    companyName: 'TechNova Solutions',
    scheduledDate: '2026-09-02',
    scheduledTime: '14:00 EST',
    reason: 'Follow-up on technical architecture discussion',
    status: 'SCHEDULED',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ callbacks: demoCallbacks });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, leadName, companyName, scheduledDate, scheduledTime, reason } = body;

    const newCallback = {
      id: `CB-${Math.floor(100 + Math.random() * 900)}`,
      leadId: leadId || 'lead-id',
      leadName: leadName || 'John Smith',
      companyName: companyName || 'TechNova Solutions',
      scheduledDate: scheduledDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: scheduledTime || '14:00 EST',
      reason: reason || 'Technical discovery follow-up',
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    demoCallbacks.unshift(newCallback);

    if (leadId) {
      await prisma.activityLog.create({
        data: {
          leadId,
          action: 'CALLBACK_SCHEDULED',
          details: `Scheduled callback for ${newCallback.scheduledDate} at ${newCallback.scheduledTime}. Reason: ${newCallback.reason}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      callback: newCallback,
      message: 'Callback scheduled successfully',
    });
  } catch (error: any) {
    console.error('Error scheduling callback:', error);
    return NextResponse.json({ error: error.message || 'Failed to schedule callback' }, { status: 500 });
  }
}
