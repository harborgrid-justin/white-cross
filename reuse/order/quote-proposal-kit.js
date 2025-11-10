"use strict";
/**
 * LOC: QOTPRO001
 * File: /reuse/order/quote-proposal-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (ORM for database operations)
 *   - @nestjs/common (NestJS framework)
 *   - @nestjs/swagger (API documentation)
 *   - Product configurator services
 *   - Pricing engine services
 *
 * DOWNSTREAM (imported by):
 *   - Backend order management modules
 *   - Sales quote services
 *   - Proposal generation services
 *   - Order conversion workflows
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
exports.createQuoteTemplateModel = exports.createQuoteLineModel = exports.createQuoteHeaderModel = exports.QuoteAnalyticsRequestDto = exports.QuoteSearchDto = exports.CreateQuoteTemplateDto = exports.ConvertQuoteToOrderDto = exports.ApproveQuoteDto = exports.UpdateQuoteDto = exports.CreateQuoteLineDto = exports.CreateQuoteDto = void 0;
exports.createQuote = createQuote;
exports.generateQuoteFromTemplate = generateQuoteFromTemplate;
exports.generateQuoteNumber = generateQuoteNumber;
exports.duplicateQuote = duplicateQuote;
exports.createQuoteTemplate = createQuoteTemplate;
exports.getQuoteTemplate = getQuoteTemplate;
exports.listQuoteTemplates = listQuoteTemplates;
exports.updateQuoteTemplate = updateQuoteTemplate;
exports.createQuoteVersion = createQuoteVersion;
exports.archiveQuoteVersion = archiveQuoteVersion;
exports.getQuoteVersionHistory = getQuoteVersionHistory;
exports.compareQuoteVersions = compareQuoteVersions;
exports.checkExpiringQuotes = checkExpiringQuotes;
exports.processExpiredQuotes = processExpiredQuotes;
exports.extendQuoteExpiration = extendQuoteExpiration;
exports.sendExpirationNotifications = sendExpirationNotifications;
exports.submitQuoteForApproval = submitQuoteForApproval;
exports.processQuoteApproval = processQuoteApproval;
exports.getApprovalWorkflow = getApprovalWorkflow;
exports.getQuoteApprovals = getQuoteApprovals;
exports.convertQuoteToOrder = convertQuoteToOrder;
exports.validateQuoteForConversion = validateQuoteForConversion;
exports.previewQuoteToOrder = previewQuoteToOrder;
exports.configureProduct = configureProduct;
exports.validateProductConfiguration = validateProductConfiguration;
exports.calculateConfigurationPrice = calculateConfigurationPrice;
exports.getProductConfigurationOptions = getProductConfigurationOptions;
exports.calculateQuoteTotals = calculateQuoteTotals;
exports.calculateLinePricing = calculateLinePricing;
exports.getPricingRules = getPricingRules;
exports.recalculateQuotePricing = recalculateQuotePricing;
exports.applyQuoteDiscount = applyQuoteDiscount;
exports.submitDiscountForApproval = submitDiscountForApproval;
exports.approveDiscount = approveDiscount;
exports.compareQuotes = compareQuotes;
exports.generateCompetitiveAnalysis = generateCompetitiveAnalysis;
exports.getQuoteAnalytics = getQuoteAnalytics;
exports.calculateConversionMetrics = calculateConversionMetrics;
exports.getQuotePipelineAnalytics = getQuotePipelineAnalytics;
/**
 * File: /reuse/order/quote-proposal-kit.ts
 * Locator: WC-ORD-QOTPRO-001
 * Purpose: Quote & Proposal Management - Quote generation, versioning, approval, conversion
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: ../backend/order/*, Sales Quote Services, Proposal Management, Order Conversion
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 38 functions for quote creation, templates, versioning, approval workflows, quote-to-order conversion,
 *          product configurator integration, pricing calculations, discount approvals, quote comparison, analytics
 *
 * LLM Context: Enterprise-grade quote and proposal management for sales operations.
 * Provides comprehensive quote lifecycle management including quote creation with configurable products,
 * template-based quote generation, version control and revision tracking, expiration handling and renewal,
 * multi-level approval workflows, automated quote-to-order conversion, real-time pricing calculations,
 * discount approval routing, competitive quote comparison, analytics and reporting, customer portal integration,
 * e-signature support, and audit trail for compliance. Supports complex B2B sales scenarios with
 * configurable products, tiered pricing, volume discounts, and multi-currency quotes.
 */
const sequelize_1 = require("sequelize");
const swagger_1 = require("@nestjs/swagger");
// ============================================================================
// DTO CLASSES
// ============================================================================
let CreateQuoteDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _contactId_decorators;
    let _contactId_initializers = [];
    let _contactId_extraInitializers = [];
    let _salesRepId_decorators;
    let _salesRepId_initializers = [];
    let _salesRepId_extraInitializers = [];
    let _quoteDate_decorators;
    let _quoteDate_initializers = [];
    let _quoteDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _deliveryTerms_decorators;
    let _deliveryTerms_initializers = [];
    let _deliveryTerms_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _internalNotes_decorators;
    let _internalNotes_initializers = [];
    let _internalNotes_extraInitializers = [];
    let _templateId_decorators;
    let _templateId_initializers = [];
    let _templateId_extraInitializers = [];
    return _a = class CreateQuoteDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.contactId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _contactId_initializers, void 0));
                this.salesRepId = (__runInitializers(this, _contactId_extraInitializers), __runInitializers(this, _salesRepId_initializers, void 0));
                this.quoteDate = (__runInitializers(this, _salesRepId_extraInitializers), __runInitializers(this, _quoteDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _quoteDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.currency = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.paymentTerms = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
                this.deliveryTerms = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _deliveryTerms_initializers, void 0));
                this.lineItems = (__runInitializers(this, _deliveryTerms_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
                this.notes = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.internalNotes = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _internalNotes_initializers, void 0));
                this.templateId = (__runInitializers(this, _internalNotes_extraInitializers), __runInitializers(this, _templateId_initializers, void 0));
                __runInitializers(this, _templateId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' })];
            _contactId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact ID', required: false })];
            _salesRepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sales representative ID' })];
            _quoteDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quote date', example: '2024-01-15' })];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', example: '2024-02-15' })];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code', example: 'USD', default: 'USD' })];
            _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms', example: 'Net 30' })];
            _deliveryTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery terms', example: 'FOB Origin' })];
            _lineItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quote line items', type: [Object] })];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer notes', required: false })];
            _internalNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Internal notes', required: false })];
            _templateId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template ID to use', required: false })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _contactId_decorators, { kind: "field", name: "contactId", static: false, private: false, access: { has: obj => "contactId" in obj, get: obj => obj.contactId, set: (obj, value) => { obj.contactId = value; } }, metadata: _metadata }, _contactId_initializers, _contactId_extraInitializers);
            __esDecorate(null, null, _salesRepId_decorators, { kind: "field", name: "salesRepId", static: false, private: false, access: { has: obj => "salesRepId" in obj, get: obj => obj.salesRepId, set: (obj, value) => { obj.salesRepId = value; } }, metadata: _metadata }, _salesRepId_initializers, _salesRepId_extraInitializers);
            __esDecorate(null, null, _quoteDate_decorators, { kind: "field", name: "quoteDate", static: false, private: false, access: { has: obj => "quoteDate" in obj, get: obj => obj.quoteDate, set: (obj, value) => { obj.quoteDate = value; } }, metadata: _metadata }, _quoteDate_initializers, _quoteDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
            __esDecorate(null, null, _deliveryTerms_decorators, { kind: "field", name: "deliveryTerms", static: false, private: false, access: { has: obj => "deliveryTerms" in obj, get: obj => obj.deliveryTerms, set: (obj, value) => { obj.deliveryTerms = value; } }, metadata: _metadata }, _deliveryTerms_initializers, _deliveryTerms_extraInitializers);
            __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _internalNotes_decorators, { kind: "field", name: "internalNotes", static: false, private: false, access: { has: obj => "internalNotes" in obj, get: obj => obj.internalNotes, set: (obj, value) => { obj.internalNotes = value; } }, metadata: _metadata }, _internalNotes_initializers, _internalNotes_extraInitializers);
            __esDecorate(null, null, _templateId_decorators, { kind: "field", name: "templateId", static: false, private: false, access: { has: obj => "templateId" in obj, get: obj => obj.templateId, set: (obj, value) => { obj.templateId = value; } }, metadata: _metadata }, _templateId_initializers, _templateId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateQuoteDto = CreateQuoteDto;
let CreateQuoteLineDto = (() => {
    var _a;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _unitPrice_decorators;
    let _unitPrice_initializers = [];
    let _unitPrice_extraInitializers = [];
    let _discountPercent_decorators;
    let _discountPercent_initializers = [];
    let _discountPercent_extraInitializers = [];
    let _configuration_decorators;
    let _configuration_initializers = [];
    let _configuration_extraInitializers = [];
    let _deliveryDate_decorators;
    let _deliveryDate_initializers = [];
    let _deliveryDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreateQuoteLineDto {
            constructor() {
                this.productId = __runInitializers(this, _productId_initializers, void 0);
                this.quantity = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.unitPrice = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
                this.discountPercent = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _discountPercent_initializers, void 0));
                this.configuration = (__runInitializers(this, _discountPercent_extraInitializers), __runInitializers(this, _configuration_initializers, void 0));
                this.deliveryDate = (__runInitializers(this, _configuration_extraInitializers), __runInitializers(this, _deliveryDate_initializers, void 0));
                this.notes = (__runInitializers(this, _deliveryDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' })];
            _quantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity' })];
            _unitPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit price', required: false })];
            _discountPercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discount percent', required: false, default: 0 })];
            _configuration_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product configuration', required: false })];
            _deliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested delivery date', required: false })];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line item notes', required: false })];
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: obj => "unitPrice" in obj, get: obj => obj.unitPrice, set: (obj, value) => { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
            __esDecorate(null, null, _discountPercent_decorators, { kind: "field", name: "discountPercent", static: false, private: false, access: { has: obj => "discountPercent" in obj, get: obj => obj.discountPercent, set: (obj, value) => { obj.discountPercent = value; } }, metadata: _metadata }, _discountPercent_initializers, _discountPercent_extraInitializers);
            __esDecorate(null, null, _configuration_decorators, { kind: "field", name: "configuration", static: false, private: false, access: { has: obj => "configuration" in obj, get: obj => obj.configuration, set: (obj, value) => { obj.configuration = value; } }, metadata: _metadata }, _configuration_initializers, _configuration_extraInitializers);
            __esDecorate(null, null, _deliveryDate_decorators, { kind: "field", name: "deliveryDate", static: false, private: false, access: { has: obj => "deliveryDate" in obj, get: obj => obj.deliveryDate, set: (obj, value) => { obj.deliveryDate = value; } }, metadata: _metadata }, _deliveryDate_initializers, _deliveryDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateQuoteLineDto = CreateQuoteLineDto;
let UpdateQuoteDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _changeReason_decorators;
    let _changeReason_initializers = [];
    let _changeReason_extraInitializers = [];
    return _a = class UpdateQuoteDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.expirationDate = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.paymentTerms = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
                this.lineItems = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
                this.notes = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.changeReason = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _changeReason_initializers, void 0));
                __runInitializers(this, _changeReason_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID', required: false })];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false })];
            _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms', required: false })];
            _lineItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quote line items', type: [Object], required: false })];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer notes', required: false })];
            _changeReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Version change reason', required: false })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
            __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _changeReason_decorators, { kind: "field", name: "changeReason", static: false, private: false, access: { has: obj => "changeReason" in obj, get: obj => obj.changeReason, set: (obj, value) => { obj.changeReason = value; } }, metadata: _metadata }, _changeReason_initializers, _changeReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateQuoteDto = UpdateQuoteDto;
let ApproveQuoteDto = (() => {
    var _a;
    let _approverId_decorators;
    let _approverId_initializers = [];
    let _approverId_extraInitializers = [];
    let _decision_decorators;
    let _decision_initializers = [];
    let _decision_extraInitializers = [];
    let _comments_decorators;
    let _comments_initializers = [];
    let _comments_extraInitializers = [];
    return _a = class ApproveQuoteDto {
            constructor() {
                this.approverId = __runInitializers(this, _approverId_initializers, void 0);
                this.decision = (__runInitializers(this, _approverId_extraInitializers), __runInitializers(this, _decision_initializers, void 0));
                this.comments = (__runInitializers(this, _decision_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _approverId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approver ID' })];
            _decision_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval decision', enum: ['approved', 'rejected'] })];
            _comments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval comments', required: false })];
            __esDecorate(null, null, _approverId_decorators, { kind: "field", name: "approverId", static: false, private: false, access: { has: obj => "approverId" in obj, get: obj => obj.approverId, set: (obj, value) => { obj.approverId = value; } }, metadata: _metadata }, _approverId_initializers, _approverId_extraInitializers);
            __esDecorate(null, null, _decision_decorators, { kind: "field", name: "decision", static: false, private: false, access: { has: obj => "decision" in obj, get: obj => obj.decision, set: (obj, value) => { obj.decision = value; } }, metadata: _metadata }, _decision_initializers, _decision_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: obj => "comments" in obj, get: obj => obj.comments, set: (obj, value) => { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ApproveQuoteDto = ApproveQuoteDto;
let ConvertQuoteToOrderDto = (() => {
    var _a;
    let _quoteId_decorators;
    let _quoteId_initializers = [];
    let _quoteId_extraInitializers = [];
    let _requestedDeliveryDate_decorators;
    let _requestedDeliveryDate_initializers = [];
    let _requestedDeliveryDate_extraInitializers = [];
    let _customerPONumber_decorators;
    let _customerPONumber_initializers = [];
    let _customerPONumber_extraInitializers = [];
    let _specialInstructions_decorators;
    let _specialInstructions_initializers = [];
    let _specialInstructions_extraInitializers = [];
    let _modifications_decorators;
    let _modifications_initializers = [];
    let _modifications_extraInitializers = [];
    return _a = class ConvertQuoteToOrderDto {
            constructor() {
                this.quoteId = __runInitializers(this, _quoteId_initializers, void 0);
                this.requestedDeliveryDate = (__runInitializers(this, _quoteId_extraInitializers), __runInitializers(this, _requestedDeliveryDate_initializers, void 0));
                this.customerPONumber = (__runInitializers(this, _requestedDeliveryDate_extraInitializers), __runInitializers(this, _customerPONumber_initializers, void 0));
                this.specialInstructions = (__runInitializers(this, _customerPONumber_extraInitializers), __runInitializers(this, _specialInstructions_initializers, void 0));
                this.modifications = (__runInitializers(this, _specialInstructions_extraInitializers), __runInitializers(this, _modifications_initializers, void 0));
                __runInitializers(this, _modifications_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _quoteId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quote ID to convert' })];
            _requestedDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requested delivery date', required: false })];
            _customerPONumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order number', required: false })];
            _specialInstructions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Special instructions', required: false })];
            _modifications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Modifications to apply', type: [Object], required: false })];
            __esDecorate(null, null, _quoteId_decorators, { kind: "field", name: "quoteId", static: false, private: false, access: { has: obj => "quoteId" in obj, get: obj => obj.quoteId, set: (obj, value) => { obj.quoteId = value; } }, metadata: _metadata }, _quoteId_initializers, _quoteId_extraInitializers);
            __esDecorate(null, null, _requestedDeliveryDate_decorators, { kind: "field", name: "requestedDeliveryDate", static: false, private: false, access: { has: obj => "requestedDeliveryDate" in obj, get: obj => obj.requestedDeliveryDate, set: (obj, value) => { obj.requestedDeliveryDate = value; } }, metadata: _metadata }, _requestedDeliveryDate_initializers, _requestedDeliveryDate_extraInitializers);
            __esDecorate(null, null, _customerPONumber_decorators, { kind: "field", name: "customerPONumber", static: false, private: false, access: { has: obj => "customerPONumber" in obj, get: obj => obj.customerPONumber, set: (obj, value) => { obj.customerPONumber = value; } }, metadata: _metadata }, _customerPONumber_initializers, _customerPONumber_extraInitializers);
            __esDecorate(null, null, _specialInstructions_decorators, { kind: "field", name: "specialInstructions", static: false, private: false, access: { has: obj => "specialInstructions" in obj, get: obj => obj.specialInstructions, set: (obj, value) => { obj.specialInstructions = value; } }, metadata: _metadata }, _specialInstructions_initializers, _specialInstructions_extraInitializers);
            __esDecorate(null, null, _modifications_decorators, { kind: "field", name: "modifications", static: false, private: false, access: { has: obj => "modifications" in obj, get: obj => obj.modifications, set: (obj, value) => { obj.modifications = value; } }, metadata: _metadata }, _modifications_initializers, _modifications_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ConvertQuoteToOrderDto = ConvertQuoteToOrderDto;
let CreateQuoteTemplateDto = (() => {
    var _a;
    let _templateName_decorators;
    let _templateName_initializers = [];
    let _templateName_extraInitializers = [];
    let _templateType_decorators;
    let _templateType_initializers = [];
    let _templateType_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _headerTemplate_decorators;
    let _headerTemplate_initializers = [];
    let _headerTemplate_extraInitializers = [];
    let _lineItemsTemplate_decorators;
    let _lineItemsTemplate_initializers = [];
    let _lineItemsTemplate_extraInitializers = [];
    let _termsAndConditions_decorators;
    let _termsAndConditions_initializers = [];
    let _termsAndConditions_extraInitializers = [];
    let _defaultValidityDays_decorators;
    let _defaultValidityDays_initializers = [];
    let _defaultValidityDays_extraInitializers = [];
    let _requiredApprovals_decorators;
    let _requiredApprovals_initializers = [];
    let _requiredApprovals_extraInitializers = [];
    return _a = class CreateQuoteTemplateDto {
            constructor() {
                this.templateName = __runInitializers(this, _templateName_initializers, void 0);
                this.templateType = (__runInitializers(this, _templateName_extraInitializers), __runInitializers(this, _templateType_initializers, void 0));
                this.category = (__runInitializers(this, _templateType_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.headerTemplate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _headerTemplate_initializers, void 0));
                this.lineItemsTemplate = (__runInitializers(this, _headerTemplate_extraInitializers), __runInitializers(this, _lineItemsTemplate_initializers, void 0));
                this.termsAndConditions = (__runInitializers(this, _lineItemsTemplate_extraInitializers), __runInitializers(this, _termsAndConditions_initializers, void 0));
                this.defaultValidityDays = (__runInitializers(this, _termsAndConditions_extraInitializers), __runInitializers(this, _defaultValidityDays_initializers, void 0));
                this.requiredApprovals = (__runInitializers(this, _defaultValidityDays_extraInitializers), __runInitializers(this, _requiredApprovals_initializers, void 0));
                __runInitializers(this, _requiredApprovals_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _templateName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template name' })];
            _templateType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Template type', enum: ['standard', 'custom', 'industry_specific'] })];
            _category_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category' })];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' })];
            _headerTemplate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Header template configuration' })];
            _lineItemsTemplate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line items template' })];
            _termsAndConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terms and conditions' })];
            _defaultValidityDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Default validity days', default: 30 })];
            _requiredApprovals_decorators = [(0, swagger_1.ApiProperty)({ description: 'Required approval roles', type: [String] })];
            __esDecorate(null, null, _templateName_decorators, { kind: "field", name: "templateName", static: false, private: false, access: { has: obj => "templateName" in obj, get: obj => obj.templateName, set: (obj, value) => { obj.templateName = value; } }, metadata: _metadata }, _templateName_initializers, _templateName_extraInitializers);
            __esDecorate(null, null, _templateType_decorators, { kind: "field", name: "templateType", static: false, private: false, access: { has: obj => "templateType" in obj, get: obj => obj.templateType, set: (obj, value) => { obj.templateType = value; } }, metadata: _metadata }, _templateType_initializers, _templateType_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _headerTemplate_decorators, { kind: "field", name: "headerTemplate", static: false, private: false, access: { has: obj => "headerTemplate" in obj, get: obj => obj.headerTemplate, set: (obj, value) => { obj.headerTemplate = value; } }, metadata: _metadata }, _headerTemplate_initializers, _headerTemplate_extraInitializers);
            __esDecorate(null, null, _lineItemsTemplate_decorators, { kind: "field", name: "lineItemsTemplate", static: false, private: false, access: { has: obj => "lineItemsTemplate" in obj, get: obj => obj.lineItemsTemplate, set: (obj, value) => { obj.lineItemsTemplate = value; } }, metadata: _metadata }, _lineItemsTemplate_initializers, _lineItemsTemplate_extraInitializers);
            __esDecorate(null, null, _termsAndConditions_decorators, { kind: "field", name: "termsAndConditions", static: false, private: false, access: { has: obj => "termsAndConditions" in obj, get: obj => obj.termsAndConditions, set: (obj, value) => { obj.termsAndConditions = value; } }, metadata: _metadata }, _termsAndConditions_initializers, _termsAndConditions_extraInitializers);
            __esDecorate(null, null, _defaultValidityDays_decorators, { kind: "field", name: "defaultValidityDays", static: false, private: false, access: { has: obj => "defaultValidityDays" in obj, get: obj => obj.defaultValidityDays, set: (obj, value) => { obj.defaultValidityDays = value; } }, metadata: _metadata }, _defaultValidityDays_initializers, _defaultValidityDays_extraInitializers);
            __esDecorate(null, null, _requiredApprovals_decorators, { kind: "field", name: "requiredApprovals", static: false, private: false, access: { has: obj => "requiredApprovals" in obj, get: obj => obj.requiredApprovals, set: (obj, value) => { obj.requiredApprovals = value; } }, metadata: _metadata }, _requiredApprovals_initializers, _requiredApprovals_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateQuoteTemplateDto = CreateQuoteTemplateDto;
let QuoteSearchDto = (() => {
    var _a;
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _salesRepId_decorators;
    let _salesRepId_initializers = [];
    let _salesRepId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _minAmount_decorators;
    let _minAmount_initializers = [];
    let _minAmount_extraInitializers = [];
    let _maxAmount_decorators;
    let _maxAmount_initializers = [];
    let _maxAmount_extraInitializers = [];
    let _searchText_decorators;
    let _searchText_initializers = [];
    let _searchText_extraInitializers = [];
    let _page_decorators;
    let _page_initializers = [];
    let _page_extraInitializers = [];
    let _pageSize_decorators;
    let _pageSize_initializers = [];
    let _pageSize_extraInitializers = [];
    return _a = class QuoteSearchDto {
            constructor() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.salesRepId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _salesRepId_initializers, void 0));
                this.status = (__runInitializers(this, _salesRepId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.minAmount = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _minAmount_initializers, void 0));
                this.maxAmount = (__runInitializers(this, _minAmount_extraInitializers), __runInitializers(this, _maxAmount_initializers, void 0));
                this.searchText = (__runInitializers(this, _maxAmount_extraInitializers), __runInitializers(this, _searchText_initializers, void 0));
                this.page = (__runInitializers(this, _searchText_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.pageSize = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _pageSize_initializers, void 0));
                __runInitializers(this, _pageSize_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID filter', required: false })];
            _salesRepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sales rep ID filter', required: false })];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status filter', required: false })];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', required: false })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date', required: false })];
            _minAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum amount', required: false })];
            _maxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum amount', required: false })];
            _searchText_decorators = [(0, swagger_1.ApiProperty)({ description: 'Search text', required: false })];
            _page_decorators = [(0, swagger_1.ApiProperty)({ description: 'Page number', default: 1 })];
            _pageSize_decorators = [(0, swagger_1.ApiProperty)({ description: 'Page size', default: 20 })];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _salesRepId_decorators, { kind: "field", name: "salesRepId", static: false, private: false, access: { has: obj => "salesRepId" in obj, get: obj => obj.salesRepId, set: (obj, value) => { obj.salesRepId = value; } }, metadata: _metadata }, _salesRepId_initializers, _salesRepId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _minAmount_decorators, { kind: "field", name: "minAmount", static: false, private: false, access: { has: obj => "minAmount" in obj, get: obj => obj.minAmount, set: (obj, value) => { obj.minAmount = value; } }, metadata: _metadata }, _minAmount_initializers, _minAmount_extraInitializers);
            __esDecorate(null, null, _maxAmount_decorators, { kind: "field", name: "maxAmount", static: false, private: false, access: { has: obj => "maxAmount" in obj, get: obj => obj.maxAmount, set: (obj, value) => { obj.maxAmount = value; } }, metadata: _metadata }, _maxAmount_initializers, _maxAmount_extraInitializers);
            __esDecorate(null, null, _searchText_decorators, { kind: "field", name: "searchText", static: false, private: false, access: { has: obj => "searchText" in obj, get: obj => obj.searchText, set: (obj, value) => { obj.searchText = value; } }, metadata: _metadata }, _searchText_initializers, _searchText_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: obj => "page" in obj, get: obj => obj.page, set: (obj, value) => { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _pageSize_decorators, { kind: "field", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } }, metadata: _metadata }, _pageSize_initializers, _pageSize_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.QuoteSearchDto = QuoteSearchDto;
let QuoteAnalyticsRequestDto = (() => {
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
    let _salesRepId_decorators;
    let _salesRepId_initializers = [];
    let _salesRepId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    return _a = class QuoteAnalyticsRequestDto {
            constructor() {
                this.startDate = __runInitializers(this, _startDate_initializers, void 0);
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.groupBy = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _groupBy_initializers, void 0));
                this.salesRepId = (__runInitializers(this, _groupBy_extraInitializers), __runInitializers(this, _salesRepId_initializers, void 0));
                this.customerId = (__runInitializers(this, _salesRepId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                __runInitializers(this, _customerId_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' })];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' })];
            _groupBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Group by dimension', enum: ['day', 'week', 'month', 'quarter'], required: false })];
            _salesRepId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sales rep filter', required: false })];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer filter', required: false })];
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _groupBy_decorators, { kind: "field", name: "groupBy", static: false, private: false, access: { has: obj => "groupBy" in obj, get: obj => obj.groupBy, set: (obj, value) => { obj.groupBy = value; } }, metadata: _metadata }, _groupBy_initializers, _groupBy_extraInitializers);
            __esDecorate(null, null, _salesRepId_decorators, { kind: "field", name: "salesRepId", static: false, private: false, access: { has: obj => "salesRepId" in obj, get: obj => obj.salesRepId, set: (obj, value) => { obj.salesRepId = value; } }, metadata: _metadata }, _salesRepId_initializers, _salesRepId_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.QuoteAnalyticsRequestDto = QuoteAnalyticsRequestDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Quote Headers with comprehensive tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QuoteHeader model
 *
 * @example
 * ```typescript
 * const Quote = createQuoteHeaderModel(sequelize);
 * const quote = await Quote.create({
 *   quoteNumber: 'Q-2024-001',
 *   customerId: 123,
 *   quoteDate: new Date(),
 *   status: 'draft'
 * });
 * ```
 */
const createQuoteHeaderModel = (sequelize) => {
    class QuoteHeader extends sequelize_1.Model {
    }
    QuoteHeader.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        quoteNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            comment: 'Unique quote number',
        },
        version: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: 'Quote version number',
        },
        quoteDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Quote creation date',
        },
        expirationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Quote expiration date',
        },
        customerId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Customer ID',
        },
        customerName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Customer name (denormalized)',
        },
        contactId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Customer contact ID',
        },
        salesRepId: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Sales representative ID',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'pending_approval', 'approved', 'sent', 'accepted', 'rejected', 'expired', 'converted'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Quote status',
        },
        totalAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total amount before discounts',
        },
        discountAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total discount amount',
        },
        taxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total tax amount',
        },
        shippingAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Shipping amount',
        },
        grandTotal: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Grand total',
        },
        currency: {
            type: sequelize_1.DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'USD',
            comment: 'Currency code',
        },
        paymentTerms: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Payment terms',
        },
        deliveryTerms: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Delivery terms',
        },
        validityPeriod: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            comment: 'Validity period in days',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Customer-facing notes',
        },
        internalNotes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Internal notes',
        },
        templateId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Template used for generation',
        },
        parentQuoteId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Parent quote ID for revisions',
        },
        convertedOrderId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Converted order ID',
        },
        convertedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Conversion date',
        },
        sentAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date quote was sent to customer',
        },
        viewedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date customer first viewed quote',
        },
        acceptedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date customer accepted quote',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata',
        },
        createdBy: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'User who created the quote',
        },
        updatedBy: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'User who last updated the quote',
        },
    }, {
        sequelize,
        modelName: 'QuoteHeader',
        tableName: 'quote_headers',
        timestamps: true,
        indexes: [
            { fields: ['quoteNumber'], unique: true },
            { fields: ['customerId'] },
            { fields: ['salesRepId'] },
            { fields: ['status'] },
            { fields: ['quoteDate'] },
            { fields: ['expirationDate'] },
            { fields: ['convertedOrderId'] },
        ],
    });
    return QuoteHeader;
};
exports.createQuoteHeaderModel = createQuoteHeaderModel;
/**
 * Sequelize model for Quote Line Items.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QuoteLine model
 */
const createQuoteLineModel = (sequelize) => {
    class QuoteLine extends sequelize_1.Model {
    }
    QuoteLine.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        quoteId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Quote header ID',
        },
        lineNumber: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Line sequence number',
        },
        productId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'Product ID',
        },
        productCode: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Product code',
        },
        productName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Product name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Line item description',
        },
        quantity: {
            type: sequelize_1.DataTypes.DECIMAL(12, 3),
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
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Unit price',
        },
        listPrice: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'List price',
        },
        discountPercent: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Discount percentage',
        },
        discountAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Discount amount',
        },
        extendedPrice: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Extended price (qty * unit price)',
        },
        taxRate: {
            type: sequelize_1.DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Tax rate percentage',
        },
        taxAmount: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Tax amount',
        },
        lineTotal: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
            allowNull: false,
            comment: 'Line total with tax',
        },
        configuration: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            comment: 'Product configuration details',
        },
        deliveryDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Requested delivery date',
        },
        leadTimeDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Lead time in days',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Line item notes',
        },
    }, {
        sequelize,
        modelName: 'QuoteLine',
        tableName: 'quote_lines',
        timestamps: true,
        indexes: [
            { fields: ['quoteId'] },
            { fields: ['productId'] },
        ],
    });
    return QuoteLine;
};
exports.createQuoteLineModel = createQuoteLineModel;
/**
 * Sequelize model for Quote Templates.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QuoteTemplate model
 */
const createQuoteTemplateModel = (sequelize) => {
    class QuoteTemplate extends sequelize_1.Model {
    }
    QuoteTemplate.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        templateName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Template name',
        },
        templateType: {
            type: sequelize_1.DataTypes.ENUM('standard', 'custom', 'industry_specific'),
            allowNull: false,
            comment: 'Template type',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'Template category',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Template description',
        },
        isActive: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Is template active',
        },
        headerTemplate: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            comment: 'Header template configuration',
        },
        lineItemsTemplate: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
            comment: 'Line items template',
        },
        termsAndConditions: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Terms and conditions',
        },
        defaultValidityDays: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            comment: 'Default validity period',
        },
        requiredApprovals: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Required approval roles',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        modelName: 'QuoteTemplate',
        tableName: 'quote_templates',
        timestamps: true,
        indexes: [
            { fields: ['templateType'] },
            { fields: ['category'] },
            { fields: ['isActive'] },
        ],
    });
    return QuoteTemplate;
};
exports.createQuoteTemplateModel = createQuoteTemplateModel;
// ============================================================================
// QUOTE CREATION & GENERATION FUNCTIONS
// ============================================================================
/**
 * Creates a new sales quote with comprehensive validation and pricing calculation.
 *
 * @param {CreateQuoteDto} quoteDto - Quote creation data
 * @param {string} userId - User creating the quote
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<QuoteHeader>} Created quote header
 *
 * @example
 * ```typescript
 * const quote = await createQuote({
 *   customerId: 123,
 *   salesRepId: 'SREP001',
 *   quoteDate: new Date(),
 *   expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
 *   paymentTerms: 'Net 30',
 *   deliveryTerms: 'FOB Origin',
 *   lineItems: [
 *     { productId: 1, quantity: 10, unitPrice: 100 }
 *   ]
 * }, 'user123', transaction);
 * ```
 */
async function createQuote(quoteDto, userId, transaction) {
    // Generate quote number
    const quoteNumber = await generateQuoteNumber();
    // Calculate totals
    const totals = calculateQuoteTotals(quoteDto.lineItems);
    const quote = {
        quoteId: 0,
        quoteNumber,
        version: 1,
        quoteDate: quoteDto.quoteDate,
        expirationDate: quoteDto.expirationDate,
        customerId: quoteDto.customerId,
        customerName: '', // Would be fetched from customer service
        contactId: quoteDto.contactId,
        salesRepId: quoteDto.salesRepId,
        status: 'draft',
        totalAmount: totals.totalAmount,
        discountAmount: totals.discountAmount,
        taxAmount: totals.taxAmount,
        shippingAmount: 0,
        grandTotal: totals.grandTotal,
        currency: quoteDto.currency || 'USD',
        paymentTerms: quoteDto.paymentTerms,
        deliveryTerms: quoteDto.deliveryTerms,
        validityPeriod: Math.ceil((quoteDto.expirationDate.getTime() - quoteDto.quoteDate.getTime()) / (1000 * 60 * 60 * 24)),
        notes: quoteDto.notes,
        internalNotes: quoteDto.internalNotes,
        templateId: quoteDto.templateId,
    };
    return quote;
}
/**
 * Generates a quote from a predefined template.
 *
 * @param {number} templateId - Template ID to use
 * @param {Partial<CreateQuoteDto>} overrides - Values to override template defaults
 * @param {string} userId - User generating the quote
 * @returns {Promise<QuoteHeader>} Generated quote
 */
async function generateQuoteFromTemplate(templateId, overrides, userId) {
    const template = await getQuoteTemplate(templateId);
    const quoteDto = {
        ...template.headerTemplate,
        ...overrides,
        templateId,
        lineItems: overrides.lineItems || template.lineItemsTemplate,
    };
    return createQuote(quoteDto, userId);
}
/**
 * Generates a unique quote number using a configurable pattern.
 *
 * @param {string} prefix - Quote number prefix
 * @returns {Promise<string>} Generated quote number
 */
async function generateQuoteNumber(prefix = 'Q') {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const sequence = await getNextQuoteSequence(year, month);
    return `${prefix}-${year}${month}-${String(sequence).padStart(6, '0')}`;
}
/**
 * Duplicates an existing quote with optional modifications.
 *
 * @param {number} quoteId - Quote ID to duplicate
 * @param {Partial<CreateQuoteDto>} modifications - Modifications to apply
 * @param {string} userId - User duplicating the quote
 * @returns {Promise<QuoteHeader>} Duplicated quote
 */
async function duplicateQuote(quoteId, modifications, userId) {
    const originalQuote = await getQuote(quoteId);
    const duplicateDto = {
        customerId: modifications.customerId || originalQuote.customerId,
        salesRepId: modifications.salesRepId || originalQuote.salesRepId,
        quoteDate: modifications.quoteDate || new Date(),
        expirationDate: modifications.expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        currency: modifications.currency || originalQuote.currency,
        paymentTerms: modifications.paymentTerms || originalQuote.paymentTerms,
        deliveryTerms: modifications.deliveryTerms || originalQuote.deliveryTerms,
        lineItems: modifications.lineItems || [],
        notes: modifications.notes || originalQuote.notes,
    };
    return createQuote(duplicateDto, userId);
}
// ============================================================================
// QUOTE TEMPLATE FUNCTIONS
// ============================================================================
/**
 * Creates a new quote template for reuse.
 *
 * @param {CreateQuoteTemplateDto} templateDto - Template data
 * @param {string} userId - User creating the template
 * @returns {Promise<QuoteTemplate>} Created template
 */
async function createQuoteTemplate(templateDto, userId) {
    const template = {
        templateId: 0,
        templateName: templateDto.templateName,
        templateType: templateDto.templateType,
        category: templateDto.category,
        description: templateDto.description,
        isActive: true,
        headerTemplate: templateDto.headerTemplate,
        lineItemsTemplate: templateDto.lineItemsTemplate,
        termsAndConditions: templateDto.termsAndConditions,
        defaultValidityDays: templateDto.defaultValidityDays || 30,
        requiredApprovals: templateDto.requiredApprovals,
        metadata: {},
    };
    return template;
}
/**
 * Retrieves a quote template by ID.
 *
 * @param {number} templateId - Template ID
 * @returns {Promise<QuoteTemplate>} Quote template
 */
async function getQuoteTemplate(templateId) {
    // Implementation would fetch from database
    return {};
}
/**
 * Lists available quote templates with filtering.
 *
 * @param {Object} filters - Filter criteria
 * @returns {Promise<QuoteTemplate[]>} List of templates
 */
async function listQuoteTemplates(filters) {
    // Implementation would query database
    return [];
}
/**
 * Updates an existing quote template.
 *
 * @param {number} templateId - Template ID to update
 * @param {Partial<CreateQuoteTemplateDto>} updates - Updates to apply
 * @returns {Promise<QuoteTemplate>} Updated template
 */
async function updateQuoteTemplate(templateId, updates) {
    // Implementation would update database
    return {};
}
// ============================================================================
// QUOTE VERSIONING FUNCTIONS
// ============================================================================
/**
 * Creates a new version of an existing quote.
 *
 * @param {number} quoteId - Quote ID to version
 * @param {UpdateQuoteDto} updates - Updates for new version
 * @param {string} userId - User creating version
 * @param {string} changeReason - Reason for version change
 * @returns {Promise<QuoteHeader>} New quote version
 */
async function createQuoteVersion(quoteId, updates, userId, changeReason) {
    const currentQuote = await getQuote(quoteId);
    // Archive current version
    await archiveQuoteVersion(quoteId, currentQuote.version);
    const newVersion = currentQuote.version + 1;
    const updatedQuote = {
        ...currentQuote,
        version: newVersion,
        ...updates,
    };
    return updatedQuote;
}
/**
 * Archives a quote version for historical tracking.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} version - Version number to archive
 * @returns {Promise<QuoteVersion>} Archived version
 */
async function archiveQuoteVersion(quoteId, version) {
    const quote = await getQuote(quoteId);
    const archivedVersion = {
        versionId: 0,
        quoteId,
        version,
        versionDate: new Date(),
        createdBy: '',
        changeReason: 'Version archived',
        changesSummary: '',
        snapshot: quote,
        isActive: false,
    };
    return archivedVersion;
}
/**
 * Retrieves all versions of a quote.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<QuoteVersion[]>} List of quote versions
 */
async function getQuoteVersionHistory(quoteId) {
    // Implementation would query version history
    return [];
}
/**
 * Compares two quote versions to identify changes.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} version1 - First version number
 * @param {number} version2 - Second version number
 * @returns {Promise<Object>} Comparison results
 */
async function compareQuoteVersions(quoteId, version1, version2) {
    const v1 = await getQuoteVersion(quoteId, version1);
    const v2 = await getQuoteVersion(quoteId, version2);
    const differences = [];
    // Compare snapshots
    // Implementation would perform deep comparison
    return {
        differences,
        summary: `Found ${differences.length} differences between version ${version1} and ${version2}`,
    };
}
// ============================================================================
// QUOTE EXPIRATION HANDLING FUNCTIONS
// ============================================================================
/**
 * Checks for expiring quotes and triggers appropriate actions.
 *
 * @param {number} daysBeforeExpiration - Days threshold for notification
 * @returns {Promise<QuoteExpirationCheck[]>} List of expiring quotes
 */
async function checkExpiringQuotes(daysBeforeExpiration = 7) {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + daysBeforeExpiration * 24 * 60 * 60 * 1000);
    const expiringQuotes = [
    // Implementation would query database for quotes expiring within threshold
    ];
    return expiringQuotes;
}
/**
 * Marks expired quotes and updates their status.
 *
 * @returns {Promise<number>} Number of quotes marked as expired
 */
async function processExpiredQuotes() {
    const now = new Date();
    let expiredCount = 0;
    // Implementation would update all quotes past expiration date
    // that are in 'sent' or 'pending_approval' status to 'expired'
    return expiredCount;
}
/**
 * Extends the expiration date of a quote.
 *
 * @param {number} quoteId - Quote ID
 * @param {Date} newExpirationDate - New expiration date
 * @param {string} userId - User extending the quote
 * @param {string} reason - Reason for extension
 * @returns {Promise<QuoteHeader>} Updated quote
 */
async function extendQuoteExpiration(quoteId, newExpirationDate, userId, reason) {
    const quote = await getQuote(quoteId);
    if (quote.status === 'expired' || quote.status === 'converted') {
        throw new Error(`Cannot extend quote in ${quote.status} status`);
    }
    const updatedQuote = {
        ...quote,
        expirationDate: newExpirationDate,
        validityPeriod: Math.ceil((newExpirationDate.getTime() - quote.quoteDate.getTime()) / (1000 * 60 * 60 * 24)),
    };
    return updatedQuote;
}
/**
 * Sends expiration notifications to customers and sales reps.
 *
 * @param {QuoteExpirationCheck[]} expiringQuotes - List of expiring quotes
 * @returns {Promise<void>}
 */
async function sendExpirationNotifications(expiringQuotes) {
    for (const quote of expiringQuotes) {
        // Send notification to customer
        // Send notification to sales rep
        // Log notification
    }
}
// ============================================================================
// QUOTE APPROVAL WORKFLOW FUNCTIONS
// ============================================================================
/**
 * Submits a quote for approval based on configured workflow.
 *
 * @param {number} quoteId - Quote ID to submit
 * @param {string} userId - User submitting the quote
 * @returns {Promise<QuoteApproval[]>} Created approval requests
 */
async function submitQuoteForApproval(quoteId, userId) {
    const quote = await getQuote(quoteId);
    if (quote.status !== 'draft') {
        throw new Error('Only draft quotes can be submitted for approval');
    }
    const approvalWorkflow = await getApprovalWorkflow(quote);
    const approvalRequests = [];
    for (const level of approvalWorkflow) {
        const approval = {
            approvalId: 0,
            quoteId,
            approvalLevel: level.level,
            approverRole: level.role,
            status: 'pending',
            requestedAt: new Date(),
            notificationSent: false,
        };
        approvalRequests.push(approval);
    }
    return approvalRequests;
}
/**
 * Processes an approval decision for a quote.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} approvalId - Approval request ID
 * @param {ApproveQuoteDto} approvalDto - Approval decision
 * @returns {Promise<QuoteApproval>} Updated approval
 */
async function processQuoteApproval(quoteId, approvalId, approvalDto) {
    const approval = {
        approvalId,
        quoteId,
        approvalLevel: 1,
        approverRole: '',
        approverId: approvalDto.approverId,
        status: approvalDto.decision,
        requestedAt: new Date(),
        respondedAt: new Date(),
        comments: approvalDto.comments,
        notificationSent: true,
    };
    // If rejected, update quote status
    if (approvalDto.decision === 'rejected') {
        await updateQuoteStatus(quoteId, 'rejected');
    }
    // If approved, check if all approvals complete
    const allApprovals = await getQuoteApprovals(quoteId);
    const allApproved = allApprovals.every(a => a.status === 'approved');
    if (allApproved) {
        await updateQuoteStatus(quoteId, 'approved');
    }
    return approval;
}
/**
 * Retrieves approval workflow configuration for a quote.
 *
 * @param {QuoteHeader} quote - Quote header
 * @returns {Promise<Array>} Approval workflow levels
 */
async function getApprovalWorkflow(quote) {
    const workflow = [];
    // Example workflow logic based on quote value
    if (quote.grandTotal > 100000) {
        workflow.push({ level: 1, role: 'sales_manager', threshold: 100000 });
        workflow.push({ level: 2, role: 'director', threshold: 100000 });
    }
    else if (quote.grandTotal > 50000) {
        workflow.push({ level: 1, role: 'sales_manager', threshold: 50000 });
    }
    return workflow;
}
/**
 * Retrieves all approval requests for a quote.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<QuoteApproval[]>} List of approvals
 */
async function getQuoteApprovals(quoteId) {
    // Implementation would query approvals
    return [];
}
// ============================================================================
// QUOTE-TO-ORDER CONVERSION FUNCTIONS
// ============================================================================
/**
 * Converts an approved quote to a sales order.
 *
 * @param {ConvertQuoteToOrderDto} conversionDto - Conversion data
 * @param {string} userId - User converting the quote
 * @returns {Promise<QuoteConversionResult>} Conversion result
 */
async function convertQuoteToOrder(conversionDto, userId) {
    const quote = await getQuote(conversionDto.quoteId);
    if (quote.status !== 'approved' && quote.status !== 'accepted') {
        throw new Error('Only approved or accepted quotes can be converted to orders');
    }
    // Create sales order
    const order = await createSalesOrder({
        quoteId: quote.quoteId,
        customerId: quote.customerId,
        salesRepId: quote.salesRepId,
        orderDate: new Date(),
        requestedDeliveryDate: conversionDto.requestedDeliveryDate,
        customerPONumber: conversionDto.customerPONumber,
        specialInstructions: conversionDto.specialInstructions,
    });
    // Update quote status
    const updatedQuote = {
        ...quote,
        status: 'converted',
        convertedOrderId: order.orderId,
        convertedAt: new Date(),
    };
    const result = {
        orderId: order.orderId,
        orderNumber: order.orderNumber,
        quoteId: quote.quoteId,
        quoteNumber: quote.quoteNumber,
        conversionDate: new Date(),
        convertedBy: userId,
        orderStatus: order.status,
        modifications: [],
    };
    return result;
}
/**
 * Validates a quote is ready for conversion to order.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<Object>} Validation result
 */
async function validateQuoteForConversion(quoteId) {
    const quote = await getQuote(quoteId);
    const errors = [];
    const warnings = [];
    if (quote.status === 'expired') {
        errors.push('Quote has expired');
    }
    if (quote.status === 'converted') {
        errors.push('Quote has already been converted');
    }
    if (quote.status === 'rejected') {
        errors.push('Quote was rejected');
    }
    if (new Date() > quote.expirationDate) {
        warnings.push('Quote is past expiration date');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Previews the order that would be created from a quote.
 *
 * @param {number} quoteId - Quote ID
 * @param {Partial<ConvertQuoteToOrderDto>} modifications - Modifications to preview
 * @returns {Promise<Object>} Order preview
 */
async function previewQuoteToOrder(quoteId, modifications) {
    const quote = await getQuote(quoteId);
    // Create order preview based on quote data
    const orderPreview = {
        customerId: quote.customerId,
        totalAmount: quote.grandTotal,
        // Additional order fields
    };
    const changes = [];
    return {
        orderPreview,
        changes,
    };
}
// ============================================================================
// PRODUCT CONFIGURATOR INTEGRATION FUNCTIONS
// ============================================================================
/**
 * Configures a product for a quote line item.
 *
 * @param {number} productId - Product ID to configure
 * @param {Record<string, any>} options - Configuration options
 * @returns {Promise<ProductConfiguration>} Product configuration
 */
async function configureProduct(productId, options) {
    // Validate configuration options
    const validationResult = await validateProductConfiguration(productId, options);
    if (!validationResult.isValid) {
        throw new Error(`Invalid configuration: ${validationResult.errors.join(', ')}`);
    }
    // Calculate price impact
    const priceImpact = await calculateConfigurationPrice(productId, options);
    const configuration = {
        configId: 0,
        quoteLineId: 0,
        productId,
        configurationType: 'complex',
        baseProductId: productId,
        configuredOptions: Object.entries(options).map(([key, value]) => ({
            optionId: key,
            optionName: key,
            optionValue: value,
            priceImpact: 0,
            isRequired: false,
        })),
        totalConfigPrice: priceImpact,
        isValid: true,
    };
    return configuration;
}
/**
 * Validates a product configuration against rules.
 *
 * @param {number} productId - Product ID
 * @param {Record<string, any>} options - Configuration options
 * @returns {Promise<Object>} Validation result
 */
async function validateProductConfiguration(productId, options) {
    const errors = [];
    const warnings = [];
    // Validate required options
    // Validate option dependencies
    // Validate option compatibility
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
/**
 * Calculates the price impact of a product configuration.
 *
 * @param {number} productId - Product ID
 * @param {Record<string, any>} options - Configuration options
 * @returns {Promise<number>} Total price impact
 */
async function calculateConfigurationPrice(productId, options) {
    let totalPrice = 0;
    // Get base product price
    // Calculate price impact for each option
    return totalPrice;
}
/**
 * Retrieves available configuration options for a product.
 *
 * @param {number} productId - Product ID
 * @returns {Promise<ConfigOption[]>} Available options
 */
async function getProductConfigurationOptions(productId) {
    // Implementation would fetch available options from database
    return [];
}
// ============================================================================
// PRICING CALCULATION FUNCTIONS
// ============================================================================
/**
 * Calculates the total price for quote line items with all discounts.
 *
 * @param {CreateQuoteLineDto[]} lineItems - Quote line items
 * @returns {Object} Calculated totals
 */
function calculateQuoteTotals(lineItems) {
    let totalAmount = 0;
    let discountAmount = 0;
    let taxAmount = 0;
    for (const item of lineItems) {
        const extendedPrice = item.quantity * (item.unitPrice || 0);
        const lineDiscount = extendedPrice * ((item.discountPercent || 0) / 100);
        totalAmount += extendedPrice;
        discountAmount += lineDiscount;
    }
    const subtotal = totalAmount - discountAmount;
    taxAmount = subtotal * 0.08; // Example tax rate
    return {
        totalAmount,
        discountAmount,
        taxAmount,
        grandTotal: subtotal + taxAmount,
    };
}
/**
 * Applies pricing rules to calculate quote line pricing.
 *
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity
 * @param {number} customerId - Customer ID
 * @returns {Promise<Object>} Pricing details
 */
async function calculateLinePricing(productId, quantity, customerId) {
    const pricingRules = await getPricingRules(productId, customerId);
    let listPrice = 100; // Would fetch from product catalog
    let unitPrice = listPrice;
    let discountPercent = 0;
    const appliedRules = [];
    // Apply pricing rules in priority order
    for (const rule of pricingRules) {
        if (rule.ruleType === 'volume_discount' && quantity >= 10) {
            discountPercent = rule.priceAdjustment.value;
            appliedRules.push(rule.ruleName);
        }
    }
    unitPrice = listPrice * (1 - discountPercent / 100);
    return {
        listPrice,
        unitPrice,
        discountPercent,
        appliedRules,
    };
}
/**
 * Retrieves applicable pricing rules for a product and customer.
 *
 * @param {number} productId - Product ID
 * @param {number} customerId - Customer ID
 * @returns {Promise<PricingRule[]>} Applicable pricing rules
 */
async function getPricingRules(productId, customerId) {
    // Implementation would query pricing rules
    return [];
}
/**
 * Recalculates all pricing for a quote.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<QuoteHeader>} Updated quote with recalculated pricing
 */
async function recalculateQuotePricing(quoteId) {
    const quote = await getQuote(quoteId);
    // Implementation would recalculate all line items and totals
    return quote;
}
// ============================================================================
// DISCOUNT APPROVAL FUNCTIONS
// ============================================================================
/**
 * Applies a discount to a quote line item with approval workflow.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} lineId - Line item ID (0 for header-level discount)
 * @param {Object} discountData - Discount details
 * @returns {Promise<QuoteDiscount>} Created discount
 */
async function applyQuoteDiscount(quoteId, lineId, discountData) {
    const discount = {
        discountId: 0,
        quoteId,
        lineId,
        discountType: discountData.discountType,
        discountPercent: discountData.discountType === 'percentage' ? discountData.discountValue : 0,
        discountAmount: discountData.discountType === 'fixed_amount' ? discountData.discountValue : 0,
        discountReason: discountData.reason,
        requiresApproval: discountData.discountValue > 10, // Example threshold
    };
    return discount;
}
/**
 * Submits a discount for approval.
 *
 * @param {number} discountId - Discount ID
 * @param {string} approverId - Approver ID
 * @returns {Promise<void>}
 */
async function submitDiscountForApproval(discountId, approverId) {
    // Send approval notification
    // Log approval request
}
/**
 * Approves or rejects a discount request.
 *
 * @param {number} discountId - Discount ID
 * @param {Object} decision - Approval decision
 * @returns {Promise<QuoteDiscount>} Updated discount
 */
async function approveDiscount(discountId, decision) {
    const discount = {
        discountId,
        quoteId: 0,
        discountType: 'percentage',
        discountPercent: 0,
        discountAmount: 0,
        discountReason: '',
        requiresApproval: true,
        approvalStatus: decision.approved ? 'approved' : 'rejected',
        approvedBy: decision.approverId,
        approvedAt: new Date(),
    };
    return discount;
}
// ============================================================================
// QUOTE COMPARISON FUNCTIONS
// ============================================================================
/**
 * Compares multiple quotes side-by-side.
 *
 * @param {number[]} quoteIds - Quote IDs to compare
 * @param {string} userId - User performing comparison
 * @returns {Promise<QuoteComparison>} Comparison results
 */
async function compareQuotes(quoteIds, userId) {
    const quotes = await Promise.all(quoteIds.map(id => getQuote(id)));
    const comparison = {
        comparisonId: `CMP-${Date.now()}`,
        quoteIds,
        comparisonDate: new Date(),
        comparedBy: userId,
        metrics: {
            totalPrice: quotes.map(q => q.grandTotal),
            discounts: quotes.map(q => q.discountAmount),
            deliveryTime: [],
            paymentTerms: quotes.map(q => q.paymentTerms),
            competitiveScore: [],
        },
    };
    return comparison;
}
/**
 * Generates a competitive analysis report for quotes.
 *
 * @param {number[]} quoteIds - Quote IDs to analyze
 * @returns {Promise<Object>} Analysis report
 */
async function generateCompetitiveAnalysis(quoteIds) {
    const quotes = await Promise.all(quoteIds.map(id => getQuote(id)));
    const analysis = {
        bestValue: 0,
        lowestPrice: 0,
        fastestDelivery: 0,
        bestTerms: 0,
        recommendations: [],
    };
    // Analyze and score quotes
    // Generate recommendations
    return analysis;
}
// ============================================================================
// QUOTE ANALYTICS FUNCTIONS
// ============================================================================
/**
 * Generates quote analytics for a date range.
 *
 * @param {QuoteAnalyticsRequestDto} requestDto - Analytics request
 * @returns {Promise<QuoteAnalytics>} Analytics data
 */
async function getQuoteAnalytics(requestDto) {
    const analytics = {
        period: `${requestDto.startDate.toISOString()} to ${requestDto.endDate.toISOString()}`,
        totalQuotes: 0,
        quotesCreated: 0,
        quotesSent: 0,
        quotesAccepted: 0,
        quotesRejected: 0,
        quotesExpired: 0,
        quotesConverted: 0,
        conversionRate: 0,
        averageQuoteValue: 0,
        totalQuoteValue: 0,
        averageResponseTime: 0,
        averageApprovalTime: 0,
        topSalesReps: [],
        topProducts: [],
    };
    // Implementation would aggregate quote data
    return analytics;
}
/**
 * Calculates quote conversion metrics.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Conversion metrics
 */
async function calculateConversionMetrics(startDate, endDate) {
    const metrics = {
        totalQuotes: 0,
        convertedQuotes: 0,
        conversionRate: 0,
        averageTimeToConversion: 0,
        conversionByValue: [],
    };
    // Implementation would calculate metrics
    return metrics;
}
/**
 * Generates sales pipeline analytics from quotes.
 *
 * @param {string} salesRepId - Sales rep ID filter (optional)
 * @returns {Promise<Object>} Pipeline analytics
 */
async function getQuotePipelineAnalytics(salesRepId) {
    const analytics = {
        pipelineValue: 0,
        stages: [],
        forecastedRevenue: 0,
        weightedPipeline: 0,
    };
    // Implementation would analyze quote pipeline
    return analytics;
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Retrieves a quote by ID.
 *
 * @param {number} quoteId - Quote ID
 * @returns {Promise<QuoteHeader>} Quote header
 */
async function getQuote(quoteId) {
    // Implementation would fetch from database
    return {};
}
/**
 * Retrieves a specific quote version.
 *
 * @param {number} quoteId - Quote ID
 * @param {number} version - Version number
 * @returns {Promise<QuoteVersion>} Quote version
 */
async function getQuoteVersion(quoteId, version) {
    // Implementation would fetch version from database
    return {};
}
/**
 * Updates quote status.
 *
 * @param {number} quoteId - Quote ID
 * @param {string} status - New status
 * @returns {Promise<void>}
 */
async function updateQuoteStatus(quoteId, status) {
    // Implementation would update database
}
/**
 * Gets next quote sequence number.
 *
 * @param {number} year - Year
 * @param {string} month - Month
 * @returns {Promise<number>} Next sequence number
 */
async function getNextQuoteSequence(year, month) {
    // Implementation would get and increment sequence
    return 1;
}
/**
 * Creates a sales order from quote data.
 *
 * @param {Object} orderData - Order data
 * @returns {Promise<any>} Created order
 */
async function createSalesOrder(orderData) {
    // Implementation would create order in database
    return {
        orderId: 1,
        orderNumber: 'ORD-001',
        status: 'pending',
    };
}
//# sourceMappingURL=quote-proposal-kit.js.map