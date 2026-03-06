'use client'

import { motion } from 'framer-motion'

interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 sm:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-semibold text-ink-500 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl text-ink-300 max-w-2xl mx-auto font-light">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 h-px bg-gradient-to-r from-transparent via-sage-300 to-transparent max-w-xs ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </motion.div>
  )
}
