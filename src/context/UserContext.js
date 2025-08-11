'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchMe, loginUser, logoutUser, registerUser } from '../utils/api';

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
        const data = await fetchMe();
        setUser(data.user);
      } catch (err) {
        setUser(null);
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

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  }

  const value = useMemo(() => ({ user, isLoading, error, register: handleRegister, login: handleLogin, logout: handleLogout }), [user, isLoading, error]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
