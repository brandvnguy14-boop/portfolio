'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/layout/SectionWrapper'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Badge } from '@/components/ui/Badge'

const techStack = [
  { category: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'Lua', 'SQL'] },
  { category: 'Frontend', items: ['React Native', 'Next.js', 'Expo', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', items: ['FastAPI', 'SQLAlchemy', 'Celery', 'Redis', 'Supabase'] },
  { category: 'Data / ML', items: ['Pandas', 'yfinance', 'Streamlit'] },
  { category: 'Cloud', items: ['GCP', 'Firebase', 'Vercel', 'Docker', 'Railway'] },
  { category: 'Tools', items: ['Git', 'PostgreSQL', 'SQLite', 'Alembic', 'Vitest'] },
]

const education = [
  {
    school: 'University of Virginia',
    detail: 'Neuroscience | 3.82 GPA | Dean\'s List',
    date: 'Aug 2025 - Present',
    orgs: ['Vietnamese Student Association', 'Grace Christian Fellowship', 'Global Medical Missions Alliance', 'AMA'],
  },
  {
    school: 'Freedom High School',
    detail: '4.17 GPA | National Merit Scholar | AP Scholar',
    date: 'Graduated May 2025',
    orgs: ['ML Club President', 'NHS', 'Robotics', 'DECA'],
  },
]

export function About() {
  return (
    <SectionWrapper id="about">
      <SectionHeading title="Background" />

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300 mb-4">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-5 neural-glow"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-serif font-semibold text-ink-500">{edu.school}</h4>
                  <span className="text-xs text-ink-300 shrink-0">{edu.date}</span>
                </div>
                <p className="text-sm text-sage-500 mb-3">{edu.detail}</p>
                <div className="flex flex-wrap gap-1.5">
                  {edu.orgs.map((org) => (
                    <span key={org} className="text-xs px-2 py-0.5 bg-cream-200/80 text-ink-300 rounded">
                      {org}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300 mb-4">Tech Stack</h3>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-5 neural-glow"
          >
            <div className="space-y-4">
              {techStack.map((group) => (
                <div key={group.category}>
                  <div className="text-xs font-medium text-ink-400 mb-2">{group.category}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <Badge key={item} variant="sage">{item}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
