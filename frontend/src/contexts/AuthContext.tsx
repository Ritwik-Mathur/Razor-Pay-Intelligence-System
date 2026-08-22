import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    mobile?: string;
    businessCategory?: string;
    country?: string;
    agreedToTerms: boolean;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('rpai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rpai_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Validate token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rpai_token');
      if (storedToken) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          setToken(storedToken);
          localStorage.setItem('rpai_user', JSON.stringify(freshUser));
        } catch (err: any) {
          console.warn('Session check failed or token expired:', err.message);
          // Fallback to local user if backend is offline, else clear on 401
          if (err.statusCode === 401) {
            localStorage.removeItem('rpai_token');
            localStorage.removeItem('rpai_user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      setToken(result.token);
      setUser(result.user);

      if (rememberMe) {
        localStorage.setItem('rpai_token', result.token);
        localStorage.setItem('rpai_user', JSON.stringify(result.user));
      } else {
        sessionStorage.setItem('rpai_token', result.token);
        localStorage.setItem('rpai_token', result.token);
        localStorage.setItem('rpai_user', JSON.stringify(result.user));
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    mobile?: string;
    businessCategory?: string;
    country?: string;
    agreedToTerms: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.register(payload);
      setToken(result.token);
      setUser(result.user);
      localStorage.setItem('rpai_token', result.token);
      localStorage.setItem('rpai_user', JSON.stringify(result.user));
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout().catch(() => {});
    setToken(null);
    setUser(null);
    localStorage.removeItem('rpai_token');
    localStorage.removeItem('rpai_user');
    sessionStorage.removeItem('rpai_token');
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const updated = await authService.updateProfile(data);
      setUser((prev) => (prev ? { ...prev, ...updated } : null));
      if (user) {
        localStorage.setItem('rpai_user', JSON.stringify({ ...user, ...updated }));
      }
    } catch (err: any) {
      setError(err.message || 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token && !!user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
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
