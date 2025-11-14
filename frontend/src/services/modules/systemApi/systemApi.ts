/**
 * @fileoverview System API Main Service Class
 * 
 * Provides a unified interface for all system administration operations by combining
 * core operations and specialized operations into a single, cohesive API service.
 * 
 * This class serves as the main entry point for system administration functionality,
 * maintaining backward compatibility while providing a clean, modular architecture.
 * 
 * @module systemApi/systemApi
 * @version 1.0.0
 * @since 2025-11-11
 */

import type { ApiClient } from '../../core/ApiClient';
import { SystemCoreOperations, createSystemCoreOperations } from './core-operations';
import { SystemSpecializedOperations, createSystemSpecializedOperations } from './specialized-operations';

// Re-export all types for convenience
export type {
  // System Configuration
  SystemConfig,
  UpdateSystemConfigRequest,
  ConfigCategory,
  ConfigValueType,

  // Feature Flags
  FeatureFlag,
  CreateFeatureFlagRequest,
  UpdateFeatureFlagRequest,
  FeatureFlagStatus,

  // Grade Transitions
  GradeTransitionConfig,
  ExecuteGradeTransitionRequest,
  GradeTransitionResult,
  GradeTransitionStatus,

  // System Health
  SystemHealth,
  ComponentHealth,
  HealthCheckResponse,
  HealthStatus,
  ComponentStatus,

  // Integrations
  Integration,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  IntegrationTestResult,
  IntegrationType,
  IntegrationStatus,

  // Data Synchronization
  SyncStatus,
  SyncLog,
  SyncStudentsRequest,
  SyncProgress,
  SyncStatusValue,

  // Schools & Districts
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  SchoolStatistics,
  Address,

  // API Response Types
  SystemApiResponse,
  PaginatedResponse,
  BulkOperationResult,

  // Filter Types
  FilterOptions,
  IntegrationFilters,
  SchoolFilters,
  SyncLogFilters,

  // Audit Types
  ConfigurationAudit,
  FeatureFlagAudit,
  IntegrationAudit,
} from './types';

/**
 * Main SystemApi service class providing comprehensive system administration capabilities
 * 
 * This class combines core and specialized operations to provide a unified interface
 * for all system administration tasks including configuration management, feature flags,
 * integrations, data synchronization, school management, and health monitoring.
 * 
 * ## Architecture
 * 
 * The SystemApi is built using a modular architecture:
 * - **Core Operations**: Basic CRUD operations and fundamental system tasks
 * - **Specialized Operations**: Advanced workflows, bulk operations, and complex scenarios
 * 
 * ## Key Features
 * 
 * ### Configuration Management
 * - System-wide configuration key-value store with categorization
 * - Type-safe value storage (STRING, NUMBER, BOOLEAN, JSON)
 * - Public vs private configuration separation
 * - Audit trail for configuration changes
 * 
 * ### Feature Flag System
 * - Feature toggle management with gradual rollout capabilities
 * - User/role/school-specific enablement with percentage-based distribution
 * - Real-time feature flag status checking
 * - Metadata support for complex feature configurations
 * 
 * ### Integration Management
 * - Multi-protocol integration support (SIS, EHR, Pharmacy, Email, SMS, etc.)
 * - Secure credential management with encryption
 * - Connection testing and health monitoring
 * - Automated and manual data synchronization
 * 
 * ### System Health Monitoring
 * - Component-level health checks (database, redis, storage, services)
 * - Performance metrics tracking (response times, error rates, resource usage)
 * - System-wide status aggregation and reporting
 * 
 * ### School & District Administration
 * - Multi-tenant school hierarchy management
 * - School-specific configuration and settings
 * - Contact information and administrative details
 * - Statistical reporting and analytics
 * 
 * ## Security Features
 * 
 * - **Admin-Only Access**: All operations require appropriate administrative privileges
 * - **Audit Logging**: Complete audit trail for all system changes
 * - **Credential Security**: Encrypted storage and secure transmission of integration credentials
 * - **Rate Limiting**: Protection against abuse with configurable limits
 * - **HIPAA Compliance**: Healthcare data protection and compliance tracking
 * 
 * @example
 * ```typescript
 * import { createSystemApi } from '@/services/modules/systemApi';
 * import { createApiClient } from '@/services/core/ApiClient';
 * 
 * // Initialize API client and SystemApi
 * const client = createApiClient();
 * const systemApi = createSystemApi(client);
 * 
 * // Configuration management
 * const config = await systemApi.updateConfig('email.provider', {
 *   value: 'sendgrid',
 *   description: 'Email service provider'
 * });
 * 
 * // Feature flag management
 * const feature = await systemApi.createFeatureFlag({
 *   name: 'New Medication UI',
 *   key: 'new-medication-ui',
 *   isEnabled: true,
 *   enabledPercentage: 25
 * });
 * 
 * // Integration management
 * const integration = await systemApi.createIntegration({
 *   name: 'PowerSchool SIS',
 *   type: 'SIS',
 *   provider: 'PowerSchool',
 *   config: { apiUrl: 'https://api.powerschool.com' },
 *   syncEnabled: true
 * });
 * 
 * // Health monitoring
 * const health = await systemApi.getHealth();
 * console.log(`System status: ${health.status}`);
 * ```
 */
export class SystemApi {
  private readonly coreOps: SystemCoreOperations;
  private readonly specializedOps: SystemSpecializedOperations;

  constructor(client: ApiClient) {
    this.coreOps = createSystemCoreOperations(client);
    this.specializedOps = createSystemSpecializedOperations(client);
  }

  // ==========================================
  // SYSTEM CONFIGURATION OPERATIONS
  // ==========================================

  /**
   * Get all system configuration settings
   * @param category - Optional configuration category filter
   * @returns Array of system configuration entries
   */
  async getConfig(category?: string) {
    return this.coreOps.getConfig(category);
  }

  /**
   * Get specific configuration value by key
   * @param key - Configuration key to retrieve
   * @returns System configuration entry
   */
  async getConfigValue(key: string) {
    return this.coreOps.getConfigValue(key);
  }

  /**
   * Update system configuration value
   * @param key - Configuration key to update
   * @param data - Updated configuration data
   * @returns Updated system configuration entry
   */
  async updateConfig(key: string, data: import('./types').UpdateSystemConfigRequest) {
    return this.coreOps.updateConfig(key, data);
  }

  // ==========================================
  // FEATURE FLAG OPERATIONS
  // ==========================================

  /**
   * Get all feature flags
   * @returns Array of feature flag configurations
   */
  async getFeatureFlags() {
    return this.coreOps.getFeatureFlags();
  }

  /**
   * Get specific feature flag by key
   * @param key - Feature flag key
   * @returns Feature flag configuration
   */
  async getFeatureFlag(key: string) {
    return this.coreOps.getFeatureFlag(key);
  }

  /**
   * Check if feature is enabled for specific user/context
   * @param key - Feature flag key
   * @param userId - Optional user ID to check enablement for
   * @param context - Optional additional context (school ID, role, etc.)
   * @returns Feature enablement status with reason
   */
  async isFeatureEnabled(key: string, userId?: string, context?: Record<string, string>) {
    return this.coreOps.isFeatureEnabled(key, userId, context);
  }

  /**
   * Create new feature flag
   * @param data - Feature flag creation data
   * @returns Created feature flag
   */
  async createFeatureFlag(data: import('./types').CreateFeatureFlagRequest) {
    return this.coreOps.createFeatureFlag(data);
  }

  /**
   * Update existing feature flag
   * @param key - Feature flag key to update
   * @param data - Updated feature flag data
   * @returns Updated feature flag
   */
  async updateFeatureFlag(key: string, data: import('./types').UpdateFeatureFlagRequest) {
    return this.coreOps.updateFeatureFlag(key, data);
  }

  /**
   * Delete feature flag
   * @param key - Feature flag key to delete
   */
  async deleteFeatureFlag(key: string) {
    return this.coreOps.deleteFeatureFlag(key);
  }

  // ==========================================
  // GRADE TRANSITION OPERATIONS
  // ==========================================

  /**
   * Get current grade transition configuration
   * @returns Grade transition configuration
   */
  async getGradeTransitionConfig() {
    return this.coreOps.getGradeTransitionConfig();
  }

  /**
   * Execute grade transition for academic year
   * @param data - Grade transition execution parameters
   * @returns Grade transition result with affected students
   */
  async executeGradeTransition(data: import('./types').ExecuteGradeTransitionRequest) {
    return this.coreOps.executeGradeTransition(data);
  }

  // ==========================================
  // SYSTEM HEALTH MONITORING
  // ==========================================

  /**
   * Get overall system health status
   * @returns Complete system health report
   */
  async getHealth() {
    return this.coreOps.getHealth();
  }

  /**
   * Get health status for specific component
   * @param component - Component name to check
   * @returns Component health details
   */
  async getComponentHealth(component: string) {
    return this.coreOps.getComponentHealth(component);
  }

  /**
   * Generate comprehensive system health report
   * @param includeMetrics - Whether to include detailed performance metrics
   * @returns Comprehensive system health report
   */
  async generateHealthReport(includeMetrics: boolean = true) {
    return this.specializedOps.generateHealthReport(includeMetrics);
  }

  // ==========================================
  // INTEGRATION MANAGEMENT
  // ==========================================

  /**
   * Get all system integrations
   * @param type - Optional integration type filter
   * @returns Array of integration configurations
   */
  async getIntegrations(type?: string) {
    return this.coreOps.getIntegrations(type);
  }

  /**
   * Get integrations with advanced filtering
   * @param filters - Integration filter options
   * @returns Paginated list of integrations matching filters
   */
  async getIntegrationsFiltered(filters?: import('./types').IntegrationFilters) {
    return this.specializedOps.getIntegrationsFiltered(filters);
  }

  /**
   * Get specific integration by ID
   * @param id - Integration ID
   * @returns Integration configuration (credentials excluded)
   */
  async getIntegration(id: string) {
    return this.coreOps.getIntegration(id);
  }

  /**
   * Create new integration
   * @param data - Integration creation data
   * @returns Created integration (credentials excluded from response)
   */
  async createIntegration(data: import('./types').CreateIntegrationRequest) {
    return this.coreOps.createIntegration(data);
  }

  /**
   * Update existing integration
   * @param id - Integration ID to update
   * @param data - Updated integration data
   * @returns Updated integration (credentials excluded from response)
   */
  async updateIntegration(id: string, data: import('./types').UpdateIntegrationRequest) {
    return this.coreOps.updateIntegration(id, data);
  }

  /**
   * Delete integration
   * @param id - Integration ID to delete
   */
  async deleteIntegration(id: string) {
    return this.coreOps.deleteIntegration(id);
  }

  /**
   * Test integration connection
   * @param id - Integration ID to test
   * @returns Test result with connection status and performance metrics
   */
  async testIntegration(id: string) {
    return this.coreOps.testIntegration(id);
  }

  /**
   * Bulk test multiple integrations
   * @param integrationIds - Array of integration IDs to test
   * @returns Bulk test results
   */
  async bulkTestIntegrations(integrationIds: string[]) {
    return this.specializedOps.bulkTestIntegrations(integrationIds);
  }

  /**
   * Reset integration credentials
   * @param integrationId - Integration ID to reset credentials for
   * @returns Success confirmation with new credential metadata
   */
  async resetIntegrationCredentials(integrationId: string) {
    return this.specializedOps.resetIntegrationCredentials(integrationId);
  }

  // ==========================================
  // DATA SYNCHRONIZATION
  // ==========================================

  /**
   * Get sync status for all active integrations
   * @returns Array of current synchronization statuses
   */
  async getSyncStatus() {
    return this.specializedOps.getSyncStatus();
  }

  /**
   * Get sync status for specific integration
   * @param integrationId - Integration ID to check
   * @returns Current synchronization status for the integration
   */
  async getIntegrationSyncStatus(integrationId: string) {
    return this.specializedOps.getIntegrationSyncStatus(integrationId);
  }

  /**
   * Get detailed sync progress for active synchronization
   * @param integrationId - Integration ID with active sync
   * @returns Detailed progress information
   */
  async getSyncProgress(integrationId: string) {
    return this.specializedOps.getSyncProgress(integrationId);
  }

  /**
   * Get historical sync logs with filtering options
   * @param filters - Optional filters for sync logs
   * @returns Paginated list of sync operation logs
   */
  async getSyncLogs(filters?: import('./types').SyncLogFilters) {
    return this.specializedOps.getSyncLogs(filters);
  }

  /**
   * Get specific sync log details
   * @param logId - Sync log ID to retrieve
   * @returns Detailed sync log information
   */
  async getSyncLog(logId: string) {
    return this.specializedOps.getSyncLog(logId);
  }

  /**
   * Trigger student data synchronization
   * @param data - Sync request parameters
   * @returns Sync operation log entry
   */
  async syncStudents(data: import('./types').SyncStudentsRequest) {
    return this.specializedOps.syncStudents(data);
  }

  /**
   * Cancel active synchronization operation
   * @param integrationId - Integration ID with active sync to cancel
   */
  async cancelSync(integrationId: string) {
    return this.specializedOps.cancelSync(integrationId);
  }

  // ==========================================
  // SCHOOL & DISTRICT MANAGEMENT
  // ==========================================

  /**
   * Get all schools with filtering and pagination
   * @param filters - Optional filters for schools
   * @returns Paginated list of schools
   */
  async getSchools(filters?: import('./types').SchoolFilters) {
    return this.specializedOps.getSchools(filters);
  }

  /**
   * Get specific school details
   * @param schoolId - School ID to retrieve
   * @returns Complete school information
   */
  async getSchool(schoolId: string) {
    return this.specializedOps.getSchool(schoolId);
  }

  /**
   * Get school statistics and metrics
   * @param schoolId - School ID to get statistics for
   * @returns School statistics summary
   */
  async getSchoolStatistics(schoolId: string) {
    return this.specializedOps.getSchoolStatistics(schoolId);
  }

  /**
   * Create new school
   * @param data - School creation data
   * @returns Created school information
   */
  async createSchool(data: import('./types').CreateSchoolRequest) {
    return this.specializedOps.createSchool(data);
  }

  /**
   * Update existing school
   * @param schoolId - School ID to update
   * @param data - Updated school data
   * @returns Updated school information
   */
  async updateSchool(schoolId: string, data: import('./types').UpdateSchoolRequest) {
    return this.specializedOps.updateSchool(schoolId, data);
  }

  /**
   * Delete school (soft delete - marks as inactive)
   * @param schoolId - School ID to delete
   */
  async deleteSchool(schoolId: string) {
    return this.specializedOps.deleteSchool(schoolId);
  }

  /**
   * Bulk update school settings
   * @param updates - Array of school updates with IDs
   * @returns Bulk operation result summary
   */
  async bulkUpdateSchools(updates: Array<{ id: string; data: import('./types').UpdateSchoolRequest }>) {
    return this.specializedOps.bulkUpdateSchools(updates);
  }

  /**
   * Bulk delete schools (soft delete)
   * @param schoolIds - Array of school IDs to delete
   * @returns Bulk operation result summary
   */
  async bulkDeleteSchools(schoolIds: string[]) {
    return this.specializedOps.bulkDeleteSchools(schoolIds);
  }

  // ==========================================
  // AUDIT & COMPLIANCE
  // ==========================================

  /**
   * Get configuration change audit logs
   * @param filters - Optional filters for audit logs
   * @returns Paginated list of configuration change audits
   */
  async getConfigurationAudit(filters?: import('./types').FilterOptions) {
    return this.specializedOps.getConfigurationAudit(filters);
  }

  /**
   * Get feature flag change audit logs
   * @param filters - Optional filters for feature flag audits
   * @returns Paginated list of feature flag change audits
   */
  async getFeatureFlagAudit(filters?: import('./types').FilterOptions) {
    return this.specializedOps.getFeatureFlagAudit(filters);
  }

  /**
   * Get integration operation audit logs
   * @param filters - Optional filters for integration audits
   * @returns Paginated list of integration operation audits
   */
  async getIntegrationAudit(filters?: import('./types').FilterOptions) {
    return this.specializedOps.getIntegrationAudit(filters);
  }

  // ==========================================
  // SYSTEM MAINTENANCE
  // ==========================================

  /**
   * Trigger system maintenance mode
   * @param enabled - Whether to enable or disable maintenance mode
   * @param message - Optional maintenance message for users
   * @returns Maintenance mode status
   */
  async setMaintenanceMode(enabled: boolean, message?: string) {
    return this.specializedOps.setMaintenanceMode(enabled, message);
  }

  /**
   * Clear system caches
   * @param cacheTypes - Optional array of specific cache types to clear
   * @returns Cache clearing results
   */
  async clearCaches(cacheTypes?: string[]) {
    return this.specializedOps.clearCaches(cacheTypes);
  }
}

/**
 * Factory function to create SystemApi instance
 * 
 * @param client - Configured ApiClient with authentication and resilience patterns
 * @returns SystemApi instance ready for use
 * 
 * @example
 * ```typescript
 * import { createApiClient } from '@/services/core/ApiClient';
 * import { createSystemApi } from '@/services/modules/systemApi';
 * 
 * const client = createApiClient({
 *   baseURL: process.env.NEXT_PUBLIC_API_URL,
 *   timeout: 30000
 * });
 * 
 * const systemApi = createSystemApi(client);
 * ```
 */
export function createSystemApi(client: ApiClient): SystemApi {
  return new SystemApi(client);
}
