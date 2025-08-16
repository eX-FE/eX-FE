const { v4: uuid } = require('uuid');

class HashtagStore {
  constructor() {
    this.hashtags = []; // In-memory (replace with DB later)
    this.tweetHashtags = new Map(); // tweetId -> Set of hashtagIds
  }

  // Extract hashtags from text
  extractHashtags(text) {
    if (!text) return [];
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.toLowerCase()) : [];
  }

  // Find or create hashtags
  findOrCreateHashtags(hashtagTexts) {
    const hashtagIds = [];
    
    hashtagTexts.forEach(text => {
      let hashtag = this.hashtags.find(h => h.text === text);
      
      if (!hashtag) {
        hashtag = {
          id: uuid(),
          text: text,
          count: 0,
          createdAt: new Date(),
          trending: false
        };
        this.hashtags.push(hashtag);
      }
      
      hashtag.count++;
      hashtag.lastUsed = new Date();
      hashtagIds.push(hashtag.id);
    });
    
    return hashtagIds;
  }

  // Associate hashtags with a tweet
  associateWithTweet(tweetId, hashtagIds) {
    this.tweetHashtags.set(tweetId, new Set(hashtagIds));
  }

  // Get hashtags for a tweet
  getTweetHashtags(tweetId) {
    const hashtagIds = this.tweetHashtags.get(tweetId);
    if (!hashtagIds) return [];
    
    return Array.from(hashtagIds).map(id => 
      this.hashtags.find(h => h.id === id)
    ).filter(Boolean);
  }

  // Get trending hashtags
  getTrending(limit = 10) {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    return this.hashtags
      .filter(h => h.lastUsed && h.lastUsed > oneDayAgo)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(h => ({
        id: h.id,
        text: h.text,
        count: h.count,
        trending: h.count > 5 // Simple trending logic
      }));
  }

  // Search hashtags
  search(query, limit = 20) {
    const searchTerm = query.toLowerCase().replace('#', '');
    
    return this.hashtags
      .filter(h => h.text.includes(searchTerm))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(h => ({
        id: h.id,
        text: h.text,
        count: h.count
      }));
  }

  // Get all hashtags
  getAll() {
    return this.hashtags.map(h => ({
      id: h.id,
      text: h.text,
      count: h.count,
      trending: h.count > 5
    }));
  }

  // Process tweet content and return hashtags
  processTweetContent(content) {
    const hashtagTexts = this.extractHashtags(content);
    if (hashtagTexts.length === 0) return [];
    
    const hashtagIds = this.findOrCreateHashtags(hashtagTexts);
    return hashtagIds.map(id => this.hashtags.find(h => h.id === id)).filter(Boolean);
  }

  // Remove association when tweet is deleted
  removeTweetAssociation(tweetId) {
    const hashtagIds = this.tweetHashtags.get(tweetId);
    if (hashtagIds) {
      hashtagIds.forEach(id => {
        const hashtag = this.hashtags.find(h => h.id === id);
        if (hashtag) {
          hashtag.count = Math.max(0, hashtag.count - 1);
        }
      });
      this.tweetHashtags.delete(tweetId);
    }
  }
}

module.exports = new HashtagStore();
