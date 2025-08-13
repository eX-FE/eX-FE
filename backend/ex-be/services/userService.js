const userStore = require('../models/User');

function getOwnProfile(userId) {
  return userStore.findById(userId);
}

function getProfileByUsername(username) {
  return userStore.findByUsername(username);
}

function updateOwnProfile(userId, changes) {
  return userStore.updateProfile(userId, changes);
}

function deleteOwnProfile(userId) {
  const ok = userStore.deleteById(userId);
  if (!ok) throw new Error('User not found');
  return { deleted: true };
}

module.exports = {
  getOwnProfile,
  getProfileByUsername,
  updateOwnProfile,
  deleteOwnProfile
};