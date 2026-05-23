'use client'

interface TraitItem {
  key: string
  label: string
  score: number
  icon: React.ReactNode
  locked?: boolean
}

function LockOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1E2A3E] bg-[#0D1321]/90">
        <svg className="h-5 w-5 text-[#8B9DC3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
    </div>
  )
}

export default function ResultsBreakdownGrid({ traits }: { traits: TraitItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {traits.map((trait) => (
        <div
          key={trait.key}
          className={`relative rounded-xl border border-[#1E2A3E] bg-[#0D1321] p-5 transition-opacity ${trait.locked ? 'opacity-40' : ''}`}
        >
          {trait.locked && <LockOverlay />}

          <div className="mb-3 flex items-center gap-2 text-[#3B82F6]">
            {trait.icon}
            <span className="font-[Inter,sans-serif] text-[12px] text-[#8B9DC3]">{trait.label}</span>
          </div>

          <p className={`mb-3 font-[Outfit,sans-serif] text-[32px] font-bold leading-none text-white ${trait.locked ? 'blur-[6px] select-none' : ''}`}>
            {trait.score}
          </p>

          <div className="h-[3px] overflow-hidden rounded-[2px] bg-[#1E2A3E]">
            <div
              className="h-full rounded-[2px] bg-[#3B82F6]"
              style={{ width: trait.locked ? '60%' : `${trait.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
