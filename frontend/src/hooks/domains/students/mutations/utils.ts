/**
 * Student Mutation Utilities
 *
 * Shared utility functions for student mutation operations
 *
 * @module hooks/students/mutations/utils
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import type { UseQueryClient } from '@tanstack/react-query';
import type { Student } from '@/types/student.types';
import {
  getInvalidationStrategy,
  createStudentUpdateOperation
} from '@/services/cache/InvalidationStrategy';

/**
 * Granular cache invalidation utility with surgical precision
 *
 * Replaces over-aggressive invalidation with operation-specific invalidation
 * Target: 60% reduction in cache invalidations
 */
export const invalidateStudentCache = async (
  queryClient: ReturnType<typeof UseQueryClient>,
  operationType: string,
  studentId?: string,
  previousValues?: Partial<Student>,
  newValues?: Partial<Student>
) => {
  const invalidationStrategy = getInvalidationStrategy(queryClient);

  // Determine changed fields
  const changedFields = previousValues && newValues
    ? Object.keys(newValues).filter(
        (key) => previousValues[key as keyof Student] !== newValues[key as keyof Student]
      )
    : undefined;

  // Map operationType to valid invalidation strategy type
  const strategyType = ['create', 'update', 'delete', 'bulk'].includes(operationType)
    ? (operationType as 'create' | 'update' | 'delete' | 'bulk')
    : 'update';

  // Create invalidation operation
  const operation = createStudentUpdateOperation(
    strategyType,
    studentId || '',
    previousValues || {},
    newValues || {}
  );

  // Execute granular invalidation
  await invalidationStrategy.invalidate(operation);
};
