/**
 * Administration API - Monitoring Module
 *
 * @deprecated This module is deprecated and will be removed in a future version.
 * Migrate to server actions for better performance and type safety.
 *
 * Migration Guide:
 * - System Monitoring: Use '@/lib/actions/admin.monitoring' server actions
 * - API Client: Use '@/lib/api/server' for server-side operations
 *
 * @example Migration from legacy to server actions
 * ```typescript
 * // DEPRECATED: Legacy API client approach
 * import { createMonitoringService } from '@/services/modules/administrationApi/monitoring';
 * const service = createMonitoringService(apiClient);
 * const health = await service.health.getSystemHealth();
 * const metrics = await service.metrics.getMetrics();
 *
 * // RECOMMENDED: Server actions approach
 * import { getSystemHealth, getMetrics } from '@/lib/actions/admin.monitoring';
 * const health = await getSystemHealth();
 * const metrics = await getMetrics();
 * ```
 *
 * Barrel export for all monitoring services including:
 * - System health monitoring
 * - Performance metrics tracking
 * - Backup management
 * - Combined monitoring service
 *
 * @module services/modules/administrationApi/monitoring
 */

// Export service classes
export { SystemHealthService } from './systemHealthService';
export { MetricsService } from './metricsService';
export { BackupService } from './backupService';
export { MonitoringService } from './monitoringService';

// Export factory functions
export { createSystemHealthService } from './systemHealthService';
export { createMetricsService } from './metricsService';
export { createBackupService } from './backupService';
export { createMonitoringService } from './monitoringService';
