const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

class UserStore {
  constructor() {
    this.users = []; // In-memory (replace with DB later)
  }

  async create({ email, password, username }) {
    const existing = this.users.find(u => u.email === email);
    if (existing) throw new Error('Email already registered');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: uuid(),
      email,
      username,
      passwordHash,
      verified: false,
      createdAt: new Date()
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

  findByEmail(email) {
    const user = this.users.find(u => u.email === email);
    return user;
  }

  markVerified(email) {
    const user = this.users.find(u => u.email === email);
    if (user) user.verified = true;
  }

  safe(user) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

module.exports = new UserStore();