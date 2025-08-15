'use client';

import { useUser } from '../../context/UserContext';

export default function DebugPage() {
  const { user, isLoading, error, clearAuthState } = useUser();

  const getTokenInfo = () => {
    if (typeof window === 'undefined') return 'Server side';
    const token = localStorage.getItem('access_token');
    return token ? `Token exists (${token.slice(0, 20)}...)` : 'No token';
  };

  const clearToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    clearAuthState();
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Authentication State</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>UserContext State:</h3>
        <div>Loading: {isLoading ? 'true' : 'false'}</div>
        <div>User: {user ? JSON.stringify(user, null, 2) : 'null'}</div>
        <div>Error: {error || 'none'}</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>LocalStorage:</h3>
        <div>Token: {getTokenInfo()}</div>
      </div>

      <button 
        onClick={clearToken}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Clear All Auth Data & Reload
      </button>
    </div>
  );
} 