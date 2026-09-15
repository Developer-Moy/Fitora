<div align="center">

# ⚙️ Fitora Server — Backend REST API & Realtime Socket Microservice

> **High-Performance Node.js & Express API Microservice with MongoDB Atlas & Socket.IO**  
> Serving athlete telemetry, gym turnstile check-ins, multi-gateway payments, and administrative controls across Bangladesh.

[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-black?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js 4](https://img.shields.io/badge/Express.js-4.19-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB Mongoose](https://img.shields.io/badge/MongoDB-Mongoose_ODM-black?style=for-the-badge&logo=mongodb)](https://mongoosejs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT_Bearer-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)

[📖 **Root Documentation**](../README.md) • [💻 **Frontend Client**](../client/README.md) • [🌐 **Live Application**](https://fitora-fitness.vercel.app)

</div>

---

## 📑 Table of Contents

- [🏗️ Architecture & Core Components](#️-architecture--core-components)
- [📡 Complete REST API Endpoints Catalog](#-complete-rest-api-endpoints-catalog)
- [💼 Business Logic Services Layer](#-business-logic-services-layer)
- [🗄️ Database Models & Schema Invariants](#️-database-models--schema-invariants)
- [🛡️ Security, Authorization & Middleware](#️-security-authorization--middleware)
- [⚡ Real-Time Socket.IO Telemetry](#-real-time-socketio-telemetry)
- [⚙️ Environment Variables Configuration](#️-environment-variables-configuration)
- [🚀 Available Scripts & Startup](#-available-scripts--startup)

---

## 🏗️ Architecture & Core Components

The Fitora backend is organized according to the **Model-Controller-Service-Route (MCSR)** pattern:

```
server/
├── src/
│   ├── config/                     # Database connection & server environment configurations
│   ├── controllers/                # Request validation & HTTP response orchestration
│   │   ├── auth.controller.ts      # Authentication, registration & 3-day trial initialization
│   │   ├── branch.controller.ts    # 64 branch directory & attendance turnstile logging
│   │   ├── exercise.controller.ts  # Workout catalog queries & muscle group filters
│   │   ├── master.controller.ts    # Master Admin oversight, facets & revenue aggregation
│   │   ├── meal.controller.ts      # Healthy nutrition recipes & search
│   │   ├── notification.controller.ts # Notification center & unread counts
│   │   ├── payment.controller.ts   # Checkout, renewal extension & invoice generation
│   │   ├── stopwatch.controller.ts # Gym rest timer sessions & telemetry
│   │   ├── user.controller.ts      # User management, consistency streaks & saved cards
│   │   └── workout.controller.ts   # Workout logging & advanced plan access
│   ├── middlewares/                # Security, authorization & validation handlers
│   │   ├── auth.middleware.ts      # JWT decoding, user payload & superuser bypass
│   │   └── premium.middleware.ts   # Pro / VIP tier gate with admin overrides
│   ├── models/                     # Mongoose schemas & TypeScript interfaces
│   │   ├── Branch.model.ts         # Nationwide branch directory (64 branches)
│   │   ├── BranchCheckin.model.ts  # QR turnstile check-in records
│   │   ├── Exercise.model.ts       # Exercise library definitions
│   │   ├── Meal.model.ts           # Nutrition recipes & macro data
│   │   ├── Notification.model.ts   # In-app notifications
│   │   ├── Payment.model.ts        # Completed payment transactions & invoices
│   │   ├── StopwatchSession.model.ts # Stopwatch workout duration telemetry
│   │   ├── User.model.ts           # User accounts with trial, saved card & schema guard
│   │   ├── UserTier.model.ts       # Tier validity periods & capabilities
│   │   └── WorkoutLog.model.ts     # User exercise logs & calories burned
│   ├── routes/                     # Express route declarations
│   │   ├── index.ts                # Master router mounting all sub-routes & /health
│   │   ├── auth.routes.ts          # /api/auth
│   │   ├── branch.routes.ts        # /api/branches
│   │   ├── exercise.routes.ts      # /api/exercises
│   │   ├── meal.routes.ts          # /api/meals
│   │   ├── notification.routes.ts  # /api/notifications
│   │   ├── payment.routes.ts       # /api/payments
│   │   ├── user.routes.ts          # /api/users & /api/users/saved-card
│   │   └── workout.routes.ts       # /api/workouts
│   ├── services/                   # Business logic calculations
│   │   ├── payment.service.ts      # Pricing, renewal extension & retention calculation
│   │   ├── calorieEstimation.service.ts # Metabolic & BMR calculations
│   │   └── ai.service.ts           # AI coach integration logic
│   ├── sockets/                    # Real-time WebSocket connection handlers
│   └── server.ts                   # Express application entrypoint & bootstrap
├── package.json                    # Backend dependencies & npm scripts
└── tsconfig.json                   # Server TypeScript configuration
```

---

## 📡 Complete REST API Endpoints Catalog

### 🔐 Authentication & Session (`/api/auth`)

| Method | Endpoint                    |    Access     | Description                                                                |
| :----- | :-------------------------- | :-----------: | :------------------------------------------------------------------------- |
| `POST` | `/api/auth/register`        |    Public     | Register new athlete; automatically triggers **3-Day Free Premium Trial**. |
| `POST` | `/api/auth/login`           |    Public     | Standard member login; returns signed JWT and trial/membership metadata.   |
| `POST` | `/api/auth/dashboard-login` |  Admin Only   | Admin login strictly restricted to `master_admin` and `branch_admin`.      |
| `GET`  | `/api/auth/me`              | Authenticated | Fetches current user profile, active trial status, and saved card flags.   |
| `POST` | `/api/auth/logout`          | Authenticated | Invalidates session and clears active cookies.                             |

### 👤 User Profile & Wallet Management (`/api/users`)

| Method   | Endpoint                            |    Access     | Description                                                                |
| :------- | :---------------------------------- | :-----------: | :------------------------------------------------------------------------- |
| `PATCH`  | `/api/users/profile`                | Authenticated | Update athlete bio, phone, assigned branch, and fitness goals in MongoDB.  |
| `PATCH`  | `/api/users/profile/health-metrics` | Authenticated | Persist BMR, TDEE, height, and weight to athlete record.                   |
| `GET`    | `/api/users/activity/streak`        | Authenticated | Dynamic consistency streak calculation, milestone badges & 180-day matrix. |
| `POST`   | `/api/users/saved-card`             | Authenticated | Securely save masked payment card details to user profile in MongoDB.      |
| `DELETE` | `/api/users/saved-card`             | Authenticated | Remove saved card from authenticated user profile.                         |

### 💳 Payments, Invoicing & Subscriptions (`/api/payments`)

| Method | Endpoint                          |    Access     | Description                                                                                   |
| :----- | :-------------------------------- | :-----------: | :-------------------------------------------------------------------------------------------- |
| `POST` | `/api/payments/checkout`          | Authenticated | Server-authoritative checkout (bKash, Nagad, Card, Stripe) with 90-day retention bonus logic. |
| `GET`  | `/api/payments/me`                | Authenticated | Retrieve athlete's complete transaction ledger and active subscription details.               |
| `GET`  | `/api/payments/invoices/:id/pdf`  | Authenticated | Download vector PDF invoice for a completed payment.                                          |
| `POST` | `/api/payments/toggle-auto-renew` | Authenticated | Toggle subscription auto-renewal without losing active paid period benefits.                  |
| `POST` | `/api/payments/change-plan`       | Authenticated | Switch membership tier (Basic Pass, Pro Athlete, VIP Ultimate) dynamically.                   |

### 🏋️ Workouts & Exercises (`/api/workouts`, `/api/exercises`)

| Method   | Endpoint                               |    Access     | Description                                                                      |
| :------- | :------------------------------------- | :-----------: | :------------------------------------------------------------------------------- |
| `GET`    | `/api/exercises`                       | Authenticated | Retrieve exercise directory with category, difficulty, and muscle group filters. |
| `GET`    | `/api/workouts/advanced`               | Premium/Admin | Gated advanced workout routines protected by `requirePremiumTier`.               |
| `POST`   | `/api/workouts/log`                    | Authenticated | Log completed workout session with exercises, duration, and calories burned.     |
| `GET`    | `/api/workouts/log`                    | Authenticated | Retrieve chronological workout history and summary for an athlete.               |
| `DELETE` | `/api/workouts/log/:id`                | Authenticated | Delete a specific logged workout entry.                                          |
| `GET`    | `/api/workouts/pr-history/:exerciseId` | Authenticated | Fetch athlete personal record (1RM) history for a specific exercise.             |

### 📏 BMI & Health Metrics (`/api/bmi`)

| Method   | Endpoint               |    Access     | Description                                                                           |
| :------- | :--------------------- | :-----------: | :------------------------------------------------------------------------------------ |
| `POST`   | `/api/bmi/history`     | Optional Auth | Save BMI calculation record with auto-binding to authenticated athlete or guest user. |
| `GET`    | `/api/bmi/history`     | Optional Auth | Retrieve chronological BMI calculation history for athlete.                           |
| `DELETE` | `/api/bmi/history/:id` | Optional Auth | Delete individual BMI ledger record.                                                  |

### 🏢 Branches & Attendance (`/api/branches`)

| Method | Endpoint                           |    Access     | Description                                                                        |
| :----- | :--------------------------------- | :-----------: | :--------------------------------------------------------------------------------- |
| `GET`  | `/api/branches/public`             |    Public     | List all 64 nationwide branches with server-side regex search and division filter. |
| `POST` | `/api/branches/checkin`            | Authenticated | Turnstile contactless check-in via athlete QR code scan.                           |
| `GET`  | `/api/branches/:branchId/checkins` |  Admin Only   | Live attendance stream with dynamic search by member name or email.                |

### 🔔 Notifications (`/api/notifications`)

| Method  | Endpoint                      |    Access     | Description                                             |
| :------ | :---------------------------- | :-----------: | :------------------------------------------------------ |
| `GET`   | `/api/notifications`          | Authenticated | Fetch newest notifications with dynamic unread counter. |
| `PATCH` | `/api/notifications/:id/read` | Authenticated | Mark individual notification as read.                   |
| `PATCH` | `/api/notifications/read-all` | Authenticated | Mark all notifications as read.                         |

---

## 💼 Business Logic Services Layer

Business calculations are separated from Express controllers inside `server/src/services/`:

- **`payment.service.ts`**:
  - `MEMBERSHIP_PLANS`: Server-authoritative plan catalog and pricing specifications.
  - `resolvePlan()`: Canonical plan key resolution.
  - `generateInvoiceNumber()`: Cryptographic invoice serial generator (`INV-YYYY-XXXXXX`).
  - `calculateSubscriptionDetails()`: Renewal duration and remaining days calculation.
  - `calculateRetentionExpiry()`: Computes **90-day retention bonus** (3 months for 1 month price) when saving a card on monthly subscriptions.
- **`calorieEstimation.service.ts`**:
  - Implements the Mifflin-St Jeor formula to compute accurate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).

---

## 🗄️ Database Models & Schema Invariants

### 1. Single Master Admin Schema Invariant (`User.model.ts`)

```typescript
userSchema.pre("save", function (next) {
  if (this.role === "master_admin") {
    const cleanEmail = (this.email || "").toLowerCase().trim();
    if (cleanEmail !== "master@fitora.com") {
      return next(
        new Error(
          "Only master@fitora.com can be Master Admin. Multiple master admins are strictly prohibited.",
        ),
      );
    }
  }
  next();
});
```

### 2. User Document Highlights

- `trialExpiresAt`: Timestamp defining the expiration of the 3-Day Free Premium Trial.
- `bonusMonthsAwarded`: Counter tracking retention bonus months granted to the member.
- `savedCard`: Masked payment card metadata (`last4`, `brand`, `expiryMonth`, `expiryYear`, `cardHolder`, `savedAt`).
- `qrCodeId`: High-contrast unique string encoded into the member's digital gym pass.

---

## 🛡️ Security, Authorization & Middleware

1. **`auth.middleware.ts`**:
   - Validates incoming `Authorization: Bearer <JWT>` headers.
   - Decodes `userId`, `email`, and `role`.
   - Incorporates superuser privileges for `master@fitora.com`.
2. **`premium.middleware.ts` (`requirePremiumTier`)**:
   - Gates advanced workouts, personalized nutrition, and AI coach features.
   - Grants automatic access to active subscribers, users on their active 3-Day Free Trial, and administrators.

---

## ⚡ Real-Time Socket.IO Telemetry

The server runs an integrated Socket.IO server on port 5000:

- **`connection`**: Handshake and room assignment by branch or user ID.
- **`branch:checkin`**: Broadcasts live turnstile check-in events to branch admin dashboards.
- **`timer:sync`**: Synchronizes rest timer HUD telemetry across open athlete sessions.

---

## ⚙️ Environment Variables Configuration

Create `.env` in `server/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitora-db?retryWrites=true&w=majority
JWT_SECRET=FITORA_SUPER_SECRET_JWT_KEY_2026_PRODUCTION
CLIENT_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_51...
```

---

## 🚀 Available Scripts & Startup

```bash
# 1. Start development server with live watch (tsx)
npm run dev

# 2. Compile TypeScript to production dist/ (Zero-Error Policy)
npm run build

# 3. Start production server
npm run start
```
