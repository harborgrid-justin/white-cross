"use strict";
/**
 * LOC: CONFLICT_CHECK_KIT_001
 * File: /reuse/legal/conflict-check-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/config
 *   - sequelize-typescript
 *   - sequelize
 *   - @nestjs/swagger
 *   - zod
 *   - crypto
 *   - date-fns
 *
 * DOWNSTREAM (imported by):
 *   - Conflict of interest management modules
 *   - Client intake services
 *   - Matter management controllers
 *   - Ethics compliance dashboards
 *   - Lateral hire onboarding services
 *   - Waiver management modules
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
exports.ConflictCheckModule = exports.conflictCheckConfig = exports.ConflictReportingService = exports.LateralHireService = exports.EthicalWallService = exports.WaiverManagementService = exports.ConflictScreeningService = exports.ConflictNotificationModel = exports.LateralHireCheckModel = exports.EthicalWallModel = exports.WaiverDocumentModel = exports.ConflictDetailModel = exports.ConflictCheckRequestModel = exports.LateralHireCheckSchema = exports.PriorMatterSchema = exports.EthicalWallSchema = exports.WaiverDocumentSchema = exports.ConflictDetailSchema = exports.ConflictCheckRequestSchema = exports.RelatedEntitySchema = exports.OpposingPartySchema = exports.ScreeningScope = exports.EntityRelationshipType = exports.LateralHireStatus = exports.EthicalWallStatus = exports.WaiverStatus = exports.ConflictResolution = exports.ConflictSeverity = exports.ConflictType = exports.ConflictCheckStatus = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Conflict check status
 */
var ConflictCheckStatus;
(function (ConflictCheckStatus) {
    ConflictCheckStatus["PENDING"] = "pending";
    ConflictCheckStatus["IN_PROGRESS"] = "in_progress";
    ConflictCheckStatus["CLEARED"] = "cleared";
    ConflictCheckStatus["CONFLICT_FOUND"] = "conflict_found";
    ConflictCheckStatus["WAIVED"] = "waived";
    ConflictCheckStatus["DECLINED"] = "declined";
    ConflictCheckStatus["REQUIRES_REVIEW"] = "requires_review";
})(ConflictCheckStatus || (exports.ConflictCheckStatus = ConflictCheckStatus = {}));
/**
 * Conflict type classification
 */
var ConflictType;
(function (ConflictType) {
    ConflictType["DIRECT_ADVERSITY"] = "direct_adversity";
    ConflictType["MATERIAL_LIMITATION"] = "material_limitation";
    ConflictType["FORMER_CLIENT"] = "former_client";
    ConflictType["IMPUTED_CONFLICT"] = "imputed_conflict";
    ConflictType["PERSONAL_INTEREST"] = "personal_interest";
    ConflictType["THIRD_PARTY_PAYER"] = "third_party_payer";
    ConflictType["PROSPECTIVE_CLIENT"] = "prospective_client";
    ConflictType["BUSINESS_TRANSACTION"] = "business_transaction";
    ConflictType["FAMILY_RELATIONSHIP"] = "family_relationship";
    ConflictType["FINANCIAL_INTEREST"] = "financial_interest";
    ConflictType["ADVERSE_WITNESS"] = "adverse_witness";
})(ConflictType || (exports.ConflictType = ConflictType = {}));
/**
 * Conflict severity rating
 */
var ConflictSeverity;
(function (ConflictSeverity) {
    ConflictSeverity["LOW"] = "low";
    ConflictSeverity["MEDIUM"] = "medium";
    ConflictSeverity["HIGH"] = "high";
    ConflictSeverity["CRITICAL"] = "critical";
    ConflictSeverity["ABSOLUTE"] = "absolute";
})(ConflictSeverity || (exports.ConflictSeverity = ConflictSeverity = {}));
/**
 * Conflict resolution method
 */
var ConflictResolution;
(function (ConflictResolution) {
    ConflictResolution["WAIVED_BY_CLIENT"] = "waived_by_client";
    ConflictResolution["ETHICAL_WALL_IMPLEMENTED"] = "ethical_wall_implemented";
    ConflictResolution["REPRESENTATION_DECLINED"] = "representation_declined";
    ConflictResolution["REPRESENTATION_TERMINATED"] = "representation_terminated";
    ConflictResolution["NO_CONFLICT"] = "no_conflict";
    ConflictResolution["PENDING_REVIEW"] = "pending_review";
    ConflictResolution["SCREENING_IMPLEMENTED"] = "screening_implemented";
    ConflictResolution["ATTORNEY_RECUSED"] = "attorney_recused";
})(ConflictResolution || (exports.ConflictResolution = ConflictResolution = {}));
/**
 * Waiver status
 */
var WaiverStatus;
(function (WaiverStatus) {
    WaiverStatus["DRAFT"] = "draft";
    WaiverStatus["SENT_TO_CLIENT"] = "sent_to_client";
    WaiverStatus["EXECUTED"] = "executed";
    WaiverStatus["DECLINED"] = "declined";
    WaiverStatus["REVOKED"] = "revoked";
    WaiverStatus["EXPIRED"] = "expired";
})(WaiverStatus || (exports.WaiverStatus = WaiverStatus = {}));
/**
 * Ethical wall status
 */
var EthicalWallStatus;
(function (EthicalWallStatus) {
    EthicalWallStatus["PROPOSED"] = "proposed";
    EthicalWallStatus["ACTIVE"] = "active";
    EthicalWallStatus["BREACHED"] = "breached";
    EthicalWallStatus["LIFTED"] = "lifted";
    EthicalWallStatus["INEFFECTIVE"] = "ineffective";
})(EthicalWallStatus || (exports.EthicalWallStatus = EthicalWallStatus = {}));
/**
 * Lateral hire check status
 */
var LateralHireStatus;
(function (LateralHireStatus) {
    LateralHireStatus["INITIATED"] = "initiated";
    LateralHireStatus["PRELIMINARY_REVIEW"] = "preliminary_review";
    LateralHireStatus["DETAILED_ANALYSIS"] = "detailed_analysis";
    LateralHireStatus["CONFLICTS_IDENTIFIED"] = "conflicts_identified";
    LateralHireStatus["CLEARED"] = "cleared";
    LateralHireStatus["CONDITIONAL_APPROVAL"] = "conditional_approval";
    LateralHireStatus["HIRE_DECLINED"] = "hire_declined";
})(LateralHireStatus || (exports.LateralHireStatus = LateralHireStatus = {}));
/**
 * Entity relationship type
 */
var EntityRelationshipType;
(function (EntityRelationshipType) {
    EntityRelationshipType["PARENT_COMPANY"] = "parent_company";
    EntityRelationshipType["SUBSIDIARY"] = "subsidiary";
    EntityRelationshipType["AFFILIATE"] = "affiliate";
    EntityRelationshipType["COMPETITOR"] = "competitor";
    EntityRelationshipType["PARTNER"] = "partner";
    EntityRelationshipType["VENDOR"] = "vendor";
    EntityRelationshipType["CUSTOMER"] = "customer";
    EntityRelationshipType["INVESTOR"] = "investor";
    EntityRelationshipType["OFFICER"] = "officer";
    EntityRelationshipType["DIRECTOR"] = "director";
})(EntityRelationshipType || (exports.EntityRelationshipType = EntityRelationshipType = {}));
/**
 * Screening scope
 */
var ScreeningScope;
(function (ScreeningScope) {
    ScreeningScope["NEW_MATTER"] = "new_matter";
    ScreeningScope["LATERAL_HIRE"] = "lateral_hire";
    ScreeningScope["MERGER_ACQUISITION"] = "merger_acquisition";
    ScreeningScope["PERIODIC_REVIEW"] = "periodic_review";
    ScreeningScope["AD_HOC"] = "ad_hoc";
    ScreeningScope["PROSPECTIVE_CLIENT"] = "prospective_client";
})(ScreeningScope || (exports.ScreeningScope = ScreeningScope = {}));
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
/**
 * Opposing party validation schema
 */
exports.OpposingPartySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    aliases: zod_1.z.array(zod_1.z.string()).optional(),
    entityType: zod_1.z.enum(['individual', 'corporation', 'partnership', 'government', 'other']),
    jurisdiction: zod_1.z.string().optional(),
    identifiers: zod_1.z.object({
        taxId: zod_1.z.string().optional(),
        registrationNumber: zod_1.z.string().optional(),
        other: zod_1.z.record(zod_1.z.string()).optional(),
    }).optional(),
    counsel: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Related entity validation schema
 */
exports.RelatedEntitySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    relationshipType: zod_1.z.nativeEnum(EntityRelationshipType),
    description: zod_1.z.string().optional(),
    significance: zod_1.z.enum(['low', 'medium', 'high']),
});
/**
 * Conflict check request validation schema
 */
exports.ConflictCheckRequestSchema = zod_1.z.object({
    requestType: zod_1.z.nativeEnum(ScreeningScope),
    matterId: zod_1.z.string().uuid().optional(),
    clientId: zod_1.z.string().uuid().optional(),
    clientName: zod_1.z.string().min(1),
    opposingParties: zod_1.z.array(exports.OpposingPartySchema),
    relatedEntities: zod_1.z.array(exports.RelatedEntitySchema),
    matterDescription: zod_1.z.string().min(10),
    practiceArea: zod_1.z.string().min(1),
    requestedBy: zod_1.z.string().uuid(),
    requestDate: zod_1.z.date(),
    urgency: zod_1.z.enum(['low', 'normal', 'high', 'critical']),
    jurisdictions: zod_1.z.array(zod_1.z.string()),
    estimatedValue: zod_1.z.number().positive().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Conflict detail validation schema
 */
exports.ConflictDetailSchema = zod_1.z.object({
    conflictType: zod_1.z.nativeEnum(ConflictType),
    severity: zod_1.z.nativeEnum(ConflictSeverity),
    description: zod_1.z.string().min(10),
    involvedParties: zod_1.z.array(zod_1.z.string()),
    affectedAttorneys: zod_1.z.array(zod_1.z.string()),
    conflictingMatterId: zod_1.z.string().uuid().optional(),
    conflictingClientId: zod_1.z.string().uuid().optional(),
    riskAssessment: zod_1.z.string().min(10),
    recommendation: zod_1.z.string().min(10),
    waiverPossible: zod_1.z.boolean(),
    ethicalRulesViolated: zod_1.z.array(zod_1.z.string()).optional(),
    identifiedDate: zod_1.z.date(),
    identifiedBy: zod_1.z.string().uuid(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Waiver document validation schema
 */
exports.WaiverDocumentSchema = zod_1.z.object({
    conflictCheckId: zod_1.z.string().uuid(),
    conflictId: zod_1.z.string().uuid(),
    clientId: zod_1.z.string().uuid(),
    waiverType: zod_1.z.enum(['informed_consent', 'advance_waiver', 'limited_waiver']),
    status: zod_1.z.nativeEnum(WaiverStatus),
    documentText: zod_1.z.string().min(50),
    disclosureProvided: zod_1.z.string().min(50),
    sentDate: zod_1.z.date().optional(),
    executedDate: zod_1.z.date().optional(),
    signatories: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        title: zod_1.z.string(),
        signedDate: zod_1.z.date().optional(),
        signature: zod_1.z.string().optional(),
    })),
    expirationDate: zod_1.z.date().optional(),
    conditions: zod_1.z.array(zod_1.z.string()).optional(),
    revokedDate: zod_1.z.date().optional(),
    revokedReason: zod_1.z.string().optional(),
    reviewedBy: zod_1.z.string().uuid(),
    approvedBy: zod_1.z.string().uuid().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Ethical wall validation schema
 */
exports.EthicalWallSchema = zod_1.z.object({
    conflictCheckId: zod_1.z.string().uuid(),
    matterId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(EthicalWallStatus),
    screenedAttorneys: zod_1.z.array(zod_1.z.string().uuid()),
    restrictedInformation: zod_1.z.array(zod_1.z.string()),
    implementationDate: zod_1.z.date(),
    implementedBy: zod_1.z.string().uuid(),
    protocols: zod_1.z.array(zod_1.z.object({
        description: zod_1.z.string(),
        responsible: zod_1.z.string(),
        verificationMethod: zod_1.z.string(),
    })),
    physicalMeasures: zod_1.z.array(zod_1.z.string()).optional(),
    technicalMeasures: zod_1.z.array(zod_1.z.string()).optional(),
    trainingCompleted: zod_1.z.boolean(),
    monitoringFrequency: zod_1.z.string(),
    lastReviewDate: zod_1.z.date().optional(),
    breaches: zod_1.z.array(zod_1.z.object({
        date: zod_1.z.date(),
        description: zod_1.z.string(),
        remediation: zod_1.z.string(),
        reportedBy: zod_1.z.string(),
    })).optional(),
    liftedDate: zod_1.z.date().optional(),
    liftedReason: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
/**
 * Prior matter validation schema
 */
exports.PriorMatterSchema = zod_1.z.object({
    matterName: zod_1.z.string().min(1),
    clientName: zod_1.z.string().min(1),
    opposingParties: zod_1.z.array(zod_1.z.string()),
    practiceArea: zod_1.z.string().min(1),
    startDate: zod_1.z.date(),
    endDate: zod_1.z.date().optional(),
    role: zod_1.z.string().min(1),
    jurisdiction: zod_1.z.string().min(1),
    confidentialInformation: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Lateral hire check validation schema
 */
exports.LateralHireCheckSchema = zod_1.z.object({
    candidateId: zod_1.z.string().uuid(),
    candidateName: zod_1.z.string().min(1),
    currentFirm: zod_1.z.string().min(1),
    proposedStartDate: zod_1.z.date(),
    status: zod_1.z.nativeEnum(LateralHireStatus),
    priorMatters: zod_1.z.array(exports.PriorMatterSchema),
    currentMatters: zod_1.z.array(zod_1.z.object({
        matterName: zod_1.z.string(),
        clientName: zod_1.z.string(),
        practiceArea: zod_1.z.string(),
        startDate: zod_1.z.date(),
        expectedDuration: zod_1.z.number().optional(),
        portability: zod_1.z.enum(['portable', 'non_portable', 'uncertain']),
        clientConsent: zod_1.z.boolean().optional(),
    })),
    conflictsIdentified: zod_1.z.array(exports.ConflictDetailSchema),
    screeningNotes: zod_1.z.string().min(10),
    performedBy: zod_1.z.string().uuid(),
    reviewDate: zod_1.z.date(),
    approvalRequired: zod_1.z.boolean(),
    approvedBy: zod_1.z.string().uuid().optional(),
    approvalDate: zod_1.z.date().optional(),
    conditions: zod_1.z.array(zod_1.z.string()).optional(),
    ethicalWallsRequired: zod_1.z.array(zod_1.z.string()).optional(),
    clientNotificationsRequired: zod_1.z.array(zod_1.z.string()).optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Conflict Check Request Model
 * Stores conflict check requests and their outcomes
 */
let ConflictCheckRequestModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'conflict_check_requests',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['clientId'] },
                { fields: ['matterId'] },
                { fields: ['requestedBy'] },
                { fields: ['requestDate'] },
                { fields: ['status'] },
                { fields: ['requestType'] },
                { fields: ['practiceArea'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _requestType_decorators;
    let _requestType_initializers = [];
    let _requestType_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _clientName_decorators;
    let _clientName_initializers = [];
    let _clientName_extraInitializers = [];
    let _opposingParties_decorators;
    let _opposingParties_initializers = [];
    let _opposingParties_extraInitializers = [];
    let _relatedEntities_decorators;
    let _relatedEntities_initializers = [];
    let _relatedEntities_extraInitializers = [];
    let _matterDescription_decorators;
    let _matterDescription_initializers = [];
    let _matterDescription_extraInitializers = [];
    let _practiceArea_decorators;
    let _practiceArea_initializers = [];
    let _practiceArea_extraInitializers = [];
    let _requestedBy_decorators;
    let _requestedBy_initializers = [];
    let _requestedBy_extraInitializers = [];
    let _requestDate_decorators;
    let _requestDate_initializers = [];
    let _requestDate_extraInitializers = [];
    let _urgency_decorators;
    let _urgency_initializers = [];
    let _urgency_extraInitializers = [];
    let _jurisdictions_decorators;
    let _jurisdictions_initializers = [];
    let _jurisdictions_extraInitializers = [];
    let _estimatedValue_decorators;
    let _estimatedValue_initializers = [];
    let _estimatedValue_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _conflicts_decorators;
    let _conflicts_initializers = [];
    let _conflicts_extraInitializers = [];
    let _waivers_decorators;
    let _waivers_initializers = [];
    let _waivers_extraInitializers = [];
    let _ethicalWalls_decorators;
    let _ethicalWalls_initializers = [];
    let _ethicalWalls_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ConflictCheckRequestModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.requestType = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _requestType_initializers, void 0));
            this.matterId = (__runInitializers(this, _requestType_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.clientId = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.clientName = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _clientName_initializers, void 0));
            this.opposingParties = (__runInitializers(this, _clientName_extraInitializers), __runInitializers(this, _opposingParties_initializers, void 0));
            this.relatedEntities = (__runInitializers(this, _opposingParties_extraInitializers), __runInitializers(this, _relatedEntities_initializers, void 0));
            this.matterDescription = (__runInitializers(this, _relatedEntities_extraInitializers), __runInitializers(this, _matterDescription_initializers, void 0));
            this.practiceArea = (__runInitializers(this, _matterDescription_extraInitializers), __runInitializers(this, _practiceArea_initializers, void 0));
            this.requestedBy = (__runInitializers(this, _practiceArea_extraInitializers), __runInitializers(this, _requestedBy_initializers, void 0));
            this.requestDate = (__runInitializers(this, _requestedBy_extraInitializers), __runInitializers(this, _requestDate_initializers, void 0));
            this.urgency = (__runInitializers(this, _requestDate_extraInitializers), __runInitializers(this, _urgency_initializers, void 0));
            this.jurisdictions = (__runInitializers(this, _urgency_extraInitializers), __runInitializers(this, _jurisdictions_initializers, void 0));
            this.estimatedValue = (__runInitializers(this, _jurisdictions_extraInitializers), __runInitializers(this, _estimatedValue_initializers, void 0));
            this.status = (__runInitializers(this, _estimatedValue_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.performedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.completedDate = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.conflicts = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _conflicts_initializers, void 0));
            this.waivers = (__runInitializers(this, _conflicts_extraInitializers), __runInitializers(this, _waivers_initializers, void 0));
            this.ethicalWalls = (__runInitializers(this, _waivers_extraInitializers), __runInitializers(this, _ethicalWalls_initializers, void 0));
            this.createdAt = (__runInitializers(this, _ethicalWalls_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConflictCheckRequestModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _requestType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ScreeningScope)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: ScreeningScope, description: 'Type of screening request' })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Matter ID if applicable' })];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Client ID if applicable' })];
        _clientName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Client name' })];
        _opposingParties_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Opposing parties information' })];
        _relatedEntities_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Related entities' })];
        _matterDescription_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Matter description' })];
        _practiceArea_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(200),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Practice area' })];
        _requestedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'User who requested the check' })];
        _requestDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Request date' })];
        _urgency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('low', 'normal', 'high', 'critical'),
                allowNull: false,
                defaultValue: 'normal',
            }), (0, swagger_1.ApiProperty)({ description: 'Urgency level' })];
        _jurisdictions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Jurisdictions involved' })];
        _estimatedValue_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DECIMAL(15, 2),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Estimated matter value' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictCheckStatus)),
                allowNull: false,
                defaultValue: ConflictCheckStatus.PENDING,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: ConflictCheckStatus, description: 'Current status' })];
        _performedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'User who performed the check' })];
        _completedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date check was completed' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _conflicts_decorators = [(0, sequelize_typescript_1.HasMany)(() => ConflictDetailModel)];
        _waivers_decorators = [(0, sequelize_typescript_1.HasMany)(() => WaiverDocumentModel)];
        _ethicalWalls_decorators = [(0, sequelize_typescript_1.HasMany)(() => EthicalWallModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _requestType_decorators, { kind: "field", name: "requestType", static: false, private: false, access: { has: obj => "requestType" in obj, get: obj => obj.requestType, set: (obj, value) => { obj.requestType = value; } }, metadata: _metadata }, _requestType_initializers, _requestType_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _clientName_decorators, { kind: "field", name: "clientName", static: false, private: false, access: { has: obj => "clientName" in obj, get: obj => obj.clientName, set: (obj, value) => { obj.clientName = value; } }, metadata: _metadata }, _clientName_initializers, _clientName_extraInitializers);
        __esDecorate(null, null, _opposingParties_decorators, { kind: "field", name: "opposingParties", static: false, private: false, access: { has: obj => "opposingParties" in obj, get: obj => obj.opposingParties, set: (obj, value) => { obj.opposingParties = value; } }, metadata: _metadata }, _opposingParties_initializers, _opposingParties_extraInitializers);
        __esDecorate(null, null, _relatedEntities_decorators, { kind: "field", name: "relatedEntities", static: false, private: false, access: { has: obj => "relatedEntities" in obj, get: obj => obj.relatedEntities, set: (obj, value) => { obj.relatedEntities = value; } }, metadata: _metadata }, _relatedEntities_initializers, _relatedEntities_extraInitializers);
        __esDecorate(null, null, _matterDescription_decorators, { kind: "field", name: "matterDescription", static: false, private: false, access: { has: obj => "matterDescription" in obj, get: obj => obj.matterDescription, set: (obj, value) => { obj.matterDescription = value; } }, metadata: _metadata }, _matterDescription_initializers, _matterDescription_extraInitializers);
        __esDecorate(null, null, _practiceArea_decorators, { kind: "field", name: "practiceArea", static: false, private: false, access: { has: obj => "practiceArea" in obj, get: obj => obj.practiceArea, set: (obj, value) => { obj.practiceArea = value; } }, metadata: _metadata }, _practiceArea_initializers, _practiceArea_extraInitializers);
        __esDecorate(null, null, _requestedBy_decorators, { kind: "field", name: "requestedBy", static: false, private: false, access: { has: obj => "requestedBy" in obj, get: obj => obj.requestedBy, set: (obj, value) => { obj.requestedBy = value; } }, metadata: _metadata }, _requestedBy_initializers, _requestedBy_extraInitializers);
        __esDecorate(null, null, _requestDate_decorators, { kind: "field", name: "requestDate", static: false, private: false, access: { has: obj => "requestDate" in obj, get: obj => obj.requestDate, set: (obj, value) => { obj.requestDate = value; } }, metadata: _metadata }, _requestDate_initializers, _requestDate_extraInitializers);
        __esDecorate(null, null, _urgency_decorators, { kind: "field", name: "urgency", static: false, private: false, access: { has: obj => "urgency" in obj, get: obj => obj.urgency, set: (obj, value) => { obj.urgency = value; } }, metadata: _metadata }, _urgency_initializers, _urgency_extraInitializers);
        __esDecorate(null, null, _jurisdictions_decorators, { kind: "field", name: "jurisdictions", static: false, private: false, access: { has: obj => "jurisdictions" in obj, get: obj => obj.jurisdictions, set: (obj, value) => { obj.jurisdictions = value; } }, metadata: _metadata }, _jurisdictions_initializers, _jurisdictions_extraInitializers);
        __esDecorate(null, null, _estimatedValue_decorators, { kind: "field", name: "estimatedValue", static: false, private: false, access: { has: obj => "estimatedValue" in obj, get: obj => obj.estimatedValue, set: (obj, value) => { obj.estimatedValue = value; } }, metadata: _metadata }, _estimatedValue_initializers, _estimatedValue_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _conflicts_decorators, { kind: "field", name: "conflicts", static: false, private: false, access: { has: obj => "conflicts" in obj, get: obj => obj.conflicts, set: (obj, value) => { obj.conflicts = value; } }, metadata: _metadata }, _conflicts_initializers, _conflicts_extraInitializers);
        __esDecorate(null, null, _waivers_decorators, { kind: "field", name: "waivers", static: false, private: false, access: { has: obj => "waivers" in obj, get: obj => obj.waivers, set: (obj, value) => { obj.waivers = value; } }, metadata: _metadata }, _waivers_initializers, _waivers_extraInitializers);
        __esDecorate(null, null, _ethicalWalls_decorators, { kind: "field", name: "ethicalWalls", static: false, private: false, access: { has: obj => "ethicalWalls" in obj, get: obj => obj.ethicalWalls, set: (obj, value) => { obj.ethicalWalls = value; } }, metadata: _metadata }, _ethicalWalls_initializers, _ethicalWalls_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictCheckRequestModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictCheckRequestModel = _classThis;
})();
exports.ConflictCheckRequestModel = ConflictCheckRequestModel;
/**
 * Conflict Detail Model
 * Stores identified conflicts and their analysis
 */
let ConflictDetailModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'conflict_details',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['conflictCheckId'] },
                { fields: ['conflictType'] },
                { fields: ['severity'] },
                { fields: ['conflictingMatterId'] },
                { fields: ['conflictingClientId'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _conflictCheckId_decorators;
    let _conflictCheckId_initializers = [];
    let _conflictCheckId_extraInitializers = [];
    let _conflictCheck_decorators;
    let _conflictCheck_initializers = [];
    let _conflictCheck_extraInitializers = [];
    let _conflictType_decorators;
    let _conflictType_initializers = [];
    let _conflictType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _involvedParties_decorators;
    let _involvedParties_initializers = [];
    let _involvedParties_extraInitializers = [];
    let _affectedAttorneys_decorators;
    let _affectedAttorneys_initializers = [];
    let _affectedAttorneys_extraInitializers = [];
    let _conflictingMatterId_decorators;
    let _conflictingMatterId_initializers = [];
    let _conflictingMatterId_extraInitializers = [];
    let _conflictingClientId_decorators;
    let _conflictingClientId_initializers = [];
    let _conflictingClientId_extraInitializers = [];
    let _riskAssessment_decorators;
    let _riskAssessment_initializers = [];
    let _riskAssessment_extraInitializers = [];
    let _recommendation_decorators;
    let _recommendation_initializers = [];
    let _recommendation_extraInitializers = [];
    let _waiverPossible_decorators;
    let _waiverPossible_initializers = [];
    let _waiverPossible_extraInitializers = [];
    let _ethicalRulesViolated_decorators;
    let _ethicalRulesViolated_initializers = [];
    let _ethicalRulesViolated_extraInitializers = [];
    let _identifiedDate_decorators;
    let _identifiedDate_initializers = [];
    let _identifiedDate_extraInitializers = [];
    let _identifiedBy_decorators;
    let _identifiedBy_initializers = [];
    let _identifiedBy_extraInitializers = [];
    let _resolution_decorators;
    let _resolution_initializers = [];
    let _resolution_extraInitializers = [];
    let _resolvedDate_decorators;
    let _resolvedDate_initializers = [];
    let _resolvedDate_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _waivers_decorators;
    let _waivers_initializers = [];
    let _waivers_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ConflictDetailModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.conflictCheckId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _conflictCheckId_initializers, void 0));
            this.conflictCheck = (__runInitializers(this, _conflictCheckId_extraInitializers), __runInitializers(this, _conflictCheck_initializers, void 0));
            this.conflictType = (__runInitializers(this, _conflictCheck_extraInitializers), __runInitializers(this, _conflictType_initializers, void 0));
            this.severity = (__runInitializers(this, _conflictType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.description = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.involvedParties = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _involvedParties_initializers, void 0));
            this.affectedAttorneys = (__runInitializers(this, _involvedParties_extraInitializers), __runInitializers(this, _affectedAttorneys_initializers, void 0));
            this.conflictingMatterId = (__runInitializers(this, _affectedAttorneys_extraInitializers), __runInitializers(this, _conflictingMatterId_initializers, void 0));
            this.conflictingClientId = (__runInitializers(this, _conflictingMatterId_extraInitializers), __runInitializers(this, _conflictingClientId_initializers, void 0));
            this.riskAssessment = (__runInitializers(this, _conflictingClientId_extraInitializers), __runInitializers(this, _riskAssessment_initializers, void 0));
            this.recommendation = (__runInitializers(this, _riskAssessment_extraInitializers), __runInitializers(this, _recommendation_initializers, void 0));
            this.waiverPossible = (__runInitializers(this, _recommendation_extraInitializers), __runInitializers(this, _waiverPossible_initializers, void 0));
            this.ethicalRulesViolated = (__runInitializers(this, _waiverPossible_extraInitializers), __runInitializers(this, _ethicalRulesViolated_initializers, void 0));
            this.identifiedDate = (__runInitializers(this, _ethicalRulesViolated_extraInitializers), __runInitializers(this, _identifiedDate_initializers, void 0));
            this.identifiedBy = (__runInitializers(this, _identifiedDate_extraInitializers), __runInitializers(this, _identifiedBy_initializers, void 0));
            this.resolution = (__runInitializers(this, _identifiedBy_extraInitializers), __runInitializers(this, _resolution_initializers, void 0));
            this.resolvedDate = (__runInitializers(this, _resolution_extraInitializers), __runInitializers(this, _resolvedDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _resolvedDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.waivers = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _waivers_initializers, void 0));
            this.createdAt = (__runInitializers(this, _waivers_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConflictDetailModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _conflictCheckId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ConflictCheckRequestModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Conflict check request ID' })];
        _conflictCheck_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConflictCheckRequestModel)];
        _conflictType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictType)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: ConflictType, description: 'Type of conflict' })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictSeverity)),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: ConflictSeverity, description: 'Severity rating' })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Conflict description' })];
        _involvedParties_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Involved parties' })];
        _affectedAttorneys_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Affected attorneys' })];
        _conflictingMatterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Conflicting matter ID' })];
        _conflictingClientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Conflicting client ID' })];
        _riskAssessment_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Risk assessment' })];
        _recommendation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Recommended action' })];
        _waiverPossible_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether waiver is possible' })];
        _ethicalRulesViolated_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Ethical rules potentially violated' })];
        _identifiedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), (0, swagger_1.ApiProperty)({ description: 'Date conflict was identified' })];
        _identifiedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'User who identified the conflict' })];
        _resolution_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConflictResolution)),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ enum: ConflictResolution, description: 'Resolution method' })];
        _resolvedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date conflict was resolved' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _waivers_decorators = [(0, sequelize_typescript_1.HasMany)(() => WaiverDocumentModel)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _conflictCheckId_decorators, { kind: "field", name: "conflictCheckId", static: false, private: false, access: { has: obj => "conflictCheckId" in obj, get: obj => obj.conflictCheckId, set: (obj, value) => { obj.conflictCheckId = value; } }, metadata: _metadata }, _conflictCheckId_initializers, _conflictCheckId_extraInitializers);
        __esDecorate(null, null, _conflictCheck_decorators, { kind: "field", name: "conflictCheck", static: false, private: false, access: { has: obj => "conflictCheck" in obj, get: obj => obj.conflictCheck, set: (obj, value) => { obj.conflictCheck = value; } }, metadata: _metadata }, _conflictCheck_initializers, _conflictCheck_extraInitializers);
        __esDecorate(null, null, _conflictType_decorators, { kind: "field", name: "conflictType", static: false, private: false, access: { has: obj => "conflictType" in obj, get: obj => obj.conflictType, set: (obj, value) => { obj.conflictType = value; } }, metadata: _metadata }, _conflictType_initializers, _conflictType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _involvedParties_decorators, { kind: "field", name: "involvedParties", static: false, private: false, access: { has: obj => "involvedParties" in obj, get: obj => obj.involvedParties, set: (obj, value) => { obj.involvedParties = value; } }, metadata: _metadata }, _involvedParties_initializers, _involvedParties_extraInitializers);
        __esDecorate(null, null, _affectedAttorneys_decorators, { kind: "field", name: "affectedAttorneys", static: false, private: false, access: { has: obj => "affectedAttorneys" in obj, get: obj => obj.affectedAttorneys, set: (obj, value) => { obj.affectedAttorneys = value; } }, metadata: _metadata }, _affectedAttorneys_initializers, _affectedAttorneys_extraInitializers);
        __esDecorate(null, null, _conflictingMatterId_decorators, { kind: "field", name: "conflictingMatterId", static: false, private: false, access: { has: obj => "conflictingMatterId" in obj, get: obj => obj.conflictingMatterId, set: (obj, value) => { obj.conflictingMatterId = value; } }, metadata: _metadata }, _conflictingMatterId_initializers, _conflictingMatterId_extraInitializers);
        __esDecorate(null, null, _conflictingClientId_decorators, { kind: "field", name: "conflictingClientId", static: false, private: false, access: { has: obj => "conflictingClientId" in obj, get: obj => obj.conflictingClientId, set: (obj, value) => { obj.conflictingClientId = value; } }, metadata: _metadata }, _conflictingClientId_initializers, _conflictingClientId_extraInitializers);
        __esDecorate(null, null, _riskAssessment_decorators, { kind: "field", name: "riskAssessment", static: false, private: false, access: { has: obj => "riskAssessment" in obj, get: obj => obj.riskAssessment, set: (obj, value) => { obj.riskAssessment = value; } }, metadata: _metadata }, _riskAssessment_initializers, _riskAssessment_extraInitializers);
        __esDecorate(null, null, _recommendation_decorators, { kind: "field", name: "recommendation", static: false, private: false, access: { has: obj => "recommendation" in obj, get: obj => obj.recommendation, set: (obj, value) => { obj.recommendation = value; } }, metadata: _metadata }, _recommendation_initializers, _recommendation_extraInitializers);
        __esDecorate(null, null, _waiverPossible_decorators, { kind: "field", name: "waiverPossible", static: false, private: false, access: { has: obj => "waiverPossible" in obj, get: obj => obj.waiverPossible, set: (obj, value) => { obj.waiverPossible = value; } }, metadata: _metadata }, _waiverPossible_initializers, _waiverPossible_extraInitializers);
        __esDecorate(null, null, _ethicalRulesViolated_decorators, { kind: "field", name: "ethicalRulesViolated", static: false, private: false, access: { has: obj => "ethicalRulesViolated" in obj, get: obj => obj.ethicalRulesViolated, set: (obj, value) => { obj.ethicalRulesViolated = value; } }, metadata: _metadata }, _ethicalRulesViolated_initializers, _ethicalRulesViolated_extraInitializers);
        __esDecorate(null, null, _identifiedDate_decorators, { kind: "field", name: "identifiedDate", static: false, private: false, access: { has: obj => "identifiedDate" in obj, get: obj => obj.identifiedDate, set: (obj, value) => { obj.identifiedDate = value; } }, metadata: _metadata }, _identifiedDate_initializers, _identifiedDate_extraInitializers);
        __esDecorate(null, null, _identifiedBy_decorators, { kind: "field", name: "identifiedBy", static: false, private: false, access: { has: obj => "identifiedBy" in obj, get: obj => obj.identifiedBy, set: (obj, value) => { obj.identifiedBy = value; } }, metadata: _metadata }, _identifiedBy_initializers, _identifiedBy_extraInitializers);
        __esDecorate(null, null, _resolution_decorators, { kind: "field", name: "resolution", static: false, private: false, access: { has: obj => "resolution" in obj, get: obj => obj.resolution, set: (obj, value) => { obj.resolution = value; } }, metadata: _metadata }, _resolution_initializers, _resolution_extraInitializers);
        __esDecorate(null, null, _resolvedDate_decorators, { kind: "field", name: "resolvedDate", static: false, private: false, access: { has: obj => "resolvedDate" in obj, get: obj => obj.resolvedDate, set: (obj, value) => { obj.resolvedDate = value; } }, metadata: _metadata }, _resolvedDate_initializers, _resolvedDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _waivers_decorators, { kind: "field", name: "waivers", static: false, private: false, access: { has: obj => "waivers" in obj, get: obj => obj.waivers, set: (obj, value) => { obj.waivers = value; } }, metadata: _metadata }, _waivers_initializers, _waivers_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictDetailModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictDetailModel = _classThis;
})();
exports.ConflictDetailModel = ConflictDetailModel;
/**
 * Waiver Document Model
 * Stores conflict waiver documentation and status
 */
let WaiverDocumentModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'waiver_documents',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['conflictCheckId'] },
                { fields: ['conflictId'] },
                { fields: ['clientId'] },
                { fields: ['status'] },
                { fields: ['waiverType'] },
                { fields: ['executedDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _conflictCheckId_decorators;
    let _conflictCheckId_initializers = [];
    let _conflictCheckId_extraInitializers = [];
    let _conflictCheck_decorators;
    let _conflictCheck_initializers = [];
    let _conflictCheck_extraInitializers = [];
    let _conflictId_decorators;
    let _conflictId_initializers = [];
    let _conflictId_extraInitializers = [];
    let _conflict_decorators;
    let _conflict_initializers = [];
    let _conflict_extraInitializers = [];
    let _clientId_decorators;
    let _clientId_initializers = [];
    let _clientId_extraInitializers = [];
    let _waiverType_decorators;
    let _waiverType_initializers = [];
    let _waiverType_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _documentText_decorators;
    let _documentText_initializers = [];
    let _documentText_extraInitializers = [];
    let _disclosureProvided_decorators;
    let _disclosureProvided_initializers = [];
    let _disclosureProvided_extraInitializers = [];
    let _sentDate_decorators;
    let _sentDate_initializers = [];
    let _sentDate_extraInitializers = [];
    let _executedDate_decorators;
    let _executedDate_initializers = [];
    let _executedDate_extraInitializers = [];
    let _signatories_decorators;
    let _signatories_initializers = [];
    let _signatories_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _revokedDate_decorators;
    let _revokedDate_initializers = [];
    let _revokedDate_extraInitializers = [];
    let _revokedReason_decorators;
    let _revokedReason_initializers = [];
    let _revokedReason_extraInitializers = [];
    let _reviewedBy_decorators;
    let _reviewedBy_initializers = [];
    let _reviewedBy_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
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
    var WaiverDocumentModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.conflictCheckId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _conflictCheckId_initializers, void 0));
            this.conflictCheck = (__runInitializers(this, _conflictCheckId_extraInitializers), __runInitializers(this, _conflictCheck_initializers, void 0));
            this.conflictId = (__runInitializers(this, _conflictCheck_extraInitializers), __runInitializers(this, _conflictId_initializers, void 0));
            this.conflict = (__runInitializers(this, _conflictId_extraInitializers), __runInitializers(this, _conflict_initializers, void 0));
            this.clientId = (__runInitializers(this, _conflict_extraInitializers), __runInitializers(this, _clientId_initializers, void 0));
            this.waiverType = (__runInitializers(this, _clientId_extraInitializers), __runInitializers(this, _waiverType_initializers, void 0));
            this.status = (__runInitializers(this, _waiverType_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.documentText = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _documentText_initializers, void 0));
            this.disclosureProvided = (__runInitializers(this, _documentText_extraInitializers), __runInitializers(this, _disclosureProvided_initializers, void 0));
            this.sentDate = (__runInitializers(this, _disclosureProvided_extraInitializers), __runInitializers(this, _sentDate_initializers, void 0));
            this.executedDate = (__runInitializers(this, _sentDate_extraInitializers), __runInitializers(this, _executedDate_initializers, void 0));
            this.signatories = (__runInitializers(this, _executedDate_extraInitializers), __runInitializers(this, _signatories_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _signatories_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.conditions = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.revokedDate = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _revokedDate_initializers, void 0));
            this.revokedReason = (__runInitializers(this, _revokedDate_extraInitializers), __runInitializers(this, _revokedReason_initializers, void 0));
            this.reviewedBy = (__runInitializers(this, _revokedReason_extraInitializers), __runInitializers(this, _reviewedBy_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _reviewedBy_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "WaiverDocumentModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _conflictCheckId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ConflictCheckRequestModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Conflict check request ID' })];
        _conflictCheck_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConflictCheckRequestModel)];
        _conflictId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ConflictDetailModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Conflict detail ID' })];
        _conflict_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConflictDetailModel)];
        _clientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Client ID' })];
        _waiverType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('informed_consent', 'advance_waiver', 'limited_waiver'),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Type of waiver' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(WaiverStatus)),
                allowNull: false,
                defaultValue: WaiverStatus.DRAFT,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: WaiverStatus, description: 'Waiver status' })];
        _documentText_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Waiver document text' })];
        _disclosureProvided_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Disclosure provided to client' })];
        _sentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date sent to client' })];
        _executedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Date executed by client' })];
        _signatories_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Signatories information' })];
        _expirationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Waiver expiration date' })];
        _conditions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Conditions of waiver' })];
        _revokedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date waiver was revoked' })];
        _revokedReason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for revocation' })];
        _reviewedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'User who reviewed the waiver' })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'User who approved the waiver' })];
        _approvalDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Approval date' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _conflictCheckId_decorators, { kind: "field", name: "conflictCheckId", static: false, private: false, access: { has: obj => "conflictCheckId" in obj, get: obj => obj.conflictCheckId, set: (obj, value) => { obj.conflictCheckId = value; } }, metadata: _metadata }, _conflictCheckId_initializers, _conflictCheckId_extraInitializers);
        __esDecorate(null, null, _conflictCheck_decorators, { kind: "field", name: "conflictCheck", static: false, private: false, access: { has: obj => "conflictCheck" in obj, get: obj => obj.conflictCheck, set: (obj, value) => { obj.conflictCheck = value; } }, metadata: _metadata }, _conflictCheck_initializers, _conflictCheck_extraInitializers);
        __esDecorate(null, null, _conflictId_decorators, { kind: "field", name: "conflictId", static: false, private: false, access: { has: obj => "conflictId" in obj, get: obj => obj.conflictId, set: (obj, value) => { obj.conflictId = value; } }, metadata: _metadata }, _conflictId_initializers, _conflictId_extraInitializers);
        __esDecorate(null, null, _conflict_decorators, { kind: "field", name: "conflict", static: false, private: false, access: { has: obj => "conflict" in obj, get: obj => obj.conflict, set: (obj, value) => { obj.conflict = value; } }, metadata: _metadata }, _conflict_initializers, _conflict_extraInitializers);
        __esDecorate(null, null, _clientId_decorators, { kind: "field", name: "clientId", static: false, private: false, access: { has: obj => "clientId" in obj, get: obj => obj.clientId, set: (obj, value) => { obj.clientId = value; } }, metadata: _metadata }, _clientId_initializers, _clientId_extraInitializers);
        __esDecorate(null, null, _waiverType_decorators, { kind: "field", name: "waiverType", static: false, private: false, access: { has: obj => "waiverType" in obj, get: obj => obj.waiverType, set: (obj, value) => { obj.waiverType = value; } }, metadata: _metadata }, _waiverType_initializers, _waiverType_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _documentText_decorators, { kind: "field", name: "documentText", static: false, private: false, access: { has: obj => "documentText" in obj, get: obj => obj.documentText, set: (obj, value) => { obj.documentText = value; } }, metadata: _metadata }, _documentText_initializers, _documentText_extraInitializers);
        __esDecorate(null, null, _disclosureProvided_decorators, { kind: "field", name: "disclosureProvided", static: false, private: false, access: { has: obj => "disclosureProvided" in obj, get: obj => obj.disclosureProvided, set: (obj, value) => { obj.disclosureProvided = value; } }, metadata: _metadata }, _disclosureProvided_initializers, _disclosureProvided_extraInitializers);
        __esDecorate(null, null, _sentDate_decorators, { kind: "field", name: "sentDate", static: false, private: false, access: { has: obj => "sentDate" in obj, get: obj => obj.sentDate, set: (obj, value) => { obj.sentDate = value; } }, metadata: _metadata }, _sentDate_initializers, _sentDate_extraInitializers);
        __esDecorate(null, null, _executedDate_decorators, { kind: "field", name: "executedDate", static: false, private: false, access: { has: obj => "executedDate" in obj, get: obj => obj.executedDate, set: (obj, value) => { obj.executedDate = value; } }, metadata: _metadata }, _executedDate_initializers, _executedDate_extraInitializers);
        __esDecorate(null, null, _signatories_decorators, { kind: "field", name: "signatories", static: false, private: false, access: { has: obj => "signatories" in obj, get: obj => obj.signatories, set: (obj, value) => { obj.signatories = value; } }, metadata: _metadata }, _signatories_initializers, _signatories_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _revokedDate_decorators, { kind: "field", name: "revokedDate", static: false, private: false, access: { has: obj => "revokedDate" in obj, get: obj => obj.revokedDate, set: (obj, value) => { obj.revokedDate = value; } }, metadata: _metadata }, _revokedDate_initializers, _revokedDate_extraInitializers);
        __esDecorate(null, null, _revokedReason_decorators, { kind: "field", name: "revokedReason", static: false, private: false, access: { has: obj => "revokedReason" in obj, get: obj => obj.revokedReason, set: (obj, value) => { obj.revokedReason = value; } }, metadata: _metadata }, _revokedReason_initializers, _revokedReason_extraInitializers);
        __esDecorate(null, null, _reviewedBy_decorators, { kind: "field", name: "reviewedBy", static: false, private: false, access: { has: obj => "reviewedBy" in obj, get: obj => obj.reviewedBy, set: (obj, value) => { obj.reviewedBy = value; } }, metadata: _metadata }, _reviewedBy_initializers, _reviewedBy_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WaiverDocumentModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WaiverDocumentModel = _classThis;
})();
exports.WaiverDocumentModel = WaiverDocumentModel;
/**
 * Ethical Wall Model
 * Stores ethical wall (Chinese Wall) implementations and monitoring
 */
let EthicalWallModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'ethical_walls',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['conflictCheckId'] },
                { fields: ['matterId'] },
                { fields: ['status'] },
                { fields: ['implementationDate'] },
                { fields: ['lastReviewDate'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _conflictCheckId_decorators;
    let _conflictCheckId_initializers = [];
    let _conflictCheckId_extraInitializers = [];
    let _conflictCheck_decorators;
    let _conflictCheck_initializers = [];
    let _conflictCheck_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _screenedAttorneys_decorators;
    let _screenedAttorneys_initializers = [];
    let _screenedAttorneys_extraInitializers = [];
    let _restrictedInformation_decorators;
    let _restrictedInformation_initializers = [];
    let _restrictedInformation_extraInitializers = [];
    let _implementationDate_decorators;
    let _implementationDate_initializers = [];
    let _implementationDate_extraInitializers = [];
    let _implementedBy_decorators;
    let _implementedBy_initializers = [];
    let _implementedBy_extraInitializers = [];
    let _protocols_decorators;
    let _protocols_initializers = [];
    let _protocols_extraInitializers = [];
    let _physicalMeasures_decorators;
    let _physicalMeasures_initializers = [];
    let _physicalMeasures_extraInitializers = [];
    let _technicalMeasures_decorators;
    let _technicalMeasures_initializers = [];
    let _technicalMeasures_extraInitializers = [];
    let _trainingCompleted_decorators;
    let _trainingCompleted_initializers = [];
    let _trainingCompleted_extraInitializers = [];
    let _monitoringFrequency_decorators;
    let _monitoringFrequency_initializers = [];
    let _monitoringFrequency_extraInitializers = [];
    let _lastReviewDate_decorators;
    let _lastReviewDate_initializers = [];
    let _lastReviewDate_extraInitializers = [];
    let _breaches_decorators;
    let _breaches_initializers = [];
    let _breaches_extraInitializers = [];
    let _liftedDate_decorators;
    let _liftedDate_initializers = [];
    let _liftedDate_extraInitializers = [];
    let _liftedReason_decorators;
    let _liftedReason_initializers = [];
    let _liftedReason_extraInitializers = [];
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
    var EthicalWallModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.conflictCheckId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _conflictCheckId_initializers, void 0));
            this.conflictCheck = (__runInitializers(this, _conflictCheckId_extraInitializers), __runInitializers(this, _conflictCheck_initializers, void 0));
            this.matterId = (__runInitializers(this, _conflictCheck_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.status = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.screenedAttorneys = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _screenedAttorneys_initializers, void 0));
            this.restrictedInformation = (__runInitializers(this, _screenedAttorneys_extraInitializers), __runInitializers(this, _restrictedInformation_initializers, void 0));
            this.implementationDate = (__runInitializers(this, _restrictedInformation_extraInitializers), __runInitializers(this, _implementationDate_initializers, void 0));
            this.implementedBy = (__runInitializers(this, _implementationDate_extraInitializers), __runInitializers(this, _implementedBy_initializers, void 0));
            this.protocols = (__runInitializers(this, _implementedBy_extraInitializers), __runInitializers(this, _protocols_initializers, void 0));
            this.physicalMeasures = (__runInitializers(this, _protocols_extraInitializers), __runInitializers(this, _physicalMeasures_initializers, void 0));
            this.technicalMeasures = (__runInitializers(this, _physicalMeasures_extraInitializers), __runInitializers(this, _technicalMeasures_initializers, void 0));
            this.trainingCompleted = (__runInitializers(this, _technicalMeasures_extraInitializers), __runInitializers(this, _trainingCompleted_initializers, void 0));
            this.monitoringFrequency = (__runInitializers(this, _trainingCompleted_extraInitializers), __runInitializers(this, _monitoringFrequency_initializers, void 0));
            this.lastReviewDate = (__runInitializers(this, _monitoringFrequency_extraInitializers), __runInitializers(this, _lastReviewDate_initializers, void 0));
            this.breaches = (__runInitializers(this, _lastReviewDate_extraInitializers), __runInitializers(this, _breaches_initializers, void 0));
            this.liftedDate = (__runInitializers(this, _breaches_extraInitializers), __runInitializers(this, _liftedDate_initializers, void 0));
            this.liftedReason = (__runInitializers(this, _liftedDate_extraInitializers), __runInitializers(this, _liftedReason_initializers, void 0));
            this.metadata = (__runInitializers(this, _liftedReason_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "EthicalWallModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _conflictCheckId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => ConflictCheckRequestModel), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Conflict check request ID' })];
        _conflictCheck_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ConflictCheckRequestModel)];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Matter ID' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(EthicalWallStatus)),
                allowNull: false,
                defaultValue: EthicalWallStatus.PROPOSED,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: EthicalWallStatus, description: 'Wall status' })];
        _screenedAttorneys_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.UUID),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Attorneys screened from matter' })];
        _restrictedInformation_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Categories of restricted information' })];
        _implementationDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Wall implementation date' })];
        _implementedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'User who implemented the wall' })];
        _protocols_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Wall protocols' })];
        _physicalMeasures_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Physical measures implemented' })];
        _technicalMeasures_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Technical measures implemented' })];
        _trainingCompleted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether training was completed' })];
        _monitoringFrequency_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(100),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Monitoring frequency', example: 'weekly' })];
        _lastReviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiPropertyOptional)({ description: 'Last review date' })];
        _breaches_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Breach incidents' })];
        _liftedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date wall was lifted' })];
        _liftedReason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for lifting wall' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _conflictCheckId_decorators, { kind: "field", name: "conflictCheckId", static: false, private: false, access: { has: obj => "conflictCheckId" in obj, get: obj => obj.conflictCheckId, set: (obj, value) => { obj.conflictCheckId = value; } }, metadata: _metadata }, _conflictCheckId_initializers, _conflictCheckId_extraInitializers);
        __esDecorate(null, null, _conflictCheck_decorators, { kind: "field", name: "conflictCheck", static: false, private: false, access: { has: obj => "conflictCheck" in obj, get: obj => obj.conflictCheck, set: (obj, value) => { obj.conflictCheck = value; } }, metadata: _metadata }, _conflictCheck_initializers, _conflictCheck_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _screenedAttorneys_decorators, { kind: "field", name: "screenedAttorneys", static: false, private: false, access: { has: obj => "screenedAttorneys" in obj, get: obj => obj.screenedAttorneys, set: (obj, value) => { obj.screenedAttorneys = value; } }, metadata: _metadata }, _screenedAttorneys_initializers, _screenedAttorneys_extraInitializers);
        __esDecorate(null, null, _restrictedInformation_decorators, { kind: "field", name: "restrictedInformation", static: false, private: false, access: { has: obj => "restrictedInformation" in obj, get: obj => obj.restrictedInformation, set: (obj, value) => { obj.restrictedInformation = value; } }, metadata: _metadata }, _restrictedInformation_initializers, _restrictedInformation_extraInitializers);
        __esDecorate(null, null, _implementationDate_decorators, { kind: "field", name: "implementationDate", static: false, private: false, access: { has: obj => "implementationDate" in obj, get: obj => obj.implementationDate, set: (obj, value) => { obj.implementationDate = value; } }, metadata: _metadata }, _implementationDate_initializers, _implementationDate_extraInitializers);
        __esDecorate(null, null, _implementedBy_decorators, { kind: "field", name: "implementedBy", static: false, private: false, access: { has: obj => "implementedBy" in obj, get: obj => obj.implementedBy, set: (obj, value) => { obj.implementedBy = value; } }, metadata: _metadata }, _implementedBy_initializers, _implementedBy_extraInitializers);
        __esDecorate(null, null, _protocols_decorators, { kind: "field", name: "protocols", static: false, private: false, access: { has: obj => "protocols" in obj, get: obj => obj.protocols, set: (obj, value) => { obj.protocols = value; } }, metadata: _metadata }, _protocols_initializers, _protocols_extraInitializers);
        __esDecorate(null, null, _physicalMeasures_decorators, { kind: "field", name: "physicalMeasures", static: false, private: false, access: { has: obj => "physicalMeasures" in obj, get: obj => obj.physicalMeasures, set: (obj, value) => { obj.physicalMeasures = value; } }, metadata: _metadata }, _physicalMeasures_initializers, _physicalMeasures_extraInitializers);
        __esDecorate(null, null, _technicalMeasures_decorators, { kind: "field", name: "technicalMeasures", static: false, private: false, access: { has: obj => "technicalMeasures" in obj, get: obj => obj.technicalMeasures, set: (obj, value) => { obj.technicalMeasures = value; } }, metadata: _metadata }, _technicalMeasures_initializers, _technicalMeasures_extraInitializers);
        __esDecorate(null, null, _trainingCompleted_decorators, { kind: "field", name: "trainingCompleted", static: false, private: false, access: { has: obj => "trainingCompleted" in obj, get: obj => obj.trainingCompleted, set: (obj, value) => { obj.trainingCompleted = value; } }, metadata: _metadata }, _trainingCompleted_initializers, _trainingCompleted_extraInitializers);
        __esDecorate(null, null, _monitoringFrequency_decorators, { kind: "field", name: "monitoringFrequency", static: false, private: false, access: { has: obj => "monitoringFrequency" in obj, get: obj => obj.monitoringFrequency, set: (obj, value) => { obj.monitoringFrequency = value; } }, metadata: _metadata }, _monitoringFrequency_initializers, _monitoringFrequency_extraInitializers);
        __esDecorate(null, null, _lastReviewDate_decorators, { kind: "field", name: "lastReviewDate", static: false, private: false, access: { has: obj => "lastReviewDate" in obj, get: obj => obj.lastReviewDate, set: (obj, value) => { obj.lastReviewDate = value; } }, metadata: _metadata }, _lastReviewDate_initializers, _lastReviewDate_extraInitializers);
        __esDecorate(null, null, _breaches_decorators, { kind: "field", name: "breaches", static: false, private: false, access: { has: obj => "breaches" in obj, get: obj => obj.breaches, set: (obj, value) => { obj.breaches = value; } }, metadata: _metadata }, _breaches_initializers, _breaches_extraInitializers);
        __esDecorate(null, null, _liftedDate_decorators, { kind: "field", name: "liftedDate", static: false, private: false, access: { has: obj => "liftedDate" in obj, get: obj => obj.liftedDate, set: (obj, value) => { obj.liftedDate = value; } }, metadata: _metadata }, _liftedDate_initializers, _liftedDate_extraInitializers);
        __esDecorate(null, null, _liftedReason_decorators, { kind: "field", name: "liftedReason", static: false, private: false, access: { has: obj => "liftedReason" in obj, get: obj => obj.liftedReason, set: (obj, value) => { obj.liftedReason = value; } }, metadata: _metadata }, _liftedReason_initializers, _liftedReason_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EthicalWallModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EthicalWallModel = _classThis;
})();
exports.EthicalWallModel = EthicalWallModel;
/**
 * Lateral Hire Check Model
 * Stores lateral hire conflict screening data
 */
let LateralHireCheckModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'lateral_hire_checks',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['candidateId'] },
                { fields: ['status'] },
                { fields: ['proposedStartDate'] },
                { fields: ['reviewDate'] },
                { fields: ['performedBy'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _candidateId_decorators;
    let _candidateId_initializers = [];
    let _candidateId_extraInitializers = [];
    let _candidateName_decorators;
    let _candidateName_initializers = [];
    let _candidateName_extraInitializers = [];
    let _currentFirm_decorators;
    let _currentFirm_initializers = [];
    let _currentFirm_extraInitializers = [];
    let _proposedStartDate_decorators;
    let _proposedStartDate_initializers = [];
    let _proposedStartDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _priorMatters_decorators;
    let _priorMatters_initializers = [];
    let _priorMatters_extraInitializers = [];
    let _currentMatters_decorators;
    let _currentMatters_initializers = [];
    let _currentMatters_extraInitializers = [];
    let _conflictsIdentified_decorators;
    let _conflictsIdentified_initializers = [];
    let _conflictsIdentified_extraInitializers = [];
    let _screeningNotes_decorators;
    let _screeningNotes_initializers = [];
    let _screeningNotes_extraInitializers = [];
    let _performedBy_decorators;
    let _performedBy_initializers = [];
    let _performedBy_extraInitializers = [];
    let _reviewDate_decorators;
    let _reviewDate_initializers = [];
    let _reviewDate_extraInitializers = [];
    let _approvalRequired_decorators;
    let _approvalRequired_initializers = [];
    let _approvalRequired_extraInitializers = [];
    let _approvedBy_decorators;
    let _approvedBy_initializers = [];
    let _approvedBy_extraInitializers = [];
    let _approvalDate_decorators;
    let _approvalDate_initializers = [];
    let _approvalDate_extraInitializers = [];
    let _conditions_decorators;
    let _conditions_initializers = [];
    let _conditions_extraInitializers = [];
    let _ethicalWallsRequired_decorators;
    let _ethicalWallsRequired_initializers = [];
    let _ethicalWallsRequired_extraInitializers = [];
    let _clientNotificationsRequired_decorators;
    let _clientNotificationsRequired_initializers = [];
    let _clientNotificationsRequired_extraInitializers = [];
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
    var LateralHireCheckModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.candidateId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _candidateId_initializers, void 0));
            this.candidateName = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _candidateName_initializers, void 0));
            this.currentFirm = (__runInitializers(this, _candidateName_extraInitializers), __runInitializers(this, _currentFirm_initializers, void 0));
            this.proposedStartDate = (__runInitializers(this, _currentFirm_extraInitializers), __runInitializers(this, _proposedStartDate_initializers, void 0));
            this.status = (__runInitializers(this, _proposedStartDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.priorMatters = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priorMatters_initializers, void 0));
            this.currentMatters = (__runInitializers(this, _priorMatters_extraInitializers), __runInitializers(this, _currentMatters_initializers, void 0));
            this.conflictsIdentified = (__runInitializers(this, _currentMatters_extraInitializers), __runInitializers(this, _conflictsIdentified_initializers, void 0));
            this.screeningNotes = (__runInitializers(this, _conflictsIdentified_extraInitializers), __runInitializers(this, _screeningNotes_initializers, void 0));
            this.performedBy = (__runInitializers(this, _screeningNotes_extraInitializers), __runInitializers(this, _performedBy_initializers, void 0));
            this.reviewDate = (__runInitializers(this, _performedBy_extraInitializers), __runInitializers(this, _reviewDate_initializers, void 0));
            this.approvalRequired = (__runInitializers(this, _reviewDate_extraInitializers), __runInitializers(this, _approvalRequired_initializers, void 0));
            this.approvedBy = (__runInitializers(this, _approvalRequired_extraInitializers), __runInitializers(this, _approvedBy_initializers, void 0));
            this.approvalDate = (__runInitializers(this, _approvedBy_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
            this.conditions = (__runInitializers(this, _approvalDate_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
            this.ethicalWallsRequired = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _ethicalWallsRequired_initializers, void 0));
            this.clientNotificationsRequired = (__runInitializers(this, _ethicalWallsRequired_extraInitializers), __runInitializers(this, _clientNotificationsRequired_initializers, void 0));
            this.metadata = (__runInitializers(this, _clientNotificationsRequired_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "LateralHireCheckModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _candidateId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Candidate ID' })];
        _candidateName_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Candidate name' })];
        _currentFirm_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Current firm' })];
        _proposedStartDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Proposed start date' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(LateralHireStatus)),
                allowNull: false,
                defaultValue: LateralHireStatus.INITIATED,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ enum: LateralHireStatus, description: 'Check status' })];
        _priorMatters_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Prior matters at previous firms' })];
        _currentMatters_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Current matters' })];
        _conflictsIdentified_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Conflicts identified' })];
        _screeningNotes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Screening notes and analysis' })];
        _performedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'User who performed the check' })];
        _reviewDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Review date' })];
        _approvalRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether approval is required' })];
        _approvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'User who approved the hire' })];
        _approvalDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Approval date' })];
        _conditions_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Conditions for hiring' })];
        _ethicalWallsRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Ethical walls required' })];
        _clientNotificationsRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Client notifications required' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: obj => "candidateId" in obj, get: obj => obj.candidateId, set: (obj, value) => { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
        __esDecorate(null, null, _candidateName_decorators, { kind: "field", name: "candidateName", static: false, private: false, access: { has: obj => "candidateName" in obj, get: obj => obj.candidateName, set: (obj, value) => { obj.candidateName = value; } }, metadata: _metadata }, _candidateName_initializers, _candidateName_extraInitializers);
        __esDecorate(null, null, _currentFirm_decorators, { kind: "field", name: "currentFirm", static: false, private: false, access: { has: obj => "currentFirm" in obj, get: obj => obj.currentFirm, set: (obj, value) => { obj.currentFirm = value; } }, metadata: _metadata }, _currentFirm_initializers, _currentFirm_extraInitializers);
        __esDecorate(null, null, _proposedStartDate_decorators, { kind: "field", name: "proposedStartDate", static: false, private: false, access: { has: obj => "proposedStartDate" in obj, get: obj => obj.proposedStartDate, set: (obj, value) => { obj.proposedStartDate = value; } }, metadata: _metadata }, _proposedStartDate_initializers, _proposedStartDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _priorMatters_decorators, { kind: "field", name: "priorMatters", static: false, private: false, access: { has: obj => "priorMatters" in obj, get: obj => obj.priorMatters, set: (obj, value) => { obj.priorMatters = value; } }, metadata: _metadata }, _priorMatters_initializers, _priorMatters_extraInitializers);
        __esDecorate(null, null, _currentMatters_decorators, { kind: "field", name: "currentMatters", static: false, private: false, access: { has: obj => "currentMatters" in obj, get: obj => obj.currentMatters, set: (obj, value) => { obj.currentMatters = value; } }, metadata: _metadata }, _currentMatters_initializers, _currentMatters_extraInitializers);
        __esDecorate(null, null, _conflictsIdentified_decorators, { kind: "field", name: "conflictsIdentified", static: false, private: false, access: { has: obj => "conflictsIdentified" in obj, get: obj => obj.conflictsIdentified, set: (obj, value) => { obj.conflictsIdentified = value; } }, metadata: _metadata }, _conflictsIdentified_initializers, _conflictsIdentified_extraInitializers);
        __esDecorate(null, null, _screeningNotes_decorators, { kind: "field", name: "screeningNotes", static: false, private: false, access: { has: obj => "screeningNotes" in obj, get: obj => obj.screeningNotes, set: (obj, value) => { obj.screeningNotes = value; } }, metadata: _metadata }, _screeningNotes_initializers, _screeningNotes_extraInitializers);
        __esDecorate(null, null, _performedBy_decorators, { kind: "field", name: "performedBy", static: false, private: false, access: { has: obj => "performedBy" in obj, get: obj => obj.performedBy, set: (obj, value) => { obj.performedBy = value; } }, metadata: _metadata }, _performedBy_initializers, _performedBy_extraInitializers);
        __esDecorate(null, null, _reviewDate_decorators, { kind: "field", name: "reviewDate", static: false, private: false, access: { has: obj => "reviewDate" in obj, get: obj => obj.reviewDate, set: (obj, value) => { obj.reviewDate = value; } }, metadata: _metadata }, _reviewDate_initializers, _reviewDate_extraInitializers);
        __esDecorate(null, null, _approvalRequired_decorators, { kind: "field", name: "approvalRequired", static: false, private: false, access: { has: obj => "approvalRequired" in obj, get: obj => obj.approvalRequired, set: (obj, value) => { obj.approvalRequired = value; } }, metadata: _metadata }, _approvalRequired_initializers, _approvalRequired_extraInitializers);
        __esDecorate(null, null, _approvedBy_decorators, { kind: "field", name: "approvedBy", static: false, private: false, access: { has: obj => "approvedBy" in obj, get: obj => obj.approvedBy, set: (obj, value) => { obj.approvedBy = value; } }, metadata: _metadata }, _approvedBy_initializers, _approvedBy_extraInitializers);
        __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: obj => "approvalDate" in obj, get: obj => obj.approvalDate, set: (obj, value) => { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
        __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: obj => "conditions" in obj, get: obj => obj.conditions, set: (obj, value) => { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
        __esDecorate(null, null, _ethicalWallsRequired_decorators, { kind: "field", name: "ethicalWallsRequired", static: false, private: false, access: { has: obj => "ethicalWallsRequired" in obj, get: obj => obj.ethicalWallsRequired, set: (obj, value) => { obj.ethicalWallsRequired = value; } }, metadata: _metadata }, _ethicalWallsRequired_initializers, _ethicalWallsRequired_extraInitializers);
        __esDecorate(null, null, _clientNotificationsRequired_decorators, { kind: "field", name: "clientNotificationsRequired", static: false, private: false, access: { has: obj => "clientNotificationsRequired" in obj, get: obj => obj.clientNotificationsRequired, set: (obj, value) => { obj.clientNotificationsRequired = value; } }, metadata: _metadata }, _clientNotificationsRequired_initializers, _clientNotificationsRequired_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LateralHireCheckModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LateralHireCheckModel = _classThis;
})();
exports.LateralHireCheckModel = LateralHireCheckModel;
/**
 * Conflict Notification Model
 * Stores notification records for conflict-related communications
 */
let ConflictNotificationModel = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'conflict_notifications',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['conflictCheckId'] },
                { fields: ['recipientId'] },
                { fields: ['notificationType'] },
                { fields: ['sentDate'] },
                { fields: ['acknowledged'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _conflictCheckId_decorators;
    let _conflictCheckId_initializers = [];
    let _conflictCheckId_extraInitializers = [];
    let _recipientId_decorators;
    let _recipientId_initializers = [];
    let _recipientId_extraInitializers = [];
    let _recipientType_decorators;
    let _recipientType_initializers = [];
    let _recipientType_extraInitializers = [];
    let _notificationType_decorators;
    let _notificationType_initializers = [];
    let _notificationType_extraInitializers = [];
    let _subject_decorators;
    let _subject_initializers = [];
    let _subject_extraInitializers = [];
    let _message_decorators;
    let _message_initializers = [];
    let _message_extraInitializers = [];
    let _sentDate_decorators;
    let _sentDate_initializers = [];
    let _sentDate_extraInitializers = [];
    let _readDate_decorators;
    let _readDate_initializers = [];
    let _readDate_extraInitializers = [];
    let _acknowledged_decorators;
    let _acknowledged_initializers = [];
    let _acknowledged_extraInitializers = [];
    let _acknowledgedDate_decorators;
    let _acknowledgedDate_initializers = [];
    let _acknowledgedDate_extraInitializers = [];
    let _responseRequired_decorators;
    let _responseRequired_initializers = [];
    let _responseRequired_extraInitializers = [];
    let _responseReceived_decorators;
    let _responseReceived_initializers = [];
    let _responseReceived_extraInitializers = [];
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
    var ConflictNotificationModel = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.conflictCheckId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _conflictCheckId_initializers, void 0));
            this.recipientId = (__runInitializers(this, _conflictCheckId_extraInitializers), __runInitializers(this, _recipientId_initializers, void 0));
            this.recipientType = (__runInitializers(this, _recipientId_extraInitializers), __runInitializers(this, _recipientType_initializers, void 0));
            this.notificationType = (__runInitializers(this, _recipientType_extraInitializers), __runInitializers(this, _notificationType_initializers, void 0));
            this.subject = (__runInitializers(this, _notificationType_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
            this.message = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.sentDate = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _sentDate_initializers, void 0));
            this.readDate = (__runInitializers(this, _sentDate_extraInitializers), __runInitializers(this, _readDate_initializers, void 0));
            this.acknowledged = (__runInitializers(this, _readDate_extraInitializers), __runInitializers(this, _acknowledged_initializers, void 0));
            this.acknowledgedDate = (__runInitializers(this, _acknowledged_extraInitializers), __runInitializers(this, _acknowledgedDate_initializers, void 0));
            this.responseRequired = (__runInitializers(this, _acknowledgedDate_extraInitializers), __runInitializers(this, _responseRequired_initializers, void 0));
            this.responseReceived = (__runInitializers(this, _responseRequired_extraInitializers), __runInitializers(this, _responseReceived_initializers, void 0));
            this.metadata = (__runInitializers(this, _responseReceived_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ConflictNotificationModel");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier' })];
        _conflictCheckId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Conflict check request ID' })];
        _recipientId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Recipient user ID' })];
        _recipientType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('attorney', 'client', 'admin', 'ethics_partner'),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Recipient type' })];
        _notificationType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('new_conflict', 'waiver_request', 'ethical_wall', 'periodic_review'),
                allowNull: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Notification type' })];
        _subject_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Notification subject' })];
        _message_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Notification message' })];
        _sentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                defaultValue: sequelize_typescript_1.DataType.NOW,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Date sent' })];
        _readDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date read' })];
        _acknowledged_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), sequelize_typescript_1.Index, (0, swagger_1.ApiProperty)({ description: 'Whether acknowledged' })];
        _acknowledgedDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Date acknowledged' })];
        _responseRequired_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Whether response is required' })];
        _responseReceived_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Response received' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiPropertyOptional)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, sequelize_typescript_1.Column, (0, swagger_1.ApiPropertyOptional)({ description: 'Soft delete timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _conflictCheckId_decorators, { kind: "field", name: "conflictCheckId", static: false, private: false, access: { has: obj => "conflictCheckId" in obj, get: obj => obj.conflictCheckId, set: (obj, value) => { obj.conflictCheckId = value; } }, metadata: _metadata }, _conflictCheckId_initializers, _conflictCheckId_extraInitializers);
        __esDecorate(null, null, _recipientId_decorators, { kind: "field", name: "recipientId", static: false, private: false, access: { has: obj => "recipientId" in obj, get: obj => obj.recipientId, set: (obj, value) => { obj.recipientId = value; } }, metadata: _metadata }, _recipientId_initializers, _recipientId_extraInitializers);
        __esDecorate(null, null, _recipientType_decorators, { kind: "field", name: "recipientType", static: false, private: false, access: { has: obj => "recipientType" in obj, get: obj => obj.recipientType, set: (obj, value) => { obj.recipientType = value; } }, metadata: _metadata }, _recipientType_initializers, _recipientType_extraInitializers);
        __esDecorate(null, null, _notificationType_decorators, { kind: "field", name: "notificationType", static: false, private: false, access: { has: obj => "notificationType" in obj, get: obj => obj.notificationType, set: (obj, value) => { obj.notificationType = value; } }, metadata: _metadata }, _notificationType_initializers, _notificationType_extraInitializers);
        __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: obj => "subject" in obj, get: obj => obj.subject, set: (obj, value) => { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: obj => "message" in obj, get: obj => obj.message, set: (obj, value) => { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _sentDate_decorators, { kind: "field", name: "sentDate", static: false, private: false, access: { has: obj => "sentDate" in obj, get: obj => obj.sentDate, set: (obj, value) => { obj.sentDate = value; } }, metadata: _metadata }, _sentDate_initializers, _sentDate_extraInitializers);
        __esDecorate(null, null, _readDate_decorators, { kind: "field", name: "readDate", static: false, private: false, access: { has: obj => "readDate" in obj, get: obj => obj.readDate, set: (obj, value) => { obj.readDate = value; } }, metadata: _metadata }, _readDate_initializers, _readDate_extraInitializers);
        __esDecorate(null, null, _acknowledged_decorators, { kind: "field", name: "acknowledged", static: false, private: false, access: { has: obj => "acknowledged" in obj, get: obj => obj.acknowledged, set: (obj, value) => { obj.acknowledged = value; } }, metadata: _metadata }, _acknowledged_initializers, _acknowledged_extraInitializers);
        __esDecorate(null, null, _acknowledgedDate_decorators, { kind: "field", name: "acknowledgedDate", static: false, private: false, access: { has: obj => "acknowledgedDate" in obj, get: obj => obj.acknowledgedDate, set: (obj, value) => { obj.acknowledgedDate = value; } }, metadata: _metadata }, _acknowledgedDate_initializers, _acknowledgedDate_extraInitializers);
        __esDecorate(null, null, _responseRequired_decorators, { kind: "field", name: "responseRequired", static: false, private: false, access: { has: obj => "responseRequired" in obj, get: obj => obj.responseRequired, set: (obj, value) => { obj.responseRequired = value; } }, metadata: _metadata }, _responseRequired_initializers, _responseRequired_extraInitializers);
        __esDecorate(null, null, _responseReceived_decorators, { kind: "field", name: "responseReceived", static: false, private: false, access: { has: obj => "responseReceived" in obj, get: obj => obj.responseReceived, set: (obj, value) => { obj.responseReceived = value; } }, metadata: _metadata }, _responseReceived_initializers, _responseReceived_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictNotificationModel = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictNotificationModel = _classThis;
})();
exports.ConflictNotificationModel = ConflictNotificationModel;
// ============================================================================
// SERVICES
// ============================================================================
/**
 * Conflict Screening Service
 * Manages comprehensive conflict of interest screening
 */
let ConflictScreeningService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConflictScreeningService = _classThis = class {
        constructor(requestRepository, conflictRepository) {
            this.requestRepository = requestRepository;
            this.conflictRepository = conflictRepository;
            this.logger = new common_1.Logger(ConflictScreeningService.name);
        }
        /**
         * 1. Initiate conflict check
         */
        async initiateConflictCheck(requestData) {
            try {
                const validated = exports.ConflictCheckRequestSchema.parse(requestData);
                const request = await this.requestRepository.create({
                    ...validated,
                    status: ConflictCheckStatus.PENDING,
                });
                this.logger.log(`Initiated conflict check ${request.id} for client: ${validated.clientName}`);
                return request;
            }
            catch (error) {
                this.logger.error(`Failed to initiate conflict check: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to initiate conflict check: ${error.message}`);
            }
        }
        /**
         * 2. Perform comprehensive conflict screening
         */
        async performConflictScreening(checkId, performedBy) {
            const request = await this.requestRepository.findByPk(checkId);
            if (!request) {
                throw new common_1.NotFoundException(`Conflict check request not found: ${checkId}`);
            }
            await request.update({
                status: ConflictCheckStatus.IN_PROGRESS,
                performedBy,
            });
            const conflicts = [];
            // Screen for direct adversity
            const directConflicts = await this.screenDirectAdversity(request);
            conflicts.push(...directConflicts);
            // Screen for former client conflicts
            const formerClientConflicts = await this.screenFormerClients(request);
            conflicts.push(...formerClientConflicts);
            // Screen for imputed conflicts
            const imputedConflicts = await this.screenImputedConflicts(request);
            conflicts.push(...imputedConflicts);
            // Screen for personal interest conflicts
            const personalConflicts = await this.screenPersonalInterests(request);
            conflicts.push(...personalConflicts);
            // Create conflict detail records
            const conflictModels = await Promise.all(conflicts.map((conflict) => this.conflictRepository.create({
                ...conflict,
                conflictCheckId: checkId,
            })));
            // Update request status
            const finalStatus = conflictModels.length > 0
                ? ConflictCheckStatus.CONFLICT_FOUND
                : ConflictCheckStatus.CLEARED;
            await request.update({
                status: finalStatus,
                completedDate: new Date(),
            });
            this.logger.log(`Completed conflict screening ${checkId}: Found ${conflictModels.length} conflicts`);
            return { request, conflicts: conflictModels };
        }
        /**
         * 3. Screen for direct adversity conflicts
         */
        async screenDirectAdversity(request) {
            const conflicts = [];
            const opposingNames = request.opposingParties.map((p) => p.name.toLowerCase());
            // Query existing matters where opposing parties are current clients
            const existingChecks = await this.requestRepository.findAll({
                where: {
                    status: {
                        [sequelize_1.Op.in]: [
                            ConflictCheckStatus.CLEARED,
                            ConflictCheckStatus.WAIVED,
                        ],
                    },
                },
            });
            for (const check of existingChecks) {
                const clientNameLower = check.clientName.toLowerCase();
                if (opposingNames.includes(clientNameLower)) {
                    conflicts.push({
                        conflictType: ConflictType.DIRECT_ADVERSITY,
                        severity: ConflictSeverity.CRITICAL,
                        description: `Client ${request.clientName} is directly adverse to existing client ${check.clientName} in matter ${check.matterId}`,
                        involvedParties: [request.clientName, check.clientName],
                        affectedAttorneys: [],
                        conflictingMatterId: check.matterId,
                        conflictingClientId: check.clientId,
                        riskAssessment: 'Critical conflict - representation of directly adverse parties',
                        recommendation: 'Decline representation unless both clients provide informed consent waiver',
                        waiverPossible: true,
                        ethicalRulesViolated: ['Rule 1.7(a)(1)'],
                        identifiedDate: new Date(),
                        identifiedBy: request.performedBy || request.requestedBy,
                    });
                }
            }
            return conflicts;
        }
        /**
         * 4. Screen for former client conflicts
         */
        async screenFormerClients(request) {
            const conflicts = [];
            const relatedEntityNames = request.relatedEntities.map((e) => e.name.toLowerCase());
            // Query matters with former clients
            const formerMatters = await this.requestRepository.findAll({
                where: {
                    status: ConflictCheckStatus.CLEARED,
                    deletedAt: { [sequelize_1.Op.not]: null },
                },
                paranoid: false,
            });
            for (const matter of formerMatters) {
                const formerClientName = matter.clientName.toLowerCase();
                if (relatedEntityNames.includes(formerClientName)) {
                    conflicts.push({
                        conflictType: ConflictType.FORMER_CLIENT,
                        severity: ConflictSeverity.HIGH,
                        description: `Representation may be adverse to former client ${matter.clientName}`,
                        involvedParties: [request.clientName, matter.clientName],
                        affectedAttorneys: [],
                        conflictingMatterId: matter.matterId,
                        conflictingClientId: matter.clientId,
                        riskAssessment: 'Potential conflict with former client - assess substantial relationship',
                        recommendation: 'Review for substantial relationship between matters; obtain consent if substantially related',
                        waiverPossible: true,
                        ethicalRulesViolated: ['Rule 1.9(a)'],
                        identifiedDate: new Date(),
                        identifiedBy: request.performedBy || request.requestedBy,
                    });
                }
            }
            return conflicts;
        }
        /**
         * 5. Screen for imputed conflicts
         */
        async screenImputedConflicts(request) {
            const conflicts = [];
            // Query conflicts found in other firm matters
            const firmConflicts = await this.conflictRepository.findAll({
                where: {
                    resolution: { [sequelize_1.Op.is]: null },
                },
                include: [ConflictCheckRequestModel],
            });
            for (const conflict of firmConflicts) {
                const opposingNames = request.opposingParties.map((p) => p.name.toLowerCase());
                const involvedLower = conflict.involvedParties.map((p) => p.toLowerCase());
                if (opposingNames.some((name) => involvedLower.includes(name))) {
                    conflicts.push({
                        conflictType: ConflictType.IMPUTED_CONFLICT,
                        severity: ConflictSeverity.HIGH,
                        description: `Imputed conflict from firm matter involving ${conflict.involvedParties.join(', ')}`,
                        involvedParties: [...conflict.involvedParties, request.clientName],
                        affectedAttorneys: conflict.affectedAttorneys,
                        conflictingMatterId: conflict.conflictingMatterId,
                        riskAssessment: 'Imputed conflict from firm matter requires screening or waiver',
                        recommendation: 'Implement ethical wall or obtain informed consent from all affected clients',
                        waiverPossible: true,
                        ethicalRulesViolated: ['Rule 1.10'],
                        identifiedDate: new Date(),
                        identifiedBy: request.performedBy || request.requestedBy,
                    });
                }
            }
            return conflicts;
        }
        /**
         * 6. Screen for personal interest conflicts
         */
        async screenPersonalInterests(request) {
            // This would integrate with attorney financial disclosure data
            // For now, returning empty array as placeholder
            return [];
        }
        /**
         * 7. Search for adverse parties
         */
        async searchAdverseParties(searchTerm, options) {
            const searchLower = searchTerm.toLowerCase();
            const results = [];
            const checks = await this.requestRepository.findAll();
            for (const check of checks) {
                for (const party of check.opposingParties) {
                    let isMatch = party.name.toLowerCase().includes(searchLower);
                    if (options?.includeAliases && party.aliases) {
                        isMatch =
                            isMatch ||
                                party.aliases.some((alias) => alias.toLowerCase().includes(searchLower));
                    }
                    if (isMatch) {
                        results.push({
                            party,
                            checkId: check.id,
                            matterId: check.matterId,
                        });
                    }
                }
            }
            return results;
        }
        /**
         * 8. Get conflict check status
         */
        async getConflictCheckStatus(checkId) {
            const request = await this.requestRepository.findByPk(checkId, {
                include: [
                    { model: ConflictDetailModel },
                    { model: WaiverDocumentModel },
                    { model: EthicalWallModel },
                ],
            });
            if (!request) {
                throw new common_1.NotFoundException(`Conflict check not found: ${checkId}`);
            }
            return request;
        }
        /**
         * 9. Update conflict check status
         */
        async updateConflictCheckStatus(checkId, status, notes) {
            const request = await this.requestRepository.findByPk(checkId);
            if (!request) {
                throw new common_1.NotFoundException(`Conflict check not found: ${checkId}`);
            }
            await request.update({
                status,
                metadata: {
                    ...request.metadata,
                    statusNotes: notes,
                    lastStatusUpdate: new Date(),
                },
            });
            this.logger.log(`Updated conflict check ${checkId} status to ${status}`);
            return request;
        }
        /**
         * 10. Get conflicts by matter
         */
        async getConflictsByMatter(matterId) {
            const checks = await this.requestRepository.findAll({
                where: { matterId },
            });
            const checkIds = checks.map((c) => c.id);
            return await this.conflictRepository.findAll({
                where: {
                    conflictCheckId: { [sequelize_1.Op.in]: checkIds },
                },
                include: [ConflictCheckRequestModel],
            });
        }
        /**
         * 11. Get conflicts by client
         */
        async getConflictsByClient(clientId) {
            const checks = await this.requestRepository.findAll({
                where: { clientId },
            });
            const checkIds = checks.map((c) => c.id);
            return await this.conflictRepository.findAll({
                where: {
                    conflictCheckId: { [sequelize_1.Op.in]: checkIds },
                },
                include: [ConflictCheckRequestModel],
            });
        }
    };
    __setFunctionName(_classThis, "ConflictScreeningService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictScreeningService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictScreeningService = _classThis;
})();
exports.ConflictScreeningService = ConflictScreeningService;
/**
 * Waiver Management Service
 * Manages conflict waivers and informed consent
 */
let WaiverManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WaiverManagementService = _classThis = class {
        constructor(waiverRepository, conflictRepository) {
            this.waiverRepository = waiverRepository;
            this.conflictRepository = conflictRepository;
            this.logger = new common_1.Logger(WaiverManagementService.name);
        }
        /**
         * 12. Generate waiver document
         */
        async generateWaiver(waiverData) {
            try {
                const validated = exports.WaiverDocumentSchema.parse(waiverData);
                const conflict = await this.conflictRepository.findByPk(validated.conflictId);
                if (!conflict) {
                    throw new common_1.NotFoundException(`Conflict not found: ${validated.conflictId}`);
                }
                const waiver = await this.waiverRepository.create({
                    ...validated,
                    status: WaiverStatus.DRAFT,
                });
                this.logger.log(`Generated waiver document ${waiver.id} for conflict ${validated.conflictId}`);
                return waiver;
            }
            catch (error) {
                this.logger.error(`Failed to generate waiver: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to generate waiver: ${error.message}`);
            }
        }
        /**
         * 13. Send waiver to client
         */
        async sendWaiverToClient(waiverId, senderId) {
            const waiver = await this.waiverRepository.findByPk(waiverId);
            if (!waiver) {
                throw new common_1.NotFoundException(`Waiver not found: ${waiverId}`);
            }
            if (waiver.status !== WaiverStatus.DRAFT) {
                throw new common_1.BadRequestException('Only draft waivers can be sent to clients');
            }
            await waiver.update({
                status: WaiverStatus.SENT_TO_CLIENT,
                sentDate: new Date(),
                metadata: {
                    ...waiver.metadata,
                    sentBy: senderId,
                },
            });
            this.logger.log(`Sent waiver ${waiverId} to client ${waiver.clientId}`);
            return waiver;
        }
        /**
         * 14. Execute waiver
         */
        async executeWaiver(waiverId, signatoryInfo) {
            const waiver = await this.waiverRepository.findByPk(waiverId);
            if (!waiver) {
                throw new common_1.NotFoundException(`Waiver not found: ${waiverId}`);
            }
            await waiver.update({
                status: WaiverStatus.EXECUTED,
                executedDate: new Date(),
                signatories: signatoryInfo,
            });
            // Update conflict resolution
            const conflict = await this.conflictRepository.findByPk(waiver.conflictId);
            if (conflict) {
                await conflict.update({
                    resolution: ConflictResolution.WAIVED_BY_CLIENT,
                    resolvedDate: new Date(),
                });
            }
            this.logger.log(`Executed waiver ${waiverId}`);
            return waiver;
        }
        /**
         * 15. Revoke waiver
         */
        async revokeWaiver(waiverId, reason, revokedBy) {
            const waiver = await this.waiverRepository.findByPk(waiverId);
            if (!waiver) {
                throw new common_1.NotFoundException(`Waiver not found: ${waiverId}`);
            }
            if (waiver.status !== WaiverStatus.EXECUTED) {
                throw new common_1.BadRequestException('Only executed waivers can be revoked');
            }
            await waiver.update({
                status: WaiverStatus.REVOKED,
                revokedDate: new Date(),
                revokedReason: reason,
                metadata: {
                    ...waiver.metadata,
                    revokedBy,
                },
            });
            this.logger.log(`Revoked waiver ${waiverId}: ${reason}`);
            return waiver;
        }
        /**
         * 16. Track waiver expiration
         */
        async trackWaiverExpiration() {
            const now = new Date();
            const expiredWaivers = await this.waiverRepository.findAll({
                where: {
                    status: WaiverStatus.EXECUTED,
                    expirationDate: {
                        [sequelize_1.Op.lte]: now,
                    },
                },
            });
            for (const waiver of expiredWaivers) {
                await waiver.update({ status: WaiverStatus.EXPIRED });
                this.logger.warn(`Waiver ${waiver.id} has expired`);
            }
            return expiredWaivers;
        }
        /**
         * 17. Get waivers by conflict
         */
        async getWaiversByConflict(conflictId) {
            return await this.waiverRepository.findAll({
                where: { conflictId },
                order: [['createdAt', 'DESC']],
            });
        }
        /**
         * 18. Get active waivers
         */
        async getActiveWaivers(clientId) {
            const where = {
                status: WaiverStatus.EXECUTED,
                [sequelize_1.Op.or]: [
                    { expirationDate: { [sequelize_1.Op.is]: null } },
                    { expirationDate: { [sequelize_1.Op.gt]: new Date() } },
                ],
            };
            if (clientId) {
                where.clientId = clientId;
            }
            return await this.waiverRepository.findAll({
                where,
                order: [['executedDate', 'DESC']],
            });
        }
    };
    __setFunctionName(_classThis, "WaiverManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WaiverManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WaiverManagementService = _classThis;
})();
exports.WaiverManagementService = WaiverManagementService;
/**
 * Ethical Wall Service
 * Manages ethical walls (Chinese Walls) and information barriers
 */
let EthicalWallService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var EthicalWallService = _classThis = class {
        constructor(wallRepository, conflictRepository) {
            this.wallRepository = wallRepository;
            this.conflictRepository = conflictRepository;
            this.logger = new common_1.Logger(EthicalWallService.name);
        }
        /**
         * 19. Implement ethical wall
         */
        async implementEthicalWall(wallData) {
            try {
                const validated = exports.EthicalWallSchema.parse(wallData);
                const wall = await this.wallRepository.create({
                    ...validated,
                    status: EthicalWallStatus.ACTIVE,
                });
                this.logger.log(`Implemented ethical wall ${wall.id} for matter ${validated.matterId}`);
                return wall;
            }
            catch (error) {
                this.logger.error(`Failed to implement ethical wall: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to implement ethical wall: ${error.message}`);
            }
        }
        /**
         * 20. Monitor ethical wall compliance
         */
        async monitorEthicalWall(wallId, reviewNotes) {
            const wall = await this.wallRepository.findByPk(wallId);
            if (!wall) {
                throw new common_1.NotFoundException(`Ethical wall not found: ${wallId}`);
            }
            await wall.update({
                lastReviewDate: new Date(),
                metadata: {
                    ...wall.metadata,
                    lastReviewNotes: reviewNotes,
                },
            });
            this.logger.log(`Monitored ethical wall ${wallId}`);
            return wall;
        }
        /**
         * 21. Report ethical wall breach
         */
        async reportBreach(wallId, breachData) {
            const wall = await this.wallRepository.findByPk(wallId);
            if (!wall) {
                throw new common_1.NotFoundException(`Ethical wall not found: ${wallId}`);
            }
            const breaches = wall.breaches || [];
            breaches.push({
                date: new Date(),
                ...breachData,
            });
            await wall.update({
                status: EthicalWallStatus.BREACHED,
                breaches,
            });
            this.logger.error(`Breach reported for ethical wall ${wallId}: ${breachData.description}`);
            return wall;
        }
        /**
         * 22. Lift ethical wall
         */
        async liftEthicalWall(wallId, reason, liftedBy) {
            const wall = await this.wallRepository.findByPk(wallId);
            if (!wall) {
                throw new common_1.NotFoundException(`Ethical wall not found: ${wallId}`);
            }
            await wall.update({
                status: EthicalWallStatus.LIFTED,
                liftedDate: new Date(),
                liftedReason: reason,
                metadata: {
                    ...wall.metadata,
                    liftedBy,
                },
            });
            this.logger.log(`Lifted ethical wall ${wallId}: ${reason}`);
            return wall;
        }
        /**
         * 23. Get ethical walls by matter
         */
        async getEthicalWallsByMatter(matterId) {
            return await this.wallRepository.findAll({
                where: { matterId },
                order: [['implementationDate', 'DESC']],
            });
        }
        /**
         * 24. Get ethical walls by attorney
         */
        async getEthicalWallsByAttorney(attorneyId) {
            return await this.wallRepository.findAll({
                where: {
                    screenedAttorneys: {
                        [sequelize_1.Op.contains]: [attorneyId],
                    },
                    status: EthicalWallStatus.ACTIVE,
                },
                order: [['implementationDate', 'DESC']],
            });
        }
        /**
         * 25. Check if attorney is screened
         */
        async isAttorneyScreened(attorneyId, matterId) {
            const walls = await this.wallRepository.findAll({
                where: {
                    matterId,
                    status: EthicalWallStatus.ACTIVE,
                    screenedAttorneys: {
                        [sequelize_1.Op.contains]: [attorneyId],
                    },
                },
            });
            return walls.length > 0;
        }
    };
    __setFunctionName(_classThis, "EthicalWallService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EthicalWallService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EthicalWallService = _classThis;
})();
exports.EthicalWallService = EthicalWallService;
/**
 * Lateral Hire Service
 * Manages lateral hire conflict checks
 */
let LateralHireService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LateralHireService = _classThis = class {
        constructor(lateralRepository, conflictRepository) {
            this.lateralRepository = lateralRepository;
            this.conflictRepository = conflictRepository;
            this.logger = new common_1.Logger(LateralHireService.name);
        }
        /**
         * 26. Initiate lateral hire check
         */
        async initiateLateralHireCheck(checkData) {
            try {
                const validated = exports.LateralHireCheckSchema.parse(checkData);
                const check = await this.lateralRepository.create({
                    ...validated,
                    status: LateralHireStatus.INITIATED,
                });
                this.logger.log(`Initiated lateral hire check ${check.id} for candidate: ${validated.candidateName}`);
                return check;
            }
            catch (error) {
                this.logger.error(`Failed to initiate lateral hire check: ${error.message}`);
                throw new common_1.BadRequestException(`Failed to initiate lateral hire check: ${error.message}`);
            }
        }
        /**
         * 27. Analyze prior matters for conflicts
         */
        async analyzePriorMatters(checkId) {
            const check = await this.lateralRepository.findByPk(checkId);
            if (!check) {
                throw new common_1.NotFoundException(`Lateral hire check not found: ${checkId}`);
            }
            const conflicts = [];
            let totalRisk = 0;
            for (const priorMatter of check.priorMatters) {
                // Check if any opposing parties are current clients
                const opposingPartyConflicts = await this.checkOpposingPartyConflicts(priorMatter);
                conflicts.push(...opposingPartyConflicts);
                // Check for confidential information conflicts
                if (priorMatter.confidentialInformation && priorMatter.confidentialInformation.length > 0) {
                    totalRisk += priorMatter.confidentialInformation.length * 10;
                }
            }
            const riskScore = Math.min(100, totalRisk + conflicts.length * 20);
            await check.update({
                conflictsIdentified: conflicts,
                status: conflicts.length > 0
                    ? LateralHireStatus.CONFLICTS_IDENTIFIED
                    : LateralHireStatus.PRELIMINARY_REVIEW,
            });
            this.logger.log(`Analyzed prior matters for ${checkId}: Found ${conflicts.length} conflicts, risk score ${riskScore}`);
            return { conflicts, riskScore };
        }
        /**
         * 28. Check opposing party conflicts for lateral hire
         */
        async checkOpposingPartyConflicts(priorMatter) {
            // This would query current client database
            // Placeholder implementation
            return [];
        }
        /**
         * 29. Approve lateral hire
         */
        async approveLateralHire(checkId, approvedBy, conditions) {
            const check = await this.lateralRepository.findByPk(checkId);
            if (!check) {
                throw new common_1.NotFoundException(`Lateral hire check not found: ${checkId}`);
            }
            const status = conditions && conditions.length > 0
                ? LateralHireStatus.CONDITIONAL_APPROVAL
                : LateralHireStatus.CLEARED;
            await check.update({
                status,
                approvedBy,
                approvalDate: new Date(),
                conditions,
            });
            this.logger.log(`Approved lateral hire ${checkId} with status: ${status}`);
            return check;
        }
        /**
         * 30. Decline lateral hire
         */
        async declineLateralHire(checkId, reason) {
            const check = await this.lateralRepository.findByPk(checkId);
            if (!check) {
                throw new common_1.NotFoundException(`Lateral hire check not found: ${checkId}`);
            }
            await check.update({
                status: LateralHireStatus.HIRE_DECLINED,
                metadata: {
                    ...check.metadata,
                    declineReason: reason,
                    declineDate: new Date(),
                },
            });
            this.logger.log(`Declined lateral hire ${checkId}: ${reason}`);
            return check;
        }
        /**
         * 31. Get lateral hire checks by status
         */
        async getLateralHireChecksByStatus(status) {
            return await this.lateralRepository.findAll({
                where: { status },
                order: [['proposedStartDate', 'ASC']],
            });
        }
    };
    __setFunctionName(_classThis, "LateralHireService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LateralHireService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LateralHireService = _classThis;
})();
exports.LateralHireService = LateralHireService;
/**
 * Conflict Reporting Service
 * Generates conflict reports and analytics
 */
let ConflictReportingService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConflictReportingService = _classThis = class {
        constructor(requestRepository, conflictRepository) {
            this.requestRepository = requestRepository;
            this.conflictRepository = conflictRepository;
            this.logger = new common_1.Logger(ConflictReportingService.name);
        }
        /**
         * 32. Generate screening report
         */
        async generateScreeningReport(checkId) {
            const request = await this.requestRepository.findByPk(checkId, {
                include: [
                    { model: ConflictDetailModel },
                    { model: WaiverDocumentModel },
                    { model: EthicalWallModel },
                ],
            });
            if (!request) {
                throw new common_1.NotFoundException(`Conflict check not found: ${checkId}`);
            }
            const conflicts = request.conflicts || [];
            const waivers = request.waivers || [];
            const ethicalWalls = request.ethicalWalls || [];
            let recommendation;
            if (conflicts.length === 0) {
                recommendation = 'approve';
            }
            else {
                const hasAbsoluteConflicts = conflicts.some((c) => c.severity === ConflictSeverity.ABSOLUTE);
                const hasCriticalConflicts = conflicts.some((c) => c.severity === ConflictSeverity.CRITICAL);
                if (hasAbsoluteConflicts) {
                    recommendation = 'decline';
                }
                else if (hasCriticalConflicts) {
                    recommendation = waivers.length > 0 ? 'approve_with_conditions' : 'needs_review';
                }
                else {
                    recommendation = 'approve_with_conditions';
                }
            }
            const report = {
                conflictCheckId: checkId,
                generatedDate: new Date(),
                generatedBy: request.performedBy || request.requestedBy,
                summary: `Conflict check for ${request.clientName}: Found ${conflicts.length} conflicts`,
                conflictsFound: conflicts.length,
                conflictDetails: conflicts,
                recommendation,
                conditions: recommendation === 'approve_with_conditions'
                    ? ['Obtain executed waivers', 'Implement ethical walls as specified']
                    : [],
                waivers,
                ethicalWalls,
                notificationsRequired: conflicts.flatMap((c) => c.affectedAttorneys),
                followUpActions: [],
            };
            return report;
        }
        /**
         * 33. Get conflict statistics
         */
        async getConflictStatistics(startDate, endDate) {
            const checks = await this.requestRepository.findAll({
                where: {
                    requestDate: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
                include: [{ model: ConflictDetailModel }],
            });
            const totalChecks = checks.length;
            const checksCleared = checks.filter((c) => c.status === ConflictCheckStatus.CLEARED).length;
            const conflictsFound = checks.filter((c) => c.status === ConflictCheckStatus.CONFLICT_FOUND).length;
            const waivedCount = checks.filter((c) => c.status === ConflictCheckStatus.WAIVED).length;
            const declinedCount = checks.filter((c) => c.status === ConflictCheckStatus.DECLINED).length;
            const waiverRate = totalChecks > 0 ? waivedCount / totalChecks : 0;
            const declineRate = totalChecks > 0 ? declinedCount / totalChecks : 0;
            const byType = {};
            const bySeverity = {};
            const byPracticeArea = {};
            for (const check of checks) {
                byPracticeArea[check.practiceArea] = (byPracticeArea[check.practiceArea] || 0) + 1;
                if (check.conflicts) {
                    for (const conflict of check.conflicts) {
                        byType[conflict.conflictType] = (byType[conflict.conflictType] || 0) + 1;
                        bySeverity[conflict.severity] = (bySeverity[conflict.severity] || 0) + 1;
                    }
                }
            }
            return {
                period: { startDate, endDate },
                totalChecks,
                checksCleared,
                conflictsFound,
                waiverRate,
                declineRate,
                byType,
                bySeverity,
                byPracticeArea,
                averageResolutionTime: 0, // Would calculate from timestamps
                ethicalWallsImplemented: 0, // Would query EthicalWallModel
                lateralHireChecks: 0, // Would query LateralHireCheckModel
                trends: [],
            };
        }
        /**
         * 34. Periodic conflict review
         */
        async performPeriodicReview(matterId) {
            const existingChecks = await this.requestRepository.findAll({
                where: { matterId },
                include: [{ model: ConflictDetailModel }],
                order: [['requestDate', 'DESC']],
            });
            if (existingChecks.length === 0) {
                throw new common_1.NotFoundException(`No conflict checks found for matter: ${matterId}`);
            }
            const latestCheck = existingChecks[0];
            const allConflicts = existingChecks.flatMap((c) => c.conflicts || []);
            this.logger.log(`Performed periodic review for matter ${matterId}`);
            return {
                conflicts: allConflicts,
                reviewDate: new Date(),
            };
        }
        /**
         * 35. Export conflict data for compliance
         */
        async exportConflictData(startDate, endDate) {
            const checks = await this.requestRepository.findAll({
                where: {
                    requestDate: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
                include: [
                    { model: ConflictDetailModel },
                    { model: WaiverDocumentModel },
                ],
            });
            const conflicts = checks.flatMap((c) => c.conflicts || []);
            const waivers = checks.flatMap((c) => c.waivers || []);
            this.logger.log(`Exported conflict data: ${checks.length} checks, ${conflicts.length} conflicts, ${waivers.length} waivers`);
            return {
                checks,
                conflicts,
                waivers,
                exportDate: new Date(),
            };
        }
    };
    __setFunctionName(_classThis, "ConflictReportingService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictReportingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictReportingService = _classThis;
})();
exports.ConflictReportingService = ConflictReportingService;
// ============================================================================
// CONFIGURATION & MODULE
// ============================================================================
/**
 * Conflict check kit configuration
 */
exports.conflictCheckConfig = (0, config_1.registerAs)('conflictCheck', () => ({
    autoScreening: {
        enabled: process.env.CONFLICT_AUTO_SCREENING === 'true',
        threshold: parseInt(process.env.CONFLICT_AUTO_SCREENING_THRESHOLD || '3', 10),
    },
    waiver: {
        defaultExpirationDays: parseInt(process.env.WAIVER_EXPIRATION_DAYS || '365', 10),
        requireApproval: process.env.WAIVER_REQUIRE_APPROVAL === 'true',
    },
    ethicalWall: {
        defaultMonitoringFrequency: process.env.ETHICAL_WALL_MONITORING || 'monthly',
        breachNotification: process.env.ETHICAL_WALL_BREACH_NOTIFICATION === 'true',
    },
    lateralHire: {
        automaticScreening: process.env.LATERAL_HIRE_AUTO_SCREEN === 'true',
        approvalRequired: process.env.LATERAL_HIRE_APPROVAL === 'true',
    },
    notifications: {
        enabled: process.env.CONFLICT_NOTIFICATIONS === 'true',
        channels: (process.env.CONFLICT_NOTIFICATION_CHANNELS || 'email,system').split(','),
    },
}));
/**
 * Conflict Check Module
 * Provides comprehensive conflict of interest management
 */
let ConflictCheckModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [config_1.ConfigModule.forFeature(exports.conflictCheckConfig)],
            providers: [
                ConflictScreeningService,
                WaiverManagementService,
                EthicalWallService,
                LateralHireService,
                ConflictReportingService,
                {
                    provide: 'CONFLICT_CHECK_REQUEST_REPOSITORY',
                    useValue: ConflictCheckRequestModel,
                },
                {
                    provide: 'CONFLICT_DETAIL_REPOSITORY',
                    useValue: ConflictDetailModel,
                },
                {
                    provide: 'WAIVER_DOCUMENT_REPOSITORY',
                    useValue: WaiverDocumentModel,
                },
                {
                    provide: 'ETHICAL_WALL_REPOSITORY',
                    useValue: EthicalWallModel,
                },
                {
                    provide: 'LATERAL_HIRE_CHECK_REPOSITORY',
                    useValue: LateralHireCheckModel,
                },
                {
                    provide: 'CONFLICT_NOTIFICATION_REPOSITORY',
                    useValue: ConflictNotificationModel,
                },
            ],
            exports: [
                ConflictScreeningService,
                WaiverManagementService,
                EthicalWallService,
                LateralHireService,
                ConflictReportingService,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConflictCheckModule = _classThis = class {
        static forRoot() {
            return {
                module: ConflictCheckModule,
                global: true,
            };
        }
    };
    __setFunctionName(_classThis, "ConflictCheckModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConflictCheckModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConflictCheckModule = _classThis;
})();
exports.ConflictCheckModule = ConflictCheckModule;
//# sourceMappingURL=conflict-check-kit.js.map