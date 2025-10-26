/**
 * Authentication Service
 * API calls for Authentication
 */

import { api } from '../api';
import type { User } from '@/types/models';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  refresh_token?: string;
}

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);

    // Save tokens to localStorage (handle both snake_case and camelCase)
    const accessToken = response.data.access_token || response.data.accessToken;
    const refreshToken = response.data.refresh_token || response.data.refreshToken;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }

    // Normalize response
    return {
      user: response.data.user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post('/auth/refresh', { refreshToken });

    // Update access token in localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response.data;
  },

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
