/**
 * @fileoverview Role Management Hooks
 * @module hooks/domains/access-control/roles
 * @category Hooks - Access Control
 *
 * Hooks for querying and managing roles in the RBAC system.
 */

import { useQuery } from '@tanstack/react-query';
import { accessControlQueryKeys } from './query-keys';
import { clientGet } from '@/lib/api/client';

/**
 * Role data structure
 */
export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook to fetch all available roles
 *
 * @returns Query result with list of roles
 *
 * @example
 * ```typescript
 * function RoleSelector() {
 *   const { data: roles, isLoading } = useRolesList();
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <select>
 *       {roles?.map(role => (
 *         <option key={role.id} value={role.id}>
 *           {role.displayName}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useRolesList() {
  return useQuery({
    queryKey: accessControlQueryKeys.roles,
    queryFn: async (): Promise<Role[]> => {
      return await clientGet<Role[]>('/api/access-control/roles');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (roles rarely change)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch a specific role by ID
 *
 * @param roleId - The ID of the role to fetch
 * @returns Query result with role details
 *
 * @example
 * ```typescript
 * function RoleDetails({ roleId }) {
 *   const { data: role, isLoading } = useRole(roleId);
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       <h2>{role?.displayName}</h2>
 *       <p>{role?.description}</p>
 *       <h3>Permissions:</h3>
 *       <ul>
 *         {role?.permissions.map(perm => (
 *           <li key={perm}>{perm}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRole(roleId: string) {
  return useQuery({
    queryKey: accessControlQueryKeys.role(roleId),
    queryFn: async (): Promise<Role> => {
      return await clientGet<Role>(`/api/access-control/roles/${roleId}`);
    },
    enabled: !!roleId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
