import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { workspaceUpdateSchema } from '@/lib/validations/workspace';

export async function GET() {
  try {
    // In a real multi-tenant app, we'd get workspaceId from auth session
    // For now, fetch the first (default) workspace
    const workspace = await prisma.workspace.findFirst({
      include: {
        businessProfile: true,
        icpProfile: true,
        businessCapability: true,
        products: true,
        knowledgeDocuments: true,
      }
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error('Failed to fetch workspace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json();
    const result = workspaceUpdateSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.format() }, { status: 400 });
    }

    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const { businessProfile, icpProfile } = result.data;

    if (businessProfile) {
      await prisma.businessProfile.upsert({
        where: { workspaceId: workspace.id },
        update: businessProfile,
        create: {
          ...businessProfile,
          workspaceId: workspace.id,
          legalName: businessProfile.legalName || 'New Company',
        },
      });
    }

    if (icpProfile) {
      await prisma.icpProfile.upsert({
        where: { workspaceId: workspace.id },
        update: icpProfile,
        create: {
          ...icpProfile,
          workspaceId: workspace.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update workspace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
