/**
 * Bulk Student Operations Composite Hook
 *
 * Manages bulk operations on multiple students including update, deactivate,
 * reactivate, export, and nurse assignment.
 *
 * @module hooks/students/composites/useBulkStudentOperations
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCallback, useMemo } from 'react';
import { useStudentMutations } from '../mutations';
import { useCacheManager, usePHIHandler } from '../utils';
import { useBulkOperations } from '../redux';
import type { Student } from '@/types/student.types';

/**
 * Configuration options for useBulkStudentOperations
 */
export interface UseBulkStudentOperationsOptions {
  enableRedux?: boolean;
  confirmationRequired?: boolean;
  maxBatchSize?: number;
}

/**
 * Bulk operation definition
 */
export interface BulkOperation {
  id: string;
  label: string;
  icon: string;
  description: string;
  requiresConfirmation: boolean;
  destructive?: boolean;
}

/**
 * Bulk operations hook for managing multiple students
 *
 * @param options - Configuration options
 * @returns Bulk operations interface
 *
 * @example
 * ```tsx
 * const bulk = useBulkStudentOperations({
 *   enableRedux: true,
 *   confirmationRequired: true
 * });
 *
 * return (
 *   <BulkOperationsPanel
 *     selectedCount={bulk.selectedCount}
 *     operations={bulk.availableOperations}
 *     onExecute={bulk.executeOperation}
 *   />
 * );
 * ```
 */
export const useBulkStudentOperations = (options?: UseBulkStudentOperationsOptions) => {
  const {
    enableRedux = true,
    confirmationRequired = true,
    maxBatchSize = 50,
  } = options || {};

  const mutations = useStudentMutations();
  const cacheManager = useCacheManager();
  const phiHandler = usePHIHandler({ logAccess: true });

  // Adapt cache manager interface
  const adaptedCacheManager = {
    invalidatePattern: async (pattern: string) => {
      // Legacy API compatibility
      await cacheManager.clearCache();
    },
  };

  // Redux integration for selection
  const bulkOps = enableRedux ? useBulkOperations() : null;

  // Available operations
  const availableOperations: BulkOperation[] = useMemo(() => [
    {
      id: 'bulk-update',
      label: 'Update Selected',
      icon: 'Edit',
      description: 'Update multiple students at once',
      requiresConfirmation: true,
    },
    {
      id: 'bulk-deactivate',
      label: 'Deactivate Selected',
      icon: 'UserX',
      description: 'Deactivate multiple students',
      requiresConfirmation: true,
      destructive: true,
    },
    {
      id: 'bulk-reactivate',
      label: 'Reactivate Selected',
      icon: 'UserCheck',
      description: 'Reactivate multiple students',
      requiresConfirmation: true,
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      icon: 'Download',
      description: 'Export student data',
      requiresConfirmation: false,
    },
    {
      id: 'bulk-assign-nurse',
      label: 'Assign Nurse',
      icon: 'UserCog',
      description: 'Assign a nurse to selected students',
      requiresConfirmation: true,
    },
  ], []);

  // Execute bulk operation
  const executeOperation = useCallback(async (
    operationId: string,
    data?: any,
    confirmation?: boolean
  ) => {
    if (!bulkOps) {
      throw new Error('Redux is required for bulk operations');
    }

    const { selectedForBulk } = bulkOps;

    if (selectedForBulk.length === 0) {
      throw new Error('No students selected');
    }

    if (selectedForBulk.length > maxBatchSize) {
      throw new Error(`Cannot process more than ${maxBatchSize} students at once`);
    }

    const operation = availableOperations.find(op => op.id === operationId);
    if (!operation) {
      throw new Error('Invalid operation');
    }

    if (operation.requiresConfirmation && !confirmation) {
      throw new Error('Confirmation required');
    }

    // Log bulk operation
    selectedForBulk.forEach(studentId => {
      phiHandler.logAccessEvent(studentId, `bulk-operation: ${operationId}`);
    });

    let result;

    switch (operationId) {
      case 'bulk-update':
        result = await mutations.bulkUpdateStudents.mutateAsync({
          studentIds: selectedForBulk,
          updates: data,
        });
        break;

      case 'bulk-deactivate':
        result = await Promise.all(
          selectedForBulk.map(id => mutations.deactivateStudent.mutateAsync(id))
        );
        break;

      case 'bulk-reactivate':
        result = await Promise.all(
          selectedForBulk.map(id => mutations.reactivateStudent.mutateAsync(id))
        );
        break;

      case 'bulk-export':
        // Export functionality would be implemented here
        result = { exported: selectedForBulk.length };
        break;

      case 'bulk-assign-nurse':
        result = await mutations.bulkUpdateStudents.mutateAsync({
          studentIds: selectedForBulk,
          updates: { nurseId: data.nurseId },
        });
        break;

      default:
        throw new Error('Operation not implemented');
    }

    // Invalidate relevant caches
    await adaptedCacheManager.invalidatePattern('student-lists');
    await adaptedCacheManager.invalidatePattern('student-statistics');

    // Clear selection after successful operation
    bulkOps.clearBulkSelection();

    return result;
  }, [bulkOps, maxBatchSize, availableOperations, mutations, phiHandler, adaptedCacheManager]);

  return {
    // Selection state
    selectedCount: bulkOps?.selectedCount || 0,
    selectedStudents: bulkOps?.selectedStudents || [],
    hasSelection: (bulkOps?.selectedCount || 0) > 0,

    // Operations
    availableOperations,
    executeOperation,

    // State
    isExecuting: mutations.bulkUpdateStudents.isPending,

    // Selection controls
    selectAll: bulkOps?.selectAllForBulk,
    clearSelection: bulkOps?.clearBulkSelection,
    toggleSelection: bulkOps?.toggleBulkSelection,

    // Mode controls
    enterBulkMode: bulkOps?.enterBulkMode,
    exitBulkMode: bulkOps?.exitBulkMode,
    isBulkMode: bulkOps?.isBulkMode || false,
  };
};
