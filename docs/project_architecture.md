# 🏋️‍♂️ FITORA — Technical Documentation & Implementation Plan

> **Platform Overview**: Fitora is Bangladesh's premier AI-powered fitness and gym ecosystem serving athletes across all 64 districts. Designed with a **Pure Black & White High-Contrast Visual Identity**, real-time AI workout coaching, macro nutrition planning, and multi-tier membership control.

---

## 🔐 1. User Roles & Access Control Architecture

The platform enforces strict **Role-Based Access Control (RBAC)** across four distinct user levels:

```
+---------------------------------------------------------------------------------------+
| USER ROLE                    | ACCESSIBLE ROUTES & FEATURES                            |
+------------------------------+--------------------------------------------------------+
| 1. Guest (Not Logged In)    | ONLY Homepage (/), Login (/login), Register (/register) |
| 2. Free Member               | Homepage, Calculator, Stopwatch, Plans, Profile       |
| 3. Premium Member            | All Free Features + AI Coach, Nutrition, Recovery, Logs|
| 4. Admin                     | Exclusive Access to Admin Dashboard (/dashboard/admin) |
+---------------------------------------------------------------------------------------+
```

### Access Control Matrix

| Route / Feature | Guest (Not Logged In) | Free Member | Premium Member | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Homepage (`/`)** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Login / Register (`/login`, `/register`)** | ✅ Allowed | 🔄 Redirect to Home | 🔄 Redirect to Home | 🔄 Redirect to Home |
| **BMI Calculator (`/calculator`)** | 🔒 Redirect `/login` | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Gym Rest Stopwatch (`/stopwatch`)** | 🔒 Redirect `/login` | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Membership Plans (`/plans`)** | 🔒 Redirect `/login` | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **User Profile (`/profile`)** | 🔒 Redirect `/login` | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **AI Personal Coach (`/dashboard/user/ai-coach`)** | 🔒 Redirect `/login` | 🔒 Upgrade Required | ✅ Allowed | ✅ Allowed |
| **Nutrition Planner (`/dashboard/user/nutrition`)** | 🔒 Redirect `/login` | 🔒 Upgrade Required | ✅ Allowed | ✅ Allowed |
| **Recovery Metrics (`/dashboard/user/recovery`)** | 🔒 Redirect `/login` | 🔒 Upgrade Required | ✅ Allowed | ✅ Allowed |
| **Workout Tracker (`/dashboard/user/workout`)** | 🔒 Redirect `/login` | 🔒 Upgrade Required | ✅ Allowed | ✅ Allowed |
| **Admin Control Center (`/dashboard/admin/*`)** | 🔒 Redirect `/login` | 🚫 403 Forbidden | 🚫 403 Forbidden | ✅ Exclusive Access |

---

## 🎨 2. Design System & Frontend Architecture

### Visual Identity Principles
* **Color Palette**: Pure Monochrome Black & White (`#000000` pitch black, `#FFFFFF` pure white, `#0E0F12` dark card containers, `#F4F4F4` light card containers). Zero red/emerald accent colors.
* **Typography**: Heavy bold uppercase headlines (`font-black uppercase tracking-tight`), outlined stroke typography (`WebkitTextStroke: "2px white"`).
* **Brand Identity**: 
  - **Logo**: Pitch-white flame icon (`fill="#FFFFFF"`).
  - **Branch Network**: *Fitora Tower, Gulshan-2, Dhaka 1212* & *64 Branches in Bangladesh*.
  - **Developer Credit**: `Design and Developed by DeveloperMoy`.

### Header Navbar & Responsive Navigation
* **Desktop View (`>= 1024px`)**: Solid pitch-black background with centered navigation links (`Home`, `BMI Calculator`, `Gym Stopwatch`, `Membership Plans`, `AI Coach Studio`) and a pure white rounded `"Join Now"` CTA button.
* **Mobile & Tablet Drawer (`< 1024px`)**: Slide-in B&W menu drawer with top white search bar, collapsible Chat List, profile card, and Pro button.

### Assembled Homepage Section Flow (`app/(main)/page.tsx`)
1. **`HeroSection`** (Alfaaz Ahmed) — *"Build Your Body"* banner + 3 live counter stats.
2. **`WhyChooseUs`** (Simanto Paul) — Animated 3-photo workout layout & feature checklist.
3. **`TrainerCalloutBanner`** (Puskor Roy) — *"Need a Fitness Trainer?"* callout banner.
4. **`MealChartSection`** (Simanto Poddar) — Premium meal chart showcase.
5. **`TrainersSection`** (Simanto Poddar) — Master coaches & trainers 6-photo grid.
6. **`PricingAndReviews`** (Salauddin) — *"JOIN TODAY"* pricing plans ($10, $15, $20) & *"YOUR OPINIONS"* reviews slider.
7. **`Advertisement`** (Simanto Poddar) — Dynamic gym product ad marquee.
8. **`ContactInfoForm`** (DeveloperMoy) — 1-to-1 visual match *"Leave Us Your Info"* consultation contact form with Bangladesh 64 branches office info.

---

## 🛡️ 3. Backend & API Architecture

### Database Schema (MongoDB / Mongoose)

#### User Schema (`server/src/models/User.ts`)
```typescript
interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "guest" | "free" | "premium" | "admin";
  district: string; // One of 64 districts in Bangladesh
  membershipPlan?: "beginner" | "premium" | "pro";
  subscriptionStatus: "active" | "canceled" | "expired";
  createdAt: Date;
  updatedAt: Date;
}
```

### Express Middleware for Route Protection

```typescript
// 1. Require Authenticated User (Guest Block)
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Access denied. Please log in to view this page." });
  }
  next();
};

// 2. Require Premium Membership
export const requirePremium = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "premium" && req.user?.role !== "admin") {
    return res.status(403).json({ error: "Upgrade to Premium required to access this feature." });
  }
  next();
};

// 3. Require Admin Role (Exclusive Admin Access)
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Access forbidden. Admin privileges required." });
  }
  next();
};
```

---

## 📋 4. Implementation Roadmap for Access Control & Admin Dashboard

### Phase 1: Authentication & Next.js Middleware Protection
- [x] Configure Next.js Middleware (`middleware.ts`) to intercept all routes except `/`, `/login`, `/register`, and `/api/auth/*`.
- [x] Unauthenticated users requesting `/calculator`, `/stopwatch`, `/dashboard/*` are automatically redirected to `/login?redirect={targetRoute}`.

### Phase 2: Role-Based Navigation & UI Guards
- [x] Hide Admin Dashboard links from Free & Premium users.
- [x] Show "Upgrade to Premium" banners on AI Coach, Nutrition, and Workout pages for Free tier members.

### Phase 3: Admin Dashboard Control Center (`/dashboard/admin`)
- [ ] **System Metrics Overview**: Total registered users, active premium subscriptions, revenue analytics, 64-district activity breakdown.
- [ ] **User Management Table**: Filter by district, role (Free/Premium/Admin), subscription status, change user roles, suspend/activate accounts.
- [ ] **Branch Network Manager**: Manage gym locations across 64 districts in Bangladesh.
- [ ] **AI Model Parameters Control**: Monitor real-time Socket.IO chat tokens and AI response latency.

