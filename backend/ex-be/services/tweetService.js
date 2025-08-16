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
  
  // Add like and retweet status if user is logged in
  if (currentUserId) {
    enrichedTweet.isLiked = tweetStore.isLikedBy(tweetId, currentUserId);
    enrichedTweet.isRetweeted = tweetStore.isRetweetedBy(tweetId, currentUserId);
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
    enrichedTweet.isRetweeted = tweetStore.isRetweetedBy(tweet.id, userId);
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

async function getAllTweets(opts = {}) {
  return getPublicTimeline(opts);
}

async function searchTweets(query, opts = {}) {
  const allTweets = tweetStore.getAll();
  const searchQuery = query.toLowerCase();
  
  const matchingTweets = allTweets.filter(tweet => {
    const content = tweet.content?.toLowerCase() || '';
    const user = userStore.findRawById(tweet.userId);
    const username = user?.username?.toLowerCase() || '';
    const displayName = user?.displayName?.toLowerCase() || '';
    
    return content.includes(searchQuery) || 
           username.includes(searchQuery) || 
           displayName.includes(searchQuery);
  });

  // Apply pagination
  const { limit = 20, offset = 0 } = opts;
  const paginatedTweets = matchingTweets.slice(offset, offset + limit);
  
  return paginatedTweets.map(tweet => {
    const user = userStore.findRawById(tweet.userId);
    return enrichTweetWithUser(tweet, user);
  });
}

async function createReply(parentTweetId, userId, content) {
  const parentTweet = tweetStore.findById(parentTweetId);
  if (!parentTweet) throw new Error('Parent tweet not found');
  
  const user = userStore.findRawById(userId);
  if (!user) throw new Error('User not found');

  // Create reply as a new tweet with replyTo metadata
  const reply = tweetStore.create({
    userId,
    content,
    replyTo: parentTweetId
  });

  // Update parent tweet's reply count
  parentTweet.stats.replies += 1;

  // Create notification for reply (but not for self-replies)
  if (userId !== parentTweet.userId) {
    try {
      notificationService.createReplyNotification({
        actorUserId: userId,
        targetUserId: parentTweet.userId,
        entityId: reply.id,
        parentTweetId
      });
    } catch (error) {
      console.warn('Failed to create reply notification:', error.message);
    }
  }

  return enrichTweetWithUser(reply, user);
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

async function toggleRetweet(tweetId, userId) {
  const result = tweetStore.toggleRetweet(tweetId, userId);
  const user = userStore.findRawById(result.tweet.userId);
  
  // Create notification for retweet (but not for self-retweets)
  if (result.retweeted && userId !== result.tweet.userId) {
    try {
      notificationService.createRetweetNotification({
        actorUserId: userId,
        targetUserId: result.tweet.userId,
        entityId: tweetId
      });
    } catch (error) {
      console.warn('Failed to create retweet notification:', error.message);
    }
  }
  
  return {
    retweeted: result.retweeted,
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
  const user = userStore.findRawById(result.tweet.userId);
  
  return {
    tweet: enrichTweetWithUser(result.tweet, user),
    votedOption: result.votedOption
  };
}

// Updated getFeed function (removing duplicate)
async function getFeedV2(userId, opts = {}) {
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
    
    // Add user's poll vote if exists
    if (tweet.poll) {
      enrichedTweet.poll.userVote = tweetStore.getUserPollVote(tweet.id, userId);
    }
    
    return enrichedTweet;
  });
}

module.exports = {
  createTweet,
  getTweetById,
  getUserTweets,
  getFeed: getFeedV2,
  getAllTweets,
  getPublicTimeline,
  deleteTweet,
  toggleLike,
  toggleRetweet,
  votePoll,
  searchTweets,
  createReply
};
