/**
 * @fileoverview Type definitions for Service Registry
 * @module services/core/ServiceRegistry.types
 * @category Services
 *
 * Centralized type definitions for the service registry system.
 * Provides interfaces and types for service metadata, health, metrics,
 * dependencies, and status tracking.
 *
 * @exports ServiceMetadata, ServiceCategory, ServiceHealth, ServiceStatus
 * @exports ServiceMetrics, ServiceDependency
 */

// ==========================================
// SERVICE METADATA TYPES
// ==========================================

/**
 * Metadata describing a registered service
 */
export interface ServiceMetadata {
  /** Human-readable service name */
  name: string;
  /** Semantic version (e.g., "1.0.0") */
  version: string;
  /** Service description for documentation */
  description: string;
  /** API endpoint path */
  endpoint: string;
  /** Service category for grouping */
  category: ServiceCategory;
  /** Service IDs this service depends on */
  dependencies?: string[];
  /** Feature flags or capabilities */
  features?: string[];
  /** Whether service is deprecated */
  deprecated?: boolean;
  /** Deprecation warning message */
  deprecationMessage?: string;
  /** Migration guide URL or text */
  migrationGuide?: string;
}

/**
 * Service category classification
 */
export type ServiceCategory =
  | 'HEALTH'          // Health records, allergies, conditions, vaccinations
  | 'STUDENT'         // Student data, contacts, demographics
  | 'MEDICATION'      // Medication management, administration
  | 'APPOINTMENT'     // Appointments, scheduling
  | 'COMMUNICATION'   // Messages, notifications, alerts
  | 'COMPLIANCE'      // Audit logs, regulatory compliance
  | 'ADMINISTRATION'  // Users, schools, districts, settings
  | 'INTEGRATION'     // External system integrations
  | 'REPORTING'       // Analytics, reports, exports
  | 'AUDIT';          // Audit trail, HIPAA compliance logging

// ==========================================
// HEALTH MONITORING TYPES
// ==========================================

/**
 * Health status information for a service
 */
export interface ServiceHealth {
  /** Service identifier */
  serviceId: string;
  /** Current health status */
  status: ServiceStatus;
  /** Timestamp of last health check */
  lastCheck: Date;
  /** Average response time in milliseconds */
  responseTime: number;
  /** Error rate as percentage (0-100) */
  errorRate: number;
  /** Requests per second throughput */
  throughput: number;
  /** Availability percentage (0-100) */
  availabilityPercentage: number;
  /** Circuit breaker state */
  circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  /** Last error message if any */
  lastError?: string;
}

/**
 * Service health status enum
 */
export type ServiceStatus =
  | 'HEALTHY'      // Service operating normally
  | 'DEGRADED'     // Service operational but with issues
  | 'UNHEALTHY'    // Service experiencing failures
  | 'UNKNOWN'      // Health status not yet determined
  | 'MAINTENANCE'; // Service in maintenance mode

// ==========================================
// METRICS TYPES
// ==========================================

/**
 * Performance metrics for a service
 */
export interface ServiceMetrics {
  /** Service identifier */
  serviceId: string;
  /** Total number of requests made */
  totalRequests: number;
  /** Number of successful requests */
  successfulRequests: number;
  /** Number of failed requests */
  failedRequests: number;
  /** Average response time in milliseconds */
  averageResponseTime: number;
  /** 95th percentile response time */
  p95ResponseTime: number;
  /** 99th percentile response time */
  p99ResponseTime: number;
  /** Current requests per second */
  requestsPerSecond: number;
  /** Error counts by error type */
  errorsByType: Record<string, number>;
  /** Timestamp of last metrics update */
  lastUpdated: Date;
}

// ==========================================
// DEPENDENCY TYPES
// ==========================================

/**
 * Service dependency graph information
 */
export interface ServiceDependency {
  /** Service identifier */
  serviceId: string;
  /** Services this service depends on */
  dependsOn: string[];
  /** Services that depend on this service */
  requiredFor: string[];
  /** Whether this is a critical dependency */
  criticalDependency: boolean;
}

/**
 * Result of dependency check
 */
export interface DependencyCheckResult {
  /** Whether all dependencies are satisfied */
  satisfied: boolean;
  /** List of missing or unhealthy dependencies */
  missing: string[];
}

// ==========================================
// REGISTRY STATE TYPES
// ==========================================

/**
 * Complete service inventory entry
 */
export interface ServiceInventoryEntry {
  /** Service identifier */
  id: string;
  /** Service metadata */
  metadata: ServiceMetadata;
  /** Current health status */
  health: ServiceHealth;
  /** Performance metrics */
  metrics: ServiceMetrics;
}

/**
 * Exported registry state for backup/restore
 */
export interface RegistryState {
  /** All registered service metadata */
  services: Array<[string, ServiceMetadata]>;
  /** All service health statuses */
  health: Array<[string, ServiceHealth]>;
  /** All service metrics */
  metrics: Array<[string, ServiceMetrics]>;
  /** All dependency mappings */
  dependencies: Array<[string, ServiceDependency]>;
  /** Export timestamp */
  timestamp: string;
}
