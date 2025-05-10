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

async function logEvent(event: any, status: string, error?: string) {
  // Insert webhook event log into Supabase
  const event_type = event?.event_type || null;
  const event_id = event?.id || null;
  const payload = event || null;
  const error_message = error || null;
  await supabase.from('paypal_webhook_logs').insert([
    {
      event_type,
      event_id,
      payload,
      status,
      error_message,
    },
  ]);
}

export async function POST(req: Request) {
  try {
    const event = await req.json();
    const eventType = event.event_type;
    const resource = event.resource;
    const subscriptionId = resource?.id;
    if (!subscriptionId) {
      await logEvent(event, 'error', 'Missing subscriptionId');
      return NextResponse.json({ success: false, error: 'Missing subscriptionId' }, { status: 400 });
    }
    // Fetch subscription details from PayPal
    const sub = await fetchPayPalSubscription(subscriptionId);
    let planType: 'pro' | 'premium' | 'free' | null = null;
    if (sub.plan_id === 'P-78F276688T185260BNAPBKUA') planType = 'pro';
    if (sub.plan_id === 'P-6TP24067L2455943LNAPBNGA') planType = 'premium';
    // Sandbox test plan mapping
    if (sub.plan_id === 'P-5ML4271244454362WXNWU5NQ') planType = 'pro'; // Map sandbox test plan to 'pro'
    // Handle cancellation or failed payment
    if (
      eventType === 'BILLING.SUBSCRIPTION.CANCELLED' ||
      eventType === 'BILLING.SUBSCRIPTION.SUSPENDED' ||
      eventType === 'PAYMENT.SALE.DENIED' ||
      sub.status !== 'ACTIVE'
    ) {
      planType = 'free';
    }
    // Map to user by subscriptionId
    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('lemonsqueezy_subscription_id', subscriptionId)
      .single();
    if (!userSub) {
      await logEvent(event, 'error', 'User not found for subscription');
      return NextResponse.json({ success: false, error: 'User not found for subscription' }, { status: 404 });
    }
    // Update user_subscriptions
    const { error } = await supabase.from('user_subscriptions').update({
      plan_type: planType,
      status: planType === 'free' ? 'cancelled' : 'active',
      renewal_date: sub.billing_info?.next_billing_time ? new Date(sub.billing_info.next_billing_time) : null,
    }).eq('user_id', userSub.user_id);
    if (error) {
      await logEvent(event, 'error', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    await logEvent(event, 'success');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    await logEvent(null, 'error', err.message || 'Unknown error');
    return NextResponse.json({ success: false, error: err.message || 'Unknown error' }, { status: 500 });
  }
}
