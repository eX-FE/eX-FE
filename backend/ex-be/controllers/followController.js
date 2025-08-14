const svc = require('../services/followService');

function follow(req, res, next) {
  try {
    const { username } = req.params;
    const result = svc.follow(req.user.id, username);
    res.status(201).json({ message: 'Followed', ...result });
  } catch (e) { next(e); }
}

function unfollow(req, res, next) {
  try {
    const { username } = req.params;
    const result = svc.unfollow(req.user.id, username);
    res.json({ message: 'Unfollowed', ...result });
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