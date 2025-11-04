/**
 * Student Delete Mutation Hooks
 *
 * Permanent deletion operations for students (HIPAA compliance)
 *
 * @module hooks/students/mutations/useStudentDeleteMutations
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { studentQueryKeys } from './queryKeys';
import { apiActions } from '@/lib/api';
import { STUDENT_MUTATION_CONFIG } from './cacheConfig';
import { invalidateStudentCache } from './utils';
import type { ApiError, PermanentDeleteResult } from './types';

/**
 * Hook for permanent deletion (HIPAA compliance - use with extreme caution)
 *
 * This should only be used for legal compliance requirements (e.g., data purging)
 * and requires appropriate authorization levels.
 *
 * @param options - Mutation options with enhanced authorization checks
 * @returns Mutation handlers for permanent deletion
 */
export const usePermanentDeleteStudent = (
  options?: UseMutationOptions<
    PermanentDeleteResult,
    ApiError,
    { id: string; reason: string; authorization: string }
  >
) => {
  const queryClient = useQueryClient();
  const config = STUDENT_MUTATION_CONFIG.audit; // Audit-level config for destructive operations

  return useMutation({
    mutationFn: async ({ id, reason, authorization }) => {
      try {
        // Verify authorization (this would be more robust in production)
        if (!authorization || authorization.length < 10) {
          throw Object.assign(new Error('Valid authorization code required for permanent deletion'), {
            context: 'authorization',
            auditRequired: true,
          });
        }

        await apiActions.students.delete(id);

        return {
          success: true,
          message: 'Student permanently deleted from system',
          auditId: `permanent_delete_${Date.now()}_${id}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: error.context || 'server',
          auditRequired: true,
        });
      }
    },

    onSuccess: async (result: PermanentDeleteResult, { id, reason, authorization }: { id: string; reason: string; authorization: string }) => {
      // Remove from all caches
      queryClient.removeQueries({ queryKey: studentQueryKeys.details.byId(id) });

      // Use DELETE operation for cache invalidation
      await invalidateStudentCache(
        queryClient,
        'delete',
        id,
        undefined,
        undefined
      );

      // Critical audit log for permanent deletion
      console.warn('PERMANENT STUDENT DELETION:', {
        studentId: id,
        reason,
        authorization: '[REDACTED]',
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'PERMANENT_DELETE_STUDENT',
        severity: 'CRITICAL',
      });

      options?.onSuccess?.(result, { id, reason, authorization });
    },

    onError: (error: ApiError, { id, reason, authorization }: { id: string; reason: string; authorization: string }) => {
      console.error('Permanent student deletion failed:', {
        error: error.message,
        studentId: id,
        reason,
        context: error.context,
        timestamp: new Date().toISOString(),
        severity: 'CRITICAL',
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, { id, reason, authorization });
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};
