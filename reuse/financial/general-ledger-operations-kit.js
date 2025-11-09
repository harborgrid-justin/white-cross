"use strict";
/**
 * LOC: GENLEDG001
 * File: /reuse/financial/general-ledger-operations-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./financial-accounts-management-kit (Account operations)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Journal entry services
 *   - Financial reporting modules
 *   - Period close processes
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
exports.formatJournalEntryNumber = exports.reconcileGLToSubLedger = exports.validateAccountCoding = exports.createAuditTrail = exports.getFiscalYearPeriod = exports.processAutomaticReversingEntries = exports.createYearEndClosingEntries = exports.lockPeriod = exports.isPeriodOpen = exports.reopenPeriod = exports.completePeriodClose = exports.validatePeriodCloseReadiness = exports.getPeriodCloseStatus = exports.initiatePeriodClose = exports.generateIncomeStatement = exports.generateBalanceSheet = exports.generateFinancialStatement = exports.exportTrialBalanceToCSV = exports.generateAccountActivitySummary = exports.generateGLDetailReport = exports.validateTrialBalance = exports.generatePostClosingTrialBalance = exports.generateAdjustedTrialBalance = exports.generateTrialBalance = exports.unpostJournalEntry = exports.validatePostingBatch = exports.createReclassificationEntry = exports.createClosingEntry = exports.createAdjustingEntry = exports.reverseJournalEntry = exports.updateAccountBalanceForPosting = exports.batchPostJournalEntries = exports.postJournalEntry = exports.searchJournalEntries = exports.getJournalEntryWithLines = exports.generateJournalEntryNumber = exports.rejectJournalEntry = exports.approveJournalEntry = exports.validateJournalEntry = exports.deleteJournalEntry = exports.updateJournalEntry = exports.createJournalEntry = exports.createJournalEntryLineModel = exports.createJournalEntryHeaderModel = exports.TrialBalanceRequestDto = exports.PostJournalEntryDto = exports.CreateJournalEntryDto = void 0;
/**
 * File: /reuse/financial/general-ledger-operations-kit.ts
 * Locator: WC-FIN-GENLEDG-001
 * Purpose: Comprehensive General Ledger Operations - USACE CEFMS-level journal entries, posting, trial balance, reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, financial-accounts-management-kit
 * Downstream: ../backend/financial/*, Journal Entry Services, Financial Reporting, Period Close
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for journal entries, posting, trial balance, account coding, ledger reconciliation, period close, financial reporting
 *
 * LLM Context: Enterprise-grade general ledger operations for USACE CEFMS compliance.
 * Provides comprehensive journal entry management, automated posting, trial balance generation, account coding validation,
 * ledger reconciliation, period close workflows, adjusting entries, reversing entries, batch processing,
 * audit trails, financial reporting, and multi-currency support.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateJournalEntryDto = (() => {
    var _a;
    let _entryDate_decorators;
    let _entryDate_initializers = [];
    let _entryDate_extraInitializers = [];
    let _postingDate_decorators;
    let _postingDate_initializers = [];
    let _postingDate_extraInitializers = [];
    let _entryType_decorators;
    let _entryType_initializers = [];
    let _entryType_extraInitializers = [];
    let _source_decorators;
    let _source_initializers = [];
    let _source_extraInitializers = [];
    let _reference_decorators;
    let _reference_initializers = [];
    let _reference_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    return _a = class CreateJournalEntryDto {
            constructor() {
                this.entryDate = __runInitializers(this, _entryDate_initializers, void 0);
                this.postingDate = (__runInitializers(this, _entryDate_extraInitializers), __runInitializers(this, _postingDate_initializers, void 0));
                this.entryType = (__runInitializers(this, _postingDate_extraInitializers), __runInitializers(this, _entryType_initializers, void 0));
                this.source = (__runInitializers(this, _entryType_extraInitializers), __runInitializers(this, _source_initializers, void 0));
                this.reference = (__runInitializers(this, _source_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
                this.description = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.lines = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
                __runInitializers(this, _lines_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _entryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entry date', example: '2024-01-15' })];
            _postingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Posting date', example: '2024-01-15' })];
            _entryType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entry type', enum: ['standard', 'adjusting', 'closing', 'reversing'] })];
            _source_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source system', example: 'AP' })];
            _reference_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reference number', example: 'INV-12345' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entry description' })];
            _lines_decorators = [(0, swagger_1.ApiProperty)({ description: 'Journal entry lines', type: [Object] })];
            __esDecorate(null, null, _entryDate_decorators, { kind: "field", name: "entryDate", static: false, private: false, access: { has: obj => "entryDate" in obj, get: obj => obj.entryDate, set: (obj, value) => { obj.entryDate = value; } }, metadata: _metadata }, _entryDate_initializers, _entryDate_extraInitializers);
            __esDecorate(null, null, _postingDate_decorators, { kind: "field", name: "postingDate", static: false, private: false, access: { has: obj => "postingDate" in obj, get: obj => obj.postingDate, set: (obj, value) => { obj.postingDate = value; } }, metadata: _metadata }, _postingDate_initializers, _postingDate_extraInitializers);
            __esDecorate(null, null, _entryType_decorators, { kind: "field", name: "entryType", static: false, private: false, access: { has: obj => "entryType" in obj, get: obj => obj.entryType, set: (obj, value) => { obj.entryType = value; } }, metadata: _metadata }, _entryType_initializers, _entryType_extraInitializers);
            __esDecorate(null, null, _source_decorators, { kind: "field", name: "source", static: false, private: false, access: { has: obj => "source" in obj, get: obj => obj.source, set: (obj, value) => { obj.source = value; } }, metadata: _metadata }, _source_initializers, _source_extraInitializers);
            __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: obj => "reference" in obj, get: obj => obj.reference, set: (obj, value) => { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateJournalEntryDto = CreateJournalEntryDto;
let PostJournalEntryDto = (() => {
    var _a;
    let _journalEntryId_decorators;
    let _journalEntryId_initializers = [];
    let _journalEntryId_extraInitializers = [];
    let _postingDate_decorators;
    let _postingDate_initializers = [];
    let _postingDate_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    return _a = class PostJournalEntryDto {
            constructor() {
                this.journalEntryId = __runInitializers(this, _journalEntryId_initializers, void 0);
                this.postingDate = (__runInitializers(this, _journalEntryId_extraInitializers), __runInitializers(this, _postingDate_initializers, void 0));
                this.userId = (__runInitializers(this, _postingDate_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                __runInitializers(this, _userId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _journalEntryId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Journal entry ID' })];
            _postingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Posting date' })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User posting the entry' })];
            __esDecorate(null, null, _journalEntryId_decorators, { kind: "field", name: "journalEntryId", static: false, private: false, access: { has: obj => "journalEntryId" in obj, get: obj => obj.journalEntryId, set: (obj, value) => { obj.journalEntryId = value; } }, metadata: _metadata }, _journalEntryId_initializers, _journalEntryId_extraInitializers);
            __esDecorate(null, null, _postingDate_decorators, { kind: "field", name: "postingDate", static: false, private: false, access: { has: obj => "postingDate" in obj, get: obj => obj.postingDate, set: (obj, value) => { obj.postingDate = value; } }, metadata: _metadata }, _postingDate_initializers, _postingDate_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PostJournalEntryDto = PostJournalEntryDto;
let TrialBalanceRequestDto = (() => {
    var _a;
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _includeZeroBalances_decorators;
    let _includeZeroBalances_initializers = [];
    let _includeZeroBalances_extraInitializers = [];
    let _accountType_decorators;
    let _accountType_initializers = [];
    let _accountType_extraInitializers = [];
    return _a = class TrialBalanceRequestDto {
            constructor() {
                this.fiscalYear = __runInitializers(this, _fiscalYear_initializers, void 0);
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.includeZeroBalances = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _includeZeroBalances_initializers, void 0));
                this.accountType = (__runInitializers(this, _includeZeroBalances_extraInitializers), __runInitializers(this, _accountType_initializers, void 0));
                __runInitializers(this, _accountType_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _includeZeroBalances_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include zero balances', default: false })];
            _accountType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Account type filter', required: false })];
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _includeZeroBalances_decorators, { kind: "field", name: "includeZeroBalances", static: false, private: false, access: { has: obj => "includeZeroBalances" in obj, get: obj => obj.includeZeroBalances, set: (obj, value) => { obj.includeZeroBalances = value; } }, metadata: _metadata }, _includeZeroBalances_initializers, _includeZeroBalances_extraInitializers);
            __esDecorate(null, null, _accountType_decorators, { kind: "field", name: "accountType", static: false, private: false, access: { has: obj => "accountType" in obj, get: obj => obj.accountType, set: (obj, value) => { obj.accountType = value; } }, metadata: _metadata }, _accountType_initializers, _accountType_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.TrialBalanceRequestDto = TrialBalanceRequestDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Journal Entry Headers with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} JournalEntryHeader model
 *
 * @example
 * ```typescript
 * const JournalEntry = createJournalEntryHeaderModel(sequelize);
 * const entry = await JournalEntry.create({
 *   entryNumber: 'JE-2024-001',
 *   entryDate: new Date(),
 *   entryType: 'standard',
 *   description: 'Payroll expenses',
 *   status: 'draft'
 * });
 * ```
 */
const createJournalEntryHeaderModel = (sequelize) => {
    class JournalEntryHeader extends sequelize_1.Model {
    }
    JournalEntryHeader.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        entryNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique journal entry number',
        },
        entryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Entry transaction date',
        },
        postingDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date to post to ledger',
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
            comment: 'Fiscal period (1-13)',
            validate: {
                min: 1,
                max: 13,
            },
        },
        entryType: {
            type: sequelize_1.DataTypes.ENUM('standard', 'adjusting', 'closing', 'reversing', 'reclassification'),
            allowNull: false,
            comment: 'Journal entry type',
        },
        source: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Source system (AP, AR, GL, etc.)',
        },
        reference: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Reference number from source',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Entry description',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending', 'approved', 'posted', 'reversed', 'rejected'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Entry status',
        },
        totalDebit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total debit amount',
        },
        totalCredit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total credit amount',
        },
        isBalanced: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether debits equal credits',
        },
        isReversing: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether entry should auto-reverse',
        },
        reversalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date to reverse entry',
        },
        originalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Original entry if this is a reversal',
            references: {
                model: 'journal_entry_headers',
                key: 'id',
            },
        },
        reversedEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reversal entry ID if reversed',
            references: {
                model: 'journal_entry_headers',
                key: 'id',
            },
        },
        batchId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Posting batch ID',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved entry',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        postedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who posted entry',
        },
        postedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Posting timestamp',
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
            comment: 'User who created the entry',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the entry',
        },
    }, {
        sequelize,
        tableName: 'journal_entry_headers',
        timestamps: true,
        indexes: [
            { fields: ['entryNumber'], unique: true },
            { fields: ['entryDate'] },
            { fields: ['postingDate'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['status'] },
            { fields: ['source'] },
            { fields: ['batchId'] },
        ],
        hooks: {
            beforeCreate: (entry) => {
                if (!entry.createdBy) {
                    throw new Error('createdBy is required');
                }
                entry.updatedBy = entry.createdBy;
            },
            beforeUpdate: (entry) => {
                if (!entry.updatedBy) {
                    throw new Error('updatedBy is required');
                }
            },
            beforeSave: (entry) => {
                // Validate balance
                const debit = Number(entry.totalDebit || 0);
                const credit = Number(entry.totalCredit || 0);
                entry.isBalanced = Math.abs(debit - credit) < 0.01;
            },
        },
    });
    return JournalEntryHeader;
};
exports.createJournalEntryHeaderModel = createJournalEntryHeaderModel;
/**
 * Sequelize model for Journal Entry Lines with account coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} JournalEntryLine model
 *
 * @example
 * ```typescript
 * const JournalEntryLine = createJournalEntryLineModel(sequelize);
 * const line = await JournalEntryLine.create({
 *   journalEntryId: 1,
 *   lineNumber: 1,
 *   accountId: 100,
 *   debitAmount: 5000,
 *   creditAmount: 0,
 *   description: 'Payroll expense'
 * });
 * ```
 */
const createJournalEntryLineModel = (sequelize) => {
    class JournalEntryLine extends sequelize_1.Model {
    }
    JournalEntryLine.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Reference to journal entry header',
            references: {
                model: 'journal_entry_headers',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        lineNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Line number within entry',
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
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account code (denormalized for performance)',
        },
        debitAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Debit amount',
            validate: {
                min: 0,
            },
        },
        creditAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Credit amount',
            validate: {
                min: 0,
            },
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Line item description',
        },
        dimensions: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Account dimensions (fund, org, program, etc.)',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Project code',
        },
        activityCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Activity code',
        },
        costCenterCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Cost center code',
        },
        fundCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Fund code',
        },
        organizationCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Organization code',
        },
        programCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Program code',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'journal_entry_lines',
        timestamps: true,
        indexes: [
            { fields: ['journalEntryId', 'lineNumber'], unique: true },
            { fields: ['accountId'] },
            { fields: ['accountCode'] },
            { fields: ['projectCode'] },
            { fields: ['costCenterCode'] },
        ],
        validate: {
            debitOrCreditRequired() {
                if (Number(this.debitAmount) === 0 && Number(this.creditAmount) === 0) {
                    throw new Error('Either debit or credit amount must be non-zero');
                }
                if (Number(this.debitAmount) > 0 && Number(this.creditAmount) > 0) {
                    throw new Error('Cannot have both debit and credit amounts');
                }
            },
        },
    });
    return JournalEntryLine;
};
exports.createJournalEntryLineModel = createJournalEntryLineModel;
// ============================================================================
// JOURNAL ENTRY CREATION AND MANAGEMENT (1-10)
// ============================================================================
/**
 * Creates a new journal entry with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateJournalEntryDto} entryData - Journal entry data
 * @param {string} userId - User creating the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created journal entry
 *
 * @example
 * ```typescript
 * const entry = await createJournalEntry(sequelize, {
 *   entryDate: new Date(),
 *   postingDate: new Date(),
 *   entryType: 'standard',
 *   source: 'GL',
 *   reference: 'REF-001',
 *   description: 'Payroll entry',
 *   lines: [...]
 * }, 'user123');
 * ```
 */
const createJournalEntry = async (sequelize, entryData, userId, transaction) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const JournalEntryLine = (0, exports.createJournalEntryLineModel)(sequelize);
    // Generate entry number
    const entryNumber = await (0, exports.generateJournalEntryNumber)(sequelize, entryData.source, transaction);
    // Determine fiscal year and period
    const { fiscalYear, fiscalPeriod } = (0, exports.getFiscalYearPeriod)(entryData.postingDate);
    // Validate period is open
    const isOpen = await (0, exports.isPeriodOpen)(sequelize, fiscalYear, fiscalPeriod);
    if (!isOpen) {
        throw new Error(`Fiscal period ${fiscalYear}-${fiscalPeriod} is closed`);
    }
    // Calculate totals
    let totalDebit = 0;
    let totalCredit = 0;
    for (const line of entryData.lines) {
        totalDebit += Number(line.debitAmount || 0);
        totalCredit += Number(line.creditAmount || 0);
    }
    // Validate balance
    if (Math.abs(totalDebit - totalCredit) >= 0.01) {
        throw new Error(`Journal entry is not balanced: Debits=${totalDebit}, Credits=${totalCredit}`);
    }
    // Create header
    const header = await JournalEntryHeader.create({
        entryNumber,
        entryDate: entryData.entryDate,
        postingDate: entryData.postingDate,
        fiscalYear,
        fiscalPeriod,
        entryType: entryData.entryType,
        source: entryData.source,
        reference: entryData.reference,
        description: entryData.description,
        status: 'draft',
        totalDebit,
        totalCredit,
        isBalanced: true,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    // Create lines
    for (let i = 0; i < entryData.lines.length; i++) {
        const lineData = entryData.lines[i];
        await JournalEntryLine.create({
            journalEntryId: header.id,
            lineNumber: i + 1,
            accountId: lineData.accountId,
            accountCode: lineData.accountCode,
            debitAmount: lineData.debitAmount || 0,
            creditAmount: lineData.creditAmount || 0,
            description: lineData.description,
            dimensions: lineData.dimensions || {},
            projectCode: lineData.projectCode,
            activityCode: lineData.activityCode,
            costCenterCode: lineData.costCenterCode,
        }, { transaction });
    }
    return header;
};
exports.createJournalEntry = createJournalEntry;
/**
 * Updates a journal entry (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {Partial<CreateJournalEntryDto>} updateData - Update data
 * @param {string} userId - User updating the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated journal entry
 *
 * @example
 * ```typescript
 * const updated = await updateJournalEntry(sequelize, 1, {
 *   description: 'Updated description'
 * }, 'user123');
 * ```
 */
const updateJournalEntry = async (sequelize, entryId, updateData, userId, transaction) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
    if (!entry) {
        throw new Error('Journal entry not found');
    }
    if (entry.status !== 'draft') {
        throw new Error('Cannot update journal entry that is not in draft status');
    }
    await entry.update({ ...updateData, updatedBy: userId }, { transaction });
    return entry;
};
exports.updateJournalEntry = updateJournalEntry;
/**
 * Deletes a journal entry (only if in draft status).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} userId - User deleting the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteJournalEntry(sequelize, 1, 'user123');
 * ```
 */
const deleteJournalEntry = async (sequelize, entryId, userId, transaction) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
    if (!entry) {
        throw new Error('Journal entry not found');
    }
    if (entry.status !== 'draft') {
        throw new Error('Cannot delete journal entry that is not in draft status');
    }
    await (0, exports.createAuditTrail)(sequelize, 'journal_entry_headers', entryId, 'DELETE', userId, {
        entryNumber: entry.entryNumber,
        description: entry.description,
    });
    await entry.destroy({ transaction });
};
exports.deleteJournalEntry = deleteJournalEntry;
/**
 * Validates journal entry before posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateJournalEntry(sequelize, 1);
 * if (!validation.valid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
const validateJournalEntry = async (sequelize, entryId) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const JournalEntryLine = (0, exports.createJournalEntryLineModel)(sequelize);
    const errors = [];
    const entry = await JournalEntryHeader.findByPk(entryId);
    if (!entry) {
        return { valid: false, errors: ['Journal entry not found'] };
    }
    // Check balance
    if (!entry.isBalanced) {
        errors.push('Entry is not balanced - debits must equal credits');
    }
    // Check period is open
    const isOpen = await (0, exports.isPeriodOpen)(sequelize, entry.fiscalYear, entry.fiscalPeriod);
    if (!isOpen) {
        errors.push(`Fiscal period ${entry.fiscalYear}-${entry.fiscalPeriod} is closed`);
    }
    // Check lines exist
    const lines = await JournalEntryLine.findAll({
        where: { journalEntryId: entryId },
    });
    if (lines.length === 0) {
        errors.push('Entry has no line items');
    }
    // Validate each line
    for (const line of lines) {
        // Check account exists and is active
        const account = await sequelize.query('SELECT * FROM chart_of_accounts WHERE id = ? AND is_active = true', {
            replacements: [line.accountId],
            type: 'SELECT',
        });
        if (!account || account.length === 0) {
            errors.push(`Account ${line.accountCode} is not active or does not exist`);
        }
    }
    return { valid: errors.length === 0, errors };
};
exports.validateJournalEntry = validateJournalEntry;
/**
 * Approves a journal entry for posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} userId - User approving the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await approveJournalEntry(sequelize, 1, 'manager123');
 * ```
 */
const approveJournalEntry = async (sequelize, entryId, userId, transaction) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
    if (!entry) {
        throw new Error('Journal entry not found');
    }
    if (entry.status !== 'pending' && entry.status !== 'draft') {
        throw new Error('Entry must be in pending or draft status to approve');
    }
    // Validate before approval
    const validation = await (0, exports.validateJournalEntry)(sequelize, entryId);
    if (!validation.valid) {
        throw new Error(`Cannot approve invalid entry: ${validation.errors.join(', ')}`);
    }
    await entry.update({
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    await (0, exports.createAuditTrail)(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
        action: 'APPROVE',
        entryNumber: entry.entryNumber,
    });
};
exports.approveJournalEntry = approveJournalEntry;
/**
 * Rejects a journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} reason - Rejection reason
 * @param {string} userId - User rejecting the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await rejectJournalEntry(sequelize, 1, 'Incorrect account coding', 'manager123');
 * ```
 */
const rejectJournalEntry = async (sequelize, entryId, reason, userId, transaction) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
    if (!entry) {
        throw new Error('Journal entry not found');
    }
    await entry.update({
        status: 'rejected',
        metadata: {
            ...entry.metadata,
            rejectionReason: reason,
            rejectedBy: userId,
            rejectedAt: new Date().toISOString(),
        },
        updatedBy: userId,
    }, { transaction });
    await (0, exports.createAuditTrail)(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
        action: 'REJECT',
        reason,
    });
};
exports.rejectJournalEntry = rejectJournalEntry;
/**
 * Generates unique journal entry number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} source - Source system
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated entry number
 *
 * @example
 * ```typescript
 * const entryNumber = await generateJournalEntryNumber(sequelize, 'GL');
 * // Returns: 'JE-GL-2024-00001'
 * ```
 */
const generateJournalEntryNumber = async (sequelize, source, transaction) => {
    const year = new Date().getFullYear();
    const prefix = `JE-${source}-${year}-`;
    const [results] = await sequelize.query(`SELECT entry_number FROM journal_entry_headers
     WHERE entry_number LIKE ?
     ORDER BY entry_number DESC
     LIMIT 1`, {
        replacements: [`${prefix}%`],
        transaction,
    });
    let nextNumber = 1;
    if (results && results.length > 0) {
        const lastNumber = results[0].entry_number;
        const match = lastNumber.match(/(\d+)$/);
        if (match) {
            nextNumber = parseInt(match[1], 10) + 1;
        }
    }
    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
};
exports.generateJournalEntryNumber = generateJournalEntryNumber;
/**
 * Retrieves journal entry with lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @returns {Promise<any>} Journal entry with lines
 *
 * @example
 * ```typescript
 * const entry = await getJournalEntryWithLines(sequelize, 1);
 * ```
 */
const getJournalEntryWithLines = async (sequelize, entryId) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const JournalEntryLine = (0, exports.createJournalEntryLineModel)(sequelize);
    const header = await JournalEntryHeader.findByPk(entryId);
    if (!header) {
        return null;
    }
    const lines = await JournalEntryLine.findAll({
        where: { journalEntryId: entryId },
        order: [['lineNumber', 'ASC']],
    });
    return {
        ...header.toJSON(),
        lines,
    };
};
exports.getJournalEntryWithLines = getJournalEntryWithLines;
/**
 * Searches journal entries by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} criteria - Search criteria
 * @returns {Promise<any[]>} Matching journal entries
 *
 * @example
 * ```typescript
 * const entries = await searchJournalEntries(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   status: 'posted'
 * });
 * ```
 */
const searchJournalEntries = async (sequelize, criteria) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const where = {};
    if (criteria.fiscalYear)
        where.fiscalYear = criteria.fiscalYear;
    if (criteria.fiscalPeriod)
        where.fiscalPeriod = criteria.fiscalPeriod;
    if (criteria.status)
        where.status = criteria.status;
    if (criteria.source)
        where.source = criteria.source;
    if (criteria.entryType)
        where.entryType = criteria.entryType;
    if (criteria.startDate && criteria.endDate) {
        where.entryDate = { [sequelize_1.Op.between]: [criteria.startDate, criteria.endDate] };
    }
    return await JournalEntryHeader.findAll({
        where,
        order: [['entryDate', 'DESC'], ['entryNumber', 'DESC']],
    });
};
exports.searchJournalEntries = searchJournalEntries;
// ============================================================================
// POSTING TO GENERAL LEDGER (11-20)
// ============================================================================
/**
 * Posts a single journal entry to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} userId - User posting the entry
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await postJournalEntry(sequelize, 1, 'user123');
 * ```
 */
const postJournalEntry = async (sequelize, entryId, userId, transaction) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    const JournalEntryLine = (0, exports.createJournalEntryLineModel)(sequelize);
    const entry = await JournalEntryHeader.findByPk(entryId, { transaction });
    if (!entry) {
        throw new Error('Journal entry not found');
    }
    if (entry.status !== 'approved') {
        throw new Error('Entry must be approved before posting');
    }
    // Validate entry
    const validation = await (0, exports.validateJournalEntry)(sequelize, entryId);
    if (!validation.valid) {
        throw new Error(`Cannot post invalid entry: ${validation.errors.join(', ')}`);
    }
    // Get all lines
    const lines = await JournalEntryLine.findAll({
        where: { journalEntryId: entryId },
        transaction,
    });
    // Post to account balances
    for (const line of lines) {
        const amount = Number(line.debitAmount) > 0 ? Number(line.debitAmount) : Number(line.creditAmount);
        const type = Number(line.debitAmount) > 0 ? 'debit' : 'credit';
        await (0, exports.updateAccountBalanceForPosting)(sequelize, line.accountId, entry.fiscalYear, entry.fiscalPeriod, amount, type, transaction);
    }
    // Update entry status
    await entry.update({
        status: 'posted',
        postedBy: userId,
        postedAt: new Date(),
        updatedBy: userId,
    }, { transaction });
    await (0, exports.createAuditTrail)(sequelize, 'journal_entry_headers', entryId, 'POST', userId, {
        entryNumber: entry.entryNumber,
        fiscalYear: entry.fiscalYear,
        fiscalPeriod: entry.fiscalPeriod,
    });
};
exports.postJournalEntry = postJournalEntry;
/**
 * Posts multiple journal entries in a batch.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} entryIds - Array of journal entry IDs
 * @param {string} userId - User posting the batch
 * @returns {Promise<{ batchId: string; posted: number; failed: number; errors: any[] }>} Batch posting result
 *
 * @example
 * ```typescript
 * const result = await batchPostJournalEntries(sequelize, [1, 2, 3], 'user123');
 * ```
 */
const batchPostJournalEntries = async (sequelize, entryIds, userId) => {
    const batchId = `BATCH-${Date.now()}`;
    let posted = 0;
    let failed = 0;
    const errors = [];
    for (const entryId of entryIds) {
        const t = await sequelize.transaction();
        try {
            await (0, exports.postJournalEntry)(sequelize, entryId, userId, t);
            await t.commit();
            posted++;
        }
        catch (error) {
            await t.rollback();
            failed++;
            errors.push({
                entryId,
                error: error.message,
            });
        }
    }
    // Record batch
    await sequelize.query(`INSERT INTO posting_batches (batch_id, batch_date, entry_count, posted_count, failed_count, status, processed_by, processed_at, created_at, updated_at)
     VALUES (?, NOW(), ?, ?, ?, 'completed', ?, NOW(), NOW(), NOW())`, {
        replacements: [batchId, entryIds.length, posted, failed, userId],
    });
    return { batchId, posted, failed, errors };
};
exports.batchPostJournalEntries = batchPostJournalEntries;
/**
 * Updates account balance for journal entry posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} amount - Transaction amount
 * @param {string} type - Transaction type (debit/credit)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await updateAccountBalanceForPosting(sequelize, 1, 2024, 1, 5000, 'debit');
 * ```
 */
const updateAccountBalanceForPosting = async (sequelize, accountId, fiscalYear, fiscalPeriod, amount, type, transaction) => {
    // First, ensure balance record exists
    await sequelize.query(`INSERT INTO account_balances (account_id, fiscal_year, fiscal_period, beginning_balance, debit_amount, credit_amount, ending_balance, created_at, updated_at)
     VALUES (?, ?, ?, 0, 0, 0, 0, NOW(), NOW())
     ON CONFLICT (account_id, fiscal_year, fiscal_period) DO NOTHING`, {
        replacements: [accountId, fiscalYear, fiscalPeriod],
        transaction,
    });
    // Update appropriate amount
    const field = type === 'debit' ? 'debit_amount' : 'credit_amount';
    await sequelize.query(`UPDATE account_balances
     SET ${field} = ${field} + ?,
         ending_balance = beginning_balance + debit_amount - credit_amount,
         available_balance = ending_balance - encumbrance_amount,
         updated_at = NOW()
     WHERE account_id = ? AND fiscal_year = ? AND fiscal_period = ?`, {
        replacements: [amount, accountId, fiscalYear, fiscalPeriod],
        transaction,
    });
};
exports.updateAccountBalanceForPosting = updateAccountBalanceForPosting;
/**
 * Reverses a posted journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Original journal entry ID
 * @param {Date} reversalDate - Reversal date
 * @param {string} reason - Reversal reason
 * @param {string} userId - User reversing the entry
 * @returns {Promise<any>} Reversal journal entry
 *
 * @example
 * ```typescript
 * const reversalEntry = await reverseJournalEntry(
 *   sequelize, 1, new Date(), 'Correction needed', 'user123'
 * );
 * ```
 */
const reverseJournalEntry = async (sequelize, entryId, reversalDate, reason, userId) => {
    const t = await sequelize.transaction();
    try {
        const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
        const JournalEntryLine = (0, exports.createJournalEntryLineModel)(sequelize);
        // Get original entry
        const originalEntry = await JournalEntryHeader.findByPk(entryId, { transaction: t });
        if (!originalEntry) {
            throw new Error('Original journal entry not found');
        }
        if (originalEntry.status !== 'posted') {
            throw new Error('Can only reverse posted entries');
        }
        if (originalEntry.reversedEntryId) {
            throw new Error('Entry has already been reversed');
        }
        // Get original lines
        const originalLines = await JournalEntryLine.findAll({
            where: { journalEntryId: entryId },
            transaction: t,
        });
        // Determine fiscal year/period for reversal
        const { fiscalYear, fiscalPeriod } = (0, exports.getFiscalYearPeriod)(reversalDate);
        // Create reversal entry header
        const reversalNumber = await (0, exports.generateJournalEntryNumber)(sequelize, 'REV', t);
        const reversalEntry = await JournalEntryHeader.create({
            entryNumber: reversalNumber,
            entryDate: reversalDate,
            postingDate: reversalDate,
            fiscalYear,
            fiscalPeriod,
            entryType: 'reversing',
            source: originalEntry.source,
            reference: `REV-${originalEntry.reference}`,
            description: `Reversal of ${originalEntry.entryNumber}: ${reason}`,
            status: 'approved',
            totalDebit: originalEntry.totalCredit, // Reversed
            totalCredit: originalEntry.totalDebit, // Reversed
            isBalanced: true,
            originalEntryId: entryId,
            createdBy: userId,
            updatedBy: userId,
        }, { transaction: t });
        // Create reversed lines (swap debits and credits)
        for (const line of originalLines) {
            await JournalEntryLine.create({
                journalEntryId: reversalEntry.id,
                lineNumber: line.lineNumber,
                accountId: line.accountId,
                accountCode: line.accountCode,
                debitAmount: line.creditAmount, // Reversed
                creditAmount: line.debitAmount, // Reversed
                description: `Reversal: ${line.description}`,
                dimensions: line.dimensions,
                projectCode: line.projectCode,
                activityCode: line.activityCode,
                costCenterCode: line.costCenterCode,
            }, { transaction: t });
        }
        // Post the reversal entry
        await (0, exports.postJournalEntry)(sequelize, reversalEntry.id, userId, t);
        // Update original entry
        await originalEntry.update({
            status: 'reversed',
            reversedEntryId: reversalEntry.id,
            updatedBy: userId,
        }, { transaction: t });
        await (0, exports.createAuditTrail)(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
            action: 'REVERSE',
            reversalEntryId: reversalEntry.id,
            reason,
        }, t);
        await t.commit();
        return reversalEntry;
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
exports.reverseJournalEntry = reverseJournalEntry;
/**
 * Creates adjusting journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateJournalEntryDto} entryData - Entry data
 * @param {string} userId - User creating the entry
 * @returns {Promise<any>} Created adjusting entry
 *
 * @example
 * ```typescript
 * const adjusting = await createAdjustingEntry(sequelize, {...}, 'user123');
 * ```
 */
const createAdjustingEntry = async (sequelize, entryData, userId) => {
    return await (0, exports.createJournalEntry)(sequelize, {
        ...entryData,
        entryType: 'adjusting',
        source: 'ADJ',
    }, userId);
};
exports.createAdjustingEntry = createAdjustingEntry;
/**
 * Creates closing journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @param {string} userId - User creating the entry
 * @returns {Promise<any>} Created closing entry
 *
 * @example
 * ```typescript
 * const closing = await createClosingEntry(sequelize, 2023, 'user123');
 * ```
 */
const createClosingEntry = async (sequelize, fiscalYear, userId) => {
    // Get revenue and expense balances
    const [revenues] = await sequelize.query(`SELECT ab.account_id, coa.account_code, SUM(ab.credit_amount - ab.debit_amount) as balance
     FROM account_balances ab
     JOIN chart_of_accounts coa ON ab.account_id = coa.id
     WHERE ab.fiscal_year = ? AND coa.account_type = 'REVENUE'
     GROUP BY ab.account_id, coa.account_code
     HAVING SUM(ab.credit_amount - ab.debit_amount) != 0`, { replacements: [fiscalYear] });
    const [expenses] = await sequelize.query(`SELECT ab.account_id, coa.account_code, SUM(ab.debit_amount - ab.credit_amount) as balance
     FROM account_balances ab
     JOIN chart_of_accounts coa ON ab.account_id = coa.id
     WHERE ab.fiscal_year = ? AND coa.account_type = 'EXPENSE'
     GROUP BY ab.account_id, coa.account_code
     HAVING SUM(ab.debit_amount - ab.credit_amount) != 0`, { replacements: [fiscalYear] });
    // Build closing entry lines
    const lines = [];
    let lineNumber = 1;
    // Close revenue accounts (debit revenue, credit income summary)
    for (const revenue of revenues) {
        lines.push({
            lineNumber: lineNumber++,
            accountId: revenue.account_id,
            accountCode: revenue.account_code,
            debitAmount: Math.abs(revenue.balance),
            creditAmount: 0,
            description: 'Close revenue to income summary',
            dimensions: {},
        });
    }
    // Close expense accounts (debit income summary, credit expenses)
    for (const expense of expenses) {
        lines.push({
            lineNumber: lineNumber++,
            accountId: expense.account_id,
            accountCode: expense.account_code,
            debitAmount: 0,
            creditAmount: Math.abs(expense.balance),
            description: 'Close expense to income summary',
            dimensions: {},
        });
    }
    // Add income summary lines (these would balance the entry)
    // In a real implementation, would get income summary account from config
    return await (0, exports.createJournalEntry)(sequelize, {
        entryDate: new Date(fiscalYear, 11, 31), // Dec 31
        postingDate: new Date(fiscalYear, 11, 31),
        entryType: 'closing',
        source: 'CLOSE',
        reference: `CLOSE-${fiscalYear}`,
        description: `Year-end closing entry for ${fiscalYear}`,
        lines,
    }, userId);
};
exports.createClosingEntry = createClosingEntry;
/**
 * Creates reclassification journal entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fromAccountId - Source account ID
 * @param {number} toAccountId - Target account ID
 * @param {number} amount - Reclassification amount
 * @param {string} reason - Reclassification reason
 * @param {string} userId - User creating the entry
 * @returns {Promise<any>} Created reclassification entry
 *
 * @example
 * ```typescript
 * const reclass = await createReclassificationEntry(
 *   sequelize, 100, 200, 5000, 'Correct account coding', 'user123'
 * );
 * ```
 */
const createReclassificationEntry = async (sequelize, fromAccountId, toAccountId, amount, reason, userId) => {
    // Get account codes
    const [fromAccount] = await sequelize.query('SELECT account_code FROM chart_of_accounts WHERE id = ?', { replacements: [fromAccountId] });
    const [toAccount] = await sequelize.query('SELECT account_code FROM chart_of_accounts WHERE id = ?', { replacements: [toAccountId] });
    if (!fromAccount || fromAccount.length === 0) {
        throw new Error('From account not found');
    }
    if (!toAccount || toAccount.length === 0) {
        throw new Error('To account not found');
    }
    const fromCode = fromAccount[0].account_code;
    const toCode = toAccount[0].account_code;
    return await (0, exports.createJournalEntry)(sequelize, {
        entryDate: new Date(),
        postingDate: new Date(),
        entryType: 'reclassification',
        source: 'RECLASS',
        reference: `RECLASS-${fromCode}-${toCode}`,
        description: `Reclassification: ${reason}`,
        lines: [
            {
                lineNumber: 1,
                accountId: fromAccountId,
                accountCode: fromCode,
                debitAmount: 0,
                creditAmount: amount,
                description: `Reclassify from ${fromCode}`,
                dimensions: {},
            },
            {
                lineNumber: 2,
                accountId: toAccountId,
                accountCode: toCode,
                debitAmount: amount,
                creditAmount: 0,
                description: `Reclassify to ${toCode}`,
                dimensions: {},
            },
        ],
    }, userId);
};
exports.createReclassificationEntry = createReclassificationEntry;
/**
 * Validates posting batch before processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} entryIds - Array of entry IDs to validate
 * @returns {Promise<{ valid: boolean; errors: any[] }>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePostingBatch(sequelize, [1, 2, 3]);
 * ```
 */
const validatePostingBatch = async (sequelize, entryIds) => {
    const errors = [];
    for (const entryId of entryIds) {
        const validation = await (0, exports.validateJournalEntry)(sequelize, entryId);
        if (!validation.valid) {
            errors.push({
                entryId,
                errors: validation.errors,
            });
        }
    }
    return { valid: errors.length === 0, errors };
};
exports.validatePostingBatch = validatePostingBatch;
/**
 * Unpost a journal entry (administrative function).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entryId - Journal entry ID
 * @param {string} reason - Unpost reason
 * @param {string} userId - User unposting the entry
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await unpostJournalEntry(sequelize, 1, 'Posted to wrong period', 'admin123');
 * ```
 */
const unpostJournalEntry = async (sequelize, entryId, reason, userId) => {
    const t = await sequelize.transaction();
    try {
        const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
        const JournalEntryLine = (0, exports.createJournalEntryLineModel)(sequelize);
        const entry = await JournalEntryHeader.findByPk(entryId, { transaction: t });
        if (!entry) {
            throw new Error('Journal entry not found');
        }
        if (entry.status !== 'posted') {
            throw new Error('Entry is not posted');
        }
        // Get lines
        const lines = await JournalEntryLine.findAll({
            where: { journalEntryId: entryId },
            transaction: t,
        });
        // Reverse the posting to account balances
        for (const line of lines) {
            const amount = Number(line.debitAmount) > 0 ? Number(line.debitAmount) : Number(line.creditAmount);
            const type = Number(line.debitAmount) > 0 ? 'credit' : 'debit'; // Reversed
            await (0, exports.updateAccountBalanceForPosting)(sequelize, line.accountId, entry.fiscalYear, entry.fiscalPeriod, amount, type, t);
        }
        // Update entry status
        await entry.update({
            status: 'approved',
            postedBy: null,
            postedAt: null,
            metadata: {
                ...entry.metadata,
                unpostReason: reason,
                unpostedBy: userId,
                unpostedAt: new Date().toISOString(),
            },
            updatedBy: userId,
        }, { transaction: t });
        await (0, exports.createAuditTrail)(sequelize, 'journal_entry_headers', entryId, 'UPDATE', userId, {
            action: 'UNPOST',
            reason,
        }, t);
        await t.commit();
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
exports.unpostJournalEntry = unpostJournalEntry;
// ============================================================================
// TRIAL BALANCE AND REPORTING (21-30)
// ============================================================================
/**
 * Generates trial balance for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {boolean} includeZeroBalances - Include zero balance accounts
 * @returns {Promise<TrialBalanceEntry[]>} Trial balance data
 *
 * @example
 * ```typescript
 * const trialBalance = await generateTrialBalance(sequelize, 2024, 1, false);
 * ```
 */
const generateTrialBalance = async (sequelize, fiscalYear, fiscalPeriod, includeZeroBalances = false) => {
    const query = `
    SELECT
      coa.account_code,
      coa.account_name,
      coa.account_type,
      coa.normal_balance,
      COALESCE(SUM(ab.debit_amount), 0) as total_debits,
      COALESCE(SUM(ab.credit_amount), 0) as total_credits,
      COALESCE(SUM(ab.ending_balance), 0) as net_balance
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period <= ?
    WHERE coa.is_active = true
    GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type, coa.normal_balance
    ${includeZeroBalances ? '' : 'HAVING COALESCE(SUM(ab.ending_balance), 0) != 0'}
    ORDER BY coa.account_code
  `;
    const [results] = await sequelize.query(query, {
        replacements: [fiscalYear, fiscalPeriod],
    });
    return results.map((row) => ({
        accountCode: row.account_code,
        accountName: row.account_name,
        accountType: row.account_type,
        debitBalance: row.normal_balance === 'debit' ? Number(row.net_balance) : 0,
        creditBalance: row.normal_balance === 'credit' ? Number(row.net_balance) : 0,
        netBalance: Number(row.net_balance),
    }));
};
exports.generateTrialBalance = generateTrialBalance;
/**
 * Generates adjusted trial balance (after adjusting entries).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<TrialBalanceEntry[]>} Adjusted trial balance
 *
 * @example
 * ```typescript
 * const adjustedTB = await generateAdjustedTrialBalance(sequelize, 2024, 12);
 * ```
 */
const generateAdjustedTrialBalance = async (sequelize, fiscalYear, fiscalPeriod) => {
    // Same as regular trial balance but includes adjusting entries
    return await (0, exports.generateTrialBalance)(sequelize, fiscalYear, fiscalPeriod, false);
};
exports.generateAdjustedTrialBalance = generateAdjustedTrialBalance;
/**
 * Generates post-closing trial balance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @returns {Promise<TrialBalanceEntry[]>} Post-closing trial balance
 *
 * @example
 * ```typescript
 * const postClosing = await generatePostClosingTrialBalance(sequelize, 2023);
 * ```
 */
const generatePostClosingTrialBalance = async (sequelize, fiscalYear) => {
    const query = `
    SELECT
      coa.account_code,
      coa.account_name,
      coa.account_type,
      coa.normal_balance,
      COALESCE(SUM(ab.ending_balance), 0) as net_balance
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period = 12
    WHERE coa.is_active = true
      AND coa.account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'FUND_BALANCE')
    GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type, coa.normal_balance
    HAVING COALESCE(SUM(ab.ending_balance), 0) != 0
    ORDER BY coa.account_code
  `;
    const [results] = await sequelize.query(query, {
        replacements: [fiscalYear],
    });
    return results.map((row) => ({
        accountCode: row.account_code,
        accountName: row.account_name,
        accountType: row.account_type,
        debitBalance: row.normal_balance === 'debit' ? Number(row.net_balance) : 0,
        creditBalance: row.normal_balance === 'credit' ? Number(row.net_balance) : 0,
        netBalance: Number(row.net_balance),
    }));
};
exports.generatePostClosingTrialBalance = generatePostClosingTrialBalance;
/**
 * Validates trial balance (debits = credits).
 *
 * @param {TrialBalanceEntry[]} trialBalance - Trial balance entries
 * @returns {{ balanced: boolean; totalDebits: number; totalCredits: number; difference: number }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateTrialBalance(trialBalanceData);
 * ```
 */
const validateTrialBalance = (trialBalance) => {
    let totalDebits = 0;
    let totalCredits = 0;
    for (const entry of trialBalance) {
        totalDebits += Number(entry.debitBalance);
        totalCredits += Number(entry.creditBalance);
    }
    const difference = totalDebits - totalCredits;
    const balanced = Math.abs(difference) < 0.01;
    return { balanced, totalDebits, totalCredits, difference };
};
exports.validateTrialBalance = validateTrialBalance;
/**
 * Generates general ledger detail report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any[]>} GL detail transactions
 *
 * @example
 * ```typescript
 * const detail = await generateGLDetailReport(sequelize, 1, 2024, 1);
 * ```
 */
const generateGLDetailReport = async (sequelize, accountId, fiscalYear, fiscalPeriod) => {
    const query = `
    SELECT
      jeh.entry_number,
      jeh.entry_date,
      jeh.posting_date,
      jeh.description as entry_description,
      jel.line_number,
      jel.description as line_description,
      jel.debit_amount,
      jel.credit_amount,
      jeh.reference,
      jeh.source,
      jeh.posted_by,
      jeh.posted_at
    FROM journal_entry_lines jel
    JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
    WHERE jel.account_id = ?
      AND jeh.fiscal_year = ?
      AND jeh.fiscal_period = ?
      AND jeh.status = 'posted'
    ORDER BY jeh.posting_date, jeh.entry_number, jel.line_number
  `;
    const [results] = await sequelize.query(query, {
        replacements: [accountId, fiscalYear, fiscalPeriod],
    });
    return results;
};
exports.generateGLDetailReport = generateGLDetailReport;
/**
 * Generates account activity summary.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - Account ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<any>} Account activity summary
 *
 * @example
 * ```typescript
 * const summary = await generateAccountActivitySummary(
 *   sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31')
 * );
 * ```
 */
const generateAccountActivitySummary = async (sequelize, accountId, startDate, endDate) => {
    const query = `
    SELECT
      COUNT(*) as transaction_count,
      SUM(jel.debit_amount) as total_debits,
      SUM(jel.credit_amount) as total_credits,
      MIN(jeh.entry_date) as first_transaction,
      MAX(jeh.entry_date) as last_transaction
    FROM journal_entry_lines jel
    JOIN journal_entry_headers jeh ON jel.journal_entry_id = jeh.id
    WHERE jel.account_id = ?
      AND jeh.entry_date BETWEEN ? AND ?
      AND jeh.status = 'posted'
  `;
    const [results] = await sequelize.query(query, {
        replacements: [accountId, startDate, endDate],
    });
    return results[0];
};
exports.generateAccountActivitySummary = generateAccountActivitySummary;
/**
 * Exports trial balance to CSV format.
 *
 * @param {TrialBalanceEntry[]} trialBalance - Trial balance data
 * @returns {string} CSV formatted trial balance
 *
 * @example
 * ```typescript
 * const csv = exportTrialBalanceToCSV(trialBalanceData);
 * ```
 */
const exportTrialBalanceToCSV = (trialBalance) => {
    const headers = 'Account Code,Account Name,Account Type,Debit Balance,Credit Balance,Net Balance\n';
    const rows = trialBalance.map((entry) => {
        return `"${entry.accountCode}","${entry.accountName}","${entry.accountType}",${entry.debitBalance},${entry.creditBalance},${entry.netBalance}`;
    });
    return headers + rows.join('\n');
};
exports.exportTrialBalanceToCSV = exportTrialBalanceToCSV;
/**
 * Generates financial statement data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} statementType - Statement type (balance_sheet, income_statement)
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Financial statement data
 *
 * @example
 * ```typescript
 * const balanceSheet = await generateFinancialStatement(sequelize, 'balance_sheet', 2024, 12);
 * ```
 */
const generateFinancialStatement = async (sequelize, statementType, fiscalYear, fiscalPeriod) => {
    if (statementType === 'balance_sheet') {
        return await (0, exports.generateBalanceSheet)(sequelize, fiscalYear, fiscalPeriod);
    }
    else {
        return await (0, exports.generateIncomeStatement)(sequelize, fiscalYear, fiscalPeriod);
    }
};
exports.generateFinancialStatement = generateFinancialStatement;
/**
 * Generates balance sheet.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<any>} Balance sheet data
 *
 * @example
 * ```typescript
 * const balanceSheet = await generateBalanceSheet(sequelize, 2024, 12);
 * ```
 */
const generateBalanceSheet = async (sequelize, fiscalYear, fiscalPeriod) => {
    const query = `
    SELECT
      coa.account_type,
      coa.account_category,
      coa.account_code,
      coa.account_name,
      COALESCE(SUM(ab.ending_balance), 0) as balance
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period = ?
    WHERE coa.is_active = true
      AND coa.account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'FUND_BALANCE')
    GROUP BY coa.account_type, coa.account_category, coa.account_code, coa.account_name
    ORDER BY coa.account_type, coa.account_code
  `;
    const [results] = await sequelize.query(query, {
        replacements: [fiscalYear, fiscalPeriod],
    });
    // Organize by account type
    const balanceSheet = {
        assets: [],
        liabilities: [],
        equity: [],
        totalAssets: 0,
        totalLiabilities: 0,
        totalEquity: 0,
    };
    for (const row of results) {
        const item = {
            accountCode: row.account_code,
            accountName: row.account_name,
            category: row.account_category,
            balance: Number(row.balance),
        };
        if (row.account_type === 'ASSET') {
            balanceSheet.assets.push(item);
            balanceSheet.totalAssets += item.balance;
        }
        else if (row.account_type === 'LIABILITY') {
            balanceSheet.liabilities.push(item);
            balanceSheet.totalLiabilities += item.balance;
        }
        else {
            balanceSheet.equity.push(item);
            balanceSheet.totalEquity += item.balance;
        }
    }
    return balanceSheet;
};
exports.generateBalanceSheet = generateBalanceSheet;
/**
 * Generates income statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period (or 12 for full year)
 * @returns {Promise<any>} Income statement data
 *
 * @example
 * ```typescript
 * const incomeStatement = await generateIncomeStatement(sequelize, 2024, 12);
 * ```
 */
const generateIncomeStatement = async (sequelize, fiscalYear, fiscalPeriod) => {
    const query = `
    SELECT
      coa.account_type,
      coa.account_category,
      coa.account_code,
      coa.account_name,
      COALESCE(SUM(
        CASE
          WHEN coa.account_type = 'REVENUE' THEN ab.credit_amount - ab.debit_amount
          WHEN coa.account_type = 'EXPENSE' THEN ab.debit_amount - ab.credit_amount
          ELSE 0
        END
      ), 0) as amount
    FROM chart_of_accounts coa
    LEFT JOIN account_balances ab ON coa.id = ab.account_id
      AND ab.fiscal_year = ?
      AND ab.fiscal_period <= ?
    WHERE coa.is_active = true
      AND coa.account_type IN ('REVENUE', 'EXPENSE')
    GROUP BY coa.account_type, coa.account_category, coa.account_code, coa.account_name
    ORDER BY coa.account_type, coa.account_code
  `;
    const [results] = await sequelize.query(query, {
        replacements: [fiscalYear, fiscalPeriod],
    });
    const incomeStatement = {
        revenues: [],
        expenses: [],
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0,
    };
    for (const row of results) {
        const item = {
            accountCode: row.account_code,
            accountName: row.account_name,
            category: row.account_category,
            amount: Number(row.amount),
        };
        if (row.account_type === 'REVENUE') {
            incomeStatement.revenues.push(item);
            incomeStatement.totalRevenue += item.amount;
        }
        else {
            incomeStatement.expenses.push(item);
            incomeStatement.totalExpenses += item.amount;
        }
    }
    incomeStatement.netIncome = incomeStatement.totalRevenue - incomeStatement.totalExpenses;
    return incomeStatement;
};
exports.generateIncomeStatement = generateIncomeStatement;
// ============================================================================
// PERIOD CLOSE OPERATIONS (31-40)
// ============================================================================
/**
 * Initiates period close process.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User initiating close
 * @returns {Promise<PeriodCloseStatus>} Period close status
 *
 * @example
 * ```typescript
 * const closeStatus = await initiatePeriodClose(sequelize, 2024, 1, 'user123');
 * ```
 */
const initiatePeriodClose = async (sequelize, fiscalYear, fiscalPeriod, userId) => {
    // Check if period is already closed
    const [existing] = await sequelize.query('SELECT * FROM period_close_status WHERE fiscal_year = ? AND fiscal_period = ?', { replacements: [fiscalYear, fiscalPeriod] });
    if (existing && existing.length > 0) {
        const status = existing[0].status;
        if (status === 'closed' || status === 'locked') {
            throw new Error(`Period ${fiscalYear}-${fiscalPeriod} is already ${status}`);
        }
    }
    // Create period close record
    await sequelize.query(`INSERT INTO period_close_status (fiscal_year, fiscal_period, status, initiated_by, initiated_at, created_at, updated_at)
     VALUES (?, ?, 'closing', ?, NOW(), NOW(), NOW())
     ON CONFLICT (fiscal_year, fiscal_period)
     DO UPDATE SET status = 'closing', initiated_by = ?, initiated_at = NOW(), updated_at = NOW()`, { replacements: [fiscalYear, fiscalPeriod, userId, userId] });
    return await (0, exports.getPeriodCloseStatus)(sequelize, fiscalYear, fiscalPeriod);
};
exports.initiatePeriodClose = initiatePeriodClose;
/**
 * Gets period close status and checklist.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<PeriodCloseStatus>} Period close status
 *
 * @example
 * ```typescript
 * const status = await getPeriodCloseStatus(sequelize, 2024, 1);
 * ```
 */
const getPeriodCloseStatus = async (sequelize, fiscalYear, fiscalPeriod) => {
    const [statusResults] = await sequelize.query('SELECT * FROM period_close_status WHERE fiscal_year = ? AND fiscal_period = ?', { replacements: [fiscalYear, fiscalPeriod] });
    if (!statusResults || statusResults.length === 0) {
        return {
            fiscalYear,
            fiscalPeriod,
            status: 'open',
            checklistItems: [],
        };
    }
    const statusData = statusResults[0];
    const [checklistResults] = await sequelize.query('SELECT * FROM period_close_checklist WHERE fiscal_year = ? AND fiscal_period = ? ORDER BY item_order', { replacements: [fiscalYear, fiscalPeriod] });
    return {
        fiscalYear: statusData.fiscal_year,
        fiscalPeriod: statusData.fiscal_period,
        status: statusData.status,
        closeDate: statusData.close_date,
        closedBy: statusData.closed_by,
        checklistItems: checklistResults.map((item) => ({
            itemId: item.item_id,
            itemName: item.item_name,
            itemType: item.item_type,
            status: item.status,
            completedBy: item.completed_by,
            completedAt: item.completed_at,
            notes: item.notes,
        })),
    };
};
exports.getPeriodCloseStatus = getPeriodCloseStatus;
/**
 * Validates period close readiness.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<{ ready: boolean; issues: string[] }>} Readiness validation
 *
 * @example
 * ```typescript
 * const validation = await validatePeriodCloseReadiness(sequelize, 2024, 1);
 * ```
 */
const validatePeriodCloseReadiness = async (sequelize, fiscalYear, fiscalPeriod) => {
    const issues = [];
    // Check for unposted entries
    const [unpostedCount] = await sequelize.query(`SELECT COUNT(*) as count FROM journal_entry_headers
     WHERE fiscal_year = ? AND fiscal_period = ?
     AND status IN ('draft', 'pending', 'approved')`, { replacements: [fiscalYear, fiscalPeriod] });
    if (unpostedCount[0].count > 0) {
        issues.push(`${unpostedCount[0].count} unposted journal entries`);
    }
    // Check trial balance
    const trialBalance = await (0, exports.generateTrialBalance)(sequelize, fiscalYear, fiscalPeriod, false);
    const validation = (0, exports.validateTrialBalance)(trialBalance);
    if (!validation.balanced) {
        issues.push(`Trial balance is out of balance by ${validation.difference}`);
    }
    // Check for unreconciled accounts
    const [unreconciledCount] = await sequelize.query(`SELECT COUNT(*) as count FROM account_balances
     WHERE fiscal_year = ? AND fiscal_period = ?
     AND reconciliation_status != 'reconciled'`, { replacements: [fiscalYear, fiscalPeriod] });
    if (unreconciledCount[0].count > 0) {
        issues.push(`${unreconciledCount[0].count} unreconciled accounts`);
    }
    return { ready: issues.length === 0, issues };
};
exports.validatePeriodCloseReadiness = validatePeriodCloseReadiness;
/**
 * Completes period close.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User completing close
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await completePeriodClose(sequelize, 2024, 1, 'user123');
 * ```
 */
const completePeriodClose = async (sequelize, fiscalYear, fiscalPeriod, userId) => {
    // Validate readiness
    const validation = await (0, exports.validatePeriodCloseReadiness)(sequelize, fiscalYear, fiscalPeriod);
    if (!validation.ready) {
        throw new Error(`Cannot close period: ${validation.issues.join(', ')}`);
    }
    await sequelize.query(`UPDATE period_close_status
     SET status = 'closed', close_date = NOW(), closed_by = ?, updated_at = NOW()
     WHERE fiscal_year = ? AND fiscal_period = ?`, { replacements: [userId, fiscalYear, fiscalPeriod] });
    await (0, exports.createAuditTrail)(sequelize, 'period_close_status', 0, 'UPDATE', userId, {
        action: 'CLOSE_PERIOD',
        fiscalYear,
        fiscalPeriod,
    });
};
exports.completePeriodClose = completePeriodClose;
/**
 * Reopens a closed period (administrative function).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} reason - Reopen reason
 * @param {string} userId - User reopening period
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reopenPeriod(sequelize, 2024, 1, 'Correction needed', 'admin123');
 * ```
 */
const reopenPeriod = async (sequelize, fiscalYear, fiscalPeriod, reason, userId) => {
    await sequelize.query(`UPDATE period_close_status
     SET status = 'open', updated_at = NOW()
     WHERE fiscal_year = ? AND fiscal_period = ?`, { replacements: [fiscalYear, fiscalPeriod] });
    await (0, exports.createAuditTrail)(sequelize, 'period_close_status', 0, 'UPDATE', userId, {
        action: 'REOPEN_PERIOD',
        fiscalYear,
        fiscalPeriod,
        reason,
    });
};
exports.reopenPeriod = reopenPeriod;
/**
 * Checks if a period is open for posting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @returns {Promise<boolean>} Whether period is open
 *
 * @example
 * ```typescript
 * const isOpen = await isPeriodOpen(sequelize, 2024, 1);
 * ```
 */
const isPeriodOpen = async (sequelize, fiscalYear, fiscalPeriod) => {
    const [results] = await sequelize.query('SELECT status FROM period_close_status WHERE fiscal_year = ? AND fiscal_period = ?', { replacements: [fiscalYear, fiscalPeriod] });
    if (!results || results.length === 0) {
        return true; // Period not initialized = open
    }
    const status = results[0].status;
    return status === 'open' || status === 'closing';
};
exports.isPeriodOpen = isPeriodOpen;
/**
 * Locks a period (prevents any changes).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User locking period
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await lockPeriod(sequelize, 2023, 12, 'admin123');
 * ```
 */
const lockPeriod = async (sequelize, fiscalYear, fiscalPeriod, userId) => {
    await sequelize.query(`UPDATE period_close_status
     SET status = 'locked', locked_by = ?, locked_at = NOW(), updated_at = NOW()
     WHERE fiscal_year = ? AND fiscal_period = ?`, { replacements: [userId, fiscalYear, fiscalPeriod] });
    await (0, exports.createAuditTrail)(sequelize, 'period_close_status', 0, 'UPDATE', userId, {
        action: 'LOCK_PERIOD',
        fiscalYear,
        fiscalPeriod,
    });
};
exports.lockPeriod = lockPeriod;
/**
 * Creates year-end closing entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year to close
 * @param {string} userId - User creating closing entries
 * @returns {Promise<number[]>} Array of created entry IDs
 *
 * @example
 * ```typescript
 * const entryIds = await createYearEndClosingEntries(sequelize, 2023, 'user123');
 * ```
 */
const createYearEndClosingEntries = async (sequelize, fiscalYear, userId) => {
    const entryIds = [];
    // Create closing entry for revenue and expense accounts
    const closingEntry = await (0, exports.createClosingEntry)(sequelize, fiscalYear, userId);
    entryIds.push(closingEntry.id);
    // Auto-approve and post
    await (0, exports.approveJournalEntry)(sequelize, closingEntry.id, userId);
    await (0, exports.postJournalEntry)(sequelize, closingEntry.id, userId);
    return entryIds;
};
exports.createYearEndClosingEntries = createYearEndClosingEntries;
/**
 * Processes automatic reversing entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} reversalDate - Reversal date
 * @param {string} userId - User processing reversals
 * @returns {Promise<number>} Number of entries reversed
 *
 * @example
 * ```typescript
 * const count = await processAutomaticReversingEntries(sequelize, new Date('2024-01-01'), 'system');
 * ```
 */
const processAutomaticReversingEntries = async (sequelize, reversalDate, userId) => {
    const JournalEntryHeader = (0, exports.createJournalEntryHeaderModel)(sequelize);
    // Find entries marked for reversal
    const entriesToReverse = await JournalEntryHeader.findAll({
        where: {
            isReversing: true,
            reversalDate: { [sequelize_1.Op.lte]: reversalDate },
            status: 'posted',
            reversedEntryId: null,
        },
    });
    let count = 0;
    for (const entry of entriesToReverse) {
        try {
            await (0, exports.reverseJournalEntry)(sequelize, entry.id, reversalDate, 'Automatic reversal', userId);
            count++;
        }
        catch (error) {
            console.error(`Failed to reverse entry ${entry.entryNumber}:`, error);
        }
    }
    return count;
};
exports.processAutomaticReversingEntries = processAutomaticReversingEntries;
// ============================================================================
// HELPER FUNCTIONS (41-45)
// ============================================================================
/**
 * Gets fiscal year and period from a date.
 *
 * @param {Date} date - Date to convert
 * @param {number} fiscalYearStartMonth - Fiscal year start month (1-12)
 * @returns {{ fiscalYear: number; fiscalPeriod: number }} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * ```
 */
const getFiscalYearPeriod = (date, fiscalYearStartMonth = 10) => {
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();
    let fiscalYear = year;
    let fiscalPeriod = month;
    if (fiscalYearStartMonth !== 1) {
        if (month >= fiscalYearStartMonth) {
            fiscalYear = year + 1;
            fiscalPeriod = month - fiscalYearStartMonth + 1;
        }
        else {
            fiscalYear = year;
            fiscalPeriod = 12 - fiscalYearStartMonth + month + 1;
        }
    }
    return { fiscalYear, fiscalPeriod };
};
exports.getFiscalYearPeriod = getFiscalYearPeriod;
/**
 * Creates audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} tableName - Table name
 * @param {number} recordId - Record ID
 * @param {string} action - Action performed
 * @param {string} userId - User ID
 * @param {Record<string, any>} [changes] - Changes made
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createAuditTrail(sequelize, 'journal_entry_headers', 1, 'POST', 'user123', {...});
 * ```
 */
const createAuditTrail = async (sequelize, tableName, recordId, action, userId, changes, transaction) => {
    await sequelize.query(`INSERT INTO audit_trail (table_name, record_id, action, user_id, timestamp, changes, created_at)
     VALUES (?, ?, ?, ?, NOW(), ?, NOW())`, {
        replacements: [tableName, recordId, action, userId, JSON.stringify(changes || {})],
        transaction,
    });
};
exports.createAuditTrail = createAuditTrail;
/**
 * Validates account coding for transaction.
 *
 * @param {AccountCodingRule} rule - Coding rule
 * @param {Record<string, string>} dimensions - Provided dimensions
 * @returns {boolean} Whether coding is valid
 *
 * @example
 * ```typescript
 * const isValid = validateAccountCoding(rule, { fund: '1000', org: '01' });
 * ```
 */
const validateAccountCoding = (rule, dimensions) => {
    for (const requiredDim of rule.requiredDimensions) {
        if (!dimensions[requiredDim]) {
            throw new Error(`Required dimension ${requiredDim} is missing`);
        }
    }
    return true;
};
exports.validateAccountCoding = validateAccountCoding;
/**
 * Reconciles general ledger to sub-ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} accountId - GL account ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} subLedgerBalance - Sub-ledger balance
 * @returns {Promise<LedgerReconciliationItem>} Reconciliation result
 *
 * @example
 * ```typescript
 * const recon = await reconcileGLToSubLedger(sequelize, 1, 2024, 1, 100000);
 * ```
 */
const reconcileGLToSubLedger = async (sequelize, accountId, fiscalYear, fiscalPeriod, subLedgerBalance) => {
    const [glBalance] = await sequelize.query('SELECT ending_balance FROM account_balances WHERE account_id = ? AND fiscal_year = ? AND fiscal_period = ?', { replacements: [accountId, fiscalYear, fiscalPeriod] });
    const glBalanceAmount = glBalance && glBalance.length > 0
        ? Number(glBalance[0].ending_balance)
        : 0;
    const variance = glBalanceAmount - subLedgerBalance;
    const variancePercent = subLedgerBalance !== 0 ? (variance / subLedgerBalance) * 100 : 0;
    const status = Math.abs(variance) < 0.01 ? 'matched' : 'variance';
    return {
        accountId,
        fiscalYear,
        fiscalPeriod,
        glBalance: glBalanceAmount,
        subLedgerBalance,
        variance,
        variancePercent,
        status,
    };
};
exports.reconcileGLToSubLedger = reconcileGLToSubLedger;
/**
 * Generates journal entry number sequence.
 *
 * @param {string} prefix - Entry number prefix
 * @param {number} year - Year
 * @param {number} sequenceNumber - Sequence number
 * @returns {string} Formatted entry number
 *
 * @example
 * ```typescript
 * const entryNumber = formatJournalEntryNumber('JE', 2024, 1);
 * // Returns: 'JE-2024-00001'
 * ```
 */
const formatJournalEntryNumber = (prefix, year, sequenceNumber) => {
    return `${prefix}-${year}-${sequenceNumber.toString().padStart(5, '0')}`;
};
exports.formatJournalEntryNumber = formatJournalEntryNumber;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createJournalEntryHeaderModel: exports.createJournalEntryHeaderModel,
    createJournalEntryLineModel: exports.createJournalEntryLineModel,
    // Journal Entry Management
    createJournalEntry: exports.createJournalEntry,
    updateJournalEntry: exports.updateJournalEntry,
    deleteJournalEntry: exports.deleteJournalEntry,
    validateJournalEntry: exports.validateJournalEntry,
    approveJournalEntry: exports.approveJournalEntry,
    rejectJournalEntry: exports.rejectJournalEntry,
    generateJournalEntryNumber: exports.generateJournalEntryNumber,
    getJournalEntryWithLines: exports.getJournalEntryWithLines,
    searchJournalEntries: exports.searchJournalEntries,
    // Posting Operations
    postJournalEntry: exports.postJournalEntry,
    batchPostJournalEntries: exports.batchPostJournalEntries,
    updateAccountBalanceForPosting: exports.updateAccountBalanceForPosting,
    reverseJournalEntry: exports.reverseJournalEntry,
    createAdjustingEntry: exports.createAdjustingEntry,
    createClosingEntry: exports.createClosingEntry,
    createReclassificationEntry: exports.createReclassificationEntry,
    validatePostingBatch: exports.validatePostingBatch,
    unpostJournalEntry: exports.unpostJournalEntry,
    // Trial Balance and Reporting
    generateTrialBalance: exports.generateTrialBalance,
    generateAdjustedTrialBalance: exports.generateAdjustedTrialBalance,
    generatePostClosingTrialBalance: exports.generatePostClosingTrialBalance,
    validateTrialBalance: exports.validateTrialBalance,
    generateGLDetailReport: exports.generateGLDetailReport,
    generateAccountActivitySummary: exports.generateAccountActivitySummary,
    exportTrialBalanceToCSV: exports.exportTrialBalanceToCSV,
    generateFinancialStatement: exports.generateFinancialStatement,
    generateBalanceSheet: exports.generateBalanceSheet,
    generateIncomeStatement: exports.generateIncomeStatement,
    // Period Close Operations
    initiatePeriodClose: exports.initiatePeriodClose,
    getPeriodCloseStatus: exports.getPeriodCloseStatus,
    validatePeriodCloseReadiness: exports.validatePeriodCloseReadiness,
    completePeriodClose: exports.completePeriodClose,
    reopenPeriod: exports.reopenPeriod,
    isPeriodOpen: exports.isPeriodOpen,
    lockPeriod: exports.lockPeriod,
    createYearEndClosingEntries: exports.createYearEndClosingEntries,
    processAutomaticReversingEntries: exports.processAutomaticReversingEntries,
    // Helper Functions
    getFiscalYearPeriod: exports.getFiscalYearPeriod,
    createAuditTrail: exports.createAuditTrail,
    validateAccountCoding: exports.validateAccountCoding,
    reconcileGLToSubLedger: exports.reconcileGLToSubLedger,
    formatJournalEntryNumber: exports.formatJournalEntryNumber,
};
//# sourceMappingURL=general-ledger-operations-kit.js.map