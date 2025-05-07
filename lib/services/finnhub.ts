import { StockMetrics, TradePlan, TechnicalIndicator } from '../types';
import { TradeSetupType } from '@/lib/types';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'd09nts9r01qus8rebcbgd09nts9r01qus8rebcc0';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

interface FinnhubQuote {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
  t: number;  // Timestamp
}

interface FinnhubProfile {
  marketCapitalization: number;
  finnhubIndustry: string;
  ipo: string;
  weburl: string;
  name: string;
  ticker: string;
}

interface FinnhubTechnicalAnalysis {
  rsi: number;
  macd: number;
  bbands: {
    upper: number;
    middle: number;
    lower: number;
  };
  sma200: number;
}

interface FinnhubTechnicalResponse {
  technicalAnalysis: FinnhubTechnicalAnalysis;
}

export class FinnhubService {
  private static async fetch<T>(endpoint: string, params: Record<string, string>): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const url = `${FINNHUB_BASE_URL}/${endpoint}?${queryString}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Finnhub-Token': FINNHUB_API_KEY
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`Finnhub API error: ${error.error || response.statusText}`);
    }

    const data = await response.json();
    
    // Check for Finnhub API error response
    if (data.error) {
      throw new Error(`Finnhub API error: ${data.error}`);
    }

    return data;
  }

  static async getQuote(symbol: string): Promise<FinnhubQuote> {
    return this.fetch<FinnhubQuote>('quote', { symbol });
  }

  static async getCompanyProfile(symbol: string): Promise<FinnhubProfile> {
    return this.fetch<FinnhubProfile>('stock/profile2', { symbol });
  }

  static async getTechnicalIndicators(symbol: string, resolution: string = 'D'): Promise<FinnhubTechnicalResponse> {
    // Fetch RSI
    const rsiRes = await fetch(`${FINNHUB_BASE_URL}/indicator?symbol=${symbol}&resolution=${resolution}&indicator=rsi&timeperiod=14&token=${FINNHUB_API_KEY}`);
    const rsiData = await rsiRes.json();
    const rsi = rsiData?.technicalAnalysis?.rsi?.slice(-1)[0] || null;

    // Fetch MACD
    const macdRes = await fetch(`${FINNHUB_BASE_URL}/indicator?symbol=${symbol}&resolution=${resolution}&indicator=macd&token=${FINNHUB_API_KEY}`);
    const macdData = await macdRes.json();
    const macd = macdData?.technicalAnalysis?.macd?.slice(-1)[0] || null;

    // Fetch EMA200
    const emaRes = await fetch(`${FINNHUB_BASE_URL}/indicator?symbol=${symbol}&resolution=${resolution}&indicator=ema&timeperiod=200&token=${FINNHUB_API_KEY}`);
    const emaData = await emaRes.json();
    const sma200 = emaData?.technicalAnalysis?.ema?.slice(-1)[0] || null;

    // Fetch Bollinger Bands
    const bbRes = await fetch(`${FINNHUB_BASE_URL}/indicator?symbol=${symbol}&resolution=${resolution}&indicator=bbands&timeperiod=20&token=${FINNHUB_API_KEY}`);
    const bbData = await bbRes.json();
    const bb = bbData?.technicalAnalysis?.bbands;
    const bbands = bb ? {
      upper: bb.upper?.slice(-1)[0] || null,
      middle: bb.middle?.slice(-1)[0] || null,
      lower: bb.lower?.slice(-1)[0] || null
    } : { upper: null, middle: null, lower: null };

    return {
      technicalAnalysis: {
        rsi,
        macd,
        bbands,
        sma200
      }
    };
  }

  static async getMarketNews(category: string = 'general') {
    return this.fetch('news', { category });
  }

  static async getStockMetrics(symbol: string, timeframe: string = 'swing'): Promise<StockMetrics> {
    try {
      const [quote, profile] = await Promise.all([
        this.getQuote(symbol),
        this.getCompanyProfile(symbol)
      ]);

      // Calculate 200 SMA status (using previous close as proxy)
      const sma200 = quote.pc;
      const currentPrice = quote.c;
      const above200SMA = currentPrice > sma200;

      // Calculate trend based on price movement and timeframe
      let trend: 'uptrend' | 'downtrend' | 'sideways';
      if (timeframe === 'swing') {
        // For swing trading, focus on short-term movements
        trend = quote.d > 0.5 ? 'uptrend' : quote.d < -0.5 ? 'downtrend' : 'sideways';
      } else if (timeframe === 'positional') {
        // For positional trading, consider medium-term trends
        trend = quote.d > 1 ? 'uptrend' : quote.d < -1 ? 'downtrend' : 'sideways';
      } else {
        // For long-term trading, consider larger price movements
        trend = quote.d > 2 ? 'uptrend' : quote.d < -2 ? 'downtrend' : 'sideways';
      }

      // Calculate volume metrics (since Finnhub doesn't provide volume data)
      const volumeSpike = false; // We don't have volume data
      const averageVolume = 0; // We don't have volume data
      const currentVolume = 0; // We don't have volume data

      // Calculate breakout strength based on timeframe
      let breakoutStrength: number;
      if (timeframe === 'swing') {
        // For swing trading, focus on short-term breakouts
        breakoutStrength = Math.abs(quote.dp) * 1.5;
      } else if (timeframe === 'positional') {
        // For positional trading, consider medium-term breakouts
        breakoutStrength = Math.abs(quote.dp) * 1.2;
      } else {
        // For long-term trading, consider larger breakouts
        breakoutStrength = Math.abs(quote.dp);
      }

      return {
        trend,
        above200SMA,
        percentFrom52WeekLow: ((currentPrice - quote.l) / quote.l) * 100,
        percentFrom52WeekHigh: ((currentPrice - quote.h) / quote.h) * 100,
        recentTrendChange: quote.dp > (timeframe === 'swing' ? 1.5 : timeframe === 'positional' ? 2 : 3),
        volumeSpike,
        averageVolume,
        currentVolume,
        breakoutStrength: Math.min(breakoutStrength, 100),
        volumeConfirmation: false,
        hasRecentEarnings: false,
        listingAge: 0,
        marketCap: profile.marketCapitalization,
        peRatio: 0, // Finnhub doesn't provide P/E ratio
        industry: profile.finnhubIndustry,
        isInfantIndustry: false,
        hasCatalyst: false,
        volumeStatus: 'normal',
        volumeConfirming: false
      };
    } catch (error) {
      console.error('Error fetching stock metrics:', error);
      throw error;
    }
  }
} 