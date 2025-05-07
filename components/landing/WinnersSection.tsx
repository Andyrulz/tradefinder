'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScreenerFilters } from '@/components/screener/ScreenerFilters';
import { ScreenerResults } from '@/components/screener/ScreenerResults';
import { ScreenerFilters as FilterType, ScreenerStock } from '@/lib/types';
import { getMockScreenerStocks } from '@/lib/mock-data';

export function WinnersSection() {
  const [stocks, setStocks] = useState<ScreenerStock[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async (filters: FilterType) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const results = getMockScreenerStocks(filters);
      setStocks(results);
      setLoading(false);
    }, 1000);
  };

  return (
    <section id="winners" className="py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Stock Discovery
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Find Your Next Trading Opportunity
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover high-potential stocks that share traits with historical multi-baggers. Our screener analyzes multiple factors to identify promising opportunities.
          </p>
        </div>

        <Card className="mb-8 border-2 border-primary/10 shadow-lg">
          <CardContent className="pt-6">
            <ScreenerFilters onFilter={handleFilter} />
          </CardContent>
        </Card>

        <ScreenerResults stocks={stocks} loading={loading} />
      </div>
    </section>
  );
}