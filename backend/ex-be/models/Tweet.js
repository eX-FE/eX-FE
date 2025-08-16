const { v4: uuid } = require('uuid');
const hashtagStore = require('./Hashtag');

class TweetStore {
  constructor() {
    this.tweets = []; // In-memory (replace with DB later)
  }

  create({ userId, content, imageUrl = null, poll = null, videoUrl = null }) {
    if (!userId || (!content?.trim() && !poll)) {
      throw new Error('User ID and either content or poll are required');
    }

    const tweet = {
      id: uuid(),
      userId,
      content: content?.trim() || '',
      imageUrl,
      videoUrl,
      poll: poll ? {
        id: uuid(),
        question: poll.question,
        options: poll.options.map((option, index) => ({
          id: index,
          text: option,
          votes: 0
        })),
        totalVotes: 0,
        expiresAt: poll.duration ? new Date(Date.now() + poll.duration * 60 * 60 * 1000) : null,
        votedBy: new Map() // userId -> optionId
      } : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Interaction counts
      stats: {
        likes: 0,
        replies: 0,
        retweets: 0
      },
      // For tracking user interactions
      likedBy: new Set(), // userIds who liked this tweet
      retweetedBy: new Set() // userIds who retweeted this tweet
    };

    // Process hashtags
    if (content?.trim()) {
      const hashtags = hashtagStore.processTweetContent(content);
      hashtagStore.associateWithTweet(tweet.id, hashtags.map(h => h.id));
      tweet.hashtags = hashtags;
    }

    this.tweets.unshift(tweet); // Add to beginning for reverse chronological order
    return tweet;
  }

  findById(id) {
    return this.tweets.find(t => t.id === id);
  }

  findByUserId(userId, opts = {}) {
    const { limit = 50, offset = 0 } = opts;
    return this.tweets
      .filter(t => t.userId === userId)
      .slice(offset, offset + limit);
  }

  // Get feed for a user (their tweets + tweets from people they follow)
  getFeed(userId, followingUserIds = [], opts = {}) {
    const { limit = 50, offset = 0 } = opts;
    const relevantUserIds = [userId, ...followingUserIds];
    
    return this.tweets
      .filter(t => relevantUserIds.includes(t.userId))
      .slice(offset, offset + limit);
  }

  // Get all tweets (public timeline)
  getAll(opts = {}) {
    const { limit = 50, offset = 0 } = opts;
    return this.tweets.slice(offset, offset + limit);
  }

  delete(id, userId) {
    const index = this.tweets.findIndex(t => t.id === id && t.userId === userId);
    if (index === -1) return false;
    this.tweets.splice(index, 1);
    return true;
  }

  // Like/Unlike functionality
  toggleLike(tweetId, userId) {
    const tweet = this.findById(tweetId);
    if (!tweet) throw new Error('Tweet not found');

    const isLiked = tweet.likedBy.has(userId);
    
    if (isLiked) {
      tweet.likedBy.delete(userId);
      tweet.stats.likes = Math.max(0, tweet.stats.likes - 1);
    } else {
      tweet.likedBy.add(userId);
      tweet.stats.likes += 1;
    }
    
    tweet.updatedAt = new Date();
    return { liked: !isLiked, tweet };
  }

  isLikedBy(tweetId, userId) {
    const tweet = this.findById(tweetId);
    return tweet ? tweet.likedBy.has(userId) : false;
  }

  // Poll voting functionality
  votePoll(tweetId, userId, optionId) {
    const tweet = this.findById(tweetId);
    if (!tweet) throw new Error('Tweet not found');
    if (!tweet.poll) throw new Error('Tweet has no poll');
    
    // Check if poll has expired
    if (tweet.poll.expiresAt && new Date() > tweet.poll.expiresAt) {
      throw new Error('Poll has expired');
    }

    // Check if user already voted
    const previousVote = tweet.poll.votedBy.get(userId);
    
    if (previousVote !== undefined) {
      // Remove previous vote
      const prevOption = tweet.poll.options[previousVote];
      if (prevOption) {
        prevOption.votes = Math.max(0, prevOption.votes - 1);
        tweet.poll.totalVotes = Math.max(0, tweet.poll.totalVotes - 1);
      }
    }

    // Add new vote
    const option = tweet.poll.options[optionId];
    if (!option) throw new Error('Invalid option');
    
    option.votes += 1;
    tweet.poll.totalVotes += 1;
    tweet.poll.votedBy.set(userId, optionId);
    
    tweet.updatedAt = new Date();
    return { tweet, votedOption: optionId };
  }

  getUserPollVote(tweetId, userId) {
    const tweet = this.findById(tweetId);
    if (!tweet || !tweet.poll) return null;
    return tweet.poll.votedBy.get(userId);
  }

  // Get safe tweet data (without internal sets)
  safe(tweet) {
    if (!tweet) return null;
    const { likedBy, retweetedBy, ...safeTweet } = tweet;
    
    // Clean poll data for client
    if (safeTweet.poll) {
      safeTweet.poll = {
        ...safeTweet.poll,
        votedBy: undefined // Remove the Map, client will get user vote separately
      };
    }
    
    return safeTweet;
  }

  // Get safe tweets array
  safeArray(tweets) {
    return tweets.map(t => this.safe(t));
  }
}

module.exports = new TweetStore();
