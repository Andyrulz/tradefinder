// Technical indicator types
export type IndicatorSignal = 'bullish' | 'bearish' | 'neutral';
export type TimeHorizon = 'swing' | 'positional' | 'longterm';
export type TrendType = 'uptrend' | 'downtrend' | 'sideways';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type TradeSetupType = 'bullish_breakout' | 'support_bounce' | 'trend_continuation';

export interface TechnicalIndicator {
  name: string;
  value: number | string;
  signal: IndicatorSignal;
  description: string;
  education: string;
  threshold?: {
    bullish: number;
    bearish: number;
  };
}

export interface StockMetrics {
  trend: 'uptrend' | 'downtrend' | 'sideways';
  above200SMA: boolean;
  percentFrom52WeekLow: number;
  percentFrom52WeekHigh: number;
  recentTrendChange: boolean;
  volumeSpike: boolean;
  averageVolume: number;
  currentVolume: number;
  breakoutStrength: number;
  volumeConfirmation: boolean;
  hasRecentEarnings: boolean;
  listingAge: number;
  marketCap: number;
  peRatio: number;
  industry: string;
  isInfantIndustry: boolean;
  hasCatalyst: boolean;
  volumeStatus: string;
  volumeConfirming: boolean;
}

export interface PriceLevel {
  price: number;
  type: 'entry' | 'stop' | 'target' | 'support' | 'resistance' | 'trailing_stop';
  probability?: number; // For targets
  description?: string;
  atrMultiple?: number; // For ATR-based levels
  pivotType?: 'swing_high' | 'swing_low' | 'moving_average';
  riskRewardRatio?: number; // For targets
}

export interface RiskManagement {
  probabilityScore: number;
  riskRewardRatio: number;
  suggestedPositionSize: number;
  entryZone: {
    low: number;
    high: number;
  };
  initialStopLoss: {
    price: number;
    type: 'fixed' | 'trailing';
  };
  targets: Array<{
    price: number;
    probability: number;
    riskRewardRatio: number;
  }>;
  trailingStops: Array<{
    price: number;
    trigger: number;
  }>;
  volumeConfirmation: boolean;
  patternReliability: number;
}

export interface TradePlan {
  symbol: string;
  companyName: string;
  currentPrice: number;
  direction: 'bullish' | 'bearish' | 'neutral';
  timeHorizon: TimeHorizon;
  confidenceLevel: ConfidenceLevel;
  setupType: TradeSetupType;
  riskManagement: RiskManagement;
  summary: string;
  avoidanceReason?: string;
  priceHistory: PriceHistory[];
  externalIndicators?: {
    rsi?: number;
    macd?: number;
    macd_signal?: number;
    macd_hist?: number;
    bbands?: {
      upper?: number;
      middle?: number;
      lower?: number;
    };
  };
  indicators: TechnicalIndicator[];
  metrics: StockMetrics;
  keyLevels: PriceLevel[];
  atr: number;
  chartData: {
    annotations: {
      entry: Array<{
        price: number;
        type: string;
        description: string;
      }>;
      stop: PriceLevel[];
      targets: PriceLevel[];
      trailingStops: PriceLevel[];
    };
    indicators: Array<{
      name: string;
      values: number[];
      parameters: Record<string, number>;
    }>;
  };
}

// Past Winners Screener types
export interface StockTrait {
  id: string;
  name: string;
  description: string;
  matched: boolean;
}

export interface ScreenerStock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  sector: string;
  marketCap: number;
  score: number;
  traits: StockTrait[];
  lastUpdated: string;
  metrics: StockMetrics;
}

export interface ScreenerFilters {
  minTraits: number;
  sector?: string;
  timeHorizon: TimeHorizon;
  minMarketCap?: number;
  maxMarketCap?: number;
  maxPE?: number;
  minListingAge?: number;
  maxListingAge?: number;
  requireVolumeSpike?: boolean;
  requireRecentEarnings?: boolean;
  requireAbove200SMA?: boolean;
  minPercentFrom52WeekLow?: number;
  maxPercentFrom52WeekHigh?: number;
}

export interface PriceHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface InternalPriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}