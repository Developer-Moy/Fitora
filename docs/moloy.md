# My Assigned Sections & Contributions

## 1. Header Navbar & Mobile/Tablet Drawer Redesign

The **Header Navbar & Mobile/Tablet Drawer** provides a high-contrast Pure Black & White responsive header across all devices.

### Key Implementation:

- **Desktop View (`>= 1024px`)**: Solid pitch-black header with centered navigation links (`Home`, `BMI Calculator`, `Gym Stopwatch`, `Membership Plans`, `AI Coach Studio`) and a signature white rounded `"Join Now"` CTA button featuring an `ArrowUpRight` (`↗`) icon badge.
- **Mobile & Tablet View (`< 1024px`)**: Right slide-in Brainwave-style drawer menu featuring a top search bar, collapsible Chat List, profile card, and upgraded Pro button. Positioned below the main header with smooth CSS cubic-bezier animations.

---

## 2. Hero Section 1-to-1 Design Alignment (`HeroSection.tsx`)

Completed 1-to-1 visual alignment of the Hero Section matching `docs/fitora.png`.

### Key Implementation:

- **Headline**: Single horizontal line _"Build Your Body"_ across top in Serif Italic Title Case (`font-serif font-black italic`, `fontSize: "clamp(3rem, 7.5vw, 8rem)"`).
- **Athlete Cutout (`/hero.png`)**: Transparent cutout athlete placed at `z-20` (overlapping `z-10` text), centered with shorts sitting directly on top of the bottom notch.
- **SVG Bottom Notch**: Non-clipped smooth arch curve (width 180px x height 65px, `viewBox="0 -16 180 91"`) with inner circle arrow button.
- **Zoom-Proof & Responsive Layout**: Positioned left details text at left-middle (`top-1/2 -translate-y-1/2`), social icons at far-left bottom, and "See Packages" signature button at right-middle (`top-1/2 -translate-y-1/2`), locked inside a `max-w-7xl` container.
- **Stats Counter Strip**: 3-column white strip with animated numbers (105+ Expert Trainers, 970+ Member Joined, 135+ Fitness Programs).

---

## 3. Pure Black & White Color Theme & Signature Button System

Enforced strict B&W color palette and uniform button styling across all home components:

- **Signature Pill Buttons**: Standardized all website buttons (`Join Now`, `See Packages`, `Free Trial Today`, `PURCHASE NOW`, `SUBMIT NOW`, `CHOOSE PLAN`) to use pill shapes (`rounded-full`) with rotating `ArrowUpRight` (`↗`) round icon badges.
- **`WhyChooseUs.tsx`**: White background (`bg-white`), black text (`text-black`), black checkmark icons, and signature black pill button.
- **`PricingSection.tsx`**: Clean 3-tier membership pricing cards (Basic Pass, Pro Athlete, VIP Ultimate) with Monthly/Annual discount toggle and signature pill CTA buttons.
- **`TrainerCalloutBanner.tsx`**: Pitch-black background with white text and signature white pill button.
- **`ContactInfoForm.tsx`**: Consultation form with signature black pill `SUBMIT NOW` button.
- **Clean Brand Consistency**: Standardized 100% brand mentions across the codebase to strictly **FITORA** / **FITORA GYM & AI**.

---

## 4. Consultation Contact Form ("Leave Us Your Info") & Home Assembly

Built the consultation contact section (`client/src/components/home/ContactInfoForm.tsx`) and assembled the home page in `client/src/app/(main)/page.tsx`.

### Key Implementation:

- **Left Column**: Headline _"We are here for help you! To Shape Your Body."_, location info (`Fitora Tower, Gulshan-2, Dhaka 1212` & `64 Branches in Bangladesh`), opening hours, phone/email, and social media links with black accent underline bars.
- **Right Column**: Light gray container (`bg-[#F4F4F4]`) titled _"Leave Us Your Info"_ featuring clean white input fields for `Full Name *`, `Email Address *`, `Select Class` dropdown, `Comment` textarea, and signature `SUBMIT NOW` pill button.

---

## 5. Footer Component Redesign (`Footer.tsx`)

Redesigned the global Footer (`client/src/components/Footer.tsx`) matching the 1-to-1 reference mockup spec.

### Key Implementation:

- **Top Hero Typography**: Giant bold & outline stroke typography (_"GO FOR IT!"_).
- **Location & Mission**: Quote block, 2-line location details (_"Fitora Tower, Gulshan-2, Dhaka 1212"_, _"64 Branches in Bangladesh"_), and white _"Get Directions"_ pill button.
- **Background & Bottom Strip**: High-visibility background image (`/image1.jpg.jpeg`), newsletter subscription bar, social media icons, and pure black bottom bar with `Design and Developed by DeveloperMoy` credit.

---

## 6. Membership Subscription & Payment Checkout Flow (`PricingSection.tsx` & `SubscriptionModal.tsx`)

Implemented the complete membership tier selection and single-screen luxury payment checkout experience.

### Key Implementation:

- **Interactive Pricing Grid**: 3-tier membership pricing cards (`Basic Pass`, `Pro Athlete`, `VIP Ultimate`) with dynamic Monthly / Annual billing discount toggle (Save 20%) and instant price recalculations.
- **Smart Authentication Routing**:
  - Unauthenticated / Guest visitors clicking any plan are redirected to `/register?plan=<selected_plan>&billing=<annual|monthly>`.
  - Logged-in athletes clicking a plan trigger the in-app **Subscription Checkout Modal** without page reload or 404 redirection.
- **Single-Screen Luxury Checkout Modal (`SubscriptionModal.tsx`)**:
  - **Zero-Scroll Architecture**: Optimized wide 2-column layout (Desktop/Tablet) and compact summary strip (Mobile) designed to fit 100% within one viewport without vertical scrollbars.
  - **Payment Gateways**: Simulated instant checkouts for **bKash** (Mobile Wallet), **Nagad** (Instant Pay), and **Card** (Visa/Mastercard) with real-time BDT (৳) currency conversion.
  - **State & Role Sync**: Upgrades member status to `premium_user` and activates purchased plan tier (`fitora_user_plan`) in `useDashboardRole` upon payment completion.

---

## 7. Membership Expiry Countdown & Digital Printable/PDF Invoice System

Architected and developed the full dynamic membership lifecycle tracking and digital invoice engine:

### Key Implementation:

- **Live Countdown Timer (`CountdownTimer.tsx`)**: Real-time ticker updating days, hours, minutes, and seconds relative to `Date.now()`, transitioning seamlessly into expired states.
- **Membership Status Card (`MembershipStatusCard.tsx`)**: Visual progress bar indicating subscription lifespan percentage (`elapsed / total * 100`) with high-contrast color-coded status badges (`Active` 🟢, `Expiring Soon` 🟡, `Expired` 🔴).
- **Global Expiry Alert Banner (`MembershipExpiryBanner.tsx`)**: Non-intrusive alert banner on Dashboard and Profile routes activated when remaining days $\le$ 3, offering immediate one-click renewal flow.
- **Digital Printable & PDF Invoice Engine (`InvoiceModal.tsx`)**: Luxury Pure B&W invoice modal displaying dynamic invoice numbers (`INV-YYYY-XXXXXX`), customer credentials, transaction IDs, tax calculations, issue timestamps, and native browser print / PDF download support.
- **Authoritative Security & Anti-Tamper Sync**: Reconciled client session verification with backend MongoDB claims in `Navbar.tsx` and `payment.controller.ts`, displaying a real-time glowing `PRO` badge upon confirmed purchase.

---

## Overview

These components form the responsive header, hero section, pricing, callouts, contact form, and footer of **Fitora**.
These components form the responsive header, hero section, pricing, callouts, contact form, footer, membership tracking, and digital billing engine of **Fitora**.

---

## My Branch & Developer Profile

**Developer:** [Moloy Paul (DeveloperMoy)](https://github.com/Developer-Moy)

**Repository:** [Fitora](https://github.com/Developer-Moy/Fitora)

**Branch:** `moloy`

**Branch Link:** [View My Branch](https://github.com/Developer-Moy/Fitora/tree/moloy)

---

## Work Log & Progress Timeline

### 17-Aug-26

- Initial setup for AI Chat & Header Navbar

### 18-Aug-26

- Pulled latest changes from `development` branch into `moloy` branch and resolved conflicts

### 19-Aug-26

- Implemented AI Trainer Chat stream and AiMessage database schema

### 20-Aug-26

- Standardized Pure Black & White theme across Header Navbar and Footer

### 21-Aug-26

- Developed floating AI fitness assistant trigger widget and response message streaming container
- Implemented client-side message state management with auto-scrolling bubble views

### 22-Aug-26

- Fine-tuned high-contrast typography and border contrast across navigation elements
- Structured mobile hamburger menu drawer interactions and backdrop blur effects in `Navbar.tsx`

### 23-Aug-26

- Redesigned Mobile & Tablet drawer (`< 1024px`) with right slide-in Brainwave UI layout, white search bar, and smooth CSS keyframe animations

### 24-Aug-26

- Built `ContactInfoForm.tsx` ("Leave Us Your Info" consultation form) with 1-to-1 exact visual mockup match and Bangladesh 64 branches office info
- Redesigned `Footer.tsx` with "GO FOR IT!" typography, location block, directions button, and `Design and Developed by DeveloperMoy` credit
- Assembled home page section in `client/src/app/(main)/page.tsx` & `client/src/app/page.tsx`

### 25-Aug-26

- Extracted transparent background cutout image `/hero.png` (~19MB) for athlete figure
- Achieved 1-to-1 visual alignment of `HeroSection.tsx` with "Build Your Body" Serif Italic headline, athlete head overlap, non-clipped SVG bottom notch, left-middle details text, far-left bottom socials, and right-middle "See Packages" button
- Implemented zoom-proof layout architecture using `max-w-7xl` container to prevent element shifting on zoom and ultra-wide screens
- Standardized signature pill button design system (`rounded-full` + `ArrowUpRight` `↗` round icon badge) across Navbar, HeroSection, WhyChooseUs, PricingSection, TrainerCalloutBanner, and ContactInfoForm
- Updated `WhyChooseUs.tsx` and `PricingSection.tsx` to white background theme (`bg-white`) with black text (`text-black`)
- Removed unused old component files (`MealChartSection.tsx`, `PricingAndReviews.tsx`, `TrainersSection.tsx`, `AiTrainerSection.tsx`, `CalculatorSection.tsx`, `GymTimerSection.tsx`, `MeetTrainers.tsx`)
- Standardized 100% brand consistency under **FITORA** / **FITORA GYM & AI**
- Updated all project documentation (`README.md`, `docs/moloy.md`, `docs/project_architecture.md`)

### 26-Aug-26

- Conducted cross-device responsive layout testing for the Pure Black & White theme across desktop, tablet, and mobile breakpoints
- Fine-tuned HeroSection cutout positioning and SVG bottom notch geometry to prevent clipping on mobile viewports
- Optimized drawer opening and closing animations with custom cubic-bezier transitions in `Navbar.tsx`

### 27-Aug-26

- Audited image assets and Next.js `<Image />` loaders to eliminate layout shift and improve Largest Contentful Paint (LCP)
- Standardized global toast notification provider in `providers.tsx` to handle authentication and action alerts
- Implemented client-side auth session hydration bridging BetterAuth tokens with local persistence

### 28-Aug-26

- Refactored `DashboardSidebar.tsx` navigation items and unified role-switching logic inside `useDashboardRole.tsx`
- Designed high-contrast stat widgets and interactive metrics layout for Master Admin overview
- Standardized button hover effects with glowing backdrop filter styling across dark dashboard elements

### 29-Aug-26

- Performed codebase-wide TypeScript type checking and cleaned redundant type casts across client components
- Standardized brand naming to strictly **FITORA** / **FITORA GYM & AI** across all page metadata and layout titles
- Refactored responsive padding and container boundaries across `/profile`, `/calculator`, and `/stopwatch` routes

### 30-Aug-26

- Implemented search filtering and role-based user management table handlers in `UserManagementTable.tsx`
- Conducted pre-QA sprint walkthrough and validated component modularity for seamless multi-developer integration
- Prepared detailed QA test plans and verified end-to-end user navigation flows

### 31-Aug-26

- Conducted QA and resolved post-merge build issues on `moloy` branch
- Fixed routing boundaries, unauthenticated redirects, and profile edit synchronization
- Fixed counter animation increment throttling in Hero section and adjusted UI badge styling

### 01-Sep-26

- Resolved comprehensive QA Bug Report (Batches 1, 2, and 3) covering auth boundaries, UI components, and state management
- Fixed desktop navbar dropdown navigation and secured `/profile` route with automatic login redirects
- Replaced static counter interval with dynamic step calculation in `HeroSection.tsx` for instantaneous, smooth number rendering
- Resolved floating AI trigger button overlapping with the active AI assistant chat modal
- Styled pricing discount indicator into a modern high-contrast green pill badge (`bg-emerald-500/10 text-emerald-400`)
- Fixed profile update synchronization by connecting `better-auth` `updateUser` with custom local session persistence
- Fixed athlete role and profile retention on dashboard page reload inside `useDashboardRole.tsx`
- Fixed search query bug in `UserManagementTable.tsx` by automatically resetting pagination to page 1 upon filter changes
- Replaced browser native `window.confirm` with a custom-styled Delete Confirmation Modal for Master Admin user management
- Populated missing and broken meal plan image slots in `MealsData.ts` with high-resolution fitness food assets
- Updated "Free Trial Today" CTA logic in `WhyChooseUs.tsx` to conditionally redirect authenticated athletes to `/profile` and guest visitors to `/register`

### 02-Sep-26

- Refined Homepage Pricing / Membership Section (`PricingSection.tsx`) with dynamic monthly vs annual pricing & savings calculations
- Built interactive Luxury Pure B&W **Subscription Checkout Modal** (`SubscriptionModal.tsx`) supporting bKash, Nagad, and Card (Visa/Mastercard) payment simulations
- Implemented smart authentication routing: automatic redirect to `/register?plan=...` for guest visitors and instant in-app checkout modal for logged-in athletes
- Synchronized active subscription tier (`Basic Pass`, `Pro Athlete`, `VIP Ultimate`) with `useDashboardRole`, local session state, and Member Dashboard
- Implemented Global Multi-Entity Dashboard Search API (`GET /api/search?q=...`) in `search.controller.ts` & `search.routes.ts` querying MongoDB Athletes, Branches, Financials, and Telemetry
- Built debounced interactive `GlobalSearchBar.tsx` with instant dropdown results, category filter pills (All, Athletes, Branches, Financials, Telemetry), loading state, empty state, and keyboard shortcuts
- Integrated Global Search Bar into `DashboardLayout` header with smooth routing and keyboard navigation
- Validated 100% clean production builds across client and server with zero compilation errors
- Replaced static fallback mock data with live MongoDB API integration across `MemberDashboardView.tsx` (Personal Member Stats, Dynamic Branch Selection) and `MasterDashboardPage.tsx` (Platform Aggregation, Revenue Breakdowns, Check-in Telemetry).
- Built dynamic `ExerciseTracker.tsx` utilizing `GET /api/exercises` for live exercise fetching, filtering, and loading state skeletons, replacing 1,600 lines of hardcoded arrays.
- Built interactive `BmiCalculator.tsx` with dynamic save-to-profile functionality connecting to `POST /api/bmi/history`.
- Upgraded `stopwatch.tsx` to dynamically fetch active exercise presets from backend `exerciseService.ts` instead of local string literals.
- Pulled latest changes from `development` branch, resolved component conflicts, and successfully integrated team updates into the `moloy` branch.
- Completely eliminated static `MEAL_SUGGESTIONS_BY_GOAL` dict in favor of live `mealChartService.ts` and `dailyMealPlanService.ts` data fetching inside `profile/page.tsx`.
- Refactored `GymTimer.tsx` and `TimerControls.tsx` to dynamically pull REST durations from `stopwatchService.ts` (`GET /api/stopwatch/presets`) and submit precise workout telemetry logs directly to MongoDB backend upon stopwatch completion.
- Replaced mock static chat response string with live conversational integration connecting `MemberDashboardView.tsx` with `sendAiChatApi` (`POST /api/ai/chat`).
- Secured dashboard authentication flow in `dashboard/login/page.tsx` by fully stripping all pre-filled mock credentials and relying exclusively on live API validation.
- Enhanced unified `calculator/page.tsx` by implementing background synchronization with the `nutritionService.ts` backend to strictly enforce server-side verified target macros with seamless client-side hydration fallbacks.

### 03-Sep-26

- Pulled and integrated all latest team updates from `origin/development` into `moloy` branch.
- Resolved build-breaking syntax errors and duplicate database operations in `server/src/data/seed.ts`.
- Fixed missing `useRef` and `fetchExercises` imports, state mismatches, and duplicate unmapped `useEffect` fetch calls in `client/src/components/ExerciseTracker.tsx`.
- Standardized local API URL and fallback port configurations across all client services to prevent 404 connection drops.
- Conducted exhaustive full-project frontend & backend integration audit and resolved all data loading and API route bugs:
  - Fixed `server/src/routes/mealChart.routes.ts` duplicated route prefix (`/meal-charts/meal-charts` -> `/`).
  - Fixed `server/src/controllers/exercise.controller.ts` muscle group query filter to match actual Mongoose schema field (`muscle`).
  - Fixed `client/src/services/exerciseService.ts` and `client/src/components/ExerciseTracker.tsx` field mapping mismatch (aligned `muscle`, `description`, `tips`, `videoId`, `image`).
  - Fixed `client/src/services/authService.ts` response parsing in `loginApi`, `registerApi`, and `getCurrentUserApi` to properly unpack `data.data` payload.
  - Fixed double `/api` path duplication and port fallbacks in `client/src/services/bmiService.ts` and `client/src/services/nutritionService.ts`.
  - Fixed `client/src/app/calculator/page.tsx` BMI history save API call (`handleSaveHistory`) to prevent path duplication, compute fallback BMI, and attach `userId` & auth headers.
  - Fixed `client/src/app/profile/page.tsx` BMI calculation history fetch by replacing buggy hardcoded call with reusable `fetchBmiHistory` service.
  - Attached JWT authorization headers and user IDs across workout logs, exercise tracker submissions, stopwatch presets, and dashboard services.
  - Added graceful public branch fallbacks in `client/src/services/branchService.ts` so non-admin users or initial dashboard loads never encounter unhandled exceptions.
  - Resolved gym history persistence and profile display bug: fixed response parsing in `client/src/services/workoutService.ts` to properly unpack `data.logs` object, resolved `authUserId` in `GymTimer.tsx` from both Better Auth and JWT local session, ensured `profile/page.tsx` gracefully queries workout history using fallback `guest_user`, and enhanced MongoDB query in `workout.controller.ts` to handle both string and ObjectId user references.
- Successfully validated 100% clean typechecks and production builds across both client (`npx tsc --noEmit`) and server (`npm run build`) with zero errors.

### 06-Sep-26

- Designed and implemented the complete dynamic **Payment & Membership Lifecycle Architecture**:
  - Created `server/src/models/Payment.model.ts` supporting bKash, Nagad, Card, and Bank Transfer with transaction IDs, billing cycles, invoice numbers, and subscription expiry tracking.
  - Added `subscriptionExpiryDate` to `server/src/models/User.model.ts` for automated membership lifecycle management.
  - Built `server/src/controllers/payment.controller.ts` with `checkoutPayment` (`POST /api/payment/checkout`), `getMyTransactions` (`GET /api/payment/my-transactions`), and `getAllPayments` (`GET /api/payment/all`).
  - Implemented automatic user tier promotion (upgrading `free_user` to `premium_user`), cumulative `totalPaidBDT` increment, active status enforcement, and automated expiry date calculations (30 days for monthly, 365 days for yearly).
  - Mounted central payment routers in `server/src/routes/payment.routes.ts` and `server/src/routes/index.ts` under `/payment` and `/payments`.
  - Built resilient fallback handling for in-memory persistence during offline testing.
- Verified 100% clean TypeScript production builds on both server (`npm run build`) and client (`npx tsc --noEmit`) with zero errors.
- Created centralized TypeScript definitions in `client/src/types/payment.ts` (`PaymentGateway`, `PaymentStatus`, `BillingCycle`, `MembershipTier`, `CheckoutPayload`, `PaymentInvoice`, `PaymentRecord`, `CheckoutResponse`, `MyTransactionsResponse`) to connect frontend components with the payment engine.
- Pulled and integrated merged team contributions from `origin/development` into `moloy` branch.
- Diagnosed and resolved cross-platform integration bugs and build errors:
  - Fixed file casing conflict on Linux filesystem (`server/src/models/payment.model.ts` vs `server/src/models/Payment.model.ts` causing `TS1149`).
  - Installed missing `stripe` dependency in server workspace.
  - Unified Payment Controller and Routes: merged Stripe card checkout/verification with local gateway (bKash/Nagad/Card) checkout and history endpoints (`POST /checkout`, `POST /create-checkout-session`, `GET /verify-session`, `GET /me`, `GET /my-transactions`, `GET /all`).
  - Connected `SubscriptionModal.tsx` to live backend checkout API (`POST /api/payments/checkout`), replacing fake timer simulations with genuine database persistence and auto-plan upgrades.
  - Connected user profile (`client/src/app/profile/page.tsx`) to live payment transaction API (`GET /api/payments/me`) to render real user payment records in `BillingPaymentHistory`.
  - Updated `client/src/services/paymentService.ts` to support both BDT and Stripe checkout schemas with robust fallback handling.
- Validated 100% clean production builds on both server (`npm run build`) and client (`npx tsc --noEmit`) with 0 errors.
- Hardened payment security against browser console manipulation:
  - Enforced Server-Authoritative pricing on all checkout endpoints (rejecting/overriding any client-tampered prices).
  - Prioritized verified cryptographic JWT token claims for user identification over raw request bodies to prevent account spoofing.
- Implemented luxury in-modal Card checkout matching Fitora's Pure Black & White design system:
  - Added real-time auto-formatted Card Number (`4242 •••• •••• ••••`), Expiry (`MM/YY`), CVC, and Cardholder Name inputs directly within `SubscriptionModal.tsx`.
  - Added clear Cancel / Close navigation so users never leave the site unexpectedly.
- Implemented real-time **PRO** badge on the Home Page Navbar brand logo:
  - Connected `Navbar.tsx` to `AUTH_SESSION_UPDATED` and cross-tab storage events.
  - Upon completing subscription payment, user is immediately promoted to `premium_user` in database and local session, and a glowing Pure B&W `PRO` badge (`Sparkles` + `PRO`) automatically appears beside the `FITORA` brand logo.

### 07-Sep-26 (Day 2)

- Pulled and integrated all latest team updates from `origin/development` into `moloy` branch (24 commits merged from team members).
- Resolved merge conflicts, syntax errors, and duplicate declarations across server and client workspaces:
  - Fixed `server/src/routes/payment.routes.ts`: deduplicated `authMiddleware` import and duplicate `router.get("/invoice/:id")` route.
  - Fixed `server/src/controllers/payment.controller.ts`: deduplicated `startDate` and `calculateSubscriptionDetails`, fixed corrupted merge/sort code block in `getMyPayments`, removed duplicate `successResponse` block in `getInvoiceById`, and added synchronous invoice number generator fallback.
  - Fixed `client/src/services/authService.ts`: deduplicated `membershipExpiresAt` interface declarations and added `subscriptionExpiryDate`.
  - Fixed `client/src/services/paymentService.ts`: removed duplicate `BASE_URL` and consolidated `fetchMyPaymentsApi` with robust JWT and query parameter resolution.
  - Fixed `client/src/app/profile/page.tsx`: removed duplicate `<BillingPaymentHistory />` table, streamlined `<BillingSection />`, connected renewal modal with `<MembershipExpiryBanner />`, and replaced static `TEMP_MEMBERSHIP` mock dates with 100% dynamic calculation.
  - Fixed `client/src/components/dashboard/MemberDashboardView.tsx`: wrapped `getAuthSession()` and expiry calculation in a clean `useEffect` hook and deduplicated imports.
- Implemented 100% dynamic **Membership Expiry Countdown & Status Tracker**:
  - Live real-time countdown timer updating every second relative to `Date.now()` (`CountdownTimer.tsx`).
  - Dynamic progress percentage bar and visual status badge (`Active` 🟢, `Expiring Soon` 🟡, `Expired` 🔴) in `MembershipStatusCard.tsx`.
  - Global sticky warning banner on Dashboard & Profile triggered dynamically when $\le$ 3 days remaining (`MembershipExpiryBanner.tsx`).
- Implemented **Digital Printable / PDF Invoice System**:
  - High-contrast pure B&W Luxury Invoice modal (`InvoiceModal.tsx`) with auto-generated invoice serials (`INV-YYYY-XXXXXX`), customer information, payment gateway breakdown, and issue dates.
  - Added one-click print (`window.print()`) with print-optimized CSS and PDF download capabilities.
  - Connected invoice viewing across all payment history transactions via `BillingSection.tsx`.
- Diagnosed and fixed 16-digit card checkout & database validation failure:
  - Resolved Mongoose `Payment validation failed: userId: Path 'userId' is required`: `paymentPayload.userId` is now explicitly updated with `targetUser._id` upon resolving the athlete record by email or ObjectId.
  - Added robust athlete auto-provisioning in `checkoutPayment` so test cards (e.g. `4242 4242 4242 4242`) and guest checkouts succeed cleanly and generate a valid session token.
  - Added safe schema defaults in `User.model.ts` (`assignedBranch`, `assignedBranchSlug`, `attendanceStreakDays`, `hydrationTargetLiters`, `paymentMethod`) and used `validateModifiedOnly: true` to prevent legacy document validation errors on pre-existing users.
  - Updated `SubscriptionModal.tsx` card validation to accept 12-16 digit numbers with auto-default expiry/CVC fallbacks and direct local session synchronization so the **PRO** badge next to the `FITORA` brand logo immediately illuminates upon checkout.
- Verified 100% clean compilation on both server (`npm run build`) and client (`npx tsc --noEmit`) with 0 errors.
