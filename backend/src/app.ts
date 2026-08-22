import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import apiRoutes from './routes/index.js';
import webhookRoutes from './routes/webhookRoutes.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);

// Capture raw body buffer for webhook signature verification
app.use(
  express.json({
    limit: '10mb',
    verify: (req: any, res: Response, buf: Buffer) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiting
app.use('/api', apiRateLimiter);

// Webhook Routes (Must come before standard error handlers)
app.use('/api/webhooks', webhookRoutes);

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'RPAI Backend API',
    razorpayIntegration: 'Test Mode Active',
    timestamp: new Date().toISOString(),
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
