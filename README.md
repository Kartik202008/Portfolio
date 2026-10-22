# Alex Rivera — Minimalist Mobile-First Developer Portfolio

A production-ready, mobile-first developer portfolio engineered with a cream grid canvas (`#F7F5EE`), subtle 1px grid overlay, solid dark ink borders (`#161616`), neo-brutalist tactile box shadows (`4px 4px 0px #161616`), and high-contrast typography in **Space Grotesk** and **Space Mono**.

---

## ⚡ Key Highlights & Features

- **Mobile-First Responsiveness:** Flawless scaling from compact mobile screens (320px–390px) up to ultra-wide displays with touch-optimized targets (≥44px), smooth slide-down mobile navigation drawer, and fluid grid layouts.
- **Modern Minimalist / Cream Grid Aesthetics:**
  - Base canvas: `#F7F5EE`
  - 1px crisp grid overlay
  - Solid dark borders: `#161616`
  - Sharp tactile card containers with box shadows (`4px 4px 0px #161616`) and active press states
  - Vibrant accent highlights: `#FACC00` (Yellow), `#E63946` (Alert Red), `#10B981` (Online Green)
- **Theme Switcher:** Seamless toggle between **Cream Canvas Mode** and **Cyber-Dark Mode**, with theme persistence in `localStorage`.
- **Web Audio Micro-Haptics:** Synthesizer-driven subtle audio clicks powered directly by the Web Audio API (with zero external dependencies and a mute toggle in the top bar).
- **Sticky Header & Monogram:** Custom `[AR]` monogram, live status indicator with real-time ticking clock (`IST / UTC+5:30`), section links, and one-click `.pdf` resume download.
- **1-Click Clipboard Email:** Copy email button with animated toast notifications.
- **Interactive Project Simulators (All 3 Exact 2026 Projects):**
  1. **Full-Stack E-Commerce Platform (01 / 2026):** Interactive storefront modal with dynamic cart management, promo code calculation (`DEV2026`), and mock atomic checkout.
  2. **MedAlert (02 / 2026):** Live 2-minute async safety window countdown timer with simulated WhatsApp Caretaker escalation.
  3. **SocietyPool (03 / 2026 · Hackathon Winner):** Interactive group-buying volume slider dynamically calculating tier discounts (up to 30% off) + AI Society Copilot generating real-time WhatsApp announcement drafts.
- **Categorized Toolbox:** Grouped into Languages/Frontend, Backend & Database, APIs & AI, and Tools & Deployment, with an interactive CLI terminal widget.
- **Interactive Contact Form & ATS Resume:** Form validation with live character counter, email confirmation toast, and an in-browser printable ATS resume.

---

## 📁 Project Architecture

```
Portfolio/
├── index.html       # Semantic HTML5 with accessibility attributes and modals
├── styles.css       # Complete Vanilla CSS design system (Cream & Dark themes)
├── script.js        # Interactive engine, simulators, timers, and audio synthesizer
├── resume.pdf       # Printable ATS-friendly resume file
└── README.md        # Documentation and deployment guide
```

---

## 🚀 Running Locally

You can run the portfolio with any local HTTP server:

```bash
# Option 1: Python 3
python3 -m http.server 4200

# Option 2: Node.js npx serve
npx -y serve -p 4200
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## 🌐 Deploying to Production

The portfolio is static and zero-dependency, meaning it deploys instantly to:
- **Vercel:** `npx -y vercel`
- **Netlify:** `npx -y netlify deploy --prod --dir=.`
- **GitHub Pages:** Push to your repository and enable Pages in repository settings.
