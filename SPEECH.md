# Fitora Platform — 20-Day Team Lead Meeting Speeches (Moloy Paul)

---

# WEEK 1: Database Schemas, API Specs & UI Skeleton Setup

---

## Day 1

### Morning Kickoff Meeting
Good morning everyone. Welcome to our project Fitora. Today, we are setting up our initial database schemas and base UI skeletons across all sections.

My Personal Task Today (Moloy Paul - AI Chat & AI Trainer):
* I am creating the `AiMessage` database model in Mongoose (`server/src/models/AiMessage.model.ts`).
* I am building the `AiTrainerChat` UI container component with a prompt input box (`client/src/components/AiTrainerChat.tsx`).
* I will work on the global Header Navbar and Footer layout.
* Target: Push 2 structured commits to `origin/moloy`.

Team Tasks & Route Allocations:
* Alfaaz Ahmed: UserTier schema and main dashboard grid layout (`/`).
* Puskor Roy: WorkoutLog schema and GymTimer component.
* Simanto Paul: calculateBmi math utility and BmiCalculator range sliders.
* Gazi MD Saluddin: User schema and auth middleware.
* Simanto Poddar: MealPlan schema and MealChartCard component.

Let me know if anyone has setup questions. Thank you.

### Evening EOD Sync (Progress & Blockers)
Good evening team. Welcome to our Day 1 EOD sync.

Team Update:
Overall, the team completed Day 1 successfully. All initial schemas and base UI components have been built and tested with zero TypeScript errors.

My Personal Update (Moloy Paul):
* I completed the `AiMessage` Mongoose schema and built the `AiTrainerChat` UI container component.
* Integrated the top right AI Trainer layout on the dashboard matching our design reference mockup.
* Pushed both scheduled commits cleanly to `origin/moloy`.
* My Blockers: No blockers on my side.

Tomorrow for Day 2, we will move to backend API controllers. Good night.

---

## Day 2

### Morning Kickoff Meeting
Good morning team. Welcome to Day 2. Today, our focus is building Backend API Controllers and Express Routes.

My Personal Task Today (Moloy Paul - AI Chat & AI Trainer):
* I will create the `handleAiChat` controller function in `ai.controller.ts`.
* I will register the `POST /api/ai/chat` express route to handle client prompt requests.
* Target: Push 2 scheduled commits today.

Team Tasks:
* Alfaaz Ahmed: GET /api/dashboard/stats controller & routes.
* Puskor Roy: GET /api/workouts and POST /api/workouts/log endpoints.
* Simanto Paul: POST /api/nutrition/calculate endpoint.
* Gazi MD Saluddin: POST /api/auth/register and POST /api/auth/login with password hashing & JWT.
* Simanto Poddar: GET /api/meal-charts and POST /api/meal-charts endpoints.

Please work on your respective controller endpoints. Thank you.

### Evening EOD Sync (Progress & Blockers)
Good evening team. Welcome to our Day 2 EOD sync.

Team Update:
The team successfully implemented Express controllers for stats, AI chat prompts, workout logging, calculators, auth, and meal plans.

My Personal Update (Moloy Paul):
* I completed the `handleAiChat` controller and registered the `POST /api/ai/chat` route.
* Pushed both scheduled commits and verified endpoint responses.
* My Blockers: None.

Tomorrow for Day 3, we will build dedicated pages for all website links (`/plans`, `/trainers`, `/community`, `/stopwatch`, `/calculator`, `/login`, `/register`). Good night.

---

## Day 3

### Morning Kickoff Meeting
Good morning team. Today for Day 3, we are building dedicated page routes for every single link on the platform so that no link returns a 404 error.

My Personal Task Today (Moloy Paul):
* Building the `/trainers` directory page and `/community` leaderboard feed page.
* Creating `/dashboard/user/ai-coach` and `/dashboard/user/recovery` pages.
* Target: Push 2 scheduled commits today.

Team Tasks:
* Alfaaz Ahmed: `/plans` pricing page and `/dashboard/user/planner` route.
* Puskor Roy: Dedicated `/stopwatch` HUD page and `/dashboard/user/exercises` library.
* Simanto Paul: Standalone `/calculator` page with macro target gauges.
* Gazi MD Saluddin: `/login`, `/register`, `/profile`, `/notifications`, and `/settings` routes.
* Simanto Poddar: `/dashboard/user/nutrition` meal tracker page.

Let's make sure every navigation link across Navbar, Footer, and Sidebar works smoothly. Thank you.

### Evening EOD Sync (Progress & Blockers)
Good evening team. Welcome to our Day 3 EOD sync.

Team Update:
All 24 platform page routes are live and integrated with zero broken links.

My Personal Update (Moloy Paul):
* Built `/trainers`, `/community`, `/dashboard/user/ai-coach`, and `/dashboard/user/recovery` routes.
* Verified seamless routing and navigation.

Good job everyone!
