import * as cheerio from 'cheerio';

export interface UrlExtractionResult {
  title: string;
  text: string;
  metaDescription: string;
}

export async function extractTextFromUrl(url: string): Promise<UrlExtractionResult> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'IntentOS-BusinessUnderstanding-Bot/1.0',
      },
      // Timeout is natively supported in node-fetch/undici via AbortController,
      // but to keep it simple, we use a basic fetch here. Next.js extends fetch.
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script, style, and other non-content tags
    $('script, style, noscript, iframe, img, svg, video, audio').remove();

    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';

    // Extract text from body
    // We replace multiple newlines/spaces with a single space
    const text = $('body').text().replace(/\s+/g, ' ').trim();

    return {
      title,
      text,
      metaDescription,
    };
  } catch (error: any) {
    console.error('URL Extraction Error:', error);
    throw new Error(`Could not extract from URL: ${error.message}`);
  }
}
