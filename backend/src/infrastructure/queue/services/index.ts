/**
 * @fileoverview Queue Services Index
 * @module infrastructure/queue/services
 * @description Exports all queue services
 */

export { BaseQueueService } from './base-queue.service';
export { ImprovedMessageQueueService } from './improved-message-queue.service';
export { QueueMonitoringService } from './queue-monitoring.service';
export { QueueSchedulerService } from './queue-scheduler.service';

// Re-export types used by services
export type {
  QueueHealth,
  QueueMetrics,
  QueueStats,
  FailedJobInfo,
  QueueJobOptions,
} from '../interfaces';

export type { QueueName, JobPriority } from '../enums';
