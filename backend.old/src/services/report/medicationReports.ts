/**
 * LOC: 1EB0403DEB
 * WC-GEN-294 | medicationReports.ts - Medication usage and compliance reporting
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - models (database/models)
 *   - types.ts (services/report/types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (services/report/index.ts)
 */

/**
 * WC-GEN-294 | medicationReports.ts - Medication usage and compliance reporting
 * Purpose: Generate medication administration logs, compliance statistics, and adverse reaction tracking
 * Upstream: ../utils/logger, ../database/models, ./types | Dependencies: sequelize
 * Downstream: Report service index | Called by: ReportService
 * Related: Medication logs, student medications, medications
 * Exports: MedicationReportsModule | Key Services: Medication compliance and usage analytics
 * Last Updated: 2025-10-19 | File Type: .ts
 * Critical Path: Query execution → Compliance calculation → Report generation
 * LLM Context: HIPAA-compliant medication tracking for school nurse medication administration
 */

import { Op, QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  sequelize,
  MedicationLog,
  StudentMedication,
  Medication,
  Student,
  User
} from '../../database/models';
import { MedicationUsageReport } from './types';

/**
 * Medication Reports Module
 * Handles medication usage analysis, compliance tracking, and adverse reaction monitoring
 */
export class MedicationReportsModule {
  /**
   * Generate comprehensive medication usage and compliance report
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Medication usage statistics and compliance data
   * @throws Error if database query fails
   */
  static async getMedicationUsageReport(startDate?: Date, endDate?: Date): Promise<MedicationUsageReport> {
    try {
      const whereClause: any = {};

      if (startDate || endDate) {
        whereClause.timeGiven = {};
        if (startDate) whereClause.timeGiven[Op.gte] = startDate;
        if (endDate) whereClause.timeGiven[Op.lte] = endDate;
      }

      // Get medication administration logs with full details
      const administrationLogs = await MedicationLog.findAll({
        where: whereClause,
        include: [
          {
            model: StudentMedication,
            as: 'studentMedication',
            include: [
              {
                model: Medication,
                as: 'medication',
                attributes: ['id', 'name', 'genericName', 'category']
              },
              {
                model: Student,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber']
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['timeGiven', 'DESC']],
        limit: 100
      });

      // Get compliance statistics
      const totalScheduled = await StudentMedication.count({
        where: { isActive: true }
      });

      const totalLogs = await MedicationLog.count({ where: whereClause });

      // Get most administered medications with medication names
      const topMedicationsRaw = await sequelize.query<{
        medicationId: string;
        medicationName: string;
        count: number;
      }>(
        `SELECT
          m.id as "medicationId",
          m.name as "medicationName",
          COUNT(ml.id)::integer as count
        FROM medication_logs ml
        INNER JOIN student_medications sm ON ml."studentMedicationId" = sm.id
        INNER JOIN medications m ON sm."medicationId" = m.id
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `ml."timeGiven" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `ml."timeGiven" <= :endDate` : ''}
        GROUP BY m.id, m.name
        ORDER BY count DESC
        LIMIT 10`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      const topMedications = topMedicationsRaw.map(record => ({
        medicationName: record.medicationName,
        count: parseInt(String(record.count), 10)
      }));

      // Get medication logs with side effects (adverse reactions)
      const adverseReactionsWhere: any = {
        sideEffects: { [Op.ne]: null },
        ...whereClause
      };

      const adverseReactions = await MedicationLog.findAll({
        where: adverseReactionsWhere,
        include: [
          {
            model: StudentMedication,
            as: 'studentMedication',
            include: [
              {
                model: Medication,
                as: 'medication',
                attributes: ['id', 'name', 'genericName']
              },
              {
                model: Student,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'studentNumber']
              }
            ]
          },
          {
            model: User,
            as: 'nurse',
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        order: [['timeGiven', 'DESC']]
      });

      logger.info(`Medication usage report generated: ${administrationLogs.length} logs, ${adverseReactions.length} adverse reactions, compliance: ${totalLogs}/${totalScheduled}`);

      return {
        administrationLogs,
        totalScheduled,
        totalLogs,
        topMedications,
        adverseReactions
      };
    } catch (error) {
      logger.error('Error getting medication usage report:', error);
      throw error;
    }
  }
}
