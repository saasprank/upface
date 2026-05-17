'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary: 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98]',
      ghost: 'bg-transparent hover:bg-white/5 text-[#8B9DC3] hover:text-[#EEF2FF] border border-transparent hover:border-white/10',
      outline: 'bg-transparent border border-blue-500/30 hover:border-blue-500/70 text-blue-400 hover:text-blue-300 hover:bg-blue-500/5',
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
