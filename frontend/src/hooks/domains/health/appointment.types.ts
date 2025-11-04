/**
 * Appointment Domain Types
 * Appointment-related interfaces and enums
 */

import type { Patient } from './patient.types';
import type { Provider, Facility } from './provider.types';

// ============================================================================
// ENUMS
// ============================================================================

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  DIAGNOSTIC = 'diagnostic',
  EMERGENCY = 'emergency',
  PREVENTIVE = 'preventive'
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  facilityId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledDateTime: string;
  duration: number; // minutes
  reason: string;
  notes?: string;
  checkedInAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  provider?: Provider;
  facility?: Facility;
}

// ============================================================================
// FILTER INTERFACES
// ============================================================================

export interface AppointmentFilters {
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  providerId?: string[];
  facilityId?: string[];
  dateRange?: [string, string];
  patientId?: string;
  search?: string;
}
