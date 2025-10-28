import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { ChronicCondition } from '../../chronic-condition/entities/chronic-condition.entity';
import { Student } from '../../student/entities/student.entity';
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
    @InjectRepository(ChronicCondition)
    private chronicConditionRepository: Repository<ChronicCondition>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectDataSource()
    private dataSource: DataSource,
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
      const healthVisitsRaw = await this.dataSource.query(
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
        [
          startDate,
          endDate,
          limit,
        ].filter(v => v !== undefined),
      );

      // Fetch student details for health visits
      const healthVisitsWithStudents = await Promise.all(
        healthVisitsRaw.map(async (record: any) => {
          const student = await this.studentRepository.findOne({
            where: { id: record.studentId },
            select: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!,
          };
        }),
      );

      // Get students with most incidents
      const incidentVisitsRaw = await this.dataSource.query(
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
        [
          startDate,
          endDate,
          limit,
        ].filter(v => v !== undefined),
      );

      // Fetch student details for incident visits
      const incidentVisitsWithStudents = await Promise.all(
        incidentVisitsRaw.map(async (record: any) => {
          const student = await this.studentRepository.findOne({
            where: { id: record.studentId },
            select: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
          });
          return {
            studentId: record.studentId,
            count: parseInt(String(record.count), 10),
            student: student!,
          };
        }),
      );

      // Get students with chronic conditions
      const chronicStudents = await this.chronicConditionRepository.find({
        relations: ['student'],
      });

      // Get appointment frequency by student
      const appointmentFrequencyRaw = await this.dataSource.query(
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
        [
          startDate,
          endDate,
          limit,
        ].filter(v => v !== undefined),
      );

      // Fetch student details for appointment frequency
      const appointmentFrequencyWithStudents = await Promise.all(
        appointmentFrequencyRaw.map(async (record: any) => {
          const student = await this.studentRepository.findOne({
            where: { id: record.studentId },
            select: ['id', 'firstName', 'lastName', 'studentNumber', 'grade'],
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
