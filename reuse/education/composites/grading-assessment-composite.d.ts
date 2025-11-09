/**
 * LOC: EDU-COMP-GRADING-001
 * File: /reuse/education/composites/grading-assessment-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../grading-assessment-kit
 *   - ../student-records-kit
 *   - ../course-catalog-kit
 *   - ../faculty-management-kit
 *   - ../compliance-reporting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Grading controllers
 *   - Assessment management services
 *   - Grade reporting modules
 *   - Academic analytics systems
 *   - Transcript generation services
 */
import { Sequelize } from 'sequelize';
/**
 * Grade status types
 */
export type GradeStatus = 'pending' | 'submitted' | 'approved' | 'posted' | 'appealed' | 'changed';
/**
 * Letter grade types
 */
export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F' | 'P' | 'NP' | 'W' | 'I' | 'AU';
/**
 * Assessment type categories
 */
export type AssessmentType = 'exam' | 'quiz' | 'homework' | 'project' | 'lab' | 'participation' | 'presentation' | 'paper' | 'midterm' | 'final';
/**
 * Academic standing types
 */
export type AcademicStanding = 'good_standing' | 'probation' | 'warning' | 'suspension' | 'dismissal' | 'deans_list' | 'honors';
/**
 * Grade data
 */
export interface GradeData {
    studentId: string;
    sectionId: string;
    courseId: string;
    letterGrade: LetterGrade;
    numericGrade?: number;
    qualityPoints?: number;
    credits: number;
    term: string;
    academicYear: number;
    status: GradeStatus;
    submittedBy: string;
    submittedAt?: Date;
    approvedBy?: string;
    approvedAt?: Date;
    comments?: string;
}
/**
 * Assessment data
 */
export interface AssessmentData {
    sectionId: string;
    assessmentName: string;
    assessmentType: AssessmentType;
    maxPoints: number;
    weight: number;
    dueDate?: Date;
    instructions?: string;
    rubricId?: string;
    allowLateSubmission?: boolean;
    latePenalty?: number;
}
/**
 * Grade submission data
 */
export interface GradeSubmissionData {
    studentId: string;
    assessmentId: string;
    pointsEarned: number;
    submittedAt?: Date;
    feedback?: string;
    attachments?: string[];
    lateDays?: number;
}
/**
 * Rubric data
 */
export interface RubricData {
    rubricName: string;
    description: string;
    criteria: Array<{
        criterion: string;
        maxPoints: number;
        levels: Array<{
            level: string;
            points: number;
            description: string;
        }>;
    }>;
    createdBy: string;
}
/**
 * Grade change request
 */
export interface GradeChangeRequest {
    gradeId: string;
    requestedBy: string;
    requestedGrade: LetterGrade;
    reason: string;
    supportingDocuments?: string[];
    status: 'pending' | 'approved' | 'denied';
}
/**
 * GPA calculation result
 */
export interface GPAResult {
    studentId: string;
    term?: string;
    cumulativeGPA: number;
    termGPA?: number;
    totalCredits: number;
    totalQualityPoints: number;
    gradesIncluded: number;
}
/**
 * Sequelize model for Student Grades with full tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     StudentGrade:
 *       type: object
 *       required:
 *         - studentId
 *         - sectionId
 *         - letterGrade
 *         - credits
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         studentId:
 *           type: string
 *         letterGrade:
 *           type: string
 *           enum: [A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F, P, NP, W, I, AU]
 *         numericGrade:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         qualityPoints:
 *           type: number
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} StudentGrade model
 *
 * @example
 * ```typescript
 * const StudentGrade = createStudentGradeModel(sequelize);
 * const grade = await StudentGrade.create({
 *   studentId: 'student-123',
 *   sectionId: 'section-456',
 *   courseId: 'cs-101',
 *   letterGrade: 'A',
 *   numericGrade: 94.5,
 *   qualityPoints: 12.0,
 *   credits: 3.0,
 *   term: 'fall',
 *   academicYear: 2025,
 *   status: 'submitted',
 *   submittedBy: 'faculty-789'
 * });
 * ```
 */
export declare const createStudentGradeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        sectionId: string;
        courseId: string;
        letterGrade: LetterGrade;
        numericGrade: number | null;
        qualityPoints: number;
        credits: number;
        term: string;
        academicYear: number;
        status: GradeStatus;
        submittedBy: string;
        submittedAt: Date | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        comments: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Assessments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Assessment model
 */
export declare const createAssessmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        sectionId: string;
        assessmentName: string;
        assessmentType: AssessmentType;
        maxPoints: number;
        weight: number;
        dueDate: Date | null;
        instructions: string | null;
        rubricId: string | null;
        allowLateSubmission: boolean;
        latePenalty: number;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Grading & Assessment Composite Service
 *
 * Provides comprehensive grading workflows, assessment management, grade calculations,
 * and academic standing determination for higher education institutions.
 */
export declare class GradingAssessmentService {
    private readonly sequelize;
    private readonly logger;
    private readonly gradeScale;
    constructor(sequelize: Sequelize);
    /**
     * 1. Enters a grade for a student in a section.
     *
     * @param {GradeData} gradeData - Grade data
     * @returns {Promise<any>} Created grade
     *
     * @example
     * ```typescript
     * const grade = await service.enterStudentGrade({
     *   studentId: 'student-123',
     *   sectionId: 'section-456',
     *   courseId: 'cs-101',
     *   letterGrade: 'A',
     *   numericGrade: 94.5,
     *   credits: 3.0,
     *   term: 'fall',
     *   academicYear: 2025,
     *   status: 'submitted',
     *   submittedBy: 'faculty-789'
     * });
     * ```
     */
    enterStudentGrade(gradeData: GradeData): Promise<any>;
    /**
     * 2. Updates an existing grade.
     *
     * @param {string} gradeId - Grade ID
     * @param {Partial<GradeData>} updates - Grade updates
     * @returns {Promise<any>} Updated grade
     *
     * @example
     * ```typescript
     * await service.updateStudentGrade('grade-123', { letterGrade: 'A-', numericGrade: 91.5 });
     * ```
     */
    updateStudentGrade(gradeId: string, updates: Partial<GradeData>): Promise<any>;
    /**
     * 3. Submits grades for entire section.
     *
     * @param {string} sectionId - Section ID
     * @param {string} submittedBy - Instructor ID
     * @returns {Promise<any>} Submission result
     *
     * @example
     * ```typescript
     * await service.submitSectionGrades('section-456', 'faculty-789');
     * ```
     */
    submitSectionGrades(sectionId: string, submittedBy: string): Promise<any>;
    /**
     * 4. Approves submitted grades.
     *
     * @param {string} sectionId - Section ID
     * @param {string} approvedBy - Approver ID
     * @returns {Promise<any>} Approval result
     *
     * @example
     * ```typescript
     * await service.approveSectionGrades('section-456', 'registrar-999');
     * ```
     */
    approveSectionGrades(sectionId: string, approvedBy: string): Promise<any>;
    /**
     * 5. Posts approved grades to student records.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Posting result
     *
     * @example
     * ```typescript
     * await service.postGradesToRecords('section-456');
     * ```
     */
    postGradesToRecords(sectionId: string): Promise<any>;
    /**
     * 6. Retrieves all grades for a student.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any[]>} Student grades
     *
     * @example
     * ```typescript
     * const grades = await service.getStudentGrades('student-123');
     * ```
     */
    getStudentGrades(studentId: string): Promise<any[]>;
    /**
     * 7. Retrieves grades for a section.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any[]>} Section grades
     *
     * @example
     * ```typescript
     * const grades = await service.getSectionGrades('section-456');
     * ```
     */
    getSectionGrades(sectionId: string): Promise<any[]>;
    /**
     * 8. Validates grade entry permissions.
     *
     * @param {string} instructorId - Instructor ID
     * @param {string} sectionId - Section ID
     * @returns {Promise<boolean>} True if authorized
     *
     * @example
     * ```typescript
     * const canEnter = await service.validateGradeEntryPermissions('faculty-789', 'section-456');
     * ```
     */
    validateGradeEntryPermissions(instructorId: string, sectionId: string): Promise<boolean>;
    /**
     * 9. Creates a new assessment for a section.
     *
     * @param {AssessmentData} assessmentData - Assessment data
     * @returns {Promise<any>} Created assessment
     *
     * @example
     * ```typescript
     * const assessment = await service.createAssessment({
     *   sectionId: 'section-456',
     *   assessmentName: 'Midterm Exam',
     *   assessmentType: 'midterm',
     *   maxPoints: 100,
     *   weight: 0.30,
     *   dueDate: new Date('2025-10-15')
     * });
     * ```
     */
    createAssessment(assessmentData: AssessmentData): Promise<any>;
    /**
     * 10. Updates assessment details.
     *
     * @param {string} assessmentId - Assessment ID
     * @param {Partial<AssessmentData>} updates - Updates
     * @returns {Promise<any>} Updated assessment
     *
     * @example
     * ```typescript
     * await service.updateAssessment('assess-123', { maxPoints: 110, weight: 0.35 });
     * ```
     */
    updateAssessment(assessmentId: string, updates: Partial<AssessmentData>): Promise<any>;
    /**
     * 11. Deletes an assessment.
     *
     * @param {string} assessmentId - Assessment ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.deleteAssessment('assess-123');
     * ```
     */
    deleteAssessment(assessmentId: string): Promise<void>;
    /**
     * 12. Lists all assessments for a section.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any[]>} Assessments
     *
     * @example
     * ```typescript
     * const assessments = await service.getSectionAssessments('section-456');
     * ```
     */
    getSectionAssessments(sectionId: string): Promise<any[]>;
    /**
     * 13. Submits student work for assessment.
     *
     * @param {GradeSubmissionData} submissionData - Submission data
     * @returns {Promise<any>} Created submission
     *
     * @example
     * ```typescript
     * const submission = await service.submitAssessmentGrade({
     *   studentId: 'student-123',
     *   assessmentId: 'assess-456',
     *   pointsEarned: 87.5,
     *   feedback: 'Good work!',
     *   submittedAt: new Date()
     * });
     * ```
     */
    submitAssessmentGrade(submissionData: GradeSubmissionData): Promise<any>;
    /**
     * 14. Calculates weighted assessment scores.
     *
     * @param {string} studentId - Student ID
     * @param {string} sectionId - Section ID
     * @returns {Promise<number>} Weighted score
     *
     * @example
     * ```typescript
     * const score = await service.calculateWeightedScore('student-123', 'section-456');
     * console.log(`Weighted score: ${score}%`);
     * ```
     */
    calculateWeightedScore(studentId: string, sectionId: string): Promise<number>;
    /**
     * 15. Generates assessment statistics for section.
     *
     * @param {string} assessmentId - Assessment ID
     * @returns {Promise<any>} Assessment statistics
     *
     * @example
     * ```typescript
     * const stats = await service.generateAssessmentStatistics('assess-123');
     * ```
     */
    generateAssessmentStatistics(assessmentId: string): Promise<any>;
    /**
     * 16. Calculates cumulative GPA for student.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<GPAResult>} GPA calculation
     *
     * @example
     * ```typescript
     * const gpa = await service.calculateCumulativeGPA('student-123');
     * console.log(`Cumulative GPA: ${gpa.cumulativeGPA}`);
     * ```
     */
    calculateCumulativeGPA(studentId: string): Promise<GPAResult>;
    /**
     * 17. Calculates term GPA for student.
     *
     * @param {string} studentId - Student ID
     * @param {string} term - Academic term
     * @param {number} academicYear - Academic year
     * @returns {Promise<GPAResult>} GPA calculation
     *
     * @example
     * ```typescript
     * const gpa = await service.calculateTermGPA('student-123', 'fall', 2025);
     * console.log(`Fall 2025 GPA: ${gpa.termGPA}`);
     * ```
     */
    calculateTermGPA(studentId: string, term: string, academicYear: number): Promise<GPAResult>;
    /**
     * 18. Calculates major GPA for student.
     *
     * @param {string} studentId - Student ID
     * @param {string} majorCode - Major code
     * @returns {Promise<GPAResult>} Major GPA
     *
     * @example
     * ```typescript
     * const gpa = await service.calculateMajorGPA('student-123', 'CS');
     * ```
     */
    calculateMajorGPA(studentId: string, majorCode: string): Promise<GPAResult>;
    /**
     * 19. Determines academic standing for student.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<AcademicStanding>} Academic standing
     *
     * @example
     * ```typescript
     * const standing = await service.determineAcademicStanding('student-123');
     * console.log(`Standing: ${standing}`);
     * ```
     */
    determineAcademicStanding(studentId: string): Promise<AcademicStanding>;
    /**
     * 20. Validates GPA calculation accuracy.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<{valid: boolean; discrepancies: string[]}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateGPACalculation('student-123');
     * ```
     */
    validateGPACalculation(studentId: string): Promise<{
        valid: boolean;
        discrepancies: string[];
    }>;
    /**
     * 21. Projects future GPA scenarios.
     *
     * @param {string} studentId - Student ID
     * @param {Array<{credits: number; grade: LetterGrade}>} futureGrades - Projected grades
     * @returns {Promise<number>} Projected GPA
     *
     * @example
     * ```typescript
     * const projected = await service.projectFutureGPA('student-123', [
     *   { credits: 3, grade: 'A' },
     *   { credits: 4, grade: 'B+' }
     * ]);
     * ```
     */
    projectFutureGPA(studentId: string, futureGrades: Array<{
        credits: number;
        grade: LetterGrade;
    }>): Promise<number>;
    /**
     * 22. Generates GPA history report.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} GPA history
     *
     * @example
     * ```typescript
     * const history = await service.generateGPAHistory('student-123');
     * ```
     */
    generateGPAHistory(studentId: string): Promise<any>;
    /**
     * 23. Generates grade distribution for section.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Grade distribution
     *
     * @example
     * ```typescript
     * const distribution = await service.generateGradeDistribution('section-456');
     * ```
     */
    generateGradeDistribution(sectionId: string): Promise<any>;
    /**
     * 24. Calculates section grade statistics.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Grade statistics
     *
     * @example
     * ```typescript
     * const stats = await service.calculateSectionGradeStatistics('section-456');
     * ```
     */
    calculateSectionGradeStatistics(sectionId: string): Promise<any>;
    /**
     * 25. Compares grade distributions across sections.
     *
     * @param {string[]} sectionIds - Section IDs
     * @returns {Promise<any>} Comparison report
     *
     * @example
     * ```typescript
     * const comparison = await service.compareGradeDistributions(['section-1', 'section-2']);
     * ```
     */
    compareGradeDistributions(sectionIds: string[]): Promise<any>;
    /**
     * 26. Identifies grade inflation trends.
     *
     * @param {string} courseId - Course ID
     * @param {number} years - Years to analyze
     * @returns {Promise<any>} Trend analysis
     *
     * @example
     * ```typescript
     * const trends = await service.identifyGradeInflationTrends('cs-101', 5);
     * ```
     */
    identifyGradeInflationTrends(courseId: string, years: number): Promise<any>;
    /**
     * 27. Generates instructor grading patterns report.
     *
     * @param {string} instructorId - Instructor ID
     * @returns {Promise<any>} Grading patterns
     *
     * @example
     * ```typescript
     * const patterns = await service.generateInstructorGradingPatterns('faculty-789');
     * ```
     */
    generateInstructorGradingPatterns(instructorId: string): Promise<any>;
    /**
     * 28. Analyzes pass/fail rates.
     *
     * @param {string} courseId - Course ID
     * @param {string} term - Academic term
     * @returns {Promise<any>} Pass/fail analysis
     *
     * @example
     * ```typescript
     * const analysis = await service.analyzePassFailRates('cs-101', 'fall');
     * ```
     */
    analyzePassFailRates(courseId: string, term: string): Promise<any>;
    /**
     * 29. Generates departmental grade report.
     *
     * @param {string} departmentId - Department ID
     * @param {string} term - Academic term
     * @returns {Promise<any>} Department report
     *
     * @example
     * ```typescript
     * const report = await service.generateDepartmentalGradeReport('dept-cs', 'fall');
     * ```
     */
    generateDepartmentalGradeReport(departmentId: string, term: string): Promise<any>;
    /**
     * 30. Exports grade data for analysis.
     *
     * @param {string} term - Academic term
     * @param {string} format - Export format
     * @returns {Promise<any>} Exported data
     *
     * @example
     * ```typescript
     * const csvData = await service.exportGradeData('fall', 'csv');
     * ```
     */
    exportGradeData(term: string, format: 'csv' | 'json' | 'xlsx'): Promise<any>;
    /**
     * 31. Submits a grade appeal.
     *
     * @param {GradeChangeRequest} requestData - Appeal data
     * @returns {Promise<any>} Created appeal
     *
     * @example
     * ```typescript
     * const appeal = await service.submitGradeAppeal({
     *   gradeId: 'grade-123',
     *   requestedBy: 'student-456',
     *   requestedGrade: 'B+',
     *   reason: 'Grading error on final exam',
     *   status: 'pending'
     * });
     * ```
     */
    submitGradeAppeal(requestData: GradeChangeRequest): Promise<any>;
    /**
     * 32. Reviews grade appeal.
     *
     * @param {string} appealId - Appeal ID
     * @param {string} reviewerId - Reviewer ID
     * @param {string} decision - Decision
     * @param {string} comments - Review comments
     * @returns {Promise<any>} Updated appeal
     *
     * @example
     * ```typescript
     * await service.reviewGradeAppeal('appeal-123', 'dean-789', 'approved', 'Error confirmed');
     * ```
     */
    reviewGradeAppeal(appealId: string, reviewerId: string, decision: 'approved' | 'denied', comments: string): Promise<any>;
    /**
     * 33. Processes grade change request.
     *
     * @param {string} gradeId - Grade ID
     * @param {LetterGrade} newGrade - New grade
     * @param {string} reason - Change reason
     * @param {string} changedBy - User making change
     * @returns {Promise<any>} Updated grade
     *
     * @example
     * ```typescript
     * await service.processGradeChange('grade-123', 'A-', 'Calculation error', 'registrar-999');
     * ```
     */
    processGradeChange(gradeId: string, newGrade: LetterGrade, reason: string, changedBy: string): Promise<any>;
    /**
     * 34. Tracks grade change history.
     *
     * @param {string} gradeId - Grade ID
     * @returns {Promise<any[]>} Change history
     *
     * @example
     * ```typescript
     * const history = await service.getGradeChangeHistory('grade-123');
     * ```
     */
    getGradeChangeHistory(gradeId: string): Promise<any[]>;
    /**
     * 35. Validates grade change authorization.
     *
     * @param {string} userId - User ID
     * @param {string} gradeId - Grade ID
     * @returns {Promise<boolean>} True if authorized
     *
     * @example
     * ```typescript
     * const authorized = await service.validateGradeChangeAuthorization('registrar-999', 'grade-123');
     * ```
     */
    validateGradeChangeAuthorization(userId: string, gradeId: string): Promise<boolean>;
    /**
     * 36. Generates grade appeal report.
     *
     * @param {string} term - Academic term
     * @returns {Promise<any>} Appeal report
     *
     * @example
     * ```typescript
     * const report = await service.generateGradeAppealReport('fall');
     * ```
     */
    generateGradeAppealReport(term: string): Promise<any>;
    /**
     * 37. Notifies stakeholders of grade changes.
     *
     * @param {string} gradeId - Grade ID
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.notifyGradeChange('grade-123');
     * ```
     */
    notifyGradeChange(gradeId: string): Promise<void>;
    /**
     * 38. Generates academic integrity report.
     *
     * @param {string} sectionId - Section ID
     * @returns {Promise<any>} Integrity report
     *
     * @example
     * ```typescript
     * const report = await service.generateAcademicIntegrityReport('section-456');
     * ```
     */
    generateAcademicIntegrityReport(sectionId: string): Promise<any>;
    /**
     * Calculates median of array.
     *
     * @private
     */
    private calculateMedian;
    /**
     * Calculates standard deviation.
     *
     * @private
     */
    private calculateStdDev;
}
export default GradingAssessmentService;
//# sourceMappingURL=grading-assessment-composite.d.ts.map