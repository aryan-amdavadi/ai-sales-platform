import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { extractTextFromDocument } from '@/lib/extraction/document-extractor';

export async function GET() {
  try {
    const workspace = await prisma.workspace.findFirst();
    if (!workspace) return NextResponse.json([], { status: 200 });

    const docs = await prisma.knowledgeDocument.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true, filename: true, status: true, type: true, createdAt: true } // Don't return full text
    });

    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    let type = 'TXT';
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      type = 'PDF';
    }

    // Process file
    let text = '';
    let status = 'EXTRACTED';
    try {
      text = await extractTextFromDocument(buffer, file.name, file.type);
    } catch (err) {
      console.error(err);
      status = 'ERROR';
    }

    const doc = await prisma.knowledgeDocument.create({
      data: {
        workspaceId: workspace.id,
        filename: file.name,
        type,
        status,
        content: text,
      },
    });

    return NextResponse.json({
      id: doc.id,
      filename: doc.filename,
      status: doc.status,
      type: doc.type,
    }, { status: 201 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
