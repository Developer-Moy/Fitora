# Fitora Frontend Client Application

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-Vector_Export-red?style=flat-square)](https://github.com/parallax/jsPDF)

The **Fitora Client** is a high-performance Next.js 16 web application engineered with the App Router, Turbopack, and Tailwind CSS v4. It delivers a luxury Pure Black & White user interface for gym members, fitness athletes, trainers, and administrators across Bangladesh.

---

## 🎨 Design System & Theme Principles

- **Pure Black & White Theme**: High-contrast, monochromatic palette with zero extraneous red or colorful accents.
- **Signature Pill Buttons**: Uniform `rounded-full` CTA buttons with rotating `ArrowUpRight` (`↗`) badges.
- **Zoom-Proof & Responsive Layout**: Responsive max-width container architecture locking relative component positions across zoom levels and ultra-wide screens.
- **Strict Brand Identity**: Standardized 100% brand consistency under **FITORA** / **FITORA GYM & AI**.

---

## 🌟 Core Modules & Pages

| Route                  | Module Name                      | Description                                                                                                      |
| ---------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`                    | **Home Page**                    | Hero with transparent athlete cutout, SVG notch, Why Choose Us, Pricing, Callout, Consultation form, and Footer. |
| `/calculator`          | **BMI & Health Metrics**         | Interactive height/weight sliders, BMI categorization, BMR/TDEE calculation, and profile sync.                   |
| `/exercises`           | **Exercise Catalog**             | Live exercises loaded from MongoDB with category filters, search, and Pro/VIP workout locks.                     |
| `/meals`               | **Healthy Meals Catalog**        | Nutrition-focused meal cards with calorie filtering, macro breakdowns, and daily meal planning.                  |
| `/stopwatch`           | **Gym Rest Timer HUD**           | Fullscreen distraction-free timer with quick rest chips, sound alerts, and workout telemetry logging.            |
| `/dashboard`           | **Member & Master Dashboard**    | Personal telemetry, attendance streaks, branch selection, and Master Admin oversight.                            |
| `/dashboard/login`     | **Dashboard Portal Login**       | Multi-role administrative and athlete access portal.                                                             |
| `/profile`             | **Athlete Profile & Milestones** | Personal fitness goals, BMI history, workout logs, nutrition charts, and billing history.                        |
| `/profile/edit`        | **Profile Settings**             | Edit bio, contact info, fitness preferences, and account credentials.                                            |
| `/payment/success`     | **Checkout Confirmation**        | Post-checkout landing showing confirmed tier, gateway, and instant invoice access.                               |
| `/login` & `/register` | **Authentication**               | Glassmorphism authentication flow integrated with Better Auth and JWT sessions.                                  |

---

## 💳 Payment, Subscriptions & Invoicing

- **1-Click Dynamic Renewal**: Automatically detects existing active subscription expiration and extends future duration without lost days.
- **Direct Vector PDF Export**: High-resolution, print-accurate vector PDF invoice generator powered by `jspdf` (`handleDownloadPDF`).
- **Live Membership Countdown**: Real-time ticker counting down days, hours, and minutes remaining on Dashboard and Profile routes.
- **Real-Time PRO Badge**: Dynamically illuminates a glowing `PRO` badge next to the `FITORA` brand logo upon confirmed purchase.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, HeroUI, Framer Motion
- **Icons**: Lucide React, React Icons
- **PDF Generation**: `jspdf`
- **Notifications**: React Hot Toast
- **State & Hooks**: Custom hooks (`useDashboardRole`, `useAuth`, `useSocket`)
- **Realtime**: Socket.IO Client

---

## 📁 Directory Structure

```
client/
├── public/                 # Static assets (hero.png, logo.svg, images)
├── src/
│   ├── app/                # Next.js App Router routes
│   │   ├── (main)/         # Main layout and home page
│   │   ├── calculator/     # BMI & health metrics calculator
│   │   ├── dashboard/      # Member & Admin dashboard views
│   │   ├── exercises/      # Exercise library & workout tracker
│   │   ├── login/          # User authentication login
│   │   ├── meals/          # Nutrition meal catalog
│   │   ├── payment/        # Checkout success & receipt
│   │   ├── profile/        # Athlete profile, milestones, billing
│   │   ├── register/       # User registration
│   │   └── stopwatch/      # Fullscreen gym timer
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Login & register containers
│   │   ├── calculator/     # Macro adjuster & health assessment
│   │   ├── dashboard/      # Member, branch & user management views
│   │   ├── home/           # Hero, Pricing, WhyChooseUs, Contact
│   │   ├── invoice/        # Vector PDF and print invoice modal
│   │   ├── subscription/   # Countdown timer & status cards
│   │   └── time/           # Gym timer HUD & controls
│   ├── data/               # Type definitions & fallback data
│   ├── hooks/              # Custom React hooks (useDashboardRole)
│   ├── lib/                # Auth client and membership utilities
│   ├── services/           # Backend REST API connectors
│   └── types/              # Centralized TypeScript interfaces
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── package.json            # Client dependencies & scripts
└── tsconfig.json           # Client TypeScript configuration
```

---

## ⚙️ Environment Variables

Create `.env.local` in `client/`:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# WebSocket Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Run TypeScript typecheck without emitting output
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm run start

# Run ESLint check
npm run lint
```
