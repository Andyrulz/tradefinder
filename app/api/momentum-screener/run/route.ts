import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getStockData } from '@/lib/api';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Enhanced screening logic for best momentum stocks with long bases and tight setups
function isMomentumCandidate(stock: any): { pass: boolean; reasons: string[]; score: number; paramScores: any } {
  const reasons: string[] = [];
  let score = 0;
  const paramScores: any = {};
  const priceHistory = stock.priceHistory || [];
  const n = priceHistory.length;
  if (n === 0) return { pass: false, reasons: ['No price history'], score: 0, paramScores };

  // Price % change (momentum)
  let pct1d = 0, pct5d = 0, pct20d = 0;
  if (n > 1) pct1d = ((priceHistory[n-1].close - priceHistory[n-2].close) / priceHistory[n-2].close) * 100;
  if (n > 5) pct5d = ((priceHistory[n-1].close - priceHistory[n-6].close) / priceHistory[n-6].close) * 100;
  if (n > 20) pct20d = ((priceHistory[n-1].close - priceHistory[n-21].close) / priceHistory[n-21].close) * 100;
  paramScores.pct1d = pct1d;
  paramScores.pct5d = pct5d;
  paramScores.pct20d = pct20d;
  if (pct1d > 1) { reasons.push('Strong 1D price momentum'); score += 2; paramScores.pct1dScore = 2; } else { paramScores.pct1dScore = 0; }
  if (pct5d > 3) { reasons.push('Strong 5D price momentum'); score += 2; paramScores.pct5dScore = 2; } else { paramScores.pct5dScore = 0; }
  if (pct20d > 8) { reasons.push('Strong 20D price momentum'); score += 2; paramScores.pct20dScore = 2; } else { paramScores.pct20dScore = 0; }

  // Volume spike
  let volSpike = false;
  if (n > 20) {
    const avgVol = priceHistory.slice(n-21, n-1).reduce((a: number, b: { volume: number }) => a + b.volume, 0) / 20;
    volSpike = priceHistory[n-1].volume > avgVol * 1.5;
    paramScores.volSpike = volSpike;
    if (volSpike) { reasons.push('Volume spike'); score += 2; paramScores.volSpikeScore = 2; } else { paramScores.volSpikeScore = 0; }
  } else { paramScores.volSpike = false; paramScores.volSpikeScore = 0; }

  // Proximity to 52w high
  let proximity = null;
  if (n > 0) {
    const high52w = Math.max(...priceHistory.map((p: { high: number }) => p.high));
    proximity = (high52w - priceHistory[n-1].close) / high52w;
    paramScores.proximity = proximity;
    if (proximity < 0.05) { reasons.push('Near 52-week high'); score += 2; paramScores.proximityScore = 2; } else { paramScores.proximityScore = 0; }
  }

  // EMA Cross (20 > 50)
  const closes = priceHistory.map((p: { close: number }) => p.close);
  let ema20 = null, ema50 = null;
  if (closes.length >= 20) {
    const ema = (arr: number[], len: number) => {
      const k = 2 / (len + 1);
      let ema = arr[0];
      for (let i = 1; i < arr.length; i++) {
        ema = arr[i] * k + ema * (1 - k);
      }
      return ema;
    };
    ema20 = ema(closes.slice(-Math.min(50, closes.length)), 20);
    ema50 = closes.length >= 50 ? ema(closes.slice(-50), 50) : null;
    paramScores.ema20 = ema20;
    paramScores.ema50 = ema50;
    if (ema20 && ema50 && ema20 > ema50) { reasons.push('20 EMA above 50 EMA'); score += 2; paramScores.emaCrossScore = 2; } else { paramScores.emaCrossScore = 0; }
  }

  // RSI > 60
  const rsi = stock.indicators?.find((i: any) => i.name.includes('RSI'))?.value;
  paramScores.rsi = rsi;
  if (typeof rsi === 'number' && rsi > 60) { reasons.push('RSI above 60'); score += 1; paramScores.rsiScore = 1; } else { paramScores.rsiScore = 0; }

  // Tight base: last 20 closes within 5% range
  if (closes.length >= 20) {
    const last20 = closes.slice(-20);
    const min20 = Math.min(...last20);
    const max20 = Math.max(...last20);
    paramScores.tightBase = (max20 - min20) / min20;
    if ((max20 - min20) / min20 < 0.05) {
      reasons.push('Tight 20-day price range (potential base)');
      score += 3;
      paramScores.tightBaseScore = 3;
    } else { paramScores.tightBaseScore = 0; }
  }

  // Breakout: current close > all closes in last 40 days
  if (closes.length >= 41 && closes[closes.length-1] > Math.max(...closes.slice(-41, -1))) {
    reasons.push('Breakout above recent base');
    score += 3;
    paramScores.breakoutScore = 3;
  } else { paramScores.breakoutScore = 0; }

  // Pass if score >= 7 and at least one base or breakout reason
  const baseOrBreakout = reasons.some(r => r.includes('base') || r.includes('Breakout'));
  return { pass: score >= 7 && baseOrBreakout, reasons, score, paramScores };
}

function getSetupTypeAndScore(paramScores: any, closes: number[]): { setup: string, setupScore: number } {
  // Setup detection and scoring
  if (paramScores.tightBaseScore > 0 && paramScores.breakoutScore > 0) {
    return { setup: 'Tight Base Breakout', setupScore: 5 };
  }
  if (paramScores.tightBaseScore > 0) {
    return { setup: 'Tight Base', setupScore: 3 };
  }
  if (paramScores.breakoutScore > 0) {
    return { setup: 'Breakout', setupScore: 3 };
  }
  if (paramScores.emaCrossScore > 0) {
    return { setup: 'EMA Crossover', setupScore: 2 };
  }
  if (paramScores.rsiScore > 0) {
    return { setup: 'RSI Momentum', setupScore: 1 };
  }
  return { setup: 'No actionable setup', setupScore: 0 };
}

export async function POST(request: Request) {
  // 1. Get user session
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const email = session.user.email;
  // 2. Get user from users table
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });
  }
  // 3. Get user plan
  const { data: sub } = await supabase
    .from('user_subscriptions')
    .select('plan_type')
    .eq('user_id', user.id)
    .single();
  if (!sub || sub.plan_type !== 'premium') {
    return NextResponse.json({ success: false, error: 'Premium plan required' }, { status: 403 });
  }

  // Fetch the latest 10 results from the cache table, ignoring date (get latest 10 by refreshed_at)
  const { data: results, error } = await supabase
    .from('momentum_screener_results')
    .select('*')
    .order('refreshed_at', { ascending: false })
    .limit(10);
  if (error) return NextResponse.json({ success: false, error: error.message });
  if (!results || results.length === 0) return NextResponse.json({ success: false, error: 'No screener results available. Please try again later.' });
  return NextResponse.json({ success: true, top10: results });
}
