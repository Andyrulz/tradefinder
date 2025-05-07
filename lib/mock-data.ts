import { TradePlan, TechnicalIndicator, IndicatorSignal, ScreenerStock, ScreenerFilters } from './types';
import { TimeHorizon } from '@/lib/types';

// Helper function to generate technical indicators
const generateIndicators = (bias: 'bullish' | 'bearish' | 'neutral'): TechnicalIndicator[] => {
  const indicators: TechnicalIndicator[] = [
    {
      name: 'RSI (14)',
      value: bias === 'bullish' ? 61.5 : bias === 'bearish' ? 28.3 : 45.8,
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      threshold: {
        bullish: 60,
        bearish: 30,
      },
      description: bias === 'bullish' 
        ? 'The Relative Strength Index shows bullish momentum with a reading above 60.'
        : bias === 'bearish'
        ? 'The Relative Strength Index indicates oversold conditions with a reading below 30.'
        : 'The Relative Strength Index shows neutral momentum with a reading near the middle range.',
      education: 'RSI measures the speed and change of price movements on a scale of 0-100. Values below 30 generally indicate oversold conditions, while values above 70 suggest overbought conditions.'
    },
    {
      name: 'MACD',
      value: bias === 'bullish' ? 'Positive crossover' : bias === 'bearish' ? 'Negative crossover' : 'Flat signal',
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      description: bias === 'bullish'
        ? 'MACD line crossing above the signal line, indicating bullish momentum.'
        : bias === 'bearish'
        ? 'MACD line crossing below the signal line, indicating bearish momentum.'
        : 'MACD line moving parallel to the signal line, indicating neutral momentum.',
      education: 'The Moving Average Convergence Divergence (MACD) is a trend-following momentum indicator that shows the relationship between two moving averages of a security\'s price. A positive crossover (MACD crossing above signal line) is considered bullish, while a negative crossover is bearish.'
    },
    {
      name: 'EMA (50/200)',
      value: bias === 'bullish' ? 'Golden Cross' : bias === 'bearish' ? 'Death Cross' : 'Flat',
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      description: bias === 'bullish'
        ? '50-day EMA crossing above the 200-day EMA (Golden Cross), indicating a potential uptrend.'
        : bias === 'bearish'
        ? '50-day EMA crossing below the 200-day EMA (Death Cross), indicating a potential downtrend.'
        : '50-day EMA moving parallel to the 200-day EMA, indicating a sideways trend.',
      education: 'The Exponential Moving Average (EMA) gives more weight to recent prices. When the shorter-term EMA (50-day) crosses above the longer-term EMA (200-day), it\'s called a Golden Cross and signals a potential uptrend. The opposite (Death Cross) signals a potential downtrend.'
    },
    {
      name: 'Bollinger Bands',
      value: bias === 'bullish' ? 'Price near upper band' : bias === 'bearish' ? 'Price near lower band' : 'Price near middle band',
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      description: bias === 'bullish'
        ? 'Price trading near the upper Bollinger Band with expanding bands, indicating strong upward momentum.'
        : bias === 'bearish'
        ? 'Price trading near the lower Bollinger Band with expanding bands, indicating strong downward momentum.'
        : 'Price trading near the middle Bollinger Band, indicating a period of consolidation.',
      education: 'Bollinger Bands consist of a middle band (usually a 20-period moving average) and two outer bands placed 2 standard deviations away. When price approaches the upper band with expanding bands, it often indicates strong bullish momentum. Conversely, price near the lower band with expanding bands suggests bearish momentum.'
    },
    {
      name: 'Volume',
      value: bias === 'bullish' ? 'Above average' : bias === 'bearish' ? 'Above average' : 'Average',
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      description: bias === 'bullish'
        ? 'Above average volume on up days, confirming bullish price action.'
        : bias === 'bearish'
        ? 'Above average volume on down days, confirming bearish price action.'
        : 'Average volume with no clear trend, indicating lack of conviction.',
      education: 'Volume confirms price movements. Higher than average volume during price increases suggests strong buying interest, while high volume during price decreases indicates strong selling pressure. Low volume during price movements may indicate lack of conviction in the trend.'
    },
    {
      name: 'Stochastic (14,3,3)',
      value: bias === 'bullish' ? 78.5 : bias === 'bearish' ? 21.3 : 48.2,
      signal: bias === 'bullish' ? 'bullish' : bias === 'bearish' ? 'bearish' : 'neutral',
      threshold: {
        bullish: 80,
        bearish: 20,
      },
      description: bias === 'bullish'
        ? 'Stochastic approaching overbought levels with strong momentum.'
        : bias === 'bearish'
        ? 'Stochastic approaching oversold levels with strong downward momentum.'
        : 'Stochastic in the middle range with no clear direction.',
      education: 'The Stochastic Oscillator compares a security\'s closing price to its price range over a given time period. Readings above 80 indicate overbought conditions, while readings below 20 indicate oversold conditions. However, during strong trends, the indicator can remain in overbought/oversold territory for extended periods.'
    }
  ];
  
  return indicators;
};

// Mock data for screener stocks
const mockTraits = [
  { id: 'uptrend', name: 'Uptrend', description: 'Price > 50-day & 200-day EMA' },
  { id: 'from_low', name: '>50% from 52W low', description: '(Price - 52W Low)/Low > 50%' },
  { id: 'near_high', name: 'Near highs', description: 'Within 20% of 52W high' },
  { id: 'breakout', name: 'Just broke out', description: 'Consolidation breakout' },
  { id: 'volume', name: 'Volume spike', description: "Today's volume > 1.5x 20-day avg" },
  { id: 'earnings', name: 'Earnings growth', description: 'YoY PAT growth > 20%' },
  { id: 'recent_ipo', name: 'Recent listing', description: 'IPO date within 6 years' },
  { id: 'sector', name: 'Sector catalyst', description: 'Sector tagged as trending' },
  { id: 'mcap', name: 'Mid-size m-cap', description: '₹1,000–10,000 cr' },
  { id: 'pe', name: 'PE < 30', description: 'Current PE ratio < 30' }
];

const mockStocks = [
  {
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Limited',
    sector: 'Automobile',
    basePrice: 780,
    marketCap: 258000
  },
  {
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Limited',
    sector: 'Banking',
    basePrice: 1680,
    marketCap: 845000
  },
];

export function getMockScreenerStocks(filters: ScreenerFilters): ScreenerStock[] {
  return mockStocks.map(stock => {
    const matchedTraits = mockTraits.map(trait => ({
      ...trait,
      matched: Math.random() > 0.4
    }));

    const score = matchedTraits.filter(t => t.matched).length;

    if (score < filters.minTraits) return null;

    if (filters.sector && stock.sector.toLowerCase() !== filters.sector.toLowerCase()) return null;

    return {
      symbol: stock.symbol,
      companyName: stock.companyName,
      currentPrice: stock.basePrice,
      sector: stock.sector,
      marketCap: stock.marketCap,
      score,
      traits: matchedTraits,
      lastUpdated: new Date().toISOString()
    };
  }).filter(Boolean) as ScreenerStock[];
}

// Generate mock trade plan data
export const getMockTradePlan = (symbol: string, timeHorizon: string): TradePlan => {
  // Special case for MSFT
  if (symbol.toUpperCase() === 'MSFT') {
    return {
      symbol: 'MSFT',
      companyName: 'Microsoft Corporation',
      currentPrice: 415.32,
      timeHorizon: timeHorizon as TimeHorizon,
      direction: 'bullish',
      confidenceLevel: 'high',
      setupType: 'trend_continuation',
      riskManagement: {
        probabilityScore: 85,
        riskRewardRatio: 2.5,
        suggestedPositionSize: 100,
        entryZone: { low: 410.00, high: 420.00 },
        initialStopLoss: { price: 395.00, type: 'fixed' },
        targets: [
          { price: 430.00, probability: 70, riskRewardRatio: 2.0 },
          { price: 450.00, probability: 50, riskRewardRatio: 2.5 },
          { price: 480.00, probability: 30, riskRewardRatio: 3.0 }
        ],
        trailingStops: [
          { price: 420.00, trigger: 415.00 }
        ],
        volumeConfirmation: true,
        patternReliability: 90
      },
      summary: 'MSFT shows strong bullish momentum with multiple technical indicators in agreement. The stock is trading above its 200-day moving average with increasing volume, indicating strong institutional support.',
      avoidanceReason: undefined,
      priceHistory: [
        {
          date: new Date().toISOString(),
          open: 410.00,
          high: 415.32,
          low: 409.50,
          close: 415.32,
          volume: 1000000
        }
      ],
      indicators: generateIndicators('bullish'),
      metrics: {
        trend: 'uptrend',
        above200SMA: true,
        percentFrom52WeekLow: 25,
        percentFrom52WeekHigh: -5,
        recentTrendChange: false,
        volumeSpike: true,
        averageVolume: 800000,
        currentVolume: 1000000,
        breakoutStrength: 85,
        volumeConfirmation: true,
        hasRecentEarnings: true,
        listingAge: 30,
        marketCap: 2000000000000,
        peRatio: 35,
        industry: 'Technology',
        isInfantIndustry: false,
        hasCatalyst: true,
        volumeStatus: 'above_average',
        volumeConfirming: true
      },
      keyLevels: [
        { price: 410.00, type: 'support', description: 'Recent support level' },
        { price: 420.00, type: 'resistance', description: 'Recent resistance level' }
      ],
      atr: 2.5,
      chartData: {
        annotations: {
          entry: [
            { price: 410.00, type: 'entry', description: 'Entry zone' }
          ],
          stop: [
            { price: 395.00, type: 'stop', description: 'Initial stop loss' }
          ],
          targets: [
            { price: 430.00, type: 'target', description: 'First target' },
            { price: 450.00, type: 'target', description: 'Second target' },
            { price: 480.00, type: 'target', description: 'Third target' }
          ],
          trailingStops: [
            { price: 420.00, type: 'trailing_stop', description: 'Trailing stop' }
          ]
        },
        indicators: [
          {
            name: 'RSI',
            values: [61.5],
            parameters: { period: 14 }
          },
          {
            name: 'MACD',
            values: [0.5, 0.3, 0.2],
            parameters: { fast: 12, slow: 26, signal: 9 }
          }
        ]
      }
    };
  }

  // Default mock data generation for other symbols
  const bias: IndicatorSignal = 
    symbol.charAt(0).toLowerCase() < 'h' ? 'bullish' : 
    symbol.charAt(0).toLowerCase() < 'q' ? 'bearish' : 'neutral';

  const basePrice = (symbol.length * 17) + (symbol.charCodeAt(0) % 100);
  const currentPrice = parseFloat(basePrice.toFixed(2));
  const entryLow = parseFloat((basePrice * 0.98).toFixed(2));
  const entryHigh = parseFloat((basePrice * 1.01).toFixed(2));
  const stopLoss = parseFloat((basePrice * 0.95).toFixed(2));
  const target1 = parseFloat((basePrice * 1.05).toFixed(2));
  const target2 = parseFloat((basePrice * 1.08).toFixed(2));
  const target3 = parseFloat((basePrice * 1.12).toFixed(2));
  const risk = Math.abs(entryHigh - stopLoss);
  const reward = Math.abs(target2 - entryHigh);
  const riskRewardRatio = parseFloat((reward / risk).toFixed(2));

  const confidenceLevel: 'high' | 'medium' | 'low' = bias === 'bullish' ? 'high' : bias === 'bearish' ? 'medium' : 'low';

  return {
    symbol: symbol.toUpperCase(),
    companyName: `${symbol.toUpperCase()} Corporation`,
    currentPrice,
    timeHorizon: timeHorizon as TimeHorizon,
    direction: bias,
    confidenceLevel,
    setupType: 'trend_continuation',
    riskManagement: {
      probabilityScore: bias === 'bullish' ? 80 : bias === 'bearish' ? 60 : 50,
      riskRewardRatio,
      suggestedPositionSize: 50,
      entryZone: { low: entryLow, high: entryHigh },
      initialStopLoss: { price: stopLoss, type: 'fixed' },
      targets: [
        { price: target1, probability: 70, riskRewardRatio: 1.5 },
        { price: target2, probability: 50, riskRewardRatio: 2.0 },
        { price: target3, probability: 30, riskRewardRatio: 2.5 }
      ],
      trailingStops: [
        { price: entryHigh, trigger: entryLow }
      ],
      volumeConfirmation: bias === 'bullish',
      patternReliability: bias === 'bullish' ? 80 : 60
    },
    summary: bias === 'bullish'
      ? `${symbol.toUpperCase()} shows strong bullish momentum with a favorable risk-reward ratio of ${riskRewardRatio}:1. Technical indicators support a potential upward movement.`
      : bias === 'bearish'
      ? `${symbol.toUpperCase()} displays bearish signals with multiple technical indicators in agreement. A potential downward movement with a risk-reward ratio of ${riskRewardRatio}:1.`
      : `${symbol.toUpperCase()} shows mixed signals with no clear directional bias. Consider watching for a breakout or breakdown before entering a trade.`,
    avoidanceReason: (bias === 'neutral' && (confidenceLevel === 'low' || riskRewardRatio < 1.5))
      ? 'Consider avoiding this trade due to unclear directional bias and lower risk-reward ratio.'
      : undefined,
    priceHistory: [
      {
        date: new Date().toISOString(),
        open: entryLow,
        high: currentPrice,
        low: stopLoss,
        close: currentPrice,
        volume: 1000000
      }
    ],
    indicators: generateIndicators(bias),
    metrics: {
      trend: bias === 'bullish' ? 'uptrend' : bias === 'bearish' ? 'downtrend' : 'sideways',
      above200SMA: bias === 'bullish',
      percentFrom52WeekLow: bias === 'bullish' ? 25 : bias === 'bearish' ? -15 : 5,
      percentFrom52WeekHigh: bias === 'bullish' ? -5 : bias === 'bearish' ? -30 : -15,
      recentTrendChange: false,
      volumeSpike: bias === 'bullish',
      averageVolume: 800000,
      currentVolume: 1000000,
      breakoutStrength: bias === 'bullish' ? 85 : bias === 'bearish' ? 60 : 50,
      volumeConfirmation: bias === 'bullish',
      hasRecentEarnings: true,
      listingAge: 30,
      marketCap: 1000000000,
      peRatio: 25,
      industry: 'Technology',
      isInfantIndustry: false,
      hasCatalyst: bias === 'bullish',
      volumeStatus: bias === 'bullish' ? 'above_average' : 'normal',
      volumeConfirming: bias === 'bullish'
    },
    keyLevels: [
      { price: entryLow, type: 'support', description: 'Recent support level' },
      { price: entryHigh, type: 'resistance', description: 'Recent resistance level' }
    ],
    atr: 2.5,
    chartData: {
      annotations: {
        entry: [
          { price: entryLow, type: 'entry', description: 'Entry zone' }
        ],
        stop: [
          { price: stopLoss, type: 'stop', description: 'Initial stop loss' }
        ],
        targets: [
          { price: target1, type: 'target', description: 'First target' },
          { price: target2, type: 'target', description: 'Second target' },
          { price: target3, type: 'target', description: 'Third target' }
        ],
        trailingStops: [
          { price: entryHigh, type: 'trailing_stop', description: 'Trailing stop' }
        ]
      },
      indicators: [
        {
          name: 'RSI',
          values: [bias === 'bullish' ? 61.5 : bias === 'bearish' ? 28.3 : 45.8],
          parameters: { period: 14 }
        },
        {
          name: 'MACD',
          values: [0.5, 0.3, 0.2],
          parameters: { fast: 12, slow: 26, signal: 9 }
        }
      ]
    }
  };
};