/**
 * Administration API - System Monitoring (Barrel Export)
 *
 * This file maintains backward compatibility by re-exporting all monitoring
 * services from the monitoring module.
 *
 * For better code organization, the implementation has been split into:
 * - monitoring/systemHealthService.ts - System health monitoring
 * - monitoring/metricsService.ts - Performance metrics tracking
 * - monitoring/backupService.ts - Backup management
 * - monitoring/monitoringService.ts - Combined monitoring coordinator
 *
 * @module services/modules/administrationApi/monitoring
 */

// Re-export all services and factory functions from the monitoring module
export {
  SystemHealthService,
  MetricsService,
  BackupService,
  MonitoringService,
  createSystemHealthService,
  createMetricsService,
  createBackupService,
  createMonitoringService,
} from './monitoring';
