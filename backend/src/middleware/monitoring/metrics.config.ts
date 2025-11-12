/**
 * LOC: WC-MID-METRICS-CONFIG-001
 * Configuration for metrics collection middleware
 *
 * Defines configuration interfaces and default values for the
 * enterprise-grade metrics collection system.
 */

/**
 * Configuration interface for metrics middleware
 */
export interface IMetricsConfig {
  enabled: boolean;
  sampleRate: number;
  enableHealthcareMetrics: boolean;
  enablePerformanceMetrics: boolean;
  enableUserMetrics: boolean;
  enableErrorMetrics: boolean;
  batchSize: number;
  flushInterval: number;
  retentionDays: number;
  defaultTags: Record<string, string>;
  excludePaths: string[];
  enableAlerts: boolean;
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}

/**
 * Default configuration for metrics middleware
 */
export const DEFAULT_METRICS_CONFIG: IMetricsConfig = {
  enabled: true,
  sampleRate: 1.0,
  enableHealthcareMetrics: true,
  enablePerformanceMetrics: true,
  enableUserMetrics: true,
  enableErrorMetrics: true,
  batchSize: 100,
  flushInterval: 30000, // 30 seconds
  retentionDays: 90,
  defaultTags: {
    service: 'white-cross-healthcare',
    environment: process.env.NODE_ENV || 'development',
  },
  excludePaths: ['/health', '/metrics', '/favicon.ico'],
  enableAlerts: true,
  alertThresholds: {
    responseTime: 2000, // 2 seconds
    errorRate: 0.05, // 5%
    memoryUsage: 0.85, // 85%
    cpuUsage: 0.8, // 80%
  },
};
