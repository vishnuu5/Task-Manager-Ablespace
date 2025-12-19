"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types";
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ token: string; user: User }>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

    const checkAuth = async () => {
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setUser(null);
        return;
      }
      
      const response = await api.auth.me() as { user: User };
      setUser(response.user);
    } catch (error: any) {
      if (error.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await api.auth.login({ email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
      }
      setUser(data.user);
      return data;
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response: any = await api.auth.register({ email, password, name });
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
    }
  };

  const updateProfile = async (name: string) => {
    const response: any = await api.auth.updateProfile({ name });
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
