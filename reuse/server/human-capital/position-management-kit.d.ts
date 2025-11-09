/**
 * LOC: HCM-POS-001
 * File: /reuse/server/human-capital/position-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable HCM utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend HCM services
 *   - Position management modules
 *   - Organizational structure services
 *   - Workforce planning systems
 *   - Budgeting and headcount modules
 */
import { Model } from 'sequelize-typescript';
import { Transaction, WhereOptions } from 'sequelize';
/**
 * Position status enumeration
 */
export declare enum PositionStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    VACANT = "vacant",
    FILLED = "filled",
    FROZEN = "frozen",
    CLOSED = "closed",
    PROPOSED = "proposed",
    APPROVED = "approved",
    ELIMINATED = "eliminated"
}
/**
 * Position type enumeration
 */
export declare enum PositionType {
    REGULAR = "regular",
    TEMPORARY = "temporary",
    CONTRACT = "contract",
    INTERN = "intern",
    EXECUTIVE = "executive",
    MANAGEMENT = "management",
    SPECIALIST = "specialist",
    SUPPORT = "support"
}
/**
 * Requisition status enumeration
 */
export declare enum RequisitionStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_RECRUITING = "in_recruiting",
    FILLED = "filled",
    CANCELLED = "cancelled",
    ON_HOLD = "on_hold"
}
/**
 * Position grade level enumeration
 */
export declare enum GradeLevel {
    ENTRY = "entry",
    JUNIOR = "junior",
    INTERMEDIATE = "intermediate",
    SENIOR = "senior",
    LEAD = "lead",
    PRINCIPAL = "principal",
    STAFF = "staff",
    MANAGER = "manager",
    DIRECTOR = "director",
    VP = "vp",
    SVP = "svp",
    C_LEVEL = "c_level"
}
/**
 * Succession readiness level
 */
export declare enum SuccessionReadiness {
    READY_NOW = "ready_now",
    READY_IN_1_YEAR = "ready_in_1_year",
    READY_IN_2_YEARS = "ready_in_2_years",
    READY_IN_3_PLUS_YEARS = "ready_in_3_plus_years",
    NOT_READY = "not_ready"
}
/**
 * Employment category
 */
export declare enum EmploymentCategory {
    FULL_TIME = "full_time",
    PART_TIME = "part_time",
    CONTRACT = "contract",
    SEASONAL = "seasonal",
    TEMPORARY = "temporary"
}
/**
 * Position creation data
 */
export interface PositionCreationData {
    positionNumber?: string;
    positionTitle: string;
    positionType: PositionType;
    jobCode: string;
    departmentId: string;
    locationId: string;
    reportsToPositionId?: string;
    employmentCategory: EmploymentCategory;
    gradeLevel: GradeLevel;
    salaryRangeMin?: number;
    salaryRangeMax?: number;
    salaryRangeMidpoint?: number;
    fte: number;
    isCritical?: boolean;
    requiresSecurityClearance?: boolean;
    effectiveDate: Date;
    endDate?: Date;
    customFields?: Record<string, any>;
}
/**
 * Position budget data
 */
export interface PositionBudgetData {
    positionId: string;
    fiscalYear: number;
    budgetedHeadcount: number;
    budgetedCost: number;
    actualHeadcount: number;
    actualCost: number;
    variance: number;
    variancePercentage: number;
    budgetStatus: 'within_budget' | 'over_budget' | 'under_budget';
}
/**
 * Position requisition data
 */
export interface PositionRequisitionData {
    positionId: string;
    requisitionType: 'new' | 'replacement' | 'backfill';
    targetStartDate: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
    justification: string;
    requestedBy: string;
    hiringManagerId: string;
    recruiterId?: string;
    approvalRequired: boolean;
    budgetApproved?: boolean;
}
/**
 * Position hierarchy data
 */
export interface PositionHierarchyData {
    positionId: string;
    parentPositionId?: string;
    level: number;
    path: string[];
    subordinateCount: number;
    isManagerial: boolean;
}
/**
 * Position description data
 */
export interface PositionDescriptionData {
    positionId: string;
    summary: string;
    responsibilities: string[];
    requiredQualifications: string[];
    preferredQualifications: string[];
    requiredSkills: string[];
    preferredSkills: string[];
    educationRequirements: string;
    experienceRequirements: string;
    physicalRequirements?: string;
    workEnvironment?: string;
    travelRequirement?: string;
}
/**
 * Position evaluation criteria
 */
export interface PositionEvaluationCriteria {
    positionId: string;
    evaluationMethod: 'hay' | 'mercer' | 'internal' | 'market_based';
    points?: number;
    grade: GradeLevel;
    compensationBand: string;
    evaluationDate: Date;
    evaluatedBy: string;
    notes?: string;
}
/**
 * Succession plan data
 */
export interface SuccessionPlanData {
    positionId: string;
    successorEmployeeId: string;
    readinessLevel: SuccessionReadiness;
    developmentPlan?: string;
    targetReadyDate?: Date;
    riskOfLoss: 'low' | 'medium' | 'high';
    retentionPlan?: string;
}
/**
 * Position incumbency data
 */
export interface PositionIncumbencyData {
    positionId: string;
    employeeId?: string;
    incumbentStartDate?: Date;
    incumbentEndDate?: Date;
    isVacant: boolean;
    vacancyStartDate?: Date;
    daysVacant?: number;
}
/**
 * Mass position update data
 */
export interface MassPositionUpdateData {
    positionIds: string[];
    updateType: 'status' | 'department' | 'location' | 'grade' | 'salary_range';
    newValue: any;
    effectiveDate: Date;
    reason: string;
    updatedBy: string;
}
/**
 * Position analytics result
 */
export interface PositionAnalytics {
    totalPositions: number;
    activePositions: number;
    vacantPositions: number;
    filledPositions: number;
    frozenPositions: number;
    vacancyRate: number;
    averageDaysToFill: number;
    criticalVacancies: number;
    byDepartment: Record<string, number>;
    byGrade: Record<string, number>;
    byType: Record<string, number>;
}
/**
 * Position Model - Core position master data
 */
export declare class Position extends Model {
    id: string;
    positionNumber: string;
    positionTitle: string;
    positionType: PositionType;
    positionStatus: PositionStatus;
    jobCode: string;
    departmentId: string;
    locationId: string;
    reportsToPositionId?: string;
    employmentCategory: EmploymentCategory;
    gradeLevel: GradeLevel;
    salaryRangeMin?: number;
    salaryRangeMax?: number;
    salaryRangeMidpoint?: number;
    fte: number;
    isCritical: boolean;
    requiresSecurityClearance: boolean;
    currentIncumbentId?: string;
    isVacant: boolean;
    vacancyStartDate?: Date;
    effectiveDate: Date;
    endDate?: Date;
    frozenDate?: Date;
    frozenReason?: string;
    customFields?: Record<string, any>;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    reportsTo?: Position;
    subordinates?: Position[];
    requisitions?: PositionRequisition[];
    budgets?: PositionBudget[];
    descriptions?: PositionDescription[];
    successionPlans?: SuccessionPlan[];
}
/**
 * Position Requisition Model - Tracks position requisitions
 */
export declare class PositionRequisition extends Model {
    id: string;
    positionId: string;
    requisitionNumber: string;
    requisitionType: string;
    requisitionStatus: RequisitionStatus;
    targetStartDate: Date;
    priority: string;
    justification: string;
    requestedBy: string;
    hiringManagerId: string;
    recruiterId?: string;
    approvedBy?: string;
    approvalDate?: Date;
    budgetApproved: boolean;
    numberOfOpenings: number;
    filledDate?: Date;
    daysToFill?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    position?: Position;
}
/**
 * Position Budget Model - Tracks position budgets
 */
export declare class PositionBudget extends Model {
    id: string;
    positionId: string;
    fiscalYear: number;
    budgetedHeadcount: number;
    budgetedCost: number;
    actualHeadcount: number;
    actualCost: number;
    variance: number;
    variancePercentage: number;
    budgetStatus: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    position?: Position;
}
/**
 * Position Hierarchy Model - Tracks organizational hierarchy
 */
export declare class PositionHierarchy extends Model {
    id: string;
    positionId: string;
    parentPositionId?: string;
    level: number;
    path: string[];
    subordinateCount: number;
    isManagerial: boolean;
    spanOfControl: number;
    createdAt: Date;
    updatedAt: Date;
    position?: Position;
    parentPosition?: Position;
}
/**
 * Position Description Model - Detailed job descriptions
 */
export declare class PositionDescription extends Model {
    id: string;
    positionId: string;
    version: number;
    summary: string;
    responsibilities: string[];
    requiredQualifications: string[];
    preferredQualifications?: string[];
    requiredSkills: string[];
    preferredSkills?: string[];
    educationRequirements: string;
    experienceRequirements: string;
    physicalRequirements?: string;
    workEnvironment?: string;
    travelRequirement?: string;
    isCurrent: boolean;
    effectiveDate: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    position?: Position;
}
/**
 * Position Evaluation Model - Job evaluation and grading
 */
export declare class PositionEvaluation extends Model {
    id: string;
    positionId: string;
    evaluationMethod: string;
    points?: number;
    grade: GradeLevel;
    compensationBand: string;
    evaluationDate: Date;
    evaluatedBy: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    position?: Position;
}
/**
 * Succession Plan Model - Succession planning for positions
 */
export declare class SuccessionPlan extends Model {
    id: string;
    positionId: string;
    successorEmployeeId: string;
    readinessLevel: SuccessionReadiness;
    developmentPlan?: string;
    targetReadyDate?: Date;
    riskOfLoss: string;
    retentionPlan?: string;
    isPrimarySuccessor: boolean;
    lastReviewDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    position?: Position;
}
/**
 * Position Incumbency Model - Tracks position incumbents over time
 */
export declare class PositionIncumbency extends Model {
    id: string;
    positionId: string;
    employeeId: string;
    incumbentStartDate: Date;
    incumbentEndDate?: Date;
    isCurrent: boolean;
    assignmentType: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    position?: Position;
}
/**
 * Creates a new position
 *
 * @param data - Position creation data
 * @param transaction - Optional database transaction
 * @returns Created position record
 *
 * @example
 * ```typescript
 * const position = await createPosition({
 *   positionTitle: 'Senior Software Engineer',
 *   positionType: PositionType.REGULAR,
 *   jobCode: 'ENG-SSE-001',
 *   departmentId: 'dept-123',
 *   locationId: 'loc-456',
 *   employmentCategory: EmploymentCategory.FULL_TIME,
 *   gradeLevel: GradeLevel.SENIOR,
 *   salaryRangeMin: 120000,
 *   salaryRangeMax: 180000,
 *   salaryRangeMidpoint: 150000,
 *   fte: 1.0,
 *   effectiveDate: new Date('2024-01-01')
 * });
 * ```
 */
export declare function createPosition(data: PositionCreationData, transaction?: Transaction): Promise<Position>;
/**
 * Generates unique position number
 *
 * @returns Generated position number
 *
 * @example
 * ```typescript
 * const posNum = await generatePositionNumber();
 * // Returns: "POS-2024-001234"
 * ```
 */
export declare function generatePositionNumber(): Promise<string>;
/**
 * Updates position details
 *
 * @param positionId - Position identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const updated = await updatePosition('pos-123', {
 *   positionTitle: 'Principal Software Engineer',
 *   gradeLevel: GradeLevel.PRINCIPAL,
 *   salaryRangeMin: 150000,
 *   salaryRangeMax: 220000
 * });
 * ```
 */
export declare function updatePosition(positionId: string, updates: Partial<Position>, transaction?: Transaction): Promise<Position>;
/**
 * Activates a draft position
 *
 * @param positionId - Position identifier
 * @param effectiveDate - Effective date
 * @param transaction - Optional database transaction
 * @returns Activated position
 *
 * @example
 * ```typescript
 * const active = await activatePosition('pos-123', new Date('2024-03-01'));
 * ```
 */
export declare function activatePosition(positionId: string, effectiveDate?: Date, transaction?: Transaction): Promise<Position>;
/**
 * Gets position by ID with full details
 *
 * @param positionId - Position identifier
 * @returns Position with associations
 *
 * @example
 * ```typescript
 * const position = await getPositionById('pos-123');
 * console.log(position.subordinates);
 * ```
 */
export declare function getPositionById(positionId: string): Promise<Position>;
/**
 * Searches positions by criteria
 *
 * @param criteria - Search criteria
 * @param limit - Maximum results
 * @returns Matching positions
 *
 * @example
 * ```typescript
 * const positions = await searchPositions({
 *   departmentId: 'dept-123',
 *   gradeLevel: GradeLevel.SENIOR,
 *   isVacant: true
 * });
 * ```
 */
export declare function searchPositions(criteria: WhereOptions<Position>, limit?: number): Promise<Position[]>;
/**
 * Eliminates/closes a position
 *
 * @param positionId - Position identifier
 * @param effectiveDate - Effective date
 * @param reason - Reason for elimination
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const eliminated = await eliminatePosition(
 *   'pos-123',
 *   new Date('2024-12-31'),
 *   'Organizational restructuring'
 * );
 * ```
 */
export declare function eliminatePosition(positionId: string, effectiveDate: Date, reason: string, transaction?: Transaction): Promise<Position>;
/**
 * Assigns job code to position
 *
 * @param positionId - Position identifier
 * @param jobCode - Job code
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const updated = await assignJobCode('pos-123', 'ENG-SSE-002');
 * ```
 */
export declare function assignJobCode(positionId: string, jobCode: string, transaction?: Transaction): Promise<Position>;
/**
 * Gets positions by job code
 *
 * @param jobCode - Job code
 * @returns Positions with matching job code
 *
 * @example
 * ```typescript
 * const positions = await getPositionsByJobCode('ENG-SSE-001');
 * ```
 */
export declare function getPositionsByJobCode(jobCode: string): Promise<Position[]>;
/**
 * Reclassifies position to new grade
 *
 * @param positionId - Position identifier
 * @param newGrade - New grade level
 * @param newSalaryRange - New salary range
 * @param effectiveDate - Effective date
 * @param reason - Reclassification reason
 * @param transaction - Optional database transaction
 * @returns Updated position
 *
 * @example
 * ```typescript
 * const reclassified = await reclassifyPosition(
 *   'pos-123',
 *   GradeLevel.PRINCIPAL,
 *   { min: 150000, max: 220000, midpoint: 185000 },
 *   new Date('2024-04-01'),
 *   'Position responsibilities expanded'
 * );
 * ```
 */
export declare function reclassifyPosition(positionId: string, newGrade: GradeLevel, newSalaryRange: {
    min: number;
    max: number;
    midpoint: number;
}, effectiveDate: Date, reason: string, transaction?: Transaction): Promise<Position>;
/**
 * Gets positions by grade level
 *
 * @param gradeLevel - Grade level
 * @param departmentId - Optional department filter
 * @returns Positions at grade level
 *
 * @example
 * ```typescript
 * const senior = await getPositionsByGrade(GradeLevel.SENIOR, 'dept-123');
 * ```
 */
export declare function getPositionsByGrade(gradeLevel: GradeLevel, departmentId?: string): Promise<Position[]>;
/**
 * Validates job code format and uniqueness
 *
 * @param jobCode - Job code to validate
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const valid = await validateJobCode('ENG-SSE-001');
 * if (!valid.isValid) console.log(valid.errors);
 * ```
 */
export declare function validateJobCode(jobCode: string): Promise<{
    isValid: boolean;
    errors: string[];
}>;
/**
 * Creates position budget for fiscal year
 *
 * @param data - Position budget data
 * @param transaction - Optional database transaction
 * @returns Created budget record
 *
 * @example
 * ```typescript
 * const budget = await createPositionBudget({
 *   positionId: 'pos-123',
 *   fiscalYear: 2024,
 *   budgetedHeadcount: 1.0,
 *   budgetedCost: 150000,
 *   actualHeadcount: 1.0,
 *   actualCost: 145000,
 *   variance: -5000,
 *   variancePercentage: -3.33,
 *   budgetStatus: 'within_budget'
 * });
 * ```
 */
export declare function createPositionBudget(data: PositionBudgetData, transaction?: Transaction): Promise<PositionBudget>;
/**
 * Updates position budget actuals
 *
 * @param budgetId - Budget identifier
 * @param actualHeadcount - Actual headcount
 * @param actualCost - Actual cost
 * @param transaction - Optional database transaction
 * @returns Updated budget with variance calculated
 *
 * @example
 * ```typescript
 * const updated = await updatePositionBudgetActuals(
 *   'budget-123',
 *   1.0,
 *   148000
 * );
 * ```
 */
export declare function updatePositionBudgetActuals(budgetId: string, actualHeadcount: number, actualCost: number, transaction?: Transaction): Promise<PositionBudget>;
/**
 * Gets position budgets by fiscal year
 *
 * @param fiscalYear - Fiscal year
 * @param departmentId - Optional department filter
 * @returns Budget records
 *
 * @example
 * ```typescript
 * const budgets = await getPositionBudgetsByYear(2024, 'dept-123');
 * ```
 */
export declare function getPositionBudgetsByYear(fiscalYear: number, departmentId?: string): Promise<PositionBudget[]>;
/**
 * Calculates total headcount and cost for department
 *
 * @param departmentId - Department identifier
 * @param fiscalYear - Fiscal year
 * @returns Aggregated budget data
 *
 * @example
 * ```typescript
 * const totals = await calculateDepartmentBudget('dept-123', 2024);
 * console.log(`Total headcount: ${totals.totalHeadcount}`);
 * ```
 */
export declare function calculateDepartmentBudget(departmentId: string, fiscalYear: number): Promise<{
    totalHeadcount: number;
    totalBudgetedCost: number;
    totalActualCost: number;
    totalVariance: number;
    positionCount: number;
}>;
/**
 * Gets budget variance report
 *
 * @param fiscalYear - Fiscal year
 * @param threshold - Variance percentage threshold
 * @returns Positions with significant variance
 *
 * @example
 * ```typescript
 * const variances = await getBudgetVarianceReport(2024, 10);
 * ```
 */
export declare function getBudgetVarianceReport(fiscalYear: number, threshold?: number): Promise<PositionBudget[]>;
/**
 * Forecasts budget for next fiscal year
 *
 * @param currentFiscalYear - Current fiscal year
 * @param inflationRate - Expected inflation rate
 * @param growthRate - Expected headcount growth rate
 * @returns Forecasted budget data
 *
 * @example
 * ```typescript
 * const forecast = await forecastPositionBudget(2024, 0.03, 0.05);
 * ```
 */
export declare function forecastPositionBudget(currentFiscalYear: number, inflationRate?: number, growthRate?: number): Promise<{
    fiscalYear: number;
    forecastedHeadcount: number;
    forecastedCost: number;
    assumptions: string;
}>;
/**
 * Creates position requisition
 *
 * @param data - Requisition data
 * @param transaction - Optional database transaction
 * @returns Created requisition
 *
 * @example
 * ```typescript
 * const req = await createPositionRequisition({
 *   positionId: 'pos-123',
 *   requisitionType: 'new',
 *   targetStartDate: new Date('2024-06-01'),
 *   priority: 'high',
 *   justification: 'Critical project need',
 *   requestedBy: 'user-456',
 *   hiringManagerId: 'mgr-789',
 *   approvalRequired: true
 * });
 * ```
 */
export declare function createPositionRequisition(data: PositionRequisitionData, transaction?: Transaction): Promise<PositionRequisition>;
/**
 * Generates unique requisition number
 *
 * @returns Generated requisition number
 *
 * @example
 * ```typescript
 * const reqNum = await generateRequisitionNumber();
 * // Returns: "REQ-2024-001234"
 * ```
 */
export declare function generateRequisitionNumber(): Promise<string>;
/**
 * Approves position requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approvedBy - Approver user ID
 * @param approvalDate - Approval date
 * @param transaction - Optional database transaction
 * @returns Approved requisition
 *
 * @example
 * ```typescript
 * const approved = await approveRequisition('req-123', 'user-456');
 * ```
 */
export declare function approveRequisition(requisitionId: string, approvedBy: string, approvalDate?: Date, transaction?: Transaction): Promise<PositionRequisition>;
/**
 * Sends requisition to recruiting
 *
 * @param requisitionId - Requisition identifier
 * @param recruiterId - Recruiter user ID
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * const inRecruiting = await sendRequisitionToRecruiting('req-123', 'recruiter-456');
 * ```
 */
export declare function sendRequisitionToRecruiting(requisitionId: string, recruiterId: string, transaction?: Transaction): Promise<PositionRequisition>;
/**
 * Fills position requisition
 *
 * @param requisitionId - Requisition identifier
 * @param employeeId - Hired employee ID
 * @param filledDate - Fill date
 * @param transaction - Optional database transaction
 * @returns Updated requisition and position
 *
 * @example
 * ```typescript
 * const result = await fillRequisition('req-123', 'emp-789', new Date());
 * ```
 */
export declare function fillRequisition(requisitionId: string, employeeId: string, filledDate?: Date, transaction?: Transaction): Promise<{
    requisition: PositionRequisition;
    position: Position;
}>;
/**
 * Creates position hierarchy entry
 *
 * @param data - Hierarchy data
 * @param transaction - Optional database transaction
 * @returns Created hierarchy record
 *
 * @example
 * ```typescript
 * const hierarchy = await createPositionHierarchy({
 *   positionId: 'pos-123',
 *   parentPositionId: 'pos-456',
 *   level: 3,
 *   path: ['pos-001', 'pos-456', 'pos-123'],
 *   subordinateCount: 0,
 *   isManagerial: false
 * });
 * ```
 */
export declare function createPositionHierarchy(data: PositionHierarchyData, transaction?: Transaction): Promise<PositionHierarchy>;
/**
 * Gets organizational hierarchy tree
 *
 * @param rootPositionId - Root position ID (optional, defaults to top level)
 * @param maxDepth - Maximum depth to traverse
 * @returns Hierarchical tree structure
 *
 * @example
 * ```typescript
 * const tree = await getOrganizationalHierarchy('pos-ceo', 5);
 * ```
 */
export declare function getOrganizationalHierarchy(rootPositionId?: string, maxDepth?: number): Promise<any[]>;
/**
 * Reassigns position reporting relationship
 *
 * @param positionId - Position identifier
 * @param newReportsToId - New supervisor position ID
 * @param effectiveDate - Effective date
 * @param transaction - Optional database transaction
 * @returns Updated position and hierarchy
 *
 * @example
 * ```typescript
 * const result = await reassignReportingRelationship(
 *   'pos-123',
 *   'pos-new-mgr',
 *   new Date()
 * );
 * ```
 */
export declare function reassignReportingRelationship(positionId: string, newReportsToId: string, effectiveDate?: Date, transaction?: Transaction): Promise<{
    position: Position;
    hierarchy: PositionHierarchy;
}>;
/**
 * Gets all subordinate positions (direct and indirect)
 *
 * @param positionId - Position identifier
 * @param directOnly - Return only direct reports
 * @returns Subordinate positions
 *
 * @example
 * ```typescript
 * const allSubordinates = await getSubordinatePositions('pos-mgr', false);
 * ```
 */
export declare function getSubordinatePositions(positionId: string, directOnly?: boolean): Promise<Position[]>;
/**
 * Calculates span of control metrics
 *
 * @param positionId - Position identifier
 * @returns Span of control analysis
 *
 * @example
 * ```typescript
 * const span = await calculateSpanOfControl('pos-mgr');
 * console.log(`Direct reports: ${span.directReports}`);
 * ```
 */
export declare function calculateSpanOfControl(positionId: string): Promise<{
    directReports: number;
    totalSubordinates: number;
    levelsBelow: number;
    averageSpan: number;
}>;
/**
 * Assigns employee to position
 *
 * @param positionId - Position identifier
 * @param employeeId - Employee identifier
 * @param startDate - Assignment start date
 * @param assignmentType - Type of assignment
 * @param transaction - Optional database transaction
 * @returns Updated position and incumbency record
 *
 * @example
 * ```typescript
 * const result = await assignEmployeeToPosition(
 *   'pos-123',
 *   'emp-456',
 *   new Date(),
 *   'permanent'
 * );
 * ```
 */
export declare function assignEmployeeToPosition(positionId: string, employeeId: string, startDate?: Date, assignmentType?: 'permanent' | 'acting' | 'interim' | 'temporary', transaction?: Transaction): Promise<{
    position: Position;
    incumbency: PositionIncumbency;
}>;
/**
 * Vacates position when employee leaves
 *
 * @param positionId - Position identifier
 * @param endDate - Vacancy date
 * @param transaction - Optional database transaction
 * @returns Updated position and incumbency
 *
 * @example
 * ```typescript
 * const result = await vacatePosition('pos-123', new Date());
 * ```
 */
export declare function vacatePosition(positionId: string, endDate?: Date, transaction?: Transaction): Promise<{
    position: Position;
    incumbency: PositionIncumbency | null;
}>;
/**
 * Gets all vacant positions
 *
 * @param departmentId - Optional department filter
 * @param isCritical - Filter for critical positions only
 * @returns Vacant positions
 *
 * @example
 * ```typescript
 * const vacancies = await getVacantPositions('dept-123', true);
 * ```
 */
export declare function getVacantPositions(departmentId?: string, isCritical?: boolean): Promise<Position[]>;
/**
 * Calculates days vacant for position
 *
 * @param positionId - Position identifier
 * @returns Days vacant
 *
 * @example
 * ```typescript
 * const days = await calculateDaysVacant('pos-123');
 * console.log(`Vacant for ${days} days`);
 * ```
 */
export declare function calculateDaysVacant(positionId: string): Promise<number>;
/**
 * Gets position incumbency history
 *
 * @param positionId - Position identifier
 * @returns Incumbency records
 *
 * @example
 * ```typescript
 * const history = await getPositionIncumbencyHistory('pos-123');
 * ```
 */
export declare function getPositionIncumbencyHistory(positionId: string): Promise<PositionIncumbency[]>;
/**
 * Creates position description
 *
 * @param data - Position description data
 * @param createdBy - Creator user ID
 * @param transaction - Optional database transaction
 * @returns Created position description
 *
 * @example
 * ```typescript
 * const desc = await createPositionDescription({
 *   positionId: 'pos-123',
 *   summary: 'Design and develop complex software systems',
 *   responsibilities: [
 *     'Lead technical design discussions',
 *     'Mentor junior engineers',
 *     'Write production code'
 *   ],
 *   requiredQualifications: ['BS in CS', '5+ years experience'],
 *   requiredSkills: ['TypeScript', 'Node.js', 'PostgreSQL'],
 *   educationRequirements: 'Bachelor degree in Computer Science or equivalent',
 *   experienceRequirements: '5+ years in software development'
 * }, 'user-123');
 * ```
 */
export declare function createPositionDescription(data: PositionDescriptionData, createdBy: string, transaction?: Transaction): Promise<PositionDescription>;
/**
 * Gets current position description
 *
 * @param positionId - Position identifier
 * @returns Current position description
 *
 * @example
 * ```typescript
 * const desc = await getCurrentPositionDescription('pos-123');
 * console.log(desc.responsibilities);
 * ```
 */
export declare function getCurrentPositionDescription(positionId: string): Promise<PositionDescription>;
/**
 * Updates position requirements
 *
 * @param descriptionId - Description identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated description
 *
 * @example
 * ```typescript
 * const updated = await updatePositionRequirements('desc-123', {
 *   requiredSkills: ['TypeScript', 'React', 'Node.js', 'AWS'],
 *   preferredSkills: ['Kubernetes', 'Terraform']
 * });
 * ```
 */
export declare function updatePositionRequirements(descriptionId: string, updates: Partial<PositionDescription>, transaction?: Transaction): Promise<PositionDescription>;
/**
 * Gets position description history
 *
 * @param positionId - Position identifier
 * @returns All versions of position description
 *
 * @example
 * ```typescript
 * const history = await getPositionDescriptionHistory('pos-123');
 * ```
 */
export declare function getPositionDescriptionHistory(positionId: string): Promise<PositionDescription[]>;
/**
 * Evaluates position for grading
 *
 * @param data - Evaluation criteria
 * @param transaction - Optional database transaction
 * @returns Created evaluation record
 *
 * @example
 * ```typescript
 * const eval = await evaluatePosition({
 *   positionId: 'pos-123',
 *   evaluationMethod: 'hay',
 *   points: 450,
 *   grade: GradeLevel.SENIOR,
 *   compensationBand: 'Band 3',
 *   evaluationDate: new Date(),
 *   evaluatedBy: 'user-456',
 *   notes: 'High complexity, strategic impact'
 * });
 * ```
 */
export declare function evaluatePosition(data: PositionEvaluationCriteria, transaction?: Transaction): Promise<PositionEvaluation>;
/**
 * Compares positions for equity analysis
 *
 * @param positionIds - Array of position IDs to compare
 * @returns Comparison analysis
 *
 * @example
 * ```typescript
 * const comparison = await comparePositions(['pos-1', 'pos-2', 'pos-3']);
 * ```
 */
export declare function comparePositions(positionIds: string[]): Promise<{
    positions: Position[];
    gradeDistribution: Record<string, number>;
    salaryRangeAnalysis: any;
}>;
/**
 * Recommends grade for position based on criteria
 *
 * @param positionId - Position identifier
 * @param criteria - Evaluation factors
 * @returns Recommended grade
 *
 * @example
 * ```typescript
 * const recommendation = await recommendPositionGrade('pos-123', {
 *   complexity: 'high',
 *   scope: 'department',
 *   reportingLevel: 3
 * });
 * ```
 */
export declare function recommendPositionGrade(positionId: string, criteria: {
    complexity: 'low' | 'medium' | 'high';
    scope: 'individual' | 'team' | 'department' | 'division' | 'organization';
    reportingLevel: number;
}): Promise<{
    recommendedGrade: GradeLevel;
    confidence: number;
    rationale: string;
}>;
/**
 * Gets market salary data for position
 *
 * @param positionId - Position identifier
 * @param marketLocation - Market location
 * @returns Market salary analysis
 *
 * @example
 * ```typescript
 * const market = await getMarketSalaryData('pos-123', 'San Francisco, CA');
 * ```
 */
export declare function getMarketSalaryData(positionId: string, marketLocation: string): Promise<{
    positionTitle: string;
    marketP25: number;
    marketP50: number;
    marketP75: number;
    currentRange: {
        min: number;
        max: number;
        midpoint: number;
    };
    competitiveness: string;
}>;
/**
 * Creates succession plan for position
 *
 * @param data - Succession plan data
 * @param transaction - Optional database transaction
 * @returns Created succession plan
 *
 * @example
 * ```typescript
 * const plan = await createSuccessionPlan({
 *   positionId: 'pos-ceo',
 *   successorEmployeeId: 'emp-456',
 *   readinessLevel: SuccessionReadiness.READY_IN_1_YEAR,
 *   developmentPlan: 'Executive MBA, board exposure',
 *   targetReadyDate: new Date('2025-12-31'),
 *   riskOfLoss: 'medium',
 *   retentionPlan: 'Equity grant, promotion path'
 * });
 * ```
 */
export declare function createSuccessionPlan(data: SuccessionPlanData, transaction?: Transaction): Promise<SuccessionPlan>;
/**
 * Updates succession plan readiness
 *
 * @param planId - Plan identifier
 * @param readinessLevel - New readiness level
 * @param notes - Update notes
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * const updated = await updateSuccessionReadiness(
 *   'plan-123',
 *   SuccessionReadiness.READY_NOW,
 *   'Completed all development objectives'
 * );
 * ```
 */
export declare function updateSuccessionReadiness(planId: string, readinessLevel: SuccessionReadiness, notes?: string, transaction?: Transaction): Promise<SuccessionPlan>;
/**
 * Gets succession plans for critical positions
 *
 * @param departmentId - Optional department filter
 * @returns Succession plans
 *
 * @example
 * ```typescript
 * const plans = await getSuccessionPlansForCriticalPositions('dept-123');
 * ```
 */
export declare function getSuccessionPlansForCriticalPositions(departmentId?: string): Promise<SuccessionPlan[]>;
/**
 * Identifies succession gaps
 *
 * @param departmentId - Optional department filter
 * @returns Positions without succession plans
 *
 * @example
 * ```typescript
 * const gaps = await identifySuccessionGaps('dept-exec');
 * ```
 */
export declare function identifySuccessionGaps(departmentId?: string): Promise<{
    positionsWithoutPlans: Position[];
    criticalWithoutPlans: Position[];
    insufficientReadiness: SuccessionPlan[];
}>;
/**
 * Freezes position to prevent hiring
 *
 * @param positionId - Position identifier
 * @param reason - Freeze reason
 * @param effectiveDate - Freeze effective date
 * @param transaction - Optional database transaction
 * @returns Frozen position
 *
 * @example
 * ```typescript
 * const frozen = await freezePosition(
 *   'pos-123',
 *   'Budget freeze for Q2',
 *   new Date()
 * );
 * ```
 */
export declare function freezePosition(positionId: string, reason: string, effectiveDate?: Date, transaction?: Transaction): Promise<Position>;
/**
 * NestJS Injectable service for Position Management
 *
 * @example
 * ```typescript
 * @Controller('positions')
 * export class PositionsController {
 *   constructor(private readonly positionService: PositionManagementService) {}
 *
 *   @Post()
 *   async createPosition(@Body() data: PositionCreationData) {
 *     return this.positionService.createPosition(data);
 *   }
 * }
 * ```
 */
export declare class PositionManagementService {
    createPosition(data: PositionCreationData): Promise<Position>;
    getPositionById(positionId: string): Promise<Position>;
    createPositionRequisition(data: PositionRequisitionData): Promise<PositionRequisition>;
    createPositionBudget(data: PositionBudgetData): Promise<PositionBudget>;
    getOrganizationalHierarchy(rootPositionId?: string, maxDepth?: number): Promise<any[]>;
    createPositionDescription(data: PositionDescriptionData, createdBy: string): Promise<PositionDescription>;
    createSuccessionPlan(data: SuccessionPlanData): Promise<SuccessionPlan>;
}
declare const _default: {
    Position: typeof Position;
    PositionRequisition: typeof PositionRequisition;
    PositionBudget: typeof PositionBudget;
    PositionHierarchy: typeof PositionHierarchy;
    PositionDescription: typeof PositionDescription;
    PositionEvaluation: typeof PositionEvaluation;
    SuccessionPlan: typeof SuccessionPlan;
    PositionIncumbency: typeof PositionIncumbency;
    createPosition: typeof createPosition;
    generatePositionNumber: typeof generatePositionNumber;
    updatePosition: typeof updatePosition;
    activatePosition: typeof activatePosition;
    getPositionById: typeof getPositionById;
    searchPositions: typeof searchPositions;
    eliminatePosition: typeof eliminatePosition;
    assignJobCode: typeof assignJobCode;
    getPositionsByJobCode: typeof getPositionsByJobCode;
    reclassifyPosition: typeof reclassifyPosition;
    getPositionsByGrade: typeof getPositionsByGrade;
    validateJobCode: typeof validateJobCode;
    createPositionBudget: typeof createPositionBudget;
    updatePositionBudgetActuals: typeof updatePositionBudgetActuals;
    getPositionBudgetsByYear: typeof getPositionBudgetsByYear;
    calculateDepartmentBudget: typeof calculateDepartmentBudget;
    getBudgetVarianceReport: typeof getBudgetVarianceReport;
    forecastPositionBudget: typeof forecastPositionBudget;
    createPositionRequisition: typeof createPositionRequisition;
    generateRequisitionNumber: typeof generateRequisitionNumber;
    approveRequisition: typeof approveRequisition;
    sendRequisitionToRecruiting: typeof sendRequisitionToRecruiting;
    fillRequisition: typeof fillRequisition;
    createPositionHierarchy: typeof createPositionHierarchy;
    getOrganizationalHierarchy: typeof getOrganizationalHierarchy;
    reassignReportingRelationship: typeof reassignReportingRelationship;
    getSubordinatePositions: typeof getSubordinatePositions;
    calculateSpanOfControl: typeof calculateSpanOfControl;
    assignEmployeeToPosition: typeof assignEmployeeToPosition;
    vacatePosition: typeof vacatePosition;
    getVacantPositions: typeof getVacantPositions;
    calculateDaysVacant: typeof calculateDaysVacant;
    getPositionIncumbencyHistory: typeof getPositionIncumbencyHistory;
    createPositionDescription: typeof createPositionDescription;
    getCurrentPositionDescription: typeof getCurrentPositionDescription;
    updatePositionRequirements: typeof updatePositionRequirements;
    getPositionDescriptionHistory: typeof getPositionDescriptionHistory;
    evaluatePosition: typeof evaluatePosition;
    comparePositions: typeof comparePositions;
    recommendPositionGrade: typeof recommendPositionGrade;
    getMarketSalaryData: typeof getMarketSalaryData;
    createSuccessionPlan: typeof createSuccessionPlan;
    updateSuccessionReadiness: typeof updateSuccessionReadiness;
    getSuccessionPlansForCriticalPositions: typeof getSuccessionPlansForCriticalPositions;
    identifySuccessionGaps: typeof identifySuccessionGaps;
    freezePosition: typeof freezePosition;
    PositionManagementService: typeof PositionManagementService;
};
export default _default;
//# sourceMappingURL=position-management-kit.d.ts.map