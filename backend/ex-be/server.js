// server.js
const express = require('express');
const app = express();
const PORT = 5000;

// Parse JSON bodies
app.use(express.json());

// In-memory storage (for demo purposes only)
const users = [];
const tokenToUserId = new Map();
let nextUserId = 1;

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Auth helpers
function generateToken() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function getUserFromAuthHeader(req) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  const userId = tokenToUserId.get(token);
  if (!userId) return null;
  return users.find(u => u.id === userId) || null;
}

// Auth routes
app.post('/auth/register', (req, res) => {
  const { name, username, email, password } = req.body || {};
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
  if (emailExists) return res.status(409).json({ error: 'Email already in use' });
  if (usernameExists) return res.status(409).json({ error: 'Username already in use' });

  const newUser = {
    id: nextUserId++,
    name,
    username,
    email,
    password, // NOTE: Plain text for demo. Do NOT do this in production.
    joinDate: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
    followers: 0,
    following: 0,
    posts: 0,
    avatarUrl: '',
    bannerUrl: '',
  };
  users.push(newUser);

  const token = generateToken();
  tokenToUserId.set(token, newUser.id);

  const { password: _, ...safeUser } = newUser;
  return res.status(201).json({ token, user: safeUser });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!existing) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken();
  tokenToUserId.set(token, existing.id);

  const { password: _, ...safeUser } = existing;
  return res.json({ token, user: safeUser });
});

app.get('/auth/me', (req, res) => {
  const user = getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const { password: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

app.post('/auth/logout', (req, res) => {
  const authHeader = req.header('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) tokenToUserId.delete(token);
  }
  return res.status(204).send();
});

app.get('/tweets', (req, res) => {
  res.json([
    { id: 1, user: 'elon', text: 'Building rockets 🚀' },
    { id: 2, user: 'jack', text: 'Decentralized social FTW' },
  ]);
});

app.listen(PORT, () => {
  console.log(`🟢 Backend API running at http://localhost:${PORT}`);
});
