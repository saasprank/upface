'use client'

import { useId } from 'react'

interface ChartPoint {
  date: string
  score: number
}

interface DashboardProgressChartProps {
  title: string
  data: ChartPoint[]
  emptyMessage?: string
}

export default function DashboardProgressChart({ title, data, emptyMessage }: DashboardProgressChartProps) {
  const gradId = useId().replace(/:/g, '')
  const areaId = useId().replace(/:/g, '')

  const w = 600
  const h = 160
  const padX = 32
  const padY = 24

  const hasData = data.length > 1

  return (
    <div className="rounded-xl border border-[#1E2A3E] bg-[#0D1321] p-5">
      <p className="mb-4 font-[Outfit,sans-serif] text-[16px] font-bold text-white">{title}</p>

      {!hasData ? (
        <p className="py-8 text-center font-[Inter,sans-serif] text-[13px] text-[#3D4F6E]">
          {emptyMessage ?? 'Pas assez de données'}
        </p>
      ) : (
        <>
          <svg className="w-full" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
              <linearGradient id={areaId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59,130,246,0.1)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = padY + t * (h - padY * 2)
              return (
                <line
                  key={t}
                  x1={padX}
                  y1={y}
                  x2={w - padX}
                  y2={y}
                  stroke="#1E2A3E"
                  strokeWidth="1"
                />
              )
            })}

            {(() => {
              const minV = Math.min(...data.map((d) => d.score)) - 5
              const maxV = Math.max(...data.map((d) => d.score)) + 5
              const pts = data.map((d, i) => ({
                x: padX + (i / (data.length - 1)) * (w - padX * 2),
                y: h - padY - ((d.score - minV) / (maxV - minV)) * (h - padY * 2),
              }))
              const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
              const area = `${line} L ${pts[pts.length - 1].x},${h - padY} L ${pts[0].x},${h - padY} Z`

              return (
                <>
                  <path d={area} fill={`url(#${areaId})`} />
                  <path
                    d={line}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {pts.map((p, i) => {
                    const isLast = i === pts.length - 1
                    return (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={isLast ? 5 : 4}
                        fill={isLast ? '#06B6D4' : '#3B82F6'}
                        stroke="#080C14"
                        strokeWidth="2"
                        style={isLast ? { filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.8))' } : undefined}
                      />
                    )
                  })}
                </>
              )
            })()}
          </svg>

          <div className="mt-2 flex justify-between">
            {data.map((d, i) => (
              <span key={i} className="font-[Inter,sans-serif] text-[11px] text-[#3D4F6E]">
                {d.date}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
