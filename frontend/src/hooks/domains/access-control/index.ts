/**
 * Access Control Domain Exports
 * 
 * Central export point for all access control and permissions hooks.
 * 
 * @module hooks/domains/access-control
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accessControlApi } from '@/services';
import { useApiError } from '../../shared/useApiError';
import toast from 'react-hot-toast';

// Query keys
export const accessControlQueryKeys = {
  domain: ['access-control'] as const,
  permissions: {
    all: () => [...accessControlQueryKeys.domain, 'permissions'] as const,
    byUser: (userId: string) => 
      [...accessControlQueryKeys.permissions.all(), 'user', userId] as const,
    byRole: (roleId: string) => 
      [...accessControlQueryKeys.permissions.all(), 'role', roleId] as const,
  },
  roles: {
    all: () => [...accessControlQueryKeys.domain, 'roles'] as const,
  },
} as const;

/**
 * Get user permissions
 */
export function useUserPermissions(
  userId: string,
  options?: any
) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: accessControlQueryKeys.permissions.byUser(userId),
    queryFn: async () => {
      try {
        return await accessControlApi.getUserPermissions(userId);
      } catch (error: any) {
        throw handleError(error, 'fetch_user_permissions');
      }
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Get available roles
 */
export function useRolesList(options?: any) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: accessControlQueryKeys.roles.all(),
    queryFn: async () => {
      try {
        return await accessControlApi.getAllRoles();
      } catch (error: any) {
        throw handleError(error, 'fetch_roles');
      }
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Check specific permission
 */
export function usePermissionCheck(permission: string, resourceId?: string) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: [...accessControlQueryKeys.domain, 'check', permission, resourceId],
    queryFn: async () => {
      try {
        return await accessControlApi.checkPermission(permission, resourceId);
      } catch (error: any) {
        throw handleError(error, 'check_permission');
      }
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Update user permissions mutation
 */
export function useUpdateUserPermissions() {
  const queryClient = useQueryClient();
  const { handleError } = useApiError();

  return useMutation({
    mutationFn: async ({ userId, permissions }: { userId: string; permissions: string[] }) => {
      try {
        return await accessControlApi.updateUserPermissions(userId, permissions);
      } catch (error: any) {
        throw handleError(error, 'update_permissions');
      }
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ 
        queryKey: accessControlQueryKeys.permissions.byUser(userId) 
      });
      toast.success('Permissions updated successfully');
    },
    onError: () => {
      toast.error('Failed to update permissions');
    },
  });
}
