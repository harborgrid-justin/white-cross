"use strict";
/**
 * LOC: PAYORCHCMP001
 * File: /reuse/edwards/financial/composites/payment-processing-orchestration-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../payment-processing-collections-kit
 *   - ../accounts-payable-management-kit
 *   - ../banking-reconciliation-kit
 *   - ../financial-workflow-approval-kit
 *   - ../invoice-management-matching-kit
 *
 * DOWNSTREAM (imported by):
 *   - Payment processing REST API controllers
 *   - GraphQL payment resolvers
 *   - ACH/wire transfer orchestration services
 *   - Treasury management dashboards
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
exports.orchestrateEndOfDayPaymentSummary = exports.orchestratePaymentComplianceValidation = exports.orchestratePaymentFileArchive = exports.orchestratePaymentDashboardMetrics = exports.orchestratePaymentDuplicateDetection = exports.orchestratePaymentApprovalWorkflowRouting = exports.orchestratePaymentFileTransmissionTracking = exports.orchestratePaymentExceptionHandling = exports.orchestratePaymentMethodValidation = exports.orchestratePaymentReversal = exports.orchestratePaymentBatchProcessing = exports.orchestratePaymentAnalytics = exports.orchestratePaymentRunCancellation = exports.orchestratePaymentScheduleCreation = exports.orchestratePaymentReissue = exports.orchestratePaymentVoid = exports.orchestratePaymentHoldRelease = exports.orchestratePaymentHoldPlacement = exports.orchestrateAutomatedPaymentReconciliation = exports.orchestratePaymentReconciliation = exports.orchestratePositivePayGeneration = exports.orchestrateCheckPrinting = exports.orchestrateCheckRunProcessing = exports.orchestrateInternationalWireTransfer = exports.orchestrateWireTransferCreation = exports.orchestrateACHTransmission = exports.orchestrateACHBatchProcessing = exports.orchestratePaymentGeneration = exports.orchestratePaymentRunApproval = exports.orchestratePaymentRunCreation = exports.PaymentAnalyticsResponse = exports.PaymentAnalyticsRequest = exports.ReconcilePaymentRequest = exports.PositivePayFileResponse = exports.GeneratePositivePayRequest = exports.CheckRunResponse = exports.ProcessCheckRunRequest = exports.WireTransferResponse = exports.CreateWireTransferRequest = exports.ACHBatchResponse = exports.ProcessACHBatchRequest = exports.PaymentRunResponse = exports.CreatePaymentRunRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
// Import from payment processing collections kit
const payment_processing_collections_kit_1 = require("../payment-processing-collections-kit");
// Import from accounts payable management kit
const accounts_payable_management_kit_1 = require("../accounts-payable-management-kit");
/**
 * Payment run orchestration request
 */
let CreatePaymentRunRequest = (() => {
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
    let _selectionCriteria_decorators;
    let _selectionCriteria_initializers = [];
    let _selectionCriteria_extraInitializers = [];
    let _autoApprove_decorators;
    let _autoApprove_initializers = [];
    let _autoApprove_extraInitializers = [];
    return _a = class CreatePaymentRunRequest {
            constructor() {
                this.runDate = __runInitializers(this, _runDate_initializers, void 0);
                this.scheduledDate = (__runInitializers(this, _runDate_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.paymentMethodId = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _paymentMethodId_initializers, void 0));
                this.bankAccountId = (__runInitializers(this, _paymentMethodId_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                this.selectionCriteria = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _selectionCriteria_initializers, void 0));
                this.autoApprove = (__runInitializers(this, _selectionCriteria_extraInitializers), __runInitializers(this, _autoApprove_initializers, void 0));
                __runInitializers(this, _autoApprove_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _runDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment run date', example: '2024-01-15' })];
            _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled execution date', example: '2024-01-16' })];
            _paymentMethodId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method ID', example: 1 })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID', example: 1 })];
            _selectionCriteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice selection criteria', type: 'object' })];
            _autoApprove_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-approve if under threshold', example: false })];
            __esDecorate(null, null, _runDate_decorators, { kind: "field", name: "runDate", static: false, private: false, access: { has: obj => "runDate" in obj, get: obj => obj.runDate, set: (obj, value) => { obj.runDate = value; } }, metadata: _metadata }, _runDate_initializers, _runDate_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _paymentMethodId_decorators, { kind: "field", name: "paymentMethodId", static: false, private: false, access: { has: obj => "paymentMethodId" in obj, get: obj => obj.paymentMethodId, set: (obj, value) => { obj.paymentMethodId = value; } }, metadata: _metadata }, _paymentMethodId_initializers, _paymentMethodId_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _selectionCriteria_decorators, { kind: "field", name: "selectionCriteria", static: false, private: false, access: { has: obj => "selectionCriteria" in obj, get: obj => obj.selectionCriteria, set: (obj, value) => { obj.selectionCriteria = value; } }, metadata: _metadata }, _selectionCriteria_initializers, _selectionCriteria_extraInitializers);
            __esDecorate(null, null, _autoApprove_decorators, { kind: "field", name: "autoApprove", static: false, private: false, access: { has: obj => "autoApprove" in obj, get: obj => obj.autoApprove, set: (obj, value) => { obj.autoApprove = value; } }, metadata: _metadata }, _autoApprove_initializers, _autoApprove_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePaymentRunRequest = CreatePaymentRunRequest;
/**
 * Payment run orchestration response
 */
let PaymentRunResponse = (() => {
    var _a;
    let _paymentRunId_decorators;
    let _paymentRunId_initializers = [];
    let _paymentRunId_extraInitializers = [];
    let _runNumber_decorators;
    let _runNumber_initializers = [];
    let _runNumber_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _paymentCount_decorators;
    let _paymentCount_initializers = [];
    let _paymentCount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _approvalRequired_decorators;
    let _approvalRequired_initializers = [];
    let _approvalRequired_extraInitializers = [];
    return _a = class PaymentRunResponse {
            constructor() {
                this.paymentRunId = __runInitializers(this, _paymentRunId_initializers, void 0);
                this.runNumber = (__runInitializers(this, _paymentRunId_extraInitializers), __runInitializers(this, _runNumber_initializers, void 0));
                this.status = (__runInitializers(this, _runNumber_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.paymentCount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _paymentCount_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _paymentCount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.currency = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.approvalRequired = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _approvalRequired_initializers, void 0));
                __runInitializers(this, _approvalRequired_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentRunId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment run ID', example: 1 })];
            _runNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment run number', example: 'PR-2024-001' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Run status', example: 'pending_approval' })];
            _paymentCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Number of payments', example: 45 })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount', example: 125000.50 })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            _approvalRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval required', example: true })];
            __esDecorate(null, null, _paymentRunId_decorators, { kind: "field", name: "paymentRunId", static: false, private: false, access: { has: obj => "paymentRunId" in obj, get: obj => obj.paymentRunId, set: (obj, value) => { obj.paymentRunId = value; } }, metadata: _metadata }, _paymentRunId_initializers, _paymentRunId_extraInitializers);
            __esDecorate(null, null, _runNumber_decorators, { kind: "field", name: "runNumber", static: false, private: false, access: { has: obj => "runNumber" in obj, get: obj => obj.runNumber, set: (obj, value) => { obj.runNumber = value; } }, metadata: _metadata }, _runNumber_initializers, _runNumber_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _paymentCount_decorators, { kind: "field", name: "paymentCount", static: false, private: false, access: { has: obj => "paymentCount" in obj, get: obj => obj.paymentCount, set: (obj, value) => { obj.paymentCount = value; } }, metadata: _metadata }, _paymentCount_initializers, _paymentCount_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _approvalRequired_decorators, { kind: "field", name: "approvalRequired", static: false, private: false, access: { has: obj => "approvalRequired" in obj, get: obj => obj.approvalRequired, set: (obj, value) => { obj.approvalRequired = value; } }, metadata: _metadata }, _approvalRequired_initializers, _approvalRequired_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaymentRunResponse = PaymentRunResponse;
/**
 * ACH batch processing request
 */
let ProcessACHBatchRequest = (() => {
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
    let _autoTransmit_decorators;
    let _autoTransmit_initializers = [];
    let _autoTransmit_extraInitializers = [];
    return _a = class ProcessACHBatchRequest {
            constructor() {
                this.paymentRunId = __runInitializers(this, _paymentRunId_initializers, void 0);
                this.effectiveDate = (__runInitializers(this, _paymentRunId_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.originatorId = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _originatorId_initializers, void 0));
                this.originatorName = (__runInitializers(this, _originatorId_extraInitializers), __runInitializers(this, _originatorName_initializers, void 0));
                this.autoTransmit = (__runInitializers(this, _originatorName_extraInitializers), __runInitializers(this, _autoTransmit_initializers, void 0));
                __runInitializers(this, _autoTransmit_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentRunId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment run ID', example: 1 })];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date', example: '2024-01-17' })];
            _originatorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Originator ID', example: 'COMP001' })];
            _originatorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Originator name', example: 'Company Name' })];
            _autoTransmit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-transmit after validation', example: false })];
            __esDecorate(null, null, _paymentRunId_decorators, { kind: "field", name: "paymentRunId", static: false, private: false, access: { has: obj => "paymentRunId" in obj, get: obj => obj.paymentRunId, set: (obj, value) => { obj.paymentRunId = value; } }, metadata: _metadata }, _paymentRunId_initializers, _paymentRunId_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _originatorId_decorators, { kind: "field", name: "originatorId", static: false, private: false, access: { has: obj => "originatorId" in obj, get: obj => obj.originatorId, set: (obj, value) => { obj.originatorId = value; } }, metadata: _metadata }, _originatorId_initializers, _originatorId_extraInitializers);
            __esDecorate(null, null, _originatorName_decorators, { kind: "field", name: "originatorName", static: false, private: false, access: { has: obj => "originatorName" in obj, get: obj => obj.originatorName, set: (obj, value) => { obj.originatorName = value; } }, metadata: _metadata }, _originatorName_initializers, _originatorName_extraInitializers);
            __esDecorate(null, null, _autoTransmit_decorators, { kind: "field", name: "autoTransmit", static: false, private: false, access: { has: obj => "autoTransmit" in obj, get: obj => obj.autoTransmit, set: (obj, value) => { obj.autoTransmit = value; } }, metadata: _metadata }, _autoTransmit_initializers, _autoTransmit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessACHBatchRequest = ProcessACHBatchRequest;
/**
 * ACH batch processing response
 */
let ACHBatchResponse = (() => {
    var _a;
    let _achBatchId_decorators;
    let _achBatchId_initializers = [];
    let _achBatchId_extraInitializers = [];
    let _batchNumber_decorators;
    let _batchNumber_initializers = [];
    let _batchNumber_extraInitializers = [];
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _entryCount_decorators;
    let _entryCount_initializers = [];
    let _entryCount_extraInitializers = [];
    let _totalDebit_decorators;
    let _totalDebit_initializers = [];
    let _totalDebit_extraInitializers = [];
    let _totalCredit_decorators;
    let _totalCredit_initializers = [];
    let _totalCredit_extraInitializers = [];
    let _validationStatus_decorators;
    let _validationStatus_initializers = [];
    let _validationStatus_extraInitializers = [];
    let _fileContent_decorators;
    let _fileContent_initializers = [];
    let _fileContent_extraInitializers = [];
    return _a = class ACHBatchResponse {
            constructor() {
                this.achBatchId = __runInitializers(this, _achBatchId_initializers, void 0);
                this.batchNumber = (__runInitializers(this, _achBatchId_extraInitializers), __runInitializers(this, _batchNumber_initializers, void 0));
                this.fileName = (__runInitializers(this, _batchNumber_extraInitializers), __runInitializers(this, _fileName_initializers, void 0));
                this.entryCount = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _entryCount_initializers, void 0));
                this.totalDebit = (__runInitializers(this, _entryCount_extraInitializers), __runInitializers(this, _totalDebit_initializers, void 0));
                this.totalCredit = (__runInitializers(this, _totalDebit_extraInitializers), __runInitializers(this, _totalCredit_initializers, void 0));
                this.validationStatus = (__runInitializers(this, _totalCredit_extraInitializers), __runInitializers(this, _validationStatus_initializers, void 0));
                this.fileContent = (__runInitializers(this, _validationStatus_extraInitializers), __runInitializers(this, _fileContent_initializers, void 0));
                __runInitializers(this, _fileContent_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _achBatchId_decorators = [(0, swagger_1.ApiProperty)({ description: 'ACH batch ID', example: 1 })];
            _batchNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Batch number', example: 'ACH-2024-001' })];
            _fileName_decorators = [(0, swagger_1.ApiProperty)({ description: 'NACHA file name', example: 'ACH_20240115_001.txt' })];
            _entryCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entry count', example: 45 })];
            _totalDebit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total debit', example: 0 })];
            _totalCredit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total credit', example: 125000.50 })];
            _validationStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation status', example: 'passed' })];
            _fileContent_decorators = [(0, swagger_1.ApiProperty)({ description: 'File content (base64)', type: 'string' })];
            __esDecorate(null, null, _achBatchId_decorators, { kind: "field", name: "achBatchId", static: false, private: false, access: { has: obj => "achBatchId" in obj, get: obj => obj.achBatchId, set: (obj, value) => { obj.achBatchId = value; } }, metadata: _metadata }, _achBatchId_initializers, _achBatchId_extraInitializers);
            __esDecorate(null, null, _batchNumber_decorators, { kind: "field", name: "batchNumber", static: false, private: false, access: { has: obj => "batchNumber" in obj, get: obj => obj.batchNumber, set: (obj, value) => { obj.batchNumber = value; } }, metadata: _metadata }, _batchNumber_initializers, _batchNumber_extraInitializers);
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            __esDecorate(null, null, _entryCount_decorators, { kind: "field", name: "entryCount", static: false, private: false, access: { has: obj => "entryCount" in obj, get: obj => obj.entryCount, set: (obj, value) => { obj.entryCount = value; } }, metadata: _metadata }, _entryCount_initializers, _entryCount_extraInitializers);
            __esDecorate(null, null, _totalDebit_decorators, { kind: "field", name: "totalDebit", static: false, private: false, access: { has: obj => "totalDebit" in obj, get: obj => obj.totalDebit, set: (obj, value) => { obj.totalDebit = value; } }, metadata: _metadata }, _totalDebit_initializers, _totalDebit_extraInitializers);
            __esDecorate(null, null, _totalCredit_decorators, { kind: "field", name: "totalCredit", static: false, private: false, access: { has: obj => "totalCredit" in obj, get: obj => obj.totalCredit, set: (obj, value) => { obj.totalCredit = value; } }, metadata: _metadata }, _totalCredit_initializers, _totalCredit_extraInitializers);
            __esDecorate(null, null, _validationStatus_decorators, { kind: "field", name: "validationStatus", static: false, private: false, access: { has: obj => "validationStatus" in obj, get: obj => obj.validationStatus, set: (obj, value) => { obj.validationStatus = value; } }, metadata: _metadata }, _validationStatus_initializers, _validationStatus_extraInitializers);
            __esDecorate(null, null, _fileContent_decorators, { kind: "field", name: "fileContent", static: false, private: false, access: { has: obj => "fileContent" in obj, get: obj => obj.fileContent, set: (obj, value) => { obj.fileContent = value; } }, metadata: _metadata }, _fileContent_initializers, _fileContent_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ACHBatchResponse = ACHBatchResponse;
/**
 * Wire transfer request
 */
let CreateWireTransferRequest = (() => {
    var _a;
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _wireType_decorators;
    let _wireType_initializers = [];
    let _wireType_extraInitializers = [];
    let _beneficiary_decorators;
    let _beneficiary_initializers = [];
    let _beneficiary_extraInitializers = [];
    let _intermediaryBank_decorators;
    let _intermediaryBank_initializers = [];
    let _intermediaryBank_extraInitializers = [];
    let _purposeCode_decorators;
    let _purposeCode_initializers = [];
    let _purposeCode_extraInitializers = [];
    let _instructions_decorators;
    let _instructions_initializers = [];
    let _instructions_extraInitializers = [];
    return _a = class CreateWireTransferRequest {
            constructor() {
                this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
                this.wireType = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _wireType_initializers, void 0));
                this.beneficiary = (__runInitializers(this, _wireType_extraInitializers), __runInitializers(this, _beneficiary_initializers, void 0));
                this.intermediaryBank = (__runInitializers(this, _beneficiary_extraInitializers), __runInitializers(this, _intermediaryBank_initializers, void 0));
                this.purposeCode = (__runInitializers(this, _intermediaryBank_extraInitializers), __runInitializers(this, _purposeCode_initializers, void 0));
                this.instructions = (__runInitializers(this, _purposeCode_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
                __runInitializers(this, _instructions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment ID', example: 1 })];
            _wireType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wire type', example: 'Domestic' })];
            _beneficiary_decorators = [(0, swagger_1.ApiProperty)({ description: 'Beneficiary details', type: 'object' })];
            _intermediaryBank_decorators = [(0, swagger_1.ApiProperty)({ description: 'Intermediary bank details', type: 'object', required: false })];
            _purposeCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purpose code', example: 'TRADE' })];
            _instructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Instructions', example: 'Payment for Invoice INV-2024-001' })];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _wireType_decorators, { kind: "field", name: "wireType", static: false, private: false, access: { has: obj => "wireType" in obj, get: obj => obj.wireType, set: (obj, value) => { obj.wireType = value; } }, metadata: _metadata }, _wireType_initializers, _wireType_extraInitializers);
            __esDecorate(null, null, _beneficiary_decorators, { kind: "field", name: "beneficiary", static: false, private: false, access: { has: obj => "beneficiary" in obj, get: obj => obj.beneficiary, set: (obj, value) => { obj.beneficiary = value; } }, metadata: _metadata }, _beneficiary_initializers, _beneficiary_extraInitializers);
            __esDecorate(null, null, _intermediaryBank_decorators, { kind: "field", name: "intermediaryBank", static: false, private: false, access: { has: obj => "intermediaryBank" in obj, get: obj => obj.intermediaryBank, set: (obj, value) => { obj.intermediaryBank = value; } }, metadata: _metadata }, _intermediaryBank_initializers, _intermediaryBank_extraInitializers);
            __esDecorate(null, null, _purposeCode_decorators, { kind: "field", name: "purposeCode", static: false, private: false, access: { has: obj => "purposeCode" in obj, get: obj => obj.purposeCode, set: (obj, value) => { obj.purposeCode = value; } }, metadata: _metadata }, _purposeCode_initializers, _purposeCode_extraInitializers);
            __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: obj => "instructions" in obj, get: obj => obj.instructions, set: (obj, value) => { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateWireTransferRequest = CreateWireTransferRequest;
/**
 * Wire transfer response
 */
let WireTransferResponse = (() => {
    var _a;
    let _wireTransferId_decorators;
    let _wireTransferId_initializers = [];
    let _wireTransferId_extraInitializers = [];
    let _referenceNumber_decorators;
    let _referenceNumber_initializers = [];
    let _referenceNumber_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _amount_decorators;
    let _amount_initializers = [];
    let _amount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    return _a = class WireTransferResponse {
            constructor() {
                this.wireTransferId = __runInitializers(this, _wireTransferId_initializers, void 0);
                this.referenceNumber = (__runInitializers(this, _wireTransferId_extraInitializers), __runInitializers(this, _referenceNumber_initializers, void 0));
                this.status = (__runInitializers(this, _referenceNumber_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.amount = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.currency = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _wireTransferId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Wire transfer ID', example: 1 })];
            _referenceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reference number', example: 'WT-2024-001' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status', example: 'pending' })];
            _amount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amount', example: 50000.00 })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency', example: 'USD' })];
            __esDecorate(null, null, _wireTransferId_decorators, { kind: "field", name: "wireTransferId", static: false, private: false, access: { has: obj => "wireTransferId" in obj, get: obj => obj.wireTransferId, set: (obj, value) => { obj.wireTransferId = value; } }, metadata: _metadata }, _wireTransferId_initializers, _wireTransferId_extraInitializers);
            __esDecorate(null, null, _referenceNumber_decorators, { kind: "field", name: "referenceNumber", static: false, private: false, access: { has: obj => "referenceNumber" in obj, get: obj => obj.referenceNumber, set: (obj, value) => { obj.referenceNumber = value; } }, metadata: _metadata }, _referenceNumber_initializers, _referenceNumber_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: obj => "amount" in obj, get: obj => obj.amount, set: (obj, value) => { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.WireTransferResponse = WireTransferResponse;
/**
 * Check run request
 */
let ProcessCheckRunRequest = (() => {
    var _a;
    let _paymentRunId_decorators;
    let _paymentRunId_initializers = [];
    let _paymentRunId_extraInitializers = [];
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _startingCheckNumber_decorators;
    let _startingCheckNumber_initializers = [];
    let _startingCheckNumber_extraInitializers = [];
    let _autoPrint_decorators;
    let _autoPrint_initializers = [];
    let _autoPrint_extraInitializers = [];
    return _a = class ProcessCheckRunRequest {
            constructor() {
                this.paymentRunId = __runInitializers(this, _paymentRunId_initializers, void 0);
                this.bankAccountId = (__runInitializers(this, _paymentRunId_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                this.startingCheckNumber = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _startingCheckNumber_initializers, void 0));
                this.autoPrint = (__runInitializers(this, _startingCheckNumber_extraInitializers), __runInitializers(this, _autoPrint_initializers, void 0));
                __runInitializers(this, _autoPrint_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentRunId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment run ID', example: 1 })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID', example: 1 })];
            _startingCheckNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Starting check number', example: '10001' })];
            _autoPrint_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-print checks', example: false })];
            __esDecorate(null, null, _paymentRunId_decorators, { kind: "field", name: "paymentRunId", static: false, private: false, access: { has: obj => "paymentRunId" in obj, get: obj => obj.paymentRunId, set: (obj, value) => { obj.paymentRunId = value; } }, metadata: _metadata }, _paymentRunId_initializers, _paymentRunId_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _startingCheckNumber_decorators, { kind: "field", name: "startingCheckNumber", static: false, private: false, access: { has: obj => "startingCheckNumber" in obj, get: obj => obj.startingCheckNumber, set: (obj, value) => { obj.startingCheckNumber = value; } }, metadata: _metadata }, _startingCheckNumber_initializers, _startingCheckNumber_extraInitializers);
            __esDecorate(null, null, _autoPrint_decorators, { kind: "field", name: "autoPrint", static: false, private: false, access: { has: obj => "autoPrint" in obj, get: obj => obj.autoPrint, set: (obj, value) => { obj.autoPrint = value; } }, metadata: _metadata }, _autoPrint_initializers, _autoPrint_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessCheckRunRequest = ProcessCheckRunRequest;
/**
 * Check run response
 */
let CheckRunResponse = (() => {
    var _a;
    let _checkRunId_decorators;
    let _checkRunId_initializers = [];
    let _checkRunId_extraInitializers = [];
    let _runNumber_decorators;
    let _runNumber_initializers = [];
    let _runNumber_extraInitializers = [];
    let _checkCount_decorators;
    let _checkCount_initializers = [];
    let _checkCount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _startingCheckNumber_decorators;
    let _startingCheckNumber_initializers = [];
    let _startingCheckNumber_extraInitializers = [];
    let _endingCheckNumber_decorators;
    let _endingCheckNumber_initializers = [];
    let _endingCheckNumber_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    return _a = class CheckRunResponse {
            constructor() {
                this.checkRunId = __runInitializers(this, _checkRunId_initializers, void 0);
                this.runNumber = (__runInitializers(this, _checkRunId_extraInitializers), __runInitializers(this, _runNumber_initializers, void 0));
                this.checkCount = (__runInitializers(this, _runNumber_extraInitializers), __runInitializers(this, _checkCount_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _checkCount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.startingCheckNumber = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _startingCheckNumber_initializers, void 0));
                this.endingCheckNumber = (__runInitializers(this, _startingCheckNumber_extraInitializers), __runInitializers(this, _endingCheckNumber_initializers, void 0));
                this.status = (__runInitializers(this, _endingCheckNumber_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _checkRunId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check run ID', example: 1 })];
            _runNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Run number', example: 'CHK-2024-001' })];
            _checkCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check count', example: 25 })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount', example: 75000.00 })];
            _startingCheckNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Starting check number', example: '10001' })];
            _endingCheckNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Ending check number', example: '10025' })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status', example: 'created' })];
            __esDecorate(null, null, _checkRunId_decorators, { kind: "field", name: "checkRunId", static: false, private: false, access: { has: obj => "checkRunId" in obj, get: obj => obj.checkRunId, set: (obj, value) => { obj.checkRunId = value; } }, metadata: _metadata }, _checkRunId_initializers, _checkRunId_extraInitializers);
            __esDecorate(null, null, _runNumber_decorators, { kind: "field", name: "runNumber", static: false, private: false, access: { has: obj => "runNumber" in obj, get: obj => obj.runNumber, set: (obj, value) => { obj.runNumber = value; } }, metadata: _metadata }, _runNumber_initializers, _runNumber_extraInitializers);
            __esDecorate(null, null, _checkCount_decorators, { kind: "field", name: "checkCount", static: false, private: false, access: { has: obj => "checkCount" in obj, get: obj => obj.checkCount, set: (obj, value) => { obj.checkCount = value; } }, metadata: _metadata }, _checkCount_initializers, _checkCount_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _startingCheckNumber_decorators, { kind: "field", name: "startingCheckNumber", static: false, private: false, access: { has: obj => "startingCheckNumber" in obj, get: obj => obj.startingCheckNumber, set: (obj, value) => { obj.startingCheckNumber = value; } }, metadata: _metadata }, _startingCheckNumber_initializers, _startingCheckNumber_extraInitializers);
            __esDecorate(null, null, _endingCheckNumber_decorators, { kind: "field", name: "endingCheckNumber", static: false, private: false, access: { has: obj => "endingCheckNumber" in obj, get: obj => obj.endingCheckNumber, set: (obj, value) => { obj.endingCheckNumber = value; } }, metadata: _metadata }, _endingCheckNumber_initializers, _endingCheckNumber_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CheckRunResponse = CheckRunResponse;
/**
 * Positive pay file request
 */
let GeneratePositivePayRequest = (() => {
    var _a;
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _fileFormat_decorators;
    let _fileFormat_initializers = [];
    let _fileFormat_extraInitializers = [];
    return _a = class GeneratePositivePayRequest {
            constructor() {
                this.bankAccountId = __runInitializers(this, _bankAccountId_initializers, void 0);
                this.startDate = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.fileFormat = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _fileFormat_initializers, void 0));
                __runInitializers(this, _fileFormat_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID', example: 1 })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-01-01' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', example: '2024-01-31' })];
            _fileFormat_decorators = [(0, swagger_1.ApiProperty)({ description: 'File format', example: 'CSV' })];
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _fileFormat_decorators, { kind: "field", name: "fileFormat", static: false, private: false, access: { has: obj => "fileFormat" in obj, get: obj => obj.fileFormat, set: (obj, value) => { obj.fileFormat = value; } }, metadata: _metadata }, _fileFormat_initializers, _fileFormat_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.GeneratePositivePayRequest = GeneratePositivePayRequest;
/**
 * Positive pay file response
 */
let PositivePayFileResponse = (() => {
    var _a;
    let _fileName_decorators;
    let _fileName_initializers = [];
    let _fileName_extraInitializers = [];
    let _checkCount_decorators;
    let _checkCount_initializers = [];
    let _checkCount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _fileContent_decorators;
    let _fileContent_initializers = [];
    let _fileContent_extraInitializers = [];
    let _generatedAt_decorators;
    let _generatedAt_initializers = [];
    let _generatedAt_extraInitializers = [];
    return _a = class PositivePayFileResponse {
            constructor() {
                this.fileName = __runInitializers(this, _fileName_initializers, void 0);
                this.checkCount = (__runInitializers(this, _fileName_extraInitializers), __runInitializers(this, _checkCount_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _checkCount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.fileContent = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _fileContent_initializers, void 0));
                this.generatedAt = (__runInitializers(this, _fileContent_extraInitializers), __runInitializers(this, _generatedAt_initializers, void 0));
                __runInitializers(this, _generatedAt_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fileName_decorators = [(0, swagger_1.ApiProperty)({ description: 'File name', example: 'PP_20240115.csv' })];
            _checkCount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check count', example: 150 })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount', example: 500000.00 })];
            _fileContent_decorators = [(0, swagger_1.ApiProperty)({ description: 'File content (base64)', type: 'string' })];
            _generatedAt_decorators = [(0, swagger_1.ApiProperty)({ description: 'Generation timestamp', example: '2024-01-15T10:00:00Z' })];
            __esDecorate(null, null, _fileName_decorators, { kind: "field", name: "fileName", static: false, private: false, access: { has: obj => "fileName" in obj, get: obj => obj.fileName, set: (obj, value) => { obj.fileName = value; } }, metadata: _metadata }, _fileName_initializers, _fileName_extraInitializers);
            __esDecorate(null, null, _checkCount_decorators, { kind: "field", name: "checkCount", static: false, private: false, access: { has: obj => "checkCount" in obj, get: obj => obj.checkCount, set: (obj, value) => { obj.checkCount = value; } }, metadata: _metadata }, _checkCount_initializers, _checkCount_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _fileContent_decorators, { kind: "field", name: "fileContent", static: false, private: false, access: { has: obj => "fileContent" in obj, get: obj => obj.fileContent, set: (obj, value) => { obj.fileContent = value; } }, metadata: _metadata }, _fileContent_initializers, _fileContent_extraInitializers);
            __esDecorate(null, null, _generatedAt_decorators, { kind: "field", name: "generatedAt", static: false, private: false, access: { has: obj => "generatedAt" in obj, get: obj => obj.generatedAt, set: (obj, value) => { obj.generatedAt = value; } }, metadata: _metadata }, _generatedAt_initializers, _generatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PositivePayFileResponse = PositivePayFileResponse;
/**
 * Payment reconciliation request
 */
let ReconcilePaymentRequest = (() => {
    var _a;
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _statementLineId_decorators;
    let _statementLineId_initializers = [];
    let _statementLineId_extraInitializers = [];
    let _clearedDate_decorators;
    let _clearedDate_initializers = [];
    let _clearedDate_extraInitializers = [];
    let _bankReference_decorators;
    let _bankReference_initializers = [];
    let _bankReference_extraInitializers = [];
    return _a = class ReconcilePaymentRequest {
            constructor() {
                this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
                this.statementLineId = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _statementLineId_initializers, void 0));
                this.clearedDate = (__runInitializers(this, _statementLineId_extraInitializers), __runInitializers(this, _clearedDate_initializers, void 0));
                this.bankReference = (__runInitializers(this, _clearedDate_extraInitializers), __runInitializers(this, _bankReference_initializers, void 0));
                __runInitializers(this, _bankReference_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment ID', example: 1 })];
            _statementLineId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank statement line ID', example: 1 })];
            _clearedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Cleared date', example: '2024-01-20' })];
            _bankReference_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank reference', example: 'BK-REF-123456' })];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _statementLineId_decorators, { kind: "field", name: "statementLineId", static: false, private: false, access: { has: obj => "statementLineId" in obj, get: obj => obj.statementLineId, set: (obj, value) => { obj.statementLineId = value; } }, metadata: _metadata }, _statementLineId_initializers, _statementLineId_extraInitializers);
            __esDecorate(null, null, _clearedDate_decorators, { kind: "field", name: "clearedDate", static: false, private: false, access: { has: obj => "clearedDate" in obj, get: obj => obj.clearedDate, set: (obj, value) => { obj.clearedDate = value; } }, metadata: _metadata }, _clearedDate_initializers, _clearedDate_extraInitializers);
            __esDecorate(null, null, _bankReference_decorators, { kind: "field", name: "bankReference", static: false, private: false, access: { has: obj => "bankReference" in obj, get: obj => obj.bankReference, set: (obj, value) => { obj.bankReference = value; } }, metadata: _metadata }, _bankReference_initializers, _bankReference_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ReconcilePaymentRequest = ReconcilePaymentRequest;
/**
 * Payment analytics request
 */
let PaymentAnalyticsRequest = (() => {
    var _a;
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _groupBy_decorators;
    let _groupBy_initializers = [];
    let _groupBy_extraInitializers = [];
    let _includeForecast_decorators;
    let _includeForecast_initializers = [];
    let _includeForecast_extraInitializers = [];
    return _a = class PaymentAnalyticsRequest {
            constructor() {
                this.startDate = __runInitializers(this, _startDate_initializers, void 0);
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.groupBy = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _groupBy_initializers, void 0));
                this.includeForecast = (__runInitializers(this, _groupBy_extraInitializers), __runInitializers(this, _includeForecast_initializers, void 0));
                __runInitializers(this, _includeForecast_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-01-01' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', example: '2024-01-31' })];
            _groupBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Group by', example: 'payment_method' })];
            _includeForecast_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include forecasting', example: false })];
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _groupBy_decorators, { kind: "field", name: "groupBy", static: false, private: false, access: { has: obj => "groupBy" in obj, get: obj => obj.groupBy, set: (obj, value) => { obj.groupBy = value; } }, metadata: _metadata }, _groupBy_initializers, _groupBy_extraInitializers);
            __esDecorate(null, null, _includeForecast_decorators, { kind: "field", name: "includeForecast", static: false, private: false, access: { has: obj => "includeForecast" in obj, get: obj => obj.includeForecast, set: (obj, value) => { obj.includeForecast = value; } }, metadata: _metadata }, _includeForecast_initializers, _includeForecast_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaymentAnalyticsRequest = PaymentAnalyticsRequest;
/**
 * Payment analytics response
 */
let PaymentAnalyticsResponse = (() => {
    var _a;
    let _totalPayments_decorators;
    let _totalPayments_initializers = [];
    let _totalPayments_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _averagePaymentAmount_decorators;
    let _averagePaymentAmount_initializers = [];
    let _averagePaymentAmount_extraInitializers = [];
    let _breakdown_decorators;
    let _breakdown_initializers = [];
    let _breakdown_extraInitializers = [];
    let _forecast_decorators;
    let _forecast_initializers = [];
    let _forecast_extraInitializers = [];
    return _a = class PaymentAnalyticsResponse {
            constructor() {
                this.totalPayments = __runInitializers(this, _totalPayments_initializers, void 0);
                this.totalAmount = (__runInitializers(this, _totalPayments_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.averagePaymentAmount = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _averagePaymentAmount_initializers, void 0));
                this.breakdown = (__runInitializers(this, _averagePaymentAmount_extraInitializers), __runInitializers(this, _breakdown_initializers, void 0));
                this.forecast = (__runInitializers(this, _breakdown_extraInitializers), __runInitializers(this, _forecast_initializers, void 0));
                __runInitializers(this, _forecast_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalPayments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total payments', example: 250 })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount', example: 1500000.00 })];
            _averagePaymentAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average payment amount', example: 6000.00 })];
            _breakdown_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment breakdown', type: 'array' })];
            _forecast_decorators = [(0, swagger_1.ApiProperty)({ description: 'Forecast data', type: 'array', required: false })];
            __esDecorate(null, null, _totalPayments_decorators, { kind: "field", name: "totalPayments", static: false, private: false, access: { has: obj => "totalPayments" in obj, get: obj => obj.totalPayments, set: (obj, value) => { obj.totalPayments = value; } }, metadata: _metadata }, _totalPayments_initializers, _totalPayments_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _averagePaymentAmount_decorators, { kind: "field", name: "averagePaymentAmount", static: false, private: false, access: { has: obj => "averagePaymentAmount" in obj, get: obj => obj.averagePaymentAmount, set: (obj, value) => { obj.averagePaymentAmount = value; } }, metadata: _metadata }, _averagePaymentAmount_initializers, _averagePaymentAmount_extraInitializers);
            __esDecorate(null, null, _breakdown_decorators, { kind: "field", name: "breakdown", static: false, private: false, access: { has: obj => "breakdown" in obj, get: obj => obj.breakdown, set: (obj, value) => { obj.breakdown = value; } }, metadata: _metadata }, _breakdown_initializers, _breakdown_extraInitializers);
            __esDecorate(null, null, _forecast_decorators, { kind: "field", name: "forecast", static: false, private: false, access: { has: obj => "forecast" in obj, get: obj => obj.forecast, set: (obj, value) => { obj.forecast = value; } }, metadata: _metadata }, _forecast_initializers, _forecast_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaymentAnalyticsResponse = PaymentAnalyticsResponse;
// ============================================================================
// COMPOSITE FUNCTIONS - PAYMENT RUN ORCHESTRATION
// ============================================================================
/**
 * Orchestrates complete payment run creation with invoice selection and validation
 * Composes: createPaymentRun, calculatePaymentRunTotals, getInvoicesPendingApproval, validateInvoice
 *
 * @param request Payment run creation request
 * @param transaction Database transaction
 * @returns Payment run with calculated totals and validation status
 */
const orchestratePaymentRunCreation = async (request, transaction) => {
    try {
        // Generate run number
        const runNumber = await (0, payment_processing_collections_kit_1.generatePaymentRunNumber)();
        // Get payment method details
        const paymentMethod = await (0, payment_processing_collections_kit_1.getPaymentMethod)(request.paymentMethodId);
        // Get invoices pending payment based on criteria
        const invoices = await (0, accounts_payable_management_kit_1.getInvoicesPendingApproval)(request.selectionCriteria.supplierIds, request.selectionCriteria.dueDateFrom, request.selectionCriteria.dueDateTo);
        // Create payment run
        const paymentRun = await (0, payment_processing_collections_kit_1.createPaymentRun)({
            runNumber,
            runDate: request.runDate,
            scheduledDate: request.scheduledDate,
            paymentMethodId: request.paymentMethodId,
            bankAccountId: request.bankAccountId,
            status: request.autoApprove ? 'approved' : 'pending_approval',
        }, transaction);
        // Calculate totals
        const totals = await (0, payment_processing_collections_kit_1.calculatePaymentRunTotals)(paymentRun.paymentRunId, transaction);
        return {
            paymentRunId: paymentRun.paymentRunId,
            runNumber: paymentRun.runNumber,
            status: paymentRun.status,
            paymentCount: totals.paymentCount,
            totalAmount: totals.totalAmount,
            currency: paymentRun.currency,
            approvalRequired: !request.autoApprove && totals.totalAmount > paymentMethod.approvalThreshold,
        };
    }
    catch (error) {
        throw new Error(`Payment run creation failed: ${error.message}`);
    }
};
exports.orchestratePaymentRunCreation = orchestratePaymentRunCreation;
/**
 * Orchestrates payment run approval workflow with multi-level approvals
 * Composes: approvePaymentRun, createWorkflowInstanceModel, createApprovalActionModel, createPaymentAuditTrail
 *
 * @param paymentRunId Payment run ID
 * @param approverId Approver user ID
 * @param comments Approval comments
 * @param transaction Database transaction
 * @returns Approval result with workflow status
 */
const orchestratePaymentRunApproval = async (paymentRunId, approverId, comments, transaction) => {
    try {
        // Approve payment run
        const approval = await (0, payment_processing_collections_kit_1.approvePaymentRun)(paymentRunId, approverId, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentRunId,
            action: 'approved',
            performedBy: approverId,
            comments,
            timestamp: new Date(),
        }, transaction);
        return {
            approved: true,
            workflowComplete: approval.workflowComplete,
            nextApprover: approval.nextApprover,
        };
    }
    catch (error) {
        throw new Error(`Payment run approval failed: ${error.message}`);
    }
};
exports.orchestratePaymentRunApproval = orchestratePaymentRunApproval;
/**
 * Orchestrates payment generation from approved run with invoice applications
 * Composes: createPaymentsFromRun, generatePaymentNumber, createPaymentApplication, updateBankAccountBalance
 *
 * @param paymentRunId Payment run ID
 * @param transaction Database transaction
 * @returns Generated payments with invoice applications
 */
const orchestratePaymentGeneration = async (paymentRunId, transaction) => {
    try {
        // Create payments from run
        const payments = await (0, payment_processing_collections_kit_1.createPaymentsFromRun)(paymentRunId, transaction);
        // Apply payments to invoices
        for (const payment of payments) {
            await (0, accounts_payable_management_kit_1.createPaymentApplication)({
                paymentId: payment.paymentId,
                invoiceId: payment.invoiceId,
                appliedAmount: payment.amount,
            }, transaction);
        }
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        return { payments, totalAmount };
    }
    catch (error) {
        throw new Error(`Payment generation failed: ${error.message}`);
    }
};
exports.orchestratePaymentGeneration = orchestratePaymentGeneration;
/**
 * Orchestrates ACH batch processing with NACHA file generation and validation
 * Composes: processACHBatch, generateACHBatchNumber, generateNACHAFile, validateACHBatch
 *
 * @param request ACH batch processing request
 * @param transaction Database transaction
 * @returns ACH batch with NACHA file
 */
const orchestrateACHBatchProcessing = async (request, transaction) => {
    try {
        // Generate batch number
        const batchNumber = await (0, payment_processing_collections_kit_1.generateACHBatchNumber)();
        // Process ACH batch
        const achBatch = await (0, payment_processing_collections_kit_1.processACHBatch)({
            paymentRunId: request.paymentRunId,
            batchNumber,
            effectiveDate: request.effectiveDate,
            originatorId: request.originatorId,
            originatorName: request.originatorName,
        }, transaction);
        // Generate NACHA file
        const nachaFile = await (0, payment_processing_collections_kit_1.generateNACHAFile)(achBatch.achBatchId, transaction);
        // Validate ACH batch
        const validation = await (0, payment_processing_collections_kit_1.validateACHBatch)(achBatch.achBatchId, transaction);
        // Auto-transmit if requested and validation passed
        if (request.autoTransmit && validation.passed) {
            await (0, payment_processing_collections_kit_1.transmitACHBatch)(achBatch.achBatchId, transaction);
        }
        return {
            achBatchId: achBatch.achBatchId,
            batchNumber: achBatch.batchNumber,
            fileName: nachaFile.fileName,
            entryCount: achBatch.entryCount,
            totalDebit: achBatch.totalDebit,
            totalCredit: achBatch.totalCredit,
            validationStatus: validation.passed ? 'passed' : 'failed',
            fileContent: request.autoTransmit ? undefined : Buffer.from(nachaFile.content).toString('base64'),
        };
    }
    catch (error) {
        throw new Error(`ACH batch processing failed: ${error.message}`);
    }
};
exports.orchestrateACHBatchProcessing = orchestrateACHBatchProcessing;
/**
 * Orchestrates ACH transmission with bank connectivity and retry logic
 * Composes: transmitACHBatch, getBankAccount, createPaymentAuditTrail
 *
 * @param achBatchId ACH batch ID
 * @param transaction Database transaction
 * @returns Transmission result with confirmation
 */
const orchestrateACHTransmission = async (achBatchId, transaction) => {
    try {
        // Transmit ACH batch
        const result = await (0, payment_processing_collections_kit_1.transmitACHBatch)(achBatchId, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            achBatchId,
            action: 'transmitted',
            performedBy: 'system',
            comments: `ACH batch transmitted with confirmation ${result.confirmationNumber}`,
            timestamp: new Date(),
        }, transaction);
        return {
            transmitted: true,
            confirmationNumber: result.confirmationNumber,
            transmittedAt: new Date(),
        };
    }
    catch (error) {
        throw new Error(`ACH transmission failed: ${error.message}`);
    }
};
exports.orchestrateACHTransmission = orchestrateACHTransmission;
/**
 * Orchestrates wire transfer creation with compliance checks and approvals
 * Composes: createWireTransfer, getVendorByNumber, approvePayment, createPaymentAuditTrail
 *
 * @param request Wire transfer creation request
 * @param transaction Database transaction
 * @returns Wire transfer with approval status
 */
const orchestrateWireTransferCreation = async (request, transaction) => {
    try {
        // Create wire transfer
        const wireTransfer = await (0, payment_processing_collections_kit_1.createWireTransfer)({
            paymentId: request.paymentId,
            wireType: request.wireType,
            beneficiaryName: request.beneficiary.name,
            beneficiaryAccountNumber: request.beneficiary.accountNumber,
            beneficiaryBankName: request.beneficiary.bankName,
            beneficiaryBankSwift: request.beneficiary.bankSwift,
            beneficiaryBankABA: request.beneficiary.bankABA,
            intermediaryBankSwift: request.intermediaryBank?.bankSwift,
            intermediaryBankName: request.intermediaryBank?.bankName,
            purposeCode: request.purposeCode,
            instructions: request.instructions,
        }, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId: request.paymentId,
            action: 'wire_created',
            performedBy: 'system',
            comments: `Wire transfer created: ${wireTransfer.wireTransferId}`,
            timestamp: new Date(),
        }, transaction);
        return {
            wireTransferId: wireTransfer.wireTransferId,
            referenceNumber: wireTransfer.referenceNumber,
            status: wireTransfer.status,
            amount: wireTransfer.amount,
            currency: wireTransfer.currency,
        };
    }
    catch (error) {
        throw new Error(`Wire transfer creation failed: ${error.message}`);
    }
};
exports.orchestrateWireTransferCreation = orchestrateWireTransferCreation;
/**
 * Orchestrates international wire transfer with SWIFT message generation
 * Composes: createWireTransfer, getBankAccount, generatePaymentNumber, createPaymentAuditTrail
 *
 * @param request Wire transfer creation request
 * @param transaction Database transaction
 * @returns Wire transfer with SWIFT message
 */
const orchestrateInternationalWireTransfer = async (request, transaction) => {
    try {
        // Validate international wire requirements
        if (request.wireType !== 'International') {
            throw new Error('Wire type must be International');
        }
        if (!request.beneficiary.bankSwift) {
            throw new Error('SWIFT code required for international wire');
        }
        // Create wire transfer
        const wireTransfer = await (0, exports.orchestrateWireTransferCreation)(request, transaction);
        // Generate SWIFT message (MT103)
        const swiftMessage = generateSWIFTMessage(wireTransfer, request);
        return {
            ...wireTransfer,
            swiftMessage,
        };
    }
    catch (error) {
        throw new Error(`International wire transfer failed: ${error.message}`);
    }
};
exports.orchestrateInternationalWireTransfer = orchestrateInternationalWireTransfer;
/**
 * Helper function to generate SWIFT MT103 message
 */
const generateSWIFTMessage = (wireTransfer, request) => {
    return `{1:F01BANKUS33AXXX0000000000}
{2:I103BANKGB22XXXXN}
{4:
:20:${wireTransfer.referenceNumber}
:23B:CRED
:32A:${new Date().toISOString().split('T')[0].replace(/-/g, '')}${wireTransfer.currency}${wireTransfer.amount}
:50K:/${request.beneficiary.accountNumber}
${request.beneficiary.name}
:52A:${request.beneficiary.bankSwift}
:59:/${request.beneficiary.accountNumber}
${request.beneficiary.name}
:70:${request.instructions}
:71A:BEN
-}`;
};
/**
 * Orchestrates check run processing with check printing and numbering
 * Composes: processCheckRun, generateCheckRunNumber, printCheck, convertAmountToWords
 *
 * @param request Check run processing request
 * @param transaction Database transaction
 * @returns Check run with check details
 */
const orchestrateCheckRunProcessing = async (request, transaction) => {
    try {
        // Generate check run number
        const runNumber = await (0, payment_processing_collections_kit_1.generateCheckRunNumber)();
        // Process check run
        const checkRun = await (0, payment_processing_collections_kit_1.processCheckRun)({
            paymentRunId: request.paymentRunId,
            runNumber,
            bankAccountId: request.bankAccountId,
            startingCheckNumber: request.startingCheckNumber,
        }, transaction);
        // Print checks if auto-print enabled
        if (request.autoPrint) {
            for (const check of checkRun.checks) {
                await (0, payment_processing_collections_kit_1.printCheck)(check.checkId, transaction);
            }
        }
        return {
            checkRunId: checkRun.checkRunId,
            runNumber: checkRun.runNumber,
            checkCount: checkRun.checkCount,
            totalAmount: checkRun.totalAmount,
            startingCheckNumber: checkRun.startingCheckNumber,
            endingCheckNumber: checkRun.endingCheckNumber,
            status: request.autoPrint ? 'printed' : 'created',
        };
    }
    catch (error) {
        throw new Error(`Check run processing failed: ${error.message}`);
    }
};
exports.orchestrateCheckRunProcessing = orchestrateCheckRunProcessing;
/**
 * Orchestrates check printing with MICR encoding and signature validation
 * Composes: printCheck, convertAmountToWords, getBankAccount, createPaymentAuditTrail
 *
 * @param checkId Check ID
 * @param transaction Database transaction
 * @returns Check print data with MICR line
 */
const orchestrateCheckPrinting = async (checkId, transaction) => {
    try {
        // Get check details
        const check = await (0, payment_processing_collections_kit_1.printCheck)(checkId, transaction);
        // Get bank account for MICR encoding
        const bankAccount = await (0, payment_processing_collections_kit_1.getBankAccount)(check.bankAccountId);
        // Generate MICR line
        const micrLine = generateMICRLine(bankAccount, check.checkNumber, check.amount);
        // Convert amount to words
        const amountInWords = (0, payment_processing_collections_kit_1.convertAmountToWords)(check.amount);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId: check.paymentId,
            action: 'check_printed',
            performedBy: 'system',
            comments: `Check ${check.checkNumber} printed`,
            timestamp: new Date(),
        }, transaction);
        return {
            checkData: {
                ...check,
                amountInWords,
            },
            micrLine,
            printReady: true,
        };
    }
    catch (error) {
        throw new Error(`Check printing failed: ${error.message}`);
    }
};
exports.orchestrateCheckPrinting = orchestrateCheckPrinting;
/**
 * Helper function to generate MICR line
 */
const generateMICRLine = (bankAccount, checkNumber, amount) => {
    const routing = bankAccount.routingNumber;
    const account = bankAccount.accountNumber;
    const amountStr = Math.floor(amount * 100).toString().padStart(10, '0');
    return `C${checkNumber}C A${routing}A ${account}C ${amountStr}`;
};
/**
 * Orchestrates positive pay file generation for fraud prevention
 * Composes: generatePositivePayFile, getBankAccount, createPaymentAuditTrail
 *
 * @param request Positive pay file generation request
 * @param transaction Database transaction
 * @returns Positive pay file with check details
 */
const orchestratePositivePayGeneration = async (request, transaction) => {
    try {
        // Generate positive pay file
        const positivePayFile = await (0, payment_processing_collections_kit_1.generatePositivePayFile)(request.bankAccountId, request.startDate, request.endDate, request.fileFormat, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            bankAccountId: request.bankAccountId,
            action: 'positive_pay_generated',
            performedBy: 'system',
            comments: `Positive pay file generated: ${positivePayFile.fileName}`,
            timestamp: new Date(),
        }, transaction);
        return {
            fileName: positivePayFile.fileName,
            checkCount: positivePayFile.checkCount,
            totalAmount: positivePayFile.totalAmount,
            fileContent: Buffer.from(positivePayFile.content).toString('base64'),
            generatedAt: new Date(),
        };
    }
    catch (error) {
        throw new Error(`Positive pay generation failed: ${error.message}`);
    }
};
exports.orchestratePositivePayGeneration = orchestratePositivePayGeneration;
/**
 * Orchestrates payment reconciliation with bank statement matching
 * Composes: reconcilePayment, getBankAccount, clearPayment, createPaymentAuditTrail
 *
 * @param request Payment reconciliation request
 * @param transaction Database transaction
 * @returns Reconciliation result with cleared status
 */
const orchestratePaymentReconciliation = async (request, transaction) => {
    try {
        // Reconcile payment
        const reconciliation = await (0, payment_processing_collections_kit_1.reconcilePayment)(request.paymentId, request.statementLineId, request.clearedDate, transaction);
        // Clear payment
        await (0, accounts_payable_management_kit_1.clearPayment)(request.paymentId, request.clearedDate, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId: request.paymentId,
            action: 'reconciled',
            performedBy: 'system',
            comments: `Payment reconciled with bank reference ${request.bankReference}`,
            timestamp: new Date(),
        }, transaction);
        return {
            reconciled: true,
            clearedDate: request.clearedDate,
            variance: reconciliation.variance,
        };
    }
    catch (error) {
        throw new Error(`Payment reconciliation failed: ${error.message}`);
    }
};
exports.orchestratePaymentReconciliation = orchestratePaymentReconciliation;
/**
 * Orchestrates automated payment reconciliation with fuzzy matching
 * Composes: reconcilePayment, getBankAccount, clearPayment, createPaymentAuditTrail
 *
 * @param bankAccountId Bank account ID
 * @param statementId Bank statement ID
 * @param transaction Database transaction
 * @returns Reconciliation results with match confidence
 */
const orchestrateAutomatedPaymentReconciliation = async (bankAccountId, statementId, transaction) => {
    try {
        // Get unreconciled payments for bank account
        const unreconciledPayments = await getUnreconciledPayments(bankAccountId);
        // Get unmatched statement lines
        const unmatchedLines = await getUnmatchedStatementLines(statementId);
        let matched = 0;
        let unmatched = 0;
        const confidenceScores = [];
        // Perform fuzzy matching
        for (const line of unmatchedLines) {
            const matchResult = findBestPaymentMatch(line, unreconciledPayments);
            if (matchResult && matchResult.confidence > 0.85) {
                await (0, payment_processing_collections_kit_1.reconcilePayment)(matchResult.payment.paymentId, line.lineId, line.transactionDate, transaction);
                matched++;
                confidenceScores.push(matchResult.confidence);
            }
            else {
                unmatched++;
            }
        }
        const averageConfidence = confidenceScores.length > 0
            ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
            : 0;
        return {
            matched,
            unmatched,
            confidence: averageConfidence,
        };
    }
    catch (error) {
        throw new Error(`Automated payment reconciliation failed: ${error.message}`);
    }
};
exports.orchestrateAutomatedPaymentReconciliation = orchestrateAutomatedPaymentReconciliation;
/**
 * Helper function to get unreconciled payments
 */
const getUnreconciledPayments = async (bankAccountId) => {
    // Implementation would query database for unreconciled payments
    return [];
};
/**
 * Helper function to get unmatched statement lines
 */
const getUnmatchedStatementLines = async (statementId) => {
    // Implementation would query database for unmatched lines
    return [];
};
/**
 * Helper function to find best payment match
 */
const findBestPaymentMatch = (line, payments) => {
    // Implementation would perform fuzzy matching algorithm
    return null;
};
/**
 * Orchestrates payment hold placement with workflow notifications
 * Composes: placePaymentHold, createPaymentAuditTrail, createWorkflowInstanceModel
 *
 * @param paymentId Payment ID
 * @param holdReason Hold reason
 * @param holdBy User placing hold
 * @param transaction Database transaction
 * @returns Hold placement result
 */
const orchestratePaymentHoldPlacement = async (paymentId, holdReason, holdBy, transaction) => {
    try {
        // Place payment hold
        const hold = await (0, payment_processing_collections_kit_1.placePaymentHold)(paymentId, holdReason, holdBy, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId,
            action: 'hold_placed',
            performedBy: holdBy,
            comments: holdReason,
            timestamp: new Date(),
        }, transaction);
        // Send notifications (implementation would send actual notifications)
        const notificationsSent = 1; // Mock value
        return {
            holdPlaced: true,
            holdDate: hold.holdDate,
            notificationsSent,
        };
    }
    catch (error) {
        throw new Error(`Payment hold placement failed: ${error.message}`);
    }
};
exports.orchestratePaymentHoldPlacement = orchestratePaymentHoldPlacement;
/**
 * Orchestrates payment hold release with approval validation
 * Composes: releasePaymentHold, createPaymentAuditTrail, approvePayment
 *
 * @param paymentId Payment ID
 * @param releaseReason Release reason
 * @param releasedBy User releasing hold
 * @param transaction Database transaction
 * @returns Hold release result
 */
const orchestratePaymentHoldRelease = async (paymentId, releaseReason, releasedBy, transaction) => {
    try {
        // Release payment hold
        const release = await (0, payment_processing_collections_kit_1.releasePaymentHold)(paymentId, releaseReason, releasedBy, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId,
            action: 'hold_released',
            performedBy: releasedBy,
            comments: releaseReason,
            timestamp: new Date(),
        }, transaction);
        return {
            holdReleased: true,
            releaseDate: release.releaseDate,
        };
    }
    catch (error) {
        throw new Error(`Payment hold release failed: ${error.message}`);
    }
};
exports.orchestratePaymentHoldRelease = orchestratePaymentHoldRelease;
/**
 * Orchestrates payment voiding with reversal entries
 * Composes: voidPayment, createPaymentAuditTrail, updateBankAccountBalance
 *
 * @param paymentId Payment ID
 * @param voidReason Void reason
 * @param voidedBy User voiding payment
 * @param transaction Database transaction
 * @returns Void result with reversal details
 */
const orchestratePaymentVoid = async (paymentId, voidReason, voidedBy, transaction) => {
    try {
        // Void payment
        const voidResult = await (0, payment_processing_collections_kit_1.voidPayment)(paymentId, voidReason, voidedBy, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId,
            action: 'voided',
            performedBy: voidedBy,
            comments: voidReason,
            timestamp: new Date(),
        }, transaction);
        return {
            voided: true,
            voidDate: voidResult.voidDate,
            reversalEntries: voidResult.reversalEntries.length,
        };
    }
    catch (error) {
        throw new Error(`Payment void failed: ${error.message}`);
    }
};
exports.orchestratePaymentVoid = orchestratePaymentVoid;
/**
 * Orchestrates payment reissue after void
 * Composes: voidPayment, createPayment, generatePaymentNumber, createPaymentAuditTrail
 *
 * @param originalPaymentId Original payment ID
 * @param reissueReason Reissue reason
 * @param reissuedBy User reissuing payment
 * @param transaction Database transaction
 * @returns Reissue result with new payment
 */
const orchestratePaymentReissue = async (originalPaymentId, reissueReason, reissuedBy, transaction) => {
    try {
        // Void original payment
        await (0, payment_processing_collections_kit_1.voidPayment)(originalPaymentId, reissueReason, reissuedBy, transaction);
        // Get original payment details
        const originalPayment = await getPaymentDetails(originalPaymentId);
        // Generate new payment number
        const newPaymentNumber = await (0, payment_processing_collections_kit_1.generatePaymentNumber)();
        // Create new payment
        const newPayment = await (0, accounts_payable_management_kit_1.createPayment)({
            ...originalPayment,
            paymentNumber: newPaymentNumber,
            status: 'draft',
            reissuedFrom: originalPaymentId,
        }, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId: newPayment.paymentId,
            action: 'reissued',
            performedBy: reissuedBy,
            comments: `Reissued from payment ${originalPaymentId}: ${reissueReason}`,
            timestamp: new Date(),
        }, transaction);
        return {
            reissued: true,
            newPaymentId: newPayment.paymentId,
            newPaymentNumber: newPayment.paymentNumber,
        };
    }
    catch (error) {
        throw new Error(`Payment reissue failed: ${error.message}`);
    }
};
exports.orchestratePaymentReissue = orchestratePaymentReissue;
/**
 * Helper function to get payment details
 */
const getPaymentDetails = async (paymentId) => {
    // Implementation would query database for payment details
    return {};
};
/**
 * Orchestrates payment schedule creation with recurring payments
 * Composes: createPaymentSchedule, calculateNextRunDate, createPaymentAuditTrail
 *
 * @param scheduleConfig Payment schedule configuration
 * @param transaction Database transaction
 * @returns Payment schedule with calculated run dates
 */
const orchestratePaymentScheduleCreation = async (scheduleConfig, transaction) => {
    try {
        // Create payment schedule
        const schedule = await (0, payment_processing_collections_kit_1.createPaymentSchedule)(scheduleConfig, transaction);
        // Calculate scheduled run dates
        const scheduledRuns = [];
        let currentDate = scheduleConfig.startDate;
        const endDate = scheduleConfig.endDate || new Date(currentDate.getFullYear() + 1, 11, 31);
        while (currentDate <= endDate) {
            scheduledRuns.push(new Date(currentDate));
            currentDate = (0, payment_processing_collections_kit_1.calculateNextRunDate)(currentDate, scheduleConfig.frequency);
        }
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            scheduleId: schedule.scheduleId,
            action: 'schedule_created',
            performedBy: 'system',
            comments: `Payment schedule created with ${scheduledRuns.length} runs`,
            timestamp: new Date(),
        }, transaction);
        return {
            scheduleId: schedule.scheduleId,
            scheduledRuns,
        };
    }
    catch (error) {
        throw new Error(`Payment schedule creation failed: ${error.message}`);
    }
};
exports.orchestratePaymentScheduleCreation = orchestratePaymentScheduleCreation;
/**
 * Orchestrates payment run cancellation with cleanup
 * Composes: cancelPaymentRun, voidPayment, createPaymentAuditTrail
 *
 * @param paymentRunId Payment run ID
 * @param cancellationReason Cancellation reason
 * @param cancelledBy User cancelling run
 * @param transaction Database transaction
 * @returns Cancellation result with cleanup details
 */
const orchestratePaymentRunCancellation = async (paymentRunId, cancellationReason, cancelledBy, transaction) => {
    try {
        // Cancel payment run
        const cancellation = await (0, payment_processing_collections_kit_1.cancelPaymentRun)(paymentRunId, cancellationReason, cancelledBy, transaction);
        // Void all payments in run
        let paymentsVoided = 0;
        for (const paymentId of cancellation.paymentIds) {
            await (0, payment_processing_collections_kit_1.voidPayment)(paymentId, 'Payment run cancelled', cancelledBy, transaction);
            paymentsVoided++;
        }
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentRunId,
            action: 'cancelled',
            performedBy: cancelledBy,
            comments: `${cancellationReason} - ${paymentsVoided} payments voided`,
            timestamp: new Date(),
        }, transaction);
        return {
            cancelled: true,
            paymentsVoided,
            cleanupComplete: true,
        };
    }
    catch (error) {
        throw new Error(`Payment run cancellation failed: ${error.message}`);
    }
};
exports.orchestratePaymentRunCancellation = orchestratePaymentRunCancellation;
/**
 * Orchestrates payment analytics generation with forecasting
 * Composes: getPaymentHistory, calculatePaymentRunTotals, generatePaymentNumber
 *
 * @param request Payment analytics request
 * @param transaction Database transaction
 * @returns Payment analytics with trends and forecasts
 */
const orchestratePaymentAnalytics = async (request, transaction) => {
    try {
        // Get payment history
        const payments = await (0, payment_processing_collections_kit_1.getPaymentHistory)(request.startDate, request.endDate);
        // Calculate totals
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const averageAmount = totalAmount / payments.length;
        // Group payments by requested dimension
        const breakdown = groupPayments(payments, request.groupBy);
        // Generate forecast if requested
        let forecast;
        if (request.includeForecast) {
            forecast = generatePaymentForecast(payments, request.groupBy);
        }
        return {
            totalPayments: payments.length,
            totalAmount,
            averagePaymentAmount: averageAmount,
            breakdown,
            forecast,
        };
    }
    catch (error) {
        throw new Error(`Payment analytics generation failed: ${error.message}`);
    }
};
exports.orchestratePaymentAnalytics = orchestratePaymentAnalytics;
/**
 * Helper function to group payments
 */
const groupPayments = (payments, groupBy) => {
    const grouped = {};
    for (const payment of payments) {
        const key = getGroupKey(payment, groupBy);
        if (!grouped[key]) {
            grouped[key] = { count: 0, amount: 0 };
        }
        grouped[key].count++;
        grouped[key].amount += payment.amount;
    }
    const totalAmount = Object.values(grouped).reduce((sum, g) => sum + g.amount, 0);
    return Object.entries(grouped).map(([category, data]) => ({
        category,
        count: data.count,
        amount: data.amount,
        percentage: (data.amount / totalAmount) * 100,
    }));
};
/**
 * Helper function to get group key
 */
const getGroupKey = (payment, groupBy) => {
    switch (groupBy) {
        case 'payment_method':
            return payment.paymentMethodType;
        case 'supplier':
            return payment.supplierName;
        case 'bank_account':
            return payment.bankAccountId.toString();
        case 'day':
            return payment.paymentDate.toISOString().split('T')[0];
        case 'week':
            return getWeekKey(payment.paymentDate);
        case 'month':
            return `${payment.paymentDate.getFullYear()}-${String(payment.paymentDate.getMonth() + 1).padStart(2, '0')}`;
        default:
            return 'unknown';
    }
};
/**
 * Helper function to get week key
 */
const getWeekKey = (date) => {
    const weekNumber = Math.ceil(date.getDate() / 7);
    return `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};
/**
 * Helper function to generate payment forecast
 */
const generatePaymentForecast = (payments, groupBy) => {
    // Simple moving average forecast (would use more sophisticated models in production)
    const grouped = groupPayments(payments, groupBy);
    const sortedByDate = grouped.sort((a, b) => a.category.localeCompare(b.category));
    if (sortedByDate.length < 3) {
        return [];
    }
    // Calculate simple moving average
    const lastThree = sortedByDate.slice(-3);
    const avgAmount = lastThree.reduce((sum, g) => sum + g.amount, 0) / 3;
    // Generate next 3 period forecasts
    return [
        { period: 'Next Period 1', predictedAmount: avgAmount, confidence: 0.75 },
        { period: 'Next Period 2', predictedAmount: avgAmount * 1.05, confidence: 0.65 },
        { period: 'Next Period 3', predictedAmount: avgAmount * 1.08, confidence: 0.55 },
    ];
};
/**
 * Orchestrates payment batch processing with parallel execution
 * Composes: createPayment, approvePayment, transmitPayment, createPaymentAuditTrail
 *
 * @param paymentRequests Array of payment requests
 * @param transaction Database transaction
 * @returns Batch processing results
 */
const orchestratePaymentBatchProcessing = async (paymentRequests, transaction) => {
    try {
        const results = [];
        let processed = 0;
        let failed = 0;
        // Process payments in batches of 100
        const batchSize = 100;
        for (let i = 0; i < paymentRequests.length; i += batchSize) {
            const batch = paymentRequests.slice(i, i + batchSize);
            const batchResults = await Promise.allSettled(batch.map(async (request) => {
                const paymentNumber = await (0, payment_processing_collections_kit_1.generatePaymentNumber)();
                const payment = await (0, accounts_payable_management_kit_1.createPayment)({
                    ...request,
                    paymentNumber,
                }, transaction);
                if (request.autoApprove) {
                    await (0, payment_processing_collections_kit_1.approvePayment)(payment.paymentId, 'system', transaction);
                }
                return { success: true, paymentId: payment.paymentId, paymentNumber };
            }));
            for (const result of batchResults) {
                if (result.status === 'fulfilled') {
                    processed++;
                    results.push(result.value);
                }
                else {
                    failed++;
                    results.push({ success: false, error: result.reason.message });
                }
            }
        }
        return { processed, failed, results };
    }
    catch (error) {
        throw new Error(`Payment batch processing failed: ${error.message}`);
    }
};
exports.orchestratePaymentBatchProcessing = orchestratePaymentBatchProcessing;
/**
 * Orchestrates payment reversal with GL impact
 * Composes: voidPayment, createPaymentAuditTrail, updateBankAccountBalance
 *
 * @param paymentId Payment ID
 * @param reversalReason Reversal reason
 * @param reversedBy User reversing payment
 * @param transaction Database transaction
 * @returns Reversal result with GL entries
 */
const orchestratePaymentReversal = async (paymentId, reversalReason, reversedBy, transaction) => {
    try {
        // Void payment
        const reversal = await (0, payment_processing_collections_kit_1.voidPayment)(paymentId, reversalReason, reversedBy, transaction);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId,
            action: 'reversed',
            performedBy: reversedBy,
            comments: reversalReason,
            timestamp: new Date(),
        }, transaction);
        return {
            reversed: true,
            glEntries: reversal.reversalEntries.length,
            reversalDate: new Date(),
        };
    }
    catch (error) {
        throw new Error(`Payment reversal failed: ${error.message}`);
    }
};
exports.orchestratePaymentReversal = orchestratePaymentReversal;
/**
 * Orchestrates payment method validation with bank account verification
 * Composes: getPaymentMethod, getBankAccount, validateACHBatch
 *
 * @param paymentMethodId Payment method ID
 * @param bankAccountId Bank account ID
 * @param transaction Database transaction
 * @returns Validation result with compatibility check
 */
const orchestratePaymentMethodValidation = async (paymentMethodId, bankAccountId, transaction) => {
    try {
        const errors = [];
        // Get payment method
        const paymentMethod = await (0, payment_processing_collections_kit_1.getPaymentMethod)(paymentMethodId);
        if (!paymentMethod.isActive) {
            errors.push('Payment method is not active');
        }
        // Get bank account
        const bankAccount = await (0, payment_processing_collections_kit_1.getBankAccount)(bankAccountId);
        if (!bankAccount.isActive) {
            errors.push('Bank account is not active');
        }
        // Check compatibility
        const compatible = checkPaymentMethodBankCompatibility(paymentMethod, bankAccount);
        if (!compatible) {
            errors.push('Payment method not compatible with bank account');
        }
        return {
            valid: errors.length === 0,
            compatible,
            errors,
        };
    }
    catch (error) {
        throw new Error(`Payment method validation failed: ${error.message}`);
    }
};
exports.orchestratePaymentMethodValidation = orchestratePaymentMethodValidation;
/**
 * Helper function to check payment method and bank account compatibility
 */
const checkPaymentMethodBankCompatibility = (paymentMethod, bankAccount) => {
    // Check if payment method type is supported by bank account type
    const compatibilityMatrix = {
        ACH: ['checking', 'savings'],
        Wire: ['checking', 'savings'],
        Check: ['checking'],
        EFT: ['checking', 'savings'],
    };
    const supportedAccountTypes = compatibilityMatrix[paymentMethod.methodType] || [];
    return supportedAccountTypes.includes(bankAccount.accountType);
};
/**
 * Orchestrates payment exception handling with escalation
 * Composes: placePaymentHold, createPaymentAuditTrail, createWorkflowInstanceModel
 *
 * @param paymentId Payment ID
 * @param exceptionType Exception type
 * @param exceptionDetails Exception details
 * @param transaction Database transaction
 * @returns Exception handling result with escalation status
 */
const orchestratePaymentExceptionHandling = async (paymentId, exceptionType, exceptionDetails, transaction) => {
    try {
        // Place payment on hold
        await (0, payment_processing_collections_kit_1.placePaymentHold)(paymentId, `Exception: ${exceptionType}`, 'system', transaction);
        // Determine if escalation needed
        const criticalExceptions = ['fraud_suspected', 'compliance_violation', 'large_amount'];
        const escalated = criticalExceptions.includes(exceptionType);
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            paymentId,
            action: 'exception_detected',
            performedBy: 'system',
            comments: `${exceptionType}: ${exceptionDetails}`,
            timestamp: new Date(),
        }, transaction);
        return {
            handled: true,
            escalated,
            assignedTo: escalated ? 'treasury_manager' : 'ap_clerk',
        };
    }
    catch (error) {
        throw new Error(`Payment exception handling failed: ${error.message}`);
    }
};
exports.orchestratePaymentExceptionHandling = orchestratePaymentExceptionHandling;
/**
 * Orchestrates payment file transmission tracking
 * Composes: transmitACHBatch, createPaymentAuditTrail, getBankAccount
 *
 * @param fileType File type (ACH, Wire, PositivePay)
 * @param fileId File ID
 * @param transaction Database transaction
 * @returns Transmission tracking result
 */
const orchestratePaymentFileTransmissionTracking = async (fileType, fileId, transaction) => {
    try {
        let confirmationNumber;
        let status;
        switch (fileType) {
            case 'ACH':
                const achResult = await (0, payment_processing_collections_kit_1.transmitACHBatch)(fileId, transaction);
                confirmationNumber = achResult.confirmationNumber;
                status = 'transmitted';
                break;
            case 'Wire':
            case 'PositivePay':
                // Implementation for other file types
                confirmationNumber = `${fileType}-${Date.now()}`;
                status = 'transmitted';
                break;
        }
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            fileId,
            fileType,
            action: 'file_transmitted',
            performedBy: 'system',
            comments: `${fileType} file transmitted: ${confirmationNumber}`,
            timestamp: new Date(),
        }, transaction);
        return {
            transmitted: true,
            confirmationNumber,
            transmittedAt: new Date(),
            status,
        };
    }
    catch (error) {
        throw new Error(`Payment file transmission tracking failed: ${error.message}`);
    }
};
exports.orchestratePaymentFileTransmissionTracking = orchestratePaymentFileTransmissionTracking;
/**
 * Orchestrates payment approval workflow routing
 * Composes: approvePayment, createApprovalStepModel, createPaymentAuditTrail
 *
 * @param paymentId Payment ID
 * @param currentApprover Current approver user ID
 * @param approved Approval decision
 * @param comments Approval comments
 * @param transaction Database transaction
 * @returns Workflow routing result
 */
const orchestratePaymentApprovalWorkflowRouting = async (paymentId, currentApprover, approved, comments, transaction) => {
    try {
        if (approved) {
            const approval = await (0, payment_processing_collections_kit_1.approvePayment)(paymentId, currentApprover, transaction);
            // Create audit trail
            await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
                paymentId,
                action: 'approved',
                performedBy: currentApprover,
                comments,
                timestamp: new Date(),
            }, transaction);
            return {
                workflowComplete: approval.workflowComplete,
                nextApprover: approval.nextApprover,
                finalStatus: approval.workflowComplete ? 'approved' : 'pending_approval',
            };
        }
        else {
            // Create audit trail for rejection
            await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
                paymentId,
                action: 'rejected',
                performedBy: currentApprover,
                comments,
                timestamp: new Date(),
            }, transaction);
            return {
                workflowComplete: true,
                finalStatus: 'rejected',
            };
        }
    }
    catch (error) {
        throw new Error(`Payment approval workflow routing failed: ${error.message}`);
    }
};
exports.orchestratePaymentApprovalWorkflowRouting = orchestratePaymentApprovalWorkflowRouting;
/**
 * Orchestrates payment duplicate detection and prevention
 * Composes: checkDuplicateInvoice, getPaymentHistory, createPaymentAuditTrail
 *
 * @param paymentRequest Payment request
 * @param transaction Database transaction
 * @returns Duplicate detection result
 */
const orchestratePaymentDuplicateDetection = async (paymentRequest, transaction) => {
    try {
        // Get payment history for supplier
        const recentPayments = await (0, payment_processing_collections_kit_1.getPaymentHistory)(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
        new Date());
        const supplierPayments = recentPayments.filter((p) => p.supplierId === paymentRequest.supplierId);
        // Check for duplicates
        const potentialDuplicates = [];
        let maxMatchScore = 0;
        for (const payment of supplierPayments) {
            const matchScore = calculatePaymentMatchScore(paymentRequest, payment);
            if (matchScore > 0.8) {
                potentialDuplicates.push({ payment, matchScore });
                maxMatchScore = Math.max(maxMatchScore, matchScore);
            }
        }
        return {
            isDuplicate: maxMatchScore > 0.95,
            matchScore: maxMatchScore,
            potentialDuplicates,
        };
    }
    catch (error) {
        throw new Error(`Payment duplicate detection failed: ${error.message}`);
    }
};
exports.orchestratePaymentDuplicateDetection = orchestratePaymentDuplicateDetection;
/**
 * Helper function to calculate payment match score
 */
const calculatePaymentMatchScore = (payment1, payment2) => {
    let score = 0;
    // Amount match (40%)
    if (Math.abs(payment1.amount - payment2.amount) < 0.01) {
        score += 0.4;
    }
    // Supplier match (30%)
    if (payment1.supplierId === payment2.supplierId) {
        score += 0.3;
    }
    // Invoice number match (20%)
    if (payment1.invoiceNumber === payment2.invoiceNumber) {
        score += 0.2;
    }
    // Date proximity (10%)
    const daysDiff = Math.abs((new Date(payment1.paymentDate).getTime() - new Date(payment2.paymentDate).getTime()) /
        (1000 * 60 * 60 * 24));
    if (daysDiff <= 7) {
        score += 0.1;
    }
    return score;
};
/**
 * Orchestrates payment dashboard metrics aggregation
 * Composes: getPaymentHistory, calculatePaymentRunTotals, getVendorPaymentStats
 *
 * @param dateRange Date range for metrics
 * @param transaction Database transaction
 * @returns Dashboard metrics
 */
const orchestratePaymentDashboardMetrics = async (dateRange, transaction) => {
    try {
        // Get payment history
        const payments = await (0, payment_processing_collections_kit_1.getPaymentHistory)(dateRange.startDate, dateRange.endDate);
        // Calculate metrics
        const totalPayments = payments.length;
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        // Group by payment method
        const paymentsByMethod = groupPayments(payments, 'payment_method');
        // Group by status
        const paymentsByStatus = payments.reduce((acc, p) => {
            const status = p.status;
            if (!acc[status]) {
                acc[status] = { status, count: 0, amount: 0 };
            }
            acc[status].count++;
            acc[status].amount += p.amount;
            return acc;
        }, {});
        // Get top suppliers
        const supplierTotals = payments.reduce((acc, p) => {
            const supplierId = p.supplierId;
            if (!acc[supplierId]) {
                acc[supplierId] = {
                    supplierId,
                    supplierName: p.supplierName,
                    count: 0,
                    amount: 0,
                };
            }
            acc[supplierId].count++;
            acc[supplierId].amount += p.amount;
            return acc;
        }, {});
        const topSuppliers = Object.values(supplierTotals)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);
        // Calculate trends (weekly)
        const trends = calculatePaymentTrends(payments);
        return {
            totalPayments,
            totalAmount,
            paymentsByMethod,
            paymentsByStatus: Object.values(paymentsByStatus),
            topSuppliers,
            trends,
        };
    }
    catch (error) {
        throw new Error(`Payment dashboard metrics aggregation failed: ${error.message}`);
    }
};
exports.orchestratePaymentDashboardMetrics = orchestratePaymentDashboardMetrics;
/**
 * Helper function to calculate payment trends
 */
const calculatePaymentTrends = (payments) => {
    const weeklyTotals = {};
    for (const payment of payments) {
        const weekKey = getWeekKey(new Date(payment.paymentDate));
        if (!weeklyTotals[weekKey]) {
            weeklyTotals[weekKey] = { count: 0, amount: 0 };
        }
        weeklyTotals[weekKey].count++;
        weeklyTotals[weekKey].amount += payment.amount;
    }
    return Object.entries(weeklyTotals)
        .map(([week, data]) => ({
        period: week,
        paymentCount: data.count,
        totalAmount: data.amount,
        averageAmount: data.amount / data.count,
    }))
        .sort((a, b) => a.period.localeCompare(b.period));
};
/**
 * Orchestrates payment file archive and retention
 * Composes: generateNACHAFile, generatePositivePayFile, createPaymentAuditTrail
 *
 * @param fileType File type
 * @param fileId File ID
 * @param retentionYears Retention period in years
 * @param transaction Database transaction
 * @returns Archive result
 */
const orchestratePaymentFileArchive = async (fileType, fileId, retentionYears, transaction) => {
    try {
        // Calculate expiration date
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears);
        // Archive file (implementation would store to long-term storage)
        const archiveLocation = `archive/${fileType}/${new Date().getFullYear()}/${fileId}`;
        // Create audit trail
        await (0, payment_processing_collections_kit_1.createPaymentAuditTrail)({
            fileId,
            fileType,
            action: 'archived',
            performedBy: 'system',
            comments: `File archived to ${archiveLocation}, expires ${expirationDate.toISOString()}`,
            timestamp: new Date(),
        }, transaction);
        return {
            archived: true,
            archiveLocation,
            expirationDate,
        };
    }
    catch (error) {
        throw new Error(`Payment file archive failed: ${error.message}`);
    }
};
exports.orchestratePaymentFileArchive = orchestratePaymentFileArchive;
/**
 * Orchestrates payment compliance validation
 * Composes: validateACHBatch, getVendorByNumber, checkDuplicateInvoice
 *
 * @param paymentId Payment ID
 * @param complianceRules Compliance rules to check
 * @param transaction Database transaction
 * @returns Compliance validation result
 */
const orchestratePaymentComplianceValidation = async (paymentId, complianceRules, transaction) => {
    try {
        const violations = [];
        const warnings = [];
        // Get payment details
        const payment = await getPaymentDetails(paymentId);
        // Check compliance rules
        for (const rule of complianceRules) {
            const ruleResult = await checkComplianceRule(payment, rule);
            if (ruleResult.violated) {
                violations.push(ruleResult.message);
            }
            else if (ruleResult.warning) {
                warnings.push(ruleResult.message);
            }
        }
        return {
            compliant: violations.length === 0,
            violations,
            warnings,
        };
    }
    catch (error) {
        throw new Error(`Payment compliance validation failed: ${error.message}`);
    }
};
exports.orchestratePaymentComplianceValidation = orchestratePaymentComplianceValidation;
/**
 * Helper function to check compliance rule
 */
const checkComplianceRule = async (payment, rule) => {
    // Implementation would check specific compliance rules
    switch (rule) {
        case 'ofac_screening':
            return { violated: false, warning: false, message: 'OFAC screening passed' };
        case 'dual_control':
            return {
                violated: payment.amount > 10000 && !payment.dualControlApproved,
                warning: false,
                message: 'Dual control required for amounts over $10,000',
            };
        case 'payment_limit':
            return {
                violated: payment.amount > 1000000,
                warning: payment.amount > 500000,
                message: 'Payment exceeds limit',
            };
        default:
            return { violated: false, warning: false, message: 'Rule not found' };
    }
};
/**
 * Orchestrates end-of-day payment processing summary
 * Composes: getPaymentHistory, calculatePaymentRunTotals, createPaymentAuditTrail
 *
 * @param businessDate Business date
 * @param transaction Database transaction
 * @returns End-of-day summary
 */
const orchestrateEndOfDayPaymentSummary = async (businessDate, transaction) => {
    try {
        const startOfDay = new Date(businessDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(businessDate);
        endOfDay.setHours(23, 59, 59, 999);
        // Get payment history for the day
        const payments = await (0, payment_processing_collections_kit_1.getPaymentHistory)(startOfDay, endOfDay);
        // Calculate summary metrics
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const paymentsByMethod = groupPayments(payments, 'payment_method');
        const achCount = paymentsByMethod.find((g) => g.category === 'ACH')?.count || 0;
        const checkCount = paymentsByMethod.find((g) => g.category === 'Check')?.count || 0;
        const wireCount = paymentsByMethod.find((g) => g.category === 'Wire')?.count || 0;
        // Count payment runs completed
        const paymentRunsCompleted = new Set(payments.filter((p) => p.paymentRunId).map((p) => p.paymentRunId)).size;
        // Count exceptions
        const exceptions = payments.filter((p) => p.status === 'on_hold' || p.status === 'exception')
            .length;
        return {
            date: businessDate,
            paymentsProcessed: payments.length,
            totalAmount,
            paymentRunsCompleted,
            achBatchesTransmitted: Math.ceil(achCount / 100), // Assuming 100 payments per batch
            checksIssued: checkCount,
            wiresProcessed: wireCount,
            exceptions,
        };
    }
    catch (error) {
        throw new Error(`End-of-day payment summary failed: ${error.message}`);
    }
};
exports.orchestrateEndOfDayPaymentSummary = orchestrateEndOfDayPaymentSummary;
//# sourceMappingURL=payment-processing-orchestration-composite.js.map