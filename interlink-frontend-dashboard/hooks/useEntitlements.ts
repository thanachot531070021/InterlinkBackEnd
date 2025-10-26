/**
 * Custom Hook: useEntitlements
 * TanStack Query hooks for Store-Brand Entitlement Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entitlementService } from '@/lib/services/entitlementService';
import type { Entitlement, PaginatedResponse, PaginationParams } from '@/types/models';
import { useUIStore } from '@/stores/uiStore';

// Query Keys
export const entitlementKeys = {
  all: ['entitlements'] as const,
  lists: () => [...entitlementKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...entitlementKeys.lists(), params] as const,
  details: () => [...entitlementKeys.all, 'detail'] as const,
  detail: (id: string) => [...entitlementKeys.details(), id] as const,
  byStore: (storeId: string, params?: PaginationParams) =>
    [...entitlementKeys.all, 'store', storeId, params] as const,
  byBrand: (brandId: string, params?: PaginationParams) =>
    [...entitlementKeys.all, 'brand', brandId, params] as const,
  check: (storeId: string, brandId: string) =>
    [...entitlementKeys.all, 'check', storeId, brandId] as const,
  stats: () => [...entitlementKeys.all, 'stats'] as const,
  active: (storeId: string) => [...entitlementKeys.all, 'active', storeId] as const,
};

/**
 * Get paginated list of entitlements
 */
export function useEntitlements(params?: PaginationParams) {
  return useQuery<PaginatedResponse<Entitlement>>({
    queryKey: entitlementKeys.list(params),
    queryFn: () => entitlementService.getEntitlements(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get single entitlement by ID
 */
export function useEntitlement(id: string | undefined) {
  return useQuery<Entitlement>({
    queryKey: entitlementKeys.detail(id!),
    queryFn: () => entitlementService.getEntitlement(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get entitlements by store
 */
export function useEntitlementsByStore(storeId: string | undefined, params?: PaginationParams) {
  return useQuery<PaginatedResponse<Entitlement>>({
    queryKey: entitlementKeys.byStore(storeId!, params),
    queryFn: () => entitlementService.getEntitlementsByStore(storeId!, params),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get entitlements by brand
 */
export function useEntitlementsByBrand(brandId: string | undefined, params?: PaginationParams) {
  return useQuery<PaginatedResponse<Entitlement>>({
    queryKey: entitlementKeys.byBrand(brandId!, params),
    queryFn: () => entitlementService.getEntitlementsByBrand(brandId!, params),
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Check if store has entitlement to sell brand products
 */
export function useCheckEntitlement(storeId: string | undefined, brandId: string | undefined) {
  return useQuery<{ hasEntitlement: boolean; entitlement?: Entitlement }>({
    queryKey: entitlementKeys.check(storeId!, brandId!),
    queryFn: () => entitlementService.checkEntitlement(storeId!, brandId!),
    enabled: !!storeId && !!brandId,
    staleTime: 2 * 60 * 1000, // 2 minutes (frequently used)
  });
}

/**
 * Get entitlement statistics
 */
export function useEntitlementStats() {
  return useQuery({
    queryKey: entitlementKeys.stats(),
    queryFn: () => entitlementService.getEntitlementStats(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get active entitlements for a store
 */
export function useActiveEntitlements(storeId: string | undefined) {
  return useQuery<Entitlement[]>({
    queryKey: entitlementKeys.active(storeId!),
    queryFn: () => entitlementService.getActiveEntitlements(storeId!),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Grant entitlement to a store
 */
export function useGrantEntitlement() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: Partial<Entitlement>) => entitlementService.grantEntitlement(data),
    onSuccess: (newEntitlement) => {
      queryClient.invalidateQueries({ queryKey: entitlementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: entitlementKeys.stats() });

      if (newEntitlement.storeId) {
        queryClient.invalidateQueries({
          queryKey: entitlementKeys.byStore(newEntitlement.storeId)
        });
        queryClient.invalidateQueries({
          queryKey: entitlementKeys.active(newEntitlement.storeId)
        });
      }

      if (newEntitlement.brandId) {
        queryClient.invalidateQueries({
          queryKey: entitlementKeys.byBrand(newEntitlement.brandId)
        });
      }

      addNotification({
        type: 'success',
        title: 'Entitlement Granted',
        message: 'Store has been granted permission to sell brand products',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Grant Failed',
        message: error?.response?.data?.message || 'Failed to grant entitlement',
      });
    },
  });
}

/**
 * Update existing entitlement
 */
export function useUpdateEntitlement() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Entitlement> }) =>
      entitlementService.updateEntitlement(id, data),
    onSuccess: (updatedEntitlement) => {
      queryClient.invalidateQueries({ queryKey: entitlementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: entitlementKeys.detail(updatedEntitlement.id) });

      if (updatedEntitlement.storeId) {
        queryClient.invalidateQueries({
          queryKey: entitlementKeys.byStore(updatedEntitlement.storeId)
        });
        queryClient.invalidateQueries({
          queryKey: entitlementKeys.active(updatedEntitlement.storeId)
        });
      }

      addNotification({
        type: 'success',
        title: 'Entitlement Updated',
        message: 'Entitlement has been updated successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.message || 'Failed to update entitlement',
      });
    },
  });
}

/**
 * Revoke entitlement from a store
 */
export function useRevokeEntitlement() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => entitlementService.revokeEntitlement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: entitlementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: entitlementKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Entitlement Revoked',
        message: 'Store permission has been revoked successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Revoke Failed',
        message: error?.response?.data?.message || 'Failed to revoke entitlement',
      });
    },
  });
}

/**
 * Bulk grant entitlements
 */
export function useBulkGrantEntitlements() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: { storeId: string; brandIds: string[] }) =>
      entitlementService.bulkGrant(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: entitlementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: entitlementKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Bulk Grant Completed',
        message: `Successfully granted ${result.granted} entitlements`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Bulk Grant Failed',
        message: error?.response?.data?.message || 'Failed to grant entitlements',
      });
    },
  });
}

/**
 * Bulk revoke entitlements
 */
export function useBulkRevokeEntitlements() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (entitlementIds: string[]) =>
      entitlementService.bulkRevoke(entitlementIds),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: entitlementKeys.lists() });
      queryClient.invalidateQueries({ queryKey: entitlementKeys.stats() });

      addNotification({
        type: 'success',
        title: 'Bulk Revoke Completed',
        message: `Successfully revoked ${result.revoked} entitlements`,
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Bulk Revoke Failed',
        message: error?.response?.data?.message || 'Failed to revoke entitlements',
      });
    },
  });
}
