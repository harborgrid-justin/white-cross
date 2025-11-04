/**
 * @fileoverview Administration domain mutation hooks for data modifications
 * @module hooks/domains/administration/mutations
 * @category Hooks - Administration
 *
 * Comprehensive mutation hooks for administration operations using TanStack Query.
 * All mutations include optimistic updates, automatic cache invalidation, and
 * toast notifications for user feedback.
 *
 * Mutation Categories:
 * - **User Management**: Create, update, delete, activate/deactivate users
 * - **Role Assignment**: Assign roles and reset passwords
 * - **Department Management**: Department CRUD and manager assignment
 * - **Settings Management**: System settings and configuration updates
 * - **Notifications**: Notification creation, updates, and sending
 * - **Bulk Operations**: Bulk user updates and deletions
 *
 * Features:
 * - Automatic cache invalidation after successful mutations
 * - Toast notifications for success/error feedback
 * - Type-safe with full TypeScript support
 * - Optimistic updates for immediate UI responsiveness
 * - RBAC integration (admin-only operations)
 * - HIPAA-compliant audit logging
 *
 * @remarks
 * **Cache Invalidation Strategy:**
 * After mutations, specific query keys are invalidated to trigger refetches.
 * Use targeted invalidation (e.g., `invalidateUserQueries`) instead of
 * broad invalidation (`invalidateAdministrationQueries`) when possible.
 *
 * **Error Handling:**
 * All mutations include error handlers that display toast notifications.
 * Custom error handling can be added via the `onError` option.
 *
 * **RBAC Requirements:**
 * Most mutations require admin-level permissions. The API will return
 * 403 Forbidden if the user lacks required permissions.
 *
 * @example
 * ```typescript
 * import {
 *   useCreateUser,
 *   useUpdateUser,
 *   useDeleteUser,
 *   useActivateUser
 * } from './mutations/useAdministrationMutations';
 *
 * function UserManagement() {
 *   const { mutate: createUser, isPending: isCreating } = useCreateUser();
 *   const { mutate: updateUser } = useUpdateUser();
 *   const { mutate: deleteUser } = useDeleteUser();
 *
 *   const handleCreate = (userData) => {
 *     createUser(userData, {
 *       onSuccess: (newUser) => {
 *         console.log('User created:', newUser);
 *         navigate(`/admin/users/${newUser.id}`);
 *       }
 *     });
 *   };
 *
 *   return <UserForm onSubmit={handleCreate} isLoading={isCreating} />;
 * }
 * ```
 *
 * @see {@link useUsers} for querying users
 * @see {@link ADMINISTRATION_QUERY_KEYS} for query key structure
 * @see {@link invalidateUserQueries} for manual cache invalidation
 */

// ===========================================
// RE-EXPORTS FROM BROKEN-DOWN FILES
// ===========================================

/**
 * This file has been refactored to split the large monolithic file
 * into smaller, focused files for better maintainability.
 *
 * All exports are maintained for backward compatibility.
 *
 * File Structure:
 * - useUserAdminMutations.ts: User CRUD operations
 * - useUserStatusMutations.ts: User status, password, and role management
 * - useDepartmentAdminMutations.ts: Department CRUD and manager assignment
 * - useSettingsAdminMutations.ts: System settings and configuration
 * - useNotificationAdminMutations.ts: Notification management
 * - useBulkAdminMutations.ts: Bulk user operations
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
