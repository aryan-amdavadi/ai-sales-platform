import { NextResponse } from 'next/server';
import { extractTextFromUrl } from '@/lib/extraction/url-extractor';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await extractTextFromUrl(url);

    // Naive heuristic analysis of the extracted text
    // In a real implementation this would use an LLM
    let industry = '';
    const description = result.metaDescription || result.text.substring(0, 200) + '...';

    const textLower = result.text.toLowerCase();
    if (textLower.includes('software') || textLower.includes('saas')) industry = 'Software / SaaS';
    else if (textLower.includes('health') || textLower.includes('medical')) industry = 'Healthcare';
    else if (textLower.includes('finance') || textLower.includes('bank')) industry = 'Finance';
    else if (textLower.includes('education') || textLower.includes('learning')) industry = 'Education';

    return NextResponse.json({
      title: result.title,
      description,
      industry,
      domain: new URL(url).hostname.replace('www.', ''),
    });
  } catch (error: any) {
    console.error('URL analysis failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
