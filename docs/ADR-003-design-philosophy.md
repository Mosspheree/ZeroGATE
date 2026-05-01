# ADR-003: Design Philosophy & Aethestic Direction

## Status
Accepted

## Context
A cybersecurity product must evoke trust, precision, and modernity. Conventional "corporate" designs often feel stagnant. ZeroGate needs a visual identity that matches its "Continuous Adaptive" nature.

## Decision
We adopted a **"Deep Technical"** aesthetic:
- **Color Palette:** Deep slates (`#020617`) paired with high-contrast vibrancy (Indigo for trust, Rose for threat intercepts).
- **Typography:** Inter for legibility, paired with monospaced accents (JetBrains Mono) for a "system-level" feel.
- **Motion:** High-entry staggering and layout transitions using `motion/react` to simulate real-time neural processing.
- **Data Viz:** Step-after area charts to represent discrete packet/identity events rather than smooth continuous functions.

## Consequences
- **Perceived Authority:** The interface feels like a "Control Plane" rather than a simple dashboard.
- **Development Overhead:** Requires custom Tailwind configurations and intentional animation durations.
