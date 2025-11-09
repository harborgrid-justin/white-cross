"use strict";
/**
 * LOC: ORD-RETREF-001
 * File: /reuse/order/order-returns-refunds-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Return controllers
 *   - Refund services
 *   - RMA processors
 *   - Warehouse systems
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
exports.Refund = exports.ReturnLine = exports.ReturnRequest = exports.ProcessRefundDto = exports.RecordInspectionDto = exports.AuthorizeReturnDto = exports.CreateReturnRequestDto = exports.RMAType = exports.RestockingDisposition = exports.ItemCondition = exports.RefundStatus = exports.RefundMethod = exports.ReturnReasonCode = exports.ReturnStatus = exports.ReturnAuthStatus = void 0;
exports.generateRMANumber = generateRMANumber;
exports.createReturnRequest = createReturnRequest;
exports.authorizeReturnRequest = authorizeReturnRequest;
exports.validateReturnEligibility = validateReturnEligibility;
exports.validateReturnReason = validateReturnReason;
exports.calculateRestockingFee = calculateRestockingFee;
exports.generateReturnShippingLabel = generateReturnShippingLabel;
exports.updateReturnTracking = updateReturnTracking;
exports.recordReturnReceipt = recordReturnReceipt;
exports.performReturnInspection = performReturnInspection;
exports.determineRestockingDisposition = determineRestockingDisposition;
exports.performQualityCheck = performQualityCheck;
exports.processRestocking = processRestocking;
exports.createReturnToVendor = createReturnToVendor;
exports.trackReturnSerialNumbers = trackReturnSerialNumbers;
exports.calculateRefundAmount = calculateRefundAmount;
exports.processRefund = processRefund;
exports.processPartialRefund = processPartialRefund;
exports.validateWarrantyCoverage = validateWarrantyCoverage;
exports.createAdvancedReplacement = createAdvancedReplacement;
/**
 * File: /reuse/order/order-returns-refunds-kit.ts
 * Locator: WC-ORD-RETREF-001
 * Purpose: Order Returns & Refunds - Complete returns authorization, processing, and refund management
 *
 * Upstream: Independent utility module for returns and refunds operations
 * Downstream: ../backend/order/*, Return modules, Refund services, Warehouse systems
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 38 utility functions for return authorization, RMA, inspection, refund processing, restocking
 *
 * LLM Context: Enterprise-grade returns and refunds utilities to compete with Oracle NetSuite and SAP.
 * Provides comprehensive return authorization workflows, RMA generation, return shipping labels, return receipt
 * and inspection, quality checks, restocking operations, refund calculations with fees, multi-channel refund
 * processing (original payment, store credit, exchange), return-to-vendor (RTV), warranty returns, advanced
 * replacement programs, partial returns, serial number tracking, and automated refund approval workflows.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Return authorization status workflow
 */
var ReturnAuthStatus;
(function (ReturnAuthStatus) {
    ReturnAuthStatus["PENDING"] = "PENDING";
    ReturnAuthStatus["APPROVED"] = "APPROVED";
    ReturnAuthStatus["REJECTED"] = "REJECTED";
    ReturnAuthStatus["CANCELLED"] = "CANCELLED";
    ReturnAuthStatus["EXPIRED"] = "EXPIRED";
})(ReturnAuthStatus || (exports.ReturnAuthStatus = ReturnAuthStatus = {}));
/**
 * Return request status tracking
 */
var ReturnStatus;
(function (ReturnStatus) {
    ReturnStatus["REQUESTED"] = "REQUESTED";
    ReturnStatus["AUTHORIZED"] = "AUTHORIZED";
    ReturnStatus["LABEL_GENERATED"] = "LABEL_GENERATED";
    ReturnStatus["IN_TRANSIT"] = "IN_TRANSIT";
    ReturnStatus["RECEIVED"] = "RECEIVED";
    ReturnStatus["INSPECTING"] = "INSPECTING";
    ReturnStatus["INSPECTION_PASSED"] = "INSPECTION_PASSED";
    ReturnStatus["INSPECTION_FAILED"] = "INSPECTION_FAILED";
    ReturnStatus["RESTOCKING"] = "RESTOCKING";
    ReturnStatus["RESTOCKED"] = "RESTOCKED";
    ReturnStatus["COMPLETED"] = "COMPLETED";
    ReturnStatus["REJECTED"] = "REJECTED";
    ReturnStatus["CANCELLED"] = "CANCELLED";
})(ReturnStatus || (exports.ReturnStatus = ReturnStatus = {}));
/**
 * Return reason codes for classification
 */
var ReturnReasonCode;
(function (ReturnReasonCode) {
    ReturnReasonCode["DEFECTIVE"] = "DEFECTIVE";
    ReturnReasonCode["DAMAGED_IN_SHIPPING"] = "DAMAGED_IN_SHIPPING";
    ReturnReasonCode["WRONG_ITEM"] = "WRONG_ITEM";
    ReturnReasonCode["NOT_AS_DESCRIBED"] = "NOT_AS_DESCRIBED";
    ReturnReasonCode["CUSTOMER_REMORSE"] = "CUSTOMER_REMORSE";
    ReturnReasonCode["CHANGED_MIND"] = "CHANGED_MIND";
    ReturnReasonCode["FOUND_BETTER_PRICE"] = "FOUND_BETTER_PRICE";
    ReturnReasonCode["NO_LONGER_NEEDED"] = "NO_LONGER_NEEDED";
    ReturnReasonCode["ORDERED_BY_MISTAKE"] = "ORDERED_BY_MISTAKE";
    ReturnReasonCode["ARRIVED_TOO_LATE"] = "ARRIVED_TOO_LATE";
    ReturnReasonCode["SIZE_FIT_ISSUE"] = "SIZE_FIT_ISSUE";
    ReturnReasonCode["WARRANTY_CLAIM"] = "WARRANTY_CLAIM";
    ReturnReasonCode["RECALL"] = "RECALL";
    ReturnReasonCode["OTHER"] = "OTHER";
})(ReturnReasonCode || (exports.ReturnReasonCode = ReturnReasonCode = {}));
/**
 * Refund method types
 */
var RefundMethod;
(function (RefundMethod) {
    RefundMethod["ORIGINAL_PAYMENT"] = "ORIGINAL_PAYMENT";
    RefundMethod["STORE_CREDIT"] = "STORE_CREDIT";
    RefundMethod["GIFT_CARD"] = "GIFT_CARD";
    RefundMethod["EXCHANGE"] = "EXCHANGE";
    RefundMethod["MANUAL_CHECK"] = "MANUAL_CHECK";
    RefundMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    RefundMethod["CASH"] = "CASH";
})(RefundMethod || (exports.RefundMethod = RefundMethod = {}));
/**
 * Refund status workflow
 */
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["PENDING"] = "PENDING";
    RefundStatus["APPROVED"] = "APPROVED";
    RefundStatus["PROCESSING"] = "PROCESSING";
    RefundStatus["COMPLETED"] = "COMPLETED";
    RefundStatus["FAILED"] = "FAILED";
    RefundStatus["CANCELLED"] = "CANCELLED";
    RefundStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
/**
 * Return item condition after inspection
 */
var ItemCondition;
(function (ItemCondition) {
    ItemCondition["NEW_UNOPENED"] = "NEW_UNOPENED";
    ItemCondition["NEW_OPENED"] = "NEW_OPENED";
    ItemCondition["LIKE_NEW"] = "LIKE_NEW";
    ItemCondition["GOOD"] = "GOOD";
    ItemCondition["ACCEPTABLE"] = "ACCEPTABLE";
    ItemCondition["DAMAGED"] = "DAMAGED";
    ItemCondition["DEFECTIVE"] = "DEFECTIVE";
    ItemCondition["NOT_RESALEABLE"] = "NOT_RESALEABLE";
})(ItemCondition || (exports.ItemCondition = ItemCondition = {}));
/**
 * Restocking disposition
 */
var RestockingDisposition;
(function (RestockingDisposition) {
    RestockingDisposition["RETURN_TO_STOCK"] = "RETURN_TO_STOCK";
    RestockingDisposition["RETURN_TO_VENDOR"] = "RETURN_TO_VENDOR";
    RestockingDisposition["REFURBISH"] = "REFURBISH";
    RestockingDisposition["SALVAGE"] = "SALVAGE";
    RestockingDisposition["SCRAP"] = "SCRAP";
    RestockingDisposition["QUARANTINE"] = "QUARANTINE";
})(RestockingDisposition || (exports.RestockingDisposition = RestockingDisposition = {}));
/**
 * RMA type classifications
 */
var RMAType;
(function (RMAType) {
    RMAType["STANDARD_RETURN"] = "STANDARD_RETURN";
    RMAType["WARRANTY_RETURN"] = "WARRANTY_RETURN";
    RMAType["ADVANCED_REPLACEMENT"] = "ADVANCED_REPLACEMENT";
    RMAType["CROSS_SHIP"] = "CROSS_SHIP";
    RMAType["DOA"] = "DOA";
    RMAType["RECALL"] = "RECALL";
})(RMAType || (exports.RMAType = RMAType = {}));
// ============================================================================
// DTOs WITH SWAGGER ANNOTATIONS
// ============================================================================
/**
 * Return request creation DTO
 */
let CreateReturnRequestDto = (() => {
    var _a;
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _rmaType_decorators;
    let _rmaType_initializers = [];
    let _rmaType_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _customerComments_decorators;
    let _customerComments_initializers = [];
    let _customerComments_extraInitializers = [];
    let _preferredRefundMethod_decorators;
    let _preferredRefundMethod_initializers = [];
    let _preferredRefundMethod_extraInitializers = [];
    let _exchangeItemIds_decorators;
    let _exchangeItemIds_initializers = [];
    let _exchangeItemIds_extraInitializers = [];
    return _a = class CreateReturnRequestDto {
            constructor() {
                this.orderId = __runInitializers(this, _orderId_initializers, void 0);
                this.rmaType = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _rmaType_initializers, void 0));
                this.lineItems = (__runInitializers(this, _rmaType_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
                this.customerComments = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _customerComments_initializers, void 0));
                this.preferredRefundMethod = (__runInitializers(this, _customerComments_extraInitializers), __runInitializers(this, _preferredRefundMethod_initializers, void 0));
                this.exchangeItemIds = (__runInitializers(this, _preferredRefundMethod_extraInitializers), __runInitializers(this, _exchangeItemIds_initializers, void 0));
                __runInitializers(this, _exchangeItemIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original order ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _rmaType_decorators = [(0, swagger_1.ApiProperty)({ description: 'RMA type', enum: RMAType }), (0, class_validator_1.IsEnum)(RMAType), (0, class_validator_1.IsNotEmpty)()];
            _lineItems_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return line items', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _customerComments_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Customer comments' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _preferredRefundMethod_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Preferred refund method', enum: RefundMethod }), (0, class_validator_1.IsEnum)(RefundMethod), (0, class_validator_1.IsOptional)()];
            _exchangeItemIds_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Exchange item IDs' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
            __esDecorate(null, null, _rmaType_decorators, { kind: "field", name: "rmaType", static: false, private: false, access: { has: obj => "rmaType" in obj, get: obj => obj.rmaType, set: (obj, value) => { obj.rmaType = value; } }, metadata: _metadata }, _rmaType_initializers, _rmaType_extraInitializers);
            __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
            __esDecorate(null, null, _customerComments_decorators, { kind: "field", name: "customerComments", static: false, private: false, access: { has: obj => "customerComments" in obj, get: obj => obj.customerComments, set: (obj, value) => { obj.customerComments = value; } }, metadata: _metadata }, _customerComments_initializers, _customerComments_extraInitializers);
            __esDecorate(null, null, _preferredRefundMethod_decorators, { kind: "field", name: "preferredRefundMethod", static: false, private: false, access: { has: obj => "preferredRefundMethod" in obj, get: obj => obj.preferredRefundMethod, set: (obj, value) => { obj.preferredRefundMethod = value; } }, metadata: _metadata }, _preferredRefundMethod_initializers, _preferredRefundMethod_extraInitializers);
            __esDecorate(null, null, _exchangeItemIds_decorators, { kind: "field", name: "exchangeItemIds", static: false, private: false, access: { has: obj => "exchangeItemIds" in obj, get: obj => obj.exchangeItemIds, set: (obj, value) => { obj.exchangeItemIds = value; } }, metadata: _metadata }, _exchangeItemIds_initializers, _exchangeItemIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateReturnRequestDto = CreateReturnRequestDto;
/**
 * Return authorization DTO
 */
let AuthorizeReturnDto = (() => {
    var _a;
    let _authorizationStatus_decorators;
    let _authorizationStatus_initializers = [];
    let _authorizationStatus_extraInitializers = [];
    let _authorizedBy_decorators;
    let _authorizedBy_initializers = [];
    let _authorizedBy_extraInitializers = [];
    let _authorizationNotes_decorators;
    let _authorizationNotes_initializers = [];
    let _authorizationNotes_extraInitializers = [];
    let _expirationDays_decorators;
    let _expirationDays_initializers = [];
    let _expirationDays_extraInitializers = [];
    let _restockingFeePercent_decorators;
    let _restockingFeePercent_initializers = [];
    let _restockingFeePercent_extraInitializers = [];
    return _a = class AuthorizeReturnDto {
            constructor() {
                this.authorizationStatus = __runInitializers(this, _authorizationStatus_initializers, void 0);
                this.authorizedBy = (__runInitializers(this, _authorizationStatus_extraInitializers), __runInitializers(this, _authorizedBy_initializers, void 0));
                this.authorizationNotes = (__runInitializers(this, _authorizedBy_extraInitializers), __runInitializers(this, _authorizationNotes_initializers, void 0));
                this.expirationDays = (__runInitializers(this, _authorizationNotes_extraInitializers), __runInitializers(this, _expirationDays_initializers, void 0));
                this.restockingFeePercent = (__runInitializers(this, _expirationDays_extraInitializers), __runInitializers(this, _restockingFeePercent_initializers, void 0));
                __runInitializers(this, _restockingFeePercent_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _authorizationStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorization status', enum: ReturnAuthStatus }), (0, class_validator_1.IsEnum)(ReturnAuthStatus), (0, class_validator_1.IsNotEmpty)()];
            _authorizedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorized by user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _authorizationNotes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Authorization notes' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _expirationDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'RMA expiration days' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(365)];
            _restockingFeePercent_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Restocking fee percentage' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0), (0, class_validator_1.Max)(100)];
            __esDecorate(null, null, _authorizationStatus_decorators, { kind: "field", name: "authorizationStatus", static: false, private: false, access: { has: obj => "authorizationStatus" in obj, get: obj => obj.authorizationStatus, set: (obj, value) => { obj.authorizationStatus = value; } }, metadata: _metadata }, _authorizationStatus_initializers, _authorizationStatus_extraInitializers);
            __esDecorate(null, null, _authorizedBy_decorators, { kind: "field", name: "authorizedBy", static: false, private: false, access: { has: obj => "authorizedBy" in obj, get: obj => obj.authorizedBy, set: (obj, value) => { obj.authorizedBy = value; } }, metadata: _metadata }, _authorizedBy_initializers, _authorizedBy_extraInitializers);
            __esDecorate(null, null, _authorizationNotes_decorators, { kind: "field", name: "authorizationNotes", static: false, private: false, access: { has: obj => "authorizationNotes" in obj, get: obj => obj.authorizationNotes, set: (obj, value) => { obj.authorizationNotes = value; } }, metadata: _metadata }, _authorizationNotes_initializers, _authorizationNotes_extraInitializers);
            __esDecorate(null, null, _expirationDays_decorators, { kind: "field", name: "expirationDays", static: false, private: false, access: { has: obj => "expirationDays" in obj, get: obj => obj.expirationDays, set: (obj, value) => { obj.expirationDays = value; } }, metadata: _metadata }, _expirationDays_initializers, _expirationDays_extraInitializers);
            __esDecorate(null, null, _restockingFeePercent_decorators, { kind: "field", name: "restockingFeePercent", static: false, private: false, access: { has: obj => "restockingFeePercent" in obj, get: obj => obj.restockingFeePercent, set: (obj, value) => { obj.restockingFeePercent = value; } }, metadata: _metadata }, _restockingFeePercent_initializers, _restockingFeePercent_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.AuthorizeReturnDto = AuthorizeReturnDto;
/**
 * Return inspection DTO
 */
let RecordInspectionDto = (() => {
    var _a;
    let _inspectedBy_decorators;
    let _inspectedBy_initializers = [];
    let _inspectedBy_extraInitializers = [];
    let _lineInspections_decorators;
    let _lineInspections_initializers = [];
    let _lineInspections_extraInitializers = [];
    let _inspectionNotes_decorators;
    let _inspectionNotes_initializers = [];
    let _inspectionNotes_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    return _a = class RecordInspectionDto {
            constructor() {
                this.inspectedBy = __runInitializers(this, _inspectedBy_initializers, void 0);
                this.lineInspections = (__runInitializers(this, _inspectedBy_extraInitializers), __runInitializers(this, _lineInspections_initializers, void 0));
                this.inspectionNotes = (__runInitializers(this, _lineInspections_extraInitializers), __runInitializers(this, _inspectionNotes_initializers, void 0));
                this.photos = (__runInitializers(this, _inspectionNotes_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
                __runInitializers(this, _photos_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _inspectedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspected by user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _lineInspections_decorators = [(0, swagger_1.ApiProperty)({ description: 'Line inspections', type: [Object] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => Object), (0, class_validator_1.IsNotEmpty)()];
            _inspectionNotes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Inspection notes' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _photos_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Photo URLs' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _inspectedBy_decorators, { kind: "field", name: "inspectedBy", static: false, private: false, access: { has: obj => "inspectedBy" in obj, get: obj => obj.inspectedBy, set: (obj, value) => { obj.inspectedBy = value; } }, metadata: _metadata }, _inspectedBy_initializers, _inspectedBy_extraInitializers);
            __esDecorate(null, null, _lineInspections_decorators, { kind: "field", name: "lineInspections", static: false, private: false, access: { has: obj => "lineInspections" in obj, get: obj => obj.lineInspections, set: (obj, value) => { obj.lineInspections = value; } }, metadata: _metadata }, _lineInspections_initializers, _lineInspections_extraInitializers);
            __esDecorate(null, null, _inspectionNotes_decorators, { kind: "field", name: "inspectionNotes", static: false, private: false, access: { has: obj => "inspectionNotes" in obj, get: obj => obj.inspectionNotes, set: (obj, value) => { obj.inspectionNotes = value; } }, metadata: _metadata }, _inspectionNotes_initializers, _inspectionNotes_extraInitializers);
            __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RecordInspectionDto = RecordInspectionDto;
/**
 * Refund processing DTO
 */
let ProcessRefundDto = (() => {
    var _a;
    let _refundMethod_decorators;
    let _refundMethod_initializers = [];
    let _refundMethod_extraInitializers = [];
    let _refundAmountOverride_decorators;
    let _refundAmountOverride_initializers = [];
    let _refundAmountOverride_extraInitializers = [];
    let _refundNotes_decorators;
    let _refundNotes_initializers = [];
    let _refundNotes_extraInitializers = [];
    let _storeCreditAccountId_decorators;
    let _storeCreditAccountId_initializers = [];
    let _storeCreditAccountId_extraInitializers = [];
    let _processedBy_decorators;
    let _processedBy_initializers = [];
    let _processedBy_extraInitializers = [];
    return _a = class ProcessRefundDto {
            constructor() {
                this.refundMethod = __runInitializers(this, _refundMethod_initializers, void 0);
                this.refundAmountOverride = (__runInitializers(this, _refundMethod_extraInitializers), __runInitializers(this, _refundAmountOverride_initializers, void 0));
                this.refundNotes = (__runInitializers(this, _refundAmountOverride_extraInitializers), __runInitializers(this, _refundNotes_initializers, void 0));
                this.storeCreditAccountId = (__runInitializers(this, _refundNotes_extraInitializers), __runInitializers(this, _storeCreditAccountId_initializers, void 0));
                this.processedBy = (__runInitializers(this, _storeCreditAccountId_extraInitializers), __runInitializers(this, _processedBy_initializers, void 0));
                __runInitializers(this, _processedBy_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _refundMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund method', enum: RefundMethod }), (0, class_validator_1.IsEnum)(RefundMethod), (0, class_validator_1.IsNotEmpty)()];
            _refundAmountOverride_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Refund amount override' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Min)(0)];
            _refundNotes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Refund reason/notes' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _storeCreditAccountId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Store credit account ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _processedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Processed by user ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _refundMethod_decorators, { kind: "field", name: "refundMethod", static: false, private: false, access: { has: obj => "refundMethod" in obj, get: obj => obj.refundMethod, set: (obj, value) => { obj.refundMethod = value; } }, metadata: _metadata }, _refundMethod_initializers, _refundMethod_extraInitializers);
            __esDecorate(null, null, _refundAmountOverride_decorators, { kind: "field", name: "refundAmountOverride", static: false, private: false, access: { has: obj => "refundAmountOverride" in obj, get: obj => obj.refundAmountOverride, set: (obj, value) => { obj.refundAmountOverride = value; } }, metadata: _metadata }, _refundAmountOverride_initializers, _refundAmountOverride_extraInitializers);
            __esDecorate(null, null, _refundNotes_decorators, { kind: "field", name: "refundNotes", static: false, private: false, access: { has: obj => "refundNotes" in obj, get: obj => obj.refundNotes, set: (obj, value) => { obj.refundNotes = value; } }, metadata: _metadata }, _refundNotes_initializers, _refundNotes_extraInitializers);
            __esDecorate(null, null, _storeCreditAccountId_decorators, { kind: "field", name: "storeCreditAccountId", static: false, private: false, access: { has: obj => "storeCreditAccountId" in obj, get: obj => obj.storeCreditAccountId, set: (obj, value) => { obj.storeCreditAccountId = value; } }, metadata: _metadata }, _storeCreditAccountId_initializers, _storeCreditAccountId_extraInitializers);
            __esDecorate(null, null, _processedBy_decorators, { kind: "field", name: "processedBy", static: false, private: false, access: { has: obj => "processedBy" in obj, get: obj => obj.processedBy, set: (obj, value) => { obj.processedBy = value; } }, metadata: _metadata }, _processedBy_initializers, _processedBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ProcessRefundDto = ProcessRefundDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Return request header model
 */
let ReturnRequest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'return_requests',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['rmaNumber'], unique: true },
                { fields: ['orderId'] },
                { fields: ['customerId'] },
                { fields: ['returnStatus'] },
                { fields: ['authorizationStatus'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _returnId_decorators;
    let _returnId_initializers = [];
    let _returnId_extraInitializers = [];
    let _rmaNumber_decorators;
    let _rmaNumber_initializers = [];
    let _rmaNumber_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _rmaType_decorators;
    let _rmaType_initializers = [];
    let _rmaType_extraInitializers = [];
    let _returnStatus_decorators;
    let _returnStatus_initializers = [];
    let _returnStatus_extraInitializers = [];
    let _authorizationStatus_decorators;
    let _authorizationStatus_initializers = [];
    let _authorizationStatus_extraInitializers = [];
    let _requestDate_decorators;
    let _requestDate_initializers = [];
    let _requestDate_extraInitializers = [];
    let _authorizationDate_decorators;
    let _authorizationDate_initializers = [];
    let _authorizationDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _authorizedBy_decorators;
    let _authorizedBy_initializers = [];
    let _authorizedBy_extraInitializers = [];
    let _authorizationNotes_decorators;
    let _authorizationNotes_initializers = [];
    let _authorizationNotes_extraInitializers = [];
    let _customerComments_decorators;
    let _customerComments_initializers = [];
    let _customerComments_extraInitializers = [];
    let _returnShippingAddress_decorators;
    let _returnShippingAddress_initializers = [];
    let _returnShippingAddress_extraInitializers = [];
    let _shippingLabelUrl_decorators;
    let _shippingLabelUrl_initializers = [];
    let _shippingLabelUrl_extraInitializers = [];
    let _trackingNumber_decorators;
    let _trackingNumber_initializers = [];
    let _trackingNumber_extraInitializers = [];
    let _carrier_decorators;
    let _carrier_initializers = [];
    let _carrier_extraInitializers = [];
    let _receivedDate_decorators;
    let _receivedDate_initializers = [];
    let _receivedDate_extraInitializers = [];
    let _receivedBy_decorators;
    let _receivedBy_initializers = [];
    let _receivedBy_extraInitializers = [];
    let _inspectionResult_decorators;
    let _inspectionResult_initializers = [];
    let _inspectionResult_extraInitializers = [];
    let _restockingFeePercent_decorators;
    let _restockingFeePercent_initializers = [];
    let _restockingFeePercent_extraInitializers = [];
    let _restockingFeeAmount_decorators;
    let _restockingFeeAmount_initializers = [];
    let _restockingFeeAmount_extraInitializers = [];
    let _refundCalculation_decorators;
    let _refundCalculation_initializers = [];
    let _refundCalculation_extraInitializers = [];
    let _preferredRefundMethod_decorators;
    let _preferredRefundMethod_initializers = [];
    let _preferredRefundMethod_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _updatedBy_decorators;
    let _updatedBy_initializers = [];
    let _updatedBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _lines_decorators;
    let _lines_initializers = [];
    let _lines_extraInitializers = [];
    let _refunds_decorators;
    let _refunds_initializers = [];
    let _refunds_extraInitializers = [];
    var ReturnRequest = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.returnId = __runInitializers(this, _returnId_initializers, void 0);
            this.rmaNumber = (__runInitializers(this, _returnId_extraInitializers), __runInitializers(this, _rmaNumber_initializers, void 0));
            this.orderId = (__runInitializers(this, _rmaNumber_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.customerId = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.rmaType = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _rmaType_initializers, void 0));
            this.returnStatus = (__runInitializers(this, _rmaType_extraInitializers), __runInitializers(this, _returnStatus_initializers, void 0));
            this.authorizationStatus = (__runInitializers(this, _returnStatus_extraInitializers), __runInitializers(this, _authorizationStatus_initializers, void 0));
            this.requestDate = (__runInitializers(this, _authorizationStatus_extraInitializers), __runInitializers(this, _requestDate_initializers, void 0));
            this.authorizationDate = (__runInitializers(this, _requestDate_extraInitializers), __runInitializers(this, _authorizationDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _authorizationDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.authorizedBy = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _authorizedBy_initializers, void 0));
            this.authorizationNotes = (__runInitializers(this, _authorizedBy_extraInitializers), __runInitializers(this, _authorizationNotes_initializers, void 0));
            this.customerComments = (__runInitializers(this, _authorizationNotes_extraInitializers), __runInitializers(this, _customerComments_initializers, void 0));
            this.returnShippingAddress = (__runInitializers(this, _customerComments_extraInitializers), __runInitializers(this, _returnShippingAddress_initializers, void 0));
            this.shippingLabelUrl = (__runInitializers(this, _returnShippingAddress_extraInitializers), __runInitializers(this, _shippingLabelUrl_initializers, void 0));
            this.trackingNumber = (__runInitializers(this, _shippingLabelUrl_extraInitializers), __runInitializers(this, _trackingNumber_initializers, void 0));
            this.carrier = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _carrier_initializers, void 0));
            this.receivedDate = (__runInitializers(this, _carrier_extraInitializers), __runInitializers(this, _receivedDate_initializers, void 0));
            this.receivedBy = (__runInitializers(this, _receivedDate_extraInitializers), __runInitializers(this, _receivedBy_initializers, void 0));
            this.inspectionResult = (__runInitializers(this, _receivedBy_extraInitializers), __runInitializers(this, _inspectionResult_initializers, void 0));
            this.restockingFeePercent = (__runInitializers(this, _inspectionResult_extraInitializers), __runInitializers(this, _restockingFeePercent_initializers, void 0));
            this.restockingFeeAmount = (__runInitializers(this, _restockingFeePercent_extraInitializers), __runInitializers(this, _restockingFeeAmount_initializers, void 0));
            this.refundCalculation = (__runInitializers(this, _restockingFeeAmount_extraInitializers), __runInitializers(this, _refundCalculation_initializers, void 0));
            this.preferredRefundMethod = (__runInitializers(this, _refundCalculation_extraInitializers), __runInitializers(this, _preferredRefundMethod_initializers, void 0));
            this.createdBy = (__runInitializers(this, _preferredRefundMethod_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.lines = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _lines_initializers, void 0));
            this.refunds = (__runInitializers(this, _lines_extraInitializers), __runInitializers(this, _refunds_initializers, void 0));
            __runInitializers(this, _refunds_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReturnRequest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _returnId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return request ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _rmaNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'RMA number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original order ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _rmaType_decorators = [(0, swagger_1.ApiProperty)({ description: 'RMA type', enum: RMAType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RMAType)),
                allowNull: false,
                defaultValue: RMAType.STANDARD_RETURN,
            })];
        _returnStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return status', enum: ReturnStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReturnStatus)),
                allowNull: false,
                defaultValue: ReturnStatus.REQUESTED,
            }), sequelize_typescript_1.Index];
        _authorizationStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorization status', enum: ReturnAuthStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReturnAuthStatus)),
                allowNull: false,
                defaultValue: ReturnAuthStatus.PENDING,
            }), sequelize_typescript_1.Index];
        _requestDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Request date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            })];
        _authorizationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorization date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'RMA expiration date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _authorizedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorized by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _authorizationNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Authorization notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _customerComments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer comments' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _returnShippingAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return shipping address (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _shippingLabelUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping label URL' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
            })];
        _trackingNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tracking number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _carrier_decorators = [(0, swagger_1.ApiProperty)({ description: 'Carrier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _receivedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Received date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _receivedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Received by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _inspectionResult_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection result (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _restockingFeePercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Restocking fee percentage' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _restockingFeeAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Restocking fee amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _refundCalculation_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund calculation (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _preferredRefundMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Preferred refund method', enum: RefundMethod }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RefundMethod)),
                allowNull: true,
            })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _updatedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Updated by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        _lines_decorators = [(0, sequelize_typescript_1.HasMany)(() => ReturnLine)];
        _refunds_decorators = [(0, sequelize_typescript_1.HasMany)(() => Refund)];
        __esDecorate(null, null, _returnId_decorators, { kind: "field", name: "returnId", static: false, private: false, access: { has: obj => "returnId" in obj, get: obj => obj.returnId, set: (obj, value) => { obj.returnId = value; } }, metadata: _metadata }, _returnId_initializers, _returnId_extraInitializers);
        __esDecorate(null, null, _rmaNumber_decorators, { kind: "field", name: "rmaNumber", static: false, private: false, access: { has: obj => "rmaNumber" in obj, get: obj => obj.rmaNumber, set: (obj, value) => { obj.rmaNumber = value; } }, metadata: _metadata }, _rmaNumber_initializers, _rmaNumber_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _rmaType_decorators, { kind: "field", name: "rmaType", static: false, private: false, access: { has: obj => "rmaType" in obj, get: obj => obj.rmaType, set: (obj, value) => { obj.rmaType = value; } }, metadata: _metadata }, _rmaType_initializers, _rmaType_extraInitializers);
        __esDecorate(null, null, _returnStatus_decorators, { kind: "field", name: "returnStatus", static: false, private: false, access: { has: obj => "returnStatus" in obj, get: obj => obj.returnStatus, set: (obj, value) => { obj.returnStatus = value; } }, metadata: _metadata }, _returnStatus_initializers, _returnStatus_extraInitializers);
        __esDecorate(null, null, _authorizationStatus_decorators, { kind: "field", name: "authorizationStatus", static: false, private: false, access: { has: obj => "authorizationStatus" in obj, get: obj => obj.authorizationStatus, set: (obj, value) => { obj.authorizationStatus = value; } }, metadata: _metadata }, _authorizationStatus_initializers, _authorizationStatus_extraInitializers);
        __esDecorate(null, null, _requestDate_decorators, { kind: "field", name: "requestDate", static: false, private: false, access: { has: obj => "requestDate" in obj, get: obj => obj.requestDate, set: (obj, value) => { obj.requestDate = value; } }, metadata: _metadata }, _requestDate_initializers, _requestDate_extraInitializers);
        __esDecorate(null, null, _authorizationDate_decorators, { kind: "field", name: "authorizationDate", static: false, private: false, access: { has: obj => "authorizationDate" in obj, get: obj => obj.authorizationDate, set: (obj, value) => { obj.authorizationDate = value; } }, metadata: _metadata }, _authorizationDate_initializers, _authorizationDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _authorizedBy_decorators, { kind: "field", name: "authorizedBy", static: false, private: false, access: { has: obj => "authorizedBy" in obj, get: obj => obj.authorizedBy, set: (obj, value) => { obj.authorizedBy = value; } }, metadata: _metadata }, _authorizedBy_initializers, _authorizedBy_extraInitializers);
        __esDecorate(null, null, _authorizationNotes_decorators, { kind: "field", name: "authorizationNotes", static: false, private: false, access: { has: obj => "authorizationNotes" in obj, get: obj => obj.authorizationNotes, set: (obj, value) => { obj.authorizationNotes = value; } }, metadata: _metadata }, _authorizationNotes_initializers, _authorizationNotes_extraInitializers);
        __esDecorate(null, null, _customerComments_decorators, { kind: "field", name: "customerComments", static: false, private: false, access: { has: obj => "customerComments" in obj, get: obj => obj.customerComments, set: (obj, value) => { obj.customerComments = value; } }, metadata: _metadata }, _customerComments_initializers, _customerComments_extraInitializers);
        __esDecorate(null, null, _returnShippingAddress_decorators, { kind: "field", name: "returnShippingAddress", static: false, private: false, access: { has: obj => "returnShippingAddress" in obj, get: obj => obj.returnShippingAddress, set: (obj, value) => { obj.returnShippingAddress = value; } }, metadata: _metadata }, _returnShippingAddress_initializers, _returnShippingAddress_extraInitializers);
        __esDecorate(null, null, _shippingLabelUrl_decorators, { kind: "field", name: "shippingLabelUrl", static: false, private: false, access: { has: obj => "shippingLabelUrl" in obj, get: obj => obj.shippingLabelUrl, set: (obj, value) => { obj.shippingLabelUrl = value; } }, metadata: _metadata }, _shippingLabelUrl_initializers, _shippingLabelUrl_extraInitializers);
        __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: obj => "trackingNumber" in obj, get: obj => obj.trackingNumber, set: (obj, value) => { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
        __esDecorate(null, null, _carrier_decorators, { kind: "field", name: "carrier", static: false, private: false, access: { has: obj => "carrier" in obj, get: obj => obj.carrier, set: (obj, value) => { obj.carrier = value; } }, metadata: _metadata }, _carrier_initializers, _carrier_extraInitializers);
        __esDecorate(null, null, _receivedDate_decorators, { kind: "field", name: "receivedDate", static: false, private: false, access: { has: obj => "receivedDate" in obj, get: obj => obj.receivedDate, set: (obj, value) => { obj.receivedDate = value; } }, metadata: _metadata }, _receivedDate_initializers, _receivedDate_extraInitializers);
        __esDecorate(null, null, _receivedBy_decorators, { kind: "field", name: "receivedBy", static: false, private: false, access: { has: obj => "receivedBy" in obj, get: obj => obj.receivedBy, set: (obj, value) => { obj.receivedBy = value; } }, metadata: _metadata }, _receivedBy_initializers, _receivedBy_extraInitializers);
        __esDecorate(null, null, _inspectionResult_decorators, { kind: "field", name: "inspectionResult", static: false, private: false, access: { has: obj => "inspectionResult" in obj, get: obj => obj.inspectionResult, set: (obj, value) => { obj.inspectionResult = value; } }, metadata: _metadata }, _inspectionResult_initializers, _inspectionResult_extraInitializers);
        __esDecorate(null, null, _restockingFeePercent_decorators, { kind: "field", name: "restockingFeePercent", static: false, private: false, access: { has: obj => "restockingFeePercent" in obj, get: obj => obj.restockingFeePercent, set: (obj, value) => { obj.restockingFeePercent = value; } }, metadata: _metadata }, _restockingFeePercent_initializers, _restockingFeePercent_extraInitializers);
        __esDecorate(null, null, _restockingFeeAmount_decorators, { kind: "field", name: "restockingFeeAmount", static: false, private: false, access: { has: obj => "restockingFeeAmount" in obj, get: obj => obj.restockingFeeAmount, set: (obj, value) => { obj.restockingFeeAmount = value; } }, metadata: _metadata }, _restockingFeeAmount_initializers, _restockingFeeAmount_extraInitializers);
        __esDecorate(null, null, _refundCalculation_decorators, { kind: "field", name: "refundCalculation", static: false, private: false, access: { has: obj => "refundCalculation" in obj, get: obj => obj.refundCalculation, set: (obj, value) => { obj.refundCalculation = value; } }, metadata: _metadata }, _refundCalculation_initializers, _refundCalculation_extraInitializers);
        __esDecorate(null, null, _preferredRefundMethod_decorators, { kind: "field", name: "preferredRefundMethod", static: false, private: false, access: { has: obj => "preferredRefundMethod" in obj, get: obj => obj.preferredRefundMethod, set: (obj, value) => { obj.preferredRefundMethod = value; } }, metadata: _metadata }, _preferredRefundMethod_initializers, _preferredRefundMethod_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _lines_decorators, { kind: "field", name: "lines", static: false, private: false, access: { has: obj => "lines" in obj, get: obj => obj.lines, set: (obj, value) => { obj.lines = value; } }, metadata: _metadata }, _lines_initializers, _lines_extraInitializers);
        __esDecorate(null, null, _refunds_decorators, { kind: "field", name: "refunds", static: false, private: false, access: { has: obj => "refunds" in obj, get: obj => obj.refunds, set: (obj, value) => { obj.refunds = value; } }, metadata: _metadata }, _refunds_initializers, _refunds_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReturnRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReturnRequest = _classThis;
})();
exports.ReturnRequest = ReturnRequest;
/**
 * Return line model
 */
let ReturnLine = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'return_lines',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['returnId'] },
                { fields: ['orderLineId'] },
                { fields: ['itemId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _returnLineId_decorators;
    let _returnLineId_initializers = [];
    let _returnLineId_extraInitializers = [];
    let _returnId_decorators;
    let _returnId_initializers = [];
    let _returnId_extraInitializers = [];
    let _orderLineId_decorators;
    let _orderLineId_initializers = [];
    let _orderLineId_extraInitializers = [];
    let _itemId_decorators;
    let _itemId_initializers = [];
    let _itemId_extraInitializers = [];
    let _itemSku_decorators;
    let _itemSku_initializers = [];
    let _itemSku_extraInitializers = [];
    let _itemDescription_decorators;
    let _itemDescription_initializers = [];
    let _itemDescription_extraInitializers = [];
    let _quantityOrdered_decorators;
    let _quantityOrdered_initializers = [];
    let _quantityOrdered_extraInitializers = [];
    let _quantityReturned_decorators;
    let _quantityReturned_initializers = [];
    let _quantityReturned_extraInitializers = [];
    let _quantityReceived_decorators;
    let _quantityReceived_initializers = [];
    let _quantityReceived_extraInitializers = [];
    let _quantityPassed_decorators;
    let _quantityPassed_initializers = [];
    let _quantityPassed_extraInitializers = [];
    let _quantityFailed_decorators;
    let _quantityFailed_initializers = [];
    let _quantityFailed_extraInitializers = [];
    let _unitPrice_decorators;
    let _unitPrice_initializers = [];
    let _unitPrice_extraInitializers = [];
    let _returnReasonCode_decorators;
    let _returnReasonCode_initializers = [];
    let _returnReasonCode_extraInitializers = [];
    let _reasonDescription_decorators;
    let _reasonDescription_initializers = [];
    let _reasonDescription_extraInitializers = [];
    let _itemCondition_decorators;
    let _itemCondition_initializers = [];
    let _itemCondition_extraInitializers = [];
    let _restockingDisposition_decorators;
    let _restockingDisposition_initializers = [];
    let _restockingDisposition_extraInitializers = [];
    let _serialNumbers_decorators;
    let _serialNumbers_initializers = [];
    let _serialNumbers_extraInitializers = [];
    let _lotNumbers_decorators;
    let _lotNumbers_initializers = [];
    let _lotNumbers_extraInitializers = [];
    let _defects_decorators;
    let _defects_initializers = [];
    let _defects_extraInitializers = [];
    let _inspectionNotes_decorators;
    let _inspectionNotes_initializers = [];
    let _inspectionNotes_extraInitializers = [];
    let _images_decorators;
    let _images_initializers = [];
    let _images_extraInitializers = [];
    let _returnRequest_decorators;
    let _returnRequest_initializers = [];
    let _returnRequest_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ReturnLine = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.returnLineId = __runInitializers(this, _returnLineId_initializers, void 0);
            this.returnId = (__runInitializers(this, _returnLineId_extraInitializers), __runInitializers(this, _returnId_initializers, void 0));
            this.orderLineId = (__runInitializers(this, _returnId_extraInitializers), __runInitializers(this, _orderLineId_initializers, void 0));
            this.itemId = (__runInitializers(this, _orderLineId_extraInitializers), __runInitializers(this, _itemId_initializers, void 0));
            this.itemSku = (__runInitializers(this, _itemId_extraInitializers), __runInitializers(this, _itemSku_initializers, void 0));
            this.itemDescription = (__runInitializers(this, _itemSku_extraInitializers), __runInitializers(this, _itemDescription_initializers, void 0));
            this.quantityOrdered = (__runInitializers(this, _itemDescription_extraInitializers), __runInitializers(this, _quantityOrdered_initializers, void 0));
            this.quantityReturned = (__runInitializers(this, _quantityOrdered_extraInitializers), __runInitializers(this, _quantityReturned_initializers, void 0));
            this.quantityReceived = (__runInitializers(this, _quantityReturned_extraInitializers), __runInitializers(this, _quantityReceived_initializers, void 0));
            this.quantityPassed = (__runInitializers(this, _quantityReceived_extraInitializers), __runInitializers(this, _quantityPassed_initializers, void 0));
            this.quantityFailed = (__runInitializers(this, _quantityPassed_extraInitializers), __runInitializers(this, _quantityFailed_initializers, void 0));
            this.unitPrice = (__runInitializers(this, _quantityFailed_extraInitializers), __runInitializers(this, _unitPrice_initializers, void 0));
            this.returnReasonCode = (__runInitializers(this, _unitPrice_extraInitializers), __runInitializers(this, _returnReasonCode_initializers, void 0));
            this.reasonDescription = (__runInitializers(this, _returnReasonCode_extraInitializers), __runInitializers(this, _reasonDescription_initializers, void 0));
            this.itemCondition = (__runInitializers(this, _reasonDescription_extraInitializers), __runInitializers(this, _itemCondition_initializers, void 0));
            this.restockingDisposition = (__runInitializers(this, _itemCondition_extraInitializers), __runInitializers(this, _restockingDisposition_initializers, void 0));
            this.serialNumbers = (__runInitializers(this, _restockingDisposition_extraInitializers), __runInitializers(this, _serialNumbers_initializers, void 0));
            this.lotNumbers = (__runInitializers(this, _serialNumbers_extraInitializers), __runInitializers(this, _lotNumbers_initializers, void 0));
            this.defects = (__runInitializers(this, _lotNumbers_extraInitializers), __runInitializers(this, _defects_initializers, void 0));
            this.inspectionNotes = (__runInitializers(this, _defects_extraInitializers), __runInitializers(this, _inspectionNotes_initializers, void 0));
            this.images = (__runInitializers(this, _inspectionNotes_extraInitializers), __runInitializers(this, _images_initializers, void 0));
            this.returnRequest = (__runInitializers(this, _images_extraInitializers), __runInitializers(this, _returnRequest_initializers, void 0));
            this.createdAt = (__runInitializers(this, _returnRequest_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ReturnLine");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _returnLineId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return line ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _returnId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return request ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ReturnRequest), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _orderLineId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original order line ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _itemId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _itemSku_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item SKU' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _itemDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _quantityOrdered_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity ordered' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _quantityReturned_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity returned' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
            })];
        _quantityReceived_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity received' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _quantityPassed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity passed inspection' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _quantityFailed_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quantity failed inspection' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: false,
                defaultValue: 0,
            })];
        _unitPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _returnReasonCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return reason code', enum: ReturnReasonCode }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReturnReasonCode)),
                allowNull: false,
            })];
        _reasonDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reason description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _itemCondition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Item condition', enum: ItemCondition }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ItemCondition)),
                allowNull: true,
            })];
        _restockingDisposition_decorators = [(0, swagger_1.ApiProperty)({ description: 'Restocking disposition', enum: RestockingDisposition }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RestockingDisposition)),
                allowNull: true,
            })];
        _serialNumbers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Serial numbers (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _lotNumbers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lot numbers (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _defects_decorators = [(0, swagger_1.ApiProperty)({ description: 'Defects found (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _inspectionNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _images_decorators = [(0, swagger_1.ApiProperty)({ description: 'Images/photos (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _returnRequest_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ReturnRequest)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _returnLineId_decorators, { kind: "field", name: "returnLineId", static: false, private: false, access: { has: obj => "returnLineId" in obj, get: obj => obj.returnLineId, set: (obj, value) => { obj.returnLineId = value; } }, metadata: _metadata }, _returnLineId_initializers, _returnLineId_extraInitializers);
        __esDecorate(null, null, _returnId_decorators, { kind: "field", name: "returnId", static: false, private: false, access: { has: obj => "returnId" in obj, get: obj => obj.returnId, set: (obj, value) => { obj.returnId = value; } }, metadata: _metadata }, _returnId_initializers, _returnId_extraInitializers);
        __esDecorate(null, null, _orderLineId_decorators, { kind: "field", name: "orderLineId", static: false, private: false, access: { has: obj => "orderLineId" in obj, get: obj => obj.orderLineId, set: (obj, value) => { obj.orderLineId = value; } }, metadata: _metadata }, _orderLineId_initializers, _orderLineId_extraInitializers);
        __esDecorate(null, null, _itemId_decorators, { kind: "field", name: "itemId", static: false, private: false, access: { has: obj => "itemId" in obj, get: obj => obj.itemId, set: (obj, value) => { obj.itemId = value; } }, metadata: _metadata }, _itemId_initializers, _itemId_extraInitializers);
        __esDecorate(null, null, _itemSku_decorators, { kind: "field", name: "itemSku", static: false, private: false, access: { has: obj => "itemSku" in obj, get: obj => obj.itemSku, set: (obj, value) => { obj.itemSku = value; } }, metadata: _metadata }, _itemSku_initializers, _itemSku_extraInitializers);
        __esDecorate(null, null, _itemDescription_decorators, { kind: "field", name: "itemDescription", static: false, private: false, access: { has: obj => "itemDescription" in obj, get: obj => obj.itemDescription, set: (obj, value) => { obj.itemDescription = value; } }, metadata: _metadata }, _itemDescription_initializers, _itemDescription_extraInitializers);
        __esDecorate(null, null, _quantityOrdered_decorators, { kind: "field", name: "quantityOrdered", static: false, private: false, access: { has: obj => "quantityOrdered" in obj, get: obj => obj.quantityOrdered, set: (obj, value) => { obj.quantityOrdered = value; } }, metadata: _metadata }, _quantityOrdered_initializers, _quantityOrdered_extraInitializers);
        __esDecorate(null, null, _quantityReturned_decorators, { kind: "field", name: "quantityReturned", static: false, private: false, access: { has: obj => "quantityReturned" in obj, get: obj => obj.quantityReturned, set: (obj, value) => { obj.quantityReturned = value; } }, metadata: _metadata }, _quantityReturned_initializers, _quantityReturned_extraInitializers);
        __esDecorate(null, null, _quantityReceived_decorators, { kind: "field", name: "quantityReceived", static: false, private: false, access: { has: obj => "quantityReceived" in obj, get: obj => obj.quantityReceived, set: (obj, value) => { obj.quantityReceived = value; } }, metadata: _metadata }, _quantityReceived_initializers, _quantityReceived_extraInitializers);
        __esDecorate(null, null, _quantityPassed_decorators, { kind: "field", name: "quantityPassed", static: false, private: false, access: { has: obj => "quantityPassed" in obj, get: obj => obj.quantityPassed, set: (obj, value) => { obj.quantityPassed = value; } }, metadata: _metadata }, _quantityPassed_initializers, _quantityPassed_extraInitializers);
        __esDecorate(null, null, _quantityFailed_decorators, { kind: "field", name: "quantityFailed", static: false, private: false, access: { has: obj => "quantityFailed" in obj, get: obj => obj.quantityFailed, set: (obj, value) => { obj.quantityFailed = value; } }, metadata: _metadata }, _quantityFailed_initializers, _quantityFailed_extraInitializers);
        __esDecorate(null, null, _unitPrice_decorators, { kind: "field", name: "unitPrice", static: false, private: false, access: { has: obj => "unitPrice" in obj, get: obj => obj.unitPrice, set: (obj, value) => { obj.unitPrice = value; } }, metadata: _metadata }, _unitPrice_initializers, _unitPrice_extraInitializers);
        __esDecorate(null, null, _returnReasonCode_decorators, { kind: "field", name: "returnReasonCode", static: false, private: false, access: { has: obj => "returnReasonCode" in obj, get: obj => obj.returnReasonCode, set: (obj, value) => { obj.returnReasonCode = value; } }, metadata: _metadata }, _returnReasonCode_initializers, _returnReasonCode_extraInitializers);
        __esDecorate(null, null, _reasonDescription_decorators, { kind: "field", name: "reasonDescription", static: false, private: false, access: { has: obj => "reasonDescription" in obj, get: obj => obj.reasonDescription, set: (obj, value) => { obj.reasonDescription = value; } }, metadata: _metadata }, _reasonDescription_initializers, _reasonDescription_extraInitializers);
        __esDecorate(null, null, _itemCondition_decorators, { kind: "field", name: "itemCondition", static: false, private: false, access: { has: obj => "itemCondition" in obj, get: obj => obj.itemCondition, set: (obj, value) => { obj.itemCondition = value; } }, metadata: _metadata }, _itemCondition_initializers, _itemCondition_extraInitializers);
        __esDecorate(null, null, _restockingDisposition_decorators, { kind: "field", name: "restockingDisposition", static: false, private: false, access: { has: obj => "restockingDisposition" in obj, get: obj => obj.restockingDisposition, set: (obj, value) => { obj.restockingDisposition = value; } }, metadata: _metadata }, _restockingDisposition_initializers, _restockingDisposition_extraInitializers);
        __esDecorate(null, null, _serialNumbers_decorators, { kind: "field", name: "serialNumbers", static: false, private: false, access: { has: obj => "serialNumbers" in obj, get: obj => obj.serialNumbers, set: (obj, value) => { obj.serialNumbers = value; } }, metadata: _metadata }, _serialNumbers_initializers, _serialNumbers_extraInitializers);
        __esDecorate(null, null, _lotNumbers_decorators, { kind: "field", name: "lotNumbers", static: false, private: false, access: { has: obj => "lotNumbers" in obj, get: obj => obj.lotNumbers, set: (obj, value) => { obj.lotNumbers = value; } }, metadata: _metadata }, _lotNumbers_initializers, _lotNumbers_extraInitializers);
        __esDecorate(null, null, _defects_decorators, { kind: "field", name: "defects", static: false, private: false, access: { has: obj => "defects" in obj, get: obj => obj.defects, set: (obj, value) => { obj.defects = value; } }, metadata: _metadata }, _defects_initializers, _defects_extraInitializers);
        __esDecorate(null, null, _inspectionNotes_decorators, { kind: "field", name: "inspectionNotes", static: false, private: false, access: { has: obj => "inspectionNotes" in obj, get: obj => obj.inspectionNotes, set: (obj, value) => { obj.inspectionNotes = value; } }, metadata: _metadata }, _inspectionNotes_initializers, _inspectionNotes_extraInitializers);
        __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: obj => "images" in obj, get: obj => obj.images, set: (obj, value) => { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
        __esDecorate(null, null, _returnRequest_decorators, { kind: "field", name: "returnRequest", static: false, private: false, access: { has: obj => "returnRequest" in obj, get: obj => obj.returnRequest, set: (obj, value) => { obj.returnRequest = value; } }, metadata: _metadata }, _returnRequest_initializers, _returnRequest_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReturnLine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReturnLine = _classThis;
})();
exports.ReturnLine = ReturnLine;
/**
 * Refund transaction model
 */
let Refund = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'refunds',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['refundNumber'], unique: true },
                { fields: ['returnId'] },
                { fields: ['orderId'] },
                { fields: ['refundStatus'] },
                { fields: ['refundMethod'] },
                { fields: ['createdAt'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _refundId_decorators;
    let _refundId_initializers = [];
    let _refundId_extraInitializers = [];
    let _refundNumber_decorators;
    let _refundNumber_initializers = [];
    let _refundNumber_extraInitializers = [];
    let _returnId_decorators;
    let _returnId_initializers = [];
    let _returnId_extraInitializers = [];
    let _orderId_decorators;
    let _orderId_initializers = [];
    let _orderId_extraInitializers = [];
    let _refundStatus_decorators;
    let _refundStatus_initializers = [];
    let _refundStatus_extraInitializers = [];
    let _refundMethod_decorators;
    let _refundMethod_initializers = [];
    let _refundMethod_extraInitializers = [];
    let _refundAmount_decorators;
    let _refundAmount_initializers = [];
    let _refundAmount_extraInitializers = [];
    let _taxRefund_decorators;
    let _taxRefund_initializers = [];
    let _taxRefund_extraInitializers = [];
    let _shippingRefund_decorators;
    let _shippingRefund_initializers = [];
    let _shippingRefund_extraInitializers = [];
    let _restockingFee_decorators;
    let _restockingFee_initializers = [];
    let _restockingFee_extraInitializers = [];
    let _adjustments_decorators;
    let _adjustments_initializers = [];
    let _adjustments_extraInitializers = [];
    let _totalRefund_decorators;
    let _totalRefund_initializers = [];
    let _totalRefund_extraInitializers = [];
    let _originalPaymentMethodId_decorators;
    let _originalPaymentMethodId_initializers = [];
    let _originalPaymentMethodId_extraInitializers = [];
    let _storeCreditAccountId_decorators;
    let _storeCreditAccountId_initializers = [];
    let _storeCreditAccountId_extraInitializers = [];
    let _gatewayTransactionId_decorators;
    let _gatewayTransactionId_initializers = [];
    let _gatewayTransactionId_extraInitializers = [];
    let _refundNotes_decorators;
    let _refundNotes_initializers = [];
    let _refundNotes_extraInitializers = [];
    let _processedDate_decorators;
    let _processedDate_initializers = [];
    let _processedDate_extraInitializers = [];
    let _processedBy_decorators;
    let _processedBy_initializers = [];
    let _processedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _returnRequest_decorators;
    let _returnRequest_initializers = [];
    let _returnRequest_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Refund = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.refundId = __runInitializers(this, _refundId_initializers, void 0);
            this.refundNumber = (__runInitializers(this, _refundId_extraInitializers), __runInitializers(this, _refundNumber_initializers, void 0));
            this.returnId = (__runInitializers(this, _refundNumber_extraInitializers), __runInitializers(this, _returnId_initializers, void 0));
            this.orderId = (__runInitializers(this, _returnId_extraInitializers), __runInitializers(this, _orderId_initializers, void 0));
            this.refundStatus = (__runInitializers(this, _orderId_extraInitializers), __runInitializers(this, _refundStatus_initializers, void 0));
            this.refundMethod = (__runInitializers(this, _refundStatus_extraInitializers), __runInitializers(this, _refundMethod_initializers, void 0));
            this.refundAmount = (__runInitializers(this, _refundMethod_extraInitializers), __runInitializers(this, _refundAmount_initializers, void 0));
            this.taxRefund = (__runInitializers(this, _refundAmount_extraInitializers), __runInitializers(this, _taxRefund_initializers, void 0));
            this.shippingRefund = (__runInitializers(this, _taxRefund_extraInitializers), __runInitializers(this, _shippingRefund_initializers, void 0));
            this.restockingFee = (__runInitializers(this, _shippingRefund_extraInitializers), __runInitializers(this, _restockingFee_initializers, void 0));
            this.adjustments = (__runInitializers(this, _restockingFee_extraInitializers), __runInitializers(this, _adjustments_initializers, void 0));
            this.totalRefund = (__runInitializers(this, _adjustments_extraInitializers), __runInitializers(this, _totalRefund_initializers, void 0));
            this.originalPaymentMethodId = (__runInitializers(this, _totalRefund_extraInitializers), __runInitializers(this, _originalPaymentMethodId_initializers, void 0));
            this.storeCreditAccountId = (__runInitializers(this, _originalPaymentMethodId_extraInitializers), __runInitializers(this, _storeCreditAccountId_initializers, void 0));
            this.gatewayTransactionId = (__runInitializers(this, _storeCreditAccountId_extraInitializers), __runInitializers(this, _gatewayTransactionId_initializers, void 0));
            this.refundNotes = (__runInitializers(this, _gatewayTransactionId_extraInitializers), __runInitializers(this, _refundNotes_initializers, void 0));
            this.processedDate = (__runInitializers(this, _refundNotes_extraInitializers), __runInitializers(this, _processedDate_initializers, void 0));
            this.processedBy = (__runInitializers(this, _processedDate_extraInitializers), __runInitializers(this, _processedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _processedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.createdBy = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.returnRequest = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _returnRequest_initializers, void 0));
            this.createdAt = (__runInitializers(this, _returnRequest_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Refund");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _refundId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _refundNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _returnId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Return request ID' }), (0, sequelize_typescript_1.ForeignKey)(() => ReturnRequest), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _orderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original order ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _refundStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund status', enum: RefundStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RefundStatus)),
                allowNull: false,
                defaultValue: RefundStatus.PENDING,
            }), sequelize_typescript_1.Index];
        _refundMethod_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund method', enum: RefundMethod }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RefundMethod)),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _refundAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _taxRefund_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax refund amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _shippingRefund_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping refund amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _restockingFee_decorators = [(0, swagger_1.ApiProperty)({ description: 'Restocking fee deducted' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _adjustments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund adjustments' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
                defaultValue: 0,
            })];
        _totalRefund_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total refund amount' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _originalPaymentMethodId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Original payment method ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _storeCreditAccountId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Store credit account ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _gatewayTransactionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment gateway transaction ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: true,
            })];
        _refundNotes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Refund notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _processedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Processed date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _processedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Processed by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _returnRequest_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ReturnRequest)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _refundId_decorators, { kind: "field", name: "refundId", static: false, private: false, access: { has: obj => "refundId" in obj, get: obj => obj.refundId, set: (obj, value) => { obj.refundId = value; } }, metadata: _metadata }, _refundId_initializers, _refundId_extraInitializers);
        __esDecorate(null, null, _refundNumber_decorators, { kind: "field", name: "refundNumber", static: false, private: false, access: { has: obj => "refundNumber" in obj, get: obj => obj.refundNumber, set: (obj, value) => { obj.refundNumber = value; } }, metadata: _metadata }, _refundNumber_initializers, _refundNumber_extraInitializers);
        __esDecorate(null, null, _returnId_decorators, { kind: "field", name: "returnId", static: false, private: false, access: { has: obj => "returnId" in obj, get: obj => obj.returnId, set: (obj, value) => { obj.returnId = value; } }, metadata: _metadata }, _returnId_initializers, _returnId_extraInitializers);
        __esDecorate(null, null, _orderId_decorators, { kind: "field", name: "orderId", static: false, private: false, access: { has: obj => "orderId" in obj, get: obj => obj.orderId, set: (obj, value) => { obj.orderId = value; } }, metadata: _metadata }, _orderId_initializers, _orderId_extraInitializers);
        __esDecorate(null, null, _refundStatus_decorators, { kind: "field", name: "refundStatus", static: false, private: false, access: { has: obj => "refundStatus" in obj, get: obj => obj.refundStatus, set: (obj, value) => { obj.refundStatus = value; } }, metadata: _metadata }, _refundStatus_initializers, _refundStatus_extraInitializers);
        __esDecorate(null, null, _refundMethod_decorators, { kind: "field", name: "refundMethod", static: false, private: false, access: { has: obj => "refundMethod" in obj, get: obj => obj.refundMethod, set: (obj, value) => { obj.refundMethod = value; } }, metadata: _metadata }, _refundMethod_initializers, _refundMethod_extraInitializers);
        __esDecorate(null, null, _refundAmount_decorators, { kind: "field", name: "refundAmount", static: false, private: false, access: { has: obj => "refundAmount" in obj, get: obj => obj.refundAmount, set: (obj, value) => { obj.refundAmount = value; } }, metadata: _metadata }, _refundAmount_initializers, _refundAmount_extraInitializers);
        __esDecorate(null, null, _taxRefund_decorators, { kind: "field", name: "taxRefund", static: false, private: false, access: { has: obj => "taxRefund" in obj, get: obj => obj.taxRefund, set: (obj, value) => { obj.taxRefund = value; } }, metadata: _metadata }, _taxRefund_initializers, _taxRefund_extraInitializers);
        __esDecorate(null, null, _shippingRefund_decorators, { kind: "field", name: "shippingRefund", static: false, private: false, access: { has: obj => "shippingRefund" in obj, get: obj => obj.shippingRefund, set: (obj, value) => { obj.shippingRefund = value; } }, metadata: _metadata }, _shippingRefund_initializers, _shippingRefund_extraInitializers);
        __esDecorate(null, null, _restockingFee_decorators, { kind: "field", name: "restockingFee", static: false, private: false, access: { has: obj => "restockingFee" in obj, get: obj => obj.restockingFee, set: (obj, value) => { obj.restockingFee = value; } }, metadata: _metadata }, _restockingFee_initializers, _restockingFee_extraInitializers);
        __esDecorate(null, null, _adjustments_decorators, { kind: "field", name: "adjustments", static: false, private: false, access: { has: obj => "adjustments" in obj, get: obj => obj.adjustments, set: (obj, value) => { obj.adjustments = value; } }, metadata: _metadata }, _adjustments_initializers, _adjustments_extraInitializers);
        __esDecorate(null, null, _totalRefund_decorators, { kind: "field", name: "totalRefund", static: false, private: false, access: { has: obj => "totalRefund" in obj, get: obj => obj.totalRefund, set: (obj, value) => { obj.totalRefund = value; } }, metadata: _metadata }, _totalRefund_initializers, _totalRefund_extraInitializers);
        __esDecorate(null, null, _originalPaymentMethodId_decorators, { kind: "field", name: "originalPaymentMethodId", static: false, private: false, access: { has: obj => "originalPaymentMethodId" in obj, get: obj => obj.originalPaymentMethodId, set: (obj, value) => { obj.originalPaymentMethodId = value; } }, metadata: _metadata }, _originalPaymentMethodId_initializers, _originalPaymentMethodId_extraInitializers);
        __esDecorate(null, null, _storeCreditAccountId_decorators, { kind: "field", name: "storeCreditAccountId", static: false, private: false, access: { has: obj => "storeCreditAccountId" in obj, get: obj => obj.storeCreditAccountId, set: (obj, value) => { obj.storeCreditAccountId = value; } }, metadata: _metadata }, _storeCreditAccountId_initializers, _storeCreditAccountId_extraInitializers);
        __esDecorate(null, null, _gatewayTransactionId_decorators, { kind: "field", name: "gatewayTransactionId", static: false, private: false, access: { has: obj => "gatewayTransactionId" in obj, get: obj => obj.gatewayTransactionId, set: (obj, value) => { obj.gatewayTransactionId = value; } }, metadata: _metadata }, _gatewayTransactionId_initializers, _gatewayTransactionId_extraInitializers);
        __esDecorate(null, null, _refundNotes_decorators, { kind: "field", name: "refundNotes", static: false, private: false, access: { has: obj => "refundNotes" in obj, get: obj => obj.refundNotes, set: (obj, value) => { obj.refundNotes = value; } }, metadata: _metadata }, _refundNotes_initializers, _refundNotes_extraInitializers);
        __esDecorate(null, null, _processedDate_decorators, { kind: "field", name: "processedDate", static: false, private: false, access: { has: obj => "processedDate" in obj, get: obj => obj.processedDate, set: (obj, value) => { obj.processedDate = value; } }, metadata: _metadata }, _processedDate_initializers, _processedDate_extraInitializers);
        __esDecorate(null, null, _processedBy_decorators, { kind: "field", name: "processedBy", static: false, private: false, access: { has: obj => "processedBy" in obj, get: obj => obj.processedBy, set: (obj, value) => { obj.processedBy = value; } }, metadata: _metadata }, _processedBy_initializers, _processedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _returnRequest_decorators, { kind: "field", name: "returnRequest", static: false, private: false, access: { has: obj => "returnRequest" in obj, get: obj => obj.returnRequest, set: (obj, value) => { obj.returnRequest = value; } }, metadata: _metadata }, _returnRequest_initializers, _returnRequest_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Refund = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Refund = _classThis;
})();
exports.Refund = Refund;
// ============================================================================
// UTILITY FUNCTIONS - RETURN AUTHORIZATION
// ============================================================================
/**
 * Generate unique RMA number with prefix and sequence
 *
 * @param prefix - RMA number prefix (e.g., 'RMA', 'RTN')
 * @param sequence - Sequence number
 * @param length - Total length of numeric portion
 * @returns Formatted RMA number
 *
 * @example
 * generateRMANumber('RMA', 12345, 8) // Returns: 'RMA00012345'
 */
function generateRMANumber(prefix = 'RMA', sequence, length = 8) {
    try {
        const paddedSequence = sequence.toString().padStart(length, '0');
        return `${prefix}${paddedSequence}`;
    }
    catch (error) {
        throw new Error(`Failed to generate RMA number: ${error.message}`);
    }
}
/**
 * Create return request from customer
 *
 * @param returnData - Return request data
 * @param userId - User ID creating the request
 * @returns Created return request
 *
 * @example
 * const returnRequest = await createReturnRequest(returnDto, 'user-123');
 */
async function createReturnRequest(returnData, userId) {
    try {
        const rmaNumber = await generateNextRMANumber();
        const returnRequest = await ReturnRequest.create({
            rmaNumber,
            orderId: returnData.orderId,
            customerId: await getCustomerIdFromOrder(returnData.orderId),
            rmaType: returnData.rmaType,
            returnStatus: ReturnStatus.REQUESTED,
            authorizationStatus: ReturnAuthStatus.PENDING,
            requestDate: new Date(),
            customerComments: returnData.customerComments,
            preferredRefundMethod: returnData.preferredRefundMethod,
            createdBy: userId,
        });
        // Create return lines
        for (const lineItem of returnData.lineItems) {
            await ReturnLine.create({
                returnId: returnRequest.returnId,
                orderLineId: lineItem.orderLineId,
                itemId: lineItem.itemId,
                itemSku: lineItem.itemSku,
                itemDescription: lineItem.itemDescription,
                quantityOrdered: lineItem.quantityOrdered,
                quantityReturned: lineItem.quantityReturned,
                unitPrice: lineItem.unitPrice,
                returnReasonCode: lineItem.returnReasonCode,
                reasonDescription: lineItem.reasonDescription,
                serialNumbers: lineItem.serialNumbers,
                lotNumbers: lineItem.lotNumbers,
                images: lineItem.images,
            });
        }
        return returnRequest;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create return request: ${error.message}`);
    }
}
/**
 * Authorize return request (approve or reject)
 *
 * @param returnId - Return request ID
 * @param authData - Authorization data
 * @returns Updated return request
 *
 * @example
 * const authorized = await authorizeReturnRequest('ret-123', authDto);
 */
async function authorizeReturnRequest(returnId, authData) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId);
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        const updates = {
            authorizationStatus: authData.authorizationStatus,
            authorizationDate: new Date(),
            authorizedBy: authData.authorizedBy,
            authorizationNotes: authData.authorizationNotes,
            updatedBy: authData.authorizedBy,
        };
        if (authData.authorizationStatus === ReturnAuthStatus.APPROVED) {
            updates.returnStatus = ReturnStatus.AUTHORIZED;
            if (authData.expirationDays) {
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + authData.expirationDays);
                updates.expirationDate = expirationDate;
            }
            if (authData.restockingFeePercent !== undefined) {
                updates.restockingFeePercent = authData.restockingFeePercent;
            }
        }
        else if (authData.authorizationStatus === ReturnAuthStatus.REJECTED) {
            updates.returnStatus = ReturnStatus.REJECTED;
        }
        await returnRequest.update(updates);
        return returnRequest;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to authorize return: ${error.message}`);
    }
}
/**
 * Validate return eligibility based on return window and order status
 *
 * @param orderId - Order ID
 * @param returnWindowDays - Return window in days
 * @returns Eligibility result
 *
 * @example
 * const eligible = await validateReturnEligibility('ord-123', 30);
 */
async function validateReturnEligibility(orderId, returnWindowDays = 30) {
    try {
        const reasons = [];
        const order = await getOrderById(orderId);
        if (!order) {
            return { isEligible: false, reasons: ['Order not found'] };
        }
        // Check if order is in a returnable status
        const returnableStatuses = ['COMPLETED', 'DELIVERED', 'SHIPPED'];
        if (!returnableStatuses.includes(order.orderStatus)) {
            reasons.push(`Order status ${order.orderStatus} is not eligible for returns`);
        }
        // Check return window
        const orderDate = new Date(order.orderDate);
        const daysSinceOrder = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceOrder > returnWindowDays) {
            reasons.push(`Return window of ${returnWindowDays} days has expired (${daysSinceOrder} days since order)`);
        }
        // Check if already returned
        const existingReturn = await ReturnRequest.findOne({
            where: { orderId, returnStatus: { [Op.notIn]: ['CANCELLED', 'REJECTED'] } },
        });
        if (existingReturn) {
            reasons.push('Order already has an active return request');
        }
        return {
            isEligible: reasons.length === 0,
            reasons,
        };
    }
    catch (error) {
        throw new Error(`Failed to validate return eligibility: ${error.message}`);
    }
}
/**
 * Check return reason code validity and auto-approve rules
 *
 * @param reasonCode - Return reason code
 * @param orderAge - Order age in days
 * @returns Validation result with auto-approval flag
 *
 * @example
 * const result = await validateReturnReason(ReturnReasonCode.DEFECTIVE, 5);
 */
function validateReturnReason(reasonCode, orderAge) {
    try {
        // Auto-approve rules
        const autoApproveReasons = [
            ReturnReasonCode.DEFECTIVE,
            ReturnReasonCode.DAMAGED_IN_SHIPPING,
            ReturnReasonCode.WRONG_ITEM,
            ReturnReasonCode.NOT_AS_DESCRIBED,
            ReturnReasonCode.RECALL,
        ];
        const autoApprove = autoApproveReasons.includes(reasonCode) && orderAge <= 30;
        // Reasons that always require approval
        const requiresApprovalReasons = [
            ReturnReasonCode.CUSTOMER_REMORSE,
            ReturnReasonCode.FOUND_BETTER_PRICE,
        ];
        const requiresApproval = requiresApprovalReasons.includes(reasonCode) || orderAge > 60;
        let notes = '';
        if (autoApprove) {
            notes = 'Eligible for automatic approval due to product issue';
        }
        else if (requiresApproval) {
            notes = 'Requires manual approval review';
        }
        return {
            isValid: true,
            requiresApproval,
            autoApprove,
            notes,
        };
    }
    catch (error) {
        throw new Error(`Failed to validate return reason: ${error.message}`);
    }
}
/**
 * Calculate restocking fee based on return reason and condition
 *
 * @param returnReasonCode - Return reason
 * @param itemCondition - Item condition
 * @param subtotal - Order subtotal
 * @param feePercent - Restocking fee percentage override
 * @returns Restocking fee amount
 *
 * @example
 * const fee = calculateRestockingFee(ReturnReasonCode.CHANGED_MIND, ItemCondition.NEW_OPENED, 100);
 */
function calculateRestockingFee(returnReasonCode, itemCondition, subtotal, feePercent) {
    try {
        // No restocking fee for defective/damaged items
        const noFeeReasons = [
            ReturnReasonCode.DEFECTIVE,
            ReturnReasonCode.DAMAGED_IN_SHIPPING,
            ReturnReasonCode.WRONG_ITEM,
            ReturnReasonCode.NOT_AS_DESCRIBED,
            ReturnReasonCode.WARRANTY_CLAIM,
            ReturnReasonCode.RECALL,
        ];
        if (noFeeReasons.includes(returnReasonCode)) {
            return 0;
        }
        // Determine fee percentage if not provided
        let feePercentage = feePercent;
        if (feePercentage === undefined) {
            if (itemCondition === ItemCondition.NEW_UNOPENED) {
                feePercentage = 0;
            }
            else if (itemCondition === ItemCondition.NEW_OPENED) {
                feePercentage = 10;
            }
            else if (itemCondition === ItemCondition.LIKE_NEW) {
                feePercentage = 15;
            }
            else {
                feePercentage = 25;
            }
        }
        return Number(((subtotal * feePercentage) / 100).toFixed(2));
    }
    catch (error) {
        throw new Error(`Failed to calculate restocking fee: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - RMA GENERATION & SHIPPING
// ============================================================================
/**
 * Generate return shipping label for authorized return
 *
 * @param returnId - Return request ID
 * @param carrier - Shipping carrier
 * @param serviceLevel - Service level
 * @returns Shipping label details
 *
 * @example
 * const label = await generateReturnShippingLabel('ret-123', 'UPS', 'GROUND');
 */
async function generateReturnShippingLabel(returnId, carrier = 'UPS', serviceLevel = 'GROUND') {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId);
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        if (returnRequest.authorizationStatus !== ReturnAuthStatus.APPROVED) {
            throw new common_1.BadRequestException('Return must be authorized before generating shipping label');
        }
        // Call shipping API to generate label
        const labelData = await callShippingAPI({
            carrier,
            serviceLevel,
            fromAddress: returnRequest.returnShippingAddress,
            toAddress: await getWarehouseReturnAddress(),
            packageDetails: await getReturnPackageDetails(returnId),
            returnLabel: true,
        });
        await returnRequest.update({
            shippingLabelUrl: labelData.labelUrl,
            trackingNumber: labelData.trackingNumber,
            carrier: labelData.carrier,
            returnStatus: ReturnStatus.LABEL_GENERATED,
        });
        return {
            labelUrl: labelData.labelUrl,
            trackingNumber: labelData.trackingNumber,
            carrier: labelData.carrier,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to generate shipping label: ${error.message}`);
    }
}
/**
 * Update return tracking status from carrier webhook
 *
 * @param trackingNumber - Tracking number
 * @param status - Tracking status
 * @param location - Current location
 * @returns Updated return request
 *
 * @example
 * await updateReturnTracking('1Z999AA10123456784', 'IN_TRANSIT', 'Memphis, TN');
 */
async function updateReturnTracking(trackingNumber, status, location) {
    try {
        const returnRequest = await ReturnRequest.findOne({
            where: { trackingNumber },
        });
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found for tracking number');
        }
        let returnStatus = returnRequest.returnStatus;
        if (status === 'IN_TRANSIT') {
            returnStatus = ReturnStatus.IN_TRANSIT;
        }
        else if (status === 'DELIVERED') {
            returnStatus = ReturnStatus.RECEIVED;
            await returnRequest.update({
                receivedDate: new Date(),
            });
        }
        await returnRequest.update({ returnStatus });
        return returnRequest;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update return tracking: ${error.message}`);
    }
}
/**
 * Record return receipt at warehouse
 *
 * @param returnId - Return request ID
 * @param receivedBy - User ID receiving the return
 * @param notes - Receipt notes
 * @returns Updated return request
 *
 * @example
 * await recordReturnReceipt('ret-123', 'user-456', 'All items received');
 */
async function recordReturnReceipt(returnId, receivedBy, notes) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId);
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        await returnRequest.update({
            returnStatus: ReturnStatus.RECEIVED,
            receivedDate: new Date(),
            receivedBy,
            updatedBy: receivedBy,
        });
        // Update return lines with received quantities
        const lines = await ReturnLine.findAll({ where: { returnId } });
        for (const line of lines) {
            await line.update({
                quantityReceived: line.quantityReturned,
            });
        }
        return returnRequest;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to record return receipt: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - INSPECTION & QUALITY
// ============================================================================
/**
 * Perform return inspection and quality check
 *
 * @param returnId - Return request ID
 * @param inspectionData - Inspection data
 * @returns Inspection result
 *
 * @example
 * const result = await performReturnInspection('ret-123', inspectionDto);
 */
async function performReturnInspection(returnId, inspectionData) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId, {
            include: [ReturnLine],
        });
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        let totalPassed = 0;
        let totalFailed = 0;
        const lineInspections = [];
        // Process each line inspection
        for (const lineInsp of inspectionData.lineInspections) {
            const returnLine = await ReturnLine.findByPk(lineInsp.returnLineId);
            if (!returnLine)
                continue;
            await returnLine.update({
                quantityPassed: lineInsp.quantityPassed,
                quantityFailed: lineInsp.quantityFailed,
                itemCondition: lineInsp.condition,
                restockingDisposition: lineInsp.disposition,
                defects: lineInsp.defects,
                inspectionNotes: lineInsp.notes,
            });
            totalPassed += lineInsp.quantityPassed;
            totalFailed += lineInsp.quantityFailed;
            lineInspections.push({
                returnLineId: lineInsp.returnLineId,
                quantityInspected: lineInsp.quantityPassed + lineInsp.quantityFailed,
                quantityPassed: lineInsp.quantityPassed,
                quantityFailed: lineInsp.quantityFailed,
                condition: lineInsp.condition,
                defects: lineInsp.defects || [],
                notes: lineInsp.notes || '',
                disposition: lineInsp.disposition,
            });
        }
        const inspectionResult = {
            inspectedBy: inspectionData.inspectedBy,
            inspectionDate: new Date(),
            itemsPassed: totalPassed,
            itemsFailed: totalFailed,
            overallStatus: totalFailed === 0 ? 'PASSED' : totalPassed === 0 ? 'FAILED' : 'PARTIAL',
            lineInspections,
            photos: inspectionData.photos || [],
            notes: inspectionData.inspectionNotes || '',
        };
        await returnRequest.update({
            inspectionResult,
            returnStatus: inspectionResult.overallStatus === 'PASSED'
                ? ReturnStatus.INSPECTION_PASSED
                : inspectionResult.overallStatus === 'FAILED'
                    ? ReturnStatus.INSPECTION_FAILED
                    : ReturnStatus.INSPECTING,
            updatedBy: inspectionData.inspectedBy,
        });
        return inspectionResult;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to perform inspection: ${error.message}`);
    }
}
/**
 * Validate item condition and determine disposition
 *
 * @param condition - Item condition
 * @param returnReason - Return reason code
 * @returns Recommended disposition
 *
 * @example
 * const disposition = determineRestockingDisposition(ItemCondition.LIKE_NEW, ReturnReasonCode.CHANGED_MIND);
 */
function determineRestockingDisposition(condition, returnReason) {
    try {
        if (condition === ItemCondition.DEFECTIVE) {
            return RestockingDisposition.RETURN_TO_VENDOR;
        }
        if (condition === ItemCondition.DAMAGED || condition === ItemCondition.NOT_RESALEABLE) {
            return RestockingDisposition.SALVAGE;
        }
        if (condition === ItemCondition.NEW_UNOPENED || condition === ItemCondition.LIKE_NEW) {
            return RestockingDisposition.RETURN_TO_STOCK;
        }
        if (condition === ItemCondition.NEW_OPENED || condition === ItemCondition.GOOD) {
            if (returnReason === ReturnReasonCode.DEFECTIVE) {
                return RestockingDisposition.REFURBISH;
            }
            return RestockingDisposition.RETURN_TO_STOCK;
        }
        return RestockingDisposition.QUARANTINE;
    }
    catch (error) {
        throw new Error(`Failed to determine disposition: ${error.message}`);
    }
}
/**
 * Quality check with photo verification
 *
 * @param returnLineId - Return line ID
 * @param photos - Array of photo URLs
 * @param defects - List of defects found
 * @returns Quality check result
 *
 * @example
 * const qc = await performQualityCheck('line-123', ['url1', 'url2'], ['scratch on screen']);
 */
async function performQualityCheck(returnLineId, photos, defects) {
    try {
        const returnLine = await ReturnLine.findByPk(returnLineId);
        if (!returnLine) {
            throw new common_1.NotFoundException('Return line not found');
        }
        let condition;
        let passed;
        let notes;
        if (defects.length === 0) {
            condition = ItemCondition.LIKE_NEW;
            passed = true;
            notes = 'No defects found, item in excellent condition';
        }
        else if (defects.length <= 2) {
            condition = ItemCondition.GOOD;
            passed = true;
            notes = `Minor defects found: ${defects.join(', ')}`;
        }
        else {
            condition = ItemCondition.DAMAGED;
            passed = false;
            notes = `Multiple defects found: ${defects.join(', ')}`;
        }
        await returnLine.update({
            itemCondition: condition,
            defects,
            images: photos,
            inspectionNotes: notes,
        });
        return { passed, condition, notes };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to perform quality check: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - RESTOCKING
// ============================================================================
/**
 * Process restocking for approved returns
 *
 * @param returnId - Return request ID
 * @param warehouseId - Warehouse ID
 * @param userId - User performing restocking
 * @returns Restocking operations
 *
 * @example
 * const operations = await processRestocking('ret-123', 'wh-001', 'user-789');
 */
async function processRestocking(returnId, warehouseId, userId) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId, {
            include: [ReturnLine],
        });
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        if (returnRequest.returnStatus !== ReturnStatus.INSPECTION_PASSED) {
            throw new common_1.BadRequestException('Return must pass inspection before restocking');
        }
        const operations = [];
        for (const line of returnRequest.lines) {
            if (line.restockingDisposition === RestockingDisposition.RETURN_TO_STOCK && line.quantityPassed > 0) {
                const operation = {
                    warehouseId,
                    locationId: await getRestockingLocation(warehouseId, line.itemId),
                    itemId: line.itemId,
                    quantity: line.quantityPassed,
                    condition: line.itemCondition,
                    disposition: line.restockingDisposition,
                    restockedBy: userId,
                    restockedAt: new Date(),
                    serialNumbers: line.serialNumbers,
                    lotNumbers: line.lotNumbers,
                };
                // Update inventory
                await updateInventoryQuantity(warehouseId, line.itemId, line.quantityPassed, 'ADD', 'RETURN_RESTOCKING');
                operations.push(operation);
            }
        }
        await returnRequest.update({
            returnStatus: ReturnStatus.RESTOCKED,
            updatedBy: userId,
        });
        return operations;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process restocking: ${error.message}`);
    }
}
/**
 * Create return-to-vendor (RTV) request for defective items
 *
 * @param returnId - Return request ID
 * @param vendorId - Vendor ID
 * @param userId - User creating RTV
 * @returns RTV request
 *
 * @example
 * const rtv = await createReturnToVendor('ret-123', 'vendor-456', 'user-789');
 */
async function createReturnToVendor(returnId, vendorId, userId) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId, {
            include: [ReturnLine],
        });
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        const rtvLines = returnRequest.lines.filter((line) => line.restockingDisposition === RestockingDisposition.RETURN_TO_VENDOR);
        if (rtvLines.length === 0) {
            throw new common_1.BadRequestException('No items eligible for return to vendor');
        }
        const rtvRequest = {
            rtvNumber: await generateNextRTVNumber(),
            vendorId,
            returnId,
            lines: rtvLines.map((line) => ({
                itemId: line.itemId,
                quantity: line.quantityFailed,
                reason: line.returnReasonCode,
                defects: line.defects,
            })),
            createdBy: userId,
            createdAt: new Date(),
        };
        // Create RTV in system
        // await createVendorReturnRequest(rtvRequest);
        return rtvRequest;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create RTV: ${error.message}`);
    }
}
/**
 * Track serial numbers through return process
 *
 * @param returnLineId - Return line ID
 * @param serialNumbers - Array of serial numbers
 * @returns Serial tracking result
 *
 * @example
 * await trackReturnSerialNumbers('line-123', ['SN001', 'SN002']);
 */
async function trackReturnSerialNumbers(returnLineId, serialNumbers) {
    try {
        const returnLine = await ReturnLine.findByPk(returnLineId);
        if (!returnLine) {
            throw new common_1.NotFoundException('Return line not found');
        }
        const duplicates = [];
        const invalid = [];
        const tracked = [];
        for (const sn of serialNumbers) {
            // Check if serial number exists in original order
            const isValid = await validateSerialNumber(returnLine.orderLineId, sn);
            if (!isValid) {
                invalid.push(sn);
                continue;
            }
            // Check if already returned
            const alreadyReturned = await checkSerialAlreadyReturned(sn);
            if (alreadyReturned) {
                duplicates.push(sn);
                continue;
            }
            tracked.push(sn);
        }
        await returnLine.update({
            serialNumbers: tracked,
        });
        return {
            tracked: tracked.length,
            duplicates,
            invalid,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to track serial numbers: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - REFUND PROCESSING
// ============================================================================
/**
 * Calculate refund amounts with fees and taxes
 *
 * @param returnId - Return request ID
 * @param includeShipping - Include shipping refund
 * @returns Refund calculation
 *
 * @example
 * const calculation = await calculateRefundAmount('ret-123', true);
 */
async function calculateRefundAmount(returnId, includeShipping = false) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId, {
            include: [ReturnLine],
        });
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        const order = await getOrderById(returnRequest.orderId);
        if (!order) {
            throw new common_1.NotFoundException('Original order not found');
        }
        // Calculate subtotal from passed items
        let subtotal = 0;
        for (const line of returnRequest.lines) {
            subtotal += line.quantityPassed * line.unitPrice;
        }
        // Calculate proportional tax
        const taxRate = order.taxAmount / order.subtotal;
        const taxRefund = Number((subtotal * taxRate).toFixed(2));
        // Calculate shipping refund
        const shippingRefund = includeShipping ? order.shippingAmount : 0;
        // Calculate restocking fee
        const restockingFee = calculateRestockingFee(returnRequest.lines[0]?.returnReasonCode, returnRequest.lines[0]?.itemCondition, subtotal, returnRequest.restockingFeePercent);
        const totalRefund = subtotal + taxRefund + shippingRefund - restockingFee;
        const calculation = {
            subtotal,
            taxRefund,
            shippingRefund,
            restockingFee,
            adjustments: 0,
            totalRefund: Number(totalRefund.toFixed(2)),
            originalPaymentAmount: order.totalAmount,
            breakdownByPaymentMethod: await getPaymentMethodBreakdown(order.orderId, totalRefund),
        };
        await returnRequest.update({
            refundCalculation: calculation,
            restockingFeeAmount: restockingFee,
        });
        return calculation;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate refund: ${error.message}`);
    }
}
/**
 * Process refund to original payment method
 *
 * @param returnId - Return request ID
 * @param refundData - Refund processing data
 * @returns Created refund
 *
 * @example
 * const refund = await processRefund('ret-123', refundDto);
 */
async function processRefund(returnId, refundData) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId);
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        if (!returnRequest.refundCalculation) {
            throw new common_1.BadRequestException('Refund must be calculated before processing');
        }
        const refundNumber = await generateNextRefundNumber();
        const calculation = returnRequest.refundCalculation;
        const refundAmount = refundData.refundAmountOverride || calculation.totalRefund;
        const refund = await Refund.create({
            refundNumber,
            returnId,
            orderId: returnRequest.orderId,
            refundStatus: RefundStatus.PENDING,
            refundMethod: refundData.refundMethod,
            refundAmount: calculation.subtotal,
            taxRefund: calculation.taxRefund,
            shippingRefund: calculation.shippingRefund,
            restockingFee: calculation.restockingFee,
            adjustments: refundData.refundAmountOverride
                ? refundData.refundAmountOverride - calculation.totalRefund
                : 0,
            totalRefund: refundAmount,
            refundNotes: refundData.refundNotes,
            storeCreditAccountId: refundData.storeCreditAccountId,
            createdBy: refundData.processedBy,
        });
        // Process based on refund method
        if (refundData.refundMethod === RefundMethod.ORIGINAL_PAYMENT) {
            await processOriginalPaymentRefund(refund);
        }
        else if (refundData.refundMethod === RefundMethod.STORE_CREDIT) {
            await processStoreCreditRefund(refund, refundData.storeCreditAccountId);
        }
        await returnRequest.update({
            returnStatus: ReturnStatus.COMPLETED,
        });
        return refund;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process refund: ${error.message}`);
    }
}
/**
 * Process refund to original payment method via gateway
 *
 * @param refund - Refund record
 * @returns Gateway response
 *
 * @example
 * await processOriginalPaymentRefund(refund);
 */
async function processOriginalPaymentRefund(refund) {
    try {
        // Call payment gateway API
        const gatewayResponse = await callPaymentGateway({
            action: 'refund',
            orderId: refund.orderId,
            amount: refund.totalRefund,
            reason: refund.refundNotes,
        });
        await refund.update({
            refundStatus: RefundStatus.COMPLETED,
            gatewayTransactionId: gatewayResponse.transactionId,
            processedDate: new Date(),
        });
        return gatewayResponse;
    }
    catch (error) {
        await refund.update({ refundStatus: RefundStatus.FAILED });
        throw error;
    }
}
/**
 * Process refund as store credit
 *
 * @param refund - Refund record
 * @param accountId - Store credit account ID
 * @returns Store credit result
 *
 * @example
 * await processStoreCreditRefund(refund, 'account-123');
 */
async function processStoreCreditRefund(refund, accountId) {
    try {
        const creditResult = await addStoreCredit({
            accountId,
            amount: refund.totalRefund,
            reason: `Refund for return ${refund.returnId}`,
            expirationDays: 365,
        });
        await refund.update({
            refundStatus: RefundStatus.COMPLETED,
            storeCreditAccountId: accountId,
            processedDate: new Date(),
        });
        return creditResult;
    }
    catch (error) {
        await refund.update({ refundStatus: RefundStatus.FAILED });
        throw error;
    }
}
/**
 * Process partial refund for partial returns
 *
 * @param returnId - Return request ID
 * @param lineRefunds - Line-specific refund amounts
 * @param userId - User processing refund
 * @returns Partial refund
 *
 * @example
 * const refund = await processPartialRefund('ret-123', [{lineId: 'ln-1', amount: 50}], 'user-789');
 */
async function processPartialRefund(returnId, lineRefunds, userId) {
    try {
        const returnRequest = await ReturnRequest.findByPk(returnId);
        if (!returnRequest) {
            throw new common_1.NotFoundException('Return request not found');
        }
        let totalRefund = 0;
        for (const lineRefund of lineRefunds) {
            totalRefund += lineRefund.refundAmount;
        }
        const refundNumber = await generateNextRefundNumber();
        const refund = await Refund.create({
            refundNumber,
            returnId,
            orderId: returnRequest.orderId,
            refundStatus: RefundStatus.PENDING,
            refundMethod: returnRequest.preferredRefundMethod || RefundMethod.ORIGINAL_PAYMENT,
            refundAmount: totalRefund,
            taxRefund: 0,
            shippingRefund: 0,
            restockingFee: 0,
            totalRefund,
            refundNotes: 'Partial refund',
            createdBy: userId,
        });
        await refund.update({
            refundStatus: RefundStatus.PARTIALLY_REFUNDED,
        });
        return refund;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process partial refund: ${error.message}`);
    }
}
// ============================================================================
// UTILITY FUNCTIONS - WARRANTY & ADVANCED REPLACEMENT
// ============================================================================
/**
 * Validate warranty coverage for return
 *
 * @param orderId - Order ID
 * @param itemId - Item ID
 * @param serialNumber - Serial number
 * @returns Warranty validation result
 *
 * @example
 * const warranty = await validateWarrantyCoverage('ord-123', 'item-456', 'SN001');
 */
async function validateWarrantyCoverage(orderId, itemId, serialNumber) {
    try {
        const order = await getOrderById(orderId);
        if (!order) {
            return {
                isValid: false,
                warrantyType: 'NONE',
                validationErrors: ['Order not found'],
            };
        }
        // Check for warranty records
        const warranty = await findWarrantyRecord(itemId, serialNumber);
        if (!warranty) {
            return {
                isValid: false,
                warrantyType: 'NONE',
                validationErrors: ['No warranty found for this item'],
            };
        }
        const now = new Date();
        const isExpired = warranty.warrantyEndDate < now;
        if (isExpired) {
            return {
                isValid: false,
                warrantyId: warranty.warrantyId,
                warrantyType: warranty.warrantyType,
                warrantyStartDate: warranty.warrantyStartDate,
                warrantyEndDate: warranty.warrantyEndDate,
                daysRemaining: 0,
                validationErrors: [`Warranty expired on ${warranty.warrantyEndDate.toISOString()}`],
            };
        }
        const daysRemaining = Math.floor((warranty.warrantyEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
            isValid: true,
            warrantyId: warranty.warrantyId,
            warrantyType: warranty.warrantyType,
            warrantyStartDate: warranty.warrantyStartDate,
            warrantyEndDate: warranty.warrantyEndDate,
            daysRemaining,
            coverageDetails: warranty.coverageDetails,
        };
    }
    catch (error) {
        throw new Error(`Failed to validate warranty: ${error.message}`);
    }
}
/**
 * Create advanced replacement order
 *
 * @param request - Advanced replacement request
 * @param userId - User creating replacement
 * @returns Replacement order and return
 *
 * @example
 * const replacement = await createAdvancedReplacement(requestDto, 'user-123');
 */
async function createAdvancedReplacement(request, userId) {
    try {
        // Validate warranty
        const warranty = await validateWarrantyCoverage(request.originalOrderId, request.defectiveItemId, request.defectiveSerialNumber);
        if (!warranty.isValid) {
            throw new common_1.BadRequestException(`Warranty validation failed: ${warranty.validationErrors.join(', ')}`);
        }
        // Create replacement order
        const replacementOrder = await createReplacementOrder({
            customerId: await getCustomerIdFromOrder(request.originalOrderId),
            itemId: request.replacementItemId,
            quantity: 1,
            shippingAddress: request.shippingAddress,
            shippingMethod: request.shippingMethod,
            orderType: 'WARRANTY',
            createdBy: userId,
        });
        // Create return request for defective item
        const returnRequest = await createReturnRequest({
            orderId: request.originalOrderId,
            rmaType: RMAType.ADVANCED_REPLACEMENT,
            lineItems: [
                {
                    orderLineId: await getOrderLineId(request.originalOrderId, request.defectiveItemId),
                    itemId: request.defectiveItemId,
                    itemSku: await getItemSku(request.defectiveItemId),
                    itemDescription: await getItemDescription(request.defectiveItemId),
                    quantityOrdered: 1,
                    quantityReturned: 1,
                    unitPrice: 0,
                    returnReasonCode: ReturnReasonCode.DEFECTIVE,
                    serialNumbers: request.defectiveSerialNumber ? [request.defectiveSerialNumber] : [],
                },
            ],
        }, userId);
        // Auto-authorize the return
        await authorizeReturnRequest(returnRequest.returnId, {
            authorizationStatus: ReturnAuthStatus.APPROVED,
            authorizedBy: userId,
            authorizationNotes: 'Auto-approved for advanced replacement',
            expirationDays: request.returnDeadlineDays,
            restockingFeePercent: 0,
        });
        // Place credit card hold if configured
        let holdAmount;
        if (request.creditCardHold) {
            holdAmount = request.creditCardHold.amount;
            // await placeCreditCardHold(request.creditCardHold);
        }
        return {
            replacementOrderId: replacementOrder.orderId,
            returnId: returnRequest.returnId,
            holdAmount,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create advanced replacement: ${error.message}`);
    }
}
// ============================================================================
// HELPER FUNCTIONS (Mocked for demonstration)
// ============================================================================
async function generateNextRMANumber() {
    return generateRMANumber('RMA', Date.now() % 100000000);
}
async function generateNextRefundNumber() {
    return `REF${Date.now()}`;
}
async function generateNextRTVNumber() {
    return `RTV${Date.now()}`;
}
async function getCustomerIdFromOrder(orderId) {
    return 'customer-123';
}
async function getOrderById(orderId) {
    return {
        orderId,
        orderStatus: 'COMPLETED',
        orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        subtotal: 100,
        taxAmount: 10,
        shippingAmount: 15,
        totalAmount: 125,
    };
}
async function callShippingAPI(data) {
    return {
        labelUrl: 'https://example.com/label.pdf',
        trackingNumber: '1Z999AA10123456784',
        carrier: data.carrier,
    };
}
async function getWarehouseReturnAddress() {
    return { address: '123 Warehouse St', city: 'Memphis', state: 'TN', zip: '38103' };
}
async function getReturnPackageDetails(returnId) {
    return { weight: 2, dimensions: { length: 12, width: 10, height: 8 } };
}
async function getRestockingLocation(warehouseId, itemId) {
    return 'LOC-A-001';
}
async function updateInventoryQuantity(warehouseId, itemId, quantity, operation, reason) {
    // Mock inventory update
}
async function validateSerialNumber(orderLineId, serialNumber) {
    return true;
}
async function checkSerialAlreadyReturned(serialNumber) {
    return false;
}
async function getPaymentMethodBreakdown(orderId, amount) {
    return [{ paymentMethod: 'CREDIT_CARD', paymentId: 'pay-123', refundAmount: amount }];
}
async function callPaymentGateway(data) {
    return { transactionId: 'txn-' + Date.now(), status: 'SUCCESS' };
}
async function addStoreCredit(data) {
    return { creditId: 'credit-' + Date.now(), amount: data.amount };
}
async function findWarrantyRecord(itemId, serialNumber) {
    return {
        warrantyId: 'war-123',
        warrantyType: 'MANUFACTURER',
        warrantyStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        warrantyEndDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
        coverageDetails: { type: 'Full replacement' },
    };
}
async function createReplacementOrder(data) {
    return { orderId: 'ord-replacement-' + Date.now() };
}
async function getOrderLineId(orderId, itemId) {
    return 'line-123';
}
async function getItemSku(itemId) {
    return 'SKU-' + itemId;
}
async function getItemDescription(itemId) {
    return 'Product Description for ' + itemId;
}
// Op helper for Sequelize queries
const Op = {
    notIn: Symbol('notIn'),
};
//# sourceMappingURL=order-returns-refunds-kit.js.map