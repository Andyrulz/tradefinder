import type { StockAnalysis } from './stock-analysis';

export const mockStockAnalysis: StockAnalysis = {
  symbol: 'RELIANCE',
  name: 'Reliance Industries Ltd',
  lastUpdated: 'May 2, 2025',
  scorecard: {
    performance: {
      score: 'low',
      description: 'Hasn\'t fared well - amongst the low performers'
    },
    valuation: {
      score: 'high',
      description: 'Seems to be overvalued vs the market average'
    },
    growth: {
      score: 'low',
      description: 'Lagging behind the market in financials growth'
    },
    profitability: {
      score: 'high',
      description: 'Showing good signs of profitability & efficiency'
    },
    entryPoint: {
      score: 'medium',
      description: 'The stock is underpriced but is in the overbought zone'
    },
    redFlags: {
      score: 'low',
      description: 'No red flag found'
    }
  },
  metrics: {
    currentPrice: 1422.40,
    priceChange: 17.40,
    priceChangePercent: 1.24,
    marketCap: 192485800000000,
    volatility: 1.56,
    volatilityDescription: 'Low Risk - Stock is 1.56x as volatile as Nifty',
    peRatio: 27.64,
    pbRatio: 2.08,
    dividendYield: 0.39,
    sectorPE: 16.14,
    sectorPB: 1.65,
    sectorDividendYield: 1.40,
    returns: {
      oneDay: 1.24,
      oneWeek: 7.67,
      oneMonth: 12.44,
      threeMonths: 12.48,
      sixMonths: 9.23,
      oneYear: -3.01,
      threeYears: 12.70,
      fiveYears: 118.33
    },
    fiftyTwoWeekHigh: 1608.80,
    fiftyTwoWeekLow: 1114.85,
    analystRecommendations: {
      buy: 33,
      hold: 1,
      sell: 0,
      total: 34,
      buyPercentage: 97.06
    },
    companyProfile: {
      description: 'Reliance Industries Limited is engaged in refining, manufacturing of refined petroleum products, petrochemicals, including manufacturing of basic chemicals, fertilizers and nitrogen compounds, plastic and synthetic rubber in primary forms.',
      sector: 'Energy',
      industry: 'Oil & Gas - Refining & Marketing',
      marketCap: 192485800000000,
      riskLevel: 'low'
    }
  },
  peers: [
    {
      symbol: 'IOC',
      name: 'Indian Oil Corporation Ltd',
      peRatio: 14.88,
      oneYearReturn: 17.37,
      buyRecommendationPercentage: 65.52
    },
    {
      symbol: 'BPCL',
      name: 'Bharat Petroleum Corporation Ltd',
      peRatio: 10.12,
      oneYearReturn: 1.95,
      buyRecommendationPercentage: 67.74
    },
    {
      symbol: 'HINDPETRO',
      name: 'Hindustan Petroleum Corp Ltd',
      peRatio: 5.12,
      oneYearReturn: 8.26,
      buyRecommendationPercentage: 70.37
    },
    {
      symbol: 'MRPL',
      name: 'Mangalore Refinery and Petrochemicals Ltd',
      peRatio: 417.81,
      oneYearReturn: 47.25,
      buyRecommendationPercentage: 0.00
    },
    {
      symbol: 'CHENNPETRO',
      name: 'Chennai Petroleum Corporation Ltd',
      peRatio: 42.96,
      oneYearReturn: 39.11,
      buyRecommendationPercentage: 100.00
    }
  ]
}; 