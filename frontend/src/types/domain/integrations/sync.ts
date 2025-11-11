/**
 * @fileoverview Sync Operations Types
 * @module types/domain/integrations/sync
 * @category Healthcare - Integration Management
 * 
 * Types for synchronization operations, credentials, and statistics.
 */

import { 
  IntegrationType,
  IntegrationAction,
  SyncStatus,
  AuthenticationMethod,
  ConflictResolutionStrategy,
  SyncFilter,
  SyncHook,
  WebhookEvent
} from './core';

// ==================== SYNC OPERATIONS ====================

/**
 * Sync Configuration
 * Configuration for synchronization operations
 */
export interface SyncConfiguration {
  integrationId: string;
  enabled: boolean;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  schedule?: string; // Cron expression
  batchSize?: number;
  throttleRatePerSecond?: number;
  conflictResolution?: ConflictResolutionStrategy;
  filters?: SyncFilter[];
  hooks?: SyncHook[];
}

/**
 * Sync Result
 * Result of a synchronization operation
 */
export interface SyncResult {
  success: boolean;
  message?: string;
  recordsProcessed: number;
  recordsSucceeded: number;
  recordsFailed: number;
  duration: number; // In milliseconds
  errors?: string[];
  warnings?: string[];
  metadata?: SyncMetadata;
}

/**
 * Sync Metadata
 * Additional metadata about sync operation
 */
export interface SyncMetadata {
  startTime: string;
  endTime: string;
  triggeredBy: 'manual' | 'scheduled' | 'webhook' | 'api';
  batchesProcessed?: number;
  datasetSize?: number;
  apiCallsMade?: number;
  additionalInfo?: Record<string, unknown>;
}

// ==================== AUTHENTICATION & CREDENTIALS ====================

/**
 * API Credentials
 * Secure credential management for integrations
 */
export interface APICredentials {
  id: string;
  integrationId: string;
  credentialType: AuthenticationMethod;
  apiKey?: string; // Encrypted
  username?: string;
  password?: string; // Encrypted
  token?: string; // Encrypted
  certificatePath?: string;
  privateKeyPath?: string;
  isActive: boolean;
  expiresAt?: string;
  lastRotatedAt?: string;
  rotationPolicy?: CredentialRotationPolicy;
  createdAt: string;
  updatedAt: string;
}

/**
 * Credential Rotation Policy
 * Defines how and when credentials should be rotated
 */
export interface CredentialRotationPolicy {
  enabled: boolean;
  rotationIntervalDays: number;
  notifyBeforeDays: number;
  autoRotate: boolean;
  lastRotation?: string;
  nextRotation?: string;
}

// ==================== WEBHOOK MANAGEMENT ====================

/**
 * Webhook Configuration
 * Configuration for webhook-based integrations
 */
export interface WebhookConfig {
  id: string;
  integrationId: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  events: WebhookEvent[];
  isActive: boolean;
  secretKey?: string; // For webhook signature verification
  retryPolicy?: WebhookRetryPolicy;
  createdAt: string;
  updatedAt: string;
}

/**
 * Webhook Events enum (re-export from core for convenience)
 */
export { WebhookEvent } from './core';

/**
 * Webhook Retry Policy
 * Defines retry behavior for failed webhook deliveries
 */
export interface WebhookRetryPolicy {
  maxAttempts: number;
  initialDelay: number; // In milliseconds
  backoffMultiplier: number;
  maxDelay: number; // In milliseconds
}

/**
 * Webhook Delivery Log
 * Records webhook delivery attempts and outcomes
 */
export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  lastAttemptAt: string;
  responseStatus?: number;
  responseBody?: string;
  error?: string;
  createdAt: string;
}

// ==================== STATISTICS & MONITORING ====================

/**
 * Integration Statistics
 * Comprehensive statistics for monitoring integrations
 */
export interface IntegrationStatistics {
  totalIntegrations: number;
  activeIntegrations: number;
  inactiveIntegrations: number;
  syncStatistics: SyncStatistics;
  statsByType: Record<string, TypeStatistics>;
  recentActivity?: Array<{
    id: string;
    integrationId: string;
    integrationName: string;
    type: IntegrationType;
    action: IntegrationAction;
    status: SyncStatus;
    timestamp: string;
    duration?: number;
    recordsProcessed?: number;
    userId?: string;
    userName?: string;
  }>;
}

/**
 * Sync Statistics
 * Statistics about synchronization operations
 */
export interface SyncStatistics {
  totalSyncs: number;
  successfulSyncs: number;
  failedSyncs: number;
  successRate: number; // Percentage
  totalRecordsProcessed: number;
  totalRecordsSucceeded: number;
  totalRecordsFailed: number;
  averageSyncDuration?: number; // In milliseconds
  lastSyncAt?: string;
}

/**
 * Type Statistics
 * Statistics for a specific integration type
 */
export interface TypeStatistics {
  success: number;
  failed: number;
  total: number;
  successRate?: number; // Percentage
  averageDuration?: number; // In milliseconds
}

// ==================== REQUEST/RESPONSE TYPES ====================

/**
 * Batch Operation Result
 * Result of batch operations on integrations
 */
export interface BatchOperationResult {
  success: number;
  failed: number;
  total: number;
  errors?: Array<{
    integrationId: string;
    error: string;
  }>;
}

/**
 * Log Filters
 * Filters for querying integration logs
 */
export interface LogFilters {
  integrationId?: string;
  type?: IntegrationType;
  action?: string;
  status?: SyncStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Type guard to check if sync result was successful
 */
export const isSyncResultSuccessful = (result: SyncResult): boolean => {
  return result.success && result.recordsFailed === 0;
};

/**
 * Calculate success rate from statistics
 */
export const calculateSuccessRate = (succeeded: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((succeeded / total) * 100);
};

/**
 * Format duration for display
 */
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 1000) return `${milliseconds}ms`;
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
  return `${(milliseconds / 60000).toFixed(1)}m`;
};

/**
 * Get next rotation date
 */
export const getNextRotationDate = (policy: CredentialRotationPolicy): Date | null => {
  if (!policy.enabled || !policy.lastRotation) return null;
  
  const lastRotation = new Date(policy.lastRotation);
  const nextRotation = new Date(lastRotation);
  nextRotation.setDate(lastRotation.getDate() + policy.rotationIntervalDays);
  
  return nextRotation;
};

/**
 * Check if credentials need rotation
 */
export const needsCredentialRotation = (policy: CredentialRotationPolicy): boolean => {
  const nextRotation = getNextRotationDate(policy);
  if (!nextRotation) return false;
  
  const now = new Date();
  const notifyDate = new Date(nextRotation);
  notifyDate.setDate(nextRotation.getDate() - policy.notifyBeforeDays);
  
  return now >= notifyDate;
};
