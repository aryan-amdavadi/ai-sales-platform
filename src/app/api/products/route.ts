import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { productSchema } from '@/lib/validations/workspace';

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) return NextResponse.json([], { status: 200 });

    const products = await prisma.product.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = productSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.format() }, { status: 400 });
    }

    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const product = await prisma.product.create({
      data: {
        ...result.data,
        workspaceId: workspace.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const json = await request.json();
    const result = productSchema.safeParse(json);

    if (!result.success || !result.data.id) {
      return NextResponse.json({ error: 'Validation failed or missing ID' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: result.data.id },
      data: result.data,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
