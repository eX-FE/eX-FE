"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';
import { getFollowers, getFollowing } from '../utils/api';

export default function FollowConnections({ type }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [data, setData] = useState({ count: 0, users: [] });
  const [loading, setLoading] = useState(true);

  const isFollowers = type === 'followers';

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const res = isFollowers ? await getFollowers(user.username) : await getFollowing(user.username);
        setData(res);
      } catch {
        setData({ count: 0, users: [] });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, isFollowers]);

  if (isLoading || !user) return null;

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
      ) : isFollowers && data.users.length === 0 ? (
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, margin: '8px 0' }}>Looking for followers?</h2>
          <p style={{ color: '#536471', fontSize: 15, maxWidth: 520 }}>
            When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.users.map((u) => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #eff3f4' }}>
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
              <button style={{ borderRadius: 9999, border: '1px solid #cfd9de', padding: '6px 12px', background: '#fff', fontWeight: 700 }}>
                {isFollowers ? 'Follow' : 'Following'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 