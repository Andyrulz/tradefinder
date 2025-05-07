'use client';

import { useEffect, useState } from 'react';
import { TradePlan, TimeHorizon } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, DollarSign, LineChart, Target, AlertTriangle, Info, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { FinnhubService } from '@/lib/services/finnhub';
import { StockMetrics } from '@/lib/types';

interface TradingRecommendationProps {
  tradePlan: TradePlan;
  onTimeframeChange?: (timeframe: TimeHorizon) => void;
}

export function TradingRecommendation({ tradePlan, onTimeframeChange }: TradingRecommendationProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeHorizon>(tradePlan?.timeHorizon ?? 'swing');
  const [metrics, setMetrics] = useState<StockMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTimeframeChange = (value: TimeHorizon) => {
    setSelectedTimeframe(value);
    onTimeframeChange?.(value);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/stock-metrics?symbol=${tradePlan.symbol}&timeframe=${selectedTimeframe}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch stock data');
        }
        setMetrics(data.metrics);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
        console.error('Error fetching stock data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tradePlan.symbol, selectedTimeframe]);

  const getDirectionIcon = () => {
    switch (tradePlan.direction) {
      case 'bullish':
        return <ArrowUpRight className="h-5 w-5 text-green-500" />;
      case 'bearish':
        return <ArrowDownRight className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTimeframeDescription = () => {
    switch (tradePlan.timeHorizon) {
      case 'swing':
        return 'Short-term trade (3-10 days)';
      case 'positional':
        return 'Medium-term trade (2-6 weeks)';
      case 'longterm':
        return 'Long-term trade (2-6+ months)';
      default:
        return '';
    }
  };

  const getConfidenceColor = () => {
    switch (tradePlan.confidenceLevel) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNumber = (value: number | undefined, options: Intl.NumberFormatOptions = {}) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    // Always use USD for US stocks
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      ...options
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Verbal Summary */}
      <Card className="transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              Trade Analysis
            </CardTitle>
            <Badge variant="outline" className="text-sm animate-pulse">
              {getTimeframeDescription()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Market Outlook */}
            <div className="animate-slide-in">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Market Outlook
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg transition-colors duration-300 hover:bg-muted">
                {/* Show only general market/technical context, filter out entry/stop/target details */}
                <p className="text-sm">
                  {tradePlan.summary
                    .split(/(?<=[.!?])\s+/)
                    .filter(line =>
                      !/\b(entry|stop[- ]?loss|target|exit)\b/i.test(line)
                    )
                    .join(' ')
                  }
                </p>
              </div>
            </div>
            {/* Trade Recommendation */}
            <div className="animate-slide-in">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Trade Recommendation
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg transition-colors duration-300 hover:bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getConfidenceColor()}>
                    {tradePlan.confidenceLevel?.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tradePlan.setupType?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                {/* Only show a short actionable summary here, not the full tradePlan.summary */}
                <p className="text-sm">
                  {tradePlan.confidenceLevel === 'high' && 'Strong alignment of trend, volume, and indicators. Consider entering with proper risk management.'}
                  {tradePlan.confidenceLevel === 'medium' && 'Some signals align, but wait for confirmation or use smaller position size.'}
                  {tradePlan.confidenceLevel === 'low' && 'Signals are mixed or weak. Avoid new entries or use minimal size.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Management */}
      <Card className="mb-8 border-0 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Trade Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Trade Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2 p-3 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">Trade Setup</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {(tradePlan?.setupType ?? '').replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getConfidenceColor()}>
                    {(tradePlan?.confidenceLevel ?? '').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tradePlan.setupType === 'bullish_breakout' ? 'Look for volume confirmation on breakout' :
                   tradePlan.setupType === 'support_bounce' ? 'Enter on bounce from support' :
                   'Follow the trend with proper risk management'}
                </p>
              </div>

              <div className="space-y-2 p-3 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">Risk Management</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {typeof tradePlan?.riskManagement?.riskRewardRatio === 'number' ? tradePlan.riskManagement.riskRewardRatio.toFixed(1) : 'N/A'}x R:R
                  </Badge>
                  <Badge variant="outline">
                    {typeof tradePlan?.riskManagement?.suggestedPositionSize === 'number' ? tradePlan.riskManagement.suggestedPositionSize : 'N/A'}% Size
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {typeof tradePlan?.riskManagement?.riskRewardRatio === 'number' ? (
                    tradePlan.riskManagement.riskRewardRatio >= 2 ? 'Excellent risk/reward ratio' :
                    tradePlan.riskManagement.riskRewardRatio >= 1.5 ? 'Good risk/reward ratio' :
                    'Consider adjusting position size'
                  ) : 'Risk/reward data unavailable'}
                </p>
              </div>

              <div className="space-y-2 p-3 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">Probability</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {typeof tradePlan?.riskManagement?.probabilityScore === 'number' ? tradePlan.riskManagement.probabilityScore : 'N/A'}% Success
                  </Badge>
                  <Badge variant={tradePlan?.riskManagement?.volumeConfirmation ? "default" : "outline"}>
                    {tradePlan?.riskManagement?.volumeConfirmation ? "Volume Confirmed" : "Needs Volume"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {typeof tradePlan?.riskManagement?.probabilityScore === 'number' ? (
                    tradePlan.riskManagement.probabilityScore > 70 ? 'High probability setup' :
                    tradePlan.riskManagement.probabilityScore > 50 ? 'Moderate probability setup' :
                    'Low probability setup'
                  ) : 'Probability data unavailable'}
                </p>
              </div>

              <div className="space-y-2 p-3 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">Pattern Reliability</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {typeof tradePlan?.riskManagement?.patternReliability === 'number' ? tradePlan.riskManagement.patternReliability : 'N/A'}% Reliable
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {typeof tradePlan?.riskManagement?.patternReliability === 'number' ? (
                    tradePlan.riskManagement.patternReliability > 80 ? 'Very reliable pattern' :
                    tradePlan.riskManagement.patternReliability > 60 ? 'Reliable pattern' :
                    'Pattern needs confirmation'
                  ) : 'Pattern reliability data unavailable'}
                </p>
              </div>
            </div>

            {/* Trade Execution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entry and Stop Loss */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Entry Zone</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Optimal price range to enter the trade</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{formatNumber(tradePlan?.riskManagement?.entryZone?.low)}</span>
                    <span>{formatNumber(tradePlan?.riskManagement?.entryZone?.high)}</span>
                  </div>
                  <Progress 
                    value={
                      typeof tradePlan?.riskManagement?.entryZone?.low === 'number' &&
                      typeof tradePlan?.riskManagement?.entryZone?.high === 'number' &&
                      tradePlan.riskManagement.entryZone.high !== tradePlan.riskManagement.entryZone.low
                        ? ((tradePlan.currentPrice - tradePlan.riskManagement.entryZone.low) /
                           (tradePlan.riskManagement.entryZone.high - tradePlan.riskManagement.entryZone.low)) * 100
                        : 0
                    }
                    className="h-2 mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {typeof tradePlan?.riskManagement?.entryZone?.low === 'number' &&
                     typeof tradePlan?.riskManagement?.entryZone?.high === 'number' ? (
                      tradePlan.currentPrice < tradePlan.riskManagement.entryZone.low ? 'Wait for price to enter zone' :
                      tradePlan.currentPrice > tradePlan.riskManagement.entryZone.high ? 'Missed entry zone, wait for pullback' :
                      'Price in entry zone, consider entering'
                    ) : 'Entry zone data unavailable'}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Stop Loss</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Price level to exit if trade moves against you</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-sm font-medium text-red-500">
                    {formatNumber(tradePlan?.riskManagement?.initialStopLoss?.price)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tradePlan?.riskManagement?.initialStopLoss?.type === 'trailing' ?
                      'Trailing stop loss - moves with price' :
                      tradePlan?.riskManagement?.initialStopLoss?.type === 'fixed' ?
                      'Fixed stop loss - stays at entry level' :
                      'Stop loss type unavailable'}
                  </p>
                </div>
              </div>

              {/* Targets */}
              <div className="space-y-4">
                <h4 className="text-sm text-muted-foreground mb-2">Price Targets</h4>
                {Array.isArray(tradePlan?.riskManagement?.targets) && tradePlan.riskManagement.targets.length > 0 ? (
                  tradePlan.riskManagement.targets.map((target, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Target {index + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-500">
                            {formatNumber(target.price)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {typeof target.riskRewardRatio === 'number' ? target.riskRewardRatio : 'N/A'}x
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={typeof target.probability === 'number' ? target.probability : 0} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {typeof target.probability === 'number' ? (
                          target.probability > 70 ? 'High probability target' :
                          target.probability > 50 ? 'Moderate probability target' :
                          'Low probability target'
                        ) : 'Target probability unavailable'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No targets available</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avoidance Reason */}
      {tradePlan.avoidanceReason && (
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-red-800">Caution</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">{tradePlan.avoidanceReason}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}