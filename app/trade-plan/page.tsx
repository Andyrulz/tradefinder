"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { TradingRecommendation } from '@/components/trade-plan/TradingRecommendation';
import { TechnicalAnalysis } from '@/components/trade-plan/TechnicalAnalysis';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { AdSenseAd } from '@/components/ui/AdSenseAd';
import { TradePlanHeader } from '@/components/trade-plan/TradePlanHeader';

export default function TradePlanPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbol = searchParams.get('symbol') || 'AAPL';
  const initialHorizon = searchParams.get('horizon') || 'swing';

  const [horizon, setHorizon] = useState<string>(initialHorizon);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tradePlan, setTradePlan] = useState<any | null>(null);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [indicatorsLoading, setIndicatorsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{ request_count: number; total_requests: number; date: string } | null>(null);

  // Handler for timeframe toggle
  const handleHorizonChange = (newHorizon: string) => {
    setHorizon(newHorizon);
    // Update the URL for shareability
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('horizon', newHorizon);
    router.replace(`?${params.toString()}`);
  };

  // Calculate trend type based on price history
  const calculateTrend = (prices: number[] = []): 'uptrend' | 'downtrend' | 'sideways' => {
    if (!Array.isArray(prices) || prices.length === 0) return 'sideways';
    const periods = 20; // Look at last 20 periods
    const recentPrices = prices.slice(-periods);
    const priceChanges = recentPrices.map((price, i) => 
      i > 0 ? price - recentPrices[i - 1] : 0
    ).slice(1);

    const positiveChanges = priceChanges.filter(change => change > 0).length;
    const negativeChanges = priceChanges.filter(change => change < 0).length;

    if (positiveChanges > negativeChanges * 1.5) return 'uptrend';
    if (negativeChanges > positiveChanges * 1.5) return 'downtrend';
    return 'sideways';
  };

  // Calculate if there's a volume spike
  const hasVolumeSpike = (volumes: number[]): boolean => {
    const recentVolumes = volumes.slice(-5);
    const avgVolume = volumes.slice(-20, -5).reduce((a, b) => a + b, 0) / 15;
    return recentVolumes.some(vol => vol > avgVolume * 1.5);
  };

  // Calculate if there's a recent trend change
  const hasRecentTrendChange = (prices: number[]): boolean => {
    const shortTerm = calculateTrend(prices.slice(-10));
    const longTerm = calculateTrend(prices.slice(-30, -10));
    return shortTerm !== longTerm;
  };

  // Calculate ATR (Average True Range)
  const calculateATR = (prices: number[], period: number = 14): number => {
    const trueRanges = prices.map((price, i) => {
      if (i === 0) return 0;
      const high = Math.max(price, prices[i - 1]);
      const low = Math.min(price, prices[i - 1]);
      return high - low;
    });
    
    return trueRanges.slice(-period).reduce((sum, tr) => sum + tr, 0) / period;
  };

  // Find support and resistance levels
  const findSupportResistanceLevels = (prices: number[], period: number = 20): { support: number[], resistance: number[] } => {
    const levels = {
      support: [] as number[],
      resistance: [] as number[]
    };

    // Look for swing highs and lows
    for (let i = period; i < prices.length - period; i++) {
      const window = prices.slice(i - period, i + period);
      const current = prices[i];
      
      // Check for resistance
      if (current === Math.max(...window)) {
        levels.resistance.push(current);
      }
      // Check for support
      if (current === Math.min(...window)) {
        levels.support.push(current);
      }
    }

    // Remove duplicates and sort
    levels.support = Array.from(new Set(levels.support)).sort((a, b) => a - b);
    levels.resistance = Array.from(new Set(levels.resistance)).sort((a, b) => a - b);

    return levels;
  };

  // Detect trade setup type
  const detectTradeSetup = (
    prices: { open: number; high: number; low: number; close: number }[],
    volumes: number[],
    support: number[],
    resistance: number[],
    atr: number
  ): 'bullish_breakout' | 'support_bounce' | 'trend_continuation' => {
    const current = prices[prices.length - 1];
    const prev = prices[prices.length - 2];
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const currentVolume = volumes[volumes.length - 1];

    // Check for bullish breakout
    const nearestResistance = resistance.filter(r => r < current.close).pop();
    if (nearestResistance && 
        current.close > nearestResistance && 
        currentVolume > avgVolume * 1.5) {
      return 'bullish_breakout';
    }

    // Check for support bounce
    const nearestSupport = support.filter(s => s < current.close).pop();
    if (nearestSupport && 
        Math.abs(current.close - nearestSupport) < atr * 0.5 &&
        current.close > current.open &&
        currentVolume > avgVolume) {
      return 'support_bounce';
    }

    // Check for trend continuation
    const ema20 = calculateEMA(prices.map(p => p.close), 20);
    const ema50 = calculateEMA(prices.map(p => p.close), 50);
    const isInsideBar = current.high < prev.high && current.low > prev.low;
    
    if (ema20[ema20.length - 1] > ema50[ema50.length - 1] &&
        isInsideBar &&
        current.close > prev.close) {
      return 'trend_continuation';
    }

    return 'bullish_breakout'; // Default to breakout if no clear pattern
  };

  // Calculate EMA
  const calculateEMA = (prices: number[], period: number): number[] => {
    const k = 2 / (period + 1);
    const ema = [prices[0]];
    
    for (let i = 1; i < prices.length; i++) {
      ema.push(prices[i] * k + ema[i - 1] * (1 - k));
    }
    
    return ema;
  };

  // Calculate breakout strength
  const calculateBreakoutStrength = (
    prices: { open: number; high: number; low: number; close: number }[],
    volumes: number[],
    setupType: 'bullish_breakout' | 'support_bounce' | 'trend_continuation',
    atr: number
  ): number => {
    const current = prices[prices.length - 1];
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const currentVolume = volumes[volumes.length - 1];
    
    let strength = 0;
    
    // Volume factor
    const volumeRatio = currentVolume / avgVolume;
    strength += Math.min(volumeRatio * 20, 40);
    
    // Price action factor
    const bodySize = Math.abs(current.close - current.open);
    const totalRange = current.high - current.low;
    const bodyRatio = bodySize / totalRange;
    strength += bodyRatio * 30;
    
    // Setup type factor
    switch (setupType) {
      case 'bullish_breakout':
        strength += 20;
        break;
      case 'support_bounce':
        strength += 15;
        break;
      case 'trend_continuation':
        strength += 10;
        break;
    }
    
    return Math.min(strength, 100);
  };

  // Generate technical indicators
  const generateIndicators = (trend: 'bullish' | 'bearish' | 'neutral'): any[] => {
    return [
      {
        name: 'Trend Direction',
        value: trend,
        signal: trend,
        description: `The stock shows ${trend} signals based on recent price action.`,
        education: 'Trend direction helps identify the overall market sentiment and potential future movement.'
      },
      {
        name: 'Volume Analysis',
        value: 'Volume Confirmation',
        signal: trend,
        description: 'Volume analysis confirms the trend direction.',
        education: 'Volume confirmation is crucial for validating price movements.'
      },
      {
        name: 'Momentum Strength',
        value: 'Momentum Analysis',
        signal: trend,
        description: 'Momentum indicators align with the trend direction.',
        education: 'Momentum helps identify the strength of the current trend.'
      }
    ];
  };

  // Calculate confidence level
  const calculateConfidenceLevel = (
    riskManagement: any,
    metrics: any
  ): 'high' | 'medium' | 'low' => {
    const score = riskManagement.probabilityScore;
    
    if (score >= 70 && 
        riskManagement.riskRewardRatio >= 2 &&
        metrics.volumeConfirmation &&
        metrics.breakoutStrength >= 70) {
      return 'high';
    }
    
    if (score >= 50 && 
        riskManagement.riskRewardRatio >= 1.5 &&
        (metrics.volumeConfirmation || metrics.breakoutStrength >= 50)) {
      return 'medium';
    }
    
    return 'low';
  };

  // Calculate risk management levels
  const calculateRiskManagement = (
    prices: { open: number; high: number; low: number; close: number }[],
    volumes: number[],
    metrics: any,
    atr: number,
    setupType: 'bullish_breakout' | 'support_bounce' | 'trend_continuation',
    horizon: 'swing' | 'positional' | 'longterm'
  ): any => {
    const current = prices[prices.length - 1];
    const trend = metrics.trend;
    const recentVolume = volumes.slice(-5);
    const avgVolume = volumes.slice(-20, -5).reduce((a, b) => a + b, 0) / 15;
    
    // Find support and resistance levels
    const { support, resistance } = findSupportResistanceLevels(prices.map(p => p.close));
    
    // Find nearest support and resistance
    const nearestSupport = support.filter(s => s < current.close).pop() || (current.close - (atr * 2));
    const nearestResistance = resistance.filter(r => r > current.close).shift() || (current.close + (atr * 2));
    
    // Calculate trend strength based on timeframe
    const trendStrength = (() => {
      const lookbackPeriod = horizon === 'swing' ? 10 : horizon === 'positional' ? 20 : 50;
      const recentPrices = prices.slice(-lookbackPeriod);
      const priceChanges = recentPrices.map((price, i) => 
        i > 0 ? price.close - recentPrices[i - 1].close : 0
      ).slice(1);
      
      const positiveChanges = priceChanges.filter(change => change > 0).length;
      return positiveChanges / priceChanges.length;
    })();

    // Entry zone based on setup type and timeframe
    const entryZone = (() => {
      const atrMultiplier = horizon === 'swing' ? 0.5 : horizon === 'positional' ? 0.75 : 1;
      switch (setupType) {
        case 'bullish_breakout':
          return {
            low: current.close,
            high: current.close + (atr * atrMultiplier),
            description: 'Enter on breakout confirmation with volume',
            momentum: 'strong' as const
          };
        case 'support_bounce':
          return {
            low: Math.max(current.close - (atr * atrMultiplier), nearestSupport),
            high: current.close,
            description: 'Enter on bounce from support with volume confirmation',
            momentum: 'moderate' as const
          };
        case 'trend_continuation':
          return {
            low: current.close - (atr * atrMultiplier),
            high: current.close + (atr * atrMultiplier),
            description: 'Enter on continuation with volume confirmation',
            momentum: 'moderate' as const
          };
      }
    })();

    // Initial stop loss based on setup type and timeframe
    const initialStopLoss: any = (() => {
      const atrMultiplier = horizon === 'swing' ? 1.5 : horizon === 'positional' ? 2 : 2.5;
      switch (setupType) {
        case 'bullish_breakout':
          return {
            price: Math.max(current.close - (atr * atrMultiplier), nearestSupport),
            type: 'trailing_stop' as const,
            description: 'Stop loss below breakout level',
            atrMultiple: atrMultiplier
          };
        case 'support_bounce':
          return {
            price: nearestSupport - (atr * atrMultiplier),
            type: 'trailing_stop' as const,
            description: 'Stop loss below support level',
            atrMultiple: atrMultiplier
          };
        case 'trend_continuation':
          return {
            price: current.close - (atr * atrMultiplier),
            type: 'trailing_stop' as const,
            description: 'Stop loss below trend continuation',
            atrMultiple: atrMultiplier
          };
      }
    })();

    // Targets based on setup type, risk:reward, and timeframe
    const baseMultipliers = horizon === 'swing' ? [1.5, 2.5, 4] :
                          horizon === 'positional' ? [2, 3, 5] :
                          [2.5, 4, 6];
    const riskPerShare = Math.abs(current.close - initialStopLoss.price);
    const targets = [
      {
        price: current.close + (riskPerShare * baseMultipliers[0]),
        type: 'target',
        probability: 70,
        description: `First target at ${baseMultipliers[0]}x risk`,
        riskRewardRatio: baseMultipliers[0]
      },
      {
        price: current.close + (riskPerShare * baseMultipliers[1]),
        type: 'target',
        probability: 40,
        description: `Second target at ${baseMultipliers[1]}x risk`,
        riskRewardRatio: baseMultipliers[1]
      },
      {
        price: current.close + (riskPerShare * baseMultipliers[2]),
        type: 'target',
        probability: 20,
        description: `Third target at ${baseMultipliers[2]}x risk`,
        riskRewardRatio: baseMultipliers[2]
      }
    ];
    // Trailing stops based on setup type and timeframe
    const atrMultipliers = horizon === 'swing' ? [1.5, 1] :
                          horizon === 'positional' ? [2, 1.5] :
                          [2.5, 2];
    const trailingStops = [
      {
        price: current.close - (atr * atrMultipliers[0]),
        type: 'trailing_stop' as const,
        description: `First trailing stop at ${atrMultipliers[0]} ATR`,
        atrMultiple: atrMultipliers[0],
        pivotType: 'swing_low' as const
      },
      {
        price: current.close - (atr * atrMultipliers[1]),
        type: 'trailing_stop' as const,
        description: `Second trailing stop at ${atrMultipliers[1]} ATR`,
        atrMultiple: atrMultipliers[1],
        pivotType: 'moving_average' as const
      }
    ];
    // Calculate risk per share (entry - stop loss)
    const entryPrice = entryZone.low; // Use lower bound of entry zone as entry
    const stopLossPrice = initialStopLoss.price;
    // Find the target with the highest probability
    const highestProbTarget = targets.reduce((max, t) => t.probability > max.probability ? t : max, targets[0]);
    const risk = Math.abs(entryPrice - stopLossPrice);
    const reward = Math.abs(highestProbTarget.price - entryPrice);
    const riskRewardRatio = risk > 0 ? parseFloat((reward / risk).toFixed(2)) : 0;

    // Calculate probability score with timeframe adjustments
    const probabilityScore = (() => {
      let score = 0;
      
      // Setup type factor with timeframe adjustment
      const setupTypeMultiplier = horizon === 'swing' ? 1.2 : horizon === 'positional' ? 1 : 0.8;
      switch (setupType) {
        case 'bullish_breakout':
          score += 25 * setupTypeMultiplier;
          break;
        case 'support_bounce':
          score += 20 * setupTypeMultiplier;
          break;
        case 'trend_continuation':
          score += 15 * setupTypeMultiplier;
          break;
      }
      
      // Volume confirmation with timeframe adjustment
      const volumeMultiplier = horizon === 'swing' ? 1.2 : horizon === 'positional' ? 1 : 0.8;
      if (metrics.volumeConfirmation) score += 20 * volumeMultiplier;
      
      // Trend alignment with timeframe adjustment
      const trendMultiplier = horizon === 'swing' ? 1 : horizon === 'positional' ? 1.2 : 1.5;
      if (trend === 'uptrend') score += 15 * trendMultiplier;
      if (metrics.above200SMA) score += 10 * trendMultiplier;
      
      // Price action with timeframe adjustment
      const priceActionMultiplier = horizon === 'swing' ? 1 : horizon === 'positional' ? 1.2 : 1.5;
      if (metrics.percentFrom52WeekLow >= 50) score += 10 * priceActionMultiplier;
      if (current.close > nearestSupport + atr) score += 10 * priceActionMultiplier;
      
      // Risk:Reward with timeframe adjustment
      const riskRewardMultiplier = horizon === 'swing' ? 1 : horizon === 'positional' ? 1.2 : 1.5;
      if (riskPerShare * 2.5 <= Math.abs(current.close - nearestResistance)) score += 10 * riskRewardMultiplier;
      
      return Math.min(score, 100);
    })();

    const breakoutStrength = calculateBreakoutStrength(prices, volumes, setupType, atr);
    const trendAlignment = trend === 'uptrend' ? 100 : trend === 'sideways' ? 50 : 0;

    return {
      initialStopLoss: {
        price: initialStopLoss.price,
        type: initialStopLoss.type === 'trailing' ? 'trailing' : 'fixed',
      },
      trailingStops: trailingStops.map(stop => ({
        price: stop.price,
        trigger: stop.atrMultiple ?? 1,
        type: 'trailing_stop' as const,
      })),
      targets: targets.map(target => ({
        price: target.price,
        probability: target.probability ?? 50,
        riskRewardRatio: target.riskRewardRatio ?? 2,
        type: 'target' as const,
      })),
      entryZone,
      riskRewardRatio, // Use calculated value
      probabilityScore,
      volumeConfirmation: recentVolume.some(vol => vol > avgVolume * 1.5),
      patternReliability: probabilityScore,
      suggestedPositionSize: (() => {
        if (horizon === 'swing') {
          return probabilityScore > 70 ? 5 : 3;
        } else if (horizon === 'positional') {
          return probabilityScore > 70 ? 4 : 2;
        } else {
          return probabilityScore > 70 ? 3 : 1;
        }
      })(),
    };
  };

  // Add new timeframe-specific analysis functions
  const analyzeSwingTimeframe = (
    prices: any[],
    volumes: number[],
    ema20: number[],
    rsi: number[]
  ): { signals: { bullish: number; bearish: number }; details: string[] } => {
    const signals = { bullish: 0, bearish: 0 };
    const details: string[] = [];
    const current = prices[prices.length - 1];
    const prev = prices[prices.length - 2];
    const currentRSI = rsi[rsi.length - 1];
    const prevRSI = rsi[rsi.length - 2];
    const currentEMA20 = ema20[ema20.length - 1];
    const prevEMA20 = ema20[ema20.length - 2];

    // RSI Analysis
    if (currentRSI > 55 && currentRSI > prevRSI) {
      signals.bullish++;
      details.push('RSI above 55 and rising');
    } else if (currentRSI < 45 && currentRSI < prevRSI) {
      signals.bearish++;
      details.push('RSI below 45 and falling');
    }

    // Trend Confirmation
    if (current.close > currentEMA20 && currentEMA20 > prevEMA20) {
      signals.bullish++;
      details.push('Price above rising 20 EMA');
    } else if (current.close < currentEMA20 && currentEMA20 < prevEMA20) {
      signals.bearish++;
      details.push('Price below falling 20 EMA');
    }

    // Volume Analysis
    const recentVolumes = volumes.slice(-5);
    const upDays = recentVolumes.filter((vol, i) => 
      i > 0 && prices[prices.length - i].close > prices[prices.length - i - 1].close
    ).length;
    const downDays = recentVolumes.filter((vol, i) => 
      i > 0 && prices[prices.length - i].close < prices[prices.length - i - 1].close
    ).length;

    if (upDays > downDays) {
      signals.bullish++;
      details.push('More up days than down days in recent volume');
    } else if (downDays > upDays) {
      signals.bearish++;
      details.push('More down days than up days in recent volume');
    }

    // Price Action
    const recentHigh = Math.max(...prices.slice(-10).map(p => p.high));
    const recentLow = Math.min(...prices.slice(-10).map(p => p.low));
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;

    if (current.close > recentHigh && current.volume > avgVolume * 1.5) {
      signals.bullish++;
      details.push('Breakout above recent high on high volume');
    } else if (current.close < recentLow && current.volume > avgVolume * 1.5) {
      signals.bearish++;
      details.push('Breakdown below recent low on high volume');
    }

    return { signals, details };
  };

  const analyzePositionalTimeframe = (
    prices: any[],
    volumes: number[],
    ema50: number[],
    ema200: number[],
    macd: { line: number[]; signal: number[]; histogram: number[] }
  ): { signals: { bullish: number; bearish: number }; details: string[] } => {
    const signals = { bullish: 0, bearish: 0 };
    const details: string[] = [];
    const current = prices[prices.length - 1];
    const currentEMA50 = ema50[ema50.length - 1];
    const prevEMA50 = ema50[ema50.length - 2];
    const currentEMA200 = ema200[ema200.length - 1];
    const currentMACD = macd.line[macd.line.length - 1];
    const prevMACD = macd.line[macd.line.length - 2];
    const currentSignal = macd.signal[macd.signal.length - 1];
    const prevSignal = macd.signal[macd.signal.length - 2];
    const currentHist = macd.histogram[macd.histogram.length - 1];
    const prevHist = macd.histogram[macd.histogram.length - 2];

    // Moving Averages
    if (current.close > currentEMA50 && currentEMA50 > currentEMA200) {
      signals.bullish++;
      details.push('Price above 50 DMA and 50 DMA above 200 DMA');
    } else if (current.close < currentEMA50 && currentEMA50 < currentEMA200) {
      signals.bearish++;
      details.push('Price below 50 DMA and 50 DMA below 200 DMA');
    }

    // MACD
    if (currentMACD > currentSignal && currentHist > prevHist) {
      signals.bullish++;
      details.push('MACD bullish crossover with rising histogram');
    } else if (currentMACD < currentSignal && currentHist < prevHist) {
      signals.bearish++;
      details.push('MACD bearish crossover with declining histogram');
    }

    // 52-Week Range
    const yearHigh = Math.max(...prices.slice(-252).map(p => p.high));
    const yearLow = Math.min(...prices.slice(-252).map(p => p.low));
    const range = yearHigh - yearLow;
    const position = (current.close - yearLow) / range;

    if (position > 0.8 && position < 0.9) {
      signals.bullish++;
      details.push('Price consolidating near 52-week high');
    } else if (position < 0.2) {
      signals.bearish++;
      details.push('Price near 52-week low');
    }

    // Bollinger Bands
    const bb = calculateBollingerBands(prices.map((p: any) => p.close));
    const currentBB = bb[bb.length - 1];
    const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;

    if (current.close > currentBB.upper && current.volume > avgVolume * 1.5) {
      signals.bullish++;
      details.push('Price breaking upper Bollinger Band with volume');
    } else if (current.close < currentBB.lower && current.volume > avgVolume) {
      signals.bearish++;
      details.push('Price at lower Bollinger Band with expansion');
    }

    return { signals, details };
  };

  const analyzeLongTermTimeframe = (
    prices: any[],
    weeklyPrices: any[],
    indexPrices: any[]
  ): { signals: { bullish: number; bearish: number }; details: string[] } => {
    const signals = { bullish: 0, bearish: 0 };
    const details: string[] = [];
    const current = prices[prices.length - 1];
    const weeklyEMA40 = calculateEMA(weeklyPrices.map(p => p.close), 40);
    const currentWeeklyEMA = weeklyEMA40[weeklyEMA40.length - 1];
    const prevWeeklyEMA = weeklyEMA40[weeklyEMA40.length - 2];

    // 200 WMA Analysis
    if (current.close > currentWeeklyEMA && currentWeeklyEMA > prevWeeklyEMA) {
      signals.bullish++;
      details.push('Price above rising 40-week EMA');
    } else if (current.close < currentWeeklyEMA && currentWeeklyEMA < prevWeeklyEMA) {
      signals.bearish++;
      details.push('Price below falling 40-week EMA');
    }

    // Stage Analysis
    const stage = analyzeStage(weeklyPrices);
    if (stage === 'stage2') {
      signals.bullish++;
      details.push('Stage 2 breakout from long base');
    } else if (stage === 'stage4') {
      signals.bearish++;
      details.push('Stage 4 decline');
    }

    // Relative Strength
    const rs = calculateRelativeStrength(prices, indexPrices);
    if (rs > 0) {
      signals.bullish++;
      details.push('Positive relative strength vs index');
    } else if (rs < 0) {
      signals.bearish++;
      details.push('Negative relative strength vs index');
    }

    // Trend Structure
    const trendStructure = analyzeTrendStructure(weeklyPrices);
    if (trendStructure === 'higher_highs_lows') {
      signals.bullish++;
      details.push('Series of higher highs and higher lows');
    } else if (trendStructure === 'lower_highs_lows') {
      signals.bearish++;
      details.push('Series of lower highs and lower lows');
    }

    return { signals, details };
  };

  // Helper functions
  const calculateBollingerBands = (prices: number[], period: number = 20, stdDev: number = 2) => {
    const sma = calculateSMA(prices, period);
    const bands = prices.map((_, i) => {
      if (i < period - 1) return { upper: 0, middle: 0, lower: 0 };
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const squaredDiffs = slice.map(price => Math.pow(price - mean, 2));
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
      const std = Math.sqrt(variance);
      return {
        upper: mean + (stdDev * std),
        middle: mean,
        lower: mean - (stdDev * std)
      };
    });
    return bands;
  };

  const calculateSMA = (prices: number[], period: number): number[] => {
    return prices.map((_, i) => {
      if (i < period - 1) return 0;
      const slice = prices.slice(i - period + 1, i + 1);
      return slice.reduce((a, b) => a + b, 0) / period;
    });
  };

  const calculateRSI = (prices: number[], period: number = 14): number[] => {
    const changes = prices.map((price, i) => i > 0 ? price - prices[i - 1] : 0);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    const avgGain = calculateSMA(gains, period);
    const avgLoss = calculateSMA(losses, period);
    
    return prices.map((_, i) => {
      if (i < period) return 50;
      const rs = avgGain[i] / avgLoss[i];
      return 100 - (100 / (1 + rs));
    });
  };

  const calculateMACD = (prices: number[]): { line: number[]; signal: number[]; histogram: number[] } => {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macdLine = prices.map((_, i) => ema12[i] - ema26[i]);
    const signalLine = calculateEMA(macdLine, 9);
    const histogram = macdLine.map((macd, i) => macd - signalLine[i]);
    
    return { line: macdLine, signal: signalLine, histogram };
  };

  const analyzeStage = (weeklyPrices: any[]): 'stage1' | 'stage2' | 'stage3' | 'stage4' => {
    const ema40 = calculateEMA(weeklyPrices.map(p => p.close), 40);
    const current = weeklyPrices[weeklyPrices.length - 1];
    const currentEMA = ema40[ema40.length - 1];
    
    // Simplified stage analysis
    if (current.close > currentEMA * 1.1) return 'stage2';
    if (current.close < currentEMA * 0.9) return 'stage4';
    return 'stage1';
  };

  const calculateRelativeStrength = (prices: any[], indexPrices: any[]): number => {
    const priceChange = (prices[prices.length - 1].close - prices[0].close) / prices[0].close;
    const indexChange = (indexPrices[indexPrices.length - 1].close - indexPrices[0].close) / indexPrices[0].close;
    return priceChange - indexChange;
  };

  const analyzeTrendStructure = (weeklyPrices: any[]): 'higher_highs_lows' | 'lower_highs_lows' | 'mixed' => {
    const highs: number[] = [];
    const lows: number[] = [];
    
    for (let i = 2; i < weeklyPrices.length - 2; i++) {
      if (weeklyPrices[i].high > weeklyPrices[i-1].high && weeklyPrices[i].high > weeklyPrices[i+1].high) {
        highs.push(weeklyPrices[i].high);
      }
      if (weeklyPrices[i].low < weeklyPrices[i-1].low && weeklyPrices[i].low < weeklyPrices[i+1].low) {
        lows.push(weeklyPrices[i].low);
      }
    }
    
    const higherHighs = highs.every((high, i) => i === 0 || high > highs[i-1]);
    const higherLows = lows.every((low, i) => i === 0 || low > lows[i-1]);
    const lowerHighs = highs.every((high, i) => i === 0 || high < highs[i-1]);
    const lowerLows = lows.every((low, i) => i === 0 || low < lows[i-1]);
    
    if (higherHighs && higherLows) return 'higher_highs_lows';
    if (lowerHighs && lowerLows) return 'lower_highs_lows';
    return 'mixed';
  };

  // Fetch and calculate technical indicators using Twelve Data API values
  useEffect(() => {
    setIndicatorsLoading(true);
    try {
      if (!tradePlan || !tradePlan.externalIndicators) {
        setIndicators([]);
        setIndicatorsLoading(false);
        return;
      }
      let priceHistory = tradePlan.priceHistory || [];
      let windowSize = 30;
      if (horizon === 'positional') windowSize = 60;
      if (horizon === 'longterm') windowSize = 200;
      priceHistory = priceHistory.slice(-windowSize);
      const closes = priceHistory.map((p: any) => p.close);

      // Use external indicators from API
      const rsi = tradePlan.externalIndicators.rsi;
      const macd = tradePlan.externalIndicators.macd;
      const bb = tradePlan.externalIndicators.bbands;

      // Average Daily Return
      let avgReturn = null;
      if (closes.length > 1) {
        const returns = closes.slice(1).map((c: number, i: number) => (c - closes[i]) / closes[i]);
        avgReturn = 100 * (returns.reduce((a: number, b: number) => a + b, 0) / returns.length);
      }

      // Volatility (Standard Deviation of Returns)
      let volatility = null;
      if (closes.length > 1) {
        const returns = closes.slice(1).map((c: number, i: number) => (c - closes[i]) / closes[i]);
        const mean = returns.reduce((a: number, b: number) => a + b, 0) / returns.length;
        const variance = returns.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / returns.length;
        volatility = 100 * Math.sqrt(variance);
      }

      // Adjust thresholds based on timeframe
      const rsiThresholds = horizon === 'longterm' ? { bullish: 55, bearish: 45 } : horizon === 'positional' ? { bullish: 60, bearish: 40 } : { bullish: 65, bearish: 35 };
      const macdThreshold = horizon === 'longterm' ? 0.5 : horizon === 'positional' ? 0.2 : 0.1;
      const volatilityBearish = horizon === 'longterm' ? 2.5 : horizon === 'positional' ? 3 : 3.5;
      const avgReturnBullish = horizon === 'longterm' ? 0.05 : horizon === 'positional' ? 0.1 : 0.15;
      const avgReturnBearish = horizon === 'longterm' ? -0.05 : horizon === 'positional' ? -0.1 : -0.15;

      // Build indicators using API values and refined logic
      const newIndicators: any[] = [
        {
          name: 'RSI (14)',
          value: rsi ?? 'N/A',
          signal: rsi !== null && rsi !== undefined ? (rsi > rsiThresholds.bullish ? 'bullish' : rsi < rsiThresholds.bearish ? 'bearish' : 'neutral') : 'neutral',
          description: rsi !== null && rsi !== undefined ? `RSI is ${rsi.toFixed(2)}. ${rsi > rsiThresholds.bullish ? 'Bullish momentum.' : rsi < rsiThresholds.bearish ? 'Bearish momentum.' : 'Neutral momentum.'}` : 'RSI not available.',
          education: 'RSI measures the speed and change of price movements. Thresholds are adjusted for the selected timeframe.',
          actionableAdvice: rsi !== null && rsi !== undefined
            ? (rsi > rsiThresholds.bullish
                ? 'Bullish. Consider entering or adding on pullbacks.'
                : rsi < rsiThresholds.bearish
                ? 'Bearish. Consider reducing exposure or waiting.'
                : 'Neutral. Wait for clearer signals.')
            : 'No actionable advice.'
        },
        {
          name: 'MACD',
          value: macd ?? 'N/A',
          signal: macd !== null && macd !== undefined ? (macd > macdThreshold ? 'bullish' : macd < -macdThreshold ? 'bearish' : 'neutral') : 'neutral',
          description: macd !== null && macd !== undefined ? `MACD is ${macd.toFixed(2)}. ${macd > macdThreshold ? 'Bullish momentum.' : macd < -macdThreshold ? 'Bearish momentum.' : 'Neutral.'}` : 'MACD not available.',
          education: 'MACD is a trend-following momentum indicator. Thresholds are adjusted for the selected timeframe.',
          actionableAdvice: macd !== null && macd !== undefined
            ? (macd > macdThreshold
                ? 'Bullish momentum. Consider entering or holding.'
                : macd < -macdThreshold
                ? 'Bearish momentum. Consider reducing exposure.'
                : 'Neutral. Wait for momentum shift.')
            : 'No actionable advice.'
        },
        {
          name: 'Bollinger Bands',
          value: bb ? `${bb.upper?.toFixed(2) ?? 'N/A'} / ${bb.middle?.toFixed(2) ?? 'N/A'} / ${bb.lower?.toFixed(2) ?? 'N/A'}` : '',
          signal: bb && closes.length > 0 ? (closes[closes.length - 1] > (bb.upper ?? 0) ? 'bearish' : closes[closes.length - 1] < (bb.lower ?? 0) ? 'bullish' : 'neutral') : 'neutral',
          description: bb ? `Price is ${closes[closes.length - 1] > (bb.upper ?? 0) ? 'above upper band (overbought)' : closes[closes.length - 1] < (bb.lower ?? 0) ? 'below lower band (oversold)' : 'within bands (neutral)'}.` : 'Bollinger Bands not available.',
          education: 'Bollinger Bands consist of a moving average and two standard deviations. Price above upper band is overbought, below lower is oversold.',
          actionableAdvice: bb && closes.length > 0
            ? (closes[closes.length - 1] > (bb.upper ?? 0)
                ? 'Overbought. Consider waiting for a pullback.'
                : closes[closes.length - 1] < (bb.lower ?? 0)
                ? 'Oversold. Watch for reversal or confirmation.'
                : 'Price within bands. Wait for breakout or breakdown.')
            : 'No actionable advice.'
        },
        {
          name: 'Average Daily Return',
          value: avgReturn !== null ? avgReturn.toFixed(2) + '%' : 'N/A',
          signal: avgReturn !== null ? (avgReturn > avgReturnBullish ? 'bullish' : avgReturn < avgReturnBearish ? 'bearish' : 'neutral') : 'neutral',
          description: avgReturn !== null ? `Average daily return is ${avgReturn.toFixed(2)}%.` : 'Not enough data.',
          education: 'Average daily return shows the mean percentage change per day over the selected period.',
          actionableAdvice: avgReturn !== null
            ? (avgReturn > avgReturnBullish
                ? 'Strong positive returns. Consider entering or holding.'
                : avgReturn < avgReturnBearish
                ? 'Strong negative returns. Consider reducing exposure.'
                : 'Neutral returns. Wait for trend to develop.')
            : 'No actionable advice.'
        },
        {
          name: 'Volatility',
          value: volatility !== null ? volatility.toFixed(2) + '%' : 'N/A',
          signal: volatility !== null ? (volatility > volatilityBearish ? 'bearish' : volatility < 1 ? 'bullish' : 'neutral') : 'neutral',
          description: volatility !== null ? `Volatility (std dev of daily returns) is ${volatility.toFixed(2)}%.` : 'Not enough data.',
          education: 'Volatility measures the standard deviation of daily returns. Higher volatility means more risk.',
          actionableAdvice: volatility !== null
            ? (volatility > volatilityBearish
                ? 'High volatility. Consider reducing position size or waiting for stabilization.'
                : volatility < 1
                ? 'Low volatility. Consider waiting for a breakout.'
                : 'Moderate volatility. Adjust position size accordingly.')
            : 'No actionable advice.'
        }
      ];
      setIndicators(newIndicators);
    } catch (e) {
      setIndicators([]);
    } finally {
      setIndicatorsLoading(false);
    }
  }, [tradePlan, horizon]);

  // Helper to call the backend API for trade plan generation and usage tracking
  const fetchTradePlan = useCallback(async (symbol: string, horizon: string) => {
    setLoading(true);
    setError(null);
    setQuotaExceeded(false);
    try {
      const res = await fetch('/api/trade-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, horizon })
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.quotaExceeded) {
          setQuotaExceeded(true);
          setUsageInfo({ request_count: data.request_count, total_requests: data.total_requests, date: data.date });
          setError(data.error || 'You have used up your daily quota. Please come back tomorrow.');
        } else {
          setError(data.error || 'Failed to generate trade plan.');
        }
        setTradePlan(null);
        return null;
      }
      setTradePlan(data.tradePlan);
      setUsageInfo({ request_count: data.request_count, total_requests: data.total_requests, date: data.date });
      return data.tradePlan;
    } catch (err) {
      setError('Failed to generate trade plan. Please try again later.');
      setTradePlan(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to get cache key for localStorage
  const getCacheKey = (symbol: string, horizon: string) => `tradePlan_${symbol}_${horizon}`;

  // On mount and when symbol/horizon changes, try to load from cache, else fetch and cache
  useEffect(() => {
    if (!session) return;
    const cacheKey = getCacheKey(symbol, horizon);
    const cached = typeof window !== 'undefined' ? localStorage.getItem(cacheKey) : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Only use cache if not stale (1 hour)
        if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < 60 * 60 * 1000) {
          setTradePlan(parsed.data);
          setLoading(false);
          return;
        }
      } catch {}
    }
    // If not cached or stale, fetch and cache
    fetchTradePlan(symbol, horizon).then((plan) => {
      if (plan) {
        localStorage.setItem(cacheKey, JSON.stringify({ data: plan, timestamp: Date.now() }));
      }
    });
  }, [session, symbol, horizon, fetchTradePlan]);

  if (quotaExceeded) {
    return (
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 flex flex-col min-h-[60vh] justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Daily Quota Reached</h1>
          <p className="mb-6 text-muted-foreground text-center max-w-md">
            You have used up your daily quota of trade plan generations. Please come back tomorrow.<br />
            Requests today: {usageInfo?.request_count ?? 0} / 5
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 flex flex-col min-h-[60vh] justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Generating Trade Plan...</h1>
          <p className="mb-6 text-muted-foreground text-center max-w-md">
            Your trade plan is being generated. This may take a few moments.
          </p>
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary mb-4"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 flex flex-col min-h-[60vh] justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Error Generating Trade Plan</h1>
          <p className="mb-6 text-muted-foreground text-center max-w-md">
            {error}
          </p>
          <Button onClick={() => fetchTradePlan(symbol, horizon)} className="w-full max-w-xs">
            Retry
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Place TradePlanHeader at the top for consistent UX, pass onTimeframeChange */}
        {tradePlan && (
          <TradePlanHeader
            tradePlan={{
              ...tradePlan,
              onTimeframeChange: (horizon: string) => handleHorizonChange(horizon),
              request_count: usageInfo?.request_count ?? 0,
              total_requests: usageInfo?.total_requests ?? 5
            }}
          />
        )}
        <div className="mt-8">
          <TradingRecommendation tradePlan={tradePlan} onTimeframeChange={handleHorizonChange} />
        </div>
        <div className="mt-8">
          <TechnicalAnalysis tradePlan={tradePlan} onHorizonChange={handleHorizonChange} />
        </div>
        <div className="mt-8">
          <Button
            onClick={() => {
              setCopied(true);
              navigator.clipboard.writeText(window.location.href);
            }}
            className="w-full max-w-xs"
          >
            {copied ? 'Link Copied!' : 'Share This Trade Plan'}
            <Share2 className="w-5 h-5 ml-2" />
          </Button>
        </div>
        <div className="mt-8">
          <AdSenseAd />
        </div>
        <div className="mt-8">
          <p className="text-xs text-muted-foreground text-center">
            This analysis is for educational purposes only. Always conduct your own research before making investment decisions.
          </p>
        </div>
      </div>
    </main>
  );
}