'use client';

import { useState } from 'react';
import { ScreenerFilters } from '@/components/screener/ScreenerFilters';
import { ScreenerResults } from '@/components/screener/ScreenerResults';
import { Card, CardContent } from '@/components/ui/card';
import { ScreenerStock, ScreenerFilters as FilterType } from '@/lib/types';
import { getMockScreenerStocks } from '@/lib/mock-data';
import { AdSenseAd } from '@/components/ui/AdSenseAd';

export default function ScreenerPage() {
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
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Find Stocks with Multi-Bagger DNA
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover high-potential stocks that share traits with historical multi-baggers
          </p>
        </div>
        <AdSenseAd />
        <Card className="mb-8">
          <CardContent className="pt-6">
            <ScreenerFilters onFilter={handleFilter} />
          </CardContent>
        </Card>

        <ScreenerResults stocks={stocks} loading={loading} />
      </div>
    </main>
  );
}