'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects } from '@/data/projects'

export function Projects() {
  return (
    <SectionWrapper id="projects" alternate>
      <SectionHeading title="Projects" />

      <div className="grid sm:grid-cols-2 gap-5">
        {projects.map((project, i) => (
          <motion.a
            key={project.id}
            href={project.link || undefined}
            target={project.link ? '_blank' : undefined}
            rel={project.link ? 'noopener noreferrer' : undefined}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            className={`glass-card p-5 neural-glow flex flex-col group ${project.link ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg font-semibold text-ink-500 group-hover:text-sage-600 transition-colors">
                {project.title}
              </h3>
              {project.link && (
                <span className="text-sage-400 group-hover:text-sage-600 transition-colors text-sm">
                  &rarr;
                </span>
              )}
            </div>

            <p className="text-sm text-ink-400 leading-relaxed mb-4 flex-1">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-cream-200/80 text-ink-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </SectionWrapper>
  )
}
