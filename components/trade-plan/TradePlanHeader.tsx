import { TradePlan } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, TrendingUp, DollarSign, BarChart } from 'lucide-react';
import { formatNumber } from '@/lib/utils'; // Adjust the import based on your project structure

interface TradePlanHeaderProps {
  tradePlan: TradePlan & {
    request_count?: number;
    total_requests?: number;
  };
}

export function TradePlanHeader({ tradePlan }: TradePlanHeaderProps) {
  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold leading-tight">
            {tradePlan.companyName}{' '}
            <span className="text-base text-muted-foreground font-normal">
              ({tradePlan.symbol})
            </span>
          </h1>
          <div className="text-sm text-muted-foreground mt-1">
            Current Price:{' '}
            <span className="font-semibold">
              {formatNumber(tradePlan.currentPrice)}
            </span>
          </div>
          {/* Requests Used Counter */}
          {typeof tradePlan.request_count === 'number' && (
            <div className="text-xs text-primary mt-1">
              Requests Used Today: {tradePlan.request_count}
            </div>
          )}
        </div>
        {/* Timeframe Selector injected here for top-level control */}
        {typeof tradePlan.onTimeframeChange === 'function' && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Horizon:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={tradePlan.timeHorizon}
              onChange={e => tradePlan.onTimeframeChange(e.target.value)}
            >
              <option value="swing">Swing (1-5 days)</option>
              <option value="positional">Positional (2-4 weeks)</option>
              <option value="longterm">Long Term (1+ months)</option>
            </select>
          </div>
        )}
      </div>
      <Card className="border-0 shadow-none bg-muted/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Time Horizon
                </div>
                <div className="font-medium">
                  {tradePlan.timeHorizon === 'swing'
                    ? 'Swing Trade (1-5 days)'
                    : tradePlan.timeHorizon === 'positional'
                    ? 'Positional (2-4 weeks)'
                    : 'Long Term (1+ months)'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Setup Type</div>
                <div className="font-medium">{tradePlan.setupType}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Risk/Reward</div>
                <div className="font-medium">
                  {tradePlan.riskManagement.riskRewardRatio}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Entry Range</div>
                <div className="font-medium">
                  {formatNumber(tradePlan.riskManagement.entryZone?.low)} - {formatNumber(tradePlan.riskManagement.entryZone?.high)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}