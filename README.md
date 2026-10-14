<div align="center">

# 🏋️‍♂️ FITORA — AI-Powered Realtime Fitness & Gym Ecosystem

> **The Premier High-Performance Fitness Platform in Bangladesh**  
> Connecting athletes, trainers, and gym branches through an ultra-luxury Pure Black & White design, intelligent AI coaching, contactless check-ins, and frictionless multi-gateway payments.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-black?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Mongoose-black?style=for-the-badge&logo=mongodb)](https://mongoosejs.com/)
[![Google Gemini Flash](https://img.shields.io/badge/Google_Gemini-Flash_AI-black?style=for-the-badge&logo=google)](https://aistudio.google.com/)

<img src="./docs/fitora.png" alt="FITORA Preview" width="100%" style="border-radius: 12px; margin: 20px 0;" />

[🌐 **Live Production**](https://fitora-fitness.vercel.app) • [💻 **Frontend Guide**](client/README.md) • [⚙️ **Backend Guide**](server/README.md) • [📝 **Changelog**](docs/moloy.md)

</div>

---

## 💡 Why FITORA? (The Human & Business Impact)

Traditional gym software treats people like data points. FITORA is built with empathy to solve real-world psychological and operational friction.

### 🏃‍♂️ For Athletes (The Human Aspect)
- **Zero Intimidation:** 50+ Interactive Video Exercises ensure safe form before lifting.
- **Never Feel Alone:** 24/7 AI Coach (Google Gemini) provides instant bespoke fitness/nutrition advice.
- **Hyper-Personalization:** System dynamically generates meal and hydration plans based on saved profiles.
- **Consistency Gamified:** 365-Day Activity Heatmap rewards attendance, turning fitness into a habit.
- **VIP Experience:** Contactless Turnstile QR Entry and frictionless local billing (bKash/Nagad).

### 🏢 For Gym Owners (The Business Aspect)
- **100% Loss Prevention:** QR scans instantly verify MongoDB records. Zero ghost members.
- **Master Command Center:** Live telemetry across all nationwide branches (Occupancy, Revenue).
- **Smart Retention:** "Save Card = 2 Bonus Months FREE" hooks users and drastically increases LTV.
- **Zero-Admin Hassle:** Automated session booking and conflict resolution with Nodemailer notifications.
- **Premium Value:** A luxury Pure Black & White UI justifies higher membership tiers.

---

## 🌟 Ecosystem Highlights

FITORA is a unified ecosystem encompassing client engagement and enterprise management:

1. **Floating AI Fitness Studio:** Persistent morphing widget with 1-click protocols (`HYPERTROPHY`, `FAT LOSS`).
2. **All-in-One Member Hub:** Live subscription expiry tickers, biometric ledgers, and workout tracking.
3. **Frictionless Commerce:** Stripe, bKash, and Nagad integrations with instant vector PDF invoices (`jsPDF`).
4. **Data Management Portal:** Secure multipart upload forms for Trainers, Meals, and Exercises.

---

## 🏗️ Technical Stack & Architecture

We utilize a modern, type-safe stack designed for speed and reliability.

| Layer                   | Technologies & Tools                                                               |
| ----------------------- | ---------------------------------------------------------------------------------- |
| **Frontend Client**     | Next.js 16, React 19, Tailwind CSS v4, TypeScript, Lucide Icons                    |
| **Backend Server**      | Node.js 18+, Express.js 4, Socket.IO, JWT, Bcrypt.js                               |
| **Database & Cloud**    | MongoDB Atlas, Mongoose, Google AI Studio, Stripe API                              |

> 📌 **Deep Dive Documentation:**  
> For extensive details on UI components, routing, and state management, see the **[Client README](client/README.md)**.  
> For API endpoints, schema structures, and auth flow, see the **[Server README](server/README.md)**.

---

## 🚀 Quickstart

1. **Clone & Install:**
   ```bash
   git clone https://github.com/Developer-Moy/Fitora.git
   cd Fitora
   pnpm install
   ```
2. **Environment Setup:** Create `.env` files in `client/` and `server/` (See nested READMEs for required keys).
3. **Launch Concurrent Servers:**
   ```bash
   pnpm dev
   ```

---

<div align="center">
  <p>Design and Developed by <a href="https://github.com/Developer-Moy"><b>Developer-Moy</b></a></p>
  <p>Licensed under the <b>MIT License</b>.</p>
</div>
