import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting (suitable for single instance / edge functions)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // max requests per window per IP

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate Limiting (apply to API routes)
  if (request.nextUrl.pathname.startsWith('/api')) {
    const now = Date.now();
    let clientData = rateLimitMap.get(ip);
    
    if (!clientData || clientData.resetTime < now) {
      clientData = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
      rateLimitMap.set(ip, clientData);
    } else {
      clientData.count++;
    }

    if (clientData.count > MAX_REQUESTS) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Next response
  const response = NextResponse.next();

  // Secure Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Basic CSP (Content Security Policy)
  // response.headers.set(
  //   'Content-Security-Policy',
  //   "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
  // );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
