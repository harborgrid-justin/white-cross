/**
 * Appointments Domain Configuration
 * 
 * Enterprise-grade configuration for appointment domain with query keys,
 * cache strategies, and domain-specific constants.
 * 
 * @module hooks/domains/appointments/config
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import type { DataSensitivity } from '../../shared/useCacheManager';
import type {
  AppointmentFilters,
  WaitlistFilters,
} from '../../../types';

/**
 * Centralized query key factory for appointment domain
 */
export const appointmentQueryKeys = {
  // Base keys
  domain: ['appointments'] as const,
  
  // Main query categories
  base: {
    lists: () => [...appointmentQueryKeys.domain, 'list'] as const,
    details: () => [...appointmentQueryKeys.domain, 'detail'] as const,
    statistics: () => [...appointmentQueryKeys.domain, 'statistics'] as const,
    waitlist: () => [...appointmentQueryKeys.domain, 'waitlist'] as const,
    availability: () => [...appointmentQueryKeys.domain, 'availability'] as const,
  },
  
  // Specific queries
  lists: {
    all: () => [...appointmentQueryKeys.base.lists()] as const,
    filtered: (filters?: AppointmentFilters) => [...appointmentQueryKeys.base.lists(), filters] as const,
    upcoming: (nurseId: string, limit?: number) => [...appointmentQueryKeys.base.lists(), 'upcoming', nurseId, limit] as const,
  },
  
  details: {
    byId: (id: string) => [...appointmentQueryKeys.base.details(), id] as const,
  },
  
  statistics: {
    global: (filters?: { nurseId?: string; dateFrom?: string; dateTo?: string }) => 
      [...appointmentQueryKeys.base.statistics(), filters] as const,
  },
  
  waitlist: {
    all: (filters?: WaitlistFilters) => [...appointmentQueryKeys.base.waitlist(), filters] as const,
  },
  
  availability: {
    byNurse: (nurseId: string, date?: string, duration?: number) => 
      [...appointmentQueryKeys.base.availability(), nurseId, date, duration] as const,
    nurseSchedule: (nurseId: string, date?: string) => 
      [...appointmentQueryKeys.base.availability(), 'schedule', nurseId, date] as const,
  },
} as const;

/**
 * Data sensitivity mapping for appointment domain
 */
export const APPOINTMENT_DATA_SENSITIVITY: Record<string, DataSensitivity> = {
  // Patient appointment details - high sensitivity
  appointmentDetails: 'phi',
  patientInfo: 'phi',
  healthNotes: 'phi',
  
  // Scheduling information - moderate sensitivity
  scheduleData: 'confidential',
  availability: 'confidential',
  
  // Statistics and analytics - low sensitivity
  statistics: 'internal',
  counts: 'internal',
  
  // General schedule information - minimal sensitivity  
  nurseSchedule: 'internal',
  timeSlots: 'public',
} as const;

/**
 * Cache configuration for appointment domain
 */
export const APPOINTMENT_CACHE_CONFIG = {
  // Patient-specific data - shorter cache times
  appointments: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Upcoming appointments - very short cache
  upcoming: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  },
  
  // Availability data - short cache
  availability: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
  },
  
  // Nurse schedules - moderate cache
  nurseSchedule: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  
  // Statistics - longer cache
  statistics: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Waitlist - moderate cache
  waitlist: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  
  // Mutations
  mutations: {
    gcTime: 5 * 60 * 1000, // 5 minutes
  },
} as const;

/**
 * Appointment list filters interface
 */
export interface AppointmentListFilters extends AppointmentFilters {
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'student' | 'nurse' | 'type';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Appointment error codes
 */
export const APPOINTMENT_ERROR_CODES = {
  NOT_FOUND: 'Appointment not found',
  CREATE_FAILED: 'Failed to create appointment',
  UPDATE_FAILED: 'Failed to update appointment',
  DELETE_FAILED: 'Failed to delete appointment',
  SCHEDULING_CONFLICT: 'Scheduling conflict detected',
  INVALID_TIME_SLOT: 'Invalid time slot',
  NURSE_UNAVAILABLE: 'Nurse not available at selected time',
  WAITLIST_FULL: 'Waitlist is full',
} as const;

/**
 * Appointment operations constants
 */
export const APPOINTMENT_OPERATIONS = {
  CREATE: 'create_appointment',
  UPDATE: 'update_appointment',
  DELETE: 'delete_appointment',
  CANCEL: 'cancel_appointment',
  NO_SHOW: 'mark_no_show',
  RESCHEDULE: 'reschedule_appointment',
  ADD_TO_WAITLIST: 'add_to_waitlist',
  REMOVE_FROM_WAITLIST: 'remove_from_waitlist',
  SET_AVAILABILITY: 'set_availability',
  UPDATE_AVAILABILITY: 'update_availability',
} as const;
