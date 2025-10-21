/**
 * Monitoring Middleware Index
 * 
 * Centralized exports for monitoring middleware including performance tracking,
 * error monitoring, analytics, and health metrics.
 */

// Monitoring Middleware
export * from './monitoring.middleware';

// Main monitoring utilities
export {
  PerformanceMonitor,
  ErrorTracker,
  AnalyticsTracker,
  createPerformanceMonitoringMiddleware,
  createErrorTrackingMiddleware,
  createAnalyticsMiddleware,
  createHealthMonitoringMiddleware,
  monitoringUtils,
} from './monitoring.middleware';

// Monitoring types
export type {
  PerformanceMetrics,
  ErrorLog,
  AnalyticsEvent,
} from './monitoring.middleware';