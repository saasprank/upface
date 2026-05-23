import Navbar from '@/components/layout/Navbar'
import DashboardSidebar from '@/components/layout/DashboardSidebar'
import DashboardBottomNav from '@/components/layout/DashboardBottomNav'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase-server'
import { isAuthUiHidden } from '@/lib/auth-ui'

const SUPABASE_CONFIGURED = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
)

const DEMO_USER = {
  email: 'demo@upface.app',
  user_metadata: { full_name: 'Utilisateur Demo' },
}

type SidebarUser = {
  email?: string
  user_metadata?: { avatar_url?: string; full_name?: string }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  let user: SidebarUser | null = null

  if (SUPABASE_CONFIGURED && !isAuthUiHidden()) {
    try {
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        redirect(`${prefix}/login?next=${prefix}/dashboard`)
      }

      user = session.user as SidebarUser
    } catch {
      redirect(`${prefix}/login?next=${prefix}/dashboard`)
    }
  } else if (SUPABASE_CONFIGURED && isAuthUiHidden()) {
    try {
      const supabase = await createClient()
      const { data: { session } } = await supabase.auth.getSession()
      user = (session?.user as SidebarUser | undefined) ?? DEMO_USER
    } catch {
      user = DEMO_USER
    }
  } else {
    user = DEMO_USER
  }

  return (
    <div className="bg-grid-pattern min-h-screen">
      <Navbar />
      <DashboardSidebar user={user} />

      <div className="min-h-screen pb-20 pt-16 lg:ml-[220px] lg:pb-0">
        {children}
      </div>

      <DashboardBottomNav />
    </div>
  )
}
