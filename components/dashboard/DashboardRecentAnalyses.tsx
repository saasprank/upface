'use client'

import Link from 'next/link'
import { useId } from 'react'

export interface RecentAnalysis {
  id: string
  score: number
  tier: string
  date: string
}

const TIER_STYLES: Record<string, { label: string; bg: string }> = {
  attractive: { label: 'Attractive', bg: '#06B6D4' },
  elite: { label: 'Elite', bg: '#06B6D4' },
  average: { label: 'Average', bg: '#F59E0B' },
  below: { label: 'Below', bg: '#EF4444' },
}

function MiniScoreRing({ score }: { score: number }) {
  const gradId = useId().replace(/:/g, '')
  const size = 40
  const r = 15
  const cx = size / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#1E2A3E" strokeWidth="3" />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute font-[Outfit,sans-serif] text-[11px] font-bold text-white">{score}</span>
    </div>
  )
}

function TierBadge({ tier }: { tier: string }) {
  const style = TIER_STYLES[tier] ?? TIER_STYLES.average
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-[Inter,sans-serif] text-[10px] font-bold text-white"
      style={{ background: style.bg }}
    >
      ✦ {style.label}
    </span>
  )
}

interface DashboardRecentAnalysesProps {
  title: string
  analyses: RecentAnalysis[]
  prefix: string
  emptyMessage: string
}

export default function DashboardRecentAnalyses({
  title,
  analyses,
  prefix,
  emptyMessage,
}: DashboardRecentAnalysesProps) {
  return (
    <section>
      <h2 className="mb-4 font-[Outfit,sans-serif] text-[16px] font-bold text-white">{title}</h2>

      {analyses.length === 0 ? (
        <div className="rounded-xl border border-[#1E2A3E] bg-[#0D1321] p-6 text-center">
          <p className="font-[Inter,sans-serif] text-[13px] text-[#3D4F6E]">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#1E2A3E] bg-[#0D1321]">
          {analyses.map((analysis, i) => (
            <Link
              key={analysis.id}
              href={`${prefix}/results/${analysis.id}`}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#111827] ${
                i > 0 ? 'border-t border-[#1E2A3E]' : ''
              }`}
            >
              <MiniScoreRing score={analysis.score} />
              <div className="min-w-0 flex-1">
                <p className="font-[Inter,sans-serif] text-[13px] text-white">{analysis.date}</p>
                <p className="font-mono text-[11px] text-[#3D4F6E]">ID {analysis.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <TierBadge tier={analysis.tier} />
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
