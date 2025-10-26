/**
 * @fileoverview System Configuration API Service
 *
 * Provides comprehensive system administration, configuration management,
 * integration orchestration, and data synchronization capabilities for
 * enterprise healthcare platform administration.
 *
 * ## Features
 *
 * ### Configuration Management
 * - System-wide configuration key-value store
 * - Category-based organization (GENERAL, SECURITY, NOTIFICATION, etc.)
 * - Type-safe value storage (STRING, NUMBER, BOOLEAN, JSON)
 * - Public vs private configuration separation
 * - Configuration change audit trail
 *
 * ### Feature Flag System
 * - Feature toggle management with gradual rollout
 * - User/role/school-specific enablement
 * - Percentage-based feature distribution
 * - Real-time feature flag checks
 * - Metadata support for feature configuration
 *
 * ### Grade Transition Operations
 * - Academic year student grade promotions
 * - Dry-run mode for validation
 * - Bulk student update capabilities
 * - Configurable promotion rules
 * - Status tracking (PENDING, IN_PROGRESS, COMPLETED, FAILED)
 *
 * ### System Health Monitoring
 * - Component health checks (database, redis, storage, email, SMS)
 * - Performance metrics (requests/min, response time, error rate)
 * - Resource utilization (memory, CPU)
 * - Real-time status aggregation
 *
 * ### Integration Management
 * - SIS (Student Information System) integration
 * - EHR (Electronic Health Records) integration
 * - Pharmacy system integration
 * - Email/SMS service providers
 * - Payment gateway integration
 * - Identity provider (SSO/SAML) integration
 *
 * ### Data Synchronization
 * - Scheduled and manual sync operations
 * - Full and incremental sync modes
 * - Sync progress tracking
 * - Error handling and retry logic
 * - Sync history and logging
 *
 * ### School/District Management
 * - Multi-tenant school hierarchy
 * - District-level administration
 * - School-specific settings
 * - Contact information management
 *
 * ## Security & Access Control
 *
 * ### Admin-Only Endpoints
 * All endpoints in this module require admin-level permissions:
 * - SYSTEM_ADMIN role for system-wide operations
 * - DISTRICT_ADMIN role for district-scoped operations
 * - Audit logging for all configuration changes
 * - IP whitelisting for sensitive operations (optional)
 *
 * ### Credential Management
 * - Encrypted credential storage for integrations
 * - Credential rotation support
 * - Never expose credentials in API responses
 * - Secure credential transmission (TLS required)
 *
 * ### Rate Limiting
 * - Configuration reads: 100 requests/minute
 * - Configuration updates: 10 requests/minute
 * - Sync operations: 5 requests/minute (to prevent abuse)
 * - Integration tests: 20 requests/minute
 *
 * ### HIPAA Compliance
 * - All operations are audit logged
 * - PHI access is tracked for compliance reporting
 * - Secure credential storage for external integrations
 * - Data encryption at rest and in transit
 *
 * ## Integration Patterns
 *
 * ### SIS Integration Workflow
 * ```typescript
 * // 1. Create integration configuration
 * const integration = await systemApi.createIntegration({
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
 *   syncInterval: 60 // minutes
 * });
 *
 * // 2. Test connection
 * const testResult = await systemApi.testIntegration(integration.id);
 * if (testResult.success) {
 *   console.log(`Connection successful in ${testResult.responseTime}ms`);
 * }
 *
 * // 3. Trigger sync
 * const syncResult = await systemApi.syncStudents({
 *   integrationId: integration.id,
 *   fullSync: false
 * });
 * ```
 *
 * ### EHR Integration Workflow
 * ```typescript
 * // Configure EHR integration with FHIR support
 * const ehrIntegration = await systemApi.createIntegration({
 *   name: 'Epic MyChart',
 *   type: 'EHR',
 *   provider: 'Epic',
 *   config: {
 *     fhirEndpoint: 'https://fhir.epic.com/R4',
 *     resourceTypes: ['Patient', 'Observation', 'Medication']
 *   },
 *   credentials: {
 *     apiKey: 'xxx'
 *   }
 * });
 * ```
 *
 * ## Usage Examples
 *
 * ### Feature Flag Management
 * ```typescript
 * // Create feature flag with gradual rollout
 * const flag = await systemApi.createFeatureFlag({
 *   name: 'New Medication UI',
 *   key: 'new-medication-ui',
 *   description: 'Enable new medication administration interface',
 *   isEnabled: true,
 *   enabledPercentage: 25, // 25% rollout
 *   metadata: {
 *     rolloutPhase: 'beta',
 *     targetDate: '2025-11-01'
 *   }
 * });
 *
 * // Check if enabled for specific user
 * const isEnabled = await systemApi.isFeatureEnabled('new-medication-ui', userId);
 * ```
 *
 * ### System Configuration
 * ```typescript
 * // Update system configuration
 * const config = await systemApi.updateConfig('email.provider', {
 *   value: 'sendgrid',
 *   description: 'Email service provider'
 * });
 *
 * // Get all security configurations
 * const securityConfig = await systemApi.getConfig('SECURITY');
 * ```
 *
 * @module services/modules/systemApi
 * @see {@link IntegrationApi} for detailed integration management
 * @see {@link AdministrationApi} for school/district management
 */

import type { ApiClient } from '../core/ApiClient';
import { ApiResponse, buildUrlParams } from '../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

// System Configuration
export interface SystemConfig {
  id: string;
  category: string;
  key: string;
  value: string | number | boolean | object;
  valueType: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface UpdateSystemConfigRequest {
  value: string | number | boolean | object;
  description?: string;
}

// Feature Flags
export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description?: string;
  isEnabled: boolean;
  enabledFor?: string[]; // User IDs, role names, or school IDs
  enabledPercentage?: number; // For gradual rollout
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureFlagRequest {
  name: string;
  key: string;
  description?: string;
  isEnabled: boolean;
  enabledFor?: string[];
  enabledPercentage?: number;
  metadata?: Record<string, any>;
}

export interface UpdateFeatureFlagRequest {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  enabledFor?: string[];
  enabledPercentage?: number;
  metadata?: Record<string, any>;
}

// Grade Transitions
export interface GradeTransitionConfig {
  id: string;
  academicYear: string;
  transitionDate: string;
  rules: Array<{
    currentGrade: string;
    nextGrade: string;
    autoPromote: boolean;
  }>;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  affectedStudents: number;
  completedAt?: string;
}

export interface ExecuteGradeTransitionRequest {
  academicYear: string;
  transitionDate: string;
  dryRun?: boolean;
  autoPromote?: boolean;
}

// System Health
export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  timestamp: string;
  version: string;
  uptime: number;
  components: {
    database: ComponentHealth;
    redis: ComponentHealth;
    storage: ComponentHealth;
    email: ComponentHealth;
    sms: ComponentHealth;
    integrations: ComponentHealth;
  };
  metrics: {
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

export interface ComponentHealth {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime?: number;
  lastCheck: string;
  error?: string;
}

// Integrations
export interface Integration {
  id: string;
  name: string;
  type: 'SIS' | 'EHR' | 'PHARMACY' | 'EMAIL' | 'SMS' | 'PAYMENT' | 'IDENTITY_PROVIDER' | 'OTHER';
  provider: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'CONFIGURING';
  config: Record<string, any>;
  credentials?: Record<string, string>; // Encrypted
  syncEnabled: boolean;
  syncInterval?: number; // Minutes
  lastSyncAt?: string;
  lastSyncStatus?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIntegrationRequest {
  name: string;
  type: Integration['type'];
  provider: string;
  config: Record<string, any>;
  credentials?: Record<string, string>;
  syncEnabled?: boolean;
  syncInterval?: number;
}

export interface UpdateIntegrationRequest {
  name?: string;
  config?: Record<string, any>;
  credentials?: Record<string, string>;
  syncEnabled?: boolean;
  syncInterval?: number;
  status?: Integration['status'];
}

export interface IntegrationTestResult {
  success: boolean;
  responseTime: number;
  message: string;
  details?: Record<string, any>;
  errors?: string[];
}

// Data Synchronization
export interface SyncStatus {
  integrationId: string;
  integrationName: string;
  type: Integration['type'];
  status: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'FAILED';
  lastSyncAt?: string;
  nextSyncAt?: string;
  progress?: {
    total: number;
    processed: number;
    created: number;
    updated: number;
    failed: number;
  };
  error?: string;
}

export interface SyncLog {
  id: string;
  integrationId: string;
  integrationName: string;
  startedAt: string;
  completedAt?: string;
  status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsFailed: number;
  errors?: Array<{
    record: string;
    error: string;
  }>;
  duration?: number; // seconds
}

export interface SyncStudentsRequest {
  integrationId?: string;
  fullSync?: boolean; // Full sync vs incremental
  schoolIds?: string[];
}

// Schools
export interface School {
  id: string;
  name: string;
  code: string;
  districtId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  principal?: string;
  nurseCount: number;
  studentCount: number;
  isActive: boolean;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolRequest {
  name: string;
  code: string;
  districtId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone: string;
  email: string;
  principal?: string;
  settings?: Record<string, any>;
}

export interface UpdateSchoolRequest {
  name?: string;
  code?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  phone?: string;
  email?: string;
  principal?: string;
  isActive?: boolean;
  settings?: Record<string, any>;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const featureFlagSchema = z.object({
  name: z.string().min(1, 'Feature name is required'),
  key: z.string().regex(/^[a-z0-9-_]+$/, 'Key must be lowercase alphanumeric with hyphens/underscores'),
  description: z.string().optional(),
  isEnabled: z.boolean(),
  enabledFor: z.array(z.string()).optional(),
  enabledPercentage: z.number().min(0).max(100).optional(),
});

const schoolSchema = z.object({
  name: z.string().min(1, 'School name is required'),
  code: z.string().min(2, 'School code is required'),
  phone: z.string().regex(/^(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
});

// ==========================================
// SYSTEM API SERVICE
// ==========================================

export class SystemApi {
  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // SYSTEM CONFIGURATION
  // ==========================================

  /**
   * Get all system configuration settings
   */
  async getConfig(category?: string): Promise<SystemConfig[]> {
    try {
      const params = category ? `?category=${category}` : '';
      const response = await this.client.get<ApiResponse<SystemConfig[]>>(
        `/api/v1/system/config${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system configuration');
    }
  }

  /**
   * Get specific configuration value
   */
  async getConfigValue(key: string): Promise<SystemConfig> {
    try {
      const response = await this.client.get<ApiResponse<SystemConfig>>(
        `/api/v1/system/config/${key}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch configuration value');
    }
  }

  /**
   * Update system configuration
   */
  async updateConfig(key: string, data: UpdateSystemConfigRequest): Promise<SystemConfig> {
    try {
      const response = await this.client.put<ApiResponse<SystemConfig>>(
        `/api/v1/system/config/${key}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update configuration');
    }
  }

  // ==========================================
  // FEATURE FLAGS
  // ==========================================

  /**
   * Get all feature flags
   */
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const response = await this.client.get<ApiResponse<FeatureFlag[]>>(
        '/api/v1/system/features'
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch feature flags');
    }
  }

  /**
   * Get specific feature flag
   */
  async getFeatureFlag(key: string): Promise<FeatureFlag> {
    try {
      const response = await this.client.get<ApiResponse<FeatureFlag>>(
        `/api/v1/system/features/${key}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch feature flag');
    }
  }

  /**
   * Check if feature is enabled for user/role
   */
  async isFeatureEnabled(key: string, userId?: string): Promise<boolean> {
    try {
      const params = userId ? `?userId=${userId}` : '';
      const response = await this.client.get<ApiResponse<{ enabled: boolean }>>(
        `/api/v1/system/features/${key}/enabled${params}`
      );
      return response.data.data!.enabled;
    } catch (error) {
      throw createApiError(error, 'Failed to check feature status');
    }
  }

  /**
   * Create feature flag
   */
  async createFeatureFlag(data: CreateFeatureFlagRequest): Promise<FeatureFlag> {
    try {
      featureFlagSchema.parse(data);
      const response = await this.client.post<ApiResponse<FeatureFlag>>(
        '/api/v1/system/features',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Feature flag validation failed', 'featureFlag', {}, error);
      }
      throw createApiError(error, 'Failed to create feature flag');
    }
  }

  /**
   * Update feature flag
   */
  async updateFeatureFlag(key: string, data: UpdateFeatureFlagRequest): Promise<FeatureFlag> {
    try {
      const response = await this.client.put<ApiResponse<FeatureFlag>>(
        `/api/v1/system/features/${key}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update feature flag');
    }
  }

  /**
   * Delete feature flag
   */
  async deleteFeatureFlag(key: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/system/features/${key}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete feature flag');
    }
  }

  // ==========================================
  // GRADE TRANSITIONS
  // ==========================================

  /**
   * Get grade transition configuration
   */
  async getGradeTransitionConfig(): Promise<GradeTransitionConfig> {
    try {
      const response = await this.client.get<ApiResponse<GradeTransitionConfig>>(
        '/api/v1/system/grade-transition'
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch grade transition configuration');
    }
  }

  /**
   * Execute grade transition
   */
  async executeGradeTransition(data: ExecuteGradeTransitionRequest): Promise<GradeTransitionConfig> {
    try {
      const response = await this.client.post<ApiResponse<GradeTransitionConfig>>(
        '/api/v1/system/grade-transition',
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to execute grade transition');
    }
  }

  // ==========================================
  // SYSTEM HEALTH
  // ==========================================

  /**
   * Get system health status
   */
  async getHealth(): Promise<SystemHealth> {
    try {
      const response = await this.client.get<ApiResponse<SystemHealth>>(
        '/api/v1/system/health'
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch system health');
    }
  }

  // ==========================================
  // INTEGRATIONS
  // ==========================================

  /**
   * Get all integrations
   */
  async getIntegrations(type?: Integration['type']): Promise<Integration[]> {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await this.client.get<ApiResponse<Integration[]>>(
        `/api/v1/system/integrations${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch integrations');
    }
  }

  /**
   * Get specific integration
   */
  async getIntegration(id: string): Promise<Integration> {
    try {
      const response = await this.client.get<ApiResponse<Integration>>(
        `/api/v1/system/integrations/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch integration');
    }
  }

  /**
   * Create integration
   */
  async createIntegration(data: CreateIntegrationRequest): Promise<Integration> {
    try {
      const response = await this.client.post<ApiResponse<Integration>>(
        '/api/v1/system/integrations',
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to create integration');
    }
  }

  /**
   * Update integration
   */
  async updateIntegration(id: string, data: UpdateIntegrationRequest): Promise<Integration> {
    try {
      const response = await this.client.put<ApiResponse<Integration>>(
        `/api/v1/system/integrations/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update integration');
    }
  }

  /**
   * Delete integration
   */
  async deleteIntegration(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/system/integrations/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete integration');
    }
  }

  /**
   * Test integration connection
   */
  async testIntegration(id: string): Promise<IntegrationTestResult> {
    try {
      const response = await this.client.post<ApiResponse<IntegrationTestResult>>(
        `/api/v1/system/integrations/${id}/test`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to test integration');
    }
  }

  // ==========================================
  // DATA SYNCHRONIZATION
  // ==========================================

  /**
   * Get sync status for all integrations
   */
  async getSyncStatus(): Promise<SyncStatus[]> {
    try {
      const response = await this.client.get<ApiResponse<SyncStatus[]>>(
        '/api/v1/system/sync/status'
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch sync status');
    }
  }

  /**
   * Get sync logs
   */
  async getSyncLogs(integrationId?: string, limit?: number): Promise<SyncLog[]> {
    try {
      const params = buildUrlParams({ integrationId, limit });
      const response = await this.client.get<ApiResponse<SyncLog[]>>(
        `/api/v1/system/sync/logs?${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch sync logs');
    }
  }

  /**
   * Trigger student data synchronization
   */
  async syncStudents(data: SyncStudentsRequest): Promise<SyncLog> {
    try {
      const response = await this.client.post<ApiResponse<SyncLog>>(
        '/api/v1/system/sync/students',
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to sync students');
    }
  }

  // ==========================================
  // SCHOOLS
  // ==========================================

  /**
   * Get all schools
   */
  async getSchools(districtId?: string): Promise<School[]> {
    try {
      const params = districtId ? `?districtId=${districtId}` : '';
      const response = await this.client.get<ApiResponse<School[]>>(
        `/api/v1/system/schools${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch schools');
    }
  }

  /**
   * Get specific school
   */
  async getSchool(schoolId: string): Promise<School> {
    try {
      const response = await this.client.get<ApiResponse<School>>(
        `/api/v1/system/schools/${schoolId}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch school');
    }
  }

  /**
   * Create school
   */
  async createSchool(data: CreateSchoolRequest): Promise<School> {
    try {
      schoolSchema.parse(data);
      const response = await this.client.post<ApiResponse<School>>(
        '/api/v1/system/schools',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('School validation failed', 'school', {}, error);
      }
      throw createApiError(error, 'Failed to create school');
    }
  }

  /**
   * Update school
   */
  async updateSchool(schoolId: string, data: UpdateSchoolRequest): Promise<School> {
    try {
      const response = await this.client.put<ApiResponse<School>>(
        `/api/v1/system/schools/${schoolId}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update school');
    }
  }

  /**
   * Delete school
   */
  async deleteSchool(schoolId: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/system/schools/${schoolId}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete school');
    }
  }
}

/**
 * Factory function to create System API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured SystemApi instance
 */
export function createSystemApi(client: ApiClient): SystemApi {
  return new SystemApi(client);
}
