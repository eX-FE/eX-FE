// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const PORT = process.env.PORT || 5050;

// Parse JSON bodies
app.use(express.json());

// In-memory storage (for demo purposes only)
const users = [];
let nextUserId = 1;

// JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = '1h';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

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
function signToken(user) {
  return jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function getUserFromAuthHeader(req) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === payload.sub);
    return user || null;
  } catch {
    return null;
  }
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

  const token = signToken(newUser);

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

  const token = signToken(existing);

  const { password: _, ...safeUser } = existing;
  return res.json({ token, user: safeUser });
});

// Google OAuth: exchange Google ID token for our JWT
app.post('/auth/google', async (req, res) => {
  try {
    if (!googleClient || !GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google OAuth not configured on server' });
    }
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: 'Missing idToken' });
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const googleSub = payload.sub;
    const email = payload.email;
    const name = payload.name || email;
    if (!email || !googleSub) return res.status(400).json({ error: 'Invalid Google token' });

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = {
        id: nextUserId++,
        name,
        username: `google-${googleSub.slice(-8)}`,
        email,
        password: '',
        joinDate: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        followers: 0,
        following: 0,
        posts: 0,
        avatarUrl: payload.picture || '',
        bannerUrl: '',
      };
      users.push(user);
    }

    const token = signToken(user);
    const { password: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (err) {
    return res.status(401).json({ error: 'Google token verification failed' });
  }
});

app.get('/auth/me', (req, res) => {
  const user = getUserFromAuthHeader(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const { password: _, ...safeUser } = user;
  return res.json({ user: safeUser });
});

app.post('/auth/logout', (req, res) => {
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
