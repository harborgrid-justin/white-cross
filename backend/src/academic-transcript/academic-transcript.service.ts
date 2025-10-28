/**
 * @fileoverview Academic Transcript Service
 * @module academic-transcript/academic-transcript.service
 * @description Service for managing academic transcript data and SIS integration
 * Migrated from backend/src/services/academicTranscript
 */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  AcademicRecord,
  SubjectGrade,
  AttendanceRecord,
  BehaviorRecord,
} from './interfaces/academic-record.interface';
import { TranscriptImportDto } from './dto/transcript-import.dto';

@Injectable()
export class AcademicTranscriptService {
  private readonly logger = new Logger(AcademicTranscriptService.name);

  /**
   * Import academic transcript data from SIS
   */
  async importTranscript(data: TranscriptImportDto): Promise<AcademicRecord> {
    try {
      const { studentId, academicYear, semester, subjects, attendance, behavior, importedBy } = data;

      // TODO: Validate student exists when Student entity is available
      // const student = await this.studentRepository.findOne({ where: { id: studentId } });
      // if (!student) {
      //   throw new NotFoundException('Student not found');
      // }

      // Calculate GPA
      const gpa = this.calculateGPA(subjects);

      // In production, this would save to a dedicated AcademicRecord table
      const academicRecord: AcademicRecord = {
        id: `${studentId}_${academicYear}_${semester}`,
        studentId,
        academicYear,
        semester,
        grade: 'N/A', // TODO: Get from student when entity is available
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

      // TODO: Store in database when AcademicRecord entity is available
      this.logger.log(`Academic transcript imported for student ${studentId}, ${academicYear} ${semester}, imported by ${importedBy}`);

      return academicRecord;
    } catch (error) {
      this.logger.error(`Error importing academic transcript: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Calculate GPA from subject grades
   */
  private calculateGPA(subjects: SubjectGrade[]): number {
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
  async getAcademicHistory(studentId: string): Promise<AcademicRecord[]> {
    try {
      // TODO: Query from AcademicRecord table when entity is available
      // return await this.academicRecordRepository.find({ where: { studentId } });

      this.logger.log(`Fetching academic history for student ${studentId}`);
      return [];
    } catch (error) {
      this.logger.error(`Error fetching academic history: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Generate academic transcript report
   */
  async generateTranscriptReport(
    studentId: string,
    format: 'pdf' | 'html' | 'json' = 'json',
  ): Promise<any> {
    try {
      // TODO: Get student from repository when Student entity is available
      // const student = await this.studentRepository.findOne({ where: { id: studentId } });
      // if (!student) {
      //   throw new NotFoundException('Student not found');
      // }

      const academicHistory = await this.getAcademicHistory(studentId);

      const report = {
        student: {
          id: studentId,
          name: 'N/A', // TODO: Get from student entity
          studentNumber: 'N/A', // TODO: Get from student entity
          grade: 'N/A', // TODO: Get from student entity
        },
        academicRecords: academicHistory,
        generatedAt: new Date(),
        format,
      };

      this.logger.log(`Transcript report generated for student ${studentId} in ${format} format`);

      // TODO: In production, generate PDF or HTML based on format
      return report;
    } catch (error) {
      this.logger.error(`Error generating transcript report: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Sync with external SIS (Student Information System)
   */
  async syncWithSIS(studentId: string, sisApiEndpoint: string): Promise<boolean> {
    try {
      // In production, this would:
      // 1. Call external SIS API
      // 2. Parse response
      // 3. Import transcript data

      this.logger.log(`Syncing with external SIS for student ${studentId} at ${sisApiEndpoint}`);

      // Placeholder for actual API integration
      const mockTranscriptData: TranscriptImportDto = {
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
      this.logger.error(`Error syncing with SIS: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Analyze academic performance trends
   */
  async analyzePerformanceTrends(studentId: string): Promise<any> {
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

      this.logger.log(`Performance trends analyzed for student ${studentId}`);

      return analysis;
    } catch (error) {
      this.logger.error(`Error analyzing performance trends: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Calculate trend direction (improving, declining, stable)
   */
  private calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
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
  private generateRecommendations(gpaTrend: number[], attendanceTrend: number[]): string[] {
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
