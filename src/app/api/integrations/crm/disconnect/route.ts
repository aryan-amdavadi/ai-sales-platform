import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');
    const workspaceId = url.searchParams.get('workspaceId') || 'ws-1';

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    const integration = await prisma.integration.update({
      where: {
        workspaceId_provider: {
          workspaceId,
          provider,
        },
      },
      data: {
        status: 'DISCONNECTED',
        encryptedCredentialRef: null,
      },
    });

    return NextResponse.json({ success: true, integration });
  } catch (error: any) {
    console.error('Disconnect Integration Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
