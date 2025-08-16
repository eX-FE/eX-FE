const tweetStore = require('../models/Tweet');
const userStore = require('../models/User');
const followStore = require('../models/Follow');
const notificationService = require('./notificationService');

async function createTweet({ userId, content, imageUrl, videoUrl, poll }) {
  const user = userStore.findRawById(userId);
  if (!user) throw new Error('User not found');

  const tweet = tweetStore.create({
    userId,
    content,
    imageUrl,
    videoUrl,
    poll
  });

  // Update user's tweet count
  if (user.stats) {
    user.stats.tweets += 1;
  }

  // Return tweet with user information
  return enrichTweetWithUser(tweet, user);
}

async function getTweetById(tweetId, currentUserId = null) {
  const tweet = tweetStore.findById(tweetId);
  if (!tweet) return null;

  const user = userStore.findRawById(tweet.userId);
  if (!user) return null;

  const enrichedTweet = enrichTweetWithUser(tweet, user);
  
  // Add like status if user is logged in
  if (currentUserId) {
    enrichedTweet.isLiked = tweetStore.isLikedBy(tweetId, currentUserId);
  }

  return enrichedTweet;
}

async function getUserTweets(userId, opts = {}) {
  const user = userStore.findRawById(userId);
  if (!user) throw new Error('User not found');

  const tweets = tweetStore.findByUserId(userId, opts);
  return tweets.map(tweet => enrichTweetWithUser(tweet, user));
}

async function getFeed(userId, opts = {}) {
  const user = userStore.findRawById(userId);
  if (!user) throw new Error('User not found');

  // Get list of users that this user follows
  const followingUserIds = followStore.followingOf(userId);
  
  const tweets = tweetStore.getFeed(userId, followingUserIds, opts);
  
  // Enrich tweets with user data and like status
  return tweets.map(tweet => {
    const tweetUser = userStore.findRawById(tweet.userId);
    const enrichedTweet = enrichTweetWithUser(tweet, tweetUser);
    enrichedTweet.isLiked = tweetStore.isLikedBy(tweet.id, userId);
    return enrichedTweet;
  });
}

async function getPublicTimeline(opts = {}) {
  const tweets = tweetStore.getAll(opts);
  
  return tweets.map(tweet => {
    const user = userStore.findRawById(tweet.userId);
    return enrichTweetWithUser(tweet, user);
  });
}

async function deleteTweet(tweetId, userId) {
  const tweet = tweetStore.findById(tweetId);
  if (!tweet || tweet.userId !== userId) return false;

  const deleted = tweetStore.delete(tweetId, userId);
  
  if (deleted) {
    // Update user's tweet count
    const user = userStore.findRawById(userId);
    if (user) {
      user.stats.tweets = Math.max(0, user.stats.tweets - 1);
    }
  }
  
  return deleted;
}

async function toggleLike(tweetId, userId) {
  const result = tweetStore.toggleLike(tweetId, userId);
  const user = userStore.findRawById(result.tweet.userId);
  
  // Create notification for like (but not for self-likes)
  if (result.liked && userId !== result.tweet.userId) {
    try {
      notificationService.createLikeNotification({
        actorUserId: userId,
        targetUserId: result.tweet.userId,
        entityId: tweetId
      });
    } catch (error) {
      console.warn('Failed to create like notification:', error.message);
    }
  }
  
  return {
    liked: result.liked,
    tweet: enrichTweetWithUser(result.tweet, user)
  };
}

// Helper function to enrich tweet with user data
function enrichTweetWithUser(tweet, user) {
  if (!user) return tweetStore.safe(tweet);
  
  const safeTweet = tweetStore.safe(tweet);
  return {
    ...safeTweet,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName || user.username,
      avatarUrl: user.avatarUrl || '',
      verified: user.verified || false
    }
  };
}

function votePoll(tweetId, userId, optionId) {
  const result = tweetStore.votePoll(tweetId, userId, optionId);
  const user = userStore.findRawById(userId);
  
  return {
    tweet: decorateTweet(result.tweet, user),
    votedOption: result.votedOption
  };
}

function getFeed(userId) {
  // Get all tweets and decorate them
  const allTweets = tweetStore.getAll();
  const user = userStore.findRawById(userId);
  
  return allTweets.map(tweet => {
    const tweetUser = userStore.findRawById(tweet.userId);
    const decorated = decorateTweet(tweet, tweetUser);
    
    // Add user's poll vote if exists
    if (tweet.poll) {
      decorated.poll.userVote = tweetStore.getUserPollVote(tweet.id, userId);
    }
    
    return decorated;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  createTweet,
  getTweetById,
  getUserTweets,
  getFeed,
  getPublicTimeline,
  deleteTweet,
  toggleLike,
  votePoll
};
