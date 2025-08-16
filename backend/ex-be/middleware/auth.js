const { verifyAccess } = require('../utils/token');
const userStore = require('../models/User');

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
  const token = header.replace(/^Bearer\s+/i, '');
  try {
    const decoded = verifyAccess(token);
    const user = userStore.findById(decoded.sub);
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function authOptional(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    req.user = null;
    return next();
  }
  
  const token = header.replace(/^Bearer\s+/i, '');
  try {
    const decoded = verifyAccess(token);
    const user = userStore.findById(decoded.sub);
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { authRequired, authOptional };