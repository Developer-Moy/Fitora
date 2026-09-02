# 📋 FITORA Teamwork & Jira Task Allocation Plan

**Sprint Date:** 02-Sep-2026  
**Project:** Fitora (Full-Stack AI Gym & Fitness Ecosystem)  
**Lead / Manager:** Moloy Krishna Paul ([@Developer-Moy](https://github.com/Developer-Moy))

---

## 👥 Team Work Distribution Matrix (6 Members)

| Member | Focus Area | Module Scope | Assigned Jira Task |
| :--- | :--- | :--- | :--- |
| **1. Moloy (Lead)** | Frontend / Subscription Flow | Homepage Pricing & Payment Checkout | `FIT-TASK-101`: Complete Package Section & Modal Subscription Flow |
| **2. Alfaaz** | Backend / Branch Operations | Branch Admin Management | `FIT-TASK-102`: Branch Member Check-in & Realtime Occupancy API |
| **3. Simanto Paul** | Frontend / Health Calculators | Health Metrics Expansion | `FIT-TASK-103`: BMR & TDEE Daily Calorie Calculator Integration |
| **4. Simanto Poddar** | Fullstack / Nutrition | Meals & Diet Plans | `FIT-TASK-104`: Meals Dietary Filter (Keto/Bulking) & Daily Plan Sync |
| **5. Salauddin** | Fullstack / Goals | Member Progress & Targets | `FIT-TASK-105`: Member Fitness Goals Visual Widget & CRUD API Sync |
| **6. Puskor** | Fullstack / Workout Logs | Exercise Catalog & Tracker | `FIT-TASK-106`: Exercise Tracker Logging & Set/Rep Session History |

---

## 📝 Detailed Jira Task Breakdown

### 🎯 1. Moloy (`FIT-TASK-101`)
* **Summary:** Complete Homepage Package Section & Subscription Checkout Flow
* **Scope:**
  - Standardized `PricingSection.tsx` with dynamic monthly vs annual pricing & savings calculations.
  - Built interactive single-screen `SubscriptionModal.tsx` supporting bKash, Nagad, and Card (Visa/Mastercard) payments without vertical scrollbar.
  - Implemented smart authentication routing: automatic redirect to `/register?plan=...` for guest visitors and instant in-app checkout modal for logged-in athletes.
  - Synchronized active subscription tier (`Basic Pass`, `Pro Athlete`, `VIP Ultimate`) with `useDashboardRole`, local session state, and Member Dashboard.
* **Status:** `COMPLETED` ✅

---

### 🏢 2. Alfaaz (`FIT-TASK-102`)
* **Summary:** Branch Member Check-in & Realtime Occupancy API
* **Scope:**
  - Build `POST /api/branches/:id/checkins` to log physical gym check-ins.
  - Add branch capacity indicator UI in Branch Admin view (`BranchManagementView.tsx`).
  - Retrieve real-time member check-in history for branch managers.
* **Status:** `IN PROGRESS` 🚀

---

### 🔢 3. Simanto Paul (`FIT-TASK-103`)
* **Summary:** BMR & TDEE Daily Calorie Calculator Integration
* **Scope:**
  - Extend `/calculator` with BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure) calculation algorithms.
  - Implement dynamic activity level multipliers (Sedentary, Light, Moderate, Heavy).
  - Add local history storage for calculated fitness metrics.
* **Status:** `IN PROGRESS` 🚀

---

### 🥗 4. Simanto Poddar (`FIT-TASK-104`)
* **Summary:** Meals Dietary Filter (Keto/Bulking) & Daily Plan Sync
* **Scope:**
  - Add interactive category chips (Bulking, Cutting, Keto, Vegan, High-Protein) to `/meals`.
  - Add calorie range slider and instant food search.
  - Implement "Add to Daily Meal Plan" button synced with the Member Dashboard nutrition progress bar.
* **Status:** `IN PROGRESS` 🚀

---

### 🎯 5. Salauddin (`FIT-TASK-105`)
* **Summary:** Member Fitness Goals Visual Widget & CRUD API Sync
* **Scope:**
  - Create "My Fitness Goals" visual widget in `/dashboard` (Current Weight vs Target Weight progress bar, target date countdown).
  - Connect widget with backend CRUD endpoints (`GET/POST/PUT /api/goals`).
  - Allow athletes to update their weight goals and view milestone achievement badges.
* **Status:** `IN PROGRESS` 🚀

---

### 🏋️ 6. Puskor (`FIT-TASK-106`)
* **Summary:** Exercise Tracker Logging & Set/Rep Session History
* **Scope:**
  - Connect `ExerciseTracker.tsx` on `/exercises` with `POST /api/workouts/log`.
  - Provide interactive sets, reps, and weight input counters for each workout session.
  - Render user workout session history list in the athlete dashboard.
* **Status:** `IN PROGRESS` 🚀

---

## 🔒 Merge & Conflict Prevention Guidelines
1. **Branch Isolation**: Every developer must work on their own branch (`alfaaz`, `simanto-paul`, `simanto-poddar`, `salauddin`, `puskor`, `moloy`).
2. **Pre-push Verification**: Always run `npm run build` in both `client/` and `server/` before opening a Pull Request.
3. **No Direct Master Push**: All feature branches must be merged into `development` via GitHub PR reviews.
