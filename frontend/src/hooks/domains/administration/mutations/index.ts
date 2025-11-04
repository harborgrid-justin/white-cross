/**
 * @fileoverview Administration mutation hooks - Centralized exports
 * @module hooks/domains/administration/mutations
 * @category Hooks - Administration
 *
 * Central export point for all administration mutation hooks.
 * Provides backward compatibility with the original single-file structure.
 *
 * Mutation Categories:
 * - **User Management**: User CRUD operations
 * - **User Status**: Activation, deactivation, password reset, role assignment
 * - **Department Management**: Department CRUD and manager assignment
 * - **Settings Management**: System settings and configuration updates
 * - **Notification Management**: Notification creation, updates, and sending
 * - **Bulk Operations**: Bulk user updates and deletions
 *
 * @example
 * ```typescript
 * // Import specific hooks
 * import {
 *   useCreateUser,
 *   useUpdateUser,
 *   useDeleteUser
 * } from '@/hooks/domains/administration/mutations';
 *
 * // Import all hooks (if needed)
 * import * as adminMutations from '@/hooks/domains/administration/mutations';
 *
 * function UserManagement() {
 *   const { mutate: createUser } = useCreateUser();
 *   const { mutate: updateUser } = useUpdateUser();
 *
 *   return <UserForm onCreate={createUser} onUpdate={updateUser} />;
 * }
 * ```
 */

// ===========================================
// USER MANAGEMENT MUTATIONS
// ===========================================
export {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from './useUserAdminMutations';

// ===========================================
// USER STATUS & ROLE MUTATIONS
// ===========================================
export {
  useActivateUser,
  useDeactivateUser,
  useResetUserPassword,
  useAssignUserRoles,
} from './useUserStatusMutations';

// ===========================================
// DEPARTMENT MANAGEMENT MUTATIONS
// ===========================================
export {
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useAssignDepartmentManager,
} from './useDepartmentAdminMutations';

// ===========================================
// SETTINGS MANAGEMENT MUTATIONS
// ===========================================
export {
  useUpdateSetting,
  useCreateSetting,
  useDeleteSetting,
  useUpdateSystemConfiguration,
} from './useSettingsAdminMutations';

// ===========================================
// NOTIFICATION MANAGEMENT MUTATIONS
// ===========================================
export {
  useCreateNotification,
  useUpdateNotification,
  useSendNotification,
} from './useNotificationAdminMutations';

// ===========================================
// BULK OPERATIONS
// ===========================================
export {
  useBulkUpdateUsers,
  useBulkDeleteUsers,
} from './useBulkAdminMutations';
