interface BadgeProps {
  children: React.ReactNode
  variant?: 'sage' | 'bronze' | 'copper' | 'neutral'
}

const variants = {
  sage: 'bg-sage-50 text-sage-600 border-sage-200',
  bronze: 'bg-bronze-50 text-bronze-500 border-bronze-200',
  copper: 'bg-copper-50 text-copper-500 border-copper-200',
  neutral: 'bg-cream-200 text-ink-400 border-cream-300',
}

export function Badge({ children, variant = 'sage' }: BadgeProps) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${variants[variant]}`}>
      {children}
    </span>
  )
}
