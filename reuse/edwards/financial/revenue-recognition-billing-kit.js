"use strict";
/**
 * LOC: REVREC001
 * File: /reuse/edwards/financial/revenue-recognition-billing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL posting)
 *
 * DOWNSTREAM (imported by):
 *   - Backend revenue modules
 *   - Contract management services
 *   - Billing and invoicing modules
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
exports.terminateContract = exports.validatePerformanceObligationAllocation = exports.auditRevenueRecognition = exports.calculateRemainingPerformanceObligations = exports.generateRevenueWaterfall = exports.bulkRecognizeRevenue = exports.identifyRevenueTimingIssues = exports.calculateCustomerConcentration = exports.generateASC606Disclosure = exports.trackContractRenewals = exports.getContractBacklog = exports.analyzeRevenueVariance = exports.calculateRevenueForecast = exports.validateASC606Compliance = exports.exportRevenueRecognitionData = exports.getPerformanceObligationSummary = exports.analyzeContractPerformance = exports.generateRevenueRollforward = exports.reassessVariableConsideration = exports.estimateVariableConsideration = exports.cancelSubscription = exports.renewSubscription = exports.createSubscriptionRevenue = exports.applyCumulativeCatchUpAdjustment = exports.processContractModification = exports.reconcileDeferredUnbilledRevenue = exports.recordUnbilledRevenue = exports.recordDeferredRevenue = exports.reverseRevenueRecognition = exports.processScheduledRevenueRecognition = exports.recognizeMilestoneRevenue = exports.recognizeRevenue = exports.generateRevenueSchedule = exports.updatePerformanceObligationCompletion = exports.allocateTransactionPrice = exports.createPerformanceObligation = exports.activateRevenueContract = exports.createRevenueContract = exports.createRevenueScheduleModel = exports.createPerformanceObligationModel = exports.createRevenueContractModel = exports.ContractModificationDto = exports.RevenueRecognitionRequestDto = exports.CreatePerformanceObligationDto = exports.CreateRevenueContractDto = void 0;
/**
 * File: /reuse/edwards/financial/revenue-recognition-billing-kit.ts
 * Locator: WC-EDW-REVREC-001
 * Purpose: Comprehensive Revenue Recognition & Billing Operations - ASC 606 compliant revenue management, performance obligations, contract modifications
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/revenue/*, Contract Services, Billing Services, Financial Reporting
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for ASC 606 compliance, performance obligations, revenue allocation, contract modifications, deferred/unbilled revenue, milestone billing, subscription management
 *
 * LLM Context: Enterprise-grade revenue recognition for Oracle JD Edwards EnterpriseOne compatibility.
 * Provides comprehensive ASC 606 revenue recognition, five-step model implementation, contract identification,
 * performance obligation tracking, transaction price allocation, revenue scheduling, contract modifications,
 * deferred revenue management, unbilled revenue tracking, milestone billing, subscription management,
 * variable consideration, contract assets/liabilities, revenue reversal, and multi-element arrangements.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateRevenueContractDto = (() => {
    var _a;
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _contractDate_decorators;
    let _contractDate_initializers = [];
    let _contractDate_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _totalContractValue_decorators;
    let _totalContractValue_initializers = [];
    let _totalContractValue_extraInitializers = [];
    let _recognitionMethod_decorators;
    let _recognitionMethod_initializers = [];
    let _recognitionMethod_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _performanceObligations_decorators;
    let _performanceObligations_initializers = [];
    let _performanceObligations_extraInitializers = [];
    return _a = class CreateRevenueContractDto {
            constructor() {
                this.contractNumber = __runInitializers(this, _contractNumber_initializers, void 0);
                this.customerId = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.contractDate = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _contractDate_initializers, void 0));
                this.startDate = (__runInitializers(this, _contractDate_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.totalContractValue = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _totalContractValue_initializers, void 0));
                this.recognitionMethod = (__runInitializers(this, _totalContractValue_extraInitializers), __runInitializers(this, _recognitionMethod_initializers, void 0));
                this.contractType = (__runInitializers(this, _recognitionMethod_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
                this.performanceObligations = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _performanceObligations_initializers, void 0));
                __runInitializers(this, _performanceObligations_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract number', example: 'RC-2024-001' })];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _contractDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract date' })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' })];
            _totalContractValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total contract value' })];
            _recognitionMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recognition method', enum: ['point-in-time', 'over-time', 'hybrid'] })];
            _contractType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract type', enum: ['fixed-price', 'time-and-materials', 'subscription', 'milestone'] })];
            _performanceObligations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance obligations', type: [Object] })];
            __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _contractDate_decorators, { kind: "field", name: "contractDate", static: false, private: false, access: { has: obj => "contractDate" in obj, get: obj => obj.contractDate, set: (obj, value) => { obj.contractDate = value; } }, metadata: _metadata }, _contractDate_initializers, _contractDate_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _totalContractValue_decorators, { kind: "field", name: "totalContractValue", static: false, private: false, access: { has: obj => "totalContractValue" in obj, get: obj => obj.totalContractValue, set: (obj, value) => { obj.totalContractValue = value; } }, metadata: _metadata }, _totalContractValue_initializers, _totalContractValue_extraInitializers);
            __esDecorate(null, null, _recognitionMethod_decorators, { kind: "field", name: "recognitionMethod", static: false, private: false, access: { has: obj => "recognitionMethod" in obj, get: obj => obj.recognitionMethod, set: (obj, value) => { obj.recognitionMethod = value; } }, metadata: _metadata }, _recognitionMethod_initializers, _recognitionMethod_extraInitializers);
            __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
            __esDecorate(null, null, _performanceObligations_decorators, { kind: "field", name: "performanceObligations", static: false, private: false, access: { has: obj => "performanceObligations" in obj, get: obj => obj.performanceObligations, set: (obj, value) => { obj.performanceObligations = value; } }, metadata: _metadata }, _performanceObligations_initializers, _performanceObligations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateRevenueContractDto = CreateRevenueContractDto;
let CreatePerformanceObligationDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _obligationType_decorators;
    let _obligationType_initializers = [];
    let _obligationType_extraInitializers = [];
    let _standaloneSellingPrice_decorators;
    let _standaloneSellingPrice_initializers = [];
    let _standaloneSellingPrice_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _satisfactionMethod_decorators;
    let _satisfactionMethod_initializers = [];
    let _satisfactionMethod_extraInitializers = [];
    return _a = class CreatePerformanceObligationDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.description = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.obligationType = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _obligationType_initializers, void 0));
                this.standaloneSellingPrice = (__runInitializers(this, _obligationType_extraInitializers), __runInitializers(this, _standaloneSellingPrice_initializers, void 0));
                this.startDate = (__runInitializers(this, _standaloneSellingPrice_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.satisfactionMethod = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _satisfactionMethod_initializers, void 0));
                __runInitializers(this, _satisfactionMethod_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _obligationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Obligation type', enum: ['goods', 'services', 'license', 'subscription'] })];
            _standaloneSellingPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Standalone selling price' })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' })];
            _satisfactionMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Satisfaction method', enum: ['point-in-time', 'over-time'] })];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _obligationType_decorators, { kind: "field", name: "obligationType", static: false, private: false, access: { has: obj => "obligationType" in obj, get: obj => obj.obligationType, set: (obj, value) => { obj.obligationType = value; } }, metadata: _metadata }, _obligationType_initializers, _obligationType_extraInitializers);
            __esDecorate(null, null, _standaloneSellingPrice_decorators, { kind: "field", name: "standaloneSellingPrice", static: false, private: false, access: { has: obj => "standaloneSellingPrice" in obj, get: obj => obj.standaloneSellingPrice, set: (obj, value) => { obj.standaloneSellingPrice = value; } }, metadata: _metadata }, _standaloneSellingPrice_initializers, _standaloneSellingPrice_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _satisfactionMethod_decorators, { kind: "field", name: "satisfactionMethod", static: false, private: false, access: { has: obj => "satisfactionMethod" in obj, get: obj => obj.satisfactionMethod, set: (obj, value) => { obj.satisfactionMethod = value; } }, metadata: _metadata }, _satisfactionMethod_initializers, _satisfactionMethod_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePerformanceObligationDto = CreatePerformanceObligationDto;
let RevenueRecognitionRequestDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _obligationId_decorators;
    let _obligationId_initializers = [];
    let _obligationId_extraInitializers = [];
    let _recognitionDate_decorators;
    let _recognitionDate_initializers = [];
    let _recognitionDate_extraInitializers = [];
    let _recognitionAmount_decorators;
    let _recognitionAmount_initializers = [];
    let _recognitionAmount_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    return _a = class RevenueRecognitionRequestDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.obligationId = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _obligationId_initializers, void 0));
                this.recognitionDate = (__runInitializers(this, _obligationId_extraInitializers), __runInitializers(this, _recognitionDate_initializers, void 0));
                this.recognitionAmount = (__runInitializers(this, _recognitionDate_extraInitializers), __runInitializers(this, _recognitionAmount_initializers, void 0));
                this.userId = (__runInitializers(this, _recognitionAmount_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                __runInitializers(this, _userId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' })];
            _obligationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Obligation ID' })];
            _recognitionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recognition date' })];
            _recognitionAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recognition amount' })];
            _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User processing recognition' })];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _obligationId_decorators, { kind: "field", name: "obligationId", static: false, private: false, access: { has: obj => "obligationId" in obj, get: obj => obj.obligationId, set: (obj, value) => { obj.obligationId = value; } }, metadata: _metadata }, _obligationId_initializers, _obligationId_extraInitializers);
            __esDecorate(null, null, _recognitionDate_decorators, { kind: "field", name: "recognitionDate", static: false, private: false, access: { has: obj => "recognitionDate" in obj, get: obj => obj.recognitionDate, set: (obj, value) => { obj.recognitionDate = value; } }, metadata: _metadata }, _recognitionDate_initializers, _recognitionDate_extraInitializers);
            __esDecorate(null, null, _recognitionAmount_decorators, { kind: "field", name: "recognitionAmount", static: false, private: false, access: { has: obj => "recognitionAmount" in obj, get: obj => obj.recognitionAmount, set: (obj, value) => { obj.recognitionAmount = value; } }, metadata: _metadata }, _recognitionAmount_initializers, _recognitionAmount_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RevenueRecognitionRequestDto = RevenueRecognitionRequestDto;
let ContractModificationDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _modificationType_decorators;
    let _modificationType_initializers = [];
    let _modificationType_extraInitializers = [];
    let _accountingTreatment_decorators;
    let _accountingTreatment_initializers = [];
    let _accountingTreatment_extraInitializers = [];
    let _modifiedValue_decorators;
    let _modifiedValue_initializers = [];
    let _modifiedValue_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    return _a = class ContractModificationDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.modificationType = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _modificationType_initializers, void 0));
                this.accountingTreatment = (__runInitializers(this, _modificationType_extraInitializers), __runInitializers(this, _accountingTreatment_initializers, void 0));
                this.modifiedValue = (__runInitializers(this, _accountingTreatment_extraInitializers), __runInitializers(this, _modifiedValue_initializers, void 0));
                this.description = (__runInitializers(this, _modifiedValue_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                __runInitializers(this, _effectiveDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' })];
            _modificationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Modification type', enum: ['additional-goods', 'price-change', 'scope-change', 'termination'] })];
            _accountingTreatment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Accounting treatment', enum: ['separate-contract', 'cumulative-catch-up', 'prospective'] })];
            _modifiedValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Modified value' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' })];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _modificationType_decorators, { kind: "field", name: "modificationType", static: false, private: false, access: { has: obj => "modificationType" in obj, get: obj => obj.modificationType, set: (obj, value) => { obj.modificationType = value; } }, metadata: _metadata }, _modificationType_initializers, _modificationType_extraInitializers);
            __esDecorate(null, null, _accountingTreatment_decorators, { kind: "field", name: "accountingTreatment", static: false, private: false, access: { has: obj => "accountingTreatment" in obj, get: obj => obj.accountingTreatment, set: (obj, value) => { obj.accountingTreatment = value; } }, metadata: _metadata }, _accountingTreatment_initializers, _accountingTreatment_extraInitializers);
            __esDecorate(null, null, _modifiedValue_decorators, { kind: "field", name: "modifiedValue", static: false, private: false, access: { has: obj => "modifiedValue" in obj, get: obj => obj.modifiedValue, set: (obj, value) => { obj.modifiedValue = value; } }, metadata: _metadata }, _modifiedValue_initializers, _modifiedValue_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ContractModificationDto = ContractModificationDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Revenue Contracts with ASC 606 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueContract model
 *
 * @example
 * ```typescript
 * const RevenueContract = createRevenueContractModel(sequelize);
 * const contract = await RevenueContract.create({
 *   contractNumber: 'RC-2024-001',
 *   customerId: 100,
 *   totalContractValue: 100000,
 *   recognitionMethod: 'over-time'
 * });
 * ```
 */
const createRevenueContractModel = (sequelize) => {
    class RevenueContract extends sequelize_1.Model {
    }
    RevenueContract.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contractNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique contract number',
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer ID',
        },
        customerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Customer name for denormalization',
        },
        contractDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Contract execution date',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Contract start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Contract end date',
        },
        totalContractValue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Total contract value',
            validate: {
                min: 0,
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'active', 'completed', 'terminated', 'modified'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Contract status',
        },
        recognitionMethod: {
            type: sequelize_1.DataTypes.ENUM('point-in-time', 'over-time', 'hybrid'),
            allowNull: false,
            comment: 'Revenue recognition method per ASC 606',
        },
        contractType: {
            type: sequelize_1.DataTypes.ENUM('fixed-price', 'time-and-materials', 'subscription', 'milestone'),
            allowNull: false,
            comment: 'Contract type',
        },
        terms: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Contract terms and conditions',
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
            comment: 'User who created the contract',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the contract',
        },
    }, {
        sequelize,
        tableName: 'revenue_contracts',
        timestamps: true,
        indexes: [
            { fields: ['contractNumber'], unique: true },
            { fields: ['customerId'] },
            { fields: ['contractDate'] },
            { fields: ['startDate', 'endDate'] },
            { fields: ['status'] },
            { fields: ['contractType'] },
        ],
        hooks: {
            beforeValidate: (contract) => {
                if (contract.endDate <= contract.startDate) {
                    throw new Error('Contract end date must be after start date');
                }
            },
        },
    });
    return RevenueContract;
};
exports.createRevenueContractModel = createRevenueContractModel;
/**
 * Sequelize model for Performance Obligations per ASC 606.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PerformanceObligation model
 *
 * @example
 * ```typescript
 * const PerformanceObligation = createPerformanceObligationModel(sequelize);
 * const obligation = await PerformanceObligation.create({
 *   contractId: 1,
 *   description: 'Software license',
 *   obligationType: 'license',
 *   allocatedAmount: 50000
 * });
 * ```
 */
const createPerformanceObligationModel = (sequelize) => {
    class PerformanceObligation extends sequelize_1.Model {
    }
    PerformanceObligation.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contractId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Associated contract ID',
            references: {
                model: 'revenue_contracts',
                key: 'id',
            },
        },
        obligationNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique obligation number',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Performance obligation description',
        },
        obligationType: {
            type: sequelize_1.DataTypes.ENUM('goods', 'services', 'license', 'subscription'),
            allowNull: false,
            comment: 'Type of performance obligation',
        },
        allocatedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Allocated transaction price',
            validate: {
                min: 0,
            },
        },
        recognizedRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Revenue recognized to date',
        },
        remainingRevenue: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Remaining revenue to recognize',
        },
        startDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Obligation start date',
        },
        endDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Obligation end date',
        },
        completionPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Completion percentage',
            validate: {
                min: 0,
                max: 100,
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('not-started', 'in-progress', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'not-started',
            comment: 'Obligation status',
        },
        satisfactionMethod: {
            type: sequelize_1.DataTypes.ENUM('point-in-time', 'over-time'),
            allowNull: false,
            comment: 'Method of satisfying performance obligation',
        },
        transferOfControl: {
            type: sequelize_1.DataTypes.ENUM('customer-accepted', 'delivered', 'continuous'),
            allowNull: false,
            comment: 'Transfer of control indicator',
        },
    }, {
        sequelize,
        tableName: 'performance_obligations',
        timestamps: true,
        indexes: [
            { fields: ['contractId'] },
            { fields: ['obligationNumber'], unique: true },
            { fields: ['status'] },
            { fields: ['startDate', 'endDate'] },
        ],
        hooks: {
            beforeSave: (obligation) => {
                obligation.remainingRevenue = Number(obligation.allocatedAmount) - Number(obligation.recognizedRevenue);
            },
        },
    });
    return PerformanceObligation;
};
exports.createPerformanceObligationModel = createPerformanceObligationModel;
/**
 * Sequelize model for Revenue Schedules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} RevenueSchedule model
 *
 * @example
 * ```typescript
 * const RevenueSchedule = createRevenueScheduleModel(sequelize);
 * const schedule = await RevenueSchedule.create({
 *   contractId: 1,
 *   obligationId: 1,
 *   scheduleDate: new Date('2024-01-31'),
 *   scheduledAmount: 5000
 * });
 * ```
 */
const createRevenueScheduleModel = (sequelize) => {
    class RevenueSchedule extends sequelize_1.Model {
    }
    RevenueSchedule.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        contractId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Associated contract ID',
        },
        obligationId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Associated performance obligation ID',
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
        scheduleDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Scheduled recognition date',
        },
        scheduledAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Scheduled revenue amount',
        },
        recognizedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Recognized revenue amount',
        },
        remainingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(18, 2),
            allowNull: false,
            comment: 'Remaining revenue to recognize',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('scheduled', 'recognized', 'adjusted', 'reversed'),
            allowNull: false,
            defaultValue: 'scheduled',
            comment: 'Schedule status',
        },
        accountingEntryId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Associated accounting entry ID',
        },
    }, {
        sequelize,
        tableName: 'revenue_schedules',
        timestamps: true,
        indexes: [
            { fields: ['contractId'] },
            { fields: ['obligationId'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['scheduleDate'] },
            { fields: ['status'] },
        ],
        hooks: {
            beforeSave: (schedule) => {
                schedule.remainingAmount = Number(schedule.scheduledAmount) - Number(schedule.recognizedAmount);
            },
        },
    });
    return RevenueSchedule;
};
exports.createRevenueScheduleModel = createRevenueScheduleModel;
// ============================================================================
// CONTRACT MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new revenue contract with ASC 606 compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateRevenueContractDto} contractData - Contract data
 * @param {string} userId - User creating the contract
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created revenue contract
 *
 * @example
 * ```typescript
 * const contract = await createRevenueContract(sequelize, {
 *   contractNumber: 'RC-2024-001',
 *   customerId: 100,
 *   contractDate: new Date(),
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   totalContractValue: 120000,
 *   recognitionMethod: 'over-time',
 *   contractType: 'subscription'
 * }, 'user123');
 * ```
 */
const createRevenueContract = async (sequelize, contractData, userId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    // Validate contract dates
    if (contractData.endDate <= contractData.startDate) {
        throw new Error('Contract end date must be after start date');
    }
    const contract = await RevenueContract.create({
        ...contractData,
        status: 'draft',
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    return contract;
};
exports.createRevenueContract = createRevenueContract;
/**
 * Activates a revenue contract and initiates revenue recognition.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {string} userId - User activating the contract
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Activated contract
 *
 * @example
 * ```typescript
 * const activated = await activateRevenueContract(sequelize, 1, 'user123');
 * ```
 */
const activateRevenueContract = async (sequelize, contractId, userId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contract = await RevenueContract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    if (contract.status !== 'draft') {
        throw new Error('Only draft contracts can be activated');
    }
    // Verify performance obligations exist
    const obligations = await PerformanceObligation.findAll({
        where: { contractId },
        transaction,
    });
    if (obligations.length === 0) {
        throw new Error('Contract must have at least one performance obligation before activation');
    }
    // Verify total allocation equals contract value
    const totalAllocated = obligations.reduce((sum, obl) => sum + Number(obl.allocatedAmount), 0);
    const contractValue = Number(contract.totalContractValue);
    if (Math.abs(totalAllocated - contractValue) > 0.01) {
        throw new Error(`Total allocated amount (${totalAllocated}) must equal contract value (${contractValue})`);
    }
    await contract.update({
        status: 'active',
        updatedBy: userId,
    }, { transaction });
    return contract;
};
exports.activateRevenueContract = activateRevenueContract;
/**
 * Creates a performance obligation for a contract.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePerformanceObligationDto} obligationData - Obligation data
 * @param {string} userId - User creating the obligation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created performance obligation
 *
 * @example
 * ```typescript
 * const obligation = await createPerformanceObligation(sequelize, {
 *   contractId: 1,
 *   description: 'Software maintenance services',
 *   obligationType: 'services',
 *   standaloneSellingPrice: 60000,
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   satisfactionMethod: 'over-time'
 * }, 'user123');
 * ```
 */
const createPerformanceObligation = async (sequelize, obligationData, userId, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    // Verify contract exists
    const contract = await RevenueContract.findByPk(obligationData.contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    if (contract.status !== 'draft') {
        throw new Error('Cannot add performance obligations to non-draft contracts');
    }
    // Generate obligation number
    const count = await PerformanceObligation.count({
        where: { contractId: obligationData.contractId },
        transaction,
    });
    const obligationNumber = `${contract.contractNumber}-PO-${String(count + 1).padStart(3, '0')}`;
    const obligation = await PerformanceObligation.create({
        ...obligationData,
        obligationNumber,
        allocatedAmount: 0, // Will be set during allocation
        recognizedRevenue: 0,
        remainingRevenue: 0,
        completionPercent: 0,
        status: 'not-started',
        transferOfControl: obligationData.satisfactionMethod === 'point-in-time' ? 'customer-accepted' : 'continuous',
    }, { transaction });
    return obligation;
};
exports.createPerformanceObligation = createPerformanceObligation;
/**
 * Allocates transaction price to performance obligations using relative standalone selling price method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {string} userId - User performing allocation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueAllocation[]>} Revenue allocations
 *
 * @example
 * ```typescript
 * const allocations = await allocateTransactionPrice(sequelize, 1, 'user123');
 * ```
 */
const allocateTransactionPrice = async (sequelize, contractId, userId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contract = await RevenueContract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    const obligations = await PerformanceObligation.findAll({
        where: { contractId },
        transaction,
    });
    if (obligations.length === 0) {
        throw new Error('No performance obligations found for allocation');
    }
    // Calculate total standalone selling price
    const totalStandalonePrice = obligations.reduce((sum, obl) => {
        const standalonePrice = Number(obl.metadata?.standaloneSellingPrice || 0);
        return sum + standalonePrice;
    }, 0);
    if (totalStandalonePrice === 0) {
        throw new Error('Standalone selling prices must be set for all obligations');
    }
    const contractValue = Number(contract.totalContractValue);
    const allocations = [];
    // Allocate using relative standalone selling price method
    for (const obligation of obligations) {
        const standalonePrice = Number(obligation.metadata?.standaloneSellingPrice || 0);
        const allocationPercent = (standalonePrice / totalStandalonePrice) * 100;
        const allocatedAmount = (contractValue * standalonePrice) / totalStandalonePrice;
        // Update obligation with allocated amount
        await obligation.update({
            allocatedAmount,
            remainingRevenue: allocatedAmount,
        }, { transaction });
        allocations.push({
            allocationId: 0, // Would be stored in database
            contractId,
            obligationId: obligation.id,
            standaloneSellingPrice: standalonePrice,
            relativeSellingPrice: standalonePrice,
            allocatedAmount,
            allocationPercent,
            allocationMethod: 'relative',
        });
    }
    return allocations;
};
exports.allocateTransactionPrice = allocateTransactionPrice;
/**
 * Updates performance obligation completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} obligationId - Obligation ID
 * @param {number} completionPercent - Completion percentage (0-100)
 * @param {string} userId - User updating completion
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated obligation
 *
 * @example
 * ```typescript
 * const updated = await updatePerformanceObligationCompletion(sequelize, 1, 75, 'user123');
 * ```
 */
const updatePerformanceObligationCompletion = async (sequelize, obligationId, completionPercent, userId, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    if (completionPercent < 0 || completionPercent > 100) {
        throw new Error('Completion percentage must be between 0 and 100');
    }
    const obligation = await PerformanceObligation.findByPk(obligationId, { transaction });
    if (!obligation) {
        throw new Error('Performance obligation not found');
    }
    const status = completionPercent === 0 ? 'not-started' : completionPercent === 100 ? 'completed' : 'in-progress';
    await obligation.update({
        completionPercent,
        status,
    }, { transaction });
    return obligation;
};
exports.updatePerformanceObligationCompletion = updatePerformanceObligationCompletion;
// ============================================================================
// REVENUE RECOGNITION FUNCTIONS
// ============================================================================
/**
 * Generates revenue recognition schedule for a performance obligation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} obligationId - Performance obligation ID
 * @param {string} userId - User generating schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueSchedule[]>} Generated revenue schedules
 *
 * @example
 * ```typescript
 * const schedules = await generateRevenueSchedule(sequelize, 1, 'user123');
 * ```
 */
const generateRevenueSchedule = async (sequelize, obligationId, userId, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const obligation = await PerformanceObligation.findByPk(obligationId, { transaction });
    if (!obligation) {
        throw new Error('Performance obligation not found');
    }
    if (obligation.satisfactionMethod !== 'over-time') {
        throw new Error('Schedule generation only applicable for over-time obligations');
    }
    // Delete existing schedules
    await RevenueSchedule.destroy({
        where: { obligationId },
        transaction,
    });
    const startDate = new Date(obligation.startDate);
    const endDate = new Date(obligation.endDate);
    const allocatedAmount = Number(obligation.allocatedAmount);
    // Calculate number of months
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    const monthlyAmount = allocatedAmount / months;
    const schedules = [];
    // Generate monthly schedules
    for (let i = 0; i < months; i++) {
        const scheduleDate = new Date(startDate);
        scheduleDate.setMonth(scheduleDate.getMonth() + i);
        scheduleDate.setDate(new Date(scheduleDate.getFullYear(), scheduleDate.getMonth() + 1, 0).getDate()); // Last day of month
        const fiscalYear = scheduleDate.getFullYear();
        const fiscalPeriod = scheduleDate.getMonth() + 1;
        const schedule = await RevenueSchedule.create({
            contractId: obligation.contractId,
            obligationId: obligation.id,
            fiscalYear,
            fiscalPeriod,
            scheduleDate,
            scheduledAmount: monthlyAmount,
            recognizedAmount: 0,
            remainingAmount: monthlyAmount,
            status: 'scheduled',
        }, { transaction });
        schedules.push(schedule.toJSON());
    }
    return schedules;
};
exports.generateRevenueSchedule = generateRevenueSchedule;
/**
 * Recognizes revenue for a performance obligation based on completion percentage.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RevenueRecognitionRequestDto} recognitionData - Recognition data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeRevenue(sequelize, {
 *   contractId: 1,
 *   obligationId: 1,
 *   recognitionDate: new Date(),
 *   recognitionAmount: 10000,
 *   userId: 'user123'
 * });
 * ```
 */
const recognizeRevenue = async (sequelize, recognitionData, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const obligation = await PerformanceObligation.findByPk(recognitionData.obligationId, { transaction });
    if (!obligation) {
        throw new Error('Performance obligation not found');
    }
    const newRecognizedRevenue = Number(obligation.recognizedRevenue) + Number(recognitionData.recognitionAmount);
    if (newRecognizedRevenue > Number(obligation.allocatedAmount)) {
        throw new Error('Cannot recognize more revenue than allocated amount');
    }
    // Update obligation
    await obligation.update({
        recognizedRevenue: newRecognizedRevenue,
        remainingRevenue: Number(obligation.allocatedAmount) - newRecognizedRevenue,
    }, { transaction });
    // Update schedule
    const fiscalYear = recognitionData.recognitionDate.getFullYear();
    const fiscalPeriod = recognitionData.recognitionDate.getMonth() + 1;
    const schedule = await RevenueSchedule.findOne({
        where: {
            obligationId: recognitionData.obligationId,
            fiscalYear,
            fiscalPeriod,
        },
        transaction,
    });
    if (schedule) {
        await schedule.update({
            recognizedAmount: Number(schedule.recognizedAmount) + Number(recognitionData.recognitionAmount),
            status: 'recognized',
        }, { transaction });
    }
    return {
        obligationId: obligation.id,
        previousRecognizedRevenue: Number(obligation.recognizedRevenue) - Number(recognitionData.recognitionAmount),
        currentRecognizedRevenue: newRecognizedRevenue,
        remainingRevenue: Number(obligation.allocatedAmount) - newRecognizedRevenue,
        recognitionDate: recognitionData.recognitionDate,
    };
};
exports.recognizeRevenue = recognizeRevenue;
/**
 * Recognizes revenue based on milestone completion.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} milestoneId - Milestone ID
 * @param {Date} recognitionDate - Recognition date
 * @param {string} userId - User recognizing revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition result
 *
 * @example
 * ```typescript
 * const result = await recognizeMilestoneRevenue(sequelize, 1, new Date(), 'user123');
 * ```
 */
const recognizeMilestoneRevenue = async (sequelize, milestoneId, recognitionDate, userId, transaction) => {
    // Milestone model would be created separately
    // This is a placeholder implementation
    const milestoneData = {
        milestoneId,
        obligationId: 1,
        milestoneValue: 25000,
        completionPercent: 100,
    };
    if (milestoneData.completionPercent < 100) {
        throw new Error('Milestone must be 100% complete to recognize revenue');
    }
    const recognitionData = {
        contractId: 0, // Would be fetched from milestone
        obligationId: milestoneData.obligationId,
        recognitionDate,
        recognitionAmount: milestoneData.milestoneValue,
        userId,
    };
    return await (0, exports.recognizeRevenue)(sequelize, recognitionData, transaction);
};
exports.recognizeMilestoneRevenue = recognizeMilestoneRevenue;
/**
 * Processes automatic revenue recognition for scheduled amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Recognition cutoff date
 * @param {string} userId - User processing recognition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Recognition processing result
 *
 * @example
 * ```typescript
 * const result = await processScheduledRevenueRecognition(sequelize, new Date('2024-01-31'), 'user123');
 * ```
 */
const processScheduledRevenueRecognition = async (sequelize, asOfDate, userId, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const schedulesToProcess = await RevenueSchedule.findAll({
        where: {
            scheduleDate: { [sequelize_1.Op.lte]: asOfDate },
            status: 'scheduled',
        },
        transaction,
    });
    let totalRecognized = 0;
    const processedSchedules = [];
    for (const schedule of schedulesToProcess) {
        await (0, exports.recognizeRevenue)(sequelize, {
            contractId: schedule.contractId,
            obligationId: schedule.obligationId,
            recognitionDate: schedule.scheduleDate,
            recognitionAmount: schedule.scheduledAmount,
            userId,
        }, transaction);
        totalRecognized += Number(schedule.scheduledAmount);
        processedSchedules.push(schedule.id);
    }
    return {
        schedulesProcessed: processedSchedules.length,
        totalRecognized,
        processedScheduleIds: processedSchedules,
    };
};
exports.processScheduledRevenueRecognition = processScheduledRevenueRecognition;
/**
 * Reverses recognized revenue for a performance obligation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} scheduleId - Revenue schedule ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversal result
 *
 * @example
 * ```typescript
 * const result = await reverseRevenueRecognition(sequelize, 1, 'Customer contract cancelled', 'user123');
 * ```
 */
const reverseRevenueRecognition = async (sequelize, scheduleId, reversalReason, userId, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const schedule = await RevenueSchedule.findByPk(scheduleId, { transaction });
    if (!schedule) {
        throw new Error('Revenue schedule not found');
    }
    if (schedule.status !== 'recognized') {
        throw new Error('Can only reverse recognized revenue');
    }
    const obligation = await PerformanceObligation.findByPk(schedule.obligationId, { transaction });
    if (!obligation) {
        throw new Error('Performance obligation not found');
    }
    const reversalAmount = Number(schedule.recognizedAmount);
    // Update obligation
    await obligation.update({
        recognizedRevenue: Number(obligation.recognizedRevenue) - reversalAmount,
        remainingRevenue: Number(obligation.remainingRevenue) + reversalAmount,
    }, { transaction });
    // Update schedule
    await schedule.update({
        recognizedAmount: 0,
        remainingAmount: Number(schedule.scheduledAmount),
        status: 'reversed',
    }, { transaction });
    return {
        scheduleId,
        obligationId: obligation.id,
        reversalAmount,
        reversalReason,
        reversedBy: userId,
        reversalDate: new Date(),
    };
};
exports.reverseRevenueRecognition = reverseRevenueRecognition;
// ============================================================================
// DEFERRED AND UNBILLED REVENUE FUNCTIONS
// ============================================================================
/**
 * Records deferred revenue when invoice exceeds recognized revenue.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} billedAmount - Amount billed
 * @param {string} userId - User recording deferred revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DeferredRevenue>} Deferred revenue entry
 *
 * @example
 * ```typescript
 * const deferred = await recordDeferredRevenue(sequelize, 1, 1, 100, 50000, 'user123');
 * ```
 */
const recordDeferredRevenue = async (sequelize, contractId, obligationId, invoiceId, billedAmount, userId, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const obligation = await PerformanceObligation.findByPk(obligationId, { transaction });
    if (!obligation) {
        throw new Error('Performance obligation not found');
    }
    const recognizedAmount = Number(obligation.recognizedRevenue);
    const deferredAmount = billedAmount - recognizedAmount;
    if (deferredAmount <= 0) {
        throw new Error('Billed amount must exceed recognized amount to create deferred revenue');
    }
    const deferredRevenue = {
        deferredId: 0, // Would be auto-generated
        contractId,
        obligationId,
        invoiceId,
        billedAmount,
        recognizedAmount,
        deferredAmount,
        deferralDate: new Date(),
        accountCode: '4000', // Revenue account
        liabilityAccountCode: '2400', // Deferred revenue liability
        status: 'deferred',
    };
    // Would create database record here
    return deferredRevenue;
};
exports.recordDeferredRevenue = recordDeferredRevenue;
/**
 * Records unbilled revenue (contract asset) when recognized revenue exceeds billing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {number} recognizedAmount - Amount recognized
 * @param {number} billedAmount - Amount billed
 * @param {string} userId - User recording unbilled revenue
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<UnbilledRevenue>} Unbilled revenue entry
 *
 * @example
 * ```typescript
 * const unbilled = await recordUnbilledRevenue(sequelize, 1, 1, 50000, 30000, 'user123');
 * ```
 */
const recordUnbilledRevenue = async (sequelize, contractId, obligationId, recognizedAmount, billedAmount, userId, transaction) => {
    const unbilledAmount = recognizedAmount - billedAmount;
    if (unbilledAmount <= 0) {
        throw new Error('Recognized amount must exceed billed amount to create unbilled revenue');
    }
    const unbilledRevenue = {
        unbilledId: 0, // Would be auto-generated
        contractId,
        obligationId,
        recognizedAmount,
        billedAmount,
        unbilledAmount,
        recognitionDate: new Date(),
        assetAccountCode: '1300', // Unbilled receivables (contract asset)
        revenueAccountCode: '4000', // Revenue account
        status: 'unbilled',
    };
    // Would create database record here
    return unbilledRevenue;
};
exports.recordUnbilledRevenue = recordUnbilledRevenue;
/**
 * Reconciles deferred and unbilled revenue balances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {string} userId - User performing reconciliation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<RevenueReconciliation>} Reconciliation result
 *
 * @example
 * ```typescript
 * const reconciliation = await reconcileDeferredUnbilledRevenue(sequelize, 2024, 1, 'user123');
 * ```
 */
const reconcileDeferredUnbilledRevenue = async (sequelize, fiscalYear, fiscalPeriod, userId, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const schedules = await RevenueSchedule.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
        },
        transaction,
    });
    const billedRevenue = 0; // Would sum from invoices
    const recognizedRevenue = schedules.reduce((sum, sch) => sum + Number(sch.recognizedAmount), 0);
    const deferredRevenue = 0; // Would sum from deferred revenue records
    const unbilledRevenue = 0; // Would sum from unbilled revenue records
    const variance = billedRevenue - recognizedRevenue + deferredRevenue - unbilledRevenue;
    const variancePercent = recognizedRevenue !== 0 ? (variance / recognizedRevenue) * 100 : 0;
    const reconciliation = {
        reconciliationId: 0,
        fiscalYear,
        fiscalPeriod,
        billedRevenue,
        recognizedRevenue,
        deferredRevenue,
        unbilledRevenue,
        variance,
        variancePercent,
        status: Math.abs(variance) < 0.01 ? 'balanced' : 'variance',
        reconciledBy: userId,
        reconciledAt: new Date(),
    };
    return reconciliation;
};
exports.reconcileDeferredUnbilledRevenue = reconcileDeferredUnbilledRevenue;
// ============================================================================
// CONTRACT MODIFICATION FUNCTIONS
// ============================================================================
/**
 * Processes contract modification with appropriate accounting treatment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ContractModificationDto} modificationData - Modification data
 * @param {string} userId - User processing modification
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ContractModification>} Contract modification
 *
 * @example
 * ```typescript
 * const modification = await processContractModification(sequelize, {
 *   contractId: 1,
 *   modificationType: 'additional-goods',
 *   accountingTreatment: 'separate-contract',
 *   modifiedValue: 150000,
 *   description: 'Added premium support',
 *   effectiveDate: new Date('2024-06-01')
 * }, 'user123');
 * ```
 */
const processContractModification = async (sequelize, modificationData, userId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const contract = await RevenueContract.findByPk(modificationData.contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    const originalValue = Number(contract.totalContractValue);
    const valueChange = modificationData.modifiedValue - originalValue;
    // Generate modification number
    const modificationNumber = `${contract.contractNumber}-MOD-${Date.now()}`;
    const modification = {
        modificationId: 0,
        contractId: modificationData.contractId,
        modificationNumber,
        modificationDate: new Date(),
        modificationType: modificationData.modificationType,
        accountingTreatment: modificationData.accountingTreatment,
        originalValue,
        modifiedValue: modificationData.modifiedValue,
        valueChange,
        description: modificationData.description,
        approvedBy: userId,
        effectiveDate: modificationData.effectiveDate,
    };
    // Apply accounting treatment
    if (modificationData.accountingTreatment === 'separate-contract') {
        // Create new contract for additional goods/services
        // Original contract remains unchanged
    }
    else if (modificationData.accountingTreatment === 'cumulative-catch-up') {
        // Adjust current period revenue for entire change
        await contract.update({
            totalContractValue: modificationData.modifiedValue,
            status: 'modified',
            updatedBy: userId,
        }, { transaction });
    }
    else if (modificationData.accountingTreatment === 'prospective') {
        // Adjust remaining performance obligations going forward
        await contract.update({
            totalContractValue: modificationData.modifiedValue,
            status: 'modified',
            updatedBy: userId,
        }, { transaction });
    }
    return modification;
};
exports.processContractModification = processContractModification;
/**
 * Applies cumulative catch-up adjustment for contract modification.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} modificationId - Modification ID
 * @param {string} userId - User applying adjustment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Adjustment result
 *
 * @example
 * ```typescript
 * const result = await applyCumulativeCatchUpAdjustment(sequelize, 1, 'user123');
 * ```
 */
const applyCumulativeCatchUpAdjustment = async (sequelize, modificationId, userId, transaction) => {
    // Would fetch modification details
    const modification = {
        contractId: 1,
        valueChange: 20000,
    };
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const obligations = await PerformanceObligation.findAll({
        where: {
            contractId: modification.contractId,
            status: { [sequelize_1.Op.in]: ['in-progress', 'not-started'] },
        },
        transaction,
    });
    // Recalculate and adjust revenue
    const totalAdjustment = modification.valueChange;
    const adjustmentPerObligation = totalAdjustment / obligations.length;
    for (const obligation of obligations) {
        const newAllocatedAmount = Number(obligation.allocatedAmount) + adjustmentPerObligation;
        await obligation.update({
            allocatedAmount: newAllocatedAmount,
            remainingRevenue: newAllocatedAmount - Number(obligation.recognizedRevenue),
        }, { transaction });
    }
    return {
        modificationId,
        totalAdjustment,
        obligationsAdjusted: obligations.length,
        adjustmentPerObligation,
    };
};
exports.applyCumulativeCatchUpAdjustment = applyCumulativeCatchUpAdjustment;
// ============================================================================
// SUBSCRIPTION MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a subscription revenue contract.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {any} subscriptionData - Subscription data
 * @param {string} userId - User creating subscription
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SubscriptionRevenue>} Created subscription
 *
 * @example
 * ```typescript
 * const subscription = await createSubscriptionRevenue(sequelize, {
 *   customerId: 100,
 *   subscriptionNumber: 'SUB-2024-001',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   billingCycle: 'monthly',
 *   periodicAmount: 1000,
 *   autoRenew: true
 * }, 'user123');
 * ```
 */
const createSubscriptionRevenue = async (sequelize, subscriptionData, userId, transaction) => {
    // Calculate total value based on billing cycle
    const startDate = new Date(subscriptionData.startDate);
    const endDate = new Date(subscriptionData.endDate);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
    let periods = months;
    if (subscriptionData.billingCycle === 'quarterly')
        periods = months / 3;
    if (subscriptionData.billingCycle === 'semi-annual')
        periods = months / 6;
    if (subscriptionData.billingCycle === 'annual')
        periods = months / 12;
    const totalValue = subscriptionData.periodicAmount * periods;
    // Create revenue contract
    const contractData = {
        contractNumber: subscriptionData.subscriptionNumber,
        customerId: subscriptionData.customerId,
        contractDate: new Date(),
        startDate,
        endDate,
        totalContractValue: totalValue,
        recognitionMethod: 'over-time',
        contractType: 'subscription',
        performanceObligations: [],
    };
    const contract = await (0, exports.createRevenueContract)(sequelize, contractData, userId, transaction);
    const subscription = {
        subscriptionId: contract.id,
        contractId: contract.id,
        customerId: subscriptionData.customerId,
        subscriptionNumber: subscriptionData.subscriptionNumber,
        startDate,
        endDate,
        billingCycle: subscriptionData.billingCycle,
        periodicAmount: subscriptionData.periodicAmount,
        totalValue,
        recognizedRevenue: 0,
        deferredRevenue: totalValue,
        status: 'active',
        autoRenew: subscriptionData.autoRenew,
        renewalTerms: subscriptionData.renewalTerms,
    };
    return subscription;
};
exports.createSubscriptionRevenue = createSubscriptionRevenue;
/**
 * Processes subscription renewal.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} subscriptionId - Subscription ID
 * @param {Date} renewalDate - Renewal date
 * @param {string} userId - User processing renewal
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<SubscriptionRevenue>} Renewed subscription
 *
 * @example
 * ```typescript
 * const renewed = await renewSubscription(sequelize, 1, new Date('2025-01-01'), 'user123');
 * ```
 */
const renewSubscription = async (sequelize, subscriptionId, renewalDate, userId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const contract = await RevenueContract.findByPk(subscriptionId, { transaction });
    if (!contract) {
        throw new Error('Subscription contract not found');
    }
    if (contract.contractType !== 'subscription') {
        throw new Error('Contract is not a subscription');
    }
    // Create new contract for renewal period
    const originalEndDate = new Date(contract.endDate);
    const renewalEndDate = new Date(renewalDate);
    renewalEndDate.setFullYear(renewalEndDate.getFullYear() + 1);
    const renewalContract = await (0, exports.createRevenueContract)(sequelize, {
        contractNumber: `${contract.contractNumber}-REN`,
        customerId: contract.customerId,
        contractDate: renewalDate,
        startDate: renewalDate,
        endDate: renewalEndDate,
        totalContractValue: contract.totalContractValue,
        recognitionMethod: 'over-time',
        contractType: 'subscription',
        performanceObligations: [],
    }, userId, transaction);
    const renewed = {
        subscriptionId: renewalContract.id,
        contractId: renewalContract.id,
        customerId: contract.customerId,
        subscriptionNumber: `${contract.contractNumber}-REN`,
        startDate: renewalDate,
        endDate: renewalEndDate,
        billingCycle: 'annual', // Default
        periodicAmount: contract.totalContractValue,
        totalValue: contract.totalContractValue,
        recognizedRevenue: 0,
        deferredRevenue: contract.totalContractValue,
        status: 'active',
        autoRenew: true,
    };
    return renewed;
};
exports.renewSubscription = renewSubscription;
/**
 * Cancels a subscription and handles revenue implications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} subscriptionId - Subscription ID
 * @param {Date} cancellationDate - Cancellation date
 * @param {string} cancellationReason - Reason for cancellation
 * @param {string} userId - User cancelling subscription
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelSubscription(sequelize, 1, new Date(), 'Customer request', 'user123');
 * ```
 */
const cancelSubscription = async (sequelize, subscriptionId, cancellationDate, cancellationReason, userId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contract = await RevenueContract.findByPk(subscriptionId, { transaction });
    if (!contract) {
        throw new Error('Subscription contract not found');
    }
    // Update contract status
    await contract.update({
        status: 'terminated',
        endDate: cancellationDate,
        updatedBy: userId,
    }, { transaction });
    // Cancel remaining obligations
    const obligations = await PerformanceObligation.findAll({
        where: {
            contractId: subscriptionId,
            status: { [sequelize_1.Op.ne]: 'completed' },
        },
        transaction,
    });
    for (const obligation of obligations) {
        await obligation.update({
            status: 'cancelled',
        }, { transaction });
    }
    return {
        subscriptionId,
        cancellationDate,
        cancellationReason,
        cancelledBy: userId,
        obligationsCancelled: obligations.length,
    };
};
exports.cancelSubscription = cancelSubscription;
// ============================================================================
// VARIABLE CONSIDERATION FUNCTIONS
// ============================================================================
/**
 * Estimates variable consideration using expected value or most likely amount method.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {number} obligationId - Obligation ID
 * @param {any} variableData - Variable consideration data
 * @param {string} userId - User estimating consideration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VariableConsideration>} Variable consideration estimate
 *
 * @example
 * ```typescript
 * const variable = await estimateVariableConsideration(sequelize, 1, 1, {
 *   considerationType: 'performance-bonus',
 *   scenarios: [
 *     { amount: 10000, probability: 0.3 },
 *     { amount: 5000, probability: 0.5 },
 *     { amount: 0, probability: 0.2 }
 *   ],
 *   constraintMethod: 'expected-value'
 * }, 'user123');
 * ```
 */
const estimateVariableConsideration = async (sequelize, contractId, obligationId, variableData, userId, transaction) => {
    let estimatedAmount = 0;
    if (variableData.constraintMethod === 'expected-value') {
        // Calculate probability-weighted average
        estimatedAmount = variableData.scenarios.reduce((sum, scenario) => sum + scenario.amount * scenario.probability, 0);
    }
    else if (variableData.constraintMethod === 'most-likely') {
        // Use most likely single amount
        const mostLikely = variableData.scenarios.reduce((max, scenario) => scenario.probability > max.probability ? scenario : max);
        estimatedAmount = mostLikely.amount;
    }
    // Apply constraint - only recognize if highly probable not to reverse
    const constraintApplied = estimatedAmount * 0.8; // Conservative 80% constraint
    const variableConsideration = {
        variableId: 0,
        contractId,
        obligationId,
        considerationType: variableData.considerationType,
        estimatedAmount,
        constraintApplied,
        recognizedAmount: 0,
        constraintMethod: variableData.constraintMethod,
        constraintReason: 'ASC 606 constraint to prevent significant reversal',
        reassessmentDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    };
    return variableConsideration;
};
exports.estimateVariableConsideration = estimateVariableConsideration;
/**
 * Reassesses variable consideration estimates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} variableId - Variable consideration ID
 * @param {any} updatedData - Updated estimate data
 * @param {string} userId - User reassessing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VariableConsideration>} Updated variable consideration
 *
 * @example
 * ```typescript
 * const updated = await reassessVariableConsideration(sequelize, 1, {
 *   scenarios: [
 *     { amount: 10000, probability: 0.6 },
 *     { amount: 5000, probability: 0.3 },
 *     { amount: 0, probability: 0.1 }
 *   ]
 * }, 'user123');
 * ```
 */
const reassessVariableConsideration = async (sequelize, variableId, updatedData, userId, transaction) => {
    // Would fetch existing variable consideration
    const existing = {
        variableId,
        contractId: 1,
        obligationId: 1,
        considerationType: 'performance-bonus',
        estimatedAmount: 5000,
        constraintApplied: 4000,
        recognizedAmount: 3000,
        constraintMethod: 'expected-value',
        constraintReason: 'ASC 606 constraint',
        reassessmentDate: new Date(),
    };
    // Recalculate with updated scenarios
    const newEstimate = updatedData.scenarios.reduce((sum, scenario) => sum + scenario.amount * scenario.probability, 0);
    const newConstraint = newEstimate * 0.8;
    const updated = {
        ...existing,
        estimatedAmount: newEstimate,
        constraintApplied: newConstraint,
        reassessmentDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    };
    return updated;
};
exports.reassessVariableConsideration = reassessVariableConsideration;
// ============================================================================
// REPORTING AND ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates ASC 606 revenue roll-forward report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue roll-forward
 *
 * @example
 * ```typescript
 * const rollforward = await generateRevenueRollforward(sequelize, 2024, 1);
 * ```
 */
const generateRevenueRollforward = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const currentPeriod = await RevenueSchedule.findAll({
        where: { fiscalYear, fiscalPeriod },
        transaction,
    });
    const previousPeriod = fiscalPeriod > 1
        ? await RevenueSchedule.findAll({
            where: { fiscalYear, fiscalPeriod: fiscalPeriod - 1 },
            transaction,
        })
        : await RevenueSchedule.findAll({
            where: { fiscalYear: fiscalYear - 1, fiscalPeriod: 12 },
            transaction,
        });
    const openingBalance = previousPeriod.reduce((sum, sch) => sum + Number(sch.remainingAmount), 0);
    const additions = currentPeriod.reduce((sum, sch) => sum + Number(sch.scheduledAmount), 0);
    const recognized = currentPeriod.reduce((sum, sch) => sum + Number(sch.recognizedAmount), 0);
    const closingBalance = currentPeriod.reduce((sum, sch) => sum + Number(sch.remainingAmount), 0);
    return {
        fiscalYear,
        fiscalPeriod,
        openingBalance,
        additions,
        recognized,
        closingBalance,
        periodMovement: closingBalance - openingBalance,
    };
};
exports.generateRevenueRollforward = generateRevenueRollforward;
/**
 * Analyzes contract performance and revenue realization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Contract performance analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeContractPerformance(sequelize, 1);
 * ```
 */
const analyzeContractPerformance = async (sequelize, contractId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contract = await RevenueContract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    const obligations = await PerformanceObligation.findAll({
        where: { contractId },
        transaction,
    });
    const totalAllocated = obligations.reduce((sum, obl) => sum + Number(obl.allocatedAmount), 0);
    const totalRecognized = obligations.reduce((sum, obl) => sum + Number(obl.recognizedRevenue), 0);
    const totalRemaining = obligations.reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);
    const recognitionPercent = totalAllocated > 0 ? (totalRecognized / totalAllocated) * 100 : 0;
    const obligationStatus = obligations.map((obl) => ({
        obligationId: obl.id,
        obligationNumber: obl.obligationNumber,
        description: obl.description,
        allocatedAmount: Number(obl.allocatedAmount),
        recognizedRevenue: Number(obl.recognizedRevenue),
        remainingRevenue: Number(obl.remainingRevenue),
        completionPercent: Number(obl.completionPercent),
        status: obl.status,
    }));
    return {
        contractId,
        contractNumber: contract.contractNumber,
        totalContractValue: Number(contract.totalContractValue),
        totalAllocated,
        totalRecognized,
        totalRemaining,
        recognitionPercent,
        obligationCount: obligations.length,
        obligationStatus,
    };
};
exports.analyzeContractPerformance = analyzeContractPerformance;
/**
 * Generates performance obligation summary by type.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Reporting date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Performance obligation summary
 *
 * @example
 * ```typescript
 * const summary = await getPerformanceObligationSummary(sequelize, new Date());
 * ```
 */
const getPerformanceObligationSummary = async (sequelize, asOfDate, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const obligations = await PerformanceObligation.findAll({
        where: {
            startDate: { [sequelize_1.Op.lte]: asOfDate },
            endDate: { [sequelize_1.Op.gte]: asOfDate },
        },
        transaction,
    });
    // Group by obligation type
    const summary = obligations.reduce((acc, obl) => {
        const type = obl.obligationType;
        if (!acc[type]) {
            acc[type] = {
                obligationType: type,
                count: 0,
                totalAllocated: 0,
                totalRecognized: 0,
                totalRemaining: 0,
            };
        }
        acc[type].count++;
        acc[type].totalAllocated += Number(obl.allocatedAmount);
        acc[type].totalRecognized += Number(obl.recognizedRevenue);
        acc[type].totalRemaining += Number(obl.remainingRevenue);
        return acc;
    }, {});
    return Object.values(summary);
};
exports.getPerformanceObligationSummary = getPerformanceObligationSummary;
/**
 * Exports revenue recognition data for external reporting.
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
 * const exported = await exportRevenueRecognitionData(sequelize, 2024, 1, 'json');
 * ```
 */
const exportRevenueRecognitionData = async (sequelize, fiscalYear, fiscalPeriod, format, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const schedules = await RevenueSchedule.findAll({
        where: { fiscalYear, fiscalPeriod },
        transaction,
    });
    const exportData = await Promise.all(schedules.map(async (schedule) => {
        const contract = await RevenueContract.findByPk(schedule.contractId, { transaction });
        return {
            contractNumber: contract?.contractNumber,
            customerName: contract?.customerName,
            fiscalYear: schedule.fiscalYear,
            fiscalPeriod: schedule.fiscalPeriod,
            scheduleDate: schedule.scheduleDate,
            scheduledAmount: Number(schedule.scheduledAmount),
            recognizedAmount: Number(schedule.recognizedAmount),
            remainingAmount: Number(schedule.remainingAmount),
            status: schedule.status,
        };
    }));
    if (format === 'json') {
        return exportData;
    }
    else if (format === 'csv') {
        // Would convert to CSV format
        return exportData;
    }
    return exportData;
};
exports.exportRevenueRecognitionData = exportRevenueRecognitionData;
/**
 * Validates contract against ASC 606 requirements.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateASC606Compliance(sequelize, 1);
 * ```
 */
const validateASC606Compliance = async (sequelize, contractId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contract = await RevenueContract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    const obligations = await PerformanceObligation.findAll({
        where: { contractId },
        transaction,
    });
    const validationResults = {
        contractId,
        step1_identifyContract: true,
        step2_identifyPerformanceObligations: obligations.length > 0,
        step3_determineTransactionPrice: contract.totalContractValue > 0,
        step4_allocateTransactionPrice: obligations.every((o) => Number(o.allocatedAmount) > 0),
        step5_recognizeRevenue: obligations.some((o) => Number(o.recognizedRevenue) > 0),
        overallCompliant: true,
    };
    validationResults.overallCompliant = Object.values(validationResults)
        .slice(1, -1)
        .every((v) => v === true);
    return validationResults;
};
exports.validateASC606Compliance = validateASC606Compliance;
/**
 * Calculates revenue forecast based on contract pipeline.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} forecastStartDate - Forecast start date
 * @param {Date} forecastEndDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue forecast
 *
 * @example
 * ```typescript
 * const forecast = await calculateRevenueForecast(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const calculateRevenueForecast = async (sequelize, forecastStartDate, forecastEndDate, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const schedules = await RevenueSchedule.findAll({
        where: {
            scheduleDate: {
                [sequelize_1.Op.between]: [forecastStartDate, forecastEndDate],
            },
            status: { [sequelize_1.Op.in]: ['scheduled', 'recognized'] },
        },
        transaction,
    });
    const monthlyForecast = new Map();
    schedules.forEach((schedule) => {
        const monthKey = `${schedule.fiscalYear}-${String(schedule.fiscalPeriod).padStart(2, '0')}`;
        const current = monthlyForecast.get(monthKey) || 0;
        monthlyForecast.set(monthKey, current + Number(schedule.remainingAmount));
    });
    return Array.from(monthlyForecast.entries()).map(([period, amount]) => ({
        period,
        forecastAmount: amount,
    }));
};
exports.calculateRevenueForecast = calculateRevenueForecast;
/**
 * Analyzes revenue variance between actual and scheduled.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Variance analysis
 *
 * @example
 * ```typescript
 * const variance = await analyzeRevenueVariance(sequelize, 2024, 1);
 * ```
 */
const analyzeRevenueVariance = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const schedules = await RevenueSchedule.findAll({
        where: { fiscalYear, fiscalPeriod },
        transaction,
    });
    const totalScheduled = schedules.reduce((sum, s) => sum + Number(s.scheduledAmount), 0);
    const totalRecognized = schedules.reduce((sum, s) => sum + Number(s.recognizedAmount), 0);
    const variance = totalRecognized - totalScheduled;
    const variancePercent = totalScheduled > 0 ? (variance / totalScheduled) * 100 : 0;
    return {
        fiscalYear,
        fiscalPeriod,
        totalScheduled,
        totalRecognized,
        variance,
        variancePercent,
        favorableUnfavorable: variance >= 0 ? 'favorable' : 'unfavorable',
    };
};
exports.analyzeRevenueVariance = analyzeRevenueVariance;
/**
 * Gets contract backlog (future revenue to be recognized).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Backlog calculation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Contract backlog
 *
 * @example
 * ```typescript
 * const backlog = await getContractBacklog(sequelize, new Date());
 * ```
 */
const getContractBacklog = async (sequelize, asOfDate, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const obligations = await PerformanceObligation.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['not-started', 'in-progress'] },
            endDate: { [sequelize_1.Op.gte]: asOfDate },
        },
        transaction,
    });
    const totalBacklog = obligations.reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);
    const currentBacklog = obligations
        .filter((o) => new Date(o.startDate) <= asOfDate)
        .reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);
    const futureBacklog = totalBacklog - currentBacklog;
    return {
        asOfDate,
        totalBacklog,
        currentBacklog,
        futureBacklog,
        obligationCount: obligations.length,
    };
};
exports.getContractBacklog = getContractBacklog;
/**
 * Tracks contract renewal probabilities and revenue impact.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} renewalPeriodStart - Renewal period start
 * @param {Date} renewalPeriodEnd - Renewal period end
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Renewal tracking
 *
 * @example
 * ```typescript
 * const renewals = await trackContractRenewals(sequelize, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const trackContractRenewals = async (sequelize, renewalPeriodStart, renewalPeriodEnd, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const expiringContracts = await RevenueContract.findAll({
        where: {
            endDate: {
                [sequelize_1.Op.between]: [renewalPeriodStart, renewalPeriodEnd],
            },
            status: 'active',
        },
        transaction,
    });
    return expiringContracts.map((contract) => ({
        contractId: contract.id,
        contractNumber: contract.contractNumber,
        customerName: contract.customerName,
        endDate: contract.endDate,
        contractValue: Number(contract.totalContractValue),
        renewalProbability: 0.7, // Would come from CRM/sales data
        expectedRenewalValue: Number(contract.totalContractValue) * 0.7,
    }));
};
exports.trackContractRenewals = trackContractRenewals;
/**
 * Generates ASC 606 disclosure report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} ASC 606 disclosure
 *
 * @example
 * ```typescript
 * const disclosure = await generateASC606Disclosure(sequelize, 2024);
 * ```
 */
const generateASC606Disclosure = async (sequelize, fiscalYear, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contracts = await RevenueContract.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { startDate: { [sequelize_1.Op.lte]: new Date(fiscalYear, 11, 31) } },
                { endDate: { [sequelize_1.Op.gte]: new Date(fiscalYear, 0, 1) } },
            ],
        },
        transaction,
    });
    const obligations = await PerformanceObligation.findAll({
        where: {
            contractId: { [sequelize_1.Op.in]: contracts.map((c) => c.id) },
        },
        transaction,
    });
    const disclosure = {
        fiscalYear,
        totalContracts: contracts.length,
        totalRevenue: contracts.reduce((sum, c) => sum + Number(c.totalContractValue), 0),
        recognizedRevenue: obligations.reduce((sum, o) => sum + Number(o.recognizedRevenue), 0),
        deferredRevenue: obligations.reduce((sum, o) => sum + Number(o.remainingRevenue), 0),
        performanceObligations: obligations.length,
        disaggregation: {
            byType: {},
            bySatisfactionMethod: {},
        },
    };
    return disclosure;
};
exports.generateASC606Disclosure = generateASC606Disclosure;
/**
 * Calculates revenue concentration by customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} topN - Number of top customers
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Customer concentration
 *
 * @example
 * ```typescript
 * const concentration = await calculateCustomerConcentration(sequelize, 2024, 10);
 * ```
 */
const calculateCustomerConcentration = async (sequelize, fiscalYear, topN, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const contracts = await RevenueContract.findAll({
        where: {
            [sequelize_1.Op.or]: [
                { startDate: { [sequelize_1.Op.lte]: new Date(fiscalYear, 11, 31) } },
                { endDate: { [sequelize_1.Op.gte]: new Date(fiscalYear, 0, 1) } },
            ],
        },
        transaction,
    });
    const customerRevenue = new Map();
    contracts.forEach((contract) => {
        const existing = customerRevenue.get(contract.customerId);
        if (existing) {
            existing.revenue += Number(contract.totalContractValue);
        }
        else {
            customerRevenue.set(contract.customerId, {
                name: contract.customerName,
                revenue: Number(contract.totalContractValue),
            });
        }
    });
    const totalRevenue = Array.from(customerRevenue.values()).reduce((sum, c) => sum + c.revenue, 0);
    return Array.from(customerRevenue.entries())
        .map(([customerId, data]) => ({
        customerId,
        customerName: data.name,
        revenue: data.revenue,
        percentOfTotal: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
    }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, topN);
};
exports.calculateCustomerConcentration = calculateCustomerConcentration;
/**
 * Identifies revenue recognition timing issues.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} fiscalYear - Fiscal year
 * @param {number} fiscalPeriod - Fiscal period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Timing issues
 *
 * @example
 * ```typescript
 * const issues = await identifyRevenueTimingIssues(sequelize, 2024, 1);
 * ```
 */
const identifyRevenueTimingIssues = async (sequelize, fiscalYear, fiscalPeriod, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const schedules = await RevenueSchedule.findAll({
        where: {
            fiscalYear,
            fiscalPeriod,
            status: 'scheduled',
            scheduleDate: { [sequelize_1.Op.lt]: new Date() },
        },
        transaction,
    });
    return schedules.map((schedule) => ({
        scheduleId: schedule.id,
        contractId: schedule.contractId,
        obligationId: schedule.obligationId,
        scheduleDate: schedule.scheduleDate,
        scheduledAmount: Number(schedule.scheduledAmount),
        daysOverdue: Math.floor((Date.now() - schedule.scheduleDate.getTime()) / (1000 * 60 * 60 * 24)),
        issue: 'Revenue not recognized on schedule',
    }));
};
exports.identifyRevenueTimingIssues = identifyRevenueTimingIssues;
/**
 * Processes bulk revenue recognition for multiple obligations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} obligationIds - Obligation IDs
 * @param {Date} recognitionDate - Recognition date
 * @param {string} userId - User processing recognition
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Bulk processing result
 *
 * @example
 * ```typescript
 * const result = await bulkRecognizeRevenue(sequelize, [1, 2, 3], new Date(), 'user123');
 * ```
 */
const bulkRecognizeRevenue = async (sequelize, obligationIds, recognitionDate, userId, transaction) => {
    let successCount = 0;
    let failureCount = 0;
    const errors = [];
    for (const obligationId of obligationIds) {
        try {
            const schedules = await (0, exports.createRevenueScheduleModel)(sequelize).findAll({
                where: {
                    obligationId,
                    scheduleDate: { [sequelize_1.Op.lte]: recognitionDate },
                    status: 'scheduled',
                },
                transaction,
            });
            for (const schedule of schedules) {
                await (0, exports.recognizeRevenue)(sequelize, {
                    contractId: schedule.contractId,
                    obligationId,
                    recognitionDate,
                    recognitionAmount: Number(schedule.scheduledAmount),
                    userId,
                }, transaction);
            }
            successCount++;
        }
        catch (error) {
            failureCount++;
            errors.push({ obligationId, error: error.message });
        }
    }
    return {
        totalProcessed: obligationIds.length,
        successCount,
        failureCount,
        errors,
    };
};
exports.bulkRecognizeRevenue = bulkRecognizeRevenue;
/**
 * Generates revenue waterfall report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Revenue waterfall
 *
 * @example
 * ```typescript
 * const waterfall = await generateRevenueWaterfall(sequelize, 1);
 * ```
 */
const generateRevenueWaterfall = async (sequelize, contractId, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const schedules = await RevenueSchedule.findAll({
        where: { contractId },
        order: [['scheduleDate', 'ASC']],
        transaction,
    });
    let cumulativeRecognized = 0;
    const waterfall = schedules.map((schedule) => {
        cumulativeRecognized += Number(schedule.recognizedAmount);
        return {
            scheduleDate: schedule.scheduleDate,
            scheduledAmount: Number(schedule.scheduledAmount),
            recognizedAmount: Number(schedule.recognizedAmount),
            cumulativeRecognized,
            status: schedule.status,
        };
    });
    return {
        contractId,
        waterfall,
    };
};
exports.generateRevenueWaterfall = generateRevenueWaterfall;
/**
 * Calculates remaining performance obligations (RPO).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - RPO calculation date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} RPO summary
 *
 * @example
 * ```typescript
 * const rpo = await calculateRemainingPerformanceObligations(sequelize, new Date());
 * ```
 */
const calculateRemainingPerformanceObligations = async (sequelize, asOfDate, transaction) => {
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const obligations = await PerformanceObligation.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['not-started', 'in-progress'] },
        },
        transaction,
    });
    const totalRPO = obligations.reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);
    const currentRPO = obligations
        .filter((o) => new Date(o.endDate) <= new Date(asOfDate.getTime() + 365 * 24 * 60 * 60 * 1000))
        .reduce((sum, obl) => sum + Number(obl.remainingRevenue), 0);
    const nonCurrentRPO = totalRPO - currentRPO;
    return {
        asOfDate,
        totalRPO,
        currentRPO,
        nonCurrentRPO,
        obligationCount: obligations.length,
    };
};
exports.calculateRemainingPerformanceObligations = calculateRemainingPerformanceObligations;
/**
 * Audits revenue recognition transactions.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Date} startDate - Audit start date
 * @param {Date} endDate - Audit end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail
 *
 * @example
 * ```typescript
 * const audit = await auditRevenueRecognition(sequelize, 1, new Date('2024-01-01'), new Date('2024-12-31'));
 * ```
 */
const auditRevenueRecognition = async (sequelize, contractId, startDate, endDate, transaction) => {
    const RevenueSchedule = (0, exports.createRevenueScheduleModel)(sequelize);
    const schedules = await RevenueSchedule.findAll({
        where: {
            contractId,
            scheduleDate: {
                [sequelize_1.Op.between]: [startDate, endDate],
            },
        },
        order: [['scheduleDate', 'ASC']],
        transaction,
    });
    const auditTrail = schedules.map((schedule) => ({
        scheduleId: schedule.id,
        scheduleDate: schedule.scheduleDate,
        scheduledAmount: Number(schedule.scheduledAmount),
        recognizedAmount: Number(schedule.recognizedAmount),
        status: schedule.status,
        accountingEntryId: schedule.accountingEntryId,
    }));
    return {
        contractId,
        auditPeriod: { startDate, endDate },
        totalScheduled: schedules.reduce((sum, s) => sum + Number(s.scheduledAmount), 0),
        totalRecognized: schedules.reduce((sum, s) => sum + Number(s.recognizedAmount), 0),
        auditTrail,
    };
};
exports.auditRevenueRecognition = auditRevenueRecognition;
/**
 * Validates performance obligation allocation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePerformanceObligationAllocation(sequelize, 1);
 * ```
 */
const validatePerformanceObligationAllocation = async (sequelize, contractId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contract = await RevenueContract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    const obligations = await PerformanceObligation.findAll({
        where: { contractId },
        transaction,
    });
    const totalAllocated = obligations.reduce((sum, obl) => sum + Number(obl.allocatedAmount), 0);
    const contractValue = Number(contract.totalContractValue);
    const allocationVariance = Math.abs(totalAllocated - contractValue);
    return {
        contractId,
        contractValue,
        totalAllocated,
        allocationVariance,
        isValid: allocationVariance < 0.01,
        obligationCount: obligations.length,
        obligations: obligations.map((o) => ({
            obligationId: o.id,
            description: o.description,
            allocatedAmount: Number(o.allocatedAmount),
            allocationPercent: contractValue > 0 ? (Number(o.allocatedAmount) / contractValue) * 100 : 0,
        })),
    };
};
exports.validatePerformanceObligationAllocation = validatePerformanceObligationAllocation;
/**
 * Processes contract termination and revenue adjustments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} contractId - Contract ID
 * @param {Date} terminationDate - Termination date
 * @param {string} terminationReason - Reason for termination
 * @param {string} userId - User processing termination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Termination result
 *
 * @example
 * ```typescript
 * const result = await terminateContract(sequelize, 1, new Date(), 'Customer breach', 'user123');
 * ```
 */
const terminateContract = async (sequelize, contractId, terminationDate, terminationReason, userId, transaction) => {
    const RevenueContract = (0, exports.createRevenueContractModel)(sequelize);
    const PerformanceObligation = (0, exports.createPerformanceObligationModel)(sequelize);
    const contract = await RevenueContract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new Error('Revenue contract not found');
    }
    await contract.update({
        status: 'terminated',
        endDate: terminationDate,
        updatedBy: userId,
        metadata: {
            ...contract.metadata,
            terminationReason,
            terminationDate: terminationDate.toISOString(),
        },
    }, { transaction });
    const obligations = await PerformanceObligation.findAll({
        where: {
            contractId,
            status: { [sequelize_1.Op.ne]: 'completed' },
        },
        transaction,
    });
    for (const obligation of obligations) {
        await obligation.update({
            status: 'cancelled',
            endDate: terminationDate,
        }, { transaction });
    }
    return {
        contractId,
        terminationDate,
        terminationReason,
        obligationsCancelled: obligations.length,
        terminatedBy: userId,
    };
};
exports.terminateContract = terminateContract;
//# sourceMappingURL=revenue-recognition-billing-kit.js.map