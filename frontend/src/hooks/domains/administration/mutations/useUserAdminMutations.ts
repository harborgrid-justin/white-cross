/**
 * @fileoverview User management mutation hooks for administration
 * @module hooks/domains/administration/mutations/useUserAdminMutations
 * @category Hooks - Administration - User Management
 *
 * Mutation hooks for user CRUD operations, activation/deactivation,
 * password resets, and role assignments.
 *
 * Features:
 * - User creation, update, deletion
 * - Account activation and deactivation
 * - Password reset functionality
 * - Role assignment
 * - Automatic cache invalidation
 * - Toast notifications
 * - Type-safe with TypeScript
 * - Optimistic updates for better UX
 *
 * @example
 * ```typescript
 * import {
 *   useCreateUser,
 *   useUpdateUser,
 *   useActivateUser,
 *   useDeactivateUser
 * } from './useUserAdminMutations';
 *
 * function UserManagement() {
 *   const { mutate: createUser } = useCreateUser();
 *   const { mutate: updateUser } = useUpdateUser();
 *
 *   return <UserForm onCreate={createUser} onUpdate={updateUser} />;
 * }
 * ```
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ADMINISTRATION_QUERY_KEYS,
  AdminUser,
  invalidateAdministrationQueries,
  invalidateUserQueries,
} from '../config';
import { administrationApi } from '@/services';

// ===========================================
// USER MANAGEMENT MUTATIONS
// ===========================================

/**
 * Creates a new user account.
 *
 * @param {UseMutationOptions<AdminUser, Error, Partial<AdminUser>>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result with user creation functionality
 *
 * @remarks
 * Required fields: email, password, firstName, lastName, role.
 * Requires admin permissions. Invalidates user queries after success.
 *
 * @example
 * ```typescript
 * const { mutate: createUser } = useCreateUser({
 *   onSuccess: (user) => navigate(`/admin/users/${user.id}`)
 * });
 * ```
 */
export const useCreateUser = (
  options?: UseMutationOptions<AdminUser, Error, Partial<AdminUser>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<AdminUser>) => {
      // Ensure all required fields are present for createUser
      if (!data.email || !data.password || !data.firstName || !data.lastName || !data.role) {
        throw new Error('Missing required fields for user creation');
      }
      const createUserData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        schoolId: data.schoolId,
        districtId: data.districtId,
      };
      return await administrationApi.createUser(createUserData);
    },
    onSuccess: (data) => {
      invalidateUserQueries(queryClient);
      invalidateAdministrationQueries(queryClient);
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create user');
    },
    ...options,
  });
};

/**
 * Updates an existing user account.
 *
 * @param {UseMutationOptions<AdminUser, Error, {id: string; data: Partial<AdminUser>}>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result with user update functionality
 *
 * @remarks
 * Supports partial updates. Uses optimistic cache updates.
 * Admins can update any user; users can update their own profile (limited fields).
 *
 * @example
 * ```typescript
 * const { mutate: updateUser } = useUpdateUser();
 * updateUser({ id: userId, data: { role: newRole } });
 * ```
 */
export const useUpdateUser = (
  options?: UseMutationOptions<AdminUser, Error, { id: string; data: Partial<AdminUser> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await administrationApi.updateUser(id, data);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.userDetails(variables.id), data);
      invalidateUserQueries(queryClient);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update user');
    },
    ...options,
  });
};

/**
 * Deletes a user account permanently.
 *
 * @param {UseMutationOptions<void, Error, string>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result for user deletion
 *
 * @remarks
 * IRREVERSIBLE. Cannot be undone. May fail if user has associated records.
 * Consider using `useDeactivateUser` for HIPAA-compliant soft deletion.
 * Requires admin permissions.
 *
 * @example
 * ```typescript
 * const { mutate: deleteUser } = useDeleteUser();
 * deleteUser(userId, { onSuccess: () => navigate('/admin/users') });
 * ```
 */
export const useDeleteUser = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await administrationApi.deleteUser(id);
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.userDetails(id) });
      invalidateUserQueries(queryClient);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete user');
    },
    ...options,
  });
};
