'use client';

import { StockAnalysis } from '@/components/stock-analysis/StockAnalysis';
import { mockStockAnalysis } from '@/lib/mock-stock-analysis';
import BuyMeCoffeeButton from '@/components/ui/BuyMeCoffeeButton';
import BuyMeCoffeeMessage from '@/components/ui/BuyMeCoffeeMessage';
import { AdSenseAd } from '@/components/ui/AdSenseAd';

export default function StockAnalysisPage() {
  return (
    <div className="container mx-auto py-8">
      {/* Wide, left-aligned support message and right-aligned button */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <BuyMeCoffeeMessage />
        <div className="md:self-start">
          <BuyMeCoffeeButton />
        </div>
      </div>
      <AdSenseAd />
      <StockAnalysis analysis={mockStockAnalysis} />
    </div>
  );
}