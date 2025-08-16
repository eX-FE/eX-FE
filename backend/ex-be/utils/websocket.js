const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      path: '/ws'
    });
    
    this.clients = new Map(); // userId -> Set of websockets
    
    this.wss.on('connection', this.handleConnection.bind(this));
    console.log('🔗 WebSocket server initialized');
  }

  handleConnection(ws, request) {
    console.log('New WebSocket connection');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        this.handleMessage(ws, data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      this.removeClient(ws);
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.removeClient(ws);
    });
  }

  handleMessage(ws, data) {
    switch (data.type) {
      case 'auth':
        this.authenticateClient(ws, data.token);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong' }));
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  authenticateClient(ws, token) {
    try {
      if (!token) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'No token provided' }));
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.sub;
      
      ws.userId = userId;
      
      if (!this.clients.has(userId)) {
        this.clients.set(userId, new Set());
      }
      this.clients.get(userId).add(ws);
      
      ws.send(JSON.stringify({ 
        type: 'auth_success', 
        message: 'Authenticated successfully' 
      }));
      
      console.log(`User ${userId} authenticated via WebSocket`);
    } catch (error) {
      console.error('WebSocket auth error:', error);
      ws.send(JSON.stringify({ 
        type: 'auth_error', 
        message: 'Invalid token' 
      }));
    }
  }

  removeClient(ws) {
    if (ws.userId && this.clients.has(ws.userId)) {
      this.clients.get(ws.userId).delete(ws);
      if (this.clients.get(ws.userId).size === 0) {
        this.clients.delete(ws.userId);
      }
    }
  }

  // Broadcast to all connected clients
  broadcast(message) {
    const payload = JSON.stringify(message);
    this.clients.forEach((sockets) => {
      sockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    });
  }

  // Send to specific user
  sendToUser(userId, message) {
    const userSockets = this.clients.get(userId);
    if (userSockets) {
      const payload = JSON.stringify(message);
      userSockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    }
  }

  // Send to multiple users
  sendToUsers(userIds, message) {
    userIds.forEach(userId => {
      this.sendToUser(userId, message);
    });
  }

  // Notify about new tweet
  notifyNewTweet(tweet, authorUser) {
    this.broadcast({
      type: 'new_tweet',
      data: {
        tweet,
        author: {
          id: authorUser.id,
          username: authorUser.username,
          displayName: authorUser.displayName,
          avatarUrl: authorUser.avatarUrl,
          verified: authorUser.verified
        }
      }
    });
  }

  // Notify about new like
  notifyTweetLike(tweetId, userId, liked) {
    this.broadcast({
      type: 'tweet_like',
      data: {
        tweetId,
        userId,
        liked
      }
    });
  }

  // Notify about new retweet
  notifyTweetRetweet(tweetId, userId, retweeted) {
    this.broadcast({
      type: 'tweet_retweet',
      data: {
        tweetId,
        userId,
        retweeted
      }
    });
  }

  // Notify about new reply
  notifyNewReply(reply, authorUser) {
    this.broadcast({
      type: 'new_reply',
      data: {
        reply,
        author: {
          id: authorUser.id,
          username: authorUser.username,
          displayName: authorUser.displayName,
          avatarUrl: authorUser.avatarUrl,
          verified: authorUser.verified
        }
      }
    });
  }

  // Notify about new follow
  notifyNewFollow(followerId, followingId, followerUser) {
    this.sendToUser(followingId, {
      type: 'new_follower',
      data: {
        follower: {
          id: followerUser.id,
          username: followerUser.username,
          displayName: followerUser.displayName,
          avatarUrl: followerUser.avatarUrl,
          verified: followerUser.verified
        }
      }
    });
  }

  // Notify about poll vote
  notifyPollVote(tweetId, pollData) {
    this.broadcast({
      type: 'poll_vote',
      data: {
        tweetId,
        poll: pollData
      }
    });
  }

  // Get connection stats
  getStats() {
    let totalConnections = 0;
    this.clients.forEach((sockets) => {
      totalConnections += sockets.size;
    });
    
    return {
      connectedUsers: this.clients.size,
      totalConnections,
      activeConnections: Array.from(this.clients.entries()).map(([userId, sockets]) => ({
        userId,
        connections: sockets.size
      }))
    };
  }
}

module.exports = WebSocketManager;
