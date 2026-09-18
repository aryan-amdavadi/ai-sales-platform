import { NextRequest, NextResponse } from 'next/server';
import { getCRMProvider } from '@/lib/crm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId = 'ws-1' } = body;

    const provider = await getCRMProvider(workspaceId);
    const result = await provider.validateConnection();

    if (result.valid) {
      return NextResponse.json({ success: true, message: `Connected to ${provider.name}` });
    } else {
      return NextResponse.json({ error: result.error || 'Validation failed' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Test Integration Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
