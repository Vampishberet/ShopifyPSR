# CLAUDE.md — Team Pulsar Shopify Website

## Project Identity

You are building the **Team Pulsar** esports website — a Shopify Liquid theme that must feel **cinematic, premium, and mind-blowing**. This is NOT a generic store. Every pixel must reinforce the brand values: **Excellence, Community, Intent**.

**Three core objectives:**
1. **Sell merchandise** — primary revenue stream (~6 products)
2. **Establish brand credibility** — impress sponsors, partners, esports community
3. **Build community** — attract players, creators, fans

**Reference documents — READ THESE BEFORE ANY WORK:**
- `PRD.md` — Complete product requirements (architecture, features, design system, phases)
- `brand-positioning-document.md` — Brand strategy, voice, identity, values

**Design inspiration:** [Rastr Studios](https://rastr.in/) — dark theme, bold typography, cinematic scroll animations, high contrast

---

## Always Do First

1. **Invoke the `shopify-theme-design` skill** before writing any code, every session, no exceptions.
2. **Read `PRD.md`** — the PRD is the source of truth for all features, layouts, and specs.
3. **Read `brand-positioning-document.md`** — for tone, values, and brand voice.
4. **Check current phase** — do not skip phases. Follow the phased execution plan in this document.

---

## Architecture Rules

### Shopify Theme File Structure

```
PSR/
├── layout/theme.liquid         ← Master layout — EXTEND ONLY, never replace
├── templates/*.json            ← Page templates — define which sections render on each page
├── sections/*.liquid           ← Section components — THE CORE WORK
├── snippets/*.liquid           ← Reusable partials — render inside sections
├── blocks/*.liquid             ← Block-level components
├── assets/                     ← CSS, JS, fonts, images — add new files here
│   ├── pulsar-enhancements.css ← Custom Pulsar CSS — extend this file
│   ├── pulsar-enhancements.js  ← Custom Pulsar JS — extend this file
│   └── marquee.js              ← Existing marquee functionality
├── config/                     ← Theme settings — DO NOT TOUCH
└── locales/                    ← Translations — DO NOT TOUCH
```

### Critical Rules

#### NEVER do these:
- **NEVER** delete or rewrite `layout/theme.liquid` — only extend it
- **NEVER** modify `config/settings_schema.json` or `config/settings_data.json`
- **NEVER** touch any `locales/*.json` files
- **NEVER** break cart, checkout, or product functionality
- **NEVER** use Tailwind CSS — this project uses vanilla CSS
- **NEVER** create a build system — Shopify themes have NO build step
- **NEVER** use `npm`, `webpack`, `vite`, or any bundler
- **NEVER** modify these JS files without extreme caution:
  - `cart-drawer.js`, `cart-icon.js`, `component-cart-items.js`
  - `product-form.js`, `product-card.js`, `variant-picker.js`

#### ALWAYS do these:
- **ALWAYS** add custom CSS to `assets/pulsar-enhancements.css`
- **ALWAYS** add custom JS to `assets/pulsar-enhancements.js` (or new dedicated JS files in `assets/`)
- **ALWAYS** use Shopify Liquid syntax for templates
- **ALWAYS** use JSON template format for `templates/*.json`
- **ALWAYS** use CSS variables from the design system — never hardcode colors
- **ALWAYS** test that existing cart/product functionality works after changes

### How Shopify Templates Work

**Templates** (`templates/*.json`) define which sections appear on a page:

```json
{
  "sections": {
    "hero": {
      "type": "pulsar-hero",
      "settings": {}
    },
    "stats": {
      "type": "pulsar-stats-counter",
      "settings": {}
    }
  },
  "order": ["hero", "stats"]
}
```

**Sections** (`sections/*.liquid`) are the actual components:

```liquid
<div class="pulsar-hero">
  <h1 class="pulsar-hero__title">{{ section.settings.heading }}</h1>
</div>

{% schema %}
{
  "name": "Pulsar Hero",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "TEAM PULSAR"
    }
  ]
}
{% endschema %}
```

**Snippets** (`snippets/*.liquid`) are reusable partials rendered inside sections:

```liquid
{% render 'pulsar-member-ribbon', members: section.settings.member_names %}
```

### Naming Convention

All new Pulsar-specific files must be prefixed with `pulsar-`:
- Sections: `sections/pulsar-hero.liquid`, `sections/pulsar-stats-counter.liquid`
- Snippets: `snippets/pulsar-player-card.liquid`, `snippets/pulsar-member-ribbon.liquid`
- Assets: `assets/pulsar-animations.js`, `assets/pulsar-preloader.css`
- CSS classes: `.pulsar-hero`, `.pulsar-stats`, `.pulsar-ribbon`

This prevents conflicts with existing theme files and makes Pulsar-specific code instantly identifiable.

---

## Design System

### Color Palette — CSS Variables

Add these to `pulsar-enhancements.css` as `:root` variables:

```css
:root {
  --pulsar-black: #000000;
  --pulsar-dark1: #0A0A0C;
  --pulsar-dark2: #111114;
  --pulsar-dark3: #1C1C21;
  --pulsar-gray1: #505055;
  --pulsar-gray2: #8A8A8F;
  --pulsar-gray3: #C8C8CC;
  --pulsar-light1: #E8E8EC;
  --pulsar-white: #FFFFFF;
}
```

**NO PURPLE. NO COLOR. Strictly monochromatic grayscale.**

### Typography

| Font | CSS Variable | Role | Source |
|------|-------------|------|--------|
| Monument Extended | `--font-display` | Hero text, page titles, large statements | Self-hosted: `MonumentExtended-Regular.woff2` (in assets/) |
| Bebas Neue | `--font-secondary` | Section headers, navigation, accent text | Google Fonts |
| Neue Haas Display | `--font-accent` | Subheadings, card titles where Monument is too wide | Self-hosted: `NeueHaasDisplayBold.woff2` (in assets/) |
| Inter | `--font-body` | Paragraphs, descriptions, UI elements | Google Fonts or system |

### Animation Rules

**Libraries (load from CDN):**
- GSAP: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- ScrollTrigger: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`
- Lenis: `https://unpkg.com/lenis@1/dist/lenis.min.js`

**Hard rules:**
- Only animate `transform` and `opacity` (GPU-accelerated)
- Never use `transition-all`
- Use `power2.out` for entrances, `power2.inOut` for transitions
- Stagger everything — never reveal groups simultaneously
- Mobile: reduce to simple fade-ins, disable parallax under 768px
- Use `will-change: transform` sparingly

**Animation inventory (see PRD Section 5.3 for full table):**
- Preloader → Hero: slide up, 0.8s, `power2.inOut`
- Hero H1: fade up from 30px, 0.8s
- Section headings: slide up from 40px, ScrollTrigger at `top 85%`
- Stat counters: count from 0, 2s, `power1.out`
- Product cards: fade up, stagger 0.1s
- Member ribbon: continuous right-to-left CSS `@keyframes`
- Esports panel switch: crossfade 0.4s

### Responsive Breakpoints

```css
/* Desktop: 1200px+ (default) */
/* Tablet */
@media (max-width: 1199px) { }
/* Mobile */
@media (max-width: 767px) { }
```

---

## Concrete Data — Hardcoded Reference

### Member Names (66 — for Commemoration Ribbon)

```
PSR Waffle, PSR Vienna, PSR Chimp, PSR Psych, PSR Rev, PSR Dag, PSR Guppy, PSR Blazify, PSR Casper, PSR Cafe, PSR Acsidius, PSR Yum, PSR Nodaz, PSR Light, PSR Zire, PSR Moxi, PSR Ruin, PSR Staryu, PSR Tuhronto, PSR Hapa, PSR Midniii, PSR Channce, PSR Murlo, PSR Rkei, PSR Molly, PSR GazingNicole, PSR Magnus, PSR Ian, PSR Mika, PSR Njuu, PSR Thunder, PSR CeceNuggets, PSR Kaz, PSR Devox, PSR Klamran, PSR Priince, PSR Ryiax, PSR Gards, PSR Sjay, PSR Adrenaleen, PSR Jid, PSR h6rmed, PSR EXR, PSR Korea, PSR Josh, PSR Prioxy, PSR Fancy, PSR Indra, PSR Mei, PSR Volty, PSR Aminz, PSR Rina, PSR Recrim, PSR Teasers, PSR Vampish, PSR Sieon, PSR Molly, PSR Mikey, PSR Ache, PSR iGOMA, PSR Gary, PSR Lunar, PSR Twunti, PSR Thibaut, PSR Monster
```

### Esports Rosters

**Fortnite (10):** Chimp, Gary, Light, Zire, Tuhronto, Channce, Vero, Ryiax, CeceNuggets, GazingNicole
**Valorant (7):** Mikey, Moe, Psych, Indra, Klamran, Dag, Ian
**Valorant GC (6):** Cafe, Jid, Mei, Rina, Staryu, Vienna — *display as sub-section under Valorant panel*
**Apex Legends (3):** Acsidius, zGato, iGOMA

### Social Media URLs

| Platform | URL |
|----------|-----|
| Twitter/X | https://x.com/PulsarLLC |
| Twitch | https://www.twitch.tv/TeamPulsar |
| Discord | https://discord.gg/TeamPulsar |
| YouTube | https://www.youtube.com/@TeamPulsar |
| Instagram | https://www.instagram.com/pulsarllc/ |
| TikTok | https://www.tiktok.com/@pulsarllc |

### YouTube Embed URLs

- Fortnite montage: `https://www.youtube.com/embed/MoZfg__UPRo`
- Valorant montage: `https://www.youtube.com/embed/3Po08NzKqlc`

### Partner Logos

- **Tipsy Audio:** `TIPSYlogo.png` — white on transparent ✅ (works on dark)
- **OBSBOT:** `OBSBOTBALCK.png` — black on transparent → apply `filter: invert(1)` in CSS

### Key Config Values

| Key | Value |
|-----|-------|
| Domain | `https://teampulsar.net/` |
| Shopify domain | `xrbpcj-hy.myshopify.com` |
| Storefront API token | `2ac17a386c8813c7e2b24f9583b04f54` |
| Collection ID | `509108257088` |
| GA4 Measurement ID | `G-6585D0D1XJ` |
| Contact email | `pulsarclanggs@gmail.com` |
| Twitter embed handle | `@PulsarLLC` |
| Preloader asset | `3d animation for preloader.mp4` (547KB MP4) |
| Return policy | All sales final — no returns for now |

### Key Stats (for animated counters)

- **2M+** — Combined Reach
- **$125K+** — Prize Earnings
- **60+** — Members

---

## Shopify CLI Workflow

### Dev Server (Local Preview)

```bash
cd C:/Users/alans/Desktop/projects/PSR
shopify theme dev --store xrbpcj-hy.myshopify.com
```

This serves the theme locally at `http://127.0.0.1:9292` with hot reload.

### Pushing to Shopify

```bash
shopify theme push --store xrbpcj-hy.myshopify.com
```

### Rules
- Always start the dev server before making changes to verify visually
- Test on the dev server URL after every phase completion
- Do not push to production until a phase is complete and verified

---

## Extension Points in theme.liquid

Add the following to `layout/theme.liquid` (extend, don't replace):

**In `<head>` (after `{{ content_for_header }}`):**
```liquid
<!-- Pulsar Enhancements -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
{{ 'pulsar-preloader.css' | asset_url | stylesheet_tag }}
{{ 'pulsar-enhancements.css' | asset_url | stylesheet_tag }}

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6585D0D1XJ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-6585D0D1XJ');
</script>
```

**Before `</body>`:**
```liquid
<!-- GSAP + ScrollTrigger + Lenis -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://unpkg.com/lenis@1/dist/lenis.min.js" defer></script>
{{ 'pulsar-enhancements.js' | asset_url | script_tag }}

<!-- Preloader (only on first visit) -->
{% render 'pulsar-preloader' %}
```

---

## Phased Execution Plan

### Phase 1: Foundation (DO THIS FIRST)
**Files to create/modify:**
- `assets/pulsar-enhancements.css` — Global CSS variables, typography, base dark theme
- `assets/pulsar-preloader.css` — Preloader-specific CSS (loads in `<head>` for instant display)
- `assets/pulsar-enhancements.js` — GSAP init, ScrollTrigger, Lenis, custom cursor, stat counters
- `assets/pulsar-animations.js` — Dedicated animation controller
- `snippets/pulsar-preloader.liquid` — Preloader HTML (3D logo MP4 video + progress bar)
- `snippets/pulsar-custom-cursor.liquid` — Custom cursor element
- `snippets/pulsar-cookie-consent.liquid` — GDPR cookie banner
- Modify `layout/theme.liquid` — Add font links, CSS/JS includes, GA4, preloader render
- Modify `sections/header.liquid` — Restyle header for Pulsar branding (dark, Monument Extended)
- Modify `sections/footer.liquid` — Add social links, partner logos, newsletter signup

**Verify:** Theme loads with preloader, dark theme applies, header/footer shows Pulsar branding, custom cursor works, GSAP loads.

### Phase 2: Homepage
**Files to create:**
- `sections/pulsar-hero.liquid` — Full-viewport cinematic hero
- `sections/pulsar-brand-statement.liquid` — Short brand paragraph
- `sections/pulsar-stats-counter.liquid` — Animated 2M+ / $125K+ / 60+ counters
- `sections/pulsar-member-ribbon.liquid` — Infinite scroll of 66 member names
- `sections/pulsar-featured-merch.liquid` — 6 Shopify product cards
- `sections/pulsar-video-showcase.liquid` — YouTube embeds grid
- `sections/pulsar-twitter-feed.liquid` — Twitter/X timeline embed
- `sections/pulsar-partners.liquid` — Partner logos row
- `sections/pulsar-cta.liquid` — Final call-to-action
- **IMPORTANT**: Create ALL 9 section files above FIRST before proceeding to the next step.
- *After* section files exist, modify `templates/index.json` to wire all homepage sections in order.

**Verify:** Full homepage scrolls with all sections, animations trigger on scroll, stats count up, ribbon scrolls, merch shows real Shopify products.

### Phase 3: Shop
**Files to modify:**
- `sections/pulsar-featured-merch.liquid` — Enhance product cards (hover effects, quick add)
- `templates/page.merch.json` — Shop page template with announcement bar
- `templates/product.json` — Product detail page enhancements
- `snippets/pulsar-size-guide.liquid` — Size guide modal
- Modify `sections/header-announcements.liquid` — Style announcement bar for drops

**Verify:** Products display correctly, add-to-cart works, cart drawer slides out, announcement bar shows.

### Phase 4: Esports
**Files to create:**
- `sections/pulsar-esports-hero.liquid` — Cinematic esports header
- `sections/pulsar-esports-titles.liquid` — Title selector + dynamic panels
- `snippets/pulsar-player-card.liquid` — Player roster card component
- `snippets/pulsar-tournament-card.liquid` — Tournament highlight card
- Create `templates/page.esports.json` — Unified esports page template

**Verify:** Three title tabs work, panels switch with GSAP crossfade, Valorant GC shows as sub-section, YouTube embeds play.

### Phase 5: About Us
**Files to create:**
- `sections/pulsar-about-hero.liquid` — About page cinematic header
- `sections/pulsar-about-story.liquid` — Origin story section
- `sections/pulsar-about-values.liquid` — Mission, vision, values cards
- `sections/pulsar-about-founders.liquid` — Leadership / From the Owners (placeholder for now)
- Create `templates/page.about.json` — About Us page template

**Verify:** Full About Us page loads with all sections, stats counter reuses shared component.

### Phase 6: Careers, Contact & Partners
**Files to create:**
- `sections/pulsar-careers.liquid` — Job listings + Google Form link
- `sections/pulsar-contact.liquid` — Contact forms (general + partnership)
- `sections/pulsar-partners-page.liquid` — Full partners page
- Create `templates/page.careers.json`
- Modify `templates/page.contact.json`
- Create `templates/page.partners.json`

**Verify:** Forms submit correctly, job listings display, partner logos render.

### Phase 7: Supporting Pages & Global
**Files to create/modify:**
- Modify `templates/404.json` + `sections/main-404.liquid` — Branded "LOST IN THE VOID" 404
- Style legal pages (Privacy, Terms, Shipping) — dark theme headers
- `snippets/pulsar-og-meta.liquid` — Open Graph / Twitter Card meta tags
- Add newsletter functionality to footer

**Verify:** 404 page is branded, legal pages have dark headers, OG tags show in source.

### Phase 8: Polish & QA
- Responsive testing (mobile, tablet, desktop via Shopify CLI dev server)
- Animation performance optimization
- Cross-browser testing
- SEO audit (titles, meta, headings, alt text)
- Lighthouse audit via Chrome DevTools
- Final content population

---

## Agent Orchestration

### Sub-Agents

Six specialized agents live in `.claude/agents/`:

| Agent | Purpose |
|-------|---------|
| **liquid-agent** | Shopify Liquid sections, snippets, templates, JSON schemas |
| **css-animation-agent** | CSS styling, GSAP animations, ScrollTrigger, Lenis, custom cursor, visual effects |
| **content-agent** | Text/data updates: roster names, stats, copy, marquee data, social links |
| **reviewer-agent** | Code review, Shopify compliance, design system audit, Liquid syntax validation |
| **debugger-agent** | Broken layouts, Liquid errors, JS conflicts, Shopify theme issues |
| **integration-agent** | GA4, social embeds, YouTube iframes, Google Forms, newsletter, OG meta tags, cookie consent |

### Delegation Rules

- **Always** delegate Liquid template + section creation → `liquid-agent`
- **Always** delegate CSS, GSAP, animations, visual effects → `css-animation-agent`
- **Always** delegate text/data-only changes → `content-agent`
- **Always** delegate "why is X broken" → `debugger-agent`
- **Always** delegate GA4, YouTube, Twitter, forms, meta tags → `integration-agent`
- **Always** run `reviewer-agent` after significant changes
- **Never** debug inline — always delegate to `debugger-agent`

### Dispatch Strategy

- **Parallel dispatch** when tasks are independent:
  - `liquid-agent` builds section HTML structure + `css-animation-agent` writes CSS simultaneously
  - `content-agent` populates data while `integration-agent` sets up embeds
- **Sequential dispatch** when tasks have dependencies:
  - `liquid-agent` creates section → `css-animation-agent` styles it → `reviewer-agent` audits
  - `integration-agent` embeds Twitter → `css-animation-agent` styles the embed container
- **Always**: `reviewer-agent` runs as the final step after any phase completion

### Shopify CLI Verification

After each phase:
1. Run `shopify theme dev --store xrbpcj-hy.myshopify.com`
2. Open `http://127.0.0.1:9292` in browser
3. Verify the phase requirements are met
4. Check that cart/checkout still works
5. Test mobile layout

---

## Quality Gates

Before moving to the next phase, verify:

- [ ] All new files follow `pulsar-` naming convention
- [ ] CSS uses only `var(--pulsar-*)` variables — no hardcoded colors
- [ ] Animations use only `transform` and `opacity`
- [ ] No `transition-all` anywhere
- [ ] All interactive elements have hover + focus-visible states
- [ ] Mobile responsive (under 768px)
- [ ] Cart drawer still works
- [ ] Product pages still function
- [ ] No console errors in browser DevTools
- [ ] Lighthouse performance score ≥ 80

---

*Team Pulsar — CLAUDE.md — March 2026*
*Read PRD.md and brand-positioning-document.md before ANY work.*
