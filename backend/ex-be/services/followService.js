const userStore = require('../models/User');
const followStore = require('../models/Follow');
const notificationService = require('./notificationService');

function requireUserByUsername(username) {
  const u = userStore.findRawByUsername ? userStore.findRawByUsername(username) : null;
  if (!u) throw new Error('Profile not found');
  return u;
}

function follow(actorUserId, targetUsername) {
  const actor = userStore.findRawById(actorUserId);
  if (!actor) throw new Error('User not found');
  const target = requireUserByUsername(targetUsername);
  if (actor.id === target.id) throw new Error('Cannot follow yourself');

  const added = followStore.add(actor.id, target.id);
  if (added) {
    actor.stats.following += 1;
    target.stats.followers += 1;
    notificationService.createFollowNotification({
      actorUserId: actor.id,
      targetUserId: target.id
    });
  }
  return { following: followStore.isFollowing(actor.id, target.id), actor: userStore.safe(actor), target: userStore.safe(target) };
}

function unfollow(actorUserId, targetUsername) {
  const actor = userStore.findRawById(actorUserId);
  if (!actor) throw new Error('User not found');
  const target = requireUserByUsername(targetUsername);
  if (actor.id === target.id) throw new Error('Cannot unfollow yourself');

  const removed = followStore.remove(actor.id, target.id);
  if (removed) {
    actor.stats.following = Math.max(0, actor.stats.following - 1);
    target.stats.followers = Math.max(0, target.stats.followers - 1);
  }
  return { following: followStore.isFollowing(actor.id, target.id), actor: userStore.safe(actor), target: userStore.safe(target) };
}

function followersOfUsername(username) {
  const user = requireUserByUsername(username);
  const ids = followStore.followersOf(user.id);
  return { count: ids.length, users: ids.map(id => userStore.findById(id)).filter(Boolean) };
}

function followingOfUsername(username) {
  const user = requireUserByUsername(username);
  const ids = followStore.followingOf(user.id);
  return { count: ids.length, users: ids.map(id => userStore.findById(id)).filter(Boolean) };
}

module.exports = { follow, unfollow, followersOfUsername, followingOfUsername };