# Implementation Plan - Fitora Fitness Planner Platform Setup

Setup the project directory structure for **Fitora**, including Next.js frontend with Tailwind CSS & TypeScript, Express.js backend with Mongoose & Socket.IO, and a visually impressive, clean home page showcasing the platform's core features.

## Proposed Architecture

`/mnt/File/Work/Fitora/`
- **`client/`**: Next.js (App Router), TypeScript, Tailwind CSS, `lucide-react`, `framer-motion`, `socket.io-client`.
- **`server/`**: Express.js server in TypeScript (`src/`), Socket.IO server, Mongoose (MongoDB ODM), CORS, `dotenv`, `tsx` for hot reloading.
- **Root level (`package.json`)**: Unified scripts to launch both frontend and backend seamlessly with `concurrently`.

---

## Proposed Changes

### Root Directory
- Create root `package.json` with workspace scripts (`dev`, `dev:client`, `dev:server`, `build`).
- Setup `.gitignore`, `README.md`, and `.env.example`.

### Frontend (`client/`)
- Initialize Next.js 14+ with App Router & TypeScript.
- Setup Tailwind CSS, Lucide icons, and `socket.io-client`.
- Clean up unused default Next.js boilerplate files (e.g. `public/next.svg`, `public/vercel.svg`, default demo CSS).
- Create a modern, responsive landing page for **Fitora**:
  - Hero Section: Dark glassmorphism design with dynamic CTAs, AI Trainer callouts, real-time stats.
  - Core Features Grid: Real-time Gym Timer & Tracker (Socket.IO powered), AI Chat & Trainer, Nutrition & BMI Calculator, Premium Meal Charts & Membership.
  - Interactive Preview / Status Component: Live Socket.IO connection status indicator.
  - Navbar & Footer.

### Backend (`server/`)
- Initialize Node.js + Express.js app in TypeScript (`src/server.ts`, `src/config/db.ts`, `src/sockets/index.ts`).
- Setup `mongoose` connection handler (MongoDB).
- Setup `socket.io` HTTP server wrapper for real-time events (Timer synchronization, AI Chat, alerts).
- Setup basic health-check API endpoint (`GET /api/health`).
- Setup `.env` configuration file.

---

## Verification Plan

### Automated Verification
- Verify TypeScript compilation for `client` and `server`: `npm run build` or `npx tsc --noEmit`.
- Verify npm dependencies installed properly in both `client` and `server`.

### Manual Verification
- Start `client` and `server` dev servers using `npm run dev`.
- Verify the server connects on port `5000` (or `5001`) with Socket.IO initialized.
- Verify the Next.js frontend renders smoothly on port `3000` with zero console errors or unused boilerplate styling.
