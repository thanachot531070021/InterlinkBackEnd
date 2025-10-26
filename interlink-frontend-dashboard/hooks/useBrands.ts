/**
 * Custom Hook: useBrands
 * TanStack Query hooks for Brand Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/lib/services/brandService';
import type { Brand, PaginatedResponse, PaginationParams } from '@/types/models';
import { useUIStore } from '@/stores/uiStore';

// Query Keys
export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...brandKeys.lists(), params] as const,
  active: () => [...brandKeys.all, 'active'] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: string) => [...brandKeys.details(), id] as const,
  slug: (slug: string) => [...brandKeys.all, 'slug', slug] as const,
  stats: () => [...brandKeys.all, 'stats'] as const,
  products: (id: string) => [...brandKeys.detail(id), 'products'] as const,
};

/**
 * Get paginated list of brands
 */
export function useBrands(params?: PaginationParams) {
  return useQuery<PaginatedResponse<Brand>>({
    queryKey: brandKeys.list(params),
    queryFn: () => brandService.getBrands(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get active brands only
 */
export function useActiveBrands() {
  return useQuery<Brand[]>({
    queryKey: brandKeys.active(),
    queryFn: () => brandService.getActiveBrands(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get single brand by ID
 */
export function useBrand(id: string | undefined) {
  return useQuery<Brand>({
    queryKey: brandKeys.detail(id!),
    queryFn: () => brandService.getBrand(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get brand by slug
 */
export function useBrandBySlug(slug: string | undefined) {
  return useQuery<Brand>({
    queryKey: brandKeys.slug(slug!),
    queryFn: () => brandService.getBrandBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get brand statistics
 */
export function useBrandStats() {
  return useQuery({
    queryKey: brandKeys.stats(),
    queryFn: () => brandService.getBrandStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get products for a brand
 */
export function useBrandProducts(brandId: string | undefined) {
  return useQuery({
    queryKey: brandKeys.products(brandId!),
    queryFn: () => brandService.getBrandProducts(brandId!),
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create new brand
 */
export function useCreateBrand() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: Partial<Brand>) => brandService.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.active() });
      queryClient.invalidateQueries({ queryKey: brandKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Brand Created',
        message: 'Brand has been created successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Create Failed',
        message: error?.response?.data?.message || 'Failed to create brand',
      });
    },
  });
}

/**
 * Update existing brand
 */
export function useUpdateBrand() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      brandService.updateBrand(id, data),
    onSuccess: (updatedBrand) => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.active() });
      queryClient.invalidateQueries({ queryKey: brandKeys.detail(updatedBrand.id) });
      queryClient.invalidateQueries({ queryKey: brandKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Brand Updated',
        message: 'Brand has been updated successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.message || 'Failed to update brand',
      });
    },
  });
}

/**
 * Delete brand
 */
export function useDeleteBrand() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandKeys.lists() });
      queryClient.invalidateQueries({ queryKey: brandKeys.active() });
      queryClient.invalidateQueries({ queryKey: brandKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Brand Deleted',
        message: 'Brand has been deleted successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error?.response?.data?.message || 'Failed to delete brand',
      });
    },
  });
}
