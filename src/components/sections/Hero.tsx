'use client'

import { motion } from 'framer-motion'
import { NeuralNetwork } from '@/components/ui/NeuralNetwork'
import { bio } from '@/data/bio'
import { contactLinks } from '@/data/contact'

const stats = [
  { label: 'GPA', value: '3.82' },
  { label: 'Projects Shipped', value: '5+' },
  { label: 'Languages', value: '14+' },
  { label: 'Backend Modules', value: '44+' },
]

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
      <NeuralNetwork />
      <div className="absolute inset-0 bg-gradient-to-b from-cream-50/30 via-transparent to-cream-50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-cream-50/50 via-transparent to-cream-50/50 pointer-events-none" />

      <div className="section-container relative z-10 py-24 sm:py-32">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sage-500 font-medium text-sm tracking-wide uppercase mb-3">
              {bio.title}
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-ink-500 mb-4 leading-[1.1]">
              {bio.name}
            </h1>

            <p className="text-lg sm:text-xl text-ink-300 font-light max-w-xl mb-8">
              {bio.summary}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              {contactLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target={link.url.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.url.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/60 backdrop-blur-sm border border-cream-300/50 text-ink-400 hover:text-sage-600 hover:border-sage-300 transition-all"
                >
                  {link.platform}
                  <span className="text-ink-200">&rarr;</span>
                </a>
              ))}
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-sage-500 text-white hover:bg-sage-600 transition-all"
              >
                View Projects
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-wrap gap-6 sm:gap-10"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-sage-600">
                    {stat.value}
                  </div>
                  <div className="text-xs text-ink-300 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
