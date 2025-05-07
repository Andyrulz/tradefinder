import type { StockAnalysis as StockAnalysisType } from '@/lib/stock-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Info, TrendingUp, TrendingDown, AlertTriangle, DollarSign, LineChart, Target, Flag } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StockAnalysisProps {
  analysis: StockAnalysisType;
}

export function StockAnalysis({ analysis }: StockAnalysisProps) {
  const getScoreColor = (score: string) => {
    switch (score) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'low':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getScoreIcon = (key: string) => {
    switch (key) {
      case 'performance':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'valuation':
        return <DollarSign className="h-5 w-5 text-primary" />;
      case 'growth':
        return <LineChart className="h-5 w-5 text-primary" />;
      case 'profitability':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'entryPoint':
        return <Target className="h-5 w-5 text-primary" />;
      case 'redFlags':
        return <AlertTriangle className="h-5 w-5 text-primary" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `₹${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)}Cr`;
    }
    return `₹${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                {analysis.name} ({analysis.symbol})
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {analysis.lastUpdated}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg">
                {formatNumber(analysis.metrics.currentPrice)}
              </Badge>
              <Badge className={analysis.metrics.priceChange >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}>
                {analysis.metrics.priceChange >= 0 ? '+' : ''}{analysis.metrics.priceChangePercent.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Scorecard */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Stock Scorecard</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comprehensive analysis of key performance indicators</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(analysis.scorecard).map(([key, value]) => (
              <div key={key} className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  {getScoreIcon(key)}
                  <h3 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getScoreColor(value.score)}>
                    {value.score.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Valuation Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold">Valuation</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">P/E Ratio</span>
                  <span className="font-medium">{analysis.metrics.peRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">P/B Ratio</span>
                  <span className="font-medium">{analysis.metrics.pbRatio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dividend Yield</span>
                  <span className="font-medium">{analysis.metrics.dividendYield.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="space-y-4">
              <h3 className="font-semibold">Performance</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">1 Week</span>
                  <span className="font-medium">{analysis.metrics.returns.oneWeek.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">1 Month</span>
                  <span className="font-medium">{analysis.metrics.returns.oneMonth.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">1 Year</span>
                  <span className="font-medium">{analysis.metrics.returns.oneYear.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Market Data */}
            <div className="space-y-4">
              <h3 className="font-semibold">Market Data</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-medium">{formatNumber(analysis.metrics.marketCap)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">52W High</span>
                  <span className="font-medium">{formatNumber(analysis.metrics.fiftyTwoWeekHigh)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">52W Low</span>
                  <span className="font-medium">{formatNumber(analysis.metrics.fiftyTwoWeekLow)}</span>
                </div>
              </div>
            </div>

            {/* Analyst Ratings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Analyst Ratings</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Buy</span>
                  <span className="font-medium">{analysis.metrics.analystRecommendations.buyPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={analysis.metrics.analystRecommendations.buyPercentage} 
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total Analysts</span>
                  <span>{analysis.metrics.analystRecommendations.total}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peer Comparison */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Peer Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.peers.map((peer, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div>
                  <h4 className="font-medium">{peer.name}</h4>
                  <p className="text-sm text-muted-foreground">{peer.symbol}</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">P/E: </span>
                  <span className="font-medium">{peer.peRatio.toFixed(2)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">1Y Return: </span>
                  <span className="font-medium">{peer.oneYearReturn.toFixed(2)}%</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Buy: </span>
                  <span className="font-medium">{peer.buyRecommendationPercentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Profile */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">{analysis.metrics.companyProfile.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sector</p>
                <p className="font-medium">{analysis.metrics.companyProfile.sector}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{analysis.metrics.companyProfile.industry}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge className={getScoreColor(analysis.metrics.companyProfile.riskLevel)}>
                  {analysis.metrics.companyProfile.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Volatility</p>
                <p className="font-medium">{analysis.metrics.volatilityDescription}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 