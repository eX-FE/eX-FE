require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimit');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/followRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const hashtagRoutes = require('./routes/hashtagRoutes');
const pushNotificationRoutes = require('./routes/pushNotificationRoutes');
const WebSocketManager = require('./utils/websocket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5050;

// Initialize WebSocket
const wsManager = new WebSocketManager(server);

// Make WebSocket manager available to routes
app.set('wsManager', wsManager);

// Basic CORS (adjust origins as needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // tighten later
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(apiLimiter);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Tweets demo (leave as-is)
app.get('/tweets', (req, res) => {
  res.json([
    { id: 1, user: 'elon', text: 'Building rockets 🚀' },
    { id: 2, user: 'jack', text: 'Decentralized social FTW' },
  ]);
});

// Auth routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes); // mount users routes
app.use('/follows', followRoutes);
app.use('/notifications', notificationRoutes);
app.use('/hashtags', hashtagRoutes);
app.use('/push', pushNotificationRoutes);

// Tweet routes  
app.use('/api/tweets', tweetRoutes);
console.log('✅ Tweet routes mounted at /api/tweets');

// WebSocket stats endpoint
app.get('/ws/stats', (req, res) => {
  const stats = wsManager.getStats();
  res.json(stats);
});

// Fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use(require('./middleware/errorHandler'));

server.listen(PORT, () => {
  console.log(`🟢 Backend API running at http://localhost:${PORT}`);
  console.log(`🔗 WebSocket server available at ws://localhost:${PORT}/ws`);
});