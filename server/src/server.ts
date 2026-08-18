import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { setupSocketHandlers } from './sockets/index';
import aiRoutes from './routes/ai.routes';

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

// Root API Route
app.get('/', (req: Request, res: Response) => {
  res.send('Fitora Server Running');
});

// Register API Routes
app.use('/api/ai', aiRoutes);

// Initialize Socket.IO handlers
setupSocketHandlers(io);

// Start server and connect database
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`[Fitora Server] Running on http://localhost:${PORT}`);
  });
};

startServer();
