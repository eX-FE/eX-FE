'use client';

import { useState, useEffect } from 'react';
import { fetchTweets, checkBackendHealth, login } from '../utils/api';

interface BackendTweet {
  id: number;
  user: string;
  text: string;
}

export default function IntegrationTest() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [tweets, setTweets] = useState<BackendTweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginResult, setLoginResult] = useState<any>(null);

  const testBackendHealth = async () => {
    try {
      setLoading(true);
      const health = await checkBackendHealth();
      setHealthStatus(health);
      setError(null);
    } catch (err) {
      setError('Failed to connect to backend');
      setHealthStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const testFetchTweets = async () => {
    try {
      setLoading(true);
      const tweetsData = await fetchTweets();
      setTweets(tweetsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tweets from backend');
      setTweets([]);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      setLoading(true);
      const result = await login('demo@example.com', 'password123');
      setLoginResult(result);
      setError(null);
    } catch (err) {
      setError('Login test failed: ' + (err instanceof Error ? err.message : String(err)));
      setLoginResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBackendHealth();
  }, []);

  return (
    <div style={{ padding: '20px', border: '2px solid #1da1f2', borderRadius: '8px', margin: '20px' }}>
      <h2>🔗 Frontend-Backend Integration Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Backend Health Check:</h3>
        <button onClick={testBackendHealth} disabled={loading}>
          {loading ? 'Testing...' : 'Test Health'}
        </button>
        {healthStatus && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            ✅ Backend Status: {JSON.stringify(healthStatus)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Fetch Tweets from Backend:</h3>
        <button onClick={testFetchTweets} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Tweets'}
        </button>
        {tweets.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <strong>✅ Tweets from Backend:</strong>
            <ul>
              {tweets.map((tweet) => (
                <li key={tweet.id} style={{ margin: '5px 0' }}>
                  <strong>{tweet.user}:</strong> {tweet.text}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Login API:</h3>
        <button onClick={testLogin} disabled={loading}>
          {loading ? 'Testing Login...' : 'Test Login (demo@example.com)'}
        </button>
        {loginResult && (
          <div style={{ color: 'green', marginTop: '10px' }}>
            ✅ Login Success! 
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              User: {loginResult.user?.email}<br/>
              Token: {loginResult.accessToken ? 'Received' : 'Missing'}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          ❌ Error: {error}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Integration Status:</strong>
        <br />
        • Frontend: Running on http://localhost:3000
        <br />
        • Backend: Running on http://localhost:5000
        <br />
        • Database: Running on http://localhost:5432
        <br />
        • pgAdmin: Running on http://localhost:8080
      </div>
    </div>
  );
}
