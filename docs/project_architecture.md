# 🏋️‍♂️ FITORA — Technical Documentation & Architecture Specification

> **Platform Overview**: FITORA is Bangladesh's premier AI-powered fitness ecosystem serving athletes across all 64 districts. Designed with a **Pure Monochrome Black & White Visual Identity**, real-time AI workout coaching, nutritional planning, body metric tracking, and multi-tier Role-Based Access Control (RBAC).

---

## 🔐 1. User Roles & Access Control Architecture

The platform enforces strict **Role-Based Access Control (RBAC)** across three primary operational levels:

```
+----------------------------------------------------------------------------------------------------+
| USER ROLE                    | ACCESSIBLE ROUTES & FEATURES                                         |
+------------------------------+----------------------------------------------------------------------+
| 1. Guest / Unauthenticated   | Homepage (/), Login (/login), Register (/register)                  |
| 2. Member / Athlete          | All Core Tools (/calculator, /stopwatch, /meals, /exercises)         |
|                              | + Athlete Dashboard (/dashboard) with Hydration & Streak Tracker     |
| 3. Branch Admin              | Branch Portal (/dashboard): District stats, check-in log, packages  |
| 4. System Master Admin       | Central Command (/dashboard): 64-branch telemetry, User Management, |
|                              | revenue metrics, role creation & Master account immutability         |
+----------------------------------------------------------------------------------------------------+
```

### Access Control Matrix

| Route / Feature | Guest / Unauthenticated | Free / Member | Branch Admin | Master Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Homepage (`/`)** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Login / Register (`/login`, `/register`)** | ✅ Allowed | 🔄 Redirect `/dashboard` | 🔄 Redirect `/dashboard` | 🔄 Redirect `/dashboard` |
| **BMI Calculator (`/calculator`)** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Gym Stopwatch (`/stopwatch`)** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Meals Catalog (`/meals`)** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Exercise Library (`/exercises`)** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Security Gateway (`/dashboard/login`)** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Unified Dashboard (`/dashboard`)** | 🔒 Redirect `/dashboard/login` | ✅ Athlete View | ✅ Branch View | 👑 Master View |

---

## 👑 2. System Master Admin & Security Immutability

FITORA features a dedicated, single Master Administrator account with code-level immutability protection:

* **Master Name**: `Master`
* **Master Email**: `master@fitora.com`
* **Master Password**: `P@SSW0RDF!T0R@`
* **Immutability Enforcement**:
  - The Master account (`USR-1001`) cannot be edited, renamed, or deleted by any user or administrator in the system.
  - The User Management Table displays a permanent locked `System Master` badge.
  - System prevents creating duplicate `master_admin` roles to ensure unified governance.

---

## 🎨 3. Design System & Frontend Architecture

### Visual Identity Principles
* **Color Palette**: Pure Monochrome Black & White (`#000000` pitch black, `#FFFFFF` pure white, `bg-neutral-950` dark cards, `border-white/10` borders). Zero red or extraneous colors.
* **Signature Button System**: Uniform `rounded-full` pill buttons with rotating `ArrowUpRight` (`↗`) round icon badges.
* **100% Zoom-Proof Layout**: Locked `max-w-7xl` container architecture preventing layout shifts on browser zoom or 2K/4K ultra-wide screens.
* **Brand Consistency**: Standardized 100% brand identity under **FITORA** / **FITORA GYM & AI**.

---

## 🏢 4. 64 Nationwide Branches Network

FITORA operates across all 8 divisions and 64 districts in Bangladesh:
* **Divisions**: Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Barisal, Rangpur, Mymensingh.
* **Flagship HQ**: Fitora Tower, Gulshan-2, Dhaka 1212.
* **Branch Features**: RFID Turnstile Check-in Feed, Live Occupancy Monitoring, and Division Filter Directory.

---

## 🛠️ 5. Technology Stack

### Frontend (`/client`)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4, Framer Motion
- **Notifications**: React Hot Toast (`react-hot-toast`)
- **Authentication**: Better Auth

### Backend (`/server`)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript (`tsx` engine)
- **Realtime**: Socket.IO Server
- **Security**: CORS, Dotenv, JWT Token Verification
