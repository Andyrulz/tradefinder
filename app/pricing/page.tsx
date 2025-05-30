'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GUMROAD_PRO_URL = "https://labyrinthian8.gumroad.com/l/jynmay";
const GUMROAD_PREMIUM_URL = "https://labyrinthian8.gumroad.com/l/klcep";

const plans = [
	{
		name: 'Free',
		price: 'Free',
		description: 'Get started with the basics. Assigned by default to all users.',
		features: [
			'3 requests per day',
			'No access to momentum screener',
			'No on-demand support',
		],
		cta: 'Sign Up Free',
		ctaLink: '/auth/signin',
		highlight: false,
	},
	{
		name: 'Pro',
		price: '$6.45/mo',
		description:
			'For active traders who want more requests and support. Costs less than a single meal out—and you could make 2-5x this in a single trade by following a solid plan.',
		features: [
			'100 requests per day',
			'No access to momentum screener',
			'On-demand support via email',
		],
		cta: 'Subscribe Now',
		ctaLink: '/subscribe?plan=pro',
		highlight: false,
	},
	{
		name: 'Premium',
		price: '$14.65/mo',
		description:
			'Unlimited access, screener, and premium support. For less than a night at the movies, unlock the screener and make back your subscription in just one good trade.',
		features: [
			'Unlimited requests per day',
			'Access to momentum screener',
			'On-demand support via email',
		],
		cta: 'Subscribe Now',
		ctaLink: '/subscribe?plan=premium',
		highlight: true,
	},
];

export default function PricingPage() {
	const { data: session } = useSession();
	const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'premium' | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
	// Currency toggle state
	const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

	useEffect(() => {
		async function fetchPlan() {
			if (!session?.user?.email) return setLoading(false);
			const { data: user } = await supabase
				.from('users')
				.select('id')
				.eq('email', session.user.email)
				.single();
			if (!user) return setLoading(false);
			const { data: sub } = await supabase
				.from('user_subscriptions')
				.select('plan_type, lemonsqueezy_subscription_id')
				.eq('user_id', user.id)
				.single();
			setUserPlan(sub?.plan_type || 'free');
			setSubscriptionId(sub?.lemonsqueezy_subscription_id || null);
			setLoading(false);
		}
		fetchPlan();
	}, [session]);

	return (
		<main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-16">
			<div className="container mx-auto px-4 max-w-5xl">
				<h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-sky-900">
					Pricing tailored to your needs
				</h1>
				<p className="text-center text-base text-muted-foreground mb-5 max-w-2xl mx-auto">
					
				</p>
				{/* Currency toggle */}
				<p className="text-center text-base font-semibold text-sky-800 mb-4 max-w-2xl mx-auto leading-relaxed tracking-wide">
  <span className="align-middle">
    The first 3 trade plans everyday are on me. If you love it, please help me run the product as a solo creator. <span className="text-sky-600">Cancel anytime.</span>
  </span>
</p>
<div className="flex flex-col items-center gap-2 mb-6">
  <div className="inline-flex items-center bg-sky-50 border border-sky-200 rounded-xl px-2 py-1 shadow gap-1 text-base font-semibold">
    <button
      className={`px-3 py-1 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 ${currency === 'USD' ? 'bg-sky-700 text-white font-bold' : 'bg-white text-sky-700 hover:bg-sky-100'}`}
      onClick={() => setCurrency('USD')}
      aria-pressed={currency === 'USD'}
      type="button"
    >
      USD
    </button>
    <span className="mx-1 text-sky-400 font-bold text-lg">|</span>
    <button
      className={`px-3 py-1 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 ${currency === 'INR' ? 'bg-sky-700 text-white font-bold' : 'bg-white text-sky-700 hover:bg-sky-100'}`}
      onClick={() => setCurrency('INR')}
      aria-pressed={currency === 'INR'}
      type="button"
    >
      INR
    </button>
  </div>
  <span className="text-sm text-muted-foreground">
    {currency === 'INR'
      ? 'Pay securely in INR via Razorpay'
      : 'All prices in USD. INR option available for Indian users.'}
  </span>
</div>

				{loading ? (
					<div className="text-center py-12">Loading...</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{plans.map(plan => {
							const isCurrent = userPlan === plan.name.toLowerCase();
							const isFree = plan.name.toLowerCase() === 'free';
							const isPaid = plan.name.toLowerCase() === 'pro' || plan.name.toLowerCase() === 'premium';
							const planType = plan.name.toLowerCase();

							// Hide free plan CTA if user is on pro or premium
							if (isFree && (userPlan === 'pro' || userPlan === 'premium')) {
								return (
									<div
										key={plan.name}
										className={`rounded-2xl shadow-lg border border-sky-200 bg-white p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 ${plan.highlight ? 'ring-2 ring-sky-400' : ''}`}
									>
										<h2 className="text-2xl font-bold mb-2 text-sky-800">
											{plan.name}
										</h2>
										{/* Pricing display */}
										<div className="text-3xl font-extrabold mb-2 text-sky-700">
  {currency === 'INR'
    ? plan.name === 'Pro'
      ? '₹599/mo'
      : plan.name === 'Premium'
        ? '₹1399/mo'
        : plan.price
    : plan.price}
</div>
										<p className="text-base text-muted-foreground mb-6 text-center">
											{plan.description}
										</p>
										<ul className="mb-8 space-y-2 w-full">
											{plan.features.map((feature, i) => (
												<li
													key={i}
													className="flex items-center gap-2 text-sky-900"
												>
													<span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
													{feature}
												</li>
											))}
										</ul>
										<div className="w-full text-center py-3 rounded-xl font-semibold text-lg bg-sky-100 text-sky-400 cursor-not-allowed opacity-60">
											Not Available
										</div>
									</div>
								);
							}

							// Pro plan: show downgrade CTA if user is on premium
							if (planType === 'pro' && userPlan === 'premium') {
								return (
									<div
										key={plan.name}
										className={`rounded-2xl shadow-lg border border-sky-200 bg-white p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 ${plan.highlight ? 'ring-2 ring-sky-400' : ''}`}
									>
										<h2 className="text-2xl font-bold mb-2 text-sky-800">
											{plan.name}
										</h2>
										{/* Pricing display */}
										<div className="text-3xl font-extrabold mb-2 text-sky-700">
  {currency === 'INR'
    ? plan.name === 'Pro'
      ? '₹599/mo'
      : plan.name === 'Premium'
        ? '₹1399/mo'
        : plan.price
    : plan.price}
</div>
										<p className="text-base text-muted-foreground mb-6 text-center">
											{plan.description}
										</p>
										<ul className="mb-8 space-y-2 w-full">
											{plan.features.map((feature, i) => (
												<li
													key={i}
													className="flex items-center gap-2 text-sky-900"
												>
													<span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
													{feature}
												</li>
											))}
										</ul>
										<div className="w-full text-center py-3 rounded-xl font-semibold text-lg bg-sky-100 text-sky-400 cursor-not-allowed opacity-60">
											Downgrade to Pro from Premium in PayPal
										</div>
									</div>
								);
							}

							// Hide CTA for pro/premium if not logged in
							if ((planType === 'pro' || planType === 'premium') && !session) {
								return (
									<div
										key={plan.name}
										className={`rounded-2xl shadow-lg border border-sky-200 bg-white p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 ${plan.highlight ? 'ring-2 ring-sky-400' : ''}`}
									>
										<h2 className="text-2xl font-bold mb-2 text-sky-800">{plan.name}</h2>
										{/* Pricing display */}
										<div className="text-3xl font-extrabold mb-2 text-sky-700">
  {currency === 'INR'
    ? plan.name === 'Pro'
      ? '₹599/mo'
      : plan.name === 'Premium'
        ? '₹1399/mo'
        : plan.price
    : plan.price}
</div>
										<p className="text-base text-muted-foreground mb-6 text-center">{plan.description}</p>
										<ul className="mb-8 space-y-2 w-full">
											{plan.features.map((feature, i) => (
												<li key={i} className="flex items-center gap-2 text-sky-900">
													<span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
													{feature}
												</li>
											))}
										</ul>
										<div className="w-full text-center py-3 rounded-xl font-semibold text-lg bg-sky-100 text-sky-400 cursor-not-allowed opacity-60">
											Sign in to upgrade
										</div>
									</div>
								);
							}

							return (
								<div
									key={plan.name}
									className={`rounded-2xl shadow-lg border border-sky-200 bg-white p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 ${
										plan.highlight ? 'ring-2 ring-sky-400' : ''
									}`}
								>
									<h2 className="text-2xl font-bold mb-2 text-sky-800">
										{plan.name}
									</h2>
									{/* Pricing display */}
									<div className="text-3xl font-extrabold mb-2 text-sky-700">
  {currency === 'INR'
    ? plan.name === 'Pro'
      ? '₹599/mo'
      : plan.name === 'Premium'
        ? '₹1399/mo'
        : plan.price
    : plan.price}
</div>
									<p className="text-base text-muted-foreground mb-6 text-center">
										{plan.description}
									</p>
									<ul className="mb-8 space-y-2 w-full">
										{plan.features.map((feature, i) => (
											<li
												key={i}
												className="flex items-center gap-2 text-sky-900"
											>
												<span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
												{feature}
											</li>
										))}
									</ul>
									{/* CTA logic */}
									{isCurrent ? (
										<div className="w-full text-center py-3 rounded-xl font-semibold text-lg bg-sky-200 text-sky-800 cursor-not-allowed">
											Current Plan
										</div>
									) : isPaid ? (
										<a
											href={planType === 'pro' ? GUMROAD_PRO_URL : GUMROAD_PREMIUM_URL}
											target="_blank"
											rel="noopener noreferrer"
											className={`w-full text-center py-3 rounded-xl font-semibold text-lg ${planType === 'premium' ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
										>
											{planType === 'pro' ? 'Subscribe to Pro' : 'Subscribe to Premium'}
										</a>
									) : isFree && session ? (
										<div className="w-full text-center py-3 rounded-xl font-semibold text-lg bg-sky-200 text-sky-800 cursor-not-allowed">
											Current Plan
										</div>
									) : (
										<Link
											href={plan.ctaLink}
											className={`w-full text-center py-3 rounded-xl font-semibold text-lg bg-sky-100 text-sky-800 hover:bg-sky-200`}
										>
											{plan.cta}
										</Link>
									)}
								</div>
							);
						})}
					</div>
				)}
				{/* Manage Subscription link for Pro/Premium users */}
				{(userPlan === 'pro' || userPlan === 'premium') && subscriptionId && (
					<div className="text-center mt-8">
						<a
							href={`https://www.paypal.com/myaccount/autopay/connect/${subscriptionId}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block px-6 py-3 rounded-xl bg-sky-700 text-white font-semibold text-lg shadow hover:bg-sky-800 transition-colors"
						>
							Manage Subscription
						</a>
					</div>
				)}
			</div>
		</main>
	);
}
