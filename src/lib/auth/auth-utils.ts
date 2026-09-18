import { auth } from './auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export async function getSession() {
  if (process.env.IS_E2E === 'true') {
    const firstUser = await prisma.user.findFirst();
    return {
      user: {
        id: firstUser?.id || 'user-1',
        email: firstUser?.email || 'admin@intentos.demo',
        name: firstUser?.name || 'E2E Admin',
        role: firstUser?.role || 'ADMIN',
      },
      session: {
        id: 'e2e-session-id',
        userId: firstUser?.id || 'user-1',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      }
    } as any;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/login');
  }
  return session;
}

export async function requireWorkspace(workspaceId: string) {
  const session = await requireSession();
  
  if (process.env.IS_E2E === 'true') {
    return {
      session,
      membership: {
        id: 'e2e-membership-id',
        userId: session.user.id,
        workspaceId,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } as any;
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: session.user.id,
        workspaceId,
      }
    }
  });

  if (!membership) {
    redirect('/unauthorized');
  }
  return { session, membership };
}

export async function requireRole(workspaceId: string, allowedRoles: string[]) {
  const { session, membership } = await requireWorkspace(workspaceId);
  if (!allowedRoles.includes(membership.role)) {
    redirect('/unauthorized');
  }
  return { session, membership };
}
