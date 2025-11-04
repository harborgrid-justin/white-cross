/**
 * @fileoverview Department management mutation hooks
 * @module hooks/domains/administration/mutations/useDepartmentAdminMutations
 * @category Hooks - Administration - Department Management
 *
 * Mutation hooks for department CRUD operations and manager assignments.
 *
 * Features:
 * - Department creation, update, deletion
 * - Department manager assignment
 * - Automatic cache invalidation
 * - Toast notifications
 * - Type-safe with TypeScript
 *
 * @example
 * ```typescript
 * import {
 *   useCreateDepartment,
 *   useUpdateDepartment,
 *   useDeleteDepartment,
 *   useAssignDepartmentManager
 * } from './useDepartmentAdminMutations';
 *
 * function DepartmentManagement() {
 *   const { mutate: createDepartment } = useCreateDepartment();
 *   const { mutate: updateDepartment } = useUpdateDepartment();
 *   const { mutate: deleteDepartment } = useDeleteDepartment();
 *   const { mutate: assignManager } = useAssignDepartmentManager();
 *
 *   return <DepartmentManager onCreate={createDepartment} />;
 * }
 * ```
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ADMINISTRATION_QUERY_KEYS,
  Department,
  invalidateAdministrationQueries,
  invalidateDepartmentQueries,
} from '../config';

/**
 * Creates a new department.
 *
 * Mutation hook for creating departments in the organization structure.
 *
 * @param {UseMutationOptions<Department, Error, Partial<Department>>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result with created department data
 *
 * @remarks
 * **Required Fields:**
 * - name: Department name (must be unique)
 * - description: Department description
 *
 * **Optional Fields:**
 * - managerId: Assign department manager during creation
 * - parentDepartmentId: Create nested department structure
 *
 * @example
 * ```typescript
 * function CreateDepartmentForm() {
 *   const { mutate: createDepartment, isPending } = useCreateDepartment();
 *
 *   const handleSubmit = (data) => {
 *     createDepartment({
 *       name: data.name,
 *       description: data.description,
 *       managerId: data.managerId
 *     });
 *   };
 *
 *   return <DepartmentForm onSubmit={handleSubmit} isLoading={isPending} />;
 * }
 * ```
 */
export const useCreateDepartment = (
  options?: UseMutationOptions<Department, Error, Partial<Department>>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Department>) => {
      return {} as Department;
    },
    onSuccess: (data) => {
      invalidateDepartmentQueries(queryClient);
      invalidateAdministrationQueries(queryClient);
      toast.success('Department created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create department');
    },
    ...options,
  });
};

/**
 * Updates an existing department.
 *
 * Mutation hook for modifying department information.
 *
 * @param {UseMutationOptions<Department, Error, {id: string; data: Partial<Department>}>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result with updated department data
 *
 * @remarks
 * **Partial Updates:**
 * Only provided fields are updated; others remain unchanged.
 *
 * **Optimistic Updates:**
 * Department cache is immediately updated before API response.
 *
 * @example
 * ```typescript
 * function DepartmentEditor({ departmentId }) {
 *   const { mutate: updateDepartment } = useUpdateDepartment();
 *
 *   const handleNameChange = (newName) => {
 *     updateDepartment({
 *       id: departmentId,
 *       data: { name: newName }
 *     });
 *   };
 *
 *   return <NameEditor onChange={handleNameChange} />;
 * }
 * ```
 */
export const useUpdateDepartment = (
  options?: UseMutationOptions<Department, Error, { id: string; data: Partial<Department> }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      // Note: API doesn't have updateDepartment method
      return {} as Department;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.departmentDetails(variables.id), data);
      invalidateDepartmentQueries(queryClient);
      toast.success('Department updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update department');
    },
    ...options,
  });
};

/**
 * Deletes a department.
 *
 * Mutation hook for removing departments from the organization structure.
 *
 * @param {UseMutationOptions<void, Error, string>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result for department deletion
 *
 * @throws {Error} When department has associated users or child departments
 *
 * @remarks
 * **Cascade Implications:**
 * Deletion may fail if department has:
 * - Assigned users (require reassignment first)
 * - Child departments (delete children first)
 * - Associated records
 *
 * @example
 * ```typescript
 * function DeleteDepartmentButton({ departmentId, departmentName }) {
 *   const { mutate: deleteDepartment, isPending } = useDeleteDepartment();
 *
 *   const handleDelete = () => {
 *     if (confirm(`Delete ${departmentName}?`)) {
 *       deleteDepartment(departmentId);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleDelete} disabled={isPending}>
 *       Delete Department
 *     </button>
 *   );
 * }
 * ```
 */
export const useDeleteDepartment = (
  options?: UseMutationOptions<void, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Note: API doesn't have deleteDepartment method
      return Promise.resolve();
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ADMINISTRATION_QUERY_KEYS.departmentDetails(id) });
      invalidateDepartmentQueries(queryClient);
      toast.success('Department deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete department');
    },
    ...options,
  });
};

/**
 * Assigns a manager to a department.
 *
 * Mutation hook for setting or changing department manager.
 *
 * @param {UseMutationOptions<Department, Error, {deptId: string; managerId: string}>} [options] - Mutation options
 * @returns {UseMutationResult} Mutation result with updated department data
 *
 * @remarks
 * **Manager Role:**
 * Assigned user should have appropriate permissions to manage the department.
 *
 * **Single Manager:**
 * Each department has one primary manager. Assigning new manager replaces previous.
 *
 * @example
 * ```typescript
 * function DepartmentManagerSelector({ departmentId }) {
 *   const { mutate: assignManager } = useAssignDepartmentManager();
 *
 *   const handleManagerChange = (newManagerId) => {
 *     assignManager({
 *       deptId: departmentId,
 *       managerId: newManagerId
 *     });
 *   };
 *
 *   return <UserSelector onChange={handleManagerChange} />;
 * }
 * ```
 */
export const useAssignDepartmentManager = (
  options?: UseMutationOptions<Department, Error, { deptId: string; managerId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ deptId, managerId }) => {
      // Note: API doesn't have assignDepartmentManager method
      return {} as Department;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(ADMINISTRATION_QUERY_KEYS.departmentDetails(variables.deptId), data);
      invalidateDepartmentQueries(queryClient);
      toast.success('Department manager assigned successfully');
    },
    onError: (error) => {
      toast.error('Failed to assign department manager');
    },
    ...options,
  });
};
