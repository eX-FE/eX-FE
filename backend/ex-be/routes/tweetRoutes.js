const express = require('express');
const { authRequired } = require('../middleware/auth');
const ctrl = require('../controllers/tweetController');

const router = express.Router();

// Simple test route
router.get('/', (req, res) => {
  console.log('GET /api/tweets called');
  res.json({ message: 'Tweet API working', tweets: [] });
});

router.get('/test', (req, res) => {
  console.log('GET /api/tweets/test called');
  res.json({ message: 'Test endpoint working' });
});

// Tweet CRUD operations
router.post('/', authRequired, ctrl.create);
router.get('/feed', authRequired, ctrl.getFeed);
router.post('/:id/like', authRequired, ctrl.toggleLike);
router.post('/:id/vote', authRequired, ctrl.votePoll);

module.exports = router;
