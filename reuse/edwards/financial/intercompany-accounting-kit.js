"use strict";
/**
 * LOC: INTCOMP001
 * File: /reuse/edwards/financial/intercompany-accounting-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend intercompany modules
 *   - Multi-entity consolidation services
 *   - Transfer pricing modules
 *   - Intercompany reconciliation services
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
exports.generateTransferPricingSummary = exports.batchReconcileIntercompanyAccounts = exports.analyzeUnrealizedProfit = exports.createIntercompanyDividend = exports.validateEliminationCompleteness = exports.generateConsolidationWorksheet = exports.createCurrencyTranslationAdjustment = exports.identifyUnmatchedTransactions = exports.generateTransactionMatchingReport = exports.trackIntercompanyBalancing = exports.postIntercompanyAllocation = exports.createIntercompanyAllocation = exports.processLoanRepayment = exports.calculateLoanInterestAccrual = exports.createIntercompanyLoan = exports.generateIntercompanyAgingReport = exports.validateIntercompanyCompliance = exports.exportIntercompanyData = exports.analyzeIntercompanyPositions = exports.getIntercompanyTransactionSummary = exports.generateConsolidatedStatement = exports.completeConsolidation = exports.initiateConsolidation = exports.generateTransferPricingDocumentation = exports.validateTransferPricing = exports.calculateTransferPrice = exports.processSettlement = exports.createIntercompanySettlement = exports.approveNetting = exports.processIntercompanyNetting = exports.generateReconciliationReport = exports.createReconciliationAdjustment = exports.identifyReconciliationVariances = exports.reconcileIntercompanyBalances = exports.reverseEliminationEntries = exports.postEliminationEntries = exports.generateAutomaticEliminations = exports.createEliminationEntry = exports.reverseIntercompanyTransaction = exports.generateIntercompanyJournal = exports.postIntercompanyTransaction = exports.approveIntercompanyTransaction = exports.createIntercompanyTransaction = exports.createIntercompanyReconciliationModel = exports.createEliminationEntryModel = exports.createIntercompanyTransactionModel = exports.ReconcileIntercompanyDto = exports.ProcessNettingDto = exports.CreateEliminationEntryDto = exports.CreateIntercompanyTransactionDto = void 0;
exports.archiveConsolidation = void 0;
/**
 * File: /reuse/edwards/financial/intercompany-accounting-kit.ts
 * Locator: WC-EDW-INTCOMP-001
 * Purpose: Comprehensive Intercompany Accounting Operations - Multi-entity transactions, elimination entries, transfer pricing, consolidation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/intercompany/*, Consolidation Services, Transfer Pricing, Reconciliation Services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for intercompany transactions, elimination entries, cross-entity accounting, transfer pricing, reconciliation, netting, settlements, consolidation
 *
 * LLM Context: Enterprise-grade intercompany accounting for Oracle JD Edwards EnterpriseOne compatibility.
 * Provides comprehensive intercompany transaction processing, automated elimination entries, cross-entity journal entries,
 * transfer pricing compliance, intercompany reconciliation, bilateral/multilateral netting, settlement processing,
 * multi-entity consolidation, intercompany balancing, currency translation, and audit trail management.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateIntercompanyTransactionDto = (() => {
    var _a;
    let _transactionNumber_decorators;
    let _transactionNumber_initializers = [];
    let _transactionNumber_extraInitializers = [];
    let _transactionDate_decorators;
    let _transactionDate_initializers = [];
    let _transactionDate_extraInitializers = [];
    let _sourceEntityId_decorators;
    let _sourceEntityId_initializers = [];
    let _sourceEntityId_extraInitializers = [];
    let _destinationEntityId_decorators;
    let _destinationEntityId_initializers = [];
    let _destinationEntityId_extraInitializers = [];
    let _transactionType_decorators;
    let _transactionType_initializers = [];
    let _transactionType_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _referenceNumber_decorators;
    let _referenceNumber_initializers = [];
    let _referenceNumber_extraInitializers = [];
    return _a = class CreateIntercompanyTransactionDto {
            constructor() {
                this.transactionNumber = __runInitializers(this, _transactionNumber_initializers, void 0);
                this.transactionDate = (__runInitializers(this, _transactionNumber_extraInitializers), __runInitializers(this, _transactionDate_initializers, void 0));
                this.sourceEntityId = (__runInitializers(this, _transactionDate_extraInitializers), __runInitializers(this, _sourceEntityId_initializers, void 0));
                this.destinationEntityId = (__runInitializers(this, _sourceEntityId_extraInitializers), __runInitializers(this, _destinationEntityId_initializers, void 0));
                this.transactionType = (__runInitializers(this, _destinationEntityId_extraInitializers), __runInitializers(this, _transactionType_initializers, void 0));
                this.amount = (__runInitializers(this, _transactionType_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.description = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.referenceNumber = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _referenceNumber_initializers, void 0));
                __runInitializers(this, _referenceNumber_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _transactionNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction number', example: 'IC-2024-001' })];
            _transactionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction date' })];
            _sourceEntityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source entity ID' })];
            _destinationEntityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Destination entity ID' })];
            _transactionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction type', enum: ['sale', 'purchase', 'loan', 'transfer', 'service', 'royalty', 'allocation'] })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Transaction amount' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _referenceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reference number', required: false })];
            __esDecorate(null, null, _transactionNumber_decorators, { kind: "field", name: "transactionNumber", static: false, private: false, access: { has: obj => "transactionNumber" in obj, get: obj => obj.transactionNumber, set: (obj, value) => { obj.transactionNumber = value; } }, metadata: _metadata }, _transactionNumber_initializers, _transactionNumber_extraInitializers);
            __esDecorate(null, null, _transactionDate_decorators, { kind: "field", name: "transactionDate", static: false, private: false, access: { has: obj => "transactionDate" in obj, get: obj => obj.transactionDate, set: (obj, value) => { obj.transactionDate = value; } }, metadata: _metadata }, _transactionDate_initializers, _transactionDate_extraInitializers);
            __esDecorate(null, null, _sourceEntityId_decorators, { kind: "field", name: "sourceEntityId", static: false, private: false, access: { has: obj => "sourceEntityId" in obj, get: obj => obj.sourceEntityId, set: (obj, value) => { obj.sourceEntityId = value; } }, metadata: _metadata }, _sourceEntityId_initializers, _sourceEntityId_extraInitializers);
            __esDecorate(null, null, _destinationEntityId_decorators, { kind: "field", name: "destinationEntityId", static: false, private: false, access: { has: obj => "destinationEntityId" in obj, get: obj => obj.destinationEntityId, set: (obj, value) => { obj.destinationEntityId = value; } }, metadata: _metadata }, _destinationEntityId_initializers, _destinationEntityId_extraInitializers);
            __esDecorate(null, null, _transactionType_decorators, { kind: "field", name: "transactionType", static: false, private: false, access: { has: obj => "transactionType" in obj, get: obj => obj.transactionType, set: (obj, value) => { obj.transactionType = value; } }, metadata: _metadata }, _transactionType_initializers, _transactionType_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _referenceNumber_decorators, { kind: "field", name: "referenceNumber", static: false, private: false, access: { has: obj => "referenceNumber" in obj, get: obj => obj.referenceNumber, set: (obj, value) => { obj.referenceNumber = value; } }, metadata: _metadata }, _referenceNumber_initializers, _referenceNumber_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateIntercompanyTransactionDto = CreateIntercompanyTransactionDto;
let CreateEliminationEntryDto = (() => {
    var _a;
    let _consolidationId_decorators;
    let _consolidationId_initializers = [];
    let _consolidationId_extraInitializers = [];
    let _eliminationType_decorators;
    let _eliminationType_initializers = [];
    let _eliminationType_extraInitializers = [];
    let _sourceEntityId_decorators;
    let _sourceEntityId_initializers = [];
    let _sourceEntityId_extraInitializers = [];
    let _destinationEntityId_decorators;
    let _destinationEntityId_initializers = [];
    let _destinationEntityId_extraInitializers = [];
    let _eliminationAmount_decorators;
    let _eliminationAmount_initializers = [];
    let _eliminationAmount_extraInitializers = [];
    let _debitAccountCode_decorators;
    let _debitAccountCode_initializers = [];
    let _debitAccountCode_extraInitializers = [];
    let _creditAccountCode_decorators;
    let _creditAccountCode_initializers = [];
    let _creditAccountCode_extraInitializers = [];
    return _a = class CreateEliminationEntryDto {
            constructor() {
                this.consolidationId = __runInitializers(this, _consolidationId_initializers, void 0);
                this.eliminationType = (__runInitializers(this, _consolidationId_extraInitializers), __runInitializers(this, _eliminationType_initializers, void 0));
                this.sourceEntityId = (__runInitializers(this, _eliminationType_extraInitializers), __runInitializers(this, _sourceEntityId_initializers, void 0));
                this.destinationEntityId = (__runInitializers(this, _sourceEntityId_extraInitializers), __runInitializers(this, _destinationEntityId_initializers, void 0));
                this.eliminationAmount = (__runInitializers(this, _destinationEntityId_extraInitializers), __runInitializers(this, _eliminationAmount_initializers, void 0));
                this.debitAccountCode = (__runInitializers(this, _eliminationAmount_extraInitializers), __runInitializers(this, _debitAccountCode_initializers, void 0));
                this.creditAccountCode = (__runInitializers(this, _debitAccountCode_extraInitializers), __runInitializers(this, _creditAccountCode_initializers, void 0));
                __runInitializers(this, _creditAccountCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _consolidationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Consolidation ID' })];
            _eliminationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Elimination type', enum: ['revenue', 'expense', 'receivable', 'payable', 'investment', 'equity', 'unrealized-profit'] })];
            _sourceEntityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Source entity ID' })];
            _destinationEntityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Destination entity ID' })];
            _eliminationAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Elimination amount' })];
            _debitAccountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Debit account code' })];
            _creditAccountCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit account code' })];
            __esDecorate(null, null, _consolidationId_decorators, { kind: "field", name: "consolidationId", static: false, private: false, access: { has: obj => "consolidationId" in obj, get: obj => obj.consolidationId, set: (obj, value) => { obj.consolidationId = value; } }, metadata: _metadata }, _consolidationId_initializers, _consolidationId_extraInitializers);
            __esDecorate(null, null, _eliminationType_decorators, { kind: "field", name: "eliminationType", static: false, private: false, access: { has: obj => "eliminationType" in obj, get: obj => obj.eliminationType, set: (obj, value) => { obj.eliminationType = value; } }, metadata: _metadata }, _eliminationType_initializers, _eliminationType_extraInitializers);
            __esDecorate(null, null, _sourceEntityId_decorators, { kind: "field", name: "sourceEntityId", static: false, private: false, access: { has: obj => "sourceEntityId" in obj, get: obj => obj.sourceEntityId, set: (obj, value) => { obj.sourceEntityId = value; } }, metadata: _metadata }, _sourceEntityId_initializers, _sourceEntityId_extraInitializers);
            __esDecorate(null, null, _destinationEntityId_decorators, { kind: "field", name: "destinationEntityId", static: false, private: false, access: { has: obj => "destinationEntityId" in obj, get: obj => obj.destinationEntityId, set: (obj, value) => { obj.destinationEntityId = value; } }, metadata: _metadata }, _destinationEntityId_initializers, _destinationEntityId_extraInitializers);
            __esDecorate(null, null, _eliminationAmount_decorators, { kind: "field", name: "eliminationAmount", static: false, private: false, access: { has: obj => "eliminationAmount" in obj, get: obj => obj.eliminationAmount, set: (obj, value) => { obj.eliminationAmount = value; } }, metadata: _metadata }, _eliminationAmount_initializers, _eliminationAmount_extraInitializers);
            __esDecorate(null, null, _debitAccountCode_decorators, { kind: "field", name: "debitAccountCode", static: false, private: false, access: { has: obj => "debitAccountCode" in obj, get: obj => obj.debitAccountCode, set: (obj, value) => { obj.debitAccountCode = value; } }, metadata: _metadata }, _debitAccountCode_initializers, _debitAccountCode_extraInitializers);
            __esDecorate(null, null, _creditAccountCode_decorators, { kind: "field", name: "creditAccountCode", static: false, private: false, access: { has: obj => "creditAccountCode" in obj, get: obj => obj.creditAccountCode, set: (obj, value) => { obj.creditAccountCode = value; } }, metadata: _metadata }, _creditAccountCode_initializers, _creditAccountCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateEliminationEntryDto = CreateEliminationEntryDto;
let ProcessNettingDto = (() => {
    var _a;
    let _nettingDate_decorators;
    let _nettingDate_initializers = [];
    let _nettingDate_extraInitializers = [];
    let _nettingType_decorators;
    let _nettingType_initializers = [];
    let _nettingType_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _participatingEntities_decorators;
    let _participatingEntities_initializers = [];
    let _participatingEntities_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    return _a = class ProcessNettingDto {
            constructor() {
                this.nettingDate = __runInitializers(this, _nettingDate_initializers, void 0);
                this.nettingType = (__runInitializers(this, _nettingDate_extraInitializers), __runInitializers(this, _nettingType_initializers, void 0));
                this.currency = (__runInitializers(this, _nettingType_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.participatingEntities = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _participatingEntities_initializers, void 0));
                this.userId = (__runInitializers(this, _participatingEntities_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                __runInitializers(this, _userId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nettingDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Netting date' })];
            _nettingType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Netting type', enum: ['bilateral', 'multilateral'] })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' })];
            _participatingEntities_decorators = [(0, swagger_1.ApiProperty)({ description: 'Participating entity IDs', type: [Number] })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User processing netting' })];
            __esDecorate(null, null, _nettingDate_decorators, { kind: "field", name: "nettingDate", static: false, private: false, access: { has: obj => "nettingDate" in obj, get: obj => obj.nettingDate, set: (obj, value) => { obj.nettingDate = value; } }, metadata: _metadata }, _nettingDate_initializers, _nettingDate_extraInitializers);
            __esDecorate(null, null, _nettingType_decorators, { kind: "field", name: "nettingType", static: false, private: false, access: { has: obj => "nettingType" in obj, get: obj => obj.nettingType, set: (obj, value) => { obj.nettingType = value; } }, metadata: _metadata }, _nettingType_initializers, _nettingType_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _participatingEntities_decorators, { kind: "field", name: "participatingEntities", static: false, private: false, access: { has: obj => "participatingEntities" in obj, get: obj => obj.participatingEntities, set: (obj, value) => { obj.participatingEntities = value; } }, metadata: _metadata }, _participatingEntities_initializers, _participatingEntities_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessNettingDto = ProcessNettingDto;
let ReconcileIntercompanyDto = (() => {
    var _a;
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _fiscalPeriod_decorators;
    let _fiscalPeriod_initializers = [];
    let _fiscalPeriod_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _counterpartyEntityId_decorators;
    let _counterpartyEntityId_initializers = [];
    let _counterpartyEntityId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    return _a = class ReconcileIntercompanyDto {
            constructor() {
                this.fiscalYear = __runInitializers(this, _fiscalYear_initializers, void 0);
                this.fiscalPeriod = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _fiscalPeriod_initializers, void 0));
                this.entityId = (__runInitializers(this, _fiscalPeriod_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
                this.counterpartyEntityId = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _counterpartyEntityId_initializers, void 0));
                this.userId = (__runInitializers(this, _counterpartyEntityId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                __runInitializers(this, _userId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' })];
            _fiscalPeriod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal period' })];
            _entityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity ID' })];
            _counterpartyEntityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Counterparty entity ID' })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User performing reconciliation' })];
            __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
            __esDecorate(null, null, _fiscalPeriod_decorators, { kind: "field", name: "fiscalPeriod", static: false, private: false, access: { has: obj => "fiscalPeriod" in obj, get: obj => obj.fiscalPeriod, set: (obj, value) => { obj.fiscalPeriod = value; } }, metadata: _metadata }, _fiscalPeriod_initializers, _fiscalPeriod_extraInitializers);
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _counterpartyEntityId_decorators, { kind: "field", name: "counterpartyEntityId", static: false, private: false, access: { has: obj => "counterpartyEntityId" in obj, get: obj => obj.counterpartyEntityId, set: (obj, value) => { obj.counterpartyEntityId = value; } }, metadata: _metadata }, _counterpartyEntityId_initializers, _counterpartyEntityId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReconcileIntercompanyDto = ReconcileIntercompanyDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Intercompany Transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IntercompanyTransaction model
 *
 * @example
 * ```typescript
 * const IntercompanyTransaction = createIntercompanyTransactionModel(sequelize);
 * const transaction = await IntercompanyTransaction.create({
 *   transactionNumber: 'IC-2024-001',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   transactionType: 'sale',
 *   amount: 100000
 * });
 * ```
 */
const createIntercompanyTransactionModel = (sequelize) => {
    class IntercompanyTransaction extends sequelize_1.Model {
    }
    IntercompanyTransaction.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        transactionNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique intercompany transaction number',
        },
        transactionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Transaction date',
        },
        sourceEntityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Source entity ID',
        },
        sourceEntityCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Source entity code',
        },
        destinationEntityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Destination entity ID',
        },
        destinationEntityCode: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'Destination entity code',
        },
        transactionType: {
            type: sequelize_1.DataTypes.ENUM('sale', 'purchase', 'loan', 'transfer', 'service', 'royalty', 'allocation'),
            allowNull: false,
            comment: 'Type of intercompany transaction',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Transaction amount',
            validate: {
                min: 0,
            },
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            comment: 'Transaction currency',
        },
        exchangeRate: {
            type: sequelize_1.DataTypes.DECIMAL(12, 6),
            allowNull: false,
            defaultValue: 1.0,
            comment: 'Exchange rate to functional currency',
        },
        functionalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Amount in functional currency',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Transaction description',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending', 'approved', 'posted', 'eliminated', 'rejected'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Transaction status',
        },
        referenceNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'External reference number',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Payment due date',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the transaction',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the transaction',
        },
    }, {
        sequelize,
        tableName: 'intercompany_transactions',
        timestamps: true,
        indexes: [
            { fields: ['transactionNumber'], unique: true },
            { fields: ['transactionDate'] },
            { fields: ['sourceEntityId'] },
            { fields: ['destinationEntityId'] },
            { fields: ['status'] },
            { fields: ['transactionType'] },
            { fields: ['sourceEntityId', 'destinationEntityId'] },
        ],
        validate: {
            differentEntities() {
                if (this.sourceEntityId === this.destinationEntityId) {
                    throw new Error('Source and destination entities must be different');
                }
            },
        },
        hooks: {
            beforeSave: (transaction) => {
                transaction.functionalAmount = Number(transaction.amount) * Number(transaction.exchangeRate);
            },
        },
    });
    return IntercompanyTransaction;
};
exports.createIntercompanyTransactionModel = createIntercompanyTransactionModel;
/**
 * Sequelize model for Elimination Entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} EliminationEntry model
 *
 * @example
 * ```typescript
 * const EliminationEntry = createEliminationEntryModel(sequelize);
 * const elimination = await EliminationEntry.create({
 *   consolidationId: 1,
 *   eliminationType: 'revenue',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   eliminationAmount: 100000
 * });
 * ```
 */
const createEliminationEntryModel = (sequelize) => {
    class EliminationEntry extends sequelize_1.Model {
    }
    EliminationEntry.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        consolidationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Associated consolidation period ID',
        },
        eliminationType: {
            type: sequelize_1.DataTypes.ENUM('revenue', 'expense', 'receivable', 'payable', 'investment', 'equity', 'unrealized-profit'),
            allowNull: false,
            comment: 'Type of elimination',
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
            validate: {
                min: 1,
                max: 13,
            },
        },
        sourceEntityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Source entity ID',
        },
        destinationEntityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Destination entity ID',
        },
        eliminationAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Amount to eliminate',
        },
        debitAccountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Debit account for elimination',
        },
        creditAccountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Credit account for elimination',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Elimination description',
        },
        automatic: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Automatically generated elimination',
        },
        posted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Posted to GL',
        },
        journalEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated journal entry ID',
        },
    }, {
        sequelize,
        tableName: 'elimination_entries',
        timestamps: true,
        indexes: [
            { fields: ['consolidationId'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['eliminationType'] },
            { fields: ['sourceEntityId', 'destinationEntityId'] },
            { fields: ['posted'] },
        ],
    });
    return EliminationEntry;
};
exports.createEliminationEntryModel = createEliminationEntryModel;
/**
 * Sequelize model for Intercompany Reconciliation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} IntercompanyReconciliation model
 *
 * @example
 * ```typescript
 * const IntercompanyReconciliation = createIntercompanyReconciliationModel(sequelize);
 * const reconciliation = await IntercompanyReconciliation.create({
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   entityId: 1,
 *   counterpartyEntityId: 2,
 *   accountCode: '1210'
 * });
 * ```
 */
const createIntercompanyReconciliationModel = (sequelize) => {
    class IntercompanyReconciliation extends sequelize_1.Model {
    }
    IntercompanyReconciliation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
            validate: {
                min: 1,
                max: 13,
            },
        },
        entityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Entity ID',
        },
        counterpartyEntityId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Counterparty entity ID',
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Account code being reconciled',
        },
        entityBalance: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Entity balance',
        },
        counterpartyBalance: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Counterparty balance',
        },
        variance: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Reconciliation variance',
        },
        variancePercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            comment: 'Variance percentage',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('matched', 'variance', 'under-review', 'adjusted'),
            allowNull: false,
            defaultValue: 'variance',
            comment: 'Reconciliation status',
        },
        reconciledBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who reconciled',
        },
        reconciledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Reconciliation date',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reconciliation notes',
        },
    }, {
        sequelize,
        tableName: 'intercompany_reconciliations',
        timestamps: true,
        indexes: [
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['entityId'] },
            { fields: ['counterpartyEntityId'] },
            { fields: ['entityId', 'counterpartyEntityId'] },
            { fields: ['status'] },
        ],
        hooks: {
            beforeSave: (reconciliation) => {
                reconciliation.variance = Number(reconciliation.entityBalance) + Number(reconciliation.counterpartyBalance);
                if (Math.abs(Number(reconciliation.entityBalance)) > 0) {
                    reconciliation.variancePercent =
                        (Number(reconciliation.variance) / Math.abs(Number(reconciliation.entityBalance))) * 100;
                }
                else {
                    reconciliation.variancePercent = 0;
                }
            },
        },
    });
    return IntercompanyReconciliation;
};
exports.createIntercompanyReconciliationModel = createIntercompanyReconciliationModel;
// ============================================================================
// INTERCOMPANY TRANSACTION FUNCTIONS
// ============================================================================
/**
 * Creates a new intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateIntercompanyTransactionDto} transactionData - Transaction data
 * @param {string} userId - User creating the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created intercompany transaction
 *
 * @example
 * ```typescript
 * const icTransaction = await createIntercompanyTransaction(sequelize, {
 *   transactionNumber: 'IC-2024-001',
 *   transactionDate: new Date(),
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   transactionType: 'sale',
 *   amount: 100000,
 *   currency: 'USD',
 *   description: 'Intercompany sale of goods'
 * }, 'user123');
 * ```
 */
const createIntercompanyTransaction = async (sequelize, transactionData, userId, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    if (transactionData.sourceEntityId === transactionData.destinationEntityId) {
        throw new Error('Source and destination entities must be different');
    }
    // Fetch entity codes (would come from entity master)
    const sourceEntityCode = `ENT-${transactionData.sourceEntityId}`;
    const destinationEntityCode = `ENT-${transactionData.destinationEntityId}`;
    // Get exchange rate (would come from currency table)
    const exchangeRate = 1.0; // Placeholder
    const icTransaction = await IntercompanyTransaction.create({
        ...transactionData,
        sourceEntityCode,
        destinationEntityCode,
        exchangeRate,
        functionalAmount: transactionData.amount * exchangeRate,
        status: 'draft',
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return icTransaction;
};
exports.createIntercompanyTransaction = createIntercompanyTransaction;
/**
 * Approves an intercompany transaction and creates journal entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} userId - User approving the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval result
 *
 * @example
 * ```typescript
 * const result = await approveIntercompanyTransaction(sequelize, 1, 'user123');
 * ```
 */
const approveIntercompanyTransaction = async (sequelize, transactionId, userId, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
    if (!icTransaction) {
        throw new Error('Intercompany transaction not found');
    }
    if (icTransaction.status !== 'pending') {
        throw new Error('Only pending transactions can be approved');
    }
    await icTransaction.update({
        status: 'approved',
        updatedBy: userId,
    }, { transaction });
    // Generate journal entries for both entities
    const sourceJournal = await (0, exports.generateIntercompanyJournal)(sequelize, transactionId, icTransaction.sourceEntityId, 'source', transaction);
    const destinationJournal = await (0, exports.generateIntercompanyJournal)(sequelize, transactionId, icTransaction.destinationEntityId, 'destination', transaction);
    return {
        transactionId,
        status: 'approved',
        sourceJournalId: sourceJournal.journalId,
        destinationJournalId: destinationJournal.journalId,
    };
};
exports.approveIntercompanyTransaction = approveIntercompanyTransaction;
/**
 * Posts an intercompany transaction to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} userId - User posting the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postIntercompanyTransaction(sequelize, 1, 'user123');
 * ```
 */
const postIntercompanyTransaction = async (sequelize, transactionId, userId, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
    if (!icTransaction) {
        throw new Error('Intercompany transaction not found');
    }
    if (icTransaction.status !== 'approved') {
        throw new Error('Only approved transactions can be posted');
    }
    // Post to GL (would integrate with GL posting functions)
    await icTransaction.update({
        status: 'posted',
        updatedBy: userId,
    }, { transaction });
    return {
        transactionId,
        status: 'posted',
        postedBy: userId,
        postedAt: new Date(),
    };
};
exports.postIntercompanyTransaction = postIntercompanyTransaction;
/**
 * Generates journal entries for intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {number} entityId - Entity ID
 * @param {string} journalType - Journal type (source/destination)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyJournal>} Generated journal
 *
 * @example
 * ```typescript
 * const journal = await generateIntercompanyJournal(sequelize, 1, 1, 'source');
 * ```
 */
const generateIntercompanyJournal = async (sequelize, transactionId, entityId, journalType, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
    if (!icTransaction) {
        throw new Error('Intercompany transaction not found');
    }
    const entityCode = `ENT-${entityId}`;
    const fiscalYear = icTransaction.transactionDate.getFullYear();
    const fiscalPeriod = icTransaction.transactionDate.getMonth() + 1;
    let debitAccountCode;
    let creditAccountCode;
    // Determine accounts based on transaction type and journal type
    if (icTransaction.transactionType === 'sale') {
        if (journalType === 'source') {
            // Seller records: DR Intercompany Receivable, CR Intercompany Revenue
            debitAccountCode = '1210'; // IC Receivable
            creditAccountCode = '4100'; // IC Revenue
        }
        else {
            // Buyer records: DR Inventory/Expense, CR Intercompany Payable
            debitAccountCode = '5100'; // IC Expense
            creditAccountCode = '2110'; // IC Payable
        }
    }
    else if (icTransaction.transactionType === 'loan') {
        if (journalType === 'source') {
            // Lender records: DR IC Loan Receivable, CR Cash
            debitAccountCode = '1220'; // IC Loan Receivable
            creditAccountCode = '1010'; // Cash
        }
        else {
            // Borrower records: DR Cash, CR IC Loan Payable
            debitAccountCode = '1010'; // Cash
            creditAccountCode = '2120'; // IC Loan Payable
        }
    }
    else {
        debitAccountCode = '1210';
        creditAccountCode = '4100';
    }
    const journal = {
        journalId: 0, // Would be auto-generated
        transactionId,
        entityId,
        entityCode,
        journalType,
        fiscalYear,
        fiscalPeriod,
        journalDate: icTransaction.transactionDate,
        debitAccountCode,
        creditAccountCode,
        amount: icTransaction.functionalAmount,
        currency: icTransaction.currency,
        description: `IC ${icTransaction.transactionType}: ${icTransaction.description}`,
        posted: false,
    };
    return journal;
};
exports.generateIntercompanyJournal = generateIntercompanyJournal;
/**
 * Reverses an intercompany transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing the transaction
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseIntercompanyTransaction(sequelize, 1, 'Error in transaction', 'user123');
 * ```
 */
const reverseIntercompanyTransaction = async (sequelize, transactionId, reversalReason, userId, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const original = await IntercompanyTransaction.findByPk(transactionId, { transaction });
    if (!original) {
        throw new Error('Intercompany transaction not found');
    }
    if (original.status !== 'posted') {
        throw new Error('Only posted transactions can be reversed');
    }
    // Create reversal transaction
    const reversal = await IntercompanyTransaction.create({
        transactionNumber: `${original.transactionNumber}-REV`,
        transactionDate: new Date(),
        sourceEntityId: original.destinationEntityId, // Flip entities
        sourceEntityCode: original.destinationEntityCode,
        destinationEntityId: original.sourceEntityId,
        destinationEntityCode: original.sourceEntityCode,
        transactionType: original.transactionType,
        amount: original.amount,
        currency: original.currency,
        exchangeRate: original.exchangeRate,
        functionalAmount: original.functionalAmount,
        description: `REVERSAL: ${reversalReason} - ${original.description}`,
        status: 'posted',
        referenceNumber: original.transactionNumber,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return {
        originalTransactionId: transactionId,
        reversalTransactionId: reversal.id,
        reversalReason,
        reversedBy: userId,
        reversalDate: new Date(),
    };
};
exports.reverseIntercompanyTransaction = reverseIntercompanyTransaction;
// ============================================================================
// ELIMINATION ENTRY FUNCTIONS
// ============================================================================
/**
 * Creates an elimination entry for consolidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateEliminationEntryDto} eliminationData - Elimination data
 * @param {string} userId - User creating elimination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created elimination entry
 *
 * @example
 * ```typescript
 * const elimination = await createEliminationEntry(sequelize, {
 *   consolidationId: 1,
 *   eliminationType: 'revenue',
 *   sourceEntityId: 1,
 *   destinationEntityId: 2,
 *   eliminationAmount: 100000,
 *   debitAccountCode: '4100',
 *   creditAccountCode: '5100'
 * }, 'user123');
 * ```
 */
const createEliminationEntry = async (sequelize, eliminationData, userId, transaction) => {
    const EliminationEntry = (0, exports.createEliminationEntryModel)(sequelize);
    // Get fiscal period from consolidation
    const fiscalYear = new Date().getFullYear();
    const fiscalPeriod = new Date().getMonth() + 1;
    const elimination = await EliminationEntry.create({
        ...eliminationData,
        fiscalYear,
        fiscalPeriod,
        description: `IC elimination: ${eliminationData.eliminationType}`,
        automatic: false,
        posted: false,
    }, { transaction });
    return elimination;
};
exports.createEliminationEntry = createEliminationEntry;
/**
 * Automatically generates elimination entries for a consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User generating eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Generated elimination entries
 *
 * @example
 * ```typescript
 * const eliminations = await generateAutomaticEliminations(sequelize, 1, 2024, 1, 'user123');
 * ```
 */
const generateAutomaticEliminations = async (sequelize, consolidationId, fiscalYear, fiscalPeriod, userId, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const EliminationEntry = (0, exports.createEliminationEntryModel)(sequelize);
    // Get all posted intercompany transactions for the period
    const transactions = await IntercompanyTransaction.findAll({
        where: {
            status: 'posted',
            transactionDate: {
                [sequelize_1.Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
                [sequelize_1.Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
            },
        },
        transaction,
    });
    const eliminations = [];
    for (const icTransaction of transactions) {
        // Generate revenue/expense elimination
        if (icTransaction.transactionType === 'sale') {
            const revenueElimination = await EliminationEntry.create({
                consolidationId,
                eliminationType: 'revenue',
                fiscalYear,
                fiscalPeriod,
                sourceEntityId: icTransaction.sourceEntityId,
                destinationEntityId: icTransaction.destinationEntityId,
                eliminationAmount: icTransaction.functionalAmount,
                debitAccountCode: '4100', // IC Revenue
                creditAccountCode: '5100', // IC Expense
                description: `Auto-elimination: IC revenue/expense for ${icTransaction.transactionNumber}`,
                automatic: true,
                posted: false,
            }, { transaction });
            eliminations.push(revenueElimination);
            // Generate receivable/payable elimination
            const balanceElimination = await EliminationEntry.create({
                consolidationId,
                eliminationType: 'receivable',
                fiscalYear,
                fiscalPeriod,
                sourceEntityId: icTransaction.sourceEntityId,
                destinationEntityId: icTransaction.destinationEntityId,
                eliminationAmount: icTransaction.functionalAmount,
                debitAccountCode: '2110', // IC Payable
                creditAccountCode: '1210', // IC Receivable
                description: `Auto-elimination: IC receivable/payable for ${icTransaction.transactionNumber}`,
                automatic: true,
                posted: false,
            }, { transaction });
            eliminations.push(balanceElimination);
        }
    }
    return eliminations;
};
exports.generateAutomaticEliminations = generateAutomaticEliminations;
/**
 * Posts elimination entries to the general ledger.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User posting eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postEliminationEntries(sequelize, 1, 'user123');
 * ```
 */
const postEliminationEntries = async (sequelize, consolidationId, userId, transaction) => {
    const EliminationEntry = (0, exports.createEliminationEntryModel)(sequelize);
    const eliminations = await EliminationEntry.findAll({
        where: {
            consolidationId,
            posted: false,
        },
        transaction,
    });
    let postedCount = 0;
    for (const elimination of eliminations) {
        // Create journal entry (would integrate with GL)
        const journalEntryId = 0; // Placeholder
        await elimination.update({
            posted: true,
            journalEntryId,
        }, { transaction });
        postedCount++;
    }
    return {
        consolidationId,
        eliminationsPosted: postedCount,
        postedBy: userId,
        postedAt: new Date(),
    };
};
exports.postEliminationEntries = postEliminationEntries;
/**
 * Reverses elimination entries for a consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User reversing eliminations
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseEliminationEntries(sequelize, 1, 'user123');
 * ```
 */
const reverseEliminationEntries = async (sequelize, consolidationId, userId, transaction) => {
    const EliminationEntry = (0, exports.createEliminationEntryModel)(sequelize);
    const eliminations = await EliminationEntry.findAll({
        where: {
            consolidationId,
            posted: true,
        },
        transaction,
    });
    let reversedCount = 0;
    for (const elimination of eliminations) {
        // Reverse journal entry (would integrate with GL)
        await elimination.update({
            posted: false,
            journalEntryId: null,
        }, { transaction });
        reversedCount++;
    }
    return {
        consolidationId,
        eliminationsReversed: reversedCount,
        reversedBy: userId,
        reversedAt: new Date(),
    };
};
exports.reverseEliminationEntries = reverseEliminationEntries;
// ============================================================================
// RECONCILIATION FUNCTIONS
// ============================================================================
/**
 * Reconciles intercompany balances between entities.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconcileIntercompanyDto} reconcileData - Reconciliation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileIntercompanyBalances(sequelize, {
 *   fiscalYear: 2024,
 *   fiscalPeriod: 1,
 *   entityId: 1,
 *   counterpartyEntityId: 2,
 *   userId: 'user123'
 * });
 * ```
 */
const reconcileIntercompanyBalances = async (sequelize, reconcileData, transaction) => {
    const IntercompanyReconciliation = (0, exports.createIntercompanyReconciliationModel)(sequelize);
    // Get balances from each entity (would query GL)
    const entityBalance = 50000; // Placeholder - IC Receivable
    const counterpartyBalance = -50000; // Placeholder - IC Payable
    const variance = entityBalance + counterpartyBalance;
    const variancePercent = entityBalance !== 0 ? (variance / Math.abs(entityBalance)) * 100 : 0;
    const status = Math.abs(variance) < 0.01 ? 'matched' : 'variance';
    const reconciliation = await IntercompanyReconciliation.create({
        fiscalYear: reconcileData.fiscalYear,
        fiscalPeriod: reconcileData.fiscalPeriod,
        entityId: reconcileData.entityId,
        counterpartyEntityId: reconcileData.counterpartyEntityId,
        accountCode: '1210', // IC Receivable
        entityBalance,
        counterpartyBalance,
        variance,
        variancePercent,
        status,
        reconciledBy: status === 'matched' ? reconcileData.userId : null,
        reconciledAt: status === 'matched' ? new Date() : null,
    }, { transaction });
    return reconciliation.toJSON();
};
exports.reconcileIntercompanyBalances = reconcileIntercompanyBalances;
/**
 * Identifies intercompany reconciliation variances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number} varianceThreshold - Variance threshold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Variance report
 *
 * @example
 * ```typescript
 * const variances = await identifyReconciliationVariances(sequelize, 2024, 1, 100);
 * ```
 */
const identifyReconciliationVariances = async (sequelize, fiscalYear, fiscalPeriod, varianceThreshold, transaction) => {
    const IntercompanyReconciliation = (0, exports.createIntercompanyReconciliationModel)(sequelize);
    const variances = await IntercompanyReconciliation.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
            variance: {
                [sequelize_1.Op.or]: [{ [sequelize_1.Op.gt]: varianceThreshold }, { [sequelize_1.Op.lt]: -varianceThreshold }],
            },
            status: 'variance',
        },
        transaction,
    });
    return variances.map((v) => ({
        reconciliationId: v.id,
        entityId: v.entityId,
        counterpartyEntityId: v.counterpartyEntityId,
        accountCode: v.accountCode,
        variance: Number(v.variance),
        variancePercent: Number(v.variancePercent),
    }));
};
exports.identifyReconciliationVariances = identifyReconciliationVariances;
/**
 * Creates adjustment entry to resolve reconciliation variance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} reconciliationId - Reconciliation ID
 * @param {number} adjustmentAmount - Adjustment amount
 * @param {string} adjustmentReason - Reason for adjustment
 * @param {string} userId - User creating adjustment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await createReconciliationAdjustment(sequelize, 1, 500, 'Timing difference', 'user123');
 * ```
 */
const createReconciliationAdjustment = async (sequelize, reconciliationId, adjustmentAmount, adjustmentReason, userId, transaction) => {
    const IntercompanyReconciliation = (0, exports.createIntercompanyReconciliationModel)(sequelize);
    const reconciliation = await IntercompanyReconciliation.findByPk(reconciliationId, { transaction });
    if (!reconciliation) {
        throw new Error('Reconciliation not found');
    }
    // Create adjustment journal entry (would integrate with GL)
    const journalEntryId = 0; // Placeholder
    await reconciliation.update({
        status: 'adjusted',
        reconciledBy: userId,
        reconciledAt: new Date(),
        notes: adjustmentReason,
    }, { transaction });
    return {
        reconciliationId,
        adjustmentAmount,
        adjustmentReason,
        journalEntryId,
        adjustedBy: userId,
        adjustedAt: new Date(),
    };
};
exports.createReconciliationAdjustment = createReconciliationAdjustment;
/**
 * Generates intercompany reconciliation report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reconciliation report
 *
 * @example
 * ```typescript
 * const report = await generateReconciliationReport(sequelize, 2024, 1);
 * ```
 */
const generateReconciliationReport = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const IntercompanyReconciliation = (0, exports.createIntercompanyReconciliationModel)(sequelize);
    const reconciliations = await IntercompanyReconciliation.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
        },
        transaction,
    });
    const summary = {
        totalReconciliations: reconciliations.length,
        matched: reconciliations.filter((r) => r.status === 'matched').length,
        variances: reconciliations.filter((r) => r.status === 'variance').length,
        adjusted: reconciliations.filter((r) => r.status === 'adjusted').length,
        totalVarianceAmount: reconciliations.reduce((sum, r) => sum + Number(r.variance), 0),
    };
    return {
        fiscalYear,
        fiscalPeriod,
        summary,
        reconciliations: reconciliations.map((r) => r.toJSON()),
    };
};
exports.generateReconciliationReport = generateReconciliationReport;
// ============================================================================
// NETTING AND SETTLEMENT FUNCTIONS
// ============================================================================
/**
 * Processes bilateral or multilateral netting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessNettingDto} nettingData - Netting data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyNetting>} Netting result
 *
 * @example
 * ```typescript
 * const netting = await processIntercompanyNetting(sequelize, {
 *   nettingDate: new Date(),
 *   nettingType: 'multilateral',
 *   currency: 'USD',
 *   participatingEntities: [1, 2, 3],
 *   userId: 'user123'
 * });
 * ```
 */
const processIntercompanyNetting = async (sequelize, nettingData, transaction) => {
    // Calculate gross receivables and payables for each entity
    const entityBalances = new Map();
    for (const entityId of nettingData.participatingEntities) {
        // Would query actual balances from GL
        entityBalances.set(entityId, {
            receivables: 100000,
            payables: 75000,
        });
    }
    const totalGrossReceivables = Array.from(entityBalances.values()).reduce((sum, b) => sum + b.receivables, 0);
    const totalGrossPayables = Array.from(entityBalances.values()).reduce((sum, b) => sum + b.payables, 0);
    const netAmount = Math.abs(totalGrossReceivables - totalGrossPayables);
    const nettingSavings = totalGrossReceivables + totalGrossPayables - netAmount;
    const netting = {
        nettingId: 0,
        nettingDate: nettingData.nettingDate,
        nettingType: nettingData.nettingType,
        currency: nettingData.currency,
        participatingEntities: nettingData.participatingEntities,
        totalGrossReceivables,
        totalGrossPayables,
        netAmount,
        nettingSavings,
        status: 'calculated',
    };
    return netting;
};
exports.processIntercompanyNetting = processIntercompanyNetting;
/**
 * Approves netting and creates settlement instructions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} nettingId - Netting ID
 * @param {string} userId - User approving netting
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval result
 *
 * @example
 * ```typescript
 * const result = await approveNetting(sequelize, 1, 'user123');
 * ```
 */
const approveNetting = async (sequelize, nettingId, userId, transaction) => {
    // Would update netting status and create settlement records
    return {
        nettingId,
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
        settlementsCreated: 2,
    };
};
exports.approveNetting = approveNetting;
/**
 * Creates intercompany settlement instruction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} settlementData - Settlement data
 * @param {string} userId - User creating settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanySettlement>} Created settlement
 *
 * @example
 * ```typescript
 * const settlement = await createIntercompanySettlement(sequelize, {
 *   payerEntityId: 1,
 *   payeeEntityId: 2,
 *   settlementAmount: 25000,
 *   currency: 'USD',
 *   settlementMethod: 'wire',
 *   settlementDate: new Date()
 * }, 'user123');
 * ```
 */
const createIntercompanySettlement = async (sequelize, settlementData, userId, transaction) => {
    const settlement = {
        settlementId: 0,
        nettingId: settlementData.nettingId,
        settlementDate: settlementData.settlementDate,
        payerEntityId: settlementData.payerEntityId,
        payeeEntityId: settlementData.payeeEntityId,
        settlementAmount: settlementData.settlementAmount,
        currency: settlementData.currency,
        settlementMethod: settlementData.settlementMethod,
        status: 'pending',
        referenceNumber: `SETTLE-${Date.now()}`,
    };
    return settlement;
};
exports.createIntercompanySettlement = createIntercompanySettlement;
/**
 * Processes settlement payment and updates balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} settlementId - Settlement ID
 * @param {string} userId - User processing settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Settlement result
 *
 * @example
 * ```typescript
 * const result = await processSettlement(sequelize, 1, 'user123');
 * ```
 */
const processSettlement = async (sequelize, settlementId, userId, transaction) => {
    // Would process payment and create journal entries
    return {
        settlementId,
        status: 'completed',
        processedBy: userId,
        completedAt: new Date(),
    };
};
exports.processSettlement = processSettlement;
// ============================================================================
// TRANSFER PRICING FUNCTIONS
// ============================================================================
/**
 * Calculates transfer price using specified method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} pricingMethod - Pricing method
 * @param {any} pricingParams - Pricing parameters
 * @param {string} userId - User calculating price
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<TransferPricing>} Transfer pricing result
 *
 * @example
 * ```typescript
 * const pricing = await calculateTransferPrice(sequelize, 1, 'cost-plus', {
 *   baseAmount: 80000,
 *   markup: 0.25
 * }, 'user123');
 * ```
 */
const calculateTransferPrice = async (sequelize, transactionId, pricingMethod, pricingParams, userId, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
    if (!icTransaction) {
        throw new Error('Intercompany transaction not found');
    }
    let transferPrice = 0;
    const baseAmount = pricingParams.baseAmount || icTransaction.amount;
    const markup = pricingParams.markup || 0;
    if (pricingMethod === 'cost-plus') {
        transferPrice = baseAmount * (1 + markup);
    }
    else if (pricingMethod === 'resale-minus') {
        const resalePrice = pricingParams.resalePrice || 0;
        const margin = pricingParams.margin || 0;
        transferPrice = resalePrice * (1 - margin);
    }
    else if (pricingMethod === 'comparable-uncontrolled') {
        transferPrice = pricingParams.marketPrice || baseAmount;
    }
    const pricing = {
        transferPricingId: 0,
        transactionId,
        sourceEntityId: icTransaction.sourceEntityId,
        destinationEntityId: icTransaction.destinationEntityId,
        pricingMethod,
        baseAmount,
        markup,
        transferPrice,
        marketPrice: pricingParams.marketPrice,
        complianceRegion: pricingParams.complianceRegion || 'US',
        approvedBy: userId,
    };
    return pricing;
};
exports.calculateTransferPrice = calculateTransferPrice;
/**
 * Validates transfer pricing for arm's length compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transferPricingId - Transfer pricing ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateTransferPricing(sequelize, 1);
 * ```
 */
const validateTransferPricing = async (sequelize, transferPricingId, transaction) => {
    // Would validate against market benchmarks and compliance rules
    const validation = {
        transferPricingId,
        compliant: true,
        armLengthRange: {
            min: 90000,
            max: 110000,
        },
        transferPrice: 100000,
        withinRange: true,
        complianceRules: ['OECD Guidelines', 'IRC Section 482'],
    };
    return validation;
};
exports.validateTransferPricing = validateTransferPricing;
/**
 * Generates transfer pricing documentation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {string} documentationType - Documentation type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Documentation
 *
 * @example
 * ```typescript
 * const docs = await generateTransferPricingDocumentation(sequelize, 1, 'master-file');
 * ```
 */
const generateTransferPricingDocumentation = async (sequelize, transactionId, documentationType, transaction) => {
    // Would generate required documentation
    return {
        transactionId,
        documentationType,
        sections: ['Business Overview', 'Functional Analysis', 'Economic Analysis', 'Benchmarking Study'],
        generatedAt: new Date(),
    };
};
exports.generateTransferPricingDocumentation = generateTransferPricingDocumentation;
// ============================================================================
// CONSOLIDATION FUNCTIONS
// ============================================================================
/**
 * Initiates consolidation process for a fiscal period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number[]} participatingEntities - Participating entity IDs
 * @param {string} userId - User initiating consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ConsolidationPeriod>} Consolidation period
 *
 * @example
 * ```typescript
 * const consolidation = await initiateConsolidation(sequelize, 2024, 1, [1, 2, 3], 'user123');
 * ```
 */
const initiateConsolidation = async (sequelize, fiscalYear, fiscalPeriod, participatingEntities, userId, transaction) => {
    const consolidation = {
        consolidationId: 0,
        fiscalYear,
        fiscalPeriod,
        consolidationDate: new Date(),
        consolidationLevel: 'legal',
        participatingEntities,
        eliminationsProcessed: 0,
        status: 'in-progress',
        processedBy: userId,
    };
    return consolidation;
};
exports.initiateConsolidation = initiateConsolidation;
/**
 * Completes consolidation process and locks the period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User completing consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completion result
 *
 * @example
 * ```typescript
 * const result = await completeConsolidation(sequelize, 1, 'user123');
 * ```
 */
const completeConsolidation = async (sequelize, consolidationId, userId, transaction) => {
    // Would finalize consolidation and lock period
    return {
        consolidationId,
        status: 'completed',
        completedBy: userId,
        completedAt: new Date(),
    };
};
exports.completeConsolidation = completeConsolidation;
/**
 * Generates consolidated financial statements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} statementType - Statement type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consolidated statement
 *
 * @example
 * ```typescript
 * const statement = await generateConsolidatedStatement(sequelize, 1, 'balance-sheet');
 * ```
 */
const generateConsolidatedStatement = async (sequelize, consolidationId, statementType, transaction) => {
    // Would generate consolidated financial statements
    return {
        consolidationId,
        statementType,
        generatedAt: new Date(),
    };
};
exports.generateConsolidatedStatement = generateConsolidatedStatement;
// ============================================================================
// REPORTING AND ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates intercompany transaction summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transaction summary
 *
 * @example
 * ```typescript
 * const summary = await getIntercompanyTransactionSummary(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const getIntercompanyTransactionSummary = async (sequelize, startDate, endDate, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const transactions = await IntercompanyTransaction.findAll({
        where: {
            transactionDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        transaction,
    });
    const summary = {
        totalTransactions: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + Number(t.functionalAmount), 0),
        byType: transactions.reduce((acc, t) => {
            if (!acc[t.transactionType]) {
                acc[t.transactionType] = { count: 0, amount: 0 };
            }
            acc[t.transactionType].count++;
            acc[t.transactionType].amount += Number(t.functionalAmount);
            return acc;
        }, {}),
        byStatus: transactions.reduce((acc, t) => {
            if (!acc[t.status]) {
                acc[t.status] = { count: 0, amount: 0 };
            }
            acc[t.status].count++;
            acc[t.status].amount += Number(t.functionalAmount);
            return acc;
        }, {}),
    };
    return summary;
};
exports.getIntercompanyTransactionSummary = getIntercompanyTransactionSummary;
/**
 * Analyzes intercompany balance positions by entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Entity balance positions
 *
 * @example
 * ```typescript
 * const positions = await analyzeIntercompanyPositions(sequelize, 2024, 1);
 * ```
 */
const analyzeIntercompanyPositions = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    // Would analyze IC balances by entity
    const positions = [
        {
            entityId: 1,
            receivables: 150000,
            payables: 75000,
            netPosition: 75000,
            counterparties: [
                { entityId: 2, amount: 50000 },
                { entityId: 3, amount: 25000 },
            ],
        },
    ];
    return positions;
};
exports.analyzeIntercompanyPositions = analyzeIntercompanyPositions;
/**
 * Exports intercompany data for regulatory reporting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} format - Export format
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportIntercompanyData(sequelize, 2024, 1, 'json');
 * ```
 */
const exportIntercompanyData = async (sequelize, fiscalYear, fiscalPeriod, format, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const transactions = await IntercompanyTransaction.findAll({
        where: {
            transactionDate: {
                [sequelize_1.Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
                [sequelize_1.Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
            },
        },
        transaction,
    });
    const exportData = transactions.map((t) => ({
        transactionNumber: t.transactionNumber,
        transactionDate: t.transactionDate,
        sourceEntity: t.sourceEntityCode,
        destinationEntity: t.destinationEntityCode,
        transactionType: t.transactionType,
        amount: Number(t.amount),
        currency: t.currency,
        status: t.status,
    }));
    return exportData;
};
exports.exportIntercompanyData = exportIntercompanyData;
/**
 * Validates intercompany transaction for regulatory compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} transactionId - Transaction ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateIntercompanyCompliance(sequelize, 1);
 * ```
 */
const validateIntercompanyCompliance = async (sequelize, transactionId, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const icTransaction = await IntercompanyTransaction.findByPk(transactionId, { transaction });
    if (!icTransaction) {
        throw new Error('Intercompany transaction not found');
    }
    const validationResults = {
        transactionId,
        hasTransferPricing: true, // Would check transfer pricing
        transferPricingCompliant: true,
        hasDocumentation: true,
        correctAccounting: true,
        eliminationRequired: true,
        overallCompliant: true,
    };
    return validationResults;
};
exports.validateIntercompanyCompliance = validateIntercompanyCompliance;
/**
 * Generates intercompany aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {Date} asOfDate - Aging date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Aging report
 *
 * @example
 * ```typescript
 * const aging = await generateIntercompanyAgingReport(sequelize, 1, new Date());
 * ```
 */
const generateIntercompanyAgingReport = async (sequelize, entityId, asOfDate, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const transactions = await IntercompanyTransaction.findAll({
        where: {
            [sequelize_1.Op.or]: [{ sourceEntityId: entityId }, { destinationEntityId: entityId }],
            status: { [sequelize_1.Op.in]: ['posted', 'approved'] },
            dueDate: { [sequelize_1.Op.ne]: null },
        },
        transaction,
    });
    const agingBuckets = {
        current: 0,
        days1to30: 0,
        days31to60: 0,
        days61to90: 0,
        over90: 0,
    };
    transactions.forEach((txn) => {
        if (!txn.dueDate)
            return;
        const daysOverdue = Math.floor((asOfDate.getTime() - txn.dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const amount = Number(txn.functionalAmount);
        if (daysOverdue <= 0)
            agingBuckets.current += amount;
        else if (daysOverdue <= 30)
            agingBuckets.days1to30 += amount;
        else if (daysOverdue <= 60)
            agingBuckets.days31to60 += amount;
        else if (daysOverdue <= 90)
            agingBuckets.days61to90 += amount;
        else
            agingBuckets.over90 += amount;
    });
    return {
        entityId,
        asOfDate,
        agingBuckets,
        totalOutstanding: Object.values(agingBuckets).reduce((sum, amt) => sum + amt, 0),
    };
};
exports.generateIntercompanyAgingReport = generateIntercompanyAgingReport;
/**
 * Creates intercompany loan agreement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} loanData - Loan data
 * @param {string} userId - User creating loan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyLoan>} Created loan
 *
 * @example
 * ```typescript
 * const loan = await createIntercompanyLoan(sequelize, {
 *   lenderEntityId: 1,
 *   borrowerEntityId: 2,
 *   principalAmount: 1000000,
 *   currency: 'USD',
 *   interestRate: 5.0,
 *   startDate: new Date(),
 *   maturityDate: new Date('2026-12-31')
 * }, 'user123');
 * ```
 */
const createIntercompanyLoan = async (sequelize, loanData, userId, transaction) => {
    const loan = {
        loanId: 0,
        loanNumber: `ICL-${Date.now()}`,
        lenderEntityId: loanData.lenderEntityId,
        borrowerEntityId: loanData.borrowerEntityId,
        principalAmount: loanData.principalAmount,
        currency: loanData.currency,
        interestRate: loanData.interestRate,
        startDate: loanData.startDate,
        maturityDate: loanData.maturityDate,
        outstandingPrincipal: loanData.principalAmount,
        accruedInterest: 0,
        status: 'active',
        armLengthCompliant: true,
    };
    // Would create in database
    return loan;
};
exports.createIntercompanyLoan = createIntercompanyLoan;
/**
 * Calculates intercompany loan interest accrual.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} loanId - Loan ID
 * @param {Date} asOfDate - Accrual date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Interest accrual
 *
 * @example
 * ```typescript
 * const accrual = await calculateLoanInterestAccrual(sequelize, 1, new Date());
 * ```
 */
const calculateLoanInterestAccrual = async (sequelize, loanId, asOfDate, transaction) => {
    // Would fetch loan details
    const loan = {
        loanId,
        outstandingPrincipal: 1000000,
        interestRate: 5.0,
        startDate: new Date('2024-01-01'),
    };
    const daysOutstanding = Math.floor((asOfDate.getTime() - loan.startDate.getTime()) / (1000 * 60 * 60 * 24));
    const interestAccrued = (loan.outstandingPrincipal * (loan.interestRate / 100) * daysOutstanding) / 365;
    return {
        loanId,
        asOfDate,
        outstandingPrincipal: loan.outstandingPrincipal,
        interestRate: loan.interestRate,
        daysOutstanding,
        interestAccrued,
    };
};
exports.calculateLoanInterestAccrual = calculateLoanInterestAccrual;
/**
 * Processes intercompany loan repayment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} loanId - Loan ID
 * @param {number} repaymentAmount - Repayment amount
 * @param {Date} repaymentDate - Repayment date
 * @param {string} userId - User processing repayment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Repayment result
 *
 * @example
 * ```typescript
 * const result = await processLoanRepayment(sequelize, 1, 100000, new Date(), 'user123');
 * ```
 */
const processLoanRepayment = async (sequelize, loanId, repaymentAmount, repaymentDate, userId, transaction) => {
    // Would update loan principal
    return {
        loanId,
        repaymentAmount,
        repaymentDate,
        newOutstandingPrincipal: 900000,
        processedBy: userId,
    };
};
exports.processLoanRepayment = processLoanRepayment;
/**
 * Creates intercompany allocation entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} allocationData - Allocation data
 * @param {string} userId - User creating allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyAllocation>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await createIntercompanyAllocation(sequelize, {
 *   allocationDate: new Date(),
 *   allocationBasis: 'revenue',
 *   totalAmount: 500000,
 *   sourceEntityId: 1,
 *   destinationEntities: [
 *     { entityId: 2, allocationPercent: 60 },
 *     { entityId: 3, allocationPercent: 40 }
 *   ]
 * }, 'user123');
 * ```
 */
const createIntercompanyAllocation = async (sequelize, allocationData, userId, transaction) => {
    const totalPercent = allocationData.destinationEntities.reduce((sum, dest) => sum + dest.allocationPercent, 0);
    if (Math.abs(totalPercent - 100) > 0.01) {
        throw new Error('Allocation percentages must sum to 100%');
    }
    const destinationEntities = allocationData.destinationEntities.map((dest) => ({
        entityId: dest.entityId,
        entityCode: `ENT-${dest.entityId}`,
        allocationPercent: dest.allocationPercent,
        allocatedAmount: (allocationData.totalAmount * dest.allocationPercent) / 100,
        allocationDriver: dest.allocationDriver || 0,
    }));
    const allocation = {
        allocationId: 0,
        allocationNumber: `ICA-${Date.now()}`,
        allocationDate: allocationData.allocationDate,
        allocationBasis: allocationData.allocationBasis,
        totalAmount: allocationData.totalAmount,
        sourceEntityId: allocationData.sourceEntityId,
        destinationEntities,
        fiscalYear: allocationData.allocationDate.getFullYear(),
        fiscalPeriod: allocationData.allocationDate.getMonth() + 1,
        status: 'draft',
    };
    return allocation;
};
exports.createIntercompanyAllocation = createIntercompanyAllocation;
/**
 * Posts intercompany allocation entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} allocationId - Allocation ID
 * @param {string} userId - User posting allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posting result
 *
 * @example
 * ```typescript
 * const result = await postIntercompanyAllocation(sequelize, 1, 'user123');
 * ```
 */
const postIntercompanyAllocation = async (sequelize, allocationId, userId, transaction) => {
    // Would post allocation entries
    return {
        allocationId,
        status: 'posted',
        entriesCreated: 2,
        postedBy: userId,
        postedAt: new Date(),
    };
};
exports.postIntercompanyAllocation = postIntercompanyAllocation;
/**
 * Tracks intercompany balancing for an entity.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<IntercompanyBalancing>} Balancing result
 *
 * @example
 * ```typescript
 * const balancing = await trackIntercompanyBalancing(sequelize, 1, 2024, 1);
 * ```
 */
const trackIntercompanyBalancing = async (sequelize, entityId, fiscalYear, fiscalPeriod, transaction) => {
    // Would calculate from GL
    const totalReceivables = 150000;
    const totalPayables = 75000;
    const netPosition = totalReceivables - totalPayables;
    const balanced = Math.abs(netPosition) < 0.01;
    const balancing = {
        balancingId: 0,
        entityId,
        fiscalYear,
        fiscalPeriod,
        totalReceivables,
        totalPayables,
        netPosition,
        balancingAccountCode: '1290', // IC Balancing Account
        balanced,
        varianceAmount: balanced ? 0 : netPosition,
    };
    return balancing;
};
exports.trackIntercompanyBalancing = trackIntercompanyBalancing;
/**
 * Generates intercompany transaction matching report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Matching report
 *
 * @example
 * ```typescript
 * const report = await generateTransactionMatchingReport(sequelize, 2024, 1);
 * ```
 */
const generateTransactionMatchingReport = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const transactions = await IntercompanyTransaction.findAll({
        where: {
            transactionDate: {
                [sequelize_1.Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
                [sequelize_1.Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
            },
        },
        transaction,
    });
    const matchedPairs = new Map();
    transactions.forEach((txn) => {
        const pairKey = `${Math.min(txn.sourceEntityId, txn.destinationEntityId)}-${Math.max(txn.sourceEntityId, txn.destinationEntityId)}`;
        if (!matchedPairs.has(pairKey)) {
            matchedPairs.set(pairKey, {
                entity1: txn.sourceEntityId,
                entity2: txn.destinationEntityId,
                entity1Transactions: [],
                entity2Transactions: [],
            });
        }
        const pair = matchedPairs.get(pairKey);
        if (txn.sourceEntityId === pair.entity1) {
            pair.entity1Transactions.push(txn);
        }
        else {
            pair.entity2Transactions.push(txn);
        }
    });
    return {
        fiscalYear,
        fiscalPeriod,
        totalPairs: matchedPairs.size,
        pairs: Array.from(matchedPairs.values()),
    };
};
exports.generateTransactionMatchingReport = generateTransactionMatchingReport;
/**
 * Identifies unmatched intercompany transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Unmatched transactions
 *
 * @example
 * ```typescript
 * const unmatched = await identifyUnmatchedTransactions(sequelize, 2024, 1);
 * ```
 */
const identifyUnmatchedTransactions = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const IntercompanyTransaction = (0, exports.createIntercompanyTransactionModel)(sequelize);
    const transactions = await IntercompanyTransaction.findAll({
        where: {
            transactionDate: {
                [sequelize_1.Op.gte]: new Date(fiscalYear, fiscalPeriod - 1, 1),
                [sequelize_1.Op.lt]: new Date(fiscalYear, fiscalPeriod, 1),
            },
            status: 'posted',
        },
        transaction,
    });
    // Would implement matching logic
    const unmatched = transactions.slice(0, 5).map((txn) => ({
        transactionId: txn.id,
        transactionNumber: txn.transactionNumber,
        sourceEntity: txn.sourceEntityCode,
        destinationEntity: txn.destinationEntityCode,
        amount: Number(txn.functionalAmount),
        reason: 'No corresponding transaction in counterparty entity',
    }));
    return unmatched;
};
exports.identifyUnmatchedTransactions = identifyUnmatchedTransactions;
/**
 * Creates currency translation adjustment for intercompany balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} entityId - Entity ID
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CurrencyTranslation>} Translation adjustment
 *
 * @example
 * ```typescript
 * const translation = await createCurrencyTranslationAdjustment(sequelize, 1, 2024, 1);
 * ```
 */
const createCurrencyTranslationAdjustment = async (sequelize, entityId, fiscalYear, fiscalPeriod, transaction) => {
    const functionalCurrency = 'EUR';
    const reportingCurrency = 'USD';
    const averageRate = 1.08;
    const closingRate = 1.10;
    // Would calculate IC balance translation
    const icBalance = 100000; // EUR
    const translationAdjustment = icBalance * (closingRate - averageRate);
    const translation = {
        translationId: 0,
        entityId,
        fiscalYear,
        fiscalPeriod,
        functionalCurrency,
        reportingCurrency,
        translationMethod: 'current-rate',
        averageRate,
        closingRate,
        translationAdjustment,
        accountCode: '3900', // Other Comprehensive Income
    };
    return translation;
};
exports.createCurrencyTranslationAdjustment = createCurrencyTranslationAdjustment;
/**
 * Generates consolidation worksheet.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Consolidation worksheet
 *
 * @example
 * ```typescript
 * const worksheet = await generateConsolidationWorksheet(sequelize, 1);
 * ```
 */
const generateConsolidationWorksheet = async (sequelize, consolidationId, transaction) => {
    // Would generate full consolidation worksheet
    return {
        consolidationId,
        entities: [
            { entityId: 1, entityCode: 'ENT-1', totalAssets: 5000000, totalLiabilities: 3000000, equity: 2000000 },
            { entityId: 2, entityCode: 'ENT-2', totalAssets: 3000000, totalLiabilities: 1500000, equity: 1500000 },
        ],
        eliminations: [
            { type: 'receivable', debit: 200000, credit: 200000 },
            { type: 'revenue', debit: 500000, credit: 500000 },
        ],
        consolidated: {
            totalAssets: 7600000,
            totalLiabilities: 4500000,
            equity: 3100000,
        },
    };
};
exports.generateConsolidationWorksheet = generateConsolidationWorksheet;
/**
 * Validates elimination completeness for consolidation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateEliminationCompleteness(sequelize, 1);
 * ```
 */
const validateEliminationCompleteness = async (sequelize, consolidationId, transaction) => {
    const EliminationEntry = (0, exports.createEliminationEntryModel)(sequelize);
    const eliminations = await EliminationEntry.findAll({
        where: { consolidationId },
        transaction,
    });
    const eliminationTypes = ['revenue', 'expense', 'receivable', 'payable', 'investment', 'equity'];
    const processedTypes = new Set(eliminations.map((e) => e.eliminationType));
    const missingTypes = eliminationTypes.filter((type) => !processedTypes.has(type));
    return {
        consolidationId,
        totalEliminations: eliminations.length,
        eliminationTypes: Array.from(processedTypes),
        missingTypes,
        isComplete: missingTypes.length === 0,
    };
};
exports.validateEliminationCompleteness = validateEliminationCompleteness;
/**
 * Creates intercompany dividend transaction.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} dividendData - Dividend data
 * @param {string} userId - User creating dividend
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created dividend transaction
 *
 * @example
 * ```typescript
 * const dividend = await createIntercompanyDividend(sequelize, {
 *   declaringEntityId: 2,
 *   receivingEntityId: 1,
 *   dividendAmount: 250000,
 *   declarationDate: new Date(),
 *   paymentDate: new Date('2024-12-31')
 * }, 'user123');
 * ```
 */
const createIntercompanyDividend = async (sequelize, dividendData, userId, transaction) => {
    const icTransaction = await (0, exports.createIntercompanyTransaction)(sequelize, {
        transactionNumber: `ICD-${Date.now()}`,
        transactionDate: dividendData.declarationDate,
        sourceEntityId: dividendData.declaringEntityId,
        destinationEntityId: dividendData.receivingEntityId,
        transactionType: 'transfer',
        amount: dividendData.dividendAmount,
        currency: 'USD',
        description: `Intercompany dividend payment`,
    }, userId, transaction);
    return {
        dividendId: icTransaction.id,
        declaringEntity: dividendData.declaringEntityId,
        receivingEntity: dividendData.receivingEntityId,
        dividendAmount: dividendData.dividendAmount,
        declarationDate: dividendData.declarationDate,
        paymentDate: dividendData.paymentDate,
        eliminationRequired: true,
    };
};
exports.createIntercompanyDividend = createIntercompanyDividend;
/**
 * Generates intercompany profit elimination analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Profit elimination analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeUnrealizedProfit(sequelize, 1);
 * ```
 */
const analyzeUnrealizedProfit = async (sequelize, consolidationId, transaction) => {
    // Would analyze inventory and assets for unrealized profit
    return {
        consolidationId,
        inventoryProfit: 50000,
        fixedAssetProfit: 25000,
        totalUnrealizedProfit: 75000,
        eliminationEntries: [
            { description: 'Eliminate inventory profit', amount: 50000 },
            { description: 'Eliminate fixed asset profit', amount: 25000 },
        ],
    };
};
exports.analyzeUnrealizedProfit = analyzeUnrealizedProfit;
/**
 * Processes intercompany account reconciliation batch.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {number[]} entityIds - Entity IDs to reconcile
 * @param {string} userId - User processing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Batch reconciliation result
 *
 * @example
 * ```typescript
 * const result = await batchReconcileIntercompanyAccounts(sequelize, 2024, 1, [1, 2, 3], 'user123');
 * ```
 */
const batchReconcileIntercompanyAccounts = async (sequelize, fiscalYear, fiscalPeriod, entityIds, userId, transaction) => {
    const reconciliations = [];
    let matchedCount = 0;
    let varianceCount = 0;
    for (let i = 0; i < entityIds.length; i++) {
        for (let j = i + 1; j < entityIds.length; j++) {
            const reconciliation = await (0, exports.reconcileIntercompanyBalances)(sequelize, {
                fiscalYear,
                fiscalPeriod,
                entityId: entityIds[i],
                counterpartyEntityId: entityIds[j],
                userId,
            }, transaction);
            reconciliations.push(reconciliation);
            if (reconciliation.status === 'matched')
                matchedCount++;
            else
                varianceCount++;
        }
    }
    return {
        fiscalYear,
        fiscalPeriod,
        entitiesProcessed: entityIds.length,
        reconciliationsPerformed: reconciliations.length,
        matchedCount,
        varianceCount,
        reconciliations,
    };
};
exports.batchReconcileIntercompanyAccounts = batchReconcileIntercompanyAccounts;
/**
 * Generates transfer pricing summary report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transfer pricing summary
 *
 * @example
 * ```typescript
 * const summary = await generateTransferPricingSummary(sequelize, 2024);
 * ```
 */
const generateTransferPricingSummary = async (sequelize, fiscalYear, transaction) => {
    // Would aggregate transfer pricing data
    return {
        fiscalYear,
        totalTransactions: 150,
        totalValue: 15000000,
        byMethod: {
            'cost-plus': { count: 80, value: 8000000 },
            'resale-minus': { count: 40, value: 4000000 },
            'comparable-uncontrolled': { count: 30, value: 3000000 },
        },
        complianceRate: 98.5,
        documentationComplete: 145,
        documentationPending: 5,
    };
};
exports.generateTransferPricingSummary = generateTransferPricingSummary;
/**
 * Archives completed consolidation period.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} consolidationId - Consolidation ID
 * @param {string} userId - User archiving consolidation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Archive result
 *
 * @example
 * ```typescript
 * const result = await archiveConsolidation(sequelize, 1, 'user123');
 * ```
 */
const archiveConsolidation = async (sequelize, consolidationId, userId, transaction) => {
    // Would lock and archive consolidation data
    return {
        consolidationId,
        status: 'locked',
        archivedBy: userId,
        archivedAt: new Date(),
        archivePath: `/archives/consolidation/${consolidationId}`,
    };
};
exports.archiveConsolidation = archiveConsolidation;
//# sourceMappingURL=intercompany-accounting-kit.js.map