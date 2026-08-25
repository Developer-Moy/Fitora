# My Assigned Sections

## 1. Homepage Banner Section

Built the **Hero Banner** for the Fitora homepage with a modern fitness-themed layout, responsive typography, and call-to-action buttons.

### Key Implementation:
- Added the main hero section inside `client/src/components/home/Banner.tsx`.
- Implemented responsive desktop, tablet, and mobile layouts.
- Added primary CTA buttons for user engagement.
- Used the project's black-and-white design language for consistency.
- Integrated the banner into the homepage route.

---

## 2. Login Page UI (Glassmorphism Authentication)

Designed and implemented the **Login page** with a glassmorphism-style authentication form.

### Key Implementation:
- Created `/login` page UI in `client/src/app/login/page.tsx`.
- Built a reusable glassmorphism login card.
- Added responsive email and password input fields.
- Included login button, navigation links, and branding.
- Styled with Tailwind CSS to match the Fitora design system.

---

## 3. Login Form Validation & Toast Notifications

Added client-side validation and user feedback for the login form.

### Key Implementation:
- Validated required email and password fields.
- Added email format validation.
- Displayed success and error toast notifications for the authentication flow.
- Improved user experience with inline validation handling.

---

## 4. Membership Plans Page & PlanCard Component

Built the subscription plans section using reusable plan cards.

### Key Implementation:
- Created `client/src/components/PlanCard.tsx`.
- Created `client/src/app/plans/page.tsx`.
- Added reusable pricing cards for different membership tiers.
- Displayed tier name, pricing, badges, and feature checklist.
- Designed a responsive pricing layout for desktop, tablet, and mobile devices.

---

## 5. Dashboard Statistics API (Backend)

Implemented the backend API endpoint for dashboard workout statistics.

### Key Implementation:
- Created controller inside `server/src/controllers/user.controller.ts`.
- Registered route inside `server/src/routes/user.routes.ts`.
- Added `GET /api/dashboard/stats` endpoint.
- Returned completed workout count and total burned calories for the authenticated user.
- Included proper error handling for failed requests.

---

## Overview

These contributions cover both the **frontend UI** and **backend API** development for **Fitora**, including homepage improvements, authentication UI, membership plans, and dashboard statistics functionality.

---

## My Branch

**Developer:** [Alfaaz Ahmed](https://github.com/AlfaazAhmed)

**Repository:** [Fitora](https://github.com/Developer-Moy/Fitora)

**Branch:** `alfaaz`

**Branch Link:** https://github.com/Developer-Moy/Fitora/tree/alfaaz

---

# Branch Update Timeline (Commit-wise)

## 19-Aug-26

- Initial project setup on the `alfaaz` feature branch.
- Synced branch with the latest project structure from the team repository.

## 20-Aug-26

- Built the **Homepage Banner** section.
- Added responsive hero layout with call-to-action buttons.
- Integrated the banner component into the homepage.

## 21-Aug-26

- Created the **Login Page** with a glassmorphism UI design.
- Implemented responsive authentication layout for all screen sizes.
- Added branding, navigation links, and login form structure.

## 22-Aug-26

- Added **client-side login form validation**.
- Implemented success and error toast notifications.
- Improved validation flow and user experience.

## 23-Aug-26

- Built reusable **PlanCard** component for membership subscriptions.
- Created the `/plans` page using reusable pricing cards.
- Added subscription tiers, pricing badges, and feature checklist.

## 24-Aug-26

- Implemented **Dashboard Statistics API** (`GET /api/dashboard/stats`).
- Added controller for completed workout count and burned calories.
- Registered Express route for dashboard statistics endpoint.
- Pulled the latest changes from the `development` branch into `alfaaz`.
- Resolved rebase conflicts and successfully pushed the updated branch.

---

## Summary of My Contributions

### Frontend
- Homepage Hero Banner.
- Login Page (Glassmorphism UI).
- Login Form Validation & Toast Notifications.
- Membership Plans page.
- Reusable PlanCard component.

### Backend
- Dashboard Statistics Controller.
- Dashboard Statistics Express Route.
- `GET /api/dashboard/stats` API implementation.

### Reusable Components
- `Banner.tsx`
- `PlanCard.tsx`
- Login form components and validation logic.

### Git Workflow
- Worked exclusively on the `alfaaz` branch.
- Regularly synced with the `development` branch.
- Used rebase to keep branch history clean.
- Successfully resolved merge/rebase conflicts before pushing updates.