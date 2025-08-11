const API_BASE_URL = 'http://localhost:8080/apiman-gateway/default/tweets-api/1.0';

export async function fetchTweets() {
  const token = localStorage.getItem('access_token');

  const res = await fetch(`${API_BASE_URL}/tweets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    // TODO: add refresh logic here later
    throw new Error('Unauthorized');
  }

  return res.json();
}
