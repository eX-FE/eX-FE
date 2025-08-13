const userService = require('../services/userService');

function me(req, res) {
  const profile = userService.getOwnProfile(req.user.id);
  res.json({ profile });
}

function getByUsername(req, res, next) {
  try {
    const profile = userService.getProfileByUsername(req.params.username);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ profile });
  } catch (e) {
    next(e);
  }
}

function updateMe(req, res, next) {
  try {
    const profile = userService.updateOwnProfile(req.user.id, req.body || {});
    res.json({ profile, message: 'Profile updated' });
  } catch (e) {
    next(e);
  }
}

function deleteMe(req, res, next) {
  try {
    const result = userService.deleteOwnProfile(req.user.id);
    res.json({ message: 'Profile deleted', ...result });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  me,
  getByUsername,
  updateMe,
  deleteMe
};