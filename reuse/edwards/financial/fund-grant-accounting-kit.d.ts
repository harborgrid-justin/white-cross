/**
 * LOC: FUNDGRNT001
 * File: /reuse/edwards/financial/fund-grant-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../financial/general-ledger-operations-kit (GL operations)
 *   - ../financial/budget-management-kit (Budget operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Grant management services
 *   - Fund accounting processes
 *   - Grant billing and reporting modules
 */
/**
 * File: /reuse/edwards/financial/fund-grant-accounting-kit.ts
 * Locator: WC-JDE-FUNDGRNT-001
 * Purpose: Comprehensive Fund & Grant Accounting - JD Edwards EnterpriseOne-level fund structures, fund balances, grant management, grant budgets, compliance
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit, budget-management-kit
 * Downstream: ../backend/financial/*, Grant Services, Fund Accounting, Grant Billing, Compliance Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for fund structures, fund balances, fund restrictions, grant management, grant budgets, grant reporting, fund compliance, cost sharing, indirect costs, grant billing
 *
 * LLM Context: Enterprise-grade fund and grant accounting operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive fund structure management, fund balance tracking, fund restriction enforcement,
 * grant lifecycle management, grant budget control, grant reporting, fund compliance validation,
 * cost sharing allocation, indirect cost calculation, grant billing, advance management, award tracking,
 * federal compliance (2 CFR 200), audit trails, grant closeout, and multi-fund consolidation.
 */
import { Sequelize, Transaction } from 'sequelize';
export declare class CreateFundDto {
    fundCode: string;
    fundName: string;
    fundType: string;
    fundCategory: string;
    organizationId: number;
    restrictionLevel: string;
    isGrantFund?: boolean;
}
export declare class CreateGrantAwardDto {
    grantNumber: string;
    grantName: string;
    fundId: number;
    grantorId: number;
    grantType: string;
    awardAmount: number;
    startDate: Date;
    endDate: Date;
    indirectCostRate?: number;
    costSharingRequired?: boolean;
}
export declare class GrantExpenditureDto {
    grantId: number;
    transactionDate: Date;
    accountCode: string;
    amount: number;
    costType: string;
    description: string;
}
export declare class GrantBillingDto {
    grantId: number;
    billingPeriodStart: Date;
    billingPeriodEnd: Date;
    directCosts: number;
    indirectCosts: number;
}
/**
 * Sequelize model for Fund Structure with hierarchical relationships.
 *
 * Associations:
 * - hasMany: FundBalance, FundRestriction, GrantAward, FundTransfer (as source/destination)
 * - belongsTo: FundStructure (parent fund for hierarchical structure)
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FundStructure model
 *
 * @example
 * ```typescript
 * const Fund = createFundStructureModel(sequelize);
 * const fund = await Fund.findOne({
 *   where: { fundCode: 'FUND-001' },
 *   include: [
 *     { model: FundBalance, as: 'balances' },
 *     { model: FundRestriction, as: 'restrictions' },
 *     { model: GrantAward, as: 'grants' }
 *   ]
 * });
 * ```
 */
export declare const createFundStructureModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        fundCode: string;
        fundName: string;
        fundType: string;
        fundCategory: string;
        parentFundId: number | null;
        organizationId: number;
        status: string;
        fiscalYearEnd: Date;
        restrictionLevel: string;
        isGrantFund: boolean;
        requiresCompliance: boolean;
        complianceFramework: string | null;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Grant Awards with comprehensive tracking.
 *
 * Associations:
 * - belongsTo: FundStructure
 * - hasMany: GrantBudget, GrantExpenditure, GrantBilling, GrantAdvance, GrantReport, CostSharingCommitment
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantAward model
 */
export declare const createGrantAwardModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        grantNumber: string;
        grantName: string;
        fundId: number;
        grantorId: number;
        grantorName: string;
        grantType: string;
        federalAwardNumber: string | null;
        cfdaNumber: string | null;
        awardAmount: number;
        awardDate: Date;
        startDate: Date;
        endDate: Date;
        status: string;
        principalInvestigator: string | null;
        programManager: string;
        indirectCostRate: number;
        costSharingRequired: boolean;
        costSharingAmount: number;
        complianceRequirements: string[];
        totalExpended: number;
        totalBilled: number;
        remainingBalance: number;
        metadata: Record<string, any>;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Sequelize model for Grant Budgets with version control.
 *
 * Associations:
 * - belongsTo: GrantAward
 * - hasMany: GrantBudgetLine
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} GrantBudget model
 */
export declare const createGrantBudgetModel: (sequelize: Sequelize) => {
    new (): {
        id: number;
        grantId: number;
        budgetVersion: number;
        budgetType: string;
        fiscalYear: number;
        totalBudget: number;
        directCostsBudget: number;
        indirectCostsBudget: number;
        costSharingBudget: number;
        status: string;
        approvedDate: Date | null;
        approvedBy: string | null;
        notes: string | null;
        readonly createdAt: Date;
        readonly updatedAt: Date;
    };
};
/**
 * Creates a new fund structure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateFundDto} fundData - Fund data
 * @param {string} userId - User creating the fund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created fund
 *
 * @example
 * ```typescript
 * const fund = await createFund(sequelize, {
 *   fundCode: 'FUND-001',
 *   fundName: 'General Fund',
 *   fundType: 'general',
 *   fundCategory: 'governmental',
 *   organizationId: 1,
 *   restrictionLevel: 'unrestricted'
 * }, 'user123');
 * ```
 */
export declare const createFund: (sequelize: Sequelize, fundData: CreateFundDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves fund structure with balances and restrictions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any>} Fund with balances and restrictions
 *
 * @example
 * ```typescript
 * const fund = await getFundWithDetails(sequelize, 1, 2024);
 * console.log(fund.balances, fund.restrictions);
 * ```
 */
export declare const getFundWithDetails: (sequelize: Sequelize, fundId: number, fiscalYear?: number) => Promise<any>;
/**
 * Updates fund balance for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} accountId - Account ID
 * @param {number} debitAmount - Debit amount
 * @param {number} creditAmount - Credit amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated balance
 *
 * @example
 * ```typescript
 * await updateFundBalance(sequelize, 1, 2024, 1, 1000, 1000, 0);
 * ```
 */
export declare const updateFundBalance: (sequelize: Sequelize, fundId: number, fiscalYear: number, fiscalPeriod: number, accountId: number, debitAmount: number, creditAmount: number, transaction?: Transaction) => Promise<any>;
/**
 * Adds a restriction to a fund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} restrictionType - Restriction type
 * @param {string} restrictionCategory - Restriction category
 * @param {string} description - Description
 * @param {Date} effectiveDate - Effective date
 * @param {Date} [expirationDate] - Optional expiration date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created restriction
 *
 * @example
 * ```typescript
 * await addFundRestriction(sequelize, 1, 'donor', 'purpose',
 *   'Restricted for scholarship use', new Date());
 * ```
 */
export declare const addFundRestriction: (sequelize: Sequelize, fundId: number, restrictionType: string, restrictionCategory: string, description: string, effectiveDate: Date, expirationDate?: Date, transaction?: Transaction) => Promise<any>;
/**
 * Validates fund balance availability before transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} amount - Amount to check
 * @returns {Promise<{ available: boolean; balance: number; message?: string }>} Availability result
 *
 * @example
 * ```typescript
 * const check = await validateFundAvailability(sequelize, 1, 2024, 5000);
 * if (!check.available) {
 *   throw new Error(check.message);
 * }
 * ```
 */
export declare const validateFundAvailability: (sequelize: Sequelize, fundId: number, fiscalYear: number, amount: number) => Promise<{
    available: boolean;
    balance: number;
    message?: string;
}>;
/**
 * Calculates fund balance by type (unrestricted, restricted, etc.).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<Record<string, number>>} Balance breakdown
 *
 * @example
 * ```typescript
 * const balances = await calculateFundBalancesByType(sequelize, 1, 2024);
 * console.log(balances.unrestricted, balances.restricted);
 * ```
 */
export declare const calculateFundBalancesByType: (sequelize: Sequelize, fundId: number, fiscalYear: number) => Promise<Record<string, number>>;
/**
 * Creates a new grant award.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateGrantAwardDto} grantData - Grant award data
 * @param {string} userId - User creating the grant
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created grant award
 *
 * @example
 * ```typescript
 * const grant = await createGrantAward(sequelize, {
 *   grantNumber: 'GR-2024-001',
 *   grantName: 'Research Grant',
 *   fundId: 1,
 *   grantorId: 100,
 *   grantType: 'federal',
 *   awardAmount: 500000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2025-12-31')
 * }, 'user123');
 * ```
 */
export declare const createGrantAward: (sequelize: Sequelize, grantData: CreateGrantAwardDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves grant award with budget, expenditures, and billing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any>} Grant with comprehensive details
 *
 * @example
 * ```typescript
 * const grant = await getGrantWithDetails(sequelize, 1);
 * console.log(grant.budget, grant.expenditures, grant.billing);
 * ```
 */
export declare const getGrantWithDetails: (sequelize: Sequelize, grantId: number) => Promise<any>;
/**
 * Updates grant award status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} newStatus - New status
 * @param {string} userId - User performing the update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated grant
 *
 * @example
 * ```typescript
 * await updateGrantStatus(sequelize, 1, 'active', 'user123');
 * ```
 */
export declare const updateGrantStatus: (sequelize: Sequelize, grantId: number, newStatus: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Validates grant award dates and amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateGrantAward(sequelize, 1);
 * if (!validation.valid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
export declare const validateGrantAward: (sequelize: Sequelize, grantId: number) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Creates a grant budget with lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} fiscalYear - Fiscal year
 * @param {Array<{ categoryCode: string; accountCode: string; budgetAmount: number; costType: string }>} budgetLines - Budget lines
 * @param {string} userId - User creating the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created budget with lines
 *
 * @example
 * ```typescript
 * const budget = await createGrantBudget(sequelize, 1, 2024, [
 *   { categoryCode: 'SALARY', accountCode: '6000', budgetAmount: 100000, costType: 'direct' },
 *   { categoryCode: 'SUPPLIES', accountCode: '6500', budgetAmount: 25000, costType: 'direct' }
 * ], 'user123');
 * ```
 */
export declare const createGrantBudget: (sequelize: Sequelize, grantId: number, fiscalYear: number, budgetLines: Array<{
    categoryCode: string;
    accountCode: string;
    budgetAmount: number;
    costType: string;
}>, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves a grant budget.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetId - Budget ID
 * @param {string} userId - User approving the budget
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved budget
 *
 * @example
 * ```typescript
 * await approveGrantBudget(sequelize, 1, 'user123');
 * ```
 */
export declare const approveGrantBudget: (sequelize: Sequelize, budgetId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves grant budget with variance analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any>} Budget with variance details
 *
 * @example
 * ```typescript
 * const analysis = await getGrantBudgetVariance(sequelize, 1, 2024);
 * console.log(analysis.variancePercent);
 * ```
 */
export declare const getGrantBudgetVariance: (sequelize: Sequelize, grantId: number, fiscalYear?: number) => Promise<any>;
/**
 * Checks budget availability for grant expenditure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} accountCode - Account code
 * @param {number} amount - Amount to check
 * @returns {Promise<{ available: boolean; budgetAmount: number; availableAmount: number; message?: string }>} Availability result
 *
 * @example
 * ```typescript
 * const check = await checkGrantBudgetAvailability(sequelize, 1, '6000', 5000);
 * if (!check.available) {
 *   throw new Error(check.message);
 * }
 * ```
 */
export declare const checkGrantBudgetAvailability: (sequelize: Sequelize, grantId: number, accountCode: string, amount: number) => Promise<{
    available: boolean;
    budgetAmount: number;
    availableAmount: number;
    message?: string;
}>;
/**
 * Records a grant expenditure with compliance checking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GrantExpenditureDto} expenditureData - Expenditure data
 * @param {string} userId - User recording the expenditure
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created expenditure
 *
 * @example
 * ```typescript
 * const expenditure = await recordGrantExpenditure(sequelize, {
 *   grantId: 1,
 *   transactionDate: new Date(),
 *   accountCode: '6000',
 *   amount: 5000,
 *   costType: 'direct',
 *   description: 'Laboratory supplies'
 * }, 'user123');
 * ```
 */
export declare const recordGrantExpenditure: (sequelize: Sequelize, expenditureData: GrantExpenditureDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves grant expenditures with filters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @param {string} [costType] - Optional cost type filter
 * @returns {Promise<any[]>} Grant expenditures
 *
 * @example
 * ```typescript
 * const expenditures = await getGrantExpenditures(sequelize, 1,
 *   new Date('2024-01-01'), new Date('2024-12-31'), 'direct');
 * ```
 */
export declare const getGrantExpenditures: (sequelize: Sequelize, grantId: number, startDate?: Date, endDate?: Date, costType?: string) => Promise<any[]>;
/**
 * Performs compliance check for grant expenditure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} amount - Expenditure amount
 * @param {string} costType - Cost type
 * @returns {Promise<{ allowable: boolean; allocable: boolean; reasonable: boolean }>} Compliance result
 *
 * @example
 * ```typescript
 * const compliance = await performComplianceCheck(sequelize, 1, 5000, 'direct');
 * ```
 */
export declare const performComplianceCheck: (sequelize: Sequelize, grantId: number, amount: number, costType: string) => Promise<{
    allowable: boolean;
    allocable: boolean;
    reasonable: boolean;
}>;
/**
 * Records cost sharing commitment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} commitmentType - Commitment type
 * @param {string} source - Source
 * @param {number} cashAmount - Cash commitment amount
 * @param {number} inKindAmount - In-kind commitment amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created commitment
 *
 * @example
 * ```typescript
 * await recordCostSharingCommitment(sequelize, 1, 'mandatory', 'institution', 25000, 10000);
 * ```
 */
export declare const recordCostSharingCommitment: (sequelize: Sequelize, grantId: number, commitmentType: string, source: string, cashAmount: number, inKindAmount: number, transaction?: Transaction) => Promise<any>;
/**
 * Updates cost sharing met amount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} commitmentId - Commitment ID
 * @param {number} metAmount - Amount met
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated commitment
 *
 * @example
 * ```typescript
 * await updateCostSharingMet(sequelize, 1, 5000);
 * ```
 */
export declare const updateCostSharingMet: (sequelize: Sequelize, commitmentId: number, metAmount: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves cost sharing status for grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any>} Cost sharing status
 *
 * @example
 * ```typescript
 * const status = await getCostSharingStatus(sequelize, 1);
 * console.log(status.percentMet);
 * ```
 */
export declare const getCostSharingStatus: (sequelize: Sequelize, grantId: number) => Promise<any>;
/**
 * Calculates and allocates indirect costs for grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} baseAmount - Base amount for calculation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Indirect cost allocation
 *
 * @example
 * ```typescript
 * const allocation = await calculateIndirectCosts(sequelize, 1, 2024, 1, 50000);
 * console.log(allocation.indirectAmount);
 * ```
 */
export declare const calculateIndirectCosts: (sequelize: Sequelize, grantId: number, fiscalYear: number, fiscalPeriod: number, baseAmount: number, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves indirect cost allocations for grant.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any[]>} Indirect cost allocations
 *
 * @example
 * ```typescript
 * const allocations = await getIndirectCostAllocations(sequelize, 1, 2024);
 * ```
 */
export declare const getIndirectCostAllocations: (sequelize: Sequelize, grantId: number, fiscalYear?: number) => Promise<any[]>;
/**
 * Generates grant billing invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {GrantBillingDto} billingData - Billing data
 * @param {string} userId - User generating the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created billing invoice
 *
 * @example
 * ```typescript
 * const invoice = await generateGrantInvoice(sequelize, {
 *   grantId: 1,
 *   billingPeriodStart: new Date('2024-01-01'),
 *   billingPeriodEnd: new Date('2024-03-31'),
 *   directCosts: 45000,
 *   indirectCosts: 9000
 * }, 'user123');
 * ```
 */
export declare const generateGrantInvoice: (sequelize: Sequelize, billingData: GrantBillingDto, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Submits grant billing invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} billingId - Billing ID
 * @param {string} userId - User submitting the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Submitted billing
 *
 * @example
 * ```typescript
 * await submitGrantInvoice(sequelize, 1, 'user123');
 * ```
 */
export declare const submitGrantInvoice: (sequelize: Sequelize, billingId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Records grant billing payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} billingId - Billing ID
 * @param {number} paymentAmount - Payment amount
 * @param {Date} paymentDate - Payment date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated billing
 *
 * @example
 * ```typescript
 * await recordGrantPayment(sequelize, 1, 54000, new Date());
 * ```
 */
export declare const recordGrantPayment: (sequelize: Sequelize, billingId: number, paymentAmount: number, paymentDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves grant billing history.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any[]>} Billing history
 *
 * @example
 * ```typescript
 * const history = await getGrantBillingHistory(sequelize, 1);
 * ```
 */
export declare const getGrantBillingHistory: (sequelize: Sequelize, grantId: number) => Promise<any[]>;
/**
 * Creates grant report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} reportType - Report type
 * @param {Date} periodStart - Reporting period start
 * @param {Date} periodEnd - Reporting period end
 * @param {Date} dueDate - Due date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created report
 *
 * @example
 * ```typescript
 * const report = await createGrantReport(sequelize, 1, 'financial',
 *   new Date('2024-01-01'), new Date('2024-03-31'), new Date('2024-04-15'));
 * ```
 */
export declare const createGrantReport: (sequelize: Sequelize, grantId: number, reportType: string, periodStart: Date, periodEnd: Date, dueDate: Date, transaction?: Transaction) => Promise<any>;
/**
 * Submits grant report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reportId - Report ID
 * @param {string} userId - User submitting the report
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Submitted report
 *
 * @example
 * ```typescript
 * await submitGrantReport(sequelize, 1, 'user123');
 * ```
 */
export declare const submitGrantReport: (sequelize: Sequelize, reportId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves grant reports with late status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<any[]>} Grant reports
 *
 * @example
 * ```typescript
 * const reports = await getGrantReports(sequelize, 1);
 * console.log(reports.filter(r => r.status === 'late'));
 * ```
 */
export declare const getGrantReports: (sequelize: Sequelize, grantId: number) => Promise<any[]>;
/**
 * Creates interfund transfer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} sourceFundId - Source fund ID
 * @param {number} destinationFundId - Destination fund ID
 * @param {number} amount - Transfer amount
 * @param {string} transferType - Transfer type
 * @param {string} reason - Transfer reason
 * @param {string} userId - User creating the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createFundTransfer(sequelize, 1, 2, 10000,
 *   'operating', 'Budget reallocation', 'user123');
 * ```
 */
export declare const createFundTransfer: (sequelize: Sequelize, sourceFundId: number, destinationFundId: number, amount: number, transferType: string, reason: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Approves fund transfer and posts transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferId - Transfer ID
 * @param {string} userId - User approving the transfer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved transfer
 *
 * @example
 * ```typescript
 * await approveFundTransfer(sequelize, 1, 'user123');
 * ```
 */
export declare const approveFundTransfer: (sequelize: Sequelize, transferId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Performs compliance validation check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {string} checkType - Check type
 * @param {string} complianceArea - Compliance area
 * @param {string} userId - User performing the check
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Compliance check result
 *
 * @example
 * ```typescript
 * const check = await performGrantComplianceCheck(sequelize, 1,
 *   'post_award', 'allowable_costs', 'user123');
 * ```
 */
export declare const performGrantComplianceCheck: (sequelize: Sequelize, grantId: number, checkType: string, complianceArea: string, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Generates fund accounting audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await generateFundAuditTrail(sequelize, 1,
 *   new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
export declare const generateFundAuditTrail: (sequelize: Sequelize, fundId: number, startDate: Date, endDate: Date) => Promise<any[]>;
/**
 * Validates grant closeout requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<{ canClose: boolean; issues: string[]; checklist: any[] }>} Closeout validation
 *
 * @example
 * ```typescript
 * const validation = await validateGrantCloseout(sequelize, 1);
 * if (!validation.canClose) {
 *   console.log('Issues:', validation.issues);
 * }
 * ```
 */
export declare const validateGrantCloseout: (sequelize: Sequelize, grantId: number) => Promise<{
    canClose: boolean;
    issues: string[];
    checklist: any[];
}>;
/**
 * Retrieves fund transfer history with filtering.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [fundId] - Optional fund ID filter
 * @param {Date} [startDate] - Optional start date filter
 * @param {Date} [endDate] - Optional end date filter
 * @returns {Promise<any[]>} Fund transfers
 *
 * @example
 * ```typescript
 * const transfers = await getFundTransferHistory(sequelize, 1, new Date('2024-01-01'));
 * ```
 */
export declare const getFundTransferHistory: (sequelize: Sequelize, fundId?: number, startDate?: Date, endDate?: Date) => Promise<any[]>;
/**
 * Updates grant budget line.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} budgetLineId - Budget line ID
 * @param {number} newBudgetAmount - New budget amount
 * @param {string} userId - User updating the line
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated budget line
 *
 * @example
 * ```typescript
 * await updateGrantBudgetLine(sequelize, 1, 150000, 'user123');
 * ```
 */
export declare const updateGrantBudgetLine: (sequelize: Sequelize, budgetLineId: number, newBudgetAmount: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves grant expenditure summary by category.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {number} [fiscalYear] - Optional fiscal year filter
 * @returns {Promise<any[]>} Expenditure summary
 *
 * @example
 * ```typescript
 * const summary = await getGrantExpenditureSummary(sequelize, 1, 2024);
 * ```
 */
export declare const getGrantExpenditureSummary: (sequelize: Sequelize, grantId: number, fiscalYear?: number) => Promise<any[]>;
/**
 * Validates cost sharing commitment requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @returns {Promise<{ valid: boolean; message?: string; details: any }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateCostSharingCommitment(sequelize, 1);
 * ```
 */
export declare const validateCostSharingCommitment: (sequelize: Sequelize, grantId: number) => Promise<{
    valid: boolean;
    message?: string;
    details: any;
}>;
/**
 * Generates grant financial statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} grantId - Grant ID
 * @param {Date} asOfDate - Statement date
 * @returns {Promise<any>} Financial statement
 *
 * @example
 * ```typescript
 * const statement = await generateGrantFinancialStatement(sequelize, 1, new Date());
 * ```
 */
export declare const generateGrantFinancialStatement: (sequelize: Sequelize, grantId: number, asOfDate: Date) => Promise<any>;
/**
 * Closes a fund permanently.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} userId - User closing the fund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed fund
 *
 * @example
 * ```typescript
 * await closeFund(sequelize, 1, 'user123');
 * ```
 */
export declare const closeFund: (sequelize: Sequelize, fundId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Activates a fund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} userId - User activating the fund
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated fund
 *
 * @example
 * ```typescript
 * await activateFund(sequelize, 1, 'user123');
 * ```
 */
export declare const activateFund: (sequelize: Sequelize, fundId: number, userId: string, transaction?: Transaction) => Promise<any>;
/**
 * Retrieves grants by fund.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fundId - Fund ID
 * @param {string} [status] - Optional status filter
 * @returns {Promise<any[]>} Grants
 *
 * @example
 * ```typescript
 * const grants = await getGrantsByFund(sequelize, 1, 'active');
 * ```
 */
export declare const getGrantsByFund: (sequelize: Sequelize, fundId: number, status?: string) => Promise<any[]>;
declare const _default: {
    createFundStructureModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            fundCode: string;
            fundName: string;
            fundType: string;
            fundCategory: string;
            parentFundId: number | null;
            organizationId: number;
            status: string;
            fiscalYearEnd: Date;
            restrictionLevel: string;
            isGrantFund: boolean;
            requiresCompliance: boolean;
            complianceFramework: string | null;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createGrantAwardModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            grantNumber: string;
            grantName: string;
            fundId: number;
            grantorId: number;
            grantorName: string;
            grantType: string;
            federalAwardNumber: string | null;
            cfdaNumber: string | null;
            awardAmount: number;
            awardDate: Date;
            startDate: Date;
            endDate: Date;
            status: string;
            principalInvestigator: string | null;
            programManager: string;
            indirectCostRate: number;
            costSharingRequired: boolean;
            costSharingAmount: number;
            complianceRequirements: string[];
            totalExpended: number;
            totalBilled: number;
            remainingBalance: number;
            metadata: Record<string, any>;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createGrantBudgetModel: (sequelize: Sequelize) => {
        new (): {
            id: number;
            grantId: number;
            budgetVersion: number;
            budgetType: string;
            fiscalYear: number;
            totalBudget: number;
            directCostsBudget: number;
            indirectCostsBudget: number;
            costSharingBudget: number;
            status: string;
            approvedDate: Date | null;
            approvedBy: string | null;
            notes: string | null;
            readonly createdAt: Date;
            readonly updatedAt: Date;
        };
    };
    createFund: (sequelize: Sequelize, fundData: CreateFundDto, userId: string, transaction?: Transaction) => Promise<any>;
    getFundWithDetails: (sequelize: Sequelize, fundId: number, fiscalYear?: number) => Promise<any>;
    updateFundBalance: (sequelize: Sequelize, fundId: number, fiscalYear: number, fiscalPeriod: number, accountId: number, debitAmount: number, creditAmount: number, transaction?: Transaction) => Promise<any>;
    addFundRestriction: (sequelize: Sequelize, fundId: number, restrictionType: string, restrictionCategory: string, description: string, effectiveDate: Date, expirationDate?: Date, transaction?: Transaction) => Promise<any>;
    validateFundAvailability: (sequelize: Sequelize, fundId: number, fiscalYear: number, amount: number) => Promise<{
        available: boolean;
        balance: number;
        message?: string;
    }>;
    calculateFundBalancesByType: (sequelize: Sequelize, fundId: number, fiscalYear: number) => Promise<Record<string, number>>;
    createGrantAward: (sequelize: Sequelize, grantData: CreateGrantAwardDto, userId: string, transaction?: Transaction) => Promise<any>;
    getGrantWithDetails: (sequelize: Sequelize, grantId: number) => Promise<any>;
    updateGrantStatus: (sequelize: Sequelize, grantId: number, newStatus: string, userId: string, transaction?: Transaction) => Promise<any>;
    validateGrantAward: (sequelize: Sequelize, grantId: number) => Promise<{
        valid: boolean;
        errors: string[];
    }>;
    createGrantBudget: (sequelize: Sequelize, grantId: number, fiscalYear: number, budgetLines: Array<{
        categoryCode: string;
        accountCode: string;
        budgetAmount: number;
        costType: string;
    }>, userId: string, transaction?: Transaction) => Promise<any>;
    approveGrantBudget: (sequelize: Sequelize, budgetId: number, userId: string, transaction?: Transaction) => Promise<any>;
    getGrantBudgetVariance: (sequelize: Sequelize, grantId: number, fiscalYear?: number) => Promise<any>;
    checkGrantBudgetAvailability: (sequelize: Sequelize, grantId: number, accountCode: string, amount: number) => Promise<{
        available: boolean;
        budgetAmount: number;
        availableAmount: number;
        message?: string;
    }>;
    recordGrantExpenditure: (sequelize: Sequelize, expenditureData: GrantExpenditureDto, userId: string, transaction?: Transaction) => Promise<any>;
    getGrantExpenditures: (sequelize: Sequelize, grantId: number, startDate?: Date, endDate?: Date, costType?: string) => Promise<any[]>;
    performComplianceCheck: (sequelize: Sequelize, grantId: number, amount: number, costType: string) => Promise<{
        allowable: boolean;
        allocable: boolean;
        reasonable: boolean;
    }>;
    recordCostSharingCommitment: (sequelize: Sequelize, grantId: number, commitmentType: string, source: string, cashAmount: number, inKindAmount: number, transaction?: Transaction) => Promise<any>;
    updateCostSharingMet: (sequelize: Sequelize, commitmentId: number, metAmount: number, transaction?: Transaction) => Promise<any>;
    getCostSharingStatus: (sequelize: Sequelize, grantId: number) => Promise<any>;
    calculateIndirectCosts: (sequelize: Sequelize, grantId: number, fiscalYear: number, fiscalPeriod: number, baseAmount: number, transaction?: Transaction) => Promise<any>;
    getIndirectCostAllocations: (sequelize: Sequelize, grantId: number, fiscalYear?: number) => Promise<any[]>;
    generateGrantInvoice: (sequelize: Sequelize, billingData: GrantBillingDto, userId: string, transaction?: Transaction) => Promise<any>;
    submitGrantInvoice: (sequelize: Sequelize, billingId: number, userId: string, transaction?: Transaction) => Promise<any>;
    recordGrantPayment: (sequelize: Sequelize, billingId: number, paymentAmount: number, paymentDate: Date, transaction?: Transaction) => Promise<any>;
    getGrantBillingHistory: (sequelize: Sequelize, grantId: number) => Promise<any[]>;
    createGrantReport: (sequelize: Sequelize, grantId: number, reportType: string, periodStart: Date, periodEnd: Date, dueDate: Date, transaction?: Transaction) => Promise<any>;
    submitGrantReport: (sequelize: Sequelize, reportId: number, userId: string, transaction?: Transaction) => Promise<any>;
    getGrantReports: (sequelize: Sequelize, grantId: number) => Promise<any[]>;
    createFundTransfer: (sequelize: Sequelize, sourceFundId: number, destinationFundId: number, amount: number, transferType: string, reason: string, userId: string, transaction?: Transaction) => Promise<any>;
    approveFundTransfer: (sequelize: Sequelize, transferId: number, userId: string, transaction?: Transaction) => Promise<any>;
    performGrantComplianceCheck: (sequelize: Sequelize, grantId: number, checkType: string, complianceArea: string, userId: string, transaction?: Transaction) => Promise<any>;
    generateFundAuditTrail: (sequelize: Sequelize, fundId: number, startDate: Date, endDate: Date) => Promise<any[]>;
    validateGrantCloseout: (sequelize: Sequelize, grantId: number) => Promise<{
        canClose: boolean;
        issues: string[];
        checklist: any[];
    }>;
    getFundTransferHistory: (sequelize: Sequelize, fundId?: number, startDate?: Date, endDate?: Date) => Promise<any[]>;
    updateGrantBudgetLine: (sequelize: Sequelize, budgetLineId: number, newBudgetAmount: number, userId: string, transaction?: Transaction) => Promise<any>;
    getGrantExpenditureSummary: (sequelize: Sequelize, grantId: number, fiscalYear?: number) => Promise<any[]>;
    validateCostSharingCommitment: (sequelize: Sequelize, grantId: number) => Promise<{
        valid: boolean;
        message?: string;
        details: any;
    }>;
    generateGrantFinancialStatement: (sequelize: Sequelize, grantId: number, asOfDate: Date) => Promise<any>;
    closeFund: (sequelize: Sequelize, fundId: number, userId: string, transaction?: Transaction) => Promise<any>;
    activateFund: (sequelize: Sequelize, fundId: number, userId: string, transaction?: Transaction) => Promise<any>;
    getGrantsByFund: (sequelize: Sequelize, fundId: number, status?: string) => Promise<any[]>;
};
export default _default;
//# sourceMappingURL=fund-grant-accounting-kit.d.ts.map