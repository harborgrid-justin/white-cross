/**
 * Audit Trail Hooks
 *
 * Specialized React hooks for audit trail management:
 * - Audit record creation
 * - Audit trail querying with filters
 * - Recent audit entries
 *
 * @module auditHooks
 */

import { useCallback } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../reduxStore';

// Use core hooks locally to avoid circular dependency
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Import enterprise actions
import {
  createAuditEntry,
} from '../enterprise/enterpriseFeatures';

// Import API hooks
import {
  useQueryAuditTrailQuery,
  handlePhase3ApiError,
} from '../api/advancedApiIntegration';

/**
 * Hook for querying and managing audit trails
 */
export const useAuditTrail = () => {
  const dispatch = useAppDispatch();

  const createAuditRecord = useCallback(async (
    action: string,
    entity: string,
    entityId: string,
    changes: any[],
    metadata?: Record<string, any>
  ) => {
    try {
      const result = await dispatch(createAuditEntry({
        action,
        entity,
        entityId,
        changes,
        metadata
      })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  // Get recent audit entries from local state
  const recentEntries = useAppSelector((state: RootState) =>
    state.enterprise.auditTrail.slice(0, 50) // Last 50 entries
  );

  return {
    createAuditRecord,
    recentEntries
  };
};

/**
 * Hook for querying audit trail with filters
 */
export const useAuditQuery = (filters: {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  dateRange?: { start: string; end: string };
  riskLevel?: string;
  page?: number;
  limit?: number;
}) => {
  const {
    data: auditResults,
    error,
    isLoading,
    refetch
  } = useQueryAuditTrailQuery({
    ...filters,
    pagination: {
      page: filters.page || 1,
      limit: filters.limit || 50
    }
  });

  return {
    results: auditResults,
    error: error ? handlePhase3ApiError(error) : null,
    isLoading,
    refetch
  };
};
