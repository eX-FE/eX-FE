const express = require('express');
const { authRequired, authOptional } = require('../middleware/auth');
const ctrl = require('../controllers/tweetController');

const router = express.Router();

// Get tweets with optional auth (for public timeline)
router.get('/', authOptional, ctrl.getTweets);

// Search tweets
router.get('/search', authOptional, ctrl.searchTweets);

// Get user's feed (requires auth)
router.get('/feed', authRequired, ctrl.getFeed);

// Get specific tweet
router.get('/:id', authOptional, ctrl.getTweetById);

// Tweet CRUD operations
router.post('/', authRequired, ctrl.create);
router.delete('/:id', authRequired, ctrl.deleteTweet);

// Tweet interactions
router.post('/:id/like', authRequired, ctrl.toggleLike);
router.post('/:id/retweet', authRequired, ctrl.toggleRetweet);
router.post('/:id/reply', authRequired, ctrl.replyToTweet);
router.post('/:id/vote', authRequired, ctrl.votePoll);

module.exports = router;
