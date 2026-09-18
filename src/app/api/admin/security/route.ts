import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { createAuditLog } from '@/lib/security/audit';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    
    if (type === 'fraud') {
      const signals = await prisma.fraudSignal.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return NextResponse.json(signals);
    } else if (type === 'audit') {
      const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return NextResponse.json(logs);
    } else if (type === 'events') {
      const events = await prisma.securityEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      return NextResponse.json(events);
    } else if (type === 'workspaces') {
      const workspaces = await prisma.workspace.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(workspaces);
    }
    
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, workspaceId, reason } = body;

    if (action === 'resolveFraud') {
      const signal = await prisma.fraudSignal.update({
        where: { id },
        data: { status: 'RESOLVED' },
      });
      await createAuditLog({
        actor: 'SYSTEM_ADMIN',
        action: 'RESOLVED_FRAUD_SIGNAL',
        entityType: 'FraudSignal',
        entityId: id,
        metadata: { workspaceId: signal.workspaceId }
      });
      return NextResponse.json(signal);
    }

    if (action === 'suspendWorkspace') {
      const workspace = await prisma.workspace.update({
        where: { id: workspaceId },
        data: { isSuspended: true, suspendReason: reason },
      });
      await createAuditLog({
        actor: 'SYSTEM_ADMIN',
        action: 'SUSPENDED_WORKSPACE',
        entityType: 'Workspace',
        entityId: workspaceId,
        metadata: { reason }
      });
      return NextResponse.json(workspace);
    }
    
    if (action === 'unsuspendWorkspace') {
      const workspace = await prisma.workspace.update({
        where: { id: workspaceId },
        data: { isSuspended: false, suspendReason: null },
      });
      await createAuditLog({
        actor: 'SYSTEM_ADMIN',
        action: 'UNSUSPENDED_WORKSPACE',
        entityType: 'Workspace',
        entityId: workspaceId,
      });
      return NextResponse.json(workspace);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
