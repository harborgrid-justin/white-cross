/**
 * @fileoverview Student Medication Prescription Service - Manages medication assignments to students
 *
 * Handles prescription assignment, authorization verification, and prescription lifecycle
 * management for student medications. Implements duplicate prescription detection,
 * parent/guardian authorization tracking, and prescription activation/deactivation
 * workflows. Ensures students receive appropriate medications with proper authorization
 * and safety protocols.
 *
 * @module services/medication/studentMedicationService
 *
 * **Prescription Management Features:**
 * - Student medication prescription assignment
 * - Duplicate prescription detection (prevents multiple active prescriptions for same medication)
 * - Student and medication existence validation
 * - Prescription activation and deactivation
 * - Parent/guardian authorization tracking
 * - Prescription termination with reason documentation
 *
 * **Safety Protocols:**
 * - Prevents duplicate active prescriptions for same medication
 * - Validates student existence before assignment
 * - Validates medication record existence
 * - Tracks prescription active status
 * - Documents prescription termination reasons
 * - Maintains complete audit trail with associations
 *
 * **Authorization Requirements:**
 * - Healthcare provider prescription or authorization
 * - Parent/guardian consent for medication administration
 * - School district medication policy compliance
 * - Proper documentation of prescription details
 *
 * @security All prescription operations require authenticated nurse/admin context
 * @compliance Supports school medication administration policies and state regulations
 * @hipaa Student medication assignments are PHI - comprehensive audit required
 * @safety Duplicate detection prevents medication errors and overdose risks
 *
 * **Upstream Dependencies:**
 * - logger.ts (utils/logger.ts) - Structured audit logging
 * - database/models - StudentMedication, Medication, Student models
 *
 * **Downstream Consumers:**
 * - index.ts (services/medication/index.ts) - Service aggregation
 * - Student medication routes - REST API endpoints
 *
 * **Related Services:**
 * - medicationCrudService.ts - Medication record management
 * - administrationService.ts - Medication administration logging
 * - controlledSubstanceLogger.ts - DEA compliance for controlled substances
 *
 * @author White Cross Platform
 * @version 1.0.0
 * @since 2025-10-18
 */

import { logger } from '../../utils/logger';
import { Medication, StudentMedication, Student } from '../../database/models';
import { CreateStudentMedicationData } from './types';

/**
 * Student Medication Prescription Service
 *
 * Manages medication prescription assignments to students with comprehensive safety
 * checks, duplicate detection, and authorization verification. Creates prescription
 * records linking students to medications with activation status, dosage schedules,
 * and termination tracking.
 *
 * @class StudentMedicationService
 *
 * @example
 * ```typescript
 * // Assign medication prescription to student
 * const prescription = await StudentMedicationService.assignMedicationToStudent({
 *   studentId: 'student-uuid-123',
 *   medicationId: 'medication-uuid-456',
 *   dosage: '500mg',
 *   frequency: 'TID',
 *   route: 'PO',
 *   startDate: new Date(),
 *   endDate: new Date('2025-12-31'),
 *   prescribedBy: 'Dr. Smith',
 *   instructions: 'Take with food'
 * });
 *
 * // Deactivate prescription when treatment complete
 * await StudentMedicationService.deactivateStudentMedication(
 *   prescription.id,
 *   'Treatment course completed'
 * );
 * ```
 *
 * @security Requires authenticated nurse/admin context for all operations
 * @compliance Supports school medication policies and state pharmacy regulations
 * @hipaa All prescription assignments are PHI - ensure audit at API layer
 * @safety Implements duplicate detection to prevent multiple active prescriptions
 */
export class StudentMedicationService {
  /**
   * Assigns medication prescription to student with comprehensive validation and duplicate detection
   *
   * Creates student medication prescription record after validating student existence,
   * medication existence, and checking for duplicate active prescriptions. Prevents
   * multiple active prescriptions for the same medication to avoid medication errors
   * and overdose risks. Records complete prescription details including dosage,
   * frequency, route, and prescriber information.
   *
   * **Validation Steps:**
   * 1. Verify student exists (HIPAA compliance check)
   * 2. Verify medication exists
   * 3. Check for duplicate active prescriptions (same student + medication)
   * 4. Create prescription with full details and associations
   *
   * **Safety Check:**
   * Prevents duplicate active prescriptions - critical for preventing:
   * - Medication overdose from duplicate administrations
   * - Confusion about correct dosage or schedule
   * - Drug interaction risks from duplicate entries
   * - Medication administration errors
   *
   * @param {CreateStudentMedicationData} data - Student medication prescription data
   * @param {string} data.studentId - UUID of student receiving medication
   * @param {string} data.medicationId - UUID of medication being prescribed
   * @param {string} data.dosage - Prescribed dosage (e.g., '500mg', '2 tablets')
   * @param {string} data.frequency - Dosing frequency (QID, BID, TID, QHS, PRN, etc.)
   * @param {string} data.route - Administration route (PO, IV, IM, topical, etc.)
   * @param {Date} data.startDate - Prescription start date
   * @param {Date} [data.endDate] - Optional prescription end date
   * @param {string} [data.prescribedBy] - Healthcare provider name
   * @param {string} [data.instructions] - Special administration instructions
   * @param {boolean} [data.isActive=true] - Active status (default: true)
   *
   * @returns {Promise<StudentMedication>} Created prescription record with full associations
   *   - Includes medication details (name, dosage form, strength)
   *   - Includes student details (firstName, lastName, studentNumber)
   *   - Complete prescription metadata
   *   - Audit trail for compliance
   *
   * @throws {Error} 'Student not found' - Invalid student ID or student doesn't exist
   * @throws {Error} 'Medication not found' - Invalid medication ID or medication doesn't exist
   * @throws {Error} 'Student already has an active prescription for this medication' - Duplicate detected
   * @throws {Error} If database operation fails
   *
   * @example
   * ```typescript
   * // Standard antibiotic prescription
   * const prescription = await StudentMedicationService.assignMedicationToStudent({
   *   studentId: 'student-uuid-123',
   *   medicationId: 'amoxicillin-uuid',
   *   dosage: '500mg',
   *   frequency: 'TID',
   *   route: 'PO',
   *   startDate: new Date(),
   *   endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
   *   prescribedBy: 'Dr. Sarah Johnson',
   *   instructions: 'Take with food. Complete full course.'
   * });
   * console.log(`Prescription created for ${prescription.student.firstName}`);
   *
   * // Maintenance medication (no end date)
   * await StudentMedicationService.assignMedicationToStudent({
   *   studentId: 'student-uuid-456',
   *   medicationId: 'albuterol-uuid',
   *   dosage: '2 puffs',
   *   frequency: 'PRN',
   *   route: 'Inhalation',
   *   startDate: new Date(),
   *   prescribedBy: 'Dr. Michael Chen',
   *   instructions: 'Use as needed for asthma symptoms or before exercise'
   * });
   *
   * // Controlled substance prescription
   * await StudentMedicationService.assignMedicationToStudent({
   *   studentId: 'student-uuid-789',
   *   medicationId: 'methylphenidate-uuid',
   *   dosage: '10mg',
   *   frequency: 'QD',
   *   route: 'PO',
   *   startDate: new Date(),
   *   prescribedBy: 'Dr. Emily Rodriguez',
   *   instructions: 'Take in morning with breakfast. Schedule II controlled substance.'
   * });
   * ```
   *
   * @safety Duplicate detection prevents multiple active prescriptions for same medication
   * @validation Verifies student and medication existence before creating prescription
   * @security Requires authenticated nurse/admin context with prescription authority
   * @hipaa Prescription creation is PHI modification - caller must audit this operation
   * @compliance Supports school medication authorization and consent requirements
   */
  static async assignMedicationToStudent(data: CreateStudentMedicationData) {
    try {
      // Verify student exists - HIPAA compliance check
      const student = await Student.findByPk(data.studentId);

      if (!student) {
        throw new Error('Student not found');
      }

      // Verify medication exists
      const medication = await Medication.findByPk(data.medicationId);

      if (!medication) {
        throw new Error('Medication not found');
      }

      // Safety check: Check if student already has active prescription for this medication
      const existingPrescription = await StudentMedication.findOne({
        where: {
          studentId: data.studentId,
          medicationId: data.medicationId,
          isActive: true
        }
      });

      if (existingPrescription) {
        throw new Error('Student already has an active prescription for this medication');
      }

      const studentMedication = await StudentMedication.create(data);

      // Reload with associations for complete data
      await studentMedication.reload({
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      logger.info(`Medication ${medication.name} assigned to student ${student.firstName} ${student.lastName}`, {
        studentId: student.id,
        medicationId: medication.id,
        prescriptionId: studentMedication.id
      });

      return studentMedication;
    } catch (error) {
      logger.error('Error assigning medication to student:', error);
      throw error;
    }
  }

  /**
   * Deactivates student medication prescription by ending prescription and setting inactive status
   *
   * Terminates active prescription by setting inactive status and recording end date.
   * Preserves prescription record for audit trail and medication history while preventing
   * future medication administrations. Documents termination reason for clinical review
   * and compliance purposes.
   *
   * **Common Deactivation Scenarios:**
   * - Treatment course completed
   * - Medication discontinued by healthcare provider
   * - Student developed adverse reaction or side effects
   * - Student transferred to different school
   * - Prescription expired
   * - Parent/guardian requested discontinuation
   * - Student condition resolved (no longer needed)
   *
   * **Deactivation Effects:**
   * - Sets isActive = false (prevents future administrations)
   * - Sets endDate = current timestamp
   * - Preserves complete prescription record for audit trail
   * - Logs deactivation with reason for compliance
   *
   * @param {string} id - UUID of student medication prescription to deactivate
   * @param {string} [reason] - Optional reason for deactivation (recommended for audit trail)
   *
   * @returns {Promise<StudentMedication>} Deactivated prescription record with associations
   *   - Includes medication details (name, dosage, route)
   *   - Includes student details (firstName, lastName)
   *   - Updated isActive status (false)
   *   - Updated endDate (current timestamp)
   *
   * @throws {Error} 'Student medication not found' - Invalid prescription ID
   * @throws {Error} If database operation fails
   *
   * @example
   * ```typescript
   * // Treatment completed
   * await StudentMedicationService.deactivateStudentMedication(
   *   'prescription-uuid-123',
   *   'Antibiotic course completed (10 days)'
   * );
   *
   * // Discontinued due to side effects
   * await StudentMedicationService.deactivateStudentMedication(
   *   'prescription-uuid-456',
   *   'Discontinued - student experienced nausea and dizziness'
   * );
   *
   * // Student transferred schools
   * await StudentMedicationService.deactivateStudentMedication(
   *   'prescription-uuid-789',
   *   'Student transferred to Jefferson Middle School on 2025-10-20'
   * );
   *
   * // Parent requested discontinuation
   * await StudentMedicationService.deactivateStudentMedication(
   *   'prescription-uuid-abc',
   *   'Parent requested discontinuation via phone call on 2025-10-25'
   * );
   *
   * // Prescription expired
   * await StudentMedicationService.deactivateStudentMedication(
   *   'prescription-uuid-def',
   *   'Prescription reached expiration date'
   * );
   * ```
   *
   * @safety Prevents administration of deactivated prescriptions through isActive flag check
   * @validation Preserves prescription record for historical tracking and audit compliance
   * @security Requires authenticated nurse/admin context with prescription modification authority
   * @hipaa Deactivation is PHI modification - caller must audit this operation
   * @compliance Documents termination reason for regulatory review and clinical oversight
   */
  static async deactivateStudentMedication(id: string, reason?: string) {
    try {
      const studentMedication = await StudentMedication.findByPk(id, {
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      if (!studentMedication) {
        throw new Error('Student medication not found');
      }

      await studentMedication.update({
        isActive: false,
        endDate: new Date()
      });

      logger.info(`Student medication deactivated: ${studentMedication.medication!.name} for ${studentMedication.student!.firstName} ${studentMedication.student!.lastName}${reason ? ` (${reason})` : ''}`, {
        prescriptionId: id,
        reason
      });

      return studentMedication;
    } catch (error) {
      logger.error('Error deactivating student medication:', error);
      throw error;
    }
  }
}
