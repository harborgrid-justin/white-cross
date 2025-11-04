/**
 * @fileoverview Immunizations UI Type Definitions
 * @module app/immunizations/components/types
 *
 * TypeScript types for immunization UI components.
 * These are separate from server action types and focused on UI state.
 */

// Healthcare immunization types
export type ImmunizationType =
  | 'covid19'
  | 'flu'
  | 'hepatitis_b'
  | 'measles'
  | 'mumps'
  | 'rubella'
  | 'polio'
  | 'tetanus'
  | 'diphtheria'
  | 'pertussis'
  | 'varicella'
  | 'meningococcal'
  | 'hpv'
  | 'pneumococcal';

// Immunization status types
export type ImmunizationStatus =
  | 'scheduled'
  | 'administered'
  | 'declined'
  | 'deferred'
  | 'overdue'
  | 'completed'
  | 'contraindicated';

// Priority levels for immunizations
export type ImmunizationPriority = 'low' | 'medium' | 'high' | 'urgent';

// View modes for displaying immunizations
export type ViewMode = 'calendar' | 'list' | 'schedule';

/**
 * UI representation of an immunization record
 * Combines server data with UI-specific fields
 */
export interface Immunization {
  id: string;
  studentId: string;
  studentName?: string;
  vaccineName: string;
  immunizationType: ImmunizationType;
  scheduledDate?: string;
  administeredDate?: string;
  dueDate: string;
  status: ImmunizationStatus;
  priority: ImmunizationPriority;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  notes?: string;
  reactions?: string[];
  nextDue?: string;
  seriesPosition?: string; // e.g., "1 of 3"
  createdAt: string;
  updatedAt: string;
}

/**
 * Statistics for immunization compliance and scheduling
 */
export interface ImmunizationStats {
  totalStudents: number;
  upToDate: number;
  overdue: number;
  scheduled: number;
  declined: number;
  complianceRate: number;
  dueThisWeek: number;
  dueThisMonth: number;
}

/**
 * Props for the main ImmunizationsContent component
 */
export interface ImmunizationsContentProps {
  initialImmunizations?: Immunization[];
  userRole?: string;
}

/**
 * Filter state for immunization list
 */
export interface ImmunizationFilterState {
  statusFilter: ImmunizationStatus | 'all';
  typeFilter: ImmunizationType | 'all';
  searchQuery: string;
  selectedDate: Date;
}
