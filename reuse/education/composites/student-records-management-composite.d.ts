/**
 * LOC: EDU-COMP-RECORDS-001
 * File: /reuse/education/composites/student-records-management-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../student-records-kit
 *   - ../transcript-management-kit
 *   - ../grading-assessment-kit
 *   - ../credential-management-kit
 *   - ../compliance-reporting-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend records services
 *   - Transcript processors
 *   - Academic history modules
 *   - Compliance reporting systems
 */
import { Sequelize } from 'sequelize';
export type TranscriptType = 'official' | 'unofficial' | 'grade_report' | 'degree_audit';
export type GradeChangeReason = 'error_correction' | 'incomplete_resolution' | 'grade_appeal' | 'academic_integrity';
export type RecordHoldType = 'transcript' | 'enrollment_verification' | 'diploma' | 'all_records';
export interface AcademicRecord {
    studentId: string;
    termId: string;
    courseId: string;
    courseName: string;
    credits: number;
    grade: string;
    qualityPoints: number;
    gradeDate: Date;
    attemptNumber: number;
    isRetake: boolean;
}
export interface TranscriptRequest {
    requestId: string;
    studentId: string;
    recipientName: string;
    recipientAddress: string;
    recipientEmail?: string;
    transcriptType: TranscriptType;
    deliveryMethod: 'email' | 'mail' | 'pickup' | 'electronic';
    requestDate: Date;
    processedDate?: Date;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    fee: number;
}
export interface GradeChange {
    changeId: string;
    studentId: string;
    courseId: string;
    termId: string;
    oldGrade: string;
    newGrade: string;
    reason: GradeChangeReason;
    requestedBy: string;
    approvedBy?: string;
    changeDate: Date;
    approvalDate?: Date;
    status: 'pending' | 'approved' | 'denied';
}
export declare class StudentRecordsCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    createAcademicRecord(recordData: Partial<AcademicRecord>): Promise<any>;
    updateGrade(studentId: string, courseId: string, termId: string, newGrade: string, reason: string): Promise<any>;
    calculateTermGPA(studentId: string, termId: string): Promise<number>;
    calculateCumulativeGPA(studentId: string): Promise<number>;
    calculateMajorGPA(studentId: string, majorCode: string): Promise<number>;
    trackAcademicStanding(studentId: string, termId: string): Promise<any>;
    recordCourseAttempt(studentId: string, courseId: string, termId: string, attempt: number): Promise<any>;
    identifyRetakeCourses(studentId: string): Promise<any[]>;
    calculateEarnedCredits(studentId: string): Promise<any>;
    generateAcademicSummary(studentId: string): Promise<any>;
    requestTranscript(requestData: Partial<TranscriptRequest>): Promise<any>;
    generateOfficialTranscript(studentId: string, includeInProgress: boolean): Promise<any>;
    generateUnofficialTranscript(studentId: string): Promise<any>;
    verifyTranscriptAuthenticity(transcriptId: string, verificationCode: string): Promise<any>;
    sendElectronicTranscript(requestId: string, recipientEmail: string): Promise<any>;
    trackTranscriptDelivery(requestId: string): Promise<any>;
    generateTranscriptWithWatermark(studentId: string, watermarkText: string): Promise<any>;
    processTranscriptHold(studentId: string, holdType: RecordHoldType, holdReason: string): Promise<any>;
    releaseTranscriptHold(holdId: string, releasedBy: string): Promise<void>;
    calculateTranscriptFees(transcriptType: TranscriptType, deliveryMethod: string, quantity: number): Promise<any>;
    submitGradeChange(changeData: Partial<GradeChange>): Promise<any>;
    approveGradeChange(changeId: string, approvedBy: string): Promise<any>;
    denyGradeChange(changeId: string, deniedBy: string, reason: string): Promise<any>;
    trackGradeChanges(studentId: string): Promise<any[]>;
    validateGradeScale(grade: string, gradeScale: string): Promise<boolean>;
    convertGradeToQualityPoints(grade: string): Promise<number>;
    processIncompleteGrade(studentId: string, courseId: string, termId: string, deadlineDate: Date): Promise<any>;
    resolveIncompleteGrade(incompleteId: string, finalGrade: string): Promise<any>;
    flagLateGradeSubmission(courseId: string, termId: string, instructorId: string): Promise<void>;
    generateGradeDistributionReport(courseId: string, termId: string): Promise<any>;
    generateDegreeProgressReport(studentId: string, programId: string): Promise<any>;
    trackCourseHistory(studentId: string, courseId: string): Promise<any[]>;
    identifyAcademicTrends(studentId: string): Promise<any>;
    compareAcademicPerformance(studentId: string, cohort: string): Promise<any>;
    generateCreditTransferReport(studentId: string): Promise<any>;
    validateAcademicIntegrity(studentId: string, incidentType: string, courseId: string): Promise<any>;
    trackHonorsDesignations(studentId: string): Promise<any>;
    generateEnrollmentVerification(studentId: string, termId: string, purpose: string): Promise<any>;
    exportAcademicData(studentId: string, format: string): Promise<any>;
    generateComplianceReport(reportType: string, startDate: Date, endDate: Date): Promise<any>;
}
export default StudentRecordsCompositeService;
//# sourceMappingURL=student-records-management-composite.d.ts.map