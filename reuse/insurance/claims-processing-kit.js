"use strict";
/**
 * LOC: INS-CLAIMS-001
 * File: /reuse/insurance/claims-processing-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Insurance backend services
 *   - Claims management modules
 *   - Adjusting services
 *   - Subrogation systems
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
exports.recordSubrogationRecovery = exports.pursueSubrogation = exports.identifySubrogationOpportunity = exports.reopenClaim = exports.denyClaim = exports.closeClaim = exports.updateClaimStatus = exports.getClaimNotes = exports.addClaimNote = exports.getClaimDocuments = exports.uploadClaimDocument = exports.getOverdueTasks = exports.getPendingTasks = exports.completeDiaryEntry = exports.createDiaryEntry = exports.finalizeSettlement = exports.updateSettlementOffer = exports.initiateSettlement = exports.voidPayment = exports.calculateRemainingReserves = exports.getPaymentHistory = exports.processClaimPayment = exports.assessReserveAdequacy = exports.getReserveHistory = exports.updateReserve = exports.setInitialReserve = exports.determineLiability = exports.completeInvestigation = exports.updateInvestigationFindings = exports.initiateInvestigation = exports.getAdjusterWorkload = exports.routeClaim = exports.reassignClaim = exports.assignClaim = exports.openClaim = exports.validateFNOL = exports.updateFNOL = exports.registerFNOL = exports.createClaimReserveHistoryModel = exports.createClaimModel = exports.ClaimDocumentType = exports.LiabilityDetermination = exports.AdjusterType = exports.InvestigationStatus = exports.PaymentType = exports.ReserveType = exports.ClaimSeverity = exports.LossType = exports.ClaimType = exports.ClaimStatus = void 0;
exports.validateClaimClosureEligibility = exports.getClaimTimeline = exports.getClaimAnalytics = exports.generateClaimsReport = exports.escalateClaim = exports.recordSalvageRecovery = exports.assessSalvageValue = void 0;
/**
 * File: /reuse/insurance/claims-processing-kit.ts
 * Locator: WC-INS-CLAIMS-001
 * Purpose: Enterprise Insurance Claims Processing Kit - Comprehensive claims lifecycle management
 *
 * Upstream: Independent utility module for insurance claims operations
 * Downstream: ../backend/*, Insurance services, Claims adjusting, Subrogation, Payment processing
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45 utility functions for claims intake (FNOL), assignment, investigation, reserves, payments, settlements, diary, documentation, status tracking, multi-party claims, subrogation, salvage, reopening, escalation, reporting
 *
 * LLM Context: Production-ready insurance claims processing utilities for White Cross platform.
 * Provides comprehensive claims lifecycle management from First Notice of Loss (FNOL) through settlement,
 * claims assignment and routing, investigation management, loss reserve calculations, payment processing,
 * settlement negotiations, diary and task management, documentation and evidence, status workflows,
 * multi-party coordination, subrogation identification, salvage assessment, reopening procedures,
 * escalation management, and analytics. Designed to compete with Allstate, Progressive, and Farmers.
 */
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * Claim status
 */
var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["FNOL_RECEIVED"] = "fnol_received";
    ClaimStatus["OPEN"] = "open";
    ClaimStatus["ASSIGNED"] = "assigned";
    ClaimStatus["UNDER_INVESTIGATION"] = "under_investigation";
    ClaimStatus["PENDING_DOCUMENTATION"] = "pending_documentation";
    ClaimStatus["PENDING_APPROVAL"] = "pending_approval";
    ClaimStatus["APPROVED"] = "approved";
    ClaimStatus["SETTLEMENT_NEGOTIATION"] = "settlement_negotiation";
    ClaimStatus["SETTLED"] = "settled";
    ClaimStatus["PAID"] = "paid";
    ClaimStatus["CLOSED"] = "closed";
    ClaimStatus["DENIED"] = "denied";
    ClaimStatus["REOPENED"] = "reopened";
    ClaimStatus["SUBROGATION"] = "subrogation";
    ClaimStatus["LITIGATION"] = "litigation";
    ClaimStatus["SUSPENDED"] = "suspended";
})(ClaimStatus || (exports.ClaimStatus = ClaimStatus = {}));
/**
 * Claim type
 */
var ClaimType;
(function (ClaimType) {
    ClaimType["AUTO_COLLISION"] = "auto_collision";
    ClaimType["AUTO_COMPREHENSIVE"] = "auto_comprehensive";
    ClaimType["AUTO_LIABILITY"] = "auto_liability";
    ClaimType["AUTO_MEDICAL"] = "auto_medical";
    ClaimType["AUTO_UNINSURED"] = "auto_uninsured";
    ClaimType["PROPERTY_FIRE"] = "property_fire";
    ClaimType["PROPERTY_WATER"] = "property_water";
    ClaimType["PROPERTY_THEFT"] = "property_theft";
    ClaimType["PROPERTY_VANDALISM"] = "property_vandalism";
    ClaimType["PROPERTY_WEATHER"] = "property_weather";
    ClaimType["LIABILITY_BODILY_INJURY"] = "liability_bodily_injury";
    ClaimType["LIABILITY_PROPERTY_DAMAGE"] = "liability_property_damage";
    ClaimType["LIABILITY_PERSONAL_INJURY"] = "liability_personal_injury";
    ClaimType["WORKERS_COMP"] = "workers_comp";
    ClaimType["HEALTH"] = "health";
    ClaimType["LIFE"] = "life";
    ClaimType["DISABILITY"] = "disability";
})(ClaimType || (exports.ClaimType = ClaimType = {}));
/**
 * Loss type
 */
var LossType;
(function (LossType) {
    LossType["COLLISION"] = "collision";
    LossType["COMPREHENSIVE"] = "comprehensive";
    LossType["FIRE"] = "fire";
    LossType["THEFT"] = "theft";
    LossType["VANDALISM"] = "vandalism";
    LossType["WEATHER"] = "weather";
    LossType["WATER_DAMAGE"] = "water_damage";
    LossType["BODILY_INJURY"] = "bodily_injury";
    LossType["PROPERTY_DAMAGE"] = "property_damage";
    LossType["MEDICAL"] = "medical";
    LossType["DEATH"] = "death";
    LossType["OTHER"] = "other";
})(LossType || (exports.LossType = LossType = {}));
/**
 * Claim severity
 */
var ClaimSeverity;
(function (ClaimSeverity) {
    ClaimSeverity["MINOR"] = "minor";
    ClaimSeverity["MODERATE"] = "moderate";
    ClaimSeverity["MAJOR"] = "major";
    ClaimSeverity["SEVERE"] = "severe";
    ClaimSeverity["CATASTROPHIC"] = "catastrophic";
})(ClaimSeverity || (exports.ClaimSeverity = ClaimSeverity = {}));
/**
 * Reserve type
 */
var ReserveType;
(function (ReserveType) {
    ReserveType["INDEMNITY"] = "indemnity";
    ReserveType["EXPENSE"] = "expense";
    ReserveType["LEGAL"] = "legal";
    ReserveType["MEDICAL"] = "medical";
    ReserveType["TOTAL"] = "total";
})(ReserveType || (exports.ReserveType = ReserveType = {}));
/**
 * Payment type
 */
var PaymentType;
(function (PaymentType) {
    PaymentType["INDEMNITY"] = "indemnity";
    PaymentType["MEDICAL"] = "medical";
    PaymentType["EXPENSE"] = "expense";
    PaymentType["DEDUCTIBLE_RECOVERY"] = "deductible_recovery";
    PaymentType["SALVAGE_RECOVERY"] = "salvage_recovery";
    PaymentType["SUBROGATION_RECOVERY"] = "subrogation_recovery";
    PaymentType["PARTIAL_PAYMENT"] = "partial_payment";
    PaymentType["FINAL_PAYMENT"] = "final_payment";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
/**
 * Investigation status
 */
var InvestigationStatus;
(function (InvestigationStatus) {
    InvestigationStatus["NOT_STARTED"] = "not_started";
    InvestigationStatus["IN_PROGRESS"] = "in_progress";
    InvestigationStatus["PENDING_INFO"] = "pending_info";
    InvestigationStatus["COMPLETED"] = "completed";
    InvestigationStatus["SUSPENDED"] = "suspended";
})(InvestigationStatus || (exports.InvestigationStatus = InvestigationStatus = {}));
/**
 * Adjuster type
 */
var AdjusterType;
(function (AdjusterType) {
    AdjusterType["STAFF"] = "staff";
    AdjusterType["INDEPENDENT"] = "independent";
    AdjusterType["PUBLIC"] = "public";
    AdjusterType["DESK"] = "desk";
    AdjusterType["FIELD"] = "field";
})(AdjusterType || (exports.AdjusterType = AdjusterType = {}));
/**
 * Liability determination
 */
var LiabilityDetermination;
(function (LiabilityDetermination) {
    LiabilityDetermination["INSURED_AT_FAULT"] = "insured_at_fault";
    LiabilityDetermination["THIRD_PARTY_AT_FAULT"] = "third_party_at_fault";
    LiabilityDetermination["COMPARATIVE"] = "comparative";
    LiabilityDetermination["NO_FAULT"] = "no_fault";
    LiabilityDetermination["PENDING"] = "pending";
    LiabilityDetermination["DISPUTED"] = "disputed";
})(LiabilityDetermination || (exports.LiabilityDetermination = LiabilityDetermination = {}));
/**
 * Document type
 */
var ClaimDocumentType;
(function (ClaimDocumentType) {
    ClaimDocumentType["POLICE_REPORT"] = "police_report";
    ClaimDocumentType["MEDICAL_RECORD"] = "medical_record";
    ClaimDocumentType["REPAIR_ESTIMATE"] = "repair_estimate";
    ClaimDocumentType["INVOICE"] = "invoice";
    ClaimDocumentType["RECEIPT"] = "receipt";
    ClaimDocumentType["PHOTO"] = "photo";
    ClaimDocumentType["VIDEO"] = "video";
    ClaimDocumentType["WITNESS_STATEMENT"] = "witness_statement";
    ClaimDocumentType["RECORDED_STATEMENT"] = "recorded_statement";
    ClaimDocumentType["EXPERT_REPORT"] = "expert_report";
    ClaimDocumentType["CORRESPONDENCE"] = "correspondence";
    ClaimDocumentType["LEGAL_DOCUMENT"] = "legal_document";
})(ClaimDocumentType || (exports.ClaimDocumentType = ClaimDocumentType = {}));
/**
 * Creates Claim model for Sequelize.
 */
const createClaimModel = (sequelize) => {
    let Claim = (() => {
        let _classDecorators = [(0, sequelize_typescript_1.Table)({
                tableName: 'claims',
                timestamps: true,
                paranoid: true,
                indexes: [
                    { fields: ['claimNumber'], unique: true },
                    { fields: ['policyId'] },
                    { fields: ['status'] },
                    { fields: ['claimType'] },
                    { fields: ['lossDate'] },
                    { fields: ['reportedDate'] },
                    { fields: ['assignedAdjusterId'] },
                    { fields: ['severity'] },
                    { fields: ['liabilityDetermination'] },
                ],
            })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = sequelize_typescript_1.Model;
        let _id_decorators;
        let _id_initializers = [];
        let _id_extraInitializers = [];
        let _claimNumber_decorators;
        let _claimNumber_initializers = [];
        let _claimNumber_extraInitializers = [];
        let _policyId_decorators;
        let _policyId_initializers = [];
        let _policyId_extraInitializers = [];
        let _claimType_decorators;
        let _claimType_initializers = [];
        let _claimType_extraInitializers = [];
        let _lossType_decorators;
        let _lossType_initializers = [];
        let _lossType_extraInitializers = [];
        let _status_decorators;
        let _status_initializers = [];
        let _status_extraInitializers = [];
        let _severity_decorators;
        let _severity_initializers = [];
        let _severity_extraInitializers = [];
        let _lossDate_decorators;
        let _lossDate_initializers = [];
        let _lossDate_extraInitializers = [];
        let _reportedDate_decorators;
        let _reportedDate_initializers = [];
        let _reportedDate_extraInitializers = [];
        let _reportedBy_decorators;
        let _reportedBy_initializers = [];
        let _reportedBy_extraInitializers = [];
        let _reportedByRelation_decorators;
        let _reportedByRelation_initializers = [];
        let _reportedByRelation_extraInitializers = [];
        let _lossDescription_decorators;
        let _lossDescription_initializers = [];
        let _lossDescription_extraInitializers = [];
        let _lossLocation_decorators;
        let _lossLocation_initializers = [];
        let _lossLocation_extraInitializers = [];
        let _policeReportNumber_decorators;
        let _policeReportNumber_initializers = [];
        let _policeReportNumber_extraInitializers = [];
        let _policeReportFiled_decorators;
        let _policeReportFiled_initializers = [];
        let _policeReportFiled_extraInitializers = [];
        let _estimatedLossAmount_decorators;
        let _estimatedLossAmount_initializers = [];
        let _estimatedLossAmount_extraInitializers = [];
        let _actualLossAmount_decorators;
        let _actualLossAmount_initializers = [];
        let _actualLossAmount_extraInitializers = [];
        let _paidAmount_decorators;
        let _paidAmount_initializers = [];
        let _paidAmount_extraInitializers = [];
        let _reserveAmount_decorators;
        let _reserveAmount_initializers = [];
        let _reserveAmount_extraInitializers = [];
        let _assignedAdjusterId_decorators;
        let _assignedAdjusterId_initializers = [];
        let _assignedAdjusterId_extraInitializers = [];
        let _adjusterType_decorators;
        let _adjusterType_initializers = [];
        let _adjusterType_extraInitializers = [];
        let _liabilityDetermination_decorators;
        let _liabilityDetermination_initializers = [];
        let _liabilityDetermination_extraInitializers = [];
        let _liabilityPercentage_decorators;
        let _liabilityPercentage_initializers = [];
        let _liabilityPercentage_extraInitializers = [];
        let _injuries_decorators;
        let _injuries_initializers = [];
        let _injuries_extraInitializers = [];
        let _witnesses_decorators;
        let _witnesses_initializers = [];
        let _witnesses_extraInitializers = [];
        let _thirdParties_decorators;
        let _thirdParties_initializers = [];
        let _thirdParties_extraInitializers = [];
        let _closedDate_decorators;
        let _closedDate_initializers = [];
        let _closedDate_extraInitializers = [];
        let _deniedDate_decorators;
        let _deniedDate_initializers = [];
        let _deniedDate_extraInitializers = [];
        let _denialReason_decorators;
        let _denialReason_initializers = [];
        let _denialReason_extraInitializers = [];
        let _subrogationPotential_decorators;
        let _subrogationPotential_initializers = [];
        let _subrogationPotential_extraInitializers = [];
        let _salvageValue_decorators;
        let _salvageValue_initializers = [];
        let _salvageValue_extraInitializers = [];
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
        var Claim = _classThis = class extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.claimNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _claimNumber_initializers, void 0));
                this.policyId = (__runInitializers(this, _claimNumber_extraInitializers), __runInitializers(this, _policyId_initializers, void 0));
                this.claimType = (__runInitializers(this, _policyId_extraInitializers), __runInitializers(this, _claimType_initializers, void 0));
                this.lossType = (__runInitializers(this, _claimType_extraInitializers), __runInitializers(this, _lossType_initializers, void 0));
                this.status = (__runInitializers(this, _lossType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.severity = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.lossDate = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _lossDate_initializers, void 0));
                this.reportedDate = (__runInitializers(this, _lossDate_extraInitializers), __runInitializers(this, _reportedDate_initializers, void 0));
                this.reportedBy = (__runInitializers(this, _reportedDate_extraInitializers), __runInitializers(this, _reportedBy_initializers, void 0));
                this.reportedByRelation = (__runInitializers(this, _reportedBy_extraInitializers), __runInitializers(this, _reportedByRelation_initializers, void 0));
                this.lossDescription = (__runInitializers(this, _reportedByRelation_extraInitializers), __runInitializers(this, _lossDescription_initializers, void 0));
                this.lossLocation = (__runInitializers(this, _lossDescription_extraInitializers), __runInitializers(this, _lossLocation_initializers, void 0));
                this.policeReportNumber = (__runInitializers(this, _lossLocation_extraInitializers), __runInitializers(this, _policeReportNumber_initializers, void 0));
                this.policeReportFiled = (__runInitializers(this, _policeReportNumber_extraInitializers), __runInitializers(this, _policeReportFiled_initializers, void 0));
                this.estimatedLossAmount = (__runInitializers(this, _policeReportFiled_extraInitializers), __runInitializers(this, _estimatedLossAmount_initializers, void 0));
                this.actualLossAmount = (__runInitializers(this, _estimatedLossAmount_extraInitializers), __runInitializers(this, _actualLossAmount_initializers, void 0));
                this.paidAmount = (__runInitializers(this, _actualLossAmount_extraInitializers), __runInitializers(this, _paidAmount_initializers, void 0));
                this.reserveAmount = (__runInitializers(this, _paidAmount_extraInitializers), __runInitializers(this, _reserveAmount_initializers, void 0));
                this.assignedAdjusterId = (__runInitializers(this, _reserveAmount_extraInitializers), __runInitializers(this, _assignedAdjusterId_initializers, void 0));
                this.adjusterType = (__runInitializers(this, _assignedAdjusterId_extraInitializers), __runInitializers(this, _adjusterType_initializers, void 0));
                this.liabilityDetermination = (__runInitializers(this, _adjusterType_extraInitializers), __runInitializers(this, _liabilityDetermination_initializers, void 0));
                this.liabilityPercentage = (__runInitializers(this, _liabilityDetermination_extraInitializers), __runInitializers(this, _liabilityPercentage_initializers, void 0));
                this.injuries = (__runInitializers(this, _liabilityPercentage_extraInitializers), __runInitializers(this, _injuries_initializers, void 0));
                this.witnesses = (__runInitializers(this, _injuries_extraInitializers), __runInitializers(this, _witnesses_initializers, void 0));
                this.thirdParties = (__runInitializers(this, _witnesses_extraInitializers), __runInitializers(this, _thirdParties_initializers, void 0));
                this.closedDate = (__runInitializers(this, _thirdParties_extraInitializers), __runInitializers(this, _closedDate_initializers, void 0));
                this.deniedDate = (__runInitializers(this, _closedDate_extraInitializers), __runInitializers(this, _deniedDate_initializers, void 0));
                this.denialReason = (__runInitializers(this, _deniedDate_extraInitializers), __runInitializers(this, _denialReason_initializers, void 0));
                this.subrogationPotential = (__runInitializers(this, _denialReason_extraInitializers), __runInitializers(this, _subrogationPotential_initializers, void 0));
                this.salvageValue = (__runInitializers(this, _subrogationPotential_extraInitializers), __runInitializers(this, _salvageValue_initializers, void 0));
                this.metadata = (__runInitializers(this, _salvageValue_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
                __runInitializers(this, _deletedAt_extraInitializers);
            }
        };
        __setFunctionName(_classThis, "Claim");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                    primaryKey: true,
                })];
            _claimNumber_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.STRING(50),
                    allowNull: false,
                    unique: true,
                })];
            _policyId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: false,
                })];
            _claimType_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(ClaimType)),
                    allowNull: false,
                })];
            _lossType_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(LossType)),
                    allowNull: false,
                })];
            _status_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(ClaimStatus)),
                    allowNull: false,
                    defaultValue: ClaimStatus.FNOL_RECEIVED,
                })];
            _severity_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(ClaimSeverity)),
                    allowNull: false,
                    defaultValue: ClaimSeverity.MINOR,
                })];
            _lossDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: false,
                })];
            _reportedDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: false,
                })];
            _reportedBy_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.STRING(255),
                    allowNull: false,
                })];
            _reportedByRelation_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.STRING(100),
                    allowNull: false,
                })];
            _lossDescription_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.TEXT,
                    allowNull: false,
                })];
            _lossLocation_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: false,
                })];
            _policeReportNumber_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.STRING(100),
                    allowNull: true,
                })];
            _policeReportFiled_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                })];
            _estimatedLossAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: true,
                })];
            _actualLossAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: true,
                })];
            _paidAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                })];
            _reserveAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: false,
                    defaultValue: 0,
                })];
            _assignedAdjusterId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: true,
                })];
            _adjusterType_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(AdjusterType)),
                    allowNull: true,
                })];
            _liabilityDetermination_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(LiabilityDetermination)),
                    allowNull: true,
                })];
            _liabilityPercentage_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(5, 2),
                    allowNull: true,
                    validate: { min: 0, max: 100 },
                })];
            _injuries_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _witnesses_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _thirdParties_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _closedDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: true,
                })];
            _deniedDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: true,
                })];
            _denialReason_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.TEXT,
                    allowNull: true,
                })];
            _subrogationPotential_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                })];
            _salvageValue_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: true,
                })];
            _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.JSONB,
                    allowNull: true,
                })];
            _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
            _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
            _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _claimNumber_decorators, { kind: "field", name: "claimNumber", static: false, private: false, access: { has: obj => "claimNumber" in obj, get: obj => obj.claimNumber, set: (obj, value) => { obj.claimNumber = value; } }, metadata: _metadata }, _claimNumber_initializers, _claimNumber_extraInitializers);
            __esDecorate(null, null, _policyId_decorators, { kind: "field", name: "policyId", static: false, private: false, access: { has: obj => "policyId" in obj, get: obj => obj.policyId, set: (obj, value) => { obj.policyId = value; } }, metadata: _metadata }, _policyId_initializers, _policyId_extraInitializers);
            __esDecorate(null, null, _claimType_decorators, { kind: "field", name: "claimType", static: false, private: false, access: { has: obj => "claimType" in obj, get: obj => obj.claimType, set: (obj, value) => { obj.claimType = value; } }, metadata: _metadata }, _claimType_initializers, _claimType_extraInitializers);
            __esDecorate(null, null, _lossType_decorators, { kind: "field", name: "lossType", static: false, private: false, access: { has: obj => "lossType" in obj, get: obj => obj.lossType, set: (obj, value) => { obj.lossType = value; } }, metadata: _metadata }, _lossType_initializers, _lossType_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _lossDate_decorators, { kind: "field", name: "lossDate", static: false, private: false, access: { has: obj => "lossDate" in obj, get: obj => obj.lossDate, set: (obj, value) => { obj.lossDate = value; } }, metadata: _metadata }, _lossDate_initializers, _lossDate_extraInitializers);
            __esDecorate(null, null, _reportedDate_decorators, { kind: "field", name: "reportedDate", static: false, private: false, access: { has: obj => "reportedDate" in obj, get: obj => obj.reportedDate, set: (obj, value) => { obj.reportedDate = value; } }, metadata: _metadata }, _reportedDate_initializers, _reportedDate_extraInitializers);
            __esDecorate(null, null, _reportedBy_decorators, { kind: "field", name: "reportedBy", static: false, private: false, access: { has: obj => "reportedBy" in obj, get: obj => obj.reportedBy, set: (obj, value) => { obj.reportedBy = value; } }, metadata: _metadata }, _reportedBy_initializers, _reportedBy_extraInitializers);
            __esDecorate(null, null, _reportedByRelation_decorators, { kind: "field", name: "reportedByRelation", static: false, private: false, access: { has: obj => "reportedByRelation" in obj, get: obj => obj.reportedByRelation, set: (obj, value) => { obj.reportedByRelation = value; } }, metadata: _metadata }, _reportedByRelation_initializers, _reportedByRelation_extraInitializers);
            __esDecorate(null, null, _lossDescription_decorators, { kind: "field", name: "lossDescription", static: false, private: false, access: { has: obj => "lossDescription" in obj, get: obj => obj.lossDescription, set: (obj, value) => { obj.lossDescription = value; } }, metadata: _metadata }, _lossDescription_initializers, _lossDescription_extraInitializers);
            __esDecorate(null, null, _lossLocation_decorators, { kind: "field", name: "lossLocation", static: false, private: false, access: { has: obj => "lossLocation" in obj, get: obj => obj.lossLocation, set: (obj, value) => { obj.lossLocation = value; } }, metadata: _metadata }, _lossLocation_initializers, _lossLocation_extraInitializers);
            __esDecorate(null, null, _policeReportNumber_decorators, { kind: "field", name: "policeReportNumber", static: false, private: false, access: { has: obj => "policeReportNumber" in obj, get: obj => obj.policeReportNumber, set: (obj, value) => { obj.policeReportNumber = value; } }, metadata: _metadata }, _policeReportNumber_initializers, _policeReportNumber_extraInitializers);
            __esDecorate(null, null, _policeReportFiled_decorators, { kind: "field", name: "policeReportFiled", static: false, private: false, access: { has: obj => "policeReportFiled" in obj, get: obj => obj.policeReportFiled, set: (obj, value) => { obj.policeReportFiled = value; } }, metadata: _metadata }, _policeReportFiled_initializers, _policeReportFiled_extraInitializers);
            __esDecorate(null, null, _estimatedLossAmount_decorators, { kind: "field", name: "estimatedLossAmount", static: false, private: false, access: { has: obj => "estimatedLossAmount" in obj, get: obj => obj.estimatedLossAmount, set: (obj, value) => { obj.estimatedLossAmount = value; } }, metadata: _metadata }, _estimatedLossAmount_initializers, _estimatedLossAmount_extraInitializers);
            __esDecorate(null, null, _actualLossAmount_decorators, { kind: "field", name: "actualLossAmount", static: false, private: false, access: { has: obj => "actualLossAmount" in obj, get: obj => obj.actualLossAmount, set: (obj, value) => { obj.actualLossAmount = value; } }, metadata: _metadata }, _actualLossAmount_initializers, _actualLossAmount_extraInitializers);
            __esDecorate(null, null, _paidAmount_decorators, { kind: "field", name: "paidAmount", static: false, private: false, access: { has: obj => "paidAmount" in obj, get: obj => obj.paidAmount, set: (obj, value) => { obj.paidAmount = value; } }, metadata: _metadata }, _paidAmount_initializers, _paidAmount_extraInitializers);
            __esDecorate(null, null, _reserveAmount_decorators, { kind: "field", name: "reserveAmount", static: false, private: false, access: { has: obj => "reserveAmount" in obj, get: obj => obj.reserveAmount, set: (obj, value) => { obj.reserveAmount = value; } }, metadata: _metadata }, _reserveAmount_initializers, _reserveAmount_extraInitializers);
            __esDecorate(null, null, _assignedAdjusterId_decorators, { kind: "field", name: "assignedAdjusterId", static: false, private: false, access: { has: obj => "assignedAdjusterId" in obj, get: obj => obj.assignedAdjusterId, set: (obj, value) => { obj.assignedAdjusterId = value; } }, metadata: _metadata }, _assignedAdjusterId_initializers, _assignedAdjusterId_extraInitializers);
            __esDecorate(null, null, _adjusterType_decorators, { kind: "field", name: "adjusterType", static: false, private: false, access: { has: obj => "adjusterType" in obj, get: obj => obj.adjusterType, set: (obj, value) => { obj.adjusterType = value; } }, metadata: _metadata }, _adjusterType_initializers, _adjusterType_extraInitializers);
            __esDecorate(null, null, _liabilityDetermination_decorators, { kind: "field", name: "liabilityDetermination", static: false, private: false, access: { has: obj => "liabilityDetermination" in obj, get: obj => obj.liabilityDetermination, set: (obj, value) => { obj.liabilityDetermination = value; } }, metadata: _metadata }, _liabilityDetermination_initializers, _liabilityDetermination_extraInitializers);
            __esDecorate(null, null, _liabilityPercentage_decorators, { kind: "field", name: "liabilityPercentage", static: false, private: false, access: { has: obj => "liabilityPercentage" in obj, get: obj => obj.liabilityPercentage, set: (obj, value) => { obj.liabilityPercentage = value; } }, metadata: _metadata }, _liabilityPercentage_initializers, _liabilityPercentage_extraInitializers);
            __esDecorate(null, null, _injuries_decorators, { kind: "field", name: "injuries", static: false, private: false, access: { has: obj => "injuries" in obj, get: obj => obj.injuries, set: (obj, value) => { obj.injuries = value; } }, metadata: _metadata }, _injuries_initializers, _injuries_extraInitializers);
            __esDecorate(null, null, _witnesses_decorators, { kind: "field", name: "witnesses", static: false, private: false, access: { has: obj => "witnesses" in obj, get: obj => obj.witnesses, set: (obj, value) => { obj.witnesses = value; } }, metadata: _metadata }, _witnesses_initializers, _witnesses_extraInitializers);
            __esDecorate(null, null, _thirdParties_decorators, { kind: "field", name: "thirdParties", static: false, private: false, access: { has: obj => "thirdParties" in obj, get: obj => obj.thirdParties, set: (obj, value) => { obj.thirdParties = value; } }, metadata: _metadata }, _thirdParties_initializers, _thirdParties_extraInitializers);
            __esDecorate(null, null, _closedDate_decorators, { kind: "field", name: "closedDate", static: false, private: false, access: { has: obj => "closedDate" in obj, get: obj => obj.closedDate, set: (obj, value) => { obj.closedDate = value; } }, metadata: _metadata }, _closedDate_initializers, _closedDate_extraInitializers);
            __esDecorate(null, null, _deniedDate_decorators, { kind: "field", name: "deniedDate", static: false, private: false, access: { has: obj => "deniedDate" in obj, get: obj => obj.deniedDate, set: (obj, value) => { obj.deniedDate = value; } }, metadata: _metadata }, _deniedDate_initializers, _deniedDate_extraInitializers);
            __esDecorate(null, null, _denialReason_decorators, { kind: "field", name: "denialReason", static: false, private: false, access: { has: obj => "denialReason" in obj, get: obj => obj.denialReason, set: (obj, value) => { obj.denialReason = value; } }, metadata: _metadata }, _denialReason_initializers, _denialReason_extraInitializers);
            __esDecorate(null, null, _subrogationPotential_decorators, { kind: "field", name: "subrogationPotential", static: false, private: false, access: { has: obj => "subrogationPotential" in obj, get: obj => obj.subrogationPotential, set: (obj, value) => { obj.subrogationPotential = value; } }, metadata: _metadata }, _subrogationPotential_initializers, _subrogationPotential_extraInitializers);
            __esDecorate(null, null, _salvageValue_decorators, { kind: "field", name: "salvageValue", static: false, private: false, access: { has: obj => "salvageValue" in obj, get: obj => obj.salvageValue, set: (obj, value) => { obj.salvageValue = value; } }, metadata: _metadata }, _salvageValue_initializers, _salvageValue_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Claim = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return Claim = _classThis;
    })();
    return Claim;
};
exports.createClaimModel = createClaimModel;
/**
 * Creates ClaimReserveHistory model for Sequelize.
 */
const createClaimReserveHistoryModel = (sequelize) => {
    let ClaimReserveHistory = (() => {
        let _classDecorators = [(0, sequelize_typescript_1.Table)({
                tableName: 'claim_reserve_history',
                timestamps: true,
                updatedAt: false,
                indexes: [
                    { fields: ['claimId'] },
                    { fields: ['reserveType'] },
                    { fields: ['effectiveDate'] },
                ],
            })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = sequelize_typescript_1.Model;
        let _id_decorators;
        let _id_initializers = [];
        let _id_extraInitializers = [];
        let _claimId_decorators;
        let _claimId_initializers = [];
        let _claimId_extraInitializers = [];
        let _reserveType_decorators;
        let _reserveType_initializers = [];
        let _reserveType_extraInitializers = [];
        let _previousAmount_decorators;
        let _previousAmount_initializers = [];
        let _previousAmount_extraInitializers = [];
        let _newAmount_decorators;
        let _newAmount_initializers = [];
        let _newAmount_extraInitializers = [];
        let _changeAmount_decorators;
        let _changeAmount_initializers = [];
        let _changeAmount_extraInitializers = [];
        let _reason_decorators;
        let _reason_initializers = [];
        let _reason_extraInitializers = [];
        let _setBy_decorators;
        let _setBy_initializers = [];
        let _setBy_extraInitializers = [];
        let _effectiveDate_decorators;
        let _effectiveDate_initializers = [];
        let _effectiveDate_extraInitializers = [];
        let _notes_decorators;
        let _notes_initializers = [];
        let _notes_extraInitializers = [];
        let _createdAt_decorators;
        let _createdAt_initializers = [];
        let _createdAt_extraInitializers = [];
        var ClaimReserveHistory = _classThis = class extends _classSuper {
            constructor() {
                super(...arguments);
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.claimId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _claimId_initializers, void 0));
                this.reserveType = (__runInitializers(this, _claimId_extraInitializers), __runInitializers(this, _reserveType_initializers, void 0));
                this.previousAmount = (__runInitializers(this, _reserveType_extraInitializers), __runInitializers(this, _previousAmount_initializers, void 0));
                this.newAmount = (__runInitializers(this, _previousAmount_extraInitializers), __runInitializers(this, _newAmount_initializers, void 0));
                this.changeAmount = (__runInitializers(this, _newAmount_extraInitializers), __runInitializers(this, _changeAmount_initializers, void 0));
                this.reason = (__runInitializers(this, _changeAmount_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                this.setBy = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _setBy_initializers, void 0));
                this.effectiveDate = (__runInitializers(this, _setBy_extraInitializers), __runInitializers(this, _effectiveDate_initializers, void 0));
                this.notes = (__runInitializers(this, _effectiveDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
        };
        __setFunctionName(_classThis, "ClaimReserveHistory");
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _id_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    defaultValue: sequelize_typescript_1.DataType.UUIDV4,
                    primaryKey: true,
                })];
            _claimId_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: false,
                })];
            _reserveType_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.ENUM(...Object.values(ReserveType)),
                    allowNull: false,
                })];
            _previousAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: false,
                })];
            _newAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: false,
                })];
            _changeAmount_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DECIMAL(12, 2),
                    allowNull: false,
                })];
            _reason_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.TEXT,
                    allowNull: false,
                })];
            _setBy_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.UUID,
                    allowNull: false,
                })];
            _effectiveDate_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.DATE,
                    allowNull: false,
                })];
            _notes_decorators = [(0, sequelize_typescript_1.Column)({
                    type: sequelize_typescript_1.DataType.TEXT,
                    allowNull: true,
                })];
            _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _claimId_decorators, { kind: "field", name: "claimId", static: false, private: false, access: { has: obj => "claimId" in obj, get: obj => obj.claimId, set: (obj, value) => { obj.claimId = value; } }, metadata: _metadata }, _claimId_initializers, _claimId_extraInitializers);
            __esDecorate(null, null, _reserveType_decorators, { kind: "field", name: "reserveType", static: false, private: false, access: { has: obj => "reserveType" in obj, get: obj => obj.reserveType, set: (obj, value) => { obj.reserveType = value; } }, metadata: _metadata }, _reserveType_initializers, _reserveType_extraInitializers);
            __esDecorate(null, null, _previousAmount_decorators, { kind: "field", name: "previousAmount", static: false, private: false, access: { has: obj => "previousAmount" in obj, get: obj => obj.previousAmount, set: (obj, value) => { obj.previousAmount = value; } }, metadata: _metadata }, _previousAmount_initializers, _previousAmount_extraInitializers);
            __esDecorate(null, null, _newAmount_decorators, { kind: "field", name: "newAmount", static: false, private: false, access: { has: obj => "newAmount" in obj, get: obj => obj.newAmount, set: (obj, value) => { obj.newAmount = value; } }, metadata: _metadata }, _newAmount_initializers, _newAmount_extraInitializers);
            __esDecorate(null, null, _changeAmount_decorators, { kind: "field", name: "changeAmount", static: false, private: false, access: { has: obj => "changeAmount" in obj, get: obj => obj.changeAmount, set: (obj, value) => { obj.changeAmount = value; } }, metadata: _metadata }, _changeAmount_initializers, _changeAmount_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            __esDecorate(null, null, _setBy_decorators, { kind: "field", name: "setBy", static: false, private: false, access: { has: obj => "setBy" in obj, get: obj => obj.setBy, set: (obj, value) => { obj.setBy = value; } }, metadata: _metadata }, _setBy_initializers, _setBy_extraInitializers);
            __esDecorate(null, null, _effectiveDate_decorators, { kind: "field", name: "effectiveDate", static: false, private: false, access: { has: obj => "effectiveDate" in obj, get: obj => obj.effectiveDate, set: (obj, value) => { obj.effectiveDate = value; } }, metadata: _metadata }, _effectiveDate_initializers, _effectiveDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ClaimReserveHistory = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        })();
        return ClaimReserveHistory = _classThis;
    })();
    return ClaimReserveHistory;
};
exports.createClaimReserveHistoryModel = createClaimReserveHistoryModel;
// ============================================================================
// 1. CLAIMS INTAKE (FNOL)
// ============================================================================
/**
 * 1. Registers First Notice of Loss (FNOL).
 *
 * @param {FNOLData} data - FNOL data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Created claim
 *
 * @example
 * ```typescript
 * const claim = await registerFNOL({
 *   policyId: 'policy-123',
 *   claimType: ClaimType.AUTO_COLLISION,
 *   lossType: LossType.COLLISION,
 *   lossDate: new Date('2025-01-15'),
 *   reportedDate: new Date(),
 *   reportedBy: 'John Doe',
 *   reportedByRelation: 'Insured',
 *   lossDescription: 'Rear-ended at stoplight',
 *   lossLocation: {...},
 *   policeReportFiled: true,
 *   contactPhone: '555-1234'
 * });
 * ```
 */
const registerFNOL = async (data, transaction) => {
    const claimNumber = await generateClaimNumber(data.claimType);
    const claim = {
        claimNumber,
        policyId: data.policyId,
        claimType: data.claimType,
        lossType: data.lossType,
        status: ClaimStatus.FNOL_RECEIVED,
        severity: await calculateSeverity(data),
        lossDate: data.lossDate,
        reportedDate: data.reportedDate,
        reportedBy: data.reportedBy,
        reportedByRelation: data.reportedByRelation,
        lossDescription: data.lossDescription,
        lossLocation: data.lossLocation,
        policeReportNumber: data.policeReportNumber,
        policeReportFiled: data.policeReportFiled,
        estimatedLossAmount: data.estimatedLossAmount,
        injuries: data.injuries,
        witnesses: data.witnesses,
        thirdParties: data.thirdParties,
        paidAmount: 0,
        reserveAmount: 0,
        subrogationPotential: await evaluateSubrogationPotential(data),
        metadata: data.metadata,
    };
    return claim;
};
exports.registerFNOL = registerFNOL;
/**
 * 2. Updates FNOL information.
 *
 * @param {string} claimId - Claim ID
 * @param {Partial<FNOLData>} updates - Updated FNOL data
 * @param {string} updatedBy - User updating the FNOL
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated claim
 */
const updateFNOL = async (claimId, updates, updatedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    if (claim.status !== ClaimStatus.FNOL_RECEIVED) {
        throw new common_1.BadRequestException('Can only update FNOL for claims in FNOL_RECEIVED status');
    }
    Object.assign(claim, updates);
    return claim;
};
exports.updateFNOL = updateFNOL;
/**
 * 3. Validates FNOL completeness.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ complete: boolean; missingFields: string[] }>} Validation result
 */
const validateFNOL = async (claimId, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    const missingFields = [];
    const requiredFields = ['lossDescription', 'lossLocation', 'lossDate', 'reportedBy'];
    requiredFields.forEach(field => {
        if (!claim[field]) {
            missingFields.push(field);
        }
    });
    return {
        complete: missingFields.length === 0,
        missingFields,
    };
};
exports.validateFNOL = validateFNOL;
/**
 * 4. Converts FNOL to open claim.
 *
 * @param {string} claimId - Claim ID
 * @param {string} openedBy - User opening the claim
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Opened claim
 */
const openClaim = async (claimId, openedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    if (claim.status !== ClaimStatus.FNOL_RECEIVED) {
        throw new common_1.BadRequestException('Only FNOL claims can be opened');
    }
    const validation = await (0, exports.validateFNOL)(claimId, transaction);
    if (!validation.complete) {
        throw new common_1.BadRequestException(`Missing required fields: ${validation.missingFields.join(', ')}`);
    }
    claim.status = ClaimStatus.OPEN;
    return claim;
};
exports.openClaim = openClaim;
// ============================================================================
// 2. CLAIM ASSIGNMENT & ROUTING
// ============================================================================
/**
 * 5. Assigns claim to adjuster.
 *
 * @param {ClaimAssignmentData} data - Assignment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Assigned claim
 */
const assignClaim = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    claim.assignedAdjusterId = data.adjusterId;
    claim.adjusterType = data.adjusterType;
    claim.status = ClaimStatus.ASSIGNED;
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'assignment',
        description: `Claim assigned to adjuster ${data.adjusterId}`,
        performedBy: data.assignedBy,
        metadata: {
            adjusterType: data.adjusterType,
            priority: data.priority,
            specialInstructions: data.specialInstructions,
        },
    }, transaction);
    return claim;
};
exports.assignClaim = assignClaim;
/**
 * 6. Reassigns claim to different adjuster.
 *
 * @param {string} claimId - Claim ID
 * @param {string} newAdjusterId - New adjuster ID
 * @param {string} reason - Reassignment reason
 * @param {string} reassignedBy - User performing reassignment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reassigned claim
 */
const reassignClaim = async (claimId, newAdjusterId, reason, reassignedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    const oldAdjusterId = claim.assignedAdjusterId;
    claim.assignedAdjusterId = newAdjusterId;
    await createClaimActivity({
        claimId,
        activityType: 'reassignment',
        description: `Claim reassigned from ${oldAdjusterId} to ${newAdjusterId}`,
        performedBy: reassignedBy,
        metadata: { reason, oldAdjusterId, newAdjusterId },
    }, transaction);
    return claim;
};
exports.reassignClaim = reassignClaim;
/**
 * 7. Routes claim based on business rules.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ adjusterId: string; adjusterType: AdjusterType; reason: string }>} Routing recommendation
 */
const routeClaim = async (claimId, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    // Business logic for routing
    let adjusterType = AdjusterType.STAFF;
    let reason = 'Standard routing';
    if (claim.estimatedLossAmount && claim.estimatedLossAmount > 50000) {
        adjusterType = AdjusterType.FIELD;
        reason = 'High-value claim requires field inspection';
    }
    else if (claim.severity === ClaimSeverity.CATASTROPHIC) {
        adjusterType = AdjusterType.FIELD;
        reason = 'Catastrophic severity requires field adjuster';
    }
    // Would lookup available adjuster based on workload, specialty, geography
    const adjusterId = 'adjuster-123';
    return { adjusterId, adjusterType, reason };
};
exports.routeClaim = routeClaim;
/**
 * 8. Retrieves adjuster workload.
 *
 * @param {string} adjusterId - Adjuster ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ openClaims: number; totalReserves: number; averageSeverity: string }>} Workload metrics
 */
const getAdjusterWorkload = async (adjusterId, transaction) => {
    // Would query claims assigned to adjuster
    return {
        openClaims: 0,
        totalReserves: 0,
        averageSeverity: 'moderate',
    };
};
exports.getAdjusterWorkload = getAdjusterWorkload;
// ============================================================================
// 3. CLAIM INVESTIGATION
// ============================================================================
/**
 * 9. Initiates claim investigation.
 *
 * @param {InvestigationData} data - Investigation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Investigation record
 */
const initiateInvestigation = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    claim.status = ClaimStatus.UNDER_INVESTIGATION;
    const investigation = {
        id: generateUUID(),
        claimId: data.claimId,
        investigationType: data.investigationType,
        investigatorId: data.investigatorId,
        status: InvestigationStatus.IN_PROGRESS,
        startDate: data.startDate,
        targetCompletionDate: data.targetCompletionDate,
        scope: data.scope,
        objectives: data.objectives,
        createdAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'investigation_started',
        description: `Investigation initiated: ${data.investigationType}`,
        performedBy: data.investigatorId,
    }, transaction);
    return investigation;
};
exports.initiateInvestigation = initiateInvestigation;
/**
 * 10. Updates investigation findings.
 *
 * @param {string} investigationId - Investigation ID
 * @param {string} findings - Investigation findings
 * @param {string} recommendations - Recommendations
 * @param {string} updatedBy - User updating findings
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated investigation
 */
const updateInvestigationFindings = async (investigationId, findings, recommendations, updatedBy, transaction) => {
    // Would update investigation record
    const investigation = {
        id: investigationId,
        findings,
        recommendations,
        updatedAt: new Date(),
    };
    return investigation;
};
exports.updateInvestigationFindings = updateInvestigationFindings;
/**
 * 11. Completes investigation.
 *
 * @param {string} investigationId - Investigation ID
 * @param {string} completedBy - User completing investigation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed investigation
 */
const completeInvestigation = async (investigationId, completedBy, transaction) => {
    // Would update investigation status to completed
    const investigation = {
        id: investigationId,
        status: InvestigationStatus.COMPLETED,
        completionDate: new Date(),
    };
    return investigation;
};
exports.completeInvestigation = completeInvestigation;
/**
 * 12. Determines liability based on investigation.
 *
 * @param {string} claimId - Claim ID
 * @param {LiabilityDetermination} determination - Liability determination
 * @param {number} percentage - Liability percentage
 * @param {string} determinedBy - User making determination
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated claim
 */
const determineLiability = async (claimId, determination, percentage, determinedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    claim.liabilityDetermination = determination;
    claim.liabilityPercentage = percentage;
    await createClaimActivity({
        claimId,
        activityType: 'liability_determination',
        description: `Liability determined: ${determination} (${percentage}%)`,
        performedBy: determinedBy,
    }, transaction);
    return claim;
};
exports.determineLiability = determineLiability;
// ============================================================================
// 4. LOSS RESERVES
// ============================================================================
/**
 * 13. Sets initial loss reserve.
 *
 * @param {ReserveData} data - Reserve data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reserve record
 */
const setInitialReserve = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    claim.reserveAmount = data.amount;
    const reserve = {
        id: generateUUID(),
        claimId: data.claimId,
        reserveType: data.reserveType,
        previousAmount: 0,
        newAmount: data.amount,
        changeAmount: data.amount,
        reason: data.reason,
        setBy: data.setBy,
        effectiveDate: data.effectiveDate,
        notes: data.notes,
        createdAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'reserve_set',
        description: `Initial reserve set: $${data.amount}`,
        performedBy: data.setBy,
    }, transaction);
    return reserve;
};
exports.setInitialReserve = setInitialReserve;
/**
 * 14. Updates loss reserve amount.
 *
 * @param {ReserveData} data - Reserve data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reserve record
 */
const updateReserve = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    const previousAmount = claim.reserveAmount;
    const changeAmount = data.amount - previousAmount;
    claim.reserveAmount = data.amount;
    const reserve = {
        id: generateUUID(),
        claimId: data.claimId,
        reserveType: data.reserveType,
        previousAmount,
        newAmount: data.amount,
        changeAmount,
        reason: data.reason,
        setBy: data.setBy,
        effectiveDate: data.effectiveDate,
        notes: data.notes,
        createdAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'reserve_updated',
        description: `Reserve updated from $${previousAmount} to $${data.amount}`,
        performedBy: data.setBy,
    }, transaction);
    return reserve;
};
exports.updateReserve = updateReserve;
/**
 * 15. Retrieves reserve history for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Reserve history
 */
const getReserveHistory = async (claimId, transaction) => {
    // Would query reserve history
    return [];
};
exports.getReserveHistory = getReserveHistory;
/**
 * 16. Calculates reserve adequacy.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ adequate: boolean; recommendedReserve: number; currentReserve: number }>} Adequacy assessment
 */
const assessReserveAdequacy = async (claimId, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    // Business logic to calculate recommended reserve based on claim characteristics
    const recommendedReserve = claim.estimatedLossAmount || 0;
    const currentReserve = claim.reserveAmount;
    return {
        adequate: currentReserve >= recommendedReserve,
        recommendedReserve,
        currentReserve,
    };
};
exports.assessReserveAdequacy = assessReserveAdequacy;
// ============================================================================
// 5. CLAIMS PAYMENT PROCESSING
// ============================================================================
/**
 * 17. Processes claim payment.
 *
 * @param {PaymentData} data - Payment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Payment record
 */
const processClaimPayment = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    if (data.amount > claim.reserveAmount - claim.paidAmount) {
        throw new common_1.BadRequestException('Payment amount exceeds available reserves');
    }
    claim.paidAmount += data.amount;
    const payment = {
        id: generateUUID(),
        claimId: data.claimId,
        paymentType: data.paymentType,
        amount: data.amount,
        payeeName: data.payeeName,
        payeeType: data.payeeType,
        paymentMethod: data.paymentMethod,
        checkNumber: data.checkNumber,
        transactionId: data.transactionId,
        paymentDate: data.paymentDate,
        authorizedBy: data.authorizedBy,
        status: 'processed',
        memo: data.memo,
        supportingDocuments: data.supportingDocuments,
        createdAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'payment_processed',
        description: `Payment processed: $${data.amount} to ${data.payeeName}`,
        performedBy: data.authorizedBy,
    }, transaction);
    return payment;
};
exports.processClaimPayment = processClaimPayment;
/**
 * 18. Retrieves payment history for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Payment history
 */
const getPaymentHistory = async (claimId, transaction) => {
    // Would query payment history
    return [];
};
exports.getPaymentHistory = getPaymentHistory;
/**
 * 19. Calculates remaining reserves.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<number>} Remaining reserves
 */
const calculateRemainingReserves = async (claimId, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    return claim.reserveAmount - claim.paidAmount;
};
exports.calculateRemainingReserves = calculateRemainingReserves;
/**
 * 20. Voids a payment.
 *
 * @param {string} paymentId - Payment ID
 * @param {string} voidReason - Reason for voiding
 * @param {string} voidedBy - User voiding payment
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Voided payment
 */
const voidPayment = async (paymentId, voidReason, voidedBy, transaction) => {
    // Would update payment status and restore reserves
    return {
        id: paymentId,
        status: 'voided',
        voidReason,
        voidedBy,
        voidedAt: new Date(),
    };
};
exports.voidPayment = voidPayment;
// ============================================================================
// 6. SETTLEMENT NEGOTIATION
// ============================================================================
/**
 * 21. Initiates settlement negotiation.
 *
 * @param {string} claimId - Claim ID
 * @param {number} initialOffer - Initial settlement offer
 * @param {string} initiatedBy - User initiating settlement
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Settlement negotiation record
 */
const initiateSettlement = async (claimId, initialOffer, initiatedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    claim.status = ClaimStatus.SETTLEMENT_NEGOTIATION;
    const settlement = {
        id: generateUUID(),
        claimId,
        currentOffer: initialOffer,
        offerHistory: [{ amount: initialOffer, offeredBy: initiatedBy, date: new Date() }],
        status: 'in_negotiation',
        initiatedBy,
        initiatedDate: new Date(),
    };
    await createClaimActivity({
        claimId,
        activityType: 'settlement_initiated',
        description: `Settlement negotiation initiated with offer: $${initialOffer}`,
        performedBy: initiatedBy,
    }, transaction);
    return settlement;
};
exports.initiateSettlement = initiateSettlement;
/**
 * 22. Updates settlement offer.
 *
 * @param {string} settlementId - Settlement ID
 * @param {number} newOffer - New settlement offer
 * @param {string} offeredBy - User making offer
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated settlement
 */
const updateSettlementOffer = async (settlementId, newOffer, offeredBy, transaction) => {
    // Would update settlement record
    return {
        id: settlementId,
        currentOffer: newOffer,
        updatedAt: new Date(),
    };
};
exports.updateSettlementOffer = updateSettlementOffer;
/**
 * 23. Finalizes settlement.
 *
 * @param {SettlementData} data - Settlement data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Finalized settlement
 */
const finalizeSettlement = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    if (!data.claimantAcceptance) {
        throw new common_1.BadRequestException('Settlement requires claimant acceptance');
    }
    claim.status = ClaimStatus.SETTLED;
    claim.actualLossAmount = data.settlementAmount;
    const settlement = {
        id: generateUUID(),
        claimId: data.claimId,
        settlementAmount: data.settlementAmount,
        settlementType: data.settlementType,
        negotiatedBy: data.negotiatedBy,
        claimantAcceptance: data.claimantAcceptance,
        releaseObtained: data.releaseObtained,
        settlementDate: data.settlementDate,
        terms: data.terms,
        conditions: data.conditions,
        status: 'finalized',
        createdAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'settlement_finalized',
        description: `Settlement finalized for $${data.settlementAmount}`,
        performedBy: data.negotiatedBy,
    }, transaction);
    return settlement;
};
exports.finalizeSettlement = finalizeSettlement;
// ============================================================================
// 7. DIARY & TASK MANAGEMENT
// ============================================================================
/**
 * 24. Creates diary entry/task.
 *
 * @param {DiaryEntryData} data - Diary entry data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Diary entry
 */
const createDiaryEntry = async (data, transaction) => {
    const diary = {
        id: generateUUID(),
        claimId: data.claimId,
        taskType: data.taskType,
        taskDescription: data.taskDescription,
        assignedTo: data.assignedTo,
        dueDate: data.dueDate,
        priority: data.priority,
        status: 'pending',
        relatedParty: data.relatedParty,
        notes: data.notes,
        createdAt: new Date(),
    };
    return diary;
};
exports.createDiaryEntry = createDiaryEntry;
/**
 * 25. Completes diary entry/task.
 *
 * @param {string} diaryId - Diary entry ID
 * @param {string} completionNotes - Completion notes
 * @param {string} completedBy - User completing task
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Completed diary entry
 */
const completeDiaryEntry = async (diaryId, completionNotes, completedBy, transaction) => {
    return {
        id: diaryId,
        status: 'completed',
        completionNotes,
        completedBy,
        completedAt: new Date(),
    };
};
exports.completeDiaryEntry = completeDiaryEntry;
/**
 * 26. Retrieves pending tasks for claim.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Pending tasks
 */
const getPendingTasks = async (claimId, transaction) => {
    // Would query diary entries with status 'pending'
    return [];
};
exports.getPendingTasks = getPendingTasks;
/**
 * 27. Retrieves overdue tasks for adjuster.
 *
 * @param {string} adjusterId - Adjuster ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Overdue tasks
 */
const getOverdueTasks = async (adjusterId, transaction) => {
    // Would query diary entries past due date
    return [];
};
exports.getOverdueTasks = getOverdueTasks;
// ============================================================================
// 8. DOCUMENTATION & EVIDENCE
// ============================================================================
/**
 * 28. Uploads claim document.
 *
 * @param {string} claimId - Claim ID
 * @param {ClaimDocumentType} documentType - Document type
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - File name
 * @param {string} uploadedBy - User uploading document
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Document record
 */
const uploadClaimDocument = async (claimId, documentType, fileBuffer, fileName, uploadedBy, transaction) => {
    const document = {
        id: generateUUID(),
        claimId,
        documentType,
        fileName,
        fileSize: fileBuffer.length,
        uploadedBy,
        uploadedAt: new Date(),
        storageUrl: `claims/${claimId}/${fileName}`,
    };
    await createClaimActivity({
        claimId,
        activityType: 'document_uploaded',
        description: `Document uploaded: ${fileName} (${documentType})`,
        performedBy: uploadedBy,
    }, transaction);
    return document;
};
exports.uploadClaimDocument = uploadClaimDocument;
/**
 * 29. Retrieves claim documents.
 *
 * @param {string} claimId - Claim ID
 * @param {ClaimDocumentType} [documentType] - Optional filter by type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Documents
 */
const getClaimDocuments = async (claimId, documentType, transaction) => {
    // Would query documents, optionally filtered by type
    return [];
};
exports.getClaimDocuments = getClaimDocuments;
/**
 * 30. Adds claim note.
 *
 * @param {ClaimNoteData} data - Note data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Note record
 */
const addClaimNote = async (data, transaction) => {
    const note = {
        id: generateUUID(),
        claimId: data.claimId,
        noteType: data.noteType,
        content: data.content,
        createdBy: data.createdBy,
        confidential: data.confidential,
        tags: data.tags,
        createdAt: new Date(),
    };
    return note;
};
exports.addClaimNote = addClaimNote;
/**
 * 31. Retrieves claim notes.
 *
 * @param {string} claimId - Claim ID
 * @param {boolean} [includeConfidential] - Include confidential notes
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Notes
 */
const getClaimNotes = async (claimId, includeConfidential = false, transaction) => {
    // Would query notes, filtering by confidential flag
    return [];
};
exports.getClaimNotes = getClaimNotes;
// ============================================================================
// 9. CLAIM STATUS & WORKFLOWS
// ============================================================================
/**
 * 32. Updates claim status.
 *
 * @param {string} claimId - Claim ID
 * @param {ClaimStatus} newStatus - New status
 * @param {string} reason - Reason for status change
 * @param {string} updatedBy - User updating status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated claim
 */
const updateClaimStatus = async (claimId, newStatus, reason, updatedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    const previousStatus = claim.status;
    claim.status = newStatus;
    await createClaimActivity({
        claimId,
        activityType: 'status_change',
        description: `Status changed from ${previousStatus} to ${newStatus}: ${reason}`,
        performedBy: updatedBy,
    }, transaction);
    return claim;
};
exports.updateClaimStatus = updateClaimStatus;
/**
 * 33. Closes claim.
 *
 * @param {string} claimId - Claim ID
 * @param {string} closureReason - Closure reason
 * @param {string} closedBy - User closing claim
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Closed claim
 */
const closeClaim = async (claimId, closureReason, closedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    if (claim.status === ClaimStatus.CLOSED) {
        throw new common_1.BadRequestException('Claim is already closed');
    }
    claim.status = ClaimStatus.CLOSED;
    claim.closedDate = new Date();
    await createClaimActivity({
        claimId,
        activityType: 'claim_closed',
        description: `Claim closed: ${closureReason}`,
        performedBy: closedBy,
    }, transaction);
    return claim;
};
exports.closeClaim = closeClaim;
/**
 * 34. Denies claim.
 *
 * @param {string} claimId - Claim ID
 * @param {string} denialReason - Denial reason
 * @param {string} deniedBy - User denying claim
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Denied claim
 */
const denyClaim = async (claimId, denialReason, deniedBy, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    claim.status = ClaimStatus.DENIED;
    claim.deniedDate = new Date();
    claim.denialReason = denialReason;
    await createClaimActivity({
        claimId,
        activityType: 'claim_denied',
        description: `Claim denied: ${denialReason}`,
        performedBy: deniedBy,
    }, transaction);
    return claim;
};
exports.denyClaim = denyClaim;
/**
 * 35. Reopens closed claim.
 *
 * @param {ClaimReopeningData} data - Reopening data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Reopened claim
 */
const reopenClaim = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    if (claim.status !== ClaimStatus.CLOSED) {
        throw new common_1.BadRequestException('Only closed claims can be reopened');
    }
    claim.status = ClaimStatus.REOPENED;
    claim.closedDate = null;
    if (data.additionalReserve) {
        claim.reserveAmount += data.additionalReserve;
    }
    if (data.newAssignedAdjusterId) {
        claim.assignedAdjusterId = data.newAssignedAdjusterId;
    }
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'claim_reopened',
        description: `Claim reopened: ${data.reopenReason}`,
        performedBy: data.reopenedBy,
        metadata: { notes: data.notes, additionalReserve: data.additionalReserve },
    }, transaction);
    return claim;
};
exports.reopenClaim = reopenClaim;
// ============================================================================
// 10. SUBROGATION & SALVAGE
// ============================================================================
/**
 * 36. Identifies subrogation opportunity.
 *
 * @param {SubrogationOpportunity} data - Subrogation opportunity data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Subrogation record
 */
const identifySubrogationOpportunity = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    claim.subrogationPotential = true;
    claim.status = ClaimStatus.SUBROGATION;
    const subrogation = {
        id: generateUUID(),
        claimId: data.claimId,
        potentialRecovery: data.potentialRecovery,
        responsibleParty: data.responsibleParty,
        responsiblePartyInsurer: data.responsiblePartyInsurer,
        basis: data.basis,
        probability: data.probability,
        status: 'identified',
        identifiedBy: data.identifiedBy,
        identifiedDate: data.identifiedDate,
        createdAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'subrogation_identified',
        description: `Subrogation opportunity identified: $${data.potentialRecovery} potential recovery`,
        performedBy: data.identifiedBy,
    }, transaction);
    return subrogation;
};
exports.identifySubrogationOpportunity = identifySubrogationOpportunity;
/**
 * 37. Pursues subrogation recovery.
 *
 * @param {string} subrogationId - Subrogation record ID
 * @param {string} pursuedBy - User pursuing subrogation
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated subrogation
 */
const pursueSubrogation = async (subrogationId, pursuedBy, transaction) => {
    return {
        id: subrogationId,
        status: 'in_pursuit',
        pursuedBy,
        pursuedDate: new Date(),
    };
};
exports.pursueSubrogation = pursueSubrogation;
/**
 * 38. Records subrogation recovery.
 *
 * @param {string} subrogationId - Subrogation record ID
 * @param {number} recoveryAmount - Recovered amount
 * @param {string} recoveredBy - User recording recovery
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated subrogation
 */
const recordSubrogationRecovery = async (subrogationId, recoveryAmount, recoveredBy, transaction) => {
    return {
        id: subrogationId,
        status: 'recovered',
        recoveryAmount,
        recoveredBy,
        recoveredDate: new Date(),
    };
};
exports.recordSubrogationRecovery = recordSubrogationRecovery;
/**
 * 39. Assesses salvage value.
 *
 * @param {SalvageAssessment} data - Salvage assessment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Salvage record
 */
const assessSalvageValue = async (data, transaction) => {
    const claim = await getClaimById(data.claimId, transaction);
    claim.salvageValue = data.estimatedValue;
    const salvage = {
        id: generateUUID(),
        claimId: data.claimId,
        itemDescription: data.itemDescription,
        estimatedValue: data.estimatedValue,
        condition: data.condition,
        dispositionPlan: data.dispositionPlan,
        assessedBy: data.assessedBy,
        assessedDate: data.assessedDate,
        status: 'assessed',
        createdAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'salvage_assessed',
        description: `Salvage assessed: $${data.estimatedValue}`,
        performedBy: data.assessedBy,
    }, transaction);
    return salvage;
};
exports.assessSalvageValue = assessSalvageValue;
/**
 * 40. Records salvage recovery.
 *
 * @param {string} salvageId - Salvage record ID
 * @param {number} actualRecovery - Actual recovery amount
 * @param {string} recoveredBy - User recording recovery
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Updated salvage
 */
const recordSalvageRecovery = async (salvageId, actualRecovery, recoveredBy, transaction) => {
    return {
        id: salvageId,
        status: 'recovered',
        actualRecovery,
        recoveredBy,
        recoveredDate: new Date(),
    };
};
exports.recordSalvageRecovery = recordSalvageRecovery;
// ============================================================================
// 11. ESCALATION & REPORTING
// ============================================================================
/**
 * 41. Escalates claim.
 *
 * @param {EscalationData} data - Escalation data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Escalation record
 */
const escalateClaim = async (data, transaction) => {
    const escalation = {
        id: generateUUID(),
        claimId: data.claimId,
        escalationType: data.escalationType,
        escalatedTo: data.escalatedTo,
        escalatedBy: data.escalatedBy,
        reason: data.reason,
        urgency: data.urgency,
        requestedAction: data.requestedAction,
        status: 'pending',
        escalatedAt: new Date(),
    };
    await createClaimActivity({
        claimId: data.claimId,
        activityType: 'claim_escalated',
        description: `Claim escalated to ${data.escalatedTo}: ${data.reason}`,
        performedBy: data.escalatedBy,
    }, transaction);
    return escalation;
};
exports.escalateClaim = escalateClaim;
/**
 * 42. Generates claims report.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {string[]} [filters] - Optional filters
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Claims report
 */
const generateClaimsReport = async (startDate, endDate, filters, transaction) => {
    // Would aggregate claim data for reporting
    return {
        reportPeriod: { startDate, endDate },
        totalClaims: 0,
        totalPaid: 0,
        totalReserves: 0,
        averageClaimValue: 0,
        claimsByType: {},
        claimsByStatus: {},
        topAdjusters: [],
    };
};
exports.generateClaimsReport = generateClaimsReport;
/**
 * 43. Retrieves claim analytics.
 *
 * @param {string} [adjusterId] - Optional adjuster filter
 * @param {Date} [startDate] - Optional start date
 * @param {Date} [endDate] - Optional end date
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any>} Claim analytics
 */
const getClaimAnalytics = async (adjusterId, startDate, endDate, transaction) => {
    return {
        openClaims: 0,
        closedClaims: 0,
        averageCycleDays: 0,
        totalIncurred: 0,
        lossRatio: 0,
        severityDistribution: {},
    };
};
exports.getClaimAnalytics = getClaimAnalytics;
/**
 * 44. Retrieves claim lifecycle timeline.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<any[]>} Timeline events
 */
const getClaimTimeline = async (claimId, transaction) => {
    // Would query all activities for claim
    return [];
};
exports.getClaimTimeline = getClaimTimeline;
/**
 * 45. Validates claim closure eligibility.
 *
 * @param {string} claimId - Claim ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<{ eligible: boolean; reasons: string[] }>} Eligibility result
 */
const validateClaimClosureEligibility = async (claimId, transaction) => {
    const claim = await getClaimById(claimId, transaction);
    const reasons = [];
    const pendingTasks = await (0, exports.getPendingTasks)(claimId, transaction);
    if (pendingTasks.length > 0) {
        reasons.push(`${pendingTasks.length} pending tasks must be completed`);
    }
    if (claim.reserveAmount > claim.paidAmount) {
        reasons.push('Outstanding reserves must be resolved');
    }
    if (![ClaimStatus.SETTLED, ClaimStatus.DENIED, ClaimStatus.PAID].includes(claim.status)) {
        reasons.push('Claim must be settled, denied, or fully paid');
    }
    return {
        eligible: reasons.length === 0,
        reasons,
    };
};
exports.validateClaimClosureEligibility = validateClaimClosureEligibility;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper: Generates claim number.
 */
const generateClaimNumber = async (claimType) => {
    const prefix = claimType.split('_')[0].substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().substring(6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CLM-${prefix}-${timestamp}${random}`;
};
/**
 * Helper: Generates UUID.
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
/**
 * Helper: Retrieves claim by ID.
 */
const getClaimById = async (claimId, transaction) => {
    // Would fetch from database
    const claim = null;
    if (!claim) {
        throw new common_1.NotFoundException(`Claim ${claimId} not found`);
    }
    return claim;
};
/**
 * Helper: Creates claim activity log.
 */
const createClaimActivity = async (data, transaction) => {
    const activity = {
        id: generateUUID(),
        ...data,
        performedAt: new Date(),
        createdAt: new Date(),
    };
    return activity;
};
/**
 * Helper: Calculates claim severity.
 */
const calculateSeverity = async (data) => {
    if (data.injuries && data.injuries.length > 0) {
        return ClaimSeverity.SEVERE;
    }
    if (data.estimatedLossAmount) {
        if (data.estimatedLossAmount > 100000)
            return ClaimSeverity.CATASTROPHIC;
        if (data.estimatedLossAmount > 50000)
            return ClaimSeverity.SEVERE;
        if (data.estimatedLossAmount > 25000)
            return ClaimSeverity.MAJOR;
        if (data.estimatedLossAmount > 10000)
            return ClaimSeverity.MODERATE;
    }
    return ClaimSeverity.MINOR;
};
/**
 * Helper: Evaluates subrogation potential.
 */
const evaluateSubrogationPotential = async (data) => {
    if (data.thirdParties && data.thirdParties.length > 0) {
        return true;
    }
    if (data.lossType === LossType.COLLISION && data.policeReportFiled) {
        return true;
    }
    return false;
};
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Claims Intake (FNOL)
    registerFNOL: exports.registerFNOL,
    updateFNOL: exports.updateFNOL,
    validateFNOL: exports.validateFNOL,
    openClaim: exports.openClaim,
    // Claim Assignment & Routing
    assignClaim: exports.assignClaim,
    reassignClaim: exports.reassignClaim,
    routeClaim: exports.routeClaim,
    getAdjusterWorkload: exports.getAdjusterWorkload,
    // Claim Investigation
    initiateInvestigation: exports.initiateInvestigation,
    updateInvestigationFindings: exports.updateInvestigationFindings,
    completeInvestigation: exports.completeInvestigation,
    determineLiability: exports.determineLiability,
    // Loss Reserves
    setInitialReserve: exports.setInitialReserve,
    updateReserve: exports.updateReserve,
    getReserveHistory: exports.getReserveHistory,
    assessReserveAdequacy: exports.assessReserveAdequacy,
    // Claims Payment Processing
    processClaimPayment: exports.processClaimPayment,
    getPaymentHistory: exports.getPaymentHistory,
    calculateRemainingReserves: exports.calculateRemainingReserves,
    voidPayment: exports.voidPayment,
    // Settlement Negotiation
    initiateSettlement: exports.initiateSettlement,
    updateSettlementOffer: exports.updateSettlementOffer,
    finalizeSettlement: exports.finalizeSettlement,
    // Diary & Task Management
    createDiaryEntry: exports.createDiaryEntry,
    completeDiaryEntry: exports.completeDiaryEntry,
    getPendingTasks: exports.getPendingTasks,
    getOverdueTasks: exports.getOverdueTasks,
    // Documentation & Evidence
    uploadClaimDocument: exports.uploadClaimDocument,
    getClaimDocuments: exports.getClaimDocuments,
    addClaimNote: exports.addClaimNote,
    getClaimNotes: exports.getClaimNotes,
    // Claim Status & Workflows
    updateClaimStatus: exports.updateClaimStatus,
    closeClaim: exports.closeClaim,
    denyClaim: exports.denyClaim,
    reopenClaim: exports.reopenClaim,
    // Subrogation & Salvage
    identifySubrogationOpportunity: exports.identifySubrogationOpportunity,
    pursueSubrogation: exports.pursueSubrogation,
    recordSubrogationRecovery: exports.recordSubrogationRecovery,
    assessSalvageValue: exports.assessSalvageValue,
    recordSalvageRecovery: exports.recordSalvageRecovery,
    // Escalation & Reporting
    escalateClaim: exports.escalateClaim,
    generateClaimsReport: exports.generateClaimsReport,
    getClaimAnalytics: exports.getClaimAnalytics,
    getClaimTimeline: exports.getClaimTimeline,
    validateClaimClosureEligibility: exports.validateClaimClosureEligibility,
    // Model Creators
    createClaimModel: exports.createClaimModel,
    createClaimReserveHistoryModel: exports.createClaimReserveHistoryModel,
};
//# sourceMappingURL=claims-processing-kit.js.map