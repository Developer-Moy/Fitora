# Fitora - AI-Powered Realtime Fitness Planner Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?style=flat-square&logo=mongodb)](https://mongoosejs.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?style=flat-square&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

**Fitora** is a full-stack, real-time fitness planner platform designed for health enthusiasts and individuals committed to achieving peak physical fitness. Powered by Next.js, Express, Mongoose ODM, and Socket.IO bidirectional web-sockets, Fitora provides seamless real-time workout tracking, AI-assisted training, and nutrition analytics.

---

## 🌟 Core Features & Modules

- 🏋️ **Real-Time Gym Timer & Exercise Tracker**: Live bidirectional synchronization of active rest timers and workout progress across multiple devices via Socket.IO.
- 🤖 **AI Chat & AI Trainer**: Instant real-time feedback, routine adjustments, and personalized workout suggestions without page reloads.
- 📊 **Dashboard & Analytics**: Comprehensive overview of personal health metrics, goal progress, and historical logs.
- 🥗 **Nutrition & BMI Calculator**: Instant calculation of Body Mass Index, TDEE, and schema-validated macronutrient splits.
- 🎯 **Set Goal & Habit Tracker**: Set and track personalized daily and weekly fitness milestones.
- 👑 **User Management & Premium Membership**: Role-based access control (Standard vs. Premium tiers).
- 🍽️ **Premium Meal Charts**: Custom nutritional charts and meal plans for premium subscribers.
- 📢 **Gym-Related Ads & System Alerts**: Real-time broadcast alerts for achievements, ads, and membership status updates.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Realtime**: Socket.IO Client

### Backend (`/server`)
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Language**: TypeScript (`tsx` engine)
- **Realtime**: Socket.IO Server
- **Security & Config**: CORS, Dotenv

---

## 📁 Repository Structure

```
Fitora/
├── client/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # UI Components
│   │   ├── context/        # React Context & Socket Providers
│   │   ├── hooks/          # Custom Hooks (useSocket, useAuth, etc.)
│   │   ├── services/       # API & Socket Services
│   │   ├── types/          # Frontend TypeScript Interfaces
│   │   └── utils/          # Helper Functions
│   ├── .env.example        # Environment Variables Template
│   └── package.json
│
├── server/                 # Express.js Backend API & Socket Server
│   ├── src/
│   │   ├── config/         # Database & Server Config
│   │   ├── controllers/    # Route Controllers
│   │   ├── middlewares/    # Auth, Error & Validation Middlewares
│   │   ├── models/         # Mongoose Schemas & ODM Models
│   │   ├── routes/         # Express API Routes
│   │   ├── services/       # Business Logic Services
│   │   ├── sockets/        # Socket.IO Event Handlers
│   │   ├── types/          # Backend TypeScript Interfaces
│   │   └── utils/          # Helper Utilities
│   ├── .env.example        # Environment Variables Template
│   └── package.json
│
├── package.json            # Root Workspace Script Runner (concurrently)
├── .gitignore              # Root Git Ignore Policy
└── README.md               # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **NPM**: v9.x or higher
- **MongoDB**: Local MongoDB server or MongoDB Atlas URI

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Fitora
   ```

2. **Configure Environment Variables**:
   - Copy `.env.example` in `client/` to `client/.env`
   - Copy `.env.example` in `server/` to `server/.env`

3. **Install Dependencies**:
   ```bash
   # Install root concurrently runner
   npm install

   # Install client dependencies
   cd client && npm install

   # Install server dependencies
   cd ../server && npm install
   ```

4. **Run Development Mode**:
   From the root `Fitora/` directory:
   ```bash
   npm run dev
   ```
   - **Frontend App**: `http://localhost:3000`
   - **Backend API & Socket Server**: `http://localhost:5000`

---

## 📄 License
This project is licensed under the MIT License.
