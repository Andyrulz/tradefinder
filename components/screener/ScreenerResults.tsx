'use client';

import { useState } from 'react';
import { ScreenerStock } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart2, BookmarkPlus, ExternalLink, LayoutGrid, List, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ScreenerResultsProps {
  stocks: ScreenerStock[];
  loading: boolean;
}

export function ScreenerResults({ stocks, loading }: ScreenerResultsProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-muted/50">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-20" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <Card className="border border-muted/50">
        <CardContent className="p-12 text-center">
          <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Matching Stocks Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more results
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Found {stocks.length} matching stocks
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
            className="transition-all duration-300"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
            className="transition-all duration-300"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {stocks.map((stock) => (
          <Card key={stock.symbol} className="group border border-muted/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">{stock.symbol}</h3>
                  <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-muted/30">{stock.sector}</Badge>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Trait Score</span>
                    <span className="text-sm font-medium">{stock.score}/10</span>
                  </div>
                  <Progress value={stock.score * 10} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {stock.traits.filter(t => t.matched).slice(0, 4).map((trait) => (
                    <Badge key={trait.id} variant="secondary" className="bg-primary/10 text-primary border-0">
                      {trait.name}
                    </Badge>
                  ))}
                  {stock.traits.filter(t => t.matched).length > 4 && (
                    <Badge variant="secondary" className="bg-muted/50">
                      +{stock.traits.filter(t => t.matched).length - 4} more
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <div className="text-sm">
                    <span className="font-medium">₹{stock.currentPrice}</span>
                    <span className="text-muted-foreground ml-2">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(stock.marketCap)} M-Cap
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Chart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}