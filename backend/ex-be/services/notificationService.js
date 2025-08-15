const userStore = require('../models/User');
const notificationStore = require('../models/Notification');

function createFollowNotification({ actorUserId, targetUserId }) {
  if (actorUserId === targetUserId) return null;
  const actor = userStore.findById(actorUserId);
  const target = userStore.findById(targetUserId);
  if (!actor || !target) return null;
  return notificationStore.add({
    type: 'FOLLOW',
    actorUserId,
    targetUserId,
    message: `${actor.username} followed you`
  });
}

// Placeholders for future like/reply triggers
function createLikeNotification({ actorUserId, targetUserId, entityId }) {
  if (actorUserId === targetUserId) return null;
  const actor = userStore.findById(actorUserId);
  if (!actor) return null;
  return notificationStore.add({
    type: 'LIKE',
    actorUserId,
    targetUserId,
    entityId,
    entityType: 'TWEET',
    message: `${actor.username} liked your tweet`
  });
}

function createReplyNotification({ actorUserId, targetUserId, entityId }) {
  if (actorUserId === targetUserId) return null;
  const actor = userStore.findById(actorUserId);
  if (!actor) return null;
  return notificationStore.add({
    type: 'REPLY',
    actorUserId,
    targetUserId,
    entityId,
    entityType: 'TWEET',
    message: `${actor.username} replied to your tweet`
  });
}

function listUserNotifications(userId, opts) {
  return notificationStore.listForUser(userId, opts).map(n => decorate(n));
}

function markNotificationRead(userId, id) {
  const n = notificationStore.markRead(id, userId);
  return n ? decorate(n) : null;
}

function markAllRead(userId) {
  return notificationStore.markAllRead(userId);
}

function decorate(n) {
  const actor = userStore.findById(n.actorUserId);
  return {
    ...n,
    actor: actor ? { id: actor.id, username: actor.username, avatarUrl: actor.avatarUrl } : null
  };
}

module.exports = {
  createFollowNotification,
  createLikeNotification,
  createReplyNotification,
  listUserNotifications,
  markNotificationRead,
  markAllRead
};