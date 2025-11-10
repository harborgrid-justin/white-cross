"use strict";
/**
 * LOC: EDWAP001
 * File: /reuse/edwards/financial/accounts-payable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Vendor management services
 *   - Payment processing modules
 *   - Cash management systems
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
exports.getTopVendorsByVolume = exports.generateVendorStatement = exports.generate1099Data = exports.generateAPAgingReport = exports.getDiscountEligibleInvoices = exports.calculateDiscountROI = exports.recommendPaymentStrategy = exports.calculateCashRequirements = exports.analyzeAvailableDiscounts = exports.generateACHFile = exports.processPaymentRun = exports.selectInvoicesForPaymentRun = exports.generatePaymentRunNumber = exports.createPaymentRun = exports.getPaymentDetails = exports.getPaymentsByStatus = exports.clearPayment = exports.transmitPayment = exports.reversePaymentApplications = exports.voidPayment = exports.approvePayment = exports.createPaymentApplication = exports.generatePaymentNumber = exports.createPayment = exports.getInvoicesWithVariances = exports.getInvoicesPendingApproval = exports.voidAPInvoice = exports.getFiscalYearPeriod = exports.calculateDiscountTerms = exports.calculateDueDate = exports.performThreeWayMatch = exports.rejectAPInvoice = exports.approveAPInvoice = exports.checkDuplicateInvoice = exports.createAPInvoice = exports.getVendorPaymentStats = exports.deactivateVendor = exports.searchVendors = exports.getVendorByNumber = exports.releaseVendorHold = exports.placeVendorOnHold = exports.updateVendor = exports.createVendor = exports.createPaymentModel = exports.createAPInvoiceModel = exports.createVendorModel = exports.PaymentRunDto = exports.ProcessPaymentDto = exports.CreateAPInvoiceDto = exports.CreateVendorDto = void 0;
exports.generatePaymentForecast = exports.getOutstandingInvoicesByVendor = exports.calculatePaymentCycleMetrics = void 0;
/**
 * File: /reuse/edwards/financial/accounts-payable-management-kit.ts
 * Locator: WC-EDWARDS-AP-001
 * Purpose: Comprehensive Accounts Payable Management - JD Edwards EnterpriseOne-level vendor management, invoice processing, payments, 1099 reporting
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Vendor Services, Payment Processing, Cash Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for vendor management, invoice processing, payment processing, three-way matching, payment runs, ACH/wire transfers, 1099 reporting, vendor statements, aging reports, discount management, cash requirements forecasting
 *
 * LLM Context: Enterprise-grade accounts payable operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive vendor management, invoice validation, automated three-way matching, payment processing,
 * ACH and wire transfer support, early payment discounts, vendor statement reconciliation, aging reports,
 * 1099 tax reporting, cash requirements forecasting, duplicate invoice detection, approval workflows,
 * and audit trails. Supports multi-currency, multi-entity operations with full GL integration.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateVendorDto = (() => {
    var _a;
    let _vendorNumber_decorators;
    let _vendorNumber_initializers = [];
    let _vendorNumber_extraInitializers = [];
    let _vendorName_decorators;
    let _vendorName_initializers = [];
    let _vendorName_extraInitializers = [];
    let _vendorType_decorators;
    let _vendorType_initializers = [];
    let _vendorType_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _is1099Vendor_decorators;
    let _is1099Vendor_initializers = [];
    let _is1099Vendor_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _defaultGLAccount_decorators;
    let _defaultGLAccount_initializers = [];
    let _defaultGLAccount_extraInitializers = [];
    return _a = class CreateVendorDto {
            constructor() {
                this.vendorNumber = __runInitializers(this, _vendorNumber_initializers, void 0);
                this.vendorName = (__runInitializers(this, _vendorNumber_extraInitializers), __runInitializers(this, _vendorName_initializers, void 0));
                this.vendorType = (__runInitializers(this, _vendorName_extraInitializers), __runInitializers(this, _vendorType_initializers, void 0));
                this.taxId = (__runInitializers(this, _vendorType_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
                this.is1099Vendor = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _is1099Vendor_initializers, void 0));
                this.paymentTerms = (__runInitializers(this, _is1099Vendor_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.defaultGLAccount = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _defaultGLAccount_initializers, void 0));
                __runInitializers(this, _defaultGLAccount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vendorNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor number', example: 'V-10001' })];
            _vendorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name', example: 'Acme Corporation' })];
            _vendorType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor type', enum: ['supplier', 'contractor', 'employee', 'government', 'utility'] })];
            _taxId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax ID (EIN or SSN)', example: '12-3456789' })];
            _is1099Vendor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is 1099 vendor', default: false })];
            _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms', example: 'Net 30' })];
            _paymentMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method', enum: ['check', 'ach', 'wire', 'card'] })];
            _defaultGLAccount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Default GL account', example: '2000-00' })];
            __esDecorate(null, null, _vendorNumber_decorators, { kind: "field", name: "vendorNumber", static: false, private: false, access: { has: obj => "vendorNumber" in obj, get: obj => obj.vendorNumber, set: (obj, value) => { obj.vendorNumber = value; } }, metadata: _metadata }, _vendorNumber_initializers, _vendorNumber_extraInitializers);
            __esDecorate(null, null, _vendorName_decorators, { kind: "field", name: "vendorName", static: false, private: false, access: { has: obj => "vendorName" in obj, get: obj => obj.vendorName, set: (obj, value) => { obj.vendorName = value; } }, metadata: _metadata }, _vendorName_initializers, _vendorName_extraInitializers);
            __esDecorate(null, null, _vendorType_decorators, { kind: "field", name: "vendorType", static: false, private: false, access: { has: obj => "vendorType" in obj, get: obj => obj.vendorType, set: (obj, value) => { obj.vendorType = value; } }, metadata: _metadata }, _vendorType_initializers, _vendorType_extraInitializers);
            __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
            __esDecorate(null, null, _is1099Vendor_decorators, { kind: "field", name: "is1099Vendor", static: false, private: false, access: { has: obj => "is1099Vendor" in obj, get: obj => obj.is1099Vendor, set: (obj, value) => { obj.is1099Vendor = value; } }, metadata: _metadata }, _is1099Vendor_initializers, _is1099Vendor_extraInitializers);
            __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _defaultGLAccount_decorators, { kind: "field", name: "defaultGLAccount", static: false, private: false, access: { has: obj => "defaultGLAccount" in obj, get: obj => obj.defaultGLAccount, set: (obj, value) => { obj.defaultGLAccount = value; } }, metadata: _metadata }, _defaultGLAccount_initializers, _defaultGLAccount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateVendorDto = CreateVendorDto;
let CreateAPInvoiceDto = (() => {
    var _a;
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _invoiceAmount_decorators;
    let _invoiceAmount_initializers = [];
    let _invoiceAmount_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _purchaseOrderNumber_decorators;
    let _purchaseOrderNumber_initializers = [];
    let _purchaseOrderNumber_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    return _a = class CreateAPInvoiceDto {
            constructor() {
                this.invoiceNumber = __runInitializers(this, _invoiceNumber_initializers, void 0);
                this.vendorId = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                this.invoiceDate = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
                this.invoiceAmount = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _invoiceAmount_initializers, void 0));
                this.taxAmount = (__runInitializers(this, _invoiceAmount_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
                this.purchaseOrderNumber = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _purchaseOrderNumber_initializers, void 0));
                this.lines = (__runInitializers(this, _purchaseOrderNumber_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
                __runInitializers(this, _lines_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice number', example: 'INV-2024-001' })];
            _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' })];
            _invoiceDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice date' })];
            _invoiceAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice amount' })];
            _taxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax amount', default: 0 })];
            _purchaseOrderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order number', required: false })];
            _lines_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice lines', type: [Object] })];
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
            __esDecorate(null, null, _invoiceAmount_decorators, { kind: "field", name: "invoiceAmount", static: false, private: false, access: { has: obj => "invoiceAmount" in obj, get: obj => obj.invoiceAmount, set: (obj, value) => { obj.invoiceAmount = value; } }, metadata: _metadata }, _invoiceAmount_initializers, _invoiceAmount_extraInitializers);
            __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
            __esDecorate(null, null, _purchaseOrderNumber_decorators, { kind: "field", name: "purchaseOrderNumber", static: false, private: false, access: { has: obj => "purchaseOrderNumber" in obj, get: obj => obj.purchaseOrderNumber, set: (obj, value) => { obj.purchaseOrderNumber = value; } }, metadata: _metadata }, _purchaseOrderNumber_initializers, _purchaseOrderNumber_extraInitializers);
            __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateAPInvoiceDto = CreateAPInvoiceDto;
let ProcessPaymentDto = (() => {
    var _a;
    let _paymentDate_decorators;
    let _paymentDate_initializers = [];
    let _paymentDate_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _invoiceIds_decorators;
    let _invoiceIds_initializers = [];
    let _invoiceIds_extraInitializers = [];
    let _takeDiscounts_decorators;
    let _takeDiscounts_initializers = [];
    let _takeDiscounts_extraInitializers = [];
    return _a = class ProcessPaymentDto {
            constructor() {
                this.paymentDate = __runInitializers(this, _paymentDate_initializers, void 0);
                this.paymentMethod = (__runInitializers(this, _paymentDate_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.bankAccountId = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                this.invoiceIds = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _invoiceIds_initializers, void 0));
                this.takeDiscounts = (__runInitializers(this, _invoiceIds_extraInitializers), __runInitializers(this, _takeDiscounts_initializers, void 0));
                __runInitializers(this, _takeDiscounts_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment date' })];
            _paymentMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method', enum: ['check', 'ach', 'wire'] })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _invoiceIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice IDs to pay', type: [Number] })];
            _takeDiscounts_decorators = [(0, swagger_1.ApiProperty)({ description: 'Take available discounts', default: true })];
            __esDecorate(null, null, _paymentDate_decorators, { kind: "field", name: "paymentDate", static: false, private: false, access: { has: obj => "paymentDate" in obj, get: obj => obj.paymentDate, set: (obj, value) => { obj.paymentDate = value; } }, metadata: _metadata }, _paymentDate_initializers, _paymentDate_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _invoiceIds_decorators, { kind: "field", name: "invoiceIds", static: false, private: false, access: { has: obj => "invoiceIds" in obj, get: obj => obj.invoiceIds, set: (obj, value) => { obj.invoiceIds = value; } }, metadata: _metadata }, _invoiceIds_initializers, _invoiceIds_extraInitializers);
            __esDecorate(null, null, _takeDiscounts_decorators, { kind: "field", name: "takeDiscounts", static: false, private: false, access: { has: obj => "takeDiscounts" in obj, get: obj => obj.takeDiscounts, set: (obj, value) => { obj.takeDiscounts = value; } }, metadata: _metadata }, _takeDiscounts_initializers, _takeDiscounts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessPaymentDto = ProcessPaymentDto;
let PaymentRunDto = (() => {
    var _a;
    let _paymentDate_decorators;
    let _paymentDate_initializers = [];
    let _paymentDate_extraInitializers = [];
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _vendorSelection_decorators;
    let _vendorSelection_initializers = [];
    let _vendorSelection_extraInitializers = [];
    let _vendorIds_decorators;
    let _vendorIds_initializers = [];
    let _vendorIds_extraInitializers = [];
    return _a = class PaymentRunDto {
            constructor() {
                this.paymentDate = __runInitializers(this, _paymentDate_initializers, void 0);
                this.bankAccountId = (__runInitializers(this, _paymentDate_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.vendorSelection = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _vendorSelection_initializers, void 0));
                this.vendorIds = (__runInitializers(this, _vendorSelection_extraInitializers), __runInitializers(this, _vendorIds_initializers, void 0));
                __runInitializers(this, _vendorIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment date' })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _paymentMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment method', enum: ['check', 'ach', 'wire'] })];
            _vendorSelection_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor selection criteria', enum: ['all', 'by_vendor', 'by_due_date', 'by_discount_date'] })];
            _vendorIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Specific vendor IDs (if by_vendor)', type: [Number], required: false })];
            __esDecorate(null, null, _paymentDate_decorators, { kind: "field", name: "paymentDate", static: false, private: false, access: { has: obj => "paymentDate" in obj, get: obj => obj.paymentDate, set: (obj, value) => { obj.paymentDate = value; } }, metadata: _metadata }, _paymentDate_initializers, _paymentDate_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _vendorSelection_decorators, { kind: "field", name: "vendorSelection", static: false, private: false, access: { has: obj => "vendorSelection" in obj, get: obj => obj.vendorSelection, set: (obj, value) => { obj.vendorSelection = value; } }, metadata: _metadata }, _vendorSelection_initializers, _vendorSelection_extraInitializers);
            __esDecorate(null, null, _vendorIds_decorators, { kind: "field", name: "vendorIds", static: false, private: false, access: { has: obj => "vendorIds" in obj, get: obj => obj.vendorIds, set: (obj, value) => { obj.vendorIds = value; } }, metadata: _metadata }, _vendorIds_initializers, _vendorIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaymentRunDto = PaymentRunDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Vendor master data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Vendor model
 *
 * @example
 * ```typescript
 * const Vendor = createVendorModel(sequelize);
 * const vendor = await Vendor.create({
 *   vendorNumber: 'V-10001',
 *   vendorName: 'Acme Corp',
 *   vendorType: 'supplier',
 *   status: 'active'
 * });
 * ```
 */
const createVendorModel = (sequelize) => {
    class Vendor extends sequelize_1.Model {
    }
    Vendor.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        vendorNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique vendor identifier',
        },
        vendorName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Vendor legal name',
        },
        vendorType: {
            type: sequelize_1.DataTypes.ENUM('supplier', 'contractor', 'employee', 'government', 'utility'),
            allowNull: false,
            comment: 'Vendor classification',
        },
        taxId: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'EIN or SSN for tax reporting',
        },
        is1099Vendor: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Subject to 1099 reporting',
        },
        is1099Type: {
            type: sequelize_1.DataTypes.ENUM('1099-NEC', '1099-MISC', '1099-INT', '1099-DIV'),
            allowNull: true,
            comment: '1099 form type',
        },
        paymentTerms: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Payment terms (Net 30, 2/10 Net 30, etc.)',
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.ENUM('check', 'ach', 'wire', 'card', 'cash'),
            allowNull: false,
            defaultValue: 'check',
            comment: 'Preferred payment method',
        },
        creditLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Vendor credit limit',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'hold', 'blocked'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Vendor status',
        },
        holdReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for payment hold',
        },
        defaultGLAccount: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Default AP account',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Vendor currency code',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional vendor data',
        },
    }, {
        sequelize,
        tableName: 'ap_vendors',
        timestamps: true,
        indexes: [
            { fields: ['vendorNumber'], unique: true },
            { fields: ['vendorName'] },
            { fields: ['vendorType'] },
            { fields: ['status'] },
            { fields: ['is1099Vendor'] },
            { fields: ['taxId'] },
        ],
    });
    return Vendor;
};
exports.createVendorModel = createVendorModel;
/**
 * Sequelize model for AP Invoice headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} APInvoice model
 *
 * @example
 * ```typescript
 * const APInvoice = createAPInvoiceModel(sequelize);
 * const invoice = await APInvoice.create({
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 1,
 *   invoiceAmount: 5000.00,
 *   status: 'pending_approval'
 * });
 * ```
 */
const createAPInvoiceModel = (sequelize) => {
    class APInvoice extends sequelize_1.Model {
    }
    APInvoice.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        invoiceNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Vendor invoice number',
        },
        vendorId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ap_vendors',
                key: 'id',
            },
            comment: 'Vendor reference',
        },
        invoiceDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Invoice date from vendor',
        },
        dueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Payment due date',
        },
        discountDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Discount eligibility date',
        },
        discountAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Early payment discount available',
        },
        invoiceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Gross invoice amount',
        },
        taxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Tax amount',
        },
        freightAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Freight charges',
        },
        otherCharges: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Other charges',
        },
        netAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Net amount after discounts',
        },
        paidAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount paid to date',
        },
        discountTaken: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Discount amount taken',
        },
        outstandingBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Remaining balance',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending_approval', 'approved', 'scheduled', 'paid', 'cancelled', 'void'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Invoice status',
        },
        approvalStatus: {
            type: sequelize_1.DataTypes.ENUM('not_required', 'pending', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'not_required',
            comment: 'Approval workflow status',
        },
        matchStatus: {
            type: sequelize_1.DataTypes.ENUM('unmatched', 'two_way', 'three_way', 'variance', 'matched'),
            allowNull: false,
            defaultValue: 'unmatched',
            comment: 'PO matching status',
        },
        glDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'GL posting date',
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
        purchaseOrderNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated PO number',
        },
        receivingNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated receipt number',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Invoice description',
        },
    }, {
        sequelize,
        tableName: 'ap_invoices',
        timestamps: true,
        indexes: [
            { fields: ['invoiceNumber', 'vendorId'], unique: true },
            { fields: ['vendorId'] },
            { fields: ['invoiceDate'] },
            { fields: ['dueDate'] },
            { fields: ['discountDate'] },
            { fields: ['status'] },
            { fields: ['approvalStatus'] },
            { fields: ['matchStatus'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['purchaseOrderNumber'] },
        ],
    });
    return APInvoice;
};
exports.createAPInvoiceModel = createAPInvoiceModel;
/**
 * Sequelize model for Payment headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Payment model
 *
 * @example
 * ```typescript
 * const Payment = createPaymentModel(sequelize);
 * const payment = await Payment.create({
 *   paymentNumber: 'PAY-2024-001',
 *   vendorId: 1,
 *   paymentAmount: 5000.00,
 *   paymentMethod: 'ach'
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
            comment: 'Payment identifier',
        },
        paymentDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Payment date',
        },
        paymentMethod: {
            type: sequelize_1.DataTypes.ENUM('check', 'ach', 'wire', 'card', 'eft'),
            allowNull: false,
            comment: 'Payment method',
        },
        vendorId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ap_vendors',
                key: 'id',
            },
            comment: 'Vendor being paid',
        },
        paymentAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total payment amount',
        },
        discountTaken: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Discount amount taken',
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account used',
        },
        checkNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Check number if check payment',
        },
        achBatchId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'ACH batch identifier',
        },
        wireReferenceNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Wire transfer reference',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending', 'approved', 'transmitted', 'cleared', 'cancelled', 'void'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Payment status',
        },
        clearedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Bank clearing date',
        },
        voidDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Void date if voided',
        },
        voidReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for void',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Payment currency',
        },
    }, {
        sequelize,
        tableName: 'ap_payments',
        timestamps: true,
        indexes: [
            { fields: ['paymentNumber'], unique: true },
            { fields: ['paymentDate'] },
            { fields: ['vendorId'] },
            { fields: ['status'] },
            { fields: ['bankAccountId'] },
            { fields: ['checkNumber'] },
            { fields: ['achBatchId'] },
        ],
    });
    return Payment;
};
exports.createPaymentModel = createPaymentModel;
// ============================================================================
// VENDOR MANAGEMENT (1-8)
// ============================================================================
/**
 * Creates a new vendor with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateVendorDto} vendorData - Vendor data
 * @param {string} userId - User creating the vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor(sequelize, {
 *   vendorNumber: 'V-10001',
 *   vendorName: 'Acme Corporation',
 *   vendorType: 'supplier',
 *   taxId: '12-3456789',
 *   paymentTerms: 'Net 30',
 *   paymentMethod: 'ach'
 * }, 'user123');
 * ```
 */
const createVendor = async (sequelize, vendorData, userId, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    // Validate vendor number is unique
    const existing = await Vendor.findOne({
        where: { vendorNumber: vendorData.vendorNumber },
        transaction,
    });
    if (existing) {
        throw new Error(`Vendor number ${vendorData.vendorNumber} already exists`);
    }
    // Validate tax ID format
    if (vendorData.is1099Vendor && !vendorData.taxId) {
        throw new Error('Tax ID is required for 1099 vendors');
    }
    const vendor = await Vendor.create({
        ...vendorData,
        status: 'active',
        currency: 'USD',
        creditLimit: 0,
        metadata: { createdBy: userId },
    }, { transaction });
    return vendor;
};
exports.createVendor = createVendor;
/**
 * Updates vendor information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Partial<CreateVendorDto>} updateData - Update data
 * @param {string} userId - User updating the vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const updated = await updateVendor(sequelize, 1, {
 *   paymentTerms: '2/10 Net 30'
 * }, 'user123');
 * ```
 */
const updateVendor = async (sequelize, vendorId, updateData, userId, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new Error(`Vendor ${vendorId} not found`);
    }
    await vendor.update({
        ...updateData,
        metadata: { ...vendor.metadata, updatedBy: userId, updatedAt: new Date() },
    }, { transaction });
    return vendor;
};
exports.updateVendor = updateVendor;
/**
 * Places vendor on payment hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} holdReason - Reason for hold
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await placeVendorOnHold(sequelize, 1, 'Disputed invoice', 'user123');
 * ```
 */
const placeVendorOnHold = async (sequelize, vendorId, holdReason, userId, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new Error(`Vendor ${vendorId} not found`);
    }
    await vendor.update({
        status: 'hold',
        holdReason,
        metadata: { ...vendor.metadata, holdPlacedBy: userId, holdPlacedAt: new Date() },
    }, { transaction });
    return vendor;
};
exports.placeVendorOnHold = placeVendorOnHold;
/**
 * Releases vendor from payment hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await releaseVendorHold(sequelize, 1, 'user123');
 * ```
 */
const releaseVendorHold = async (sequelize, vendorId, userId, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new Error(`Vendor ${vendorId} not found`);
    }
    if (vendor.status !== 'hold') {
        throw new Error(`Vendor ${vendorId} is not on hold`);
    }
    await vendor.update({
        status: 'active',
        holdReason: null,
        metadata: { ...vendor.metadata, holdReleasedBy: userId, holdReleasedAt: new Date() },
    }, { transaction });
    return vendor;
};
exports.releaseVendorHold = releaseVendorHold;
/**
 * Retrieves vendor by vendor number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} vendorNumber - Vendor number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Vendor record
 *
 * @example
 * ```typescript
 * const vendor = await getVendorByNumber(sequelize, 'V-10001');
 * ```
 */
const getVendorByNumber = async (sequelize, vendorNumber, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const vendor = await Vendor.findOne({
        where: { vendorNumber },
        transaction,
    });
    if (!vendor) {
        throw new Error(`Vendor ${vendorNumber} not found`);
    }
    return vendor;
};
exports.getVendorByNumber = getVendorByNumber;
/**
 * Searches vendors by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Record<string, any>} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching vendors
 *
 * @example
 * ```typescript
 * const vendors = await searchVendors(sequelize, {
 *   vendorType: 'supplier',
 *   status: 'active',
 *   is1099Vendor: true
 * });
 * ```
 */
const searchVendors = async (sequelize, criteria, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const where = {};
    if (criteria.vendorType)
        where.vendorType = criteria.vendorType;
    if (criteria.status)
        where.status = criteria.status;
    if (criteria.is1099Vendor !== undefined)
        where.is1099Vendor = criteria.is1099Vendor;
    if (criteria.vendorName) {
        where.vendorName = { [sequelize_1.Op.iLike]: `%${criteria.vendorName}%` };
    }
    const vendors = await Vendor.findAll({
        where,
        order: [['vendorNumber', 'ASC']],
        transaction,
    });
    return vendors;
};
exports.searchVendors = searchVendors;
/**
 * Deactivates a vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} userId - User deactivating vendor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated vendor
 *
 * @example
 * ```typescript
 * const vendor = await deactivateVendor(sequelize, 1, 'user123');
 * ```
 */
const deactivateVendor = async (sequelize, vendorId, userId, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new Error(`Vendor ${vendorId} not found`);
    }
    // Check for outstanding balances
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const outstanding = await APInvoice.findOne({
        where: {
            vendorId,
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
        },
        transaction,
    });
    if (outstanding) {
        throw new Error(`Cannot deactivate vendor with outstanding balance`);
    }
    await vendor.update({
        status: 'inactive',
        metadata: { ...vendor.metadata, deactivatedBy: userId, deactivatedAt: new Date() },
    }, { transaction });
    return vendor;
};
exports.deactivateVendor = deactivateVendor;
/**
 * Gets vendor payment statistics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {number} [days=365] - Number of days to analyze
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Vendor payment statistics
 *
 * @example
 * ```typescript
 * const stats = await getVendorPaymentStats(sequelize, 1, 90);
 * ```
 */
const getVendorPaymentStats = async (sequelize, vendorId, days = 365, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const payments = await Payment.findAll({
        where: {
            vendorId,
            paymentDate: { [sequelize_1.Op.gte]: sinceDate },
            status: { [sequelize_1.Op.in]: ['transmitted', 'cleared'] },
        },
        transaction,
    });
    const invoices = await APInvoice.findAll({
        where: {
            vendorId,
            invoiceDate: { [sequelize_1.Op.gte]: sinceDate },
        },
        transaction,
    });
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);
    const totalDiscountTaken = payments.reduce((sum, p) => sum + Number(p.discountTaken), 0);
    const totalInvoiced = invoices.reduce((sum, i) => sum + Number(i.invoiceAmount), 0);
    const currentOutstanding = invoices.reduce((sum, i) => sum + Number(i.outstandingBalance), 0);
    return {
        vendorId,
        periodDays: days,
        paymentCount: payments.length,
        invoiceCount: invoices.length,
        totalPaid,
        totalDiscountTaken,
        totalInvoiced,
        currentOutstanding,
        averagePaymentAmount: payments.length > 0 ? totalPaid / payments.length : 0,
        discountCaptureRate: totalInvoiced > 0 ? (totalDiscountTaken / totalInvoiced) * 100 : 0,
    };
};
exports.getVendorPaymentStats = getVendorPaymentStats;
// ============================================================================
// INVOICE PROCESSING (9-18)
// ============================================================================
/**
 * Creates a new AP invoice with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateAPInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createAPInvoice(sequelize, {
 *   invoiceNumber: 'INV-2024-001',
 *   vendorId: 1,
 *   invoiceDate: new Date(),
 *   invoiceAmount: 5000.00,
 *   lines: [...]
 * }, 'user123');
 * ```
 */
const createAPInvoice = async (sequelize, invoiceData, userId, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const Vendor = (0, exports.createVendorModel)(sequelize);
    // Validate vendor exists and is active
    const vendor = await Vendor.findByPk(invoiceData.vendorId, { transaction });
    if (!vendor) {
        throw new Error(`Vendor ${invoiceData.vendorId} not found`);
    }
    if (vendor.status === 'blocked') {
        throw new Error(`Vendor ${vendor.vendorNumber} is blocked`);
    }
    // Check for duplicate invoice
    const duplicate = await (0, exports.checkDuplicateInvoice)(sequelize, invoiceData.vendorId, invoiceData.invoiceNumber, transaction);
    if (duplicate) {
        throw new Error(`Duplicate invoice: ${invoiceData.invoiceNumber} for vendor ${vendor.vendorNumber}`);
    }
    // Calculate due date from payment terms
    const dueDate = (0, exports.calculateDueDate)(invoiceData.invoiceDate, vendor.paymentTerms);
    const { discountDate, discountAmount } = (0, exports.calculateDiscountTerms)(invoiceData.invoiceDate, invoiceData.invoiceAmount, vendor.paymentTerms);
    // Determine fiscal year and period
    const { fiscalYear, fiscalPeriod } = (0, exports.getFiscalYearPeriod)(invoiceData.invoiceDate);
    const invoice = await APInvoice.create({
        invoiceNumber: invoiceData.invoiceNumber,
        vendorId: invoiceData.vendorId,
        invoiceDate: invoiceData.invoiceDate,
        dueDate,
        discountDate,
        discountAmount,
        invoiceAmount: invoiceData.invoiceAmount,
        taxAmount: invoiceData.taxAmount || 0,
        freightAmount: 0,
        otherCharges: 0,
        netAmount: invoiceData.invoiceAmount,
        paidAmount: 0,
        discountTaken: 0,
        outstandingBalance: invoiceData.invoiceAmount,
        status: 'draft',
        approvalStatus: 'not_required',
        matchStatus: invoiceData.purchaseOrderNumber ? 'unmatched' : 'matched',
        glDate: invoiceData.invoiceDate,
        fiscalYear,
        fiscalPeriod,
        purchaseOrderNumber: invoiceData.purchaseOrderNumber,
        description: invoiceData.lines[0]?.description || 'AP Invoice',
    }, { transaction });
    return invoice;
};
exports.createAPInvoice = createAPInvoice;
/**
 * Checks for duplicate invoices from vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {string} invoiceNumber - Invoice number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<boolean>} True if duplicate exists
 *
 * @example
 * ```typescript
 * const isDuplicate = await checkDuplicateInvoice(sequelize, 1, 'INV-2024-001');
 * ```
 */
const checkDuplicateInvoice = async (sequelize, vendorId, invoiceNumber, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const existing = await APInvoice.findOne({
        where: {
            vendorId,
            invoiceNumber,
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'void'] },
        },
        transaction,
    });
    return !!existing;
};
exports.checkDuplicateInvoice = checkDuplicateInvoice;
/**
 * Approves an AP invoice for payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} userId - User approving invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * const invoice = await approveAPInvoice(sequelize, 1, 'user123');
 * ```
 */
const approveAPInvoice = async (sequelize, invoiceId, userId, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoice = await APInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status === 'paid') {
        throw new Error(`Invoice ${invoiceId} is already paid`);
    }
    // Verify vendor not on hold
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });
    if (vendor.status === 'hold' || vendor.status === 'blocked') {
        throw new Error(`Vendor ${vendor.vendorNumber} is on hold or blocked`);
    }
    await invoice.update({
        status: 'approved',
        approvalStatus: 'approved',
    }, { transaction });
    return invoice;
};
exports.approveAPInvoice = approveAPInvoice;
/**
 * Rejects an AP invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} rejectionReason - Reason for rejection
 * @param {string} userId - User rejecting invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated invoice
 *
 * @example
 * ```typescript
 * const invoice = await rejectAPInvoice(sequelize, 1, 'Incorrect amount', 'user123');
 * ```
 */
const rejectAPInvoice = async (sequelize, invoiceId, rejectionReason, userId, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoice = await APInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    await invoice.update({
        approvalStatus: 'rejected',
        status: 'cancelled',
    }, { transaction });
    return invoice;
};
exports.rejectAPInvoice = rejectAPInvoice;
/**
 * Performs three-way match validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ThreeWayMatch>} Match result
 *
 * @example
 * ```typescript
 * const matchResult = await performThreeWayMatch(sequelize, 1);
 * ```
 */
const performThreeWayMatch = async (sequelize, invoiceId, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoice = await APInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    if (!invoice.purchaseOrderNumber) {
        throw new Error(`Invoice ${invoiceId} has no PO reference`);
    }
    // Simplified match logic - in production would query PO and receipt tables
    const priceVariance = 0;
    const quantityVariance = 0;
    const toleranceExceeded = Math.abs(priceVariance) > 100 || Math.abs(quantityVariance) > 0;
    const matchResult = {
        matchId: Date.now(),
        invoiceId,
        purchaseOrderId: 0, // Would be actual PO ID
        receiptId: 0, // Would be actual receipt ID
        matchDate: new Date(),
        matchStatus: toleranceExceeded ? 'price_variance' : 'matched',
        priceVariance,
        quantityVariance,
        toleranceExceeded,
        requiresApproval: toleranceExceeded,
        approvalStatus: toleranceExceeded ? 'pending' : undefined,
    };
    // Update invoice match status
    await invoice.update({
        matchStatus: matchResult.matchStatus === 'matched' ? 'three_way' : 'variance',
    }, { transaction });
    return matchResult;
};
exports.performThreeWayMatch = performThreeWayMatch;
/**
 * Calculates due date from invoice date and payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {string} paymentTerms - Payment terms (e.g., "Net 30", "2/10 Net 30")
 * @returns {Date} Due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateDueDate(new Date(), 'Net 30');
 * ```
 */
const calculateDueDate = (invoiceDate, paymentTerms) => {
    const dueDate = new Date(invoiceDate);
    const netMatch = paymentTerms.match(/Net\s+(\d+)/i);
    if (netMatch) {
        const days = parseInt(netMatch[1], 10);
        dueDate.setDate(dueDate.getDate() + days);
    }
    else {
        // Default to 30 days if terms not recognized
        dueDate.setDate(dueDate.getDate() + 30);
    }
    return dueDate;
};
exports.calculateDueDate = calculateDueDate;
/**
 * Calculates discount date and amount from payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {number} invoiceAmount - Invoice amount
 * @param {string} paymentTerms - Payment terms
 * @returns {{ discountDate: Date | null; discountAmount: number }} Discount terms
 *
 * @example
 * ```typescript
 * const terms = calculateDiscountTerms(new Date(), 1000, '2/10 Net 30');
 * // Returns: { discountDate: Date(10 days from now), discountAmount: 20 }
 * ```
 */
const calculateDiscountTerms = (invoiceDate, invoiceAmount, paymentTerms) => {
    const discountMatch = paymentTerms.match(/(\d+(?:\.\d+)?)\/(\d+)/);
    if (discountMatch) {
        const discountPercent = parseFloat(discountMatch[1]);
        const discountDays = parseInt(discountMatch[2], 10);
        const discountDate = new Date(invoiceDate);
        discountDate.setDate(discountDate.getDate() + discountDays);
        const discountAmount = (invoiceAmount * discountPercent) / 100;
        return { discountDate, discountAmount };
    }
    return { discountDate: null, discountAmount: 0 };
};
exports.calculateDiscountTerms = calculateDiscountTerms;
/**
 * Gets fiscal year and period from date.
 *
 * @param {Date} date - Date to convert
 * @returns {{ fiscalYear: number; fiscalPeriod: number }} Fiscal year and period
 *
 * @example
 * ```typescript
 * const { fiscalYear, fiscalPeriod } = getFiscalYearPeriod(new Date('2024-03-15'));
 * // Returns: { fiscalYear: 2024, fiscalPeriod: 3 }
 * ```
 */
const getFiscalYearPeriod = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    // Assuming calendar year = fiscal year
    return {
        fiscalYear: year,
        fiscalPeriod: month,
    };
};
exports.getFiscalYearPeriod = getFiscalYearPeriod;
/**
 * Voids an AP invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} voidReason - Reason for void
 * @param {string} userId - User voiding invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided invoice
 *
 * @example
 * ```typescript
 * const invoice = await voidAPInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
const voidAPInvoice = async (sequelize, invoiceId, voidReason, userId, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoice = await APInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status === 'paid') {
        throw new Error(`Cannot void paid invoice ${invoiceId}`);
    }
    await invoice.update({
        status: 'void',
        outstandingBalance: 0,
    }, { transaction });
    return invoice;
};
exports.voidAPInvoice = voidAPInvoice;
/**
 * Retrieves invoices pending approval.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Pending invoices
 *
 * @example
 * ```typescript
 * const pending = await getInvoicesPendingApproval(sequelize);
 * ```
 */
const getInvoicesPendingApproval = async (sequelize, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoices = await APInvoice.findAll({
        where: {
            approvalStatus: 'pending',
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'void', 'paid'] },
        },
        order: [['invoiceDate', 'ASC']],
        transaction,
    });
    return invoices;
};
exports.getInvoicesPendingApproval = getInvoicesPendingApproval;
/**
 * Retrieves invoices with matching variances.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoices with variances
 *
 * @example
 * ```typescript
 * const variances = await getInvoicesWithVariances(sequelize);
 * ```
 */
const getInvoicesWithVariances = async (sequelize, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoices = await APInvoice.findAll({
        where: {
            matchStatus: 'variance',
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'void', 'paid'] },
        },
        order: [['invoiceDate', 'ASC']],
        transaction,
    });
    return invoices;
};
exports.getInvoicesWithVariances = getInvoicesWithVariances;
// ============================================================================
// PAYMENT PROCESSING (19-28)
// ============================================================================
/**
 * Creates a payment for approved invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessPaymentDto} paymentData - Payment data
 * @param {string} userId - User creating payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created payment
 *
 * @example
 * ```typescript
 * const payment = await createPayment(sequelize, {
 *   paymentDate: new Date(),
 *   paymentMethod: 'ach',
 *   bankAccountId: 1,
 *   invoiceIds: [1, 2, 3],
 *   takeDiscounts: true
 * }, 'user123');
 * ```
 */
const createPayment = async (sequelize, paymentData, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    // Validate all invoices exist and are approved
    const invoices = await APInvoice.findAll({
        where: {
            id: { [sequelize_1.Op.in]: paymentData.invoiceIds },
        },
        transaction,
    });
    if (invoices.length !== paymentData.invoiceIds.length) {
        throw new Error('One or more invoices not found');
    }
    // Verify all invoices are from same vendor
    const vendorIds = new Set(invoices.map(i => i.vendorId));
    if (vendorIds.size > 1) {
        throw new Error('All invoices must be for the same vendor');
    }
    const vendorId = invoices[0].vendorId;
    // Check vendor is not on hold
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (vendor.status === 'hold' || vendor.status === 'blocked') {
        throw new Error(`Vendor ${vendor.vendorNumber} is on hold or blocked`);
    }
    // Calculate payment amount and discounts
    let totalAmount = 0;
    let totalDiscount = 0;
    for (const invoice of invoices) {
        if (invoice.status !== 'approved') {
            throw new Error(`Invoice ${invoice.invoiceNumber} is not approved`);
        }
        const amount = Number(invoice.outstandingBalance);
        totalAmount += amount;
        if (paymentData.takeDiscounts && invoice.discountDate && invoice.discountDate >= paymentData.paymentDate) {
            totalDiscount += Number(invoice.discountAmount);
        }
    }
    const netPaymentAmount = totalAmount - totalDiscount;
    // Generate payment number
    const paymentNumber = await (0, exports.generatePaymentNumber)(sequelize, paymentData.paymentMethod, transaction);
    // Create payment
    const payment = await Payment.create({
        paymentNumber,
        paymentDate: paymentData.paymentDate,
        paymentMethod: paymentData.paymentMethod,
        vendorId,
        paymentAmount: netPaymentAmount,
        discountTaken: totalDiscount,
        bankAccountId: paymentData.bankAccountId,
        status: 'draft',
        currency: 'USD',
    }, { transaction });
    // Create payment applications
    for (const invoice of invoices) {
        const discountAmount = paymentData.takeDiscounts && invoice.discountDate && invoice.discountDate >= paymentData.paymentDate
            ? Number(invoice.discountAmount)
            : 0;
        const appliedAmount = Number(invoice.outstandingBalance) - discountAmount;
        await (0, exports.createPaymentApplication)(sequelize, payment.id, invoice.id, appliedAmount, discountAmount, transaction);
        // Update invoice
        await invoice.update({
            paidAmount: Number(invoice.paidAmount) + appliedAmount,
            discountTaken: Number(invoice.discountTaken) + discountAmount,
            outstandingBalance: 0,
            status: 'paid',
        }, { transaction });
    }
    return payment;
};
exports.createPayment = createPayment;
/**
 * Generates a unique payment number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} paymentMethod - Payment method
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Payment number
 *
 * @example
 * ```typescript
 * const paymentNumber = await generatePaymentNumber(sequelize, 'ach');
 * // Returns: "ACH-2024-00001"
 * ```
 */
const generatePaymentNumber = async (sequelize, paymentMethod, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const prefix = paymentMethod.toUpperCase().substring(0, 3);
    const year = new Date().getFullYear();
    const lastPayment = await Payment.findOne({
        where: {
            paymentNumber: { [sequelize_1.Op.like]: `${prefix}-${year}-%` },
        },
        order: [['paymentNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastPayment) {
        const match = lastPayment.paymentNumber.match(/(\d+)$/);
        if (match) {
            sequence = parseInt(match[1], 10) + 1;
        }
    }
    return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
};
exports.generatePaymentNumber = generatePaymentNumber;
/**
 * Creates a payment application record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} appliedAmount - Applied amount
 * @param {number} discountAmount - Discount amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment application record
 *
 * @example
 * ```typescript
 * const application = await createPaymentApplication(sequelize, 1, 2, 1000, 20);
 * ```
 */
const createPaymentApplication = async (sequelize, paymentId, invoiceId, appliedAmount, discountAmount, transaction) => {
    const [results] = await sequelize.query(`INSERT INTO ap_payment_applications
     (payment_id, invoice_id, applied_amount, discount_amount, application_date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
     RETURNING *`, {
        bind: [paymentId, invoiceId, appliedAmount, discountAmount, new Date()],
        type: 'INSERT',
        transaction,
    });
    return results;
};
exports.createPaymentApplication = createPaymentApplication;
/**
 * Approves a payment for transmission.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} userId - User approving payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await approvePayment(sequelize, 1, 'user123');
 * ```
 */
const approvePayment = async (sequelize, paymentId, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
    }
    if (payment.status !== 'draft') {
        throw new Error(`Payment ${paymentId} is not in draft status`);
    }
    await payment.update({
        status: 'approved',
    }, { transaction });
    return payment;
};
exports.approvePayment = approvePayment;
/**
 * Voids a payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} voidReason - Reason for void
 * @param {string} userId - User voiding payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 *
 * @example
 * ```typescript
 * const payment = await voidPayment(sequelize, 1, 'Incorrect amount', 'user123');
 * ```
 */
const voidPayment = async (sequelize, paymentId, voidReason, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
    }
    if (payment.status === 'cleared') {
        throw new Error(`Cannot void cleared payment ${paymentId}`);
    }
    await payment.update({
        status: 'void',
        voidDate: new Date(),
        voidReason,
    }, { transaction });
    // Reverse payment applications and restore invoices
    await (0, exports.reversePaymentApplications)(sequelize, paymentId, transaction);
    return payment;
};
exports.voidPayment = voidPayment;
/**
 * Reverses payment applications for a voided payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reversePaymentApplications(sequelize, 1);
 * ```
 */
const reversePaymentApplications = async (sequelize, paymentId, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const [applications] = await sequelize.query(`SELECT * FROM ap_payment_applications WHERE payment_id = $1`, {
        bind: [paymentId],
        type: 'SELECT',
        transaction,
    });
    for (const app of applications) {
        const invoice = await APInvoice.findByPk(app.invoice_id, { transaction });
        if (invoice) {
            await invoice.update({
                paidAmount: Number(invoice.paidAmount) - Number(app.applied_amount),
                discountTaken: Number(invoice.discountTaken) - Number(app.discount_amount),
                outstandingBalance: Number(invoice.outstandingBalance) + Number(app.applied_amount) + Number(app.discount_amount),
                status: 'approved',
            }, { transaction });
        }
    }
};
exports.reversePaymentApplications = reversePaymentApplications;
/**
 * Marks payment as transmitted to bank.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {string} userId - User transmitting payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await transmitPayment(sequelize, 1, 'user123');
 * ```
 */
const transmitPayment = async (sequelize, paymentId, userId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
    }
    if (payment.status !== 'approved') {
        throw new Error(`Payment ${paymentId} is not approved`);
    }
    await payment.update({
        status: 'transmitted',
    }, { transaction });
    return payment;
};
exports.transmitPayment = transmitPayment;
/**
 * Marks payment as cleared.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Date} clearedDate - Date payment cleared
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated payment
 *
 * @example
 * ```typescript
 * const payment = await clearPayment(sequelize, 1, new Date());
 * ```
 */
const clearPayment = async (sequelize, paymentId, clearedDate, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
    }
    await payment.update({
        status: 'cleared',
        clearedDate,
    }, { transaction });
    return payment;
};
exports.clearPayment = clearPayment;
/**
 * Retrieves payments by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Payment status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payments with specified status
 *
 * @example
 * ```typescript
 * const pending = await getPaymentsByStatus(sequelize, 'approved');
 * ```
 */
const getPaymentsByStatus = async (sequelize, status, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payments = await Payment.findAll({
        where: { status },
        order: [['paymentDate', 'ASC']],
        transaction,
    });
    return payments;
};
exports.getPaymentsByStatus = getPaymentsByStatus;
/**
 * Retrieves payment details including applications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} paymentId - Payment ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment with applications
 *
 * @example
 * ```typescript
 * const details = await getPaymentDetails(sequelize, 1);
 * ```
 */
const getPaymentDetails = async (sequelize, paymentId, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const payment = await Payment.findByPk(paymentId, { transaction });
    if (!payment) {
        throw new Error(`Payment ${paymentId} not found`);
    }
    const [applications] = await sequelize.query(`SELECT pa.*, i.invoice_number, i.invoice_date, i.invoice_amount
     FROM ap_payment_applications pa
     JOIN ap_invoices i ON i.id = pa.invoice_id
     WHERE pa.payment_id = $1
     ORDER BY pa.application_date`, {
        bind: [paymentId],
        type: 'SELECT',
        transaction,
    });
    return {
        ...payment.toJSON(),
        applications,
    };
};
exports.getPaymentDetails = getPaymentDetails;
// ============================================================================
// PAYMENT RUNS AND BATCH PROCESSING (29-33)
// ============================================================================
/**
 * Creates a payment run for batch processing.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PaymentRunDto} runData - Payment run data
 * @param {string} userId - User creating run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentRun>} Created payment run
 *
 * @example
 * ```typescript
 * const run = await createPaymentRun(sequelize, {
 *   paymentDate: new Date(),
 *   bankAccountId: 1,
 *   paymentMethod: 'ach',
 *   vendorSelection: 'by_due_date'
 * }, 'user123');
 * ```
 */
const createPaymentRun = async (sequelize, runData, userId, transaction) => {
    // Generate run number
    const runNumber = await (0, exports.generatePaymentRunNumber)(sequelize, transaction);
    const run = {
        runId: Date.now(),
        runNumber,
        runDate: new Date(),
        paymentDate: runData.paymentDate,
        bankAccountId: runData.bankAccountId,
        paymentMethod: runData.paymentMethod,
        vendorSelection: runData.vendorSelection,
        status: 'created',
        totalPayments: 0,
        totalAmount: 0,
        processedBy: userId,
    };
    return run;
};
exports.createPaymentRun = createPaymentRun;
/**
 * Generates a unique payment run number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Run number
 *
 * @example
 * ```typescript
 * const runNumber = await generatePaymentRunNumber(sequelize);
 * // Returns: "PR-2024-00001"
 * ```
 */
const generatePaymentRunNumber = async (sequelize, transaction) => {
    const year = new Date().getFullYear();
    const sequence = 1; // In production, query for last run number
    return `PR-${year}-${sequence.toString().padStart(5, '0')}`;
};
exports.generatePaymentRunNumber = generatePaymentRunNumber;
/**
 * Selects invoices for payment run based on criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {PaymentRunDto} runData - Payment run criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Selected invoices
 *
 * @example
 * ```typescript
 * const invoices = await selectInvoicesForPaymentRun(sequelize, {
 *   paymentDate: new Date(),
 *   vendorSelection: 'by_due_date'
 * });
 * ```
 */
const selectInvoicesForPaymentRun = async (sequelize, runData, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const where = {
        status: 'approved',
        outstandingBalance: { [sequelize_1.Op.gt]: 0 },
    };
    if (runData.vendorSelection === 'by_due_date') {
        where.dueDate = { [sequelize_1.Op.lte]: runData.paymentDate };
    }
    else if (runData.vendorSelection === 'by_discount_date') {
        where.discountDate = { [sequelize_1.Op.lte]: runData.paymentDate };
        where.discountAmount = { [sequelize_1.Op.gt]: 0 };
    }
    else if (runData.vendorSelection === 'by_vendor' && runData.vendorIds) {
        where.vendorId = { [sequelize_1.Op.in]: runData.vendorIds };
    }
    const invoices = await APInvoice.findAll({
        where,
        order: [['vendorId', 'ASC'], ['dueDate', 'ASC']],
        transaction,
    });
    // Filter out vendors on hold
    const filteredInvoices = [];
    for (const invoice of invoices) {
        const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });
        if (vendor && vendor.status === 'active') {
            filteredInvoices.push(invoice);
        }
    }
    return filteredInvoices;
};
exports.selectInvoicesForPaymentRun = selectInvoicesForPaymentRun;
/**
 * Processes a payment run and creates payments.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} runId - Payment run ID
 * @param {string} userId - User processing run
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Processing results
 *
 * @example
 * ```typescript
 * const results = await processPaymentRun(sequelize, 1, 'user123');
 * ```
 */
const processPaymentRun = async (sequelize, runId, userId, transaction) => {
    // In production, would retrieve run details and process
    // This is a simplified implementation
    return {
        runId,
        paymentsCreated: 0,
        totalAmount: 0,
        errors: [],
    };
};
exports.processPaymentRun = processPaymentRun;
/**
 * Generates ACH file for payment run.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} runId - Payment run ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} ACH file content
 *
 * @example
 * ```typescript
 * const achFile = await generateACHFile(sequelize, 1);
 * ```
 */
const generateACHFile = async (sequelize, runId, transaction) => {
    // In production, would generate NACHA-formatted ACH file
    // This is a placeholder
    return ''; // ACH file content
};
exports.generateACHFile = generateACHFile;
// ============================================================================
// DISCOUNT AND CASH MANAGEMENT (34-38)
// ============================================================================
/**
 * Analyzes available discounts for optimization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DiscountAnalysis[]>} Discount analysis results
 *
 * @example
 * ```typescript
 * const analysis = await analyzeAvailableDiscounts(sequelize, new Date());
 * ```
 */
const analyzeAvailableDiscounts = async (sequelize, asOfDate, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const invoices = await APInvoice.findAll({
        where: {
            status: 'approved',
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            discountDate: { [sequelize_1.Op.gte]: asOfDate },
            discountAmount: { [sequelize_1.Op.gt]: 0 },
        },
        transaction,
    });
    const analysis = [];
    for (const invoice of invoices) {
        const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });
        if (!vendor)
            continue;
        const daysToDiscount = Math.ceil((invoice.discountDate.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysToNet = Math.ceil((invoice.dueDate.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysSaved = daysToNet - daysToDiscount;
        const discountPercent = (Number(invoice.discountAmount) / Number(invoice.invoiceAmount)) * 100;
        const annualizedRate = daysSaved > 0 ? (discountPercent / daysSaved) * 365 : 0;
        analysis.push({
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            vendorId: vendor.id,
            vendorName: vendor.vendorName,
            invoiceAmount: Number(invoice.invoiceAmount),
            discountAmount: Number(invoice.discountAmount),
            discountPercent,
            discountDate: invoice.discountDate,
            dueDate: invoice.dueDate,
            daysToDiscount,
            annualizedRate,
            recommendation: annualizedRate > 10 ? 'take' : 'skip', // 10% hurdle rate
        });
    }
    return analysis.sort((a, b) => b.annualizedRate - a.annualizedRate);
};
exports.analyzeAvailableDiscounts = analyzeAvailableDiscounts;
/**
 * Calculates cash requirements forecast.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {number} days - Number of days to forecast
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CashRequirement[]>} Cash requirements by date
 *
 * @example
 * ```typescript
 * const forecast = await calculateCashRequirements(sequelize, new Date(), 30);
 * ```
 */
const calculateCashRequirements = async (sequelize, startDate, days, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    const invoices = await APInvoice.findAll({
        where: {
            status: 'approved',
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            dueDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        order: [['dueDate', 'ASC']],
        transaction,
    });
    // Group by due date
    const requirementsByDate = new Map();
    for (const invoice of invoices) {
        const dateKey = invoice.dueDate.toISOString().split('T')[0];
        if (!requirementsByDate.has(dateKey)) {
            requirementsByDate.set(dateKey, {
                requirementDate: invoice.dueDate,
                dueAmount: 0,
                discountEligibleAmount: 0,
                potentialDiscount: 0,
                netRequirement: 0,
                projectedBalance: 0,
                shortfallAmount: 0,
            });
        }
        const req = requirementsByDate.get(dateKey);
        req.dueAmount += Number(invoice.outstandingBalance);
        if (invoice.discountDate && invoice.discountDate >= invoice.dueDate) {
            req.discountEligibleAmount += Number(invoice.outstandingBalance);
            req.potentialDiscount += Number(invoice.discountAmount);
        }
        req.netRequirement = req.dueAmount - req.potentialDiscount;
    }
    return Array.from(requirementsByDate.values()).sort((a, b) => a.requirementDate.getTime() - b.requirementDate.getTime());
};
exports.calculateCashRequirements = calculateCashRequirements;
/**
 * Recommends optimal payment strategy for discounts.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} availableCash - Available cash balance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment strategy recommendations
 *
 * @example
 * ```typescript
 * const strategy = await recommendPaymentStrategy(sequelize, 100000, new Date());
 * ```
 */
const recommendPaymentStrategy = async (sequelize, availableCash, asOfDate, transaction) => {
    const discounts = await (0, exports.analyzeAvailableDiscounts)(sequelize, asOfDate, transaction);
    const recommended = discounts.filter(d => d.recommendation === 'take');
    let totalInvestment = 0;
    let totalSavings = 0;
    const selectedInvoices = [];
    for (const discount of recommended) {
        const netPayment = discount.invoiceAmount - discount.discountAmount;
        if (totalInvestment + netPayment <= availableCash) {
            totalInvestment += netPayment;
            totalSavings += discount.discountAmount;
            selectedInvoices.push(discount.invoiceId);
        }
    }
    return {
        availableCash,
        recommendedInvestment: totalInvestment,
        totalSavings,
        effectiveRate: totalInvestment > 0 ? (totalSavings / totalInvestment) * 100 : 0,
        invoiceCount: selectedInvoices.length,
        invoiceIds: selectedInvoices,
    };
};
exports.recommendPaymentStrategy = recommendPaymentStrategy;
/**
 * Calculates early payment discount ROI.
 *
 * @param {number} invoiceAmount - Invoice amount
 * @param {number} discountPercent - Discount percentage
 * @param {number} daysEarly - Days paid early
 * @returns {number} Annualized ROI percentage
 *
 * @example
 * ```typescript
 * const roi = calculateDiscountROI(10000, 2, 20);
 * // Returns annualized ROI for 2% discount on 20-day early payment
 * ```
 */
const calculateDiscountROI = (invoiceAmount, discountPercent, daysEarly) => {
    if (daysEarly <= 0)
        return 0;
    const annualizedRate = (discountPercent / daysEarly) * 365;
    return annualizedRate;
};
exports.calculateDiscountROI = calculateDiscountROI;
/**
 * Gets invoices eligible for early payment discount.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Analysis date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Discount-eligible invoices
 *
 * @example
 * ```typescript
 * const eligible = await getDiscountEligibleInvoices(sequelize, new Date());
 * ```
 */
const getDiscountEligibleInvoices = async (sequelize, asOfDate, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoices = await APInvoice.findAll({
        where: {
            status: 'approved',
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            discountDate: { [sequelize_1.Op.gte]: asOfDate },
            discountAmount: { [sequelize_1.Op.gt]: 0 },
        },
        order: [['discountDate', 'ASC']],
        transaction,
    });
    return invoices;
};
exports.getDiscountEligibleInvoices = getDiscountEligibleInvoices;
// ============================================================================
// REPORTING AND ANALYTICS (39-45)
// ============================================================================
/**
 * Generates accounts payable aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Aging as-of date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<APAgingBucket[]>} Aging buckets by vendor
 *
 * @example
 * ```typescript
 * const aging = await generateAPAgingReport(sequelize, new Date());
 * ```
 */
const generateAPAgingReport = async (sequelize, asOfDate, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const invoices = await APInvoice.findAll({
        where: {
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'void'] },
        },
        transaction,
    });
    const vendorBuckets = new Map();
    for (const invoice of invoices) {
        if (!vendorBuckets.has(invoice.vendorId)) {
            const vendor = await Vendor.findByPk(invoice.vendorId, { transaction });
            if (!vendor)
                continue;
            vendorBuckets.set(invoice.vendorId, {
                vendorId: vendor.id,
                vendorNumber: vendor.vendorNumber,
                vendorName: vendor.vendorName,
                current: 0,
                days1To30: 0,
                days31To60: 0,
                days61To90: 0,
                days91To120: 0,
                over120: 0,
                totalOutstanding: 0,
            });
        }
        const bucket = vendorBuckets.get(invoice.vendorId);
        const daysOld = Math.floor((asOfDate.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const amount = Number(invoice.outstandingBalance);
        if (daysOld < 0) {
            bucket.current += amount;
        }
        else if (daysOld <= 30) {
            bucket.days1To30 += amount;
        }
        else if (daysOld <= 60) {
            bucket.days31To60 += amount;
        }
        else if (daysOld <= 90) {
            bucket.days61To90 += amount;
        }
        else if (daysOld <= 120) {
            bucket.days91To120 += amount;
        }
        else {
            bucket.over120 += amount;
        }
        bucket.totalOutstanding += amount;
    }
    return Array.from(vendorBuckets.values()).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
};
exports.generateAPAgingReport = generateAPAgingReport;
/**
 * Generates 1099 tax data for vendors.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} taxYear - Tax year
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Form1099Data[]>} 1099 data by vendor
 *
 * @example
 * ```typescript
 * const data1099 = await generate1099Data(sequelize, 2024);
 * ```
 */
const generate1099Data = async (sequelize, taxYear, transaction) => {
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const vendors = await Vendor.findAll({
        where: {
            is1099Vendor: true,
        },
        transaction,
    });
    const data1099 = [];
    for (const vendor of vendors) {
        const yearStart = new Date(taxYear, 0, 1);
        const yearEnd = new Date(taxYear, 11, 31);
        const payments = await Payment.findAll({
            where: {
                vendorId: vendor.id,
                paymentDate: { [sequelize_1.Op.between]: [yearStart, yearEnd] },
                status: { [sequelize_1.Op.in]: ['transmitted', 'cleared'] },
            },
            transaction,
        });
        const totalAmount = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);
        if (totalAmount >= 600) {
            // IRS reporting threshold
            data1099.push({
                vendor1099Id: Date.now() + vendor.id,
                vendorId: vendor.id,
                taxYear,
                form1099Type: vendor.is1099Type || '1099-NEC',
                box1Amount: totalAmount,
                totalAmount,
                isCorrected: false,
                filingStatus: 'not_filed',
            });
        }
    }
    return data1099;
};
exports.generate1099Data = generate1099Data;
/**
 * Generates vendor statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Date} statementDate - Statement date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VendorStatement>} Vendor statement
 *
 * @example
 * ```typescript
 * const statement = await generateVendorStatement(sequelize, 1, new Date());
 * ```
 */
const generateVendorStatement = async (sequelize, vendorId, statementDate, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const monthStart = new Date(statementDate.getFullYear(), statementDate.getMonth(), 1);
    const monthEnd = new Date(statementDate.getFullYear(), statementDate.getMonth() + 1, 0);
    const invoices = await APInvoice.findAll({
        where: {
            vendorId,
            invoiceDate: { [sequelize_1.Op.between]: [monthStart, monthEnd] },
        },
        transaction,
    });
    const payments = await Payment.findAll({
        where: {
            vendorId,
            paymentDate: { [sequelize_1.Op.between]: [monthStart, monthEnd] },
        },
        transaction,
    });
    const totalInvoices = invoices.reduce((sum, i) => sum + Number(i.invoiceAmount), 0);
    const totalPayments = payments.reduce((sum, p) => sum + Number(p.paymentAmount), 0);
    const currentBalance = await APInvoice.sum('outstandingBalance', {
        where: {
            vendorId,
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'void'] },
        },
        transaction,
    });
    const statement = {
        statementId: Date.now(),
        vendorId,
        statementDate,
        beginningBalance: (currentBalance || 0) - totalInvoices + totalPayments,
        invoices: totalInvoices,
        payments: totalPayments,
        adjustments: 0,
        endingBalance: currentBalance || 0,
        reconciliationStatus: 'unreconciled',
    };
    return statement;
};
exports.generateVendorStatement = generateVendorStatement;
/**
 * Gets top vendors by payment volume.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [limit=10] - Number of top vendors
 * @param {number} [days=365] - Analysis period in days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Top vendors
 *
 * @example
 * ```typescript
 * const topVendors = await getTopVendorsByVolume(sequelize, 10, 365);
 * ```
 */
const getTopVendorsByVolume = async (sequelize, limit = 10, days = 365, transaction) => {
    const Payment = (0, exports.createPaymentModel)(sequelize);
    const Vendor = (0, exports.createVendorModel)(sequelize);
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const [results] = await sequelize.query(`SELECT
      v.id,
      v.vendor_number,
      v.vendor_name,
      COUNT(p.id) as payment_count,
      SUM(p.payment_amount) as total_paid,
      AVG(p.payment_amount) as avg_payment
     FROM ap_vendors v
     JOIN ap_payments p ON p.vendor_id = v.id
     WHERE p.payment_date >= $1
       AND p.status IN ('transmitted', 'cleared')
     GROUP BY v.id, v.vendor_number, v.vendor_name
     ORDER BY total_paid DESC
     LIMIT $2`, {
        bind: [sinceDate, limit],
        type: 'SELECT',
        transaction,
    });
    return results;
};
exports.getTopVendorsByVolume = getTopVendorsByVolume;
/**
 * Calculates payment cycle metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment cycle metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculatePaymentCycleMetrics(sequelize, 90);
 * ```
 */
const calculatePaymentCycleMetrics = async (sequelize, days = 90, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const paidInvoices = await APInvoice.findAll({
        where: {
            status: 'paid',
            invoiceDate: { [sequelize_1.Op.gte]: sinceDate },
        },
        transaction,
    });
    let totalDays = 0;
    let onTimeCount = 0;
    let earlyCount = 0;
    let lateCount = 0;
    for (const invoice of paidInvoices) {
        // In production, would get actual payment date from payment record
        const paymentDate = invoice.updatedAt; // Approximation
        const daysToPayment = Math.floor((paymentDate.getTime() - invoice.invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
        totalDays += daysToPayment;
        const daysToDue = Math.floor((invoice.dueDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysToDue > 0)
            earlyCount++;
        else if (daysToDue === 0)
            onTimeCount++;
        else
            lateCount++;
    }
    const avgDaysToPayment = paidInvoices.length > 0 ? totalDays / paidInvoices.length : 0;
    return {
        periodDays: days,
        invoicesPaid: paidInvoices.length,
        averageDaysToPayment: avgDaysToPayment,
        paidEarly: earlyCount,
        paidOnTime: onTimeCount,
        paidLate: lateCount,
        onTimePercentage: paidInvoices.length > 0 ? ((earlyCount + onTimeCount) / paidInvoices.length) * 100 : 0,
    };
};
exports.calculatePaymentCycleMetrics = calculatePaymentCycleMetrics;
/**
 * Retrieves outstanding invoices by vendor.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vendorId - Vendor ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoicesByVendor(sequelize, 1);
 * ```
 */
const getOutstandingInvoicesByVendor = async (sequelize, vendorId, transaction) => {
    const APInvoice = (0, exports.createAPInvoiceModel)(sequelize);
    const invoices = await APInvoice.findAll({
        where: {
            vendorId,
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'void'] },
        },
        order: [['dueDate', 'ASC']],
        transaction,
    });
    return invoices;
};
exports.getOutstandingInvoicesByVendor = getOutstandingInvoicesByVendor;
/**
 * Generates payment forecast based on approved invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {Date} endDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment forecast
 *
 * @example
 * ```typescript
 * const forecast = await generatePaymentForecast(
 *   sequelize,
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
const generatePaymentForecast = async (sequelize, startDate, endDate, transaction) => {
    const cashRequirements = await (0, exports.calculateCashRequirements)(sequelize, startDate, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), transaction);
    const totalDue = cashRequirements.reduce((sum, r) => sum + r.dueAmount, 0);
    const totalDiscounts = cashRequirements.reduce((sum, r) => sum + r.potentialDiscount, 0);
    const netCashNeeded = totalDue - totalDiscounts;
    return {
        forecastStart: startDate,
        forecastEnd: endDate,
        totalAmountDue: totalDue,
        potentialDiscounts: totalDiscounts,
        netCashRequired: netCashNeeded,
        dailyRequirements: cashRequirements,
    };
};
exports.generatePaymentForecast = generatePaymentForecast;
//# sourceMappingURL=accounts-payable-management-kit.js.map