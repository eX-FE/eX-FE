const svc = require('../services/notificationService');

function list(req, res) {
  const items = svc.listUserNotifications(req.user.id, { limit: Number(req.query.limit) || 50 });
  res.json({ notifications: items });
}

function markRead(req, res) {
  const n = svc.markNotificationRead(req.user.id, req.params.id);
  if (!n) return res.status(404).json({ error: 'Notification not found' });
  res.json({ notification: n });
}

function markAllRead(req, res) {
  const count = svc.markAllRead(req.user.id);
  res.json({ updated: count });
}

module.exports = { list, markRead, markAllRead };