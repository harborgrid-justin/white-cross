/**
 * @fileoverview Administration domain system health and monitoring type definitions
 * @module hooks/domains/administration/administrationSystemTypes
 * @category Hooks - Administration
 *
 * Type definitions for system health monitoring, service status, and performance metrics.
 *
 * @remarks
 * **Status Levels:**
 * - `HEALTHY`: All services operational, metrics within normal range
 * - `WARNING`: Some services degraded or metrics approaching limits
 * - `ERROR`: One or more services down but system partially functional
 * - `CRITICAL`: System-wide failure or multiple critical services down
 *
 * **Monitoring Strategy:**
 * - Poll health endpoint every 30-60 seconds for dashboards
 * - Trigger alerts on WARNING or higher status
 * - Log all health checks for historical analysis
 * - Monitor trends in response times and error rates
 */

/**
 * System health monitoring information.
 *
 * Comprehensive health check data including overall system status,
 * individual service health, and performance metrics. Used for
 * monitoring dashboards and alerting.
 *
 * @property {'HEALTHY' | 'WARNING' | 'ERROR' | 'CRITICAL'} status - Overall system health status
 * @property {number} uptime - System uptime in seconds
 * @property {string} version - Application version string
 * @property {string} environment - Environment name ('production', 'staging', 'development')
 * @property {ServiceHealth[]} services - Health status of individual services
 * @property {SystemMetrics} metrics - Current system performance metrics
 * @property {string} lastChecked - ISO timestamp of last health check
 *
 * @remarks
 * **Status Levels:**
 * - `HEALTHY`: All services operational, metrics within normal range
 * - `WARNING`: Some services degraded or metrics approaching limits
 * - `ERROR`: One or more services down but system partially functional
 * - `CRITICAL`: System-wide failure or multiple critical services down
 *
 * **Monitoring Strategy:**
 * - Poll health endpoint every 30-60 seconds for dashboards
 * - Trigger alerts on WARNING or higher status
 * - Log all health checks for historical analysis
 * - Monitor trends in response times and error rates
 *
 * **Service Dependencies:**
 * Critical services (database, authentication) should trigger
 * ERROR/CRITICAL status when down. Non-critical services (email)
 * should trigger WARNING.
 *
 * @example
 * ```typescript
 * const health: SystemHealth = {
 *   status: 'HEALTHY',
 *   uptime: 8640000, // 100 days in seconds
 *   version: '2.5.0',
 *   environment: 'production',
 *   services: [
 *     {
 *       name: 'database',
 *       status: 'UP',
 *       responseTime: 15,
 *       errorRate: 0.001,
 *       lastChecked: '2025-10-26T14:30:00Z'
 *     },
 *     {
 *       name: 'authentication',
 *       status: 'UP',
 *       responseTime: 45,
 *       errorRate: 0.002,
 *       lastChecked: '2025-10-26T14:30:00Z'
 *     }
 *   ],
 *   metrics: {
 *     cpu: 45.2,
 *     memory: 68.5,
 *     disk: 72.0,
 *     network: {
 *       bytesIn: 1024000,
 *       bytesOut: 2048000
 *     },
 *     database: {
 *       connections: 25,
 *       responseTime: 12
 *     }
 *   },
 *   lastChecked: '2025-10-26T14:30:00Z'
 * };
 * ```
 *
 * @see {@link ServiceHealth} for individual service health
 * @see {@link SystemMetrics} for performance metrics
 * @see {@link useSystemHealth} for querying health status
 */
export interface SystemHealth {
  status: 'HEALTHY' | 'WARNING' | 'ERROR' | 'CRITICAL';
  uptime: number;
  version: string;
  environment: string;
  services: ServiceHealth[];
  metrics: SystemMetrics;
  lastChecked: string;
}

export interface ServiceHealth {
  name: string;
  status: 'UP' | 'DOWN' | 'DEGRADED';
  responseTime?: number;
  errorRate?: number;
  lastChecked: string;
  details?: Record<string, any>;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  database: {
    connections: number;
    responseTime: number;
  };
}
