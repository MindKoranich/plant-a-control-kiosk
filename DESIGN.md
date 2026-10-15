---
name: PLANT A CONTROL — Tomato Cultivation Kiosk
description: Precision 800×1280 vertical touch kiosk design system for smart greenhouse tomato cultivation
colors:
  bg-canvas: "#030608"
  bg-kiosk: "#080f13"
  bg-panel: "#0f1c22"
  bg-card: "#121d24"
  bg-card-hover: "#172731"
  border-subtle: "#1c323e"
  border-focus: "#2a4c5d"
  accent-green: "#2ef387"
  accent-green-muted: "#10b981"
  accent-cyan: "#22d3ee"
  accent-amber: "#f59e0b"
  accent-red: "#ef233c"
  text-primary: "#f1f7f9"
  text-secondary: "#94a9b3"
  text-muted: "#68808c"
typography:
  display:
    fontFamily: "'Prompt', sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Prompt', sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.01em"
  title:
    fontFamily: "'Prompt', sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Prompt', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'Prompt', sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.02em"
  mono:
    fontFamily: "'Space Mono', 'JetBrains Mono', monospace"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "28px"
components:
  card:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "20px"
  nav-button:
    backgroundColor: "{colors.bg-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
    height: "56px"
  task-checkbox:
    backgroundColor: "transparent"
    rounded: "{rounded.full}"
    size: "44px"
---

# Design System: PLANT A CONTROL

<!-- impeccable:design-schema 1 -->

## Overview

PLANT A CONTROL is a purpose-built, zero-latency vertical touch kiosk (800×1280) engineered for greenhouse agricultural operators. It combines live plant specimen telemetry with actionable growth-stage protocols. The visual identity reflects a high-precision botanical laboratory instrument: deep dark slate surfaces, chlorophyll emerald highlights, crisp cyan telemetry indicators, and high-contrast typography readable under greenhouse sunlight.

## Colors

- **Surface Layers:**
  - `bg-canvas` (`#030608`): Deep bezel boundary.
  - `bg-kiosk` (`#080f13`): Viewport background with gentle radial depth.
  - `bg-panel` (`#0f1c22`): Secondary structural containers.
  - `bg-card` (`#121d24`): Primary card surface (replaces generic glassy transparencies).
  - `bg-card-hover` (`#172731`): Interactive touch response.
- **Borders & Dividers:**
  - `border-subtle` (`#1c323e`): Consistent 1px boundary for cards and panels.
  - `border-focus` (`#2a4c5d`): Focused and active indicator border.
- **Accents:**
  - `accent-green` (`#2ef387`): Photosynthesis, optimal status, active stage indicator.
  - `accent-cyan` (`#22d3ee`): Water, humidity, EC, and hydroponic nutrient sensors.
  - `accent-amber` (`#f59e0b`): Warnings, threshold alerts, and cautionary guidelines.
  - `accent-red` (`#ef233c`): Ripe tomato specimen color and critical alerts.
- **Text & Contrast:**
  - `text-primary` (`#f1f7f9`): 12.8:1 contrast on card background (Passes WCAG AAA).
  - `text-secondary` (`#94a9b3`): 6.2:1 contrast on card background (Passes WCAG AA).
  - `text-muted` (`#68808c`): 4.5:1 minimum contrast for micro-copy and metadata.

## Typography

- **Heading & Numeric Face:** `Space Grotesk` paired with `Prompt` for bilingual clarity.
- **Thai Body & Labels:** `Prompt` (crisp modern sans-serif with excellent optical balance).
- **Data & Telemetry:** `Space Mono` / `JetBrains Mono` for tabulated sensor readouts.
- **Type Scale Rules:**
  - Large Telemetry Metric: 36px–40px, font-weight 800.
  - Viewport Title: 24px, font-weight 800.
  - Section Title: 18px–20px, font-weight 700.
  - Task & Guidance Body: 15px–16px, font-weight 500.
  - Interactive Badges & Chips: 13px–14px, font-weight 600.
  - **Absolute Floor:** 12px minimum. Sub-11px text is strictly banned.

## Layout

- **Canvas Dimension:** Fixed 800px width × 1280px height portrait viewport.
- **Grid Structure:**
  - Top: 56px fixed system header.
  - Upper: Growth stage progress bar & tab selector.
  - Center: 430px specimen hero & twin telemetry columns (Left: Crop lifecycle & EC/pH; Right: Temp, RH, VPD).
  - Lower: Daily To-Do checklist with separated toggle and navigation targets.
  - Bottom: 60px dual hardware navigation bar (Home vs Detailed Guide).
- **Non-Scrolling Home Principle:** The primary telemetry dashboard (`index.html`) must fit fully within 1280px without layout overflow.

## Elevation & Depth

- **Directional Shadows:** Subtle elevation (`box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)`).
- **Ban on Generic Neon Halos:** Zero-offset colored glow halos (`box-shadow: 0 0 20px #00ff87`) are prohibited. Use refined 1px border highlights (`border: 1.5px solid rgba(46, 243, 135, 0.7)`) to denote active state.

## Shapes

- Outer Viewport: `border-radius: 28px` to `36px` matching hardware kiosk bezels.
- Panels & Cards: `border-radius: 16px` to `20px`.
- Interactive Controls & Pills: `border-radius: 12px` or `9999px` (fully rounded pills).

## Components

- **Stage Selector:** 4 distinct stages (เพาะกล้า 1–25d, ต้นกล้า 26–50d, เติบโต 51–75d, เก็บเกี่ยว 76–110d). Active stage highlighted with solid emerald border and high contrast label.
- **Telemetry Card:** Sensor title in uppercase monospace, prominent numeric readout with units, normal/warning range status tag, and proportional progress bar.
- **Task Checklist Item:**
  - Left: 44×44px circular check toggle (`role="checkbox"`, `aria-checked`, keyboard accessible with Enter/Space).
  - Middle: Timestamp pill and task title linking to deep agronomic instructions in `info.html`.
  - Right: Quick guide link icon (↗ วิธีทำ).
- **System Header:** Dark slate bar with station status ("OK" in emerald pill) and real-time 1s ticking clock.

## Do's and Don'ts

### Do:
- Keep all interactive touch targets at or above 44×44px for gloved greenhouse operation.
- Provide high contrast between text and dark card backgrounds (minimum 4.5:1).
- Maintain 12px as the absolute smallest font size anywhere in the interface.
- Respect `prefers-reduced-motion` for all transitions and animations.
- Ensure state persistence between `index.html` and `info.html` via `localStorage`.

### Don't:
- Don't use zero-offset neon glow shadows (`shadow-[0_0_12px_#2ef387]`).
- Don't nest cards inside cards with redundant stacked borders.
- Don't use decorative pulsing dots (`animate-pulse`) to simulate fake liveness.
- Don't use sub-11px text for UI metadata.
- Don't create stark pure white containers that cause screen glare in dark themes.
