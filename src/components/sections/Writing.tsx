'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'
import { writingEntries } from '@/data/writing'

export function Writing() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <SectionWrapper id="writing" alternate>
      <SectionHeading
        title="Writing & Reflections"
        subtitle="Thinking out loud about science, medicine, and building"
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {writingEntries.map((entry, i) => (
          <motion.article
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass-card overflow-hidden neural-glow"
          >
            <button
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className="w-full text-left p-6 sm:p-8"
              aria-expanded={expandedId === entry.id}
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="sage">{entry.category}</Badge>
                <span className="text-xs text-ink-300">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-ink-500 mb-2">
                {entry.title}
              </h3>
              <p className="text-ink-400 text-sm sm:text-base leading-relaxed">
                {entry.excerpt}
              </p>

              <span className="inline-block mt-4 text-sm text-sage-500 font-medium">
                {expandedId === entry.id ? 'Read less' : 'Read more'} &rarr;
              </span>
            </button>

            <AnimatePresence>
              {expandedId === entry.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 sm:px-8 pb-8 pt-0 border-t border-cream-300/30">
                    <div className="prose prose-sm max-w-none mt-6 text-ink-400 leading-relaxed space-y-4">
                      {entry.content.split('\n\n').map((p, pi) => (
                        <p key={pi}>{p}</p>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="neutral">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}
