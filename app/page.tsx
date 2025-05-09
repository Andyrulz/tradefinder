'use client';

import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import Link from 'next/link';

const blogPosts = [
	{
		slug: 'identify-breakout-stocks-price-volume',
		title: 'How I Identify Breakout Stocks Using Price-Volume Analysis',
		summary:
			'A deep dive into the exact price and volume patterns I look for before entering a breakout, with real chart examples and actionable tips.',
		date: '2025-04-10',
	},
	{
		slug: 'top-5-momentum-indicators-midcap',
		title: 'Top 5 Momentum Indicators I Use for Midcap Trading',
		summary:
			'Discover the momentum indicators that consistently help me spot high-potential midcap stocks before they move.',
		date: '2025-04-20',
	},
	{
		slug: 'step-by-step-trade-plan-risk-management',
		title: 'Step-by-Step Guide: Creating a Trade Plan with Risk Management',
		summary:
			'A practical, step-by-step walkthrough of building a robust trade plan, including risk controls and real-world examples.',
		date: '2025-04-28',
	},
];

export default function Home() {
	return (
		<main className="flex-1">
			<HeroSection />
			<FeatureSection />
			<HowItWorks />
			<section className="container mx-auto px-4 max-w-4xl py-12">
				<h2 className="text-2xl font-bold mb-6">From the Blog</h2>
				<div className="space-y-8">
					{blogPosts.map(post => (
						<div key={post.slug} className="border-b pb-6">
							<h3 className="text-xl font-semibold mb-2">
								<Link href={`/blog/${post.slug}`}>{post.title}</Link>
							</h3>
							<p className="text-muted-foreground mb-2">
								{post.summary}
							</p>
							<span className="text-xs text-gray-500">{post.date}</span>
						</div>
					))}
				</div>
				<div className="mt-8">
					<Link
						href="/blog"
						className="text-primary underline font-medium"
					>
						View all blog posts →
					</Link>
				</div>
			</section>
			<TestimonialsSection />
			<section className="hero-container">
				<div className="hero-content">
					<span className="text-4xl font-bold leading-tight block mb-2 text-balance max-w-md">Trade with confidence</span>
					<span className="text-4xl font-bold leading-tight block mb-2 text-blue-700 text-balance max-w-md">Find High Momentum Stocks</span>
					<p className="mt-4 text-lg text-muted-foreground max-w-md text-balance">
						Instantly generate institutional-grade trade plans or discover today’s top momentum stocks—powered by technical analysis. Perfect for both beginners and experienced traders seeking clear, actionable guidance and fresh opportunities.
					</p>
				</div>
			</section>
			<section className="container mx-auto px-4 max-w-4xl py-12">
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-xl font-semibold mb-4 text-center">
						Enter Stock Symbol
					</h3>
					<p className="text-center text-muted-foreground text-base max-w-xs mx-auto mb-6 text-balance">
						Get a detailed trade plan with entry points, targets, and risk management
					</p>
					<div className="flex gap-4">
						<input
							type="text"
							placeholder="AAPL, TSLA, AMZN..."
							className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
						/>
						<button className="bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold transition-all duration-200 hover:bg-blue-700">
							Search
						</button>
					</div>
				</div>
			</section>
		</main>
	);
}