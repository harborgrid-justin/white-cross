/**
 * Healthcare-Specific Resilience Configuration
 * Defines operation categories and resilience rules for all healthcare operations
 * Critical for patient safety: Ensures appropriate timeout, retry, and bulkhead strategies
 */

import {
  OperationCategory,
  CircuitBreakerConfig,
  BulkheadConfig,
  HealthcareOperationType,
  OperationPriority,
  ResilienceConfig
} from './types';

/**
 * Circuit Breaker Configuration - Healthcare Specific
 * More conservative thresholds to catch failures early
 * Prevents cascading failures that could affect patient safety
 */
export const healthcareCircuitBreakerConfig: CircuitBreakerConfig = {
  // Open circuit after 5 consecutive failures
  failureThreshold: 5,

  // Require 3 successes in HALF_OPEN state before closing
  successThreshold: 3,

  // Wait 60 seconds before attempting recovery
  timeout: 60000,

  // Monitor last 10 seconds of traffic
  monitoringWindow: 10000,

  // Exclude client errors from failure counting
  excludedErrors: [400, 401, 403, 404, 409, 422],

  // Custom error predicate
  isErrorRetryable: (error: unknown) => {
    if (!error || typeof error !== 'object') {
      return true; // Retry unknown errors
    }

    const err = error as Record<string, unknown>;

    // Don't retry validation/permission errors
    if (typeof err.status === 'number') {
      if (err.status === 400 || err.status === 401 || err.status === 403 || err.status === 409) {
        return false;
      }
      // Retry server errors and network errors
      return err.status >= 500 || err.status === 0;
    }

    return true;
  }
};

/**
 * Bulkhead Configuration - Healthcare Specific
 * Allocates separate resource pools for critical operations
 * Ensures medication administration never starved by other operations
 */
export const healthcareBulkheadConfig: BulkheadConfig = {
  // CRITICAL: Emergency alerts, medication administration
  // Cannot be blocked by lower-priority work
  criticalMaxConcurrent: 10,

  // HIGH: Health record writes, allergy checks
  // Important but can wait briefly
  highMaxConcurrent: 20,

  // NORMAL: Standard reads, reports, appointments
  normalMaxConcurrent: 30,

  // LOW: Analytics, backups, non-urgent imports
  lowMaxConcurrent: 10,

  // Maximum queued operations per priority
  // Prevents unbounded queue growth
  maxQueuedPerPriority: 50,

  // Operation timeout
  operationTimeout: 30000,

  // Reject when full instead of waiting indefinitely
  rejectWhenFull: true
};

/**
 * Operation Categories with Healthcare-Specific Rules
 * Maps operation types to resilience configurations
 */
export const healthcareOperationCategories: Map<string, OperationCategory> = new Map([
  // ==== CRITICAL: Patient Safety Operations ====
  [
    HealthcareOperationType.MEDICATION_ADMINISTRATION,
    {
      name: 'Medication Administration',
      timeout: 5000, // 5 seconds - must execute quickly
      maxRetries: 1, // Minimal retries - avoid duplicate doses
      retryDelay: 500, // Quick retry if network issue
      circuitBreakerThreshold: 3, // Open circuit aggressively
      bulkheadPriority: OperationPriority.CRITICAL,
      enableDeduplication: true, // CRITICAL: Prevent duplicate records
      enableHealthMonitoring: true,
      isIdempotent: true // Must be idempotent
    }
  ],

  [
    HealthcareOperationType.ALLERGY_CHECK,
    {
      name: 'Allergy Check',
      timeout: 5000, // 5 seconds - check before medication
      maxRetries: 2, // Allow one retry for safety
      retryDelay: 300,
      circuitBreakerThreshold: 4,
      bulkheadPriority: OperationPriority.CRITICAL,
      enableDeduplication: true, // Prevent duplicate checks
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ],

  [
    HealthcareOperationType.EMERGENCY_ALERT,
    {
      name: 'Emergency Alert',
      timeout: 3000, // 3 seconds - fastest possible
      maxRetries: 2, // Allow retries but move on quickly
      retryDelay: 200, // Very fast retry
      circuitBreakerThreshold: 3,
      bulkheadPriority: OperationPriority.CRITICAL,
      enableDeduplication: false, // Want multiple alerts if system down
      enableHealthMonitoring: true,
      isIdempotent: false
    }
  ],

  // ==== HIGH PRIORITY: Important Health Operations ====
  [
    HealthcareOperationType.HEALTH_RECORD_READ,
    {
      name: 'Health Record Read',
      timeout: 15000, // 15 seconds - adequate for complex records
      maxRetries: 3, // Allow retries for transient failures
      retryDelay: 500,
      circuitBreakerThreshold: 5,
      bulkheadPriority: OperationPriority.HIGH,
      enableDeduplication: true, // Prevent duplicate queries
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ],

  [
    HealthcareOperationType.HEALTH_RECORD_WRITE,
    {
      name: 'Health Record Write',
      timeout: 10000, // 10 seconds
      maxRetries: 1, // Minimal retries for writes
      retryDelay: 500,
      circuitBreakerThreshold: 4,
      bulkheadPriority: OperationPriority.HIGH,
      enableDeduplication: true, // Prevent duplicate records
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ],

  [
    HealthcareOperationType.VITAL_SIGNS,
    {
      name: 'Vital Signs',
      timeout: 8000,
      maxRetries: 2,
      retryDelay: 400,
      circuitBreakerThreshold: 5,
      bulkheadPriority: OperationPriority.HIGH,
      enableDeduplication: true,
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ],

  [
    HealthcareOperationType.INCIDENT_REPORT,
    {
      name: 'Incident Report',
      timeout: 12000,
      maxRetries: 2,
      retryDelay: 600,
      circuitBreakerThreshold: 4,
      bulkheadPriority: OperationPriority.HIGH,
      enableDeduplication: true,
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ],

  // ==== NORMAL PRIORITY: Standard Operations ====
  [
    HealthcareOperationType.APPOINTMENT_SCHEDULING,
    {
      name: 'Appointment Scheduling',
      timeout: 12000,
      maxRetries: 3,
      retryDelay: 500,
      circuitBreakerThreshold: 5,
      bulkheadPriority: OperationPriority.NORMAL,
      enableDeduplication: true,
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ],

  [
    HealthcareOperationType.STUDENT_LOOKUP,
    {
      name: 'Student Lookup',
      timeout: 8000,
      maxRetries: 3,
      retryDelay: 400,
      circuitBreakerThreshold: 5,
      bulkheadPriority: OperationPriority.NORMAL,
      enableDeduplication: true,
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ],

  [
    HealthcareOperationType.COMMUNICATION,
    {
      name: 'Communication',
      timeout: 15000,
      maxRetries: 2,
      retryDelay: 800,
      circuitBreakerThreshold: 5,
      bulkheadPriority: OperationPriority.NORMAL,
      enableDeduplication: false, // Each message unique
      enableHealthMonitoring: true,
      isIdempotent: true
    }
  ]
]);

/**
 * Default Resilience Configuration for Healthcare Platform
 * Balances safety, availability, and user experience
 */
export const defaultHealthcareResilienceConfig: ResilienceConfig = {
  enableCircuitBreaker: true,
  enableBulkhead: true,
  enableDeduplication: true,
  enableHealthMonitoring: true,
  defaultTimeout: 10000,
  circuitBreaker: healthcareCircuitBreakerConfig,
  bulkhead: healthcareBulkheadConfig,
  operationCategories: healthcareOperationCategories,
  onError: (error) => {
    // Log errors to monitoring system
    console.error('[Resilience Error]', {
      type: error.type,
      endpoint: error.endpoint,
      message: error.message,
      timestamp: error.timestamp
    });
  },
  onEvent: (event) => {
    // Log events to monitoring system
    console.log('[Resilience Event]', {
      type: event.type,
      endpoint: event.endpoint,
      timestamp: event.timestamp
    });
  }
};

/**
 * Get operation category configuration
 */
export function getOperationCategory(operationType: HealthcareOperationType): OperationCategory {
  const config = healthcareOperationCategories.get(operationType);

  if (!config) {
    // Fallback to conservative defaults
    return {
      name: operationType,
      timeout: 10000,
      maxRetries: 2,
      retryDelay: 500,
      circuitBreakerThreshold: 5,
      bulkheadPriority: OperationPriority.NORMAL,
      enableDeduplication: true,
      enableHealthMonitoring: true,
      isIdempotent: true
    };
  }

  return config;
}

/**
 * Get bulkhead priority for operation type
 */
export function getBulkheadPriority(operationType: HealthcareOperationType): OperationPriority {
  const category = getOperationCategory(operationType);
  return category.bulkheadPriority;
}

/**
 * Check if operation is critical for patient safety
 */
export function isCriticalForPatientSafety(operationType: HealthcareOperationType): boolean {
  return operationType === HealthcareOperationType.MEDICATION_ADMINISTRATION ||
    operationType === HealthcareOperationType.ALLERGY_CHECK ||
    operationType === HealthcareOperationType.EMERGENCY_ALERT;
}

/**
 * Check if operation must be idempotent
 */
export function mustBeIdempotent(operationType: HealthcareOperationType): boolean {
  const category = getOperationCategory(operationType);
  return category.isIdempotent;
}

/**
 * Get recommended retry strategy for operation type
 */
export function getRetryStrategy(operationType: HealthcareOperationType) {
  const category = getOperationCategory(operationType);

  return {
    maxAttempts: category.maxRetries + 1,
    delay: category.retryDelay,
    backoffMultiplier: 1.5,
    maxDelay: category.timeout / 2,
    jitterFactor: 0.1,
    isRetryable: (error: unknown) => {
      // Use circuit breaker's custom logic if available
      return healthcareCircuitBreakerConfig.isErrorRetryable?.(error) ?? true;
    }
  };
}

/**
 * Healthcare Compliance Rules
 * Ensures HIPAA and safety compliance
 */
export const healthcareComplianceRules = {
  // Log all PHI access
  logPhiAccess: true,

  // Require authentication for all operations
  requireAuth: true,

  // Timeout for PHI operations (shorter is more secure)
  phiOperationTimeout: 8000,

  // Maximum retries for PHI operations (fewer is safer)
  phiMaxRetries: 1,

  // Must use HTTPS for all operations
  requireHttps: true,

  // Require audit trail for critical operations
  auditCriticalOperations: true,

  // Operations that must be encrypted
  encryptedOperations: [
    HealthcareOperationType.MEDICATION_ADMINISTRATION,
    HealthcareOperationType.HEALTH_RECORD_READ,
    HealthcareOperationType.HEALTH_RECORD_WRITE,
    HealthcareOperationType.ALLERGY_CHECK
  ]
};
