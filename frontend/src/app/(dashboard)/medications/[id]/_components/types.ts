/**
 * @fileoverview Medication Detail Page Component Types
 * @module app/(dashboard)/medications/[id]/_components/types
 *
 * @description
 * Shared TypeScript type definitions for medication detail page components.
 * These types ensure type safety across all sub-components while maintaining
 * healthcare compliance and HIPAA requirements.
 *
 * **Type Safety:**
 * - Strict TypeScript interfaces for all component props
 * - Optional vs. required fields clearly defined
 * - Type aliases for complex nested structures
 *
 * **Healthcare Compliance:**
 * - All medication data is Protected Health Information (PHI)
 * - Types support audit logging requirements
 * - DEA controlled substance tracking
 * - Five Rights verification data structures
 *
 * @since 1.0.0
 */

/**
 * Student information for medication detail display
 *
 * @interface StudentInfo
 * @property {string} id - Student UUID
 * @property {string} firstName - Student first name (PHI)
 * @property {string} lastName - Student last name (PHI)
 * @property {string} gradeLevel - Current grade level
 *
 * @example
 * ```typescript
 * const student: StudentInfo = {
 *   id: 'abc-123',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   gradeLevel: '5'
 * };
 * ```
 */
export interface StudentInfo {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
}

/**
 * Medication status type
 * @typedef {'active' | 'inactive' | 'discontinued' | 'pending'} MedicationStatus
 */
export type MedicationStatus = 'active' | 'inactive' | 'discontinued' | 'pending';

/**
 * Medication quick info data for sidebar display
 *
 * @interface MedicationQuickInfoData
 * @property {MedicationStatus} status - Current medication status
 * @property {string} dosage - Medication dosage (e.g., "90 mcg")
 * @property {string} route - Administration route (e.g., "Inhalation")
 * @property {string} frequency - Administration frequency (e.g., "As needed")
 * @property {string} [nextDue] - Next scheduled administration (ISO 8601 timestamp)
 *
 * @example
 * ```typescript
 * const quickInfo: MedicationQuickInfoData = {
 *   status: 'active',
 *   dosage: '90 mcg',
 *   route: 'Inhalation',
 *   frequency: 'As needed for wheezing',
 *   nextDue: '2025-11-05T09:00:00Z'
 * };
 * ```
 */
export interface MedicationQuickInfoData {
  status: MedicationStatus;
  dosage: string;
  route: string;
  frequency: string;
  nextDue?: string;
}

/**
 * Administration record for display in log
 *
 * @interface AdministrationRecord
 * @property {string} id - Administration record UUID
 * @property {string} medicationName - Name of medication administered
 * @property {string} studentName - Student who received medication (PHI)
 * @property {string} dosageGiven - Actual dosage administered
 * @property {string} route - Administration route used
 * @property {string} administeredAt - Administration timestamp (ISO 8601)
 * @property {string} administeredBy - Nurse who administered
 * @property {string} [witnessedBy] - Witness for controlled substances
 * @property {string} [reactions] - Side effects or reactions noted
 * @property {boolean} [refusedByStudent] - Whether student refused medication
 * @property {string} [refusalReason] - Reason for refusal if applicable
 * @property {string} [notes] - Additional administration notes
 */
export interface AdministrationRecord {
  id: string;
  medicationName: string;
  studentName: string;
  dosageGiven: string;
  route: string;
  administeredAt: string;
  administeredBy: string;
  witnessedBy?: string;
  reactions?: string;
  refusedByStudent?: boolean;
  refusalReason?: string;
  notes?: string;
}

/**
 * Complete medication data for detail page
 *
 * @interface MedicationDetailData
 * @extends {MedicationQuickInfoData}
 * @property {string} id - Medication UUID
 * @property {string} name - Brand or common medication name
 * @property {string} [genericName] - Generic medication name
 * @property {StudentInfo} [student] - Associated student information
 *
 * @example
 * ```typescript
 * const medication: MedicationDetailData = {
 *   id: 'med-123',
 *   name: 'Albuterol HFA Inhaler',
 *   genericName: 'Albuterol Sulfate',
 *   status: 'active',
 *   dosage: '90 mcg',
 *   route: 'Inhalation',
 *   frequency: 'As needed',
 *   student: {
 *     id: 'student-456',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     gradeLevel: '5'
 *   }
 * };
 * ```
 */
export interface MedicationDetailData extends MedicationQuickInfoData {
  id: string;
  name: string;
  genericName?: string;
  student?: StudentInfo;
}
