"use strict";
/**
 * LOC: PAYPRO001
 * File: /reuse/edwards/financial/payment-processing-collections-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ./invoice-management-matching-kit (Invoice data for payment processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend payment modules
 *   - ACH processing services
 *   - Payment reconciliation services
 *   - Treasury management modules
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACHProcessingController = exports.PaymentsController = exports.PaymentRunsController = exports.updateBankAccountBalance = exports.getBankAccount = exports.cancelPaymentRun = exports.getPaymentHistory = exports.createPaymentAuditTrail = exports.calculateNextRunDate = exports.createPaymentSchedule = exports.approvePayment = exports.releasePaymentHold = exports.placePaymentHold = exports.generatePositivePayFile = exports.reconcilePayment = exports.voidPayment = exports.convertAmountToWords = exports.printCheck = exports.generateCheckRunNumber = exports.processCheckRun = exports.createWireTransfer = exports.transmitACHBatch = exports.validateACHBatch = exports.generateNACHAFile = exports.generateACHBatchNumber = exports.processACHBatch = exports.generatePaymentNumber = exports.createPaymentsFromRun = exports.approvePaymentRun = exports.calculatePaymentRunTotals = exports.getPaymentMethod = exports.generatePaymentRunNumber = exports.createPaymentRun = exports.createACHBatchModel = exports.createPaymentModel = exports.createPaymentRunModel = exports.CreatePaymentScheduleDto = exports.ApprovePaymentDto = exports.ReconcilePaymentDto = exports.VoidPaymentDto = exports.CreateWireTransferDto = exports.ProcessACHBatchDto = exports.CreatePaymentDto = exports.CreatePaymentRunDto = void 0;
/**
 * File: /reuse/edwards/financial/payment-processing-collections-kit.ts
 * Locator: WC-EDWARDS-PAYPRO-001
 * Purpose: Comprehensive Payment Processing & Collections - JD Edwards EnterpriseOne-level payment runs, ACH, wire transfers, check processing, payment reconciliation
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, invoice-management-matching-kit
 * Downstream: ../backend/payments/*, ACH Processing Services, Wire Transfer Services, Check Processing, Payment Reconciliation
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45 functions for payment runs, ACH processing, wire transfers, check processing, electronic payments, payment scheduling, payment cancellation, void/reissue, positive pay, payment reconciliation
 *
 * LLM Context: Enterprise-grade payment processing for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive payment run management, ACH/NACHA file generation, wire transfer processing, check printing,
 * electronic payment processing, payment scheduling, payment cancellation, void and reissue workflows, positive pay file generation,
 * payment reconciliation, multi-currency payments, payment approval workflows, payment method management, payment holds,
 * payment reversals, payment audit trails, and bank integration.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreatePaymentRunDto = (() => {
    var _a;
    let _runDate_decorators;
    let _runDate_initializers = [];
    let _runDate_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _paymentMethodId_decorators;
    let _paymentMethodId_initializers = [];
    let _paymentMethodId_extraInitializers = [];
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _invoiceIds_decorators;
    let _invoiceIds_initializers = [];
    let _invoiceIds_extraInitializers = [];
    return _a = class CreatePaymentRunDto {
            constructor() {
                this.runDate = __runInitializers(this, _runDate_initializers, void 0);
                this.scheduledDate = (__runInitializers(this, _runDate_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.paymentMethodId = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
                this.bankAccountId = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                this.currency = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.invoiceIds = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _invoiceIds_initializers, void 0));
                __runInitializers(this, _invoiceIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _runDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Run date', example: '2024-01-15' })];
            _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled payment date', example: '2024-01-20' })];
            _paymentMethodId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method ID' })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            _invoiceIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice IDs to include', type: [Number] })];
            __esDecorate(null, null, _runDate_decorators, { kind: "field", name: "runDate", static: false, private: false, access: { has: obj => "runDate" in obj, get: obj => obj.runDate, set: (obj, value) => { obj.runDate = value; } }, metadata: _metadata }, _runDate_initializers, _runDate_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _invoiceIds_decorators, { kind: "field", name: "invoiceIds", static: false, private: false, access: { has: obj => "invoiceIds" in obj, get: obj => obj.invoiceIds, set: (obj, value) => { obj.invoiceIds = value; } }, metadata: _metadata }, _invoiceIds_initializers, _invoiceIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePaymentRunDto = CreatePaymentRunDto;
let CreatePaymentDto = (() => {
    var _a;
    let _paymentDate_decorators;
    let _paymentDate_initializers = [];
    let _paymentDate_extraInitializers = [];
    let _paymentMethodId_decorators;
    let _paymentMethodId_initializers = [];
    let _paymentMethodId_extraInitializers = [];
    let _supplierId_decorators;
    let _supplierId_initializers = [];
    let _supplierId_extraInitializers = [];
    let _supplierSiteId_decorators;
    let _supplierSiteId_initializers = [];
    let _supplierSiteId_extraInitializers = [];
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _invoiceAllocations_decorators;
    let _invoiceAllocations_initializers = [];
    let _invoiceAllocations_extraInitializers = [];
    return _a = class CreatePaymentDto {
            constructor() {
                this.paymentDate = __runInitializers(this, _paymentDate_initializers, void 0);
                this.paymentMethodId = (__runInitializers(this, _paymentDate_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
                this.supplierId = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _supplierId_initializers, void 0));
                this.supplierSiteId = (__runInitializers(this, _supplierId_extraInitializers), __runInitializers(this, _supplierSiteId_initializers, void 0));
                this.bankAccountId = (__runInitializers(this, _supplierSiteId_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                this.amount = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.invoiceAllocations = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _invoiceAllocations_initializers, void 0));
                __runInitializers(this, _invoiceAllocations_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment date', example: '2024-01-15' })];
            _paymentMethodId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method ID' })];
            _supplierId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supplier ID' })];
            _supplierSiteId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supplier site ID' })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment amount' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            _invoiceAllocations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice allocations', type: [Object] })];
            __esDecorate(null, null, _paymentDate_decorators, { kind: "field", name: "paymentDate", static: false, private: false, access: { has: obj => "paymentDate" in obj, get: obj => obj.paymentDate, set: (obj, value) => { obj.paymentDate = value; } }, metadata: _metadata }, _paymentDate_initializers, _paymentDate_extraInitializers);
            __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
            __esDecorate(null, null, _supplierId_decorators, { kind: "field", name: "supplierId", static: false, private: false, access: { has: obj => "supplierId" in obj, get: obj => obj.supplierId, set: (obj, value) => { obj.supplierId = value; } }, metadata: _metadata }, _supplierId_initializers, _supplierId_extraInitializers);
            __esDecorate(null, null, _supplierSiteId_decorators, { kind: "field", name: "supplierSiteId", static: false, private: false, access: { has: obj => "supplierSiteId" in obj, get: obj => obj.supplierSiteId, set: (obj, value) => { obj.supplierSiteId = value; } }, metadata: _metadata }, _supplierSiteId_initializers, _supplierSiteId_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _invoiceAllocations_decorators, { kind: "field", name: "invoiceAllocations", static: false, private: false, access: { has: obj => "invoiceAllocations" in obj, get: obj => obj.invoiceAllocations, set: (obj, value) => { obj.invoiceAllocations = value; } }, metadata: _metadata }, _invoiceAllocations_initializers, _invoiceAllocations_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePaymentDto = CreatePaymentDto;
let ProcessACHBatchDto = (() => {
    var _a;
    let _paymentRunId_decorators;
    let _paymentRunId_initializers = [];
    let _paymentRunId_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _originatorId_decorators;
    let _originatorId_initializers = [];
    let _originatorId_extraInitializers = [];
    let _originatorName_decorators;
    let _originatorName_initializers = [];
    let _originatorName_extraInitializers = [];
    return _a = class ProcessACHBatchDto {
            constructor() {
                this.paymentRunId = __runInitializers(this, _paymentRunId_initializers, void 0);
                this.effectiveDate = (__runInitializers(this, _paymentRunId_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.originatorId = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _originatorId_initializers, void 0));
                this.originatorName = (__runInitializers(this, _originatorId_extraInitializers), __runInitializers(this, _originatorName_initializers, void 0));
                __runInitializers(this, _originatorName_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentRunId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment run ID' })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date for ACH', example: '2024-01-20' })];
            _originatorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Originator ID', example: 'COMP001' })];
            _originatorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Originator name', example: 'Company Name Inc' })];
            __esDecorate(null, null, _paymentRunId_decorators, { kind: "field", name: "paymentRunId", static: false, private: false, access: { has: obj => "paymentRunId" in obj, get: obj => obj.paymentRunId, set: (obj, value) => { obj.paymentRunId = value; } }, metadata: _metadata }, _paymentRunId_initializers, _paymentRunId_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _originatorId_decorators, { kind: "field", name: "originatorId", static: false, private: false, access: { has: obj => "originatorId" in obj, get: obj => obj.originatorId, set: (obj, value) => { obj.originatorId = value; } }, metadata: _metadata }, _originatorId_initializers, _originatorId_extraInitializers);
            __esDecorate(null, null, _originatorName_decorators, { kind: "field", name: "originatorName", static: false, private: false, access: { has: obj => "originatorName" in obj, get: obj => obj.originatorName, set: (obj, value) => { obj.originatorName = value; } }, metadata: _metadata }, _originatorName_initializers, _originatorName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessACHBatchDto = ProcessACHBatchDto;
let CreateWireTransferDto = (() => {
    var _a;
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _wireType_decorators;
    let _wireType_initializers = [];
    let _wireType_extraInitializers = [];
    let _beneficiaryName_decorators;
    let _beneficiaryName_initializers = [];
    let _beneficiaryName_extraInitializers = [];
    let _beneficiaryAccountNumber_decorators;
    let _beneficiaryAccountNumber_initializers = [];
    let _beneficiaryAccountNumber_extraInitializers = [];
    let _beneficiaryBankName_decorators;
    let _beneficiaryBankName_initializers = [];
    let _beneficiaryBankName_extraInitializers = [];
    let _beneficiaryBankSwift_decorators;
    let _beneficiaryBankSwift_initializers = [];
    let _beneficiaryBankSwift_extraInitializers = [];
    let _beneficiaryBankABA_decorators;
    let _beneficiaryBankABA_initializers = [];
    let _beneficiaryBankABA_extraInitializers = [];
    let _instructions_decorators;
    let _instructions_initializers = [];
    let _instructions_extraInitializers = [];
    return _a = class CreateWireTransferDto {
            constructor() {
                this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
                this.wireType = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _wireType_initializers, void 0));
                this.beneficiaryName = (__runInitializers(this, _wireType_extraInitializers), __runInitializers(this, _beneficiaryName_initializers, void 0));
                this.beneficiaryAccountNumber = (__runInitializers(this, _beneficiaryName_extraInitializers), __runInitializers(this, _beneficiaryAccountNumber_initializers, void 0));
                this.beneficiaryBankName = (__runInitializers(this, _beneficiaryAccountNumber_extraInitializers), __runInitializers(this, _beneficiaryBankName_initializers, void 0));
                this.beneficiaryBankSwift = (__runInitializers(this, _beneficiaryBankName_extraInitializers), __runInitializers(this, _beneficiaryBankSwift_initializers, void 0));
                this.beneficiaryBankABA = (__runInitializers(this, _beneficiaryBankSwift_extraInitializers), __runInitializers(this, _beneficiaryBankABA_initializers, void 0));
                this.instructions = (__runInitializers(this, _beneficiaryBankABA_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
                __runInitializers(this, _instructions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment ID' })];
            _wireType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wire type', enum: ['Domestic', 'International'] })];
            _beneficiaryName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beneficiary name' })];
            _beneficiaryAccountNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beneficiary account number' })];
            _beneficiaryBankName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beneficiary bank name' })];
            _beneficiaryBankSwift_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beneficiary bank SWIFT code', required: false })];
            _beneficiaryBankABA_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beneficiary bank ABA routing number', required: false })];
            _instructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wire instructions' })];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _wireType_decorators, { kind: "field", name: "wireType", static: false, private: false, access: { has: obj => "wireType" in obj, get: obj => obj.wireType, set: (obj, value) => { obj.wireType = value; } }, metadata: _metadata }, _wireType_initializers, _wireType_extraInitializers);
            __esDecorate(null, null, _beneficiaryName_decorators, { kind: "field", name: "beneficiaryName", static: false, private: false, access: { has: obj => "beneficiaryName" in obj, get: obj => obj.beneficiaryName, set: (obj, value) => { obj.beneficiaryName = value; } }, metadata: _metadata }, _beneficiaryName_initializers, _beneficiaryName_extraInitializers);
            __esDecorate(null, null, _beneficiaryAccountNumber_decorators, { kind: "field", name: "beneficiaryAccountNumber", static: false, private: false, access: { has: obj => "beneficiaryAccountNumber" in obj, get: obj => obj.beneficiaryAccountNumber, set: (obj, value) => { obj.beneficiaryAccountNumber = value; } }, metadata: _metadata }, _beneficiaryAccountNumber_initializers, _beneficiaryAccountNumber_extraInitializers);
            __esDecorate(null, null, _beneficiaryBankName_decorators, { kind: "field", name: "beneficiaryBankName", static: false, private: false, access: { has: obj => "beneficiaryBankName" in obj, get: obj => obj.beneficiaryBankName, set: (obj, value) => { obj.beneficiaryBankName = value; } }, metadata: _metadata }, _beneficiaryBankName_initializers, _beneficiaryBankName_extraInitializers);
            __esDecorate(null, null, _beneficiaryBankSwift_decorators, { kind: "field", name: "beneficiaryBankSwift", static: false, private: false, access: { has: obj => "beneficiaryBankSwift" in obj, get: obj => obj.beneficiaryBankSwift, set: (obj, value) => { obj.beneficiaryBankSwift = value; } }, metadata: _metadata }, _beneficiaryBankSwift_initializers, _beneficiaryBankSwift_extraInitializers);
            __esDecorate(null, null, _beneficiaryBankABA_decorators, { kind: "field", name: "beneficiaryBankABA", static: false, private: false, access: { has: obj => "beneficiaryBankABA" in obj, get: obj => obj.beneficiaryBankABA, set: (obj, value) => { obj.beneficiaryBankABA = value; } }, metadata: _metadata }, _beneficiaryBankABA_initializers, _beneficiaryBankABA_extraInitializers);
            __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: obj => "instructions" in obj, get: obj => obj.instructions, set: (obj, value) => { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWireTransferDto = CreateWireTransferDto;
let VoidPaymentDto = (() => {
    var _a;
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _voidReason_decorators;
    let _voidReason_initializers = [];
    let _voidReason_extraInitializers = [];
    let _voidDate_decorators;
    let _voidDate_initializers = [];
    let _voidDate_extraInitializers = [];
    let _reissuePayment_decorators;
    let _reissuePayment_initializers = [];
    let _reissuePayment_extraInitializers = [];
    return _a = class VoidPaymentDto {
            constructor() {
                this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
                this.voidReason = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _voidReason_initializers, void 0));
                this.voidDate = (__runInitializers(this, _voidReason_extraInitializers), __runInitializers(this, _voidDate_initializers, void 0));
                this.reissuePayment = (__runInitializers(this, _voidDate_extraInitializers), __runInitializers(this, _reissuePayment_initializers, void 0));
                __runInitializers(this, _reissuePayment_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment ID' })];
            _voidReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Void reason' })];
            _voidDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Void date', example: '2024-01-15' })];
            _reissuePayment_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reissue payment', default: false })];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _voidReason_decorators, { kind: "field", name: "voidReason", static: false, private: false, access: { has: obj => "voidReason" in obj, get: obj => obj.voidReason, set: (obj, value) => { obj.voidReason = value; } }, metadata: _metadata }, _voidReason_initializers, _voidReason_extraInitializers);
            __esDecorate(null, null, _voidDate_decorators, { kind: "field", name: "voidDate", static: false, private: false, access: { has: obj => "voidDate" in obj, get: obj => obj.voidDate, set: (obj, value) => { obj.voidDate = value; } }, metadata: _metadata }, _voidDate_initializers, _voidDate_extraInitializers);
            __esDecorate(null, null, _reissuePayment_decorators, { kind: "field", name: "reissuePayment", static: false, private: false, access: { has: obj => "reissuePayment" in obj, get: obj => obj.reissuePayment, set: (obj, value) => { obj.reissuePayment = value; } }, metadata: _metadata }, _reissuePayment_initializers, _reissuePayment_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.VoidPaymentDto = VoidPaymentDto;
let ReconcilePaymentDto = (() => {
    var _a;
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _bankStatementId_decorators;
    let _bankStatementId_initializers = [];
    let _bankStatementId_extraInitializers = [];
    let _clearedDate_decorators;
    let _clearedDate_initializers = [];
    let _clearedDate_extraInitializers = [];
    let _clearedAmount_decorators;
    let _clearedAmount_initializers = [];
    let _clearedAmount_extraInitializers = [];
    return _a = class ReconcilePaymentDto {
            constructor() {
                this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
                this.bankStatementId = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _bankStatementId_initializers, void 0));
                this.clearedDate = (__runInitializers(this, _bankStatementId_extraInitializers), __runInitializers(this, _clearedDate_initializers, void 0));
                this.clearedAmount = (__runInitializers(this, _clearedDate_extraInitializers), __runInitializers(this, _clearedAmount_initializers, void 0));
                __runInitializers(this, _clearedAmount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment ID' })];
            _bankStatementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank statement ID' })];
            _clearedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cleared date', example: '2024-01-15' })];
            _clearedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cleared amount' })];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _bankStatementId_decorators, { kind: "field", name: "bankStatementId", static: false, private: false, access: { has: obj => "bankStatementId" in obj, get: obj => obj.bankStatementId, set: (obj, value) => { obj.bankStatementId = value; } }, metadata: _metadata }, _bankStatementId_initializers, _bankStatementId_extraInitializers);
            __esDecorate(null, null, _clearedDate_decorators, { kind: "field", name: "clearedDate", static: false, private: false, access: { has: obj => "clearedDate" in obj, get: obj => obj.clearedDate, set: (obj, value) => { obj.clearedDate = value; } }, metadata: _metadata }, _clearedDate_initializers, _clearedDate_extraInitializers);
            __esDecorate(null, null, _clearedAmount_decorators, { kind: "field", name: "clearedAmount", static: false, private: false, access: { has: obj => "clearedAmount" in obj, get: obj => obj.clearedAmount, set: (obj, value) => { obj.clearedAmount = value; } }, metadata: _metadata }, _clearedAmount_initializers, _clearedAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReconcilePaymentDto = ReconcilePaymentDto;
let ApprovePaymentDto = (() => {
    var _a;
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _approvalLevel_decorators;
    let _approvalLevel_initializers = [];
    let _approvalLevel_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class ApprovePaymentDto {
            constructor() {
                this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
                this.approvalLevel = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _approvalLevel_initializers, void 0));
                this.comments = (__runInitializers(this, _approvalLevel_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment ID' })];
            _approvalLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval level' })];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval comments', required: false })];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _approvalLevel_decorators, { kind: "field", name: "approvalLevel", static: false, private: false, access: { has: obj => "approvalLevel" in obj, get: obj => obj.approvalLevel, set: (obj, value) => { obj.approvalLevel = value; } }, metadata: _metadata }, _approvalLevel_initializers, _approvalLevel_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovePaymentDto = ApprovePaymentDto;
let CreatePaymentScheduleDto = (() => {
    var _a;
    let _scheduleName_decorators;
    let _scheduleName_initializers = [];
    let _scheduleName_extraInitializers = [];
    let _scheduleType_decorators;
    let _scheduleType_initializers = [];
    let _scheduleType_extraInitializers = [];
    let _frequency_decorators;
    let _frequency_initializers = [];
    let _frequency_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _paymentMethodId_decorators;
    let _paymentMethodId_initializers = [];
    let _paymentMethodId_extraInitializers = [];
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    return _a = class CreatePaymentScheduleDto {
            constructor() {
                this.scheduleName = __runInitializers(this, _scheduleName_initializers, void 0);
                this.scheduleType = (__runInitializers(this, _scheduleName_extraInitializers), __runInitializers(this, _scheduleType_initializers, void 0));
                this.frequency = (__runInitializers(this, _scheduleType_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.startDate = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.paymentMethodId = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
                this.bankAccountId = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                __runInitializers(this, _bankAccountId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _scheduleName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule name' })];
            _scheduleType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Schedule type', enum: ['recurring', 'one_time'] })];
            _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Frequency', enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly'] })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-01-01' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', required: false })];
            _paymentMethodId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method ID' })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            __esDecorate(null, null, _scheduleName_decorators, { kind: "field", name: "scheduleName", static: false, private: false, access: { has: obj => "scheduleName" in obj, get: obj => obj.scheduleName, set: (obj, value) => { obj.scheduleName = value; } }, metadata: _metadata }, _scheduleName_initializers, _scheduleName_extraInitializers);
            __esDecorate(null, null, _scheduleType_decorators, { kind: "field", name: "scheduleType", static: false, private: false, access: { has: obj => "scheduleType" in obj, get: obj => obj.scheduleType, set: (obj, value) => { obj.scheduleType = value; } }, metadata: _metadata }, _scheduleType_initializers, _scheduleType_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: obj => "frequency" in obj, get: obj => obj.frequency, set: (obj, value) => { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePaymentScheduleDto = CreatePaymentScheduleDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Payment Runs with approval workflow.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} PaymentRun model
 *
 * @example
 * ```typescript
 * const PaymentRun = createPaymentRunModel(sequelize);
 * const run = await PaymentRun.create({
 *   runNumber: 'PR-2024-001',
 *   runDate: new Date(),
 *   paymentMethodId: 1,
 *   status: 'draft'
 * });
 * ```
 */
const createPaymentRunModel = (sequelize) => {
    class PaymentRun extends sequelize_1.Model {
    }
    PaymentRun.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        runNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique payment run number',
        },
        runDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Payment run creation date',
        },
        scheduledDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Scheduled payment date',
        },
        paymentMethodId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Payment method reference',
        },
        paymentMethodType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Payment method type (ACH, Wire, Check, etc.)',
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account reference',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Payment run status',
        },
        invoiceCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of invoices in run',
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total payment amount',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        paymentCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of payments in run',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who created the run',
        },
        approvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who approved the run',
        },
        approvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Approval timestamp',
        },
        transmittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Transmission timestamp',
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Completion timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'payment_runs',
        timestamps: true,
        indexes: [
            { fields: ['runNumber'], unique: true },
            { fields: ['runDate'] },
            { fields: ['scheduledDate'] },
            { fields: ['status'] },
            { fields: ['paymentMethodId'] },
            { fields: ['bankAccountId'] },
        ],
    });
    return PaymentRun;
};
exports.createPaymentRunModel = createPaymentRunModel;
/**
 * Sequelize model for Payments with multi-currency support.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Payment model
 *
 * @example
 * ```typescript
 * const Payment = createPaymentModel(sequelize);
 * const payment = await Payment.create({
 *   paymentNumber: 'PAY-2024-001',
 *   paymentDate: new Date(),
 *   supplierId: 100,
 *   amount: 5000.00,
 *   status: 'draft'
 * });
 * ```
 */
const createPaymentModel = (sequelize) => {
    class Payment extends sequelize_1.Model {
    }
    Payment.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        paymentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique payment number',
        },
        paymentRunId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Payment run reference',
            references: {
                model: 'payment_runs',
                key: 'id',
            },
        },
        paymentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Payment date',
        },
        paymentMethodId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Payment method reference',
        },
        paymentMethodType: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Payment method type',
        },
        supplierId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Supplier reference',
        },
        supplierName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Supplier name (denormalized)',
        },
        supplierSiteId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Supplier site reference',
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account reference',
        },
        amount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Payment amount in payment currency',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Payment currency',
        },
        exchangeRate: {
            type: sequelize_1.DataTypes.DECIMAL(12, 6),
            allowNull: false,
            defaultValue: 1.0,
            comment: 'Exchange rate to base currency',
        },
        baseAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Payment amount in base currency',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Payment status',
        },
        checkNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Check number (if applicable)',
        },
        referenceNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Payment reference number',
        },
        description: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Payment description',
        },
        invoiceCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of invoices paid',
        },
        approvalStatus: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'none',
            comment: 'Approval status',
        },
        clearedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date payment cleared bank',
        },
        voidDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date payment was voided',
        },
        voidReason: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Reason for void',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'payments',
        timestamps: true,
        indexes: [
            { fields: ['paymentNumber'], unique: true },
            { fields: ['paymentDate'] },
            { fields: ['status'] },
            { fields: ['supplierId'] },
            { fields: ['paymentRunId'] },
            { fields: ['checkNumber'] },
            { fields: ['clearedDate'] },
        ],
    });
    return Payment;
};
exports.createPaymentModel = createPaymentModel;
/**
 * Sequelize model for ACH Batches with NACHA compliance.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ACHBatch model
 *
 * @example
 * ```typescript
 * const ACHBatch = createACHBatchModel(sequelize);
 * const batch = await ACHBatch.create({
 *   batchNumber: 'ACH-2024-001',
 *   originatorId: 'COMP001',
 *   effectiveDate: new Date()
 * });
 * ```
 */
const createACHBatchModel = (sequelize) => {
    class ACHBatch extends sequelize_1.Model {
    }
    ACHBatch.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        batchNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique ACH batch number',
        },
        fileCreationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'File creation date',
        },
        fileCreationTime: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'File creation time',
        },
        originatorId: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: false,
            comment: 'Originator company ID',
        },
        originatorName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Originator company name',
        },
        batchCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of batches in file',
        },
        entryCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of entries in batch',
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
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Effective entry date',
        },
        fileContent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'NACHA file content',
        },
        fileName: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'ACH file name',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'created',
            comment: 'Batch status',
        },
        transmittedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Transmission timestamp',
        },
        settledAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Settlement timestamp',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'ach_batches',
        timestamps: true,
        indexes: [
            { fields: ['batchNumber'], unique: true },
            { fields: ['fileCreationDate'] },
            { fields: ['effectiveDate'] },
            { fields: ['status'] },
        ],
    });
    return ACHBatch;
};
exports.createACHBatchModel = createACHBatchModel;
// ============================================================================
// BUSINESS LOGIC FUNCTIONS
// ============================================================================
/**
 * Creates a new payment run for batch payment processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePaymentRunDto} runData - Payment run data
 * @param {string} userId - User creating the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment run
 *
 * @example
 * ```typescript
 * const run = await createPaymentRun(sequelize, {
 *   runDate: new Date(),
 *   scheduledDate: new Date('2024-01-20'),
 *   paymentMethodId: 1,
 *   bankAccountId: 5,
 *   currency: 'USD',
 *   invoiceIds: [101, 102, 103]
 * }, 'user123');
 * ```
 */
const createPaymentRun = async (sequelize, runData, userId, transaction) => {
    const PaymentRun = (0, exports.createPaymentRunModel)(sequelize);
    // Generate run number
    const runNumber = await (0, exports.generatePaymentRunNumber)(sequelize, runData.runDate, transaction);
    // Get payment method details
    const paymentMethod = await (0, exports.getPaymentMethod)(sequelize, runData.paymentMethodId, transaction);
    // Calculate totals from invoices
    const { invoiceCount, totalAmount } = await (0, exports.calculatePaymentRunTotals)(sequelize, runData.invoiceIds, transaction);
    const run = await PaymentRun.create({
        runNumber,
        runDate: runData.runDate,
        scheduledDate: runData.scheduledDate,
        paymentMethodId: runData.paymentMethodId,
        paymentMethodType: paymentMethod.methodType,
        bankAccountId: runData.bankAccountId,
        currency: runData.currency,
        invoiceCount,
        totalAmount,
        status: 'draft',
        createdBy: userId,
    }, { transaction });
    return run;
};
exports.createPaymentRun = createPaymentRun;
/**
 * Generates a unique payment run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} runDate - Run date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated run number
 *
 * @example
 * ```typescript
 * const runNumber = await generatePaymentRunNumber(sequelize, new Date());
 * // Returns: 'PR-2024-001'
 * ```
 */
const generatePaymentRunNumber = async (sequelize, runDate, transaction) => {
    const PaymentRun = (0, exports.createPaymentRunModel)(sequelize);
    const year = runDate.getFullYear();
    const prefix = `PR-${year}-`;
    const lastRun = await PaymentRun.findOne({
        where: {
            runNumber: {
                [sequelize_1.Op.like]: `${prefix}%`,
            },
        },
        order: [['runNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastRun) {
        const lastSequence = parseInt(lastRun.runNumber.split('-')[2], 10);
        sequence = lastSequence + 1;
    }
    return `${prefix}${sequence.toString().padStart(3, '0')}`;
};
exports.generatePaymentRunNumber = generatePaymentRunNumber;
/**
 * Retrieves payment method details by ID.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentMethodId - Payment method ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentMethod>} Payment method details
 *
 * @example
 * ```typescript
 * const method = await getPaymentMethod(sequelize, 1);
 * console.log(method.methodType); // 'ACH'
 * ```
 */
const getPaymentMethod = async (sequelize, paymentMethodId, transaction) => {
    const result = await sequelize.query('SELECT * FROM payment_methods WHERE id = :paymentMethodId AND is_active = true', {
        replacements: { paymentMethodId },
        type: 'SELECT',
        transaction,
    });
    if (!result || result.length === 0) {
        throw new Error(`Payment method ${paymentMethodId} not found or inactive`);
    }
    return result[0];
};
exports.getPaymentMethod = getPaymentMethod;
/**
 * Calculates payment run totals from invoice list.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number[]} invoiceIds - Invoice IDs
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{invoiceCount: number; totalAmount: number}>} Totals
 *
 * @example
 * ```typescript
 * const totals = await calculatePaymentRunTotals(sequelize, [101, 102, 103]);
 * console.log(totals.totalAmount); // 15000.00
 * ```
 */
const calculatePaymentRunTotals = async (sequelize, invoiceIds, transaction) => {
    const result = await sequelize.query(`SELECT COUNT(*) as invoice_count, COALESCE(SUM(amount_due), 0) as total_amount
     FROM invoices
     WHERE id IN (:invoiceIds) AND status = 'approved'`, {
        replacements: { invoiceIds },
        type: 'SELECT',
        transaction,
    });
    const row = result[0];
    return {
        invoiceCount: parseInt(row.invoice_count, 10),
        totalAmount: parseFloat(row.total_amount),
    };
};
exports.calculatePaymentRunTotals = calculatePaymentRunTotals;
/**
 * Approves a payment run for processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User approving the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approved payment run
 *
 * @example
 * ```typescript
 * const approved = await approvePaymentRun(sequelize, 1, 'manager123');
 * ```
 */
const approvePaymentRun = async (sequelize, paymentRunId, userId, transaction) => {
    const PaymentRun = (0, exports.createPaymentRunModel)(sequelize);
    const run = await PaymentRun.findByPk(paymentRunId, { transaction });
    if (!run) {
        throw new Error('Payment run not found');
    }
    if (run.status !== 'pending_approval') {
        throw new Error('Payment run is not pending approval');
    }
    await run.update({
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date(),
    }, { transaction });
    await (0, exports.createPaymentAuditTrail)(sequelize, 0, 'APPROVE', userId, {}, { paymentRunId }, transaction);
    return run;
};
exports.approvePaymentRun = approvePaymentRun;
/**
 * Creates individual payments from a payment run.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User creating payments
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Created payments
 *
 * @example
 * ```typescript
 * const payments = await createPaymentsFromRun(sequelize, 1, 'user123');
 * console.log(payments.length); // 5
 * ```
 */
const createPaymentsFromRun = async (sequelize, paymentRunId, userId, transaction) => {
    const PaymentRun = (0, exports.createPaymentRunModel)(sequelize);
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const run = await PaymentRun.findByPk(paymentRunId, { transaction });
    if (!run) {
        throw new Error('Payment run not found');
    }
    // Get invoices grouped by supplier
    const invoices = await sequelize.query(`SELECT supplier_id, supplier_site_id, supplier_name, currency,
            SUM(amount_due) as total_amount, COUNT(*) as invoice_count,
            ARRAY_AGG(id) as invoice_ids
     FROM invoices
     WHERE payment_run_id = :paymentRunId AND status = 'approved'
     GROUP BY supplier_id, supplier_site_id, supplier_name, currency`, {
        replacements: { paymentRunId },
        type: 'SELECT',
        transaction,
    });
    const payments = [];
    for (const inv of invoices) {
        const paymentNumber = await (0, exports.generatePaymentNumber)(sequelize, run.runDate, transaction);
        const payment = await Payment.create({
            paymentNumber,
            paymentRunId,
            paymentDate: run.scheduledDate,
            paymentMethodId: run.paymentMethodId,
            paymentMethodType: run.paymentMethodType,
            supplierId: inv.supplier_id,
            supplierName: inv.supplier_name,
            supplierSiteId: inv.supplier_site_id,
            bankAccountId: run.bankAccountId,
            amount: inv.total_amount,
            currency: inv.currency,
            exchangeRate: 1.0,
            baseAmount: inv.total_amount,
            status: 'pending',
            referenceNumber: `PR-${run.runNumber}`,
            description: `Payment for ${inv.invoice_count} invoices`,
            invoiceCount: inv.invoice_count,
            approvalStatus: 'none',
        }, { transaction });
        payments.push(payment);
    }
    await run.update({ paymentCount: payments.length }, { transaction });
    return payments;
};
exports.createPaymentsFromRun = createPaymentsFromRun;
/**
 * Generates a unique payment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} paymentDate - Payment date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated payment number
 *
 * @example
 * ```typescript
 * const paymentNumber = await generatePaymentNumber(sequelize, new Date());
 * // Returns: 'PAY-2024-001'
 * ```
 */
const generatePaymentNumber = async (sequelize, paymentDate, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const year = paymentDate.getFullYear();
    const prefix = `PAY-${year}-`;
    const lastPayment = await Payment.findOne({
        where: {
            paymentNumber: {
                [sequelize_1.Op.like]: `${prefix}%`,
            },
        },
        order: [['paymentNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastPayment) {
        const lastSequence = parseInt(lastPayment.paymentNumber.split('-')[2], 10);
        sequence = lastSequence + 1;
    }
    return `${prefix}${sequence.toString().padStart(6, '0')}`;
};
exports.generatePaymentNumber = generatePaymentNumber;
/**
 * Processes ACH batch for electronic payment transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessACHBatchDto} batchData - ACH batch data
 * @param {string} userId - User processing the batch
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created ACH batch
 *
 * @example
 * ```typescript
 * const batch = await processACHBatch(sequelize, {
 *   paymentRunId: 1,
 *   effectiveDate: new Date('2024-01-20'),
 *   originatorId: 'COMP001',
 *   originatorName: 'Company Name Inc'
 * }, 'user123');
 * ```
 */
const processACHBatch = async (sequelize, batchData, userId, transaction) => {
    const ACHBatch = (0, exports.createACHBatchModel)(sequelize);
    // Get payments from run
    const payments = await sequelize.query('SELECT * FROM payments WHERE payment_run_id = :paymentRunId AND status = :status', {
        replacements: { paymentRunId: batchData.paymentRunId, status: 'approved' },
        type: 'SELECT',
        transaction,
    });
    if (!payments || payments.length === 0) {
        throw new Error('No approved payments found for ACH processing');
    }
    const batchNumber = await (0, exports.generateACHBatchNumber)(sequelize, transaction);
    const now = new Date();
    // Generate NACHA file content
    const fileContent = await (0, exports.generateNACHAFile)(payments, batchData.originatorId, batchData.originatorName, batchData.effectiveDate);
    let totalCredit = 0;
    for (const payment of payments) {
        totalCredit += parseFloat(payment.amount);
    }
    const batch = await ACHBatch.create({
        batchNumber,
        fileCreationDate: now,
        fileCreationTime: now.toTimeString().slice(0, 8),
        originatorId: batchData.originatorId,
        originatorName: batchData.originatorName,
        batchCount: 1,
        entryCount: payments.length,
        totalDebit: 0,
        totalCredit,
        effectiveDate: batchData.effectiveDate,
        fileContent,
        fileName: `ACH_${batchNumber}_${now.toISOString().split('T')[0]}.txt`,
        status: 'created',
    }, { transaction });
    return batch;
};
exports.processACHBatch = processACHBatch;
/**
 * Generates ACH batch number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated batch number
 *
 * @example
 * ```typescript
 * const batchNumber = await generateACHBatchNumber(sequelize);
 * // Returns: 'ACH-2024-001'
 * ```
 */
const generateACHBatchNumber = async (sequelize, transaction) => {
    const ACHBatch = (0, exports.createACHBatchModel)(sequelize);
    const year = new Date().getFullYear();
    const prefix = `ACH-${year}-`;
    const lastBatch = await ACHBatch.findOne({
        where: {
            batchNumber: {
                [sequelize_1.Op.like]: `${prefix}%`,
            },
        },
        order: [['batchNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastBatch) {
        const lastSequence = parseInt(lastBatch.batchNumber.split('-')[2], 10);
        sequence = lastSequence + 1;
    }
    return `${prefix}${sequence.toString().padStart(3, '0')}`;
};
exports.generateACHBatchNumber = generateACHBatchNumber;
/**
 * Generates NACHA formatted ACH file content.
 *
 * @param {any[]} payments - Payments to include
 * @param {string} originatorId - Originator company ID
 * @param {string} originatorName - Originator company name
 * @param {Date} effectiveDate - Effective entry date
 * @returns {Promise<string>} NACHA file content
 *
 * @example
 * ```typescript
 * const content = await generateNACHAFile(payments, 'COMP001', 'Company Inc', new Date());
 * ```
 */
const generateNACHAFile = async (payments, originatorId, originatorName, effectiveDate) => {
    const lines = [];
    // File Header Record (Type 1)
    const fileHeader = [
        '1',
        '01',
        ' '.repeat(10), // Immediate Destination
        originatorId.padEnd(10),
        effectiveDate.toISOString().slice(2, 10).replace(/-/g, ''),
        new Date().toTimeString().slice(0, 4),
        'A',
        '094',
        '10',
        originatorName.padEnd(23),
        ' '.repeat(23),
    ].join('');
    lines.push(fileHeader.padEnd(94, ' '));
    // Batch Header Record (Type 5)
    const batchHeader = [
        '5',
        '200', // Service class code (ACH Credits)
        originatorName.padEnd(16),
        ' '.repeat(20),
        originatorId.padEnd(10),
        'PPD', // Standard Entry Class
        'PAYMENT'.padEnd(10),
        effectiveDate.toISOString().slice(5, 10).replace(/-/g, ''),
        ' '.repeat(3),
        '1',
        ' '.repeat(8),
        '0'.repeat(8),
    ].join('');
    lines.push(batchHeader.padEnd(94, ' '));
    // Entry Detail Records (Type 6)
    let totalCredit = 0;
    for (let i = 0; i < payments.length; i++) {
        const payment = payments[i];
        const amount = Math.round(parseFloat(payment.amount) * 100);
        totalCredit += amount;
        const entryDetail = [
            '6',
            '22', // Transaction code (Checking Credit)
            '00000000', // Receiving DFI
            '0', // Check digit
            payment.metadata?.accountNumber || '0000000000',
            amount.toString().padStart(10, '0'),
            payment.supplierId.toString().padStart(15, '0'),
            payment.supplierName.slice(0, 22).padEnd(22),
            '  ',
            '0',
            (i + 1).toString().padStart(7, '0'),
        ].join('');
        lines.push(entryDetail.padEnd(94, ' '));
    }
    // Batch Control Record (Type 8)
    const batchControl = [
        '8',
        '200',
        payments.length.toString().padStart(6, '0'),
        '0'.repeat(10), // Entry hash
        '0'.repeat(12), // Total debits
        totalCredit.toString().padStart(12, '0'),
        originatorId.padEnd(10),
        ' '.repeat(19),
        ' '.repeat(6),
        ' '.repeat(8),
        '0'.repeat(8),
    ].join('');
    lines.push(batchControl.padEnd(94, ' '));
    // File Control Record (Type 9)
    const fileControl = [
        '9',
        '000001',
        '000001',
        payments.length.toString().padStart(8, '0'),
        '0'.repeat(10),
        '0'.repeat(12),
        totalCredit.toString().padStart(12, '0'),
        ' '.repeat(39),
    ].join('');
    lines.push(fileControl.padEnd(94, ' '));
    return lines.join('\n');
};
exports.generateNACHAFile = generateNACHAFile;
/**
 * Validates ACH batch before transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} achBatchId - ACH batch ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateACHBatch(sequelize, 1);
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
const validateACHBatch = async (sequelize, achBatchId, transaction) => {
    const ACHBatch = (0, exports.createACHBatchModel)(sequelize);
    const batch = await ACHBatch.findByPk(achBatchId, { transaction });
    if (!batch) {
        return { isValid: false, errors: ['ACH batch not found'] };
    }
    const errors = [];
    // Validate file content length
    if (!batch.fileContent || batch.fileContent.length === 0) {
        errors.push('ACH file content is empty');
    }
    // Validate entry count
    if (batch.entryCount === 0) {
        errors.push('ACH batch has no entries');
    }
    // Validate totals
    if (batch.totalCredit <= 0 && batch.totalDebit <= 0) {
        errors.push('ACH batch has no transaction amounts');
    }
    // Validate effective date is future dated
    if (batch.effectiveDate <= new Date()) {
        errors.push('ACH effective date must be in the future');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateACHBatch = validateACHBatch;
/**
 * Transmits ACH batch to bank.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} achBatchId - ACH batch ID
 * @param {string} userId - User transmitting the batch
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Transmitted ACH batch
 *
 * @example
 * ```typescript
 * const transmitted = await transmitACHBatch(sequelize, 1, 'user123');
 * ```
 */
const transmitACHBatch = async (sequelize, achBatchId, userId, transaction) => {
    const ACHBatch = (0, exports.createACHBatchModel)(sequelize);
    const validation = await (0, exports.validateACHBatch)(sequelize, achBatchId, transaction);
    if (!validation.isValid) {
        throw new Error(`ACH batch validation failed: ${validation.errors.join(', ')}`);
    }
    const batch = await ACHBatch.findByPk(achBatchId, { transaction });
    if (!batch) {
        throw new Error('ACH batch not found');
    }
    await batch.update({
        status: 'transmitted',
        transmittedAt: new Date(),
    }, { transaction });
    // In production, this would transmit to bank via SFTP/API
    // For now, we just mark as transmitted
    return batch;
};
exports.transmitACHBatch = transmitACHBatch;
/**
 * Creates a wire transfer for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateWireTransferDto} wireData - Wire transfer data
 * @param {string} userId - User creating the wire
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created wire transfer
 *
 * @example
 * ```typescript
 * const wire = await createWireTransfer(sequelize, {
 *   paymentId: 1,
 *   wireType: 'Domestic',
 *   beneficiaryName: 'Supplier Inc',
 *   beneficiaryAccountNumber: '123456789',
 *   beneficiaryBankName: 'Bank of America',
 *   beneficiaryBankABA: '026009593',
 *   instructions: 'Payment for invoice 12345'
 * }, 'user123');
 * ```
 */
const createWireTransfer = async (sequelize, wireData, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(wireData.paymentId, { transaction });
    if (!payment) {
        throw new Error('Payment not found');
    }
    const wire = await sequelize.query(`INSERT INTO wire_transfers (
      payment_id, wire_date, wire_type, beneficiary_name, beneficiary_account_number,
      beneficiary_bank_name, beneficiary_bank_swift, beneficiary_bank_aba,
      intermediary_bank_swift, intermediary_bank_name, amount, currency,
      reference_number, instructions, status, created_at, updated_at
    ) VALUES (
      :paymentId, CURRENT_DATE, :wireType, :beneficiaryName, :beneficiaryAccountNumber,
      :beneficiaryBankName, :beneficiaryBankSwift, :beneficiaryBankABA,
      :intermediaryBankSwift, :intermediaryBankName, :amount, :currency,
      :referenceNumber, :instructions, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            paymentId: wireData.paymentId,
            wireType: wireData.wireType,
            beneficiaryName: wireData.beneficiaryName,
            beneficiaryAccountNumber: wireData.beneficiaryAccountNumber,
            beneficiaryBankName: wireData.beneficiaryBankName,
            beneficiaryBankSwift: wireData.beneficiaryBankSwift || null,
            beneficiaryBankABA: wireData.beneficiaryBankABA || null,
            intermediaryBankSwift: null,
            intermediaryBankName: null,
            amount: payment.amount,
            currency: payment.currency,
            referenceNumber: payment.referenceNumber,
            instructions: wireData.instructions,
        },
        type: 'INSERT',
        transaction,
    });
    await payment.update({ status: 'transmitted' }, { transaction });
    return wire;
};
exports.createWireTransfer = createWireTransfer;
/**
 * Processes check run for check printing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} startingCheckNumber - Starting check number
 * @param {string} userId - User processing the check run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created check run
 *
 * @example
 * ```typescript
 * const checkRun = await processCheckRun(sequelize, 1, '100001', 'user123');
 * ```
 */
const processCheckRun = async (sequelize, paymentRunId, startingCheckNumber, userId, transaction) => {
    const PaymentRun = (0, exports.createPaymentRunModel)(sequelize);
    const run = await PaymentRun.findByPk(paymentRunId, { transaction });
    if (!run) {
        throw new Error('Payment run not found');
    }
    const payments = await sequelize.query('SELECT * FROM payments WHERE payment_run_id = :paymentRunId AND status = :status', {
        replacements: { paymentRunId, status: 'approved' },
        type: 'SELECT',
        transaction,
    });
    if (!payments || payments.length === 0) {
        throw new Error('No approved payments found for check processing');
    }
    const runNumber = await (0, exports.generateCheckRunNumber)(sequelize, transaction);
    let checkNum = parseInt(startingCheckNumber, 10);
    let totalAmount = 0;
    for (const payment of payments) {
        totalAmount += parseFloat(payment.amount);
        checkNum++;
    }
    const endingCheckNumber = (checkNum - 1).toString();
    const checkRun = await sequelize.query(`INSERT INTO check_runs (
      run_number, run_date, bank_account_id, check_count, total_amount,
      starting_check_number, ending_check_number, status, created_at, updated_at
    ) VALUES (
      :runNumber, CURRENT_DATE, :bankAccountId, :checkCount, :totalAmount,
      :startingCheckNumber, :endingCheckNumber, 'created', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            runNumber,
            bankAccountId: run.bankAccountId,
            checkCount: payments.length,
            totalAmount,
            startingCheckNumber,
            endingCheckNumber,
        },
        type: 'INSERT',
        transaction,
    });
    return checkRun;
};
exports.processCheckRun = processCheckRun;
/**
 * Generates check run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Generated check run number
 *
 * @example
 * ```typescript
 * const runNumber = await generateCheckRunNumber(sequelize);
 * // Returns: 'CHK-2024-001'
 * ```
 */
const generateCheckRunNumber = async (sequelize, transaction) => {
    const year = new Date().getFullYear();
    const prefix = `CHK-${year}-`;
    const result = await sequelize.query(`SELECT run_number FROM check_runs
     WHERE run_number LIKE :prefix
     ORDER BY run_number DESC LIMIT 1`, {
        replacements: { prefix: `${prefix}%` },
        type: 'SELECT',
        transaction,
    });
    let sequence = 1;
    if (result && result.length > 0) {
        const lastSequence = parseInt(result[0].run_number.split('-')[2], 10);
        sequence = lastSequence + 1;
    }
    return `${prefix}${sequence.toString().padStart(3, '0')}`;
};
exports.generateCheckRunNumber = generateCheckRunNumber;
/**
 * Prints individual check for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} checkNumber - Check number
 * @param {number} checkRunId - Check run ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created check
 *
 * @example
 * ```typescript
 * const check = await printCheck(sequelize, 1, '100001', 5);
 * ```
 */
const printCheck = async (sequelize, paymentId, checkNumber, checkRunId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new Error('Payment not found');
    }
    const amountInWords = (0, exports.convertAmountToWords)(parseFloat(payment.amount.toString()));
    const check = await sequelize.query(`INSERT INTO checks (
      payment_id, check_run_id, check_number, check_date, payee_name,
      amount, amount_in_words, bank_account_id, status, printed_at,
      created_at, updated_at
    ) VALUES (
      :paymentId, :checkRunId, :checkNumber, CURRENT_DATE, :payeeName,
      :amount, :amountInWords, :bankAccountId, 'printed', CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            paymentId,
            checkRunId,
            checkNumber,
            payeeName: payment.supplierName,
            amount: payment.amount,
            amountInWords,
            bankAccountId: payment.bankAccountId,
        },
        type: 'INSERT',
        transaction,
    });
    await payment.update({ checkNumber, status: 'transmitted' }, { transaction });
    return check;
};
exports.printCheck = printCheck;
/**
 * Converts numeric amount to words for check printing.
 *
 * @param {number} amount - Amount to convert
 * @returns {string} Amount in words
 *
 * @example
 * ```typescript
 * const words = convertAmountToWords(1234.56);
 * // Returns: 'One Thousand Two Hundred Thirty Four and 56/100'
 * ```
 */
const convertAmountToWords = (amount) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100);
    let words = '';
    if (dollars === 0) {
        words = 'Zero';
    }
    else {
        if (dollars >= 1000) {
            const thousands = Math.floor(dollars / 1000);
            words += ones[thousands] + ' Thousand ';
            dollars %= 1000;
        }
        if (dollars >= 100) {
            const hundreds = Math.floor(dollars / 100);
            words += ones[hundreds] + ' Hundred ';
            dollars %= 100;
        }
        if (dollars >= 20) {
            const tensDigit = Math.floor(dollars / 10);
            words += tens[tensDigit] + ' ';
            dollars %= 10;
        }
        else if (dollars >= 10) {
            words += teens[dollars - 10] + ' ';
            dollars = 0;
        }
        if (dollars > 0) {
            words += ones[dollars] + ' ';
        }
    }
    words += `and ${cents.toString().padStart(2, '0')}/100`;
    return words.trim();
};
exports.convertAmountToWords = convertAmountToWords;
/**
 * Voids a payment and optionally reissues it.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {VoidPaymentDto} voidData - Void payment data
 * @param {string} userId - User voiding the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * const voided = await voidPayment(sequelize, {
 *   paymentId: 1,
 *   voidReason: 'Incorrect amount',
 *   voidDate: new Date(),
 *   reissuePayment: true
 * }, 'user123');
 * ```
 */
const voidPayment = async (sequelize, voidData, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(voidData.paymentId, { transaction });
    if (!payment) {
        throw new Error('Payment not found');
    }
    if (payment.status === 'void') {
        throw new Error('Payment is already voided');
    }
    await payment.update({
        status: 'void',
        voidDate: voidData.voidDate,
        voidReason: voidData.voidReason,
    }, { transaction });
    await (0, exports.createPaymentAuditTrail)(sequelize, voidData.paymentId, 'VOID', userId, { status: payment.status }, { status: 'void', voidReason: voidData.voidReason }, transaction);
    if (voidData.reissuePayment) {
        // Create new payment as replacement
        const newPaymentNumber = await (0, exports.generatePaymentNumber)(sequelize, new Date(), transaction);
        const newPayment = await Payment.create({
            paymentNumber: newPaymentNumber,
            paymentRunId: payment.paymentRunId,
            paymentDate: new Date(),
            paymentMethodId: payment.paymentMethodId,
            paymentMethodType: payment.paymentMethodType,
            supplierId: payment.supplierId,
            supplierName: payment.supplierName,
            supplierSiteId: payment.supplierSiteId,
            bankAccountId: payment.bankAccountId,
            amount: payment.amount,
            currency: payment.currency,
            exchangeRate: payment.exchangeRate,
            baseAmount: payment.baseAmount,
            status: 'draft',
            referenceNumber: `Reissue of ${payment.paymentNumber}`,
            description: `Reissued payment - ${payment.description}`,
            invoiceCount: payment.invoiceCount,
            approvalStatus: 'none',
        }, { transaction });
        return newPayment;
    }
    return payment;
};
exports.voidPayment = voidPayment;
/**
 * Reconciles a payment with bank statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ReconcilePaymentDto} reconData - Reconciliation data
 * @param {string} userId - User reconciling the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment reconciliation record
 *
 * @example
 * ```typescript
 * const recon = await reconcilePayment(sequelize, {
 *   paymentId: 1,
 *   bankStatementId: 10,
 *   clearedDate: new Date(),
 *   clearedAmount: 5000.00
 * }, 'user123');
 * ```
 */
const reconcilePayment = async (sequelize, reconData, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(reconData.paymentId, { transaction });
    if (!payment) {
        throw new Error('Payment not found');
    }
    const variance = parseFloat(payment.amount.toString()) - reconData.clearedAmount;
    const status = Math.abs(variance) < 0.01 ? 'matched' : 'variance';
    const reconciliation = await sequelize.query(`INSERT INTO payment_reconciliations (
      payment_id, reconciliation_date, bank_statement_id, bank_statement_date,
      cleared_amount, variance, status, reconciled_by, created_at, updated_at
    ) VALUES (
      :paymentId, CURRENT_DATE, :bankStatementId, CURRENT_DATE,
      :clearedAmount, :variance, :status, :userId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            paymentId: reconData.paymentId,
            bankStatementId: reconData.bankStatementId,
            clearedAmount: reconData.clearedAmount,
            variance,
            status,
            userId,
        },
        type: 'INSERT',
        transaction,
    });
    await payment.update({
        status: 'reconciled',
        clearedDate: reconData.clearedDate,
    }, { transaction });
    return reconciliation;
};
exports.reconcilePayment = reconcilePayment;
/**
 * Generates positive pay file for bank fraud prevention.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Date} fileDate - File date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Positive pay file
 *
 * @example
 * ```typescript
 * const posPayFile = await generatePositivePayFile(sequelize, 1, new Date());
 * ```
 */
const generatePositivePayFile = async (sequelize, bankAccountId, fileDate, transaction) => {
    // Get checks issued for the bank account
    const checks = await sequelize.query(`SELECT c.* FROM checks c
     JOIN payments p ON c.payment_id = p.id
     WHERE p.bank_account_id = :bankAccountId
       AND c.status = 'issued'
       AND c.issued_at >= :startDate
       AND c.issued_at < :endDate`, {
        replacements: {
            bankAccountId,
            startDate: new Date(fileDate.getFullYear(), fileDate.getMonth(), fileDate.getDate()),
            endDate: new Date(fileDate.getFullYear(), fileDate.getMonth(), fileDate.getDate() + 1),
        },
        type: 'SELECT',
        transaction,
    });
    if (!checks || checks.length === 0) {
        throw new Error('No checks found for positive pay file generation');
    }
    // Generate file content
    const lines = [];
    let totalAmount = 0;
    for (const check of checks) {
        const line = [
            check.check_number.padStart(10, '0'),
            check.check_date.toISOString().split('T')[0].replace(/-/g, ''),
            (Math.round(parseFloat(check.amount) * 100)).toString().padStart(12, '0'),
            check.payee_name.slice(0, 35).padEnd(35),
        ].join('|');
        lines.push(line);
        totalAmount += parseFloat(check.amount);
    }
    const fileContent = lines.join('\n');
    const fileName = `POS_PAY_${bankAccountId}_${fileDate.toISOString().split('T')[0]}.txt`;
    const posPayFile = await sequelize.query(`INSERT INTO positive_pay_files (
      file_date, bank_account_id, file_sequence_number, check_count,
      total_amount, file_name, file_content, status, created_at, updated_at
    ) VALUES (
      :fileDate, :bankAccountId, 1, :checkCount,
      :totalAmount, :fileName, :fileContent, 'created', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            fileDate,
            bankAccountId,
            checkCount: checks.length,
            totalAmount,
            fileName,
            fileContent,
        },
        type: 'INSERT',
        transaction,
    });
    return posPayFile;
};
exports.generatePositivePayFile = generatePositivePayFile;
/**
 * Places a hold on a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} holdType - Hold type
 * @param {string} holdReason - Hold reason
 * @param {string} userId - User placing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment hold record
 *
 * @example
 * ```typescript
 * const hold = await placePaymentHold(sequelize, 1, 'manual', 'Pending verification', 'user123');
 * ```
 */
const placePaymentHold = async (sequelize, paymentId, holdType, holdReason, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new Error('Payment not found');
    }
    const hold = await sequelize.query(`INSERT INTO payment_holds (
      payment_id, hold_type, hold_reason, hold_date, hold_by, created_at, updated_at
    ) VALUES (
      :paymentId, :holdType, :holdReason, CURRENT_DATE, :userId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            paymentId,
            holdType,
            holdReason,
            userId,
        },
        type: 'INSERT',
        transaction,
    });
    await (0, exports.createPaymentAuditTrail)(sequelize, paymentId, 'HOLD', userId, {}, { holdType, holdReason }, transaction);
    return hold;
};
exports.placePaymentHold = placePaymentHold;
/**
 * Releases a hold on a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releaseNotes - Release notes
 * @param {string} userId - User releasing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Released payment hold
 *
 * @example
 * ```typescript
 * const released = await releasePaymentHold(sequelize, 1, 'Verification complete', 'user123');
 * ```
 */
const releasePaymentHold = async (sequelize, holdId, releaseNotes, userId, transaction) => {
    const result = await sequelize.query(`UPDATE payment_holds
     SET release_date = CURRENT_DATE,
         released_by = :userId,
         release_notes = :releaseNotes,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :holdId
     RETURNING *`, {
        replacements: {
            holdId,
            userId,
            releaseNotes,
        },
        type: 'UPDATE',
        transaction,
    });
    if (!result || result.length === 0) {
        throw new Error('Payment hold not found');
    }
    const hold = result[0];
    await (0, exports.createPaymentAuditTrail)(sequelize, hold.payment_id, 'RELEASE', userId, {}, { releaseNotes }, transaction);
    return hold;
};
exports.releasePaymentHold = releasePaymentHold;
/**
 * Creates a payment approval record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApprovePaymentDto} approvalData - Approval data
 * @param {string} userId - User approving the payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment approval record
 *
 * @example
 * ```typescript
 * const approval = await approvePayment(sequelize, {
 *   paymentId: 1,
 *   approvalLevel: 1,
 *   comments: 'Approved for payment'
 * }, 'manager123');
 * ```
 */
const approvePayment = async (sequelize, approvalData, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(approvalData.paymentId, { transaction });
    if (!payment) {
        throw new Error('Payment not found');
    }
    const approval = await sequelize.query(`INSERT INTO payment_approvals (
      payment_id, approval_level, approver_id, approver_name, approval_status,
      approval_date, comments, created_at, updated_at
    ) VALUES (
      :paymentId, :approvalLevel, :userId, :userName, 'approved',
      CURRENT_TIMESTAMP, :comments, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            paymentId: approvalData.paymentId,
            approvalLevel: approvalData.approvalLevel,
            userId,
            userName: userId, // In production, fetch actual user name
            comments: approvalData.comments || '',
        },
        type: 'INSERT',
        transaction,
    });
    await payment.update({ approvalStatus: 'approved', status: 'approved' }, { transaction });
    await (0, exports.createPaymentAuditTrail)(sequelize, approvalData.paymentId, 'APPROVE', userId, { approvalStatus: payment.approvalStatus }, { approvalStatus: 'approved' }, transaction);
    return approval;
};
exports.approvePayment = approvePayment;
/**
 * Creates a payment schedule for recurring payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreatePaymentScheduleDto} scheduleData - Schedule data
 * @param {string} userId - User creating the schedule
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment schedule
 *
 * @example
 * ```typescript
 * const schedule = await createPaymentSchedule(sequelize, {
 *   scheduleName: 'Monthly Rent Payment',
 *   scheduleType: 'recurring',
 *   frequency: 'monthly',
 *   startDate: new Date('2024-01-01'),
 *   paymentMethodId: 1,
 *   bankAccountId: 5
 * }, 'user123');
 * ```
 */
const createPaymentSchedule = async (sequelize, scheduleData, userId, transaction) => {
    const nextRunDate = (0, exports.calculateNextRunDate)(scheduleData.startDate, scheduleData.frequency);
    const schedule = await sequelize.query(`INSERT INTO payment_schedules (
      schedule_name, schedule_type, frequency, start_date, end_date,
      next_run_date, payment_method_id, bank_account_id, is_active,
      configuration, created_at, updated_at
    ) VALUES (
      :scheduleName, :scheduleType, :frequency, :startDate, :endDate,
      :nextRunDate, :paymentMethodId, :bankAccountId, true,
      '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            scheduleName: scheduleData.scheduleName,
            scheduleType: scheduleData.scheduleType,
            frequency: scheduleData.frequency,
            startDate: scheduleData.startDate,
            endDate: scheduleData.endDate || null,
            nextRunDate,
            paymentMethodId: scheduleData.paymentMethodId,
            bankAccountId: scheduleData.bankAccountId,
        },
        type: 'INSERT',
        transaction,
    });
    return schedule;
};
exports.createPaymentSchedule = createPaymentSchedule;
/**
 * Calculates next run date based on frequency.
 *
 * @param {Date} startDate - Start date
 * @param {string} frequency - Frequency (daily, weekly, monthly, etc.)
 * @returns {Date} Next run date
 *
 * @example
 * ```typescript
 * const nextRun = calculateNextRunDate(new Date('2024-01-01'), 'monthly');
 * // Returns: 2024-02-01
 * ```
 */
const calculateNextRunDate = (startDate, frequency) => {
    const next = new Date(startDate);
    switch (frequency) {
        case 'daily':
            next.setDate(next.getDate() + 1);
            break;
        case 'weekly':
            next.setDate(next.getDate() + 7);
            break;
        case 'biweekly':
            next.setDate(next.getDate() + 14);
            break;
        case 'monthly':
            next.setMonth(next.getMonth() + 1);
            break;
        case 'quarterly':
            next.setMonth(next.getMonth() + 3);
            break;
        default:
            throw new Error(`Unknown frequency: ${frequency}`);
    }
    return next;
};
exports.calculateNextRunDate = calculateNextRunDate;
/**
 * Creates a payment audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {Record<string, any>} oldValues - Old values
 * @param {Record<string, any>} newValues - New values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail entry
 *
 * @example
 * ```typescript
 * await createPaymentAuditTrail(sequelize, 1, 'APPROVE', 'user123',
 *   { status: 'pending' }, { status: 'approved' });
 * ```
 */
const createPaymentAuditTrail = async (sequelize, paymentId, action, userId, oldValues, newValues, transaction) => {
    const audit = await sequelize.query(`INSERT INTO payment_audit_trails (
      payment_id, action, action_date, user_id, user_name,
      old_values, new_values, ip_address, created_at, updated_at
    ) VALUES (
      :paymentId, :action, CURRENT_TIMESTAMP, :userId, :userName,
      :oldValues, :newValues, :ipAddress, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            paymentId,
            action,
            userId,
            userName: userId, // In production, fetch actual user name
            oldValues: JSON.stringify(oldValues),
            newValues: JSON.stringify(newValues),
            ipAddress: '127.0.0.1', // In production, get from request
        },
        type: 'INSERT',
        transaction,
    });
    return audit;
};
exports.createPaymentAuditTrail = createPaymentAuditTrail;
/**
 * Retrieves payment history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payment audit trail
 *
 * @example
 * ```typescript
 * const history = await getPaymentHistory(sequelize, 1);
 * console.log(history.length); // Number of audit entries
 * ```
 */
const getPaymentHistory = async (sequelize, paymentId, transaction) => {
    const result = await sequelize.query(`SELECT * FROM payment_audit_trails
     WHERE payment_id = :paymentId
     ORDER BY action_date DESC`, {
        replacements: { paymentId },
        type: 'SELECT',
        transaction,
    });
    return result;
};
exports.getPaymentHistory = getPaymentHistory;
/**
 * Cancels a payment run before processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentRunId - Payment run ID
 * @param {string} userId - User cancelling the run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled payment run
 *
 * @example
 * ```typescript
 * const cancelled = await cancelPaymentRun(sequelize, 1, 'user123');
 * ```
 */
const cancelPaymentRun = async (sequelize, paymentRunId, userId, transaction) => {
    const PaymentRun = (0, exports.createPaymentRunModel)(sequelize);
    const run = await PaymentRun.findByPk(paymentRunId, { transaction });
    if (!run) {
        throw new Error('Payment run not found');
    }
    if (run.status === 'transmitted' || run.status === 'completed') {
        throw new Error('Cannot cancel transmitted or completed payment run');
    }
    await run.update({ status: 'cancelled' }, { transaction });
    // Cancel all payments in the run
    await sequelize.query(`UPDATE payments SET status = 'cancelled' WHERE payment_run_id = :paymentRunId`, {
        replacements: { paymentRunId },
        type: 'UPDATE',
        transaction,
    });
    return run;
};
exports.cancelPaymentRun = cancelPaymentRun;
/**
 * Retrieves bank account details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BankAccount>} Bank account details
 *
 * @example
 * ```typescript
 * const account = await getBankAccount(sequelize, 1);
 * console.log(account.accountNumber);
 * ```
 */
const getBankAccount = async (sequelize, bankAccountId, transaction) => {
    const result = await sequelize.query('SELECT * FROM bank_accounts WHERE id = :bankAccountId AND is_active = true', {
        replacements: { bankAccountId },
        type: 'SELECT',
        transaction,
    });
    if (!result || result.length === 0) {
        throw new Error(`Bank account ${bankAccountId} not found or inactive`);
    }
    return result[0];
};
exports.getBankAccount = getBankAccount;
/**
 * Updates bank account balance after payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} bankAccountId - Bank account ID
 * @param {number} amount - Amount to deduct
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated bank account
 *
 * @example
 * ```typescript
 * await updateBankAccountBalance(sequelize, 1, 5000.00);
 * ```
 */
const updateBankAccountBalance = async (sequelize, bankAccountId, amount, transaction) => {
    const result = await sequelize.query(`UPDATE bank_accounts
     SET balance = balance - :amount,
         available_balance = available_balance - :amount,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :bankAccountId
     RETURNING *`, {
        replacements: {
            bankAccountId,
            amount,
        },
        type: 'UPDATE',
        transaction,
    });
    if (!result || result.length === 0) {
        throw new Error('Bank account not found');
    }
    return result[0];
};
exports.updateBankAccountBalance = updateBankAccountBalance;
// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================
/**
 * NestJS Controller for Payment Run operations.
 */
let PaymentRunsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Payment Runs'), (0, common_1.Controller)('api/v1/payment-runs'), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _createRun_decorators;
    let _approve_decorators;
    let _cancel_decorators;
    var PaymentRunsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async createRun(createDto, userId) {
            return (0, exports.createPaymentRun)(this.sequelize, createDto, userId);
        }
        async approve(id, userId) {
            return (0, exports.approvePaymentRun)(this.sequelize, id, userId);
        }
        async cancel(id, userId) {
            return (0, exports.cancelPaymentRun)(this.sequelize, id, userId);
        }
    };
    __setFunctionName(_classThis, "PaymentRunsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createRun_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new payment run' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment run created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' })];
        _approve_decorators = [(0, common_1.Post)(':id/approve'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Approve payment run' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment run approved' })];
        _cancel_decorators = [(0, common_1.Post)(':id/cancel'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Cancel payment run' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment run cancelled' })];
        __esDecorate(_classThis, null, _createRun_decorators, { kind: "method", name: "createRun", static: false, private: false, access: { has: obj => "createRun" in obj, get: obj => obj.createRun }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approve_decorators, { kind: "method", name: "approve", static: false, private: false, access: { has: obj => "approve" in obj, get: obj => obj.approve }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancel_decorators, { kind: "method", name: "cancel", static: false, private: false, access: { has: obj => "cancel" in obj, get: obj => obj.cancel }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentRunsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentRunsController = _classThis;
})();
exports.PaymentRunsController = PaymentRunsController;
/**
 * NestJS Controller for Payment operations.
 */
let PaymentsController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Payments'), (0, common_1.Controller)('api/v1/payments'), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _void_decorators;
    let _reconcile_decorators;
    let _getHistory_decorators;
    var PaymentsController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto, userId) {
            const paymentNumber = await (0, exports.generatePaymentNumber)(this.sequelize, createDto.paymentDate);
            return { paymentNumber };
        }
        async void(voidDto, userId) {
            return (0, exports.voidPayment)(this.sequelize, voidDto, userId);
        }
        async reconcile(reconDto, userId) {
            return (0, exports.reconcilePayment)(this.sequelize, reconDto, userId);
        }
        async getHistory(id) {
            return (0, exports.getPaymentHistory)(this.sequelize, id);
        }
    };
    __setFunctionName(_classThis, "PaymentsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create payment' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment created' })];
        _void_decorators = [(0, common_1.Post)(':id/void'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Void payment' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment voided' })];
        _reconcile_decorators = [(0, common_1.Post)(':id/reconcile'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Reconcile payment' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment reconciled' })];
        _getHistory_decorators = [(0, common_1.Get)(':id/history'), (0, swagger_1.ApiOperation)({ summary: 'Get payment history' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment history retrieved' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _void_decorators, { kind: "method", name: "void", static: false, private: false, access: { has: obj => "void" in obj, get: obj => obj.void }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reconcile_decorators, { kind: "method", name: "reconcile", static: false, private: false, access: { has: obj => "reconcile" in obj, get: obj => obj.reconcile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsController = _classThis;
})();
exports.PaymentsController = PaymentsController;
/**
 * NestJS Controller for ACH processing.
 */
let ACHProcessingController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('ACH Processing'), (0, common_1.Controller)('api/v1/ach'), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _processBatch_decorators;
    let _transmit_decorators;
    let _validate_decorators;
    var ACHProcessingController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async processBatch(batchDto, userId) {
            return (0, exports.processACHBatch)(this.sequelize, batchDto, userId);
        }
        async transmit(id, userId) {
            return (0, exports.transmitACHBatch)(this.sequelize, id, userId);
        }
        async validate(id) {
            return (0, exports.validateACHBatch)(this.sequelize, id);
        }
    };
    __setFunctionName(_classThis, "ACHProcessingController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _processBatch_decorators = [(0, common_1.Post)('batches'), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Process ACH batch' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'ACH batch created' })];
        _transmit_decorators = [(0, common_1.Post)('batches/:id/transmit'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Transmit ACH batch to bank' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'ACH batch transmitted' })];
        _validate_decorators = [(0, common_1.Get)('batches/:id/validate'), (0, swagger_1.ApiOperation)({ summary: 'Validate ACH batch' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation result' })];
        __esDecorate(_classThis, null, _processBatch_decorators, { kind: "method", name: "processBatch", static: false, private: false, access: { has: obj => "processBatch" in obj, get: obj => obj.processBatch }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transmit_decorators, { kind: "method", name: "transmit", static: false, private: false, access: { has: obj => "transmit" in obj, get: obj => obj.transmit }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validate_decorators, { kind: "method", name: "validate", static: false, private: false, access: { has: obj => "validate" in obj, get: obj => obj.validate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ACHProcessingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ACHProcessingController = _classThis;
})();
exports.ACHProcessingController = ACHProcessingController;
//# sourceMappingURL=payment-processing-collections-kit.js.map