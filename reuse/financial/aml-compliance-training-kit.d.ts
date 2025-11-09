/**
 * AML Compliance Training Kit
 * Enterprise-grade functions for managing Anti-Money Laundering compliance training,
 * certifications, assessments, and regulatory compliance tracking.
 *
 * Stack: TypeScript, Sequelize ORM, NestJS
 * Features: 40 comprehensive functions covering training management, assessments,
 * certifications, analytics, and regulatory compliance
 *
 * @module aml-compliance-training-kit
 * @version 1.0.0
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Training content types and proficiency levels
 */
export declare enum TrainingContentType {
    MODULE = "module",
    VIDEO = "video",
    DOCUMENT = "document",
    INTERACTIVE = "interactive",
    CASE_STUDY = "case_study"
}
/**
 * Proficiency levels for training assessment
 */
export declare enum ProficiencyLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
    EXPERT = "expert"
}
/**
 * Training delivery methods
 */
export declare enum DeliveryMethod {
    SELF_PACED = "self_paced",
    INSTRUCTOR_LED = "instructor_led",
    BLENDED = "blended",
    VIRTUAL = "virtual"
}
/**
 * Regulatory framework types for compliance mapping
 */
export declare enum RegulatoryFramework {
    AML_ACT = "aml_act",
    BSA = "bsa",
    OFAC = "ofac",
    KYC = "kyc",
    SANCTIONS = "sanctions",
    FATCA = "fatca",
    CRS = "crs",
    GDPR = "gdpr"
}
/**
 * Training role types for role-based assignment
 */
export declare enum TrainingRole {
    COMPLIANCE_OFFICER = "compliance_officer",
    CUSTOMER_SERVICE = "customer_service",
    LOAN_OFFICER = "loan_officer",
    TELLER = "teller",
    SENIOR_MANAGEMENT = "senior_management",
    EXECUTIVE = "executive",
    VENDOR = "vendor",
    NEW_HIRE = "new_hire"
}
/**
 * Assessment result types
 */
export declare enum AssessmentStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    PASSED = "passed"
}
/**
 * Certification states
 */
export declare enum CertificationStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    EXPIRED = "expired",
    ACTIVE = "active",
    REVOKED = "revoked"
}
/**
 * Training content interface
 */
export interface TrainingContent {
    id: string;
    title: string;
    description: string;
    type: TrainingContentType;
    contentUrl?: string;
    duration: number;
    difficultyLevel: ProficiencyLevel;
    regulatoryFrameworks: RegulatoryFramework[];
    createdAt: Date;
    updatedAt: Date;
    version: number;
}
/**
 * Training course interface
 */
export interface TrainingCourse {
    id: string;
    name: string;
    description: string;
    deliveryMethod: DeliveryMethod;
    requiredRole: TrainingRole;
    contentIds: string[];
    passingScore: number;
    duration: number;
    recertificationIntervalDays: number;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * User training progress interface
 */
export interface TrainingProgress {
    id: string;
    userId: string;
    courseId: string;
    completedContentIds: string[];
    completionPercentage: number;
    startDate: Date;
    completionDate?: Date;
    status: AssessmentStatus;
}
/**
 * Assessment/quiz interface
 */
export interface Assessment {
    id: string;
    courseId: string;
    questions: AssessmentQuestion[];
    timeLimit: number;
    passingScore: number;
    createdAt: Date;
}
/**
 * Assessment question interface
 */
export interface AssessmentQuestion {
    id: string;
    assessmentId: string;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    weight: number;
    explanation: string;
}
/**
 * User assessment result interface
 */
export interface AssessmentResult {
    id: string;
    userId: string;
    assessmentId: string;
    score: number;
    answers: UserAnswer[];
    status: AssessmentStatus;
    completedAt: Date;
}
/**
 * User answer interface
 */
export interface UserAnswer {
    questionId: string;
    selectedAnswerIndex: number;
    isCorrect: boolean;
}
/**
 * Certification interface
 */
export interface Certification {
    id: string;
    userId: string;
    courseId: string;
    certificateNumber: string;
    issuanceDate: Date;
    expiryDate: Date;
    status: CertificationStatus;
    verificationCode: string;
}
/**
 * Compliance attestation interface
 */
export interface ComplianceAttestation {
    id: string;
    userId: string;
    attestationDate: Date;
    regulatoryFrameworks: RegulatoryFramework[];
    acknowledgmentText: string;
    signatureRequired: boolean;
    signatureDate?: Date;
    expiryDate: Date;
}
/**
 * Training schedule interface
 */
export interface TrainingSchedule {
    id: string;
    courseId: string;
    instructorId?: string;
    scheduledDate: Date;
    duration: number;
    location?: string;
    maxParticipants: number;
    registeredCount: number;
    deliveryMethod: DeliveryMethod;
}
/**
 * Training reminder interface
 */
export interface TrainingReminder {
    id: string;
    userId: string;
    courseId: string;
    reminderType: 'overdue' | 'approaching_deadline' | 'recertification';
    sentDate: Date;
    dueDate: Date;
    acknowledged: boolean;
}
/**
 * Training analytics interface
 */
export interface TrainingAnalytics {
    totalEnrolled: number;
    completedCount: number;
    failedCount: number;
    averageCompletionTime: number;
    averageScore: number;
    completionRate: number;
    certificationsIssued: number;
    certificationsExpired: number;
    noncompliantUsers: number;
}
/**
 * Learning path interface
 */
export interface LearningPath {
    id: string;
    name: string;
    description: string;
    requiredRole: TrainingRole;
    courseIds: string[];
    sequentialOrder: boolean;
    estimatedDuration: number;
    competencies: string[];
}
/**
 * Quiz interface
 */
export interface Quiz {
    id: string;
    contentId: string;
    title: string;
    questions: QuizQuestion[];
    passingPercentage: number;
    timeLimit: number;
}
/**
 * Quiz question interface
 */
export interface QuizQuestion {
    id: string;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    difficulty: ProficiencyLevel;
}
/**
 * Training record interface
 */
export interface TrainingRecord {
    id: string;
    userId: string;
    courseName: string;
    completionDate: Date;
    score: number;
    certificateNumber?: string;
    certificateUrl?: string;
    expiryDate?: Date;
    courseId: string;
}
/**
 * Dashboard metrics interface
 */
export interface DashboardMetrics {
    activeTrainings: number;
    pendingAssignments: number;
    overdueTrainings: number;
    certificationsExpiringSoon: number;
    averageCompletionRate: number;
    complianceGapCount: number;
    lastUpdated: Date;
}
/**
 * Role-based training mapping
 */
export interface RoleBasedTraining {
    role: TrainingRole;
    mandatoryCourses: string[];
    recommendedCourses: string[];
    frequencyMonths: number;
}
/**
 * Recertification requirement interface
 */
export interface RecertificationRequirement {
    courseId: string;
    requiredEveryDays: number;
    gracePeriodDays: number;
    lastRecertificationDate?: Date;
    nextDueDate: Date;
}
/**
 * Training effectiveness metrics
 */
export interface TrainingEffectiveness {
    courseId: string;
    comprehensionScore: number;
    retentionRate: number;
    applicationScore: number;
    satisfactionScore: number;
    overallEffectiveness: number;
}
/**
 * AML Compliance Training Kit Service
 * Provides 40 enterprise-grade functions for comprehensive training management
 */
export declare class AmlComplianceTrainingKit {
    private readonly sequelize;
    private readonly logger;
    constructor(sequelize: Sequelize);
    /**
     * Creates a new training content module
     * @param content Training content data
     * @param transaction Optional transaction context
     * @returns Created training content
     */
    createTrainingContent(content: Omit<TrainingContent, 'id' | 'createdAt' | 'updatedAt' | 'version'>, transaction?: Transaction): Promise<TrainingContent>;
    /**
     * Updates existing training content
     * @param contentId Content identifier
     * @param updates Partial updates
     * @param transaction Optional transaction context
     * @returns Updated training content
     */
    updateTrainingContent(contentId: string, updates: Partial<Omit<TrainingContent, 'id' | 'createdAt'>>, transaction?: Transaction): Promise<TrainingContent>;
    /**
     * Retrieves training content by ID
     * @param contentId Content identifier
     * @returns Training content or null
     */
    getTrainingContent(contentId: string): Promise<TrainingContent | null>;
    /**
     * Lists all training content with filtering
     * @param filters Optional filtering criteria
     * @returns Array of training content
     */
    listTrainingContent(filters?: {
        type?: TrainingContentType;
        difficultyLevel?: ProficiencyLevel;
        framework?: RegulatoryFramework;
    }): Promise<TrainingContent[]>;
    /**
     * Deletes training content
     * @param contentId Content identifier
     * @param transaction Optional transaction context
     * @returns Deletion success status
     */
    deleteTrainingContent(contentId: string, transaction?: Transaction): Promise<boolean>;
    /**
     * Creates a training course
     * @param course Course data
     * @param transaction Optional transaction context
     * @returns Created course
     */
    createTrainingCourse(course: Omit<TrainingCourse, 'id' | 'createdAt' | 'updatedAt'>, transaction?: Transaction): Promise<TrainingCourse>;
    /**
     * Assigns course to individual user
     * @param userId User identifier
     * @param courseId Course identifier
     * @param dueDate Optional deadline
     * @param transaction Optional transaction context
     * @returns Assignment confirmation
     */
    assignCourseToUser(userId: string, courseId: string, dueDate?: Date, transaction?: Transaction): Promise<{
        assignmentId: string;
        userId: string;
        courseId: string;
    }>;
    /**
     * Bulk assigns course to multiple users (batch assignment)
     * @param userIds User identifiers
     * @param courseId Course identifier
     * @param dueDate Optional deadline
     * @param transaction Optional transaction context
     * @returns Array of assignment results
     */
    assignCourseToUserBatch(userIds: string[], courseId: string, dueDate?: Date, transaction?: Transaction): Promise<Array<{
        assignmentId: string;
        userId: string;
        status: string;
    }>>;
    /**
     * Assigns courses based on user role
     * @param role Training role
     * @param userIds User identifiers to assign
     * @param transaction Optional transaction context
     * @returns Assignment results with course details
     */
    assignCoursesByRole(role: TrainingRole, userIds: string[], transaction?: Transaction): Promise<Array<{
        userId: string;
        assignedCourses: string[];
    }>>;
    /**
     * Updates course assignment
     * @param assignmentId Assignment identifier
     * @param updates Partial updates
     * @param transaction Optional transaction context
     * @returns Updated assignment
     */
    updateCourseAssignment(assignmentId: string, updates: {
        dueDate?: Date;
        status?: string;
    }, transaction?: Transaction): Promise<{
        assignmentId: string;
        updated: boolean;
    }>;
    /**
     * Retrieves user's training progress
     * @param userId User identifier
     * @param courseId Optional course filter
     * @returns Training progress data
     */
    getTrainingProgress(userId: string, courseId?: string): Promise<TrainingProgress | TrainingProgress[]>;
    /**
     * Updates user's progress on a content module
     * @param userId User identifier
     * @param courseId Course identifier
     * @param contentId Content module identifier
     * @param transaction Optional transaction context
     * @returns Updated progress
     */
    updateProgressOnContent(userId: string, courseId: string, contentId: string, transaction?: Transaction): Promise<{
        progressId: string;
        completionPercentage: number;
    }>;
    /**
     * Calculates completion percentage for user course
     * @param userId User identifier
     * @param courseId Course identifier
     * @returns Completion percentage
     */
    calculateCompletionPercentage(userId: string, courseId: string): Promise<number>;
    /**
     * Tracks training start for user
     * @param userId User identifier
     * @param courseId Course identifier
     * @param transaction Optional transaction context
     * @returns Start tracking result
     */
    trackTrainingStart(userId: string, courseId: string, transaction?: Transaction): Promise<{
        progressId: string;
        startDate: Date;
    }>;
    /**
     * Marks training as completed
     * @param userId User identifier
     * @param courseId Course identifier
     * @param transaction Optional transaction context
     * @returns Completion record
     */
    markTrainingCompleted(userId: string, courseId: string, transaction?: Transaction): Promise<{
        progressId: string;
        completionDate: Date;
        status: string;
    }>;
    /**
     * Creates an assessment/exam for a course
     * @param assessment Assessment data
     * @param transaction Optional transaction context
     * @returns Created assessment
     */
    createAssessment(assessment: Omit<Assessment, 'id' | 'createdAt'>, transaction?: Transaction): Promise<Assessment>;
    /**
     * Submits user answers for assessment
     * @param userId User identifier
     * @param assessmentId Assessment identifier
     * @param answers User answers
     * @param transaction Optional transaction context
     * @returns Assessment result with scoring
     */
    submitAssessment(userId: string, assessmentId: string, answers: UserAnswer[], transaction?: Transaction): Promise<AssessmentResult>;
    /**
     * Retrieves assessment questions
     * @param assessmentId Assessment identifier
     * @returns Assessment questions with options
     */
    getAssessmentQuestions(assessmentId: string): Promise<AssessmentQuestion[]>;
    /**
     * Retrieves user assessment result
     * @param userId User identifier
     * @param assessmentId Assessment identifier
     * @returns User's assessment result
     */
    getUserAssessmentResult(userId: string, assessmentId: string): Promise<AssessmentResult | null>;
    /**
     * Issues certification to user upon course completion
     * @param userId User identifier
     * @param courseId Course identifier
     * @param transaction Optional transaction context
     * @returns Issued certification
     */
    issueCertification(userId: string, courseId: string, transaction?: Transaction): Promise<Certification>;
    /**
     * Retrieves user certification
     * @param userId User identifier
     * @param courseId Optional course filter
     * @returns User's certifications
     */
    getUserCertifications(userId: string, courseId?: string): Promise<Certification[]>;
    /**
     * Verifies certification authenticity using verification code
     * @param certificateNumber Certificate number
     * @param verificationCode Verification code
     * @returns Verification result
     */
    verifyCertification(certificateNumber: string, verificationCode: string): Promise<{
        valid: boolean;
        certification?: Certification;
    }>;
    /**
     * Renews expiring certification
     * @param certificationId Certification identifier
     * @param transaction Optional transaction context
     * @returns Renewed certification
     */
    renewCertification(certificationId: string, transaction?: Transaction): Promise<Certification>;
    /**
     * Revokes certification
     * @param certificationId Certification identifier
     * @param reason Revocation reason
     * @param transaction Optional transaction context
     * @returns Revocation result
     */
    revokeCertification(certificationId: string, reason: string, transaction?: Transaction): Promise<{
        revoked: boolean;
        certificationId: string;
        revokedAt: Date;
    }>;
    /**
     * Creates compliance attestation for user
     * @param userId User identifier
     * @param frameworks Regulatory frameworks
     * @param transaction Optional transaction context
     * @returns Created attestation
     */
    createComplianceAttestation(userId: string, frameworks: RegulatoryFramework[], transaction?: Transaction): Promise<ComplianceAttestation>;
    /**
     * Records user attestation signature/acknowledgment
     * @param attestationId Attestation identifier
     * @param transaction Optional transaction context
     * @returns Signed attestation
     */
    signAttestation(attestationId: string, transaction?: Transaction): Promise<ComplianceAttestation>;
    /**
     * Schedules training session
     * @param courseId Course identifier
     * @param schedule Schedule details
     * @param transaction Optional transaction context
     * @returns Created schedule
     */
    scheduleTrainingSession(courseId: string, schedule: Omit<TrainingSchedule, 'id'>, transaction?: Transaction): Promise<TrainingSchedule>;
    /**
     * Registers user for scheduled training session
     * @param userId User identifier
     * @param scheduleId Schedule identifier
     * @param transaction Optional transaction context
     * @returns Registration confirmation
     */
    registerForTrainingSession(userId: string, scheduleId: string, transaction?: Transaction): Promise<{
        registrationId: string;
        userId: string;
        scheduleId: string;
    }>;
    /**
     * Sends training reminders to users
     * @param filters Filtering criteria for reminding users
     * @param transaction Optional transaction context
     * @returns Reminder sending statistics
     */
    sendTrainingReminders(filters: {
        reminderType: 'overdue' | 'approaching_deadline' | 'recertification';
        daysThreshold?: number;
    }, transaction?: Transaction): Promise<{
        sentCount: number;
        failedCount: number;
    }>;
    /**
     * Verifies training completion requirements met
     * @param userId User identifier
     * @param courseId Course identifier
     * @returns Verification result with details
     */
    verifyTrainingCompletion(userId: string, courseId: string): Promise<{
        completed: boolean;
        contentCompleted: boolean;
        assessmentPassed: boolean;
        attestationSigned: boolean;
    }>;
    /**
     * Generates training analytics for course
     * @param courseId Course identifier
     * @param dateRange Date range for analysis
     * @returns Analytics metrics
     */
    getTrainingAnalytics(courseId: string, dateRange?: {
        startDate: Date;
        endDate: Date;
    }): Promise<TrainingAnalytics>;
    /**
     * Assesses training effectiveness
     * @param courseId Course identifier
     * @returns Effectiveness metrics
     */
    assessTrainingEffectiveness(courseId: string): Promise<TrainingEffectiveness>;
    /**
     * Retrieves dashboard metrics for training program
     * @returns Dashboard metrics
     */
    getDashboardMetrics(): Promise<DashboardMetrics>;
    /**
     * Generates training completion report
     * @param filters Report filtering options
     * @returns Detailed completion report
     */
    generateCompletionReport(filters?: {
        departmentId?: string;
        role?: TrainingRole;
        dateRange?: {
            startDate: Date;
            endDate: Date;
        };
    }): Promise<Array<{
        userId: string;
        records: TrainingRecord[];
    }>>;
    /**
     * Creates learning path for role-based progression
     * @param path Learning path data
     * @param transaction Optional transaction context
     * @returns Created learning path
     */
    createLearningPath(path: Omit<LearningPath, 'id'>, transaction?: Transaction): Promise<LearningPath>;
    /**
     * Maps course to regulatory requirements
     * @param courseId Course identifier
     * @param frameworks Regulatory frameworks
     * @param mappingDetails Detailed mapping information
     * @param transaction Optional transaction context
     * @returns Mapping configuration
     */
    mapCourseToRegulations(courseId: string, frameworks: RegulatoryFramework[], mappingDetails: Record<string, string>, transaction?: Transaction): Promise<{
        courseId: string;
        frameworks: RegulatoryFramework[];
        mapped: boolean;
    }>;
    /**
     * Identifies and assigns recertification training for expiring certifications
     * @param gracePeriodDays Days before expiry to notify
     * @param transaction Optional transaction context
     * @returns Recertification assignments
     */
    processAnnualRecertification(gracePeriodDays?: number, transaction?: Transaction): Promise<Array<{
        userId: string;
        courseId: string;
        assigned: boolean;
    }>>;
    /**
     * Manages quiz/knowledge checks within training modules
     * @param quiz Quiz data
     * @param transaction Optional transaction context
     * @returns Created quiz
     */
    createQuiz(quiz: Omit<Quiz, 'id'>, transaction?: Transaction): Promise<Quiz>;
    /**
     * Identifies users with compliance gaps and creates targeted training assignments
     * @param transaction Optional transaction context
     * @returns Compliance gap report with assignments
     */
    identifyAndAssignComplianceGaps(transaction?: Transaction): Promise<Array<{
        userId: string;
        gapsCovered: string[];
    }>>;
    /**
     * Generates unique identifier with prefix
     * @param prefix Identifier prefix
     * @returns Generated identifier
     */
    private generateId;
    /**
     * Generates certificate number
     * @returns Certificate number
     */
    private generateCertificateNumber;
    /**
     * Generates verification code for certificate
     * @returns Verification code
     */
    private generateVerificationCode;
    /**
     * Calculates score from assessment answers
     * @param answers User answers
     * @returns Calculated score
     */
    private calculateScore;
    /**
     * Gets standard attestation text for regulatory frameworks
     * @param frameworks Regulatory frameworks
     * @returns Formatted attestation text
     */
    private getStandardAttestationText;
}
/**
 * Role-based training mappings
 */
export declare const ROLE_BASED_TRAINING_MAP: Record<TrainingRole, RoleBasedTraining>;
/**
 * Regulatory framework requirement mappings
 */
export declare const FRAMEWORK_REQUIREMENTS: Record<RegulatoryFramework, string[]>;
export default AmlComplianceTrainingKit;
//# sourceMappingURL=aml-compliance-training-kit.d.ts.map