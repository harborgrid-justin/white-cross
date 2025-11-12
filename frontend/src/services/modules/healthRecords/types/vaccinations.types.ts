/**
 * Vaccinations Type Definitions
 *
 * Types for managing student vaccinations including:
 * - Vaccination records and metadata
 * - Compliance tracking
 * - Exemption management
 *
 * @module services/modules/healthRecords/types/vaccinations.types
 */

/**
 * Vaccination record entity
 */
export interface Vaccination {
  id: string;
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
  isCompliant: boolean;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Vaccination status enumeration
 */
export enum VaccinationStatus {
  COMPLETED = 'COMPLETED',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE',
  EXEMPTED = 'EXEMPTED',
  NOT_REQUIRED = 'NOT_REQUIRED'
}

/**
 * Data required to create a new vaccination record
 */
export interface VaccinationCreate {
  studentId: string;
  vaccineName: string;
  vaccineType: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status?: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
}

/**
 * Data for updating an existing vaccination record
 */
export interface VaccinationUpdate {
  vaccineName?: string;
  vaccineType?: string;
  cvxCode?: string;
  doseNumber?: number;
  totalDoses?: number;
  administeredDate?: string;
  expirationDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy?: string;
  administeredByNPI?: string;
  site?: string;
  route?: string;
  dosage?: string;
  status?: VaccinationStatus;
  reactions?: string[];
  notes?: string;
  nextDueDate?: string;
}

/**
 * Vaccination compliance information for a student
 */
export interface VaccinationCompliance {
  studentId: string;
  isCompliant: boolean;
  requiredVaccinations: Array<{
    name: string;
    status: VaccinationStatus;
    dueDate?: string;
    completedDoses: number;
    requiredDoses: number;
  }>;
  missingVaccinations: string[];
  upcomingDue: Array<{
    name: string;
    dueDate: string;
  }>;
  exemptions?: Array<{
    vaccineName: string;
    exemptionType: string;
    reason?: string;
  }>;
}

/**
 * Type aliases for backward compatibility
 */
export type VaccinationRecord = Vaccination;
export type CreateVaccinationRequest = VaccinationCreate;
