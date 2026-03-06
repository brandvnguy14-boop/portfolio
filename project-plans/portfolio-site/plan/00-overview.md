# Portfolio Implementation Overview

## Concept
A premium editorial/scientific portfolio for Brandon Nguyen — a pre-medical neuroscience student at the University of Virginia. The site features an interactive neural network visualization, device-adaptive behavior, and polished storytelling.

## Architecture
- Single-page Next.js 16 app with App Router
- 8 content sections in narrative flow: identity -> motivation -> evidence -> work -> ambition -> contact
- Interactive canvas-based neural network in hero background
- Device capability detection for adaptive animation/layout
- Typed content data files for easy updates

## Implementation Phases
1. **Foundation**: Project setup, design system, types, data schemas
2. **Infrastructure**: Device detection, hooks, layout shell, navigation
3. **Content Sections**: Hero, About, Research, Experience, Projects, Achievements, Writing, Contact
4. **Polish**: Animations, accessibility, performance optimization

## Stack
- Next.js 16, TypeScript (strict), Tailwind CSS, Framer Motion 11, Vitest + Testing Library
