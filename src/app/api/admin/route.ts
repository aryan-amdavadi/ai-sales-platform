import { NextResponse } from 'next/server';
import { getAdminData } from '@/lib/scoring';
import { requireSession, requireRole } from '@/lib/auth/auth-utils';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await requireSession();
    const firstMembership = await prisma.workspaceMember.findFirst({
      where: { userId: session.user.id }
    });
    
    if (!firstMembership) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 403 });
    }
    
    await requireRole(firstMembership.workspaceId, ['OWNER', 'ADMIN']);

    const data = await getAdminData();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching admin data:', error);
    if (error?.message === 'NEXT_REDIRECT') throw error;
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}

