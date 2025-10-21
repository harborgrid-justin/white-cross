/**
 * LOC: 7359200817-STU
 * WC-SVC-MED-STU | Student Medication Management Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/medication/index.ts)
 */

/**
 * WC-SVC-MED-STU | Student Medication Management Service
 * Purpose: Student medication prescription assignment and management
 * Upstream: database/models/StudentMedication | Dependencies: Sequelize
 * Downstream: MedicationService | Called by: Medication service index
 * Related: medicationValidators.ts, Student model
 * Exports: StudentMedicationService class | Key Services: Prescription management
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Validation → Student/Medication verification → Assignment
 * LLM Context: HIPAA-compliant student prescription management with safety checks
 */

import { logger } from '../../utils/logger';
import { Medication, StudentMedication, Student } from '../../database/models';
import { CreateStudentMedicationData } from './types';

export class StudentMedicationService {
  /**
   * Assign medication to student with validation and safety checks
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
   * Deactivate student medication (end prescription)
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
