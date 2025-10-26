/**
 * @fileoverview Payload Type Definitions
 *
 * TypeScript interfaces for request payload types across all controllers.
 * These interfaces provide type safety when accessing properties on request.payload,
 * which has type 'string | object | Readable | Buffer' by default in Hapi.
 *
 * Usage pattern:
 * ```typescript
 * import { extractPayload } from '../../shared/utils';
 * import { ResetPasswordPayload } from '../../shared/types/payloadTypes';
 *
 * const payload = extractPayload(request.payload) as ResetPasswordPayload;
 * const { newPassword } = payload;
 * ```
 *
 * @module routes/shared/types/payloadTypes
 * @since 1.0.0
 */

/**
 * Core / Users Controller Payloads
 */

export interface ResetPasswordPayload {
  newPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/**
 * Documents Controller Payloads
 */

export interface SignDocumentPayload {
  signedByRole?: string;
  signatureData: string | object;
}

export interface ShareDocumentPayload {
  sharedWith: string[];
}

export interface BulkDeleteDocumentsPayload {
  documentIds: string[];
}

/**
 * Healthcare / Health Records Controller Payloads
 */

export interface RecordVitalSignsPayload {
  studentId: string;
  vitals: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    temperature?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    height?: number;
    weight?: number;
    bmi?: number;
    notes?: string;
  };
  recordedBy: string;
  recordedAt?: Date | string;
}

/**
 * Incidents Controller Payloads
 */

export interface AddIncidentEvidencePayload {
  evidenceType: string;
  evidenceUrls?: string[];
  evidenceUrl?: string;
  description?: string;
}

export interface CompleteFollowUpPayload {
  status: string;
  notes?: string;
  completedBy?: string;
  completedAt?: Date | string;
}

export interface NotifyParentPayload {
  method: string;
  message?: string;
  notifiedBy?: string;
}

export interface RecordParentNotificationPayload {
  notificationMethod: string;
  notifiedBy: string;
  notificationDate?: Date | string;
  notes?: string;
}

export interface FileInsuranceClaimPayload {
  claimNumber: string;
  claimStatus: string;
  insuranceProvider?: string;
  claimAmount?: number;
  filedDate?: Date | string;
  notes?: string;
}

export interface UpdateClaimStatusPayload {
  status: string;
  statusDate?: Date | string;
  notes?: string;
}

/**
 * Operations / Appointments Controller Payloads
 */

export interface CancelAppointmentPayload {
  reason?: string;
  cancelledBy?: string;
}

export interface CreateRecurringAppointmentsPayload {
  baseData: {
    studentId: string;
    appointmentType: string;
    location?: string;
    notes?: string;
  };
  recurrencePattern: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    interval: number;
    endDate?: Date | string;
    occurrences?: number;
    daysOfWeek?: number[];
  };
}

export interface RescheduleAppointmentPayload {
  reason?: string;
  scheduledFor: Date | string;
  rescheduledBy?: string;
}

/**
 * Operations / Emergency Contacts Controller Payloads
 */

export interface NotifyEmergencyContactPayload {
  method: string;
  message?: string;
  notifiedBy?: string;
  notificationDate?: Date | string;
}

/**
 * Operations / Inventory Controller Payloads
 */

export interface AdjustInventoryPayload {
  quantity: number;
  reason: string;
  adjustedBy?: string;
  notes?: string;
}

export interface RecordPhysicalCountPayload {
  countedQuantity: number;
  notes?: string;
  countedBy?: string;
  countDate?: Date | string;
}

export interface ReceiveInventoryPayload {
  status: string;
  receivedDate: Date | string;
  receivedBy?: string;
  receivedQuantity?: number;
  notes?: string;
}

/**
 * Healthcare / Medications Controller Payloads
 */

export interface DeactivateMedicationPayload {
  reason: string;
  deactivationType?: string;
  deactivatedBy?: string;
  deactivatedAt?: Date | string;
}

export interface AdjustMedicationInventoryPayload {
  quantity: number;
  reason: string;
  adjustedBy?: string;
  notes?: string;
}

export interface DiscardMedicationPayload {
  reason: string;
  discardedBy?: string;
  discardedAt?: Date | string;
  quantity?: number;
}
