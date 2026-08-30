import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { setupSocketHandlers } from './sockets/index.js';
import apiRouter from './routes/index.js';
import { seedStopwatchPresets } from './data/stopwatch.seed.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Socket.IO configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Root Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    message: 'Fitora Server API Running',
    version: '1.0.0'
  });
});

// Mounted Central API Router (/api/workouts, /api/ai, /api/auth, /api/goals, /api/meal-charts, /api/bmi, /api/dashboard, /api/ads, /api/health)
app.use('/api', apiRouter);

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
