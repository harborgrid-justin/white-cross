/**
 * LOC: 7359200817-ADM
 * WC-SVC-MED-ADM | Medication Administration Tracking Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/medication/index.ts)
 */

/**
 * WC-SVC-MED-ADM | Medication Administration Tracking Service
 * Purpose: Log and track medication administration events with audit trail
 * Upstream: database/models/MedicationLog | Dependencies: Sequelize
 * Downstream: MedicationService | Called by: Medication service index
 * Related: StudentMedication, User models
 * Exports: AdministrationService class | Key Services: Administration logging
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Verification → Logging → Audit trail
 * LLM Context: HIPAA-compliant medication administration with complete audit logging
 */

import { Op } from 'sequelize';
import { logger } from '../../utils/logger';
import { MedicationLog, StudentMedication, Medication, Student, User } from '../../database/models';
import { CreateMedicationLogData } from './types';

export class AdministrationService {
  /**
   * Log medication administration with complete audit trail
   */
  static async logMedicationAdministration(data: CreateMedicationLogData) {
    try {
      // Verify student medication exists and is active - Critical safety check
      const studentMedication = await StudentMedication.findByPk(data.studentMedicationId, {
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName', 'studentNumber']
          }
        ]
      });

      if (!studentMedication) {
        throw new Error('Student medication prescription not found');
      }

      if (!studentMedication.isActive) {
        throw new Error('Medication prescription is not active');
      }

      // Verify nurse exists - HIPAA audit requirement
      const nurse = await User.findByPk(data.nurseId);

      if (!nurse) {
        throw new Error('Nurse not found');
      }

      // Create administration log with full audit information
      const medicationLog = await MedicationLog.create({
        ...data,
        administeredBy: `${nurse.firstName} ${nurse.lastName}`,
        studentMedicationId: data.studentMedicationId,
        nurseId: data.nurseId,
        dosageGiven: data.dosageGiven,
        timeGiven: data.timeGiven,
        notes: data.notes,
        sideEffects: data.sideEffects
      });

      // Reload with associations for complete audit trail
      await medicationLog.reload({
        include: [
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          },
          {
            model: StudentMedication,
            as: 'studentMedication',
            include: [
              {
                model: Medication,
                as: 'medication'
              },
              {
                model: Student,
                as: 'student',
                attributes: ['firstName', 'lastName', 'studentNumber']
              }
            ]
          }
        ]
      });

      logger.info(`Medication administration logged: ${studentMedication.medication!.name} to ${studentMedication.student!.firstName} ${studentMedication.student!.lastName} by ${nurse.firstName} ${nurse.lastName}`, {
        logId: medicationLog.id,
        studentId: studentMedication.student!.id,
        medicationId: studentMedication.medication!.id,
        nurseId: nurse.id,
        dosage: data.dosageGiven,
        timeGiven: data.timeGiven
      });

      return medicationLog;
    } catch (error) {
      logger.error('Error logging medication administration:', error);
      throw error;
    }
  }

  /**
   * Get medication administration logs for a student with pagination
   */
  static async getStudentMedicationLogs(studentId: string, page: number = 1, limit: number = 20) {
    try {
      const offset = (page - 1) * limit;

      const { rows: logs, count: total } = await MedicationLog.findAndCountAll({
        include: [
          {
            model: StudentMedication,
            as: 'studentMedication',
            where: { studentId },
            include: [
              {
                model: Medication,
                as: 'medication'
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['firstName', 'lastName']
          }
        ],
        offset,
        limit,
        order: [['timeGiven', 'DESC']],
        distinct: true
      });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching student medication logs:', error);
      throw error;
    }
  }
}
