import { createClient } from './supabase-server'

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'none'
export type SubscriptionPlan = 'report' | 'pro' | 'pro_annual' | null

export interface SubscriptionInfo {
  isActive: boolean
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodEnd: Date | null
}

/**
 * Checks if the current authenticated user has an active subscription.
 * Returns gracefully in demo mode (table doesn't exist yet).
 */
export async function getSubscription(userId: string): Promise<SubscriptionInfo> {
  const SUPABASE_CONFIGURED = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  )

  if (!SUPABASE_CONFIGURED) {
    // Demo mode: simulate active Pro subscription
    return { isActive: true, plan: 'pro', status: 'active', currentPeriodEnd: null }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return { isActive: false, plan: null, status: 'none', currentPeriodEnd: null }
    }

    const isActive = data.status === 'active' || data.status === 'trialing'

    return {
      isActive,
      plan: data.plan as SubscriptionPlan,
      status: data.status as SubscriptionStatus,
      currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : null,
    }
  } catch {
    // Table not yet created — allow access in dev
    return { isActive: true, plan: 'pro', status: 'active', currentPeriodEnd: null }
  }
}

export async function requireSubscription(userId: string): Promise<SubscriptionInfo> {
  const sub = await getSubscription(userId)
  return sub
}
