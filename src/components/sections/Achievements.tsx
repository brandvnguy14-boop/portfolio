'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { achievements } from '@/data/achievements'

export function Achievements() {
  return (
    <SectionWrapper id="achievements" alternate>
      <SectionHeading title="Achievements" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="glass-card p-4 neural-glow text-center"
          >
            <div className="text-xs text-ink-300 mb-1">{a.year}</div>
            <h3 className="font-serif text-sm font-semibold text-ink-500 mb-1">
              {a.title}
            </h3>
            <p className="text-xs text-sage-500">{a.organization}</p>
            {a.description && (
              <p className="text-xs text-ink-300 mt-1">{a.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
