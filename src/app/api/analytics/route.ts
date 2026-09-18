import { NextRequest, NextResponse } from 'next/server';
import { getRevenueIntelligence } from '@/lib/analytics';

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: any, k: string) => {
    const pre = prefix.length ? prefix + '_' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

function jsonToCsv(data: any): string {
  if (!data || !data.metrics) return '';
  const flatMetrics = flattenObject(data.metrics);
  const headers = Object.keys(flatMetrics).join(',');
  const values = Object.values(flatMetrics).map(val => {
    if (Array.isArray(val)) return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
    return `"${val}"`;
  }).join(',');
  return `${headers}\n${values}`;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const workspaceId = url.searchParams.get('workspaceId') || 'ws-1';
    const startDateStr = url.searchParams.get('startDate');
    const endDateStr = url.searchParams.get('endDate');
    const campaignId = url.searchParams.get('campaignId') || undefined;
    const source = url.searchParams.get('source') || undefined;
    const industry = url.searchParams.get('industry') || undefined;
    const format = url.searchParams.get('format') || 'json';

    const params = {
      workspaceId,
      startDate: startDateStr ? new Date(startDateStr) : undefined,
      endDate: endDateStr ? new Date(endDateStr) : undefined,
      campaignId,
      source,
      industry,
    };

    const data = await getRevenueIntelligence(params);

    if (format === 'csv') {
      const csvContent = jsonToCsv(data);
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="analytics-report.csv"',
        },
      });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
