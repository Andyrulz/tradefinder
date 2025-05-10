'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Script from 'next/script';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_ENV = process.env.NEXT_PUBLIC_PAYPAL_ENV;

const plans = [
	{
		name: 'Free',
		price: 'Free',
		description: 'Get started with the basics. Assigned by default to all users.',
		features: [
			'5 requests per day',
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

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PricingPage() {
	const { data: session } = useSession();
	const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'premium' | null>(
		null
	);
	const [loading, setLoading] = useState(true);
	const [showPayPal, setShowPayPal] = useState<{ [key: string]: boolean }>({});
	const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
	const paypalRendered = useRef<{ [key: string]: boolean }>({});

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

	useEffect(() => {
		if (typeof window === 'undefined' || loading || !session) return;
		const plansToRender = ['pro', 'premium'];
		plansToRender.forEach((planType) => {
			if (showPayPal[planType] && !paypalRendered.current[planType]) {
				const planId = planType === 'pro' ? 'P-78F276688T185260BNAPBKUA' : 'P-6TP24067L2455943LNAPBNGA';
				const containerId = `paypal-button-container-${planId}`;
				if (!window.paypal) {
					const script = document.createElement('script');
					script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&env=${PAYPAL_ENV}`;
					script.async = true;
					script.onload = () => renderPayPalButton(planId, planType);
					document.body.appendChild(script);
				} else {
					renderPayPalButton(planId, planType);
				}
				paypalRendered.current[planType] = true;
			}
		});
		function renderPayPalButton(planId: string, planType: string) {
			window.paypal.Buttons({
				style: {
					shape: planType === 'premium' ? 'pill' : 'rect',
					color: planType === 'premium' ? 'gold' : 'blue',
					layout: 'vertical',
					label: 'subscribe',
				},
				createSubscription: function (data: any, actions: any) {
					return actions.subscription.create({
						plan_id: planId,
						application_context: {
							return_url: window.location.origin + "/dashboard", // or your thank-you page
							cancel_url: window.location.origin + "/pricing"
						}
					});
				},
				onApprove: function (data: any, actions: any) {
					fetch('/api/paypal/subscribe', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ subscriptionId: data.subscriptionID, email: session?.user?.email }),
					})
						.then((res) => res.json())
						.then((res) => {
							if (res.success) {
								window.location.reload();
							} else {
								alert(res.error || 'Subscription failed.');
							}
						})
						.catch(() => alert('Subscription failed.'));
				},
			}).render(`#paypal-button-container-${planId}`);
		}
	}, [userPlan, loading, session, showPayPal]);

	return (
		<main className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-16">
			<div className="container mx-auto px-4 max-w-5xl">
				<h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 text-sky-900">
					Pricing Plans
				</h1>
				<p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
					Choose the plan that fits your trading needs. Upgrade or downgrade
					anytime.
				</p>
				{loading ? (
					<div className="text-center py-12">Loading...</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{plans.map(plan => {
							const isCurrent = userPlan === plan.name.toLowerCase();
							const isFree = plan.name.toLowerCase() === 'free';
							const isPaid = plan.name.toLowerCase() === 'pro' || plan.name.toLowerCase() === 'premium';
							const planType = plan.name.toLowerCase();
							const planId = planType === 'pro' ? 'P-78F276688T185260BNAPBKUA' : planType === 'premium' ? 'P-6TP24067L2455943LNAPBNGA' : '';

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
										<div className="text-3xl font-extrabold mb-2 text-sky-700">
											{plan.price}
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
										<div className="text-3xl font-extrabold mb-2 text-sky-700">
											{plan.price}
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
										<div className="text-3xl font-extrabold mb-2 text-sky-700">{plan.price}</div>
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
									<div className="text-3xl font-extrabold mb-2 text-sky-700">
										{plan.price}
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
										showPayPal[planType] ? (
											<div id={`paypal-button-container-${planId}`} className="w-full"></div>
										) : (
											<button
												className={`w-full text-center py-3 rounded-xl font-semibold text-lg ${planType === 'premium' ? 'bg-yellow-400 text-white hover:bg-yellow-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
												onClick={() => setShowPayPal(prev => ({ ...prev, [planType]: true }))}
											>
												{planType === 'pro' ? 'Upgrade to Pro' : 'Upgrade to Premium'}
											</button>
										)
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
