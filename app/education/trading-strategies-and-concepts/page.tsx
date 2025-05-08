import React from 'react';

export default function TradingStrategies() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Trading Strategies and Concepts</h1>
        <p className="mb-4 text-lg">TradeCraft empowers traders with institutional-grade strategies, actionable analytics, and robust risk management. Below you'll find a detailed overview of the core trading strategies, setups, and concepts you can apply using TradeCraft's tools.</p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">Core Trade Setups</h2>
        <h3 className="text-xl font-semibold mt-8 mb-2">1. Bullish Breakout</h3>
        <p className="mb-4">A breakout occurs when a stock price moves above a well-defined resistance level, often accompanied by a surge in volume. TradeCraft detects breakouts using price and volume analytics, and provides entry zones, stop-loss, and targets. Look for confirmation with volume spikes and technical indicators like RSI and MACD. This setup is ideal for capturing strong upward momentum at the start of a new trend.</p>

        <h3 className="text-xl font-semibold mt-8 mb-2">2. Support Bounce</h3>
        <p className="mb-4">A support bounce strategy involves entering a trade when a stock pulls back to a key support level (such as a moving average or previous low) and shows signs of reversal. TradeCraft automatically identifies support zones and signals when price action and volume confirm a bounce. This setup is best for traders looking to buy dips in established uptrends with defined risk.</p>

        <h3 className="text-xl font-semibold mt-8 mb-2">3. Trend Continuation</h3>
        <p className="mb-4">Trend continuation setups aim to capture ongoing moves in the direction of the prevailing trend. TradeCraft analyzes moving averages, price structure, and momentum indicators to identify when a trend is likely to persist. Entry is typically on a minor pullback or consolidation, with stops placed below recent swing lows (for uptrends) or highs (for downtrends).</p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">Additional Strategies & Concepts</h2>
        <h3 className="text-xl font-semibold mt-8 mb-2">4. Momentum Trading</h3>
        <p className="mb-4">Momentum trading focuses on stocks with strong relative strength, high volume, and positive technical signals. TradeCraft’s screener and analysis tools help you spot momentum early, using indicators like RSI, MACD, and price action. The goal is to ride the wave of buying or selling pressure for quick gains.</p>

        <h3 className="text-xl font-semibold mt-8 mb-2">5. Pullback Entries</h3>
        <p className="mb-4">Pullback entries involve waiting for a stock to retrace to a logical support area (such as a moving average or previous breakout level) before entering. This approach reduces the risk of chasing extended moves and allows for tighter stop-loss placement. Use TradeCraft’s Stock Analysis to identify key levels and confirm with volume patterns.</p>

        <h3 className="text-xl font-semibold mt-8 mb-2">6. Volatility Contraction Patterns</h3>
        <p className="mb-4">These setups look for stocks forming tight price ranges with declining volatility, often preceding explosive moves. TradeCraft’s analytics highlight contraction patterns and alert you to potential breakouts. Entry is typically above the upper boundary of the range, with stops below the recent low.</p>

        <h3 className="text-xl font-semibold mt-8 mb-2">7. Earnings & Catalyst Plays</h3>
        <p className="mb-4">Trading around earnings or sector catalysts can offer high-reward opportunities but comes with increased risk. TradeCraft flags upcoming events and helps you size positions appropriately, emphasizing risk management and scenario analysis.</p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">Risk Management & Trade Plan Essentials</h2>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Entry Zone:</strong> Optimal price range to initiate a trade, based on setup type and volatility (ATR).</li>
          <li><strong>Stop Loss:</strong> Logical exit point if the trade moves against you, calculated using support/resistance and ATR.</li>
          <li><strong>Targets:</strong> Multiple profit targets based on risk/reward ratios (typically 2:1 or better).</li>
          <li><strong>Position Sizing:</strong> Suggested size based on your risk tolerance and trade probability.</li>
          <li><strong>Trailing Stops:</strong> Dynamic stops that move with price to lock in profits as the trade progresses.</li>
          <li><strong>Volume Confirmation:</strong> Use volume spikes to confirm breakouts and trend strength.</li>
          <li><strong>Pattern Reliability:</strong> TradeCraft scores each setup for probability and reliability, helping you focus on high-quality trades.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-10 mb-3">Example: Applying a Breakout Strategy with TradeCraft</h2>
        <p className="mb-4">Suppose you find a stock forming a tight base with declining volatility and volume dry-up. TradeCraft’s Trade Plan will set your entry just above resistance, stop below the base, and targets based on risk/reward. Wait for a volume surge to confirm the breakout, and use trailing stops to protect profits as the trade moves in your favor. Review your results and refine your approach over time.</p>

        <h2 className="text-2xl font-semibold mt-10 mb-3">Continuous Learning</h2>
        <p className="mb-4">Successful trading is a journey of learning and adaptation. Use TradeCraft’s blog, case studies, and education sections to deepen your understanding of strategies, risk management, and market psychology. Keep a trading journal, review your trades, and always strive to improve your process.</p>
      </div>
    </main>
  );
}