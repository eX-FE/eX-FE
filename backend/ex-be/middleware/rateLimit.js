const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  message: { error: 'Too many auth attempts, slow down.' }
});

module.exports = { apiLimiter, authLimiter };