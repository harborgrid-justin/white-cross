/**
 * LOC: HCMBEN12345
 * File: /reuse/server/human-capital/benefits-administration-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Benefits controllers
 *   - Enrollment services
 *   - Benefits analytics services
 */
/**
 * File: /reuse/server/human-capital/benefits-administration-kit.ts
 * Locator: WC-HCM-BEN-001
 * Purpose: Enterprise Benefits Administration System - SAP SuccessFactors Benefits parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, benefits services, enrollment engines, analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 48 utility functions for benefits plan management, enrollment processing, open enrollment,
 *          life events, qualifying events, eligibility rules, health insurance, retirement plans,
 *          FSA/HSA administration, PTO accrual & tracking, leave management, benefits costing,
 *          COBRA administration, benefits statements, and benefits analytics
 *
 * LLM Context: Enterprise-grade benefits administration system competing with SAP SuccessFactors Benefits.
 * Provides complete benefits lifecycle management including benefits plan design & management, enrollment
 * processing, open enrollment periods, life event processing, qualifying event handling, eligibility rules
 * engine, health insurance administration, dental & vision benefits, retirement plan administration (401k,
 * pension), flexible spending accounts (FSA/HSA), paid time off (PTO) accrual & tracking, leave benefits
 * management (FMLA, parental, medical), benefits cost calculations, COBRA administration, benefits
 * statements & communication, benefits analytics, and utilization reporting.
 */
import { Sequelize } from 'sequelize';
/**
 * Benefits plan type
 */
export declare enum BenefitsPlanType {
    HEALTH_INSURANCE = "health_insurance",
    DENTAL_INSURANCE = "dental_insurance",
    VISION_INSURANCE = "vision_insurance",
    LIFE_INSURANCE = "life_insurance",
    DISABILITY = "disability",
    RETIREMENT_401K = "retirement_401k",
    PENSION = "pension",
    FSA = "fsa",
    HSA = "hsa",
    PTO = "pto",
    WELLNESS = "wellness",
    TUITION_REIMBURSEMENT = "tuition_reimbursement"
}
/**
 * Enrollment status
 */
export declare enum EnrollmentStatus {
    PENDING = "pending",
    ACTIVE = "active",
    COMPLETED = "completed",
    WAIVED = "waived",
    CANCELLED = "cancelled",
    TERMINATED = "terminated"
}
/**
 * Coverage tier
 */
export declare enum CoverageTier {
    EMPLOYEE_ONLY = "employee_only",
    EMPLOYEE_SPOUSE = "employee_spouse",
    EMPLOYEE_CHILDREN = "employee_children",
    FAMILY = "family"
}
/**
 * Life event type
 */
export declare enum LifeEventType {
    MARRIAGE = "marriage",
    DIVORCE = "divorce",
    BIRTH = "birth",
    ADOPTION = "adoption",
    DEATH_OF_DEPENDENT = "death_of_dependent",
    LOSS_OF_COVERAGE = "loss_of_coverage",
    EMPLOYMENT_STATUS_CHANGE = "employment_status_change",
    RELOCATION = "relocation"
}
/**
 * Leave type
 */
export declare enum LeaveType {
    FMLA = "fmla",
    PARENTAL = "parental",
    MEDICAL = "medical",
    MILITARY = "military",
    PERSONAL = "personal",
    BEREAVEMENT = "bereavement",
    JURY_DUTY = "jury_duty",
    SABBATICAL = "sabbatical"
}
/**
 * Leave status
 */
export declare enum LeaveStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DENIED = "denied",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * PTO accrual frequency
 */
export declare enum PTOAccrualFrequency {
    HOURLY = "hourly",
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    ANNUALLY = "annually"
}
/**
 * COBRA event type
 */
export declare enum COBRAEventType {
    TERMINATION = "termination",
    REDUCTION_OF_HOURS = "reduction_of_hours",
    MEDICARE_ENTITLEMENT = "medicare_entitlement",
    DIVORCE = "divorce",
    DEATH = "death",
    LOSS_OF_DEPENDENT_STATUS = "loss_of_dependent_status"
}
/**
 * Benefits plan interface
 */
export interface BenefitsPlan {
    id: string;
    planCode: string;
    planName: string;
    planType: BenefitsPlanType;
    carrier?: string;
    policyNumber?: string;
    effectiveDate: Date;
    endDate?: Date;
    coverageTiers: CoverageTier[];
    employeeCost: Record<CoverageTier, number>;
    employerCost: Record<CoverageTier, number>;
    totalCost: Record<CoverageTier, number>;
    eligibilityRules: EligibilityRule[];
    planDetails: any;
    isActive: boolean;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Eligibility rule interface
 */
export interface EligibilityRule {
    id: string;
    ruleType: 'employment_type' | 'hours_worked' | 'tenure' | 'job_level' | 'location';
    operator: 'equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
    value: any;
    waitingPeriodDays?: number;
}
/**
 * Benefits enrollment interface
 */
export interface BenefitsEnrollment {
    id: string;
    employeeId: string;
    planId: string;
    enrollmentPeriodId?: string;
    planType: BenefitsPlanType;
    planName: string;
    coverageTier: CoverageTier;
    effectiveDate: Date;
    endDate?: Date;
    status: EnrollmentStatus;
    employeeCost: number;
    employerCost: number;
    totalCost: number;
    dependents: Dependent[];
    beneficiaries: Beneficiary[];
    elections: any;
    lifeEventId?: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Dependent interface
 */
export interface Dependent {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    relationship: 'spouse' | 'child' | 'domestic_partner';
    ssn?: string;
    isStudent?: boolean;
    metadata: Record<string, any>;
}
/**
 * Beneficiary interface
 */
export interface Beneficiary {
    id: string;
    firstName: string;
    lastName: string;
    relationship: string;
    percentage: number;
    isPrimary: boolean;
    contactInfo: any;
}
/**
 * Open enrollment period interface
 */
export interface OpenEnrollmentPeriod {
    id: string;
    periodCode: string;
    periodName: string;
    planYear: number;
    startDate: Date;
    endDate: Date;
    effectiveDate: Date;
    status: 'scheduled' | 'active' | 'closed';
    eligiblePlans: string[];
    participantCount: number;
    completedCount: number;
    completionRate: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Life event interface
 */
export interface LifeEvent {
    id: string;
    employeeId: string;
    eventType: LifeEventType;
    eventDate: Date;
    reportedDate: Date;
    description: string;
    documentation: any[];
    enrollmentDeadline: Date;
    isQualifyingEvent: boolean;
    status: 'pending' | 'verified' | 'processed' | 'expired';
    enrollmentChanges: string[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * PTO policy interface
 */
export interface PTOPolicy {
    id: string;
    policyCode: string;
    policyName: string;
    ptoType: 'vacation' | 'sick' | 'personal' | 'combined';
    accrualFrequency: PTOAccrualFrequency;
    accrualRate: number;
    accrualStartDate: Date;
    maxAccrualBalance?: number;
    carryoverAllowed: boolean;
    carryoverMaxDays?: number;
    waitingPeriodDays: number;
    eligibilityRules: EligibilityRule[];
    effectiveDate: Date;
    endDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * PTO balance interface
 */
export interface PTOBalance {
    id: string;
    employeeId: string;
    policyId: string;
    ptoType: string;
    availableHours: number;
    pendingHours: number;
    usedHours: number;
    accrualRate: number;
    nextAccrualDate: Date;
    nextAccrualAmount: number;
    asOfDate: Date;
    metadata: Record<string, any>;
}
/**
 * Leave request interface
 */
export interface LeaveRequest {
    id: string;
    employeeId: string;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    totalDays: number;
    totalHours: number;
    reason: string;
    status: LeaveStatus;
    approvedBy?: string;
    approvedAt?: Date;
    denialReason?: string;
    isPaid: boolean;
    affectsBalance: boolean;
    documentation: any[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Retirement plan interface
 */
export interface RetirementPlan {
    id: string;
    planCode: string;
    planName: string;
    planType: '401k' | '403b' | 'pension' | 'roth_401k';
    employeeContributionPercent: number;
    employeeContributionMax?: number;
    employerMatch: MatchFormula[];
    vestingSchedule: VestingSchedule[];
    effectiveDate: Date;
    endDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Match formula interface
 */
export interface MatchFormula {
    upToPercent: number;
    matchRate: number;
}
/**
 * Vesting schedule interface
 */
export interface VestingSchedule {
    yearsOfService: number;
    vestingPercent: number;
}
/**
 * Retirement enrollment interface
 */
export interface RetirementEnrollment {
    id: string;
    employeeId: string;
    planId: string;
    contributionPercent: number;
    contributionAmount: number;
    employerMatchAmount: number;
    totalContribution: number;
    enrollmentDate: Date;
    effectiveDate: Date;
    vestingPercent: number;
    vestedAmount: number;
    status: EnrollmentStatus;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * FSA/HSA account interface
 */
export interface FlexibleSpendingAccount {
    id: string;
    employeeId: string;
    accountType: 'fsa' | 'hsa' | 'dependent_care_fsa';
    planYear: number;
    annualElection: number;
    employerContribution: number;
    totalContribution: number;
    availableBalance: number;
    usedAmount: number;
    pendingClaims: number;
    effectiveDate: Date;
    endDate: Date;
    rolloverAmount?: number;
    status: 'active' | 'inactive' | 'expired';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * COBRA continuation interface
 */
export interface COBRAContinuation {
    id: string;
    employeeId: string;
    qualifyingEvent: COBRAEventType;
    eventDate: Date;
    notificationDate: Date;
    electionDeadline: Date;
    coverageEndDate: Date;
    maxCoverageDuration: number;
    monthlyPremium: number;
    coveredPlans: string[];
    status: 'notified' | 'elected' | 'waived' | 'active' | 'terminated';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Benefits statement interface
 */
export interface BenefitsStatement {
    id: string;
    employeeId: string;
    statementYear: number;
    statementDate: Date;
    healthInsuranceValue: number;
    dentalVisionValue: number;
    lifeInsuranceValue: number;
    disabilityValue: number;
    retirementContribution: number;
    retirementMatch: number;
    fsaHsaValue: number;
    ptoValue: number;
    wellnessValue: number;
    otherBenefitsValue: number;
    totalBenefitsValue: number;
    employeeContribution: number;
    employerContribution: number;
    metadata: Record<string, any>;
    generatedAt: Date;
}
/**
 * Create benefits plan DTO
 */
export declare class CreateBenefitsPlanDto {
    planCode: string;
    planName: string;
    planType: BenefitsPlanType;
    carrier?: string;
    effectiveDate: Date;
    coverageTiers: CoverageTier[];
    employeeCost: Record<CoverageTier, number>;
    employerCost: Record<CoverageTier, number>;
}
/**
 * Create enrollment DTO
 */
export declare class CreateEnrollmentDto {
    employeeId: string;
    planId: string;
    coverageTier: CoverageTier;
    effectiveDate: Date;
    dependents?: Dependent[];
    beneficiaries?: Beneficiary[];
}
/**
 * Report life event DTO
 */
export declare class ReportLifeEventDto {
    employeeId: string;
    eventType: LifeEventType;
    eventDate: Date;
    description: string;
    documentation?: any[];
}
/**
 * Request leave DTO
 */
export declare class RequestLeaveDto {
    employeeId: string;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    reason: string;
    isPaid: boolean;
}
/**
 * Create PTO policy DTO
 */
export declare class CreatePTOPolicyDto {
    policyCode: string;
    policyName: string;
    ptoType: 'vacation' | 'sick' | 'personal' | 'combined';
    accrualFrequency: PTOAccrualFrequency;
    accrualRate: number;
    carryoverAllowed: boolean;
}
/**
 * Create retirement enrollment DTO
 */
export declare class CreateRetirementEnrollmentDto {
    employeeId: string;
    planId: string;
    contributionPercent: number;
    effectiveDate: Date;
}
/**
 * Sequelize model for Benefits Plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BenefitsPlan model
 *
 * @example
 * ```typescript
 * const BenefitsPlan = createBenefitsPlanModel(sequelize);
 * const plan = await BenefitsPlan.create({
 *   planCode: 'HEALTH2025',
 *   planName: 'Premium Health Plan',
 *   planType: 'health_insurance',
 *   carrier: 'Blue Cross'
 * });
 * ```
 */
export declare const createBenefitsPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        planCode: string;
        planName: string;
        planType: string;
        carrier: string | null;
        policyNumber: string | null;
        effectiveDate: Date;
        endDate: Date | null;
        coverageTiers: string[];
        employeeCost: Record<string, number>;
        employerCost: Record<string, number>;
        totalCost: Record<string, number>;
        eligibilityRules: any[];
        planDetails: any;
        isActive: boolean;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Benefits Enrollment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BenefitsEnrollment model
 */
export declare const createBenefitsEnrollmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        planId: string;
        enrollmentPeriodId: string | null;
        planType: string;
        planName: string;
        coverageTier: string;
        effectiveDate: Date;
        endDate: Date | null;
        status: string;
        employeeCost: number;
        employerCost: number;
        totalCost: number;
        dependents: any[];
        beneficiaries: any[];
        elections: any;
        lifeEventId: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Open Enrollment Period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OpenEnrollmentPeriod model
 */
export declare const createOpenEnrollmentPeriodModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        periodCode: string;
        periodName: string;
        planYear: number;
        startDate: Date;
        endDate: Date;
        effectiveDate: Date;
        status: string;
        eligiblePlans: string[];
        participantCount: number;
        completedCount: number;
        completionRate: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for PTO Balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PTOBalance model
 */
export declare const createPTOBalanceModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        policyId: string;
        ptoType: string;
        availableHours: number;
        pendingHours: number;
        usedHours: number;
        accrualRate: number;
        nextAccrualDate: Date;
        nextAccrualAmount: number;
        asOfDate: Date;
        metadata: Record<string, any>;
    };
};
/**
 * Creates comprehensive benefits plan.
 *
 * @param {CreateBenefitsPlanDto} planData - Plan data
 * @returns {Promise<BenefitsPlan>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createBenefitsPlan({
 *   planCode: 'HEALTH2025',
 *   planName: 'Premium Health Plan',
 *   planType: BenefitsPlanType.HEALTH_INSURANCE,
 *   carrier: 'Blue Cross Blue Shield',
 *   effectiveDate: new Date('2025-01-01')
 * });
 * ```
 */
export declare const createBenefitsPlan: (planData: CreateBenefitsPlanDto) => Promise<BenefitsPlan>;
/**
 * Updates benefits plan details and costs.
 *
 * @param {string} planId - Plan ID
 * @param {object} updates - Update data
 * @returns {Promise<BenefitsPlan>} Updated plan
 *
 * @example
 * ```typescript
 * const updated = await updateBenefitsPlan('plan-123', {
 *   employeeCost: { employee_only: 150 }
 * });
 * ```
 */
export declare const updateBenefitsPlan: (planId: string, updates: any) => Promise<BenefitsPlan>;
/**
 * Retrieves available benefits plans for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} effectiveDate - Effective date
 * @returns {Promise<BenefitsPlan[]>} Available plans
 *
 * @example
 * ```typescript
 * const plans = await getAvailablePlansForEmployee('emp-123', new Date());
 * ```
 */
export declare const getAvailablePlansForEmployee: (employeeId: string, effectiveDate: Date) => Promise<BenefitsPlan[]>;
/**
 * Calculates benefits plan costs by coverage tier.
 *
 * @param {BenefitsPlan} plan - Benefits plan
 * @param {CoverageTier} tier - Coverage tier
 * @returns {object} Cost breakdown
 *
 * @example
 * ```typescript
 * const costs = calculatePlanCosts(plan, CoverageTier.FAMILY);
 * // Returns: { employeeCost: 400, employerCost: 800, totalCost: 1200 }
 * ```
 */
export declare const calculatePlanCosts: (plan: BenefitsPlan, tier: CoverageTier) => any;
/**
 * Validates benefits plan configuration.
 *
 * @param {BenefitsPlan} plan - Benefits plan
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateBenefitsPlan(plan);
 * ```
 */
export declare const validateBenefitsPlan: (plan: BenefitsPlan) => any;
/**
 * Processes benefits enrollment for employee.
 *
 * @param {CreateEnrollmentDto} enrollmentData - Enrollment data
 * @returns {Promise<BenefitsEnrollment>} Created enrollment
 *
 * @example
 * ```typescript
 * const enrollment = await processBenefitsEnrollment({
 *   employeeId: 'emp-123',
 *   planId: 'plan-456',
 *   coverageTier: CoverageTier.FAMILY,
 *   effectiveDate: new Date('2025-01-01')
 * });
 * ```
 */
export declare const processBenefitsEnrollment: (enrollmentData: CreateEnrollmentDto) => Promise<BenefitsEnrollment>;
/**
 * Validates enrollment eligibility.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await validateEnrollmentEligibility('emp-123', 'plan-456');
 * ```
 */
export declare const validateEnrollmentEligibility: (employeeId: string, planId: string) => Promise<any>;
/**
 * Updates existing enrollment.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {object} updates - Update data
 * @returns {Promise<BenefitsEnrollment>} Updated enrollment
 *
 * @example
 * ```typescript
 * const updated = await updateEnrollment('enroll-123', {
 *   coverageTier: CoverageTier.FAMILY,
 *   dependents: [newDependent]
 * });
 * ```
 */
export declare const updateEnrollment: (enrollmentId: string, updates: any) => Promise<BenefitsEnrollment>;
/**
 * Terminates benefits enrollment.
 *
 * @param {string} enrollmentId - Enrollment ID
 * @param {Date} terminationDate - Termination date
 * @param {string} reason - Termination reason
 * @returns {Promise<BenefitsEnrollment>} Terminated enrollment
 *
 * @example
 * ```typescript
 * const terminated = await terminateEnrollment('enroll-123', new Date(), 'Employee termination');
 * ```
 */
export declare const terminateEnrollment: (enrollmentId: string, terminationDate: Date, reason: string) => Promise<BenefitsEnrollment>;
/**
 * Retrieves employee enrollment summary.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<object>} Enrollment summary
 *
 * @example
 * ```typescript
 * const summary = await getEmployeeEnrollmentSummary('emp-123');
 * ```
 */
export declare const getEmployeeEnrollmentSummary: (employeeId: string) => Promise<any>;
/**
 * Creates open enrollment period.
 *
 * @param {object} periodData - Period data
 * @returns {Promise<OpenEnrollmentPeriod>} Created period
 *
 * @example
 * ```typescript
 * const period = await createOpenEnrollmentPeriod({
 *   periodName: '2025 Open Enrollment',
 *   planYear: 2025,
 *   startDate: new Date('2024-11-01'),
 *   endDate: new Date('2024-11-30'),
 *   effectiveDate: new Date('2025-01-01')
 * });
 * ```
 */
export declare const createOpenEnrollmentPeriod: (periodData: any) => Promise<OpenEnrollmentPeriod>;
/**
 * Opens enrollment period for employee participation.
 *
 * @param {string} periodId - Period ID
 * @returns {Promise<OpenEnrollmentPeriod>} Opened period
 *
 * @example
 * ```typescript
 * const opened = await openEnrollmentPeriod('period-123');
 * ```
 */
export declare const openEnrollmentPeriod: (periodId: string) => Promise<OpenEnrollmentPeriod>;
/**
 * Tracks open enrollment participation progress.
 *
 * @param {string} periodId - Period ID
 * @returns {Promise<object>} Progress metrics
 *
 * @example
 * ```typescript
 * const progress = await trackEnrollmentProgress('period-123');
 * ```
 */
export declare const trackEnrollmentProgress: (periodId: string) => Promise<any>;
/**
 * Sends enrollment reminders to pending employees.
 *
 * @param {string} periodId - Period ID
 * @returns {Promise<object>} Reminder results
 *
 * @example
 * ```typescript
 * const sent = await sendEnrollmentReminders('period-123');
 * ```
 */
export declare const sendEnrollmentReminders: (periodId: string) => Promise<any>;
/**
 * Closes open enrollment period.
 *
 * @param {string} periodId - Period ID
 * @returns {Promise<OpenEnrollmentPeriod>} Closed period
 *
 * @example
 * ```typescript
 * const closed = await closeEnrollmentPeriod('period-123');
 * ```
 */
export declare const closeEnrollmentPeriod: (periodId: string) => Promise<OpenEnrollmentPeriod>;
/**
 * Reports qualifying life event.
 *
 * @param {ReportLifeEventDto} eventData - Life event data
 * @returns {Promise<LifeEvent>} Created life event
 *
 * @example
 * ```typescript
 * const event = await reportLifeEvent({
 *   employeeId: 'emp-123',
 *   eventType: LifeEventType.MARRIAGE,
 *   eventDate: new Date('2025-06-15'),
 *   description: 'Employee got married'
 * });
 * ```
 */
export declare const reportLifeEvent: (eventData: ReportLifeEventDto) => Promise<LifeEvent>;
/**
 * Validates qualifying event for enrollment changes.
 *
 * @param {string} eventId - Life event ID
 * @returns {Promise<object>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateQualifyingEvent('event-123');
 * ```
 */
export declare const validateQualifyingEvent: (eventId: string) => Promise<any>;
/**
 * Processes life event enrollment changes.
 *
 * @param {string} eventId - Life event ID
 * @param {BenefitsEnrollment[]} enrollmentChanges - Enrollment changes
 * @returns {Promise<LifeEvent>} Processed event
 *
 * @example
 * ```typescript
 * const processed = await processLifeEventChanges('event-123', enrollmentChanges);
 * ```
 */
export declare const processLifeEventChanges: (eventId: string, enrollmentChanges: BenefitsEnrollment[]) => Promise<LifeEvent>;
/**
 * Retrieves eligible life event changes.
 *
 * @param {string} eventId - Life event ID
 * @returns {Promise<object>} Eligible changes
 *
 * @example
 * ```typescript
 * const changes = await getEligibleLifeEventChanges('event-123');
 * ```
 */
export declare const getEligibleLifeEventChanges: (eventId: string) => Promise<any>;
/**
 * Tracks life event deadlines and compliance.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<object>} Deadline tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackLifeEventDeadlines('emp-123');
 * ```
 */
export declare const trackLifeEventDeadlines: (employeeId: string) => Promise<any>;
/**
 * Evaluates benefits eligibility rules.
 *
 * @param {string} employeeId - Employee ID
 * @param {EligibilityRule[]} rules - Eligibility rules
 * @returns {Promise<object>} Eligibility result
 *
 * @example
 * ```typescript
 * const eligibility = await evaluateEligibilityRules('emp-123', rules);
 * ```
 */
export declare const evaluateEligibilityRules: (employeeId: string, rules: EligibilityRule[]) => Promise<any>;
/**
 * Calculates waiting period for benefits.
 *
 * @param {Date} hireDate - Employee hire date
 * @param {number} waitingPeriodDays - Waiting period
 * @returns {Date} Eligibility date
 *
 * @example
 * ```typescript
 * const eligibleDate = calculateWaitingPeriod(new Date('2025-01-15'), 90);
 * // Returns: 2025-04-15
 * ```
 */
export declare const calculateWaitingPeriod: (hireDate: Date, waitingPeriodDays: number) => Date;
/**
 * Generates eligibility report for population.
 *
 * @param {string} companyId - Company ID
 * @returns {Promise<object>} Eligibility report
 *
 * @example
 * ```typescript
 * const report = await generateEligibilityReport('company-123');
 * ```
 */
export declare const generateEligibilityReport: (companyId: string) => Promise<any>;
/**
 * Creates PTO policy with accrual rules.
 *
 * @param {CreatePTOPolicyDto} policyData - Policy data
 * @returns {Promise<PTOPolicy>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createPTOPolicy({
 *   policyCode: 'PTO2025',
 *   policyName: 'Standard Vacation',
 *   ptoType: 'vacation',
 *   accrualFrequency: PTOAccrualFrequency.MONTHLY,
 *   accrualRate: 10,
 *   carryoverAllowed: true
 * });
 * ```
 */
export declare const createPTOPolicy: (policyData: CreatePTOPolicyDto) => Promise<PTOPolicy>;
/**
 * Calculates PTO accrual for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {PTOPolicy} policy - PTO policy
 * @param {Date} accrualDate - Accrual date
 * @returns {number} Accrual amount (hours)
 *
 * @example
 * ```typescript
 * const accrued = calculatePTOAccrual('emp-123', policy, new Date());
 * ```
 */
export declare const calculatePTOAccrual: (employeeId: string, policy: PTOPolicy, accrualDate: Date) => number;
/**
 * Processes PTO accrual for period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} policyId - Policy ID
 * @returns {Promise<PTOBalance>} Updated balance
 *
 * @example
 * ```typescript
 * const balance = await processPTOAccrual('emp-123', 'policy-456');
 * ```
 */
export declare const processPTOAccrual: (employeeId: string, policyId: string) => Promise<PTOBalance>;
/**
 * Retrieves PTO balance for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} ptoType - PTO type
 * @returns {Promise<PTOBalance>} PTO balance
 *
 * @example
 * ```typescript
 * const balance = await getPTOBalance('emp-123', 'vacation');
 * ```
 */
export declare const getPTOBalance: (employeeId: string, ptoType: string) => Promise<PTOBalance>;
/**
 * Tracks PTO usage and trends.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Usage report
 *
 * @example
 * ```typescript
 * const usage = await trackPTOUsage('emp-123', startDate, endDate);
 * ```
 */
export declare const trackPTOUsage: (employeeId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Submits leave request.
 *
 * @param {RequestLeaveDto} leaveData - Leave request data
 * @returns {Promise<LeaveRequest>} Created request
 *
 * @example
 * ```typescript
 * const request = await submitLeaveRequest({
 *   employeeId: 'emp-123',
 *   leaveType: LeaveType.FMLA,
 *   startDate: new Date('2025-03-01'),
 *   endDate: new Date('2025-03-31'),
 *   reason: 'Medical leave',
 *   isPaid: true
 * });
 * ```
 */
export declare const submitLeaveRequest: (leaveData: RequestLeaveDto) => Promise<LeaveRequest>;
/**
 * Approves leave request.
 *
 * @param {string} requestId - Request ID
 * @param {string} approverId - Approver ID
 * @returns {Promise<LeaveRequest>} Approved request
 *
 * @example
 * ```typescript
 * const approved = await approveLeaveRequest('request-123', 'manager-456');
 * ```
 */
export declare const approveLeaveRequest: (requestId: string, approverId: string) => Promise<LeaveRequest>;
/**
 * Tracks FMLA eligibility and usage.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<object>} FMLA tracking
 *
 * @example
 * ```typescript
 * const fmla = await trackFMLAEligibility('emp-123');
 * ```
 */
export declare const trackFMLAEligibility: (employeeId: string) => Promise<any>;
/**
 * Calculates leave balance impact.
 *
 * @param {string} employeeId - Employee ID
 * @param {LeaveRequest} leaveRequest - Leave request
 * @returns {Promise<object>} Balance impact
 *
 * @example
 * ```typescript
 * const impact = await calculateLeaveBalanceImpact('emp-123', request);
 * ```
 */
export declare const calculateLeaveBalanceImpact: (employeeId: string, leaveRequest: LeaveRequest) => Promise<any>;
/**
 * Generates leave analytics report.
 *
 * @param {string} departmentId - Department ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Leave analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateLeaveAnalytics('dept-123', start, end);
 * ```
 */
export declare const generateLeaveAnalytics: (departmentId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Enrolls employee in retirement plan.
 *
 * @param {CreateRetirementEnrollmentDto} enrollmentData - Enrollment data
 * @returns {Promise<RetirementEnrollment>} Enrollment record
 *
 * @example
 * ```typescript
 * const enrollment = await enrollInRetirementPlan({
 *   employeeId: 'emp-123',
 *   planId: 'plan-401k',
 *   contributionPercent: 6,
 *   effectiveDate: new Date()
 * });
 * ```
 */
export declare const enrollInRetirementPlan: (enrollmentData: CreateRetirementEnrollmentDto) => Promise<RetirementEnrollment>;
/**
 * Calculates employer matching contribution.
 *
 * @param {number} employeeContribution - Employee contribution
 * @param {MatchFormula[]} matchFormula - Match formula
 * @returns {number} Employer match amount
 *
 * @example
 * ```typescript
 * const match = calculateEmployerMatch(6000, matchFormula);
 * ```
 */
export declare const calculateEmployerMatch: (employeeContribution: number, matchFormula: MatchFormula[]) => number;
/**
 * Calculates vesting percentage based on tenure.
 *
 * @param {Date} hireDate - Hire date
 * @param {VestingSchedule[]} vestingSchedule - Vesting schedule
 * @returns {number} Vesting percentage
 *
 * @example
 * ```typescript
 * const vested = calculateVestingPercentage(hireDate, schedule);
 * ```
 */
export declare const calculateVestingPercentage: (hireDate: Date, vestingSchedule: VestingSchedule[]) => number;
/**
 * Generates retirement plan summary.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<object>} Retirement summary
 *
 * @example
 * ```typescript
 * const summary = await generateRetirementSummary('emp-123');
 * ```
 */
export declare const generateRetirementSummary: (employeeId: string) => Promise<any>;
/**
 * Creates FSA/HSA account election.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} accountType - Account type
 * @param {number} annualElection - Annual election amount
 * @returns {Promise<FlexibleSpendingAccount>} Created account
 *
 * @example
 * ```typescript
 * const fsa = await createFSAHSAElection('emp-123', 'fsa', 2750);
 * ```
 */
export declare const createFSAHSAElection: (employeeId: string, accountType: string, annualElection: number) => Promise<FlexibleSpendingAccount>;
/**
 * Processes FSA/HSA claim.
 *
 * @param {string} accountId - Account ID
 * @param {number} claimAmount - Claim amount
 * @param {string} description - Claim description
 * @returns {Promise<object>} Claim result
 *
 * @example
 * ```typescript
 * const claim = await processFSAHSAClaim('account-123', 150, 'Prescription');
 * ```
 */
export declare const processFSAHSAClaim: (accountId: string, claimAmount: number, description: string) => Promise<any>;
/**
 * Calculates FSA use-it-or-lose-it deadline.
 *
 * @param {FlexibleSpendingAccount} account - FSA account
 * @returns {Date} Deadline date
 *
 * @example
 * ```typescript
 * const deadline = calculateFSADeadline(fsaAccount);
 * ```
 */
export declare const calculateFSADeadline: (account: FlexibleSpendingAccount) => Date;
/**
 * Tracks FSA/HSA utilization.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} year - Plan year
 * @returns {Promise<object>} Utilization report
 *
 * @example
 * ```typescript
 * const utilization = await trackFSAHSAUtilization('emp-123', 2025);
 * ```
 */
export declare const trackFSAHSAUtilization: (employeeId: string, year: number) => Promise<any>;
/**
 * Initiates COBRA continuation.
 *
 * @param {string} employeeId - Employee ID
 * @param {COBRAEventType} eventType - Qualifying event
 * @param {Date} eventDate - Event date
 * @returns {Promise<COBRAContinuation>} COBRA record
 *
 * @example
 * ```typescript
 * const cobra = await initiateCOBRAContinuation('emp-123', COBRAEventType.TERMINATION, new Date());
 * ```
 */
export declare const initiateCOBRAContinuation: (employeeId: string, eventType: COBRAEventType, eventDate: Date) => Promise<COBRAContinuation>;
/**
 * Processes COBRA election.
 *
 * @param {string} cobraId - COBRA ID
 * @param {boolean} elected - Election choice
 * @returns {Promise<COBRAContinuation>} Updated COBRA
 *
 * @example
 * ```typescript
 * const updated = await processCOBRAElection('cobra-123', true);
 * ```
 */
export declare const processCOBRAElection: (cobraId: string, elected: boolean) => Promise<COBRAContinuation>;
/**
 * Tracks COBRA premium payments.
 *
 * @param {string} cobraId - COBRA ID
 * @returns {Promise<object>} Payment tracking
 *
 * @example
 * ```typescript
 * const payments = await trackCOBRAPayments('cobra-123');
 * ```
 */
export declare const trackCOBRAPayments: (cobraId: string) => Promise<any>;
/**
 * Generates benefits statement for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} year - Statement year
 * @returns {Promise<BenefitsStatement>} Benefits statement
 *
 * @example
 * ```typescript
 * const statement = await generateBenefitsStatement('emp-123', 2025);
 * ```
 */
export declare const generateBenefitsStatement: (employeeId: string, year: number) => Promise<BenefitsStatement>;
/**
 * Calculates total benefits value for employee.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<number>} Total benefits value
 *
 * @example
 * ```typescript
 * const total = await calculateTotalBenefitsValue('emp-123');
 * ```
 */
export declare const calculateTotalBenefitsValue: (employeeId: string) => Promise<number>;
/**
 * Generates benefits utilization analytics.
 *
 * @param {string} companyId - Company ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Utilization analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateBenefitsUtilizationAnalytics('company-123', start, end);
 * ```
 */
export declare const generateBenefitsUtilizationAnalytics: (companyId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Generates benefits cost analysis report.
 *
 * @param {string} companyId - Company ID
 * @param {number} year - Analysis year
 * @returns {Promise<object>} Cost analysis
 *
 * @example
 * ```typescript
 * const analysis = await generateBenefitsCostAnalysis('company-123', 2025);
 * ```
 */
export declare const generateBenefitsCostAnalysis: (companyId: string, year: number) => Promise<any>;
//# sourceMappingURL=benefits-administration-kit.d.ts.map