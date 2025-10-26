/**
 * Custom Hook: useProducts
 * TanStack Query hooks for Product Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/services/productService';
import type { Product, PaginatedResponse, PaginationParams } from '@/types/models';
import { useUIStore } from '@/stores/uiStore';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...productKeys.lists(), params] as const,
  search: (query: string, params?: PaginationParams) =>
    [...productKeys.all, 'search', query, params] as const,
  active: () => [...productKeys.all, 'active'] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  slug: (slug: string) => [...productKeys.all, 'slug', slug] as const,
  sku: (sku: string) => [...productKeys.all, 'sku', sku] as const,
  byBrand: (brandId: string, params?: PaginationParams) =>
    [...productKeys.all, 'brand', brandId, params] as const,
  byStore: (storeId: string, params?: PaginationParams) =>
    [...productKeys.all, 'store', storeId, params] as const,
  byCategory: (category: string, params?: PaginationParams) =>
    [...productKeys.all, 'category', category, params] as const,
  variants: (id: string) => [...productKeys.detail(id), 'variants'] as const,
};

/**
 * Get paginated list of products
 */
export function useProducts(params?: PaginationParams) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Search products
 */
export function useSearchProducts(query: string, params?: PaginationParams) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: productKeys.search(query, params),
    queryFn: () => productService.searchProducts(query, params),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get active products only
 */
export function useActiveProducts() {
  return useQuery<Product[]>({
    queryKey: productKeys.active(),
    queryFn: () => productService.getActiveProducts(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Get single product by ID
 */
export function useProduct(id: string | undefined) {
  return useQuery<Product>({
    queryKey: productKeys.detail(id!),
    queryFn: () => productService.getProduct(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get product by slug
 */
export function useProductBySlug(slug: string | undefined) {
  return useQuery<Product>({
    queryKey: productKeys.slug(slug!),
    queryFn: () => productService.getProductBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get product by SKU
 */
export function useProductBySku(sku: string | undefined) {
  return useQuery<Product>({
    queryKey: productKeys.sku(sku!),
    queryFn: () => productService.getProductBySku(sku!),
    enabled: !!sku,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get products by brand
 */
export function useProductsByBrand(brandId: string | undefined, params?: PaginationParams) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: productKeys.byBrand(brandId!, params),
    queryFn: () => productService.getProductsByBrand(brandId!, params),
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get products by store
 */
export function useProductsByStore(storeId: string | undefined, params?: PaginationParams) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: productKeys.byStore(storeId!, params),
    queryFn: () => productService.getProductsByStore(storeId!, params),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get products by category
 */
export function useProductsByCategory(category: string | undefined, params?: PaginationParams) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: productKeys.byCategory(category!, params),
    queryFn: () => productService.getProductsByCategory(category!, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get product variants
 */
export function useProductVariants(productId: string | undefined) {
  return useQuery({
    queryKey: productKeys.variants(productId!),
    queryFn: () => productService.getProductVariants(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: Partial<Product>) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.active() });

      addNotification({
        type: 'success',
        title: 'Product Created',
        message: 'Product has been created successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Create Failed',
        message: error?.response?.data?.message || 'Failed to create product',
      });
    },
  });
}

/**
 * Update existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.active() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct.id) });

      // Invalidate related queries
      if (updatedProduct.brandId) {
        queryClient.invalidateQueries({
          queryKey: productKeys.byBrand(updatedProduct.brandId)
        });
      }

      addNotification({
        type: 'success',
        title: 'Product Updated',
        message: 'Product has been updated successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.message || 'Failed to update product',
      });
    },
  });
}

/**
 * Delete product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.active() });

      addNotification({
        type: 'success',
        title: 'Product Deleted',
        message: 'Product has been deleted successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error?.response?.data?.message || 'Failed to delete product',
      });
    },
  });
}
