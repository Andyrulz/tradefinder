import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function DiscoverScreener() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/screener');
    }, 3000); // Show spinner for 3 seconds
  };

  return (
    <div className="my-8 max-w-md mx-auto">
      <div className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center border border-sky-100">
        <div className="flex items-center justify-center mb-4 bg-sky-100 rounded-full w-12 h-12">
          <Search className="h-7 w-7 text-sky-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Discover Today&apos;s Top Momentum Stocks</h2>
        <p className="text-gray-700 text-base mb-6 text-center">
          Uncover the best setups, breakouts, and bases—refreshed daily. Click below to see the top 10 actionable trades for today.
        </p>
        <Button
          onClick={handleClick}
          disabled={loading}
          className="relative w-full max-w-xs min-h-[48px] text-base font-semibold bg-sky-600 hover:bg-sky-700 transition-colors shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2 w-full">
              <span className="inline-block align-middle">
                <span className="block h-5 w-5 border-2 border-white border-t-sky-400 border-b-sky-400 rounded-full animate-spin"></span>
              </span>
              <span>Loading Screener…</span>
            </span>
          ) : (
            'Show Me Today’s Top 10 Stocks'
          )}
        </Button>
      </div>
    </div>
  );
}
