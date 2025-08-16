'use client';

import { useState, useEffect } from 'react';

interface PushNotificationClientProps {
  userId?: string;
}

interface NotificationPermission {
  granted: boolean;
  supported: boolean;
  subscribed: boolean;
}

export default function PushNotificationClient({ userId }: PushNotificationClientProps) {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    supported: false,
    subscribed: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkNotificationSupport();
    checkSubscriptionStatus();
  }, [userId]);

  const checkNotificationSupport = () => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    const granted = supported && Notification.permission === 'granted';
    
    setPermission(prev => ({
      ...prev,
      supported,
      granted
    }));
  };

  const checkSubscriptionStatus = async () => {
    if (!userId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/proxy/push/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPermission(prev => ({
          ...prev,
          subscribed: data.data.subscribed
        }));
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!permission.supported) {
      alert('Push notifications are not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      setPermission(prev => ({
        ...prev,
        granted
      }));

      if (granted) {
        await subscribeToPushNotifications();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const subscribeToPushNotifications = async () => {
    if (!userId) {
      console.error('User ID required for push notifications');
      return;
    }

    setLoading(true);
    
    try {
      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Get VAPID public key from server
      const vapidResponse = await fetch('/api/proxy/push/vapid-public-key');
      const vapidData = await vapidResponse.json();
      
      if (!vapidData.success) {
        throw new Error('Failed to get VAPID public key');
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.data.publicKey) as BufferSource
      });

      // Send subscription to server
      const token = localStorage.getItem('token');
      const response = await fetch('/api/proxy/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscription })
      });

      const result = await response.json();
      
      if (result.success) {
        setPermission(prev => ({ ...prev, subscribed: true }));
        console.log('Successfully subscribed to push notifications');
      } else {
        throw new Error(result.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      alert('Failed to enable push notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeFromPushNotifications = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/proxy/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setPermission(prev => ({ ...prev, subscribed: false }));
        console.log('Successfully unsubscribed from push notifications');
      } else {
        throw new Error(result.message || 'Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      alert('Failed to disable push notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/proxy/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test push notification from eX!'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Test notification sent');
      } else {
        alert('Failed to send test notification: ' + result.message);
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Failed to send test notification');
    }
  };

  if (!permission.supported) {
    return (
      <div className="notification-manager">
        <p>⚠️ Push notifications are not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="notification-manager">
      <h3>🔔 Push Notifications</h3>
      
      <div className="notification-status">
        <p>Status: {permission.granted ? '✅ Permitted' : '❌ Not permitted'}</p>
        <p>Subscription: {permission.subscribed ? '✅ Subscribed' : '❌ Not subscribed'}</p>
      </div>

      <div className="notification-controls">
        {!permission.granted ? (
          <button 
            onClick={requestNotificationPermission}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Requesting...' : 'Enable Notifications'}
          </button>
        ) : (
          <div className="controls-row">
            {permission.subscribed ? (
              <button 
                onClick={unsubscribeFromPushNotifications}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading ? 'Unsubscribing...' : 'Disable Notifications'}
              </button>
            ) : (
              <button 
                onClick={subscribeToPushNotifications}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Subscribing...' : 'Subscribe to Notifications'}
              </button>
            )}
            
            {permission.subscribed && (
              <button 
                onClick={sendTestNotification}
                className="btn btn-outline"
              >
                Send Test Notification
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .notification-manager {
          padding: 20px;
          border: 1px solid #e1e8ed;
          border-radius: 8px;
          margin: 20px 0;
          background: #fafafa;
        }
        
        .notification-status {
          margin: 15px 0;
        }
        
        .notification-status p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .notification-controls {
          margin-top: 15px;
        }
        
        .controls-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 8px 16px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-primary {
          background: #1da1f2;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background: #1991db;
        }
        
        .btn-secondary {
          background: #657786;
          color: white;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #5a6b7a;
        }
        
        .btn-outline {
          background: transparent;
          color: #1da1f2;
          border: 1px solid #1da1f2;
        }
        
        .btn-outline:hover:not(:disabled) {
          background: #1da1f2;
          color: white;
        }
      `}</style>
    </div>
  );
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
