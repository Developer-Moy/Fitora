# My Assigned Sections & Contributions

## 1. Set Goals

Implemented the **Set Goals** functionality for the Fitora platform, allowing users to define and manage their personal fitness goals.

The goal management system provides a structured way for users to create, update, and track their fitness objectives based on their individual needs.

### Key Capabilities:

- **Create Fitness Goals**: Users can set their personal fitness targets.
- **Update Goals**: Existing fitness goals can be modified when user targets change.
- **Goal Management**: Provides a structured system for managing user-specific fitness objectives.
- **Personalized Targets**: Goals are associated with individual users.
- **Goal Persistence**: Fitness targets are stored in the database for future access.
- **CRUD API**: Implemented API endpoints for creating, retrieving, updating, and managing user goals.
- **User-Specific Goals**: Ensures goals are associated with the authenticated user.

### Backend Implementation:

- Goal database model
- Goal controller
- Goal routes
- User-specific goal management
- CRUD operations for fitness goals

### Main Components:

- `server/src/controllers/goal.controller.ts`
- `server/src/routes/goal.routes.ts`
- Goal database model
- Goal management API

---

## 2. User Management

Implemented the **User Management** functionality for Fitora to handle user information, authentication-related data, and user-specific profile management.

The user management system provides the foundation for securely handling user accounts and connecting user data with other platform features such as fitness goals.

### Key Capabilities:

- **User Registration**: Supports creating new user accounts.
- **User Login**: Provides authentication functionality for registered users.
- **User Profile Management**: Handles user-specific information and profile data.
- **User Authentication**: Implemented authentication middleware to protect user-specific resources.
- **Authenticated User Access**: Ensures users can access and manage their own data.
- **User Database Model**: Created the user schema for storing account and profile information.
- **Secure User Data Handling**: User-specific resources are protected through authentication.

### Backend Implementation:

- User database model
- Authentication middleware
- Registration API
- Login API
- User management APIs
- Protected routes

### Main Components:

- User database model
- Authentication middleware
- User controller
- Authentication routes
- User management routes
- `client/src/app/profile/page.tsx`

---

## Overview

The **Set Goals** and **User Management** features form an important part of Fitora's personalized fitness experience.

The **User Management** system provides the foundation for authentication and user-specific data, while the **Set Goals** functionality allows authenticated users to create and manage their personal fitness targets.

Together, these features provide a structured foundation for delivering personalized fitness experiences within the Fitora platform.

---

## My Branch

**Developer:** [Gazi Md Salauddin](https://github.com/Gazi-Md-Salauddin)

**Repository:** [Fitora](https://github.com/Developer-Moy/Fitora)

**Branch:** `salauddin`

**Branch Link:** [View My Branch](https://github.com/Developer-Moy/Fitora/tree/salauddin)



## Work Log & Progress Timeline


### 17-Aug-26
* **Task:** Create User database model and authentication middleware.
  * **Target Files:** `server/src/models/User.model.ts`, `server/src/middlewares/auth.middleware.ts`
  * **Steps:**
    1. Define `User` Mongoose Schema (`name`, `email`, `passwordHash`, `role`).
    2. Write JWT token extraction and verification middleware function.
  * **Commit 1:** `feat(auth): define User Mongoose schema`
  * **Commit 2:** `feat(auth): implement JWT auth verification middleware`



### 18-Aug-26
Target Files: server/src/controllers/auth.controller.ts, server/src/routes/auth.routes.ts

Steps: Implement POST /api/auth/register and POST /api/auth/login with password hashing & JWT tokens.

Commit 1: feat(auth): build registerUser and loginUser controllers

Commit 2: feat(auth): register auth express routes



### 20-Aug-26
**Target Page Route:** `/profile`

**Target File:** `client/src/app/profile/page.tsx`

**Step-by-Step Task Specifications:**

Build user profile header card with avatar image, full name, email address, and "PRO Member" badge.

Build Active Streak Counter widget (e.g., 🔥 12 Days Active Streak).

Build Earned Achievements / Badges grid (e.g., "First Workout Logged", "100k KG Lifted", "Streak Champion").

Construct Goal History timeline detailing past target weight milestones and completion status.

**Midday Commit 1:** `feat(profile): build /profile page layout with streak counter widget`

**EOD Commit 2:** `feat(profile): add achievements badges grid and goal history timeline`



### 23-Aug-26
[Frontend] Recharts Weight Progress & Streak Visualizer


Issue Type: Story / Improvement

Component: client/src/app/profile/page.tsx

Description: Integrate Recharts line chart on /profile to visualize 30-day weight progress and streak continuity graph. Include an interactive GoalSetter modal.

Acceptance Criteria:

Clean line chart rendering 30-day weight trend line.

GoalSetter modal allows updating target body weight and weekly workout frequency.

Responsive chart container fitting mobile and desktop displays.


[Backend] Dynamic Goals CRUD API & Workout Streak Engine

Issue Type: Task

Component: server/src/controllers/goal.controller.ts, server/src/routes/goal.routes.ts

Description: Build /api/goals CRUD routes. Implement dynamic streak calculation logic that analyzes logged workout timestamps to compute active streak days.

Acceptance Criteria:

POST /api/goals creates/updates user fitness targets.

Streak calculation automatically resets if consecutive workout gap exceeds 48 hours.

Returns active streak count, total volume lifted, and milestone status.




### 24-Aug-26
Issue Type: Task

Priority: Medium

Component: client/src/components/home/PricingAndReviews.tsx

Summary: Implement 3-Tier Pricing Cards & Customer Testimonials Review Slider

Description: Build the pricing section and customer review slider.

Acceptance Criteria:

Monthly / Yearly billing toggle switch.

3 Pricing Cards: Beginner Plan ($10/mo), Premium Plan ($15/mo), Premium Plus ($20/mo) with "Choose Plan" buttons.

"YOUR OPINIONS" Testimonials: Left side reviewer avatar circles, right side 5-star rating review cards with navigation arrows (← →).



### 25-Aug-26
* create Exercise section and improve UI


### 27-Aug-26
* Progressive Workout Program, Set/Rep & 1RM PR Engine (Brzycki Formula) and Exercise Encyclopedia & Multi-Muscle Group Filter (/exercises)


### 30-Aug-26
* Seed 50+ Exercise Encyclopedia & Video Guides
* Curate 50+ gym exercises across all muscle groups with equipment tags, difficulty, execution tips, photo URLs, and valid YouTube demo video IDs in exercises collection. Submit as exercises.json.

### 31-Aug-26
* Bug Hunting

### 01-Sep-26
* Finding bug, Make proper document and fix the bug.

### 02-Sep-26
* Goals Frontend UI & Dashboard Sync
* Creates my fitness goals visual widgets.