/**
 * @fileoverview User permissions query hooks
 * @module hooks/domains/access-control/permissions
 * @category Hooks - Access Control
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accessControlApi } from '@/services';
import { useApiError } from '../../shared/useApiError';
import toast from 'react-hot-toast';
import { accessControlQueryKeys } from './query-keys';

/**
 * Fetches all permissions for a specific user.
 *
 * Query hook that retrieves the complete set of permissions for a user,
 * including both role-based permissions and direct permission grants.
 * Used for permission-based conditional rendering and access control.
 *
 * @param {string} userId - The unique identifier of the user
 * @param {UseQueryOptions} [options] - TanStack Query options for customization
 * @returns {UseQueryResult<string[], Error>} Query result with array of permission strings
 *
 * @throws {Error} When user ID doesn't exist or API request fails
 *
 * @remarks
 * **Permission Sources:**
 * Returns combined permissions from:
 * - Role-based permissions (from assigned roles)
 * - Direct permission grants (individual permissions)
 *
 * **Cache Behavior:**
 * - Stale time: 5 minutes
 * - Enabled only when userId is provided
 * - Automatically refetches on window focus
 *
 * **Query Key:**
 * `['access-control', 'permissions', 'user', userId]`
 *
 * @example
 * ```typescript
 * import { useUserPermissions } from '@/hooks/domains/access-control';
 *
 * function UserCapabilities({ userId }) {
 *   const { data: permissions, isLoading, error } = useUserPermissions(userId);
 *
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error message="Failed to load permissions" />;
 *
 *   const canAdministerMeds = permissions?.includes('administer_medication');
 *   const canViewHealthRecords = permissions?.includes('view_health_records');
 *
 *   return (
 *     <div>
 *       <h3>User Capabilities</h3>
 *       <ul>
 *         <li>Administer Medications: {canAdministerMeds ? 'Yes' : 'No'}</li>
 *         <li>View Health Records: {canViewHealthRecords ? 'Yes' : 'No'}</li>
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link usePermissionCheck} for checking specific permissions
 * @see {@link useRolesList} for available roles and their permissions
 * @see {@link useUpdateUserPermissions} for modifying permissions
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
 * Updates permissions for a specific user.
 *
 * Mutation hook for modifying a user's permission set. Replaces the entire
 * permission array with the provided list. For adding/removing single
 * permissions, fetch current permissions first and modify the array.
 *
 * @returns {UseMutationResult} Mutation result for updating permissions
 *
 * @remarks
 * **Permission Replacement:**
 * This mutation replaces the entire permission set. To add a single permission,
 * you must include all existing permissions plus the new one.
 *
 * **Cache Invalidation:**
 * Automatically invalidates the user's permission queries after successful update,
 * ensuring UI reflects new permissions immediately.
 *
 * **Audit Logging:**
 * Permission changes are logged for HIPAA compliance and security monitoring.
 * Includes before/after states in audit trail.
 *
 * **RBAC Requirements:**
 * Requires 'manage_permissions' or admin role. Users cannot modify their own
 * permissions (except admins in some configurations).
 *
 * @example
 * ```typescript
 * import { useUpdateUserPermissions, useUserPermissions } from '@/hooks/domains/access-control';
 *
 * function PermissionManager({ userId }) {
 *   const { data: currentPermissions = [] } = useUserPermissions(userId);
 *   const { mutate: updatePermissions, isPending } = useUpdateUserPermissions();
 *
 *   const handleAddPermission = (newPermission) => {
 *     // Add to existing permissions
 *     updatePermissions({
 *       userId,
 *       permissions: [...currentPermissions, newPermission]
 *     });
 *   };
 *
 *   const handleRemovePermission = (permissionToRemove) => {
 *     // Remove from existing permissions
 *     updatePermissions({
 *       userId,
 *       permissions: currentPermissions.filter(p => p !== permissionToRemove)
 *     });
 *   };
 *
 *   const handleGrantMedicationPermissions = () => {
 *     // Grant multiple related permissions
 *     const medicationPermissions = [
 *       'administer_medication',
 *       'view_medication_logs',
 *       'manage_medication_inventory'
 *     ];
 *     updatePermissions({
 *       userId,
 *       permissions: [...new Set([...currentPermissions, ...medicationPermissions])]
 *     }, {
 *       onSuccess: () => {
 *         toast.success('Medication permissions granted successfully');
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <h3>Permission Management</h3>
 *       <PermissionChecklist
 *         current={currentPermissions}
 *         onAdd={handleAddPermission}
 *         onRemove={handleRemovePermission}
 *         disabled={isPending}
 *       />
 *       <button onClick={handleGrantMedicationPermissions} disabled={isPending}>
 *         Grant All Medication Permissions
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useUserPermissions} for querying current permissions
 * @see {@link usePermissionCheck} for validating specific permissions
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
