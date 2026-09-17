import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { icpProfileSchema } from '@/lib/validations/workspace';

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst({
      include: { icpProfile: true }
    });

    if (!workspace || !workspace.icpProfile) {
      return NextResponse.json(null);
    }

    return NextResponse.json(workspace.icpProfile);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json();
    const result = icpProfileSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
    }

    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const icp = await prisma.icpProfile.upsert({
      where: { workspaceId: workspace.id },
      update: result.data,
      create: {
        ...result.data,
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json(icp);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
