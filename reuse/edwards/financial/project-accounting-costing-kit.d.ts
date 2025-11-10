/**
 * LOC: PRJACCT001
 * File: /reuse/edwards/financial/project-accounting-costing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend project management modules
 *   - Project costing services
 *   - Project billing modules
 *   - Earned value management
 *   - Project analytics and forecasting
 */
/**
 * File: /reuse/edwards/financial/project-accounting-costing-kit.ts
 * Locator: WC-EDW-PRJACCT-001
 * Purpose: Comprehensive Project Accounting & Costing - JD Edwards EnterpriseOne-level project management, costing, billing, earned value
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/projects/*, Project Costing Services, Project Billing, Earned Value Management, Project Analytics
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for project setup, budgets, costing, WBS, earned value, billing, commitments, forecasting, analytics
 *
 * LLM Context: Enterprise-grade project accounting competing with Oracle JD Edwards EnterpriseOne.
 * Provides comprehensive project lifecycle management, work breakdown structure (WBS), project budgeting,
 * cost collection, commitment tracking, earned value management (EVM), project billing, revenue recognition,
 * project forecasting, cost-to-complete analysis, project analytics, resource allocation, and multi-project reporting.
 */
import { Sequelize, Transaction } from 'sequelize';
interface ProjectHeader {
    projectId: number;
    projectNumber: string;
    projectName: string;
    projectType: 'capital' | 'operating' | 'research' | 'construction' | 'maintenance';
    projectManager: string;
    customerCode?: string;
    contractNumber?: string;
    startDate: Date;
    plannedEndDate: Date;
    actualEndDate?: Date;
    status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled' | 'closed';
    fiscalYear: number;
    organizationUnit: string;
    costCenter: string;
    fundingSource: string;
    totalBudget: number;
    totalActualCost: number;
    totalCommitments: number;
    totalBilled: number;
    totalRevenue: number;
}
interface WorkBreakdownStructure {
    wbsId: number;
    projectId: number;
    wbsCode: string;
    wbsName: string;
    wbsLevel: number;
    parentWbsId?: number;
    description: string;
    responsiblePerson: string;
    plannedStartDate: Date;
    plannedEndDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    budgetAmount: number;
    actualCost: number;
    commitments: number;
    percentComplete: number;
    isBillable: boolean;
    isActive: boolean;
}
interface ProjectCommitment {
    commitmentId: number;
    projectId: number;
    wbsId?: number;
    commitmentType: 'purchase-order' | 'contract' | 'requisition' | 'encumbrance';
    commitmentNumber: string;
    commitmentDate: Date;
    vendorCode: string;
    vendorName: string;
    description: string;
    originalAmount: number;
    committedAmount: number;
    receivedAmount: number;
    invoicedAmount: number;
    paidAmount: number;
    remainingAmount: number;
    status: 'open' | 'partial' | 'received' | 'closed' | 'cancelled';
    expirationDate?: Date;
}
interface EarnedValueMetrics {
    projectId: number;
    wbsId?: number;
    measurementDate: Date;
    fiscalYear: number;
    fiscalPeriod: number;
    plannedValue: number;
    earnedValue: number;
    actualCost: number;
    budgetAtCompletion: number;
    estimateAtCompletion: number;
    estimateToComplete: number;
    varianceAtCompletion: number;
    costVariance: number;
    scheduleVariance: number;
    costPerformanceIndex: number;
    schedulePerformanceIndex: number;
    toCompletePerformanceIndex: number;
    percentComplete: number;
    percentScheduleComplete: number;
}
interface ProjectForecast {
    forecastId: number;
    projectId: number;
    wbsId?: number;
    forecastDate: Date;
    forecastPeriod: number;
    forecastYear: number;
    costCategory: string;
    originalBudget: number;
    actualToDate: number;
    commitmentsToDate: number;
    forecastToComplete: number;
    estimateAtCompletion: number;
    varianceAtCompletion: number;
    confidenceLevel: number;
    forecastMethod: 'trend' | 'manual' | 'bottom-up' | 'parametric';
    assumptions: string;
    risks: string;
    forecastBy: string;
}
interface ProjectAnalytics {
    projectId: number;
    analysisDate: Date;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
    totalActualCost: number;
    totalCommitments: number;
    totalVariance: number;
    averageCostVariance: number;
    averageScheduleVariance: number;
    averageCPI: number;
    averageSPI: number;
    onBudgetCount: number;
    overBudgetCount: number;
    underBudgetCount: number;
    onScheduleCount: number;
    behindScheduleCount: number;
    aheadScheduleCount: number;
}
interface CostToComplete {
    projectId: number;
    wbsId?: number;
    analysisDate: Date;
    costCategory: string;
    budgetAmount: number;
    actualToDate: number;
    commitmentsToDate: number;
    estimateToComplete: number;
    estimateAtCompletion: number;
    varianceAtCompletion: number;
    percentComplete: number;
    completionMethod: 'earned-value' | 'budget-percentage' | 'manual' | 'trend-analysis';
    riskAdjustment: number;
    contingency: number;
    managementReserve: number;
}
interface ProjectChangeOrder {
    changeOrderId: number;
    projectId: number;
    changeOrderNumber: string;
    changeOrderDate: Date;
    changeType: 'scope' | 'budget' | 'schedule' | 'contract';
    description: string;
    justification: string;
    requestedBy: string;
    budgetImpact: number;
    scheduleImpact: number;
    status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'implemented';
    approvedBy?: string;
    approvedDate?: Date;
    implementedDate?: Date;
}
export declare class CreateProjectDto {
    projectNumber: string;
    projectName: string;
    projectType: string;
    projectManager: string;
    customerCode?: string;
    contractNumber?: string;
    startDate: Date;
    plannedEndDate: Date;
    organizationUnit: string;
    costCenter: string;
    fundingSource: string;
    totalBudget: number;
}
export declare class CreateWBSDto {
    projectId: number;
    wbsCode: string;
    wbsName: string;
    wbsLevel: number;
    parentWbsId?: number;
    description: string;
    responsiblePerson: string;
    budgetAmount: number;
    isBillable?: boolean;
}
export declare class CreateProjectBudgetDto {
    projectId: number;
    wbsId?: number;
    fiscalYear: number;
    fiscalPeriod: number;
    budgetType: string;
    accountCode: string;
    costCategory: string;
    budgetAmount: number;
}
export declare class RecordProjectCostDto {
    projectId: number;
    wbsId?: number;
    costDate: Date;
    transactionType: string;
    accountCode: string;
    costCategory: string;
    quantity: number;
    unitOfMeasure: string;
    unitCost: number;
    description: string;
    isBillable?: boolean;
}
export declare class CreateBillingScheduleDto {
    projectId: number;
    billingType: string;
    scheduledDate: Date;
    scheduledAmount: number;
    retainagePercent?: number;
}
export declare class EarnedValueCalculationDto {
    projectId: number;
    wbsId?: number;
    measurementDate: Date;
    calculationMethod: string;
}
/**
 * Sequelize model for Project Header with comprehensive project tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ProjectHeader model
 *
 * @example
 * ```typescript
 * const Project = createProjectHeaderModel(sequelize);
 * const project = await Project.create({
 *   projectNumber: 'PRJ-2024-001',
 *   projectName: 'Building Construction',
 *   projectType: 'capital',
 *   projectManager: 'john.doe',
 *   status: 'planning'
 * });
 * ```
 */
export declare const createProjectHeaderModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectNumber: string;
        projectName: string;
        projectType: string;
        projectManager: string;
        customerCode: string | null;
        contractNumber: string | null;
        startDate: Date;
        plannedEndDate: Date;
        actualEndDate: Date | null;
        status: string;
        fiscalYear: number;
        organizationUnit: string;
        costCenter: string;
        fundingSource: string;
        totalBudget: number;
        totalActualCost: number;
        totalCommitments: number;
        totalBilled: number;
        totalRevenue: number;
        metadata: Record<string, any>;
        createdBy: string;
        updatedBy: string;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Work Breakdown Structure (WBS) with hierarchical support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} WorkBreakdownStructure model
 *
 * @example
 * ```typescript
 * const WBS = createWorkBreakdownStructureModel(sequelize);
 * const wbs = await WBS.create({
 *   projectId: 1,
 *   wbsCode: '1.2.3',
 *   wbsName: 'Site Preparation',
 *   wbsLevel: 3,
 *   budgetAmount: 100000
 * });
 * ```
 */
export declare const createWorkBreakdownStructureModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        projectId: number;
        wbsCode: string;
        wbsName: string;
        wbsLevel: number;
        parentWbsId: number | null;
        description: string;
        responsiblePerson: string;
        plannedStartDate: Date;
        plannedEndDate: Date;
        actualStartDate: Date | null;
        actualEndDate: Date | null;
        budgetAmount: number;
        actualCost: number;
        commitments: number;
        percentComplete: number;
        isBillable: boolean;
        isActive: boolean;
    };
};
/**
 * Creates a new project with comprehensive setup.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateProjectDto} projectData - Project data
 * @param {string} userId - User creating the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectHeader>} Created project
 *
 * @example
 * ```typescript
 * const project = await createProject(sequelize, {
 *   projectNumber: 'PRJ-2024-001',
 *   projectName: 'Building Construction Phase 1',
 *   projectType: 'capital',
 *   projectManager: 'john.doe',
 *   startDate: new Date('2024-01-01'),
 *   plannedEndDate: new Date('2024-12-31'),
 *   organizationUnit: 'ORG-100',
 *   costCenter: 'CC-200',
 *   fundingSource: 'FND-300',
 *   totalBudget: 1000000
 * }, 'admin');
 * ```
 */
export declare const createProject: (sequelize: Sequelize, projectData: CreateProjectDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates project header information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Partial<ProjectHeader>} updates - Fields to update
 * @param {string} userId - User updating the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateProject(sequelize, 1, {
 *   projectManager: 'jane.smith',
 *   status: 'active'
 * }, 'admin');
 * ```
 */
export declare const updateProject: (sequelize: Sequelize, projectId: number, updates: Partial<ProjectHeader>, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves project details with aggregated financial information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectHeader>} Project details
 *
 * @example
 * ```typescript
 * const project = await getProjectDetails(sequelize, 1);
 * console.log(`Budget: ${project.totalBudget}, Actual: ${project.totalActualCost}`);
 * ```
 */
export declare const getProjectDetails: (sequelize: Sequelize, projectId: number) => Promise<any>;
/**
 * Closes a project and performs final cost reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {string} userId - User closing the project
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await closeProject(sequelize, 1, 'manager');
 * ```
 */
export declare const closeProject: (sequelize: Sequelize, projectId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Creates a WBS element in the project hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateWBSDto} wbsData - WBS data
 * @param {string} userId - User creating the WBS
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WorkBreakdownStructure>} Created WBS element
 *
 * @example
 * ```typescript
 * const wbs = await createWBSElement(sequelize, {
 *   projectId: 1,
 *   wbsCode: '1.2.3',
 *   wbsName: 'Site Preparation',
 *   wbsLevel: 3,
 *   description: 'Prepare construction site',
 *   responsiblePerson: 'john.doe',
 *   budgetAmount: 100000
 * }, 'admin');
 * ```
 */
export declare const createWBSElement: (sequelize: Sequelize, wbsData: CreateWBSDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves WBS hierarchy for a project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<WorkBreakdownStructure[]>} WBS hierarchy
 *
 * @example
 * ```typescript
 * const wbsHierarchy = await getWBSHierarchy(sequelize, 1);
 * wbsHierarchy.forEach(wbs => console.log(`${wbs.wbsCode}: ${wbs.wbsName}`));
 * ```
 */
export declare const getWBSHierarchy: (sequelize: Sequelize, projectId: number) => Promise<any[]>;
/**
 * Updates WBS element details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} wbsId - WBS ID
 * @param {Partial<WorkBreakdownStructure>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateWBSElement(sequelize, 1, {
 *   percentComplete: 75,
 *   actualCost: 75000
 * });
 * ```
 */
export declare const updateWBSElement: (sequelize: Sequelize, wbsId: number, updates: Partial<WorkBreakdownStructure>, transaction?: Transaction) => Promise<void>;
/**
 * Calculates rollup budget and costs for WBS hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalBudget: number; totalCost: number; totalCommitments: number }>} Rollup totals
 *
 * @example
 * ```typescript
 * const rollup = await calculateWBSRollup(sequelize, 1);
 * console.log(`Total Budget: ${rollup.totalBudget}`);
 * ```
 */
export declare const calculateWBSRollup: (sequelize: Sequelize, projectId: number) => Promise<{
    totalBudget: number;
    totalCost: number;
    totalCommitments: number;
}>;
/**
 * Creates project budget allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateProjectBudgetDto} budgetData - Budget data
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectBudget>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createProjectBudget(sequelize, {
 *   projectId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   budgetType: 'original',
 *   accountCode: '6100',
 *   costCategory: 'Labor',
 *   budgetAmount: 500000
 * }, 'admin');
 * ```
 */
export declare const createProjectBudget: (sequelize: Sequelize, budgetData: CreateProjectBudgetDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates project budget amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {number} budgetAmount - New budget amount
 * @param {string} userId - User updating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateProjectBudget(sequelize, 1, 550000, 'manager');
 * ```
 */
export declare const updateProjectBudget: (sequelize: Sequelize, budgetId: number, budgetAmount: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves project budget vs actual comparison.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<ProjectBudget[]>} Budget comparison
 *
 * @example
 * ```typescript
 * const budgetVsActual = await getProjectBudgetVsActual(sequelize, 1, 2024, 1);
 * budgetVsActual.forEach(b => console.log(`${b.costCategory}: ${b.varianceAmount}`));
 * ```
 */
export declare const getProjectBudgetVsActual: (sequelize: Sequelize, projectId: number, fiscalYear: number, fiscalPeriod: number) => Promise<any[]>;
/**
 * Calculates budget variance at project or WBS level.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {number} [wbsId] - Optional WBS ID
 * @returns {Promise<{ budgetAmount: number; actualAmount: number; variance: number; variancePercent: number }>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await calculateBudgetVariance(sequelize, 1);
 * console.log(`Variance: ${variance.variancePercent}%`);
 * ```
 */
export declare const calculateBudgetVariance: (sequelize: Sequelize, projectId: number, wbsId?: number) => Promise<{
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
}>;
/**
 * Records project cost transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RecordProjectCostDto} costData - Cost data
 * @param {string} userId - User recording the cost
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectCostDetail>} Recorded cost
 *
 * @example
 * ```typescript
 * const cost = await recordProjectCost(sequelize, {
 *   projectId: 1,
 *   wbsId: 5,
 *   costDate: new Date(),
 *   transactionType: 'labor',
 *   accountCode: '6100',
 *   costCategory: 'Labor',
 *   quantity: 40,
 *   unitOfMeasure: 'hours',
 *   unitCost: 75,
 *   description: 'Engineering hours'
 * }, 'admin');
 * ```
 */
export declare const recordProjectCost: (sequelize: Sequelize, costData: RecordProjectCostDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves project costs by category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<{ category: string; totalCost: number }[]>} Costs by category
 *
 * @example
 * ```typescript
 * const costs = await getProjectCostsByCategory(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * costs.forEach(c => console.log(`${c.category}: ${c.totalCost}`));
 * ```
 */
export declare const getProjectCostsByCategory: (sequelize: Sequelize, projectId: number, startDate: Date, endDate: Date) => Promise<{
    category: string;
    totalCost: number;
}[]>;
/**
 * Retrieves project costs by WBS element.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ wbsCode: string; wbsName: string; totalCost: number }[]>} Costs by WBS
 *
 * @example
 * ```typescript
 * const wbsCosts = await getProjectCostsByWBS(sequelize, 1);
 * wbsCosts.forEach(w => console.log(`${w.wbsCode}: ${w.totalCost}`));
 * ```
 */
export declare const getProjectCostsByWBS: (sequelize: Sequelize, projectId: number) => Promise<{
    wbsCode: string;
    wbsName: string;
    totalCost: number;
}[]>;
/**
 * Creates project commitment (PO, contract, etc.).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectCommitment>} commitmentData - Commitment data
 * @param {string} userId - User creating the commitment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectCommitment>} Created commitment
 *
 * @example
 * ```typescript
 * const commitment = await createProjectCommitment(sequelize, {
 *   projectId: 1,
 *   commitmentType: 'purchase-order',
 *   commitmentNumber: 'PO-2024-001',
 *   commitmentDate: new Date(),
 *   vendorCode: 'VEND-100',
 *   vendorName: 'ABC Suppliers',
 *   description: 'Construction materials',
 *   originalAmount: 50000
 * }, 'admin');
 * ```
 */
export declare const createProjectCommitment: (sequelize: Sequelize, commitmentData: Partial<ProjectCommitment>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Updates commitment status and amounts (receiving, invoicing, payment).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {Partial<ProjectCommitment>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateCommitmentStatus(sequelize, 1, {
 *   receivedAmount: 25000,
 *   status: 'partial'
 * });
 * ```
 */
export declare const updateCommitmentStatus: (sequelize: Sequelize, commitmentId: number, updates: Partial<ProjectCommitment>, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves open commitments for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectCommitment[]>} Open commitments
 *
 * @example
 * ```typescript
 * const openCommitments = await getOpenCommitments(sequelize, 1);
 * console.log(`Open commitments: ${openCommitments.length}`);
 * ```
 */
export declare const getOpenCommitments: (sequelize: Sequelize, projectId: number) => Promise<any[]>;
/**
 * Calculates total committed amounts by project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalCommitted: number; totalReceived: number; totalRemaining: number }>} Commitment totals
 *
 * @example
 * ```typescript
 * const commitmentTotals = await calculateCommitmentTotals(sequelize, 1);
 * console.log(`Total Committed: ${commitmentTotals.totalCommitted}`);
 * ```
 */
export declare const calculateCommitmentTotals: (sequelize: Sequelize, projectId: number) => Promise<{
    totalCommitted: number;
    totalReceived: number;
    totalRemaining: number;
}>;
/**
 * Calculates earned value metrics for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EarnedValueCalculationDto} evmData - EVM calculation data
 * @returns {Promise<EarnedValueMetrics>} EVM metrics
 *
 * @example
 * ```typescript
 * const evm = await calculateEarnedValue(sequelize, {
 *   projectId: 1,
 *   measurementDate: new Date(),
 *   calculationMethod: 'percent-complete'
 * });
 * console.log(`CPI: ${evm.costPerformanceIndex}, SPI: ${evm.schedulePerformanceIndex}`);
 * ```
 */
export declare const calculateEarnedValue: (sequelize: Sequelize, evmData: EarnedValueCalculationDto) => Promise<EarnedValueMetrics>;
/**
 * Stores earned value metrics snapshot.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {EarnedValueMetrics} evmMetrics - EVM metrics
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await storeEarnedValueMetrics(sequelize, evmMetrics);
 * ```
 */
export declare const storeEarnedValueMetrics: (sequelize: Sequelize, evmMetrics: EarnedValueMetrics, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves earned value trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<EarnedValueMetrics[]>} EVM trend data
 *
 * @example
 * ```typescript
 * const evmTrend = await getEarnedValueTrend(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * evmTrend.forEach(e => console.log(`${e.measurementDate}: CPI=${e.costPerformanceIndex}`));
 * ```
 */
export declare const getEarnedValueTrend: (sequelize: Sequelize, projectId: number, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Calculates cost performance index (CPI) for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} CPI value
 *
 * @example
 * ```typescript
 * const cpi = await calculateCPI(sequelize, 1);
 * console.log(`CPI: ${cpi} - ${cpi >= 1 ? 'Under budget' : 'Over budget'}`);
 * ```
 */
export declare const calculateCPI: (sequelize: Sequelize, projectId: number) => Promise<number>;
/**
 * Calculates schedule performance index (SPI) for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} SPI value
 *
 * @example
 * ```typescript
 * const spi = await calculateSPI(sequelize, 1);
 * console.log(`SPI: ${spi} - ${spi >= 1 ? 'Ahead of schedule' : 'Behind schedule'}`);
 * ```
 */
export declare const calculateSPI: (sequelize: Sequelize, projectId: number) => Promise<number>;
/**
 * Creates project billing schedule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBillingScheduleDto} billingData - Billing schedule data
 * @param {string} userId - User creating the schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectBillingSchedule>} Created billing schedule
 *
 * @example
 * ```typescript
 * const billing = await createBillingSchedule(sequelize, {
 *   projectId: 1,
 *   billingType: 'milestone',
 *   scheduledDate: new Date('2024-06-30'),
 *   scheduledAmount: 250000,
 *   retainagePercent: 10
 * }, 'admin');
 * ```
 */
export declare const createBillingSchedule: (sequelize: Sequelize, billingData: CreateBillingScheduleDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Processes project billing and creates invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} scheduleId - Billing schedule ID
 * @param {number} billingAmount - Amount to bill
 * @param {string} userId - User processing the billing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await processBilling(sequelize, 1, 225000, 'admin');
 * ```
 */
export declare const processBilling: (sequelize: Sequelize, scheduleId: number, billingAmount: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves unbilled project costs.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ totalUnbilled: number; costs: ProjectCostDetail[] }>} Unbilled costs
 *
 * @example
 * ```typescript
 * const unbilled = await getUnbilledCosts(sequelize, 1);
 * console.log(`Unbilled amount: ${unbilled.totalUnbilled}`);
 * ```
 */
export declare const getUnbilledCosts: (sequelize: Sequelize, projectId: number) => Promise<{
    totalUnbilled: number;
    costs: any[];
}>;
/**
 * Calculates billing completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Billing completion percent
 *
 * @example
 * ```typescript
 * const billingPercent = await calculateBillingCompletion(sequelize, 1);
 * console.log(`Billing ${billingPercent}% complete`);
 * ```
 */
export declare const calculateBillingCompletion: (sequelize: Sequelize, projectId: number) => Promise<number>;
/**
 * Calculates and records revenue recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {Date} recognitionDate - Recognition date
 * @param {string} recognitionMethod - Recognition method
 * @param {string} userId - User recording revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectRevenueRecognition>} Revenue recognition record
 *
 * @example
 * ```typescript
 * const revenue = await calculateRevenueRecognition(sequelize, 1, new Date(), 'percentage-completion', 'admin');
 * console.log(`Current period revenue: ${revenue.currentPeriodRevenue}`);
 * ```
 */
export declare const calculateRevenueRecognition: (sequelize: Sequelize, projectId: number, recognitionDate: Date, recognitionMethod: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves revenue recognition history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectRevenueRecognition[]>} Revenue history
 *
 * @example
 * ```typescript
 * const revenueHistory = await getRevenueRecognitionHistory(sequelize, 1);
 * revenueHistory.forEach(r => console.log(`${r.recognitionDate}: ${r.currentPeriodRevenue}`));
 * ```
 */
export declare const getRevenueRecognitionHistory: (sequelize: Sequelize, projectId: number) => Promise<any[]>;
/**
 * Creates project cost forecast.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectForecast>} forecastData - Forecast data
 * @param {string} userId - User creating forecast
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectForecast>} Created forecast
 *
 * @example
 * ```typescript
 * const forecast = await createProjectForecast(sequelize, {
 *   projectId: 1,
 *   forecastDate: new Date(),
 *   costCategory: 'Labor',
 *   originalBudget: 500000,
 *   actualToDate: 300000,
 *   forecastToComplete: 250000,
 *   forecastMethod: 'trend'
 * }, 'manager');
 * ```
 */
export declare const createProjectForecast: (sequelize: Sequelize, forecastData: Partial<ProjectForecast>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Calculates estimate at completion (EAC) using EVM.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Estimate at completion
 *
 * @example
 * ```typescript
 * const eac = await calculateEstimateAtCompletion(sequelize, 1);
 * console.log(`Estimate at Completion: ${eac}`);
 * ```
 */
export declare const calculateEstimateAtCompletion: (sequelize: Sequelize, projectId: number) => Promise<number>;
/**
 * Calculates estimate to complete (ETC).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<number>} Estimate to complete
 *
 * @example
 * ```typescript
 * const etc = await calculateEstimateToComplete(sequelize, 1);
 * console.log(`Estimate to Complete: ${etc}`);
 * ```
 */
export declare const calculateEstimateToComplete: (sequelize: Sequelize, projectId: number) => Promise<number>;
/**
 * Generates project forecast report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectForecast[]>} Forecast report
 *
 * @example
 * ```typescript
 * const forecastReport = await generateForecastReport(sequelize, 1);
 * forecastReport.forEach(f => console.log(`${f.costCategory}: EAC ${f.estimateAtCompletion}`));
 * ```
 */
export declare const generateForecastReport: (sequelize: Sequelize, projectId: number) => Promise<any[]>;
/**
 * Generates comprehensive project analytics dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectAnalytics>} Analytics dashboard data
 *
 * @example
 * ```typescript
 * const analytics = await generateProjectAnalytics(sequelize, 1);
 * console.log(`Average CPI: ${analytics.averageCPI}`);
 * ```
 */
export declare const generateProjectAnalytics: (sequelize: Sequelize, projectId: number) => Promise<ProjectAnalytics>;
/**
 * Calculates project profitability metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ revenue: number; cost: number; profit: number; margin: number }>} Profitability metrics
 *
 * @example
 * ```typescript
 * const profitability = await calculateProjectProfitability(sequelize, 1);
 * console.log(`Profit Margin: ${profitability.margin}%`);
 * ```
 */
export declare const calculateProjectProfitability: (sequelize: Sequelize, projectId: number) => Promise<{
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
}>;
/**
 * Generates project performance scorecard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<{ budgetScore: string; scheduleScore: string; qualityScore: string; overallScore: string }>} Performance scorecard
 *
 * @example
 * ```typescript
 * const scorecard = await generateProjectScorecard(sequelize, 1);
 * console.log(`Overall Score: ${scorecard.overallScore}`);
 * ```
 */
export declare const generateProjectScorecard: (sequelize: Sequelize, projectId: number) => Promise<{
    budgetScore: string;
    scheduleScore: string;
    qualityScore: string;
    overallScore: string;
}>;
/**
 * Calculates detailed cost-to-complete analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @param {string} costCategory - Cost category
 * @returns {Promise<CostToComplete>} Cost-to-complete analysis
 *
 * @example
 * ```typescript
 * const ctc = await calculateCostToComplete(sequelize, 1, 'Labor');
 * console.log(`Estimate to Complete: ${ctc.estimateToComplete}`);
 * ```
 */
export declare const calculateCostToComplete: (sequelize: Sequelize, projectId: number, costCategory: string) => Promise<CostToComplete>;
/**
 * Generates cost-to-complete report for all categories.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<CostToComplete[]>} Cost-to-complete report
 *
 * @example
 * ```typescript
 * const ctcReport = await generateCostToCompleteReport(sequelize, 1);
 * ctcReport.forEach(c => console.log(`${c.costCategory}: ${c.estimateToComplete}`));
 * ```
 */
export declare const generateCostToCompleteReport: (sequelize: Sequelize, projectId: number) => Promise<CostToComplete[]>;
/**
 * Creates project change order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<ProjectChangeOrder>} changeOrderData - Change order data
 * @param {string} userId - User creating change order
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ProjectChangeOrder>} Created change order
 *
 * @example
 * ```typescript
 * const changeOrder = await createChangeOrder(sequelize, {
 *   projectId: 1,
 *   changeOrderNumber: 'CO-001',
 *   changeType: 'scope',
 *   description: 'Additional site work',
 *   budgetImpact: 50000,
 *   scheduleImpact: 30
 * }, 'manager');
 * ```
 */
export declare const createChangeOrder: (sequelize: Sequelize, changeOrderData: Partial<ProjectChangeOrder>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves and implements project change order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} changeOrderId - Change order ID
 * @param {string} userId - User approving change order
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveChangeOrder(sequelize, 1, 'director');
 * ```
 */
export declare const approveChangeOrder: (sequelize: Sequelize, changeOrderId: number, userId: string, transaction?: Transaction) => Promise<void>;
/**
 * Retrieves change orders for project.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} projectId - Project ID
 * @returns {Promise<ProjectChangeOrder[]>} Change orders
 *
 * @example
 * ```typescript
 * const changeOrders = await getProjectChangeOrders(sequelize, 1);
 * console.log(`Total change orders: ${changeOrders.length}`);
 * ```
 */
export declare const getProjectChangeOrders: (sequelize: Sequelize, projectId: number) => Promise<any[]>;
export {};
//# sourceMappingURL=project-accounting-costing-kit.d.ts.map