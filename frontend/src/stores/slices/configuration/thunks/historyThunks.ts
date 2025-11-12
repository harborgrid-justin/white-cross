/**
 * Configuration Store - History & Audit Thunks
 * 
 * Async thunks for configuration history and audit trail operations
 * 
 * @module stores/slices/configuration/thunks/historyThunks
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { configurationService } from '../service';

/**
 * Fetch configuration history for a specific key.
 * 
 * Retrieves the complete change history for a configuration,
 * including who made changes, when, and what was changed.
 * 
 * @param key - Configuration key
 * @param limit - Optional limit on number of history entries
 * 
 * @example
 * ```typescript
 * dispatch(fetchConfigurationHistory({
 *   key: 'patient_chart_timeout',
 *   limit: 50
 * }));
 * ```
 */
export const fetchConfigurationHistory = createAsyncThunk(
  'configuration/fetchConfigurationHistory',
  async ({ key, limit }: { key: string; limit?: number }) => {
    const response = await configurationService.getConfigurationHistory(key, limit);
    return response;
  }
);

/**
 * Fetch recent configuration changes across the system.
 * 
 * Retrieves the most recent configuration changes across all configurations,
 * useful for audit trails and monitoring system changes.
 * 
 * @param limit - Optional limit on number of changes to retrieve (default: 25)
 * 
 * @example
 * ```typescript
 * // Get last 50 changes
 * dispatch(fetchRecentChanges(50));
 * ```
 */
export const fetchRecentChanges = createAsyncThunk(
  'configuration/fetchRecentChanges',
  async (limit?: number) => {
    const response = await configurationService.getRecentChanges(limit);
    return response;
  }
);

/**
 * Fetch configuration changes made by a specific user.
 * 
 * Retrieves all configuration changes made by a particular user,
 * useful for user activity auditing and compliance tracking.
 * 
 * @param userId - User ID to fetch changes for
 * @param limit - Optional limit on number of changes
 * 
 * @example
 * ```typescript
 * dispatch(fetchChangesByUser({
 *   userId: 'user_123',
 *   limit: 100
 * }));
 * ```
 */
export const fetchChangesByUser = createAsyncThunk(
  'configuration/fetchChangesByUser',
  async ({ userId, limit }: { userId: string; limit?: number }) => {
    const response = await configurationService.getChangesByUser(userId, limit);
    return response;
  }
);
