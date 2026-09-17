import { auth } from './auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { redirect } from 'next/navigation';

export async function getSession() {
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
