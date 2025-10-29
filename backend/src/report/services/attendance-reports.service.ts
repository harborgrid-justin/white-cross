import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ChronicCondition } from '../../database/models/chronic-condition.model';
import { Student } from '../../database/models/student.model';
import { AttendanceCorrelationReport } from '../interfaces/report-types.interface';
import { AttendanceCorrelationDto } from '../dto/attendance-correlation.dto';

/**
 * Attendance Reports Service
 * Handles attendance correlation analysis with health visits, incidents, and appointments
 */
@Injectable()
export class AttendanceReportsService {
  private readonly logger = new Logger(AttendanceReportsService.name);

  constructor(
    @InjectModel(ChronicCondition)
    private chronicConditionModel: typeof ChronicCondition,
    @InjectModel(Student)
    private studentModel: typeof Student,
    private sequelize: Sequelize,
  ) {}

  /**
   * Analyze correlation between health visits, incidents, and attendance patterns
   */
  async getAttendanceCorrelation(
    dto: AttendanceCorrelationDto,
  ): Promise<AttendanceCorrelationReport> {
    try {
      const { startDate, endDate, limit = 50 } = dto;

      // Get students with most health visits
      const healthVisitsRaw = await this.sequelize.query(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM health_records
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"createdAt" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `"createdAt" <= $2` : endDate ? `"createdAt" <= $1` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT $${startDate && endDate ? 3 : startDate || endDate ? 2 : 1}`,
        {
          bind: [
            startDate,
            endDate,
            limit,
          ].filter(v => v !== undefined),
          type: 'SELECT',
        },
      );

      // Fetch student details for health visits
      const healthVisitsWithStudents = await Promise.all(
        healthVisitsRaw.map(async (record: any) => {
          const student = await this.studentModel.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!,
          };
        }),
      );

      // Get students with most incidents
      const incidentVisitsRaw = await this.sequelize.query(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM incident_reports
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"occurredAt" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `"occurredAt" <= $2` : endDate ? `"occurredAt" <= $1` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT $${startDate && endDate ? 3 : startDate || endDate ? 2 : 1}`,
        {
          bind: [
            startDate,
            endDate,
            limit,
          ].filter(v => v !== undefined),
          type: 'SELECT',
        },
      );

      // Fetch student details for incident visits
      const incidentVisitsWithStudents = await Promise.all(
        incidentVisitsRaw.map(async (record: any) => {
          const student = await this.studentModel.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!,
          };
        }),
      );

      // Get students with chronic conditions
      const chronicStudents = await this.chronicConditionModel.findAll({
        include: ['student'],
      });

      // Get appointment frequency by student
      const appointmentFrequencyRaw = await this.sequelize.query(
        `SELECT
          "studentId",
          COUNT(*)::integer as count
        FROM appointments
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `"scheduledAt" >= $1` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate && startDate ? `"scheduledAt" <= $2` : endDate ? `"scheduledAt" <= $1` : ''}
        GROUP BY "studentId"
        ORDER BY count DESC
        LIMIT $${startDate && endDate ? 3 : startDate || endDate ? 2 : 1}`,
        {
          bind: [
            startDate,
            endDate,
            limit,
          ].filter(v => v !== undefined),
          type: 'SELECT',
        },
      );

      // Fetch student details for appointment frequency
      const appointmentFrequencyWithStudents = await Promise.all(
        appointmentFrequencyRaw.map(async (record: any) => {
          const student = await this.studentModel.findByPk(record.studentId, {
            attributes: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!,
          };
        }),
      );

      this.logger.log(
        `Attendance correlation report generated: ${healthVisitsWithStudents.length} health visit patterns, ${incidentVisitsWithStudents.length} incident patterns, ${chronicStudents.length} chronic students, ${appointmentFrequencyWithStudents.length} appointment patterns`,
      );

      return {
        healthVisits: healthVisitsWithStudents,
        incidentVisits: incidentVisitsWithStudents,
        chronicStudents,
        appointmentFrequency: appointmentFrequencyWithStudents,
      };
    } catch (error) {
      this.logger.error('Error getting attendance correlation:', error);
      throw error;
    }
  }
}
