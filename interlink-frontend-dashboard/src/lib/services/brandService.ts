/**
 * Brand Service
 * API calls for Brand Management
 */

import { api } from '../api';
import type { Brand, BrandStats, PaginatedResponse, PaginationParams } from '@/types/models';

export const brandService = {
  /**
   * Get all brands with pagination and filters
   */
  async getBrands(params?: PaginationParams): Promise<PaginatedResponse<Brand>> {
    const response = await api.get('/brands', { params });
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
   * Get active brands only
   */
  async getActiveBrands(): Promise<Brand[]> {
    const response = await api.get('/brands/active');
    return response.data;
  },

  /**
   * Get single brand by ID
   */
  async getBrand(id: string): Promise<Brand> {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  /**
   * Get brand by slug
   */
  async getBrandBySlug(slug: string): Promise<Brand> {
    const response = await api.get(`/brands/slug/${slug}`);
    return response.data;
  },

  /**
   * Get brand statistics
   */
  async getBrandStats(id: string): Promise<BrandStats> {
    const response = await api.get(`/brands/${id}/stats`);
    return response.data;
  },

  /**
   * Create new brand
   */
  async createBrand(data: Partial<Brand>): Promise<Brand> {
    const response = await api.post('/brands', data);
    return response.data;
  },

  /**
   * Update existing brand
   */
  async updateBrand(id: string, data: Partial<Brand>): Promise<Brand> {
    const response = await api.patch(`/brands/${id}`, data);
    return response.data;
  },

  /**
   * Delete brand
   */
  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
  },
};
