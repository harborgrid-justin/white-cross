/**
 * WF-COMP-280 | integrationApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils, zod
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: default export, constants, types, classes | Key Features: arrow component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Integration Hub API Module
 * Provides enterprise-grade integration management capabilities
 *
 * Supports:
 * - SIS (Student Information System)
 * - EHR (Electronic Health Records)
 * - Pharmacy Management
 * - Laboratory Information System
 * - Insurance Verification
 * - Parent Portal
 * - Health Application
 * - Government Reporting
 */

import { apiInstance, API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';
import { z } from 'zod';

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
} from '../../types/integrations';

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

// ==================== Validation Schemas ====================

/**
 * Integration Type Schema
 */
const integrationTypeSchema = z.enum([
  'SIS',
  'EHR',
  'PHARMACY',
  'LABORATORY',
  'INSURANCE',
  'PARENT_PORTAL',
  'HEALTH_APP',
  'GOVERNMENT_REPORTING'
], {
  errorMap: () => ({ message: 'Invalid integration type' })
});

/**
 * Authentication Method Schema
 */
const authenticationMethodSchema = z.enum([
  'api_key',
  'basic_auth',
  'oauth2',
  'jwt',
  'certificate',
  'custom'
], {
  errorMap: () => ({ message: 'Invalid authentication method' })
});

/**
 * Sync Direction Schema
 */
const syncDirectionSchema = z.enum(['inbound', 'outbound', 'bidirectional'], {
  errorMap: () => ({ message: 'Invalid sync direction' })
});

/**
 * OAuth2 Grant Type Schema
 */
const oauth2GrantTypeSchema = z.enum([
  'authorization_code',
  'client_credentials',
  'password',
  'refresh_token'
]);

/**
 * Data Type Schema for Field Mappings
 */
const dataTypeSchema = z.enum(['string', 'number', 'boolean', 'date', 'array', 'object']);

/**
 * OAuth2 Configuration Schema
 */
const oauth2ConfigSchema = z.object({
  clientId: z.string().min(1, 'OAuth2 clientId is required'),
  clientSecret: z.string().min(1, 'OAuth2 clientSecret is required'),
  authorizationUrl: z.string().url('OAuth2 authorizationUrl must be a valid URL'),
  tokenUrl: z.string().url('OAuth2 tokenUrl must be a valid URL'),
  redirectUri: z.string().url('OAuth2 redirectUri must be a valid URL').optional(),
  scope: z.array(z.string()).optional(),
  grantType: oauth2GrantTypeSchema,
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional(),
});

/**
 * Field Mapping Schema
 */
const fieldMappingSchema = z.object({
  sourceField: z.string().min(1, 'Source field is required'),
  targetField: z.string().min(1, 'Target field is required'),
  dataType: dataTypeSchema,
  required: z.boolean(),
  defaultValue: z.any().optional(),
  transformRule: z.string().optional(),
  validationRules: z.array(z.any()).optional(),
});

/**
 * Webhook Retry Policy Schema
 */
const webhookRetryPolicySchema = z.object({
  maxAttempts: z.number().int().min(0).max(10, 'Webhook retry maxAttempts must be between 0 and 10'),
  initialDelay: z.number().int().min(100).max(60000, 'Webhook retry initialDelay must be between 100ms and 60000ms'),
  backoffMultiplier: z.number().min(1).max(10, 'Webhook retry backoffMultiplier must be between 1 and 10'),
  maxDelay: z.number().int().min(1000).max(300000, 'Webhook retry maxDelay must be between 1000ms and 300000ms'),
});

/**
 * Cron Expression Validation
 */
const cronExpressionSchema = z.string().refine(
  (value) => {
    const cronParts = value.trim().split(/\s+/);
    if (cronParts.length < 5 || cronParts.length > 7) {
      return false;
    }
    const validCronChars = /^[0-9\*\-,\/\?LW#]+$/;
    return cronParts.every(part => validCronChars.test(part));
  },
  {
    message: 'Invalid cron expression format. Expected 5-7 fields (minute, hour, day, month, weekday, [year], [seconds])'
  }
);

/**
 * Endpoint URL Schema with comprehensive validation
 */
const endpointUrlSchema = z.string()
  .url('Invalid endpoint URL format')
  .max(2048, 'Endpoint URL cannot exceed 2048 characters')
  .refine(
    (url) => {
      try {
        const parsedUrl = new URL(url);
        return ['http:', 'https:'].includes(parsedUrl.protocol);
      } catch {
        return false;
      }
    },
    { message: 'Endpoint must use HTTP or HTTPS protocol' }
  )
  .refine(
    (url) => {
      // In production, prevent localhost URLs
      if (import.meta.env.PROD) {
        try {
          const parsedUrl = new URL(url);
          return !['localhost', '127.0.0.1', '0.0.0.0'].includes(parsedUrl.hostname);
        } catch {
          return false;
        }
      }
      return true;
    },
    { message: 'Localhost endpoints are not allowed in production' }
  );

/**
 * API Key Schema
 */
const apiKeySchema = z.string()
  .min(8, 'API Key must be at least 8 characters long')
  .max(512, 'API Key cannot exceed 512 characters')
  .refine(
    (value) => !/^(password|12345|test|demo|api[-_]?key)/i.test(value),
    { message: 'API Key appears to be insecure or a placeholder' }
  );

/**
 * Username Schema
 */
const usernameSchema = z.string()
  .min(2, 'Username must be at least 2 characters long')
  .max(100, 'Username cannot exceed 100 characters')
  .regex(/^[a-zA-Z0-9@._\-+]+$/, 'Username contains invalid characters');

/**
 * Password Schema
 */
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .max(256, 'Password cannot exceed 256 characters')
  .refine(
    (value) => !/^(password|12345678|qwerty|admin|test)/i.test(value),
    { message: 'Password is too weak or appears to be a placeholder' }
  );

/**
 * Integration Settings Schema
 */
const integrationSettingsSchema = z.object({
  // Common settings
  timeout: z.number().int().min(1000).max(300000, 'Timeout must be between 1000ms (1s) and 300000ms (5min)').optional(),
  retryAttempts: z.number().int().min(0).max(10, 'Retry attempts must be between 0 and 10').optional(),
  retryDelay: z.number().int().min(100).max(60000, 'Retry delay must be between 100ms and 60000ms (1min)').optional(),
  enableLogging: z.boolean().optional(),
  enableWebhooks: z.boolean().optional(),

  // Authentication settings
  authMethod: authenticationMethodSchema.optional(),
  oauth2Config: oauth2ConfigSchema.optional(),
  certificatePath: z.string().optional(),

  // Data mapping settings
  fieldMappings: z.array(fieldMappingSchema).optional(),
  transformRules: z.array(z.any()).optional(),

  // Sync settings
  syncDirection: syncDirectionSchema.optional(),
  syncSchedule: cronExpressionSchema.optional(),
  autoSync: z.boolean().optional(),

  // Webhook configuration
  webhookUrl: z.string().url('Invalid webhook URL').optional(),
  webhookSecret: z.string().min(16, 'Webhook secret must be at least 16 characters long').optional(),
  webhookSignatureValidation: z.boolean().optional(),
  webhookRetryPolicy: webhookRetryPolicySchema.optional(),
  webhookEvents: z.array(z.string()).min(1, 'At least one webhook event must be configured').optional(),

  // Rate limiting
  rateLimitPerSecond: z.number().int().min(1).max(1000, 'Rate limit must be between 1 and 1000 requests per second').optional(),

  // Type-specific settings
  sisConfig: z.any().optional(),
  ehrConfig: z.any().optional(),
  pharmacyConfig: z.any().optional(),
  laboratoryConfig: z.any().optional(),
  insuranceConfig: z.any().optional(),
  parentPortalConfig: z.any().optional(),
  healthAppConfig: z.any().optional(),
  governmentReportingConfig: z.any().optional(),
}).passthrough(); // Allow additional custom fields

/**
 * Integration Name Schema
 */
const integrationNameSchema = z.string()
  .min(2, 'Integration name must be at least 2 characters long')
  .max(100, 'Integration name cannot exceed 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_()]+$/, 'Integration name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses');

/**
 * Sync Frequency Schema
 */
const syncFrequencySchema = z.number()
  .int('Sync frequency must be an integer')
  .min(1, 'Sync frequency must be at least 1 minute')
  .max(43200, 'Sync frequency cannot exceed 43200 minutes (30 days)');

/**
 * Create Integration Schema
 */
const createIntegrationSchema = z.object({
  name: integrationNameSchema,
  type: integrationTypeSchema,
  endpoint: endpointUrlSchema.optional(),
  apiKey: apiKeySchema.optional(),
  username: usernameSchema.optional(),
  password: passwordSchema.optional(),
  settings: integrationSettingsSchema.optional(),
  syncFrequency: syncFrequencySchema.optional(),
}).superRefine((data, ctx) => {
  // Validate that authentication is provided for non-government integrations
  if (data.type !== 'GOVERNMENT_REPORTING') {
    const hasAuth = data.apiKey ||
                   (data.username && data.password) ||
                   (data.settings?.oauth2Config);

    if (!hasAuth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one authentication method (API Key, username/password, or OAuth2) must be configured',
        path: ['apiKey']
      });
    }
  }

  // Validate that endpoint is provided for external integrations
  const typesRequiringEndpoint = ['SIS', 'EHR', 'PHARMACY', 'LABORATORY', 'INSURANCE', 'PARENT_PORTAL', 'HEALTH_APP'];
  if (typesRequiringEndpoint.includes(data.type) && !data.endpoint) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Endpoint URL is required for ${data.type} integration type`,
      path: ['endpoint']
    });
  }

  // Validate that if username is provided, password must also be provided
  if (data.username && !data.password && !data.apiKey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password is required when username is provided for basic authentication',
      path: ['password']
    });
  }

  // Validate webhook configuration
  if (data.settings?.enableWebhooks && data.settings?.webhookUrl) {
    if (data.settings?.webhookSignatureValidation && !data.settings?.webhookSecret) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Webhook secret is required when signature validation is enabled',
        path: ['settings', 'webhookSecret']
      });
    }
  }

  // Validate OAuth2 config if authMethod is oauth2
  if (data.settings?.authMethod === 'oauth2' && !data.settings?.oauth2Config) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'OAuth2 configuration is required when authentication method is OAuth2',
      path: ['settings', 'oauth2Config']
    });
  }
});

/**
 * Update Integration Schema
 */
const updateIntegrationSchema = z.object({
  name: integrationNameSchema.optional(),
  endpoint: endpointUrlSchema.optional(),
  apiKey: apiKeySchema.optional(),
  username: usernameSchema.optional(),
  password: passwordSchema.optional(),
  settings: integrationSettingsSchema.optional(),
  syncFrequency: syncFrequencySchema.optional(),
  isActive: z.boolean().optional(),
}).superRefine((data, ctx) => {
  // Validate that if username is provided, password should also be considered
  if (data.username && !data.password && !data.apiKey) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password is required when username is provided for basic authentication',
      path: ['password']
    });
  }

  // Validate webhook configuration if being updated
  if (data.settings?.enableWebhooks && data.settings?.webhookUrl) {
    if (data.settings?.webhookSignatureValidation && !data.settings?.webhookSecret) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Webhook secret is required when signature validation is enabled',
        path: ['settings', 'webhookSecret']
      });
    }
  }
});

/**
 * Integration API Service Class
 * Implements enterprise integration patterns with comprehensive error handling
 */
export class IntegrationApi {
  /**
   * Get all integrations with optional filtering
   */
  async getAll(type?: IntegrationType): Promise<IntegrationListResponse> {
    try {
      const params = type ? `?type=${encodeURIComponent(type)}` : '';
      const response = await apiInstance.get<ApiResponse<IntegrationListResponse>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}${params}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch integrations');
    }
  }

  /**
   * Get single integration by ID
   */
  async getById(id: string): Promise<IntegrationResponse> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.get<ApiResponse<IntegrationResponse>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch integration');
    }
  }

  /**
   * Create new integration configuration
   */
  async create(data: CreateIntegrationRequest): Promise<IntegrationResponse> {
    try {
      createIntegrationSchema.parse(data);

      const response = await apiInstance.post<ApiResponse<IntegrationResponse>>(
        API_ENDPOINTS.INTEGRATIONS.BASE,
        data
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to create integration');
    }
  }

  /**
   * Update existing integration
   */
  async update(id: string, data: UpdateIntegrationRequest): Promise<IntegrationResponse> {
    try {
      if (!id) throw new Error('Integration ID is required');

      updateIntegrationSchema.parse(data);

      const response = await apiInstance.put<ApiResponse<IntegrationResponse>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`,
        data
      );

      return response.data.data;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw new Error(error.response?.data?.error?.message || 'Failed to update integration');
    }
  }

  /**
   * Delete integration configuration
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.delete<ApiResponse<{ message: string }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to delete integration');
    }
  }

  /**
   * Test integration connection
   * Returns connection status and latency metrics
   */
  async testConnection(id: string): Promise<{ result: ConnectionTestResult }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.post<ApiResponse<{ result: ConnectionTestResult }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/test`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Connection test failed');
    }
  }

  /**
   * Trigger manual synchronization
   * Returns sync results including records processed and errors
   */
  async sync(id: string): Promise<{ result: SyncResult }> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const response = await apiInstance.post<ApiResponse<{ result: SyncResult }>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/sync`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Synchronization failed');
    }
  }

  /**
   * Get integration logs with pagination
   */
  async getLogs(id: string, filters: LogFilters = {}): Promise<IntegrationLogsResponse> {
    try {
      if (!id) throw new Error('Integration ID is required');

      const params = new URLSearchParams();
      params.append('page', String(filters.page || 1));
      params.append('limit', String(filters.limit || 20));

      const response = await apiInstance.get<ApiResponse<IntegrationLogsResponse>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/${id}/logs?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch integration logs');
    }
  }

  /**
   * Get all integration logs (across all integrations)
   */
  async getAllLogs(filters: LogFilters = {}): Promise<IntegrationLogsResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', String(filters.page || 1));
      params.append('limit', String(filters.limit || 20));
      if (filters.type) params.append('type', String(filters.type));

      const response = await apiInstance.get<ApiResponse<IntegrationLogsResponse>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/logs/all?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch logs');
    }
  }

  /**
   * Get integration statistics and metrics
   * Provides overview of sync success rates, performance, and system health
   */
  async getStatistics(): Promise<IntegrationStatisticsResponse> {
    try {
      const response = await apiInstance.get<ApiResponse<IntegrationStatisticsResponse>>(
        `${API_ENDPOINTS.INTEGRATIONS.BASE}/statistics/overview`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to fetch statistics');
    }
  }

  /**
   * Batch operations - Enable multiple integrations
   */
  async batchEnable(ids: string[]): Promise<BatchOperationResult> {
    try {
      if (!ids || ids.length === 0) throw new Error('Integration IDs are required');

      const results = await Promise.allSettled(
        ids.map(id => this.update(id, { isActive: true }))
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
    } catch (error: any) {
      throw new Error('Failed to enable integrations');
    }
  }

  /**
   * Batch operations - Disable multiple integrations
   */
  async batchDisable(ids: string[]): Promise<BatchOperationResult> {
    try {
      if (!ids || ids.length === 0) throw new Error('Integration IDs are required');

      const results = await Promise.allSettled(
        ids.map(id => this.update(id, { isActive: false }))
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
    } catch (error: any) {
      throw new Error('Failed to disable integrations');
    }
  }

  /**
   * Get integration health status
   * Returns aggregated health information for all active integrations
   */
  async getHealthStatus(): Promise<IntegrationHealthStatusResponse> {
    try {
      const { integrations } = await this.getAll();

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
    } catch (error: any) {
      throw new Error('Failed to fetch health status');
    }
  }
}

// Export singleton instance
export const integrationApi = new IntegrationApi();

// Legacy compatibility exports
export const getIntegrations = () => integrationApi.getAll();
export const updateIntegration = (id: string, config: UpdateIntegrationRequest) =>
  integrationApi.update(id, config);
export const testConnection = (id: string) => integrationApi.testConnection(id);
export const sync = (id: string) => integrationApi.sync(id);

export default integrationApi;
