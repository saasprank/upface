import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface2' | 'surface3'
  hover?: boolean
}

export default function Card({ variant = 'default', hover = false, children, className = '', ...props }: CardProps) {
  const variants = {
    default: 'bg-surface border border-[#1E2A3E] shadow-soft',
    surface2: 'bg-surface-2 border border-[#1E2A3E]',
    surface3: 'bg-surface-2 border border-[rgba(59,130,246,0.15)]',
  }

  const hoverClass = hover
    ? 'hover:border-blue-500/40 hover:bg-surface-2 transition-all duration-300 cursor-pointer'
    : ''

  return (
    <div
      className={`rounded-2xl ${variants[variant]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
