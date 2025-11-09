"use strict";
/**
 * LOC: EDWAR001
 * File: /reuse/edwards/financial/accounts-receivable-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - ../../financial/general-ledger-operations-kit (GL integration)
 *
 * DOWNSTREAM (imported by):
 *   - Backend financial modules
 *   - Customer billing services
 *   - Collections management modules
 *   - Cash receipts systems
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
exports.getOutstandingInvoicesByCustomer = exports.generateCashForecast = exports.getCustomersOverCreditLimit = exports.getCollectionEffectivenessMetrics = exports.resolveInvoiceDispute = exports.createInvoiceDispute = exports.createBadDebtWriteOff = exports.calculateDSO = exports.getTopCustomersByRevenue = exports.generateCustomerStatement = exports.generateARAgingReport = exports.processPaymentPlanPayment = exports.createPaymentPlan = exports.getCustomersEligibleForDunning = exports.runDunningProcess = exports.getOpenCollectionsCases = exports.updateCollectionsCaseStatus = exports.addCollectionsActivity = exports.createCollectionsCase = exports.processLockboxFile = exports.reverseReceiptApplications = exports.reverseCashReceipt = exports.createReceiptApplication = exports.applyCashReceipt = exports.postCashReceipt = exports.generateReceiptNumber = exports.createCashReceipt = exports.getFiscalYearPeriod = exports.generateInvoiceNumber = exports.getOverdueInvoices = exports.getInvoicesByStatus = exports.voidARInvoice = exports.postARInvoice = exports.calculateInvoiceDueDate = exports.createARInvoice = exports.searchCustomers = exports.getCustomerByNumber = exports.checkCustomerCreditLimit = exports.updateCustomerCreditLimit = exports.releaseCustomerHold = exports.placeCustomerOnHold = exports.updateCustomer = exports.createCustomer = exports.createCashReceiptModel = exports.createARInvoiceModel = exports.createCustomerModel = exports.CreateCollectionsCaseDto = exports.ProcessCashReceiptDto = exports.CreateARInvoiceDto = exports.CreateCustomerDto = void 0;
/**
 * File: /reuse/edwards/financial/accounts-receivable-management-kit.ts
 * Locator: WC-EDWARDS-AR-001
 * Purpose: Comprehensive Accounts Receivable Management - JD Edwards EnterpriseOne-level customer billing, collections, cash receipts, credit management
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x, general-ledger-operations-kit
 * Downstream: ../backend/financial/*, Customer Services, Collections, Cash Management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 45+ functions for customer management, invoice generation, payment application, collections, credit management, dunning, lockbox processing, cash receipts, AR aging, credit limits, customer statements, dispute management, payment plans, write-offs
 *
 * LLM Context: Enterprise-grade accounts receivable operations for JD Edwards EnterpriseOne compliance.
 * Provides comprehensive customer billing, automated invoice generation, payment application, collections workflows,
 * credit limit management, dunning process automation, lockbox processing, cash receipts posting,
 * AR aging analysis, customer statement generation, dispute tracking, payment plan management,
 * bad debt write-offs, and audit trails. Supports multi-currency, multi-entity operations with full GL integration.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateCustomerDto = (() => {
    var _a;
    let _customerNumber_decorators;
    let _customerNumber_initializers = [];
    let _customerNumber_extraInitializers = [];
    let _customerName_decorators;
    let _customerName_initializers = [];
    let _customerName_extraInitializers = [];
    let _customerType_decorators;
    let _customerType_initializers = [];
    let _customerType_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _creditLimit_decorators;
    let _creditLimit_initializers = [];
    let _creditLimit_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _defaultGLAccount_decorators;
    let _defaultGLAccount_initializers = [];
    let _defaultGLAccount_extraInitializers = [];
    return _a = class CreateCustomerDto {
            constructor() {
                this.customerNumber = __runInitializers(this, _customerNumber_initializers, void 0);
                this.customerName = (__runInitializers(this, _customerNumber_extraInitializers), __runInitializers(this, _customerName_initializers, void 0));
                this.customerType = (__runInitializers(this, _customerName_extraInitializers), __runInitializers(this, _customerType_initializers, void 0));
                this.taxId = (__runInitializers(this, _customerType_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
                this.creditLimit = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _creditLimit_initializers, void 0));
                this.paymentTerms = (__runInitializers(this, _creditLimit_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
                this.defaultGLAccount = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _defaultGLAccount_initializers, void 0));
                __runInitializers(this, _defaultGLAccount_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer number', example: 'C-10001' })];
            _customerName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer name', example: 'ABC Corporation' })];
            _customerType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer type', enum: ['commercial', 'government', 'individual', 'nonprofit'] })];
            _taxId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax ID (EIN or SSN)', example: '12-3456789' })];
            _creditLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit limit', example: 50000 })];
            _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms', example: 'Net 30' })];
            _defaultGLAccount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Default GL account', example: '1200-00' })];
            __esDecorate(null, null, _customerNumber_decorators, { kind: "field", name: "customerNumber", static: false, private: false, access: { has: obj => "customerNumber" in obj, get: obj => obj.customerNumber, set: (obj, value) => { obj.customerNumber = value; } }, metadata: _metadata }, _customerNumber_initializers, _customerNumber_extraInitializers);
            __esDecorate(null, null, _customerName_decorators, { kind: "field", name: "customerName", static: false, private: false, access: { has: obj => "customerName" in obj, get: obj => obj.customerName, set: (obj, value) => { obj.customerName = value; } }, metadata: _metadata }, _customerName_initializers, _customerName_extraInitializers);
            __esDecorate(null, null, _customerType_decorators, { kind: "field", name: "customerType", static: false, private: false, access: { has: obj => "customerType" in obj, get: obj => obj.customerType, set: (obj, value) => { obj.customerType = value; } }, metadata: _metadata }, _customerType_initializers, _customerType_extraInitializers);
            __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
            __esDecorate(null, null, _creditLimit_decorators, { kind: "field", name: "creditLimit", static: false, private: false, access: { has: obj => "creditLimit" in obj, get: obj => obj.creditLimit, set: (obj, value) => { obj.creditLimit = value; } }, metadata: _metadata }, _creditLimit_initializers, _creditLimit_extraInitializers);
            __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
            __esDecorate(null, null, _defaultGLAccount_decorators, { kind: "field", name: "defaultGLAccount", static: false, private: false, access: { has: obj => "defaultGLAccount" in obj, get: obj => obj.defaultGLAccount, set: (obj, value) => { obj.defaultGLAccount = value; } }, metadata: _metadata }, _defaultGLAccount_initializers, _defaultGLAccount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCustomerDto = CreateCustomerDto;
let CreateARInvoiceDto = (() => {
    var _a;
    let _invoiceNumber_decorators;
    let _invoiceNumber_initializers = [];
    let _invoiceNumber_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _invoiceDate_decorators;
    let _invoiceDate_initializers = [];
    let _invoiceDate_extraInitializers = [];
    let _grossAmount_decorators;
    let _grossAmount_initializers = [];
    let _grossAmount_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _salesOrderNumber_decorators;
    let _salesOrderNumber_initializers = [];
    let _salesOrderNumber_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    return _a = class CreateARInvoiceDto {
            constructor() {
                this.invoiceNumber = __runInitializers(this, _invoiceNumber_initializers, void 0);
                this.customerId = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.invoiceDate = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _invoiceDate_initializers, void 0));
                this.grossAmount = (__runInitializers(this, _invoiceDate_extraInitializers), __runInitializers(this, _grossAmount_initializers, void 0));
                this.taxAmount = (__runInitializers(this, _grossAmount_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
                this.salesOrderNumber = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _salesOrderNumber_initializers, void 0));
                this.lines = (__runInitializers(this, _salesOrderNumber_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
                __runInitializers(this, _lines_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice number', example: 'AR-2024-001' })];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _invoiceDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice date' })];
            _grossAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Gross amount' })];
            _taxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax amount', default: 0 })];
            _salesOrderNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sales order number', required: false })];
            _lines_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice lines', type: [Object] })];
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: obj => "invoiceNumber" in obj, get: obj => obj.invoiceNumber, set: (obj, value) => { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _invoiceDate_decorators, { kind: "field", name: "invoiceDate", static: false, private: false, access: { has: obj => "invoiceDate" in obj, get: obj => obj.invoiceDate, set: (obj, value) => { obj.invoiceDate = value; } }, metadata: _metadata }, _invoiceDate_initializers, _invoiceDate_extraInitializers);
            __esDecorate(null, null, _grossAmount_decorators, { kind: "field", name: "grossAmount", static: false, private: false, access: { has: obj => "grossAmount" in obj, get: obj => obj.grossAmount, set: (obj, value) => { obj.grossAmount = value; } }, metadata: _metadata }, _grossAmount_initializers, _grossAmount_extraInitializers);
            __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
            __esDecorate(null, null, _salesOrderNumber_decorators, { kind: "field", name: "salesOrderNumber", static: false, private: false, access: { has: obj => "salesOrderNumber" in obj, get: obj => obj.salesOrderNumber, set: (obj, value) => { obj.salesOrderNumber = value; } }, metadata: _metadata }, _salesOrderNumber_initializers, _salesOrderNumber_extraInitializers);
            __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateARInvoiceDto = CreateARInvoiceDto;
let ProcessCashReceiptDto = (() => {
    var _a;
    let _receiptDate_decorators;
    let _receiptDate_initializers = [];
    let _receiptDate_extraInitializers = [];
    let _receiptMethod_decorators;
    let _receiptMethod_initializers = [];
    let _receiptMethod_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _receiptAmount_decorators;
    let _receiptAmount_initializers = [];
    let _receiptAmount_extraInitializers = [];
    let _bankAccountId_decorators;
    let _bankAccountId_initializers = [];
    let _bankAccountId_extraInitializers = [];
    let _checkNumber_decorators;
    let _checkNumber_initializers = [];
    let _checkNumber_extraInitializers = [];
    let _invoiceIds_decorators;
    let _invoiceIds_initializers = [];
    let _invoiceIds_extraInitializers = [];
    return _a = class ProcessCashReceiptDto {
            constructor() {
                this.receiptDate = __runInitializers(this, _receiptDate_initializers, void 0);
                this.receiptMethod = (__runInitializers(this, _receiptDate_extraInitializers), __runInitializers(this, _receiptMethod_initializers, void 0));
                this.customerId = (__runInitializers(this, _receiptMethod_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.receiptAmount = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _receiptAmount_initializers, void 0));
                this.bankAccountId = (__runInitializers(this, _receiptAmount_extraInitializers), __runInitializers(this, _bankAccountId_initializers, void 0));
                this.checkNumber = (__runInitializers(this, _bankAccountId_extraInitializers), __runInitializers(this, _checkNumber_initializers, void 0));
                this.invoiceIds = (__runInitializers(this, _checkNumber_extraInitializers), __runInitializers(this, _invoiceIds_initializers, void 0));
                __runInitializers(this, _invoiceIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _receiptDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receipt date' })];
            _receiptMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receipt method', enum: ['check', 'wire', 'ach', 'credit_card'] })];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _receiptAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receipt amount' })];
            _bankAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Bank account ID' })];
            _checkNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check number', required: false })];
            _invoiceIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Invoice IDs to apply', type: [Number], required: false })];
            __esDecorate(null, null, _receiptDate_decorators, { kind: "field", name: "receiptDate", static: false, private: false, access: { has: obj => "receiptDate" in obj, get: obj => obj.receiptDate, set: (obj, value) => { obj.receiptDate = value; } }, metadata: _metadata }, _receiptDate_initializers, _receiptDate_extraInitializers);
            __esDecorate(null, null, _receiptMethod_decorators, { kind: "field", name: "receiptMethod", static: false, private: false, access: { has: obj => "receiptMethod" in obj, get: obj => obj.receiptMethod, set: (obj, value) => { obj.receiptMethod = value; } }, metadata: _metadata }, _receiptMethod_initializers, _receiptMethod_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _receiptAmount_decorators, { kind: "field", name: "receiptAmount", static: false, private: false, access: { has: obj => "receiptAmount" in obj, get: obj => obj.receiptAmount, set: (obj, value) => { obj.receiptAmount = value; } }, metadata: _metadata }, _receiptAmount_initializers, _receiptAmount_extraInitializers);
            __esDecorate(null, null, _bankAccountId_decorators, { kind: "field", name: "bankAccountId", static: false, private: false, access: { has: obj => "bankAccountId" in obj, get: obj => obj.bankAccountId, set: (obj, value) => { obj.bankAccountId = value; } }, metadata: _metadata }, _bankAccountId_initializers, _bankAccountId_extraInitializers);
            __esDecorate(null, null, _checkNumber_decorators, { kind: "field", name: "checkNumber", static: false, private: false, access: { has: obj => "checkNumber" in obj, get: obj => obj.checkNumber, set: (obj, value) => { obj.checkNumber = value; } }, metadata: _metadata }, _checkNumber_initializers, _checkNumber_extraInitializers);
            __esDecorate(null, null, _invoiceIds_decorators, { kind: "field", name: "invoiceIds", static: false, private: false, access: { has: obj => "invoiceIds" in obj, get: obj => obj.invoiceIds, set: (obj, value) => { obj.invoiceIds = value; } }, metadata: _metadata }, _invoiceIds_initializers, _invoiceIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessCashReceiptDto = ProcessCashReceiptDto;
let CreateCollectionsCaseDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _collectorId_decorators;
    let _collectorId_initializers = [];
    let _collectorId_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    return _a = class CreateCollectionsCaseDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.collectorId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _collectorId_initializers, void 0));
                this.priority = (__runInitializers(this, _collectorId_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _collectorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Collector ID' })];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority', enum: ['low', 'medium', 'high', 'critical'] })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _collectorId_decorators, { kind: "field", name: "collectorId", static: false, private: false, access: { has: obj => "collectorId" in obj, get: obj => obj.collectorId, set: (obj, value) => { obj.collectorId = value; } }, metadata: _metadata }, _collectorId_initializers, _collectorId_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCollectionsCaseDto = CreateCollectionsCaseDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Customer master data.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Customer model
 *
 * @example
 * ```typescript
 * const Customer = createCustomerModel(sequelize);
 * const customer = await Customer.create({
 *   customerNumber: 'C-10001',
 *   customerName: 'ABC Corp',
 *   customerType: 'commercial',
 *   status: 'active'
 * });
 * ```
 */
const createCustomerModel = (sequelize) => {
    class Customer extends sequelize_1.Model {
    }
    Customer.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        customerNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique customer identifier',
        },
        customerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Customer legal name',
        },
        customerType: {
            type: sequelize_1.DataTypes.ENUM('commercial', 'government', 'individual', 'nonprofit'),
            allowNull: false,
            comment: 'Customer classification',
        },
        taxId: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            comment: 'EIN or SSN for tax reporting',
        },
        creditLimit: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Customer credit limit',
        },
        creditRating: {
            type: sequelize_1.DataTypes.ENUM('excellent', 'good', 'fair', 'poor', 'blocked'),
            allowNull: false,
            defaultValue: 'good',
            comment: 'Credit rating assessment',
        },
        paymentTerms: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Payment terms (Net 30, etc.)',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'hold', 'collections'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Customer status',
        },
        holdReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for credit hold',
        },
        defaultGLAccount: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Default AR account',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Customer currency code',
        },
        dunningLevel: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Current dunning level (0-5)',
        },
        lastDunningDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last dunning communication date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional customer data',
        },
    }, {
        sequelize,
        tableName: 'ar_customers',
        timestamps: true,
        indexes: [
            { fields: ['customerNumber'], unique: true },
            { fields: ['customerName'] },
            { fields: ['customerType'] },
            { fields: ['status'] },
            { fields: ['creditRating'] },
            { fields: ['taxId'] },
        ],
    });
    return Customer;
};
exports.createCustomerModel = createCustomerModel;
/**
 * Sequelize model for AR Invoice headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ARInvoice model
 *
 * @example
 * ```typescript
 * const ARInvoice = createARInvoiceModel(sequelize);
 * const invoice = await ARInvoice.create({
 *   invoiceNumber: 'AR-2024-001',
 *   customerId: 1,
 *   grossAmount: 10000.00,
 *   status: 'posted'
 * });
 * ```
 */
const createARInvoiceModel = (sequelize) => {
    class ARInvoice extends sequelize_1.Model {
    }
    ARInvoice.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        invoiceNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique invoice number',
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ar_customers',
                key: 'id',
            },
            comment: 'Customer reference',
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
        invoiceAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Net invoice amount',
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
        grossAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Gross amount including tax and charges',
        },
        appliedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Amount applied from receipts',
        },
        unappliedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Unapplied receipt amount',
        },
        outstandingBalance: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Remaining balance',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'posted', 'partial_paid', 'paid', 'disputed', 'written_off', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Invoice status',
        },
        disputeStatus: {
            type: sequelize_1.DataTypes.ENUM('none', 'under_review', 'approved', 'rejected'),
            allowNull: false,
            defaultValue: 'none',
            comment: 'Dispute status',
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
        salesOrderNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated sales order',
        },
        shipmentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Associated shipment',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Invoice description',
        },
    }, {
        sequelize,
        tableName: 'ar_invoices',
        timestamps: true,
        indexes: [
            { fields: ['invoiceNumber'], unique: true },
            { fields: ['customerId'] },
            { fields: ['invoiceDate'] },
            { fields: ['dueDate'] },
            { fields: ['status'] },
            { fields: ['disputeStatus'] },
            { fields: ['fiscalYear', 'fiscalPeriod'] },
            { fields: ['salesOrderNumber'] },
        ],
    });
    return ARInvoice;
};
exports.createARInvoiceModel = createARInvoiceModel;
/**
 * Sequelize model for Cash Receipt headers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CashReceipt model
 *
 * @example
 * ```typescript
 * const CashReceipt = createCashReceiptModel(sequelize);
 * const receipt = await CashReceipt.create({
 *   receiptNumber: 'CR-2024-001',
 *   customerId: 1,
 *   receiptAmount: 5000.00,
 *   receiptMethod: 'check'
 * });
 * ```
 */
const createCashReceiptModel = (sequelize) => {
    class CashReceipt extends sequelize_1.Model {
    }
    CashReceipt.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        receiptNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Receipt identifier',
        },
        receiptDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Receipt date',
        },
        receiptMethod: {
            type: sequelize_1.DataTypes.ENUM('check', 'wire', 'ach', 'credit_card', 'cash', 'lockbox'),
            allowNull: false,
            comment: 'Receipt method',
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ar_customers',
                key: 'id',
            },
            comment: 'Customer paying',
        },
        receiptAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Total receipt amount',
        },
        unappliedAmount: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: false,
            comment: 'Unapplied portion',
        },
        bankAccountId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Bank account deposited',
        },
        checkNumber: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
            comment: 'Check number if check receipt',
        },
        referenceNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Wire/ACH reference',
        },
        lockboxBatchId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: true,
            comment: 'Lockbox batch identifier',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('unposted', 'posted', 'applied', 'reversed', 'nsf'),
            allowNull: false,
            defaultValue: 'unposted',
            comment: 'Receipt status',
        },
        postedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'GL posting date',
        },
        reversalDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Reversal date if reversed',
        },
        reversalReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for reversal',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Receipt currency',
        },
    }, {
        sequelize,
        tableName: 'ar_cash_receipts',
        timestamps: true,
        indexes: [
            { fields: ['receiptNumber'], unique: true },
            { fields: ['receiptDate'] },
            { fields: ['customerId'] },
            { fields: ['status'] },
            { fields: ['bankAccountId'] },
            { fields: ['checkNumber'] },
            { fields: ['lockboxBatchId'] },
        ],
    });
    return CashReceipt;
};
exports.createCashReceiptModel = createCashReceiptModel;
// ============================================================================
// CUSTOMER MANAGEMENT (1-8)
// ============================================================================
/**
 * Creates a new customer with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCustomerDto} customerData - Customer data
 * @param {string} userId - User creating the customer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created customer
 *
 * @example
 * ```typescript
 * const customer = await createCustomer(sequelize, {
 *   customerNumber: 'C-10001',
 *   customerName: 'ABC Corporation',
 *   customerType: 'commercial',
 *   taxId: '12-3456789',
 *   creditLimit: 50000,
 *   paymentTerms: 'Net 30'
 * }, 'user123');
 * ```
 */
const createCustomer = async (sequelize, customerData, userId, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    // Validate customer number is unique
    const existing = await Customer.findOne({
        where: { customerNumber: customerData.customerNumber },
        transaction,
    });
    if (existing) {
        throw new Error(`Customer number ${customerData.customerNumber} already exists`);
    }
    const customer = await Customer.create({
        ...customerData,
        status: 'active',
        creditRating: 'good',
        currency: 'USD',
        dunningLevel: 0,
        metadata: { createdBy: userId },
    }, { transaction });
    return customer;
};
exports.createCustomer = createCustomer;
/**
 * Updates customer information.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Partial<CreateCustomerDto>} updateData - Update data
 * @param {string} userId - User updating the customer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const updated = await updateCustomer(sequelize, 1, {
 *   creditLimit: 75000
 * }, 'user123');
 * ```
 */
const updateCustomer = async (sequelize, customerId, updateData, userId, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
        throw new Error(`Customer ${customerId} not found`);
    }
    await customer.update({
        ...updateData,
        metadata: { ...customer.metadata, updatedBy: userId, updatedAt: new Date() },
    }, { transaction });
    return customer;
};
exports.updateCustomer = updateCustomer;
/**
 * Places customer on credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} holdReason - Reason for hold
 * @param {string} userId - User placing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await placeCustomerOnHold(sequelize, 1, 'Exceeded credit limit', 'user123');
 * ```
 */
const placeCustomerOnHold = async (sequelize, customerId, holdReason, userId, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
        throw new Error(`Customer ${customerId} not found`);
    }
    await customer.update({
        status: 'hold',
        holdReason,
        metadata: { ...customer.metadata, holdPlacedBy: userId, holdPlacedAt: new Date() },
    }, { transaction });
    return customer;
};
exports.placeCustomerOnHold = placeCustomerOnHold;
/**
 * Releases customer from credit hold.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {string} userId - User releasing hold
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await releaseCustomerHold(sequelize, 1, 'user123');
 * ```
 */
const releaseCustomerHold = async (sequelize, customerId, userId, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
        throw new Error(`Customer ${customerId} not found`);
    }
    if (customer.status !== 'hold') {
        throw new Error(`Customer ${customerId} is not on hold`);
    }
    await customer.update({
        status: 'active',
        holdReason: null,
        metadata: { ...customer.metadata, holdReleasedBy: userId, holdReleasedAt: new Date() },
    }, { transaction });
    return customer;
};
exports.releaseCustomerHold = releaseCustomerHold;
/**
 * Updates customer credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} newCreditLimit - New credit limit
 * @param {string} userId - User updating limit
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated customer
 *
 * @example
 * ```typescript
 * const customer = await updateCustomerCreditLimit(sequelize, 1, 100000, 'user123');
 * ```
 */
const updateCustomerCreditLimit = async (sequelize, customerId, newCreditLimit, userId, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
        throw new Error(`Customer ${customerId} not found`);
    }
    const oldLimit = customer.creditLimit;
    await customer.update({
        creditLimit: newCreditLimit,
        metadata: {
            ...customer.metadata,
            creditLimitHistory: [
                ...(customer.metadata.creditLimitHistory || []),
                { oldLimit, newLimit: newCreditLimit, changedBy: userId, changedAt: new Date() },
            ],
        },
    }, { transaction });
    return customer;
};
exports.updateCustomerCreditLimit = updateCustomerCreditLimit;
/**
 * Checks if customer is over credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ isOverLimit: boolean; currentBalance: number; creditLimit: number; available: number }>} Credit status
 *
 * @example
 * ```typescript
 * const status = await checkCustomerCreditLimit(sequelize, 1);
 * ```
 */
const checkCustomerCreditLimit = async (sequelize, customerId, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const customer = await Customer.findByPk(customerId, { transaction });
    if (!customer) {
        throw new Error(`Customer ${customerId} not found`);
    }
    const currentBalance = (await ARInvoice.sum('outstandingBalance', {
        where: {
            customerId,
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    })) || 0;
    const available = customer.creditLimit - currentBalance;
    return {
        isOverLimit: currentBalance > customer.creditLimit,
        currentBalance,
        creditLimit: customer.creditLimit,
        available: Math.max(0, available),
    };
};
exports.checkCustomerCreditLimit = checkCustomerCreditLimit;
/**
 * Retrieves customer by customer number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} customerNumber - Customer number
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Customer record
 *
 * @example
 * ```typescript
 * const customer = await getCustomerByNumber(sequelize, 'C-10001');
 * ```
 */
const getCustomerByNumber = async (sequelize, customerNumber, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const customer = await Customer.findOne({
        where: { customerNumber },
        transaction,
    });
    if (!customer) {
        throw new Error(`Customer ${customerNumber} not found`);
    }
    return customer;
};
exports.getCustomerByNumber = getCustomerByNumber;
/**
 * Searches customers by criteria.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Record<string, any>} criteria - Search criteria
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Matching customers
 *
 * @example
 * ```typescript
 * const customers = await searchCustomers(sequelize, {
 *   customerType: 'commercial',
 *   status: 'active',
 *   creditRating: 'excellent'
 * });
 * ```
 */
const searchCustomers = async (sequelize, criteria, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const where = {};
    if (criteria.customerType)
        where.customerType = criteria.customerType;
    if (criteria.status)
        where.status = criteria.status;
    if (criteria.creditRating)
        where.creditRating = criteria.creditRating;
    if (criteria.customerName) {
        where.customerName = { [sequelize_1.Op.iLike]: `%${criteria.customerName}%` };
    }
    const customers = await Customer.findAll({
        where,
        order: [['customerNumber', 'ASC']],
        transaction,
    });
    return customers;
};
exports.searchCustomers = searchCustomers;
// ============================================================================
// INVOICE GENERATION AND POSTING (9-16)
// ============================================================================
/**
 * Creates a new AR invoice with validation.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateARInvoiceDto} invoiceData - Invoice data
 * @param {string} userId - User creating invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created invoice
 *
 * @example
 * ```typescript
 * const invoice = await createARInvoice(sequelize, {
 *   invoiceNumber: 'AR-2024-001',
 *   customerId: 1,
 *   invoiceDate: new Date(),
 *   grossAmount: 10000.00,
 *   lines: [...]
 * }, 'user123');
 * ```
 */
const createARInvoice = async (sequelize, invoiceData, userId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const Customer = (0, exports.createCustomerModel)(sequelize);
    // Validate customer exists and is active
    const customer = await Customer.findByPk(invoiceData.customerId, { transaction });
    if (!customer) {
        throw new Error(`Customer ${invoiceData.customerId} not found`);
    }
    if (customer.status === 'hold') {
        throw new Error(`Customer ${customer.customerNumber} is on credit hold`);
    }
    // Check for duplicate invoice
    const existing = await ARInvoice.findOne({
        where: { invoiceNumber: invoiceData.invoiceNumber },
        transaction,
    });
    if (existing) {
        throw new Error(`Invoice number ${invoiceData.invoiceNumber} already exists`);
    }
    // Calculate due date from payment terms
    const dueDate = (0, exports.calculateInvoiceDueDate)(invoiceData.invoiceDate, customer.paymentTerms);
    // Determine fiscal year and period
    const { fiscalYear, fiscalPeriod } = (0, exports.getFiscalYearPeriod)(invoiceData.invoiceDate);
    const invoice = await ARInvoice.create({
        invoiceNumber: invoiceData.invoiceNumber,
        customerId: invoiceData.customerId,
        invoiceDate: invoiceData.invoiceDate,
        dueDate,
        invoiceAmount: invoiceData.grossAmount - (invoiceData.taxAmount || 0),
        taxAmount: invoiceData.taxAmount || 0,
        freightAmount: 0,
        otherCharges: 0,
        grossAmount: invoiceData.grossAmount,
        appliedAmount: 0,
        unappliedAmount: 0,
        outstandingBalance: invoiceData.grossAmount,
        status: 'draft',
        disputeStatus: 'none',
        glDate: invoiceData.invoiceDate,
        fiscalYear,
        fiscalPeriod,
        salesOrderNumber: invoiceData.salesOrderNumber,
        description: invoiceData.lines[0]?.description || 'AR Invoice',
    }, { transaction });
    return invoice;
};
exports.createARInvoice = createARInvoice;
/**
 * Calculates invoice due date from invoice date and payment terms.
 *
 * @param {Date} invoiceDate - Invoice date
 * @param {string} paymentTerms - Payment terms (e.g., "Net 30")
 * @returns {Date} Due date
 *
 * @example
 * ```typescript
 * const dueDate = calculateInvoiceDueDate(new Date(), 'Net 30');
 * ```
 */
const calculateInvoiceDueDate = (invoiceDate, paymentTerms) => {
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
exports.calculateInvoiceDueDate = calculateInvoiceDueDate;
/**
 * Posts an AR invoice to GL.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {string} userId - User posting invoice
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted invoice
 *
 * @example
 * ```typescript
 * const invoice = await postARInvoice(sequelize, 1, 'user123');
 * ```
 */
const postARInvoice = async (sequelize, invoiceId, userId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status !== 'draft') {
        throw new Error(`Invoice ${invoiceId} is not in draft status`);
    }
    // In production, would create GL journal entry here
    await invoice.update({
        status: 'posted',
    }, { transaction });
    return invoice;
};
exports.postARInvoice = postARInvoice;
/**
 * Voids an AR invoice.
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
 * const invoice = await voidARInvoice(sequelize, 1, 'Duplicate entry', 'user123');
 * ```
 */
const voidARInvoice = async (sequelize, invoiceId, voidReason, userId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    if (invoice.status === 'paid' || invoice.appliedAmount > 0) {
        throw new Error(`Cannot void invoice ${invoiceId} with payments applied`);
    }
    await invoice.update({
        status: 'cancelled',
        outstandingBalance: 0,
    }, { transaction });
    return invoice;
};
exports.voidARInvoice = voidARInvoice;
/**
 * Retrieves invoices by status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} status - Invoice status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Invoices with specified status
 *
 * @example
 * ```typescript
 * const posted = await getInvoicesByStatus(sequelize, 'posted');
 * ```
 */
const getInvoicesByStatus = async (sequelize, status, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const invoices = await ARInvoice.findAll({
        where: { status },
        order: [['invoiceDate', 'ASC']],
        transaction,
    });
    return invoices;
};
exports.getInvoicesByStatus = getInvoicesByStatus;
/**
 * Gets overdue invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} [asOfDate] - As-of date (defaults to today)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Overdue invoices
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueInvoices(sequelize);
 * ```
 */
const getOverdueInvoices = async (sequelize, asOfDate, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const checkDate = asOfDate || new Date();
    const invoices = await ARInvoice.findAll({
        where: {
            dueDate: { [sequelize_1.Op.lt]: checkDate },
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        order: [['dueDate', 'ASC']],
        transaction,
    });
    return invoices;
};
exports.getOverdueInvoices = getOverdueInvoices;
/**
 * Generates invoice number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [prefix='AR'] - Invoice number prefix
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Invoice number
 *
 * @example
 * ```typescript
 * const invoiceNumber = await generateInvoiceNumber(sequelize, 'INV');
 * // Returns: "INV-2024-00001"
 * ```
 */
const generateInvoiceNumber = async (sequelize, prefix = 'AR', transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const year = new Date().getFullYear();
    const lastInvoice = await ARInvoice.findOne({
        where: {
            invoiceNumber: { [sequelize_1.Op.like]: `${prefix}-${year}-%` },
        },
        order: [['invoiceNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastInvoice) {
        const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
        if (match) {
            sequence = parseInt(match[1], 10) + 1;
        }
    }
    return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
};
exports.generateInvoiceNumber = generateInvoiceNumber;
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
    const month = date.getMonth() + 1;
    return {
        fiscalYear: year,
        fiscalPeriod: month,
    };
};
exports.getFiscalYearPeriod = getFiscalYearPeriod;
// ============================================================================
// CASH RECEIPT PROCESSING (17-24)
// ============================================================================
/**
 * Creates a cash receipt.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {ProcessCashReceiptDto} receiptData - Receipt data
 * @param {string} userId - User creating receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created receipt
 *
 * @example
 * ```typescript
 * const receipt = await createCashReceipt(sequelize, {
 *   receiptDate: new Date(),
 *   receiptMethod: 'check',
 *   customerId: 1,
 *   receiptAmount: 5000.00,
 *   bankAccountId: 1,
 *   checkNumber: '12345'
 * }, 'user123');
 * ```
 */
const createCashReceipt = async (sequelize, receiptData, userId, transaction) => {
    const CashReceipt = (0, exports.createCashReceiptModel)(sequelize);
    const Customer = (0, exports.createCustomerModel)(sequelize);
    // Validate customer exists
    const customer = await Customer.findByPk(receiptData.customerId, { transaction });
    if (!customer) {
        throw new Error(`Customer ${receiptData.customerId} not found`);
    }
    // Generate receipt number
    const receiptNumber = await (0, exports.generateReceiptNumber)(sequelize, receiptData.receiptMethod, transaction);
    const receipt = await CashReceipt.create({
        receiptNumber,
        receiptDate: receiptData.receiptDate,
        receiptMethod: receiptData.receiptMethod,
        customerId: receiptData.customerId,
        receiptAmount: receiptData.receiptAmount,
        unappliedAmount: receiptData.receiptAmount,
        bankAccountId: receiptData.bankAccountId,
        checkNumber: receiptData.checkNumber,
        status: 'unposted',
        currency: 'USD',
    }, { transaction });
    return receipt;
};
exports.createCashReceipt = createCashReceipt;
/**
 * Generates a unique receipt number.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} receiptMethod - Receipt method
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<string>} Receipt number
 *
 * @example
 * ```typescript
 * const receiptNumber = await generateReceiptNumber(sequelize, 'check');
 * // Returns: "CR-2024-00001"
 * ```
 */
const generateReceiptNumber = async (sequelize, receiptMethod, transaction) => {
    const CashReceipt = (0, exports.createCashReceiptModel)(sequelize);
    const prefix = 'CR';
    const year = new Date().getFullYear();
    const lastReceipt = await CashReceipt.findOne({
        where: {
            receiptNumber: { [sequelize_1.Op.like]: `${prefix}-${year}-%` },
        },
        order: [['receiptNumber', 'DESC']],
        transaction,
    });
    let sequence = 1;
    if (lastReceipt) {
        const match = lastReceipt.receiptNumber.match(/(\d+)$/);
        if (match) {
            sequence = parseInt(match[1], 10) + 1;
        }
    }
    return `${prefix}-${year}-${sequence.toString().padStart(5, '0')}`;
};
exports.generateReceiptNumber = generateReceiptNumber;
/**
 * Posts a cash receipt to GL.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {string} userId - User posting receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Posted receipt
 *
 * @example
 * ```typescript
 * const receipt = await postCashReceipt(sequelize, 1, 'user123');
 * ```
 */
const postCashReceipt = async (sequelize, receiptId, userId, transaction) => {
    const CashReceipt = (0, exports.createCashReceiptModel)(sequelize);
    const receipt = await CashReceipt.findByPk(receiptId, { transaction });
    if (!receipt) {
        throw new Error(`Receipt ${receiptId} not found`);
    }
    if (receipt.status !== 'unposted') {
        throw new Error(`Receipt ${receiptId} is not in unposted status`);
    }
    // In production, would create GL journal entry here
    await receipt.update({
        status: 'posted',
        postedDate: new Date(),
    }, { transaction });
    return receipt;
};
exports.postCashReceipt = postCashReceipt;
/**
 * Applies cash receipt to invoices.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number[]} invoiceIds - Invoice IDs to apply to
 * @param {string} userId - User applying receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated receipt
 *
 * @example
 * ```typescript
 * const receipt = await applyCashReceipt(sequelize, 1, [1, 2, 3], 'user123');
 * ```
 */
const applyCashReceipt = async (sequelize, receiptId, invoiceIds, userId, transaction) => {
    const CashReceipt = (0, exports.createCashReceiptModel)(sequelize);
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const receipt = await CashReceipt.findByPk(receiptId, { transaction });
    if (!receipt) {
        throw new Error(`Receipt ${receiptId} not found`);
    }
    if (receipt.status !== 'posted') {
        throw new Error(`Receipt ${receiptId} must be posted before application`);
    }
    let remainingAmount = Number(receipt.unappliedAmount);
    for (const invoiceId of invoiceIds) {
        if (remainingAmount <= 0)
            break;
        const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
        if (!invoice)
            continue;
        if (invoice.customerId !== receipt.customerId) {
            throw new Error(`Invoice ${invoice.invoiceNumber} is not for customer ${receipt.customerId}`);
        }
        const applyAmount = Math.min(remainingAmount, Number(invoice.outstandingBalance));
        await (0, exports.createReceiptApplication)(sequelize, receiptId, invoiceId, applyAmount, transaction);
        await invoice.update({
            appliedAmount: Number(invoice.appliedAmount) + applyAmount,
            outstandingBalance: Number(invoice.outstandingBalance) - applyAmount,
            status: Number(invoice.outstandingBalance) - applyAmount <= 0.01 ? 'paid' : 'partial_paid',
        }, { transaction });
        remainingAmount -= applyAmount;
    }
    await receipt.update({
        unappliedAmount: remainingAmount,
        status: remainingAmount > 0 ? 'posted' : 'applied',
    }, { transaction });
    return receipt;
};
exports.applyCashReceipt = applyCashReceipt;
/**
 * Creates a receipt application record.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {number} invoiceId - Invoice ID
 * @param {number} appliedAmount - Applied amount
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Receipt application record
 *
 * @example
 * ```typescript
 * const application = await createReceiptApplication(sequelize, 1, 2, 1000);
 * ```
 */
const createReceiptApplication = async (sequelize, receiptId, invoiceId, appliedAmount, transaction) => {
    const [results] = await sequelize.query(`INSERT INTO ar_receipt_applications
     (receipt_id, invoice_id, applied_amount, application_date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`, {
        bind: [receiptId, invoiceId, appliedAmount, new Date()],
        type: 'INSERT',
        transaction,
    });
    return results;
};
exports.createReceiptApplication = createReceiptApplication;
/**
 * Reverses a cash receipt.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {string} reversalReason - Reason for reversal
 * @param {string} userId - User reversing receipt
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reversed receipt
 *
 * @example
 * ```typescript
 * const receipt = await reverseCashReceipt(sequelize, 1, 'NSF check', 'user123');
 * ```
 */
const reverseCashReceipt = async (sequelize, receiptId, reversalReason, userId, transaction) => {
    const CashReceipt = (0, exports.createCashReceiptModel)(sequelize);
    const receipt = await CashReceipt.findByPk(receiptId, { transaction });
    if (!receipt) {
        throw new Error(`Receipt ${receiptId} not found`);
    }
    // Reverse all applications
    await (0, exports.reverseReceiptApplications)(sequelize, receiptId, transaction);
    await receipt.update({
        status: 'reversed',
        reversalDate: new Date(),
        reversalReason,
        unappliedAmount: Number(receipt.receiptAmount),
    }, { transaction });
    return receipt;
};
exports.reverseCashReceipt = reverseCashReceipt;
/**
 * Reverses receipt applications.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} receiptId - Receipt ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await reverseReceiptApplications(sequelize, 1);
 * ```
 */
const reverseReceiptApplications = async (sequelize, receiptId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const [applications] = await sequelize.query(`SELECT * FROM ar_receipt_applications WHERE receipt_id = $1`, {
        bind: [receiptId],
        type: 'SELECT',
        transaction,
    });
    for (const app of applications) {
        const invoice = await ARInvoice.findByPk(app.invoice_id, { transaction });
        if (invoice) {
            await invoice.update({
                appliedAmount: Number(invoice.appliedAmount) - Number(app.applied_amount),
                outstandingBalance: Number(invoice.outstandingBalance) + Number(app.applied_amount),
                status: 'posted',
            }, { transaction });
        }
    }
};
exports.reverseReceiptApplications = reverseReceiptApplications;
/**
 * Processes lockbox file.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} lockboxBatchId - Lockbox batch ID
 * @param {any[]} lockboxRecords - Lockbox records
 * @param {string} userId - User processing lockbox
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Processing results
 *
 * @example
 * ```typescript
 * const results = await processLockboxFile(sequelize, 'LB-2024-001', lockboxData, 'user123');
 * ```
 */
const processLockboxFile = async (sequelize, lockboxBatchId, lockboxRecords, userId, transaction) => {
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    for (const record of lockboxRecords) {
        try {
            const receipt = await (0, exports.createCashReceipt)(sequelize, {
                receiptDate: record.receiptDate,
                receiptMethod: 'lockbox',
                customerId: record.customerId,
                receiptAmount: record.amount,
                bankAccountId: record.bankAccountId,
                checkNumber: record.checkNumber,
            }, userId, transaction);
            if (record.invoiceIds && record.invoiceIds.length > 0) {
                await (0, exports.postCashReceipt)(sequelize, receipt.id, userId, transaction);
                await (0, exports.applyCashReceipt)(sequelize, receipt.id, record.invoiceIds, userId, transaction);
            }
            successCount++;
        }
        catch (error) {
            errorCount++;
            errors.push({ record, error: error.message });
        }
    }
    return {
        lockboxBatchId,
        totalRecords: lockboxRecords.length,
        successCount,
        errorCount,
        errors,
    };
};
exports.processLockboxFile = processLockboxFile;
// ============================================================================
// COLLECTIONS MANAGEMENT (25-32)
// ============================================================================
/**
 * Creates a collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {CreateCollectionsCaseDto} caseData - Case data
 * @param {string} userId - User creating case
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CollectionsCase>} Created case
 *
 * @example
 * ```typescript
 * const case = await createCollectionsCase(sequelize, {
 *   customerId: 1,
 *   collectorId: 'collector1',
 *   priority: 'high'
 * }, 'user123');
 * ```
 */
const createCollectionsCase = async (sequelize, caseData, userId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    // Get oldest invoice and total outstanding
    const invoices = await ARInvoice.findAll({
        where: {
            customerId: caseData.customerId,
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        order: [['invoiceDate', 'ASC']],
        transaction,
    });
    if (invoices.length === 0) {
        throw new Error(`No outstanding invoices for customer ${caseData.customerId}`);
    }
    const totalOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.outstandingBalance), 0);
    const oldestInvoice = invoices[0];
    const daysOutstanding = Math.floor((new Date().getTime() - oldestInvoice.invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
    const caseNumber = `COLL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const collectionsCase = {
        caseId: Date.now(),
        customerId: caseData.customerId,
        caseNumber,
        caseDate: new Date(),
        totalOutstanding,
        oldestInvoiceDate: oldestInvoice.invoiceDate,
        daysOutstanding,
        collectorId: caseData.collectorId,
        priority: caseData.priority,
        status: 'open',
    };
    return collectionsCase;
};
exports.createCollectionsCase = createCollectionsCase;
/**
 * Adds activity to collections case.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} activityType - Activity type
 * @param {string} activityNotes - Activity notes
 * @param {string} collectorId - Collector ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CollectionsActivity>} Created activity
 *
 * @example
 * ```typescript
 * const activity = await addCollectionsActivity(sequelize, 1, 'call', 'Left voicemail', 'collector1');
 * ```
 */
const addCollectionsActivity = async (sequelize, caseId, activityType, activityNotes, collectorId, transaction) => {
    const activity = {
        activityId: Date.now(),
        caseId,
        activityDate: new Date(),
        activityType: activityType,
        contactedPerson: '',
        activityNotes,
        collectorId,
    };
    return activity;
};
exports.addCollectionsActivity = addCollectionsActivity;
/**
 * Updates collections case status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} caseId - Case ID
 * @param {string} newStatus - New status
 * @param {string} userId - User updating case
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated case
 *
 * @example
 * ```typescript
 * const case = await updateCollectionsCaseStatus(sequelize, 1, 'resolved', 'user123');
 * ```
 */
const updateCollectionsCaseStatus = async (sequelize, caseId, newStatus, userId, transaction) => {
    // In production, would update actual case record
    return {
        caseId,
        status: newStatus,
        updatedBy: userId,
        updatedAt: new Date(),
    };
};
exports.updateCollectionsCaseStatus = updateCollectionsCaseStatus;
/**
 * Gets open collections cases.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} [collectorId] - Optional collector filter
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Open cases
 *
 * @example
 * ```typescript
 * const cases = await getOpenCollectionsCases(sequelize, 'collector1');
 * ```
 */
const getOpenCollectionsCases = async (sequelize, collectorId, transaction) => {
    // In production, would query actual collections case table
    return [];
};
exports.getOpenCollectionsCases = getOpenCollectionsCases;
/**
 * Runs dunning process for overdue customers.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} dunningLevel - Dunning level (1-5)
 * @param {string} userId - User running dunning
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<DunningRun>} Dunning run results
 *
 * @example
 * ```typescript
 * const run = await runDunningProcess(sequelize, 1, 'user123');
 * ```
 */
const runDunningProcess = async (sequelize, dunningLevel, userId, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    // Get customers with overdue invoices
    const overdueInvoices = await (0, exports.getOverdueInvoices)(sequelize, new Date(), transaction);
    const customerIds = new Set(overdueInvoices.map(inv => inv.customerId));
    let totalAmount = 0;
    for (const customerId of customerIds) {
        const customer = await Customer.findByPk(customerId, { transaction });
        if (!customer)
            continue;
        const customerOverdue = overdueInvoices.filter(inv => inv.customerId === customerId);
        const customerTotal = customerOverdue.reduce((sum, inv) => sum + Number(inv.outstandingBalance), 0);
        totalAmount += customerTotal;
        // Update customer dunning level
        await customer.update({
            dunningLevel,
            lastDunningDate: new Date(),
        }, { transaction });
    }
    const runNumber = `DUN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const run = {
        runId: Date.now(),
        runNumber,
        runDate: new Date(),
        dunningLevel,
        customerCount: customerIds.size,
        totalAmount,
        status: 'completed',
        processedBy: userId,
        processedAt: new Date(),
    };
    return run;
};
exports.runDunningProcess = runDunningProcess;
/**
 * Gets customers eligible for dunning.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} daysPastDue - Minimum days past due
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Eligible customers
 *
 * @example
 * ```typescript
 * const eligible = await getCustomersEligibleForDunning(sequelize, 30);
 * ```
 */
const getCustomersEligibleForDunning = async (sequelize, daysPastDue, transaction) => {
    const overdueDate = new Date();
    overdueDate.setDate(overdueDate.getDate() - daysPastDue);
    const overdueInvoices = await (0, exports.getOverdueInvoices)(sequelize, overdueDate, transaction);
    const customerMap = new Map();
    for (const invoice of overdueInvoices) {
        if (!customerMap.has(invoice.customerId)) {
            customerMap.set(invoice.customerId, {
                customerId: invoice.customerId,
                invoiceCount: 0,
                totalOverdue: 0,
                oldestDueDate: invoice.dueDate,
            });
        }
        const customer = customerMap.get(invoice.customerId);
        customer.invoiceCount++;
        customer.totalOverdue += Number(invoice.outstandingBalance);
        if (invoice.dueDate < customer.oldestDueDate) {
            customer.oldestDueDate = invoice.dueDate;
        }
    }
    return Array.from(customerMap.values());
};
exports.getCustomersEligibleForDunning = getCustomersEligibleForDunning;
/**
 * Creates payment plan for customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {number} totalAmount - Total plan amount
 * @param {number} numberOfPayments - Number of payments
 * @param {string} frequency - Payment frequency
 * @param {string} userId - User creating plan
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<PaymentPlan>} Created payment plan
 *
 * @example
 * ```typescript
 * const plan = await createPaymentPlan(sequelize, 1, 10000, 12, 'monthly', 'user123');
 * ```
 */
const createPaymentPlan = async (sequelize, customerId, totalAmount, numberOfPayments, frequency, userId, transaction) => {
    const paymentAmount = totalAmount / numberOfPayments;
    const nextPaymentDate = new Date();
    if (frequency === 'weekly') {
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
    }
    else if (frequency === 'biweekly') {
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 14);
    }
    else {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }
    const plan = {
        planId: Date.now(),
        customerId,
        planStartDate: new Date(),
        totalAmount,
        numberOfPayments,
        paymentFrequency: frequency,
        paymentAmount,
        nextPaymentDate,
        status: 'active',
    };
    return plan;
};
exports.createPaymentPlan = createPaymentPlan;
/**
 * Processes payment plan payment.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} planId - Payment plan ID
 * @param {number} paymentAmount - Payment amount
 * @param {string} userId - User processing payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated plan
 *
 * @example
 * ```typescript
 * const plan = await processPaymentPlanPayment(sequelize, 1, 833.33, 'user123');
 * ```
 */
const processPaymentPlanPayment = async (sequelize, planId, paymentAmount, userId, transaction) => {
    // In production, would update payment plan and create receipt
    return {
        planId,
        paymentAmount,
        processedBy: userId,
        processedAt: new Date(),
    };
};
exports.processPaymentPlanPayment = processPaymentPlanPayment;
// ============================================================================
// REPORTING AND ANALYTICS (33-45)
// ============================================================================
/**
 * Generates accounts receivable aging report.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} asOfDate - Aging as-of date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<ARAgingBucket[]>} Aging buckets by customer
 *
 * @example
 * ```typescript
 * const aging = await generateARAgingReport(sequelize, new Date());
 * ```
 */
const generateARAgingReport = async (sequelize, asOfDate, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const invoices = await ARInvoice.findAll({
        where: {
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    });
    const customerBuckets = new Map();
    for (const invoice of invoices) {
        if (!customerBuckets.has(invoice.customerId)) {
            const customer = await Customer.findByPk(invoice.customerId, { transaction });
            if (!customer)
                continue;
            customerBuckets.set(invoice.customerId, {
                customerId: customer.id,
                customerNumber: customer.customerNumber,
                customerName: customer.customerName,
                current: 0,
                days1To30: 0,
                days31To60: 0,
                days61To90: 0,
                days91To120: 0,
                over120: 0,
                totalOutstanding: 0,
            });
        }
        const bucket = customerBuckets.get(invoice.customerId);
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
    return Array.from(customerBuckets.values()).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
};
exports.generateARAgingReport = generateARAgingReport;
/**
 * Generates customer statement.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Date} statementDate - Statement date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<CustomerStatement>} Customer statement
 *
 * @example
 * ```typescript
 * const statement = await generateCustomerStatement(sequelize, 1, new Date());
 * ```
 */
const generateCustomerStatement = async (sequelize, customerId, statementDate, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const CashReceipt = (0, exports.createCashReceiptModel)(sequelize);
    const monthStart = new Date(statementDate.getFullYear(), statementDate.getMonth(), 1);
    const monthEnd = new Date(statementDate.getFullYear(), statementDate.getMonth() + 1, 0);
    const invoices = await ARInvoice.findAll({
        where: {
            customerId,
            invoiceDate: { [sequelize_1.Op.between]: [monthStart, monthEnd] },
        },
        transaction,
    });
    const receipts = await CashReceipt.findAll({
        where: {
            customerId,
            receiptDate: { [sequelize_1.Op.between]: [monthStart, monthEnd] },
            status: { [sequelize_1.Op.in]: ['posted', 'applied'] },
        },
        transaction,
    });
    const totalCharges = invoices.reduce((sum, inv) => sum + Number(inv.grossAmount), 0);
    const totalPayments = receipts.reduce((sum, rec) => sum + Number(rec.receiptAmount), 0);
    const currentBalance = (await ARInvoice.sum('outstandingBalance', {
        where: {
            customerId,
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    })) || 0;
    const pastDue = (await ARInvoice.sum('outstandingBalance', {
        where: {
            customerId,
            dueDate: { [sequelize_1.Op.lt]: statementDate },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    })) || 0;
    const statement = {
        statementId: Date.now(),
        customerId,
        statementDate,
        beginningBalance: currentBalance - totalCharges + totalPayments,
        charges: totalCharges,
        payments: totalPayments,
        adjustments: 0,
        endingBalance: currentBalance,
        currentDue: currentBalance - pastDue,
        pastDue,
    };
    return statement;
};
exports.generateCustomerStatement = generateCustomerStatement;
/**
 * Gets top customers by revenue.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [limit=10] - Number of top customers
 * @param {number} [days=365] - Analysis period in days
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Top customers
 *
 * @example
 * ```typescript
 * const topCustomers = await getTopCustomersByRevenue(sequelize, 10, 365);
 * ```
 */
const getTopCustomersByRevenue = async (sequelize, limit = 10, days = 365, transaction) => {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const [results] = await sequelize.query(`SELECT
      c.id,
      c.customer_number,
      c.customer_name,
      COUNT(i.id) as invoice_count,
      SUM(i.gross_amount) as total_revenue,
      SUM(i.outstanding_balance) as current_balance
     FROM ar_customers c
     JOIN ar_invoices i ON i.customer_id = c.id
     WHERE i.invoice_date >= $1
       AND i.status NOT IN ('cancelled', 'written_off')
     GROUP BY c.id, c.customer_number, c.customer_name
     ORDER BY total_revenue DESC
     LIMIT $2`, {
        bind: [sinceDate, limit],
        type: 'SELECT',
        transaction,
    });
    return results;
};
exports.getTopCustomersByRevenue = getTopCustomersByRevenue;
/**
 * Calculates DSO (Days Sales Outstanding).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} DSO in days
 *
 * @example
 * ```typescript
 * const dso = await calculateDSO(sequelize, 90);
 * ```
 */
const calculateDSO = async (sequelize, days = 90, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const totalAR = (await ARInvoice.sum('outstandingBalance', {
        where: {
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    })) || 0;
    const totalSales = (await ARInvoice.sum('grossAmount', {
        where: {
            invoiceDate: { [sequelize_1.Op.gte]: sinceDate },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    })) || 0;
    if (totalSales === 0)
        return 0;
    const dso = (totalAR / totalSales) * days;
    return Math.round(dso * 10) / 10;
};
exports.calculateDSO = calculateDSO;
/**
 * Creates bad debt write-off.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {number} writeOffAmount - Amount to write off
 * @param {string} writeOffReason - Reason for write-off
 * @param {string} userId - User creating write-off
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<WriteOff>} Created write-off
 *
 * @example
 * ```typescript
 * const writeOff = await createBadDebtWriteOff(sequelize, 1, 5000, 'Customer bankruptcy', 'user123');
 * ```
 */
const createBadDebtWriteOff = async (sequelize, invoiceId, writeOffAmount, writeOffReason, userId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    if (writeOffAmount > Number(invoice.outstandingBalance)) {
        throw new Error(`Write-off amount exceeds outstanding balance`);
    }
    // Update invoice
    await invoice.update({
        outstandingBalance: Number(invoice.outstandingBalance) - writeOffAmount,
        status: Number(invoice.outstandingBalance) - writeOffAmount <= 0.01 ? 'written_off' : invoice.status,
    }, { transaction });
    const writeOff = {
        writeOffId: Date.now(),
        invoiceId,
        customerId: invoice.customerId,
        writeOffDate: new Date(),
        writeOffAmount,
        writeOffReason,
        writeOffType: 'bad_debt',
        approvedBy: userId,
    };
    return writeOff;
};
exports.createBadDebtWriteOff = createBadDebtWriteOff;
/**
 * Creates dispute for invoice.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} invoiceId - Invoice ID
 * @param {number} disputeAmount - Disputed amount
 * @param {string} disputeReason - Dispute reason
 * @param {string} disputeCategory - Dispute category
 * @param {string} userId - User creating dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Dispute>} Created dispute
 *
 * @example
 * ```typescript
 * const dispute = await createInvoiceDispute(sequelize, 1, 1000, 'Incorrect pricing', 'pricing', 'user123');
 * ```
 */
const createInvoiceDispute = async (sequelize, invoiceId, disputeAmount, disputeReason, disputeCategory, userId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const invoice = await ARInvoice.findByPk(invoiceId, { transaction });
    if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
    }
    await invoice.update({
        disputeStatus: 'under_review',
    }, { transaction });
    const dispute = {
        disputeId: Date.now(),
        invoiceId,
        customerId: invoice.customerId,
        disputeDate: new Date(),
        disputeAmount,
        disputeReason,
        disputeCategory: disputeCategory,
        status: 'open',
    };
    return dispute;
};
exports.createInvoiceDispute = createInvoiceDispute;
/**
 * Resolves invoice dispute.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} disputeId - Dispute ID
 * @param {string} resolution - Resolution decision ('approved' or 'rejected')
 * @param {string} resolutionNotes - Resolution notes
 * @param {string} userId - User resolving dispute
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Dispute>} Resolved dispute
 *
 * @example
 * ```typescript
 * const dispute = await resolveInvoiceDispute(sequelize, 1, 'approved', 'Credit memo issued', 'user123');
 * ```
 */
const resolveInvoiceDispute = async (sequelize, disputeId, resolution, resolutionNotes, userId, transaction) => {
    // In production, would update actual dispute record
    const dispute = {
        disputeId,
        invoiceId: 0,
        customerId: 0,
        disputeDate: new Date(),
        disputeAmount: 0,
        disputeReason: '',
        disputeCategory: 'other',
        status: 'resolved',
        resolutionDate: new Date(),
        resolutionNotes,
    };
    return dispute;
};
exports.resolveInvoiceDispute = resolveInvoiceDispute;
/**
 * Gets collection effectiveness metrics.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} [days=90] - Analysis period
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Collection metrics
 *
 * @example
 * ```typescript
 * const metrics = await getCollectionEffectivenessMetrics(sequelize, 90);
 * ```
 */
const getCollectionEffectivenessMetrics = async (sequelize, days = 90, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const CashReceipt = (0, exports.createCashReceiptModel)(sequelize);
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);
    const invoiced = (await ARInvoice.sum('grossAmount', {
        where: {
            invoiceDate: { [sequelize_1.Op.gte]: sinceDate },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    })) || 0;
    const collected = (await CashReceipt.sum('receiptAmount', {
        where: {
            receiptDate: { [sequelize_1.Op.gte]: sinceDate },
            status: { [sequelize_1.Op.in]: ['posted', 'applied'] },
        },
        transaction,
    })) || 0;
    const currentAR = (await ARInvoice.sum('outstandingBalance', {
        where: {
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        transaction,
    })) || 0;
    const collectionRate = invoiced > 0 ? (collected / invoiced) * 100 : 0;
    return {
        periodDays: days,
        totalInvoiced: invoiced,
        totalCollected: collected,
        currentOutstanding: currentAR,
        collectionRate: Math.round(collectionRate * 100) / 100,
    };
};
exports.getCollectionEffectivenessMetrics = getCollectionEffectivenessMetrics;
/**
 * Gets customers exceeding credit limit.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Customers over limit
 *
 * @example
 * ```typescript
 * const overLimit = await getCustomersOverCreditLimit(sequelize);
 * ```
 */
const getCustomersOverCreditLimit = async (sequelize, transaction) => {
    const Customer = (0, exports.createCustomerModel)(sequelize);
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const customers = await Customer.findAll({
        where: {
            status: { [sequelize_1.Op.in]: ['active', 'hold'] },
        },
        transaction,
    });
    const overLimit = [];
    for (const customer of customers) {
        const currentBalance = (await ARInvoice.sum('outstandingBalance', {
            where: {
                customerId: customer.id,
                status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
            },
            transaction,
        })) || 0;
        if (currentBalance > customer.creditLimit) {
            overLimit.push({
                customerId: customer.id,
                customerNumber: customer.customerNumber,
                customerName: customer.customerName,
                creditLimit: customer.creditLimit,
                currentBalance,
                overage: currentBalance - customer.creditLimit,
            });
        }
    }
    return overLimit.sort((a, b) => b.overage - a.overage);
};
exports.getCustomersOverCreditLimit = getCustomersOverCreditLimit;
/**
 * Generates cash forecast from AR.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Date} startDate - Forecast start date
 * @param {Date} endDate - Forecast end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Cash forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateCashForecast(
 *   sequelize,
 *   new Date(),
 *   new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
 * );
 * ```
 */
const generateCashForecast = async (sequelize, startDate, endDate, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const invoices = await ARInvoice.findAll({
        where: {
            dueDate: { [sequelize_1.Op.between]: [startDate, endDate] },
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        order: [['dueDate', 'ASC']],
        transaction,
    });
    const forecastByDate = new Map();
    for (const invoice of invoices) {
        const dateKey = invoice.dueDate.toISOString().split('T')[0];
        const current = forecastByDate.get(dateKey) || 0;
        forecastByDate.set(dateKey, current + Number(invoice.outstandingBalance));
    }
    const dailyForecast = Array.from(forecastByDate.entries()).map(([date, amount]) => ({
        date,
        expectedReceipts: amount,
    }));
    const totalExpected = Array.from(forecastByDate.values()).reduce((sum, amt) => sum + amt, 0);
    return {
        forecastStart: startDate,
        forecastEnd: endDate,
        totalExpectedReceipts: totalExpected,
        dailyForecast,
    };
};
exports.generateCashForecast = generateCashForecast;
/**
 * Gets outstanding invoices by customer.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} customerId - Customer ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Outstanding invoices
 *
 * @example
 * ```typescript
 * const outstanding = await getOutstandingInvoicesByCustomer(sequelize, 1);
 * ```
 */
const getOutstandingInvoicesByCustomer = async (sequelize, customerId, transaction) => {
    const ARInvoice = (0, exports.createARInvoiceModel)(sequelize);
    const invoices = await ARInvoice.findAll({
        where: {
            customerId,
            outstandingBalance: { [sequelize_1.Op.gt]: 0 },
            status: { [sequelize_1.Op.notIn]: ['cancelled', 'written_off'] },
        },
        order: [['dueDate', 'ASC']],
        transaction,
    });
    return invoices;
};
exports.getOutstandingInvoicesByCustomer = getOutstandingInvoicesByCustomer;
//# sourceMappingURL=accounts-receivable-management-kit.js.map