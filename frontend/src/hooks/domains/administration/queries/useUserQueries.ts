/**
 * @fileoverview User management query hooks for React Query integration
 * @module hooks/domains/administration/queries/useUserQueries
 * @category Hooks
 *
 * Custom React Query hooks for user management functionality including:
 * - User list and details
 * - User roles and permissions
 * - User activity tracking
 *
 * Features:
 * - React Query integration for caching and automatic refetching
 * - 5 minute stale time for user data
 * - Type-safe with full TypeScript support
 * - Error handling with automatic retries
 * - Enabled/disabled logic for conditional queries
 *
 * @example
 * ```typescript
 * // List users with filters
 * function UserManagement() {
 *   const { data: users, isLoading, error } = useUsers({
 *     role: 'NURSE',
 *     schoolId: 'school-123',
 *     isActive: true
 *   });
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message={error.message} />;
 *   return <UserList users={users} />;
 * }
 *
 * // Get user details (auto-disabled if no id)
 * function UserProfile({ userId }: { userId?: string }) {
 *   const { data: user } = useUserDetails(userId || '');
 *   return user ? <ProfileCard user={user} /> : null;
 * }
 *
 * // Check user permissions
 * function MedicationAccess({ userId }: { userId: string }) {
 *   const { data: permissions } = useUserPermissions(userId);
 *   const canAdminister = permissions?.includes('administer_medication');
 *   return canAdminister ? <MedicationForm /> : <AccessDenied />;
 * }
 * ```
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  ADMINISTRATION_QUERY_KEYS,
  ADMINISTRATION_CACHE_CONFIG,
  AdminUser,
} from '../config';
import { administrationApi } from '@/services';

// ==========================================
// USER MANAGEMENT QUERIES
// ==========================================

/**
 * Hook to fetch list of users with optional filters
 * @param filters - Optional filters for users list
 * @param options - React Query options
 * @returns Query result with users list
 */
export const useUsers = (
  filters?: any,
  options?: UseQueryOptions<AdminUser[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.usersList(filters),
    queryFn: async () => {
      const response = await administrationApi.getUsers(filters);
      return response.data;
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    ...options,
  });
};

/**
 * Hook to fetch user details by ID
 * @param id - User ID
 * @param options - React Query options
 * @returns Query result with user details
 */
export const useUserDetails = (
  id: string,
  options?: UseQueryOptions<AdminUser, Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.userDetails(id),
    queryFn: async () => {
      return await administrationApi.getUserById(id);
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to fetch user roles
 * @param userId - User ID
 * @param options - React Query options
 * @returns Query result with user roles
 */
export const useUserRoles = (
  userId: string,
  options?: UseQueryOptions<any[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.userRoles(userId),
    queryFn: async () => {
      const user = await administrationApi.getUserById(userId);
      return user.role ? [user.role] : [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};

/**
 * Hook to fetch user permissions
 * @param userId - User ID
 * @param options - React Query options
 * @returns Query result with user permissions
 */
export const useUserPermissions = (
  userId: string,
  options?: UseQueryOptions<string[], Error>
) => {
  return useQuery({
    queryKey: ADMINISTRATION_QUERY_KEYS.userPermissions(userId),
    queryFn: async () => {
      const user = await administrationApi.getUserById(userId);
      return user.permissions || [];
    },
    staleTime: ADMINISTRATION_CACHE_CONFIG.USERS_STALE_TIME,
    enabled: !!userId,
    ...options,
  });
};
