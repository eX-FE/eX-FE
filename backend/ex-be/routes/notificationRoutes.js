const express = require('express');
const { authRequired } = require('../middleware/auth');
const ctrl = require('../controllers/notificationController');

const router = express.Router();

router.get('/', authRequired, ctrl.list);
router.patch('/:id/read', authRequired, ctrl.markRead);
router.patch('/read-all/all', authRequired, ctrl.markAllRead);

module.exports = router;