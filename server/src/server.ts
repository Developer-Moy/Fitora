import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './config/db.js';
import apiRouter from './routes/index.js';
import mealChartRoutes from './routes/mealChart.routes.js';
import { setupSocketHandlers } from './sockets/index.js';

// Routes import
import bmiRoutes from './routes/bmi.routes.js';
import dashboardStatisticSummary from './routes/user.routes.js';

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
app.set('io', io);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardStatisticSummary);
// API Routes
app.use('/api', mealChartRoutes);
// BMI History API
app.use('/api/bmi', bmiRoutes);

// Root API Route
// Root Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    message: 'Fitora Server API Running',
    version: '1.0.0'
  });
});

// API Routes
app.use('/api', apiRouter);

// Initialize Socket.IO handlers
setupSocketHandlers(io);

// Start server and connect database
const startServer = async () => {
  server.listen(PORT, () => {
    console.log(`[Fitora Server] Running on http://localhost:${PORT}`);
  });
  await connectDB();
};

startServer();
