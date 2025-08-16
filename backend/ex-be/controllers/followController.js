const svc = require('../services/followService');
const pushNotificationService = require('../services/pushNotificationService');
const User = require('../models/User');

async function follow(req, res, next) {
  try {
    const { username } = req.params;
    const result = svc.follow(req.user.id, username);
    
    // Send push notification to followed user
    try {
      const targetUser = await User.getByUsername(username);
      const followerUser = await User.getById(req.user.id);
      
      if (targetUser && followerUser) {
        await pushNotificationService.notifyNewFollower(targetUser.id, followerUser);
      }
    } catch (notificationError) {
      console.error('Failed to send follow notification:', notificationError);
      // Don't fail the follow operation if notification fails
    }
    
    res.status(201).json({ message: 'Followed', ...result });
  } catch (e) { next(e); }
}

function unfollow(req, res, next) {
  try {
    const { username } = req.params;
    const result = svc.unfollow(req.user.id, username);
    res.status(200).json({ message: 'Unfollowed', ...result });
  } catch (e) { next(e); }
}

function followers(req, res, next) {
  try {
    const { username } = req.params;
    res.json(svc.followersOfUsername(username));
  } catch (e) { next(e); }
}

function following(req, res, next) {
  try {
    const { username } = req.params;
    res.json(svc.followingOfUsername(username));
  } catch (e) { next(e); }
}

module.exports = { follow, unfollow, followers, following };