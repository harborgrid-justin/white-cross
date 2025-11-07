/**
 * Webhook Payload Types
 * Type definitions for webhook event payloads from external integrations
 */

/**
 * Base webhook payload interface with common properties
 */
export interface BaseWebhookPayload {
  /** Event timestamp in ISO 8601 format */
  timestamp: string;
  /** Event source identifier */
  source: string;
  /** Event version for API compatibility */
  version?: string;
}

/**
 * Student created webhook payload
 */
export interface StudentCreatedPayload extends BaseWebhookPayload {
  student: {
    sisId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    grade?: string;
    enrollmentStatus: string;
    email?: string;
    phone?: string;
  };
}

/**
 * Student updated webhook payload
 */
export interface StudentUpdatedPayload extends BaseWebhookPayload {
  student: {
    sisId: string;
    changes: Partial<{
      firstName: string;
      lastName: string;
      grade: string;
      enrollmentStatus: string;
      email: string;
      phone: string;
    }>;
  };
}

/**
 * Health record updated webhook payload
 */
export interface HealthRecordUpdatedPayload extends BaseWebhookPayload {
  healthRecord: {
    studentSisId: string;
    recordType: string;
    recordId: string;
    changes: Record<string, unknown>;
  };
}

/**
 * Union type for all webhook payloads
 */
export type WebhookPayload =
  | StudentCreatedPayload
  | StudentUpdatedPayload
  | HealthRecordUpdatedPayload
  | BaseWebhookPayload;

/**
 * Type guard for student created payload
 */
export function isStudentCreatedPayload(
  payload: WebhookPayload,
): payload is StudentCreatedPayload {
  return 'student' in payload && 'sisId' in (payload as StudentCreatedPayload).student;
}

/**
 * Type guard for student updated payload
 */
export function isStudentUpdatedPayload(
  payload: WebhookPayload,
): payload is StudentUpdatedPayload {
  return (
    'student' in payload &&
    'changes' in (payload as StudentUpdatedPayload).student
  );
}

/**
 * Type guard for health record updated payload
 */
export function isHealthRecordUpdatedPayload(
  payload: WebhookPayload,
): payload is HealthRecordUpdatedPayload {
  return 'healthRecord' in payload;
}
