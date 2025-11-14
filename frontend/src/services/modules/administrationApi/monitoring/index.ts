/**
 * Administration API - Monitoring Module
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
