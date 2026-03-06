import { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'snaprx',
    title: 'SnapRx',
    category: 'health',
    description:
      'Medication management platform. OCR prescription scanning, drug interaction checking, pharmacy price comparison. HIPAA-compliant.',
    tags: ['Python', 'FastAPI', 'React Native', 'PostgreSQL', 'GCP', 'OCR'],
    link: 'https://snaprx.co',
  },
  {
    id: 'microbloom',
    title: 'MicroBloom',
    category: 'health',
    description:
      'Parenting app for the first 1,000 days of child development. AI-powered guidance, milestone tracking, 14+ languages.',
    tags: ['React Native', 'Expo', 'Supabase', 'Gemini AI', 'TypeScript'],
    link: 'https://microbloom.life',
  },
  {
    id: 'resonance',
    title: 'Resonance',
    category: 'technical',
    description:
      'Music tracking and discovery platform. "MyAnimeList for Music." Full-stack with social features.',
    tags: ['React', 'FastAPI', 'Full-Stack'],
  },
  {
    id: 'earnings-alpha',
    title: 'Earnings Alpha',
    category: 'technical',
    description:
      'Institutional-grade stock screening tool. Real-time market data, quantitative analysis, financial modeling.',
    tags: ['Python', 'FastAPI', 'Pandas', 'yfinance'],
  },
]
