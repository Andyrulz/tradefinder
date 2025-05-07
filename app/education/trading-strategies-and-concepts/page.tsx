import React from 'react';

export default function TradingStrategies() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Trading Strategies and Concepts</h1>
        <p className="mb-4">Successful trading is built on proven strategies and a solid understanding of market concepts. Here are a few strategies you can apply using TradeCraft:</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">1. Breakout Trading</h2>
        <p className="mb-4">Look for stocks breaking above resistance with strong volume. Use the Screener to find candidates and the Trade Plan to define your entry, stop, and targets.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">2. Momentum Trading</h2>
        <p className="mb-4">Focus on stocks with high relative strength and positive technical signals. TradeCraft’s analysis tools help you spot momentum early and manage risk.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">3. Pullback Entries</h2>
        <p className="mb-4">Wait for a stock to pull back to support or a moving average before entering. Use the Stock Analysis page to identify key levels and confirm with volume patterns.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">4. Risk Management</h2>
        <p className="mb-4">Always define your risk before entering a trade. TradeCraft’s Trade Plan gives you clear stop-loss and position sizing guidance for every setup.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Example: Applying a Breakout Strategy</h2>
        <p className="mb-4">Suppose you find a stock with a tight base and volume dry-up. Use the Trade Plan to set your entry just above resistance, stop below the base, and targets based on risk/reward. Review your results and refine your approach over time.</p>
      </div>
    </main>
  );
}