/**
 * AppointmentScheduler Type Definitions
 *
 * Shared TypeScript interfaces and types for the appointment scheduling system.
 */

import type { Appointment, AppointmentType, AppointmentPriority } from '../AppointmentCard';

/**
 * Time slot interface for appointment scheduling
 */
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  providerId: string;
  roomId?: string;
}

/**
 * Provider interface for scheduling
 */
export interface Provider {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar?: string;
  specialties: string[];
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

/**
 * Patient interface for scheduling
 */
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

/**
 * Room interface for scheduling
 */
export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  equipment: string[];
  isVirtual: boolean;
}

/**
 * Props for the AppointmentScheduler component
 */
export interface AppointmentSchedulerProps {
  /** Available providers */
  providers?: Provider[];
  /** Available patients */
  patients?: Patient[];
  /** Available rooms */
  rooms?: Room[];
  /** Existing appointments for conflict checking */
  existingAppointments?: Appointment[];
  /** Default selected date */
  defaultDate?: Date;
  /** Default selected provider */
  defaultProvider?: string;
  /** Default selected patient */
  defaultPatient?: string;
  /** Whether to show patient selection */
  showPatientSelection?: boolean;
  /** Whether to show provider selection */
  showProviderSelection?: boolean;
  /** Whether to show room selection */
  showRoomSelection?: boolean;
  /** Whether to allow virtual appointments */
  allowVirtual?: boolean;
  /** Minimum duration for appointments (in minutes) */
  minDuration?: number;
  /** Maximum duration for appointments (in minutes) */
  maxDuration?: number;
  /** Custom CSS classes */
  className?: string;
  /** Schedule appointment handler */
  onSchedule?: (appointmentData: Partial<Appointment>) => Promise<void>;
  /** Cancel scheduling handler */
  onCancel?: () => void;
  /** Provider selection handler */
  onProviderChange?: (providerId: string) => void;
  /** Patient selection handler */
  onPatientChange?: (patientId: string) => void;
  /** Date change handler */
  onDateChange?: (date: Date) => void;
  /** Load time slots handler */
  onLoadTimeSlots?: (date: Date, providerId: string) => Promise<TimeSlot[]>;
  /** Search patients handler */
  onSearchPatients?: (query: string) => Promise<Patient[]>;
  /** Search providers handler */
  onSearchProviders?: (query: string) => Promise<Provider[]>;
}

// Re-export types from AppointmentCard for convenience
export type { Appointment, AppointmentType, AppointmentPriority };
