/**
 * LOC: POSCTRL001
 * File: /reuse/government/position-control-workforce-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/budget-planning-allocation-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend government HR modules
 *   - Position management services
 *   - Workforce planning systems
 *   - Budget allocation modules
 */
/**
 * File: /reuse/government/position-control-workforce-kit.ts
 * Locator: WC-GOV-POSCTRL-001
 * Purpose: Comprehensive Position Control & Workforce Management - Government position budgeting and headcount tracking
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, budget-planning-allocation-kit
 * Downstream: ../backend/government/*, Position Services, Workforce Planning, Budget Allocation, HR Systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for position management, budgeting, classification, vacancy tracking, funding allocation, authorization, salary management, requisition, headcount reporting
 *
 * LLM Context: Enterprise-grade position control system for government workforce management.
 * Provides comprehensive position lifecycle management, position budgeting, classification tracking, vacancy management,
 * position funding allocation, authorization workflows, salary range administration, position requisition, headcount reporting,
 * FTE calculation, position cost analysis, organizational hierarchy management, and workforce planning.
 */
import { Sequelize, Transaction } from 'sequelize';
interface Position {
    positionId: number;
    positionNumber: string;
    positionTitle: string;
    classificationCode: string;
    classificationTitle: string;
    gradeLevel: string;
    step?: number;
    organizationCode: string;
    departmentCode: string;
    divisionCode?: string;
    supervisorPositionId?: number;
    positionType: 'PERMANENT' | 'TEMPORARY' | 'TERM' | 'SEASONAL' | 'INTERMITTENT';
    employmentType: 'FULL_TIME' | 'PART_TIME' | 'INTERMITTENT';
    fte: number;
    status: 'AUTHORIZED' | 'FILLED' | 'VACANT' | 'FROZEN' | 'ABOLISHED' | 'PENDING';
    budgetedSalary: number;
    actualSalary?: number;
    fiscalYear: number;
}
interface PositionBudget {
    budgetId: number;
    positionId: number;
    fiscalYear: number;
    budgetedSalary: number;
    budgetedBenefits: number;
    otherCosts: number;
    totalBudgeted: number;
    actualSalary: number;
    actualBenefits: number;
    actualOtherCosts: number;
    totalActual: number;
    variance: number;
    fundingSources: FundingSource[];
}
interface FundingSource {
    sourceId: number;
    positionBudgetId: number;
    fundCode: string;
    fundName: string;
    accountCode: string;
    percentage: number;
    amount: number;
    fiscalYear: number;
}
interface PositionClassification {
    classificationCode: string;
    classificationTitle: string;
    series: string;
    occupationalCategory: string;
    gradeLevel: string;
    minSalary: number;
    maxSalary: number;
    midSalary: number;
    standardDuties: string;
    qualifications: string;
    effectiveDate: Date;
    supersededBy?: string;
}
interface Vacancy {
    vacancyId: number;
    positionId: number;
    vacancyNumber: string;
    vacantSince: Date;
    vacancyReason: 'RESIGNATION' | 'RETIREMENT' | 'TRANSFER' | 'TERMINATION' | 'NEW_POSITION';
    recruitmentStatus: 'NOT_STARTED' | 'ADVERTISING' | 'SCREENING' | 'INTERVIEWING' | 'OFFER_EXTENDED' | 'FILLED' | 'CANCELLED';
    targetFillDate?: Date;
    estimatedCostSavings: number;
    isAuthorizedToFill: boolean;
}
interface PositionFunding {
    fundingId: number;
    positionId: number;
    fiscalYear: number;
    fundCode: string;
    accountCode: string;
    budgetLineId: number;
    fundingPercentage: number;
    annualAmount: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    effectiveDate: Date;
    endDate?: Date;
}
interface PositionAuthorization {
    authorizationId: number;
    positionId: number;
    authorizationType: 'NEW' | 'RECLASS' | 'ABOLISH' | 'FREEZE' | 'UNFREEZE';
    requestedBy: string;
    requestDate: Date;
    justification: string;
    approvalWorkflow: ApprovalStep[];
    currentApprovalLevel: number;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
    effectiveDate?: Date;
}
interface ApprovalStep {
    level: number;
    approverRole: string;
    approverId?: string;
    approverName?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvalDate?: Date;
    comments?: string;
}
interface SalaryRange {
    rangeId: number;
    classificationCode: string;
    gradeLevel: string;
    step: number;
    annualSalary: number;
    hourlyRate: number;
    effectiveDate: Date;
    endDate?: Date;
    locality?: string;
}
interface HeadcountReport {
    reportDate: Date;
    fiscalYear: number;
    organizationCode: string;
    totalAuthorized: number;
    totalFilled: number;
    totalVacant: number;
    totalFrozen: number;
    totalFTE: number;
    filledFTE: number;
    vacantFTE: number;
    vacancyRate: number;
}
interface PositionCostAnalysis {
    positionId: number;
    fiscalYear: number;
    baseSalary: number;
    benefits: number;
    benefitRate: number;
    overtime: number;
    otherCosts: number;
    totalCompensation: number;
    fundedAmount: number;
    variance: number;
}
interface OrganizationalHierarchy {
    organizationCode: string;
    organizationName: string;
    parentOrganizationCode?: string;
    level: number;
    positions: Position[];
    childOrganizations: OrganizationalHierarchy[];
    totalAuthorized: number;
    totalFilled: number;
    totalFTE: number;
}
export declare class CreatePositionDto {
    positionTitle: string;
    classificationCode: string;
    gradeLevel: string;
    organizationCode: string;
    departmentCode: string;
    positionType: string;
    employmentType: string;
    fte: number;
    budgetedSalary: number;
    fiscalYear: number;
}
export declare class UpdatePositionBudgetDto {
    positionId: number;
    fiscalYear: number;
    budgetedSalary: number;
    budgetedBenefits: number;
    otherCosts: number;
    fundingSources: FundingSource[];
}
export declare class CreateVacancyDto {
    positionId: number;
    vacancyReason: string;
    vacantSince: Date;
    targetFillDate?: Date;
    isAuthorizedToFill: boolean;
}
export declare class PositionAuthorizationDto {
    positionId: number;
    authorizationType: string;
    justification: string;
    requestedBy: string;
    effectiveDate?: Date;
}
export declare class HeadcountReportRequestDto {
    fiscalYear: number;
    organizationCode?: string;
    includeChildren?: boolean;
    asOfDate?: Date;
}
/**
 * Sequelize model for Position with classification and organizational tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Position model
 *
 * @example
 * ```typescript
 * const Position = createPositionModel(sequelize);
 * const position = await Position.create({
 *   positionNumber: 'POS-2025-001',
 *   positionTitle: 'Senior Engineer',
 *   classificationCode: 'GS-0801',
 *   gradeLevel: 'GS-13',
 *   organizationCode: 'ORG-100',
 *   status: 'AUTHORIZED'
 * });
 * ```
 */
export declare const createPositionModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        positionNumber: string;
        positionTitle: string;
        classificationCode: string;
        classificationTitle: string;
        gradeLevel: string;
        step: number | null;
        series: string | null;
        organizationCode: string;
        organizationName: string;
        departmentCode: string;
        divisionCode: string | null;
        sectionCode: string | null;
        supervisorPositionId: number | null;
        positionType: string;
        employmentType: string;
        fte: number;
        status: string;
        budgetedSalary: number;
        actualSalary: number | null;
        benefitRate: number;
        fiscalYear: number;
        authorizedDate: Date | null;
        filledDate: Date | null;
        vacantDate: Date | null;
        currentIncumbent: string | null;
        incumbentId: number | null;
        isExempt: boolean;
        isSupervisory: boolean;
        bargainingUnit: string | null;
        locationCode: string | null;
        fundingMix: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
        readonly createdBy: string;
        readonly updatedBy: string;
    };
};
/**
 * Sequelize model for Position Budgets with funding source tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionBudget model
 *
 * @example
 * ```typescript
 * const PositionBudget = createPositionBudgetModel(sequelize);
 * const budget = await PositionBudget.create({
 *   positionId: 1,
 *   fiscalYear: 2025,
 *   budgetedSalary: 95000,
 *   budgetedBenefits: 28500,
 *   totalBudgeted: 123500
 * });
 * ```
 */
export declare const createPositionBudgetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        positionId: number;
        fiscalYear: number;
        budgetedSalary: number;
        budgetedBenefits: number;
        budgetedOvertim: number;
        otherCosts: number;
        totalBudgeted: number;
        actualSalary: number;
        actualBenefits: number;
        actualOvertime: number;
        actualOtherCosts: number;
        totalActual: number;
        variance: number;
        benefitRate: number;
        encumbered: boolean;
        encumbranceNumber: string | null;
        budgetLineId: number | null;
        accountCode: string | null;
        fundingSources: Record<string, any>;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Position Vacancies with recruitment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PositionVacancy model
 *
 * @example
 * ```typescript
 * const Vacancy = createPositionVacancyModel(sequelize);
 * const vacancy = await Vacancy.create({
 *   positionId: 1,
 *   vacancyNumber: 'VAC-2025-001',
 *   vacantSince: new Date(),
 *   vacancyReason: 'RETIREMENT',
 *   recruitmentStatus: 'ADVERTISING'
 * });
 * ```
 */
export declare const createPositionVacancyModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        positionId: number;
        vacancyNumber: string;
        vacantSince: Date;
        vacancyReason: string;
        previousIncumbent: string | null;
        previousIncumbentId: number | null;
        recruitmentStatus: string;
        recruitmentStartDate: Date | null;
        announcementNumber: string | null;
        applicantCount: number;
        interviewCount: number;
        targetFillDate: Date | null;
        actualFillDate: Date | null;
        estimatedCostSavings: number;
        actualCostSavings: number;
        isAuthorizedToFill: boolean;
        authorizationDate: Date | null;
        authorizedBy: string | null;
        recruitmentNotes: string | null;
        status: string;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new position with budget allocation.
 *
 * @param {object} positionData - Position creation data
 * @param {string} userId - User creating the position
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<Position>} Created position
 *
 * @example
 * ```typescript
 * const position = await createPosition({
 *   positionTitle: 'Senior Engineer',
 *   classificationCode: 'GS-0801',
 *   gradeLevel: 'GS-13',
 *   organizationCode: 'ORG-100',
 *   departmentCode: 'DEPT-10',
 *   positionType: 'PERMANENT',
 *   employmentType: 'FULL_TIME',
 *   fte: 1.0,
 *   budgetedSalary: 95000,
 *   fiscalYear: 2025
 * }, 'admin');
 * ```
 */
export declare const createPosition: (positionData: any, userId: string, transaction?: Transaction) => Promise<Position>;
/**
 * Generates unique position number.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {string} Generated position number
 *
 * @example
 * ```typescript
 * const posNumber = generatePositionNumber('ORG-100', 2025);
 * // Returns: 'POS-ORG100-2025-001234'
 * ```
 */
export declare const generatePositionNumber: (organizationCode: string, fiscalYear: number) => string;
/**
 * Updates position details.
 *
 * @param {number} positionId - Position ID
 * @param {object} updates - Position updates
 * @param {string} userId - User making updates
 * @returns {Promise<Position>} Updated position
 *
 * @example
 * ```typescript
 * const updated = await updatePosition(1, {
 *   positionTitle: 'Lead Engineer',
 *   budgetedSalary: 105000
 * }, 'manager');
 * ```
 */
export declare const updatePosition: (positionId: number, updates: any, userId: string) => Promise<Position>;
/**
 * Abolishes a position.
 *
 * @param {number} positionId - Position ID
 * @param {string} reason - Abolishment reason
 * @param {string} userId - User abolishing position
 * @returns {Promise<Position>} Abolished position
 *
 * @example
 * ```typescript
 * const abolished = await abolishPosition(1, 'Organizational restructuring', 'admin');
 * ```
 */
export declare const abolishPosition: (positionId: number, reason: string, userId: string) => Promise<Position>;
/**
 * Retrieves position by number or ID.
 *
 * @param {string | number} identifier - Position number or ID
 * @returns {Promise<Position | null>} Position or null
 *
 * @example
 * ```typescript
 * const position = await getPosition('POS-ORG100-2025-001234');
 * ```
 */
export declare const getPosition: (identifier: string | number) => Promise<Position | null>;
/**
 * Creates position budget for fiscal year.
 *
 * @param {object} budgetData - Budget data
 * @param {string} userId - User creating budget
 * @returns {Promise<PositionBudget>} Created position budget
 *
 * @example
 * ```typescript
 * const budget = await createPositionBudget({
 *   positionId: 1,
 *   fiscalYear: 2025,
 *   budgetedSalary: 95000,
 *   budgetedBenefits: 28500,
 *   otherCosts: 5000
 * }, 'budget.officer');
 * ```
 */
export declare const createPositionBudget: (budgetData: any, userId: string) => Promise<PositionBudget>;
/**
 * Updates position budget.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @param {object} updates - Budget updates
 * @returns {Promise<PositionBudget>} Updated budget
 *
 * @example
 * ```typescript
 * const updated = await updatePositionBudget(1, 2025, {
 *   budgetedSalary: 100000,
 *   budgetedBenefits: 30000
 * });
 * ```
 */
export declare const updatePositionBudget: (positionId: number, fiscalYear: number, updates: any) => Promise<PositionBudget>;
/**
 * Calculates total position cost including benefits.
 *
 * @param {number} salary - Base salary
 * @param {number} benefitRate - Benefit rate percentage
 * @param {number} [otherCosts=0] - Other costs
 * @returns {number} Total position cost
 *
 * @example
 * ```typescript
 * const total = calculatePositionCost(95000, 30, 5000);
 * // Returns: 128500
 * ```
 */
export declare const calculatePositionCost: (salary: number, benefitRate: number, otherCosts?: number) => number;
/**
 * Allocates position budget to funding sources.
 *
 * @param {number} positionBudgetId - Position budget ID
 * @param {FundingSource[]} fundingSources - Funding source allocations
 * @returns {Promise<object>} Allocation result
 *
 * @example
 * ```typescript
 * const result = await allocatePositionFunding(1, [
 *   { fundCode: 'FUND-A', percentage: 60, amount: 75000 },
 *   { fundCode: 'FUND-B', percentage: 40, amount: 50000 }
 * ]);
 * ```
 */
export declare const allocatePositionFunding: (positionBudgetId: number, fundingSources: FundingSource[]) => Promise<any>;
/**
 * Retrieves position budget for fiscal year.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PositionBudget | null>} Position budget or null
 *
 * @example
 * ```typescript
 * const budget = await getPositionBudget(1, 2025);
 * ```
 */
export declare const getPositionBudget: (positionId: number, fiscalYear: number) => Promise<PositionBudget | null>;
/**
 * Classifies or reclassifies a position.
 *
 * @param {number} positionId - Position ID
 * @param {string} classificationCode - New classification code
 * @param {string} gradeLevel - New grade level
 * @param {string} reason - Reason for classification change
 * @param {string} userId - User performing classification
 * @returns {Promise<Position>} Reclassified position
 *
 * @example
 * ```typescript
 * const reclassified = await classifyPosition(1, 'GS-0801', 'GS-14', 'Promotion', 'hr.specialist');
 * ```
 */
export declare const classifyPosition: (positionId: number, classificationCode: string, gradeLevel: string, reason: string, userId: string) => Promise<Position>;
/**
 * Retrieves classification details.
 *
 * @param {string} classificationCode - Classification code
 * @returns {Promise<PositionClassification | null>} Classification details
 *
 * @example
 * ```typescript
 * const classification = await getClassificationDetails('GS-0801');
 * ```
 */
export declare const getClassificationDetails: (classificationCode: string) => Promise<PositionClassification | null>;
/**
 * Lists all positions by classification.
 *
 * @param {string} classificationCode - Classification code
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<Position[]>} Positions with classification
 *
 * @example
 * ```typescript
 * const positions = await getPositionsByClassification('GS-0801', 2025);
 * ```
 */
export declare const getPositionsByClassification: (classificationCode: string, fiscalYear?: number) => Promise<Position[]>;
/**
 * Validates position classification.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateClassification('GS-0801', 'GS-13');
 * ```
 */
export declare const validateClassification: (classificationCode: string, gradeLevel: string) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Retrieves salary range for classification and grade.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @param {number} [step] - Optional step
 * @returns {Promise<SalaryRange | null>} Salary range
 *
 * @example
 * ```typescript
 * const range = await getSalaryRange('GS-0801', 'GS-13', 5);
 * ```
 */
export declare const getSalaryRange: (classificationCode: string, gradeLevel: string, step?: number) => Promise<SalaryRange | null>;
/**
 * Creates vacancy record for position.
 *
 * @param {object} vacancyData - Vacancy data
 * @param {string} userId - User creating vacancy
 * @returns {Promise<Vacancy>} Created vacancy
 *
 * @example
 * ```typescript
 * const vacancy = await createVacancy({
 *   positionId: 1,
 *   vacancyReason: 'RETIREMENT',
 *   vacantSince: new Date(),
 *   isAuthorizedToFill: true
 * }, 'hr.manager');
 * ```
 */
export declare const createVacancy: (vacancyData: any, userId: string) => Promise<Vacancy>;
/**
 * Updates vacancy status and recruitment progress.
 *
 * @param {number} vacancyId - Vacancy ID
 * @param {object} updates - Vacancy updates
 * @returns {Promise<Vacancy>} Updated vacancy
 *
 * @example
 * ```typescript
 * const updated = await updateVacancy(1, {
 *   recruitmentStatus: 'INTERVIEWING',
 *   applicantCount: 15,
 *   interviewCount: 5
 * });
 * ```
 */
export declare const updateVacancy: (vacancyId: number, updates: any) => Promise<Vacancy>;
/**
 * Fills vacancy with new incumbent.
 *
 * @param {number} vacancyId - Vacancy ID
 * @param {string} incumbentName - New employee name
 * @param {number} incumbentId - New employee ID
 * @param {Date} fillDate - Fill date
 * @returns {Promise<Vacancy>} Filled vacancy
 *
 * @example
 * ```typescript
 * const filled = await fillVacancy(1, 'Jane Smith', 12345, new Date());
 * ```
 */
export declare const fillVacancy: (vacancyId: number, incumbentName: string, incumbentId: number, fillDate: Date) => Promise<Vacancy>;
/**
 * Calculates cost savings from vacancy.
 *
 * @param {number} vacancyId - Vacancy ID
 * @returns {Promise<number>} Cost savings amount
 *
 * @example
 * ```typescript
 * const savings = await calculateVacancyCostSavings(1);
 * ```
 */
export declare const calculateVacancyCostSavings: (vacancyId: number) => Promise<number>;
/**
 * Retrieves all vacancies for organization.
 *
 * @param {string} organizationCode - Organization code
 * @param {object} [filters] - Optional filters
 * @returns {Promise<Vacancy[]>} Vacancies
 *
 * @example
 * ```typescript
 * const vacancies = await getVacancies('ORG-100', { status: 'OPEN' });
 * ```
 */
export declare const getVacancies: (organizationCode: string, filters?: any) => Promise<Vacancy[]>;
/**
 * Creates funding allocation for position.
 *
 * @param {object} fundingData - Funding allocation data
 * @returns {Promise<PositionFunding>} Created funding allocation
 *
 * @example
 * ```typescript
 * const funding = await createPositionFundingAllocation({
 *   positionId: 1,
 *   fiscalYear: 2025,
 *   fundCode: 'FUND-A',
 *   accountCode: '5100-001',
 *   fundingPercentage: 100,
 *   annualAmount: 125000
 * });
 * ```
 */
export declare const createPositionFundingAllocation: (fundingData: any) => Promise<PositionFunding>;
/**
 * Updates position funding allocation.
 *
 * @param {number} fundingId - Funding ID
 * @param {object} updates - Funding updates
 * @returns {Promise<PositionFunding>} Updated funding
 *
 * @example
 * ```typescript
 * const updated = await updatePositionFundingAllocation(1, {
 *   fundingPercentage: 60,
 *   annualAmount: 75000
 * });
 * ```
 */
export declare const updatePositionFundingAllocation: (fundingId: number, updates: any) => Promise<PositionFunding>;
/**
 * Validates funding allocation totals to 100%.
 *
 * @param {number} positionId - Position ID
 * @param {FundingSource[]} fundingSources - Funding sources
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateFundingAllocation(1, fundingSources);
 * ```
 */
export declare const validateFundingAllocation: (positionId: number, fundingSources: FundingSource[]) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Retrieves position funding sources.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PositionFunding[]>} Funding sources
 *
 * @example
 * ```typescript
 * const funding = await getPositionFunding(1, 2025);
 * ```
 */
export declare const getPositionFunding: (positionId: number, fiscalYear: number) => Promise<PositionFunding[]>;
/**
 * Reallocates position funding between sources.
 *
 * @param {number} positionId - Position ID
 * @param {FundingSource[]} newAllocation - New funding allocation
 * @param {string} reason - Reason for reallocation
 * @returns {Promise<PositionFunding[]>} Updated funding allocation
 *
 * @example
 * ```typescript
 * const reallocated = await reallocatePositionFunding(1, newSources, 'Budget adjustment');
 * ```
 */
export declare const reallocatePositionFunding: (positionId: number, newAllocation: FundingSource[], reason: string) => Promise<PositionFunding[]>;
/**
 * Creates position authorization request.
 *
 * @param {object} authData - Authorization request data
 * @param {string} userId - User creating request
 * @returns {Promise<PositionAuthorization>} Authorization request
 *
 * @example
 * ```typescript
 * const auth = await createPositionAuthorization({
 *   positionId: 1,
 *   authorizationType: 'NEW',
 *   justification: 'Increased workload requires additional staff',
 *   requestedBy: 'manager.jones'
 * }, 'manager.jones');
 * ```
 */
export declare const createPositionAuthorization: (authData: any, userId: string) => Promise<PositionAuthorization>;
/**
 * Approves position authorization at workflow level.
 *
 * @param {number} authorizationId - Authorization ID
 * @param {string} approverId - Approver ID
 * @param {string} comments - Approval comments
 * @returns {Promise<PositionAuthorization>} Updated authorization
 *
 * @example
 * ```typescript
 * const approved = await approvePositionAuthorization(1, 'director.smith', 'Approved');
 * ```
 */
export declare const approvePositionAuthorization: (authorizationId: number, approverId: string, comments: string) => Promise<PositionAuthorization>;
/**
 * Rejects position authorization.
 *
 * @param {number} authorizationId - Authorization ID
 * @param {string} approverId - Approver ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<PositionAuthorization>} Rejected authorization
 *
 * @example
 * ```typescript
 * const rejected = await rejectPositionAuthorization(1, 'director', 'Insufficient budget');
 * ```
 */
export declare const rejectPositionAuthorization: (authorizationId: number, approverId: string, reason: string) => Promise<PositionAuthorization>;
/**
 * Freezes position (prevents filling).
 *
 * @param {number} positionId - Position ID
 * @param {string} reason - Freeze reason
 * @param {string} userId - User freezing position
 * @returns {Promise<Position>} Frozen position
 *
 * @example
 * ```typescript
 * const frozen = await freezePosition(1, 'Budget constraints', 'admin');
 * ```
 */
export declare const freezePosition: (positionId: number, reason: string, userId: string) => Promise<Position>;
/**
 * Unfreezes position.
 *
 * @param {number} positionId - Position ID
 * @param {string} userId - User unfreezing position
 * @returns {Promise<Position>} Unfrozen position
 *
 * @example
 * ```typescript
 * const unfrozen = await unfreezePosition(1, 'admin');
 * ```
 */
export declare const unfreezePosition: (positionId: number, userId: string) => Promise<Position>;
/**
 * Creates or updates salary range for classification.
 *
 * @param {object} rangeData - Salary range data
 * @returns {Promise<SalaryRange>} Salary range
 *
 * @example
 * ```typescript
 * const range = await createSalaryRange({
 *   classificationCode: 'GS-0801',
 *   gradeLevel: 'GS-13',
 *   step: 5,
 *   annualSalary: 95000,
 *   effectiveDate: new Date()
 * });
 * ```
 */
export declare const createSalaryRange: (rangeData: any) => Promise<SalaryRange>;
/**
 * Retrieves salary range for classification and grade.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @param {number} [step] - Optional step
 * @returns {Promise<SalaryRange | null>} Salary range
 *
 * @example
 * ```typescript
 * const range = await getSalaryRangeForGrade('GS-0801', 'GS-13', 5);
 * ```
 */
export declare const getSalaryRangeForGrade: (classificationCode: string, gradeLevel: string, step?: number) => Promise<SalaryRange | null>;
/**
 * Calculates step increase for position.
 *
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @param {number} currentStep - Current step
 * @returns {Promise<{ newStep: number; newSalary: number; increase: number }>} Step increase
 *
 * @example
 * ```typescript
 * const increase = await calculateStepIncrease('GS-0801', 'GS-13', 5);
 * ```
 */
export declare const calculateStepIncrease: (classificationCode: string, gradeLevel: string, currentStep: number) => Promise<{
    newStep: number;
    newSalary: number;
    increase: number;
}>;
/**
 * Applies cost of living adjustment (COLA) to salary ranges.
 *
 * @param {number} fiscalYear - Fiscal year
 * @param {number} colaPercentage - COLA percentage
 * @returns {Promise<number>} Number of ranges updated
 *
 * @example
 * ```typescript
 * const updated = await applyCOLAdjustment(2025, 2.5);
 * ```
 */
export declare const applyCOLAdjustment: (fiscalYear: number, colaPercentage: number) => Promise<number>;
/**
 * Validates salary against position classification range.
 *
 * @param {number} salary - Salary to validate
 * @param {string} classificationCode - Classification code
 * @param {string} gradeLevel - Grade level
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateSalaryInRange(95000, 'GS-0801', 'GS-13');
 * ```
 */
export declare const validateSalaryInRange: (salary: number, classificationCode: string, gradeLevel: string) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Generates headcount report for organization.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {boolean} [includeChildren=true] - Include child organizations
 * @returns {Promise<HeadcountReport>} Headcount report
 *
 * @example
 * ```typescript
 * const report = await generateHeadcountReport('ORG-100', 2025, true);
 * ```
 */
export declare const generateHeadcountReport: (organizationCode: string, fiscalYear: number, includeChildren?: boolean) => Promise<HeadcountReport>;
/**
 * Calculates headcount by classification.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<object[]>} Headcount by classification
 *
 * @example
 * ```typescript
 * const breakdown = await calculateHeadcountByClassification('ORG-100', 2025);
 * ```
 */
export declare const calculateHeadcountByClassification: (organizationCode: string, fiscalYear: number) => Promise<any[]>;
/**
 * Calculates vacancy rate for organization.
 *
 * @param {string} organizationCode - Organization code
 * @returns {Promise<number>} Vacancy rate percentage
 *
 * @example
 * ```typescript
 * const rate = await calculateVacancyRate('ORG-100');
 * // Returns: 10.5
 * ```
 */
export declare const calculateVacancyRate: (organizationCode: string) => Promise<number>;
/**
 * Compares headcount year-over-year.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear1 - First fiscal year
 * @param {number} fiscalYear2 - Second fiscal year
 * @returns {Promise<object>} Year-over-year comparison
 *
 * @example
 * ```typescript
 * const comparison = await compareHeadcountYearOverYear('ORG-100', 2024, 2025);
 * ```
 */
export declare const compareHeadcountYearOverYear: (organizationCode: string, fiscalYear1: number, fiscalYear2: number) => Promise<any>;
/**
 * Exports headcount data.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @param {string} format - Export format
 * @returns {Promise<Buffer>} Exported data
 *
 * @example
 * ```typescript
 * const csvData = await exportHeadcountData('ORG-100', 2025, 'CSV');
 * ```
 */
export declare const exportHeadcountData: (organizationCode: string, fiscalYear: number, format: string) => Promise<Buffer>;
/**
 * Calculates FTE for position based on work schedule.
 *
 * @param {number} scheduledHours - Scheduled hours per week
 * @param {number} [standardHours=40] - Standard full-time hours
 * @returns {number} FTE value
 *
 * @example
 * ```typescript
 * const fte = calculateFTE(32, 40);
 * // Returns: 0.8
 * ```
 */
export declare const calculateFTE: (scheduledHours: number, standardHours?: number) => number;
/**
 * Calculates total FTE for organization.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Total FTE
 *
 * @example
 * ```typescript
 * const totalFTE = await calculateTotalFTE('ORG-100', 2025);
 * ```
 */
export declare const calculateTotalFTE: (organizationCode: string, fiscalYear: number) => Promise<number>;
/**
 * Analyzes position costs including all components.
 *
 * @param {number} positionId - Position ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<PositionCostAnalysis>} Cost analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzePositionCost(1, 2025);
 * ```
 */
export declare const analyzePositionCost: (positionId: number, fiscalYear: number) => Promise<PositionCostAnalysis>;
/**
 * Calculates organizational salary budget.
 *
 * @param {string} organizationCode - Organization code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Total salary budget
 *
 * @example
 * ```typescript
 * const budget = await calculateOrganizationSalaryBudget('ORG-100', 2025);
 * ```
 */
export declare const calculateOrganizationSalaryBudget: (organizationCode: string, fiscalYear: number) => Promise<number>;
/**
 * Builds organizational hierarchy with position data.
 *
 * @param {string} rootOrganizationCode - Root organization code
 * @param {boolean} [includePositions=true] - Include position details
 * @returns {Promise<OrganizationalHierarchy>} Organizational hierarchy
 *
 * @example
 * ```typescript
 * const hierarchy = await buildOrganizationalHierarchy('ORG-100', true);
 * ```
 */
export declare const buildOrganizationalHierarchy: (rootOrganizationCode: string, includePositions?: boolean) => Promise<OrganizationalHierarchy>;
/**
 * Default export with all utilities.
 */
declare const _default: {
    createPositionModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            positionNumber: string;
            positionTitle: string;
            classificationCode: string;
            classificationTitle: string;
            gradeLevel: string;
            step: number | null;
            series: string | null;
            organizationCode: string;
            organizationName: string;
            departmentCode: string;
            divisionCode: string | null;
            sectionCode: string | null;
            supervisorPositionId: number | null;
            positionType: string;
            employmentType: string;
            fte: number;
            status: string;
            budgetedSalary: number;
            actualSalary: number | null;
            benefitRate: number;
            fiscalYear: number;
            authorizedDate: Date | null;
            filledDate: Date | null;
            vacantDate: Date | null;
            currentIncumbent: string | null;
            incumbentId: number | null;
            isExempt: boolean;
            isSupervisory: boolean;
            bargainingUnit: string | null;
            locationCode: string | null;
            fundingMix: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
            readonly createdBy: string;
            readonly updatedBy: string;
        };
    };
    createPositionBudgetModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            positionId: number;
            fiscalYear: number;
            budgetedSalary: number;
            budgetedBenefits: number;
            budgetedOvertim: number;
            otherCosts: number;
            totalBudgeted: number;
            actualSalary: number;
            actualBenefits: number;
            actualOvertime: number;
            actualOtherCosts: number;
            totalActual: number;
            variance: number;
            benefitRate: number;
            encumbered: boolean;
            encumbranceNumber: string | null;
            budgetLineId: number | null;
            accountCode: string | null;
            fundingSources: Record<string, any>;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPositionVacancyModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            positionId: number;
            vacancyNumber: string;
            vacantSince: Date;
            vacancyReason: string;
            previousIncumbent: string | null;
            previousIncumbentId: number | null;
            recruitmentStatus: string;
            recruitmentStartDate: Date | null;
            announcementNumber: string | null;
            applicantCount: number;
            interviewCount: number;
            targetFillDate: Date | null;
            actualFillDate: Date | null;
            estimatedCostSavings: number;
            actualCostSavings: number;
            isAuthorizedToFill: boolean;
            authorizationDate: Date | null;
            authorizedBy: string | null;
            recruitmentNotes: string | null;
            status: string;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createPosition: (positionData: any, userId: string, transaction?: Transaction) => Promise<Position>;
    generatePositionNumber: (organizationCode: string, fiscalYear: number) => string;
    updatePosition: (positionId: number, updates: any, userId: string) => Promise<Position>;
    abolishPosition: (positionId: number, reason: string, userId: string) => Promise<Position>;
    getPosition: (identifier: string | number) => Promise<Position | null>;
    createPositionBudget: (budgetData: any, userId: string) => Promise<PositionBudget>;
    updatePositionBudget: (positionId: number, fiscalYear: number, updates: any) => Promise<PositionBudget>;
    calculatePositionCost: (salary: number, benefitRate: number, otherCosts?: number) => number;
    allocatePositionFunding: (positionBudgetId: number, fundingSources: FundingSource[]) => Promise<any>;
    getPositionBudget: (positionId: number, fiscalYear: number) => Promise<PositionBudget | null>;
    classifyPosition: (positionId: number, classificationCode: string, gradeLevel: string, reason: string, userId: string) => Promise<Position>;
    getClassificationDetails: (classificationCode: string) => Promise<PositionClassification | null>;
    getPositionsByClassification: (classificationCode: string, fiscalYear?: number) => Promise<Position[]>;
    validateClassification: (classificationCode: string, gradeLevel: string) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    getSalaryRange: (classificationCode: string, gradeLevel: string, step?: number) => Promise<SalaryRange | null>;
    createVacancy: (vacancyData: any, userId: string) => Promise<Vacancy>;
    updateVacancy: (vacancyId: number, updates: any) => Promise<Vacancy>;
    fillVacancy: (vacancyId: number, incumbentName: string, incumbentId: number, fillDate: Date) => Promise<Vacancy>;
    calculateVacancyCostSavings: (vacancyId: number) => Promise<number>;
    getVacancies: (organizationCode: string, filters?: any) => Promise<Vacancy[]>;
    createPositionFundingAllocation: (fundingData: any) => Promise<PositionFunding>;
    updatePositionFundingAllocation: (fundingId: number, updates: any) => Promise<PositionFunding>;
    validateFundingAllocation: (positionId: number, fundingSources: FundingSource[]) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    getPositionFunding: (positionId: number, fiscalYear: number) => Promise<PositionFunding[]>;
    reallocatePositionFunding: (positionId: number, newAllocation: FundingSource[], reason: string) => Promise<PositionFunding[]>;
    createPositionAuthorization: (authData: any, userId: string) => Promise<PositionAuthorization>;
    approvePositionAuthorization: (authorizationId: number, approverId: string, comments: string) => Promise<PositionAuthorization>;
    rejectPositionAuthorization: (authorizationId: number, approverId: string, reason: string) => Promise<PositionAuthorization>;
    freezePosition: (positionId: number, reason: string, userId: string) => Promise<Position>;
    unfreezePosition: (positionId: number, userId: string) => Promise<Position>;
    createSalaryRange: (rangeData: any) => Promise<SalaryRange>;
    getSalaryRangeForGrade: (classificationCode: string, gradeLevel: string, step?: number) => Promise<SalaryRange | null>;
    calculateStepIncrease: (classificationCode: string, gradeLevel: string, currentStep: number) => Promise<{
        newStep: number;
        newSalary: number;
        increase: number;
    }>;
    applyCOLAdjustment: (fiscalYear: number, colaPercentage: number) => Promise<number>;
    validateSalaryInRange: (salary: number, classificationCode: string, gradeLevel: string) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    generateHeadcountReport: (organizationCode: string, fiscalYear: number, includeChildren?: boolean) => Promise<HeadcountReport>;
    calculateHeadcountByClassification: (organizationCode: string, fiscalYear: number) => Promise<any[]>;
    calculateVacancyRate: (organizationCode: string) => Promise<number>;
    compareHeadcountYearOverYear: (organizationCode: string, fiscalYear1: number, fiscalYear2: number) => Promise<any>;
    exportHeadcountData: (organizationCode: string, fiscalYear: number, format: string) => Promise<Buffer>;
    calculateFTE: (scheduledHours: number, standardHours?: number) => number;
    calculateTotalFTE: (organizationCode: string, fiscalYear: number) => Promise<number>;
    analyzePositionCost: (positionId: number, fiscalYear: number) => Promise<PositionCostAnalysis>;
    calculateOrganizationSalaryBudget: (organizationCode: string, fiscalYear: number) => Promise<number>;
    buildOrganizationalHierarchy: (rootOrganizationCode: string, includePositions?: boolean) => Promise<OrganizationalHierarchy>;
};
export default _default;
//# sourceMappingURL=position-control-workforce-kit.d.ts.map