import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getStockData } from '@/lib/api';

// Helper: Fetch a single page from Trendlyne
async function fetchTrendlynePage(page = 1) {
  const url = `https://trendlyne.com/us/fundamentals/tl-all-in-one-screener-data-get/?screenpk=455451&perPageCount=25&groupType=all&groupName=all&page=${page}`;
  const res = await fetch(url, {
    headers: {
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    }
  });
  const data = await res.json();
  const tableData = data.body?.tableData || [];
  const hasNextPage = !!data.body?.isNextPage;
  return { tableData, hasNextPage };
}

// Fetch Nasdaq momentum stocks
async function fetchNasdaqMomentumStocks() {
  const res = await fetch('https://api.nasdaq.com/api/quote/list-type-extended/validea?queryString=MOMENTUM', {
    headers: {
      'accept': 'application/json, text/plain, */*',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'origin': 'https://www.nasdaq.com',
      'referer': 'https://www.nasdaq.com/',
    }
  });
  const data = await res.json();
  if (!data?.data?.rows) return [];
  return data.data.rows.map((row: any) => ({
    symbol: row.ticker,
    company_name: row.companyName,
    source: 'nasdaq',
  })).filter(s => s.symbol && s.company_name);
}

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    let page = 1;
    let totalProcessed = 0;
    let errors: any[] = [];
    let hasNextPage = true;
    let maxPages = 5;
    let trendlyneStocks: any[] = [];
    while (hasNextPage && page <= maxPages) {
      const { tableData, hasNextPage: nextPage } = await fetchTrendlynePage(page);
      for (const row of tableData) {
        const symbol = row[3];
        const name = row[2];
        if (!symbol || !name) continue;
        trendlyneStocks.push({ symbol, company_name: name, source: 'trendlyne' });
      }
      page++;
      hasNextPage = nextPage;
    }
    // Fetch Nasdaq stocks
    const nasdaqStocks = await fetchNasdaqMomentumStocks();
    // Merge and dedup by symbol (prefer trendlyne if duplicate)
    const allStocksMap = new Map();
    for (const s of [...trendlyneStocks, ...nasdaqStocks]) {
      if (!allStocksMap.has(s.symbol)) {
        allStocksMap.set(s.symbol, s);
      }
    }
    const allStocks = Array.from(allStocksMap.values());
    // Upsert all to momentum_screener_daily
    for (const s of allStocks) {
      const { error } = await supabase.from('momentum_screener_daily').upsert({
        symbol: s.symbol,
        company_name: s.company_name,
        date: today,
        is_momentum_candidate: false,
        is_top_pick: false,
        reason_summary: s.source === 'nasdaq' ? 'Nasdaq momentum' : 'Universe only',
      }, { onConflict: 'date,symbol' });
      if (error) errors.push({ symbol: s.symbol, error: error.message });
      totalProcessed++;
    }
    return NextResponse.json({ success: true, totalProcessed, errors });
  } catch (e) {
    return NextResponse.json({ success: false, error: e?.toString() });
  }
}

export async function POST() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    // 1. Get all symbols from today's universe
    const { data: stocks, error } = await supabase
      .from('momentum_screener_daily')
      .select('symbol, company_name')
      .eq('date', today);
    if (error) return NextResponse.json({ success: false, error: error.message });
    if (!stocks || stocks.length === 0) return NextResponse.json({ success: false, error: 'No stocks for today' });

    // 2. For each symbol, generate trade plan summary
    const results: any[] = [];
    const log: any[] = [];
    for (const { symbol, company_name } of stocks) {
      try {
        const tradePlan = await getStockData(symbol, 3, 'swing');
        const summary = tradePlan.summary || '';
        const setup = tradePlan.setupType || 'N/A';
        const confidence = tradePlan.confidenceLevel || 'N/A';
        const entry = tradePlan.riskManagement?.entryZone || null;
        const stoploss = tradePlan.riskManagement?.initialStopLoss || null;
        const targets = tradePlan.riskManagement?.targets || [];
        const price = tradePlan.currentPrice;
        const trade_recommendation =
          confidence === 'high'
            ? 'Strong setup. Consider for entry with proper risk management.'
            : confidence === 'medium'
            ? 'Some signals align, but wait for confirmation or use smaller position size.'
            : 'Signals are mixed or weak. Avoid new entries or use minimal size.';
        results.push({
          symbol,
          company_name,
          price,
          setup,
          confidence,
          summary,
          entry,
          stoploss,
          targets,
          trade_recommendation,
          planurl: `/trade-plan?symbol=${symbol}&horizon=swing`,
          refreshed_at: new Date().toISOString(),
          date: today
        });
        log.push({ symbol, company_name, price, setup, confidence, summary });
      } catch (e) {
        results.push({ symbol, company_name, price: null, setup: 'N/A', confidence: 'N/A', summary: 'Data unavailable', entry: null, stoploss: null, targets: [], trade_recommendation: 'Data unavailable. Avoid entry.', planurl: `/trade-plan?symbol=${symbol}&horizon=swing`, refreshed_at: new Date().toISOString(), date: today });
        log.push({ symbol, company_name, error: e?.toString() || e });
      }
    }
    // 3. Sort by confidence (high > medium > low > N/A)
    const confidenceRank = { high: 2, medium: 1, low: 0, 'N/A': -1 };
    results.sort((a, b) => (confidenceRank[b.confidence] ?? -1) - (confidenceRank[a.confidence] ?? -1));
    const top10 = results.slice(0, 10);

    // 4. Upsert top 10 into momentum_screener_results
    let upserted = 0;
    let upsertErrors: any[] = [];
    for (const r of top10) {
      const { error: upsertError } = await supabase.from('momentum_screener_results').upsert(r, { onConflict: 'date,symbol' });
      if (!upsertError) upserted++;
      else upsertErrors.push({ symbol: r.symbol, error: upsertError.message, data: r });
    }
    return NextResponse.json({ success: true, upserted, totalProcessed: results.length, upsertErrors, log });
  } catch (e) {
    return NextResponse.json({ success: false, error: e?.toString() });
  }
}
