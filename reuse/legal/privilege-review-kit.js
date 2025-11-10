"use strict";
/**
 * LOC: PRIVILEGE_REVIEW_KIT_001
 * File: /reuse/legal/privilege-review-kit.ts
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
 *   - Legal privilege modules
 *   - Document review controllers
 *   - Privilege logging services
 *   - Clawback management services
 *   - Quality control services
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
exports.PrivilegeReviewModule = exports.PrivilegeLogService = exports.ClawbackManagementService = exports.PrivilegeReviewService = exports.ClawbackRequest = exports.PrivilegeAssertion = exports.PrivilegeLog = exports.PrivilegeTag = exports.QualityControlSchema = exports.PrivilegeAssertionSchema = exports.ClawbackRequestSchema = exports.PrivilegeLogEntrySchema = exports.PrivilegeTagSchema = exports.ConfidentialityLevel = exports.PrivilegeLogFormat = exports.QCReviewStatus = exports.DisclosureSeverity = exports.ClawbackStatus = exports.PrivilegeBasis = exports.PrivilegeAssertionStatus = exports.PrivilegeType = void 0;
exports.createPrivilegeTag = createPrivilegeTag;
exports.updatePrivilegeTag = updatePrivilegeTag;
exports.batchTagDocuments = batchTagDocuments;
exports.validatePrivilegeClaim = validatePrivilegeClaim;
exports.getPrivilegeTagsByDocument = getPrivilegeTagsByDocument;
exports.searchPrivilegedDocuments = searchPrivilegedDocuments;
exports.removePrivilegeTag = removePrivilegeTag;
exports.bulkPrivilegeReview = bulkPrivilegeReview;
exports.generatePrivilegeLog = generatePrivilegeLog;
exports.addPrivilegeLogEntry = addPrivilegeLogEntry;
exports.formatPrivilegeLogExport = formatPrivilegeLogExport;
exports.validatePrivilegeLogCompleteness = validatePrivilegeLogCompleteness;
exports.groupPrivilegeLogByType = groupPrivilegeLogByType;
exports.redactPrivilegeLogInfo = redactPrivilegeLogInfo;
exports.updatePrivilegeLogEntry = updatePrivilegeLogEntry;
exports.createClawbackRequest = createClawbackRequest;
exports.processInadvertentDisclosure = processInadvertentDisclosure;
exports.validateClawbackTimeliness = validateClawbackTimeliness;
exports.generateClawbackNotice = generateClawbackNotice;
exports.trackClawbackCompliance = trackClawbackCompliance;
exports.closeClawbackRequest = closeClawbackRequest;
exports.initiatePrivilegeAssertion = initiatePrivilegeAssertion;
exports.assignPrivilegeReviewer = assignPrivilegeReviewer;
exports.submitPrivilegeChallenge = submitPrivilegeChallenge;
exports.resolvePrivilegeDispute = resolvePrivilegeDispute;
exports.escalatePrivilegeIssue = escalatePrivilegeIssue;
exports.documentAssertionRationale = documentAssertionRationale;
exports.trackAssertionStatus = trackAssertionStatus;
exports.finalizePrivilegeAssertion = finalizePrivilegeAssertion;
exports.performQualityControlSample = performQualityControlSample;
exports.validatePrivilegeConsistency = validatePrivilegeConsistency;
exports.identifyPrivilegeGaps = identifyPrivilegeGaps;
exports.generateQCMetrics = generateQCMetrics;
exports.flagInconsistentPrivilege = flagInconsistentPrivilege;
exports.reviewPrivilegeAccuracy = reviewPrivilegeAccuracy;
exports.generatePrivilegeStatistics = generatePrivilegeStatistics;
exports.exportPrivilegeReviewData = exportPrivilegeReviewData;
exports.calculatePrivilegeReviewProgress = calculatePrivilegeReviewProgress;
exports.detectPrivilegeWaiverRisks = detectPrivilegeWaiverRisks;
exports.generatePrivilegeReviewReport = generatePrivilegeReviewReport;
exports.validateFRE502Compliance = validateFRE502Compliance;
exports.archiveCompletedPrivilegeReview = archiveCompletedPrivilegeReview;
/**
 * File: /reuse/legal/privilege-review-kit.ts
 * Locator: WC-PRIVILEGE-REVIEW-KIT-001
 * Purpose: Production-Grade Privilege Review Kit - Enterprise privilege protection toolkit
 *
 * Upstream: NestJS, Sequelize, Zod, Date-FNS
 * Downstream: ../backend/modules/privilege/*, Document review controllers, Privilege services
 * Dependencies: TypeScript 5.x, Node 18+, sequelize-typescript, @nestjs/swagger, zod
 * Exports: 42 production-ready privilege review functions for legal platforms
 *
 * LLM Context: Production-grade privilege review and protection toolkit for White Cross platform.
 * Provides comprehensive privilege tagging with multi-level classification (attorney-client, work
 * product, common interest, etc.), privilege log generation with automatic formatting and export,
 * clawback request management for inadvertent disclosure, privilege assertion workflow with
 * challenge/dispute resolution, review quality control with sampling and consistency validation,
 * Sequelize models for privilege tags/logs/assertions/clawback requests, NestJS services with
 * dependency injection, Swagger API documentation, privilege claim validation with legal basis
 * verification, batch document tagging for mass review, privilege log completeness checking,
 * inadvertent disclosure detection and remediation, clawback notice generation with template
 * support, assertion rationale documentation, privilege gap identification, QC metrics generation,
 * consistency validation across document sets, privilege hierarchy management, redaction
 * coordination, waiver tracking, and healthcare-specific privilege support (peer review privilege,
 * patient safety work product, quality improvement privilege, medical staff credentialing).
 */
const crypto = __importStar(require("crypto"));
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const swagger_1 = require("@nestjs/swagger");
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
const date_fns_1 = require("date-fns");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Types of legal privilege
 */
var PrivilegeType;
(function (PrivilegeType) {
    PrivilegeType["ATTORNEY_CLIENT"] = "attorney_client";
    PrivilegeType["WORK_PRODUCT"] = "work_product";
    PrivilegeType["COMMON_INTEREST"] = "common_interest";
    PrivilegeType["SETTLEMENT_NEGOTIATION"] = "settlement_negotiation";
    PrivilegeType["JOINT_DEFENSE"] = "joint_defense";
    PrivilegeType["MEDIATION"] = "mediation";
    PrivilegeType["ATTORNEY_WORK_PRODUCT"] = "attorney_work_product";
    PrivilegeType["SELF_CRITICAL_ANALYSIS"] = "self_critical_analysis";
    PrivilegeType["PEER_REVIEW"] = "peer_review";
    PrivilegeType["PATIENT_SAFETY_WORK_PRODUCT"] = "patient_safety_work_product";
    PrivilegeType["QUALITY_IMPROVEMENT"] = "quality_improvement";
    PrivilegeType["CREDENTIALING_PEER_REVIEW"] = "credentialing_peer_review";
    PrivilegeType["EXECUTIVE_PRIVILEGE"] = "executive_privilege";
    PrivilegeType["DELIBERATIVE_PROCESS"] = "deliberative_process";
    PrivilegeType["OTHER"] = "other";
})(PrivilegeType || (exports.PrivilegeType = PrivilegeType = {}));
/**
 * Privilege assertion status
 */
var PrivilegeAssertionStatus;
(function (PrivilegeAssertionStatus) {
    PrivilegeAssertionStatus["PENDING_REVIEW"] = "pending_review";
    PrivilegeAssertionStatus["UNDER_REVIEW"] = "under_review";
    PrivilegeAssertionStatus["ASSERTED"] = "asserted";
    PrivilegeAssertionStatus["CHALLENGED"] = "challenged";
    PrivilegeAssertionStatus["DISPUTED"] = "disputed";
    PrivilegeAssertionStatus["UPHELD"] = "upheld";
    PrivilegeAssertionStatus["OVERRULED"] = "overruled";
    PrivilegeAssertionStatus["WAIVED"] = "waived";
    PrivilegeAssertionStatus["PARTIALLY_WAIVED"] = "partially_waived";
    PrivilegeAssertionStatus["WITHDRAWN"] = "withdrawn";
    PrivilegeAssertionStatus["RESOLVED"] = "resolved";
})(PrivilegeAssertionStatus || (exports.PrivilegeAssertionStatus = PrivilegeAssertionStatus = {}));
/**
 * Legal basis for privilege claim
 */
var PrivilegeBasis;
(function (PrivilegeBasis) {
    PrivilegeBasis["FEDERAL_RULE_EVIDENCE_501"] = "fre_501";
    PrivilegeBasis["STATE_ATTORNEY_CLIENT"] = "state_attorney_client";
    PrivilegeBasis["FEDERAL_WORK_PRODUCT"] = "federal_work_product";
    PrivilegeBasis["COMMON_LAW"] = "common_law";
    PrivilegeBasis["STATUTORY"] = "statutory";
    PrivilegeBasis["HIPAA_PATIENT_SAFETY"] = "hipaa_patient_safety";
    PrivilegeBasis["PEER_REVIEW_STATUTE"] = "peer_review_statute";
    PrivilegeBasis["CONTRACTUAL"] = "contractual";
    PrivilegeBasis["PROTECTIVE_ORDER"] = "protective_order";
    PrivilegeBasis["OTHER"] = "other";
})(PrivilegeBasis || (exports.PrivilegeBasis = PrivilegeBasis = {}));
/**
 * Clawback request status
 */
var ClawbackStatus;
(function (ClawbackStatus) {
    ClawbackStatus["DISCLOSED"] = "disclosed";
    ClawbackStatus["DETECTED"] = "detected";
    ClawbackStatus["REQUEST_INITIATED"] = "request_initiated";
    ClawbackStatus["NOTICE_SENT"] = "notice_sent";
    ClawbackStatus["RECIPIENT_ACKNOWLEDGED"] = "recipient_acknowledged";
    ClawbackStatus["DOCUMENTS_RETURNED"] = "documents_returned";
    ClawbackStatus["DOCUMENTS_DESTROYED"] = "documents_destroyed";
    ClawbackStatus["REFUSED"] = "refused";
    ClawbackStatus["LITIGATED"] = "litigated";
    ClawbackStatus["WAIVED"] = "waived";
    ClawbackStatus["RESOLVED"] = "resolved";
})(ClawbackStatus || (exports.ClawbackStatus = ClawbackStatus = {}));
/**
 * Inadvertent disclosure severity
 */
var DisclosureSeverity;
(function (DisclosureSeverity) {
    DisclosureSeverity["LOW"] = "low";
    DisclosureSeverity["MEDIUM"] = "medium";
    DisclosureSeverity["HIGH"] = "high";
    DisclosureSeverity["CRITICAL"] = "critical";
})(DisclosureSeverity || (exports.DisclosureSeverity = DisclosureSeverity = {}));
/**
 * Quality control review status
 */
var QCReviewStatus;
(function (QCReviewStatus) {
    QCReviewStatus["NOT_STARTED"] = "not_started";
    QCReviewStatus["IN_PROGRESS"] = "in_progress";
    QCReviewStatus["PASSED"] = "passed";
    QCReviewStatus["FAILED"] = "failed";
    QCReviewStatus["NEEDS_REMEDIATION"] = "needs_remediation";
    QCReviewStatus["COMPLETED"] = "completed";
})(QCReviewStatus || (exports.QCReviewStatus = QCReviewStatus = {}));
/**
 * Privilege log format types
 */
var PrivilegeLogFormat;
(function (PrivilegeLogFormat) {
    PrivilegeLogFormat["STANDARD"] = "standard";
    PrivilegeLogFormat["DETAILED"] = "detailed";
    PrivilegeLogFormat["SUMMARY"] = "summary";
    PrivilegeLogFormat["EXCEL"] = "excel";
    PrivilegeLogFormat["PDF"] = "pdf";
    PrivilegeLogFormat["HTML"] = "html";
})(PrivilegeLogFormat || (exports.PrivilegeLogFormat = PrivilegeLogFormat = {}));
/**
 * Document confidentiality level
 */
var ConfidentialityLevel;
(function (ConfidentialityLevel) {
    ConfidentialityLevel["PUBLIC"] = "public";
    ConfidentialityLevel["INTERNAL"] = "internal";
    ConfidentialityLevel["CONFIDENTIAL"] = "confidential";
    ConfidentialityLevel["HIGHLY_CONFIDENTIAL"] = "highly_confidential";
    ConfidentialityLevel["PRIVILEGED"] = "privileged";
    ConfidentialityLevel["ATTORNEYS_EYES_ONLY"] = "attorneys_eyes_only";
})(ConfidentialityLevel || (exports.ConfidentialityLevel = ConfidentialityLevel = {}));
// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
exports.PrivilegeTagSchema = zod_1.z.object({
    documentId: zod_1.z.string().uuid(),
    privilegeType: zod_1.z.nativeEnum(PrivilegeType),
    privilegeBasis: zod_1.z.nativeEnum(PrivilegeBasis),
    assertionReason: zod_1.z.string().min(10).max(5000),
    confidentialityLevel: zod_1.z.nativeEnum(ConfidentialityLevel),
    reviewerId: zod_1.z.string().uuid(),
    dateAsserted: zod_1.z.date().optional(),
    notes: zod_1.z.string().max(10000).optional(),
});
exports.PrivilegeLogEntrySchema = zod_1.z.object({
    documentIdentifier: zod_1.z.string(),
    documentDate: zod_1.z.date(),
    author: zod_1.z.string(),
    recipients: zod_1.z.array(zod_1.z.string()),
    privilegeType: zod_1.z.nativeEnum(PrivilegeType),
    description: zod_1.z.string().min(20).max(2000),
    basisForClaim: zod_1.z.string(),
    ccRecipients: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.ClawbackRequestSchema = zod_1.z.object({
    documentId: zod_1.z.string().uuid(),
    disclosureDate: zod_1.z.date(),
    detectionDate: zod_1.z.date(),
    recipientParty: zod_1.z.string(),
    disclosureSeverity: zod_1.z.nativeEnum(DisclosureSeverity),
    requestedAction: zod_1.z.enum(['return', 'destroy', 'both']),
    legalBasis: zod_1.z.string(),
    deadlineDate: zod_1.z.date().optional(),
});
exports.PrivilegeAssertionSchema = zod_1.z.object({
    documentId: zod_1.z.string().uuid(),
    privilegeType: zod_1.z.nativeEnum(PrivilegeType),
    assertedBy: zod_1.z.string().uuid(),
    assertionDate: zod_1.z.date(),
    rationale: zod_1.z.string().min(50).max(10000),
    supportingAuthority: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(PrivilegeAssertionStatus),
});
exports.QualityControlSchema = zod_1.z.object({
    reviewBatchId: zod_1.z.string().uuid(),
    sampleSize: zod_1.z.number().int().positive(),
    reviewerId: zod_1.z.string().uuid(),
    accuracyThreshold: zod_1.z.number().min(0).max(100),
    consistencyThreshold: zod_1.z.number().min(0).max(100),
});
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Privilege Tag Model - Stores privilege designations for documents
 */
let PrivilegeTag = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'privilege_tags',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['document_id'] },
                { fields: ['privilege_type'] },
                { fields: ['reviewer_id'] },
                { fields: ['created_at'] },
                { fields: ['assertion_status'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _privilegeType_decorators;
    let _privilegeType_initializers = [];
    let _privilegeType_extraInitializers = [];
    let _privilegeBasis_decorators;
    let _privilegeBasis_initializers = [];
    let _privilegeBasis_extraInitializers = [];
    let _assertionReason_decorators;
    let _assertionReason_initializers = [];
    let _assertionReason_extraInitializers = [];
    let _confidentialityLevel_decorators;
    let _confidentialityLevel_initializers = [];
    let _confidentialityLevel_extraInitializers = [];
    let _reviewerId_decorators;
    let _reviewerId_initializers = [];
    let _reviewerId_extraInitializers = [];
    let _dateAsserted_decorators;
    let _dateAsserted_initializers = [];
    let _dateAsserted_extraInitializers = [];
    let _assertionStatus_decorators;
    let _assertionStatus_initializers = [];
    let _assertionStatus_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
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
    let _assertions_decorators;
    let _assertions_initializers = [];
    let _assertions_extraInitializers = [];
    var PrivilegeTag = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.privilegeType = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _privilegeType_initializers, void 0));
            this.privilegeBasis = (__runInitializers(this, _privilegeType_extraInitializers), __runInitializers(this, _privilegeBasis_initializers, void 0));
            this.assertionReason = (__runInitializers(this, _privilegeBasis_extraInitializers), __runInitializers(this, _assertionReason_initializers, void 0));
            this.confidentialityLevel = (__runInitializers(this, _assertionReason_extraInitializers), __runInitializers(this, _confidentialityLevel_initializers, void 0));
            this.reviewerId = (__runInitializers(this, _confidentialityLevel_extraInitializers), __runInitializers(this, _reviewerId_initializers, void 0));
            this.dateAsserted = (__runInitializers(this, _reviewerId_extraInitializers), __runInitializers(this, _dateAsserted_initializers, void 0));
            this.assertionStatus = (__runInitializers(this, _dateAsserted_extraInitializers), __runInitializers(this, _assertionStatus_initializers, void 0));
            this.notes = (__runInitializers(this, _assertionStatus_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.assertions = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _assertions_initializers, void 0));
            __runInitializers(this, _assertions_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PrivilegeTag");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier for privilege tag' })];
        _documentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'document_id',
            }), (0, swagger_1.ApiProperty)({ description: 'Document being tagged as privileged' })];
        _privilegeType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PrivilegeType)),
                allowNull: false,
                field: 'privilege_type',
            }), (0, swagger_1.ApiProperty)({ enum: PrivilegeType, description: 'Type of privilege asserted' })];
        _privilegeBasis_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PrivilegeBasis)),
                allowNull: false,
                field: 'privilege_basis',
            }), (0, swagger_1.ApiProperty)({ enum: PrivilegeBasis, description: 'Legal basis for privilege' })];
        _assertionReason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                field: 'assertion_reason',
            }), (0, swagger_1.ApiProperty)({ description: 'Detailed reason for privilege assertion' })];
        _confidentialityLevel_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ConfidentialityLevel)),
                allowNull: false,
                field: 'confidentiality_level',
            }), (0, swagger_1.ApiProperty)({ enum: ConfidentialityLevel, description: 'Confidentiality classification' })];
        _reviewerId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'reviewer_id',
            }), (0, swagger_1.ApiProperty)({ description: 'User who tagged the document' })];
        _dateAsserted_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'date_asserted',
            }), (0, swagger_1.ApiProperty)({ description: 'Date privilege was asserted' })];
        _assertionStatus_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PrivilegeAssertionStatus)),
                allowNull: false,
                defaultValue: PrivilegeAssertionStatus.PENDING_REVIEW,
                field: 'assertion_status',
            }), (0, swagger_1.ApiProperty)({ enum: PrivilegeAssertionStatus, description: 'Current assertion status' })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Additional notes' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)({ field: 'deleted_at' })];
        _assertions_decorators = [(0, sequelize_typescript_1.HasMany)(() => PrivilegeAssertion, 'privilegeTagId')];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _privilegeType_decorators, { kind: "field", name: "privilegeType", static: false, private: false, access: { has: obj => "privilegeType" in obj, get: obj => obj.privilegeType, set: (obj, value) => { obj.privilegeType = value; } }, metadata: _metadata }, _privilegeType_initializers, _privilegeType_extraInitializers);
        __esDecorate(null, null, _privilegeBasis_decorators, { kind: "field", name: "privilegeBasis", static: false, private: false, access: { has: obj => "privilegeBasis" in obj, get: obj => obj.privilegeBasis, set: (obj, value) => { obj.privilegeBasis = value; } }, metadata: _metadata }, _privilegeBasis_initializers, _privilegeBasis_extraInitializers);
        __esDecorate(null, null, _assertionReason_decorators, { kind: "field", name: "assertionReason", static: false, private: false, access: { has: obj => "assertionReason" in obj, get: obj => obj.assertionReason, set: (obj, value) => { obj.assertionReason = value; } }, metadata: _metadata }, _assertionReason_initializers, _assertionReason_extraInitializers);
        __esDecorate(null, null, _confidentialityLevel_decorators, { kind: "field", name: "confidentialityLevel", static: false, private: false, access: { has: obj => "confidentialityLevel" in obj, get: obj => obj.confidentialityLevel, set: (obj, value) => { obj.confidentialityLevel = value; } }, metadata: _metadata }, _confidentialityLevel_initializers, _confidentialityLevel_extraInitializers);
        __esDecorate(null, null, _reviewerId_decorators, { kind: "field", name: "reviewerId", static: false, private: false, access: { has: obj => "reviewerId" in obj, get: obj => obj.reviewerId, set: (obj, value) => { obj.reviewerId = value; } }, metadata: _metadata }, _reviewerId_initializers, _reviewerId_extraInitializers);
        __esDecorate(null, null, _dateAsserted_decorators, { kind: "field", name: "dateAsserted", static: false, private: false, access: { has: obj => "dateAsserted" in obj, get: obj => obj.dateAsserted, set: (obj, value) => { obj.dateAsserted = value; } }, metadata: _metadata }, _dateAsserted_initializers, _dateAsserted_extraInitializers);
        __esDecorate(null, null, _assertionStatus_decorators, { kind: "field", name: "assertionStatus", static: false, private: false, access: { has: obj => "assertionStatus" in obj, get: obj => obj.assertionStatus, set: (obj, value) => { obj.assertionStatus = value; } }, metadata: _metadata }, _assertionStatus_initializers, _assertionStatus_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _assertions_decorators, { kind: "field", name: "assertions", static: false, private: false, access: { has: obj => "assertions" in obj, get: obj => obj.assertions, set: (obj, value) => { obj.assertions = value; } }, metadata: _metadata }, _assertions_initializers, _assertions_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrivilegeTag = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrivilegeTag = _classThis;
})();
exports.PrivilegeTag = PrivilegeTag;
/**
 * Privilege Log Model - Formal privilege log entries
 */
let PrivilegeLog = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'privilege_logs',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['matter_id'] },
                { fields: ['document_identifier'] },
                { fields: ['privilege_type'] },
                { fields: ['created_at'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _matterId_decorators;
    let _matterId_initializers = [];
    let _matterId_extraInitializers = [];
    let _documentIdentifier_decorators;
    let _documentIdentifier_initializers = [];
    let _documentIdentifier_extraInitializers = [];
    let _documentDate_decorators;
    let _documentDate_initializers = [];
    let _documentDate_extraInitializers = [];
    let _author_decorators;
    let _author_initializers = [];
    let _author_extraInitializers = [];
    let _recipients_decorators;
    let _recipients_initializers = [];
    let _recipients_extraInitializers = [];
    let _ccRecipients_decorators;
    let _ccRecipients_initializers = [];
    let _ccRecipients_extraInitializers = [];
    let _privilegeType_decorators;
    let _privilegeType_initializers = [];
    let _privilegeType_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _basisForClaim_decorators;
    let _basisForClaim_initializers = [];
    let _basisForClaim_extraInitializers = [];
    let _subjectMatter_decorators;
    let _subjectMatter_initializers = [];
    let _subjectMatter_extraInitializers = [];
    let _pageCount_decorators;
    let _pageCount_initializers = [];
    let _pageCount_extraInitializers = [];
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
    var PrivilegeLog = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.matterId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _matterId_initializers, void 0));
            this.documentIdentifier = (__runInitializers(this, _matterId_extraInitializers), __runInitializers(this, _documentIdentifier_initializers, void 0));
            this.documentDate = (__runInitializers(this, _documentIdentifier_extraInitializers), __runInitializers(this, _documentDate_initializers, void 0));
            this.author = (__runInitializers(this, _documentDate_extraInitializers), __runInitializers(this, _author_initializers, void 0));
            this.recipients = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _recipients_initializers, void 0));
            this.ccRecipients = (__runInitializers(this, _recipients_extraInitializers), __runInitializers(this, _ccRecipients_initializers, void 0));
            this.privilegeType = (__runInitializers(this, _ccRecipients_extraInitializers), __runInitializers(this, _privilegeType_initializers, void 0));
            this.description = (__runInitializers(this, _privilegeType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.basisForClaim = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _basisForClaim_initializers, void 0));
            this.subjectMatter = (__runInitializers(this, _basisForClaim_extraInitializers), __runInitializers(this, _subjectMatter_initializers, void 0));
            this.pageCount = (__runInitializers(this, _subjectMatter_extraInitializers), __runInitializers(this, _pageCount_initializers, void 0));
            this.metadata = (__runInitializers(this, _pageCount_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PrivilegeLog");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier for log entry' })];
        _matterId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'matter_id',
            }), (0, swagger_1.ApiProperty)({ description: 'Associated legal matter' })];
        _documentIdentifier_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
                field: 'document_identifier',
            }), (0, swagger_1.ApiProperty)({ description: 'Document identifier (Bates, control number, etc.)' })];
        _documentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'document_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date of the document' })];
        _author_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Document author' })];
        _recipients_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Document recipients', type: [String] })];
        _ccRecipients_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
                allowNull: true,
                field: 'cc_recipients',
            }), (0, swagger_1.ApiProperty)({ description: 'CC recipients', type: [String] })];
        _privilegeType_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PrivilegeType)),
                allowNull: false,
                field: 'privilege_type',
            }), (0, swagger_1.ApiProperty)({ enum: PrivilegeType, description: 'Type of privilege' })];
        _description_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'General description of document' })];
        _basisForClaim_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                field: 'basis_for_claim',
            }), (0, swagger_1.ApiProperty)({ description: 'Legal basis for privilege claim' })];
        _subjectMatter_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: true,
                field: 'subject_matter',
            }), (0, swagger_1.ApiProperty)({ description: 'Subject matter of communication' })];
        _pageCount_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.INTEGER,
                allowNull: true,
                field: 'page_count',
            }), (0, swagger_1.ApiProperty)({ description: 'Number of pages' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)({ field: 'deleted_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _matterId_decorators, { kind: "field", name: "matterId", static: false, private: false, access: { has: obj => "matterId" in obj, get: obj => obj.matterId, set: (obj, value) => { obj.matterId = value; } }, metadata: _metadata }, _matterId_initializers, _matterId_extraInitializers);
        __esDecorate(null, null, _documentIdentifier_decorators, { kind: "field", name: "documentIdentifier", static: false, private: false, access: { has: obj => "documentIdentifier" in obj, get: obj => obj.documentIdentifier, set: (obj, value) => { obj.documentIdentifier = value; } }, metadata: _metadata }, _documentIdentifier_initializers, _documentIdentifier_extraInitializers);
        __esDecorate(null, null, _documentDate_decorators, { kind: "field", name: "documentDate", static: false, private: false, access: { has: obj => "documentDate" in obj, get: obj => obj.documentDate, set: (obj, value) => { obj.documentDate = value; } }, metadata: _metadata }, _documentDate_initializers, _documentDate_extraInitializers);
        __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: obj => "author" in obj, get: obj => obj.author, set: (obj, value) => { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
        __esDecorate(null, null, _recipients_decorators, { kind: "field", name: "recipients", static: false, private: false, access: { has: obj => "recipients" in obj, get: obj => obj.recipients, set: (obj, value) => { obj.recipients = value; } }, metadata: _metadata }, _recipients_initializers, _recipients_extraInitializers);
        __esDecorate(null, null, _ccRecipients_decorators, { kind: "field", name: "ccRecipients", static: false, private: false, access: { has: obj => "ccRecipients" in obj, get: obj => obj.ccRecipients, set: (obj, value) => { obj.ccRecipients = value; } }, metadata: _metadata }, _ccRecipients_initializers, _ccRecipients_extraInitializers);
        __esDecorate(null, null, _privilegeType_decorators, { kind: "field", name: "privilegeType", static: false, private: false, access: { has: obj => "privilegeType" in obj, get: obj => obj.privilegeType, set: (obj, value) => { obj.privilegeType = value; } }, metadata: _metadata }, _privilegeType_initializers, _privilegeType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _basisForClaim_decorators, { kind: "field", name: "basisForClaim", static: false, private: false, access: { has: obj => "basisForClaim" in obj, get: obj => obj.basisForClaim, set: (obj, value) => { obj.basisForClaim = value; } }, metadata: _metadata }, _basisForClaim_initializers, _basisForClaim_extraInitializers);
        __esDecorate(null, null, _subjectMatter_decorators, { kind: "field", name: "subjectMatter", static: false, private: false, access: { has: obj => "subjectMatter" in obj, get: obj => obj.subjectMatter, set: (obj, value) => { obj.subjectMatter = value; } }, metadata: _metadata }, _subjectMatter_initializers, _subjectMatter_extraInitializers);
        __esDecorate(null, null, _pageCount_decorators, { kind: "field", name: "pageCount", static: false, private: false, access: { has: obj => "pageCount" in obj, get: obj => obj.pageCount, set: (obj, value) => { obj.pageCount = value; } }, metadata: _metadata }, _pageCount_initializers, _pageCount_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrivilegeLog = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrivilegeLog = _classThis;
})();
exports.PrivilegeLog = PrivilegeLog;
/**
 * Privilege Assertion Model - Tracks privilege assertion workflow
 */
let PrivilegeAssertion = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'privilege_assertions',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['privilege_tag_id'] },
                { fields: ['asserted_by'] },
                { fields: ['status'] },
                { fields: ['assertion_date'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _privilegeTagId_decorators;
    let _privilegeTagId_initializers = [];
    let _privilegeTagId_extraInitializers = [];
    let _assertedBy_decorators;
    let _assertedBy_initializers = [];
    let _assertedBy_extraInitializers = [];
    let _assertionDate_decorators;
    let _assertionDate_initializers = [];
    let _assertionDate_extraInitializers = [];
    let _rationale_decorators;
    let _rationale_initializers = [];
    let _rationale_extraInitializers = [];
    let _supportingAuthority_decorators;
    let _supportingAuthority_initializers = [];
    let _supportingAuthority_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _challengedBy_decorators;
    let _challengedBy_initializers = [];
    let _challengedBy_extraInitializers = [];
    let _challengeReason_decorators;
    let _challengeReason_initializers = [];
    let _challengeReason_extraInitializers = [];
    let _challengeDate_decorators;
    let _challengeDate_initializers = [];
    let _challengeDate_extraInitializers = [];
    let _resolvedBy_decorators;
    let _resolvedBy_initializers = [];
    let _resolvedBy_extraInitializers = [];
    let _resolution_decorators;
    let _resolution_initializers = [];
    let _resolution_extraInitializers = [];
    let _resolutionDate_decorators;
    let _resolutionDate_initializers = [];
    let _resolutionDate_extraInitializers = [];
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
    let _privilegeTag_decorators;
    let _privilegeTag_initializers = [];
    let _privilegeTag_extraInitializers = [];
    var PrivilegeAssertion = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.privilegeTagId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _privilegeTagId_initializers, void 0));
            this.assertedBy = (__runInitializers(this, _privilegeTagId_extraInitializers), __runInitializers(this, _assertedBy_initializers, void 0));
            this.assertionDate = (__runInitializers(this, _assertedBy_extraInitializers), __runInitializers(this, _assertionDate_initializers, void 0));
            this.rationale = (__runInitializers(this, _assertionDate_extraInitializers), __runInitializers(this, _rationale_initializers, void 0));
            this.supportingAuthority = (__runInitializers(this, _rationale_extraInitializers), __runInitializers(this, _supportingAuthority_initializers, void 0));
            this.status = (__runInitializers(this, _supportingAuthority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.challengedBy = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _challengedBy_initializers, void 0));
            this.challengeReason = (__runInitializers(this, _challengedBy_extraInitializers), __runInitializers(this, _challengeReason_initializers, void 0));
            this.challengeDate = (__runInitializers(this, _challengeReason_extraInitializers), __runInitializers(this, _challengeDate_initializers, void 0));
            this.resolvedBy = (__runInitializers(this, _challengeDate_extraInitializers), __runInitializers(this, _resolvedBy_initializers, void 0));
            this.resolution = (__runInitializers(this, _resolvedBy_extraInitializers), __runInitializers(this, _resolution_initializers, void 0));
            this.resolutionDate = (__runInitializers(this, _resolution_extraInitializers), __runInitializers(this, _resolutionDate_initializers, void 0));
            this.metadata = (__runInitializers(this, _resolutionDate_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            this.privilegeTag = (__runInitializers(this, _deletedAt_extraInitializers), __runInitializers(this, _privilegeTag_initializers, void 0));
            __runInitializers(this, _privilegeTag_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "PrivilegeAssertion");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier for assertion' })];
        _privilegeTagId_decorators = [(0, sequelize_typescript_1.ForeignKey)(() => PrivilegeTag), (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'privilege_tag_id',
            }), (0, swagger_1.ApiProperty)({ description: 'Associated privilege tag' })];
        _assertedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'asserted_by',
            }), (0, swagger_1.ApiProperty)({ description: 'User asserting privilege' })];
        _assertionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'assertion_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date of assertion' })];
        _rationale_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ description: 'Detailed rationale for assertion' })];
        _supportingAuthority_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'supporting_authority',
            }), (0, swagger_1.ApiProperty)({ description: 'Legal authority supporting claim' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(PrivilegeAssertionStatus)),
                allowNull: false,
                defaultValue: PrivilegeAssertionStatus.PENDING_REVIEW,
            }), (0, swagger_1.ApiProperty)({ enum: PrivilegeAssertionStatus, description: 'Assertion status' })];
        _challengedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'challenged_by',
            }), (0, swagger_1.ApiProperty)({ description: 'User challenging the assertion' })];
        _challengeReason_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'challenge_reason',
            }), (0, swagger_1.ApiProperty)({ description: 'Reason for challenge' })];
        _challengeDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'challenge_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date of challenge' })];
        _resolvedBy_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: true,
                field: 'resolved_by',
            }), (0, swagger_1.ApiProperty)({ description: 'User resolving dispute' })];
        _resolution_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Resolution details' })];
        _resolutionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'resolution_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date of resolution' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)({ field: 'deleted_at' })];
        _privilegeTag_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => PrivilegeTag)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _privilegeTagId_decorators, { kind: "field", name: "privilegeTagId", static: false, private: false, access: { has: obj => "privilegeTagId" in obj, get: obj => obj.privilegeTagId, set: (obj, value) => { obj.privilegeTagId = value; } }, metadata: _metadata }, _privilegeTagId_initializers, _privilegeTagId_extraInitializers);
        __esDecorate(null, null, _assertedBy_decorators, { kind: "field", name: "assertedBy", static: false, private: false, access: { has: obj => "assertedBy" in obj, get: obj => obj.assertedBy, set: (obj, value) => { obj.assertedBy = value; } }, metadata: _metadata }, _assertedBy_initializers, _assertedBy_extraInitializers);
        __esDecorate(null, null, _assertionDate_decorators, { kind: "field", name: "assertionDate", static: false, private: false, access: { has: obj => "assertionDate" in obj, get: obj => obj.assertionDate, set: (obj, value) => { obj.assertionDate = value; } }, metadata: _metadata }, _assertionDate_initializers, _assertionDate_extraInitializers);
        __esDecorate(null, null, _rationale_decorators, { kind: "field", name: "rationale", static: false, private: false, access: { has: obj => "rationale" in obj, get: obj => obj.rationale, set: (obj, value) => { obj.rationale = value; } }, metadata: _metadata }, _rationale_initializers, _rationale_extraInitializers);
        __esDecorate(null, null, _supportingAuthority_decorators, { kind: "field", name: "supportingAuthority", static: false, private: false, access: { has: obj => "supportingAuthority" in obj, get: obj => obj.supportingAuthority, set: (obj, value) => { obj.supportingAuthority = value; } }, metadata: _metadata }, _supportingAuthority_initializers, _supportingAuthority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _challengedBy_decorators, { kind: "field", name: "challengedBy", static: false, private: false, access: { has: obj => "challengedBy" in obj, get: obj => obj.challengedBy, set: (obj, value) => { obj.challengedBy = value; } }, metadata: _metadata }, _challengedBy_initializers, _challengedBy_extraInitializers);
        __esDecorate(null, null, _challengeReason_decorators, { kind: "field", name: "challengeReason", static: false, private: false, access: { has: obj => "challengeReason" in obj, get: obj => obj.challengeReason, set: (obj, value) => { obj.challengeReason = value; } }, metadata: _metadata }, _challengeReason_initializers, _challengeReason_extraInitializers);
        __esDecorate(null, null, _challengeDate_decorators, { kind: "field", name: "challengeDate", static: false, private: false, access: { has: obj => "challengeDate" in obj, get: obj => obj.challengeDate, set: (obj, value) => { obj.challengeDate = value; } }, metadata: _metadata }, _challengeDate_initializers, _challengeDate_extraInitializers);
        __esDecorate(null, null, _resolvedBy_decorators, { kind: "field", name: "resolvedBy", static: false, private: false, access: { has: obj => "resolvedBy" in obj, get: obj => obj.resolvedBy, set: (obj, value) => { obj.resolvedBy = value; } }, metadata: _metadata }, _resolvedBy_initializers, _resolvedBy_extraInitializers);
        __esDecorate(null, null, _resolution_decorators, { kind: "field", name: "resolution", static: false, private: false, access: { has: obj => "resolution" in obj, get: obj => obj.resolution, set: (obj, value) => { obj.resolution = value; } }, metadata: _metadata }, _resolution_initializers, _resolution_extraInitializers);
        __esDecorate(null, null, _resolutionDate_decorators, { kind: "field", name: "resolutionDate", static: false, private: false, access: { has: obj => "resolutionDate" in obj, get: obj => obj.resolutionDate, set: (obj, value) => { obj.resolutionDate = value; } }, metadata: _metadata }, _resolutionDate_initializers, _resolutionDate_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, null, _privilegeTag_decorators, { kind: "field", name: "privilegeTag", static: false, private: false, access: { has: obj => "privilegeTag" in obj, get: obj => obj.privilegeTag, set: (obj, value) => { obj.privilegeTag = value; } }, metadata: _metadata }, _privilegeTag_initializers, _privilegeTag_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrivilegeAssertion = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrivilegeAssertion = _classThis;
})();
exports.PrivilegeAssertion = PrivilegeAssertion;
/**
 * Clawback Request Model - Tracks inadvertent disclosure and clawback
 */
let ClawbackRequest = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({
            tableName: 'clawback_requests',
            timestamps: true,
            paranoid: true,
            indexes: [
                { fields: ['document_id'] },
                { fields: ['status'] },
                { fields: ['disclosure_date'] },
                { fields: ['recipient_party'] },
                { fields: ['severity'] },
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _documentId_decorators;
    let _documentId_initializers = [];
    let _documentId_extraInitializers = [];
    let _disclosureDate_decorators;
    let _disclosureDate_initializers = [];
    let _disclosureDate_extraInitializers = [];
    let _detectionDate_decorators;
    let _detectionDate_initializers = [];
    let _detectionDate_extraInitializers = [];
    let _recipientParty_decorators;
    let _recipientParty_initializers = [];
    let _recipientParty_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _requestedAction_decorators;
    let _requestedAction_initializers = [];
    let _requestedAction_extraInitializers = [];
    let _legalBasis_decorators;
    let _legalBasis_initializers = [];
    let _legalBasis_extraInitializers = [];
    let _noticeSentDate_decorators;
    let _noticeSentDate_initializers = [];
    let _noticeSentDate_extraInitializers = [];
    let _deadlineDate_decorators;
    let _deadlineDate_initializers = [];
    let _deadlineDate_extraInitializers = [];
    let _recipientResponse_decorators;
    let _recipientResponse_initializers = [];
    let _recipientResponse_extraInitializers = [];
    let _responseDate_decorators;
    let _responseDate_initializers = [];
    let _responseDate_extraInitializers = [];
    let _complianceDate_decorators;
    let _complianceDate_initializers = [];
    let _complianceDate_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
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
    var ClawbackRequest = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.documentId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _documentId_initializers, void 0));
            this.disclosureDate = (__runInitializers(this, _documentId_extraInitializers), __runInitializers(this, _disclosureDate_initializers, void 0));
            this.detectionDate = (__runInitializers(this, _disclosureDate_extraInitializers), __runInitializers(this, _detectionDate_initializers, void 0));
            this.recipientParty = (__runInitializers(this, _detectionDate_extraInitializers), __runInitializers(this, _recipientParty_initializers, void 0));
            this.severity = (__runInitializers(this, _recipientParty_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.status = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.requestedAction = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _requestedAction_initializers, void 0));
            this.legalBasis = (__runInitializers(this, _requestedAction_extraInitializers), __runInitializers(this, _legalBasis_initializers, void 0));
            this.noticeSentDate = (__runInitializers(this, _legalBasis_extraInitializers), __runInitializers(this, _noticeSentDate_initializers, void 0));
            this.deadlineDate = (__runInitializers(this, _noticeSentDate_extraInitializers), __runInitializers(this, _deadlineDate_initializers, void 0));
            this.recipientResponse = (__runInitializers(this, _deadlineDate_extraInitializers), __runInitializers(this, _recipientResponse_initializers, void 0));
            this.responseDate = (__runInitializers(this, _recipientResponse_extraInitializers), __runInitializers(this, _responseDate_initializers, void 0));
            this.complianceDate = (__runInitializers(this, _responseDate_extraInitializers), __runInitializers(this, _complianceDate_initializers, void 0));
            this.notes = (__runInitializers(this, _complianceDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ClawbackRequest");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [sequelize_typescript_1.PrimaryKey, (0, sequelize_typescript_1.Default)(sequelize_typescript_1.DataType.UUIDV4), (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID), (0, swagger_1.ApiProperty)({ description: 'Unique identifier for clawback request' })];
        _documentId_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.UUID,
                allowNull: false,
                field: 'document_id',
            }), (0, swagger_1.ApiProperty)({ description: 'Inadvertently disclosed document' })];
        _disclosureDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'disclosure_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date of inadvertent disclosure' })];
        _detectionDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: false,
                field: 'detection_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date disclosure was detected' })];
        _recipientParty_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.STRING(500),
                allowNull: false,
                field: 'recipient_party',
            }), (0, swagger_1.ApiProperty)({ description: 'Party who received the document' })];
        _severity_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(DisclosureSeverity)),
                allowNull: false,
            }), (0, swagger_1.ApiProperty)({ enum: DisclosureSeverity, description: 'Severity of disclosure' })];
        _status_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(ClawbackStatus)),
                allowNull: false,
                defaultValue: ClawbackStatus.DETECTED,
            }), (0, swagger_1.ApiProperty)({ enum: ClawbackStatus, description: 'Clawback request status' })];
        _requestedAction_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM('return', 'destroy', 'both'),
                allowNull: false,
                field: 'requested_action',
            }), (0, swagger_1.ApiProperty)({ description: 'Action requested (return/destroy/both)' })];
        _legalBasis_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: false,
                field: 'legal_basis',
            }), (0, swagger_1.ApiProperty)({ description: 'Legal basis for clawback' })];
        _noticeSentDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'notice_sent_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date clawback notice was sent' })];
        _deadlineDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'deadline_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Deadline for compliance' })];
        _recipientResponse_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
                field: 'recipient_response',
            }), (0, swagger_1.ApiProperty)({ description: 'Response from recipient' })];
        _responseDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'response_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date of recipient response' })];
        _complianceDate_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.DATE,
                allowNull: true,
                field: 'compliance_date',
            }), (0, swagger_1.ApiProperty)({ description: 'Date recipient complied' })];
        _notes_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.TEXT,
                allowNull: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Additional notes' })];
        _metadata_decorators = [(0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.JSONB,
                allowNull: true,
            }), (0, swagger_1.ApiProperty)({ description: 'Additional metadata' })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt, (0, sequelize_typescript_1.Column)({ field: 'created_at' })];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt, (0, sequelize_typescript_1.Column)({ field: 'updated_at' })];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt, (0, sequelize_typescript_1.Column)({ field: 'deleted_at' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _documentId_decorators, { kind: "field", name: "documentId", static: false, private: false, access: { has: obj => "documentId" in obj, get: obj => obj.documentId, set: (obj, value) => { obj.documentId = value; } }, metadata: _metadata }, _documentId_initializers, _documentId_extraInitializers);
        __esDecorate(null, null, _disclosureDate_decorators, { kind: "field", name: "disclosureDate", static: false, private: false, access: { has: obj => "disclosureDate" in obj, get: obj => obj.disclosureDate, set: (obj, value) => { obj.disclosureDate = value; } }, metadata: _metadata }, _disclosureDate_initializers, _disclosureDate_extraInitializers);
        __esDecorate(null, null, _detectionDate_decorators, { kind: "field", name: "detectionDate", static: false, private: false, access: { has: obj => "detectionDate" in obj, get: obj => obj.detectionDate, set: (obj, value) => { obj.detectionDate = value; } }, metadata: _metadata }, _detectionDate_initializers, _detectionDate_extraInitializers);
        __esDecorate(null, null, _recipientParty_decorators, { kind: "field", name: "recipientParty", static: false, private: false, access: { has: obj => "recipientParty" in obj, get: obj => obj.recipientParty, set: (obj, value) => { obj.recipientParty = value; } }, metadata: _metadata }, _recipientParty_initializers, _recipientParty_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _requestedAction_decorators, { kind: "field", name: "requestedAction", static: false, private: false, access: { has: obj => "requestedAction" in obj, get: obj => obj.requestedAction, set: (obj, value) => { obj.requestedAction = value; } }, metadata: _metadata }, _requestedAction_initializers, _requestedAction_extraInitializers);
        __esDecorate(null, null, _legalBasis_decorators, { kind: "field", name: "legalBasis", static: false, private: false, access: { has: obj => "legalBasis" in obj, get: obj => obj.legalBasis, set: (obj, value) => { obj.legalBasis = value; } }, metadata: _metadata }, _legalBasis_initializers, _legalBasis_extraInitializers);
        __esDecorate(null, null, _noticeSentDate_decorators, { kind: "field", name: "noticeSentDate", static: false, private: false, access: { has: obj => "noticeSentDate" in obj, get: obj => obj.noticeSentDate, set: (obj, value) => { obj.noticeSentDate = value; } }, metadata: _metadata }, _noticeSentDate_initializers, _noticeSentDate_extraInitializers);
        __esDecorate(null, null, _deadlineDate_decorators, { kind: "field", name: "deadlineDate", static: false, private: false, access: { has: obj => "deadlineDate" in obj, get: obj => obj.deadlineDate, set: (obj, value) => { obj.deadlineDate = value; } }, metadata: _metadata }, _deadlineDate_initializers, _deadlineDate_extraInitializers);
        __esDecorate(null, null, _recipientResponse_decorators, { kind: "field", name: "recipientResponse", static: false, private: false, access: { has: obj => "recipientResponse" in obj, get: obj => obj.recipientResponse, set: (obj, value) => { obj.recipientResponse = value; } }, metadata: _metadata }, _recipientResponse_initializers, _recipientResponse_extraInitializers);
        __esDecorate(null, null, _responseDate_decorators, { kind: "field", name: "responseDate", static: false, private: false, access: { has: obj => "responseDate" in obj, get: obj => obj.responseDate, set: (obj, value) => { obj.responseDate = value; } }, metadata: _metadata }, _responseDate_initializers, _responseDate_extraInitializers);
        __esDecorate(null, null, _complianceDate_decorators, { kind: "field", name: "complianceDate", static: false, private: false, access: { has: obj => "complianceDate" in obj, get: obj => obj.complianceDate, set: (obj, value) => { obj.complianceDate = value; } }, metadata: _metadata }, _complianceDate_initializers, _complianceDate_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClawbackRequest = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClawbackRequest = _classThis;
})();
exports.ClawbackRequest = ClawbackRequest;
// ============================================================================
// PRIVILEGE TAGGING FUNCTIONS (8)
// ============================================================================
/**
 * Function 1: Create Privilege Tag
 * Tags a document with privilege designation
 */
async function createPrivilegeTag(data, transaction) {
    try {
        // Validate input
        const validated = exports.PrivilegeTagSchema.parse({
            ...data,
            dateAsserted: data.dateAsserted || new Date(),
        });
        // Create privilege tag
        const tag = await PrivilegeTag.create({
            documentId: validated.documentId,
            privilegeType: validated.privilegeType,
            privilegeBasis: validated.privilegeBasis,
            assertionReason: validated.assertionReason,
            confidentialityLevel: validated.confidentialityLevel,
            reviewerId: validated.reviewerId,
            dateAsserted: validated.dateAsserted,
            assertionStatus: PrivilegeAssertionStatus.PENDING_REVIEW,
            notes: data.notes,
            metadata: data.metadata,
        }, { transaction });
        return tag;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException('Failed to create privilege tag');
    }
}
/**
 * Function 2: Update Privilege Tag
 * Modifies an existing privilege classification
 */
async function updatePrivilegeTag(tagId, updates, transaction) {
    try {
        const tag = await PrivilegeTag.findByPk(tagId, { transaction });
        if (!tag) {
            throw new common_1.NotFoundException('Privilege tag not found');
        }
        // Update fields
        await tag.update(updates, { transaction });
        return tag;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to update privilege tag');
    }
}
/**
 * Function 3: Batch Tag Documents
 * Applies privilege tags to multiple documents at once
 */
async function batchTagDocuments(documentIds, privilegeData, transaction) {
    try {
        if (documentIds.length === 0) {
            throw new common_1.BadRequestException('No documents provided for tagging');
        }
        const tags = [];
        for (const documentId of documentIds) {
            const tag = await createPrivilegeTag({ ...privilegeData, documentId }, transaction);
            tags.push(tag);
        }
        return tags;
    }
    catch (error) {
        if (error instanceof common_1.BadRequestException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to batch tag documents');
    }
}
/**
 * Function 4: Validate Privilege Claim
 * Validates whether a privilege claim is legally sound
 */
async function validatePrivilegeClaim(tagId) {
    try {
        const tag = await PrivilegeTag.findByPk(tagId);
        if (!tag) {
            throw new common_1.NotFoundException('Privilege tag not found');
        }
        const issues = [];
        const recommendations = [];
        // Check assertion reason length
        if (tag.assertionReason.length < 50) {
            issues.push('Assertion reason is too brief');
            recommendations.push('Provide more detailed justification for privilege claim');
        }
        // Check privilege type and basis consistency
        if (tag.privilegeType === PrivilegeType.ATTORNEY_CLIENT &&
            tag.privilegeBasis === PrivilegeBasis.FEDERAL_WORK_PRODUCT) {
            issues.push('Privilege type and basis mismatch');
            recommendations.push('Ensure privilege type matches legal basis');
        }
        // Check confidentiality level appropriateness
        if (tag.privilegeType === PrivilegeType.ATTORNEY_CLIENT &&
            tag.confidentialityLevel === ConfidentialityLevel.INTERNAL) {
            issues.push('Confidentiality level may be too low for attorney-client privilege');
            recommendations.push('Consider elevating to PRIVILEGED or ATTORNEYS_EYES_ONLY');
        }
        // Check for date assertion
        if (!tag.dateAsserted) {
            issues.push('Missing assertion date');
            recommendations.push('Add date when privilege was asserted');
        }
        return {
            valid: issues.length === 0,
            issues,
            recommendations,
        };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to validate privilege claim');
    }
}
/**
 * Function 5: Get Privilege Tags by Document
 * Retrieves all privilege tags for a specific document
 */
async function getPrivilegeTagsByDocument(documentId, includeDeleted = false) {
    try {
        const options = {
            where: { documentId },
            order: [['createdAt', 'DESC']],
        };
        if (includeDeleted) {
            options.paranoid = false;
        }
        const tags = await PrivilegeTag.findAll(options);
        return tags;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to retrieve privilege tags');
    }
}
/**
 * Function 6: Search Privileged Documents
 * Searches for documents by privilege criteria
 */
async function searchPrivilegedDocuments(criteria, limit = 100, offset = 0) {
    try {
        const where = {};
        if (criteria.privilegeType) {
            where['privilegeType'] = criteria.privilegeType;
        }
        if (criteria.privilegeBasis) {
            where['privilegeBasis'] = criteria.privilegeBasis;
        }
        if (criteria.assertionStatus) {
            where['assertionStatus'] = criteria.assertionStatus;
        }
        if (criteria.reviewerId) {
            where['reviewerId'] = criteria.reviewerId;
        }
        if (criteria.dateFrom || criteria.dateTo) {
            where['dateAsserted'] = {};
            if (criteria.dateFrom) {
                where['dateAsserted'][sequelize_1.Op.gte] = criteria.dateFrom;
            }
            if (criteria.dateTo) {
                where['dateAsserted'][sequelize_1.Op.lte] = criteria.dateTo;
            }
        }
        const { rows, count } = await PrivilegeTag.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        return { tags: rows, total: count };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to search privileged documents');
    }
}
/**
 * Function 7: Remove Privilege Tag
 * Removes privilege designation from a document
 */
async function removePrivilegeTag(tagId, reason, removedBy, transaction) {
    try {
        const tag = await PrivilegeTag.findByPk(tagId, { transaction });
        if (!tag) {
            throw new common_1.NotFoundException('Privilege tag not found');
        }
        // Update metadata with removal info
        await tag.update({
            metadata: {
                ...tag.metadata,
                removedBy,
                removalReason: reason,
                removalDate: new Date(),
            },
            assertionStatus: PrivilegeAssertionStatus.WITHDRAWN,
        }, { transaction });
        // Soft delete
        await tag.destroy({ transaction });
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to remove privilege tag');
    }
}
/**
 * Function 8: Bulk Privilege Review
 * Performs mass privilege review with status updates
 */
async function bulkPrivilegeReview(tagIds, newStatus, reviewerId, notes, transaction) {
    try {
        const failed = [];
        let updated = 0;
        for (const tagId of tagIds) {
            try {
                const tag = await PrivilegeTag.findByPk(tagId, { transaction });
                if (tag) {
                    await tag.update({
                        assertionStatus: newStatus,
                        notes: notes ? `${tag.notes || ''}\n[${new Date().toISOString()}] ${notes}` : tag.notes,
                        metadata: {
                            ...tag.metadata,
                            lastReviewedBy: reviewerId,
                            lastReviewedAt: new Date(),
                        },
                    }, { transaction });
                    updated++;
                }
                else {
                    failed.push(tagId);
                }
            }
            catch (err) {
                failed.push(tagId);
            }
        }
        return { updated, failed };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to perform bulk privilege review');
    }
}
// ============================================================================
// PRIVILEGE LOG GENERATION FUNCTIONS (7)
// ============================================================================
/**
 * Function 9: Generate Privilege Log
 * Creates comprehensive privilege log for matter
 */
async function generatePrivilegeLog(matterId, options) {
    try {
        const logs = await PrivilegeLog.findAll({
            where: { matterId },
            order: [
                options?.sortBy === 'type' ? ['privilegeType', 'ASC'] :
                    options?.sortBy === 'identifier' ? ['documentIdentifier', 'ASC'] :
                        ['documentDate', 'DESC']
            ],
        });
        return logs;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to generate privilege log');
    }
}
/**
 * Function 10: Add Privilege Log Entry
 * Adds a single entry to the privilege log
 */
async function addPrivilegeLogEntry(data, transaction) {
    try {
        const validated = exports.PrivilegeLogEntrySchema.parse({
            documentIdentifier: data.documentIdentifier,
            documentDate: data.documentDate,
            author: data.author,
            recipients: data.recipients,
            privilegeType: data.privilegeType,
            description: data.description,
            basisForClaim: data.basisForClaim,
            ccRecipients: data.ccRecipients,
        });
        const entry = await PrivilegeLog.create({
            matterId: data.matterId,
            documentIdentifier: validated.documentIdentifier,
            documentDate: validated.documentDate,
            author: validated.author,
            recipients: validated.recipients,
            ccRecipients: validated.ccRecipients,
            privilegeType: validated.privilegeType,
            description: validated.description,
            basisForClaim: validated.basisForClaim,
            subjectMatter: data.subjectMatter,
            pageCount: data.pageCount,
            metadata: data.metadata,
        }, { transaction });
        return entry;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException('Failed to add privilege log entry');
    }
}
/**
 * Function 11: Format Privilege Log Export
 * Formats privilege log for export in various formats
 */
async function formatPrivilegeLogExport(matterId, format = PrivilegeLogFormat.STANDARD, options) {
    try {
        const logs = await generatePrivilegeLog(matterId, options);
        if (format === PrivilegeLogFormat.STANDARD || format === PrivilegeLogFormat.HTML) {
            // Generate HTML table
            let html = `
        <html>
          <head>
            <style>
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #4CAF50; color: white; }
            </style>
          </head>
          <body>
            <h1>Privilege Log - Matter ${matterId}</h1>
            <table>
              <thead>
                <tr>
                  <th>Doc ID</th>
                  <th>Date</th>
                  <th>Author</th>
                  <th>Recipients</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Basis</th>
                </tr>
              </thead>
              <tbody>
      `;
            for (const log of logs) {
                const description = options?.redactSensitiveInfo
                    ? log.description.substring(0, 100) + '...'
                    : log.description;
                html += `
          <tr>
            <td>${log.documentIdentifier}</td>
            <td>${format(new Date(log.documentDate), 'yyyy-MM-dd')}</td>
            <td>${log.author}</td>
            <td>${log.recipients.join(', ')}</td>
            <td>${log.privilegeType}</td>
            <td>${description}</td>
            <td>${log.basisForClaim}</td>
          </tr>
        `;
            }
            html += `
              </tbody>
            </table>
          </body>
        </html>
      `;
            return html;
        }
        // Default to CSV format
        let csv = 'Document ID,Date,Author,Recipients,CC Recipients,Privilege Type,Description,Basis\n';
        for (const log of logs) {
            const description = options?.redactSensitiveInfo
                ? log.description.substring(0, 100)
                : log.description;
            csv += `"${log.documentIdentifier}","${format(new Date(log.documentDate), 'yyyy-MM-dd')}","${log.author}","${log.recipients.join('; ')}","${log.ccRecipients?.join('; ') || ''}","${log.privilegeType}","${description}","${log.basisForClaim}"\n`;
        }
        return csv;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to format privilege log export');
    }
}
/**
 * Function 12: Validate Privilege Log Completeness
 * Checks privilege log for missing or incomplete entries
 */
async function validatePrivilegeLogCompleteness(matterId) {
    try {
        const logs = await PrivilegeLog.findAll({ where: { matterId } });
        const issues = [];
        const missingFields = [];
        for (const log of logs) {
            const fields = [];
            if (!log.documentIdentifier)
                fields.push('documentIdentifier');
            if (!log.documentDate)
                fields.push('documentDate');
            if (!log.author)
                fields.push('author');
            if (!log.recipients || log.recipients.length === 0)
                fields.push('recipients');
            if (!log.privilegeType)
                fields.push('privilegeType');
            if (!log.description || log.description.length < 20)
                fields.push('description');
            if (!log.basisForClaim)
                fields.push('basisForClaim');
            if (fields.length > 0) {
                missingFields.push({ entryId: log.id, fields });
                issues.push(`Entry ${log.documentIdentifier} is missing: ${fields.join(', ')}`);
            }
        }
        return {
            complete: issues.length === 0,
            issues,
            missingFields,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to validate privilege log completeness');
    }
}
/**
 * Function 13: Group Privilege Log by Type
 * Organizes privilege log entries by privilege type
 */
async function groupPrivilegeLogByType(matterId) {
    try {
        const logs = await PrivilegeLog.findAll({
            where: { matterId },
            order: [['documentDate', 'DESC']],
        });
        const grouped = new Map();
        for (const log of logs) {
            if (!grouped.has(log.privilegeType)) {
                grouped.set(log.privilegeType, []);
            }
            grouped.get(log.privilegeType).push(log);
        }
        return grouped;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to group privilege log by type');
    }
}
/**
 * Function 14: Redact Privilege Log Information
 * Redacts sensitive information from privilege log
 */
async function redactPrivilegeLogInfo(logId, redactionLevel) {
    try {
        const log = await PrivilegeLog.findByPk(logId);
        if (!log) {
            throw new common_1.NotFoundException('Privilege log entry not found');
        }
        const redacted = {
            id: log.id,
            documentIdentifier: log.documentIdentifier,
            privilegeType: log.privilegeType,
        };
        if (redactionLevel === 'minimal') {
            redacted.documentDate = log.documentDate;
            redacted.author = log.author.split(' ')[0] + ' [REDACTED]';
            redacted.recipients = log.recipients.map((r) => r.split(' ')[0] + ' [REDACTED]');
            redacted.description = log.description.substring(0, 50) + '... [REDACTED]';
            redacted.basisForClaim = log.basisForClaim;
        }
        else if (redactionLevel === 'moderate') {
            redacted.documentDate = log.documentDate;
            redacted.description = 'Communication regarding privileged matter [REDACTED]';
            redacted.basisForClaim = log.basisForClaim;
        }
        else {
            redacted.description = '[FULLY REDACTED - PRIVILEGED]';
        }
        return redacted;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to redact privilege log information');
    }
}
/**
 * Function 15: Update Privilege Log Entry
 * Modifies an existing privilege log entry
 */
async function updatePrivilegeLogEntry(logId, updates, transaction) {
    try {
        const log = await PrivilegeLog.findByPk(logId, { transaction });
        if (!log) {
            throw new common_1.NotFoundException('Privilege log entry not found');
        }
        await log.update(updates, { transaction });
        return log;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to update privilege log entry');
    }
}
// ============================================================================
// CLAWBACK AND INADVERTENT DISCLOSURE FUNCTIONS (6)
// ============================================================================
/**
 * Function 16: Create Clawback Request
 * Initiates a clawback request for inadvertently disclosed document
 */
async function createClawbackRequest(data, transaction) {
    try {
        const validated = exports.ClawbackRequestSchema.parse({
            documentId: data.documentId,
            disclosureDate: data.disclosureDate,
            detectionDate: data.detectionDate,
            recipientParty: data.recipientParty,
            disclosureSeverity: data.severity,
            requestedAction: data.requestedAction,
            legalBasis: data.legalBasis,
            deadlineDate: data.deadlineDate,
        });
        const request = await ClawbackRequest.create({
            documentId: validated.documentId,
            disclosureDate: validated.disclosureDate,
            detectionDate: validated.detectionDate,
            recipientParty: validated.recipientParty,
            severity: validated.disclosureSeverity,
            status: ClawbackStatus.DETECTED,
            requestedAction: validated.requestedAction,
            legalBasis: validated.legalBasis,
            deadlineDate: validated.deadlineDate,
            notes: data.notes,
        }, { transaction });
        return request;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException('Failed to create clawback request');
    }
}
/**
 * Function 17: Process Inadvertent Disclosure
 * Handles discovery of inadvertent privileged disclosure
 */
async function processInadvertentDisclosure(documentId, disclosureDetails, transaction) {
    try {
        // Determine severity based on privilege tags
        const tags = await getPrivilegeTagsByDocument(documentId);
        let severity = DisclosureSeverity.LOW;
        const recommendedActions = [];
        if (tags.length === 0) {
            severity = DisclosureSeverity.LOW;
            recommendedActions.push('Verify if document is actually privileged');
        }
        else {
            const hasAttorneyClient = tags.some((t) => t.privilegeType === PrivilegeType.ATTORNEY_CLIENT);
            const hasWorkProduct = tags.some((t) => t.privilegeType === PrivilegeType.WORK_PRODUCT);
            if (hasAttorneyClient) {
                severity = DisclosureSeverity.CRITICAL;
                recommendedActions.push('Immediate clawback notice required');
                recommendedActions.push('Notify senior counsel and client');
                recommendedActions.push('Document preservation notice to recipient');
            }
            else if (hasWorkProduct) {
                severity = DisclosureSeverity.HIGH;
                recommendedActions.push('Send clawback notice within 48 hours');
                recommendedActions.push('Assess potential waiver implications');
            }
            else {
                severity = DisclosureSeverity.MEDIUM;
                recommendedActions.push('Review disclosure with counsel');
            }
        }
        recommendedActions.push('Update privilege log with disclosure notation');
        recommendedActions.push('Create audit trail of disclosure and response');
        // Create clawback request
        const clawbackRequest = await createClawbackRequest({
            documentId,
            disclosureDate: disclosureDetails.disclosureDate,
            detectionDate: new Date(),
            recipientParty: disclosureDetails.recipientParty,
            severity,
            requestedAction: severity === DisclosureSeverity.CRITICAL ? 'both' : 'return',
            legalBasis: tags.length > 0 ? tags[0].assertionReason : 'Privileged communication',
            deadlineDate: (0, date_fns_1.addDays)(new Date(), severity === DisclosureSeverity.CRITICAL ? 2 : 5),
            notes: `Discovered by ${disclosureDetails.discoveredBy} via ${disclosureDetails.disclosureMethod}`,
        }, transaction);
        return {
            clawbackRequest,
            severity,
            recommendedActions,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to process inadvertent disclosure');
    }
}
/**
 * Function 18: Validate Clawback Timeliness
 * Checks if clawback request was made within reasonable time
 */
async function validateClawbackTimeliness(requestId) {
    try {
        const request = await ClawbackRequest.findByPk(requestId);
        if (!request) {
            throw new common_1.NotFoundException('Clawback request not found');
        }
        const daysElapsed = (0, date_fns_1.differenceInDays)(request.detectionDate, request.disclosureDate);
        const noticeDelay = request.noticeSentDate
            ? (0, date_fns_1.differenceInDays)(request.noticeSentDate, request.detectionDate)
            : null;
        let timely = true;
        let assessment = '';
        // FRE 502(b) factors: promptness of measures taken
        if (daysElapsed > 30) {
            timely = false;
            assessment = 'Significant delay between disclosure and detection may impact waiver analysis';
        }
        else if (daysElapsed > 7) {
            assessment = 'Moderate delay - should document reasons for detection timeline';
        }
        else {
            assessment = 'Timely detection of inadvertent disclosure';
        }
        if (noticeDelay !== null) {
            if (noticeDelay > 5) {
                timely = false;
                assessment += '. Delay in sending notice may suggest lack of reasonable measures to prevent disclosure';
            }
            else if (noticeDelay > 2) {
                assessment += '. Notice sent with moderate delay - document reasons';
            }
            else {
                assessment += '. Prompt notice sent after detection';
            }
        }
        return {
            timely,
            daysElapsed,
            assessment,
        };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to validate clawback timeliness');
    }
}
/**
 * Function 19: Generate Clawback Notice
 * Creates formal clawback notice letter
 */
async function generateClawbackNotice(requestId, additionalTerms) {
    try {
        const request = await ClawbackRequest.findByPk(requestId);
        if (!request) {
            throw new common_1.NotFoundException('Clawback request not found');
        }
        const noticeDate = (0, date_fns_1.format)(new Date(), 'MMMM dd, yyyy');
        const deadline = request.deadlineDate
            ? (0, date_fns_1.format)(new Date(request.deadlineDate), 'MMMM dd, yyyy')
            : (0, date_fns_1.format)((0, date_fns_1.addDays)(new Date(), 5), 'MMMM dd, yyyy');
        let notice = `
RE: Notice of Inadvertent Production and Request for Return/Destruction of Privileged Materials

Date: ${noticeDate}

To: ${request.recipientParty}

Dear Counsel:

This letter serves as formal notice that privileged and confidential materials were inadvertently
disclosed to your office on or about ${(0, date_fns_1.format)(new Date(request.disclosureDate), 'MMMM dd, yyyy')}.

IDENTIFICATION OF MATERIALS:
Document ID: ${request.documentId}

LEGAL BASIS:
${request.legalBasis}

The disclosure of these materials was inadvertent and does not constitute a waiver of the attorney-client
privilege, work product protection, or any other applicable privilege. We took reasonable steps to prevent
disclosure and are taking prompt action to rectify this inadvertent production.

Pursuant to Federal Rule of Evidence 502(b) and applicable state law, we hereby request that you:
`;
        if (request.requestedAction === 'return' || request.requestedAction === 'both') {
            notice += `\n1. Immediately return all copies of the privileged materials to our office;`;
        }
        if (request.requestedAction === 'destroy' || request.requestedAction === 'both') {
            notice += `\n2. Destroy all copies of the privileged materials in your possession;`;
        }
        notice += `
3. Confirm in writing that you have not reviewed, used, or disclosed the contents of these materials;
4. Confirm that no copies have been made or retained in any form;
5. Take all necessary steps to ensure the privileged materials are not used or disclosed.

Please provide written confirmation of your compliance with this request by ${deadline}.
`;
        if (additionalTerms && additionalTerms.length > 0) {
            notice += `\nADDITIONAL TERMS:\n${additionalTerms.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n`;
        }
        notice += `
We reserve all rights with respect to these privileged materials and this inadvertent disclosure does
not constitute a waiver of any privilege or protection.

Please contact us immediately if you have any questions regarding this matter.

Sincerely,
[Counsel Name]
`;
        return notice;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to generate clawback notice');
    }
}
/**
 * Function 20: Track Clawback Compliance
 * Monitors recipient compliance with clawback request
 */
async function trackClawbackCompliance(requestId, transaction) {
    try {
        const request = await ClawbackRequest.findByPk(requestId, { transaction });
        if (!request) {
            throw new common_1.NotFoundException('Clawback request not found');
        }
        const now = new Date();
        const daysUntilDeadline = request.deadlineDate
            ? (0, date_fns_1.differenceInDays)(request.deadlineDate, now)
            : 0;
        const overdue = daysUntilDeadline < 0;
        const compliant = request.status === ClawbackStatus.DOCUMENTS_RETURNED ||
            request.status === ClawbackStatus.DOCUMENTS_DESTROYED ||
            request.status === ClawbackStatus.RESOLVED;
        const followUpActions = [];
        if (!compliant && overdue) {
            followUpActions.push('Send follow-up notice immediately');
            followUpActions.push('Consider motion to compel return of privileged materials');
            followUpActions.push('Escalate to senior counsel');
        }
        else if (!compliant && daysUntilDeadline <= 2) {
            followUpActions.push('Send reminder notice');
            followUpActions.push('Prepare for potential motion practice');
        }
        else if (request.status === ClawbackStatus.REFUSED) {
            followUpActions.push('Evaluate motion for protective order');
            followUpActions.push('Document waiver analysis under FRE 502');
        }
        if (request.status === ClawbackStatus.RECIPIENT_ACKNOWLEDGED) {
            followUpActions.push('Request confirmation of return/destruction');
        }
        return {
            status: request.status,
            compliant,
            overdue,
            daysUntilDeadline,
            followUpActions,
        };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to track clawback compliance');
    }
}
/**
 * Function 21: Close Clawback Request
 * Finalizes clawback request after resolution
 */
async function closeClawbackRequest(requestId, resolution, transaction) {
    try {
        const request = await ClawbackRequest.findByPk(requestId, { transaction });
        if (!request) {
            throw new common_1.NotFoundException('Clawback request not found');
        }
        await request.update({
            status: resolution.status,
            recipientResponse: resolution.recipientResponse,
            complianceDate: resolution.complianceDate || new Date(),
            responseDate: new Date(),
            notes: resolution.notes
                ? `${request.notes || ''}\n[RESOLVED ${new Date().toISOString()}] ${resolution.notes}`
                : request.notes,
        }, { transaction });
        return request;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to close clawback request');
    }
}
// ============================================================================
// PRIVILEGE ASSERTION WORKFLOW FUNCTIONS (8)
// ============================================================================
/**
 * Function 22: Initiate Privilege Assertion
 * Starts formal privilege assertion process
 */
async function initiatePrivilegeAssertion(data, transaction) {
    try {
        const validated = exports.PrivilegeAssertionSchema.parse({
            documentId: data.privilegeTagId,
            privilegeType: PrivilegeType.ATTORNEY_CLIENT,
            assertedBy: data.assertedBy,
            assertionDate: data.assertionDate,
            rationale: data.rationale,
            supportingAuthority: data.supportingAuthority,
            status: PrivilegeAssertionStatus.PENDING_REVIEW,
        });
        const assertion = await PrivilegeAssertion.create({
            privilegeTagId: data.privilegeTagId,
            assertedBy: data.assertedBy,
            assertionDate: data.assertionDate,
            rationale: data.rationale,
            supportingAuthority: data.supportingAuthority,
            status: PrivilegeAssertionStatus.PENDING_REVIEW,
            metadata: data.metadata,
        }, { transaction });
        // Update privilege tag status
        await PrivilegeTag.update({ assertionStatus: PrivilegeAssertionStatus.ASSERTED }, { where: { id: data.privilegeTagId }, transaction });
        return assertion;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new common_1.BadRequestException(`Validation failed: ${error.message}`);
        }
        throw new common_1.InternalServerErrorException('Failed to initiate privilege assertion');
    }
}
/**
 * Function 23: Assign Privilege Reviewer
 * Assigns reviewer to privilege assertion
 */
async function assignPrivilegeReviewer(assertionId, reviewerId, transaction) {
    try {
        const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
        if (!assertion) {
            throw new common_1.NotFoundException('Privilege assertion not found');
        }
        await assertion.update({
            status: PrivilegeAssertionStatus.UNDER_REVIEW,
            metadata: {
                ...assertion.metadata,
                assignedReviewer: reviewerId,
                assignedAt: new Date(),
            },
        }, { transaction });
        return assertion;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to assign privilege reviewer');
    }
}
/**
 * Function 24: Submit Privilege Challenge
 * Challenges an asserted privilege claim
 */
async function submitPrivilegeChallenge(assertionId, challengeData, transaction) {
    try {
        const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
        if (!assertion) {
            throw new common_1.NotFoundException('Privilege assertion not found');
        }
        if (challengeData.challengeReason.length < 50) {
            throw new common_1.BadRequestException('Challenge reason must be at least 50 characters');
        }
        await assertion.update({
            status: PrivilegeAssertionStatus.CHALLENGED,
            challengedBy: challengeData.challengedBy,
            challengeReason: challengeData.challengeReason,
            challengeDate: new Date(),
            metadata: {
                ...assertion.metadata,
                supportingArguments: challengeData.supportingArguments,
            },
        }, { transaction });
        // Update privilege tag status
        await PrivilegeTag.update({ assertionStatus: PrivilegeAssertionStatus.CHALLENGED }, { where: { id: assertion.privilegeTagId }, transaction });
        return assertion;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to submit privilege challenge');
    }
}
/**
 * Function 25: Resolve Privilege Dispute
 * Resolves disputed privilege assertion
 */
async function resolvePrivilegeDispute(assertionId, resolution, transaction) {
    try {
        const assertion = await PrivilegeAssertion.findByPk(assertionId, {
            include: [PrivilegeTag],
            transaction,
        });
        if (!assertion) {
            throw new common_1.NotFoundException('Privilege assertion not found');
        }
        const newStatus = resolution.decision === 'upheld'
            ? PrivilegeAssertionStatus.UPHELD
            : resolution.decision === 'overruled'
                ? PrivilegeAssertionStatus.OVERRULED
                : PrivilegeAssertionStatus.RESOLVED;
        await assertion.update({
            status: newStatus,
            resolvedBy: resolution.resolvedBy,
            resolution: resolution.resolutionDetails,
            resolutionDate: new Date(),
        }, { transaction });
        // Update privilege tag
        if (resolution.decision === 'overruled') {
            await PrivilegeTag.update({ assertionStatus: PrivilegeAssertionStatus.OVERRULED }, { where: { id: assertion.privilegeTagId }, transaction });
        }
        else if (resolution.decision === 'upheld') {
            await PrivilegeTag.update({ assertionStatus: PrivilegeAssertionStatus.UPHELD }, { where: { id: assertion.privilegeTagId }, transaction });
        }
        else if (resolution.modifiedPrivilegeType) {
            await PrivilegeTag.update({
                privilegeType: resolution.modifiedPrivilegeType,
                assertionStatus: PrivilegeAssertionStatus.RESOLVED,
            }, { where: { id: assertion.privilegeTagId }, transaction });
        }
        return assertion;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to resolve privilege dispute');
    }
}
/**
 * Function 26: Escalate Privilege Issue
 * Escalates privilege assertion to senior counsel
 */
async function escalatePrivilegeIssue(assertionId, escalationData, transaction) {
    try {
        const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
        if (!assertion) {
            throw new common_1.NotFoundException('Privilege assertion not found');
        }
        await assertion.update({
            status: PrivilegeAssertionStatus.DISPUTED,
            metadata: {
                ...assertion.metadata,
                escalated: true,
                escalatedBy: escalationData.escalatedBy,
                escalatedTo: escalationData.escalatedTo,
                escalationReason: escalationData.reason,
                escalationUrgency: escalationData.urgency,
                escalatedAt: new Date(),
            },
        }, { transaction });
        return assertion;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to escalate privilege issue');
    }
}
/**
 * Function 27: Document Assertion Rationale
 * Adds detailed rationale to privilege assertion
 */
async function documentAssertionRationale(assertionId, additionalRationale, transaction) {
    try {
        const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
        if (!assertion) {
            throw new common_1.NotFoundException('Privilege assertion not found');
        }
        const enhancedRationale = `
${assertion.rationale}

LEGAL ANALYSIS:
${additionalRationale.legalAnalysis}

FACTUAL BASIS:
${additionalRationale.factualBasis}

${additionalRationale.caseAuthority ? `CASE AUTHORITY:\n${additionalRationale.caseAuthority.join('\n')}` : ''}

${additionalRationale.riskAssessment ? `RISK ASSESSMENT:\n${additionalRationale.riskAssessment}` : ''}
`;
        await assertion.update({
            rationale: enhancedRationale.trim(),
            supportingAuthority: additionalRationale.caseAuthority?.join('; ') || assertion.supportingAuthority,
        }, { transaction });
        return assertion;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to document assertion rationale');
    }
}
/**
 * Function 28: Track Assertion Status
 * Monitors privilege assertion workflow status
 */
async function trackAssertionStatus(assertionId) {
    try {
        const assertion = await PrivilegeAssertion.findByPk(assertionId, {
            include: [PrivilegeTag],
        });
        if (!assertion) {
            throw new common_1.NotFoundException('Privilege assertion not found');
        }
        const timeline = [
            { event: 'Assertion Created', date: assertion.createdAt, actor: assertion.assertedBy },
        ];
        if (assertion.assertionDate) {
            timeline.push({ event: 'Privilege Asserted', date: assertion.assertionDate, actor: assertion.assertedBy });
        }
        if (assertion.challengeDate) {
            timeline.push({ event: 'Assertion Challenged', date: assertion.challengeDate, actor: assertion.challengedBy });
        }
        if (assertion.resolutionDate) {
            timeline.push({ event: 'Dispute Resolved', date: assertion.resolutionDate, actor: assertion.resolvedBy });
        }
        const nextSteps = [];
        switch (assertion.status) {
            case PrivilegeAssertionStatus.PENDING_REVIEW:
                nextSteps.push('Assign reviewer');
                nextSteps.push('Complete initial privilege review');
                break;
            case PrivilegeAssertionStatus.UNDER_REVIEW:
                nextSteps.push('Complete privilege analysis');
                nextSteps.push('Document rationale');
                nextSteps.push('Make assertion determination');
                break;
            case PrivilegeAssertionStatus.CHALLENGED:
                nextSteps.push('Review challenge arguments');
                nextSteps.push('Prepare response');
                nextSteps.push('Escalate if necessary');
                break;
            case PrivilegeAssertionStatus.DISPUTED:
                nextSteps.push('Senior counsel review');
                nextSteps.push('Resolve dispute');
                break;
            case PrivilegeAssertionStatus.UPHELD:
            case PrivilegeAssertionStatus.RESOLVED:
                nextSteps.push('Update privilege log');
                nextSteps.push('Close assertion workflow');
                break;
            case PrivilegeAssertionStatus.OVERRULED:
                nextSteps.push('Remove privilege tag');
                nextSteps.push('Produce document if required');
                break;
        }
        return {
            assertion,
            timeline: timeline.sort((a, b) => a.date.getTime() - b.date.getTime()),
            nextSteps,
        };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to track assertion status');
    }
}
/**
 * Function 29: Finalize Privilege Assertion
 * Completes privilege assertion workflow
 */
async function finalizePrivilegeAssertion(assertionId, finalDecision, transaction) {
    try {
        const assertion = await PrivilegeAssertion.findByPk(assertionId, { transaction });
        if (!assertion) {
            throw new common_1.NotFoundException('Privilege assertion not found');
        }
        await assertion.update({
            status: finalDecision.status,
            metadata: {
                ...assertion.metadata,
                finalizedAt: new Date(),
                finalNotes: finalDecision.finalNotes,
            },
        }, { transaction });
        // Update privilege tag with final status
        await PrivilegeTag.update({ assertionStatus: finalDecision.status }, { where: { id: assertion.privilegeTagId }, transaction });
        return assertion;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to finalize privilege assertion');
    }
}
// ============================================================================
// QUALITY CONTROL FUNCTIONS (6)
// ============================================================================
/**
 * Function 30: Perform Quality Control Sample
 * Conducts QC sampling of privilege review
 */
async function performQualityControlSample(reviewBatchId, sampleSize, reviewerId) {
    try {
        // Get all tags from batch
        const allTags = await PrivilegeTag.findAll({
            where: {
                metadata: {
                    reviewBatchId,
                },
            },
        });
        if (allTags.length === 0) {
            throw new common_1.NotFoundException('No tags found for review batch');
        }
        // Random sampling
        const shuffled = allTags.sort(() => 0.5 - Math.random());
        const sampleTags = shuffled.slice(0, Math.min(sampleSize, allTags.length));
        const reviewInstructions = [
            'Verify privilege type is correctly identified',
            'Confirm privilege basis is appropriate and well-documented',
            'Check assertion reason provides sufficient detail (minimum 50 characters)',
            'Validate confidentiality level matches privilege type',
            'Ensure all required fields are complete',
            'Look for consistency with similar documents',
            'Flag any questionable privilege claims',
            'Document any recommended changes',
        ];
        return {
            sampleTags,
            reviewInstructions,
        };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to perform QC sample');
    }
}
/**
 * Function 31: Validate Privilege Consistency
 * Checks for consistent privilege tagging across similar documents
 */
async function validatePrivilegeConsistency(documentIds) {
    try {
        const inconsistencies = [];
        // Get all tags for documents
        const tags = await PrivilegeTag.findAll({
            where: {
                documentId: { [sequelize_1.Op.in]: documentIds },
            },
        });
        // Group by document
        const tagsByDocument = new Map();
        for (const tag of tags) {
            if (!tagsByDocument.has(tag.documentId)) {
                tagsByDocument.set(tag.documentId, []);
            }
            tagsByDocument.get(tag.documentId).push(tag);
        }
        // Check for documents with multiple conflicting tags
        for (const [documentId, docTags] of tagsByDocument.entries()) {
            if (docTags.length > 1) {
                const privilegeTypes = new Set(docTags.map((t) => t.privilegeType));
                if (privilegeTypes.size > 1) {
                    inconsistencies.push({
                        documentId,
                        issue: `Multiple privilege types assigned: ${Array.from(privilegeTypes).join(', ')}`,
                        recommendation: 'Review and select primary privilege type',
                    });
                }
                const confidentialityLevels = new Set(docTags.map((t) => t.confidentialityLevel));
                if (confidentialityLevels.size > 1) {
                    inconsistencies.push({
                        documentId,
                        issue: `Inconsistent confidentiality levels: ${Array.from(confidentialityLevels).join(', ')}`,
                        recommendation: 'Standardize confidentiality level',
                    });
                }
            }
        }
        // Check for documents without tags
        for (const documentId of documentIds) {
            if (!tagsByDocument.has(documentId)) {
                inconsistencies.push({
                    documentId,
                    issue: 'No privilege tag found',
                    recommendation: 'Review document and add appropriate privilege tag',
                });
            }
        }
        const consistencyScore = Math.max(0, 100 - (inconsistencies.length / documentIds.length) * 100);
        return {
            consistent: inconsistencies.length === 0,
            inconsistencies,
            consistencyScore: Math.round(consistencyScore),
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to validate privilege consistency');
    }
}
/**
 * Function 32: Identify Privilege Gaps
 * Finds documents that may be missing privilege tags
 */
async function identifyPrivilegeGaps(documentIds, criteria) {
    try {
        const potentialGaps = [];
        // Get existing tags
        const existingTags = await PrivilegeTag.findAll({
            where: {
                documentId: { [sequelize_1.Op.in]: documentIds },
            },
        });
        const taggedDocuments = new Set(existingTags.map((t) => t.documentId));
        // Identify untagged documents
        for (const documentId of documentIds) {
            if (!taggedDocuments.has(documentId)) {
                // In a real implementation, you would fetch document metadata
                // and apply pattern matching based on criteria
                potentialGaps.push({
                    documentId,
                    reason: 'Document not tagged - may require privilege review',
                    confidence: 50,
                });
            }
        }
        const reviewRecommendations = [
            'Review documents with attorney involvement',
            'Check for legal advice or strategy discussions',
            'Identify documents created in anticipation of litigation',
            'Flag communications with counsel',
            'Review documents with "Privileged" or "Confidential" markings',
        ];
        return {
            potentialGaps,
            reviewRecommendations,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to identify privilege gaps');
    }
}
/**
 * Function 33: Generate QC Metrics
 * Creates quality control metrics report
 */
async function generateQCMetrics(reviewBatchId, qcResults) {
    try {
        const allTags = await PrivilegeTag.findAll({
            where: {
                metadata: {
                    reviewBatchId,
                },
            },
        });
        const reviewedCount = qcResults.reviewedTags.length;
        const errorsFound = qcResults.errors.length;
        const accuracyRate = reviewedCount > 0
            ? ((reviewedCount - errorsFound) / reviewedCount) * 100
            : 100;
        // Check for missing required tags
        const missingTags = allTags.filter((tag) => !tag.assertionReason || tag.assertionReason.length < 20).length;
        // Check for inconsistent tags
        const inconsistentTags = qcResults.errors.filter((e) => e.errorType === 'inconsistency').length;
        const totalIssues = errorsFound + missingTags + inconsistentTags;
        const consistencyRate = allTags.length > 0
            ? ((allTags.length - totalIssues) / allTags.length) * 100
            : 100;
        const recommendations = qcResults.errors
            .filter((e) => e.severity === 'high')
            .length;
        return {
            totalReviewed: reviewedCount,
            accuracyRate: Math.round(accuracyRate * 100) / 100,
            consistencyRate: Math.round(consistencyRate * 100) / 100,
            errorsFound,
            missingTags,
            inconsistentTags,
            recommendationsCount: recommendations,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to generate QC metrics');
    }
}
/**
 * Function 34: Flag Inconsistent Privilege
 * Flags privilege tags that appear inconsistent
 */
async function flagInconsistentPrivilege(tagId, inconsistencyDetails, transaction) {
    try {
        const tag = await PrivilegeTag.findByPk(tagId, { transaction });
        if (!tag) {
            throw new common_1.NotFoundException('Privilege tag not found');
        }
        await tag.update({
            metadata: {
                ...tag.metadata,
                qcFlag: {
                    flagged: true,
                    flaggedBy: inconsistencyDetails.flaggedBy,
                    flaggedAt: new Date(),
                    issueType: inconsistencyDetails.issueType,
                    description: inconsistencyDetails.description,
                    severity: inconsistencyDetails.severity,
                    suggestedCorrection: inconsistencyDetails.suggestedCorrection,
                },
            },
        }, { transaction });
        return tag;
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to flag inconsistent privilege');
    }
}
/**
 * Function 35: Review Privilege Accuracy
 * Conducts accuracy review of privilege determinations
 */
async function reviewPrivilegeAccuracy(tagIds, reviewerId) {
    try {
        let accurate = 0;
        let inaccurate = 0;
        let needsReview = 0;
        const issues = [];
        for (const tagId of tagIds) {
            const result = await validatePrivilegeClaim(tagId);
            if (result.valid) {
                accurate++;
            }
            else if (result.issues.length > 2) {
                inaccurate++;
                issues.push({
                    tagId,
                    issue: result.issues.join('; '),
                    recommendation: result.recommendations.join('; '),
                });
            }
            else {
                needsReview++;
                issues.push({
                    tagId,
                    issue: result.issues.join('; '),
                    recommendation: result.recommendations.join('; '),
                });
            }
        }
        const totalReviewed = tagIds.length;
        const accuracyRate = totalReviewed > 0
            ? (accurate / totalReviewed) * 100
            : 0;
        return {
            accurate,
            inaccurate,
            needsReview,
            accuracyRate: Math.round(accuracyRate * 100) / 100,
            issues,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to review privilege accuracy');
    }
}
// ============================================================================
// ADDITIONAL UTILITY FUNCTIONS (7)
// ============================================================================
/**
 * Function 36: Generate Privilege Statistics
 * Creates statistical overview of privilege review
 */
async function generatePrivilegeStatistics(matterId, dateRange) {
    try {
        const where = {};
        if (dateRange) {
            where['createdAt'] = {
                [sequelize_1.Op.gte]: dateRange.from,
                [sequelize_1.Op.lte]: dateRange.to,
            };
        }
        const tags = matterId
            ? await PrivilegeTag.findAll({ where })
            : await PrivilegeTag.findAll({ where });
        const byPrivilegeType = {};
        const byConfidentialityLevel = {};
        const byStatus = {};
        for (const tag of tags) {
            byPrivilegeType[tag.privilegeType] = (byPrivilegeType[tag.privilegeType] || 0) + 1;
            byConfidentialityLevel[tag.confidentialityLevel] =
                (byConfidentialityLevel[tag.confidentialityLevel] || 0) + 1;
            byStatus[tag.assertionStatus] = (byStatus[tag.assertionStatus] || 0) + 1;
        }
        const clawbackWhere = {};
        if (dateRange) {
            clawbackWhere['createdAt'] = {
                [sequelize_1.Op.gte]: dateRange.from,
                [sequelize_1.Op.lte]: dateRange.to,
            };
        }
        const totalClawbacks = await ClawbackRequest.count({ where: clawbackWhere });
        const activeClawbacks = await ClawbackRequest.count({
            where: {
                ...clawbackWhere,
                status: {
                    [sequelize_1.Op.in]: [
                        ClawbackStatus.DETECTED,
                        ClawbackStatus.REQUEST_INITIATED,
                        ClawbackStatus.NOTICE_SENT,
                        ClawbackStatus.RECIPIENT_ACKNOWLEDGED,
                    ],
                },
            },
        });
        return {
            totalPrivilegedDocuments: tags.length,
            byPrivilegeType,
            byConfidentialityLevel,
            byStatus,
            totalClawbacks,
            activeClawbacks,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to generate privilege statistics');
    }
}
/**
 * Function 37: Export Privilege Review Data
 * Exports comprehensive privilege review data
 */
async function exportPrivilegeReviewData(matterId, format = 'json') {
    try {
        const tags = await PrivilegeTag.findAll({
            where: {
                metadata: {
                    matterId,
                },
            },
            include: [
                {
                    model: PrivilegeAssertion,
                    as: 'assertions',
                },
            ],
        });
        if (format === 'json') {
            return JSON.stringify(tags, null, 2);
        }
        // CSV format
        let csv = 'Document ID,Privilege Type,Privilege Basis,Assertion Reason,Confidentiality Level,Status,Date Asserted\n';
        for (const tag of tags) {
            csv += `"${tag.documentId}","${tag.privilegeType}","${tag.privilegeBasis}","${tag.assertionReason}","${tag.confidentialityLevel}","${tag.assertionStatus}","${tag.dateAsserted ? format(new Date(tag.dateAsserted), 'yyyy-MM-dd') : ''}"\n`;
        }
        return csv;
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to export privilege review data');
    }
}
/**
 * Function 38: Calculate Privilege Review Progress
 * Calculates review completion percentage
 */
async function calculatePrivilegeReviewProgress(reviewBatchId) {
    try {
        const allTags = await PrivilegeTag.findAll({
            where: {
                metadata: {
                    reviewBatchId,
                },
            },
        });
        const reviewed = allTags.filter((tag) => tag.assertionStatus !== PrivilegeAssertionStatus.PENDING_REVIEW &&
            tag.assertionStatus !== PrivilegeAssertionStatus.UNDER_REVIEW);
        const privileged = allTags.filter((tag) => tag.assertionStatus === PrivilegeAssertionStatus.ASSERTED ||
            tag.assertionStatus === PrivilegeAssertionStatus.UPHELD);
        const pending = allTags.filter((tag) => tag.assertionStatus === PrivilegeAssertionStatus.PENDING_REVIEW ||
            tag.assertionStatus === PrivilegeAssertionStatus.UNDER_REVIEW);
        const totalDocuments = allTags.length;
        const completionPercentage = totalDocuments > 0 ? (reviewed.length / totalDocuments) * 100 : 0;
        return {
            totalDocuments,
            reviewedDocuments: reviewed.length,
            privilegedDocuments: privileged.length,
            nonPrivilegedDocuments: reviewed.length - privileged.length,
            pendingReview: pending.length,
            completionPercentage: Math.round(completionPercentage * 100) / 100,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to calculate privilege review progress');
    }
}
/**
 * Function 39: Detect Privilege Waiver Risks
 * Identifies potential privilege waiver scenarios
 */
async function detectPrivilegeWaiverRisks(documentId) {
    try {
        const tags = await getPrivilegeTagsByDocument(documentId);
        const clawbacks = await ClawbackRequest.findAll({ where: { documentId } });
        const waiverRisks = [];
        // Check for inadvertent disclosure
        if (clawbacks.length > 0) {
            const unresolvedClawbacks = clawbacks.filter((c) => c.status !== ClawbackStatus.DOCUMENTS_RETURNED &&
                c.status !== ClawbackStatus.DOCUMENTS_DESTROYED &&
                c.status !== ClawbackStatus.RESOLVED);
            if (unresolvedClawbacks.length > 0) {
                waiverRisks.push({
                    risk: 'Inadvertent disclosure with unresolved clawback',
                    severity: 'high',
                    mitigation: 'Expedite clawback resolution and document reasonable precautions',
                });
            }
        }
        // Check for multiple privilege types (potential inconsistency)
        if (tags.length > 1) {
            const privilegeTypes = new Set(tags.map((t) => t.privilegeType));
            if (privilegeTypes.size > 1) {
                waiverRisks.push({
                    risk: 'Multiple privilege types may indicate inconsistent treatment',
                    severity: 'medium',
                    mitigation: 'Clarify primary privilege basis and ensure consistent application',
                });
            }
        }
        // Check for challenged assertions
        const challenged = tags.filter((tag) => tag.assertionStatus === PrivilegeAssertionStatus.CHALLENGED ||
            tag.assertionStatus === PrivilegeAssertionStatus.DISPUTED);
        if (challenged.length > 0) {
            waiverRisks.push({
                risk: 'Privilege assertion is being challenged',
                severity: 'high',
                mitigation: 'Strengthen rationale and provide additional legal authority',
            });
        }
        // Determine overall risk level
        const highRisks = waiverRisks.filter((r) => r.severity === 'high').length;
        const mediumRisks = waiverRisks.filter((r) => r.severity === 'medium').length;
        let overallRiskLevel;
        if (highRisks >= 2) {
            overallRiskLevel = 'critical';
        }
        else if (highRisks >= 1) {
            overallRiskLevel = 'high';
        }
        else if (mediumRisks >= 2) {
            overallRiskLevel = 'medium';
        }
        else {
            overallRiskLevel = 'low';
        }
        return {
            waiverRisks,
            overallRiskLevel,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to detect privilege waiver risks');
    }
}
/**
 * Function 40: Generate Privilege Review Report
 * Creates comprehensive privilege review report
 */
async function generatePrivilegeReviewReport(matterId, includeDetails = true) {
    try {
        const stats = await generatePrivilegeStatistics(matterId);
        const assertions = await PrivilegeAssertion.findAll({
            include: [
                {
                    model: PrivilegeTag,
                    required: true,
                    where: {
                        metadata: {
                            matterId,
                        },
                    },
                },
            ],
        });
        const pending = assertions.filter((a) => a.status === PrivilegeAssertionStatus.PENDING_REVIEW).length;
        const challenged = assertions.filter((a) => a.status === PrivilegeAssertionStatus.CHALLENGED ||
            a.status === PrivilegeAssertionStatus.DISPUTED).length;
        const clawbacks = await ClawbackRequest.count();
        const privilegedCount = stats.totalPrivilegedDocuments;
        const totalDocuments = privilegedCount; // In real scenario, would query total doc count
        const privilegeRate = totalDocuments > 0 ? (privilegedCount / totalDocuments) * 100 : 0;
        const summary = {
            totalDocuments,
            privilegedCount,
            privilegeRate: Math.round(privilegeRate * 100) / 100,
            assertionsPending: pending,
            assertionsChallenged: challenged,
            clawbackRequests: clawbacks,
        };
        const recommendations = [];
        if (pending > 0) {
            recommendations.push(`Review and finalize ${pending} pending privilege assertions`);
        }
        if (challenged > 0) {
            recommendations.push(`Address ${challenged} challenged privilege claims`);
        }
        if (clawbacks > 0) {
            recommendations.push('Monitor active clawback requests for timely resolution');
        }
        if (privilegeRate > 50) {
            recommendations.push('High privilege rate - consider second-level review to ensure appropriate assertions');
        }
        if (!includeDetails) {
            return { summary, recommendations };
        }
        const details = {
            privilegeBreakdown: stats.byPrivilegeType,
            qualityMetrics: null,
            topIssues: [],
        };
        if (challenged > 0) {
            details.topIssues.push('Multiple challenged assertions requiring resolution');
        }
        return {
            summary,
            details,
            recommendations,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to generate privilege review report');
    }
}
/**
 * Function 41: Validate FRE 502 Compliance
 * Validates compliance with Federal Rule of Evidence 502
 */
async function validateFRE502Compliance(clawbackRequestId) {
    try {
        const request = await ClawbackRequest.findByPk(clawbackRequestId);
        if (!request) {
            throw new common_1.NotFoundException('Clawback request not found');
        }
        const factors = [];
        // FRE 502(b) factors
        // 1. Reasonableness of precautions
        const precautionsTaken = request.metadata?.precautionsTaken || false;
        factors.push({
            factor: 'Reasonable precautions to prevent disclosure',
            satisfied: precautionsTaken,
            notes: precautionsTaken
                ? 'Document review protocols in place'
                : 'Need to document precautions taken',
        });
        // 2. Promptness of measures to rectify
        const timeliness = await validateClawbackTimeliness(clawbackRequestId);
        factors.push({
            factor: 'Promptness of rectification measures',
            satisfied: timeliness.timely,
            notes: timeliness.assessment,
        });
        // 3. Scope of disclosure
        const scopeLimited = request.metadata?.singleDocument !== false;
        factors.push({
            factor: 'Limited scope of disclosure',
            satisfied: scopeLimited,
            notes: scopeLimited ? 'Single document disclosure' : 'Multiple documents disclosed',
        });
        // 4. Extent of disclosure
        const limitedRecipients = request.recipientParty.split(',').length === 1;
        factors.push({
            factor: 'Limited extent of disclosure',
            satisfied: limitedRecipients,
            notes: limitedRecipients ? 'Single recipient' : 'Multiple recipients',
        });
        // 5. Overriding interests of justice
        factors.push({
            factor: 'No overriding interest of justice favoring waiver',
            satisfied: true,
            notes: 'Standard privilege protection applies',
        });
        const satisfiedCount = factors.filter((f) => f.satisfied).length;
        const compliant = satisfiedCount >= 4; // Majority of factors satisfied
        const recommendation = compliant
            ? 'Disclosure appears to satisfy FRE 502(b) requirements for non-waiver'
            : 'Strengthen documentation of precautions and promptness to support non-waiver argument';
        return {
            compliant,
            factors,
            recommendation,
        };
    }
    catch (error) {
        if (error instanceof common_1.NotFoundException) {
            throw error;
        }
        throw new common_1.InternalServerErrorException('Failed to validate FRE 502 compliance');
    }
}
/**
 * Function 42: Archive Completed Privilege Review
 * Archives completed privilege review with full audit trail
 */
async function archiveCompletedPrivilegeReview(reviewBatchId, archiveMetadata, transaction) {
    try {
        const archiveId = crypto.randomBytes(16).toString('hex');
        // Get all data for archive
        const tags = await PrivilegeTag.findAll({
            where: {
                metadata: {
                    reviewBatchId,
                },
            },
            paranoid: false,
            transaction,
        });
        const assertions = await PrivilegeAssertion.findAll({
            include: [
                {
                    model: PrivilegeTag,
                    required: true,
                    where: {
                        metadata: {
                            reviewBatchId,
                        },
                    },
                },
            ],
            paranoid: false,
            transaction,
        });
        const documentIds = tags.map((t) => t.documentId);
        const clawbacks = await ClawbackRequest.findAll({
            where: {
                documentId: { [sequelize_1.Op.in]: documentIds },
            },
            paranoid: false,
            transaction,
        });
        // Update all records with archive metadata
        for (const tag of tags) {
            await tag.update({
                metadata: {
                    ...tag.metadata,
                    archived: true,
                    archiveId,
                    archivedBy: archiveMetadata.completedBy,
                    archivedAt: new Date(),
                    retentionYears: archiveMetadata.retentionPeriod || 7,
                },
            }, { transaction });
        }
        const privilegedCount = tags.filter((t) => t.assertionStatus === PrivilegeAssertionStatus.ASSERTED ||
            t.assertionStatus === PrivilegeAssertionStatus.UPHELD).length;
        const archiveSummary = {
            totalDocuments: tags.length,
            privilegedDocuments: privilegedCount,
            assertions: assertions.length,
            clawbacks: clawbacks.length,
            archiveDate: new Date(),
        };
        return {
            archived: true,
            archiveId,
            archiveSummary,
        };
    }
    catch (error) {
        throw new common_1.InternalServerErrorException('Failed to archive privilege review');
    }
}
// ============================================================================
// NESTJS SERVICES
// ============================================================================
/**
 * Privilege Review Service
 * Main service for privilege review operations
 */
let PrivilegeReviewService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PrivilegeReviewService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
            this.logger = new common_1.Logger(PrivilegeReviewService.name);
        }
        /**
         * Create privilege tag with validation
         */
        async createTag(data) {
            this.logger.log(`Creating privilege tag for document: ${data.documentId}`);
            return createPrivilegeTag(data);
        }
        /**
         * Batch tag multiple documents
         */
        async batchTag(documentIds, privilegeData) {
            this.logger.log(`Batch tagging ${documentIds.length} documents`);
            return batchTagDocuments(documentIds, privilegeData);
        }
        /**
         * Generate privilege log for matter
         */
        async generateLog(matterId) {
            this.logger.log(`Generating privilege log for matter: ${matterId}`);
            return generatePrivilegeLog(matterId);
        }
        /**
         * Process inadvertent disclosure
         */
        async handleDisclosure(documentId, disclosureDetails) {
            this.logger.warn(`Processing inadvertent disclosure for document: ${documentId}`);
            return processInadvertentDisclosure(documentId, disclosureDetails);
        }
    };
    __setFunctionName(_classThis, "PrivilegeReviewService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrivilegeReviewService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrivilegeReviewService = _classThis;
})();
exports.PrivilegeReviewService = PrivilegeReviewService;
/**
 * Clawback Management Service
 * Service for clawback request operations
 */
let ClawbackManagementService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ClawbackManagementService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(ClawbackManagementService.name);
        }
        /**
         * Create clawback request
         */
        async createRequest(data) {
            this.logger.log(`Creating clawback request for document: ${data.documentId}`);
            return createClawbackRequest(data);
        }
        /**
         * Generate clawback notice
         */
        async generateNotice(requestId) {
            this.logger.log(`Generating clawback notice for request: ${requestId}`);
            return generateClawbackNotice(requestId);
        }
        /**
         * Track compliance
         */
        async trackCompliance(requestId) {
            this.logger.log(`Tracking clawback compliance for request: ${requestId}`);
            return trackClawbackCompliance(requestId);
        }
    };
    __setFunctionName(_classThis, "ClawbackManagementService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClawbackManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClawbackManagementService = _classThis;
})();
exports.ClawbackManagementService = ClawbackManagementService;
/**
 * Privilege Log Service
 * Service for privilege log operations
 */
let PrivilegeLogService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PrivilegeLogService = _classThis = class {
        constructor() {
            this.logger = new common_1.Logger(PrivilegeLogService.name);
        }
        /**
         * Add log entry
         */
        async addEntry(data) {
            this.logger.log(`Adding privilege log entry for matter: ${data.matterId}`);
            return addPrivilegeLogEntry(data);
        }
        /**
         * Export privilege log
         */
        async exportLog(matterId, format) {
            this.logger.log(`Exporting privilege log for matter: ${matterId} in ${format} format`);
            return formatPrivilegeLogExport(matterId, format);
        }
        /**
         * Validate completeness
         */
        async validateCompleteness(matterId) {
            this.logger.log(`Validating privilege log completeness for matter: ${matterId}`);
            return validatePrivilegeLogCompleteness(matterId);
        }
    };
    __setFunctionName(_classThis, "PrivilegeLogService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrivilegeLogService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrivilegeLogService = _classThis;
})();
exports.PrivilegeLogService = PrivilegeLogService;
// ============================================================================
// NESTJS MODULE
// ============================================================================
let PrivilegeReviewModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [],
            providers: [
                PrivilegeReviewService,
                ClawbackManagementService,
                PrivilegeLogService,
            ],
            exports: [
                PrivilegeReviewService,
                ClawbackManagementService,
                PrivilegeLogService,
            ],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PrivilegeReviewModule = _classThis = class {
        static forRoot() {
            return {
                module: PrivilegeReviewModule,
                providers: [
                    PrivilegeReviewService,
                    ClawbackManagementService,
                    PrivilegeLogService,
                ],
                exports: [
                    PrivilegeReviewService,
                    ClawbackManagementService,
                    PrivilegeLogService,
                ],
            };
        }
    };
    __setFunctionName(_classThis, "PrivilegeReviewModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrivilegeReviewModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrivilegeReviewModule = _classThis;
})();
exports.PrivilegeReviewModule = PrivilegeReviewModule;
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Models
    PrivilegeTag,
    PrivilegeLog,
    PrivilegeAssertion,
    ClawbackRequest,
    // Services
    PrivilegeReviewService,
    ClawbackManagementService,
    PrivilegeLogService,
    // Functions - Privilege Tagging (8)
    createPrivilegeTag,
    updatePrivilegeTag,
    batchTagDocuments,
    validatePrivilegeClaim,
    getPrivilegeTagsByDocument,
    searchPrivilegedDocuments,
    removePrivilegeTag,
    bulkPrivilegeReview,
    // Functions - Privilege Log Generation (7)
    generatePrivilegeLog,
    addPrivilegeLogEntry,
    formatPrivilegeLogExport,
    validatePrivilegeLogCompleteness,
    groupPrivilegeLogByType,
    redactPrivilegeLogInfo,
    updatePrivilegeLogEntry,
    // Functions - Clawback (6)
    createClawbackRequest,
    processInadvertentDisclosure,
    validateClawbackTimeliness,
    generateClawbackNotice,
    trackClawbackCompliance,
    closeClawbackRequest,
    // Functions - Assertion Workflow (8)
    initiatePrivilegeAssertion,
    assignPrivilegeReviewer,
    submitPrivilegeChallenge,
    resolvePrivilegeDispute,
    escalatePrivilegeIssue,
    documentAssertionRationale,
    trackAssertionStatus,
    finalizePrivilegeAssertion,
    // Functions - Quality Control (6)
    performQualityControlSample,
    validatePrivilegeConsistency,
    identifyPrivilegeGaps,
    generateQCMetrics,
    flagInconsistentPrivilege,
    reviewPrivilegeAccuracy,
    // Functions - Utilities (7)
    generatePrivilegeStatistics,
    exportPrivilegeReviewData,
    calculatePrivilegeReviewProgress,
    detectPrivilegeWaiverRisks,
    generatePrivilegeReviewReport,
    validateFRE502Compliance,
    archiveCompletedPrivilegeReview,
    // Module
    PrivilegeReviewModule,
};
//# sourceMappingURL=privilege-review-kit.js.map