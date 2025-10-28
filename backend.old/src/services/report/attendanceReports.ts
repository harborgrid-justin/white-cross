/**
 * LOC: 1EB0403DED
 * WC-GEN-296 | attendanceReports.ts - Attendance and health visit correlation analysis
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
 * WC-GEN-296 | attendanceReports.ts - Attendance and health visit correlation analysis
 * Purpose: Analyze correlation between health visits, incidents, chronic conditions, and attendance patterns
 * Upstream: ../utils/logger, ../database/models, ./types | Dependencies: sequelize
 * Downstream: Report service index | Called by: ReportService
 * Related: Health records, incidents, appointments, chronic conditions
 * Exports: AttendanceReportsModule | Key Services: Attendance correlation analytics
 * Last Updated: 2025-10-19 | File Type: .ts
 * Critical Path: Query execution → Correlation analysis → Pattern identification
 * LLM Context: Student health pattern analysis for identifying at-risk students
 */

import { Op, QueryTypes } from 'sequelize';
import { logger } from '../../utils/logger';
import {
  sequelize,
  ChronicCondition,
  Student
} from '../../database/models';
import { AttendanceCorrelationReport } from './types';

/**
 * Attendance Reports Module
 * Handles attendance correlation analysis with health visits, incidents, and appointments
 */
export class AttendanceReportsModule {
  /**
   * Analyze correlation between health visits, incidents, and attendance patterns
   * @param startDate - Optional start date for filtering
   * @param endDate - Optional end date for filtering
   * @returns Student health visit patterns and correlations
   * @throws Error if database query fails
   */
  static async getAttendanceCorrelation(startDate?: Date, endDate?: Date): Promise<AttendanceCorrelationReport> {
    try {
      // Get students with most health visits
      const healthVisitsRaw = await sequelize.query<{
        studentId: string;
        count: number;
      }>(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM health_records
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"createdAt" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `"createdAt" <= :endDate` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT 50`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      // Fetch student details for health visits
      const healthVisitsWithStudents = await Promise.all(
        healthVisitsRaw.map(async (record) => {
          const student = await Student.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!
          };
        })
      );

      // Get students with most incidents
      const incidentVisitsRaw = await sequelize.query<{
        studentId: string;
        count: number;
      }>(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM incident_reports
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"occurredAt" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `"occurredAt" <= :endDate` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT 50`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      // Fetch student details for incident visits
      const incidentVisitsWithStudents = await Promise.all(
        incidentVisitsRaw.map(async (record) => {
          const student = await Student.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!
          };
        })
      );

      // Get students with chronic conditions
      const chronicStudents = await ChronicCondition.findAll({
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          }
        ]
      });

      // Get appointment frequency by student
      const appointmentFrequencyRaw = await sequelize.query<{
        studentId: string;
        count: number;
      }>(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM appointments
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"scheduledAt" >= :startDate` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `"scheduledAt" <= :endDate` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT 50`,
        {
          replacements: {
            startDate: startDate || null,
            endDate: endDate || null
          },
          type: QueryTypes.SELECT
        }
      );

      // Fetch student details for appointment frequency
      const appointmentFrequencyWithStudents = await Promise.all(
        appointmentFrequencyRaw.map(async (record) => {
          const student = await Student.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade']
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!
          };
        })
      );

      logger.info(`Attendance correlation report generated: ${healthVisitsWithStudents.length} health visit patterns, ${incidentVisitsWithStudents.length} incident patterns, ${chronicStudents.length} chronic students, ${appointmentFrequencyWithStudents.length} appointment patterns`);

      return {
        healthVisits: healthVisitsWithStudents,
        incidentVisits: incidentVisitsWithStudents,
        chronicStudents,
        appointmentFrequency: appointmentFrequencyWithStudents
      };
    } catch (error) {
      logger.error('Error getting attendance correlation:', error);
      throw error;
    }
  }
}
