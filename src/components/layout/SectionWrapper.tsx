'use client'

import { ReactNode } from 'react'

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
  alternate?: boolean
}

export function SectionWrapper({ id, children, className = '', alternate = false }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`section-padding ${alternate ? 'bg-cream-100/50' : ''} ${className}`}
    >
      <div className="section-container">{children}</div>
    </section>
  )
}
