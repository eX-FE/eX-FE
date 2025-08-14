'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, loginUser, logoutUser, registerUser, loginWithGoogleIdToken, updateProfile as apiUpdateProfile, uploadAvatar as apiUploadAvatar, uploadBanner as apiUploadBanner } from '../utils/api';

export const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user from token
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if we have a token first
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        console.log('[UserContext] Token check:', token ? 'exists' : 'missing');
        
        if (!token) {
          console.log('[UserContext] No token found, setting user to null');
          setUser(null);
          setIsLoading(false);
          return;
        }

        console.log('[UserContext] Fetching user data...');
        const data = await fetchMe();
        console.log('[UserContext] User data received:', data.user);
        setUser(data.user);
      } catch (err) {
        console.log('[UserContext] Error fetching user data:', err.message);
        // If token is invalid, clear it from localStorage
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

  async function handleRegister(payload) {
    setError(null);
    const data = await registerUser(payload);
    localStorage.setItem('access_token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function handleLogin(payload) {
    setError(null);
    const data = await loginUser(payload);
    localStorage.setItem('access_token', data.token);
    setUser(data.user);
    return data.user;
  }

  async function handleGoogleLogin(idToken) {
    setError(null);
    const data = await loginWithGoogleIdToken(idToken);
    localStorage.setItem('access_token', data.token);
    setUser(data.user);
    return data.user;
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
    const data = await apiUpdateProfile(partial);
    setUser(data.user);
    return data.user;
  }

  async function uploadAvatar(file) {
    const { url } = await apiUploadAvatar(file);
    // Optimistically update avatar
    const updated = await handleUpdateProfile({ avatarUrl: url });
    return updated;
  }

  async function uploadBanner(file) {
    const { url } = await apiUploadBanner(file);
    const updated = await handleUpdateProfile({ bannerUrl: url });
    return updated;
  }

  // Helper function to clear all auth state (useful for debugging)
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
      uploadAvatar,
      uploadBanner,
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
