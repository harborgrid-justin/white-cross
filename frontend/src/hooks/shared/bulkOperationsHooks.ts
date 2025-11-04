/**
 * Bulk Operations Hooks
 *
 * Specialized React hooks for bulk operations management:
 * - Bulk operation execution
 * - Progress tracking
 * - Rollback capabilities
 *
 * @module bulkOperationsHooks
 */

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../reduxStore';

// Use core hooks locally to avoid circular dependency
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Import advanced actions
import {
  rollbackBulkOperation,
} from '../enterprise/enterpriseFeatures';

// Import API hooks
import {
  useExecuteBulkOperationMutation,
  useGetBulkOperationStatusQuery,
  handlePhase3ApiError,
} from '../api/advancedApiIntegration';

/**
 * Hook for managing bulk operations with progress tracking
 */
export const useBulkOperations = () => {
  const dispatch = useAppDispatch();
  const [executeBulk, { isLoading: isExecuting }] = useExecuteBulkOperationMutation();

  // Get active bulk operations from state
  const bulkOperations = useAppSelector((state: RootState) => state.enterprise.bulkOperations);
  const activeOperations = useMemo(
    () => Object.values(bulkOperations).filter(op => op.status === 'IN_PROGRESS'),
    [bulkOperations]
  );

  const executeBulkOperation = useCallback(async (
    type: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT',
    entity: string,
    data: any[],
    options?: {
      validateFirst?: boolean;
      rollbackOnError?: boolean;
      batchSize?: number;
    }
  ) => {
    try {
      const result = await executeBulk({
        type,
        entity,
        data,
        options: {
          validateFirst: options?.validateFirst ?? true,
          rollbackOnError: options?.rollbackOnError ?? true,
          batchSize: options?.batchSize ?? 100,
          timeout: 300000, // 5 minutes
        }
      }).unwrap();

      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [executeBulk]);

  const rollbackOperation = useCallback(async (operationId: string) => {
    try {
      const result = await dispatch(rollbackBulkOperation({ operationId })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  return {
    executeBulkOperation,
    rollbackOperation,
    bulkOperations,
    activeOperations,
    isExecuting
  };
};

/**
 * Hook for tracking bulk operation progress
 */
export const useBulkOperationProgress = (operationId: string | null) => {
  const {
    data: operationStatus,
    error,
    isLoading
  } = useGetBulkOperationStatusQuery(
    { operationId: operationId! },
    {
      skip: !operationId,
      pollingInterval: operationId ? 2000 : undefined, // Poll every 2 seconds if active
      skipPollingIfUnfocused: true,
    }
  );

  const progress = useMemo(() => {
    if (!operationStatus) return null;

    return {
      percentage: operationStatus.progress.percentage,
      processed: operationStatus.progress.processed,
      total: operationStatus.progress.total,
      failed: operationStatus.progress.failed,
      status: operationStatus.status,
      isComplete: ['COMPLETED', 'FAILED', 'ROLLED_BACK'].includes(operationStatus.status),
      canRollback: operationStatus.rollbackId ? true : false
    };
  }, [operationStatus]);

  return {
    progress,
    error: error ? handlePhase3ApiError(error) : null,
    isLoading
  };
};
