/**
 * Resilience Pattern Exports
 * Public API for circuit breaker, bulkhead, deduplication, and health monitoring
 */

// Type exports
export type {
  CircuitBreakerConfig,
  CircuitBreakerEvent,
  CircuitBreakerMetrics,
  BulkheadConfig,
  BulkheadOperationRequest,
  BulkheadMetrics,
  DeduplicationKey,
  InFlightRequest,
  DeduplicationMetrics,
  EndpointHealth,
  DegradationAlert,
  HealthCheckResult,
  OperationCategory,
  ResilienceConfig,
  ResilienceError,
  ResilienceEvent,
  ResilienceMiddlewareContext,
  RetryStrategy,
  FallbackStrategy,
  HealthcareComplianceContext
} from './types';

export {
  CircuitBreakerState,
  OperationPriority,
  HealthcareOperationType
} from './types';

// Circuit Breaker exports
export { CircuitBreaker, CircuitBreakerRegistry } from './CircuitBreaker';

// Bulkhead exports
export { Bulkhead } from './Bulkhead';

// Request Deduplicator exports
export {
  RequestDeduplicator,
  getGlobalDeduplicator,
  resetGlobalDeduplicator
} from './RequestDeduplicator';

// Health Monitor exports
export {
  HealthMonitor,
  getGlobalHealthMonitor,
  resetGlobalHealthMonitor
} from './HealthMonitor';

// Healthcare configuration exports
export {
  healthcareCircuitBreakerConfig,
  healthcareBulkheadConfig,
  healthcareOperationCategories,
  defaultHealthcareResilienceConfig,
  getOperationCategory,
  getBulkheadPriority,
  isCriticalForPatientSafety,
  mustBeIdempotent,
  getRetryStrategy,
  healthcareComplianceRules
} from './healthcareConfig';
