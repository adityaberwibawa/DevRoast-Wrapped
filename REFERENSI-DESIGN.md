---
version: alpha
name: "Anytype"
website: "https://anytype.io"
description: >-
  A local-first workspace tool that pairs Inter at ultra-light weight 300 with Riccionets — a quirky display serif — for headline moments that would look at home in a literary magazine. The above-fold hero renders "A safe haven" in jet-black Inter and then breaks to a coral-salmon line in Riccionets at 96px, landing on a white canvas that bleeds into a pastel gradient of warm cream, mint, and lavender. Zero chromatic brand color; the palette is structural neutral with a single mint-teal accent and pastel gradient stop. Data sovereignty shapes every copy decision: "Your data stays on your device" is not a footnote but the headline argument.

seo:
  title: "Anytype Design System for React — serif-sans split, gradient pastel, 15 components"
  metaDescription: "Anytype's marketing system pairs Inter at weight 300 with the display serif Riccionets for a literary-editorial hero on a white-to-pastel gradient canvas. Tokens for React, Next.js, and AI coding tools."
  highlights:
    - "Serif-sans headline split — the hero breaks mid-phrase from Inter weight 300 to Riccionets at 96px, giving the emotional line a display-serif voice distinct from the data-privacy prose beneath"
    - "No chromatic primary — the palette is structural neutral; button-primary uses ink on canvas with a hairline border, the same pattern Patagonia and Arc use when brand restraint is the identity"
    - "Pastel gradient canvas — a cream-to-mint-to-lavender gradient bleeds across the lower half of the above-fold area, the only chromatic move in the marketing system"
    - "Pixel-art illustration style — the hero illustration uses 1-bit black-and-white pixel art (desktop, calendar, folder, smiley face), contrasting the soft gradient behind it"
    - "Uppercase tracking label — 14px Inter at 1px letter-spacing in uppercase doubles as section navigation (WHAT / WHY / WHO pill row) and category labels"
  tags:
    - "Productivity & SaaS"
  lastUpdated: "2026-05-19"
  author:
    name: "Dov Azencot"
    url: "https://x.com/dovazencot"
  opening: |
    Anytype's hero does something typographically uncommon for a productivity SaaS: it splits a single headline between two typefaces mid-sentence. "A safe haven" renders in Inter at weight 300 — quiet, almost whispery — and then "for digital collaboration" drops to a second line in Riccionets, a display serif with bracketed serifs and editorial proportions, at 96px. The effect reads like a magazine cover that was interrupted by a product launch. No other element on the page uses Riccionets. It exists solely for that one emotional statement, then vanishes.

    The color story is equally restrained. Where Notion uses cobalt blue for CTAs and linear uses violet for every interactive surface, Anytype keeps the entire chrome in jet black and white. The only chromatic signal is a mint-teal (#3cd9b3) accent used four times as text — once in a testimonial quote mark, once in a small label — and a pastel gradient that bleeds across the lower half of the hero area, mixing warm cream (#ffedbe), mint (#cdffea), sky blue (#b9eeff), and lavender (#e7d4ff). These gradient stops appear only as background fills; they never reach the text layer. Button-primary on this system is black ink on white canvas with a hairline border — the same disciplined move Arc uses, where the product's sophistication is trusted to carry the brand.

    The pixel-art illustration in the hero is the third signal worth noting: a 1-bit black-and-white set of workspace objects (desktop monitor, calendar showing "31," folder stack, smiley-face terminal, document cards) rendered in the style of early Macintosh system icons. The choice signals handcraft and historical computing nostalgia — the opposite of the glass-morphism gradients most productivity apps use. Paired with the literary serif and the data-sovereignty copy, it positions Anytype not as a Notion competitor but as a philosophical counterweight to cloud-first tools.

  related:
    - href: "/design"
      title: "Browse all design systems"
      description: "The full directory of DESIGN.md files on shadcn.io, with live mockups for each."
    - href: "https://anytype.io"
      title: "Anytype — official site"
      description: "Anytype's public marketing site — the source of truth for the live tokens captured in this file."
    - href: "https://github.com/google-labs-code/design.md"
      title: "The DESIGN.md specification"
      description: "Google Labs' open spec for machine-readable design system files — the format this page is built on."
  questions:
    - id: "primary-color"
      title: "What is Anytype's primary brand color?"
      answer: "Anytype has no chromatic primary brand color on its marketing surface — the system is structural neutral. The only named chromatic value that appears in the extracted data is mint-teal (#3cd9b3, total frequency 5, used 4 times as text and once as a border accent). Because no single color appears in a brand layer with usage above 5, the button-primary token on this system uses jet-black ink (#000000) on a white canvas with a hairline border, following the same pattern Arc and Patagonia use when the product's credibility is the brand. The hero's visual identity comes from the Riccionets serif and a pastel gradient, not from a hue."
    - id: "typography"
      title: "What typefaces does Anytype use, and what should I use as substitutes?"
      answer: "Anytype runs two typefaces: Inter (wired as --font-primary) and Riccionets (wired as --font-secondary). Inter handles every functional surface — nav links, body copy, labels, CTAs — at weights 300 and 400 for body, 500 for UI labels. Riccionets is a display serif used exclusively for the second line of the hero headline at 96px / weight 400, with -2.4px letter-spacing. It appears once. For substitutes: Inter is already open-source. Riccionets is proprietary; the closest open-source display serif with bracketed serifs at similar proportions is Playfair Display or Lora at the display scale. Cormorant Garamond is another option if you want more tonal contrast with the sans body."
    - id: "gradient-canvas"
      title: "What colors make up Anytype's hero gradient?"
      answer: "The hero gradient blends warm cream (#ffedbe), pale rose (#ffbcc3), mint green (#c9efb2 and #cdffea), sky blue (#b9eeff), pale lavender (#e7d4ff), and lime (#f1ffc9 and #c5f3e5). All appear exclusively as gradient fills — none reaches the text layer or border layer. The gradient is positioned on the lower half of the hero, fading from white at the top to this soft pastel wash at the bottom. The effect reads as atmospheric, not chromatic branding; it would be invisible against anything but the otherwise colorless canvas. All hex values are present in the extraction as brand-layer gradient stops with a total frequency of 1 each."
    - id: "illustration-style"
      title: "Why does Anytype use pixel-art illustration in its hero?"
      answer: "The 1-bit black-and-white pixel-art illustrations in the hero — a desktop monitor, calendar, folder, smiley terminal, document cards — deliberately reference the early Macintosh computing aesthetic. This is a positioning signal rather than a decoration choice. Anytype is a local-first workspace that runs on-device without cloud sync, and the pixel-art connects the product to the pre-cloud era when data lived on your machine by definition. The style also contrasts with the glass-morphism and gradient-mesh illustrations common among Notion, Coda, and other cloud-first workspace tools, which helps the brand occupy different visual territory without stating the positioning explicitly."
    - id: "use-in-project"
      title: "Can I use this DESIGN.md to build my own local-first SaaS marketing site?"
      answer: "Yes — the file is designed to be fed into Claude, Cursor, or any AI tool that reads structured design tokens. The agent will reproduce Anytype's specific moves: a white canvas with no primary color, Inter at weight 300 for a lighter-than-usual body texture, a display serif for a single headline emotional beat, a pastel gradient backdrop, and button-primary as ink-on-white with a hairline border. Token references resolve without invention — {colors.ink} for text, {colors.canvas} for the background, {colors.mint-teal} for the sole accent. The one move to borrow selectively is the serif-sans headline split: it only works when the second typeface is genuinely distinct in voice, and when one line of copy carries enough emotional weight to justify a dedicated family."

mockups:
  - "marketing-hero"
  - "dashboard-card-grid"

colors:
  ink: "#000000"
  ink-muted: "#5b5b5b"
  ink-subtle: "#808080"
  ink-faint: "#666666"
  surface-1: "#3c3c3c"
  canvas: "#ffffff"
  hairline: "#000000"
  mint-teal: "#3cd9b3"
  gradient-cream: "#ffedbe"
  gradient-rose: "#ffbcc3"
  gradient-mint: "#cdffea"
  gradient-sky: "#b9eeff"
  gradient-lavender: "#e7d4ff"
  gradient-lime: "#f1ffc9"

typography:
  display-xl:
    fontFamily: "\"riccionets\", Helvetica, sans-serif"
    fontSize: 96px
    fontWeight: 400
    lineHeight: 90px
    letterSpacing: -2.4px
  display-lg:
    fontFamily: "\"riccionets\", Helvetica, sans-serif"
    fontSize: 88px
    fontWeight: 400
    lineHeight: 76px
    letterSpacing: -2.4px
  display-md:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 88px
    fontWeight: 300
    lineHeight: 90px
    letterSpacing: -5.2px
  heading-lg:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 48px
    fontWeight: 500
    lineHeight: 48px
    letterSpacing: -2.4px
  heading-md:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 36px
    fontWeight: 500
    lineHeight: 40px
    letterSpacing: -1.6px
  heading-sm:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 28px
    fontWeight: 500
    lineHeight: 32px
    letterSpacing: -0.64px
  subheading:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 28px
    letterSpacing: -0.48px
  body-lg:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 26px
    letterSpacing: -0.28px
  body-md:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: -0.2px
  body-sm:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.12px
  label-caps:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 1px
  button-md:
    fontFamily: "inter, Helvetica, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 24px
    letterSpacing: -0.2px

rounded:
  none: "0px"
  md: "16px"
  pill: "9999px"

spacing:
  xs: "4px"
  sm: "14px"
  md: "16px"
  base: "22px"
  lg: "24px"
  xl: "32px"
  2xl: "44px"
  3xl: "80px"

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "44px"
    borderColor: "{colors.hairline}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "0px 16px"
    height: "44px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "10px 0px"
  hero-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "0px"
  hero-heading-serif:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: "0px"
  body-paragraph:
    backgroundColor: "transparent"
    textColor: "{colors.canvas}"
    typography: "{typography.body-lg}"
    padding: "0px"
  body-paragraph-dark:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: "0px"
  section-heading:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.heading-lg}"
    padding: "0px"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "40px 32px 62px"
    borderColor: "{colors.hairline}"
  feature-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    fontWeight: "500"
  nav-pill:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.canvas}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "44px"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "16px"
    borderColor: "{colors.hairline}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    padding: "52px 20px 48px"
---

## Overview

Anytype's hero does something rare among productivity tools: it commits to typographic voice as the primary brand signal. **Serif-sans editorial split.** The headline breaks mid-sentence between Inter at weight 300 and Riccionets — a display serif with bracketed letterforms — giving the second half of the phrase a literary presence that no competing workspace tool (Notion, Coda, Craft, Obsidian) attempts. The rest of the system is almost aggressively quiet: black, white, and a pastel gradient.

This quietness is the argument. Where Notion uses cobalt-blue CTAs and Linear uses violet-graphite as a surface layer, Anytype offers no chromatic brand signal at all. Button-primary is ink on white canvas with a hairline border, the same move Arc and Patagonia make when they want the product to speak before the brand does.

**Key Characteristics:**
- Serif-sans headline split: Inter weight 300 for the first clause, Riccionets at 96px for the emotional second clause — Riccionets appears nowhere else on the page.
- Zero chromatic brand primary: no color with brand-layer status and usage above 5; the closest accent is mint-teal (#3cd9b3) at 5 total occurrences.
- Pastel gradient backdrop: warm cream, rose, mint, sky blue, and lavender gradient fills bleed across the lower hero, never touching the text layer.
- 1-bit pixel-art illustration: black-and-white Macintosh-era workspace icons (desktop, calendar, folder) contrast the soft gradient and position Anytype against cloud-first tools visually.
- Uppercase tracking labels at 1px letter-spacing serve as section navigation pills (WHAT / WHY / WHO) — the system's only typographic uppercase treatment.
- Pill rounding dominates: the nav pills and CTA buttons use full-pill radius; feature grid cards have zero rounding.
- Weight 300 body copy: lighter than any competing workspace brand; signals deliberateness over density.

## Colors

### Structural

- **Ink** (`{colors.ink}` — #000000): frequency 169. Used as text (88), bg (7), border (74). The dominant canvas color and the only text tone above the fold — pure black against a white surface, unmodulated by alpha.
- **Canvas** (`{colors.canvas}` — #ffffff): frequency 306. Used as text (162), bg (4), border (139). The page floor; also used for text on dark surfaces and as the headline background.
- **Ink-muted** (`{colors.ink-muted}` — #5b5b5b): frequency 33. Used as border (33). Mid-gray for dividers and secondary borders.
- **Surface-1** (`{colors.surface-1}` — #3c3c3c): frequency 8. Used as bg (1), border (7). Dark surface for the nav pill (WHAT / WHY / WHO) — the system's only elevated surface.
- **Ink-subtle** (`{colors.ink-subtle}` — #808080): frequency 10. Used as text (5), border (5). Tertiary label color.
- **Ink-faint** (`{colors.ink-faint}` — #666666): frequency 4. Used as text (2), border (2). Quaternary subtle text.

### Accent

- **Mint-teal** (`{colors.mint-teal}` — #3cd9b3): frequency 5. Used as text (4), border (1). The only chromatic signal on the marketing surface. Appears in testimonial quote marks and a single inline label — a trace accent rather than a brand primary.

### Gradient stops (hero background only)

- **Gradient-cream** (`{colors.gradient-cream}` — #ffedbe): gradient fill only, frequency 1. Warm cream stop in the lower-hero gradient.
- **Gradient-rose** (`{colors.gradient-rose}` — #ffbcc3): gradient fill only, frequency 1. Pale rose stop.
- **Gradient-mint** (`{colors.gradient-mint}` — #cdffea): gradient fill only, frequency 1. Mint green stop.
- **Gradient-sky** (`{colors.gradient-sky}` — #b9eeff): gradient fill only, frequency 1. Sky blue stop.
- **Gradient-lavender** (`{colors.gradient-lavender}` — #e7d4ff): gradient fill only, frequency 1. Pale lavender stop.
- **Gradient-lime** (`{colors.gradient-lime}` — #f1ffc9): gradient fill only, frequency 1. Chartreuse stop at the far end of the gradient.

## Typography

### Font Families

The system runs two families: **Inter** (wired as `--font-primary: "inter", Helvetica, sans-serif`) as the functional voice for every surface, and **Riccionets** (wired as `--font-secondary: "riccionets", Helvetica, sans-serif`) as the display serif reserved for the hero headline's emotional second clause.

### Hierarchy

| Token | Size | Weight | Line Height | Letter-Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 96px | 400 | 90px | -2.4px | Riccionets hero serif line |
| `{typography.display-lg}` | 88px | 400 | 76px | -2.4px | Riccionets alternate display |
| `{typography.display-md}` | 88px | 300 | 90px | -5.2px | Inter super-display (ultra-light) |
| `{typography.heading-lg}` | 48px | 500 | 48px | -2.4px | Section h2 |
| `{typography.heading-md}` | 36px | 500 | 40px | -1.6px | Sub-section headings |
| `{typography.heading-sm}` | 28px | 500 | 32px | -0.64px | Card headings |
| `{typography.subheading}` | 22px | 500 | 28px | -0.48px | UI panel titles |
| `{typography.body-lg}` | 18px | 300 | 26px | -0.28px | Hero body and testimonials |
| `{typography.body-md}` | 16px | 400 | 24px | -0.2px | Default running text |
| `{typography.body-sm}` | 14px | 400 | 20px | -0.12px | Nav links and secondary text |
| `{typography.label-caps}` | 14px | 400 | 20px | 1px | Uppercase section labels (WHAT / WHY / WHO) |
| `{typography.button-md}` | 16px | 500 | 24px | -0.2px | CTA button label |

### Principles

The heaviest weight anywhere on the page is 500 — used for headings and button labels. Body copy at weight 300 is intentionally lighter than most workspace brands, creating a reading texture closer to a newspaper opinion column than a SaaS feature grid. The -5.2px letter-spacing on the 80-88px Inter super-display tier is the most extreme tracking in the system — compress, then release at the Riccionets serif line above.

### Note on Font Substitutes

Riccionets is a proprietary display serif. The closest open-source substitute with bracketed serifs and editorial proportions at 96px display scale is **Playfair Display** (weight 400) or **Cormorant Garamond**. For the Inter body, Inter is already open-source.

## Layout

### Spacing System

- **Base unit:** 4px, with 16px as the dominant page module.
- **Tokens:** `{spacing.xs}` 4px · `{spacing.sm}` 14px · `{spacing.md}` 16px · `{spacing.base}` 22px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.2xl}` 44px · `{spacing.3xl}` 80px.
- **Section padding (vertical):** ~80px between major sections.
- **Card internal padding:** 40px top, 32px sides, 62px bottom — deliberate asymmetry that creates breathing room at the base of the feature cards.
- **Nav padding:** 0px vertical, 16px horizontal — flush to the top edge.

### Grid & Container

- **Max content width:** ~1200px, with a two-column split above the fold (headline left, pixel-art illustration right).
- **Feature grid:** 4-column row below the fold (Private & Secure / Offline & Online / Work & Play / video thumbnail), each divided by a full-height hairline border.
- **Hero:** white canvas with the gradient bleeding in from the lower right; headline floats left-aligned with generous top padding.

### Rhythm

The page alternates between the editorial headline area (white canvas, serif moment, large negative tracking) and the feature grid area (hairline dividers, functional sans, weight 500 labels). There is no gradient transition between zones — the hero area ends abruptly at the hairline border above the feature grid.

## Elevation

The system uses essentially no shadow tier. Elevation is achieved through a single mechanism: the nav pill (`{colors.surface-1}` — dark charcoal #3c3c3c on white) creates the only tonal lift on the page. Feature cards use hairline borders rather than shadows or background fills to delineate edges.

- **Flat (no shadow):** all body surfaces, hero, footer.
- **Tonal lift:** `{colors.surface-1}` dark pill on `{colors.canvas}` white — used only for the section navigation (WHAT / WHY / WHO) row.
- **Hairline borders:** feature grid cards use 1px black borders as dividers; there is no card background differentiation.

## Shapes

The radius philosophy is binary:

- `{rounded.none}` 0px — feature grid cards and structural dividers; the system's sharp moment.
- `{rounded.md}` 16px — text inputs and form fields.
- `{rounded.pill}` 9999px — CTA buttons and the WHAT / WHY / WHO nav pills.

There is no intermediate rounding tier. The contrast between sharp feature cards and fully-rounded CTAs is intentional — the product grid is functional, the call-to-action is human-scaled.

## Components

**`button-primary`** — Ink-black `{colors.ink}` fill, white text, `{rounded.pill}` radius, 10x16 padding, 44px height. There is no chromatic primary to fill here; the CTA's authority comes from contrast and the pill shape, not color.

**`button-secondary`** — Transparent fill, black text, 1px black hairline border, `{rounded.pill}` radius. Used for "Log in" and secondary download CTAs.

**`top-nav`** — White canvas, black text, 0px vertical padding, 16px horizontal padding, 44px height. The Anytype wordmark sits flush left; "Download" and a hamburger icon sit flush right — no center-aligned nav links, which is unusual for a SaaS marketing site.

**`nav-link`** — Transparent, black text at `{typography.body-sm}`, 10x0 padding. The only nav links are the top-right "Download" text.

**`hero-heading`** — Black text on transparent, `{typography.display-xl}` (96px Riccionets). Zero horizontal padding; the serif headline sits flush left with no safe zone.

**`hero-heading-serif`** — The split-voice version: the first clause uses Inter weight 300 at matching scale, then the second clause drops to Riccionets. Both share the display-xl token scale.

**`body-paragraph`** — White text (for the testimonial dark card surface) at `{typography.body-lg}` (18px / weight 300). The below-fold testimonials invert to a black or near-black card.

**`body-paragraph-dark`** — Black text at `{typography.body-md}` for feature grid descriptions under each column heading.

**`section-heading`** — Black text, `{typography.heading-lg}` (48px / 500), used for section h2 labels like "Private & Secure" inside the feature columns.

**`card`** — White canvas fill, black text, zero radius, 1px black hairline border. Asymmetric padding: 40px top / 32px sides / 62px bottom. Used for the 4-column feature grid below the fold.

**`feature-label`** — Black text, `{typography.body-sm}` at weight 500. The bolded label above each feature description in the 4-column grid.

**`nav-pill`** — Dark charcoal `{colors.surface-1}` fill, white text at `{typography.label-caps}` (14px / uppercase / 1px tracking), `{rounded.pill}` radius. The WHAT / WHY / WHO section-navigation row.

**`text-input`** — White canvas fill, black text, `{rounded.md}` 16px radius, 1px black border, 16px padding. Used for any inline form fields.

**`footer`** — White canvas, ink-muted text at `{typography.body-sm}`, 52x20x48 padding (top / sides / bottom). Continuous with the page canvas — no surface lift.

## Do's and Don'ts

**Do** use Riccionets (or an editorial serif substitute) exclusively for the headline's emotional clause. The rule is one voice per role — the functional product copy stays in Inter; only the brand statement gets the serif.

**Do** keep body weight at 300 for paragraph and testimonial copy. The lighter weight is load-bearing: it creates reading texture that separates Anytype from grid-heavy SaaS docs tools without requiring a second font.

**Do** use `{rounded.pill}` on all interactive surfaces (buttons, nav pills) and `{rounded.none}` on all content cards. The binary contrast between round-interactive and sharp-structural is the system's shape language.

**Do** limit mint-teal (`{colors.mint-teal}` — #3cd9b3) to trace use — at most 5 occurrences, as in the extraction. Expanding it to fill buttons or card borders would transform a trace accent into a brand primary, which is not what the system does.

**Don't** add a chromatic primary color to the button-primary component. The ink-on-white button with a hairline border is deliberate — introducing a color fill (cobalt, violet, teal) would signal that the brand color is doing the persuasion, which undercuts the data-sovereignty positioning.

**Don't** use gradient stops (`{colors.gradient-cream}` through `{colors.gradient-lavender}`) as text or border colors. They live exclusively in background fills. Applying them as text would destroy the ink-black / white contrast discipline the rest of the system depends on.

**Don't** apply the -5.2px letter-spacing from `{typography.display-md}` to any size below 80px. Extreme negative tracking at body size reads as broken text; it only resolves at large display scale where inter-letter distances remain legible.

**Don't** use uppercase `{typography.label-caps}` for body-length copy. The 1px positive tracking is calibrated for 3-6 character labels (WHAT / WHY / WHO); at paragraph length it reads as shouting.

## Known Gaps

- **Primary CTA hover state:** the ink-on-white button's hover behavior is not captured. Common practice would be an ink-muted fill or a border-only inverse, but the captured surface does not confirm either.
- **Dark surfaces:** the testimonial section appears to use a dark or near-black card, but the extraction captures body text color as white — the card background value is not confirmed.
- **Gradient position and timing:** the pastel gradient appears to fade in on scroll or be positioned absolutely in the lower-right of the hero; exact positioning, z-index, and any scroll parallax are not captured.
- **Mobile type scale:** the extraction reflects desktop sizes. Riccionets at 96px would require significant downscaling on mobile; the responsive breakpoints are not represented here.
- **Riccionets character set:** the extraction confirms the family name but not the weight range, style variants, or language coverage of the Riccionets typeface.
- **Form states:** text-input error, focus, and disabled states are not captured from the marketing surface.
- **Animation:** the hero pixel-art illustration and gradient may animate on load; the spec captures static end-state values only.
