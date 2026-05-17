import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
} as unknown as ConstructorParameters<typeof Stripe>[1])

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId, email, locale } = await req.json() as {
      priceId: string
      userId: string
      email: string
      locale: string
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
    const localeSegment = locale === 'fr' ? '' : `/${locale}`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      locale: locale === 'fr' ? 'fr' : 'en',
      ...(email ? { customer_email: email } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}${localeSegment}/onboarding/routine-complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}${localeSegment}/onboarding/routine-preview`,
      metadata: { userId, locale },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
