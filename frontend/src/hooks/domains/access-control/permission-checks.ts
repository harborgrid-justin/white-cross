/**
 * @fileoverview Permission Check Hooks
 * @module hooks/domains/access-control/permission-checks
 * @category Hooks - Access Control
 *
 * Hooks for real-time permission checking and validation.
 */

import { useQuery } from '@tanstack/react-query';
import { accessControlQueryKeys } from './query-keys';
import { serverGet, serverPost } from '@/lib/api/nextjs-client';

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  reason?: string;
  requiredRoles?: string[];
}

/**
 * Hook to check if the current user has a specific permission
 *
 * @param permission - The permission to check (e.g., 'view_students', 'administer_medication')
 * @param options - Additional options for the permission check
 * @returns Query result with permission check status
 *
 * @example
 * ```typescript
 * function AdminPanel() {
 *   const { data: canManageUsers } = usePermissionCheck('manage_users');
 *
 *   if (!canManageUsers?.hasPermission) {
 *     return <AccessDenied />;
 *   }
 *
 *   return <UserManagementPanel />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Conditional rendering based on permissions
 * function ActionButtons() {
 *   const { data: canDelete } = usePermissionCheck('delete_records');
 *   const { data: canEdit } = usePermissionCheck('edit_records');
 *
 *   return (
 *     <div>
 *       {canEdit?.hasPermission && <EditButton />}
 *       {canDelete?.hasPermission && <DeleteButton />}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePermissionCheck(
  permission: string,
  options?: {
    resourceId?: string;
    resourceType?: string;
  }
) {
  return useQuery({
    queryKey: accessControlQueryKeys.permissionCheck(permission, options?.resourceId),
    queryFn: async (): Promise<PermissionCheckResult> => {
      const params = new URLSearchParams();
      if (options?.resourceId) params.append('resourceId', options.resourceId);
      if (options?.resourceType) params.append('resourceType', options.resourceType);

      return await serverGet<PermissionCheckResult>(
        `/api/access-control/check/${permission}?${params.toString()}`
      );
    },
    enabled: !!permission,
    staleTime: 2 * 60 * 1000, // 2 minutes (security-critical, keep fresh)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to check multiple permissions at once
 *
 * @param permissions - Array of permissions to check
 * @returns Query result with permission check results for each permission
 *
 * @example
 * ```typescript
 * function Dashboard() {
 *   const { data: checks } = useMultiplePermissionChecks([
 *     'view_dashboard',
 *     'view_reports',
 *     'manage_users'
 *   ]);
 *
 *   return (
 *     <div>
 *       {checks?.['view_dashboard']?.hasPermission && <DashboardWidget />}
 *       {checks?.['view_reports']?.hasPermission && <ReportsWidget />}
 *       {checks?.['manage_users']?.hasPermission && <UserManagementWidget />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMultiplePermissionChecks(permissions: string[]) {
  return useQuery({
    queryKey: accessControlQueryKeys.multiplePermissionChecks(permissions),
    queryFn: async (): Promise<Record<string, PermissionCheckResult>> => {
      return await serverPost<Record<string, PermissionCheckResult>>(
        '/api/access-control/check-multiple',
        { permissions }
      );
    },
    enabled: permissions.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to check if user has any of the specified permissions (OR logic)
 *
 * @param permissions - Array of permissions to check (user needs at least one)
 * @returns Query result with permission check status
 *
 * @example
 * ```typescript
 * function ContentEditor() {
 *   const { data: canEditContent } = useHasAnyPermission([
 *     'edit_own_content',
 *     'edit_all_content',
 *     'admin'
 *   ]);
 *
 *   if (!canEditContent?.hasPermission) {
 *     return <ReadOnlyView />;
 *   }
 *
 *   return <EditableView />;
 * }
 * ```
 */
export function useHasAnyPermission(permissions: string[]) {
  return useQuery({
    queryKey: accessControlQueryKeys.hasAnyPermission(permissions),
    queryFn: async (): Promise<PermissionCheckResult> => {
      return await serverPost<PermissionCheckResult>(
        '/api/access-control/has-any',
        { permissions }
      );
    },
    enabled: permissions.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to check if user has all of the specified permissions (AND logic)
 *
 * @param permissions - Array of permissions to check (user needs all of them)
 * @returns Query result with permission check status
 *
 * @example
 * ```typescript
 * function CriticalOperation() {
 *   const { data: canPerformOperation } = useHasAllPermissions([
 *     'approve_transactions',
 *     'manage_finances',
 *     'audit_access'
 *   ]);
 *
 *   if (!canPerformOperation?.hasPermission) {
 *     return <InsufficientPermissions />;
 *   }
 *
 *   return <OperationPanel />;
 * }
 * ```
 */
export function useHasAllPermissions(permissions: string[]) {
  return useQuery({
    queryKey: accessControlQueryKeys.hasAllPermissions(permissions),
    queryFn: async (): Promise<PermissionCheckResult> => {
      return await serverPost<PermissionCheckResult>(
        '/api/access-control/has-all',
        { permissions }
      );
    },
    enabled: permissions.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
