/**
 * Custom Hook: useStores
 * TanStack Query hooks for Store Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '@/lib/services/storeService';
import type { Store, PaginatedResponse, PaginationParams } from '@/types/models';
import { useUIStore } from '@/stores/uiStore';

// Query Keys
export const storeKeys = {
  all: ['stores'] as const,
  lists: () => [...storeKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...storeKeys.lists(), params] as const,
  active: () => [...storeKeys.all, 'active'] as const,
  details: () => [...storeKeys.all, 'detail'] as const,
  detail: (id: string) => [...storeKeys.details(), id] as const,
  slug: (slug: string) => [...storeKeys.all, 'slug', slug] as const,
  stats: () => [...storeKeys.all, 'stats'] as const,
  brands: (id: string) => [...storeKeys.detail(id), 'brands'] as const,
};

/**
 * Get paginated list of stores
 */
export function useStores(params?: PaginationParams) {
  return useQuery<PaginatedResponse<Store>>({
    queryKey: storeKeys.list(params),
    queryFn: () => storeService.getStores(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get active stores only
 */
export function useActiveStores() {
  return useQuery<Store[]>({
    queryKey: storeKeys.active(),
    queryFn: () => storeService.getActiveStores(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get single store by ID
 */
export function useStore(id: string | undefined) {
  return useQuery<Store>({
    queryKey: storeKeys.detail(id!),
    queryFn: () => storeService.getStore(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get store by slug
 */
export function useStoreBySlug(slug: string | undefined) {
  return useQuery<Store>({
    queryKey: storeKeys.slug(slug!),
    queryFn: () => storeService.getStoreBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get store statistics
 */
export function useStoreStats() {
  return useQuery({
    queryKey: storeKeys.stats(),
    queryFn: () => storeService.getStoreStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get brands associated with a store
 */
export function useStoreBrands(storeId: string | undefined) {
  return useQuery({
    queryKey: storeKeys.brands(storeId!),
    queryFn: () => storeService.getStoreBrands(storeId!),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create new store
 */
export function useCreateStore() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: Partial<Store>) => storeService.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.active() });
      queryClient.invalidateQueries({ queryKey: storeKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Store Created',
        message: 'Store has been created successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Create Failed',
        message: error?.response?.data?.message || 'Failed to create store',
      });
    },
  });
}

/**
 * Update existing store
 */
export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Store> }) =>
      storeService.updateStore(id, data),
    onSuccess: (updatedStore) => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.active() });
      queryClient.invalidateQueries({ queryKey: storeKeys.detail(updatedStore.id) });
      queryClient.invalidateQueries({ queryKey: storeKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Store Updated',
        message: 'Store has been updated successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.message || 'Failed to update store',
      });
    },
  });
}

/**
 * Delete store
 */
export function useDeleteStore() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => storeService.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeKeys.active() });
      queryClient.invalidateQueries({ queryKey: storeKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Store Deleted',
        message: 'Store has been deleted successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error?.response?.data?.message || 'Failed to delete store',
      });
    },
  });
}
