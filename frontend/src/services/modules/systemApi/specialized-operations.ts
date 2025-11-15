/**
 * @fileoverview System API Specialized Operations
 *
 * @deprecated This module is deprecated and will be removed on 2026-06-30.
 * Please migrate to @/lib/actions/admin.monitoring and @/lib/actions/admin.settings instead.
 *
 * @fileoverview System API Specialized Operations
 * 
 * Provides advanced system administration operations including data synchronization,
 * school/district management, bulk operations, audit trails, and specialized
 * integration workflows.
 * 
 * @module systemApi/specialized-operations
 * @version 1.0.0
 * @since 2025-11-11
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, buildUrlParams } from '../../utils/apiUtils';
import { createApiError, createValidationError } from '../../core/errors';
import { z } from 'zod';

// Import validation schemas
import {
  syncStudentsSchema,
  createSchoolSchema,
  updateSchoolSchema,
} from './validation';

// Import type definitions
import type {
  SyncStatus,
  SyncLog,
  SyncStudentsRequest,
  SyncProgress,
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  SchoolStatistics,
  Integration,
  PaginatedResponse,
  BulkOperationResult,
  FilterOptions,
  IntegrationFilters,
  SchoolFilters,
  SyncLogFilters,
  ConfigurationAudit,
  FeatureFlagAudit,
  IntegrationAudit,
  SystemApiResponse,
} from './types';

/**
 * Specialized system operations class containing advanced administration functions
 * 
 * Handles complex system administration tasks including data synchronization,
 * multi-entity operations, audit management, and specialized workflows.
 */
export class SystemSpecializedOperations {
  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // DATA SYNCHRONIZATION OPERATIONS
  // ==========================================

  /**
   * Get sync status for all active integrations
   * 
   * @returns Array of current synchronization statuses
   * @throws {ApiError} When sync status fetch fails
   * 
   * @example
   * ```typescript
   * const syncStatuses = await specializedOps.getSyncStatus();
   * const activeSyncs = syncStatuses.filter(s => s.status === 'SYNCING');
   * ```
   */
  async getSyncStatus(): Promise<SyncStatus[]> {
    try {
      const response = await this.client.get<SystemApiResponse<SyncStatus[]>>(
        '/system/sync/status'
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch sync status');
    }
  }

  /**
   * Get sync status for specific integration
   * 
   * @param integrationId - Integration ID to check
   * @returns Current synchronization status for the integration
   * @throws {ApiError} When integration sync status fetch fails
   */
  async getIntegrationSyncStatus(integrationId: string): Promise<SyncStatus> {
    try {
      const response = await this.client.get<SystemApiResponse<SyncStatus>>(
        `/system/sync/status/${integrationId}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch sync status for integration: ${integrationId}`);
    }
  }

  /**
   * Get detailed sync progress for active synchronization
   * 
   * @param integrationId - Integration ID with active sync
   * @returns Detailed progress information
   * @throws {ApiError} When sync progress fetch fails
   */
  async getSyncProgress(integrationId: string): Promise<SyncProgress> {
    try {
      const response = await this.client.get<SystemApiResponse<SyncProgress>>(
        `/system/sync/progress/${integrationId}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch sync progress for integration: ${integrationId}`);
    }
  }

  /**
   * Get historical sync logs with filtering options
   * 
   * @param filters - Optional filters for sync logs
   * @returns Paginated list of sync operation logs
   * @throws {ApiError} When sync logs fetch fails
   * 
   * @example
   * ```typescript
   * // Get recent failed syncs
   * const failedSyncs = await specializedOps.getSyncLogs({
   *   status: 'FAILED',
   *   dateFrom: '2025-11-01',
   *   limit: 10
   * });
   * 
   * // Get all syncs for specific integration
   * const integrationSyncs = await specializedOps.getSyncLogs({
   *   integrationId: 'integration-123'
   * });
   * ```
   */
  async getSyncLogs(filters?: SyncLogFilters): Promise<PaginatedResponse<SyncLog>> {
    try {
      const params = filters ? buildUrlParams(filters as Record<string, unknown>) : '';
      const response = await this.client.get<SystemApiResponse<PaginatedResponse<SyncLog>>>(
        `/system/sync/logs${params ? '?' + params : ''}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch sync logs');
    }
  }

  /**
   * Get specific sync log details
   * 
   * @param logId - Sync log ID to retrieve
   * @returns Detailed sync log information
   * @throws {ApiError} When sync log fetch fails
   */
  async getSyncLog(logId: string): Promise<SyncLog> {
    try {
      const response = await this.client.get<SystemApiResponse<SyncLog>>(
        `/system/sync/logs/${logId}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch sync log: ${logId}`);
    }
  }

  /**
   * Trigger student data synchronization with validation
   * 
   * @param data - Sync request parameters
   * @returns Sync operation log entry
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When sync initiation fails
   * 
   * @example
   * ```typescript
   * // Full sync for all schools
   * const fullSync = await specializedOps.syncStudents({
   *   fullSync: true
   * });
   * 
   * // Incremental sync for specific schools
   * const incrementalSync = await specializedOps.syncStudents({
   *   integrationId: 'sis-integration-123',
   *   fullSync: false,
   *   schoolIds: ['school-1', 'school-2']
   * });
   * ```
   */
  async syncStudents(data: SyncStudentsRequest): Promise<SyncLog> {
    try {
      // Validate request data
      syncStudentsSchema.parse(data);

      const response = await this.client.post<SystemApiResponse<SyncLog>>(
        '/system/sync/students',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Student sync validation failed', 'syncStudents', {}, error);
      }
      throw createApiError(error, 'Failed to initiate student sync');
    }
  }

  /**
   * Cancel active synchronization operation
   * 
   * @param integrationId - Integration ID with active sync to cancel
   * @returns Success confirmation
   * @throws {ApiError} When sync cancellation fails
   */
  async cancelSync(integrationId: string): Promise<void> {
    try {
      await this.client.post(`/system/sync/cancel/${integrationId}`, {});
    } catch (error) {
      throw createApiError(error, `Failed to cancel sync for integration: ${integrationId}`);
    }
  }

  // ==========================================
  // SCHOOL & DISTRICT MANAGEMENT
  // ==========================================

  /**
   * Get all schools with filtering and pagination
   * 
   * @param filters - Optional filters for schools
   * @returns Paginated list of schools
   * @throws {ApiError} When schools fetch fails
   * 
   * @example
   * ```typescript
   * // Get active schools in specific district
   * const districtSchools = await specializedOps.getSchools({
   *   districtId: 'district-123',
   *   isActive: true,
   *   sortBy: 'name',
   *   sortOrder: 'asc'
   * });
   * 
   * // Search schools by name
   * const searchResults = await specializedOps.getSchools({
   *   search: 'Elementary',
   *   limit: 20
   * });
   * ```
   */
  async getSchools(filters?: SchoolFilters): Promise<PaginatedResponse<School>> {
    try {
      const params = filters ? buildUrlParams(filters as Record<string, unknown>) : '';
      const response = await this.client.get<SystemApiResponse<PaginatedResponse<School>>>(
        `/system/schools${params ? '?' + params : ''}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch schools');
    }
  }

  /**
   * Get specific school details
   * 
   * @param schoolId - School ID to retrieve
   * @returns Complete school information
   * @throws {ApiError} When school fetch fails
   */
  async getSchool(schoolId: string): Promise<School> {
    try {
      const response = await this.client.get<SystemApiResponse<School>>(
        `/system/schools/${schoolId}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch school: ${schoolId}`);
    }
  }

  /**
   * Get school statistics and metrics
   * 
   * @param schoolId - School ID to get statistics for
   * @returns School statistics summary
   * @throws {ApiError} When statistics fetch fails
   */
  async getSchoolStatistics(schoolId: string): Promise<SchoolStatistics> {
    try {
      const response = await this.client.get<SystemApiResponse<SchoolStatistics>>(
        `/system/schools/${schoolId}/statistics`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch school statistics: ${schoolId}`);
    }
  }

  /**
   * Create new school with validation
   * 
   * @param data - School creation data
   * @returns Created school information
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When creation fails
   * 
   * @example
   * ```typescript
   * const newSchool = await specializedOps.createSchool({
   *   name: 'Lincoln Elementary School',
   *   code: 'LES',
   *   districtId: 'district-123',
   *   address: {
   *     street: '123 Main St',
   *     city: 'Springfield',
   *     state: 'IL',
   *     zipCode: '62701'
   *   },
   *   phone: '(555) 123-4567',
   *   email: 'admin@lincoln.edu',
   *   principal: 'Jane Smith'
   * });
   * ```
   */
  async createSchool(data: CreateSchoolRequest): Promise<School> {
    try {
      // Validate request data
      createSchoolSchema.parse(data);

      const response = await this.client.post<SystemApiResponse<School>>(
        '/system/schools',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('School creation validation failed', 'school', {}, error);
      }
      throw createApiError(error, 'Failed to create school');
    }
  }

  /**
   * Update existing school
   * 
   * @param schoolId - School ID to update
   * @param data - Updated school data
   * @returns Updated school information
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When update fails
   */
  async updateSchool(schoolId: string, data: UpdateSchoolRequest): Promise<School> {
    try {
      // Validate request data
      updateSchoolSchema.parse(data);

      const response = await this.client.put<SystemApiResponse<School>>(
        `/system/schools/${schoolId}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('School update validation failed', 'school', { id: [schoolId] }, error);
      }
      throw createApiError(error, `Failed to update school: ${schoolId}`);
    }
  }

  /**
   * Delete school (soft delete - marks as inactive)
   * 
   * @param schoolId - School ID to delete
   * @throws {ApiError} When deletion fails
   */
  async deleteSchool(schoolId: string): Promise<void> {
    try {
      await this.client.delete(`/system/schools/${schoolId}`);
    } catch (error) {
      throw createApiError(error, `Failed to delete school: ${schoolId}`);
    }
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  /**
   * Bulk update school settings
   * 
   * @param updates - Array of school updates with IDs
   * @returns Bulk operation result summary
   * @throws {ApiError} When bulk update fails
   * 
   * @example
   * ```typescript
   * const result = await specializedOps.bulkUpdateSchools([
   *   { id: 'school-1', data: { isActive: false } },
   *   { id: 'school-2', data: { principal: 'New Principal' } }
   * ]);
   * 
   * console.log(`Updated ${result.successful}/${result.total} schools`);
   * ```
   */
  async bulkUpdateSchools(
    updates: Array<{ id: string; data: UpdateSchoolRequest }>
  ): Promise<BulkOperationResult> {
    try {
      const response = await this.client.post<SystemApiResponse<BulkOperationResult>>(
        '/system/schools/bulk-update',
        { updates }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to perform bulk school update');
    }
  }

  /**
   * Bulk delete schools (soft delete)
   * 
   * @param schoolIds - Array of school IDs to delete
   * @returns Bulk operation result summary
   * @throws {ApiError} When bulk delete fails
   */
  async bulkDeleteSchools(schoolIds: string[]): Promise<BulkOperationResult> {
    try {
      const response = await this.client.post<SystemApiResponse<BulkOperationResult>>(
        '/system/schools/bulk-delete',
        { schoolIds }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to perform bulk school delete');
    }
  }

  // ==========================================
  // AUDIT & COMPLIANCE OPERATIONS
  // ==========================================

  /**
   * Get configuration change audit logs
   * 
   * @param filters - Optional filters for audit logs
   * @returns Paginated list of configuration change audits
   * @throws {ApiError} When audit logs fetch fails
   * 
   * @example
   * ```typescript
   * // Get recent configuration changes by specific user
   * const userChanges = await specializedOps.getConfigurationAudit({
   *   changedBy: 'user-123',
   *   dateFrom: '2025-11-01',
   *   limit: 50
   * });
   * ```
   */
  async getConfigurationAudit(filters?: FilterOptions): Promise<PaginatedResponse<ConfigurationAudit>> {
    try {
      const params = filters ? buildUrlParams(filters as Record<string, unknown>) : '';
      const response = await this.client.get<SystemApiResponse<PaginatedResponse<ConfigurationAudit>>>(
        `/system/audit/configuration${params ? '?' + params : ''}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch configuration audit logs');
    }
  }

  /**
   * Get feature flag change audit logs
   * 
   * @param filters - Optional filters for feature flag audits
   * @returns Paginated list of feature flag change audits
   * @throws {ApiError} When audit logs fetch fails
   */
  async getFeatureFlagAudit(filters?: FilterOptions): Promise<PaginatedResponse<FeatureFlagAudit>> {
    try {
      const params = filters ? buildUrlParams(filters as Record<string, unknown>) : '';
      const response = await this.client.get<SystemApiResponse<PaginatedResponse<FeatureFlagAudit>>>(
        `/system/audit/feature-flags${params ? '?' + params : ''}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch feature flag audit logs');
    }
  }

  /**
   * Get integration operation audit logs
   * 
   * @param filters - Optional filters for integration audits
   * @returns Paginated list of integration operation audits
   * @throws {ApiError} When audit logs fetch fails
   */
  async getIntegrationAudit(filters?: FilterOptions): Promise<PaginatedResponse<IntegrationAudit>> {
    try {
      const params = filters ? buildUrlParams(filters as Record<string, unknown>) : '';
      const response = await this.client.get<SystemApiResponse<PaginatedResponse<IntegrationAudit>>>(
        `/system/audit/integrations${params ? '?' + params : ''}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch integration audit logs');
    }
  }

  // ==========================================
  // ADVANCED INTEGRATION OPERATIONS
  // ==========================================

  /**
   * Get integrations with advanced filtering
   * 
   * @param filters - Integration filter options
   * @returns Paginated list of integrations matching filters
   * @throws {ApiError} When integrations fetch fails
   * 
   * @example
   * ```typescript
   * // Get all active SIS integrations with sync enabled
   * const sisIntegrations = await specializedOps.getIntegrationsFiltered({
   *   type: 'SIS',
   *   status: 'ACTIVE',
   *   syncEnabled: true,
   *   sortBy: 'name'
   * });
   * ```
   */
  async getIntegrationsFiltered(filters?: IntegrationFilters): Promise<PaginatedResponse<Integration>> {
    try {
      const params = filters ? buildUrlParams(filters as Record<string, unknown>) : '';
      const response = await this.client.get<SystemApiResponse<PaginatedResponse<Integration>>>(
        `/system/integrations/filtered${params ? '?' + params : ''}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch filtered integrations');
    }
  }

  /**
   * Bulk test multiple integrations
   * 
   * @param integrationIds - Array of integration IDs to test
   * @returns Bulk test results
   * @throws {ApiError} When bulk test fails
   */
  async bulkTestIntegrations(integrationIds: string[]): Promise<BulkOperationResult> {
    try {
      const response = await this.client.post<SystemApiResponse<BulkOperationResult>>(
        '/system/integrations/bulk-test',
        { integrationIds }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to perform bulk integration test');
    }
  }

  /**
   * Reset integration credentials (generates new tokens/keys)
   * 
   * @param integrationId - Integration ID to reset credentials for
   * @returns Success confirmation with new credential metadata
   * @throws {ApiError} When credential reset fails
   */
  async resetIntegrationCredentials(integrationId: string): Promise<{ message: string; resetAt: string }> {
    try {
      const response = await this.client.post<SystemApiResponse<{ message: string; resetAt: string }>>(
        `/system/integrations/${integrationId}/reset-credentials`,
        {}
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to reset credentials for integration: ${integrationId}`);
    }
  }

  // ==========================================
  // SYSTEM MAINTENANCE OPERATIONS
  // ==========================================

  /**
   * Trigger system maintenance mode
   * 
   * @param enabled - Whether to enable or disable maintenance mode
   * @param message - Optional maintenance message for users
   * @returns Maintenance mode status
   * @throws {ApiError} When maintenance mode toggle fails
   */
  async setMaintenanceMode(enabled: boolean, message?: string): Promise<{ enabled: boolean; message?: string }> {
    try {
      const response = await this.client.post<SystemApiResponse<{ enabled: boolean; message?: string }>>(
        '/system/maintenance',
        { enabled, message }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to set maintenance mode');
    }
  }

  /**
   * Clear system caches
   * 
   * @param cacheTypes - Optional array of specific cache types to clear
   * @returns Cache clearing results
   * @throws {ApiError} When cache clearing fails
   */
  async clearCaches(cacheTypes?: string[]): Promise<{ cleared: string[]; failed: string[] }> {
    try {
      const response = await this.client.post<SystemApiResponse<{ cleared: string[]; failed: string[] }>>(
        '/system/cache/clear',
        { cacheTypes }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to clear system caches');
    }
  }

  /**
   * Generate system health report
   * 
   * @param includeMetrics - Whether to include detailed performance metrics
   * @returns Comprehensive system health report
   * @throws {ApiError} When health report generation fails
   */
  async generateHealthReport(includeMetrics: boolean = true): Promise<{
    timestamp: string;
    overall: string;
    components: Record<string, unknown>;
    metrics?: Record<string, unknown>;
    recommendations: string[];
  }> {
    try {
      const response = await this.client.post<SystemApiResponse<{
        timestamp: string;
        overall: string;
        components: Record<string, unknown>;
        metrics?: Record<string, unknown>;
        recommendations: string[];
      }>>(
        '/system/health/report',
        { includeMetrics }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to generate health report');
    }
  }
}

/**
 * Factory function to create SystemSpecializedOperations instance
 * 
 * @param client - Configured ApiClient with authentication and resilience patterns
 * @returns SystemSpecializedOperations instance ready for use
 */
export function createSystemSpecializedOperations(client: ApiClient): SystemSpecializedOperations {
  return new SystemSpecializedOperations(client);
}
