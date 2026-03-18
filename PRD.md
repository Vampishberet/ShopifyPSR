# Team Pulsar — Website Product Requirements Document (PRD)

**Version:** 2.0
**Date:** March 16, 2026
**Status:** Draft — Awaiting Review
**Platform:** Shopify (Liquid Theme)
**Reference:** [Brand Positioning Document](./brand-positioning-document.md)

---

## 1. Executive Summary

This PRD defines the complete requirements for the Team Pulsar website — a Shopify-based platform that serves as the organisation's digital headquarters. The website must accomplish three core objectives simultaneously:

1. **Sell merchandise** (primary revenue stream)
2. **Establish brand credibility** (impress sponsors, partners, and the esports community)
3. **Build community** (attract players, creators, and fans)

The website must feel **cinematic, premium, and mind-blowing** at first glance — matching the production quality of top-tier esports orgs like Dignitas and XSET. Every page should reinforce Pulsar's brand values: **Excellence, Community, and Intent**.

### Design Inspiration

- **[Rastr Studios](https://rastr.in/)** — Dark theme, pixel-art accents, bold typography, cinematic scroll-driven animations, retro-futuristic aesthetic, grid-based layouts with high contrast
- **XSET** — Esports org with strong visual identity and lifestyle branding
- **Dignitas** — Clean, professional esports org website with strong competitive focus

---

## 2. Site Architecture

### 2.1 Primary Navigation

| Page | Purpose | Priority |
|------|---------|----------|
| **Home** | Hero landing, brand impression, merch teaser, social proof | Critical |
| **Shop** | Full merchandise store with product cards, cart, checkout | Critical |
| **Esports** | Competitive titles, rosters, results, tournament history | Critical |
| **About Us** | Org story, mission, values, leadership, stats | High |
| **Careers** | Open positions, application forms | High |

### 2.2 Recommended Additional Pages

| Page | Purpose | Rationale |
|------|---------|-----------|
| **Contact** | General enquiries, partnership/sponsor interest form | Essential for sponsor outreach |
| **Partners** | Dedicated sponsor/partner showcase | Shows legitimacy, attracts new sponsors |

### 2.3 Persistent Elements

- **Preloader:** Branded loading screen on first visit — 3D rotating Pulsar logo with a progress bar animating from 0% to 100%. Once loaded, the preloader slides away to reveal the page with a cinematic entrance animation. This sets the tone immediately.
- **Header:** Logo (top-left), navigation links (center or right), cart icon with item count, mobile hamburger menu
- **Announcement Bar:** Dismissible top banner for merch drops, discount codes, new signings, or limited releases. Primarily used on Shop pages but available site-wide. Uses `header-announcements.liquid` (already exists in theme). Text should be editable via Shopify admin.
- **Footer:** Social links (Twitter/X, Twitch, Discord, YouTube, TikTok, Instagram), partner logos, legal links (Privacy, Terms, Shipping), newsletter signup form, copyright
- **Custom Cursor:** Custom branded cursor visible at all times (not just on hover), with distinct hover/click states
- **Cookie Consent Banner:** GDPR/CCPA-compliant cookie notice. Minimal, dark-themed, non-intrusive. Bottom-of-screen placement. Accept/Decline buttons.

### 2.4 Sitemap

```
[Preloader] → 3D Pulsar Logo + 0-100% Progress Bar

Home
├── Hero Section (full-viewport cinematic)
├── Brand Statement / About Teaser
├── Stats Counter Section (2M+, $125K+, 60+)
├── Member Commemoration Ribbon (infinite scroll of ALL members)
├── Featured Merch Section (Shopify product cards)
├── Video Showcase Section (embedded montages)
├── Twitter/X Feed Embed
├── Partners/Sponsors Section
└── CTA Section

Shop
├── Announcement Bar (drops, discounts)
├── Product Grid (all products)
├── Size Guide (accessible from product pages)
├── Product Detail Pages
├── Cart Drawer (slide-out)
├── Discount Code Support
└── Checkout (Shopify native)

Esports
├── Cinematic Header (brand statement, mission)
├── Title Selector Sidebar (Fortnite / Apex / Valorant)
├── Selected Title Panel
│   ├── Title Story & Mission
│   ├── Media Gallery (graphics, videos, montages)
│   ├── Player Roster Grid
│   ├── Tournament Highlights
│   └── Embedded Twitter/Social Content
└── Overall Achievements / History

About Us
├── Origin Story (Founded April 2020)
├── Mission, Vision & Values
├── Key Statistics (animated counters)
├── Leadership / Ownership
├── Social Media Links
└── Community Culture

Careers
├── Open Positions List
├── Position Detail (role, requirements, responsibilities)
├── Application Form (functional)
└── Success Confirmation

Contact
├── General Enquiry Form
├── Partnership Interest Form
└── Social Links

Partners
├── Current Partner Logos & Descriptions
└── "Partner With Us" CTA

404 Page
└── Branded "lost in the void" page with nav links

Legal Pages (already exist)
├── Privacy Policy
├── Terms of Service
├── Shipping Policy
└── Refund / Return Policy (NEEDS CREATION)
```

---

## 3. User Journeys

Four distinct personas will use this website. Each journey must feel intentional — the site should guide every type of visitor toward their goal with minimal friction.

### 3.1 The Fan / Community Member

**Who:** 16-24 year old gamer who follows Pulsar on Twitter/Discord and wants to rep the brand.

```
Entry: Social media link / Google search
  → Preloader (3D logo + progress bar — instant brand immersion)
  → Homepage Hero ("this feels premium")
  → Scrolls past stats + Member Ribbon (feels part of something bigger)
  → Sees Featured Merch ("I want that")
  → Clicks product → Product Detail → Adds to Cart → Checkout
  → Returns later via Twitter/Discord links
```

**Critical moments:** The hero must make them feel like they've found something exclusive. The Member Ribbon commemorates everyone — fans see real people, not faceless branding. Merch must be directly accessible from the homepage.

### 3.2 The Aspiring Pro / Recruit

**Who:** Competitive player (16-22) looking to join an org, or content creator looking for a home.

```
Entry: Twitter DM / Discord / word-of-mouth link
  → Homepage (scans credibility — stats, partners)
  → Navigates to Esports page (sees rosters, tournament results, media)
  → "These guys are legit" → Navigates to Careers
  → Browses open positions → Clicks "Apply"
  → Fills application form → Success confirmation
```

**Critical moments:** The Esports page must prove Pulsar is competitive and growing. Careers must list real positions and make the application process feel professional, not like a Discord DM.

### 3.3 The Potential Sponsor / Partner

**Who:** Brand manager or marketing director evaluating Pulsar for a partnership deal.

```
Entry: Direct URL from email / pitch deck link
  → Homepage (immediate first impression — "this org is professional")
  → Stats section (reach, earnings — hard numbers)
  → Partners section (sees Tipsy Audio, OBSBOT — social proof)
  → Navigates to About Us (mission, values, story — alignment check)
  → Navigates to Partners page (sees existing partnerships)
  → Clicks "Partner With Us" → Contact form (partnership interest)
```

**Critical moments:** The homepage must communicate scale and professionalism within 5 seconds. Stats must be visible without scrolling far. The Partners page must make it easy to initiate a conversation.

### 3.4 The Curious Visitor

**Who:** Someone who stumbled on the site through search, a social post, or a friend's link.

```
Entry: Google / social media / shared link
  → Preloader ("whoa, what is this?")
  → Homepage Hero (captivated by the cinematic experience)
  → Scrolls through the entire homepage (discovery mode)
  → Clicks through to Esports or About (learns what Pulsar is)
  → Potentially visits Shop (impulse browse)
  → Follows social links → joins Discord/Twitter community
```

**Critical moments:** The preloader and hero must captivate before they have context. The site must answer "what is Pulsar?" within the first two scroll-sections. Social links must be visible for the visitor who wants to connect but isn't ready to buy.

---

## 4. Page-by-Page Requirements

### 4.1 Preloader

The preloader is the **very first thing any visitor sees**. It sets the tone for the entire experience.

#### Specification:
- **Trigger:** Displays on initial site load (first visit or hard refresh). Consider a sessionStorage flag to skip on subsequent same-session navigations.
- **Visual:** 3D rotating Pulsar logo (Alae will provide the animation/asset) centered on a `#000000` black background
- **Progress Bar:** Horizontal bar beneath the logo, animating from 0% to 100%
  - Bar color: White (`#FFFFFF`) on dark background
  - Width: ~40% of viewport, centered
  - Animation: Smooth ease-out curve, should feel organic (not linear)
  - Duration: 2-3 seconds minimum (even if assets load faster, maintain the dramatic timing)
- **Exit Transition:** Once progress hits 100%:
  - Brief hold (0.3s)
  - Preloader slides up (or splits open) to reveal the homepage hero underneath
  - Hero elements begin their entrance animations immediately after the preloader clears
- **Performance:** Preloader itself must load instantly — use lightweight CSS for initial state, load 3D asset async

> [!NOTE]
> Alae has a 3D animation of the Pulsar logo rotating ready to provide. Implementation will need to determine format (WebGL/Three.js, Lottie, video, or GIF).

---

### 4.2 Homepage

The homepage is the **first and most important impression**. It needs to be cinematic, jaw-dropping, and guide visitors toward either shopping or learning more about Pulsar.

#### Sections (in order, top to bottom):

**Section 1: Hero / Full-Screen Cinematic**
- Full-viewport height (100vh)
- Background: Video loop, 3D animation, or cinematic imagery
- Pulsar logo prominently displayed
- Tagline or brand statement as large display text (Monument Extended font)
- Subtle scroll indicator (animated chevron or "scroll" text)
- Entry animation: elements fade/slide in **immediately after preloader exits**
- Hero elements stagger in: logo first (0s) → tagline (0.3s delay) → scroll indicator (0.6s delay)

**Section 2: Brand Statement**
- Short, punchy paragraph about who Pulsar is
- Reference the brand positioning document tone
- Clean typography, generous whitespace

**Section 3: Stats Counter Section**
- Three stat cards in a row: **2M+ Reach** | **$125K+ Earnings** | **60+ Members**
- **Animated number counters** that trigger on scroll (count up from 0)
- Dark cards with high-contrast white text

**Section 4: Member Commemoration Ribbon**
- **Purpose:** To honor and commemorate every person who is part of Team Pulsar — players, staff, content creators. This is about identity; every name matters.
- Infinite horizontal ticker / news-ribbon style animation
- Displays: Every member's gamertag or name, separated by a Pulsar logo icon or bullet
- Typography: Bebas Neue or Monument Extended, medium-large size
- Animation: Smooth, continuous scroll (right-to-left), never stops. Speed: readable but fluid (~50px/s)
- Dual-row option: Consider two rows scrolling in opposite directions for visual density
- Hover behavior: Optionally pause on hover with a subtle highlight on the hovered name
- Data: Full member list to be provided by Alae. Must be easy to update (hardcoded array in a Liquid snippet or JS config file)
- Visual treatment: Slight opacity reduction on non-hovered names (e.g., 60% opacity, 100% on hover)
- The ribbon should feel like a **war memorial wall** — respectful, proud, inclusive

> [!IMPORTANT]
> This is a meaningful feature for Team Pulsar — it reinforces the community value. Every player, creator, and staff member who has been part of the org should be listed. Alae to provide the complete list.

**Section 5: Featured Merch / "GEAR UP" Section**
- Header: "GEAR UP" or similar
- Display **6 Shopify product cards** in a grid (2x3 or 3x2)
- Each card: product image, name, price, "Add to Cart" or "View" button
- Hover effects on cards (scale, shadow, or reveal)
- "Shop All" CTA button linking to /shop
- **Must connect to Shopify product data** (not static)

**Section 6: Video Showcase**
- Section title: "CONTENT" or "WATCH"
- Embedded video players (YouTube/other)
- Grid or carousel of 3-4 featured montage videos
- Clean dark containers, play button overlays
- Videos should be easy to swap/update (YouTube embed URLs stored in a config or Liquid section)

**Section 7: Twitter/X Feed Embed**
- Embedded Twitter timeline or recent tweets
- Styled to match the dark theme
- Shows latest 3-5 posts from [@PulsarLLC](https://x.com/PulsarLLC)

**Section 8: Partners Section**
- Row of partner logos: **Tipsy Audio** (`TIPSYlogo.png` — white on transparent ✅), **OBSBOT** (`OBSBOTBALCK.png` — black on transparent, apply CSS `filter: invert(1)` for white-on-dark)
- Logos displayed on dark background, subtle hover animation
- "Become a Partner" CTA button

**Section 9: Final CTA**
- Large display text CTA
- Buttons: "Shop Now" | "Join Us" (links to Careers)
- Closing brand statement

---

### 4.3 Shop Page

The shop is the **primary revenue stream** and must feel premium and trustworthy.

#### Requirements:
- **Announcement Bar:** Active on shop pages — "NEW DROP — USE CODE PULSAR10 FOR 10% OFF" style messaging, editable via Shopify admin
- **Product Grid:** All ~6 products displayed in clean grid layout (3 columns on desktop)
- **Product Cards:** Image, product name, price, quick "Add to Cart" button
- **Hover Effects:** Image zoom or alternate angle on hover
- **Cart Drawer:** Slide-out cart panel (already exists in Shopify theme)
- **Cart Icon:** Visible in header at all times with item count badge
- **Discount Codes:** Support at checkout (Shopify native feature)
- **Mobile:** Product grid should collapse to 1 or 2 columns
- **Product Detail Pages:** Full product images (multiple angles), description, size selector, Add to Cart, related products

#### Size Guide:
- Accessible from every product page (modal or expandable section)
- Visual size chart with measurements (chest, length, sleeve)
- Size chart should be specific per product type (jersey vs hoodie vs tee)
- Include a "How to Measure" mini-guide with diagram
- Alae to provide sizing data per product

#### Merch Drop Strategy:
- **"Coming Soon" state:** Products can be listed as upcoming before they're available, with a "Notify Me" email capture button
- **Limited drops:** Support for marking products as "Limited Edition" with stock count visibility ("Only 12 left")
- **Restock notifications:** Email capture for out-of-stock items ("Notify me when back in stock")
- **Drop announcements:** Announcement bar updates + newsletter blasts when new products go live

> [!IMPORTANT]
> The shop must connect to live Shopify product data. Product cards should use Shopify's Liquid product objects, not hardcoded content.

---

### 4.4 Esports Page

The marquee competitive page — this is where Pulsar proves it's a **serious, media-rich organisation**. The data on this page is **static content** (not live API data) — but it should be presented with the same cinematic quality as the homepage.

#### Page Philosophy:
This isn't a stats dashboard. It's a **story page**. Each title section tells the story of Pulsar's involvement in that game — why they compete, who represents them, what they've achieved — supported by rich media (videos, graphics, social embeds).

#### Layout:

```
┌─────────────────────────────────────────────────────┐
│              ESPORTS CINEMATIC HEADER                 │
│     "Built to compete. Driven by intent."            │
│     Overall org stats: 3 titles, $125K+, 60+ roster  │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ TITLE    │         SELECTED TITLE PANEL             │
│ SELECTOR │                                          │
│          │  ┌─────────────────────────────────────┐ │
│ ● Fortnite│  │  Title Banner + Mission Statement  │ │
│ ○ Apex   │  │  Media Gallery (videos, graphics)   │ │
│ ○ Valorant│  │  Player Roster Grid                 │ │
│          │  │  Tournament Highlights               │ │
│          │  │  Embedded Twitter/Social Content     │ │
│          │  └─────────────────────────────────────┘ │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│              OVERALL ACHIEVEMENTS SECTION             │
└─────────────────────────────────────────────────────┘
```

#### Title Selector (Left Side):
- Vertical list of competitive titles: **Fortnite** (primary), **Apex Legends**, **Valorant**
- Click to switch which title's content is shown on the right panel
- Active title highlighted with accent treatment (white text, bold, side indicator line)
- **Fortnite should be selected by default**
- On mobile: collapses to horizontal tabs at the top

#### Selected Title Panel (Right Side):

**Title Header / Banner:**
- Game title with a cinematic banner image or graphic
- Pulsar's mission statement for that specific title (1-2 sentences, e.g., "In Fortnite, Pulsar's legacy runs deepest. Our founding title. Our proving ground.")
- Key stats for that title (e.g., "$80K+ earned | 4 FNCS qualifications | 12 active players")

**Concrete roster data per title:**

| Title | Players |
|-------|--------|
| **Fortnite** | Chimp, Gary, Light, Zire, Tuhronto, Channce, Vero, Ryiax, CeceNuggets, GazingNicole |
| **Valorant** | Mikey, Moe, Psych, Indra, Klamran, Dag, Ian |
| **Valorant GC** | Cafe, Jid, Mei, Rina, Staryu, Vienna |
| **Apex Legends** | Acsidius, zGato, iGOMA |

> The **Valorant GC** (Game Changers) roster should appear as a sub-section within the Valorant panel, not as a separate title tab. Label it clearly as "Game Changers Roster" below the main Valorant roster.

**Media Gallery:**
- Grid or carousel of embedded content:
  - YouTube montage/highlight videos
  - Tournament VOD clips
  - Graphic design assets (team posters, announcement graphics)
  - Instagram/TikTok embeds
- This section should be visually dominant — large media, auto-playing previews on hover

**Available YouTube embed links:**
- Fortnite montage: `https://youtu.be/MoZfg__UPRo`
- Valorant montage: `https://youtu.be/3Po08NzKqlc`
- (Apex montage: TBD — leave placeholder)
- Easy to update: media links stored in a Liquid section config or JSON file

**Player Roster:**
- Grid of player cards (name, gamertag, role) — no individual profile pages
- Cards should have a hover state (subtle scale or border glow)
- Role labels: "Pro Player", "Content Creator", "Coach", "Substitute"

**Tournament Highlights:**
- Notable placements displayed as cards or a timeline
- Each entry: tournament name, placement, date, optional Liquipedia link
- Not a full history — just the highlights that matter

**Embedded Social Content:**
- 3-5 embedded Twitter/X posts from [@PulsarLLC](https://x.com/PulsarLLC) relevant to that title
- Clips, announcements, or milestone posts
- Styled to fit the dark theme

#### Smooth transitions when switching between titles (GSAP crossfade or slide animation).

#### Overall Achievements Section (Below Selector):
- Org-wide milestones: Liquipedia listing, total earnings, total roster size
- Timeline or card layout

> [!NOTE]
> All esports page content is static and manually curated. Alae to provide: mission copy per title, media assets, player names/gamertags, tournament highlights, and relevant social post URLs.

---

### 4.5 About Us Page

#### Sections:
1. **Hero/Header** — "ABOUT TEAM PULSAR" with cinematic background
2. **Origin Story** — Founded April 6, 2020, group of high school friends, journey from group to org
3. **Mission & Vision** — Pull directly from Brand Positioning Document
4. **Core Values** — Excellence, Community, Intent — with descriptions and visual treatment
5. **Key Stats** — Animated counter section (same counters as homepage, triggered independently)
6. **Leadership / From the Owners** — A personal section from Pulsar's co-founders
   - Photo(s) of the co-owners (optional, or stylized/silhouette treatment)
   - Names and titles
   - Short personal message or letter from the founders (2-3 paragraphs) — tone: authentic, humanising, not corporate
   - This section answers: "Who's behind Pulsar? Why should I trust these people?"
   - Example format: a quote block or open letter, e.g., *"We started this in high school with a dream. Five years later, that dream has 60+ people carrying it forward..."*
7. **Social Media Links** — All platform links with icons
8. **Community Section** — Description of the Pulsar community culture

---

### 4.6 Careers Page

A **functional recruitment page** where Pulsar can post open positions and receive applications.

#### Requirements:

**Job Listings Section:**
- List of open positions, each showing:
  - Role title (e.g., "Fortnite Pro Player", "Content Creator", "Social Media Manager")
  - Department/category tag
  - Brief description
  - "Apply" button
- Positions should be easily addable/removable (via Shopify blog, metafields, or Liquid sections)

**Application Form (per position):**
- Fields: Full Name, Email, Discord Username, Age, Role Applying For, Portfolio/Social Links (text area), Cover Letter / Why Pulsar? (text area)
- Submit button
- Success confirmation message
- Form submissions sent to a designated email address (or collected via Shopify's form handling / a Shopify app like Formie or Hulk Form Builder)

> [!TIP]
> Consider implementing this as a Shopify page with a custom Liquid section. Each "position" could be a blog post in a "Careers" blog, with the application form as a separate section.

---

### 4.7 Contact Page

- **General Enquiry Form:** Name, Email, Subject, Message
- **Partnership Interest:** Name, Company, Email, Partnership Type (dropdown: Sponsor, Collaboration, Media), Message
- Social media links
- Response time expectation text

---

### 4.8 Partners Page

- Logo grid of current partners (Tipsy Audio, OBSBOT)
- Brief description of each partnership
- "Partner With Us" section with CTA linking to contact form
- Space for future partner additions

---

### 4.9 404 Page

A branded "page not found" experience that maintains the Pulsar aesthetic instead of a generic Shopify 404.

#### Requirements:
- Dark background matching site theme (`#0A0A0C`)
- Large display text: "LOST IN THE VOID" or "404" in Monument Extended
- Subtle animation (floating particles, pulsing logo, or glitch effect)
- Helpful navigation links: Home, Shop, Esports, Contact
- Search bar (optional — Shopify native search)
- Tone: On-brand, slightly playful — not a dead end, but a branded moment
- Custom template file: `templates/404.json` (already exists, needs restyling)

---

### 4.10 Legal & Policy Pages

These pages already exist and contain solid content. They need visual restyling to match the new brand aesthetic.

#### Privacy Policy ✅
- Already comprehensive (Shopify-standard, GDPR/CCPA compliant)
- Needs: Dark theme restyling, proper typography, branded header
- Contact: `pulsarclanggs@gmail.com` — **consider updating to a branded email post-launch**

#### Terms of Service ✅
- Already comprehensive (24 sections, Shopify-standard)
- Needs: Dark theme restyling, branded header
- Note: References `Pulsar LLC` entity and Ridgway, PA 15853 address

#### Shipping Policy ✅
- Already excellent — detailed FAQ format covering tracking, customs, international, damages, returns
- Ships to 170+ countries, US + International estimates provided
- Needs: Dark theme restyling, branded header

#### Refund / Return Policy
- **Decision from Alae:** No return/refund policy for now — all sales are final until further notice
- The Terms of Service reference a "Refund Policy [LINK]" — this link should be removed or replaced with a simple "All Sales Final" statement
- Consider adding a brief "All Sales Final" notice on product pages and at checkout to set expectations
- This can be revisited post-launch when Pulsar is ready to implement returns

> [!CAUTION]
> The missing Refund/Return Policy is a trust and legal issue. No refund policy = abandoned carts and potential disputes. This must be created before or at launch.

---

## 5. Design System

### 5.1 Color Palette

All colors must strictly follow the Brand Positioning Document:

| Token | Hex | Usage |
|-------|-----|-------|
| Black | `#000000` | Deepest backgrounds |
| Dark 1 | `#0A0A0C` | Primary background |
| Dark 2 | `#111114` | Card/section backgrounds |
| Dark 3 | `#1C1C21` | Elevated surfaces, borders |
| Gray 1 | `#505055` | Borders, secondary text |
| Gray 2 | `#8A8A8F` | Metadata, subtle accents |
| Gray 3 | `#C8C8CC` | Body text |
| Light 1 | `#E8E8EC` | Primary text, headlines |
| White | `#FFFFFF` | CTAs, emphasis, maximum contrast |

> **No purple.** The previous brand era is retired.

### 5.2 Typography

| Font | Role | Usage |
|------|------|-------|
| **Monument Extended** | Primary display | Hero text, page titles, large statements |
| **Bebas Neue** | Secondary display | Section headers, navigation, accent text |
| **Neue Haas Display** | Bold accent | Alternate bold display — available in assets as `NeueHaasDisplayBold.woff2`. Use for subheadings or card titles where Monument Extended is too wide |
| **Inter** (or system) | Body | Paragraphs, descriptions, UI elements |

### 5.3 Animation & Motion Design

This is **critical** — visitors must have their minds blown.

#### Animation Inventory (Element-Specific):

| Element | Animation | Trigger | Duration | GSAP Config |
|---------|-----------|---------|----------|-------------|
| Preloader → Hero | Preloader slides up, hero fades in | Page load complete | 0.8s | `gsap.to('.preloader', {yPercent: -100, ease: 'power2.inOut'})` |
| Hero H1 | Fade up + slight translateY | After preloader exits | 0.8s, 0.2s delay | `from({y: 30, opacity: 0})` |
| Hero tagline | Fade up | After H1 | 0.6s, 0.4s delay | `from({y: 20, opacity: 0})` |
| Scroll indicator | Fade in + bounce | After tagline | 0.5s, 0.8s delay | `from({opacity: 0})` + infinite bounce |
| Section headings | Slide up from 40px below | Scroll into viewport | 0.6s | ScrollTrigger, `start: 'top 85%'` |
| Stat counters | Count from 0 to target | Scroll into viewport | 2s | Counter util, ease: `power1.out` |
| Product cards | Fade up, stagger 0.1s | Scroll into viewport | 0.5s each | `stagger: 0.1` |
| Member ribbon | Continuous right-to-left | Always | Infinite | CSS `@keyframes` or `gsap.to({x: '-50%'})` |
| Partner logos | Fade in, stagger | Scroll into viewport | 0.4s each | `stagger: 0.15` |
| Hover: buttons | Scale 1.05 + glow | Mouse enter | 0.2s | CSS transition |
| Hover: cards | Scale 1.02 + shadow lift | Mouse enter | 0.3s | CSS transition |
| Hover: nav links | Underline reveal | Mouse enter | 0.25s | CSS `::after` width transition |
| Esports panel switch | Crossfade content | Title click | 0.4s | `gsap.to / gsap.from` with `opacity` |
| Custom cursor | Follow mouse, scale on hover | Always | 0.1s lerp | `requestAnimationFrame` |

#### Animation Libraries:
- **GSAP (GreenSock)** — Industry standard for scroll-triggered and timeline animations
- **ScrollTrigger** (GSAP plugin) — For scroll-driven reveals
- **Lenis** — For smooth, buttery scrolling
- **Intersection Observer API** — Fallback for lightweight scroll triggers

#### Animation Principles:
- **Stagger everything** — Never reveal a group of elements simultaneously
- **Ease is king** — Use `power2.out` for entrances, `power2.inOut` for transitions
- **Respect the scroll** — Animations should feel like the user is causing them, not watching a movie
- **Mobile reduction** — Reduce to simple fade-ins on mobile; disable parallax on `<768px`
- **Performance** — Use `will-change: transform` sparingly; prefer `transform` and `opacity` only (GPU-accelerated properties)

#### Inspiration from Rastr Studios:
- Grid-based section layouts
- Dark backgrounds with high-contrast white text
- Bold, oversized typography as visual elements
- Smooth scroll-driven transitions between sections

### 5.4 Responsive Design

| Breakpoint | Target |
|------------|--------|
| Desktop | 1200px+ |
| Tablet | 768px – 1199px |
| Mobile | < 768px |

- All pages must be fully responsive
- Mobile navigation: hamburger menu with slide-out drawer
- Shop grid: 2 columns on tablet, 1-2 on mobile
- Esports title selector: collapses to horizontal tabs on mobile
- Animations should be reduced/simplified on mobile for performance
- Touch-friendly targets (minimum 44px)

---

## 6. Technical Requirements

### 6.1 Platform & Stack

| Component | Technology |
|-----------|-----------|
| **CMS/Store** | Shopify (existing) |
| **Templating** | Liquid |
| **Styling** | Custom CSS (extend `pulsar-enhancements.css`) |
| **JavaScript** | Custom JS + GSAP for animations |
| **Fonts** | Monument Extended (self-hosted .woff2), Bebas Neue (Google Fonts), Neue Haas Display (self-hosted .woff2) |
| **Video Embeds** | YouTube iframe / HTML5 video |
| **Social Embeds** | Twitter/X embed widgets |
| **Forms** | Shopify native forms or Shopify app (for Careers) |
| **Analytics** | Google Analytics 4 (ID: `G-6585D0D1XJ`) + Shopify Analytics |
| **Preloader 3D** | MP4 video (`3d animation for preloader.mp4`, 547KB) — use HTML5 `<video>` tag with autoplay, muted, loop |

### 6.2 Existing Assets in Theme

The following assets already exist in `assets/` and should be leveraged:

- `MonumentExtended-Regular.woff` / `.woff2` — Primary display font
- `NeueHaasDisplayBold.woff` / `.woff2` — Bold display font
- `pulsar-enhancements.css` — Custom Pulsar CSS overrides
- `pulsar-enhancements.js` — Custom Pulsar JS
- `marquee.js` — Existing marquee/ribbon functionality
- `base.css` — Shopify theme base styles

### 6.3 Existing Templates

Templates already exist for many pages in `templates/`:
- `index.json` — Homepage
- `page.merch.json` — Merch page
- `page.fortnite.json`, `page.apex.json`, `page.valorant.json` — Title pages
- `page.staff.json` — Staff page
- `page.contact.json` — Contact page
- `product.json`, `product.jersey.json` — Product templates
- `collection.json` — Collection template
- `404.json` — 404 page (needs restyling)
- `page.shipping-policy.json` — Shipping policy page

> [!IMPORTANT]
> Build on top of the existing Shopify theme structure. Do not rebuild from scratch — extend, override, and enhance.

### 6.4 SEO & Social Sharing

**On-Page SEO:**
- Unique `<title>` tags per page
- Meta descriptions on all pages
- Proper heading hierarchy (single `<h1>` per page)
- Semantic HTML5 elements
- Alt text on all images
- Structured data for products (Shopify handles this natively)
- Fast page load (minimize render-blocking resources)
- Lazy loading for images and videos below the fold

**Open Graph / Social Sharing:**
- Custom OG images per page (1200×630px, dark theme, Pulsar branding)
- OG title, description, and image meta tags in `<head>`
- Twitter Card meta tags (`twitter:card`, `twitter:site`, `twitter:image`)
- When someone shares the site on Twitter/Discord, the preview should look intentional and branded — not a generic Shopify card
- Default OG image: Pulsar logo on dark background with tagline
- Per-page overrides: Shop → product imagery, Esports → action shot, About → team photo

### 6.5 Newsletter & Email Capture

- **Footer signup:** Email input field + "Subscribe" button in the global footer
- **Homepage placement:** Optional inline newsletter CTA above the final CTA section
- **Shopify integration:** Use Shopify's built-in customer marketing acceptance, or integrate with Mailchimp/Klaviyo if budget allows
- **Value proposition:** "Stay in the loop — drops, signings, and wins" (not generic "subscribe to our newsletter")
- **Double opt-in:** GDPR compliant
- **Out-of-stock notifications:** Email capture on sold-out products ("Notify me when restocked")

### 6.6 Analytics & Tracking

| Tool | Purpose | Implementation |
|------|---------|---------------|
| **Google Analytics 4** | Traffic, user behavior, demographics | GA4 tag `G-6585D0D1XJ` in `theme.liquid` |
| **Shopify Analytics** | Sales, conversion, cart data | Built-in |
| **Meta Pixel** (optional) | Retargeting, ad performance | If running Facebook/Instagram ads |
| **TikTok Pixel** (optional) | Retargeting on TikTok | If running TikTok ads |
| **Google Search Console** | SEO monitoring, indexing | Verify domain |

> [!TIP]
> At minimum, set up GA4 and Google Search Console. The ad pixels can be added later when/if Pulsar runs paid campaigns.

### 6.7 Performance

- Target: < 3s First Contentful Paint
- Lazy load images and videos
- Optimize custom fonts (preload woff2 files)
- Minimize CSS/JS bundle sizes
- Use `defer` or `async` for non-critical scripts
- GSAP: load only required plugins
- Preloader must not add to perceived load time (it masks it)

---

## 7. Content Requirements

The following content needs to be provided by Team Pulsar:

| Content | Status | Notes |
|---------|--------|-------|
| Product images & descriptions | ✅ In Shopify | ~6 products |
| Product sizing data | ⏳ Needed | Measurements per product for size guide |
| Montage videos (YouTube links) | ✅ Provided | Fortnite: `youtu.be/MoZfg__UPRo`, Valorant: `youtu.be/3Po08NzKqlc` |
| Esports media per title | ✅ Partially | YouTube montages provided; additional graphics TBD |
| Mission copy per title | ⏳ Placeholder | Claude to write draft copy based on brand doc |
| Player roster per title | ✅ Provided | FN: 10, VAL: 7, VAL GC: 6, APEX: 3 (see `Esports Roster.txt`) |
| Tournament highlights | ⏳ Placeholder | Claude builds structure; Alae populates later |
| Full member list (ALL members) | ✅ Provided | 66 gamertags in `Member Names.txt` |
| Partner logos (Tipsy, OBSBOT) | ✅ Provided | `TIPSYlogo.png` (white/transparent), `OBSBOTBALCK.png` (black/transparent — invert to white via CSS) |
| Social media URLs | ✅ Provided | Twitter: @PulsarLLC, Twitch: TeamPulsar, Discord: TeamPulsar, YouTube: @TeamPulsar, IG: @pulsarllc, TikTok: @pulsarllc |
| Open job positions | ⏳ Placeholder | Alae to add via Shopify admin post-launch |
| Hero video/media | ⏳ Needed | Cinematic video loop or reuse preloader 3D animation |
| Preloader 3D logo animation | ✅ Provided | `3d animation for preloader.mp4` (547KB, MP4) |
| Refund / Return policy | ✅ Decided | All sales final — no return policy for now |
| Founder letter / About Us copy | ⏳ Placeholder | Alae will write later — use placeholder text for now |
| OG share images per page | ⏳ Needed | 1200×630px branded cards |
| About Us copy | ✅ In Brand Doc | Pull from brand positioning document |
| Origin story copy | ✅ Partially | Expand from brand doc Section 01 |

#### Product Photography Standards:
- Minimum 3 images per product (front, back, detail/texture)
- Consistent dark background or lifestyle context
- High resolution (2000px+ on longest edge)
- At least 1 lifestyle/model shot per product
- Consistent lighting and color grading across all products

---

## 8. Content Update Workflow

After the site launches, Team Pulsar needs to update content regularly. Here's who does what and how:

| What | Who | How |
|------|-----|-----|
| Add/remove products | Alae / team via Shopify admin | Shopify Admin → Products |
| Update merch prices/stock | Alae / team via Shopify admin | Shopify Admin → Products |
| Add new job posting | Alae / team | Add blog post in "Careers" blog (Shopify Admin → Blog Posts) |
| Update player roster | Developer or Alae | Edit Liquid snippet or JSON config file |
| Update tournament results | Developer or Alae | Edit Liquid snippet or JSON config file |
| Add new partner | Developer or Alae | Add logo to assets + edit Partners section |
| Update member ribbon names | Developer or Alae | Edit names array in marquee config |
| Change announcement bar text | Alae via Shopify admin | Theme Editor → Header → Announcement |
| Update social media links | Developer | Edit footer Liquid snippet |
| Swap homepage videos | Developer or Alae | Edit Video section Liquid snippet (YouTube URLs) |

> [!NOTE]
> The goal is to make as much content as possible editable through the Shopify admin. Where that's not feasible, provide simple config files (JSON or Liquid snippets) with clear comments on how to update.

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| First impression | Visitors say "wow" within 3 seconds | Qualitative feedback |
| Bounce rate | < 40% | Google Analytics 4 |
| Shop conversion rate | > 2% | Shopify analytics |
| Average session duration | > 2 minutes | Google Analytics 4 |
| Mobile responsiveness | 100% functional | Manual testing on iOS/Android |
| Page load speed | < 3s FCP | Lighthouse audit |
| Careers applications | Receiving applications | Form submission tracking |
| Newsletter signups | Growing list | Shopify / Mailchimp |
| Social click-throughs | Measurable traffic to socials | GA4 event tracking |

---

## 10. Development Phases

### Phase 1: Foundation (Priority)
- [ ] Preloader (3D logo + progress bar)
- [ ] Global styles (colors, typography, CSS variables)
- [ ] Header & navigation (all pages linked, cart icon)
- [ ] Announcement bar setup
- [ ] Footer (socials, partners, legal, newsletter signup)
- [ ] Custom cursor implementation
- [ ] GSAP + ScrollTrigger + Lenis setup
- [ ] Cookie consent banner

### Phase 2: Homepage
- [ ] Hero section (cinematic entry, staggered animations)
- [ ] Brand statement section
- [ ] Stats counter section (scroll-triggered number animation)
- [ ] Member Commemoration Ribbon (infinite scroll, all names)
- [ ] Featured merch / "Gear Up" section (Shopify product cards)
- [ ] Video showcase section
- [ ] Twitter/X feed embed
- [ ] Partners section
- [ ] Final CTA section

### Phase 3: Shop
- [ ] Product grid layout (3-col desktop, responsive)
- [ ] Product card hover effects
- [ ] Cart drawer + cart icon with count
- [ ] Product detail page enhancements
- [ ] Size guide (modal per product)
- [ ] Announcement bar for drops/discounts
- [ ] "Coming Soon" / "Notify Me" states
- [ ] Discount code support verification

### Phase 4: Esports
- [ ] Cinematic page header with mission statement
- [ ] Title selector sidebar component
- [ ] Dynamic panel switching (GSAP crossfade)
- [ ] Per-title: banner + mission copy
- [ ] Per-title: media gallery (videos, graphics)
- [ ] Per-title: player roster grid
- [ ] Per-title: tournament highlights
- [ ] Per-title: embedded Twitter/social content
- [ ] Overall achievements section
- [ ] Fortnite content population (priority)

### Phase 5: About Us
- [ ] Cinematic hero section
- [ ] Origin story section
- [ ] Mission/Vision/Values section (visual treatment)
- [ ] Stats counter (reusable component from homepage)
- [ ] Social media links

### Phase 6: Careers, Contact & Partners
- [ ] Careers page: job listings (blog-powered)
- [ ] Careers page: application form
- [ ] Contact page: general + partnership enquiry forms
- [ ] Partners page: logo grid + "Partner With Us" CTA

### Phase 7: Supporting Pages & Global
- [ ] 404 page (branded, "Lost in the Void")
- [ ] Legal pages restyled (Privacy, Terms, Shipping — dark theme)
- [ ] Refund/Return Policy page created
- [ ] OG images and social sharing meta tags
- [ ] GA4 + Search Console setup
- [ ] Newsletter signup (footer + homepage)

### Phase 8: Polish & QA
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Animation performance optimization
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] SEO audit (titles, meta, headings, alt text)
- [ ] Lighthouse performance audit
- [ ] Content population with all real data
- [ ] Final review with Alae

---

## 11. Files to Preserve

> [!CAUTION]
> The following core Shopify theme files should **NOT** be deleted or heavily modified without understanding their dependencies:

- `layout/theme.liquid` — Only extend, don't replace
- `config/settings_schema.json` — Shopify theme settings
- `config/settings_data.json` — Current theme configuration
- All `locales/*.json` — Translation files
- `assets/base.css` — Theme base styles (override in `pulsar-enhancements.css`)
- Cart-related JS files (`cart-drawer.js`, `cart-icon.js`, `component-cart-items.js`)
- Product-related JS files (`product-form.js`, `product-card.js`, `variant-picker.js`)
- Checkout templates (Shopify-managed)

---

## 12. Out of Scope (for v1)

- Individual player profile pages
- Blog / news section
- Product filtering (category, size, price)
- Multi-language support
- Live tournament results / API integration
- E-commerce analytics dashboard
- Member login / accounts (beyond Shopify baseline)
- Email marketing automation (beyond basic newsletter)
- Sound design / audio interactions
- Chat widget / live support

---

## 13. Resolved Questions (Answers from Alae)

All questions have been answered and incorporated into the PRD:

| # | Question | Answer |
|---|----------|--------|
| 1 | Twitter handle | [@PulsarLLC](https://x.com/PulsarLLC) |
| 2 | Careers form submissions | Google Form (free) |
| 3 | Who maintains site post-launch | Alae (co-owner) |
| 4 | Domain | `https://teampulsar.net/` |
| 5 | Budget for Shopify apps | $0 — free tools only |
| 6 | Preloader asset format | MP4 video (`3d animation for preloader.mp4`) |
| 7 | Refund/return policy | No returns — all sales final for now |
| 8 | Founders section | Photos + text — Alae is comfortable with photos |
| 9 | Contact email | Keep `pulsarclanggs@gmail.com` for now |

### Content Assets Provided:

| File | Purpose |
|------|---------|
| `3d animation for preloader.mp4` | Preloader 3D rotating logo (547KB) |
| `Member Names.txt` | 66 gamertags for Commemoration Ribbon |
| `Esports Roster.txt` | Full roster: FN (10), VAL (7), VAL GC (6), APEX (3) |
| `Social media Links.txt` | All 6 platform URLs |
| `YOUTUBE LINKS.txt` | Fortnite + Valorant montage YouTube URLs |
| `TIPSYlogo.png` | Tipsy Audio partner logo (white/transparent) |
| `OBSBOTBALCK.png` | OBSBOT partner logo (black/transparent — CSS invert to white) |
| `billboard.jpg` | Billboard photo (social proof for About Us) |
| `Fortnite vid.mp4` | Raw Fortnite montage (use YouTube embed instead) |
| `Valorant Vid.mp4` | Raw Valorant montage (use YouTube embed instead) |

### Social Media Links:

| Platform | URL |
|----------|-----|
| Twitter/X | https://x.com/PulsarLLC |
| Twitch | https://www.twitch.tv/TeamPulsar |
| Discord | https://discord.gg/TeamPulsar |
| YouTube | https://www.youtube.com/@TeamPulsar |
| Instagram | https://www.instagram.com/pulsarllc/ |
| TikTok | https://www.tiktok.com/@pulsarllc |

---

*Team Pulsar — Website PRD v2.1 — March 2026*
*Confidential — Internal Use Only*
*All open questions resolved. Ready for implementation.*
