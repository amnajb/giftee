/**
 * Giftee Platform - Main Server Entry Point
 * Complete Express application with all routes integrated
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const giftcardRoutes = require('./routes/giftcard.routes');
const qrRoutes = require('./routes/qr.routes');
const loyaltyRoutes = require('./routes/loyalty.routes');
const rewardsRoutes = require('./routes/rewards.routes');
const adminRoutes = require('./routes/admin.routes');
const cashierRoutes = require('./routes/cashier.routes');

// Create Express app
const app = express();

// ======================
// Security Middleware
// ======================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", 'https://api.line.me', 'wss:']
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'https://giftee.app',
      'https://admin.giftee.app',
      'https://liff.line.me'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-LIFF-Token'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};
app.use(cors(corsOptions));
app.use(compression());

// ======================
// Rate Limiting
// ======================

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many authentication attempts.' }
});

app.use('/api/', generalLimiter);

// ======================
// Body Parsing
// ======================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ======================
// Request Logging
// ======================

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ======================
// Health Check
// ======================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/health', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'giftee-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ======================
// API Routes
// ======================

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/giftcard', giftcardRoutes);
app.use('/api/giftcards', giftcardRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/cashier', cashierRoutes);
app.use('/api/admin', adminRoutes);

app.use('/uploads', express.static('uploads'));

// ======================
// Error Handling
// ======================

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Endpoint not found', path: req.originalUrl });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, error: `Duplicate value for ${field}` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Authentication failed' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
});

// ======================
// Database Connection
// ======================

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/giftee';
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, { maxPoolSize: 10, serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected successfully');
    
    mongoose.connection.on('error', err => console.error('MongoDB error:', err));
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// ======================
// Graceful Shutdown
// ======================

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down...`);
  await mongoose.connection.close();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => { console.error('Uncaught Exception:', err); process.exit(1); });

// ======================
// Server Start
// ======================

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`
🚀 Giftee API Server started!
   Environment: ${process.env.NODE_ENV || 'development'}
   Port: ${PORT}
   
📍 Endpoints: /api/auth, /api/users, /api/giftcards, /api/qr, /api/loyalty, /api/rewards, /api/cashier, /api/admin
    `);
  });
};

module.exports = { app, startServer, connectDB };

if (require.main === module) {
  startServer();
}
