# brans.life

Brandon Nguyen's personal site. Built with Astro, Tailwind, and MDX. Deployed to Vercel.

## Getting started

```bash
pnpm install
pnpm dev
```

---

## Adding a new post

Create a new `.mdx` file in `src/content/writing/`:

```
src/content/writing/your-slug.mdx
```

**Required frontmatter:**

```yaml
---
title: "Your Post Title"
date: 2024-12-01        # YYYY-MM-DD
type: essay             # or: poetry
dek: "Optional 8-word descriptor shown in the list view."
draft: false            # set true to hide from production
---
```

**MDX components available:**

| Component | Usage |
|---|---|
| `<PullQuote>` | Pull-quoted passage, styled with an amber rule |

**Footnotes** use standard GFM syntax — no component needed:

```
A claim worth footnoting.[^1]

[^1]: The footnote content, at the bottom of the file.
```

**Poetry formatting:** Set `type: poetry` and use blank lines between stanzas. Lines within a stanza sit on consecutive lines in the source. The CSS handles `white-space: pre-wrap` and removes text-indent.

---

## Theme toggle

The toggle is in `src/components/ThemeToggle.astro`. On click, it:

1. Reads the current theme from `document.documentElement.dataset.theme`
2. Triggers `document.startViewTransition()` to capture a screenshot of the current state
3. Switches the theme by updating `data-theme` on `<html>` and writing to `localStorage`
4. Animates a `circle()` clip-path expanding from the exact click coordinates on the incoming screen

The animation easing and duration live at the top of the script block. The `prefers-reduced-motion` check skips the animation entirely and applies the theme directly.

On first visit, the theme defaults to the user's `prefers-color-scheme`. Subsequent visits read from `localStorage`.

---

## Design tokens and easing curves

Everything lives in `src/styles/global.css`. The relevant sections:

**Easing:**
```css
--ease-enter: cubic-bezier(0.16, 1, 0.3, 1);   /* entrances */
--ease-exit:  cubic-bezier(0.7, 0, 0.84, 0);    /* exits */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* springy */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);    /* UI micro-interactions */
```

**Colors (light / dark):**
```css
--color-bg          /* page background */
--color-surface     /* elevated surface (code blocks, etc.) */
--color-text        /* primary text */
--color-text-muted  /* secondary text, metadata */
--color-accent      /* amber: #c47a2e light / #d4892a dark */
--color-border      /* subtle borders */
--color-border-strong /* stronger borders */
```

**Typography:**
```css
--font-display: 'Fraunces Variable', Georgia, serif;
--font-mono:    'JetBrains Mono', 'Courier New', monospace;
--measure: 65ch;   /* max line length for prose */
```

Fraunces is a variable font with an optical size axis (`opsz`). The codebase uses `font-variation-settings: 'opsz' N` at key sizes to get the right character:
- `opsz 144` → hero display (huge, wide)
- `opsz 72` → page titles
- `opsz 40` → pull-quotes
- `opsz 18` → body / list titles
- `opsz 60` → article subheadings

---

## Deployment

Connected to Vercel via `.vercel/project.json`. Push to `main` deploys automatically. No additional configuration needed — Astro's Vercel adapter is not required for static output (the default).

To force a static build locally:

```bash
pnpm build
pnpm preview
```
