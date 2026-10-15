# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary User:** Greenhouse operators and agricultural technicians managing live tomato crops daily.
- **Operating Situation:** Standing directly at the growing rack in a greenhouse, interacting with an 800×1280 vertical portrait touch display.
- **Primary Job:** Conduct rapid glanceable audits of live telemetry (moisture, EC, temperature, humidity, light, CO2, water, pH), monitor current growth stage, and execute daily cultivation checklists.

## Product Purpose

- Deliver a high-efficiency operational monitoring and task execution interface for precision tomato cultivation.
- Success is defined as an operator being able to assess greenhouse health within 3 seconds from 1–2 meters away and complete daily stage tasks with effortless single-tap touch controls.

## Positioning

- A purpose-built, zero-latency vertical kiosk interface (800×1280) that tightly binds live specimen telemetry to actionable growth-stage protocols, engineered for physical greenhouse touch screens without desktop bloat or external build dependencies.

## Operating Context

- **Physical Environment:** Commercial or research greenhouse with high ambient light, glare, temperature swings, and potential wet or gloved touch operations.
- **Hardware Profile:** 800×1280 vertical (portrait) touch monitor mounted at chest height beside the plant rack. No physical keyboard or mouse.
- **Dual-Surface Structure:**
  - *Telemetry Monitor (`index.html`):* Non-scrolling single-viewport command screen displaying live gauges, specimen status, growth stage selector, and immediate daily checklist.
  - *Agronomic Guide (`info.html`):* In-depth reference manual with stage-by-stage targets, dynamic EC/pH trend charts with target zones, actionable farmer guidelines, and troubleshooting checklists.

## Capabilities and Constraints

- **Confirmed Capabilities:**
  - Live sensor telemetry: Soil Moisture (%), Electrical Conductivity (mS/cm), Temperature (°C), Humidity (%), Light Intensity (lux), CO2 (ppm), Water Tank Level (%), Nutrient pH.
  - Stage tracking: Seedling (ต้นกล้า), Vegetative (เจริญเติบโต), Flowering (ออกดอก), Fruiting (ติดผล), Harvest (เก็บเกี่ยว).
  - Cross-view task synchronization: Interactive checklist state and active stage persisted in `localStorage` (`plant_a_control_tasks`, `plant_a_control_active_stage`).
  - Real-time station status and 1-second interval live clock.
- **Technical Constraints:**
  - Target viewport: 800px width × 1280px height portrait orientation.
  - Main monitor (`index.html`) must fit within 1280px vertical height without scrolling.
  - Stack: Vanilla HTML, CSS, JavaScript (no build step, no framework dependency).
  - Minimum touch target size: 44×44px (recommended 48px+) for greenhouse ergonomics.

## Brand Commitments

- **Name:** PLANT A CONTROL — Tomato Kiosk.
- **Tone & Voice:** Authoritative, high-precision agronomic system.
- **Language:** Bilingual — English for technical sensor metrics and system badges; Thai for agronomic stage names, task instructions, and practical guidance.

## Evidence on Hand

- `index.html`: Live specimen kiosk interface with 8 telemetry cards, stage switcher, specimen graphic, and task list.
- `info.html`: Detailed guide for all 5 growth stages with environmental thresholds and diagnostic advice.
- `css/home.css`, `css/info.css`: Incumbent styling rules, glassmorphism panel aesthetics, and kiosk grid definitions.
- `js/home.js`, `js/info.js`: Operational state sync logic and time updates.
- `README.md`: System specifications and kiosk operating parameters.

## Product Principles

1. **Glanceable at Distance:** Vital parameters and alert states must be legible from 1–2 meters away under greenhouse glare.
2. **Touch-First Ergonomics:** All touchpoints (tabs, buttons, checkboxes) must be generously sized with immediate visual feedback.
3. **Zero Operational Friction:** The home dashboard must remain completely contained in the 800×1280 viewport without layout overflow or unexpected scrollbars.
4. **Actionable Agronomy:** Telemetry is not passive decoration; it directly drives stage-specific tasks and cultivation interventions.

## Accessibility & Inclusion

- High contrast required between text, sensor values, and card backgrounds to ensure readability under greenhouse luminaire lighting.
- Minimum functional text size of 12px for micro-metadata, 14–16px for interactive labels, and 24–32px for primary sensor readouts.
- Tap targets adhere to 44px minimum touch standards.
