# Fitora Backend API & Socket Server

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)](https://mongoosejs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?style=flat-square&logo=socket.io)](https://socket.io/)

The **Fitora Server** is an Express.js & TypeScript microservice providing RESTful endpoints, database persistence via MongoDB / Mongoose ODM, JWT authentication, and bidirectional Socket.IO real-time event broadcasting.

---

## 🏗️ Architecture & Core Components

```
server/
├── src/
│   ├── config/             # Database connection & server environment config
│   ├── controllers/        # Express request handlers
│   │   ├── auth.controller.ts          # Authentication, token generation & verification
│   │   ├── exercise.controller.ts      # Exercises catalog queries & filters
│   │   ├── goal.controller.ts          # Member fitness goals CRUD
│   │   ├── master.controller.ts        # Master Admin platform oversight
│   │   ├── payment.controller.ts       # Checkout, Stripe, bKash, renewal extension & invoices
│   │   ├── stopwatch.controller.ts     # Telemetry & custom rest presets
│   │   ├── user.controller.ts          # User management, health metrics & audit
│   │   └── workout.controller.ts       # Workout plans & advanced workout access
│   ├── middlewares/        # Security & authorization handlers
│   │   ├── auth.middleware.ts          # JWT token decoding & user payload attachment
│   │   └── premium.middleware.ts       # Pro / VIP tier gate with admin overrides
│   ├── models/             # Mongoose schemas & TypeScript ODM interfaces
│   │   ├── CustomRestPreset.model.ts   # User-defined stopwatch intervals
│   │   ├── Exercise.model.ts           # Exercise definitions & instructional data
│   │   ├── Goal.model.ts               # Target weight & workout frequency
│   │   ├── Payment.model.ts            # Payment transactions & invoice records
│   │   ├── User.model.ts               # User credentials, roles, plans & subscriptions
│   │   └── UserTier.model.ts           # Active tier validations & validity periods
│   ├── routes/             # Express routers
│   │   ├── index.ts                    # Central route registry & /health endpoint
│   │   ├── exercise.routes.ts          # /api/exercises
│   │   ├── payment.routes.ts           # /api/payments
│   │   ├── user.routes.ts              # /api/dashboard & /api/users
│   │   └── workout.routes.ts           # /api/workouts
│   ├── sockets/            # Real-time WebSocket connection handlers
│   └── server.ts           # Application entrypoint & HTTP server bootstrap
├── package.json
└── tsconfig.json
```

---

## 🔑 Key Features & Security

- **Server-Authoritative Pricing**: All membership tier pricing (`Basic Pass`, `Pro Athlete`, `VIP Ultimate`) is hard-coded and calculated strictly server-side. Client-sent prices are rejected.
- **Dynamic Subscription Renewal**: Automatically calculates new expiration dates from existing active `subscriptionExpiryDate` without lost days.
- **VIP / Pro Protection Middleware (`requirePremiumTier`)**: Protects `/api/workouts/advanced` and premium coaching endpoints with automatic bypass for `master_admin`, staff admins, and active subscribers.
- **Root Account Immutability**: Hardened code-level guard preventing accidental modification or deletion of `master@fitora.com`.
- **Health Metrics Synchronization**: Dedicated `/profile/health-metrics` endpoint syncing BMR and TDEE directly to athlete records.

---

## ⚙️ Environment Variables

Create `.env` in `server/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitora-db
JWT_SECRET=your_super_secret_jwt_key
CLIENT_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
```

---

## 🚀 Available Scripts

```bash
# Start development server with live watch (tsx)
npm run dev

# Compile TypeScript to dist/
npm run build

# Run production compiled server
npm run start
```
