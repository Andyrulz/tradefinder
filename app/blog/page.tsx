import Link from 'next/link';

const blogPosts = [
  {
    slug: 'identify-breakout-stocks-price-volume',
    title: 'How I Identify Breakout Stocks Using Price-Volume Analysis',
    summary: 'A deep dive into the exact price and volume patterns I look for before entering a breakout, with real chart examples and actionable tips.',
    date: '2025-04-10',
  },
  {
    slug: 'top-5-momentum-indicators-midcap',
    title: 'Top 5 Momentum Indicators I Use for Midcap Trading',
    summary: 'Discover the momentum indicators that consistently help me spot high-potential midcap stocks before they move.',
    date: '2025-04-20',
  },
  {
    slug: 'step-by-step-trade-plan-risk-management',
    title: 'Step-by-Step Guide: Creating a Trade Plan with Risk Management',
    summary: 'A practical, step-by-step walkthrough of building a robust trade plan, including risk controls and real-world examples.',
    date: '2025-04-28',
  },
];

export default function BlogIndexPage() {
  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">TradeCraft Blog</h1>
        <p className="mb-8 text-lg text-muted-foreground">Actionable trading strategies, technical analysis, and risk management insights inspired by the methods of Mark Minervini and Dan Zanger.</p>
        <div className="space-y-8">
          {blogPosts.map(post => (
            <div key={post.slug} className="border-b pb-6">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground mb-2">{post.summary}</p>
              <span className="text-xs text-gray-500">{post.date}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}