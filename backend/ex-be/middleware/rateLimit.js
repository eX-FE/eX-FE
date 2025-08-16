const rateLimit = require('express-rate-limit');

const isProd = process.env.NODE_ENV === 'production';

const apiLimiter = isProd ? rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later.' }
}) : (req, res, next) => next();

const authLimiter = isProd ? rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  message: { error: 'Too many auth attempts, slow down.' }
}) : (req, res, next) => next();

module.exports = { apiLimiter, authLimiter };