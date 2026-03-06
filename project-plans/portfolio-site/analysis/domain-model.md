# Domain Model

## Entity Relationships

```
Bio (singleton)
  |-- has many -> Experiences
  |-- has many -> Projects
  |-- has many -> Achievements
  |-- has many -> ResearchInterests
  |-- has many -> WritingEntries
  |-- has many -> ContactLinks

Experience
  |-- categorized by: clinical | research | leadership | volunteer | teaching | community
  |-- ordered by: startDate (descending)

Project
  |-- categorized by: research | technical | writing | interdisciplinary
  |-- tagged with: string[]

Achievement
  |-- categorized by: award | scholarship | recognition | competition | academic
  |-- ordered by: year (descending)

ResearchInterest
  |-- has status: active | completed | planned
  |-- has questions: string[]
  |-- has methods: string[]

WritingEntry
  |-- categorized by: neuroscience | medicine | ethics | research | personal
  |-- ordered by: date (descending)
```

## User Journeys

### Primary Journey: Academic Reviewer
1. Lands on hero -> reads identity + positioning
2. Scrolls to About -> understands motivation and story
3. Reviews Research -> evaluates academic depth
4. Checks Experience -> assesses well-roundedness
5. Views Achievements -> confirms caliber
6. Contact -> reaches out

### Secondary Journey: Research Collaborator
1. Lands on hero -> identifies field
2. Jumps to Research -> finds aligned interests
3. Reviews Projects -> evaluates capabilities
4. Contact -> proposes collaboration

### Tertiary Journey: Mobile Quick Scan
1. Hero -> quick identity check
2. Swipes through key sections
3. Downloads CV
4. Contacts via email

## State Transitions

### Navigation State
- idle -> scrolling -> section-in-view -> idle
- mobile: collapsed -> menu-open -> navigating -> collapsed

### Device Detection State
- SSR: defaults (desktop, no-touch, full animations)
- Client hydration: detect actual capabilities
- Render: apply adaptive behavior without visible flash

## Adaptive Device Behavior Rules

| Capability | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Animation intensity | minimal | moderate | full |
| Parallax effects | off | subtle | full |
| Hover interactions | tap alternatives | tap + hover | hover |
| Navigation | hamburger | hamburger or rail | horizontal bar |
| Image loading | lazy, smaller | lazy, medium | eager for above-fold |
| Layout density | single column | 2 columns | 3+ columns |

## Edge Cases
- JavaScript disabled: content still readable via SSR
- Very slow connection: critical content loads first
- Screen reader: full semantic navigation
- Print: clean layout for CV-like output
- Extremely wide screens: max-width container
- Extremely narrow screens (< 320px): graceful squeeze
