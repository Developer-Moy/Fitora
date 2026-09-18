import express, { Request, Response } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { setupSocketHandlers } from "./sockets/index.js";
import apiRouter from "./routes/index.js";
import { seedStopwatchPresets } from "./data/stopwatch.seed.js";

import { handleStripeWebhook } from "./controllers/payment.controller.js";
import { apiLimiter, authLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:")
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  }),
);

// Helmet Security Headers
// Registered as the first header-setting middleware so that every response
// (including the Stripe webhook and error responses) is hardened.
//
// IMPORTANT: this backend is a JSON API consumed by a browser app on a
// DIFFERENT origin (client :3000 -> server :5000). Helmet's strict
// cross-origin isolation defaults are designed for same-origin rendered HTML
// apps and would break that split-origin setup, so three defaults are relaxed
// while every other protection is kept:
//   - crossOriginResourcePolicy "cross-origin": the frontend loads remote
//     images (Unsplash, avatars) and reads API responses cross-origin.
//   - crossOriginOpenerPolicy false: avoids breaking OAuth / better-auth
//     redirect + popup flows that rely on window.opener.
//   - crossOriginEmbedderPolicy false: avoids breaking third-party embeds.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // This server returns JSON, never HTML pages, so no inline
        // script or stylesheet execution is required.
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        // Allow the API + realtime (Socket.IO) traffic to the client origin.
        connectSrc: ["'self'", "https:", "wss:", ...allowedOrigins],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
      },
    },
  }),
);

// Stripe Webhook Endpoint: MUST receive unparsed raw body for cryptographic signature verification
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

// Standard JSON body parser for all subsequent API endpoints
app.use(express.json());

// Rate Limiting (abuse protection)
// Mounted per-path rather than globally so that Socket.IO (which upgrades the
// same HTTP server on /socket.io) is never metered.
//
//   /api/auth/*  -> authLimiter only   (5 req / 15 min per IP)
//   /api/*       -> apiLimiter         (100 req / 15 min per IP)
//   /api/health  -> unmetered (probe-friendly)
//
// `apiLimiter` internally skips `/api/auth` (see `isAuthPath`) so the two
// budgets stay independent: the stricter auth quota is never silently drained
// by ordinary API traffic, and a busy API client is never locked out of
// signing in. Each limiter's `skip` also bypasses CORS preflight and health.
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// Root Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Fitora Server API Running",
    data: {
      version: "1.0.0",
    },
    timestamp: new Date().toISOString(),
  });
});

// Mounted Central API Router (/api/workouts, /api/ai, /api/auth, /api/goals, /api/meal-charts, /api/bmi, /api/dashboard, /api/ads, /api/health)
app.use("/api", apiRouter);

// 404 Handler: any request that reached this point matched no route.
// Registered AFTER all routes but BEFORE the error handler so unmatched
// URLs return the standard Fitora error envelope instead of Express's
// default HTML page (which leaks the framework banner in production).
app.use(notFoundHandler);

// Global Error Handler: MUST be registered last, and MUST keep its
// four-argument signature for Express to treat it as an error handler.
// Converts Mongoose, JWT, OAuth/Better-Auth and unknown errors into the
// single Fitora error envelope, hiding stack traces in production.
app.use(errorHandler);

// Initialize Socket.IO handlers
setupSocketHandlers(io);

// Start server and connect database
const startServer = async () => {
  server.listen(PORT, () => {
    console.log(`[Fitora Server] Running on http://localhost:${PORT}`);
  });
  await connectDB();
  await seedStopwatchPresets();
};

startServer();
