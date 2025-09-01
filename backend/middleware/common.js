import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// CORS middleware
export const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://oguzyolyapan.com',
        'https://www.oguzyolyapan.com',
        process.env.CORS_ORIGIN
      ].filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
});

// Rate limiting
export const rateLimitMiddleware = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
export const securityMiddleware = helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false
});

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error('❌ API Error:', err);

  // Default error
  let error = {
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = {
      success: false,
      error: messages.join(', '),
      code: 'VALIDATION_ERROR'
    };
    return res.status(400).json(error);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = {
      success: false,
      error: `${field} already exists`,
      code: 'DUPLICATE_ERROR'
    };
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN'
    };
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      success: false,
      error: 'Token expired',
      code: 'TOKEN_EXPIRED'
    };
    return res.status(401).json(error);
  }

  // MongoDB connection errors
  if (err.name === 'MongoTimeoutError' || err.name === 'MongoNetworkTimeoutError') {
    error = {
      success: false,
      error: 'Database connection timeout',
      code: 'DB_TIMEOUT'
    };
    return res.status(503).json(error);
  }

  res.status(500).json(error);
};
