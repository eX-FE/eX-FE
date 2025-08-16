class PushNotificationService {
  constructor() {
    this.vapidKeys = {
      publicKey: process.env.VAPID_PUBLIC_KEY || 'BKxNxQ5JGK5YfHfHfHfHfHfHfHfHfHfHfHfHfHfHfHfHfHfHfHfHfH',
      privateKey: process.env.VAPID_PRIVATE_KEY || 'your-private-key'
    };
    this.subscriptions = new Map(); // userId -> subscription
  }

  // Subscribe user to push notifications
  subscribe(userId, subscription) {
    this.subscriptions.set(userId, subscription);
    console.log(`User ${userId} subscribed to push notifications`);
    return { success: true };
  }

  // Unsubscribe user from push notifications
  unsubscribe(userId) {
    const existed = this.subscriptions.delete(userId);
    console.log(`User ${userId} ${existed ? 'unsubscribed from' : 'was not subscribed to'} push notifications`);
    return { success: true };
  }

  // Send push notification to user
  async sendToUser(userId, notification) {
    const subscription = this.subscriptions.get(userId);
    if (!subscription) {
      console.log(`No push subscription found for user ${userId}`);
      return false;
    }

    try {
      // In a real app, you'd use web-push library here
      console.log(`Sending push notification to user ${userId}:`, notification);
      
      // Simulate sending push notification
      const payload = JSON.stringify({
        title: notification.title,
        body: notification.body,
        icon: notification.icon || '/x-logo-white.png',
        badge: '/x-logo.svg',
        data: notification.data || {},
        actions: notification.actions || []
      });

      // Here you would use webpush.sendNotification(subscription, payload)
      console.log('Push notification sent successfully');
      return true;
    } catch (error) {
      console.error('Failed to send push notification:', error);
      
      // Remove invalid subscription
      if (error.statusCode === 410) {
        this.subscriptions.delete(userId);
      }
      
      return false;
    }
  }

  // Send push notification to multiple users
  async sendToUsers(userIds, notification) {
    const results = await Promise.allSettled(
      userIds.map(userId => this.sendToUser(userId, notification))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`Push notification sent to ${successful}/${userIds.length} users`);
    
    return { successful, total: userIds.length };
  }

  // Send notification for new follower
  async notifyNewFollower(targetUserId, followerUser) {
    return this.sendToUser(targetUserId, {
      title: 'New Follower',
      body: `${followerUser.displayName || followerUser.username} started following you`,
      icon: followerUser.avatarUrl || '/x-logo-white.png',
      data: {
        type: 'new_follower',
        userId: followerUser.id,
        username: followerUser.username
      },
      actions: [
        {
          action: 'view_profile',
          title: 'View Profile'
        }
      ]
    });
  }

  // Send notification for new like
  async notifyTweetLike(tweetAuthorId, likerUser, tweetContent) {
    if (!tweetContent) return false;
    
    const truncatedContent = tweetContent.length > 50 
      ? tweetContent.substring(0, 50) + '...' 
      : tweetContent;
    
    return this.sendToUser(tweetAuthorId, {
      title: 'Your tweet was liked',
      body: `${likerUser.displayName || likerUser.username} liked: "${truncatedContent}"`,
      icon: likerUser.avatarUrl || '/x-logo-white.png',
      data: {
        type: 'tweet_like',
        userId: likerUser.id,
        username: likerUser.username
      }
    });
  }

  // Send notification for new reply
  async notifyTweetReply(tweetAuthorId, replierUser, replyContent) {
    const truncatedContent = replyContent.length > 50 
      ? replyContent.substring(0, 50) + '...' 
      : replyContent;
    
    return this.sendToUser(tweetAuthorId, {
      title: 'New reply to your tweet',
      body: `${replierUser.displayName || replierUser.username} replied: "${truncatedContent}"`,
      icon: replierUser.avatarUrl || '/x-logo-white.png',
      data: {
        type: 'tweet_reply',
        userId: replierUser.id,
        username: replierUser.username
      }
    });
  }

  // Send notification for mention
  async notifyMention(mentionedUserId, mentionerUser, tweetContent) {
    const truncatedContent = tweetContent.length > 50 
      ? tweetContent.substring(0, 50) + '...' 
      : tweetContent;
    
    return this.sendToUser(mentionedUserId, {
      title: 'You were mentioned',
      body: `${mentionerUser.displayName || mentionerUser.username} mentioned you: "${truncatedContent}"`,
      icon: mentionerUser.avatarUrl || '/x-logo-white.png',
      data: {
        type: 'mention',
        userId: mentionerUser.id,
        username: mentionerUser.username
      }
    });
  }

  // Get subscription status for user
  getSubscriptionStatus(userId) {
    return {
      subscribed: this.subscriptions.has(userId),
      subscription: this.subscriptions.get(userId) || null
    };
  }

  // Get all subscriptions (for admin)
  getAllSubscriptions() {
    return Array.from(this.subscriptions.entries()).map(([userId, subscription]) => ({
      userId,
      endpoint: subscription.endpoint,
      subscribed: true
    }));
  }

  // Get VAPID public key for client
  getVapidPublicKey() {
    return this.vapidKeys.publicKey;
  }
}

module.exports = new PushNotificationService();
