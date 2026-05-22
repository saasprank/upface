import { type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface2' | 'surface3'
  hover?: boolean
}

export default function Card({ variant = 'default', hover = false, children, className = '', ...props }: CardProps) {
  const variants = {
    default: 'bg-surface border border-[rgba(59,130,246,0.12)] shadow-soft',
    surface2: 'bg-surface-2 border border-[rgba(15,23,42,0.06)]',
    surface3: 'bg-surface-2 border border-[rgba(59,130,246,0.08)]',
  }

  const hoverClass = hover
    ? 'hover:border-blue-500/30 hover:bg-surface-2 transition-all duration-300 cursor-pointer'
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
