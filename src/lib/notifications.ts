import { prisma } from '@/lib/db/prisma';

export async function createNotification(
  workspaceId: string,
  type: string,
  title: string,
  message: string,
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' = 'INFO',
  link?: string,
  userId?: string
) {
  return prisma.notification.create({
    data: {
      workspaceId,
      userId,
      type,
      title,
      message,
      severity,
      link,
    },
  });
}

export async function getUnreadNotifications(workspaceId: string, limit: number = 10) {
  return prisma.notification.findMany({
    where: {
      workspaceId,
      isRead: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

export async function markNotificationAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function markAllAsRead(workspaceId: string) {
  return prisma.notification.updateMany({
    where: { workspaceId, isRead: false },
    data: { isRead: true },
  });
}
