/**
 * @fileoverview System API Core Operations
 *
 * @deprecated This module is deprecated and will be removed on 2026-06-30.
 * Please migrate to the new Server Actions architecture instead.
 *
 * MIGRATION GUIDE:
 * - Health checks → @/lib/actions/admin.monitoring
 * - Configuration → @/lib/actions/admin.settings
 * - System stats → @/lib/actions/dashboard.actions
 *
 * See module documentation for detailed examples.
 *
 * Provides core system administration operations including configuration management,
 * feature flag operations, grade transitions, system health monitoring, and basic
 * integration management.
 *
 * @module systemApi/core-operations
 * @version 1.0.0
 * @since 2025-11-11
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, buildUrlParams } from '../../utils/apiUtils';
import { createApiError, createValidationError } from '../../core/errors';
import { z } from 'zod';

// Import validation schemas
import {
  updateSystemConfigSchema,
  createFeatureFlagSchema,
  updateFeatureFlagSchema,
  executeGradeTransitionSchema,
  createIntegrationSchema,
  updateIntegrationSchema,
} from './validation';

// Import type definitions
import type {
  SystemConfig,
  UpdateSystemConfigRequest,
  FeatureFlag,
  CreateFeatureFlagRequest,
  UpdateFeatureFlagRequest,
  FeatureFlagStatus,
  GradeTransitionConfig,
  ExecuteGradeTransitionRequest,
  GradeTransitionResult,
  SystemHealth,
  ComponentHealth,
  HealthCheckResponse,
  Integration,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
  IntegrationTestResult,
  SystemApiResponse,
} from './types';

/**
 * Core system operations class containing basic administration functions
 * 
 * Handles fundamental system administration tasks with proper error handling,
 * validation, and audit logging capabilities.
 */
export class SystemCoreOperations {
  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // SYSTEM CONFIGURATION MANAGEMENT
  // ==========================================

  /**
   * Get all system configuration settings
   * 
   * @param category - Optional configuration category filter
   * @returns Array of system configuration entries
   * @throws {ApiError} When configuration fetch fails
   * 
   * @example
   * ```typescript
   * // Get all configurations
   * const allConfig = await coreOps.getConfig();
   * 
   * // Get security-specific configurations
   * const securityConfig = await coreOps.getConfig('SECURITY');
   * ```
   */
  async getConfig(category?: string): Promise<SystemConfig[]> {
    try {
      const params = category ? buildUrlParams({ category }) : '';
      const response = await this.client.get<SystemApiResponse<SystemConfig[]>>(
        `/system/config${params ? '?' + params : ''}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system configuration');
    }
  }

  /**
   * Get specific configuration value by key
   * 
   * @param key - Configuration key to retrieve
   * @returns System configuration entry
   * @throws {ApiError} When configuration key not found or fetch fails
   */
  async getConfigValue(key: string): Promise<SystemConfig> {
    try {
      const response = await this.client.get<SystemApiResponse<SystemConfig>>(
        `/system/config/${encodeURIComponent(key)}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch configuration value for key: ${key}`);
    }
  }

  /**
   * Update system configuration value
   * 
   * @param key - Configuration key to update
   * @param data - Updated configuration data
   * @returns Updated system configuration entry
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When update operation fails
   * 
   * @example
   * ```typescript
   * const updatedConfig = await coreOps.updateConfig('email.provider', {
   *   value: 'sendgrid',
   *   description: 'Email service provider'
   * });
   * ```
   */
  async updateConfig(key: string, data: UpdateSystemConfigRequest): Promise<SystemConfig> {
    try {
      // Validate request data
      updateSystemConfigSchema.parse(data);

      const response = await this.client.put<SystemApiResponse<SystemConfig>>(
        `/system/config/${encodeURIComponent(key)}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Configuration update validation failed', 'systemConfig', { key: [key] }, error);
      }
      throw createApiError(error, `Failed to update configuration: ${key}`);
    }
  }

  // ==========================================
  // FEATURE FLAG MANAGEMENT
  // ==========================================

  /**
   * Get all feature flags
   * 
   * @returns Array of feature flag configurations
   * @throws {ApiError} When feature flags fetch fails
   */
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const response = await this.client.get<SystemApiResponse<FeatureFlag[]>>(
        '/system/features'
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch feature flags');
    }
  }

  /**
   * Get specific feature flag by key
   * 
   * @param key - Feature flag key
   * @returns Feature flag configuration
   * @throws {ApiError} When feature flag not found or fetch fails
   */
  async getFeatureFlag(key: string): Promise<FeatureFlag> {
    try {
      const response = await this.client.get<SystemApiResponse<FeatureFlag>>(
        `/system/features/${encodeURIComponent(key)}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch feature flag: ${key}`);
    }
  }

  /**
   * Check if feature is enabled for specific user/context
   * 
   * @param key - Feature flag key
   * @param userId - Optional user ID to check enablement for
   * @param context - Optional additional context (school ID, role, etc.)
   * @returns Feature enablement status with reason
   * @throws {ApiError} When feature status check fails
   * 
   * @example
   * ```typescript
   * // Check for specific user
   * const userStatus = await coreOps.isFeatureEnabled('new-ui', 'user-123');
   * 
   * // Check with additional context
   * const status = await coreOps.isFeatureEnabled('beta-features', 'user-123', {
   *   schoolId: 'school-456',
   *   role: 'nurse'
   * });
   * ```
   */
  async isFeatureEnabled(
    key: string, 
    userId?: string, 
    context?: Record<string, string>
  ): Promise<FeatureFlagStatus> {
    try {
      const params = buildUrlParams({ 
        userId, 
        ...context 
      });
      
      const response = await this.client.get<SystemApiResponse<FeatureFlagStatus>>(
        `/system/features/${encodeURIComponent(key)}/enabled${params ? '?' + params : ''}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to check feature status: ${key}`);
    }
  }

  /**
   * Create new feature flag
   * 
   * @param data - Feature flag creation data
   * @returns Created feature flag
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When creation fails
   * 
   * @example
   * ```typescript
   * const flag = await coreOps.createFeatureFlag({
   *   name: 'New Medication UI',
   *   key: 'new-medication-ui',
   *   description: 'Enable new medication interface',
   *   isEnabled: true,
   *   enabledPercentage: 25
   * });
   * ```
   */
  async createFeatureFlag(data: CreateFeatureFlagRequest): Promise<FeatureFlag> {
    try {
      // Validate request data
      createFeatureFlagSchema.parse(data);

      const response = await this.client.post<SystemApiResponse<FeatureFlag>>(
        '/system/features',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Feature flag creation validation failed', 'featureFlag', {}, error);
      }
      throw createApiError(error, 'Failed to create feature flag');
    }
  }

  /**
   * Update existing feature flag
   * 
   * @param key - Feature flag key to update
   * @param data - Updated feature flag data
   * @returns Updated feature flag
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When update fails
   */
  async updateFeatureFlag(key: string, data: UpdateFeatureFlagRequest): Promise<FeatureFlag> {
    try {
      // Validate request data
      updateFeatureFlagSchema.parse(data);

      const response = await this.client.put<SystemApiResponse<FeatureFlag>>(
        `/system/features/${encodeURIComponent(key)}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Feature flag update validation failed', 'featureFlag', { key: [key] }, error);
      }
      throw createApiError(error, `Failed to update feature flag: ${key}`);
    }
  }

  /**
   * Delete feature flag
   * 
   * @param key - Feature flag key to delete
   * @throws {ApiError} When deletion fails
   */
  async deleteFeatureFlag(key: string): Promise<void> {
    try {
      await this.client.delete(`/system/features/${encodeURIComponent(key)}`);
    } catch (error) {
      throw createApiError(error, `Failed to delete feature flag: ${key}`);
    }
  }

  // ==========================================
  // GRADE TRANSITION OPERATIONS
  // ==========================================

  /**
   * Get current grade transition configuration
   * 
   * @returns Grade transition configuration
   * @throws {ApiError} When configuration fetch fails
   */
  async getGradeTransitionConfig(): Promise<GradeTransitionConfig> {
    try {
      const response = await this.client.get<SystemApiResponse<GradeTransitionConfig>>(
        '/system/grade-transition'
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch grade transition configuration');
    }
  }

  /**
   * Execute grade transition for academic year
   * 
   * @param data - Grade transition execution parameters
   * @returns Grade transition result with affected students
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When execution fails
   * 
   * @example
   * ```typescript
   * // Dry run to validate transition
   * const dryRunResult = await coreOps.executeGradeTransition({
   *   academicYear: '2024-2025',
   *   transitionDate: '2025-06-15',
   *   dryRun: true
   * });
   * 
   * // Execute actual transition
   * const result = await coreOps.executeGradeTransition({
   *   academicYear: '2024-2025',
   *   transitionDate: '2025-06-15',
   *   autoPromote: true
   * });
   * ```
   */
  async executeGradeTransition(data: ExecuteGradeTransitionRequest): Promise<GradeTransitionResult> {
    try {
      // Validate request data
      executeGradeTransitionSchema.parse(data);

      const response = await this.client.post<SystemApiResponse<GradeTransitionResult>>(
        '/system/grade-transition',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Grade transition validation failed', 'gradeTransition', {}, error);
      }
      throw createApiError(error, 'Failed to execute grade transition');
    }
  }

  // ==========================================
  // SYSTEM HEALTH MONITORING
  // ==========================================

  /**
   * Get overall system health status
   * 
   * @returns Complete system health report
   * @throws {ApiError} When health check fails
   * 
   * @example
   * ```typescript
   * const health = await coreOps.getHealth();
   * if (health.status === 'HEALTHY') {
   *   console.log(`System healthy - uptime: ${health.uptime}s`);
   * }
   * ```
   */
  async getHealth(): Promise<SystemHealth> {
    try {
      const response = await this.client.get<SystemApiResponse<SystemHealth>>(
        '/system/health'
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system health');
    }
  }

  /**
   * Get health status for specific component
   * 
   * @param component - Component name to check (database, redis, storage, etc.)
   * @returns Component health details
   * @throws {ApiError} When component health check fails
   */
  async getComponentHealth(component: string): Promise<HealthCheckResponse> {
    try {
      const response = await this.client.get<SystemApiResponse<HealthCheckResponse>>(
        `/system/health/components/${encodeURIComponent(component)}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to check health for component: ${component}`);
    }
  }

  // ==========================================
  // BASIC INTEGRATION MANAGEMENT
  // ==========================================

  /**
   * Get all system integrations
   * 
   * @param type - Optional integration type filter
   * @returns Array of integration configurations
   * @throws {ApiError} When integrations fetch fails
   */
  async getIntegrations(type?: string): Promise<Integration[]> {
    try {
      const params = type ? buildUrlParams({ type }) : '';
      const response = await this.client.get<SystemApiResponse<Integration[]>>(
        `/system/integrations${params ? '?' + params : ''}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch integrations');
    }
  }

  /**
   * Get specific integration by ID
   * 
   * @param id - Integration ID
   * @returns Integration configuration (credentials excluded)
   * @throws {ApiError} When integration not found or fetch fails
   */
  async getIntegration(id: string): Promise<Integration> {
    try {
      const response = await this.client.get<SystemApiResponse<Integration>>(
        `/system/integrations/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to fetch integration: ${id}`);
    }
  }

  /**
   * Create new integration
   * 
   * @param data - Integration creation data
   * @returns Created integration (credentials excluded from response)
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When creation fails
   * 
   * @example
   * ```typescript
   * const integration = await coreOps.createIntegration({
   *   name: 'PowerSchool SIS',
   *   type: 'SIS',
   *   provider: 'PowerSchool',
   *   config: {
   *     apiUrl: 'https://ps.school.edu/api',
   *     version: 'v3'
   *   },
   *   credentials: {
   *     clientId: 'xxx',
   *     clientSecret: 'yyy'
   *   },
   *   syncEnabled: true,
   *   syncInterval: 60
   * });
   * ```
   */
  async createIntegration(data: CreateIntegrationRequest): Promise<Integration> {
    try {
      // Validate request data
      createIntegrationSchema.parse(data);

      const response = await this.client.post<SystemApiResponse<Integration>>(
        '/system/integrations',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Integration creation validation failed', 'integration', {}, error);
      }
      throw createApiError(error, 'Failed to create integration');
    }
  }

  /**
   * Update existing integration
   * 
   * @param id - Integration ID to update
   * @param data - Updated integration data
   * @returns Updated integration (credentials excluded from response)
   * @throws {ValidationError} When validation fails
   * @throws {ApiError} When update fails
   */
  async updateIntegration(id: string, data: UpdateIntegrationRequest): Promise<Integration> {
    try {
      // Validate request data
      updateIntegrationSchema.parse(data);

      const response = await this.client.put<SystemApiResponse<Integration>>(
        `/system/integrations/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Integration update validation failed', 'integration', { id: [id] }, error);
      }
      throw createApiError(error, `Failed to update integration: ${id}`);
    }
  }

  /**
   * Delete integration
   * 
   * @param id - Integration ID to delete
   * @throws {ApiError} When deletion fails
   */
  async deleteIntegration(id: string): Promise<void> {
    try {
      await this.client.delete(`/system/integrations/${id}`);
    } catch (error) {
      throw createApiError(error, `Failed to delete integration: ${id}`);
    }
  }

  /**
   * Test integration connection
   * 
   * @param id - Integration ID to test
   * @returns Test result with connection status and performance metrics
   * @throws {ApiError} When connection test fails
   * 
   * @example
   * ```typescript
   * const testResult = await coreOps.testIntegration('integration-123');
   * if (testResult.success) {
   *   console.log(`Connection successful in ${testResult.responseTime}ms`);
   * } else {
   *   console.error('Connection failed:', testResult.message);
   * }
   * ```
   */
  async testIntegration(id: string): Promise<IntegrationTestResult> {
    try {
      const response = await this.client.post<SystemApiResponse<IntegrationTestResult>>(
        `/system/integrations/${id}/test`,
        {}
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, `Failed to test integration: ${id}`);
    }
  }
}

/**
 * Factory function to create SystemCoreOperations instance
 * 
 * @param client - Configured ApiClient with authentication and resilience patterns
 * @returns SystemCoreOperations instance ready for use
 */
export function createSystemCoreOperations(client: ApiClient): SystemCoreOperations {
  return new SystemCoreOperations(client);
}
