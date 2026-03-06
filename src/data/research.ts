import { ResearchInterest } from '@/types'

export const researchInterests: ResearchInterest[] = [
  {
    id: 'oral-health',
    title: 'Oral Health & Well-Being',
    area: 'Biomedical Research',
    description:
      'Cross-sectional analysis on the relationship between oral health, self-perception, and overall well-being. Conducted at Saigon Dental Clinic.',
    questions: [
      'How does oral health status affect self-perception and quality of life?',
      'What systemic barriers drive oral health disparities in Southeast Asia?',
    ],
    methods: ['Cross-sectional study', 'Statistical analysis', 'Survey design'],
    status: 'active',
  },
  {
    id: 'health-tech',
    title: 'Technology-Mediated Healthcare',
    area: 'Health Informatics',
    description:
      'Building software that reduces barriers to medication access and health literacy. Directly implemented through SnapRx and MicroBloom.',
    questions: [
      'How can OCR and AI reduce friction in prescription workflows?',
      'What design patterns make health tools accessible across literacy barriers?',
    ],
    methods: ['Full-stack development', 'OCR/Computer Vision', 'User research'],
    status: 'active',
  },
]
