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

function searchUsers(query, limit = 10) {
  const q = (query || '').toString().trim().toLowerCase();
  if (!q) return [];
  // userStore exposes only methods for exact lookup and safe snapshot,
  // so we access its internal list through findById over an index approach.
  // Instead, we derive from safe snapshots of all users via a helper.
  const all = userStore.users || []; // falls back to internal array if exposed
  const list = Array.isArray(all) ? all : [];
  const matches = list.filter((u) => {
    const name = (u.displayName || '').toLowerCase();
    const username = (u.username || '').toLowerCase();
    return name.includes(q) || username.includes(q);
  }).slice(0, limit);
  return matches.map((u) => userStore.safe(u));
}

module.exports = {
  getOwnProfile,
  getProfileByUsername,
  updateOwnProfile,
  deleteOwnProfile,
  searchUsers
};