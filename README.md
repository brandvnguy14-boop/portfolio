# Brandon Nguyen — Portfolio

A premium personal portfolio for a pre-medical neuroscience student at the University of Virginia. Features an interactive neural network visualization, device-adaptive behavior, and editorial design.

## Concept

The site tells a narrative: **identity -> motivation -> evidence -> work -> ambition -> contact**. It communicates scientific curiosity, academic seriousness, and interdisciplinary identity (neuroscience + medicine + technology).

### Interactive Neural Network
The hero section features a live canvas-based neural network with:
- Neurons that drift, connect, and fire synaptic pulses
- Mouse/touch interaction that activates nearby neurons
- Traveling pulse animations along synaptic connections
- Device-adaptive complexity (fewer neurons on mobile, none with reduced motion)

## Stack

- **Next.js 16** — App Router, static export
- **TypeScript** — strict mode
- **Tailwind CSS** — custom design system (cream, sage, bronze, copper palette)
- **Framer Motion 11** — scroll-triggered animations, layout animations
- **Vitest + Testing Library** — 39 behavioral tests
- **next/font** — optimized Inter + Playfair Display loading

## Getting Started

```bash
npm install
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm test         # Run test suite
```

## Device Detection

The portfolio detects device capabilities and adapts:

| Feature | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Neural network neurons | 25 | 40 | 60 |
| Connection distance | 120px | 150px | 180px |
| Animation intensity | Minimal | Moderate | Full |
| Synapse firing rate | Low | Medium | High |

**Strategy:**
- Feature detection via `matchMedia`, `navigator.maxTouchPoints`, `ontouchstart`
- Screen width breakpoints: mobile < 768 < tablet < 1024 < desktop
- Performance detection via `hardwareConcurrency` and `deviceMemory`
- `prefers-reduced-motion` fully respected (disables all animation)
- SSR-safe: returns desktop defaults during server rendering, updates on client mount to avoid hydration mismatch

**No UA sniffing.** All detection uses browser capability APIs.

## Customizing Content

All content lives in typed data files in `src/data/`:

| File | Content |
|------|---------|
| `bio.ts` | Name, title, story, interests, goals, values |
| `experiences.ts` | Timeline entries (clinical, research, leadership, etc.) |
| `projects.ts` | Project cards with descriptions and links |
| `research.ts` | Research interests with questions and methods |
| `achievements.ts` | Awards, scholarships, recognitions |
| `writing.ts` | Essay/reflection entries with full content |
| `contact.ts` | Contact links (email, GitHub, etc.) |

Each file exports typed data. Edit the arrays to update content — no code changes needed elsewhere.

Content marked with `/* PLACEHOLDER */` comments should be replaced with your actual information.

## Project Structure

```
src/
  app/            — Next.js App Router (layout + page)
  components/
    layout/       — Navigation, Footer, SectionWrapper
    sections/     — Hero, About, Research, Experience, Projects, Achievements, Writing, Contact
    ui/           — Button, Card, Badge, SectionHeading, NeuralNetwork
  hooks/          — useDeviceCapability, useScrollSpy, useReducedMotion
  lib/            — device-detection, constants
  data/           — All content data files
  types/          — TypeScript interfaces
  __tests__/      — Vitest behavioral tests
```

## Design System

- **Palette**: Warm cream base, deep sage/teal primary, bronze/copper accents
- **Typography**: Playfair Display (serif headings) + Inter (sans body)
- **Glass cards**: Semi-transparent with backdrop blur
- **Neural glow**: Subtle sage-tinted box shadows
- **Reduced motion**: All animations disabled when user prefers
