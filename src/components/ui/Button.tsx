'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variants = {
  primary:
    'bg-sage-500 text-white hover:bg-sage-600 shadow-lg shadow-sage-500/20 hover:shadow-sage-500/30',
  secondary:
    'bg-cream-200 text-sage-700 hover:bg-cream-300 border border-sage-200',
  ghost:
    'text-sage-600 hover:text-sage-700 hover:bg-sage-50',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({ children, variant = 'primary', href, onClick, size = 'md', className = '' }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  }

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button onClick={onClick} className={classes} {...motionProps}>
      {children}
    </motion.button>
  )
}
