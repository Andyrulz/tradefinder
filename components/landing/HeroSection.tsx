"use client";

import { ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StockForm } from './StockForm';
import { ScreenerFilters } from '@/components/screener/ScreenerFilters';
import { ScreenerResults } from '@/components/screener/ScreenerResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { ScreenerStock, ScreenerFilters as FilterType } from '@/lib/types';
import { getMockScreenerStocks } from '@/lib/mock-data';
import DiscoverScreener from './DiscoverScreener';

export function HeroSection() {
  const [stocks, setStocks] = useState<ScreenerStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFilter = async (filters: FilterType) => {
    setLoading(true);
    setTimeout(() => {
      const results = getMockScreenerStocks(filters);
      setStocks(results);
      setLoading(false);
    }, 1000);
  };

  const handleFormspreeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://formspree.io/f/xnndpbwn', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(e.currentTarget),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center bg-gradient-to-br from-sky-100 via-white to-blue-50">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,199,255,0.10),rgba(255,255,255,0))]" />
      </div>
      <div className="container relative z-10 mx-auto px-4 pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-sky-200 text-sky-800 mb-4 transition-transform duration-300 hover:scale-105">
              <span className="flex h-2 w-2 rounded-full bg-sky-500 mr-2"></span>
              Professional Trading Tools
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
              Trade with <span className="text-primary bg-primary/10 px-2 rounded-md">confidence</span> using data-driven plans
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              Get institutional-grade trade plans powered by technical analysis. Perfect for both beginners and experienced traders seeking clear, actionable guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" variant="outline" asChild className="group rounded-xl text-lg px-8 py-4 border-2 border-sky-300 hover:border-sky-500 transition-all duration-300 hover:scale-105">
                <a href="#how-it-works" className="flex items-center">
                  How It Works
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7 flex justify-center">
            <div className="bg-white/90 backdrop-blur-lg border-none rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
              <Tabs defaultValue="symbol" className="space-y-8 w-full">
                <TabsList className="flex w-full bg-sky-50 rounded-full mb-6 p-1 gap-2">
                  <TabsTrigger value="symbol" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 transition-all duration-300 rounded-full text-lg font-semibold px-4 py-2">
                    I Know My Stock
                  </TabsTrigger>
                  <TabsTrigger value="discover" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 transition-all duration-300 rounded-full text-lg font-semibold px-4 py-2">
                    Help Me Discover
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="symbol" className="space-y-6 animate-in fade-in-50 duration-500">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-center">Enter Stock Symbol</h3>
                    <p className="text-base text-muted-foreground text-center">
                      Get a detailed trade plan with entry points, targets, and risk management
                    </p>
                  </div>
                  <StockForm />
                  <div className="flex flex-col gap-2 pt-2">
                    <Button asChild variant="ghost" className="w-full text-sky-700 hover:bg-sky-100 transition-all duration-200">
                      <a href="/trade-plan?symbol=AAPL&horizon=longterm">See Example</a>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="discover" className="space-y-6 animate-in fade-in-50 duration-500">
                  <DiscoverScreener />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}