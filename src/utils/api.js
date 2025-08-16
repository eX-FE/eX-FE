const BACKEND_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'http://localhost:8080/apiman-gateway/default/tweets-api/1.0';

export async function fetchTweets() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const res = await fetch(`${API_BASE_URL}/tweets`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  return res.json();
}

export async function registerUser(payload) {
  const res = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data; // { user, message }
}

export async function loginUser(payload) {
  const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data; // { user, accessToken }
}

export async function loginWithGoogleIdToken(idToken) {
  const res = await fetch(`${BACKEND_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Google login failed');
  return data; // { user, accessToken }
}

export async function fetchMe() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${BACKEND_BASE_URL}/auth/me`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Unauthorized');
  return data; // { user }
}

export async function logoutUser() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  await fetch(`${BACKEND_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({}),
  });
}

export async function updateProfile(payload) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${BACKEND_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Update failed');
  return data; // { profile }
}

export async function uploadAvatar(file) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const form = new FormData();
  form.append('file', file);
  // Try preferred route first, then fallback
  const endpoints = ['/uploads/avatar', '/upload/avatar'];
  let lastError = null;
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}${ep}`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed at ${ep}`);
      const url = data.url?.startsWith('http') ? data.url : `${BACKEND_BASE_URL}${data.url}`;
      return { url };
    } catch (e) {
      lastError = e;
      // try next endpoint
    }
  }
  throw lastError || new Error('Avatar upload failed');
}

export async function searchUsers(query, opts = {}) {
  const { signal } = opts || {};
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const q = (query || '').trim();
  if (!q) return { users: [] };

  // Preferred: backend search endpoint (if available)
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/users/search?q=${encodeURIComponent(q)}`, {
      method: 'GET',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      signal,
    });
    if (res.status === 429) return { users: [] };
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      const rawUsers = Array.isArray(data.users) ? data.users : [];
      const users = rawUsers.map((p) => ({
        id: p.id,
        name: p.displayName || p.name || p.username,
        username: p.username,
        avatarUrl: p.avatarUrl || '',
        bio: p.bio || '',
        followers: p.stats?.followers ?? p.followers ?? 0,
        following: p.stats?.following ?? p.following ?? 0,
      }));
      return { users };
    }
  } catch (e) {
    if (e?.name === 'AbortError') return { users: [] };
  }

  // Fallback: exact username lookup
  const res = await fetch(`${BACKEND_BASE_URL}/users/${encodeURIComponent(q)}`, {
    method: 'GET',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    signal,
  });
  if (res.status === 429) return { users: [] };
  if (res.status === 404) return { users: [] };
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Search failed');
  const p = data.profile || {};
  const user = {
    id: p.id,
    name: p.displayName || p.username,
    username: p.username,
    avatarUrl: p.avatarUrl || '',
    bio: p.bio || '',
    followers: p.stats?.followers ?? 0,
    following: p.stats?.following ?? 0,
  };
  return { users: [user] };
}

export async function uploadBanner(file) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const form = new FormData();
  form.append('file', file);
  const endpoints = ['/uploads/banner', '/upload/banner'];
  let lastError = null;
  for (const ep of endpoints) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}${ep}`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed at ${ep}`);
      const url = data.url?.startsWith('http') ? data.url : `${BACKEND_BASE_URL}${data.url}`;
      return { url };
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError || new Error('Banner upload failed');
}

// Follow/unfollow helpers (backend supports these)
export async function followUser(username) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${BACKEND_BASE_URL}/follows/${encodeURIComponent(username)}`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    const err = new Error(data.error || 'Please log in again');
    err.code = 'AUTH';
    throw err;
  }
  if (!res.ok) throw new Error(data.error || data.message || 'Follow failed');
  return data;
}

export async function unfollowUser(username) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${BACKEND_BASE_URL}/follows/${encodeURIComponent(username)}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    const err = new Error(data.error || 'Please log in again');
    err.code = 'AUTH';
    throw err;
  }
  if (!res.ok) throw new Error(data.error || data.message || 'Unfollow failed');
  return data;
}

export async function getFollowers(username) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${BACKEND_BASE_URL}/follows/${encodeURIComponent(username)}/followers`, {
    method: 'GET',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load followers');
  // data shape: { count, users: [...] }
  return data;
}

export async function getFollowing(username) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${BACKEND_BASE_URL}/follows/${encodeURIComponent(username)}/following`, {
    method: 'GET',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to load following');
  return data;
}

export async function getNotifications() {
	const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
	if (!token) return { notifications: [] };
	try {
		const res = await fetch(`${BACKEND_BASE_URL}/notifications`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` }
		});
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			throw new Error(data.error || 'Failed to load notifications');
		}
		const data = await res.json().catch(() => ({}));
		return { notifications: Array.isArray(data.notifications) ? data.notifications : [] };
	} catch {
		return { notifications: [] };
	}
}
