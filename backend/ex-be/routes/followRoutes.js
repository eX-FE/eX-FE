const express = require('express');
const { authRequired } = require('../middleware/auth');
const ctrl = require('../controllers/followController');

const router = express.Router();

// Mutations require auth
router.post('/:username', authRequired, ctrl.follow);
router.delete('/:username', authRequired, ctrl.unfollow);

// Public lists
router.get('/:username/followers', ctrl.followers);
router.get('/:username/following', ctrl.following);

module.exports = router;