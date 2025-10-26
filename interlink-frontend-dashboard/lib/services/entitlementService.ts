/**
 * Entitlement Service
 * API calls for Store-Brand Entitlements Management
 */

import { api } from '../api';
import type { Entitlement, PaginatedResponse, PaginationParams } from '@/types/models';

export const entitlementService = {
  /**
   * Get all entitlements with pagination and filters
   */
  async getEntitlements(params?: PaginationParams): Promise<PaginatedResponse<Entitlement>> {
    const response = await api.get('/entitlements', { params });
    return response.data;
  },

  /**
   * Get active entitlements only
   */
  async getActiveEntitlements(): Promise<Entitlement[]> {
    const response = await api.get('/entitlements/active');
    return response.data;
  },

  /**
   * Get entitlements by store
   */
  async getStoreEntitlements(storeId: string): Promise<Entitlement[]> {
    const response = await api.get(`/entitlements/store/${storeId}`);
    return response.data;
  },

  /**
   * Get active entitlements by store
   */
  async getActiveStoreEntitlements(storeId: string): Promise<Entitlement[]> {
    const response = await api.get(`/entitlements/store/${storeId}/active`);
    return response.data;
  },

  /**
   * Get entitlements by brand
   */
  async getBrandEntitlements(brandId: string): Promise<Entitlement[]> {
    const response = await api.get(`/entitlements/brand/${brandId}`);
    return response.data;
  },

  /**
   * Get active entitlements by brand
   */
  async getActiveBrandEntitlements(brandId: string): Promise<Entitlement[]> {
    const response = await api.get(`/entitlements/brand/${brandId}/active`);
    return response.data;
  },

  /**
   * Check if store has permission for brand
   */
  async checkEntitlement(storeId: string, brandId: string): Promise<{ hasPermission: boolean }> {
    const response = await api.get(`/entitlements/check/${storeId}/${brandId}`);
    return response.data;
  },

  /**
   * Get single entitlement by ID
   */
  async getEntitlement(id: string): Promise<Entitlement> {
    const response = await api.get(`/entitlements/${id}`);
    return response.data;
  },

  /**
   * Get entitlement statistics
   */
  async getEntitlementStats(): Promise<any> {
    const response = await api.get('/entitlements/stats');
    return response.data;
  },

  /**
   * Create new entitlement (grant permission)
   */
  async createEntitlement(data: Partial<Entitlement>): Promise<Entitlement> {
    const response = await api.post('/entitlements', data);
    return response.data;
  },

  /**
   * Update existing entitlement
   */
  async updateEntitlement(id: string, data: Partial<Entitlement>): Promise<Entitlement> {
    const response = await api.patch(`/entitlements/${id}`, data);
    return response.data;
  },

  /**
   * Revoke entitlement
   */
  async revokeEntitlement(id: string): Promise<Entitlement> {
    const response = await api.patch(`/entitlements/${id}/revoke`);
    return response.data;
  },

  /**
   * Delete entitlement
   */
  async deleteEntitlement(id: string): Promise<void> {
    await api.delete(`/entitlements/${id}`);
  },
};
