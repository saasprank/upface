'use client'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  centered?: boolean
}

export default function SectionHeader({ label, title, subtitle, centered = true }: SectionHeaderProps) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      {label && (
        <p
          className="text-[10px] tracking-[0.22em] uppercase text-cyan mb-3"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {label}
        </p>
      )}
      <h2
        className="text-2xl sm:text-3xl font-black text-theme leading-tight tracking-tight"
        style={{ fontFamily: 'Satoshi, sans-serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm text-muted leading-relaxed max-w-md mx-auto">{subtitle}</p>
      )}
    </div>
  )
}
