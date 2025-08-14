const express = require('express');
const { authRequired } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

const router = express.Router();

// Fixed routes first
router.get('/me', authRequired, ctrl.me);
router.patch('/me', authRequired, ctrl.updateMe);
router.delete('/me', authRequired, ctrl.deleteMe);

// Dynamic last
router.get('/:username', ctrl.getByUsername);

module.exports = router;