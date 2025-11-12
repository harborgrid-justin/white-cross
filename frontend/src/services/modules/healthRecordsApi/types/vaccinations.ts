/**
 * Health Records API - Vaccination Type Definitions
 *
 * Types for managing immunization records and compliance tracking
 *
 * @module services/modules/healthRecordsApi/types/vaccinations
 */

import type { StudentReference } from './base';

/**
 * Vaccination compliance status
 * Indicates whether a student meets vaccination requirements
 */
export enum VaccinationStatus {
  /** All required doses have been administered */
  COMPLETED = 'COMPLETED',
  /** Some doses have been administered but series is incomplete */
  PARTIAL = 'PARTIAL',
  /** Required vaccination is past due date */
  OVERDUE = 'OVERDUE',
  /** Student has exemption from this vaccination */
  EXEMPTED = 'EXEMPTED',
  /** Vaccination is not required for this student */
  NOT_REQUIRED = 'NOT_REQUIRED'
}

/**
 * Complete vaccination record entity
 * Represents a single vaccine dose administered to a student
 */
export interface Vaccination {
  /** Unique identifier for the vaccination record */
  id: string;
  /** ID of the student who received the vaccine */
  studentId: string;
  /** Name of the vaccine (e.g., "MMR", "DTaP") */
  vaccineName: string;
  /** Type or category of vaccine */
  vaccineType: string;
  /** CVX (vaccine administered) code */
  cvxCode?: string;
  /** Dose number in a multi-dose series */
  doseNumber?: number;
  /** Total number of doses in the series */
  totalDoses?: number;
  /** Date vaccine was administered (ISO 8601 format) */
  administeredDate: string;
  /** Expiration date of the vaccine dose (ISO 8601 format) */
  expirationDate?: string;
  /** Lot number of the vaccine batch */
  lotNumber?: string;
  /** Manufacturer of the vaccine */
  manufacturer?: string;
  /** Name of person/provider who administered the vaccine */
  administeredBy?: string;
  /** National Provider Identifier of the administering provider */
  administeredByNPI?: string;
  /** Anatomical site where vaccine was administered (e.g., "left deltoid") */
  site?: string;
  /** Route of administration (e.g., "intramuscular", "subcutaneous") */
  route?: string;
  /** Dosage amount (e.g., "0.5 mL") */
  dosage?: string;
  /** Compliance status of this vaccination */
  status: VaccinationStatus;
  /** Any adverse reactions observed */
  reactions?: string[];
  /** Additional notes about the vaccination */
  notes?: string;
  /** Date when next dose is due (ISO 8601 format) */
  nextDueDate?: string;
  /** Whether student is compliant with vaccination requirements */
  isCompliant: boolean;
  /** Reference to the student */
  student: StudentReference;
  /** Timestamp when record was created (ISO 8601 format) */
  createdAt: string;
  /** Timestamp when record was last updated (ISO 8601 format) */
  updatedAt: string;
}

/**
 * Data required to create a new vaccination record
 * Excludes system-generated fields like id, timestamps, and student reference
 */
export interface VaccinationCreate {
  /** ID of the student who received the vaccine */
  studentId: string;
  /** Name of the vaccine (e.g., "MMR", "DTaP") */
  vaccineName: string;
  /** Type or category of vaccine */
  vaccineType: string;
  /** CVX (vaccine administered) code */
  cvxCode?: string;
  /** Dose number in a multi-dose series */
  doseNumber?: number;
  /** Total number of doses in the series */
  totalDoses?: number;
  /** Date vaccine was administered (ISO 8601 format) */
  administeredDate: string;
  /** Expiration date of the vaccine dose (ISO 8601 format) */
  expirationDate?: string;
  /** Lot number of the vaccine batch */
  lotNumber?: string;
  /** Manufacturer of the vaccine */
  manufacturer?: string;
  /** Name of person/provider who administered the vaccine */
  administeredBy?: string;
  /** National Provider Identifier of the administering provider */
  administeredByNPI?: string;
  /** Anatomical site where vaccine was administered */
  site?: string;
  /** Route of administration */
  route?: string;
  /** Dosage amount */
  dosage?: string;
  /** Compliance status of this vaccination */
  status?: VaccinationStatus;
  /** Any adverse reactions observed */
  reactions?: string[];
  /** Additional notes about the vaccination */
  notes?: string;
  /** Date when next dose is due (ISO 8601 format) */
  nextDueDate?: string;
}

/**
 * Fields that can be updated on an existing vaccination record
 * All fields are optional to support partial updates
 */
export interface VaccinationUpdate {
  /** Name of the vaccine */
  vaccineName?: string;
  /** Type or category of vaccine */
  vaccineType?: string;
  /** CVX (vaccine administered) code */
  cvxCode?: string;
  /** Dose number in a multi-dose series */
  doseNumber?: number;
  /** Total number of doses in the series */
  totalDoses?: number;
  /** Date vaccine was administered (ISO 8601 format) */
  administeredDate?: string;
  /** Expiration date of the vaccine dose (ISO 8601 format) */
  expirationDate?: string;
  /** Lot number of the vaccine batch */
  lotNumber?: string;
  /** Manufacturer of the vaccine */
  manufacturer?: string;
  /** Name of person/provider who administered the vaccine */
  administeredBy?: string;
  /** National Provider Identifier of the administering provider */
  administeredByNPI?: string;
  /** Anatomical site where vaccine was administered */
  site?: string;
  /** Route of administration */
  route?: string;
  /** Dosage amount */
  dosage?: string;
  /** Compliance status of this vaccination */
  status?: VaccinationStatus;
  /** Any adverse reactions observed */
  reactions?: string[];
  /** Additional notes about the vaccination */
  notes?: string;
  /** Date when next dose is due (ISO 8601 format) */
  nextDueDate?: string;
}

/**
 * Comprehensive vaccination compliance report for a student
 * Provides overview of vaccination status and requirements
 */
export interface VaccinationCompliance {
  /** ID of the student */
  studentId: string;
  /** Overall compliance status - true if all required vaccinations are complete */
  isCompliant: boolean;
  /** List of all required vaccinations with their status */
  requiredVaccinations: Array<{
    /** Name of the required vaccine */
    name: string;
    /** Current compliance status */
    status: VaccinationStatus;
    /** Due date for next dose (ISO 8601 format) */
    dueDate?: string;
    /** Number of doses already administered */
    completedDoses: number;
    /** Total number of doses required */
    requiredDoses: number;
  }>;
  /** Names of vaccinations that are missing or incomplete */
  missingVaccinations: string[];
  /** Vaccinations with upcoming due dates */
  upcomingDue: Array<{
    /** Name of the vaccine */
    name: string;
    /** Due date (ISO 8601 format) */
    dueDate: string;
  }>;
  /** Any exemptions on file */
  exemptions?: Array<{
    /** Name of the vaccine exempted */
    vaccineName: string;
    /** Type of exemption (medical, religious, etc.) */
    exemptionType: string;
    /** Reason for exemption */
    reason?: string;
  }>;
}
