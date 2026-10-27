# Mythos Atlas — Design System & Visual Identity Specification

## 1. Executive Summary & Art Direction Philosophy

Mythos Atlas is envisioned as an immersive, scholarly, yet deeply atmospheric folklore and paranormal archive. The aesthetic departs entirely from sterile modern tech interfaces or garish Halloween horror tropes. Instead, it embodies the gravitas of a centuries-old forbidden cartographic library—an esoteric compendium where Victorian antiquarianism, 19th-century gothic romanticism, and high-contrast ink engraving meet modern, silky web interactivity.

---

## 2. Visual Reference Analysis

The visual identity is derived from the master visual references characterized by:
- **Atmospheric Eeriness:** A world veiled in nocturnal mists, moonlit glens, and ancient stone ramparts.
- **Organic Decay & Botanical Contrast:** Deep mossy earth tones, dried bone, withered parchment, and dark waters punctuated by subtle accents of antique gold and dried blood crimson.
- **Delicate Intaglio & Engraving Style:** Fine line crosshatching reminiscent of Gustave Doré, Albrecht Dürer, and dark romantic illustrators.
- **Chiaroscuro Illumination:** Deep obsidian shadows pierced by flickering lantern light, spectral foxfire, and pale moonlight.

> [!IMPORTANT]
> **Strict Art Direction Rule:** Visual reference images are used exclusively to extract color palettes, tonal curves, typography hierarchy, and atmospheric textures. They are **never** to be reused as universal homepage backgrounds or generic artwork across unrelated folklore entries. Every folklore chronicled in the atlas possesses its own source-backed, culturally authentic iconography.

---

## 3. Design Tokens

### A. Color Palette

| Token Name | Hex Code | HSL Equivalent | Semantic Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-abyss` | `#070a0f` | `hsl(218, 36%, 4%)` | Primary canvas & deepest background layer |
| `--bg-card` | `#0e141b` | `hsl(213, 32%, 8%)` | Elevated surface for cards, panels, and modals |
| `--bg-card-hover`| `#141d27` | `hsl(213, 32%, 12%)` | Interactive hover state for cards |
| `--bg-surface` | `#121820` | `hsl(214, 28%, 10%)` | Secondary surfaces, sidebars, and toolbars |
| `--gold-primary` | `#d4af37` | `hsl(46, 65%, 52%)` | Accent borders, badges, key interactive highlights |
| `--gold-glow` | `rgba(212, 175, 55, 0.25)` | `hsla(46, 65%, 52%, 0.25)` | Volumetric glow and active focus halos |
| `--gold-muted` | `#9c7c2b` | `hsl(43, 57%, 39%)` | Muted metadata icons and secondary borders |
| `--crimson-primary`| `#8a1c22` | `hsl(356, 66%, 33%)` | Warning states, cryptid indicators, delete actions |
| `--spectral-green` | `#8ed081` | `hsl(110, 45%, 66%)` | Ghostly apparitions, verified status badges |
| `--text-primary` | `#f5f0e6` | `hsl(40, 43%, 93%)` | High-contrast parchment cream for reading |
| `--text-secondary`| `#c2bbb0` | `hsl(38, 12%, 72%)` | Secondary body text and descriptive excerpts |
| `--text-muted` | `#7a838e` | `hsl(214, 8%, 52%)` | Metadata timestamps, view counts, and footnotes |
| `--border-dark` | `rgba(255, 255, 255, 0.08)` | — | Subtle dividing lines and structural rules |
| `--border-gold` | `rgba(212, 175, 55, 0.35)` | — | Prominent card borders and active form rings |

### B. Typography Hierarchy

```css
/* Google Fonts / System Serif Stack */
--font-serif: "Cinzel", "Playfair Display", "Georgia", "Times New Roman", serif;
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-reading: "Crimson Pro", "Cardo", "Georgia", serif;
```

- **H1 (Hero & Title):** `clamp(2.4rem, 5vw, 3.8rem)` / `line-height: 1.15` / `font-family: var(--font-serif)` / Antique parchment cream.
- **H2 (Section Header):** `clamp(1.8rem, 3.5vw, 2.4rem)` / `line-height: 1.25` / Letter-spacing: `0.02em`.
- **H3 (Card & Sub-heading):** `1.2rem` / `line-height: 1.35` / Semi-bold.
- **Narrative Body Text:** `1.05rem` / `line-height: 1.8` / `font-family: var(--font-reading)` for high sustained legibility.
- **Metadata & Badges:** `0.75rem` / `letter-spacing: 0.08em` / Uppercase or small-caps styling.

### C. Atmospheric Shadows & Elevation

```css
--shadow-elevation-1: 0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-elevation-2: 0 12px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(212, 175, 55, 0.06);
--shadow-elevation-3: 0 24px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(212, 175, 55, 0.14);
--vignette-radial: radial-gradient(circle at center, transparent 30%, rgba(7, 10, 15, 0.85) 100%);
```

### D. Motion & Interaction Design

1. **Spring-Physics Transitions:** Micro-interactions use Framer Motion springs (`damping: 25`, `stiffness: 150`) rather than linear easing, giving tactile weight to panels and cards.
2. **Opt-in Atmospheric Audio:** Synthesized low-pass ambient wind sounds are strictly **opt-in** (user-click initiated) and never autoplay.
3. **Accessibility (prefers-reduced-motion):** All parallax translations and mist floating animations collapse to zero displacement when `prefers-reduced-motion: reduce` is detected in CSS or via Framer Motion's `useReducedMotion()`.

---

## 4. Reusable Component Guidelines

### A. Folklore Story Cards (`.mythos-card`)
- Aspect-ratio container for imagery with top category badge and bottom geographic pin.
- Dark gradient vignette over the image footer ensuring title text and summary maintain accessible contrast ratios (> 7:1 against background).
- Dedicated interactive indicator badge for entries equipped with parallax/glow features.

### B. Map Explorer & Markers
- Dark cartographic styling using raster OpenStreetMap tiles transformed via CSS inversion and contrast adjustment (`filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%)`).
- Color-coded marker pins corresponding to story categories:
  - Cryptids: Amber gold (`#e5a93b`)
  - Ghost Stories: Spectral cyan (`#79c0ff`)
  - Haunted Places: Amethyst purple (`#d2a8ff`)
  - Urban Legends: Crimson flame (`#ff7b72`)
  - Myths & Legends: Emerald sage (`#8ed081`)
  - Unexplained Phenomena: Celestial white (`#f0f6fc`)

### C. Authentic Imagery & Verification Badges
- Every story details page renders a formal museum dossier caption crediting the artist or institutional repository, licensing terms (CC BY-SA, Public Domain), and direct links to Wikimedia Commons description pages.
