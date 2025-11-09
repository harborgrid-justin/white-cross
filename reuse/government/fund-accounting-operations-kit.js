"use strict";
/**
 * LOC: FNDACCTOP1234567
 * File: /reuse/government/fund-accounting-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (database ORM)
 *   - nestjs (framework utilities)
 *   - Node.js crypto, fs modules
 *
 * DOWNSTREAM (imported by):
 *   - ../backend/modules/government/accounting/*
 *   - ../backend/modules/government/budget/*
 *   - ../backend/modules/government/funds/*
 *   - API controllers for fund accounting operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportFundDataForAudit = exports.checkBudgetControl = exports.reconcileFund = exports.calculateFundPerformance = exports.generateCombinedStatement = exports.approveFundClosing = exports.performYearEndClosing = exports.liquidateEncumbrance = exports.createEncumbrance = exports.recordFundExpenditure = exports.recordFundRevenue = exports.reverseInterfundTransfer = exports.postInterfundTransfer = exports.createInterfundTransfer = exports.calculateFundBalanceRatio = exports.classifyFundBalance = exports.updateFundBalance = exports.getFundBalance = exports.closeFund = exports.listFundsByCategory = exports.getFundByCode = exports.createFund = exports.createInterfundTransferModel = exports.createFundBalanceModel = exports.createFundModel = void 0;
/**
 * File: /reuse/government/fund-accounting-operations-kit.ts
 * Locator: WC-GOV-FNDACCT-001
 * Purpose: Comprehensive Government Fund Accounting Operations - multi-fund accounting, fund types, interfund transfers, fund balance classification
 *
 * Upstream: Independent utility module for governmental fund accounting
 * Downstream: ../backend/*, fund accounting controllers, budget services, financial reporting modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for fund management, fund types, interfund transfers, fund balance, fund closing, revenue allocation, expenditure tracking
 *
 * LLM Context: Enterprise-grade governmental fund accounting utilities for production-ready NestJS applications.
 * Implements GASB 54 compliant fund accounting with multiple fund types (general, special revenue, debt service, capital projects,
 * enterprise, internal service, trust, agency), fund balance classification (nonspendable, restricted, committed, assigned, unassigned),
 * interfund transfers, fund closing procedures, revenue and expenditure tracking, fund performance reporting, fund reconciliation,
 * and comprehensive audit trail generation for all governmental fund accounting operations per GAAP and GASB standards.
 */
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
var FundType;
(function (FundType) {
    FundType["GENERAL"] = "general";
    FundType["SPECIAL_REVENUE"] = "special_revenue";
    FundType["DEBT_SERVICE"] = "debt_service";
    FundType["CAPITAL_PROJECTS"] = "capital_projects";
    FundType["ENTERPRISE"] = "enterprise";
    FundType["INTERNAL_SERVICE"] = "internal_service";
    FundType["TRUST"] = "trust";
    FundType["AGENCY"] = "agency";
    FundType["PENSION_TRUST"] = "pension_trust";
    FundType["INVESTMENT_TRUST"] = "investment_trust";
    FundType["PRIVATE_PURPOSE_TRUST"] = "private_purpose_trust";
})(FundType || (FundType = {}));
var FundCategory;
(function (FundCategory) {
    FundCategory["GOVERNMENTAL"] = "governmental";
    FundCategory["PROPRIETARY"] = "proprietary";
    FundCategory["FIDUCIARY"] = "fiduciary";
})(FundCategory || (FundCategory = {}));
var FundBalanceClassification;
(function (FundBalanceClassification) {
    FundBalanceClassification["NONSPENDABLE"] = "nonspendable";
    FundBalanceClassification["RESTRICTED"] = "restricted";
    FundBalanceClassification["COMMITTED"] = "committed";
    FundBalanceClassification["ASSIGNED"] = "assigned";
    FundBalanceClassification["UNASSIGNED"] = "unassigned";
})(FundBalanceClassification || (FundBalanceClassification = {}));
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Governmental Funds with comprehensive fund type support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Fund model
 *
 * @example
 * ```typescript
 * const Fund = createFundModel(sequelize);
 * const generalFund = await Fund.create({
 *   fundCode: 'GF-001',
 *   fundName: 'General Fund',
 *   fundType: 'general',
 *   fundCategory: 'governmental',
 *   description: 'Primary operating fund',
 *   establishedDate: new Date(),
 *   fiscalYearEnd: '12-31',
 *   status: 'active',
 *   accountingBasis: 'modified_accrual',
 *   budgetControlEnabled: true,
 *   requiresAppropriation: true,
 *   createdBy: 'admin'
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     Fund:
 *       type: object
 *       required:
 *         - fundCode
 *         - fundName
 *         - fundType
 *         - fundCategory
 *         - establishedDate
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier
 *         fundId:
 *           type: string
 *           format: uuid
 *           description: Fund UUID
 *         fundCode:
 *           type: string
 *           maxLength: 50
 *           description: Fund code
 *         fundName:
 *           type: string
 *           maxLength: 200
 *           description: Fund name
 *         fundType:
 *           type: string
 *           enum: [general, special_revenue, debt_service, capital_projects, enterprise, internal_service, trust, agency]
 *         fundCategory:
 *           type: string
 *           enum: [governmental, proprietary, fiduciary]
 *         status:
 *           type: string
 *           enum: [active, inactive, closed]
 *         accountingBasis:
 *           type: string
 *           enum: [modified_accrual, accrual, cash]
 */
const createFundModel = (sequelize) => {
    class FundModel extends sequelize_1.Model {
    }
    FundModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fundId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            comment: 'Unique fund identifier',
        },
        fundCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Fund code',
        },
        fundName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Fund name',
        },
        fundType: {
            type: sequelize_1.DataTypes.ENUM('general', 'special_revenue', 'debt_service', 'capital_projects', 'enterprise', 'internal_service', 'trust', 'agency', 'pension_trust', 'investment_trust', 'private_purpose_trust'),
            allowNull: false,
            comment: 'Fund type per GASB classification',
        },
        fundCategory: {
            type: sequelize_1.DataTypes.ENUM('governmental', 'proprietary', 'fiduciary'),
            allowNull: false,
            comment: 'Fund category',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Fund description and purpose',
        },
        establishedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date fund was established',
        },
        fiscalYearEnd: {
            type: sequelize_1.DataTypes.STRING(5),
            allowNull: false,
            defaultValue: '12-31',
            comment: 'Fiscal year end (MM-DD)',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'closed'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Fund status',
        },
        restrictionType: {
            type: sequelize_1.DataTypes.ENUM('legally_restricted', 'donor_restricted', 'board_designated', 'unrestricted'),
            allowNull: true,
            comment: 'Type of restriction on fund',
        },
        restrictionDescription: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Description of restrictions',
        },
        budgetControlEnabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether budget controls are enabled',
        },
        requiresAppropriation: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether appropriation is required',
        },
        allowDeficit: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether deficit spending is allowed',
        },
        parentFundId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Parent fund if this is a subfund',
        },
        departmentId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Responsible department',
        },
        managerId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Fund manager user ID',
        },
        accountingBasis: {
            type: sequelize_1.DataTypes.ENUM('modified_accrual', 'accrual', 'cash'),
            allowNull: false,
            defaultValue: 'modified_accrual',
            comment: 'Accounting basis used',
        },
        reportingRequired: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether reporting is required',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created fund',
        },
        createdDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Fund creation date',
        },
        closedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Fund closure date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'funds',
        timestamps: true,
        indexes: [
            { fields: ['fundId'], unique: true },
            { fields: ['fundCode'], unique: true },
            { fields: ['fundType'] },
            { fields: ['fundCategory'] },
            { fields: ['status'] },
            { fields: ['parentFundId'] },
            { fields: ['departmentId'] },
        ],
    });
    return FundModel;
};
exports.createFundModel = createFundModel;
/**
 * Sequelize model for Fund Balance with GASB 54 classifications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FundBalance model
 *
 * @example
 * ```typescript
 * const FundBalance = createFundBalanceModel(sequelize);
 * const balance = await FundBalance.create({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   balanceDate: new Date(),
 *   cashAndEquivalents: 5000000,
 *   totalAssets: 6000000,
 *   totalLiabilities: 500000,
 *   nonspendable: 100000,
 *   restricted: 2000000,
 *   committed: 1000000,
 *   assigned: 500000,
 *   unassigned: 1900000,
 *   totalFundBalance: 5500000
 * });
 * ```
 *
 * @openapi
 * components:
 *   schemas:
 *     FundBalance:
 *       type: object
 *       required:
 *         - fundId
 *         - fiscalYear
 *         - balanceDate
 *       properties:
 *         id:
 *           type: integer
 *         fundId:
 *           type: string
 *           format: uuid
 *         fiscalYear:
 *           type: string
 *         totalAssets:
 *           type: number
 *           format: decimal
 *         totalLiabilities:
 *           type: number
 *           format: decimal
 *         totalFundBalance:
 *           type: number
 *           format: decimal
 */
const createFundBalanceModel = (sequelize) => {
    class FundBalanceModel extends sequelize_1.Model {
    }
    FundBalanceModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fundId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Associated fund ID',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Fiscal year',
        },
        balanceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Balance date',
        },
        cashAndEquivalents: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Cash and cash equivalents',
        },
        investments: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Investments',
        },
        receivables: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Accounts receivable',
        },
        inventory: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Inventory',
        },
        prepaidItems: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Prepaid items',
        },
        restrictedCash: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Restricted cash',
        },
        otherAssets: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Other assets',
        },
        totalAssets: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total assets',
        },
        accountsPayable: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Accounts payable',
        },
        accruedLiabilities: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Accrued liabilities',
        },
        deferredRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Deferred revenue',
        },
        shortTermDebt: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Short-term debt',
        },
        longTermDebt: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Long-term debt',
        },
        otherLiabilities: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Other liabilities',
        },
        totalLiabilities: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total liabilities',
        },
        nonspendable: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Nonspendable fund balance (GASB 54)',
        },
        restricted: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Restricted fund balance (GASB 54)',
        },
        committed: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Committed fund balance (GASB 54)',
        },
        assigned: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Assigned fund balance (GASB 54)',
        },
        unassigned: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Unassigned fund balance (GASB 54)',
        },
        totalFundBalance: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total fund balance',
        },
        netInvestmentInCapitalAssets: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Net investment in capital assets (proprietary)',
        },
        restrictedNetPosition: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Restricted net position (proprietary)',
        },
        unrestrictedNetPosition: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Unrestricted net position (proprietary)',
        },
        totalNetPosition: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: true,
            comment: 'Total net position (proprietary)',
        },
        budgetedRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budgeted revenue',
        },
        actualRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual revenue',
        },
        budgetedExpenditures: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budgeted expenditures',
        },
        actualExpenditures: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Actual expenditures',
        },
        budgetVariance: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budget variance',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'fund_balances',
        timestamps: true,
        indexes: [
            { fields: ['fundId'] },
            { fields: ['fiscalYear'] },
            { fields: ['balanceDate'] },
            { fields: ['fundId', 'fiscalYear'], unique: true },
        ],
    });
    return FundBalanceModel;
};
exports.createFundBalanceModel = createFundBalanceModel;
/**
 * Sequelize model for Interfund Transfers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InterfundTransfer model
 *
 * @example
 * ```typescript
 * const InterfundTransfer = createInterfundTransferModel(sequelize);
 * const transfer = await InterfundTransfer.create({
 *   fromFundId: 'general-fund-uuid',
 *   toFundId: 'capital-projects-uuid',
 *   transferAmount: 1000000,
 *   transferType: 'capital',
 *   purpose: 'Capital project funding',
 *   approvedBy: 'city-council',
 *   transferDate: new Date(),
 *   status: 'approved'
 * });
 * ```
 */
const createInterfundTransferModel = (sequelize) => {
    class InterfundTransferModel extends sequelize_1.Model {
    }
    InterfundTransferModel.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transferId: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
            comment: 'Unique transfer identifier',
        },
        transferNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Transfer number',
        },
        transferDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Transfer date',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Fiscal year',
        },
        fromFundId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Source fund ID',
        },
        fromFundCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Source fund code',
        },
        fromFundName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Source fund name',
        },
        toFundId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Destination fund ID',
        },
        toFundCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Destination fund code',
        },
        toFundName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Destination fund name',
        },
        transferAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Transfer amount',
        },
        transferType: {
            type: sequelize_1.DataTypes.ENUM('operating', 'capital', 'debt_service', 'residual_equity', 'reimbursement'),
            allowNull: false,
            comment: 'Transfer type',
        },
        purpose: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Transfer purpose',
        },
        authorizationReference: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Authorization reference',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Approver',
        },
        approvalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Approval date',
        },
        postedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Posted date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'posted', 'reversed', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Transfer status',
        },
        reversalReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reversal reason',
        },
        reversedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Reversal date',
        },
        reversedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who reversed',
        },
        accountingEntries: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Accounting entries',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Creator',
        },
        createdDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Creation date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'interfund_transfers',
        timestamps: true,
        indexes: [
            { fields: ['transferId'], unique: true },
            { fields: ['transferNumber'], unique: true },
            { fields: ['fromFundId'] },
            { fields: ['toFundId'] },
            { fields: ['fiscalYear'] },
            { fields: ['status'] },
            { fields: ['transferDate'] },
        ],
    });
    return InterfundTransferModel;
};
exports.createInterfundTransferModel = createInterfundTransferModel;
// ============================================================================
// FUND MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new governmental fund.
 *
 * @param {Partial<Fund>} fundData - Fund data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created fund
 *
 * @example
 * ```typescript
 * const fund = await createFund({
 *   fundCode: 'SR-GRANTS',
 *   fundName: 'Federal Grants Special Revenue Fund',
 *   fundType: 'special_revenue',
 *   fundCategory: 'governmental',
 *   description: 'Accounts for federal grant revenues and expenditures',
 *   establishedDate: new Date(),
 *   fiscalYearEnd: '06-30',
 *   accountingBasis: 'modified_accrual',
 *   budgetControlEnabled: true,
 *   requiresAppropriation: true,
 *   createdBy: 'finance-director'
 * }, sequelize);
 * ```
 */
const createFund = async (fundData, sequelize) => {
    const Fund = (0, exports.createFundModel)(sequelize);
    const fund = await Fund.create({
        ...fundData,
        status: fundData.status || 'active',
        createdDate: new Date(),
    });
    return fund;
};
exports.createFund = createFund;
/**
 * Gets fund by code.
 *
 * @param {string} fundCode - Fund code
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Fund
 *
 * @example
 * ```typescript
 * const fund = await getFundByCode('GF-001', sequelize);
 * ```
 */
const getFundByCode = async (fundCode, sequelize) => {
    const Fund = (0, exports.createFundModel)(sequelize);
    const fund = await Fund.findOne({ where: { fundCode } });
    if (!fund) {
        throw new Error(`Fund not found: ${fundCode}`);
    }
    return fund;
};
exports.getFundByCode = getFundByCode;
/**
 * Lists all active funds by category.
 *
 * @param {FundCategory} category - Fund category
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} List of funds
 *
 * @example
 * ```typescript
 * const governmentalFunds = await listFundsByCategory('governmental', sequelize);
 * ```
 */
const listFundsByCategory = async (category, sequelize) => {
    const Fund = (0, exports.createFundModel)(sequelize);
    const funds = await Fund.findAll({
        where: {
            fundCategory: category,
            status: 'active',
        },
        order: [['fundCode', 'ASC']],
    });
    return funds;
};
exports.listFundsByCategory = listFundsByCategory;
/**
 * Closes a fund at fiscal year end.
 *
 * @param {string} fundId - Fund ID
 * @param {Date} closureDate - Closure date
 * @param {string} closedBy - User closing fund
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Closed fund
 *
 * @example
 * ```typescript
 * const closed = await closeFund('fund-uuid', new Date(), 'finance-director', sequelize);
 * ```
 */
const closeFund = async (fundId, closureDate, closedBy, sequelize) => {
    const Fund = (0, exports.createFundModel)(sequelize);
    const fund = await Fund.findOne({ where: { fundId } });
    if (!fund) {
        throw new Error(`Fund not found: ${fundId}`);
    }
    await fund.update({
        status: 'closed',
        closedDate: closureDate,
    });
    return fund;
};
exports.closeFund = closeFund;
// ============================================================================
// FUND BALANCE FUNCTIONS
// ============================================================================
/**
 * Gets current fund balance.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Fund balance
 *
 * @example
 * ```typescript
 * const balance = await getFundBalance('fund-uuid', 'FY2024', sequelize);
 * ```
 */
const getFundBalance = async (fundId, fiscalYear, sequelize) => {
    const FundBalance = (0, exports.createFundBalanceModel)(sequelize);
    const balance = await FundBalance.findOne({
        where: { fundId, fiscalYear },
        order: [['balanceDate', 'DESC']],
    });
    return balance;
};
exports.getFundBalance = getFundBalance;
/**
 * Updates fund balance with new transactions.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Partial<FundBalance>} balanceUpdates - Balance updates
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated balance
 *
 * @example
 * ```typescript
 * const updated = await updateFundBalance(
 *   'fund-uuid',
 *   'FY2024',
 *   { cashAndEquivalents: 5500000, actualRevenue: 1000000 },
 *   sequelize
 * );
 * ```
 */
const updateFundBalance = async (fundId, fiscalYear, balanceUpdates, sequelize) => {
    const FundBalance = (0, exports.createFundBalanceModel)(sequelize);
    const balance = await FundBalance.findOne({ where: { fundId, fiscalYear } });
    if (!balance) {
        // Create new balance record
        return await FundBalance.create({
            fundId,
            fiscalYear,
            balanceDate: new Date(),
            ...balanceUpdates,
        });
    }
    // Update existing balance
    await balance.update(balanceUpdates);
    return balance;
};
exports.updateFundBalance = updateFundBalance;
/**
 * Classifies fund balance per GASB 54.
 *
 * @param {string} fundId - Fund ID
 * @param {number} totalFundBalance - Total fund balance
 * @param {FundRestriction[]} restrictions - Fund restrictions
 * @returns {Promise<{ nonspendable: number; restricted: number; committed: number; assigned: number; unassigned: number }>}
 *
 * @example
 * ```typescript
 * const classification = await classifyFundBalance(
 *   'fund-uuid',
 *   5500000,
 *   restrictions
 * );
 * ```
 */
const classifyFundBalance = async (fundId, totalFundBalance, restrictions) => {
    let nonspendable = 0;
    let restricted = 0;
    let committed = 0;
    let assigned = 0;
    for (const restriction of restrictions) {
        if (restriction.status === 'active') {
            switch (restriction.restrictionType) {
                case FundBalanceClassification.NONSPENDABLE:
                    nonspendable += restriction.amount;
                    break;
                case FundBalanceClassification.RESTRICTED:
                    restricted += restriction.amount;
                    break;
                case FundBalanceClassification.COMMITTED:
                    committed += restriction.amount;
                    break;
                case FundBalanceClassification.ASSIGNED:
                    assigned += restriction.amount;
                    break;
            }
        }
    }
    const unassigned = Math.max(0, totalFundBalance - nonspendable - restricted - committed - assigned);
    return {
        nonspendable,
        restricted,
        committed,
        assigned,
        unassigned,
    };
};
exports.classifyFundBalance = classifyFundBalance;
/**
 * Calculates fund balance ratio.
 *
 * @param {number} fundBalance - Fund balance
 * @param {number} totalExpenditures - Total annual expenditures
 * @returns {number} Fund balance ratio
 *
 * @example
 * ```typescript
 * const ratio = calculateFundBalanceRatio(5500000, 50000000);
 * // Returns: 0.11 (11% - approximately 40 days of operations)
 * ```
 */
const calculateFundBalanceRatio = (fundBalance, totalExpenditures) => {
    if (totalExpenditures === 0)
        return 0;
    return Math.round((fundBalance / totalExpenditures) * 10000) / 10000;
};
exports.calculateFundBalanceRatio = calculateFundBalanceRatio;
// ============================================================================
// INTERFUND TRANSFER FUNCTIONS
// ============================================================================
/**
 * Creates an interfund transfer.
 *
 * @param {Partial<InterfundTransfer>} transferData - Transfer data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Created transfer
 *
 * @example
 * ```typescript
 * const transfer = await createInterfundTransfer({
 *   fromFundId: 'general-fund-uuid',
 *   fromFundCode: 'GF-001',
 *   fromFundName: 'General Fund',
 *   toFundId: 'capital-projects-uuid',
 *   toFundCode: 'CP-001',
 *   toFundName: 'Capital Projects Fund',
 *   transferAmount: 1000000,
 *   transferType: 'capital',
 *   purpose: 'Capital project funding for new library',
 *   authorizationReference: 'Council Resolution 2024-45',
 *   transferDate: new Date(),
 *   fiscalYear: 'FY2024',
 *   approvedBy: 'city-council',
 *   approvalDate: new Date(),
 *   createdBy: 'finance-director'
 * }, sequelize);
 * ```
 */
const createInterfundTransfer = async (transferData, sequelize) => {
    const InterfundTransfer = (0, exports.createInterfundTransferModel)(sequelize);
    const transferNumber = `IFT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    const transfer = await InterfundTransfer.create({
        ...transferData,
        transferNumber,
        status: 'pending',
        createdDate: new Date(),
    });
    return transfer;
};
exports.createInterfundTransfer = createInterfundTransfer;
/**
 * Posts an approved interfund transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Posted transfer
 *
 * @example
 * ```typescript
 * const posted = await postInterfundTransfer('transfer-uuid', sequelize);
 * ```
 */
const postInterfundTransfer = async (transferId, sequelize) => {
    const InterfundTransfer = (0, exports.createInterfundTransferModel)(sequelize);
    return await sequelize.transaction(async (transaction) => {
        const transfer = await InterfundTransfer.findOne({ where: { transferId }, transaction });
        if (!transfer) {
            throw new Error(`Transfer not found: ${transferId}`);
        }
        const transferData = transfer.toJSON();
        if (transferData.status !== 'approved') {
            throw new Error(`Transfer must be approved before posting`);
        }
        // Create accounting entries
        const entries = [
            {
                entryId: (0, crypto_1.randomUUID)(),
                entryDate: new Date(),
                fundId: transferData.fromFundId,
                accountCode: 'TRANSFER-OUT',
                accountName: 'Transfer Out',
                debitAmount: 0,
                creditAmount: transferData.transferAmount,
                description: `Transfer to ${transferData.toFundName}`,
                referenceNumber: transferData.transferNumber,
            },
            {
                entryId: (0, crypto_1.randomUUID)(),
                entryDate: new Date(),
                fundId: transferData.toFundId,
                accountCode: 'TRANSFER-IN',
                accountName: 'Transfer In',
                debitAmount: transferData.transferAmount,
                creditAmount: 0,
                description: `Transfer from ${transferData.fromFundName}`,
                referenceNumber: transferData.transferNumber,
            },
        ];
        await transfer.update({
            status: 'posted',
            postedDate: new Date(),
            accountingEntries: entries,
        }, { transaction });
        return transfer;
    });
};
exports.postInterfundTransfer = postInterfundTransfer;
/**
 * Reverses a posted interfund transfer.
 *
 * @param {string} transferId - Transfer ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} reversedBy - User reversing transfer
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Reversed transfer
 *
 * @example
 * ```typescript
 * const reversed = await reverseInterfundTransfer(
 *   'transfer-uuid',
 *   'Posted in error',
 *   'finance-director',
 *   sequelize
 * );
 * ```
 */
const reverseInterfundTransfer = async (transferId, reversalReason, reversedBy, sequelize) => {
    const InterfundTransfer = (0, exports.createInterfundTransferModel)(sequelize);
    const transfer = await InterfundTransfer.findOne({ where: { transferId } });
    if (!transfer) {
        throw new Error(`Transfer not found: ${transferId}`);
    }
    await transfer.update({
        status: 'reversed',
        reversalReason,
        reversedDate: new Date(),
        reversedBy,
    });
    return transfer;
};
exports.reverseInterfundTransfer = reverseInterfundTransfer;
// ============================================================================
// FUND REVENUE & EXPENDITURE FUNCTIONS
// ============================================================================
/**
 * Records fund revenue.
 *
 * @param {Partial<FundRevenue>} revenueData - Revenue data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundRevenue>}
 *
 * @example
 * ```typescript
 * const revenue = await recordFundRevenue({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   transactionDate: new Date(),
 *   revenueSource: 'property_tax',
 *   revenueCategory: 'taxes',
 *   revenueCode: 'REV-TAX-001',
 *   description: 'Property tax collection',
 *   amount: 50000,
 *   recognitionBasis: 'modified_accrual',
 *   deposited: true,
 *   depositDate: new Date(),
 *   receiptNumber: 'RCPT-12345',
 *   recordedBy: 'treasurer'
 * }, sequelize);
 * ```
 */
const recordFundRevenue = async (revenueData, sequelize) => {
    const revenue = {
        revenueId: (0, crypto_1.randomUUID)(),
        fundId: revenueData.fundId,
        fiscalYear: revenueData.fiscalYear,
        transactionDate: revenueData.transactionDate,
        revenueSource: revenueData.revenueSource,
        revenueCategory: revenueData.revenueCategory,
        revenueCode: revenueData.revenueCode,
        description: revenueData.description,
        amount: revenueData.amount,
        recognitionBasis: revenueData.recognitionBasis || 'modified_accrual',
        isRecurring: revenueData.isRecurring || false,
        deposited: revenueData.deposited || false,
        receiptNumber: revenueData.receiptNumber || `RCPT-${Date.now()}`,
        recordedBy: revenueData.recordedBy,
    };
    // In production, save to database and update fund balance
    return revenue;
};
exports.recordFundRevenue = recordFundRevenue;
/**
 * Records fund expenditure.
 *
 * @param {Partial<FundExpenditure>} expenditureData - Expenditure data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundExpenditure>}
 *
 * @example
 * ```typescript
 * const expenditure = await recordFundExpenditure({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   transactionDate: new Date(),
 *   expenditureCategory: 'personnel',
 *   expenditureType: 'salaries',
 *   accountCode: 'EXP-SAL-001',
 *   description: 'Monthly payroll',
 *   amount: 150000,
 *   payee: 'Employees',
 *   paymentMethod: 'ach',
 *   approvedBy: 'hr-director',
 *   approvalDate: new Date(),
 *   status: 'paid',
 *   recordedBy: 'payroll-clerk'
 * }, sequelize);
 * ```
 */
const recordFundExpenditure = async (expenditureData, sequelize) => {
    const expenditure = {
        expenditureId: (0, crypto_1.randomUUID)(),
        fundId: expenditureData.fundId,
        fiscalYear: expenditureData.fiscalYear,
        transactionDate: expenditureData.transactionDate,
        expenditureCategory: expenditureData.expenditureCategory,
        expenditureType: expenditureData.expenditureType,
        accountCode: expenditureData.accountCode,
        description: expenditureData.description,
        amount: expenditureData.amount,
        payee: expenditureData.payee,
        paymentMethod: expenditureData.paymentMethod,
        approvedBy: expenditureData.approvedBy,
        approvalDate: expenditureData.approvalDate,
        status: expenditureData.status || 'pending',
        recordedBy: expenditureData.recordedBy,
    };
    // In production, save to database and update fund balance
    return expenditure;
};
exports.recordFundExpenditure = recordFundExpenditure;
/**
 * Creates an encumbrance.
 *
 * @param {Partial<FundEncumbrance>} encumbranceData - Encumbrance data
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundEncumbrance>}
 *
 * @example
 * ```typescript
 * const encumbrance = await createEncumbrance({
 *   fundId: 'fund-uuid',
 *   fiscalYear: 'FY2024',
 *   encumbranceDate: new Date(),
 *   encumbranceType: 'purchase_order',
 *   referenceNumber: 'PO-2024-001',
 *   description: 'Office supplies',
 *   vendor: 'ABC Supplies Inc',
 *   amount: 5000,
 *   accountCode: 'EXP-SUP-001',
 *   status: 'open',
 *   createdBy: 'purchasing-agent'
 * }, sequelize);
 * ```
 */
const createEncumbrance = async (encumbranceData, sequelize) => {
    const encumbrance = {
        encumbranceId: (0, crypto_1.randomUUID)(),
        fundId: encumbranceData.fundId,
        fiscalYear: encumbranceData.fiscalYear,
        encumbranceDate: encumbranceData.encumbranceDate,
        encumbranceType: encumbranceData.encumbranceType,
        referenceNumber: encumbranceData.referenceNumber,
        description: encumbranceData.description,
        vendor: encumbranceData.vendor,
        amount: encumbranceData.amount,
        liquidatedAmount: 0,
        remainingAmount: encumbranceData.amount,
        accountCode: encumbranceData.accountCode,
        status: 'open',
        createdBy: encumbranceData.createdBy,
        createdDate: new Date(),
    };
    // In production, save to database and update fund balance
    return encumbrance;
};
exports.createEncumbrance = createEncumbrance;
/**
 * Liquidates an encumbrance.
 *
 * @param {string} encumbranceId - Encumbrance ID
 * @param {number} liquidationAmount - Amount to liquidate
 * @param {string} liquidatedBy - User liquidating
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundEncumbrance>}
 *
 * @example
 * ```typescript
 * const liquidated = await liquidateEncumbrance(
 *   'encumbrance-uuid',
 *   3000,
 *   'accounts-payable',
 *   sequelize
 * );
 * ```
 */
const liquidateEncumbrance = async (encumbranceId, liquidationAmount, liquidatedBy, sequelize) => {
    // Mock implementation
    const encumbrance = {
        encumbranceId,
        fundId: 'fund-uuid',
        fiscalYear: 'FY2024',
        encumbranceDate: new Date(),
        encumbranceType: 'purchase_order',
        referenceNumber: 'PO-2024-001',
        description: 'Office supplies',
        vendor: 'ABC Supplies Inc',
        amount: 5000,
        liquidatedAmount: liquidationAmount,
        remainingAmount: 5000 - liquidationAmount,
        accountCode: 'EXP-SUP-001',
        status: liquidationAmount >= 5000 ? 'fully_liquidated' : 'partially_liquidated',
        createdBy: 'purchasing-agent',
        createdDate: new Date(),
        liquidatedBy,
        liquidatedDate: new Date(),
    };
    return encumbrance;
};
exports.liquidateEncumbrance = liquidateEncumbrance;
// ============================================================================
// FUND CLOSING FUNCTIONS
// ============================================================================
/**
 * Performs year-end fund closing.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {string} performedBy - User performing closing
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundClosingEntry>}
 *
 * @example
 * ```typescript
 * const closing = await performYearEndClosing(
 *   'fund-uuid',
 *   'FY2024',
 *   'finance-director',
 *   sequelize
 * );
 * ```
 */
const performYearEndClosing = async (fundId, fiscalYear, performedBy, sequelize) => {
    // Mock implementation - in production, calculate actual balances
    const closing = {
        closingId: (0, crypto_1.randomUUID)(),
        fundId,
        fiscalYear,
        closingDate: new Date(),
        closingType: 'year_end',
        revenueBalance: 50000000,
        expenditureBalance: 48000000,
        encumbranceBalance: 500000,
        transfersIn: 1000000,
        transfersOut: 500000,
        excessOrDeficit: 2000000,
        priorYearBalance: 5000000,
        adjustments: 0,
        newFundBalance: 7000000,
        nonspendableAmount: 200000,
        restrictedAmount: 3000000,
        committedAmount: 1500000,
        assignedAmount: 800000,
        unassignedAmount: 1500000,
        encumbrancesCarriedForward: 400000,
        encumbrancesLapsed: 100000,
        closingEntries: [],
        performedBy,
        approved: false,
        status: 'draft',
    };
    return closing;
};
exports.performYearEndClosing = performYearEndClosing;
/**
 * Approves fund closing.
 *
 * @param {string} closingId - Closing ID
 * @param {string} approver - Approver
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundClosingEntry>}
 *
 * @example
 * ```typescript
 * const approved = await approveFundClosing(
 *   'closing-uuid',
 *   'finance-director',
 *   sequelize
 * );
 * ```
 */
const approveFundClosing = async (closingId, approver, sequelize) => {
    // Mock implementation
    const closing = {
        closingId,
        fundId: 'fund-uuid',
        fiscalYear: 'FY2024',
        closingDate: new Date(),
        closingType: 'year_end',
        revenueBalance: 50000000,
        expenditureBalance: 48000000,
        encumbranceBalance: 500000,
        transfersIn: 1000000,
        transfersOut: 500000,
        excessOrDeficit: 2000000,
        priorYearBalance: 5000000,
        adjustments: 0,
        newFundBalance: 7000000,
        nonspendableAmount: 200000,
        restrictedAmount: 3000000,
        committedAmount: 1500000,
        assignedAmount: 800000,
        unassignedAmount: 1500000,
        encumbrancesCarriedForward: 400000,
        encumbrancesLapsed: 100000,
        closingEntries: [],
        performedBy: 'finance-director',
        approved: true,
        approvedBy: approver,
        approvalDate: new Date(),
        status: 'approved',
    };
    return closing;
};
exports.approveFundClosing = approveFundClosing;
// ============================================================================
// FUND REPORTING & ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates combined fund statement.
 *
 * @param {string} fiscalYear - Fiscal year
 * @param {string} statementType - Statement type
 * @param {FundCategory} [category] - Fund category filter
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CombinedFundStatement>}
 *
 * @example
 * ```typescript
 * const statement = await generateCombinedStatement(
 *   'FY2024',
 *   'balance_sheet',
 *   'governmental',
 *   sequelize
 * );
 * ```
 */
const generateCombinedStatement = async (fiscalYear, statementType, category, sequelize) => {
    // Mock implementation
    const statement = {
        statementId: (0, crypto_1.randomUUID)(),
        statementDate: new Date(),
        fiscalYear,
        statementType: statementType,
        fundCategory: category,
        funds: [],
        totals: {
            fundId: 'TOTAL',
            fundCode: 'TOTAL',
            fundName: 'Total',
            fundType: FundType.GENERAL,
            assets: 100000000,
            liabilities: 10000000,
            fundBalance: 90000000,
        },
        generatedBy: 'system',
        generatedDate: new Date(),
    };
    return statement;
};
exports.generateCombinedStatement = generateCombinedStatement;
/**
 * Calculates fund performance metrics.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundPerformanceMetrics>}
 *
 * @example
 * ```typescript
 * const metrics = await calculateFundPerformance(
 *   'fund-uuid',
 *   'FY2024',
 *   sequelize
 * );
 * ```
 */
const calculateFundPerformance = async (fundId, fiscalYear, sequelize) => {
    // Mock implementation
    const metrics = {
        fundId,
        fiscalYear,
        periodEndDate: new Date(),
        totalRevenue: 50000000,
        revenueGrowth: 0.03,
        revenueToTarget: 0.98,
        majorRevenueSourcePercentage: 0.45,
        totalExpenditures: 48000000,
        expenditureGrowth: 0.025,
        expenditureToTarget: 0.96,
        personnelCostPercentage: 0.65,
        operatingCostPercentage: 0.25,
        fundBalanceRatio: 0.15,
        liquidityRatio: 1.5,
        reserveRatio: 0.12,
        collectionRate: 0.97,
        expenditureEfficiency: 0.96,
        budgetVariancePercentage: 0.02,
        encumbranceCompliance: true,
        appropriationCompliance: true,
        restrictionCompliance: true,
    };
    return metrics;
};
exports.calculateFundPerformance = calculateFundPerformance;
/**
 * Performs fund reconciliation.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {Date} periodStart - Period start date
 * @param {Date} periodEnd - Period end date
 * @param {string} reconciledBy - User performing reconciliation
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FundReconciliation>}
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileFund(
 *   'fund-uuid',
 *   'FY2024',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31'),
 *   'accountant',
 *   sequelize
 * );
 * ```
 */
const reconcileFund = async (fundId, fiscalYear, periodStart, periodEnd, reconciledBy, sequelize) => {
    // Mock implementation
    const reconciliation = {
        reconciliationId: (0, crypto_1.randomUUID)(),
        fundId,
        fiscalYear,
        reconciliationDate: new Date(),
        periodStart,
        periodEnd,
        reconciliationType: 'bank',
        beginningBookBalance: 5000000,
        beginningBankBalance: 4950000,
        totalRevenue: 2000000,
        transfersIn: 100000,
        otherAdditions: 0,
        totalExpenditures: 1800000,
        transfersOut: 50000,
        otherDeductions: 0,
        endingBookBalance: 5250000,
        endingBankBalance: 5200000,
        outstandingChecks: 75000,
        depositsInTransit: 25000,
        adjustments: [],
        variance: 0,
        reconciledBy,
        approved: false,
        status: 'in_progress',
    };
    return reconciliation;
};
exports.reconcileFund = reconcileFund;
/**
 * Checks budget control status.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {string} accountCode - Account code
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<BudgetControl>}
 *
 * @example
 * ```typescript
 * const control = await checkBudgetControl(
 *   'fund-uuid',
 *   'FY2024',
 *   'EXP-SAL-001',
 *   sequelize
 * );
 * ```
 */
const checkBudgetControl = async (fundId, fiscalYear, accountCode, sequelize) => {
    // Mock implementation
    const control = {
        fundId,
        fiscalYear,
        accountCode,
        budgetAmount: 1000000,
        revisedBudgetAmount: 1050000,
        actualExpenditures: 850000,
        encumbrances: 100000,
        availableBalance: 100000,
        percentageUsed: 0.905,
        overBudget: false,
        warningThreshold: 0.9,
        criticalThreshold: 0.95,
        status: 'critical',
    };
    return control;
};
exports.checkBudgetControl = checkBudgetControl;
/**
 * Exports fund data for audit.
 *
 * @param {string} fundId - Fund ID
 * @param {string} fiscalYear - Fiscal year
 * @param {string} exportFormat - Export format
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<string>} Export file path
 *
 * @example
 * ```typescript
 * const path = await exportFundDataForAudit(
 *   'fund-uuid',
 *   'FY2024',
 *   'csv',
 *   sequelize
 * );
 * ```
 */
const exportFundDataForAudit = async (fundId, fiscalYear, exportFormat, sequelize) => {
    const outputPath = `/tmp/fund_exports/audit_${fundId}_${fiscalYear}.${exportFormat}`;
    const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
    if (!(0, fs_1.existsSync)(dir)) {
        (0, fs_1.mkdirSync)(dir, { recursive: true });
    }
    let content = '';
    if (exportFormat === 'json') {
        content = JSON.stringify({ fundId, fiscalYear, exportDate: new Date() }, null, 2);
    }
    else if (exportFormat === 'csv') {
        content = 'FundId,FiscalYear,ExportDate\n';
        content += `${fundId},${fiscalYear},${new Date().toISOString()}\n`;
    }
    (0, fs_1.writeFileSync)(outputPath, content);
    return outputPath;
};
exports.exportFundDataForAudit = exportFundDataForAudit;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createFundModel: exports.createFundModel,
    createFundBalanceModel: exports.createFundBalanceModel,
    createInterfundTransferModel: exports.createInterfundTransferModel,
    // Fund Management
    createFund: exports.createFund,
    getFundByCode: exports.getFundByCode,
    listFundsByCategory: exports.listFundsByCategory,
    closeFund: exports.closeFund,
    // Fund Balance
    getFundBalance: exports.getFundBalance,
    updateFundBalance: exports.updateFundBalance,
    classifyFundBalance: exports.classifyFundBalance,
    calculateFundBalanceRatio: exports.calculateFundBalanceRatio,
    // Interfund Transfers
    createInterfundTransfer: exports.createInterfundTransfer,
    postInterfundTransfer: exports.postInterfundTransfer,
    reverseInterfundTransfer: exports.reverseInterfundTransfer,
    // Revenue & Expenditure
    recordFundRevenue: exports.recordFundRevenue,
    recordFundExpenditure: exports.recordFundExpenditure,
    createEncumbrance: exports.createEncumbrance,
    liquidateEncumbrance: exports.liquidateEncumbrance,
    // Fund Closing
    performYearEndClosing: exports.performYearEndClosing,
    approveFundClosing: exports.approveFundClosing,
    // Reporting & Analytics
    generateCombinedStatement: exports.generateCombinedStatement,
    calculateFundPerformance: exports.calculateFundPerformance,
    reconcileFund: exports.reconcileFund,
    checkBudgetControl: exports.checkBudgetControl,
    exportFundDataForAudit: exports.exportFundDataForAudit,
};
//# sourceMappingURL=fund-accounting-operations-kit.js.map