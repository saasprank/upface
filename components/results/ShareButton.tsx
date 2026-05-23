'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface ShareButtonProps {
  analysisId: string
  score: number
}

const ghostBtn =
  'inline-flex h-10 items-center gap-2 rounded-full border border-[#1E2A3E] bg-transparent px-4 font-[Inter,sans-serif] text-[13px] text-[#8B9DC3] transition-colors hover:border-[#3B82F6] hover:text-white'

export default function ShareButton({ analysisId }: ShareButtonProps) {
  const t = useTranslations('results')
  const [copied, setCopied] = useState(false)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/results/${analysisId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-[Outfit,sans-serif] text-[18px] font-bold text-white">{t('share_title')}</h3>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={ghostBtn} onClick={() => window.open('https://www.tiktok.com/', '_blank')}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.89a8.18 8.18 0 004.78 1.52V7.0a4.86 4.86 0 01-1.01-.31z" />
          </svg>
          TikTok
        </button>
        <button type="button" className={ghostBtn} onClick={() => window.open('https://www.instagram.com/', '_blank')}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Instagram
        </button>
        <button type="button" className={ghostBtn} onClick={handleCopy}>
          {copied ? (
            <>
              <svg className="h-4 w-4 text-[#06B6D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('share_copied')}
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {t('share_copy')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
