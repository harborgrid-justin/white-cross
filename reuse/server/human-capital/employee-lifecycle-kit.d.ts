/**
 * LOC: HCM-ELC-001
 * File: /reuse/server/human-capital/employee-lifecycle-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable HCM utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend HCM services
 *   - Employee management modules
 *   - Onboarding/offboarding services
 *   - Leave management systems
 *   - HR analytics and reporting
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Employee lifecycle states
 */
export declare enum EmployeeLifecycleState {
    PRE_HIRE = "pre_hire",
    ONBOARDING = "onboarding",
    PROBATION = "probation",
    ACTIVE = "active",
    ON_LEAVE = "on_leave",
    SUSPENDED = "suspended",
    NOTICE_PERIOD = "notice_period",
    EXITING = "exiting",
    TERMINATED = "terminated",
    RETIRED = "retired",
    REHIRABLE = "rehirable",
    NON_REHIRABLE = "non_rehirable"
}
/**
 * Onboarding status stages
 */
export declare enum OnboardingStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    PAPERWORK_PENDING = "paperwork_pending",
    SYSTEM_ACCESS_PENDING = "system_access_pending",
    TRAINING_PENDING = "training_pending",
    COMPLETED = "completed",
    DELAYED = "delayed"
}
/**
 * Probation period status
 */
export declare enum ProbationStatus {
    ACTIVE = "active",
    EXTENDED = "extended",
    PASSED = "passed",
    FAILED = "failed",
    WAIVED = "waived"
}
/**
 * Transfer types
 */
export declare enum TransferType {
    PROMOTION = "promotion",
    LATERAL_MOVE = "lateral_move",
    DEMOTION = "demotion",
    DEPARTMENT_TRANSFER = "department_transfer",
    LOCATION_TRANSFER = "location_transfer",
    TEMPORARY_ASSIGNMENT = "temporary_assignment",
    PERMANENT_TRANSFER = "permanent_transfer"
}
/**
 * Leave types
 */
export declare enum LeaveType {
    FMLA = "fmla",
    PARENTAL = "parental",
    MEDICAL = "medical",
    PERSONAL = "personal",
    MILITARY = "military",
    BEREAVEMENT = "bereavement",
    SABBATICAL = "sabbatical",
    UNPAID = "unpaid",
    DISABILITY_SHORT_TERM = "disability_short_term",
    DISABILITY_LONG_TERM = "disability_long_term"
}
/**
 * Leave status
 */
export declare enum LeaveStatus {
    REQUESTED = "requested",
    APPROVED = "approved",
    DENIED = "denied",
    ACTIVE = "active",
    EXTENDED = "extended",
    RETURNED = "returned",
    CANCELLED = "cancelled"
}
/**
 * Exit types
 */
export declare enum ExitType {
    VOLUNTARY_RESIGNATION = "voluntary_resignation",
    INVOLUNTARY_TERMINATION = "involuntary_termination",
    RETIREMENT = "retirement",
    END_OF_CONTRACT = "end_of_contract",
    MUTUAL_SEPARATION = "mutual_separation",
    LAYOFF = "layoff",
    DEATH = "death"
}
/**
 * Rehire eligibility
 */
export declare enum RehireEligibility {
    ELIGIBLE = "eligible",
    NOT_ELIGIBLE = "not_eligible",
    CONDITIONAL = "conditional",
    UNDER_REVIEW = "under_review"
}
/**
 * Relocation status
 */
export declare enum RelocationStatus {
    APPROVED = "approved",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Employee registration data
 */
export interface EmployeeRegistrationData {
    employeeNumber?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth: Date;
    hireDate: Date;
    positionId: string;
    departmentId: string;
    locationId: string;
    managerId?: string;
    employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
    jobTitle: string;
    salaryGrade?: string;
    compensation?: number;
    customFields?: Record<string, any>;
}
/**
 * Onboarding checklist item
 */
export interface OnboardingChecklistItem {
    id: string;
    category: 'paperwork' | 'systems' | 'training' | 'equipment' | 'orientation';
    taskName: string;
    description?: string;
    dueDate?: Date;
    completedDate?: Date;
    assignedTo?: string;
    isRequired: boolean;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
    dependencies?: string[];
}
/**
 * Onboarding plan data
 */
export interface OnboardingPlanData {
    employeeId: string;
    plannedStartDate: Date;
    actualStartDate?: Date;
    buddy?: string;
    mentor?: string;
    checklistItems: OnboardingChecklistItem[];
    notes?: string;
}
/**
 * Probation period data
 */
export interface ProbationPeriodData {
    employeeId: string;
    startDate: Date;
    endDate: Date;
    reviewSchedule: Date[];
    managerId: string;
    criteria?: string[];
    notes?: string;
}
/**
 * Transfer request data
 */
export interface TransferRequestData {
    employeeId: string;
    transferType: TransferType;
    currentPositionId: string;
    newPositionId: string;
    currentDepartmentId: string;
    newDepartmentId: string;
    currentLocationId?: string;
    newLocationId?: string;
    effectiveDate: Date;
    reason: string;
    requestedBy: string;
    isPromotionEligible?: boolean;
    compensationChange?: number;
    approvalRequired: boolean;
}
/**
 * Relocation request data
 */
export interface RelocationRequestData {
    employeeId: string;
    fromLocationId: string;
    toLocationId: string;
    effectiveDate: Date;
    relocationPackage?: string;
    estimatedCost?: number;
    movingExpensesAllowed?: boolean;
    temporaryHousingDays?: number;
    reason: string;
    requestedBy: string;
}
/**
 * Leave of absence request data
 */
export interface LeaveOfAbsenceData {
    employeeId: string;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    expectedReturnDate: Date;
    isPaid: boolean;
    reason?: string;
    medicalCertificationRequired?: boolean;
    intermittentLeave?: boolean;
    reducedSchedule?: boolean;
    approvedBy?: string;
    documents?: string[];
}
/**
 * Return to work data
 */
export interface ReturnToWorkData {
    employeeId: string;
    leaveId: string;
    actualReturnDate: Date;
    workRestrictions?: string[];
    modifiedDuties?: string;
    medicalClearance?: boolean;
    reintegrationPlan?: string;
    followUpDate?: Date;
}
/**
 * Exit interview data
 */
export interface ExitInterviewData {
    employeeId: string;
    exitId: string;
    interviewDate: Date;
    conductedBy: string;
    reasonForLeaving: string;
    feedbackOnManagement?: string;
    feedbackOnWorkEnvironment?: string;
    wouldRecommendCompany?: boolean;
    wouldRehire?: boolean;
    improvementSuggestions?: string;
    exitSurveyResponses?: Record<string, any>;
}
/**
 * Exit process data
 */
export interface EmployeeExitData {
    employeeId: string;
    exitType: ExitType;
    lastWorkingDate: Date;
    noticeDate?: Date;
    noticePeriodDays?: number;
    exitReason: string;
    initiatedBy: string;
    rehireEligibility: RehireEligibility;
    finalSettlementAmount?: number;
    equipmentReturnStatus?: 'pending' | 'partial' | 'complete';
    exitInterviewScheduled?: boolean;
    referenceCheckAllowed?: boolean;
}
/**
 * Retirement data
 */
export interface RetirementData {
    employeeId: string;
    retirementDate: Date;
    noticeDate: Date;
    retirementType: 'normal' | 'early' | 'deferred';
    pensionEligible: boolean;
    benefitsTransitionPlan?: string;
    knowledgeTransferPlan?: string;
    farewellEventDate?: Date;
    emeritusStatus?: boolean;
}
/**
 * Rehire eligibility check result
 */
export interface RehireEligibilityCheck {
    employeeId: string;
    formerEmployeeNumber: string;
    previousExitType: ExitType;
    previousExitDate: Date;
    eligibilityStatus: RehireEligibility;
    reasonsForIneligibility?: string[];
    conditionalRequirements?: string[];
    performanceHistory?: string;
    disciplinaryHistory?: string;
    rehireRecommendation: boolean;
}
/**
 * Lifecycle milestone
 */
export interface LifecycleMilestone {
    employeeId: string;
    milestoneType: 'anniversary' | 'promotion' | 'award' | 'completion' | 'achievement';
    milestoneDate: Date;
    description: string;
    recognitionRequired: boolean;
    notificationSent?: boolean;
}
/**
 * Employee lifecycle event
 */
export interface LifecycleEvent {
    employeeId: string;
    eventType: string;
    eventDate: Date;
    fromState?: EmployeeLifecycleState;
    toState?: EmployeeLifecycleState;
    triggeredBy: string;
    metadata?: Record<string, any>;
    notes?: string;
}
/**
 * Employee Model - Core employee master data
 */
export declare class Employee extends Model {
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth: Date;
    hireDate: Date;
    lifecycleState: EmployeeLifecycleState;
    positionId: string;
    departmentId: string;
    locationId: string;
    managerId?: string;
    employmentType: string;
    jobTitle: string;
    salaryGrade?: string;
    compensation?: number;
    lastWorkingDate?: Date;
    terminationDate?: Date;
    rehireEligibility?: RehireEligibility;
    isActive: boolean;
    customFields?: Record<string, any>;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    lifecycleEvents?: EmployeeLifecycleEvent[];
    onboardingRecords?: Onboarding[];
    probationPeriods?: ProbationPeriod[];
    transfers?: InternalTransfer[];
    leaves?: LeaveOfAbsence[];
    exitRecords?: EmployeeExit[];
}
/**
 * Employee Lifecycle Event Model - Tracks all lifecycle state changes
 */
export declare class EmployeeLifecycleEvent extends Model {
    id: string;
    employeeId: string;
    eventType: string;
    eventDate: Date;
    fromState?: EmployeeLifecycleState;
    toState?: EmployeeLifecycleState;
    triggeredBy: string;
    metadata?: Record<string, any>;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Onboarding Model - Tracks new hire onboarding process
 */
export declare class Onboarding extends Model {
    id: string;
    employeeId: string;
    onboardingStatus: OnboardingStatus;
    plannedStartDate: Date;
    actualStartDate?: Date;
    buddyId?: string;
    mentorId?: string;
    checklistItems?: OnboardingChecklistItem[];
    completionDate?: Date;
    completionPercentage: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Probation Period Model - Tracks employee probation periods
 */
export declare class ProbationPeriod extends Model {
    id: string;
    employeeId: string;
    probationStatus: ProbationStatus;
    startDate: Date;
    endDate: Date;
    reviewSchedule?: Date[];
    managerId: string;
    criteria?: string[];
    finalEvaluationDate?: Date;
    passed?: boolean;
    extensionReason?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Internal Transfer Model - Tracks employee transfers and promotions
 */
export declare class InternalTransfer extends Model {
    id: string;
    employeeId: string;
    transferType: TransferType;
    currentPositionId: string;
    newPositionId: string;
    currentDepartmentId: string;
    newDepartmentId: string;
    currentLocationId?: string;
    newLocationId?: string;
    effectiveDate: Date;
    reason: string;
    requestedBy: string;
    approvalStatus: string;
    approvedBy?: string;
    approvalDate?: Date;
    compensationChange?: number;
    isPromotionEligible: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Employee Relocation Model - Tracks employee relocations
 */
export declare class EmployeeRelocation extends Model {
    id: string;
    employeeId: string;
    fromLocationId: string;
    toLocationId: string;
    effectiveDate: Date;
    relocationStatus: RelocationStatus;
    relocationPackage?: string;
    estimatedCost?: number;
    movingExpensesAllowed: boolean;
    temporaryHousingDays?: number;
    reason: string;
    requestedBy: string;
    completionDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Leave of Absence Model - Tracks employee leaves
 */
export declare class LeaveOfAbsence extends Model {
    id: string;
    employeeId: string;
    leaveType: LeaveType;
    leaveStatus: LeaveStatus;
    startDate: Date;
    endDate: Date;
    expectedReturnDate: Date;
    actualReturnDate?: Date;
    isPaid: boolean;
    reason?: string;
    medicalCertificationRequired: boolean;
    intermittentLeave: boolean;
    reducedSchedule: boolean;
    approvedBy?: string;
    approvalDate?: Date;
    documents?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Return to Work Model - Tracks return from leave
 */
export declare class ReturnToWork extends Model {
    id: string;
    employeeId: string;
    leaveId: string;
    actualReturnDate: Date;
    workRestrictions?: string[];
    modifiedDuties?: string;
    medicalClearance: boolean;
    reintegrationPlan?: string;
    followUpDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
    leave?: LeaveOfAbsence;
}
/**
 * Employee Exit Model - Tracks employee exits
 */
export declare class EmployeeExit extends Model {
    id: string;
    employeeId: string;
    exitType: ExitType;
    lastWorkingDate: Date;
    noticeDate?: Date;
    noticePeriodDays?: number;
    exitReason: string;
    initiatedBy: string;
    rehireEligibility: RehireEligibility;
    finalSettlementAmount?: number;
    equipmentReturnStatus: string;
    exitInterviewScheduled: boolean;
    exitInterviewCompleted: boolean;
    referenceCheckAllowed: boolean;
    exitClearanceCompleted: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Exit Interview Model - Tracks exit interview data
 */
export declare class ExitInterview extends Model {
    id: string;
    employeeId: string;
    exitId: string;
    interviewDate: Date;
    conductedBy: string;
    reasonForLeaving: string;
    feedbackOnManagement?: string;
    feedbackOnWorkEnvironment?: string;
    wouldRecommendCompany?: boolean;
    wouldRehire?: boolean;
    improvementSuggestions?: string;
    exitSurveyResponses?: Record<string, any>;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
    exit?: EmployeeExit;
}
/**
 * Rehire Record Model - Tracks rehire eligibility and records
 */
export declare class RehireRecord extends Model {
    id: string;
    employeeId?: string;
    formerEmployeeNumber: string;
    previousExitType: ExitType;
    previousExitDate: Date;
    eligibilityStatus: RehireEligibility;
    reasonsForIneligibility?: string[];
    conditionalRequirements?: string[];
    performanceHistory?: string;
    disciplinaryHistory?: string;
    rehireRecommendation: boolean;
    rehireDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: Employee;
}
/**
 * Registers a new employee in the system
 *
 * @param data - Employee registration data
 * @param transaction - Optional database transaction
 * @returns Created employee record
 *
 * @example
 * ```typescript
 * const employee = await registerEmployee({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   email: 'john.doe@company.com',
 *   dateOfBirth: new Date('1990-01-15'),
 *   hireDate: new Date('2024-03-01'),
 *   positionId: 'pos-123',
 *   departmentId: 'dept-456',
 *   locationId: 'loc-789',
 *   employmentType: 'full_time',
 *   jobTitle: 'Software Engineer'
 * });
 * ```
 */
export declare function registerEmployee(data: EmployeeRegistrationData, transaction?: Transaction): Promise<Employee>;
/**
 * Generates a unique employee number
 *
 * @returns Generated employee number
 *
 * @example
 * ```typescript
 * const empNumber = await generateEmployeeNumber();
 * // Returns: "EMP-2024-001234"
 * ```
 */
export declare function generateEmployeeNumber(): Promise<string>;
/**
 * Creates onboarding plan for new hire
 *
 * @param data - Onboarding plan data
 * @param transaction - Optional database transaction
 * @returns Created onboarding record
 *
 * @example
 * ```typescript
 * const onboarding = await createOnboardingPlan({
 *   employeeId: 'emp-123',
 *   plannedStartDate: new Date('2024-03-01'),
 *   buddy: 'emp-456',
 *   mentor: 'emp-789',
 *   checklistItems: [
 *     {
 *       id: '1',
 *       category: 'paperwork',
 *       taskName: 'Complete W-4 form',
 *       isRequired: true,
 *       status: 'pending'
 *     }
 *   ]
 * });
 * ```
 */
export declare function createOnboardingPlan(data: OnboardingPlanData, transaction?: Transaction): Promise<Onboarding>;
/**
 * Updates onboarding checklist item status
 *
 * @param onboardingId - Onboarding identifier
 * @param itemId - Checklist item ID
 * @param status - New status
 * @param completedDate - Completion date if completed
 * @param transaction - Optional database transaction
 * @returns Updated onboarding record
 *
 * @example
 * ```typescript
 * await updateOnboardingChecklistItem(
 *   'onb-123',
 *   'item-1',
 *   'completed',
 *   new Date()
 * );
 * ```
 */
export declare function updateOnboardingChecklistItem(onboardingId: string, itemId: string, status: 'pending' | 'in_progress' | 'completed' | 'blocked', completedDate?: Date, transaction?: Transaction): Promise<Onboarding>;
/**
 * Starts employee onboarding process
 *
 * @param employeeId - Employee identifier
 * @param actualStartDate - Actual start date
 * @param transaction - Optional database transaction
 * @returns Updated employee and onboarding records
 *
 * @example
 * ```typescript
 * const { employee, onboarding } = await startOnboarding(
 *   'emp-123',
 *   new Date('2024-03-01')
 * );
 * ```
 */
export declare function startOnboarding(employeeId: string, actualStartDate: Date, transaction?: Transaction): Promise<{
    employee: Employee;
    onboarding: Onboarding;
}>;
/**
 * Completes employee onboarding process
 *
 * @param employeeId - Employee identifier
 * @param completionDate - Onboarding completion date
 * @param transaction - Optional database transaction
 * @returns Updated employee record
 *
 * @example
 * ```typescript
 * const employee = await completeOnboarding('emp-123', new Date());
 * ```
 */
export declare function completeOnboarding(employeeId: string, completionDate: Date, transaction?: Transaction): Promise<Employee>;
/**
 * Gets onboarding status for employee
 *
 * @param employeeId - Employee identifier
 * @returns Onboarding record with details
 *
 * @example
 * ```typescript
 * const status = await getOnboardingStatus('emp-123');
 * console.log(status.completionPercentage);
 * ```
 */
export declare function getOnboardingStatus(employeeId: string): Promise<Onboarding>;
/**
 * Gets all onboarding records with specific status
 *
 * @param status - Onboarding status to filter
 * @param limit - Maximum number of records
 * @returns Array of onboarding records
 *
 * @example
 * ```typescript
 * const inProgress = await getOnboardingsByStatus(
 *   OnboardingStatus.IN_PROGRESS,
 *   50
 * );
 * ```
 */
export declare function getOnboardingsByStatus(status: OnboardingStatus, limit?: number): Promise<Onboarding[]>;
/**
 * Creates probation period for employee
 *
 * @param data - Probation period data
 * @param transaction - Optional database transaction
 * @returns Created probation period record
 *
 * @example
 * ```typescript
 * const probation = await createProbationPeriod({
 *   employeeId: 'emp-123',
 *   startDate: new Date('2024-03-01'),
 *   endDate: new Date('2024-06-01'),
 *   reviewSchedule: [new Date('2024-04-15'), new Date('2024-05-15')],
 *   managerId: 'mgr-456'
 * });
 * ```
 */
export declare function createProbationPeriod(data: ProbationPeriodData, transaction?: Transaction): Promise<ProbationPeriod>;
/**
 * Extends probation period
 *
 * @param probationId - Probation period identifier
 * @param newEndDate - New end date
 * @param reason - Extension reason
 * @param transaction - Optional database transaction
 * @returns Updated probation period
 *
 * @example
 * ```typescript
 * const extended = await extendProbationPeriod(
 *   'prob-123',
 *   new Date('2024-09-01'),
 *   'Additional time needed for performance improvement'
 * );
 * ```
 */
export declare function extendProbationPeriod(probationId: string, newEndDate: Date, reason: string, transaction?: Transaction): Promise<ProbationPeriod>;
/**
 * Completes probation period evaluation
 *
 * @param probationId - Probation period identifier
 * @param passed - Whether employee passed probation
 * @param evaluationDate - Evaluation date
 * @param notes - Evaluation notes
 * @param transaction - Optional database transaction
 * @returns Updated probation period and employee
 *
 * @example
 * ```typescript
 * const result = await completeProbationEvaluation(
 *   'prob-123',
 *   true,
 *   new Date(),
 *   'Excellent performance, confirmed in position'
 * );
 * ```
 */
export declare function completeProbationEvaluation(probationId: string, passed: boolean, evaluationDate: Date, notes?: string, transaction?: Transaction): Promise<{
    probation: ProbationPeriod;
    employee: Employee;
}>;
/**
 * Gets probation periods ending soon
 *
 * @param daysUntilEnd - Number of days threshold
 * @returns Probation periods ending within threshold
 *
 * @example
 * ```typescript
 * const ending = await getProbationPeriodsEndingSoon(30);
 * ```
 */
export declare function getProbationPeriodsEndingSoon(daysUntilEnd?: number): Promise<ProbationPeriod[]>;
/**
 * Gets probation status for employee
 *
 * @param employeeId - Employee identifier
 * @returns Active probation period or null
 *
 * @example
 * ```typescript
 * const probation = await getProbationStatus('emp-123');
 * ```
 */
export declare function getProbationStatus(employeeId: string): Promise<ProbationPeriod | null>;
/**
 * Creates internal transfer request
 *
 * @param data - Transfer request data
 * @param transaction - Optional database transaction
 * @returns Created transfer request
 *
 * @example
 * ```typescript
 * const transfer = await createTransferRequest({
 *   employeeId: 'emp-123',
 *   transferType: TransferType.PROMOTION,
 *   currentPositionId: 'pos-123',
 *   newPositionId: 'pos-456',
 *   currentDepartmentId: 'dept-123',
 *   newDepartmentId: 'dept-456',
 *   effectiveDate: new Date('2024-04-01'),
 *   reason: 'Promotion to senior role',
 *   requestedBy: 'mgr-789',
 *   approvalRequired: true
 * });
 * ```
 */
export declare function createTransferRequest(data: TransferRequestData, transaction?: Transaction): Promise<InternalTransfer>;
/**
 * Approves transfer request
 *
 * @param transferId - Transfer identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Updated transfer request
 *
 * @example
 * ```typescript
 * const approved = await approveTransferRequest(
 *   'trans-123',
 *   'mgr-456',
 *   new Date()
 * );
 * ```
 */
export declare function approveTransferRequest(transferId: string, approvedBy: string, approvalDate?: Date, transaction?: Transaction): Promise<InternalTransfer>;
/**
 * Executes approved transfer
 *
 * @param transferId - Transfer identifier
 * @param effectiveDate - Effective date of transfer
 * @param transaction - Optional database transaction
 * @returns Updated employee and transfer records
 *
 * @example
 * ```typescript
 * const result = await executeTransfer('trans-123', new Date());
 * ```
 */
export declare function executeTransfer(transferId: string, effectiveDate?: Date, transaction?: Transaction): Promise<{
    employee: Employee;
    transfer: InternalTransfer;
}>;
/**
 * Gets pending transfer requests
 *
 * @param limit - Maximum number of records
 * @returns Pending transfer requests
 *
 * @example
 * ```typescript
 * const pending = await getPendingTransfers(100);
 * ```
 */
export declare function getPendingTransfers(limit?: number): Promise<InternalTransfer[]>;
/**
 * Gets transfer history for employee
 *
 * @param employeeId - Employee identifier
 * @param limit - Maximum number of records
 * @returns Transfer history
 *
 * @example
 * ```typescript
 * const history = await getTransferHistory('emp-123', 10);
 * ```
 */
export declare function getTransferHistory(employeeId: string, limit?: number): Promise<InternalTransfer[]>;
/**
 * Cancels pending transfer request
 *
 * @param transferId - Transfer identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated transfer request
 *
 * @example
 * ```typescript
 * const cancelled = await cancelTransferRequest(
 *   'trans-123',
 *   'Employee declined promotion'
 * );
 * ```
 */
export declare function cancelTransferRequest(transferId: string, reason: string, transaction?: Transaction): Promise<InternalTransfer>;
/**
 * Creates employee relocation request
 *
 * @param data - Relocation request data
 * @param transaction - Optional database transaction
 * @returns Created relocation record
 *
 * @example
 * ```typescript
 * const relocation = await createRelocationRequest({
 *   employeeId: 'emp-123',
 *   fromLocationId: 'loc-123',
 *   toLocationId: 'loc-456',
 *   effectiveDate: new Date('2024-05-01'),
 *   relocationPackage: 'standard',
 *   estimatedCost: 15000,
 *   movingExpensesAllowed: true,
 *   temporaryHousingDays: 30,
 *   reason: 'Business need - new office opening',
 *   requestedBy: 'mgr-789'
 * });
 * ```
 */
export declare function createRelocationRequest(data: RelocationRequestData, transaction?: Transaction): Promise<EmployeeRelocation>;
/**
 * Starts relocation process
 *
 * @param relocationId - Relocation identifier
 * @param transaction - Optional database transaction
 * @returns Updated relocation record
 *
 * @example
 * ```typescript
 * const started = await startRelocation('rel-123');
 * ```
 */
export declare function startRelocation(relocationId: string, transaction?: Transaction): Promise<EmployeeRelocation>;
/**
 * Completes relocation process
 *
 * @param relocationId - Relocation identifier
 * @param completionDate - Completion date
 * @param transaction - Optional database transaction
 * @returns Updated employee and relocation records
 *
 * @example
 * ```typescript
 * const result = await completeRelocation('rel-123', new Date());
 * ```
 */
export declare function completeRelocation(relocationId: string, completionDate?: Date, transaction?: Transaction): Promise<{
    employee: Employee;
    relocation: EmployeeRelocation;
}>;
/**
 * Gets active relocations
 *
 * @param limit - Maximum number of records
 * @returns Active relocation records
 *
 * @example
 * ```typescript
 * const active = await getActiveRelocations(50);
 * ```
 */
export declare function getActiveRelocations(limit?: number): Promise<EmployeeRelocation[]>;
/**
 * Creates leave of absence request
 *
 * @param data - Leave of absence data
 * @param transaction - Optional database transaction
 * @returns Created leave record
 *
 * @example
 * ```typescript
 * const leave = await createLeaveOfAbsence({
 *   employeeId: 'emp-123',
 *   leaveType: LeaveType.FMLA,
 *   startDate: new Date('2024-04-01'),
 *   endDate: new Date('2024-06-01'),
 *   expectedReturnDate: new Date('2024-06-03'),
 *   isPaid: false,
 *   reason: 'Medical condition requiring treatment',
 *   medicalCertificationRequired: true
 * });
 * ```
 */
export declare function createLeaveOfAbsence(data: LeaveOfAbsenceData, transaction?: Transaction): Promise<LeaveOfAbsence>;
/**
 * Approves leave of absence request
 *
 * @param leaveId - Leave identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const approved = await approveLeaveRequest('leave-123', 'mgr-456');
 * ```
 */
export declare function approveLeaveRequest(leaveId: string, approvedBy: string, approvalDate?: Date, transaction?: Transaction): Promise<LeaveOfAbsence>;
/**
 * Starts leave of absence
 *
 * @param leaveId - Leave identifier
 * @param startDate - Actual start date
 * @param transaction - Optional database transaction
 * @returns Updated employee and leave records
 *
 * @example
 * ```typescript
 * const result = await startLeave('leave-123', new Date());
 * ```
 */
export declare function startLeave(leaveId: string, startDate?: Date, transaction?: Transaction): Promise<{
    employee: Employee;
    leave: LeaveOfAbsence;
}>;
/**
 * Extends leave of absence
 *
 * @param leaveId - Leave identifier
 * @param newEndDate - New end date
 * @param newExpectedReturnDate - New expected return date
 * @param reason - Extension reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const extended = await extendLeave(
 *   'leave-123',
 *   new Date('2024-07-01'),
 *   new Date('2024-07-03'),
 *   'Medical condition requires additional recovery time'
 * );
 * ```
 */
export declare function extendLeave(leaveId: string, newEndDate: Date, newExpectedReturnDate: Date, reason: string, transaction?: Transaction): Promise<LeaveOfAbsence>;
/**
 * Denies leave of absence request
 *
 * @param leaveId - Leave identifier
 * @param reason - Denial reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const denied = await denyLeaveRequest(
 *   'leave-123',
 *   'Insufficient leave balance'
 * );
 * ```
 */
export declare function denyLeaveRequest(leaveId: string, reason: string, transaction?: Transaction): Promise<LeaveOfAbsence>;
/**
 * Cancels approved leave request
 *
 * @param leaveId - Leave identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated leave record
 *
 * @example
 * ```typescript
 * const cancelled = await cancelLeaveRequest(
 *   'leave-123',
 *   'Employee no longer requires leave'
 * );
 * ```
 */
export declare function cancelLeaveRequest(leaveId: string, reason: string, transaction?: Transaction): Promise<LeaveOfAbsence>;
/**
 * Gets active leaves for employee
 *
 * @param employeeId - Employee identifier
 * @returns Active leave records
 *
 * @example
 * ```typescript
 * const leaves = await getActiveLeaves('emp-123');
 * ```
 */
export declare function getActiveLeaves(employeeId: string): Promise<LeaveOfAbsence[]>;
/**
 * Gets leaves ending soon
 *
 * @param daysUntilEnd - Days threshold
 * @returns Leaves ending within threshold
 *
 * @example
 * ```typescript
 * const ending = await getLeavesEndingSoon(7);
 * ```
 */
export declare function getLeavesEndingSoon(daysUntilEnd?: number): Promise<LeaveOfAbsence[]>;
/**
 * Processes return to work from leave
 *
 * @param data - Return to work data
 * @param transaction - Optional database transaction
 * @returns Return to work record and updated employee
 *
 * @example
 * ```typescript
 * const result = await processReturnToWork({
 *   employeeId: 'emp-123',
 *   leaveId: 'leave-456',
 *   actualReturnDate: new Date(),
 *   medicalClearance: true,
 *   workRestrictions: ['No lifting over 20 lbs'],
 *   reintegrationPlan: 'Gradual return to full duties over 2 weeks'
 * });
 * ```
 */
export declare function processReturnToWork(data: ReturnToWorkData, transaction?: Transaction): Promise<{
    returnToWork: ReturnToWork;
    employee: Employee;
    leave: LeaveOfAbsence;
}>;
/**
 * Updates return to work plan
 *
 * @param returnToWorkId - Return to work identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated return to work record
 *
 * @example
 * ```typescript
 * const updated = await updateReturnToWorkPlan('rtw-123', {
 *   modifiedDuties: 'Light duty assignments for first week',
 *   followUpDate: new Date('2024-05-15')
 * });
 * ```
 */
export declare function updateReturnToWorkPlan(returnToWorkId: string, updates: Partial<ReturnToWork>, transaction?: Transaction): Promise<ReturnToWork>;
/**
 * Gets return to work records requiring follow-up
 *
 * @param daysUntilFollowUp - Days threshold
 * @returns Return to work records needing follow-up
 *
 * @example
 * ```typescript
 * const followUps = await getReturnToWorkFollowUps(7);
 * ```
 */
export declare function getReturnToWorkFollowUps(daysUntilFollowUp?: number): Promise<ReturnToWork[]>;
/**
 * Initiates employee exit process
 *
 * @param data - Employee exit data
 * @param transaction - Optional database transaction
 * @returns Created exit record
 *
 * @example
 * ```typescript
 * const exit = await initiateEmployeeExit({
 *   employeeId: 'emp-123',
 *   exitType: ExitType.VOLUNTARY_RESIGNATION,
 *   lastWorkingDate: new Date('2024-05-31'),
 *   noticeDate: new Date('2024-05-01'),
 *   noticePeriodDays: 30,
 *   exitReason: 'Career advancement opportunity',
 *   initiatedBy: 'emp-123',
 *   rehireEligibility: RehireEligibility.ELIGIBLE,
 *   referenceCheckAllowed: true
 * });
 * ```
 */
export declare function initiateEmployeeExit(data: EmployeeExitData, transaction?: Transaction): Promise<EmployeeExit>;
/**
 * Conducts exit interview
 *
 * @param data - Exit interview data
 * @param transaction - Optional database transaction
 * @returns Created exit interview record
 *
 * @example
 * ```typescript
 * const interview = await conductExitInterview({
 *   employeeId: 'emp-123',
 *   exitId: 'exit-456',
 *   interviewDate: new Date(),
 *   conductedBy: 'hr-789',
 *   reasonForLeaving: 'Better career opportunity',
 *   feedbackOnManagement: 'Good support, clear communication',
 *   wouldRecommendCompany: true,
 *   wouldRehire: true
 * });
 * ```
 */
export declare function conductExitInterview(data: ExitInterviewData, transaction?: Transaction): Promise<ExitInterview>;
/**
 * Completes exit clearance
 *
 * @param exitId - Exit identifier
 * @param equipmentReturned - Whether equipment was returned
 * @param finalSettlement - Final settlement amount
 * @param transaction - Optional database transaction
 * @returns Updated exit record
 *
 * @example
 * ```typescript
 * const completed = await completeExitClearance(
 *   'exit-456',
 *   true,
 *   5000
 * );
 * ```
 */
export declare function completeExitClearance(exitId: string, equipmentReturned: boolean, finalSettlement?: number, transaction?: Transaction): Promise<EmployeeExit>;
/**
 * Finalizes employee exit
 *
 * @param exitId - Exit identifier
 * @param transaction - Optional database transaction
 * @returns Updated employee and exit records
 *
 * @example
 * ```typescript
 * const result = await finalizeEmployeeExit('exit-456');
 * ```
 */
export declare function finalizeEmployeeExit(exitId: string, transaction?: Transaction): Promise<{
    employee: Employee;
    exit: EmployeeExit;
}>;
/**
 * Gets employees in notice period
 *
 * @param limit - Maximum number of records
 * @returns Employees in notice period
 *
 * @example
 * ```typescript
 * const inNotice = await getEmployeesInNoticePeriod(50);
 * ```
 */
export declare function getEmployeesInNoticePeriod(limit?: number): Promise<Employee[]>;
/**
 * Gets exit records by type
 *
 * @param exitType - Exit type
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Exit records
 *
 * @example
 * ```typescript
 * const resignations = await getExitsByType(
 *   ExitType.VOLUNTARY_RESIGNATION,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function getExitsByType(exitType: ExitType, startDate: Date, endDate: Date): Promise<EmployeeExit[]>;
/**
 * Processes employee retirement
 *
 * @param data - Retirement data
 * @param transaction - Optional database transaction
 * @returns Created retirement exit record
 *
 * @example
 * ```typescript
 * const retirement = await processRetirement({
 *   employeeId: 'emp-123',
 *   retirementDate: new Date('2024-12-31'),
 *   noticeDate: new Date('2024-06-01'),
 *   retirementType: 'normal',
 *   pensionEligible: true,
 *   knowledgeTransferPlan: 'Train successor over 6 months',
 *   emeritusStatus: true
 * });
 * ```
 */
export declare function processRetirement(data: RetirementData, transaction?: Transaction): Promise<EmployeeExit>;
/**
 * Gets employees eligible for retirement
 *
 * @param minAge - Minimum age for retirement
 * @param minYearsOfService - Minimum years of service
 * @returns Eligible employees
 *
 * @example
 * ```typescript
 * const eligible = await getRetirementEligibleEmployees(65, 10);
 * ```
 */
export declare function getRetirementEligibleEmployees(minAge?: number, minYearsOfService?: number): Promise<Employee[]>;
/**
 * Calculates retirement benefits
 *
 * @param employeeId - Employee identifier
 * @param retirementDate - Planned retirement date
 * @returns Retirement benefit calculation
 *
 * @example
 * ```typescript
 * const benefits = await calculateRetirementBenefits(
 *   'emp-123',
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function calculateRetirementBenefits(employeeId: string, retirementDate: Date): Promise<{
    yearsOfService: number;
    pensionEligible: boolean;
    estimatedPension: number;
    healthBenefitsContinuation: boolean;
}>;
/**
 * Gets upcoming retirements
 *
 * @param monthsAhead - Number of months to look ahead
 * @returns Upcoming retirement exit records
 *
 * @example
 * ```typescript
 * const upcoming = await getUpcomingRetirements(6);
 * ```
 */
export declare function getUpcomingRetirements(monthsAhead?: number): Promise<EmployeeExit[]>;
/**
 * Checks rehire eligibility for former employee
 *
 * @param formerEmployeeNumber - Former employee number
 * @returns Rehire eligibility check result
 *
 * @example
 * ```typescript
 * const eligibility = await checkRehireEligibility('EMP-2020-001234');
 * if (eligibility.rehireRecommendation) {
 *   // Proceed with rehire process
 * }
 * ```
 */
export declare function checkRehireEligibility(formerEmployeeNumber: string): Promise<RehireEligibilityCheck>;
/**
 * Processes boomerang employee rehire
 *
 * @param formerEmployeeNumber - Former employee number
 * @param registrationData - New employee registration data
 * @param transaction - Optional database transaction
 * @returns New employee record and rehire record
 *
 * @example
 * ```typescript
 * const result = await processBoomerangRehire(
 *   'EMP-2020-001234',
 *   {
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     email: 'john.doe@company.com',
 *     dateOfBirth: new Date('1990-01-15'),
 *     hireDate: new Date('2024-06-01'),
 *     positionId: 'pos-456',
 *     departmentId: 'dept-789',
 *     locationId: 'loc-123',
 *     employmentType: 'full_time',
 *     jobTitle: 'Senior Engineer'
 *   }
 * );
 * ```
 */
export declare function processBoomerangRehire(formerEmployeeNumber: string, registrationData: EmployeeRegistrationData, transaction?: Transaction): Promise<{
    employee: Employee;
    rehireRecord: RehireRecord;
}>;
/**
 * Gets boomerang employee statistics
 *
 * @param startDate - Period start date
 * @param endDate - Period end date
 * @returns Boomerang employee statistics
 *
 * @example
 * ```typescript
 * const stats = await getBoomerangEmployeeStats(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * console.log(`Rehire rate: ${stats.rehireRate}%`);
 * ```
 */
export declare function getBoomerangEmployeeStats(startDate: Date, endDate: Date): Promise<{
    totalRehires: number;
    byExitType: Record<string, number>;
    averageTimeToRehire: number;
    rehireRate: number;
}>;
/**
 * NestJS Injectable service for Employee Lifecycle Management
 *
 * @example
 * ```typescript
 * @Controller('employees')
 * export class EmployeesController {
 *   constructor(private readonly lifecycleService: EmployeeLifecycleService) {}
 *
 *   @Post('register')
 *   async registerEmployee(@Body() data: EmployeeRegistrationData) {
 *     return this.lifecycleService.registerEmployee(data);
 *   }
 * }
 * ```
 */
export declare class EmployeeLifecycleService {
    registerEmployee(data: EmployeeRegistrationData): Promise<Employee>;
    createOnboardingPlan(data: OnboardingPlanData): Promise<Onboarding>;
    startOnboarding(employeeId: string, actualStartDate: Date): Promise<{
        employee: Employee;
        onboarding: Onboarding;
    }>;
    createProbationPeriod(data: ProbationPeriodData): Promise<ProbationPeriod>;
    createTransferRequest(data: TransferRequestData): Promise<InternalTransfer>;
    createLeaveOfAbsence(data: LeaveOfAbsenceData): Promise<LeaveOfAbsence>;
    initiateEmployeeExit(data: EmployeeExitData): Promise<EmployeeExit>;
    checkRehireEligibility(formerEmployeeNumber: string): Promise<RehireEligibilityCheck>;
}
declare const _default: {
    Employee: typeof Employee;
    EmployeeLifecycleEvent: typeof EmployeeLifecycleEvent;
    Onboarding: typeof Onboarding;
    ProbationPeriod: typeof ProbationPeriod;
    InternalTransfer: typeof InternalTransfer;
    EmployeeRelocation: typeof EmployeeRelocation;
    LeaveOfAbsence: typeof LeaveOfAbsence;
    ReturnToWork: typeof ReturnToWork;
    EmployeeExit: typeof EmployeeExit;
    ExitInterview: typeof ExitInterview;
    RehireRecord: typeof RehireRecord;
    registerEmployee: typeof registerEmployee;
    generateEmployeeNumber: typeof generateEmployeeNumber;
    createOnboardingPlan: typeof createOnboardingPlan;
    updateOnboardingChecklistItem: typeof updateOnboardingChecklistItem;
    startOnboarding: typeof startOnboarding;
    completeOnboarding: typeof completeOnboarding;
    getOnboardingStatus: typeof getOnboardingStatus;
    getOnboardingsByStatus: typeof getOnboardingsByStatus;
    createProbationPeriod: typeof createProbationPeriod;
    extendProbationPeriod: typeof extendProbationPeriod;
    completeProbationEvaluation: typeof completeProbationEvaluation;
    getProbationPeriodsEndingSoon: typeof getProbationPeriodsEndingSoon;
    getProbationStatus: typeof getProbationStatus;
    createTransferRequest: typeof createTransferRequest;
    approveTransferRequest: typeof approveTransferRequest;
    executeTransfer: typeof executeTransfer;
    getPendingTransfers: typeof getPendingTransfers;
    getTransferHistory: typeof getTransferHistory;
    cancelTransferRequest: typeof cancelTransferRequest;
    createRelocationRequest: typeof createRelocationRequest;
    startRelocation: typeof startRelocation;
    completeRelocation: typeof completeRelocation;
    getActiveRelocations: typeof getActiveRelocations;
    createLeaveOfAbsence: typeof createLeaveOfAbsence;
    approveLeaveRequest: typeof approveLeaveRequest;
    startLeave: typeof startLeave;
    extendLeave: typeof extendLeave;
    denyLeaveRequest: typeof denyLeaveRequest;
    cancelLeaveRequest: typeof cancelLeaveRequest;
    getActiveLeaves: typeof getActiveLeaves;
    getLeavesEndingSoon: typeof getLeavesEndingSoon;
    processReturnToWork: typeof processReturnToWork;
    updateReturnToWorkPlan: typeof updateReturnToWorkPlan;
    getReturnToWorkFollowUps: typeof getReturnToWorkFollowUps;
    initiateEmployeeExit: typeof initiateEmployeeExit;
    conductExitInterview: typeof conductExitInterview;
    completeExitClearance: typeof completeExitClearance;
    finalizeEmployeeExit: typeof finalizeEmployeeExit;
    getEmployeesInNoticePeriod: typeof getEmployeesInNoticePeriod;
    getExitsByType: typeof getExitsByType;
    processRetirement: typeof processRetirement;
    getRetirementEligibleEmployees: typeof getRetirementEligibleEmployees;
    calculateRetirementBenefits: typeof calculateRetirementBenefits;
    getUpcomingRetirements: typeof getUpcomingRetirements;
    checkRehireEligibility: typeof checkRehireEligibility;
    processBoomerangRehire: typeof processBoomerangRehire;
    getBoomerangEmployeeStats: typeof getBoomerangEmployeeStats;
    EmployeeLifecycleService: typeof EmployeeLifecycleService;
};
export default _default;
//# sourceMappingURL=employee-lifecycle-kit.d.ts.map