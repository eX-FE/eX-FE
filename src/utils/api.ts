const API_BASE_URL = 'http://localhost:5000';

export async function fetchTweets() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/api/tweets`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    return data.tweets || [];
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
}

export async function createTweet(content: string, imageUrl?: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) throw new Error('Authentication required');

    const res = await fetch(`${API_BASE_URL}/api/tweets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, imageUrl }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create tweet');
    }

    return data;
  } catch (error) {
    console.error('Error creating tweet:', error);
    throw error;
  }
}

export async function deleteTweet(tweetId: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) throw new Error('Authentication required');

    const res = await fetch(`${API_BASE_URL}/api/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete tweet');
    }

    return data;
  } catch (error) {
    console.error('Error deleting tweet:', error);
    throw error;
  }
}

export async function likeTweet(tweetId: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) throw new Error('Authentication required');

    const res = await fetch(`${API_BASE_URL}/api/tweets/${tweetId}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to like tweet');
    }

    return data;
  } catch (error) {
    console.error('Error liking tweet:', error);
    throw error;
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies for refresh token
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Login failed with status: ${res.status}`);
    }

    const data = await res.json();
    
    // Store access token in localStorage
    if (data.accessToken) {
      localStorage.setItem('access_token', data.accessToken);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function register(email: string, password: string, username?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Registration failed with status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function logout() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    
    // Clear local storage regardless of response
    localStorage.removeItem('access_token');
    
    return res.ok;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage on error
    localStorage.removeItem('access_token');
    throw error;
  }
}

// Additional functions needed by UserContext
export async function fetchMe() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Unauthorized');
    return data; // { user }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function loginUser(payload: { email: string; password: string }) {
  return login(payload.email, payload.password);
}

export async function logoutUser() {
  return logout();
}

export async function registerUser(payload: { email: string; password: string; username?: string; name?: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data; // { user, message }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function updateProfile(payload: any) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json', 
        ...(token ? { Authorization: `Bearer ${token}` } : {}) 
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Update failed');
    return data; // { profile }
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
}

export async function loginWithGoogleIdToken(idToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Google login failed');
    return data; // { user, accessToken }
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

export async function searchUsers(query: string, opts: { signal?: AbortSignal } = {}) {
  try {
    const { signal } = opts || {};
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const q = (query || '').trim();
    if (!q) return { users: [] };

    // Preferred: backend search endpoint
    try {
      const res = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(q)}`, {
        method: 'GET',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        signal,
      });
      if (res.status === 429) return { users: [] };
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const rawUsers = Array.isArray(data.users) ? data.users : [];
        const users = rawUsers.map((p: any) => ({
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
    } catch (e: any) {
      if (e?.name === 'AbortError') return { users: [] };
    }

    // Fallback: exact username lookup
    const res = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(q)}`, {
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
  } catch (error) {
    console.error('Search users error:', error);
    throw error;
  }
}

// Follow/unfollow helpers
export async function followUser(username: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/follows/${encodeURIComponent(username)}`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      const err = new Error(data.error || 'Please log in again') as any;
      err.code = 'AUTH';
      throw err;
    }
    if (!res.ok) throw new Error(data.error || data.message || 'Follow failed');
    return data;
  } catch (error) {
    console.error('Follow user error:', error);
    throw error;
  }
}

export async function unfollowUser(username: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/follows/${encodeURIComponent(username)}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
      const err = new Error(data.error || 'Please log in again') as any;
      err.code = 'AUTH';
      throw err;
    }
    if (!res.ok) throw new Error(data.error || data.message || 'Unfollow failed');
    return data;
  } catch (error) {
    console.error('Unfollow user error:', error);
    throw error;
  }
}

export async function getFollowers(username: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/follows/${encodeURIComponent(username)}/followers`, {
      method: 'GET',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to load followers');
    return data;
  } catch (error) {
    console.error('Get followers error:', error);
    throw error;
  }
}

export async function getFollowing(username: string) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const res = await fetch(`${API_BASE_URL}/follows/${encodeURIComponent(username)}/following`, {
      method: 'GET',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Failed to load following');
    return data;
  } catch (error) {
    console.error('Get following error:', error);
    throw error;
  }
}

export async function getNotifications() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (!token) return { notifications: [] };
  try {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
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

export async function uploadAvatar(file: File) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const form = new FormData();
    form.append('file', file);
    // Try preferred route first, then fallback
    const endpoints = ['/uploads/avatar', '/upload/avatar'];
    let lastError = null;
    for (const ep of endpoints) {
      try {
        const res = await fetch(`${API_BASE_URL}${ep}`, {
          method: 'POST',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: form,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Upload failed at ${ep}`);
        const url = data.url?.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`;
        return { url };
      } catch (e) {
        lastError = e;
        // try next endpoint
      }
    }
    throw lastError || new Error('Avatar upload failed');
  } catch (error) {
    console.error('Upload avatar error:', error);
    throw error;
  }
}

export async function uploadBanner(file: File) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const form = new FormData();
    form.append('file', file);
    // Try preferred route first, then fallback
    const endpoints = ['/uploads/banner', '/upload/banner'];
    let lastError = null;
    for (const ep of endpoints) {
      try {
        const res = await fetch(`${API_BASE_URL}${ep}`, {
          method: 'POST',
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: form,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Upload failed at ${ep}`);
        const url = data.url?.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`;
        return { url };
      } catch (e) {
        lastError = e;
        // try next endpoint
      }
    }
    throw lastError || new Error('Banner upload failed');
  } catch (error) {
    console.error('Upload banner error:', error);
    throw error;
  }
}
