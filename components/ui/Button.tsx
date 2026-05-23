'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none font-[Inter,sans-serif]'

    const variants = {
      primary: 'btn-primary-premium text-white active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-[rgba(59,130,246,0.12)] text-muted hover:text-theme border border-transparent hover:border-[rgba(59,130,246,0.2)]',
      outline: 'bg-transparent border border-[#1E2A3E] hover:border-[rgba(59,130,246,0.4)] text-[#3B82F6] hover:bg-[rgba(59,130,246,0.08)]',
    }

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-7 py-3.5 gap-2.5',
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span>Chargement...</span>
          </>
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
