import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SafeUser, Organization, UserRole } from '../../backend/types';
import { api, tokenStorage } from '../services/api';

interface AuthContextType {
  user: SafeUser | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    organizationName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  switchDemoUser: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(tokenStorage.getUser());
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = tokenStorage.get();
    if (!token) {
      setUser(null);
      setOrganization(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      setUser(res.user);
      setOrganization(res.organization);
    } catch (err) {
      console.error('Session expired or error loading user:', err);
      tokenStorage.remove();
      setUser(null);
      setOrganization(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // If no token exists on first load, auto-login as Admin to give instant access to full app
    const checkInitialAuth = async () => {
      const token = tokenStorage.get();
      if (!token) {
        try {
          // Auto log in as Admin for seamless initial portfolio demo
          const res = await api.login('admin@taskforge.io', 'password123');
          setUser(res.user);
          await refreshUser();
          return;
        } catch {
          setIsLoading(false);
          return;
        }
      }
      await refreshUser();
    };

    checkInitialAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
    await refreshUser();
  };

  const register = async (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    organizationName?: string;
  }) => {
    const res = await api.register(payload);
    setUser(res.user);
    await refreshUser();
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setOrganization(null);
  };

  const switchDemoUser = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const emails: Record<UserRole, string> = {
        ADMIN: 'admin@taskforge.io',
        MANAGER: 'manager@taskforge.io',
        DEVELOPER: 'david@taskforge.io'
      };
      const email = emails[role];
      await api.login(email, 'password123');
      await refreshUser();
    } catch (err) {
      console.error('Error switching demo role:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchDemoUser,
        refreshUser
      }}
    >
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
