import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.formData();
  const email = body.get('email') as string;
  const shortProductId = body.get('short_product_id') as string;
  const purchaseState = body.get('subscription_cancelled_at') ? 'cancelled' : 'active';
  const purchaseId = body.get('purchase_id');

  let planType: 'pro' | 'premium' | null = null;
  if (shortProductId === process.env.GUMROAD_PRO_PRODUCT_ID) planType = 'pro';
  if (shortProductId === process.env.GUMROAD_PREMIUM_PRODUCT_ID) planType = 'premium';
  if (!planType) {
    // Log unknown product
    await supabase.from('gumroad_webhook_logs').insert([
      {
        event_payload: Object.fromEntries(body.entries()),
        email,
        product_id: shortProductId,
        plan_type: null,
        status: 'error',
        error_message: 'Unknown product',
      },
    ]);
    return NextResponse.json({ success: false, error: 'Unknown product' }, { status: 400 });
  }

  // Find user by email
  const { data: user, error: userError } = await supabase.from('users').select('id').eq('email', email).single();
  if (!user) {
    // Log user not found
    await supabase.from('gumroad_webhook_logs').insert([
      {
        event_payload: Object.fromEntries(body.entries()),
        email,
        product_id: shortProductId,
        plan_type: planType,
        status: 'error',
        error_message: 'User not found',
      },
    ]);
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  // Upsert user_subscriptions
  const { error } = await supabase.from('user_subscriptions').upsert({
    user_id: user.id,
    plan_type: planType,
    lemonsqueezy_subscription_id: purchaseId, // store Gumroad purchase_id
    status: purchaseState,
  }, { onConflict: 'user_id' });
  if (error) {
    // Log upsert error
    await supabase.from('gumroad_webhook_logs').insert([
      {
        event_payload: Object.fromEntries(body.entries()),
        email,
        product_id: shortProductId,
        user_id: user.id,
        plan_type: planType,
        status: 'error',
        error_message: error.message,
      },
    ]);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // Log success
  await supabase.from('gumroad_webhook_logs').insert([
    {
      event_payload: Object.fromEntries(body.entries()),
      email,
      product_id: shortProductId,
      user_id: user.id,
      plan_type: planType,
      status: 'success',
      error_message: null,
    },
  ]);

  return NextResponse.json({ success: true });
}
