const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const { email, password, username } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
    const user = await authService.register({ email, password, username: username || email.split('@')[0] });
    return res.status(201).json({ user, message: 'Registered. (Verification email stubbed)' });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login({ email, password });
    // HttpOnly cookie for refresh if desired
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/auth'
    });
    return res.json({ user, accessToken });
  } catch (e) {
    next(e);
  }
}

function me(req, res) {
  res.json({ user: req.user });
}

function refresh(req, res, next) {
  try {
    const rt = req.cookies.refresh_token || req.body.refreshToken;
    if (!rt) return res.status(400).json({ error: 'No refresh token' });
    const { accessToken, user } = authService.refresh(rt);
    res.json({ accessToken, user });
  } catch (e) {
    next(e);
  }
}

function logout(req, res) {
  const rt = req.cookies.refresh_token || req.body.refreshToken;
  authService.logout(rt);
  res.clearCookie('refresh_token', { path: '/auth' });
  res.json({ message: 'Logged out' });
}

// Stubs
function requestPasswordReset(req, res) {
  res.json({ message: 'Password reset email stubbed' });
}

function verifyEmail(req, res) {
  const { email } = req.query;
  // userStore.markVerified(email) would be used with token validation
  res.json({ message: 'Email verification stubbed', email });
}

async function googleLogin(req, res, next) {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: 'Missing idToken' });
    const { user, accessToken, refreshToken } = await authService.loginWithGoogle({ idToken });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/auth'
    });
    return res.json({ user, accessToken });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  register,
  login,
  me,
  refresh,
  logout,
  requestPasswordReset,
  verifyEmail,
  googleLogin
};