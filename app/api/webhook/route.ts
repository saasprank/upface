import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) throw new Error('STRIPE_SECRET_KEY missing')
  return new Stripe(key, { apiVersion: '2024-06-20' } as unknown as ConstructorParameters<typeof Stripe>[1])
}

// App Router : lire le body brut est nécessaire pour vérifier la signature Stripe
export async function POST(req: NextRequest) {
  let stripe: Stripe
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 503 })
  }

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId) break

      // Récupère le price_id pour savoir si hebdo ou mensuel
      let priceId: string | null = null
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
        priceId = lineItems.data[0]?.price?.id ?? null
      } catch (e) {
        console.warn('Could not fetch line items:', e)
      }

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
        plan: 'pro',
        status: 'active',
        price_id: priceId,
      }, { onConflict: 'user_id' })

      await supabase
        .from('users')
        .update({
          plan: 'pro',
          stripe_customer_id: session.customer as string,
        })
        .eq('id', userId)

      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription

      const { data } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_subscription_id', sub.id)
        .single()

      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', sub.id)

      if (data?.user_id) {
        await supabase
          .from('users')
          .update({ plan: 'free' })
          .eq('id', data.user_id)
      }
      break
    }

    case 'invoice.payment_failed': {
      console.log('Payment failed — à notifier via Resend')
      break
    }
  }

  return NextResponse.json({ received: true })
}
