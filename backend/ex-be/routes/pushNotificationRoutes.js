const express = require('express');
const router = express.Router();
const { authRequired } = require('../middleware/auth');
const pushNotificationService = require('../services/pushNotificationService');

// Subscribe to push notifications
router.post('/subscribe', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription data'
      });
    }

    const result = pushNotificationService.subscribe(userId, subscription);
    
    res.json({
      success: true,
      message: 'Successfully subscribed to push notifications',
      data: result
    });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to push notifications'
    });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = pushNotificationService.unsubscribe(userId);
    
    res.json({
      success: true,
      message: 'Successfully unsubscribed from push notifications',
      data: result
    });
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from push notifications'
    });
  }
});

// Get subscription status
router.get('/status', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const status = pushNotificationService.getSubscriptionStatus(userId);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting push notification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get push notification status'
    });
  }
});

// Get VAPID public key
router.get('/vapid-public-key', async (req, res) => {
  try {
    const publicKey = pushNotificationService.getVapidPublicKey();
    
    res.json({
      success: true,
      data: { publicKey }
    });
  } catch (error) {
    console.error('Error getting VAPID public key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get VAPID public key'
    });
  }
});

// Send test notification (for testing purposes)
router.post('/test', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, body } = req.body;
    
    const result = await pushNotificationService.sendToUser(userId, {
      title: title || 'Test Notification',
      body: body || 'This is a test push notification from eX',
      icon: '/x-logo-white.png',
      data: { type: 'test' }
    });
    
    res.json({
      success: result,
      message: result ? 'Test notification sent successfully' : 'Failed to send test notification'
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification'
    });
  }
});

// Admin route: Get all subscriptions
router.get('/admin/subscriptions', authRequired, async (req, res) => {
  try {
    // In a real app, you'd check if user is admin here
    const subscriptions = pushNotificationService.getAllSubscriptions();
    
    res.json({
      success: true,
      data: {
        subscriptions,
        count: subscriptions.length
      }
    });
  } catch (error) {
    console.error('Error getting all subscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscriptions'
    });
  }
});

module.exports = router;
