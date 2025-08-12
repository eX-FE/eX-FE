require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middleware/rateLimit');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5050;

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

// Fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use(require('./middleware/errorHandler'));

app.listen(PORT, () => {
  console.log(`🟢 Backend API running at http://localhost:${PORT}`);
});
