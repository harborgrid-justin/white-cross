/**
 * Student Bulk Mutation Hooks
 *
 * Bulk update operations for multiple students
 *
 * @module hooks/students/mutations/useStudentBulkMutations
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { apiActions } from '@/lib/api';
import type { BulkUpdateStudentsRequest } from '@/types/student.types';
import { STUDENT_MUTATION_CONFIG } from './cacheConfig';
import { invalidateStudentCache } from './utils';
import type { ApiError, BulkMutationResult } from './types';

/**
 * Hook for bulk updating multiple students
 *
 * @param options - Mutation options
 * @returns Mutation handlers for bulk operations
 */
export const useBulkUpdateStudents = (
  options?: UseMutationOptions<BulkMutationResult, ApiError, BulkUpdateStudentsRequest>
) => {
  const queryClient = useQueryClient();
  const config = STUDENT_MUTATION_CONFIG.bulk; // Bulk operation config

  return useMutation({
    mutationFn: async (request: BulkUpdateStudentsRequest): Promise<BulkMutationResult> => {
      try {
        // Process in batches to avoid overwhelming the server
        const batchSize = 10;
        const batches = [];

        for (let i = 0; i < request.studentIds.length; i += batchSize) {
          batches.push(request.studentIds.slice(i, i + batchSize));
        }

        const results = [];
        let successCount = 0;
        let failureCount = 0;

        for (const batch of batches) {
          const batchResults = await Promise.allSettled(
            batch.map(async (id) => {
              try {
                const student = await apiActions.students.update(id, request.updateData);
                return { id, success: true, student };
              } catch (error: any) {
                return { id, success: false, error: error.message };
              }
            })
          );

          for (const result of batchResults) {
            if (result.status === 'fulfilled') {
              results.push(result.value);
              if (result.value.success) {
                successCount++;
              } else {
                failureCount++;
              }
            } else {
              results.push({ id: 'unknown', success: false, error: result.reason?.message });
              failureCount++;
            }
          }
        }

        return {
          success: successCount > 0,
          successCount,
          failureCount,
          results,
          auditId: `bulk_update_${Date.now()}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: 'server',
          auditRequired: true,
        });
      }
    },

    onSuccess: async (result: BulkMutationResult, request: BulkUpdateStudentsRequest) => {
      // For bulk updates, invalidate conservatively
      // This could be optimized further by tracking which specific lists are affected
      await invalidateStudentCache(
        queryClient,
        'bulk',
        undefined,
        undefined,
        request.updateData
      );

      console.info('Bulk student update completed:', {
        totalRequested: request.studentIds.length,
        successCount: result.successCount,
        failureCount: result.failureCount,
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'BULK_UPDATE_STUDENTS',
      });

      options?.onSuccess?.(result, request);
    },

    onError: (error: ApiError, request: BulkUpdateStudentsRequest) => {
      console.error('Bulk student update failed:', {
        error: error.message,
        totalRequested: request.studentIds.length,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, request);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};
