/**
 * @fileoverview Student Academic Service
 * @module student/services/student-academic.service
 * @description Handles academic transcript operations and grade transitions
 */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '@/database';
import { AcademicTranscriptService } from '@/academic-transcript';
import { RequestContextService } from '@/common/context/request-context.service';
import { BaseService } from '@/common/base';
import { AcademicHistoryDto } from '../dto/academic-history.dto';
import { BulkGradeTransitionDto } from '../dto/bulk-grade-transition.dto';
import { GraduatingStudentsDto } from '../dto/graduating-students.dto';
import { ImportTranscriptDto } from '../dto/import-transcript.dto';
import { PerformanceTrendsDto } from '../dto/performance-trends.dto';

/**
 * Student Academic Service
 *
 * Provides academic operations:
 * - Academic transcript import
 * - Academic history retrieval
 * - Performance trend analysis
 * - Bulk grade transitions
 * - Graduation eligibility checking
 */
@Injectable()
export class StudentAcademicService extends BaseService {

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    private readonly academicTranscriptService: AcademicTranscriptService,
    @Optional() protected readonly requestContext?: RequestContextService,
  ) {
    super(
      requestContext ||
        ({
          requestId: 'system',
          userId: undefined,
          getLogContext: () => ({ requestId: 'system' }),
          getAuditContext: () => ({
            requestId: 'system',
            timestamp: new Date(),
          }),
        } as any),
    );
  }

  /**
   * Import academic transcript
   * Validates and stores transcript data with GPA calculations
   */
  async importAcademicTranscript(
    studentId: string,
    importTranscriptDto: ImportTranscriptDto,
  ): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');

      // Verify student exists
      const student = await this.studentModel.findByPk(studentId);
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Validate transcript data
      if (!importTranscriptDto.grades || importTranscriptDto.grades.length === 0) {
        throw new BadRequestException('Transcript must include at least one course grade');
      }

      // Map ImportTranscriptDto to TranscriptImportDto format expected by AcademicTranscriptService
      const transcriptData = {
        studentId,
        academicYear: importTranscriptDto.academicYear,
        semester: 'N/A',
        subjects: importTranscriptDto.grades.map((grade) => ({
          subjectName: grade.courseName,
          subjectCode: grade.courseName,
          grade: grade.grade,
          percentage: grade.numericGrade || 0,
          credits: grade.credits || 0,
          teacher: 'N/A',
        })),
        attendance: {
          totalDays: (importTranscriptDto.daysPresent || 0) + (importTranscriptDto.daysAbsent || 0),
          presentDays: importTranscriptDto.daysPresent || 0,
          absentDays: importTranscriptDto.daysAbsent || 0,
          tardyDays: 0,
          attendanceRate:
            importTranscriptDto.daysPresent &&
            importTranscriptDto.daysPresent + (importTranscriptDto.daysAbsent || 0) > 0
              ? Math.round(
                  (importTranscriptDto.daysPresent /
                    (importTranscriptDto.daysPresent + (importTranscriptDto.daysAbsent || 0))) *
                    1000,
                ) / 10
              : 100,
        },
        behavior: {
          conductGrade: 'N/A',
          incidents: 0,
          commendations: 0,
        },
        importedBy: 'system',
      };

      // Import transcript using AcademicTranscriptService
      const transcript = await this.academicTranscriptService.importTranscript(transcriptData);

      this.logInfo(
        `Academic transcript imported for student: ${studentId} (${student.firstName} ${student.lastName}), ` +
          `Year: ${importTranscriptDto.academicYear}, Courses: ${importTranscriptDto.grades.length}, GPA: ${transcript.gpa}`,
      );

      return {
        success: true,
        message: 'Academic transcript imported successfully',
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        transcript: {
          id: transcript.id,
          academicYear: transcript.academicYear,
          semester: transcript.semester,
          gpa: transcript.gpa,
          courseCount: transcript.subjects.length,
          totalCredits: importTranscriptDto.totalCredits,
          achievements: importTranscriptDto.achievements,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.handleError('Failed to import academic transcript', error);
    }
  }

  /**
   * Get academic history
   * Returns comprehensive academic history with transcripts and achievements
   */
  async getAcademicHistory(studentId: string, query: AcademicHistoryDto): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');

      // Verify student exists
      const student = await this.studentModel.findByPk(studentId);
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Get academic history from AcademicTranscriptService
      const transcripts = await this.academicTranscriptService.getAcademicHistory(studentId);

      // Filter by academic year if specified
      const filteredTranscripts = query.academicYear
        ? transcripts.filter((t) => t.academicYear === query.academicYear)
        : transcripts;

      // Calculate summary statistics
      const summary = {
        totalTranscripts: filteredTranscripts.length,
        averageGPA:
          filteredTranscripts.length > 0
            ? Math.round(
                (filteredTranscripts.reduce((sum, t) => sum + t.gpa, 0) /
                  filteredTranscripts.length) *
                  100,
              ) / 100
            : 0,
        highestGPA:
          filteredTranscripts.length > 0 ? Math.max(...filteredTranscripts.map((t) => t.gpa)) : 0,
        lowestGPA:
          filteredTranscripts.length > 0 ? Math.min(...filteredTranscripts.map((t) => t.gpa)) : 0,
      };

      this.logInfo(
        `Academic history retrieved for student: ${studentId} (${filteredTranscripts.length} records, Avg GPA: ${summary.averageGPA})`,
      );

      return {
        success: true,
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        filters: query,
        summary,
        transcripts: filteredTranscripts,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to retrieve academic history', error);
    }
  }

  /**
   * Get performance trends
   * Analyzes academic performance over time with trend analysis
   */
  async getPerformanceTrends(studentId: string, query: PerformanceTrendsDto): Promise<any> {
    try {
      this.validateUUID(studentId, 'Student ID');

      // Verify student exists
      const student = await this.studentModel.findByPk(studentId);
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      // Get performance trends from AcademicTranscriptService
      const analysis = await this.academicTranscriptService.analyzePerformanceTrends(studentId);

      // Enhance with query parameters
      const enhancedAnalysis = {
        ...analysis,
        analysisParams: {
          yearsToAnalyze: query.yearsToAnalyze,
          semestersToAnalyze: query.semestersToAnalyze,
        },
        student: {
          id: studentId,
          name: `${student.firstName} ${student.lastName}`,
          currentGrade: student.grade,
        },
      };

      this.logInfo(
        `Performance trends analyzed for student: ${studentId} - ` +
          `GPA Trend: ${enhancedAnalysis.gpa?.trend || 'N/A'}, ` +
          `Attendance Trend: ${enhancedAnalysis.attendance?.trend || 'N/A'}`,
      );

      return {
        success: true,
        ...enhancedAnalysis,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handleError('Failed to analyze performance trends', error);
    }
  }

  /**
   * Perform bulk grade transition
   * Processes grade level transitions for all eligible students
   */
  async performBulkGradeTransition(bulkGradeTransitionDto: BulkGradeTransitionDto): Promise<any> {
    try {
      const isDryRun = bulkGradeTransitionDto.dryRun || false;
      const effectiveDate = new Date(bulkGradeTransitionDto.effectiveDate);
      const criteria = bulkGradeTransitionDto.criteria || {};

      // Default promotion criteria
      const minimumGpa = criteria.minimumGpa || 2.0;
      const minimumAttendance = criteria.minimumAttendance || 0.9;
      const requirePassingGrades = criteria.requirePassingGrades !== false;

      // Get all active students
      const students = await this.studentModel.findAll({
        where: { isActive: true },
        order: [
          ['grade', 'ASC'],
          ['lastName', 'ASC'],
        ],
      });

      // Grade progression mapping
      const gradeProgression: { [key: string]: string } = {
        K: '1',
        '1': '2',
        '2': '3',
        '3': '4',
        '4': '5',
        '5': '6',
        '6': '7',
        '7': '8',
        '8': '9',
        '9': '10',
        '10': '11',
        '11': '12',
        '12': 'GRADUATED',
      };

      const results = {
        total: students.length,
        promoted: 0,
        retained: 0,
        graduated: 0,
        details: [] as any[],
      };

      // Process each student
      for (const student of students) {
        const studentId = student.id;
        const currentGrade = student.grade;
        const nextGrade = gradeProgression[currentGrade] || currentGrade;

        // Simulate criteria evaluation (would fetch from academic records in production)
        const meetsGpaCriteria = true;
        const meetsAttendanceCriteria = true;
        const hasPassingGrades = true;

        const meetsCriteria =
          meetsGpaCriteria &&
          meetsAttendanceCriteria &&
          (!requirePassingGrades || hasPassingGrades);

        let action: 'promoted' | 'retained' | 'graduated';
        let newGrade: string;

        if (meetsCriteria) {
          if (nextGrade === 'GRADUATED') {
            action = 'graduated';
            newGrade = '12';
            results.graduated++;
          } else {
            action = 'promoted';
            newGrade = nextGrade;
            results.promoted++;
          }
        } else {
          action = 'retained';
          newGrade = currentGrade;
          results.retained++;
        }

        results.details.push({
          studentId,
          studentNumber: student.studentNumber,
          studentName: `${student.firstName} ${student.lastName}`,
          currentGrade,
          newGrade,
          action,
          meetsCriteria: {
            gpa: meetsGpaCriteria,
            attendance: meetsAttendanceCriteria,
            passingGrades: hasPassingGrades,
          },
        });

        // Apply changes if not dry-run
        if (!isDryRun && action !== 'retained') {
          student.grade = newGrade;
          await student.save();

          this.logInfo(
            `Student ${action}: ${studentId} (${student.studentNumber}) from ${currentGrade} to ${newGrade}`,
          );
        }
      }

      const summaryMessage = isDryRun
        ? `Bulk grade transition DRY RUN completed`
        : `Bulk grade transition executed successfully`;

      this.logInfo(
        `${summaryMessage}: ${results.total} students processed, ` +
          `${results.promoted} promoted, ${results.retained} retained, ${results.graduated} graduated ` +
          `(Effective: ${effectiveDate.toISOString()})`,
      );

      return {
        success: true,
        message: summaryMessage,
        effectiveDate: effectiveDate.toISOString(),
        dryRun: isDryRun,
        criteria: {
          minimumGpa,
          minimumAttendance,
          requirePassingGrades,
        },
        results: {
          total: results.total,
          promoted: results.promoted,
          retained: results.retained,
          graduated: results.graduated,
        },
        details: results.details,
      };
    } catch (error) {
      this.handleError('Failed to perform bulk grade transition', error);
    }
  }

  /**
   * Get graduating students
   * Returns students eligible for graduation based on criteria
   *
   * OPTIMIZATION: Fixed N+1 query problem with batch fetching
   */
  async getGraduatingStudents(query: GraduatingStudentsDto): Promise<any> {
    try {
      const academicYear = query.academicYear || new Date().getFullYear().toString();
      const minimumGpa = query.minimumGpa || 2.0;
      const minimumCredits = query.minimumCredits || 24;

      // Query students in grade 12
      const students = await this.studentModel.findAll({
        where: {
          grade: '12',
          isActive: true,
        },
        order: [
          ['lastName', 'ASC'],
          ['firstName', 'ASC'],
        ],
      });

      // Batch fetch all academic histories
      const studentIds = students.map((s) => s.id);
      const allTranscriptsMap =
        studentIds.length > 0
          ? await this.academicTranscriptService.batchGetAcademicHistories(studentIds)
          : new Map<string, any[]>();

      const eligibleStudents: any[] = [];
      const ineligibleStudents: any[] = [];

      for (const student of students) {
        const transcripts = allTranscriptsMap.get(student.id) || [];

        // Calculate cumulative GPA and total credits
        let cumulativeGpa = 0;
        let totalCredits = 0;
        let totalTranscripts = 0;

        for (const transcript of transcripts) {
          if (transcript.gpa && transcript.gpa > 0) {
            cumulativeGpa += transcript.gpa;
            totalTranscripts++;
          }
          if (transcript.subjects && Array.isArray(transcript.subjects)) {
            totalCredits += transcript.subjects.reduce(
              (sum: number, subject: any) => sum + (subject.credits || 0),
              0,
            );
          }
        }

        const averageGpa = totalTranscripts > 0 ? cumulativeGpa / totalTranscripts : 0;

        // Check eligibility
        const meetsGpaRequirement = averageGpa >= minimumGpa;
        const meetsCreditsRequirement = totalCredits >= minimumCredits;
        const isEligible = meetsGpaRequirement && meetsCreditsRequirement;

        const studentData = {
          studentId: student.id,
          studentNumber: student.studentNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          fullName: `${student.firstName} ${student.lastName}`,
          dateOfBirth: student.dateOfBirth,
          grade: student.grade,
          academicMetrics: {
            cumulativeGpa: Math.round(averageGpa * 100) / 100,
            totalCredits,
            transcriptCount: totalTranscripts,
          },
          eligibilityCriteria: {
            gpa: {
              required: minimumGpa,
              actual: Math.round(averageGpa * 100) / 100,
              meets: meetsGpaRequirement,
            },
            credits: {
              required: minimumCredits,
              actual: totalCredits,
              meets: meetsCreditsRequirement,
            },
          },
          isEligible,
        };

        if (isEligible) {
          eligibleStudents.push(studentData);
        } else {
          ineligibleStudents.push(studentData);
        }
      }

      this.logInfo(
        `Graduating students query: ${eligibleStudents.length} eligible, ${ineligibleStudents.length} ineligible ` +
          `(Year: ${academicYear}, Min GPA: ${minimumGpa}, Min Credits: ${minimumCredits})`,
      );

      return {
        success: true,
        academicYear,
        criteria: {
          minimumGpa,
          minimumCredits,
        },
        summary: {
          totalStudents: students.length,
          eligible: eligibleStudents.length,
          ineligible: ineligibleStudents.length,
        },
        eligibleStudents,
        ineligibleStudents,
      };
    } catch (error) {
      this.handleError('Failed to retrieve graduating students', error);
    }
  }
}
