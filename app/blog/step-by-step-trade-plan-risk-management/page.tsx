import Image from 'next/image';

export default function BlogPost3() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-4">Step-by-Step Guide: Creating a Trade Plan with Risk Management</h1>
        <p className="text-muted-foreground mb-6">By TradeCraft | May 6, 2025</p>
        <Image src="/blog/trade-plan-overview.png" alt="Trade Plan Overview" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p className="mb-4">A robust trade plan is the backbone of consistent trading success. In this guide, I’ll walk you through the exact steps I use to create a trade plan, inspired by the disciplined approaches of Mark Minervini and Dan Zanger. You’ll learn how to define your setup, manage risk, and execute with confidence.</p>
        <h2 className="text-xl font-bold mt-8 mb-2">1. Define Your Setup</h2>
        <p className="mb-4">Start by clearly defining the technical setup you’re trading. Is it a breakout, pullback, or trend continuation? Use strict criteria—such as price above key moving averages, tight consolidation, and volume patterns—to filter for A+ setups.</p>
        <Image src="/blog/setup-criteria.png" alt="Setup Criteria Example" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">2. Entry and Exit Rules</h2>
        <ul className="list-disc ml-6 mb-4">
          <li><strong>Entry:</strong> Enter only when all criteria are met. Avoid chasing extended moves.</li>
          <li><strong>Stop-Loss:</strong> Place your stop just below a logical support level or the low of the base.</li>
          <li><strong>Targets:</strong> Set realistic profit targets based on risk/reward (at least 2:1).</li>
        </ul>
        <Image src="/blog/entry-exit-rules.png" alt="Entry and Exit Rules" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">3. Position Sizing</h2>
        <p className="mb-4">Calculate your position size based on your risk tolerance. For example, risking 1% of your capital per trade. Use the distance from entry to stop-loss to determine the number of shares.</p>
        <Image src="/blog/position-sizing.png" alt="Position Sizing Example" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">4. Risk Management Checklist</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Is your risk per trade defined and acceptable?</li>
          <li>Is your stop-loss logical and not arbitrary?</li>
          <li>Are you avoiding overexposure to one sector or theme?</li>
          <li>Do you have a plan for partial profits or trailing stops?</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-2">5. Review and Refine</h2>
        <p className="mb-4">After each trade, review your plan and execution. Did you follow your rules? What can you improve? Keep a trading journal with annotated charts and notes.</p>
        <Image src="/blog/trading-journal.png" alt="Trading Journal Example" width={800} height={400} className="rounded mb-6" />
        <h2 className="text-xl font-bold mt-8 mb-2">Conclusion</h2>
        <p className="mb-4">A well-crafted trade plan is your edge in the market. By following these steps and maintaining discipline, you’ll avoid emotional decisions and trade with confidence. For more trade plan templates and real-world examples, explore the rest of the TradeCraft blog.</p>
      </div>
    </main>
  );
}