class FollowStore {
  constructor() {
    this.followers = new Map(); // userId -> Set(followerId)
    this.following = new Map(); // userId -> Set(followeeId)
  }

  ensure(map, key) { if (!map.has(key)) map.set(key, new Set()); return map.get(key); }

  add(followerId, followeeId) {
    const followingSet = this.ensure(this.following, followerId);
    const followersSet = this.ensure(this.followers, followeeId);
    if (followingSet.has(followeeId)) return false;
    followingSet.add(followeeId);
    followersSet.add(followerId);
    return true;
  }

  remove(followerId, followeeId) {
    const followingSet = this.ensure(this.following, followerId);
    const followersSet = this.ensure(this.followers, followeeId);
    if (!followingSet.has(followeeId)) return false;
    followingSet.delete(followeeId);
    followersSet.delete(followerId);
    return true;
  }

  isFollowing(followerId, followeeId) {
    const set = this.following.get(followerId);
    return set ? set.has(followeeId) : false;
  }

  followersOf(userId) { return Array.from(this.followers.get(userId) || []); }
  followingOf(userId) { return Array.from(this.following.get(userId) || []); }
}
module.exports = new FollowStore();