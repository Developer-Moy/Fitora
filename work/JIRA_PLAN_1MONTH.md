# 🚀 Fitora Platform — 1-Month (30 Days / 20 Working Days) Jira Execution Plan

## 👥 Team Section Allocations (2 Sections per Developer)

| Developer | Primary Section | Secondary Section | Core Focus Technologies |
| :--- | :--- | :--- | :--- |
| **Dev 1** | 📊 Dashboard | 👑 Premium Membership | Next.js Components, Stripe/Payment Mock, Charts.js/Recharts, User Tier Guard |
| **Dev 2** | 🤖 AI Chat | 🏋️‍♂️ AI Trainer | Socket.IO Client/Server, Gemini/OpenAI API Integration, Chat UI Stream |
| **Dev 3** | ⏱️ GYM Timer | 🏃 Exercise Tracker | Socket.IO WebSockets Sync, Workout Schemas, Dynamic Timer Hooks, Audio Web API |
| **Dev 4** | ⚖️ BMI Calculator | 🥗 Nutrition Calculator | Math Formula Utilities, Macro Ratio Generators, Dynamic Slider Components, Mongoose Models |
| **Dev 5** | 👤 User Management | 🎯 Set Goal | JWT Auth, Role-based Middleware, Goal Progression Schemas, Profile UI |
| **Dev 6** | 🍽️ Premium Meal Chart | 📢 Gym-related Ads | Relational Mongoose Schemas, Meal Plan Filters, Ad Rotation Engine, Banner UI |

---

## 🎯 Git Commit & Code Review Policy
- **Minimum Commits per Dev**: **10 Commits minimum** (Minimum 2-3 meaningful, feature-based commits per week).
- **Commit Naming Convention**: `feat(module): description`, `fix(module): description`, `docs(module): description`.
- **Sprint Schedule**: 4 Weeks, 5 Working Days per week (Days 1–20).

---

# 📅 WEEK 1: Database Schemas, API Specs & UI Component Skeleton

### Day 1: Setup, Schemas & Base Architecture
- **Dev 1**: Define `UserTier` & `Subscription` Mongoose models. Create Dashboard Layout skeleton in Next.js. *(Commit #1)*
- **Dev 2**: Define `AiMessage` and `AiPrompt` Mongoose schemas. Setup basic AI Chat UI input component. *(Commit #1)*
- **Dev 3**: Define `WorkoutLog` and `Exercise` Mongoose models. Setup basic Gym Timer component UI. *(Commit #1)*
- **Dev 4**: Build BMI formula utilities (`utils/calculateBmi.ts`) and create basic BMI Input Form. *(Commit #1)*
- **Dev 5**: Setup JWT Auth Mongoose `User` model with password hashing & auth validation middlewares. *(Commit #1)*
- **Dev 6**: Define `MealPlan` and `AdBanner` Mongoose models. Create Meal Chart card UI skeleton. *(Commit #1)*

### Day 2: API Endpoints & Core Logic (Part 1)
- **Dev 1**: Build `/api/dashboard/stats` controller & route for user metrics summary. *(Commit #2)*
- **Dev 2**: Setup Express backend `/api/ai/chat` POST route for initial AI prompt handling. *(Commit #2)*
- **Dev 3**: Create Express `/api/workouts` GET & POST routes for logging exercises. *(Commit #2)*
- **Dev 4**: Build Nutrition Calculator utility (`utils/calculateMacros.ts`) for TDEE & Macros (Protein, Carbs, Fat). *(Commit #2)*
- **Dev 5**: Build Auth Controllers (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`). *(Commit #2)*
- **Dev 6**: Build `/api/meal-charts` GET & POST endpoints for creating meal plans. *(Commit #2)*

### Day 3: UI Layout & Interactive Forms (Part 1)
- **Dev 1**: Create Premium Membership Pricing Plan card components (`Standard` vs `Premium`).
- **Dev 2**: Design responsive AI Trainer Chat container with dark glassmorphic styling.
- **Dev 3**: Build Interactive Exercise Library Grid component with category filters (Chest, Back, Legs).
- **Dev 4**: Build Interactive BMI Calculator component with range sliders (Height, Weight, Age).
- **Dev 5**: Build User Registration & Login modal/pages with form validation (`zod`/`react-hook-form`).
- **Dev 6**: Create Gym Ad Banner carousel/component with close & click tracking.

### Day 4: API Controller Validation & Auth Middleware
- **Dev 1**: Add authorization middleware (`requirePremium`) to protect premium dashboard analytics.
- **Dev 2**: Integrate rate-limiting middleware for AI Chat API routes to prevent API quota abuse.
- **Dev 3**: Create `/api/workouts/:id` PUT/DELETE routes for editing logged exercise sets.
- **Dev 4**: Create `/api/nutrition/calculate` POST endpoint to validate and store macro queries in MongoDB.
- **Dev 5**: Build User Profile update controller (`/api/users/profile`) with avatar & bio fields.
- **Dev 6**: Build `/api/ads/active` GET route with target filters (Standard vs Premium user ads).

### Day 5: Sprint 1 Review & Commit Verification
- **Dev 1–6**: Perform code reviews, test MongoDB queries, and verify **Commit #3** per developer.
- **Milestone**: All database models, basic CRUD endpoints, and initial component skeletons merged into `main` branch.

---

# 📅 WEEK 2: Core Feature Logic & Business Services

### Day 6: Realtime Engine & Advanced Logic Setup
- **Dev 1**: Integrate Recharts/Chart.js into Dashboard for weekly workout duration & calories burned. *(Commit #4)*
- **Dev 2**: Setup Socket.IO namespace for AI Chat (`io.of('/ai-chat')`) for live typing responses. *(Commit #4)*
- **Dev 3**: Setup Socket.IO events for Gym Timer (`timer:start`, `timer:pause`, `timer:sync`) across devices. *(Commit #4)*
- **Dev 4**: Add Macro Distribution selector (Keto, High Protein, Balanced) to Nutrition Calculator. *(Commit #4)*
- **Dev 5**: Create `Goal` Mongoose schema & build `/api/goals` CRUD routes (Target Weight, Weekly Workouts). *(Commit #4)*
- **Dev 6**: Create `/api/meal-charts/premium` route with tier check middleware for exclusive meal recipes. *(Commit #4)*

### Day 7: Component State & Custom Hooks
- **Dev 1**: Build `useMembership` custom hook for checking active subscription status in Next.js.
- **Dev 2**: Create `useAiTrainer` hook for managing chat state, audio playback, and prompt history.
- **Dev 3**: Create `useGymTimer` hook with Web Audio API sound alerts when rest period finishes. *(Commit #5)*
- **Dev 4**: Create `useNutritionCalculator` hook for instant real-time TDEE recalculation on slider change.
- **Dev 5**: Build `GoalSetter` interactive modal for updating active fitness goals. *(Commit #5)*
- **Dev 6**: Build `MealChartFilter` component by calorie budget and dietary restrictions (Vegan, Keto).

### Day 8: Integration & State Connection
- **Dev 1**: Connect Dashboard UI to live backend `/api/dashboard/stats` API endpoint.
- **Dev 2**: Connect AI Chat UI with Socket.IO stream to display live streaming AI Trainer responses.
- **Dev 3**: Connect Exercise Tracker UI with workout logger API (`POST /api/workouts/log`).
- **Dev 4**: Connect Nutrition & BMI Calculator results with user profile auto-sync.
- **Dev 5**: Build User Management Admin panel UI (View users, upgrade/downgrade subscription tier).
- **Dev 6**: Build Ad Rotation Engine logic (automatically cycle ads every 15 seconds).

### Day 9: Edge Cases & Error Handling
- **Dev 1**: Handle empty state UI for Dashboard when new user has 0 logged workouts.
- **Dev 2**: Add fallback offline message handling for AI Chat when AI API is unavailable.
- **Dev 3**: Handle background tab timer throttling issues using Web Workers / Server Timestamp sync.
- **Dev 4**: Add input validation bounds (e.g. Height: 50-250cm, Weight: 20-300kg) to Calculators.
- **Dev 5**: Handle expired JWT token refresh logic & auto logout behavior.
- **Dev 6**: Handle image lazy loading and fallback placeholders for Meal Chart recipe photos.

### Day 10: Sprint 2 Review & Integration Check
- **Dev 1–6**: Test full workflow between Client and Server. Verify **Commit #6** per developer.
- **Milestone**: Feature modules connected with backend routes and state hooks.

---

# 📅 WEEK 3: Socket.IO Realtime Sync, AI Intelligence & Advanced UX

### Day 11: Realtime Synchronization Refinement
- **Dev 1**: Build Premium Member Badge & Exclusive Feature Lock overlays for Non-Premium Users. *(Commit #7)*
- **Dev 2**: Implement AI Trainer Workout Suggestion engine (analyzes recent user workout history). *(Commit #7)*
- **Dev 3**: Test multi-device Socket.IO timer sync (Phone & Laptop timer state in perfect sync). *(Commit #7)*
- **Dev 4**: Build Nutrition Progress Ring visualizers & BMI Gauge meter component. *(Commit #7)*
- **Dev 5**: Build Real-Time Goal Progress Bar (e.g., "3 of 5 Workouts Completed This Week"). *(Commit #7)*
- **Dev 6**: Build Sponsored Gym Ads analytics endpoint (log impression & click counts). *(Commit #7)*

### Day 12: Advanced UI Micro-Animations & Dark Theme Polish
- **Dev 1**: Add Framer Motion animations to Dashboard widgets and stat counters.
- **Dev 2**: Add AI voice waveform animation during AI Trainer response streaming.
- **Dev 3**: Add progress circle animation to Gym Timer with dynamic color change (Green -> Yellow -> Red).
- **Dev 4**: Add smooth sliding animations to BMI & Nutrition slider inputs.
- **Dev 5**: Add celebration confetti effect when a user completes a Set Goal.
- **Dev 6**: Add hover zoom effects and glassmorphism styling to Premium Meal Chart cards.

### Day 13: Cross-Module Feature Communication
- **Dev 1 & Dev 5**: Connect Goal progress updates directly to Dashboard main stats widgets.
- **Dev 2 & Dev 3**: Allow AI Trainer to automatically read active Exercise Tracker logs to suggest weights.
- **Dev 4 & Dev 6**: Connect Nutrition Calculator output directly to recommend matching Premium Meal Charts.

### Day 14: Data Persistence & Security Audit
- **Dev 1**: Implement Stripe Checkout / Mock Payment Webhook for instant Premium Upgrade. *(Commit #8)*
- **Dev 2**: Sanitize AI Chat inputs against prompt injection & save chat transcripts to MongoDB. *(Commit #8)*
- **Dev 3**: Optimize Exercise Tracker MongoDB indexing (`userId + createdAt`) for rapid query execution. *(Commit #8)*
- **Dev 4**: Save historical BMI & Nutrition calculation logs to user history timeline. *(Commit #8)*
- **Dev 5**: Implement Password Reset via Email / Token & Role-Based Access Control (RBAC). *(Commit #8)*
- **Dev 6**: Secure Ad Management routes so only Admin users can create/delete Gym Ads. *(Commit #8)*

### Day 15: Sprint 3 Review & Full Feature Freeze
- **Dev 1–6**: All 12 Sections completed. Feature freeze applied. Verify **Commit #8-#9** per developer.

---

# 📅 WEEK 4: Testing, Performance Optimization, Polish & Deployment

### Day 16: End-to-End (E2E) Flow Testing
- **Dev 1**: Test complete Premium Upgrade user journey (Standard -> Payment -> Premium Dashboard).
- **Dev 2**: Test AI Trainer response accuracy, edge case prompts, and socket connection drops.
- **Dev 3**: Test Gym Timer performance under low network connection / packet loss.
- **Dev 4**: Test BMI & Nutrition calculations against standard medical formulas.
- **Dev 5**: Test User Registration, Login, Session Timeout, and Goal Creation lifecycle.
- **Dev 6**: Test Meal Chart filters across 50+ recipe datasets and Ad rotation accuracy.

### Day 17: Performance Optimization & Lighthouse Audit
- **Dev 1 & Dev 4**: Optimize bundle size, dynamic imports, and Next.js Image component optimization. *(Commit #9)*
- **Dev 2 & Dev 3**: Optimize Socket.IO payload sizes and reduce memory leaks on component unmount. *(Commit #9)*
- **Dev 5 & Dev 6**: Add MongoDB query caching and lean queries (`.lean()`) for fast API responses. *(Commit #9)*

### Day 18: Responsive Design & Cross-Browser Verification
- **Dev 1–6**: Audit UI on Mobile (iOS Safari, Android Chrome), Tablet, and Desktop screens. Fix responsive grid breakpoints (`sm`, `md`, `lg`, `xl`).

### Day 19: Production Build & Staging Deployment
- **Dev 1–3**: Deploy Client to Vercel and Server to Render/Railway. Set environment variables. *(Commit #10)*
- **Dev 4–6**: Run smoke tests on live staging URL. Verify SSL, WebSockets connection, and MongoDB Atlas. *(Commit #10)*

### Day 20: Final QA, Bug Fixes & Project Presentation
- **Dev 1–6**: Final bug sweep, verification of 10+ commits per developer (Total 60+ commits), and final demonstration release.

---

## 📊 Summary Jira Backlog Ticket Matrix

| Developer | Assigned Sections | Total Commits Required | Primary Deliverables |
| :--- | :--- | :---: | :--- |
| **Dev 1** | Dashboard + Premium Membership | 10+ | Stats Widgets, Recharts Charts, Stripe Payment Mock, Premium Badges |
| **Dev 2** | AI Chat + AI Trainer | 10+ | Socket.IO AI Stream, Gemini API, AI Voice Waveform, Routine Generator |
| **Dev 3** | GYM Timer + Exercise Tracker | 10+ | Realtime Multi-device Timer Sync, Audio Alerts, Workout Log Engine |
| **Dev 4** | BMI Calculator + Nutrition Calculator | 10+ | Interactive Sliders, Macro Ratio Engine, TDEE Formulas, History Logs |
| **Dev 5** | User Management + Set Goal | 10+ | JWT Auth, RBAC Middleware, Profile Settings, Goal Progress Tracker |
| **Dev 6** | Premium Meal Chart + Gym-related Ads | 10+ | Meal Recipe Filters, Calorie Planner, Rotating Ad Engine, Ad Analytics |
