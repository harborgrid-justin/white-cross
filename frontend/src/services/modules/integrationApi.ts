/**
 * @fileoverview Enterprise Integration Hub API service
 * @module services/modules/integrationApi
 * @category Services - System Integration & External APIs
 *
 * Provides comprehensive enterprise integration management for external healthcare,
 * educational, and administrative systems. Implements secure authentication, data
 * synchronization, webhook management, and integration monitoring with support for
 * 8 major integration types.
 *
 * Supported Integration Types:
 * - SIS (Student Information System) - PowerSchool, Infinite Campus, etc.
 * - EHR (Electronic Health Records) - Epic, Cerner, Allscripts
 * - PHARMACY - Pharmacy management systems for prescription sync
 * - LABORATORY - Lab information systems for test results
 * - INSURANCE - Insurance verification and eligibility checking
 * - PARENT_PORTAL - Parent communication platforms
 * - HEALTH_APP - Student health tracking mobile apps
 * - GOVERNMENT_REPORTING - State health reporting systems
 *
 * Key Features:
 * - Integration CRUD operations (Create, Read, Update, Delete)
 * - Connection testing with latency metrics
 * - Data synchronization (inbound, outbound, bidirectional)
 * - Webhook configuration with signature validation
 * - Field mapping and data transformation
 * - Integration monitoring and health status
 * - Batch operations (enable/disable multiple integrations)
 * - Integration logs and error tracking
 * - Statistics and performance analytics
 *
 * Authentication Methods:
 * - API Key: Simple token-based authentication
 * - Basic Auth: Username/password authentication
 * - OAuth 2.0: Industry-standard authorization (4 grant types supported)
 * - JWT: JSON Web Token authentication
 * - Certificate: Client certificate authentication
 * - Custom: Flexible custom authentication mechanisms
 *
 * OAuth 2.0 Grant Types:
 * - authorization_code: Web application flow
 * - client_credentials: Server-to-server flow
 * - password: Resource owner password flow
 * - refresh_token: Token refresh flow
 *
 * Data Synchronization:
 * - Scheduled sync with cron expressions
 * - Manual sync trigger capabilities
 * - Sync direction control (inbound/outbound/bidirectional)
 * - Field mapping with data type validation
 * - Transform rules for data conversion
 * - Conflict resolution strategies
 * - Sync status tracking (success/failed/pending)
 *
 * Webhook Support:
 * - Webhook URL configuration
 * - HMAC signature validation for security
 * - Retry policy with exponential backoff
 * - Event filtering by type
 * - Webhook secret management
 * - Webhook delivery tracking
 *
 * Security Features:
 * - Endpoint URL validation (HTTPS required in production)
 * - Strong credential requirements (no weak passwords)
 * - Comprehensive Zod schema validation
 * - Rate limiting configuration
 * - Timeout management (1-300 seconds)
 * - Certificate path validation
 *
 * Integration Monitoring:
 * - Real-time health status (healthy/degraded/critical)
 * - Last sync timestamp tracking
 * - Success/failure rate calculation
 * - Error log aggregation
 * - Performance metrics (latency, throughput)
 * - Integration uptime monitoring
 *
 * @example Setup SIS integration with OAuth 2.0
 * ```typescript
 * import { integrationApi } from '@/services/modules/integrationApi';
 *
 * const sisIntegration = await integrationApi.create({
 *   name: 'PowerSchool SIS',
 *   type: 'SIS',
 *   endpoint: 'https://api.powerschool.com/v1',
 *   settings: {
 *     authMethod: 'oauth2',
 *     oauth2Config: {
 *       clientId: 'your-client-id',
 *       clientSecret: 'your-client-secret',
 *       authorizationUrl: 'https://oauth.powerschool.com/authorize',
 *       tokenUrl: 'https://oauth.powerschool.com/token',
 *       grantType: 'client_credentials',
 *       scope: ['students.read', 'enrollments.read']
 *     },
 *     syncDirection: 'inbound',
 *     syncSchedule: '0 2 * * *', // Daily at 2 AM
 *     autoSync: true
 *   }
 * });
 * console.log(`SIS integration created: ${sisIntegration.id}`);
 * ```
 *
 * @example Test integration connection
 * ```typescript
 * const { result } = await integrationApi.testConnection('integration-uuid-123');
 * console.log(`Connection status: ${result.status}`);
 * console.log(`Latency: ${result.latency}ms`);
 * ```
 *
 * @example Trigger manual sync
 * ```typescript
 * const { result } = await integrationApi.sync('integration-uuid-456');
 * console.log(`Records processed: ${result.recordsProcessed}`);
 * console.log(`Errors: ${result.errors.length}`);
 * ```
 *
 * @example Get integration health status
 * ```typescript
 * const health = await integrationApi.getHealthStatus();
 * console.log(`Overall health: ${health.overall}`);
 * console.log(`Healthy integrations: ${health.summary.healthy}`);
 * console.log(`Error integrations: ${health.summary.error}`);
 * ```
 *
 * @see {@link https://oauth.net/2/ OAuth 2.0 Specification}
 * @see {@link https://jwt.io/ JWT Documentation}
 */

import type { ApiClient } from '../core/ApiClient';
import * as operations from './integrationApi/operations';
import * as syncOps from './integrationApi/sync';
import * as monitoring from './integrationApi/monitoring';

// Import types from centralized integration types file
import type {
  IntegrationType,
  IntegrationStatus,
  IntegrationConfig,
  IntegrationLog,
  IntegrationSettings,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  ConnectionTestResult,
  SyncResult,
  IntegrationStatistics,
  LogFilters,
  IntegrationListResponse,
  IntegrationResponse,
  IntegrationLogsResponse,
  IntegrationStatisticsResponse,
  BatchOperationResult,
  IntegrationHealthStatusResponse,
  SyncStatus,
} from '../../types/domain/integrations';

// Re-export types for backward compatibility
export type {
  IntegrationType,
  IntegrationStatus,
  IntegrationConfig as Integration,
  IntegrationLog,
  IntegrationSettings,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  ConnectionTestResult,
  SyncResult,
  IntegrationStatistics,
  LogFilters,
  SyncStatus,
};

/**
 * Integration API Service Class
 * Implements enterprise integration patterns with comprehensive error handling
 */
export class IntegrationApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all integrations with optional filtering
   */
  async getAll(type?: IntegrationType): Promise<IntegrationListResponse> {
    return operations.getAll(this.client, type);
  }

  /**
   * Get single integration by ID
   */
  async getById(id: string): Promise<IntegrationResponse> {
    return operations.getById(this.client, id);
  }

  /**
   * Create new integration configuration
   */
  async create(data: CreateIntegrationRequest): Promise<IntegrationResponse> {
    return operations.create(this.client, data);
  }

  /**
   * Update existing integration
   */
  async update(id: string, data: UpdateIntegrationRequest): Promise<IntegrationResponse> {
    return operations.update(this.client, id, data);
  }

  /**
   * Delete integration configuration
   */
  async delete(id: string): Promise<{ message: string }> {
    return operations.deleteIntegration(this.client, id);
  }

  /**
   * Test integration connection
   * Returns connection status and latency metrics
   */
  async testConnection(id: string): Promise<{ result: ConnectionTestResult }> {
    return syncOps.testConnection(this.client, id);
  }

  /**
   * Trigger manual synchronization
   * Returns sync results including records processed and errors
   */
  async sync(id: string): Promise<{ result: SyncResult }> {
    return syncOps.sync(this.client, id);
  }

  /**
   * Get integration logs with pagination
   */
  async getLogs(id: string, filters: LogFilters = {}): Promise<IntegrationLogsResponse> {
    return monitoring.getLogs(this.client, id, filters);
  }

  /**
   * Get all integration logs (across all integrations)
   */
  async getAllLogs(filters: LogFilters = {}): Promise<IntegrationLogsResponse> {
    return monitoring.getAllLogs(this.client, filters);
  }

  /**
   * Get integration statistics and metrics
   * Provides overview of sync success rates, performance, and system health
   */
  async getStatistics(): Promise<IntegrationStatisticsResponse> {
    return monitoring.getStatistics(this.client);
  }

  /**
   * Batch operations - Enable multiple integrations
   */
  async batchEnable(ids: string[]): Promise<BatchOperationResult> {
    return monitoring.batchEnable(this.client, ids);
  }

  /**
   * Batch operations - Disable multiple integrations
   */
  async batchDisable(ids: string[]): Promise<BatchOperationResult> {
    return monitoring.batchDisable(this.client, ids);
  }

  /**
   * Get integration health status
   * Returns aggregated health information for all active integrations
   */
  async getHealthStatus(): Promise<IntegrationHealthStatusResponse> {
    return monitoring.getHealthStatus(this.client, operations.getAll);
  }
}

// Export factory function
export function createIntegrationApi(client: ApiClient): IntegrationApi {
  return new IntegrationApi(client);
}

// Export singleton instance for registry
import { apiClient } from '../core';
export const integrationApi = createIntegrationApi(apiClient);
