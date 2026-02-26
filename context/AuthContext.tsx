'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
// @ts-ignore
import axios from 'axios';

type AuthCtx = { accessToken: string | null; login: (creds:any)=>Promise<void>; logout: ()=>void; };

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // attempt silent refresh on mount
  useEffect(() => {
    let mounted = true;
    async function tryRefresh() {
      try {
        const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        if (mounted) setAccessToken(res.data.accessToken);
      } catch { setAccessToken(null); }
    }
    tryRefresh();
    return () => { mounted = false; };
  }, []);

  // attach interceptor to refresh on 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      r => r,
      async err => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
          original._retry = true;
          try {
            const r = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
            setAccessToken(r.data.accessToken);
            original.headers['Authorization'] = `Bearer ${r.data.accessToken}`;
            return axios(original);
          } catch {
            setAccessToken(null);
            return Promise.reject(err);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = async (creds:any) => {
    const res = await axios.post('/api/auth/login', creds, { withCredentials: true });
    setAccessToken(res.data.accessToken);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setAccessToken(null);
  };

  return <AuthContext.Provider value={{ accessToken, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}