/**
 * @fileoverview Advising Management Kit - Comprehensive academic advising system
 * @module reuse/education/advising-management-kit
 * @description Complete advising management system with NestJS services, Sequelize models,
 * advisor assignment, advising sessions, early alert system, academic probation tracking,
 * and graduation planning. Implements proper dependency injection, business logic separation,
 * and service layer architecture patterns.
 *
 * Key Features:
 * - Comprehensive Sequelize models for advising domain
 * - Advisor-advisee assignment and management
 * - Advising session scheduling and tracking
 * - Advising notes with search and categorization
 * - Early alert system for at-risk students
 * - Academic probation advising workflows
 * - Graduation planning and degree audit integration
 * - NestJS services with constructor injection
 * - Repository pattern implementation
 * - Business logic separation and layering
 * - FERPA-compliant audit logging
 * - Request-scoped and transient provider patterns
 *
 * @target NestJS 10.x, Sequelize v6.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - FERPA compliance for student data access
 * - Role-based access control for advising records
 * - Audit logging for all advising interactions
 * - Data encryption for sensitive advising notes
 * - Input sanitization and validation
 * - SQL injection prevention
 * - XSS protection in text fields
 *
 * @example Basic service usage
 * ```typescript
 * import { AdvisingService } from './advising-management-kit';
 *
 * @Controller('advising')
 * export class AdvisingController {
 *   constructor(private readonly advisingService: AdvisingService) {}
 *
 *   @Post('assign')
 *   async assignAdvisor(@Body() dto: AssignAdvisorDto) {
 *     return this.advisingService.assignAdvisorToStudent(
 *       dto.advisorId,
 *       dto.studentId,
 *       dto.advisorType
 *     );
 *   }
 * }
 * ```
 *
 * @example Early alert system
 * ```typescript
 * const earlyAlert = await earlyAlertService.createEarlyAlert({
 *   studentId: 'student-123',
 *   alertType: 'ACADEMIC_PERFORMANCE',
 *   severity: 'HIGH',
 *   description: 'Student failing multiple courses',
 *   courseIds: ['course-1', 'course-2']
 * });
 * ```
 *
 * LOC: EDU-ADV-001
 * UPSTREAM: sequelize, @nestjs/common, @nestjs/sequelize
 * DOWNSTREAM: student-services, academic-planning, reporting-services
 *
 * @version 1.0.0
 * @since 2025-11-09
 */
import { Model, ModelStatic, Sequelize } from 'sequelize';
import { Request } from 'express';
/**
 * Advisor types in the system
 */
export declare enum AdvisorType {
    ACADEMIC = "ACADEMIC",
    FACULTY = "FACULTY",
    CAREER = "CAREER",
    PEER = "PEER",
    ATHLETIC = "ATHLETIC"
}
/**
 * Advising session status
 */
export declare enum AdvisingSessionStatus {
    SCHEDULED = "SCHEDULED",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    NO_SHOW = "NO_SHOW",
    RESCHEDULED = "RESCHEDULED"
}
/**
 * Advising session types
 */
export declare enum AdvisingSessionType {
    INITIAL = "INITIAL",
    REGULAR = "REGULAR",
    ACADEMIC_PLANNING = "ACADEMIC_PLANNING",
    REGISTRATION = "REGISTRATION",
    PROBATION = "PROBATION",
    GRADUATION = "GRADUATION",
    CRISIS = "CRISIS"
}
/**
 * Early alert types
 */
export declare enum EarlyAlertType {
    ACADEMIC_PERFORMANCE = "ACADEMIC_PERFORMANCE",
    ATTENDANCE = "ATTENDANCE",
    ENGAGEMENT = "ENGAGEMENT",
    FINANCIAL = "FINANCIAL",
    PERSONAL = "PERSONAL",
    HEALTH = "HEALTH"
}
/**
 * Alert severity levels
 */
export declare enum AlertSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * Academic standing status
 */
export declare enum AcademicStanding {
    GOOD_STANDING = "GOOD_STANDING",
    ACADEMIC_WARNING = "ACADEMIC_WARNING",
    ACADEMIC_PROBATION = "ACADEMIC_PROBATION",
    ACADEMIC_SUSPENSION = "ACADEMIC_SUSPENSION",
    ACADEMIC_DISMISSAL = "ACADEMIC_DISMISSAL"
}
/**
 * Graduation plan status
 */
export declare enum GraduationPlanStatus {
    DRAFT = "DRAFT",
    IN_PROGRESS = "IN_PROGRESS",
    ADVISOR_APPROVED = "ADVISOR_APPROVED",
    DEPARTMENT_APPROVED = "DEPARTMENT_APPROVED",
    COMPLETED = "COMPLETED"
}
/**
 * Note categories
 */
export declare enum NoteCategory {
    ACADEMIC = "ACADEMIC",
    PERSONAL = "PERSONAL",
    CAREER = "CAREER",
    REGISTRATION = "REGISTRATION",
    PROBATION = "PROBATION",
    GRADUATION = "GRADUATION",
    GENERAL = "GENERAL"
}
interface AdvisorAttributes {
    id: string;
    userId: string;
    advisorType: AdvisorType;
    department?: string;
    maxAdvisees?: number;
    specializations?: string[];
    isActive: boolean;
    availabilitySchedule?: object;
    officeLocation?: string;
    contactEmail?: string;
    contactPhone?: string;
    metadata?: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
interface AdviseeAttributes {
    id: string;
    studentId: string;
    advisorId: string;
    advisorType: AdvisorType;
    isPrimary: boolean;
    assignedAt: Date;
    assignedBy?: string;
    unassignedAt?: Date;
    unassignedBy?: string;
    unassignedReason?: string;
    metadata?: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
interface AdvisingSessionAttributes {
    id: string;
    adviseeId: string;
    advisorId: string;
    studentId: string;
    sessionType: AdvisingSessionType;
    status: AdvisingSessionStatus;
    scheduledAt: Date;
    duration: number;
    location?: string;
    meetingLink?: string;
    agenda?: string;
    summary?: string;
    outcomes?: string[];
    actionItems?: object[];
    followUpRequired: boolean;
    followUpDate?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    noShowAt?: Date;
    metadata?: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
interface AdvisingNoteAttributes {
    id: string;
    adviseeId: string;
    advisorId: string;
    studentId: string;
    sessionId?: string;
    category: NoteCategory;
    subject: string;
    content: string;
    isConfidential: boolean;
    tags?: string[];
    attachments?: object[];
    sharedWith?: string[];
    metadata?: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
interface EarlyAlertAttributes {
    id: string;
    studentId: string;
    advisorId?: string;
    reportedBy: string;
    alertType: EarlyAlertType;
    severity: AlertSeverity;
    description: string;
    courseIds?: string[];
    detectedAt: Date;
    acknowledgedAt?: Date;
    acknowledgedBy?: string;
    resolvedAt?: Date;
    resolvedBy?: string;
    resolution?: string;
    followUpActions?: object[];
    escalatedTo?: string;
    metadata?: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
interface GraduationPlanAttributes {
    id: string;
    studentId: string;
    advisorId: string;
    programId: string;
    expectedGraduationTerm: string;
    status: GraduationPlanStatus;
    plannedCourses: object[];
    completedCourses: object[];
    remainingRequirements: object[];
    totalCreditsRequired: number;
    creditsCompleted: number;
    creditsInProgress: number;
    creditsRemaining: number;
    milestones?: object[];
    advisorApprovedAt?: Date;
    advisorApprovedBy?: string;
    departmentApprovedAt?: Date;
    departmentApprovedBy?: string;
    lastReviewedAt?: Date;
    metadata?: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
interface AssignAdvisorOptions {
    advisorId: string;
    studentId: string;
    advisorType: AdvisorType;
    isPrimary?: boolean;
    assignedBy?: string;
    metadata?: object;
}
interface CreateSessionOptions {
    adviseeId: string;
    advisorId: string;
    studentId: string;
    sessionType: AdvisingSessionType;
    scheduledAt: Date;
    duration: number;
    location?: string;
    meetingLink?: string;
    agenda?: string;
}
interface CreateNoteOptions {
    adviseeId: string;
    advisorId: string;
    studentId: string;
    sessionId?: string;
    category: NoteCategory;
    subject: string;
    content: string;
    isConfidential?: boolean;
    tags?: string[];
}
interface CreateEarlyAlertOptions {
    studentId: string;
    reportedBy: string;
    alertType: EarlyAlertType;
    severity: AlertSeverity;
    description: string;
    courseIds?: string[];
    advisorId?: string;
}
interface CreateProbationOptions {
    studentId: string;
    standing: AcademicStanding;
    termId: string;
    gpa: number;
    creditsAttempted: number;
    creditsEarned: number;
    advisorId?: string;
    improvementPlan?: object;
}
interface CreateGraduationPlanOptions {
    studentId: string;
    advisorId: string;
    programId: string;
    expectedGraduationTerm: string;
    totalCreditsRequired: number;
}
interface AdvisorSearchCriteria {
    advisorType?: AdvisorType;
    department?: string;
    isActive?: boolean;
    specializations?: string[];
}
interface SessionSearchCriteria {
    advisorId?: string;
    studentId?: string;
    sessionType?: AdvisingSessionType;
    status?: AdvisingSessionStatus;
    startDate?: Date;
    endDate?: Date;
}
interface NoteSearchCriteria {
    studentId?: string;
    advisorId?: string;
    category?: NoteCategory;
    isConfidential?: boolean;
    tags?: string[];
    searchText?: string;
}
/**
 * 1. Creates the Advisor Sequelize model with comprehensive attributes.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Advisor model
 *
 * @example
 * const Advisor = createAdvisorModel(sequelize);
 * const advisor = await Advisor.create({
 *   userId: 'user-123',
 *   advisorType: AdvisorType.ACADEMIC,
 *   department: 'Computer Science',
 *   maxAdvisees: 30,
 *   isActive: true
 * });
 */
export declare function createAdvisorModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 2. Creates the Advisee (advisor-student assignment) Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Advisee model
 *
 * @example
 * const Advisee = createAdviseeModel(sequelize);
 * const assignment = await Advisee.create({
 *   studentId: 'student-123',
 *   advisorId: 'advisor-456',
 *   advisorType: AdvisorType.ACADEMIC,
 *   isPrimary: true,
 *   assignedAt: new Date()
 * });
 */
export declare function createAdviseeModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 3. Creates the AdvisingSession Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} AdvisingSession model
 *
 * @example
 * const AdvisingSession = createAdvisingSessionModel(sequelize);
 * const session = await AdvisingSession.create({
 *   adviseeId: 'advisee-123',
 *   advisorId: 'advisor-456',
 *   studentId: 'student-789',
 *   sessionType: AdvisingSessionType.REGULAR,
 *   status: AdvisingSessionStatus.SCHEDULED,
 *   scheduledAt: new Date('2025-11-15T10:00:00'),
 *   duration: 30
 * });
 */
export declare function createAdvisingSessionModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 4. Creates the AdvisingNote Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} AdvisingNote model
 *
 * @example
 * const AdvisingNote = createAdvisingNoteModel(sequelize);
 * const note = await AdvisingNote.create({
 *   adviseeId: 'advisee-123',
 *   advisorId: 'advisor-456',
 *   studentId: 'student-789',
 *   category: NoteCategory.ACADEMIC,
 *   subject: 'Course selection discussion',
 *   content: 'Discussed fall semester course options',
 *   isConfidential: false
 * });
 */
export declare function createAdvisingNoteModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 5. Creates the EarlyAlert Sequelize model for at-risk student identification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} EarlyAlert model
 *
 * @example
 * const EarlyAlert = createEarlyAlertModel(sequelize);
 * const alert = await EarlyAlert.create({
 *   studentId: 'student-123',
 *   reportedBy: 'faculty-456',
 *   alertType: EarlyAlertType.ACADEMIC_PERFORMANCE,
 *   severity: AlertSeverity.HIGH,
 *   description: 'Student failing midterm exams',
 *   detectedAt: new Date()
 * });
 */
export declare function createEarlyAlertModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 6. Creates the AcademicProbation Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} AcademicProbation model
 *
 * @example
 * const AcademicProbation = createAcademicProbationModel(sequelize);
 * const probation = await AcademicProbation.create({
 *   studentId: 'student-123',
 *   standing: AcademicStanding.ACADEMIC_PROBATION,
 *   termId: 'fall-2025',
 *   gpa: 1.8,
 *   creditsAttempted: 30,
 *   creditsEarned: 24,
 *   probationStartDate: new Date()
 * });
 */
export declare function createAcademicProbationModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 7. Creates the GraduationPlan Sequelize model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} GraduationPlan model
 *
 * @example
 * const GraduationPlan = createGraduationPlanModel(sequelize);
 * const plan = await GraduationPlan.create({
 *   studentId: 'student-123',
 *   advisorId: 'advisor-456',
 *   programId: 'program-789',
 *   expectedGraduationTerm: 'spring-2027',
 *   status: GraduationPlanStatus.IN_PROGRESS,
 *   totalCreditsRequired: 120
 * });
 */
export declare function createGraduationPlanModel(sequelize: Sequelize): ModelStatic<Model>;
/**
 * 8. Creates an AdvisorRepository service for data access layer.
 *
 * @param {ModelStatic<Model>} advisorModel - Advisor model
 * @returns {Injectable} AdvisorRepository service
 *
 * @example
 * const repository = new AdvisorRepository(Advisor);
 * const advisor = await repository.findById('advisor-123');
 */
export declare class AdvisorRepository {
    private readonly advisorModel;
    private readonly logger;
    constructor(advisorModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByUserId(userId: string): Promise<Model | null>;
    findActiveAdvisors(criteria?: AdvisorSearchCriteria): Promise<Model[]>;
    getAdviseeCount(advisorId: string): Promise<number>;
    create(data: Partial<AdvisorAttributes>): Promise<Model>;
    update(id: string, data: Partial<AdvisorAttributes>): Promise<Model>;
    delete(id: string): Promise<void>;
}
/**
 * 9. Creates an AdviseeRepository service for advisor-student assignments.
 *
 * @param {ModelStatic<Model>} adviseeModel - Advisee model
 * @returns {Injectable} AdviseeRepository service
 */
export declare class AdviseeRepository {
    private readonly adviseeModel;
    private readonly logger;
    constructor(adviseeModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByStudentId(studentId: string): Promise<Model[]>;
    findByAdvisorId(advisorId: string): Promise<Model[]>;
    findPrimaryAdvisor(studentId: string): Promise<Model | null>;
    create(data: Partial<AdviseeAttributes>): Promise<Model>;
    unassign(id: string, unassignedBy: string, reason?: string): Promise<Model>;
}
/**
 * 10. Creates an AdvisingSessionRepository service.
 *
 * @param {ModelStatic<Model>} sessionModel - AdvisingSession model
 * @returns {Injectable} AdvisingSessionRepository service
 */
export declare class AdvisingSessionRepository {
    private readonly sessionModel;
    private readonly logger;
    constructor(sessionModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByStudent(studentId: string, options?: SessionSearchCriteria): Promise<Model[]>;
    findUpcoming(advisorId: string, days?: number): Promise<Model[]>;
    create(data: Partial<AdvisingSessionAttributes>): Promise<Model>;
    update(id: string, data: Partial<AdvisingSessionAttributes>): Promise<Model>;
    complete(id: string, summary: string, outcomes: string[]): Promise<Model>;
    cancel(id: string, reason: string): Promise<Model>;
}
/**
 * 11. Creates an AdvisingNoteRepository service.
 *
 * @param {ModelStatic<Model>} noteModel - AdvisingNote model
 * @returns {Injectable} AdvisingNoteRepository service
 */
export declare class AdvisingNoteRepository {
    private readonly noteModel;
    private readonly logger;
    constructor(noteModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByStudent(studentId: string, criteria?: NoteSearchCriteria): Promise<Model[]>;
    create(data: Partial<AdvisingNoteAttributes>): Promise<Model>;
    update(id: string, data: Partial<AdvisingNoteAttributes>): Promise<Model>;
}
/**
 * 12. Creates an EarlyAlertRepository service.
 *
 * @param {ModelStatic<Model>} alertModel - EarlyAlert model
 * @returns {Injectable} EarlyAlertRepository service
 */
export declare class EarlyAlertRepository {
    private readonly alertModel;
    private readonly logger;
    constructor(alertModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findActiveAlerts(studentId: string): Promise<Model[]>;
    findUnacknowledgedAlerts(): Promise<Model[]>;
    create(data: Partial<EarlyAlertAttributes>): Promise<Model>;
    acknowledge(id: string, acknowledgedBy: string): Promise<Model>;
    resolve(id: string, resolvedBy: string, resolution: string): Promise<Model>;
}
/**
 * 13. Creates a GraduationPlanRepository service.
 *
 * @param {ModelStatic<Model>} planModel - GraduationPlan model
 * @returns {Injectable} GraduationPlanRepository service
 */
export declare class GraduationPlanRepository {
    private readonly planModel;
    private readonly logger;
    constructor(planModel: ModelStatic<Model>);
    findById(id: string): Promise<Model | null>;
    findByStudent(studentId: string): Promise<Model | null>;
    create(data: Partial<GraduationPlanAttributes>): Promise<Model>;
    update(id: string, data: Partial<GraduationPlanAttributes>): Promise<Model>;
    advisorApprove(id: string, approvedBy: string): Promise<Model>;
    departmentApprove(id: string, approvedBy: string): Promise<Model>;
}
/**
 * 14. Creates an AdvisingService with comprehensive business logic.
 *
 * @returns {Injectable} AdvisingService
 *
 * @example
 * const advisingService = new AdvisingService(...);
 * await advisingService.assignAdvisorToStudent({
 *   advisorId: 'advisor-123',
 *   studentId: 'student-456',
 *   advisorType: AdvisorType.ACADEMIC,
 *   isPrimary: true
 * });
 */
export declare class AdvisingService {
    private readonly advisorRepository;
    private readonly adviseeRepository;
    private readonly sessionRepository;
    private readonly logger;
    constructor(advisorRepository: AdvisorRepository, adviseeRepository: AdviseeRepository, sessionRepository: AdvisingSessionRepository);
    assignAdvisorToStudent(options: AssignAdvisorOptions): Promise<Model>;
    unassignAdvisor(adviseeId: string, unassignedBy: string, reason?: string): Promise<Model>;
    getStudentAdvisors(studentId: string): Promise<Model[]>;
    getAdvisorAdvisees(advisorId: string): Promise<Model[]>;
    reassignAdvisor(oldAdviseeId: string, newAdvisorId: string, reassignedBy: string, reason: string): Promise<Model>;
}
/**
 * 15. Creates an AdvisingSessionService for session management.
 *
 * @returns {Injectable} AdvisingSessionService
 */
export declare class AdvisingSessionService {
    private readonly sessionRepository;
    private readonly adviseeRepository;
    private readonly logger;
    constructor(sessionRepository: AdvisingSessionRepository, adviseeRepository: AdviseeRepository);
    scheduleSession(options: CreateSessionOptions): Promise<Model>;
    confirmSession(sessionId: string): Promise<Model>;
    completeSession(sessionId: string, summary: string, outcomes: string[], actionItems?: object[]): Promise<Model>;
    cancelSession(sessionId: string, reason: string): Promise<Model>;
    markNoShow(sessionId: string): Promise<Model>;
    rescheduleSession(sessionId: string, newScheduledAt: Date, duration?: number): Promise<Model>;
    getUpcomingSessions(advisorId: string, days?: number): Promise<Model[]>;
    getStudentSessions(studentId: string, criteria?: SessionSearchCriteria): Promise<Model[]>;
}
/**
 * 16. Creates an AdvisingNoteService for note management.
 *
 * @returns {Injectable} AdvisingNoteService
 */
export declare class AdvisingNoteService {
    private readonly noteRepository;
    private readonly adviseeRepository;
    private readonly logger;
    constructor(noteRepository: AdvisingNoteRepository, adviseeRepository: AdviseeRepository);
    createNote(options: CreateNoteOptions): Promise<Model>;
    updateNote(noteId: string, updates: Partial<AdvisingNoteAttributes>): Promise<Model>;
    getNoteById(noteId: string): Promise<Model>;
    searchNotes(studentId: string, criteria: NoteSearchCriteria): Promise<Model[]>;
    shareNote(noteId: string, userIds: string[]): Promise<Model>;
    deleteNote(noteId: string): Promise<void>;
}
/**
 * 17. Creates an EarlyAlertService for at-risk student intervention.
 *
 * @returns {Injectable} EarlyAlertService
 */
export declare class EarlyAlertService {
    private readonly alertRepository;
    private readonly adviseeRepository;
    private readonly logger;
    constructor(alertRepository: EarlyAlertRepository, adviseeRepository: AdviseeRepository);
    createEarlyAlert(options: CreateEarlyAlertOptions): Promise<Model>;
    acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<Model>;
    resolveAlert(alertId: string, resolvedBy: string, resolution: string): Promise<Model>;
    getActiveAlerts(studentId: string): Promise<Model[]>;
    getUnacknowledgedAlerts(): Promise<Model[]>;
    escalateAlert(alertId: string, escalatedTo: string): Promise<Model>;
    addFollowUpAction(alertId: string, action: {
        description: string;
        completedBy?: string;
        completedAt?: Date;
    }): Promise<Model>;
}
/**
 * 18. Creates an AcademicProbationService.
 *
 * @returns {Injectable} AcademicProbationService
 */
export declare class AcademicProbationService {
    private readonly probationModel;
    private readonly adviseeRepository;
    private readonly logger;
    constructor(probationModel: ModelStatic<Model>, adviseeRepository: AdviseeRepository);
    createProbation(options: CreateProbationOptions): Promise<Model>;
    updateImprovementPlan(probationId: string, plan: object): Promise<Model>;
    addProgressNote(probationId: string, note: {
        date: Date;
        note: string;
        addedBy: string;
    }): Promise<Model>;
    resolveProbation(probationId: string, requirementsMet: boolean, resolution: string): Promise<Model>;
}
/**
 * 19. Creates a GraduationPlanningService.
 *
 * @returns {Injectable} GraduationPlanningService
 */
export declare class GraduationPlanningService {
    private readonly planRepository;
    private readonly logger;
    constructor(planRepository: GraduationPlanRepository);
    createGraduationPlan(options: CreateGraduationPlanOptions): Promise<Model>;
    updatePlannedCourses(planId: string, courses: object[]): Promise<Model>;
    updateCredits(planId: string, credits: {
        completed: number;
        inProgress: number;
        remaining: number;
    }): Promise<Model>;
    advisorApprove(planId: string, approvedBy: string): Promise<Model>;
    departmentApprove(planId: string, approvedBy: string): Promise<Model>;
    addMilestone(planId: string, milestone: {
        name: string;
        targetDate: Date;
        description?: string;
    }): Promise<Model>;
}
/**
 * 20. Creates a RequestContextService for request-scoped user context.
 *
 * @returns {Injectable} RequestContextService with request scope
 */
export declare class RequestContextService {
    private readonly request;
    private _userId?;
    private _userRoles;
    private _requestId;
    private _ipAddress?;
    constructor(request: Request);
    get userId(): string | undefined;
    get userRoles(): string[];
    get requestId(): string;
    get ipAddress(): string | undefined;
    hasRole(role: string): boolean;
    isAuthorized(): boolean;
    private generateRequestId;
}
/**
 * 21. Validates advisor workload capacity.
 *
 * @param {number} currentAdvisees - Current advisee count
 * @param {number} maxAdvisees - Maximum allowed advisees
 * @returns {boolean} Whether advisor has capacity
 */
export declare function validateAdvisorCapacity(currentAdvisees: number, maxAdvisees: number): boolean;
/**
 * 22. Calculates advisor utilization percentage.
 *
 * @param {number} currentAdvisees - Current advisee count
 * @param {number} maxAdvisees - Maximum allowed advisees
 * @returns {number} Utilization percentage
 */
export declare function calculateAdvisorUtilization(currentAdvisees: number, maxAdvisees: number): number;
/**
 * 23. Determines alert priority based on severity and type.
 *
 * @param {AlertSeverity} severity - Alert severity
 * @param {EarlyAlertType} alertType - Alert type
 * @returns {number} Priority score (higher = more urgent)
 */
export declare function calculateAlertPriority(severity: AlertSeverity, alertType: EarlyAlertType): number;
/**
 * 24. Formats advising session duration for display.
 *
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export declare function formatSessionDuration(minutes: number): string;
/**
 * 25. Checks if a session is upcoming (within next 24 hours).
 *
 * @param {Date} scheduledAt - Session scheduled time
 * @returns {boolean} Whether session is upcoming
 */
export declare function isSessionUpcoming(scheduledAt: Date): boolean;
/**
 * 26. Sanitizes advising note content to prevent XSS.
 *
 * @param {string} content - Raw note content
 * @returns {string} Sanitized content
 */
export declare function sanitizeNoteContent(content: string): string;
/**
 * 27. Generates a default improvement plan template for academic probation.
 *
 * @param {AcademicStanding} standing - Academic standing level
 * @returns {object} Improvement plan template
 */
export declare function generateImprovementPlanTemplate(standing: AcademicStanding): object;
/**
 * 28. Creates an AuditService for FERPA-compliant logging.
 *
 * @returns {Injectable} AuditService
 */
export declare class AuditService {
    private readonly auditLogModel;
    private readonly requestContext;
    private readonly logger;
    constructor(auditLogModel: ModelStatic<Model>, requestContext: RequestContextService);
    logAccess(resource: string, resourceId: string, action: string): Promise<void>;
    logAdvisorAssignment(studentId: string, advisorId: string): Promise<void>;
    logSessionAccess(sessionId: string): Promise<void>;
    logNoteCreation(noteId: string, isConfidential: boolean): Promise<void>;
    logEarlyAlert(alertId: string, severity: AlertSeverity): Promise<void>;
}
/**
 * 29. Validates FERPA compliance for data access.
 *
 * @param {string[]} userRoles - User roles
 * @param {string} resourceType - Type of resource being accessed
 * @param {boolean} isConfidential - Whether resource is confidential
 * @returns {boolean} Whether access is allowed
 */
export declare function validateFERPAAccess(userRoles: string[], resourceType: string, isConfidential?: boolean): boolean;
/**
 * 30. Redacts sensitive information from advising notes based on user role.
 *
 * @param {string} content - Original note content
 * @param {string[]} userRoles - User roles
 * @returns {string} Redacted content
 */
export declare function redactSensitiveContent(content: string, userRoles: string[]): string;
/**
 * 31. Generates FERPA disclosure consent record.
 *
 * @param {string} studentId - Student ID
 * @param {string[]} authorizedUsers - User IDs authorized to access
 * @param {Date} expirationDate - When consent expires
 * @returns {object} Consent record
 */
export declare function generateFERPAConsent(studentId: string, authorizedUsers: string[], expirationDate: Date): object;
/**
 * 32. Validates data retention compliance for advising records.
 *
 * @param {Date} recordCreatedAt - When record was created
 * @param {number} retentionYears - Required retention period in years
 * @returns {boolean} Whether record is within retention period
 */
export declare function validateDataRetention(recordCreatedAt: Date, retentionYears?: number): boolean;
/**
 * 33. Encrypts confidential advising note content.
 *
 * @param {string} content - Plain text content
 * @param {string} encryptionKey - Encryption key
 * @returns {string} Encrypted content (placeholder - use actual crypto in production)
 */
export declare function encryptConfidentialContent(content: string, encryptionKey: string): string;
/**
 * 34. Decrypts confidential advising note content.
 *
 * @param {string} encryptedContent - Encrypted content
 * @param {string} encryptionKey - Encryption key
 * @returns {string} Decrypted content (placeholder - use actual crypto in production)
 */
export declare function decryptConfidentialContent(encryptedContent: string, encryptionKey: string): string;
/**
 * 35. Generates advisor workload report.
 *
 * @param {string} advisorId - Advisor ID
 * @param {Model[]} advisees - Advisee assignments
 * @param {Model[]} sessions - Recent sessions
 * @returns {object} Workload report
 */
export declare function generateAdvisorWorkloadReport(advisorId: string, advisees: Model[], sessions: Model[]): object;
/**
 * 36. Generates early alert summary for a time period.
 *
 * @param {Model[]} alerts - Early alerts
 * @returns {object} Alert summary
 */
export declare function generateEarlyAlertSummary(alerts: Model[]): object;
/**
 * 37. Calculates average alert resolution time in hours.
 *
 * @param {Model[]} alerts - Early alerts
 * @returns {number} Average resolution time in hours
 */
export declare function calculateAverageResolutionTime(alerts: Model[]): number;
/**
 * 38. Generates student advising engagement report.
 *
 * @param {string} studentId - Student ID
 * @param {Model[]} sessions - Advising sessions
 * @param {Model[]} notes - Advising notes
 * @returns {object} Engagement report
 */
export declare function generateStudentEngagementReport(studentId: string, sessions: Model[], notes: Model[]): object;
/**
 * 39. Identifies students needing advising intervention.
 *
 * @param {Model[]} students - Students with session data
 * @param {number} daysSinceLastSession - Threshold days
 * @returns {object[]} Students needing intervention
 */
export declare function identifyInterventionNeeded(students: Array<{
    id: string;
    lastSessionDate?: Date;
    activeAlerts: number;
}>, daysSinceLastSession?: number): object[];
/**
 * 40. Generates graduation plan progress report.
 *
 * @param {Model} plan - Graduation plan
 * @returns {object} Progress report
 */
export declare function generateGraduationProgressReport(plan: Model): object;
/**
 * 41. Calculates advisor performance metrics.
 *
 * @param {string} advisorId - Advisor ID
 * @param {object} workloadData - Workload statistics
 * @returns {object} Performance metrics
 */
export declare function calculateAdvisorPerformanceMetrics(advisorId: string, workloadData: {
    totalAdvisees: number;
    maxAdvisees: number;
    completedSessions: number;
    totalSessions: number;
    avgSessionDuration: number;
    studentSuccessRate: number;
}): object;
/**
 * 42. Creates a provider factory for Advisor model.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Provider} Model provider
 */
export declare function createAdvisorModelProvider(sequelize: Sequelize): Provider;
/**
 * 43. Creates a provider factory for all advising models.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Provider[]} Array of model providers
 */
export declare function createAdvisingModelProviders(sequelize: Sequelize): Provider[];
/**
 * 44. Creates advising module configuration with all providers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {object} Module configuration
 */
export declare function createAdvisingModuleConfig(sequelize: Sequelize): {
    providers: Provider[];
    exports: any[];
};
/**
 * 45. Creates a complete advising management dynamic module.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Module options
 * @returns {DynamicModule} NestJS dynamic module
 */
export declare function createAdvisingManagementModule(sequelize: Sequelize, options?: {
    isGlobal?: boolean;
}): any;
export {};
//# sourceMappingURL=advising-management-kit.d.ts.map