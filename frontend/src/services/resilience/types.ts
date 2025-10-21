/**
 * Resilience Pattern Type Definitions
 * Comprehensive types for circuit breaker, bulkhead, and request deduplication patterns
 * Critical for healthcare operations - ensures fault isolation and graceful degradation
 */

// ============================================================================
// CIRCUIT BREAKER TYPES
// ============================================================================

/**
 * Circuit Breaker States
 * CLOSED: Normal operation, requests flow through
 * OPEN: Failures exceeded, requests rejected immediately
 * HALF_OPEN: Testing if service recovered, limited requests allowed
 */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

/**
 * Circuit Breaker Configuration
 * Parameters for circuit breaker behavior tuning
 */
export interface CircuitBreakerConfig {
  /** Failure threshold before opening circuit (default: 5) */
  failureThreshold: number;

  /** Success threshold in HALF_OPEN state before closing circuit (default: 3) */
  successThreshold: number;

  /** Timeout in milliseconds before transitioning from OPEN to HALF_OPEN (default: 60000) */
  timeout: number;

  /** Monitoring window in milliseconds to calculate failure rate (default: 10000) */
  monitoringWindow: number;

  /** Error codes that should NOT trigger circuit opening (e.g., 4xx errors) */
  excludedErrors?: number[];

  /** Custom error predicate function */
  isErrorRetryable?: (error: unknown) => boolean;
}

/**
 * Circuit Breaker Event
 * Emitted when state transitions or thresholds are reached
 */
export interface CircuitBreakerEvent {
  type: 'stateChange' | 'successThreshold' | 'failureThreshold' | 'timeout';
  state: CircuitBreakerState;
  endpoint: string;
  timestamp: number;
  failureCount?: number;
  successCount?: number;
  message: string;
}

/**
 * Circuit Breaker Metrics
 * Real-time statistics about circuit breaker performance
 */
export interface CircuitBreakerMetrics {
  state: CircuitBreakerState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
  requestsInMonitoringWindow: number;
  failureRate: number;
  averageResponseTime: number;
}

// ============================================================================
// BULKHEAD TYPES
// ============================================================================

/**
 * Operation Priority Levels
 * CRITICAL: Emergency alerts, allergy checks - must execute
 * HIGH: Medication administration, health records
 * NORMAL: Standard operations
 * LOW: Non-urgent background operations
 */
export enum OperationPriority {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW'
}

/**
 * Bulkhead Configuration
 * Separates concurrent request limits by operation priority
 */
export interface BulkheadConfig {
  /** Maximum concurrent operations for CRITICAL priority */
  criticalMaxConcurrent: number;

  /** Maximum concurrent operations for HIGH priority */
  highMaxConcurrent: number;

  /** Maximum concurrent operations for NORMAL priority */
  normalMaxConcurrent: number;

  /** Maximum concurrent operations for LOW priority */
  lowMaxConcurrent: number;

  /** Maximum queued operations per priority level */
  maxQueuedPerPriority: number;

  /** Timeout in milliseconds for operations to complete */
  operationTimeout: number;

  /** Whether to reject queued operations when bulkhead is full */
  rejectWhenFull: boolean;
}

/**
 * Bulkhead Operation Request
 * Represents a request queued in the bulkhead
 */
export interface BulkheadOperationRequest<T = unknown> {
  id: string;
  priority: OperationPriority;
  operation: () => Promise<T>;
  timeout: number;
  timestamp: number;
}

/**
 * Bulkhead Metrics
 * Statistics about bulkhead utilization and queue health
 */
export interface BulkheadMetrics {
  activeByCriticality: {
    CRITICAL: number;
    HIGH: number;
    NORMAL: number;
    LOW: number;
  };
  queuedByCriticality: {
    CRITICAL: number;
    HIGH: number;
    NORMAL: number;
    LOW: number;
  };
  totalRejected: number;
  averageQueueWaitTime: number;
  peakConcurrentRequests: number;
}

// ============================================================================
// REQUEST DEDUPLICATION TYPES
// ============================================================================

/**
 * Deduplication Key
 * Unique identifier for request deduplication
 * Combines method, URL, and relevant parameters
 */
export interface DeduplicationKey {
  method: string;
  url: string;
  paramsHash: string;
}

/**
 * In-Flight Request
 * Tracks a request being processed
 */
export interface InFlightRequest<T = unknown> {
  key: string;
  promise: Promise<T>;
  startTime: number;
  count: number;
}

/**
 * Deduplication Metrics
 * Statistics about request deduplication effectiveness
 */
export interface DeduplicationMetrics {
  totalRequests: number;
  deduplicatedRequests: number;
  savedRequests: number;
  duplicatedPercentage: number;
  averageDeduplicationTime: number;
}

// ============================================================================
// HEALTH MONITOR TYPES
// ============================================================================

/**
 * Endpoint Health Status
 * Tracks the health of individual API endpoints
 */
export interface EndpointHealth {
  endpoint: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  timeoutRequests: number;
  successRate: number;
  failureRate: number;
  lastRequestTime: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  isDegraded: boolean;
  degradationReason?: string;
}

/**
 * Degradation Alert
 * Triggered when endpoint shows degradation patterns
 */
export interface DegradationAlert {
  endpoint: string;
  type: 'highFailureRate' | 'slowResponse' | 'highTimeout' | 'unusual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  metrics: Partial<EndpointHealth>;
}

/**
 * Health Check Result
 * Result of a health check probe
 */
export interface HealthCheckResult {
  endpoint: string;
  healthy: boolean;
  responseTime: number;
  timestamp: number;
  error?: string;
}

// ============================================================================
// RESILIENT API CLIENT TYPES
// ============================================================================

/**
 * Operation Category
 * Groups related operations with shared resilience rules
 */
export interface OperationCategory {
  name: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  circuitBreakerThreshold: number;
  bulkheadPriority: OperationPriority;
  enableDeduplication: boolean;
  enableHealthMonitoring: boolean;
  isIdempotent: boolean;
}

/**
 * Resilience Configuration
 * Complete configuration for resilient API client
 */
export interface ResilienceConfig {
  /** Enable circuit breaker pattern */
  enableCircuitBreaker: boolean;

  /** Enable bulkhead pattern */
  enableBulkhead: boolean;

  /** Enable request deduplication */
  enableDeduplication: boolean;

  /** Enable health monitoring */
  enableHealthMonitoring: boolean;

  /** Default operation timeout in milliseconds */
  defaultTimeout: number;

  /** Circuit breaker configuration */
  circuitBreaker: CircuitBreakerConfig;

  /** Bulkhead configuration */
  bulkhead: BulkheadConfig;

  /** Operation category mappings */
  operationCategories: Map<string, OperationCategory>;

  /** Error handler callback */
  onError?: (error: ResilienceError) => void;

  /** Event listener callback */
  onEvent?: (event: ResilienceEvent) => void;
}

/**
 * Resilience Error
 * Wrapper for errors that occur within resilience patterns
 */
export interface ResilienceError extends Error {
  type: 'circuitBreakerOpen' | 'bulkheadRejected' | 'timeout' | 'underlying';
  endpoint: string;
  underlyingError?: Error;
  originalError?: unknown;
  timestamp: number;
}

/**
 * Resilience Event
 * Events emitted by resilience patterns
 */
export interface ResilienceEvent {
  type: 'circuitBreakerStateChange' | 'bulkheadRejection' | 'requestDeduplication' | 'healthDegradation';
  endpoint: string;
  details: Record<string, unknown>;
  timestamp: number;
}

/**
 * Resilience Middleware Context
 * Context passed through resilience middleware chain
 */
export interface ResilienceMiddlewareContext {
  method: string;
  url: string;
  params?: Record<string, unknown>;
  timeout: number;
  priority: OperationPriority;
  isIdempotent: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Retry Strategy
 * Defines how requests should be retried
 */
export interface RetryStrategy {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
  maxDelay: number;
  jitterFactor: number;
  isRetryable: (error: unknown) => boolean;
}

/**
 * Fallback Strategy
 * Defines fallback behavior when operations fail
 */
export interface FallbackStrategy<T = unknown> {
  enabled: boolean;
  timeout: number;
  getCachedValue?: () => Promise<T | null>;
  getDefaultValue?: () => T;
  fallbackEndpoint?: string;
}

// ============================================================================
// HEALTHCARE-SPECIFIC TYPES
// ============================================================================

/**
 * Healthcare Operation Types
 * Categorizes healthcare-specific operations with appropriate resilience rules
 */
export enum HealthcareOperationType {
  MEDICATION_ADMINISTRATION = 'MEDICATION_ADMINISTRATION',
  ALLERGY_CHECK = 'ALLERGY_CHECK',
  EMERGENCY_ALERT = 'EMERGENCY_ALERT',
  HEALTH_RECORD_READ = 'HEALTH_RECORD_READ',
  HEALTH_RECORD_WRITE = 'HEALTH_RECORD_WRITE',
  VITAL_SIGNS = 'VITAL_SIGNS',
  INCIDENT_REPORT = 'INCIDENT_REPORT',
  APPOINTMENT_SCHEDULING = 'APPOINTMENT_SCHEDULING',
  STUDENT_LOOKUP = 'STUDENT_LOOKUP',
  COMMUNICATION = 'COMMUNICATION'
}

/**
 * Healthcare Compliance Context
 * Tracks compliance-related information for operations
 */
export interface HealthcareComplianceContext {
  /** HIPAA audit trail ID */
  auditTrailId: string;

  /** User ID performing the operation */
  userId: string;

  /** Student/Patient ID */
  studentId: string;

  /** Operation classification (PHI, PII, etc.) */
  dataClassification: 'PHI' | 'PII' | 'PUBLIC' | 'CONFIDENTIAL';

  /** Whether operation must succeed for safety */
  criticalForPatientSafety: boolean;

  /** Timestamp of operation */
  timestamp: number;
}
