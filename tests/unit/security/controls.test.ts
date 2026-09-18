import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '../../../src/middleware';
import { RiskEngine } from '../../../src/lib/security/risk-engine';
import { prisma } from '@/lib/db/prisma';

// Mock Prisma
vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    call: {
      count: vi.fn(),
    },
    syncLog: {
      count: vi.fn(),
    },
    fraudSignal: {
      create: vi.fn(),
    },
  }
}));

describe('Security Controls & Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply security headers to responses', () => {
    const req = new NextRequest('http://localhost:3000/api/test');
    const res = middleware(req);

    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(res.headers.get('X-Frame-Options')).toBe('DENY');
    expect(res.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    expect(res.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
  });

  it('should allow requests under the rate limit', () => {
    const req = new NextRequest('http://localhost:3000/api/test');
    // Using a mocked IP
    Object.defineProperty(req, 'ip', { value: '192.168.1.1' });

    // Send 10 requests
    for (let i = 0; i < 10; i++) {
      const res = middleware(req);
      expect(res.status).not.toBe(429);
    }
  });

  it('should block requests over the rate limit', () => {
    const req = new NextRequest('http://localhost:3000/api/test2');
    Object.defineProperty(req, 'ip', { value: '192.168.1.2' });

    let lastRes;
    // Send 101 requests (limit is 100)
    for (let i = 0; i < 101; i++) {
      lastRes = middleware(req);
    }
    expect(lastRes?.status).toBe(429);
  });
});

describe('RiskEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should flag CRITICAL risk on abnormal call volume', async () => {
    (prisma.call.count as any).mockResolvedValueOnce(1200); // Exceeds 1000 threshold
    (prisma.syncLog.count as any).mockResolvedValueOnce(0);

    const signals = await RiskEngine.evaluateWorkspace('ws-1');

    expect(signals.length).toBe(1);
    expect(signals[0].type).toBe('ABNORMAL_CALL_VOLUME');
    expect(signals[0].riskLevel).toBe('CRITICAL');
    expect(prisma.fraudSignal.create).toHaveBeenCalledTimes(1);
  });

  it('should flag HIGH risk on repeated CRM failures', async () => {
    (prisma.call.count as any).mockResolvedValueOnce(0);
    (prisma.syncLog.count as any).mockResolvedValueOnce(60); // Exceeds 50 threshold

    const signals = await RiskEngine.evaluateWorkspace('ws-1');

    expect(signals.length).toBe(1);
    expect(signals[0].type).toBe('REPEATED_API_FAILURES');
    expect(signals[0].riskLevel).toBe('HIGH');
  });

  it('should return empty if no anomalies detected', async () => {
    (prisma.call.count as any).mockResolvedValueOnce(10);
    (prisma.syncLog.count as any).mockResolvedValueOnce(2);

    const signals = await RiskEngine.evaluateWorkspace('ws-2');

    expect(signals.length).toBe(0);
    expect(prisma.fraudSignal.create).not.toHaveBeenCalled();
  });
});
