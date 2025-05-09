'use client';

import { useEffect, useState } from 'react';
import { ScreenerFilters } from '@/components/screener/ScreenerFilters';
import { ScreenerResults } from '@/components/screener/ScreenerResults';
import { Card, CardContent } from '@/components/ui/card';
import { ScreenerStock, ScreenerFilters as FilterType } from '@/lib/types';
import { AdSenseAd } from '@/components/ui/AdSenseAd';
import Link from 'next/link';
import { getMockScreenerStocks } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { createClient } from '@supabase/supabase-js';

function ScreenerRow({ stock }: { stock: any }) {
  return (
    <div className="border rounded-xl p-6 mb-6 bg-white shadow-md flex flex-col md:flex-row md:items-center gap-4 hover:shadow-lg transition-shadow">
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-2xl md:text-3xl text-primary truncate w-24">{stock.symbol}</span>
          <span className="text-gray-700 text-lg font-medium truncate max-w-xs">{stock.company_name}</span>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-base">
          <span>Price: <span className="font-semibold">{stock.price ?? 'N/A'}</span></span>
          <span>Setup: <span className="font-semibold text-blue-700">{stock.setup.replace('_', ' ')}</span></span>
          <span>Confidence: <span className={`font-semibold ${stock.confidence === 'high' ? 'text-green-600' : stock.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>{stock.confidence?.toUpperCase()}</span></span>
        </div>
        <div className="mt-2 text-sm text-gray-800 whitespace-pre-line">
          {stock.summary}
        </div>
        <div className={`mt-1 text-sm font-semibold ${stock.confidence === 'high' ? 'text-green-700' : stock.confidence === 'medium' ? 'text-yellow-700' : 'text-red-700'}`}>{stock.trade_recommendation}</div>
        {stock.entry && stock.stopLoss && stock.targets && (
          <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-4">
            <span>Entry: <b>{stock.entry.low?.toFixed(2)} - {stock.entry.high?.toFixed(2)}</b></span>
            <span>SL: <b>{stock.stopLoss.price?.toFixed(2)}</b></span>
            <span>Target: <b>{stock.targets[0]?.price?.toFixed(2)}</b></span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end justify-between min-w-[140px] gap-2">
        <a
          href={stock.planurl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow transition-colors text-center"
        >
          View Detail Plan
        </a>
      </div>
    </div>
  );
}

export default function ScreenerPage() {
  const [stocks, setStocks] = useState<ScreenerStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planType, setPlanType] = useState<'free' | 'pro' | 'premium' | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const runScreener = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/momentum-screener/run', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          setStocks(data.top10);
        } else {
          setError(data.error || 'Failed to run screener.');
        }
      } catch (e) {
        setError('Failed to run screener.');
      } finally {
        setLoading(false);
      }
    };
    runScreener();
  }, []);

  useEffect(() => {
    // Fetch user plan from Supabase (client-side, since this is a client component)
    async function fetchPlan() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      if (!session?.user?.email) return;
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();
      if (!user) return;
      const { data: sub } = await supabase
        .from('user_subscriptions')
        .select('plan_type')
        .eq('user_id', user.id)
        .single();
      setPlanType(sub?.plan_type || 'free');
    }
    fetchPlan();
  }, []);

  // Only allow Premium users to run screener
  useEffect(() => {
    if (planType && planType !== 'premium') {
      setShowUpgrade(true);
    }
  }, [planType]);

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
            Top 10 Momentum Stocks Today
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the best actionable setups, bases, and breakouts—refreshed daily.
          </p>
        </div>
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="block h-10 w-10 border-4 border-sky-500 border-t-transparent border-b-transparent rounded-full animate-spin mb-4"></span>
            <div className="text-lg font-semibold text-sky-700">Running Daily Momentum Screener…</div>
          </div>
        )}
        {error && <div className="text-center text-red-500 py-8">{error}</div>}
        {/* Screener results only for Premium users */}
        {planType === 'premium' && (
          <div className="mt-8">
            {stocks.map((stock) => (
              <ScreenerRow key={stock.symbol} stock={stock} />
            ))}
          </div>
        )}
        {/* Upgrade modal for non-premium users */}
        <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
          <DialogContent>
            <div className="text-center p-4">
              <h2 className="text-2xl font-bold mb-2 text-sky-800">Unlock the Momentum Screener</h2>
              <p className="mb-4 text-gray-700 text-lg">
                The Momentum Screener is your edge for finding the <span className="font-semibold text-sky-700">top 10 actionable stocks</span> every day—setups you won't find anywhere else. <br /><br />
                <span className="font-semibold text-sky-700">Upgrade to Premium for just $14.65/month</span> (less than a night at the movies) and you could make back your subscription with a single great trade.
              </p>
              <p className="mb-6 text-gray-600 text-base">
                Premium unlocks daily screener access, advanced filters, and priority support. Don’t miss out on the next big breakout!
              </p>
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-sky-900 font-bold text-lg px-8 py-3 rounded-xl shadow-lg">
                <Link href="/pricing">Upgrade to Premium</Link>
              </Button>
              <div className="mt-4 text-sm text-gray-500">Cancel anytime. No risk, all reward.</div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}