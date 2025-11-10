"use strict";
/**
 * LOC: INVMGMT001
 * File: /reuse/edwards/financial/invoice-management-matching-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - multer (File upload handling)
 *   - sharp (Image processing)
 *
 * DOWNSTREAM (imported by):
 *   - Backend invoice modules
 *   - Accounts payable services
 *   - Payment processing services
 *   - Procurement modules
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
exports.InvoiceDisputesController = exports.InvoiceMatchingController = exports.InvoicesController = exports.cancelInvoice = exports.getInvoiceHistory = exports.createInvoiceAuditTrail = exports.applyAutomatedCoding = exports.processInvoiceOCR = exports.uploadInvoiceImage = exports.routeInvoice = exports.createInvoiceDispute = exports.releaseInvoiceHold = exports.placeInvoiceHold = exports.approveInvoice = exports.performTwoWayMatch = exports.getMatchingTolerance = exports.getReceiptLine = exports.getPurchaseOrderLine = exports.performThreeWayMatch = exports.calculateInvoiceLineTotals = exports.getApplicableTaxRate = exports.validateInvoiceTax = exports.detectDuplicateInvoices = exports.validateInvoice = exports.getSupplierDetails = exports.createInvoice = exports.createInvoiceLineModel = exports.createInvoiceModel = exports.RouteInvoiceDto = exports.ProcessOCRDto = exports.CreateInvoiceDisputeDto = exports.PlaceInvoiceHoldDto = exports.ApproveInvoiceDto = exports.PerformTwoWayMatchDto = exports.PerformThreeWayMatchDto = exports.ValidateInvoiceDto = exports.CreateInvoiceDto = void 0;
/**
 * File: /reuse/edwards/financial/invoice-management-matching-kit.ts
 * Locator: WC-EDWARDS-INVMGMT-001
 * Purpose: Comprehensive Invoice Management & Matching - JD Edwards EnterpriseOne-level invoice capture, validation, three-way matching, approval workflows
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, Multer 1.x, Sharp 0.32.x
 * Downstream: ../backend/invoices/*, Accounts Payable Services, Payment Processing, Procurement
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+, Multer 1.x, Sharp 0.32.x
 * Exports: 45 functions for invoice capture, validation, three-way matching, two-way matching, approval workflows, holds, disputes, routing, image processing, OCR integration
 *
 * LLM Context: Enterprise-grade invoice management for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive invoice capture, automated validation, three-way matching (PO/Receipt/Invoice), two-way matching,
 * multi-level approval workflows, invoice holds and exceptions, dispute management, intelligent routing, image processing,
 * OCR integration, duplicate detection, tax validation, variance analysis, automated coding, audit trails,
 * and supplier portal integration.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateInvoiceDto = (() => {
    var _a;
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _supplierId_decorators;
    let _supplierId_initializers = [];
    let _supplierId_extraInitializers = [];
    let _supplierSiteId_decorators;
    let _supplierSiteId_initializers = [];
    let _supplierSiteId_extraInitializers = [];
    let _purchaseOrderId_decorators;
    let _purchaseOrderId_initializers = [];
    let _purchaseOrderId_extraInitializers = [];
    let _invoiceAmount_decorators;
    let _invoiceAmount_initializers = [];
    let _invoiceAmount_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _shippingAmount_decorators;
    let _shippingAmount_initializers = [];
    let _shippingAmount_extraInitializers = [];
    let _discountAmount_decorators;
    let _discountAmount_initializers = [];
    let _discountAmount_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    return _a = class CreateInvoiceDto {
            constructor() {
                this.invoiceNumber = __runInitializers(this, _invoiceNumber_initializers, void 0);
                this.invoiceDate = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
                this.dueDate = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.supplierId = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _supplierId_initializers, void 0));
                this.supplierSiteId = (__runInitializers(this, _supplierId_extraInitializers), __runInitializers(this, _supplierSiteId_initializers, void 0));
                this.purchaseOrderId = (__runInitializers(this, _supplierSiteId_extraInitializers), __runInitializers(this, _purchaseOrderId_initializers, void 0));
                this.invoiceAmount = (__runInitializers(this, _purchaseOrderId_extraInitializers), __runInitializers(this, _invoiceAmount_initializers, void 0));
                this.taxAmount = (__runInitializers(this, _invoiceAmount_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
                this.shippingAmount = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _shippingAmount_initializers, void 0));
                this.discountAmount = (__runInitializers(this, _shippingAmount_extraInitializers), __runInitializers(this, _discountAmount_initializers, void 0));
                this.currency = (__runInitializers(this, _discountAmount_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.lines = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
                __runInitializers(this, _lines_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice number', example: 'INV-2024-001' })];
            _invoiceDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice date', example: '2024-01-15' })];
            _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date', example: '2024-02-15' })];
            _supplierId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supplier ID' })];
            _supplierSiteId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supplier site ID' })];
            _purchaseOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order ID', required: false })];
            _invoiceAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice amount' })];
            _taxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax amount', default: 0 })];
            _shippingAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping amount', default: 0 })];
            _discountAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount amount', default: 0 })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD' })];
            _lines_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice lines', type: [Object] })];
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _supplierId_decorators, { kind: "field", name: "supplierId", static: false, private: false, access: { has: obj => "supplierId" in obj, get: obj => obj.supplierId, set: (obj, value) => { obj.supplierId = value; } }, metadata: _metadata }, _supplierId_initializers, _supplierId_extraInitializers);
            __esDecorate(null, null, _supplierSiteId_decorators, { kind: "field", name: "supplierSiteId", static: false, private: false, access: { has: obj => "supplierSiteId" in obj, get: obj => obj.supplierSiteId, set: (obj, value) => { obj.supplierSiteId = value; } }, metadata: _metadata }, _supplierSiteId_initializers, _supplierSiteId_extraInitializers);
            __esDecorate(null, null, _purchaseOrderId_decorators, { kind: "field", name: "purchaseOrderId", static: false, private: false, access: { has: obj => "purchaseOrderId" in obj, get: obj => obj.purchaseOrderId, set: (obj, value) => { obj.purchaseOrderId = value; } }, metadata: _metadata }, _purchaseOrderId_initializers, _purchaseOrderId_extraInitializers);
            __esDecorate(null, null, _invoiceAmount_decorators, { kind: "field", name: "invoiceAmount", static: false, private: false, access: { has: obj => "invoiceAmount" in obj, get: obj => obj.invoiceAmount, set: (obj, value) => { obj.invoiceAmount = value; } }, metadata: _metadata }, _invoiceAmount_initializers, _invoiceAmount_extraInitializers);
            __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
            __esDecorate(null, null, _shippingAmount_decorators, { kind: "field", name: "shippingAmount", static: false, private: false, access: { has: obj => "shippingAmount" in obj, get: obj => obj.shippingAmount, set: (obj, value) => { obj.shippingAmount = value; } }, metadata: _metadata }, _shippingAmount_initializers, _shippingAmount_extraInitializers);
            __esDecorate(null, null, _discountAmount_decorators, { kind: "field", name: "discountAmount", static: false, private: false, access: { has: obj => "discountAmount" in obj, get: obj => obj.discountAmount, set: (obj, value) => { obj.discountAmount = value; } }, metadata: _metadata }, _discountAmount_initializers, _discountAmount_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateInvoiceDto = CreateInvoiceDto;
let ValidateInvoiceDto = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _skipDuplicateCheck_decorators;
    let _skipDuplicateCheck_initializers = [];
    let _skipDuplicateCheck_extraInitializers = [];
    let _skipTaxValidation_decorators;
    let _skipTaxValidation_initializers = [];
    let _skipTaxValidation_extraInitializers = [];
    return _a = class ValidateInvoiceDto {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.skipDuplicateCheck = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _skipDuplicateCheck_initializers, void 0));
                this.skipTaxValidation = (__runInitializers(this, _skipDuplicateCheck_extraInitializers), __runInitializers(this, _skipTaxValidation_initializers, void 0));
                __runInitializers(this, _skipTaxValidation_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID' })];
            _skipDuplicateCheck_decorators = [(0, swagger_1.ApiProperty)({ description: 'Skip duplicate check', default: false })];
            _skipTaxValidation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Skip tax validation', default: false })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _skipDuplicateCheck_decorators, { kind: "field", name: "skipDuplicateCheck", static: false, private: false, access: { has: obj => "skipDuplicateCheck" in obj, get: obj => obj.skipDuplicateCheck, set: (obj, value) => { obj.skipDuplicateCheck = value; } }, metadata: _metadata }, _skipDuplicateCheck_initializers, _skipDuplicateCheck_extraInitializers);
            __esDecorate(null, null, _skipTaxValidation_decorators, { kind: "field", name: "skipTaxValidation", static: false, private: false, access: { has: obj => "skipTaxValidation" in obj, get: obj => obj.skipTaxValidation, set: (obj, value) => { obj.skipTaxValidation = value; } }, metadata: _metadata }, _skipTaxValidation_initializers, _skipTaxValidation_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ValidateInvoiceDto = ValidateInvoiceDto;
let PerformThreeWayMatchDto = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _purchaseOrderId_decorators;
    let _purchaseOrderId_initializers = [];
    let _purchaseOrderId_extraInitializers = [];
    let _receiptId_decorators;
    let _receiptId_initializers = [];
    let _receiptId_extraInitializers = [];
    let _autoApproveWithinTolerance_decorators;
    let _autoApproveWithinTolerance_initializers = [];
    let _autoApproveWithinTolerance_extraInitializers = [];
    return _a = class PerformThreeWayMatchDto {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.purchaseOrderId = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _purchaseOrderId_initializers, void 0));
                this.receiptId = (__runInitializers(this, _purchaseOrderId_extraInitializers), __runInitializers(this, _receiptId_initializers, void 0));
                this.autoApproveWithinTolerance = (__runInitializers(this, _receiptId_extraInitializers), __runInitializers(this, _autoApproveWithinTolerance_initializers, void 0));
                __runInitializers(this, _autoApproveWithinTolerance_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID' })];
            _purchaseOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order ID' })];
            _receiptId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receipt ID' })];
            _autoApproveWithinTolerance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-approve within tolerance', default: true })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _purchaseOrderId_decorators, { kind: "field", name: "purchaseOrderId", static: false, private: false, access: { has: obj => "purchaseOrderId" in obj, get: obj => obj.purchaseOrderId, set: (obj, value) => { obj.purchaseOrderId = value; } }, metadata: _metadata }, _purchaseOrderId_initializers, _purchaseOrderId_extraInitializers);
            __esDecorate(null, null, _receiptId_decorators, { kind: "field", name: "receiptId", static: false, private: false, access: { has: obj => "receiptId" in obj, get: obj => obj.receiptId, set: (obj, value) => { obj.receiptId = value; } }, metadata: _metadata }, _receiptId_initializers, _receiptId_extraInitializers);
            __esDecorate(null, null, _autoApproveWithinTolerance_decorators, { kind: "field", name: "autoApproveWithinTolerance", static: false, private: false, access: { has: obj => "autoApproveWithinTolerance" in obj, get: obj => obj.autoApproveWithinTolerance, set: (obj, value) => { obj.autoApproveWithinTolerance = value; } }, metadata: _metadata }, _autoApproveWithinTolerance_initializers, _autoApproveWithinTolerance_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerformThreeWayMatchDto = PerformThreeWayMatchDto;
let PerformTwoWayMatchDto = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _purchaseOrderId_decorators;
    let _purchaseOrderId_initializers = [];
    let _purchaseOrderId_extraInitializers = [];
    let _autoApproveWithinTolerance_decorators;
    let _autoApproveWithinTolerance_initializers = [];
    let _autoApproveWithinTolerance_extraInitializers = [];
    return _a = class PerformTwoWayMatchDto {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.purchaseOrderId = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _purchaseOrderId_initializers, void 0));
                this.autoApproveWithinTolerance = (__runInitializers(this, _purchaseOrderId_extraInitializers), __runInitializers(this, _autoApproveWithinTolerance_initializers, void 0));
                __runInitializers(this, _autoApproveWithinTolerance_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID' })];
            _purchaseOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order ID' })];
            _autoApproveWithinTolerance_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-approve within tolerance', default: true })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _purchaseOrderId_decorators, { kind: "field", name: "purchaseOrderId", static: false, private: false, access: { has: obj => "purchaseOrderId" in obj, get: obj => obj.purchaseOrderId, set: (obj, value) => { obj.purchaseOrderId = value; } }, metadata: _metadata }, _purchaseOrderId_initializers, _purchaseOrderId_extraInitializers);
            __esDecorate(null, null, _autoApproveWithinTolerance_decorators, { kind: "field", name: "autoApproveWithinTolerance", static: false, private: false, access: { has: obj => "autoApproveWithinTolerance" in obj, get: obj => obj.autoApproveWithinTolerance, set: (obj, value) => { obj.autoApproveWithinTolerance = value; } }, metadata: _metadata }, _autoApproveWithinTolerance_initializers, _autoApproveWithinTolerance_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerformTwoWayMatchDto = PerformTwoWayMatchDto;
let ApproveInvoiceDto = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _approvalLevel_decorators;
    let _approvalLevel_initializers = [];
    let _approvalLevel_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class ApproveInvoiceDto {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.approvalLevel = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _approvalLevel_initializers, void 0));
                this.comments = (__runInitializers(this, _approvalLevel_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID' })];
            _approvalLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval level' })];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Comments', required: false })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _approvalLevel_decorators, { kind: "field", name: "approvalLevel", static: false, private: false, access: { has: obj => "approvalLevel" in obj, get: obj => obj.approvalLevel, set: (obj, value) => { obj.approvalLevel = value; } }, metadata: _metadata }, _approvalLevel_initializers, _approvalLevel_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApproveInvoiceDto = ApproveInvoiceDto;
let PlaceInvoiceHoldDto = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _holdType_decorators;
    let _holdType_initializers = [];
    let _holdType_extraInitializers = [];
    let _holdReason_decorators;
    let _holdReason_initializers = [];
    let _holdReason_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    return _a = class PlaceInvoiceHoldDto {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.holdType = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _holdType_initializers, void 0));
                this.holdReason = (__runInitializers(this, _holdType_extraInitializers), __runInitializers(this, _holdReason_initializers, void 0));
                this.priority = (__runInitializers(this, _holdReason_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID' })];
            _holdType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hold type', enum: ['manual', 'duplicate', 'validation', 'matching', 'approval', 'tax', 'compliance'] })];
            _holdReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Hold reason' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'] })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _holdType_decorators, { kind: "field", name: "holdType", static: false, private: false, access: { has: obj => "holdType" in obj, get: obj => obj.holdType, set: (obj, value) => { obj.holdType = value; } }, metadata: _metadata }, _holdType_initializers, _holdType_extraInitializers);
            __esDecorate(null, null, _holdReason_decorators, { kind: "field", name: "holdReason", static: false, private: false, access: { has: obj => "holdReason" in obj, get: obj => obj.holdReason, set: (obj, value) => { obj.holdReason = value; } }, metadata: _metadata }, _holdReason_initializers, _holdReason_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PlaceInvoiceHoldDto = PlaceInvoiceHoldDto;
let CreateInvoiceDisputeDto = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _disputeType_decorators;
    let _disputeType_initializers = [];
    let _disputeType_extraInitializers = [];
    let _disputeReason_decorators;
    let _disputeReason_initializers = [];
    let _disputeReason_extraInitializers = [];
    let _disputeAmount_decorators;
    let _disputeAmount_initializers = [];
    let _disputeAmount_extraInitializers = [];
    let _notifySupplier_decorators;
    let _notifySupplier_initializers = [];
    let _notifySupplier_extraInitializers = [];
    return _a = class CreateInvoiceDisputeDto {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.disputeType = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _disputeType_initializers, void 0));
                this.disputeReason = (__runInitializers(this, _disputeType_extraInitializers), __runInitializers(this, _disputeReason_initializers, void 0));
                this.disputeAmount = (__runInitializers(this, _disputeReason_extraInitializers), __runInitializers(this, _disputeAmount_initializers, void 0));
                this.notifySupplier = (__runInitializers(this, _disputeAmount_extraInitializers), __runInitializers(this, _notifySupplier_initializers, void 0));
                __runInitializers(this, _notifySupplier_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID' })];
            _disputeType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dispute type', enum: ['price', 'quantity', 'quality', 'delivery', 'duplicate', 'unauthorized', 'other'] })];
            _disputeReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dispute reason' })];
            _disputeAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Disputed amount' })];
            _notifySupplier_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notify supplier', default: true })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _disputeType_decorators, { kind: "field", name: "disputeType", static: false, private: false, access: { has: obj => "disputeType" in obj, get: obj => obj.disputeType, set: (obj, value) => { obj.disputeType = value; } }, metadata: _metadata }, _disputeType_initializers, _disputeType_extraInitializers);
            __esDecorate(null, null, _disputeReason_decorators, { kind: "field", name: "disputeReason", static: false, private: false, access: { has: obj => "disputeReason" in obj, get: obj => obj.disputeReason, set: (obj, value) => { obj.disputeReason = value; } }, metadata: _metadata }, _disputeReason_initializers, _disputeReason_extraInitializers);
            __esDecorate(null, null, _disputeAmount_decorators, { kind: "field", name: "disputeAmount", static: false, private: false, access: { has: obj => "disputeAmount" in obj, get: obj => obj.disputeAmount, set: (obj, value) => { obj.disputeAmount = value; } }, metadata: _metadata }, _disputeAmount_initializers, _disputeAmount_extraInitializers);
            __esDecorate(null, null, _notifySupplier_decorators, { kind: "field", name: "notifySupplier", static: false, private: false, access: { has: obj => "notifySupplier" in obj, get: obj => obj.notifySupplier, set: (obj, value) => { obj.notifySupplier = value; } }, metadata: _metadata }, _notifySupplier_initializers, _notifySupplier_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateInvoiceDisputeDto = CreateInvoiceDisputeDto;
let ProcessOCRDto = (() => {
    var _a;
    let _imageId_decorators;
    let _imageId_initializers = [];
    let _imageId_extraInitializers = [];
    let _provider_decorators;
    let _provider_initializers = [];
    let _provider_extraInitializers = [];
    let _autoCreateInvoice_decorators;
    let _autoCreateInvoice_initializers = [];
    let _autoCreateInvoice_extraInitializers = [];
    return _a = class ProcessOCRDto {
            constructor() {
                this.imageId = __runInitializers(this, _imageId_initializers, void 0);
                this.provider = (__runInitializers(this, _imageId_extraInitializers), __runInitializers(this, _provider_initializers, void 0));
                this.autoCreateInvoice = (__runInitializers(this, _provider_extraInitializers), __runInitializers(this, _autoCreateInvoice_initializers, void 0));
                __runInitializers(this, _autoCreateInvoice_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _imageId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice image ID' })];
            _provider_decorators = [(0, swagger_1.ApiProperty)({ description: 'OCR provider', enum: ['tesseract', 'google', 'aws', 'azure'], default: 'tesseract' })];
            _autoCreateInvoice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-create invoice from OCR', default: false })];
            __esDecorate(null, null, _imageId_decorators, { kind: "field", name: "imageId", static: false, private: false, access: { has: obj => "imageId" in obj, get: obj => obj.imageId, set: (obj, value) => { obj.imageId = value; } }, metadata: _metadata }, _imageId_initializers, _imageId_extraInitializers);
            __esDecorate(null, null, _provider_decorators, { kind: "field", name: "provider", static: false, private: false, access: { has: obj => "provider" in obj, get: obj => obj.provider, set: (obj, value) => { obj.provider = value; } }, metadata: _metadata }, _provider_initializers, _provider_extraInitializers);
            __esDecorate(null, null, _autoCreateInvoice_decorators, { kind: "field", name: "autoCreateInvoice", static: false, private: false, access: { has: obj => "autoCreateInvoice" in obj, get: obj => obj.autoCreateInvoice, set: (obj, value) => { obj.autoCreateInvoice = value; } }, metadata: _metadata }, _autoCreateInvoice_initializers, _autoCreateInvoice_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessOCRDto = ProcessOCRDto;
let RouteInvoiceDto = (() => {
    var _a;
    let _invoiceId_decorators;
    let _invoiceId_initializers = [];
    let _invoiceId_extraInitializers = [];
    let _targetRole_decorators;
    let _targetRole_initializers = [];
    let _targetRole_extraInitializers = [];
    let _targetUser_decorators;
    let _targetUser_initializers = [];
    let _targetUser_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class RouteInvoiceDto {
            constructor() {
                this.invoiceId = __runInitializers(this, _invoiceId_initializers, void 0);
                this.targetRole = (__runInitializers(this, _invoiceId_extraInitializers), __runInitializers(this, _targetRole_initializers, void 0));
                this.targetUser = (__runInitializers(this, _targetRole_extraInitializers), __runInitializers(this, _targetUser_initializers, void 0));
                this.comments = (__runInitializers(this, _targetUser_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice ID' })];
            _targetRole_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target role for routing' })];
            _targetUser_decorators = [(0, swagger_1.ApiProperty)({ description: 'Specific user to route to', required: false })];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Routing comments', required: false })];
            __esDecorate(null, null, _invoiceId_decorators, { kind: "field", name: "invoiceId", static: false, private: false, access: { has: obj => "invoiceId" in obj, get: obj => obj.invoiceId, set: (obj, value) => { obj.invoiceId = value; } }, metadata: _metadata }, _invoiceId_initializers, _invoiceId_extraInitializers);
            __esDecorate(null, null, _targetRole_decorators, { kind: "field", name: "targetRole", static: false, private: false, access: { has: obj => "targetRole" in obj, get: obj => obj.targetRole, set: (obj, value) => { obj.targetRole = value; } }, metadata: _metadata }, _targetRole_initializers, _targetRole_extraInitializers);
            __esDecorate(null, null, _targetUser_decorators, { kind: "field", name: "targetUser", static: false, private: false, access: { has: obj => "targetUser" in obj, get: obj => obj.targetUser, set: (obj, value) => { obj.targetUser = value; } }, metadata: _metadata }, _targetUser_initializers, _targetUser_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RouteInvoiceDto = RouteInvoiceDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Invoices with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Invoice model
 *
 * @example
 * ```typescript
 * const Invoice = createInvoiceModel(sequelize);
 * const invoice = await Invoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   supplierId: 100,
 *   invoiceAmount: 5000.00,
 *   status: 'draft'
 * });
 * ```
 */
const createInvoiceModel = (sequelize) => {
    class Invoice extends sequelize_1.Model {
    }
    Invoice.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        invoiceNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique invoice number',
        },
        invoiceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Invoice date',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Payment due date',
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
        purchaseOrderId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Purchase order reference',
        },
        purchaseOrderNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Purchase order number (denormalized)',
        },
        invoiceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Invoice gross amount',
        },
        taxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Tax amount',
        },
        shippingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Shipping/freight amount',
        },
        discountAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Discount amount',
        },
        netAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Net payable amount',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
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
            comment: 'Amount in base currency',
        },
        status: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Invoice status',
        },
        paymentStatus: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'unpaid',
            comment: 'Payment status',
        },
        matchingStatus: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'unmatched',
            comment: 'Matching status',
        },
        approvalStatus: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'none',
            comment: 'Approval status',
        },
        hasImage: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Has scanned image',
        },
        imageUrl: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Image URL',
        },
        ocrProcessed: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'OCR processing completed',
        },
        ocrConfidence: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: 'OCR confidence score (0-100)',
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
            comment: 'User who created the invoice',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who last updated the invoice',
        },
    }, {
        sequelize,
        tableName: 'invoices',
        timestamps: true,
        indexes: [
            { fields: ['invoiceNumber'], unique: true },
            { fields: ['invoiceDate'] },
            { fields: ['dueDate'] },
            { fields: ['supplierId'] },
            { fields: ['purchaseOrderId'] },
            { fields: ['status'] },
            { fields: ['matchingStatus'] },
            { fields: ['approvalStatus'] },
        ],
    });
    return Invoice;
};
exports.createInvoiceModel = createInvoiceModel;
/**
 * Sequelize model for Invoice Lines with GL coding.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} InvoiceLine model
 *
 * @example
 * ```typescript
 * const InvoiceLine = createInvoiceLineModel(sequelize);
 * const line = await InvoiceLine.create({
 *   invoiceId: 1,
 *   lineNumber: 1,
 *   itemDescription: 'Office supplies',
 *   quantity: 10,
 *   unitPrice: 25.00
 * });
 * ```
 */
const createInvoiceLineModel = (sequelize) => {
    class InvoiceLine extends sequelize_1.Model {
    }
    InvoiceLine.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        invoiceId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Invoice reference',
            references: {
                model: 'invoices',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        lineNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Line number within invoice',
        },
        purchaseOrderLineId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Purchase order line reference',
        },
        itemId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Item/product reference',
        },
        itemCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Item code',
        },
        itemDescription: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Item/service description',
        },
        quantity: {
            type: sequelize_1.DataTypes.DECIMAL(15, 4),
            allowNull: false,
            comment: 'Quantity',
        },
        unitOfMeasure: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'EA',
            comment: 'Unit of measure',
        },
        unitPrice: {
            type: sequelize_1.DataTypes.DECIMAL(20, 4),
            allowNull: false,
            comment: 'Unit price',
        },
        lineAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Line amount (quantity * unitPrice)',
        },
        taxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Tax amount for line',
        },
        discountAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Discount amount for line',
        },
        netAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Net line amount',
        },
        accountCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'GL account code',
        },
        glAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'GL account reference',
        },
        costCenterCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Cost center code',
        },
        projectCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Project code',
        },
        matchedQuantity: {
            type: sequelize_1.DataTypes.DECIMAL(15, 4),
            allowNull: false,
            defaultValue: 0,
            comment: 'Matched quantity from receipt',
        },
        varianceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Variance amount from PO/receipt',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'invoice_lines',
        timestamps: true,
        indexes: [
            { fields: ['invoiceId'] },
            { fields: ['purchaseOrderLineId'] },
            { fields: ['itemId'] },
            { fields: ['accountCode'] },
        ],
    });
    return InvoiceLine;
};
exports.createInvoiceLineModel = createInvoiceLineModel;
// ============================================================================
// BUSINESS LOGIC FUNCTIONS
// ============================================================================
/**
 * Creates a new invoice with lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createInvoice(sequelize, {
 *   invoiceNumber: 'INV-2024-001',
 *   invoiceDate: new Date(),
 *   dueDate: new Date('2024-02-15'),
 *   supplierId: 100,
 *   supplierSiteId: 1,
 *   invoiceAmount: 5000.00,
 *   taxAmount: 400.00,
 *   currency: 'USD',
 *   lines: [...]
 * }, 'user123');
 * ```
 */
const createInvoice = async (sequelize, invoiceData, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const InvoiceLine = (0, exports.createInvoiceLineModel)(sequelize);
    // Get supplier details
    const supplier = await (0, exports.getSupplierDetails)(sequelize, invoiceData.supplierId, transaction);
    // Calculate net amount
    const netAmount = invoiceData.invoiceAmount +
        (invoiceData.taxAmount || 0) +
        (invoiceData.shippingAmount || 0) -
        (invoiceData.discountAmount || 0);
    // Create invoice header
    const invoice = await Invoice.create({
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        supplierId: invoiceData.supplierId,
        supplierName: supplier.name,
        supplierSiteId: invoiceData.supplierSiteId,
        purchaseOrderId: invoiceData.purchaseOrderId || null,
        invoiceAmount: invoiceData.invoiceAmount,
        taxAmount: invoiceData.taxAmount || 0,
        shippingAmount: invoiceData.shippingAmount || 0,
        discountAmount: invoiceData.discountAmount || 0,
        netAmount,
        currency: invoiceData.currency,
        exchangeRate: 1.0,
        baseAmount: netAmount,
        status: 'draft',
        paymentStatus: 'unpaid',
        matchingStatus: 'unmatched',
        approvalStatus: 'none',
        hasImage: false,
        ocrProcessed: false,
        createdBy: userId,
        updatedBy: userId,
    }, { transaction });
    // Create invoice lines
    for (let i = 0; i < invoiceData.lines.length; i++) {
        const lineData = invoiceData.lines[i];
        await InvoiceLine.create({
            invoiceId: invoice.id,
            lineNumber: i + 1,
            purchaseOrderLineId: lineData.purchaseOrderLineId,
            itemId: lineData.itemId,
            itemCode: lineData.itemCode,
            itemDescription: lineData.itemDescription,
            quantity: lineData.quantity,
            unitOfMeasure: lineData.unitOfMeasure,
            unitPrice: lineData.unitPrice,
            lineAmount: lineData.lineAmount,
            taxAmount: lineData.taxAmount || 0,
            discountAmount: lineData.discountAmount || 0,
            netAmount: lineData.netAmount,
            accountCode: lineData.accountCode,
            glAccountId: lineData.glAccountId,
            costCenterCode: lineData.costCenterCode,
            projectCode: lineData.projectCode,
            matchedQuantity: 0,
            varianceAmount: 0,
        }, { transaction });
    }
    return invoice;
};
exports.createInvoice = createInvoice;
/**
 * Retrieves supplier details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Supplier details
 *
 * @example
 * ```typescript
 * const supplier = await getSupplierDetails(sequelize, 100);
 * console.log(supplier.name);
 * ```
 */
const getSupplierDetails = async (sequelize, supplierId, transaction) => {
    const result = await sequelize.query('SELECT * FROM suppliers WHERE id = :supplierId AND is_active = true', {
        replacements: { supplierId },
        type: 'SELECT',
        transaction,
    });
    if (!result || result.length === 0) {
        throw new Error(`Supplier ${supplierId} not found or inactive`);
    }
    return result[0];
};
exports.getSupplierDetails = getSupplierDetails;
/**
 * Validates an invoice against validation rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ValidateInvoiceDto} validationData - Validation parameters
 * @param {string} userId - User performing validation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; errors: string[]; warnings: string[]}>} Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateInvoice(sequelize, {
 *   invoiceId: 1,
 *   skipDuplicateCheck: false
 * }, 'user123');
 * if (!validation.isValid) {
 *   console.log('Errors:', validation.errors);
 * }
 * ```
 */
const validateInvoice = async (sequelize, validationData, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(validationData.invoiceId, { transaction });
    if (!invoice) {
        return { isValid: false, errors: ['Invoice not found'], warnings: [] };
    }
    const errors = [];
    const warnings = [];
    // Required field validation
    if (!invoice.invoiceNumber)
        errors.push('Invoice number is required');
    if (!invoice.invoiceDate)
        errors.push('Invoice date is required');
    if (!invoice.dueDate)
        errors.push('Due date is required');
    if (!invoice.supplierId)
        errors.push('Supplier is required');
    // Date validation
    if (invoice.dueDate < invoice.invoiceDate) {
        errors.push('Due date must be after invoice date');
    }
    // Amount validation
    if (invoice.netAmount <= 0) {
        errors.push('Invoice amount must be greater than zero');
    }
    // Duplicate check
    if (!validationData.skipDuplicateCheck) {
        const duplicates = await (0, exports.detectDuplicateInvoices)(sequelize, validationData.invoiceId, transaction);
        if (duplicates.length > 0) {
            warnings.push(`Potential duplicate invoices found: ${duplicates.length}`);
        }
    }
    // Tax validation
    if (!validationData.skipTaxValidation) {
        const taxValid = await (0, exports.validateInvoiceTax)(sequelize, validationData.invoiceId, transaction);
        if (!taxValid.isValid) {
            warnings.push(`Tax validation issues: ${taxValid.message}`);
        }
    }
    // Line totals validation
    const lineTotals = await (0, exports.calculateInvoiceLineTotals)(sequelize, validationData.invoiceId, transaction);
    if (Math.abs(lineTotals.totalAmount - parseFloat(invoice.invoiceAmount.toString())) > 0.01) {
        errors.push('Invoice header amount does not match line totals');
    }
    const isValid = errors.length === 0;
    // Update invoice status
    if (isValid) {
        await invoice.update({
            status: 'validated',
            updatedBy: userId,
        }, { transaction });
    }
    return { isValid, errors, warnings };
};
exports.validateInvoice = validateInvoice;
/**
 * Detects potential duplicate invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID to check
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} List of potential duplicates
 *
 * @example
 * ```typescript
 * const duplicates = await detectDuplicateInvoices(sequelize, 1);
 * console.log(`Found ${duplicates.length} potential duplicates`);
 * ```
 */
const detectDuplicateInvoices = async (sequelize, invoiceId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    // Check for exact match on invoice number and supplier
    const exactMatches = await Invoice.findAll({
        where: {
            id: { [sequelize_1.Op.ne]: invoiceId },
            invoiceNumber: invoice.invoiceNumber,
            supplierId: invoice.supplierId,
        },
        transaction,
    });
    // Check for fuzzy match on amount and date
    const fuzzyMatches = await Invoice.findAll({
        where: {
            id: { [sequelize_1.Op.ne]: invoiceId },
            supplierId: invoice.supplierId,
            invoiceDate: invoice.invoiceDate,
            netAmount: {
                [sequelize_1.Op.between]: [
                    parseFloat(invoice.netAmount.toString()) * 0.99,
                    parseFloat(invoice.netAmount.toString()) * 1.01,
                ],
            },
        },
        transaction,
    });
    return [...exactMatches, ...fuzzyMatches];
};
exports.detectDuplicateInvoices = detectDuplicateInvoices;
/**
 * Validates invoice tax amounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{isValid: boolean; message: string}>} Validation result
 *
 * @example
 * ```typescript
 * const taxValid = await validateInvoiceTax(sequelize, 1);
 * console.log(taxValid.message);
 * ```
 */
const validateInvoiceTax = async (sequelize, invoiceId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        return { isValid: false, message: 'Invoice not found' };
    }
    // Get applicable tax rate
    const taxRate = await (0, exports.getApplicableTaxRate)(sequelize, invoice.supplierId, invoice.invoiceDate, transaction);
    // Calculate expected tax
    const expectedTax = parseFloat(invoice.invoiceAmount.toString()) * taxRate;
    const actualTax = parseFloat(invoice.taxAmount.toString());
    // Allow 1% variance
    if (Math.abs(expectedTax - actualTax) > expectedTax * 0.01) {
        return {
            isValid: false,
            message: `Tax amount variance: Expected ${expectedTax.toFixed(2)}, Got ${actualTax.toFixed(2)}`,
        };
    }
    return { isValid: true, message: 'Tax validation passed' };
};
exports.validateInvoiceTax = validateInvoiceTax;
/**
 * Gets applicable tax rate for supplier and date.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Date} invoiceDate - Invoice date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Tax rate as decimal
 *
 * @example
 * ```typescript
 * const rate = await getApplicableTaxRate(sequelize, 100, new Date());
 * console.log(`Tax rate: ${rate * 100}%`);
 * ```
 */
const getApplicableTaxRate = async (sequelize, supplierId, invoiceDate, transaction) => {
    const result = await sequelize.query(`SELECT tax_rate FROM tax_rates
     WHERE supplier_id = :supplierId
       AND effective_date <= :invoiceDate
       AND (expiry_date IS NULL OR expiry_date >= :invoiceDate)
     ORDER BY effective_date DESC
     LIMIT 1`, {
        replacements: { supplierId, invoiceDate },
        type: 'SELECT',
        transaction,
    });
    if (result && result.length > 0) {
        return parseFloat(result[0].tax_rate);
    }
    // Default tax rate
    return 0.08; // 8%
};
exports.getApplicableTaxRate = getApplicableTaxRate;
/**
 * Calculates invoice line totals.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{totalAmount: number; totalTax: number; totalNet: number}>} Line totals
 *
 * @example
 * ```typescript
 * const totals = await calculateInvoiceLineTotals(sequelize, 1);
 * console.log(totals.totalAmount);
 * ```
 */
const calculateInvoiceLineTotals = async (sequelize, invoiceId, transaction) => {
    const result = await sequelize.query(`SELECT
       COALESCE(SUM(line_amount), 0) as total_amount,
       COALESCE(SUM(tax_amount), 0) as total_tax,
       COALESCE(SUM(net_amount), 0) as total_net
     FROM invoice_lines
     WHERE invoice_id = :invoiceId`, {
        replacements: { invoiceId },
        type: 'SELECT',
        transaction,
    });
    const row = result[0];
    return {
        totalAmount: parseFloat(row.total_amount),
        totalTax: parseFloat(row.total_tax),
        totalNet: parseFloat(row.total_net),
    };
};
exports.calculateInvoiceLineTotals = calculateInvoiceLineTotals;
/**
 * Performs three-way matching (PO, Receipt, Invoice).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PerformThreeWayMatchDto} matchData - Match parameters
 * @param {string} userId - User performing match
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Match results
 *
 * @example
 * ```typescript
 * const matches = await performThreeWayMatch(sequelize, {
 *   invoiceId: 1,
 *   purchaseOrderId: 10,
 *   receiptId: 5,
 *   autoApproveWithinTolerance: true
 * }, 'user123');
 * ```
 */
const performThreeWayMatch = async (sequelize, matchData, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const InvoiceLine = (0, exports.createInvoiceLineModel)(sequelize);
    const invoice = await Invoice.findByPk(matchData.invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    const invoiceLines = await InvoiceLine.findAll({
        where: { invoiceId: matchData.invoiceId },
        transaction,
    });
    const matchResults = [];
    for (const invLine of invoiceLines) {
        // Get PO line details
        const poLine = await (0, exports.getPurchaseOrderLine)(sequelize, matchData.purchaseOrderId, invLine.purchaseOrderLineId || 0, transaction);
        // Get receipt line details
        const receiptLine = await (0, exports.getReceiptLine)(sequelize, matchData.receiptId, invLine.purchaseOrderLineId || 0, transaction);
        if (!poLine || !receiptLine) {
            matchResults.push({
                invoiceLineId: invLine.id,
                matchStatus: 'exception',
                message: 'No matching PO or receipt line found',
            });
            continue;
        }
        // Calculate variances
        const quantityVariance = parseFloat(invLine.quantity.toString()) - parseFloat(receiptLine.quantity);
        const priceVariance = parseFloat(invLine.unitPrice.toString()) - parseFloat(poLine.unit_price);
        const amountVariance = parseFloat(invLine.netAmount.toString()) - (parseFloat(receiptLine.quantity) * parseFloat(poLine.unit_price));
        // Get matching tolerances
        const tolerance = await (0, exports.getMatchingTolerance)(sequelize, invoice.supplierId, transaction);
        const quantityToleranceExceeded = Math.abs(quantityVariance) > tolerance.quantityTolerance;
        const priceToleranceExceeded = Math.abs(priceVariance) > tolerance.priceTolerance;
        const amountToleranceExceeded = Math.abs(amountVariance) > tolerance.amountTolerance;
        let matchStatus = 'matched';
        if (quantityToleranceExceeded && priceToleranceExceeded) {
            matchStatus = 'both_variance';
        }
        else if (quantityToleranceExceeded) {
            matchStatus = 'quantity_variance';
        }
        else if (priceToleranceExceeded) {
            matchStatus = 'price_variance';
        }
        const toleranceExceeded = quantityToleranceExceeded || priceToleranceExceeded || amountToleranceExceeded;
        // Create match record
        const match = await sequelize.query(`INSERT INTO three_way_matches (
        invoice_id, invoice_line_id, purchase_order_id, purchase_order_line_id,
        receipt_id, receipt_line_id, invoice_quantity, received_quantity, po_quantity,
        invoice_unit_price, po_unit_price, quantity_variance, price_variance,
        amount_variance, match_status, tolerance_exceeded, auto_approved, created_at, updated_at
      ) VALUES (
        :invoiceId, :invoiceLineId, :purchaseOrderId, :purchaseOrderLineId,
        :receiptId, :receiptLineId, :invoiceQuantity, :receivedQuantity, :poQuantity,
        :invoiceUnitPrice, :poUnitPrice, :quantityVariance, :priceVariance,
        :amountVariance, :matchStatus, :toleranceExceeded, :autoApproved, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *`, {
            replacements: {
                invoiceId: matchData.invoiceId,
                invoiceLineId: invLine.id,
                purchaseOrderId: matchData.purchaseOrderId,
                purchaseOrderLineId: invLine.purchaseOrderLineId,
                receiptId: matchData.receiptId,
                receiptLineId: receiptLine.id,
                invoiceQuantity: invLine.quantity,
                receivedQuantity: receiptLine.quantity,
                poQuantity: poLine.quantity,
                invoiceUnitPrice: invLine.unitPrice,
                poUnitPrice: poLine.unit_price,
                quantityVariance,
                priceVariance,
                amountVariance,
                matchStatus,
                toleranceExceeded,
                autoApproved: matchData.autoApproveWithinTolerance && !toleranceExceeded,
            },
            type: 'INSERT',
            transaction,
        });
        matchResults.push(match);
    }
    // Update invoice matching status
    const allMatched = matchResults.every((m) => m.match_status === 'matched' && !m.tolerance_exceeded);
    const newMatchingStatus = allMatched ? 'three_way_matched' : 'variance';
    await invoice.update({
        matchingStatus: newMatchingStatus,
        status: allMatched && matchData.autoApproveWithinTolerance ? 'approved' : 'pending_approval',
        updatedBy: userId,
    }, { transaction });
    return matchResults;
};
exports.performThreeWayMatch = performThreeWayMatch;
/**
 * Gets purchase order line details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} purchaseOrderId - PO ID
 * @param {number} lineId - PO line ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} PO line details
 *
 * @example
 * ```typescript
 * const poLine = await getPurchaseOrderLine(sequelize, 10, 1);
 * console.log(poLine.unit_price);
 * ```
 */
const getPurchaseOrderLine = async (sequelize, purchaseOrderId, lineId, transaction) => {
    const result = await sequelize.query(`SELECT * FROM purchase_order_lines
     WHERE purchase_order_id = :purchaseOrderId AND id = :lineId`, {
        replacements: { purchaseOrderId, lineId },
        type: 'SELECT',
        transaction,
    });
    return result && result.length > 0 ? result[0] : null;
};
exports.getPurchaseOrderLine = getPurchaseOrderLine;
/**
 * Gets receipt line details.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number} poLineId - PO line ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Receipt line details
 *
 * @example
 * ```typescript
 * const receiptLine = await getReceiptLine(sequelize, 5, 1);
 * console.log(receiptLine.quantity);
 * ```
 */
const getReceiptLine = async (sequelize, receiptId, poLineId, transaction) => {
    const result = await sequelize.query(`SELECT * FROM receipt_lines
     WHERE receipt_id = :receiptId AND purchase_order_line_id = :poLineId`, {
        replacements: { receiptId, poLineId },
        type: 'SELECT',
        transaction,
    });
    return result && result.length > 0 ? result[0] : null;
};
exports.getReceiptLine = getReceiptLine;
/**
 * Gets matching tolerance settings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} supplierId - Supplier ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Tolerance settings
 *
 * @example
 * ```typescript
 * const tolerance = await getMatchingTolerance(sequelize, 100);
 * console.log(tolerance.priceTolerance);
 * ```
 */
const getMatchingTolerance = async (sequelize, supplierId, transaction) => {
    const result = await sequelize.query(`SELECT * FROM matching_tolerances
     WHERE (supplier_id = :supplierId OR supplier_id IS NULL)
       AND is_active = true
     ORDER BY supplier_id DESC NULLS LAST
     LIMIT 1`, {
        replacements: { supplierId },
        type: 'SELECT',
        transaction,
    });
    if (result && result.length > 0) {
        const tol = result[0];
        return {
            quantityTolerance: parseFloat(tol.tolerance_value || 0),
            priceTolerance: parseFloat(tol.tolerance_value || 0),
            amountTolerance: parseFloat(tol.tolerance_value || 0),
        };
    }
    // Default tolerances
    return {
        quantityTolerance: 5, // 5 units
        priceTolerance: 0.10, // $0.10
        amountTolerance: 10, // $10
    };
};
exports.getMatchingTolerance = getMatchingTolerance;
/**
 * Performs two-way matching (PO and Invoice only).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PerformTwoWayMatchDto} matchData - Match parameters
 * @param {string} userId - User performing match
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Match results
 *
 * @example
 * ```typescript
 * const matches = await performTwoWayMatch(sequelize, {
 *   invoiceId: 1,
 *   purchaseOrderId: 10,
 *   autoApproveWithinTolerance: true
 * }, 'user123');
 * ```
 */
const performTwoWayMatch = async (sequelize, matchData, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const InvoiceLine = (0, exports.createInvoiceLineModel)(sequelize);
    const invoice = await Invoice.findByPk(matchData.invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    const invoiceLines = await InvoiceLine.findAll({
        where: { invoiceId: matchData.invoiceId },
        transaction,
    });
    const matchResults = [];
    for (const invLine of invoiceLines) {
        const poLine = await (0, exports.getPurchaseOrderLine)(sequelize, matchData.purchaseOrderId, invLine.purchaseOrderLineId || 0, transaction);
        if (!poLine) {
            matchResults.push({
                invoiceLineId: invLine.id,
                matchStatus: 'exception',
                message: 'No matching PO line found',
            });
            continue;
        }
        const quantityVariance = parseFloat(invLine.quantity.toString()) - parseFloat(poLine.quantity);
        const priceVariance = parseFloat(invLine.unitPrice.toString()) - parseFloat(poLine.unit_price);
        const amountVariance = parseFloat(invLine.netAmount.toString()) - (parseFloat(poLine.quantity) * parseFloat(poLine.unit_price));
        const tolerance = await (0, exports.getMatchingTolerance)(sequelize, invoice.supplierId, transaction);
        const quantityToleranceExceeded = Math.abs(quantityVariance) > tolerance.quantityTolerance;
        const priceToleranceExceeded = Math.abs(priceVariance) > tolerance.priceTolerance;
        let matchStatus = 'matched';
        if (quantityToleranceExceeded && priceToleranceExceeded) {
            matchStatus = 'both_variance';
        }
        else if (quantityToleranceExceeded) {
            matchStatus = 'quantity_variance';
        }
        else if (priceToleranceExceeded) {
            matchStatus = 'price_variance';
        }
        const toleranceExceeded = quantityToleranceExceeded || priceToleranceExceeded;
        const match = await sequelize.query(`INSERT INTO two_way_matches (
        invoice_id, invoice_line_id, purchase_order_id, purchase_order_line_id,
        invoice_quantity, po_quantity, invoice_unit_price, po_unit_price,
        quantity_variance, price_variance, amount_variance, match_status,
        tolerance_exceeded, created_at, updated_at
      ) VALUES (
        :invoiceId, :invoiceLineId, :purchaseOrderId, :purchaseOrderLineId,
        :invoiceQuantity, :poQuantity, :invoiceUnitPrice, :poUnitPrice,
        :quantityVariance, :priceVariance, :amountVariance, :matchStatus,
        :toleranceExceeded, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *`, {
            replacements: {
                invoiceId: matchData.invoiceId,
                invoiceLineId: invLine.id,
                purchaseOrderId: matchData.purchaseOrderId,
                purchaseOrderLineId: invLine.purchaseOrderLineId,
                invoiceQuantity: invLine.quantity,
                poQuantity: poLine.quantity,
                invoiceUnitPrice: invLine.unitPrice,
                poUnitPrice: poLine.unit_price,
                quantityVariance,
                priceVariance,
                amountVariance,
                matchStatus,
                toleranceExceeded,
            },
            type: 'INSERT',
            transaction,
        });
        matchResults.push(match);
    }
    const allMatched = matchResults.every((m) => m.match_status === 'matched');
    await invoice.update({
        matchingStatus: allMatched ? 'two_way_matched' : 'variance',
        status: allMatched && matchData.autoApproveWithinTolerance ? 'approved' : 'pending_approval',
        updatedBy: userId,
    }, { transaction });
    return matchResults;
};
exports.performTwoWayMatch = performTwoWayMatch;
/**
 * Approves an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ApproveInvoiceDto} approvalData - Approval data
 * @param {string} userId - User approving the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Approval record
 *
 * @example
 * ```typescript
 * const approval = await approveInvoice(sequelize, {
 *   invoiceId: 1,
 *   approvalLevel: 1,
 *   comments: 'Approved for payment'
 * }, 'manager123');
 * ```
 */
const approveInvoice = async (sequelize, approvalData, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(approvalData.invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    const approval = await sequelize.query(`INSERT INTO invoice_approvals (
      invoice_id, approval_level, approver_id, approver_name, approver_role,
      approval_status, approval_date, comments, escalation_level, created_at, updated_at
    ) VALUES (
      :invoiceId, :approvalLevel, :userId, :userName, :userRole,
      'approved', CURRENT_TIMESTAMP, :comments, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            invoiceId: approvalData.invoiceId,
            approvalLevel: approvalData.approvalLevel,
            userId,
            userName: userId,
            userRole: 'Approver',
            comments: approvalData.comments || '',
        },
        type: 'INSERT',
        transaction,
    });
    await invoice.update({
        approvalStatus: 'approved',
        status: 'approved',
        updatedBy: userId,
    }, { transaction });
    await (0, exports.createInvoiceAuditTrail)(sequelize, approvalData.invoiceId, 'APPROVE', userId, { approvalStatus: invoice.approvalStatus }, { approvalStatus: 'approved' }, transaction);
    return approval;
};
exports.approveInvoice = approveInvoice;
/**
 * Places a hold on an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PlaceInvoiceHoldDto} holdData - Hold data
 * @param {string} userId - User placing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Hold record
 *
 * @example
 * ```typescript
 * const hold = await placeInvoiceHold(sequelize, {
 *   invoiceId: 1,
 *   holdType: 'validation',
 *   holdReason: 'Missing documentation',
 *   priority: 'high'
 * }, 'user123');
 * ```
 */
const placeInvoiceHold = async (sequelize, holdData, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(holdData.invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    const hold = await sequelize.query(`INSERT INTO invoice_holds (
      invoice_id, hold_type, hold_reason, hold_category, hold_date,
      hold_by, priority, auto_release, created_at, updated_at
    ) VALUES (
      :invoiceId, :holdType, :holdReason, :holdCategory, CURRENT_DATE,
      :userId, :priority, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            invoiceId: holdData.invoiceId,
            holdType: holdData.holdType,
            holdReason: holdData.holdReason,
            holdCategory: holdData.holdType,
            userId,
            priority: holdData.priority,
        },
        type: 'INSERT',
        transaction,
    });
    await invoice.update({ status: 'on_hold', updatedBy: userId }, { transaction });
    await (0, exports.createInvoiceAuditTrail)(sequelize, holdData.invoiceId, 'HOLD', userId, { status: invoice.status }, { status: 'on_hold', holdReason: holdData.holdReason }, transaction);
    return hold;
};
exports.placeInvoiceHold = placeInvoiceHold;
/**
 * Releases a hold on an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} holdId - Hold ID
 * @param {string} releaseNotes - Release notes
 * @param {string} userId - User releasing the hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Released hold
 *
 * @example
 * ```typescript
 * const released = await releaseInvoiceHold(sequelize, 1, 'Documentation received', 'user123');
 * ```
 */
const releaseInvoiceHold = async (sequelize, holdId, releaseNotes, userId, transaction) => {
    const result = await sequelize.query(`UPDATE invoice_holds
     SET release_date = CURRENT_DATE,
         released_by = :userId,
         release_notes = :releaseNotes,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :holdId
     RETURNING *`, {
        replacements: { holdId, userId, releaseNotes },
        type: 'UPDATE',
        transaction,
    });
    if (!result || result.length === 0) {
        throw new Error('Hold not found');
    }
    const hold = result[0];
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(hold.invoice_id, { transaction });
    if (invoice) {
        await invoice.update({ status: 'validated', updatedBy: userId }, { transaction });
        await (0, exports.createInvoiceAuditTrail)(sequelize, hold.invoice_id, 'RELEASE', userId, { status: 'on_hold' }, { status: 'validated', releaseNotes }, transaction);
    }
    return hold;
};
exports.releaseInvoiceHold = releaseInvoiceHold;
/**
 * Creates an invoice dispute.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateInvoiceDisputeDto} disputeData - Dispute data
 * @param {string} userId - User creating the dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Dispute record
 *
 * @example
 * ```typescript
 * const dispute = await createInvoiceDispute(sequelize, {
 *   invoiceId: 1,
 *   disputeType: 'price',
 *   disputeReason: 'Price does not match PO',
 *   disputeAmount: 500.00,
 *   notifySupplier: true
 * }, 'user123');
 * ```
 */
const createInvoiceDispute = async (sequelize, disputeData, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(disputeData.invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    const dispute = await sequelize.query(`INSERT INTO invoice_disputes (
      invoice_id, dispute_type, dispute_reason, dispute_amount, dispute_date,
      disputed_by, status, supplier_notified, created_at, updated_at
    ) VALUES (
      :invoiceId, :disputeType, :disputeReason, :disputeAmount, CURRENT_DATE,
      :userId, 'open', :supplierNotified, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            invoiceId: disputeData.invoiceId,
            disputeType: disputeData.disputeType,
            disputeReason: disputeData.disputeReason,
            disputeAmount: disputeData.disputeAmount,
            userId,
            supplierNotified: disputeData.notifySupplier || false,
        },
        type: 'INSERT',
        transaction,
    });
    await invoice.update({ status: 'disputed', updatedBy: userId }, { transaction });
    if (disputeData.notifySupplier) {
        // In production, send notification to supplier
        // await notifySupplier(invoice.supplierId, dispute);
    }
    await (0, exports.createInvoiceAuditTrail)(sequelize, disputeData.invoiceId, 'DISPUTE', userId, { status: invoice.status }, { status: 'disputed', disputeReason: disputeData.disputeReason }, transaction);
    return dispute;
};
exports.createInvoiceDispute = createInvoiceDispute;
/**
 * Routes invoice to specified role or user.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {RouteInvoiceDto} routingData - Routing data
 * @param {string} userId - User performing routing
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Routing record
 *
 * @example
 * ```typescript
 * const routing = await routeInvoice(sequelize, {
 *   invoiceId: 1,
 *   targetRole: 'accounts_payable',
 *   targetUser: 'ap_clerk_001',
 *   comments: 'Please review urgently'
 * }, 'user123');
 * ```
 */
const routeInvoice = async (sequelize, routingData, userId, transaction) => {
    // Get current routing step
    const currentStep = await sequelize.query(`SELECT COALESCE(MAX(routing_step), 0) as max_step
     FROM invoice_routings
     WHERE invoice_id = :invoiceId`, {
        replacements: { invoiceId: routingData.invoiceId },
        type: 'SELECT',
        transaction,
    });
    const nextStep = (currentStep[0].max_step || 0) + 1;
    const routing = await sequelize.query(`INSERT INTO invoice_routings (
      invoice_id, routing_step, routing_role, routing_user, routing_date,
      status, comments, created_at, updated_at
    ) VALUES (
      :invoiceId, :routingStep, :routingRole, :routingUser, CURRENT_TIMESTAMP,
      'pending', :comments, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            invoiceId: routingData.invoiceId,
            routingStep: nextStep,
            routingRole: routingData.targetRole,
            routingUser: routingData.targetUser || null,
            comments: routingData.comments || '',
        },
        type: 'INSERT',
        transaction,
    });
    return routing;
};
exports.routeInvoice = routeInvoice;
/**
 * Uploads invoice image/document.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {any} file - Uploaded file
 * @param {string} userId - User uploading the file
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Image record
 *
 * @example
 * ```typescript
 * const image = await uploadInvoiceImage(sequelize, 1, file, 'user123');
 * console.log(image.filePath);
 * ```
 */
const uploadInvoiceImage = async (sequelize, invoiceId, file, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    const filePath = `/uploads/invoices/${invoiceId}/${file.filename}`;
    const thumbnailPath = `/uploads/invoices/${invoiceId}/thumb_${file.filename}`;
    const image = await sequelize.query(`INSERT INTO invoice_images (
      invoice_id, file_name, file_path, file_size, mime_type,
      upload_date, uploaded_by, page_count, thumbnail_path,
      ocr_processed, created_at, updated_at
    ) VALUES (
      :invoiceId, :fileName, :filePath, :fileSize, :mimeType,
      CURRENT_TIMESTAMP, :userId, 1, :thumbnailPath,
      false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            invoiceId,
            fileName: file.originalname,
            filePath,
            fileSize: file.size,
            mimeType: file.mimetype,
            userId,
            thumbnailPath,
        },
        type: 'INSERT',
        transaction,
    });
    await invoice.update({
        hasImage: true,
        imageUrl: filePath,
        updatedBy: userId,
    }, { transaction });
    return image;
};
exports.uploadInvoiceImage = uploadInvoiceImage;
/**
 * Processes invoice image with OCR.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessOCRDto} ocrData - OCR processing data
 * @param {string} userId - User initiating OCR
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<OCRResult>} OCR result
 *
 * @example
 * ```typescript
 * const ocrResult = await processInvoiceOCR(sequelize, {
 *   imageId: 1,
 *   provider: 'google',
 *   autoCreateInvoice: true
 * }, 'user123');
 * console.log(ocrResult.confidence);
 * ```
 */
const processInvoiceOCR = async (sequelize, ocrData, userId, transaction) => {
    // Get image record
    const imageResult = await sequelize.query('SELECT * FROM invoice_images WHERE id = :imageId', {
        replacements: { imageId: ocrData.imageId },
        type: 'SELECT',
        transaction,
    });
    if (!imageResult || imageResult.length === 0) {
        throw new Error('Invoice image not found');
    }
    const image = imageResult[0];
    // In production, call actual OCR service (Google Vision, AWS Textract, etc.)
    // For now, return mock OCR result
    const ocrResult = {
        invoiceNumber: 'INV-2024-OCR-001',
        invoiceDate: '2024-01-15',
        dueDate: '2024-02-15',
        supplierName: 'ACME Corporation',
        supplierAddress: '123 Main St, City, ST 12345',
        totalAmount: 5000.00,
        taxAmount: 400.00,
        lineItems: [
            { description: 'Product A', quantity: 10, unitPrice: 450.00, amount: 4500.00 },
            { description: 'Product B', quantity: 2, unitPrice: 250.00, amount: 500.00 },
        ],
        confidence: 95.5,
        rawData: {},
    };
    // Update image record with OCR data
    await sequelize.query(`UPDATE invoice_images
     SET ocr_processed = true,
         ocr_text = :ocrText,
         ocr_data = :ocrData,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :imageId`, {
        replacements: {
            imageId: ocrData.imageId,
            ocrText: JSON.stringify(ocrResult),
            ocrData: JSON.stringify(ocrResult.rawData),
        },
        type: 'UPDATE',
        transaction,
    });
    // Update invoice with OCR confidence
    await sequelize.query(`UPDATE invoices
     SET ocr_processed = true,
         ocr_confidence = :confidence,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :invoiceId`, {
        replacements: {
            invoiceId: image.invoice_id,
            confidence: ocrResult.confidence,
        },
        type: 'UPDATE',
        transaction,
    });
    return ocrResult;
};
exports.processInvoiceOCR = processInvoiceOCR;
/**
 * Applies automated GL coding rules to invoice lines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyAutomatedCoding(sequelize, 1);
 * ```
 */
const applyAutomatedCoding = async (sequelize, invoiceId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const InvoiceLine = (0, exports.createInvoiceLineModel)(sequelize);
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    const lines = await InvoiceLine.findAll({
        where: { invoiceId },
        transaction,
    });
    for (const line of lines) {
        // Get coding rule for supplier/item
        const rule = await sequelize.query(`SELECT * FROM invoice_coding_rules
       WHERE (supplier_id = :supplierId OR supplier_id IS NULL)
         AND (item_category_id = :itemCategoryId OR item_category_id IS NULL)
         AND is_active = true
       ORDER BY priority DESC, supplier_id DESC NULLS LAST
       LIMIT 1`, {
            replacements: {
                supplierId: invoice.supplierId,
                itemCategoryId: line.itemId || null,
            },
            type: 'SELECT',
            transaction,
        });
        if (rule && rule.length > 0) {
            const codingRule = rule[0];
            await line.update({
                glAccountId: codingRule.default_gl_account_id,
                accountCode: codingRule.default_account_code,
                costCenterCode: codingRule.default_cost_center,
                projectCode: codingRule.default_project,
            }, { transaction });
        }
    }
};
exports.applyAutomatedCoding = applyAutomatedCoding;
/**
 * Creates invoice audit trail entry.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} action - Action performed
 * @param {string} userId - User performing action
 * @param {Record<string, any>} oldValues - Old values
 * @param {Record<string, any>} newValues - New values
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Audit trail entry
 *
 * @example
 * ```typescript
 * await createInvoiceAuditTrail(sequelize, 1, 'APPROVE', 'user123',
 *   { status: 'pending' }, { status: 'approved' });
 * ```
 */
const createInvoiceAuditTrail = async (sequelize, invoiceId, action, userId, oldValues, newValues, transaction) => {
    const audit = await sequelize.query(`INSERT INTO invoice_audit_trails (
      invoice_id, action, action_date, user_id, user_name,
      old_values, new_values, ip_address, created_at, updated_at
    ) VALUES (
      :invoiceId, :action, CURRENT_TIMESTAMP, :userId, :userName,
      :oldValues, :newValues, :ipAddress, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING *`, {
        replacements: {
            invoiceId,
            action,
            userId,
            userName: userId,
            oldValues: JSON.stringify(oldValues),
            newValues: JSON.stringify(newValues),
            ipAddress: '127.0.0.1',
        },
        type: 'INSERT',
        transaction,
    });
    return audit;
};
exports.createInvoiceAuditTrail = createInvoiceAuditTrail;
/**
 * Retrieves invoice history with audit trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoice audit trail
 *
 * @example
 * ```typescript
 * const history = await getInvoiceHistory(sequelize, 1);
 * console.log(history.length);
 * ```
 */
const getInvoiceHistory = async (sequelize, invoiceId, transaction) => {
    const result = await sequelize.query(`SELECT * FROM invoice_audit_trails
     WHERE invoice_id = :invoiceId
     ORDER BY action_date DESC`, {
        replacements: { invoiceId },
        type: 'SELECT',
        transaction,
    });
    return result;
};
exports.getInvoiceHistory = getInvoiceHistory;
/**
 * Cancels an invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} cancelReason - Cancellation reason
 * @param {string} userId - User cancelling the invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cancelled invoice
 *
 * @example
 * ```typescript
 * const cancelled = await cancelInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
const cancelInvoice = async (sequelize, invoiceId, cancelReason, userId, transaction) => {
    const Invoice = (0, exports.createInvoiceModel)(sequelize);
    const invoice = await Invoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error('Invoice not found');
    }
    if (invoice.paymentStatus === 'paid') {
        throw new Error('Cannot cancel paid invoice');
    }
    await invoice.update({
        status: 'cancelled',
        updatedBy: userId,
        metadata: { ...invoice.metadata, cancelReason, cancelledAt: new Date() },
    }, { transaction });
    await (0, exports.createInvoiceAuditTrail)(sequelize, invoiceId, 'CANCEL', userId, { status: invoice.status }, { status: 'cancelled', cancelReason }, transaction);
    return invoice;
};
exports.cancelInvoice = cancelInvoice;
// ============================================================================
// NESTJS CONTROLLERS
// ============================================================================
/**
 * NestJS Controller for Invoice operations.
 */
let InvoicesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Invoices'), (0, common_1.Controller)('api/v1/invoices'), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _validate_decorators;
    let _approve_decorators;
    let _placeHold_decorators;
    let _getHistory_decorators;
    let _uploadImage_decorators;
    var InvoicesController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(createDto, userId) {
            return (0, exports.createInvoice)(this.sequelize, createDto, userId);
        }
        async validate(id, userId) {
            return (0, exports.validateInvoice)(this.sequelize, { invoiceId: id }, userId);
        }
        async approve(approvalDto, userId) {
            return (0, exports.approveInvoice)(this.sequelize, approvalDto, userId);
        }
        async placeHold(holdDto, userId) {
            return (0, exports.placeInvoiceHold)(this.sequelize, holdDto, userId);
        }
        async getHistory(id) {
            return (0, exports.getInvoiceHistory)(this.sequelize, id);
        }
        async uploadImage(id, file, userId) {
            return (0, exports.uploadInvoiceImage)(this.sequelize, id, file, userId);
        }
    };
    __setFunctionName(_classThis, "InvoicesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create new invoice' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Invoice created successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' })];
        _validate_decorators = [(0, common_1.Post)(':id/validate'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Validate invoice' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Validation result' })];
        _approve_decorators = [(0, common_1.Post)(':id/approve'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Approve invoice' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice approved' })];
        _placeHold_decorators = [(0, common_1.Post)(':id/hold'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Place invoice on hold' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Hold placed' })];
        _getHistory_decorators = [(0, common_1.Get)(':id/history'), (0, swagger_1.ApiOperation)({ summary: 'Get invoice history' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Invoice history retrieved' })];
        _uploadImage_decorators = [(0, common_1.Post)(':id/upload'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Upload invoice image' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Image uploaded' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _validate_decorators, { kind: "method", name: "validate", static: false, private: false, access: { has: obj => "validate" in obj, get: obj => obj.validate }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approve_decorators, { kind: "method", name: "approve", static: false, private: false, access: { has: obj => "approve" in obj, get: obj => obj.approve }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _placeHold_decorators, { kind: "method", name: "placeHold", static: false, private: false, access: { has: obj => "placeHold" in obj, get: obj => obj.placeHold }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHistory_decorators, { kind: "method", name: "getHistory", static: false, private: false, access: { has: obj => "getHistory" in obj, get: obj => obj.getHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadImage_decorators, { kind: "method", name: "uploadImage", static: false, private: false, access: { has: obj => "uploadImage" in obj, get: obj => obj.uploadImage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvoicesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvoicesController = _classThis;
})();
exports.InvoicesController = InvoicesController;
/**
 * NestJS Controller for Invoice Matching operations.
 */
let InvoiceMatchingController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Invoice Matching'), (0, common_1.Controller)('api/v1/invoice-matching'), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _threeWayMatch_decorators;
    let _twoWayMatch_decorators;
    var InvoiceMatchingController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async threeWayMatch(matchDto, userId) {
            return (0, exports.performThreeWayMatch)(this.sequelize, matchDto, userId);
        }
        async twoWayMatch(matchDto, userId) {
            return (0, exports.performTwoWayMatch)(this.sequelize, matchDto, userId);
        }
    };
    __setFunctionName(_classThis, "InvoiceMatchingController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _threeWayMatch_decorators = [(0, common_1.Post)('three-way'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Perform three-way match' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Match completed' })];
        _twoWayMatch_decorators = [(0, common_1.Post)('two-way'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, swagger_1.ApiOperation)({ summary: 'Perform two-way match' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Match completed' })];
        __esDecorate(_classThis, null, _threeWayMatch_decorators, { kind: "method", name: "threeWayMatch", static: false, private: false, access: { has: obj => "threeWayMatch" in obj, get: obj => obj.threeWayMatch }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _twoWayMatch_decorators, { kind: "method", name: "twoWayMatch", static: false, private: false, access: { has: obj => "twoWayMatch" in obj, get: obj => obj.twoWayMatch }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvoiceMatchingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvoiceMatchingController = _classThis;
})();
exports.InvoiceMatchingController = InvoiceMatchingController;
/**
 * NestJS Controller for Invoice Dispute operations.
 */
let InvoiceDisputesController = (() => {
    let _classDecorators = [(0, swagger_1.ApiTags)('Invoice Disputes'), (0, common_1.Controller)('api/v1/invoice-disputes'), (0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    var InvoiceDisputesController = _classThis = class {
        constructor(sequelize) {
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
        }
        async create(disputeDto, userId) {
            return (0, exports.createInvoiceDispute)(this.sequelize, disputeDto, userId);
        }
    };
    __setFunctionName(_classThis, "InvoiceDisputesController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, swagger_1.ApiOperation)({ summary: 'Create invoice dispute' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Dispute created' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvoiceDisputesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvoiceDisputesController = _classThis;
})();
exports.InvoiceDisputesController = InvoiceDisputesController;
//# sourceMappingURL=invoice-management-matching-kit.js.map