# Fitora - AI-Powered Realtime Fitness Ecosystem & Central Gym Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)](https://mongoosejs.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-black?style=flat-square)](https://better-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=flat-square&logo=vercel)](https://fitora-fitness.vercel.app)

**FITORA** is a full-stack, enterprise-grade fitness ecosystem and gym management platform serving athletes across all 64 districts in Bangladesh. Powered by Next.js 16 (App Router), Express.js, TypeScript, Mongoose ODM, Better Auth, and Socket.IO real-time telemetry, FITORA delivers AI workout guidance, nutritional planning, body metric tracking, and multi-tier Role-Based Access Control (RBAC).

🌐 **Live Demo Application**: [https://fitora-fitness.vercel.app](https://fitora-fitness.vercel.app)

---

## 🎨 Design System & Visual Identity

* **Pure Luxury Monochrome Palette**: Pure black (`#000000`), deep charcoal surfaces (`bg-neutral-950`), crisp white typography, and subtle border highlights (`border-white/10`).
* **Signature Pill Action System**: Uniform `rounded-full` pill buttons with rotating `ArrowUpRight` (`↗`) badges.
* **100% Zoom-Proof Architecture**: Locked responsive max-width container layout (`max-w-7xl`) preventing layout shifts across all devices from mobile to 4K displays.
* **Unified Brand Consistency**: Standardized branding strictly under **FITORA** / **FITORA GYM & AI**.

---

## 🌟 9 Core Modules & Feature Suite

1. 🏠 **Homepage (`/`)**:
   - **Hero Section (`HeroSection.tsx`)**: Serif Italic *"Build Your Body"* headline, transparent cutout athlete, bottom SVG notch, left details text, social links, and 3-column stats counter strip.
   - **Why Choose Us (`WhyChooseUs.tsx`)**: High-contrast workout image showcase, gym benefits checklist, and signature trial CTA.
   - **Coaches Banner (`CoachesBanner.tsx`)**: Mentorship showcase featuring nationwide master trainers.
   - **Meet Our Trainers (`MeetTrainers.tsx`)**: 6-photo certified trainer gallery.
   - **Membership Pricing (`PricingSection.tsx`)**: 3-card tier showcase (Basic Pass, Pro Athlete, VIP Ultimate) with annual 20% billing toggle.
   - **Trainer Callout Banner (`TrainerCalloutBanner.tsx`)**: High-visibility direct trainer contact banner.
   - **Consultation Form (`ContactInfoForm.tsx`)**: Consultation booking form with 64 nationwide branch directory contact info.

2. 🤖 **AI Coach & Fitness Telemetry (`FloatingAiWidget.tsx`)**:
   - Live interactive floating fitness coach widget with workout splits, hydration guidelines, and instant training telemetry.

3. 🥗 **Nutritious Meals Catalog (`/meals`)**:
   - Searchable, category-filtered recipes (High Protein, Under 500 kcal, Fat Loss) with interactive nutrition details modal.

4. 🏋️ **Exercise Library & Tracker (`/exercises`)**:
   - Categorized strength, cardio, and hypertrophy exercise directory with difficulty tiers and form instructions.

5. ⚖️ **Metric & BMI Calculator (`/calculator`)**:
   - Dynamic interactive height/weight sliders with real-time BMI, BMR, TDEE gauges, and tailored nutrition recommendations.

6. ⏱️ **Gym Stopwatch & Rest Timer (`/stopwatch`)**:
   - Fullscreen distraction-free rest timer HUD with quick rest adjusters (+30s, +60s) and sound notifications.

7. 🔐 **Authentication & Security Gateway (`/login` & `/dashboard/login`)**:
   - **Consumer Login & Register (`/login`, `/register`)**: Member authentication powered by Better Auth.
   - **Enterprise Security Gateway (`/dashboard/login`)**: Dedicated 1-page zero-scrolling luxury gateway for System Master and Branch Admins.

8. 📝 **Member Registration Portal (`/register`)**:
   - Form-validated onboarding for prospective gym members and athletes.

9. 📊 **Central Unified Dashboard (`/dashboard`)**:
   - Single-route RBAC architecture dynamically adapting view based on credentials:
     - **👑 System Master Admin**: National overview across all 64 branches, total revenue, check-in feeds, and user creation/role management with Master account immutability protection.
     - **🏢 Branch Admin**: District-specific gym stats, member check-in verification, and package breakdown.
     - **🏃 Athlete / Member**: Personal workout streaks, hydration tracker, VIP membership activation, and athlete profile editor.

---

## 🔐 Master Admin Account & Credentials

FITORA is governed by a protected Master Admin account with system-level immutability:

- **Name**: `Master`
- **Email**: `master@fitora.com`
- **Password**: `P@SSW0RDF!T0R@`
- **Security Rule**: The Master account is hard-locked in the codebase and cannot be edited, renamed, or deleted by any user or administrator.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 16 (App Router / Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Icons**: Lucide React, React Icons
- **Notifications**: React Hot Toast (`react-hot-toast`)
- **Auth**: Better Auth Client
- **Realtime**: Socket.IO Client

### Backend (`/server`)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript (`tsx` execution engine)
- **Realtime**: Socket.IO Server
- **Security**: CORS, Dotenv, JWT Token Verification

---

## 📁 Clean Repository Structure

```text
Fitora/
├── client/                     # Next.js Frontend Application
│   ├── public/                 # Static Assets (hero.png, logo.svg, images)
│   ├── src/
│   │   ├── app/                # App Router Pages (9 Core Features)
│   │   │   ├── (main)/         # Homepage ((main)/page.tsx)
│   │   │   ├── api/auth/       # Better Auth Backend Handlers
│   │   │   ├── calculator/     # BMI & Macro Calculator (/calculator)
│   │   │   ├── dashboard/      # Unified Dashboard (/dashboard)
│   │   │   │   └── login/      # Enterprise Security Gateway (/dashboard/login)
│   │   │   ├── exercises/      # Exercise Directory (/exercises)
│   │   │   ├── login/          # Member Login (/login)
│   │   │   ├── meals/          # Meal Plans & Recipes (/meals)
│   │   │   ├── register/       # Member Registration (/register)
│   │   │   ├── stopwatch/      # Gym Stopwatch HUD (/stopwatch)
│   │   │   ├── globals.css     # Global Tailwind Styles
│   │   │   └── not-found.tsx   # Custom 404 Screen
│   │   ├── components/         # Modular UI Components
│   │   │   ├── auth/           # Auth Flow Container & Social Login
│   │   │   ├── dashboard/      # Dashboard Views, Sidebar & User Tables
│   │   │   ├── home/           # Homepage Sections & Hero
│   │   │   ├── meals/          # Meal Cards & Details Modal
│   │   │   ├── time/           # Stopwatch, Gym Timer & Quick Logger
│   │   │   ├── Navbar.tsx      # Global Navigation Header
│   │   │   └── Footer.tsx      # Global Footer
│   │   ├── data/               # Central Mock & Branch Data (64 Districts)
│   │   ├── hooks/              # Custom React Hooks (useDashboardRole)
│   │   ├── lib/                # Auth Client Configurations
│   │   ├── services/           # Backend API Services
│   │   └── types/              # TypeScript Models & Interfaces
│   └── package.json
│
├── server/                     # Express.js Backend API & Socket Server
│   ├── src/
│   │   ├── config/             # MongoDB Connection Setup
│   │   ├── controllers/        # Route Controllers (Workouts, AI, BMI, Ads, Users)
│   │   ├── middlewares/        # Authentication & Validation Middlewares
│   │   ├── models/             # Mongoose Schemas (User, WorkoutLog, Goal, etc.)
│   │   ├── routes/             # Express API Routers
│   │   ├── services/           # Core Business Logic
│   │   ├── sockets/            # Socket.IO Event Handlers
│   │   └── server.ts           # Central Express Server Entry Point
│   └── package.json
│
└── docs/                       # Project Documentation & Architecture Guides
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB instance (local or MongoDB Atlas)

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Developer-Moy/Fitora.git
cd Fitora

# Setup Frontend
cd client
npm install
npm run dev

# Setup Backend Server
cd ../server
npm install
npm run dev
```

### 3. Environment Configuration

Create a `.env` file in both `client/` and `server/` following the respective `.env.example` templates.

---

## 👥 Contributors & Credits

- **Developer:** [Moloy Paul (DeveloperMoy)](https://github.com/Developer-Moy)
- **Repository:** [FITORA GitHub](https://github.com/Developer-Moy/Fitora)
