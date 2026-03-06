export interface Bio {
  name: string
  title: string
  tagline: string
  summary: string
  story: string
  interests: string[]
  goals: string[]
  values: string[]
  image?: string
}

export interface Experience {
  id: string
  title: string
  organization: string
  category: 'clinical' | 'research' | 'leadership' | 'volunteer' | 'teaching' | 'community'
  startDate: string
  endDate?: string
  description: string
  highlights: string[]
}

export interface Project {
  id: string
  title: string
  category: 'research' | 'technical' | 'writing' | 'interdisciplinary' | 'health'
  description: string
  longDescription?: string
  tags: string[]
  link?: string
  image?: string
}

export interface Achievement {
  id: string
  title: string
  organization: string
  year: number
  category: 'award' | 'scholarship' | 'recognition' | 'competition' | 'academic'
  description?: string
}

export interface ResearchInterest {
  id: string
  title: string
  area: string
  description: string
  questions: string[]
  methods?: string[]
  status: 'active' | 'completed' | 'planned'
}

export interface WritingEntry {
  id: string
  title: string
  date: string
  excerpt: string
  content: string
  tags: string[]
  category: 'neuroscience' | 'medicine' | 'ethics' | 'research' | 'personal'
}

export interface ContactLink {
  platform: string
  url: string
  icon: string
  label: string
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface DeviceCapabilities {
  type: DeviceType
  isTouch: boolean
  prefersReducedMotion: boolean
  screenWidth: number
  isHighPerformance: boolean
}

export interface NavSection {
  id: string
  label: string
}
