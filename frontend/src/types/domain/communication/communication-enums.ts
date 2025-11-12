/**
 * WF-COMP-320 | communication-enums.ts - Communication enumeration types
 * Purpose: Centralized enumerations for communication domain
 * Dependencies: None (pure enums)
 * Exports: All communication-related enums
 * Last Updated: 2025-11-12 | File Type: .ts
 */

/**
 * Message Type - Communication channels
 */
export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE = 'VOICE',
}

/**
 * Message Priority Levels
 */
export enum MessagePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

/**
 * Message Categories
 */
export enum MessageCategory {
  EMERGENCY = 'EMERGENCY',
  HEALTH_UPDATE = 'HEALTH_UPDATE',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  GENERAL = 'GENERAL',
  INCIDENT_NOTIFICATION = 'INCIDENT_NOTIFICATION',
  COMPLIANCE = 'COMPLIANCE',
}

/**
 * Recipient Types
 */
export enum RecipientType {
  STUDENT = 'STUDENT',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT',
  PARENT = 'PARENT',
  NURSE = 'NURSE',
  ADMIN = 'ADMIN',
}

/**
 * Delivery Status
 */
export enum DeliveryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

/**
 * Emergency Alert Severity
 */
export enum EmergencyAlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Emergency Alert Audience
 */
export enum EmergencyAlertAudience {
  ALL_STAFF = 'ALL_STAFF',
  NURSES_ONLY = 'NURSES_ONLY',
  SPECIFIC_GROUPS = 'SPECIFIC_GROUPS',
}
