import Image from 'next/image';

export default function BlogPost2() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Top 5 Momentum Indicators I Use for Midcap Trading</h1>
        <p className="text-muted-foreground mb-6">By TradeCraft | May 6, 2025</p>
        <Image src="/blog/momentum-indicators-overview.png" alt="Momentum Indicators Overview" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p className="mb-4">Momentum trading is about catching stocks as they begin to move, not after the move is over. In this article, I’ll share the five momentum indicators that have consistently helped me spot high-potential midcap stocks before they break out. These tools are inspired by the approaches of Mark Minervini and Dan Zanger, but adapted for today’s markets.</p>
        <h2 className="text-xl font-bold mt-8 mb-2">1. Relative Strength (RS) Rating</h2>
        <p className="mb-4">The RS Rating compares a stock’s price performance to the overall market. I look for stocks with RS Ratings in the top 10% of the market. This is often a precursor to institutional buying.</p>
        <Image src="/blog/rs-rating-example.png" alt="RS Rating Example" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">2. Moving Average Convergence Divergence (MACD)</h2>
        <p className="mb-4">MACD helps me spot momentum shifts. I look for bullish crossovers and positive histogram bars, especially when the stock is emerging from a base.</p>
        <Image src="/blog/macd-crossover.png" alt="MACD Crossover Example" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">3. Relative Volume (RVOL)</h2>
        <p className="mb-4">RVOL measures current volume versus average volume. A spike in RVOL (2x or more) often precedes a breakout. I use RVOL to confirm that a move is supported by real buying interest.</p>
        <Image src="/blog/rvol-spike.png" alt="RVOL Spike Example" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">4. Rate of Change (ROC)</h2>
        <p className="mb-4">ROC measures the speed of a stock’s price movement. I use it to filter for stocks with accelerating momentum, but avoid those that are overextended.</p>
        <Image src="/blog/roc-example.png" alt="ROC Example" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">5. Stochastic RSI</h2>
        <p className="mb-4">Stochastic RSI is a momentum oscillator that helps me time entries. I look for crossovers above 20 (bullish) or below 80 (bearish) to spot early reversals or confirm trends.</p>
        <Image src="/blog/stochrsi-crossover.png" alt="Stochastic RSI Crossover" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">Putting It All Together</h2>
        <p className="mb-4">No single indicator is perfect. I use a combination of these tools to build conviction. For example, a midcap stock with a high RS Rating, bullish MACD, and RVOL spike is a prime candidate for my watchlist. Always confirm with price action and volume before entering.</p>
        <h2 className="text-xl font-bold mt-8 mb-2">Conclusion</h2>
        <p className="mb-4">Momentum trading is about stacking probabilities. By mastering these indicators and combining them with sound risk management, you can consistently find and ride the next wave of midcap leaders. For more indicator breakdowns and live trade setups, explore the rest of the TradeCraft blog.</p>
      </div>
    </main>
  );
}