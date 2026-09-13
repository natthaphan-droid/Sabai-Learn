---
name: Sabai Learn
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#414942'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#717971'
  outline-variant: '#c1c9bf'
  surface-tint: '#3b6848'
  primary: '#3b6848'
  on-primary: '#ffffff'
  primary-container: '#7faf8a'
  on-primary-container: '#144226'
  inverse-primary: '#a1d2ab'
  secondary: '#446650'
  on-secondary: '#ffffff'
  secondary-container: '#c6eccf'
  on-secondary-container: '#4a6c55'
  tertiary: '#6f5d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#bba33b'
  on-tertiary-container: '#453900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcefc6'
  primary-fixed-dim: '#a1d2ab'
  on-primary-fixed: '#00210d'
  on-primary-fixed-variant: '#225032'
  secondary-fixed: '#c6eccf'
  secondary-fixed-dim: '#aacfb4'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#2d4e39'
  tertiary-fixed: '#fde273'
  tertiary-fixed-dim: '#e0c65a'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#544600'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans, Noto Sans Thai, sans-serif
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 52px
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans, Noto Sans Thai, sans-serif
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans, Noto Sans Thai, sans-serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans, Noto Sans Thai, sans-serif
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-md:
    fontFamily: Plus Jakarta Sans, Noto Sans Thai, sans-serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans, Noto Sans Thai, sans-serif
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Noto Sans, Noto Sans Thai, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Noto Sans, Noto Sans Thai, sans-serif
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Noto Sans, Noto Sans Thai, sans-serif
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Noto Sans, Noto Sans Thai, sans-serif
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Noto Sans, Noto Sans Thai, sans-serif
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Noto Sans, Noto Sans Thai, sans-serif
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

This design system delivers a calm, encouraging, and supportive digital classroom experience for Thai primary and secondary school students and educators. The visual atmosphere balances educational clarity with the gentle warmth of modern pedagogical spaces—avoiding visual overstimulation, anxiety-inducing gamification, or clinical corporate rigidity. 

The aesthetic is clean, rounded, and tactilely soft. It evokes feelings of safety, curiosity, and approachability ("Sabai-Sabai"). Visual hierarchy is established through airy negative space, gentle pastel zoning, and quiet surface distinctions rather than stark borders or loud drop shadows.

## Colors

The palette is anchored by soothing organic tones designed to reduce eye strain during prolonged study sessions.

- **Primary (`#7FAF8A`)**: Calm Sage Green. Used for primary calls-to-action, active navigational anchors, focused interactive states, and key learning milestones.
- **Secondary (`#A8CDB2`)**: Soft Mint Green. Used for secondary actions, supporting progress track fills, subtle selected surface washes, and grouped module tags.
- **Accent / Tertiary (`#F4D96B`)**: Warm Sunny Pastel Yellow. Reserved for sparks of motivation, XP/stars, celebration cues, notifications, and important badges.
- **Support Accent (Soft Blue - `#AFC9D8`)**: Used for study resources, downloadable worksheets, reference metadata, and secondary informational states.
- **Canvas & Surfaces**: Base background sits at `#F7F8F5` (warm paper tint), providing soft contrast against pure white cards (`#FFFFFF`). Structural dividing borders use `#EAECE7`.
- **Text & Content**: Heading and body text utilize `#333333` for high-contrast yet soft readability. Secondary metadata and subtitles sit at `#777777`.
- **Functional Feedback**:
  - *Success*: `#E8F5E9` background with `#4CAF50` text/iconography.
  - *Warning / Review*: `#FFF8E1` background with `#F57F17` text/iconography.
  - *Error / Incomplete*: `#FFEBEE` background with `#E53935` text/iconography.
  - *Informational*: `#E3F2FD` background with `#1E88E5` text/iconography.

## Typography

Typography prioritizes bilingual harmony across Thai and Latin scripts. The system pairs friendly, modern geometric Latin characters with loopless, open-counter Thai glyphs (`Noto Sans Thai`, with fallback to `Prompt`).

Thai vowels and tone marks require generous vertical clearance. Line heights are calibrated at 1.5x to 1.65x to avoid diacritic clipping. Heavy letter-spacing must be avoided across Thai passages to prevent breaking syllable perception. Headlines utilize slightly heavier weights with compact breathing room, while body copy remains open, legible, and uncrowded.

## Layout & Spacing

The layout is built on a soft, fluid grid using an 8pt base spacing rhythm (with 4pt micro-steps for compact UI accessories like tags and avatars).

- **Desktop (1200px+)**: 12-column responsive layout with max container width of 1280px, 32px (`margin`) outer padding, and 20px (`gutter`) column spacing.
- **Tablet (768px – 1199px)**: 8-column layout, 24px outer margins, and 16px column gutters. Sidebar navigation collapses into an off-canvas drawer.
- **Mobile (Below 768px)**: 4-column layout, 16px (`margin-mobile`) outer edges, and 12px (`gutter-mobile`) column gaps. Learning grids condense to single-card stacked feeds.

Inner component spacing relies strictly on `space-md` (16px) and `space-lg` (24px) to retain an uncluttered, breathable workspace suitable for young readers.

## Elevation & Depth

Depth is conveyed through soft ambient light and tinted low-contrast outlines rather than heavy drop shadows. Surfaces rest gently upon one another, reinforcing a serene paper-like feel.

- **Level 0 (Flat / Canvas)**: `#F7F8F5`. Default canvas base. No shadow.
- **Level 1 (Card & Module Surface)**: `#FFFFFF` fill with a crisp boundary: `1px solid #EAECE7` combined with an ambient haze `0 4px 20px -2px rgba(51, 51, 51, 0.04)`.
- **Level 2 (Hover & Active Surfaces)**: Cards elevate subtly under interactive hover to `0 8px 24px -4px rgba(51, 51, 51, 0.08)` while slightly lightening border boundaries.
- **Level 3 (Overlays, Modals, & Drawers)**: `#FFFFFF` surface with `0 16px 36px -6px rgba(51, 51, 51, 0.12)`, backed by a gentle scrim: `rgba(51, 51, 51, 0.25)` with a `backdrop-filter: blur(4px)`.
- **Dividers**: Always lightweight `1px solid #EAECE7`. Never use heavy dark line rules.

## Shapes

The design system employs a rounded, welcoming shape profile. Rounded corners soften the interface, reducing perceived difficulty and creating a friendlier emotional environment for both young students and teachers.

- **Standard Elements (`rounded`)**: 8px radius for form inputs, dropdown selectors, list rows, and checkboxes.
- **Medium Panels (`rounded-lg`)**: 16px radius for subject cards, assignment cards, assessment panels, and interactive dialogue prompts.
- **Prominent Containers (`rounded-xl`)**: 20px–24px radius for hero banners, modal dialogs, and parent learning dashboards.
- **Interactive Micro-elements (`rounded-full`)**: Fully circular pill profiles for tags, status badges, progress indicators, chips, and icon-only buttons.

## Components

### Buttons
- **Primary**: Solid `#7FAF8A` background, pure white text, fully rounded (pill) or 12px corners. Height: 44px (min-target for accessibility). Hover state deepens slightly to `#70A07B`. Active state scales subtly down (0.98 scale).
- **Secondary**: Soft `#EAF2EC` (tinted sage) background with `#4D7557` text. Zero heavy outline.
- **Outline / Ghost**: 1.5px border in `#A8CDB2` with `#4D7557` text on transparent surface. Hover fills with `#F7F8F5`.
- **Accent Button**: `#F4D96B` background with `#423805` text for homework submission, quiz completion, and reward redemption.

### Cards & Lesson Tiles
- Built with a `#FFFFFF` fill, 16px to 20px border-radius, and standard ambient elevation.
- Includes a 16px to 24px inner padding.
- Card headers combine Thai typography hierarchy, an illustrative badge or module icon, and an optional Soft Status chip positioned at the top right.

### Badges & Chips
- Fully pill-shaped with compact padding (`4px 12px`).
- Uses soft status color pairs:
  - Submitted / Done: `#E8F5E9` with `#4CAF50` text.
  - Due Soon / Pending: `#FFF8E1` with `#F57F17` text.
  - Overdue / Attention: `#FFEBEE` with `#E53935` text.
  - Study Material / Lecture: `#E3F2FD` with `#1E88E5` text.
- Subject chips use pastel surfaces (`#AFC9D8` at 20% opacity) with dark muted labels.

### Progress Bars
- Track height: 10px with fully rounded caps.
- Background track: `#EAECE7`. Fill: `#7FAF8A` (or `#F4D96B` for streak/bonus metrics).
- Supports an optional floating label pill showing percentage or completed chapters (e.g., "5/8 บทเรียน").

### Inputs & Selectors
- Background: `#FFFFFF`. Border: `1.5px solid #EAECE7`.
- Radius: 10px. Height: 46px.
- Focus state: Border transitions to `#7FAF8A` with a soft outer glow ring (`box-shadow: 0 0 0 3px rgba(127, 175, 138, 0.20)`).
- Error state: Border `#E53935` with gentle feedback caption below.

### Checkboxes & Radios
- Size: 22px x 22px (child-friendly touch scale).
- Unchecked: `#FFFFFF` with `1.5px solid #EAECE7`.
- Checked: `#7FAF8A` fill with white checkmark icon. Radios use an inner centered white dot.

### Navigation Tabs
- Pill-segmented design or underline indicator.
- Segmented bar sits on `#F0F2ED` track with active tab surfaced on `#FFFFFF` card with soft shadow.
- Ample horizontal spacing (min 16px padding per tab item) to comfortably contain Thai script without truncation.

### Tables & Gradebooks
- Alternate row striping using `#FFFFFF` and `#FAFBF9`.
- Header row uses `#F7F8F5` background with bolded 13px Thai labels (`#777777`).
- Borderless inner cells with single subtle row dividers (`1px solid #EAECE7`).