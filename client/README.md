<div align="center">

# ⚡ Fitora Client — Next.js 16 Frontend Web Application

> **High-Performance Monochromatic Client Application Built with Next.js 16 App Router & Turbopack**  
> Engineered for athletes, fitness enthusiasts, and administrators across Bangladesh.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-black?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-black?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![jsPDF](https://img.shields.io/badge/jsPDF-Vector_Export-black?style=for-the-badge)](https://github.com/parallax/jsPDF)
[![Socket.IO Client](https://img.shields.io/badge/Socket.IO-Client-black?style=for-the-badge&logo=socket.io)](https://socket.io/)

[🌐 **Live Demo**](https://fitora-fitness.vercel.app) • [📖 **Root Documentation**](../README.md) • [⚙️ **Backend API**](../server/README.md)

</div>

---

## 📑 Table of Contents

- [🎨 Design System & Styling Architecture](#-design-system--styling-architecture)
- [🌟 Core Modules & Application Routes](#-core-modules--application-routes)
- [🏆 All-in-One Member Hub Deep Dive (`/profile`)](#-all-in-one-member-hub-deep-dive-profile)
- [💳 Subscriptions, Digital Wallet & Invoicing](#-subscriptions-digital-wallet--invoicing)
- [🧩 Domain-Organized Component Architecture](#-domain-organized-component-architecture)
- [🔌 Client REST API Services Layer](#-client-rest-api-services-layer)
- [📁 Directory Structure](#-directory-structure)
- [⚙️ Environment Variables](#️-environment-variables)
- [🚀 Development & Scripts](#-development--scripts)

---

## 🎨 Design System & Styling Architecture

The Fitora frontend strictly adheres to a **Pure Black & White (`#000000` / `#FFFFFF`) Monochromatic Visual Identity**:

- **Luxury Monochrome Theme**: High-contrast dark mode foundation (`bg-black text-white`) with refined border layering (`border-white/10` to `border-white/20`).
- **Signature Pill Button Tokens**: Uniform `rounded-full` CTA buttons with dynamic circular icon badges (`ArrowUpRight` `↗`).
- **Zero-Layout-Shift Containers**: Constrained responsive max-width architecture (`max-w-7xl`) preventing distortion across high-DPI displays (2K/4K) and extreme browser zoom levels.
- **Micro-Interactions**: Fluid transitions powered by Framer Motion, smooth hover borders, and real-time state feedback with React Hot Toast.

---

## 🌟 Core Modules & Application Routes

| Route                  | Module Name                    | Access Level  | Description & Key Components                                                                                                      |
| :--------------------- | :----------------------------- | :-----------: | :-------------------------------------------------------------------------------------------------------------------------------- |
| `/`                    | **Homepage**                   |    Public     | 1-to-1 Hero with transparent athlete cutout, SVG arch notch, Why Choose Us, Pricing grid, Trainer Callout, and Consultation Form. |
| `/calculator`          | **BMI & Health Assessment**    | Authenticated | Interactive height/weight sliders, BMI categorization, BMR/TDEE calculation, and profile synchronization.                         |
| `/exercises`           | **Exercise Catalog & Tracker** | Authenticated | Live exercises loaded from MongoDB with category filters, muscle group tags, video instruction links, and VIP locks.              |
| `/meals`               | **Healthy Meals Catalog**      | Authenticated | Nutrition-focused recipe items with calorie tags, macro breakdowns, and one-click additions to daily meal plans.                  |
| `/stopwatch`           | **Gym Rest Timer HUD**         | Authenticated | Fullscreen distraction-free timer with quick rest chips (+30s, +60s), audio alerts, and workout telemetry logging.                |
| `/profile`             | **All-in-One Member Hub**      | Authenticated | 4-tab central cockpit: Overview (streak & heatmap), Gym Pass & QR, Workouts & Nutrition, and Subscription & Card.                 |
| `/profile/edit`        | **Profile Settings**           | Authenticated | Edit athlete name, phone, assigned branch, fitness goal, body metrics, and account credentials.                                   |
| `/dashboard`           | **Admin Control Portal**       |  Admin Only   | Administrative management restricted strictly to Master Admin (`master@fitora.com`) and Branch Admins.                            |
| `/dashboard/login`     | **Admin Portal Login**         |  Admin Only   | Specialized administrative entrypoint for branch managers and platform administrators.                                            |
| `/payment/success`     | **Checkout Receipt**           | Authenticated | Post-checkout landing showing confirmed tier, gateway, and instant vector PDF invoice generation.                                 |
| `/login` & `/register` | **Authentication**             |    Public     | Glassmorphism authentication flow; new user registration triggers the automatic **3-Day Free Premium Trial**.                     |

---

## 🏆 All-in-One Member Hub Deep Dive (`/profile`)

The `/profile` route serves as the athlete's primary daily dashboard, organized into **4 clean tabs**:

```
+-----------------------------------------------------------------------------------------------+
|                                      MEMBER HUB NAVIGATION                                    |
+---------------------+---------------------+-----------------------+---------------------------+
| 1. Overview         | 2. Gym Pass & QR    | 3. Workouts & Diet    | 4. Subscription & Card    |
+---------------------+---------------------+-----------------------+---------------------------+
```

1. **Tab 1: Overview / My Fitness**
   - **Workout Streak Counter**: Live consecutive day counter synced directly with MongoDB activity logs.
   - **Hydration Target**: Daily water intake gauge (L/day) derived from athlete profile settings.
   - **Profile Summary**: Displays assigned branch, contact details, active fitness goal, and total BDT spent.
   - **365-Day Activity Heatmap**: Dynamic GitHub-style calendar contribution matrix visualizing gym check-ins, workouts, and rest timer sessions.
   - **BMI History Ledger**: Tabular history of previous biometric calculations with one-click record deletion.

2. **Tab 2: Gym Pass & QR**
   - **Digital Membership Card**: High-contrast luxury member pass displaying athlete name, branch, and tier badge.
   - **Contactless QR Check-in**: Scannable QR code generated from `user.qrCodeId` for gate turnstile scanning at all 64 gym branches.
   - **Real-Time Expiration Ticker**: Live validity badge with exact expiration timestamps.

3. **Tab 3: Workouts & Nutrition**
   - **Workout History**: Chronological log of recent workouts with duration (minutes) and calories burned.
   - **Personalized Nutrition Plan**: Macro breakdown (Protein, Carbs, Fats) tailored specifically to the athlete's fitness goal.
   - **Saved Meal Plan**: Scheduled daily breakfast, lunch, dinner, and snack routines.

4. **Tab 4: Subscription & Card**
   - **Trial Countdown Banner**: Real-time ticker (`d:h:m:s`) showing remaining time on active 3-Day Free Trials.
   - **Membership Status Card**: Subscription progress bar, renewal CTA, and tier switcher.
   - **Billing & Invoice History (`BillingSection`)**: Complete transaction ledger with direct pure vector PDF export.
   - **Saved Card Manager**: View masked card details (`•••• 4242`), remove card, or add a card to unlock the **2 Bonus Months FREE** retention reward.

---

## 💳 Subscriptions, Digital Wallet & Invoicing

- **3-Day Free Premium Trial Engine**: Automatically granted upon registration; unlocks all Pro/VIP features for 72 hours.
- **Save Card & 2 Bonus Months Retention Engine**: Purchasing a monthly plan with a saved card grants **90 days of access (1 month purchase + 2 bonus months FREE)**.
- **1-Click Dynamic Renewal**: Server-authoritative logic that automatically extends future expiration dates without losing remaining days.
- **Single-Screen Portal Invoice Modal (`createPortal`)**: Mounted directly to `document.body` at `z-[99999]`, providing a sleek, zero-scroll desktop experience with pinned luxury toolbar and full athlete contact and branch metadata.
- **Pure Vector PDF Invoices (`jspdf`)**: Direct client-side generation of crisp, high-resolution vector PDF invoices with itemized tables, tax calculations, and cryptographic serials (`INV-YYYY-XXXXXX`).
- **PRO Badge Illumination**: Real-time glowing `PRO` badge synchronized next to the global navigation brand logo upon confirmed checkout.

---

## 🧩 Domain-Organized Component Architecture

All components in `client/src/components/` are organized into clean, domain-specific modules with backward-compatible re-exports:

```
client/src/components/
├── auth/                       # Login & Register UI containers
├── calculator/                 # BmiCalculator, MacroAdjuster, Assessment cards
├── dashboard/                  # Admin KPI cards, user management tables, branch views
├── exercises/                  # ExerciseTracker, exercise cards, catalog filters
├── home/                       # HeroSection, WhyChooseUs, PricingSection, ContactInfoForm
├── invoice/                    # React Portal, Vector PDF & print-accurate InvoiceModal
├── meals/                      # MealCard, meal planners, category selectors
├── notifications/              # Real-time NotificationBell & toast popups
├── profile/                    # ActivityHeatmap, BillingSection, NutritionPlan
├── subscription/               # MembershipStatusCard, CountdownTimer, renewal modals
├── time/                       # GymTimer HUD, ExerciseStopwatch, TimerControls
├── Navbar.tsx                  # Global navigation header with drawer
└── Footer.tsx                  # Global footer component
```

---

## 🔌 Client REST API Services Layer

All backend interactions are centralized inside `client/src/services/` for consistency and type safety:

| Service File          | Primary Endpoints                           | Responsibilities                                                                             |
| :-------------------- | :------------------------------------------ | :------------------------------------------------------------------------------------------- |
| `authService.ts`      | `/api/auth/*`                               | Login, registration, token refresh, session persistence, user profile caching.               |
| `dashboardService.ts` | `/api/dashboard/*`, `/api/users/saved-card` | Admin stats, user directory, saved card save/delete operations.                              |
| `paymentService.ts`   | `/api/payments/*`                           | Checkout sessions, renewal extension, transaction ledger, auto-renew toggling, plan changes. |
| `activityService.ts`  | `/api/users/activity/streak`                | Dynamic calendar streaks, milestone badge evaluation, 180-day activity matrix.               |
| `bmiService.ts`       | `/api/bmi/*`                                | BMI calculation history creation, retrieval, and deletion with user auto-binding.            |
| `mealService.ts`      | `/api/meals/*`                              | Healthy recipe catalog queries, category filters, and search.                                |
| `workoutService.ts`   | `/api/workouts/*`                           | Workout log persistence, duration tracking, exercise queries, log deletion, and PR history.  |
| `branchService.ts`    | `/api/branches/*`                           | 64 nationwide branch directory and live attendance feeds.                                    |
| `searchService.ts`    | `/api/search`                               | Dynamic multi-entity MongoDB search across athletes, branches, and financials.               |

---

## 📁 Directory Structure

```
client/
├── public/                     # Static assets (hero.png, logo.svg, images)
├── src/
│   ├── app/                    # Next.js App Router routes & pages
│   ├── components/             # Reusable UI component modules
│   ├── data/                   # Fallback data catalogs (MealsData.ts)
│   ├── hooks/                  # Custom React hooks (useDashboardRole, useAuth)
│   ├── lib/                    # Auth client configuration and utility helpers
│   ├── services/               # REST API service connectors
│   └── types/                  # Centralized TypeScript definitions
├── .env.example                # Environment variables template
├── next.config.ts              # Next.js & Turbopack configuration
├── package.json                # Frontend dependencies & npm scripts
└── tsconfig.json               # TypeScript compiler configuration
```

---

## ⚙️ Environment Variables

Create `.env.local` in `client/`:

```env
# Backend REST API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Backend Socket.IO Server URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Client App Public URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Development & Scripts

```bash
# 1. Start development server with Next.js Turbopack
npm run dev

# 2. Verify TypeScript typecheck (Zero-Error Policy)
npx tsc --noEmit

# 3. Create optimized production build
npm run build

# 4. Start production server
npm run start

# 5. Run ESLint code quality analysis
npm run lint
```
