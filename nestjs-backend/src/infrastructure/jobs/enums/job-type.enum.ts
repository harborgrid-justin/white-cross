/**
 * Job Types Enum
 *
 * Defines all available job types in the queue system
 */
export enum JobType {
  MEDICATION_REMINDER = 'medication-reminder',
  IMMUNIZATION_ALERT = 'immunization-alert',
  APPOINTMENT_REMINDER = 'appointment-reminder',
  INVENTORY_MAINTENANCE = 'inventory-maintenance',
  REPORT_GENERATION = 'report-generation',
  DATA_EXPORT = 'data-export',
  NOTIFICATION_BATCH = 'notification-batch',
  CLEANUP_TASK = 'cleanup-task'
}
