/**
 * @fileoverview Helper utilities for cache invalidation operations
 * @module services/cache/invalidation-helpers
 * @category Services - Cache Invalidation
 *
 * Provides utility functions for creating and managing cache invalidation
 * operations. These helpers simplify the creation of properly-typed
 * invalidation operation objects.
 *
 * Key Features:
 * - Type-safe operation builders
 * - Field change detection
 * - Entity-specific operation helpers
 *
 * @example
 * ```typescript
 * const operation = createStudentUpdateOperation(
 *   'update',
 *   'student-123',
 *   { grade: 10 },
 *   { grade: 11 }
 * );
 * ```
 */

import type { InvalidationOperation } from './types';

/**
 * Create Student Update Operation
 *
 * @param operationType - Type of operation (create, update, delete, bulk)
 * @param studentId - Student identifier
 * @param previousValues - Previous field values before update
 * @param newValues - New field values after update
 * @returns Properly-typed InvalidationOperation object
 *
 * @description
 * Creates a properly-typed InvalidationOperation object for student updates.
 * Automatically detects which fields have changed by comparing previous and
 * new values.
 *
 * @example
 * ```typescript
 * // Grade change operation
 * const op = createStudentUpdateOperation(
 *   'update',
 *   'student-123',
 *   { grade: 10, name: 'John' },
 *   { grade: 11, name: 'John' }
 * );
 * // Result: changedFields = ['grade']
 * ```
 */
export function createStudentUpdateOperation(
  operationType: 'create' | 'update' | 'delete' | 'bulk',
  studentId: string | number,
  previousValues: Record<string, unknown>,
  newValues: Record<string, unknown>
): InvalidationOperation {
  const changedFields = Object.keys(newValues).filter(
    (key) => previousValues[key] !== newValues[key]
  );

  return {
    operationType,
    entity: 'students',
    entityId: studentId,
    changedFields,
    previousValues,
    newValues
  };
}
