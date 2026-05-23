interface DashboardKpiCardProps {
  label: string
  value: string | number
  unit?: string
  highlighted?: boolean
}

export default function DashboardKpiCard({ label, value, unit, highlighted }: DashboardKpiCardProps) {
  return (
    <div
      className={`rounded-xl border bg-[#0D1321] p-5 ${
        highlighted
          ? 'border-[#3B82F6]'
          : 'border-[#1E2A3E]'
      }`}
      style={
        highlighted
          ? { boxShadow: '0 0 32px rgba(59,130,246,0.25), 0 0 64px rgba(6,182,212,0.08)' }
          : undefined
      }
    >
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#3D4F6E]">{label}</p>
      <p className="font-[Outfit,sans-serif] text-[40px] font-bold leading-none text-white">{value}</p>
      {unit && (
        <p className="mt-2 font-[Inter,sans-serif] text-[12px] text-[#8B9DC3]">{unit}</p>
      )}
    </div>
  )
}
