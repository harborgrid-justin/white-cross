/**
 * @fileoverview Access Control domain hooks for RBAC and permission management
 * @module hooks/domains/access-control
 * @category Hooks - Access Control
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 *
 * Comprehensive hooks for Role-Based Access Control (RBAC) including:
 * - User permission querying and validation
 * - Role management and listing
 * - Real-time permission checks for conditional rendering
 * - Permission updates and assignments
 *
 * These hooks integrate with the administration domain to provide fine-grained
 * access control throughout the application, ensuring users can only access
 * resources and perform actions they're authorized for.
 *
 * Features:
 * - Real-time permission checking
 * - Role hierarchy support
 * - Resource-level permissions
 * - Automatic cache invalidation
 * - HIPAA-compliant audit logging
 *
 * @remarks
 * **RBAC Model:**
 * The application uses a hierarchical RBAC model where:
 * - Roles grant collections of permissions
 * - Users can have direct permission grants beyond their roles
 * - Permission checks combine role permissions and direct permissions
 *
 * **Permission Naming:**
 * Permissions follow the pattern: `action_resource` (e.g., 'view_students',
 * 'administer_medication', 'manage_users'). Use consistent naming for clarity.
 *
 * **Cache Strategy:**
 * - User permissions: 5 minute stale time
 * - Roles list: 10 minute stale time (rarely changes)
 * - Permission checks: 2 minute stale time for security freshness
 *
 * **Security Considerations:**
 * - Always verify permissions server-side as well as client-side
 * - Permission checks are for UI convenience, not security enforcement
 * - Audit all permission changes for compliance
 *
 * @example
 * ```typescript
 * import {
 *   useUserPermissions,
 *   usePermissionCheck,
 *   useRolesList,
 *   useUpdateUserPermissions
 * } from '@/hooks/domains/access-control';
 *
 * // Conditional rendering based on permissions
 * function AdminPanel({ userId }) {
 *   const { data: permissions } = useUserPermissions(userId);
 *   const { data: canManageUsers } = usePermissionCheck('manage_users');
 *
 *   if (!permissions?.includes('view_admin_panel')) {
 *     return <AccessDenied />;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Admin Panel</h1>
 *       {canManageUsers && <UserManagementSection />}
 *     </div>
 *   );
 * }
 *
 * // Permission assignment
 * function PermissionEditor({ userId }) {
 *   const { data: currentPermissions } = useUserPermissions(userId);
 *   const { mutate: updatePermissions } = useUpdateUserPermissions();
 *
 *   const handleGrantPermission = (permission) => {
 *     updatePermissions({
 *       userId,
 *       permissions: [...currentPermissions, permission]
 *     });
 *   };
 *
 *   return <PermissionCheckboxes onChange={handleGrantPermission} />;
 * }
 * ```
 *
 * @see {@link useUserPermissions} for querying user permissions
 * @see {@link usePermissionCheck} for real-time permission validation
 * @see {@link useRolesList} for available roles
 * @see {@link useUpdateUserPermissions} for permission management
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
 * Checks if the current user has a specific permission.
 *
 * Real-time permission validation hook for conditional rendering and
 * access control. Optionally supports resource-level permissions by
 * providing a specific resource ID.
 *
 * @param {string} permission - The permission to check (e.g., 'view_students', 'administer_medication')
 * @param {string} [resourceId] - Optional specific resource ID for resource-level permissions
 * @returns {UseQueryResult<boolean, Error>} Query result with permission check boolean
 *
 * @remarks
 * **Permission Check Logic:**
 * 1. Checks current user's role permissions
 * 2. Checks current user's direct permission grants
 * 3. If resourceId provided, validates resource-level access
 *
 * **Cache Behavior:**
 * - Stale time: 2 minutes (balance between freshness and performance)
 * - Shorter stale time ensures recent permission changes are reflected quickly
 *
 * **Resource-Level Permissions:**
 * When resourceId is provided, validates not just general permission but
 * access to the specific resource (e.g., specific student, specific school).
 *
 * **Query Key:**
 * `['access-control', 'check', permission, resourceId]`
 *
 * @example
 * ```typescript
 * import { usePermissionCheck } from '@/hooks/domains/access-control';
 *
 * // General permission check
 * function MedicationAdministrationButton() {
 *   const { data: canAdminister } = usePermissionCheck('administer_medication');
 *
 *   if (!canAdminister) return null;
 *
 *   return <button>Administer Medication</button>;
 * }
 *
 * // Resource-specific permission check
 * function StudentDetailsPage({ studentId }) {
 *   const { data: canViewStudent } = usePermissionCheck('view_student', studentId);
 *
 *   if (!canViewStudent) {
 *     return <AccessDenied message="You don't have permission to view this student" />;
 *   }
 *
 *   return <StudentDetails id={studentId} />;
 * }
 *
 * // Multiple permission checks
 * function AdminActions() {
 *   const { data: canManageUsers } = usePermissionCheck('manage_users');
 *   const { data: canManageRoles } = usePermissionCheck('manage_roles');
 *   const { data: canViewAuditLogs } = usePermissionCheck('view_audit_logs');
 *
 *   return (
 *     <div>
 *       {canManageUsers && <UserManagementPanel />}
 *       {canManageRoles && <RoleManagementPanel />}
 *       {canViewAuditLogs && <AuditLogViewer />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useUserPermissions} for all user permissions
 * @see {@link useRolesList} for role-based permission sets
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
