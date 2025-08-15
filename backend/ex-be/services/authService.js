const userStore = require('../models/User');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefresh
} = require('../utils/token');
const { OAuth2Client } = require('google-auth-library');

const refreshStore = new Map(); // refreshToken -> userId (replace with DB/redis)

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

async function register({ email, password, username }) {
  const user = await userStore.create({ email, password, username });
  // TODO: send verification email
  return user;
}

async function login({ email, password }) {
  const user = await userStore.verifyPassword(email, password);
  if (!user) throw new Error('Invalid credentials');
  const accessToken = signAccessToken({ sub: user.id });
  const refreshToken = signRefreshToken({ sub: user.id });
  refreshStore.set(refreshToken, user.id);
  return { user: userStore.safe(user), accessToken, refreshToken };
}

async function loginWithGoogle({ idToken }) {
  if (!googleClient || !GOOGLE_CLIENT_ID) throw new Error('Google OAuth not configured on server');
  const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const googleSub = payload.sub;
  const email = payload.email;
  const name = payload.name || email;
  if (!email || !googleSub) throw new Error('Invalid Google token');

  let user = userStore.findByEmail(email);
  if (!user) {
    // Create placeholder user with no password; username derived from Google sub
    const baseUsername = `google-${googleSub.slice(-8)}`;
    user = await userStore.create({ email, password: Math.random().toString(36).slice(2), username: baseUsername });
    // Update profile fields available from Google
    const raw = userStore.findRawById(user.id);
    raw.displayName = name;
    raw.avatarUrl = payload.picture || '';
  }

  const accessToken = signAccessToken({ sub: user.id });
  const refreshToken = signRefreshToken({ sub: user.id });
  refreshStore.set(refreshToken, user.id);
  return { user: userStore.safe(user), accessToken, refreshToken };
}

function refresh(refreshToken) {
  if (!refreshStore.has(refreshToken)) throw new Error('Invalid refresh token');
  const decoded = verifyRefresh(refreshToken);
  const user = userStore.findById(decoded.sub);
  if (!user) throw new Error('User not found');
  const accessToken = signAccessToken({ sub: user.id });
  return { accessToken, user };
}

function logout(refreshToken) {
  if (refreshToken) refreshStore.delete(refreshToken);
}

module.exports = {
  register,
  login,
  loginWithGoogle,
  refresh,
  logout
};