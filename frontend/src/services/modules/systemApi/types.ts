/**
 * @fileoverview System API Type Definitions
 * 
 * Centralized type definitions for system administration operations including
 * configuration management, feature flags, integrations, health monitoring,
 * and school management.
 * 
 * @module systemApi/types
 * @version 1.0.0
 * @since 2025-11-11
 */

import type {
  CONFIG_CATEGORIES,
  CONFIG_VALUE_TYPES,
  INTEGRATION_TYPES,
  INTEGRATION_STATUS_VALUES,
  GRADE_TRANSITION_STATUS_VALUES,
  SYNC_STATUS_VALUES,
  HEALTH_STATUS_VALUES,
  COMPONENT_STATUS_VALUES,
} from './validation';

// Re-export validation constants as types
export type ConfigCategory = typeof CONFIG_CATEGORIES[number];
export type ConfigValueType = typeof CONFIG_VALUE_TYPES[number];
export type IntegrationType = typeof INTEGRATION_TYPES[number];
export type IntegrationStatus = typeof INTEGRATION_STATUS_VALUES[number];
export type GradeTransitionStatus = typeof GRADE_TRANSITION_STATUS_VALUES[number];
export type SyncStatusValue = typeof SYNC_STATUS_VALUES[number];
export type HealthStatus = typeof HEALTH_STATUS_VALUES[number];
export type ComponentStatus = typeof COMPONENT_STATUS_VALUES[number];

// ==========================================
// SYSTEM CONFIGURATION
// ==========================================

/**
 * System configuration entry
 * 
 * Represents a single configuration key-value pair with metadata
 * for system-wide settings management.
 */
export interface SystemConfig {
  id: string;
  category: ConfigCategory;
  key: string;
  value: string | number | boolean | object;
  valueType: ConfigValueType;
  description?: string;
  isPublic: boolean;
  isEditable: boolean;
  updatedAt: string;
  updatedBy: string;
}

/**
 * System configuration update request
 */
export interface UpdateSystemConfigRequest {
  value: string | number | boolean | object;
  description?: string;
}

// ==========================================
// FEATURE FLAGS
// ==========================================

/**
 * Feature flag for controlling feature rollouts
 * 
 * Enables gradual feature deployment with fine-grained control
 * over user/role/school-specific enablement.
 */
export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description?: string;
  isEnabled: boolean;
  enabledFor?: string[]; // User IDs, role names, or school IDs
  enabledPercentage?: number; // For gradual rollout (0-100)
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Feature flag creation request
 */
export interface CreateFeatureFlagRequest {
  name: string;
  key: string;
  description?: string;
  isEnabled: boolean;
  enabledFor?: string[];
  enabledPercentage?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Feature flag update request
 */
export interface UpdateFeatureFlagRequest {
  name?: string;
  description?: string;
  isEnabled?: boolean;
  enabledFor?: string[];
  enabledPercentage?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Feature flag status check response
 */
export interface FeatureFlagStatus {
  enabled: boolean;
  reason?: 'percentage' | 'explicit' | 'default';
  metadata?: Record<string, unknown>;
}

// ==========================================
// GRADE TRANSITIONS
// ==========================================

/**
 * Grade transition configuration
 * 
 * Manages academic year student promotions with configurable
 * rules and status tracking.
 */
export interface GradeTransitionConfig {
  id: string;
  academicYear: string;
  transitionDate: string;
  rules: Array<{
    currentGrade: string;
    nextGrade: string;
    autoPromote: boolean;
  }>;
  status: GradeTransitionStatus;
  affectedStudents: number;
  completedAt?: string;
}

/**
 * Grade transition execution request
 */
export interface ExecuteGradeTransitionRequest {
  academicYear: string;
  transitionDate: string;
  dryRun?: boolean;
  autoPromote?: boolean;
}

/**
 * Grade transition execution result
 */
export interface GradeTransitionResult {
  success: boolean;
  affectedStudents: number;
  promotions: Array<{
    studentId: string;
    fromGrade: string;
    toGrade: string;
    success: boolean;
    error?: string;
  }>;
  summary: {
    total: number;
    promoted: number;
    failed: number;
    skipped: number;
  };
}

// ==========================================
// SYSTEM HEALTH
// ==========================================

/**
 * Component health status
 * 
 * Individual system component monitoring information
 * including response time and error details.
 */
export interface ComponentHealth {
  status: ComponentStatus;
  responseTime?: number; // milliseconds
  lastCheck: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Overall system health status
 * 
 * Aggregated health information for all system components
 * and performance metrics.
 */
export interface SystemHealth {
  status: HealthStatus;
  timestamp: string;
  version: string;
  uptime: number; // seconds
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
    averageResponseTime: number; // milliseconds
    errorRate: number; // percentage
    memoryUsage: number; // percentage
    cpuUsage: number; // percentage
  };
}

/**
 * Health check response for individual components
 */
export interface HealthCheckResponse {
  component: string;
  status: ComponentStatus;
  responseTime: number;
  timestamp: string;
  details?: Record<string, unknown>;
  error?: string;
}

// ==========================================
// INTEGRATIONS
// ==========================================

/**
 * External system integration configuration
 * 
 * Manages connections to external systems like SIS, EHR,
 * pharmacy systems, and service providers.
 */
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  config: Record<string, unknown>;
  credentials?: Record<string, string>; // Encrypted in storage
  syncEnabled: boolean;
  syncInterval?: number; // Minutes between syncs
  lastSyncAt?: string;
  lastSyncStatus?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Integration creation request
 */
export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationType;
  provider: string;
  config: Record<string, unknown>;
  credentials?: Record<string, string>;
  syncEnabled?: boolean;
  syncInterval?: number;
}

/**
 * Integration update request
 */
export interface UpdateIntegrationRequest {
  name?: string;
  config?: Record<string, unknown>;
  credentials?: Record<string, string>;
  syncEnabled?: boolean;
  syncInterval?: number;
  status?: IntegrationStatus;
}

/**
 * Integration connection test result
 */
export interface IntegrationTestResult {
  success: boolean;
  responseTime: number; // milliseconds
  message: string;
  details?: Record<string, unknown>;
  errors?: string[];
  timestamp: string;
}

// ==========================================
// DATA SYNCHRONIZATION
// ==========================================

/**
 * Data synchronization status
 * 
 * Real-time status of data sync operations between
 * external systems and the local database.
 */
export interface SyncStatus {
  integrationId: string;
  integrationName: string;
  type: IntegrationType;
  status: SyncStatus;
  lastSyncAt?: string;
  nextSyncAt?: string;
  progress?: {
    total: number;
    processed: number;
    created: number;
    updated: number;
    failed: number;
    percentage: number;
  };
  error?: string;
  estimatedCompletion?: string;
}

/**
 * Synchronization operation log entry
 * 
 * Historical record of sync operations with detailed
 * results and error information.
 */
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
    context?: Record<string, unknown>;
  }>;
  duration?: number; // seconds
  triggeredBy: string; // User ID or 'SYSTEM'
  syncType: 'FULL' | 'INCREMENTAL' | 'MANUAL';
}

/**
 * Student synchronization request
 */
export interface SyncStudentsRequest {
  integrationId?: string;
  fullSync?: boolean; // Full sync vs incremental
  schoolIds?: string[];
  batchSize?: number;
  validateOnly?: boolean;
}

/**
 * Sync operation progress update
 */
export interface SyncProgress {
  total: number;
  processed: number;
  created: number;
  updated: number;
  failed: number;
  currentBatch: number;
  totalBatches: number;
  estimatedTimeRemaining?: number; // seconds
  throughputPerSecond: number;
}

// ==========================================
// SCHOOLS & DISTRICTS
// ==========================================

/**
 * US address structure
 * 
 * Standardized address format for school and district
 * contact information.
 */
export interface Address {
  street: string;
  city: string;
  state: string; // 2-letter state code
  zipCode: string; // ZIP or ZIP+4 format
}

/**
 * School information and management
 * 
 * Individual school entity with contact information,
 * administrative details, and custom settings.
 */
export interface School {
  id: string;
  name: string;
  code: string; // Unique school identifier
  districtId?: string;
  address: Address;
  phone: string;
  email: string;
  principal?: string;
  nurseCount: number;
  studentCount: number;
  isActive: boolean;
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

/**
 * School creation request
 */
export interface CreateSchoolRequest {
  name: string;
  code: string;
  districtId?: string;
  address: Address;
  phone: string;
  email: string;
  principal?: string;
  settings?: Record<string, unknown>;
}

/**
 * School update request
 */
export interface UpdateSchoolRequest {
  name?: string;
  code?: string;
  address?: Address;
  phone?: string;
  email?: string;
  principal?: string;
  isActive?: boolean;
  settings?: Record<string, unknown>;
}

/**
 * School statistics summary
 */
export interface SchoolStatistics {
  id: string;
  name: string;
  studentCounts: {
    total: number;
    active: number;
    inactive: number;
    byGrade: Record<string, number>;
  };
  nurseCounts: {
    total: number;
    active: number;
  };
  healthMetrics: {
    totalHealthRecords: number;
    activeMedications: number;
    knownAllergies: number;
    recentAppointments: number;
  };
  lastUpdated: string;
}

// ==========================================
// API RESPONSE WRAPPERS
// ==========================================

/**
 * Standard API response wrapper
 * 
 * Consistent response structure for all system API endpoints
 * with proper error handling and metadata.
 */
export interface SystemApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  message?: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

/**
 * Paginated response wrapper for list operations
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Bulk operation result
 * 
 * Response structure for operations affecting multiple records
 * with detailed success/failure breakdown.
 */
export interface BulkOperationResult {
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    id: string;
    success: boolean;
    error?: string;
  }>;
  summary: {
    duration: number; // milliseconds
    throughput: number; // records per second
  };
}

// ==========================================
// SEARCH AND FILTERING
// ==========================================

/**
 * Generic filter options for list operations
 */
export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Integration filter options
 */
export interface IntegrationFilters extends FilterOptions {
  type?: IntegrationType;
  status?: IntegrationStatus;
  provider?: string;
  syncEnabled?: boolean;
}

/**
 * School filter options
 */
export interface SchoolFilters extends FilterOptions {
  districtId?: string;
  isActive?: boolean;
  state?: string;
  hasNurse?: boolean;
  minStudentCount?: number;
  maxStudentCount?: number;
}

/**
 * Sync log filter options
 */
export interface SyncLogFilters extends FilterOptions {
  integrationId?: string;
  status?: 'IN_PROGRESS' | 'SUCCESS' | 'FAILED';
  dateFrom?: string;
  dateTo?: string;
  triggeredBy?: string;
  syncType?: 'FULL' | 'INCREMENTAL' | 'MANUAL';
}

// ==========================================
// AUDIT AND COMPLIANCE
// ==========================================

/**
 * Configuration change audit log
 */
export interface ConfigurationAudit {
  id: string;
  configKey: string;
  previousValue: unknown;
  newValue: unknown;
  changedBy: string;
  changedAt: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Feature flag audit log
 */
export interface FeatureFlagAudit {
  id: string;
  featureKey: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'ENABLED' | 'DISABLED';
  previousState?: Partial<FeatureFlag>;
  newState?: Partial<FeatureFlag>;
  changedBy: string;
  changedAt: string;
  reason?: string;
  affectedUsers?: string[];
}

/**
 * Integration audit log
 */
export interface IntegrationAudit {
  id: string;
  integrationId: string;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'TESTED' | 'SYNC_STARTED' | 'SYNC_COMPLETED';
  details: Record<string, unknown>;
  performedBy: string;
  performedAt: string;
  ipAddress?: string;
  result: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  errorMessage?: string;
}
