/**
 * LOC: HCMCOMP12345
 * File: /reuse/server/human-capital/compensation-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - ../../error-handling-kit.ts
 *   - ../../validation-kit.ts
 *   - ../../auditing-utils.ts
 *
 * DOWNSTREAM (imported by):
 *   - Backend HR services
 *   - Compensation controllers
 *   - Payroll integration services
 *   - Analytics and reporting services
 */
/**
 * File: /reuse/server/human-capital/compensation-management-kit.ts
 * Locator: WC-HCM-COMP-001
 * Purpose: Enterprise Compensation Management System - SAP SuccessFactors Compensation parity
 *
 * Upstream: Error handling, validation, auditing utilities
 * Downstream: ../backend/*, HR controllers, compensation services, payroll integration, analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 50 utility functions for compensation planning, salary structures, pay grades, merit increases,
 *          bonuses, market benchmarking, equity analysis, total rewards, variable pay, commissions,
 *          long-term incentives, stock options, and compensation analytics
 *
 * LLM Context: Enterprise-grade compensation management system competing with SAP SuccessFactors Compensation.
 * Provides complete compensation lifecycle management including compensation planning & budgeting, salary structure
 * design, pay grade management, salary range administration, merit increase calculations, bonus computations,
 * compensation review cycles, market data analysis, pay equity analysis, total rewards statements, variable pay
 * & incentive management, commission calculations, sales compensation, long-term incentive plans (LTI), stock
 * option administration, compensation analytics, and seamless payroll integration.
 */
import { Sequelize } from 'sequelize';
/**
 * Compensation plan status
 */
export declare enum CompensationPlanStatus {
    DRAFT = "draft",
    IN_REVIEW = "in_review",
    APPROVED = "approved",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
/**
 * Compensation review cycle status
 */
export declare enum CompensationCycleStatus {
    PLANNING = "planning",
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    CLOSED = "closed"
}
/**
 * Pay grade type
 */
export declare enum PayGradeType {
    EXEMPT = "exempt",
    NON_EXEMPT = "non_exempt",
    HOURLY = "hourly",
    SALARIED = "salaried",
    EXECUTIVE = "executive"
}
/**
 * Compensation adjustment type
 */
export declare enum CompensationAdjustmentType {
    MERIT_INCREASE = "merit_increase",
    PROMOTION = "promotion",
    MARKET_ADJUSTMENT = "market_adjustment",
    COST_OF_LIVING = "cost_of_living",
    EQUITY_ADJUSTMENT = "equity_adjustment",
    RETENTION = "retention",
    PERFORMANCE_BONUS = "performance_bonus",
    SPECIAL_RECOGNITION = "special_recognition"
}
/**
 * Bonus type
 */
export declare enum BonusType {
    ANNUAL_PERFORMANCE = "annual_performance",
    SIGNING = "signing",
    RETENTION = "retention",
    SPOT = "spot",
    PROJECT_COMPLETION = "project_completion",
    REFERRAL = "referral",
    SALES_ACHIEVEMENT = "sales_achievement"
}
/**
 * Commission structure type
 */
export declare enum CommissionStructureType {
    FLAT_RATE = "flat_rate",
    TIERED = "tiered",
    PROGRESSIVE = "progressive",
    DRAW_AGAINST = "draw_against",
    RESIDUAL = "residual"
}
/**
 * Long-term incentive type
 */
export declare enum LTIType {
    STOCK_OPTIONS = "stock_options",
    RESTRICTED_STOCK_UNITS = "rsu",
    PERFORMANCE_SHARES = "performance_shares",
    STOCK_APPRECIATION_RIGHTS = "sar",
    PHANTOM_STOCK = "phantom_stock"
}
/**
 * Vesting schedule type
 */
export declare enum VestingScheduleType {
    CLIFF = "cliff",
    GRADED = "graded",
    PERFORMANCE_BASED = "performance_based",
    TIME_BASED = "time_based"
}
/**
 * Market data source type
 */
export declare enum MarketDataSource {
    MERCER = "mercer",
    WILLIS_TOWERS_WATSON = "willis_towers_watson",
    RADFORD = "radford",
    PAYSCALE = "payscale",
    SALARY_COM = "salary_com",
    CUSTOM_SURVEY = "custom_survey"
}
/**
 * Compensation plan interface
 */
export interface CompensationPlan {
    id: string;
    planCode: string;
    planName: string;
    planYear: number;
    fiscalYear: number;
    planType: 'merit' | 'bonus' | 'equity' | 'comprehensive';
    effectiveDate: Date;
    endDate: Date;
    totalBudget: number;
    allocatedBudget: number;
    remainingBudget: number;
    currency: string;
    status: CompensationPlanStatus;
    guidelines: CompensationGuideline[];
    approvalWorkflow: any[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
}
/**
 * Compensation guideline interface
 */
export interface CompensationGuideline {
    id: string;
    payGradeId?: string;
    departmentId?: string;
    performanceRating: string;
    minIncreasePercent: number;
    maxIncreasePercent: number;
    targetIncreasePercent: number;
    eligibleForBonus: boolean;
    bonusTargetPercent?: number;
}
/**
 * Pay grade interface
 */
export interface PayGrade {
    id: string;
    gradeCode: string;
    gradeName: string;
    gradeLevel: number;
    gradeType: PayGradeType;
    minSalary: number;
    midpointSalary: number;
    maxSalary: number;
    currency: string;
    spreadPercent: number;
    marketReference?: string;
    effectiveDate: Date;
    endDate?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Salary range interface
 */
export interface SalaryRange {
    id: string;
    payGradeId: string;
    locationId?: string;
    currencyCode: string;
    minSalary: number;
    firstQuartile: number;
    midpoint: number;
    thirdQuartile: number;
    maxSalary: number;
    marketRatio: number;
    effectiveDate: Date;
    endDate?: Date;
    metadata: Record<string, any>;
}
/**
 * Employee compensation interface
 */
export interface EmployeeCompensation {
    id: string;
    employeeId: string;
    employeeName: string;
    jobCode: string;
    jobTitle: string;
    payGradeId: string;
    departmentId: string;
    locationId: string;
    baseSalary: number;
    currency: string;
    compaRatio: number;
    rangePosition: number;
    lastIncreaseDate?: Date;
    lastIncreasePercent?: number;
    lastIncreaseAmount?: number;
    targetBonus: number;
    targetBonusPercent: number;
    ltiValue?: number;
    totalCash: number;
    totalDirectCompensation: number;
    metadata: Record<string, any>;
    effectiveDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Compensation adjustment interface
 */
export interface CompensationAdjustment {
    id: string;
    employeeId: string;
    planId?: string;
    cycleId?: string;
    adjustmentType: CompensationAdjustmentType;
    currentSalary: number;
    proposedSalary: number;
    adjustmentAmount: number;
    adjustmentPercent: number;
    effectiveDate: Date;
    reason: string;
    justification: string;
    performanceRating?: string;
    compaRatioBefore: number;
    compaRatioAfter: number;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Bonus payment interface
 */
export interface BonusPayment {
    id: string;
    employeeId: string;
    bonusType: BonusType;
    bonusAmount: number;
    bonusPercent?: number;
    targetAmount?: number;
    actualAmount: number;
    achievementPercent?: number;
    paymentDate: Date;
    payrollPeriodId?: string;
    status: 'pending' | 'approved' | 'paid' | 'cancelled';
    reason: string;
    approvedBy?: string;
    approvedAt?: Date;
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Commission plan interface
 */
export interface CommissionPlan {
    id: string;
    planCode: string;
    planName: string;
    structureType: CommissionStructureType;
    effectiveDate: Date;
    endDate?: Date;
    baseSalary?: number;
    drawAmount?: number;
    tiers: CommissionTier[];
    quotaAmount?: number;
    paymentFrequency: 'monthly' | 'quarterly' | 'annually';
    accelerators?: any[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Commission tier interface
 */
export interface CommissionTier {
    tierLevel: number;
    minAmount: number;
    maxAmount?: number;
    rate: number;
    rateType: 'percentage' | 'fixed';
}
/**
 * Commission payment interface
 */
export interface CommissionPayment {
    id: string;
    employeeId: string;
    planId: string;
    periodStart: Date;
    periodEnd: Date;
    salesAmount: number;
    quotaAmount: number;
    achievementPercent: number;
    commissionAmount: number;
    adjustments: number;
    finalAmount: number;
    paymentDate: Date;
    status: 'calculated' | 'approved' | 'paid' | 'disputed';
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Long-term incentive grant interface
 */
export interface LTIGrant {
    id: string;
    grantNumber: string;
    employeeId: string;
    ltiType: LTIType;
    grantDate: Date;
    grantPrice?: number;
    numberOfUnits: number;
    totalValue: number;
    vestingScheduleType: VestingScheduleType;
    vestingStartDate: Date;
    vestingEndDate: Date;
    vestingSchedule: VestingPeriod[];
    vestedUnits: number;
    unvestedUnits: number;
    exercisedUnits?: number;
    forfeitedUnits?: number;
    status: 'active' | 'vested' | 'exercised' | 'forfeited' | 'expired';
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Vesting period interface
 */
export interface VestingPeriod {
    periodNumber: number;
    vestingDate: Date;
    vestingPercent: number;
    unitsVesting: number;
    isVested: boolean;
}
/**
 * Market data interface
 */
export interface MarketData {
    id: string;
    jobCode: string;
    jobTitle: string;
    dataSource: MarketDataSource;
    surveyYear: number;
    effectiveDate: Date;
    locationId?: string;
    industryCode?: string;
    companySize?: string;
    percentile10: number;
    percentile25: number;
    percentile50: number;
    percentile75: number;
    percentile90: number;
    average: number;
    sampleSize: number;
    currency: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Pay equity analysis interface
 */
export interface PayEquityAnalysis {
    id: string;
    analysisDate: Date;
    analysisType: 'gender' | 'ethnicity' | 'age' | 'comprehensive';
    scope: 'company' | 'department' | 'job_family';
    scopeId?: string;
    totalEmployees: number;
    disparityFound: boolean;
    avgPayGap: number;
    maxPayGap: number;
    affectedEmployees: number;
    recommendations: string[];
    estimatedCost: number;
    findings: any[];
    metadata: Record<string, any>;
    createdAt: Date;
}
/**
 * Total rewards statement interface
 */
export interface TotalRewardsStatement {
    id: string;
    employeeId: string;
    statementYear: number;
    baseSalary: number;
    bonusTarget: number;
    bonusPaid: number;
    commissionPaid: number;
    ltiValue: number;
    benefitsValue: number;
    retirementContribution: number;
    ptoValue: number;
    otherCompensation: number;
    totalCash: number;
    totalDirectCompensation: number;
    totalRewards: number;
    currency: string;
    generatedAt: Date;
    metadata: Record<string, any>;
}
/**
 * Compensation review cycle interface
 */
export interface CompensationReviewCycle {
    id: string;
    cycleCode: string;
    cycleName: string;
    planYear: number;
    cycleType: 'annual' | 'mid_year' | 'off_cycle' | 'promotion';
    startDate: Date;
    endDate: Date;
    approvalDeadline: Date;
    effectiveDate: Date;
    status: CompensationCycleStatus;
    totalBudget: number;
    participantCount: number;
    completedCount: number;
    approvedCount: number;
    guidelines: CompensationGuideline[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Create compensation plan DTO
 */
export declare class CreateCompensationPlanDto {
    planCode: string;
    planName: string;
    planYear: number;
    totalBudget: number;
    effectiveDate: Date;
    endDate: Date;
    currency: string;
}
/**
 * Create pay grade DTO
 */
export declare class CreatePayGradeDto {
    gradeCode: string;
    gradeName: string;
    gradeLevel: number;
    gradeType: PayGradeType;
    minSalary: number;
    midpointSalary: number;
    maxSalary: number;
    currency: string;
}
/**
 * Create compensation adjustment DTO
 */
export declare class CreateCompensationAdjustmentDto {
    employeeId: string;
    adjustmentType: CompensationAdjustmentType;
    currentSalary: number;
    proposedSalary: number;
    effectiveDate: Date;
    justification: string;
    performanceRating?: string;
}
/**
 * Create bonus payment DTO
 */
export declare class CreateBonusPaymentDto {
    employeeId: string;
    bonusType: BonusType;
    bonusAmount: number;
    paymentDate: Date;
    reason: string;
}
/**
 * Create commission plan DTO
 */
export declare class CreateCommissionPlanDto {
    planCode: string;
    planName: string;
    structureType: CommissionStructureType;
    effectiveDate: Date;
    tiers: CommissionTier[];
    paymentFrequency: 'monthly' | 'quarterly' | 'annually';
}
/**
 * Create LTI grant DTO
 */
export declare class CreateLTIGrantDto {
    employeeId: string;
    ltiType: LTIType;
    grantDate: Date;
    numberOfUnits: number;
    grantPrice?: number;
    vestingScheduleType: VestingScheduleType;
    vestingStartDate: Date;
    vestingEndDate: Date;
}
/**
 * Market data upload DTO
 */
export declare class MarketDataUploadDto {
    jobCode: string;
    jobTitle: string;
    dataSource: MarketDataSource;
    surveyYear: number;
    percentiles: {
        p10: number;
        p25: number;
        p50: number;
        p75: number;
        p90: number;
    };
    sampleSize: number;
}
/**
 * Sequelize model for Compensation Plan.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CompensationPlan model
 *
 * @example
 * ```typescript
 * const CompensationPlan = createCompensationPlanModel(sequelize);
 * const plan = await CompensationPlan.create({
 *   planCode: 'MERIT2025',
 *   planName: '2025 Merit Increase Plan',
 *   planYear: 2025,
 *   totalBudget: 5000000
 * });
 * ```
 */
export declare const createCompensationPlanModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        planCode: string;
        planName: string;
        planYear: number;
        fiscalYear: number;
        planType: string;
        effectiveDate: Date;
        endDate: Date;
        totalBudget: number;
        allocatedBudget: number;
        remainingBudget: number;
        currency: string;
        status: string;
        guidelines: any[];
        approvalWorkflow: any[];
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Pay Grade.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PayGrade model
 */
export declare const createPayGradeModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        gradeCode: string;
        gradeName: string;
        gradeLevel: number;
        gradeType: string;
        minSalary: number;
        midpointSalary: number;
        maxSalary: number;
        currency: string;
        spreadPercent: number;
        marketReference: string | null;
        effectiveDate: Date;
        endDate: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Employee Compensation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EmployeeCompensation model
 */
export declare const createEmployeeCompensationModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        employeeName: string;
        jobCode: string;
        jobTitle: string;
        payGradeId: string;
        departmentId: string;
        locationId: string;
        baseSalary: number;
        currency: string;
        compaRatio: number;
        rangePosition: number;
        lastIncreaseDate: Date | null;
        lastIncreasePercent: number | null;
        lastIncreaseAmount: number | null;
        targetBonus: number;
        targetBonusPercent: number;
        ltiValue: number | null;
        totalCash: number;
        totalDirectCompensation: number;
        metadata: Record<string, any>;
        effectiveDate: Date;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Compensation Adjustment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CompensationAdjustment model
 */
export declare const createCompensationAdjustmentModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        employeeId: string;
        planId: string | null;
        cycleId: string | null;
        adjustmentType: string;
        currentSalary: number;
        proposedSalary: number;
        adjustmentAmount: number;
        adjustmentPercent: number;
        effectiveDate: Date;
        reason: string;
        justification: string;
        performanceRating: string | null;
        compaRatioBefore: number;
        compaRatioAfter: number;
        approvalStatus: string;
        approvedBy: string | null;
        approvedAt: Date | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for LTI Grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LTIGrant model
 */
export declare const createLTIGrantModel: (sequelize: Sequelize) => {
    new (): {
        id: string;
        grantNumber: string;
        employeeId: string;
        ltiType: string;
        grantDate: Date;
        grantPrice: number | null;
        numberOfUnits: number;
        totalValue: number;
        vestingScheduleType: string;
        vestingStartDate: Date;
        vestingEndDate: Date;
        vestingSchedule: any[];
        vestedUnits: number;
        unvestedUnits: number;
        exercisedUnits: number | null;
        forfeitedUnits: number | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates comprehensive compensation plan with budget allocation.
 *
 * @param {object} planData - Plan creation data
 * @param {string} userId - User creating the plan
 * @returns {Promise<CompensationPlan>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createCompensationPlan({
 *   planCode: 'MERIT2025',
 *   planName: '2025 Annual Merit Increase Plan',
 *   planYear: 2025,
 *   planType: 'merit',
 *   totalBudget: 5000000,
 *   effectiveDate: new Date('2025-04-01')
 * }, 'admin-123');
 * ```
 */
export declare const createCompensationPlan: (planData: any, userId: string) => Promise<CompensationPlan>;
/**
 * Calculates total compensation budget by department.
 *
 * @param {string} planId - Plan ID
 * @param {any[]} departments - Department list
 * @returns {Promise<object>} Budget allocation by department
 *
 * @example
 * ```typescript
 * const budgets = await calculateDepartmentBudgets('plan-123', departments);
 * // Returns: { 'dept-1': 500000, 'dept-2': 750000, ... }
 * ```
 */
export declare const calculateDepartmentBudgets: (planId: string, departments: any[]) => Promise<Record<string, number>>;
/**
 * Allocates compensation budget to eligible employees.
 *
 * @param {string} planId - Plan ID
 * @param {any[]} employees - Employee list
 * @param {number} totalBudget - Total budget available
 * @returns {Promise<object>} Budget allocation per employee
 *
 * @example
 * ```typescript
 * const allocations = await allocateCompensationBudget('plan-123', employees, 1000000);
 * ```
 */
export declare const allocateCompensationBudget: (planId: string, employees: any[], totalBudget: number) => Promise<Record<string, number>>;
/**
 * Tracks compensation plan budget utilization.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Budget utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await trackBudgetUtilization('plan-123');
 * // Returns: { totalBudget, allocated, remaining, utilizationPercent }
 * ```
 */
export declare const trackBudgetUtilization: (planId: string) => Promise<any>;
/**
 * Generates budget forecast based on historical data.
 *
 * @param {number} planYear - Plan year
 * @param {any} assumptions - Forecasting assumptions
 * @returns {Promise<object>} Budget forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCompensationBudget(2025, {
 *   avgIncreasePercent: 3.5,
 *   headcountGrowth: 10
 * });
 * ```
 */
export declare const forecastCompensationBudget: (planYear: number, assumptions: any) => Promise<any>;
/**
 * Creates pay grade with salary range definition.
 *
 * @param {object} gradeData - Pay grade data
 * @returns {Promise<PayGrade>} Created pay grade
 *
 * @example
 * ```typescript
 * const grade = await createPayGrade({
 *   gradeCode: 'L5',
 *   gradeName: 'Senior Software Engineer',
 *   gradeLevel: 5,
 *   minSalary: 120000,
 *   midpointSalary: 150000,
 *   maxSalary: 180000
 * });
 * ```
 */
export declare const createPayGrade: (gradeData: any) => Promise<PayGrade>;
/**
 * Updates salary ranges for pay grade.
 *
 * @param {string} gradeId - Pay grade ID
 * @param {object} rangeData - New range data
 * @returns {Promise<PayGrade>} Updated pay grade
 *
 * @example
 * ```typescript
 * const updated = await updateSalaryRange('grade-123', {
 *   minSalary: 125000,
 *   midpointSalary: 155000,
 *   maxSalary: 185000
 * });
 * ```
 */
export declare const updateSalaryRange: (gradeId: string, rangeData: any) => Promise<PayGrade>;
/**
 * Calculates salary range spread percentage.
 *
 * @param {number} minSalary - Minimum salary
 * @param {number} maxSalary - Maximum salary
 * @param {number} midpoint - Midpoint salary
 * @returns {number} Spread percentage
 *
 * @example
 * ```typescript
 * const spread = calculateSalarySpread(100000, 150000, 125000);
 * // Returns: 40
 * ```
 */
export declare const calculateSalarySpread: (minSalary: number, maxSalary: number, midpoint: number) => number;
/**
 * Validates salary against pay grade range.
 *
 * @param {number} salary - Salary to validate
 * @param {PayGrade} payGrade - Pay grade
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSalaryInRange(145000, payGrade);
 * // Returns: { isValid: true, position: 50, compaRatio: 0.97 }
 * ```
 */
export declare const validateSalaryInRange: (salary: number, payGrade: PayGrade) => any;
/**
 * Generates pay grade progression matrix.
 *
 * @param {PayGrade[]} grades - List of pay grades
 * @returns {object} Progression matrix
 *
 * @example
 * ```typescript
 * const matrix = generatePayGradeMatrix(allGrades);
 * ```
 */
export declare const generatePayGradeMatrix: (grades: PayGrade[]) => any;
/**
 * Creates location-specific salary range.
 *
 * @param {string} gradeId - Pay grade ID
 * @param {string} locationId - Location ID
 * @param {object} adjustmentFactor - Location adjustment
 * @returns {Promise<SalaryRange>} Location salary range
 *
 * @example
 * ```typescript
 * const range = await createLocationSalaryRange('grade-123', 'loc-sf', {
 *   factor: 1.25
 * });
 * ```
 */
export declare const createLocationSalaryRange: (gradeId: string, locationId: string, adjustmentFactor: any) => Promise<SalaryRange>;
/**
 * Calculates compa-ratio for employee.
 *
 * @param {number} salary - Employee salary
 * @param {number} midpoint - Range midpoint
 * @returns {number} Compa-ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateCompaRatio(145000, 150000);
 * // Returns: 0.97
 * ```
 */
export declare const calculateCompaRatio: (salary: number, midpoint: number) => number;
/**
 * Calculates position in salary range.
 *
 * @param {number} salary - Employee salary
 * @param {number} min - Range minimum
 * @param {number} max - Range maximum
 * @returns {number} Range position (0-100)
 *
 * @example
 * ```typescript
 * const position = calculateRangePosition(130000, 100000, 150000);
 * // Returns: 60
 * ```
 */
export declare const calculateRangePosition: (salary: number, min: number, max: number) => number;
/**
 * Identifies employees outside salary range.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object} Employees above/below range
 *
 * @example
 * ```typescript
 * const outliers = identifyRangeOutliers(employees);
 * // Returns: { aboveMax: [...], belowMin: [...] }
 * ```
 */
export declare const identifyRangeOutliers: (employees: EmployeeCompensation[]) => any;
/**
 * Recommends salary range adjustments based on market data.
 *
 * @param {PayGrade} grade - Pay grade
 * @param {MarketData} marketData - Market data
 * @returns {object} Recommended adjustments
 *
 * @example
 * ```typescript
 * const recommendations = recommendRangeAdjustments(grade, marketData);
 * ```
 */
export declare const recommendRangeAdjustments: (grade: PayGrade, marketData: MarketData) => any;
/**
 * Calculates merit increase based on performance.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {string} performanceRating - Performance rating
 * @param {CompensationGuideline} guideline - Merit guidelines
 * @returns {object} Merit increase calculation
 *
 * @example
 * ```typescript
 * const merit = calculateMeritIncrease(employee, 'exceeds', guideline);
 * // Returns: { increasePercent: 4.5, increaseAmount: 5400, newSalary: 125400 }
 * ```
 */
export declare const calculateMeritIncrease: (employee: EmployeeCompensation, performanceRating: string, guideline: CompensationGuideline) => any;
/**
 * Calculates bonus based on performance and target.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {number} achievementPercent - Goal achievement %
 * @param {object} bonusStructure - Bonus structure
 * @returns {object} Bonus calculation
 *
 * @example
 * ```typescript
 * const bonus = calculatePerformanceBonus(employee, 110, bonusStructure);
 * ```
 */
export declare const calculatePerformanceBonus: (employee: EmployeeCompensation, achievementPercent: number, bonusStructure: any) => any;
/**
 * Calculates prorated bonus for partial year employment.
 *
 * @param {number} targetBonus - Annual target bonus
 * @param {Date} startDate - Employment start date
 * @param {Date} bonusDate - Bonus payment date
 * @returns {number} Prorated bonus amount
 *
 * @example
 * ```typescript
 * const prorated = calculateProratedBonus(10000, new Date('2025-07-01'), new Date('2025-12-31'));
 * ```
 */
export declare const calculateProratedBonus: (targetBonus: number, startDate: Date, bonusDate: Date) => number;
/**
 * Validates merit increase against budget and guidelines.
 *
 * @param {CompensationAdjustment} adjustment - Proposed adjustment
 * @param {CompensationPlan} plan - Compensation plan
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateMeritIncrease(adjustment, plan);
 * ```
 */
export declare const validateMeritIncrease: (adjustment: CompensationAdjustment, plan: CompensationPlan) => any;
/**
 * Generates merit increase recommendations for department.
 *
 * @param {string} departmentId - Department ID
 * @param {EmployeeCompensation[]} employees - Department employees
 * @param {number} budgetAmount - Department budget
 * @returns {object} Merit recommendations
 *
 * @example
 * ```typescript
 * const recommendations = generateMeritRecommendations('dept-123', employees, 250000);
 * ```
 */
export declare const generateMeritRecommendations: (departmentId: string, employees: EmployeeCompensation[], budgetAmount: number) => any;
/**
 * Creates compensation review cycle.
 *
 * @param {object} cycleData - Cycle data
 * @returns {Promise<CompensationReviewCycle>} Created cycle
 *
 * @example
 * ```typescript
 * const cycle = await createCompensationCycle({
 *   cycleName: '2025 Annual Review',
 *   planYear: 2025,
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-03-31')
 * });
 * ```
 */
export declare const createCompensationCycle: (cycleData: any) => Promise<CompensationReviewCycle>;
/**
 * Opens compensation cycle for manager input.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<CompensationReviewCycle>} Opened cycle
 *
 * @example
 * ```typescript
 * const opened = await openCompensationCycle('cycle-123');
 * ```
 */
export declare const openCompensationCycle: (cycleId: string) => Promise<CompensationReviewCycle>;
/**
 * Tracks compensation cycle progress.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<object>} Cycle progress metrics
 *
 * @example
 * ```typescript
 * const progress = await trackCycleProgress('cycle-123');
 * ```
 */
export declare const trackCycleProgress: (cycleId: string) => Promise<any>;
/**
 * Closes compensation cycle and finalizes changes.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<CompensationReviewCycle>} Closed cycle
 *
 * @example
 * ```typescript
 * const closed = await closeCompensationCycle('cycle-123');
 * ```
 */
export declare const closeCompensationCycle: (cycleId: string) => Promise<CompensationReviewCycle>;
/**
 * Generates cycle summary report.
 *
 * @param {string} cycleId - Cycle ID
 * @returns {Promise<object>} Cycle summary
 *
 * @example
 * ```typescript
 * const summary = await generateCycleSummaryReport('cycle-123');
 * ```
 */
export declare const generateCycleSummaryReport: (cycleId: string) => Promise<any>;
/**
 * Imports market survey data.
 *
 * @param {MarketDataUploadDto} marketData - Market data
 * @returns {Promise<MarketData>} Imported market data
 *
 * @example
 * ```typescript
 * const imported = await importMarketSurveyData({
 *   jobCode: 'SE5',
 *   dataSource: MarketDataSource.MERCER,
 *   surveyYear: 2025,
 *   percentiles: { p50: 150000 }
 * });
 * ```
 */
export declare const importMarketSurveyData: (marketData: MarketDataUploadDto) => Promise<MarketData>;
/**
 * Benchmarks employee compensation against market.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {MarketData} marketData - Market data
 * @returns {object} Benchmarking results
 *
 * @example
 * ```typescript
 * const benchmark = benchmarkAgainstMarket(employee, marketData);
 * ```
 */
export declare const benchmarkAgainstMarket: (employee: EmployeeCompensation, marketData: MarketData) => any;
/**
 * Calculates market ratio (company vs market).
 *
 * @param {number} companySalary - Company salary
 * @param {number} marketSalary - Market salary
 * @returns {number} Market ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateMarketRatio(145000, 150000);
 * // Returns: 0.97
 * ```
 */
export declare const calculateMarketRatio: (companySalary: number, marketSalary: number) => number;
/**
 * Generates market positioning report.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @param {MarketData[]} marketData - Market data
 * @returns {object} Positioning report
 *
 * @example
 * ```typescript
 * const report = generateMarketPositioningReport(employees, marketData);
 * ```
 */
export declare const generateMarketPositioningReport: (employees: EmployeeCompensation[], marketData: MarketData[]) => any;
/**
 * Identifies market laggards requiring adjustment.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @param {MarketData[]} marketData - Market data
 * @param {number} thresholdPercent - Threshold for laggard
 * @returns {object[]} Laggard employees
 *
 * @example
 * ```typescript
 * const laggards = identifyMarketLaggards(employees, marketData, 10);
 * ```
 */
export declare const identifyMarketLaggards: (employees: EmployeeCompensation[], marketData: MarketData[], thresholdPercent: number) => any[];
/**
 * Performs comprehensive pay equity analysis.
 *
 * @param {string} analysisType - Analysis type
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {Promise<PayEquityAnalysis>} Equity analysis
 *
 * @example
 * ```typescript
 * const analysis = await performPayEquityAnalysis('gender', employees);
 * ```
 */
export declare const performPayEquityAnalysis: (analysisType: string, employees: EmployeeCompensation[]) => Promise<PayEquityAnalysis>;
/**
 * Calculates gender pay gap.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object} Gender pay gap analysis
 *
 * @example
 * ```typescript
 * const genderGap = calculateGenderPayGap(employees);
 * ```
 */
export declare const calculateGenderPayGap: (employees: EmployeeCompensation[]) => any;
/**
 * Analyzes pay equity by job level.
 *
 * @param {EmployeeCompensation[]} employees - Employee list
 * @returns {object[]} Pay equity by level
 *
 * @example
 * ```typescript
 * const analysis = analyzePayEquityByLevel(employees);
 * ```
 */
export declare const analyzePayEquityByLevel: (employees: EmployeeCompensation[]) => any[];
/**
 * Generates pay equity remediation plan.
 *
 * @param {PayEquityAnalysis} analysis - Equity analysis
 * @returns {object} Remediation plan
 *
 * @example
 * ```typescript
 * const plan = generateEquityRemediationPlan(analysis);
 * ```
 */
export declare const generateEquityRemediationPlan: (analysis: PayEquityAnalysis) => any;
/**
 * Tracks pay equity metrics over time.
 *
 * @param {string} companyId - Company ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<object>} Historical equity metrics
 *
 * @example
 * ```typescript
 * const trends = await trackPayEquityMetrics('company-123', start, end);
 * ```
 */
export declare const trackPayEquityMetrics: (companyId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Generates total rewards statement for employee.
 *
 * @param {string} employeeId - Employee ID
 * @param {number} year - Statement year
 * @returns {Promise<TotalRewardsStatement>} Rewards statement
 *
 * @example
 * ```typescript
 * const statement = await generateTotalRewardsStatement('emp-123', 2025);
 * ```
 */
export declare const generateTotalRewardsStatement: (employeeId: string, year: number) => Promise<TotalRewardsStatement>;
/**
 * Calculates total cash compensation.
 *
 * @param {EmployeeCompensation} employee - Employee compensation
 * @param {BonusPayment[]} bonuses - Bonus payments
 * @param {CommissionPayment[]} commissions - Commission payments
 * @returns {number} Total cash
 *
 * @example
 * ```typescript
 * const totalCash = calculateTotalCashCompensation(employee, bonuses, commissions);
 * ```
 */
export declare const calculateTotalCashCompensation: (employee: EmployeeCompensation, bonuses: BonusPayment[], commissions: CommissionPayment[]) => number;
/**
 * Calculates total direct compensation (TDC).
 *
 * @param {number} baseSalary - Base salary
 * @param {number} bonuses - Total bonuses
 * @param {number} ltiValue - LTI value
 * @returns {number} Total direct compensation
 *
 * @example
 * ```typescript
 * const tdc = calculateTotalDirectCompensation(150000, 15000, 50000);
 * // Returns: 215000
 * ```
 */
export declare const calculateTotalDirectCompensation: (baseSalary: number, bonuses: number, ltiValue: number) => number;
/**
 * Estimates benefits value for employee.
 *
 * @param {string} employeeId - Employee ID
 * @returns {Promise<number>} Benefits value
 *
 * @example
 * ```typescript
 * const benefitsValue = await estimateBenefitsValue('emp-123');
 * ```
 */
export declare const estimateBenefitsValue: (employeeId: string) => Promise<number>;
/**
 * Generates batch total rewards statements.
 *
 * @param {string[]} employeeIds - Employee IDs
 * @param {number} year - Statement year
 * @returns {Promise<TotalRewardsStatement[]>} Statements
 *
 * @example
 * ```typescript
 * const statements = await generateBatchTotalRewardsStatements(employeeIds, 2025);
 * ```
 */
export declare const generateBatchTotalRewardsStatements: (employeeIds: string[], year: number) => Promise<TotalRewardsStatement[]>;
/**
 * Creates variable pay incentive plan.
 *
 * @param {object} planData - Plan data
 * @returns {Promise<object>} Created plan
 *
 * @example
 * ```typescript
 * const plan = await createVariablePayPlan({
 *   planName: '2025 Sales Incentive',
 *   planType: 'commission',
 *   eligibleRoles: ['sales']
 * });
 * ```
 */
export declare const createVariablePayPlan: (planData: any) => Promise<any>;
/**
 * Calculates variable pay based on performance metrics.
 *
 * @param {string} employeeId - Employee ID
 * @param {object} metrics - Performance metrics
 * @param {object} plan - Variable pay plan
 * @returns {number} Variable pay amount
 *
 * @example
 * ```typescript
 * const variablePay = calculateVariablePay('emp-123', metrics, plan);
 * ```
 */
export declare const calculateVariablePay: (employeeId: string, metrics: any, plan: any) => number;
/**
 * Tracks variable pay performance metrics.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Performance tracking
 *
 * @example
 * ```typescript
 * const tracking = await trackVariablePayMetrics('emp-123', 'plan-123', start, end);
 * ```
 */
export declare const trackVariablePayMetrics: (employeeId: string, planId: string, periodStart: Date, periodEnd: Date) => Promise<any>;
/**
 * Processes variable pay payout.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {number} amount - Payout amount
 * @returns {Promise<object>} Payout record
 *
 * @example
 * ```typescript
 * const payout = await processVariablePayPayout('emp-123', 'plan-123', 45000);
 * ```
 */
export declare const processVariablePayPayout: (employeeId: string, planId: string, amount: number) => Promise<any>;
/**
 * Generates variable pay analytics report.
 *
 * @param {string} planId - Plan ID
 * @returns {Promise<object>} Analytics report
 *
 * @example
 * ```typescript
 * const analytics = await generateVariablePayAnalytics('plan-123');
 * ```
 */
export declare const generateVariablePayAnalytics: (planId: string) => Promise<any>;
/**
 * Creates commission plan with tiered structure.
 *
 * @param {CreateCommissionPlanDto} planData - Commission plan data
 * @returns {Promise<CommissionPlan>} Created commission plan
 *
 * @example
 * ```typescript
 * const plan = await createCommissionPlan({
 *   planCode: 'SALES2025',
 *   planName: '2025 Sales Commission',
 *   structureType: CommissionStructureType.TIERED,
 *   tiers: [
 *     { tierLevel: 1, minAmount: 0, maxAmount: 500000, rate: 5, rateType: 'percentage' },
 *     { tierLevel: 2, minAmount: 500000, rate: 7, rateType: 'percentage' }
 *   ]
 * });
 * ```
 */
export declare const createCommissionPlan: (planData: CreateCommissionPlanDto) => Promise<CommissionPlan>;
/**
 * Calculates commission based on sales and plan structure.
 *
 * @param {number} salesAmount - Total sales amount
 * @param {CommissionPlan} plan - Commission plan
 * @returns {object} Commission calculation
 *
 * @example
 * ```typescript
 * const commission = calculateCommission(750000, commissionPlan);
 * // Returns: { totalCommission: 42500, tierBreakdown: [...] }
 * ```
 */
export declare const calculateCommission: (salesAmount: number, plan: CommissionPlan) => any;
/**
 * Processes commission payment for sales period.
 *
 * @param {string} employeeId - Employee ID
 * @param {string} planId - Plan ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @param {number} salesAmount - Total sales
 * @returns {Promise<CommissionPayment>} Commission payment
 *
 * @example
 * ```typescript
 * const payment = await processCommissionPayment('emp-123', 'plan-123', start, end, 750000);
 * ```
 */
export declare const processCommissionPayment: (employeeId: string, planId: string, periodStart: Date, periodEnd: Date, salesAmount: number) => Promise<CommissionPayment>;
/**
 * Tracks sales performance against quota.
 *
 * @param {string} employeeId - Employee ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Sales performance metrics
 *
 * @example
 * ```typescript
 * const performance = await trackSalesPerformance('emp-123', start, end);
 * ```
 */
export declare const trackSalesPerformance: (employeeId: string, periodStart: Date, periodEnd: Date) => Promise<any>;
/**
 * Generates sales compensation analytics.
 *
 * @param {string} departmentId - Department ID
 * @param {Date} periodStart - Period start
 * @param {Date} periodEnd - Period end
 * @returns {Promise<object>} Sales compensation analytics
 *
 * @example
 * ```typescript
 * const analytics = await generateSalesCompensationAnalytics('dept-sales', start, end);
 * ```
 */
export declare const generateSalesCompensationAnalytics: (departmentId: string, periodStart: Date, periodEnd: Date) => Promise<any>;
//# sourceMappingURL=compensation-management-kit.d.ts.map