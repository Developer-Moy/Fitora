<div align="center">

# 🏋️‍♂️ FITORA — AI-Powered Realtime Fitness & Gym Ecosystem

> **The Premier High-Performance Fitness Platform in Bangladesh**  
> Connecting athletes, trainers, and 64 nationwide gym branches through an ultra-luxury Pure Black & White design, intelligent AI coaching, live video exercise guides, contactless turnstile QR check-in, and frictionless multi-gateway payments.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-black?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Mongoose-black?style=for-the-badge&logo=mongodb)](https://mongoosejs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-black?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini Flash](https://img.shields.io/badge/Google_Gemini-Flash_AI-black?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)

[🌐 **Live Production Application**](https://fitora-fitness.vercel.app) • [💻 **Frontend Engineering Guide**](client/README.md) • [⚙️ **Backend API Catalog**](server/README.md)

</div>

---

## 💡 Why FITORA? The Problems We Solve

Traditional gym management software in Bangladesh is either outdated desktop spreadsheets or generic foreign apps that lack local payment methods, multi-branch synchronization, and modern athlete engagement.

**FITORA was built to bridge this gap.** We created a unified digital ecosystem that solves real daily headaches for both gym members and gym administrators.

### 🏋️ For Athletes & Gym Members:

- **The Problem:** Members lose motivation without feedback, struggle to remember proper exercise form, have no unified log of their workouts, and face tedious manual check-ins at gym counters.
- **How FITORA Helps:**
  - **24/7 AI Coach (Google Gemini):** Instant, science-backed workout splits, hypertrophy tips, diet macros, and recovery strategies right at their fingertips.
  - **50+ Interactive Video Exercises:** Real YouTube video thumbnail cards with smooth hover video previews, ensuring safe technique before lifting a dumbbell.
  - **365-Day Activity Heatmap:** GitHub-style visual consistency streaks that motivate athletes to never skip a workout day.
  - **Contactless Turnstile QR Entry:** Instant digital membership pass with an anti-tamper QR code for seamless access across all 64 nationwide branches.
  - **Transparent Local Billing:** Instant subscription checkout via **bKash**, **Nagad**, and international cards, backed by downloadable vector PDF invoices and a **3-Day Free Trial**.

### 🏢 For Gym Owners & Branch Administrators:

- **The Problem:** Manual attendance books lead to ghost entries, turnstile congestion, lost revenue, and zero real-time visibility across branch facilities.
- **How FITORA Helps:**
  - **Unified Master & Branch Command Center:** Real-time occupancy gauges, live turnstile check-in feeds, and branch capacity alerts.
  - **Automated Revenue Telemetry:** Live monthly revenue progression charts, payment gateway distribution breakdowns, and automated subscription renewal trackers.
  - **Zero Ghost Members:** Every QR scan is securely verified against MongoDB database records in milliseconds.
  - **Single Master Admin Guard:** Schema-level security preventing unauthorized privilege elevation or administrative tampering.

---

## 🌟 Key Platform Features

### 1. 🤖 Floating AI Fitness Studio (Google Gemini Flash)

- Powered by Google's latest **Gemini Flash** engine with an automatic local fitness heuristic fallback so athletes are never left without an answer.
- Persistent morphing floating widget: docks neatly into the hero section notch and expands into a focused, distraction-free modal when activated.
- One-click protocol chips: `HYPERTROPHY`, `NUTRITION`, `FAT LOSS`, and `RECOVERY`.

### 2. 📹 Exercise Vault with Hover Video Previews

- Catalog of 50+ strength, functional, and endurance exercises verified through YouTube oEmbed validation.
- High-res YouTube video thumbnail previews on every card.
- **Intelligent Hover Preview:** Hovering over any exercise triggers a muted looping video preview with a 280ms debounce and active `LIVE` indicator.
- Integrated modal rest stopwatch and set logger to track volume directly into MongoDB.

### 3. 🏆 All-in-One Member Hub (`/profile`)

- **Overview:** Active consistency streaks, daily hydration target (L/day), quick biometric status, dynamic 365-day attendance heatmap, and BMI history ledger with 1-click deletion.
- **Gym Pass & QR:** High-contrast digital luxury membership pass with scannable `qrCodeId`.
- **Workouts & Nutrition:** Chronological training logs, personalized macro targets, and saved meal plans.
- **Subscription & Invoices:** Live subscription expiry ticker, renewal modal, saved payment cards, and complete transaction history.

### 4. 💳 Frictionless Commerce & Customer Retention Engine

- **Local & Global Gateways:** bKash, Nagad, Visa, Mastercard, and Stripe Checkout Sessions.
- **Save Card = 2 Bonus Months FREE:** Purchasing a monthly pass while saving a payment card automatically awards 90 days total access (1 month + 2 bonus months free).
- **Single-Screen Vector PDF Invoices:** Built-in vector PDF generator (`jsPDF`) and print-ready modal with digital verification seal.

### 5. 🛡️ Administrative Command Center (`/dashboard`)

- Gated strictly to `master_admin` and `branch_admin` roles.
- **Monthly Revenue Progression:** Clean BDT revenue volume charts across calendar months.
- **Live Branch Occupancy:** Live member count vs. capacity threshold with real-time turnstile check-in feeds and CSV data export.
- **User Management & Branch Directory:** Centralized CRUD controls across all 64 district branches in Bangladesh.

---

## 🎨 Monochromatic Luxury Design System

FITORA embraces a strict **Pure Black & White (`#000000` / `#FFFFFF`) Visual Identity**:

- **High Contrast:** Pure pitch-black backgrounds and crisp white typography, avoiding washed-out grays.
- **Signature Pill Buttons:** Rounded-full button silhouettes paired with rotating circular `ArrowUpRight` (`↗`) icon badges.
- **`w-11/12 max-w-7xl` Grid Alignment:** Mathematical alignment between the Navbar, Hero Section, and content containers for zero layout shift across mobile, tablet, and 4K displays.

---

## 🏗️ High-Level Technical Stack

| Layer                   | Technologies & Tools                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Frontend Client**     | Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, jsPDF |
| **Backend Server**      | Node.js 18+, Express.js 4, TypeScript (`tsx`), Socket.IO, JWT, Bcrypt.js           |
| **Database & Cloud**    | MongoDB Atlas, Mongoose ODM, Google AI Studio (Gemini Flash), Stripe API           |
| **Design & Typography** | Inter font, Luxury Monochromatic B&W Theme, Custom SVG Notch Geometry              |

> For in-depth technical details, schema definitions, and module-specific setups:
>
> - 📖 **[Client Architecture & Components Guide](client/README.md)**
> - ⚙️ **[Server REST API & Socket Microservice Guide](server/README.md)**
> - 📝 **[Developer Changelog & Daily Engineering Log](docs/moloy.md)**

---

## 🚀 Quickstart Guide

### Prerequisites

- **Node.js** `v18.18.0` or higher
- **NPM** `v9.x` or higher
- **MongoDB Atlas URI**

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Developer-Moy/Fitora.git
cd Fitora

# Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Configure Environment Variables

Create `.env` files in both `client/` and `server/`:

**`client/.env`**:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**`server/.env`**:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_google_ai_studio_key
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Launch Development Servers

From the root directory, launch both frontend and backend concurrently:

```bash
npm run dev
```

- 💻 **Web Client:** [http://localhost:3000](http://localhost:3000)
- ⚙️ **API Server:** [http://localhost:5000](http://localhost:5000)
- 🩺 **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Quality Assurance & Zero-Error Verification

Fitora enforces a strict zero-warning compilation policy. Run checks anytime:

```bash
# Verify Frontend TypeScript
cd client && npx tsc --noEmit

# Verify Backend TypeScript
cd ../server && npx tsc --noEmit
```

---

## 👥 Authors & Acknowledgments

- **Lead Architect & Full-Stack Developer:** [Developer-Moy](https://github.com/Developer-Moy)
- **Special Thanks:** To all contributing engineers and fitness athletes across Bangladesh.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
