import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, credential, externalAccountId, workspaceId = 'ws-1' } = body;

    if (!provider || !credential) {
      return NextResponse.json({ error: 'Provider and credential are required' }, { status: 400 });
    }

    // Upsert integration
    const integration = await prisma.integration.upsert({
      where: {
        workspaceId_provider: {
          workspaceId,
          provider,
        },
      },
      update: {
        status: 'CONNECTED',
        encryptedCredentialRef: credential, // Mocking encrypted creds
        externalAccountId: externalAccountId || null,
        errorState: null,
      },
      create: {
        workspaceId,
        provider,
        status: 'CONNECTED',
        encryptedCredentialRef: credential,
        externalAccountId: externalAccountId || null,
      },
    });

    return NextResponse.json({ success: true, integration });
  } catch (error: any) {
    console.error('Connect Integration Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
