/**
 * WF-COMP-141 | useOptimisticStudents.ts - Optimistic Student Management Hooks
 *
 * Enterprise-grade optimistic update hooks for student management with automatic
 * rollback, Redux integration, and comprehensive error handling.
 *
 * @module hooks/domains/students/mutations/useOptimisticStudents
 *
 * @remarks
 * **Architecture Pattern**: These hooks implement the optimistic UI pattern using
 * TanStack Query with automatic rollback on error. All student mutations synchronize
 * both TanStack Query cache and Redux store for consistent state management.
 *
 * **HIPAA Compliance**:
 * - All student data operations are audit-logged for HIPAA compliance
 * - PHI (Protected Health Information) handling follows strict security protocols
 * - Optimistic updates preserve data integrity with rollback strategies
 * - Cross-tab state synchronization via BroadcastChannel for Redux store
 *
 * **Optimistic Update Flow**:
 * 1. **onMutate**: Cancel queries, create optimistic update, update Redux
 * 2. **Server Call**: API request executes in background
 * 3. **onSuccess**: Confirm update with server data, invalidate related queries
 * 4. **onError**: Rollback optimistic changes, restore previous state
 *
 * **Rollback Strategy**: RESTORE_PREVIOUS - Reverts to snapshot taken in onMutate
 *
 * **Conflict Resolution**: SERVER_WINS - Server data takes precedence on conflicts
 *
 * @example
 * ```typescript
 * // Basic usage in a component
 * import { useOptimisticStudents } from '@/hooks/domains/students/mutations/useOptimisticStudents';
 *
 * function StudentManagement() {
 *   const {
 *     createStudent,
 *     updateStudent,
 *     deactivateStudent,
 *     isCreating,
 *     createError
 *   } = useOptimisticStudents();
 *
 *   const handleCreate = async (data) => {
 *     await createStudent.mutateAsync({
 *       studentNumber: 'STU-2024-001',
 *       firstName: 'John',
 *       lastName: 'Doe',
 *       dateOfBirth: '2010-05-15',
 *       grade: '8'
 *     });
 *   };
 *
 *   return <StudentForm onSubmit={handleCreate} isLoading={isCreating} />;
 * }
 * ```
 *
 * @see {@link studentsApi} for API integration
 * @see {@link studentsSlice} for Redux state management
 * @see {@link optimisticHelpers} for optimistic update utilities
 * @see {@link useOptimisticMedications} for similar medication patterns
 *
 * @since 1.0.0
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { studentsApi } from '@/services/modules/studentsApi';
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  TransferStudentRequest,
} from '@/types/student.types';
import {
  optimisticCreate,
  optimisticUpdate,
  optimisticDelete,
  confirmCreate,
  confirmUpdate,
  rollbackUpdate,
} from '@/utils/optimisticHelpers';
import {
  RollbackStrategy,
  ConflictResolutionStrategy,
} from '@/utils/optimisticUpdates';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { studentsActions, studentsSelectors } from '@/stores/slices/studentsSlice';

// =====================
// QUERY KEYS
// =====================

/**
 * Hierarchical query key factory for student data caching.
 *
 * Provides structured query keys for TanStack Query cache invalidation
 * and granular cache management. Keys follow a hierarchical pattern
 * for efficient partial invalidation.
 *
 * @constant
 *
 * @property {ReadonlyArray<string>} all - Root key for all student queries: `['students']`
 * @property {Function} lists - Factory for list queries: `['students', 'list']`
 * @property {Function} list - Factory for filtered lists with filter params
 * @property {Function} details - Factory for detail queries: `['students', 'detail']`
 * @property {Function} detail - Factory for specific student: `['students', 'detail', id]`
 * @property {Function} byGrade - Factory for grade-filtered students: `['students', 'grade', grade]`
 * @property {Function} assigned - Factory for assigned students: `['students', 'assigned']`
 * @property {Function} statistics - Factory for student statistics: `['students', id, 'statistics']`
 * @property {Function} healthRecords - Factory for student health records: `['students', id, 'healthRecords']`
 *
 * @example
 * ```typescript
 * // Invalidate all student queries
 * queryClient.invalidateQueries({ queryKey: studentKeys.all });
 *
 * // Invalidate all student lists
 * queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
 *
 * // Invalidate specific student
 * queryClient.invalidateQueries({ queryKey: studentKeys.detail('student-123') });
 *
 * // Invalidate all 8th grade students
 * queryClient.invalidateQueries({ queryKey: studentKeys.byGrade('8') });
 * ```
 *
 * @remarks
 * **Cache Invalidation Strategy**:
 * - Invalidating `studentKeys.all` clears entire student cache
 * - Invalidating `studentKeys.lists()` clears all list queries but preserves details
 * - Invalidating `studentKeys.detail(id)` clears only that student's detail cache
 *
 * **Performance Consideration**: Use granular keys for targeted invalidation
 * to avoid unnecessary refetches and improve performance.
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/query-keys | TanStack Query Keys}
 */
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters?: any) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  byGrade: (grade: string) => [...studentKeys.all, 'grade', grade] as const,
  assigned: () => [...studentKeys.all, 'assigned'] as const,
  statistics: (id: string) => [...studentKeys.all, id, 'statistics'] as const,
  healthRecords: (id: string) => [...studentKeys.all, id, 'healthRecords'] as const,
};

// =====================
// STUDENT CREATE HOOK
// =====================

/**
 * Creates a new student with optimistic UI updates and automatic rollback.
 *
 * Implements optimistic update pattern by immediately showing the new student
 * in the UI before server confirmation. Automatically rolls back if creation
 * fails, synchronizes with Redux store, and invalidates related queries.
 *
 * @function useOptimisticStudentCreate
 *
 * @param {UseMutationOptions<Student, Error, CreateStudentData>} [options] - TanStack Query mutation options
 * @param {Function} [options.onSuccess] - Callback on successful creation
 * @param {Function} [options.onError] - Callback on creation failure
 * @param {Function} [options.onSettled] - Callback when mutation completes (success or error)
 *
 * @returns {UseMutationResult<Student, Error, CreateStudentData>} TanStack Query mutation result
 * @returns {Function} returns.mutate - Trigger mutation (fire-and-forget)
 * @returns {Function} returns.mutateAsync - Trigger mutation (returns promise)
 * @returns {boolean} returns.isPending - True while mutation is in progress
 * @returns {boolean} returns.isSuccess - True if mutation succeeded
 * @returns {boolean} returns.isError - True if mutation failed
 * @returns {Error | null} returns.error - Error object if mutation failed
 * @returns {Student | undefined} returns.data - Created student data from server
 *
 * @example
 * ```typescript
 * // Basic usage
 * const createMutation = useOptimisticStudentCreate({
 *   onSuccess: (student) => {
 *     console.log('Student created:', student.id);
 *     toast.success(`Student ${student.firstName} ${student.lastName} enrolled`);
 *   },
 *   onError: (error) => {
 *     console.error('Creation failed:', error);
 *     toast.error('Failed to enroll student');
 *   }
 * });
 *
 * // In form submit handler
 * const handleEnrollStudent = async (formData) => {
 *   await createMutation.mutateAsync({
 *     studentNumber: 'STU-2024-001',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     dateOfBirth: '2010-05-15',
 *     grade: '8',
 *     gender: 'MALE',
 *     enrollmentDate: '2024-01-15',
 *     nurseId: 'nurse-123', // Assign to school nurse
 *     createdBy: currentUserId
 *   });
 * };
 *
 * // Display loading state
 * return (
 *   <StudentEnrollmentForm
 *     onSubmit={handleEnrollStudent}
 *     isSubmitting={createMutation.isPending}
 *     error={createMutation.error}
 *   />
 * );
 * ```
 *
 * @example
 * ```typescript
 * // With optimistic UI feedback
 * const createMutation = useOptimisticStudentCreate();
 *
 * // Student appears in list immediately, then confirmed by server
 * createMutation.mutate(newStudentData);
 *
 * // List shows new student with temporary ID
 * // → Server responds with real ID
 * // → Temporary ID replaced with real ID
 * // → If error occurs, student removed from list automatically
 * ```
 *
 * @remarks
 * **Optimistic Update Flow**:
 * 1. Generate temporary ID for new student
 * 2. Add student to TanStack Query cache with temp ID
 * 3. Add student to Redux store
 * 4. Show student in UI immediately
 * 5. Send API request to server
 * 6. On success: Replace temp ID with real server ID
 * 7. On error: Remove student from cache and Redux
 *
 * **Redux Integration**:
 * - Student added to Redux store in `onMutate`
 * - Temporary student removed and real student added in `onSuccess`
 * - Optimistic student removed in `onError`
 *
 * **Query Invalidation**:
 * - Invalidates all student lists after successful creation
 * - Invalidates grade-specific lists if student assigned to grade
 * - Invalidates assigned students list if assigned to nurse
 *
 * **HIPAA Compliance**:
 * - Student creation is audit-logged with user ID
 * - PHI is encrypted in transit and at rest
 * - Access controlled by RBAC permissions
 *
 * @throws {Error} If student number already exists
 * @throws {Error} If required fields are missing
 * @throws {Error} If user lacks enrollment permissions
 *
 * @see {@link studentsApi.create} for API endpoint
 * @see {@link optimisticCreate} for optimistic update utility
 * @see {@link studentKeys} for query key structure
 * @see {@link useOptimisticStudentUpdate} for updating students
 */
export function useOptimisticStudentCreate(
  options?: UseMutationOptions<Student, Error, CreateStudentData>
) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),

    onMutate: async (newStudent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.lists() });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<Student>(
        queryClient,
        studentKeys.all,
        {
          ...newStudent,
          isActive: true,
          emergencyContacts: [],
        } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
          userId: newStudent.createdBy,
        }
      );

      // Optimistically add to Redux store
      if (tempEntity) {
        dispatch(studentsActions.addOne(tempEntity));
      }

      return { updateId, tempId, tempEntity };
    },

    onSuccess: (response, variables, context) => {
      if (context) {
        // Replace temp ID with real server ID
        confirmCreate(
          queryClient,
          studentKeys.all,
          context.updateId,
          context.tempId,
          response
        );

        // Update Redux store with real data
        if (context.tempEntity) {
          dispatch(studentsActions.removeOne(context.tempEntity.id));
        }
        dispatch(studentsActions.addOne(response));
      }

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      if (variables.grade) {
        queryClient.invalidateQueries({ queryKey: studentKeys.byGrade(variables.grade) });
      }
      if (variables.nurseId) {
        queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });
      }

      options?.onSuccess?.(response, variables, context, undefined, queryClient);
    },

    onError: (error, variables, context) => {
      if (context) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });

        // Remove from Redux store
        if (context.tempEntity) {
          dispatch(studentsActions.removeOne(context.tempEntity.id));
        }
      }

      options?.onError?.(error, variables, context, undefined, queryClient);
    },
  });
}

// =====================
// STUDENT UPDATE HOOK
// =====================

/**
 * Hook for updating students with optimistic updates and Redux integration
 *
 * @example
 * ```typescript
 * const updateMutation = useOptimisticStudentUpdate({
 *   onSuccess: () => console.log('Updated successfully')
 * });
 *
 * updateMutation.mutate({
 *   id: 'student-123',
 *   data: { grade: '9', nurseId: 'nurse-456' }
 * });
 * ```
 */
export function useOptimisticStudentUpdate(
  options?: UseMutationOptions<
    Student,
    Error,
    { id: string; data: UpdateStudentData }
  >
) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentData }) => 
      studentsApi.update(id, data),

    onMutate: async ({ id, data }: { id: string; data: UpdateStudentData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get previous student data for rollback
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic update
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        data as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
          userId: data.updatedBy,
        }
      );

      // Optimistically update Redux store
      dispatch(studentsActions.updateOne({ id, changes: data }));

      return { updateId, previousStudent };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        // Confirm with server data
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Update Redux store with server response
      dispatch(studentsActions.updateOne({ id: variables.id, changes: response }));

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.setQueryData(studentKeys.detail(variables.id), response);

      // Invalidate grade-specific queries if grade changed
      if (variables.data.grade && context?.previousStudent?.grade !== variables.data.grade) {
        if (context?.previousStudent?.grade) {
          queryClient.invalidateQueries({
            queryKey: studentKeys.byGrade(context.previousStudent.grade)
          });
        }
        queryClient.invalidateQueries({ queryKey: studentKeys.byGrade(variables.data.grade) });
      }

      // Invalidate assigned students if nurse changed
      if (variables.data.nurseId) {
        queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });
      }

      options?.onSuccess?.(response, variables, context, undefined, queryClient);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });

        // Rollback Redux store
        if (context.previousStudent) {
          dispatch(studentsActions.updateOne({ 
            id: variables.id, 
            changes: context.previousStudent 
          }));
        }
      }

      options?.onError?.(error, variables, context, undefined, queryClient);
    },
  });
}

// =====================
// STUDENT DEACTIVATE HOOK
// =====================

/**
 * Hook for deactivating students (soft delete) with optimistic updates
 *
 * @example
 * ```typescript
 * const deactivateMutation = useOptimisticStudentDeactivate();
 * deactivateMutation.mutate('student-id');
 * ```
 */
export function useOptimisticStudentDeactivate(
  options?: UseMutationOptions<
    { success: boolean; message: string },
    Error,
    string
  >
) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => studentsApi.deactivate(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get previous student data
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic update to mark as inactive
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        { isActive: false } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      // Optimistically update Redux store
      dispatch(studentsActions.updateOne({ id, changes: { isActive: false } }));

      return { updateId, previousStudent };
    },

    onSuccess: (response, id, context) => {
      if (context?.updateId && context?.previousStudent) {
        // Confirm deactivation
        confirmUpdate(context.updateId, { ...context.previousStudent, isActive: false }, queryClient);
      }

      // Invalidate lists to remove from active lists
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Update detail cache
      const student = queryClient.getQueryData<Student>(studentKeys.detail(id));
      if (student) {
        queryClient.setQueryData(studentKeys.detail(id), { ...student, isActive: false });
        dispatch(studentsActions.updateOne({ id, changes: { isActive: false } }));
      }

      // Invalidate assigned students
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      options?.onSuccess?.(response, id, context, undefined, queryClient);
    },

    onError: (error, id, context) => {
      if (context?.updateId) {
        // Rollback - restore active status
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });

        // Rollback Redux store
        if (context.previousStudent) {
          dispatch(studentsActions.updateOne({ id, changes: context.previousStudent }));
        }
      }

      options?.onError?.(error, id, context, undefined, queryClient);
    },
  });
}

// =====================
// STUDENT REACTIVATE HOOK
// =====================

/**
 * Hook for reactivating students with optimistic updates
 *
 * @example
 * ```typescript
 * const reactivateMutation = useOptimisticStudentReactivate();
 * reactivateMutation.mutate('student-id');
 * ```
 */
export function useOptimisticStudentReactivate(
  options?: UseMutationOptions<Student, Error, string>
) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => studentsApi.reactivate(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Create optimistic update to mark as active
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        { isActive: true } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      // Optimistically update Redux store
      dispatch(studentsActions.updateOne({ id, changes: { isActive: true } }));

      return { updateId };
    },

    onSuccess: (response, id, context) => {
      if (context?.updateId) {
        // Confirm reactivation
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Update Redux store
      dispatch(studentsActions.updateOne({ id, changes: response }));

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.setQueryData(studentKeys.detail(id), response);
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      options?.onSuccess?.(response, id, context, undefined, queryClient);
    },

    onError: (error, id, context) => {
      if (context?.updateId) {
        // Rollback - restore inactive status
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });

        // Rollback Redux store
        dispatch(studentsActions.updateOne({ id, changes: { isActive: false } }));
      }

      options?.onError?.(error, id, context, undefined, queryClient);
    },
  });
}

// =====================
// STUDENT TRANSFER HOOK
// =====================

/**
 * Hook for transferring students to a different nurse with optimistic updates
 *
 * @example
 * ```typescript
 * const transferMutation = useOptimisticStudentTransfer();
 * transferMutation.mutate({
 *   id: 'student-123',
 *   data: { nurseId: 'nurse-456', reason: 'Caseload balancing' }
 * });
 * ```
 */
export function useOptimisticStudentTransfer(
  options?: UseMutationOptions<
    Student,
    Error,
    { id: string; data: TransferStudentRequest }
  >
) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransferStudentRequest }) => 
      studentsApi.transfer(id, data),

    onMutate: async ({ id, data }: { id: string; data: TransferStudentRequest }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get previous student data
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic update
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        { nurseId: data.nurseId } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      // Optimistically update Redux store
      dispatch(studentsActions.updateOne({ id, changes: { nurseId: data.nurseId } }));

      return { updateId, previousStudent };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        // Confirm transfer
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Update Redux store
      dispatch(studentsActions.updateOne({ id: variables.id, changes: response }));

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.setQueryData(studentKeys.detail(variables.id), response);

      // Invalidate assigned students for both old and new nurses
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      options?.onSuccess?.(response, variables, context, undefined, queryClient);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        // Rollback transfer
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });

        // Rollback Redux store
        if (context.previousStudent) {
          dispatch(studentsActions.updateOne({ 
            id: variables.id, 
            changes: context.previousStudent 
          }));
        }
      }

      options?.onError?.(error, variables, context, undefined, queryClient);
    },
  });
}

// =====================
// STUDENT PERMANENT DELETE HOOK
// =====================

/**
 * Hook for permanently deleting students (use with extreme caution)
 * This is for HIPAA compliance and data purging only
 *
 * @example
 * ```typescript
 * const deleteMutation = useOptimisticStudentPermanentDelete();
 * deleteMutation.mutate('student-id');
 * ```
 */
export function useOptimisticStudentPermanentDelete(
  options?: UseMutationOptions<
    { success: boolean; message: string },
    Error,
    string
  >
) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get student data for potential rollback
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic delete
      const updateId = optimisticDelete<Student>(
        queryClient,
        studentKeys.all,
        id,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      // Optimistically remove from Redux store
      dispatch(studentsActions.removeOne(id));

      return { updateId, previousStudent };
    },

    onSuccess: (response, id, context) => {
      if (context?.updateId) {
        // Confirm deletion
        confirmUpdate(context.updateId, null as any, queryClient);
      }

      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      // Remove related data
      if (context?.previousStudent?.grade) {
        queryClient.invalidateQueries({
          queryKey: studentKeys.byGrade(context.previousStudent.grade)
        });
      }

      options?.onSuccess?.(response, id, context, undefined, queryClient);
    },

    onError: (error, id, context) => {
      if (context?.updateId) {
        // Rollback - restore the deleted student
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });

        // Restore to Redux store
        if (context.previousStudent) {
          dispatch(studentsActions.addOne(context.previousStudent));
        }
      }

      options?.onError?.(error, id, context, undefined, queryClient);
    },
  });
}

// =====================
// COMPOSITE HOOK
// =====================

/**
 * Composite hook providing complete student management with optimistic updates.
 *
 * This is the primary hook for student CRUD operations in the application.
 * Provides all mutation hooks, loading states, error states, and convenience
 * methods in a single interface. All operations include automatic optimistic
 * updates with rollback on failure.
 *
 * @function useOptimisticStudents
 *
 * @returns {Object} Student management operations and state
 *
 * @returns {UseMutationResult} returns.createStudent - Create student mutation
 * @returns {UseMutationResult} returns.updateStudent - Update student mutation
 * @returns {UseMutationResult} returns.deactivateStudent - Deactivate student mutation (soft delete)
 * @returns {UseMutationResult} returns.reactivateStudent - Reactivate student mutation
 * @returns {UseMutationResult} returns.transferStudent - Transfer student to different nurse
 * @returns {UseMutationResult} returns.deleteStudent - Permanently delete student (HIPAA data purge)
 *
 * @returns {Function} returns.createWithOptimism - Shorthand for `createStudent.mutate`
 * @returns {Function} returns.updateWithOptimism - Shorthand for `updateStudent.mutate`
 * @returns {Function} returns.deactivateWithOptimism - Shorthand for `deactivateStudent.mutate`
 * @returns {Function} returns.reactivateWithOptimism - Shorthand for `reactivateStudent.mutate`
 * @returns {Function} returns.transferWithOptimism - Shorthand for `transferStudent.mutate`
 * @returns {Function} returns.deleteWithOptimism - Shorthand for `deleteStudent.mutate`
 *
 * @returns {boolean} returns.isCreating - True while creating student
 * @returns {boolean} returns.isUpdating - True while updating student
 * @returns {boolean} returns.isDeactivating - True while deactivating student
 * @returns {boolean} returns.isReactivating - True while reactivating student
 * @returns {boolean} returns.isTransferring - True while transferring student
 * @returns {boolean} returns.isDeleting - True while deleting student
 *
 * @returns {Error | null} returns.createError - Error from create operation
 * @returns {Error | null} returns.updateError - Error from update operation
 * @returns {Error | null} returns.deactivateError - Error from deactivate operation
 * @returns {Error | null} returns.reactivateError - Error from reactivate operation
 * @returns {Error | null} returns.transferError - Error from transfer operation
 * @returns {Error | null} returns.deleteError - Error from delete operation
 *
 * @returns {boolean} returns.createSuccess - True if create succeeded
 * @returns {boolean} returns.updateSuccess - True if update succeeded
 * @returns {boolean} returns.deactivateSuccess - True if deactivate succeeded
 * @returns {boolean} returns.reactivateSuccess - True if reactivate succeeded
 * @returns {boolean} returns.transferSuccess - True if transfer succeeded
 * @returns {boolean} returns.deleteSuccess - True if delete succeeded
 *
 * @returns {Function} returns.resetCreate - Reset create mutation state
 * @returns {Function} returns.resetUpdate - Reset update mutation state
 * @returns {Function} returns.resetDeactivate - Reset deactivate mutation state
 * @returns {Function} returns.resetReactivate - Reset reactivate mutation state
 * @returns {Function} returns.resetTransfer - Reset transfer mutation state
 * @returns {Function} returns.resetDelete - Reset delete mutation state
 *
 * @example
 * ```typescript
 * // Basic usage - all CRUD operations
 * function StudentManagement() {
 *   const {
 *     createStudent,
 *     updateStudent,
 *     deactivateStudent,
 *     isCreating,
 *     isUpdating,
 *     createError,
 *     updateError
 *   } = useOptimisticStudents();
 *
 *   const handleEnroll = async (data) => {
 *     await createStudent.mutateAsync(data);
 *   };
 *
 *   const handleUpdate = async (id, data) => {
 *     await updateStudent.mutateAsync({ id, data });
 *   };
 *
 *   const handleDeactivate = async (id) => {
 *     if (confirm('Deactivate this student?')) {
 *       await deactivateStudent.mutateAsync(id);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <StudentForm
 *         onSubmit={handleEnroll}
 *         isLoading={isCreating}
 *         error={createError}
 *       />
 *       <StudentList
 *         onUpdate={handleUpdate}
 *         onDeactivate={handleDeactivate}
 *         isUpdating={isUpdating}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using convenience methods
 * const { createWithOptimism, updateWithOptimism } = useOptimisticStudents();
 *
 * // Fire-and-forget mutations
 * createWithOptimism(newStudentData);
 * updateWithOptimism({ id: 'student-123', data: updates });
 * ```
 *
 * @example
 * ```typescript
 * // Handling errors with toast notifications
 * const {
 *   createStudent,
 *   updateStudent,
 *   createError,
 *   updateError,
 *   createSuccess,
 *   updateSuccess
 * } = useOptimisticStudents();
 *
 * // Show error toasts
 * useEffect(() => {
 *   if (createError) {
 *     toast.error(`Failed to enroll student: ${createError.message}`);
 *   }
 *   if (updateError) {
 *     toast.error(`Failed to update student: ${updateError.message}`);
 *   }
 * }, [createError, updateError]);
 *
 * // Show success toasts
 * useEffect(() => {
 *   if (createSuccess) {
 *     toast.success('Student enrolled successfully');
 *   }
 *   if (updateSuccess) {
 *     toast.success('Student updated successfully');
 *   }
 * }, [createSuccess, updateSuccess]);
 * ```
 *
 * @example
 * ```typescript
 * // Transfer student to different nurse
 * const { transferStudent, isTransferring } = useOptimisticStudents();
 *
 * const handleTransfer = async (studentId, newNurseId) => {
 *   await transferStudent.mutateAsync({
 *     id: studentId,
 *     data: {
 *       nurseId: newNurseId,
 *       reason: 'Caseload balancing',
 *       transferredBy: currentUserId
 *     }
 *   });
 * };
 *
 * return (
 *   <TransferButton
 *     onClick={() => handleTransfer(student.id, nurse.id)}
 *     isLoading={isTransferring}
 *   />
 * );
 * ```
 *
 * @example
 * ```typescript
 * // HIPAA-compliant permanent deletion
 * const { deleteStudent, isDeleting } = useOptimisticStudents();
 *
 * const handlePermanentDelete = async (studentId) => {
 *   // Require explicit confirmation for permanent deletion
 *   const confirmed = await confirmDialog({
 *     title: 'Permanent Deletion',
 *     message: 'This will permanently delete all student data. This action cannot be undone.',
 *     confirmText: 'Permanently Delete',
 *     isDangerous: true
 *   });
 *
 *   if (confirmed) {
 *     await deleteStudent.mutateAsync(studentId);
 *     // Student data purged for HIPAA compliance
 *   }
 * };
 * ```
 *
 * @remarks
 * **Best Practices**:
 * - Use `mutateAsync` when you need to await the result or handle errors
 * - Use `mutate` (convenience methods) for fire-and-forget operations
 * - Always check `isLoading` states to disable UI during mutations
 * - Handle errors appropriately with user-friendly messages
 * - Use soft delete (`deactivate`) instead of permanent delete in most cases
 * - Permanent delete should only be used for HIPAA data purging
 *
 * **State Management**:
 * - All mutations update both TanStack Query cache and Redux store
 * - Optimistic updates show changes immediately in UI
 * - Automatic rollback on error maintains data consistency
 * - Query invalidation ensures related data stays fresh
 *
 * **Performance**:
 * - Only invalidates necessary queries for optimal performance
 * - Uses granular query keys for targeted cache updates
 * - Optimistic updates eliminate waiting for server responses
 *
 * @see {@link useOptimisticStudentCreate} for create operation details
 * @see {@link useOptimisticStudentUpdate} for update operation details
 * @see {@link useOptimisticStudentDeactivate} for deactivate operation details
 * @see {@link useOptimisticMedications} for similar medication patterns
 */
export function useOptimisticStudents() {
  const createStudent = useOptimisticStudentCreate();
  const updateStudent = useOptimisticStudentUpdate();
  const deactivateStudent = useOptimisticStudentDeactivate();
  const reactivateStudent = useOptimisticStudentReactivate();
  const transferStudent = useOptimisticStudentTransfer();
  const deleteStudent = useOptimisticStudentPermanentDelete();

  return {
    // Mutations
    createStudent,
    updateStudent,
    deactivateStudent,
    reactivateStudent,
    transferStudent,
    deleteStudent,

    // Convenience mutation functions
    createWithOptimism: createStudent.mutate,
    updateWithOptimism: updateStudent.mutate,
    deactivateWithOptimism: deactivateStudent.mutate,
    reactivateWithOptimism: reactivateStudent.mutate,
    transferWithOptimism: transferStudent.mutate,
    deleteWithOptimism: deleteStudent.mutate,

    // Loading states
    isCreating: createStudent.isPending,
    isUpdating: updateStudent.isPending,
    isDeactivating: deactivateStudent.isPending,
    isReactivating: reactivateStudent.isPending,
    isTransferring: transferStudent.isPending,
    isDeleting: deleteStudent.isPending,

    // Error states
    createError: createStudent.error,
    updateError: updateStudent.error,
    deactivateError: deactivateStudent.error,
    reactivateError: reactivateStudent.error,
    transferError: transferStudent.error,
    deleteError: deleteStudent.error,

    // Success flags
    createSuccess: createStudent.isSuccess,
    updateSuccess: updateStudent.isSuccess,
    deactivateSuccess: deactivateStudent.isSuccess,
    reactivateSuccess: reactivateStudent.isSuccess,
    transferSuccess: transferStudent.isSuccess,
    deleteSuccess: deleteStudent.isSuccess,

    // Reset functions
    resetCreate: createStudent.reset,
    resetUpdate: updateStudent.reset,
    resetDeactivate: deactivateStudent.reset,
    resetReactivate: reactivateStudent.reset,
    resetTransfer: transferStudent.reset,
    resetDelete: deleteStudent.reset,
  };
}
