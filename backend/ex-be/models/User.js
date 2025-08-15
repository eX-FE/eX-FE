const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

class UserStore {
  constructor() {
    this.users = []; // In-memory (replace with DB later)
  }

  async create({ email, password, username }) {
    const existing = this.users.find(u => u.email === email || u.username === username);
    if (existing) throw new Error('Email or username already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: uuid(),
      email,
      username,
      passwordHash,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Profile fields
      displayName: username,
      bio: '',
      location: '',
      website: '',
      avatarUrl: '',
      bannerUrl: '',
      stats: {
        followers: 0,
        following: 0,
        tweets: 0
      }
    };
    this.users.push(user);
    return this.safe(user);
  }

  async verifyPassword(email, password) {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  findById(id) {
    const user = this.users.find(u => u.id === id);
    return user ? this.safe(user) : null;
  }

  findByUsername(username) {
    const user = this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    return user ? this.safe(user) : null;
  }

  findRawById(id) {
    return this.users.find(u => u.id === id);
  }

  findRawByUsername(username) {
    return this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  findByEmail(email) {
    const user = this.users.find(u => u.email === email);
    return user;
  }

  markVerified(email) {
    const user = this.users.find(u => u.email === email);
    if (user) user.verified = true;
  }

  updateProfile(userId, changes) {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    const allowed = ['displayName', 'bio', 'location', 'website', 'avatarUrl', 'bannerUrl'];
    allowed.forEach(f => {
      if (f in changes && changes[f] != null) user[f] = String(changes[f]).trim();
    });
    user.updatedAt = new Date();
    return this.safe(user);
  }

  deleteById(userId) {
    const idx = this.users.findIndex(u => u.id === userId);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }

  safe(user) {
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

module.exports = new UserStore();