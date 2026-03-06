'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { researchInterests } from '@/data/research'

export function Research() {
  return (
    <SectionWrapper id="research">
      <SectionHeading title="Research" />

      <div className="grid md:grid-cols-2 gap-5">
        {researchInterests.map((interest, i) => (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="glass-card p-5 neural-glow"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-serif text-base font-semibold text-ink-500">{interest.title}</h3>
                <p className="text-xs text-sage-500 mt-0.5">{interest.area}</p>
              </div>
              <Badge variant={interest.status === 'active' ? 'sage' : 'bronze'}>
                {interest.status}
              </Badge>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed mb-3">{interest.description}</p>
            {interest.methods && (
              <div className="flex flex-wrap gap-1.5">
                {interest.methods.map((m) => (
                  <span key={m} className="text-xs px-2 py-0.5 bg-cream-200/80 text-ink-300 rounded">{m}</span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
