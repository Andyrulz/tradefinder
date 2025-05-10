import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.formData();
  const email = body.get('email') as string;
  const productId = body.get('product_id') as string;
  const purchaseState = body.get('subscription_cancelled_at') ? 'cancelled' : 'active';

  let planType: 'pro' | 'premium' | null = null;
  if (productId === process.env.GUMROAD_PRO_PRODUCT_ID) planType = 'pro';
  if (productId === process.env.GUMROAD_PREMIUM_PRODUCT_ID) planType = 'premium';
  if (!planType) {
    return NextResponse.json({ success: false, error: 'Unknown product' }, { status: 400 });
  }

  // Find user by email
  const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  // Upsert user_subscriptions
  const { error } = await supabase.from('user_subscriptions').upsert({
    user_id: user.id,
    plan_type: planType,
    lemonsqueezy_subscription_id: body.get('purchase_id'), // store Gumroad purchase_id
    status: purchaseState,
  }, { onConflict: 'user_id' });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
