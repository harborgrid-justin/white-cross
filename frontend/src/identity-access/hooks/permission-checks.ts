/**
 * @fileoverview Permission checking and validation hooks
 * @module hooks/domains/access-control/permission-checks
 * @category Hooks - Access Control
 */

import { useQuery } from '@tanstack/react-query';
import { accessControlApi } from '@/services';
import { useApiError } from '../../shared/useApiError';
import { accessControlQueryKeys } from './query-keys';

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
