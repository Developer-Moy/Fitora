# 🏋️‍♂️ FITORA — Project Architecture & Feature Distribution

---

## 1. Project Architecture & Technology Stack

| Technology Layer | Implementation Details & Libraries |
| :--- | :--- |
| **Frontend Stack** | Next.js 16 (App Router), React 19, Strict TypeScript, Tailwind CSS v4, Lucide Icons, and Framer Motion |
| **Backend Stack** | Node.js, Express.js 4/5 (Strict TypeScript Architecture), Zod Schema Validation, JWT Authentication, and Bcrypt |
| **Database Management** | MongoDB Atlas (Cloud Cluster Engine) and Mongoose ODM with automated indexing and schemas |
| **Real-Time Communication & Telemetry** | Socket.IO (Live workout telemetry & turnstile check-in sync), Vercel (Client Web App), Render (Backend Service) |
| **Multi-AI Intelligent System** | Google Gemini AI (Google AI Studio API with multi-model fallback: `gemini-flash-latest`, `gemini-flash-lite-latest`, heuristic failover engine) & Groq Cloud / OpenAI architecture |
| **Payments & Access Governance** | Multi-Gateway Payments (Stripe, bKash, Nagad), 3-Day Free Pro Trial Engine, Card Retention System, Digital QR Code Turnstiles, and Master Admin RBAC |

---

## 2. 12 Full-Stack Feature Modules & Team Responsibility

### Team Lead (Member 1) — Moloy Krishna Paul
*Role: Full-Stack Architect, Core Authentication & AI Integration Lead (Branch: `moloy`)*

#### 1. Role-Based Authentication & Athlete Profile Hub
- Implemented multi-provider authentication (JWT, Google OAuth, BetterAuth session reconciliation).
- Built protected route guards, role authorization (Master Admin, Branch Admin, Athlete), and session recovery.
- Designed and developed the full Athlete Profile Hub with biometric metrics, avatar upload, and QR Gym Pass turnstile entry (`/profile`, `/profile/edit`).
- Implemented the automated 3-Day Pro Trial activation and Card Retention bonus engine.

#### 2. Multi-AI Fallback Engine & AI Coach Studio
- Architected Google Gemini AI Studio integration with automated multi-model discovery (`gemini-flash-latest`, `gemini-flash-lite-latest`).
- Engineered zero-downtime heuristic fallback engine ensuring 100% response uptime even during quota exhaustion.
- Built 24/7 AI Coach conversational studio with streaming responses and fitness query audit logging (`/api/ai/*`).

---

### Member 2 — Gazi Md. Salauddin
*Role: Core Feature Developer — Exercise Studio & Goals Engine (Branch: `salauddin`)*

#### 3. Exercise Catalog Engine & Video Movement Studio
- Built filterable and searchable exercise library with muscle group categorization and difficulty levels (`/exercises`).
- Integrated YouTube thumbnail cards with 280ms debounced hover video previews and LIVE coaching badges.
- Developed exercise detail modals with step-by-step coaching tips, sets, reps, and Personal Record (PR) tracking.

#### 4. Target Goal & Milestone Hub
- Implemented full CRUD fitness goal tracking system for weight loss, maintenance, and hypertrophy (`/api/goals/*`).
- Built active and archived goal management, target deadline projection, and 1RM strength calculations.
- Integrated VIP Pass Modal (`VipPassModal.tsx`) and turnstile access protection middleware.

---

### Member 3 — Simanto Paul
*Role: Fitness Calculations & Body Metrics Specialist (Branch: `simanto-paul`)*

#### 5. Scientific AI Macro Calculator & Health Engine
- Developed core calculation algorithms for scientific BMI, Mifflin-St Jeor BMR, and activity-based TDEE (`/calculator`).
- Engineered dynamic macronutrient distribution engine (Protein, Carbohydrates, Fats) with animated progress bars.
- Built reusable computation utilities: `calculateBmi.ts`, `calculateBmr.ts`, `calculateTdee.ts`, and `calculateMacros.ts`.

#### 6. Target Weight Timeline & Dynamic Hydration Tracker
- Built target weight timeline projection UI with weekly caloric deficit/surplus modeling.
- Developed dynamic daily hydration target calculator with profile database synchronization (`/api/users/profile/hydration-target`).
- Implemented athlete health assessment cards and automated PDF report export utilities.

---

### Member 4 — Simanto Poddar
*Role: Nutrition & Dietary Systems Specialist (Branch: `simanto-poddar`)*

#### 7. Progress Analytics Visualizer & Attendance Matrix
- Developed dynamic workout consistency scoring and body weight transformation analytics.
- Built 365-day monochrome gym attendance matrix and membership renewal countdown banners (`MembershipExpiryBanner.tsx`).
- Integrated terms, privacy, and legal documentation pages into the platform navigation.

#### 8. AI Nutrition Planner & Daily Meal Catalog
- Developed personalized nutrition plan engine and healthy meal catalog with category filters (`/meals`, `PersonalizedNutritionPlan.tsx`).
- Implemented backend Daily Meal Plan API (`GET /api/daily-plan/:userId`, `createMealChart`).
- Built daily calorie progress tracking bar, grocery list export action, and skeleton loading grids.

---

### Member 5 — Puskor Roy
*Role: Workout Telemetry & Timing Systems Specialist (Branch: `puskor_roy`)*

#### 9. Daily Workout Logger & Offline Telemetry Queue
- Developed authoritative workout logging engine with sets, reps, lifted weights, and calorie expenditure (`/api/workouts/log`).
- Engineered offline-first telemetry caching queue utilizing browser IndexedDB with automatic background MongoDB synchronization upon reconnect (`offlineQueueService.ts`).
- Built complete workout history log viewer with calendar analytics and exercise summary statistics.

#### 10. Circular HUD Stopwatch & Custom Rest Presets
- Developed interactive circular SVG HUD workout stopwatch with live countdown and audio alert cues (`GymTimer.tsx`, `stopwatch.tsx`, `/stopwatch`).
- Built custom rest interval preset engine with database persistence and premium access controls (`CustomRestPreset.model.ts`, `/api/stopwatch/*`).
- Integrated Member Billing & Payment History card with live subscription status tracking (`BillingSection.tsx`, `MembershipStatusCard.tsx`).

---

### Member 6 — Alfaaz Ahmed
*Role: Executive Dashboard, Search & Governance Specialist (Branch: `alfaaz`)*

#### 11. Advanced Global Search & Multi-Filter Engine
- Engineered debounced real-time global search bar across athletes, gym branches, and workout movements (`GlobalSearchBar.tsx`, `/api/search/*`).
- Implemented multi-parameter filtering by available equipment, division, and difficulty levels.
- Developed real-time notification bell dropdown with unread badge counter (`NotificationDropdown.tsx`).

#### 12. Executive Admin Dashboard & Report CSV/PDF Export
- Built executive command center dashboard displaying platform KPIs, monthly revenue progression, and branch occupancy telemetry (`/dashboard`, `MemberDashboardView.tsx`).
- Implemented server-side data export engines for monthly revenue reports and attendance CSV logs (`admin.controller.ts`).
- Implemented platform-wide security enhancements including Helmet headers and Express API rate limiting.
