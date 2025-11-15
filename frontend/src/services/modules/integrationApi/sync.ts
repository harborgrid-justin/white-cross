/**
 * @fileoverview Integration API Sync Operations
 * @module services/modules/integrationApi/sync
 * @category Services - System Integration & External APIs
 *
 * @deprecated This module is deprecated and will be removed on 2026-06-30.
 * Please migrate to @/lib/actions/admin.integrations instead.
 *
 * MIGRATION GUIDE:
 * ```typescript
 * // OLD: Sync operations
 * import { testConnection, sync } from '@/services/modules/integrationApi/sync';
 * const testResult = await testConnection(client, 'integration-id');
 * const syncResult = await sync(client, 'integration-id');
 *
 * // NEW: Server Actions
 * import { testIntegration, syncIntegration } from '@/lib/actions/admin.integrations';
 * const testResult = await testIntegration('integration-id');
 * const syncResult = await syncIntegration('integration-id');
 * ```
 *
 * Connection testing and data synchronization operations for integrations.
 * Provides methods to verify integration connectivity and trigger data syncs.
 *
 * Operations:
 * - testConnection: Test integration endpoint connectivity and measure latency
 * - sync: Trigger manual data synchronization
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from './validation';
import type {
  ConnectionTestResult,
  SyncResult,
} from '@/types/domain/integrations';

/**
 * Test integration connection
 *
 * Verifies that the integration endpoint is reachable and measures
 * connection latency. Useful for troubleshooting connectivity issues.
 *
 * @param client - API client instance
 * @param id - Integration unique identifier
 * @returns Promise resolving to connection test result with status and latency
 * @throws Error if ID is missing or connection test fails
 *
 * @example
 * ```typescript
 * const { result } = await testConnection(client, 'uuid-123');
 * console.log(`Status: ${result.status}`);
 * console.log(`Latency: ${result.latency}ms`);
 * if (result.status === 'success') {
 *   console.log('Connection successful!');
 * } else {
 *   console.error(`Connection failed: ${result.message}`);
 * }
 * ```
 */
export async function testConnection(
  client: ApiClient,
  id: string
): Promise<{ result: ConnectionTestResult }> {
  try {
    if (!id) throw new Error('Integration ID is required');

    const response = await client.post<ApiResponse<{ result: ConnectionTestResult }>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/test`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Connection test failed');
  }
}

/**
 * Trigger manual synchronization
 *
 * Initiates a data synchronization between the external system and
 * the local database. Returns detailed results including records
 * processed, errors encountered, and sync duration.
 *
 * @param client - API client instance
 * @param id - Integration unique identifier
 * @returns Promise resolving to sync result with records processed and errors
 * @throws Error if ID is missing or synchronization fails
 *
 * @example
 * ```typescript
 * const { result } = await sync(client, 'uuid-456');
 * console.log(`Records processed: ${result.recordsProcessed}`);
 * console.log(`Success: ${result.success}`);
 * if (result.errors.length > 0) {
 *   console.error(`Encountered ${result.errors.length} errors`);
 *   result.errors.forEach(err => console.error(`- ${err}`));
 * }
 * ```
 */
export async function sync(
  client: ApiClient,
  id: string
): Promise<{ result: SyncResult }> {
  try {
    if (!id) throw new Error('Integration ID is required');

    const response = await client.post<ApiResponse<{ result: SyncResult }>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/sync`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Synchronization failed');
  }
}
