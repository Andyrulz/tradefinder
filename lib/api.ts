import { TechnicalIndicator, IndicatorSignal } from './types';

// Hardcoded API key for development
const FINNHUB_API_KEY = 'd09nts9r01qus8rebcbgd09nts9r01qus8rebcc0';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// Simple in-memory cache fallback (for SSR or Node)
const memoryCache: Record<string, { data: any; timestamp: number }> = {};

function getCacheKey(symbol: string) {
  return `stockdata_${symbol.toUpperCase()}`;
}

function getCachedStockData(symbol: string): any | null {
  const key = getCacheKey(symbol);
  if (typeof window !== 'undefined' && window.localStorage) {
    const cached = window.localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        return parsed.data;
      }
    }
  } else if (memoryCache[key]) {
    if (Date.now() - memoryCache[key].timestamp < 24 * 60 * 60 * 1000) {
      return memoryCache[key].data;
    }
  }
  return null;
}

function setCachedStockData(symbol: string, data: any) {
  const key = getCacheKey(symbol);
  const value = JSON.stringify({ data, timestamp: Date.now() });
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
  } else {
    memoryCache[key] = { data, timestamp: Date.now() };
  }
}

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side: relative URL is fine
    return '';
  }
  // Server-side: use env variable
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

async function fetchQuote(symbol: string) {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/finnhub?symbol=${symbol}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `API request failed with status ${response.status}`);
  }
  
  return response.json();
}

export async function validateStockSymbol(symbol: string): Promise<boolean> {
  try {
    const data = await fetchQuote(symbol);
    return data && data.quote && typeof data.quote.c === 'number' && data.quote.c > 0;
  } catch (error) {
    console.error('Error validating stock symbol:', error);
    return false;
  }
}

// API key rotation setup
const twelveDataApiKeys = [
  process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY_1 || '4b0c95181f434ef5be044c825bd15b37',
  process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY_2 || '4b0c95181f434ef5be044c825bd15b37',
];
let twelveDataKeyIndex = 0;
function getNextTwelveDataApiKey() {
  const key = twelveDataApiKeys[twelveDataKeyIndex];
  twelveDataKeyIndex = (twelveDataKeyIndex + 1) % twelveDataApiKeys.length;
  return key;
}

export async function getStockData(symbol: string, retries = 3, horizon: string = 'swing'): Promise<any> {
  // Check cache first
  const cached = getCachedStockData(symbol);
  if (cached) return cached;

  try {
    // Get quote data
    const data = await fetchQuote(symbol);

    if (!data || !data.quote || !data.quote.c) {
      throw new Error('Invalid quote data received');
    }

    const quoteData = data.quote;
    const profileData = data.profile;

    // Set interval and outputsize based on horizon
    let interval = '1day';
    let outputsize = 30;
    if (horizon === 'positional') outputsize = 60;
    if (horizon === 'longterm') {
      interval = '1week';
      outputsize = 104;
    }
    // Fetch real historical price data from Twelve Data (with key rotation)
    const twelveDataApiKey = getNextTwelveDataApiKey();
    const tdRes = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${twelveDataApiKey}`);
    const tdJson = await tdRes.json();
    if (!tdJson.values || !Array.isArray(tdJson.values)) {
      throw new Error('Failed to fetch historical data from Twelve Data');
    }
    const priceHistory = tdJson.values.map((v: any) => ({
      date: v.datetime,
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: parseInt(v.volume, 10)
    })).reverse();

    // Define closes and volumes arrays at the top for use in all analytics
    const closes = priceHistory.map((p: any) => p.close);
    const volumes = priceHistory.map((p: any) => p.volume);

    // Calculate trend early so it is available for all analytics
    const trend = (() => {
      if (closes.length < 2) return 'sideways';
      const diff = closes[closes.length - 1] - closes[0];
      if (diff > 0.03 * closes[0]) return 'uptrend';
      if (diff < -0.03 * closes[0]) return 'downtrend';
      return 'sideways';
    })();

    // Volume status
    const volumeStatus = (() => {
      if (volumes.length < 20) return 'Normal';
      const avgVolume = volumes.slice(-20).reduce((a: number, b: number) => a + b, 0) / 20;
      const currentVolume = volumes[volumes.length - 1];
      if (currentVolume > avgVolume * 1.5) return 'Above Average';
      if (currentVolume < avgVolume * 0.7) return 'Below Average';
      return 'Normal';
    })();

    // Volume confirming
    const volumeConfirming = volumeStatus === 'Above Average';

    // Calculate ATR early so it is available for all analytics
    const atr = (() => {
      if (closes.length < 15) return 0;
      let trSum = 0;
      for (let i = 1; i < closes.length; i++) {
        trSum += Math.abs(closes[i] - closes[i - 1]);
      }
      return trSum / (closes.length - 1);
    })();

    // Calculate Average Daily Return and Volatility
    let avgReturn = 'N/A';
    let volatility = 'N/A';
    if (closes.length > 1) {
      const returns = closes.slice(1).map((c: number, i: number) => (c - closes[i]) / closes[i]);
      const mean = returns.reduce((a: number, b: number) => a + b, 0) / returns.length;
      avgReturn = (mean * 100).toFixed(2);
      const variance = returns.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / returns.length;
      volatility = (Math.sqrt(variance) * 100).toFixed(2);
    }

    // Fetch indicators from Twelve Data (with key rotation)
    const rsiKey = getNextTwelveDataApiKey();
    const macdKey = getNextTwelveDataApiKey();
    const bbKey = getNextTwelveDataApiKey();
    const [rsiRes, macdRes, bbRes] = await Promise.all([
      fetch(`https://api.twelvedata.com/rsi?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${rsiKey}`),
      fetch(`https://api.twelvedata.com/macd?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${macdKey}`),
      fetch(`https://api.twelvedata.com/bbands?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${bbKey}`)
    ]);
    const rsiJson = await rsiRes.json();
    const macdJson = await macdRes.json();
    const bbJson = await bbRes.json();

    // Get the latest indicator values
    const latestRSI = rsiJson.values && rsiJson.values.length > 0 ? parseFloat(rsiJson.values[0].rsi) : null;
    const latestMACD = macdJson.values && macdJson.values.length > 0 ? parseFloat(macdJson.values[0].macd) : null;
    const latestMACDSignal = macdJson.values && macdJson.values.length > 0 ? parseFloat(macdJson.values[0].macd_signal) : null;
    const latestMACDHist = macdJson.values && macdJson.values.length > 0 ? parseFloat(macdJson.values[0].macd_hist) : null;
    const latestBB = bbJson.values && bbJson.values.length > 0 ? {
      upper: parseFloat(bbJson.values[0].upper_band),
      middle: parseFloat(bbJson.values[0].middle_band),
      lower: parseFloat(bbJson.values[0].lower_band)
    } : null;

    // --- BEGIN: Build full TradePlan object ---

    // Calculate entryZone, stopLoss, and targets before using them in summary
    const entryZone = {
      low: closes[closes.length - 1] - atr,
      high: closes[closes.length - 1] + atr
    };
    const stopLoss = {
      price: closes[closes.length - 1] - 2 * atr,
      type: 'fixed'
    };
    const targets = [
      { price: closes[closes.length - 1] + atr, probability: 70, riskRewardRatio: 1.5 },
      { price: closes[closes.length - 1] + 2 * atr, probability: 50, riskRewardRatio: 2.0 },
      { price: closes[closes.length - 1] + 3 * atr, probability: 30, riskRewardRatio: 2.5 }
    ];

    // Helper for actionable advice
    function getIndicatorAdvice(name, value, signal) {
      if (name === 'RSI (14)') {
        if (value > 70) return 'Overbought. Consider taking profits or waiting for pullback.';
        if (value < 30) return 'Oversold. Look for potential buying opportunities.';
        if (value > 60) return 'Bullish momentum. Consider entering on pullbacks.';
        if (value < 40) return 'Bearish momentum. Consider reducing exposure.';
        return 'Neutral. Wait for clearer signals.';
      }
      if (name === 'MACD') {
        if (value > 0) return 'Bullish momentum. Consider entering on pullbacks.';
        if (value < 0) return 'Bearish momentum. Consider reducing exposure.';
        return 'Neutral. Wait for clearer signals.';
      }
      if (name === 'Bollinger Bands') {
        if (signal === 'bullish') return 'Price near lower band. Look for potential buying opportunities.';
        if (signal === 'bearish') return 'Price near upper band. Consider taking partial profits.';
        return 'Price within bands. Wait for breakout or breakdown.';
      }
      if (name === 'Average Daily Return') {
        if (value !== 'N/A') {
          const numericValue = parseFloat(value);
          if (numericValue > 0.1) return 'Strong positive returns. Consider entering or holding.';
          if (numericValue < -0.1) return 'Strong negative returns. Consider reducing exposure.';
          return 'Neutral returns. Wait for trend to develop.';
        }
      }
      if (name === 'Volatility') {
        if (value !== 'N/A') {
          const numericValue = parseFloat(value);
          if (numericValue > 3.5) return 'High volatility. Consider reducing position size or waiting for stabilization.';
          if (numericValue < 1) return 'Low volatility. Consider waiting for a breakout.';
          return 'Moderate volatility. Adjust position size accordingly.';
        }
      }
      return '';
    }

    // Indicators (with actionable advice)
    const indicators = [
      {
        name: 'RSI (14)',
        value: latestRSI ?? 'N/A',
        signal: latestRSI !== null && latestRSI !== undefined ? (latestRSI > 60 ? 'bullish' : latestRSI < 40 ? 'bearish' : 'neutral') : 'neutral',
        description: 'Relative Strength Index',
        education: 'RSI measures momentum.',
        actionableAdvice: latestRSI !== null && latestRSI !== undefined ? getIndicatorAdvice('RSI (14)', latestRSI, (latestRSI > 60 ? 'bullish' : latestRSI < 40 ? 'bearish' : 'neutral')) : ''
      },
      {
        name: 'MACD',
        value: latestMACD ?? 'N/A',
        signal: latestMACD !== null && latestMACD !== undefined ? (latestMACD > 0 ? 'bullish' : latestMACD < 0 ? 'bearish' : 'neutral') : 'neutral',
        description: 'MACD momentum',
        education: 'MACD is a trend-following indicator.',
        actionableAdvice: latestMACD !== null && latestMACD !== undefined ? getIndicatorAdvice('MACD', latestMACD, (latestMACD > 0 ? 'bullish' : latestMACD < 0 ? 'bearish' : 'neutral')) : ''
      },
      {
        name: 'Bollinger Bands',
        value: latestBB ? `${latestBB.upper?.toFixed(2) ?? 'N/A'} / ${latestBB.middle?.toFixed(2) ?? 'N/A'} / ${latestBB.lower?.toFixed(2) ?? 'N/A'}` : '',
        signal: latestBB && closes.length > 0 ? (closes[closes.length - 1] > (latestBB.upper ?? 0) ? 'bearish' : closes[closes.length - 1] < (latestBB.lower ?? 0) ? 'bullish' : 'neutral') : 'neutral',
        description: 'Bollinger Bands',
        education: 'Bands show volatility.',
        actionableAdvice: latestBB && closes.length > 0 ? getIndicatorAdvice('Bollinger Bands', closes[closes.length - 1], (closes[closes.length - 1] > (latestBB.upper ?? 0) ? 'bearish' : closes[closes.length - 1] < (latestBB.lower ?? 0) ? 'bullish' : 'neutral')) : ''
      },
      {
        name: 'Average Daily Return',
        value: avgReturn !== 'N/A' ? `${avgReturn}%` : 'N/A',
        signal: avgReturn !== 'N/A' ? (parseFloat(avgReturn) > 0.1 ? 'bullish' : parseFloat(avgReturn) < -0.1 ? 'bearish' : 'neutral') : 'neutral',
        description: avgReturn !== 'N/A' ? `Average daily return is ${avgReturn}%.` : 'Not enough data.',
        education: 'Average daily return shows the mean percentage change per day over the selected period.',
        actionableAdvice: avgReturn !== 'N/A'
          ? (parseFloat(avgReturn) > 0.1
              ? 'Strong positive returns. Consider entering or holding.'
              : parseFloat(avgReturn) < -0.1
              ? 'Strong negative returns. Consider reducing exposure.'
              : 'Neutral returns. Wait for trend to develop.')
          : 'Data not available.'
      },
      {
        name: 'Volatility',
        value: volatility !== 'N/A' ? `${volatility}%` : 'N/A',
        signal: volatility !== 'N/A' ? (parseFloat(volatility) > 3.5 ? 'bearish' : parseFloat(volatility) < 1 ? 'bullish' : 'neutral') : 'neutral',
        description: volatility !== 'N/A' ? `Volatility (std dev of daily returns) is ${volatility}%.` : 'Not enough data.',
        education: 'Volatility measures the standard deviation of daily returns. Higher volatility means more risk.',
        actionableAdvice: volatility !== 'N/A'
          ? (parseFloat(volatility) > 3.5
              ? 'High volatility. Consider reducing position size or waiting for stabilization.'
              : parseFloat(volatility) < 1
              ? 'Low volatility. Consider waiting for a breakout.'
              : 'Moderate volatility. Adjust position size accordingly.')
          : 'Data not available.'
      }
    ];

    // Data-driven confidence and summary
    const bullishSignals = indicators.filter(i => i.signal === 'bullish').length;
    const bearishSignals = indicators.filter(i => i.signal === 'bearish').length;
    let confidenceLevel = 'medium';
    if (bullishSignals >= 2 && trend === 'uptrend' && volumeConfirming) confidenceLevel = 'high';
    else if (bearishSignals >= 2 && trend === 'downtrend') confidenceLevel = 'low';
    else confidenceLevel = 'medium';

    let setupType = 'bullish_breakout';
    if (trend === 'downtrend' && bearishSignals >= 2) setupType = 'trend_continuation';
    else if (trend === 'sideways') setupType = 'support_bounce';

    let summary = '';
    if (confidenceLevel === 'high') summary = 'Strong alignment of trend, volume, and indicators. Consider entering with proper risk management.';
    else if (confidenceLevel === 'medium') summary = 'Some signals align, but wait for confirmation or use smaller position size.';
    else summary = 'Signals are mixed or weak. Avoid new entries or use minimal size.';
    // Use USD formatting for all price values in summary
    const { formatNumber } = await import('./utils');
    // Remove entry/stop/targets from summary for market outlook
    // summary += ` Current trend: ${trend}. ATR: ${atr.toFixed(2)}. Entry zone: ${formatNumber(entryZone.low)} - ${formatNumber(entryZone.high)}. Stop loss: ${formatNumber(stopLoss.price)}. Targets: ${targets.map(t => formatNumber(t.price)).join(', ')}.`;
    summary += ` Current trend: ${trend}. ATR: ${atr.toFixed(2)}.`;

    // --- END: Build full TradePlan object ---
    const tradePlan = {
      symbol,
      companyName: profileData?.name || symbol,
      currentPrice: quoteData.c,
      direction: bullishSignals > bearishSignals ? 'bullish' : bearishSignals > bullishSignals ? 'bearish' : 'neutral',
      timeHorizon: horizon,
      confidenceLevel,
      setupType,
      riskManagement: {
        probabilityScore: 70, // Placeholder, replace with real calculation if available
        riskRewardRatio: 2.0, // Placeholder, replace with real calculation if available
        suggestedPositionSize: 100, // Placeholder, replace with real calculation if available
        entryZone,
        initialStopLoss: stopLoss,
        targets,
        trailingStops: [], // Add logic if needed
        volumeConfirmation: volumeConfirming,
        patternReliability: 80 // Placeholder
      },
      summary,
      priceHistory,
      indicators,
      metrics: {
        trend,
        volumeStatus,
        volumeConfirming,
        averageVolume: volumes.length > 0 ? (volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length) : 0,
        currentVolume: volumes.length > 0 ? volumes[volumes.length - 1] : 0,
        breakoutStrength: 0, // Placeholder
        hasRecentEarnings: false, // Placeholder
        listingAge: 0, // Placeholder
        marketCap: profileData?.marketCapitalization || 0,
        peRatio: 0, // Placeholder
        industry: profileData?.finnhubIndustry || '',
        isInfantIndustry: false, // Placeholder
        hasCatalyst: false, // Placeholder
      },
      keyLevels: [], // Add logic if needed
      atr,
      chartData: { annotations: { entry: [], stop: [], targets: [], trailingStops: [] }, indicators: [] }
    };
    setCachedStockData(symbol, tradePlan);
    return tradePlan;
  } catch (error) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, 1500));
      return getStockData(symbol, retries - 1);
    }
    console.error('Error fetching stock data:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch stock data');
  }
}

function calculateSimpleTechnicalScore(quoteData: any): number {
  let score = 50; // Base score

  // Factor 1: Daily performance (up to ±15 points)
  const dailyChangePercent = quoteData.dp || 0;
  score += Math.min(Math.max(dailyChangePercent * 3, -15), 15);

  // Factor 2: Current price vs previous close (up to ±15 points)
  const previousClose = quoteData.pc || quoteData.c;
  const priceVsPrevClose = ((quoteData.c - previousClose) / previousClose * 100);
  score += Math.min(Math.max(priceVsPrevClose * 3, -15), 15);

  // Factor 3: Position within day's range (up to ±20 points)
  const dayRange = quoteData.h - quoteData.l;
  if (dayRange > 0) {
    const positionInRange = (quoteData.c - quoteData.l) / dayRange;
    score += (positionInRange - 0.5) * 40;
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}