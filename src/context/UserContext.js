'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, loginUser, logoutUser, registerUser, updateProfile as apiUpdateProfile, loginWithGoogleIdToken } from '../utils/api';

export const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function normalizeUser(raw) {
    if (!raw) return null;
    // raw could be { user } or { profile } shape from backend services
    const u = raw;
    const created = u.createdAt ? new Date(u.createdAt) : null;
    const joinDate = created
      ? created.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      : undefined;
    return {
      id: u.id,
      email: u.email,
      username: u.username,
      name: u.displayName || u.name || u.username,
      displayName: u.displayName || u.name || u.username,
      bio: u.bio || '',
      location: u.location || '',
      website: u.website || '',
      avatarUrl: u.avatarUrl || '',
      bannerUrl: u.bannerUrl || '',
      followers: u.stats?.followers ?? u.followers ?? 0,
      following: u.stats?.following ?? u.following ?? 0,
      posts: u.stats?.tweets ?? u.posts ?? 0,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      joinDate,
    };
  }

  function getOverrideKey(userId) {
    return `profile_overrides_${userId}`;
  }

  function applyLocalOverrides(normalizedUser) {
    if (!normalizedUser || typeof window === 'undefined') return normalizedUser;
    try {
      const key = getOverrideKey(normalizedUser.id);
      const raw = window.localStorage.getItem(key);
      if (!raw) return normalizedUser;
      const { avatarUrl, bannerUrl } = JSON.parse(raw || '{}');
      return {
        ...normalizedUser,
        avatarUrl: avatarUrl || normalizedUser.avatarUrl,
        bannerUrl: bannerUrl || normalizedUser.bannerUrl,
      };
    } catch {
      return normalizedUser;
    }
  }

  // Load current user from token
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        const data = await fetchMe();
        const normalized = normalizeUser(data.user);
        setUser(applyLocalOverrides(normalized));
      } catch (err) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
        }
        setUser(null);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Listen for local image updates dispatched by EditProfileModal
  useEffect(() => {
    function onLocalImages(e) {
      const { avatarUrl, bannerUrl } = e.detail || {};
      setUser((prev) => {
        if (!prev) return prev;
        try {
          if (typeof window !== 'undefined') {
            const key = getOverrideKey(prev.id);
            const current = JSON.parse(window.localStorage.getItem(key) || '{}');
            const next = { ...current };
            if (avatarUrl) next.avatarUrl = avatarUrl;
            if (bannerUrl) next.bannerUrl = bannerUrl;
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch {}
        return { ...prev, avatarUrl: avatarUrl || prev.avatarUrl, bannerUrl: bannerUrl || prev.bannerUrl };
      });
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('user-profile-local-images', onLocalImages);
      return () => window.removeEventListener('user-profile-local-images', onLocalImages);
    }
  }, []);

  async function handleRegister(payload) {
    setError(null);
    await registerUser(payload);
    const loginRes = await loginUser({ email: payload.email, password: payload.password });
    localStorage.setItem('access_token', loginRes.accessToken);
    const normalized = normalizeUser(loginRes.user);
    setUser(applyLocalOverrides(normalized));
    return applyLocalOverrides(normalized);
  }

  async function handleLogin(payload) {
    setError(null);
    const data = await loginUser(payload);
    localStorage.setItem('access_token', data.accessToken);
    const normalized = normalizeUser(data.user);
    setUser(applyLocalOverrides(normalized));
    return applyLocalOverrides(normalized);
  }

  async function handleGoogleLogin(idToken) {
    setError(null);
    const data = await loginWithGoogleIdToken(idToken);
    localStorage.setItem('access_token', data.accessToken);
    const normalized = normalizeUser(data.user);
    setUser(applyLocalOverrides(normalized));
    return applyLocalOverrides(normalized);
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  }

  async function handleUpdateProfile(partial) {
    setError(null);
    const toSend = { ...partial };
    if (Object.prototype.hasOwnProperty.call(toSend, 'name')) {
      toSend.displayName = toSend.name;
      delete toSend.name;
    }
    const data = await apiUpdateProfile(toSend);
    const normalized = normalizeUser(data.profile);
    setUser(applyLocalOverrides(normalized));
    return applyLocalOverrides(normalized);
  }

  function updateLocalUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function clearAuthState() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    setUser(null);
    setError(null);
  }

  const value = useMemo(
    () => ({ 
      user, 
      isLoading, 
      error, 
      register: handleRegister, 
      login: handleLogin, 
      loginWithGoogle: handleGoogleLogin, 
      logout: handleLogout,
      updateProfile: handleUpdateProfile,
      // uploadAvatar,
      // uploadBanner,
      updateLocalUser,
      clearAuthState
    }),
    [user, isLoading, error]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
