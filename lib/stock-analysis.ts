export interface StockScorecard {
  performance: {
    score: 'low' | 'medium' | 'high';
    description: string;
  };
  valuation: {
    score: 'low' | 'medium' | 'high';
    description: string;
  };
  growth: {
    score: 'low' | 'medium' | 'high';
    description: string;
  };
  profitability: {
    score: 'low' | 'medium' | 'high';
    description: string;
  };
  entryPoint: {
    score: 'low' | 'medium' | 'high';
    description: string;
  };
  redFlags: {
    score: 'low' | 'medium' | 'high';
    description: string;
  };
}

export interface StockMetrics {
  // Market Data
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  volatility: number;
  volatilityDescription: string;
  
  // Valuation Metrics
  peRatio: number;
  pbRatio: number;
  dividendYield: number;
  
  // Sector Comparison
  sectorPE: number;
  sectorPB: number;
  sectorDividendYield: number;
  
  // Performance
  returns: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
    threeYears: number;
    fiveYears: number;
  };
  
  // Price Levels
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  
  // Analyst Ratings
  analystRecommendations: {
    buy: number;
    hold: number;
    sell: number;
    total: number;
    buyPercentage: number;
  };
  
  // Company Profile
  companyProfile: {
    description: string;
    sector: string;
    industry: string;
    marketCap: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export interface PeerComparison {
  symbol: string;
  name: string;
  peRatio: number;
  oneYearReturn: number;
  buyRecommendationPercentage: number;
}

export interface StockAnalysis {
  symbol: string;
  name: string;
  scorecard: StockScorecard;
  metrics: StockMetrics;
  peers: PeerComparison[];
  lastUpdated: string;
} 