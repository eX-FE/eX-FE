'use client';

import { useEffect, useState } from 'react';
import { fetchTweets } from '@/utils/api';

export default function TweetsPage() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTweets()
      .then(data => setTweets(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📝 Tweet Feed</h1>
      {loading && <p>Loading tweets...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {tweets.map((tweet, i) => (
          <li key={i}>
            <strong>{tweet.user}</strong>: {tweet.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
