"use strict";
/**
 * LOC: INVAUTOCMP001
 * File: /reuse/edwards/financial/composites/invoice-automation-workflow-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../invoice-management-matching-kit
 *   - ../accounts-payable-management-kit
 *   - ../financial-workflow-approval-kit
 *   - ../payment-processing-collections-kit
 *   - ../procurement-financial-integration-kit
 *
 * DOWNSTREAM (imported by):
 *   - Invoice processing REST API controllers
 *   - AP automation services
 *   - OCR processing pipelines
 *   - Invoice matching engines
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
exports.orchestrateWorkflowOptimizationAnalysis = exports.orchestrateBatchInvoiceProcessing = exports.orchestrateStraightThroughProcessing = exports.orchestrateEndOfPeriodInvoiceSummary = exports.orchestrateInvoiceDashboardMetrics = exports.orchestrateInvoiceAnalytics = exports.orchestrateDuplicateDetection = exports.orchestrateInvoiceDisputeResolution = exports.orchestrateInvoiceHoldRelease = exports.orchestrateInvoiceExceptionHandling = exports.orchestrateApprovalEscalation = exports.orchestrateApprovalExecution = exports.orchestrateApprovalRouting = exports.orchestrateVarianceAnalysis = exports.orchestrateFuzzyMatching = exports.orchestrateTwoWayMatching = exports.orchestrateThreeWayMatching = exports.orchestrateAutomatedGLCoding = exports.orchestrateInvoiceValidation = exports.orchestrateOCRProcessing = exports.orchestrateInvoiceCapture = exports.InvoiceAnalyticsResponse = exports.InvoiceAnalyticsRequest = exports.DuplicateDetectionRequest = exports.InvoiceExceptionRequest = exports.ApprovalRoutingResponse = exports.ApprovalRoutingRequest = exports.AutomatedMatchingResponse = exports.AutomatedMatchingRequest = exports.ProcessOCRResponse = exports.ProcessOCRRequest = exports.CaptureInvoiceResponse = exports.CaptureInvoiceRequest = void 0;
const swagger_1 = require("@nestjs/swagger");
// Import from invoice management matching kit
const invoice_management_matching_kit_1 = require("../invoice-management-matching-kit");
// Import from accounts payable management kit
const accounts_payable_management_kit_1 = require("../accounts-payable-management-kit");
// ============================================================================
// TYPE DEFINITIONS - INVOICE AUTOMATION API
// ============================================================================
/**
 * Invoice capture request
 */
let CaptureInvoiceRequest = (() => {
    var _a;
    let _captureMethod_decorators;
    let _captureMethod_initializers = [];
    let _captureMethod_extraInitializers = [];
    let _supplierId_decorators;
    let _supplierId_initializers = [];
    let _supplierId_extraInitializers = [];
    let _supplierNumber_decorators;
    let _supplierNumber_initializers = [];
    let _supplierNumber_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _autoProcessOCR_decorators;
    let _autoProcessOCR_initializers = [];
    let _autoProcessOCR_extraInitializers = [];
    let _autoMatch_decorators;
    let _autoMatch_initializers = [];
    let _autoMatch_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CaptureInvoiceRequest {
            constructor() {
                this.captureMethod = __runInitializers(this, _captureMethod_initializers, void 0);
                this.supplierId = (__runInitializers(this, _captureMethod_extraInitializers), __runInitializers(this, _supplierId_initializers, void 0));
                this.supplierNumber = (__runInitializers(this, _supplierId_extraInitializers), __runInitializers(this, _supplierNumber_initializers, void 0));
                this.documentType = (__runInitializers(this, _supplierNumber_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.autoProcessOCR = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _autoProcessOCR_initializers, void 0));
                this.autoMatch = (__runInitializers(this, _autoProcessOCR_extraInitializers), __runInitializers(this, _autoMatch_initializers, void 0));
                this.metadata = (__runInitializers(this, _autoMatch_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _captureMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Capture method', example: 'scan' })];
            _supplierId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supplier ID', example: 1001, required: false })];
            _supplierNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supplier number', example: 'SUPP-001', required: false })];
            _documentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type', example: 'pdf' })];
            _autoProcessOCR_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-process with OCR', example: true })];
            _autoMatch_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-match with PO', example: true })];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document metadata', type: 'object' })];
            __esDecorate(null, null, _captureMethod_decorators, { kind: "field", name: "captureMethod", static: false, private: false, access: { has: obj => "captureMethod" in obj, get: obj => obj.captureMethod, set: (obj, value) => { obj.captureMethod = value; } }, metadata: _metadata }, _captureMethod_initializers, _captureMethod_extraInitializers);
            __esDecorate(null, null, _supplierId_decorators, { kind: "field", name: "supplierId", static: false, private: false, access: { has: obj => "supplierId" in obj, get: obj => obj.supplierId, set: (obj, value) => { obj.supplierId = value; } }, metadata: _metadata }, _supplierId_initializers, _supplierId_extraInitializers);
            __esDecorate(null, null, _supplierNumber_decorators, { kind: "field", name: "supplierNumber", static: false, private: false, access: { has: obj => "supplierNumber" in obj, get: obj => obj.supplierNumber, set: (obj, value) => { obj.supplierNumber = value; } }, metadata: _metadata }, _supplierNumber_initializers, _supplierNumber_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _autoProcessOCR_decorators, { kind: "field", name: "autoProcessOCR", static: false, private: false, access: { has: obj => "autoProcessOCR" in obj, get: obj => obj.autoProcessOCR, set: (obj, value) => { obj.autoProcessOCR = value; } }, metadata: _metadata }, _autoProcessOCR_initializers, _autoProcessOCR_extraInitializers);
            __esDecorate(null, null, _autoMatch_decorators, { kind: "field", name: "autoMatch", static: false, private: false, access: { has: obj => "autoMatch" in obj, get: obj => obj.autoMatch, set: (obj, value) => { obj.autoMatch = value; } }, metadata: _metadata }, _autoMatch_initializers, _autoMatch_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CaptureInvoiceRequest = CaptureInvoiceRequest;
/**
 * Invoice capture response
 */
let CaptureInvoiceResponse = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _ocrConfidence_decorators;
    let _ocrConfidence_initializers = [];
    let _ocrConfidence_extraInitializers = [];
    let _extractedData_decorators;
    let _extractedData_initializers = [];
    let _extractedData_extraInitializers = [];
    let _validationResults_decorators;
    let _validationResults_initializers = [];
    let _validationResults_extraInitializers = [];
    return _a = class CaptureInvoiceResponse {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.status = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.ocrConfidence = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _ocrConfidence_initializers, void 0));
                this.extractedData = (__runInitializers(this, _ocrConfidence_extraInitializers), __runInitializers(this, _extractedData_initializers, void 0));
                this.validationResults = (__runInitializers(this, _extractedData_extraInitializers), __runInitializers(this, _validationResults_initializers, void 0));
                __runInitializers(this, _validationResults_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID', example: 1 })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Capture status', example: 'captured' })];
            _ocrConfidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'OCR confidence score', example: 0.95 })];
            _extractedData_decorators = [(0, swagger_1.ApiProperty)({ description: 'Extracted data', type: 'object' })];
            _validationResults_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation results', type: 'object' })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _ocrConfidence_decorators, { kind: "field", name: "ocrConfidence", static: false, private: false, access: { has: obj => "ocrConfidence" in obj, get: obj => obj.ocrConfidence, set: (obj, value) => { obj.ocrConfidence = value; } }, metadata: _metadata }, _ocrConfidence_initializers, _ocrConfidence_extraInitializers);
            __esDecorate(null, null, _extractedData_decorators, { kind: "field", name: "extractedData", static: false, private: false, access: { has: obj => "extractedData" in obj, get: obj => obj.extractedData, set: (obj, value) => { obj.extractedData = value; } }, metadata: _metadata }, _extractedData_initializers, _extractedData_extraInitializers);
            __esDecorate(null, null, _validationResults_decorators, { kind: "field", name: "validationResults", static: false, private: false, access: { has: obj => "validationResults" in obj, get: obj => obj.validationResults, set: (obj, value) => { obj.validationResults = value; } }, metadata: _metadata }, _validationResults_initializers, _validationResults_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CaptureInvoiceResponse = CaptureInvoiceResponse;
/**
 * OCR processing request
 */
let ProcessOCRRequest = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _ocrEngine_decorators;
    let _ocrEngine_initializers = [];
    let _ocrEngine_extraInitializers = [];
    let _extractLineItems_decorators;
    let _extractLineItems_initializers = [];
    let _extractLineItems_extraInitializers = [];
    let _autoValidate_decorators;
    let _autoValidate_initializers = [];
    let _autoValidate_extraInitializers = [];
    let _applyMLCorrections_decorators;
    let _applyMLCorrections_initializers = [];
    let _applyMLCorrections_extraInitializers = [];
    return _a = class ProcessOCRRequest {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.ocrEngine = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _ocrEngine_initializers, void 0));
                this.extractLineItems = (__runInitializers(this, _ocrEngine_extraInitializers), __runInitializers(this, _extractLineItems_initializers, void 0));
                this.autoValidate = (__runInitializers(this, _extractLineItems_extraInitializers), __runInitializers(this, _autoValidate_initializers, void 0));
                this.applyMLCorrections = (__runInitializers(this, _autoValidate_extraInitializers), __runInitializers(this, _applyMLCorrections_initializers, void 0));
                __runInitializers(this, _applyMLCorrections_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID', example: 1 })];
            _ocrEngine_decorators = [(0, swagger_1.ApiProperty)({ description: 'OCR engine', example: 'tesseract' })];
            _extractLineItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Extract line items', example: true })];
            _autoValidate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validate extracted data', example: true })];
            _applyMLCorrections_decorators = [(0, swagger_1.ApiProperty)({ description: 'Apply ML corrections', example: true })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _ocrEngine_decorators, { kind: "field", name: "ocrEngine", static: false, private: false, access: { has: obj => "ocrEngine" in obj, get: obj => obj.ocrEngine, set: (obj, value) => { obj.ocrEngine = value; } }, metadata: _metadata }, _ocrEngine_initializers, _ocrEngine_extraInitializers);
            __esDecorate(null, null, _extractLineItems_decorators, { kind: "field", name: "extractLineItems", static: false, private: false, access: { has: obj => "extractLineItems" in obj, get: obj => obj.extractLineItems, set: (obj, value) => { obj.extractLineItems = value; } }, metadata: _metadata }, _extractLineItems_initializers, _extractLineItems_extraInitializers);
            __esDecorate(null, null, _autoValidate_decorators, { kind: "field", name: "autoValidate", static: false, private: false, access: { has: obj => "autoValidate" in obj, get: obj => obj.autoValidate, set: (obj, value) => { obj.autoValidate = value; } }, metadata: _metadata }, _autoValidate_initializers, _autoValidate_extraInitializers);
            __esDecorate(null, null, _applyMLCorrections_decorators, { kind: "field", name: "applyMLCorrections", static: false, private: false, access: { has: obj => "applyMLCorrections" in obj, get: obj => obj.applyMLCorrections, set: (obj, value) => { obj.applyMLCorrections = value; } }, metadata: _metadata }, _applyMLCorrections_initializers, _applyMLCorrections_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessOCRRequest = ProcessOCRRequest;
/**
 * OCR processing response
 */
let ProcessOCRResponse = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _confidence_decorators;
    let _confidence_initializers = [];
    let _confidence_extraInitializers = [];
    let _extractedFields_decorators;
    let _extractedFields_initializers = [];
    let _extractedFields_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _validationIssues_decorators;
    let _validationIssues_initializers = [];
    let _validationIssues_extraInitializers = [];
    return _a = class ProcessOCRResponse {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.confidence = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _confidence_initializers, void 0));
                this.extractedFields = (__runInitializers(this, _confidence_extraInitializers), __runInitializers(this, _extractedFields_initializers, void 0));
                this.lineItems = (__runInitializers(this, _extractedFields_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
                this.validationIssues = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _validationIssues_initializers, void 0));
                __runInitializers(this, _validationIssues_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Processing status', example: 'completed' })];
            _confidence_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall confidence score', example: 0.92 })];
            _extractedFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Extracted fields', type: 'object' })];
            _lineItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Extracted line items', type: 'array' })];
            _validationIssues_decorators = [(0, swagger_1.ApiProperty)({ description: 'Validation issues', type: 'array' })];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _confidence_decorators, { kind: "field", name: "confidence", static: false, private: false, access: { has: obj => "confidence" in obj, get: obj => obj.confidence, set: (obj, value) => { obj.confidence = value; } }, metadata: _metadata }, _confidence_initializers, _confidence_extraInitializers);
            __esDecorate(null, null, _extractedFields_decorators, { kind: "field", name: "extractedFields", static: false, private: false, access: { has: obj => "extractedFields" in obj, get: obj => obj.extractedFields, set: (obj, value) => { obj.extractedFields = value; } }, metadata: _metadata }, _extractedFields_initializers, _extractedFields_extraInitializers);
            __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
            __esDecorate(null, null, _validationIssues_decorators, { kind: "field", name: "validationIssues", static: false, private: false, access: { has: obj => "validationIssues" in obj, get: obj => obj.validationIssues, set: (obj, value) => { obj.validationIssues = value; } }, metadata: _metadata }, _validationIssues_initializers, _validationIssues_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessOCRResponse = ProcessOCRResponse;
/**
 * Automated matching request
 */
let AutomatedMatchingRequest = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _matchingType_decorators;
    let _matchingType_initializers = [];
    let _matchingType_extraInitializers = [];
    let _autoApprove_decorators;
    let _autoApprove_initializers = [];
    let _autoApprove_extraInitializers = [];
    let _toleranceOverrides_decorators;
    let _toleranceOverrides_initializers = [];
    let _toleranceOverrides_extraInitializers = [];
    return _a = class AutomatedMatchingRequest {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.matchingType = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _matchingType_initializers, void 0));
                this.autoApprove = (__runInitializers(this, _matchingType_extraInitializers), __runInitializers(this, _autoApprove_initializers, void 0));
                this.toleranceOverrides = (__runInitializers(this, _autoApprove_extraInitializers), __runInitializers(this, _toleranceOverrides_initializers, void 0));
                __runInitializers(this, _toleranceOverrides_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID', example: 1 })];
            _matchingType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matching type', example: 'three_way' })];
            _autoApprove_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-approve within tolerance', example: true })];
            _toleranceOverrides_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tolerance overrides', type: 'object', required: false })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _matchingType_decorators, { kind: "field", name: "matchingType", static: false, private: false, access: { has: obj => "matchingType" in obj, get: obj => obj.matchingType, set: (obj, value) => { obj.matchingType = value; } }, metadata: _metadata }, _matchingType_initializers, _matchingType_extraInitializers);
            __esDecorate(null, null, _autoApprove_decorators, { kind: "field", name: "autoApprove", static: false, private: false, access: { has: obj => "autoApprove" in obj, get: obj => obj.autoApprove, set: (obj, value) => { obj.autoApprove = value; } }, metadata: _metadata }, _autoApprove_initializers, _autoApprove_extraInitializers);
            __esDecorate(null, null, _toleranceOverrides_decorators, { kind: "field", name: "toleranceOverrides", static: false, private: false, access: { has: obj => "toleranceOverrides" in obj, get: obj => obj.toleranceOverrides, set: (obj, value) => { obj.toleranceOverrides = value; } }, metadata: _metadata }, _toleranceOverrides_initializers, _toleranceOverrides_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AutomatedMatchingRequest = AutomatedMatchingRequest;
/**
 * Automated matching response
 */
let AutomatedMatchingResponse = (() => {
    var _a;
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _matchQuality_decorators;
    let _matchQuality_initializers = [];
    let _matchQuality_extraInitializers = [];
    let _variances_decorators;
    let _variances_initializers = [];
    let _variances_extraInitializers = [];
    let _autoApproved_decorators;
    let _autoApproved_initializers = [];
    let _autoApproved_extraInitializers = [];
    let _exceptions_decorators;
    let _exceptions_initializers = [];
    let _exceptions_extraInitializers = [];
    return _a = class AutomatedMatchingResponse {
            constructor() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.matchQuality = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _matchQuality_initializers, void 0));
                this.variances = (__runInitializers(this, _matchQuality_extraInitializers), __runInitializers(this, _variances_initializers, void 0));
                this.autoApproved = (__runInitializers(this, _variances_extraInitializers), __runInitializers(this, _autoApproved_initializers, void 0));
                this.exceptions = (__runInitializers(this, _autoApproved_extraInitializers), __runInitializers(this, _exceptions_initializers, void 0));
                __runInitializers(this, _exceptions_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Matching status', example: 'matched' })];
            _matchQuality_decorators = [(0, swagger_1.ApiProperty)({ description: 'Match quality score', example: 0.98 })];
            _variances_decorators = [(0, swagger_1.ApiProperty)({ description: 'Variances detected', type: 'array' })];
            _autoApproved_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-approved', example: true })];
            _exceptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exceptions', type: 'array' })];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _matchQuality_decorators, { kind: "field", name: "matchQuality", static: false, private: false, access: { has: obj => "matchQuality" in obj, get: obj => obj.matchQuality, set: (obj, value) => { obj.matchQuality = value; } }, metadata: _metadata }, _matchQuality_initializers, _matchQuality_extraInitializers);
            __esDecorate(null, null, _variances_decorators, { kind: "field", name: "variances", static: false, private: false, access: { has: obj => "variances" in obj, get: obj => obj.variances, set: (obj, value) => { obj.variances = value; } }, metadata: _metadata }, _variances_initializers, _variances_extraInitializers);
            __esDecorate(null, null, _autoApproved_decorators, { kind: "field", name: "autoApproved", static: false, private: false, access: { has: obj => "autoApproved" in obj, get: obj => obj.autoApproved, set: (obj, value) => { obj.autoApproved = value; } }, metadata: _metadata }, _autoApproved_initializers, _autoApproved_extraInitializers);
            __esDecorate(null, null, _exceptions_decorators, { kind: "field", name: "exceptions", static: false, private: false, access: { has: obj => "exceptions" in obj, get: obj => obj.exceptions, set: (obj, value) => { obj.exceptions = value; } }, metadata: _metadata }, _exceptions_initializers, _exceptions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AutomatedMatchingResponse = AutomatedMatchingResponse;
/**
 * Approval routing request
 */
let ApprovalRoutingRequest = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _routingRules_decorators;
    let _routingRules_initializers = [];
    let _routingRules_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _approvalDueDate_decorators;
    let _approvalDueDate_initializers = [];
    let _approvalDueDate_extraInitializers = [];
    return _a = class ApprovalRoutingRequest {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.routingRules = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _routingRules_initializers, void 0));
                this.priority = (__runInitializers(this, _routingRules_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.approvalDueDate = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _approvalDueDate_initializers, void 0));
                __runInitializers(this, _approvalDueDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID', example: 1 })];
            _routingRules_decorators = [(0, swagger_1.ApiProperty)({ description: 'Routing rules to apply', type: 'array' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority level', example: 'normal' })];
            _approvalDueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date', example: '2024-01-30' })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _routingRules_decorators, { kind: "field", name: "routingRules", static: false, private: false, access: { has: obj => "routingRules" in obj, get: obj => obj.routingRules, set: (obj, value) => { obj.routingRules = value; } }, metadata: _metadata }, _routingRules_initializers, _routingRules_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _approvalDueDate_decorators, { kind: "field", name: "approvalDueDate", static: false, private: false, access: { has: obj => "approvalDueDate" in obj, get: obj => obj.approvalDueDate, set: (obj, value) => { obj.approvalDueDate = value; } }, metadata: _metadata }, _approvalDueDate_initializers, _approvalDueDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovalRoutingRequest = ApprovalRoutingRequest;
/**
 * Approval routing response
 */
let ApprovalRoutingResponse = (() => {
    var _a;
    let _routingId_decorators;
    let _routingId_initializers = [];
    let _routingId_extraInitializers = [];
    let _approvalSteps_decorators;
    let _approvalSteps_initializers = [];
    let _approvalSteps_extraInitializers = [];
    let _currentStep_decorators;
    let _currentStep_initializers = [];
    let _currentStep_extraInitializers = [];
    let _estimatedCompletionDate_decorators;
    let _estimatedCompletionDate_initializers = [];
    let _estimatedCompletionDate_extraInitializers = [];
    return _a = class ApprovalRoutingResponse {
            constructor() {
                this.routingId = __runInitializers(this, _routingId_initializers, void 0);
                this.approvalSteps = (__runInitializers(this, _routingId_extraInitializers), __runInitializers(this, _approvalSteps_initializers, void 0));
                this.currentStep = (__runInitializers(this, _approvalSteps_extraInitializers), __runInitializers(this, _currentStep_initializers, void 0));
                this.estimatedCompletionDate = (__runInitializers(this, _currentStep_extraInitializers), __runInitializers(this, _estimatedCompletionDate_initializers, void 0));
                __runInitializers(this, _estimatedCompletionDate_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _routingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Routing ID', example: 1 })];
            _approvalSteps_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval steps', type: 'array' })];
            _currentStep_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current step', example: 1 })];
            _estimatedCompletionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated completion date', example: '2024-01-25' })];
            __esDecorate(null, null, _routingId_decorators, { kind: "field", name: "routingId", static: false, private: false, access: { has: obj => "routingId" in obj, get: obj => obj.routingId, set: (obj, value) => { obj.routingId = value; } }, metadata: _metadata }, _routingId_initializers, _routingId_extraInitializers);
            __esDecorate(null, null, _approvalSteps_decorators, { kind: "field", name: "approvalSteps", static: false, private: false, access: { has: obj => "approvalSteps" in obj, get: obj => obj.approvalSteps, set: (obj, value) => { obj.approvalSteps = value; } }, metadata: _metadata }, _approvalSteps_initializers, _approvalSteps_extraInitializers);
            __esDecorate(null, null, _currentStep_decorators, { kind: "field", name: "currentStep", static: false, private: false, access: { has: obj => "currentStep" in obj, get: obj => obj.currentStep, set: (obj, value) => { obj.currentStep = value; } }, metadata: _metadata }, _currentStep_initializers, _currentStep_extraInitializers);
            __esDecorate(null, null, _estimatedCompletionDate_decorators, { kind: "field", name: "estimatedCompletionDate", static: false, private: false, access: { has: obj => "estimatedCompletionDate" in obj, get: obj => obj.estimatedCompletionDate, set: (obj, value) => { obj.estimatedCompletionDate = value; } }, metadata: _metadata }, _estimatedCompletionDate_initializers, _estimatedCompletionDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApprovalRoutingResponse = ApprovalRoutingResponse;
/**
 * Exception handling request
 */
let InvoiceExceptionRequest = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _exceptionType_decorators;
    let _exceptionType_initializers = [];
    let _exceptionType_extraInitializers = [];
    let _exceptionDetails_decorators;
    let _exceptionDetails_initializers = [];
    let _exceptionDetails_extraInitializers = [];
    let _autoEscalate_decorators;
    let _autoEscalate_initializers = [];
    let _autoEscalate_extraInitializers = [];
    let _assignTo_decorators;
    let _assignTo_initializers = [];
    let _assignTo_extraInitializers = [];
    return _a = class InvoiceExceptionRequest {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.exceptionType = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _exceptionType_initializers, void 0));
                this.exceptionDetails = (__runInitializers(this, _exceptionType_extraInitializers), __runInitializers(this, _exceptionDetails_initializers, void 0));
                this.autoEscalate = (__runInitializers(this, _exceptionDetails_extraInitializers), __runInitializers(this, _autoEscalate_initializers, void 0));
                this.assignTo = (__runInitializers(this, _autoEscalate_extraInitializers), __runInitializers(this, _assignTo_initializers, void 0));
                __runInitializers(this, _assignTo_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID', example: 1 })];
            _exceptionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exception type', example: 'variance_exceeded' })];
            _exceptionDetails_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exception details', example: 'Price variance of 15% exceeds tolerance' })];
            _autoEscalate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-escalate', example: false })];
            _assignTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assign to', example: 'ap_manager', required: false })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _exceptionType_decorators, { kind: "field", name: "exceptionType", static: false, private: false, access: { has: obj => "exceptionType" in obj, get: obj => obj.exceptionType, set: (obj, value) => { obj.exceptionType = value; } }, metadata: _metadata }, _exceptionType_initializers, _exceptionType_extraInitializers);
            __esDecorate(null, null, _exceptionDetails_decorators, { kind: "field", name: "exceptionDetails", static: false, private: false, access: { has: obj => "exceptionDetails" in obj, get: obj => obj.exceptionDetails, set: (obj, value) => { obj.exceptionDetails = value; } }, metadata: _metadata }, _exceptionDetails_initializers, _exceptionDetails_extraInitializers);
            __esDecorate(null, null, _autoEscalate_decorators, { kind: "field", name: "autoEscalate", static: false, private: false, access: { has: obj => "autoEscalate" in obj, get: obj => obj.autoEscalate, set: (obj, value) => { obj.autoEscalate = value; } }, metadata: _metadata }, _autoEscalate_initializers, _autoEscalate_extraInitializers);
            __esDecorate(null, null, _assignTo_decorators, { kind: "field", name: "assignTo", static: false, private: false, access: { has: obj => "assignTo" in obj, get: obj => obj.assignTo, set: (obj, value) => { obj.assignTo = value; } }, metadata: _metadata }, _assignTo_initializers, _assignTo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.InvoiceExceptionRequest = InvoiceExceptionRequest;
/**
 * Duplicate detection request
 */
let DuplicateDetectionRequest = (() => {
    var _a;
    let _invoice_decorators;
    let _invoice_initializers = [];
    let _invoice_extraInitializers = [];
    let _sensitivity_decorators;
    let _sensitivity_initializers = [];
    let _sensitivity_extraInitializers = [];
    let _lookbackDays_decorators;
    let _lookbackDays_initializers = [];
    let _lookbackDays_extraInitializers = [];
    return _a = class DuplicateDetectionRequest {
            constructor() {
                this.invoice = __runInitializers(this, _invoice_initializers, void 0);
                this.sensitivity = (__runInitializers(this, _invoice_extraInitializers), __runInitializers(this, _sensitivity_initializers, void 0));
                this.lookbackDays = (__runInitializers(this, _sensitivity_extraInitializers), __runInitializers(this, _lookbackDays_initializers, void 0));
                __runInitializers(this, _lookbackDays_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice to check', type: 'object' })];
            _sensitivity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Detection sensitivity', example: 0.85 })];
            _lookbackDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Days to look back', example: 180 })];
            __esDecorate(null, null, _invoice_decorators, { kind: "field", name: "invoice", static: false, private: false, access: { has: obj => "invoice" in obj, get: obj => obj.invoice, set: (obj, value) => { obj.invoice = value; } }, metadata: _metadata }, _invoice_initializers, _invoice_extraInitializers);
            __esDecorate(null, null, _sensitivity_decorators, { kind: "field", name: "sensitivity", static: false, private: false, access: { has: obj => "sensitivity" in obj, get: obj => obj.sensitivity, set: (obj, value) => { obj.sensitivity = value; } }, metadata: _metadata }, _sensitivity_initializers, _sensitivity_extraInitializers);
            __esDecorate(null, null, _lookbackDays_decorators, { kind: "field", name: "lookbackDays", static: false, private: false, access: { has: obj => "lookbackDays" in obj, get: obj => obj.lookbackDays, set: (obj, value) => { obj.lookbackDays = value; } }, metadata: _metadata }, _lookbackDays_initializers, _lookbackDays_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DuplicateDetectionRequest = DuplicateDetectionRequest;
/**
 * Invoice analytics request
 */
let InvoiceAnalyticsRequest = (() => {
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
    let _includeProcessingMetrics_decorators;
    let _includeProcessingMetrics_initializers = [];
    let _includeProcessingMetrics_extraInitializers = [];
    return _a = class InvoiceAnalyticsRequest {
            constructor() {
                this.startDate = __runInitializers(this, _startDate_initializers, void 0);
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.groupBy = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _groupBy_initializers, void 0));
                this.includeProcessingMetrics = (__runInitializers(this, _groupBy_extraInitializers), __runInitializers(this, _includeProcessingMetrics_initializers, void 0));
                __runInitializers(this, _includeProcessingMetrics_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2024-01-01' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', example: '2024-01-31' })];
            _groupBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Group by dimension', example: 'supplier' })];
            _includeProcessingMetrics_decorators = [(0, swagger_1.ApiProperty)({ description: 'Include processing metrics', example: true })];
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _groupBy_decorators, { kind: "field", name: "groupBy", static: false, private: false, access: { has: obj => "groupBy" in obj, get: obj => obj.groupBy, set: (obj, value) => { obj.groupBy = value; } }, metadata: _metadata }, _groupBy_initializers, _groupBy_extraInitializers);
            __esDecorate(null, null, _includeProcessingMetrics_decorators, { kind: "field", name: "includeProcessingMetrics", static: false, private: false, access: { has: obj => "includeProcessingMetrics" in obj, get: obj => obj.includeProcessingMetrics, set: (obj, value) => { obj.includeProcessingMetrics = value; } }, metadata: _metadata }, _includeProcessingMetrics_initializers, _includeProcessingMetrics_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.InvoiceAnalyticsRequest = InvoiceAnalyticsRequest;
/**
 * Invoice analytics response
 */
let InvoiceAnalyticsResponse = (() => {
    var _a;
    let _totalInvoices_decorators;
    let _totalInvoices_initializers = [];
    let _totalInvoices_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _avgProcessingTime_decorators;
    let _avgProcessingTime_initializers = [];
    let _avgProcessingTime_extraInitializers = [];
    let _stpRate_decorators;
    let _stpRate_initializers = [];
    let _stpRate_extraInitializers = [];
    let _exceptionRate_decorators;
    let _exceptionRate_initializers = [];
    let _exceptionRate_extraInitializers = [];
    let _breakdown_decorators;
    let _breakdown_initializers = [];
    let _breakdown_extraInitializers = [];
    return _a = class InvoiceAnalyticsResponse {
            constructor() {
                this.totalInvoices = __runInitializers(this, _totalInvoices_initializers, void 0);
                this.totalAmount = (__runInitializers(this, _totalInvoices_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.avgProcessingTime = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _avgProcessingTime_initializers, void 0));
                this.stpRate = (__runInitializers(this, _avgProcessingTime_extraInitializers), __runInitializers(this, _stpRate_initializers, void 0));
                this.exceptionRate = (__runInitializers(this, _stpRate_extraInitializers), __runInitializers(this, _exceptionRate_initializers, void 0));
                this.breakdown = (__runInitializers(this, _exceptionRate_extraInitializers), __runInitializers(this, _breakdown_initializers, void 0));
                __runInitializers(this, _breakdown_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalInvoices_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total invoices', example: 450 })];
            _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount', example: 2500000.00 })];
            _avgProcessingTime_decorators = [(0, swagger_1.ApiProperty)({ description: 'Average processing time (hours)', example: 18.5 })];
            _stpRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Straight-through processing rate', example: 0.75 })];
            _exceptionRate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Exception rate', example: 0.12 })];
            _breakdown_decorators = [(0, swagger_1.ApiProperty)({ description: 'Breakdown by dimension', type: 'array' })];
            __esDecorate(null, null, _totalInvoices_decorators, { kind: "field", name: "totalInvoices", static: false, private: false, access: { has: obj => "totalInvoices" in obj, get: obj => obj.totalInvoices, set: (obj, value) => { obj.totalInvoices = value; } }, metadata: _metadata }, _totalInvoices_initializers, _totalInvoices_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _avgProcessingTime_decorators, { kind: "field", name: "avgProcessingTime", static: false, private: false, access: { has: obj => "avgProcessingTime" in obj, get: obj => obj.avgProcessingTime, set: (obj, value) => { obj.avgProcessingTime = value; } }, metadata: _metadata }, _avgProcessingTime_initializers, _avgProcessingTime_extraInitializers);
            __esDecorate(null, null, _stpRate_decorators, { kind: "field", name: "stpRate", static: false, private: false, access: { has: obj => "stpRate" in obj, get: obj => obj.stpRate, set: (obj, value) => { obj.stpRate = value; } }, metadata: _metadata }, _stpRate_initializers, _stpRate_extraInitializers);
            __esDecorate(null, null, _exceptionRate_decorators, { kind: "field", name: "exceptionRate", static: false, private: false, access: { has: obj => "exceptionRate" in obj, get: obj => obj.exceptionRate, set: (obj, value) => { obj.exceptionRate = value; } }, metadata: _metadata }, _exceptionRate_initializers, _exceptionRate_extraInitializers);
            __esDecorate(null, null, _breakdown_decorators, { kind: "field", name: "breakdown", static: false, private: false, access: { has: obj => "breakdown" in obj, get: obj => obj.breakdown, set: (obj, value) => { obj.breakdown = value; } }, metadata: _metadata }, _breakdown_initializers, _breakdown_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.InvoiceAnalyticsResponse = InvoiceAnalyticsResponse;
// ============================================================================
// COMPOSITE FUNCTIONS - INVOICE CAPTURE & OCR
// ============================================================================
/**
 * Orchestrates complete invoice capture with image processing
 * Composes: createInvoice, uploadInvoiceImage, getSupplierDetails, validateInvoice
 *
 * @param request Invoice capture request
 * @param file Uploaded file
 * @param transaction Database transaction
 * @returns Invoice capture result with validation
 */
const orchestrateInvoiceCapture = async (request, file, transaction) => {
    try {
        // Get supplier details if provided
        let supplierDetails = null;
        if (request.supplierNumber) {
            supplierDetails = await (0, accounts_payable_management_kit_1.getVendorByNumber)(request.supplierNumber);
        }
        // Create invoice record
        const invoice = await (0, invoice_management_matching_kit_1.createInvoice)({
            supplierId: request.supplierId || supplierDetails?.supplierId,
            status: 'draft',
            captureMethod: request.captureMethod,
            captureDate: new Date(),
            hasImage: !!file,
        }, transaction);
        // Upload invoice image if provided
        if (file) {
            await (0, invoice_management_matching_kit_1.uploadInvoiceImage)(invoice.invoiceId, file, transaction);
        }
        // Process OCR if auto-process enabled
        let ocrResult = null;
        if (request.autoProcessOCR && file) {
            ocrResult = await (0, invoice_management_matching_kit_1.processInvoiceOCR)(invoice.invoiceId, 'tesseract', transaction);
        }
        // Validate invoice
        const validation = await (0, invoice_management_matching_kit_1.validateInvoice)(invoice.invoiceId, transaction);
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId: invoice.invoiceId,
            action: 'captured',
            performedBy: 'system',
            comments: `Invoice captured via ${request.captureMethod}`,
            timestamp: new Date(),
        }, transaction);
        return {
            invoiceId: invoice.invoiceId,
            status: invoice.status,
            ocrConfidence: ocrResult?.confidence,
            extractedData: ocrResult?.extractedData,
            validationResults: validation,
        };
    }
    catch (error) {
        throw new Error(`Invoice capture failed: ${error.message}`);
    }
};
exports.orchestrateInvoiceCapture = orchestrateInvoiceCapture;
/**
 * Orchestrates OCR processing with ML validation and corrections
 * Composes: processInvoiceOCR, validateInvoice, getSupplierDetails, applyAutomatedCoding
 *
 * @param request OCR processing request
 * @param transaction Database transaction
 * @returns OCR processing result with confidence scores
 */
const orchestrateOCRProcessing = async (request, transaction) => {
    try {
        // Process OCR
        const ocrResult = await (0, invoice_management_matching_kit_1.processInvoiceOCR)(request.invoiceId, request.ocrEngine, transaction);
        // Apply ML corrections if enabled
        if (request.applyMLCorrections) {
            ocrResult.extractedData = await applyMLCorrections(ocrResult.extractedData);
        }
        // Validate extracted data
        const validationIssues = [];
        if (request.autoValidate) {
            const validation = await (0, invoice_management_matching_kit_1.validateInvoice)(request.invoiceId, transaction);
            if (!validation.valid) {
                validationIssues.push(...validation.errors);
            }
        }
        // Apply automated GL coding if confidence is high
        if (ocrResult.confidence > 0.9) {
            await (0, invoice_management_matching_kit_1.applyAutomatedCoding)(request.invoiceId, ocrResult.extractedData, transaction);
        }
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId: request.invoiceId,
            action: 'ocr_processed',
            performedBy: 'system',
            comments: `OCR processed with ${request.ocrEngine}, confidence: ${ocrResult.confidence}`,
            timestamp: new Date(),
        }, transaction);
        return {
            status: 'completed',
            confidence: ocrResult.confidence,
            extractedFields: ocrResult.extractedFields,
            lineItems: ocrResult.lineItems || [],
            validationIssues,
        };
    }
    catch (error) {
        throw new Error(`OCR processing failed: ${error.message}`);
    }
};
exports.orchestrateOCRProcessing = orchestrateOCRProcessing;
/**
 * Helper function to apply ML corrections to OCR data
 */
const applyMLCorrections = async (extractedData) => {
    // Implementation would apply ML model corrections
    // For now, return data as-is
    return extractedData;
};
/**
 * Orchestrates invoice validation with comprehensive checks
 * Composes: validateInvoice, validateInvoiceTax, detectDuplicateInvoices, getSupplierDetails
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns Validation result with detailed checks
 */
const orchestrateInvoiceValidation = async (invoiceId, transaction) => {
    try {
        const errors = [];
        const warnings = [];
        const checks = [];
        // Basic validation
        const basicValidation = await (0, invoice_management_matching_kit_1.validateInvoice)(invoiceId, transaction);
        checks.push({ check: 'basic_validation', passed: basicValidation.valid });
        if (!basicValidation.valid) {
            errors.push(...basicValidation.errors);
        }
        // Tax validation
        const taxValidation = await (0, invoice_management_matching_kit_1.validateInvoiceTax)(invoiceId, transaction);
        checks.push({ check: 'tax_validation', passed: taxValidation.valid });
        if (!taxValidation.valid) {
            warnings.push(...taxValidation.warnings);
        }
        // Duplicate check
        const duplicateCheck = await (0, invoice_management_matching_kit_1.detectDuplicateInvoices)(invoiceId, transaction);
        checks.push({
            check: 'duplicate_detection',
            passed: !duplicateCheck.isDuplicate,
            message: duplicateCheck.isDuplicate ? `Potential duplicate of invoice ${duplicateCheck.duplicateOf}` : undefined,
        });
        if (duplicateCheck.isDuplicate) {
            errors.push(`Duplicate invoice detected: ${duplicateCheck.duplicateOf}`);
        }
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId,
            action: 'validated',
            performedBy: 'system',
            comments: `Validation completed: ${errors.length} errors, ${warnings.length} warnings`,
            timestamp: new Date(),
        }, transaction);
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            checks,
        };
    }
    catch (error) {
        throw new Error(`Invoice validation failed: ${error.message}`);
    }
};
exports.orchestrateInvoiceValidation = orchestrateInvoiceValidation;
/**
 * Orchestrates automated GL coding with machine learning
 * Composes: applyAutomatedCoding, getSupplierDetails, getInvoiceHistory
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns GL coding result with confidence scores
 */
const orchestrateAutomatedGLCoding = async (invoiceId, transaction) => {
    try {
        // Get invoice details
        const invoice = await getInvoiceDetails(invoiceId);
        // Get supplier historical patterns
        const supplierHistory = await (0, invoice_management_matching_kit_1.getInvoiceHistory)(invoice.supplierId, new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date());
        // Apply automated coding with ML
        const codingResult = await (0, invoice_management_matching_kit_1.applyAutomatedCoding)(invoiceId, invoice, transaction);
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId,
            action: 'auto_coded',
            performedBy: 'system',
            comments: `Automated GL coding applied with confidence ${codingResult.confidence}`,
            timestamp: new Date(),
        }, transaction);
        return {
            coded: true,
            confidence: codingResult.confidence,
            codings: codingResult.codings,
            learningApplied: supplierHistory.length > 0,
        };
    }
    catch (error) {
        throw new Error(`Automated GL coding failed: ${error.message}`);
    }
};
exports.orchestrateAutomatedGLCoding = orchestrateAutomatedGLCoding;
/**
 * Helper function to get invoice details
 */
const getInvoiceDetails = async (invoiceId) => {
    // Implementation would query database
    return {};
};
// ============================================================================
// COMPOSITE FUNCTIONS - AUTOMATED MATCHING
// ============================================================================
/**
 * Orchestrates three-way matching with tolerance management
 * Composes: performThreeWayMatch, getMatchingTolerance, getPurchaseOrderLine, getReceiptLine
 *
 * @param request Automated matching request
 * @param transaction Database transaction
 * @returns Three-way match result with variances
 */
const orchestrateThreeWayMatching = async (request, transaction) => {
    try {
        // Get matching tolerances
        const tolerances = await (0, invoice_management_matching_kit_1.getMatchingTolerance)(transaction);
        if (request.toleranceOverrides) {
            Object.assign(tolerances, request.toleranceOverrides);
        }
        // Perform three-way match
        const matchResult = await (0, invoice_management_matching_kit_1.performThreeWayMatch)(request.invoiceId, tolerances, transaction);
        // Calculate match quality score
        const matchQuality = calculateMatchQuality(matchResult);
        // Determine if auto-approval is possible
        const autoApproved = request.autoApprove &&
            matchResult.matchStatus === 'matched' &&
            matchResult.variances.every((v) => v.withinTolerance);
        // Auto-approve if eligible
        if (autoApproved) {
            await (0, invoice_management_matching_kit_1.approveInvoice)(request.invoiceId, 'system', transaction);
        }
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId: request.invoiceId,
            action: 'three_way_matched',
            performedBy: 'system',
            comments: `Match quality: ${matchQuality}, Auto-approved: ${autoApproved}`,
            timestamp: new Date(),
        }, transaction);
        return {
            status: matchResult.matchStatus,
            matchQuality,
            variances: matchResult.variances,
            autoApproved,
            exceptions: matchResult.exceptions || [],
        };
    }
    catch (error) {
        throw new Error(`Three-way matching failed: ${error.message}`);
    }
};
exports.orchestrateThreeWayMatching = orchestrateThreeWayMatching;
/**
 * Helper function to calculate match quality score
 */
const calculateMatchQuality = (matchResult) => {
    if (matchResult.matchStatus === 'matched') {
        return 1.0;
    }
    const totalVariance = matchResult.variances.reduce((sum, v) => sum + Math.abs(v.varianceAmount), 0);
    const totalAmount = matchResult.invoiceAmount;
    if (totalAmount === 0)
        return 0;
    const variancePercent = totalVariance / totalAmount;
    return Math.max(0, 1 - variancePercent);
};
/**
 * Orchestrates two-way matching for non-PO invoices
 * Composes: performTwoWayMatch, getMatchingTolerance, approveInvoice
 *
 * @param request Automated matching request
 * @param transaction Database transaction
 * @returns Two-way match result
 */
const orchestrateTwoWayMatching = async (request, transaction) => {
    try {
        // Get matching tolerances
        const tolerances = await (0, invoice_management_matching_kit_1.getMatchingTolerance)(transaction);
        // Perform two-way match
        const matchResult = await (0, invoice_management_matching_kit_1.performTwoWayMatch)(request.invoiceId, tolerances, transaction);
        // Calculate match quality
        const matchQuality = calculateMatchQuality(matchResult);
        // Auto-approve if eligible
        const autoApproved = request.autoApprove && matchResult.matchStatus === 'matched' && matchQuality > 0.95;
        if (autoApproved) {
            await (0, invoice_management_matching_kit_1.approveInvoice)(request.invoiceId, 'system', transaction);
        }
        return {
            status: matchResult.matchStatus,
            matchQuality,
            variances: matchResult.variances || [],
            autoApproved,
            exceptions: [],
        };
    }
    catch (error) {
        throw new Error(`Two-way matching failed: ${error.message}`);
    }
};
exports.orchestrateTwoWayMatching = orchestrateTwoWayMatching;
/**
 * Orchestrates fuzzy matching for complex scenarios
 * Composes: performThreeWayMatch, getPurchaseOrderLine, getReceiptLine
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns Fuzzy match result with confidence
 */
const orchestrateFuzzyMatching = async (invoiceId, transaction) => {
    try {
        const invoice = await getInvoiceDetails(invoiceId);
        // Find potential PO matches using fuzzy logic
        const potentialMatches = await findPotentialPOMatches(invoice);
        // Calculate confidence for each match
        const suggestedPOs = potentialMatches.map((po) => ({
            poId: po.purchaseOrderId,
            confidence: calculatePOMatchConfidence(invoice, po),
        })).sort((a, b) => b.confidence - a.confidence);
        const bestMatch = suggestedPOs[0];
        const matched = bestMatch && bestMatch.confidence > 0.85;
        return {
            matched,
            confidence: bestMatch?.confidence || 0,
            suggestedPOs: suggestedPOs.slice(0, 5),
            requiresReview: !matched && suggestedPOs.length > 0,
        };
    }
    catch (error) {
        throw new Error(`Fuzzy matching failed: ${error.message}`);
    }
};
exports.orchestrateFuzzyMatching = orchestrateFuzzyMatching;
/**
 * Helper function to find potential PO matches
 */
const findPotentialPOMatches = async (invoice) => {
    // Implementation would query database for potential PO matches
    return [];
};
/**
 * Helper function to calculate PO match confidence
 */
const calculatePOMatchConfidence = (invoice, po) => {
    let confidence = 0;
    // Supplier match (40%)
    if (invoice.supplierId === po.supplierId) {
        confidence += 0.4;
    }
    // Amount match (30%)
    const amountDiff = Math.abs(invoice.totalAmount - po.remainingAmount);
    if (amountDiff < po.remainingAmount * 0.05) {
        confidence += 0.3;
    }
    else if (amountDiff < po.remainingAmount * 0.1) {
        confidence += 0.15;
    }
    // Date proximity (20%)
    const daysDiff = Math.abs((new Date(invoice.invoiceDate).getTime() - new Date(po.orderDate).getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff <= 30) {
        confidence += 0.2;
    }
    else if (daysDiff <= 90) {
        confidence += 0.1;
    }
    // Description similarity (10%)
    // Would implement text similarity algorithm
    confidence += 0.05;
    return confidence;
};
/**
 * Orchestrates variance analysis and exception routing
 * Composes: performThreeWayMatch, getMatchingTolerance, placeInvoiceHold, routeInvoice
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns Variance analysis result with routing
 */
const orchestrateVarianceAnalysis = async (invoiceId, transaction) => {
    try {
        // Get matching tolerances
        const tolerances = await (0, invoice_management_matching_kit_1.getMatchingTolerance)(transaction);
        // Perform match to get variances
        const matchResult = await (0, invoice_management_matching_kit_1.performThreeWayMatch)(invoiceId, tolerances, transaction);
        // Calculate total variance
        const totalVariance = matchResult.variances.reduce((sum, v) => sum + Math.abs(v.varianceAmount), 0);
        const variancePercent = (totalVariance / matchResult.invoiceAmount) * 100;
        // Check if within tolerance
        const withinTolerance = matchResult.variances.every((v) => v.withinTolerance);
        // Route for review if variances exist
        let routed = false;
        let routedTo;
        if (!withinTolerance) {
            // Place on hold
            await (0, invoice_management_matching_kit_1.placeInvoiceHold)(invoiceId, 'variance', 'Variance exceeds tolerance', 'system', transaction);
            // Route based on variance amount
            routedTo = totalVariance > 10000 ? 'ap_manager' : 'ap_clerk';
            await (0, invoice_management_matching_kit_1.routeInvoice)(invoiceId, routedTo, transaction);
            routed = true;
        }
        return {
            totalVariance,
            variancePercent,
            withinTolerance,
            variances: matchResult.variances,
            routed,
            routedTo,
        };
    }
    catch (error) {
        throw new Error(`Variance analysis failed: ${error.message}`);
    }
};
exports.orchestrateVarianceAnalysis = orchestrateVarianceAnalysis;
// ============================================================================
// COMPOSITE FUNCTIONS - APPROVAL WORKFLOWS
// ============================================================================
/**
 * Orchestrates dynamic approval routing based on business rules
 * Composes: routeInvoice, createWorkflowInstanceModel, createApprovalStepModel
 *
 * @param request Approval routing request
 * @param transaction Database transaction
 * @returns Approval routing result with workflow steps
 */
const orchestrateApprovalRouting = async (request, transaction) => {
    try {
        const invoice = await getInvoiceDetails(request.invoiceId);
        // Determine approval steps based on rules
        const approvalSteps = await determineApprovalSteps(invoice, request.routingRules);
        // Create workflow instance
        const routingId = await (0, invoice_management_matching_kit_1.routeInvoice)(request.invoiceId, approvalSteps[0].approverRole, transaction);
        // Calculate estimated completion date
        const estimatedCompletionDate = new Date(request.approvalDueDate);
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId: request.invoiceId,
            action: 'routed_for_approval',
            performedBy: 'system',
            comments: `Routed to ${approvalSteps.length} approval steps, priority: ${request.priority}`,
            timestamp: new Date(),
        }, transaction);
        return {
            routingId,
            approvalSteps,
            currentStep: 1,
            estimatedCompletionDate,
        };
    }
    catch (error) {
        throw new Error(`Approval routing failed: ${error.message}`);
    }
};
exports.orchestrateApprovalRouting = orchestrateApprovalRouting;
/**
 * Helper function to determine approval steps
 */
const determineApprovalSteps = async (invoice, routingRules) => {
    const steps = [];
    let stepNumber = 1;
    // Amount-based routing
    if (invoice.totalAmount < 1000) {
        steps.push({
            stepNumber: stepNumber++,
            approverRole: 'ap_clerk',
            status: 'pending',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        });
    }
    else if (invoice.totalAmount < 10000) {
        steps.push({
            stepNumber: stepNumber++,
            approverRole: 'ap_supervisor',
            status: 'pending',
            dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        });
    }
    else {
        steps.push({
            stepNumber: stepNumber++,
            approverRole: 'ap_manager',
            status: 'pending',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        });
        steps.push({
            stepNumber: stepNumber++,
            approverRole: 'controller',
            status: 'pending',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        });
    }
    return steps;
};
/**
 * Orchestrates approval step execution with delegation support
 * Composes: approveInvoice, createApprovalActionModel, routeInvoice
 *
 * @param invoiceId Invoice ID
 * @param approverId Approver user ID
 * @param approved Approval decision
 * @param comments Approval comments
 * @param delegateTo Optional delegation target
 * @param transaction Database transaction
 * @returns Approval execution result
 */
const orchestrateApprovalExecution = async (invoiceId, approverId, approved, comments, delegateTo, transaction) => {
    try {
        // Handle delegation
        if (delegateTo) {
            await (0, invoice_management_matching_kit_1.routeInvoice)(invoiceId, delegateTo, transaction);
            await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
                invoiceId,
                action: 'approval_delegated',
                performedBy: approverId,
                comments: `Delegated to ${delegateTo}: ${comments}`,
                timestamp: new Date(),
            }, transaction);
            return {
                executed: true,
                workflowComplete: false,
                nextApprover: delegateTo,
                delegated: true,
            };
        }
        // Execute approval or rejection
        if (approved) {
            const approvalResult = await (0, invoice_management_matching_kit_1.approveInvoice)(invoiceId, approverId, transaction);
            await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
                invoiceId,
                action: 'approved',
                performedBy: approverId,
                comments,
                timestamp: new Date(),
            }, transaction);
            return {
                executed: true,
                workflowComplete: approvalResult.workflowComplete,
                nextApprover: approvalResult.nextApprover,
                delegated: false,
            };
        }
        else {
            await (0, accounts_payable_management_kit_1.rejectAPInvoice)(invoiceId, approverId, comments, transaction);
            await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
                invoiceId,
                action: 'rejected',
                performedBy: approverId,
                comments,
                timestamp: new Date(),
            }, transaction);
            return {
                executed: true,
                workflowComplete: true,
                delegated: false,
            };
        }
    }
    catch (error) {
        throw new Error(`Approval execution failed: ${error.message}`);
    }
};
exports.orchestrateApprovalExecution = orchestrateApprovalExecution;
/**
 * Orchestrates approval escalation for overdue approvals
 * Composes: routeInvoice, createWorkflowInstanceModel, createInvoiceAuditTrail
 *
 * @param transaction Database transaction
 * @returns Escalation results
 */
const orchestrateApprovalEscalation = async (transaction) => {
    try {
        // Find overdue approvals
        const overdueInvoices = await getOverdueApprovals();
        let escalated = 0;
        let notifications = 0;
        for (const invoice of overdueInvoices) {
            // Determine escalation target
            const escalationTarget = getEscalationTarget(invoice.currentApprover);
            // Escalate
            await (0, invoice_management_matching_kit_1.routeInvoice)(invoice.invoiceId, escalationTarget, transaction);
            await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
                invoiceId: invoice.invoiceId,
                action: 'escalated',
                performedBy: 'system',
                comments: `Escalated from ${invoice.currentApprover} to ${escalationTarget} due to timeout`,
                timestamp: new Date(),
            }, transaction);
            escalated++;
            notifications++; // Would send actual notification
        }
        return { escalated, notifications };
    }
    catch (error) {
        throw new Error(`Approval escalation failed: ${error.message}`);
    }
};
exports.orchestrateApprovalEscalation = orchestrateApprovalEscalation;
/**
 * Helper function to get overdue approvals
 */
const getOverdueApprovals = async () => {
    // Implementation would query database
    return [];
};
/**
 * Helper function to get escalation target
 */
const getEscalationTarget = (currentApprover) => {
    const escalationMap = {
        ap_clerk: 'ap_supervisor',
        ap_supervisor: 'ap_manager',
        ap_manager: 'controller',
        controller: 'cfo',
    };
    return escalationMap[currentApprover] || 'ap_manager';
};
// ============================================================================
// COMPOSITE FUNCTIONS - EXCEPTION HANDLING
// ============================================================================
/**
 * Orchestrates invoice exception detection and handling
 * Composes: placeInvoiceHold, createInvoiceDispute, routeInvoice, createInvoiceAuditTrail
 *
 * @param request Exception handling request
 * @param transaction Database transaction
 * @returns Exception handling result
 */
const orchestrateInvoiceExceptionHandling = async (request, transaction) => {
    try {
        // Place invoice on hold
        await (0, invoice_management_matching_kit_1.placeInvoiceHold)(request.invoiceId, request.exceptionType, request.exceptionDetails, 'system', transaction);
        // Determine assignment
        const assignedTo = request.assignTo || determineExceptionAssignment(request.exceptionType);
        // Route to assigned user
        await (0, invoice_management_matching_kit_1.routeInvoice)(request.invoiceId, assignedTo, transaction);
        // Create dispute if applicable
        if (isDisputeException(request.exceptionType)) {
            await (0, invoice_management_matching_kit_1.createInvoiceDispute)({
                invoiceId: request.invoiceId,
                disputeType: request.exceptionType,
                disputeReason: request.exceptionDetails,
            }, transaction);
        }
        // Determine escalation
        const escalated = request.autoEscalate && isCriticalException(request.exceptionType);
        // Set due date based on priority
        const dueDate = new Date(Date.now() + (escalated ? 1 : 3) * 24 * 60 * 60 * 1000);
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId: request.invoiceId,
            action: 'exception_detected',
            performedBy: 'system',
            comments: `${request.exceptionType}: ${request.exceptionDetails}`,
            timestamp: new Date(),
        }, transaction);
        return {
            handled: true,
            holdPlaced: true,
            escalated,
            assignedTo,
            dueDate,
        };
    }
    catch (error) {
        throw new Error(`Exception handling failed: ${error.message}`);
    }
};
exports.orchestrateInvoiceExceptionHandling = orchestrateInvoiceExceptionHandling;
/**
 * Helper function to determine exception assignment
 */
const determineExceptionAssignment = (exceptionType) => {
    const assignmentMap = {
        variance_exceeded: 'ap_supervisor',
        duplicate_suspected: 'ap_clerk',
        missing_po: 'purchasing_agent',
        tax_error: 'tax_specialist',
        coding_error: 'accounting_manager',
    };
    return assignmentMap[exceptionType] || 'ap_clerk';
};
/**
 * Helper function to check if exception is a dispute
 */
const isDisputeException = (exceptionType) => {
    return ['variance_exceeded', 'quality_issue', 'pricing_error'].includes(exceptionType);
};
/**
 * Helper function to check if exception is critical
 */
const isCriticalException = (exceptionType) => {
    return ['fraud_suspected', 'compliance_violation', 'duplicate_payment'].includes(exceptionType);
};
/**
 * Orchestrates invoice hold management with release workflows
 * Composes: releaseInvoiceHold, approveInvoice, routeInvoice, createInvoiceAuditTrail
 *
 * @param invoiceId Invoice ID
 * @param releaseReason Hold release reason
 * @param releasedBy User releasing hold
 * @param autoReprocess Auto-reprocess after release
 * @param transaction Database transaction
 * @returns Hold release result
 */
const orchestrateInvoiceHoldRelease = async (invoiceId, releaseReason, releasedBy, autoReprocess, transaction) => {
    try {
        // Release hold
        await (0, invoice_management_matching_kit_1.releaseInvoiceHold)(invoiceId, releaseReason, releasedBy, transaction);
        // Auto-reprocess if requested
        let reprocessed = false;
        let status = 'hold_released';
        if (autoReprocess) {
            // Re-validate invoice
            const validation = await (0, invoice_management_matching_kit_1.validateInvoice)(invoiceId, transaction);
            if (validation.valid) {
                // Attempt matching
                const matchResult = await (0, invoice_management_matching_kit_1.performThreeWayMatch)(invoiceId, await (0, invoice_management_matching_kit_1.getMatchingTolerance)(transaction), transaction);
                if (matchResult.matchStatus === 'matched') {
                    // Auto-approve if matched
                    await (0, invoice_management_matching_kit_1.approveInvoice)(invoiceId, 'system', transaction);
                    status = 'approved';
                    reprocessed = true;
                }
                else {
                    // Route for approval
                    await (0, invoice_management_matching_kit_1.routeInvoice)(invoiceId, 'ap_clerk', transaction);
                    status = 'pending_approval';
                    reprocessed = true;
                }
            }
        }
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId,
            action: 'hold_released',
            performedBy: releasedBy,
            comments: `${releaseReason}, Reprocessed: ${reprocessed}`,
            timestamp: new Date(),
        }, transaction);
        return { released: true, reprocessed, status };
    }
    catch (error) {
        throw new Error(`Invoice hold release failed: ${error.message}`);
    }
};
exports.orchestrateInvoiceHoldRelease = orchestrateInvoiceHoldRelease;
/**
 * Orchestrates invoice dispute resolution workflow
 * Composes: createInvoiceDispute, getVendorByNumber, routeInvoice, createInvoiceAuditTrail
 *
 * @param invoiceId Invoice ID
 * @param disputeDetails Dispute details
 * @param transaction Database transaction
 * @returns Dispute resolution workflow result
 */
const orchestrateInvoiceDisputeResolution = async (invoiceId, disputeDetails, transaction) => {
    try {
        // Create dispute
        const dispute = await (0, invoice_management_matching_kit_1.createInvoiceDispute)({
            invoiceId,
            ...disputeDetails,
        }, transaction);
        // Determine assignment
        const assignedTo = 'ap_manager';
        await (0, invoice_management_matching_kit_1.routeInvoice)(invoiceId, assignedTo, transaction);
        // Notify supplier if requested
        let supplierNotified = false;
        if (disputeDetails.notifySupplier) {
            // Would send actual notification
            supplierNotified = true;
        }
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId,
            action: 'dispute_created',
            performedBy: 'system',
            comments: `Dispute created: ${disputeDetails.disputeType}`,
            timestamp: new Date(),
        }, transaction);
        return {
            disputeId: dispute.disputeId,
            status: 'open',
            assignedTo,
            supplierNotified,
        };
    }
    catch (error) {
        throw new Error(`Invoice dispute resolution failed: ${error.message}`);
    }
};
exports.orchestrateInvoiceDisputeResolution = orchestrateInvoiceDisputeResolution;
// ============================================================================
// COMPOSITE FUNCTIONS - DUPLICATE DETECTION
// ============================================================================
/**
 * Orchestrates comprehensive duplicate invoice detection
 * Composes: detectDuplicateInvoices, checkDuplicateInvoice, getInvoiceHistory
 *
 * @param request Duplicate detection request
 * @param transaction Database transaction
 * @returns Duplicate detection result with match details
 */
const orchestrateDuplicateDetection = async (request, transaction) => {
    try {
        // Get historical invoices for supplier
        const startDate = new Date(Date.now() - request.lookbackDays * 24 * 60 * 60 * 1000);
        const historicalInvoices = await (0, invoice_management_matching_kit_1.getInvoiceHistory)(request.invoice.supplierNumber, startDate, new Date());
        // Calculate match scores
        const potentialDuplicates = [];
        for (const historical of historicalInvoices) {
            const matchResult = calculateDuplicateMatchScore(request.invoice, historical);
            if (matchResult.matchScore >= request.sensitivity) {
                potentialDuplicates.push({
                    invoiceId: historical.invoiceId,
                    matchScore: matchResult.matchScore,
                    matchReasons: matchResult.matchReasons,
                });
            }
        }
        // Sort by match score
        potentialDuplicates.sort((a, b) => b.matchScore - a.matchScore);
        const isDuplicate = potentialDuplicates.length > 0 && potentialDuplicates[0].matchScore > 0.95;
        const confidence = potentialDuplicates.length > 0 ? potentialDuplicates[0].matchScore : 0;
        return {
            isDuplicate,
            confidence,
            potentialDuplicates: potentialDuplicates.slice(0, 5),
        };
    }
    catch (error) {
        throw new Error(`Duplicate detection failed: ${error.message}`);
    }
};
exports.orchestrateDuplicateDetection = orchestrateDuplicateDetection;
/**
 * Helper function to calculate duplicate match score
 */
const calculateDuplicateMatchScore = (invoice1, invoice2) => {
    let score = 0;
    const matchReasons = [];
    // Invoice number match (40%)
    if (invoice1.invoiceNumber === invoice2.invoiceNumber) {
        score += 0.4;
        matchReasons.push('Exact invoice number match');
    }
    else if (isSimilarInvoiceNumber(invoice1.invoiceNumber, invoice2.invoiceNumber)) {
        score += 0.2;
        matchReasons.push('Similar invoice number');
    }
    // Amount match (30%)
    if (Math.abs(invoice1.amount - invoice2.amount) < 0.01) {
        score += 0.3;
        matchReasons.push('Exact amount match');
    }
    else if (Math.abs(invoice1.amount - invoice2.amount) < invoice1.amount * 0.02) {
        score += 0.15;
        matchReasons.push('Similar amount');
    }
    // Date proximity (20%)
    const daysDiff = Math.abs((new Date(invoice1.invoiceDate).getTime() - new Date(invoice2.invoiceDate).getTime()) /
        (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
        score += 0.2;
        matchReasons.push('Same date');
    }
    else if (daysDiff <= 7) {
        score += 0.1;
        matchReasons.push('Close dates');
    }
    // Supplier match (10%)
    if (invoice1.supplierNumber === invoice2.supplierNumber) {
        score += 0.1;
        matchReasons.push('Same supplier');
    }
    return { matchScore: score, matchReasons };
};
/**
 * Helper function to check invoice number similarity
 */
const isSimilarInvoiceNumber = (num1, num2) => {
    // Simple Levenshtein distance check
    const distance = levenshteinDistance(num1.toLowerCase(), num2.toLowerCase());
    return distance <= 2;
};
/**
 * Helper function to calculate Levenshtein distance
 */
const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[str2.length][str1.length];
};
// ============================================================================
// COMPOSITE FUNCTIONS - ANALYTICS & REPORTING
// ============================================================================
/**
 * Orchestrates comprehensive invoice analytics generation
 * Composes: getInvoiceHistory, calculateInvoiceLineTotals, getInvoicesPendingApproval
 *
 * @param request Invoice analytics request
 * @param transaction Database transaction
 * @returns Invoice analytics with processing metrics
 */
const orchestrateInvoiceAnalytics = async (request, transaction) => {
    try {
        // Get invoice history
        const invoices = await (0, invoice_management_matching_kit_1.getInvoiceHistory)(null, request.startDate, request.endDate);
        // Calculate totals
        const totalInvoices = invoices.length;
        const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        // Calculate processing metrics
        let avgProcessingTime = 0;
        let stpCount = 0;
        let exceptionCount = 0;
        if (request.includeProcessingMetrics) {
            for (const invoice of invoices) {
                // Calculate processing time
                if (invoice.approvedAt && invoice.captureDate) {
                    const processingTime = (new Date(invoice.approvedAt).getTime() - new Date(invoice.captureDate).getTime()) / (1000 * 60 * 60);
                    avgProcessingTime += processingTime;
                }
                // Count STP (straight-through processing)
                if (invoice.stpProcessed) {
                    stpCount++;
                }
                // Count exceptions
                if (invoice.status === 'on_hold' || invoice.status === 'disputed') {
                    exceptionCount++;
                }
            }
            avgProcessingTime = totalInvoices > 0 ? avgProcessingTime / totalInvoices : 0;
        }
        const stpRate = totalInvoices > 0 ? stpCount / totalInvoices : 0;
        const exceptionRate = totalInvoices > 0 ? exceptionCount / totalInvoices : 0;
        // Group by requested dimension
        const breakdown = groupInvoices(invoices, request.groupBy);
        return {
            totalInvoices,
            totalAmount,
            avgProcessingTime,
            stpRate,
            exceptionRate,
            breakdown,
        };
    }
    catch (error) {
        throw new Error(`Invoice analytics generation failed: ${error.message}`);
    }
};
exports.orchestrateInvoiceAnalytics = orchestrateInvoiceAnalytics;
/**
 * Helper function to group invoices
 */
const groupInvoices = (invoices, groupBy) => {
    const grouped = {};
    for (const invoice of invoices) {
        const key = getInvoiceGroupKey(invoice, groupBy);
        if (!grouped[key]) {
            grouped[key] = { count: 0, amount: 0 };
        }
        grouped[key].count++;
        grouped[key].amount += invoice.totalAmount;
    }
    return Object.entries(grouped).map(([category, data]) => ({
        category,
        count: data.count,
        amount: data.amount,
        percentage: (data.count / invoices.length) * 100,
    }));
};
/**
 * Helper function to get invoice group key
 */
const getInvoiceGroupKey = (invoice, groupBy) => {
    switch (groupBy) {
        case 'supplier':
            return invoice.supplierName;
        case 'gl_account':
            return invoice.glAccountCode;
        case 'business_unit':
            return invoice.businessUnit;
        case 'status':
            return invoice.status;
        case 'day':
            return invoice.invoiceDate.toISOString().split('T')[0];
        case 'week':
            return getWeekKey(invoice.invoiceDate);
        case 'month':
            return `${invoice.invoiceDate.getFullYear()}-${String(invoice.invoiceDate.getMonth() + 1).padStart(2, '0')}`;
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
 * Orchestrates invoice processing dashboard metrics
 * Composes: getInvoicesPendingApproval, getInvoicesWithVariances, getInvoiceHistory
 *
 * @param transaction Database transaction
 * @returns Dashboard metrics
 */
const orchestrateInvoiceDashboardMetrics = async (transaction) => {
    try {
        // Get pending approvals
        const pendingInvoices = await (0, accounts_payable_management_kit_1.getInvoicesPendingApproval)(null, null, null);
        const pendingCount = pendingInvoices.length;
        const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        // Count overdue
        const overdueCount = pendingInvoices.filter((inv) => {
            return new Date(inv.dueDate) < new Date();
        }).length;
        // Get invoices with variances
        const varianceInvoices = await (0, accounts_payable_management_kit_1.getInvoicesWithVariances)();
        const exceptionCount = varianceInvoices.length;
        // Calculate STP rate (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentInvoices = await (0, invoice_management_matching_kit_1.getInvoiceHistory)(null, thirtyDaysAgo, new Date());
        const stpCount = recentInvoices.filter((inv) => inv.stpProcessed).length;
        const stpRate = recentInvoices.length > 0 ? stpCount / recentInvoices.length : 0;
        // Calculate avg processing time
        let totalProcessingTime = 0;
        let processedCount = 0;
        for (const invoice of recentInvoices) {
            if (invoice.approvedAt && invoice.captureDate) {
                const processingTime = (new Date(invoice.approvedAt).getTime() - new Date(invoice.captureDate).getTime()) / (1000 * 60 * 60);
                totalProcessingTime += processingTime;
                processedCount++;
            }
        }
        const avgProcessingTime = processedCount > 0 ? totalProcessingTime / processedCount : 0;
        // Get top suppliers
        const supplierTotals = {};
        for (const invoice of recentInvoices) {
            if (!supplierTotals[invoice.supplierId]) {
                supplierTotals[invoice.supplierId] = {
                    supplierId: invoice.supplierId,
                    supplierName: invoice.supplierName,
                    count: 0,
                    amount: 0,
                };
            }
            supplierTotals[invoice.supplierId].count++;
            supplierTotals[invoice.supplierId].amount += invoice.totalAmount;
        }
        const topSuppliers = Object.values(supplierTotals)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);
        // Get recent activity
        const recentActivity = recentInvoices
            .sort((a, b) => new Date(b.captureDate).getTime() - new Date(a.captureDate).getTime())
            .slice(0, 20)
            .map((inv) => ({
            invoiceId: inv.invoiceId,
            invoiceNumber: inv.invoiceNumber,
            supplierName: inv.supplierName,
            amount: inv.totalAmount,
            status: inv.status,
            captureDate: inv.captureDate,
        }));
        return {
            pendingCount,
            pendingAmount,
            overdueCount,
            exceptionCount,
            stpRate,
            avgProcessingTime,
            topSuppliers,
            recentActivity,
        };
    }
    catch (error) {
        throw new Error(`Invoice dashboard metrics generation failed: ${error.message}`);
    }
};
exports.orchestrateInvoiceDashboardMetrics = orchestrateInvoiceDashboardMetrics;
/**
 * Orchestrates end-of-period invoice processing summary
 * Composes: getInvoiceHistory, calculateInvoiceLineTotals
 *
 * @param periodEndDate Period end date
 * @param transaction Database transaction
 * @returns End-of-period summary
 */
const orchestrateEndOfPeriodInvoiceSummary = async (periodEndDate, transaction) => {
    try {
        const periodStartDate = new Date(periodEndDate);
        periodStartDate.setDate(1); // First day of month
        // Get invoices for period
        const invoices = await (0, invoice_management_matching_kit_1.getInvoiceHistory)(null, periodStartDate, periodEndDate);
        const totalInvoicesProcessed = invoices.length;
        const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        // Count by status
        const approvedCount = invoices.filter((inv) => inv.status === 'approved').length;
        const rejectedCount = invoices.filter((inv) => inv.status === 'rejected').length;
        const pendingCount = invoices.filter((inv) => ['pending_validation', 'pending_approval'].includes(inv.status)).length;
        // Calculate STP rate
        const stpCount = invoices.filter((inv) => inv.stpProcessed).length;
        const stpRate = totalInvoicesProcessed > 0 ? stpCount / totalInvoicesProcessed : 0;
        // Calculate avg processing time
        let totalProcessingTime = 0;
        let processedCount = 0;
        for (const invoice of invoices) {
            if (invoice.approvedAt && invoice.captureDate) {
                const processingTime = (new Date(invoice.approvedAt).getTime() - new Date(invoice.captureDate).getTime()) / (1000 * 60 * 60);
                totalProcessingTime += processingTime;
                processedCount++;
            }
        }
        const avgProcessingTime = processedCount > 0 ? totalProcessingTime / processedCount : 0;
        // Count exceptions
        const exceptionInvoices = invoices.filter((inv) => ['on_hold', 'disputed'].includes(inv.status));
        const exceptionCount = exceptionInvoices.length;
        // Get top exception types
        const exceptionTypes = {};
        for (const invoice of exceptionInvoices) {
            const type = invoice.holdType || invoice.disputeType || 'unknown';
            exceptionTypes[type] = (exceptionTypes[type] || 0) + 1;
        }
        const topExceptions = Object.entries(exceptionTypes)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        return {
            totalInvoicesProcessed,
            totalAmount,
            approvedCount,
            rejectedCount,
            pendingCount,
            stpRate,
            avgProcessingTime,
            exceptionCount,
            topExceptions,
        };
    }
    catch (error) {
        throw new Error(`End-of-period invoice summary failed: ${error.message}`);
    }
};
exports.orchestrateEndOfPeriodInvoiceSummary = orchestrateEndOfPeriodInvoiceSummary;
// ============================================================================
// COMPOSITE FUNCTIONS - WORKFLOW OPTIMIZATION
// ============================================================================
/**
 * Orchestrates straight-through processing (STP) automation
 * Composes: validateInvoice, performThreeWayMatch, approveInvoice, detectDuplicateInvoices
 *
 * @param invoiceId Invoice ID
 * @param transaction Database transaction
 * @returns STP result
 */
const orchestrateStraightThroughProcessing = async (invoiceId, transaction) => {
    try {
        // Check for duplicates
        const duplicateCheck = await (0, invoice_management_matching_kit_1.detectDuplicateInvoices)(invoiceId, transaction);
        if (duplicateCheck.isDuplicate) {
            return {
                stpSuccess: false,
                stageCompleted: 'duplicate_check',
                autoApproved: false,
                reason: 'Duplicate invoice detected',
            };
        }
        // Validate invoice
        const validation = await (0, invoice_management_matching_kit_1.validateInvoice)(invoiceId, transaction);
        if (!validation.valid) {
            return {
                stpSuccess: false,
                stageCompleted: 'validation',
                autoApproved: false,
                reason: `Validation failed: ${validation.errors.join(', ')}`,
            };
        }
        // Attempt three-way match
        const tolerances = await (0, invoice_management_matching_kit_1.getMatchingTolerance)(transaction);
        const matchResult = await (0, invoice_management_matching_kit_1.performThreeWayMatch)(invoiceId, tolerances, transaction);
        if (matchResult.matchStatus !== 'matched') {
            return {
                stpSuccess: false,
                stageCompleted: 'matching',
                autoApproved: false,
                reason: 'Matching failed - requires manual review',
            };
        }
        // Auto-approve
        await (0, invoice_management_matching_kit_1.approveInvoice)(invoiceId, 'system', transaction);
        // Create audit trail
        await (0, invoice_management_matching_kit_1.createInvoiceAuditTrail)({
            invoiceId,
            action: 'stp_completed',
            performedBy: 'system',
            comments: 'Invoice processed via straight-through processing',
            timestamp: new Date(),
        }, transaction);
        return {
            stpSuccess: true,
            stageCompleted: 'approval',
            autoApproved: true,
        };
    }
    catch (error) {
        throw new Error(`Straight-through processing failed: ${error.message}`);
    }
};
exports.orchestrateStraightThroughProcessing = orchestrateStraightThroughProcessing;
/**
 * Orchestrates batch invoice processing
 * Composes: validateInvoice, performThreeWayMatch, approveInvoice
 *
 * @param invoiceIds Array of invoice IDs
 * @param transaction Database transaction
 * @returns Batch processing results
 */
const orchestrateBatchInvoiceProcessing = async (invoiceIds, transaction) => {
    try {
        const results = [];
        let processed = 0;
        let approved = 0;
        let failed = 0;
        // Process invoices in batches of 50
        const batchSize = 50;
        for (let i = 0; i < invoiceIds.length; i += batchSize) {
            const batch = invoiceIds.slice(i, i + batchSize);
            const batchResults = await Promise.allSettled(batch.map(async (invoiceId) => {
                const stpResult = await (0, exports.orchestrateStraightThroughProcessing)(invoiceId, transaction);
                return { invoiceId, ...stpResult };
            }));
            for (const result of batchResults) {
                if (result.status === 'fulfilled') {
                    processed++;
                    if (result.value.autoApproved) {
                        approved++;
                    }
                    results.push(result.value);
                }
                else {
                    failed++;
                    results.push({
                        invoiceId: null,
                        stpSuccess: false,
                        error: result.reason.message,
                    });
                }
            }
        }
        return { processed, approved, failed, results };
    }
    catch (error) {
        throw new Error(`Batch invoice processing failed: ${error.message}`);
    }
};
exports.orchestrateBatchInvoiceProcessing = orchestrateBatchInvoiceProcessing;
/**
 * Orchestrates invoice workflow optimization recommendations
 * Composes: getInvoiceHistory, getInvoicesPendingApproval, getInvoicesWithVariances
 *
 * @param analysisStartDate Analysis start date
 * @param transaction Database transaction
 * @returns Optimization recommendations
 */
const orchestrateWorkflowOptimizationAnalysis = async (analysisStartDate, transaction) => {
    try {
        // Get invoice history for analysis
        const invoices = await (0, invoice_management_matching_kit_1.getInvoiceHistory)(null, analysisStartDate, new Date());
        // Analyze bottlenecks
        const bottlenecks = identifyWorkflowBottlenecks(invoices);
        // Identify STP opportunities
        const stpOpportunities = identifyStpOpportunities(invoices);
        // Generate recommendations
        const recommendations = generateWorkflowRecommendations(bottlenecks, stpOpportunities);
        // Estimate savings
        const estimatedSavings = calculateEstimatedSavings(recommendations, invoices.length);
        return {
            recommendations,
            bottlenecks,
            stpOpportunities,
            estimatedSavings,
        };
    }
    catch (error) {
        throw new Error(`Workflow optimization analysis failed: ${error.message}`);
    }
};
exports.orchestrateWorkflowOptimizationAnalysis = orchestrateWorkflowOptimizationAnalysis;
/**
 * Helper function to identify workflow bottlenecks
 */
const identifyWorkflowBottlenecks = (invoices) => {
    const bottlenecks = [];
    // Analyze approval delays
    const approvalDelays = invoices
        .filter((inv) => inv.approvedAt && inv.pendingApprovalAt)
        .map((inv) => ({
        invoiceId: inv.invoiceId,
        delayHours: (new Date(inv.approvedAt).getTime() - new Date(inv.pendingApprovalAt).getTime()) / (1000 * 60 * 60),
    }))
        .filter((delay) => delay.delayHours > 48);
    if (approvalDelays.length > 0) {
        bottlenecks.push({
            type: 'approval_delay',
            count: approvalDelays.length,
            avgDelayHours: approvalDelays.reduce((sum, d) => sum + d.delayHours, 0) / approvalDelays.length,
            recommendation: 'Consider increasing approval thresholds or adding more approvers',
        });
    }
    return bottlenecks;
};
/**
 * Helper function to identify STP opportunities
 */
const identifyStpOpportunities = (invoices) => {
    const opportunities = [];
    // Identify suppliers with high manual processing rate
    const supplierStats = {};
    for (const invoice of invoices) {
        if (!supplierStats[invoice.supplierId]) {
            supplierStats[invoice.supplierId] = { total: 0, manual: 0 };
        }
        supplierStats[invoice.supplierId].total++;
        if (!invoice.stpProcessed) {
            supplierStats[invoice.supplierId].manual++;
        }
    }
    for (const [supplierId, stats] of Object.entries(supplierStats)) {
        const manualRate = stats.manual / stats.total;
        if (manualRate > 0.5 && stats.total > 10) {
            opportunities.push({
                type: 'supplier_stp',
                supplierId,
                manualRate,
                invoiceCount: stats.total,
                recommendation: 'Implement EDI or supplier portal for this high-volume supplier',
            });
        }
    }
    return opportunities;
};
/**
 * Helper function to generate workflow recommendations
 */
const generateWorkflowRecommendations = (bottlenecks, stpOpportunities) => {
    const recommendations = [];
    recommendations.push(...bottlenecks.map((b) => ({
        priority: 'high',
        category: 'bottleneck',
        description: b.recommendation,
        impact: b.count,
    })));
    recommendations.push(...stpOpportunities.map((o) => ({
        priority: 'medium',
        category: 'automation',
        description: o.recommendation,
        impact: o.invoiceCount,
    })));
    return recommendations;
};
/**
 * Helper function to calculate estimated savings
 */
const calculateEstimatedSavings = (recommendations, totalInvoices) => {
    // Assume $5 per invoice processing cost reduction
    const savingsPerInvoice = 5;
    const potentialImpact = recommendations.reduce((sum, r) => sum + r.impact, 0);
    return potentialImpact * savingsPerInvoice;
};
//# sourceMappingURL=invoice-automation-workflow-composite.js.map