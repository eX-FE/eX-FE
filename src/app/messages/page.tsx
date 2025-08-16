'use client';

import Layout from '../../components/Layout';

export default function MessagesPage() {
  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          paddingTop: '100px'
        }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: 'var(--foreground)'
          }}>
            Messages
          </h1>
          <p style={{ 
            fontSize: '1.1rem',
            color: 'var(--secondary)',
            marginBottom: '24px'
          }}>
            Send a message to start a conversation
          </p>
          <div style={{
            background: 'var(--hover)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--secondary)" style={{ opacity: 0.5 }}>
                <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"/>
              </svg>
            </div>
            <h3 style={{ 
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--foreground)',
              marginBottom: '8px'
            }}>
              Welcome to your inbox!
            </h3>
            <p style={{ 
              color: 'var(--secondary)',
              fontSize: '0.95rem'
            }}>
              Drop a line, share posts and more with private conversations between you and others on X.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
