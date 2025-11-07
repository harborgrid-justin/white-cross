/**
 * Jobs Infrastructure Module
 *
 * Central export for all job-related types, services, and processors
 */
export { JobsModule } from './jobs.module';
export { JobType } from './enums/job-type.enum';
export { QueueManagerService } from './services/queue-manager.service';
export type { JobOptions, QueueStats } from './services/queue-manager.service';
export type {
  MedicationReminderData,
  InventoryMaintenanceData,
  ImmunizationAlertData,
  AppointmentReminderData,
  ReportGenerationData,
  DataExportData,
  NotificationBatchData,
  CleanupTaskData,
} from './interfaces/job-data.interface';
export type { JobProcessor } from './interfaces/job-processor.interface';
export {
  MedicationReminderProcessor,
  InventoryMaintenanceProcessor,
} from './processors';
