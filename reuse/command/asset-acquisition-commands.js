"use strict";
/**
 * ASSET ACQUISITION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset procurement and acquisition management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Purchase requisition and approval workflows
 * - Vendor selection and RFQ/RFP processing
 * - Purchase order creation and management
 * - Contract lifecycle management
 * - Budget validation and tracking
 * - Asset receiving and inspection
 * - Asset tagging and registration
 * - Procurement analytics and reporting
 * - Multi-level approval routing
 * - Supplier performance tracking
 *
 * @module AssetAcquisitionCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createPurchaseRequisition,
 *   createRFQ,
 *   createPurchaseOrder,
 *   receiveAsset,
 *   PurchaseRequisition,
 *   ApprovalStatus
 * } from './asset-acquisition-commands';
 *
 * // Create purchase requisition
 * const requisition = await createPurchaseRequisition({
 *   requestorId: 'user-123',
 *   departmentId: 'dept-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell-xps',
 *     quantity: 10,
 *     estimatedUnitCost: 1500,
 *     justification: 'New employee onboarding'
 *   }],
 *   priority: PriorityLevel.HIGH
 * });
 *
 * // Create RFQ for vendor quotes
 * const rfq = await createRFQ({
 *   requisitionId: requisition.id,
 *   vendorIds: ['vendor-1', 'vendor-2', 'vendor-3'],
 *   responseDeadline: new Date('2024-06-01')
 * });
 * ```
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
exports.ApprovalWorkflow = exports.Budget = exports.Contract = exports.AssetInspection = exports.AssetReceiving = exports.PurchaseOrder = exports.VendorQuote = exports.RFQ = exports.PurchaseRequisition = exports.Vendor = exports.PaymentTerms = exports.BudgetStatus = exports.VendorRating = exports.InspectionResult = exports.ReceivingStatus = exports.ContractStatus = exports.ContractType = exports.PriorityLevel = exports.RFQStatus = exports.PurchaseOrderStatus = exports.ApprovalStatus = void 0;
exports.createPurchaseRequisition = createPurchaseRequisition;
exports.submitRequisitionForApproval = submitRequisitionForApproval;
exports.approvePurchaseRequisition = approvePurchaseRequisition;
exports.rejectPurchaseRequisition = rejectPurchaseRequisition;
exports.getRequisitionsByStatus = getRequisitionsByStatus;
exports.getRequisitionsByDepartment = getRequisitionsByDepartment;
exports.updatePurchaseRequisition = updatePurchaseRequisition;
exports.cancelPurchaseRequisition = cancelPurchaseRequisition;
exports.createRFQ = createRFQ;
exports.publishRFQ = publishRFQ;
exports.submitVendorQuote = submitVendorQuote;
exports.evaluateVendorQuotes = evaluateVendorQuotes;
exports.awardRFQ = awardRFQ;
exports.getQuotesForRFQ = getQuotesForRFQ;
exports.createPurchaseOrder = createPurchaseOrder;
exports.approvePurchaseOrder = approvePurchaseOrder;
exports.issuePurchaseOrder = issuePurchaseOrder;
exports.getPurchaseOrdersByStatus = getPurchaseOrdersByStatus;
exports.getPurchaseOrdersByVendor = getPurchaseOrdersByVendor;
exports.updatePurchaseOrder = updatePurchaseOrder;
exports.cancelPurchaseOrder = cancelPurchaseOrder;
exports.receiveAssets = receiveAssets;
exports.inspectReceivedAssets = inspectReceivedAssets;
exports.getReceivingsForPO = getReceivingsForPO;
exports.getInspectionsForReceiving = getInspectionsForReceiving;
exports.createContract = createContract;
exports.activateContract = activateContract;
exports.renewContract = renewContract;
exports.getExpiringContracts = getExpiringContracts;
exports.getContractsByVendor = getContractsByVendor;
exports.createBudgetAllocation = createBudgetAllocation;
exports.validateBudgetAvailability = validateBudgetAvailability;
exports.reserveBudget = reserveBudget;
exports.commitBudget = commitBudget;
exports.recordBudgetSpend = recordBudgetSpend;
exports.getBudgetsByDepartment = getBudgetsByDepartment;
exports.createVendor = createVendor;
exports.updateVendorRating = updateVendorRating;
exports.updateVendorPerformance = updateVendorPerformance;
exports.getPreferredVendors = getPreferredVendors;
exports.getVendorsByRating = getVendorsByRating;
exports.createApprovalWorkflow = createApprovalWorkflow;
exports.processApprovalAction = processApprovalAction;
exports.getPendingApprovalsForUser = getPendingApprovalsForUser;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Requisition approval status
 */
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["DRAFT"] = "draft";
    ApprovalStatus["PENDING"] = "pending";
    ApprovalStatus["APPROVED"] = "approved";
    ApprovalStatus["REJECTED"] = "rejected";
    ApprovalStatus["CANCELLED"] = "cancelled";
    ApprovalStatus["ON_HOLD"] = "on_hold";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
/**
 * Purchase order status
 */
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "draft";
    PurchaseOrderStatus["PENDING_APPROVAL"] = "pending_approval";
    PurchaseOrderStatus["APPROVED"] = "approved";
    PurchaseOrderStatus["ISSUED"] = "issued";
    PurchaseOrderStatus["PARTIALLY_RECEIVED"] = "partially_received";
    PurchaseOrderStatus["FULLY_RECEIVED"] = "fully_received";
    PurchaseOrderStatus["CLOSED"] = "closed";
    PurchaseOrderStatus["CANCELLED"] = "cancelled";
})(PurchaseOrderStatus || (exports.PurchaseOrderStatus = PurchaseOrderStatus = {}));
/**
 * RFQ/RFP status
 */
var RFQStatus;
(function (RFQStatus) {
    RFQStatus["DRAFT"] = "draft";
    RFQStatus["PUBLISHED"] = "published";
    RFQStatus["IN_REVIEW"] = "in_review";
    RFQStatus["AWARDED"] = "awarded";
    RFQStatus["CANCELLED"] = "cancelled";
    RFQStatus["EXPIRED"] = "expired";
})(RFQStatus || (exports.RFQStatus = RFQStatus = {}));
/**
 * Priority levels
 */
var PriorityLevel;
(function (PriorityLevel) {
    PriorityLevel["CRITICAL"] = "critical";
    PriorityLevel["HIGH"] = "high";
    PriorityLevel["MEDIUM"] = "medium";
    PriorityLevel["LOW"] = "low";
})(PriorityLevel || (exports.PriorityLevel = PriorityLevel = {}));
/**
 * Contract types
 */
var ContractType;
(function (ContractType) {
    ContractType["PURCHASE_AGREEMENT"] = "purchase_agreement";
    ContractType["BLANKET_ORDER"] = "blanket_order";
    ContractType["SERVICE_CONTRACT"] = "service_contract";
    ContractType["LEASE_AGREEMENT"] = "lease_agreement";
    ContractType["MAINTENANCE_CONTRACT"] = "maintenance_contract";
    ContractType["FRAMEWORK_AGREEMENT"] = "framework_agreement";
})(ContractType || (exports.ContractType = ContractType = {}));
/**
 * Contract status
 */
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["UNDER_REVIEW"] = "under_review";
    ContractStatus["ACTIVE"] = "active";
    ContractStatus["EXPIRED"] = "expired";
    ContractStatus["TERMINATED"] = "terminated";
    ContractStatus["RENEWED"] = "renewed";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
/**
 * Receiving status
 */
var ReceivingStatus;
(function (ReceivingStatus) {
    ReceivingStatus["PENDING"] = "pending";
    ReceivingStatus["IN_INSPECTION"] = "in_inspection";
    ReceivingStatus["ACCEPTED"] = "accepted";
    ReceivingStatus["REJECTED"] = "rejected";
    ReceivingStatus["PARTIALLY_ACCEPTED"] = "partially_accepted";
})(ReceivingStatus || (exports.ReceivingStatus = ReceivingStatus = {}));
/**
 * Inspection result
 */
var InspectionResult;
(function (InspectionResult) {
    InspectionResult["PASSED"] = "passed";
    InspectionResult["FAILED"] = "failed";
    InspectionResult["CONDITIONAL"] = "conditional";
    InspectionResult["REQUIRES_REWORK"] = "requires_rework";
})(InspectionResult || (exports.InspectionResult = InspectionResult = {}));
/**
 * Vendor rating
 */
var VendorRating;
(function (VendorRating) {
    VendorRating["EXCELLENT"] = "excellent";
    VendorRating["GOOD"] = "good";
    VendorRating["AVERAGE"] = "average";
    VendorRating["POOR"] = "poor";
    VendorRating["UNRATED"] = "unrated";
})(VendorRating || (exports.VendorRating = VendorRating = {}));
/**
 * Budget status
 */
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["AVAILABLE"] = "available";
    BudgetStatus["RESERVED"] = "reserved";
    BudgetStatus["COMMITTED"] = "committed";
    BudgetStatus["SPENT"] = "spent";
    BudgetStatus["EXCEEDED"] = "exceeded";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
/**
 * Payment terms
 */
var PaymentTerms;
(function (PaymentTerms) {
    PaymentTerms["NET_30"] = "net_30";
    PaymentTerms["NET_60"] = "net_60";
    PaymentTerms["NET_90"] = "net_90";
    PaymentTerms["IMMEDIATE"] = "immediate";
    PaymentTerms["ON_DELIVERY"] = "on_delivery";
    PaymentTerms["MILESTONE_BASED"] = "milestone_based";
})(PaymentTerms || (exports.PaymentTerms = PaymentTerms = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Vendor Model - Supplier management
 */
let Vendor = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'vendors',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['vendor_code'], unique: true },
                { fields: ['rating'] },
                { fields: ['is_active'] },
                { fields: ['is_preferred'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _vendorCode_decorators;
    let _vendorCode_initializers = [];
    let _vendorCode_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _legalName_decorators;
    let _legalName_initializers = [];
    let _legalName_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _phone_decorators;
    let _phone_initializers = [];
    let _phone_extraInitializers = [];
    let _website_decorators;
    let _website_initializers = [];
    let _website_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _defaultPaymentTerms_decorators;
    let _defaultPaymentTerms_initializers = [];
    let _defaultPaymentTerms_extraInitializers = [];
    let _creditLimit_decorators;
    let _creditLimit_initializers = [];
    let _creditLimit_extraInitializers = [];
    let _isPreferred_decorators;
    let _isPreferred_initializers = [];
    let _isPreferred_extraInitializers = [];
    let _isActive_decorators;
    let _isActive_initializers = [];
    let _isActive_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _performanceMetrics_decorators;
    let _performanceMetrics_initializers = [];
    let _performanceMetrics_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _requisitions_decorators;
    let _requisitions_initializers = [];
    let _requisitions_extraInitializers = [];
    let _purchaseOrders_decorators;
    let _purchaseOrders_initializers = [];
    let _purchaseOrders_extraInitializers = [];
    let _contracts_decorators;
    let _contracts_initializers = [];
    let _contracts_extraInitializers = [];
    var Vendor = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vendorCode = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vendorCode_initializers, void 0));
            this.name = (__runInitializers(this, _vendorCode_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.legalName = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _legalName_initializers, void 0));
            this.taxId = (__runInitializers(this, _legalName_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
            this.email = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
            this.website = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _website_initializers, void 0));
            this.address = (__runInitializers(this, _website_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.rating = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.defaultPaymentTerms = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _defaultPaymentTerms_initializers, void 0));
            this.creditLimit = (__runInitializers(this, _defaultPaymentTerms_extraInitializers), __runInitializers(this, _creditLimit_initializers, void 0));
            this.isPreferred = (__runInitializers(this, _creditLimit_extraInitializers), __runInitializers(this, _isPreferred_initializers, void 0));
            this.isActive = (__runInitializers(this, _isPreferred_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.certifications = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.performanceMetrics = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _performanceMetrics_initializers, void 0));
            this.metadata = (__runInitializers(this, _performanceMetrics_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.requisitions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _requisitions_initializers, void 0));
            this.purchaseOrders = (__runInitializers(this, _requisitions_extraInitializers), __runInitializers(this, _purchaseOrders_initializers, void 0));
            this.contracts = (__runInitializers(this, _purchaseOrders_extraInitializers), __runInitializers(this, _contracts_initializers, void 0));
            __runInitializers(this, _contracts_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Vendor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _vendorCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false, unique: true }), sequelize_typescript_1.Index];
        _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _legalName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Legal entity name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _taxId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax identification number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _email_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact email' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _phone_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contact phone' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50) })];
        _website_decorators = [(0, swagger_1.ApiProperty)({ description: 'Website' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _address_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primary address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _rating_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor rating' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(VendorRating)), defaultValue: VendorRating.UNRATED }), sequelize_typescript_1.Index];
        _defaultPaymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentTerms)) })];
        _creditLimit_decorators = [(0, swagger_1.ApiProperty)({ description: 'Credit limit' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _isPreferred_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether vendor is preferred' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false }), sequelize_typescript_1.Index];
        _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Whether vendor is active' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true }), sequelize_typescript_1.Index];
        _certifications_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certifications' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _performanceMetrics_decorators = [(0, swagger_1.ApiProperty)({ description: 'Performance metrics' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _requisitions_decorators = [(0, sequelize_typescript_1.HasMany)(() => PurchaseRequisition)];
        _purchaseOrders_decorators = [(0, sequelize_typescript_1.HasMany)(() => PurchaseOrder)];
        _contracts_decorators = [(0, sequelize_typescript_1.HasMany)(() => Contract)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vendorCode_decorators, { kind: "field", name: "vendorCode", static: false, private: false, access: { has: obj => "vendorCode" in obj, get: obj => obj.vendorCode, set: (obj, value) => { obj.vendorCode = value; } }, metadata: _metadata }, _vendorCode_initializers, _vendorCode_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _legalName_decorators, { kind: "field", name: "legalName", static: false, private: false, access: { has: obj => "legalName" in obj, get: obj => obj.legalName, set: (obj, value) => { obj.legalName = value; } }, metadata: _metadata }, _legalName_initializers, _legalName_extraInitializers);
        __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: obj => "phone" in obj, get: obj => obj.phone, set: (obj, value) => { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
        __esDecorate(null, null, _website_decorators, { kind: "field", name: "website", static: false, private: false, access: { has: obj => "website" in obj, get: obj => obj.website, set: (obj, value) => { obj.website = value; } }, metadata: _metadata }, _website_initializers, _website_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _defaultPaymentTerms_decorators, { kind: "field", name: "defaultPaymentTerms", static: false, private: false, access: { has: obj => "defaultPaymentTerms" in obj, get: obj => obj.defaultPaymentTerms, set: (obj, value) => { obj.defaultPaymentTerms = value; } }, metadata: _metadata }, _defaultPaymentTerms_initializers, _defaultPaymentTerms_extraInitializers);
        __esDecorate(null, null, _creditLimit_decorators, { kind: "field", name: "creditLimit", static: false, private: false, access: { has: obj => "creditLimit" in obj, get: obj => obj.creditLimit, set: (obj, value) => { obj.creditLimit = value; } }, metadata: _metadata }, _creditLimit_initializers, _creditLimit_extraInitializers);
        __esDecorate(null, null, _isPreferred_decorators, { kind: "field", name: "isPreferred", static: false, private: false, access: { has: obj => "isPreferred" in obj, get: obj => obj.isPreferred, set: (obj, value) => { obj.isPreferred = value; } }, metadata: _metadata }, _isPreferred_initializers, _isPreferred_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: obj => "isActive" in obj, get: obj => obj.isActive, set: (obj, value) => { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _performanceMetrics_decorators, { kind: "field", name: "performanceMetrics", static: false, private: false, access: { has: obj => "performanceMetrics" in obj, get: obj => obj.performanceMetrics, set: (obj, value) => { obj.performanceMetrics = value; } }, metadata: _metadata }, _performanceMetrics_initializers, _performanceMetrics_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _requisitions_decorators, { kind: "field", name: "requisitions", static: false, private: false, access: { has: obj => "requisitions" in obj, get: obj => obj.requisitions, set: (obj, value) => { obj.requisitions = value; } }, metadata: _metadata }, _requisitions_initializers, _requisitions_extraInitializers);
        __esDecorate(null, null, _purchaseOrders_decorators, { kind: "field", name: "purchaseOrders", static: false, private: false, access: { has: obj => "purchaseOrders" in obj, get: obj => obj.purchaseOrders, set: (obj, value) => { obj.purchaseOrders = value; } }, metadata: _metadata }, _purchaseOrders_initializers, _purchaseOrders_extraInitializers);
        __esDecorate(null, null, _contracts_decorators, { kind: "field", name: "contracts", static: false, private: false, access: { has: obj => "contracts" in obj, get: obj => obj.contracts, set: (obj, value) => { obj.contracts = value; } }, metadata: _metadata }, _contracts_initializers, _contracts_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Vendor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Vendor = _classThis;
})();
exports.Vendor = Vendor;
/**
 * Purchase Requisition Model - Purchase requests
 */
let PurchaseRequisition = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'purchase_requisitions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['requisition_number'], unique: true },
                { fields: ['requestor_id'] },
                { fields: ['department_id'] },
                { fields: ['status'] },
                { fields: ['priority'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateRequisitionNumber_decorators;
    let _static_calculateTotalCost_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _requisitionNumber_decorators;
    let _requisitionNumber_initializers = [];
    let _requisitionNumber_extraInitializers = [];
    let _requestorId_decorators;
    let _requestorId_initializers = [];
    let _requestorId_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _budgetId_decorators;
    let _budgetId_initializers = [];
    let _budgetId_extraInitializers = [];
    let _projectId_decorators;
    let _projectId_initializers = [];
    let _projectId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
    let _justification_decorators;
    let _justification_initializers = [];
    let _justification_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _totalEstimatedCost_decorators;
    let _totalEstimatedCost_initializers = [];
    let _totalEstimatedCost_extraInitializers = [];
    let _expectedDeliveryDate_decorators;
    let _expectedDeliveryDate_initializers = [];
    let _expectedDeliveryDate_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _rejectionReason_decorators;
    let _rejectionReason_initializers = [];
    let _rejectionReason_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _rfqs_decorators;
    let _rfqs_initializers = [];
    let _rfqs_extraInitializers = [];
    let _purchaseOrders_decorators;
    let _purchaseOrders_initializers = [];
    let _purchaseOrders_extraInitializers = [];
    var PurchaseRequisition = _classThis = class extends _classSuper {
        static async generateRequisitionNumber(instance) {
            if (!instance.requisitionNumber) {
                const count = await PurchaseRequisition.count();
                const year = new Date().getFullYear();
                instance.requisitionNumber = `PR-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        static calculateTotalCost(instance) {
            if (instance.items && instance.items.length > 0) {
                instance.totalEstimatedCost = instance.items.reduce((sum, item) => sum + item.quantity * item.estimatedUnitCost, 0);
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requisitionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requisitionNumber_initializers, void 0));
            this.requestorId = (__runInitializers(this, _requisitionNumber_extraInitializers), __runInitializers(this, _requestorId_initializers, void 0));
            this.departmentId = (__runInitializers(this, _requestorId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.budgetId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _budgetId_initializers, void 0));
            this.projectId = (__runInitializers(this, _budgetId_extraInitializers), __runInitializers(this, _projectId_initializers, void 0));
            this.status = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.justification = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _justification_initializers, void 0));
            this.items = (__runInitializers(this, _justification_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            this.totalEstimatedCost = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _totalEstimatedCost_initializers, void 0));
            this.expectedDeliveryDate = (__runInitializers(this, _totalEstimatedCost_extraInitializers), __runInitializers(this, _expectedDeliveryDate_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _expectedDeliveryDate_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.rejectionReason = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _rejectionReason_initializers, void 0));
            this.notes = (__runInitializers(this, _rejectionReason_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.createdAt = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.rfqs = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _rfqs_initializers, void 0));
            this.purchaseOrders = (__runInitializers(this, _rfqs_extraInitializers), __runInitializers(this, _purchaseOrders_initializers, void 0));
            __runInitializers(this, _purchaseOrders_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PurchaseRequisition");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _requisitionNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requisition number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _requestorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requestor user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _budgetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _projectId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Project ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApprovalStatus)), defaultValue: ApprovalStatus.DRAFT }), sequelize_typescript_1.Index];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PriorityLevel)), defaultValue: PriorityLevel.MEDIUM }), sequelize_typescript_1.Index];
        _justification_decorators = [(0, swagger_1.ApiProperty)({ description: 'Justification' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requisition items' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _totalEstimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total estimated cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _expectedDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected delivery date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _approvalDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _rejectionReason_decorators = [(0, swagger_1.ApiProperty)({ description: 'Rejection reason' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _rfqs_decorators = [(0, sequelize_typescript_1.HasMany)(() => RFQ)];
        _purchaseOrders_decorators = [(0, sequelize_typescript_1.HasMany)(() => PurchaseOrder)];
        _static_generateRequisitionNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        _static_calculateTotalCost_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateRequisitionNumber_decorators, { kind: "method", name: "generateRequisitionNumber", static: true, private: false, access: { has: obj => "generateRequisitionNumber" in obj, get: obj => obj.generateRequisitionNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_calculateTotalCost_decorators, { kind: "method", name: "calculateTotalCost", static: true, private: false, access: { has: obj => "calculateTotalCost" in obj, get: obj => obj.calculateTotalCost }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requisitionNumber_decorators, { kind: "field", name: "requisitionNumber", static: false, private: false, access: { has: obj => "requisitionNumber" in obj, get: obj => obj.requisitionNumber, set: (obj, value) => { obj.requisitionNumber = value; } }, metadata: _metadata }, _requisitionNumber_initializers, _requisitionNumber_extraInitializers);
        __esDecorate(null, null, _requestorId_decorators, { kind: "field", name: "requestorId", static: false, private: false, access: { has: obj => "requestorId" in obj, get: obj => obj.requestorId, set: (obj, value) => { obj.requestorId = value; } }, metadata: _metadata }, _requestorId_initializers, _requestorId_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _budgetId_decorators, { kind: "field", name: "budgetId", static: false, private: false, access: { has: obj => "budgetId" in obj, get: obj => obj.budgetId, set: (obj, value) => { obj.budgetId = value; } }, metadata: _metadata }, _budgetId_initializers, _budgetId_extraInitializers);
        __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: obj => "projectId" in obj, get: obj => obj.projectId, set: (obj, value) => { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _justification_decorators, { kind: "field", name: "justification", static: false, private: false, access: { has: obj => "justification" in obj, get: obj => obj.justification, set: (obj, value) => { obj.justification = value; } }, metadata: _metadata }, _justification_initializers, _justification_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, null, _totalEstimatedCost_decorators, { kind: "field", name: "totalEstimatedCost", static: false, private: false, access: { has: obj => "totalEstimatedCost" in obj, get: obj => obj.totalEstimatedCost, set: (obj, value) => { obj.totalEstimatedCost = value; } }, metadata: _metadata }, _totalEstimatedCost_initializers, _totalEstimatedCost_extraInitializers);
        __esDecorate(null, null, _expectedDeliveryDate_decorators, { kind: "field", name: "expectedDeliveryDate", static: false, private: false, access: { has: obj => "expectedDeliveryDate" in obj, get: obj => obj.expectedDeliveryDate, set: (obj, value) => { obj.expectedDeliveryDate = value; } }, metadata: _metadata }, _expectedDeliveryDate_initializers, _expectedDeliveryDate_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: obj => "rejectionReason" in obj, get: obj => obj.rejectionReason, set: (obj, value) => { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _rfqs_decorators, { kind: "field", name: "rfqs", static: false, private: false, access: { has: obj => "rfqs" in obj, get: obj => obj.rfqs, set: (obj, value) => { obj.rfqs = value; } }, metadata: _metadata }, _rfqs_initializers, _rfqs_extraInitializers);
        __esDecorate(null, null, _purchaseOrders_decorators, { kind: "field", name: "purchaseOrders", static: false, private: false, access: { has: obj => "purchaseOrders" in obj, get: obj => obj.purchaseOrders, set: (obj, value) => { obj.purchaseOrders = value; } }, metadata: _metadata }, _purchaseOrders_initializers, _purchaseOrders_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PurchaseRequisition = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PurchaseRequisition = _classThis;
})();
exports.PurchaseRequisition = PurchaseRequisition;
/**
 * RFQ Model - Request for Quotation
 */
let RFQ = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'rfqs',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['rfq_number'], unique: true },
                { fields: ['requisition_id'] },
                { fields: ['status'] },
                { fields: ['response_deadline'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateRFQNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _rfqNumber_decorators;
    let _rfqNumber_initializers = [];
    let _rfqNumber_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _vendorIds_decorators;
    let _vendorIds_initializers = [];
    let _vendorIds_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _responseDeadline_decorators;
    let _responseDeadline_initializers = [];
    let _responseDeadline_extraInitializers = [];
    let _evaluationCriteria_decorators;
    let _evaluationCriteria_initializers = [];
    let _evaluationCriteria_extraInitializers = [];
    let _termsAndConditions_decorators;
    let _termsAndConditions_initializers = [];
    let _termsAndConditions_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _publishedDate_decorators;
    let _publishedDate_initializers = [];
    let _publishedDate_extraInitializers = [];
    let _awardedVendorId_decorators;
    let _awardedVendorId_initializers = [];
    let _awardedVendorId_extraInitializers = [];
    let _awardDate_decorators;
    let _awardDate_initializers = [];
    let _awardDate_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _requisition_decorators;
    let _requisition_initializers = [];
    let _requisition_extraInitializers = [];
    let _quotes_decorators;
    let _quotes_initializers = [];
    let _quotes_extraInitializers = [];
    var RFQ = _classThis = class extends _classSuper {
        static async generateRFQNumber(instance) {
            if (!instance.rfqNumber) {
                const count = await RFQ.count();
                const year = new Date().getFullYear();
                instance.rfqNumber = `RFQ-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.rfqNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _rfqNumber_initializers, void 0));
            this.requisitionId = (__runInitializers(this, _rfqNumber_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.title = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.vendorIds = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _vendorIds_initializers, void 0));
            this.items = (__runInitializers(this, _vendorIds_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            this.responseDeadline = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _responseDeadline_initializers, void 0));
            this.evaluationCriteria = (__runInitializers(this, _responseDeadline_extraInitializers), __runInitializers(this, _evaluationCriteria_initializers, void 0));
            this.termsAndConditions = (__runInitializers(this, _evaluationCriteria_extraInitializers), __runInitializers(this, _termsAndConditions_initializers, void 0));
            this.attachments = (__runInitializers(this, _termsAndConditions_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.publishedDate = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _publishedDate_initializers, void 0));
            this.awardedVendorId = (__runInitializers(this, _publishedDate_extraInitializers), __runInitializers(this, _awardedVendorId_initializers, void 0));
            this.awardDate = (__runInitializers(this, _awardedVendorId_extraInitializers), __runInitializers(this, _awardDate_initializers, void 0));
            this.createdAt = (__runInitializers(this, _awardDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.requisition = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _requisition_initializers, void 0));
            this.quotes = (__runInitializers(this, _requisition_extraInitializers), __runInitializers(this, _quotes_initializers, void 0));
            __runInitializers(this, _quotes_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RFQ");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _rfqNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'RFQ number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _requisitionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requisition ID' }), (0, sequelize_typescript_1.ForeignKey)(() => PurchaseRequisition), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(RFQStatus)), defaultValue: RFQStatus.DRAFT }), sequelize_typescript_1.Index];
        _vendorIds_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor IDs invited' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID), allowNull: false })];
        _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'RFQ items' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _responseDeadline_decorators = [(0, swagger_1.ApiProperty)({ description: 'Response deadline' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _evaluationCriteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation criteria' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _termsAndConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terms and conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _publishedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Published date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _awardedVendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Awarded vendor ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _awardDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Award date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _requisition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PurchaseRequisition)];
        _quotes_decorators = [(0, sequelize_typescript_1.HasMany)(() => VendorQuote)];
        _static_generateRFQNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateRFQNumber_decorators, { kind: "method", name: "generateRFQNumber", static: true, private: false, access: { has: obj => "generateRFQNumber" in obj, get: obj => obj.generateRFQNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _rfqNumber_decorators, { kind: "field", name: "rfqNumber", static: false, private: false, access: { has: obj => "rfqNumber" in obj, get: obj => obj.rfqNumber, set: (obj, value) => { obj.rfqNumber = value; } }, metadata: _metadata }, _rfqNumber_initializers, _rfqNumber_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _vendorIds_decorators, { kind: "field", name: "vendorIds", static: false, private: false, access: { has: obj => "vendorIds" in obj, get: obj => obj.vendorIds, set: (obj, value) => { obj.vendorIds = value; } }, metadata: _metadata }, _vendorIds_initializers, _vendorIds_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, null, _responseDeadline_decorators, { kind: "field", name: "responseDeadline", static: false, private: false, access: { has: obj => "responseDeadline" in obj, get: obj => obj.responseDeadline, set: (obj, value) => { obj.responseDeadline = value; } }, metadata: _metadata }, _responseDeadline_initializers, _responseDeadline_extraInitializers);
        __esDecorate(null, null, _evaluationCriteria_decorators, { kind: "field", name: "evaluationCriteria", static: false, private: false, access: { has: obj => "evaluationCriteria" in obj, get: obj => obj.evaluationCriteria, set: (obj, value) => { obj.evaluationCriteria = value; } }, metadata: _metadata }, _evaluationCriteria_initializers, _evaluationCriteria_extraInitializers);
        __esDecorate(null, null, _termsAndConditions_decorators, { kind: "field", name: "termsAndConditions", static: false, private: false, access: { has: obj => "termsAndConditions" in obj, get: obj => obj.termsAndConditions, set: (obj, value) => { obj.termsAndConditions = value; } }, metadata: _metadata }, _termsAndConditions_initializers, _termsAndConditions_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _publishedDate_decorators, { kind: "field", name: "publishedDate", static: false, private: false, access: { has: obj => "publishedDate" in obj, get: obj => obj.publishedDate, set: (obj, value) => { obj.publishedDate = value; } }, metadata: _metadata }, _publishedDate_initializers, _publishedDate_extraInitializers);
        __esDecorate(null, null, _awardedVendorId_decorators, { kind: "field", name: "awardedVendorId", static: false, private: false, access: { has: obj => "awardedVendorId" in obj, get: obj => obj.awardedVendorId, set: (obj, value) => { obj.awardedVendorId = value; } }, metadata: _metadata }, _awardedVendorId_initializers, _awardedVendorId_extraInitializers);
        __esDecorate(null, null, _awardDate_decorators, { kind: "field", name: "awardDate", static: false, private: false, access: { has: obj => "awardDate" in obj, get: obj => obj.awardDate, set: (obj, value) => { obj.awardDate = value; } }, metadata: _metadata }, _awardDate_initializers, _awardDate_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _requisition_decorators, { kind: "field", name: "requisition", static: false, private: false, access: { has: obj => "requisition" in obj, get: obj => obj.requisition, set: (obj, value) => { obj.requisition = value; } }, metadata: _metadata }, _requisition_initializers, _requisition_extraInitializers);
        __esDecorate(null, null, _quotes_decorators, { kind: "field", name: "quotes", static: false, private: false, access: { has: obj => "quotes" in obj, get: obj => obj.quotes, set: (obj, value) => { obj.quotes = value; } }, metadata: _metadata }, _quotes_initializers, _quotes_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RFQ = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RFQ = _classThis;
})();
exports.RFQ = RFQ;
/**
 * Vendor Quote Model - Vendor responses to RFQs
 */
let VendorQuote = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'vendor_quotes',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['quote_number'], unique: true },
                { fields: ['rfq_id'] },
                { fields: ['vendor_id'] },
                { fields: ['valid_until'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateQuoteNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _quoteNumber_decorators;
    let _quoteNumber_initializers = [];
    let _quoteNumber_extraInitializers = [];
    let _rfqId_decorators;
    let _rfqId_initializers = [];
    let _rfqId_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _validUntil_decorators;
    let _validUntil_initializers = [];
    let _validUntil_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _deliveryTimeframe_decorators;
    let _deliveryTimeframe_initializers = [];
    let _deliveryTimeframe_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _evaluationScore_decorators;
    let _evaluationScore_initializers = [];
    let _evaluationScore_extraInitializers = [];
    let _isSelected_decorators;
    let _isSelected_initializers = [];
    let _isSelected_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _rfq_decorators;
    let _rfq_initializers = [];
    let _rfq_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    var VendorQuote = _classThis = class extends _classSuper {
        static async generateQuoteNumber(instance) {
            if (!instance.quoteNumber) {
                const count = await VendorQuote.count();
                const year = new Date().getFullYear();
                instance.quoteNumber = `QT-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.quoteNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _quoteNumber_initializers, void 0));
            this.rfqId = (__runInitializers(this, _quoteNumber_extraInitializers), __runInitializers(this, _rfqId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _rfqId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.items = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.validUntil = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _validUntil_initializers, void 0));
            this.paymentTerms = (__runInitializers(this, _validUntil_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
            this.deliveryTimeframe = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _deliveryTimeframe_initializers, void 0));
            this.notes = (__runInitializers(this, _deliveryTimeframe_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.attachments = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.evaluationScore = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _evaluationScore_initializers, void 0));
            this.isSelected = (__runInitializers(this, _evaluationScore_extraInitializers), __runInitializers(this, _isSelected_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isSelected_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.rfq = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _rfq_initializers, void 0));
            this.vendor = (__runInitializers(this, _rfq_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            __runInitializers(this, _vendor_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VendorQuote");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _quoteNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quote number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _rfqId_decorators = [(0, swagger_1.ApiProperty)({ description: 'RFQ ID' }), (0, sequelize_typescript_1.ForeignKey)(() => RFQ), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Vendor), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quote items' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _validUntil_decorators = [(0, swagger_1.ApiProperty)({ description: 'Valid until date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentTerms)), allowNull: false })];
        _deliveryTimeframe_decorators = [(0, swagger_1.ApiProperty)({ description: 'Delivery timeframe' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _evaluationScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evaluation score' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _isSelected_decorators = [(0, swagger_1.ApiProperty)({ description: 'Is selected' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _rfq_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => RFQ)];
        _vendor_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Vendor)];
        _static_generateQuoteNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateQuoteNumber_decorators, { kind: "method", name: "generateQuoteNumber", static: true, private: false, access: { has: obj => "generateQuoteNumber" in obj, get: obj => obj.generateQuoteNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _quoteNumber_decorators, { kind: "field", name: "quoteNumber", static: false, private: false, access: { has: obj => "quoteNumber" in obj, get: obj => obj.quoteNumber, set: (obj, value) => { obj.quoteNumber = value; } }, metadata: _metadata }, _quoteNumber_initializers, _quoteNumber_extraInitializers);
        __esDecorate(null, null, _rfqId_decorators, { kind: "field", name: "rfqId", static: false, private: false, access: { has: obj => "rfqId" in obj, get: obj => obj.rfqId, set: (obj, value) => { obj.rfqId = value; } }, metadata: _metadata }, _rfqId_initializers, _rfqId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _validUntil_decorators, { kind: "field", name: "validUntil", static: false, private: false, access: { has: obj => "validUntil" in obj, get: obj => obj.validUntil, set: (obj, value) => { obj.validUntil = value; } }, metadata: _metadata }, _validUntil_initializers, _validUntil_extraInitializers);
        __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
        __esDecorate(null, null, _deliveryTimeframe_decorators, { kind: "field", name: "deliveryTimeframe", static: false, private: false, access: { has: obj => "deliveryTimeframe" in obj, get: obj => obj.deliveryTimeframe, set: (obj, value) => { obj.deliveryTimeframe = value; } }, metadata: _metadata }, _deliveryTimeframe_initializers, _deliveryTimeframe_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _evaluationScore_decorators, { kind: "field", name: "evaluationScore", static: false, private: false, access: { has: obj => "evaluationScore" in obj, get: obj => obj.evaluationScore, set: (obj, value) => { obj.evaluationScore = value; } }, metadata: _metadata }, _evaluationScore_initializers, _evaluationScore_extraInitializers);
        __esDecorate(null, null, _isSelected_decorators, { kind: "field", name: "isSelected", static: false, private: false, access: { has: obj => "isSelected" in obj, get: obj => obj.isSelected, set: (obj, value) => { obj.isSelected = value; } }, metadata: _metadata }, _isSelected_initializers, _isSelected_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _rfq_decorators, { kind: "field", name: "rfq", static: false, private: false, access: { has: obj => "rfq" in obj, get: obj => obj.rfq, set: (obj, value) => { obj.rfq = value; } }, metadata: _metadata }, _rfq_initializers, _rfq_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorQuote = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorQuote = _classThis;
})();
exports.VendorQuote = VendorQuote;
/**
 * Purchase Order Model - Purchase orders
 */
let PurchaseOrder = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'purchase_orders',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['po_number'], unique: true },
                { fields: ['vendor_id'] },
                { fields: ['requisition_id'] },
                { fields: ['status'] },
                { fields: ['expected_delivery_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generatePONumber_decorators;
    let _static_calculateTotals_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _poNumber_decorators;
    let _poNumber_initializers = [];
    let _poNumber_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _requisitionId_decorators;
    let _requisitionId_initializers = [];
    let _requisitionId_extraInitializers = [];
    let _quoteId_decorators;
    let _quoteId_initializers = [];
    let _quoteId_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _subtotal_decorators;
    let _subtotal_initializers = [];
    let _subtotal_extraInitializers = [];
    let _taxAmount_decorators;
    let _taxAmount_initializers = [];
    let _taxAmount_extraInitializers = [];
    let _totalAmount_decorators;
    let _totalAmount_initializers = [];
    let _totalAmount_extraInitializers = [];
    let _shippingAddress_decorators;
    let _shippingAddress_initializers = [];
    let _shippingAddress_extraInitializers = [];
    let _billingAddress_decorators;
    let _billingAddress_initializers = [];
    let _billingAddress_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _expectedDeliveryDate_decorators;
    let _expectedDeliveryDate_initializers = [];
    let _expectedDeliveryDate_extraInitializers = [];
    let _issuedDate_decorators;
    let _issuedDate_initializers = [];
    let _issuedDate_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    let _requisition_decorators;
    let _requisition_initializers = [];
    let _requisition_extraInitializers = [];
    let _quote_decorators;
    let _quote_initializers = [];
    let _quote_extraInitializers = [];
    let _receivings_decorators;
    let _receivings_initializers = [];
    let _receivings_extraInitializers = [];
    var PurchaseOrder = _classThis = class extends _classSuper {
        static async generatePONumber(instance) {
            if (!instance.poNumber) {
                const count = await PurchaseOrder.count();
                const year = new Date().getFullYear();
                instance.poNumber = `PO-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        static calculateTotals(instance) {
            if (instance.items && instance.items.length > 0) {
                const subtotal = instance.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
                const taxAmount = instance.items.reduce((sum, item) => sum + item.quantity * item.unitPrice * (item.taxRate || 0) / 100, 0);
                instance.subtotal = subtotal;
                instance.taxAmount = taxAmount;
                instance.totalAmount = subtotal + taxAmount;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.poNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _poNumber_initializers, void 0));
            this.vendorId = (__runInitializers(this, _poNumber_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.requisitionId = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _requisitionId_initializers, void 0));
            this.quoteId = (__runInitializers(this, _requisitionId_extraInitializers), __runInitializers(this, _quoteId_initializers, void 0));
            this.contractId = (__runInitializers(this, _quoteId_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.status = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.items = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            this.subtotal = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _subtotal_initializers, void 0));
            this.taxAmount = (__runInitializers(this, _subtotal_extraInitializers), __runInitializers(this, _taxAmount_initializers, void 0));
            this.totalAmount = (__runInitializers(this, _taxAmount_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
            this.shippingAddress = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
            this.billingAddress = (__runInitializers(this, _shippingAddress_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
            this.paymentTerms = (__runInitializers(this, _billingAddress_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
            this.expectedDeliveryDate = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _expectedDeliveryDate_initializers, void 0));
            this.issuedDate = (__runInitializers(this, _expectedDeliveryDate_extraInitializers), __runInitializers(this, _issuedDate_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _issuedDate_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.vendor = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            this.requisition = (__runInitializers(this, _vendor_extraInitializers), __runInitializers(this, _requisition_initializers, void 0));
            this.quote = (__runInitializers(this, _requisition_extraInitializers), __runInitializers(this, _quote_initializers, void 0));
            this.receivings = (__runInitializers(this, _quote_extraInitializers), __runInitializers(this, _receivings_initializers, void 0));
            __runInitializers(this, _receivings_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PurchaseOrder");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _poNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'PO number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Vendor), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _requisitionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requisition ID' }), (0, sequelize_typescript_1.ForeignKey)(() => PurchaseRequisition), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _quoteId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Quote ID' }), (0, sequelize_typescript_1.ForeignKey)(() => VendorQuote), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _contractId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PurchaseOrderStatus)), defaultValue: PurchaseOrderStatus.DRAFT }), sequelize_typescript_1.Index];
        _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'PO items' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _subtotal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Subtotal amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _taxAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tax amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _totalAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _shippingAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Shipping address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _billingAddress_decorators = [(0, swagger_1.ApiProperty)({ description: 'Billing address' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentTerms)), allowNull: false })];
        _expectedDeliveryDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expected delivery date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _issuedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issued date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _vendor_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Vendor)];
        _requisition_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PurchaseRequisition)];
        _quote_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => VendorQuote)];
        _receivings_decorators = [(0, sequelize_typescript_1.HasMany)(() => AssetReceiving)];
        _static_generatePONumber_decorators = [sequelize_typescript_1.BeforeCreate];
        _static_calculateTotals_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generatePONumber_decorators, { kind: "method", name: "generatePONumber", static: true, private: false, access: { has: obj => "generatePONumber" in obj, get: obj => obj.generatePONumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_calculateTotals_decorators, { kind: "method", name: "calculateTotals", static: true, private: false, access: { has: obj => "calculateTotals" in obj, get: obj => obj.calculateTotals }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _poNumber_decorators, { kind: "field", name: "poNumber", static: false, private: false, access: { has: obj => "poNumber" in obj, get: obj => obj.poNumber, set: (obj, value) => { obj.poNumber = value; } }, metadata: _metadata }, _poNumber_initializers, _poNumber_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _requisitionId_decorators, { kind: "field", name: "requisitionId", static: false, private: false, access: { has: obj => "requisitionId" in obj, get: obj => obj.requisitionId, set: (obj, value) => { obj.requisitionId = value; } }, metadata: _metadata }, _requisitionId_initializers, _requisitionId_extraInitializers);
        __esDecorate(null, null, _quoteId_decorators, { kind: "field", name: "quoteId", static: false, private: false, access: { has: obj => "quoteId" in obj, get: obj => obj.quoteId, set: (obj, value) => { obj.quoteId = value; } }, metadata: _metadata }, _quoteId_initializers, _quoteId_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, null, _subtotal_decorators, { kind: "field", name: "subtotal", static: false, private: false, access: { has: obj => "subtotal" in obj, get: obj => obj.subtotal, set: (obj, value) => { obj.subtotal = value; } }, metadata: _metadata }, _subtotal_initializers, _subtotal_extraInitializers);
        __esDecorate(null, null, _taxAmount_decorators, { kind: "field", name: "taxAmount", static: false, private: false, access: { has: obj => "taxAmount" in obj, get: obj => obj.taxAmount, set: (obj, value) => { obj.taxAmount = value; } }, metadata: _metadata }, _taxAmount_initializers, _taxAmount_extraInitializers);
        __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: obj => "totalAmount" in obj, get: obj => obj.totalAmount, set: (obj, value) => { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
        __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: obj => "shippingAddress" in obj, get: obj => obj.shippingAddress, set: (obj, value) => { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
        __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
        __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
        __esDecorate(null, null, _expectedDeliveryDate_decorators, { kind: "field", name: "expectedDeliveryDate", static: false, private: false, access: { has: obj => "expectedDeliveryDate" in obj, get: obj => obj.expectedDeliveryDate, set: (obj, value) => { obj.expectedDeliveryDate = value; } }, metadata: _metadata }, _expectedDeliveryDate_initializers, _expectedDeliveryDate_extraInitializers);
        __esDecorate(null, null, _issuedDate_decorators, { kind: "field", name: "issuedDate", static: false, private: false, access: { has: obj => "issuedDate" in obj, get: obj => obj.issuedDate, set: (obj, value) => { obj.issuedDate = value; } }, metadata: _metadata }, _issuedDate_initializers, _issuedDate_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, null, _requisition_decorators, { kind: "field", name: "requisition", static: false, private: false, access: { has: obj => "requisition" in obj, get: obj => obj.requisition, set: (obj, value) => { obj.requisition = value; } }, metadata: _metadata }, _requisition_initializers, _requisition_extraInitializers);
        __esDecorate(null, null, _quote_decorators, { kind: "field", name: "quote", static: false, private: false, access: { has: obj => "quote" in obj, get: obj => obj.quote, set: (obj, value) => { obj.quote = value; } }, metadata: _metadata }, _quote_initializers, _quote_extraInitializers);
        __esDecorate(null, null, _receivings_decorators, { kind: "field", name: "receivings", static: false, private: false, access: { has: obj => "receivings" in obj, get: obj => obj.receivings, set: (obj, value) => { obj.receivings = value; } }, metadata: _metadata }, _receivings_initializers, _receivings_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PurchaseOrder = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PurchaseOrder = _classThis;
})();
exports.PurchaseOrder = PurchaseOrder;
/**
 * Asset Receiving Model - Asset receipt tracking
 */
let AssetReceiving = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_receivings',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['receiving_number'], unique: true },
                { fields: ['purchase_order_id'] },
                { fields: ['received_by'] },
                { fields: ['status'] },
                { fields: ['received_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateReceivingNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _receivingNumber_decorators;
    let _receivingNumber_initializers = [];
    let _receivingNumber_extraInitializers = [];
    let _purchaseOrderId_decorators;
    let _purchaseOrderId_initializers = [];
    let _purchaseOrderId_extraInitializers = [];
    let _receivedBy_decorators;
    let _receivedBy_initializers = [];
    let _receivedBy_extraInitializers = [];
    let _receivedDate_decorators;
    let _receivedDate_initializers = [];
    let _receivedDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _packingSlipNumber_decorators;
    let _packingSlipNumber_initializers = [];
    let _packingSlipNumber_extraInitializers = [];
    let _trackingNumber_decorators;
    let _trackingNumber_initializers = [];
    let _trackingNumber_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _purchaseOrder_decorators;
    let _purchaseOrder_initializers = [];
    let _purchaseOrder_extraInitializers = [];
    let _inspections_decorators;
    let _inspections_initializers = [];
    let _inspections_extraInitializers = [];
    var AssetReceiving = _classThis = class extends _classSuper {
        static async generateReceivingNumber(instance) {
            if (!instance.receivingNumber) {
                const count = await AssetReceiving.count();
                const year = new Date().getFullYear();
                instance.receivingNumber = `RCV-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.receivingNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _receivingNumber_initializers, void 0));
            this.purchaseOrderId = (__runInitializers(this, _receivingNumber_extraInitializers), __runInitializers(this, _purchaseOrderId_initializers, void 0));
            this.receivedBy = (__runInitializers(this, _purchaseOrderId_extraInitializers), __runInitializers(this, _receivedBy_initializers, void 0));
            this.receivedDate = (__runInitializers(this, _receivedBy_extraInitializers), __runInitializers(this, _receivedDate_initializers, void 0));
            this.status = (__runInitializers(this, _receivedDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.items = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            this.packingSlipNumber = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _packingSlipNumber_initializers, void 0));
            this.trackingNumber = (__runInitializers(this, _packingSlipNumber_extraInitializers), __runInitializers(this, _trackingNumber_initializers, void 0));
            this.notes = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.purchaseOrder = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _purchaseOrder_initializers, void 0));
            this.inspections = (__runInitializers(this, _purchaseOrder_extraInitializers), __runInitializers(this, _inspections_initializers, void 0));
            __runInitializers(this, _inspections_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetReceiving");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _receivingNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receiving number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _purchaseOrderId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Purchase order ID' }), (0, sequelize_typescript_1.ForeignKey)(() => PurchaseOrder), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _receivedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Received by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _receivedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Received date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReceivingStatus)), defaultValue: ReceivingStatus.PENDING }), sequelize_typescript_1.Index];
        _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'Received items' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _packingSlipNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Packing slip number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _trackingNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Tracking number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _purchaseOrder_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PurchaseOrder)];
        _inspections_decorators = [(0, sequelize_typescript_1.HasMany)(() => AssetInspection)];
        _static_generateReceivingNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateReceivingNumber_decorators, { kind: "method", name: "generateReceivingNumber", static: true, private: false, access: { has: obj => "generateReceivingNumber" in obj, get: obj => obj.generateReceivingNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _receivingNumber_decorators, { kind: "field", name: "receivingNumber", static: false, private: false, access: { has: obj => "receivingNumber" in obj, get: obj => obj.receivingNumber, set: (obj, value) => { obj.receivingNumber = value; } }, metadata: _metadata }, _receivingNumber_initializers, _receivingNumber_extraInitializers);
        __esDecorate(null, null, _purchaseOrderId_decorators, { kind: "field", name: "purchaseOrderId", static: false, private: false, access: { has: obj => "purchaseOrderId" in obj, get: obj => obj.purchaseOrderId, set: (obj, value) => { obj.purchaseOrderId = value; } }, metadata: _metadata }, _purchaseOrderId_initializers, _purchaseOrderId_extraInitializers);
        __esDecorate(null, null, _receivedBy_decorators, { kind: "field", name: "receivedBy", static: false, private: false, access: { has: obj => "receivedBy" in obj, get: obj => obj.receivedBy, set: (obj, value) => { obj.receivedBy = value; } }, metadata: _metadata }, _receivedBy_initializers, _receivedBy_extraInitializers);
        __esDecorate(null, null, _receivedDate_decorators, { kind: "field", name: "receivedDate", static: false, private: false, access: { has: obj => "receivedDate" in obj, get: obj => obj.receivedDate, set: (obj, value) => { obj.receivedDate = value; } }, metadata: _metadata }, _receivedDate_initializers, _receivedDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, null, _packingSlipNumber_decorators, { kind: "field", name: "packingSlipNumber", static: false, private: false, access: { has: obj => "packingSlipNumber" in obj, get: obj => obj.packingSlipNumber, set: (obj, value) => { obj.packingSlipNumber = value; } }, metadata: _metadata }, _packingSlipNumber_initializers, _packingSlipNumber_extraInitializers);
        __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: obj => "trackingNumber" in obj, get: obj => obj.trackingNumber, set: (obj, value) => { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _purchaseOrder_decorators, { kind: "field", name: "purchaseOrder", static: false, private: false, access: { has: obj => "purchaseOrder" in obj, get: obj => obj.purchaseOrder, set: (obj, value) => { obj.purchaseOrder = value; } }, metadata: _metadata }, _purchaseOrder_initializers, _purchaseOrder_extraInitializers);
        __esDecorate(null, null, _inspections_decorators, { kind: "field", name: "inspections", static: false, private: false, access: { has: obj => "inspections" in obj, get: obj => obj.inspections, set: (obj, value) => { obj.inspections = value; } }, metadata: _metadata }, _inspections_initializers, _inspections_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetReceiving = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetReceiving = _classThis;
})();
exports.AssetReceiving = AssetReceiving;
/**
 * Asset Inspection Model - Receipt inspection tracking
 */
let AssetInspection = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'asset_inspections',
            timestamps: true,
            indexes: [
                { fields: ['inspection_number'], unique: true },
                { fields: ['receiving_id'] },
                { fields: ['inspector_id'] },
                { fields: ['overall_result'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_generateInspectionNumber_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _inspectionNumber_decorators;
    let _inspectionNumber_initializers = [];
    let _inspectionNumber_extraInitializers = [];
    let _receivingId_decorators;
    let _receivingId_initializers = [];
    let _receivingId_extraInitializers = [];
    let _inspectorId_decorators;
    let _inspectorId_initializers = [];
    let _inspectorId_extraInitializers = [];
    let _inspectionDate_decorators;
    let _inspectionDate_initializers = [];
    let _inspectionDate_extraInitializers = [];
    let _items_decorators;
    let _items_initializers = [];
    let _items_extraInitializers = [];
    let _overallResult_decorators;
    let _overallResult_initializers = [];
    let _overallResult_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _photos_decorators;
    let _photos_initializers = [];
    let _photos_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _receiving_decorators;
    let _receiving_initializers = [];
    let _receiving_extraInitializers = [];
    var AssetInspection = _classThis = class extends _classSuper {
        static async generateInspectionNumber(instance) {
            if (!instance.inspectionNumber) {
                const count = await AssetInspection.count();
                const year = new Date().getFullYear();
                instance.inspectionNumber = `INS-${year}-${String(count + 1).padStart(6, '0')}`;
            }
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.inspectionNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _inspectionNumber_initializers, void 0));
            this.receivingId = (__runInitializers(this, _inspectionNumber_extraInitializers), __runInitializers(this, _receivingId_initializers, void 0));
            this.inspectorId = (__runInitializers(this, _receivingId_extraInitializers), __runInitializers(this, _inspectorId_initializers, void 0));
            this.inspectionDate = (__runInitializers(this, _inspectorId_extraInitializers), __runInitializers(this, _inspectionDate_initializers, void 0));
            this.items = (__runInitializers(this, _inspectionDate_extraInitializers), __runInitializers(this, _items_initializers, void 0));
            this.overallResult = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _overallResult_initializers, void 0));
            this.notes = (__runInitializers(this, _overallResult_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.photos = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _photos_initializers, void 0));
            this.documents = (__runInitializers(this, _photos_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.createdAt = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.receiving = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _receiving_initializers, void 0));
            __runInitializers(this, _receiving_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "AssetInspection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _inspectionNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true }), sequelize_typescript_1.Index];
        _receivingId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Receiving ID' }), (0, sequelize_typescript_1.ForeignKey)(() => AssetReceiving), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _inspectorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspector user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _inspectionDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _items_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspected items' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _overallResult_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall result' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(InspectionResult)), allowNull: false }), sequelize_typescript_1.Index];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _photos_decorators = [(0, swagger_1.ApiProperty)({ description: 'Photos' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _documents_decorators = [(0, swagger_1.ApiProperty)({ description: 'Documents' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _receiving_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => AssetReceiving)];
        _static_generateInspectionNumber_decorators = [sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_generateInspectionNumber_decorators, { kind: "method", name: "generateInspectionNumber", static: true, private: false, access: { has: obj => "generateInspectionNumber" in obj, get: obj => obj.generateInspectionNumber }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _inspectionNumber_decorators, { kind: "field", name: "inspectionNumber", static: false, private: false, access: { has: obj => "inspectionNumber" in obj, get: obj => obj.inspectionNumber, set: (obj, value) => { obj.inspectionNumber = value; } }, metadata: _metadata }, _inspectionNumber_initializers, _inspectionNumber_extraInitializers);
        __esDecorate(null, null, _receivingId_decorators, { kind: "field", name: "receivingId", static: false, private: false, access: { has: obj => "receivingId" in obj, get: obj => obj.receivingId, set: (obj, value) => { obj.receivingId = value; } }, metadata: _metadata }, _receivingId_initializers, _receivingId_extraInitializers);
        __esDecorate(null, null, _inspectorId_decorators, { kind: "field", name: "inspectorId", static: false, private: false, access: { has: obj => "inspectorId" in obj, get: obj => obj.inspectorId, set: (obj, value) => { obj.inspectorId = value; } }, metadata: _metadata }, _inspectorId_initializers, _inspectorId_extraInitializers);
        __esDecorate(null, null, _inspectionDate_decorators, { kind: "field", name: "inspectionDate", static: false, private: false, access: { has: obj => "inspectionDate" in obj, get: obj => obj.inspectionDate, set: (obj, value) => { obj.inspectionDate = value; } }, metadata: _metadata }, _inspectionDate_initializers, _inspectionDate_extraInitializers);
        __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: obj => "items" in obj, get: obj => obj.items, set: (obj, value) => { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
        __esDecorate(null, null, _overallResult_decorators, { kind: "field", name: "overallResult", static: false, private: false, access: { has: obj => "overallResult" in obj, get: obj => obj.overallResult, set: (obj, value) => { obj.overallResult = value; } }, metadata: _metadata }, _overallResult_initializers, _overallResult_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _photos_decorators, { kind: "field", name: "photos", static: false, private: false, access: { has: obj => "photos" in obj, get: obj => obj.photos, set: (obj, value) => { obj.photos = value; } }, metadata: _metadata }, _photos_initializers, _photos_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _receiving_decorators, { kind: "field", name: "receiving", static: false, private: false, access: { has: obj => "receiving" in obj, get: obj => obj.receiving, set: (obj, value) => { obj.receiving = value; } }, metadata: _metadata }, _receiving_initializers, _receiving_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetInspection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetInspection = _classThis;
})();
exports.AssetInspection = AssetInspection;
/**
 * Contract Model - Vendor contracts
 */
let Contract = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'contracts',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['contract_number'], unique: true },
                { fields: ['vendor_id'] },
                { fields: ['status'] },
                { fields: ['start_date'] },
                { fields: ['end_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _contractType_decorators;
    let _contractType_initializers = [];
    let _contractType_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _paymentTerms_decorators;
    let _paymentTerms_initializers = [];
    let _paymentTerms_extraInitializers = [];
    let _renewalOptions_decorators;
    let _renewalOptions_initializers = [];
    let _renewalOptions_extraInitializers = [];
    let _termsAndConditions_decorators;
    let _termsAndConditions_initializers = [];
    let _termsAndConditions_extraInitializers = [];
    let _attachments_decorators;
    let _attachments_initializers = [];
    let _attachments_extraInitializers = [];
    let _autoRenewal_decorators;
    let _autoRenewal_initializers = [];
    let _autoRenewal_extraInitializers = [];
    let _notificationDays_decorators;
    let _notificationDays_initializers = [];
    let _notificationDays_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    let _vendor_decorators;
    let _vendor_initializers = [];
    let _vendor_extraInitializers = [];
    var Contract = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
            this.vendorId = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.contractType = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _contractType_initializers, void 0));
            this.title = (__runInitializers(this, _contractType_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.value = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.paymentTerms = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
            this.renewalOptions = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _renewalOptions_initializers, void 0));
            this.termsAndConditions = (__runInitializers(this, _renewalOptions_extraInitializers), __runInitializers(this, _termsAndConditions_initializers, void 0));
            this.attachments = (__runInitializers(this, _termsAndConditions_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
            this.autoRenewal = (__runInitializers(this, _attachments_extraInitializers), __runInitializers(this, _autoRenewal_initializers, void 0));
            this.notificationDays = (__runInitializers(this, _autoRenewal_extraInitializers), __runInitializers(this, _notificationDays_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notificationDays_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.vendor = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _vendor_initializers, void 0));
            __runInitializers(this, _vendor_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Contract");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _contractNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract number' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), unique: true, allowNull: false }), sequelize_typescript_1.Index];
        _vendorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vendor ID' }), (0, sequelize_typescript_1.ForeignKey)(() => Vendor), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _contractType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractType)), allowNull: false })];
        _title_decorators = [(0, swagger_1.ApiProperty)({ description: 'Title' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractStatus)), defaultValue: ContractStatus.DRAFT }), sequelize_typescript_1.Index];
        _startDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _endDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'End date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false }), sequelize_typescript_1.Index];
        _value_decorators = [(0, swagger_1.ApiProperty)({ description: 'Contract value' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _paymentTerms_decorators = [(0, swagger_1.ApiProperty)({ description: 'Payment terms' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(PaymentTerms)), allowNull: false })];
        _renewalOptions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Renewal options' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _termsAndConditions_decorators = [(0, swagger_1.ApiProperty)({ description: 'Terms and conditions' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _attachments_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attachments' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _autoRenewal_decorators = [(0, swagger_1.ApiProperty)({ description: 'Auto renewal enabled' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _notificationDays_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notification days before expiry' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 30 })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _vendor_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Vendor)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _contractType_decorators, { kind: "field", name: "contractType", static: false, private: false, access: { has: obj => "contractType" in obj, get: obj => obj.contractType, set: (obj, value) => { obj.contractType = value; } }, metadata: _metadata }, _contractType_initializers, _contractType_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: obj => "paymentTerms" in obj, get: obj => obj.paymentTerms, set: (obj, value) => { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
        __esDecorate(null, null, _renewalOptions_decorators, { kind: "field", name: "renewalOptions", static: false, private: false, access: { has: obj => "renewalOptions" in obj, get: obj => obj.renewalOptions, set: (obj, value) => { obj.renewalOptions = value; } }, metadata: _metadata }, _renewalOptions_initializers, _renewalOptions_extraInitializers);
        __esDecorate(null, null, _termsAndConditions_decorators, { kind: "field", name: "termsAndConditions", static: false, private: false, access: { has: obj => "termsAndConditions" in obj, get: obj => obj.termsAndConditions, set: (obj, value) => { obj.termsAndConditions = value; } }, metadata: _metadata }, _termsAndConditions_initializers, _termsAndConditions_extraInitializers);
        __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: obj => "attachments" in obj, get: obj => obj.attachments, set: (obj, value) => { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
        __esDecorate(null, null, _autoRenewal_decorators, { kind: "field", name: "autoRenewal", static: false, private: false, access: { has: obj => "autoRenewal" in obj, get: obj => obj.autoRenewal, set: (obj, value) => { obj.autoRenewal = value; } }, metadata: _metadata }, _autoRenewal_initializers, _autoRenewal_extraInitializers);
        __esDecorate(null, null, _notificationDays_decorators, { kind: "field", name: "notificationDays", static: false, private: false, access: { has: obj => "notificationDays" in obj, get: obj => obj.notificationDays, set: (obj, value) => { obj.notificationDays = value; } }, metadata: _metadata }, _notificationDays_initializers, _notificationDays_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _vendor_decorators, { kind: "field", name: "vendor", static: false, private: false, access: { has: obj => "vendor" in obj, get: obj => obj.vendor, set: (obj, value) => { obj.vendor = value; } }, metadata: _metadata }, _vendor_initializers, _vendor_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Contract = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Contract = _classThis;
})();
exports.Contract = Contract;
/**
 * Budget Model - Budget tracking
 */
let Budget = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'budgets',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['department_id', 'fiscal_year', 'category_code'], unique: true },
                { fields: ['fiscal_year'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _staticExtraInitializers = [];
    let _static_calculateAvailable_decorators;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _departmentId_decorators;
    let _departmentId_initializers = [];
    let _departmentId_extraInitializers = [];
    let _fiscalYear_decorators;
    let _fiscalYear_initializers = [];
    let _fiscalYear_extraInitializers = [];
    let _categoryCode_decorators;
    let _categoryCode_initializers = [];
    let _categoryCode_extraInitializers = [];
    let _allocatedAmount_decorators;
    let _allocatedAmount_initializers = [];
    let _allocatedAmount_extraInitializers = [];
    let _reservedAmount_decorators;
    let _reservedAmount_initializers = [];
    let _reservedAmount_extraInitializers = [];
    let _committedAmount_decorators;
    let _committedAmount_initializers = [];
    let _committedAmount_extraInitializers = [];
    let _spentAmount_decorators;
    let _spentAmount_initializers = [];
    let _spentAmount_extraInitializers = [];
    let _availableAmount_decorators;
    let _availableAmount_initializers = [];
    let _availableAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var Budget = _classThis = class extends _classSuper {
        static calculateAvailable(instance) {
            const allocated = Number(instance.allocatedAmount || 0);
            const reserved = Number(instance.reservedAmount || 0);
            const committed = Number(instance.committedAmount || 0);
            const spent = Number(instance.spentAmount || 0);
            instance.availableAmount = allocated - reserved - committed - spent;
        }
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.departmentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
            this.fiscalYear = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _fiscalYear_initializers, void 0));
            this.categoryCode = (__runInitializers(this, _fiscalYear_extraInitializers), __runInitializers(this, _categoryCode_initializers, void 0));
            this.allocatedAmount = (__runInitializers(this, _categoryCode_extraInitializers), __runInitializers(this, _allocatedAmount_initializers, void 0));
            this.reservedAmount = (__runInitializers(this, _allocatedAmount_extraInitializers), __runInitializers(this, _reservedAmount_initializers, void 0));
            this.committedAmount = (__runInitializers(this, _reservedAmount_extraInitializers), __runInitializers(this, _committedAmount_initializers, void 0));
            this.spentAmount = (__runInitializers(this, _committedAmount_extraInitializers), __runInitializers(this, _spentAmount_initializers, void 0));
            this.availableAmount = (__runInitializers(this, _spentAmount_extraInitializers), __runInitializers(this, _availableAmount_initializers, void 0));
            this.status = (__runInitializers(this, _availableAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.notes = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Budget");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _departmentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _fiscalYear_decorators = [(0, swagger_1.ApiProperty)({ description: 'Fiscal year' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }), sequelize_typescript_1.Index];
        _categoryCode_decorators = [(0, swagger_1.ApiProperty)({ description: 'Category code' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false })];
        _allocatedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Total allocated amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _reservedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Reserved amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), defaultValue: 0 })];
        _committedAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Committed amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), defaultValue: 0 })];
        _spentAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Spent amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), defaultValue: 0 })];
        _availableAmount_decorators = [(0, swagger_1.ApiProperty)({ description: 'Available amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Budget status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(BudgetStatus)), defaultValue: BudgetStatus.AVAILABLE }), sequelize_typescript_1.Index];
        _approvedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approved by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        _static_calculateAvailable_decorators = [sequelize_typescript_1.BeforeCreate, sequelize_typescript_1.BeforeCreate];
        __esDecorate(_classThis, null, _static_calculateAvailable_decorators, { kind: "method", name: "calculateAvailable", static: true, private: false, access: { has: obj => "calculateAvailable" in obj, get: obj => obj.calculateAvailable }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: obj => "departmentId" in obj, get: obj => obj.departmentId, set: (obj, value) => { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
        __esDecorate(null, null, _fiscalYear_decorators, { kind: "field", name: "fiscalYear", static: false, private: false, access: { has: obj => "fiscalYear" in obj, get: obj => obj.fiscalYear, set: (obj, value) => { obj.fiscalYear = value; } }, metadata: _metadata }, _fiscalYear_initializers, _fiscalYear_extraInitializers);
        __esDecorate(null, null, _categoryCode_decorators, { kind: "field", name: "categoryCode", static: false, private: false, access: { has: obj => "categoryCode" in obj, get: obj => obj.categoryCode, set: (obj, value) => { obj.categoryCode = value; } }, metadata: _metadata }, _categoryCode_initializers, _categoryCode_extraInitializers);
        __esDecorate(null, null, _allocatedAmount_decorators, { kind: "field", name: "allocatedAmount", static: false, private: false, access: { has: obj => "allocatedAmount" in obj, get: obj => obj.allocatedAmount, set: (obj, value) => { obj.allocatedAmount = value; } }, metadata: _metadata }, _allocatedAmount_initializers, _allocatedAmount_extraInitializers);
        __esDecorate(null, null, _reservedAmount_decorators, { kind: "field", name: "reservedAmount", static: false, private: false, access: { has: obj => "reservedAmount" in obj, get: obj => obj.reservedAmount, set: (obj, value) => { obj.reservedAmount = value; } }, metadata: _metadata }, _reservedAmount_initializers, _reservedAmount_extraInitializers);
        __esDecorate(null, null, _committedAmount_decorators, { kind: "field", name: "committedAmount", static: false, private: false, access: { has: obj => "committedAmount" in obj, get: obj => obj.committedAmount, set: (obj, value) => { obj.committedAmount = value; } }, metadata: _metadata }, _committedAmount_initializers, _committedAmount_extraInitializers);
        __esDecorate(null, null, _spentAmount_decorators, { kind: "field", name: "spentAmount", static: false, private: false, access: { has: obj => "spentAmount" in obj, get: obj => obj.spentAmount, set: (obj, value) => { obj.spentAmount = value; } }, metadata: _metadata }, _spentAmount_initializers, _spentAmount_extraInitializers);
        __esDecorate(null, null, _availableAmount_decorators, { kind: "field", name: "availableAmount", static: false, private: false, access: { has: obj => "availableAmount" in obj, get: obj => obj.availableAmount, set: (obj, value) => { obj.availableAmount = value; } }, metadata: _metadata }, _availableAmount_initializers, _availableAmount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Budget = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Budget = _classThis;
})();
exports.Budget = Budget;
/**
 * Approval Workflow Model - Approval routing
 */
let ApprovalWorkflow = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'approval_workflows',
            timestamps: true,
            indexes: [
                { fields: ['document_type', 'document_id'] },
                { fields: ['current_approver_id'] },
                { fields: ['status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentType_decorators;
    let _documentType_initializers = [];
    let _documentType_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _approvers_decorators;
    let _approvers_initializers = [];
    let _approvers_extraInitializers = [];
    let _currentApproverId_decorators;
    let _currentApproverId_initializers = [];
    let _currentApproverId_extraInitializers = [];
    let _currentLevel_decorators;
    let _currentLevel_initializers = [];
    let _currentLevel_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _sequenceRequired_decorators;
    let _sequenceRequired_initializers = [];
    let _sequenceRequired_extraInitializers = [];
    let _approvalHistory_decorators;
    let _approvalHistory_initializers = [];
    let _approvalHistory_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ApprovalWorkflow = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
            this.documentId = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.approvers = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _approvers_initializers, void 0));
            this.currentApproverId = (__runInitializers(this, _approvers_extraInitializers), __runInitializers(this, _currentApproverId_initializers, void 0));
            this.currentLevel = (__runInitializers(this, _currentApproverId_extraInitializers), __runInitializers(this, _currentLevel_initializers, void 0));
            this.status = (__runInitializers(this, _currentLevel_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.sequenceRequired = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _sequenceRequired_initializers, void 0));
            this.approvalHistory = (__runInitializers(this, _sequenceRequired_extraInitializers), __runInitializers(this, _approvalHistory_initializers, void 0));
            this.notes = (__runInitializers(this, _approvalHistory_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ApprovalWorkflow");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique identifier' }), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                primaryKey: true,
            })];
        _documentType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document type' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(50), allowNull: false }), sequelize_typescript_1.Index];
        _documentId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false }), sequelize_typescript_1.Index];
        _approvers_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approvers list' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _currentApproverId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current approver user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }), sequelize_typescript_1.Index];
        _currentLevel_decorators = [(0, swagger_1.ApiProperty)({ description: 'Current approval level' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, defaultValue: 1 })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Workflow status' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ApprovalStatus)), defaultValue: ApprovalStatus.PENDING }), sequelize_typescript_1.Index];
        _sequenceRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Sequence required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: true })];
        _approvalHistory_decorators = [(0, swagger_1.ApiProperty)({ description: 'Approval history' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: obj => "documentType" in obj, get: obj => obj.documentType, set: (obj, value) => { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _approvers_decorators, { kind: "field", name: "approvers", static: false, private: false, access: { has: obj => "approvers" in obj, get: obj => obj.approvers, set: (obj, value) => { obj.approvers = value; } }, metadata: _metadata }, _approvers_initializers, _approvers_extraInitializers);
        __esDecorate(null, null, _currentApproverId_decorators, { kind: "field", name: "currentApproverId", static: false, private: false, access: { has: obj => "currentApproverId" in obj, get: obj => obj.currentApproverId, set: (obj, value) => { obj.currentApproverId = value; } }, metadata: _metadata }, _currentApproverId_initializers, _currentApproverId_extraInitializers);
        __esDecorate(null, null, _currentLevel_decorators, { kind: "field", name: "currentLevel", static: false, private: false, access: { has: obj => "currentLevel" in obj, get: obj => obj.currentLevel, set: (obj, value) => { obj.currentLevel = value; } }, metadata: _metadata }, _currentLevel_initializers, _currentLevel_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _sequenceRequired_decorators, { kind: "field", name: "sequenceRequired", static: false, private: false, access: { has: obj => "sequenceRequired" in obj, get: obj => obj.sequenceRequired, set: (obj, value) => { obj.sequenceRequired = value; } }, metadata: _metadata }, _sequenceRequired_initializers, _sequenceRequired_extraInitializers);
        __esDecorate(null, null, _approvalHistory_decorators, { kind: "field", name: "approvalHistory", static: false, private: false, access: { has: obj => "approvalHistory" in obj, get: obj => obj.approvalHistory, set: (obj, value) => { obj.approvalHistory = value; } }, metadata: _metadata }, _approvalHistory_initializers, _approvalHistory_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApprovalWorkflow = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApprovalWorkflow = _classThis;
})();
exports.ApprovalWorkflow = ApprovalWorkflow;
// ============================================================================
// PURCHASE REQUISITION FUNCTIONS
// ============================================================================
/**
 * Creates a new purchase requisition
 *
 * @param data - Requisition data
 * @param transaction - Optional database transaction
 * @returns Created purchase requisition
 *
 * @example
 * ```typescript
 * const requisition = await createPurchaseRequisition({
 *   requestorId: 'user-123',
 *   departmentId: 'dept-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15',
 *     quantity: 5,
 *     estimatedUnitCost: 1500,
 *     justification: 'New employee laptops'
 *   }],
 *   priority: PriorityLevel.HIGH,
 *   justification: 'Q1 hiring plan'
 * });
 * ```
 */
async function createPurchaseRequisition(data, transaction) {
    // Validate budget if provided
    if (data.budgetId) {
        await validateBudgetAvailability(data.budgetId, data.items, transaction);
    }
    const requisition = await PurchaseRequisition.create({
        ...data,
        status: ApprovalStatus.DRAFT,
    }, { transaction });
    return requisition;
}
/**
 * Submits requisition for approval
 *
 * @param requisitionId - Requisition identifier
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await submitRequisitionForApproval('req-123');
 * ```
 */
async function submitRequisitionForApproval(requisitionId, transaction) {
    const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
    if (!requisition) {
        throw new common_1.NotFoundException(`Requisition ${requisitionId} not found`);
    }
    if (requisition.status !== ApprovalStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft requisitions can be submitted');
    }
    // Create approval workflow
    await createApprovalWorkflow({
        documentType: 'purchase_requisition',
        documentId: requisitionId,
        approvers: await getApproversForRequisition(requisition),
        sequenceRequired: true,
    }, transaction);
    await requisition.update({ status: ApprovalStatus.PENDING }, { transaction });
    return requisition;
}
/**
 * Approves a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approverId - Approver user ID
 * @param comments - Optional approval comments
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await approvePurchaseRequisition('req-123', 'manager-456', 'Approved for Q1 budget');
 * ```
 */
async function approvePurchaseRequisition(requisitionId, approverId, comments, transaction) {
    const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
    if (!requisition) {
        throw new common_1.NotFoundException(`Requisition ${requisitionId} not found`);
    }
    if (requisition.status !== ApprovalStatus.PENDING) {
        throw new common_1.BadRequestException('Only pending requisitions can be approved');
    }
    // Process approval in workflow
    const workflow = await ApprovalWorkflow.findOne({
        where: {
            documentType: 'purchase_requisition',
            documentId: requisitionId,
            status: ApprovalStatus.PENDING,
        },
        transaction,
    });
    if (!workflow) {
        throw new common_1.NotFoundException('Approval workflow not found');
    }
    // Verify approver is authorized
    if (workflow.currentApproverId !== approverId) {
        throw new common_1.ForbiddenException('User is not authorized to approve at this level');
    }
    // Update approval history
    const history = workflow.approvalHistory || [];
    history.push({
        userId: approverId,
        action: 'approved',
        timestamp: new Date(),
        comments,
    });
    // Check if more approvals needed
    const nextLevel = workflow.currentLevel + 1;
    const nextApprover = workflow.approvers.find(a => a.level === nextLevel);
    if (nextApprover) {
        // More approvals needed
        await workflow.update({
            currentLevel: nextLevel,
            currentApproverId: nextApprover.userId,
            approvalHistory: history,
        }, { transaction });
    }
    else {
        // Final approval
        await workflow.update({
            status: ApprovalStatus.APPROVED,
            approvalHistory: history,
        }, { transaction });
        await requisition.update({
            status: ApprovalStatus.APPROVED,
            approvedBy: approverId,
            approvalDate: new Date(),
        }, { transaction });
    }
    return requisition;
}
/**
 * Rejects a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param approverId - Approver user ID
 * @param reason - Rejection reason
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await rejectPurchaseRequisition('req-123', 'manager-456', 'Budget not available');
 * ```
 */
async function rejectPurchaseRequisition(requisitionId, approverId, reason, transaction) {
    const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
    if (!requisition) {
        throw new common_1.NotFoundException(`Requisition ${requisitionId} not found`);
    }
    await requisition.update({
        status: ApprovalStatus.REJECTED,
        rejectionReason: reason,
    }, { transaction });
    // Update workflow
    await ApprovalWorkflow.update({ status: ApprovalStatus.REJECTED }, {
        where: {
            documentType: 'purchase_requisition',
            documentId: requisitionId,
        },
        transaction,
    });
    return requisition;
}
/**
 * Gets purchase requisitions by status
 *
 * @param status - Requisition status
 * @param options - Query options
 * @returns Requisitions
 *
 * @example
 * ```typescript
 * const pending = await getRequisitionsByStatus(ApprovalStatus.PENDING);
 * ```
 */
async function getRequisitionsByStatus(status, options = {}) {
    return PurchaseRequisition.findAll({
        where: { status },
        order: [['createdAt', 'DESC']],
        ...options,
    });
}
/**
 * Gets requisitions by department
 *
 * @param departmentId - Department identifier
 * @param options - Query options
 * @returns Requisitions
 *
 * @example
 * ```typescript
 * const deptReqs = await getRequisitionsByDepartment('dept-123');
 * ```
 */
async function getRequisitionsByDepartment(departmentId, options = {}) {
    return PurchaseRequisition.findAll({
        where: { departmentId },
        order: [['createdAt', 'DESC']],
        ...options,
    });
}
/**
 * Updates purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await updatePurchaseRequisition('req-123', {
 *   priority: PriorityLevel.CRITICAL,
 *   notes: 'Urgent requirement'
 * });
 * ```
 */
async function updatePurchaseRequisition(requisitionId, updates, transaction) {
    const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
    if (!requisition) {
        throw new common_1.NotFoundException(`Requisition ${requisitionId} not found`);
    }
    if (requisition.status !== ApprovalStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft requisitions can be updated');
    }
    await requisition.update(updates, { transaction });
    return requisition;
}
/**
 * Cancels a purchase requisition
 *
 * @param requisitionId - Requisition identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated requisition
 *
 * @example
 * ```typescript
 * await cancelPurchaseRequisition('req-123', 'Requirements changed');
 * ```
 */
async function cancelPurchaseRequisition(requisitionId, reason, transaction) {
    const requisition = await PurchaseRequisition.findByPk(requisitionId, { transaction });
    if (!requisition) {
        throw new common_1.NotFoundException(`Requisition ${requisitionId} not found`);
    }
    await requisition.update({
        status: ApprovalStatus.CANCELLED,
        notes: `${requisition.notes || ''}\nCancelled: ${reason}`,
    }, { transaction });
    return requisition;
}
// ============================================================================
// RFQ/RFP MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new RFQ
 *
 * @param data - RFQ data
 * @param transaction - Optional database transaction
 * @returns Created RFQ
 *
 * @example
 * ```typescript
 * const rfq = await createRFQ({
 *   title: 'Laptop Procurement RFQ',
 *   description: 'Request for quotes for 50 laptops',
 *   vendorIds: ['vendor-1', 'vendor-2'],
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15 or equivalent',
 *     quantity: 50,
 *     specifications: { ram: '16GB', storage: '512GB SSD' }
 *   }],
 *   responseDeadline: new Date('2024-06-01')
 * });
 * ```
 */
async function createRFQ(data, transaction) {
    const rfq = await RFQ.create({
        ...data,
        status: RFQStatus.DRAFT,
    }, { transaction });
    return rfq;
}
/**
 * Publishes an RFQ to vendors
 *
 * @param rfqId - RFQ identifier
 * @param transaction - Optional database transaction
 * @returns Updated RFQ
 *
 * @example
 * ```typescript
 * await publishRFQ('rfq-123');
 * ```
 */
async function publishRFQ(rfqId, transaction) {
    const rfq = await RFQ.findByPk(rfqId, { transaction });
    if (!rfq) {
        throw new common_1.NotFoundException(`RFQ ${rfqId} not found`);
    }
    if (rfq.status !== RFQStatus.DRAFT) {
        throw new common_1.BadRequestException('Only draft RFQs can be published');
    }
    // Validate vendors exist
    for (const vendorId of rfq.vendorIds) {
        const vendor = await Vendor.findByPk(vendorId, { transaction });
        if (!vendor || !vendor.isActive) {
            throw new common_1.BadRequestException(`Vendor ${vendorId} is not active`);
        }
    }
    await rfq.update({
        status: RFQStatus.PUBLISHED,
        publishedDate: new Date(),
    }, { transaction });
    // TODO: Send notifications to vendors
    return rfq;
}
/**
 * Submits a vendor quote for an RFQ
 *
 * @param data - Quote data
 * @param transaction - Optional database transaction
 * @returns Created quote
 *
 * @example
 * ```typescript
 * const quote = await submitVendorQuote({
 *   rfqId: 'rfq-123',
 *   vendorId: 'vendor-456',
 *   items: [{
 *     rfqItemId: 'item-1',
 *     unitPrice: 1450,
 *     quantity: 50,
 *     leadTime: 14
 *   }],
 *   totalAmount: 72500,
 *   validUntil: new Date('2024-07-01'),
 *   paymentTerms: PaymentTerms.NET_30,
 *   deliveryTimeframe: '2 weeks from PO'
 * });
 * ```
 */
async function submitVendorQuote(data, transaction) {
    const rfq = await RFQ.findByPk(data.rfqId, { transaction });
    if (!rfq) {
        throw new common_1.NotFoundException(`RFQ ${data.rfqId} not found`);
    }
    if (rfq.status !== RFQStatus.PUBLISHED) {
        throw new common_1.BadRequestException('RFQ is not accepting quotes');
    }
    if (new Date() > rfq.responseDeadline) {
        throw new common_1.BadRequestException('RFQ response deadline has passed');
    }
    if (!rfq.vendorIds.includes(data.vendorId)) {
        throw new common_1.ForbiddenException('Vendor not invited to this RFQ');
    }
    const quote = await VendorQuote.create(data, { transaction });
    return quote;
}
/**
 * Evaluates vendor quotes
 *
 * @param rfqId - RFQ identifier
 * @param evaluationCriteria - Evaluation weights
 * @param transaction - Optional database transaction
 * @returns Evaluated quotes with scores
 *
 * @example
 * ```typescript
 * const evaluated = await evaluateVendorQuotes('rfq-123', {
 *   price: 0.5,
 *   quality: 0.3,
 *   delivery: 0.2
 * });
 * ```
 */
async function evaluateVendorQuotes(rfqId, evaluationCriteria, transaction) {
    const quotes = await VendorQuote.findAll({
        where: { rfqId },
        include: [{ model: Vendor }],
        transaction,
    });
    if (quotes.length === 0) {
        throw new common_1.NotFoundException('No quotes found for this RFQ');
    }
    // Simple scoring based on price (lower is better)
    const prices = quotes.map(q => Number(q.totalAmount));
    const minPrice = Math.min(...prices);
    for (const quote of quotes) {
        const priceScore = (minPrice / Number(quote.totalAmount)) * 100;
        const vendorRatingScore = getVendorRatingScore(quote.vendor?.rating);
        // Weighted average
        const finalScore = (priceScore * (evaluationCriteria.price || 0.6)) +
            (vendorRatingScore * (evaluationCriteria.quality || 0.4));
        await quote.update({ evaluationScore: finalScore }, { transaction });
    }
    // Return sorted by score
    return quotes.sort((a, b) => (b.evaluationScore || 0) - (a.evaluationScore || 0));
}
/**
 * Awards RFQ to a vendor
 *
 * @param rfqId - RFQ identifier
 * @param quoteId - Selected quote identifier
 * @param transaction - Optional database transaction
 * @returns Updated RFQ and quote
 *
 * @example
 * ```typescript
 * await awardRFQ('rfq-123', 'quote-456');
 * ```
 */
async function awardRFQ(rfqId, quoteId, transaction) {
    const rfq = await RFQ.findByPk(rfqId, { transaction });
    const quote = await VendorQuote.findByPk(quoteId, { transaction });
    if (!rfq || !quote) {
        throw new common_1.NotFoundException('RFQ or quote not found');
    }
    if (quote.rfqId !== rfqId) {
        throw new common_1.BadRequestException('Quote does not belong to this RFQ');
    }
    await rfq.update({
        status: RFQStatus.AWARDED,
        awardedVendorId: quote.vendorId,
        awardDate: new Date(),
    }, { transaction });
    await quote.update({ isSelected: true }, { transaction });
    return { rfq, quote };
}
/**
 * Gets quotes for an RFQ
 *
 * @param rfqId - RFQ identifier
 * @returns Vendor quotes
 *
 * @example
 * ```typescript
 * const quotes = await getQuotesForRFQ('rfq-123');
 * ```
 */
async function getQuotesForRFQ(rfqId) {
    return VendorQuote.findAll({
        where: { rfqId },
        include: [{ model: Vendor }],
        order: [['evaluationScore', 'DESC']],
    });
}
// ============================================================================
// PURCHASE ORDER MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a purchase order
 *
 * @param data - PO data
 * @param transaction - Optional database transaction
 * @returns Created purchase order
 *
 * @example
 * ```typescript
 * const po = await createPurchaseOrder({
 *   vendorId: 'vendor-123',
 *   quoteId: 'quote-456',
 *   items: [{
 *     assetTypeId: 'laptop-dell',
 *     description: 'Dell XPS 15',
 *     quantity: 50,
 *     unitPrice: 1450,
 *     taxRate: 8.5
 *   }],
 *   shippingAddress: '123 Main St, City, State 12345',
 *   billingAddress: '456 Office Blvd, City, State 12345',
 *   paymentTerms: PaymentTerms.NET_30,
 *   expectedDeliveryDate: new Date('2024-07-15')
 * });
 * ```
 */
async function createPurchaseOrder(data, transaction) {
    // Validate vendor
    const vendor = await Vendor.findByPk(data.vendorId, { transaction });
    if (!vendor || !vendor.isActive) {
        throw new common_1.BadRequestException('Vendor is not active');
    }
    // If quote provided, validate it
    if (data.quoteId) {
        const quote = await VendorQuote.findByPk(data.quoteId, { transaction });
        if (!quote || quote.vendorId !== data.vendorId) {
            throw new common_1.BadRequestException('Invalid quote for vendor');
        }
        if (new Date() > quote.validUntil) {
            throw new common_1.BadRequestException('Quote has expired');
        }
    }
    const po = await PurchaseOrder.create({
        ...data,
        status: PurchaseOrderStatus.DRAFT,
    }, { transaction });
    return po;
}
/**
 * Approves a purchase order
 *
 * @param poId - PO identifier
 * @param approverId - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await approvePurchaseOrder('po-123', 'manager-456');
 * ```
 */
async function approvePurchaseOrder(poId, approverId, transaction) {
    const po = await PurchaseOrder.findByPk(poId, { transaction });
    if (!po) {
        throw new common_1.NotFoundException(`PO ${poId} not found`);
    }
    if (po.status !== PurchaseOrderStatus.PENDING_APPROVAL) {
        throw new common_1.BadRequestException('PO is not pending approval');
    }
    await po.update({
        status: PurchaseOrderStatus.APPROVED,
        approvedBy: approverId,
    }, { transaction });
    return po;
}
/**
 * Issues a purchase order to vendor
 *
 * @param poId - PO identifier
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await issuePurchaseOrder('po-123');
 * ```
 */
async function issuePurchaseOrder(poId, transaction) {
    const po = await PurchaseOrder.findByPk(poId, {
        include: [{ model: Vendor }],
        transaction,
    });
    if (!po) {
        throw new common_1.NotFoundException(`PO ${poId} not found`);
    }
    if (po.status !== PurchaseOrderStatus.APPROVED) {
        throw new common_1.BadRequestException('PO must be approved before issuing');
    }
    await po.update({
        status: PurchaseOrderStatus.ISSUED,
        issuedDate: new Date(),
    }, { transaction });
    // TODO: Send PO to vendor
    return po;
}
/**
 * Gets purchase orders by status
 *
 * @param status - PO status
 * @param options - Query options
 * @returns Purchase orders
 *
 * @example
 * ```typescript
 * const issued = await getPurchaseOrdersByStatus(PurchaseOrderStatus.ISSUED);
 * ```
 */
async function getPurchaseOrdersByStatus(status, options = {}) {
    return PurchaseOrder.findAll({
        where: { status },
        include: [{ model: Vendor }],
        order: [['createdAt', 'DESC']],
        ...options,
    });
}
/**
 * Gets purchase orders by vendor
 *
 * @param vendorId - Vendor identifier
 * @param options - Query options
 * @returns Purchase orders
 *
 * @example
 * ```typescript
 * const vendorPOs = await getPurchaseOrdersByVendor('vendor-123');
 * ```
 */
async function getPurchaseOrdersByVendor(vendorId, options = {}) {
    return PurchaseOrder.findAll({
        where: { vendorId },
        include: [{ model: Vendor }],
        order: [['createdAt', 'DESC']],
        ...options,
    });
}
/**
 * Updates purchase order
 *
 * @param poId - PO identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await updatePurchaseOrder('po-123', {
 *   expectedDeliveryDate: new Date('2024-08-01')
 * });
 * ```
 */
async function updatePurchaseOrder(poId, updates, transaction) {
    const po = await PurchaseOrder.findByPk(poId, { transaction });
    if (!po) {
        throw new common_1.NotFoundException(`PO ${poId} not found`);
    }
    if (po.status === PurchaseOrderStatus.CLOSED || po.status === PurchaseOrderStatus.CANCELLED) {
        throw new common_1.BadRequestException('Cannot update closed or cancelled PO');
    }
    await po.update(updates, { transaction });
    return po;
}
/**
 * Cancels a purchase order
 *
 * @param poId - PO identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated PO
 *
 * @example
 * ```typescript
 * await cancelPurchaseOrder('po-123', 'Vendor unavailable');
 * ```
 */
async function cancelPurchaseOrder(poId, reason, transaction) {
    const po = await PurchaseOrder.findByPk(poId, { transaction });
    if (!po) {
        throw new common_1.NotFoundException(`PO ${poId} not found`);
    }
    if (po.status === PurchaseOrderStatus.FULLY_RECEIVED) {
        throw new common_1.BadRequestException('Cannot cancel fully received PO');
    }
    await po.update({
        status: PurchaseOrderStatus.CANCELLED,
        notes: `${po.notes || ''}\nCancelled: ${reason}`,
    }, { transaction });
    return po;
}
// ============================================================================
// ASSET RECEIVING FUNCTIONS
// ============================================================================
/**
 * Receives assets from a purchase order
 *
 * @param data - Receiving data
 * @param transaction - Optional database transaction
 * @returns Created receiving record
 *
 * @example
 * ```typescript
 * const receiving = await receiveAssets({
 *   purchaseOrderId: 'po-123',
 *   receivedBy: 'user-456',
 *   receivedDate: new Date(),
 *   items: [{
 *     poItemId: 'item-1',
 *     quantityReceived: 50,
 *     condition: 'good',
 *     serialNumbers: ['SN001', 'SN002', ...]
 *   }],
 *   packingSlipNumber: 'PS-12345'
 * });
 * ```
 */
async function receiveAssets(data, transaction) {
    const po = await PurchaseOrder.findByPk(data.purchaseOrderId, { transaction });
    if (!po) {
        throw new common_1.NotFoundException(`PO ${data.purchaseOrderId} not found`);
    }
    if (po.status !== PurchaseOrderStatus.ISSUED &&
        po.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED) {
        throw new common_1.BadRequestException('PO must be issued before receiving');
    }
    const receiving = await AssetReceiving.create({
        ...data,
        status: ReceivingStatus.PENDING,
    }, { transaction });
    // Update PO status
    const allItemsReceived = checkIfAllItemsReceived(po, data.items);
    await po.update({
        status: allItemsReceived
            ? PurchaseOrderStatus.FULLY_RECEIVED
            : PurchaseOrderStatus.PARTIALLY_RECEIVED,
    }, { transaction });
    return receiving;
}
/**
 * Inspects received assets
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection record
 *
 * @example
 * ```typescript
 * const inspection = await inspectReceivedAssets({
 *   receivingId: 'rcv-123',
 *   inspectorId: 'user-789',
 *   inspectionDate: new Date(),
 *   items: [{
 *     receivedItemId: 'item-1',
 *     result: InspectionResult.PASSED,
 *     measurements: { weight: '2.5kg', dimensions: '35x25x2cm' }
 *   }],
 *   overallResult: InspectionResult.PASSED
 * });
 * ```
 */
async function inspectReceivedAssets(data, transaction) {
    const receiving = await AssetReceiving.findByPk(data.receivingId, { transaction });
    if (!receiving) {
        throw new common_1.NotFoundException(`Receiving ${data.receivingId} not found`);
    }
    const inspection = await AssetInspection.create(data, { transaction });
    // Update receiving status based on inspection result
    let status;
    switch (data.overallResult) {
        case InspectionResult.PASSED:
            status = ReceivingStatus.ACCEPTED;
            break;
        case InspectionResult.FAILED:
            status = ReceivingStatus.REJECTED;
            break;
        case InspectionResult.CONDITIONAL:
        case InspectionResult.REQUIRES_REWORK:
            status = ReceivingStatus.PARTIALLY_ACCEPTED;
            break;
        default:
            status = ReceivingStatus.IN_INSPECTION;
    }
    await receiving.update({ status }, { transaction });
    return inspection;
}
/**
 * Gets receiving records for a purchase order
 *
 * @param poId - PO identifier
 * @returns Receiving records
 *
 * @example
 * ```typescript
 * const receivings = await getReceivingsForPO('po-123');
 * ```
 */
async function getReceivingsForPO(poId) {
    return AssetReceiving.findAll({
        where: { purchaseOrderId: poId },
        include: [
            { model: PurchaseOrder, include: [{ model: Vendor }] },
            { model: AssetInspection },
        ],
        order: [['receivedDate', 'DESC']],
    });
}
/**
 * Gets inspection records for a receiving
 *
 * @param receivingId - Receiving identifier
 * @returns Inspection records
 *
 * @example
 * ```typescript
 * const inspections = await getInspectionsForReceiving('rcv-123');
 * ```
 */
async function getInspectionsForReceiving(receivingId) {
    return AssetInspection.findAll({
        where: { receivingId },
        order: [['inspectionDate', 'DESC']],
    });
}
// ============================================================================
// CONTRACT MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a vendor contract
 *
 * @param data - Contract data
 * @param transaction - Optional database transaction
 * @returns Created contract
 *
 * @example
 * ```typescript
 * const contract = await createContract({
 *   vendorId: 'vendor-123',
 *   contractType: ContractType.BLANKET_ORDER,
 *   contractNumber: 'CON-2024-001',
 *   title: 'IT Equipment Blanket Order',
 *   description: 'Annual IT equipment procurement',
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   value: 500000,
 *   paymentTerms: PaymentTerms.NET_30,
 *   termsAndConditions: 'Standard terms apply...'
 * });
 * ```
 */
async function createContract(data, transaction) {
    const vendor = await Vendor.findByPk(data.vendorId, { transaction });
    if (!vendor || !vendor.isActive) {
        throw new common_1.BadRequestException('Vendor is not active');
    }
    // Check for duplicate contract number
    const existing = await Contract.findOne({
        where: { contractNumber: data.contractNumber },
        transaction,
    });
    if (existing) {
        throw new common_1.ConflictException('Contract number already exists');
    }
    const contract = await Contract.create({
        ...data,
        status: ContractStatus.DRAFT,
    }, { transaction });
    return contract;
}
/**
 * Activates a contract
 *
 * @param contractId - Contract identifier
 * @param transaction - Optional database transaction
 * @returns Updated contract
 *
 * @example
 * ```typescript
 * await activateContract('contract-123');
 * ```
 */
async function activateContract(contractId, transaction) {
    const contract = await Contract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new common_1.NotFoundException(`Contract ${contractId} not found`);
    }
    if (contract.status !== ContractStatus.UNDER_REVIEW) {
        throw new common_1.BadRequestException('Contract must be under review to activate');
    }
    if (new Date() < contract.startDate) {
        throw new common_1.BadRequestException('Cannot activate contract before start date');
    }
    await contract.update({ status: ContractStatus.ACTIVE }, { transaction });
    return contract;
}
/**
 * Renews a contract
 *
 * @param contractId - Contract identifier
 * @param newEndDate - New end date
 * @param transaction - Optional database transaction
 * @returns Renewed contract
 *
 * @example
 * ```typescript
 * await renewContract('contract-123', new Date('2025-12-31'));
 * ```
 */
async function renewContract(contractId, newEndDate, transaction) {
    const contract = await Contract.findByPk(contractId, { transaction });
    if (!contract) {
        throw new common_1.NotFoundException(`Contract ${contractId} not found`);
    }
    await contract.update({
        endDate: newEndDate,
        status: ContractStatus.RENEWED,
    }, { transaction });
    return contract;
}
/**
 * Gets expiring contracts
 *
 * @param daysUntilExpiry - Days threshold
 * @returns Expiring contracts
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringContracts(30);
 * ```
 */
async function getExpiringContracts(daysUntilExpiry = 30) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysUntilExpiry);
    return Contract.findAll({
        where: {
            status: ContractStatus.ACTIVE,
            endDate: {
                [sequelize_1.Op.between]: [new Date(), thresholdDate],
            },
        },
        include: [{ model: Vendor }],
        order: [['endDate', 'ASC']],
    });
}
/**
 * Gets contracts by vendor
 *
 * @param vendorId - Vendor identifier
 * @param activeOnly - Filter for active contracts only
 * @returns Vendor contracts
 *
 * @example
 * ```typescript
 * const contracts = await getContractsByVendor('vendor-123', true);
 * ```
 */
async function getContractsByVendor(vendorId, activeOnly = false) {
    const where = { vendorId };
    if (activeOnly) {
        where.status = ContractStatus.ACTIVE;
    }
    return Contract.findAll({
        where,
        order: [['startDate', 'DESC']],
    });
}
// ============================================================================
// BUDGET MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a budget allocation
 *
 * @param data - Budget data
 * @param transaction - Optional database transaction
 * @returns Created budget
 *
 * @example
 * ```typescript
 * const budget = await createBudgetAllocation({
 *   budgetId: 'budget-123',
 *   departmentId: 'dept-456',
 *   fiscalYear: 2024,
 *   amount: 100000,
 *   categoryCode: 'IT-EQUIPMENT',
 *   approvedBy: 'cfo-789'
 * });
 * ```
 */
async function createBudgetAllocation(data, transaction) {
    const budget = await Budget.create({
        ...data,
        allocatedAmount: data.amount,
        status: BudgetStatus.AVAILABLE,
    }, { transaction });
    return budget;
}
/**
 * Validates budget availability
 *
 * @param budgetId - Budget identifier
 * @param items - Items to validate against budget
 * @param transaction - Optional database transaction
 * @returns Validation result
 *
 * @example
 * ```typescript
 * await validateBudgetAvailability('budget-123', requisitionItems);
 * ```
 */
async function validateBudgetAvailability(budgetId, items, transaction) {
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
    }
    const requestedAmount = items.reduce((sum, item) => sum + item.quantity * item.estimatedUnitCost, 0);
    const available = Number(budget.availableAmount || 0);
    if (requestedAmount > available) {
        throw new common_1.BadRequestException(`Insufficient budget. Available: ${available}, Requested: ${requestedAmount}`);
    }
    return true;
}
/**
 * Reserves budget for a requisition
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount to reserve
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await reserveBudget('budget-123', 5000);
 * ```
 */
async function reserveBudget(budgetId, amount, transaction) {
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
    }
    const newReserved = Number(budget.reservedAmount) + amount;
    const newAvailable = Number(budget.allocatedAmount) - newReserved -
        Number(budget.committedAmount) - Number(budget.spentAmount);
    if (newAvailable < 0) {
        throw new common_1.BadRequestException('Insufficient budget available');
    }
    await budget.update({
        reservedAmount: newReserved,
        availableAmount: newAvailable,
        status: newAvailable > 0 ? BudgetStatus.RESERVED : BudgetStatus.COMMITTED,
    }, { transaction });
    return budget;
}
/**
 * Commits budget for a purchase order
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount to commit
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await commitBudget('budget-123', 5000);
 * ```
 */
async function commitBudget(budgetId, amount, transaction) {
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
    }
    const newCommitted = Number(budget.committedAmount) + amount;
    const newReserved = Math.max(0, Number(budget.reservedAmount) - amount);
    const newAvailable = Number(budget.allocatedAmount) - newReserved - newCommitted -
        Number(budget.spentAmount);
    await budget.update({
        committedAmount: newCommitted,
        reservedAmount: newReserved,
        availableAmount: newAvailable,
        status: BudgetStatus.COMMITTED,
    }, { transaction });
    return budget;
}
/**
 * Records actual budget spend
 *
 * @param budgetId - Budget identifier
 * @param amount - Amount spent
 * @param transaction - Optional database transaction
 * @returns Updated budget
 *
 * @example
 * ```typescript
 * await recordBudgetSpend('budget-123', 5000);
 * ```
 */
async function recordBudgetSpend(budgetId, amount, transaction) {
    const budget = await Budget.findByPk(budgetId, { transaction });
    if (!budget) {
        throw new common_1.NotFoundException(`Budget ${budgetId} not found`);
    }
    const newSpent = Number(budget.spentAmount) + amount;
    const newCommitted = Math.max(0, Number(budget.committedAmount) - amount);
    const newAvailable = Number(budget.allocatedAmount) - Number(budget.reservedAmount) -
        newCommitted - newSpent;
    await budget.update({
        spentAmount: newSpent,
        committedAmount: newCommitted,
        availableAmount: newAvailable,
        status: newSpent > Number(budget.allocatedAmount) ? BudgetStatus.EXCEEDED : BudgetStatus.SPENT,
    }, { transaction });
    return budget;
}
/**
 * Gets budget status by department
 *
 * @param departmentId - Department identifier
 * @param fiscalYear - Fiscal year
 * @returns Department budgets
 *
 * @example
 * ```typescript
 * const budgets = await getBudgetsByDepartment('dept-123', 2024);
 * ```
 */
async function getBudgetsByDepartment(departmentId, fiscalYear) {
    return Budget.findAll({
        where: { departmentId, fiscalYear },
        order: [['categoryCode', 'ASC']],
    });
}
// ============================================================================
// VENDOR MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Creates a new vendor
 *
 * @param data - Vendor data
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await createVendor({
 *   vendorCode: 'DELL-001',
 *   name: 'Dell Technologies',
 *   email: 'procurement@dell.com',
 *   phone: '1-800-DELL',
 *   address: '1 Dell Way, Round Rock, TX',
 *   defaultPaymentTerms: PaymentTerms.NET_30
 * });
 * ```
 */
async function createVendor(data, transaction) {
    // Check for duplicate vendor code
    if (data.vendorCode) {
        const existing = await Vendor.findOne({
            where: { vendorCode: data.vendorCode },
            transaction,
        });
        if (existing) {
            throw new common_1.ConflictException('Vendor code already exists');
        }
    }
    const vendor = await Vendor.create({
        ...data,
        isActive: true,
        rating: VendorRating.UNRATED,
    }, { transaction });
    return vendor;
}
/**
 * Updates vendor rating
 *
 * @param vendorId - Vendor identifier
 * @param rating - New rating
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorRating('vendor-123', VendorRating.EXCELLENT);
 * ```
 */
async function updateVendorRating(vendorId, rating, transaction) {
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    await vendor.update({ rating }, { transaction });
    return vendor;
}
/**
 * Updates vendor performance metrics
 *
 * @param vendorId - Vendor identifier
 * @param metrics - Performance metrics
 * @param transaction - Optional database transaction
 * @returns Updated vendor
 *
 * @example
 * ```typescript
 * await updateVendorPerformance('vendor-123', {
 *   onTimeDelivery: 95,
 *   qualityScore: 98,
 *   responseTime: 24
 * });
 * ```
 */
async function updateVendorPerformance(vendorId, metrics, transaction) {
    const vendor = await Vendor.findByPk(vendorId, { transaction });
    if (!vendor) {
        throw new common_1.NotFoundException(`Vendor ${vendorId} not found`);
    }
    const currentMetrics = vendor.performanceMetrics || {};
    await vendor.update({
        performanceMetrics: { ...currentMetrics, ...metrics },
    }, { transaction });
    return vendor;
}
/**
 * Gets preferred vendors
 *
 * @returns Preferred vendors
 *
 * @example
 * ```typescript
 * const preferred = await getPreferredVendors();
 * ```
 */
async function getPreferredVendors() {
    return Vendor.findAll({
        where: { isPreferred: true, isActive: true },
        order: [['rating', 'DESC'], ['name', 'ASC']],
    });
}
/**
 * Gets vendors by rating
 *
 * @param minRating - Minimum rating
 * @returns Vendors
 *
 * @example
 * ```typescript
 * const topVendors = await getVendorsByRating(VendorRating.GOOD);
 * ```
 */
async function getVendorsByRating(minRating) {
    const ratingOrder = [
        VendorRating.EXCELLENT,
        VendorRating.GOOD,
        VendorRating.AVERAGE,
        VendorRating.POOR,
    ];
    const minIndex = ratingOrder.indexOf(minRating);
    const allowedRatings = ratingOrder.slice(0, minIndex + 1);
    return Vendor.findAll({
        where: {
            rating: { [sequelize_1.Op.in]: allowedRatings },
            isActive: true,
        },
        order: [['rating', 'ASC'], ['name', 'ASC']],
    });
}
// ============================================================================
// APPROVAL WORKFLOW FUNCTIONS
// ============================================================================
/**
 * Creates an approval workflow
 *
 * @param data - Workflow data
 * @param transaction - Optional database transaction
 * @returns Created workflow
 *
 * @example
 * ```typescript
 * await createApprovalWorkflow({
 *   documentType: 'purchase_requisition',
 *   documentId: 'req-123',
 *   approvers: [
 *     { userId: 'manager-1', level: 1, required: true },
 *     { userId: 'director-1', level: 2, required: true }
 *   ],
 *   sequenceRequired: true
 * });
 * ```
 */
async function createApprovalWorkflow(data, transaction) {
    // Sort approvers by level
    const sortedApprovers = data.approvers.sort((a, b) => a.level - b.level);
    const workflow = await ApprovalWorkflow.create({
        ...data,
        approvers: sortedApprovers,
        currentApproverId: sortedApprovers[0]?.userId,
        currentLevel: 1,
        status: ApprovalStatus.PENDING,
        approvalHistory: [],
    }, { transaction });
    return workflow;
}
/**
 * Processes approval action
 *
 * @param workflowId - Workflow identifier
 * @param userId - User performing action
 * @param action - Approval action
 * @param comments - Optional comments
 * @param transaction - Optional database transaction
 * @returns Updated workflow
 *
 * @example
 * ```typescript
 * await processApprovalAction('workflow-123', 'manager-456', 'approved', 'Looks good');
 * ```
 */
async function processApprovalAction(workflowId, userId, action, comments, transaction) {
    const workflow = await ApprovalWorkflow.findByPk(workflowId, { transaction });
    if (!workflow) {
        throw new common_1.NotFoundException(`Workflow ${workflowId} not found`);
    }
    if (workflow.currentApproverId !== userId) {
        throw new common_1.ForbiddenException('User not authorized for current approval level');
    }
    const history = workflow.approvalHistory || [];
    history.push({
        userId,
        action,
        timestamp: new Date(),
        comments,
    });
    if (action === 'rejected') {
        await workflow.update({
            status: ApprovalStatus.REJECTED,
            approvalHistory: history,
        }, { transaction });
    }
    else {
        // Check for next approver
        const nextLevel = workflow.currentLevel + 1;
        const nextApprover = workflow.approvers.find(a => a.level === nextLevel && a.required);
        if (nextApprover) {
            await workflow.update({
                currentLevel: nextLevel,
                currentApproverId: nextApprover.userId,
                approvalHistory: history,
            }, { transaction });
        }
        else {
            await workflow.update({
                status: ApprovalStatus.APPROVED,
                approvalHistory: history,
            }, { transaction });
        }
    }
    return workflow;
}
/**
 * Gets pending approvals for a user
 *
 * @param userId - User identifier
 * @returns Pending workflows
 *
 * @example
 * ```typescript
 * const pending = await getPendingApprovalsForUser('manager-123');
 * ```
 */
async function getPendingApprovalsForUser(userId) {
    return ApprovalWorkflow.findAll({
        where: {
            currentApproverId: userId,
            status: ApprovalStatus.PENDING,
        },
        order: [['createdAt', 'ASC']],
    });
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Gets approvers for a requisition based on amount
 */
async function getApproversForRequisition(requisition) {
    const amount = Number(requisition.totalEstimatedCost || 0);
    const approvers = [];
    // Simple approval hierarchy based on amount
    if (amount < 5000) {
        approvers.push({ userId: 'manager', level: 1, required: true });
    }
    else if (amount < 25000) {
        approvers.push({ userId: 'manager', level: 1, required: true });
        approvers.push({ userId: 'director', level: 2, required: true });
    }
    else {
        approvers.push({ userId: 'manager', level: 1, required: true });
        approvers.push({ userId: 'director', level: 2, required: true });
        approvers.push({ userId: 'vp', level: 3, required: true });
    }
    return approvers;
}
/**
 * Gets vendor rating score for evaluation
 */
function getVendorRatingScore(rating) {
    const scores = {
        [VendorRating.EXCELLENT]: 100,
        [VendorRating.GOOD]: 80,
        [VendorRating.AVERAGE]: 60,
        [VendorRating.POOR]: 40,
        [VendorRating.UNRATED]: 50,
    };
    return scores[rating || VendorRating.UNRATED];
}
/**
 * Checks if all PO items have been received
 */
function checkIfAllItemsReceived(po, receivedItems) {
    // Simplified check - would need more complex logic in production
    const totalOrdered = po.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalReceived = receivedItems.reduce((sum, item) => sum + item.quantityReceived, 0);
    return totalReceived >= totalOrdered;
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    Vendor,
    PurchaseRequisition,
    RFQ,
    VendorQuote,
    PurchaseOrder,
    AssetReceiving,
    AssetInspection,
    Contract,
    Budget,
    ApprovalWorkflow,
    // Requisition Functions
    createPurchaseRequisition,
    submitRequisitionForApproval,
    approvePurchaseRequisition,
    rejectPurchaseRequisition,
    getRequisitionsByStatus,
    getRequisitionsByDepartment,
    updatePurchaseRequisition,
    cancelPurchaseRequisition,
    // RFQ Functions
    createRFQ,
    publishRFQ,
    submitVendorQuote,
    evaluateVendorQuotes,
    awardRFQ,
    getQuotesForRFQ,
    // Purchase Order Functions
    createPurchaseOrder,
    approvePurchaseOrder,
    issuePurchaseOrder,
    getPurchaseOrdersByStatus,
    getPurchaseOrdersByVendor,
    updatePurchaseOrder,
    cancelPurchaseOrder,
    // Receiving Functions
    receiveAssets,
    inspectReceivedAssets,
    getReceivingsForPO,
    getInspectionsForReceiving,
    // Contract Functions
    createContract,
    activateContract,
    renewContract,
    getExpiringContracts,
    getContractsByVendor,
    // Budget Functions
    createBudgetAllocation,
    validateBudgetAvailability,
    reserveBudget,
    commitBudget,
    recordBudgetSpend,
    getBudgetsByDepartment,
    // Vendor Functions
    createVendor,
    updateVendorRating,
    updateVendorPerformance,
    getPreferredVendors,
    getVendorsByRating,
    // Approval Functions
    createApprovalWorkflow,
    processApprovalAction,
    getPendingApprovalsForUser,
};
//# sourceMappingURL=asset-acquisition-commands.js.map