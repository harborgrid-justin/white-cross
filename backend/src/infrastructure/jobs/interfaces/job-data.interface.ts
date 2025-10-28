/**
 * Job Data Interfaces
 *
 * Type definitions for all job data payloads
 */

export interface MedicationReminderData {
  organizationId?: string;
  medicationId?: string;
  studentId?: string;
}

export interface InventoryMaintenanceData {
  organizationId?: string;
  forceRefresh?: boolean;
}

export interface ImmunizationAlertData {
  organizationId?: string;
  studentId?: string;
}

export interface AppointmentReminderData {
  organizationId?: string;
  appointmentId?: string;
  daysAhead?: number;
}

export interface ReportGenerationData {
  reportType: string;
  organizationId: string;
  parameters: Record<string, any>;
}

export interface DataExportData {
  exportType: string;
  organizationId: string;
  filters: Record<string, any>;
}

export interface NotificationBatchData {
  recipientIds: string[];
  message: string;
  type: string;
}

export interface CleanupTaskData {
  taskType: string;
  olderThanDays?: number;
}
