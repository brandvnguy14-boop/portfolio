# Analysis Phase

## Domain Analysis
See `../analysis/domain-model.md` for full domain model.

## Key Decisions
1. **Single page vs multi-page**: Single page with smooth scroll navigation. Portfolio content fits naturally in a single narrative flow.
2. **Neural network visualization**: Canvas-based for performance. Adapts neuron count and animation intensity based on device capability.
3. **Content architecture**: Typed TypeScript data files, not a CMS. Simpler, faster, no external dependencies.
4. **Font loading**: next/font/google for optimal loading with font-display: swap.
5. **Device detection**: Custom hook using feature detection (matchMedia, touch events) over UA sniffing. SSR-safe with hydration-safe defaults.
