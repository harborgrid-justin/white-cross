/**
 * @fileoverview Integration API Monitoring Operations
 * @module services/modules/integrationApi/monitoring
 * @category Services - System Integration & External APIs
 *
 * Monitoring, logging, statistics, and batch operations for integrations.
 * Provides comprehensive visibility into integration health and performance.
 *
 * Operations:
 * - getLogs: Get logs for specific integration
 * - getAllLogs: Get logs across all integrations
 * - getStatistics: Get integration statistics and metrics
 * - getHealthStatus: Get aggregated health status
 * - batchEnable: Enable multiple integrations
 * - batchDisable: Disable multiple integrations
 */

import type { ApiClient } from '../../core/ApiClient';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '../../utils/apiUtils';
import { createApiError } from './validation';
import { update } from './operations';
import type {
  IntegrationLogsResponse,
  IntegrationStatisticsResponse,
  IntegrationHealthStatusResponse,
  BatchOperationResult,
  LogFilters,
  IntegrationListResponse,
} from '@/types/domain/integrations';

/**
 * Get integration logs with pagination
 *
 * Retrieves log entries for a specific integration with support for
 * filtering and pagination.
 *
 * @param client - API client instance
 * @param id - Integration unique identifier
 * @param filters - Optional log filters (page, limit, etc.)
 * @returns Promise resolving to paginated log entries
 * @throws Error if ID is missing or fetch fails
 *
 * @example
 * ```typescript
 * const logs = await getLogs(client, 'uuid-123', {
 *   page: 1,
 *   limit: 50
 * });
 * console.log(`Found ${logs.logs.length} log entries`);
 * ```
 */
export async function getLogs(
  client: ApiClient,
  id: string,
  filters: LogFilters = {}
): Promise<IntegrationLogsResponse> {
  try {
    if (!id) throw new Error('Integration ID is required');

    const params = new URLSearchParams();
    params.append('page', String(filters.page || 1));
    params.append('limit', String(filters.limit || 20));

    const response = await client.get<ApiResponse<IntegrationLogsResponse>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/logs?${params.toString()}`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Failed to fetch integration logs');
  }
}

/**
 * Get all integration logs (across all integrations)
 *
 * Retrieves log entries from all integrations with optional type filtering.
 *
 * @param client - API client instance
 * @param filters - Optional log filters (page, limit, type, etc.)
 * @returns Promise resolving to paginated log entries
 * @throws Error if fetch fails
 *
 * @example
 * ```typescript
 * const allLogs = await getAllLogs(client, {
 *   page: 1,
 *   limit: 100,
 *   type: 'SIS'
 * });
 * console.log(`Total logs: ${allLogs.logs.length}`);
 * ```
 */
export async function getAllLogs(
  client: ApiClient,
  filters: LogFilters = {}
): Promise<IntegrationLogsResponse> {
  try {
    const params = new URLSearchParams();
    params.append('page', String(filters.page || 1));
    params.append('limit', String(filters.limit || 20));
    if (filters.type) params.append('type', String(filters.type));

    const response = await client.get<ApiResponse<IntegrationLogsResponse>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/logs/all?${params.toString()}`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Failed to fetch logs');
  }
}

/**
 * Get integration statistics and metrics
 *
 * Provides comprehensive overview of sync success rates, performance metrics,
 * and overall system health across all integrations.
 *
 * @param client - API client instance
 * @returns Promise resolving to integration statistics
 * @throws Error if fetch fails
 *
 * @example
 * ```typescript
 * const stats = await getStatistics(client);
 * console.log(`Total integrations: ${stats.statistics.totalIntegrations}`);
 * console.log(`Success rate: ${stats.statistics.successRate}%`);
 * ```
 */
export async function getStatistics(
  client: ApiClient
): Promise<IntegrationStatisticsResponse> {
  try {
    const response = await client.get<ApiResponse<IntegrationStatisticsResponse>>(
      `${API_ENDPOINTS.INTEGRATIONS.BASE}/statistics/overview`
    );

    return response.data.data;
  } catch (error) {
    throw createApiError(error, 'Failed to fetch statistics');
  }
}

/**
 * Get integration health status
 *
 * Returns aggregated health information for all active integrations.
 * Categorizes integrations by health status (healthy, warning, error)
 * and provides an overall system health indicator.
 *
 * @param client - API client instance
 * @param getAllIntegrations - Function to fetch all integrations
 * @returns Promise resolving to health status summary
 * @throws Error if fetch fails
 *
 * @example
 * ```typescript
 * const health = await getHealthStatus(client, getAllIntegrations);
 * console.log(`Overall health: ${health.overall}`);
 * console.log(`Healthy: ${health.summary.healthy}`);
 * console.log(`Warnings: ${health.summary.warning}`);
 * console.log(`Errors: ${health.summary.error}`);
 * ```
 */
export async function getHealthStatus(
  client: ApiClient,
  getAllIntegrations: (client: ApiClient) => Promise<IntegrationListResponse>
): Promise<IntegrationHealthStatusResponse> {
  try {
    const { integrations } = await getAllIntegrations(client);

    const healthyIntegrations = integrations.filter(i =>
      i.isActive && i.status === 'ACTIVE' && i.lastSyncStatus === 'success'
    );

    const warningIntegrations = integrations.filter(i =>
      i.isActive && (i.status === 'TESTING' || !i.lastSyncAt)
    );

    const errorIntegrations = integrations.filter(i =>
      i.isActive && (i.status === 'ERROR' || i.lastSyncStatus === 'failed')
    );

    let overall: 'healthy' | 'degraded' | 'critical';
    if (errorIntegrations.length > 0) {
      overall = 'critical';
    } else if (warningIntegrations.length > 0) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }

    return {
      overall,
      integrations: integrations.map(i => ({
        id: i.id,
        name: i.name,
        type: i.type,
        status: i.status,
        lastSync: i.lastSyncAt || null,
        health: i.status === 'ERROR' || i.lastSyncStatus === 'failed'
          ? 'error'
          : i.status === 'TESTING' || !i.lastSyncAt
            ? 'warning'
            : 'healthy'
      })),
      summary: {
        total: integrations.length,
        healthy: healthyIntegrations.length,
        warning: warningIntegrations.length,
        error: errorIntegrations.length
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch health status');
  }
}

/**
 * Batch operations - Enable multiple integrations
 *
 * Enables multiple integrations in a single operation. Returns summary
 * of successful and failed operations.
 *
 * @param client - API client instance
 * @param ids - Array of integration IDs to enable
 * @returns Promise resolving to batch operation result
 * @throws Error if IDs array is empty or operation fails
 *
 * @example
 * ```typescript
 * const result = await batchEnable(client, [
 *   'uuid-123',
 *   'uuid-456',
 *   'uuid-789'
 * ]);
 * console.log(`Enabled: ${result.success}/${result.total}`);
 * if (result.failed > 0) {
 *   console.error('Failed integrations:', result.errors);
 * }
 * ```
 */
export async function batchEnable(
  client: ApiClient,
  ids: string[]
): Promise<BatchOperationResult> {
  try {
    if (!ids || ids.length === 0) throw new Error('Integration IDs are required');

    const results = await Promise.allSettled(
      ids.map(id => update(client, id, { isActive: true }))
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      success,
      failed,
      total: ids.length,
      errors: results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r, index) => ({
          integrationId: ids[index],
          error: r.reason?.message || 'Unknown error'
        }))
    };
  } catch (error) {
    throw new Error('Failed to enable integrations');
  }
}

/**
 * Batch operations - Disable multiple integrations
 *
 * Disables multiple integrations in a single operation. Returns summary
 * of successful and failed operations.
 *
 * @param client - API client instance
 * @param ids - Array of integration IDs to disable
 * @returns Promise resolving to batch operation result
 * @throws Error if IDs array is empty or operation fails
 *
 * @example
 * ```typescript
 * const result = await batchDisable(client, [
 *   'uuid-123',
 *   'uuid-456'
 * ]);
 * console.log(`Disabled: ${result.success}/${result.total}`);
 * ```
 */
export async function batchDisable(
  client: ApiClient,
  ids: string[]
): Promise<BatchOperationResult> {
  try {
    if (!ids || ids.length === 0) throw new Error('Integration IDs are required');

    const results = await Promise.allSettled(
      ids.map(id => update(client, id, { isActive: false }))
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return {
      success,
      failed,
      total: ids.length,
      errors: results
        .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
        .map((r, index) => ({
          integrationId: ids[index],
          error: r.reason?.message || 'Unknown error'
        }))
    };
  } catch (error) {
    throw new Error('Failed to disable integrations');
  }
}
