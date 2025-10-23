/**
 * LOC: 9E36D2D54B
 * Academic Transcript Integration Service
 *
 * UPSTREAM (imports from):
 *   - index.ts (database/models/index.ts)
 *   - logger.ts (utils/logger.ts)
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - enhancedFeatures.ts (routes/enhancedFeatures.ts)
 *   - enhancedFeatures.test.ts (__tests__/enhancedFeatures.test.ts)
 */

import { Student } from '../../database/models';
import { logger } from '../../utils/logger';
import { sequelize } from '../../database/config/sequelize';
import { handleSequelizeError } from '../../utils/sequelizeErrorHandler';

import {
  AcademicRecord,
  SubjectGrade,
  AttendanceRecord,
  BehaviorRecord,
  TranscriptImportData,
} from './academicTranscript.types';

export class AcademicTranscriptService {
  /**
   * Import academic transcript data from SIS
   */
  static async importTranscript(data: TranscriptImportData): Promise<AcademicRecord> {
    const transaction = await sequelize.transaction();
    
    try {
      const { studentId, academicYear, semester, subjects, attendance, behavior, importedBy } = data;

      // Validate student exists
      const student = await Student.findByPk(studentId, { transaction });
      if (!student) {
        throw new Error('Student not found');
      }

      // Calculate GPA
      const gpa = this.calculateGPA(subjects);

      // In production, this would save to a dedicated AcademicRecord table
      const academicRecord: AcademicRecord = {
        id: `${studentId}_${academicYear}_${semester}`,
        studentId,
        academicYear,
        semester,
        grade: student.grade,
        gpa,
        subjects,
        attendance,
        behavior: behavior || {
          conductGrade: 'N/A',
          incidents: 0,
          commendations: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store in database (placeholder - would use actual AcademicRecord model)
      logger.info('Academic transcript imported', { studentId, academicYear, semester, importedBy });

      await transaction.commit();

      return academicRecord;
    } catch (error) {
      await transaction.rollback();
                logger.error('Error importing academic transcript', { error, data });
                throw handleSequelizeError(error as Error);
              }  }

  /**
   * Calculate GPA from subject grades
   */
  private static calculateGPA(subjects: SubjectGrade[]): number {
    if (subjects.length === 0) return 0;

    const gradePoints: { [key: string]: number } = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'D-': 0.7,
      'F': 0.0,
    };

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach(subject => {
      const points = gradePoints[subject.grade] || 0;
      totalPoints += points * subject.credits;
      totalCredits += subject.credits;
    });

    return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  }

  /**
   * Get student's academic history
   */
  static async getAcademicHistory(studentId: string): Promise<AcademicRecord[]> {
    try {
      // In production, query from AcademicRecord table
      // For now, return empty array
      logger.info('Fetching academic history', { studentId });
      return [];
    } catch (error) {
      logger.error('Error fetching academic history', { error, studentId });
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Generate academic transcript report
   */
  static async generateTranscriptReport(studentId: string, format: 'pdf' | 'html' | 'json' = 'json'): Promise<any> {
    try {
      const student = await Student.findByPk(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      const academicHistory = await this.getAcademicHistory(studentId);

      const report = {
        student: {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          studentNumber: student.studentNumber,
          grade: student.grade,
        },
        academicRecords: academicHistory,
        generatedAt: new Date(),
        format,
      };

      logger.info('Transcript report generated', { studentId, format });

      // In production, generate PDF or HTML based on format
      return report;
    } catch (error) {
      logger.error('Error generating transcript report', { error, studentId });
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Sync with external SIS (Student Information System)
   */
  static async syncWithSIS(studentId: string, sisApiEndpoint: string): Promise<boolean> {
    try {
      // In production, this would:
      // 1. Call external SIS API
      // 2. Parse response
      // 3. Import transcript data
      
      logger.info('Syncing with external SIS', { studentId, sisApiEndpoint });

      // Placeholder for actual API integration
      const mockTranscriptData: TranscriptImportData = {
        studentId,
        academicYear: '2024-2025',
        semester: 'Fall',
        subjects: [
          { subjectName: 'Mathematics', subjectCode: 'MATH101', grade: 'A', percentage: 92, credits: 3, teacher: 'Ms. Johnson' },
          { subjectName: 'English', subjectCode: 'ENG101', grade: 'B+', percentage: 87, credits: 3, teacher: 'Mr. Smith' },
          { subjectName: 'Science', subjectCode: 'SCI101', grade: 'A-', percentage: 90, credits: 3, teacher: 'Dr. Williams' },
        ],
        attendance: {
          totalDays: 180,
          presentDays: 175,
          absentDays: 5,
          tardyDays: 3,
          attendanceRate: 97.2,
        },
        behavior: {
          conductGrade: 'Excellent',
          incidents: 0,
          commendations: 2,
        },
        importedBy: 'system',
      };

      await this.importTranscript(mockTranscriptData);

      return true;
    } catch (error) {
      logger.error('Error syncing with SIS', { error, studentId });
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Analyze academic performance trends
   */
  static async analyzePerformanceTrends(studentId: string): Promise<any> {
    try {
      const academicHistory = await this.getAcademicHistory(studentId);

      if (academicHistory.length === 0) {
        return {
          trend: 'insufficient_data',
          message: 'Not enough data to analyze trends',
        };
      }

      // Calculate trends
      const gpaTrend = academicHistory.map(record => record.gpa);
      const attendanceTrend = academicHistory.map(record => record.attendance.attendanceRate);

      const analysis = {
        gpa: {
          current: gpaTrend[gpaTrend.length - 1],
          average: gpaTrend.reduce((a, b) => a + b, 0) / gpaTrend.length,
          trend: this.calculateTrend(gpaTrend),
        },
        attendance: {
          current: attendanceTrend[attendanceTrend.length - 1],
          average: attendanceTrend.reduce((a, b) => a + b, 0) / attendanceTrend.length,
          trend: this.calculateTrend(attendanceTrend),
        },
        recommendations: this.generateRecommendations(gpaTrend, attendanceTrend),
      };

      logger.info('Performance trends analyzed', { studentId });

      return analysis;
    } catch (error) {
      logger.error('Error analyzing performance trends', { error, studentId });
      throw handleSequelizeError(error as Error);
    }
  }

  /**
   * Calculate trend direction (improving, declining, stable)
   */
  private static calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    const diff = secondAvg - firstAvg;

    if (diff > 0.1) return 'improving';
    if (diff < -0.1) return 'declining';
    return 'stable';
  }

  /**
   * Generate academic recommendations
   */
  private static generateRecommendations(gpaTrend: number[], attendanceTrend: number[]): string[] {
    const recommendations: string[] = [];

    const currentGPA = gpaTrend[gpaTrend.length - 1];
    const currentAttendance = attendanceTrend[attendanceTrend.length - 1];

    if (currentGPA < 2.0) {
      recommendations.push('Consider academic support services and tutoring');
    }

    if (currentAttendance < 90) {
      recommendations.push('Attendance is below recommended levels - investigate potential health or social issues');
    }

    if (this.calculateTrend(gpaTrend) === 'declining') {
      recommendations.push('Academic performance is declining - schedule conference with parents and teachers');
    }

    return recommendations;
  }
}
