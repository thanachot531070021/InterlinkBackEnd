/**
 * Custom Hook: useUsers
 * TanStack Query hooks for User Management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/services/userService';
import type { User, UserProfile, PaginatedResponse, PaginationParams } from '@/types/models';
import { useUIStore } from '@/stores/uiStore';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...userKeys.lists(), params] as const,
  search: (query: string, params?: PaginationParams) =>
    [...userKeys.all, 'search', query, params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  byStore: (storeId: string) => [...userKeys.all, 'store', storeId] as const,
};

/**
 * Get current user profile
 */
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: userKeys.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Get paginated list of users
 */
export function useUsers(params?: PaginationParams) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Search users
 */
export function useSearchUsers(query: string, params?: PaginationParams) {
  return useQuery<PaginatedResponse<User>>({
    queryKey: userKeys.search(query, params),
    queryFn: () => userService.searchUsers(query, params),
    enabled: query.length >= 2, // Only search if query is at least 2 characters
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Get single user by ID
 */
export function useUser(id: string | undefined) {
  return useQuery<User>({
    queryKey: userKeys.detail(id!),
    queryFn: () => userService.getUser(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get user statistics
 */
export function useUserStats() {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getUserStats(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get users by store
 */
export function useUsersByStore(storeId: string | undefined) {
  return useQuery<User[]>({
    queryKey: userKeys.byStore(storeId!),
    queryFn: () => userService.getUsersByStore(storeId!),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: Partial<User> & { password: string }) =>
      userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });

      addNotification({
        type: 'success',
        title: 'User Created',
        message: 'User account has been created successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Create Failed',
        message: error?.response?.data?.message || 'Failed to create user',
      });
    },
  });
}

/**
 * Update existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(updatedUser.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });

      // If updating current user's profile, invalidate profile query
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });

      addNotification({
        type: 'success',
        title: 'User Updated',
        message: 'User has been updated successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error?.response?.data?.message || 'Failed to update user',
      });
    },
  });
}

/**
 * Delete user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });

      addNotification({
        type: 'success',
        title: 'User Deleted',
        message: 'User has been deleted successfully',
      });
    },
    onError: (error: any) => {
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: error?.response?.data?.message || 'Failed to delete user',
      });
    },
  });
}
