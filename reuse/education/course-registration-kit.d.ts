/**
 * LOC: EDUCREGIST001
 * File: /reuse/education/course-registration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../error-handling-kit.ts
 *   - ../validation-kit.ts
 *   - ../auditing-utils.ts
 *   - ./course-catalog-kit.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend education services
 *   - Registration controllers
 *   - Student services systems
 */
/**
 * File: /reuse/education/course-registration-kit.ts
 * Locator: WC-EDU-REGI-001
 * Purpose: Comprehensive Course Registration Management - Ellucian Banner/Colleague-level SIS functionality
 *
 * Upstream: Error handling, validation, auditing utilities, course catalog
 * Downstream: ../backend/*, Education controllers, registration services, student enrollment
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, class-validator 0.14.x
 * Exports: 45+ utility functions for registration, add/drop/swap, time tickets, holds, validation
 *
 * LLM Context: Enterprise-grade course registration system competing with Ellucian Banner/Colleague.
 * Provides complete registration lifecycle management, time tickets, registration periods, holds,
 * add/drop/swap functionality, concurrent enrollment, cross-registration, waitlist management,
 * registration errors and validation, prerequisites validation, capacity enforcement, registration
 * priority, degree audit integration, tuition calculation, registration permissions.
 */
import { Model, Sequelize, Transaction, Association, BelongsToGetAssociationMixin } from 'sequelize';
import { CourseSection } from './course-catalog-kit';
export declare enum RegistrationStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    REGISTERED = "REGISTERED",
    WAITLISTED = "WAITLISTED",
    DROPPED = "DROPPED",
    WITHDRAWN = "WITHDRAWN",
    CANCELLED = "CANCELLED",
    SWAPPED = "SWAPPED"
}
export declare enum RegistrationAction {
    ADD = "ADD",
    DROP = "DROP",
    SWAP = "SWAP",
    WITHDRAW = "WITHDRAW",
    CHANGE_GRADING_BASIS = "CHANGE_GRADING_BASIS",
    CHANGE_CREDIT_HOURS = "CHANGE_CREDIT_HOURS"
}
export declare enum HoldType {
    ACADEMIC = "ACADEMIC",
    FINANCIAL = "FINANCIAL",
    ADMINISTRATIVE = "ADMINISTRATIVE",
    DISCIPLINARY = "DISCIPLINARY",
    ADVISING = "ADVISING",
    HEALTH = "HEALTH",
    LIBRARY = "LIBRARY"
}
export declare enum HoldSeverity {
    INFORMATIONAL = "INFORMATIONAL",
    WARNING = "WARNING",
    REGISTRATION_BLOCK = "REGISTRATION_BLOCK",
    TRANSCRIPT_HOLD = "TRANSCRIPT_HOLD",
    DEGREE_HOLD = "DEGREE_HOLD"
}
export declare enum RegistrationPeriodType {
    EARLY_REGISTRATION = "EARLY_REGISTRATION",
    PRIORITY_REGISTRATION = "PRIORITY_REGISTRATION",
    OPEN_REGISTRATION = "OPEN_REGISTRATION",
    LATE_REGISTRATION = "LATE_REGISTRATION",
    ADD_DROP = "ADD_DROP",
    CLOSED = "CLOSED"
}
export declare enum WaitlistStatus {
    ACTIVE = "ACTIVE",
    PENDING_NOTIFICATION = "PENDING_NOTIFICATION",
    NOTIFIED = "NOTIFIED",
    EXPIRED = "EXPIRED",
    REGISTERED = "REGISTERED",
    REMOVED = "REMOVED"
}
export declare enum RegistrationErrorCode {
    PREREQUISITE_NOT_MET = "PREREQUISITE_NOT_MET",
    COREQUISITE_NOT_MET = "COREQUISITE_NOT_MET",
    SECTION_FULL = "SECTION_FULL",
    TIME_CONFLICT = "TIME_CONFLICT",
    DUPLICATE_COURSE = "DUPLICATE_COURSE",
    CREDIT_LIMIT_EXCEEDED = "CREDIT_LIMIT_EXCEEDED",
    REGISTRATION_HOLD = "REGISTRATION_HOLD",
    OUTSIDE_TIME_TICKET = "OUTSIDE_TIME_TICKET",
    ENROLLMENT_STATUS_INVALID = "ENROLLMENT_STATUS_INVALID",
    RESTRICTION_NOT_MET = "RESTRICTION_NOT_MET",
    CONCURRENT_ENROLLMENT_LIMIT = "CONCURRENT_ENROLLMENT_LIMIT"
}
export declare enum PriorityGroup {
    ATHLETES = "ATHLETES",
    HONORS = "HONORS",
    SENIORS = "SENIORS",
    JUNIORS = "JUNIORS",
    SOPHOMORES = "SOPHOMORES",
    FRESHMEN = "FRESHMEN",
    SPECIAL_PROGRAMS = "SPECIAL_PROGRAMS",
    DISABILITIES = "DISABILITIES",
    VETERANS = "VETERANS",
    GRADUATE = "GRADUATE"
}
export interface RegistrationValidationResult {
    valid: boolean;
    errors: Array<{
        code: RegistrationErrorCode;
        message: string;
        severity: 'ERROR' | 'WARNING' | 'INFO';
        details?: any;
    }>;
    warnings: string[];
}
export interface TimeTicket {
    studentId: number;
    termId: number;
    priorityGroup: PriorityGroup;
    registrationStart: Date;
    registrationEnd: Date;
    calculatedAt: Date;
}
export interface RegistrationCart {
    studentId: number;
    termId: number;
    sections: Array<{
        sectionId: number;
        creditHours: number;
        gradingBasis: string;
        action: RegistrationAction;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export interface ConcurrentEnrollment {
    homeInstitutionId: number;
    hostInstitutionId: number;
    studentId: number;
    termId: number;
    maxCreditHours: number;
    approvedBy?: string;
    approvalDate?: Date;
}
export declare class RegistrationPeriod extends Model {
    id: number;
    termId: number;
    termCode: string;
    periodType: RegistrationPeriodType;
    periodName: string;
    startDate: Date;
    endDate: Date;
    allowedStudentTypes?: string[];
    allowedClassLevels?: string[];
    allowedPrograms?: string[];
    maxCreditHours?: number;
    minCreditHours?: number;
    allowWaitlist: boolean;
    allowSwap: boolean;
    requireAdvisorApproval: boolean;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof RegistrationPeriod;
}
export declare class Registration extends Model {
    id: number;
    studentId: number;
    sectionId: number;
    termId: number;
    registrationStatus: RegistrationStatus;
    registrationDate: Date;
    droppedDate?: Date;
    withdrawnDate?: Date;
    creditHours: number;
    gradingBasis: string;
    registrationAction: RegistrationAction;
    registeredBy: string;
    advisorApproved: boolean;
    advisorApprovedBy?: string;
    advisorApprovedDate?: Date;
    lastAttendanceDate?: Date;
    grade?: string;
    gradePoints?: number;
    repeatCourse: boolean;
    repeatNumber?: number;
    auditCourse: boolean;
    concurrentEnrollment: boolean;
    crossRegistration: boolean;
    registrationFees?: number;
    tuitionAmount?: number;
    feesAmount?: number;
    notes?: string;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    getSection: BelongsToGetAssociationMixin<CourseSection>;
    static associations: {
        section: Association<Registration, CourseSection>;
    };
    static initModel(sequelize: Sequelize): typeof Registration;
}
export declare class RegistrationHold extends Model {
    id: number;
    studentId: number;
    holdType: HoldType;
    holdSeverity: HoldSeverity;
    holdReason: string;
    holdDescription?: string;
    effectiveDate: Date;
    expirationDate?: Date;
    releasedDate?: Date;
    releasedBy?: string;
    releasedReason?: string;
    blocksRegistration: boolean;
    blocksTranscripts: boolean;
    blocksDegree: boolean;
    departmentCode?: string;
    amountOwed?: number;
    contactInfo?: string;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof RegistrationHold;
}
export declare class RegistrationTimeTicket extends Model {
    id: number;
    studentId: number;
    termId: number;
    priorityGroup: PriorityGroup;
    priorityScore: number;
    registrationStart: Date;
    registrationEnd: Date;
    calculatedAt: Date;
    calculatedBy: string;
    overrideReason?: string;
    overrideBy?: string;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof RegistrationTimeTicket;
}
export declare class WaitlistEntry extends Model {
    id: number;
    studentId: number;
    sectionId: number;
    termId: number;
    position: number;
    addedDate: Date;
    status: WaitlistStatus;
    notificationSentDate?: Date;
    notificationExpiresDate?: Date;
    registeredDate?: Date;
    removedDate?: Date;
    removedReason?: string;
    creditHours: number;
    gradingBasis: string;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof WaitlistEntry;
}
export declare class RegistrationHistory extends Model {
    id: number;
    registrationId: number;
    studentId: number;
    sectionId: number;
    action: RegistrationAction;
    actionDate: Date;
    actionBy: string;
    previousStatus?: RegistrationStatus;
    newStatus: RegistrationStatus;
    reason?: string;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    static initModel(sequelize: Sequelize): typeof RegistrationHistory;
}
export declare class ConcurrentEnrollmentAgreement extends Model {
    id: number;
    studentId: number;
    homeInstitutionId: number;
    hostInstitutionId: number;
    termId: number;
    maxCreditHours: number;
    agreementStartDate: Date;
    agreementEndDate: Date;
    approvedBy?: string;
    approvalDate?: Date;
    status: string;
    metadata?: Record<string, any>;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof ConcurrentEnrollmentAgreement;
}
export declare class CreateRegistrationPeriodDto {
    termId: number;
    termCode: string;
    periodType: RegistrationPeriodType;
    periodName: string;
    startDate: Date;
    endDate: Date;
    maxCreditHours?: number;
    minCreditHours?: number;
    allowWaitlist: boolean;
    allowSwap: boolean;
    requireAdvisorApproval: boolean;
}
export declare class RegisterForCourseDto {
    studentId: number;
    sectionId: number;
    termId: number;
    creditHours: number;
    gradingBasis: string;
    registeredBy: string;
    auditCourse?: boolean;
    repeatCourse?: boolean;
}
export declare class DropCourseDto {
    registrationId: number;
    droppedBy: string;
    reason?: string;
}
export declare class SwapCourseDto {
    studentId: number;
    dropRegistrationId: number;
    addSectionId: number;
    creditHours: number;
    gradingBasis: string;
    swappedBy: string;
    reason?: string;
}
export declare class WithdrawFromCourseDto {
    registrationId: number;
    withdrawnBy: string;
    lastAttendanceDate?: Date;
    reason?: string;
}
export declare class CreateRegistrationHoldDto {
    studentId: number;
    holdType: HoldType;
    holdSeverity: HoldSeverity;
    holdReason: string;
    holdDescription?: string;
    effectiveDate: Date;
    expirationDate?: Date;
    blocksRegistration: boolean;
    blocksTranscripts: boolean;
    blocksDegree: boolean;
    amountOwed?: number;
}
export declare class ReleaseHoldDto {
    holdId: number;
    releasedBy: string;
    releasedReason?: string;
}
export declare class CreateTimeTicketDto {
    studentId: number;
    termId: number;
    priorityGroup: PriorityGroup;
    priorityScore: number;
    registrationStart: Date;
    registrationEnd: Date;
    calculatedBy: string;
}
export declare class AddToWaitlistDto {
    studentId: number;
    sectionId: number;
    termId: number;
    creditHours: number;
    gradingBasis: string;
}
export declare class RegistrationValidationDto {
    studentId: number;
    sectionId: number;
    termId: number;
    creditHours: number;
}
/**
 * Creates a registration period
 */
export declare function createRegistrationPeriod(data: CreateRegistrationPeriodDto, sequelize: Sequelize, transaction?: Transaction): Promise<RegistrationPeriod>;
/**
 * Gets active registration period for a term
 */
export declare function getActiveRegistrationPeriod(termId: number, currentDate: Date, sequelize: Sequelize): Promise<RegistrationPeriod | null>;
/**
 * Checks if registration is open for a student
 */
export declare function isRegistrationOpen(studentId: number, termId: number, sequelize: Sequelize): Promise<{
    open: boolean;
    reason?: string;
    timeTicket?: RegistrationTimeTicket;
}>;
/**
 * Validates registration prerequisites
 */
export declare function validateRegistration(studentId: number, sectionId: number, termId: number, creditHours: number, sequelize: Sequelize): Promise<RegistrationValidationResult>;
/**
 * Registers a student for a course
 */
export declare function registerForCourse(data: RegisterForCourseDto, sequelize: Sequelize, transaction?: Transaction): Promise<Registration>;
/**
 * Drops a course registration
 */
export declare function dropCourse(data: DropCourseDto, sequelize: Sequelize, transaction?: Transaction): Promise<Registration>;
/**
 * Swaps one course for another
 */
export declare function swapCourse(data: SwapCourseDto, sequelize: Sequelize, transaction?: Transaction): Promise<{
    dropped: Registration;
    added: Registration;
}>;
/**
 * Withdraws a student from a course
 */
export declare function withdrawFromCourse(data: WithdrawFromCourseDto, sequelize: Sequelize, transaction?: Transaction): Promise<Registration>;
/**
 * Adds a student to a waitlist
 */
export declare function addToWaitlist(data: AddToWaitlistDto, sequelize: Sequelize, transaction?: Transaction): Promise<WaitlistEntry>;
/**
 * Processes waitlist when a seat becomes available
 */
export declare function processWaitlist(sectionId: number, sequelize: Sequelize, transaction?: Transaction): Promise<void>;
/**
 * Registers from waitlist
 */
export declare function registerFromWaitlist(waitlistEntryId: number, registeredBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<Registration>;
/**
 * Creates a registration hold
 */
export declare function createRegistrationHold(data: CreateRegistrationHoldDto, sequelize: Sequelize, transaction?: Transaction): Promise<RegistrationHold>;
/**
 * Releases a registration hold
 */
export declare function releaseHold(data: ReleaseHoldDto, sequelize: Sequelize, transaction?: Transaction): Promise<RegistrationHold>;
/**
 * Gets active holds for a student
 */
export declare function getActiveHoldsForStudent(studentId: number, sequelize: Sequelize): Promise<RegistrationHold[]>;
/**
 * Creates a registration time ticket
 */
export declare function createTimeTicket(data: CreateTimeTicketDto, sequelize: Sequelize, transaction?: Transaction): Promise<RegistrationTimeTicket>;
/**
 * Calculates time tickets for all students in a term
 */
export declare function calculateTimeTicketsForTerm(termId: number, calculatedBy: string, sequelize: Sequelize): Promise<RegistrationTimeTicket[]>;
/**
 * Gets student's time ticket
 */
export declare function getStudentTimeTicket(studentId: number, termId: number, sequelize: Sequelize): Promise<RegistrationTimeTicket | null>;
/**
 * Overrides a time ticket
 */
export declare function overrideTimeTicket(timeTicketId: number, newStart: Date, newEnd: Date, overrideReason: string, overrideBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<RegistrationTimeTicket>;
/**
 * Gets student's current registrations for a term
 */
export declare function getStudentRegistrations(studentId: number, termId: number, sequelize: Sequelize): Promise<Registration[]>;
/**
 * Gets total registered credits for a student in a term
 */
export declare function getTotalRegisteredCredits(studentId: number, termId: number, sequelize: Sequelize): Promise<number>;
/**
 * Checks for time conflicts in a student's schedule
 */
export declare function checkTimeConflicts(studentId: number, newSectionId: number, termId: number, sequelize: Sequelize): Promise<{
    hasConflict: boolean;
    conflictingSections: CourseSection[];
}>;
/**
 * Gets registration history for a student
 */
export declare function getRegistrationHistory(studentId: number, termId?: number, sequelize?: Sequelize): Promise<RegistrationHistory[]>;
/**
 * Gets waitlist position for a student
 */
export declare function getWaitlistPosition(studentId: number, sectionId: number, sequelize: Sequelize): Promise<{
    position: number;
    total: number;
} | null>;
/**
 * Removes student from waitlist
 */
export declare function removeFromWaitlist(waitlistEntryId: number, removedReason: string, sequelize: Sequelize, transaction?: Transaction): Promise<WaitlistEntry>;
/**
 * Creates a concurrent enrollment agreement
 */
export declare function createConcurrentEnrollmentAgreement(studentId: number, homeInstitutionId: number, hostInstitutionId: number, termId: number, maxCreditHours: number, agreementStartDate: Date, agreementEndDate: Date, approvedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<ConcurrentEnrollmentAgreement>;
/**
 * Validates concurrent enrollment
 */
export declare function validateConcurrentEnrollment(studentId: number, termId: number, additionalCredits: number, sequelize: Sequelize): Promise<{
    valid: boolean;
    reason?: string;
}>;
/**
 * Approves registration by advisor
 */
export declare function approveRegistrationByAdvisor(registrationId: number, advisorId: string, sequelize: Sequelize, transaction?: Transaction): Promise<Registration>;
/**
 * Changes grading basis for a registration
 */
export declare function changeGradingBasis(registrationId: number, newGradingBasis: string, changedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<Registration>;
/**
 * Changes credit hours for a variable credit course
 */
export declare function changeCreditHours(registrationId: number, newCreditHours: number, changedBy: string, sequelize: Sequelize, transaction?: Transaction): Promise<Registration>;
/**
 * Gets enrollment statistics for a term
 */
export declare function getTermEnrollmentStats(termId: number, sequelize: Sequelize): Promise<{
    totalRegistrations: number;
    totalStudents: number;
    totalCredits: number;
    averageCreditsPerStudent: number;
}>;
/**
 * Gets section enrollment details
 */
export declare function getSectionEnrollmentDetails(sectionId: number, sequelize: Sequelize): Promise<{
    enrolledStudents: number;
    waitlistedStudents: number;
    capacity: number;
    availableSeats: number;
    enrollmentPercent: number;
}>;
/**
 * Validates registration cart
 */
export declare function validateRegistrationCart(cart: RegistrationCart, sequelize: Sequelize): Promise<RegistrationValidationResult>;
/**
 * Processes registration cart (registers for multiple courses)
 */
export declare function processRegistrationCart(cart: RegistrationCart, registeredBy: string, sequelize: Sequelize): Promise<{
    successful: Registration[];
    failed: Array<{
        sectionId: number;
        error: string;
    }>;
}>;
export declare class RegistrationPeriodsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateRegistrationPeriodDto): Promise<RegistrationPeriod>;
    findByTerm(termId: number): Promise<RegistrationPeriod[]>;
    getActive(termId: number): Promise<RegistrationPeriod | null>;
}
export declare class RegistrationsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    register(registerDto: RegisterForCourseDto): Promise<Registration>;
    drop(dropDto: DropCourseDto): Promise<Registration>;
    swap(swapDto: SwapCourseDto): Promise<any>;
    withdraw(withdrawDto: WithdrawFromCourseDto): Promise<Registration>;
    getStudentRegistrations(studentId: number, termId: number): Promise<Registration[]>;
    getTotalCredits(studentId: number, termId: number): Promise<{
        totalCredits: number;
    }>;
    validate(validationDto: RegistrationValidationDto): Promise<RegistrationValidationResult>;
    getHistory(id: number): Promise<RegistrationHistory[]>;
    approve(id: number, advisorId: string): Promise<Registration>;
    changeGradingBasis(id: number, gradingBasis: string, changedBy: string): Promise<Registration>;
    changeCreditHours(id: number, creditHours: number, changedBy: string): Promise<Registration>;
}
export declare class RegistrationHoldsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateRegistrationHoldDto): Promise<RegistrationHold>;
    getStudentHolds(studentId: number): Promise<RegistrationHold[]>;
    release(releaseDto: ReleaseHoldDto): Promise<RegistrationHold>;
}
export declare class TimeTicketsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    create(createDto: CreateTimeTicketDto): Promise<RegistrationTimeTicket>;
    getStudentTicket(studentId: number, termId: number): Promise<RegistrationTimeTicket | null>;
    override(id: number, newStart: Date, newEnd: Date, overrideReason: string, overrideBy: string): Promise<RegistrationTimeTicket>;
}
export declare class WaitlistController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    add(addDto: AddToWaitlistDto): Promise<WaitlistEntry>;
    getPosition(studentId: number, sectionId: number): Promise<{
        position: number;
        total: number;
    } | null>;
    registerFromWaitlist(id: number, registeredBy: string): Promise<Registration>;
    remove(id: number, removedReason: string): Promise<WaitlistEntry>;
}
export declare class EnrollmentStatisticsController {
    private readonly sequelize;
    constructor(sequelize: Sequelize);
    getTermStats(termId: number): Promise<{
        totalRegistrations: number;
        totalStudents: number;
        totalCredits: number;
        averageCreditsPerStudent: number;
    }>;
    getSectionDetails(sectionId: number): Promise<{
        enrolledStudents: number;
        waitlistedStudents: number;
        capacity: number;
        availableSeats: number;
        enrollmentPercent: number;
    }>;
}
//# sourceMappingURL=course-registration-kit.d.ts.map