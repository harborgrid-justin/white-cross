"use strict";
/**
 * LOC: PROCUREMENT_CONTRACT_MANAGEMENT_KIT_001
 * File: /reuse/government/procurement-contract-management-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - crypto
 *
 * DOWNSTREAM (imported by):
 *   - Government procurement services
 *   - Contract management systems
 *   - Vendor management platforms
 *   - E-procurement integrations
 *   - Bid evaluation systems
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualifyVendor = exports.createVendor = exports.calculatePOTotal = exports.receivePurchaseOrder = exports.sendPurchaseOrderToVendor = exports.approvePurchaseOrder = exports.createPurchaseOrder = exports.checkContractExpiration = exports.renewContract = exports.terminateContract = exports.suspendContract = exports.activateContract = exports.createContract = exports.identifyLowestResponsiveBid = exports.rankBids = exports.calculatePriceScore = exports.calculateTechnicalScore = exports.evaluateBid = exports.createBid = exports.cancelProcurement = exports.closeBidding = exports.addEvaluationCriteria = exports.publishProcurement = exports.createProcurementRequest = exports.createAmendmentId = exports.createPurchaseOrderId = exports.createVendorId = exports.createBidId = exports.createContractId = exports.createProcurementId = exports.CreatePurchaseOrderDto = exports.RegisterVendorDto = exports.CreateContractDto = exports.CreateBidDto = exports.CreateProcurementDto = exports.ContractAmendmentModel = exports.PurchaseOrderModel = exports.VendorModel = exports.ContractModel = exports.BidModel = exports.ProcurementModel = exports.AmendmentType = exports.PurchaseOrderStatus = exports.VendorQualificationStatus = exports.BidStatus = exports.ContractType = exports.ContractStatus = exports.ProcurementStatus = exports.ProcurementMethod = exports.ProcurementType = void 0;
exports.rejectWorkflowStep = exports.approveWorkflowStep = exports.createApprovalWorkflow = exports.trackContractCompliance = exports.addComplianceFinding = exports.createComplianceCheck = exports.validateSoleSourceJustification = exports.createSoleSourceJustification = exports.applyContractAmendment = exports.createContractAmendment = exports.checkCertificationExpiry = exports.addVendorCertification = exports.disqualifyVendor = void 0;
/**
 * File: /reuse/government/procurement-contract-management-kit.ts
 * Locator: WC-GOV-PROCUREMENT-001
 * Purpose: Comprehensive Government Procurement & Contract Management Kit
 *
 * Upstream: NestJS, Sequelize, Swagger, TypeScript 5.x
 * Downstream: ../backend/government/*, Procurement services, Contract lifecycle management
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, sequelize-typescript
 * Exports: 48 procurement functions for RFP/RFQ/RFI, bid evaluation, contract management, vendor qualification
 *
 * LLM Context: Enterprise-grade procurement and contract management utilities for government operations.
 * Provides comprehensive procurement lifecycle management including RFP/RFQ/RFI creation, competitive bidding,
 * bid evaluation and scoring, contract lifecycle management, vendor pre-qualification, purchase order processing,
 * contract amendments and renewals, sole source justification, contract compliance tracking, and e-procurement
 * integration. Supports federal, state, and local government procurement regulations including FAR compliance.
 */
const crypto = __importStar(require("crypto"));
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Procurement request type
 */
var ProcurementType;
(function (ProcurementType) {
    ProcurementType["RFP"] = "rfp";
    ProcurementType["RFQ"] = "rfq";
    ProcurementType["RFI"] = "rfi";
    ProcurementType["ITB"] = "itb";
    ProcurementType["RFS"] = "rfs";
})(ProcurementType || (exports.ProcurementType = ProcurementType = {}));
/**
 * Procurement method
 */
var ProcurementMethod;
(function (ProcurementMethod) {
    ProcurementMethod["COMPETITIVE_BIDDING"] = "competitive_bidding";
    ProcurementMethod["SOLE_SOURCE"] = "sole_source";
    ProcurementMethod["EMERGENCY"] = "emergency";
    ProcurementMethod["COOPERATIVE"] = "cooperative";
    ProcurementMethod["SMALL_PURCHASE"] = "small_purchase";
    ProcurementMethod["SEALED_BID"] = "sealed_bid";
    ProcurementMethod["COMPETITIVE_NEGOTIATION"] = "competitive_negotiation";
})(ProcurementMethod || (exports.ProcurementMethod = ProcurementMethod = {}));
/**
 * Procurement status
 */
var ProcurementStatus;
(function (ProcurementStatus) {
    ProcurementStatus["DRAFT"] = "draft";
    ProcurementStatus["PUBLISHED"] = "published";
    ProcurementStatus["BID_OPEN"] = "bid_open";
    ProcurementStatus["BID_CLOSED"] = "bid_closed";
    ProcurementStatus["UNDER_EVALUATION"] = "under_evaluation";
    ProcurementStatus["AWARDED"] = "awarded";
    ProcurementStatus["CANCELLED"] = "cancelled";
    ProcurementStatus["SUSPENDED"] = "suspended";
})(ProcurementStatus || (exports.ProcurementStatus = ProcurementStatus = {}));
/**
 * Contract status
 */
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "draft";
    ContractStatus["PENDING_APPROVAL"] = "pending_approval";
    ContractStatus["APPROVED"] = "approved";
    ContractStatus["ACTIVE"] = "active";
    ContractStatus["SUSPENDED"] = "suspended";
    ContractStatus["EXPIRED"] = "expired";
    ContractStatus["TERMINATED"] = "terminated";
    ContractStatus["COMPLETED"] = "completed";
    ContractStatus["RENEWED"] = "renewed";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
/**
 * Contract type
 */
var ContractType;
(function (ContractType) {
    ContractType["FIXED_PRICE"] = "fixed_price";
    ContractType["TIME_AND_MATERIALS"] = "time_and_materials";
    ContractType["COST_PLUS"] = "cost_plus";
    ContractType["INDEFINITE_DELIVERY"] = "indefinite_delivery";
    ContractType["BLANKET_PURCHASE"] = "blanket_purchase";
    ContractType["TASK_ORDER"] = "task_order";
    ContractType["MULTI_YEAR"] = "multi_year";
})(ContractType || (exports.ContractType = ContractType = {}));
/**
 * Bid status
 */
var BidStatus;
(function (BidStatus) {
    BidStatus["SUBMITTED"] = "submitted";
    BidStatus["UNDER_REVIEW"] = "under_review";
    BidStatus["SHORTLISTED"] = "shortlisted";
    BidStatus["REJECTED"] = "rejected";
    BidStatus["AWARDED"] = "awarded";
    BidStatus["WITHDRAWN"] = "withdrawn";
})(BidStatus || (exports.BidStatus = BidStatus = {}));
/**
 * Vendor qualification status
 */
var VendorQualificationStatus;
(function (VendorQualificationStatus) {
    VendorQualificationStatus["PENDING"] = "pending";
    VendorQualificationStatus["QUALIFIED"] = "qualified";
    VendorQualificationStatus["DISQUALIFIED"] = "disqualified";
    VendorQualificationStatus["SUSPENDED"] = "suspended";
    VendorQualificationStatus["DEBARRED"] = "debarred";
})(VendorQualificationStatus || (exports.VendorQualificationStatus = VendorQualificationStatus = {}));
/**
 * Purchase order status
 */
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "draft";
    PurchaseOrderStatus["PENDING_APPROVAL"] = "pending_approval";
    PurchaseOrderStatus["APPROVED"] = "approved";
    PurchaseOrderStatus["SENT_TO_VENDOR"] = "sent_to_vendor";
    PurchaseOrderStatus["PARTIALLY_RECEIVED"] = "partially_received";
    PurchaseOrderStatus["RECEIVED"] = "received";
    PurchaseOrderStatus["INVOICED"] = "invoiced";
    PurchaseOrderStatus["PAID"] = "paid";
    PurchaseOrderStatus["CANCELLED"] = "cancelled";
})(PurchaseOrderStatus || (exports.PurchaseOrderStatus = PurchaseOrderStatus = {}));
/**
 * Amendment type
 */
var AmendmentType;
(function (AmendmentType) {
    AmendmentType["SCOPE_CHANGE"] = "scope_change";
    AmendmentType["PRICE_ADJUSTMENT"] = "price_adjustment";
    AmendmentType["TIME_EXTENSION"] = "time_extension";
    AmendmentType["TERMINATION"] = "termination";
    AmendmentType["ADMINISTRATIVE"] = "administrative";
    AmendmentType["MODIFICATION"] = "modification";
})(AmendmentType || (exports.AmendmentType = AmendmentType = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Procurement model for Sequelize ORM
 */
let ProcurementModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'procurements', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _projectNumber_decorators;
    let _projectNumber_initializers = [];
    let _projectNumber_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _publishedDate_decorators;
    let _publishedDate_initializers = [];
    let _publishedDate_extraInitializers = [];
    let _closeDate_decorators;
    let _closeDate_initializers = [];
    let _closeDate_extraInitializers = [];
    let _openDate_decorators;
    let _openDate_initializers = [];
    let _openDate_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _specifications_decorators;
    let _specifications_initializers = [];
    let _specifications_extraInitializers = [];
    let _evaluationCriteria_decorators;
    let _evaluationCriteria_initializers = [];
    let _evaluationCriteria_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _bids_decorators;
    let _bids_initializers = [];
    let _bids_extraInitializers = [];
    var ProcurementModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.method = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _method_initializers, void 0));
            this.title = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.department = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _department_initializers, void 0));
            this.projectNumber = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _projectNumber_initializers, void 0));
            this.estimatedValue = (__runInitializers(this, _projectNumber_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
            this.status = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.publishedDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _publishedDate_initializers, void 0));
            this.closeDate = (__runInitializers(this, _publishedDate_extraInitializers), __runInitializers(this, _closeDate_initializers, void 0));
            this.openDate = (__runInitializers(this, _closeDate_extraInitializers), __runInitializers(this, _openDate_initializers, void 0));
            this.createdBy = (__runInitializers(this, _openDate_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.specifications = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _specifications_initializers, void 0));
            this.evaluationCriteria = (__runInitializers(this, _specifications_extraInitializers), __runInitializers(this, _evaluationCriteria_initializers, void 0));
            this.metadata = (__runInitializers(this, _evaluationCriteria_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.bids = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _bids_initializers, void 0));
            __runInitializers(this, _bids_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ProcurementModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ProcurementType)),
                allowNull: false,
            })];
        _method_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ProcurementMethod)),
                allowNull: false,
            })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _department_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _projectNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: true })];
        _estimatedValue_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ProcurementStatus)),
                allowNull: false,
                defaultValue: ProcurementStatus.DRAFT,
            })];
        _publishedDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _closeDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _openDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _specifications_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _evaluationCriteria_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _bids_decorators = [(0, sequelize_typescript_1.HasMany)(() => BidModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
        __esDecorate(null, null, _projectNumber_decorators, { kind: "field", name: "projectNumber", static: false, private: false, access: { has: obj => "projectNumber" in obj, get: obj => obj.projectNumber, set: (obj, value) => { obj.projectNumber = value; } }, metadata: _metadata }, _projectNumber_initializers, _projectNumber_extraInitializers);
        __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _publishedDate_decorators, { kind: "field", name: "publishedDate", static: false, private: false, access: { has: obj => "publishedDate" in obj, get: obj => obj.publishedDate, set: (obj, value) => { obj.publishedDate = value; } }, metadata: _metadata }, _publishedDate_initializers, _publishedDate_extraInitializers);
        __esDecorate(null, null, _closeDate_decorators, { kind: "field", name: "closeDate", static: false, private: false, access: { has: obj => "closeDate" in obj, get: obj => obj.closeDate, set: (obj, value) => { obj.closeDate = value; } }, metadata: _metadata }, _closeDate_initializers, _closeDate_extraInitializers);
        __esDecorate(null, null, _openDate_decorators, { kind: "field", name: "openDate", static: false, private: false, access: { has: obj => "openDate" in obj, get: obj => obj.openDate, set: (obj, value) => { obj.openDate = value; } }, metadata: _metadata }, _openDate_initializers, _openDate_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _specifications_decorators, { kind: "field", name: "specifications", static: false, private: false, access: { has: obj => "specifications" in obj, get: obj => obj.specifications, set: (obj, value) => { obj.specifications = value; } }, metadata: _metadata }, _specifications_initializers, _specifications_extraInitializers);
        __esDecorate(null, null, _evaluationCriteria_decorators, { kind: "field", name: "evaluationCriteria", static: false, private: false, access: { has: obj => "evaluationCriteria" in obj, get: obj => obj.evaluationCriteria, set: (obj, value) => { obj.evaluationCriteria = value; } }, metadata: _metadata }, _evaluationCriteria_initializers, _evaluationCriteria_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _bids_decorators, { kind: "field", name: "bids", static: false, private: false, access: { has: obj => "bids" in obj, get: obj => obj.bids, set: (obj, value) => { obj.bids = value; } }, metadata: _metadata }, _bids_initializers, _bids_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProcurementModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProcurementModel = _classThis;
})();
exports.ProcurementModel = ProcurementModel;
/**
 * Bid model for Sequelize ORM
 */
let BidModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'bids', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _procurementId_decorators;
    let _procurementId_initializers = [];
    let _procurementId_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _bidAmount_decorators;
    let _bidAmount_initializers = [];
    let _bidAmount_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _submittedAt_decorators;
    let _submittedAt_initializers = [];
    let _submittedAt_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    let _technicalScore_decorators;
    let _technicalScore_initializers = [];
    let _technicalScore_extraInitializers = [];
    let _priceScore_decorators;
    let _priceScore_initializers = [];
    let _priceScore_extraInitializers = [];
    let _totalScore_decorators;
    let _totalScore_initializers = [];
    let _totalScore_extraInitializers = [];
    let _evaluationNotes_decorators;
    let _evaluationNotes_initializers = [];
    let _evaluationNotes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _procurement_decorators;
    let _procurement_initializers = [];
    let _procurement_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var BidModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.procurementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _procurementId_initializers, void 0));
            this.vendorId = (__runInitializers(this, _procurementId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.bidAmount = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _bidAmount_initializers, void 0));
            this.status = (__runInitializers(this, _bidAmount_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.submittedAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _submittedAt_initializers, void 0));
            this.documents = (__runInitializers(this, _submittedAt_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
            this.technicalScore = (__runInitializers(this, _documents_extraInitializers), __runInitializers(this, _technicalScore_initializers, void 0));
            this.priceScore = (__runInitializers(this, _technicalScore_extraInitializers), __runInitializers(this, _priceScore_initializers, void 0));
            this.totalScore = (__runInitializers(this, _priceScore_extraInitializers), __runInitializers(this, _totalScore_initializers, void 0));
            this.evaluationNotes = (__runInitializers(this, _totalScore_extraInitializers), __runInitializers(this, _evaluationNotes_initializers, void 0));
            this.metadata = (__runInitializers(this, _evaluationNotes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.procurement = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _procurement_initializers, void 0));
            this.createdAt = (__runInitializers(this, _procurement_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "BidModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _procurementId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ProcurementModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _vendorId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _bidAmount_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(BidStatus)),
                allowNull: false,
                defaultValue: BidStatus.SUBMITTED,
            })];
        _submittedAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _documents_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _technicalScore_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: true })];
        _priceScore_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: true })];
        _totalScore_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2), allowNull: true })];
        _evaluationNotes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _procurement_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ProcurementModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _procurementId_decorators, { kind: "field", name: "procurementId", static: false, private: false, access: { has: obj => "procurementId" in obj, get: obj => obj.procurementId, set: (obj, value) => { obj.procurementId = value; } }, metadata: _metadata }, _procurementId_initializers, _procurementId_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _bidAmount_decorators, { kind: "field", name: "bidAmount", static: false, private: false, access: { has: obj => "bidAmount" in obj, get: obj => obj.bidAmount, set: (obj, value) => { obj.bidAmount = value; } }, metadata: _metadata }, _bidAmount_initializers, _bidAmount_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _submittedAt_decorators, { kind: "field", name: "submittedAt", static: false, private: false, access: { has: obj => "submittedAt" in obj, get: obj => obj.submittedAt, set: (obj, value) => { obj.submittedAt = value; } }, metadata: _metadata }, _submittedAt_initializers, _submittedAt_extraInitializers);
        __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
        __esDecorate(null, null, _technicalScore_decorators, { kind: "field", name: "technicalScore", static: false, private: false, access: { has: obj => "technicalScore" in obj, get: obj => obj.technicalScore, set: (obj, value) => { obj.technicalScore = value; } }, metadata: _metadata }, _technicalScore_initializers, _technicalScore_extraInitializers);
        __esDecorate(null, null, _priceScore_decorators, { kind: "field", name: "priceScore", static: false, private: false, access: { has: obj => "priceScore" in obj, get: obj => obj.priceScore, set: (obj, value) => { obj.priceScore = value; } }, metadata: _metadata }, _priceScore_initializers, _priceScore_extraInitializers);
        __esDecorate(null, null, _totalScore_decorators, { kind: "field", name: "totalScore", static: false, private: false, access: { has: obj => "totalScore" in obj, get: obj => obj.totalScore, set: (obj, value) => { obj.totalScore = value; } }, metadata: _metadata }, _totalScore_initializers, _totalScore_extraInitializers);
        __esDecorate(null, null, _evaluationNotes_decorators, { kind: "field", name: "evaluationNotes", static: false, private: false, access: { has: obj => "evaluationNotes" in obj, get: obj => obj.evaluationNotes, set: (obj, value) => { obj.evaluationNotes = value; } }, metadata: _metadata }, _evaluationNotes_initializers, _evaluationNotes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _procurement_decorators, { kind: "field", name: "procurement", static: false, private: false, access: { has: obj => "procurement" in obj, get: obj => obj.procurement, set: (obj, value) => { obj.procurement = value; } }, metadata: _metadata }, _procurement_initializers, _procurement_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BidModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BidModel = _classThis;
})();
exports.BidModel = BidModel;
/**
 * Contract model for Sequelize ORM
 */
let ContractModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'contracts', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _procurementId_decorators;
    let _procurementId_initializers = [];
    let _procurementId_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _amendments_decorators;
    let _amendments_initializers = [];
    let _amendments_extraInitializers = [];
    let _purchaseOrders_decorators;
    let _purchaseOrders_initializers = [];
    let _purchaseOrders_extraInitializers = [];
    var ContractModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.procurementId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _procurementId_initializers, void 0));
            this.contractNumber = (__runInitializers(this, _procurementId_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
            this.type = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.vendorId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.title = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
            this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
            this.value = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _value_initializers, void 0));
            this.department = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _department_initializers, void 0));
            this.createdBy = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.terms = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
            this.deliverables = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
            this.metadata = (__runInitializers(this, _deliverables_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.amendments = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _amendments_initializers, void 0));
            this.purchaseOrders = (__runInitializers(this, _amendments_extraInitializers), __runInitializers(this, _purchaseOrders_initializers, void 0));
            __runInitializers(this, _purchaseOrders_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _procurementId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _contractNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractType)),
                allowNull: false,
            })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ContractStatus)),
                allowNull: false,
                defaultValue: ContractStatus.DRAFT,
            })];
        _vendorId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _title_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _startDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _endDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _value_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _department_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _terms_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _deliverables_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _amendments_decorators = [(0, sequelize_typescript_1.HasMany)(() => ContractAmendmentModel)];
        _purchaseOrders_decorators = [(0, sequelize_typescript_1.HasMany)(() => PurchaseOrderModel)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _procurementId_decorators, { kind: "field", name: "procurementId", static: false, private: false, access: { has: obj => "procurementId" in obj, get: obj => obj.procurementId, set: (obj, value) => { obj.procurementId = value; } }, metadata: _metadata }, _procurementId_initializers, _procurementId_extraInitializers);
        __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
        __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
        __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
        __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
        __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _amendments_decorators, { kind: "field", name: "amendments", static: false, private: false, access: { has: obj => "amendments" in obj, get: obj => obj.amendments, set: (obj, value) => { obj.amendments = value; } }, metadata: _metadata }, _amendments_initializers, _amendments_extraInitializers);
        __esDecorate(null, null, _purchaseOrders_decorators, { kind: "field", name: "purchaseOrders", static: false, private: false, access: { has: obj => "purchaseOrders" in obj, get: obj => obj.purchaseOrders, set: (obj, value) => { obj.purchaseOrders = value; } }, metadata: _metadata }, _purchaseOrders_initializers, _purchaseOrders_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractModel = _classThis;
})();
exports.ContractModel = ContractModel;
/**
 * Vendor model for Sequelize ORM
 */
let VendorModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'vendors', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _businessType_decorators;
    let _businessType_initializers = [];
    let _businessType_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _contact_decorators;
    let _contact_initializers = [];
    let _contact_extraInitializers = [];
    let _qualificationStatus_decorators;
    let _qualificationStatus_initializers = [];
    let _qualificationStatus_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _financialInfo_decorators;
    let _financialInfo_initializers = [];
    let _financialInfo_extraInitializers = [];
    let _performanceHistory_decorators;
    let _performanceHistory_initializers = [];
    let _performanceHistory_extraInitializers = [];
    let _registeredAt_decorators;
    let _registeredAt_initializers = [];
    let _registeredAt_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var VendorModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.businessType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _businessType_initializers, void 0));
            this.taxId = (__runInitializers(this, _businessType_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
            this.address = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _address_initializers, void 0));
            this.contact = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _contact_initializers, void 0));
            this.qualificationStatus = (__runInitializers(this, _contact_extraInitializers), __runInitializers(this, _qualificationStatus_initializers, void 0));
            this.certifications = (__runInitializers(this, _qualificationStatus_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
            this.financialInfo = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _financialInfo_initializers, void 0));
            this.performanceHistory = (__runInitializers(this, _financialInfo_extraInitializers), __runInitializers(this, _performanceHistory_initializers, void 0));
            this.registeredAt = (__runInitializers(this, _performanceHistory_extraInitializers), __runInitializers(this, _registeredAt_initializers, void 0));
            this.metadata = (__runInitializers(this, _registeredAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "VendorModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _name_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _businessType_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _taxId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _address_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _contact_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _qualificationStatus_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(VendorQualificationStatus)),
                allowNull: false,
                defaultValue: VendorQualificationStatus.PENDING,
            })];
        _certifications_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _financialInfo_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _performanceHistory_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _registeredAt_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _businessType_decorators, { kind: "field", name: "businessType", static: false, private: false, access: { has: obj => "businessType" in obj, get: obj => obj.businessType, set: (obj, value) => { obj.businessType = value; } }, metadata: _metadata }, _businessType_initializers, _businessType_extraInitializers);
        __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
        __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
        __esDecorate(null, null, _contact_decorators, { kind: "field", name: "contact", static: false, private: false, access: { has: obj => "contact" in obj, get: obj => obj.contact, set: (obj, value) => { obj.contact = value; } }, metadata: _metadata }, _contact_initializers, _contact_extraInitializers);
        __esDecorate(null, null, _qualificationStatus_decorators, { kind: "field", name: "qualificationStatus", static: false, private: false, access: { has: obj => "qualificationStatus" in obj, get: obj => obj.qualificationStatus, set: (obj, value) => { obj.qualificationStatus = value; } }, metadata: _metadata }, _qualificationStatus_initializers, _qualificationStatus_extraInitializers);
        __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
        __esDecorate(null, null, _financialInfo_decorators, { kind: "field", name: "financialInfo", static: false, private: false, access: { has: obj => "financialInfo" in obj, get: obj => obj.financialInfo, set: (obj, value) => { obj.financialInfo = value; } }, metadata: _metadata }, _financialInfo_initializers, _financialInfo_extraInitializers);
        __esDecorate(null, null, _performanceHistory_decorators, { kind: "field", name: "performanceHistory", static: false, private: false, access: { has: obj => "performanceHistory" in obj, get: obj => obj.performanceHistory, set: (obj, value) => { obj.performanceHistory = value; } }, metadata: _metadata }, _performanceHistory_initializers, _performanceHistory_extraInitializers);
        __esDecorate(null, null, _registeredAt_decorators, { kind: "field", name: "registeredAt", static: false, private: false, access: { has: obj => "registeredAt" in obj, get: obj => obj.registeredAt, set: (obj, value) => { obj.registeredAt = value; } }, metadata: _metadata }, _registeredAt_initializers, _registeredAt_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorModel = _classThis;
})();
exports.VendorModel = VendorModel;
/**
 * Purchase order model for Sequelize ORM
 */
let PurchaseOrderModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'purchase_orders', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _poNumber_decorators;
    let _poNumber_initializers = [];
    let _poNumber_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _orderDate_decorators;
    let _orderDate_initializers = [];
    let _orderDate_extraInitializers = [];
    let _requiredDate_decorators;
    let _requiredDate_initializers = [];
    let _requiredDate_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _subtotal_decorators;
    let _subtotal_initializers = [];
    let _subtotal_extraInitializers = [];
    let _tax_decorators;
    let _tax_initializers = [];
    let _tax_extraInitializers = [];
    let _total_decorators;
    let _total_initializers = [];
    let _total_extraInitializers = [];
    let _shippingAddress_decorators;
    let _shippingAddress_initializers = [];
    let _shippingAddress_extraInitializers = [];
    let _billingAddress_decorators;
    let _billingAddress_initializers = [];
    let _billingAddress_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var PurchaseOrderModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.poNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _poNumber_initializers, void 0));
            this.vendorId = (__runInitializers(this, _poNumber_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
            this.status = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.orderDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _orderDate_initializers, void 0));
            this.requiredDate = (__runInitializers(this, _orderDate_extraInitializers), __runInitializers(this, _requiredDate_initializers, void 0));
            this.department = (__runInitializers(this, _requiredDate_extraInitializers), __runInitializers(this, _department_initializers, void 0));
            this.lineItems = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
            this.subtotal = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _subtotal_initializers, void 0));
            this.tax = (__runInitializers(this, _subtotal_extraInitializers), __runInitializers(this, _tax_initializers, void 0));
            this.total = (__runInitializers(this, _tax_extraInitializers), __runInitializers(this, _total_initializers, void 0));
            this.shippingAddress = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
            this.billingAddress = (__runInitializers(this, _shippingAddress_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
            this.createdBy = (__runInitializers(this, _billingAddress_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.contract = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            this.createdAt = (__runInitializers(this, _contract_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PurchaseOrderModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ContractModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _poNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false, unique: true })];
        _vendorId_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PurchaseOrderStatus)),
                allowNull: false,
                defaultValue: PurchaseOrderStatus.DRAFT,
            })];
        _orderDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _requiredDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _department_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, allowNull: false })];
        _lineItems_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _subtotal_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _tax_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _total_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2), allowNull: false })];
        _shippingAddress_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _billingAddress_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ContractModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _poNumber_decorators, { kind: "field", name: "poNumber", static: false, private: false, access: { has: obj => "poNumber" in obj, get: obj => obj.poNumber, set: (obj, value) => { obj.poNumber = value; } }, metadata: _metadata }, _poNumber_initializers, _poNumber_extraInitializers);
        __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _orderDate_decorators, { kind: "field", name: "orderDate", static: false, private: false, access: { has: obj => "orderDate" in obj, get: obj => obj.orderDate, set: (obj, value) => { obj.orderDate = value; } }, metadata: _metadata }, _orderDate_initializers, _orderDate_extraInitializers);
        __esDecorate(null, null, _requiredDate_decorators, { kind: "field", name: "requiredDate", static: false, private: false, access: { has: obj => "requiredDate" in obj, get: obj => obj.requiredDate, set: (obj, value) => { obj.requiredDate = value; } }, metadata: _metadata }, _requiredDate_initializers, _requiredDate_extraInitializers);
        __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
        __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
        __esDecorate(null, null, _subtotal_decorators, { kind: "field", name: "subtotal", static: false, private: false, access: { has: obj => "subtotal" in obj, get: obj => obj.subtotal, set: (obj, value) => { obj.subtotal = value; } }, metadata: _metadata }, _subtotal_initializers, _subtotal_extraInitializers);
        __esDecorate(null, null, _tax_decorators, { kind: "field", name: "tax", static: false, private: false, access: { has: obj => "tax" in obj, get: obj => obj.tax, set: (obj, value) => { obj.tax = value; } }, metadata: _metadata }, _tax_initializers, _tax_extraInitializers);
        __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: obj => "total" in obj, get: obj => obj.total, set: (obj, value) => { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
        __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: obj => "shippingAddress" in obj, get: obj => obj.shippingAddress, set: (obj, value) => { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
        __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PurchaseOrderModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PurchaseOrderModel = _classThis;
})();
exports.PurchaseOrderModel = PurchaseOrderModel;
/**
 * Contract amendment model for Sequelize ORM
 */
let ContractAmendmentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'contract_amendments', timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _amendmentNumber_decorators;
    let _amendmentNumber_initializers = [];
    let _amendmentNumber_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _effectiveDate_decorators;
    let _effectiveDate_initializers = [];
    let _effectiveDate_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _contract_decorators;
    let _contract_initializers = [];
    let _contract_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var ContractAmendmentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.contractId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _contractId_initializers, void 0));
            this.amendmentNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _amendmentNumber_initializers, void 0));
            this.type = (__runInitializers(this, _amendmentNumber_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.changes = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.effectiveDate = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
            this.createdBy = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.metadata = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.contract = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _contract_initializers, void 0));
            this.createdAt = (__runInitializers(this, _contract_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ContractAmendmentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID)];
        _contractId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ContractModel), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _amendmentNumber_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false })];
        _type_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(AmendmentType)),
                allowNull: false,
            })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _changes_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: [] })];
        _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _createdBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, defaultValue: {} })];
        _contract_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ContractModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
        __esDecorate(null, null, _amendmentNumber_decorators, { kind: "field", name: "amendmentNumber", static: false, private: false, access: { has: obj => "amendmentNumber" in obj, get: obj => obj.amendmentNumber, set: (obj, value) => { obj.amendmentNumber = value; } }, metadata: _metadata }, _amendmentNumber_initializers, _amendmentNumber_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
        __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _contract_decorators, { kind: "field", name: "contract", static: false, private: false, access: { has: obj => "contract" in obj, get: obj => obj.contract, set: (obj, value) => { obj.contract = value; } }, metadata: _metadata }, _contract_initializers, _contract_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ContractAmendmentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ContractAmendmentModel = _classThis;
})();
exports.ContractAmendmentModel = ContractAmendmentModel;
// ============================================================================
// SWAGGER/OPENAPI DTOs
// ============================================================================
/**
 * Procurement creation DTO for Swagger
 */
let CreateProcurementDto = (() => {
    var _a;
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _method_decorators;
    let _method_initializers = [];
    let _method_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _projectNumber_decorators;
    let _projectNumber_initializers = [];
    let _projectNumber_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _specifications_decorators;
    let _specifications_initializers = [];
    let _specifications_extraInitializers = [];
    let _evaluationCriteria_decorators;
    let _evaluationCriteria_initializers = [];
    let _evaluationCriteria_extraInitializers = [];
    return _a = class CreateProcurementDto {
            constructor() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.method = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _method_initializers, void 0));
                this.title = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.department = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.projectNumber = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _projectNumber_initializers, void 0));
                this.estimatedValue = (__runInitializers(this, _projectNumber_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
                this.specifications = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _specifications_initializers, void 0));
                this.evaluationCriteria = (__runInitializers(this, _specifications_extraInitializers), __runInitializers(this, _evaluationCriteria_initializers, void 0));
                __runInitializers(this, _evaluationCriteria_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ProcurementType })];
            _method_decorators = [(0, swagger_1.ApiProperty)({ enum: ProcurementMethod })];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _department_decorators = [(0, swagger_1.ApiProperty)()];
            _projectNumber_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _estimatedValue_decorators = [(0, swagger_1.ApiProperty)()];
            _specifications_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' })];
            _evaluationCriteria_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: obj => "method" in obj, get: obj => obj.method, set: (obj, value) => { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _projectNumber_decorators, { kind: "field", name: "projectNumber", static: false, private: false, access: { has: obj => "projectNumber" in obj, get: obj => obj.projectNumber, set: (obj, value) => { obj.projectNumber = value; } }, metadata: _metadata }, _projectNumber_initializers, _projectNumber_extraInitializers);
            __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
            __esDecorate(null, null, _specifications_decorators, { kind: "field", name: "specifications", static: false, private: false, access: { has: obj => "specifications" in obj, get: obj => obj.specifications, set: (obj, value) => { obj.specifications = value; } }, metadata: _metadata }, _specifications_initializers, _specifications_extraInitializers);
            __esDecorate(null, null, _evaluationCriteria_decorators, { kind: "field", name: "evaluationCriteria", static: false, private: false, access: { has: obj => "evaluationCriteria" in obj, get: obj => obj.evaluationCriteria, set: (obj, value) => { obj.evaluationCriteria = value; } }, metadata: _metadata }, _evaluationCriteria_initializers, _evaluationCriteria_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateProcurementDto = CreateProcurementDto;
/**
 * Bid submission DTO for Swagger
 */
let CreateBidDto = (() => {
    var _a;
    let _procurementId_decorators;
    let _procurementId_initializers = [];
    let _procurementId_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _bidAmount_decorators;
    let _bidAmount_initializers = [];
    let _bidAmount_extraInitializers = [];
    let _documents_decorators;
    let _documents_initializers = [];
    let _documents_extraInitializers = [];
    return _a = class CreateBidDto {
            constructor() {
                this.procurementId = __runInitializers(this, _procurementId_initializers, void 0);
                this.vendorId = (__runInitializers(this, _procurementId_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                this.bidAmount = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _bidAmount_initializers, void 0));
                this.documents = (__runInitializers(this, _bidAmount_extraInitializers), __runInitializers(this, _documents_initializers, void 0));
                __runInitializers(this, _documents_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _procurementId_decorators = [(0, swagger_1.ApiProperty)()];
            _vendorId_decorators = [(0, swagger_1.ApiProperty)()];
            _bidAmount_decorators = [(0, swagger_1.ApiProperty)()];
            _documents_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            __esDecorate(null, null, _procurementId_decorators, { kind: "field", name: "procurementId", static: false, private: false, access: { has: obj => "procurementId" in obj, get: obj => obj.procurementId, set: (obj, value) => { obj.procurementId = value; } }, metadata: _metadata }, _procurementId_initializers, _procurementId_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _bidAmount_decorators, { kind: "field", name: "bidAmount", static: false, private: false, access: { has: obj => "bidAmount" in obj, get: obj => obj.bidAmount, set: (obj, value) => { obj.bidAmount = value; } }, metadata: _metadata }, _bidAmount_initializers, _bidAmount_extraInitializers);
            __esDecorate(null, null, _documents_decorators, { kind: "field", name: "documents", static: false, private: false, access: { has: obj => "documents" in obj, get: obj => obj.documents, set: (obj, value) => { obj.documents = value; } }, metadata: _metadata }, _documents_initializers, _documents_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateBidDto = CreateBidDto;
/**
 * Contract creation DTO for Swagger
 */
let CreateContractDto = (() => {
    var _a;
    let _procurementId_decorators;
    let _procurementId_initializers = [];
    let _procurementId_extraInitializers = [];
    let _contractNumber_decorators;
    let _contractNumber_initializers = [];
    let _contractNumber_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _startDate_decorators;
    let _startDate_initializers = [];
    let _startDate_extraInitializers = [];
    let _endDate_decorators;
    let _endDate_initializers = [];
    let _endDate_extraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _value_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _terms_decorators;
    let _terms_initializers = [];
    let _terms_extraInitializers = [];
    let _deliverables_decorators;
    let _deliverables_initializers = [];
    let _deliverables_extraInitializers = [];
    return _a = class CreateContractDto {
            constructor() {
                this.procurementId = __runInitializers(this, _procurementId_initializers, void 0);
                this.contractNumber = (__runInitializers(this, _procurementId_extraInitializers), __runInitializers(this, _contractNumber_initializers, void 0));
                this.type = (__runInitializers(this, _contractNumber_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.vendorId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                this.title = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.value = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _value_initializers, void 0));
                this.department = (__runInitializers(this, _value_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.terms = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _terms_initializers, void 0));
                this.deliverables = (__runInitializers(this, _terms_extraInitializers), __runInitializers(this, _deliverables_initializers, void 0));
                __runInitializers(this, _deliverables_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _procurementId_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _contractNumber_decorators = [(0, swagger_1.ApiProperty)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ContractType })];
            _vendorId_decorators = [(0, swagger_1.ApiProperty)()];
            _title_decorators = [(0, swagger_1.ApiProperty)()];
            _description_decorators = [(0, swagger_1.ApiProperty)()];
            _startDate_decorators = [(0, swagger_1.ApiProperty)()];
            _endDate_decorators = [(0, swagger_1.ApiProperty)()];
            _value_decorators = [(0, swagger_1.ApiProperty)()];
            _department_decorators = [(0, swagger_1.ApiProperty)()];
            _terms_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' })];
            _deliverables_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            __esDecorate(null, null, _procurementId_decorators, { kind: "field", name: "procurementId", static: false, private: false, access: { has: obj => "procurementId" in obj, get: obj => obj.procurementId, set: (obj, value) => { obj.procurementId = value; } }, metadata: _metadata }, _procurementId_initializers, _procurementId_extraInitializers);
            __esDecorate(null, null, _contractNumber_decorators, { kind: "field", name: "contractNumber", static: false, private: false, access: { has: obj => "contractNumber" in obj, get: obj => obj.contractNumber, set: (obj, value) => { obj.contractNumber = value; } }, metadata: _metadata }, _contractNumber_initializers, _contractNumber_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: obj => "startDate" in obj, get: obj => obj.startDate, set: (obj, value) => { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: obj => "endDate" in obj, get: obj => obj.endDate, set: (obj, value) => { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _value_decorators, { kind: "field", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } }, metadata: _metadata }, _value_initializers, _value_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _terms_decorators, { kind: "field", name: "terms", static: false, private: false, access: { has: obj => "terms" in obj, get: obj => obj.terms, set: (obj, value) => { obj.terms = value; } }, metadata: _metadata }, _terms_initializers, _terms_extraInitializers);
            __esDecorate(null, null, _deliverables_decorators, { kind: "field", name: "deliverables", static: false, private: false, access: { has: obj => "deliverables" in obj, get: obj => obj.deliverables, set: (obj, value) => { obj.deliverables = value; } }, metadata: _metadata }, _deliverables_initializers, _deliverables_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateContractDto = CreateContractDto;
/**
 * Vendor registration DTO for Swagger
 */
let RegisterVendorDto = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _businessType_decorators;
    let _businessType_initializers = [];
    let _businessType_extraInitializers = [];
    let _taxId_decorators;
    let _taxId_initializers = [];
    let _taxId_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _contact_decorators;
    let _contact_initializers = [];
    let _contact_extraInitializers = [];
    let _certifications_decorators;
    let _certifications_initializers = [];
    let _certifications_extraInitializers = [];
    let _financialInfo_decorators;
    let _financialInfo_initializers = [];
    let _financialInfo_extraInitializers = [];
    return _a = class RegisterVendorDto {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.businessType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _businessType_initializers, void 0));
                this.taxId = (__runInitializers(this, _businessType_extraInitializers), __runInitializers(this, _taxId_initializers, void 0));
                this.address = (__runInitializers(this, _taxId_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.contact = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _contact_initializers, void 0));
                this.certifications = (__runInitializers(this, _contact_extraInitializers), __runInitializers(this, _certifications_initializers, void 0));
                this.financialInfo = (__runInitializers(this, _certifications_extraInitializers), __runInitializers(this, _financialInfo_initializers, void 0));
                __runInitializers(this, _financialInfo_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _businessType_decorators = [(0, swagger_1.ApiProperty)()];
            _taxId_decorators = [(0, swagger_1.ApiProperty)()];
            _address_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' })];
            _contact_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' })];
            _certifications_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            _financialInfo_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _businessType_decorators, { kind: "field", name: "businessType", static: false, private: false, access: { has: obj => "businessType" in obj, get: obj => obj.businessType, set: (obj, value) => { obj.businessType = value; } }, metadata: _metadata }, _businessType_initializers, _businessType_extraInitializers);
            __esDecorate(null, null, _taxId_decorators, { kind: "field", name: "taxId", static: false, private: false, access: { has: obj => "taxId" in obj, get: obj => obj.taxId, set: (obj, value) => { obj.taxId = value; } }, metadata: _metadata }, _taxId_initializers, _taxId_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _contact_decorators, { kind: "field", name: "contact", static: false, private: false, access: { has: obj => "contact" in obj, get: obj => obj.contact, set: (obj, value) => { obj.contact = value; } }, metadata: _metadata }, _contact_initializers, _contact_extraInitializers);
            __esDecorate(null, null, _certifications_decorators, { kind: "field", name: "certifications", static: false, private: false, access: { has: obj => "certifications" in obj, get: obj => obj.certifications, set: (obj, value) => { obj.certifications = value; } }, metadata: _metadata }, _certifications_initializers, _certifications_extraInitializers);
            __esDecorate(null, null, _financialInfo_decorators, { kind: "field", name: "financialInfo", static: false, private: false, access: { has: obj => "financialInfo" in obj, get: obj => obj.financialInfo, set: (obj, value) => { obj.financialInfo = value; } }, metadata: _metadata }, _financialInfo_initializers, _financialInfo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.RegisterVendorDto = RegisterVendorDto;
/**
 * Purchase order creation DTO for Swagger
 */
let CreatePurchaseOrderDto = (() => {
    var _a;
    let _contractId_decorators;
    let _contractId_initializers = [];
    let _contractId_extraInitializers = [];
    let _poNumber_decorators;
    let _poNumber_initializers = [];
    let _poNumber_extraInitializers = [];
    let _vendorId_decorators;
    let _vendorId_initializers = [];
    let _vendorId_extraInitializers = [];
    let _orderDate_decorators;
    let _orderDate_initializers = [];
    let _orderDate_extraInitializers = [];
    let _requiredDate_decorators;
    let _requiredDate_initializers = [];
    let _requiredDate_extraInitializers = [];
    let _department_decorators;
    let _department_initializers = [];
    let _department_extraInitializers = [];
    let _lineItems_decorators;
    let _lineItems_initializers = [];
    let _lineItems_extraInitializers = [];
    let _shippingAddress_decorators;
    let _shippingAddress_initializers = [];
    let _shippingAddress_extraInitializers = [];
    let _billingAddress_decorators;
    let _billingAddress_initializers = [];
    let _billingAddress_extraInitializers = [];
    return _a = class CreatePurchaseOrderDto {
            constructor() {
                this.contractId = __runInitializers(this, _contractId_initializers, void 0);
                this.poNumber = (__runInitializers(this, _contractId_extraInitializers), __runInitializers(this, _poNumber_initializers, void 0));
                this.vendorId = (__runInitializers(this, _poNumber_extraInitializers), __runInitializers(this, _vendorId_initializers, void 0));
                this.orderDate = (__runInitializers(this, _vendorId_extraInitializers), __runInitializers(this, _orderDate_initializers, void 0));
                this.requiredDate = (__runInitializers(this, _orderDate_extraInitializers), __runInitializers(this, _requiredDate_initializers, void 0));
                this.department = (__runInitializers(this, _requiredDate_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.lineItems = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _lineItems_initializers, void 0));
                this.shippingAddress = (__runInitializers(this, _lineItems_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
                this.billingAddress = (__runInitializers(this, _shippingAddress_extraInitializers), __runInitializers(this, _billingAddress_initializers, void 0));
                __runInitializers(this, _billingAddress_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _contractId_decorators = [(0, swagger_1.ApiProperty)({ required: false })];
            _poNumber_decorators = [(0, swagger_1.ApiProperty)()];
            _vendorId_decorators = [(0, swagger_1.ApiProperty)()];
            _orderDate_decorators = [(0, swagger_1.ApiProperty)()];
            _requiredDate_decorators = [(0, swagger_1.ApiProperty)()];
            _department_decorators = [(0, swagger_1.ApiProperty)()];
            _lineItems_decorators = [(0, swagger_1.ApiProperty)({ type: [Object] })];
            _shippingAddress_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' })];
            _billingAddress_decorators = [(0, swagger_1.ApiProperty)({ type: 'object' })];
            __esDecorate(null, null, _contractId_decorators, { kind: "field", name: "contractId", static: false, private: false, access: { has: obj => "contractId" in obj, get: obj => obj.contractId, set: (obj, value) => { obj.contractId = value; } }, metadata: _metadata }, _contractId_initializers, _contractId_extraInitializers);
            __esDecorate(null, null, _poNumber_decorators, { kind: "field", name: "poNumber", static: false, private: false, access: { has: obj => "poNumber" in obj, get: obj => obj.poNumber, set: (obj, value) => { obj.poNumber = value; } }, metadata: _metadata }, _poNumber_initializers, _poNumber_extraInitializers);
            __esDecorate(null, null, _vendorId_decorators, { kind: "field", name: "vendorId", static: false, private: false, access: { has: obj => "vendorId" in obj, get: obj => obj.vendorId, set: (obj, value) => { obj.vendorId = value; } }, metadata: _metadata }, _vendorId_initializers, _vendorId_extraInitializers);
            __esDecorate(null, null, _orderDate_decorators, { kind: "field", name: "orderDate", static: false, private: false, access: { has: obj => "orderDate" in obj, get: obj => obj.orderDate, set: (obj, value) => { obj.orderDate = value; } }, metadata: _metadata }, _orderDate_initializers, _orderDate_extraInitializers);
            __esDecorate(null, null, _requiredDate_decorators, { kind: "field", name: "requiredDate", static: false, private: false, access: { has: obj => "requiredDate" in obj, get: obj => obj.requiredDate, set: (obj, value) => { obj.requiredDate = value; } }, metadata: _metadata }, _requiredDate_initializers, _requiredDate_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: obj => "department" in obj, get: obj => obj.department, set: (obj, value) => { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _lineItems_decorators, { kind: "field", name: "lineItems", static: false, private: false, access: { has: obj => "lineItems" in obj, get: obj => obj.lineItems, set: (obj, value) => { obj.lineItems = value; } }, metadata: _metadata }, _lineItems_initializers, _lineItems_extraInitializers);
            __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: obj => "shippingAddress" in obj, get: obj => obj.shippingAddress, set: (obj, value) => { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
            __esDecorate(null, null, _billingAddress_decorators, { kind: "field", name: "billingAddress", static: false, private: false, access: { has: obj => "billingAddress" in obj, get: obj => obj.billingAddress, set: (obj, value) => { obj.billingAddress = value; } }, metadata: _metadata }, _billingAddress_initializers, _billingAddress_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreatePurchaseOrderDto = CreatePurchaseOrderDto;
// ============================================================================
// ID GENERATION
// ============================================================================
/**
 * @function createProcurementId
 * @description Generates a unique procurement ID
 * @returns {ProcurementId} Unique procurement ID
 *
 * @example
 * ```typescript
 * const procurementId = createProcurementId();
 * ```
 */
const createProcurementId = () => {
    return `proc_${crypto.randomUUID()}`;
};
exports.createProcurementId = createProcurementId;
/**
 * @function createContractId
 * @description Generates a unique contract ID
 * @returns {ContractId} Unique contract ID
 *
 * @example
 * ```typescript
 * const contractId = createContractId();
 * ```
 */
const createContractId = () => {
    return `cont_${crypto.randomUUID()}`;
};
exports.createContractId = createContractId;
/**
 * @function createBidId
 * @description Generates a unique bid ID
 * @returns {BidId} Unique bid ID
 *
 * @example
 * ```typescript
 * const bidId = createBidId();
 * ```
 */
const createBidId = () => {
    return `bid_${crypto.randomUUID()}`;
};
exports.createBidId = createBidId;
/**
 * @function createVendorId
 * @description Generates a unique vendor ID
 * @returns {VendorId} Unique vendor ID
 *
 * @example
 * ```typescript
 * const vendorId = createVendorId();
 * ```
 */
const createVendorId = () => {
    return `ven_${crypto.randomUUID()}`;
};
exports.createVendorId = createVendorId;
/**
 * @function createPurchaseOrderId
 * @description Generates a unique purchase order ID
 * @returns {PurchaseOrderId} Unique purchase order ID
 *
 * @example
 * ```typescript
 * const poId = createPurchaseOrderId();
 * ```
 */
const createPurchaseOrderId = () => {
    return `po_${crypto.randomUUID()}`;
};
exports.createPurchaseOrderId = createPurchaseOrderId;
/**
 * @function createAmendmentId
 * @description Generates a unique amendment ID
 * @returns {AmendmentId} Unique amendment ID
 *
 * @example
 * ```typescript
 * const amendmentId = createAmendmentId();
 * ```
 */
const createAmendmentId = () => {
    return `amd_${crypto.randomUUID()}`;
};
exports.createAmendmentId = createAmendmentId;
// ============================================================================
// RFP/RFQ/RFI CREATION AND MANAGEMENT
// ============================================================================
/**
 * @function createProcurementRequest
 * @description Creates a new procurement request
 * @param {ProcurementType} type - Type of procurement
 * @param {ProcurementMethod} method - Procurement method
 * @param {string} title - Procurement title
 * @param {string} description - Procurement description
 * @param {string} department - Requesting department
 * @param {number} estimatedValue - Estimated value
 * @param {UserId} createdBy - Creator user ID
 * @returns {ProcurementRequest} Created procurement request
 *
 * @example
 * ```typescript
 * const rfp = createProcurementRequest(
 *   ProcurementType.RFP,
 *   ProcurementMethod.COMPETITIVE_BIDDING,
 *   'IT Infrastructure Upgrade',
 *   'Request for proposal to upgrade datacenter infrastructure',
 *   'IT Department',
 *   500000,
 *   userId
 * );
 * ```
 */
const createProcurementRequest = (type, method, title, description, department, estimatedValue, createdBy) => {
    return {
        id: (0, exports.createProcurementId)(),
        type,
        method,
        title,
        description,
        department,
        estimatedValue,
        status: ProcurementStatus.DRAFT,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        specifications: {},
        evaluationCriteria: [],
        metadata: {},
    };
};
exports.createProcurementRequest = createProcurementRequest;
/**
 * @function publishProcurement
 * @description Publishes a procurement request
 * @param {ProcurementRequest} procurement - Procurement to publish
 * @param {Date} closeDate - Bid close date
 * @param {Date} openDate - Bid open date
 * @returns {ProcurementRequest} Published procurement
 *
 * @example
 * ```typescript
 * const published = publishProcurement(
 *   procurement,
 *   new Date('2024-12-31'),
 *   new Date('2025-01-15')
 * );
 * ```
 */
const publishProcurement = (procurement, closeDate, openDate) => {
    return {
        ...procurement,
        status: ProcurementStatus.PUBLISHED,
        publishedDate: new Date(),
        closeDate,
        openDate,
        updatedAt: new Date(),
    };
};
exports.publishProcurement = publishProcurement;
/**
 * @function addEvaluationCriteria
 * @description Adds evaluation criteria to procurement
 * @param {ProcurementRequest} procurement - Procurement request
 * @param {EvaluationCriteria} criteria - Evaluation criteria
 * @returns {ProcurementRequest} Updated procurement
 *
 * @example
 * ```typescript
 * const updated = addEvaluationCriteria(procurement, {
 *   criteriaId: 'tech-1',
 *   name: 'Technical Capability',
 *   description: 'Vendor technical expertise',
 *   weight: 40,
 *   maxScore: 100,
 *   type: 'technical'
 * });
 * ```
 */
const addEvaluationCriteria = (procurement, criteria) => {
    return {
        ...procurement,
        evaluationCriteria: [...procurement.evaluationCriteria, criteria],
        updatedAt: new Date(),
    };
};
exports.addEvaluationCriteria = addEvaluationCriteria;
/**
 * @function closeBidding
 * @description Closes bidding for procurement
 * @param {ProcurementRequest} procurement - Procurement to close
 * @returns {ProcurementRequest} Updated procurement
 *
 * @example
 * ```typescript
 * const closed = closeBidding(procurement);
 * ```
 */
const closeBidding = (procurement) => {
    return {
        ...procurement,
        status: ProcurementStatus.BID_CLOSED,
        updatedAt: new Date(),
    };
};
exports.closeBidding = closeBidding;
/**
 * @function cancelProcurement
 * @description Cancels a procurement request
 * @param {ProcurementRequest} procurement - Procurement to cancel
 * @param {string} reason - Cancellation reason
 * @returns {ProcurementRequest} Cancelled procurement
 *
 * @example
 * ```typescript
 * const cancelled = cancelProcurement(procurement, 'Requirements changed');
 * ```
 */
const cancelProcurement = (procurement, reason) => {
    return {
        ...procurement,
        status: ProcurementStatus.CANCELLED,
        metadata: {
            ...procurement.metadata,
            cancellationReason: reason,
            cancelledAt: new Date(),
        },
        updatedAt: new Date(),
    };
};
exports.cancelProcurement = cancelProcurement;
// ============================================================================
// BID EVALUATION AND SCORING
// ============================================================================
/**
 * @function createBid
 * @description Creates a new bid submission
 * @param {ProcurementId} procurementId - Procurement ID
 * @param {VendorId} vendorId - Vendor ID
 * @param {number} bidAmount - Bid amount
 * @returns {Bid} Created bid
 *
 * @example
 * ```typescript
 * const bid = createBid(procurementId, vendorId, 450000);
 * ```
 */
const createBid = (procurementId, vendorId, bidAmount) => {
    return {
        id: (0, exports.createBidId)(),
        procurementId,
        vendorId,
        bidAmount,
        status: BidStatus.SUBMITTED,
        submittedAt: new Date(),
        documents: [],
        metadata: {},
    };
};
exports.createBid = createBid;
/**
 * @function evaluateBid
 * @description Evaluates a bid against criteria
 * @param {Bid} bid - Bid to evaluate
 * @param {CriteriaScore[]} scores - Criteria scores
 * @param {UserId} evaluatedBy - Evaluator user ID
 * @returns {BidEvaluationResult} Evaluation result
 *
 * @example
 * ```typescript
 * const evaluation = evaluateBid(bid, scores, evaluatorId);
 * ```
 */
const evaluateBid = (bid, scores, evaluatedBy) => {
    const totalScore = scores.reduce((sum, s) => sum + s.weightedScore, 0);
    let recommendation = 'reject';
    if (totalScore >= 80) {
        recommendation = 'award';
    }
    else if (totalScore >= 60) {
        recommendation = 'shortlist';
    }
    return {
        bidId: bid.id,
        scores,
        totalScore,
        rank: 0, // Set by ranking function
        recommendation,
        evaluatedBy,
        evaluatedAt: new Date(),
        notes: '',
    };
};
exports.evaluateBid = evaluateBid;
/**
 * @function calculateTechnicalScore
 * @description Calculates technical score from criteria
 * @param {CriteriaScore[]} scores - Criteria scores
 * @returns {number} Technical score
 *
 * @example
 * ```typescript
 * const techScore = calculateTechnicalScore(scores);
 * ```
 */
const calculateTechnicalScore = (scores) => {
    const technicalScores = scores.filter(s => ['technical', 'experience', 'qualifications', 'past_performance'].includes(s.criteriaId));
    return technicalScores.reduce((sum, s) => sum + s.weightedScore, 0);
};
exports.calculateTechnicalScore = calculateTechnicalScore;
/**
 * @function calculatePriceScore
 * @description Calculates price score using low bid method
 * @param {number} bidAmount - Bid amount
 * @param {number} lowestBid - Lowest bid amount
 * @param {number} maxScore - Maximum score
 * @returns {number} Price score
 *
 * @example
 * ```typescript
 * const priceScore = calculatePriceScore(500000, 450000, 100);
 * ```
 */
const calculatePriceScore = (bidAmount, lowestBid, maxScore) => {
    return (lowestBid / bidAmount) * maxScore;
};
exports.calculatePriceScore = calculatePriceScore;
/**
 * @function rankBids
 * @description Ranks bids by total score
 * @param {BidEvaluationResult[]} evaluations - Bid evaluations
 * @returns {BidEvaluationResult[]} Ranked evaluations
 *
 * @example
 * ```typescript
 * const ranked = rankBids(evaluations);
 * ```
 */
const rankBids = (evaluations) => {
    const sorted = [...evaluations].sort((a, b) => b.totalScore - a.totalScore);
    return sorted.map((evaluation, index) => ({
        ...evaluation,
        rank: index + 1,
    }));
};
exports.rankBids = rankBids;
/**
 * @function identifyLowestResponsiveBid
 * @description Identifies lowest responsive bid
 * @param {Bid[]} bids - All bids
 * @param {BidEvaluationResult[]} evaluations - Evaluations
 * @returns {Bid | null} Lowest responsive bid
 *
 * @example
 * ```typescript
 * const lowestBid = identifyLowestResponsiveBid(bids, evaluations);
 * ```
 */
const identifyLowestResponsiveBid = (bids, evaluations) => {
    const responsiveBids = evaluations
        .filter(e => e.recommendation !== 'reject')
        .map(e => bids.find(b => b.id === e.bidId))
        .filter((b) => b !== undefined);
    if (responsiveBids.length === 0)
        return null;
    return responsiveBids.reduce((lowest, bid) => bid.bidAmount < lowest.bidAmount ? bid : lowest);
};
exports.identifyLowestResponsiveBid = identifyLowestResponsiveBid;
// ============================================================================
// CONTRACT LIFECYCLE MANAGEMENT
// ============================================================================
/**
 * @function createContract
 * @description Creates a new contract
 * @param {string} contractNumber - Contract number
 * @param {ContractType} type - Contract type
 * @param {VendorId} vendorId - Vendor ID
 * @param {string} title - Contract title
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} value - Contract value
 * @param {string} department - Department
 * @param {UserId} createdBy - Creator user ID
 * @returns {Contract} Created contract
 *
 * @example
 * ```typescript
 * const contract = createContract(
 *   'CON-2024-001',
 *   ContractType.FIXED_PRICE,
 *   vendorId,
 *   'IT Infrastructure Upgrade',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31'),
 *   500000,
 *   'IT Department',
 *   userId
 * );
 * ```
 */
const createContract = (contractNumber, type, vendorId, title, startDate, endDate, value, department, createdBy) => {
    return {
        id: (0, exports.createContractId)(),
        contractNumber,
        type,
        status: ContractStatus.DRAFT,
        vendorId,
        title,
        description: '',
        startDate,
        endDate,
        value,
        department,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        terms: {
            paymentTerms: '',
            deliverySchedule: '',
            terminationClause: '',
        },
        deliverables: [],
        metadata: {},
    };
};
exports.createContract = createContract;
/**
 * @function activateContract
 * @description Activates an approved contract
 * @param {Contract} contract - Contract to activate
 * @param {UserId} approvedBy - Approver user ID
 * @returns {Contract} Activated contract
 *
 * @example
 * ```typescript
 * const active = activateContract(contract, approverId);
 * ```
 */
const activateContract = (contract, approvedBy) => {
    return {
        ...contract,
        status: ContractStatus.ACTIVE,
        approvedBy,
        updatedAt: new Date(),
    };
};
exports.activateContract = activateContract;
/**
 * @function suspendContract
 * @description Suspends an active contract
 * @param {Contract} contract - Contract to suspend
 * @param {string} reason - Suspension reason
 * @returns {Contract} Suspended contract
 *
 * @example
 * ```typescript
 * const suspended = suspendContract(contract, 'Performance issues');
 * ```
 */
const suspendContract = (contract, reason) => {
    return {
        ...contract,
        status: ContractStatus.SUSPENDED,
        metadata: {
            ...contract.metadata,
            suspensionReason: reason,
            suspendedAt: new Date(),
        },
        updatedAt: new Date(),
    };
};
exports.suspendContract = suspendContract;
/**
 * @function terminateContract
 * @description Terminates a contract
 * @param {Contract} contract - Contract to terminate
 * @param {string} reason - Termination reason
 * @returns {Contract} Terminated contract
 *
 * @example
 * ```typescript
 * const terminated = terminateContract(contract, 'Breach of contract');
 * ```
 */
const terminateContract = (contract, reason) => {
    return {
        ...contract,
        status: ContractStatus.TERMINATED,
        metadata: {
            ...contract.metadata,
            terminationReason: reason,
            terminatedAt: new Date(),
        },
        updatedAt: new Date(),
    };
};
exports.terminateContract = terminateContract;
/**
 * @function renewContract
 * @description Renews a contract
 * @param {Contract} contract - Contract to renew
 * @param {Date} newEndDate - New end date
 * @param {number} newValue - New contract value
 * @returns {Contract} Renewed contract
 *
 * @example
 * ```typescript
 * const renewed = renewContract(contract, new Date('2025-12-31'), 550000);
 * ```
 */
const renewContract = (contract, newEndDate, newValue) => {
    return {
        ...contract,
        endDate: newEndDate,
        value: newValue,
        status: ContractStatus.RENEWED,
        metadata: {
            ...contract.metadata,
            renewedAt: new Date(),
            previousEndDate: contract.endDate,
            previousValue: contract.value,
        },
        updatedAt: new Date(),
    };
};
exports.renewContract = renewContract;
/**
 * @function checkContractExpiration
 * @description Checks if contract is expiring soon
 * @param {Contract} contract - Contract to check
 * @param {number} daysThreshold - Days threshold
 * @returns {object} Expiration check result
 *
 * @example
 * ```typescript
 * const check = checkContractExpiration(contract, 30);
 * if (check.isExpiringSoon) {
 *   // Send renewal notification
 * }
 * ```
 */
const checkContractExpiration = (contract, daysThreshold = 30) => {
    const now = new Date();
    const endDate = new Date(contract.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
        isExpiringSoon: daysRemaining <= daysThreshold && daysRemaining > 0,
        daysRemaining,
        isExpired: daysRemaining < 0,
    };
};
exports.checkContractExpiration = checkContractExpiration;
// ============================================================================
// PURCHASE ORDER PROCESSING
// ============================================================================
/**
 * @function createPurchaseOrder
 * @description Creates a new purchase order
 * @param {string} poNumber - PO number
 * @param {VendorId} vendorId - Vendor ID
 * @param {Date} orderDate - Order date
 * @param {Date} requiredDate - Required date
 * @param {string} department - Department
 * @param {LineItem[]} lineItems - Line items
 * @param {UserId} createdBy - Creator user ID
 * @returns {PurchaseOrder} Created purchase order
 *
 * @example
 * ```typescript
 * const po = createPurchaseOrder(
 *   'PO-2024-001',
 *   vendorId,
 *   new Date(),
 *   new Date('2024-03-01'),
 *   'IT Department',
 *   lineItems,
 *   userId
 * );
 * ```
 */
const createPurchaseOrder = (poNumber, vendorId, orderDate, requiredDate, department, lineItems, createdBy) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // Example tax rate
    const total = subtotal + tax;
    return {
        id: (0, exports.createPurchaseOrderId)(),
        poNumber,
        vendorId,
        status: PurchaseOrderStatus.DRAFT,
        orderDate,
        requiredDate,
        department,
        lineItems,
        subtotal,
        tax,
        total,
        shippingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
        },
        billingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
        },
        createdBy,
        metadata: {},
    };
};
exports.createPurchaseOrder = createPurchaseOrder;
/**
 * @function approvePurchaseOrder
 * @description Approves a purchase order
 * @param {PurchaseOrder} po - Purchase order to approve
 * @param {UserId} approvedBy - Approver user ID
 * @returns {PurchaseOrder} Approved purchase order
 *
 * @example
 * ```typescript
 * const approved = approvePurchaseOrder(po, approverId);
 * ```
 */
const approvePurchaseOrder = (po, approvedBy) => {
    return {
        ...po,
        status: PurchaseOrderStatus.APPROVED,
        approvedBy,
    };
};
exports.approvePurchaseOrder = approvePurchaseOrder;
/**
 * @function sendPurchaseOrderToVendor
 * @description Sends purchase order to vendor
 * @param {PurchaseOrder} po - Purchase order to send
 * @returns {PurchaseOrder} Updated purchase order
 *
 * @example
 * ```typescript
 * const sent = sendPurchaseOrderToVendor(po);
 * ```
 */
const sendPurchaseOrderToVendor = (po) => {
    return {
        ...po,
        status: PurchaseOrderStatus.SENT_TO_VENDOR,
        metadata: {
            ...po.metadata,
            sentToVendorAt: new Date(),
        },
    };
};
exports.sendPurchaseOrderToVendor = sendPurchaseOrderToVendor;
/**
 * @function receivePurchaseOrder
 * @description Marks purchase order as received
 * @param {PurchaseOrder} po - Purchase order to receive
 * @param {boolean} partial - Partial receipt flag
 * @returns {PurchaseOrder} Updated purchase order
 *
 * @example
 * ```typescript
 * const received = receivePurchaseOrder(po, false);
 * ```
 */
const receivePurchaseOrder = (po, partial = false) => {
    return {
        ...po,
        status: partial ? PurchaseOrderStatus.PARTIALLY_RECEIVED : PurchaseOrderStatus.RECEIVED,
        metadata: {
            ...po.metadata,
            receivedAt: new Date(),
        },
    };
};
exports.receivePurchaseOrder = receivePurchaseOrder;
/**
 * @function calculatePOTotal
 * @description Calculates purchase order total with tax
 * @param {LineItem[]} lineItems - Line items
 * @param {number} taxRate - Tax rate (0-1)
 * @returns {object} Calculated totals
 *
 * @example
 * ```typescript
 * const totals = calculatePOTotal(lineItems, 0.08);
 * ```
 */
const calculatePOTotal = (lineItems, taxRate) => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return { subtotal, tax, total };
};
exports.calculatePOTotal = calculatePOTotal;
// ============================================================================
// VENDOR PRE-QUALIFICATION
// ============================================================================
/**
 * @function createVendor
 * @description Creates a new vendor record
 * @param {string} name - Vendor name
 * @param {string} businessType - Business type
 * @param {string} taxId - Tax ID
 * @param {VendorAddress} address - Vendor address
 * @param {VendorContact} contact - Contact information
 * @returns {Vendor} Created vendor
 *
 * @example
 * ```typescript
 * const vendor = createVendor(
 *   'Tech Solutions Inc',
 *   'Corporation',
 *   '12-3456789',
 *   address,
 *   contact
 * );
 * ```
 */
const createVendor = (name, businessType, taxId, address, contact) => {
    return {
        id: (0, exports.createVendorId)(),
        name,
        businessType,
        taxId,
        address,
        contact,
        qualificationStatus: VendorQualificationStatus.PENDING,
        certifications: [],
        financialInfo: {
            insuranceCoverage: [],
        },
        performanceHistory: [],
        registeredAt: new Date(),
        metadata: {},
    };
};
exports.createVendor = createVendor;
/**
 * @function qualifyVendor
 * @description Qualifies a vendor
 * @param {Vendor} vendor - Vendor to qualify
 * @returns {Vendor} Qualified vendor
 *
 * @example
 * ```typescript
 * const qualified = qualifyVendor(vendor);
 * ```
 */
const qualifyVendor = (vendor) => {
    return {
        ...vendor,
        qualificationStatus: VendorQualificationStatus.QUALIFIED,
        metadata: {
            ...vendor.metadata,
            qualifiedAt: new Date(),
        },
    };
};
exports.qualifyVendor = qualifyVendor;
/**
 * @function disqualifyVendor
 * @description Disqualifies a vendor
 * @param {Vendor} vendor - Vendor to disqualify
 * @param {string} reason - Disqualification reason
 * @returns {Vendor} Disqualified vendor
 *
 * @example
 * ```typescript
 * const disqualified = disqualifyVendor(vendor, 'Failed financial review');
 * ```
 */
const disqualifyVendor = (vendor, reason) => {
    return {
        ...vendor,
        qualificationStatus: VendorQualificationStatus.DISQUALIFIED,
        metadata: {
            ...vendor.metadata,
            disqualificationReason: reason,
            disqualifiedAt: new Date(),
        },
    };
};
exports.disqualifyVendor = disqualifyVendor;
/**
 * @function addVendorCertification
 * @description Adds certification to vendor
 * @param {Vendor} vendor - Vendor
 * @param {Certification} certification - Certification to add
 * @returns {Vendor} Updated vendor
 *
 * @example
 * ```typescript
 * const updated = addVendorCertification(vendor, certification);
 * ```
 */
const addVendorCertification = (vendor, certification) => {
    return {
        ...vendor,
        certifications: [...vendor.certifications, certification],
    };
};
exports.addVendorCertification = addVendorCertification;
/**
 * @function checkCertificationExpiry
 * @description Checks if vendor certifications are expired
 * @param {Vendor} vendor - Vendor to check
 * @returns {Certification[]} Expired certifications
 *
 * @example
 * ```typescript
 * const expired = checkCertificationExpiry(vendor);
 * ```
 */
const checkCertificationExpiry = (vendor) => {
    const now = new Date();
    return vendor.certifications.filter(cert => cert.expiryDate < now);
};
exports.checkCertificationExpiry = checkCertificationExpiry;
// ============================================================================
// CONTRACT AMENDMENTS AND RENEWALS
// ============================================================================
/**
 * @function createContractAmendment
 * @description Creates a contract amendment
 * @param {ContractId} contractId - Contract ID
 * @param {number} amendmentNumber - Amendment number
 * @param {AmendmentType} type - Amendment type
 * @param {string} description - Description
 * @param {AmendmentChange[]} changes - Changes
 * @param {Date} effectiveDate - Effective date
 * @param {UserId} createdBy - Creator user ID
 * @returns {ContractAmendment} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = createContractAmendment(
 *   contractId,
 *   1,
 *   AmendmentType.PRICE_ADJUSTMENT,
 *   'Price increase due to inflation',
 *   changes,
 *   new Date('2024-04-01'),
 *   userId
 * );
 * ```
 */
const createContractAmendment = (contractId, amendmentNumber, type, description, changes, effectiveDate, createdBy) => {
    return {
        id: (0, exports.createAmendmentId)(),
        contractId,
        amendmentNumber,
        type,
        description,
        changes,
        effectiveDate,
        createdBy,
        createdAt: new Date(),
        metadata: {},
    };
};
exports.createContractAmendment = createContractAmendment;
/**
 * @function applyContractAmendment
 * @description Applies amendment to contract
 * @param {Contract} contract - Contract to amend
 * @param {ContractAmendment} amendment - Amendment to apply
 * @returns {Contract} Amended contract
 *
 * @example
 * ```typescript
 * const amended = applyContractAmendment(contract, amendment);
 * ```
 */
const applyContractAmendment = (contract, amendment) => {
    const updated = { ...contract };
    for (const change of amendment.changes) {
        if (change.field === 'value') {
            updated.value = change.newValue;
        }
        else if (change.field === 'endDate') {
            updated.endDate = new Date(change.newValue);
        }
    }
    return {
        ...updated,
        updatedAt: new Date(),
        metadata: {
            ...updated.metadata,
            lastAmendment: {
                amendmentId: amendment.id,
                type: amendment.type,
                effectiveDate: amendment.effectiveDate,
            },
        },
    };
};
exports.applyContractAmendment = applyContractAmendment;
// ============================================================================
// SOLE SOURCE JUSTIFICATION
// ============================================================================
/**
 * @function createSoleSourceJustification
 * @description Creates sole source justification
 * @param {ProcurementId} procurementId - Procurement ID
 * @param {VendorId} vendorId - Vendor ID
 * @param {string} reason - Reason for sole source
 * @param {string} justification - Detailed justification
 * @returns {SoleSourceJustification} Created justification
 *
 * @example
 * ```typescript
 * const justification = createSoleSourceJustification(
 *   procurementId,
 *   vendorId,
 *   'Only qualified vendor',
 *   'This vendor holds exclusive rights...'
 * );
 * ```
 */
const createSoleSourceJustification = (procurementId, vendorId, reason, justification) => {
    return {
        procurementId,
        vendorId,
        reason,
        justification,
        marketResearch: '',
        alternativesConsidered: [],
        costAnalysis: '',
    };
};
exports.createSoleSourceJustification = createSoleSourceJustification;
/**
 * @function validateSoleSourceJustification
 * @description Validates sole source justification completeness
 * @param {SoleSourceJustification} justification - Justification to validate
 * @returns {object} Validation result
 *
 * @example
 * ```typescript
 * const validation = validateSoleSourceJustification(justification);
 * if (!validation.isValid) {
 *   console.log(validation.errors);
 * }
 * ```
 */
const validateSoleSourceJustification = (justification) => {
    const errors = [];
    if (!justification.justification || justification.justification.length < 50) {
        errors.push('Justification must be at least 50 characters');
    }
    if (!justification.marketResearch) {
        errors.push('Market research is required');
    }
    if (justification.alternativesConsidered.length === 0) {
        errors.push('At least one alternative must be considered');
    }
    if (!justification.costAnalysis) {
        errors.push('Cost analysis is required');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateSoleSourceJustification = validateSoleSourceJustification;
// ============================================================================
// COMPLIANCE TRACKING
// ============================================================================
/**
 * @function createComplianceCheck
 * @description Creates a compliance check record
 * @param {ContractId} contractId - Contract ID
 * @param {string} checkType - Type of compliance check
 * @param {UserId} performedBy - User performing check
 * @returns {ComplianceCheck} Created compliance check
 *
 * @example
 * ```typescript
 * const check = createComplianceCheck(
 *   contractId,
 *   'Quarterly Review',
 *   userId
 * );
 * ```
 */
const createComplianceCheck = (contractId, checkType, performedBy) => {
    return {
        checkId: crypto.randomUUID(),
        contractId,
        checkDate: new Date(),
        checkType,
        compliant: true,
        findings: [],
        performedBy,
    };
};
exports.createComplianceCheck = createComplianceCheck;
/**
 * @function addComplianceFinding
 * @description Adds a compliance finding
 * @param {ComplianceCheck} check - Compliance check
 * @param {ComplianceFinding} finding - Finding to add
 * @returns {ComplianceCheck} Updated compliance check
 *
 * @example
 * ```typescript
 * const updated = addComplianceFinding(check, finding);
 * ```
 */
const addComplianceFinding = (check, finding) => {
    return {
        ...check,
        compliant: false,
        findings: [...check.findings, finding],
    };
};
exports.addComplianceFinding = addComplianceFinding;
/**
 * @function trackContractCompliance
 * @description Tracks overall contract compliance
 * @param {Contract} contract - Contract to track
 * @param {ComplianceCheck[]} checks - All compliance checks
 * @returns {object} Compliance summary
 *
 * @example
 * ```typescript
 * const summary = trackContractCompliance(contract, checks);
 * ```
 */
const trackContractCompliance = (contract, checks) => {
    const totalChecks = checks.length;
    const compliantChecks = checks.filter(c => c.compliant).length;
    const allFindings = checks.flatMap(c => c.findings);
    const openFindings = allFindings.filter(f => !f.resolved).length;
    const criticalFindings = allFindings.filter(f => f.severity === 'critical' && !f.resolved).length;
    const complianceRate = totalChecks > 0 ? (compliantChecks / totalChecks) * 100 : 100;
    return {
        totalChecks,
        compliantChecks,
        openFindings,
        criticalFindings,
        complianceRate,
    };
};
exports.trackContractCompliance = trackContractCompliance;
// ============================================================================
// APPROVAL WORKFLOWS
// ============================================================================
/**
 * @function createApprovalWorkflow
 * @description Creates an approval workflow
 * @param {string} entityType - Entity type
 * @param {string} entityId - Entity ID
 * @param {ApprovalStep[]} steps - Approval steps
 * @returns {ApprovalWorkflow} Created workflow
 *
 * @example
 * ```typescript
 * const workflow = createApprovalWorkflow('contract', contractId, steps);
 * ```
 */
const createApprovalWorkflow = (entityType, entityId, steps) => {
    return {
        workflowId: crypto.randomUUID(),
        entityType,
        entityId,
        steps,
        currentStep: 0,
        status: 'pending',
        createdAt: new Date(),
    };
};
exports.createApprovalWorkflow = createApprovalWorkflow;
/**
 * @function approveWorkflowStep
 * @description Approves a workflow step
 * @param {ApprovalWorkflow} workflow - Workflow
 * @param {number} stepNumber - Step number to approve
 * @param {UserId} approverId - Approver user ID
 * @param {string} comments - Approval comments
 * @returns {ApprovalWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const updated = approveWorkflowStep(workflow, 1, userId, 'Approved');
 * ```
 */
const approveWorkflowStep = (workflow, stepNumber, approverId, comments) => {
    const updatedSteps = workflow.steps.map(step => step.stepNumber === stepNumber
        ? {
            ...step,
            status: 'approved',
            approverId,
            comments,
            actionDate: new Date(),
        }
        : step);
    const allApproved = updatedSteps.every(s => !s.required || s.status === 'approved');
    const currentStep = updatedSteps.findIndex(s => s.status === 'pending');
    return {
        ...workflow,
        steps: updatedSteps,
        currentStep: currentStep === -1 ? workflow.steps.length : currentStep,
        status: allApproved ? 'approved' : 'in_progress',
    };
};
exports.approveWorkflowStep = approveWorkflowStep;
/**
 * @function rejectWorkflowStep
 * @description Rejects a workflow step
 * @param {ApprovalWorkflow} workflow - Workflow
 * @param {number} stepNumber - Step number to reject
 * @param {UserId} approverId - Approver user ID
 * @param {string} comments - Rejection comments
 * @returns {ApprovalWorkflow} Updated workflow
 *
 * @example
 * ```typescript
 * const rejected = rejectWorkflowStep(workflow, 1, userId, 'Needs revision');
 * ```
 */
const rejectWorkflowStep = (workflow, stepNumber, approverId, comments) => {
    const updatedSteps = workflow.steps.map(step => step.stepNumber === stepNumber
        ? {
            ...step,
            status: 'rejected',
            approverId,
            comments,
            actionDate: new Date(),
        }
        : step);
    return {
        ...workflow,
        steps: updatedSteps,
        status: 'rejected',
    };
};
exports.rejectWorkflowStep = rejectWorkflowStep;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // ID Generation
    createProcurementId: exports.createProcurementId,
    createContractId: exports.createContractId,
    createBidId: exports.createBidId,
    createVendorId: exports.createVendorId,
    createPurchaseOrderId: exports.createPurchaseOrderId,
    createAmendmentId: exports.createAmendmentId,
    // Procurement
    createProcurementRequest: exports.createProcurementRequest,
    publishProcurement: exports.publishProcurement,
    addEvaluationCriteria: exports.addEvaluationCriteria,
    closeBidding: exports.closeBidding,
    cancelProcurement: exports.cancelProcurement,
    // Bidding
    createBid: exports.createBid,
    evaluateBid: exports.evaluateBid,
    calculateTechnicalScore: exports.calculateTechnicalScore,
    calculatePriceScore: exports.calculatePriceScore,
    rankBids: exports.rankBids,
    identifyLowestResponsiveBid: exports.identifyLowestResponsiveBid,
    // Contracts
    createContract: exports.createContract,
    activateContract: exports.activateContract,
    suspendContract: exports.suspendContract,
    terminateContract: exports.terminateContract,
    renewContract: exports.renewContract,
    checkContractExpiration: exports.checkContractExpiration,
    // Purchase Orders
    createPurchaseOrder: exports.createPurchaseOrder,
    approvePurchaseOrder: exports.approvePurchaseOrder,
    sendPurchaseOrderToVendor: exports.sendPurchaseOrderToVendor,
    receivePurchaseOrder: exports.receivePurchaseOrder,
    calculatePOTotal: exports.calculatePOTotal,
    // Vendors
    createVendor: exports.createVendor,
    qualifyVendor: exports.qualifyVendor,
    disqualifyVendor: exports.disqualifyVendor,
    addVendorCertification: exports.addVendorCertification,
    checkCertificationExpiry: exports.checkCertificationExpiry,
    // Amendments
    createContractAmendment: exports.createContractAmendment,
    applyContractAmendment: exports.applyContractAmendment,
    // Sole Source
    createSoleSourceJustification: exports.createSoleSourceJustification,
    validateSoleSourceJustification: exports.validateSoleSourceJustification,
    // Compliance
    createComplianceCheck: exports.createComplianceCheck,
    addComplianceFinding: exports.addComplianceFinding,
    trackContractCompliance: exports.trackContractCompliance,
    // Workflows
    createApprovalWorkflow: exports.createApprovalWorkflow,
    approveWorkflowStep: exports.approveWorkflowStep,
    rejectWorkflowStep: exports.rejectWorkflowStep,
};
//# sourceMappingURL=procurement-contract-management-kit.js.map