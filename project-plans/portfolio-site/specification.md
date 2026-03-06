# Portfolio Website - Architect Specification

## Purpose
A premium personal portfolio website for a pre-medical neuroscience student. The site communicates scientific curiosity, academic seriousness, research potential, and interdisciplinary identity (neuroscience + medicine + technology). It targets research labs, professors, medical school reviewers, scholarship committees, and collaborators.

## Architectural Decisions

### Stack
- **Framework**: Next.js 14.2.x (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.4.x
- **Animation**: Framer Motion 11.x
- **Testing**: Vitest 1.x + @testing-library/react 14.x + Playwright 1.x
- **Content**: MDX via next-mdx-remote for writing section
- **Components**: Custom design system (no shadcn - keeping full control)

### Design System
- **Palette**: Warm neutral base with deep teal/sage accent. No cliche hospital blue.
  - Background: `#FAFAF8` (warm white), `#F5F3EF` (cream), `#1A1A1A` (dark)
  - Primary: `#2D6A5A` (deep sage/teal)
  - Secondary: `#8B7355` (warm bronze)
  - Accent: `#C4956A` (warm copper)
  - Text: `#1A1A1A`, `#4A4A4A`, `#7A7A7A`
- **Typography**: Inter (body) + Playfair Display (headings) - editorial feel
- **Motion**: Restrained, purposeful. Respects prefers-reduced-motion.

### Architecture
- Single-page scrolling site with smooth section navigation
- Content driven by typed data files (easy to update)
- Device-adaptive behavior via custom hook
- SSR-safe with no hydration mismatches

## Project Structure
```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    layout/
      Navigation.tsx
      Footer.tsx
      SectionWrapper.tsx
    sections/
      Hero.tsx
      About.tsx
      Research.tsx
      Experience.tsx
      Projects.tsx
      Achievements.tsx
      Writing.tsx
      Contact.tsx
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      Timeline.tsx
      SectionHeading.tsx
      AnimatedText.tsx
  hooks/
    useDeviceCapability.ts
    useScrollSpy.ts
    useReducedMotion.ts
  lib/
    device-detection.ts
    constants.ts
  data/
    bio.ts
    experiences.ts
    projects.ts
    research.ts
    achievements.ts
    writing.ts
    contact.ts
  types/
    index.ts
__tests__/
  hooks/
    useDeviceCapability.test.ts
  components/
    Navigation.test.tsx
    Hero.test.tsx
    About.test.tsx
    ...
  lib/
    device-detection.test.ts
  e2e/
    navigation.spec.ts
    responsive.spec.ts
```

## Formal Requirements

### REQ-001: Premium First Impression
- [REQ-001.1] Hero section communicates identity within first viewport
- [REQ-001.2] CTA buttons navigate correctly
- [REQ-001.3] Layout polished across mobile/tablet/desktop
- [REQ-001.4] Typography creates editorial/scientific aesthetic
- [REQ-001.5] Page loads in under 3 seconds on 3G

### REQ-002: Device-Adaptive Experience
- [REQ-002.1] Detect touch-capable environments safely
- [REQ-002.2] Distinguish mobile/tablet/desktop layouts
- [REQ-002.3] Reduce animation complexity for constrained devices
- [REQ-002.4] Replace hover-only interactions on touch devices
- [REQ-002.5] Avoid hydration mismatch during SSR
- [REQ-002.6] Use feature detection over UA sniffing

### REQ-003: Academic and Research Credibility
- [REQ-003.1] Research section supports structured entries with topics, methods, questions
- [REQ-003.2] Experience section supports clinical, lab, leadership, volunteer categories
- [REQ-003.3] Achievements displayed with hierarchy and clarity
- [REQ-003.4] Projects section shows interdisciplinary range

### REQ-004: Performance and Accessibility
- [REQ-004.1] Lighthouse performance score > 90
- [REQ-004.2] Keyboard navigation works for all interactive elements
- [REQ-004.3] Color contrast meets WCAG AA
- [REQ-004.4] Motion respects prefers-reduced-motion
- [REQ-004.5] Semantic HTML throughout
- [REQ-004.6] Skip-to-content link present

### REQ-005: Content Architecture
- [REQ-005.1] All content in typed data files
- [REQ-005.2] Writing section supports MDX entries
- [REQ-005.3] Content easily editable without code changes
- [REQ-005.4] No lorem ipsum in final output

### REQ-006: Navigation
- [REQ-006.1] Smooth scroll between sections
- [REQ-006.2] Active section indicator
- [REQ-006.3] Mobile hamburger menu
- [REQ-006.4] Keyboard accessible navigation

## Data Schemas

### Bio
```typescript
interface Bio {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  story: string;
  interests: string[];
  goals: string[];
  values: string[];
}
```

### Experience
```typescript
interface Experience {
  id: string;
  title: string;
  organization: string;
  category: 'clinical' | 'research' | 'leadership' | 'volunteer' | 'teaching' | 'community';
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}
```

### Project
```typescript
interface Project {
  id: string;
  title: string;
  category: 'research' | 'technical' | 'writing' | 'interdisciplinary';
  description: string;
  tags: string[];
  link?: string;
  image?: string;
}
```

### Achievement
```typescript
interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: number;
  category: 'award' | 'scholarship' | 'recognition' | 'competition' | 'academic';
  description?: string;
}
```

### ResearchInterest
```typescript
interface ResearchInterest {
  id: string;
  title: string;
  area: string;
  description: string;
  questions: string[];
  methods?: string[];
  status: 'active' | 'completed' | 'planned';
}
```

### WritingEntry
```typescript
interface WritingEntry {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: 'neuroscience' | 'medicine' | 'ethics' | 'research' | 'personal';
}
```

### ContactLink
```typescript
interface ContactLink {
  platform: string;
  url: string;
  icon: string;
  label: string;
}
```

## Constraints
- No external analytics or tracking without consent
- No unnecessary third-party dependencies
- All images must have alt text
- No auto-playing media
- Content must be screen-reader friendly

## Performance Requirements
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Total bundle size < 200KB gzipped (excluding images)
