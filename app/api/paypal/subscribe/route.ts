import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper: Fetch PayPal subscription details
const isLive = process.env.PAYPAL_ENV === 'live';
const PAYPAL_API = isLive ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

async function fetchPayPalSubscription(subscriptionId: string) {
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  // Get access token
  const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) throw new Error('PayPal auth failed');
  // Get subscription details
  const subRes = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!subRes.ok) throw new Error('PayPal subscription fetch failed');
  return await subRes.json();
}

export async function POST(req: Request) {
  try {
    const { subscriptionId, email } = await req.json();
    if (!subscriptionId || !email) {
      return NextResponse.json({ success: false, error: 'Missing subscriptionId or email' }, { status: 400 });
    }
    // 1. Fetch PayPal subscription details
    const sub = await fetchPayPalSubscription(subscriptionId);
    if (sub.status !== 'ACTIVE') {
      return NextResponse.json({ success: false, error: 'Subscription not active' }, { status: 400 });
    }
    // 2. Determine plan type from PayPal plan_id
    let planType: 'pro' | 'premium' | null = null;
    if (sub.plan_id === 'P-78F276688T185260BNAPBKUA') planType = 'pro';
    if (sub.plan_id === 'P-6TP24067L2455943LNAPBNGA') planType = 'premium';
    if (!planType) {
      return NextResponse.json({ success: false, error: 'Unknown PayPal plan' }, { status: 400 });
    }
    // 3. Find user in Supabase
    const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    // 4. Update user_subscriptions
    const { error } = await supabase.from('user_subscriptions').upsert({
      user_id: user.id,
      plan_type: planType,
      lemonsqueezy_subscription_id: subscriptionId,
      status: 'active',
    }, { onConflict: 'user_id' });
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' }, { status: 500 });
  }
}
