/**
 * Medication Core Types
 *
 * Core type definitions for medication prescriptions and administration records.
 * These types support the Five Rights of Medication Administration and HIPAA-compliant
 * medication tracking.
 *
 * @module hooks/domains/medications/types/medication-core
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

/**
 * Medication prescription interface representing a prescribed medication for a student.
 *
 * Contains complete prescription information including dosage instructions, schedule,
 * and status tracking. This interface represents a student's active or historical
 * medication prescription.
 *
 * @interface Medication
 *
 * @property {string} id - Unique identifier for the medication prescription
 * @property {string} name - Medication name (brand or generic)
 * @property {string} dosage - Prescribed dosage with unit (e.g., "500mg", "2 tablets")
 * @property {string} frequency - Administration frequency (e.g., "twice daily", "every 6 hours")
 * @property {string} studentId - Unique identifier of the student prescribed this medication
 * @property {string} startDate - ISO 8601 date string when prescription starts
 * @property {string} [endDate] - ISO 8601 date string when prescription ends (optional for ongoing)
 * @property {'active' | 'paused' | 'completed'} status - Current prescription status
 * @property {string} [notes] - Additional prescription notes or special instructions
 * @property {string} createdAt - ISO 8601 timestamp when prescription was created
 * @property {string} updatedAt - ISO 8601 timestamp of last prescription update
 *
 * @example
 * ```typescript
 * const medication: Medication = {
 *   id: 'rx-12345',
 *   name: 'Amoxicillin',
 *   dosage: '500mg',
 *   frequency: 'Three times daily with meals',
 *   studentId: 'student-789',
 *   startDate: '2025-10-20T08:00:00Z',
 *   endDate: '2025-10-27T20:00:00Z',
 *   status: 'active',
 *   notes: 'Complete full course even if symptoms improve',
 *   createdAt: '2025-10-20T08:00:00Z',
 *   updatedAt: '2025-10-20T08:00:00Z'
 * };
 * ```
 *
 * @remarks
 * - This is PHI (Protected Health Information) and must be handled according to HIPAA
 * - Status changes should be audited with timestamps and user identification
 * - Dosage should include units to prevent medication errors
 *
 * @see {@link MedicationAdministration} for administration records
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  studentId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medication administration record documenting a single medication dose administered.
 *
 * Represents one instance of medication administration following the Five Rights protocol.
 * Each record serves as legal documentation and is immutable once created.
 *
 * @interface MedicationAdministration
 *
 * @property {string} id - Unique identifier for this administration event
 * @property {string} medicationId - ID of the medication that was administered
 * @property {string} studentId - ID of the student who received the medication
 * @property {string} administeredAt - ISO 8601 timestamp of actual administration
 * @property {string} administeredBy - ID or name of healthcare staff who administered
 * @property {string} dosageGiven - Actual dosage administered (e.g., "500mg", "2 tablets")
 * @property {string} [notes] - Optional notes about administration (refusal, complications, etc.)
 *
 * @example
 * ```typescript
 * const administrationRecord: MedicationAdministration = {
 *   id: 'admin-67890',
 *   medicationId: 'rx-12345',
 *   studentId: 'student-789',
 *   administeredAt: '2025-10-26T08:15:00Z',
 *   administeredBy: 'nurse-smith-456',
 *   dosageGiven: '500mg',
 *   notes: 'Student tolerated medication well, no adverse effects observed'
 * };
 * ```
 *
 * @remarks
 * - **CRITICAL**: Administration records are immutable legal documentation
 * - Must include Five Rights verification before creation
 * - All administrations must be audited with full traceability
 * - Dosage given must match prescribed dosage (verify with Five Rights)
 * - This is PHI and subject to HIPAA protection
 *
 * @see {@link Medication} for prescription details
 */
export interface MedicationAdministration {
  id: string;
  medicationId: string;
  studentId: string;
  administeredAt: string;
  administeredBy: string;
  dosageGiven: string;
  notes?: string;
}
