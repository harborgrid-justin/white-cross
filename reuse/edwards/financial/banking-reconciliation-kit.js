"use strict";
/**
 * LOC: BANKREC001
 * File: /reuse/edwards/financial/banking-reconciliation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./financial-accounts-management-kit (Account operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend banking modules
 *   - Cash management services
 *   - Treasury management systems
 *   - Bank reconciliation workflows
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
exports.createCashPositionModel = exports.createClearingRuleModel = exports.createBankFeedConfigModel = exports.createOutstandingDepositModel = exports.createOutstandingCheckModel = exports.createBankReconciliationMatchModel = exports.createBankReconciliationHeaderModel = exports.createBankStatementLineModel = exports.createBankStatementModel = exports.createBankAccountModel = exports.OutstandingItemsRequestDto = exports.CreateClearingRuleDto = exports.CashPositionRequestDto = exports.MatchTransactionDto = exports.CreateReconciliationDto = exports.ImportBankStatementDto = exports.CreateBankAccountDto = void 0;
exports.createBankAccount = createBankAccount;
exports.getBankAccountById = getBankAccountById;
exports.updateBankAccountBalance = updateBankAccountBalance;
exports.listBankAccounts = listBankAccounts;
exports.deactivateBankAccount = deactivateBankAccount;
exports.parseBAI2File = parseBAI2File;
exports.parseOFXFile = parseOFXFile;
exports.importBankStatement = importBankStatement;
exports.getBankStatementById = getBankStatementById;
exports.listBankStatements = listBankStatements;
exports.deleteBankStatement = deleteBankStatement;
exports.getUnmatchedBankTransactions = getUnmatchedBankTransactions;
exports.createBankReconciliation = createBankReconciliation;
exports.matchBankTransactionToGL = matchBankTransactionToGL;
exports.executeAutomatedReconciliation = executeAutomatedReconciliation;
exports.calculateReconciliationVariance = calculateReconciliationVariance;
exports.approveReconciliation = approveReconciliation;
exports.getReconciliationDashboard = getReconciliationDashboard;
exports.unmatchBankTransaction = unmatchBankTransaction;
exports.calculateCashPosition = calculateCashPosition;
exports.getCashPositionHistory = getCashPositionHistory;
exports.projectCashPosition = projectCashPosition;
exports.createOutstandingCheck = createOutstandingCheck;
exports.clearOutstandingCheck = clearOutstandingCheck;
exports.getOutstandingChecks = getOutstandingChecks;
exports.markStaleChecks = markStaleChecks;
exports.voidOutstandingCheck = voidOutstandingCheck;
exports.createOutstandingDeposit = createOutstandingDeposit;
exports.clearOutstandingDeposit = clearOutstandingDeposit;
exports.getDepositsInTransit = getDepositsInTransit;
exports.createClearingRule = createClearingRule;
exports.updateClearingRule = updateClearingRule;
exports.getClearingRules = getClearingRules;
exports.deactivateClearingRule = deactivateClearingRule;
exports.configureBankFeed = configureBankFeed;
exports.executeBankFeedSync = executeBankFeedSync;
exports.getBankFeedConfig = getBankFeedConfig;
exports.disableBankFeed = disableBankFeed;
/**
 * File: /reuse/edwards/financial/banking-reconciliation-kit.ts
 * Locator: WC-EDWARDS-BANKREC-001
 * Purpose: Comprehensive Banking Reconciliation - Oracle JD Edwards EnterpriseOne-level bank reconciliation, cash positioning, statement import, automated clearing
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, financial-accounts-management-kit
 * Downstream: ../backend/banking/*, Cash Management Services, Treasury Systems, Reconciliation Workflows
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for bank accounts, statement import (BAI2/OFX), bank reconciliation, cash positioning, outstanding items, automated clearing, bank feeds
 *
 * LLM Context: Enterprise-grade banking reconciliation for Oracle JD Edwards EnterpriseOne compliance.
 * Provides comprehensive bank account management, automated statement import (BAI2, OFX, CSV formats),
 * intelligent reconciliation matching, cash positioning, outstanding checks/deposits tracking,
 * automated clearing rules, bank feed integration, reconciliation reporting, and audit trails.
 *
 * Database Schema Design:
 * - bank_accounts: Bank account master data with routing numbers, account types, balances
 * - bank_statements: Imported statements with opening/closing balances, statement dates
 * - bank_statement_lines: Individual transactions from bank statements
 * - bank_reconciliation_headers: Reconciliation sessions with status workflow
 * - bank_reconciliation_matches: Matched GL transactions to bank statement lines
 * - outstanding_checks: Uncleared checks register with aging
 * - outstanding_deposits: Deposits in transit tracking
 * - bank_feeds_config: Automated bank feed API configuration (OAuth 2.0)
 * - cash_position: Real-time cash positioning across all accounts
 * - clearing_rules: Automated matching rule engine
 *
 * Indexing Strategy:
 * - Composite indexes: (bank_account_id, statement_date), (reconciliation_id, match_status)
 * - Matching optimization: (bank_account_id, transaction_date, amount) for algorithm performance
 * - Partial indexes: WHERE match_status = 'unmatched' for outstanding items
 * - Covering indexes: Dashboard queries with included columns
 * - GIN indexes: JSON metadata for flexible querying
 *
 * Query Optimization:
 * - Materialized views for cash position summary (refreshed every 5 minutes)
 * - Partitioning bank_statement_lines by month for high-volume accounts
 * - Batch statement import using COPY command (10,000 lines/batch)
 * - Parallel reconciliation matching with connection pooling
 * - Prepared statements for repeated matching queries
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateBankAccountDto = (() => {
    var _a;
    let _accountNumber_decorators;
    let _accountNumber_initializers = [];
    let _accountNumber_extraInitializers = [];
    let _accountName_decorators;
    let _accountName_initializers = [];
    let _accountName_extraInitializers = [];
    let _bankName_decorators;
    let _bankName_initializers = [];
    let _bankName_extraInitializers = [];
    let _bankCode_decorators;
    let _bankCode_initializers = [];
    let _bankCode_extraInitializers = [];
    let _routingNumber_decorators;
    let _routingNumber_initializers = [];
    let _routingNumber_extraInitializers = [];
    let _accountType_decorators;
    let _accountType_initializers = [];
    let _accountType_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _glAccountCode_decorators;
    let _glAccountCode_initializers = [];
    let _glAccountCode_extraInitializers = [];
    return _a = class CreateBankAccountDto {
            constructor() {
                this.accountNumber = __runInitializers(this, _accountNumber_initializers, void 0);
                this.accountName = (__runInitializers(this, _accountNumber_extraInitializers), __runInitializers(this, _accountName_initializers, void 0));
                this.bankName = (__runInitializers(this, _accountName_extraInitializers), __runInitializers(this, _bankName_initializers, void 0));
                this.bankCode = (__runInitializers(this, _bankName_extraInitializers), __runInitializers(this, _bankCode_initializers, void 0));
                this.routingNumber = (__runInitializers(this, _bankCode_extraInitializers), __runInitializers(this, _routingNumber_initializers, void 0));
                this.accountType = (__runInitializers(this, _routingNumber_extraInitializers), __runInitializers(this, _accountType_initializers, void 0));
                this.currency = (__runInitializers(this, _accountType_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.glAccountCode = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _glAccountCode_initializers, void 0));
                __runInitializers(this, _glAccountCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _accountNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account number', example: '123456789' })];
            _accountName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account name', example: 'Operating Account' })];
            _bankName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank name', example: 'Chase Bank' })];
            _bankCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank code', example: 'CHASE' })];
            _routingNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Routing number', example: '021000021' })];
            _accountType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account type', enum: ['checking', 'savings', 'money_market', 'credit_card', 'line_of_credit'] })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            _glAccountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'GL account code for mapping', example: '1010-000' })];
            __esDecorate(null, null, _accountNumber_decorators, { kind: "field", name: "accountNumber", static: false, private: false, access: { has: obj => "accountNumber" in obj, get: obj => obj.accountNumber, set: (obj, value) => { obj.accountNumber = value; } }, metadata: _metadata }, _accountNumber_initializers, _accountNumber_extraInitializers);
            __esDecorate(null, null, _accountName_decorators, { kind: "field", name: "accountName", static: false, private: false, access: { has: obj => "accountName" in obj, get: obj => obj.accountName, set: (obj, value) => { obj.accountName = value; } }, metadata: _metadata }, _accountName_initializers, _accountName_extraInitializers);
            __esDecorate(null, null, _bankName_decorators, { kind: "field", name: "bankName", static: false, private: false, access: { has: obj => "bankName" in obj, get: obj => obj.bankName, set: (obj, value) => { obj.bankName = value; } }, metadata: _metadata }, _bankName_initializers, _bankName_extraInitializers);
            __esDecorate(null, null, _bankCode_decorators, { kind: "field", name: "bankCode", static: false, private: false, access: { has: obj => "bankCode" in obj, get: obj => obj.bankCode, set: (obj, value) => { obj.bankCode = value; } }, metadata: _metadata }, _bankCode_initializers, _bankCode_extraInitializers);
            __esDecorate(null, null, _routingNumber_decorators, { kind: "field", name: "routingNumber", static: false, private: false, access: { has: obj => "routingNumber" in obj, get: obj => obj.routingNumber, set: (obj, value) => { obj.routingNumber = value; } }, metadata: _metadata }, _routingNumber_initializers, _routingNumber_extraInitializers);
            __esDecorate(null, null, _accountType_decorators, { kind: "field", name: "accountType", static: false, private: false, access: { has: obj => "accountType" in obj, get: obj => obj.accountType, set: (obj, value) => { obj.accountType = value; } }, metadata: _metadata }, _accountType_initializers, _accountType_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _glAccountCode_decorators, { kind: "field", name: "glAccountCode", static: false, private: false, access: { has: obj => "glAccountCode" in obj, get: obj => obj.glAccountCode, set: (obj, value) => { obj.glAccountCode = value; } }, metadata: _metadata }, _glAccountCode_initializers, _glAccountCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBankAccountDto = CreateBankAccountDto;
let ImportBankStatementDto = (() => {
    var _a;
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _fileFormat_decorators;
    let _fileFormat_initializers = [];
    let _fileFormat_extraInitializers = [];
    let _fileContent_decorators;
    let _fileContent_initializers = [];
    let _fileContent_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _autoReconcile_decorators;
    let _autoReconcile_initializers = [];
    let _autoReconcile_extraInitializers = [];
    return _a = class ImportBankStatementDto {
            constructor() {
                this.bankAccountId = __runInitializers(this, _bankAccountId_initializers, void 0);
                this.fileFormat = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _fileFormat_initializers, void 0));
                this.fileContent = (__runInitializers(this, _fileFormat_extraInitializers), __runInitializers(this, _fileContent_initializers, void 0));
                this.fileName = (__runInitializers(this, _fileContent_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
                this.autoReconcile = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _autoReconcile_initializers, void 0));
                __runInitializers(this, _autoReconcile_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _fileFormat_decorators = [(0, swagger_1.ApiProperty)({ description: 'Statement file format', enum: ['BAI2', 'OFX', 'QFX', 'CSV', 'MT940'] })];
            _fileContent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Statement file content (base64 or text)' })];
            _fileName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original file name' })];
            _autoReconcile_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-reconcile after import', default: false })];
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _fileFormat_decorators, { kind: "field", name: "fileFormat", static: false, private: false, access: { has: obj => "fileFormat" in obj, get: obj => obj.fileFormat, set: (obj, value) => { obj.fileFormat = value; } }, metadata: _metadata }, _fileFormat_initializers, _fileFormat_extraInitializers);
            __esDecorate(null, null, _fileContent_decorators, { kind: "field", name: "fileContent", static: false, private: false, access: { has: obj => "fileContent" in obj, get: obj => obj.fileContent, set: (obj, value) => { obj.fileContent = value; } }, metadata: _metadata }, _fileContent_initializers, _fileContent_extraInitializers);
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            __esDecorate(null, null, _autoReconcile_decorators, { kind: "field", name: "autoReconcile", static: false, private: false, access: { has: obj => "autoReconcile" in obj, get: obj => obj.autoReconcile, set: (obj, value) => { obj.autoReconcile = value; } }, metadata: _metadata }, _autoReconcile_initializers, _autoReconcile_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ImportBankStatementDto = ImportBankStatementDto;
let CreateReconciliationDto = (() => {
    var _a;
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _statementId_decorators;
    let _statementId_initializers = [];
    let _statementId_extraInitializers = [];
    let _reconciliationDate_decorators;
    let _reconciliationDate_initializers = [];
    let _reconciliationDate_extraInitializers = [];
    let _reconciliationType_decorators;
    let _reconciliationType_initializers = [];
    let _reconciliationType_extraInitializers = [];
    let _reconciledBy_decorators;
    let _reconciledBy_initializers = [];
    let _reconciledBy_extraInitializers = [];
    return _a = class CreateReconciliationDto {
            constructor() {
                this.bankAccountId = __runInitializers(this, _bankAccountId_initializers, void 0);
                this.statementId = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _statementId_initializers, void 0));
                this.reconciliationDate = (__runInitializers(this, _statementId_extraInitializers), __runInitializers(this, _reconciliationDate_initializers, void 0));
                this.reconciliationType = (__runInitializers(this, _reconciliationDate_extraInitializers), __runInitializers(this, _reconciliationType_initializers, void 0));
                this.reconciledBy = (__runInitializers(this, _reconciliationType_extraInitializers), __runInitializers(this, _reconciledBy_initializers, void 0));
                __runInitializers(this, _reconciledBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _statementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank statement ID' })];
            _reconciliationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reconciliation date' })];
            _reconciliationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reconciliation type', enum: ['manual', 'automated', 'hybrid'] })];
            _reconciledBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'User performing reconciliation' })];
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _statementId_decorators, { kind: "field", name: "statementId", static: false, private: false, access: { has: obj => "statementId" in obj, get: obj => obj.statementId, set: (obj, value) => { obj.statementId = value; } }, metadata: _metadata }, _statementId_initializers, _statementId_extraInitializers);
            __esDecorate(null, null, _reconciliationDate_decorators, { kind: "field", name: "reconciliationDate", static: false, private: false, access: { has: obj => "reconciliationDate" in obj, get: obj => obj.reconciliationDate, set: (obj, value) => { obj.reconciliationDate = value; } }, metadata: _metadata }, _reconciliationDate_initializers, _reconciliationDate_extraInitializers);
            __esDecorate(null, null, _reconciliationType_decorators, { kind: "field", name: "reconciliationType", static: false, private: false, access: { has: obj => "reconciliationType" in obj, get: obj => obj.reconciliationType, set: (obj, value) => { obj.reconciliationType = value; } }, metadata: _metadata }, _reconciliationType_initializers, _reconciliationType_extraInitializers);
            __esDecorate(null, null, _reconciledBy_decorators, { kind: "field", name: "reconciledBy", static: false, private: false, access: { has: obj => "reconciledBy" in obj, get: obj => obj.reconciledBy, set: (obj, value) => { obj.reconciledBy = value; } }, metadata: _metadata }, _reconciledBy_initializers, _reconciledBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateReconciliationDto = CreateReconciliationDto;
let MatchTransactionDto = (() => {
    var _a;
    let _reconciliationId_decorators;
    let _reconciliationId_initializers = [];
    let _reconciliationId_extraInitializers = [];
    let _statementLineId_decorators;
    let _statementLineId_initializers = [];
    let _statementLineId_extraInitializers = [];
    let _glTransactionId_decorators;
    let _glTransactionId_initializers = [];
    let _glTransactionId_extraInitializers = [];
    let _matchType_decorators;
    let _matchType_initializers = [];
    let _matchType_extraInitializers = [];
    let _matchConfidence_decorators;
    let _matchConfidence_initializers = [];
    let _matchConfidence_extraInitializers = [];
    return _a = class MatchTransactionDto {
            constructor() {
                this.reconciliationId = __runInitializers(this, _reconciliationId_initializers, void 0);
                this.statementLineId = (__runInitializers(this, _reconciliationId_extraInitializers), __runInitializers(this, _statementLineId_initializers, void 0));
                this.glTransactionId = (__runInitializers(this, _statementLineId_extraInitializers), __runInitializers(this, _glTransactionId_initializers, void 0));
                this.matchType = (__runInitializers(this, _glTransactionId_extraInitializers), __runInitializers(this, _matchType_initializers, void 0));
                this.matchConfidence = (__runInitializers(this, _matchType_extraInitializers), __runInitializers(this, _matchConfidence_initializers, void 0));
                __runInitializers(this, _matchConfidence_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reconciliationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reconciliation ID' })];
            _statementLineId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank statement line ID' })];
            _glTransactionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'GL transaction ID' })];
            _matchType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Match type', enum: ['exact', 'rule_based', 'manual', 'group'] })];
            _matchConfidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Match confidence (0-100)', minimum: 0, maximum: 100 })];
            __esDecorate(null, null, _reconciliationId_decorators, { kind: "field", name: "reconciliationId", static: false, private: false, access: { has: obj => "reconciliationId" in obj, get: obj => obj.reconciliationId, set: (obj, value) => { obj.reconciliationId = value; } }, metadata: _metadata }, _reconciliationId_initializers, _reconciliationId_extraInitializers);
            __esDecorate(null, null, _statementLineId_decorators, { kind: "field", name: "statementLineId", static: false, private: false, access: { has: obj => "statementLineId" in obj, get: obj => obj.statementLineId, set: (obj, value) => { obj.statementLineId = value; } }, metadata: _metadata }, _statementLineId_initializers, _statementLineId_extraInitializers);
            __esDecorate(null, null, _glTransactionId_decorators, { kind: "field", name: "glTransactionId", static: false, private: false, access: { has: obj => "glTransactionId" in obj, get: obj => obj.glTransactionId, set: (obj, value) => { obj.glTransactionId = value; } }, metadata: _metadata }, _glTransactionId_initializers, _glTransactionId_extraInitializers);
            __esDecorate(null, null, _matchType_decorators, { kind: "field", name: "matchType", static: false, private: false, access: { has: obj => "matchType" in obj, get: obj => obj.matchType, set: (obj, value) => { obj.matchType = value; } }, metadata: _metadata }, _matchType_initializers, _matchType_extraInitializers);
            __esDecorate(null, null, _matchConfidence_decorators, { kind: "field", name: "matchConfidence", static: false, private: false, access: { has: obj => "matchConfidence" in obj, get: obj => obj.matchConfidence, set: (obj, value) => { obj.matchConfidence = value; } }, metadata: _metadata }, _matchConfidence_initializers, _matchConfidence_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MatchTransactionDto = MatchTransactionDto;
let CashPositionRequestDto = (() => {
    var _a;
    let _positionDate_decorators;
    let _positionDate_initializers = [];
    let _positionDate_extraInitializers = [];
    let _bankAccountIds_decorators;
    let _bankAccountIds_initializers = [];
    let _bankAccountIds_extraInitializers = [];
    let _includeProjections_decorators;
    let _includeProjections_initializers = [];
    let _includeProjections_extraInitializers = [];
    return _a = class CashPositionRequestDto {
            constructor() {
                this.positionDate = __runInitializers(this, _positionDate_initializers, void 0);
                this.bankAccountIds = (__runInitializers(this, _positionDate_extraInitializers), __runInitializers(this, _bankAccountIds_initializers, void 0));
                this.includeProjections = (__runInitializers(this, _bankAccountIds_extraInitializers), __runInitializers(this, _includeProjections_initializers, void 0));
                __runInitializers(this, _includeProjections_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _positionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Position date', example: '2024-01-15' })];
            _bankAccountIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account IDs (optional - all if not provided)', required: false })];
            _includeProjections_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include projections', default: true })];
            __esDecorate(null, null, _positionDate_decorators, { kind: "field", name: "positionDate", static: false, private: false, access: { has: obj => "positionDate" in obj, get: obj => obj.positionDate, set: (obj, value) => { obj.positionDate = value; } }, metadata: _metadata }, _positionDate_initializers, _positionDate_extraInitializers);
            __esDecorate(null, null, _bankAccountIds_decorators, { kind: "field", name: "bankAccountIds", static: false, private: false, access: { has: obj => "bankAccountIds" in obj, get: obj => obj.bankAccountIds, set: (obj, value) => { obj.bankAccountIds = value; } }, metadata: _metadata }, _bankAccountIds_initializers, _bankAccountIds_extraInitializers);
            __esDecorate(null, null, _includeProjections_decorators, { kind: "field", name: "includeProjections", static: false, private: false, access: { has: obj => "includeProjections" in obj, get: obj => obj.includeProjections, set: (obj, value) => { obj.includeProjections = value; } }, metadata: _metadata }, _includeProjections_initializers, _includeProjections_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CashPositionRequestDto = CashPositionRequestDto;
let CreateClearingRuleDto = (() => {
    var _a;
    let _ruleName_decorators;
    let _ruleName_initializers = [];
    let _ruleName_extraInitializers = [];
    let _ruleType_decorators;
    let _ruleType_initializers = [];
    let _ruleType_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _amountTolerance_decorators;
    let _amountTolerance_initializers = [];
    let _amountTolerance_extraInitializers = [];
    let _dateRangeDays_decorators;
    let _dateRangeDays_initializers = [];
    let _dateRangeDays_extraInitializers = [];
    let _autoApprove_decorators;
    let _autoApprove_initializers = [];
    let _autoApprove_extraInitializers = [];
    return _a = class CreateClearingRuleDto {
            constructor() {
                this.ruleName = __runInitializers(this, _ruleName_initializers, void 0);
                this.ruleType = (__runInitializers(this, _ruleName_extraInitializers), __runInitializers(this, _ruleType_initializers, void 0));
                this.priority = (__runInitializers(this, _ruleType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.amountTolerance = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _amountTolerance_initializers, void 0));
                this.dateRangeDays = (__runInitializers(this, _amountTolerance_extraInitializers), __runInitializers(this, _dateRangeDays_initializers, void 0));
                this.autoApprove = (__runInitializers(this, _dateRangeDays_extraInitializers), __runInitializers(this, _autoApprove_initializers, void 0));
                __runInitializers(this, _autoApprove_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ruleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule name', example: 'ACH Exact Match' })];
            _ruleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rule type', enum: ['exact_match', 'amount_tolerance', 'date_range', 'pattern_match', 'group_match'] })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority (higher = applied first)', default: 100 })];
            _amountTolerance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amount tolerance for matching', default: 0.01 })];
            _dateRangeDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date range in days for matching', default: 3 })];
            _autoApprove_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-approve matches from this rule', default: false })];
            __esDecorate(null, null, _ruleName_decorators, { kind: "field", name: "ruleName", static: false, private: false, access: { has: obj => "ruleName" in obj, get: obj => obj.ruleName, set: (obj, value) => { obj.ruleName = value; } }, metadata: _metadata }, _ruleName_initializers, _ruleName_extraInitializers);
            __esDecorate(null, null, _ruleType_decorators, { kind: "field", name: "ruleType", static: false, private: false, access: { has: obj => "ruleType" in obj, get: obj => obj.ruleType, set: (obj, value) => { obj.ruleType = value; } }, metadata: _metadata }, _ruleType_initializers, _ruleType_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _amountTolerance_decorators, { kind: "field", name: "amountTolerance", static: false, private: false, access: { has: obj => "amountTolerance" in obj, get: obj => obj.amountTolerance, set: (obj, value) => { obj.amountTolerance = value; } }, metadata: _metadata }, _amountTolerance_initializers, _amountTolerance_extraInitializers);
            __esDecorate(null, null, _dateRangeDays_decorators, { kind: "field", name: "dateRangeDays", static: false, private: false, access: { has: obj => "dateRangeDays" in obj, get: obj => obj.dateRangeDays, set: (obj, value) => { obj.dateRangeDays = value; } }, metadata: _metadata }, _dateRangeDays_initializers, _dateRangeDays_extraInitializers);
            __esDecorate(null, null, _autoApprove_decorators, { kind: "field", name: "autoApprove", static: false, private: false, access: { has: obj => "autoApprove" in obj, get: obj => obj.autoApprove, set: (obj, value) => { obj.autoApprove = value; } }, metadata: _metadata }, _autoApprove_initializers, _autoApprove_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateClearingRuleDto = CreateClearingRuleDto;
let OutstandingItemsRequestDto = (() => {
    var _a;
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _asOfDate_decorators;
    let _asOfDate_initializers = [];
    let _asOfDate_extraInitializers = [];
    let _itemType_decorators;
    let _itemType_initializers = [];
    let _itemType_extraInitializers = [];
    let _includeStale_decorators;
    let _includeStale_initializers = [];
    let _includeStale_extraInitializers = [];
    return _a = class OutstandingItemsRequestDto {
            constructor() {
                this.bankAccountId = __runInitializers(this, _bankAccountId_initializers, void 0);
                this.asOfDate = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _asOfDate_initializers, void 0));
                this.itemType = (__runInitializers(this, _asOfDate_extraInitializers), __runInitializers(this, _itemType_initializers, void 0));
                this.includeStale = (__runInitializers(this, _itemType_extraInitializers), __runInitializers(this, _includeStale_initializers, void 0));
                __runInitializers(this, _includeStale_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _asOfDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'As of date', example: '2024-01-15' })];
            _itemType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item type', enum: ['checks', 'deposits', 'all'], default: 'all' })];
            _includeStale_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include stale checks', default: true })];
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _asOfDate_decorators, { kind: "field", name: "asOfDate", static: false, private: false, access: { has: obj => "asOfDate" in obj, get: obj => obj.asOfDate, set: (obj, value) => { obj.asOfDate = value; } }, metadata: _metadata }, _asOfDate_initializers, _asOfDate_extraInitializers);
            __esDecorate(null, null, _itemType_decorators, { kind: "field", name: "itemType", static: false, private: false, access: { has: obj => "itemType" in obj, get: obj => obj.itemType, set: (obj, value) => { obj.itemType = value; } }, metadata: _metadata }, _itemType_initializers, _itemType_extraInitializers);
            __esDecorate(null, null, _includeStale_decorators, { kind: "field", name: "includeStale", static: false, private: false, access: { has: obj => "includeStale" in obj, get: obj => obj.includeStale, set: (obj, value) => { obj.includeStale = value; } }, metadata: _metadata }, _includeStale_initializers, _includeStale_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.OutstandingItemsRequestDto = OutstandingItemsRequestDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Bank Accounts with routing and GL mapping.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankAccount model
 *
 * @example
 * ```typescript
 * const BankAccount = createBankAccountModel(sequelize);
 * const account = await BankAccount.create({
 *   accountNumber: '123456789',
 *   accountName: 'Operating Account',
 *   bankName: 'Chase Bank',
 *   routingNumber: '021000021',
 *   accountType: 'checking',
 *   currency: 'USD',
 *   glAccountCode: '1010-000'
 * });
 * ```
 */
const createBankAccountModel = (sequelize) => {
    class BankAccount extends sequelize_1.Model {
    }
    BankAccount.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        accountNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Bank account number',
        },
        accountName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Account descriptive name',
        },
        bankName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Bank institution name',
        },
        bankCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Bank identifier code',
        },
        routingNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'ABA routing number',
            validate: {
                len: [9, 20],
            },
        },
        accountType: {
            type: sequelize_1.DataTypes.ENUM('checking', 'savings', 'money_market', 'credit_card', 'line_of_credit'),
            allowNull: false,
            comment: 'Account type',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code (ISO 4217)',
        },
        currentBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Current ledger balance',
        },
        availableBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Available balance (excluding holds)',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Account active status',
        },
        glAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'GL account ID for mapping',
        },
        glAccountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'GL account code',
        },
        lastReconciledDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last successful reconciliation date',
        },
        lastStatementDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Most recent statement date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional account metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'bank_accounts',
        indexes: [
            {
                unique: true,
                fields: ['account_number', 'bank_code'],
                name: 'idx_bank_accounts_unique',
            },
            {
                fields: ['gl_account_id'],
                name: 'idx_bank_accounts_gl',
            },
            {
                fields: ['is_active', 'account_type'],
                name: 'idx_bank_accounts_active_type',
            },
            {
                fields: ['last_reconciled_date'],
                name: 'idx_bank_accounts_last_reconciled',
            },
        ],
    });
    return BankAccount;
};
exports.createBankAccountModel = createBankAccountModel;
/**
 * Sequelize model for Bank Statements with opening/closing balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankStatement model
 */
const createBankStatementModel = (sequelize) => {
    class BankStatement extends sequelize_1.Model {
    }
    BankStatement.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account foreign key',
            references: {
                model: 'bank_accounts',
                key: 'id',
            },
        },
        statementNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Statement number from bank',
        },
        statementDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Statement ending date',
        },
        openingBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Opening balance',
        },
        closingBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Closing balance',
        },
        totalDebits: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total debits',
        },
        totalCredits: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total credits',
        },
        lineCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of statement lines',
        },
        importDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Import timestamp',
        },
        importedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who imported',
        },
        fileFormat: {
            type: sequelize_1.DataTypes.ENUM('BAI2', 'OFX', 'QFX', 'CSV', 'MT940'),
            allowNull: false,
            comment: 'Statement file format',
        },
        fileName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Original file name',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('imported', 'processing', 'reconciled', 'archived'),
            allowNull: false,
            defaultValue: 'imported',
            comment: 'Statement status',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'bank_statements',
        indexes: [
            {
                unique: true,
                fields: ['bank_account_id', 'statement_number'],
                name: 'idx_bank_statements_unique',
            },
            {
                fields: ['bank_account_id', 'statement_date'],
                name: 'idx_bank_statements_account_date',
            },
            {
                fields: ['status'],
                name: 'idx_bank_statements_status',
            },
            {
                fields: ['import_date'],
                name: 'idx_bank_statements_import_date',
            },
        ],
    });
    return BankStatement;
};
exports.createBankStatementModel = createBankStatementModel;
/**
 * Sequelize model for Bank Statement Lines (individual transactions).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankStatementLine model
 */
const createBankStatementLineModel = (sequelize) => {
    class BankStatementLine extends sequelize_1.Model {
    }
    BankStatementLine.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        statementId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Statement foreign key',
            references: {
                model: 'bank_statements',
                key: 'id',
            },
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account foreign key',
        },
        transactionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Transaction date',
        },
        valueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Value/effective date',
        },
        transactionType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Transaction type (debit, credit, fee, interest)',
        },
        transactionCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'BAI2 or bank-specific code',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Transaction description',
        },
        referenceNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Bank reference number',
        },
        checkNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Check number if applicable',
        },
        debitAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Debit amount',
        },
        creditAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credit amount',
        },
        balance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Running balance after transaction',
        },
        isMatched: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether matched to GL',
        },
        matchedGlTransactionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Matched GL transaction ID',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional transaction metadata',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'bank_statement_lines',
        updatedAt: false,
        indexes: [
            {
                fields: ['statement_id'],
                name: 'idx_bank_statement_lines_statement',
            },
            {
                fields: ['bank_account_id', 'transaction_date', 'debit_amount', 'credit_amount'],
                name: 'idx_bank_statement_lines_matching',
            },
            {
                fields: ['check_number'],
                where: { check_number: { [sequelize_1.Op.ne]: null } },
                name: 'idx_bank_statement_lines_check',
            },
            {
                fields: ['is_matched'],
                where: { is_matched: false },
                name: 'idx_bank_statement_lines_unmatched',
            },
            {
                fields: ['reference_number'],
                name: 'idx_bank_statement_lines_reference',
            },
        ],
    });
    return BankStatementLine;
};
exports.createBankStatementLineModel = createBankStatementLineModel;
/**
 * Sequelize model for Bank Reconciliation Headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankReconciliationHeader model
 */
const createBankReconciliationHeaderModel = (sequelize) => {
    class BankReconciliationHeader extends sequelize_1.Model {
    }
    BankReconciliationHeader.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account foreign key',
            references: {
                model: 'bank_accounts',
                key: 'id',
            },
        },
        statementId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank statement foreign key',
            references: {
                model: 'bank_statements',
                key: 'id',
            },
        },
        reconciliationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Reconciliation date',
        },
        reconciliationType: {
            type: sequelize_1.DataTypes.ENUM('manual', 'automated', 'hybrid'),
            allowNull: false,
            comment: 'Reconciliation approach',
        },
        fiscalYear: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal year',
        },
        fiscalPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Fiscal period',
        },
        statementBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Bank statement ending balance',
        },
        glBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'GL account balance',
        },
        variance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Variance amount',
        },
        matchedCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of matched items',
        },
        unmatchedBankCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Unmatched bank transactions',
        },
        unmatchedGlCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Unmatched GL transactions',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'in_progress', 'balanced', 'approved', 'posted'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Reconciliation status',
        },
        reconciledBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User performing reconciliation',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Approver',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'bank_reconciliation_headers',
        indexes: [
            {
                fields: ['bank_account_id', 'reconciliation_date'],
                name: 'idx_bank_reconciliation_headers_account_date',
            },
            {
                fields: ['statement_id'],
                name: 'idx_bank_reconciliation_headers_statement',
            },
            {
                fields: ['status'],
                name: 'idx_bank_reconciliation_headers_status',
            },
            {
                fields: ['fiscal_year', 'fiscal_period'],
                name: 'idx_bank_reconciliation_headers_period',
            },
        ],
    });
    return BankReconciliationHeader;
};
exports.createBankReconciliationHeaderModel = createBankReconciliationHeaderModel;
/**
 * Sequelize model for Bank Reconciliation Matches.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankReconciliationMatch model
 */
const createBankReconciliationMatchModel = (sequelize) => {
    class BankReconciliationMatch extends sequelize_1.Model {
    }
    BankReconciliationMatch.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        reconciliationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reconciliation header foreign key',
            references: {
                model: 'bank_reconciliation_headers',
                key: 'id',
            },
        },
        statementLineId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank statement line foreign key',
            references: {
                model: 'bank_statement_lines',
                key: 'id',
            },
        },
        glTransactionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'GL transaction foreign key',
        },
        matchType: {
            type: sequelize_1.DataTypes.ENUM('exact', 'rule_based', 'manual', 'group'),
            allowNull: false,
            comment: 'Match method',
        },
        matchConfidence: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Match confidence score (0-100)',
            validate: {
                min: 0,
                max: 100,
            },
        },
        matchDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
            comment: 'Match timestamp',
        },
        matchedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who matched',
        },
        isCleared: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether cleared',
        },
        clearedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Cleared timestamp',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'bank_reconciliation_matches',
        updatedAt: false,
        indexes: [
            {
                fields: ['reconciliation_id', 'match_type'],
                name: 'idx_bank_reconciliation_matches_recon_type',
            },
            {
                fields: ['statement_line_id'],
                name: 'idx_bank_reconciliation_matches_statement',
            },
            {
                fields: ['gl_transaction_id'],
                name: 'idx_bank_reconciliation_matches_gl',
            },
            {
                fields: ['is_cleared'],
                where: { is_cleared: false },
                name: 'idx_bank_reconciliation_matches_uncleared',
            },
        ],
    });
    return BankReconciliationMatch;
};
exports.createBankReconciliationMatchModel = createBankReconciliationMatchModel;
/**
 * Sequelize model for Outstanding Checks register.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OutstandingCheck model
 */
const createOutstandingCheckModel = (sequelize) => {
    class OutstandingCheck extends sequelize_1.Model {
    }
    OutstandingCheck.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account foreign key',
            references: {
                model: 'bank_accounts',
                key: 'id',
            },
        },
        checkNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Check number',
        },
        checkDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Check date',
        },
        payee: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Payee name',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Check amount',
            validate: {
                min: 0,
            },
        },
        glTransactionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'GL transaction foreign key',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('outstanding', 'cleared', 'void', 'stale'),
            allowNull: false,
            defaultValue: 'outstanding',
            comment: 'Check status',
        },
        clearedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date check cleared',
        },
        clearedStatementId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Statement where check cleared',
        },
        daysOutstanding: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Days since check date',
        },
        isStale: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Stale check flag (>180 days)',
        },
        voidReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Void reason if applicable',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'outstanding_checks',
        indexes: [
            {
                unique: true,
                fields: ['bank_account_id', 'check_number'],
                name: 'idx_outstanding_checks_unique',
            },
            {
                fields: ['bank_account_id', 'status'],
                name: 'idx_outstanding_checks_account_status',
            },
            {
                fields: ['check_date'],
                name: 'idx_outstanding_checks_date',
            },
            {
                fields: ['is_stale'],
                where: { is_stale: true },
                name: 'idx_outstanding_checks_stale',
            },
            {
                fields: ['gl_transaction_id'],
                name: 'idx_outstanding_checks_gl',
            },
        ],
    });
    return OutstandingCheck;
};
exports.createOutstandingCheckModel = createOutstandingCheckModel;
/**
 * Sequelize model for Outstanding Deposits (deposits in transit).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} OutstandingDeposit model
 */
const createOutstandingDepositModel = (sequelize) => {
    class OutstandingDeposit extends sequelize_1.Model {
    }
    OutstandingDeposit.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account foreign key',
            references: {
                model: 'bank_accounts',
                key: 'id',
            },
        },
        depositDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Deposit date',
        },
        depositAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Deposit amount',
            validate: {
                min: 0,
            },
        },
        depositType: {
            type: sequelize_1.DataTypes.ENUM('cash', 'check', 'wire', 'ach', 'other'),
            allowNull: false,
            comment: 'Deposit type',
        },
        glTransactionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'GL transaction foreign key',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('in_transit', 'cleared', 'returned'),
            allowNull: false,
            defaultValue: 'in_transit',
            comment: 'Deposit status',
        },
        clearedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date deposit cleared',
        },
        clearedStatementId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Statement where deposit cleared',
        },
        daysInTransit: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Days since deposit date',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'outstanding_deposits',
        indexes: [
            {
                fields: ['bank_account_id', 'status'],
                name: 'idx_outstanding_deposits_account_status',
            },
            {
                fields: ['deposit_date'],
                name: 'idx_outstanding_deposits_date',
            },
            {
                fields: ['gl_transaction_id'],
                name: 'idx_outstanding_deposits_gl',
            },
            {
                fields: ['days_in_transit'],
                name: 'idx_outstanding_deposits_days',
            },
        ],
    });
    return OutstandingDeposit;
};
exports.createOutstandingDepositModel = createOutstandingDepositModel;
/**
 * Sequelize model for Bank Feed Configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} BankFeedConfig model
 */
const createBankFeedConfigModel = (sequelize) => {
    class BankFeedConfig extends sequelize_1.Model {
    }
    BankFeedConfig.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account foreign key',
            references: {
                model: 'bank_accounts',
                key: 'id',
            },
        },
        feedProvider: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Bank feed provider (Plaid, Yodlee, etc.)',
        },
        feedType: {
            type: sequelize_1.DataTypes.ENUM('api', 'sftp', 'email', 'manual'),
            allowNull: false,
            comment: 'Feed integration type',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Feed active status',
        },
        apiEndpoint: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'API endpoint URL',
        },
        authType: {
            type: sequelize_1.DataTypes.ENUM('oauth2', 'api_key', 'basic', 'certificate'),
            allowNull: false,
            comment: 'Authentication type',
        },
        credentials: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Encrypted credentials',
        },
        schedule: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Sync schedule (cron format)',
        },
        lastSyncDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last successful sync',
        },
        nextSyncDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Next scheduled sync',
        },
        autoReconcile: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Auto-reconcile after import',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'bank_feed_configs',
        indexes: [
            {
                unique: true,
                fields: ['bank_account_id'],
                name: 'idx_bank_feed_configs_unique',
            },
            {
                fields: ['is_active', 'next_sync_date'],
                name: 'idx_bank_feed_configs_active_sync',
            },
            {
                fields: ['feed_provider'],
                name: 'idx_bank_feed_configs_provider',
            },
        ],
    });
    return BankFeedConfig;
};
exports.createBankFeedConfigModel = createBankFeedConfigModel;
/**
 * Sequelize model for Clearing Rules (automated matching).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ClearingRule model
 */
const createClearingRuleModel = (sequelize) => {
    class ClearingRule extends sequelize_1.Model {
    }
    ClearingRule.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ruleName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Rule descriptive name',
        },
        ruleType: {
            type: sequelize_1.DataTypes.ENUM('exact_match', 'amount_tolerance', 'date_range', 'pattern_match', 'group_match'),
            allowNull: false,
            comment: 'Rule matching strategy',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100,
            comment: 'Rule priority (higher first)',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Rule active status',
        },
        conditions: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Rule conditions JSON',
        },
        amountTolerance: {
            type: sequelize_1.DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.01,
            comment: 'Amount tolerance for matching',
        },
        dateRangeDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 3,
            comment: 'Date range window in days',
        },
        matchPattern: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Regex pattern for description matching',
        },
        autoApprove: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Auto-approve matches',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'clearing_rules',
        indexes: [
            {
                fields: ['is_active', 'priority'],
                name: 'idx_clearing_rules_active_priority',
            },
            {
                fields: ['rule_type'],
                name: 'idx_clearing_rules_type',
            },
        ],
    });
    return ClearingRule;
};
exports.createClearingRuleModel = createClearingRuleModel;
/**
 * Sequelize model for Cash Position snapshots.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashPosition model
 */
const createCashPositionModel = (sequelize) => {
    class CashPosition extends sequelize_1.Model {
    }
    CashPosition.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        positionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Position snapshot date',
        },
        totalCash: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total cash across all accounts',
        },
        availableCash: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Available cash (excluding holds)',
        },
        clearedBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Cleared balance',
        },
        outstandingChecks: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total outstanding checks',
        },
        depositsInTransit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total deposits in transit',
        },
        projectedBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Projected end-of-day balance',
        },
        accountBreakdown: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            comment: 'Per-account position breakdown',
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    }, {
        sequelize,
        tableName: 'cash_positions',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['position_date'],
                name: 'idx_cash_positions_unique_date',
            },
            {
                fields: ['created_at'],
                name: 'idx_cash_positions_created',
            },
        ],
    });
    return CashPosition;
};
exports.createCashPositionModel = createCashPositionModel;
// ============================================================================
// BANK ACCOUNT MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create a new bank account with GL mapping.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateBankAccountDto} accountData - Account creation data
 * @param {string} userId - User creating the account
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankAccount>} Created bank account
 *
 * @example
 * ```typescript
 * const account = await createBankAccount(sequelize, {
 *   accountNumber: '123456789',
 *   accountName: 'Operating Account',
 *   bankName: 'Chase Bank',
 *   bankCode: 'CHASE',
 *   routingNumber: '021000021',
 *   accountType: 'checking',
 *   currency: 'USD',
 *   glAccountCode: '1010-000'
 * }, 'user123');
 * ```
 */
async function createBankAccount(sequelize, accountData, userId, transaction) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    const account = await BankAccount.create({
        ...accountData,
        currentBalance: 0,
        availableBalance: 0,
        isActive: true,
        metadata: {},
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return account.toJSON();
}
/**
 * Get bank account by ID with current balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @returns {Promise<BankAccount | null>} Bank account or null
 */
async function getBankAccountById(sequelize, bankAccountId) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    const account = await BankAccount.findByPk(bankAccountId);
    return account ? account.toJSON() : null;
}
/**
 * Update bank account balances from latest statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {number} currentBalance - Updated current balance
 * @param {number} availableBalance - Updated available balance
 * @param {Date} statementDate - Statement date
 * @param {string} userId - User performing update
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function updateBankAccountBalance(sequelize, bankAccountId, currentBalance, availableBalance, statementDate, userId, transaction) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    await BankAccount.update({
        currentBalance,
        availableBalance,
        lastStatementDate: statementDate,
        updatedBy: userId,
    }, {
        where: { id: bankAccountId },
        transaction,
    });
}
/**
 * List all active bank accounts with summary information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {boolean} includeInactive - Include inactive accounts
 * @returns {Promise<BankAccount[]>} Array of bank accounts
 */
async function listBankAccounts(sequelize, includeInactive = false) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    const where = includeInactive ? {} : { isActive: true };
    const accounts = await BankAccount.findAll({
        where,
        order: [['accountName', 'ASC']],
    });
    return accounts.map(acc => acc.toJSON());
}
/**
 * Deactivate a bank account (soft delete).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {string} userId - User deactivating the account
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function deactivateBankAccount(sequelize, bankAccountId, userId, transaction) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    await BankAccount.update({
        isActive: false,
        updatedBy: userId,
    }, {
        where: { id: bankAccountId },
        transaction,
    });
}
// ============================================================================
// BANK STATEMENT IMPORT FUNCTIONS
// ============================================================================
/**
 * Parse BAI2 file format into structured transactions.
 *
 * @param {string} fileContent - BAI2 file content
 * @returns {Promise<BAI2ParseResult>} Parsed BAI2 data
 *
 * @example
 * ```typescript
 * const parseResult = await parseBAI2File(fileContent);
 * console.log(`Parsed ${parseResult.transactions.length} transactions`);
 * ```
 */
async function parseBAI2File(fileContent) {
    const lines = fileContent.split('\n');
    const result = {
        fileHeader: {},
        groupHeaders: [],
        accountIdentifiers: [],
        transactions: [],
        accountTrailers: [],
        groupTrailers: [],
        fileTrailer: {},
        parseErrors: [],
    };
    let currentAccountId = null;
    let transactionDate = new Date();
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed)
            continue;
        const recordCode = trimmed.substring(0, 2);
        const fields = trimmed.split(',');
        try {
            switch (recordCode) {
                case '01': // File Header
                    result.fileHeader = {
                        senderId: fields[1],
                        receiverId: fields[2],
                        fileCreationDate: fields[3],
                        fileCreationTime: fields[4],
                        fileIdNumber: fields[5],
                    };
                    break;
                case '02': // Group Header
                    result.groupHeaders.push({
                        ultimateReceiverId: fields[1],
                        originatorId: fields[2],
                        groupStatus: fields[3],
                        asOfDate: fields[4],
                        asOfTime: fields[5],
                    });
                    break;
                case '03': // Account Identifier
                    currentAccountId = fields[1];
                    result.accountIdentifiers.push({
                        customerAccountNumber: fields[1],
                        currencyCode: fields[2],
                        summaries: fields.slice(3),
                    });
                    break;
                case '16': // Transaction Detail
                    if (currentAccountId) {
                        const transactionCode = fields[1];
                        const amount = parseFloat(fields[2]) / 100; // BAI2 amounts in cents
                        const description = fields.slice(6).join(',');
                        result.transactions.push({
                            lineId: 0, // Will be set during import
                            statementId: 0, // Will be set during import
                            bankAccountId: 0, // Will be mapped during import
                            transactionDate: transactionDate,
                            valueDate: transactionDate,
                            transactionType: transactionCode.startsWith('4') ? 'debit' : 'credit',
                            transactionCode: transactionCode,
                            description: description,
                            referenceNumber: fields[4] || '',
                            checkNumber: fields[5] || null,
                            debitAmount: transactionCode.startsWith('4') ? amount : 0,
                            creditAmount: transactionCode.startsWith('4') ? 0 : amount,
                            balance: 0, // Will be calculated
                            isMatched: false,
                            matchedGlTransactionId: null,
                            metadata: {},
                        });
                    }
                    break;
                case '49': // Account Trailer
                    result.accountTrailers.push({
                        accountControlTotal: fields[1],
                        numberOfRecords: fields[2],
                    });
                    break;
                case '98': // Group Trailer
                    result.groupTrailers.push({
                        groupControlTotal: fields[1],
                        numberOfAccounts: fields[2],
                        numberOfRecords: fields[3],
                    });
                    break;
                case '99': // File Trailer
                    result.fileTrailer = {
                        fileControlTotal: fields[1],
                        numberOfGroups: fields[2],
                        numberOfRecords: fields[3],
                    };
                    break;
            }
        }
        catch (error) {
            result.parseErrors.push(`Line parse error: ${trimmed} - ${error}`);
        }
    }
    return result;
}
/**
 * Parse OFX (Open Financial Exchange) file format.
 *
 * @param {string} fileContent - OFX file content
 * @returns {Promise<BankStatementLine[]>} Parsed transactions
 */
async function parseOFXFile(fileContent) {
    const transactions = [];
    const transactionPattern = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    const matches = fileContent.matchAll(transactionPattern);
    for (const match of matches) {
        const transactionXml = match[1];
        const getTag = (tag) => {
            const regex = new RegExp(`<${tag}>([^<]*)`);
            const match = transactionXml.match(regex);
            return match ? match[1].trim() : '';
        };
        const trnType = getTag('TRNTYPE');
        const amount = parseFloat(getTag('TRNAMT'));
        transactions.push({
            lineId: 0,
            statementId: 0,
            bankAccountId: 0,
            transactionDate: new Date(getTag('DTPOSTED').substring(0, 8)),
            valueDate: new Date(getTag('DTPOSTED').substring(0, 8)),
            transactionType: amount >= 0 ? 'credit' : 'debit',
            transactionCode: trnType,
            description: getTag('NAME') || getTag('MEMO'),
            referenceNumber: getTag('FITID'),
            checkNumber: getTag('CHECKNUM') || null,
            debitAmount: amount < 0 ? Math.abs(amount) : 0,
            creditAmount: amount >= 0 ? amount : 0,
            balance: 0,
            isMatched: false,
            matchedGlTransactionId: null,
            metadata: {},
        });
    }
    return transactions;
}
/**
 * Import bank statement from file (supports BAI2, OFX, CSV).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ImportBankStatementDto} importData - Import request data
 * @param {string} userId - User importing statement
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankStatement>} Imported statement
 *
 * @example
 * ```typescript
 * const statement = await importBankStatement(sequelize, {
 *   bankAccountId: 1,
 *   fileFormat: 'BAI2',
 *   fileContent: fileContent,
 *   fileName: 'statement_2024_01.bai',
 *   autoReconcile: true
 * }, 'user123');
 * ```
 */
async function importBankStatement(sequelize, importData, userId, transaction) {
    const BankStatement = (0, exports.createBankStatementModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    let transactions;
    let openingBalance = 0;
    let closingBalance = 0;
    // Parse file based on format
    if (importData.fileFormat === 'BAI2') {
        const parseResult = await parseBAI2File(importData.fileContent);
        transactions = parseResult.transactions;
    }
    else if (importData.fileFormat === 'OFX' || importData.fileFormat === 'QFX') {
        transactions = await parseOFXFile(importData.fileContent);
    }
    else {
        throw new Error(`Unsupported file format: ${importData.fileFormat}`);
    }
    // Calculate balances
    const totalDebits = transactions.reduce((sum, t) => sum + t.debitAmount, 0);
    const totalCredits = transactions.reduce((sum, t) => sum + t.creditAmount, 0);
    closingBalance = openingBalance + totalCredits - totalDebits;
    // Create statement header
    const statement = await BankStatement.create({
        bankAccountId: importData.bankAccountId,
        statementNumber: `STMT-${Date.now()}`,
        statementDate: new Date(),
        openingBalance,
        closingBalance,
        totalDebits,
        totalCredits,
        lineCount: transactions.length,
        importDate: new Date(),
        importedBy: userId,
        fileFormat: importData.fileFormat,
        fileName: importData.fileName,
        status: 'imported',
    }, { transaction });
    // Create statement lines
    let runningBalance = openingBalance;
    for (const txn of transactions) {
        runningBalance += txn.creditAmount - txn.debitAmount;
        await BankStatementLine.create({
            ...txn,
            statementId: statement.id,
            bankAccountId: importData.bankAccountId,
            balance: runningBalance,
        }, { transaction });
    }
    return statement.toJSON();
}
/**
 * Get bank statement by ID with all lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} statementId - Statement ID
 * @returns {Promise<BankStatement & { lines: BankStatementLine[] } | null>} Statement with lines
 */
async function getBankStatementById(sequelize, statementId) {
    const BankStatement = (0, exports.createBankStatementModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    const statement = await BankStatement.findByPk(statementId);
    if (!statement)
        return null;
    const lines = await BankStatementLine.findAll({
        where: { statementId },
        order: [['transactionDate', 'ASC'], ['id', 'ASC']],
    });
    return {
        ...statement.toJSON(),
        lines: lines.map(l => l.toJSON()),
    };
}
/**
 * List bank statements for an account with date range filter.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Date} startDate - Start date filter
 * @param {Date} endDate - End date filter
 * @returns {Promise<BankStatement[]>} Array of statements
 */
async function listBankStatements(sequelize, bankAccountId, startDate, endDate) {
    const BankStatement = (0, exports.createBankStatementModel)(sequelize);
    const where = { bankAccountId };
    if (startDate || endDate) {
        where.statementDate = {};
        if (startDate)
            where.statementDate[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.statementDate[sequelize_1.Op.lte] = endDate;
    }
    const statements = await BankStatement.findAll({
        where,
        order: [['statementDate', 'DESC']],
    });
    return statements.map(s => s.toJSON());
}
/**
 * Delete bank statement and all associated lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} statementId - Statement ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function deleteBankStatement(sequelize, statementId, transaction) {
    const BankStatement = (0, exports.createBankStatementModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    // Delete lines first
    await BankStatementLine.destroy({
        where: { statementId },
        transaction,
    });
    // Delete statement
    await BankStatement.destroy({
        where: { id: statementId },
        transaction,
    });
}
/**
 * Get unmatched bank statement lines for reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Date} startDate - Start date filter
 * @param {Date} endDate - End date filter
 * @returns {Promise<BankStatementLine[]>} Unmatched transactions
 */
async function getUnmatchedBankTransactions(sequelize, bankAccountId, startDate, endDate) {
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    const where = {
        bankAccountId,
        isMatched: false,
    };
    if (startDate || endDate) {
        where.transactionDate = {};
        if (startDate)
            where.transactionDate[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.transactionDate[sequelize_1.Op.lte] = endDate;
    }
    const lines = await BankStatementLine.findAll({
        where,
        order: [['transactionDate', 'ASC'], ['debitAmount', 'DESC'], ['creditAmount', 'DESC']],
    });
    return lines.map(l => l.toJSON());
}
// ============================================================================
// BANK RECONCILIATION FUNCTIONS
// ============================================================================
/**
 * Create a new bank reconciliation session.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateReconciliationDto} reconData - Reconciliation data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationHeader>} Created reconciliation
 *
 * @example
 * ```typescript
 * const recon = await createBankReconciliation(sequelize, {
 *   bankAccountId: 1,
 *   statementId: 123,
 *   reconciliationDate: new Date('2024-01-31'),
 *   reconciliationType: 'automated',
 *   reconciledBy: 'user123'
 * });
 * ```
 */
async function createBankReconciliation(sequelize, reconData, transaction) {
    const BankReconciliationHeader = (0, exports.createBankReconciliationHeaderModel)(sequelize);
    const BankStatement = (0, exports.createBankStatementModel)(sequelize);
    // Get statement balance
    const statement = await BankStatement.findByPk(reconData.statementId);
    if (!statement) {
        throw new Error(`Bank statement ${reconData.statementId} not found`);
    }
    // Calculate fiscal period from date
    const reconciliationDate = new Date(reconData.reconciliationDate);
    const fiscalYear = reconciliationDate.getFullYear();
    const fiscalPeriod = reconciliationDate.getMonth() + 1;
    const recon = await BankReconciliationHeader.create({
        ...reconData,
        fiscalYear,
        fiscalPeriod,
        statementBalance: statement.closingBalance,
        glBalance: 0, // Will be calculated
        variance: 0,
        matchedCount: 0,
        unmatchedBankCount: 0,
        unmatchedGlCount: 0,
        status: 'draft',
        approvedBy: null,
        approvedAt: null,
    }, { transaction });
    return recon.toJSON();
}
/**
 * Match bank statement line to GL transaction (exact match).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {MatchTransactionDto} matchData - Match data
 * @param {string} userId - User performing match
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationMatch>} Created match
 */
async function matchBankTransactionToGL(sequelize, matchData, userId, transaction) {
    const BankReconciliationMatch = (0, exports.createBankReconciliationMatchModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    // Create match
    const match = await BankReconciliationMatch.create({
        ...matchData,
        matchDate: new Date(),
        matchedBy: userId,
        isCleared: true,
        clearedDate: new Date(),
    }, { transaction });
    // Update statement line
    await BankStatementLine.update({
        isMatched: true,
        matchedGlTransactionId: matchData.glTransactionId,
    }, {
        where: { id: matchData.statementLineId },
        transaction,
    });
    return match.toJSON();
}
/**
 * Automated reconciliation matching using clearing rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationMatch[]>} Array of auto-matched items
 *
 * @description
 * Applies clearing rules in priority order to automatically match bank
 * transactions to GL transactions. Uses amount tolerance, date range,
 * and pattern matching strategies.
 */
async function executeAutomatedReconciliation(sequelize, reconciliationId, transaction) {
    const BankReconciliationHeader = (0, exports.createBankReconciliationHeaderModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    const ClearingRule = (0, exports.createClearingRuleModel)(sequelize);
    const recon = await BankReconciliationHeader.findByPk(reconciliationId);
    if (!recon) {
        throw new Error(`Reconciliation ${reconciliationId} not found`);
    }
    // Get active clearing rules
    const rules = await ClearingRule.findAll({
        where: { isActive: true },
        order: [['priority', 'DESC']],
    });
    // Get unmatched bank transactions
    const unmatchedBankTxns = await BankStatementLine.findAll({
        where: {
            statementId: recon.statementId,
            isMatched: false,
        },
    });
    const matches = [];
    // Apply each rule
    for (const rule of rules) {
        for (const bankTxn of unmatchedBankTxns) {
            if (bankTxn.isMatched)
                continue;
            // TODO: Implement GL transaction matching logic based on rule type
            // This would query GL transactions and apply rule conditions
            // Example exact match logic (simplified):
            if (rule.ruleType === 'exact_match') {
                // Find GL transaction with exact amount and date within range
                // Create match if found
            }
        }
    }
    return matches;
}
/**
 * Calculate reconciliation variance and update status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankReconciliationHeader>} Updated reconciliation
 */
async function calculateReconciliationVariance(sequelize, reconciliationId, transaction) {
    const BankReconciliationHeader = (0, exports.createBankReconciliationHeaderModel)(sequelize);
    const BankReconciliationMatch = (0, exports.createBankReconciliationMatchModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    const recon = await BankReconciliationHeader.findByPk(reconciliationId);
    if (!recon) {
        throw new Error(`Reconciliation ${reconciliationId} not found`);
    }
    // Count matches
    const matchedCount = await BankReconciliationMatch.count({
        where: { reconciliationId },
    });
    // Count unmatched bank transactions
    const unmatchedBankCount = await BankStatementLine.count({
        where: {
            statementId: recon.statementId,
            isMatched: false,
        },
    });
    // Calculate variance
    const variance = recon.statementBalance - recon.glBalance;
    // Update reconciliation
    await BankReconciliationHeader.update({
        matchedCount,
        unmatchedBankCount,
        variance,
        status: Math.abs(variance) < 0.01 ? 'balanced' : 'in_progress',
    }, {
        where: { id: reconciliationId },
        transaction,
    });
    const updated = await BankReconciliationHeader.findByPk(reconciliationId);
    return updated.toJSON();
}
/**
 * Approve and post reconciliation to ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {string} approvedBy - User approving reconciliation
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function approveReconciliation(sequelize, reconciliationId, approvedBy, transaction) {
    const BankReconciliationHeader = (0, exports.createBankReconciliationHeaderModel)(sequelize);
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    const recon = await BankReconciliationHeader.findByPk(reconciliationId);
    if (!recon) {
        throw new Error(`Reconciliation ${reconciliationId} not found`);
    }
    if (recon.status !== 'balanced') {
        throw new Error('Cannot approve unbalanced reconciliation');
    }
    // Update reconciliation
    await BankReconciliationHeader.update({
        status: 'approved',
        approvedBy,
        approvedAt: new Date(),
    }, {
        where: { id: reconciliationId },
        transaction,
    });
    // Update bank account last reconciled date
    await BankAccount.update({
        lastReconciledDate: recon.reconciliationDate,
    }, {
        where: { id: recon.bankAccountId },
        transaction,
    });
}
/**
 * Get reconciliation summary dashboard.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID (optional, all if not provided)
 * @returns {Promise<ReconciliationDashboard[]>} Dashboard data
 */
async function getReconciliationDashboard(sequelize, bankAccountId) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    const OutstandingCheck = (0, exports.createOutstandingCheckModel)(sequelize);
    const OutstandingDeposit = (0, exports.createOutstandingDepositModel)(sequelize);
    const where = bankAccountId ? { id: bankAccountId } : {};
    const accounts = await BankAccount.findAll({ where, raw: true });
    const dashboard = [];
    for (const account of accounts) {
        // Count unreconciled transactions
        const unreconciledCount = await BankStatementLine.count({
            where: {
                bankAccountId: account.id,
                isMatched: false,
            },
        });
        // Sum unreconciled amounts
        const unreconciledAmount = await BankStatementLine.sum('creditAmount', {
            where: {
                bankAccountId: account.id,
                isMatched: false,
            },
        });
        // Outstanding checks
        const outstandingChecksCount = await OutstandingCheck.count({
            where: {
                bankAccountId: account.id,
                status: 'outstanding',
            },
        });
        const outstandingChecksAmount = await OutstandingCheck.sum('amount', {
            where: {
                bankAccountId: account.id,
                status: 'outstanding',
            },
        });
        // Deposits in transit
        const depositsInTransitCount = await OutstandingDeposit.count({
            where: {
                bankAccountId: account.id,
                status: 'in_transit',
            },
        });
        const depositsInTransitAmount = await OutstandingDeposit.sum('depositAmount', {
            where: {
                bankAccountId: account.id,
                status: 'in_transit',
            },
        });
        // Days since last reconciliation
        const daysOutstanding = account.lastReconciledDate
            ? Math.floor((Date.now() - new Date(account.lastReconciledDate).getTime()) / (1000 * 60 * 60 * 24))
            : 999;
        dashboard.push({
            bankAccountId: account.id,
            accountName: account.accountName,
            lastReconciledDate: account.lastReconciledDate,
            daysOutstanding,
            unreconciledCount,
            unreconciledAmount: unreconciledAmount || 0,
            outstandingChecksCount,
            outstandingChecksAmount: outstandingChecksAmount || 0,
            depositsInTransitCount,
            depositsInTransitAmount: depositsInTransitAmount || 0,
            varianceAmount: 0, // Would calculate from latest reconciliation
            status: daysOutstanding > 30 ? 'overdue' : daysOutstanding > 60 ? 'critical' : 'current',
        });
    }
    return dashboard;
}
/**
 * Unmatch a previously matched transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} matchId - Match ID to unmatch
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function unmatchBankTransaction(sequelize, matchId, transaction) {
    const BankReconciliationMatch = (0, exports.createBankReconciliationMatchModel)(sequelize);
    const BankStatementLine = (0, exports.createBankStatementLineModel)(sequelize);
    const match = await BankReconciliationMatch.findByPk(matchId);
    if (!match) {
        throw new Error(`Match ${matchId} not found`);
    }
    // Update statement line
    await BankStatementLine.update({
        isMatched: false,
        matchedGlTransactionId: null,
    }, {
        where: { id: match.statementLineId },
        transaction,
    });
    // Delete match
    await BankReconciliationMatch.destroy({
        where: { id: matchId },
        transaction,
    });
}
// ============================================================================
// CASH POSITIONING FUNCTIONS
// ============================================================================
/**
 * Calculate current cash position across all accounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CashPositionRequestDto} request - Position request
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<CashPosition>} Cash position snapshot
 *
 * @example
 * ```typescript
 * const position = await calculateCashPosition(sequelize, {
 *   positionDate: new Date(),
 *   bankAccountIds: [1, 2, 3],
 *   includeProjections: true
 * });
 * console.log(`Total cash: $${position.totalCash}`);
 * ```
 */
async function calculateCashPosition(sequelize, request, transaction) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    const OutstandingCheck = (0, exports.createOutstandingCheckModel)(sequelize);
    const OutstandingDeposit = (0, exports.createOutstandingDepositModel)(sequelize);
    const CashPosition = (0, exports.createCashPositionModel)(sequelize);
    const accountWhere = request.bankAccountIds
        ? { id: { [sequelize_1.Op.in]: request.bankAccountIds } }
        : { isActive: true };
    const accounts = await BankAccount.findAll({ where: accountWhere });
    let totalCash = 0;
    let availableCash = 0;
    let clearedBalance = 0;
    let outstandingChecks = 0;
    let depositsInTransit = 0;
    const accountBreakdown = [];
    for (const account of accounts) {
        const accountOutstandingChecks = await OutstandingCheck.sum('amount', {
            where: {
                bankAccountId: account.id,
                status: 'outstanding',
            },
        });
        const accountDepositsInTransit = await OutstandingDeposit.sum('depositAmount', {
            where: {
                bankAccountId: account.id,
                status: 'in_transit',
            },
        });
        totalCash += account.currentBalance;
        availableCash += account.availableBalance;
        clearedBalance += account.currentBalance;
        outstandingChecks += accountOutstandingChecks || 0;
        depositsInTransit += accountDepositsInTransit || 0;
        accountBreakdown.push({
            bankAccountId: account.id,
            accountName: account.accountName,
            currentBalance: account.currentBalance,
            availableBalance: account.availableBalance,
            outstandingChecks: accountOutstandingChecks || 0,
            depositsInTransit: accountDepositsInTransit || 0,
        });
    }
    const projectedBalance = totalCash - outstandingChecks + depositsInTransit;
    // Save position snapshot
    const position = await CashPosition.create({
        positionDate: request.positionDate,
        totalCash,
        availableCash,
        clearedBalance,
        outstandingChecks,
        depositsInTransit,
        projectedBalance,
        accountBreakdown: accountBreakdown,
    }, { transaction });
    return position.toJSON();
}
/**
 * Get cash position history for trending analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<CashPosition[]>} Historical cash positions
 */
async function getCashPositionHistory(sequelize, startDate, endDate) {
    const CashPosition = (0, exports.createCashPositionModel)(sequelize);
    const positions = await CashPosition.findAll({
        where: {
            positionDate: {
                [sequelize_1.Op.gte]: startDate,
                [sequelize_1.Op.lte]: endDate,
            },
        },
        order: [['positionDate', 'ASC']],
    });
    return positions.map(p => p.toJSON());
}
/**
 * Project future cash position based on outstanding items.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysForward - Number of days to project
 * @returns {Promise<{ projectedDate: Date; projectedBalance: number }[]>} Projections
 */
async function projectCashPosition(sequelize, daysForward) {
    const BankAccount = (0, exports.createBankAccountModel)(sequelize);
    // Get total current balance
    const totalCash = await BankAccount.sum('currentBalance', {
        where: { isActive: true },
    });
    // TODO: Implement projection logic based on:
    // - Expected check clearings (average days outstanding)
    // - Expected deposit clearings (average days in transit)
    // - Recurring transactions (scheduled payments/receipts)
    const projections = [];
    for (let day = 1; day <= daysForward; day++) {
        const projectedDate = new Date();
        projectedDate.setDate(projectedDate.getDate() + day);
        projections.push({
            projectedDate,
            projectedBalance: totalCash, // Simplified - would adjust based on expected changes
        });
    }
    return projections;
}
// ============================================================================
// OUTSTANDING ITEMS FUNCTIONS
// ============================================================================
/**
 * Create outstanding check record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingCheck} checkData - Check data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<OutstandingCheck>} Created outstanding check
 */
async function createOutstandingCheck(sequelize, checkData, transaction) {
    const OutstandingCheck = (0, exports.createOutstandingCheckModel)(sequelize);
    const check = await OutstandingCheck.create({
        ...checkData,
        status: 'outstanding',
        clearedDate: null,
        clearedStatementId: null,
        daysOutstanding: 0,
        isStale: false,
        voidReason: null,
    }, { transaction });
    return check.toJSON();
}
/**
 * Clear outstanding check (mark as cleared).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checkId - Outstanding check ID
 * @param {number} statementId - Statement where check cleared
 * @param {Date} clearedDate - Cleared date
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function clearOutstandingCheck(sequelize, checkId, statementId, clearedDate, transaction) {
    const OutstandingCheck = (0, exports.createOutstandingCheckModel)(sequelize);
    await OutstandingCheck.update({
        status: 'cleared',
        clearedDate,
        clearedStatementId: statementId,
    }, {
        where: { id: checkId },
        transaction,
    });
}
/**
 * Get outstanding checks for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingItemsRequestDto} request - Request parameters
 * @returns {Promise<OutstandingCheck[]>} Outstanding checks
 */
async function getOutstandingChecks(sequelize, request) {
    const OutstandingCheck = (0, exports.createOutstandingCheckModel)(sequelize);
    const where = {
        bankAccountId: request.bankAccountId,
        status: request.includeStale ? { [sequelize_1.Op.in]: ['outstanding', 'stale'] } : 'outstanding',
    };
    if (request.asOfDate) {
        where.checkDate = { [sequelize_1.Op.lte]: request.asOfDate };
    }
    const checks = await OutstandingCheck.findAll({
        where,
        order: [['checkDate', 'ASC']],
    });
    return checks.map(c => c.toJSON());
}
/**
 * Mark checks as stale (>180 days outstanding).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<number>} Number of checks marked stale
 */
async function markStaleChecks(sequelize, transaction) {
    const OutstandingCheck = (0, exports.createOutstandingCheckModel)(sequelize);
    const staleDateThreshold = new Date();
    staleDateThreshold.setDate(staleDateThreshold.getDate() - 180);
    const [updatedCount] = await OutstandingCheck.update({
        status: 'stale',
        isStale: true,
    }, {
        where: {
            status: 'outstanding',
            checkDate: { [sequelize_1.Op.lt]: staleDateThreshold },
        },
        transaction,
    });
    return updatedCount;
}
/**
 * Void an outstanding check.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} checkId - Outstanding check ID
 * @param {string} voidReason - Reason for voiding
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function voidOutstandingCheck(sequelize, checkId, voidReason, transaction) {
    const OutstandingCheck = (0, exports.createOutstandingCheckModel)(sequelize);
    await OutstandingCheck.update({
        status: 'void',
        voidReason,
    }, {
        where: { id: checkId },
        transaction,
    });
}
/**
 * Create outstanding deposit (deposit in transit).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingDeposit} depositData - Deposit data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<OutstandingDeposit>} Created deposit
 */
async function createOutstandingDeposit(sequelize, depositData, transaction) {
    const OutstandingDeposit = (0, exports.createOutstandingDepositModel)(sequelize);
    const deposit = await OutstandingDeposit.create({
        ...depositData,
        status: 'in_transit',
        clearedDate: null,
        clearedStatementId: null,
        daysInTransit: 0,
    }, { transaction });
    return deposit.toJSON();
}
/**
 * Clear outstanding deposit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} depositId - Deposit ID
 * @param {number} statementId - Statement where deposit cleared
 * @param {Date} clearedDate - Cleared date
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function clearOutstandingDeposit(sequelize, depositId, statementId, clearedDate, transaction) {
    const OutstandingDeposit = (0, exports.createOutstandingDepositModel)(sequelize);
    await OutstandingDeposit.update({
        status: 'cleared',
        clearedDate,
        clearedStatementId: statementId,
    }, {
        where: { id: depositId },
        transaction,
    });
}
/**
 * Get deposits in transit for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {OutstandingItemsRequestDto} request - Request parameters
 * @returns {Promise<OutstandingDeposit[]>} Deposits in transit
 */
async function getDepositsInTransit(sequelize, request) {
    const OutstandingDeposit = (0, exports.createOutstandingDepositModel)(sequelize);
    const where = {
        bankAccountId: request.bankAccountId,
        status: 'in_transit',
    };
    if (request.asOfDate) {
        where.depositDate = { [sequelize_1.Op.lte]: request.asOfDate };
    }
    const deposits = await OutstandingDeposit.findAll({
        where,
        order: [['depositDate', 'ASC']],
    });
    return deposits.map(d => d.toJSON());
}
// ============================================================================
// AUTOMATED CLEARING FUNCTIONS
// ============================================================================
/**
 * Create automated clearing rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateClearingRuleDto} ruleData - Rule data
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<ClearingRule>} Created rule
 */
async function createClearingRule(sequelize, ruleData, transaction) {
    const ClearingRule = (0, exports.createClearingRuleModel)(sequelize);
    const rule = await ClearingRule.create({
        ...ruleData,
        isActive: true,
        conditions: {},
        matchPattern: null,
    }, { transaction });
    return rule.toJSON();
}
/**
 * Update clearing rule configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} ruleId - Rule ID
 * @param {Partial<ClearingRule>} updates - Rule updates
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function updateClearingRule(sequelize, ruleId, updates, transaction) {
    const ClearingRule = (0, exports.createClearingRuleModel)(sequelize);
    await ClearingRule.update(updates, {
        where: { id: ruleId },
        transaction,
    });
}
/**
 * Get all clearing rules ordered by priority.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {boolean} activeOnly - Only active rules
 * @returns {Promise<ClearingRule[]>} Clearing rules
 */
async function getClearingRules(sequelize, activeOnly = true) {
    const ClearingRule = (0, exports.createClearingRuleModel)(sequelize);
    const where = activeOnly ? { isActive: true } : {};
    const rules = await ClearingRule.findAll({
        where,
        order: [['priority', 'DESC']],
    });
    return rules.map(r => r.toJSON());
}
/**
 * Deactivate clearing rule.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} ruleId - Rule ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function deactivateClearingRule(sequelize, ruleId, transaction) {
    const ClearingRule = (0, exports.createClearingRuleModel)(sequelize);
    await ClearingRule.update({ isActive: false }, {
        where: { id: ruleId },
        transaction,
    });
}
// ============================================================================
// BANK FEED INTEGRATION FUNCTIONS
// ============================================================================
/**
 * Configure bank feed for automated statement import.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BankFeedConfig} feedConfig - Feed configuration
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankFeedConfig>} Created feed config
 */
async function configureBankFeed(sequelize, feedConfig, transaction) {
    const BankFeedConfig = (0, exports.createBankFeedConfigModel)(sequelize);
    const config = await BankFeedConfig.create({
        ...feedConfig,
        isActive: true,
        lastSyncDate: null,
        nextSyncDate: new Date(), // Schedule first sync
    }, { transaction });
    return config.toJSON();
}
/**
 * Execute bank feed sync (import latest statement).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} feedConfigId - Feed config ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<BankStatement | null>} Imported statement or null
 */
async function executeBankFeedSync(sequelize, feedConfigId, transaction) {
    const BankFeedConfig = (0, exports.createBankFeedConfigModel)(sequelize);
    const config = await BankFeedConfig.findByPk(feedConfigId);
    if (!config || !config.isActive) {
        return null;
    }
    // TODO: Implement actual bank feed API integration
    // - Call bank API using credentials
    // - Download statement data
    // - Import using importBankStatement function
    // Update sync dates
    await BankFeedConfig.update({
        lastSyncDate: new Date(),
        nextSyncDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
    }, {
        where: { id: feedConfigId },
        transaction,
    });
    return null; // Would return imported statement
}
/**
 * Get bank feed configuration by account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @returns {Promise<BankFeedConfig | null>} Feed config or null
 */
async function getBankFeedConfig(sequelize, bankAccountId) {
    const BankFeedConfig = (0, exports.createBankFeedConfigModel)(sequelize);
    const config = await BankFeedConfig.findOne({
        where: { bankAccountId },
    });
    return config ? config.toJSON() : null;
}
/**
 * Disable bank feed for an account.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} feedConfigId - Feed config ID
 * @param {Transaction} transaction - Optional Sequelize transaction
 * @returns {Promise<void>}
 */
async function disableBankFeed(sequelize, feedConfigId, transaction) {
    const BankFeedConfig = (0, exports.createBankFeedConfigModel)(sequelize);
    await BankFeedConfig.update({ isActive: false }, {
        where: { id: feedConfigId },
        transaction,
    });
}
//# sourceMappingURL=banking-reconciliation-kit.js.map