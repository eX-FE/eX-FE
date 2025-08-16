"use client";

import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { getNotifications } from '../../utils/api';

export default function NotificationsPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [isLoading, user, router]);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      try {
        const res = await getNotifications();
        setItems(res.notifications || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (isLoading || !user) return null;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Notifications</h1>

      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#536471' }}>No notifications yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((n) => (
            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#cfd9de', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {n.actor?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.actor.avatarUrl} alt={n.actor.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#888">
                    <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
                  </svg>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontWeight: 700 }}>{n.actor?.username || 'User'}</span>
                <span style={{ marginLeft: 6 }}>{n.type === 'FOLLOW' ? 'Followed you' : n.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 