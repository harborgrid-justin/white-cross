/**
 * Health Check Type Definitions
 *
 * @module infrastructure/monitoring/interfaces
 * @description Type-safe interfaces for health monitoring system
 */

/**
 * Component health status enum
 */
export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
}

/**
 * Component health details
 */
export interface ComponentHealth {
  /**
   * Health status of the component
   */
  status: HealthStatus;

  /**
   * Human-readable message describing the health state
   */
  message?: string;

  /**
   * Additional details about component health
   */
  details?: Record<string, unknown>;
}

/**
 * Overall system health check response
 */
export interface HealthCheckResponse {
  /**
   * Overall system health status
   */
  status: HealthStatus;

  /**
   * ISO timestamp of health check
   */
  timestamp: string;

  /**
   * Process uptime in seconds
   */
  uptime: number;

  /**
   * Current environment
   */
  environment: string;

  /**
   * Application version
   */
  version: string;

  /**
   * Individual component health statuses
   */
  components: {
    database: ComponentHealth;
    redis: ComponentHealth;
    websocket: ComponentHealth;
    jobQueue: ComponentHealth;
    externalAPIs: ComponentHealth;
  };
}

/**
 * Readiness probe response
 */
export interface ReadinessResponse {
  /**
   * Whether the application is ready to serve traffic
   */
  ready: boolean;

  /**
   * ISO timestamp of readiness check
   */
  timestamp: string;

  /**
   * Critical component health checks for readiness
   */
  checks: {
    database: HealthStatus;
    redis: HealthStatus;
  };
}

/**
 * Liveness probe response
 */
export interface LivenessResponse {
  /**
   * Whether the application process is alive
   */
  alive: boolean;

  /**
   * ISO timestamp of liveness check
   */
  timestamp: string;

  /**
   * Process uptime in seconds
   */
  uptime: number;
}
