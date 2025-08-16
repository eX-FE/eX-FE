'use client';

import Layout from '../../components/Layout';
import PushNotificationClient from '../../components/PushNotificationClient';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

export default function MorePage() {
  const userContext = useContext(UserContext) as any;
  const user = userContext?.user;

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: 'var(--foreground)',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '16px'
          }}>
            More
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Push Notifications Section */}
            {user && (
              <PushNotificationClient userId={user.id?.toString()} />
            )}

            <a href="/login" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--foreground)',
              transition: 'background-color 0.2s',
              border: '1px solid var(--border)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '16px' }}>
                <path d="M7 4V2a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2v10a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V10h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H7z"/>
              </svg>
              <span>Sign In</span>
            </a>

            <a href="/signup" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--foreground)',
              transition: 'background-color 0.2s',
              border: '1px solid var(--border)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '16px' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              <span>Create Account</span>
            </a>

            <div style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--hover)'
            }}>
              <h3 style={{ 
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--foreground)',
                marginBottom: '8px'
              }}>
                Settings & Support
              </h3>
              <p style={{ 
                color: 'var(--secondary)',
                fontSize: '0.9rem',
                margin: 0
              }}>
                More options and settings will be available here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
