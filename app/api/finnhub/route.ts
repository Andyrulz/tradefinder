import { NextResponse } from 'next/server';
import { FinnhubService } from '@/lib/services/finnhub';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return NextResponse.json(
      { error: 'Symbol is required' },
      { status: 400 }
    );
  }

  // Validate symbol format
  if (!/^[A-Z]{1,5}(\.NS)?$/.test(symbol)) {
    return NextResponse.json(
      { error: 'Invalid symbol format. Use 1-5 uppercase letters for US stocks or add .NS for Indian stocks' },
      { status: 400 }
    );
  }

  try {
    const [quote, profile] = await Promise.all([
      FinnhubService.getQuote(symbol),
      FinnhubService.getCompanyProfile(symbol)
    ]);

    // Check if we got valid data
    if (!quote || !quote.c) {
      return NextResponse.json(
        { error: 'Invalid or missing quote data' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      quote,
      profile,
      success: true
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Stock symbol not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('429')) {
        return NextResponse.json(
          { error: 'API rate limit exceeded' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
} 