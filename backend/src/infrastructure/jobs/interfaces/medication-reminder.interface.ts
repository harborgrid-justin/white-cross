/**
 * Type definitions for Medication Reminder functionality
 *
 * Extracted from medication-reminder.processor.ts for better modularity
 */
import { RecipientType   } from "../../database/models";

/**
 * Medication reminder with scheduling and status information
 */
export interface MedicationReminder {
  id: string;
  studentMedicationId: string;
  studentId: string;
  studentName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  scheduledTime: Date;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
}

/**
 * Raw query result from database for medication reminders
 * Maps snake_case database columns to TypeScript interface
 */
export interface MedicationReminderQueryResult {
  student_medication_id: string;
  student_id: string;
  student_name: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  scheduled_hour: number;
  scheduled_minute: number;
  was_administered: boolean;
}

/**
 * Contact information for reminder notifications
 */
export interface ReminderContact {
  studentId: string;
  studentName: string;
  recipientType: RecipientType;
  email?: string;
  phone?: string;
  guardianName?: string;
}

/**
 * Raw query result for student contacts from database
 */
export interface StudentContactQueryResult {
  student_id: string;
  student_name: string;
  recipient_type: string;
  email: string;
  phone: string;
  guardian_name: string;
}

/**
 * Result of notification sending operations
 */
export interface ReminderNotificationResult {
  sent: number;
  failed: number;
}

/**
 * Complete result of medication reminder job processing
 */
export interface MedicationReminderProcessorResult {
  processed: number;
  reminders: MedicationReminder[];
  notificationsSent: number;
  notificationsFailed: number;
  duration: number;
}

/**
 * Typed replacements for SQL queries
 */
export interface ReminderQueryReplacements {
  startOfDay: Date;
  endOfDay: Date;
  organizationId?: string;
  studentId?: string;
  medicationId?: string;
}

/**
 * Cache configuration constants
 */
export const CACHE_CONFIG = {
  TTL: 3600000, // 1 hour in milliseconds
  TAG_PREFIX: 'reminders',
} as const;
