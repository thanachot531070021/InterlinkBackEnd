/**
 * User Service
 * API calls for User Management
 */

import { api } from '../api';
import type { User, UserProfile, PaginatedResponse, PaginationParams } from '@/types/models';

export const userService = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  /**
   * Get all users with pagination and filters
   */
  async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const response = await api.get('/users', { params });
    return response.data;
  },

  /**
   * Search users
   */
  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const response = await api.get('/users/search', { params: { ...params, q: query } });
    return response.data;
  },

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<any> {
    const response = await api.get('/users/stats');
    return response.data;
  },

  /**
   * Get users by store
   */
  async getUsersByStore(storeId: string): Promise<User[]> {
    const response = await api.get(`/users/store/${storeId}`);
    return response.data;
  },

  /**
   * Get single user by ID
   */
  async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  async createUser(data: Partial<User> & { password: string }): Promise<User> {
    const response = await api.post('/users', data);
    return response.data;
  },

  /**
   * Update existing user
   */
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
