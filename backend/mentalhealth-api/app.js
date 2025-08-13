import express from "express";
import cors from "cors";
import helmet from "helmet";
import predictRoutes from "./routes/predictRoutes.js";
import errorHandler from "./middileware/globalErrorHandler.js";
import logger from "./utils/logger.js";

import mongodbConnect from "./config/Database-Connection.js";
import emailRoutes from './routes/emailRoutes.js';
import { randomUUID } from 'crypto';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import env from './config/env.js';
const app = express();
// Only connect to MongoDB if a URI is provided
if (env.mongodbURI) {
  mongodbConnect();
} else {
  logger.warn("No MongoDB URI found in .env. Skipping database connection.");
}

const allowedOrigin = env.CORS_ORIGIN || "http://127.0.0.1:5500";

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin === allowedOrigin) return cb(null, true);
    return cb(new Error('CORS not allowed'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Basic rate limiter (tune values later)
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false });

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Request ID middleware
app.use((req,res,next)=>{
  req.id = randomUUID();
  logger.info(`REQ ${req.id} ${req.method} ${req.originalUrl}`);
  res.setHeader('X-Request-ID', req.id);
  next();
});
logger.info("App initializing...");
// Enhanced health endpoint
app.get('/health', async (req, res) => {
  const state = mongoose.connection?.readyState;
  const dbStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const db = env.SKIP_DB === 'true' && !env.mongodbURI ? 'skipped' : dbStates[state] || 'unknown';
  const uptime = process.uptime();
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    uptimeSeconds: Math.round(uptime),
    db,
    memory: { rss: mem.rss, heapUsed: mem.heapUsed }
  });
});

app.use("/api/mentalhealth", limiter, predictRoutes);

app.use('/api/email', emailRoutes);

// 404 handler
app.use((req, res, next) => {
  return res.status(404).json({ success: false, message: 'Resource not found' });
});

app.use(errorHandler);

export { app };