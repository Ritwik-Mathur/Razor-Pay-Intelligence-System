import { User, LoginSession } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function authRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('rpai_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.message || 'Authentication request failed';
    const error: any = new Error(errorMsg);
    error.statusCode = res.status;
    error.errors = data.errors;
    throw error;
  }

  return data.data;
}

export const authService = {
  register: async (payload: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    businessName: string;
    mobile?: string;
    businessCategory?: string;
    country?: string;
    agreedToTerms: boolean;
  }): Promise<{ token: string; user: User }> => {
    return authRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    return authRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async (): Promise<void> => {
    try {
      await authRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors on logout
    }
  },

  getMe: async (): Promise<User> => {
    return authRequest<User>('/auth/me');
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    return authRequest<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<void> => {
    return authRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  getLoginActivity: async (): Promise<{ loginHistory: LoginSession[]; lastLoginAt?: string; lastLoginIp?: string }> => {
    return authRequest('/auth/login-activity');
  },
};
