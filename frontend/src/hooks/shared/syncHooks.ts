/**
 * Data Synchronization Hooks
 *
 * Specialized React hooks for data sync management:
 * - Entity synchronization
 * - Sync status monitoring
 * - Conflict detection and resolution
 *
 * @module syncHooks
 */

import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../reduxStore';

// Use core hooks locally to avoid circular dependency
const useAppDispatch = () => useDispatch<AppDispatch>();

// Import enterprise actions
import {
  syncEntityData,
} from '../enterprise/enterpriseFeatures';

// Import API hooks
import {
  useGetSyncStatusQuery,
  handlePhase3ApiError,
} from '../api/advancedApiIntegration';

/**
 * Hook for managing data synchronization across entities
 */
export const useDataSync = () => {
  const dispatch = useAppDispatch();
  const {
    data: syncStatus,
    error,
    isLoading,
    refetch
  } = useGetSyncStatusQuery();

  const syncEntity = useCallback(async (entity: string, forceSync = false) => {
    try {
      const result = await dispatch(syncEntityData({ entity, forceSync })).unwrap();
      return result;
    } catch (error) {
      throw handlePhase3ApiError(error);
    }
  }, [dispatch]);

  const syncStatuses = useMemo(() => {
    return syncStatus || {};
  }, [syncStatus]);

  const conflictCount = useMemo(() => {
    return Object.values(syncStatuses).reduce((total, status) => total + status.conflictCount, 0);
  }, [syncStatuses]);

  const entitiesWithErrors = useMemo(() => {
    return Object.values(syncStatuses).filter(status => status.status === 'ERROR');
  }, [syncStatuses]);

  return {
    syncEntity,
    syncStatuses,
    conflictCount,
    entitiesWithErrors,
    isLoading,
    error: error ? handlePhase3ApiError(error) : null,
    refresh: refetch
  };
};
