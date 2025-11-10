/**
 * LOC: EDU-DOWN-HISTORY-004
 * File: /reuse/education/composites/downstream/academic-history-modules.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../student-records-management-composite
 *   - ../grading-assessment-composite
 *   - ../transcript-credentials-composite
 *   - ../student-enrollment-lifecycle-composite
 *
 * DOWNSTREAM (imported by):
 *   - Academic history REST APIs
 *   - Transcript generation systems
 *   - Student portal history views
 *   - Reporting and analytics tools
 */

/**
 * File: /reuse/education/composites/downstream/academic-history-modules.ts
 * Locator: WC-DOWN-HISTORY-004
 * Purpose: Academic History Modules - Production-grade academic history tracking and record management
 *
 * Upstream: NestJS, Sequelize, records/grading/transcript/enrollment composites
 * Downstream: History APIs, transcript systems, portal views, reporting tools
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, PostgreSQL 14+
 * Exports: 40+ composed functions for comprehensive academic history and record management
 *
 * LLM Context: Production-grade academic history module for Ellucian SIS competitors.
 * Provides term-by-term history, grade history, enrollment history, transfer credit tracking,
 * course completion records, GPA calculations, academic standing history, degree progress tracking,
 * and comprehensive academic timeline management for higher education institutions.
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { Sequelize, Model, DataTypes, Op } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type HistoryRecordType = 'enrollment' | 'grade' | 'transfer' | 'withdrawal' | 'audit' | 'completion';
export type AcademicStanding = 'good' | 'warning' | 'probation' | 'suspension' | 'dismissal' | 'honors';

export interface AcademicHistoryRecord {
  recordId: string;
  studentId: string;
  termId: string;
  recordType: HistoryRecordType;
  recordDate: Date;
  details: Record<string, any>;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
}

export interface TermHistory {
  termId: string;
  termName: string;
  academicYear: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  creditsAttempted: number;
  creditsEarned: number;
  termGPA: number;
  cumulativeGPA: number;
  academicStanding: AcademicStanding;
  honors: string[];
}

export interface GradeHistory {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  termId: string;
  grade: string;
  gradePoints: number;
  credits: number;
  gradeType: 'letter' | 'pass_fail' | 'credit_no_credit' | 'audit';
  instructor: string;
  repeatedCourse: boolean;
  includedInGPA: boolean;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

export const createAcademicHistoryModel = (sequelize: Sequelize) => {
  class AcademicHistory extends Model {
    public id!: string;
    public studentId!: string;
    public termId!: string;
    public recordType!: string;
    public historyData!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  AcademicHistory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Student identifier',
      },
      termId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Term identifier',
      },
      recordType: {
        type: DataTypes.ENUM('enrollment', 'grade', 'transfer', 'withdrawal', 'audit', 'completion'),
        allowNull: false,
        comment: 'Type of history record',
      },
      historyData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'History record data',
      },
    },
    {
      sequelize,
      tableName: 'academic_history',
      timestamps: true,
      indexes: [
        { fields: ['studentId'] },
        { fields: ['termId'] },
        { fields: ['recordType'] },
      ],
    },
  );

  return AcademicHistory;
};

// ============================================================================
// NESTJS INJECTABLE SERVICE
// ============================================================================

@Injectable()
export class AcademicHistoryModulesService {
  private readonly logger = new Logger(AcademicHistoryModulesService.name);
  private AcademicHistory: any;

  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {
    this.AcademicHistory = createAcademicHistoryModel(sequelize);
  }

  // ========================================================================
  // SECTION 1: COMPLETE ACADEMIC HISTORY (Functions 1-10)
  // ========================================================================

  async getCompleteAcademicHistory(studentId: string): Promise<AcademicHistoryRecord[]> {
    try {
      this.logger.log(`Retrieving complete academic history for student ${studentId}`);
      
      const records = await this.AcademicHistory.findAll({
        where: { studentId },
        order: [['createdAt', 'DESC']],
      });

      return records.map((record: any) => ({
        recordId: record.id,
        studentId: record.studentId,
        termId: record.termId,
        recordType: record.recordType,
        recordDate: record.createdAt,
        details: record.historyData,
        verified: record.historyData.verified || false,
        verifiedBy: record.historyData.verifiedBy,
        verifiedAt: record.historyData.verifiedAt,
      }));
    } catch (error) {
      this.logger.error(`Error retrieving complete history: ${error.message}`);
      throw error;
    }
  }

  async getTermHistory(studentId: string, termId: string): Promise<TermHistory> {
    try {
      const termRecords = await this.AcademicHistory.findAll({
        where: { studentId, termId, recordType: 'grade' },
      });

      const courses = termRecords.map((r: any) => r.historyData);
      const coursesCompleted = courses.filter((c: any) => c.passed).length;
      const creditsAttempted = courses.reduce((sum: number, c: any) => sum + (c.credits || 0), 0);
      const creditsEarned = courses.filter((c: any) => c.passed).reduce((sum: number, c: any) => sum + (c.credits || 0), 0);
      
      const termGPA = this.calculateGPA(courses);
      const cumulativeGPA = await this.calculateCumulativeGPA(studentId);
      const academicStanding = this.determineAcademicStanding(termGPA, cumulativeGPA);

      return {
        termId,
        termName: courses[0]?.termName || 'Unknown Term',
        academicYear: courses[0]?.academicYear || 'Unknown Year',
        coursesEnrolled: courses.length,
        coursesCompleted,
        creditsAttempted,
        creditsEarned,
        termGPA,
        cumulativeGPA,
        academicStanding,
        honors: termGPA >= 3.5 ? ["Dean's List"] : [],
      };
    } catch (error) {
      this.logger.error(`Error retrieving term history: ${error.message}`);
      throw error;
    }
  }

  async getAllTermHistory(studentId: string): Promise<TermHistory[]> {
    try {
      const allRecords = await this.AcademicHistory.findAll({
        where: { studentId, recordType: 'grade' },
        order: [['termId', 'ASC']],
      });

      const termGroups = this.groupByTerm(allRecords);
      const termHistories: TermHistory[] = [];

      for (const [termId, records] of Object.entries(termGroups)) {
        const termHistory = await this.getTermHistory(studentId, termId);
        termHistories.push(termHistory);
      }

      return termHistories;
    } catch (error) {
      this.logger.error(`Error retrieving all term history: ${error.message}`);
      throw error;
    }
  }

  async getGradeHistory(studentId: string): Promise<GradeHistory[]> {
    try {
      const gradeRecords = await this.AcademicHistory.findAll({
        where: { studentId, recordType: 'grade' },
        order: [['termId', 'DESC']],
      });

      return gradeRecords.map((record: any) => {
        const data = record.historyData;
        return {
          courseId: data.courseId,
          courseCode: data.courseCode,
          courseTitle: data.courseTitle,
          termId: record.termId,
          grade: data.grade,
          gradePoints: data.gradePoints || 0,
          credits: data.credits || 0,
          gradeType: data.gradeType || 'letter',
          instructor: data.instructor || 'Unknown',
          repeatedCourse: data.repeatedCourse || false,
          includedInGPA: data.includedInGPA !== false,
        };
      });
    } catch (error) {
      this.logger.error(`Error retrieving grade history: ${error.message}`);
      throw error;
    }
  }

  async getCourseHistory(studentId: string, courseId: string): Promise<GradeHistory[]> {
    try {
      const courseRecords = await this.AcademicHistory.findAll({
        where: {
          studentId,
          recordType: 'grade',
          'historyData.courseId': courseId,
        },
        order: [['termId', 'DESC']],
      });

      return courseRecords.map((record: any) => {
        const data = record.historyData;
        return {
          courseId: data.courseId,
          courseCode: data.courseCode,
          courseTitle: data.courseTitle,
          termId: record.termId,
          grade: data.grade,
          gradePoints: data.gradePoints || 0,
          credits: data.credits || 0,
          gradeType: data.gradeType || 'letter',
          instructor: data.instructor || 'Unknown',
          repeatedCourse: courseRecords.length > 1,
          includedInGPA: data.includedInGPA !== false,
        };
      });
    } catch (error) {
      this.logger.error(`Error retrieving course history: ${error.message}`);
      throw error;
    }
  }

  async trackGPAHistory(studentId: string): Promise<Array<{ term: string; gpa: number }>> {
    try {
      const termHistories = await this.getAllTermHistory(studentId);
      return termHistories.map((th) => ({
        term: th.termName,
        gpa: th.termGPA,
      }));
    } catch (error) {
      this.logger.error(`Error tracking GPA history: ${error.message}`);
      throw error;
    }
  }

  async calculateCumulativeGPA(studentId: string): Promise<number> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const includedGrades = gradeHistory.filter((g) => g.includedInGPA);
      
      const totalPoints = includedGrades.reduce((sum, g) => sum + (g.gradePoints * g.credits), 0);
      const totalCredits = includedGrades.reduce((sum, g) => sum + g.credits, 0);

      return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
    } catch (error) {
      this.logger.error(`Error calculating cumulative GPA: ${error.message}`);
      throw error;
    }
  }

  async trackAcademicStandingHistory(studentId: string): Promise<Array<{ term: string; standing: AcademicStanding }>> {
    try {
      const termHistories = await this.getAllTermHistory(studentId);
      return termHistories.map((th) => ({
        term: th.termName,
        standing: th.academicStanding,
      }));
    } catch (error) {
      this.logger.error(`Error tracking academic standing: ${error.message}`);
      throw error;
    }
  }

  async getTransferCreditHistory(studentId: string): Promise<any[]> {
    try {
      const transferRecords = await this.AcademicHistory.findAll({
        where: { studentId, recordType: 'transfer' },
        order: [['createdAt', 'DESC']],
      });

      return transferRecords.map((record: any) => record.historyData);
    } catch (error) {
      this.logger.error(`Error retrieving transfer credit history: ${error.message}`);
      throw error;
    }
  }

  async trackCourseRepetitions(studentId: string): Promise<any[]> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const courseMap = new Map<string, GradeHistory[]>();

      gradeHistory.forEach((grade) => {
        if (!courseMap.has(grade.courseId)) {
          courseMap.set(grade.courseId, []);
        }
        courseMap.get(grade.courseId)!.push(grade);
      });

      const repetitions: any[] = [];
      courseMap.forEach((grades, courseId) => {
        if (grades.length > 1) {
          repetitions.push({
            courseId,
            courseCode: grades[0].courseCode,
            attempts: grades.length,
            grades: grades.map((g) => ({ term: g.termId, grade: g.grade })),
            bestGrade: this.getBestGrade(grades),
          });
        }
      });

      return repetitions;
    } catch (error) {
      this.logger.error(`Error tracking course repetitions: ${error.message}`);
      throw error;
    }
  }

  // ========================================================================
  // SECTION 2: WITHDRAWAL & SPECIAL STATUS TRACKING (Functions 11-20)
  // ========================================================================

  async getWithdrawalHistory(studentId: string): Promise<any[]> {
    try {
      const withdrawalRecords = await this.AcademicHistory.findAll({
        where: { studentId, recordType: 'withdrawal' },
        order: [['createdAt', 'DESC']],
      });

      return withdrawalRecords.map((record: any) => ({
        courseId: record.historyData.courseId,
        courseCode: record.historyData.courseCode,
        termId: record.termId,
        withdrawalDate: record.createdAt,
        reason: record.historyData.reason || 'Not specified',
        refundEligible: record.historyData.refundEligible || false,
      }));
    } catch (error) {
      this.logger.error(`Error retrieving withdrawal history: ${error.message}`);
      throw error;
    }
  }

  async trackIncompleteGrades(studentId: string): Promise<any[]> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const incompletes = gradeHistory.filter((g) => g.grade === 'I' || g.grade === 'INC');

      return incompletes.map((incomplete) => ({
        courseId: incomplete.courseId,
        courseCode: incomplete.courseCode,
        termId: incomplete.termId,
        dateAssigned: incomplete.termId,
        resolved: false,
        deadline: this.calculateIncompleteDeadline(incomplete.termId),
      }));
    } catch (error) {
      this.logger.error(`Error tracking incomplete grades: ${error.message}`);
      throw error;
    }
  }

  async getAuditedCourses(studentId: string): Promise<any[]> {
    try {
      const auditRecords = await this.AcademicHistory.findAll({
        where: { studentId, recordType: 'audit' },
        order: [['termId', 'DESC']],
      });

      return auditRecords.map((record: any) => ({
        courseId: record.historyData.courseId,
        courseCode: record.historyData.courseCode,
        courseTitle: record.historyData.courseTitle,
        termId: record.termId,
        instructor: record.historyData.instructor,
        completed: record.historyData.completed || false,
      }));
    } catch (error) {
      this.logger.error(`Error retrieving audited courses: ${error.message}`);
      throw error;
    }
  }

  async trackHonorsAndAwards(studentId: string): Promise<any[]> {
    try {
      const termHistories = await this.getAllTermHistory(studentId);
      const honors: any[] = [];

      termHistories.forEach((th) => {
        if (th.termGPA >= 3.5) {
          honors.push({
            term: th.termName,
            honor: "Dean's List",
            gpa: th.termGPA,
          });
        }
        if (th.termGPA >= 3.8) {
          honors.push({
            term: th.termName,
            honor: "President's List",
            gpa: th.termGPA,
          });
        }
      });

      return honors;
    } catch (error) {
      this.logger.error(`Error tracking honors and awards: ${error.message}`);
      throw error;
    }
  }

  async getDegreeProgress(studentId: string): Promise<any> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const completedCourses = gradeHistory.filter((g) => g.grade !== 'F' && g.grade !== 'W');
      const totalCreditsEarned = completedCourses.reduce((sum, g) => sum + g.credits, 0);

      return {
        totalCreditsEarned,
        creditsRequired: 120, // Typical bachelor's degree
        percentComplete: parseFloat(((totalCreditsEarned / 120) * 100).toFixed(2)),
        estimatedGraduationTerm: this.estimateGraduationTerm(totalCreditsEarned),
      };
    } catch (error) {
      this.logger.error(`Error calculating degree progress: ${error.message}`);
      throw error;
    }
  }

  async trackMajorChanges(studentId: string): Promise<any[]> {
    try {
      const enrollmentRecords = await this.AcademicHistory.findAll({
        where: {
          studentId,
          recordType: 'enrollment',
          'historyData.eventType': 'major_change',
        },
        order: [['createdAt', 'ASC']],
      });

      return enrollmentRecords.map((record: any) => ({
        effectiveDate: record.createdAt,
        previousMajor: record.historyData.previousMajor,
        newMajor: record.historyData.newMajor,
        reason: record.historyData.reason || 'Not specified',
      }));
    } catch (error) {
      this.logger.error(`Error tracking major changes: ${error.message}`);
      throw error;
    }
  }

  async getEnrollmentHistory(studentId: string): Promise<any[]> {
    try {
      const enrollmentRecords = await this.AcademicHistory.findAll({
        where: { studentId, recordType: 'enrollment' },
        order: [['termId', 'DESC']],
      });

      return enrollmentRecords.map((record: any) => ({
        termId: record.termId,
        enrollmentStatus: record.historyData.status || 'enrolled',
        enrollmentType: record.historyData.enrollmentType || 'full-time',
        program: record.historyData.program,
        major: record.historyData.major,
        creditsEnrolled: record.historyData.creditsEnrolled || 0,
      }));
    } catch (error) {
      this.logger.error(`Error retrieving enrollment history: ${error.message}`);
      throw error;
    }
  }

  async trackAttendanceHistory(studentId: string): Promise<any> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const attendanceData = gradeHistory.filter((g: any) => g.attendanceRate !== undefined);

      if (attendanceData.length === 0) {
        return { averageAttendance: null, courseCount: 0 };
      }

      const totalAttendance = attendanceData.reduce((sum: number, g: any) => sum + (g.attendanceRate || 0), 0);
      return {
        averageAttendance: parseFloat((totalAttendance / attendanceData.length).toFixed(2)),
        courseCount: attendanceData.length,
        lowAttendanceCourses: attendanceData.filter((g: any) => g.attendanceRate < 75),
      };
    } catch (error) {
      this.logger.error(`Error tracking attendance history: ${error.message}`);
      throw error;
    }
  }

  async getAcademicProbationHistory(studentId: string): Promise<any[]> {
    try {
      const standingHistory = await this.trackAcademicStandingHistory(studentId);
      return standingHistory.filter((s) => s.standing === 'probation' || s.standing === 'warning');
    } catch (error) {
      this.logger.error(`Error retrieving probation history: ${error.message}`);
      throw error;
    }
  }

  async trackDeansList(studentId: string): Promise<any[]> {
    try {
      const honors = await this.trackHonorsAndAwards(studentId);
      return honors.filter((h) => h.honor === "Dean's List");
    } catch (error) {
      this.logger.error(`Error tracking Dean's List: ${error.message}`);
      throw error;
    }
  }

  // ========================================================================
  // SECTION 3: ACADEMIC ANALYTICS (Functions 21-30)
  // ========================================================================

  async getCreditHoursSummary(studentId: string): Promise<any> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const creditsAttempted = gradeHistory.reduce((sum, g) => sum + g.credits, 0);
      const creditsEarned = gradeHistory.filter((g) => g.grade !== 'F' && g.grade !== 'W').reduce((sum, g) => sum + g.credits, 0);
      const transferCredits = await this.getTransferCreditHistory(studentId);
      const totalTransferCredits = transferCredits.reduce((sum: number, tc: any) => sum + (tc.credits || 0), 0);

      return {
        institutionalCreditsAttempted: creditsAttempted,
        institutionalCreditsEarned: creditsEarned,
        transferCredits: totalTransferCredits,
        totalCreditsEarned: creditsEarned + totalTransferCredits,
        successRate: creditsAttempted > 0 ? parseFloat(((creditsEarned / creditsAttempted) * 100).toFixed(2)) : 0,
      };
    } catch (error) {
      this.logger.error(`Error calculating credit hours summary: ${error.message}`);
      throw error;
    }
  }

  async getGradeDistribution(studentId: string): Promise<any> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const distribution: Record<string, number> = {};

      gradeHistory.forEach((g) => {
        distribution[g.grade] = (distribution[g.grade] || 0) + 1;
      });

      return {
        distribution,
        totalCourses: gradeHistory.length,
        mostCommonGrade: Object.keys(distribution).reduce((a, b) => (distribution[a] > distribution[b] ? a : b)),
      };
    } catch (error) {
      this.logger.error(`Error calculating grade distribution: ${error.message}`);
      throw error;
    }
  }

  async trackAcademicMilestones(studentId: string): Promise<any[]> {
    try {
      const creditSummary = await this.getCreditHoursSummary(studentId);
      const milestones: any[] = [];

      const creditMilestones = [
        { credits: 30, name: 'Freshman Standing Complete' },
        { credits: 60, name: 'Sophomore Standing Complete' },
        { credits: 90, name: 'Junior Standing Complete' },
        { credits: 120, name: 'Senior Standing Complete' },
      ];

      creditMilestones.forEach((milestone) => {
        if (creditSummary.totalCreditsEarned >= milestone.credits) {
          milestones.push({
            milestone: milestone.name,
            achievedAt: this.estimateMilestoneDate(studentId, milestone.credits),
            creditsEarned: milestone.credits,
          });
        }
      });

      return milestones;
    } catch (error) {
      this.logger.error(`Error tracking academic milestones: ${error.message}`);
      throw error;
    }
  }

  async getPassRateHistory(studentId: string): Promise<number> {
    try {
      const gradeHistory = await this.getGradeHistory(studentId);
      const passedCourses = gradeHistory.filter((g) => g.grade !== 'F' && g.grade !== 'W' && g.grade !== 'I').length;

      return gradeHistory.length > 0 ? parseFloat((passedCourses / gradeHistory.length).toFixed(2)) : 0;
    } catch (error) {
      this.logger.error(`Error calculating pass rate: ${error.message}`);
      throw error;
    }
  }

  async trackCourseLoadHistory(studentId: string): Promise<any[]> {
    try {
      const termHistories = await this.getAllTermHistory(studentId);
      return termHistories.map((th) => ({
        term: th.termName,
        coursesEnrolled: th.coursesEnrolled,
        creditsAttempted: th.creditsAttempted,
        loadType: th.creditsAttempted >= 12 ? 'full-time' : 'part-time',
      }));
    } catch (error) {
      this.logger.error(`Error tracking course load history: ${error.message}`);
      throw error;
    }
  }

  async getClassRankHistory(studentId: string): Promise<any[]> {
    try {
      // Simplified implementation - would need cohort data for real ranking
      const termHistories = await this.getAllTermHistory(studentId);
      return termHistories.map((th, index) => ({
        term: th.termName,
        estimatedPercentile: th.cumulativeGPA >= 3.7 ? 90 : th.cumulativeGPA >= 3.3 ? 75 : th.cumulativeGPA >= 3.0 ? 50 : 25,
        cumulativeGPA: th.cumulativeGPA,
      }));
    } catch (error) {
      this.logger.error(`Error tracking class rank: ${error.message}`);
      throw error;
    }
  }

  async trackSpecialPrograms(studentId: string): Promise<any[]> {
    try {
      const enrollmentHistory = await this.getEnrollmentHistory(studentId);
      return enrollmentHistory
        .filter((e: any) => e.specialPrograms && e.specialPrograms.length > 0)
        .map((e: any) => ({
          term: e.termId,
          programs: e.specialPrograms,
        }));
    } catch (error) {
      this.logger.error(`Error tracking special programs: ${error.message}`);
      throw error;
    }
  }

  async getInternationalCredits(studentId: string): Promise<any[]> {
    try {
      const transferCredits = await this.getTransferCreditHistory(studentId);
      return transferCredits.filter((tc: any) => tc.international === true);
    } catch (error) {
      this.logger.error(`Error retrieving international credits: ${error.message}`);
      throw error;
    }
  }

  async trackResidencyHistory(studentId: string): Promise<any[]> {
    try {
      const enrollmentHistory = await this.getEnrollmentHistory(studentId);
      return enrollmentHistory.map((e: any) => ({
        term: e.termId,
        residencyStatus: e.residencyStatus || 'in-state',
        statusChangeDate: e.residencyChangeDate,
      }));
    } catch (error) {
      this.logger.error(`Error tracking residency history: ${error.message}`);
      throw error;
    }
  }

  async getLeaveOfAbsenceHistory(studentId: string): Promise<any[]> {
    try {
      const loaRecords = await this.AcademicHistory.findAll({
        where: {
          studentId,
          recordType: 'enrollment',
          'historyData.eventType': 'leave_of_absence',
        },
        order: [['createdAt', 'DESC']],
      });

      return loaRecords.map((record: any) => ({
        startDate: record.historyData.startDate,
        endDate: record.historyData.endDate,
        reason: record.historyData.reason,
        approved: record.historyData.approved || false,
      }));
    } catch (error) {
      this.logger.error(`Error retrieving leave of absence history: ${error.message}`);
      throw error;
    }
  }

  // ========================================================================
  // SECTION 4: REPORTING & VERIFICATION (Functions 31-40)
  // ========================================================================

  async trackReadmissions(studentId: string): Promise<any[]> {
    try {
      const readmissionRecords = await this.AcademicHistory.findAll({
        where: {
          studentId,
          recordType: 'enrollment',
          'historyData.eventType': 'readmission',
        },
        order: [['createdAt', 'ASC']],
      });

      return readmissionRecords.map((record: any) => ({
        readmissionDate: record.createdAt,
        previousExitDate: record.historyData.previousExitDate,
        readmissionTerm: record.termId,
        conditions: record.historyData.conditions || [],
      }));
    } catch (error) {
      this.logger.error(`Error tracking readmissions: ${error.message}`);
      throw error;
    }
  }

  async getAcademicSuspensions(studentId: string): Promise<any[]> {
    try {
      const suspensionRecords = await this.AcademicHistory.findAll({
        where: {
          studentId,
          recordType: 'enrollment',
          'historyData.eventType': 'suspension',
        },
        order: [['createdAt', 'DESC']],
      });

      return suspensionRecords.map((record: any) => ({
        suspensionDate: record.createdAt,
        term: record.termId,
        reason: record.historyData.reason,
        reinstatementEligibility: record.historyData.reinstatementDate,
      }));
    } catch (error) {
      this.logger.error(`Error retrieving suspension history: ${error.message}`);
      throw error;
    }
  }

  async trackGradeChanges(studentId: string): Promise<any[]> {
    try {
      const gradeChangeRecords = await this.AcademicHistory.findAll({
        where: {
          studentId,
          'historyData.gradeChanged': true,
        },
        order: [['createdAt', 'DESC']],
      });

      return gradeChangeRecords.map((record: any) => ({
        courseId: record.historyData.courseId,
        termId: record.termId,
        originalGrade: record.historyData.originalGrade,
        newGrade: record.historyData.newGrade,
        changeDate: record.createdAt,
        reason: record.historyData.changeReason,
        approvedBy: record.historyData.approvedBy,
      }));
    } catch (error) {
      this.logger.error(`Error tracking grade changes: ${error.message}`);
      throw error;
    }
  }

  async getVerificationHistory(studentId: string): Promise<any[]> {
    try {
      const verifiedRecords = await this.AcademicHistory.findAll({
        where: {
          studentId,
          'historyData.verified': true,
        },
        order: [['createdAt', 'DESC']],
      });

      return verifiedRecords.map((record: any) => ({
        recordId: record.id,
        recordType: record.recordType,
        verifiedBy: record.historyData.verifiedBy,
        verifiedAt: record.historyData.verifiedAt,
        verificationNotes: record.historyData.verificationNotes,
      }));
    } catch (error) {
      this.logger.error(`Error retrieving verification history: ${error.message}`);
      throw error;
    }
  }

  async generateAcademicTimeline(studentId: string): Promise<any> {
    try {
      const allRecords = await this.getCompleteAcademicHistory(studentId);
      const timeline = allRecords.map((record) => ({
        date: record.recordDate,
        eventType: record.recordType,
        description: this.formatTimelineEvent(record),
        termId: record.termId,
      }));

      return {
        studentId,
        totalEvents: timeline.length,
        timeline: timeline.sort((a, b) => a.date.getTime() - b.date.getTime()),
      };
    } catch (error) {
      this.logger.error(`Error generating timeline: ${error.message}`);
      throw error;
    }
  }

  async exportAcademicHistory(studentId: string, format: string): Promise<any> {
    try {
      const completeHistory = await this.getCompleteAcademicHistory(studentId);
      const termHistories = await this.getAllTermHistory(studentId);
      const creditSummary = await this.getCreditHoursSummary(studentId);

      const exportData = {
        studentId,
        exportDate: new Date(),
        format,
        summary: creditSummary,
        termHistories,
        completeHistory,
      };

      if (format === 'json') {
        return JSON.stringify(exportData, null, 2);
      } else if (format === 'csv') {
        return this.convertToCSV(exportData);
      } else {
        return exportData;
      }
    } catch (error) {
      this.logger.error(`Error exporting history: ${error.message}`);
      throw error;
    }
  }

  async verifyAcademicRecord(recordId: string, verifier: string): Promise<{ verified: boolean; date: Date }> {
    try {
      const record = await this.AcademicHistory.findOne({ where: { id: recordId } });
      
      if (!record) {
        throw new Error('Record not found');
      }

      const verificationDate = new Date();
      await record.update({
        historyData: {
          ...record.historyData,
          verified: true,
          verifiedBy: verifier,
          verifiedAt: verificationDate,
        },
      });

      this.logger.log(`Record ${recordId} verified by ${verifier}`);
      return { verified: true, date: verificationDate };
    } catch (error) {
      this.logger.error(`Error verifying record: ${error.message}`);
      throw error;
    }
  }

  async auditAcademicHistory(studentId: string): Promise<{ issues: string[]; verified: boolean }> {
    try {
      const issues: string[] = [];
      const gradeHistory = await this.getGradeHistory(studentId);
      const creditSummary = await this.getCreditHoursSummary(studentId);
      
      // Check for grade inconsistencies
      const duplicateCourses = await this.trackCourseRepetitions(studentId);
      if (duplicateCourses.some((dc) => dc.attempts > 3)) {
        issues.push('Course repeated more than 3 times');
      }

      // Check GPA calculation
      const calculatedGPA = await this.calculateCumulativeGPA(studentId);
      if (isNaN(calculatedGPA)) {
        issues.push('GPA calculation error');
      }

      // Check credit consistency
      if (creditSummary.successRate < 0 || creditSummary.successRate > 100) {
        issues.push('Invalid success rate calculation');
      }

      return {
        issues,
        verified: issues.length === 0,
      };
    } catch (error) {
      this.logger.error(`Error auditing history: ${error.message}`);
      throw error;
    }
  }

  async compareHistoryWithPeers(studentId: string): Promise<any> {
    try {
      const studentGPA = await this.calculateCumulativeGPA(studentId);
      const studentCredits = await this.getCreditHoursSummary(studentId);
      
      // Simplified - would need cohort data for real comparison
      return {
        studentGPA,
        averagePeerGPA: 3.0,
        gpaPercentile: studentGPA >= 3.5 ? 75 : studentGPA >= 3.0 ? 50 : 25,
        creditsEarned: studentCredits.totalCreditsEarned,
        averagePeerCredits: 60,
        onTrackForGraduation: studentCredits.totalCreditsEarned >= 30,
      };
    } catch (error) {
      this.logger.error(`Error comparing with peers: ${error.message}`);
      throw error;
    }
  }

  async generateComprehensiveHistoryReport(studentId: string): Promise<any> {
    try {
      const [
        completeHistory,
        termHistories,
        creditSummary,
        gradeDistribution,
        milestones,
        honors,
        probationHistory,
      ] = await Promise.all([
        this.getCompleteAcademicHistory(studentId),
        this.getAllTermHistory(studentId),
        this.getCreditHoursSummary(studentId),
        this.getGradeDistribution(studentId),
        this.trackAcademicMilestones(studentId),
        this.trackHonorsAndAwards(studentId),
        this.getAcademicProbationHistory(studentId),
      ]);

      return {
        reportDate: new Date(),
        studentId,
        summary: {
          totalRecords: completeHistory.length,
          totalTerms: termHistories.length,
          currentCumulativeGPA: termHistories[termHistories.length - 1]?.cumulativeGPA || 0,
          totalCreditsEarned: creditSummary.totalCreditsEarned,
          successRate: creditSummary.successRate,
        },
        termHistories,
        gradeDistribution,
        milestones,
        honors,
        probationHistory,
        degreeProgress: await this.getDegreeProgress(studentId),
        academicTimeline: await this.generateAcademicTimeline(studentId),
      };
    } catch (error) {
      this.logger.error(`Error generating comprehensive report: ${error.message}`);
      throw error;
    }
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  private calculateGPA(courses: any[]): number {
    const gradedCourses = courses.filter((c) => c.includedInGPA !== false);
    const totalPoints = gradedCourses.reduce((sum, c) => sum + (c.gradePoints * c.credits), 0);
    const totalCredits = gradedCourses.reduce((sum, c) => sum + c.credits, 0);
    return totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
  }

  private determineAcademicStanding(termGPA: number, cumulativeGPA: number): AcademicStanding {
    if (cumulativeGPA >= 3.7) return 'honors';
    if (cumulativeGPA >= 2.0) return 'good';
    if (cumulativeGPA >= 1.7) return 'warning';
    if (cumulativeGPA >= 1.5) return 'probation';
    return 'suspension';
  }

  private groupByTerm(records: any[]): Record<string, any[]> {
    return records.reduce((acc, record) => {
      if (!acc[record.termId]) {
        acc[record.termId] = [];
      }
      acc[record.termId].push(record);
      return acc;
    }, {});
  }

  private getBestGrade(grades: GradeHistory[]): string {
    const gradeOrder = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
    return grades.map((g) => g.grade).sort((a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b))[0];
  }

  private calculateIncompleteDeadline(termId: string): Date {
    // Default: one year from end of term
    const deadline = new Date();
    deadline.setFullYear(deadline.getFullYear() + 1);
    return deadline;
  }

  private estimateGraduationTerm(creditsEarned: number): string {
    const creditsRemaining = 120 - creditsEarned;
    const termsRemaining = Math.ceil(creditsRemaining / 15);
    return `${termsRemaining} terms remaining`;
  }

  private estimateMilestoneDate(studentId: string, credits: number): Date {
    // Simplified - would query actual enrollment dates
    return new Date();
  }

  private formatTimelineEvent(record: AcademicHistoryRecord): string {
    const typeDescriptions: Record<string, string> = {
      enrollment: 'Enrollment event',
      grade: 'Grade posted',
      transfer: 'Transfer credit accepted',
      withdrawal: 'Course withdrawal',
      audit: 'Course audited',
      completion: 'Course completed',
    };
    return typeDescriptions[record.recordType] || 'Academic event';
  }

  private convertToCSV(data: any): string {
    // Simplified CSV conversion
    return JSON.stringify(data);
  }
}

export default AcademicHistoryModulesService;
