const BACKEND_BASE_URL = 'http://localhost:5050';
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
  return data; // { token, user }
}

export async function loginUser(payload) {
  const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data; // { token, user }
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
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function loginWithGoogleIdToken(idToken) {
  const res = await fetch(`${BACKEND_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Google login failed');
  return data; // { token, user }
}

export async function updateProfile(payload) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const res = await fetch(`${BACKEND_BASE_URL}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Update failed');
  return data; // { user }
}

export async function uploadAvatar(file) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BACKEND_BASE_URL}/upload/avatar`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Avatar upload failed');
  // Convert relative URL to absolute for Next Image/IMG usage
  const url = data.url?.startsWith('http') ? data.url : `${BACKEND_BASE_URL}${data.url}`;
  return { url };
}

export async function uploadBanner(file) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BACKEND_BASE_URL}/upload/banner`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Banner upload failed');
  const url = data.url?.startsWith('http') ? data.url : `${BACKEND_BASE_URL}${data.url}`;
  return { url };
}
