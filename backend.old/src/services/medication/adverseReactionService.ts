/**
 * LOC: 7359200817-ADV
 * WC-SVC-MED-ADV | Adverse Reaction Tracking Service
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/medication/index.ts)
 */

/**
 * WC-SVC-MED-ADV | Adverse Reaction Tracking Service
 * Purpose: Track and report adverse medication reactions and allergic responses
 * Upstream: database/models/IncidentReport | Dependencies: Sequelize
 * Downstream: MedicationService | Called by: Medication service index
 * Related: StudentMedication, IncidentReport models
 * Exports: AdverseReactionService class | Key Services: Reaction reporting
 * Last Updated: 2025-10-18 | Dependencies: sequelize
 * Critical Path: Reaction verification → Incident creation → Parent notification
 * LLM Context: HIPAA-compliant adverse reaction tracking with automated escalation
 */

import { logger } from '../../utils/logger';
import { IncidentReport, StudentMedication, Medication, Student, User } from '../../database/models';
import { CreateAdverseReactionData } from './types';

export class AdverseReactionService {
  /**
   * Report adverse reaction to medication with automatic incident creation
   */
  static async reportAdverseReaction(data: CreateAdverseReactionData) {
    try {
      // Verify student medication exists
      const studentMedication = await StudentMedication.findByPk(data.studentMedicationId, {
        include: [
          {
            model: Medication,
            as: 'medication'
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

      if (!studentMedication) {
        throw new Error('Student medication not found');
      }

      // Verify reporter exists - audit requirement
      const nurse = await User.findByPk(data.reportedBy);

      if (!nurse) {
        throw new Error('Reporter not found');
      }

      // Create incident report for adverse reaction
      // Automatic parent notification for severe reactions
      const incidentReport = await IncidentReport.create({
        type: 'ALLERGIC_REACTION' as any,
        severity: data.severity as any,
        description: `Adverse reaction to ${studentMedication.medication!.name}: ${data.reaction}`,
        location: 'School Nurse Office',
        witnesses: [],
        actionsTaken: data.actionTaken,
        parentNotified: data.severity === 'SEVERE' || data.severity === 'LIFE_THREATENING',
        followUpRequired: data.severity !== 'MILD',
        followUpNotes: data.notes || undefined,
        attachments: [],
        occurredAt: data.reportedAt,
        studentId: studentMedication.studentId,
        reportedById: data.reportedBy
      });

      // Reload with associations for complete reporting
      await incidentReport.reload({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['firstName', 'lastName']
          },
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName']
          }
        ]
      });

      logger.info(`Adverse reaction reported: ${studentMedication.medication!.name} for ${studentMedication.student!.firstName} ${studentMedication.student!.lastName}`, {
        incidentId: incidentReport.id,
        studentId: studentMedication.studentId,
        medicationId: studentMedication.medicationId,
        severity: data.severity,
        parentNotified: incidentReport.parentNotified
      });

      return incidentReport;
    } catch (error) {
      logger.error('Error reporting adverse reaction:', error);
      throw error;
    }
  }

  /**
   * Get adverse reaction reports with filtering
   */
  static async getAdverseReactions(medicationId?: string, studentId?: string) {
    try {
      const whereClause: any = {
        type: 'ALLERGIC_REACTION'
      };

      if (studentId) {
        whereClause.studentId = studentId;
      }

      const includeStudent: any = {
        model: Student,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName']
      };

      if (medicationId) {
        includeStudent.include = [
          {
            model: StudentMedication,
            as: 'medications',
            where: { medicationId },
            include: [
              {
                model: Medication,
                as: 'medication'
              }
            ]
          }
        ];
      }

      const reports = await IncidentReport.findAll({
        where: whereClause,
        include: [
          includeStudent,
          {
            model: User,
            as: 'reportedBy',
            attributes: ['firstName', 'lastName']
          }
        ],
        order: [['occurredAt', 'DESC']]
      });

      // Filter by medication if specified
      let filteredReports = reports;
      if (medicationId) {
        filteredReports = reports.filter((report) =>
          report.student &&
          report.student.medications &&
          report.student.medications.length > 0
        );
      }

      logger.info(`Retrieved ${filteredReports.length} adverse reaction reports${medicationId ? ` for medication ${medicationId}` : ''}${studentId ? ` for student ${studentId}` : ''}`);

      return filteredReports;
    } catch (error) {
      logger.error('Error fetching adverse reactions:', error);
      throw error;
    }
  }
}
