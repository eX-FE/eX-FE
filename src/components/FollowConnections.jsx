"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { getFollowers, getFollowing, followUser, unfollowUser } from '../utils/api';

export default function FollowConnections({ type }) {
  const { user, isLoading, updateLocalUser } = useUser();
  const router = useRouter();
  const [data, setData] = useState({ count: 0, users: [] });
  const [loading, setLoading] = useState(true);
  const [followingSet, setFollowingSet] = useState(new Set()); // usernames the current user follows

  const isFollowers = type === 'followers';

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  // Clear stale data immediately when switching tabs so the next fetch paints fresh
  useEffect(() => {
    setData({ count: 0, users: [] });
    setLoading(true);
    setFollowingSet(new Set());
  }, [isFollowers]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const res = isFollowers ? await getFollowers(user.username) : await getFollowing(user.username);
        setData(res);
        if (isFollowers) {
          const mine = await getFollowing(user.username);
          const set = new Set((mine.users || []).map(u => (u.username || '').toLowerCase()));
          setFollowingSet(set);
        } else {
          const set = new Set((res.users || []).map(u => (u.username || '').toLowerCase()));
          setFollowingSet(set); // in Following tab, all listed are followed
        }
      } catch {
        setData({ count: 0, users: [] });
        setFollowingSet(new Set());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, isFollowers]);

  if (isLoading || !user) return null;

  async function onToggle(u) {
    const uname = (u.username || '').trim();
    const key = uname.toLowerCase();
    const currentlyFollowing = followingSet.has(key);
    try {
      if (currentlyFollowing) {
        await unfollowUser(uname);
        // update counts locally
        updateLocalUser({ following: Math.max(0, (user.following ?? 1) - 1) });
        // update following set and list
        setFollowingSet(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        if (!isFollowers) {
          // In Following tab, remove the row from the list
          setData(prev => ({ ...prev, users: (prev.users || []).filter(x => (x.username || '').toLowerCase() !== key) }));
        }
      } else {
        await followUser(uname);
        updateLocalUser({ following: (user.following ?? 0) + 1 });
        setFollowingSet(prev => new Set(prev).add(key));
      }
    } catch (e) {
      // No routing changes; keep UI stable on error
      console.error('toggle follow failed:', e);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid #eff3f4', marginBottom: 4 }}>
        <Link href="/followers" style={{
          background: 'transparent', border: 'none', padding: '12px 0', fontWeight: 700,
          color: isFollowers ? '#0f1419' : '#536471', textDecoration: 'none', position: 'relative'
        }}>
          Followers
          {isFollowers && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, background: '#1d9bf0', borderRadius: 2 }} />}
        </Link>
        <Link href="/following" style={{
          background: 'transparent', border: 'none', padding: '12px 0', fontWeight: 700,
          color: !isFollowers ? '#0f1419' : '#536471', textDecoration: 'none', position: 'relative'
        }}>
          Following
          {!isFollowers && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, background: '#1d9bf0', borderRadius: 2 }} />}
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: 24 }}>Loading…</div>
      ) : data.users.length === 0 ? (
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, margin: '8px 0' }}>{isFollowers ? 'Looking for followers?' : 'Who you follow will appear here'}</h2>
          <p style={{ color: '#536471', fontSize: 15, maxWidth: 520 }}>
            {isFollowers
              ? 'When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.'
              : 'When you follow accounts, they’ll show up here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.users.map((u) => {
            const uname = (u.username || '').toLowerCase();
            const isFollowingRow = isFollowers ? followingSet.has(uname) : true;
            return (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', background: '#cfd9de', flexShrink: 0 }}>
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.avatarUrl} alt={u.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : null}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{u.displayName || u.name || u.username}</div>
                  <div style={{ color: '#536471' }}>@{u.username}</div>
                  {u.bio && <div style={{ color: '#536471', marginTop: 4, fontSize: 14, lineHeight: '18px' }}>{u.bio}</div>}
                </div>
                <button type="button" onClick={() => onToggle(u)} style={{ borderRadius: 9999, border: '1px solid #cfd9de', padding: '6px 12px', background: '#fff', fontWeight: 700, color: '#0f1419', cursor: 'pointer' }}>
                  {isFollowingRow ? 'Following' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 