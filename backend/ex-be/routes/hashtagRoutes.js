const express = require('express');
const router = express.Router();
const hashtagStore = require('../models/Hashtag');

// Get trending hashtags
router.get('/trending', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const trending = hashtagStore.getTrending(limit);
    res.json({ hashtags: trending });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get trending hashtags' });
  }
});

// Search hashtags
router.get('/search', (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const limit = parseInt(req.query.limit) || 20;
    const results = hashtagStore.search(q, limit);
    res.json({ hashtags: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search hashtags' });
  }
});

// Get all hashtags
router.get('/', (req, res) => {
  try {
    const hashtags = hashtagStore.getAll();
    res.json({ hashtags });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get hashtags' });
  }
});

module.exports = router;
