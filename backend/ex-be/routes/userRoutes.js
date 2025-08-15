const express = require('express');
const { authRequired } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

const router = express.Router();

// Fixed routes first
router.get('/me', authRequired, ctrl.me);
router.patch('/me', authRequired, ctrl.updateMe);
router.delete('/me', authRequired, ctrl.deleteMe);

// Search (partial match by username or displayName)
router.get('/search', ctrl.search);

// Dynamic last
router.get('/:username', ctrl.getByUsername);

module.exports = router;