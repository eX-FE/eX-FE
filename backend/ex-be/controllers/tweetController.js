const tweetService = require('../services/tweetService');
const pushNotificationService = require('../services/pushNotificationService');
const User = require('../models/User');

async function create(req, res, next) {
  try {
    console.log('createTweet called');
    const { content, imageUrl, videoUrl, poll } = req.body;
    const userId = req.user.id;

    if (!content?.trim() && !poll) {
      return res.status(400).json({ error: 'Tweet content or poll is required' });
    }

    if (content && content.length > 280) {
      return res.status(400).json({ error: 'Tweet content must be 280 characters or less' });
    }

    const tweet = await tweetService.createTweet({
      userId,
      content: content?.trim(),
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      poll: poll || null
    });

    // Emit WebSocket event for real-time updates
    const wsManager = req.app.get('wsManager');
    if (wsManager) {
      wsManager.notifyNewTweet(tweet, tweet.user);
    }

    console.log('Tweet created:', tweet);
    return res.status(201).json({ 
      message: 'Tweet created successfully',
      tweet
    });
  } catch (error) {
    console.error('Error in createTweet:', error);
    next(error);
  }
}

async function getTweets(req, res, next) {
  try {
    console.log('getTweets called');
    const { limit, offset, userId, feedType } = req.query;
    const currentUserId = req.user?.id;
    
    const options = {
      limit: parseInt(limit) || 50,
      offset: parseInt(offset) || 0
    };

    let tweets;
    
    if (feedType === 'feed' && currentUserId) {
      // Get user's feed (from people they follow)
      tweets = await tweetService.getFeed(currentUserId, options);
    } else if (userId) {
      // Get tweets from specific user
      tweets = await tweetService.getUserTweets(userId, options);
      // Add like/retweet status for current user if logged in
      if (currentUserId) {
        tweets = tweets.map(tweet => ({
          ...tweet,
          isLiked: require('../models/Tweet').isLikedBy(tweet.id, currentUserId),
          isRetweeted: require('../models/Tweet').isRetweetedBy(tweet.id, currentUserId)
        }));
      }
    } else {
      // Get all tweets (explore/public timeline)
      tweets = await tweetService.getAllTweets(options);
      // Add like/retweet status for current user if logged in
      if (currentUserId) {
        tweets = tweets.map(tweet => ({
          ...tweet,
          isLiked: require('../models/Tweet').isLikedBy(tweet.id, currentUserId),
          isRetweeted: require('../models/Tweet').isRetweetedBy(tweet.id, currentUserId)
        }));
      }
    }
    
    return res.json({ 
      tweets,
      hasMore: tweets.length === options.limit
    });
  } catch (error) {
    console.error('Error in getTweets:', error);
    next(error);
  }
}

async function getTweetById(req, res, next) {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    const tweet = await tweetService.getTweetById(id, currentUserId);
    
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    return res.json({ tweet });
  } catch (error) {
    next(error);
  }
}

async function deleteTweet(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await tweetService.deleteTweet(id, userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Tweet not found or unauthorized' });
    }

    return res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function toggleLike(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await tweetService.toggleLike(id, userId);
    
    // Emit WebSocket event for real-time updates
    const wsManager = req.app.get('wsManager');
    if (wsManager) {
      wsManager.notifyTweetLike(id, userId, result.liked);
    }
    
    // Send push notification if tweet was liked (not unliked)
    if (result.liked && result.tweet) {
      try {
        const tweetAuthor = await User.getById(result.tweet.userId);
        const likerUser = await User.getById(userId);
        
        // Don't send notification if user liked their own tweet
        if (tweetAuthor && likerUser && tweetAuthor.id !== userId) {
          await pushNotificationService.notifyTweetLike(
            tweetAuthor.id, 
            likerUser, 
            result.tweet.content || 'your tweet'
          );
        }
      } catch (notificationError) {
        console.error('Failed to send like notification:', notificationError);
        // Don't fail the like operation if notification fails
      }
    }
    
    return res.json({
      message: result.liked ? 'Tweet liked' : 'Tweet unliked',
      liked: result.liked,
      tweet: result.tweet
    });
  } catch (error) {
    next(error);
  }
}

async function toggleRetweet(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await tweetService.toggleRetweet(id, userId);
    
    // Emit WebSocket event for real-time updates
    const wsManager = req.app.get('wsManager');
    if (wsManager) {
      wsManager.notifyTweetRetweet(id, userId, result.retweeted);
    }
    
    return res.json({
      message: result.retweeted ? 'Tweet retweeted' : 'Retweet removed',
      retweeted: result.retweeted,
      tweet: result.tweet
    });
  } catch (error) {
    next(error);
  }
}

async function getFeed(req, res, next) {
  try {
    const userId = req.user.id;
    const tweets = await tweetService.getFeed(userId);
    
    return res.json({
      tweets
    });
  } catch (error) {
    next(error);
  }
}

async function votePoll(req, res, next) {
  try {
    const { id } = req.params;
    const { optionId } = req.body;
    const userId = req.user.id;

    if (optionId === undefined || optionId === null) {
      return res.status(400).json({ error: 'Option ID is required' });
    }

    const result = await tweetService.votePoll(id, userId, optionId);
    
    // Emit WebSocket event for real-time poll updates
    const wsManager = req.app.get('wsManager');
    if (wsManager) {
      wsManager.notifyPollVote(id, result.tweet.poll);
    }
    
    return res.json({
      message: 'Vote recorded',
      tweet: result.tweet,
      votedOption: result.votedOption
    });
  } catch (error) {
    next(error);
  }
}

async function replyToTweet(req, res, next) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Reply content is required' });
    }

    if (content.length > 280) {
      return res.status(400).json({ error: 'Reply content must be 280 characters or less' });
    }

    const reply = await tweetService.createReply(id, userId, content.trim());
    
    // Emit WebSocket event for real-time updates
    const wsManager = req.app.get('wsManager');
    if (wsManager) {
      wsManager.notifyNewReply(reply, reply.user);
    }
    
    return res.status(201).json({
      message: 'Reply created successfully',
      tweet: reply
    });
  } catch (error) {
    next(error);
  }
}

async function searchTweets(req, res, next) {
  try {
    const { q: query, limit, offset } = req.query;
    
    if (!query?.trim()) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const options = {
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0
    };

    const tweets = await tweetService.searchTweets(query.trim(), options);
    
    return res.json({
      tweets,
      query: query.trim(),
      hasMore: tweets.length === options.limit
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  getTweets,
  getTweetById,
  deleteTweet,
  toggleLike,
  toggleRetweet,
  getFeed,
  votePoll,
  replyToTweet,
  searchTweets
};
