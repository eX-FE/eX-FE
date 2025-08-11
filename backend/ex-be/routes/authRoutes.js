const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimit');
const { authRequired } = require('../middleware/auth');


router.post('/register', authLimiter, ctrl.register);
router.post('/login', authLimiter, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authRequired, ctrl.me);

// Optional stubs
router.post('/password/reset/request', ctrl.requestPasswordReset);
router.get('/verify-email', ctrl.verifyEmail);

module.exports = router;