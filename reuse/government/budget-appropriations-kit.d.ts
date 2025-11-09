/**
 * LOC: GOV-BDG-APR-001
 * File: /reuse/government/budget-appropriations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (v6.x)
 *   - @nestjs/common (v10.x)
 *   - @nestjs/swagger (v7.x)
 *   - class-validator (v0.14.x)
 *
 * DOWNSTREAM (imported by):
 *   - Budget management services
 *   - Appropriations controllers
 *   - Financial reporting modules
 *   - Fiscal year processing
 */
/**
 * File: /reuse/government/budget-appropriations-kit.ts
 * Locator: WC-GOV-BDG-APR-001
 * Purpose: Budget Appropriations Management Kit - Comprehensive budget and appropriations management for government operations
 *
 * Upstream: sequelize v6.x, @nestjs/common, @nestjs/swagger, class-validator
 * Downstream: Government budget services, appropriations controllers, fiscal reporting, financial management
 * Dependencies: Sequelize v6.x, NestJS v10.x, Node 18+, TypeScript 5.x
 * Exports: 50+ functions for budget creation, appropriations, transfers, tracking, forecasting, and compliance
 *
 * LLM Context: Enterprise-grade budget and appropriations management for government entities.
 * Provides utilities for budget lifecycle management, appropriations control, fiscal year operations,
 * budget amendments, transfers, variance analysis, fund accounting, and comprehensive financial reporting.
 * Compliant with governmental accounting standards (GASB, FASAB) and federal/state budget regulations.
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Budget status enumeration
 */
export declare enum BudgetStatus {
    DRAFT = "DRAFT",
    PROPOSED = "PROPOSED",
    APPROVED = "APPROVED",
    ACTIVE = "ACTIVE",
    AMENDED = "AMENDED",
    CLOSED = "CLOSED",
    ARCHIVED = "ARCHIVED"
}
/**
 * Appropriation type enumeration
 */
export declare enum AppropriationType {
    ANNUAL = "ANNUAL",
    MULTI_YEAR = "MULTI_YEAR",
    NO_YEAR = "NO_YEAR",
    CONTINUING = "CONTINUING",
    SUPPLEMENTAL = "SUPPLEMENTAL"
}
/**
 * Budget category enumeration
 */
export declare enum BudgetCategory {
    PERSONNEL = "PERSONNEL",
    OPERATIONS = "OPERATIONS",
    CAPITAL = "CAPITAL",
    DEBT_SERVICE = "DEBT_SERVICE",
    GRANTS = "GRANTS",
    TRANSFERS = "TRANSFERS",
    CONTINGENCY = "CONTINGENCY"
}
/**
 * Fund type enumeration
 */
export declare enum FundType {
    GENERAL = "GENERAL",
    SPECIAL_REVENUE = "SPECIAL_REVENUE",
    CAPITAL_PROJECTS = "CAPITAL_PROJECTS",
    DEBT_SERVICE = "DEBT_SERVICE",
    ENTERPRISE = "ENTERPRISE",
    INTERNAL_SERVICE = "INTERNAL_SERVICE",
    TRUST = "TRUST",
    AGENCY = "AGENCY"
}
/**
 * Budget transfer status
 */
export declare enum TransferStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
/**
 * Budget interface
 */
export interface IBudget {
    id: string;
    fiscalYear: number;
    departmentId: string;
    fundType: FundType;
    status: BudgetStatus;
    totalAmount: number;
    encumberedAmount: number;
    expendedAmount: number;
    availableAmount: number;
    effectiveDate: Date;
    expirationDate: Date;
    createdBy: string;
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Appropriation interface
 */
export interface IAppropriation {
    id: string;
    budgetId: string;
    appropriationType: AppropriationType;
    category: BudgetCategory;
    accountCode: string;
    description: string;
    authorizedAmount: number;
    revisedAmount: number;
    encumberedAmount: number;
    expendedAmount: number;
    availableAmount: number;
    carryoverAmount?: number;
    effectiveDate: Date;
    expirationDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget line item interface
 */
export interface IBudgetLineItem {
    id: string;
    appropriationId: string;
    lineNumber: string;
    description: string;
    accountCode: string;
    budgetedAmount: number;
    encumberedAmount: number;
    expendedAmount: number;
    availableAmount: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget transfer interface
 */
export interface IBudgetTransfer {
    id: string;
    fiscalYear: number;
    fromAppropriationId: string;
    toAppropriationId: string;
    amount: number;
    reason: string;
    status: TransferStatus;
    requestedBy: string;
    approvedBy?: string;
    requestedAt: Date;
    approvedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget amendment interface
 */
export interface IBudgetAmendment {
    id: string;
    budgetId: string;
    amendmentNumber: number;
    description: string;
    totalChange: number;
    effectiveDate: Date;
    approvedBy: string;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Fiscal year configuration
 */
export interface IFiscalYear {
    id: string;
    fiscalYear: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isClosed: boolean;
    closedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Budget variance analysis
 */
export interface IBudgetVariance {
    appropriationId: string;
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
    isFavorable: boolean;
    period: string;
}
/**
 * Budget forecast data
 */
export interface IBudgetForecast {
    appropriationId: string;
    forecastMonth: number;
    projectedExpenditure: number;
    actualExpenditure: number;
    variance: number;
    burnRate: number;
    projectedYearEnd: number;
}
/**
 * Creates a comprehensive budget for a fiscal year.
 * Initializes budget structure with fund accounting principles.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year for budget
 * @param {string} departmentId - Department identifier
 * @param {FundType} fundType - Type of fund
 * @param {number} totalAmount - Total budget amount
 * @param {Date} effectiveDate - Budget effective date
 * @param {Date} expirationDate - Budget expiration date
 * @param {string} createdBy - User creating budget
 * @returns {Promise<IBudget>} Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudget(sequelize, 2024, 'dept-001',
 *   FundType.GENERAL, 5000000, new Date('2024-01-01'),
 *   new Date('2024-12-31'), 'user-123');
 * ```
 */
export declare function createBudget(sequelize: Sequelize, fiscalYear: number, departmentId: string, fundType: FundType, totalAmount: number, effectiveDate: Date, expirationDate: Date, createdBy: string): Promise<IBudget>;
/**
 * Creates an appropriation within a budget.
 * Establishes authorized spending authority.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Parent budget ID
 * @param {AppropriationType} appropriationType - Type of appropriation
 * @param {BudgetCategory} category - Budget category
 * @param {string} accountCode - Account code
 * @param {string} description - Appropriation description
 * @param {number} authorizedAmount - Authorized amount
 * @param {Date} effectiveDate - Effective date
 * @param {Date} expirationDate - Expiration date
 * @returns {Promise<IAppropriation>} Created appropriation
 *
 * @example
 * ```typescript
 * const appropriation = await createAppropriation(sequelize, 'bdg-2024-001',
 *   AppropriationType.ANNUAL, BudgetCategory.PERSONNEL, '5100',
 *   'Salaries and Wages', 3000000, new Date('2024-01-01'),
 *   new Date('2024-12-31'));
 * ```
 */
export declare function createAppropriation(sequelize: Sequelize, budgetId: string, appropriationType: AppropriationType, category: BudgetCategory, accountCode: string, description: string, authorizedAmount: number, effectiveDate: Date, expirationDate?: Date): Promise<IAppropriation>;
/**
 * Creates a budget line item within an appropriation.
 * Provides detailed spending breakdown.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Parent appropriation ID
 * @param {string} lineNumber - Line item number
 * @param {string} description - Line item description
 * @param {string} accountCode - Account code
 * @param {number} budgetedAmount - Budgeted amount
 * @param {string} notes - Optional notes
 * @returns {Promise<IBudgetLineItem>} Created line item
 *
 * @example
 * ```typescript
 * const lineItem = await createBudgetLineItem(sequelize, 'apr-001',
 *   '5100.001', 'Regular Salaries', '5101', 2500000,
 *   'Includes COLA increase');
 * ```
 */
export declare function createBudgetLineItem(sequelize: Sequelize, appropriationId: string, lineNumber: string, description: string, accountCode: string, budgetedAmount: number, notes?: string): Promise<IBudgetLineItem>;
/**
 * Approves a budget and activates it.
 * Transitions budget from draft/proposed to approved status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID to approve
 * @param {string} approvedBy - User approving budget
 * @returns {Promise<IBudget>} Approved budget
 *
 * @example
 * ```typescript
 * const approvedBudget = await approveBudget(sequelize, 'bdg-2024-001',
 *   'admin-user-123');
 * ```
 */
export declare function approveBudget(sequelize: Sequelize, budgetId: string, approvedBy: string): Promise<IBudget>;
/**
 * Activates an approved budget for the fiscal year.
 * Makes budget operational for spending.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID to activate
 * @returns {Promise<IBudget>} Activated budget
 *
 * @example
 * ```typescript
 * const activeBudget = await activateBudget(sequelize, 'bdg-2024-001');
 * ```
 */
export declare function activateBudget(sequelize: Sequelize, budgetId: string): Promise<IBudget>;
/**
 * Encumbers funds against an appropriation.
 * Reserves funds for future expenditure (purchase orders, contracts).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} amount - Amount to encumber
 * @param {string} reference - Encumbrance reference (PO, contract number)
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IAppropriation>} Updated appropriation
 *
 * @example
 * ```typescript
 * const updated = await encumberFunds(sequelize, 'apr-001', 50000,
 *   'PO-2024-0001', transaction);
 * ```
 */
export declare function encumberFunds(sequelize: Sequelize, appropriationId: string, amount: number, reference: string, transaction?: Transaction): Promise<IAppropriation>;
/**
 * Records an expenditure against an encumbrance.
 * Converts encumbered funds to actual expenditures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} amount - Expenditure amount
 * @param {number} encumbranceAmount - Amount to release from encumbrance
 * @param {string} reference - Expenditure reference
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IAppropriation>} Updated appropriation
 *
 * @example
 * ```typescript
 * const updated = await recordExpenditure(sequelize, 'apr-001',
 *   50000, 50000, 'INV-2024-0001', transaction);
 * ```
 */
export declare function recordExpenditure(sequelize: Sequelize, appropriationId: string, amount: number, encumbranceAmount: number, reference: string, transaction?: Transaction): Promise<IAppropriation>;
/**
 * Releases an encumbrance without expenditure.
 * Returns encumbered funds to available balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} amount - Amount to release
 * @param {string} reason - Release reason
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<IAppropriation>} Updated appropriation
 *
 * @example
 * ```typescript
 * const updated = await releaseEncumbrance(sequelize, 'apr-001',
 *   50000, 'Purchase order cancelled', transaction);
 * ```
 */
export declare function releaseEncumbrance(sequelize: Sequelize, appropriationId: string, amount: number, reason: string, transaction?: Transaction): Promise<IAppropriation>;
/**
 * Calculates available balance for an appropriation.
 * Returns unencumbered and unexpended funds.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @returns {Promise<number>} Available balance
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableBalance(sequelize, 'apr-001');
 * console.log(`Available: $${available}`);
 * ```
 */
export declare function calculateAvailableBalance(sequelize: Sequelize, appropriationId: string): Promise<number>;
/**
 * Validates appropriation spending authority.
 * Checks if appropriation can support requested amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} requestedAmount - Requested spending amount
 * @returns {Promise<boolean>} Whether spending is authorized
 *
 * @example
 * ```typescript
 * const isAuthorized = await validateSpendingAuthority(sequelize,
 *   'apr-001', 100000);
 * ```
 */
export declare function validateSpendingAuthority(sequelize: Sequelize, appropriationId: string, requestedAmount: number): Promise<boolean>;
/**
 * Creates a budget amendment.
 * Modifies budget amounts after approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID to amend
 * @param {string} description - Amendment description
 * @param {number} totalChange - Total budget change
 * @param {Date} effectiveDate - Amendment effective date
 * @param {string} approvedBy - User approving amendment
 * @returns {Promise<IBudgetAmendment>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createBudgetAmendment(sequelize, 'bdg-2024-001',
 *   'Supplemental appropriation for emergency services', 500000,
 *   new Date(), 'admin-123');
 * ```
 */
export declare function createBudgetAmendment(sequelize: Sequelize, budgetId: string, description: string, totalChange: number, effectiveDate: Date, approvedBy: string): Promise<IBudgetAmendment>;
/**
 * Creates a budget transfer between appropriations.
 * Moves funds from one appropriation to another.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {string} fromAppropriationId - Source appropriation
 * @param {string} toAppropriationId - Destination appropriation
 * @param {number} amount - Transfer amount
 * @param {string} reason - Transfer reason
 * @param {string} requestedBy - User requesting transfer
 * @returns {Promise<IBudgetTransfer>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createBudgetTransfer(sequelize, 2024,
 *   'apr-001', 'apr-002', 25000, 'Realignment for new initiative',
 *   'user-123');
 * ```
 */
export declare function createBudgetTransfer(sequelize: Sequelize, fiscalYear: number, fromAppropriationId: string, toAppropriationId: string, amount: number, reason: string, requestedBy: string): Promise<IBudgetTransfer>;
/**
 * Approves and executes a budget transfer.
 * Moves funds between appropriations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} approvedBy - User approving transfer
 * @returns {Promise<IBudgetTransfer>} Approved transfer
 *
 * @example
 * ```typescript
 * const approved = await approveBudgetTransfer(sequelize, 'tfr-001',
 *   'admin-123');
 * ```
 */
export declare function approveBudgetTransfer(sequelize: Sequelize, transferId: string, approvedBy: string): Promise<IBudgetTransfer>;
/**
 * Rejects a budget transfer request.
 * Denies transfer and records reason.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} transferId - Transfer ID
 * @param {string} rejectedBy - User rejecting transfer
 * @param {string} reason - Rejection reason
 * @returns {Promise<IBudgetTransfer>} Rejected transfer
 *
 * @example
 * ```typescript
 * const rejected = await rejectBudgetTransfer(sequelize, 'tfr-001',
 *   'admin-123', 'Insufficient justification');
 * ```
 */
export declare function rejectBudgetTransfer(sequelize: Sequelize, transferId: string, rejectedBy: string, reason: string): Promise<IBudgetTransfer>;
/**
 * Carries over unexpended appropriations to next fiscal year.
 * Transfers unspent balances forward.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} targetFiscalYear - Target fiscal year
 * @param {string} authorizedBy - User authorizing carryover
 * @returns {Promise<IAppropriation>} New appropriation in target year
 *
 * @example
 * ```typescript
 * const carriedOver = await carryoverAppropriation(sequelize,
 *   'apr-001', 2025, 'admin-123');
 * ```
 */
export declare function carryoverAppropriation(sequelize: Sequelize, appropriationId: string, targetFiscalYear: number, authorizedBy: string): Promise<IAppropriation>;
/**
 * Tracks multi-year appropriations across fiscal years.
 * Monitors no-year and multi-year appropriation balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code to track
 * @param {number} startYear - Starting fiscal year
 * @param {number} endYear - Ending fiscal year
 * @returns {Promise<IAppropriation[]>} Multi-year appropriations
 *
 * @example
 * ```typescript
 * const multiYear = await trackMultiYearAppropriations(sequelize,
 *   '7000', 2022, 2024);
 * ```
 */
export declare function trackMultiYearAppropriations(sequelize: Sequelize, accountCode: string, startYear: number, endYear: number): Promise<IAppropriation[]>;
/**
 * Calculates lapsed appropriations for fiscal year end.
 * Identifies unexpended annual appropriations to be returned.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<IAppropriation[]>} Lapsed appropriations
 *
 * @example
 * ```typescript
 * const lapsed = await calculateLapsedAppropriations(sequelize, 2024);
 * console.log(`Total lapsed: $${lapsed.reduce((sum, a) => sum + a.availableAmount, 0)}`);
 * ```
 */
export declare function calculateLapsedAppropriations(sequelize: Sequelize, fiscalYear: number): Promise<IAppropriation[]>;
/**
 * Generates budget vs actual comparison report.
 * Compares budgeted amounts to actual expenditures.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @param {Date} asOfDate - Report as-of date
 * @returns {Promise<IBudgetVariance[]>} Variance analysis
 *
 * @example
 * ```typescript
 * const report = await generateBudgetVsActualReport(sequelize,
 *   'bdg-2024-001', new Date());
 * ```
 */
export declare function generateBudgetVsActualReport(sequelize: Sequelize, budgetId: string, asOfDate: Date): Promise<IBudgetVariance[]>;
/**
 * Calculates spending pace for appropriations.
 * Analyzes rate of expenditure against time elapsed.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {Date} asOfDate - Calculation date
 * @returns {Promise<number>} Spending pace percentage
 *
 * @example
 * ```typescript
 * const pace = await calculateSpendingPace(sequelize, 'apr-001',
 *   new Date());
 * console.log(`Spending at ${pace}% pace`);
 * ```
 */
export declare function calculateSpendingPace(sequelize: Sequelize, appropriationId: string, asOfDate: Date): Promise<number>;
/**
 * Generates expenditure trend analysis.
 * Analyzes spending patterns over time.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {number} months - Number of months to analyze
 * @returns {Promise<any[]>} Monthly expenditure trends
 *
 * @example
 * ```typescript
 * const trends = await generateExpenditureTrends(sequelize, 'apr-001', 12);
 * ```
 */
export declare function generateExpenditureTrends(sequelize: Sequelize, appropriationId: string, months: number): Promise<any[]>;
/**
 * Projects year-end budget position.
 * Forecasts final expenditure based on current pace.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} appropriationId - Appropriation ID
 * @param {Date} projectionDate - Date for projection
 * @returns {Promise<IBudgetForecast>} Forecast data
 *
 * @example
 * ```typescript
 * const forecast = await projectYearEndPosition(sequelize, 'apr-001',
 *   new Date());
 * console.log(`Projected year-end: $${forecast.projectedYearEnd}`);
 * ```
 */
export declare function projectYearEndPosition(sequelize: Sequelize, appropriationId: string, projectionDate: Date): Promise<IBudgetForecast>;
/**
 * Generates monthly budget forecast.
 * Projects expenditures for remaining fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @returns {Promise<IBudgetForecast[]>} Monthly forecasts
 *
 * @example
 * ```typescript
 * const forecasts = await generateMonthlyForecast(sequelize, 'bdg-2024-001');
 * ```
 */
export declare function generateMonthlyForecast(sequelize: Sequelize, budgetId: string): Promise<IBudgetForecast[]>;
/**
 * Identifies budget variances requiring attention.
 * Flags significant deviations from budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @param {number} thresholdPercent - Variance threshold percentage
 * @returns {Promise<IBudgetVariance[]>} Significant variances
 *
 * @example
 * ```typescript
 * const alerts = await identifyBudgetVariances(sequelize,
 *   'bdg-2024-001', 10);
 * ```
 */
export declare function identifyBudgetVariances(sequelize: Sequelize, budgetId: string, thresholdPercent: number): Promise<IBudgetVariance[]>;
/**
 * Creates a new fiscal year configuration.
 * Establishes fiscal year parameters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year number
 * @param {Date} startDate - Fiscal year start date
 * @param {Date} endDate - Fiscal year end date
 * @returns {Promise<IFiscalYear>} Created fiscal year
 *
 * @example
 * ```typescript
 * const fy = await createFiscalYear(sequelize, 2024,
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare function createFiscalYear(sequelize: Sequelize, fiscalYear: number, startDate: Date, endDate: Date): Promise<IFiscalYear>;
/**
 * Activates a fiscal year for operations.
 * Sets fiscal year as current operating year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to activate
 * @returns {Promise<IFiscalYear>} Activated fiscal year
 *
 * @example
 * ```typescript
 * const active = await activateFiscalYear(sequelize, 2024);
 * ```
 */
export declare function activateFiscalYear(sequelize: Sequelize, fiscalYear: number): Promise<IFiscalYear>;
/**
 * Closes a fiscal year.
 * Finalizes fiscal year and prevents further modifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @returns {Promise<IFiscalYear>} Closed fiscal year
 *
 * @example
 * ```typescript
 * const closed = await closeFiscalYear(sequelize, 2023);
 * ```
 */
export declare function closeFiscalYear(sequelize: Sequelize, fiscalYear: number): Promise<IFiscalYear>;
/**
 * Gets the currently active fiscal year.
 * Returns operational fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<IFiscalYear | null>} Active fiscal year
 *
 * @example
 * ```typescript
 * const currentFY = await getActiveFiscalYear(sequelize);
 * ```
 */
export declare function getActiveFiscalYear(sequelize: Sequelize): Promise<IFiscalYear | null>;
/**
 * Performs comprehensive variance analysis.
 * Analyzes budget variances across categories.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @param {BudgetCategory} category - Budget category
 * @returns {Promise<IBudgetVariance[]>} Category variances
 *
 * @example
 * ```typescript
 * const analysis = await performVarianceAnalysis(sequelize,
 *   'bdg-2024-001', BudgetCategory.PERSONNEL);
 * ```
 */
export declare function performVarianceAnalysis(sequelize: Sequelize, budgetId: string, category?: BudgetCategory): Promise<IBudgetVariance[]>;
/**
 * Calculates budget utilization rate.
 * Measures percentage of budget used.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} budgetId - Budget ID
 * @returns {Promise<number>} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = await calculateBudgetUtilization(sequelize,
 *   'bdg-2024-001');
 * console.log(`Budget ${utilization}% utilized`);
 * ```
 */
export declare function calculateBudgetUtilization(sequelize: Sequelize, budgetId: string): Promise<number>;
/**
 * Calculates fund balance for a fund type.
 * Computes total available fund balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FundType} fundType - Type of fund
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Fund balance
 *
 * @example
 * ```typescript
 * const balance = await calculateFundBalance(sequelize,
 *   FundType.GENERAL, 2024);
 * ```
 */
export declare function calculateFundBalance(sequelize: Sequelize, fundType: FundType, fiscalYear: number): Promise<number>;
/**
 * Tracks fund balance changes over time.
 * Monitors fund balance trends.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {FundType} fundType - Type of fund
 * @param {number} startYear - Start fiscal year
 * @param {number} endYear - End fiscal year
 * @returns {Promise<any[]>} Fund balance history
 *
 * @example
 * ```typescript
 * const history = await trackFundBalanceChanges(sequelize,
 *   FundType.GENERAL, 2020, 2024);
 * ```
 */
export declare function trackFundBalanceChanges(sequelize: Sequelize, fundType: FundType, startYear: number, endYear: number): Promise<any[]>;
/**
 * Validates budget date range.
 *
 * @param {Date} effectiveDate - Effective date
 * @param {Date} expirationDate - Expiration date
 * @returns {boolean} Whether dates are valid
 */
export declare function validateBudgetDates(effectiveDate: Date, expirationDate: Date): boolean;
/**
 * Formats currency for budget display.
 *
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted currency
 */
export declare function formatBudgetAmount(amount: number, locale?: string): string;
declare const _default: {
    createBudget: typeof createBudget;
    createAppropriation: typeof createAppropriation;
    createBudgetLineItem: typeof createBudgetLineItem;
    approveBudget: typeof approveBudget;
    activateBudget: typeof activateBudget;
    encumberFunds: typeof encumberFunds;
    recordExpenditure: typeof recordExpenditure;
    releaseEncumbrance: typeof releaseEncumbrance;
    calculateAvailableBalance: typeof calculateAvailableBalance;
    validateSpendingAuthority: typeof validateSpendingAuthority;
    createBudgetAmendment: typeof createBudgetAmendment;
    createBudgetTransfer: typeof createBudgetTransfer;
    approveBudgetTransfer: typeof approveBudgetTransfer;
    rejectBudgetTransfer: typeof rejectBudgetTransfer;
    carryoverAppropriation: typeof carryoverAppropriation;
    trackMultiYearAppropriations: typeof trackMultiYearAppropriations;
    calculateLapsedAppropriations: typeof calculateLapsedAppropriations;
    generateBudgetVsActualReport: typeof generateBudgetVsActualReport;
    calculateSpendingPace: typeof calculateSpendingPace;
    generateExpenditureTrends: typeof generateExpenditureTrends;
    projectYearEndPosition: typeof projectYearEndPosition;
    generateMonthlyForecast: typeof generateMonthlyForecast;
    identifyBudgetVariances: typeof identifyBudgetVariances;
    createFiscalYear: typeof createFiscalYear;
    activateFiscalYear: typeof activateFiscalYear;
    closeFiscalYear: typeof closeFiscalYear;
    getActiveFiscalYear: typeof getActiveFiscalYear;
    performVarianceAnalysis: typeof performVarianceAnalysis;
    calculateBudgetUtilization: typeof calculateBudgetUtilization;
    calculateFundBalance: typeof calculateFundBalance;
    trackFundBalanceChanges: typeof trackFundBalanceChanges;
};
export default _default;
//# sourceMappingURL=budget-appropriations-kit.d.ts.map