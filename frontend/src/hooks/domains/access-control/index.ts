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

// Re-export all hooks from their respective modules
export { accessControlQueryKeys } from './query-keys';
export { useUserPermissions, useUpdateUserPermissions } from './permissions';
export { useRolesList } from './roles';
export { usePermissionCheck } from './permission-checks';
