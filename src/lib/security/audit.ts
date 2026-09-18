import { prisma } from '@/lib/db/prisma';

interface AuditLogOptions {
  workspaceId?: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}

export async function createAuditLog(options: AuditLogOptions) {
  try {
    return await prisma.auditLog.create({
      data: {
        workspaceId: options.workspaceId,
        actor: options.actor,
        action: options.action,
        entityType: options.entityType,
        entityId: options.entityId,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: options.metadata ? JSON.stringify(options.metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

interface SecurityEventOptions {
  workspaceId?: string;
  type: string;
  severity: 'WARNING' | 'CRITICAL';
  description: string;
  ipAddress?: string;
}

export async function createSecurityEvent(options: SecurityEventOptions) {
  try {
    return await prisma.securityEvent.create({
      data: {
        workspaceId: options.workspaceId,
        type: options.type,
        severity: options.severity,
        description: options.description,
        ipAddress: options.ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to create security event:', error);
  }
}
