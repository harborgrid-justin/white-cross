/**
 * @fileoverview Integration API Types
 * @module types/domain/integrations/api
 * @category Healthcare - Integration Management
 * 
 * API request/response types and interfaces for integration endpoints.
 */

import { 
  IntegrationType,
  IntegrationStatus,
  SyncStatus,
  IntegrationHealth,
  IntegrationLog
} from './core';
import { IntegrationConfig, IntegrationSettings } from './config';
import { IntegrationStatistics, LogFilters, BatchOperationResult } from './sync';

// ==================== REQUEST TYPES ====================

/**
 * Create Integration Request
 * Request payload for creating new integration
 */
export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationType;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: IntegrationSettings;
  syncFrequency?: number;
}

/**
 * Update Integration Request
 * Request payload for updating integration
 */
export interface UpdateIntegrationRequest {
  name?: string;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: IntegrationSettings;
  syncFrequency?: number;
  isActive?: boolean;
}

// ==================== RESPONSE TYPES ====================

/**
 * Integration List Response
 * Response containing list of integrations
 */
export interface IntegrationListResponse {
  integrations: IntegrationConfig[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * Integration Response
 * Response containing single integration
 */
export interface IntegrationResponse {
  integration: IntegrationConfig;
}

/**
 * Integration Logs Response
 * Response containing paginated logs
 */
export interface IntegrationLogsResponse {
  logs: IntegrationLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Integration Statistics Response
 * Response containing statistics
 */
export interface IntegrationStatisticsResponse {
  statistics: IntegrationStatistics;
}

/**
 * Integration Health Status Response
 * Response containing overall integration health
 */
export interface IntegrationHealthStatusResponse {
  overall: 'healthy' | 'degraded' | 'critical';
  integrations: Array<{
    id: string;
    name: string;
    type: IntegrationType;
    status: IntegrationStatus;
    lastSync: string | null;
    health: IntegrationHealth;
  }>;
  summary: {
    total: number;
    healthy: number;
    warning: number;
    error: number;
  };
}

// ==================== FILTER & QUERY TYPES ====================

/**
 * Integration Query Parameters
 * Query parameters for filtering integrations
 */
export interface IntegrationQueryParams {
  type?: IntegrationType;
  status?: IntegrationStatus;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'type' | 'status' | 'lastSync' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Health Check Query Parameters
 * Query parameters for health check endpoints
 */
export interface HealthCheckQueryParams {
  integrationIds?: string[];
  types?: IntegrationType[];
  includeDetails?: boolean;
}

// ==================== API ERROR TYPES ====================

/**
 * API Error Response
 * Standard error response structure
 */
export interface APIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
  requestId?: string;
  timestamp: string;
}

/**
 * Validation Error
 * Validation error for request payloads
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

/**
 * Validation Error Response
 * Response for validation failures
 */
export interface ValidationErrorResponse extends APIErrorResponse {
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: {
      validationErrors: ValidationError[];
    };
  };
}

// ==================== BULK OPERATION TYPES ====================

/**
 * Bulk Integration Operation Request
 * Request for bulk operations on integrations
 */
export interface BulkIntegrationRequest {
  integrationIds: string[];
  operation: 'enable' | 'disable' | 'delete' | 'sync' | 'test';
  settings?: {
    force?: boolean;
    skipValidation?: boolean;
  };
}

/**
 * Bulk Integration Operation Response
 * Response for bulk operations
 */
export interface BulkIntegrationResponse {
  results: BatchOperationResult;
  details: Array<{
    integrationId: string;
    integrationName: string;
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

// ==================== SYNC OPERATION TYPES ====================

/**
 * Manual Sync Request
 * Request to trigger manual sync
 */
export interface ManualSyncRequest {
  integrationId: string;
  direction?: 'inbound' | 'outbound' | 'bidirectional';
  force?: boolean;
  batchSize?: number;
}

/**
 * Manual Sync Response
 * Response from manual sync trigger
 */
export interface ManualSyncResponse {
  success: boolean;
  message: string;
  syncId: string;
  estimatedDuration?: number;
  recordsToProcess?: number;
}

/**
 * Sync Status Response
 * Response for sync status check
 */
export interface SyncStatusResponse {
  syncId: string;
  integrationId: string;
  status: SyncStatus;
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
  startedAt: string;
  estimatedCompletion?: string;
  currentPhase?: string;
}

// ==================== EXPORT UTILITIES ====================

/**
 * Export all filter types for convenience
 */
export type { LogFilters };

/**
 * Export all result types for convenience
 */
export type { BatchOperationResult };

// ==================== TYPE GUARDS ====================

/**
 * Type guard for API error response
 */
export const isAPIErrorResponse = (response: unknown): response is APIErrorResponse => {
  return typeof response === 'object' && 
         response !== null && 
         'error' in response &&
         typeof (response as APIErrorResponse).error === 'object';
};

/**
 * Type guard for validation error response
 */
export const isValidationErrorResponse = (response: unknown): response is ValidationErrorResponse => {
  return isAPIErrorResponse(response) && 
         response.error.code === 'VALIDATION_ERROR' &&
         'validationErrors' in (response.error.details || {});
};

/**
 * Type guard for successful sync response
 */
export const isSuccessfulSyncResponse = (response: ManualSyncResponse): boolean => {
  return response.success && !!response.syncId;
};
