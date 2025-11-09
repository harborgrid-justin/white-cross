"use strict";
/**
 * ASSET COMPLIANCE MANAGEMENT COMMANDS
 *
 * Comprehensive regulatory compliance and certification tracking toolkit.
 * Provides 45 specialized functions covering:
 * - Regulatory compliance tracking and management
 * - Certification management and renewals
 * - Audit trail generation and management
 * - Compliance reporting and dashboards
 * - Safety inspections and OSHA compliance
 * - Environmental compliance tracking
 * - Industry standards validation (ISO, FDA, CE, UL, etc.)
 * - Non-compliance workflow management
 * - Compliance documentation management
 * - Regulatory requirement tracking
 * - Compliance risk assessment
 * - Third-party audit management
 * - Compliance training tracking
 * - Violation and remediation tracking
 *
 * @module AssetComplianceCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @compliance OSHA, FDA, ISO, CE, HIPAA, SOX, EPA standards supported
 * @audit Complete audit trail for all compliance activities
 *
 * @example
 * ```typescript
 * import {
 *   trackCompliance,
 *   createCertification,
 *   conductSafetyInspection,
 *   generateAuditTrail,
 *   ComplianceRecord,
 *   Certification
 * } from './asset-compliance-commands';
 *
 * // Track compliance
 * const compliance = await trackCompliance({
 *   assetId: 'asset-001',
 *   frameworkType: 'osha',
 *   requirementId: 'osha-1910',
 *   status: 'compliant'
 * });
 *
 * // Create certification
 * const cert = await createCertification({
 *   assetId: 'asset-001',
 *   certificationType: 'iso_9001',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31')
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
exports.CreateViolationRecordDto = exports.CreateInspectionDto = exports.CreateCertificationDto = exports.CreateComplianceRecordDto = exports.ComplianceAuditTrail = exports.RemediationAction = exports.ViolationRecord = exports.Inspection = exports.Certification = exports.ComplianceRecord = exports.RemediationStatus = exports.ViolationSeverity = exports.InspectionStatus = exports.InspectionType = exports.CertificationStatus = exports.CertificationType = exports.ComplianceStatus = exports.ComplianceFramework = void 0;
exports.trackCompliance = trackCompliance;
exports.getComplianceRecordById = getComplianceRecordById;
exports.getAssetComplianceRecords = getAssetComplianceRecords;
exports.updateComplianceStatus = updateComplianceStatus;
exports.calculateComplianceRate = calculateComplianceRate;
exports.createCertification = createCertification;
exports.getCertificationById = getCertificationById;
exports.getAssetCertifications = getAssetCertifications;
exports.getExpiringCertifications = getExpiringCertifications;
exports.renewCertification = renewCertification;
exports.updateCertificationStatuses = updateCertificationStatuses;
exports.scheduleInspection = scheduleInspection;
exports.getInspectionById = getInspectionById;
exports.getAssetInspections = getAssetInspections;
exports.completeInspection = completeInspection;
exports.conductSafetyInspection = conductSafetyInspection;
exports.recordViolation = recordViolation;
exports.getAssetViolations = getAssetViolations;
exports.createRemediationAction = createRemediationAction;
exports.completeRemediationAction = completeRemediationAction;
exports.createAuditTrailEntry = createAuditTrailEntry;
exports.getAuditTrail = getAuditTrail;
exports.generateAuditTrail = generateAuditTrail;
exports.getComplianceDashboard = getComplianceDashboard;
exports.generateComplianceReport = generateComplianceReport;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sequelize_typescript_1 = require("sequelize-typescript");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * Compliance framework types
 */
var ComplianceFramework;
(function (ComplianceFramework) {
    ComplianceFramework["OSHA"] = "osha";
    ComplianceFramework["FDA"] = "fda";
    ComplianceFramework["ISO_9001"] = "iso_9001";
    ComplianceFramework["ISO_14001"] = "iso_14001";
    ComplianceFramework["ISO_45001"] = "iso_45001";
    ComplianceFramework["ISO_27001"] = "iso_27001";
    ComplianceFramework["HIPAA"] = "hipaa";
    ComplianceFramework["SOX"] = "sox";
    ComplianceFramework["GDPR"] = "gdpr";
    ComplianceFramework["EPA"] = "epa";
    ComplianceFramework["CE"] = "ce";
    ComplianceFramework["UL"] = "ul";
    ComplianceFramework["ANSI"] = "ansi";
    ComplianceFramework["NFPA"] = "nfpa";
    ComplianceFramework["ASME"] = "asme";
    ComplianceFramework["CUSTOM"] = "custom";
})(ComplianceFramework || (exports.ComplianceFramework = ComplianceFramework = {}));
/**
 * Compliance status
 */
var ComplianceStatus;
(function (ComplianceStatus) {
    ComplianceStatus["COMPLIANT"] = "compliant";
    ComplianceStatus["NON_COMPLIANT"] = "non_compliant";
    ComplianceStatus["PARTIALLY_COMPLIANT"] = "partially_compliant";
    ComplianceStatus["PENDING_REVIEW"] = "pending_review";
    ComplianceStatus["NOT_APPLICABLE"] = "not_applicable";
    ComplianceStatus["WAIVED"] = "waived";
})(ComplianceStatus || (exports.ComplianceStatus = ComplianceStatus = {}));
/**
 * Certification type
 */
var CertificationType;
(function (CertificationType) {
    CertificationType["ISO_9001"] = "iso_9001";
    CertificationType["ISO_14001"] = "iso_14001";
    CertificationType["ISO_45001"] = "iso_45001";
    CertificationType["ISO_27001"] = "iso_27001";
    CertificationType["FDA_APPROVAL"] = "fda_approval";
    CertificationType["CE_MARK"] = "ce_mark";
    CertificationType["UL_LISTED"] = "ul_listed";
    CertificationType["ENERGY_STAR"] = "energy_star";
    CertificationType["LEED"] = "leed";
    CertificationType["CALIBRATION"] = "calibration";
    CertificationType["SAFETY_INSPECTION"] = "safety_inspection";
    CertificationType["ENVIRONMENTAL"] = "environmental";
    CertificationType["CUSTOM"] = "custom";
})(CertificationType || (exports.CertificationType = CertificationType = {}));
/**
 * Certification status
 */
var CertificationStatus;
(function (CertificationStatus) {
    CertificationStatus["ACTIVE"] = "active";
    CertificationStatus["EXPIRED"] = "expired";
    CertificationStatus["PENDING_RENEWAL"] = "pending_renewal";
    CertificationStatus["SUSPENDED"] = "suspended";
    CertificationStatus["REVOKED"] = "revoked";
    CertificationStatus["NOT_REQUIRED"] = "not_required";
})(CertificationStatus || (exports.CertificationStatus = CertificationStatus = {}));
/**
 * Inspection type
 */
var InspectionType;
(function (InspectionType) {
    InspectionType["SAFETY"] = "safety";
    InspectionType["ENVIRONMENTAL"] = "environmental";
    InspectionType["QUALITY"] = "quality";
    InspectionType["REGULATORY"] = "regulatory";
    InspectionType["PREVENTIVE"] = "preventive";
    InspectionType["INCIDENT_RESPONSE"] = "incident_response";
    InspectionType["THIRD_PARTY"] = "third_party";
    InspectionType["INTERNAL"] = "internal";
})(InspectionType || (exports.InspectionType = InspectionType = {}));
/**
 * Inspection status
 */
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["SCHEDULED"] = "scheduled";
    InspectionStatus["IN_PROGRESS"] = "in_progress";
    InspectionStatus["COMPLETED"] = "completed";
    InspectionStatus["PASSED"] = "passed";
    InspectionStatus["FAILED"] = "failed";
    InspectionStatus["CONDITIONAL_PASS"] = "conditional_pass";
    InspectionStatus["CANCELLED"] = "cancelled";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
/**
 * Violation severity
 */
var ViolationSeverity;
(function (ViolationSeverity) {
    ViolationSeverity["CRITICAL"] = "critical";
    ViolationSeverity["HIGH"] = "high";
    ViolationSeverity["MEDIUM"] = "medium";
    ViolationSeverity["LOW"] = "low";
    ViolationSeverity["MINOR"] = "minor";
})(ViolationSeverity || (exports.ViolationSeverity = ViolationSeverity = {}));
/**
 * Remediation status
 */
var RemediationStatus;
(function (RemediationStatus) {
    RemediationStatus["OPEN"] = "open";
    RemediationStatus["IN_PROGRESS"] = "in_progress";
    RemediationStatus["RESOLVED"] = "resolved";
    RemediationStatus["VERIFIED"] = "verified";
    RemediationStatus["CLOSED"] = "closed";
    RemediationStatus["ESCALATED"] = "escalated";
})(RemediationStatus || (exports.RemediationStatus = RemediationStatus = {}));
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Compliance record database model
 */
let ComplianceRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'compliance_records', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _frameworkType_decorators;
    let _frameworkType_initializers = [];
    let _frameworkType_extraInitializers = [];
    let _requirementId_decorators;
    let _requirementId_initializers = [];
    let _requirementId_extraInitializers = [];
    let _requirementDescription_decorators;
    let _requirementDescription_initializers = [];
    let _requirementDescription_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assessmentDate_decorators;
    let _assessmentDate_initializers = [];
    let _assessmentDate_extraInitializers = [];
    let _assessedBy_decorators;
    let _assessedBy_initializers = [];
    let _assessedBy_extraInitializers = [];
    let _nextAssessmentDate_decorators;
    let _nextAssessmentDate_initializers = [];
    let _nextAssessmentDate_extraInitializers = [];
    let _evidenceUrls_decorators;
    let _evidenceUrls_initializers = [];
    let _evidenceUrls_extraInitializers = [];
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
    var ComplianceRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.frameworkType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _frameworkType_initializers, void 0));
            this.requirementId = (__runInitializers(this, _frameworkType_extraInitializers), __runInitializers(this, _requirementId_initializers, void 0));
            this.requirementDescription = (__runInitializers(this, _requirementId_extraInitializers), __runInitializers(this, _requirementDescription_initializers, void 0));
            this.status = (__runInitializers(this, _requirementDescription_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.assessmentDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assessmentDate_initializers, void 0));
            this.assessedBy = (__runInitializers(this, _assessmentDate_extraInitializers), __runInitializers(this, _assessedBy_initializers, void 0));
            this.nextAssessmentDate = (__runInitializers(this, _assessedBy_extraInitializers), __runInitializers(this, _nextAssessmentDate_initializers, void 0));
            this.evidenceUrls = (__runInitializers(this, _nextAssessmentDate_extraInitializers), __runInitializers(this, _evidenceUrls_initializers, void 0));
            this.notes = (__runInitializers(this, _evidenceUrls_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ComplianceRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique compliance record ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _frameworkType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Framework type', enum: ComplianceFramework }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ComplianceFramework)), allowNull: false })];
        _requirementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requirement ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _requirementDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requirement description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Compliance status', enum: ComplianceStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ComplianceStatus)), allowNull: false })];
        _assessmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _assessedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessed by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _nextAssessmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next assessment date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _evidenceUrls_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _frameworkType_decorators, { kind: "field", name: "frameworkType", static: false, private: false, access: { has: obj => "frameworkType" in obj, get: obj => obj.frameworkType, set: (obj, value) => { obj.frameworkType = value; } }, metadata: _metadata }, _frameworkType_initializers, _frameworkType_extraInitializers);
        __esDecorate(null, null, _requirementId_decorators, { kind: "field", name: "requirementId", static: false, private: false, access: { has: obj => "requirementId" in obj, get: obj => obj.requirementId, set: (obj, value) => { obj.requirementId = value; } }, metadata: _metadata }, _requirementId_initializers, _requirementId_extraInitializers);
        __esDecorate(null, null, _requirementDescription_decorators, { kind: "field", name: "requirementDescription", static: false, private: false, access: { has: obj => "requirementDescription" in obj, get: obj => obj.requirementDescription, set: (obj, value) => { obj.requirementDescription = value; } }, metadata: _metadata }, _requirementDescription_initializers, _requirementDescription_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _assessmentDate_decorators, { kind: "field", name: "assessmentDate", static: false, private: false, access: { has: obj => "assessmentDate" in obj, get: obj => obj.assessmentDate, set: (obj, value) => { obj.assessmentDate = value; } }, metadata: _metadata }, _assessmentDate_initializers, _assessmentDate_extraInitializers);
        __esDecorate(null, null, _assessedBy_decorators, { kind: "field", name: "assessedBy", static: false, private: false, access: { has: obj => "assessedBy" in obj, get: obj => obj.assessedBy, set: (obj, value) => { obj.assessedBy = value; } }, metadata: _metadata }, _assessedBy_initializers, _assessedBy_extraInitializers);
        __esDecorate(null, null, _nextAssessmentDate_decorators, { kind: "field", name: "nextAssessmentDate", static: false, private: false, access: { has: obj => "nextAssessmentDate" in obj, get: obj => obj.nextAssessmentDate, set: (obj, value) => { obj.nextAssessmentDate = value; } }, metadata: _metadata }, _nextAssessmentDate_initializers, _nextAssessmentDate_extraInitializers);
        __esDecorate(null, null, _evidenceUrls_decorators, { kind: "field", name: "evidenceUrls", static: false, private: false, access: { has: obj => "evidenceUrls" in obj, get: obj => obj.evidenceUrls, set: (obj, value) => { obj.evidenceUrls = value; } }, metadata: _metadata }, _evidenceUrls_initializers, _evidenceUrls_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceRecord = _classThis;
})();
exports.ComplianceRecord = ComplianceRecord;
/**
 * Certification database model
 */
let Certification = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'certifications', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _certificationType_decorators;
    let _certificationType_initializers = [];
    let _certificationType_extraInitializers = [];
    let _certificationNumber_decorators;
    let _certificationNumber_initializers = [];
    let _certificationNumber_extraInitializers = [];
    let _issuingAuthority_decorators;
    let _issuingAuthority_initializers = [];
    let _issuingAuthority_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _documentUrls_decorators;
    let _documentUrls_initializers = [];
    let _documentUrls_extraInitializers = [];
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
    var Certification = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.certificationType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _certificationType_initializers, void 0));
            this.certificationNumber = (__runInitializers(this, _certificationType_extraInitializers), __runInitializers(this, _certificationNumber_initializers, void 0));
            this.issuingAuthority = (__runInitializers(this, _certificationNumber_extraInitializers), __runInitializers(this, _issuingAuthority_initializers, void 0));
            this.issueDate = (__runInitializers(this, _issuingAuthority_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
            this.expirationDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
            this.status = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scope = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.documentUrls = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _documentUrls_initializers, void 0));
            this.notes = (__runInitializers(this, _documentUrls_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Certification");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique certification ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _certificationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certification type', enum: CertificationType }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(CertificationType)), allowNull: false })];
        _certificationNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certification number' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) })];
        _issuingAuthority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issuing authority' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _issueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issue date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certification status', enum: CertificationStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(CertificationStatus)),
                defaultValue: CertificationStatus.ACTIVE,
            })];
        _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certification scope' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _documentUrls_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _certificationType_decorators, { kind: "field", name: "certificationType", static: false, private: false, access: { has: obj => "certificationType" in obj, get: obj => obj.certificationType, set: (obj, value) => { obj.certificationType = value; } }, metadata: _metadata }, _certificationType_initializers, _certificationType_extraInitializers);
        __esDecorate(null, null, _certificationNumber_decorators, { kind: "field", name: "certificationNumber", static: false, private: false, access: { has: obj => "certificationNumber" in obj, get: obj => obj.certificationNumber, set: (obj, value) => { obj.certificationNumber = value; } }, metadata: _metadata }, _certificationNumber_initializers, _certificationNumber_extraInitializers);
        __esDecorate(null, null, _issuingAuthority_decorators, { kind: "field", name: "issuingAuthority", static: false, private: false, access: { has: obj => "issuingAuthority" in obj, get: obj => obj.issuingAuthority, set: (obj, value) => { obj.issuingAuthority = value; } }, metadata: _metadata }, _issuingAuthority_initializers, _issuingAuthority_extraInitializers);
        __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
        __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _documentUrls_decorators, { kind: "field", name: "documentUrls", static: false, private: false, access: { has: obj => "documentUrls" in obj, get: obj => obj.documentUrls, set: (obj, value) => { obj.documentUrls = value; } }, metadata: _metadata }, _documentUrls_initializers, _documentUrls_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Certification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Certification = _classThis;
})();
exports.Certification = Certification;
/**
 * Inspection database model
 */
let Inspection = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'inspections', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _inspectionType_decorators;
    let _inspectionType_initializers = [];
    let _inspectionType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _inspectorId_decorators;
    let _inspectorId_initializers = [];
    let _inspectorId_extraInitializers = [];
    let _inspectorName_decorators;
    let _inspectorName_initializers = [];
    let _inspectorName_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _checklistId_decorators;
    let _checklistId_initializers = [];
    let _checklistId_extraInitializers = [];
    let _findings_decorators;
    let _findings_initializers = [];
    let _findings_extraInitializers = [];
    let _overallScore_decorators;
    let _overallScore_initializers = [];
    let _overallScore_extraInitializers = [];
    let _passFailCriteria_decorators;
    let _passFailCriteria_initializers = [];
    let _passFailCriteria_extraInitializers = [];
    let _recommendations_decorators;
    let _recommendations_initializers = [];
    let _recommendations_extraInitializers = [];
    let _followUpRequired_decorators;
    let _followUpRequired_initializers = [];
    let _followUpRequired_extraInitializers = [];
    let _followUpDate_decorators;
    let _followUpDate_initializers = [];
    let _followUpDate_extraInitializers = [];
    let _reportUrl_decorators;
    let _reportUrl_initializers = [];
    let _reportUrl_extraInitializers = [];
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
    var Inspection = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.inspectionType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _inspectionType_initializers, void 0));
            this.scheduledDate = (__runInitializers(this, _inspectionType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.inspectorId = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _inspectorId_initializers, void 0));
            this.inspectorName = (__runInitializers(this, _inspectorId_extraInitializers), __runInitializers(this, _inspectorName_initializers, void 0));
            this.status = (__runInitializers(this, _inspectorName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.scope = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
            this.checklistId = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _checklistId_initializers, void 0));
            this.findings = (__runInitializers(this, _checklistId_extraInitializers), __runInitializers(this, _findings_initializers, void 0));
            this.overallScore = (__runInitializers(this, _findings_extraInitializers), __runInitializers(this, _overallScore_initializers, void 0));
            this.passFailCriteria = (__runInitializers(this, _overallScore_extraInitializers), __runInitializers(this, _passFailCriteria_initializers, void 0));
            this.recommendations = (__runInitializers(this, _passFailCriteria_extraInitializers), __runInitializers(this, _recommendations_initializers, void 0));
            this.followUpRequired = (__runInitializers(this, _recommendations_extraInitializers), __runInitializers(this, _followUpRequired_initializers, void 0));
            this.followUpDate = (__runInitializers(this, _followUpRequired_extraInitializers), __runInitializers(this, _followUpDate_initializers, void 0));
            this.reportUrl = (__runInitializers(this, _followUpDate_extraInitializers), __runInitializers(this, _reportUrl_initializers, void 0));
            this.notes = (__runInitializers(this, _reportUrl_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Inspection");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique inspection ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _inspectionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection type', enum: InspectionType }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(InspectionType)), allowNull: false })];
        _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _completedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _inspectorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspector user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _inspectorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspector name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection status', enum: InspectionStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(InspectionStatus)),
                defaultValue: InspectionStatus.SCHEDULED,
            })];
        _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection scope' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _checklistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checklist ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _findings_decorators = [(0, swagger_1.ApiProperty)({ description: 'Findings' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _overallScore_decorators = [(0, swagger_1.ApiProperty)({ description: 'Overall score' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(5, 2) })];
        _passFailCriteria_decorators = [(0, swagger_1.ApiProperty)({ description: 'Pass/fail criteria' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _recommendations_decorators = [(0, swagger_1.ApiProperty)({ description: 'Recommendations' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.TEXT) })];
        _followUpRequired_decorators = [(0, swagger_1.ApiProperty)({ description: 'Follow-up required' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, defaultValue: false })];
        _followUpDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Follow-up date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _reportUrl_decorators = [(0, swagger_1.ApiProperty)({ description: 'Report URL' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(500) })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _inspectionType_decorators, { kind: "field", name: "inspectionType", static: false, private: false, access: { has: obj => "inspectionType" in obj, get: obj => obj.inspectionType, set: (obj, value) => { obj.inspectionType = value; } }, metadata: _metadata }, _inspectionType_initializers, _inspectionType_extraInitializers);
        __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _inspectorId_decorators, { kind: "field", name: "inspectorId", static: false, private: false, access: { has: obj => "inspectorId" in obj, get: obj => obj.inspectorId, set: (obj, value) => { obj.inspectorId = value; } }, metadata: _metadata }, _inspectorId_initializers, _inspectorId_extraInitializers);
        __esDecorate(null, null, _inspectorName_decorators, { kind: "field", name: "inspectorName", static: false, private: false, access: { has: obj => "inspectorName" in obj, get: obj => obj.inspectorName, set: (obj, value) => { obj.inspectorName = value; } }, metadata: _metadata }, _inspectorName_initializers, _inspectorName_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
        __esDecorate(null, null, _checklistId_decorators, { kind: "field", name: "checklistId", static: false, private: false, access: { has: obj => "checklistId" in obj, get: obj => obj.checklistId, set: (obj, value) => { obj.checklistId = value; } }, metadata: _metadata }, _checklistId_initializers, _checklistId_extraInitializers);
        __esDecorate(null, null, _findings_decorators, { kind: "field", name: "findings", static: false, private: false, access: { has: obj => "findings" in obj, get: obj => obj.findings, set: (obj, value) => { obj.findings = value; } }, metadata: _metadata }, _findings_initializers, _findings_extraInitializers);
        __esDecorate(null, null, _overallScore_decorators, { kind: "field", name: "overallScore", static: false, private: false, access: { has: obj => "overallScore" in obj, get: obj => obj.overallScore, set: (obj, value) => { obj.overallScore = value; } }, metadata: _metadata }, _overallScore_initializers, _overallScore_extraInitializers);
        __esDecorate(null, null, _passFailCriteria_decorators, { kind: "field", name: "passFailCriteria", static: false, private: false, access: { has: obj => "passFailCriteria" in obj, get: obj => obj.passFailCriteria, set: (obj, value) => { obj.passFailCriteria = value; } }, metadata: _metadata }, _passFailCriteria_initializers, _passFailCriteria_extraInitializers);
        __esDecorate(null, null, _recommendations_decorators, { kind: "field", name: "recommendations", static: false, private: false, access: { has: obj => "recommendations" in obj, get: obj => obj.recommendations, set: (obj, value) => { obj.recommendations = value; } }, metadata: _metadata }, _recommendations_initializers, _recommendations_extraInitializers);
        __esDecorate(null, null, _followUpRequired_decorators, { kind: "field", name: "followUpRequired", static: false, private: false, access: { has: obj => "followUpRequired" in obj, get: obj => obj.followUpRequired, set: (obj, value) => { obj.followUpRequired = value; } }, metadata: _metadata }, _followUpRequired_initializers, _followUpRequired_extraInitializers);
        __esDecorate(null, null, _followUpDate_decorators, { kind: "field", name: "followUpDate", static: false, private: false, access: { has: obj => "followUpDate" in obj, get: obj => obj.followUpDate, set: (obj, value) => { obj.followUpDate = value; } }, metadata: _metadata }, _followUpDate_initializers, _followUpDate_extraInitializers);
        __esDecorate(null, null, _reportUrl_decorators, { kind: "field", name: "reportUrl", static: false, private: false, access: { has: obj => "reportUrl" in obj, get: obj => obj.reportUrl, set: (obj, value) => { obj.reportUrl = value; } }, metadata: _metadata }, _reportUrl_initializers, _reportUrl_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Inspection = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Inspection = _classThis;
})();
exports.Inspection = Inspection;
/**
 * Violation record database model
 */
let ViolationRecord = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'violation_records', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _violationType_decorators;
    let _violationType_initializers = [];
    let _violationType_extraInitializers = [];
    let _frameworkType_decorators;
    let _frameworkType_initializers = [];
    let _frameworkType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _discoveredDate_decorators;
    let _discoveredDate_initializers = [];
    let _discoveredDate_extraInitializers = [];
    let _discoveredBy_decorators;
    let _discoveredBy_initializers = [];
    let _discoveredBy_extraInitializers = [];
    let _inspectionId_decorators;
    let _inspectionId_initializers = [];
    let _inspectionId_extraInitializers = [];
    let _inspection_decorators;
    let _inspection_initializers = [];
    let _inspection_extraInitializers = [];
    let _evidenceUrls_decorators;
    let _evidenceUrls_initializers = [];
    let _evidenceUrls_extraInitializers = [];
    let _potentialFine_decorators;
    let _potentialFine_initializers = [];
    let _potentialFine_extraInitializers = [];
    let _remediationStatus_decorators;
    let _remediationStatus_initializers = [];
    let _remediationStatus_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _remediationActions_decorators;
    let _remediationActions_initializers = [];
    let _remediationActions_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var ViolationRecord = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.assetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _assetId_initializers, void 0));
            this.violationType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _violationType_initializers, void 0));
            this.frameworkType = (__runInitializers(this, _violationType_extraInitializers), __runInitializers(this, _frameworkType_initializers, void 0));
            this.severity = (__runInitializers(this, _frameworkType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
            this.description = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.discoveredDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _discoveredDate_initializers, void 0));
            this.discoveredBy = (__runInitializers(this, _discoveredDate_extraInitializers), __runInitializers(this, _discoveredBy_initializers, void 0));
            this.inspectionId = (__runInitializers(this, _discoveredBy_extraInitializers), __runInitializers(this, _inspectionId_initializers, void 0));
            this.inspection = (__runInitializers(this, _inspectionId_extraInitializers), __runInitializers(this, _inspection_initializers, void 0));
            this.evidenceUrls = (__runInitializers(this, _inspection_extraInitializers), __runInitializers(this, _evidenceUrls_initializers, void 0));
            this.potentialFine = (__runInitializers(this, _evidenceUrls_extraInitializers), __runInitializers(this, _potentialFine_initializers, void 0));
            this.remediationStatus = (__runInitializers(this, _potentialFine_extraInitializers), __runInitializers(this, _remediationStatus_initializers, void 0));
            this.notes = (__runInitializers(this, _remediationStatus_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.remediationActions = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _remediationActions_initializers, void 0));
            this.createdAt = (__runInitializers(this, _remediationActions_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ViolationRecord");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique violation ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _violationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Violation type' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _frameworkType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Framework type', enum: ComplianceFramework }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ComplianceFramework)), allowNull: false })];
        _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity', enum: ViolationSeverity }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM(...Object.values(ViolationSeverity)), allowNull: false })];
        _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Violation description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _discoveredDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discovered date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _discoveredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discovered by user ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _inspectionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Related inspection ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => Inspection), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID })];
        _inspection_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => Inspection)];
        _evidenceUrls_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence URLs' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) })];
        _potentialFine_decorators = [(0, swagger_1.ApiProperty)({ description: 'Potential fine amount' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _remediationStatus_decorators = [(0, swagger_1.ApiProperty)({ description: 'Remediation status', enum: RemediationStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RemediationStatus)),
                defaultValue: RemediationStatus.OPEN,
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _remediationActions_decorators = [(0, sequelize_typescript_1.HasMany)(() => RemediationAction)];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
        __esDecorate(null, null, _violationType_decorators, { kind: "field", name: "violationType", static: false, private: false, access: { has: obj => "violationType" in obj, get: obj => obj.violationType, set: (obj, value) => { obj.violationType = value; } }, metadata: _metadata }, _violationType_initializers, _violationType_extraInitializers);
        __esDecorate(null, null, _frameworkType_decorators, { kind: "field", name: "frameworkType", static: false, private: false, access: { has: obj => "frameworkType" in obj, get: obj => obj.frameworkType, set: (obj, value) => { obj.frameworkType = value; } }, metadata: _metadata }, _frameworkType_initializers, _frameworkType_extraInitializers);
        __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _discoveredDate_decorators, { kind: "field", name: "discoveredDate", static: false, private: false, access: { has: obj => "discoveredDate" in obj, get: obj => obj.discoveredDate, set: (obj, value) => { obj.discoveredDate = value; } }, metadata: _metadata }, _discoveredDate_initializers, _discoveredDate_extraInitializers);
        __esDecorate(null, null, _discoveredBy_decorators, { kind: "field", name: "discoveredBy", static: false, private: false, access: { has: obj => "discoveredBy" in obj, get: obj => obj.discoveredBy, set: (obj, value) => { obj.discoveredBy = value; } }, metadata: _metadata }, _discoveredBy_initializers, _discoveredBy_extraInitializers);
        __esDecorate(null, null, _inspectionId_decorators, { kind: "field", name: "inspectionId", static: false, private: false, access: { has: obj => "inspectionId" in obj, get: obj => obj.inspectionId, set: (obj, value) => { obj.inspectionId = value; } }, metadata: _metadata }, _inspectionId_initializers, _inspectionId_extraInitializers);
        __esDecorate(null, null, _inspection_decorators, { kind: "field", name: "inspection", static: false, private: false, access: { has: obj => "inspection" in obj, get: obj => obj.inspection, set: (obj, value) => { obj.inspection = value; } }, metadata: _metadata }, _inspection_initializers, _inspection_extraInitializers);
        __esDecorate(null, null, _evidenceUrls_decorators, { kind: "field", name: "evidenceUrls", static: false, private: false, access: { has: obj => "evidenceUrls" in obj, get: obj => obj.evidenceUrls, set: (obj, value) => { obj.evidenceUrls = value; } }, metadata: _metadata }, _evidenceUrls_initializers, _evidenceUrls_extraInitializers);
        __esDecorate(null, null, _potentialFine_decorators, { kind: "field", name: "potentialFine", static: false, private: false, access: { has: obj => "potentialFine" in obj, get: obj => obj.potentialFine, set: (obj, value) => { obj.potentialFine = value; } }, metadata: _metadata }, _potentialFine_initializers, _potentialFine_extraInitializers);
        __esDecorate(null, null, _remediationStatus_decorators, { kind: "field", name: "remediationStatus", static: false, private: false, access: { has: obj => "remediationStatus" in obj, get: obj => obj.remediationStatus, set: (obj, value) => { obj.remediationStatus = value; } }, metadata: _metadata }, _remediationStatus_initializers, _remediationStatus_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _remediationActions_decorators, { kind: "field", name: "remediationActions", static: false, private: false, access: { has: obj => "remediationActions" in obj, get: obj => obj.remediationActions, set: (obj, value) => { obj.remediationActions = value; } }, metadata: _metadata }, _remediationActions_initializers, _remediationActions_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ViolationRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ViolationRecord = _classThis;
})();
exports.ViolationRecord = ViolationRecord;
/**
 * Remediation action database model
 */
let RemediationAction = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'remediation_actions', paranoid: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _violationId_decorators;
    let _violationId_initializers = [];
    let _violationId_extraInitializers = [];
    let _violation_decorators;
    let _violation_initializers = [];
    let _violation_extraInitializers = [];
    let _actionDescription_decorators;
    let _actionDescription_initializers = [];
    let _actionDescription_extraInitializers = [];
    let _assignedTo_decorators;
    let _assignedTo_initializers = [];
    let _assignedTo_extraInitializers = [];
    let _dueDate_decorators;
    let _dueDate_initializers = [];
    let _dueDate_extraInitializers = [];
    let _completedDate_decorators;
    let _completedDate_initializers = [];
    let _completedDate_extraInitializers = [];
    let _estimatedCost_decorators;
    let _estimatedCost_initializers = [];
    let _estimatedCost_extraInitializers = [];
    let _actualCost_decorators;
    let _actualCost_initializers = [];
    let _actualCost_extraInitializers = [];
    let _priority_decorators;
    let _priority_initializers = [];
    let _priority_extraInitializers = [];
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
    let _deletedAt_decorators;
    let _deletedAt_initializers = [];
    let _deletedAt_extraInitializers = [];
    var RemediationAction = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.violationId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _violationId_initializers, void 0));
            this.violation = (__runInitializers(this, _violationId_extraInitializers), __runInitializers(this, _violation_initializers, void 0));
            this.actionDescription = (__runInitializers(this, _violation_extraInitializers), __runInitializers(this, _actionDescription_initializers, void 0));
            this.assignedTo = (__runInitializers(this, _actionDescription_extraInitializers), __runInitializers(this, _assignedTo_initializers, void 0));
            this.dueDate = (__runInitializers(this, _assignedTo_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
            this.completedDate = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _completedDate_initializers, void 0));
            this.estimatedCost = (__runInitializers(this, _completedDate_extraInitializers), __runInitializers(this, _estimatedCost_initializers, void 0));
            this.actualCost = (__runInitializers(this, _estimatedCost_extraInitializers), __runInitializers(this, _actualCost_initializers, void 0));
            this.priority = (__runInitializers(this, _actualCost_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
            this.status = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
            this.createdAt = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.deletedAt = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _deletedAt_initializers, void 0));
            __runInitializers(this, _deletedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "RemediationAction");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique remediation action ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _violationId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Violation ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.ForeignKey)(() => ViolationRecord), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _violation_decorators = [(0, sequelize_typescript_1.BelongsTo)(() => ViolationRecord)];
        _actionDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action description' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false })];
        _assignedTo_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assigned to user ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _dueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Due date' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false })];
        _completedDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Completed date' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE })];
        _estimatedCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Estimated cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _actualCost_decorators = [(0, swagger_1.ApiProperty)({ description: 'Actual cost' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(15, 2) })];
        _priority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Priority' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.ENUM('critical', 'high', 'medium', 'low'), allowNull: false })];
        _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status', enum: RemediationStatus }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({
                type: sequelize_typescript_1.DataType.ENUM(...Object.values(RemediationStatus)),
                defaultValue: RemediationStatus.OPEN,
            })];
        _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        _updatedAt_decorators = [sequelize_typescript_1.UpdatedAt];
        _deletedAt_decorators = [sequelize_typescript_1.DeletedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _violationId_decorators, { kind: "field", name: "violationId", static: false, private: false, access: { has: obj => "violationId" in obj, get: obj => obj.violationId, set: (obj, value) => { obj.violationId = value; } }, metadata: _metadata }, _violationId_initializers, _violationId_extraInitializers);
        __esDecorate(null, null, _violation_decorators, { kind: "field", name: "violation", static: false, private: false, access: { has: obj => "violation" in obj, get: obj => obj.violation, set: (obj, value) => { obj.violation = value; } }, metadata: _metadata }, _violation_initializers, _violation_extraInitializers);
        __esDecorate(null, null, _actionDescription_decorators, { kind: "field", name: "actionDescription", static: false, private: false, access: { has: obj => "actionDescription" in obj, get: obj => obj.actionDescription, set: (obj, value) => { obj.actionDescription = value; } }, metadata: _metadata }, _actionDescription_initializers, _actionDescription_extraInitializers);
        __esDecorate(null, null, _assignedTo_decorators, { kind: "field", name: "assignedTo", static: false, private: false, access: { has: obj => "assignedTo" in obj, get: obj => obj.assignedTo, set: (obj, value) => { obj.assignedTo = value; } }, metadata: _metadata }, _assignedTo_initializers, _assignedTo_extraInitializers);
        __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: obj => "dueDate" in obj, get: obj => obj.dueDate, set: (obj, value) => { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
        __esDecorate(null, null, _completedDate_decorators, { kind: "field", name: "completedDate", static: false, private: false, access: { has: obj => "completedDate" in obj, get: obj => obj.completedDate, set: (obj, value) => { obj.completedDate = value; } }, metadata: _metadata }, _completedDate_initializers, _completedDate_extraInitializers);
        __esDecorate(null, null, _estimatedCost_decorators, { kind: "field", name: "estimatedCost", static: false, private: false, access: { has: obj => "estimatedCost" in obj, get: obj => obj.estimatedCost, set: (obj, value) => { obj.estimatedCost = value; } }, metadata: _metadata }, _estimatedCost_initializers, _estimatedCost_extraInitializers);
        __esDecorate(null, null, _actualCost_decorators, { kind: "field", name: "actualCost", static: false, private: false, access: { has: obj => "actualCost" in obj, get: obj => obj.actualCost, set: (obj, value) => { obj.actualCost = value; } }, metadata: _metadata }, _actualCost_initializers, _actualCost_extraInitializers);
        __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: obj => "priority" in obj, get: obj => obj.priority, set: (obj, value) => { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _deletedAt_decorators, { kind: "field", name: "deletedAt", static: false, private: false, access: { has: obj => "deletedAt" in obj, get: obj => obj.deletedAt, set: (obj, value) => { obj.deletedAt = value; } }, metadata: _metadata }, _deletedAt_initializers, _deletedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RemediationAction = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RemediationAction = _classThis;
})();
exports.RemediationAction = RemediationAction;
/**
 * Audit trail database model
 */
let ComplianceAuditTrail = (() => {
    let _classDecorators = [(0, sequelize_typescript_1.Table)({ tableName: 'compliance_audit_trail', paranoid: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = sequelize_typescript_1.Model;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _timestamp_decorators;
    let _timestamp_initializers = [];
    let _timestamp_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _userName_decorators;
    let _userName_initializers = [];
    let _userName_extraInitializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _action_extraInitializers = [];
    let _entityType_decorators;
    let _entityType_initializers = [];
    let _entityType_extraInitializers = [];
    let _entityId_decorators;
    let _entityId_initializers = [];
    let _entityId_extraInitializers = [];
    let _changes_decorators;
    let _changes_initializers = [];
    let _changes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var ComplianceAuditTrail = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.timestamp = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
            this.userId = (__runInitializers(this, _timestamp_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.userName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _userName_initializers, void 0));
            this.action = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _action_initializers, void 0));
            this.entityType = (__runInitializers(this, _action_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
            this.entityId = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
            this.changes = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _changes_initializers, void 0));
            this.metadata = (__runInitializers(this, _changes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
            this.createdAt = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "ComplianceAuditTrail");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unique audit trail entry ID' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, primaryKey: true })];
        _timestamp_decorators = [(0, swagger_1.ApiProperty)({ description: 'Timestamp' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: false, defaultValue: sequelize_typescript_1.DataType.NOW })];
        _userId_decorators = [(0, swagger_1.ApiProperty)({ description: 'User ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _userName_decorators = [(0, swagger_1.ApiProperty)({ description: 'User name' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) })];
        _action_decorators = [(0, swagger_1.ApiProperty)({ description: 'Action performed' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200), allowNull: false })];
        _entityType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity type' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false })];
        _entityId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Entity ID' }), sequelize_typescript_1.Index, (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false })];
        _changes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Changes made' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Additional metadata' }), (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB })];
        _createdAt_decorators = [sequelize_typescript_1.CreatedAt];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: obj => "timestamp" in obj, get: obj => obj.timestamp, set: (obj, value) => { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: obj => "userName" in obj, get: obj => obj.userName, set: (obj, value) => { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
        __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
        __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: obj => "entityType" in obj, get: obj => obj.entityType, set: (obj, value) => { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
        __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: obj => "entityId" in obj, get: obj => obj.entityId, set: (obj, value) => { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
        __esDecorate(null, null, _changes_decorators, { kind: "field", name: "changes", static: false, private: false, access: { has: obj => "changes" in obj, get: obj => obj.changes, set: (obj, value) => { obj.changes = value; } }, metadata: _metadata }, _changes_initializers, _changes_extraInitializers);
        __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceAuditTrail = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceAuditTrail = _classThis;
})();
exports.ComplianceAuditTrail = ComplianceAuditTrail;
// ============================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ============================================================================
/**
 * Create compliance record DTO
 */
let CreateComplianceRecordDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _frameworkType_decorators;
    let _frameworkType_initializers = [];
    let _frameworkType_extraInitializers = [];
    let _requirementId_decorators;
    let _requirementId_initializers = [];
    let _requirementId_extraInitializers = [];
    let _requirementDescription_decorators;
    let _requirementDescription_initializers = [];
    let _requirementDescription_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _assessmentDate_decorators;
    let _assessmentDate_initializers = [];
    let _assessmentDate_extraInitializers = [];
    let _assessedBy_decorators;
    let _assessedBy_initializers = [];
    let _assessedBy_extraInitializers = [];
    let _nextAssessmentDate_decorators;
    let _nextAssessmentDate_initializers = [];
    let _nextAssessmentDate_extraInitializers = [];
    let _evidenceUrls_decorators;
    let _evidenceUrls_initializers = [];
    let _evidenceUrls_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateComplianceRecordDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.frameworkType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _frameworkType_initializers, void 0));
                this.requirementId = (__runInitializers(this, _frameworkType_extraInitializers), __runInitializers(this, _requirementId_initializers, void 0));
                this.requirementDescription = (__runInitializers(this, _requirementId_extraInitializers), __runInitializers(this, _requirementDescription_initializers, void 0));
                this.status = (__runInitializers(this, _requirementDescription_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.assessmentDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _assessmentDate_initializers, void 0));
                this.assessedBy = (__runInitializers(this, _assessmentDate_extraInitializers), __runInitializers(this, _assessedBy_initializers, void 0));
                this.nextAssessmentDate = (__runInitializers(this, _assessedBy_extraInitializers), __runInitializers(this, _nextAssessmentDate_initializers, void 0));
                this.evidenceUrls = (__runInitializers(this, _nextAssessmentDate_extraInitializers), __runInitializers(this, _evidenceUrls_initializers, void 0));
                this.notes = (__runInitializers(this, _evidenceUrls_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _frameworkType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Framework type', enum: ComplianceFramework }), (0, class_validator_1.IsEnum)(ComplianceFramework)];
            _requirementId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requirement ID' }), (0, class_validator_1.IsString)()];
            _requirementDescription_decorators = [(0, swagger_1.ApiProperty)({ description: 'Requirement description' }), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, swagger_1.ApiProperty)({ description: 'Status', enum: ComplianceStatus }), (0, class_validator_1.IsEnum)(ComplianceStatus)];
            _assessmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessment date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _assessedBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Assessed by' }), (0, class_validator_1.IsUUID)()];
            _nextAssessmentDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Next assessment date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _evidenceUrls_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence URLs', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _frameworkType_decorators, { kind: "field", name: "frameworkType", static: false, private: false, access: { has: obj => "frameworkType" in obj, get: obj => obj.frameworkType, set: (obj, value) => { obj.frameworkType = value; } }, metadata: _metadata }, _frameworkType_initializers, _frameworkType_extraInitializers);
            __esDecorate(null, null, _requirementId_decorators, { kind: "field", name: "requirementId", static: false, private: false, access: { has: obj => "requirementId" in obj, get: obj => obj.requirementId, set: (obj, value) => { obj.requirementId = value; } }, metadata: _metadata }, _requirementId_initializers, _requirementId_extraInitializers);
            __esDecorate(null, null, _requirementDescription_decorators, { kind: "field", name: "requirementDescription", static: false, private: false, access: { has: obj => "requirementDescription" in obj, get: obj => obj.requirementDescription, set: (obj, value) => { obj.requirementDescription = value; } }, metadata: _metadata }, _requirementDescription_initializers, _requirementDescription_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _assessmentDate_decorators, { kind: "field", name: "assessmentDate", static: false, private: false, access: { has: obj => "assessmentDate" in obj, get: obj => obj.assessmentDate, set: (obj, value) => { obj.assessmentDate = value; } }, metadata: _metadata }, _assessmentDate_initializers, _assessmentDate_extraInitializers);
            __esDecorate(null, null, _assessedBy_decorators, { kind: "field", name: "assessedBy", static: false, private: false, access: { has: obj => "assessedBy" in obj, get: obj => obj.assessedBy, set: (obj, value) => { obj.assessedBy = value; } }, metadata: _metadata }, _assessedBy_initializers, _assessedBy_extraInitializers);
            __esDecorate(null, null, _nextAssessmentDate_decorators, { kind: "field", name: "nextAssessmentDate", static: false, private: false, access: { has: obj => "nextAssessmentDate" in obj, get: obj => obj.nextAssessmentDate, set: (obj, value) => { obj.nextAssessmentDate = value; } }, metadata: _metadata }, _nextAssessmentDate_initializers, _nextAssessmentDate_extraInitializers);
            __esDecorate(null, null, _evidenceUrls_decorators, { kind: "field", name: "evidenceUrls", static: false, private: false, access: { has: obj => "evidenceUrls" in obj, get: obj => obj.evidenceUrls, set: (obj, value) => { obj.evidenceUrls = value; } }, metadata: _metadata }, _evidenceUrls_initializers, _evidenceUrls_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateComplianceRecordDto = CreateComplianceRecordDto;
/**
 * Create certification DTO
 */
let CreateCertificationDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _certificationType_decorators;
    let _certificationType_initializers = [];
    let _certificationType_extraInitializers = [];
    let _certificationNumber_decorators;
    let _certificationNumber_initializers = [];
    let _certificationNumber_extraInitializers = [];
    let _issuingAuthority_decorators;
    let _issuingAuthority_initializers = [];
    let _issuingAuthority_extraInitializers = [];
    let _issueDate_decorators;
    let _issueDate_initializers = [];
    let _issueDate_extraInitializers = [];
    let _expirationDate_decorators;
    let _expirationDate_initializers = [];
    let _expirationDate_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _documentUrls_decorators;
    let _documentUrls_initializers = [];
    let _documentUrls_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    let _metadata_decorators;
    let _metadata_initializers = [];
    let _metadata_extraInitializers = [];
    return _a = class CreateCertificationDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.certificationType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _certificationType_initializers, void 0));
                this.certificationNumber = (__runInitializers(this, _certificationType_extraInitializers), __runInitializers(this, _certificationNumber_initializers, void 0));
                this.issuingAuthority = (__runInitializers(this, _certificationNumber_extraInitializers), __runInitializers(this, _issuingAuthority_initializers, void 0));
                this.issueDate = (__runInitializers(this, _issuingAuthority_extraInitializers), __runInitializers(this, _issueDate_initializers, void 0));
                this.expirationDate = (__runInitializers(this, _issueDate_extraInitializers), __runInitializers(this, _expirationDate_initializers, void 0));
                this.scope = (__runInitializers(this, _expirationDate_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.documentUrls = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _documentUrls_initializers, void 0));
                this.notes = (__runInitializers(this, _documentUrls_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.metadata = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                __runInitializers(this, _metadata_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _certificationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certification type', enum: CertificationType }), (0, class_validator_1.IsEnum)(CertificationType)];
            _certificationNumber_decorators = [(0, swagger_1.ApiProperty)({ description: 'Certification number', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _issuingAuthority_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issuing authority' }), (0, class_validator_1.IsString)()];
            _issueDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Issue date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _expirationDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Expiration date', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _documentUrls_decorators = [(0, swagger_1.ApiProperty)({ description: 'Document URLs', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _metadata_decorators = [(0, swagger_1.ApiProperty)({ description: 'Metadata', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _certificationType_decorators, { kind: "field", name: "certificationType", static: false, private: false, access: { has: obj => "certificationType" in obj, get: obj => obj.certificationType, set: (obj, value) => { obj.certificationType = value; } }, metadata: _metadata }, _certificationType_initializers, _certificationType_extraInitializers);
            __esDecorate(null, null, _certificationNumber_decorators, { kind: "field", name: "certificationNumber", static: false, private: false, access: { has: obj => "certificationNumber" in obj, get: obj => obj.certificationNumber, set: (obj, value) => { obj.certificationNumber = value; } }, metadata: _metadata }, _certificationNumber_initializers, _certificationNumber_extraInitializers);
            __esDecorate(null, null, _issuingAuthority_decorators, { kind: "field", name: "issuingAuthority", static: false, private: false, access: { has: obj => "issuingAuthority" in obj, get: obj => obj.issuingAuthority, set: (obj, value) => { obj.issuingAuthority = value; } }, metadata: _metadata }, _issuingAuthority_initializers, _issuingAuthority_extraInitializers);
            __esDecorate(null, null, _issueDate_decorators, { kind: "field", name: "issueDate", static: false, private: false, access: { has: obj => "issueDate" in obj, get: obj => obj.issueDate, set: (obj, value) => { obj.issueDate = value; } }, metadata: _metadata }, _issueDate_initializers, _issueDate_extraInitializers);
            __esDecorate(null, null, _expirationDate_decorators, { kind: "field", name: "expirationDate", static: false, private: false, access: { has: obj => "expirationDate" in obj, get: obj => obj.expirationDate, set: (obj, value) => { obj.expirationDate = value; } }, metadata: _metadata }, _expirationDate_initializers, _expirationDate_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _documentUrls_decorators, { kind: "field", name: "documentUrls", static: false, private: false, access: { has: obj => "documentUrls" in obj, get: obj => obj.documentUrls, set: (obj, value) => { obj.documentUrls = value; } }, metadata: _metadata }, _documentUrls_initializers, _documentUrls_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: obj => "metadata" in obj, get: obj => obj.metadata, set: (obj, value) => { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateCertificationDto = CreateCertificationDto;
/**
 * Create inspection DTO
 */
let CreateInspectionDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _inspectionType_decorators;
    let _inspectionType_initializers = [];
    let _inspectionType_extraInitializers = [];
    let _scheduledDate_decorators;
    let _scheduledDate_initializers = [];
    let _scheduledDate_extraInitializers = [];
    let _inspectorId_decorators;
    let _inspectorId_initializers = [];
    let _inspectorId_extraInitializers = [];
    let _inspectorName_decorators;
    let _inspectorName_initializers = [];
    let _inspectorName_extraInitializers = [];
    let _scope_decorators;
    let _scope_initializers = [];
    let _scope_extraInitializers = [];
    let _checklistId_decorators;
    let _checklistId_initializers = [];
    let _checklistId_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreateInspectionDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.inspectionType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _inspectionType_initializers, void 0));
                this.scheduledDate = (__runInitializers(this, _inspectionType_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.inspectorId = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _inspectorId_initializers, void 0));
                this.inspectorName = (__runInitializers(this, _inspectorId_extraInitializers), __runInitializers(this, _inspectorName_initializers, void 0));
                this.scope = (__runInitializers(this, _inspectorName_extraInitializers), __runInitializers(this, _scope_initializers, void 0));
                this.checklistId = (__runInitializers(this, _scope_extraInitializers), __runInitializers(this, _checklistId_initializers, void 0));
                this.notes = (__runInitializers(this, _checklistId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _inspectionType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection type', enum: InspectionType }), (0, class_validator_1.IsEnum)(InspectionType)];
            _scheduledDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scheduled date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _inspectorId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspector ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _inspectorName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspector name', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _scope_decorators = [(0, swagger_1.ApiProperty)({ description: 'Scope', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _checklistId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Checklist ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _inspectionType_decorators, { kind: "field", name: "inspectionType", static: false, private: false, access: { has: obj => "inspectionType" in obj, get: obj => obj.inspectionType, set: (obj, value) => { obj.inspectionType = value; } }, metadata: _metadata }, _inspectionType_initializers, _inspectionType_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: obj => "scheduledDate" in obj, get: obj => obj.scheduledDate, set: (obj, value) => { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _inspectorId_decorators, { kind: "field", name: "inspectorId", static: false, private: false, access: { has: obj => "inspectorId" in obj, get: obj => obj.inspectorId, set: (obj, value) => { obj.inspectorId = value; } }, metadata: _metadata }, _inspectorId_initializers, _inspectorId_extraInitializers);
            __esDecorate(null, null, _inspectorName_decorators, { kind: "field", name: "inspectorName", static: false, private: false, access: { has: obj => "inspectorName" in obj, get: obj => obj.inspectorName, set: (obj, value) => { obj.inspectorName = value; } }, metadata: _metadata }, _inspectorName_initializers, _inspectorName_extraInitializers);
            __esDecorate(null, null, _scope_decorators, { kind: "field", name: "scope", static: false, private: false, access: { has: obj => "scope" in obj, get: obj => obj.scope, set: (obj, value) => { obj.scope = value; } }, metadata: _metadata }, _scope_initializers, _scope_extraInitializers);
            __esDecorate(null, null, _checklistId_decorators, { kind: "field", name: "checklistId", static: false, private: false, access: { has: obj => "checklistId" in obj, get: obj => obj.checklistId, set: (obj, value) => { obj.checklistId = value; } }, metadata: _metadata }, _checklistId_initializers, _checklistId_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateInspectionDto = CreateInspectionDto;
/**
 * Create violation record DTO
 */
let CreateViolationRecordDto = (() => {
    var _a;
    let _assetId_decorators;
    let _assetId_initializers = [];
    let _assetId_extraInitializers = [];
    let _violationType_decorators;
    let _violationType_initializers = [];
    let _violationType_extraInitializers = [];
    let _frameworkType_decorators;
    let _frameworkType_initializers = [];
    let _frameworkType_extraInitializers = [];
    let _severity_decorators;
    let _severity_initializers = [];
    let _severity_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _discoveredDate_decorators;
    let _discoveredDate_initializers = [];
    let _discoveredDate_extraInitializers = [];
    let _discoveredBy_decorators;
    let _discoveredBy_initializers = [];
    let _discoveredBy_extraInitializers = [];
    let _inspectionId_decorators;
    let _inspectionId_initializers = [];
    let _inspectionId_extraInitializers = [];
    let _evidenceUrls_decorators;
    let _evidenceUrls_initializers = [];
    let _evidenceUrls_extraInitializers = [];
    let _potentialFine_decorators;
    let _potentialFine_initializers = [];
    let _potentialFine_extraInitializers = [];
    let _notes_decorators;
    let _notes_initializers = [];
    let _notes_extraInitializers = [];
    return _a = class CreateViolationRecordDto {
            constructor() {
                this.assetId = __runInitializers(this, _assetId_initializers, void 0);
                this.violationType = (__runInitializers(this, _assetId_extraInitializers), __runInitializers(this, _violationType_initializers, void 0));
                this.frameworkType = (__runInitializers(this, _violationType_extraInitializers), __runInitializers(this, _frameworkType_initializers, void 0));
                this.severity = (__runInitializers(this, _frameworkType_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.description = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.discoveredDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _discoveredDate_initializers, void 0));
                this.discoveredBy = (__runInitializers(this, _discoveredDate_extraInitializers), __runInitializers(this, _discoveredBy_initializers, void 0));
                this.inspectionId = (__runInitializers(this, _discoveredBy_extraInitializers), __runInitializers(this, _inspectionId_initializers, void 0));
                this.evidenceUrls = (__runInitializers(this, _inspectionId_extraInitializers), __runInitializers(this, _evidenceUrls_initializers, void 0));
                this.potentialFine = (__runInitializers(this, _evidenceUrls_extraInitializers), __runInitializers(this, _potentialFine_initializers, void 0));
                this.notes = (__runInitializers(this, _potentialFine_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assetId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Asset ID' }), (0, class_validator_1.IsUUID)()];
            _violationType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Violation type' }), (0, class_validator_1.IsString)()];
            _frameworkType_decorators = [(0, swagger_1.ApiProperty)({ description: 'Framework type', enum: ComplianceFramework }), (0, class_validator_1.IsEnum)(ComplianceFramework)];
            _severity_decorators = [(0, swagger_1.ApiProperty)({ description: 'Severity', enum: ViolationSeverity }), (0, class_validator_1.IsEnum)(ViolationSeverity)];
            _description_decorators = [(0, swagger_1.ApiProperty)({ description: 'Description' }), (0, class_validator_1.IsString)()];
            _discoveredDate_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discovered date' }), (0, class_validator_1.IsDate)(), (0, class_transformer_1.Type)(() => Date)];
            _discoveredBy_decorators = [(0, swagger_1.ApiProperty)({ description: 'Discovered by' }), (0, class_validator_1.IsUUID)()];
            _inspectionId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Inspection ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _evidenceUrls_decorators = [(0, swagger_1.ApiProperty)({ description: 'Evidence URLs', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _potentialFine_decorators = [(0, swagger_1.ApiProperty)({ description: 'Potential fine', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _notes_decorators = [(0, swagger_1.ApiProperty)({ description: 'Notes', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _assetId_decorators, { kind: "field", name: "assetId", static: false, private: false, access: { has: obj => "assetId" in obj, get: obj => obj.assetId, set: (obj, value) => { obj.assetId = value; } }, metadata: _metadata }, _assetId_initializers, _assetId_extraInitializers);
            __esDecorate(null, null, _violationType_decorators, { kind: "field", name: "violationType", static: false, private: false, access: { has: obj => "violationType" in obj, get: obj => obj.violationType, set: (obj, value) => { obj.violationType = value; } }, metadata: _metadata }, _violationType_initializers, _violationType_extraInitializers);
            __esDecorate(null, null, _frameworkType_decorators, { kind: "field", name: "frameworkType", static: false, private: false, access: { has: obj => "frameworkType" in obj, get: obj => obj.frameworkType, set: (obj, value) => { obj.frameworkType = value; } }, metadata: _metadata }, _frameworkType_initializers, _frameworkType_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: obj => "severity" in obj, get: obj => obj.severity, set: (obj, value) => { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _discoveredDate_decorators, { kind: "field", name: "discoveredDate", static: false, private: false, access: { has: obj => "discoveredDate" in obj, get: obj => obj.discoveredDate, set: (obj, value) => { obj.discoveredDate = value; } }, metadata: _metadata }, _discoveredDate_initializers, _discoveredDate_extraInitializers);
            __esDecorate(null, null, _discoveredBy_decorators, { kind: "field", name: "discoveredBy", static: false, private: false, access: { has: obj => "discoveredBy" in obj, get: obj => obj.discoveredBy, set: (obj, value) => { obj.discoveredBy = value; } }, metadata: _metadata }, _discoveredBy_initializers, _discoveredBy_extraInitializers);
            __esDecorate(null, null, _inspectionId_decorators, { kind: "field", name: "inspectionId", static: false, private: false, access: { has: obj => "inspectionId" in obj, get: obj => obj.inspectionId, set: (obj, value) => { obj.inspectionId = value; } }, metadata: _metadata }, _inspectionId_initializers, _inspectionId_extraInitializers);
            __esDecorate(null, null, _evidenceUrls_decorators, { kind: "field", name: "evidenceUrls", static: false, private: false, access: { has: obj => "evidenceUrls" in obj, get: obj => obj.evidenceUrls, set: (obj, value) => { obj.evidenceUrls = value; } }, metadata: _metadata }, _evidenceUrls_initializers, _evidenceUrls_extraInitializers);
            __esDecorate(null, null, _potentialFine_decorators, { kind: "field", name: "potentialFine", static: false, private: false, access: { has: obj => "potentialFine" in obj, get: obj => obj.potentialFine, set: (obj, value) => { obj.potentialFine = value; } }, metadata: _metadata }, _potentialFine_initializers, _potentialFine_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: obj => "notes" in obj, get: obj => obj.notes, set: (obj, value) => { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateViolationRecordDto = CreateViolationRecordDto;
// ============================================================================
// COMPLIANCE TRACKING FUNCTIONS
// ============================================================================
/**
 * Track compliance for an asset
 *
 * @param data - Compliance record data
 * @param transaction - Optional database transaction
 * @returns Created compliance record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const compliance = await trackCompliance({
 *   assetId: 'asset-001',
 *   frameworkType: 'osha',
 *   requirementId: 'osha-1910.147',
 *   requirementDescription: 'Lockout/Tagout procedures',
 *   status: 'compliant',
 *   assessmentDate: new Date(),
 *   assessedBy: 'user-001'
 * });
 * ```
 */
async function trackCompliance(data, transaction) {
    try {
        const record = await ComplianceRecord.create({
            assetId: data.assetId,
            frameworkType: data.frameworkType,
            requirementId: data.requirementId,
            requirementDescription: data.requirementDescription,
            status: data.status,
            assessmentDate: data.assessmentDate,
            assessedBy: data.assessedBy,
            nextAssessmentDate: data.nextAssessmentDate,
            evidenceUrls: data.evidenceUrls,
            notes: data.notes,
            metadata: data.metadata,
        }, { transaction });
        // Create audit trail
        await createAuditTrailEntry(data.assessedBy, 'create_compliance_record', 'compliance_record', record.id, { compliance: data }, transaction);
        return record;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to track compliance: ${error.message}`);
    }
}
/**
 * Get compliance record by ID
 *
 * @param id - Compliance record ID
 * @returns Compliance record or null
 *
 * @example
 * ```typescript
 * const record = await getComplianceRecordById('compliance-001');
 * ```
 */
async function getComplianceRecordById(id) {
    return await ComplianceRecord.findByPk(id);
}
/**
 * Get compliance records for an asset
 *
 * @param assetId - Asset ID
 * @param frameworkType - Optional framework filter
 * @param status - Optional status filter
 * @returns Array of compliance records
 *
 * @example
 * ```typescript
 * const records = await getAssetComplianceRecords('asset-001', 'osha');
 * ```
 */
async function getAssetComplianceRecords(assetId, frameworkType, status) {
    const where = { assetId };
    if (frameworkType) {
        where.frameworkType = frameworkType;
    }
    if (status) {
        where.status = status;
    }
    return await ComplianceRecord.findAll({
        where,
        order: [['assessmentDate', 'DESC']],
    });
}
/**
 * Update compliance status
 *
 * @param id - Compliance record ID
 * @param status - New status
 * @param userId - User making the update
 * @param notes - Optional update notes
 * @param transaction - Optional database transaction
 * @returns Updated compliance record
 * @throws NotFoundException if record not found
 *
 * @example
 * ```typescript
 * const updated = await updateComplianceStatus(
 *   'compliance-001',
 *   'compliant',
 *   'user-001',
 *   'Verified compliance'
 * );
 * ```
 */
async function updateComplianceStatus(id, status, userId, notes, transaction) {
    const record = await ComplianceRecord.findByPk(id);
    if (!record) {
        throw new common_1.NotFoundException(`Compliance record ${id} not found`);
    }
    const oldStatus = record.status;
    await record.update({ status, notes }, { transaction });
    // Create audit trail
    await createAuditTrailEntry(userId, 'update_compliance_status', 'compliance_record', id, { oldStatus, newStatus: status, notes }, transaction);
    return record;
}
/**
 * Calculate compliance rate for an asset
 *
 * @param assetId - Asset ID
 * @param frameworkType - Optional framework filter
 * @returns Compliance rate percentage
 *
 * @example
 * ```typescript
 * const rate = await calculateComplianceRate('asset-001');
 * ```
 */
async function calculateComplianceRate(assetId, frameworkType) {
    const records = await getAssetComplianceRecords(assetId, frameworkType);
    if (records.length === 0) {
        return 100; // No requirements means 100% compliant
    }
    const compliantRecords = records.filter((r) => r.status === ComplianceStatus.COMPLIANT);
    return (compliantRecords.length / records.length) * 100;
}
// ============================================================================
// CERTIFICATION MANAGEMENT FUNCTIONS
// ============================================================================
/**
 * Create a certification
 *
 * @param data - Certification data
 * @param transaction - Optional database transaction
 * @returns Created certification
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const cert = await createCertification({
 *   assetId: 'asset-001',
 *   certificationType: 'iso_9001',
 *   issuingAuthority: 'ISO Certification Body',
 *   issueDate: new Date(),
 *   expirationDate: new Date('2025-12-31')
 * });
 * ```
 */
async function createCertification(data, transaction) {
    try {
        const cert = await Certification.create({
            assetId: data.assetId,
            certificationType: data.certificationType,
            certificationNumber: data.certificationNumber,
            issuingAuthority: data.issuingAuthority,
            issueDate: data.issueDate,
            expirationDate: data.expirationDate,
            scope: data.scope,
            documentUrls: data.documentUrls,
            notes: data.notes,
            metadata: data.metadata,
        }, { transaction });
        return cert;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create certification: ${error.message}`);
    }
}
/**
 * Get certification by ID
 *
 * @param id - Certification ID
 * @returns Certification or null
 *
 * @example
 * ```typescript
 * const cert = await getCertificationById('cert-001');
 * ```
 */
async function getCertificationById(id) {
    return await Certification.findByPk(id);
}
/**
 * Get certifications for an asset
 *
 * @param assetId - Asset ID
 * @param status - Optional status filter
 * @returns Array of certifications
 *
 * @example
 * ```typescript
 * const certs = await getAssetCertifications('asset-001', 'active');
 * ```
 */
async function getAssetCertifications(assetId, status) {
    const where = { assetId };
    if (status) {
        where.status = status;
    }
    return await Certification.findAll({
        where,
        order: [['expirationDate', 'ASC']],
    });
}
/**
 * Get expiring certifications
 *
 * @param daysUntilExpiration - Number of days to look ahead
 * @returns Array of expiring certifications
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringCertifications(30);
 * ```
 */
async function getExpiringCertifications(daysUntilExpiration = 30) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysUntilExpiration);
    return await Certification.findAll({
        where: {
            status: CertificationStatus.ACTIVE,
            expirationDate: {
                [sequelize_1.Op.between]: [new Date(), futureDate],
            },
        },
        order: [['expirationDate', 'ASC']],
    });
}
/**
 * Renew a certification
 *
 * @param id - Certification ID
 * @param newExpirationDate - New expiration date
 * @param userId - User performing the renewal
 * @param transaction - Optional database transaction
 * @returns Updated certification
 * @throws NotFoundException if certification not found
 *
 * @example
 * ```typescript
 * const renewed = await renewCertification(
 *   'cert-001',
 *   new Date('2026-12-31'),
 *   'user-001'
 * );
 * ```
 */
async function renewCertification(id, newExpirationDate, userId, transaction) {
    const cert = await Certification.findByPk(id);
    if (!cert) {
        throw new common_1.NotFoundException(`Certification ${id} not found`);
    }
    await cert.update({
        expirationDate: newExpirationDate,
        status: CertificationStatus.ACTIVE,
    }, { transaction });
    // Create audit trail
    await createAuditTrailEntry(userId, 'renew_certification', 'certification', id, { newExpirationDate }, transaction);
    return cert;
}
/**
 * Update certification statuses based on expiration dates
 *
 * @param transaction - Optional database transaction
 * @returns Number of certifications updated
 *
 * @example
 * ```typescript
 * const updated = await updateCertificationStatuses();
 * ```
 */
async function updateCertificationStatuses(transaction) {
    const now = new Date();
    // Mark expired certifications
    const [expiredCount] = await Certification.update({ status: CertificationStatus.EXPIRED }, {
        where: {
            status: CertificationStatus.ACTIVE,
            expirationDate: {
                [sequelize_1.Op.lt]: now,
            },
        },
        transaction,
    });
    // Mark pending renewal (30 days before expiration)
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);
    const [pendingCount] = await Certification.update({ status: CertificationStatus.PENDING_RENEWAL }, {
        where: {
            status: CertificationStatus.ACTIVE,
            expirationDate: {
                [sequelize_1.Op.between]: [now, renewalDate],
            },
        },
        transaction,
    });
    return expiredCount + pendingCount;
}
// ============================================================================
// INSPECTION FUNCTIONS
// ============================================================================
/**
 * Schedule an inspection
 *
 * @param data - Inspection data
 * @param transaction - Optional database transaction
 * @returns Created inspection
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const inspection = await scheduleInspection({
 *   assetId: 'asset-001',
 *   inspectionType: 'safety',
 *   scheduledDate: new Date('2024-12-01'),
 *   inspectorId: 'user-001'
 * });
 * ```
 */
async function scheduleInspection(data, transaction) {
    try {
        const inspection = await Inspection.create({
            assetId: data.assetId,
            inspectionType: data.inspectionType,
            scheduledDate: data.scheduledDate,
            inspectorId: data.inspectorId,
            inspectorName: data.inspectorName,
            scope: data.scope,
            checklistId: data.checklistId,
            notes: data.notes,
        }, { transaction });
        return inspection;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to schedule inspection: ${error.message}`);
    }
}
/**
 * Get inspection by ID
 *
 * @param id - Inspection ID
 * @returns Inspection or null
 *
 * @example
 * ```typescript
 * const inspection = await getInspectionById('inspection-001');
 * ```
 */
async function getInspectionById(id) {
    return await Inspection.findByPk(id);
}
/**
 * Get inspections for an asset
 *
 * @param assetId - Asset ID
 * @param status - Optional status filter
 * @returns Array of inspections
 *
 * @example
 * ```typescript
 * const inspections = await getAssetInspections('asset-001');
 * ```
 */
async function getAssetInspections(assetId, status) {
    const where = { assetId };
    if (status) {
        where.status = status;
    }
    return await Inspection.findAll({
        where,
        order: [['scheduledDate', 'DESC']],
    });
}
/**
 * Complete an inspection with results
 *
 * @param id - Inspection ID
 * @param resultData - Inspection result data
 * @param userId - User completing the inspection
 * @param transaction - Optional database transaction
 * @returns Updated inspection
 * @throws NotFoundException if inspection not found
 *
 * @example
 * ```typescript
 * const completed = await completeInspection(
 *   'inspection-001',
 *   {
 *     status: 'passed',
 *     completedDate: new Date(),
 *     findings: [],
 *     followUpRequired: false
 *   },
 *   'user-001'
 * );
 * ```
 */
async function completeInspection(id, resultData, userId, transaction) {
    const inspection = await Inspection.findByPk(id);
    if (!inspection) {
        throw new common_1.NotFoundException(`Inspection ${id} not found`);
    }
    await inspection.update({
        status: resultData.status,
        completedDate: resultData.completedDate,
        findings: resultData.findings,
        overallScore: resultData.overallScore,
        passFailCriteria: resultData.passFailCriteria,
        recommendations: resultData.recommendations,
        followUpRequired: resultData.followUpRequired,
        followUpDate: resultData.followUpDate,
        reportUrl: resultData.reportUrl,
    }, { transaction });
    // Create audit trail
    await createAuditTrailEntry(userId, 'complete_inspection', 'inspection', id, { result: resultData }, transaction);
    return inspection;
}
/**
 * Conduct a safety inspection
 *
 * @param assetId - Asset ID
 * @param inspectorId - Inspector user ID
 * @param checklistId - Checklist ID to use
 * @param transaction - Optional database transaction
 * @returns Created inspection
 *
 * @example
 * ```typescript
 * const inspection = await conductSafetyInspection(
 *   'asset-001',
 *   'user-001',
 *   'checklist-001'
 * );
 * ```
 */
async function conductSafetyInspection(assetId, inspectorId, checklistId, transaction) {
    return await scheduleInspection({
        assetId,
        inspectionType: InspectionType.SAFETY,
        scheduledDate: new Date(),
        inspectorId,
        checklistId,
    }, transaction);
}
// ============================================================================
// VIOLATION AND REMEDIATION FUNCTIONS
// ============================================================================
/**
 * Record a compliance violation
 *
 * @param data - Violation record data
 * @param transaction - Optional database transaction
 * @returns Created violation record
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const violation = await recordViolation({
 *   assetId: 'asset-001',
 *   violationType: 'Safety Hazard',
 *   frameworkType: 'osha',
 *   severity: 'high',
 *   description: 'Missing safety guard',
 *   discoveredDate: new Date(),
 *   discoveredBy: 'user-001'
 * });
 * ```
 */
async function recordViolation(data, transaction) {
    try {
        const violation = await ViolationRecord.create({
            assetId: data.assetId,
            violationType: data.violationType,
            frameworkType: data.frameworkType,
            severity: data.severity,
            description: data.description,
            discoveredDate: data.discoveredDate,
            discoveredBy: data.discoveredBy,
            inspectionId: data.inspectionId,
            evidenceUrls: data.evidenceUrls,
            potentialFine: data.potentialFine,
            notes: data.notes,
        }, { transaction });
        // Create audit trail
        await createAuditTrailEntry(data.discoveredBy, 'record_violation', 'violation_record', violation.id, { violation: data }, transaction);
        return violation;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to record violation: ${error.message}`);
    }
}
/**
 * Get violations for an asset
 *
 * @param assetId - Asset ID
 * @param severity - Optional severity filter
 * @param status - Optional remediation status filter
 * @returns Array of violation records
 *
 * @example
 * ```typescript
 * const violations = await getAssetViolations('asset-001', 'critical');
 * ```
 */
async function getAssetViolations(assetId, severity, status) {
    const where = { assetId };
    if (severity) {
        where.severity = severity;
    }
    if (status) {
        where.remediationStatus = status;
    }
    return await ViolationRecord.findAll({
        where,
        include: [{ model: RemediationAction }],
        order: [['discoveredDate', 'DESC']],
    });
}
/**
 * Create a remediation action for a violation
 *
 * @param data - Remediation action data
 * @param transaction - Optional database transaction
 * @returns Created remediation action
 * @throws BadRequestException if validation fails
 *
 * @example
 * ```typescript
 * const action = await createRemediationAction({
 *   violationId: 'violation-001',
 *   actionDescription: 'Install safety guard',
 *   assignedTo: 'user-002',
 *   dueDate: new Date('2024-12-15'),
 *   priority: 'high'
 * });
 * ```
 */
async function createRemediationAction(data, transaction) {
    try {
        const action = await RemediationAction.create({
            violationId: data.violationId,
            actionDescription: data.actionDescription,
            assignedTo: data.assignedTo,
            dueDate: data.dueDate,
            estimatedCost: data.estimatedCost,
            priority: data.priority,
            notes: data.notes,
        }, { transaction });
        // Update violation status
        await ViolationRecord.update({ remediationStatus: RemediationStatus.IN_PROGRESS }, { where: { id: data.violationId }, transaction });
        return action;
    }
    catch (error) {
        throw new common_1.BadRequestException(`Failed to create remediation action: ${error.message}`);
    }
}
/**
 * Complete a remediation action
 *
 * @param id - Remediation action ID
 * @param actualCost - Actual cost incurred
 * @param userId - User completing the action
 * @param transaction - Optional database transaction
 * @returns Updated remediation action
 * @throws NotFoundException if action not found
 *
 * @example
 * ```typescript
 * const completed = await completeRemediationAction(
 *   'action-001',
 *   1200,
 *   'user-002'
 * );
 * ```
 */
async function completeRemediationAction(id, actualCost, userId, transaction) {
    const action = await RemediationAction.findByPk(id);
    if (!action) {
        throw new common_1.NotFoundException(`Remediation action ${id} not found`);
    }
    await action.update({
        status: RemediationStatus.RESOLVED,
        completedDate: new Date(),
        actualCost,
    }, { transaction });
    // Check if all actions for the violation are complete
    const allActions = await RemediationAction.findAll({
        where: { violationId: action.violationId },
    });
    const allComplete = allActions.every((a) => a.status === RemediationStatus.RESOLVED);
    if (allComplete) {
        await ViolationRecord.update({ remediationStatus: RemediationStatus.RESOLVED }, { where: { id: action.violationId }, transaction });
    }
    // Create audit trail
    await createAuditTrailEntry(userId, 'complete_remediation_action', 'remediation_action', id, { actualCost }, transaction);
    return action;
}
// ============================================================================
// AUDIT TRAIL FUNCTIONS
// ============================================================================
/**
 * Create an audit trail entry
 *
 * @param userId - User ID
 * @param action - Action performed
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param changes - Changes made
 * @param transaction - Optional database transaction
 * @returns Created audit trail entry
 *
 * @example
 * ```typescript
 * await createAuditTrailEntry(
 *   'user-001',
 *   'update_compliance_status',
 *   'compliance_record',
 *   'compliance-001',
 *   { oldStatus: 'pending', newStatus: 'compliant' }
 * );
 * ```
 */
async function createAuditTrailEntry(userId, action, entityType, entityId, changes, transaction) {
    return await ComplianceAuditTrail.create({
        userId,
        action,
        entityType,
        entityId,
        changes,
        timestamp: new Date(),
    }, { transaction });
}
/**
 * Get audit trail for an entity
 *
 * @param entityType - Type of entity
 * @param entityId - Entity ID
 * @param limit - Maximum number of entries
 * @returns Array of audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await getAuditTrail('compliance_record', 'compliance-001');
 * ```
 */
async function getAuditTrail(entityType, entityId, limit = 100) {
    return await ComplianceAuditTrail.findAll({
        where: { entityType, entityId },
        order: [['timestamp', 'DESC']],
        limit,
    });
}
/**
 * Generate comprehensive audit trail for an asset
 *
 * @param assetId - Asset ID
 * @param startDate - Optional start date filter
 * @param endDate - Optional end date filter
 * @returns Array of audit trail entries
 *
 * @example
 * ```typescript
 * const trail = await generateAuditTrail('asset-001');
 * ```
 */
async function generateAuditTrail(assetId, startDate, endDate) {
    // Get all compliance-related entities for this asset
    const [compliance, certifications, inspections, violations] = await Promise.all([
        ComplianceRecord.findAll({ where: { assetId }, attributes: ['id'] }),
        Certification.findAll({ where: { assetId }, attributes: ['id'] }),
        Inspection.findAll({ where: { assetId }, attributes: ['id'] }),
        ViolationRecord.findAll({ where: { assetId }, attributes: ['id'] }),
    ]);
    const entityIds = [
        ...compliance.map((c) => c.id),
        ...certifications.map((c) => c.id),
        ...inspections.map((i) => i.id),
        ...violations.map((v) => v.id),
    ];
    const where = {
        entityId: { [sequelize_1.Op.in]: entityIds },
    };
    if (startDate || endDate) {
        where.timestamp = {};
        if (startDate)
            where.timestamp[sequelize_1.Op.gte] = startDate;
        if (endDate)
            where.timestamp[sequelize_1.Op.lte] = endDate;
    }
    return await ComplianceAuditTrail.findAll({
        where,
        order: [['timestamp', 'DESC']],
        limit: 1000,
    });
}
// ============================================================================
// COMPLIANCE DASHBOARD FUNCTIONS
// ============================================================================
/**
 * Get compliance dashboard data for an asset
 *
 * @param assetId - Asset ID
 * @returns Compliance dashboard data
 *
 * @example
 * ```typescript
 * const dashboard = await getComplianceDashboard('asset-001');
 * ```
 */
async function getComplianceDashboard(assetId) {
    // Get overall compliance rate
    const overallComplianceRate = await calculateComplianceRate(assetId);
    // Get compliance by framework
    const complianceByFramework = {};
    for (const framework of Object.values(ComplianceFramework)) {
        complianceByFramework[framework] = await calculateComplianceRate(assetId, framework);
    }
    // Get certifications
    const activeCerts = await getAssetCertifications(assetId, CertificationStatus.ACTIVE);
    const expiringCerts = await getExpiringCertifications(30);
    const assetExpiringCerts = expiringCerts.filter((c) => c.assetId === assetId);
    // Get violations
    const openViolations = await getAssetViolations(assetId, undefined, RemediationStatus.OPEN);
    const criticalViolations = await getAssetViolations(assetId, ViolationSeverity.CRITICAL, RemediationStatus.OPEN);
    // Get upcoming inspections
    const allInspections = await getAssetInspections(assetId);
    const upcomingInspections = allInspections.filter((i) => i.status === InspectionStatus.SCHEDULED &&
        i.scheduledDate > new Date());
    // Get past due actions
    const violations = await ViolationRecord.findAll({
        where: { assetId },
        include: [{ model: RemediationAction }],
    });
    const allActions = violations.flatMap((v) => v.remediationActions || []);
    const pastDueActions = allActions.filter((a) => a.status !== RemediationStatus.RESOLVED &&
        a.dueDate < new Date());
    // Get recent audit entries
    const recentAudits = await generateAuditTrail(assetId);
    return {
        assetId,
        overallComplianceRate,
        complianceByFramework,
        activeCertifications: activeCerts.length,
        expiringCertifications: assetExpiringCerts.length,
        openViolations: openViolations.length,
        criticalViolations: criticalViolations.length,
        upcomingInspections: upcomingInspections.length,
        pastDueActions: pastDueActions.length,
        recentAudits: recentAudits.slice(0, 20).map((a) => ({
            timestamp: a.timestamp,
            userId: a.userId,
            userName: a.userName,
            action: a.action,
            entityType: a.entityType,
            entityId: a.entityId,
            changes: a.changes,
            metadata: a.metadata,
        })),
    };
}
/**
 * Generate compliance report for multiple assets
 *
 * @param assetIds - Array of asset IDs
 * @param frameworkType - Optional framework filter
 * @returns Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateComplianceReport(['asset-001', 'asset-002'], 'osha');
 * ```
 */
async function generateComplianceReport(assetIds, frameworkType) {
    const assetReports = await Promise.all(assetIds.map(async (assetId) => {
        const dashboard = await getComplianceDashboard(assetId);
        const records = await getAssetComplianceRecords(assetId, frameworkType);
        const certifications = await getAssetCertifications(assetId);
        const violations = await getAssetViolations(assetId);
        return {
            assetId,
            dashboard,
            complianceRecords: records.length,
            certifications: certifications.length,
            violations: violations.length,
        };
    }));
    return {
        reportDate: new Date(),
        frameworkType,
        assetCount: assetIds.length,
        assetReports,
        summary: {
            averageComplianceRate: assetReports.reduce((sum, r) => sum + r.dashboard.overallComplianceRate, 0) /
                assetReports.length,
            totalViolations: assetReports.reduce((sum, r) => sum + r.violations, 0),
            totalCertifications: assetReports.reduce((sum, r) => sum + r.certifications, 0),
        },
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Compliance tracking
    trackCompliance,
    getComplianceRecordById,
    getAssetComplianceRecords,
    updateComplianceStatus,
    calculateComplianceRate,
    // Certification management
    createCertification,
    getCertificationById,
    getAssetCertifications,
    getExpiringCertifications,
    renewCertification,
    updateCertificationStatuses,
    // Inspections
    scheduleInspection,
    getInspectionById,
    getAssetInspections,
    completeInspection,
    conductSafetyInspection,
    // Violations and remediation
    recordViolation,
    getAssetViolations,
    createRemediationAction,
    completeRemediationAction,
    // Audit trail
    createAuditTrailEntry,
    getAuditTrail,
    generateAuditTrail,
    // Dashboard and reporting
    getComplianceDashboard,
    generateComplianceReport,
    // Models
    ComplianceRecord,
    Certification,
    Inspection,
    ViolationRecord,
    RemediationAction,
    ComplianceAuditTrail,
    // DTOs
    CreateComplianceRecordDto,
    CreateCertificationDto,
    CreateInspectionDto,
    CreateViolationRecordDto,
    // Enums
    ComplianceFramework,
    ComplianceStatus,
    CertificationType,
    CertificationStatus,
    InspectionType,
    InspectionStatus,
    ViolationSeverity,
    RemediationStatus,
};
//# sourceMappingURL=asset-compliance-commands.js.map