import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface2' | 'surface3'
  hover?: boolean
}

export default function Card({ variant = 'default', hover = false, children, className = '', ...props }: CardProps) {
  const variants = {
    default: 'bg-[#0D1321] border border-[rgba(59,130,246,0.12)]',
    surface2: 'bg-[#111827] border border-[rgba(255,255,255,0.06)]',
    surface3: 'bg-[#1A2236] border border-[rgba(59,130,246,0.08)]',
  }

  const hoverClass = hover
    ? 'hover:border-blue-500/30 hover:bg-[#0f1a2e] transition-all duration-300 cursor-pointer'
    : ''

  return (
    <div
      className={`rounded-xl ${variants[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
