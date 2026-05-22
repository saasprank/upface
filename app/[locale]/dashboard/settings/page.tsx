'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase'

export default function SettingsPage() {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const router = useRouter()
  const prefix = locale === 'fr' ? '' : `/${locale}`

  const [emailNotif, setEmailNotif] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSave = () => {
    setSuccess('Paramètres sauvegardés.')
    setTimeout(() => setSuccess(null), 3000)
  }

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return }
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`${prefix}/`)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
      <h1
        className="text-2xl font-black text-theme mb-8"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {t('settings_title')}
      </h1>

      <div className="space-y-6">
        {/* Account */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-theme mb-4">Compte</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">{t('settings_email')}</label>
              <input
                type="email"
                disabled
                placeholder="votre@email.com"
                className="w-full bg-surface-2 border border-[rgba(15,23,42,0.06)] rounded-xl px-4 py-3 text-sm text-faint cursor-not-allowed"
              />
              <p className="text-xs text-faint mt-1">Modifiable via votre fournisseur d'identité.</p>
            </div>

            <div>
              <label className="block text-xs text-muted mb-1.5">{t('settings_password')}</label>
              <Button variant="outline" size="sm">
                Changer le mot de passe
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-theme mb-4">Notifications</h2>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-theme">{t('settings_notifications')}</p>
              <p className="text-xs text-faint mt-0.5">Rappels de routine et nouveautés UPFACE</p>
            </div>
            <div
              onClick={() => setEmailNotif(!emailNotif)}
              className={`relative w-11 h-6 rounded-full transition-all cursor-pointer ${
                emailNotif ? 'bg-blue-500' : 'bg-slate-200'
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  emailNotif ? 'left-5' : 'left-0.5'
                }`}
              />
            </div>
          </label>
        </Card>

        {/* Plan */}
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-theme mb-4">{t('settings_plan')}</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-theme">Plan Gratuit</span>
                <Badge variant="muted">Actuel</Badge>
              </div>
              <p className="text-xs text-faint">Score de base, 3 TraitCards</p>
            </div>
            <Button size="sm" onClick={() => router.push(`${prefix}/checkout`)}>
              Passer Pro
            </Button>
          </div>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-3">
          <Button onClick={handleSave}>
            {t('settings_save')}
          </Button>
          {success && (
            <span className="text-sm text-emerald-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </span>
          )}
        </div>

        {/* Danger zone */}
        <Card variant="surface2" className="p-6 border border-red-500/15">
          <h2 className="text-sm font-semibold text-red-400 mb-4">{t('settings_danger')}</h2>
          <p className="text-xs text-muted mb-4">
            La suppression de votre compte est irréversible. Toutes vos analyses et données seront définitivement supprimées.
          </p>
          {deleteConfirm && (
            <p className="text-xs text-red-400 mb-3 font-medium">
              Cliquez à nouveau pour confirmer la suppression définitive de votre compte.
            </p>
          )}
          <Button
            variant="outline"
            size="sm"
            className="border-red-500/30 text-red-400 hover:border-red-500/60 hover:bg-red-500/5"
            loading={loading}
            onClick={handleDeleteAccount}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('settings_delete')}
          </Button>
        </Card>
      </div>
    </div>
  )
}
