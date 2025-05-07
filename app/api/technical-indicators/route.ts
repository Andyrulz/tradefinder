import { NextResponse } from 'next/server';
import { FinnhubService } from '@/lib/services/finnhub';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const resolution = searchParams.get('resolution') || 'D';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const data = await FinnhubService.getTechnicalIndicators(symbol, resolution);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch technical indicators' }, { status: 500 });
  }
} 