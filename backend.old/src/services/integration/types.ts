/**
 * LOC: 56944D7E5D-TYPES
 * WC-GEN-271-A | types.ts - Integration Service Type Definitions
 *
 * UPSTREAM (imports from):
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - All integration service modules
 */

/**
 * WC-GEN-271-A | types.ts - Integration Service Type Definitions
 * Purpose: Centralized type definitions for integration service modules
 * Upstream: ../database/types/enums | Dependencies: None
 * Downstream: Integration service modules | Called by: All integration modules
 * Related: integrationService.ts, validation modules
 * Exports: interfaces, types | Key Services: Type definitions
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Type safety for integration operations
 * LLM Context: Type definitions for healthcare integration system with HIPAA compliance
 */

import { IntegrationType } from '../../database/types/enums';
import type {
  IntegrationSettings,
  AuthenticationConfig,
  IntegrationSyncStatus
} from '../../types/integration';

/**
 * Data structure for creating a new integration configuration
 */
export interface CreateIntegrationConfigData {
  name: string;
  type: IntegrationType;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings: IntegrationSettings;
  syncFrequency?: number;
  authentication?: AuthenticationConfig;
}

/**
 * Data structure for updating an existing integration configuration
 */
export interface UpdateIntegrationConfigData {
  name?: string;
  endpoint?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  settings?: IntegrationSettings;
  syncFrequency?: number;
  isActive?: boolean;
  authentication?: AuthenticationConfig;
}

/**
 * Integration test result details
 * Flexible structure to accommodate different integration types
 */
export interface IntegrationTestDetails {
  endpointReachable?: boolean;
  authenticationValid?: boolean;
  dataFormatValid?: boolean;
  latency?: number;
  serverVersion?: string;
  capabilities?: string[];
  [key: string]: any; // Allow additional properties for integration-specific details
}

/**
 * Result of an integration connection test
 */
export interface IntegrationTestResult {
  success: boolean;
  message: string;
  responseTime?: number;
  details?: IntegrationTestDetails | Record<string, any>;
}

/**
 * Result of an integration synchronization operation
 */
export interface IntegrationSyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  duration: number;
  errors?: string[];
}

/**
 * Integration log details
 */
export interface IntegrationLogDetails {
  request?: {
    url: string;
    method: string;
    headers?: Record<string, string>;
  };
  response?: {
    statusCode: number;
    headers?: Record<string, string>;
  };
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
  metadata?: Record<string, unknown>;
}

/**
 * Parameters for creating an integration log entry
 */
export interface CreateIntegrationLogData {
  integrationId?: string;
  integrationType: string;
  action: string;
  status: string;
  recordsProcessed?: number;
  recordsSucceeded?: number;
  recordsFailed?: number;
  duration?: number;
  errorMessage?: string;
  details?: IntegrationLogDetails;
}

/**
 * Pagination parameters for log queries
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Pagination result metadata
 */
export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Integration statistics by type
 */
export interface IntegrationStatsByType {
  success: number;
  failed: number;
  total: number;
}

/**
 * Complete integration statistics
 */
export interface IntegrationStatistics {
  totalIntegrations: number;
  activeIntegrations: number;
  inactiveIntegrations: number;
  syncStatistics: {
    totalSyncs: number;
    successfulSyncs: number;
    failedSyncs: number;
    successRate: number;
    totalRecordsProcessed: number;
    totalRecordsSucceeded: number;
    totalRecordsFailed: number;
  };
  statsByType: Record<string, IntegrationStatsByType>;
}
