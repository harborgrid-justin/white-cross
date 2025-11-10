"use strict";
/**
 * LOC: FINACCT001
 * File: /reuse/financial/financial-accounts-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - General ledger services
 *   - Budget management services
 *   - Financial reporting modules
 */
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToCEFMSFormat = exports.generateFundStatusReport = exports.validateAppropriationAuthority = exports.processYearEndClosing = exports.calculateUnliquidatedObligations = exports.liquidateObligation = exports.recordObligation = exports.checkFundAvailability = exports.applyFundAccountingRules = exports.validateAccountDimensions = exports.clearReconciliationFlags = exports.flagAccountForReview = exports.autoReconcileAccounts = exports.generateReconciliationReport = exports.compareToExternalBalance = exports.resolveReconciliationException = exports.findReconciliationExceptions = exports.markAccountReconciled = exports.createAccountReconciliation = exports.getTrialBalance = exports.validateBalanceIntegrity = exports.rollupChildBalances = exports.carryForwardBalances = exports.updateEncumbranceAmount = exports.calculateAvailableBalance = exports.postToAccountBalance = exports.getAccountYTDBalance = exports.getAccountBalance = exports.createOrUpdateAccountBalance = exports.updateDescendantPaths = exports.moveAccountInHierarchy = exports.getAccountChildren = exports.getAccountParents = exports.buildAccountHierarchy = exports.validateAccountPostingRules = exports.parseAccountStructure = exports.parseAccountSegments = exports.validateAccountCodeFormat = exports.getAccountsByType = exports.getAccountByCode = exports.deactivateAccount = exports.updateAccount = exports.createAccount = exports.createAccountBalanceModel = exports.createChartOfAccountsModel = exports.AccountBalanceDto = exports.CreateAccountDto = void 0;
/**
 * File: /reuse/financial/financial-accounts-management-kit.ts
 * Locator: WC-FIN-ACCTMGMT-001
 * Purpose: Comprehensive Financial Accounts Management - USACE CEFMS-level chart of accounts, account hierarchy, balances, reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/financial/*, General Ledger, Budget Management, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for account management, chart of accounts, account hierarchy, balances, reconciliation, posting rules
 *
 * LLM Context: Enterprise-grade financial accounts management for USACE CEFMS compliance.
 * Provides comprehensive chart of accounts (COA) management, hierarchical account structures, account types,
 * balance tracking, reconciliation workflows, account segments, posting rules, account validation,
 * fund accounting, appropriation tracking, multi-dimensional accounting, account periods, and financial reporting.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateAccountDto = (() => {
    var _a;
    let _accountCode_decorators;
    let _accountCode_initializers = [];
    let _accountCode_extraInitializers = [];
    let _accountName_decorators;
    let _accountName_initializers = [];
    let _accountName_extraInitializers = [];
    let _accountType_decorators;
    let _accountType_initializers = [];
    let _accountType_extraInitializers = [];
    let _parentAccountId_decorators;
    let _parentAccountId_initializers = [];
    let _parentAccountId_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _normalBalance_decorators;
    let _normalBalance_initializers = [];
    let _normalBalance_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    return _a = class CreateAccountDto {
            constructor() {
                this.accountCode = __runInitializers(this, _accountCode_initializers, void 0);
                this.accountName = (__runInitializers(this, _accountCode_extraInitializers), __runInitializers(this, _accountName_initializers, void 0));
                this.accountType = (__runInitializers(this, _accountName_extraInitializers), __runInitializers(this, _accountType_initializers, void 0));
                this.parentAccountId = (__runInitializers(this, _accountType_extraInitializers), __runInitializers(this, _parentAccountId_initializers, void 0));
                this.description = (__runInitializers(this, _parentAccountId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.normalBalance = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _normalBalance_initializers, void 0));
                this.isActive = (__runInitializers(this, _normalBalance_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account code', example: 'A-1000-01' })];
            _accountName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account name', example: 'Cash - Operating Account' })];
            _accountType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account type', example: 'ASSET' })];
            _parentAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent account ID', required: false })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account description' })];
            _normalBalance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Normal balance type', enum: ['debit', 'credit'] })];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active', default: true })];
            __esDecorate(null, null, _accountCode_decorators, { kind: "field", name: "accountCode", static: false, private: false, access: { has: obj => "accountCode" in obj, get: obj => obj.accountCode, set: (obj, value) => { obj.accountCode = value; } }, metadata: _metadata }, _accountCode_initializers, _accountCode_extraInitializers);
            __esDecorate(null, null, _accountName_decorators, { kind: "field", name: "accountName", static: false, private: false, access: { has: obj => "accountName" in obj, get: obj => obj.accountName, set: (obj, value) => { obj.accountName = value; } }, metadata: _metadata }, _accountName_initializers, _accountName_extraInitializers);
            __esDecorate(null, null, _accountType_decorators, { kind: "field", name: "accountType", static: false, private: false, access: { has: obj => "accountType" in obj, get: obj => obj.accountType, set: (obj, value) => { obj.accountType = value; } }, metadata: _metadata }, _accountType_initializers, _accountType_extraInitializers);
            __esDecorate(null, null, _parentAccountId_decorators, { kind: "field", name: "parentAccountId", static: false, private: false, access: { has: obj => "parentAccountId" in obj, get: obj => obj.parentAccountId, set: (obj, value) => { obj.parentAccountId = value; } }, metadata: _metadata }, _parentAccountId_initializers, _parentAccountId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _normalBalance_decorators, { kind: "field", name: "normalBalance", static: false, private: false, access: { has: obj => "normalBalance" in obj, get: obj => obj.normalBalance, set: (obj, value) => { obj.normalBalance = value; } }, metadata: _metadata }, _normalBalance_initializers, _normalBalance_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAccountDto = CreateAccountDto;
let AccountBalanceDto = (() => {
    var _a;
    let _accountId_decorators;
    let _accountId_initializers = [];
    let _accountId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _beginningBalance_decorators;
    let _beginningBalance_initializers = [];
    let _beginningBalance_extraInitializers = [];
    let _endingBalance_decorators;
    let _endingBalance_initializers = [];
    let _endingBalance_extraInitializers = [];
    let _availableBalance_decorators;
    let _availableBalance_initializers = [];
    let _availableBalance_extraInitializers = [];
    return _a = class AccountBalanceDto {
            constructor() {
                this.accountId = __runInitializers(this, _accountId_initializers, void 0);
                this.fiscalYear = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.beginningBalance = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _beginningBalance_initializers, void 0));
                this.endingBalance = (__runInitializers(this, _beginningBalance_extraInitializers), __runInitializers(this, _endingBalance_initializers, void 0));
                this.availableBalance = (__runInitializers(this, _endingBalance_extraInitializers), __runInitializers(this, _availableBalance_initializers, void 0));
                __runInitializers(this, _availableBalance_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account ID' })];
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _beginningBalance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beginning balance' })];
            _endingBalance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Ending balance' })];
            _availableBalance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Available balance' })];
            __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: obj => "accountId" in obj, get: obj => obj.accountId, set: (obj, value) => { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _beginningBalance_decorators, { kind: "field", name: "beginningBalance", static: false, private: false, access: { has: obj => "beginningBalance" in obj, get: obj => obj.beginningBalance, set: (obj, value) => { obj.beginningBalance = value; } }, metadata: _metadata }, _beginningBalance_initializers, _beginningBalance_extraInitializers);
            __esDecorate(null, null, _endingBalance_decorators, { kind: "field", name: "endingBalance", static: false, private: false, access: { has: obj => "endingBalance" in obj, get: obj => obj.endingBalance, set: (obj, value) => { obj.endingBalance = value; } }, metadata: _metadata }, _endingBalance_initializers, _endingBalance_extraInitializers);
            __esDecorate(null, null, _availableBalance_decorators, { kind: "field", name: "availableBalance", static: false, private: false, access: { has: obj => "availableBalance" in obj, get: obj => obj.availableBalance, set: (obj, value) => { obj.availableBalance = value; } }, metadata: _metadata }, _availableBalance_initializers, _availableBalance_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AccountBalanceDto = AccountBalanceDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Chart of Accounts with hierarchical structure and segment support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ChartOfAccounts model
 *
 * @example
 * ```typescript
 * const ChartOfAccounts = createChartOfAccountsModel(sequelize);
 * const account = await ChartOfAccounts.create({
 *   accountCode: '1000-01-001',
 *   accountName: 'Cash - Operating',
 *   accountType: 'ASSET',
 *   normalBalance: 'debit',
 *   isActive: true
 * });
 * ```
 */
const createChartOfAccountsModel = (sequelize) => {
    class ChartOfAccounts extends sequelize_1.Model {
    }
    ChartOfAccounts.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique account code following USACE CEFMS structure',
            validate: {
                notEmpty: true,
                len: [3, 50],
            },
        },
        accountName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Descriptive account name',
            validate: {
                notEmpty: true,
                len: [3, 200],
            },
        },
        accountType: {
            type: sequelize_1.DataTypes.ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE', 'FUND_BALANCE', 'APPROPRIATION', 'BUDGETARY', 'MEMORANDUM'),
            allowNull: false,
            comment: 'Account type classification',
        },
        accountCategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'GENERAL',
            comment: 'Account category for reporting',
        },
        parentAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Parent account for hierarchy',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        normalBalance: {
            type: sequelize_1.DataTypes.ENUM('debit', 'credit'),
            allowNull: false,
            comment: 'Normal balance for account type',
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Hierarchy level (1=top level)',
            validate: {
                min: 1,
                max: 10,
            },
        },
        path: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            defaultValue: '',
            comment: 'Hierarchical path (e.g., /1/5/12)',
        },
        segments: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Account segment breakdown',
        },
        structure: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Account structure (fund, org, account, program, etc.)',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Account active status',
        },
        isSystemAccount: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'System-managed account (cannot be deleted)',
        },
        requiresProject: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Requires project code for transactions',
        },
        requiresActivity: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Requires activity code for transactions',
        },
        allowDirectPosting: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Allows direct journal entry posting',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Detailed account description',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the record',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the record',
        },
    }, {
        sequelize,
        tableName: 'chart_of_accounts',
        timestamps: true,
        indexes: [
            { fields: ['accountCode'], unique: true },
            { fields: ['accountType'] },
            { fields: ['accountCategory'] },
            { fields: ['parentAccountId'] },
            { fields: ['isActive'] },
            { fields: ['path'] },
            { fields: ['level'] },
        ],
        hooks: {
            beforeCreate: (account) => {
                if (!account.createdBy) {
                    throw new Error('createdBy is required');
                }
                account.updatedBy = account.createdBy;
            },
            beforeUpdate: (account) => {
                if (!account.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
        },
    });
    return ChartOfAccounts;
};
exports.createChartOfAccountsModel = createChartOfAccountsModel;
/**
 * Sequelize model for Account Balances with period tracking and encumbrances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} AccountBalance model
 *
 * @example
 * ```typescript
 * const AccountBalance = createAccountBalanceModel(sequelize);
 * const balance = await AccountBalance.create({
 *   accountId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   beginningBalance: 100000.00,
 *   debitAmount: 50000.00,
 *   creditAmount: 25000.00
 * });
 * ```
 */
const createAccountBalanceModel = (sequelize) => {
    class AccountBalance extends sequelize_1.Model {
    }
    AccountBalance.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to chart of accounts',
            references: {
                model: 'chart_of_accounts',
                key: 'id',
            },
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
            validate: {
                min: 2000,
                max: 2099,
            },
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period (1-12 or 1-13 for 13-period calendar)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        beginningBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Beginning balance for period',
        },
        debitAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total debits for period',
            validate: {
                min: 0,
            },
        },
        creditAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total credits for period',
            validate: {
                min: 0,
            },
        },
        endingBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Ending balance for period',
        },
        encumbranceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total encumbrances',
            validate: {
                min: 0,
            },
        },
        preEncumbranceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total pre-encumbrances',
            validate: {
                min: 0,
            },
        },
        obligationAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total obligations',
            validate: {
                min: 0,
            },
        },
        expenditureAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total expenditures',
            validate: {
                min: 0,
            },
        },
        budgetAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Budget amount for period',
            validate: {
                min: 0,
            },
        },
        availableBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Available balance (ending - encumbrances)',
        },
        lastReconciliationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last reconciliation date',
        },
        reconciliationStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'reconciled', 'exception', 'out_of_balance'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Reconciliation status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'account_balances',
        timestamps: true,
        indexes: [
            { fields: ['accountId', 'fiscalYear', 'fiscalPeriod'], unique: true },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['accountId'] },
            { fields: ['reconciliationStatus'] },
        ],
        hooks: {
            beforeSave: (balance) => {
                // Auto-calculate ending balance
                balance.endingBalance = Number(balance.beginningBalance) + Number(balance.debitAmount) - Number(balance.creditAmount);
                // Auto-calculate available balance
                balance.availableBalance = Number(balance.endingBalance) - Number(balance.encumbranceAmount);
            },
        },
    });
    return AccountBalance;
};
exports.createAccountBalanceModel = createAccountBalanceModel;
// ============================================================================
// CHART OF ACCOUNTS MANAGEMENT (1-10)
// ============================================================================
/**
 * Creates a new account in the chart of accounts with hierarchy support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAccountDto} accountData - Account creation data
 * @param {string} userId - User creating the account
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created account
 *
 * @example
 * ```typescript
 * const account = await createAccount(sequelize, {
 *   accountCode: '1000-01-001',
 *   accountName: 'Cash - Operating',
 *   accountType: 'ASSET',
 *   normalBalance: 'debit',
 *   isActive: true
 * }, 'user123');
 * ```
 */
const createAccount = async (sequelize, accountData, userId, transaction) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    // Validate account code uniqueness
    const existing = await ChartOfAccounts.findOne({
        where: { accountCode: accountData.accountCode },
        transaction,
    });
    if (existing) {
        throw new Error(`Account code ${accountData.accountCode} already exists`);
    }
    // Parse account segments
    const segments = (0, exports.parseAccountSegments)(accountData.accountCode);
    const structure = (0, exports.parseAccountStructure)(accountData.accountCode);
    // Determine hierarchy level and path
    let level = 1;
    let path = `/${accountData.accountCode}`;
    if (accountData.parentAccountId) {
        const parent = await ChartOfAccounts.findByPk(accountData.parentAccountId, { transaction });
        if (!parent) {
            throw new Error('Parent account not found');
        }
        level = parent.level + 1;
        path = `${parent.path}/${accountData.accountCode}`;
    }
    const account = await ChartOfAccounts.create({
        ...accountData,
        level,
        path,
        segments,
        structure,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return account;
};
exports.createAccount = createAccount;
/**
 * Updates an existing account in the chart of accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID to update
 * @param {Partial<CreateAccountDto>} updateData - Update data
 * @param {string} userId - User updating the account
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated account
 *
 * @example
 * ```typescript
 * const updated = await updateAccount(sequelize, 1, {
 *   accountName: 'Cash - Operating Account',
 *   description: 'Updated description'
 * }, 'user123');
 * ```
 */
const updateAccount = async (sequelize, accountId, updateData, userId, transaction) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const account = await ChartOfAccounts.findByPk(accountId, { transaction });
    if (!account) {
        throw new Error('Account not found');
    }
    if (account.isSystemAccount && updateData.isActive === false) {
        throw new Error('Cannot deactivate system account');
    }
    await account.update({ ...updateData, updatedBy: userId }, { transaction });
    return account;
};
exports.updateAccount = updateAccount;
/**
 * Deactivates an account (soft delete).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID to deactivate
 * @param {string} userId - User deactivating the account
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deactivateAccount(sequelize, 123, 'user123');
 * ```
 */
const deactivateAccount = async (sequelize, accountId, userId, transaction) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const account = await ChartOfAccounts.findByPk(accountId, { transaction });
    if (!account) {
        throw new Error('Account not found');
    }
    if (account.isSystemAccount) {
        throw new Error('Cannot deactivate system account');
    }
    // Check for child accounts
    const childCount = await ChartOfAccounts.count({
        where: { parentAccountId: accountId },
        transaction,
    });
    if (childCount > 0) {
        throw new Error('Cannot deactivate account with active child accounts');
    }
    await account.update({ isActive: false, updatedBy: userId }, { transaction });
};
exports.deactivateAccount = deactivateAccount;
/**
 * Retrieves account by account code.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountCode - Account code
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Account or null
 *
 * @example
 * ```typescript
 * const account = await getAccountByCode(sequelize, '1000-01-001');
 * ```
 */
const getAccountByCode = async (sequelize, accountCode, transaction) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    return await ChartOfAccounts.findOne({
        where: { accountCode },
        transaction,
    });
};
exports.getAccountByCode = getAccountByCode;
/**
 * Retrieves all accounts of a specific type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} accountType - Account type (ASSET, LIABILITY, etc.)
 * @param {boolean} activeOnly - Return only active accounts
 * @returns {Promise<any[]>} Array of accounts
 *
 * @example
 * ```typescript
 * const assets = await getAccountsByType(sequelize, 'ASSET', true);
 * ```
 */
const getAccountsByType = async (sequelize, accountType, activeOnly = true) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const where = { accountType };
    if (activeOnly) {
        where.isActive = true;
    }
    return await ChartOfAccounts.findAll({
        where,
        order: [['accountCode', 'ASC']],
    });
};
exports.getAccountsByType = getAccountsByType;
/**
 * Validates account code format according to USACE CEFMS structure.
 *
 * @param {string} accountCode - Account code to validate
 * @param {ChartOfAccountsConfig} config - COA configuration
 * @returns {boolean} Whether account code is valid
 *
 * @example
 * ```typescript
 * const isValid = validateAccountCodeFormat('1000-01-001', coaConfig);
 * ```
 */
const validateAccountCodeFormat = (accountCode, config) => {
    if (!accountCode || accountCode.length === 0) {
        return false;
    }
    // Check format matches configured pattern
    const formatRegex = new RegExp(config.accountFormat);
    if (!formatRegex.test(accountCode)) {
        return false;
    }
    // Check segment count
    const segments = accountCode.split(config.segmentDelimiter);
    if (segments.length !== config.segmentStructure.length) {
        return false;
    }
    return true;
};
exports.validateAccountCodeFormat = validateAccountCodeFormat;
/**
 * Parses account code into segments.
 *
 * @param {string} accountCode - Account code to parse
 * @param {string} delimiter - Segment delimiter
 * @returns {AccountSegment[]} Array of account segments
 *
 * @example
 * ```typescript
 * const segments = parseAccountSegments('1000-01-001', '-');
 * // Returns: [{ segmentNumber: 1, segmentCode: '1000', ... }, ...]
 * ```
 */
const parseAccountSegments = (accountCode, delimiter = '-') => {
    const parts = accountCode.split(delimiter);
    const segmentNames = ['Fund', 'Organization', 'Account', 'Program', 'Project', 'Activity'];
    return parts.map((part, index) => ({
        segmentNumber: index + 1,
        segmentName: segmentNames[index] || `Segment${index + 1}`,
        segmentCode: part,
        segmentValue: part,
        segmentDescription: `${segmentNames[index] || 'Segment'}: ${part}`,
    }));
};
exports.parseAccountSegments = parseAccountSegments;
/**
 * Parses account code into structured components (fund, org, account, etc.).
 *
 * @param {string} accountCode - Account code to parse
 * @returns {AccountStructure} Account structure
 *
 * @example
 * ```typescript
 * const structure = parseAccountStructure('1000-01-5001-AB-P123');
 * // Returns: { fundCode: '1000', organizationCode: '01', ... }
 * ```
 */
const parseAccountStructure = (accountCode) => {
    const segments = accountCode.split('-');
    return {
        fundCode: segments[0] || '',
        organizationCode: segments[1] || '',
        accountCode: segments[2] || '',
        programCode: segments[3] || '',
        projectCode: segments[4] || undefined,
        activityCode: segments[5] || undefined,
        costCenterCode: segments[6] || undefined,
    };
};
exports.parseAccountStructure = parseAccountStructure;
/**
 * Validates account posting rules for transaction.
 *
 * @param {any} account - Account object
 * @param {string} transactionType - Transaction type (debit/credit)
 * @param {PostingRule} postingRules - Posting rules configuration
 * @returns {boolean} Whether posting is allowed
 *
 * @example
 * ```typescript
 * const canPost = validateAccountPostingRules(account, 'debit', rules);
 * ```
 */
const validateAccountPostingRules = (account, transactionType, postingRules) => {
    if (!account.isActive) {
        throw new Error('Cannot post to inactive account');
    }
    if (!account.allowDirectPosting) {
        throw new Error('Direct posting not allowed for this account');
    }
    if (transactionType === 'debit' && !postingRules.allowDebit) {
        throw new Error('Debit posting not allowed for this account type');
    }
    if (transactionType === 'credit' && !postingRules.allowCredit) {
        throw new Error('Credit posting not allowed for this account type');
    }
    return true;
};
exports.validateAccountPostingRules = validateAccountPostingRules;
// ============================================================================
// ACCOUNT HIERARCHY MANAGEMENT (11-15)
// ============================================================================
/**
 * Builds complete account hierarchy tree.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number | null} parentId - Parent account ID (null for root)
 * @returns {Promise<AccountHierarchy[]>} Account hierarchy tree
 *
 * @example
 * ```typescript
 * const hierarchy = await buildAccountHierarchy(sequelize, null);
 * ```
 */
const buildAccountHierarchy = async (sequelize, parentId = null) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const accounts = await ChartOfAccounts.findAll({
        where: { parentAccountId: parentId, isActive: true },
        order: [['accountCode', 'ASC']],
    });
    const hierarchy = [];
    for (const account of accounts) {
        const children = await (0, exports.buildAccountHierarchy)(sequelize, account.id);
        hierarchy.push({
            accountId: account.id,
            parentAccountId: account.parentAccountId,
            level: account.level,
            path: account.path,
            children,
            rollupBalance: 0, // To be calculated
        });
    }
    return hierarchy;
};
exports.buildAccountHierarchy = buildAccountHierarchy;
/**
 * Gets all parent accounts for a given account (breadcrumb trail).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @returns {Promise<any[]>} Array of parent accounts
 *
 * @example
 * ```typescript
 * const parents = await getAccountParents(sequelize, 123);
 * ```
 */
const getAccountParents = async (sequelize, accountId) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const parents = [];
    let currentAccount = await ChartOfAccounts.findByPk(accountId);
    while (currentAccount && currentAccount.parentAccountId) {
        const parent = await ChartOfAccounts.findByPk(currentAccount.parentAccountId);
        if (parent) {
            parents.unshift(parent);
            currentAccount = parent;
        }
        else {
            break;
        }
    }
    return parents;
};
exports.getAccountParents = getAccountParents;
/**
 * Gets all child accounts for a given account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} parentId - Parent account ID
 * @param {boolean} recursive - Include all descendants
 * @returns {Promise<any[]>} Array of child accounts
 *
 * @example
 * ```typescript
 * const children = await getAccountChildren(sequelize, 1, true);
 * ```
 */
const getAccountChildren = async (sequelize, parentId, recursive = false) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    if (!recursive) {
        return await ChartOfAccounts.findAll({
            where: { parentAccountId: parentId, isActive: true },
            order: [['accountCode', 'ASC']],
        });
    }
    // Recursive: get all descendants
    const children = [];
    const directChildren = await ChartOfAccounts.findAll({
        where: { parentAccountId: parentId, isActive: true },
    });
    for (const child of directChildren) {
        children.push(child);
        const descendants = await (0, exports.getAccountChildren)(sequelize, child.id, true);
        children.push(...descendants);
    }
    return children;
};
exports.getAccountChildren = getAccountChildren;
/**
 * Moves account to a new parent in the hierarchy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID to move
 * @param {number | null} newParentId - New parent account ID
 * @param {string} userId - User performing the move
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await moveAccountInHierarchy(sequelize, 123, 456, 'user123');
 * ```
 */
const moveAccountInHierarchy = async (sequelize, accountId, newParentId, userId, transaction) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const account = await ChartOfAccounts.findByPk(accountId, { transaction });
    if (!account) {
        throw new Error('Account not found');
    }
    // Validate new parent exists
    if (newParentId) {
        const newParent = await ChartOfAccounts.findByPk(newParentId, { transaction });
        if (!newParent) {
            throw new Error('New parent account not found');
        }
        // Prevent circular reference
        const newParentPath = newParent.path;
        if (newParentPath.includes(`/${accountId}/`)) {
            throw new Error('Cannot move account to its own descendant');
        }
    }
    // Update parent and recalculate path/level
    let newLevel = 1;
    let newPath = `/${accountId}`;
    if (newParentId) {
        const parent = await ChartOfAccounts.findByPk(newParentId, { transaction });
        newLevel = parent.level + 1;
        newPath = `${parent.path}/${accountId}`;
    }
    await account.update({
        parentAccountId: newParentId,
        level: newLevel,
        path: newPath,
        updatedBy: userId,
    }, { transaction });
    // Update all descendants
    await (0, exports.updateDescendantPaths)(sequelize, accountId, newPath, transaction);
};
exports.moveAccountInHierarchy = moveAccountInHierarchy;
/**
 * Updates path for all descendant accounts after hierarchy change.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} parentId - Parent account ID
 * @param {string} newParentPath - New parent path
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateDescendantPaths(sequelize, 123, '/1/5/123');
 * ```
 */
const updateDescendantPaths = async (sequelize, parentId, newParentPath, transaction) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const children = await ChartOfAccounts.findAll({
        where: { parentAccountId: parentId },
        transaction,
    });
    for (const child of children) {
        const childPath = `${newParentPath}/${child.id}`;
        const childLevel = newParentPath.split('/').filter(Boolean).length + 1;
        await child.update({ path: childPath, level: childLevel }, { transaction });
        // Recursively update descendants
        await (0, exports.updateDescendantPaths)(sequelize, child.id, childPath, transaction);
    }
};
exports.updateDescendantPaths = updateDescendantPaths;
// ============================================================================
// ACCOUNT BALANCE MANAGEMENT (16-25)
// ============================================================================
/**
 * Creates or updates account balance for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {AccountBalance} balanceData - Balance data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Account balance record
 *
 * @example
 * ```typescript
 * const balance = await createOrUpdateAccountBalance(sequelize, {
 *   accountId: 1,
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   beginningBalance: 100000,
 *   debitAmount: 50000,
 *   creditAmount: 25000
 * });
 * ```
 */
const createOrUpdateAccountBalance = async (sequelize, balanceData, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const [balance, created] = await AccountBalance.findOrCreate({
        where: {
            accountId: balanceData.accountId,
            fiscalYear: balanceData.fiscalYear,
            fiscalPeriod: balanceData.fiscalPeriod,
        },
        defaults: balanceData,
        transaction,
    });
    if (!created) {
        await balance.update(balanceData, { transaction });
    }
    return balance;
};
exports.createOrUpdateAccountBalance = createOrUpdateAccountBalance;
/**
 * Retrieves account balance for a specific period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Account balance or null
 *
 * @example
 * ```typescript
 * const balance = await getAccountBalance(sequelize, 1, 2024, 1);
 * ```
 */
const getAccountBalance = async (sequelize, accountId, fiscalYear, fiscalPeriod) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    return await AccountBalance.findOne({
        where: {
            accountId,
            fiscalYear,
            fiscalPeriod,
        },
    });
};
exports.getAccountBalance = getAccountBalance;
/**
 * Calculates year-to-date balance for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} throughPeriod - Through fiscal period
 * @returns {Promise<number>} YTD balance
 *
 * @example
 * ```typescript
 * const ytdBalance = await getAccountYTDBalance(sequelize, 1, 2024, 6);
 * ```
 */
const getAccountYTDBalance = async (sequelize, accountId, fiscalYear, throughPeriod) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balances = await AccountBalance.findAll({
        where: {
            accountId,
            fiscalYear,
            fiscalPeriod: { [sequelize_1.Op.lte]: throughPeriod },
        },
        order: [['fiscalPeriod', 'ASC']],
    });
    let ytdBalance = 0;
    for (const balance of balances) {
        ytdBalance += Number(balance.debitAmount) - Number(balance.creditAmount);
    }
    return ytdBalance;
};
exports.getAccountYTDBalance = getAccountYTDBalance;
/**
 * Posts transaction amount to account balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Transaction amount
 * @param {string} type - Transaction type (debit/credit)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated balance
 *
 * @example
 * ```typescript
 * await postToAccountBalance(sequelize, 1, 2024, 1, 5000, 'debit');
 * ```
 */
const postToAccountBalance = async (sequelize, accountId, fiscalYear, fiscalPeriod, amount, type, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: { accountId, fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!balance) {
        throw new Error('Account balance not found for period');
    }
    const updateData = {};
    if (type === 'debit') {
        updateData.debitAmount = Number(balance.debitAmount) + Number(amount);
    }
    else {
        updateData.creditAmount = Number(balance.creditAmount) + Number(amount);
    }
    await balance.update(updateData, { transaction });
    return balance;
};
exports.postToAccountBalance = postToAccountBalance;
/**
 * Calculates available balance (ending balance minus encumbrances).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<number>} Available balance
 *
 * @example
 * ```typescript
 * const available = await calculateAvailableBalance(sequelize, 1, 2024, 1);
 * ```
 */
const calculateAvailableBalance = async (sequelize, accountId, fiscalYear, fiscalPeriod) => {
    const balance = await (0, exports.getAccountBalance)(sequelize, accountId, fiscalYear, fiscalPeriod);
    if (!balance) {
        return 0;
    }
    return Number(balance.endingBalance) - Number(balance.encumbranceAmount);
};
exports.calculateAvailableBalance = calculateAvailableBalance;
/**
 * Updates encumbrance amount for account balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Encumbrance amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateEncumbranceAmount(sequelize, 1, 2024, 1, 10000);
 * ```
 */
const updateEncumbranceAmount = async (sequelize, accountId, fiscalYear, fiscalPeriod, amount, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: { accountId, fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!balance) {
        throw new Error('Account balance not found');
    }
    await balance.update({
        encumbranceAmount: Number(balance.encumbranceAmount) + Number(amount),
    }, { transaction });
};
exports.updateEncumbranceAmount = updateEncumbranceAmount;
/**
 * Carries forward account balances to new fiscal year.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fromYear - Source fiscal year
 * @param {number} toYear - Target fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Number of balances carried forward
 *
 * @example
 * ```typescript
 * const count = await carryForwardBalances(sequelize, 2023, 2024);
 * ```
 */
const carryForwardBalances = async (sequelize, fromYear, toYear, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    // Get ending balances from last period of fromYear
    const endingBalances = await AccountBalance.findAll({
        where: {
            fiscalYear: fromYear,
            fiscalPeriod: 12,
        },
        transaction,
    });
    let count = 0;
    for (const oldBalance of endingBalances) {
        await AccountBalance.create({
            accountId: oldBalance.accountId,
            fiscalYear: toYear,
            fiscalPeriod: 1,
            beginningBalance: oldBalance.endingBalance,
            debitAmount: 0,
            creditAmount: 0,
            endingBalance: oldBalance.endingBalance,
            encumbranceAmount: 0,
            preEncumbranceAmount: 0,
            obligationAmount: 0,
            expenditureAmount: 0,
            budgetAmount: 0,
            availableBalance: oldBalance.endingBalance,
            reconciliationStatus: 'pending',
        }, { transaction });
        count++;
    }
    return count;
};
exports.carryForwardBalances = carryForwardBalances;
/**
 * Rolls up balances from child accounts to parent account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} parentAccountId - Parent account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<number>} Rolled up balance
 *
 * @example
 * ```typescript
 * const rollup = await rollupChildBalances(sequelize, 1, 2024, 1);
 * ```
 */
const rollupChildBalances = async (sequelize, parentAccountId, fiscalYear, fiscalPeriod) => {
    const children = await (0, exports.getAccountChildren)(sequelize, parentAccountId, true);
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    let totalBalance = 0;
    for (const child of children) {
        const balance = await AccountBalance.findOne({
            where: {
                accountId: child.id,
                fiscalYear,
                fiscalPeriod,
            },
        });
        if (balance) {
            totalBalance += Number(balance.endingBalance);
        }
    }
    return totalBalance;
};
exports.rollupChildBalances = rollupChildBalances;
/**
 * Validates account balance integrity (debits = credits).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<boolean>} Whether balances are in balance
 *
 * @example
 * ```typescript
 * const isBalanced = await validateBalanceIntegrity(sequelize, 2024, 1);
 * ```
 */
const validateBalanceIntegrity = async (sequelize, fiscalYear, fiscalPeriod) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const result = await AccountBalance.findAll({
        where: { fiscalYear, fiscalPeriod },
        attributes: [
            [sequelize.fn('SUM', sequelize.col('debitAmount')), 'totalDebits'],
            [sequelize.fn('SUM', sequelize.col('creditAmount')), 'totalCredits'],
        ],
        raw: true,
    });
    const totalDebits = Number(result[0].totalDebits || 0);
    const totalCredits = Number(result[0].totalCredits || 0);
    return Math.abs(totalDebits - totalCredits) < 0.01; // Allow 1 cent tolerance
};
exports.validateBalanceIntegrity = validateBalanceIntegrity;
/**
 * Retrieves trial balance for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} Trial balance data
 *
 * @example
 * ```typescript
 * const trialBalance = await getTrialBalance(sequelize, 2024, 1);
 * ```
 */
const getTrialBalance = async (sequelize, fiscalYear, fiscalPeriod) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const balances = await AccountBalance.findAll({
        where: { fiscalYear, fiscalPeriod },
        include: [
            {
                model: ChartOfAccounts,
                attributes: ['accountCode', 'accountName', 'accountType', 'normalBalance'],
            },
        ],
        order: [[{ model: ChartOfAccounts, as: 'account' }, 'accountCode', 'ASC']],
    });
    return balances.map((balance) => ({
        accountCode: balance.account.accountCode,
        accountName: balance.account.accountName,
        accountType: balance.account.accountType,
        normalBalance: balance.account.normalBalance,
        debitAmount: balance.debitAmount,
        creditAmount: balance.creditAmount,
        endingBalance: balance.endingBalance,
    }));
};
exports.getTrialBalance = getTrialBalance;
// ============================================================================
// ACCOUNT RECONCILIATION (26-35)
// ============================================================================
/**
 * Creates reconciliation record for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconciliationItem} reconciliationData - Reconciliation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created reconciliation record
 *
 * @example
 * ```typescript
 * const recon = await createAccountReconciliation(sequelize, {
 *   itemId: 'REC-001',
 *   accountId: 1,
 *   reconciliationDate: new Date(),
 *   sourceAmount: 100000,
 *   ledgerAmount: 99950,
 *   differenceAmount: 50,
 *   status: 'exception'
 * });
 * ```
 */
const createAccountReconciliation = async (sequelize, reconciliationData, transaction) => {
    const result = await sequelize.query(`INSERT INTO account_reconciliations
     (item_id, account_id, reconciliation_date, source_amount, ledger_amount, difference_amount, status, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, {
        replacements: [
            reconciliationData.itemId,
            reconciliationData.accountId,
            reconciliationData.reconciliationDate,
            reconciliationData.sourceAmount,
            reconciliationData.ledgerAmount,
            reconciliationData.differenceAmount,
            reconciliationData.status,
            reconciliationData.notes || null,
        ],
        transaction,
    });
    return result;
};
exports.createAccountReconciliation = createAccountReconciliation;
/**
 * Marks account as reconciled for a period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await markAccountReconciled(sequelize, 1, 2024, 1, 'user123');
 * ```
 */
const markAccountReconciled = async (sequelize, accountId, fiscalYear, fiscalPeriod, userId, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: { accountId, fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!balance) {
        throw new Error('Account balance not found');
    }
    await balance.update({
        reconciliationStatus: 'reconciled',
        lastReconciliationDate: new Date(),
    }, { transaction });
};
exports.markAccountReconciled = markAccountReconciled;
/**
 * Finds reconciliation exceptions for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any[]>} Reconciliation exceptions
 *
 * @example
 * ```typescript
 * const exceptions = await findReconciliationExceptions(
 *   sequelize, 1, new Date('2024-01-01'), new Date('2024-01-31')
 * );
 * ```
 */
const findReconciliationExceptions = async (sequelize, accountId, startDate, endDate) => {
    const [results] = await sequelize.query(`SELECT * FROM account_reconciliations
     WHERE account_id = ?
     AND reconciliation_date BETWEEN ? AND ?
     AND status = 'exception'
     ORDER BY reconciliation_date DESC`, {
        replacements: [accountId, startDate, endDate],
    });
    return results;
};
exports.findReconciliationExceptions = findReconciliationExceptions;
/**
 * Resolves reconciliation exception.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} itemId - Reconciliation item ID
 * @param {string} resolution - Resolution notes
 * @param {string} userId - User resolving exception
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await resolveReconciliationException(sequelize, 'REC-001', 'Timing difference', 'user123');
 * ```
 */
const resolveReconciliationException = async (sequelize, itemId, resolution, userId, transaction) => {
    await sequelize.query(`UPDATE account_reconciliations
     SET status = 'resolved', notes = ?, resolved_by = ?, resolved_at = NOW()
     WHERE item_id = ?`, {
        replacements: [resolution, userId, itemId],
        transaction,
    });
};
exports.resolveReconciliationException = resolveReconciliationException;
/**
 * Compares account balance to external system balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} externalBalance - External system balance
 * @returns {Promise<{ matched: boolean; difference: number }>} Comparison result
 *
 * @example
 * ```typescript
 * const result = await compareToExternalBalance(sequelize, 1, 2024, 1, 100000);
 * ```
 */
const compareToExternalBalance = async (sequelize, accountId, fiscalYear, fiscalPeriod, externalBalance) => {
    const balance = await (0, exports.getAccountBalance)(sequelize, accountId, fiscalYear, fiscalPeriod);
    if (!balance) {
        throw new Error('Account balance not found');
    }
    const difference = Number(balance.endingBalance) - Number(externalBalance);
    const matched = Math.abs(difference) < 0.01; // 1 cent tolerance
    return { matched, difference };
};
exports.compareToExternalBalance = compareToExternalBalance;
/**
 * Generates reconciliation report for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport(sequelize, 1, 2024, 1);
 * ```
 */
const generateReconciliationReport = async (sequelize, accountId, fiscalYear, fiscalPeriod) => {
    const balance = await (0, exports.getAccountBalance)(sequelize, accountId, fiscalYear, fiscalPeriod);
    const account = await (0, exports.getAccountByCode)(sequelize, balance?.accountCode);
    const [reconciliations] = await sequelize.query(`SELECT * FROM account_reconciliations
     WHERE account_id = ?
     AND YEAR(reconciliation_date) = ?
     AND MONTH(reconciliation_date) = ?
     ORDER BY reconciliation_date DESC`, {
        replacements: [accountId, fiscalYear, fiscalPeriod],
    });
    return {
        account: {
            accountCode: account?.accountCode,
            accountName: account?.accountName,
        },
        fiscalYear,
        fiscalPeriod,
        balance: {
            beginningBalance: balance?.beginningBalance,
            endingBalance: balance?.endingBalance,
            reconciliationStatus: balance?.reconciliationStatus,
            lastReconciliationDate: balance?.lastReconciliationDate,
        },
        reconciliations,
    };
};
exports.generateReconciliationReport = generateReconciliationReport;
/**
 * Auto-reconciles accounts with matching balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} tolerance - Tolerance for match (default 0.01)
 * @returns {Promise<number>} Number of auto-reconciled accounts
 *
 * @example
 * ```typescript
 * const count = await autoReconcileAccounts(sequelize, 2024, 1, 0.01);
 * ```
 */
const autoReconcileAccounts = async (sequelize, fiscalYear, fiscalPeriod, tolerance = 0.01) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    // This is a simplified version - in reality would compare to external system
    const balances = await AccountBalance.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
            reconciliationStatus: 'pending',
        },
    });
    let reconciledCount = 0;
    for (const balance of balances) {
        // Validate balance integrity
        const calculated = Number(balance.beginningBalance) + Number(balance.debitAmount) - Number(balance.creditAmount);
        const difference = Math.abs(calculated - Number(balance.endingBalance));
        if (difference <= tolerance) {
            await balance.update({
                reconciliationStatus: 'reconciled',
                lastReconciliationDate: new Date(),
            });
            reconciledCount++;
        }
    }
    return reconciledCount;
};
exports.autoReconcileAccounts = autoReconcileAccounts;
/**
 * Flags account for manual reconciliation review.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} reason - Reason for flagging
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await flagAccountForReview(sequelize, 1, 2024, 1, 'Large variance detected');
 * ```
 */
const flagAccountForReview = async (sequelize, accountId, fiscalYear, fiscalPeriod, reason, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: { accountId, fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!balance) {
        throw new Error('Account balance not found');
    }
    await balance.update({
        reconciliationStatus: 'exception',
        metadata: {
            ...balance.metadata,
            flagReason: reason,
            flaggedAt: new Date().toISOString(),
        },
    }, { transaction });
};
exports.flagAccountForReview = flagAccountForReview;
/**
 * Clears reconciliation flags for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User clearing flags
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await clearReconciliationFlags(sequelize, 1, 2024, 1, 'user123');
 * ```
 */
const clearReconciliationFlags = async (sequelize, accountId, fiscalYear, fiscalPeriod, userId, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: { accountId, fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!balance) {
        throw new Error('Account balance not found');
    }
    const metadata = { ...balance.metadata };
    delete metadata.flagReason;
    delete metadata.flaggedAt;
    await balance.update({
        reconciliationStatus: 'pending',
        metadata: {
            ...metadata,
            flagsClearedBy: userId,
            flagsClearedAt: new Date().toISOString(),
        },
    }, { transaction });
};
exports.clearReconciliationFlags = clearReconciliationFlags;
// ============================================================================
// ACCOUNT DIMENSIONS AND FUND ACCOUNTING (36-45)
// ============================================================================
/**
 * Validates account dimensions for transaction.
 *
 * @param {AccountDimension[]} dimensions - Account dimensions
 * @param {Record<string, string>} providedValues - Provided dimension values
 * @returns {boolean} Whether dimensions are valid
 *
 * @example
 * ```typescript
 * const isValid = validateAccountDimensions(dimensions, {
 *   fund: '1000',
 *   organization: '01',
 *   program: 'AB'
 * });
 * ```
 */
const validateAccountDimensions = (dimensions, providedValues) => {
    for (const dimension of dimensions) {
        if (dimension.isRequired && !providedValues[dimension.dimensionName]) {
            throw new Error(`Required dimension ${dimension.dimensionName} is missing`);
        }
        if (providedValues[dimension.dimensionName] && dimension.validValues) {
            if (!dimension.validValues.includes(providedValues[dimension.dimensionName])) {
                throw new Error(`Invalid value for dimension ${dimension.dimensionName}: ${providedValues[dimension.dimensionName]}`);
            }
        }
    }
    return true;
};
exports.validateAccountDimensions = validateAccountDimensions;
/**
 * Applies fund accounting rules to account.
 *
 * @param {FundAccountingRule} rule - Fund accounting rule
 * @param {number} fiscalYear - Fiscal year
 * @param {Date} transactionDate - Transaction date
 * @returns {boolean} Whether transaction is allowed
 *
 * @example
 * ```typescript
 * const allowed = applyFundAccountingRules(rule, 2024, new Date('2024-06-15'));
 * ```
 */
const applyFundAccountingRules = (rule, fiscalYear, transactionDate) => {
    const transactionYear = transactionDate.getFullYear();
    // Check expiration rules
    if (rule.expirationRule === 'annual' && transactionYear !== fiscalYear) {
        throw new Error('Annual appropriation expired - cannot post to previous fiscal year');
    }
    if (rule.expirationRule === 'multi-year') {
        const yearsElapsed = transactionYear - fiscalYear;
        if (yearsElapsed > 5) {
            throw new Error('Multi-year appropriation expired');
        }
    }
    return true;
};
exports.applyFundAccountingRules = applyFundAccountingRules;
/**
 * Checks fund availability for appropriation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} requestedAmount - Requested amount
 * @returns {Promise<{ available: boolean; remainingBalance: number }>} Availability check
 *
 * @example
 * ```typescript
 * const check = await checkFundAvailability(sequelize, 1, 2024, 50000);
 * ```
 */
const checkFundAvailability = async (sequelize, accountId, fiscalYear, requestedAmount) => {
    // Get current period
    const currentPeriod = new Date().getMonth() + 1;
    const balance = await (0, exports.getAccountBalance)(sequelize, accountId, fiscalYear, currentPeriod);
    if (!balance) {
        return { available: false, remainingBalance: 0 };
    }
    const availableBalance = Number(balance.availableBalance);
    const available = availableBalance >= requestedAmount;
    return {
        available,
        remainingBalance: availableBalance - requestedAmount,
    };
};
exports.checkFundAvailability = checkFundAvailability;
/**
 * Records obligation against appropriation account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Obligation amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await recordObligation(sequelize, 1, 2024, 1, 25000);
 * ```
 */
const recordObligation = async (sequelize, accountId, fiscalYear, fiscalPeriod, amount, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: { accountId, fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!balance) {
        throw new Error('Account balance not found');
    }
    // Check fund availability
    if (Number(balance.availableBalance) < amount) {
        throw new Error('Insufficient funds for obligation');
    }
    await balance.update({
        obligationAmount: Number(balance.obligationAmount) + Number(amount),
    }, { transaction });
};
exports.recordObligation = recordObligation;
/**
 * Liquidates obligation and records expenditure.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Expenditure amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await liquidateObligation(sequelize, 1, 2024, 1, 25000);
 * ```
 */
const liquidateObligation = async (sequelize, accountId, fiscalYear, fiscalPeriod, amount, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: { accountId, fiscalYear, fiscalPeriod },
        transaction,
    });
    if (!balance) {
        throw new Error('Account balance not found');
    }
    if (Number(balance.obligationAmount) < amount) {
        throw new Error('Expenditure exceeds obligation amount');
    }
    await balance.update({
        obligationAmount: Number(balance.obligationAmount) - Number(amount),
        expenditureAmount: Number(balance.expenditureAmount) + Number(amount),
    }, { transaction });
};
exports.liquidateObligation = liquidateObligation;
/**
 * Calculates unliquidated obligations for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<number>} Unliquidated obligation amount
 *
 * @example
 * ```typescript
 * const unliquidated = await calculateUnliquidatedObligations(sequelize, 1, 2024);
 * ```
 */
const calculateUnliquidatedObligations = async (sequelize, accountId, fiscalYear) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balances = await AccountBalance.findAll({
        where: { accountId, fiscalYear },
    });
    let totalUnliquidated = 0;
    for (const balance of balances) {
        totalUnliquidated += Number(balance.obligationAmount);
    }
    return totalUnliquidated;
};
exports.calculateUnliquidatedObligations = calculateUnliquidatedObligations;
/**
 * Processes year-end closing for appropriation accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @param {FundAccountingRule} rule - Fund accounting rule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ closed: number; carriedForward: number }>} Closing results
 *
 * @example
 * ```typescript
 * const result = await processYearEndClosing(sequelize, 2023, fundRule);
 * ```
 */
const processYearEndClosing = async (sequelize, fiscalYear, rule, transaction) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balances = await AccountBalance.findAll({
        where: { fiscalYear, fiscalPeriod: 12 },
        transaction,
    });
    let closedCount = 0;
    let carriedForwardCount = 0;
    for (const balance of balances) {
        if (rule.expirationRule === 'annual' && !rule.carryoverAllowed) {
            // Close to fund balance - don't carry forward
            // In a real implementation, would post closing entries
            closedCount++;
        }
        else if (rule.carryoverAllowed) {
            // Carry forward to next year
            await AccountBalance.create({
                accountId: balance.accountId,
                fiscalYear: fiscalYear + 1,
                fiscalPeriod: 1,
                beginningBalance: balance.endingBalance,
                debitAmount: 0,
                creditAmount: 0,
                endingBalance: balance.endingBalance,
                encumbranceAmount: 0,
                preEncumbranceAmount: 0,
                obligationAmount: 0,
                expenditureAmount: 0,
                budgetAmount: 0,
                availableBalance: balance.endingBalance,
                reconciliationStatus: 'pending',
            }, { transaction });
            carriedForwardCount++;
        }
    }
    return { closed: closedCount, carriedForward: carriedForwardCount };
};
exports.processYearEndClosing = processYearEndClosing;
/**
 * Validates appropriation authority for account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} requestedAmount - Requested amount
 * @returns {Promise<boolean>} Whether authority is sufficient
 *
 * @example
 * ```typescript
 * const hasAuthority = await validateAppropriationAuthority(sequelize, 1, 2024, 100000);
 * ```
 */
const validateAppropriationAuthority = async (sequelize, accountId, fiscalYear, requestedAmount) => {
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    const balance = await AccountBalance.findOne({
        where: {
            accountId,
            fiscalYear,
            fiscalPeriod: 1, // Budget is set in first period
        },
    });
    if (!balance) {
        throw new Error('No appropriation found for account');
    }
    const totalBudget = Number(balance.budgetAmount);
    const totalObligated = await (0, exports.calculateUnliquidatedObligations)(sequelize, accountId, fiscalYear);
    return totalObligated + requestedAmount <= totalBudget;
};
exports.validateAppropriationAuthority = validateAppropriationAuthority;
/**
 * Generates fund status report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<any>} Fund status report
 *
 * @example
 * ```typescript
 * const report = await generateFundStatusReport(sequelize, '1000', 2024);
 * ```
 */
const generateFundStatusReport = async (sequelize, fundCode, fiscalYear) => {
    const ChartOfAccounts = (0, exports.createChartOfAccountsModel)(sequelize);
    const AccountBalance = (0, exports.createAccountBalanceModel)(sequelize);
    // Get all accounts for fund
    const accounts = await ChartOfAccounts.findAll({
        where: {
            accountCode: { [sequelize_1.Op.like]: `${fundCode}%` },
            isActive: true,
        },
    });
    const fundStatus = {
        fundCode,
        fiscalYear,
        accounts: [],
        totals: {
            budgetAuthority: 0,
            obligations: 0,
            expenditures: 0,
            unliquidatedObligations: 0,
            available: 0,
        },
    };
    for (const account of accounts) {
        const balances = await AccountBalance.findAll({
            where: { accountId: account.id, fiscalYear },
        });
        let accountBudget = 0;
        let accountObligations = 0;
        let accountExpenditures = 0;
        for (const balance of balances) {
            accountBudget += Number(balance.budgetAmount);
            accountObligations += Number(balance.obligationAmount);
            accountExpenditures += Number(balance.expenditureAmount);
        }
        fundStatus.accounts.push({
            accountCode: account.accountCode,
            accountName: account.accountName,
            budget: accountBudget,
            obligations: accountObligations,
            expenditures: accountExpenditures,
            available: accountBudget - accountObligations - accountExpenditures,
        });
        fundStatus.totals.budgetAuthority += accountBudget;
        fundStatus.totals.obligations += accountObligations;
        fundStatus.totals.expenditures += accountExpenditures;
    }
    fundStatus.totals.unliquidatedObligations =
        fundStatus.totals.obligations - fundStatus.totals.expenditures;
    fundStatus.totals.available =
        fundStatus.totals.budgetAuthority - fundStatus.totals.obligations;
    return fundStatus;
};
exports.generateFundStatusReport = generateFundStatusReport;
/**
 * Exports fund accounting data to USACE CEFMS format.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} fundCode - Fund code
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} CEFMS export data
 *
 * @example
 * ```typescript
 * const exportData = await exportToCEFMSFormat(sequelize, '1000', 2024, 12);
 * ```
 */
const exportToCEFMSFormat = async (sequelize, fundCode, fiscalYear, fiscalPeriod) => {
    const report = await (0, exports.generateFundStatusReport)(sequelize, fundCode, fiscalYear);
    // Format for USACE CEFMS
    return {
        reportHeader: {
            fundCode,
            fiscalYear,
            fiscalPeriod,
            reportDate: new Date().toISOString(),
            reportType: 'FUND_STATUS',
        },
        fundData: {
            appropriation: report.totals.budgetAuthority,
            obligations: report.totals.obligations,
            expenditures: report.totals.expenditures,
            unliquidatedObligations: report.totals.unliquidatedObligations,
            unobligatedBalance: report.totals.available,
        },
        accountDetails: report.accounts.map((acc) => ({
            accountCode: acc.accountCode,
            accountName: acc.accountName,
            budgetAmount: acc.budget,
            obligatedAmount: acc.obligations,
            expendedAmount: acc.expenditures,
            availableAmount: acc.available,
        })),
    };
};
exports.exportToCEFMSFormat = exportToCEFMSFormat;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createChartOfAccountsModel: exports.createChartOfAccountsModel,
    createAccountBalanceModel: exports.createAccountBalanceModel,
    // Chart of Accounts Management
    createAccount: exports.createAccount,
    updateAccount: exports.updateAccount,
    deactivateAccount: exports.deactivateAccount,
    getAccountByCode: exports.getAccountByCode,
    getAccountsByType: exports.getAccountsByType,
    validateAccountCodeFormat: exports.validateAccountCodeFormat,
    parseAccountSegments: exports.parseAccountSegments,
    parseAccountStructure: exports.parseAccountStructure,
    validateAccountPostingRules: exports.validateAccountPostingRules,
    // Account Hierarchy
    buildAccountHierarchy: exports.buildAccountHierarchy,
    getAccountParents: exports.getAccountParents,
    getAccountChildren: exports.getAccountChildren,
    moveAccountInHierarchy: exports.moveAccountInHierarchy,
    updateDescendantPaths: exports.updateDescendantPaths,
    // Account Balance Management
    createOrUpdateAccountBalance: exports.createOrUpdateAccountBalance,
    getAccountBalance: exports.getAccountBalance,
    getAccountYTDBalance: exports.getAccountYTDBalance,
    postToAccountBalance: exports.postToAccountBalance,
    calculateAvailableBalance: exports.calculateAvailableBalance,
    updateEncumbranceAmount: exports.updateEncumbranceAmount,
    carryForwardBalances: exports.carryForwardBalances,
    rollupChildBalances: exports.rollupChildBalances,
    validateBalanceIntegrity: exports.validateBalanceIntegrity,
    getTrialBalance: exports.getTrialBalance,
    // Account Reconciliation
    createAccountReconciliation: exports.createAccountReconciliation,
    markAccountReconciled: exports.markAccountReconciled,
    findReconciliationExceptions: exports.findReconciliationExceptions,
    resolveReconciliationException: exports.resolveReconciliationException,
    compareToExternalBalance: exports.compareToExternalBalance,
    generateReconciliationReport: exports.generateReconciliationReport,
    autoReconcileAccounts: exports.autoReconcileAccounts,
    flagAccountForReview: exports.flagAccountForReview,
    clearReconciliationFlags: exports.clearReconciliationFlags,
    // Fund Accounting & Dimensions
    validateAccountDimensions: exports.validateAccountDimensions,
    applyFundAccountingRules: exports.applyFundAccountingRules,
    checkFundAvailability: exports.checkFundAvailability,
    recordObligation: exports.recordObligation,
    liquidateObligation: exports.liquidateObligation,
    calculateUnliquidatedObligations: exports.calculateUnliquidatedObligations,
    processYearEndClosing: exports.processYearEndClosing,
    validateAppropriationAuthority: exports.validateAppropriationAuthority,
    generateFundStatusReport: exports.generateFundStatusReport,
    exportToCEFMSFormat: exports.exportToCEFMSFormat,
};
//# sourceMappingURL=financial-accounts-management-kit.js.map