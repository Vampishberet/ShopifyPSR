---
name: shopify-theme-design
description: Create cinematic, premium Shopify Liquid theme interfaces for the Team Pulsar esports website. Use this skill every session before writing any code. It provides the design philosophy, aesthetic direction, Shopify-specific patterns, and quality standards that make the difference between a generic store and a mind-blowing brand experience.
---

# Shopify Theme Design Skill — Team Pulsar

This skill guides creation of **cinematic, premium Shopify Liquid theme** interfaces for Team Pulsar — an esports organisation that demands visual excellence. Every section, every animation, every pixel must feel intentional.

## Design Philosophy

**This is NOT a store. This is a digital headquarters for an esports brand.**

The user (a gamer, a potential recruit, a sponsor) should feel like they've entered something **exclusive, premium, and alive** the moment the preloader finishes. Think of the experience someone has walking into a Nike flagship store — that's the digital equivalent we're building.

### The Pulsar Aesthetic

- **Dark-mode dominant** — `#0A0A0C` base, never white backgrounds
- **Monochromatic grayscale** — NO color accents. No purple, no blue, no neon. The power comes from contrast, typography, and motion
- **Bold, oversized typography** — Monument Extended at 60px+ for heroes. Text IS the visual element
- **Cinematic scroll** — Each scroll interaction should reveal content with purpose. GSAP-driven, staggered, never cheap fade-ins
- **High contrast** — White text on near-black backgrounds. Borders in `#1C1C21`. No muddy mid-grays for structural elements
- **Intentional whitespace** — Generous padding between sections (120px+ on desktop). Content breathes
- **Depth through layering** — Dark1 → Dark2 → Dark3 creates visual hierarchy without color

### Inspiration: Rastr Studios (rastr.in)
- Grid-based section layouts with asymmetric elements
- Scroll-triggered reveals that feel like the user is causing them
- Typography used as visual elements, not just text
- Dark backgrounds with dramatic white text
- Smooth, buttery scroll feel (Lenis)

## Shopify-Specific Design Patterns

### Section-Based Thinking
Every visual element is a **Shopify section**. Design sections as self-contained components:
- Each section should look complete in isolation
- Sections should stack vertically and create a rhythm
- Use consistent vertical spacing between sections (CSS variable `--pulsar-section-gap`)
- Each section gets its own background treatment (alternating dark1/dark2/dark3)

### Product Cards (Shop/Merch)
```
┌─────────────────────┐
│                     │
│   [Product Image]   │  ← 1:1 aspect ratio, `object-fit: cover`
│                     │  ← Hover: subtle scale(1.03) + overlay
│                     │
├─────────────────────┤
│  PRODUCT NAME       │  ← Bebas Neue, uppercase
│  $XX.XX             │  ← Inter, light gray
│  [Add to Cart]      │  ← pulsar-btn, white bg / dark text
└─────────────────────┘
```
- Card background: `--pulsar-dark2`
- Hover: card lifts (translateY(-4px) + shadow), image scales
- Must use Shopify `{{ product.* }}` Liquid objects — never hardcode

### Hero Sections
- **Always** full viewport height (`min-height: 100vh`) for the homepage hero
- **Always** include a scroll indicator (animated chevron or "SCROLL" text)
- Staggered entry: logo → headline → tagline → scroll indicator (0.2s intervals)
- Background: video loop, 3D animation, or dramatic gradient — never a static flat color

### Stats / Counter Sections
- Large numbers in Monument Extended (72px+)
- Number + label layout (e.g., "2M+" above "COMBINED REACH")
- Count-up animation triggered by ScrollTrigger
- Three-column grid on desktop, stack on mobile

### Member Ribbon
- Infinite horizontal scroll (CSS `@keyframes` or GSAP)
- All 66 names, separated by Pulsar logo icon or bullet (•)
- Bebas Neue or Monument Extended, medium-large
- ~50px/s scroll speed — readable but fluid
- Optional: dual rows scrolling in opposite directions

## Typography Scale

```css
/* Hero / Display */
.pulsar-heading-xxl { font: 900 clamp(3rem, 8vw, 7rem) / 0.95 var(--font-display); letter-spacing: -0.02em; text-transform: uppercase; }

/* Page Titles */
.pulsar-heading-xl { font: 900 clamp(2.5rem, 5vw, 4.5rem) / 1.05 var(--font-display); text-transform: uppercase; }

/* Section Headers */
.pulsar-heading-lg { font: 400 clamp(2rem, 3vw, 3rem) / 1.1 var(--font-secondary); letter-spacing: 0.05em; text-transform: uppercase; }

/* Sub-headers */
.pulsar-heading-md { font: 700 clamp(1.25rem, 2vw, 1.75rem) / 1.2 var(--font-accent); }

/* Body Large */
.pulsar-body-lg { font: 400 1.125rem / 1.7 var(--font-body); color: var(--pulsar-gray3); }

/* Body */
.pulsar-body { font: 400 1rem / 1.6 var(--font-body); color: var(--pulsar-gray2); }

/* Small / Labels */
.pulsar-label { font: 500 0.75rem / 1.4 var(--font-body); letter-spacing: 0.15em; text-transform: uppercase; color: var(--pulsar-gray1); }
```

## Button System

```css
/* Primary button — white on dark */
.pulsar-btn--primary {
  background: var(--pulsar-white);
  color: var(--pulsar-black);
  font: 700 0.875rem / 1 var(--font-secondary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2.5rem;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pulsar-btn--primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255,255,255,0.15);
}

/* Ghost button — outlined */
.pulsar-btn--ghost {
  background: transparent;
  color: var(--pulsar-white);
  border: 1px solid var(--pulsar-gray1);
  /* Same font/padding as primary */
}
.pulsar-btn--ghost:hover {
  border-color: var(--pulsar-white);
  background: rgba(255,255,255,0.05);
}
```

## Spacing System

```css
:root {
  --pulsar-space-xs: 0.5rem;    /* 8px */
  --pulsar-space-sm: 1rem;      /* 16px */
  --pulsar-space-md: 1.5rem;    /* 24px */
  --pulsar-space-lg: 2.5rem;    /* 40px */
  --pulsar-space-xl: 4rem;      /* 64px */
  --pulsar-space-xxl: 7.5rem;   /* 120px — between sections */
  --pulsar-section-gap: var(--pulsar-space-xxl);
}
```

## Quality Checklist (Before Marking Any Section Done)

- [ ] Uses only `var(--pulsar-*)` colors — zero hardcoded hex outside `:root`
- [ ] Typography uses defined font classes — no random `font-size` values
- [ ] Hover states on all interactive elements (with `focus-visible` too)
- [ ] Animations use `transform` + `opacity` only
- [ ] No `transition-all`
- [ ] Responsive at 1200px, 768px, and 480px
- [ ] Content renders from Shopify Liquid objects where applicable (products, collections)
- [ ] Section has valid `{% schema %}` with meaningful settings
- [ ] Section prefixed with `pulsar-`
- [ ] Looks stunning at first glance — if it looks "basic," it's not done

## The Bar

If someone opens this website and doesn't say "wow" — the design has failed. Every section must earn its place. Every animation must feel intentional. Every pixel must serve the brand.

**Move with intent.**
