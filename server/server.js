import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force Node.js process-wide to prefer IPv4 addresses over IPv6 (fixes cloud host ENETUNREACH)
dns.setDefaultResultOrder('ipv4first');
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';

import applicationRoutes from './routes/applicationRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

// Resolve parent .env file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting behind Render/Vercel reverse proxies
app.set('trust proxy', 1);

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// General API Rate Limiter (300 requests per 15 mins per IP for smooth admin & student dashboard reads)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Strict Form Submission Rate Limiter (30 form submissions per 15 mins per IP to block spam bots)
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many form submissions from this IP. Please try again after 15 minutes.' }
});

// Apply general rate limiter
app.use('/api/', generalLimiter);

// Specific POST submission limiters for write routes only
app.post('/api/applications', submitLimiter);
app.post('/api/inquiries', submitLimiter);
app.post('/api/subscribers', submitLimiter);

// API Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/email', emailRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Appifyra Express + MongoDB API Online with Rate Limiting Security 🛡️' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Appifyra Backend API running on port ${PORT}`);
});
