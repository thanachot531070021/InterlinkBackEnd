/**
 * Product Service
 * API calls for Product Management
 */

import { api } from '../api';
import type { Product, ProductStats, PaginatedResponse, PaginationParams } from '@/types/models';

export const productService = {
  /**
   * Get all products with pagination and filters
   */
  async getProducts(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  /**
   * Search products
   */
  async searchProducts(query: string, params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get('/products/search', { params: { ...params, q: query } });
    return response.data;
  },

  /**
   * Get active products only
   */
  async getActiveProducts(): Promise<Product[]> {
    const response = await api.get('/products/active');
    return response.data;
  },

  /**
   * Get products by brand
   */
  async getProductsByBrand(brandId: string, params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get(`/products/brand/${brandId}`, { params });
    return response.data;
  },

  /**
   * Get products by store
   */
  async getProductsByStore(storeId: string, params?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get(`/products/store/${storeId}`, { params });
    return response.data;
  },

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  /**
   * Get product by SKU
   */
  async getProductBySku(sku: string): Promise<Product> {
    const response = await api.get(`/products/sku/${sku}`);
    return response.data;
  },

  /**
   * Get product statistics
   */
  async getProductStats(id: string): Promise<ProductStats> {
    const response = await api.get(`/products/${id}/stats`);
    return response.data;
  },

  /**
   * Create new product
   */
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  /**
   * Update existing product
   */
  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
