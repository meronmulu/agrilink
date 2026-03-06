'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import * as AuthService from '../services/authService'
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  

  // login method now takes credentials and calls your login service
const login = async (credentials: { email: string; password: string }) => {
  try {
    const res = await AuthService.login(credentials);

    if (res?.token && res?.user) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);

      return true;
    }

    return false;
  } catch {
    return false;
  }
};



  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
   router.push(`/`);

    
  };

  // On mount, restore user from localStorage if available
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      setTimeout(() => {
        setUser(JSON.parse(userString));
      }, 0);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
