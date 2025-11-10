/**
 * LOC: EDUDA9876543
 * File: /reuse/education/degree-audit-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable education utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend education services
 *   - Academic advising systems
 *   - Degree planning modules
 *   - Student information system modules
 */
/**
 * File: /reuse/education/degree-audit-kit.ts
 * Locator: WC-EDU-AUDIT-001
 * Purpose: Enterprise-grade Degree Audit System - requirement checking, what-if analysis, exception processing, substitution management, transfer credit evaluation
 *
 * Upstream: Independent utility module for degree audit operations
 * Downstream: ../backend/education/*, advising controllers, student services, audit processors
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ functions for degree audit operations competing with Ellucian Degree Works/u.achieve
 *
 * LLM Context: Comprehensive degree audit utilities for production-ready education SIS applications.
 * Provides degree requirement checking, what-if analysis, exception and substitution processing, transfer credit evaluation,
 * audit report generation, completion tracking, GPA calculations, prerequisite validation, milestone tracking,
 * and automated degree progress analysis with advanced rule engine.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Conditional type for requirement fulfillment based on type
 */
type RequirementFulfillment<T extends RequirementType> = T extends 'course' ? CourseFulfillment : T extends 'credits' ? CreditFulfillment : T extends 'gpa' ? GPAFulfillment : BaseFulfillment;
/**
 * Mapped type for audit status by requirement category
 */
type AuditStatusMap = {
    [K in RequirementCategory]: {
        status: CompletionStatus;
        progress: number;
        requirements: number;
    };
};
/**
 * Discriminated union for requirement rules
 */
type RequirementRule = {
    type: 'course';
    courseCode: string;
    minGrade?: string;
} | {
    type: 'credits';
    minCredits: number;
    subject?: string;
    level?: string;
} | {
    type: 'gpa';
    minGPA: number;
    scope: 'overall' | 'major' | 'minor';
} | {
    type: 'group';
    groupId: string;
    selectCount: number;
} | {
    type: 'elective';
    credits: number;
    restrictions?: string[];
};
/**
 * Generic type for audit result with type safety
 */
type AuditResult<T extends RequirementType = RequirementType> = {
    requirementId: string;
    requirementType: T;
    fulfillment: RequirementFulfillment<T>;
    status: CompletionStatus;
    metadata?: Record<string, any>;
};
type RequirementType = 'course' | 'credits' | 'gpa' | 'group' | 'elective' | 'milestone';
type CompletionStatus = 'not_started' | 'in_progress' | 'completed' | 'incomplete' | 'waived' | 'substituted';
type RequirementCategory = 'general_education' | 'major' | 'minor' | 'concentration' | 'electives' | 'institutional';
type ExceptionType = 'waiver' | 'substitution' | 'override' | 'adjustment';
type TransferEvaluationStatus = 'pending' | 'evaluated' | 'accepted' | 'rejected' | 'partial';
interface DegreeRequirement {
    requirementId: string;
    requirementName: string;
    requirementType: RequirementType;
    category: RequirementCategory;
    description: string;
    rule: RequirementRule;
    minimumGrade?: string;
    requiredCredits?: number;
    isRequired: boolean;
    sequenceOrder?: number;
    prerequisites?: string[];
    corequisites?: string[];
    metadata?: Record<string, any>;
}
interface RequirementGroup {
    groupId: string;
    groupName: string;
    category: RequirementCategory;
    description: string;
    requirements: DegreeRequirement[];
    selectCount?: number;
    minimumCredits?: number;
    allowSubstitutions: boolean;
    isRequired: boolean;
    displayOrder: number;
}
interface BaseFulfillment {
    isFulfilled: boolean;
    completionPercentage: number;
    completedDate?: Date;
    notes?: string;
}
interface CourseFulfillment extends BaseFulfillment {
    courseId: string;
    courseCode: string;
    courseName: string;
    gradeEarned: string;
    creditsEarned: number;
    termCompleted: string;
}
interface CreditFulfillment extends BaseFulfillment {
    requiredCredits: number;
    earnedCredits: number;
    applicableCourses: Array<{
        courseId: string;
        courseCode: string;
        credits: number;
    }>;
}
interface GPAFulfillment extends BaseFulfillment {
    requiredGPA: number;
    currentGPA: number;
    scope: 'overall' | 'major' | 'minor';
    creditsConsidered: number;
}
interface AuditReport {
    studentId: string;
    programId: string;
    catalogYear: string;
    auditDate: Date;
    overallStatus: CompletionStatus;
    totalRequirements: number;
    completedRequirements: number;
    completionPercentage: number;
    expectedGraduationDate?: Date;
    categoryResults: AuditStatusMap;
    requirementGroups: RequirementGroupResult[];
    unmetRequirements: UnmetRequirement[];
    warnings: AuditWarning[];
    recommendations: string[];
    metadata?: Record<string, any>;
}
interface RequirementGroupResult {
    groupId: string;
    groupName: string;
    category: RequirementCategory;
    status: CompletionStatus;
    progress: number;
    requirements: AuditResult[];
}
interface UnmetRequirement {
    requirementId: string;
    requirementName: string;
    category: RequirementCategory;
    reason: string;
    suggestedCourses?: string[];
    estimatedTerms?: number;
}
interface AuditWarning {
    severity: 'info' | 'warning' | 'critical';
    category: string;
    message: string;
    affectedRequirements: string[];
    recommendedAction?: string;
}
interface WhatIfAnalysis {
    analysisId: string;
    studentId: string;
    currentProgramId: string;
    proposedProgramId: string;
    currentCatalogYear: string;
    proposedCatalogYear?: string;
    analysisDate: Date;
    currentAudit: AuditReport;
    proposedAudit: AuditReport;
    requirementsDifference: RequirementDifference[];
    additionalRequirements: DegreeRequirement[];
    fulfilledFromCurrent: DegreeRequirement[];
    estimatedAdditionalTerms: number;
    estimatedAdditionalCredits: number;
    feasibilityScore: number;
    recommendations: string[];
}
interface RequirementDifference {
    requirementId: string;
    requirementName: string;
    changeType: 'added' | 'removed' | 'modified';
    currentStatus?: CompletionStatus;
    proposedStatus?: CompletionStatus;
    impact: 'high' | 'medium' | 'low';
}
interface ExceptionRequest {
    exceptionId: string;
    studentId: string;
    requirementId: string;
    exceptionType: ExceptionType;
    requestedBy: string;
    requestDate: Date;
    justification: string;
    supportingDocuments?: string[];
    status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
    reviewedBy?: string;
    reviewDate?: Date;
    reviewComments?: string;
    effectiveDate?: Date;
    expirationDate?: Date;
    metadata?: Record<string, any>;
}
interface CourseSubstitution {
    substitutionId: string;
    studentId: string;
    originalRequirementId: string;
    originalCourseCode: string;
    substituteCourseCode: string;
    substituteCourseName: string;
    substituteCredits: number;
    substituteGrade: string;
    justification: string;
    approvedBy: string;
    approvedDate: Date;
    isActive: boolean;
}
interface TransferCreditEvaluation {
    evaluationId: string;
    studentId: string;
    sourceInstitution: string;
    sourceInstitutionType: 'two_year' | 'four_year' | 'international' | 'technical';
    sourceCourseCode: string;
    sourceCourseName: string;
    sourceCredits: number;
    sourceGrade?: string;
    equivalentCourseCode?: string;
    equivalentCourseName?: string;
    creditsAwarded: number;
    evaluationStatus: TransferEvaluationStatus;
    evaluatedBy: string;
    evaluationDate: Date;
    fulfillsRequirements: string[];
    includeInGPA: boolean;
    notes?: string;
    metadata?: Record<string, any>;
}
interface MilestoneTracking {
    milestoneId: string;
    milestoneName: string;
    description: string;
    category: string;
    requiredFor: 'graduation' | 'good_standing' | 'program_continuation';
    targetDate?: Date;
    completionDate?: Date;
    status: CompletionStatus;
    dependencies: string[];
    verifiedBy?: string;
    verificationDate?: Date;
}
interface ProgressTracking {
    studentId: string;
    programId: string;
    currentTerm: string;
    totalCreditsRequired: number;
    totalCreditsEarned: number;
    totalCreditsInProgress: number;
    overallGPA: number;
    majorGPA: number;
    academicStanding: string;
    expectedGraduationTerm: string;
    percentComplete: number;
    onTrackForGraduation: boolean;
    remainingRequirements: number;
    lastAuditDate: Date;
}
/**
 * Sequelize model for Degree Audits with comprehensive tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     DegreeAudit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         programId:
 *           type: string
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DegreeAudit model
 *
 * @example
 * ```typescript
 * const DegreeAudit = createDegreeAuditModel(sequelize);
 * const audit = await DegreeAudit.create({
 *   studentId: 'STU123456',
 *   programId: 'BS-CS',
 *   catalogYear: '2023-2024',
 *   auditDate: new Date(),
 *   overallStatus: 'in_progress'
 * });
 * ```
 */
export declare const createDegreeAuditModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        programId: string;
        catalogYear: string;
        auditDate: Date;
        auditType: string;
        overallStatus: CompletionStatus;
        totalRequirements: number;
        completedRequirements: number;
        inProgressRequirements: number;
        completionPercentage: number;
        totalCreditsRequired: number;
        creditsEarned: number;
        creditsInProgress: number;
        overallGPA: number;
        majorGPA: number;
        minorGPA: number | null;
        expectedGraduationDate: Date | null;
        onTrackForGraduation: boolean;
        auditResults: Record<string, any>;
        categoryResults: Record<string, any>;
        unmetRequirements: Record<string, any>[];
        warnings: Record<string, any>[];
        recommendations: string[];
        generatedBy: string;
        lastModifiedBy: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Requirement Groups with nested requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RequirementGroup model
 *
 * @example
 * ```typescript
 * const RequirementGroup = createRequirementGroupModel(sequelize);
 * const group = await RequirementGroup.create({
 *   programId: 'BS-CS',
 *   catalogYear: '2023-2024',
 *   groupName: 'Core Computer Science',
 *   category: 'major',
 *   requirements: [...]
 * });
 * ```
 */
export declare const createRequirementGroupModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        programId: string;
        catalogYear: string;
        groupId: string;
        groupName: string;
        category: RequirementCategory;
        description: string;
        requirements: Record<string, any>[];
        selectCount: number | null;
        minimumCredits: number | null;
        allowSubstitutions: boolean;
        isRequired: boolean;
        displayOrder: number;
        effectiveDate: Date;
        expirationDate: Date | null;
        isActive: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Audit Results tracking individual requirement outcomes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AuditResultModel model
 *
 * @example
 * ```typescript
 * const AuditResult = createAuditResultModel(sequelize);
 * const result = await AuditResult.create({
 *   auditId: 'audit-uuid',
 *   requirementId: 'REQ-CS-101',
 *   status: 'completed',
 *   fulfillmentData: {...}
 * });
 * ```
 */
export declare const createAuditResultModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        auditId: string;
        requirementId: string;
        requirementName: string;
        requirementType: RequirementType;
        category: RequirementCategory;
        status: CompletionStatus;
        completionPercentage: number;
        isFulfilled: boolean;
        fulfillmentData: Record<string, any>;
        completedDate: Date | null;
        waivedDate: Date | null;
        waivedBy: string | null;
        waiverReason: string | null;
        substitutionApplied: boolean;
        substitutionId: string | null;
        notes: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Execute comprehensive degree audit for a student.
 *
 * @param {string} studentId - Student identifier
 * @param {string} programId - Program identifier
 * @param {string} catalogYear - Catalog year
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<AuditReport>} Complete audit report
 *
 * @example
 * ```typescript
 * const audit = await executeDegreeAudit('STU123456', 'BS-CS', '2023-2024');
 * console.log(`Completion: ${audit.completionPercentage}%`);
 * console.log(`Unmet requirements: ${audit.unmetRequirements.length}`);
 * ```
 */
export declare function executeDegreeAudit(studentId: string, programId: string, catalogYear: string, transaction?: Transaction): Promise<AuditReport>;
/**
 * Check if specific requirement is met.
 *
 * @param {string} studentId - Student identifier
 * @param {DegreeRequirement} requirement - Requirement to check
 * @returns {Promise<AuditResult>} Requirement check result
 */
export declare function checkRequirement(studentId: string, requirement: DegreeRequirement): Promise<AuditResult<any>>;
/**
 * Check course requirement fulfillment.
 *
 * @param {string} studentId - Student identifier
 * @param {string} courseCode - Required course code
 * @param {string} [minGrade] - Minimum acceptable grade
 * @returns {Promise<AuditResult<'course'>>} Course requirement result
 */
export declare function checkCourseRequirement(studentId: string, courseCode: string, minGrade?: string): Promise<AuditResult<'course'>>;
/**
 * Check credit requirement fulfillment.
 *
 * @param {string} studentId - Student identifier
 * @param {number} requiredCredits - Required credit hours
 * @param {string} [subject] - Subject area filter
 * @param {string} [level] - Course level filter
 * @returns {Promise<AuditResult<'credits'>>} Credit requirement result
 */
export declare function checkCreditRequirement(studentId: string, requiredCredits: number, subject?: string, level?: string): Promise<AuditResult<'credits'>>;
/**
 * Check GPA requirement.
 *
 * @param {string} studentId - Student identifier
 * @param {number} minGPA - Minimum GPA required
 * @param {'overall' | 'major' | 'minor'} scope - GPA calculation scope
 * @returns {Promise<AuditResult<'gpa'>>} GPA requirement result
 */
export declare function checkGPARequirement(studentId: string, minGPA: number, scope: 'overall' | 'major' | 'minor'): Promise<AuditResult<'gpa'>>;
/**
 * Validate all prerequisites for a course.
 *
 * @param {string} studentId - Student identifier
 * @param {string} courseId - Course identifier
 * @returns {Promise<{ met: boolean; unmetPrerequisites: string[] }>} Prerequisite check result
 */
export declare function validatePrerequisites(studentId: string, courseId: string): Promise<{
    met: boolean;
    unmetPrerequisites: string[];
}>;
/**
 * Calculate progress percentage for requirement group.
 *
 * @param {string} studentId - Student identifier
 * @param {RequirementGroup} group - Requirement group
 * @returns {Promise<number>} Progress percentage (0-100)
 */
export declare function calculateGroupProgress(studentId: string, group: RequirementGroup): Promise<number>;
/**
 * Perform what-if analysis for program change.
 *
 * @param {string} studentId - Student identifier
 * @param {string} currentProgramId - Current program
 * @param {string} proposedProgramId - Proposed program
 * @param {string} [proposedCatalogYear] - Proposed catalog year
 * @returns {Promise<WhatIfAnalysis>} What-if analysis result
 *
 * @example
 * ```typescript
 * const analysis = await performWhatIfAnalysis(
 *   'STU123456',
 *   'BS-CS',
 *   'BS-SE'
 * );
 * console.log(`Additional terms needed: ${analysis.estimatedAdditionalTerms}`);
 * console.log(`Feasibility score: ${analysis.feasibilityScore}/100`);
 * ```
 */
export declare function performWhatIfAnalysis(studentId: string, currentProgramId: string, proposedProgramId: string, proposedCatalogYear?: string): Promise<WhatIfAnalysis>;
/**
 * Analyze impact of adding a minor.
 *
 * @param {string} studentId - Student identifier
 * @param {string} minorProgramId - Minor program identifier
 * @returns {Promise<WhatIfAnalysis>} Impact analysis
 */
export declare function analyzeMinorAddition(studentId: string, minorProgramId: string): Promise<WhatIfAnalysis>;
/**
 * Simulate catalog year change impact.
 *
 * @param {string} studentId - Student identifier
 * @param {string} programId - Program identifier
 * @param {string} newCatalogYear - New catalog year
 * @returns {Promise<WhatIfAnalysis>} Catalog change analysis
 */
export declare function analyzeCatalogYearChange(studentId: string, programId: string, newCatalogYear: string): Promise<WhatIfAnalysis>;
/**
 * Calculate feasibility score for program change.
 *
 * @param {WhatIfAnalysis} analysis - What-if analysis
 * @returns {number} Feasibility score (0-100)
 */
export declare function calculateFeasibilityScore(analysis: WhatIfAnalysis): number;
/**
 * Generate recommendations from what-if analysis.
 *
 * @param {WhatIfAnalysis} analysis - What-if analysis
 * @returns {string[]} List of recommendations
 */
export declare function generateWhatIfRecommendations(analysis: WhatIfAnalysis): string[];
/**
 * Create exception request for requirement.
 *
 * @param {Omit<ExceptionRequest, 'exceptionId' | 'status' | 'requestDate'>} requestData - Exception request data
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<ExceptionRequest>} Created exception request
 *
 * @example
 * ```typescript
 * const exception = await createExceptionRequest({
 *   studentId: 'STU123456',
 *   requirementId: 'REQ-CS-101',
 *   exceptionType: 'waiver',
 *   requestedBy: 'advisor',
 *   justification: 'Student has equivalent industry experience'
 * });
 * ```
 */
export declare function createExceptionRequest(requestData: Omit<ExceptionRequest, 'exceptionId' | 'status' | 'requestDate'>, transaction?: Transaction): Promise<ExceptionRequest>;
/**
 * Approve exception request.
 *
 * @param {string} exceptionId - Exception identifier
 * @param {string} reviewedBy - User approving exception
 * @param {string} [comments] - Review comments
 * @returns {Promise<ExceptionRequest>} Updated exception request
 */
export declare function approveException(exceptionId: string, reviewedBy: string, comments?: string): Promise<ExceptionRequest>;
/**
 * Reject exception request.
 *
 * @param {string} exceptionId - Exception identifier
 * @param {string} reviewedBy - User rejecting exception
 * @param {string} reason - Rejection reason
 * @returns {Promise<ExceptionRequest>} Updated exception request
 */
export declare function rejectException(exceptionId: string, reviewedBy: string, reason: string): Promise<ExceptionRequest>;
/**
 * Withdraw exception request.
 *
 * @param {string} exceptionId - Exception identifier
 * @param {string} withdrawnBy - User withdrawing request
 * @returns {Promise<ExceptionRequest>} Updated exception request
 */
export declare function withdrawException(exceptionId: string, withdrawnBy: string): Promise<ExceptionRequest>;
/**
 * Get all exceptions for student.
 *
 * @param {string} studentId - Student identifier
 * @param {'pending' | 'approved' | 'rejected' | 'withdrawn'} [status] - Filter by status
 * @returns {Promise<ExceptionRequest[]>} List of exceptions
 */
export declare function getStudentExceptions(studentId: string, status?: 'pending' | 'approved' | 'rejected' | 'withdrawn'): Promise<ExceptionRequest[]>;
/**
 * Create course substitution.
 *
 * @param {Omit<CourseSubstitution, 'substitutionId' | 'isActive'>} substitutionData - Substitution data
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<CourseSubstitution>} Created substitution
 *
 * @example
 * ```typescript
 * const substitution = await createCourseSubstitution({
 *   studentId: 'STU123456',
 *   originalRequirementId: 'REQ-CS-101',
 *   originalCourseCode: 'CS-101',
 *   substituteCourseCode: 'CS-150',
 *   substituteCourseName: 'Advanced Programming',
 *   substituteCredits: 3,
 *   substituteGrade: 'A',
 *   justification: 'Equivalent course content',
 *   approvedBy: 'dept-chair',
 *   approvedDate: new Date()
 * });
 * ```
 */
export declare function createCourseSubstitution(substitutionData: Omit<CourseSubstitution, 'substitutionId' | 'isActive'>, transaction?: Transaction): Promise<CourseSubstitution>;
/**
 * Approve course substitution.
 *
 * @param {string} substitutionId - Substitution identifier
 * @param {string} approvedBy - User approving substitution
 * @returns {Promise<CourseSubstitution>} Approved substitution
 */
export declare function approveSubstitution(substitutionId: string, approvedBy: string): Promise<CourseSubstitution>;
/**
 * Revoke course substitution.
 *
 * @param {string} substitutionId - Substitution identifier
 * @param {string} revokedBy - User revoking substitution
 * @param {string} reason - Revocation reason
 * @returns {Promise<void>}
 */
export declare function revokeSubstitution(substitutionId: string, revokedBy: string, reason: string): Promise<void>;
/**
 * Get active substitutions for student.
 *
 * @param {string} studentId - Student identifier
 * @returns {Promise<CourseSubstitution[]>} Active substitutions
 */
export declare function getActiveSubstitutions(studentId: string): Promise<CourseSubstitution[]>;
/**
 * Check if course can be substituted.
 *
 * @param {string} originalCourseCode - Original course code
 * @param {string} substituteCourseCode - Proposed substitute course
 * @returns {Promise<{ canSubstitute: boolean; reason?: string }>} Substitution eligibility
 */
export declare function validateSubstitutionEligibility(originalCourseCode: string, substituteCourseCode: string): Promise<{
    canSubstitute: boolean;
    reason?: string;
}>;
/**
 * Evaluate transfer credit for equivalency.
 *
 * @param {Omit<TransferCreditEvaluation, 'evaluationId' | 'evaluationStatus'>} evaluationData - Evaluation data
 * @param {Transaction} [transaction] - Optional database transaction
 * @returns {Promise<TransferCreditEvaluation>} Evaluation result
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateTransferCredit({
 *   studentId: 'STU123456',
 *   sourceInstitution: 'Community College',
 *   sourceInstitutionType: 'two_year',
 *   sourceCourseCode: 'CSCI-101',
 *   sourceCourseName: 'Intro to Programming',
 *   sourceCredits: 3,
 *   sourceGrade: 'A',
 *   evaluatedBy: 'registrar'
 * });
 * ```
 */
export declare function evaluateTransferCredit(evaluationData: Omit<TransferCreditEvaluation, 'evaluationId' | 'evaluationStatus'>, transaction?: Transaction): Promise<TransferCreditEvaluation>;
/**
 * Approve transfer credit evaluation.
 *
 * @param {string} evaluationId - Evaluation identifier
 * @param {string} equivalentCourseCode - Equivalent course at institution
 * @param {number} creditsAwarded - Credits to award
 * @param {string[]} fulfillsRequirements - Requirements fulfilled
 * @returns {Promise<TransferCreditEvaluation>} Approved evaluation
 */
export declare function approveTransferCredit(evaluationId: string, equivalentCourseCode: string, creditsAwarded: number, fulfillsRequirements: string[]): Promise<TransferCreditEvaluation>;
/**
 * Reject transfer credit.
 *
 * @param {string} evaluationId - Evaluation identifier
 * @param {string} reason - Rejection reason
 * @returns {Promise<TransferCreditEvaluation>} Rejected evaluation
 */
export declare function rejectTransferCredit(evaluationId: string, reason: string): Promise<TransferCreditEvaluation>;
/**
 * Get all transfer credits for student.
 *
 * @param {string} studentId - Student identifier
 * @param {TransferEvaluationStatus} [status] - Filter by status
 * @returns {Promise<TransferCreditEvaluation[]>} Transfer credits
 */
export declare function getStudentTransferCredits(studentId: string, status?: TransferEvaluationStatus): Promise<TransferCreditEvaluation[]>;
/**
 * Calculate total transfer credits awarded.
 *
 * @param {string} studentId - Student identifier
 * @returns {Promise<number>} Total transfer credits
 */
export declare function calculateTransferCreditsTotal(studentId: string): Promise<number>;
/**
 * Check transfer credit articulation agreement.
 *
 * @param {string} sourceInstitution - Source institution
 * @param {string} sourceCourseCode - Source course
 * @returns {Promise<{ hasAgreement: boolean; equivalentCourse?: string }>} Articulation result
 */
export declare function checkArticulationAgreement(sourceInstitution: string, sourceCourseCode: string): Promise<{
    hasAgreement: boolean;
    equivalentCourse?: string;
}>;
/**
 * Generate comprehensive audit report in PDF format.
 *
 * @param {string} auditId - Audit identifier
 * @param {any} [options] - Report formatting options
 * @returns {Promise<string>} Path to generated PDF
 */
export declare function generateAuditReportPDF(auditId: string, options?: any): Promise<string>;
/**
 * Generate audit summary for student portal.
 *
 * @param {string} studentId - Student identifier
 * @returns {Promise<any>} Audit summary
 */
export declare function generateAuditSummary(studentId: string): Promise<any>;
/**
 * Generate detailed requirement checklist.
 *
 * @param {string} auditId - Audit identifier
 * @returns {Promise<any[]>} Requirement checklist
 */
export declare function generateRequirementChecklist(auditId: string): Promise<any[]>;
/**
 * Generate graduation eligibility report.
 *
 * @param {string} studentId - Student identifier
 * @param {string} expectedGraduationTerm - Expected graduation term
 * @returns {Promise<any>} Graduation eligibility report
 */
export declare function generateGraduationEligibilityReport(studentId: string, expectedGraduationTerm: string): Promise<any>;
/**
 * Export audit data in JSON format.
 *
 * @param {string} auditId - Audit identifier
 * @returns {Promise<any>} Audit data as JSON
 */
export declare function exportAuditData(auditId: string): Promise<any>;
/**
 * Generate visual degree progress chart data.
 *
 * @param {string} studentId - Student identifier
 * @returns {Promise<any>} Chart data
 */
export declare function generateProgressChartData(studentId: string): Promise<any>;
/**
 * Track student progress toward degree completion.
 *
 * @param {string} studentId - Student identifier
 * @param {string} programId - Program identifier
 * @returns {Promise<ProgressTracking>} Progress tracking data
 */
export declare function trackDegreeProgress(studentId: string, programId: string): Promise<ProgressTracking>;
/**
 * Calculate estimated graduation date.
 *
 * @param {string} studentId - Student identifier
 * @param {number} creditsPerTerm - Average credits per term
 * @returns {Promise<Date>} Estimated graduation date
 */
export declare function calculateEstimatedGraduationDate(studentId: string, creditsPerTerm: number): Promise<Date>;
/**
 * Check graduation eligibility.
 *
 * @param {string} studentId - Student identifier
 * @param {string} programId - Program identifier
 * @returns {Promise<{ eligible: boolean; unmetRequirements: string[] }>} Eligibility check
 */
export declare function checkGraduationEligibility(studentId: string, programId: string): Promise<{
    eligible: boolean;
    unmetRequirements: string[];
}>;
/**
 * Track milestone completion.
 *
 * @param {string} studentId - Student identifier
 * @param {string} milestoneId - Milestone identifier
 * @param {string} completedBy - User marking completion
 * @returns {Promise<MilestoneTracking>} Updated milestone
 */
export declare function completeMilestone(studentId: string, milestoneId: string, completedBy: string): Promise<MilestoneTracking>;
/**
 * Get remaining requirements for student.
 *
 * @param {string} studentId - Student identifier
 * @param {string} programId - Program identifier
 * @returns {Promise<DegreeRequirement[]>} Remaining requirements
 */
export declare function getRemainingRequirements(studentId: string, programId: string): Promise<DegreeRequirement[]>;
/**
 * Calculate completion percentage by category.
 *
 * @param {string} studentId - Student identifier
 * @param {RequirementCategory} category - Requirement category
 * @returns {Promise<number>} Completion percentage
 */
export declare function calculateCategoryCompletion(studentId: string, category: RequirementCategory): Promise<number>;
/**
 * Generate course planning recommendations.
 *
 * @param {string} studentId - Student identifier
 * @param {number} termsRemaining - Number of terms remaining
 * @returns {Promise<string[]>} Course recommendations
 */
export declare function generateCoursePlanningRecommendations(studentId: string, termsRemaining: number): Promise<string[]>;
/**
 * Validate student is on track for timely graduation.
 *
 * @param {string} studentId - Student identifier
 * @param {Date} targetGraduationDate - Target graduation date
 * @returns {Promise<{ onTrack: boolean; issues: string[] }>} On-track validation
 */
export declare function validateGraduationTimeline(studentId: string, targetGraduationDate: Date): Promise<{
    onTrack: boolean;
    issues: string[];
}>;
export {};
//# sourceMappingURL=degree-audit-kit.d.ts.map