/**
 * @fileoverview Role management hooks
 * @module hooks/domains/access-control/roles
 * @category Hooks - Access Control
 */

import { useQuery } from '@tanstack/react-query';
import { accessControlApi } from '@/services';
import { useApiError } from '../shared/useApiError';
import { accessControlQueryKeys } from './query-keys';

/**
 * Fetches all available roles in the system.
 *
 * Query hook that retrieves the complete list of roles, including both
 * system-defined and custom roles. Used for role assignment interfaces
 * and role management.
 *
 * @param {UseQueryOptions} [options] - TanStack Query options for customization
 * @returns {UseQueryResult<Role[], Error>} Query result with array of role objects
 *
 * @remarks
 * **Role Types:**
 * - System roles: Predefined, cannot be deleted (e.g., ADMIN, NURSE, TEACHER)
 * - Custom roles: Organization-specific, can be modified
 *
 * **Cache Behavior:**
 * - Stale time: 10 minutes (roles rarely change)
 * - Long cache time appropriate for relatively stable data
 *
 * **Query Key:**
 * `['access-control', 'roles']`
 *
 * @example
 * ```typescript
 * import { useRolesList } from '@/hooks/domains/access-control';
 *
 * function RoleSelector({ onSelect }) {
 *   const { data: roles, isLoading } = useRolesList();
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <select onChange={(e) => onSelect(e.target.value)}>
 *       <option value="">Select a role...</option>
 *       {roles?.map(role => (
 *         <option key={role.id} value={role.id}>
 *           {role.name} - {role.description}
 *           {role.isSystem && ' (System Role)'}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 *
 * @see {@link useUserPermissions} for user-specific permissions
 * @see {@link UserRole} for role structure
 */
export function useRolesList(options?: Record<string, unknown>) {
  const { handleError } = useApiError();

  return useQuery({
    queryKey: accessControlQueryKeys.roles.all(),
    queryFn: async () => {
      try {
        // TODO: Use correct method name from accessControlApi
        // return await accessControlApi.getAllRoles();
        return await accessControlApi.getRoles();
      } catch (error: unknown) {
        throw handleError(error, 'fetch_roles');
      }
    },
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}
