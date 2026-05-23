'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase'
import { isAuthUiHidden } from '@/lib/auth-ui'
import UpfaceLogo from '@/components/ui/UpfaceLogo'

interface User {
  email?: string
  user_metadata?: { avatar_url?: string; full_name?: string }
}

interface DashboardSidebarProps {
  user: User | null
}

const navItems = [
  {
    key: 'nav_dashboard',
    href: '/dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    key: 'nav_history',
    href: '/dashboard/history',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'nav_routine',
    href: '/dashboard/routine',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'nav_settings',
    href: '/dashboard/settings',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`
  const hideAuthUi = isAuthUiHidden()

  const isActive = (href: string) => {
    const fullPath = `${prefix}${href}`
    if (href === '/dashboard') {
      return pathname === fullPath
    }
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(hideAuthUi ? `${prefix}/` : `${prefix}/login`)
    router.refresh()
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <aside className="bg-grid-pattern fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-[220px] flex-col border-r border-[#1E2A3E] lg:flex">
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.key}
              href={`${prefix}${item.href}`}
              className={`flex items-center gap-3 border-l-2 px-3 py-2.5 font-[Inter,sans-serif] text-[13px] font-medium transition-colors ${
                active
                  ? 'border-[#3B82F6] bg-[#0D1321] text-white'
                  : 'border-transparent text-[#8B9DC3] hover:bg-[#0D1321]/60 hover:text-white'
              }`}
            >
              <span className={active ? 'text-[#3B82F6]' : 'text-[#3D4F6E]'}>{item.icon}</span>
              {t(item.key as Parameters<typeof t>[0])}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[#1E2A3E] p-3">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1E2A3E] bg-[#0D1321] text-xs font-bold text-[#3B82F6]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white">
              {user?.user_metadata?.full_name ?? 'Utilisateur'}
            </p>
            <p className="truncate text-[11px] text-[#3D4F6E]">{user?.email}</p>
          </div>
        </div>
        {!hideAuthUi && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 font-[Inter,sans-serif] text-[13px] text-[#8B9DC3] transition-colors hover:text-red-400"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t('logout')}
          </button>
        )}
      </div>
    </aside>
  )
}
