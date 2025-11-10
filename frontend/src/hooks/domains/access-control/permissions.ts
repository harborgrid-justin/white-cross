/**
 * @fileoverview User Permissions Hooks
 * @module hooks/domains/access-control/permissions
 * @category Hooks - Access Control
 *
 * Hooks for querying and managing user permissions in the RBAC system.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accessControlQueryKeys } from './query-keys';
import { clientGet, clientPut } from '@/lib/api/client';

/**
 * User permission data structure
 */
export interface UserPermissions {
  userId: string;
  permissions: string[];
  roles: string[];
  grantedAt?: string;
  expiresAt?: string | null;
}

/**
 * Hook to fetch user permissions
 *
 * @param userId - The ID of the user to fetch permissions for
 * @returns Query result with user permissions
 *
 * @example
 * ```typescript
 * function UserProfile({ userId }) {
 *   const { data: permissions, isLoading } = useUserPermissions(userId);
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       <h3>Permissions</h3>
 *       <ul>
 *         {permissions?.permissions.map(perm => (
 *           <li key={perm}>{perm}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserPermissions(userId: string) {
  return useQuery({
    queryKey: accessControlQueryKeys.userPermissions(userId),
    queryFn: async (): Promise<UserPermissions> => {
      return await clientGet<UserPermissions>(`/api/access-control/users/${userId}/permissions`);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Update user permissions mutation options
 */
export interface UpdateUserPermissionsOptions {
  userId: string;
  permissions: string[];
  roles?: string[];
}

/**
 * Hook to update user permissions
 *
 * @returns Mutation function for updating user permissions
 *
 * @example
 * ```typescript
 * function PermissionEditor({ userId }) {
 *   const { mutate: updatePermissions, isPending } = useUpdateUserPermissions();
 *
 *   const handleGrant = (permission: string) => {
 *     updatePermissions({
 *       userId,
 *       permissions: [...currentPermissions, permission]
 *     }, {
 *       onSuccess: () => {
 *         toast.success('Permission granted');
 *       }
 *     });
 *   };
 *
 *   return <PermissionsList onGrant={handleGrant} />;
 * }
 * ```
 */
export function useUpdateUserPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: UpdateUserPermissionsOptions): Promise<UserPermissions> => {
      return await clientPut<UserPermissions>(
        `/api/access-control/users/${options.userId}/permissions`,
        {
          permissions: options.permissions,
          roles: options.roles,
        }
      );
    },
    onSuccess: (_data, variables) => {
      // Invalidate user permissions query
      queryClient.invalidateQueries({
        queryKey: accessControlQueryKeys.userPermissions(variables.userId),
      });

      // Invalidate all permissions list if exists
      queryClient.invalidateQueries({
        queryKey: accessControlQueryKeys.all,
      });
    },
  });
}
