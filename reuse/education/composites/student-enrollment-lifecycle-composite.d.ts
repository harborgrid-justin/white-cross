/**
 * LOC: EDU-COMP-ENROLL-001
 * File: /reuse/education/composites/student-enrollment-lifecycle-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - sequelize (v6.x)
 *   - ../student-enrollment-kit
 *   - ../admissions-management-kit
 *   - ../course-registration-kit
 *   - ../student-records-kit
 *   - ../financial-aid-kit
 *   - ../student-billing-kit
 *
 * DOWNSTREAM (imported by):
 *   - Backend enrollment services
 *   - Student lifecycle management modules
 *   - Enrollment verification controllers
 *   - Matriculation workflow services
 */
import { Sequelize } from 'sequelize';
/**
 * Enrollment lifecycle stage
 */
export type EnrollmentLifecycleStage = 'application' | 'admission' | 'enrollment_deposit' | 'orientation' | 'advising' | 'registration' | 'financial_clearance' | 'matriculation' | 'active_enrollment' | 'retention';
/**
 * Lifecycle transition event
 */
export interface LifecycleTransitionEvent {
    studentId: string;
    fromStage: EnrollmentLifecycleStage;
    toStage: EnrollmentLifecycleStage;
    transitionDate: Date;
    triggeredBy: string;
    automatedTransition: boolean;
    verificationRequired: boolean;
    completionCriteria: string[];
    metadata?: Record<string, any>;
}
/**
 * Enrollment verification document
 */
export interface EnrollmentVerificationDoc {
    studentId: string;
    termId: string;
    verificationType: 'full_time' | 'part_time' | 'half_time' | 'less_than_half';
    creditsEnrolled: number;
    verificationDate: Date;
    verifiedBy: string;
    expirationDate: Date;
    certificateUrl?: string;
    purpose: string;
}
/**
 * Matriculation checklist item
 */
export interface MatriculationChecklistItem {
    itemId: string;
    itemName: string;
    category: 'academic' | 'financial' | 'administrative' | 'health' | 'housing';
    isRequired: boolean;
    dueDate?: Date;
    status: 'not_started' | 'in_progress' | 'completed' | 'waived';
    completedDate?: Date;
    completedBy?: string;
    verificationRequired: boolean;
    instructions: string;
}
/**
 * Orientation session
 */
export interface OrientationSession {
    sessionId: string;
    sessionName: string;
    sessionType: 'new_student' | 'transfer' | 'international' | 'graduate' | 'online';
    sessionDate: Date;
    sessionTime: string;
    location: string;
    capacity: number;
    enrolled: number;
    waitlisted: number;
    registrationDeadline: Date;
    agenda: string[];
}
/**
 * Enrollment confirmation
 */
export interface EnrollmentConfirmation {
    confirmationId: string;
    studentId: string;
    termId: string;
    confirmationType: 'deposit' | 'intent_to_enroll' | 'final_confirmation';
    confirmationDate: Date;
    depositAmount?: number;
    depositPaid: boolean;
    commitmentDeadline: Date;
    withdrawalDeadline?: Date;
    refundEligible: boolean;
}
/**
 * Retention risk assessment
 */
export interface RetentionRiskAssessment {
    studentId: string;
    assessmentDate: Date;
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    riskScore: number;
    riskFactors: Array<{
        factor: string;
        weight: number;
        currentValue: number;
        threshold: number;
    }>;
    interventions: string[];
    assignedAdvisor?: string;
    followUpDate?: Date;
}
/**
 * Lifecycle analytics
 */
export interface LifecycleAnalytics {
    termId: string;
    totalApplicants: number;
    acceptedApplicants: number;
    confirmedEnrollments: number;
    matriculatedStudents: number;
    yieldRate: number;
    meltRate: number;
    averageDaysToMatriculation: number;
    stageConversionRates: Record<EnrollmentLifecycleStage, number>;
    retentionRate: number;
}
/**
 * Sequelize model for Enrollment Lifecycle tracking.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     EnrollmentLifecycle:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         studentId:
 *           type: string
 *         currentStage:
 *           type: string
 *           enum: [application, admission, enrollment_deposit, orientation, advising, registration, financial_clearance, matriculation, active_enrollment, retention]
 *         termId:
 *           type: string
 *         applicationDate:
 *           type: string
 *           format: date-time
 *         matriculationDate:
 *           type: string
 *           format: date-time
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EnrollmentLifecycle model
 *
 * @example
 * ```typescript
 * const EnrollmentLifecycle = createEnrollmentLifecycleModel(sequelize);
 * const lifecycle = await EnrollmentLifecycle.create({
 *   studentId: 'STU-2024-001',
 *   currentStage: 'application',
 *   termId: 'FALL-2024',
 *   applicationDate: new Date()
 * });
 * ```
 */
export declare const createEnrollmentLifecycleModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        currentStage: EnrollmentLifecycleStage;
        termId: string;
        applicationDate: Date;
        admissionDate: Date | null;
        depositDate: Date | null;
        orientationDate: Date | null;
        advisingDate: Date | null;
        registrationDate: Date | null;
        financialClearanceDate: Date | null;
        matriculationDate: Date | null;
        isActive: boolean;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Matriculation Checklist tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} MatriculationChecklist model
 */
export declare const createMatriculationChecklistModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        studentId: string;
        termId: string;
        itemId: string;
        itemName: string;
        category: string;
        isRequired: boolean;
        dueDate: Date | null;
        status: string;
        completedDate: Date | null;
        completedBy: string | null;
        verificationRequired: boolean;
        instructions: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Student Enrollment Lifecycle Composite Service
 *
 * Provides comprehensive enrollment lifecycle management from application through matriculation.
 */
export declare class EnrollmentLifecycleCompositeService {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * 1. Initializes enrollment lifecycle for new applicant.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {Date} applicationDate - Application date
     * @returns {Promise<any>} Initialized lifecycle record
     *
     * @example
     * ```typescript
     * const lifecycle = await service.initializeEnrollmentLifecycle(
     *   'STU-2024-001',
     *   'FALL-2024',
     *   new Date()
     * );
     * console.log(`Lifecycle initialized at stage: ${lifecycle.currentStage}`);
     * ```
     */
    initializeEnrollmentLifecycle(studentId: string, termId: string, applicationDate: Date): Promise<any>;
    /**
     * 2. Transitions student to next lifecycle stage.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {EnrollmentLifecycleStage} toStage - Target stage
     * @param {string} triggeredBy - User triggering transition
     * @returns {Promise<LifecycleTransitionEvent>} Transition event
     *
     * @example
     * ```typescript
     * const transition = await service.transitionLifecycleStage(
     *   'STU-2024-001',
     *   'FALL-2024',
     *   'admission',
     *   'admissions-officer-123'
     * );
     * ```
     */
    transitionLifecycleStage(studentId: string, termId: string, toStage: EnrollmentLifecycleStage, triggeredBy: string): Promise<LifecycleTransitionEvent>;
    /**
     * 3. Retrieves current lifecycle status for student.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Current lifecycle status
     *
     * @example
     * ```typescript
     * const status = await service.getEnrollmentLifecycleStatus('STU-2024-001', 'FALL-2024');
     * console.log(`Current stage: ${status.currentStage}, Progress: ${status.progressPercentage}%`);
     * ```
     */
    getEnrollmentLifecycleStatus(studentId: string, termId: string): Promise<any>;
    /**
     * 4. Tracks lifecycle milestone completion.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {string} milestoneName - Milestone name
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.trackLifecycleMilestone('STU-2024-001', 'FALL-2024', 'orientation_completed');
     * ```
     */
    trackLifecycleMilestone(studentId: string, termId: string, milestoneName: string): Promise<void>;
    /**
     * 5. Identifies blockers preventing lifecycle progression.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<Array<{type: string; description: string; severity: string}>>} Blockers
     *
     * @example
     * ```typescript
     * const blockers = await service.identifyLifecycleBlockers('STU-2024-001', 'FALL-2024');
     * if (blockers.length > 0) {
     *   console.log('Cannot progress due to:', blockers);
     * }
     * ```
     */
    identifyLifecycleBlockers(studentId: string, termId: string): Promise<Array<{
        type: string;
        description: string;
        severity: string;
    }>>;
    /**
     * 6. Calculates lifecycle completion percentage.
     *
     * @param {any} lifecycle - Lifecycle record
     * @returns {number} Completion percentage
     *
     * @example
     * ```typescript
     * const percentage = service.calculateLifecycleProgress(lifecycle);
     * console.log(`${percentage}% complete`);
     * ```
     */
    calculateLifecycleProgress(lifecycle: any): number;
    /**
     * 7. Validates stage transition rules.
     *
     * @param {EnrollmentLifecycleStage} fromStage - Current stage
     * @param {EnrollmentLifecycleStage} toStage - Target stage
     * @returns {Promise<boolean>} True if valid transition
     *
     * @example
     * ```typescript
     * const isValid = await service.validateStageTransition('admission', 'enrollment_deposit');
     * ```
     */
    validateStageTransition(fromStage: EnrollmentLifecycleStage, toStage: EnrollmentLifecycleStage): Promise<boolean>;
    /**
     * 8. Generates lifecycle progress report.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Progress report
     *
     * @example
     * ```typescript
     * const report = await service.generateLifecycleProgressReport('STU-2024-001', 'FALL-2024');
     * ```
     */
    generateLifecycleProgressReport(studentId: string, termId: string): Promise<any>;
    /**
     * 9. Creates default matriculation checklist for student.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any[]>} Created checklist items
     *
     * @example
     * ```typescript
     * const checklist = await service.createDefaultMatriculationChecklist('STU-2024-001', 'FALL-2024');
     * console.log(`Created ${checklist.length} checklist items`);
     * ```
     */
    createDefaultMatriculationChecklist(studentId: string, termId: string): Promise<any[]>;
    /**
     * 10. Updates matriculation checklist item status.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {string} itemId - Item ID
     * @param {string} status - New status
     * @param {string} completedBy - User completing item
     * @returns {Promise<any>} Updated item
     *
     * @example
     * ```typescript
     * await service.updateChecklistItemStatus(
     *   'STU-2024-001',
     *   'FALL-2024',
     *   'complete-orientation',
     *   'completed',
     *   'advisor-123'
     * );
     * ```
     */
    updateChecklistItemStatus(studentId: string, termId: string, itemId: string, status: 'not_started' | 'in_progress' | 'completed' | 'waived', completedBy?: string): Promise<any>;
    /**
     * 11. Retrieves matriculation checklist status.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Checklist status
     *
     * @example
     * ```typescript
     * const status = await service.getMatriculationChecklistStatus('STU-2024-001', 'FALL-2024');
     * console.log(`${status.completedCount}/${status.totalCount} items completed`);
     * ```
     */
    getMatriculationChecklistStatus(studentId: string, termId: string): Promise<any>;
    /**
     * 12. Checks if all required checklist items are complete.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<boolean>} True if all required items complete
     *
     * @example
     * ```typescript
     * const complete = await service.checkChecklistCompletion('STU-2024-001', 'FALL-2024');
     * if (complete) {
     *   await service.transitionLifecycleStage(studentId, termId, 'matriculation', 'system');
     * }
     * ```
     */
    checkChecklistCompletion(studentId: string, termId: string): Promise<boolean>;
    /**
     * 13. Adds custom checklist item.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {MatriculationChecklistItem} item - Checklist item
     * @returns {Promise<any>} Created item
     *
     * @example
     * ```typescript
     * await service.addCustomChecklistItem('STU-2024-001', 'FALL-2024', {
     *   itemId: 'additional-requirements',
     *   itemName: 'Submit Portfolio',
     *   category: 'academic',
     *   isRequired: true,
     *   verificationRequired: true,
     *   instructions: 'Upload art portfolio for review',
     *   status: 'not_started'
     * });
     * ```
     */
    addCustomChecklistItem(studentId: string, termId: string, item: MatriculationChecklistItem): Promise<any>;
    /**
     * 14. Waives checklist item.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {string} itemId - Item ID
     * @param {string} waivedBy - User waiving item
     * @param {string} reason - Waiver reason
     * @returns {Promise<any>} Waived item
     *
     * @example
     * ```typescript
     * await service.waiveChecklistItem(
     *   'STU-2024-001',
     *   'FALL-2024',
     *   'housing-application',
     *   'advisor-123',
     *   'Commuter student - housing not required'
     * );
     * ```
     */
    waiveChecklistItem(studentId: string, termId: string, itemId: string, waivedBy: string, reason: string): Promise<any>;
    /**
     * 15. Sends checklist reminder notifications.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<number>} Number of reminders sent
     *
     * @example
     * ```typescript
     * const remindersSent = await service.sendChecklistReminders('STU-2024-001', 'FALL-2024');
     * console.log(`Sent ${remindersSent} reminder notifications`);
     * ```
     */
    sendChecklistReminders(studentId: string, termId: string): Promise<number>;
    /**
     * 16. Generates checklist completion report.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Completion report
     *
     * @example
     * ```typescript
     * const report = await service.generateChecklistCompletionReport('FALL-2024');
     * console.log(`Overall completion: ${report.averageCompletion}%`);
     * ```
     */
    generateChecklistCompletionReport(termId: string): Promise<any>;
    /**
     * 17. Schedules orientation session.
     *
     * @param {OrientationSession} session - Orientation session
     * @returns {Promise<any>} Created session
     *
     * @example
     * ```typescript
     * const session = await service.scheduleOrientationSession({
     *   sessionId: 'ORIENT-FALL-2024-001',
     *   sessionName: 'New Student Orientation - Session 1',
     *   sessionType: 'new_student',
     *   sessionDate: new Date('2024-08-15'),
     *   sessionTime: '9:00 AM - 3:00 PM',
     *   location: 'Student Center',
     *   capacity: 100,
     *   enrolled: 0,
     *   waitlisted: 0,
     *   registrationDeadline: new Date('2024-08-10'),
     *   agenda: ['Welcome', 'Academic Advising', 'Campus Tour', 'Technology Setup']
     * });
     * ```
     */
    scheduleOrientationSession(session: OrientationSession): Promise<any>;
    /**
     * 18. Registers student for orientation.
     *
     * @param {string} studentId - Student ID
     * @param {string} sessionId - Session ID
     * @returns {Promise<any>} Registration confirmation
     *
     * @example
     * ```typescript
     * const registration = await service.registerForOrientation('STU-2024-001', 'ORIENT-FALL-2024-001');
     * ```
     */
    registerForOrientation(studentId: string, sessionId: string): Promise<any>;
    /**
     * 19. Marks orientation as completed.
     *
     * @param {string} studentId - Student ID
     * @param {string} sessionId - Session ID
     * @param {string} completedBy - User marking complete
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.completeOrientation('STU-2024-001', 'ORIENT-FALL-2024-001', 'staff-456');
     * ```
     */
    completeOrientation(studentId: string, sessionId: string, completedBy: string): Promise<void>;
    /**
     * 20. Retrieves orientation session details.
     *
     * @param {string} sessionId - Session ID
     * @returns {Promise<OrientationSession>} Session details
     *
     * @example
     * ```typescript
     * const session = await service.getOrientationSession('ORIENT-FALL-2024-001');
     * console.log(`${session.enrolled}/${session.capacity} enrolled`);
     * ```
     */
    getOrientationSession(sessionId: string): Promise<OrientationSession>;
    /**
     * 21. Lists available orientation sessions.
     *
     * @param {string} termId - Term ID
     * @param {string} sessionType - Session type
     * @returns {Promise<OrientationSession[]>} Available sessions
     *
     * @example
     * ```typescript
     * const sessions = await service.listOrientationSessions('FALL-2024', 'new_student');
     * ```
     */
    listOrientationSessions(termId: string, sessionType?: 'new_student' | 'transfer' | 'international' | 'graduate' | 'online'): Promise<OrientationSession[]>;
    /**
     * 22. Generates orientation attendance report.
     *
     * @param {string} sessionId - Session ID
     * @returns {Promise<any>} Attendance report
     *
     * @example
     * ```typescript
     * const report = await service.generateOrientationAttendanceReport('ORIENT-FALL-2024-001');
     * console.log(`${report.attendanceRate}% attendance rate`);
     * ```
     */
    generateOrientationAttendanceReport(sessionId: string): Promise<any>;
    /**
     * 23. Generates enrollment verification document.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @param {string} purpose - Verification purpose
     * @returns {Promise<EnrollmentVerificationDoc>} Verification document
     *
     * @example
     * ```typescript
     * const verification = await service.generateEnrollmentVerification(
     *   'STU-2024-001',
     *   'FALL-2024',
     *   'insurance'
     * );
     * console.log(`Verification type: ${verification.verificationType}`);
     * ```
     */
    generateEnrollmentVerification(studentId: string, termId: string, purpose: string): Promise<EnrollmentVerificationDoc>;
    /**
     * 24. Validates enrollment verification request.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<{valid: boolean; reason?: string}>} Validation result
     *
     * @example
     * ```typescript
     * const validation = await service.validateEnrollmentVerificationRequest('STU-2024-001', 'FALL-2024');
     * ```
     */
    validateEnrollmentVerificationRequest(studentId: string, termId: string): Promise<{
        valid: boolean;
        reason?: string;
    }>;
    /**
     * 25. Calculates enrolled credits for term.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<number>} Total enrolled credits
     *
     * @example
     * ```typescript
     * const credits = await service.calculateEnrolledCredits('STU-2024-001', 'FALL-2024');
     * console.log(`Enrolled in ${credits} credits`);
     * ```
     */
    calculateEnrolledCredits(studentId: string, termId: string): Promise<number>;
    /**
     * 26. Determines enrollment verification type based on credits.
     *
     * @param {number} credits - Enrolled credits
     * @returns {'full_time' | 'part_time' | 'half_time' | 'less_than_half'} Verification type
     *
     * @example
     * ```typescript
     * const type = service.determineVerificationType(12);
     * console.log(`Enrollment type: ${type}`);
     * ```
     */
    determineVerificationType(credits: number): 'full_time' | 'part_time' | 'half_time' | 'less_than_half';
    /**
     * 27. Sends verification document to requester.
     *
     * @param {EnrollmentVerificationDoc} verification - Verification document
     * @param {string} recipientEmail - Recipient email
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.sendVerificationDocument(verification, 'insurance@company.com');
     * ```
     */
    sendVerificationDocument(verification: EnrollmentVerificationDoc, recipientEmail: string): Promise<void>;
    /**
     * 28. Tracks verification document usage.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any[]>} Verification history
     *
     * @example
     * ```typescript
     * const history = await service.trackVerificationUsage('STU-2024-001', 'FALL-2024');
     * console.log(`${history.length} verifications generated`);
     * ```
     */
    trackVerificationUsage(studentId: string, termId: string): Promise<any[]>;
    /**
     * 29. Assesses student retention risk.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<RetentionRiskAssessment>} Risk assessment
     *
     * @example
     * ```typescript
     * const assessment = await service.assessRetentionRisk('STU-2024-001', 'FALL-2024');
     * if (assessment.riskLevel === 'high' || assessment.riskLevel === 'critical') {
     *   await service.initiateRetentionIntervention(studentId, assessment);
     * }
     * ```
     */
    assessRetentionRisk(studentId: string, termId: string): Promise<RetentionRiskAssessment>;
    /**
     * 30. Recommends retention interventions.
     *
     * @param {'low' | 'moderate' | 'high' | 'critical'} riskLevel - Risk level
     * @returns {string[]} Recommended interventions
     *
     * @example
     * ```typescript
     * const interventions = service.recommendRetentionInterventions('high');
     * ```
     */
    recommendRetentionInterventions(riskLevel: 'low' | 'moderate' | 'high' | 'critical'): string[];
    /**
     * 31. Initiates retention intervention.
     *
     * @param {string} studentId - Student ID
     * @param {RetentionRiskAssessment} assessment - Risk assessment
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.initiateRetentionIntervention('STU-2024-001', assessment);
     * ```
     */
    initiateRetentionIntervention(studentId: string, assessment: RetentionRiskAssessment): Promise<void>;
    /**
     * 32. Tracks student engagement metrics.
     *
     * @param {string} studentId - Student ID
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Engagement metrics
     *
     * @example
     * ```typescript
     * const metrics = await service.trackStudentEngagement('STU-2024-001', 'FALL-2024');
     * console.log(`Engagement score: ${metrics.overallScore}`);
     * ```
     */
    trackStudentEngagement(studentId: string, termId: string): Promise<any>;
    /**
     * 33. Generates retention cohort report.
     *
     * @param {string} cohort - Cohort identifier
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Cohort retention report
     *
     * @example
     * ```typescript
     * const report = await service.generateRetentionCohortReport('FALL-2023', 'SPRING-2024');
     * console.log(`Retention rate: ${report.retentionRate}%`);
     * ```
     */
    generateRetentionCohortReport(cohort: string, termId: string): Promise<any>;
    /**
     * 34. Monitors first-year experience milestones.
     *
     * @param {string} studentId - Student ID
     * @returns {Promise<any>} First-year milestones
     *
     * @example
     * ```typescript
     * const milestones = await service.monitorFirstYearExperience('STU-2024-001');
     * ```
     */
    monitorFirstYearExperience(studentId: string): Promise<any>;
    /**
     * 35. Schedules retention intervention follow-up.
     *
     * @param {string} studentId - Student ID
     * @param {string} interventionId - Intervention ID
     * @param {Date} followUpDate - Follow-up date
     * @returns {Promise<void>}
     *
     * @example
     * ```typescript
     * await service.scheduleRetentionFollowUp(
     *   'STU-2024-001',
     *   'INT-2024-001',
     *   new Date('2024-10-15')
     * );
     * ```
     */
    scheduleRetentionFollowUp(studentId: string, interventionId: string, followUpDate: Date): Promise<void>;
    /**
     * 36. Calculates enrollment yield rate.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<number>} Yield rate percentage
     *
     * @example
     * ```typescript
     * const yieldRate = await service.calculateEnrollmentYieldRate('FALL-2024');
     * console.log(`Yield rate: ${yieldRate}%`);
     * ```
     */
    calculateEnrollmentYieldRate(termId: string): Promise<number>;
    /**
     * 37. Calculates summer melt rate.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<number>} Melt rate percentage
     *
     * @example
     * ```typescript
     * const meltRate = await service.calculateSummerMeltRate('FALL-2024');
     * console.log(`Melt rate: ${meltRate}%`);
     * ```
     */
    calculateSummerMeltRate(termId: string): Promise<number>;
    /**
     * 38. Generates lifecycle analytics dashboard.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<LifecycleAnalytics>} Analytics dashboard
     *
     * @example
     * ```typescript
     * const analytics = await service.generateLifecycleAnalytics('FALL-2024');
     * console.log(`Yield rate: ${analytics.yieldRate}%, Melt rate: ${analytics.meltRate}%`);
     * ```
     */
    generateLifecycleAnalytics(termId: string): Promise<LifecycleAnalytics>;
    /**
     * 39. Tracks lifecycle stage conversion funnel.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Conversion funnel data
     *
     * @example
     * ```typescript
     * const funnel = await service.trackLifecycleConversionFunnel('FALL-2024');
     * ```
     */
    trackLifecycleConversionFunnel(termId: string): Promise<any>;
    /**
     * 40. Identifies lifecycle bottlenecks.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<Array<{stage: string; dropOffRate: number; reason: string}>>} Bottlenecks
     *
     * @example
     * ```typescript
     * const bottlenecks = await service.identifyLifecycleBottlenecks('FALL-2024');
     * bottlenecks.forEach(b => console.log(`${b.stage}: ${b.dropOffRate}% - ${b.reason}`));
     * ```
     */
    identifyLifecycleBottlenecks(termId: string): Promise<Array<{
        stage: string;
        dropOffRate: number;
        reason: string;
    }>>;
    /**
     * 41. Generates time-to-matriculation report.
     *
     * @param {string} termId - Term ID
     * @returns {Promise<any>} Time-to-matriculation metrics
     *
     * @example
     * ```typescript
     * const report = await service.generateTimeToMatriculationReport('FALL-2024');
     * console.log(`Average: ${report.averageDays} days`);
     * ```
     */
    generateTimeToMatriculationReport(termId: string): Promise<any>;
    /**
     * 42. Exports lifecycle data for external reporting.
     *
     * @param {string} termId - Term ID
     * @param {string} format - Export format
     * @returns {Promise<any>} Exported data
     *
     * @example
     * ```typescript
     * const data = await service.exportLifecycleData('FALL-2024', 'csv');
     * ```
     */
    exportLifecycleData(termId: string, format: 'csv' | 'json' | 'xlsx'): Promise<any>;
    /**
     * Updates stage-specific timestamp on lifecycle record.
     * @private
     */
    private updateStageTimestamp;
    /**
     * Checks if stage requires verification.
     * @private
     */
    private requiresVerification;
    /**
     * Gets completion criteria for stage.
     * @private
     */
    private getStageCompletionCriteria;
    /**
     * Gets next stage in lifecycle.
     * @private
     */
    private getNextStage;
    /**
     * Estimates matriculation date based on current progress.
     * @private
     */
    private estimateMatriculationDate;
    /**
     * Gets remaining stages in lifecycle.
     * @private
     */
    private getRemainingStages;
}
export default EnrollmentLifecycleCompositeService;
//# sourceMappingURL=student-enrollment-lifecycle-composite.d.ts.map