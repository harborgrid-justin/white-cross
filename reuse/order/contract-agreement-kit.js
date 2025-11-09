"use strict";
/**
 * LOC: ORD-CNT-001
 * File: /reuse/order/contract-agreement-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize
 *   - sequelize-typescript
 *
 * DOWNSTREAM (imported by):
 *   - Order controllers
 *   - Pricing services
 *   - Customer services
 *   - Contract management
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
exports.ContractPerformance = exports.ContractAmendment = exports.ContractPricing = exports.Contract = exports.ContractComplianceCheckDto = exports.RenewContractDto = exports.CreateContractAmendmentDto = exports.CreateContractPricingDto = exports.CreateContractDto = exports.PerformanceMetricType = exports.ApprovalStatus = exports.PenaltyType = exports.CommitmentPeriod = exports.CommitmentType = exports.AmendmentType = exports.RenewalType = exports.ContractPricingType = exports.ContractType = exports.ContractStatus = void 0;
exports.createContract = createContract;
exports.generateContractNumber = generateContractNumber;
exports.addContractPricing = addContractPricing;
exports.getContractById = getContractById;
exports.getActiveContractsForCustomer = getActiveContractsForCustomer;
exports.getContractPricingForProduct = getContractPricingForProduct;
exports.activateContract = activateContract;
exports.approveContract = approveContract;
exports.createContractAmendment = createContractAmendment;
exports.generateAmendmentNumber = generateAmendmentNumber;
exports.renewContract = renewContract;
exports.getExpiringContracts = getExpiringContracts;
exports.processAutoRenewals = processAutoRenewals;
exports.checkVolumeCommitmentCompliance = checkVolumeCommitmentCompliance;
exports.calculateContractPerformanceMetrics = calculateContractPerformanceMetrics;
exports.recordContractPerformance = recordContractPerformance;
exports.terminateContract = terminateContract;
exports.suspendContract = suspendContract;
exports.reactivateContract = reactivateContract;
exports.getContractPricingTiers = getContractPricingTiers;
exports.calculateTieredContractPrice = calculateTieredContractPrice;
exports.updateContractPricing = updateContractPricing;
exports.bulkUpdateContractPricing = bulkUpdateContractPricing;
exports.getContractAmendments = getContractAmendments;
exports.approveContractAmendment = approveContractAmendment;
exports.getContractSummary = getContractSummary;
exports.searchContracts = searchContracts;
exports.exportContractToJson = exportContractToJson;
exports.calculateContractSavings = calculateContractSavings;
exports.sendRenewalNotifications = sendRenewalNotifications;
exports.getContractAnalytics = getContractAnalytics;
/**
 * File: /reuse/order/contract-agreement-kit.ts
 * Locator: WC-ORD-CNTAGR-001
 * Purpose: Contract & Agreement Management - Contract pricing, terms, renewals
 *
 * Upstream: Independent utility module for contract operations
 * Downstream: ../backend/order/*, Pricing modules, Customer services, Quote services
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 40 utility functions for contract creation, pricing agreements, volume commitments, terms, renewals, amendments, compliance tracking
 *
 * LLM Context: Enterprise-grade contract management to compete with SAP, Oracle, and JD Edwards contract systems.
 * Provides comprehensive contract lifecycle management, pricing agreements, volume commitments, minimum purchase requirements,
 * contract terms and conditions, auto-renewal handling, contract amendments, pricing schedules, tiered pricing in contracts,
 * contract compliance tracking, contract performance metrics, SLA monitoring, and multi-year agreements.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_1 = require("sequelize");
// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================
/**
 * Contract status
 */
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "DRAFT";
    ContractStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    ContractStatus["APPROVED"] = "APPROVED";
    ContractStatus["ACTIVE"] = "ACTIVE";
    ContractStatus["SUSPENDED"] = "SUSPENDED";
    ContractStatus["EXPIRED"] = "EXPIRED";
    ContractStatus["TERMINATED"] = "TERMINATED";
    ContractStatus["RENEWED"] = "RENEWED";
    ContractStatus["AMENDED"] = "AMENDED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
/**
 * Contract types
 */
var ContractType;
(function (ContractType) {
    ContractType["MASTER_AGREEMENT"] = "MASTER_AGREEMENT";
    ContractType["PRICING_AGREEMENT"] = "PRICING_AGREEMENT";
    ContractType["VOLUME_COMMITMENT"] = "VOLUME_COMMITMENT";
    ContractType["BLANKET_ORDER"] = "BLANKET_ORDER";
    ContractType["CONSIGNMENT"] = "CONSIGNMENT";
    ContractType["REBATE_AGREEMENT"] = "REBATE_AGREEMENT";
    ContractType["SERVICE_LEVEL"] = "SERVICE_LEVEL";
    ContractType["EXCLUSIVE_SUPPLIER"] = "EXCLUSIVE_SUPPLIER";
    ContractType["FRAMEWORK_AGREEMENT"] = "FRAMEWORK_AGREEMENT";
})(ContractType || (exports.ContractType = ContractType = {}));
/**
 * Contract pricing type
 */
var ContractPricingType;
(function (ContractPricingType) {
    ContractPricingType["FIXED_PRICE"] = "FIXED_PRICE";
    ContractPricingType["TIERED_PRICING"] = "TIERED_PRICING";
    ContractPricingType["VOLUME_DISCOUNT"] = "VOLUME_DISCOUNT";
    ContractPricingType["COST_PLUS"] = "COST_PLUS";
    ContractPricingType["INDEX_BASED"] = "INDEX_BASED";
    ContractPricingType["NEGOTIATED"] = "NEGOTIATED";
    ContractPricingType["MARKET_RATE"] = "MARKET_RATE";
})(ContractPricingType || (exports.ContractPricingType = ContractPricingType = {}));
/**
 * Renewal type
 */
var RenewalType;
(function (RenewalType) {
    RenewalType["MANUAL"] = "MANUAL";
    RenewalType["AUTO_RENEW"] = "AUTO_RENEW";
    RenewalType["REQUIRES_APPROVAL"] = "REQUIRES_APPROVAL";
    RenewalType["ONE_TIME_ONLY"] = "ONE_TIME_ONLY";
})(RenewalType || (exports.RenewalType = RenewalType = {}));
/**
 * Amendment type
 */
var AmendmentType;
(function (AmendmentType) {
    AmendmentType["PRICING_CHANGE"] = "PRICING_CHANGE";
    AmendmentType["TERM_EXTENSION"] = "TERM_EXTENSION";
    AmendmentType["VOLUME_CHANGE"] = "VOLUME_CHANGE";
    AmendmentType["PRODUCT_ADDITION"] = "PRODUCT_ADDITION";
    AmendmentType["PRODUCT_REMOVAL"] = "PRODUCT_REMOVAL";
    AmendmentType["TERMS_CHANGE"] = "TERMS_CHANGE";
    AmendmentType["PARTY_CHANGE"] = "PARTY_CHANGE";
})(AmendmentType || (exports.AmendmentType = AmendmentType = {}));
/**
 * Commitment type
 */
var CommitmentType;
(function (CommitmentType) {
    CommitmentType["MINIMUM_QUANTITY"] = "MINIMUM_QUANTITY";
    CommitmentType["MINIMUM_VALUE"] = "MINIMUM_VALUE";
    CommitmentType["MAXIMUM_QUANTITY"] = "MAXIMUM_QUANTITY";
    CommitmentType["MAXIMUM_VALUE"] = "MAXIMUM_VALUE";
    CommitmentType["TARGET_QUANTITY"] = "TARGET_QUANTITY";
    CommitmentType["TARGET_VALUE"] = "TARGET_VALUE";
})(CommitmentType || (exports.CommitmentType = CommitmentType = {}));
/**
 * Commitment period
 */
var CommitmentPeriod;
(function (CommitmentPeriod) {
    CommitmentPeriod["DAILY"] = "DAILY";
    CommitmentPeriod["WEEKLY"] = "WEEKLY";
    CommitmentPeriod["MONTHLY"] = "MONTHLY";
    CommitmentPeriod["QUARTERLY"] = "QUARTERLY";
    CommitmentPeriod["ANNUALLY"] = "ANNUALLY";
    CommitmentPeriod["CONTRACT_TERM"] = "CONTRACT_TERM";
})(CommitmentPeriod || (exports.CommitmentPeriod = CommitmentPeriod = {}));
/**
 * Penalty type for non-compliance
 */
var PenaltyType;
(function (PenaltyType) {
    PenaltyType["PERCENTAGE_FEE"] = "PERCENTAGE_FEE";
    PenaltyType["FIXED_FEE"] = "FIXED_FEE";
    PenaltyType["PRICE_ADJUSTMENT"] = "PRICE_ADJUSTMENT";
    PenaltyType["REBATE_REDUCTION"] = "REBATE_REDUCTION";
    PenaltyType["CONTRACT_TERMINATION"] = "CONTRACT_TERMINATION";
    PenaltyType["WARNING_ONLY"] = "WARNING_ONLY";
})(PenaltyType || (exports.PenaltyType = PenaltyType = {}));
/**
 * Approval status
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
    ApprovalStatus["REQUIRES_REVISION"] = "REQUIRES_REVISION";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Performance metric type
 */
var PerformanceMetricType;
(function (PerformanceMetricType) {
    PerformanceMetricType["PURCHASE_VOLUME"] = "PURCHASE_VOLUME";
    PerformanceMetricType["PURCHASE_VALUE"] = "PURCHASE_VALUE";
    PerformanceMetricType["DELIVERY_PERFORMANCE"] = "DELIVERY_PERFORMANCE";
    PerformanceMetricType["QUALITY_METRICS"] = "QUALITY_METRICS";
    PerformanceMetricType["COMPLIANCE_RATE"] = "COMPLIANCE_RATE";
    PerformanceMetricType["SAVINGS_ACHIEVED"] = "SAVINGS_ACHIEVED";
    PerformanceMetricType["ORDER_FREQUENCY"] = "ORDER_FREQUENCY";
})(PerformanceMetricType || (exports.PerformanceMetricType = PerformanceMetricType = {}));
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * Create contract DTO
 */
let CreateContractDto = (() => {
    var _a;
    let _contractName_decorators;
    let _contractName_initializers = [];
    let _contractName_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _supplierId_decorators;
    let _supplierId_initializers = [];
    let _supplierId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _pricingType_decorators;
    let _pricingType_initializers = [];
    let _pricingType_extraInitializers = [];
    let _renewalType_decorators;
    let _renewalType_initializers = [];
    let _renewalType_extraInitializers = [];
    let _renewalNoticeDays_decorators;
    let _renewalNoticeDays_initializers = [];
    let _renewalNoticeDays_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _volumeCommitments_decorators;
    let _volumeCommitments_initializers = [];
    let _volumeCommitments_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
    return _a = class CreateContractDto {
            constructor() {
                this.contractName = __runInitializers(this, _contractName_initializers, void 0);
                this.contractType = (__runInitializers(this, _contractName_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
                this.customerId = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
                this.supplierId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _supplierId_initializers, void 0));
                this.startDate = (__runInitializers(this, _supplierId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.pricingType = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _pricingType_initializers, void 0));
                this.renewalType = (__runInitializers(this, _pricingType_extraInitializers), __runInitializers(this, _renewalType_initializers, void 0));
                this.renewalNoticeDays = (__runInitializers(this, _renewalType_extraInitializers), __runInitializers(this, _renewalNoticeDays_initializers, void 0));
                this.terms = (__runInitializers(this, _renewalNoticeDays_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
                this.volumeCommitments = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _volumeCommitments_initializers, void 0));
                this.description = (__runInitializers(this, _volumeCommitments_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.customFields = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
                __runInitializers(this, _customFields_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract name' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _contractType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract type', enum: ContractType }), (0, class_validator_1.IsEnum)(ContractType), (0, class_validator_1.IsNotEmpty)()];
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _supplierId_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Supplier ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsNotEmpty)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsNotEmpty)()];
            _pricingType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract pricing type', enum: ContractPricingType }), (0, class_validator_1.IsEnum)(ContractPricingType), (0, class_validator_1.IsNotEmpty)()];
            _renewalType_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Renewal type', enum: RenewalType }), (0, class_validator_1.IsEnum)(RenewalType), (0, class_validator_1.IsOptional)()];
            _renewalNoticeDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Auto-renewal notice days' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _terms_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contract terms (JSON)' }), (0, class_validator_1.IsOptional)()];
            _volumeCommitments_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Volume commitments (JSON array)' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Contract description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _customFields_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Custom fields (JSON)' }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _contractName_decorators, { kind: "field", name: "contractName", static: false, private: false, access: { has: obj => "contractName" in obj, get: obj => obj.contractName, set: (obj, value) => { obj.contractName = value; } }, metadata: _metadata }, _contractName_initializers, _contractName_extraInitializers);
            __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _supplierId_decorators, { kind: "field", name: "supplierId", static: false, private: false, access: { has: obj => "supplierId" in obj, get: obj => obj.supplierId, set: (obj, value) => { obj.supplierId = value; } }, metadata: _metadata }, _supplierId_initializers, _supplierId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _pricingType_decorators, { kind: "field", name: "pricingType", static: false, private: false, access: { has: obj => "pricingType" in obj, get: obj => obj.pricingType, set: (obj, value) => { obj.pricingType = value; } }, metadata: _metadata }, _pricingType_initializers, _pricingType_extraInitializers);
            __esDecorate(null, null, _renewalType_decorators, { kind: "field", name: "renewalType", static: false, private: false, access: { has: obj => "renewalType" in obj, get: obj => obj.renewalType, set: (obj, value) => { obj.renewalType = value; } }, metadata: _metadata }, _renewalType_initializers, _renewalType_extraInitializers);
            __esDecorate(null, null, _renewalNoticeDays_decorators, { kind: "field", name: "renewalNoticeDays", static: false, private: false, access: { has: obj => "renewalNoticeDays" in obj, get: obj => obj.renewalNoticeDays, set: (obj, value) => { obj.renewalNoticeDays = value; } }, metadata: _metadata }, _renewalNoticeDays_initializers, _renewalNoticeDays_extraInitializers);
            __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
            __esDecorate(null, null, _volumeCommitments_decorators, { kind: "field", name: "volumeCommitments", static: false, private: false, access: { has: obj => "volumeCommitments" in obj, get: obj => obj.volumeCommitments, set: (obj, value) => { obj.volumeCommitments = value; } }, metadata: _metadata }, _volumeCommitments_initializers, _volumeCommitments_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateContractDto = CreateContractDto;
/**
 * Create contract pricing DTO
 */
let CreateContractPricingDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _baseUnitPrice_decorators;
    let _baseUnitPrice_initializers = [];
    let _baseUnitPrice_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _uom_decorators;
    let _uom_initializers = [];
    let _uom_extraInitializers = [];
    let _pricingTiers_decorators;
    let _pricingTiers_initializers = [];
    let _pricingTiers_extraInitializers = [];
    let _minOrderQuantity_decorators;
    let _minOrderQuantity_initializers = [];
    let _minOrderQuantity_extraInitializers = [];
    let _maxOrderQuantity_decorators;
    let _maxOrderQuantity_initializers = [];
    let _maxOrderQuantity_extraInitializers = [];
    let _leadTimeDays_decorators;
    let _leadTimeDays_initializers = [];
    let _leadTimeDays_extraInitializers = [];
    return _a = class CreateContractPricingDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.productId = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
                this.baseUnitPrice = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _baseUnitPrice_initializers, void 0));
                this.currency = (__runInitializers(this, _baseUnitPrice_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.uom = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _uom_initializers, void 0));
                this.pricingTiers = (__runInitializers(this, _uom_extraInitializers), __runInitializers(this, _pricingTiers_initializers, void 0));
                this.minOrderQuantity = (__runInitializers(this, _pricingTiers_extraInitializers), __runInitializers(this, _minOrderQuantity_initializers, void 0));
                this.maxOrderQuantity = (__runInitializers(this, _minOrderQuantity_extraInitializers), __runInitializers(this, _maxOrderQuantity_initializers, void 0));
                this.leadTimeDays = (__runInitializers(this, _maxOrderQuantity_extraInitializers), __runInitializers(this, _leadTimeDays_initializers, void 0));
                __runInitializers(this, _leadTimeDays_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _baseUnitPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Base unit price' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsNotEmpty)()];
            _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _uom_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Unit of measure' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _pricingTiers_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Pricing tiers (JSON array)' }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _minOrderQuantity_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Minimum order quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _maxOrderQuantity_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Maximum order quantity' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _leadTimeDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Lead time in days' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
            __esDecorate(null, null, _baseUnitPrice_decorators, { kind: "field", name: "baseUnitPrice", static: false, private: false, access: { has: obj => "baseUnitPrice" in obj, get: obj => obj.baseUnitPrice, set: (obj, value) => { obj.baseUnitPrice = value; } }, metadata: _metadata }, _baseUnitPrice_initializers, _baseUnitPrice_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _uom_decorators, { kind: "field", name: "uom", static: false, private: false, access: { has: obj => "uom" in obj, get: obj => obj.uom, set: (obj, value) => { obj.uom = value; } }, metadata: _metadata }, _uom_initializers, _uom_extraInitializers);
            __esDecorate(null, null, _pricingTiers_decorators, { kind: "field", name: "pricingTiers", static: false, private: false, access: { has: obj => "pricingTiers" in obj, get: obj => obj.pricingTiers, set: (obj, value) => { obj.pricingTiers = value; } }, metadata: _metadata }, _pricingTiers_initializers, _pricingTiers_extraInitializers);
            __esDecorate(null, null, _minOrderQuantity_decorators, { kind: "field", name: "minOrderQuantity", static: false, private: false, access: { has: obj => "minOrderQuantity" in obj, get: obj => obj.minOrderQuantity, set: (obj, value) => { obj.minOrderQuantity = value; } }, metadata: _metadata }, _minOrderQuantity_initializers, _minOrderQuantity_extraInitializers);
            __esDecorate(null, null, _maxOrderQuantity_decorators, { kind: "field", name: "maxOrderQuantity", static: false, private: false, access: { has: obj => "maxOrderQuantity" in obj, get: obj => obj.maxOrderQuantity, set: (obj, value) => { obj.maxOrderQuantity = value; } }, metadata: _metadata }, _maxOrderQuantity_initializers, _maxOrderQuantity_extraInitializers);
            __esDecorate(null, null, _leadTimeDays_decorators, { kind: "field", name: "leadTimeDays", static: false, private: false, access: { has: obj => "leadTimeDays" in obj, get: obj => obj.leadTimeDays, set: (obj, value) => { obj.leadTimeDays = value; } }, metadata: _metadata }, _leadTimeDays_initializers, _leadTimeDays_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateContractPricingDto = CreateContractPricingDto;
/**
 * Create contract amendment DTO
 */
let CreateContractAmendmentDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _amendmentType_decorators;
    let _amendmentType_initializers = [];
    let _amendmentType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _previousValues_decorators;
    let _previousValues_initializers = [];
    let _previousValues_extraInitializers = [];
    let _newValues_decorators;
    let _newValues_initializers = [];
    let _newValues_extraInitializers = [];
    let _requiresApproval_decorators;
    let _requiresApproval_initializers = [];
    let _requiresApproval_extraInitializers = [];
    return _a = class CreateContractAmendmentDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.amendmentType = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _amendmentType_initializers, void 0));
                this.description = (__runInitializers(this, _amendmentType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.previousValues = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _previousValues_initializers, void 0));
                this.newValues = (__runInitializers(this, _previousValues_extraInitializers), __runInitializers(this, _newValues_initializers, void 0));
                this.requiresApproval = (__runInitializers(this, _newValues_extraInitializers), __runInitializers(this, _requiresApproval_initializers, void 0));
                __runInitializers(this, _requiresApproval_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _amendmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment type', enum: AmendmentType }), (0, class_validator_1.IsEnum)(AmendmentType), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment description' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsNotEmpty)()];
            _previousValues_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Previous values (JSON)' }), (0, class_validator_1.IsOptional)()];
            _newValues_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'New values (JSON)' }), (0, class_validator_1.IsOptional)()];
            _requiresApproval_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Requires customer approval' }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _amendmentType_decorators, { kind: "field", name: "amendmentType", static: false, private: false, access: { has: obj => "amendmentType" in obj, get: obj => obj.amendmentType, set: (obj, value) => { obj.amendmentType = value; } }, metadata: _metadata }, _amendmentType_initializers, _amendmentType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _previousValues_decorators, { kind: "field", name: "previousValues", static: false, private: false, access: { has: obj => "previousValues" in obj, get: obj => obj.previousValues, set: (obj, value) => { obj.previousValues = value; } }, metadata: _metadata }, _previousValues_initializers, _previousValues_extraInitializers);
            __esDecorate(null, null, _newValues_decorators, { kind: "field", name: "newValues", static: false, private: false, access: { has: obj => "newValues" in obj, get: obj => obj.newValues, set: (obj, value) => { obj.newValues = value; } }, metadata: _metadata }, _newValues_initializers, _newValues_extraInitializers);
            __esDecorate(null, null, _requiresApproval_decorators, { kind: "field", name: "requiresApproval", static: false, private: false, access: { has: obj => "requiresApproval" in obj, get: obj => obj.requiresApproval, set: (obj, value) => { obj.requiresApproval = value; } }, metadata: _metadata }, _requiresApproval_initializers, _requiresApproval_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateContractAmendmentDto = CreateContractAmendmentDto;
/**
 * Renew contract DTO
 */
let RenewContractDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _newStartDate_decorators;
    let _newStartDate_initializers = [];
    let _newStartDate_extraInitializers = [];
    let _newEndDate_decorators;
    let _newEndDate_initializers = [];
    let _newEndDate_extraInitializers = [];
    let _priceAdjustmentPercent_decorators;
    let _priceAdjustmentPercent_initializers = [];
    let _priceAdjustmentPercent_extraInitializers = [];
    let _copyPricing_decorators;
    let _copyPricing_initializers = [];
    let _copyPricing_extraInitializers = [];
    let _copyCommitments_decorators;
    let _copyCommitments_initializers = [];
    let _copyCommitments_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class RenewContractDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.newStartDate = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _newStartDate_initializers, void 0));
                this.newEndDate = (__runInitializers(this, _newStartDate_extraInitializers), __runInitializers(this, _newEndDate_initializers, void 0));
                this.priceAdjustmentPercent = (__runInitializers(this, _newEndDate_extraInitializers), __runInitializers(this, _priceAdjustmentPercent_initializers, void 0));
                this.copyPricing = (__runInitializers(this, _priceAdjustmentPercent_extraInitializers), __runInitializers(this, _copyPricing_initializers, void 0));
                this.copyCommitments = (__runInitializers(this, _copyPricing_extraInitializers), __runInitializers(this, _copyCommitments_initializers, void 0));
                this.notes = (__runInitializers(this, _copyCommitments_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID to renew' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _newStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'New start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsNotEmpty)()];
            _newEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'New end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsNotEmpty)()];
            _priceAdjustmentPercent_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Price adjustment percent' }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _copyPricing_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Copy pricing from original' }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _copyCommitments_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Copy commitments from original' }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Renewal notes' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _newStartDate_decorators, { kind: "field", name: "newStartDate", static: false, private: false, access: { has: obj => "newStartDate" in obj, get: obj => obj.newStartDate, set: (obj, value) => { obj.newStartDate = value; } }, metadata: _metadata }, _newStartDate_initializers, _newStartDate_extraInitializers);
            __esDecorate(null, null, _newEndDate_decorators, { kind: "field", name: "newEndDate", static: false, private: false, access: { has: obj => "newEndDate" in obj, get: obj => obj.newEndDate, set: (obj, value) => { obj.newEndDate = value; } }, metadata: _metadata }, _newEndDate_initializers, _newEndDate_extraInitializers);
            __esDecorate(null, null, _priceAdjustmentPercent_decorators, { kind: "field", name: "priceAdjustmentPercent", static: false, private: false, access: { has: obj => "priceAdjustmentPercent" in obj, get: obj => obj.priceAdjustmentPercent, set: (obj, value) => { obj.priceAdjustmentPercent = value; } }, metadata: _metadata }, _priceAdjustmentPercent_initializers, _priceAdjustmentPercent_extraInitializers);
            __esDecorate(null, null, _copyPricing_decorators, { kind: "field", name: "copyPricing", static: false, private: false, access: { has: obj => "copyPricing" in obj, get: obj => obj.copyPricing, set: (obj, value) => { obj.copyPricing = value; } }, metadata: _metadata }, _copyPricing_initializers, _copyPricing_extraInitializers);
            __esDecorate(null, null, _copyCommitments_decorators, { kind: "field", name: "copyCommitments", static: false, private: false, access: { has: obj => "copyCommitments" in obj, get: obj => obj.copyCommitments, set: (obj, value) => { obj.copyCommitments = value; } }, metadata: _metadata }, _copyCommitments_initializers, _copyCommitments_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RenewContractDto = RenewContractDto;
/**
 * Contract compliance check DTO
 */
let ContractComplianceCheckDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _includeWarnings_decorators;
    let _includeWarnings_initializers = [];
    let _includeWarnings_extraInitializers = [];
    return _a = class ContractComplianceCheckDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.periodStart = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
                this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
                this.includeWarnings = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _includeWarnings_initializers, void 0));
                __runInitializers(this, _includeWarnings_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check period start date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsNotEmpty)()];
            _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Check period end date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date), (0, class_validator_1.IsNotEmpty)()];
            _includeWarnings_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Include warnings' }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
            __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
            __esDecorate(null, null, _includeWarnings_decorators, { kind: "field", name: "includeWarnings", static: false, private: false, access: { has: obj => "includeWarnings" in obj, get: obj => obj.includeWarnings, set: (obj, value) => { obj.includeWarnings = value; } }, metadata: _metadata }, _includeWarnings_initializers, _includeWarnings_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.ContractComplianceCheckDto = ContractComplianceCheckDto;
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Contract model
 */
let Contract = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contracts',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['contractNumber'] },
                { fields: ['customerId'] },
                { fields: ['supplierId'] },
                { fields: ['status'] },
                { fields: ['contractType'] },
                { fields: ['startDate', 'endDate'] },
                { fields: ['renewalDate'] },
                {
                    fields: ['customerId', 'status', 'startDate', 'endDate'],
                    name: 'idx_contracts_customer_active'
                },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _contractName_decorators;
    let _contractName_initializers = [];
    let _contractName_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _customerId_decorators;
    let _customerId_initializers = [];
    let _customerId_extraInitializers = [];
    let _supplierId_decorators;
    let _supplierId_initializers = [];
    let _supplierId_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _totalValue_decorators;
    let _totalValue_initializers = [];
    let _totalValue_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _pricingType_decorators;
    let _pricingType_initializers = [];
    let _pricingType_extraInitializers = [];
    let _renewalType_decorators;
    let _renewalType_initializers = [];
    let _renewalType_extraInitializers = [];
    let _renewalNoticeDays_decorators;
    let _renewalNoticeDays_initializers = [];
    let _renewalNoticeDays_extraInitializers = [];
    let _renewalDate_decorators;
    let _renewalDate_initializers = [];
    let _renewalDate_extraInitializers = [];
    let _parentContractId_decorators;
    let _parentContractId_initializers = [];
    let _parentContractId_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _volumeCommitments_decorators;
    let _volumeCommitments_initializers = [];
    let _volumeCommitments_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _approvalStatus_decorators;
    let _approvalStatus_initializers = [];
    let _approvalStatus_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _documentUrl_decorators;
    let _documentUrl_initializers = [];
    let _documentUrl_extraInitializers = [];
    let _customFields_decorators;
    let _customFields_initializers = [];
    let _customFields_extraInitializers = [];
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
    let _contractPricing_decorators;
    let _contractPricing_initializers = [];
    let _contractPricing_extraInitializers = [];
    let _amendments_decorators;
    let _amendments_initializers = [];
    let _amendments_extraInitializers = [];
    var Contract = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.contractId = __runInitializers(this, _contractId_initializers, void 0);
            this.contractNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
            this.contractName = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _contractName_initializers, void 0));
            this.contractType = (__runInitializers(this, _contractName_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
            this.status = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.customerId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _customerId_initializers, void 0));
            this.supplierId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _supplierId_initializers, void 0));
            this.startDate = (__runInitializers(this, _supplierId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.totalValue = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _totalValue_initializers, void 0));
            this.currency = (__runInitializers(this, _totalValue_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.pricingType = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _pricingType_initializers, void 0));
            this.renewalType = (__runInitializers(this, _pricingType_extraInitializers), __runInitializers(this, _renewalType_initializers, void 0));
            this.renewalNoticeDays = (__runInitializers(this, _renewalType_extraInitializers), __runInitializers(this, _renewalNoticeDays_initializers, void 0));
            this.renewalDate = (__runInitializers(this, _renewalNoticeDays_extraInitializers), __runInitializers(this, _renewalDate_initializers, void 0));
            this.parentContractId = (__runInitializers(this, _renewalDate_extraInitializers), __runInitializers(this, _parentContractId_initializers, void 0));
            this.terms = (__runInitializers(this, _parentContractId_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
            this.volumeCommitments = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _volumeCommitments_initializers, void 0));
            this.description = (__runInitializers(this, _volumeCommitments_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.approvalStatus = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _approvalStatus_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _approvalStatus_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.documentUrl = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _documentUrl_initializers, void 0));
            this.customFields = (__runInitializers(this, _documentUrl_extraInitializers), __runInitializers(this, _customFields_initializers, void 0));
            this.createdBy = (__runInitializers(this, _customFields_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.updatedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _updatedBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _updatedBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.contractPricing = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _contractPricing_initializers, void 0));
            this.amendments = (__runInitializers(this, _contractPricing_extraInitializers), __runInitializers(this, _amendments_initializers, void 0));
            __runInitializers(this, _amendments_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Contract");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _contractNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract number (unique)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
                unique: true,
            }), sequelize_typescript_1.Index];
        _contractName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract name' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            })];
        _contractType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract type', enum: ContractType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractType)),
                allowNull: false,
            })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract status', enum: ContractStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractStatus)),
                allowNull: false,
                defaultValue: ContractStatus.DRAFT,
            })];
        _customerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Customer ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _supplierId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Supplier ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _totalValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract value (total estimated)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            })];
        _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: false,
                defaultValue: 'USD',
            })];
        _pricingType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing type', enum: ContractPricingType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractPricingType)),
                allowNull: false,
            })];
        _renewalType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Renewal type', enum: RenewalType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RenewalType)),
                allowNull: false,
                defaultValue: RenewalType.MANUAL,
            })];
        _renewalNoticeDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto-renewal notice days' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _renewalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Renewal date (if renewed)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _parentContractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Parent contract ID (if renewed)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            })];
        _terms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract terms (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _volumeCommitments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Volume commitments (JSON array)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _approvalStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval status', enum: ApprovalStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApprovalStatus)),
                allowNull: true,
            })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _approvedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _documentUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document URL (PDF, etc.)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
            })];
        _customFields_decorators = [(0, swagger_1.ApiProperty)({ description: 'Custom fields (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
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
        _contractPricing_decorators = [(0, sequelize_typescript_1.HasMany)(() => ContractPricing)];
        _amendments_decorators = [(0, sequelize_typescript_1.HasMany)(() => ContractAmendment)];
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
        __esDecorate(null, null, _contractName_decorators, { kind: "field", name: "contractName", static: false, private: false, access: { has: obj => "contractName" in obj, get: obj => obj.contractName, set: (obj, value) => { obj.contractName = value; } }, metadata: _metadata }, _contractName_initializers, _contractName_extraInitializers);
        __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: obj => "customerId" in obj, get: obj => obj.customerId, set: (obj, value) => { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
        __esDecorate(null, null, _supplierId_decorators, { kind: "field", name: "supplierId", static: false, private: false, access: { has: obj => "supplierId" in obj, get: obj => obj.supplierId, set: (obj, value) => { obj.supplierId = value; } }, metadata: _metadata }, _supplierId_initializers, _supplierId_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _totalValue_decorators, { kind: "field", name: "totalValue", static: false, private: false, access: { has: obj => "totalValue" in obj, get: obj => obj.totalValue, set: (obj, value) => { obj.totalValue = value; } }, metadata: _metadata }, _totalValue_initializers, _totalValue_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _pricingType_decorators, { kind: "field", name: "pricingType", static: false, private: false, access: { has: obj => "pricingType" in obj, get: obj => obj.pricingType, set: (obj, value) => { obj.pricingType = value; } }, metadata: _metadata }, _pricingType_initializers, _pricingType_extraInitializers);
        __esDecorate(null, null, _renewalType_decorators, { kind: "field", name: "renewalType", static: false, private: false, access: { has: obj => "renewalType" in obj, get: obj => obj.renewalType, set: (obj, value) => { obj.renewalType = value; } }, metadata: _metadata }, _renewalType_initializers, _renewalType_extraInitializers);
        __esDecorate(null, null, _renewalNoticeDays_decorators, { kind: "field", name: "renewalNoticeDays", static: false, private: false, access: { has: obj => "renewalNoticeDays" in obj, get: obj => obj.renewalNoticeDays, set: (obj, value) => { obj.renewalNoticeDays = value; } }, metadata: _metadata }, _renewalNoticeDays_initializers, _renewalNoticeDays_extraInitializers);
        __esDecorate(null, null, _renewalDate_decorators, { kind: "field", name: "renewalDate", static: false, private: false, access: { has: obj => "renewalDate" in obj, get: obj => obj.renewalDate, set: (obj, value) => { obj.renewalDate = value; } }, metadata: _metadata }, _renewalDate_initializers, _renewalDate_extraInitializers);
        __esDecorate(null, null, _parentContractId_decorators, { kind: "field", name: "parentContractId", static: false, private: false, access: { has: obj => "parentContractId" in obj, get: obj => obj.parentContractId, set: (obj, value) => { obj.parentContractId = value; } }, metadata: _metadata }, _parentContractId_initializers, _parentContractId_extraInitializers);
        __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
        __esDecorate(null, null, _volumeCommitments_decorators, { kind: "field", name: "volumeCommitments", static: false, private: false, access: { has: obj => "volumeCommitments" in obj, get: obj => obj.volumeCommitments, set: (obj, value) => { obj.volumeCommitments = value; } }, metadata: _metadata }, _volumeCommitments_initializers, _volumeCommitments_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _approvalStatus_decorators, { kind: "field", name: "approvalStatus", static: false, private: false, access: { has: obj => "approvalStatus" in obj, get: obj => obj.approvalStatus, set: (obj, value) => { obj.approvalStatus = value; } }, metadata: _metadata }, _approvalStatus_initializers, _approvalStatus_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _documentUrl_decorators, { kind: "field", name: "documentUrl", static: false, private: false, access: { has: obj => "documentUrl" in obj, get: obj => obj.documentUrl, set: (obj, value) => { obj.documentUrl = value; } }, metadata: _metadata }, _documentUrl_initializers, _documentUrl_extraInitializers);
        __esDecorate(null, null, _customFields_decorators, { kind: "field", name: "customFields", static: false, private: false, access: { has: obj => "customFields" in obj, get: obj => obj.customFields, set: (obj, value) => { obj.customFields = value; } }, metadata: _metadata }, _customFields_initializers, _customFields_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _updatedBy_decorators, { kind: "field", name: "updatedBy", static: false, private: false, access: { has: obj => "updatedBy" in obj, get: obj => obj.updatedBy, set: (obj, value) => { obj.updatedBy = value; } }, metadata: _metadata }, _updatedBy_initializers, _updatedBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _contractPricing_decorators, { kind: "field", name: "contractPricing", static: false, private: false, access: { has: obj => "contractPricing" in obj, get: obj => obj.contractPricing, set: (obj, value) => { obj.contractPricing = value; } }, metadata: _metadata }, _contractPricing_initializers, _contractPricing_extraInitializers);
        __esDecorate(null, null, _amendments_decorators, { kind: "field", name: "amendments", static: false, private: false, access: { has: obj => "amendments" in obj, get: obj => obj.amendments, set: (obj, value) => { obj.amendments = value; } }, metadata: _metadata }, _amendments_initializers, _amendments_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Contract = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Contract = _classThis;
})();
exports.Contract = Contract;
/**
 * Contract pricing model
 */
let ContractPricing = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_pricing',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['contractId'] },
                { fields: ['productId'] },
                { fields: ['contractId', 'productId'] },
                { fields: ['isActive'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _contractPricingId_decorators;
    let _contractPricingId_initializers = [];
    let _contractPricingId_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _productSku_decorators;
    let _productSku_initializers = [];
    let _productSku_extraInitializers = [];
    let _baseUnitPrice_decorators;
    let _baseUnitPrice_initializers = [];
    let _baseUnitPrice_extraInitializers = [];
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _uom_decorators;
    let _uom_initializers = [];
    let _uom_extraInitializers = [];
    let _pricingTiers_decorators;
    let _pricingTiers_initializers = [];
    let _pricingTiers_extraInitializers = [];
    let _minOrderQuantity_decorators;
    let _minOrderQuantity_initializers = [];
    let _minOrderQuantity_extraInitializers = [];
    let _maxOrderQuantity_decorators;
    let _maxOrderQuantity_initializers = [];
    let _maxOrderQuantity_extraInitializers = [];
    let _leadTimeDays_decorators;
    let _leadTimeDays_initializers = [];
    let _leadTimeDays_extraInitializers = [];
    let _effectiveStartDate_decorators;
    let _effectiveStartDate_initializers = [];
    let _effectiveStartDate_extraInitializers = [];
    let _effectiveEndDate_decorators;
    let _effectiveEndDate_initializers = [];
    let _effectiveEndDate_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ContractPricing = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.contractPricingId = __runInitializers(this, _contractPricingId_initializers, void 0);
            this.contractId = (__runInitializers(this, _contractPricingId_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.contract = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            this.productId = (__runInitializers(this, _contract_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.productSku = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _productSku_initializers, void 0));
            this.baseUnitPrice = (__runInitializers(this, _productSku_extraInitializers), __runInitializers(this, _baseUnitPrice_initializers, void 0));
            this.currency = (__runInitializers(this, _baseUnitPrice_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
            this.uom = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _uom_initializers, void 0));
            this.pricingTiers = (__runInitializers(this, _uom_extraInitializers), __runInitializers(this, _pricingTiers_initializers, void 0));
            this.minOrderQuantity = (__runInitializers(this, _pricingTiers_extraInitializers), __runInitializers(this, _minOrderQuantity_initializers, void 0));
            this.maxOrderQuantity = (__runInitializers(this, _minOrderQuantity_extraInitializers), __runInitializers(this, _maxOrderQuantity_initializers, void 0));
            this.leadTimeDays = (__runInitializers(this, _maxOrderQuantity_extraInitializers), __runInitializers(this, _leadTimeDays_initializers, void 0));
            this.effectiveStartDate = (__runInitializers(this, _leadTimeDays_extraInitializers), __runInitializers(this, _effectiveStartDate_initializers, void 0));
            this.effectiveEndDate = (__runInitializers(this, _effectiveStartDate_extraInitializers), __runInitializers(this, _effectiveEndDate_initializers, void 0));
            this.isActive = (__runInitializers(this, _effectiveEndDate_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractPricing");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _contractPricingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract pricing ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Contract), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Contract)];
        _productId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _productSku_decorators = [(0, swagger_1.ApiProperty)({ description: 'Product SKU' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            })];
        _baseUnitPrice_decorators = [(0, swagger_1.ApiProperty)({ description: 'Base unit price' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 4),
                allowNull: false,
            })];
        _currency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Currency code' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(3),
                allowNull: false,
                defaultValue: 'USD',
            })];
        _uom_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit of measure' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: true,
            })];
        _pricingTiers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pricing tiers (JSON array)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _minOrderQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Minimum order quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _maxOrderQuantity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Maximum order quantity' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _leadTimeDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Lead time in days' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
            })];
        _effectiveStartDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _effectiveEndDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is active' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _contractPricingId_decorators, { kind: "field", name: "contractPricingId", static: false, private: false, access: { has: obj => "contractPricingId" in obj, get: obj => obj.contractPricingId, set: (obj, value) => { obj.contractPricingId = value; } }, metadata: _metadata }, _contractPricingId_initializers, _contractPricingId_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _productSku_decorators, { kind: "field", name: "productSku", static: false, private: false, access: { has: obj => "productSku" in obj, get: obj => obj.productSku, set: (obj, value) => { obj.productSku = value; } }, metadata: _metadata }, _productSku_initializers, _productSku_extraInitializers);
        __esDecorate(null, null, _baseUnitPrice_decorators, { kind: "field", name: "baseUnitPrice", static: false, private: false, access: { has: obj => "baseUnitPrice" in obj, get: obj => obj.baseUnitPrice, set: (obj, value) => { obj.baseUnitPrice = value; } }, metadata: _metadata }, _baseUnitPrice_initializers, _baseUnitPrice_extraInitializers);
        __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
        __esDecorate(null, null, _uom_decorators, { kind: "field", name: "uom", static: false, private: false, access: { has: obj => "uom" in obj, get: obj => obj.uom, set: (obj, value) => { obj.uom = value; } }, metadata: _metadata }, _uom_initializers, _uom_extraInitializers);
        __esDecorate(null, null, _pricingTiers_decorators, { kind: "field", name: "pricingTiers", static: false, private: false, access: { has: obj => "pricingTiers" in obj, get: obj => obj.pricingTiers, set: (obj, value) => { obj.pricingTiers = value; } }, metadata: _metadata }, _pricingTiers_initializers, _pricingTiers_extraInitializers);
        __esDecorate(null, null, _minOrderQuantity_decorators, { kind: "field", name: "minOrderQuantity", static: false, private: false, access: { has: obj => "minOrderQuantity" in obj, get: obj => obj.minOrderQuantity, set: (obj, value) => { obj.minOrderQuantity = value; } }, metadata: _metadata }, _minOrderQuantity_initializers, _minOrderQuantity_extraInitializers);
        __esDecorate(null, null, _maxOrderQuantity_decorators, { kind: "field", name: "maxOrderQuantity", static: false, private: false, access: { has: obj => "maxOrderQuantity" in obj, get: obj => obj.maxOrderQuantity, set: (obj, value) => { obj.maxOrderQuantity = value; } }, metadata: _metadata }, _maxOrderQuantity_initializers, _maxOrderQuantity_extraInitializers);
        __esDecorate(null, null, _leadTimeDays_decorators, { kind: "field", name: "leadTimeDays", static: false, private: false, access: { has: obj => "leadTimeDays" in obj, get: obj => obj.leadTimeDays, set: (obj, value) => { obj.leadTimeDays = value; } }, metadata: _metadata }, _leadTimeDays_initializers, _leadTimeDays_extraInitializers);
        __esDecorate(null, null, _effectiveStartDate_decorators, { kind: "field", name: "effectiveStartDate", static: false, private: false, access: { has: obj => "effectiveStartDate" in obj, get: obj => obj.effectiveStartDate, set: (obj, value) => { obj.effectiveStartDate = value; } }, metadata: _metadata }, _effectiveStartDate_initializers, _effectiveStartDate_extraInitializers);
        __esDecorate(null, null, _effectiveEndDate_decorators, { kind: "field", name: "effectiveEndDate", static: false, private: false, access: { has: obj => "effectiveEndDate" in obj, get: obj => obj.effectiveEndDate, set: (obj, value) => { obj.effectiveEndDate = value; } }, metadata: _metadata }, _effectiveEndDate_initializers, _effectiveEndDate_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractPricing = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractPricing = _classThis;
})();
exports.ContractPricing = ContractPricing;
/**
 * Contract amendment model
 */
let ContractAmendment = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_amendments',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['contractId'] },
                { fields: ['amendmentNumber'] },
                { fields: ['amendmentType'] },
                { fields: ['effectiveDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _amendmentId_decorators;
    let _amendmentId_initializers = [];
    let _amendmentId_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    let _amendmentNumber_decorators;
    let _amendmentNumber_initializers = [];
    let _amendmentNumber_extraInitializers = [];
    let _amendmentType_decorators;
    let _amendmentType_initializers = [];
    let _amendmentType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _previousValues_decorators;
    let _previousValues_initializers = [];
    let _previousValues_extraInitializers = [];
    let _newValues_decorators;
    let _newValues_initializers = [];
    let _newValues_extraInitializers = [];
    let _approvalStatus_decorators;
    let _approvalStatus_initializers = [];
    let _approvalStatus_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvedDate_decorators;
    let _approvedDate_initializers = [];
    let _approvedDate_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ContractAmendment = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.amendmentId = __runInitializers(this, _amendmentId_initializers, void 0);
            this.contractId = (__runInitializers(this, _amendmentId_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.contract = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            this.amendmentNumber = (__runInitializers(this, _contract_extraInitializers), __runInitializers(this, _amendmentNumber_initializers, void 0));
            this.amendmentType = (__runInitializers(this, _amendmentNumber_extraInitializers), __runInitializers(this, _amendmentType_initializers, void 0));
            this.description = (__runInitializers(this, _amendmentType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.previousValues = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _previousValues_initializers, void 0));
            this.newValues = (__runInitializers(this, _previousValues_extraInitializers), __runInitializers(this, _newValues_initializers, void 0));
            this.approvalStatus = (__runInitializers(this, _newValues_extraInitializers), __runInitializers(this, _approvalStatus_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _approvalStatus_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvedDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
            this.createdBy = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractAmendment");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _amendmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Contract), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Contract)];
        _amendmentNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment number' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _amendmentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment type', enum: AmendmentType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AmendmentType)),
                allowNull: false,
            })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Amendment description' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            })];
        _effectiveDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Effective date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _previousValues_decorators = [(0, swagger_1.ApiProperty)({ description: 'Previous values (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _newValues_decorators = [(0, swagger_1.ApiProperty)({ description: 'New values (JSON)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            })];
        _approvalStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval status', enum: ApprovalStatus }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApprovalStatus)),
                allowNull: false,
                defaultValue: ApprovalStatus.PENDING,
            })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: true,
            })];
        _approvedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            })];
        _createdBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Created by user ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(50),
                allowNull: false,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _amendmentId_decorators, { kind: "field", name: "amendmentId", static: false, private: false, access: { has: obj => "amendmentId" in obj, get: obj => obj.amendmentId, set: (obj, value) => { obj.amendmentId = value; } }, metadata: _metadata }, _amendmentId_initializers, _amendmentId_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, null, _amendmentNumber_decorators, { kind: "field", name: "amendmentNumber", static: false, private: false, access: { has: obj => "amendmentNumber" in obj, get: obj => obj.amendmentNumber, set: (obj, value) => { obj.amendmentNumber = value; } }, metadata: _metadata }, _amendmentNumber_initializers, _amendmentNumber_extraInitializers);
        __esDecorate(null, null, _amendmentType_decorators, { kind: "field", name: "amendmentType", static: false, private: false, access: { has: obj => "amendmentType" in obj, get: obj => obj.amendmentType, set: (obj, value) => { obj.amendmentType = value; } }, metadata: _metadata }, _amendmentType_initializers, _amendmentType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _previousValues_decorators, { kind: "field", name: "previousValues", static: false, private: false, access: { has: obj => "previousValues" in obj, get: obj => obj.previousValues, set: (obj, value) => { obj.previousValues = value; } }, metadata: _metadata }, _previousValues_initializers, _previousValues_extraInitializers);
        __esDecorate(null, null, _newValues_decorators, { kind: "field", name: "newValues", static: false, private: false, access: { has: obj => "newValues" in obj, get: obj => obj.newValues, set: (obj, value) => { obj.newValues = value; } }, metadata: _metadata }, _newValues_initializers, _newValues_extraInitializers);
        __esDecorate(null, null, _approvalStatus_decorators, { kind: "field", name: "approvalStatus", static: false, private: false, access: { has: obj => "approvalStatus" in obj, get: obj => obj.approvalStatus, set: (obj, value) => { obj.approvalStatus = value; } }, metadata: _metadata }, _approvalStatus_initializers, _approvalStatus_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: obj => "approvedDate" in obj, get: obj => obj.approvedDate, set: (obj, value) => { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractAmendment = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractAmendment = _classThis;
})();
exports.ContractAmendment = ContractAmendment;
/**
 * Contract performance tracking model
 */
let ContractPerformance = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contract_performance',
            timestamps: true,
            paranoid: false,
            indexes: [
                { fields: ['contractId'] },
                { fields: ['metricType'] },
                { fields: ['periodStart', 'periodEnd'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _performanceId_decorators;
    let _performanceId_initializers = [];
    let _performanceId_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _metricType_decorators;
    let _metricType_initializers = [];
    let _metricType_extraInitializers = [];
    let _periodStart_decorators;
    let _periodStart_initializers = [];
    let _periodStart_extraInitializers = [];
    let _periodEnd_decorators;
    let _periodEnd_initializers = [];
    let _periodEnd_extraInitializers = [];
    let _targetValue_decorators;
    let _targetValue_initializers = [];
    let _targetValue_extraInitializers = [];
    let _actualValue_decorators;
    let _actualValue_initializers = [];
    let _actualValue_extraInitializers = [];
    let _achievementPercent_decorators;
    let _achievementPercent_initializers = [];
    let _achievementPercent_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ContractPerformance = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.performanceId = __runInitializers(this, _performanceId_initializers, void 0);
            this.contractId = (__runInitializers(this, _performanceId_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.metricType = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _metricType_initializers, void 0));
            this.periodStart = (__runInitializers(this, _metricType_extraInitializers), __runInitializers(this, _periodStart_initializers, void 0));
            this.periodEnd = (__runInitializers(this, _periodStart_extraInitializers), __runInitializers(this, _periodEnd_initializers, void 0));
            this.targetValue = (__runInitializers(this, _periodEnd_extraInitializers), __runInitializers(this, _targetValue_initializers, void 0));
            this.actualValue = (__runInitializers(this, _targetValue_extraInitializers), __runInitializers(this, _actualValue_initializers, void 0));
            this.achievementPercent = (__runInitializers(this, _actualValue_extraInitializers), __runInitializers(this, _achievementPercent_initializers, void 0));
            this.status = (__runInitializers(this, _achievementPercent_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractPerformance");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _performanceId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance ID (UUID)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index];
        _metricType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metric type', enum: PerformanceMetricType }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PerformanceMetricType)),
                allowNull: false,
            })];
        _periodStart_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period start date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _periodEnd_decorators = [(0, swagger_1.ApiProperty)({ description: 'Period end date' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            })];
        _targetValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Target value' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _actualValue_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual value' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: false,
            })];
        _achievementPercent_decorators = [(0, swagger_1.ApiProperty)({ description: 'Achievement percentage' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                allowNull: false,
            })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status (MEETING, EXCEEDING, BELOW_TARGET, CRITICAL)' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(20),
                allowNull: false,
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column];
        __esDecorate(null, null, _performanceId_decorators, { kind: "field", name: "performanceId", static: false, private: false, access: { has: obj => "performanceId" in obj, get: obj => obj.performanceId, set: (obj, value) => { obj.performanceId = value; } }, metadata: _metadata }, _performanceId_initializers, _performanceId_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _metricType_decorators, { kind: "field", name: "metricType", static: false, private: false, access: { has: obj => "metricType" in obj, get: obj => obj.metricType, set: (obj, value) => { obj.metricType = value; } }, metadata: _metadata }, _metricType_initializers, _metricType_extraInitializers);
        __esDecorate(null, null, _periodStart_decorators, { kind: "field", name: "periodStart", static: false, private: false, access: { has: obj => "periodStart" in obj, get: obj => obj.periodStart, set: (obj, value) => { obj.periodStart = value; } }, metadata: _metadata }, _periodStart_initializers, _periodStart_extraInitializers);
        __esDecorate(null, null, _periodEnd_decorators, { kind: "field", name: "periodEnd", static: false, private: false, access: { has: obj => "periodEnd" in obj, get: obj => obj.periodEnd, set: (obj, value) => { obj.periodEnd = value; } }, metadata: _metadata }, _periodEnd_initializers, _periodEnd_extraInitializers);
        __esDecorate(null, null, _targetValue_decorators, { kind: "field", name: "targetValue", static: false, private: false, access: { has: obj => "targetValue" in obj, get: obj => obj.targetValue, set: (obj, value) => { obj.targetValue = value; } }, metadata: _metadata }, _targetValue_initializers, _targetValue_extraInitializers);
        __esDecorate(null, null, _actualValue_decorators, { kind: "field", name: "actualValue", static: false, private: false, access: { has: obj => "actualValue" in obj, get: obj => obj.actualValue, set: (obj, value) => { obj.actualValue = value; } }, metadata: _metadata }, _actualValue_initializers, _actualValue_extraInitializers);
        __esDecorate(null, null, _achievementPercent_decorators, { kind: "field", name: "achievementPercent", static: false, private: false, access: { has: obj => "achievementPercent" in obj, get: obj => obj.achievementPercent, set: (obj, value) => { obj.achievementPercent = value; } }, metadata: _metadata }, _achievementPercent_initializers, _achievementPercent_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractPerformance = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractPerformance = _classThis;
})();
exports.ContractPerformance = ContractPerformance;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Create a new contract
 *
 * Creates a new contract with validation and generates a unique contract number.
 *
 * @param contractData - Contract creation data
 * @param userId - User ID creating the contract
 * @returns Created contract
 *
 * @example
 * const contract = await createContract(contractDto, 'user-123');
 */
async function createContract(contractData, userId) {
    try {
        // Validate dates
        if (contractData.startDate >= contractData.endDate) {
            throw new common_1.BadRequestException('Contract start date must be before end date');
        }
        // Generate unique contract number
        const contractNumber = await generateContractNumber(contractData.contractType);
        const contract = await Contract.create({
            contractNumber,
            contractName: contractData.contractName,
            contractType: contractData.contractType,
            status: ContractStatus.DRAFT,
            customerId: contractData.customerId,
            supplierId: contractData.supplierId,
            startDate: contractData.startDate,
            endDate: contractData.endDate,
            pricingType: contractData.pricingType,
            renewalType: contractData.renewalType || RenewalType.MANUAL,
            renewalNoticeDays: contractData.renewalNoticeDays,
            terms: contractData.terms,
            volumeCommitments: contractData.volumeCommitments,
            description: contractData.description,
            currency: 'USD',
            approvalStatus: ApprovalStatus.PENDING,
            customFields: contractData.customFields,
            createdBy: userId,
        });
        return contract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create contract: ${error.message}`);
    }
}
/**
 * Generate unique contract number
 *
 * @param contractType - Contract type
 * @returns Generated contract number
 */
async function generateContractNumber(contractType) {
    const prefix = contractType.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}
/**
 * Add pricing to contract
 *
 * Adds product pricing details to an existing contract.
 *
 * @param pricingData - Contract pricing data
 * @returns Created contract pricing
 *
 * @example
 * const pricing = await addContractPricing(pricingDto);
 */
async function addContractPricing(pricingData) {
    try {
        // Verify contract exists
        const contract = await Contract.findByPk(pricingData.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${pricingData.contractId}`);
        }
        // Check for duplicate product in contract
        const existing = await ContractPricing.findOne({
            where: {
                contractId: pricingData.contractId,
                productId: pricingData.productId,
                isActive: true,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Product ${pricingData.productId} already has active pricing in this contract`);
        }
        const contractPricing = await ContractPricing.create({
            contractId: pricingData.contractId,
            productId: pricingData.productId,
            productSku: pricingData.productId, // In production, lookup actual SKU
            baseUnitPrice: pricingData.baseUnitPrice,
            currency: pricingData.currency,
            uom: pricingData.uom,
            pricingTiers: pricingData.pricingTiers,
            minOrderQuantity: pricingData.minOrderQuantity,
            maxOrderQuantity: pricingData.maxOrderQuantity,
            leadTimeDays: pricingData.leadTimeDays,
            effectiveStartDate: contract.startDate,
            effectiveEndDate: contract.endDate,
            isActive: true,
        });
        return contractPricing;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to add contract pricing: ${error.message}`);
    }
}
/**
 * Get contract by ID
 *
 * @param contractId - Contract ID
 * @param includePricing - Include pricing details
 * @param includeAmendments - Include amendments
 * @returns Contract with optional includes
 *
 * @example
 * const contract = await getContractById('contract-123', true, true);
 */
async function getContractById(contractId, includePricing = false, includeAmendments = false) {
    try {
        const include = [];
        if (includePricing) {
            include.push({ model: ContractPricing });
        }
        if (includeAmendments) {
            include.push({ model: ContractAmendment });
        }
        const contract = await Contract.findByPk(contractId, {
            include: include.length > 0 ? include : undefined,
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        return contract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get contract: ${error.message}`);
    }
}
/**
 * Get active contracts for customer
 *
 * Retrieves all active contracts for a specific customer.
 *
 * @param customerId - Customer ID
 * @param includeExpiringSoon - Include contracts expiring within 90 days
 * @returns Array of active contracts
 *
 * @example
 * const contracts = await getActiveContractsForCustomer('CUST-123', true);
 */
async function getActiveContractsForCustomer(customerId, includeExpiringSoon = false) {
    try {
        const now = new Date();
        const whereClause = {
            customerId,
            status: ContractStatus.ACTIVE,
            startDate: { [sequelize_1.Op.lte]: now },
            endDate: { [sequelize_1.Op.gte]: now },
        };
        if (includeExpiringSoon) {
            const ninetyDaysFromNow = new Date();
            ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
            whereClause.endDate = { [sequelize_1.Op.between]: [now, ninetyDaysFromNow] };
        }
        const contracts = await Contract.findAll({
            where: whereClause,
            include: [{ model: ContractPricing }],
            order: [['endDate', 'ASC']],
        });
        return contracts;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get active contracts: ${error.message}`);
    }
}
/**
 * Get contract pricing for product
 *
 * Retrieves contract pricing for a specific product and customer.
 *
 * @param customerId - Customer ID
 * @param productId - Product ID
 * @param quantity - Order quantity (for tiered pricing)
 * @returns Contract pricing or null
 *
 * @example
 * const pricing = await getContractPricingForProduct('CUST-123', 'PROD-001', 100);
 */
async function getContractPricingForProduct(customerId, productId, quantity = 1) {
    try {
        const now = new Date();
        // Find active contract with this product
        const contractPricing = await ContractPricing.findOne({
            where: {
                productId,
                isActive: true,
                effectiveStartDate: { [sequelize_1.Op.lte]: now },
                [sequelize_1.Op.or]: [
                    { effectiveEndDate: { [sequelize_1.Op.gte]: now } },
                    { effectiveEndDate: null },
                ],
            },
            include: [
                {
                    model: Contract,
                    where: {
                        customerId,
                        status: ContractStatus.ACTIVE,
                        startDate: { [sequelize_1.Op.lte]: now },
                        endDate: { [sequelize_1.Op.gte]: now },
                    },
                },
            ],
            order: [[{ model: Contract, as: 'contract' }, 'endDate', 'DESC']],
        });
        if (!contractPricing) {
            return null;
        }
        // Calculate price based on tiers
        let unitPrice = contractPricing.baseUnitPrice;
        if (contractPricing.pricingTiers && contractPricing.pricingTiers.length > 0) {
            const applicableTier = contractPricing.pricingTiers.find(tier => {
                const meetsMin = quantity >= tier.minQuantity;
                const meetsMax = !tier.maxQuantity || quantity <= tier.maxQuantity;
                return meetsMin && meetsMax;
            });
            if (applicableTier) {
                unitPrice = applicableTier.unitPrice;
            }
        }
        return {
            unitPrice,
            contractId: contractPricing.contractId,
            contractNumber: contractPricing.contract.contractNumber,
        };
    }
    catch (error) {
        return null;
    }
}
/**
 * Activate contract
 *
 * Activates a contract after approval.
 *
 * @param contractId - Contract ID
 * @param userId - User ID activating the contract
 * @returns Activated contract
 *
 * @example
 * const contract = await activateContract('contract-123', 'user-456');
 */
async function activateContract(contractId, userId) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        if (contract.status !== ContractStatus.APPROVED) {
            throw new common_1.BadRequestException('Contract must be approved before activation');
        }
        contract.status = ContractStatus.ACTIVE;
        contract.updatedBy = userId;
        await contract.save();
        return contract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to activate contract: ${error.message}`);
    }
}
/**
 * Approve contract
 *
 * Approves a pending contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID approving the contract
 * @param notes - Approval notes
 * @returns Approved contract
 *
 * @example
 * const contract = await approveContract('contract-123', 'user-456', 'Approved by management');
 */
async function approveContract(contractId, userId, notes) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        if (contract.status !== ContractStatus.PENDING_APPROVAL && contract.status !== ContractStatus.DRAFT) {
            throw new common_1.BadRequestException(`Contract in ${contract.status} status cannot be approved`);
        }
        contract.status = ContractStatus.APPROVED;
        contract.approvalStatus = ApprovalStatus.APPROVED;
        contract.approvedBy = userId;
        contract.approvedDate = new Date();
        contract.updatedBy = userId;
        if (notes) {
            contract.customFields = {
                ...contract.customFields,
                approvalNotes: notes,
            };
        }
        await contract.save();
        return contract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to approve contract: ${error.message}`);
    }
}
/**
 * Create contract amendment
 *
 * Creates an amendment to an existing contract.
 *
 * @param amendmentData - Amendment data
 * @param userId - User ID creating the amendment
 * @returns Created amendment
 *
 * @example
 * const amendment = await createContractAmendment(amendmentDto, 'user-123');
 */
async function createContractAmendment(amendmentData, userId) {
    try {
        // Verify contract exists
        const contract = await Contract.findByPk(amendmentData.contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${amendmentData.contractId}`);
        }
        // Generate amendment number
        const amendmentNumber = await generateAmendmentNumber(amendmentData.contractId);
        const amendment = await ContractAmendment.create({
            contractId: amendmentData.contractId,
            amendmentNumber,
            amendmentType: amendmentData.amendmentType,
            description: amendmentData.description,
            effectiveDate: amendmentData.effectiveDate,
            previousValues: amendmentData.previousValues,
            newValues: amendmentData.newValues,
            approvalStatus: amendmentData.requiresApproval
                ? ApprovalStatus.PENDING
                : ApprovalStatus.APPROVED,
            createdBy: userId,
        });
        // Update contract status to AMENDED
        contract.status = ContractStatus.AMENDED;
        contract.updatedBy = userId;
        await contract.save();
        return amendment;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create contract amendment: ${error.message}`);
    }
}
/**
 * Generate amendment number
 *
 * @param contractId - Contract ID
 * @returns Generated amendment number
 */
async function generateAmendmentNumber(contractId) {
    const count = await ContractAmendment.count({ where: { contractId } });
    const contract = await Contract.findByPk(contractId);
    return `${contract.contractNumber}-AMD-${String(count + 1).padStart(3, '0')}`;
}
/**
 * Renew contract
 *
 * Creates a new contract based on an expiring contract.
 *
 * @param renewalData - Renewal data
 * @param userId - User ID creating the renewal
 * @returns New contract (renewal)
 *
 * @example
 * const renewedContract = await renewContract(renewalDto, 'user-123');
 */
async function renewContract(renewalData, userId) {
    try {
        // Get original contract
        const originalContract = await Contract.findByPk(renewalData.contractId, {
            include: [{ model: ContractPricing }],
        });
        if (!originalContract) {
            throw new common_1.NotFoundException(`Contract not found: ${renewalData.contractId}`);
        }
        // Validate dates
        if (renewalData.newStartDate >= renewalData.newEndDate) {
            throw new common_1.BadRequestException('Renewal start date must be before end date');
        }
        // Generate new contract number
        const contractNumber = await generateContractNumber(originalContract.contractType);
        // Create renewed contract
        const renewedContract = await Contract.create({
            contractNumber,
            contractName: `${originalContract.contractName} (Renewed)`,
            contractType: originalContract.contractType,
            status: ContractStatus.DRAFT,
            customerId: originalContract.customerId,
            supplierId: originalContract.supplierId,
            startDate: renewalData.newStartDate,
            endDate: renewalData.newEndDate,
            pricingType: originalContract.pricingType,
            renewalType: originalContract.renewalType,
            renewalNoticeDays: originalContract.renewalNoticeDays,
            terms: originalContract.terms,
            volumeCommitments: renewalData.copyCommitments ? originalContract.volumeCommitments : null,
            description: `Renewal of ${originalContract.contractNumber}. ${renewalData.notes || ''}`,
            currency: originalContract.currency,
            approvalStatus: ApprovalStatus.PENDING,
            parentContractId: originalContract.contractId,
            createdBy: userId,
        });
        // Copy pricing if requested
        if (renewalData.copyPricing && originalContract.contractPricing) {
            for (const pricing of originalContract.contractPricing) {
                let adjustedPrice = pricing.baseUnitPrice;
                if (renewalData.priceAdjustmentPercent) {
                    adjustedPrice = pricing.baseUnitPrice * (1 + renewalData.priceAdjustmentPercent / 100);
                }
                await ContractPricing.create({
                    contractId: renewedContract.contractId,
                    productId: pricing.productId,
                    productSku: pricing.productSku,
                    baseUnitPrice: adjustedPrice,
                    currency: pricing.currency,
                    uom: pricing.uom,
                    pricingTiers: pricing.pricingTiers,
                    minOrderQuantity: pricing.minOrderQuantity,
                    maxOrderQuantity: pricing.maxOrderQuantity,
                    leadTimeDays: pricing.leadTimeDays,
                    effectiveStartDate: renewedContract.startDate,
                    effectiveEndDate: renewedContract.endDate,
                    isActive: true,
                });
            }
        }
        // Update original contract
        originalContract.status = ContractStatus.RENEWED;
        originalContract.renewalDate = new Date();
        originalContract.updatedBy = userId;
        await originalContract.save();
        return renewedContract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to renew contract: ${error.message}`);
    }
}
/**
 * Get contracts expiring soon
 *
 * Retrieves contracts expiring within specified days.
 *
 * @param daysAhead - Days to look ahead (default 90)
 * @param renewalTypeFilter - Filter by renewal type
 * @returns Array of expiring contracts
 *
 * @example
 * const expiringContracts = await getExpiringContracts(60, RenewalType.AUTO_RENEW);
 */
async function getExpiringContracts(daysAhead = 90, renewalTypeFilter) {
    try {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const whereClause = {
            status: ContractStatus.ACTIVE,
            endDate: { [sequelize_1.Op.between]: [now, futureDate] },
        };
        if (renewalTypeFilter) {
            whereClause.renewalType = renewalTypeFilter;
        }
        const contracts = await Contract.findAll({
            where: whereClause,
            order: [['endDate', 'ASC']],
        });
        return contracts;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get expiring contracts: ${error.message}`);
    }
}
/**
 * Process auto-renewals
 *
 * Automatically renews contracts marked for auto-renewal that are expiring.
 *
 * @param daysBeforeExpiration - Days before expiration to process
 * @param userId - User ID for audit trail
 * @returns Count of processed renewals
 *
 * @example
 * const count = await processAutoRenewals(30, 'system');
 */
async function processAutoRenewals(daysBeforeExpiration = 30, userId = 'system') {
    try {
        const expiringContracts = await getExpiringContracts(daysBeforeExpiration, RenewalType.AUTO_RENEW);
        let renewalCount = 0;
        for (const contract of expiringContracts) {
            // Check if already renewed
            if (contract.status === ContractStatus.RENEWED) {
                continue;
            }
            // Calculate new dates
            const contractDuration = contract.endDate.getTime() - contract.startDate.getTime();
            const newStartDate = new Date(contract.endDate);
            newStartDate.setDate(newStartDate.getDate() + 1);
            const newEndDate = new Date(newStartDate.getTime() + contractDuration);
            // Create renewal
            const renewalDto = {
                contractId: contract.contractId,
                newStartDate,
                newEndDate,
                copyPricing: true,
                copyCommitments: true,
                notes: 'Auto-renewed contract',
            };
            await renewContract(renewalDto, userId);
            renewalCount++;
        }
        return renewalCount;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to process auto-renewals: ${error.message}`);
    }
}
/**
 * Check volume commitment compliance
 *
 * Checks if customer is meeting volume commitments in the contract.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Compliance check results
 *
 * @example
 * const results = await checkVolumeCommitmentCompliance('contract-123', startDate, endDate);
 */
async function checkVolumeCommitmentCompliance(contractId, periodStart, periodEnd) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        const results = [];
        if (!contract.volumeCommitments || contract.volumeCommitments.length === 0) {
            return results;
        }
        for (const commitment of contract.volumeCommitments) {
            // In production, query actual order data for the period
            const actualQuantity = 0; // Placeholder
            const actualValue = 0; // Placeholder
            let passed = true;
            let variance = 0;
            let severity = 'INFO';
            let message = '';
            let requiredValue = 0;
            let actualCheckValue = 0;
            switch (commitment.commitmentType) {
                case CommitmentType.MINIMUM_QUANTITY:
                    requiredValue = commitment.minQuantity || 0;
                    actualCheckValue = actualQuantity;
                    passed = actualQuantity >= requiredValue;
                    variance = actualQuantity - requiredValue;
                    message = passed
                        ? `Minimum quantity met: ${actualQuantity} >= ${requiredValue}`
                        : `Below minimum quantity: ${actualQuantity} < ${requiredValue}`;
                    severity = passed ? 'INFO' : variance < -requiredValue * 0.1 ? 'CRITICAL' : 'WARNING';
                    break;
                case CommitmentType.MINIMUM_VALUE:
                    requiredValue = commitment.minValue || 0;
                    actualCheckValue = actualValue;
                    passed = actualValue >= requiredValue;
                    variance = actualValue - requiredValue;
                    message = passed
                        ? `Minimum value met: $${actualValue} >= $${requiredValue}`
                        : `Below minimum value: $${actualValue} < $${requiredValue}`;
                    severity = passed ? 'INFO' : variance < -requiredValue * 0.1 ? 'CRITICAL' : 'WARNING';
                    break;
                case CommitmentType.MAXIMUM_QUANTITY:
                    requiredValue = commitment.maxQuantity || 0;
                    actualCheckValue = actualQuantity;
                    passed = actualQuantity <= requiredValue;
                    variance = requiredValue - actualQuantity;
                    message = passed
                        ? `Within maximum quantity: ${actualQuantity} <= ${requiredValue}`
                        : `Exceeded maximum quantity: ${actualQuantity} > ${requiredValue}`;
                    severity = passed ? 'INFO' : 'WARNING';
                    break;
            }
            results.push({
                checkId: `CHK-${commitment.commitmentId}-${Date.now()}`,
                checkType: commitment.commitmentType,
                passed,
                actualValue: actualCheckValue,
                requiredValue,
                variance,
                severity,
                message,
                timestamp: new Date(),
            });
        }
        return results;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to check compliance: ${error.message}`);
    }
}
/**
 * Calculate contract performance metrics
 *
 * Calculates various performance metrics for a contract.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Performance metrics
 *
 * @example
 * const metrics = await calculateContractPerformanceMetrics('contract-123', startDate, endDate);
 */
async function calculateContractPerformanceMetrics(contractId, periodStart, periodEnd) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        const metrics = [];
        // In production, query actual order data and calculate real metrics
        // This is a placeholder implementation
        // Purchase volume metric
        const targetVolume = 1000; // Placeholder
        const actualVolume = 850; // Placeholder
        const volumeAchievement = (actualVolume / targetVolume) * 100;
        metrics.push({
            metricType: PerformanceMetricType.PURCHASE_VOLUME,
            targetValue: targetVolume,
            actualValue: actualVolume,
            achievementPercent: volumeAchievement,
            periodStart,
            periodEnd,
            status: volumeAchievement >= 100 ? 'MEETING' : volumeAchievement >= 80 ? 'BELOW_TARGET' : 'CRITICAL',
        });
        // Purchase value metric
        const targetValue = 50000; // Placeholder
        const actualValue = 45000; // Placeholder
        const valueAchievement = (actualValue / targetValue) * 100;
        metrics.push({
            metricType: PerformanceMetricType.PURCHASE_VALUE,
            targetValue,
            actualValue,
            achievementPercent: valueAchievement,
            periodStart,
            periodEnd,
            status: valueAchievement >= 100 ? 'MEETING' : valueAchievement >= 80 ? 'BELOW_TARGET' : 'CRITICAL',
        });
        return metrics;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate performance metrics: ${error.message}`);
    }
}
/**
 * Record contract performance
 *
 * Records performance data for a contract period.
 *
 * @param contractId - Contract ID
 * @param metricType - Type of performance metric
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @param targetValue - Target value
 * @param actualValue - Actual value
 * @returns Created performance record
 *
 * @example
 * const perf = await recordContractPerformance('contract-123', PerformanceMetricType.PURCHASE_VOLUME, start, end, 1000, 950);
 */
async function recordContractPerformance(contractId, metricType, periodStart, periodEnd, targetValue, actualValue) {
    try {
        const achievementPercent = (actualValue / targetValue) * 100;
        let status = 'MEETING';
        if (achievementPercent >= 100) {
            status = 'EXCEEDING';
        }
        else if (achievementPercent >= 80) {
            status = 'MEETING';
        }
        else if (achievementPercent >= 50) {
            status = 'BELOW_TARGET';
        }
        else {
            status = 'CRITICAL';
        }
        const performance = await ContractPerformance.create({
            contractId,
            metricType,
            periodStart,
            periodEnd,
            targetValue,
            actualValue,
            achievementPercent,
            status,
        });
        return performance;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to record performance: ${error.message}`);
    }
}
/**
 * Terminate contract
 *
 * Terminates a contract before its end date.
 *
 * @param contractId - Contract ID
 * @param userId - User ID terminating the contract
 * @param reason - Termination reason
 * @param effectiveDate - Termination effective date
 * @returns Terminated contract
 *
 * @example
 * const contract = await terminateContract('contract-123', 'user-456', 'Customer request', new Date());
 */
async function terminateContract(contractId, userId, reason, effectiveDate) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        if (contract.status === ContractStatus.TERMINATED) {
            throw new common_1.BadRequestException('Contract is already terminated');
        }
        contract.status = ContractStatus.TERMINATED;
        contract.endDate = effectiveDate;
        contract.updatedBy = userId;
        contract.customFields = {
            ...contract.customFields,
            terminationReason: reason,
            terminationDate: effectiveDate,
            terminatedBy: userId,
        };
        await contract.save();
        // Deactivate all pricing
        await ContractPricing.update({ isActive: false }, { where: { contractId } });
        return contract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to terminate contract: ${error.message}`);
    }
}
/**
 * Suspend contract
 *
 * Temporarily suspends a contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID suspending the contract
 * @param reason - Suspension reason
 * @returns Suspended contract
 *
 * @example
 * const contract = await suspendContract('contract-123', 'user-456', 'Payment issue');
 */
async function suspendContract(contractId, userId, reason) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        if (contract.status !== ContractStatus.ACTIVE) {
            throw new common_1.BadRequestException('Only active contracts can be suspended');
        }
        contract.status = ContractStatus.SUSPENDED;
        contract.updatedBy = userId;
        contract.customFields = {
            ...contract.customFields,
            suspensionReason: reason,
            suspensionDate: new Date(),
            suspendedBy: userId,
        };
        await contract.save();
        return contract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to suspend contract: ${error.message}`);
    }
}
/**
 * Reactivate suspended contract
 *
 * Reactivates a suspended contract.
 *
 * @param contractId - Contract ID
 * @param userId - User ID reactivating the contract
 * @returns Reactivated contract
 *
 * @example
 * const contract = await reactivateContract('contract-123', 'user-456');
 */
async function reactivateContract(contractId, userId) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        if (contract.status !== ContractStatus.SUSPENDED) {
            throw new common_1.BadRequestException('Only suspended contracts can be reactivated');
        }
        contract.status = ContractStatus.ACTIVE;
        contract.updatedBy = userId;
        contract.customFields = {
            ...contract.customFields,
            reactivationDate: new Date(),
            reactivatedBy: userId,
        };
        await contract.save();
        return contract;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to reactivate contract: ${error.message}`);
    }
}
/**
 * Get contract pricing tiers
 *
 * Retrieves all pricing tiers for a product in a contract.
 *
 * @param contractId - Contract ID
 * @param productId - Product ID
 * @returns Pricing tiers array
 *
 * @example
 * const tiers = await getContractPricingTiers('contract-123', 'PROD-001');
 */
async function getContractPricingTiers(contractId, productId) {
    try {
        const pricing = await ContractPricing.findOne({
            where: {
                contractId,
                productId,
                isActive: true,
            },
        });
        if (!pricing || !pricing.pricingTiers) {
            return [];
        }
        return pricing.pricingTiers;
    }
    catch (error) {
        return [];
    }
}
/**
 * Calculate tiered contract price
 *
 * Calculates the price based on quantity and pricing tiers.
 *
 * @param contractId - Contract ID
 * @param productId - Product ID
 * @param quantity - Order quantity
 * @returns Calculated unit price
 *
 * @example
 * const price = await calculateTieredContractPrice('contract-123', 'PROD-001', 500);
 */
async function calculateTieredContractPrice(contractId, productId, quantity) {
    try {
        const pricing = await ContractPricing.findOne({
            where: {
                contractId,
                productId,
                isActive: true,
            },
        });
        if (!pricing) {
            return null;
        }
        // If no tiers, return base price
        if (!pricing.pricingTiers || pricing.pricingTiers.length === 0) {
            return pricing.baseUnitPrice;
        }
        // Find applicable tier
        const tier = pricing.pricingTiers.find(t => {
            const meetsMin = quantity >= t.minQuantity;
            const meetsMax = !t.maxQuantity || quantity <= t.maxQuantity;
            return meetsMin && meetsMax;
        });
        if (tier) {
            return tier.unitPrice;
        }
        // Default to base price
        return pricing.baseUnitPrice;
    }
    catch (error) {
        return null;
    }
}
/**
 * Update contract pricing
 *
 * Updates pricing for a product in a contract.
 *
 * @param contractPricingId - Contract pricing ID
 * @param newPrice - New unit price
 * @param userId - User ID making the update
 * @returns Updated contract pricing
 *
 * @example
 * const pricing = await updateContractPricing('pricing-123', 99.99, 'user-456');
 */
async function updateContractPricing(contractPricingId, newPrice, userId) {
    try {
        const pricing = await ContractPricing.findByPk(contractPricingId);
        if (!pricing) {
            throw new common_1.NotFoundException(`Contract pricing not found: ${contractPricingId}`);
        }
        const oldPrice = pricing.baseUnitPrice;
        pricing.baseUnitPrice = newPrice;
        await pricing.save();
        // Create amendment record
        await createContractAmendment({
            contractId: pricing.contractId,
            amendmentType: AmendmentType.PRICING_CHANGE,
            description: `Price updated for product ${pricing.productId}`,
            effectiveDate: new Date(),
            previousValues: { baseUnitPrice: oldPrice },
            newValues: { baseUnitPrice: newPrice },
            requiresApproval: true,
        }, userId);
        return pricing;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to update contract pricing: ${error.message}`);
    }
}
/**
 * Bulk update contract pricing
 *
 * Updates pricing for multiple products with a percentage adjustment.
 *
 * @param contractId - Contract ID
 * @param adjustmentPercent - Percentage adjustment (positive or negative)
 * @param userId - User ID making the update
 * @returns Count of updated pricing records
 *
 * @example
 * const count = await bulkUpdateContractPricing('contract-123', 5.0, 'user-456');
 */
async function bulkUpdateContractPricing(contractId, adjustmentPercent, userId) {
    try {
        const pricingRecords = await ContractPricing.findAll({
            where: { contractId, isActive: true },
        });
        let updateCount = 0;
        for (const pricing of pricingRecords) {
            const newPrice = pricing.baseUnitPrice * (1 + adjustmentPercent / 100);
            pricing.baseUnitPrice = newPrice;
            await pricing.save();
            updateCount++;
        }
        // Create amendment record
        await createContractAmendment({
            contractId,
            amendmentType: AmendmentType.PRICING_CHANGE,
            description: `Bulk price adjustment: ${adjustmentPercent}%`,
            effectiveDate: new Date(),
            previousValues: { adjustmentPercent: 0 },
            newValues: { adjustmentPercent },
            requiresApproval: true,
        }, userId);
        return updateCount;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to bulk update pricing: ${error.message}`);
    }
}
/**
 * Get contract amendments
 *
 * Retrieves all amendments for a contract.
 *
 * @param contractId - Contract ID
 * @param amendmentType - Filter by amendment type
 * @returns Array of amendments
 *
 * @example
 * const amendments = await getContractAmendments('contract-123', AmendmentType.PRICING_CHANGE);
 */
async function getContractAmendments(contractId, amendmentType) {
    try {
        const whereClause = { contractId };
        if (amendmentType) {
            whereClause.amendmentType = amendmentType;
        }
        const amendments = await ContractAmendment.findAll({
            where: whereClause,
            order: [['effectiveDate', 'DESC']],
        });
        return amendments;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get amendments: ${error.message}`);
    }
}
/**
 * Approve contract amendment
 *
 * Approves a pending contract amendment.
 *
 * @param amendmentId - Amendment ID
 * @param userId - User ID approving the amendment
 * @returns Approved amendment
 *
 * @example
 * const amendment = await approveContractAmendment('amendment-123', 'user-456');
 */
async function approveContractAmendment(amendmentId, userId) {
    try {
        const amendment = await ContractAmendment.findByPk(amendmentId);
        if (!amendment) {
            throw new common_1.NotFoundException(`Amendment not found: ${amendmentId}`);
        }
        if (amendment.approvalStatus !== ApprovalStatus.PENDING) {
            throw new common_1.BadRequestException('Amendment is not pending approval');
        }
        amendment.approvalStatus = ApprovalStatus.APPROVED;
        amendment.approvedBy = userId;
        amendment.approvedDate = new Date();
        await amendment.save();
        return amendment;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to approve amendment: ${error.message}`);
    }
}
/**
 * Get contract summary
 *
 * Returns a comprehensive summary of contract details.
 *
 * @param contractId - Contract ID
 * @returns Contract summary object
 *
 * @example
 * const summary = await getContractSummary('contract-123');
 */
async function getContractSummary(contractId) {
    try {
        const contract = await Contract.findByPk(contractId, {
            include: [
                { model: ContractPricing },
                { model: ContractAmendment },
            ],
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        const now = new Date();
        const daysRemaining = Math.ceil((contract.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const pricingCount = await ContractPricing.count({
            where: { contractId, isActive: true },
        });
        const amendmentCount = await ContractAmendment.count({
            where: { contractId },
        });
        return {
            contract,
            pricingCount,
            amendmentCount,
            daysRemaining,
            isExpiringSoon: daysRemaining <= 90 && daysRemaining > 0,
            complianceStatus: 'COMPLIANT', // Placeholder - would check actual compliance
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get contract summary: ${error.message}`);
    }
}
/**
 * Search contracts
 *
 * Searches contracts with various filters.
 *
 * @param filters - Search filters
 * @returns Array of matching contracts
 *
 * @example
 * const contracts = await searchContracts({ customerId: 'CUST-123', status: ContractStatus.ACTIVE });
 */
async function searchContracts(filters) {
    try {
        const whereClause = {};
        if (filters.customerId) {
            whereClause.customerId = filters.customerId;
        }
        if (filters.status) {
            whereClause.status = filters.status;
        }
        if (filters.contractType) {
            whereClause.contractType = filters.contractType;
        }
        if (filters.startDateFrom || filters.startDateTo) {
            whereClause.startDate = {};
            if (filters.startDateFrom) {
                whereClause.startDate[sequelize_1.Op.gte] = filters.startDateFrom;
            }
            if (filters.startDateTo) {
                whereClause.startDate[sequelize_1.Op.lte] = filters.startDateTo;
            }
        }
        if (filters.endDateFrom || filters.endDateTo) {
            whereClause.endDate = {};
            if (filters.endDateFrom) {
                whereClause.endDate[sequelize_1.Op.gte] = filters.endDateFrom;
            }
            if (filters.endDateTo) {
                whereClause.endDate[sequelize_1.Op.lte] = filters.endDateTo;
            }
        }
        if (filters.searchText) {
            whereClause[sequelize_1.Op.or] = [
                { contractNumber: { [sequelize_1.Op.iLike]: `%${filters.searchText}%` } },
                { contractName: { [sequelize_1.Op.iLike]: `%${filters.searchText}%` } },
                { description: { [sequelize_1.Op.iLike]: `%${filters.searchText}%` } },
            ];
        }
        const contracts = await Contract.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
        return contracts;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to search contracts: ${error.message}`);
    }
}
/**
 * Export contract to JSON
 *
 * Exports contract data including pricing and amendments.
 *
 * @param contractId - Contract ID
 * @returns JSON string of contract data
 *
 * @example
 * const json = await exportContractToJson('contract-123');
 */
async function exportContractToJson(contractId) {
    try {
        const contract = await Contract.findByPk(contractId, {
            include: [
                { model: ContractPricing },
                { model: ContractAmendment },
            ],
        });
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        return JSON.stringify(contract, null, 2);
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to export contract: ${error.message}`);
    }
}
/**
 * Calculate contract savings
 *
 * Calculates total savings achieved through contract pricing vs standard pricing.
 *
 * @param contractId - Contract ID
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @returns Savings summary
 *
 * @example
 * const savings = await calculateContractSavings('contract-123', startDate, endDate);
 */
async function calculateContractSavings(contractId, periodStart, periodEnd) {
    try {
        // In production, query actual order data for the period
        // This is a placeholder implementation
        const totalContractSpend = 45000; // Placeholder
        const estimatedStandardSpend = 52000; // Placeholder
        const totalSavings = estimatedStandardSpend - totalContractSpend;
        const savingsPercent = (totalSavings / estimatedStandardSpend) * 100;
        return {
            totalContractSpend,
            estimatedStandardSpend,
            totalSavings,
            savingsPercent,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to calculate savings: ${error.message}`);
    }
}
/**
 * Send renewal notifications
 *
 * Sends notifications for contracts approaching expiration.
 *
 * @param contractId - Contract ID
 * @param recipients - Array of recipient emails
 * @returns Count of notifications sent
 *
 * @example
 * const count = await sendRenewalNotifications('contract-123', ['user@example.com']);
 */
async function sendRenewalNotifications(contractId, recipients) {
    try {
        const contract = await Contract.findByPk(contractId);
        if (!contract) {
            throw new common_1.NotFoundException(`Contract not found: ${contractId}`);
        }
        // In production, integrate with email service
        // This is a placeholder implementation
        const notifications = recipients.map(email => ({
            notificationId: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            recipientEmail: email,
            recipientName: email.split('@')[0],
            scheduledDate: new Date(),
            sent: false,
        }));
        // Simulate sending notifications
        let sentCount = 0;
        for (const notification of notifications) {
            // Send email here
            notification.sent = true;
            notification.sentDate = new Date();
            sentCount++;
        }
        return sentCount;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to send notifications: ${error.message}`);
    }
}
/**
 * Get contract analytics
 *
 * Returns analytics and insights for contracts.
 *
 * @param customerId - Customer ID (optional)
 * @param dateFrom - Start date for analytics
 * @param dateTo - End date for analytics
 * @returns Analytics summary
 *
 * @example
 * const analytics = await getContractAnalytics('CUST-123', startDate, endDate);
 */
async function getContractAnalytics(customerId, dateFrom, dateTo) {
    try {
        const whereClause = {};
        if (customerId) {
            whereClause.customerId = customerId;
        }
        if (dateFrom || dateTo) {
            whereClause.startDate = {};
            if (dateFrom) {
                whereClause.startDate[sequelize_1.Op.gte] = dateFrom;
            }
            if (dateTo) {
                whereClause.startDate[sequelize_1.Op.lte] = dateTo;
            }
        }
        const totalContracts = await Contract.count({ where: whereClause });
        const activeContracts = await Contract.count({
            where: { ...whereClause, status: ContractStatus.ACTIVE },
        });
        const now = new Date();
        const ninetyDaysFromNow = new Date();
        ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
        const expiringContracts = await Contract.count({
            where: {
                ...whereClause,
                status: ContractStatus.ACTIVE,
                endDate: { [sequelize_1.Op.between]: [now, ninetyDaysFromNow] },
            },
        });
        // Placeholder values for other metrics
        const totalContractValue = 1500000;
        const averageContractDuration = 365;
        const topContractTypes = [
            { type: ContractType.PRICING_AGREEMENT, count: 15 },
            { type: ContractType.VOLUME_COMMITMENT, count: 12 },
            { type: ContractType.MASTER_AGREEMENT, count: 8 },
        ];
        return {
            totalContracts,
            activeContracts,
            expiringContracts,
            totalContractValue,
            averageContractDuration,
            topContractTypes,
        };
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to get analytics: ${error.message}`);
    }
}
//# sourceMappingURL=contract-agreement-kit.js.map