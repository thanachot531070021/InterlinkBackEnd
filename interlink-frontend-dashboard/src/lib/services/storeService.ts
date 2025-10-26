/**
 * Store Service
 * API calls for Store Management
 */

import { api } from '../api';
import type { Store, StoreStats, Brand, PaginatedResponse, PaginationParams } from '@/types/models';

export const storeService = {
  /**
   * Get all stores with pagination and filters
   */
  async getStores(params?: PaginationParams): Promise<PaginatedResponse<Store>> {
    const response = await api.get('/stores', { params });
    // Backend returns array directly, wrap it in expected format
    if (Array.isArray(response.data)) {
      return {
        data: response.data,
        total: response.data.length,
        page: 1,
        limit: response.data.length,
      };
    }
    return response.data;
  },

  /**
   * Get active stores only
   */
  async getActiveStores(): Promise<Store[]> {
    const response = await api.get('/stores/active');
    return response.data;
  },

  /**
   * Get single store by ID
   */
  async getStore(id: string): Promise<Store> {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  /**
   * Get store by slug
   */
  async getStoreBySlug(slug: string): Promise<Store> {
    const response = await api.get(`/stores/slug/${slug}`);
    return response.data;
  },

  /**
   * Get store statistics
   */
  async getStoreStats(id: string): Promise<StoreStats> {
    const response = await api.get(`/stores/${id}/stats`);
    return response.data;
  },

  /**
   * Get brands associated with store
   */
  async getStoreBrands(id: string): Promise<Brand[]> {
    const response = await api.get(`/stores/${id}/brands`);
    return response.data;
  },

  /**
   * Create new store
   */
  async createStore(data: Partial<Store>): Promise<Store> {
    const response = await api.post('/stores', data);
    return response.data;
  },

  /**
   * Update existing store
   */
  async updateStore(id: string, data: Partial<Store>): Promise<Store> {
    const response = await api.patch(`/stores/${id}`, data);
    return response.data;
  },

  /**
   * Delete store
   */
  async deleteStore(id: string): Promise<void> {
    await api.delete(`/stores/${id}`);
  },
};
