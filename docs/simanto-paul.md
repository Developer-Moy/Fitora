# My Assigned Sections & Contributions

## 1. BMI Calculator

Built the reusable **BMI Calculator** component with interactive height and weight controls.

### Key Implementation:

* Height: 50–250 cm
* Weight: 20–300 kg
* Dynamic BMI calculation and health status
* BMI progress indicator
* Responsive UI
* Created reusable `calculateBmi` utility
* Integrated BMI calculation with the overall nutrition workflow

---

## 2. Scientific BMI, BMR & TDEE Calculation System

Implemented the core fitness calculation algorithms following standard formulas.

### Key Implementation:

* Scientific BMI calculation
* **Mifflin-St Jeor** BMR calculation
* Activity-level based TDEE calculation
* Male/Female BMR support
* Dynamic calculation based on:

  * Age
  * Gender
  * Height
  * Weight
  * Activity Level
* Created reusable calculation utilities:

  * `calculateBmi.ts`
  * `calculateBmr.ts`
  * `calculateTdee.ts`
  * `calculateMacros.ts`

---

## 3. Calculator Section

Implemented the homepage **CalculatorSection** and integrated the BMI Calculator.

### Key Implementation:

* "Calculate Your Metrics" section
* BMI Calculator integration
* TDEE display
* Protein, Carbs & Fats macro gauges
* Responsive metric visualization
* CTA navigation to `/calculator`

---

## 4. Standalone Calculator Page

Built the dedicated `/calculator` page with complete fitness calculations.

### Key Implementation:

* Age selection
* Gender selection
* Height & Weight inputs
* Activity Level selection
* BMR calculation
* TDEE calculation
* Target calorie calculation
* Macro distribution
* Responsive metric cards and gauges
* Export Metrics functionality
* Clipboard-based metric export
* User-friendly calculation visualization

---

## 5. Goal Selector & Nutrition Planning

Added dynamic fitness goals to make the nutrition calculator more practical.

### Supported Goals:

* **Bulking:** TDEE + 500 kcal
* **Cutting:** TDEE − 500 kcal
* **Maintenance:** TDEE

### Key Implementation:

* Goal selector UI
* Dynamic target calorie calculation
* Goal-based macro distribution
* Automatic recalculation when goal changes
* Integrated calorie and macro planning workflow

---

## 6. Ideal Weight Range & Health Risk Advisory

Implemented logic for evaluating user health metrics and providing relevant classifications.

### Key Implementation:

* Ideal weight range calculation
* BMI-based health classification
* Underweight classification
* Normal/Healthy classification
* Overweight classification
* Obesity classification
* Health risk advisory logic
* Reusable `getHealthAdvisory` utility
* Integrated health advisory results with BMI calculation

---

## 7. Backend Nutrition Calculation System

Implemented backend nutrition calculation logic using **Express + TypeScript**.

### Key Implementation:

* Mifflin-St Jeor BMR calculation
* TDEE calculation based on activity level
* Protein calculation
* Carbohydrate calculation
* Fat calculation
* Goal-based calorie calculation
* Macro split calculation
* Input validation
* Reusable backend calculation utilities
* Controller-based calculation architecture

---

## 8. BMI History & Health Progress API

Implemented the backend structure for storing and managing users' historical health metrics.

### API Structure:

* `POST /api/bmi/history`
* `GET /api/bmi/history`
* `DELETE /api/bmi/history/:id`

### Key Implementation:

* BMI history model
* User-based history tracking
* BMI storage
* BMR storage
* TDEE storage
* Height & Weight history
* Age & Gender information
* Weekly health progress support
* Authenticated history access
* CRUD controller structure
* BMI history route integration

### Main Controllers:

* `createBMIHistory`
* `getBMIHistory`
* `deleteBMIHistory`

---

## 9. BMI Calculation API

Created backend API structure for processing BMI and nutrition metrics.

### API Structure:

* `POST /api/bmi/calculate`
* `POST /api/bmi/macros`

### Key Implementation:

* Centralized calculation controller
* BMI calculation
* BMR calculation
* TDEE calculation
* Macro calculation
* Health advisory generation
* Goal-based nutrition calculation
* Validation of required user inputs

---

## 10. MongoDB & Health Data Integration

Worked on integrating BMI, nutrition and goal-related data with MongoDB.

### Key Implementation:

* Mongoose model integration
* BMI History schema
* Goal-related data structure
* User-linked health records
* Database seed data structure
* JSON-based master data preparation
* `insertMany()` based seed approach
* MongoDB Atlas integration
* Backend database connection testing

---

## 11. Master Health & Goal Seed Data

Prepared realistic master data for different health and fitness categories.

### Covered Categories:

* Underweight
* Normal
* Overweight
* Obese
* Athletic / Muscle Gain

### Included Metrics:

* Goal Type
* Target Weight
* Weekly Workout Frequency
* BMR
* TDEE
* Target Calories
* Protein
* Carbohydrates
* Fats

The seed data structure was prepared to support future goal recommendations and personalized nutrition planning.

---

# Overall Contribution

My primary contribution to **FITORA** focuses on the complete **BMI & Nutrition Calculation System**, covering frontend UI, scientific fitness algorithms, goal-based nutrition planning, health classification, backend APIs, database integration and historical progress tracking.

### Main Flow:

`BMI → BMR → TDEE → Health Risk → Goal → Calories → Macros → History`

---

# My Branch & Links

**Developer:** Simanto Paul
**GitHub:** https://github.com/simantopal

**Repository:** Fitora
https://github.com/Developer-Moy/Fitora

**Branch:** `simanto-paul`

**Branch Link:**
https://github.com/Developer-Moy/Fitora/tree/simanto-paul

---

# Work Log & Progress Timeline

### 18-Aug-26

* Built BMI Calculator component.
* Created reusable BMI calculation utility.
* Added height and weight sliders.
* Implemented dynamic BMI calculation.
* Added BMI health status classification.
* Added BMI progress indicator.

### 19-Aug-26

* Integrated BMI Calculator into the homepage.
* Built CalculatorSection.
* Added TDEE display.
* Added Protein, Carbs & Fats macro gauges.
* Added CTA navigation to the calculator page.
* Improved responsive calculator UI.

### 20-Aug-26

* Created standalone `/calculator` page.
* Added age and gender selection.
* Added height and weight inputs.
* Added activity level selection.
* Implemented BMR calculation.
* Implemented TDEE calculation.
* Added macro distribution.
* Added responsive metric cards.
* Added Export Metrics functionality.

### 23-Aug-26

* Added Bulking goal.
* Added Cutting goal.
* Added Maintenance goal.
* Implemented dynamic target calorie calculation.
* Added goal-based macro updates.
* Connected goal selection with nutrition planning.

### 24-Aug-26

* Implemented backend nutrition calculation logic.
* Added Mifflin-St Jeor BMR calculation.
* Added TDEE calculation utility.
* Added macro calculation utility.
* Started BMI history API structure.
* Created BMI history controller and routes.

### 25-Aug-26

* Refined calculator UI.
* Improved responsive behavior.
* Improved nutrition metric visualization.
* Improved macro gauges.
* Continued frontend/backend integration.
* Refined BMI and nutrition calculation workflow.

### 26-Aug-26

* Worked on scientific calculation algorithms.
* Created reusable `calculateBmr.ts`.
* Created reusable `calculateTdee.ts`.
* Created reusable `calculateMacros.ts`.
* Integrated calculation utilities with backend controllers.
* Improved calculation validation.

### 27-Aug-26

* Implemented Ideal Weight Range calculation.
* Added BMI-based health classification.
* Added Health Risk Advisory logic.
* Created reusable `getHealthAdvisory` utility.
* Integrated health advisory with BMI calculations.

### 28-Aug-26

* Continued BMI History API development.
* Added authenticated BMI history structure.
* Implemented BMI/BMR/TDEE historical data storage.
* Added GET history functionality.
* Added DELETE history functionality.
* Connected BMI routes with the main server.

### 29-Aug-26

* Worked on MongoDB and Mongoose integration.
* Refined BMI History schema.
* Worked on Goal data structure.
* Prepared master health and fitness seed data.
* Organized JSON seed data for different fitness categories.
* Worked on database seeding structure using `insertMany()`.

### 30-Aug-26

* Continued MongoDB seed data preparation.
* Prepared realistic goal and health metric datasets.
* Worked on BMI History and Goal database structures.
* Refined backend data models.
* Tested database connection and server integration.
* Verified BMI API route registration and backend functionality.

### 31-Aug-26

* Performed overall project review.
* Reviewed frontend and backend integration.
* Refined BMI, BMR, TDEE and nutrition workflows.
* Verified calculator-related functionality.
* Reviewed API and database integration.
* Documented project development progress.
* Continued overall project quality improvement.
