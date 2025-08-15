const { v4: uuid } = require('uuid');

class NotificationStore {
  constructor() {
    this.notifications = []; // In-memory
  }

  add({ type, actorUserId, targetUserId, entityId = null, entityType = null, message }) {
    const n = {
      id: uuid(),
      type,               // FOLLOW | LIKE | REPLY | etc.
      actorUserId,
      targetUserId,
      entityId,
      entityType,
      message,
      read: false,
      createdAt: new Date()
    };
    this.notifications.push(n);
    return n;
  }

  listForUser(userId, { limit = 50 } = {}) {
    return this.notifications
      .filter(n => n.targetUserId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  markRead(id, userId) {
    const n = this.notifications.find(n => n.id === id && n.targetUserId === userId);
    if (!n) return null;
    n.read = true;
    return n;
  }

  markAllRead(userId) {
    let count = 0;
    this.notifications.forEach(n => {
      if (n.targetUserId === userId && !n.read) {
        n.read = true;
        count++;
      }
    });
    return count;
  }
}

module.exports = new NotificationStore();