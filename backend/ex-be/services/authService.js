const userStore = require('../models/User');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefresh
} = require('../utils/token');

const refreshStore = new Map(); // refreshToken -> userId (replace with DB/redis)

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
  refresh,
  logout
};