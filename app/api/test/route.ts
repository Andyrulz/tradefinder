import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'MSFT';
    
    // Return mock data
    return NextResponse.json({
      c: 435.58,
      d: 10.18,
      dp: 2.393,
      h: 439.44,
      l: 429.985,
      o: 431.74,
      pc: 425.4,
      t: Date.now()
    });
  } catch (error) {
    console.error('Error in test route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 