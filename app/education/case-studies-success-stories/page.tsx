import React from 'react';

export default function CaseStudies() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Case Studies: Real Trades and Success Stories</h1>
        <p className="mb-4">Learn from real-world examples of how traders have used TradeCraft to improve their results. These case studies highlight different strategies and lessons learned.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Case Study 1: Breakout Winner</h2>
        <p className="mb-4">A user identified a stock forming a tight base with volume dry-up. Using TradeCraft’s screener and trade plan, they entered on the breakout, set a logical stop, and scaled out at multiple targets. The trade delivered a 25% gain in three weeks. The user journaled the trade, noting the importance of waiting for volume confirmation and sticking to the plan even as the stock pulled back briefly after the breakout. Reviewing the trade, they realized that patience and discipline were key to maximizing gains.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Case Study 2: Managing a Losing Trade</h2>
        <p className="mb-4">Another trader followed a momentum setup, but the stock reversed after a false breakout. Thanks to strict risk management from the Trade Plan, the loss was limited to 1% of capital. The trader journaled the experience, learning to avoid trades during earnings season and to always check for upcoming news events. This discipline preserved confidence and capital for future opportunities.</p>
        <h2 className="text-xl font-semibold mt-8 mb-2">Case Study 3: Consistent Improvement</h2>
        <p className="mb-4">A new user started journaling every trade and reviewing the Education section. Over several months, their win rate and risk/reward improved, leading to more consistent results and fewer emotional mistakes. They also began sharing annotated charts with the community, receiving feedback and refining their setups. The user credits TradeCraft’s structured approach and educational resources for their steady progress.</p>
      </div>
    </main>
  );
}