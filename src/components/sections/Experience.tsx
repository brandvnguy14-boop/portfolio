'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { experiences } from '@/data/experiences'

const categoryColors: Record<string, 'sage' | 'bronze' | 'copper' | 'neutral'> = {
  clinical: 'sage',
  research: 'sage',
  leadership: 'copper',
  volunteer: 'bronze',
  teaching: 'neutral',
  community: 'bronze',
}

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month) - 1]} ${year}`
}

export function Experience() {
  return (
    <SectionWrapper id="experience">
      <SectionHeading title="Experience" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass-card p-5 neural-glow"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={categoryColors[exp.category]}>
                {exp.category}
              </Badge>
              <span className="text-xs text-ink-300">
                {formatDate(exp.startDate)}{exp.endDate ? ` - ${formatDate(exp.endDate)}` : ' - Now'}
              </span>
            </div>

            <h3 className="font-serif text-base font-semibold text-ink-500 mb-0.5">
              {exp.title}
            </h3>
            <p className="text-xs text-sage-500 mb-2">{exp.organization}</p>
            <p className="text-xs text-ink-400 leading-relaxed">
              {exp.description}
            </p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
